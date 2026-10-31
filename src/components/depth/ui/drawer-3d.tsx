import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useOverlay } from "@/hooks/use-overlay";
import { cn } from "@/lib/utils";

/**
 * Drawer3D — a side panel (or bottom sheet) that slides in with a slight 3D
 * tilt. Esc and a backdrop click close it, Tab stays inside it, page scroll is
 * locked while it is open, and focus returns to what opened it. Use it for
 * settings, filters, carts and details.
 */
export interface Drawer3DProps {
  /** Whether the drawer is visible. */
  open: boolean;
  /** Called when the user asks to close the drawer. */
  onClose: () => void;
  /** Edge it slides in from: "right" (default), "left" or "bottom". */
  side?: "right" | "left" | "bottom";
  /** Heading of the drawer. Also names it for screen readers. */
  title: string;
  /** Short text shown under the title. */
  description?: string;
  /** Content shown in the body. It scrolls if it is long. */
  children?: ReactNode;
  /** Buttons row pinned to the bottom. */
  footer?: ReactNode;
  /** Extra classes added to the panel. */
  className?: string;
}

const FROM = {
  right: { x: "100%", rotateY: -12, origin: "100% 50%" },
  left: { x: "-100%", rotateY: 12, origin: "0% 50%" },
  bottom: { y: "100%", rotateX: 8, origin: "50% 100%" },
} as const;

export function Drawer3D({ open, onClose, side = "right", title, description, children, footer, className }: Drawer3DProps) {
  const reduced = !!useReducedMotion();
  const titleId = useId();
  const descId = useId();
  const panel = useRef<HTMLDivElement>(null);
  useOverlay(open, panel, onClose);
  if (typeof document === "undefined") return null;
  const f = FROM[side];
  const hidden = reduced ? { opacity: 0 } : { ...("x" in f ? { x: f.x, rotateY: f.rotateY } : { y: f.y, rotateX: f.rotateX }), opacity: 0.6 };
  const shown = { x: 0, y: 0, rotateX: 0, rotateY: 0, opacity: 1 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div key="drawer" className="fixed inset-0 z-[90]" style={{ perspective: 1400 }}>
          <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }} onClick={onClose} className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={{ duration: reduced ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: f.origin }}
            className={cn(
              "absolute flex flex-col border-depth-border bg-depth-surface shadow-[0_0_80px_-20px_var(--depth-shadow)] outline-none",
              side === "right" && "inset-y-0 right-0 w-full max-w-sm border-l",
              side === "left" && "inset-y-0 left-0 w-full max-w-sm border-r",
              side === "bottom" && "inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl border-t",
              className,
            )}
          >
            <header className="flex items-start gap-4 border-b border-depth-border px-6 py-5">
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="text-lg font-semibold tracking-tight">{title}</h2>
                {description && <p id={descId} className="mt-1 text-sm text-depth-muted">{description}</p>}
              </div>
              <button type="button" onClick={onClose} aria-label="Close drawer" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-depth-border text-depth-muted outline-none transition-colors hover:border-depth-accent hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-depth-border px-6 py-4">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
