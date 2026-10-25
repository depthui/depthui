import { useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Badge3D — an ID badge hanging from a lanyard. Grab it and swing it; let go
 * and it settles back with an under-damped spring, turning a little as it
 * swings so it reads as a 3D object. Keys: arrow keys nudge it.
 */
export interface Badge3DProps {
  children?: ReactNode;
  width?: number;
  height?: number;
  /** Lanyard length in px. */
  strap?: number;
  className?: string;
}

export function Badge3D({ children, width = 190, height = 270, strap = 150, className }: Badge3DProps) {
  const reduced = !!useReducedMotion();
  const angle = useMotionValue(reduced ? 0 : 16);
  const turn = useTransform(angle, (a) => a * 1.6);
  const dragging = useRef(false);

  const settle = () =>
    animate(angle, 0, reduced ? { duration: 0 } : { type: "spring", stiffness: 26, damping: 2.4, mass: 1 });

  useEffect(() => {
    const c = settle();
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pivotRef = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (!dragging.current || !pivotRef.current) return;
    const r = pivotRef.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = Math.max(40, e.clientY - r.top);
    angle.set(Math.max(-70, Math.min(70, (Math.atan2(dx, dy) * 180) / Math.PI)));
  };

  return (
    <div
      className={cn("relative mx-auto touch-none select-none", className)}
      style={{ width: width + 80, height: strap + height + 40, perspective: 1000 }}
    >
      <div ref={pivotRef} className="absolute left-1/2 top-0 h-0 w-0">
        <span aria-hidden className="absolute -left-4 -top-2 h-3 w-8 rounded-b-lg bg-depth-muted" />
        <motion.div
          className="absolute left-0 top-0 will-change-transform"
          style={{ rotate: angle, transformOrigin: "0 0", transformStyle: "preserve-3d" }}
        >
          {/* lanyard */}
          <span aria-hidden className="absolute -left-3 top-0 w-6 bg-gradient-to-r from-depth-accent to-depth-accent-2" style={{ height: strap }} />
          <span aria-hidden className="absolute -left-3 top-0 w-6 opacity-30" style={{ height: strap, background: "repeating-linear-gradient(0deg,transparent 0 6px,#fff 6px 8px)" }} />
          {/* clip */}
          <span aria-hidden className="absolute -left-2.5 rounded-sm bg-gradient-to-b from-neutral-300 to-neutral-500" style={{ top: strap - 4, width: 20, height: 16 }} />
          {/* badge */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label="Hanging badge. Drag to swing it, or use the arrow keys."
            className="absolute cursor-grab overflow-hidden rounded-2xl border border-depth-border bg-depth-surface shadow-[0_26px_40px_-22px_var(--depth-shadow)] outline-none focus-visible:ring-2 focus-visible:ring-depth-accent active:cursor-grabbing"
            style={{ left: -width / 2, top: strap + 8, width, height, rotateY: turn, transformOrigin: "50% 0" }}
            onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); animate(angle, angle.get(), { duration: 0 }); }}
            onPointerMove={move}
            onPointerUp={() => { dragging.current = false; settle(); }}
            onPointerCancel={() => { dragging.current = false; settle(); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") { angle.set(-30); settle(); }
              if (e.key === "ArrowRight") { angle.set(30); settle(); }
            }}
          >
            <span aria-hidden className="absolute left-1/2 top-3 h-2 w-12 -translate-x-1/2 rounded-full bg-depth-border" />
            <div className="h-full w-full pt-8">{children}</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
