import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * TextCylinder3D — words arranged around a vertical cylinder that turns like
 * a slot reel. Drag to spin it, it pauses on hover and focus, and it holds
 * still under prefers-reduced-motion. Side words fade out with a mask.
 */
export interface TextCylinder3DProps {
  words: string[];
  /** Height of one row in px. */
  itemHeight?: number;
  /** Degrees per second. 0 disables. */
  speed?: number;
  className?: string;
  wordClassName?: string;
}

export function TextCylinder3D({
  words,
  itemHeight = 56,
  speed = 22,
  className,
  wordClassName,
}: TextCylinder3DProps) {
  const reduced = !!useReducedMotion();
  const rot = useMotionValue(0);
  const paused = useRef(false);
  const n = Math.max(words.length, 3);
  const step = 360 / n;
  const radius = itemHeight / 2 / Math.tan(Math.PI / n);
  const visible = itemHeight * 3;

  useAnimationFrame((_, delta) => {
    if (reduced || paused.current || !speed) return;
    rot.set(rot.get() - (speed * delta) / 1000);
  });

  return (
    <div
      className={cn("relative touch-none select-none", className)}
      style={{
        height: visible,
        perspective: 700,
        maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
      }}
      onPointerEnter={(e) => e.pointerType !== "touch" && (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <span className="sr-only">{words.join(", ")}</span>
      <motion.div
        aria-hidden
        onPanStart={() => (paused.current = true)}
        onPan={(_, info) => rot.set(rot.get() - info.delta.y * 0.6)}
        onPanEnd={() => (paused.current = false)}
        className="absolute inset-x-0 cursor-grab active:cursor-grabbing"
        style={{
          top: itemHeight,
          height: itemHeight,
          transformStyle: "preserve-3d",
          rotateX: rot,
        }}
      >
        {Array.from({ length: n }, (_, i) => (
          <div
            key={i}
            className={cn(
              "backface-hidden absolute inset-0 flex items-center justify-center whitespace-nowrap text-3xl font-bold tracking-tight",
              wordClassName,
            )}
            style={{ transform: `rotateX(${i * step}deg) translateZ(${radius}px)` }}
          >
            {words[i % words.length]}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
