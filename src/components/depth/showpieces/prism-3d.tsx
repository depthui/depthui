import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Prism3D — a rotating prism that works as tabs. Give it 3 to 8 faces. Use
 * the buttons, the dots, or the arrow keys. Rotation keeps going in one
 * direction instead of unwinding back through the faces.
 */
export interface Prism3DProps {
  /** Content of each face of the prism. */
  faces: ReactNode[];
  /** Face width in px. */
  width?: number;
  /** Face height in px. */
  height?: number;
  /** Accessible name for each face, in the same order as faces. */
  labels?: string[];
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Prism3D({ faces, width = 260, height = 170, labels, className }: Prism3DProps) {
  const reduced = !!useReducedMotion();
  const n = Math.min(8, Math.max(3, faces.length));
  const step = 360 / n;
  const apothem = width / 2 / Math.tan(Math.PI / n);
  const [turn, setTurn] = useState(0);
  const index = ((turn % n) + n) % n;
  const go = (d: number) => setTurn((t) => t + d);

  return (
    <div
      className={cn("flex flex-col items-center gap-5", className)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div style={{ width, height, perspective: 900, marginBottom: 16 }} aria-live="polite">
        <motion.div
          className="relative h-full w-full will-change-transform"
          animate={{ rotateY: -turn * step }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 16 }}
          style={{ transformStyle: "preserve-3d", z: -apothem }}
        >
          {faces.slice(0, n).map((face, i) => (
            <div
              key={i}
              role="tabpanel"
              aria-hidden={i !== index}
              className="absolute inset-0 overflow-hidden rounded-2xl border border-depth-border bg-depth-surface backface-hidden"
              style={{ transform: `rotateY(${i * step}deg) translateZ(${apothem}px)` }}
            >
              {face}
            </div>
          ))}
        </motion.div>
      </div>
      <div role="tablist" aria-label="Prism faces" className="flex items-center gap-3">
        <button type="button" aria-label="Previous face" onClick={() => go(-1)} className="rounded-full border border-depth-border bg-depth-surface px-3 py-1 text-sm outline-none hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent">←</button>
        {faces.slice(0, n).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={labels?.[i] ?? `Face ${i + 1}`}
            onClick={() => go(i - index)}
            className={cn("h-2.5 rounded-full outline-none transition-all focus-visible:ring-2 focus-visible:ring-depth-accent", i === index ? "w-6 bg-depth-accent" : "w-2.5 bg-depth-border")}
          />
        ))}
        <button type="button" aria-label="Next face" onClick={() => go(1)} className="rounded-full border border-depth-border bg-depth-surface px-3 py-1 text-sm outline-none hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent">→</button>
      </div>
    </div>
  );
}
