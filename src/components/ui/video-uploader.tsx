import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Video, X, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPresignedUrlFn, uploadVideoFn } from "@/lib/api/r2.functions";

interface VideoDetails {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  resolution: string;
  fileSize: number;
}

interface VideoUploaderProps {
  value: string; // Current video URL
  onChange: (details: VideoDetails | null) => void; // Called when upload succeeds
  onUploadStateChange?: (uploading: boolean) => void; // Notify parent component about upload state
  folder?: string; // Target R2 folder (default "portfolio")
  maxSizeMB?: number; // Configurable Max upload size (default 500MB)
}

export function VideoUploader({
  value,
  onChange,
  onUploadStateChange,
  folder = "portfolio",
  maxSizeMB = 500,
}: VideoUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string>("Uploading");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    // Mime types and extensions to check (MP4, MOV, WEBM)
    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"];
    const allowedExtensions = [".mp4", ".mov", ".webm"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setError("Invalid file type. Only MP4, MOV, and WEBM video formats are supported.");
      return false;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum allowed size is ${maxSizeMB}MB.`);
      return false;
    }

    return true;
  };

  const uploadFileToR2 = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setStatus("Uploading");
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      const url = `${uploadVideoFn.url}?_serverFnId=${encodeURIComponent(uploadVideoFn.id)}`;
      xhr.open("POST", url, true);
      xhr.setRequestHeader("x-server-fn-id", uploadVideoFn.id);

      // Track request upload progress (client -> server)
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          if (percentComplete < 100) {
            setProgress(percentComplete);
          } else {
            setProgress(100);
          }
        }
      };

      let lastIndex = 0;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 3 || xhr.readyState === 4) {
          const newText = xhr.responseText.substring(lastIndex);
          lastIndex = xhr.responseText.length;

          const lines = newText.split("\n");
          for (const line of lines) {
            if (line.trim().startsWith("data: ")) {
              try {
                const rawData = line.trim().slice(6);
                const parsed = JSON.parse(rawData);
                if (parsed.status) {
                  setStatus(parsed.status);
                  setProgress(parsed.percent);

                  if (parsed.status === "Completed") {
                    setSuccess(true);
                    setUploading(false);
                    onChange(parsed.data);
                  } else if (parsed.status === "Failed") {
                    setError(parsed.error || "Video processing failed.");
                    setUploading(false);
                  }
                }
              } catch (e) {
                // Ignore parsing errors for incomplete lines
              }
            }
          }
        }
      };

      xhr.onload = () => {
        if (xhr.status !== 200) {
          setError(`Upload failed with status code ${xhr.status}`);
          setUploading(false);
        }
      };

      xhr.onerror = () => {
        setError("Network error occurred during video upload.");
        setUploading(false);
      };

      xhr.onabort = () => {
        setError("Upload cancelled by user.");
        setUploading(false);
      };

      xhr.send(formData);
    } catch (err: unknown) {
      console.error("[R2 Upload] Error in upload workflow:", err);
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred during upload.";
      setError(errorMsg);
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      uploadFileToR2(file);
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
      uploadFileToR2(file);
    }
  };

  const handleCancel = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
    }
  };

  const handleRetry = () => {
    if (selectedFile) {
      uploadFileToR2(selectedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={handleFileChange}
          />
          <UploadCloud className="size-8 text-muted-foreground mb-3 animate-pulse" />
          <div className="text-sm font-medium text-foreground mb-1">
            Drag & drop your video here, or{" "}
            <span className="text-electric font-semibold hover:underline">browse</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Supports MP4, MOV, WEBM (Max {maxSizeMB}MB)
          </div>
        </div>
      )}

      {/* Uploading State with Progress */}
      {uploading && (
        <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 text-electric animate-spin" />
              <span className="text-xs font-semibold text-white/90">
                {status === "Uploading" ? "Uploading Original Video..." : `${status}...`}
              </span>
            </div>
            <span className="text-xs font-bold text-electric">{progress}%</span>
          </div>

          <Progress value={progress} className="h-1.5 bg-white/5 [&>div]:bg-electric" />

          {selectedFile && (
            <div className="text-[10px] text-muted-foreground truncate">
              File: {selectedFile.name}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-7 px-3 text-[10px] uppercase tracking-wider font-bold rounded-lg border-white/10 hover:bg-white/10 text-white cursor-pointer"
            >
              Cancel
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
              <h5 className="text-xs font-bold text-red-400">Upload Failed</h5>
              <p className="text-xs text-red-200/70 leading-relaxed">{error}</p>
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
                Retry Upload
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Success State */}
      {success && !uploading && (
        <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-4.5 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold text-emerald-400">Upload Complete!</h5>
              {selectedFile && (
                <p className="text-[10px] text-emerald-200/60 truncate mt-0.5">
                  Saved: {selectedFile.name}
                </p>
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
              }}
              className="h-7 px-3 text-[10px] uppercase tracking-wider font-bold rounded-lg border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400 cursor-pointer"
            >
              Upload Another
            </Button>
          </div>
        </div>
      )}

      {/* Display Current Public URL */}
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
