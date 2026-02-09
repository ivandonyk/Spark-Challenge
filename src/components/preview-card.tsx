"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TagToggle from "@/components/tag-toggle";
import { PreviewResponse, Platform, PRESET_TAGS } from "@/lib/types";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  preview: PreviewResponse;
  onSave: (tags: string[]) => void;
  onCancel: () => void;
  isSaving: boolean;
};

const platformStyles: Record<Platform, string> = {
  youtube: "bg-red-500/10 text-red-600",
  instagram: "bg-fuchsia-500/10 text-fuchsia-600",
  tiktok: "bg-cyan-500/10 text-cyan-600",
};

const platformLabels: Record<Platform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
};

export default function PreviewCard({ preview, onSave, onCancel, isSaving }: Props) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (preview.existing_asset) {
    const asset = preview.existing_asset;
    return (
      <Card className="bg-amber-50 border-amber-200 p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Already in your library</p>
            {asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {asset.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Saved {new Date(asset.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Dismiss
          </Button>
        </div>
      </Card>
    );
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            platformStyles[preview.platform]
          )}
        >
          {platformLabels[preview.platform]}
        </span>
      </div>
      <p
        className="text-sm font-mono text-muted-foreground truncate"
        title={preview.url}
      >
        {preview.url}
      </p>
      <div className="border-t pt-4 space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_TAGS.map((tag) => (
            <TagToggle
              key={tag}
              label={tag}
              isSelected={selectedTags.includes(tag)}
              onToggle={() => toggleTag(tag)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => onSave(selectedTags)}
          disabled={isSaving}
          className="active:scale-[0.98]"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </Card>
  );
}
