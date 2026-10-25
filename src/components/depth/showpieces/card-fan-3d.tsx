import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * CardFan3D — a hand of cards fanned in an arc. Hover or focus one and it
 * rises toward you while its neighbours part to make room. Each card is a
 * button, so the whole fan works with a keyboard (Tab or arrow keys).
 */
export interface CardFan3DProps {
  cards: ReactNode[];
  /** Card width in px. */
  width?: number;
  height?: number;
  /** Total angle of the fan in degrees. */
  spread?: number;
  onSelect?: (index: number) => void;
  className?: string;
  cardClassName?: string;
}

export function CardFan3D({
  cards,
  width = 150,
  height = 210,
  spread = 46,
  onSelect,
  className,
  cardClassName,
}: CardFan3DProps) {
  const reduced = !!useReducedMotion();
  const [hot, setHot] = useState<number | null>(null);
  const n = cards.length;
  const mid = (n - 1) / 2;
  const step = n > 1 ? spread / (n - 1) : 0;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 22 };

  return (
    <div
      role="group"
      aria-label="Cards"
      className={cn("relative mx-auto", className)}
      style={{ width: width * 1.9, height: height * 1.25, perspective: 1200 }}
      onPointerLeave={() => setHot(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setHot((h) => Math.min(n - 1, (h ?? -1) + 1));
        if (e.key === "ArrowLeft") setHot((h) => Math.max(0, (h ?? 1) - 1));
      }}
    >
      {cards.map((card, i) => {
        const a = (i - mid) * step;
        const isHot = hot === i;
        // push neighbours sideways away from the raised card
        const nudge = hot === null || isHot ? 0 : (i < hot ? -1 : 1) * Math.max(0, 22 - Math.abs(i - hot) * 5);
        return (
          <motion.button
            key={i}
            type="button"
            onPointerEnter={(e) => e.pointerType !== "touch" && setHot(i)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot((h) => (h === i ? null : h))}
            onClick={() => {
              setHot(i);
              onSelect?.(i);
            }}
            animate={{
              rotateZ: a,
              x: nudge,
              y: isHot ? -height * 0.22 : Math.abs(a) * 0.9,
              scale: isHot ? 1.08 : 1,
              z: isHot ? 80 : i,
            }}
            transition={spring}
            className={cn(
              "absolute bottom-0 left-1/2 overflow-hidden rounded-2xl border border-depth-border bg-depth-surface text-left shadow-[0_20px_34px_-18px_var(--depth-shadow)] outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-depth-accent",
              cardClassName,
            )}
            style={{
              width,
              height,
              marginLeft: -width / 2,
              transformOrigin: "50% 130%",
              zIndex: isHot ? 50 : i,
            }}
          >
            {card}
          </motion.button>
        );
      })}
    </div>
  );
}
