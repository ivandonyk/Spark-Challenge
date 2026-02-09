import { memo } from "react";
import { Film } from "lucide-react";

const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      <Film size={40} className="text-muted-foreground/40" />
      <p className="mt-4 text-sm font-medium text-muted-foreground">
        No assets yet
      </p>
      <p className="mt-1 text-sm text-muted-foreground/60">
        Paste a video URL above to get started.
      </p>
    </div>
  );
});

export default EmptyState;
