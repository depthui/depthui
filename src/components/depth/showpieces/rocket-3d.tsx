import { Fragment, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Rocket3D — a rocket built as a real cylinder with a nose cone, three fins and
 * a window, turning slowly. Hover, focus or tap to light the engine: the flame
 * grows, the rocket shakes and lifts, and smoke trails below.
 */
export interface Rocket3DProps {
  /** Overall height in px. */
  size?: number;
  /** Accent colour for the nose, fins and band. */
  color?: string;
  className?: string;
}

export function Rocket3D({ size = 340, color = "#ef4444", className }: Rocket3DProps) {
  const reduced = !!useReducedMotion();
  const [on, setOn] = useState(false);
  const n = 14;
  const r = size * 0.075;
  const bodyH = size * 0.36;
  const coneH = size * 0.17;
  const slant = Math.hypot(r, coneH);
  const phi = Math.atan(r / coneH);
  const w = 2 * r * Math.tan(Math.PI / n) * 1.06;
  const shade = (i: number) => 0.05 + 0.5 * (0.5 - 0.5 * Math.cos((i / n) * Math.PI * 2 - 0.6));
  const dark = (a: number) => `linear-gradient(rgba(0,0,0,${a}), rgba(0,0,0,${a}))`;
  const body = `linear-gradient(180deg, #f8fafc 0 74%, ${color} 74% 82%, #f8fafc 82%)`;
  const p3 = { transformStyle: "preserve-3d" as const };
  const flameH = size * 0.2;
  const ease = { duration: 0.18, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={on}
      aria-label={on ? "Engine on, press to stop" : "Light the engine"}
      onPointerEnter={(e) => e.pointerType !== "touch" && setOn(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      onClick={() => setOn((v) => !v)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOn((v) => !v); } }}
      className={cn("relative cursor-pointer select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent", className)}
      style={{ width: size * 0.7, height: size, perspective: 1100 }}
    >
      <div className="absolute left-1/2 h-0 w-0" style={{ ...p3, top: size * 0.3, transform: "rotateX(-14deg)" }}>
        {on && !reduced && [0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute block rounded-full"
            style={{ left: -size * 0.04, top: bodyH + flameH * 0.6, width: size * 0.08, height: size * 0.08, background: "radial-gradient(circle, rgba(226,232,240,.85), rgba(148,163,184,0) 70%)" }}
            animate={{ y: [0, size * 0.28], x: [0, (i % 2 ? 1 : -1) * 12], opacity: [0.8, 0], scale: [0.5, 1.9] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.27, ease: "easeOut" }}
          />
        ))}
        <motion.div className="absolute left-0 top-0 h-0 w-0" style={p3} animate={{ y: on && !reduced ? -size * 0.05 : 0 }} transition={{ type: "spring", stiffness: 70, damping: 12 }}>
          <motion.div className="absolute left-0 top-0 h-0 w-0" style={p3} animate={on && !reduced ? { x: [-1.5, 1.5, -1.5] } : { x: 0 }} transition={on ? { duration: 0.12, repeat: Infinity } : { duration: 0.2 }}>
            <div className="depth-rot-y absolute left-0 top-0 h-0 w-0" style={{ ...p3, animationDuration: "9s" }}>
              {Array.from({ length: n }, (_, i) => {
                const t = `rotateY(${(i * 360) / n}deg) translateZ(${r}px)`;
                return (
                  <Fragment key={`b${i}`}>
                    <span aria-hidden className="absolute block" style={{ width: w, height: bodyH, left: -w / 2, top: 0, transform: t, background: `${dark(shade(i))}, ${body}` }} />
                    <span
                      aria-hidden
                      className="absolute block"
                      style={{ width: w, height: slant, left: -w / 2, top: -slant, transformOrigin: "50% 100%", transform: `${t} rotateX(${phi}rad)`, clipPath: "polygon(50% 0, 0 100%, 100% 100%)", background: `${dark(shade(i))}, ${color}` }}
                    />
                  </Fragment>
                );
              })}
              {/* windows */}
              {[0, 180].map((a) => (
                <span key={a} aria-hidden className="absolute block rounded-full" style={{ width: r * 0.95, height: r * 0.95, left: -r * 0.475, top: bodyH * 0.18, transform: `rotateY(${a}deg) translateZ(${r + 1.5}px)`, border: "2px solid #94a3b8", background: "radial-gradient(circle at 35% 30%, #bae6fd, #0ea5e9 55%, #0c4a6e)" }} />
              ))}
              {/* fins */}
              {[0, 120, 240].map((a) => {
                const fw = r * 1.5, fh = bodyH * 0.5;
                return (
                  <span key={a} aria-hidden className="absolute block" style={{ width: fw, height: fh, left: r - 2, top: bodyH - fh + fh * 0.18, transform: `rotateY(${a}deg)`, clipPath: "polygon(0 0, 100% 78%, 100% 100%, 0 100%)", background: `linear-gradient(90deg, ${color}, #7f1d1d)` }} />
                );
              })}
              {/* nozzle */}
              <span aria-hidden className="absolute block" style={{ width: r * 1.1, height: r * 0.5, left: -r * 0.55, top: bodyH, background: "linear-gradient(90deg,#475569,#cbd5e1,#475569)", clipPath: "polygon(0 0,100% 0,85% 100%,15% 100%)" }} />
              {/* flame: three crossed planes */}
              {[0, 60, 120].map((a) => (
                <span key={a} className="absolute block" style={{ left: -r * 0.5, top: bodyH + r * 0.5, width: r, height: flameH, transform: `rotateY(${a}deg)`, ...p3 }}>
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 block"
                    style={{ transformOrigin: "50% 0", clipPath: "polygon(50% 100%, 0 0, 100% 0)", background: "linear-gradient(180deg, #fde68a, #fb923c 45%, rgba(239,68,68,0))", filter: "blur(.5px)" }}
                    animate={reduced ? { scaleY: on ? 1.6 : 0.8 } : { scaleY: on ? [1.5, 1.9, 1.4, 1.8, 1.5] : [0.75, 0.9, 0.7, 0.85, 0.75], opacity: on ? 1 : 0.8 }}
                    transition={reduced ? { duration: 0 } : ease}
                  />
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
