import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Orrery3D — a tiny solar system on a tilted plane. Each planet rides its own
 * orbit at its own speed, one has a ring and one has a moon, and the planets
 * always face you. Hover or focus to pause it. Pure CSS animation (transform
 * only). Needs depth-motion.css.
 */
export interface Orrery3DProps {
  /** Width of the whole system in px. */
  size?: number;
  /** Multiplies orbit speed. 2 is twice as fast. */
  speed?: number;
  /** Tilt of the orbit plane in degrees. */
  tilt?: number;
  className?: string;
}

const PLANETS = [
  { name: "Mercury", r: 0.17, d: 4.5, s: 9, c: "radial-gradient(circle at 32% 28%, #e5e7eb, #6b7280)" },
  { name: "Venus", r: 0.26, d: 9, s: 14, c: "radial-gradient(circle at 32% 28%, #fde68a, #d97706)" },
  { name: "Earth", r: 0.36, d: 14, s: 16, c: "radial-gradient(circle at 32% 28%, #bae6fd, #2563eb 55%, #166534)", moon: true },
  { name: "Mars", r: 0.46, d: 22, s: 12, c: "radial-gradient(circle at 32% 28%, #fdba74, #b91c1c)" },
  { name: "Saturn", r: 0.58, d: 38, s: 22, c: "radial-gradient(circle at 32% 28%, #fef3c7, #ca8a04)", ring: true },
];

export function Orrery3D({ size = 340, speed = 1, tilt = 66, className }: Orrery3DProps) {
  const [paused, setPaused] = useState(false);
  const state: CSSProperties = { animationPlayState: paused ? "paused" : "running" };
  const R = size / 2;

  return (
    <div
      role="img"
      aria-label="A small solar system with five planets orbiting a sun. Hover to pause."
      tabIndex={0}
      onPointerEnter={(e) => e.pointerType !== "touch" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn("relative rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg", className)}
      style={{ width: size, height: size * 0.72, perspective: 1100 }}
    >
      <div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt}deg)` }}>
        {PLANETS.map((p, i) => {
          const rad = p.r * size;
          return (
            <div key={p.name} aria-hidden style={{ transformStyle: "preserve-3d" }}>
              <span className="absolute rounded-full border border-depth-border/70" style={{ width: rad * 2, height: rad * 2, left: -rad, top: -rad }} />
              <div className="depth-spin absolute h-0 w-0" style={{ transformStyle: "preserve-3d", ...state, animationDelay: `${-(p.d / speed) * ((i * 0.37) % 1)}s`, ["--depth-orbit-duration" as string]: `${p.d / speed}s` } as CSSProperties}>
                <div className="absolute" style={{ left: rad, top: 0, transformStyle: "preserve-3d" }}>
                  <div className="depth-spin-rev absolute h-0 w-0" style={{ transformStyle: "preserve-3d", ...state, animationDelay: `${-(p.d / speed) * ((i * 0.37) % 1)}s`, ["--depth-orbit-duration" as string]: `${p.d / speed}s` } as CSSProperties}>
                    <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${-tilt}deg)` }}>
                      {p.ring && <span className="absolute rounded-full border-[3px] border-amber-200/70" style={{ width: p.s * 2.4, height: p.s * 0.9, left: -p.s * 1.2, top: -p.s * 0.45, transform: "rotate(-16deg)" }} />}
                      <span title={p.name} className="absolute block rounded-full" style={{ width: p.s, height: p.s, left: -p.s / 2, top: -p.s / 2, background: p.c, boxShadow: "0 6px 10px -4px rgba(0,0,0,.45)" }} />
                      {p.moon && (
                        <span className="depth-spin absolute h-0 w-0" style={{ ...state, ["--depth-orbit-duration" as string]: `${3 / speed}s` } as CSSProperties}>
                          <span className="absolute block rounded-full bg-neutral-300" style={{ width: 4, height: 4, left: p.s * 0.9, top: -2 }} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* sun */}
        <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${-tilt}deg)` }}>
          <span aria-hidden className="absolute block rounded-full" style={{ width: R * 0.9, height: R * 0.9, left: -R * 0.45, top: -R * 0.45, background: "radial-gradient(circle, rgba(251,191,36,.5) 0%, rgba(249,115,22,.18) 40%, transparent 70%)" }} />
          <span className="absolute block rounded-full" style={{ width: R * 0.28, height: R * 0.28, left: -R * 0.14, top: -R * 0.14, background: "radial-gradient(circle at 40% 36%, #fff7ae, #fbbf24 55%, #f97316)" }} />
        </div>
      </div>
    </div>
  );
}
