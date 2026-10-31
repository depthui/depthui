import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * AuroraBackground — slow drifting colour clouds behind your content. Each
 * cloud is a blurred circle moved by one `transform` animation. Needs
 * depth-motion.css. Stops moving for people who prefer reduced motion.
 */
export interface AuroraBackgroundProps {
  /** Content shown on top of the background. */
  children?: ReactNode;
  /** Extra classes added to the outer element. */
  className?: string;
}

const BLOBS = [
  { left: "-8%", top: "-20%", size: "55%", color: "var(--depth-accent)", dx: "18%", dy: "20%", ds: 1.2, dur: 16, delay: 0 },
  { left: "45%", top: "-10%", size: "50%", color: "var(--depth-accent-2)", dx: "-22%", dy: "26%", ds: 1.15, dur: 19, delay: -4 },
  { left: "15%", top: "45%", size: "55%", color: "var(--depth-accent-3)", dx: "26%", dy: "-18%", ds: 1.25, dur: 22, delay: -8 },
] as const;

export function AuroraBackground({ children, className }: AuroraBackgroundProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-40">
        {BLOBS.map((b, i) => (
          <span
            key={i}
            className="depth-drift absolute aspect-square rounded-full blur-3xl"
            style={
              {
                left: b.left,
                top: b.top,
                width: b.size,
                background: b.color,
                "--dx": b.dx,
                "--dy": b.dy,
                "--ds": b.ds,
                animationDuration: `${b.dur}s`,
                animationDelay: `${b.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      {children}
    </div>
  );
}
