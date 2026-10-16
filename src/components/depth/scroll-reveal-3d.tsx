import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

/**
 * ScrollReveal3D — a panel that starts tilted back and flattens as it scrolls
 * into view. Driven by scroll progress, so it never re-renders.
 */
export interface ScrollReveal3DProps {
  children: ReactNode;
  /** Starting tilt in degrees. */
  from?: number;
  /** Starting scale. */
  fromScale?: number;
  perspective?: number;
  className?: string;
}

export function ScrollReveal3D({
  children,
  from = 24,
  fromScale = 0.86,
  perspective = 1000,
  className,
}: ScrollReveal3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const scrollYProgress = useScrollProgress(ref, ["top", 1], ["bottom", 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [from, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [fromScale, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.4, 1]);

  return (
    <div ref={ref} className="w-full" style={{ perspective }}>
      <motion.div
        style={{
          rotateX: reduced ? 0 : rotateX,
          scale: reduced ? 1 : scale,
          opacity: reduced ? 1 : opacity,
          transformOrigin: "50% 0%",
        }}
        className={cn(
          "overflow-hidden rounded-2xl border border-depth-border bg-depth-surface shadow-[0_40px_80px_-40px_var(--depth-shadow)] will-change-transform",
          className,
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}
