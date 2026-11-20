import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Popover3D — a button that opens a small floating panel for any content, such
 * as a form or details. The panel tilts in from the trigger. Escape and clicks
 * outside close it, focus moves into the panel on open and returns to the
 * trigger on close. Use it for content; use DropdownMenu3D for a list of actions.
 */
export interface Popover3DProps {
  /** Content of the trigger button. */
  trigger: ReactNode;
  /** Content of the floating panel. */
  children: ReactNode;
  /** Open state. Set it to control the component. */
  open?: boolean;
  /** Called when the popover wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Which edge of the trigger the panel lines up with. */
  align?: "start" | "center" | "end";
  /** Show the panel above the trigger instead of below. */
  above?: boolean;
  /** Accessible name of the panel. */
  "aria-label"?: string;
  /** Extra classes added to the panel. */
  className?: string;
}

export function Popover3D({ trigger, children, open: openProp, onOpenChange, align = "start", above, "aria-label": ariaLabel = "Details", className }: Popover3DProps) {
  const reduced = !!useReducedMotion();
  const uid = useId();
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  function set(v: boolean, refocus = false) {
    if (openProp === undefined) setInner(v);
    onOpenChange?.(v);
    if (!v && refocus) btn.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      const f = panel.current?.querySelector<HTMLElement>('input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
      (f ?? panel.current)?.focus();
    });
    const down = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) set(false);
    };
    document.addEventListener("pointerdown", down);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerdown", down);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={root} className="relative inline-block">
      <button
        ref={btn}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? uid : undefined}
        onClick={() => set(!open)}
        className="inline-flex items-center gap-2 rounded-xl border border-depth-border bg-depth-surface px-4 py-2.5 text-sm font-medium outline-none transition-[transform,box-shadow] shadow-[0_4px_0_var(--depth-border),0_8px_14px_rgb(0_0_0/0.12)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--depth-border)] focus-visible:ring-2 focus-visible:ring-depth-accent"
      >
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <div
            className={cn(
              "absolute z-30",
              above ? "bottom-full pb-2" : "top-full pt-2",
              align === "start" && "left-0",
              align === "end" && "right-0",
              align === "center" && "left-1/2 -translate-x-1/2",
            )}
            style={{ perspective: 700 }}
          >
            <motion.div
              ref={panel}
              id={uid}
              role="dialog"
              aria-label={ariaLabel}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.stopPropagation();
                  set(false, true);
                }
              }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, rotateX: above ? 16 : -16, y: above ? 6 : -6 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: above ? "bottom center" : "top center" }}
              className={cn("w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-depth-border bg-depth-surface p-4 text-sm shadow-[0_18px_40px_rgb(0_0_0/0.25)] outline-none", className)}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
