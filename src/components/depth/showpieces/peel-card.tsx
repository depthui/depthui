import { useState, type ReactNode } from "react";
import { motion, useMotionTemplate, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * PeelCard — a card with a curling corner. Hover, focus or tap and the
 * bottom-right corner peels back to show what is underneath. The peel is
 * drawn with clip-path, which repaints, so it is kept to one small card and
 * only runs on interaction: a documented exception to the transform-only rule.
 */
export interface PeelCardProps {
  /** The top face. */
  children: ReactNode;
  /** What is hidden underneath. */
  reveal: ReactNode;
  /** Width of the card in px. */
  width?: number;
  /** Height of the card in px. */
  height?: number;
  /** How far the corner peels, in px. */
  peel?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function PeelCard({
  children,
  reveal,
  width = 280,
  height = 340,
  peel = 150,
  className,
}: PeelCardProps) {
  const reduced = !!useReducedMotion();
  const [open, setOpen] = useState(false);
  const s = useSpring(14, { stiffness: 170, damping: 20 });

  const set = (v: boolean) => {
    setOpen(v);
    s.set(v ? peel : 14);
    if (reduced) s.jump(v ? peel : 14);
  };

  const W = width;
  const H = height;
  const front = useMotionTemplate`polygon(0 0, ${W}px 0, ${W}px calc(${H}px - ${s}px), calc(${W}px - ${s}px) ${H}px, 0 ${H}px)`;
  const flap = useMotionTemplate`polygon(${W}px calc(${H}px - ${s}px), calc(${W}px - ${s}px) ${H}px, calc(${W}px - ${s}px) calc(${H}px - ${s}px))`;

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? "Hide hidden content" : "Peel the corner to see more"}
      onPointerEnter={(e) => e.pointerType !== "touch" && set(true)}
      onPointerLeave={() => set(false)}
      onFocus={() => set(true)}
      onBlur={() => set(false)}
      onClick={() => set(!open)}
      className={cn(
        "relative block overflow-hidden rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg",
        className,
      )}
      style={{ width, height }}
    >
      {/* underneath */}
      <span className="absolute inset-0 block rounded-2xl border border-depth-border bg-gradient-to-br from-depth-accent to-depth-accent-2 p-5 text-white">
        {reveal}
      </span>
      {/* top face with the corner cut away */}
      <motion.span
        className="absolute inset-0 block rounded-2xl border border-depth-border bg-depth-surface p-5"
        style={{ clipPath: front }}
      >
        {children}
      </motion.span>
      {/* the curled flap: the back of the corner, lit from the fold */}
      <motion.span
        aria-hidden
        className="absolute inset-0 block"
        style={{
          clipPath: flap,
          background: "linear-gradient(135deg, var(--depth-elevated), var(--depth-border))",
          filter: "drop-shadow(-6px -6px 8px rgba(0,0,0,.22))",
        }}
      />
    </button>
  );
}
