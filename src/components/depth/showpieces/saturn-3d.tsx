import { motion, useReducedMotion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * Saturn3D — a banded planet with a tilted ring. The ring is split in two
 * halves: the far half sits behind the planet and the near half in front of it,
 * so the planet really sits inside its ring. The cloud bands drift, and the
 * layers shift apart as you move your pointer over it.
 */
export interface Saturn3DProps {
  /** Overall width in px. */
  size?: number;
  /** Planet hue, 0 to 360. */
  hue?: number;
  className?: string;
}

export function Saturn3D({ size = 300, hue = 36, className }: Saturn3DProps) {
  const reduced = !!useReducedMotion();
  const { ref, rotateX, rotateY, handlers } = useTilt({ max: 14 });
  const d = size * 0.5;
  const rx = size * 0.48;
  const ry = rx * 0.27;
  const band = `linear-gradient(180deg, hsl(${hue} 55% 38%) 0%, hsl(${hue} 70% 62%) 12%, hsl(${hue} 60% 48%) 22%, hsl(${hue} 75% 72%) 34%, hsl(${hue} 55% 52%) 46%, hsl(${hue} 70% 66%) 58%, hsl(${hue} 60% 44%) 70%, hsl(${hue} 70% 62%) 82%, hsl(${hue} 55% 36%) 100%)`;
  const ringBg = `radial-gradient(closest-side, transparent 55%, hsl(${hue} 45% 55% / .55) 55% 64%, transparent 64% 67%, hsl(${hue} 60% 78% / .9) 67% 82%, hsl(${hue} 40% 60% / .6) 82% 90%, transparent 90%)`;

  const ring = (z: number, clip: string) => (
    <div
      aria-hidden
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        width: rx * 2,
        height: ry * 2,
        marginLeft: -rx,
        marginTop: -ry,
        transform: `translateZ(${z}px) rotateZ(-16deg)`,
        clipPath: clip,
        background: ringBg,
      }}
    />
  );

  const half = (key: string) => (
    <div key={key} className="relative h-full shrink-0" style={{ width: d }}>
      <div className="absolute inset-0" style={{ background: band }} />
      <span className="absolute rounded-full" style={{ left: "18%", top: "32%", width: "26%", height: "10%", background: `hsl(${hue} 80% 80% / .55)`, filter: "blur(2px)" }} />
      <span className="absolute rounded-full" style={{ left: "62%", top: "58%", width: "22%", height: "8%", background: `hsl(${hue} 40% 30% / .45)`, filter: "blur(2px)" }} />
    </div>
  );

  return (
    <div
      ref={ref}
      {...handlers}
      role="img"
      aria-label="Saturn, a banded planet with a ring"
      className={cn("relative", className)}
      style={{ width: size, height: size * 0.72, perspective: 900 }}
    >
      <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
        {[[8, 12], [86, 20], [20, 82], [92, 76], [50, 6], [70, 90]].map(([x, y], i) => (
          <span key={i} aria-hidden className="depth-sparkle absolute block rounded-full bg-white" style={{ left: `${x}%`, top: `${y}%`, width: 2 + (i % 3), height: 2 + (i % 3), transform: "translateZ(-90px)", animationDelay: `${i * 0.5}s` }} />
        ))}
        {ring(-28, "inset(0 0 50% 0)")}
        <div className="absolute overflow-hidden rounded-full" style={{ left: "50%", top: "50%", width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2, boxShadow: `0 0 ${d * 0.3}px hsl(${hue} 80% 60% / .35)` }}>
          <motion.div
            className="absolute left-0 top-0 flex h-full"
            style={{ width: d * 2 }}
            animate={reduced ? undefined : { x: [0, -d] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {half("a")}
            {half("b")}
          </motion.div>
          <span aria-hidden className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,.4), rgba(255,255,255,0) 38%, rgba(0,0,0,.25) 70%, rgba(0,0,0,.7) 100%)" }} />
        </div>
        {ring(28, "inset(50% 0 0 0)")}
      </motion.div>
    </div>
  );
}
