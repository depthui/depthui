import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * IsometricGrid — tiles on an isometric plane. Hover (or tap) a tile and it
 * lifts off the surface, leaving its shadow behind.
 */
export interface IsometricGridProps {
  /** Content of each tile, filled row by row. */
  items: ReactNode[];
  /** Number of tiles per row. */
  columns?: number;
  /** Tile edge in px. */
  size?: number;
  /** Space between tiles in px. */
  gap?: number;
  /** How far a tile lifts, in px. */
  lift?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function IsometricGrid({
  items,
  columns = 3,
  size = 84,
  gap = 12,
  lift = 28,
  className,
}: IsometricGridProps) {
  const reduced = !!useReducedMotion();
  const rows = Math.ceil(items.length / columns);
  const side = Math.max(columns, rows) * (size + gap);

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ perspective: 2000, height: side * 0.8 }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${size}px)`,
          gap,
          transform: "rotateX(55deg) rotateZ(-45deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="relative"
            style={{ width: size, height: size, transformStyle: "preserve-3d" }}
          >
            <div aria-hidden className="absolute inset-0 rounded-xl bg-depth-text/10" />
            <motion.div
              whileHover={reduced ? undefined : { z: lift }}
              whileTap={reduced ? undefined : { z: lift }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl border border-depth-border bg-depth-surface text-center text-xs font-medium shadow-sm"
            >
              {item}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
