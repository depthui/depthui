import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * DotGlow — a dot grid that lights up in a soft circle around the pointer.
 * Two layers of dots: a quiet one, and a bright one revealed by a mask that
 * follows the pointer. Pointer movement is a motion value, so nothing
 * re-renders.
 */
export interface DotGlowProps {
  /** Content shown on top of the dots. */
  children?: ReactNode;
  /** Distance between dots in px. */
  spacing?: number;
  /** Radius of the lit area in px. */
  radius?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function DotGlow({ children, spacing = 24, radius = 170, className }: DotGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const mask = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, black, transparent)`;

  const dots = (color: string): CSSProperties => ({
    backgroundImage: `radial-gradient(circle, ${color} 1.3px, transparent 1.7px)`,
    backgroundSize: `${spacing}px ${spacing}px`,
  });

  return (
    <div
      ref={ref}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        rect.current = ref.current?.getBoundingClientRect() ?? null;
      }}
      onPointerMove={(e) => {
        const r = rect.current;
        if (!r || e.pointerType === "touch") return;
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        rect.current = null;
        x.set(-9999);
        y.set(-9999);
      }}
      className={cn("relative isolate overflow-hidden", className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={dots("var(--depth-border)")} />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ ...dots("var(--depth-accent)"), maskImage: mask, WebkitMaskImage: mask }}
      />
      {children}
    </div>
  );
}
