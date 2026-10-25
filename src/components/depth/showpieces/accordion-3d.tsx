import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Accordion3D — an accordion whose panels unfold downward on a hinge, like a
 * card flipping out of its header, while the rows below slide away on the same
 * spring. One open at a time by default. Real buttons with aria-expanded, so
 * Tab, Enter and Space work as expected.
 */
export interface Accordion3DItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface Accordion3DProps {
  items: Accordion3DItem[];
  /** Let more than one panel stay open. */
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export function Accordion3D({ items, multiple = false, defaultOpen = [], className }: Accordion3DProps) {
  const reduced = !!useReducedMotion();
  const uid = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : multiple ? [...o, id] : [id]));
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 32 };

  return (
    <div className={cn("w-full max-w-md space-y-2", className)} style={{ perspective: 1000 }}>
      {items.map((it) => {
        const on = open.includes(it.id);
        return (
          <motion.div layout transition={spring} key={it.id} className="overflow-hidden rounded-2xl border border-depth-border bg-depth-surface" style={{ borderRadius: 16 }}>
            <motion.h3 layout="position" transition={spring}>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${uid}-${it.id}`}
                id={`${uid}-h-${it.id}`}
                onClick={() => toggle(it.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-depth-accent"
              >
                {it.title}
                <motion.span aria-hidden animate={{ rotateX: on ? 180 : 0 }} transition={spring} className="inline-block text-depth-accent">▾</motion.span>
              </button>
            </motion.h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  key="p"
                  id={`${uid}-${it.id}`}
                  role="region"
                  aria-labelledby={`${uid}-h-${it.id}`}
                  initial={{ height: 0, opacity: 0, rotateX: reduced ? 0 : -80 }}
                  animate={{ height: "auto", opacity: 1, rotateX: 0 }}
                  exit={{ height: 0, opacity: 0, rotateX: reduced ? 0 : -80 }}
                  transition={spring}
                  style={{ transformOrigin: "50% 0%" }}
                >
                  <div className="px-4 pb-4 text-sm leading-relaxed text-depth-muted">{it.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
