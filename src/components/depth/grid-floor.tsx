import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * GridFloor — an endless perspective grid scrolling toward the viewer.
 * CSS only: the scroll animates `transform` by exactly one cell, so it loops
 * seamlessly and never triggers layout or paint. Needs depth-motion.css.
 */
export interface GridFloorProps {
  /** Grid cell size in px. */
  cell?: number;
  /** Floor angle in degrees. Higher = flatter. */
  tilt?: number;
  className?: string;
  /** Content drawn above the floor. */
  children?: ReactNode;
}

export function GridFloor({
  cell = 48,
  tilt = 68,
  className,
  children,
}: GridFloorProps) {
  const fade =
    "linear-gradient(to top, black 30%, transparent 92%)";

  const scroller: CSSProperties = {
    top: -cell,
    "--depth-cell": `${cell}px`,
    backgroundImage:
      "linear-gradient(to right, var(--depth-grid-strong) 1px, transparent 1px), linear-gradient(to bottom, var(--depth-grid-strong) 1px, transparent 1px)",
    backgroundSize: `${cell}px ${cell}px`,
  } as CSSProperties;

  return (
    <div className={cn("relative h-80 w-full overflow-hidden", className)}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          perspective: 420,
          perspectiveOrigin: "50% 30%",
          maskImage: fade,
          WebkitMaskImage: fade,
        }}
      >
        <div
          className="absolute inset-x-[-100%] bottom-0 h-[900px] overflow-hidden"
          style={{
            transformOrigin: "bottom",
            transform: `rotateX(${tilt}deg)`,
          }}
        >
          <div
            className="depth-grid-scroll absolute inset-x-0 bottom-0"
            style={scroller}
          />
        </div>
      </div>
      <div className="relative z-10 flex h-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
