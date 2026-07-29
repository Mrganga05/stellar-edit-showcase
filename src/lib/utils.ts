import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addCacheBuster(url: string, timestamp: number = Date.now()): string {
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;
  try {
    const urlObj = new URL(url, typeof window !== "undefined" ? window.location.href : "https://localhost");
    urlObj.searchParams.set("t", String(timestamp));
    return urlObj.toString();
  } catch {
    const cleanUrl = url.replace(/([?&])t=\d+/, "");
    const sep = cleanUrl.includes("?") ? "&" : "?";
    return `${cleanUrl}${sep}t=${timestamp}`;
  }
}
