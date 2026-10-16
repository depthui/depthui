import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Toast — notifications that tilt in from below and stack up. Each one has a
 * countdown bar; hovering or focusing a toast pauses its timer. Wrap your
 * app in <ToastProvider>, then call `toast({ ... })` from useToast().
 * The countdown is a CSS animation, so the timer needs depth-motion.css.
 */
export type ToastTone = "default" | "success" | "error" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Milliseconds before it closes itself. */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

interface ToastApi {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const Ctx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({
  children,
  max = 4,
}: {
  children: ReactNode;
  /** Most toasts shown at once. Older ones are dropped. */
  max?: number;
}) {
  const [items, setItems] = useState<ToastEntry[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((a) => a.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setItems((a) => [...a, { ...options, id }].slice(-max));
      return id;
    },
    [max],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <Ctx.Provider value={api}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(<Viewport items={items} dismiss={dismiss} />, document.body)}
    </Ctx.Provider>
  );
}

const TONES: Record<ToastTone, { bar: string; icon: ReactNode }> = {
  default: {
    bar: "bg-depth-accent",
    icon: <path d="M12 8v5M12 16.5h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />,
  },
  success: { bar: "bg-emerald-500", icon: <path d="M5 12.5l4.5 4.5L19 7.5" /> },
  error: { bar: "bg-rose-500", icon: <path d="M6 6l12 12M18 6L6 18" /> },
  info: {
    bar: "bg-sky-500",
    icon: <path d="M12 11v5M12 7.5h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />,
  },
};

const TEXT: Record<ToastTone, string> = {
  default: "text-depth-accent",
  success: "text-emerald-500",
  error: "text-rose-500",
  info: "text-sky-500",
};

function Viewport({ items, dismiss }: { items: ToastEntry[]; dismiss: (id: number) => void }) {
  const reduced = !!useReducedMotion();

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
      style={{ perspective: 900 }}
    >
      <AnimatePresence initial={false}>
        {items.map((t) => {
          const tone = t.tone ?? "default";
          const duration = t.duration ?? 4500;
          return (
            <motion.div
              key={t.id}
              layout={!reduced}
              role={tone === "error" ? "alert" : "status"}
              initial={{ opacity: 0, y: reduced ? 0 : 30, rotateX: reduced ? 0 : -40, scale: reduced ? 1 : 0.9 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, x: reduced ? 0 : 48, scale: reduced ? 1 : 0.92 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
              style={{ transformOrigin: "50% 100%" }}
              className="group pointer-events-auto relative w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-depth-border bg-depth-surface p-4 pr-10 shadow-[0_24px_50px_-24px_var(--depth-shadow)]"
            >
              <div className="flex items-start gap-3">
                <span className={cn("mt-0.5 shrink-0", TEXT[tone])}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {TONES[tone].icon}
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-sm text-depth-muted">{t.description}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-depth-muted outline-none transition-colors hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent"
              >
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <span
                aria-hidden
                onAnimationEnd={() => dismiss(t.id)}
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 origin-left motion-reduce:opacity-0 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
                  TONES[tone].bar,
                )}
                style={{
                  animationName: "depth-toast-progress",
                  animationDuration: `${duration}ms`,
                  animationTimingFunction: "linear",
                  animationFillMode: "forwards",
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
