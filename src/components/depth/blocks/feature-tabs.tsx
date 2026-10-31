import { useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * FeatureTabs — a list of features on one side and a stage on the other.
 * Switching tabs swings the stage content around in 3D. Arrow keys move
 * between tabs. A row of scrollable tabs on phones, a vertical list on desktop.
 */
export interface FeatureTab {
  id: string;
  label: string;
  title: string;
  description: string;
  icon?: ReactNode;
  visual: ReactNode;
}

export interface FeatureTabsProps {
  /** The features to switch between, in display order. */
  tabs: FeatureTab[];
  /** Extra classes added to the outer element. */
  className?: string;
}

export function FeatureTabs({ tabs, className }: FeatureTabsProps) {
  const uid = useId();
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const n = tabs.length;
  const current = tabs[active];

  function move(to: number) {
    const next = (to + n) % n;
    setActive(next);
    btns.current[next]?.focus();
  }

  return (
    <div className={cn("grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]", className)}>
      <div
        role="tablist"
        aria-label="Features"
        aria-orientation="vertical"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            move(active + 1);
          }
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            move(active - 1);
          }
        }}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {tabs.map((t, i) => {
          const isActive = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                btns.current[i] = el;
              }}
              role="tab"
              id={`${uid}-tab-${t.id}`}
              aria-selected={isActive}
              aria-controls={`${uid}-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "relative shrink-0 rounded-xl px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent",
                isActive ? "text-depth-text" : "text-depth-muted hover:text-depth-text",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`${uid}-active`}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-xl border border-depth-accent/40 bg-depth-elevated"
                />
              )}
              <span className="relative flex items-center gap-2.5 whitespace-nowrap text-sm font-medium">
                {t.icon && <span className="text-depth-accent [&>svg]:h-4 [&>svg]:w-4">{t.icon}</span>}
                {t.label}
              </span>
              {isActive && (
                <span className="relative mt-1.5 hidden text-xs leading-relaxed text-depth-muted lg:block">
                  {t.description}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${current.id}`}
        className="min-h-[20rem] overflow-hidden rounded-2xl border border-depth-border bg-depth-surface p-4 sm:p-6"
        style={{ perspective: 1200 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, rotateY: reduced ? 0 : -16, x: reduced ? 0 : 24 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            exit={{ opacity: 0, rotateY: reduced ? 0 : 16, x: reduced ? 0 : -24 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <h3 className="text-xl font-semibold tracking-tight">{current.title}</h3>
            <p className="mt-1.5 max-w-lg text-sm text-depth-muted lg:hidden">{current.description}</p>
            <div className="mt-5">{current.visual}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
