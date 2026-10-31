import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * MagneticButton — the button is pulled toward your pointer when you get
 * close, and the label drifts a little further than the button itself.
 * The invisible hit area around it is what makes the pull start early.
 */
export interface MagneticButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  /** Button label or content. */
  children?: ReactNode;
  /** How far the button follows the pointer (0 to 1). */
  strength?: number;
  /** Extra hit area around the button, in px. */
  reach?: number;
}

export function MagneticButton({
  children,
  strength = 0.4,
  reach = 28,
  className,
  ...props
}: MagneticButtonProps) {
  const reduced = !!useReducedMotion();
  const area = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });
  const lx = useTransform(x, (v) => v * 0.55);
  const ly = useTransform(y, (v) => v * 0.55);

  return (
    <div
      ref={area}
      className="inline-flex"
      style={{ padding: reach, margin: -reach }}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        rect.current = area.current?.getBoundingClientRect() ?? null;
      }}
      onPointerMove={(e) => {
        const r = rect.current;
        if (reduced || !r || e.pointerType === "touch") return;
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        rect.current = null;
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.button
        type="button"
        style={{ x, y }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-depth-accent px-7 py-3.5 font-medium text-white shadow-[0_14px_30px_-14px_var(--depth-shadow)] outline-none will-change-transform",
          "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <motion.span style={{ x: lx, y: ly }} className="block">
          {children}
        </motion.span>
      </motion.button>
    </div>
  );
}
