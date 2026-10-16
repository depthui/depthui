import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * Button3D — an extruded button that leans toward the pointer
 * and physically presses down when clicked.
 */
export interface Button3DProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: ReactNode;
  /** Extrusion height in px. */
  depth?: number;
  /** Max lean in degrees. */
  max?: number;
  variant?: "accent" | "neutral";
}

export function Button3D({
  children,
  depth = 8,
  max = 10,
  variant = "accent",
  className,
  ...props
}: Button3DProps) {
  const { ref, rotateX, rotateY, handlers, reduced } = useTilt({ max });

  const faceClass =
    variant === "accent"
      ? "bg-depth-accent text-white"
      : "border border-depth-border bg-depth-surface text-depth-text";
  const sideColor =
    variant === "accent"
      ? "color-mix(in oklab, var(--depth-accent) 60%, black)"
      : "var(--depth-border)";

  return (
    <div
      ref={ref}
      {...handlers}
      className="inline-block"
      style={{ perspective: 700 }}
    >
      <motion.div
        className="relative"
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformStyle: "preserve-3d",
          paddingBottom: depth,
        }}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 rounded-xl"
          style={{ top: depth, bottom: 0, background: sideColor }}
        />
        <motion.button
          whileTap={{ y: depth - 2 }}
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
          className={cn(
            "relative rounded-xl px-6 py-3 font-medium outline-none",
            "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg",
            faceClass,
            className,
          )}
          {...props}
        >
          {children}
        </motion.button>
      </motion.div>
    </div>
  );
}
