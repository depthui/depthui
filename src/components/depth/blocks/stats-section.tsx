import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { TiltCard, TiltLayer } from "../tilt-card";
import { cn } from "@/lib/utils";

/**
 * StatsSection — big numbers that count up once when they scroll into view,
 * on cards that tilt toward the pointer. AnimatedCounter is exported too, for
 * use anywhere you want a number to count up.
 */
export interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Seconds. */
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.8,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = !!useReducedMotion();
  const mv = useMotionValue(0);

  const text = useTransform(mv, (v) => {
    const n = v.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${prefix}${n}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, value, duration, reduced, mv]);

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {text}
    </motion.span>
  );
}

export interface Stat extends Omit<AnimatedCounterProps, "className"> {
  label: string;
}

export interface StatsSectionProps {
  stats: Stat[];
  className?: string;
}

export function StatsSection({ stats, className }: StatsSectionProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {stats.map(({ label, ...counter }) => (
        <TiltCard
          key={label}
          max={8}
          containerClassName="block"
          className="w-full px-4 py-7 text-center"
        >
          <TiltLayer z={40} className="text-3xl font-bold tracking-tight sm:text-4xl">
            <AnimatedCounter {...counter} className="bg-gradient-to-br from-depth-accent to-depth-accent-2 bg-clip-text text-transparent" />
          </TiltLayer>
          <TiltLayer z={18} className="mt-2 text-sm text-depth-muted">
            {label}
          </TiltLayer>
        </TiltCard>
      ))}
    </div>
  );
}
