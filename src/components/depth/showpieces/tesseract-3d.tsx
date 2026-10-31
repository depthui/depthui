import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Tesseract3D — a cube inside a cube, joined corner to corner: the classic
 * picture of a four-dimensional hypercube. Everything is drawn with CSS 3D.
 * The shape tumbles on two axes. Hover or focus to pause it.
 */
export interface Tesseract3DProps {
  /** Outer cube edge in px. */
  size?: number;
  /** Base hue, 0 to 360. */
  hue?: number;
  /** Seconds for one full turn. */
  seconds?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Tesseract3D({ size = 170, hue = 190, seconds = 16, className }: Tesseract3DProps) {
  const [paused, setPaused] = useState(false);
  const R = size / 2;
  const r = size / 4;
  const c1 = `hsl(${hue} 95% 66%)`;
  const c2 = `hsl(${(hue + 70) % 360} 95% 72%)`;

  const cube = (h: number, stroke: string, fill: string) =>
    ["translateZ", "rotateY(180deg) translateZ", "rotateY(90deg) translateZ", "rotateY(-90deg) translateZ", "rotateX(90deg) translateZ", "rotateX(-90deg) translateZ"].map((t, i) => (
      <span
        key={i}
        aria-hidden
        className="absolute block"
        style={{
          width: h * 2,
          height: h * 2,
          left: -h,
          top: -h,
          transform: `${t}(${h}px)`,
          border: `1.5px solid ${stroke}`,
          background: fill,
          boxShadow: `inset 0 0 ${h * 0.4}px ${stroke}55, 0 0 ${h * 0.12}px ${stroke}66`,
        }}
      />
    ));

  const corners: [number, number, number][] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) corners.push([x, y, z]);

  const state = paused ? "paused" : "running";
  const zero = "absolute left-1/2 top-1/2 h-0 w-0";
  const p3 = { transformStyle: "preserve-3d" as const };

  return (
    <div
      role="img"
      aria-label="A rotating tesseract, a cube inside a cube"
      tabIndex={0}
      onPointerEnter={(e) => e.pointerType !== "touch" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn("relative rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent", className)}
      style={{ width: size * 1.9, height: size * 1.9, perspective: 1000 }}
    >
      <div className={zero} style={{ ...p3, transform: "rotateX(-22deg) rotateZ(6deg)" }}>
        <div className={cn(zero, "depth-rot-y")} style={{ ...p3, animationDuration: `${seconds}s`, animationPlayState: state }}>
          <div className={cn(zero, "depth-rot-x")} style={{ ...p3, animationDuration: `${seconds * 1.5}s`, animationPlayState: state }}>
            {cube(R, c1, `hsl(${hue} 95% 60% / .04)`)}
            {cube(r, c2, `hsl(${(hue + 70) % 360} 95% 60% / .12)`)}
            {corners.map(([sx, sy, sz], i) => {
              const dx = sx * (r - R), dy = sy * (r - R), dz = sz * (r - R);
              const len = Math.hypot(dx, dy, dz);
              const b = Math.asin(dy / len);
              const a = Math.atan2(-dz, dx);
              return (
                <span
                  key={i}
                  aria-hidden
                  className="absolute block"
                  style={{
                    left: 0,
                    top: -1,
                    width: len,
                    height: 2,
                    transformOrigin: "0 50%",
                    transform: `translate3d(${sx * R}px, ${sy * R}px, ${sz * R}px) rotateY(${a}rad) rotateZ(${b}rad)`,
                    background: `linear-gradient(90deg, ${c1}, ${c2})`,
                    boxShadow: `0 0 8px ${c1}`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
