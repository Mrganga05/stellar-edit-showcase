import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { parse } from "node:path";

/**
 * Universal Cloudflare R2 environment variable lookup.
 * Safely resolves environment variables across Node.js, Vite SSR, Vercel Serverless Functions, and local dev.
 * Handles aliases (CLOUDFLARE_ACCOUNT_ID vs CLOUDFLARE_R2_ACCOUNT_ID) and VITE_ prefixes automatically.
 */
function getR2Env(key: string): string | undefined {
  if (typeof process === "undefined" || !process.env) {
    return undefined;
  }

  // 1. Direct process.env lookup
  const directVal = process.env[key];
  if (directVal && directVal.trim() !== "") return directVal.trim();

  // 2. VITE_ prefix lookup
  const viteVal = process.env[`VITE_${key}`];
  if (viteVal && viteVal.trim() !== "") return viteVal.trim();

  // 3. Known aliases for Cloudflare R2 environment variables
  const ALIAS_MAP: Record<string, string[]> = {
    CLOUDFLARE_ACCOUNT_ID: [
      "CLOUDFLARE_R2_ACCOUNT_ID",
      "VITE_CLOUDFLARE_ACCOUNT_ID",
      "VITE_CLOUDFLARE_R2_ACCOUNT_ID",
      "ACCOUNT_ID",
    ],
    CLOUDFLARE_R2_ACCOUNT_ID: [
      "CLOUDFLARE_ACCOUNT_ID",
      "VITE_CLOUDFLARE_R2_ACCOUNT_ID",
      "VITE_CLOUDFLARE_ACCOUNT_ID",
      "ACCOUNT_ID",
    ],
    CLOUDFLARE_R2_ACCESS_KEY_ID: [
      "CLOUDFLARE_ACCESS_KEY_ID",
      "VITE_CLOUDFLARE_R2_ACCESS_KEY_ID",
      "VITE_CLOUDFLARE_ACCESS_KEY_ID",
      "R2_ACCESS_KEY_ID",
    ],
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: [
      "CLOUDFLARE_SECRET_ACCESS_KEY",
      "VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY",
      "VITE_CLOUDFLARE_SECRET_ACCESS_KEY",
      "R2_SECRET_ACCESS_KEY",
    ],
    CLOUDFLARE_R2_BUCKET_NAME: [
      "CLOUDFLARE_BUCKET_NAME",
      "VITE_CLOUDFLARE_R2_BUCKET_NAME",
      "VITE_CLOUDFLARE_BUCKET_NAME",
      "R2_BUCKET_NAME",
      "BUCKET_NAME",
    ],
    CLOUDFLARE_R2_PUBLIC_URL: [
      "CLOUDFLARE_PUBLIC_URL",
      "VITE_CLOUDFLARE_R2_PUBLIC_URL",
      "VITE_CLOUDFLARE_PUBLIC_URL",
      "R2_PUBLIC_URL",
      "PUBLIC_URL",
    ],
  };

  const aliases = ALIAS_MAP[key] || [];
  for (const alias of aliases) {
    const aliasVal = process.env[alias];
    if (aliasVal && aliasVal.trim() !== "") return aliasVal.trim();
  }

  // 4. Local dev fallback: process.loadEnvFile if available
  try {
    if (typeof process.loadEnvFile === "function") {
      process.loadEnvFile();
      const recheck = process.env[key] || process.env[`VITE_${key}`];
      if (recheck && recheck.trim() !== "") return recheck.trim();

      for (const alias of aliases) {
        const aliasVal = process.env[alias];
        if (aliasVal && aliasVal.trim() !== "") return aliasVal.trim();
      }
    }
  } catch {
    // Ignore error if .env file is missing (e.g. in Vercel production)
  }

  return undefined;
}

/**
 * Validates and retrieves all required Cloudflare R2 credentials from the server environment.
 * Throws a clear, descriptive Error if any required variable is missing.
 */
