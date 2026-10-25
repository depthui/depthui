import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * StackScroll3D — cards that stack as you scroll. Each card sticks to the top,
 * and as the next one slides over it, it shrinks, tips back and dims, so the
 * pile reads as depth. Scroll position is read once per frame by framer
 * motion's scroll tracking, and only transforms and opacity change.
 */
export interface StackScroll3DProps {
  /** One entry per card. */
  cards: ReactNode[];
  /** Height of the scrolling area in px. */
  height?: number;
  /** How much each older card shrinks (0 to 0.2). */
  shrink?: number;
  /** Gap between the stuck cards, in px. */
  step?: number;
  className?: string;
  cardClassName?: string;
}

function StackCard({
  i, n, progress, shrink, step, height, children, className,
}: { i: number; n: number; progress: MotionValue<number>; shrink: number; step: number; height: number; children: ReactNode; className?: string }) {
  const start = n > 1 ? i / (n - 1) : 0;
  const scale = useTransform(progress, [start, 1], [1, 1 - (n - 1 - i) * shrink]);
  const tip = useTransform(progress, [start, 1], [0, (n - 1 - i) * 3]);
  const dim = useTransform(progress, [start, 1], [0, Math.min(0.55, (n - 1 - i) * 0.14)]);
  return (
    <div className="sticky" style={{ top: 16 + i * step, height: height * 0.62, marginBottom: i === n - 1 ? 0 : height * 0.1 }}>
      <motion.div
        className={cn("relative h-full w-full overflow-hidden rounded-2xl border border-depth-border bg-depth-surface shadow-[0_24px_36px_-24px_var(--depth-shadow)] will-change-transform", className)}
        style={{ scale, rotateX: tip, transformOrigin: "50% 0%" }}
      >
        {children}
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />
      </motion.div>
    </div>
  );
}

export function StackScroll3D({ cards, height = 420, shrink = 0.05, step = 16, className, cardClassName }: StackScroll3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });
  return (
    <div
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label="Scrolling stack of cards"
      className={cn("relative overflow-y-auto rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent", className)}
      style={{ height, perspective: 900, scrollbarWidth: "thin" }}
    >
      <div className="px-4 pb-24 pt-4">
        {cards.map((c, i) => (
          <StackCard key={i} i={i} n={cards.length} progress={scrollYProgress} shrink={shrink} step={step} height={height} className={cardClassName}>
            {c}
          </StackCard>
        ))}
      </div>
    </div>
  );
}
