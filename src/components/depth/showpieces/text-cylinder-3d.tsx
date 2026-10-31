import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * TextCylinder3D — words arranged around a vertical cylinder that turns like
 * a slot reel. The word facing you is bright and sharp; the rest fall away
 * in size and opacity as they turn. Drag to spin, it pauses on hover and
 * focus, and it holds still under prefers-reduced-motion.
 */
export interface TextCylinder3DProps {
  /** Words printed around the cylinder, one per row. */
  words: string[];
  /** Height of one row in px. */
  itemHeight?: number;
  /** Degrees per second. 0 disables. */
  speed?: number;
  /** Extra classes added to the outer element. */
  className?: string;
  /** Extra classes added to each word. */
  wordClassName?: string;
}

export function TextCylinder3D({
  words,
  itemHeight = 64,
  speed = 24,
  className,
  wordClassName,
}: TextCylinder3DProps) {
  const reduced = !!useReducedMotion();
  const rot = useMotionValue(0);
  const paused = useRef(false);
  // At least 8 faces so neighbours stay close enough to read as one reel.
  const n = Math.max(words.length, 8);
  const step = 360 / n;
  const radius = itemHeight / 2 / Math.tan(Math.PI / n);
  const height = itemHeight * 5;

  useAnimationFrame((_, delta) => {
    if (reduced || paused.current || !speed) return;
    rot.set(rot.get() - (speed * delta) / 1000);
  });

  return (
    <div
      className={cn("relative touch-none select-none", className)}
      style={{ height, perspective: 900 }}
      onPointerEnter={(e) => e.pointerType !== "touch" && (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <span className="sr-only">{words.join(", ")}</span>
      <motion.div
        aria-hidden
        onPanStart={() => (paused.current = true)}
        onPan={(_, info) => rot.set(rot.get() - info.delta.y * 0.5)}
        onPanEnd={() => (paused.current = false)}
        className="absolute inset-x-0 cursor-grab active:cursor-grabbing"
        style={{
          top: itemHeight * 2,
          height: itemHeight,
          transformStyle: "preserve-3d",
          rotateX: rot,
        }}
      >
        {Array.from({ length: n }, (_, i) => (
          <Face
            key={i}
            rot={rot}
            angle={i * step}
            radius={radius}
            className={wordClassName}
            reduced={reduced}
          >
            {words[i % words.length]}
          </Face>
        ))}
      </motion.div>
    </div>
  );
}

function Face({
  rot,
  angle,
  radius,
  reduced,
  className,
  children,
}: {
  rot: MotionValue<number>;
  angle: number;
  radius: number;
  reduced: boolean;
  className?: string;
  children: string;
}) {
  // 1 when this face points at the viewer, 0 when it is side-on.
  const facing = useTransform(rot, (r) => Math.max(0, Math.cos(((r + angle) * Math.PI) / 180)));
  const opacity = useTransform(facing, (f) => (reduced ? 1 : 0.12 + 0.88 * f * f));
  return (
    <motion.div
      className={cn(
        "backface-hidden absolute inset-0 flex items-center justify-center whitespace-nowrap text-4xl font-bold tracking-tight",
        className,
      )}
      style={{ transform: `rotateX(${angle}deg) translateZ(${radius}px)`, opacity }}
    >
      {children}
    </motion.div>
  );
}
