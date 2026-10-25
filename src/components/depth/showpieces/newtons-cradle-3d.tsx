import { useRef, useState } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * NewtonsCradle3D — the desk toy. Click it to set it swinging; the swing fades
 * out on its own. Each ball hangs from two strings so it reads as 3D.
 * Rotations are written straight to the DOM each frame (no React renders).
 */
export interface NewtonsCradle3DProps {
  balls?: number;
  /** Ball diameter in px. */
  ball?: number;
  /** String length in px. */
  length?: number;
  /** Peak swing angle in degrees. */
  amplitude?: number;
  className?: string;
}

export function NewtonsCradle3D({
  balls = 5,
  ball = 46,
  length = 150,
  amplitude = 38,
  className,
}: NewtonsCradle3DProps) {
  const reduced = !!useReducedMotion();
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const start = useRef<number | null>(null);
  const [swinging, setSwinging] = useState(true);

  useAnimationFrame((t) => {
    if (start.current === null) start.current = t;
    const el = refs.current;
    if (reduced || start.current === -1) {
      el.forEach((n) => n && (n.style.transform = "rotate(0deg)"));
      return;
    }
    const s = (t - start.current) / 1000;
    const amp = amplitude * Math.exp(-s / 9);
    const c = Math.cos(s * 4.2);
    const left = c > 0 ? -amp * c : 0;
    const right = c < 0 ? amp * -c : 0;
    el[0] && (el[0].style.transform = `rotate(${left}deg)`);
    el[balls - 1] && (el[balls - 1]!.style.transform = `rotate(${right}deg)`);
  });

  const kick = () => {
    start.current = null;
    setSwinging(true);
  };

  const total = balls * ball;
  return (
    <button
      type="button"
      onClick={kick}
      aria-label="Set the cradle swinging"
      aria-pressed={swinging}
      className={cn("relative block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg", className)}
      style={{ width: total + 70, height: length + ball + 60, perspective: 900 }}
    >
      <div
        className="absolute left-1/2 top-4"
        style={{ width: total + 40, height: length + ball + 20, marginLeft: -(total + 40) / 2, transformStyle: "preserve-3d", transform: "rotateX(-10deg) rotateY(-30deg)" }}
      >
        {/* frame */}
        <div aria-hidden className="absolute -top-2 left-0 h-2.5 w-full rounded-full bg-gradient-to-b from-depth-text/80 to-depth-text/50" style={{ transform: "translateZ(-14px)" }} />
        <div aria-hidden className="absolute -top-2 left-0 h-2.5 w-full rounded-full bg-gradient-to-b from-depth-text/80 to-depth-text/50" style={{ transform: "translateZ(14px)" }} />
        <div aria-hidden className="absolute left-0 top-[-8px] h-[calc(100%+8px)] w-2.5 rounded-full bg-depth-text/60" style={{ transform: "translateZ(-14px)" }} />
        <div aria-hidden className="absolute right-0 top-[-8px] h-[calc(100%+8px)] w-2.5 rounded-full bg-depth-text/60" style={{ transform: "translateZ(-14px)" }} />
        <div aria-hidden className="absolute left-0 top-[-8px] h-[calc(100%+8px)] w-2.5 rounded-full bg-depth-text/60" style={{ transform: "translateZ(14px)" }} />
        <div aria-hidden className="absolute right-0 top-[-8px] h-[calc(100%+8px)] w-2.5 rounded-full bg-depth-text/60" style={{ transform: "translateZ(14px)" }} />
        {Array.from({ length: balls }, (_, i) => (
          <div
            key={i}
            ref={(n) => { refs.current[i] = n; }}
            aria-hidden
            className="absolute top-0 will-change-transform"
            style={{ left: 20 + i * ball, width: ball, height: length + ball, transformOrigin: "50% 0", transformStyle: "preserve-3d" }}
          >
            <span className="absolute left-1/2 top-0 w-px bg-depth-muted" style={{ height: length, transform: "translateZ(-14px)" }} />
            <span className="absolute left-1/2 top-0 w-px bg-depth-muted" style={{ height: length, transform: "translateZ(14px)" }} />
            <span
              className="absolute left-0 rounded-full"
              style={{
                top: length,
                width: ball,
                height: ball,
                background: "radial-gradient(circle at 32% 28%, #fff, #c9c8d8 28%, #6d6b86 70%, #3b3a52)",
                boxShadow: "0 14px 16px -8px rgba(0,0,0,.35)",
              }}
            />
          </div>
        ))}
      </div>
      <span className="absolute inset-x-0 bottom-0 text-center text-xs text-depth-muted">Click to swing</span>
    </button>
  );
}
