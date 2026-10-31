import { createContext, useContext, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * DepthStack — layers that parallax against each other as the pointer moves.
 * Each <DepthLayer depth={0..1}> shifts proportionally; higher = closer to viewer.
 */

interface StackCtx {
  x: MotionValue<number>;
  y: MotionValue<number>;
  strength: number;
  reduced: boolean;
}
const Ctx = createContext<StackCtx | null>(null);

export interface DepthStackProps {
  /** DepthLayer elements to stack. */
  children: ReactNode;
  /** Max layer shift in px at depth = 1. */
  strength?: number;
  /** Tilt of the whole stack in degrees. */
  tilt?: number;
  /** CSS perspective distance in px. Lower values look more dramatic. */
  perspective?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function DepthStack({
  children,
  strength = 40,
  tilt = 8,
  perspective = 1000,
  className,
}: DepthStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const x = useSpring(rx, { stiffness: 160, damping: 20 });
  const y = useSpring(ry, { stiffness: 160, damping: 20 });
  const rotateX = useTransform(y, [-0.5, 0.5], [tilt, -tilt]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-tilt, tilt]);

  return (
    <div
      className={cn("relative h-72 w-full max-w-xl", className)}
      style={{ perspective }}
    >
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          if (reduced || e.pointerType === "touch") return;
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          rx.set((e.clientX - r.left) / r.width - 0.5);
          ry.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full overflow-visible rounded-2xl border border-depth-border bg-depth-surface"
      >
        <Ctx.Provider value={{ x, y, strength, reduced }}>{children}</Ctx.Provider>
      </motion.div>
    </div>
  );
}

export interface DepthLayerProps {
  /** How far the layer sits from the back, from 0 to 1. Higher moves more. */
  depth?: number;
  /** Content shown in this layer. */
  children?: ReactNode;
  /** Extra classes added to the layer. */
  className?: string;
}

export function DepthLayer({ depth = 0.5, children, className }: DepthLayerProps) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("DepthLayer must be used inside <DepthStack>");
  const { x, y, strength, reduced } = ctx;
  const tx = useTransform(x, [-0.5, 0.5], [-strength * depth, strength * depth]);
  const ty = useTransform(y, [-0.5, 0.5], [-strength * depth, strength * depth]);

  return (
    <motion.div
      className={cn("absolute inset-0 flex items-center justify-center", className)}
      style={{
        x: reduced ? 0 : tx,
        y: reduced ? 0 : ty,
        z: depth * 80,
      }}
    >
      {children}
    </motion.div>
  );
}
