import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * NumberTicker3D — a number whose digits roll like an odometer. Each digit is
 * a strip of 0 to 9 that slides with a transform (no layout work). It rolls up
 * from zero when it scrolls into view, and rolls again whenever `value`
 * changes. The full number is exposed to screen readers as plain text.
 */
export interface NumberTicker3DProps {
  /** The number to show. */
  value: number;
  /** Digits after the decimal point. */
  decimals?: number;
  /** Text before the number, like "$". */
  prefix?: string;
  /** Text after the number, like "%" or "k". */
  suffix?: string;
  /** Show thousands separators (1,234). */
  separator?: boolean;
  /** Seconds each digit takes to settle. Digits further left start slightly later. */
  duration?: number;
  /** Roll in when scrolled into view. Turn off to roll immediately. */
  startOnView?: boolean;
  /** Extra classes added to the outer element. Set the size with a text-size class. */
  className?: string;
}

function Digit({ d, delay, duration, run, reduced }: { d: number; delay: number; duration: number; run: boolean; reduced: boolean }) {
  return (
    <span aria-hidden className="relative inline-block h-[1.1em] w-[0.62em] overflow-hidden align-bottom">
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: `${run ? -d * 10 : 0}%` }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 70 / duration, damping: 16, delay }}
        style={{ height: "1100%" }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="flex h-[10%] items-center justify-center leading-none">{n}</span>
        ))}
      </motion.span>
    </span>
  );
}

export function NumberTicker3D({ value, decimals = 0, prefix = "", suffix = "", separator = true, duration = 1.2, startOnView = true, className }: NumberTicker3DProps) {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const run = !startOnView || seen;
  const text = new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: separator }).format(Math.abs(value));
  const chars = [...text];
  const digitsTotal = chars.filter((c) => /\d/.test(c)).length;
  let seenDigits = 0;

  return (
    <span ref={ref} role="text" aria-label={`${prefix}${value < 0 ? "-" : ""}${text}${suffix}`} className={cn("inline-flex items-end font-semibold tabular-nums tracking-tight", className)}>
      {(prefix || value < 0) && <span aria-hidden>{value < 0 ? "-" : ""}{prefix}</span>}
      {chars.map((c, i) => {
        if (!/\d/.test(c)) return <span key={`s${i}`} aria-hidden className="inline-block h-[1.1em] leading-[1.1em]">{c}</span>;
        const fromRight = digitsTotal - 1 - seenDigits++;
        return <Digit key={`d${fromRight}`} d={Number(c)} delay={reduced ? 0 : (digitsTotal - 1 - fromRight) * 0.04} duration={duration} run={run} reduced={reduced} />;
      })}
      {suffix && <span aria-hidden className="inline-block h-[1.1em] leading-[1.1em]">{suffix}</span>}
    </span>
  );
}
