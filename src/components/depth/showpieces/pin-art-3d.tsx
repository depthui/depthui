import { useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * PinArt3D — the pin-impression toy. Move across the board and the pins rise
 * to meet your pointer, then ease back down. Press and hold to push harder.
 * Every pin is driven by a tiny spring in a single animation loop, with
 * transform writes only.
 */
export interface PinArt3DProps {
  /** Number of pins per row. */
  cols?: number;
  /** Number of rows of pins. */
  rows?: number;
  /** Pin spacing in px. */
  gap?: number;
  /** How far a pin can rise, in px. */
  lift?: number;
  /** How wide the pointer's influence is, in px. */
  radius?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function PinArt3D({ cols = 18, rows = 12, gap = 22, lift = 70, radius = 70, className }: PinArt3DProps) {
  const reduced = !!useReducedMotion();
  const pins = useRef<(HTMLSpanElement | null)[]>([]);
  const z = useRef<Float32Array>(new Float32Array(cols * rows));
  const v = useRef<Float32Array>(new Float32Array(cols * rows));
  const ptr = useRef<{ x: number; y: number; down: boolean } | null>(null);
  const w = cols * gap;
  const h = rows * gap;

  useAnimationFrame(() => {
    const p = ptr.current;
    const power = p?.down ? 1.5 : 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        let target = 0;
        if (p && !reduced) {
          const dx = c * gap + gap / 2 - p.x;
          const dy = r * gap + gap / 2 - p.y;
          target = lift * power * Math.exp(-(dx * dx + dy * dy) / (2 * (radius / 1.6) ** 2));
        }
        v.current[i] = v.current[i] * 0.78 + (target - z.current[i]) * 0.12;
        z.current[i] += v.current[i];
        const el = pins.current[i];
        if (el) {
          const zi = z.current[i];
          el.style.transform = `translateZ(${zi}px)`;
          el.style.opacity = String(0.55 + Math.min(1, zi / lift) * 0.45);
        }
      }
    }
  });

  return (
    <div
      role="img"
      aria-label="A pin-art board. Move your pointer over it to push the pins up."
      className={cn("relative touch-none select-none", className)}
      style={{ width: w + 80, height: h * 0.9 + 70, perspective: 760 }}
      onPointerMove={(e) => {
        const r = (e.currentTarget.firstChild as HTMLElement).getBoundingClientRect();
        // map screen position into the (tilted) board's local plane
        const lx = ((e.clientX - r.left) / r.width) * w;
        const ly = ((e.clientY - r.top) / r.height) * h;
        ptr.current = { x: lx, y: ly, down: ptr.current?.down ?? false };
      }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); if (ptr.current) ptr.current.down = true; }}
      onPointerUp={() => { if (ptr.current) ptr.current.down = false; }}
      onPointerLeave={() => { ptr.current = null; }}
    >
      <div
        className="absolute left-1/2 top-[44px] rounded-xl bg-depth-elevated/70"
        style={{ width: w, height: h, marginLeft: -w / 2, transformStyle: "preserve-3d", transform: "rotateX(48deg)" }}
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          return (
            <span
              key={i}
              ref={(n) => { pins.current[i] = n; }}
              aria-hidden
              className="absolute block rounded-full will-change-transform"
              style={{
                width: gap * 0.62, height: gap * 0.62,
                left: c * gap + gap * 0.19, top: r * gap + gap * 0.19,
                background: "radial-gradient(circle at 34% 28%, #fff, var(--depth-accent) 52%, var(--depth-accent-2))",
                boxShadow: "0 3px 6px -2px rgba(0,0,0,.4)",
                opacity: 0.55,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
