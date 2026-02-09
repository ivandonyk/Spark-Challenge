"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import SubmissionForm from "@/components/submission-form";
import PreviewCard from "@/components/preview-card";
import AssetGrid from "@/components/asset-grid";
import { Asset, PreviewResponse } from "@/lib/types";

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assets")
      .then((res) => res.json())
      .then((data) => setAssets(data.assets ?? []))
      .catch(() => toast.error("Failed to load assets"))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePreview = useCallback((data: PreviewResponse) => {
    setPreview(data);
  }, []);

  const handleSave = useCallback(
    async (tags: string[]) => {
      if (!preview) return;

      setIsSaving(true);
      try {
        const res = await fetch("/api/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: preview.url,
            tags,
            thumbnail_url: preview.thumbnail_url,
            title: preview.title,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error ?? "Something went wrong");
          return;
        }

        if (data.created) {
          setAssets((prev) => [data.asset, ...prev]);
        }

        setPreview(null);
        toast.success("Asset saved");
      } catch {
        toast.error("Something went wrong");
      } finally {
        setIsSaving(false);
      }
    },
    [preview]
  );

  const handleCancel = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-1 mb-6">
          <h1 className="text-xl font-semibold tracking-tight">Spark</h1>
          <p className="text-sm text-muted-foreground">
            Your video reference library
          </p>
        </div>
        <div className="space-y-4">
          <SubmissionForm
            onPreview={handlePreview}
            onCancel={handleCancel}
            isPreviewActive={preview !== null}
          />
          {preview && (
            <PreviewCard
              preview={preview}
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 min-h-[200px]">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
          Library
        </p>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="size-6 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin" />
          </div>
        ) : (
          <AssetGrid assets={assets} />
        )}
      </div>
    </main>
  );
}
