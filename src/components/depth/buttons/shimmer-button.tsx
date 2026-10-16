import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * ShimmerButton — a solid button with a soft light that sweeps across it on
 * a loop. CSS only (one transform animation). Needs depth-motion.css.
 */
export type ShimmerButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ShimmerButton({ className, children, ...props }: ShimmerButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-depth-text px-7 py-3.5 font-medium text-depth-bg outline-none transition-transform duration-150 active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="depth-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--depth-bg) 55%, transparent), transparent)",
        }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}
