import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ProgressBar3D — a raised, glossy progress bar. The fill is a full-width bar
 * scaled with a transform (no layout work), with a moving sheen. Leave `value`
 * out for an indeterminate bar. A real `role="progressbar"`.
 */
export interface ProgressBar3DProps {
  /** 0 to max. Omit for indeterminate. */
  value?: number;
  /** Value at which the bar is full. */
  max?: number;
  /** Text above the bar. Also names it for screen readers. */
  label?: string;
  /** Show the percentage next to the label. */
  showValue?: boolean;
  /** Bar thickness: "sm", "md" or "lg". */
  size?: "sm" | "md" | "lg";
  /** Extra classes added to the outer element. */
  className?: string;
}

const H = { sm: "h-2", md: "h-3.5", lg: "h-5" } as const;

export function ProgressBar3D({ value, max = 100, label, showValue = true, size = "md", className }: ProgressBar3DProps) {
  const reduced = !!useReducedMotion();
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.min(1, Math.max(0, value / max));
  return (
    <div className={cn("w-full", className)}>
      {(label || (showValue && !indeterminate)) && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span>{label}</span>
          {showValue && !indeterminate && <span className="tabular-nums text-depth-muted">{Math.round(pct * 100)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label ?? "Progress"}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        className={cn("relative overflow-hidden rounded-full bg-depth-border shadow-[inset_0_2px_4px_rgb(0_0_0/0.25)]", H[size])}
      >
        {indeterminate ? (
          <motion.div
            className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-gradient-to-r from-depth-accent to-depth-accent-2"
            animate={reduced ? undefined : { x: ["-100%", "250%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <motion.div
            className="absolute inset-0 origin-left overflow-hidden rounded-full bg-gradient-to-r from-depth-accent to-depth-accent-2 shadow-[inset_0_1px_1px_rgb(255_255_255/0.5)]"
            initial={false}
            animate={{ scaleX: pct }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 22 }}
          >
            {!reduced && <span aria-hidden className="depth-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />}
          </motion.div>
        )}
      </div>
    </div>
  );
}
