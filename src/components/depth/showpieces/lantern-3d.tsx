import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Lantern3D — a paper lantern that turns and sways, with a flickering candle
 * inside. The paper is see-through, so you can see the far side and the glow
 * through it. Gold caps and a tassel finish it. Hover or focus to pause it.
 */
export interface Lantern3DProps {
  /** Lantern height in px. */
  size?: number;
  /** Character shown on the four gold plaques. */
  mark?: string;
  /** Paper hue: 0 is red, 40 is amber. */
  hue?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Lantern3D({ size = 220, mark = "福", hue = 2, className }: Lantern3DProps) {
  const reduced = !!useReducedMotion();
  const [paused, setPaused] = useState(false);
  const n = 24;
  const r = size * 0.27;
  const h = size * 0.62;
  const w = 2 * r * Math.tan(Math.PI / n) * 1.08;
  const paper = `linear-gradient(180deg, hsl(${hue} 80% 30% / .95), hsl(${hue} 85% 48% / .8) 22%, hsl(${hue + 18} 95% 62% / .8) 50%, hsl(${hue} 85% 48% / .8) 78%, hsl(${hue} 80% 30% / .95))`;
  const p3 = { transformStyle: "preserve-3d" as const };
  const state = paused ? "paused" : "running";
  const gold = "linear-gradient(90deg,#92400e,#fcd34d 40%,#b45309)";
  const cap = (top: number) => (
    <span aria-hidden className="absolute block rounded-full" style={{ width: r * 1.7, height: r * 1.7, left: -r * 0.85, top: top - r * 0.85, transform: "rotateX(90deg)", background: "radial-gradient(circle, #fde68a, #b45309 80%)", border: "3px solid #78350f" }} />
  );

  return (
    <div
      role="img"
      aria-label="A turning paper lantern with a flickering light"
      tabIndex={0}
      onPointerEnter={(e) => e.pointerType !== "touch" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn("relative rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent", className)}
      style={{ width: size * 0.9, height: size * 1.35, perspective: 1000 }}
    >
      <motion.div
        className="absolute left-1/2 h-0 w-0"
        style={{ ...p3, top: size * 0.12, transformOrigin: "0 0" }}
        animate={reduced ? undefined : { rotateZ: [-3, 3] }}
        transition={{ duration: 3.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        <span aria-hidden className="absolute block" style={{ width: 2, height: size * 0.14, left: -1, top: -size * 0.14, background: "#78350f" }} />
        <div style={{ ...p3, transform: "rotateX(-12deg)" }} className="absolute left-0 top-0 h-0 w-0">
          <div className="depth-rot-y absolute left-0 top-0 h-0 w-0" style={{ ...p3, animationDuration: "16s", animationPlayState: state }}>
            {/* candle light: three crossed glow planes */}
            {[0, 60, 120].map((a) => (
              <motion.span
                key={a}
                aria-hidden
                className="absolute block rounded-full"
                style={{ width: r * 1.5, height: h * 0.8, left: -r * 0.75, top: h * 0.1, transform: `rotateY(${a}deg)`, background: "radial-gradient(ellipse, rgba(254,240,138,.95), rgba(251,146,60,.5) 45%, rgba(251,146,60,0) 70%)" }}
                animate={reduced ? undefined : { opacity: [0.85, 1, 0.7, 0.95, 0.8] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
            {Array.from({ length: n }, (_, i) => (
              <span key={i} aria-hidden className="absolute block" style={{ width: w, height: h, left: -w / 2, top: 0, transform: `rotateY(${(i * 360) / n}deg) translateZ(${r}px)`, background: paper, boxShadow: "inset 1px 0 0 rgba(90,10,10,.45)" }} />
            ))}
            {[0, 90, 180, 270].map((a) => (
              <span key={a} aria-hidden className="absolute flex items-center justify-center rounded-full font-bold" style={{ width: r * 0.7, height: r * 0.7, left: -r * 0.35, top: h * 0.5 - r * 0.35, transform: `rotateY(${a}deg) translateZ(${r + 1.5}px)`, background: gold, color: `hsl(${hue} 80% 28%)`, fontSize: r * 0.42, border: "2px solid #78350f" }}>
                {mark}
              </span>
            ))}
            {cap(0)}
            {cap(h)}
            <span aria-hidden className="absolute block" style={{ width: r * 0.5, height: r * 0.18, left: -r * 0.25, top: -r * 0.2, background: gold, borderRadius: 4 }} />
            <motion.span
              aria-hidden
              className="absolute block"
              style={{ width: 22, left: -11, top: h + 2, height: size * 0.3, transformOrigin: "50% 0", background: "linear-gradient(90deg, transparent 8%, #ef4444 8% 14%, transparent 14% 32%, #f59e0b 32% 38%, transparent 38% 62%, #f59e0b 62% 68%, transparent 68% 86%, #ef4444 86% 92%, transparent 92%)", transform: "translateZ(0)" }}
              animate={reduced ? undefined : { rotateZ: [4, -4] }}
              transition={{ duration: 1.9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
