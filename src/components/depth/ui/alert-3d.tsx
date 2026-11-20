import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Alert3D — an inline message for info, success, warning or error. It is a
 * raised card with a coloured edge and icon. Error and warning use
 * role="alert", the others use role="status". It can be dismissed.
 */
export interface Alert3DProps {
  /** The tone of the message. Sets the colour, icon and ARIA role. */
  tone?: "info" | "success" | "warning" | "error";
  /** Bold heading. */
  title?: ReactNode;
  /** The message text. */
  children?: ReactNode;
  /** Show a close button. */
  dismissible?: boolean;
  /** Called after the alert is dismissed. */
  onDismiss?: () => void;
  /** An action, such as a button or link, shown under the message. */
  action?: ReactNode;
  /** Extra classes added to the outer element. */
  className?: string;
}

const TONES = {
  info: { edge: "border-l-sky-500", icon: "text-sky-600 dark:text-sky-400", path: "M12 8h.01M11 12h1v5h1" },
  success: { edge: "border-l-emerald-500", icon: "text-emerald-600 dark:text-emerald-400", path: "M8 12.5l2.7 2.7L16 9.5" },
  warning: { edge: "border-l-amber-500", icon: "text-amber-600 dark:text-amber-400", path: "M12 8v5M12 16h.01" },
  error: { edge: "border-l-red-500", icon: "text-red-600 dark:text-red-400", path: "M9 9l6 6M15 9l-6 6" },
} as const;

export function Alert3D({ tone = "info", title, children, dismissible, onDismiss, action, className }: Alert3DProps) {
  const reduced = !!useReducedMotion();
  const [shown, setShown] = useState(true);
  const t = TONES[tone];
  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          role={tone === "error" || tone === "warning" ? "alert" : "status"}
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex w-full gap-3 rounded-xl border border-l-4 border-depth-border bg-depth-surface p-4 shadow-[0_4px_0_var(--depth-border),0_10px_20px_rgb(0_0_0/0.1)]",
            t.edge,
            className,
          )}
        >
          <svg aria-hidden viewBox="0 0 24 24" className={cn("mt-0.5 h-5 w-5 shrink-0", t.icon)}>
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d={t.path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="min-w-0 flex-1 text-sm">
            {title && <p className="font-semibold">{title}</p>}
            {children && <div className={cn("leading-relaxed text-depth-muted", title && "mt-0.5")}>{children}</div>}
            {action && <div className="mt-3">{action}</div>}
          </div>
          {dismissible && (
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => { setShown(false); onDismiss?.(); }}
              className="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-depth-muted outline-none transition-colors hover:bg-depth-elevated hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent"
            >
              <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
