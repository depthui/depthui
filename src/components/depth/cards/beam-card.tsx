import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * BeamCard — a card with a light beam travelling around its border. The
 * beam is a conic gradient that rotates behind the content, so it only
 * animates `transform`. Needs depth-motion.css.
 */
export interface BeamCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Seconds per lap. */
  duration?: number;
  /** Border thickness in px. */
  thickness?: number;
  contentClassName?: string;
}

export function BeamCard({
  duration = 5,
  thickness = 1.5,
  className,
  contentClassName,
  style,
  children,
  ...props
}: BeamCardProps) {
  return (
    <div
      style={{ padding: thickness, ...style }}
      className={cn("relative overflow-hidden rounded-2xl bg-depth-border", className)}
      {...props}
    >
      <span
        aria-hidden
        className="depth-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={
          {
            width: "max(250%, 700px)",
            aspectRatio: "1",
            "--depth-orbit-duration": `${duration}s`,
            background:
              "conic-gradient(from 0deg, transparent 0 55%, var(--depth-accent-2) 75%, var(--depth-accent) 90%, var(--depth-accent-3) 98%, transparent 100%)",
          } as CSSProperties
        }
      />
      <div
        className={cn("relative h-full bg-depth-surface p-6", contentClassName)}
        style={{ borderRadius: `calc(1rem - ${thickness}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
