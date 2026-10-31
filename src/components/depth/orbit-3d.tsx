import { Fragment, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Orbit3D — items travel around tilted rings while always facing the viewer.
 * CSS only (rotate keyframes), needs depth-motion.css. Each item is
 * counter-spun and counter-tilted so the maths cancels out and it stays upright.
 */
export interface OrbitRing {
  radius: number;
  items: ReactNode[];
  /** Seconds per revolution. */
  duration?: number;
  reverse?: boolean;
}

export interface Orbit3DProps {
  /** Content shown in the middle of the orbits. */
  center?: ReactNode;
  /** Rings to draw, each with a radius in px and its own items. */
  rings: OrbitRing[];
  /** Tilt of the orbital plane in degrees. */
  tilt?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

const node = "absolute left-0 top-0 h-0 w-0 preserve-3d";

export function Orbit3D({ center, rings, tilt = 66, className }: Orbit3DProps) {
  const maxR = Math.max(...rings.map((r) => r.radius));
  const height = Math.round(2 * maxR * Math.cos((tilt * Math.PI) / 180)) + 120;
  const face: CSSProperties = {
    transform: `rotateX(${-tilt}deg) translate(-50%, -50%)`,
  };

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ height, perspective: 1100 }}
    >
      <div
        aria-hidden={center ? undefined : true}
        className="absolute left-1/2 top-1/2 h-0 w-0 preserve-3d"
        style={{ transform: `rotateX(${tilt}deg)` }}
      >
        {rings.map((ring, r) => {
          const dur = ring.duration ?? 20 + r * 8;
          return (
            <Fragment key={r}>
              <div
                aria-hidden
                className="absolute rounded-full border border-dashed border-depth-border"
                style={{
                  width: ring.radius * 2,
                  height: ring.radius * 2,
                  left: -ring.radius,
                  top: -ring.radius,
                }}
              />
              <div
                className={cn(node, ring.reverse ? "depth-spin-rev" : "depth-spin")}
                style={{ "--depth-orbit-duration": `${dur}s` } as CSSProperties}
              >
                {ring.items.map((item, i) => {
                  const a = (360 / ring.items.length) * i;
                  return (
                    <div
                      key={i}
                      className={node}
                      style={{ transform: `rotate(${a}deg) translateX(${ring.radius}px)` }}
                    >
                      <div className={node} style={{ transform: `rotate(${-a}deg)` }}>
                        <div className={cn(node, ring.reverse ? "depth-spin" : "depth-spin-rev")}>
                          <div className="absolute left-0 top-0 w-max" style={face}>
                            {item}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Fragment>
          );
        })}

        {center && (
          <div className="absolute left-0 top-0 w-max" style={face}>
            {center}
          </div>
        )}
      </div>
    </div>
  );
}
