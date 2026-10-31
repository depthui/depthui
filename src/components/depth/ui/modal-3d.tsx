import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Modal3D — an accessible dialog that swings up from below in 3D.
 * Esc and a backdrop click close it, Tab stays inside it, page scroll is
 * locked while it is open, and focus returns to what opened it.
 */
export interface Modal3DProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Called when the user asks to close the modal. */
  onClose: () => void;
  /** Heading of the modal. Also names it for screen readers. */
  title: string;
  /** Short text shown under the title. */
  description?: string;
  /** Content shown in the body of the modal. */
  children?: ReactNode;
  /** Buttons row shown under the content. */
  footer?: ReactNode;
  /** Extra classes added to the outer element. */
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal3D({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: Modal3DProps) {
  const reduced = !!useReducedMotion();
  const titleId = useId();
  const descId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const list = () =>
      panel.current ? Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
    // Wait a frame so the dialog is mounted before moving focus into it.
    const raf = requestAnimationFrame(() => (list()[0] ?? panel.current)?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const f = list();
      if (!f.length) {
        e.preventDefault();
        return;
      }
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          key="modal"
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          style={{ perspective: 1200 }}
        >
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            onClick={() => closeRef.current()}
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, rotateX: reduced ? 0 : -22, y: reduced ? 0 : 40, scale: reduced ? 1 : 0.94 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, rotateX: reduced ? 0 : 14, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.96 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "50% 0%" }}
            className={cn(
              "relative w-full max-w-md rounded-2xl border border-depth-border bg-depth-surface p-6 shadow-[0_40px_80px_-30px_var(--depth-shadow)] outline-none",
              className,
            )}
          >
            <button
              type="button"
              onClick={() => closeRef.current()}
              aria-label="Close dialog"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-depth-border text-depth-muted outline-none transition-colors hover:border-depth-accent hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <h2 id={titleId} className="pr-10 text-xl font-semibold tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1.5 text-sm text-depth-muted">
                {description}
              </p>
            )}
            {children && <div className="mt-5">{children}</div>}
            {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
