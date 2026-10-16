import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * FAQAccordion — accessible disclosure list. The answer swings down from the
 * question in 3D, and the plus icon turns into a cross.
 */
export interface FAQItem {
  question: string;
  answer: ReactNode;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  /** Let several answers stay open at once. */
  multiple?: boolean;
  /** Index opened first. */
  defaultOpen?: number;
  className?: string;
}

export function FAQAccordion({
  items,
  multiple = false,
  defaultOpen,
  className,
}: FAQAccordionProps) {
  const uid = useId();
  const reduced = !!useReducedMotion();
  const [open, setOpen] = useState<number[]>(defaultOpen === undefined ? [] : [defaultOpen]);

  const toggle = (i: number) =>
    setOpen((o) =>
      o.includes(i) ? o.filter((x) => x !== i) : multiple ? [...o, i] : [i],
    );

  return (
    <div className={cn("divide-y divide-depth-border rounded-2xl border border-depth-border bg-depth-surface", className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={`${uid}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-a-${i}`}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium outline-none transition-colors hover:text-depth-accent focus-visible:bg-depth-elevated focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-depth-accent"
              >
                {item.question}
                <span
                  aria-hidden
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-depth-border text-depth-accent transition-transform duration-300",
                    isOpen && "rotate-45 bg-depth-elevated",
                  )}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div style={{ perspective: 900 }}>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="a"
                    id={`${uid}-a-${i}`}
                    role="region"
                    aria-labelledby={`${uid}-q-${i}`}
                    initial={{ height: 0, opacity: 0, rotateX: reduced ? 0 : -18 }}
                    animate={{ height: "auto", opacity: 1, rotateX: 0 }}
                    exit={{ height: 0, opacity: 0, rotateX: reduced ? 0 : -18 }}
                    transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: "top center", overflow: "hidden" }}
                  >
                    <div className="px-5 pb-5 pr-14 text-sm leading-relaxed text-depth-muted">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
