import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Gyroscope3D — three nested rings turning on different axes around a glowing
 * core. Pure CSS (needs depth-motion.css), so it costs no JavaScript per frame
 * and stops for people who prefer reduced motion.
 */
export interface Gyroscope3DProps {
  /** Outer ring diameter in px. */
  size?: number;
  /** Seconds per turn of the outer ring. Inner rings run faster. */
  seconds?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Gyroscope3D({ size = 220, seconds = 9, className }: Gyroscope3DProps) {
  const ring = (d: number, cls: string, dur: number, color: string, child: React.ReactNode) => (
    <div
      aria-hidden
      className={cn("absolute rounded-full", cls)}
      style={{
        width: d, height: d, left: "50%", top: "50%", marginLeft: -d / 2, marginTop: -d / 2,
        border: `${Math.max(3, size / 40)}px solid ${color}`,
        boxShadow: `0 0 18px -4px ${color}, inset 0 0 12px -6px ${color}`,
        animationDuration: `${dur}s`,
        transformStyle: "preserve-3d",
      } as CSSProperties}
    >
      {child}
    </div>
  );
  return (
    <div role="img" aria-label="A spinning gyroscope" className={cn("relative", className)} style={{ width: size, height: size, perspective: 800 }}>
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateX(-18deg) rotateY(18deg)" }}>
        {ring(size, "depth-rot-y", seconds, "var(--depth-accent)",
          ring(size * 0.76, "depth-rot-x", seconds * 0.7, "var(--depth-accent-2)",
            ring(size * 0.52, "depth-rot-z", seconds * 0.5, "var(--depth-accent-3)",
              <span className="absolute left-1/2 top-1/2 rounded-full" style={{ width: size * 0.2, height: size * 0.2, marginLeft: -size * 0.1, marginTop: -size * 0.1, background: "radial-gradient(circle at 32% 28%, #fff, var(--depth-accent) 55%, var(--depth-accent-2))", boxShadow: "0 0 30px var(--depth-accent)" }} />
            )
          )
        )}
      </div>
    </div>
  );
}
