import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { parse } from "node:path";

// Initialize S3 client for Cloudflare R2 lazily to avoid errors if env vars are not set during build time
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

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
 * Generates a unique, sanitized filename and a presigned PUT URL for Cloudflare R2.
 */
export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string,
  folder: string,
) {
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrlPrefix = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!bucketName || !publicUrlPrefix) {
    throw new Error(
      "Missing Cloudflare R2 bucket name or public URL prefix in environment variables",
    );
  }

  // Generate unique safe filename
  const { name, ext } = parse(fileName);
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const uniqueName = `${cleanName}-${Date.now()}${ext}`;
  const key = `${folder}/${uniqueName}`;

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    Metadata: {
      "original-filename": encodeURIComponent(fileName),
    },
  });

  // Presigned URL expires in 1 hour (3600 seconds)
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

  // Format public URL: ensure no double slashes between prefix and key
  const normalizedPrefix = publicUrlPrefix.endsWith("/")
    ? publicUrlPrefix.slice(0, -1)
    : publicUrlPrefix;
  const publicUrl = `${normalizedPrefix}/${key}`;

  console.log(`[R2] Generated presigned upload URL for key: ${key}`);

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
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("Missing CLOUDFLARE_R2_BUCKET_NAME in environment variables");
  }

  const client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await client.send(command);
  console.log(`[R2] Successfully deleted key from storage: ${key}`);
}

/**
 * Uploads a local file to Cloudflare R2 given its file path and contentType.
 * Returns the public URL of the uploaded asset.
 */
export async function uploadLocalFileToR2(
  filePath: string,
  key: string,
  contentType: string,
): Promise<string> {
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrlPrefix = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!bucketName || !publicUrlPrefix) {
    throw new Error(
      "Missing Cloudflare R2 bucket name or public URL prefix in environment variables",
    );
  }

  const { createReadStream } = await import("node:fs");
  const client = getS3Client();
  const fileStream = createReadStream(filePath);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
    ContentType: contentType,
  });

  await client.send(command);
  console.log(`[R2] Successfully uploaded local file to R2: ${key}`);

  // Format public URL: ensure no double slashes between prefix and key
  const normalizedPrefix = publicUrlPrefix.endsWith("/")
    ? publicUrlPrefix.slice(0, -1)
    : publicUrlPrefix;
  return `${normalizedPrefix}/${key}`;
}
