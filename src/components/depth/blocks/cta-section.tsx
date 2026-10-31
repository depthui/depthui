import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * CTASection — a call-to-action banner with floating glass shapes that drift
 * at different depths as the pointer moves across it.
 */
export interface CTASectionProps {
  /** Main heading text of the banner. */
  title: ReactNode;
  /** Supporting text shown under the heading. */
  description?: ReactNode;
  /** Buttons or links shown in a row below the text. */
  actions?: ReactNode;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function CTASection({ title, description, actions, className }: CTASectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const x = useSpring(rx, { stiffness: 120, damping: 20 });
  const y = useSpring(ry, { stiffness: 120, damping: 20 });

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (reduced || e.pointerType === "touch") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        rx.set((e.clientX - r.left) / r.width - 0.5);
        ry.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-depth-border bg-gradient-to-br from-depth-accent/15 via-depth-surface to-depth-accent-2/15 px-5 py-14 text-center sm:px-12 sm:py-20",
        className,
      )}
    >
      <div
        aria-hidden
        className="bg-depth-grid pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <Shape x={x} y={y} depth={0.9} className="-left-4 top-8 h-20 w-20 rotate-12 sm:left-10 sm:h-24 sm:w-24" />
      <Shape x={x} y={y} depth={0.5} className="-right-3 top-14 h-14 w-14 -rotate-12 sm:right-16 sm:h-16 sm:w-16" />
      <Shape x={x} y={y} depth={1.3} className="bottom-6 left-1/4 hidden h-12 w-12 rotate-45 sm:block" round />
      <Shape x={x} y={y} depth={0.7} className="-bottom-4 right-6 h-24 w-24 rotate-6 sm:right-24 sm:h-28 sm:w-28" />

      <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">{title}</h2>
      {description && (
        <p className="mx-auto mt-4 max-w-lg text-depth-muted sm:text-lg">{description}</p>
      )}
      {actions && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">{actions}</div>
      )}
    </div>
  );
}

function Shape({
  x,
  y,
  depth,
  className,
  round,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  className?: string;
  round?: boolean;
}) {
  const tx = useTransform(x, [-0.5, 0.5], [-40 * depth, 40 * depth]);
  const ty = useTransform(y, [-0.5, 0.5], [-40 * depth, 40 * depth]);
  return (
    <motion.div
      aria-hidden
      style={{ x: tx, y: ty }}
      className={cn(
        "pointer-events-none absolute -z-10 border border-depth-border bg-depth-surface/50 shadow-[0_20px_40px_-20px_var(--depth-shadow)]",
        round ? "rounded-full" : "rounded-2xl",
        className,
      )}
    />
  );
}
