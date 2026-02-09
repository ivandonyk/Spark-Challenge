"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { PreviewResponse } from "@/lib/types";

type Props = {
  onPreview: (data: PreviewResponse) => void;
  onCancel: () => void;
  isPreviewActive: boolean;
};

export default function SubmissionForm({ onPreview, isPreviewActive }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setError("URL is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      onPreview(data);
      setUrl("");
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  if (isPreviewActive) return null;

  return (
    <form onSubmit={handleSubmit} aria-busy={isLoading}>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Paste a YouTube, Instagram, or TikTok URL..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          disabled={isLoading}
          autoFocus
          className="h-10 flex-1"
        />
        <Button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="min-w-[80px] h-10"
        >
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Preview"}
        </Button>
      </div>
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive" role="alert">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </form>
  );
}
