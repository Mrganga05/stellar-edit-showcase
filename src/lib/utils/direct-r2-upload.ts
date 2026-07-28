/**
 * Direct Browser to Cloudflare R2 Upload Utility
 * Handles direct PUT uploads using presigned URLs with detailed progress,
 * speed, ETA tracking, and native video metadata extraction.
 */

export interface VideoMetadata {
  duration: number; // in seconds
  resolution: string; // e.g. "1920x1080"
  width: number;
  height: number;
  aspectRatio: string; // e.g. "16:9", "9:16", "1:1"
}

export interface VideoMetadataRecord {
  id?: string;
  userId?: string;
  objectKey: string;
  publicUrl: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  duration: number;
  width: number;
  height: number;
  aspectRatio: string;
  createdAt: string;
  updatedAt: string;
  status: "uploaded" | "pending" | "failed";
  thumbnailUrl?: string;
}

export interface UploadProgressInfo {
  progress: number; // 0 to 100
  loaded: number; // bytes uploaded
  total: number; // total file bytes
  speedBytesPerSec: number;
  formattedSpeed: string; // e.g. "12.4 MB/s"
  etaSeconds: number;
  formattedEta: string; // e.g. "1m 15s" or "42s"
}

export interface DirectUploadOptions {
  uploadUrl: string;
  file: File;
  contentType: string;
  onProgress?: (info: UploadProgressInfo) => void;
  xhrRef?: React.MutableRefObject<XMLHttpRequest | null>;
}

/**
 * Calculates aspect ratio string (e.g. "16:9", "9:16", "1:1", "4:3", "21:9") from width and height.
 */
export function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height || width <= 0 || height <= 0) return "16:9";

  const floatRatio = width / height;
  if (Math.abs(floatRatio - 16 / 9) < 0.05) return "16:9";
  if (Math.abs(floatRatio - 9 / 16) < 0.05) return "9:16";
  if (Math.abs(floatRatio - 1) < 0.05) return "1:1";
  if (Math.abs(floatRatio - 4 / 3) < 0.05) return "4:3";
  if (Math.abs(floatRatio - 21 / 9) < 0.05) return "21:9";

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(Math.round(width), Math.round(height));
  const ratioW = Math.round(width / (divisor || 1));
  const ratioH = Math.round(height / (divisor || 1));
  return `${ratioW}:${ratioH}`;
}

/**
 * Native client-side video metadata extractor using HTML5 Video element.
 * Extracts duration, width, height, and aspect ratio without uploading to server.
 */
export function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.remove();
    };

    video.onloadedmetadata = () => {
      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      const duration = Math.round(video.duration) || 0;
      const aspectRatio = calculateAspectRatio(width, height);
      cleanup();
      resolve({
        duration,
        resolution: `${width}x${height}`,
        width,
        height,
        aspectRatio,
      });
    };

    video.onerror = () => {
      cleanup();
      // Fallback defaults if video header cannot be parsed
      resolve({
        duration: 0,
        resolution: "1920x1080",
        width: 1920,
        height: 1080,
        aspectRatio: "16:9",
      });
    };
  });
}

/**
 * Formats bytes per second into human readable string (e.g. 1.5 MB/s, 350 KB/s).
 */
export function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec <= 0) return "0 B/s";
  if (bytesPerSec < 1024 * 1024) {
    return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  }
  return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
}

/**
 * Formats ETA seconds into human readable string (e.g. 45s, 2m 10s).
 */
export function formatEta(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return "Calculating...";
  if (seconds < 60) return `${Math.ceil(seconds)}s remaining`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.ceil(seconds % 60);
  return `${mins}m ${secs}s remaining`;
}

/**
 * Direct HTTP PUT upload to Cloudflare R2 presigned URL.
 */
export function uploadDirectToR2({
  uploadUrl,
  file,
  contentType,
  onProgress,
  xhrRef,
}: DirectUploadOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    if (xhrRef) {
      xhrRef.current = xhr;
    }

    const startTime = Date.now();
    let lastLoaded = 0;
    let lastTime = startTime;
    let currentSpeed = 0;

    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", contentType);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;

      const now = Date.now();
      const timeDiff = (now - lastTime) / 1000; // in seconds
      const bytesDiff = event.loaded - lastLoaded;

      if (timeDiff >= 0.3 || event.loaded === event.total) {
        if (timeDiff > 0) {
          const instantSpeed = bytesDiff / timeDiff;
          currentSpeed = currentSpeed === 0 ? instantSpeed : currentSpeed * 0.7 + instantSpeed * 0.3;
        }
        lastLoaded = event.loaded;
        lastTime = now;
      }

      const percent = Math.min(Math.round((event.loaded / event.total) * 100), 100);
      const remainingBytes = event.total - event.loaded;
      const etaSeconds = currentSpeed > 0 ? remainingBytes / currentSpeed : 0;

      onProgress?.({
        progress: percent,
        loaded: event.loaded,
        total: event.total,
        speedBytesPerSec: currentSpeed,
        formattedSpeed: formatSpeed(currentSpeed),
        etaSeconds,
        formattedEta: formatEta(etaSeconds),
      });
    };

    xhr.onload = () => {
      if (xhrRef) {
        xhrRef.current = null;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.({
          progress: 100,
          loaded: file.size,
          total: file.size,
          speedBytesPerSec: 0,
          formattedSpeed: "0 B/s",
          etaSeconds: 0,
          formattedEta: "Complete",
        });
        resolve();
      } else {
        reject(
          new Error(
            `Cloudflare R2 returned HTTP ${xhr.status}: ${xhr.statusText || "Upload failed"}. Please check bucket CORS settings.`,
          ),
        );
      }
    };

    xhr.onerror = () => {
      if (xhrRef) {
        xhrRef.current = null;
      }
      reject(
        new Error(
          "Network error while uploading directly to Cloudflare R2. Please verify internet connection and bucket CORS configuration.",
        ),
      );
    };

    xhr.onabort = () => {
      if (xhrRef) {
        xhrRef.current = null;
      }
      reject(new Error("Upload cancelled by user."));
    };

    xhr.send(file);
  });
}
