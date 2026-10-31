import { useCallback, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Carousel3D — items arranged on a ring that rotates to the active slide.
 * Arrow keys and buttons navigate; clicking a side card brings it forward.
 */
export interface Carousel3DProps {
  /** Cards placed around the ring. */
  items: ReactNode[];
  /** Width of each card in px. */
  itemWidth?: number;
  /** Height of each card in px. */
  itemHeight?: number;
  /** Gap multiplier on the ring radius (1 = cards just touch). */
  spread?: number;
  /** CSS perspective distance in px. Lower values look more dramatic. */
  perspective?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Carousel3D({
  items,
  itemWidth = 220,
  itemHeight = 280,
  spread = 1.15,
  perspective = 1400,
  className,
}: Carousel3DProps) {
  const reduced = !!useReducedMotion();
  const n = items.length;
  const step = 360 / n;
  const radius = Math.round((itemWidth / 2 / Math.tan(Math.PI / n)) * spread);
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: number) => setIndex((i) => i + dir),
    [],
  );
  const active = ((index % n) + n) % n;

  return (
    <div
      className={cn("flex flex-col items-center gap-6 outline-none", className)}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div
        style={{ perspective, height: itemHeight + 40, width: "100%" }}
        className="flex items-center justify-center overflow-hidden"
      >
        <motion.div
          animate={{ rotateY: -index * step }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 70, damping: 16 }
          }
          style={{
            transformStyle: "preserve-3d",
            width: itemWidth,
            height: itemHeight,
            // Push the whole ring back so the active card sits at z = 0.
            translateZ: -radius,
          }}
          className="relative"
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1} of ${n}`}
              aria-current={i === active}
              onClick={() => {
                // shortest path to clicked slide
                let diff = i - active;
                if (diff > n / 2) diff -= n;
                if (diff < -n / 2) diff += n;
                go(diff);
              }}
              style={{
                width: itemWidth,
                height: itemHeight,
                transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
              }}
              className={cn(
                "absolute inset-0 overflow-hidden rounded-2xl border bg-depth-surface text-left backface-hidden transition-opacity duration-300",
                i === active
                  ? "border-depth-accent/60 opacity-100"
                  : "border-depth-border opacity-60 hover:opacity-90",
              )}
            >
              {item}
            </button>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="rounded-full border border-depth-border bg-depth-elevated px-4 py-2 text-sm hover:border-depth-accent"
        >
          Prev
        </button>
        <span className="font-mono text-xs text-depth-muted">
          {active + 1} / {n}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          className="rounded-full border border-depth-border bg-depth-elevated px-4 py-2 text-sm hover:border-depth-accent"
        >
          Next
        </button>
      </div>
    </div>
  );
}
