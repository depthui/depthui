import { motion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * Text3D — extruded headline built from stacked copies of the text.
 * It rotates with the pointer so the thickness is visible.
 */
export interface Text3DProps {
  /** Text to draw. */
  text: string;
  /** Number of stacked layers. More = smoother, but more DOM. */
  layers?: number;
  /** Distance between layers in px. */
  spacing?: number;
  /** Max rotation in degrees. */
  max?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Text3D({
  text,
  layers = 14,
  spacing = 1.6,
  max = 22,
  className,
}: Text3DProps) {
  const { ref, rotateX, rotateY, handlers, reduced } = useTilt({ max });
  const half = (layers * spacing) / 2;

  return (
    <div
      ref={ref}
      {...handlers}
      role="img"
      aria-label={text}
      className="inline-block cursor-default select-none"
      style={{ perspective: 900 }}
    >
      <motion.div
        aria-hidden
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative whitespace-nowrap text-6xl font-bold tracking-tight sm:text-7xl",
          className,
        )}
      >
        {Array.from({ length: layers }, (_, i) => (
          <span
            key={i}
            className="absolute inset-0"
            style={{
              transform: `translateZ(${i * spacing - half}px)`,
              color: `color-mix(in oklab, var(--depth-accent) ${
                35 + (i / layers) * 65
              }%, var(--depth-bg))`,
            }}
          >
            {text}
          </span>
        ))}
        <span
          className="relative inline-block text-depth-text"
          style={{ transform: `translateZ(${layers * spacing - half}px)` }}
        >
          {text}
        </span>
      </motion.div>
    </div>
  );
}
