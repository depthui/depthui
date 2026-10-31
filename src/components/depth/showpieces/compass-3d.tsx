import { useEffect, useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Compass3D — a compass whose needle points at your pointer, wherever it is
 * on the page, and swings past before it settles. The dial is tilted in 3D
 * under a glass dome. With no pointer yet it drifts gently.
 */
export interface Compass3DProps {
  /** Diameter in px. */
  size?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Compass3D({ size = 240, className }: Compass3DProps) {
  const reduced = !!useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const needle = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const state = useRef({ a: 0, v: 0, init: false });

  useEffect(() => {
    const h = (e: PointerEvent) => (pointer.current = { x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", h, { passive: true });
    return () => window.removeEventListener("pointermove", h);
  }, []);

  useAnimationFrame((t) => {
    const el = root.current;
    const nd = needle.current;
    if (!el || !nd) return;
    const s = state.current;
    let target = 20 * Math.sin(t / 1400);
    if (pointer.current) {
      const r = el.getBoundingClientRect();
      const dx = pointer.current.x - (r.left + r.width / 2);
      const dy = pointer.current.y - (r.top + r.height / 2);
      // The dial is tilted, so squash the vertical distance to match what you see.
      target = (Math.atan2(dy / 0.62, dx) * 180) / Math.PI + 90;
    }
    if (reduced) { s.a = target; }
    else {
      let d = ((target - s.a + 540) % 360) - 180;
      if (!s.init) { s.init = true; d = 0; }
      s.v = s.v * 0.86 + d * 0.06;
      s.a += s.v;
    }
    nd.style.transform = `rotateZ(${s.a}deg)`;
  });

  const bezel = Math.max(10, size * 0.07);
  return (
    <div
      ref={root}
      role="img"
      aria-label="A compass pointing at your cursor"
      className={cn("relative", className)}
      style={{ width: size, height: size * 0.8, perspective: 900 }}
    >
      <div className="absolute left-0 top-0" style={{ width: size, height: size, transformStyle: "preserve-3d", transform: "rotateX(52deg)" }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(from 0deg, var(--depth-border), var(--depth-elevated), var(--depth-border), var(--depth-elevated), var(--depth-border))", boxShadow: "0 40px 40px -10px var(--depth-shadow)" }}
        />
        <div className="absolute rounded-full border border-depth-border bg-depth-surface" style={{ inset: bezel }}>
          {Array.from({ length: 36 }, (_, i) => (
            <span key={i} aria-hidden className="absolute left-1/2 top-0 origin-[50%_100%]" style={{ height: size / 2 - bezel, transform: `translateX(-50%) rotate(${i * 10}deg)` }}>
              <span className={cn("mx-auto block w-px bg-depth-muted", i % 9 === 0 ? "h-3.5 bg-depth-text" : i % 3 === 0 ? "h-2.5" : "h-1.5")} />
            </span>
          ))}
          {(["N", "E", "S", "W"] as const).map((l, i) => (
            <span
              key={l}
              aria-hidden
              className={cn("absolute left-1/2 top-1/2 text-sm font-bold", l === "N" ? "text-red-500" : "text-depth-text")}
              style={{ transform: `translate(-50%,-50%) rotate(${i * 90}deg) translateY(-${size * 0.31}px) rotate(${-i * 90}deg)` }}
            >
              {l}
            </span>
          ))}
          <div ref={needle} aria-hidden className="absolute inset-0 will-change-transform" style={{ transformStyle: "preserve-3d" }}>
            <span className="absolute left-1/2 top-[14%] h-[36%] w-3.5 -translate-x-1/2 bg-gradient-to-b from-red-500 to-red-700" style={{ clipPath: "polygon(50% 0,100% 100%,0 100%)", filter: "drop-shadow(0 6px 3px rgba(0,0,0,.35))" }} />
            <span className="absolute left-1/2 top-1/2 h-[36%] w-3.5 -translate-x-1/2 bg-gradient-to-b from-neutral-200 to-neutral-400" style={{ clipPath: "polygon(0 0,100% 0,50% 100%)", filter: "drop-shadow(0 6px 3px rgba(0,0,0,.3))" }} />
            <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-200 to-amber-600" />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ inset: bezel, background: "linear-gradient(135deg, rgba(255,255,255,.35), transparent 40%)" }} />
      </div>
    </div>
  );
}

