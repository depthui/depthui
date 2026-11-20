import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Chip3D — a small raised pill that can be selected (filters), removed (tags)
 * or both. With onSelectedChange it is a toggle button with aria-pressed; with
 * onRemove it gets a separate remove button named "Remove <label>". Use
 * TagInput3D when people need to type new tags.
 */
export interface Chip3DProps {
  /** Text of the chip. */
  children: string;
  /** Whether the chip is selected. Only used with onSelectedChange. */
  selected?: boolean;
  /** Makes the chip a toggle. Called with the new selected state. */
  onSelectedChange?: (selected: boolean) => void;
  /** Adds a remove button. Called when it is pressed. */
  onRemove?: () => void;
  /** Icon or emoji shown before the text. */
  icon?: ReactNode;
  /** Stop the chip from being used. */
  disabled?: boolean;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Chip3D({ children, selected, onSelectedChange, onRemove, icon, disabled, className }: Chip3DProps) {
  const body = (
    <>
      {icon && <span aria-hidden className="flex h-4 w-4 items-center justify-center">{icon}</span>}
      {children}
    </>
  );
  const base = "inline-flex h-8 items-center gap-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-depth-accent";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-[transform,box-shadow,background-color,color] duration-150",
        selected
          ? "border-depth-accent bg-depth-accent text-white shadow-[inset_0_2px_3px_rgb(0_0_0/0.25)]"
          : "border-depth-border bg-depth-surface text-depth-text shadow-[0_3px_0_var(--depth-border)]",
        disabled && "opacity-40",
        className,
      )}
    >
      {onSelectedChange ? (
        <button type="button" aria-pressed={!!selected} disabled={disabled} onClick={() => onSelectedChange(!selected)} className={cn(base, "rounded-full pl-3", onRemove ? "pr-1.5" : "pr-3")}>{body}</button>
      ) : (
        <span className={cn(base, "pl-3", onRemove ? "pr-1.5" : "pr-3")}>{body}</span>
      )}
      {onRemove && (
        <button type="button" aria-label={`Remove ${children}`} disabled={disabled} onClick={onRemove} className="mr-1 flex h-6 w-6 items-center justify-center rounded-full outline-none transition-colors hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-depth-accent">
          <svg aria-hidden viewBox="0 0 20 20" className="h-3.5 w-3.5"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      )}
    </span>
  );
}
