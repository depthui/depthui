import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * BookCard — a hardcover book. The cover swings open on hover (desktop),
 * tap (touch) or Enter / Space (keyboard).
 */
export interface BookCardProps {
  /** Front of the cover. */
  cover: ReactNode;
  /** Inside of the cover (left page). */
  left?: ReactNode;
  /** Revealed right page. */
  right: ReactNode;
  width?: number;
  height?: number;
  className?: string;
}

export function BookCard({
  cover,
  left,
  right,
  width = 170,
  height = 230,
  className,
}: BookCardProps) {
  const [open, setOpen] = useState(false);
  const reduced = !!useReducedMotion();
  const spring = reduced
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 110, damping: 16 } as const);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label="Open book"
      onPointerEnter={(e) => e.pointerType !== "touch" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && setOpen(false)}
      onClick={(e) => {
        // Mouse users already get hover; click is for touch and keyboard.
        if ((e.nativeEvent as PointerEvent).pointerType === "mouse") return;
        setOpen((o) => !o);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((o) => !o);
        }
      }}
      className={cn(
        "cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-depth-accent",
        className,
      )}
      style={{ width, height, perspective: 1400 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: open ? -8 : -24, x: open ? width * 0.35 : 0 }}
        transition={spring}
      >
        <div className="absolute inset-0 rounded-l-sm rounded-r-lg border border-depth-border bg-depth-surface p-4 shadow-xl">
          {right}
        </div>

        <motion.div
          className="absolute inset-0"
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            z: 1,
          }}
          animate={{ rotateY: open ? -135 : 0 }}
          transition={spring}
        >
          <div className="absolute inset-0 overflow-hidden rounded-l-sm rounded-r-lg bg-gradient-to-br from-depth-accent to-depth-accent-2 text-white shadow-lg backface-hidden">
            {cover}
          </div>
          <div
            className="absolute inset-0 rounded-l-lg rounded-r-sm border border-depth-border bg-depth-elevated p-4 backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            {left}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
