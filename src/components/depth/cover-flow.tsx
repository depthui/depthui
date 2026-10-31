import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * CoverFlow — the classic album-browser layout. The active item faces you,
 * the rest fan out and angle away. Click an item or use the arrow keys.
 */
export interface CoverFlowProps {
  /** Items shown in the row, one per slide. */
  items: ReactNode[];
  /** Width of each item in px. */
  itemWidth?: number;
  /** Height of each item in px. */
  itemHeight?: number;
  /** Horizontal distance between side items in px. */
  spacing?: number;
  /** Index shown first. Defaults to the middle. */
  initial?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function CoverFlow({
  items,
  itemWidth = 180,
  itemHeight = 240,
  spacing = 54,
  initial,
  className,
}: CoverFlowProps) {
  const reduced = !!useReducedMotion();
  const n = items.length;
  const [active, setActive] = useState(initial ?? Math.floor((n - 1) / 2));
  const go = (i: number) => setActive(Math.max(0, Math.min(n - 1, i)));

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Cover flow. Use the left and right arrow keys."
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent",
        className,
      )}
      style={{ height: itemHeight + 70, perspective: 1100 }}
    >
      {items.map((item, i) => {
        const offset = i - active;
        const sign = Math.sign(offset);
        const abs = Math.abs(offset);
        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Item ${i + 1} of ${n}`}
            aria-current={offset === 0}
            initial={false}
            animate={{
              x: offset === 0 ? 0 : offset * spacing + sign * itemWidth * 0.42,
              z: -abs * 70,
              rotateY: reduced || offset === 0 ? 0 : -sign * 58,
              scale: offset === 0 ? 1.04 : 1,
            }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
            style={{
              width: itemWidth,
              height: itemHeight,
              left: "50%",
              top: "50%",
              marginLeft: -itemWidth / 2,
              marginTop: -itemHeight / 2 - 10,
              zIndex: n - abs,
            }}
            className={cn(
              "absolute overflow-hidden rounded-2xl border bg-depth-surface text-left outline-none shadow-[0_20px_40px_-24px_var(--depth-shadow)]",
              offset === 0
                ? "border-depth-accent/60"
                : "border-depth-border opacity-90 hover:opacity-100",
            )}
          >
            {item}
          </motion.button>
        );
      })}

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {items.map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active ? "w-5 bg-depth-accent" : "w-1.5 bg-depth-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}
