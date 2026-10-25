import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Hourglass3D — sand runs from the top bulb to the bottom one. Click to flip
 * it, even halfway through: it carries on from where the sand is. The whole
 * rig turns on a spring when flipped.
 */
export interface Hourglass3DProps {
  /** Seconds for a full bulb to run through. */
  seconds?: number;
  /** Glass width in px. */
  width?: number;
  onFinish?: () => void;
  className?: string;
}

const BODY = "polygon(10% 0,90% 0,90% 12%,56% 50%,90% 88%,90% 100%,10% 100%,10% 88%,44% 50%,10% 12%)";

export function Hourglass3D({ seconds = 20, width = 120, onFinish, className }: Hourglass3DProps) {
  const reduced = !!useReducedMotion();
  const height = width * 1.7;
  const a = useMotionValue(1); // sand in the group's top bulb, 0 to 1
  const topScale = a;
  const botScale = useTransform(a, (v) => 1 - v);
  const stream = useTransform(a, (v) => (v > 0.002 && v < 0.998 ? 1 : 0));
  const rot = useMotionValue(0);
  const flips = useRef(0);
  const ctl = useRef<ReturnType<typeof animate> | null>(null);

  const drain = () => {
    ctl.current?.stop();
    const upperIsTop = flips.current % 2 === 0;
    const from = a.get();
    const left = upperIsTop ? from : 1 - from;
    if (left <= 0.001) return;
    ctl.current = animate(a, upperIsTop ? 0 : 1, {
      duration: reduced ? 0 : seconds * left,
      ease: "linear",
      onComplete: () => onFinish?.(),
    });
  };

  useEffect(() => {
    drain();
    return () => ctl.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flip = () => {
    flips.current += 1;
    ctl.current?.stop();
    animate(rot, flips.current * 180, reduced ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 11 });
    window.setTimeout(drain, reduced ? 0 : 450);
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label="Flip the hourglass"
      className={cn("block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg", className)}
      style={{ width: width + 60, height: height + 60, perspective: 1000 }}
    >
      <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(10deg) rotateY(-26deg)" }}>
        <motion.div className="absolute left-1/2 top-1/2 will-change-transform" style={{ width, height, marginLeft: -width / 2, marginTop: -height / 2, transformStyle: "preserve-3d", rotate: rot }}>
          {/* posts */}
          {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
            <span key={`${sx}${sz}`} aria-hidden className="absolute rounded-full bg-gradient-to-r from-depth-border to-depth-muted" style={{ width: 5, height: height + 16, left: width / 2 + sx * (width / 2 + 6) - 2.5, top: -8, transform: `translateZ(${sz * 26}px)` }} />
          )))}
          {/* caps */}
          {[-8, height - 8].map((y, i) => (
            <span key={i} aria-hidden className="absolute rounded-full border border-depth-border bg-gradient-to-b from-depth-elevated to-depth-border" style={{ width: width + 44, height: width + 44, left: -22, top: y - (width + 44) / 2 + 8, transform: "rotateX(90deg)" }} />
          ))}
          {/* glass */}
          <div className="absolute inset-0" style={{ clipPath: BODY, background: "var(--depth-border)" }} />
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: BODY, transform: "scale(.94)", background: "color-mix(in srgb, var(--depth-bg) 80%, transparent)" }}>
            <motion.div className="absolute inset-x-0 top-0 h-1/2 origin-bottom bg-gradient-to-b from-amber-300 to-amber-500" style={{ scaleY: topScale }} />
            <motion.div className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom bg-gradient-to-b from-amber-300 to-amber-500" style={{ scaleY: botScale }} />
            <motion.span className="absolute left-1/2 top-1/2 h-1/2 w-[2px] -translate-x-1/2 bg-amber-400" style={{ opacity: stream }} />
            <span className="absolute inset-y-0 left-[18%] w-[8%] bg-white/20" />
          </div>
        </motion.div>
      </div>
    </button>
  );
}
