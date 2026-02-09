import { Card } from "@/components/ui/card";
import EmptyState from "@/components/empty-state";
import { Asset, Platform } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Youtube, Instagram, Music2 } from "lucide-react";
import Image from "next/image";

type Props = {
  assets: Asset[];
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

const platformIcons: Record<Platform, typeof Youtube> = {
  youtube: Youtube,
  instagram: Instagram,
  tiktok: Music2,
};

const platformBgStyles: Record<Platform, string> = {
  youtube: "bg-red-500/5",
  instagram: "bg-fuchsia-500/5",
  tiktok: "bg-cyan-500/5",
};

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

export default function AssetGrid({ assets }: Props) {
  if (assets.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {assets.map((asset) => {
        const Icon = platformIcons[asset.platform];
        return (
          <Card
            key={asset.id}
            className="overflow-hidden hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
          >
            {asset.thumbnail_url ? (
              <div className="relative aspect-video">
                <Image
                  src={asset.thumbnail_url}
                  alt={asset.title ?? "Video thumbnail"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className={cn("flex items-center justify-center aspect-video", platformBgStyles[asset.platform])}>
                <Icon className="size-8 text-muted-foreground/30" />
              </div>
            )}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    platformStyles[asset.platform]
                  )}
                >
                  {platformLabels[asset.platform]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(asset.created_at)}
                </span>
              </div>
              {asset.title && (
                <p className="text-sm font-medium line-clamp-1">{asset.title}</p>
              )}
              <p
                className="text-sm font-mono text-muted-foreground truncate"
                title={asset.url}
              >
                {stripProtocol(asset.url)}
              </p>
              {asset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-zinc-100 rounded-full px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
