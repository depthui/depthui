import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ExpandCards3D — cards that grow into a full sheet when clicked, the way
 * App Store cards do. Each card and its sheet share a layoutId, so the card
 * itself is what stretches open instead of one thing being swapped for another.
 * Escape, the close button, or a click outside folds it back. Focus moves
 * into the sheet and returns to the card.
 */
export interface ExpandItem3D {
  id: string;
  title: string;
  subtitle?: string;
  /** CSS background for the card header. */
  background: string;
  /** Content shown when expanded. */
  body: ReactNode;
}

export interface ExpandCards3DProps {
  /** Cards to show. One expands at a time. */
  items: ExpandItem3D[];
  /** Extra classes added to the outer element. */
  className?: string;
}

export function ExpandCards3D({ items, className }: ExpandCards3DProps) {
  const reduced = !!useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const back = useRef<HTMLElement | null>(null);
  const close = useRef<HTMLButtonElement>(null);
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 30 };
  const item = items.find((i) => i.id === open) ?? null;

  const shut = useCallback(() => {
    setOpen(null);
    back.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && shut();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    close.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, shut]);

  return (
    <>
      <div className={cn("grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2", className)}>
        {items.map((it) => (
          <motion.button
            key={it.id}
            type="button"
            layoutId={`ec-${it.id}`}
            onClick={(e) => { back.current = e.currentTarget; setOpen(it.id); }}
            whileHover={reduced ? undefined : { y: -6, rotateX: 4, scale: 1.02 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            transition={spring}
            className="relative h-44 overflow-hidden text-left text-white outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg"
            style={{ background: it.background, borderRadius: 24, boxShadow: "0 20px 34px -18px var(--depth-shadow)", visibility: open === it.id ? "hidden" : "visible" }}
          >
            <motion.span layoutId={`ec-t-${it.id}`} className="absolute bottom-4 left-5 right-5 block leading-tight">
              {it.subtitle && <span className="block text-[11px] font-semibold uppercase tracking-widest opacity-80">{it.subtitle}</span>}
              <span className="block text-2xl font-bold">{it.title}</span>
            </motion.span>
          </motion.button>
        ))}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {item && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                  className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={shut}
                />
                <motion.div
                  layoutId={`ec-${item.id}`}
                  role="dialog"
                  aria-modal="true"
                  aria-label={item.title}
                  transition={spring}
                  className="relative z-10 flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden bg-depth-surface text-depth-text shadow-2xl"
                  style={{ borderRadius: 28 }}
                >
                  <div className="relative h-56 shrink-0 text-white" style={{ background: item.background }}>
                    <motion.span layoutId={`ec-t-${item.id}`} className="absolute bottom-5 left-6 right-6 block leading-tight">
                      {item.subtitle && <span className="block text-xs font-semibold uppercase tracking-widest opacity-80">{item.subtitle}</span>}
                      <span className="block text-3xl font-bold">{item.title}</span>
                    </motion.span>
                    <button ref={close} type="button" onClick={shut} aria-label="Close" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-lg text-white outline-none backdrop-blur hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-white">×</button>
                  </div>
                  <motion.div
                    className="overflow-y-auto p-6 text-sm leading-relaxed text-depth-muted"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: reduced ? 0 : 0.15, duration: reduced ? 0 : 0.35 } }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  >
                    {item.body}
                  </motion.div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
