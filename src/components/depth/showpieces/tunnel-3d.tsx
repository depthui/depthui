import { useRef, type ReactNode } from "react";
import { useAnimationFrame, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Tunnel3D — frames rushing toward you down an endless tunnel. Move the
 * pointer and the tunnel bends toward it; hover and it speeds up. Everything
 * is moved with transforms and opacity, written straight to the DOM each
 * frame, so it stays smooth.
 */
export interface Tunnel3DProps {
  /** Number of frames. */
  count?: number;
  /** Tunnel length in px (how far away the last frame is). */
  depth?: number;
  /** Base speed in px per second. */
  speed?: number;
  /** Degrees of twist per 100px of depth. */
  twist?: number;
  /** Content shown in the middle. */
  children?: ReactNode;
  className?: string;
}

export function Tunnel3D({ count = 16, depth = 1500, speed = 260, twist = 5, children, className }: Tunnel3DProps) {
  const reduced = !!useReducedMotion();
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const offset = useRef(0);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const boost = useMotionValue(1);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const sb = useSpring(boost, { stiffness: 80, damping: 18 });
  const scene = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, dt) => {
    const d = dt / 1000;
    if (!reduced) offset.current = (offset.current + speed * sb.get() * d) % depth;
    const gap = depth / count;
    for (let i = 0; i < count; i++) {
      const el = frames.current[i];
      if (!el) continue;
      const z = -((i * gap + depth - offset.current) % depth); // 0 (near) .. -depth (far)
      const k = -z / depth;
      const fadeNear = Math.min(1, -z / (gap * 0.9)); // dissolve as it reaches the camera
      const op = Math.pow(1 - k, 0.9) * fadeNear;
      el.style.transform = `translateZ(${z}px) rotateZ(${(-z / 100) * twist}deg)`;
      el.style.opacity = String(Math.max(0, op));
    }
    if (scene.current) scene.current.style.transform = `translate3d(${sx.get() * 40}px, ${sy.get() * 28}px, 0) rotateY(${sx.get() * 10}deg) rotateX(${-sy.get() * 8}deg)`;
  });

  return (
    <div
      role="img"
      aria-label="An endless tunnel of glowing frames"
      className={cn("relative overflow-hidden rounded-2xl bg-black", className)}
      style={{ perspective: 480, perspectiveOrigin: "50% 50%", minHeight: 320 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerEnter={() => boost.set(3)}
      onPointerLeave={() => { boost.set(1); px.set(0); py.set(0); }}
    >
      <div ref={scene} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
            <div
              ref={(n) => { frames.current[i] = n; }}
              aria-hidden
              className="rounded-[18%] will-change-transform"
              style={{
                height: "82%", aspectRatio: "1", maxWidth: "90%",
                border: `3px solid hsl(${(i * 360) / count + 250} 90% 62%)`,
                boxShadow: `0 0 24px hsl(${(i * 360) / count + 250} 90% 62% / .6), inset 0 0 24px hsl(${(i * 360) / count + 250} 90% 62% / .35)`,
              }}
            />
          </div>
        ))}
      </div>
      {children && <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-center text-white">{children}</div>}
    </div>
  );
}
