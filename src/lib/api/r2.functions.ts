import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generatePresignedUploadUrl, deleteFromR2 } from "../server/r2.server";

// Allowed video MIME types and file extensions for production security
const ALLOWED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  "video/avi",
  "video/mkv",
];

const ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".mkv", ".avi"];

/**
 * Server function to generate a temporary presigned PUT URL for direct browser-to-R2 uploads.
 * Enforces production security:
 * 1. Server-side Content-Type & Extension validation
 * 2. Maximum file size check (MAX_UPLOAD_SIZE_MB)
 * 3. Filename sanitization & path traversal containment
 * 4. 5-minute presigned URL expiration
 */
export const getPresignedUrlFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      fileName: z.string().min(1, "Filename is required"),
      contentType: z.string().min(1, "Content type is required"),
      fileSize: z.number().positive("File size must be positive"),
      folder: z.string().optional().default("videos"),
    }),
  )
  .handler(async ({ data }) => {
    try {
      console.log(
        `[R2 Security Check] Presigned URL request: ${data.fileName} (${data.contentType}, ${data.fileSize} bytes)`,
      );

      // 1. Validate MIME type
      const normalizedMime = data.contentType.toLowerCase().trim();
      if (!ALLOWED_VIDEO_MIME_TYPES.includes(normalizedMime)) {
        throw new Error(
          `Invalid media type (${data.contentType}). Allowed video formats: MP4, MOV, WEBM, MKV, AVI.`,
        );
      }

      // 2. Validate file extension
      const fileExt = "." + data.fileName.split(".").pop()?.toLowerCase();
      if (!ALLOWED_VIDEO_EXTENSIONS.includes(fileExt)) {
        throw new Error(
          `Invalid file extension (${fileExt}). Allowed extensions: .mp4, .mov, .webm, .mkv, .avi`,
        );
      }

      // 3. Validate maximum upload size
      const maxMbEnv =
        process.env.MAX_UPLOAD_SIZE_MB || process.env.VITE_MAX_UPLOAD_SIZE_MB || "2000";
      const maxSizeBytes = parseInt(maxMbEnv, 10) * 1024 * 1024;
      if (data.fileSize > maxSizeBytes) {
        throw new Error(
          `File size exceeds maximum limit of ${maxMbEnv} MB. File is ${(data.fileSize / (1024 * 1024)).toFixed(1)} MB.`,
        );
      }

      // 4. Generate presigned URL (confines files inside videos/ with 5-minute expiration)
      const result = await generatePresignedUploadUrl(
        data.fileName,
        data.contentType,
        data.folder || "videos",
      );

      return {
        success: true,
        uploadUrl: result.uploadUrl,
        objectKey: result.key,
        publicUrl: result.publicUrl,
        originalName: result.originalName,
      };
    } catch (error: unknown) {
      console.error("[R2 Security Error] Presigned URL generation denied:", error);
      const message =
        error instanceof Error ? error.message : "An unexpected server error occurred";
      return { success: false, error: message };
    }
  });

/**
 * Server function to delete a file from Cloudflare R2 given its public URL or object key.
 */
export const deleteR2FileFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      url: z.string().min(1, "URL or key is required"),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const publicUrlPrefix =
        process.env.CLOUDFLARE_R2_PUBLIC_URL || "https://media.raqvine.com";

      const normalizedPrefix = publicUrlPrefix.endsWith("/")
        ? publicUrlPrefix
        : `${publicUrlPrefix}/`;

      let key = data.url;
      if (data.url.startsWith(normalizedPrefix)) {
        key = data.url.replace(normalizedPrefix, "");
      } else if (data.url.startsWith("https://") || data.url.startsWith("http://")) {
        // Extract pathname from external R2 domain
        const urlObj = new URL(data.url);
        key = urlObj.pathname.replace(/^\/+/, "");
      }

      console.log(`[R2 Server Function] Requesting deletion of key: ${key}`);
      await deleteFromR2(key);
      return { success: true };
    } catch (error: unknown) {
      console.error("[R2 Server Function] Failed to delete file:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      return { success: false, error: message };
    }
  });
