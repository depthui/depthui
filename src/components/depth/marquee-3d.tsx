import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Marquee3D — columns of items scrolling in alternating directions on a
 * tilted plane. CSS only (transform animation), pauses on hover.
 * Needs depth-motion.css.
 */
export interface Marquee3DProps {
  items: ReactNode[];
  columns?: number;
  /** Seconds for one full loop. */
  duration?: number;
  /** Times the column content repeats. Keep it even and tall enough to cover the plane. */
  copies?: number;
  className?: string;
}

export function Marquee3D({
  items,
  columns = 4,
  duration = 32,
  copies = 6,
  className,
}: Marquee3DProps) {
  const cols = Array.from({ length: columns }, (_, c) =>
    items.filter((_, i) => i % columns === c),
  );
  const fade =
    "radial-gradient(ellipse at center, black 35%, transparent 72%)";

  return (
    <div
      className={cn("relative h-[26rem] w-full overflow-hidden", className)}
      style={{ perspective: 1400, maskImage: fade, WebkitMaskImage: fade }}
    >
      <div
        className="group absolute left-1/2 top-1/2 flex h-[1000px] gap-4 overflow-hidden"
        style={{
          transform:
            "translate(-50%, -50%) rotateX(55deg) rotateZ(-35deg) scale(1.2)",
        }}
      >
        {cols.map((col, c) => (
          <div
            key={c}
            className={cn(
              "flex flex-col gap-4 group-hover:[animation-play-state:paused]",
              c % 2 === 0 ? "depth-marquee-up" : "depth-marquee-down",
            )}
            style={{ "--depth-marquee-duration": `${duration}s` } as CSSProperties}
          >
            {Array.from({ length: copies }, (_, k) =>
              col.map((item, j) => (
                <div key={`${k}-${j}`} aria-hidden={k > 0}>
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
