import { useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * FoldPanels3D — a folding screen. One picture is cut across several hinged
 * panels that zig-zag shut and unfold flat. Click, press Enter, or use the
 * slider to fold it. Each panel is hung on the one before it, so the folds
 * stack the way real hinges do.
 */
export interface FoldPanels3DProps {
  /** The picture, drawn across all panels. Give it a full-bleed background. */
  children: ReactNode;
  /** Number of panels. */
  panels?: number;
  /** Width of one panel in px. */
  panelWidth?: number;
  /** Height of the panels in px. */
  height?: number;
  /** Fold angle at fully folded, in degrees. */
  angle?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

function Panel({
  k, n, w, h, angle, fold, children,
}: { k: number; n: number; w: number; h: number; angle: number; fold: MotionValue<number>; children: ReactNode }) {
  const sign = k % 2 ? -1 : 1;
  const rot = useTransform(fold, (f) => (k === 0 ? 0 : sign * angle * f));
  const shade = useTransform(fold, (f) => (k % 2 ? 0.38 : 0.0) * f);
  return (
    <motion.div
      className="absolute top-0 will-change-transform"
      style={{ left: k === 0 ? 0 : w, width: w, height: h, rotateY: rot, transformOrigin: "0% 50%", transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 overflow-hidden border-x border-white/10 backface-hidden">
        <div className="absolute top-0" style={{ left: -k * w, width: n * w, height: h }}>{children}</div>
        <motion.div aria-hidden className="absolute inset-0 bg-black" style={{ opacity: shade }} />
      </div>
      {k < n - 1 && (
        <Panel k={k + 1} n={n} w={w} h={h} angle={angle} fold={fold}>{children}</Panel>
      )}
    </motion.div>
  );
}

export function FoldPanels3D({ children, panels = 5, panelWidth = 90, height = 260, angle = 66, className }: FoldPanels3DProps) {
  const reduced = !!useReducedMotion();
  const [folded, setFolded] = useState(false);
  const target = useMotionValue(0);
  const fold = useSpring(target, reduced ? { duration: 0 } as never : { stiffness: 70, damping: 15 });
  const set = (v: boolean) => { setFolded(v); target.set(v ? 1 : 0); if (reduced) fold.jump(v ? 1 : 0); };
  const total = panels * panelWidth;

  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <div style={{ width: total, height, perspective: 1200 }}>
        <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(6deg) rotateY(-14deg)" }}>
          <Panel k={0} n={panels} w={panelWidth} h={height} angle={angle} fold={fold}>{children}</Panel>
        </div>
      </div>
      <button
        type="button"
        aria-pressed={folded}
        onClick={() => set(!folded)}
        className="rounded-full border border-depth-border bg-depth-surface px-5 py-2 text-sm font-medium outline-none hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent"
      >
        {folded ? "Unfold" : "Fold"}
      </button>
    </div>
  );
}
