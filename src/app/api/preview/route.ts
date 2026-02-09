import { NextRequest, NextResponse } from "next/server";
import { isValidUrl, detectPlatform, normalizeUrl } from "@/lib/validators";
import { findAssetByUrl } from "@/lib/db";
import { fetchThumbnail } from "@/lib/oembed";
import { PreviewResponse, ApiError } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body.url?.trim();

    if (!url) {
      return NextResponse.json<ApiError>(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json<ApiError>(
        { error: "Please enter a valid URL" },
        { status: 400 }
      );
    }

    const platform = detectPlatform(url);
    if (!platform) {
      return NextResponse.json<ApiError>(
        { error: "Unsupported platform. We support YouTube, Instagram, and TikTok." },
        { status: 422 }
      );
    }

    const normalized = normalizeUrl(url);
    const [existingAsset, thumbnail] = await Promise.all([
      findAssetByUrl(normalized),
      fetchThumbnail(url, platform),
    ]);

    return NextResponse.json<PreviewResponse>({
      url,
      platform,
      existing_asset: existingAsset,
      thumbnail_url: thumbnail.thumbnail_url,
      title: thumbnail.title,
    });
  } catch {
    return NextResponse.json<ApiError>(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
