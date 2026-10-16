import type { ReactNode } from "react";
import { motion, useMotionTemplate, useTransform } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * HoloCard — a collectible-style card with a rainbow foil and a specular
 * shine that slide across the surface as you move the pointer.
 */
export interface HoloCardProps {
  children?: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  perspective?: number;
}

const FOIL =
  "linear-gradient(115deg, transparent 20%, rgb(255 0 128 / 0.55) 34%, rgb(255 220 0 / 0.55) 42%, rgb(0 255 160 / 0.55) 50%, rgb(0 160 255 / 0.55) 58%, rgb(160 0 255 / 0.55) 66%, transparent 80%)";

export function HoloCard({
  children,
  className,
  max = 14,
  perspective = 900,
}: HoloCardProps) {
  const { ref, x, y, rotateX, rotateY, handlers, reduced } = useTilt({ max });
  const px = useTransform(x, [0, 1], [0, 100]);
  const py = useTransform(y, [0, 1], [0, 100]);
  const foilPos = useMotionTemplate`${px}% ${py}%`;
  const shine = useMotionTemplate`radial-gradient(circle at ${px}% ${py}%, rgb(255 255 255 / 0.55), transparent 55%)`;

  return (
    <div
      ref={ref}
      {...handlers}
      className="inline-block"
      style={{ perspective }}
    >
      <motion.div
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "group relative h-80 w-60 overflow-hidden rounded-2xl border border-depth-border bg-depth-surface shadow-[0_30px_60px_-30px_var(--depth-shadow)] will-change-transform",
          className,
        )}
      >
        <div className="relative z-10 h-full">{children}</div>
        <motion.div
          aria-hidden
          style={{
            backgroundImage: FOIL,
            backgroundSize: "300% 300%",
            backgroundPosition: foilPos,
          }}
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-100 dark:mix-blend-color-dodge"
        />
        <motion.div
          aria-hidden
          style={{ background: shine }}
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
        />
      </motion.div>
    </div>
  );
}
