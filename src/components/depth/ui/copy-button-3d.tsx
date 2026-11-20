import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * CopyButton3D — a raised button that copies text to the clipboard. The icon
 * flips to a tick for a moment, and a hidden live region tells screen readers
 * it worked. Falls back to a hidden textarea when the Clipboard API is blocked.
 */
export interface CopyButton3DProps {
  /** The text that is copied. */
  text: string;
  /** Visible label. Leave it out for an icon-only button. */
  children?: ReactNode;
  /** Label shown after copying. Only used when children is set. */
  copiedLabel?: ReactNode;
  /** How long the copied state stays, in milliseconds. */
  resetAfter?: number;
  /** Called after the text was copied. */
  onCopy?: (text: string) => void;
  /** Accessible name when there is no visible label. */
  "aria-label"?: string;
  /** Extra classes added to the button. */
  className?: string;
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { /* ignore */ }
    ta.remove();
    return ok;
  }
}

export function CopyButton3D({ text, children, copiedLabel = "Copied", resetAfter = 1800, onCopy, "aria-label": ariaLabel = "Copy", className }: CopyButton3DProps) {
  const reduced = !!useReducedMotion();
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function onClick() {
    if (!(await copy(text))) return;
    setDone(true);
    onCopy?.(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), resetAfter);
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={children ? undefined : ariaLabel}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl border border-depth-border bg-depth-surface text-sm font-medium outline-none transition-[transform,box-shadow] shadow-[0_4px_0_var(--depth-border),0_8px_14px_rgb(0_0_0/0.12)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--depth-border)] focus-visible:ring-2 focus-visible:ring-depth-accent",
          children ? "h-10 px-4" : "h-10 w-10",
          className,
        )}
      >
        <span aria-hidden className="relative flex h-4 w-4 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.svg
              key={done ? "ok" : "copy"}
              viewBox="0 0 20 20"
              className={cn("absolute h-4 w-4", done && "text-emerald-600 dark:text-emerald-400")}
              initial={reduced ? false : { rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              {done ? (
                <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <>
                  <rect x="7" y="7" width="9" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M13 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </>
              )}
            </motion.svg>
          </AnimatePresence>
        </span>
        {children && <span>{done ? copiedLabel : children}</span>}
      </button>
      <span role="status" className="sr-only">{done ? "Copied to clipboard" : ""}</span>
    </>
  );
}
