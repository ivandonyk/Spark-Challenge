import { supabase } from "./supabase";
import { Asset, DbTag, Platform } from "./types";

export async function findAssetByUrl(normalizedUrl: string): Promise<Asset | null> {
  const { data, error } = await supabase
    .from("assets_with_tags")
    .select("id, url, platform, tags, thumbnail_url, title, created_at")
    .eq("normalized_url", normalizedUrl)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Sequential queries instead of a DB transaction — acceptable trade-off for Supabase client
export async function createAsset(
  url: string,
  normalizedUrl: string,
  platform: Platform,
  tags: string[],
  thumbnailUrl: string | null,
  title: string | null
): Promise<Asset> {
  const { data: asset, error: insertError } = await supabase
    .from("assets")
    .insert({ url, normalized_url: normalizedUrl, platform, thumbnail_url: thumbnailUrl, title })
    .select()
    .single();

  if (insertError) throw insertError;

  if (tags.length > 0) {
    const { data: tagRows, error: tagError } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", tags);

    if (tagError) throw tagError;

    if (tagRows && tagRows.length > 0) {
      const junctionRows = tagRows.map((t) => ({
        asset_id: asset.id,
        tag_id: t.id,
      }));

      const { error: junctionError } = await supabase
        .from("asset_tags")
        .insert(junctionRows);

      if (junctionError) throw junctionError;
    }
  }

  const { data: fullAsset, error: viewError } = await supabase
    .from("assets_with_tags")
    .select("id, url, platform, tags, thumbnail_url, title, created_at")
    .eq("id", asset.id)
    .single();

  if (viewError) throw viewError;
  return fullAsset;
}

export async function getAllAssets(): Promise<Asset[]> {
  const { data, error } = await supabase
    .from("assets_with_tags")
    .select("id, url, platform, tags, thumbnail_url, title, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPresetTags(): Promise<DbTag[]> {
  const { data, error } = await supabase
    .from("tags")
    .select("id, name");

  if (error) throw error;
  return data ?? [];
}
