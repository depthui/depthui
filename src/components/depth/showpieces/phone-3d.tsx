import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * Phone3D — a phone with real thickness that tilts with the pointer, with
 * floating chips that sit in front of it on their own depth. `children` is
 * the screen. Chips parallax against the phone because each has a different
 * translateZ.
 */
export interface PhoneChip {
  node: ReactNode;
  /** Position as percent of the phone box; can be negative or above 100. */
  x: number;
  y: number;
  /** Depth in px in front of the screen. */
  z?: number;
}

export interface Phone3DProps {
  /** Content shown on the phone screen. */
  children?: ReactNode;
  /** Floating items placed in front of the phone. */
  chips?: PhoneChip[];
  /** Width in px. */
  width?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Phone3D({ children, chips = [], width = 220, className }: Phone3DProps) {
  const { ref, rotateX, rotateY, handlers, reduced } = useTilt({ max: 16 });
  const h = width * 2.05;
  const edge = 10;

  return (
    <div
      ref={ref}
      {...handlers}
      className={cn("relative select-none", className)}
      style={{ width, height: h, perspective: 1100 }}
    >
      <motion.div
        className="relative h-full w-full will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? -14 : rotateY,
        }}
      >
        {/* thickness: stacked outlines behind the front */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-[2.2rem] bg-depth-text/80"
            style={{ transform: `translateZ(${-(i + 1) * (edge / 8)}px)`, filter: `brightness(${1 - i * 0.04})` }}
          />
        ))}
        <div className="absolute inset-0 overflow-hidden rounded-[2.2rem] border-[7px] border-depth-text bg-depth-bg" style={{ transform: "translateZ(0.5px)" }}>
          <div className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-depth-text" />
          <div className="h-full w-full pt-8">{children}</div>
        </div>

        {chips.map((c, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${c.x}%`, top: `${c.y}%`, transform: `translateZ(${c.z ?? 60}px)` }}
          >
            {c.node}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
