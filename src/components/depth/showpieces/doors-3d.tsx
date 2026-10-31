import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Doors3D — a pair of doors that swing open on their hinges to reveal what is
 * behind them, lit from within. Hover, focus, or click to open. Pass `open`
 * to control it.
 */
export interface Doors3DProps {
  /** What is behind the doors. */
  children: ReactNode;
  /** Width of the doorway in px. */
  width?: number;
  /** Height of the doorway in px. */
  height?: number;
  /** Whether the doors are open. Leave out to let hover, focus and click control it. */
  open?: boolean;
  /** Called with true or false when the doors open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Doors3D({ children, width = 280, height = 340, open: openProp, onOpenChange, className }: Doors3DProps) {
  const reduced = !!useReducedMotion();
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const set = (v: boolean) => {
    if (openProp === undefined) setInner(v);
    onOpenChange?.(v);
  };
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 70, damping: 15 };

  const door = (side: "l" | "r") => (
    <motion.div
      aria-hidden
      className="absolute top-0 z-10 h-full w-1/2 will-change-transform"
      animate={{ rotateY: open ? (side === "l" ? -100 : 100) : 0 }}
      transition={t}
      style={{ [side === "l" ? "left" : "right"]: 0, transformOrigin: side === "l" ? "0% 50%" : "100% 50%", transformStyle: "preserve-3d" }}
    >
      <div className={cn("relative h-full w-full border border-depth-border bg-gradient-to-b from-depth-elevated to-depth-surface", side === "l" ? "rounded-l-xl" : "rounded-r-xl")}>
        <div className="absolute inset-4 rounded-md border border-depth-border" />
        <div className="absolute inset-x-7 top-8 h-1/3 rounded border border-depth-border" />
        <div className="absolute inset-x-7 bottom-8 h-1/3 rounded border border-depth-border" />
        <span className={cn("absolute top-1/2 h-4 w-4 rounded-full bg-gradient-to-br from-depth-accent-3 to-depth-accent", side === "l" ? "right-3" : "left-3")} />
      </div>
    </motion.div>
  );

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? "Close the doors" : "Open the doors"}
      onPointerEnter={(e) => e.pointerType !== "touch" && set(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && set(false)}
      onFocus={() => set(true)}
      onBlur={() => set(false)}
      onClick={() => set(!open)}
      className={cn("relative block rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg", className)}
      style={{ width, height, perspective: 1000 }}
    >
      <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border border-depth-border bg-depth-bg">
        <span aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 55%, var(--depth-accent) 0%, transparent 65%)", opacity: open ? 0.45 : 0.08, transition: "opacity .6s" }} />
        <span className="relative z-[1] p-6 text-center">{children}</span>
      </span>
      {door("l")}
      {door("r")}
    </button>
  );
}
