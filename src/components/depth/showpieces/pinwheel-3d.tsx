import { useRef, useState } from "react";
import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * Pinwheel3D — a paper pinwheel on a stick. Each blade is a flat triangle with a
 * raised folded triangle in front of it, so it has real depth. It turns slowly,
 * spins up while you hover or press it, then eases back. It tilts with the pointer.
 */
export interface Pinwheel3DProps {
  /** Blade length in px. */
  size?: number;
  /** Four blade colours. */
  colors?: [string, string, string, string];
  className?: string;
}

export function Pinwheel3D({ size = 120, colors = ["#ef4444", "#facc15", "#3b82f6", "#22c55e"], className }: Pinwheel3DProps) {
  const reduced = !!useReducedMotion();
  const { ref, rotateX, rotateY, handlers } = useTilt({ max: 16 });
  const spin = useMotionValue(0);
  const speed = useMotionValue(reduced ? 0 : 70);
  const [fast, setFast] = useState(false);
  const last = useRef<ReturnType<typeof animate> | null>(null);

  useAnimationFrame((_, dt) => {
    spin.set((spin.get() + (speed.get() * Math.min(dt, 50)) / 1000) % 360);
  });
  const go = (on: boolean) => {
    setFast(on);
    last.current?.stop();
    last.current = animate(speed, reduced ? 0 : on ? 760 : 70, { type: "spring", stiffness: 25, damping: 12 });
  };

  const R = size;
  const quad = (i: number, c: string) => (
    <div key={i} className="absolute left-0 top-0" style={{ width: R, height: R, transformOrigin: "0 100%", transform: `translate(0, -${R}px) rotateZ(${i * 90}deg)`, transformStyle: "preserve-3d" }}>
      <span aria-hidden className="absolute inset-0" style={{ clipPath: "polygon(0 100%, 0 0, 100% 0)", background: `linear-gradient(135deg, ${c}, ${c}cc)` }} />
      <span aria-hidden className="absolute inset-0" style={{ transform: "translateZ(9px)", clipPath: "polygon(0 100%, 100% 100%, 100% 0)", background: `linear-gradient(315deg, #ffffffaa, ${c})`, filter: "brightness(.92)" }} />
    </div>
  );

  return (
    <div
      ref={ref}
      {...handlers}
      role="button"
      tabIndex={0}
      aria-pressed={fast}
      aria-label="Pinwheel, hover or press to spin it up"
      onPointerEnter={(e) => e.pointerType !== "touch" && go(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && go(false)}
      onFocus={() => go(true)}
      onBlur={() => go(false)}
      onClick={() => go(!fast)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(!fast); } }}
      className={cn("relative cursor-pointer select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent", className)}
      style={{ width: R * 2.4, height: R * 3.4, perspective: 900 }}
    >
      <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
        <span aria-hidden className="absolute block rounded-full" style={{ left: "50%", top: R * 1.35, width: 7, height: R * 1.9, marginLeft: -3.5, transform: "translateZ(-6px)", background: "linear-gradient(90deg,#92400e,#fbbf24 50%,#92400e)" }} />
        <div className="absolute left-1/2 h-0 w-0" style={{ top: R * 1.2, transformStyle: "preserve-3d" }}>
          <motion.div className="absolute left-0 top-0 h-0 w-0" style={{ rotateZ: spin, transformStyle: "preserve-3d" }}>
            {colors.map((c, i) => quad(i, c))}
          </motion.div>
          <span aria-hidden className="absolute block rounded-full" style={{ width: 18, height: 18, left: -9, top: -9, transform: "translateZ(16px)", background: "radial-gradient(circle at 35% 30%, #fff, #94a3b8 60%, #475569)" }} />
        </div>
      </motion.div>
    </div>
  );
}
