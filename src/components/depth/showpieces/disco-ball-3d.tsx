import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * DiscoBall3D — a sphere of mirror tiles that turns slowly and flashes. Every
 * tile is a real piece of the sphere, placed with rotate and translateZ, and
 * back-facing tiles are not painted. The turn and the sparkle are CSS
 * animations (transform and opacity only). Needs depth-motion.css.
 */
export interface DiscoBall3DProps {
  /** Diameter in px. */
  size?: number;
  /** Rows of tiles from pole to pole. More rows means smaller tiles. */
  rows?: number;
  /** Seconds per turn. */
  seconds?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

// A small deterministic hash so tiles look random but never change between renders.
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function DiscoBall3D({ size = 220, rows = 11, seconds = 16, className }: DiscoBall3DProps) {
  const R = size / 2;
  const tiles = useMemo(() => {
    const out: { key: string; w: number; h: number; ry: number; rx: number; tone: number; sparkle: boolean; delay: number }[] = [];
    const h = (Math.PI * R) / rows;
    for (let r = 0; r < rows; r++) {
      const lat = -90 + ((r + 0.5) * 180) / rows; // -90..90
      const cos = Math.cos((lat * Math.PI) / 180);
      const n = Math.max(4, Math.round((2 * Math.PI * R * cos) / h));
      const w = ((2 * Math.PI * R * cos) / n) * 0.92;
      for (let j = 0; j < n; j++) {
        const k = r * 100 + j;
        out.push({ key: `${r}-${j}`, w, h: h * 0.92, ry: (j * 360) / n, rx: -lat, tone: hash(k), sparkle: hash(k + 7) > 0.72, delay: hash(k + 3) * 4 });
      }
    }
    return out;
  }, [R, rows]);

  return (
    <div
      role="img"
      aria-label="A turning mirror ball"
      className={cn("relative", className)}
      style={{ width: size, height: size + 70, perspective: 900 }}
    >
      <span aria-hidden className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-depth-muted" style={{ height: 56 }} />
      <div className="absolute left-1/2" style={{ top: 56, width: 0, height: 0, transformStyle: "preserve-3d", transform: "rotateX(-14deg)" }}>
        <div className="depth-rot-y absolute" style={{ left: 0, top: 0, width: 0, height: 0, transformStyle: "preserve-3d", animationDuration: `${seconds}s` }}>
          <div style={{ transform: `translateY(${R}px)`, transformStyle: "preserve-3d" }}>
            {tiles.map((t) => (
              <span
                key={t.key}
                aria-hidden
                className="absolute block overflow-hidden backface-hidden"
                style={{
                  width: t.w,
                  height: t.h,
                  left: -t.w / 2,
                  top: -t.h / 2,
                  transform: `rotateY(${t.ry}deg) rotateX(${t.rx}deg) translateZ(${R}px)`,
                  background: `linear-gradient(${120 + t.tone * 90}deg, #f4f4fb, #9a98b8 ${35 + t.tone * 30}%, #d8d6ee)`,
                  boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,.55)",
                }}
              >
                {t.sparkle && <span className="depth-sparkle absolute inset-0 bg-white" style={{ animationDelay: `${t.delay}s` }} />}
              </span>
            ))}
          </div>
        </div>
      </div>
      <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 56, width: size, height: size, boxShadow: "0 0 70px 6px var(--depth-glare), 0 30px 50px -18px var(--depth-shadow)" }} />
    </div>
  );
}
