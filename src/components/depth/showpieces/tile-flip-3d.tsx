import { useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * TileFlip3D — a picture cut into tiles that flip over to a second picture in
 * a ripple that starts where you click and spreads outward. Click again to
 * flip back. Each tile is a plain transform, so it stays smooth.
 */
export interface TileFlip3DProps {
  /** Content shown on the front side of the tiles. */
  front: ReactNode;
  /** Content shown on the back side of the tiles. */
  back: ReactNode;
  /** Number of tile columns. */
  cols?: number;
  /** Number of tile rows. */
  rows?: number;
  /** Total width in px. */
  width?: number;
  /** Total height in px. */
  height?: number;
  /** Ripple speed: seconds of delay per tile of distance. */
  stagger?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function TileFlip3D({ front, back, cols = 6, rows = 4, width = 360, height = 240, stagger = 0.06, className }: TileFlip3DProps) {
  const reduced = !!useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const origin = useRef({ c: 0, r: 0 });
  const tw = width / cols;
  const th = height / rows;

  const trigger = (c: number, r: number) => {
    origin.current = { c, r };
    setFlipped((f) => !f);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? "Flip the picture back" : "Flip the picture"}
      className={cn("relative cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg", className)}
      style={{ width, height, perspective: 1100 }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); trigger(Math.floor(cols / 2), Math.floor(rows / 2)); } }}
    >
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const dist = Math.hypot(c - origin.current.c, r - origin.current.r);
        return (
          <motion.div
            key={i}
            className="absolute will-change-transform"
            style={{ left: c * tw, top: r * th, width: tw, height: th, transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 110, damping: 15, delay: dist * stagger }}
            onClick={() => trigger(c, r)}
          >
            <div className="absolute inset-0 overflow-hidden backface-hidden">
              <div className="absolute" style={{ left: -c * tw, top: -r * th, width, height }}>{front}</div>
            </div>
            <div className="absolute inset-0 overflow-hidden backface-hidden" style={{ transform: "rotateY(180deg)" }}>
              <div className="absolute" style={{ left: -c * tw, top: -r * th, width, height }}>{back}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
