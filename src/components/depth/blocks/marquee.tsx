import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Marquee — an endless horizontal ticker for logos, badges or cards.
 * CSS only (one transform animation), pauses on hover, fades at the edges.
 * Needs depth-motion.css. Use it twice with `reverse` for opposing rows.
 */
export interface MarqueeProps {
  /** Elements to scroll. Each is repeated to fill the track. */
  items: ReactNode[];
  /** Seconds for one full loop. */
  duration?: number;
  /** Scroll right instead of left. */
  reverse?: boolean;
  /** Gap between items in px. */
  gap?: number;
  /** Pause the scrolling while the pointer is over the marquee. */
  pauseOnHover?: boolean;
  /** Fade the left and right edges. */
  fade?: boolean;
  /**
   * How many times the items repeat inside one half of the track. Raise it
   * if your items are narrower than the container.
   */
  repeat?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

const FADE = "linear-gradient(to right, transparent, black 10%, black 90%, transparent)";

export function Marquee({
  items,
  duration = 30,
  reverse = false,
  gap = 16,
  pauseOnHover = true,
  fade = true,
  repeat = 2,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn("group relative w-full overflow-hidden", className)}
      style={fade ? { maskImage: FADE, WebkitMaskImage: FADE } : undefined}
    >
      <div
        className={cn(
          "flex w-max",
          reverse ? "depth-marquee-x-rev" : "depth-marquee-x",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ "--depth-marquee-duration": `${duration}s` } as CSSProperties}
      >
        {[0, 1].map((half) => (
          <div
            key={half}
            className="flex shrink-0 items-center"
            style={{ gap, paddingRight: gap }}
          >
            {Array.from({ length: repeat }, (_, r) =>
              items.map((item, i) => (
                <div key={`${r}-${i}`} className="shrink-0" aria-hidden={half > 0 || r > 0 || undefined}>
                  {item}
                </div>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
