import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generatePresignedUploadUrl, deleteFromR2 } from "../server/r2.server";

/**
 * Server function to generate a presigned PUT URL and clean key path for Cloudflare R2 uploads.
 */
export const getPresignedUrlFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      fileName: z.string().min(1),
      contentType: z.string().min(1),
      folder: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    try {
      console.log(`[R2 Server Function] Requesting upload URL for: ${data.fileName}`);
      const result = await generatePresignedUploadUrl(data.fileName, data.contentType, data.folder);
      return { success: true, ...result };
    } catch (error: unknown) {
      console.error("[R2 Server Function] Failed to generate presigned URL:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      return { success: false, error: message };
    }
  });

/**
 * Server function to delete a file from Cloudflare R2 given its public URL.
 */
export const deleteR2FileFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      url: z.string().url(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const publicUrlPrefix = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";
      if (!publicUrlPrefix) {
        throw new Error("CLOUDFLARE_R2_PUBLIC_URL environment variable is not set");
      }

      // Standardize trailing slash on prefix
      const normalizedPrefix = publicUrlPrefix.endsWith("/")
        ? publicUrlPrefix
        : `${publicUrlPrefix}/`;

      if (data.url.startsWith(normalizedPrefix)) {
        const key = data.url.replace(normalizedPrefix, "");
        console.log(`[R2 Server Function] Requesting deletion of key: ${key}`);
        await deleteFromR2(key);
        return { success: true };
      }

      console.warn(`[R2 Server Function] Skipped deletion: URL is not stored in R2 (${data.url})`);
      return { success: false, reason: "URL does not match Cloudflare R2 prefix" };
    } catch (error: unknown) {
      console.error("[R2 Server Function] Failed to delete file:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      return { success: false, error: message };
    }
  });

/**
 * Server function to handle file uploading, background FFmpeg processing,
 * metadata extraction, poster generation, and direct Cloudflare R2 uploads.
 * Returns a text/event-stream of JSON progress lines.
 */
