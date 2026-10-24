import { useRef, type CSSProperties } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Globe3D — a wireframe globe built from CSS circles (no canvas, no WebGL).
 * Meridians are circles rotated around the Y axis, parallels are flattened
 * circles stacked on it, and markers sit on the surface and disappear when
 * they turn away (backface-visibility). Drag to spin; it drifts when idle.
 */
export interface GlobeMarker {
  lat: number;
  lon: number;
  label?: string;
}

export interface Globe3DProps {
  /** Diameter in px. */
  size?: number;
  /** Degrees per second of idle spin. 0 disables. */
  speed?: number;
  markers?: GlobeMarker[];
  /** Number of meridian lines. */
  meridians?: number;
  className?: string;
}

const PARALLELS = [-60, -30, 0, 30, 60];

export function Globe3D({
  size = 280,
  speed = 12,
  markers = [],
  meridians = 6,
  className,
}: Globe3DProps) {
  const reduced = !!useReducedMotion();
  const rotY = useMotionValue(-20);
  const dragging = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduced || dragging.current || !speed) return;
    rotY.set(rotY.get() + (speed * delta) / 1000);
  });

  const r = size / 2;
  const line = "border border-depth-accent/45";

  return (
    <div
      className={cn("relative touch-none select-none", className)}
      style={{ width: size, height: size, perspective: 1100 }}
    >
      {/* soft core glow, flat behind the wireframe */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--depth-accent) 38%, transparent), color-mix(in oklab, var(--depth-accent-2) 12%, transparent) 55%, transparent 72%)",
        }}
      />
      <motion.div
        onPanStart={() => (dragging.current = true)}
        onPan={(_, info) => rotY.set(rotY.get() + info.delta.x * 0.5)}
        onPanEnd={() => (dragging.current = false)}
        role="img"
        aria-label={`Globe${markers.length ? ` with ${markers.length} locations` : ""}`}
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          rotateX: -18,
          rotateZ: 12,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", rotateY: rotY }}
        >
          {Array.from({ length: meridians }, (_, i) => (
            <div
              key={`m${i}`}
              aria-hidden
              className={cn("absolute inset-0 rounded-full", line)}
              style={{ transform: `rotateY(${(i * 180) / meridians}deg)` }}
            />
          ))}
          {PARALLELS.map((lat) => {
            const rad = (lat * Math.PI) / 180;
            const d = size * Math.cos(rad);
            const style: CSSProperties = {
              width: d,
              height: d,
              left: (size - d) / 2,
              top: (size - d) / 2,
              transform: `translateY(${-r * Math.sin(rad)}px) rotateX(90deg)`,
            };
            return (
              <div
                key={`p${lat}`}
                aria-hidden
                className={cn("absolute rounded-full", line, lat === 0 && "border-depth-accent-2/70")}
                style={style}
              />
            );
          })}
          {markers.map((m, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-0 w-0"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${m.lon}deg) rotateX(${-m.lat}deg) translateZ(${r}px)`,
              }}
            >
              <span
                title={m.label}
                className="backface-hidden absolute -left-[5px] -top-[5px] block h-2.5 w-2.5 rounded-full bg-depth-accent-3 shadow-[0_0_14px_3px] shadow-depth-accent-3/70"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-depth-accent-3/60 motion-reduce:hidden" />
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
