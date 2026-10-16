import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * BrutalButton — flat, outlined, with a hard offset shadow. The face slides
 * toward the shadow on press. The shadow is a separate layer, so only
 * `transform` changes.
 */
export interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shadow offset in px. */
  offset?: number;
}

export function BrutalButton({
  offset = 5,
  className,
  children,
  style,
  ...props
}: BrutalButtonProps) {
  return (
    <button
      type="button"
      style={{ marginRight: offset, marginBottom: offset, ...style }}
      className={cn(
        "group relative inline-flex outline-none",
        "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-lg bg-depth-text"
        style={{ transform: `translate(${offset}px, ${offset}px)` }}
      />
      <span
        className="relative inline-flex items-center justify-center rounded-lg border-2 border-depth-text bg-depth-accent-3 px-7 py-3 font-bold text-white transition-transform duration-100 ease-out group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-active:translate-x-[var(--o)] group-active:translate-y-[var(--o)]"
        style={{ "--o": `${offset}px` } as React.CSSProperties}
      >
        {children}
      </span>
    </button>
  );
}
