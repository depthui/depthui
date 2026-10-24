import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ExpandingPanels3D — a row of panels where one opens wide on hover, focus
 * or tap while its neighbours lean away in 3D. Each panel is a button, so it
 * works with the keyboard. Widths animate with flex-grow, which is a layout
 * property: a documented exception to the transform-only rule, kept cheap by
 * having only a handful of panels.
 */
export interface ExpandingPanel {
  title: string;
  subtitle?: string;
  /** Tailwind classes for the panel background, e.g. "bg-gradient-to-br from-...". */
  background?: string;
  /** Extra content shown when the panel is open. */
  content?: ReactNode;
}

export interface ExpandingPanels3DProps {
  panels: ExpandingPanel[];
  defaultActive?: number;
  /** Height in px. */
  height?: number;
  className?: string;
}

export function ExpandingPanels3D({
  panels,
  defaultActive = 0,
  height = 340,
  className,
}: ExpandingPanels3DProps) {
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState(defaultActive);
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 180, damping: 24 };

  return (
    <div
      className={cn("flex w-full gap-2", className)}
      style={{ height, perspective: 1200 }}
      role="group"
      aria-label="Panels"
    >
      {panels.map((p, i) => {
        const open = i === active;
        const lean = reduced || open ? 0 : i < active ? 14 : -14;
        return (
          <motion.button
            key={p.title}
            type="button"
            aria-expanded={open}
            onPointerEnter={(e) => e.pointerType !== "touch" && setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            animate={{ flexGrow: open ? 5 : 1, rotateY: lean }}
            transition={spring}
            style={{ flexBasis: 0, minWidth: 0, transformOrigin: i < active ? "right center" : "left center" }}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-depth-border bg-depth-surface text-left outline-none focus-visible:ring-2 focus-visible:ring-depth-accent",
              p.background,
            )}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
            />
            {/* closed: vertical label */}
            <span
              className={cn(
                "absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-semibold text-white transition-opacity duration-200",
                open ? "opacity-0" : "opacity-100",
              )}
              style={{ writingMode: "vertical-rl", transform: "translateX(-50%) rotate(180deg)" }}
            >
              {p.title}
            </span>
            {/* open: full content */}
            <span
              className={cn(
                "absolute inset-x-5 bottom-5 flex flex-col gap-1 text-white transition-opacity duration-300",
                open ? "opacity-100 delay-150" : "pointer-events-none opacity-0",
              )}
            >
              <span className="text-xl font-bold leading-tight">{p.title}</span>
              {p.subtitle && <span className="text-sm text-white/80">{p.subtitle}</span>}
              {p.content}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
