import { NextRequest, NextResponse } from "next/server";
import { isValidUrl, detectPlatform, normalizeUrl } from "@/lib/validators";
import { findAssetByUrl, createAsset, getAllAssets } from "@/lib/db";
import { SaveResponse, ApiError } from "@/lib/types";

export async function GET() {
  try {
    const assets = await getAllAssets();
    return NextResponse.json({ assets });
  } catch {
    return NextResponse.json<ApiError>(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body.url?.trim();
    const tags: string[] = Array.isArray(body.tags) ? body.tags : [];

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
    const existing = await findAssetByUrl(normalized);

    if (existing) {
      return NextResponse.json<SaveResponse>(
        { asset: existing, created: false },
        { status: 200 }
      );
    }

    const asset = await createAsset(url, normalized, platform, tags);
    return NextResponse.json<SaveResponse>(
      { asset, created: true },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiError>(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
