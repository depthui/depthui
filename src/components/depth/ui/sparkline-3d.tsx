import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Sparkline3D — a tiny trend line for dashboards and tables. The line draws
 * itself in, with an optional soft area under it and a dot on the latest
 * value. It is an image for screen readers with a summary label, so give it a
 * label that says what the numbers are.
 */
export interface Sparkline3DProps {
  /** The values to plot, oldest first. Needs at least two. */
  data: number[];
  /** Width in pixels. */
  width?: number;
  /** Height in pixels. */
  height?: number;
  /** Colour of the line. */
  tone?: "accent" | "success" | "danger" | "neutral";
  /** Fill the area under the line. */
  area?: boolean;
  /** Round the corners of the line. */
  smooth?: boolean;
  /** Describes the data for screen readers, such as "Weekly visitors". A summary of the trend is added. */
  "aria-label"?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

const TONES = { accent: "text-depth-accent", success: "text-emerald-500", danger: "text-red-500", neutral: "text-depth-muted" } as const;

export function Sparkline3D({ data, width = 120, height = 36, tone = "accent", area = true, smooth = true, "aria-label": label = "Trend", className }: Sparkline3DProps) {
  const reduced = !!useReducedMotion();
  const id = useId();
  if (data.length < 2) return null;
  const pad = 3;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [pad + (i / (data.length - 1)) * (width - pad * 2), pad + (1 - (v - min) / span) * (height - pad * 2)] as const);
  const line = smooth
    ? pts.reduce((d, [x, y], i) => {
        if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
        const [px, py] = pts[i - 1];
        const mx = ((px + x) / 2).toFixed(1);
        return `${d} C${mx},${py.toFixed(1)} ${mx},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
      }, "")
    : pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const change = data[data.length - 1] - data[0];
  const summary = `${label}: from ${data[0]} to ${data[data.length - 1]}, ${change > 0 ? "up" : change < 0 ? "down" : "flat"}`;

  return (
    <svg role="img" aria-label={summary} viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={cn("overflow-visible", TONES[tone], className)}>
      {area && (
        <>
          <defs>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d={`${line} L${last[0].toFixed(1)},${height} L${pts[0][0].toFixed(1)},${height} Z`} fill={`url(#${id}g)`} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} />
        </>
      )}
      <motion.path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "easeOut" }} />
      <motion.circle cx={last[0]} cy={last[1]} r="3" fill="currentColor" stroke="var(--depth-surface)" strokeWidth="1.5" initial={reduced ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring", stiffness: 400, damping: 20 }} style={{ transformOrigin: `${last[0]}px ${last[1]}px` }} />
    </svg>
  );
}
