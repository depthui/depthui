import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * GalleryWall3D — a grid laid back on a tilted plane, like a wall of photos
 * seen from above. The wall drifts with the pointer and the tile under it
 * lifts toward you. Touch devices get the static, tilted wall.
 */
export interface GalleryWall3DProps {
  /** Items placed in the wall, laid out in columns. */
  items: ReactNode[];
  /** Number of columns in the wall. */
  columns?: number;
  /** Height of the viewing window in px. */
  height?: number;
  /** Extra classes added to the outer element. */
  className?: string;
  /** Extra classes added to each item. */
  itemClassName?: string;
}

export function GalleryWall3D({
  items,
  columns = 4,
  height = 440,
  className,
  itemClassName,
}: GalleryWall3DProps) {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 90, damping: 20 });
  const sy = useSpring(py, { stiffness: 90, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [58, 46]);
  const rotateZ = useTransform(sx, [0, 1], [-40, -28]);
  const x = useTransform(sx, [0, 1], [40, -40]);

  return (
    <div
      ref={ref}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        rect.current = ref.current?.getBoundingClientRect() ?? null;
      }}
      onPointerMove={(e) => {
        const r = rect.current;
        if (!r || e.pointerType === "touch") return;
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        rect.current = null;
        px.set(0.5);
        py.set(0.5);
      }}
      className={cn("relative w-full overflow-hidden rounded-2xl", className)}
      style={{
        height,
        perspective: 1200,
        maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
      }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 grid w-[130%] -translate-x-1/2 -translate-y-1/2 gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          transformStyle: "preserve-3d",
          rotateX: reduced ? 52 : rotateX,
          rotateZ: reduced ? -34 : rotateZ,
          x: reduced ? 0 : x,
        }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            whileHover={reduced ? undefined : { z: 70, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={cn(
              "aspect-[4/3] overflow-hidden rounded-xl border border-depth-border bg-depth-surface shadow-[0_24px_40px_-24px_var(--depth-shadow)]",
              itemClassName,
            )}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
