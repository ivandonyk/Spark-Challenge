export type Platform = "youtube" | "instagram" | "tiktok";

export type DbAsset = {
  id: string;
  url: string;
  normalized_url: string;
  platform: Platform;
  created_at: string;
};

export type DbTag = {
  id: string;
  name: string;
};

export type Asset = {
  id: string;
  url: string;
  platform: Platform;
  tags: string[];
  created_at: string;
};

export type PreviewResponse = {
  url: string;
  platform: Platform;
  existing_asset: Asset | null;
};

export type SaveResponse = {
  asset: Asset;
  created: boolean;
};

export type ApiError = {
  error: string;
};

export const PRESET_TAGS = ["Motion", "Typography", "Color", "Sound design"] as const;