export function getR2Config() {
  const accountId = getR2Env("CLOUDFLARE_ACCOUNT_ID");
  const accessKeyId = getR2Env("CLOUDFLARE_R2_ACCESS_KEY_ID");
  const secretAccessKey = getR2Env("CLOUDFLARE_R2_SECRET_ACCESS_KEY");
  const bucketName = getR2Env("CLOUDFLARE_R2_BUCKET_NAME");
  const publicUrl = getR2Env("CLOUDFLARE_R2_PUBLIC_URL");

  const missing: string[] = [];
  if (!accountId) missing.push("CLOUDFLARE_ACCOUNT_ID (or CLOUDFLARE_R2_ACCOUNT_ID)");
  if (!accessKeyId) missing.push("CLOUDFLARE_R2_ACCESS_KEY_ID");
  if (!secretAccessKey) missing.push("CLOUDFLARE_R2_SECRET_ACCESS_KEY");
  if (!bucketName) missing.push("CLOUDFLARE_R2_BUCKET_NAME");
  if (!publicUrl) missing.push("CLOUDFLARE_R2_PUBLIC_URL");

  if (missing.length > 0) {
    const errorMsg = `Cloudflare R2 Configuration Error: Missing environment variable(s): ${missing.join(
      ", ",
    )}. Please configure these variables in Vercel Environment Variables or your server environment.`;
    console.error(`[R2 Server Audit] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  return {
    accountId: accountId!,
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
    bucketName: bucketName!,
    publicUrl: publicUrl!,
  };
}

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const config = getR2Config();

    s3Client = new S3Client({
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: "auto",
    });
  }
  return s3Client;
}

/**
 * Generates a unique, sanitized filename and a 5-minute presigned PUT URL for Cloudflare R2.
 * Strictly confines files inside videos/ folder and prevents path traversal attacks.
 */
export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string,
  folder: string = "videos",
) {
  const config = getR2Config();

  // 1. Path traversal defense & filename sanitization
  const { name, ext } = parse(fileName);
  const cleanBaseName = name.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
  const fileExt = ext ? (ext.startsWith(".") ? ext : `.${ext}`) : ".mp4";
  const uuid = crypto.randomUUID();
  const uniqueFilename = `${cleanBaseName || "video"}-${uuid}-${Date.now()}${fileExt}`;

  // 2. Strict folder confinement inside videos/
  const sanitizedFolder = folder
    .replace(/\.\./g, "")
    .replace(/^\/+/, "")
    .replace(/[^a-zA-Z0-9_\-\/]/g, "");

  const safePath = sanitizedFolder
    ? sanitizedFolder.startsWith("videos")
      ? sanitizedFolder
      : `videos/${sanitizedFolder}`
    : "videos";

  const key = `${safePath}/${uniqueFilename}`;

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
    Metadata: {
      "original-filename": encodeURIComponent(fileName),
      "upload-timestamp": String(Date.now()),
    },
  });

  // 3. Presigned URL expires in exactly 5 minutes (300 seconds)
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });

  // 4. Format custom media domain public URL
  const normalizedPrefix = config.publicUrl.endsWith("/")
    ? config.publicUrl.slice(0, -1)
    : config.publicUrl;
  const publicUrl = `${normalizedPrefix}/${key}`;

  console.log(`[R2 Server] Generated 5-min presigned upload URL for key: ${key}`);

  return {
    uploadUrl,
    publicUrl,
    key,
    originalName: fileName,
  };
}

/**
 * Uploads a raw or re-encoded Buffer directly to Cloudflare R2 with explicit cache control headers.
 */
export async function uploadBufferToR2(
  buffer: Buffer,
  fileName: string,
  contentType: string = "video/mp4",
  folder: string = "videos",
) {
  const config = getR2Config();

  const { name, ext } = parse(fileName);
  const cleanBaseName = name.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
  const fileExt = ext ? (ext.startsWith(".") ? ext : `.${ext}`) : ".mp4";
  const uuid = crypto.randomUUID();
  const uniqueFilename = `${cleanBaseName || "video"}-${uuid}-${Date.now()}${fileExt}`;

  const sanitizedFolder = folder
    .replace(/\.\./g, "")
    .replace(/^\/+/, "")
    .replace(/[^a-zA-Z0-9_\-\/]/g, "");

  const safePath = sanitizedFolder
    ? sanitizedFolder.startsWith("videos")
      ? sanitizedFolder
      : `videos/${sanitizedFolder}`
    : "videos";

  const key = `${safePath}/${uniqueFilename}`;

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
    Metadata: {
      "original-filename": encodeURIComponent(fileName),
      "upload-timestamp": String(Date.now()),
    },
  });

  await client.send(command);

  const normalizedPrefix = config.publicUrl.endsWith("/")
    ? config.publicUrl.slice(0, -1)
    : config.publicUrl;
  const publicUrl = `${normalizedPrefix}/${key}`;

  console.log(`[R2 Server] Successfully uploaded object to R2: ${key}`);

  return {
    publicUrl,
    key,
    originalName: fileName,
  };
}

/**
 * Server-side re-encodes a video file buffer using ffmpeg with constraints:
 * - H.264 video codec
 * - CRF ~20 (visually near-lossless 1080p60)
 * - maxrate 10M, bufsize 20M
 * - AAC audio 192k
 * - -movflags +faststart (moves moov atom to start of file for instant playback)
 */
export async function reencodeVideoServer(
  inputBuffer: Buffer,
  originalFilename: string,
): Promise<Buffer> {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const { readFile, writeFile, unlink, mkdir } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");

  const execFileAsync = promisify(execFile);
  const tempDir = join(tmpdir(), "raqvine-ffmpeg-" + Date.now());
  await mkdir(tempDir, { recursive: true });

  const inputExt = parse(originalFilename).ext || ".mp4";
  const inputPath = join(tempDir, `input-${Date.now()}${inputExt}`);
  const outputPath = join(tempDir, `output-${Date.now()}.mp4`);

  try {
    await writeFile(inputPath, inputBuffer);

    // Locate ffmpeg binary (ffmpeg-static or system ffmpeg)
    let ffmpegExec = "ffmpeg";
    try {
      const ffmpegStaticModule = await import("ffmpeg-static");
      const staticPath = ffmpegStaticModule.default || ffmpegStaticModule;
      if (staticPath && typeof staticPath === "string") {
        ffmpegExec = staticPath;
      }
    } catch {
      // Fall back to system ffmpeg binary
    }

    const ffmpegArgs = [
      "-i",
      inputPath,
      "-c:v",
      "libx264",
      "-crf",
      "20",
      "-maxrate",
      "10M",
      "-bufsize",
      "20M",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-movflags",
      "+faststart",
      "-y",
      outputPath,
    ];

    console.log(`[FFmpeg Server] Executing re-encode: ${ffmpegExec} ${ffmpegArgs.join(" ")}`);
    await execFileAsync(ffmpegExec, ffmpegArgs);

    const encodedBuffer = await readFile(outputPath);
    console.log(
      `[FFmpeg Server] Re-encode successful: ${originalFilename} (${inputBuffer.length} bytes -> ${encodedBuffer.length} bytes with faststart)`,
    );
    return encodedBuffer;
  } catch (error) {
    console.error(
      "[FFmpeg Server Warning] Re-encode failed or ffmpeg not found, using original buffer:",
      error,
    );
    return inputBuffer;
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}

/**
 * Deletes an object from Cloudflare R2 by its key.
 */
export async function deleteFromR2(key: string) {
  const config = getR2Config();
  const cleanKey = key.replace(/\.\./g, "").replace(/^\/+/, "");

  const client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: config.bucketName,
    Key: cleanKey,
  });

  await client.send(command);
  console.log(`[R2 Server] Successfully deleted key from storage: ${cleanKey}`);
}

