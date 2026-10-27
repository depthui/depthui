import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Slider3D — a range slider with a raised, glossy knob and a value bubble that
 * lifts up while you drag. It is a real `role="slider"`: drag or click the
 * track, or use the arrow, Page Up/Down, Home and End keys. Controlled or
 * uncontrolled. (The knob moves with `left`, a tiny element, so layout cost is
 * negligible; the fill uses a transform.)
 */
export interface Slider3DProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Show the value bubble while dragging or focused. */
  showValue?: boolean;
  formatValue?: (value: number) => string;
  /** Required: names the slider for screen readers. */
  "aria-label": string;
  className?: string;
}

export function Slider3D({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  showValue = true,
  formatValue = (v) => String(v),
  "aria-label": ariaLabel,
  className,
}: Slider3DProps) {
  const [inner, setInner] = useState(defaultValue);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const value = Math.min(max, Math.max(min, valueProp ?? inner));
  const pct = max === min ? 0 : (value - min) / (max - min);

  function commit(raw: number) {
    const snapped = Math.round((raw - min) / step) * step + min;
    const v = Number(Math.min(max, Math.max(min, snapped)).toFixed(6));
    if (v === value) return;
    if (valueProp === undefined) setInner(v);
    onValueChange?.(v);
  }
  function fromPointer(clientX: number) {
    const r = rect.current;
    if (!r || r.width === 0) return;
    commit(min + Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * (max - min));
  }
  function down(e: PointerEvent) {
    if (disabled) return;
    rect.current = track.current?.getBoundingClientRect() ?? null;
    e.currentTarget.setPointerCapture(e.pointerId);
    setActive(true);
    fromPointer(e.clientX);
  }
  function key(e: KeyboardEvent) {
    const big = Math.max(step, (max - min) / 10);
    const delta: Record<string, number> = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: big, PageDown: -big };
    if (e.key in delta) { e.preventDefault(); commit(value + delta[e.key]); }
    else if (e.key === "Home") { e.preventDefault(); commit(min); }
    else if (e.key === "End") { e.preventDefault(); commit(max); }
  }

  const lifted = active || focus;

  return (
    <div
      onPointerDown={down}
      onPointerMove={(e) => active && fromPointer(e.clientX)}
      onPointerUp={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
      className={cn("relative touch-none select-none px-3 py-5", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer", className)}
    >
      <div ref={track} className="relative h-2 rounded-full bg-depth-border shadow-[inset_0_2px_3px_rgb(0_0_0/0.25)]">
        <div className="absolute inset-0 origin-left overflow-hidden rounded-full" style={{ transform: `scaleX(${pct})` }}>
          <div className="h-full w-full bg-gradient-to-r from-depth-accent to-depth-accent-2" />
        </div>
        <button
          type="button"
          role="slider"
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue(value)}
          disabled={disabled}
          onKeyDown={key}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="absolute top-1/2 block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none"
          style={{ left: `${pct * 100}%` }}
        >
          <span
            aria-hidden
            className={cn(
              "block h-full w-full rounded-full bg-gradient-to-b from-white to-slate-200 transition-transform duration-150",
              "shadow-[0_4px_8px_rgb(0_0_0/0.35),inset_0_-2px_3px_rgb(0_0_0/0.12),inset_0_2px_2px_rgb(255_255_255/0.95)]",
              active && "scale-110",
              focus && "ring-2 ring-depth-accent ring-offset-2 ring-offset-depth-bg",
            )}
          />
          {showValue && (
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-depth-text px-2 py-1 text-xs font-medium text-depth-bg shadow-lg transition-all duration-150",
                lifted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
              )}
            >
              {formatValue(value)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
