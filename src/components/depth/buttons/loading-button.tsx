import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * LoadingButton — idle, loading, success and error in one button, with no
 * width jump (all labels share one grid cell). Return a Promise from
 * `onClick` and it manages the states itself, or drive it with `status`.
 */
export type LoadingStatus = "idle" | "loading" | "success" | "error";

export interface LoadingButtonProps
  extends Omit<HTMLMotionProps<"button">, "children" | "onClick"> {
  /** Label shown while idle. */
  children: ReactNode;
  /** Label shown while loading. */
  loadingLabel?: ReactNode;
  /** Label shown after success. */
  successLabel?: ReactNode;
  /** Label shown after an error. */
  errorLabel?: ReactNode;
  /** Controlled status. Leave it out to let a returned Promise drive it. */
  status?: LoadingStatus;
  /** Called on click. If it returns a Promise, the button tracks it as loading, success or error. */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
  /** Milliseconds before success or error returns to idle. */
  resetAfter?: number;
}

const ORDER: LoadingStatus[] = ["idle", "loading", "success", "error"];

const Spinner = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden className="animate-spin motion-reduce:animate-none">
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export function LoadingButton({
  children,
  loadingLabel = "Saving",
  successLabel = "Saved",
  errorLabel = "Failed",
  status: statusProp,
  onClick,
  resetAfter = 1800,
  className,
  ...props
}: LoadingButtonProps) {
  const reduced = !!useReducedMotion();
  const [auto, setAuto] = useState<LoadingStatus>("idle");
  const timer = useRef<number | undefined>(undefined);
  const status = statusProp ?? auto;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handle(e: MouseEvent<HTMLButtonElement>) {
    if (status !== "idle") return;
    const result = onClick?.(e);
    if (!result || typeof (result as Promise<unknown>).then !== "function") return;
    setAuto("loading");
    try {
      await result;
      setAuto("success");
    } catch {
      setAuto("error");
    }
    timer.current = window.setTimeout(() => setAuto("idle"), resetAfter);
  }

  const states: { key: LoadingStatus; icon: ReactNode; label: ReactNode }[] = [
    { key: "idle", icon: null, label: children },
    { key: "loading", icon: <Spinner />, label: loadingLabel },
    { key: "success", icon: <Check />, label: successLabel },
    { key: "error", icon: <Cross />, label: errorLabel },
  ];

  return (
    <motion.button
      type="button"
      onClick={handle}
      disabled={status === "loading"}
      aria-busy={status === "loading"}
      whileTap={status === "idle" ? { scale: 0.97 } : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-medium text-white outline-none transition-colors duration-300",
        "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg",
        status === "success" ? "bg-emerald-600" : status === "error" ? "bg-rose-600" : "bg-depth-accent",
        status === "loading" && "opacity-90",
        className,
      )}
      {...props}
    >
      <span className="grid" role="status" aria-live="polite">
        {states.map((s) => {
          const on = s.key === status;
          const dir = ORDER.indexOf(s.key) < ORDER.indexOf(status) ? -10 : 10;
          return (
            <motion.span
              key={s.key}
              aria-hidden={!on}
              initial={false}
              animate={{ opacity: on ? 1 : 0, y: reduced || on ? 0 : dir }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="col-start-1 row-start-1 inline-flex items-center justify-center gap-2"
            >
              {s.icon}
              {s.label}
            </motion.span>
          );
        })}
      </span>
    </motion.button>
  );
}
