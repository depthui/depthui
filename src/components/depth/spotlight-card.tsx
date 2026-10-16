import { useRef, type HTMLAttributes } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * SpotlightCard — a soft light and a glowing border follow the pointer.
 * Pure motion values, so moving the mouse never re-renders React.
 */
export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Radius of the spotlight in px. */
  radius?: number;
}

export function SpotlightCard({
  radius = 260,
  className,
  children,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spot = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, var(--depth-spot), transparent 75%)`;
  const edge = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, var(--depth-accent), transparent 70%)`;

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
      className={cn("group relative rounded-2xl bg-depth-border p-px", className)}
      {...props}
    >
      <motion.div
        aria-hidden
        style={{ background: edge }}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative h-full rounded-[15px] bg-depth-surface p-6">
        <motion.div
          aria-hidden
          style={{ background: spot }}
          className="pointer-events-none absolute inset-0 rounded-[15px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}
