import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * ColorPicker3D — pick a colour from a saturation and brightness square, a hue
 * slider, a hex field or a row of swatches. The value is a hex string such as
 * "#7c3aed". The square and hue bar are real sliders (arrow keys, Shift for
 * bigger steps), so it works with a keyboard and screen readers.
 */
export interface ColorPicker3DProps {
  /** Current colour as hex, like "#7c3aed". Set it to control the component. */
  value?: string;
  /** Starting colour when uncontrolled. */
  defaultValue?: string;
  /** Called with the new colour as lowercase hex. */
  onValueChange?: (hex: string) => void;
  /** Quick-pick colours shown under the picker. Pass an empty array to hide them. */
  swatches?: string[];
  /** Extra classes added to the outer element. */
  className?: string;
}

type HSV = { h: number; s: number; v: number };

function hexToHsv(hex: string): HSV | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
  let hue = 0;
  if (d) hue = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: hue * 60, s: max ? d / max : 0, v: max };
}
function hsvToHex({ h, s, v }: HSV) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255).toString(16).padStart(2, "0");
  };
  return `#${f(5)}${f(3)}${f(1)}`;
}
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const DEFAULT_SWATCHES = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#7c3aed", "#ec4899", "#111827", "#ffffff"];

export function ColorPicker3D({ value: valueProp, defaultValue = "#7c3aed", onValueChange, swatches = DEFAULT_SWATCHES, className }: ColorPicker3DProps) {
  const [inner, setInner] = useState<HSV>(() => hexToHsv(valueProp ?? defaultValue) ?? { h: 262, s: 0.75, v: 0.92 });
  // Keep hue when a controlled value is grey (hue is not defined for grey).
  const fromProp = valueProp !== undefined ? hexToHsv(valueProp) : null;
  const hsv: HSV = fromProp ? { h: fromProp.s === 0 || fromProp.v === 0 ? inner.h : fromProp.h, s: fromProp.s, v: fromProp.v } : inner;
  const hex = hsvToHex(hsv);
  const [text, setText] = useState<string | null>(null);

  function set(next: HSV) {
    setInner(next);
    setText(null);
    onValueChange?.(hsvToHex(next));
  }
  function areaPointer(e: PointerEvent<HTMLDivElement>) {
    if (e.type === "pointerdown") e.currentTarget.setPointerCapture(e.pointerId);
    else if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const r = e.currentTarget.getBoundingClientRect();
    set({ ...hsv, s: clamp((e.clientX - r.left) / r.width, 0, 1), v: 1 - clamp((e.clientY - r.top) / r.height, 0, 1) });
  }
  function areaKey(e: KeyboardEvent) {
    const st = e.shiftKey ? 0.1 : 0.02;
    const d = e.key === "ArrowRight" ? [st, 0] : e.key === "ArrowLeft" ? [-st, 0] : e.key === "ArrowUp" ? [0, st] : e.key === "ArrowDown" ? [0, -st] : null;
    if (!d) return;
    e.preventDefault();
    set({ ...hsv, s: clamp(hsv.s + d[0], 0, 1), v: clamp(hsv.v + d[1], 0, 1) });
  }
  function hueKey(e: KeyboardEvent) {
    const st = e.shiftKey ? 20 : 4;
    const d = e.key === "ArrowRight" || e.key === "ArrowUp" ? st : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -st : null;
    if (d === null) return;
    e.preventDefault();
    set({ ...hsv, h: clamp(hsv.h + d, 0, 360) });
  }
  function huePointer(e: PointerEvent<HTMLDivElement>) {
    if (e.type === "pointerdown") e.currentTarget.setPointerCapture(e.pointerId);
    else if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const r = e.currentTarget.getBoundingClientRect();
    set({ ...hsv, h: clamp((e.clientX - r.left) / r.width, 0, 1) * 360 });
  }
  function commitText() {
    if (text === null) return;
    const p = hexToHsv(text);
    if (p) set({ h: p.s === 0 || p.v === 0 ? hsv.h : p.h, s: p.s, v: p.v });
    setText(null);
  }

  const thumb = "pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_2px_6px_rgb(0_0_0/0.5)]";
  const focus = "outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-surface";

  return (
    <div className={cn("w-full max-w-[17rem] rounded-2xl border border-depth-border bg-depth-surface p-3.5 shadow-[0_14px_32px_rgb(0_0_0/0.14)]", className)}>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsv.s * 100)}
        aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
        onPointerDown={areaPointer}
        onPointerMove={areaPointer}
        onKeyDown={areaKey}
        style={{ touchAction: "none", backgroundColor: `hsl(${hsv.h} 100% 50%)`, backgroundImage: "linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent)" }}
        className={cn("relative h-40 w-full cursor-crosshair rounded-xl", focus)}
      >
        <span aria-hidden className={thumb} style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, backgroundColor: hex }} />
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hsv.h)}
        onPointerDown={huePointer}
        onPointerMove={huePointer}
        onKeyDown={hueKey}
        style={{ touchAction: "none", backgroundImage: "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" }}
        className={cn("relative mt-3 h-3.5 w-full cursor-pointer rounded-full", focus)}
      >
        <span aria-hidden className={cn(thumb, "top-1/2")} style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: `hsl(${hsv.h} 100% 50%)` }} />
      </div>
      <div className="mt-3 flex items-center gap-2.5">
        <span aria-hidden className="h-9 w-9 shrink-0 rounded-lg border border-depth-border shadow-[0_3px_0_var(--depth-border)]" style={{ backgroundColor: hex }} />
        <input
          aria-label="Hex colour"
          value={text ?? hex}
          spellCheck={false}
          maxLength={7}
          onChange={(e) => setText(e.target.value)}
          onBlur={commitText}
          onKeyDown={(e) => e.key === "Enter" && commitText()}
          className="h-9 min-w-0 flex-1 rounded-lg border border-depth-border bg-depth-elevated px-2.5 font-mono text-sm uppercase shadow-[inset_0_2px_4px_rgb(0_0_0/0.14)] outline-none focus-visible:ring-2 focus-visible:ring-depth-accent"
        />
      </div>
      {swatches.length > 0 && (
        <div role="group" aria-label="Swatches" className="mt-3 flex flex-wrap gap-1.5">
          {swatches.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              aria-pressed={c.toLowerCase() === hex}
              onClick={() => { const p = hexToHsv(c); if (p) set({ h: p.s === 0 || p.v === 0 ? hsv.h : p.h, s: p.s, v: p.v }); }}
              style={{ backgroundColor: c }}
              className={cn("h-6 w-6 rounded-full border border-depth-border transition-transform hover:scale-110", focus, c.toLowerCase() === hex && "ring-2 ring-depth-accent ring-offset-2 ring-offset-depth-surface")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
