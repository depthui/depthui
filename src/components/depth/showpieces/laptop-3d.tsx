import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

/**
 * Laptop3D — a laptop whose lid opens as you scroll it into view, revealing
 * your screen content. Pass `open` to control it yourself (true/false)
 * instead. The lid and base are plain divs in 3D, nothing is an image.
 */
export interface Laptop3DProps {
  /** What the screen shows. */
  children: ReactNode;
  /** Width of the laptop in px. */
  width?: number;
  /** Force it open or closed. Leave undefined to open with scroll. */
  open?: boolean;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Laptop3D({ children, width = 560, open, className }: Laptop3DProps) {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const scroll = useScrollProgress(ref, ["top", 1], ["top", 0.35]);
  const forced = useSpring(open ? 1 : 0, { stiffness: 70, damping: 16 });
  useEffect(() => {
    if (open !== undefined) forced.set(open ? 1 : 0);
  }, [open, forced]);
  const p = open !== undefined ? forced : scroll;

  const lidH = width * 0.62;
  const baseD = width * 0.42;
  const lid = useTransform(p, [0, 1], [reduced ? 8 : -92, 8]);
  const tilt = useTransform(p, [0, 1], [reduced ? -18 : -30, -18]);

  const metal = "bg-gradient-to-b from-depth-elevated to-depth-border";

  return (
    <div
      ref={ref}
      className={cn("mx-auto max-w-full", className)}
      style={{ width, height: lidH + baseD * 0.6, perspective: 1800 }}
    >
      <motion.div
        className="relative"
        style={{ width, height: lidH, transformStyle: "preserve-3d", rotateX: tilt, y: lidH * 0.08 }}
      >
        {/* base, hinged at the lid's bottom edge and lying flat toward the viewer */}
        <div
          className={cn("absolute left-0 rounded-b-2xl rounded-t-sm border border-depth-border", metal)}
          style={{
            top: lidH,
            width,
            height: baseD,
            transformOrigin: "top",
            transform: "rotateX(90deg)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-x-[7%] top-[10%] h-[48%] rounded-md opacity-70"
            style={{
              background:
                "repeating-linear-gradient(90deg, var(--depth-bg) 0 18px, transparent 18px 22px), repeating-linear-gradient(0deg, transparent 0 14px, var(--depth-border) 14px 17px)",
              backgroundBlendMode: "multiply",
            }}
          />
          <div aria-hidden className="absolute inset-x-[34%] bottom-[8%] h-[18%] rounded-md border border-depth-border bg-depth-bg/50" />
        </div>

        {/* lid */}
        <motion.div
          className="absolute left-0 top-0"
          style={{
            width,
            height: lidH,
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
            rotateX: lid,
          }}
        >
          <div className="backface-hidden absolute inset-0 overflow-hidden rounded-t-2xl border-[10px] border-b-[14px] border-depth-text/90 bg-depth-bg">
            <div className="absolute left-1/2 top-1 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-depth-muted/60" />
            <div className="h-full w-full overflow-hidden">{children}</div>
          </div>
          <div
            aria-hidden
            className={cn("backface-hidden absolute inset-0 rounded-t-2xl border border-depth-border", metal)}
            style={{ transform: "rotateY(180deg)" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
