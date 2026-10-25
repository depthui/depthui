import { useRef } from "react";
import { useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Pyramid3D — a four-sided pyramid with a labelled face on every side. It
 * turns slowly on its own; drag to spin it yourself and it keeps the swing
 * when you let go. Faces are triangles cut with clip-path.
 */
export interface Pyramid3DProps {
  /** Labels for the four faces. */
  labels?: [string, string, string, string];
  /** Base width in px. */
  size?: number;
  /** Idle turn speed in degrees per second. */
  speed?: number;
  className?: string;
}

const TINTS = [
  "linear-gradient(160deg,#a78bfa,#6d28d9)",
  "linear-gradient(160deg,#38bdf8,#1d4ed8)",
  "linear-gradient(160deg,#f472b6,#be185d)",
  "linear-gradient(160deg,#34d399,#047857)",
];

export function Pyramid3D({ labels = ["Depth", "Light", "Space", "Form"], size = 200, speed = 22, className }: Pyramid3DProps) {
  const reduced = !!useReducedMotion();
  const H = size * 0.95;
  const slant = Math.hypot(H, size / 2);
  const lean = (Math.atan2(size / 2, H) * 180) / Math.PI;
  const ry = useMotionValue(25);
  const vel = useRef(0);
  const drag = useRef<number | null>(null);
  const el = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, dt) => {
    const s = dt / 1000;
    if (drag.current === null) {
      const target = reduced ? 0 : speed;
      vel.current += (target - vel.current) * Math.min(1, s * 2.2);
      ry.set(ry.get() + vel.current * s);
    }
    if (el.current) el.current.style.transform = `rotateX(-14deg) rotateY(${ry.get()}deg)`;
  });

  return (
    <div
      role="img"
      aria-label="A turning pyramid. Drag to spin it."
      className={cn("relative cursor-grab touch-none select-none active:cursor-grabbing", className)}
      style={{ width: size * 1.5, height: H * 1.4, perspective: 900 }}
      onPointerDown={(e) => { drag.current = e.clientX; vel.current = 0; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => {
        if (drag.current === null) return;
        const dx = e.clientX - drag.current;
        ry.set(ry.get() + dx * 0.6);
        vel.current = dx * 6;
        drag.current = e.clientX;
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      <div ref={el} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
        {labels.map((label, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute flex items-end justify-center pb-[14%] text-sm font-bold tracking-wide text-white"
            style={{
              width: size, height: slant, left: -size / 2, top: H / 2 - slant,
              background: TINTS[i], clipPath: "polygon(50% 0,0 100%,100% 100%)",
              transformOrigin: "50% 100%",
              transform: `rotateY(${i * 90}deg) translateZ(${size / 2}px) rotateX(${lean}deg)`,
              backfaceVisibility: "hidden",
            }}
          >
            {label}
          </div>
        ))}
        <div aria-hidden className="absolute bg-neutral-900" style={{ width: size, height: size, left: -size / 2, top: -size / 2 + H / 2, transform: "rotateX(90deg)" }} />
      </div>
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-4 w-3/5 -translate-x-1/2 rounded-[50%] bg-black/25 blur-md" />
    </div>
  );
}
