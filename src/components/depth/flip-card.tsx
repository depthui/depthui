import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * FlipCard — two-sided card that rotates 180° on hover (desktop),
 * tap or Enter/Space (touch + keyboard).
 */
export interface FlipCardProps {
  /** Content on the front face. */
  front: ReactNode;
  /** Content on the back face. */
  back: ReactNode;
  /** Flip direction: "y" turns sideways, "x" turns top to bottom. */
  axis?: "x" | "y";
  /** What flips the card: "hover" or "click". */
  trigger?: "hover" | "click";
  /** CSS perspective distance in px. Lower values look more dramatic. */
  perspective?: number;
  /** Extra classes added to the outer element. */
  className?: string;
  /** Extra classes added to both faces. */
  faceClassName?: string;
}

export function FlipCard({
  front,
  back,
  axis = "y",
  trigger = "hover",
  perspective = 1000,
  className,
  faceClassName,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const rot = axis === "y" ? "rotateY" : "rotateX";

  const face = cn(
    "absolute inset-0 backface-hidden overflow-hidden rounded-2xl border border-depth-border bg-depth-surface p-6",
    faceClassName,
  );

  return (
    <div
      className={cn("h-64 w-64", className)}
      style={{ perspective }}
      onPointerEnter={(e) =>
        trigger === "hover" && e.pointerType !== "touch" && setFlipped(true)
      }
      onPointerLeave={(e) =>
        trigger === "hover" && e.pointerType !== "touch" && setFlipped(false)
      }
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        animate={{ [rot]: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-full w-full cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent"
      >
        <div className={face}>{front}</div>
        <div
          className={face}
          style={{ transform: `${rot}(180deg)` }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
