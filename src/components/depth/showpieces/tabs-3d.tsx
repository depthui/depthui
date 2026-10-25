import { useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Tabs3D — tabs with a raised key that glides under the active label on a
 * spring (one shared layoutId), and panels that swing in and out around a
 * vertical hinge, in the direction you are moving. Arrow keys, Home and End
 * move between tabs, and the panels are announced correctly to screen readers.
 */
export interface Tab3DItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface Tabs3DProps {
  tabs: Tab3DItem[];
  defaultTab?: string;
  className?: string;
}

export function Tabs3D({ tabs, defaultTab, className }: Tabs3DProps) {
  const reduced = !!useReducedMotion();
  const uid = useId();
  const [active, setActive] = useState(defaultTab ?? tabs[0].id);
  const dir = useRef(1);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = tabs.findIndex((t) => t.id === active);

  const go = (i: number, focus = true) => {
    const n = (i + tabs.length) % tabs.length;
    dir.current = n >= idx ? 1 : -1;
    setActive(tabs[n].id);
    if (focus) refs.current[n]?.focus();
  };

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div
        role="tablist"
        aria-label="Sections"
        className="relative flex rounded-2xl border border-depth-border bg-depth-elevated p-1.5"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); }
          else if (e.key === "Home") { e.preventDefault(); go(0); }
          else if (e.key === "End") { e.preventDefault(); go(tabs.length - 1); }
        }}
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(n) => { refs.current[i] = n; }}
            role="tab"
            id={`${uid}-tab-${t.id}`}
            aria-selected={t.id === active}
            aria-controls={`${uid}-panel-${t.id}`}
            tabIndex={t.id === active ? 0 : -1}
            onClick={() => go(i, false)}
            className={cn("relative z-10 flex-1 rounded-xl px-3 py-2 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent", t.id === active ? "text-white" : "text-depth-muted hover:text-depth-text")}
          >
            {t.id === active && (
              <motion.span
                layoutId={`${uid}-key`}
                aria-hidden
                className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-depth-accent to-depth-accent-2"
                style={{ boxShadow: "0 8px 14px -6px var(--depth-shadow), inset 0 1px 0 rgba(255,255,255,.35)" }}
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative mt-4" style={{ perspective: 1100 }}>
        <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
          <motion.div
            key={active}
            role="tabpanel"
            id={`${uid}-panel-${active}`}
            aria-labelledby={`${uid}-tab-${active}`}
            tabIndex={0}
            custom={dir.current}
            variants={{
              enter: (d: number) => ({ opacity: 0, rotateY: reduced ? 0 : 52 * d, x: reduced ? 0 : 36 * d, scale: 0.96 }),
              center: { opacity: 1, rotateY: 0, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, rotateY: reduced ? 0 : -52 * d, x: reduced ? 0 : -36 * d, scale: 0.96 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 28 }}
            className="rounded-2xl border border-depth-border bg-depth-surface p-5 text-sm leading-relaxed text-depth-muted outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-depth-accent"
            style={{ transformOrigin: dir.current > 0 ? "0% 50%" : "100% 50%" }}
          >
            {tabs[idx].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
