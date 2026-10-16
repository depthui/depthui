import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * HeroSection — staggered headline entrance, a glowing grid backdrop, and an
 * optional visual that tilts back in 3D and follows the pointer.
 * Put <HeroFloat> elements inside `visual` to float chips above the surface.
 */
export interface HeroSectionProps {
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Large visual shown under the text (a screenshot, a mock window, ...). */
  visual?: ReactNode;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection({
  badge,
  title,
  description,
  actions,
  visual,
  className,
}: HeroSectionProps) {
  const reduced = !!useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.09 } },
  };
  const item: Variants = {
    hidden: reduced ? {} : { opacity: 0, y: 18, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduced ? 0 : 0.6, ease: EASE },
    },
  };

  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="bg-depth-grid absolute inset-0"
          style={{
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)",
          }}
        />
        <div className="absolute left-1/2 top-0 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-depth-accent/25 blur-3xl" />
        <div className="absolute right-0 top-40 h-48 w-72 rounded-full bg-depth-accent-2/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <motion.div variants={container} initial="hidden" animate="show">
          {badge && (
            <motion.div variants={item} className="mb-5 flex justify-center">
              {badge}
            </motion.div>
          )}
          <motion.h1
            variants={item}
            className="mx-auto max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              variants={item}
              className="mx-auto mt-5 max-w-xl text-base text-depth-muted sm:text-lg"
            >
              {description}
            </motion.p>
          )}
          {actions && (
            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              {actions}
            </motion.div>
          )}
        </motion.div>

        {visual && <HeroVisual reduced={reduced}>{visual}</HeroVisual>}
      </div>
    </section>
  );
}

function HeroVisual({ children, reduced }: { children: ReactNode; reduced: boolean }) {
  const { ref, rotateX, rotateY, handlers, reduced: noTilt } = useTilt({ max: 5 });

  return (
    <div className="mt-12 sm:mt-16" style={{ perspective: 1400 }}>
      {/* outer: entrance. inner: pointer tilt. Kept separate so they never fight. */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 60, rotateX: 26 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          ref={ref}
          {...handlers}
          style={{
            rotateX: noTilt ? 0 : rotateX,
            rotateY: noTilt ? 0 : rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative mx-auto max-w-3xl rounded-2xl border border-depth-border bg-depth-elevated p-1.5 text-left shadow-[0_50px_100px_-40px_var(--depth-shadow)] will-change-transform sm:p-2"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/** A chip or badge that floats above the hero visual at its own depth. */
export function HeroFloat({
  z = 60,
  delay = 0,
  className,
  children,
}: {
  z?: number;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("absolute", className)}
      style={{ transform: `translateZ(${z}px)` }}
    >
      <div className="depth-float" style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </div>
  );
}
