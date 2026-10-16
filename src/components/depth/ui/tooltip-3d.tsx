import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Tooltip3D — a bubble that tips out from its trigger in 3D. Shows on
 * hover (after a short delay) and on keyboard focus; Esc closes it. The
 * trigger gets `aria-describedby`. Keep tooltip text short and non-essential.
 */
export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface Tooltip3DProps {
  content: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  /** Hover delay in ms. */
  delay?: number;
  className?: string;
}

const PLACE: Record<TooltipSide, string> = {
  top: "bottom-full left-1/2 mb-2.5 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2.5 -translate-x-1/2",
  left: "right-full top-1/2 mr-2.5 -translate-y-1/2",
  right: "left-full top-1/2 ml-2.5 -translate-y-1/2",
};

const ARROW: Record<TooltipSide, string> = {
  top: "left-1/2 top-full -mt-1 -translate-x-1/2 border-b border-r",
  bottom: "bottom-full left-1/2 -mb-1 -translate-x-1/2 border-l border-t",
  left: "left-full top-1/2 -ml-1 -translate-y-1/2 border-r border-t",
  right: "right-full top-1/2 -mr-1 -translate-y-1/2 border-b border-l",
};

const ORIGIN: Record<TooltipSide, string> = {
  top: "50% 100%",
  bottom: "50% 0%",
  left: "100% 50%",
  right: "0% 50%",
};

export function Tooltip3D({
  content,
  children,
  side = "top",
  delay = 120,
  className,
}: Tooltip3DProps) {
  const reduced = !!useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = (wait: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  const vertical = side === "top" || side === "bottom";
  const sign = side === "top" || side === "left" ? 1 : -1;

  return (
    <span
      className={cn("relative inline-flex", className)}
      aria-describedby={open ? id : undefined}
      onPointerEnter={(e) => e.pointerType !== "touch" && show(delay)}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      {children}
      <AnimatePresence>
        {open && (
          <span
            className={cn("pointer-events-none absolute z-50", PLACE[side])}
            style={{ perspective: 600 }}
          >
            <motion.span
              role="tooltip"
              id={id}
              initial={{
                opacity: 0,
                scale: reduced ? 1 : 0.9,
                rotateX: reduced || !vertical ? 0 : sign * -40,
                rotateY: reduced || vertical ? 0 : sign * 40,
              }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
              transition={{ duration: reduced ? 0 : 0.18, ease: "easeOut" }}
              style={{ transformOrigin: ORIGIN[side] }}
              className="relative block whitespace-nowrap rounded-lg border border-depth-border bg-depth-surface px-3 py-1.5 text-xs font-medium text-depth-text shadow-[0_12px_30px_-12px_var(--depth-shadow)]"
            >
              {content}
              <span
                aria-hidden
                className={cn(
                  "absolute block h-2 w-2 rotate-45 border-depth-border bg-depth-surface",
                  ARROW[side],
                )}
              />
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}
