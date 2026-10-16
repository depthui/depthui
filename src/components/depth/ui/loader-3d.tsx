import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Loader3D — three CSS-only loaders: a spinning cube, gyroscope rings and
 * bouncing dots. Needs depth-motion.css. Announces itself as a status; set
 * `label` to say what is loading.
 */
export interface Loader3DProps {
  variant?: "cube" | "rings" | "dots";
  /** Overall size in px. */
  size?: number;
  /** Read out by screen readers. */
  label?: string;
  className?: string;
}

export function Loader3D({
  variant = "cube",
  size = 56,
  label = "Loading",
  className,
}: Loader3DProps) {
  return (
    <span
      role="status"
      className={cn("inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <span className="sr-only">{label}</span>
      {variant === "cube" && <Cube size={size} />}
      {variant === "rings" && <Rings size={size} />}
      {variant === "dots" && <Dots size={size} />}
    </span>
  );
}

function Cube({ size }: { size: number }) {
  const edge = size * 0.5;
  const half = edge / 2;
  const faces = [
    `translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];
  return (
    <span aria-hidden style={{ perspective: size * 4 }}>
      <span
        className="depth-loader-cube relative block preserve-3d"
        style={{ width: edge, height: edge }}
      >
        {faces.map((t, i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-md border border-depth-accent/70 bg-depth-accent/15"
            style={{ transform: t }}
          />
        ))}
      </span>
    </span>
  );
}

function Rings({ size }: { size: number }) {
  const ring = (cls: string, inset: number, color: string): { cls: string; style: CSSProperties } => ({
    cls,
    style: { inset, borderColor: color },
  });
  const rings = [
    ring("depth-rot-x", 0, "var(--depth-accent)"),
    ring("depth-rot-y", size * 0.1, "var(--depth-accent-2)"),
    ring("depth-rot-z", size * 0.2, "var(--depth-accent-3)"),
  ];
  return (
    <span aria-hidden className="relative block h-full w-full preserve-3d" style={{ perspective: size * 5 }}>
      {rings.map((r, i) => (
        <span
          key={i}
          className={cn("absolute rounded-full border-2 border-solid", r.cls)}
          style={r.style}
        />
      ))}
    </span>
  );
}

function Dots({ size }: { size: number }) {
  const d = size * 0.2;
  return (
    <span aria-hidden className="flex items-end gap-1.5" style={{ height: d * 2.2 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="depth-dot-bounce block rounded-full bg-depth-accent"
          style={{ width: d, height: d, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
