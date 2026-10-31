import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Knob3D — a rotary dial with a bevelled cap and a ring of ticks that light up
 * to the current value. Drag up or down (or around), use the arrow keys, Home,
 * End or PageUp and PageDown. It is a real slider for assistive tech.
 */
export interface Knob3DProps {
  /** Current value when controlled. */
  value?: number;
  /** Starting value when uncontrolled. */
  defaultValue?: number;
  /** Called with the new value whenever it changes. */
  onChange?: (value: number) => void;
  /** Lowest allowed value. */
  min?: number;
  /** Highest allowed value. */
  max?: number;
  /** Amount the value snaps to and changes by per key press. */
  step?: number;
  /** Accessible name for the knob. */
  label: string;
  /** Diameter in px. */
  size?: number;
  /** Show the number inside the knob. */
  showValue?: boolean;
  /** Extra classes added to the outer element. */
  className?: string;
}

const SWEEP = 270; // degrees of travel
const TICKS = 25;

export function Knob3D({
  value,
  defaultValue = 40,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  size = 150,
  showValue = true,
  className,
}: Knob3DProps) {
  const reduced = !!useReducedMotion();
  const id = useId();
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  const start = useRef({ y: 0, v: 0 });

  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n / step) * step));
  const set = (n: number) => {
    const next = clamp(n);
    if (next === v) return;
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  const pct = (v - min) / (max - min);
  const angle = useSpring(-SWEEP / 2 + pct * SWEEP, { stiffness: reduced ? 1000 : 300, damping: 28 });
  useEffect(() => {
    angle.set(-SWEEP / 2 + pct * SWEEP);
  }, [angle, pct]);

  const lit = Math.round(pct * (TICKS - 1));
  const big = (max - min) / 10;

  return (
    <div className={cn("inline-flex flex-col items-center gap-3", className)}>
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={v}
        aria-orientation="vertical"
        id={id}
        onKeyDown={(e) => {
          const k = e.key;
          if (k === "ArrowUp" || k === "ArrowRight") set(v + step);
          else if (k === "ArrowDown" || k === "ArrowLeft") set(v - step);
          else if (k === "PageUp") set(v + big);
          else if (k === "PageDown") set(v - big);
          else if (k === "Home") set(min);
          else if (k === "End") set(max);
          else return;
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          start.current = { y: e.clientY, v };
        }}
        onPointerMove={(e) => {
          if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
          const range = max - min;
          set(start.current.v + ((start.current.y - e.clientY) / 180) * range);
        }}
        className="relative cursor-grab touch-none select-none rounded-full outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg"
        style={{ width: size, height: size }}
      >
        {/* ticks */}
        {Array.from({ length: TICKS }, (_, i) => {
          const a = -SWEEP / 2 + (i / (TICKS - 1)) * SWEEP;
          return (
            <span
              key={i}
              aria-hidden
              className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2"
              style={{ transform: `translateX(-50%) rotate(${a}deg)` }}
            >
              <span
                className={cn(
                  "block w-full rounded-full transition-colors duration-150",
                  i % 6 === 0 ? "h-3" : "h-2",
                  i <= lit ? "bg-depth-accent shadow-[0_0_8px_var(--depth-accent)]" : "bg-depth-border",
                )}
              />
            </span>
          );
        })}
        {/* cap */}
        <div
          className="absolute rounded-full shadow-[0_22px_36px_-14px_var(--depth-shadow),inset_0_2px_0_rgb(255_255_255/0.5),inset_0_-8px_14px_rgb(0_0_0/0.18)]"
          style={{
            inset: size * 0.14,
            background:
              "conic-gradient(from 210deg, var(--depth-elevated), var(--depth-surface), var(--depth-elevated), var(--depth-surface), var(--depth-elevated))",
            border: "1px solid var(--depth-border)",
          }}
        >
          <motion.div className="absolute inset-0" style={{ rotate: angle }}>
            <span className="absolute left-1/2 top-[7%] h-[18%] w-1.5 -translate-x-1/2 rounded-full bg-depth-accent shadow-[0_0_10px_var(--depth-accent)]" />
          </motion.div>
          {showValue && (
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xl font-semibold tabular-nums text-depth-text">
              {v}
            </span>
          )}
        </div>
      </div>
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-widest text-depth-muted">
        {label}
      </label>
    </div>
  );
}
