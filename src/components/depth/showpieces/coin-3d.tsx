import { useState, type ReactNode } from "react";
import { motion, useSpring } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * Coin3D — a thick coin with a real rim, built by stacking thin discs.
 * It tilts with the pointer and flips with a spring on click, Enter or Space.
 */
export interface Coin3DProps {
  front: ReactNode;
  back?: ReactNode;
  /** Diameter in px. */
  size?: number;
  /** Rim thickness in px. */
  thickness?: number;
  className?: string;
}

export function Coin3D({ front, back, size = 170, thickness = 16, className }: Coin3DProps) {
  const { ref, rotateX, rotateY, handlers, reduced } = useTilt({ max: 16 });
  const [flips, setFlips] = useState(0);
  const flip = useSpring(0, { stiffness: 120, damping: 14 });

  const toggle = () => {
    const next = flips + 1;
    setFlips(next);
    flip.set(next * 180);
  };

  const slices = Math.max(6, Math.round(thickness));
  const faceCls =
    "backface-hidden absolute inset-0 flex items-center justify-center rounded-full border border-depth-border text-center";

  return (
    <div
      ref={ref}
      {...handlers}
      role="button"
      tabIndex={0}
      aria-label={`Flip coin, showing ${flips % 2 === 0 ? "front" : "back"}`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      className={cn(
        "cursor-pointer select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg",
        className,
      )}
      style={{ width: size, height: size, perspective: 900 }}
    >
      <motion.div
        className="relative h-full w-full will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", rotateY: reduced ? flips * 180 : flip }}
        >
          {Array.from({ length: slices }, (_, i) => (
            <div
              key={i}
              aria-hidden
              className="absolute inset-0 rounded-full bg-depth-border"
              style={{
                transform: `translateZ(${-thickness / 2 + (thickness * i) / (slices - 1)}px)`,
                filter: i % 2 ? "brightness(0.9)" : undefined,
              }}
            />
          ))}
          <div
            className={cn(faceCls, "bg-gradient-to-br from-depth-accent/30 via-depth-elevated to-depth-accent-2/30")}
            style={{ transform: `translateZ(${thickness / 2}px)` }}
          >
            {front}
          </div>
          <div
            className={cn(faceCls, "bg-gradient-to-br from-depth-accent-2/30 via-depth-elevated to-depth-accent-3/30")}
            style={{ transform: `rotateY(180deg) translateZ(${thickness / 2}px)` }}
          >
            {back ?? front}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
