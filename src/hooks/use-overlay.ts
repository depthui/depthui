import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared behaviour for overlays (drawer, command palette): Esc closes, Tab stays
 * inside the panel, page scroll is locked, and focus returns to what opened it.
 * Pass `focusFirst: false` when the panel moves focus itself (for example to a search box).
 */
export function useOverlay(open: boolean, panel: RefObject<HTMLElement | null>, onClose: () => void, focusFirst = true) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const list = () => (panel.current ? Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)) : []);
    const raf = requestAnimationFrame(() => {
      if (focusFirst) (list()[0] ?? panel.current)?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
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
  }, [open, panel, focusFirst]);
}
