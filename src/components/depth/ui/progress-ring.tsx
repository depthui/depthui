import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedCounter } from "../blocks/stats-section";
import { cn } from "@/lib/utils";

/**
 * ProgressRing — a circular gauge. The ring draws itself and the number
 * counts up when it scrolls into view. Needs blocks/stats-section for
 * AnimatedCounter. Exposed as a `progressbar` for screen readers.
 */
export interface ProgressRingProps {
  /** 0 to 100. */
  value: number;
  /** Diameter in px. */
  size?: number;
  /** Ring thickness in px. */
  thickness?: number;
  label?: ReactNode;
  className?: string;
}

export function ProgressRing({
  value,
  size = 140,
  thickness = 10,
  label,
  className,
}: ProgressRingProps) {
  const id = useId();
  const reduced = !!useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - thickness) / 2;

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--depth-accent)" />
            <stop offset="100%" stopColor="var(--depth-accent-2)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--depth-border)" strokeWidth={thickness} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          initial={reduced ? { pathLength: clamped / 100 } : { pathLength: 0 }}
          whileInView={{ pathLength: clamped / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold tracking-tight">
          <AnimatedCounter value={clamped} suffix="%" />
        </span>
        {label && <span className="mt-0.5 text-xs text-depth-muted">{label}</span>}
      </div>
    </div>
  );
}
