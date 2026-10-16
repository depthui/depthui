import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/depth/theme";
import { GitHubStarButton } from "@/components/depth/github-star-button";
import { REPO } from "@/lib/site";
import { NavList } from "./nav-list";

/**
 * Slide-in navigation drawer for small screens.
 * Closes on Esc, backdrop tap, link tap, swipe-left, or when the viewport
 * grows to desktop width. Locks body scroll and traps focus while open.
 */
export function MobileDrawer({
  open,
  onClose,
  active,
  logo,
}: {
  open: boolean;
  onClose: () => void;
  active: string;
  logo: ReactNode;
}) {
  const reduced = !!useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = (e: MediaQueryListEvent) => {
      if (e.matches) onClose();
    };

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, onClose]);

  const slide = reduced
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 380, damping: 38 } as const);

  return (
    <AnimatePresence>
      {open && (
        <div className="lg:hidden">
          <motion.div
            key="backdrop"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50"
          />
          <motion.aside
            key="panel"
            ref={panelRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Component list"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={slide}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.5, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 || info.velocity.x < -450) onClose();
            }}
            className="fixed inset-y-0 left-0 z-[70] flex w-[min(86vw,320px)] flex-col border-r border-depth-border bg-depth-surface shadow-2xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-depth-border px-4">
              {logo}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-depth-border text-depth-text outline-none hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5">
              <NavList active={active} onNavigate={onClose} />
            </div>

            <div className="flex shrink-0 items-center gap-2 border-t border-depth-border px-4 py-3">
              <Link
                to="/demo"
                onClick={onClose}
                className="rounded-full border border-depth-border px-3.5 py-2 text-sm outline-none hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent"
              >
                Live demo
              </Link>
              <GitHubStarButton repo={REPO} />
              <span className="ml-auto" />
              <ThemeToggle />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
