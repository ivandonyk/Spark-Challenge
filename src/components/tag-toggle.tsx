import { memo } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
};

const TagToggle = memo(function TagToggle({ label, isSelected, onToggle }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-pressed={isSelected}
      onClick={onToggle}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium cursor-pointer transition-all duration-150 select-none active:scale-95",
        isSelected
          ? "bg-zinc-900 text-white hover:bg-zinc-800"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      )}
    >
      {label}
    </button>
  );
});

export default TagToggle;
