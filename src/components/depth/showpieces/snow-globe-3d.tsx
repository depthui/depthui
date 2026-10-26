import { useMemo, useState, type CSSProperties } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * SnowGlobe3D — a glass globe with a tiny village. Shake it (click, tap, or
 * press Enter) and the snow whirls up and settles. The globe tilts with your
 * pointer and wobbles when shaken. Flakes are CSS animations (transform and
 * opacity only). Needs depth-motion.css.
 */
export interface SnowGlobe3DProps {
  /** Globe diameter in px. */
  size?: number;
  flakes?: number;
  className?: string;
}

const hash = (n: number) => {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};

export function SnowGlobe3D({ size = 230, flakes = 46, className }: SnowGlobe3DProps) {
  const reduced = !!useReducedMotion();
  const { ref, rotateX, rotateY, handlers } = useTilt({ max: 9 });
  const [burst, setBurst] = useState(1);
  const wobble = useMotionValue(0);
  const list = useMemo(
    () => Array.from({ length: flakes }, (_, i) => ({ x: hash(i) * 100, s: 2 + hash(i + 9) * 3.5, d: 4.5 + hash(i + 3) * 5, delay: hash(i + 5) * 1.6, sway: (hash(i + 1) - 0.5) * 40 })),
    [flakes],
  );

  const shake = () => {
    setBurst((b) => b + 1);
    if (!reduced) animate(wobble, [0, -7, 6, -4, 3, -1, 0], { duration: 0.9, ease: "easeOut" });
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div ref={ref} {...handlers} style={{ width: size, height: size * 1.18, perspective: 900 }}>
        <motion.div
          role="button"
          tabIndex={0}
          aria-label="Shake the snow globe"
          onClick={shake}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); shake(); } }}
          className="relative h-full w-full cursor-pointer select-none outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg"
          style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, rotateZ: wobble, transformStyle: "preserve-3d", borderRadius: 24 }}
        >
          {/* base */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-b-3xl rounded-t-lg bg-gradient-to-b from-amber-700 to-amber-950" style={{ width: size * 0.74, height: size * 0.2, boxShadow: "0 24px 30px -12px var(--depth-shadow)" }}>
            <span className="absolute inset-x-6 top-2 h-px bg-amber-300/40" />
          </div>
          {/* glass */}
          <div className="absolute left-0 top-0 overflow-hidden rounded-full" style={{ width: size, height: size, background: "radial-gradient(circle at 50% 70%, #1e3a8a, #0f172a 85%)", boxShadow: "inset 0 0 40px rgba(255,255,255,.25), 0 0 0 2px rgba(255,255,255,.35)" }}>
            {/* village */}
            <div aria-hidden className="absolute inset-x-0 bottom-0" style={{ height: "36%", background: "linear-gradient(#f1f5f9, #cbd5e1)", clipPath: "ellipse(70% 100% at 50% 100%)" }} />
            <span aria-hidden className="absolute bg-rose-500" style={{ left: "26%", bottom: "26%", width: "20%", height: "15%", clipPath: "polygon(0 100%,0 40%,50% 0,100% 40%,100% 100%)" }} />
            <span aria-hidden className="absolute bg-emerald-600" style={{ left: "56%", bottom: "28%", width: "13%", height: "24%", clipPath: "polygon(50% 0,100% 62%,70% 62%,100% 100%,0 100%,30% 62%,0 62%)" }} />
            <span aria-hidden className="absolute bg-emerald-700" style={{ left: "70%", bottom: "27%", width: "9%", height: "16%", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
            {/* flakes */}
            {list.map((f, i) => (
              <span
                key={`${burst}-${i}`}
                aria-hidden
                className="depth-snow absolute top-0 block rounded-full bg-white"
                style={{ left: `${f.x}%`, width: f.s, height: f.s, animationDuration: `${f.d}s`, animationDelay: `${f.delay}s`, ["--sway" as string]: `${f.sway}px`, ["--fall" as string]: `${size * 0.86}px`, opacity: 0 } as CSSProperties}
              />
            ))}
            {/* glass highlight */}
            <span aria-hidden className="pointer-events-none absolute rounded-full bg-white/30 blur-[5px]" style={{ left: "16%", top: "8%", width: "26%", height: "14%", transform: "rotate(-32deg)" }} />
          </div>
        </motion.div>
      </div>
      <p className="text-xs text-depth-muted">Click the globe to shake it.</p>
    </div>
  );
}
