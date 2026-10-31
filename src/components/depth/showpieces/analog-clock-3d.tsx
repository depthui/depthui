import { useRef } from "react";
import { motion, useAnimationFrame, useReducedMotion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * AnalogClock3D — a working clock with real depth: a raised bezel, a recessed
 * dial, and hands that float above it and cast their own shadows. The second
 * hand sweeps smoothly. Hands are written to the DOM each frame (no React
 * renders). It tilts with your pointer.
 */
export interface AnalogClock3DProps {
  /** Diameter in px. */
  size?: number;
  /** Hours from UTC. Leave out to use the viewer's local time. */
  utcOffset?: number;
  /** Short text shown on the dial and before the digital time. */
  label?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function AnalogClock3D({ size = 240, utcOffset, label, className }: AnalogClock3DProps) {
  const reduced = !!useReducedMotion();
  const { ref, rotateX, rotateY, handlers } = useTilt({ max: 12 });
  const hour = useRef<HTMLDivElement>(null);
  const minute = useRef<HTMLDivElement>(null);
  const second = useRef<HTMLDivElement>(null);
  const shadows = useRef<(HTMLDivElement | null)[]>([]);
  const text = useRef<HTMLSpanElement>(null);
  const lastMin = useRef(-1);

  useAnimationFrame(() => {
    let d = new Date();
    if (utcOffset !== undefined) d = new Date(d.getTime() + (utcOffset * 60 + d.getTimezoneOffset()) * 60000);
    const ms = d.getMilliseconds();
    const s = d.getSeconds() + (reduced ? 0 : ms / 1000);
    const m = d.getMinutes() + s / 60;
    const h = (d.getHours() % 12) + m / 60;
    const set = (el: HTMLElement | null | undefined, deg: number) => el && (el.style.transform = `rotate(${deg}deg)`);
    set(hour.current, h * 30);
    set(minute.current, m * 6);
    set(second.current, s * 6);
    set(shadows.current[0], h * 30);
    set(shadows.current[1], m * 6);
    set(shadows.current[2], s * 6);
    if (text.current && lastMin.current !== d.getMinutes()) {
      lastMin.current = d.getMinutes();
      text.current.textContent = `${label ? label + ": " : ""}${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
  });

  const hand = (len: number, w: number, color: string) => ({ height: size * len, width: w, left: -w / 2, top: -size * len, background: color });
  const hands: [number, number, string][] = [[0.24, 6, "var(--depth-text)"], [0.36, 4, "var(--depth-text)"], [0.4, 2, "#ef4444"]];
  const refs = [hour, minute, second];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div ref={ref} {...handlers} role="img" aria-label="Analog clock" style={{ width: size, height: size, perspective: 900 }}>
        <motion.div className="relative h-full w-full" style={{ transformStyle: "preserve-3d", rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
          {/* case */}
          <div className="absolute inset-0 rounded-full border border-depth-border bg-gradient-to-br from-depth-elevated to-depth-border" style={{ boxShadow: "0 36px 40px -16px var(--depth-shadow)" }} />
          <div className="absolute rounded-full bg-gradient-to-b from-depth-border to-depth-elevated" style={{ inset: size * 0.025, transform: "translateZ(8px)" }} />
          {/* dial */}
          <div className="absolute rounded-full border border-depth-border bg-depth-surface" style={{ inset: size * 0.06, transform: "translateZ(14px)", boxShadow: "inset 0 6px 16px -6px var(--depth-shadow)" }}>
            {Array.from({ length: 60 }, (_, i) => (
              <span key={i} aria-hidden className="absolute left-1/2 top-0 origin-[50%_100%]" style={{ height: size / 2 - size * 0.06, transform: `translateX(-50%) rotate(${i * 6}deg)` }}>
                <span className={cn("mx-auto block bg-depth-muted", i % 5 === 0 ? "h-3 w-[3px] bg-depth-text" : "h-1.5 w-px")} />
              </span>
            ))}
            {[12, 3, 6, 9].map((n, i) => (
              <span key={n} aria-hidden className="absolute left-1/2 top-1/2 font-semibold text-depth-text" style={{ fontSize: size * 0.08, transform: `translate(-50%,-50%) rotate(${i * 90}deg) translateY(-${size * 0.31}px) rotate(${-i * 90}deg)` }}>{n}</span>
            ))}
            {label && <span aria-hidden className="absolute left-1/2 text-[10px] uppercase tracking-widest text-depth-muted" style={{ top: "62%", transform: "translateX(-50%)" }}>{label}</span>}
          </div>
          {/* hand shadows, then hands, each lifted off the dial */}
          <div className="absolute left-1/2 top-1/2" style={{ transformStyle: "preserve-3d", transform: "translateZ(24px)" }} aria-hidden>
            {hands.map(([len, w], i) => (
              <div key={`s${i}`} ref={(n) => { shadows.current[i] = n; }} className="absolute origin-bottom rounded-full bg-black/25 blur-[3px]" style={{ ...hand(len, w, "rgba(0,0,0,.25)"), transform: "translate3d(5px,9px,-6px)" }} />
            ))}
            {hands.map(([len, w, c], i) => (
              <div key={i} ref={refs[i]} className="absolute origin-bottom rounded-full will-change-transform" style={{ ...hand(len, w, c), zIndex: i }} />
            ))}
            <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-600" style={{ transform: "translateZ(10px)" }} />
          </div>
        </motion.div>
      </div>
      <span ref={text} className="sr-only" aria-live="off" />
    </div>
  );
}
