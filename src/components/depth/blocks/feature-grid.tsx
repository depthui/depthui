import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SpotlightCard } from "../spotlight-card";
import { cn } from "@/lib/utils";

/**
 * FeatureGrid — a bento-style grid. Cards fade up as they enter, and each one
 * has a pointer spotlight. `size` lets a feature span two columns or two rows.
 */
export interface Feature {
  title: string;
  description: string;
  icon?: ReactNode;
  /** Optional illustration shown under the text. */
  visual?: ReactNode;
  size?: "normal" | "wide" | "tall";
}

export interface FeatureGridProps {
  /** Features to show, one card each. */
  features: Feature[];
  /** Extra classes added to the outer element. */
  className?: string;
}

export function FeatureGrid({ features, className }: FeatureGridProps) {
  const reduced = !!useReducedMotion();

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(13rem,auto)] lg:grid-cols-3",
        className,
      )}
    >
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-6%" }}
          transition={{ duration: 0.5, delay: reduced ? 0 : (i % 3) * 0.07, ease: "easeOut" }}
          className={cn(
            f.size === "wide" && "sm:col-span-2",
            f.size === "tall" && "lg:row-span-2",
          )}
        >
          <SpotlightCard className="h-full">
            <div className="flex h-full flex-col">
              {f.icon && (
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-depth-border bg-depth-elevated text-depth-accent [&>svg]:h-5 [&>svg]:w-5">
                  {f.icon}
                </span>
              )}
              <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-depth-muted">{f.description}</p>
              {f.visual && <div className="mt-auto pt-5">{f.visual}</div>}
            </div>
          </SpotlightCard>
        </motion.div>
      ))}
    </div>
  );
}
