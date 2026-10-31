import { useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Helix3D — a double helix turning in space, like a strand of DNA. Dots and
 * rungs are positioned with real depth, so the near side is bigger and
 * brighter than the far side. Positions are written to the DOM every frame
 * (no React renders).
 */
export interface Helix3DProps {
  /** Number of rungs. */
  pairs?: number;
  /** Total height in px. */
  height?: number;
  /** Helix radius in px. */
  radius?: number;
  /** Seconds per full turn. */
  seconds?: number;
  /** Twist: degrees between neighbouring rungs. */
  twist?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Helix3D({ pairs = 16, height = 320, radius = 52, seconds = 9, twist = 26, className }: Helix3DProps) {
  const reduced = !!useReducedMotion();
  const a = useRef<(HTMLSpanElement | null)[]>([]);
  const b = useRef<(HTMLSpanElement | null)[]>([]);
  const bar = useRef<(HTMLSpanElement | null)[]>([]);
  const gap = height / (pairs - 1);
  const dot = 14;

  const place = (t: number) => {
    for (let i = 0; i < pairs; i++) {
      const ang = ((i * twist + t * (360 / seconds)) * Math.PI) / 180;
      const x = Math.cos(ang) * radius;
      const z = Math.sin(ang) * radius;
      const shade = 0.45 + 0.55 * ((z / radius + 1) / 2);
      const dz = z / 400 + 1;
      const el = a.current[i];
      const el2 = b.current[i];
      const br = bar.current[i];
      if (el) {
        el.style.transform = `translate3d(${x}px,0,${z}px) scale(${dz})`;
        el.style.opacity = String(shade);
      }
      if (el2) {
        el2.style.transform = `translate3d(${-x}px,0,${-z}px) scale(${2 - dz})`;
        el2.style.opacity = String(1.45 - shade);
      }
      if (br) br.style.transform = `rotateY(${-(ang * 180) / Math.PI}deg)`;
    }
  };

  useAnimationFrame((t) => place(reduced ? 0 : t / 1000));

  return (
    <div
      role="img"
      aria-label="A turning double helix"
      className={cn("relative", className)}
      style={{ width: radius * 2 + 60, height: height + 30, perspective: 700 }}
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateZ(14deg) rotateX(8deg)" }}>
        {Array.from({ length: pairs }, (_, i) => (
          <div key={i} className="absolute left-1/2" style={{ top: 15 + i * gap, width: 0, height: 0, transformStyle: "preserve-3d" }}>
            <span
              ref={(n) => { bar.current[i] = n; }}
              aria-hidden
              className="absolute block h-[2px] rounded-full bg-depth-muted/50"
              style={{ width: radius * 2, left: -radius, top: -1 }}
            />
            <span
              ref={(n) => { a.current[i] = n; }}
              aria-hidden
              className="absolute block rounded-full will-change-transform"
              style={{ width: dot, height: dot, left: -dot / 2, top: -dot / 2, background: "radial-gradient(circle at 32% 28%, #fff, var(--depth-accent) 55%, var(--depth-accent-2))", boxShadow: "0 0 10px var(--depth-accent)" }}
            />
            <span
              ref={(n) => { b.current[i] = n; }}
              aria-hidden
              className="absolute block rounded-full will-change-transform"
              style={{ width: dot, height: dot, left: -dot / 2, top: -dot / 2, background: "radial-gradient(circle at 32% 28%, #fff, var(--depth-accent-3) 55%, #0ea5e9)", boxShadow: "0 0 10px var(--depth-accent-3)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
