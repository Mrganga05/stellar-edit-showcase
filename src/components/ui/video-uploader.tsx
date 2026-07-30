import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  Video,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Gauge,
  FileVideo,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPresignedUrlFn, uploadAndOptimizeVideoFn } from "@/lib/api/r2.functions";
import {
  extractVideoMetadata,
  uploadDirectToR2,
  UploadProgressInfo,
} from "@/lib/utils/direct-r2-upload";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
  });
}


export interface FullVideoUploadMetadata {
  videoUrl: string; // publicUrl
  publicUrl: string;
  objectKey: string;
  originalName: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  uploadDate: string;
  createdAt: string;
  updatedAt: string;
  duration: number;
  resolution: string;
  width: number;
  height: number;
  aspectRatio: string;
  status: "uploaded" | "pending" | "failed";
  thumbnailUrl: string;
  userId?: string;
}

interface VideoUploaderProps {
  value: string; // Current public video URL
  onChange: (details: FullVideoUploadMetadata | null) => void;
  onUploadStateChange?: (uploading: boolean) => void;
  folder?: string; // Target R2 folder inside videos/ (default "portfolio")
  maxSizeMB?: number; // Maximum allowed size in MB (default 2000MB)
}

export function VideoUploader({
  value,
  onChange,
  onUploadStateChange,
  folder = "portfolio",
  maxSizeMB = 2000,
}: VideoUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState<string>("Initializing...");
  const [progressInfo, setProgressInfo] = useState<UploadProgressInfo>({
    progress: 0,
    loaded: 0,
    total: 0,
    speedBytesPerSec: 0,
    formattedSpeed: "0 B/s",
    etaSeconds: 0,
    formattedEta: "Calculating...",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [completedMetadata, setCompletedMetadata] = useState<FullVideoUploadMetadata | null>(null);

  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onUploadStateChange?.(uploading);
  }, [uploading, onUploadStateChange]);

  // Clean up XHR on unmount
  useEffect(() => {
    return () => {
      if (xhrRef.current) {
        xhrRef.current.abort();
      }
    };
  }, []);

  const validateFile = (file: File): boolean => {
    setError(null);
    setSelectedFile(file);

    const allowedMimeTypes = [
      "video/mp4",
      "video/quicktime",
      "video/webm",
      "video/x-matroska",
      "video/avi",
      "video/mkv",
    ];
    const allowedExtensions = [".mp4", ".mov", ".webm", ".mkv", ".avi"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedMimeTypes.includes(file.type.toLowerCase()) && !allowedExtensions.includes(fileExtension)) {
      setError(
        "Invalid file format. Supported video formats are MP4, MOV, WEBM, MKV, and AVI.",
      );
      return false;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is ${maxSizeMB}MB.`,
      );
      return false;
    }

    return true;
  };

  const uploadFileDirectly = async (file: File) => {
    console.log("[STEP 1]\nUpload started");
    setUploading(true);
    setStatusText("Extracting video metadata...");
    setError(null);
    setSuccess(false);
    setProgressInfo({
      progress: 0,
      loaded: 0,
      total: file.size,
      speedBytesPerSec: 0,
      formattedSpeed: "0 B/s",
      etaSeconds: 0,
      formattedEta: "Calculating...",
    });

    try {
      // Step 1: Extract video metadata natively in browser (duration, resolution, ratio)
      const metadata = await extractVideoMetadata(file);

      let finalPublicUrl = "";
      let finalObjectKey = "";
      let finalOriginalName = file.name;
      let finalFileSize = file.size;

      // Primary Attempt: Server-side ffmpeg re-encode (H.264, CRF 20, maxrate 10M, AAC 192k, +faststart)
      try {
        setStatusText("Optimizing & re-encoding video with ffmpeg (H.264 + faststart)...");
        const fileBase64 = await fileToBase64(file);

        const optimizeRes = await uploadAndOptimizeVideoFn({
          data: {
            fileBase64,
            fileName: file.name,
            contentType: file.type || "video/mp4",
            folder,
          },
        });

        if (optimizeRes && optimizeRes.success && optimizeRes.publicUrl) {
          finalPublicUrl = optimizeRes.publicUrl;
          finalObjectKey = optimizeRes.objectKey || "";
          finalOriginalName = optimizeRes.originalName || file.name;
          finalFileSize = optimizeRes.fileSize || file.size;
        }
      } catch (optErr) {
        console.warn(
          "[VideoUploader] Server ffmpeg optimization skipped, using direct upload:",
          optErr,
        );
      }

      // Fallback: Presigned URL direct upload to R2 if server re-encode was skipped or hit limits
      if (!finalPublicUrl) {
        setStatusText("Requesting presigned upload URL...");
        const presignedRes = await getPresignedUrlFn({
          data: {
            fileName: file.name,
            contentType: file.type || "video/mp4",
            fileSize: file.size,
            folder,
          },
        });

        if (!presignedRes || !presignedRes.success || !presignedRes.uploadUrl) {
          throw new Error(presignedRes?.error || "Failed to generate presigned upload URL");
        }

        const { uploadUrl, objectKey, publicUrl, originalName } = presignedRes;

        setStatusText("Uploading directly to Cloudflare R2...");
        await uploadDirectToR2({
          uploadUrl,
          file,
          contentType: file.type || "video/mp4",
          xhrRef,
          onProgress: (info) => {
            setProgressInfo(info);
          },
        });

        finalPublicUrl = publicUrl;
        finalObjectKey = objectKey || "";
        finalOriginalName = originalName || file.name;
      }

      console.log(`[STEP 2]\nUpload completed\nURL: ${finalPublicUrl}`);

      // Step 4: Construct complete production metadata record
      const now = new Date().toISOString();
      const videoResult: FullVideoUploadMetadata = {
        videoUrl: finalPublicUrl,
        publicUrl: finalPublicUrl,
        objectKey: finalObjectKey,
        originalName: finalOriginalName,
        originalFilename: finalOriginalName,
        fileSize: finalFileSize,
        mimeType: "video/mp4",
        uploadDate: now,
        createdAt: now,
        updatedAt: now,
        duration: metadata.duration,
        resolution: metadata.resolution,
        width: metadata.width,
        height: metadata.height,
        aspectRatio: metadata.aspectRatio,
        status: "uploaded",
        thumbnailUrl: "",
      };

      setCompletedMetadata(videoResult);
      setSuccess(true);
      setUploading(false);
      onChange(videoResult);
    } catch (err: unknown) {
      console.error("[Direct R2 Upload] Upload failed:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An unexpected network error occurred while uploading directly to R2.";
      setError(errorMsg);
      setUploading(false);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      uploadFileDirectly(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      uploadFileDirectly(file);
    }
  };

  const handleCancel = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
    }
  };

  const handleRetry = () => {
    if (selectedFile) {
      uploadFileDirectly(selectedFile);
    }
  };

  const triggerFileInput = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Zone */}
      {!uploading && !success && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={cn(
            "relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 min-h-[140px]",
            isDragActive
              ? "border-electric bg-electric/5 scale-[0.99] shadow-[0_0_15px_rgba(14,165,233,0.15)]"
              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/avi"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <UploadCloud className="size-8 text-muted-foreground mb-3 animate-pulse" />
          <div className="text-sm font-medium text-foreground mb-1">
            Drag & drop your video here, or{" "}
            <span className="text-electric font-semibold hover:underline">browse file</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Direct Cloudflare R2 Upload (Supports MP4, MOV, WEBM, MKV up to {maxSizeMB}MB)
          </div>
        </div>
      )}

      {/* Uploading State with Real-Time Progress, Speed & ETA */}
      {uploading && (
        <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 text-electric animate-spin" />
              <span className="text-xs font-semibold text-white/90">{statusText}</span>
            </div>
            <span className="text-xs font-bold text-electric">{progressInfo.progress}%</span>
          </div>

          <Progress value={progressInfo.progress} className="h-2 bg-white/5 [&>div]:bg-electric transition-all" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 truncate">
              <FileVideo className="size-3.5 text-white/60 flex-shrink-0" />
              <span className="truncate">{selectedFile?.name}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Gauge className="size-3.5 text-electric flex-shrink-0" />
              <span className="font-mono text-white/80">{progressInfo.formattedSpeed}</span>
            </div>

            <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
              <Clock className="size-3.5 text-amber-400 flex-shrink-0" />
              <span className="font-mono text-white/80">{progressInfo.formattedEta}</span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-7 px-3 text-[10px] uppercase tracking-wider font-bold rounded-lg border-white/10 hover:bg-white/10 text-white cursor-pointer"
            >
              Cancel Upload
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !uploading && (
        <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="size-4.5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-red-400">Direct Upload Failed</h5>
              <p className="text-xs text-red-200/80 leading-relaxed">{error}</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setError(null);
                setSelectedFile(null);
              }}
              className="h-7 px-3 text-[10px] uppercase tracking-wider font-bold rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white cursor-pointer"
            >
              Clear
            </Button>
            {selectedFile && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="h-7 px-3 text-[10px] uppercase tracking-wider font-bold rounded-lg border-red-500/20 hover:bg-red-500/10 text-red-400 cursor-pointer"
              >
                Retry Direct Upload
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Success State */}
      {success && !uploading && (
        <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-4 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-5 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold text-emerald-400">Direct Upload Complete!</h5>
              {completedMetadata && (
                <div className="text-[10px] text-emerald-200/70 truncate mt-0.5 space-x-2">
                  <span>File: {completedMetadata.originalName}</span>
                  {completedMetadata.resolution && <span>• {completedMetadata.resolution}</span>}
                  {completedMetadata.aspectRatio && <span>• {completedMetadata.aspectRatio}</span>}
                  {completedMetadata.duration > 0 && <span>• {completedMetadata.duration}s</span>}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSuccess(false);
                setSelectedFile(null);
                setCompletedMetadata(null);
              }}
              className="h-7 px-3 text-[10px] uppercase tracking-wider font-bold rounded-lg border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400 cursor-pointer"
            >
              Upload Another Video
            </Button>
          </div>
        </div>
      )}

      {/* Display Current Public R2 Video URL */}
      {value && !uploading && !error && !success && (
        <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Video className="size-4.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate select-all">{value}</span>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-muted-foreground hover:text-red-400 transition cursor-pointer p-1"
            title="Remove video link"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
