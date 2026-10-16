import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * BeamButton — a light beam travels around the border. The beam is a
 * conic gradient that rotates behind the button face, so it only animates
 * `transform`. Needs depth-motion.css.
 */
export interface BeamButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Seconds per lap. */
  duration?: number;
  /** Border thickness in px. */
  thickness?: number;
}

export function BeamButton({
  duration = 3.2,
  thickness = 1.5,
  className,
  children,
  style,
  ...props
}: BeamButtonProps) {
  return (
    <button
      type="button"
      style={{ padding: thickness, ...style }}
      className={cn(
        "group relative inline-flex overflow-hidden rounded-xl bg-depth-border outline-none",
        "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="depth-spin absolute left-1/2 top-1/2 aspect-square w-[220%] -translate-x-1/2 -translate-y-1/2"
        style={
          {
            "--depth-orbit-duration": `${duration}s`,
            background:
              "conic-gradient(from 0deg, transparent 0 62%, var(--depth-accent-2) 78%, var(--depth-accent) 92%, transparent 100%)",
          } as CSSProperties
        }
      />
      <span className="relative inline-flex items-center justify-center rounded-[10px] bg-depth-surface px-7 py-3 font-medium text-depth-text transition-colors group-hover:bg-depth-elevated">
        {children}
      </span>
    </button>
  );
}
