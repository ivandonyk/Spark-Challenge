import { Platform } from "./types";

export function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function detectPlatform(url: string): Platform | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^(www\.|m\.)/, "");

    if (hostname === "youtube.com" && parsed.searchParams.has("v")) return "youtube";
    if (hostname === "youtu.be" && parsed.pathname.length > 1) return "youtube";

    if (hostname === "instagram.com" && /\/(p|reel|reels)\//.test(parsed.pathname)) return "instagram";

    if (hostname === "tiktok.com" && parsed.pathname.includes("/video/")) return "tiktok";

    return null;
  } catch {
    return null;
  }
}

const TRACKING_PARAMS = new Set(["ref", "fbclid", "si"]);

export function normalizeUrl(url: string): string {
  const parsed = new URL(url);
  parsed.hostname = parsed.hostname.toLowerCase();
  parsed.pathname = parsed.pathname.replace(/\/+$/, "");

  const cleanParams = new URLSearchParams();
  parsed.searchParams.forEach((value, key) => {
    if (!key.startsWith("utm_") && !TRACKING_PARAMS.has(key)) {
      cleanParams.set(key, value);
    }
  });

  parsed.search = cleanParams.toString() ? `?${cleanParams.toString()}` : "";
  parsed.hash = "";
  return parsed.toString();
}
