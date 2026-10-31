import { useRef, type ReactNode } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Extrude3D — gives any flat content real thickness by stacking copies of it
 * along Z, shaded from the front colour down to a dark back. It sways side to
 * side on its own and you can drag it to look around; it springs back when
 * you let go. Use text, an SVG or an icon that draws with `currentColor`.
 * The extra copies are hidden from screen readers.
 */
export interface Extrude3DProps {
  /** Text, SVG or icon to extrude. It should draw with currentColor. */
  children: ReactNode;
  /** Total thickness in px. */
  depth?: number;
  /** Number of stacked copies. More is smoother. */
  layers?: number;
  /** Colour of the front face. Any CSS colour. */
  color?: string;
  /** Colour at the back of the extrusion. */
  sideColor?: string;
  /** Maximum idle sway in degrees. 0 disables. */
  sway?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Extrude3D({
  children,
  depth = 26,
  layers = 14,
  color = "var(--depth-accent)",
  sideColor = "color-mix(in oklab, var(--depth-accent) 35%, black)",
  sway = 28,
  className,
}: Extrude3DProps) {
  const reduced = !!useReducedMotion();
  const idle = useMotionValue(0);
  const dragY = useMotionValue(0);
  const dragX = useMotionValue(0);
  const springY = useSpring(dragY, { stiffness: 120, damping: 14 });
  const springX = useSpring(dragX, { stiffness: 120, damping: 14 });
  const rotateY = useTransform([idle, springY], ([a, b]: number[]) => a + b);
  const dragging = useRef(false);
  const t = useRef(0);

  useAnimationFrame((_, delta) => {
    if (reduced || dragging.current || !sway) return;
    t.current += delta / 1000;
    idle.set(Math.sin(t.current * 0.9) * sway);
  });

  const count = Math.max(2, layers);
  return (
    <div className={cn("inline-block touch-none select-none", className)} style={{ perspective: 900 }}>
      <motion.div
        onPanStart={() => (dragging.current = true)}
        onPan={(_, info) => {
          dragY.set(Math.max(-80, Math.min(80, dragY.get() + info.delta.x * 0.5)));
          dragX.set(Math.max(-50, Math.min(50, dragX.get() - info.delta.y * 0.5)));
        }}
        onPanEnd={() => {
          dragging.current = false;
          dragY.set(0);
          dragX.set(0);
        }}
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          transformStyle: "preserve-3d",
          rotateY,
          rotateX: springX,
        }}
      >
        {Array.from({ length: count }, (_, i) => {
          const front = i === count - 1;
          const k = i / (count - 1); // 0 back, 1 front
          return (
            <div
              key={i}
              aria-hidden={front ? undefined : true}
              className={front ? "relative" : "absolute inset-0"}
              style={{
                color: front ? color : `color-mix(in oklab, ${color} ${Math.round(k * 100)}%, ${sideColor})`,
                transform: `translateZ(${(k - 1) * depth}px)`,
              }}
            >
              {children}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
