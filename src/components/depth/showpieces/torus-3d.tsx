import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Torus3D — a ring-shaped doughnut drawn as a hoop of circles, each one
 * standing on edge around the centre, tinted round the colour wheel. It
 * tumbles on its own and pauses on hover or focus. Pure CSS animation
 * (transform only). Needs depth-motion.css.
 */
export interface Torus3DProps {
  /** Outer diameter in px. */
  size?: number;
  /** How many circles make up the ring. */
  rings?: number;
  /** Tube thickness as a fraction of the outer size. */
  tube?: number;
  /** Seconds per tumble. */
  seconds?: number;
  className?: string;
}

export function Torus3D({ size = 260, rings = 36, tube = 0.26, seconds = 14, className }: Torus3DProps) {
  const [paused, setPaused] = useState(false);
  const d = size * tube; // tube diameter
  const R = size / 2 - d / 2; // distance from centre to tube centre
  const play = paused ? "paused" : "running";
  const list = useMemo(() => Array.from({ length: rings }, (_, i) => ({ i, hue: (i / rings) * 300 + 240 })), [rings]);

  return (
    <div
      role="img"
      aria-label="A tumbling torus"
      tabIndex={0}
      onPointerEnter={(e) => e.pointerType !== "touch" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn("relative rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg", className)}
      style={{ width: size * 1.1, height: size * 1.1, perspective: 1000 }}
    >
      <div className="absolute left-1/2 top-1/2" style={{ width: 2, height: 2, transformStyle: "preserve-3d", transform: "rotateX(62deg) rotateZ(18deg)" }}>
        <div className="depth-rot-y" style={{ position: "absolute", width: 2, height: 2, transformStyle: "preserve-3d", animationDuration: `${seconds * 0.6}s`, animationPlayState: play }}>
          <div className="depth-rot-x" style={{ position: "absolute", width: 2, height: 2, transformStyle: "preserve-3d", animationDuration: `${seconds}s`, animationPlayState: play }}>
            {list.map(({ i, hue }) => (
              <span
                key={i}
                aria-hidden
                className="absolute block rounded-full"
                style={{
                  width: d,
                  height: d,
                  left: -d / 2,
                  top: -d / 2,
                  transform: `rotateY(${(i * 360) / rings}deg) translateX(${R}px)`,
                  border: `2px solid hsl(${hue} 85% 62% / .9)`,
                  background: `radial-gradient(circle, hsl(${hue} 85% 62% / .16), transparent 70%)`,
                  boxShadow: `0 0 10px hsl(${hue} 90% 60% / .55)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
