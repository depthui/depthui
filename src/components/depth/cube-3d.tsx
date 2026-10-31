import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Cube3D — six-faced cube. Auto-rotates, drag to spin it yourself.
 * Auto-rotation pauses while dragging and stops under prefers-reduced-motion.
 */
export interface Cube3DProps {
  /** Faces in order: front, right, back, left, top, bottom. */
  faces: ReactNode[];
  /** Edge length in px. */
  size?: number;
  /** Degrees per second of idle rotation on Y. 0 disables. */
  speed?: number;
  /** Perspective distance in px. Lower values look more dramatic. */
  perspective?: number;
  /** Extra classes added to the outer element. */
  className?: string;
  /** Extra classes added to each face. */
  faceClassName?: string;
}

export function Cube3D({
  faces,
  size = 180,
  speed = 18,
  perspective = 900,
  className,
  faceClassName,
}: Cube3DProps) {
  const reduced = !!useReducedMotion();
  const rotX = useMotionValue(-20);
  const rotY = useMotionValue(30);
  const dragging = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduced || dragging.current || !speed) return;
    rotY.set(rotY.get() + (speed * delta) / 1000);
  });

  const half = size / 2;
  const transforms = [
    `translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  const faceStyle: CSSProperties = { width: size, height: size };

  return (
    <div
      className={cn("touch-none select-none", className)}
      style={{ perspective, width: size, height: size }}
    >
      <motion.div
        onPanStart={() => (dragging.current = true)}
        onPan={(_, info) => {
          rotY.set(rotY.get() + info.delta.x * 0.6);
          rotX.set(Math.max(-80, Math.min(80, rotX.get() - info.delta.y * 0.6)));
        }}
        onPanEnd={() => (dragging.current = false)}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: "preserve-3d",
          width: size,
          height: size,
        }}
        className="relative cursor-grab active:cursor-grabbing"
      >
        {faces.slice(0, 6).map((content, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-lg border border-depth-border bg-depth-elevated/90 text-center backface-hidden",
              faceClassName,
            )}
            style={{ ...faceStyle, transform: transforms[i] }}
          >
            {content}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
