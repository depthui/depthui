import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * NumberInput3D — a number field with raised minus and plus buttons. Hold a
 * button to keep stepping. A real spinbutton: Arrow keys step, PageUp and
 * PageDown step by ten, Home and End jump to min and max. Typed values are
 * clamped to min and max when you leave the field.
 */
export interface NumberInput3DProps {
  /** Current value. Set it to control the component. */
  value?: number;
  /** Starting value when uncontrolled. */
  defaultValue?: number;
  /** Called with the new value. */
  onValueChange?: (value: number) => void;
  /** Smallest allowed value. */
  min?: number;
  /** Largest allowed value. */
  max?: number;
  /** Amount added or taken away by each step. */
  step?: number;
  /** Text shown after the number, such as "kg". */
  unit?: string;
  /** Required: names the field for screen readers. */
  "aria-label": string;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function NumberInput3D({ value: valueProp, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, unit, "aria-label": ariaLabel, className }: NumberInput3DProps) {
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;
  const [text, setText] = useState(String(value));
  const [editing, setEditing] = useState(false);
  const latest = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const decimals = (String(step).split(".")[1] ?? "").length;
  const clamp = (n: number) => Math.min(max, Math.max(min, Number(n.toFixed(decimals))));

  useEffect(() => {
    latest.current = value;
    if (!editing) setText(String(value));
  }, [value, editing]);
  useEffect(() => () => clearTimeout(timer.current), []);

  function set(n: number) {
    const v = clamp(n);
    latest.current = v;
    if (valueProp === undefined) setInner(v);
    onValueChange?.(v);
    return v;
  }
  function hold(dir: 1 | -1) {
    set(latest.current + dir * step);
    let delay = 400;
    const tick = () => {
      set(latest.current + dir * step);
      delay = Math.max(50, delay * 0.8);
      timer.current = setTimeout(tick, delay);
    };
    timer.current = setTimeout(tick, delay);
  }
  const stop = () => clearTimeout(timer.current);

  function onKeyDown(e: KeyboardEvent) {
    const next =
      e.key === "ArrowUp" ? value + step
      : e.key === "ArrowDown" ? value - step
      : e.key === "PageUp" ? value + step * 10
      : e.key === "PageDown" ? value - step * 10
      : e.key === "Home" && isFinite(min) ? min
      : e.key === "End" && isFinite(max) ? max
      : null;
    if (next === null) return;
    e.preventDefault();
    set(next);
  }
  function commit() {
    setEditing(false);
    const n = parseFloat(text.replace(",", "."));
    const v = Number.isNaN(n) ? value : set(n);
    setText(String(v));
  }

  const btn =
    "flex h-11 w-11 select-none items-center justify-center rounded-xl border border-depth-border bg-depth-surface text-lg font-medium outline-none transition-[transform,box-shadow] shadow-[0_4px_0_var(--depth-border)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--depth-border)] focus-visible:ring-2 focus-visible:ring-depth-accent disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button type="button" tabIndex={-1} aria-label="Decrease" disabled={value <= min} className={btn} onPointerDown={() => hold(-1)} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onClick={(e) => e.detail === 0 && set(value - step)}>−</button>
      <div className="relative">
        <input
          role="spinbutton"
          aria-label={ariaLabel}
          aria-valuenow={value}
          aria-valuemin={isFinite(min) ? min : undefined}
          aria-valuemax={isFinite(max) ? max : undefined}
          inputMode="decimal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setEditing(true)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          className={cn("h-11 w-24 rounded-xl border border-depth-border bg-depth-elevated text-center text-sm font-medium tabular-nums shadow-[inset_0_2px_5px_rgb(0_0_0/0.14)] outline-none focus-visible:ring-2 focus-visible:ring-depth-accent", unit && "pr-7")}
        />
        {unit && <span aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-depth-muted">{unit}</span>}
      </div>
      <button type="button" tabIndex={-1} aria-label="Increase" disabled={value >= max} className={btn} onPointerDown={() => hold(1)} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onClick={(e) => e.detail === 0 && set(value + step)}>+</button>
    </div>
  );
}
