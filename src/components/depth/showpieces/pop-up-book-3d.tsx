import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * PopUpBook3D — an open book seen from above. Hover, focus or tap and the
 * paper scenery on the right page stands up, one cut-out after another, then
 * folds flat again. Each cut-out hinges on its own bottom edge, and they are
 * staggered back to front.
 */
export interface PopUpBook3DProps {
  /** Width of one page in px. */
  pageWidth?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

const CUTOUTS: { name: string; clip: string; from: string; to: string; x: number; y: number; w: number; h: number }[] = [
  { name: "sun", clip: "circle(50% at 50% 50%)", from: "#fde047", to: "#f59e0b", x: 0.64, y: 0.3, w: 0.16, h: 0.16 },
  { name: "hills", clip: "ellipse(62% 100% at 50% 100%)", from: "#34d399", to: "#047857", x: 0.04, y: 0.44, w: 0.92, h: 0.3 },
  { name: "house", clip: "polygon(0 100%,0 44%,50% 0,100% 44%,100% 100%)", from: "#fb7185", to: "#be123c", x: 0.14, y: 0.66, w: 0.34, h: 0.3 },
  { name: "tree", clip: "polygon(50% 0,92% 58%,66% 58%,100% 100%,0 100%,34% 58%,8% 58%)", from: "#4ade80", to: "#15803d", x: 0.62, y: 0.8, w: 0.2, h: 0.32 },
];

export function PopUpBook3D({ pageWidth = 210, className }: PopUpBook3DProps) {
  const reduced = !!useReducedMotion();
  const [up, setUp] = useState(false);
  const H = pageWidth * 1.15;

  return (
    <button
      type="button"
      aria-pressed={up}
      aria-label={up ? "Fold the pop-up scene flat" : "Pop up the scene"}
      onPointerEnter={(e) => e.pointerType !== "touch" && setUp(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && setUp(false)}
      onFocus={() => setUp(true)}
      onBlur={() => setUp(false)}
      onClick={() => setUp((v) => !v)}
      className={cn("block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg", className)}
      style={{ width: pageWidth * 2 + 40, height: H * 0.8 + pageWidth * 0.5, perspective: 1100 }}
    >
      <div className="relative mx-auto" style={{ width: pageWidth * 2, height: H, transformStyle: "preserve-3d", transform: "translateY(12%) rotateX(58deg)", marginTop: 40 }}>
        {/* left page */}
        <div className="absolute left-0 top-0 rounded-l-md border border-depth-border bg-gradient-to-r from-depth-surface to-depth-elevated p-5 text-left" style={{ width: pageWidth, height: H, boxShadow: "inset -14px 0 18px -14px rgba(0,0,0,.25)" }}>
          <span className="block h-3 w-2/3 rounded bg-depth-accent/50" />
          {[0.9, 0.8, 0.95, 0.7, 0.85, 0.6].map((w, i) => (
            <span key={i} className="mt-3 block h-1.5 rounded bg-depth-border" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
        {/* right page */}
        <div className="absolute right-0 top-0 rounded-r-md border border-depth-border bg-gradient-to-l from-depth-surface to-depth-elevated" style={{ width: pageWidth, height: H, boxShadow: "inset 14px 0 18px -14px rgba(0,0,0,.25), 0 30px 40px -20px var(--depth-shadow)", transformStyle: "preserve-3d" }}>
          {CUTOUTS.map((c, i) => (
            <motion.span
              key={c.name}
              aria-hidden
              className="absolute block will-change-transform"
              initial={false}
              animate={{ rotateX: up ? -90 : 0 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 12, delay: up ? i * 0.09 : (CUTOUTS.length - 1 - i) * 0.04 }}
              style={{
                left: c.x * pageWidth,
                top: c.y * H - c.h * pageWidth,
                width: c.w * pageWidth,
                height: c.h * pageWidth,
                transformOrigin: "50% 100%",
                background: `linear-gradient(160deg, ${c.from}, ${c.to})`,
                clipPath: c.clip,
              }}
            />
          ))}
        </div>
        {/* spine */}
        <span aria-hidden className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-r from-black/30 via-black/10 to-black/30" />
      </div>
    </button>
  );
}
