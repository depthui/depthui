import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SpotlightCard } from "../spotlight-card";
import { AnimatedCounter } from "../blocks/stats-section";
import { cn } from "@/lib/utils";

/**
 * MetricCard — a KPI tile. The number counts up and the sparkline draws
 * itself when the card scrolls into view. Needs SpotlightCard and
 * blocks/stats-section (for AnimatedCounter).
 */
export interface MetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Change versus the previous period, in percent. */
  delta?: number;
  /** Points for the sparkline. At least two. */
  data: number[];
  className?: string;
}

function Sparkline({ data }: { data: number[] }) {
  const id = useId();
  const reduced = !!useReducedMotion();
  const w = 120;
  const h = 40;
  const pad = 2;
  const min = Math.min(...data);
  const span = Math.max(...data) - min || 1;
  const pts = data.map((v, i) => [
    pad + (i * (w - pad * 2)) / Math.max(data.length - 1, 1),
    h - pad - ((v - min) / span) * (h - pad * 2),
  ]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${h} L${pts[0][0].toFixed(1)} ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-12 w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--depth-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--depth-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#${id})`}
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--depth-accent)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

export function MetricCard({
  label,
  value,
  prefix,
  suffix,
  decimals,
  delta,
  data,
  className,
}: MetricCardProps) {
  const up = (delta ?? 0) >= 0;

  return (
    <SpotlightCard className={cn("w-64", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-depth-muted">{label}</p>
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              up ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400",
            )}
          >
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={up ? "" : "rotate-180"}>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span className="sr-only">{up ? "Up" : "Down"} </span>
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </p>
      <div className="mt-4">
        <Sparkline data={data} />
      </div>
    </SpotlightCard>
  );
}
