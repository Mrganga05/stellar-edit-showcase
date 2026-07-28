import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { parse } from "node:path";

// Helper to reliably read R2 environment variables across Node, Vite SSR, and local development
function getR2Env(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    if (process.env[key]) return process.env[key];
    if (process.env[`VITE_${key}`]) return process.env[`VITE_${key}`];
    try {
      if (typeof process.loadEnvFile === "function") {
        process.loadEnvFile();
      }
    } catch {
      // ignore
    }
    return process.env[key] || process.env[`VITE_${key}`];
  }
  return undefined;
}

// Initialize S3 client for Cloudflare R2 lazily to avoid errors if env vars are not set during build time
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const accountId = getR2Env("CLOUDFLARE_R2_ACCOUNT_ID");
    const accessKeyId = getR2Env("CLOUDFLARE_R2_ACCESS_KEY_ID");
    const secretAccessKey = getR2Env("CLOUDFLARE_R2_SECRET_ACCESS_KEY");

    if (!accountId || !accessKeyId || !secretAccessKey) {
      console.error("Missing Cloudflare R2 credentials in environment variables.");
      throw new Error("Cloudflare R2 credentials are not configured on the server");
    }

    s3Client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: "auto",
    });
  }
  return s3Client;
}

/**
 * Generates a unique, sanitized filename and a temporary presigned PUT URL for Cloudflare R2.
 * Presigned URLs expire after exactly 5 minutes (300 seconds).
 * Strictly confines files inside videos/ folder and prevents path traversal attacks.
 */
export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string,
  folder: string = "videos",
) {
  const bucketName = getR2Env("CLOUDFLARE_R2_BUCKET_NAME");
  const publicUrlPrefix =
    getR2Env("CLOUDFLARE_R2_PUBLIC_URL") || "https://pub-f2e8479a9f704fe2a3f086d9586ab8d9.r2.dev";

  if (!bucketName) {
    throw new Error(
      "Missing CLOUDFLARE_R2_BUCKET_NAME in environment variables",
    );
  }

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
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    Metadata: {
      "original-filename": encodeURIComponent(fileName),
      "upload-timestamp": String(Date.now()),
    },
  });

  // 3. Presigned URL expires in exactly 5 minutes (300 seconds)
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });

  // 4. Format custom media domain public URL
  const normalizedPrefix = publicUrlPrefix.endsWith("/")
    ? publicUrlPrefix.slice(0, -1)
    : publicUrlPrefix;
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
 * Deletes an object from Cloudflare R2 by its key.
 */
export async function deleteFromR2(key: string) {
  const bucketName = getR2Env("CLOUDFLARE_R2_BUCKET_NAME");
  if (!bucketName) {
    throw new Error("Missing CLOUDFLARE_R2_BUCKET_NAME in environment variables");
  }

  // Prevent path traversal on deletion
  const cleanKey = key.replace(/\.\./g, "").replace(/^\/+/, "");

  const client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: cleanKey,
  });

  await client.send(command);
  console.log(`[R2 Server] Successfully deleted key from storage: ${cleanKey}`);
}
