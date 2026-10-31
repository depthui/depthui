import { createContext, useContext, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * TiltCard — pointer-reactive 3D card with a moving glare.
 * Put <TiltLayer z={n}> inside to float content above the card surface.
 */

type TiltCtx = { depthScale: number };
const Ctx = createContext<TiltCtx>({ depthScale: 1 });

export interface TiltCardProps
  extends Omit<HTMLMotionProps<"div">, "ref" | "children"> {
  /** Content shown on the card. */
  children?: ReactNode;
  /** Max tilt in degrees. */
  max?: number;
  /** Perspective distance in px. Lower = more dramatic. */
  perspective?: number;
  /** Show the specular glare that follows the pointer. */
  glare?: boolean;
  /** Scale multiplier applied to all TiltLayer z offsets. */
  depthScale?: number;
  /** Extra classes added to the outer perspective wrapper. className styles the card itself. */
  containerClassName?: string;
}

export function TiltCard({
  max = 12,
  perspective = 900,
  glare = true,
  depthScale = 1,
  className,
  containerClassName,
  children,
  style,
  ...props
}: TiltCardProps) {
  const { ref, x, y, rotateX, rotateY, handlers, reduced } = useTilt({ max });

  const gx = useTransform(x, [0, 1], [0, 100]);
  const gy = useTransform(y, [0, 1], [0, 100]);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, var(--depth-glare), transparent 60%)`;

  return (
    <div
      className={cn("inline-block", containerClassName)}
      style={{ perspective }}
    >
      <motion.div
        ref={ref}
        {...handlers}
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformStyle: "preserve-3d",
          ...style,
        }}
        className={cn(
          "group relative overflow-visible rounded-2xl border border-depth-border bg-depth-surface p-6 will-change-transform",
          "shadow-[0_30px_60px_-30px_var(--depth-shadow)]",
          className,
        )}
        {...props}
      >
        <Ctx.Provider value={{ depthScale }}>{children}</Ctx.Provider>
        {glare && !reduced && (
          <motion.div
            aria-hidden
            style={{ background: glareBg }}
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
      </motion.div>
    </div>
  );
}

export interface TiltLayerProps extends HTMLMotionProps<"div"> {
  /** translateZ in px (scaled by the card's depthScale). */
  z?: number;
}

export function TiltLayer({ z = 40, style, className, ...props }: TiltLayerProps) {
  const { depthScale } = useContext(Ctx);
  return (
    <motion.div
      className={cn("relative", className)}
      style={{ transform: `translateZ(${z * depthScale}px)`, ...style }}
      {...props}
    />
  );
}
