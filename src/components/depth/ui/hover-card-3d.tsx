import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * HoverCard3D — a small preview card that appears when you hover or focus a
 * link or button, like a profile preview. It opens after a short delay, stays
 * open while the pointer is over the card, and Escape closes it. Keep the
 * card to extra information: anything important must also be on the page.
 */
export interface HoverCard3DProps {
  /** The element that triggers the card. It should be focusable, such as a link or button. */
  children: ReactNode;
  /** Content of the preview card. */
  content: ReactNode;
  /** Delay before the card opens, in milliseconds. */
  openDelay?: number;
  /** Delay before the card closes, in milliseconds. */
  closeDelay?: number;
  /** Which edge of the trigger the card lines up with. */
  align?: "start" | "center" | "end";
  /** Show the card above the trigger instead of below. */
  above?: boolean;
  /** Extra classes added to the card. */
  className?: string;
}

export function HoverCard3D({ children, content, openDelay = 250, closeDelay = 150, align = "start", above, className }: HoverCard3DProps) {
  const reduced = !!useReducedMotion();
  const uid = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const show = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), openDelay); };
  const hide = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), closeDelay); };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => { if (e.key === "Escape" && open) { clearTimeout(timer.current); setOpen(false); } }}
    >
      <span aria-describedby={open ? uid : undefined}>{children}</span>
      <AnimatePresence>
        {open && (
          <span
            className={cn("absolute z-30 block", above ? "bottom-full pb-2" : "top-full pt-2", align === "start" && "left-0", align === "end" && "right-0", align === "center" && "left-1/2 -translate-x-1/2")}
            style={{ perspective: 700 }}
          >
            <motion.span
              id={uid}
              role="tooltip"
              initial={reduced ? { opacity: 0 } : { opacity: 0, rotateX: above ? 14 : -14, y: above ? 6 : -6 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: above ? "bottom center" : "top center" }}
              className={cn("block w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-depth-border bg-depth-surface p-4 text-sm shadow-[0_18px_40px_rgb(0_0_0/0.25)]", className)}
            >
              {content}
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}