export const uploadVideoFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid request: Expected FormData");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const file = data.get("file") as File;
    const folder = (data.get("folder") as string) || "portfolio";

    if (!file) {
      throw new Error("No file uploaded");
    }

    const { uploadLocalFileToR2 } = await import("../server/r2.server");
    const { promises: fs } = await import("node:fs");
    const { spawn } = await import("node:child_process");
    const os = await import("node:os");
    const path = await import("node:path");

    const ffmpegInstaller = (await import("@ffmpeg-installer/ffmpeg")).default;
    const ffprobeInstaller = (await import("@ffprobe-installer/ffprobe")).default;
    const ffmpegPath = ffmpegInstaller.path;
    const ffprobePath = ffprobeInstaller.path;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendProgress = (status: string, percent: number, dataPayload?: unknown) => {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ status, percent, ...(dataPayload ? { data: dataPayload } : {}) })}\n\n`,
            ),
          );
        };

        const tempFiles: string[] = [];

        try {
          const uuid = Math.random().toString(36).substring(2, 15) + "_" + Date.now();
          const fileExt = file.name.split(".").pop() || "mp4";
          const tempDir = os.tmpdir();

          const inputPath = path.join(tempDir, `input-${uuid}.${fileExt}`);
          const outputPath = path.join(tempDir, `opt-${uuid}.mp4`);
          const thumbPath = path.join(tempDir, `thumb-${uuid}.jpg`);

          tempFiles.push(inputPath, outputPath, thumbPath);

          // 1. Save original video file to server disk
          sendProgress("Uploading", 100);
          const arrayBuffer = await file.arrayBuffer();
          await fs.writeFile(inputPath, Buffer.from(arrayBuffer));

          // 2. Extract original video metadata via ffprobe
          let duration = 0;
          let resolution = "1920x1080";
          let videoWidth = 1920;
          let videoHeight = 1080;

          try {
            const ffprobeResult = await new Promise<string>((resolve, reject) => {
              const ffprobe = spawn(ffprobePath, [
                "-v",
                "error",
                "-select_streams",
                "v:0",
                "-show_entries",
                "stream=width,height,duration",
                "-of",
                "json",
                inputPath,
              ]);

              let stdout = "";
              let stderr = "";
              ffprobe.stdout.on("data", (chunk) => {
                stdout += chunk;
              });
              ffprobe.stderr.on("data", (chunk) => {
                stderr += chunk;
              });
              ffprobe.on("close", (code) => {
                if (code === 0) resolve(stdout);
                else reject(new Error(`ffprobe failed with code ${code}: ${stderr}`));
              });
            });

            const parsed = JSON.parse(ffprobeResult);
            if (parsed.streams && parsed.streams[0]) {
              const streamObj = parsed.streams[0];
              videoWidth = streamObj.width || videoWidth;
              videoHeight = streamObj.height || videoHeight;
              resolution = `${videoWidth}x${videoHeight}`;
              duration = parseFloat(streamObj.duration) || duration;
            }
          } catch (probeErr) {
            console.error("FFprobe failed, using defaults:", probeErr);
          }

          // 3. Compress & optimize video using ffmpeg
          sendProgress("Compressing", 0);
          await new Promise<void>((resolve, reject) => {
            const ffmpeg = spawn(ffmpegPath, [
              "-y",
              "-i",
              inputPath,
              "-c:v",
              "libx264",
              "-preset",
              "medium",
              "-crf",
              "23",
              "-pix_fmt",
              "yuv420p",
              "-movflags",
              "+faststart",
              "-c:a",
              "aac",
              "-b:a",
              "128k",
              outputPath,
            ]);

            ffmpeg.stderr.on("data", (chunk) => {
              const log = chunk.toString();
              const timeMatch = log.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
              if (timeMatch && duration > 0) {
                const hours = parseInt(timeMatch[1]);
                const minutes = parseInt(timeMatch[2]);
                const seconds = parseInt(timeMatch[3]);
                const parsedTime = hours * 3600 + minutes * 60 + seconds;
                const percent = Math.min(Math.round((parsedTime / duration) * 100), 99);
                sendProgress("Compressing", percent);
              }
            });

            ffmpeg.on("close", (code) => {
              if (code === 0) {
                sendProgress("Compressing", 100);
                resolve();
              } else {
                reject(new Error(`FFmpeg compression failed with exit code ${code}`));
              }
            });
          });

          // 4. Generate Poster Thumbnail
          sendProgress("Generating Thumbnail", 0);
          await new Promise<void>((resolve, reject) => {
            const ffmpeg = spawn(ffmpegPath, [
              "-y",
              "-ss",
              "00:00:00.5",
              "-i",
              inputPath,
              "-frames:v",
              "1",
              "-q:v",
              "2",
              thumbPath,
            ]);

            ffmpeg.on("close", (code) => {
              if (code === 0) {
                sendProgress("Generating Thumbnail", 100);
                resolve();
              } else {
                // Fallback to 0.0s if seek 0.5s failed
                const ffmpegFallback = spawn(ffmpegPath, [
                  "-y",
                  "-ss",
                  "00:00:00.0",
                  "-i",
                  inputPath,
                  "-frames:v",
                  "1",
                  "-q:v",
                  "2",
                  thumbPath,
                ]);
                ffmpegFallback.on("close", (fallbackCode) => {
                  if (fallbackCode === 0) {
                    sendProgress("Generating Thumbnail", 100);
                    resolve();
                  } else {
                    reject(new Error(`FFmpeg thumbnail generation failed`));
                  }
                });
              }
            });
          });

          // 5. Upload optimized video and thumbnail to R2
          sendProgress("Uploading Optimized Video", 0);

          const videoKey = `videos/optimized/video-${uuid}.mp4`;
          const thumbKey = `videos/thumbnails/thumb-${uuid}.jpg`;

          const videoUrl = await uploadLocalFileToR2(outputPath, videoKey, "video/mp4");
          sendProgress("Uploading Optimized Video", 50);

          const thumbnailUrl = await uploadLocalFileToR2(thumbPath, thumbKey, "image/jpeg");
          sendProgress("Uploading Optimized Video", 100);

          // Get optimized file size
          const stats = await fs.stat(outputPath);
          const fileSize = stats.size;

          // 6. Complete and return details
          sendProgress("Completed", 100, {
            videoUrl,
            thumbnailUrl,
            duration,
            resolution,
            fileSize,
          });

          controller.close();
        } catch (err: unknown) {
          console.error("Video processing pipeline failed:", err);
          const message = err instanceof Error ? err.message : String(err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ status: "Failed", error: message })}\n\n`),
          );
          controller.close();
        } finally {
          // Cleanup temp files
          for (const tempPath of tempFiles) {
            try {
              await fs.unlink(tempPath);
            } catch (unlinkErr) {
              // ignore
            }
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  });
