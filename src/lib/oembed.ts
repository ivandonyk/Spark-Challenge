import { Platform } from "./types";

type ThumbnailResult = {
  thumbnail_url: string | null;
  title: string | null;
};

export async function fetchThumbnail(url: string, platform: Platform): Promise<ThumbnailResult> {
  try {
    switch (platform) {
      case "youtube":
        return fetchYouTubeThumbnail(url);
      case "tiktok":
        return fetchOEmbed(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
      case "instagram":
        return fetchOEmbed(`https://www.instagram.com/oembed/?url=${encodeURIComponent(url)}&format=json`);
      default:
        return { thumbnail_url: null, title: null };
    }
  } catch {
    return { thumbnail_url: null, title: null };
  }
}

async function fetchYouTubeThumbnail(url: string): Promise<ThumbnailResult> {
  const parsed = new URL(url);
  const hostname = parsed.hostname.replace(/^(www\.|m\.)/, "");

  let videoId: string | null = null;
  if (hostname === "youtube.com") videoId = parsed.searchParams.get("v");
  if (hostname === "youtu.be") videoId = parsed.pathname.slice(1);

  if (!videoId) return { thumbnail_url: null, title: null };

  const thumbnail_url = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  let title: string | null = null;
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) {
      const data = await res.json();
      title = data.title ?? null;
    }
  } catch {
    // title fetch failed, thumbnail still valid
  }

  return { thumbnail_url, title };
}

async function fetchOEmbed(endpoint: string): Promise<ThumbnailResult> {
  const res = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) return { thumbnail_url: null, title: null };

  const data = await res.json();
  return {
    thumbnail_url: data.thumbnail_url ?? null,
    title: data.title ?? null,
  };
}
