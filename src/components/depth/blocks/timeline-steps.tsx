import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

/**
 * TimelineSteps — a vertical "how it works" timeline. A line draws down the
 * left as you scroll, and each step swings in from the side.
 */
export interface TimelineStep {
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface TimelineStepsProps {
  steps: TimelineStep[];
  className?: string;
}

export function TimelineSteps({ steps, className }: TimelineStepsProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = !!useReducedMotion();
  const scrollYProgress = useScrollProgress(ref, ["top", 0.75], ["bottom", 0.7]);
  const scaleY = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0, 1]);

  return (
    <div className={cn("relative overflow-x-clip", className)} style={{ perspective: 1200 }}>
      {/* track + progress */}
      <div aria-hidden className="absolute bottom-3 left-[19px] top-3 w-px bg-depth-border" />
      <motion.div
        aria-hidden
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute bottom-3 left-[19px] top-3 w-px bg-gradient-to-b from-depth-accent to-depth-accent-2"
      />

      <ol ref={ref} className="relative space-y-6">
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            initial={reduced ? false : { opacity: 0, x: 36, rotateY: -14 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{ transformOrigin: "left center" }}
            className="flex gap-4"
          >
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-depth-accent bg-depth-surface font-mono text-sm font-semibold text-depth-accent shadow-[0_0_0_6px_var(--depth-bg)]">
              {s.icon ?? i + 1}
            </span>
            <div className="min-w-0 flex-1 rounded-2xl border border-depth-border bg-depth-surface p-5 shadow-[0_18px_40px_-28px_var(--depth-shadow)]">
              <h3 className="font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-depth-muted">{s.description}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
