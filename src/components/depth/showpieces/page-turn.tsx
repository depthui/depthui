import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * PageTurn — an open book whose pages turn like paper. Pages come in pairs:
 * pages[0] is the front of the first leaf, pages[1] its back, and so on.
 * Click a page, use the buttons or press the arrow keys. The closed book
 * slides to stay centred.
 */
export interface PageTurnProps {
  /** Page contents. Pages come in pairs: front and back of each leaf. */
  pages: ReactNode[];
  /** Width of one page in px. */
  pageWidth?: number;
  /** Height of one page in px. */
  pageHeight?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function PageTurn({ pages, pageWidth = 200, pageHeight = 280, className }: PageTurnProps) {
  const reduced = !!useReducedMotion();
  const leaves = Math.ceil(pages.length / 2);
  const [turned, setTurned] = useState(0);

  const go = (d: number) => setTurned((t) => Math.min(leaves, Math.max(0, t + d)));
  const shift = turned === 0 ? -pageWidth / 2 : turned === leaves ? pageWidth / 2 : 0;
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 70, damping: 15 };

  const paper =
    "backface-hidden absolute inset-0 overflow-hidden border border-depth-border bg-depth-surface p-4 text-sm";

  return (
    <div
      className={cn("flex flex-col items-center gap-5", className)}
      tabIndex={0}
      role="group"
      aria-roledescription="book"
      aria-label={`Book, leaf ${Math.min(turned + 1, leaves)} of ${leaves}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div style={{ width: pageWidth * 2, height: pageHeight, perspective: 1800 }} className="relative">
        <motion.div
          className="absolute inset-0"
          animate={{ x: shift }}
          transition={t}
          style={{ transformStyle: "preserve-3d", rotateX: 8 }}
        >
          {Array.from({ length: leaves }, (_, i) => {
            const isTurned = i < turned;
            return (
              <motion.div
                key={i}
                animate={{
                  rotateY: isTurned ? -180 : 0,
                  z: (isTurned ? i : leaves - i) * 0.4,
                }}
                transition={t}
                onClick={() => go(isTurned ? -1 : 1)}
                className="absolute top-0 cursor-pointer"
                style={{
                  left: "50%",
                  width: pageWidth,
                  height: pageHeight,
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className={cn(paper, "rounded-r-md")}>
                  {pages[i * 2]}
                  <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 to-transparent" />
                </div>
                <div className={cn(paper, "rounded-l-md")} style={{ transform: "rotateY(180deg)" }}>
                  {pages[i * 2 + 1]}
                  <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/10 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={turned === 0}
          aria-label="Previous page"
          className="rounded-full border border-depth-border bg-depth-surface px-4 py-1.5 outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent disabled:opacity-40"
        >
          ←
        </button>
        <span className="font-mono text-xs text-depth-muted" aria-live="polite">
          {turned} / {leaves}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={turned === leaves}
          aria-label="Next page"
          className="rounded-full border border-depth-border bg-depth-surface px-4 py-1.5 outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
}
