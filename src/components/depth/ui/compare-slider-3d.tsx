import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CompareSlider3D — drag a handle to reveal one thing over another, such as a
 * before and after photo. Works with images or any content. Pointer, touch and
 * keyboard (arrow keys, Home, End) all work, and the handle is a real slider.
 */
export interface CompareSlider3DProps {
  /** Content shown on the left of the handle. Usually an image. */
  before: ReactNode;
  /** Content shown on the right of the handle. Usually an image. */
  after: ReactNode;
  /** Label for the before side. */
  beforeLabel?: string;
  /** Label for the after side. */
  afterLabel?: string;
  /** Handle position from 0 to 100. Set it to control the component. */
  value?: number;
  /** Starting handle position when uncontrolled. */
  defaultValue?: number;
  /** Called with the new position (0 to 100). */
  onValueChange?: (value: number) => void;
  /** Width to height ratio of the frame. */
  aspectRatio?: string;
  /** Accessible name of the slider. */
  "aria-label"?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function CompareSlider3D({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  value: valueProp,
  defaultValue = 50,
  onValueChange,
  aspectRatio = "16 / 10",
  "aria-label": ariaLabel = "Compare before and after",
  className,
}: CompareSlider3DProps) {
  const [inner, setInner] = useState(defaultValue);
  const [drag, setDrag] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const value = Math.min(100, Math.max(0, valueProp ?? inner));

  function set(v: number) {
    const n = Math.min(100, Math.max(0, v));
    if (valueProp === undefined) setInner(n);
    onValueChange?.(n);
  }
  function fromPointer(e: PointerEvent) {
    const r = box.current?.getBoundingClientRect();
    if (r && r.width) set(((e.clientX - r.left) / r.width) * 100);
  }
  function onKeyDown(e: KeyboardEvent) {
    const step = e.shiftKey ? 10 : 2;
    const next = e.key === "ArrowRight" || e.key === "ArrowUp" ? value + step : e.key === "ArrowLeft" || e.key === "ArrowDown" ? value - step : e.key === "Home" ? 0 : e.key === "End" ? 100 : null;
    if (next === null) return;
    e.preventDefault();
    set(next);
  }

  const tag = "absolute top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm";

  return (
    <div
      ref={box}
      onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setDrag(true); fromPointer(e); }}
      onPointerMove={(e) => drag && fromPointer(e)}
      onPointerUp={() => setDrag(false)}
      onPointerCancel={() => setDrag(false)}
      style={{ aspectRatio, touchAction: "pan-y" }}
      className={cn("relative w-full select-none overflow-hidden rounded-2xl border border-depth-border bg-depth-elevated shadow-[0_14px_32px_rgb(0_0_0/0.18)]", drag ? "cursor-grabbing" : "cursor-ew-resize", className)}
    >
      <div className="absolute inset-0 [&>*]:h-full [&>*]:w-full [&>img]:object-cover">{after}</div>
      <div className="absolute inset-0 [&>*]:h-full [&>*]:w-full [&>img]:object-cover" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>{before}</div>
      <span aria-hidden className={cn(tag, "left-3")}>{beforeLabel}</span>
      <span aria-hidden className={cn(tag, "right-3")}>{afterLabel}</span>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgb(0_0_0/0.5)]" style={{ left: `${value}%` }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-valuetext={`${Math.round(value)}% ${beforeLabel}`}
        onKeyDown={onKeyDown}
        style={{ left: `${value}%` }}
        className={cn(
          "absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-depth-accent text-white outline-none transition-transform",
          "shadow-[0_4px_0_rgb(0_0_0/0.3),0_10px_20px_rgb(0_0_0/0.35)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-depth-accent",
          drag && "scale-110",
        )}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}
