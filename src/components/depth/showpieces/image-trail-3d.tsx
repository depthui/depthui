import { useRef, type ReactNode } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ImageTrail3D — a trail of cards that follow your pointer. Each one tilts in
 * from depth, floats up, and fades away. Cards are reused from a small pool
 * and animated straight on the DOM, so a fast swipe does not cause renders.
 */
export interface ImageTrail3DProps {
  /** What the cards show, cycled in order. */
  items: ReactNode[];
  /** Card width and height in px. */
  size?: number;
  /** Pointer travel in px before the next card appears. */
  distance?: number;
  /** Size of the reuse pool. */
  pool?: number;
  /** Shown in the middle until the first move. */
  hint?: ReactNode;
  className?: string;
}

export function ImageTrail3D({ items, size = 110, distance = 70, pool = 14, hint = "Move your pointer here", className }: ImageTrail3DProps) {
  const reduced = !!useReducedMotion();
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const next = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const spawn = (x: number, y: number) => {
    const el = els.current[next.current % pool];
    if (!el) return;
    const idx = next.current;
    next.current += 1;
    el.style.left = `${x - size / 2}px`;
    el.style.top = `${y - size * 0.65}px`;
    el.style.zIndex = String(idx % 1000);
    const tilt = (Math.random() - 0.5) * 24;
    animate(
      el,
      {
        opacity: [0, 1, 1, 0],
        scale: [0.35, 1, 1, 0.8],
        y: [30, 0, -26, -60],
        rotateX: [55, 0, 0, -20],
        rotateZ: [tilt, tilt * 0.4, tilt * 0.2, 0],
      },
      { duration: 1.25, times: [0, 0.22, 0.6, 1], ease: "easeOut" },
    );
  };

  return (
    <div
      role="img"
      aria-label="Move your pointer to leave a trail of cards"
      className={cn("relative touch-pan-y select-none overflow-hidden rounded-2xl", className)}
      style={{ perspective: 800, minHeight: 320 }}
      onPointerMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (hintRef.current) hintRef.current.style.opacity = "0";
        if (!last.current || Math.hypot(x - last.current.x, y - last.current.y) > distance) {
          last.current = { x, y };
          spawn(x, y);
        }
      }}
      onPointerLeave={() => (last.current = null)}
    >
      <div ref={hintRef} className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-depth-muted transition-opacity duration-500">{hint}</div>
      {Array.from({ length: pool }, (_, p) => (
        <div
          key={p}
          ref={(n) => { els.current[p] = n; }}
          aria-hidden
          className="pointer-events-none absolute overflow-hidden rounded-xl border border-white/20 opacity-0 shadow-[0_18px_28px_-14px_var(--depth-shadow)] will-change-transform"
          style={{ width: size, height: size * 1.3 }}
        >
          <div className="absolute inset-0">{items[p % items.length]}</div>
        </div>
      ))}
    </div>
  );
}
