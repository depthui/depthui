import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * GlassButton — frosted glass with a soft highlight that follows the
 * pointer. Glass needs something behind it to blur, so place it over an
 * image or gradient.
 */
export interface GlassButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  /** Button label or content. */
  children?: ReactNode;
}

export function GlassButton({ children, className, ...props }: GlassButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const glow = useMotionTemplate`radial-gradient(110px circle at ${x}px ${y}px, rgb(255 255 255 / 0.5), transparent 70%)`;

  return (
    <motion.button
      ref={ref}
      type="button"
      whileTap={{ scale: 0.96 }}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        rect.current = ref.current?.getBoundingClientRect() ?? null;
      }}
      onPointerMove={(e) => {
        const r = rect.current;
        if (!r || e.pointerType === "touch") return;
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        rect.current = null;
        x.set(-200);
        y.set(-200);
      }}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-white/40 bg-white/15 px-7 py-3.5 font-medium text-white outline-none backdrop-blur-md",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_12px_30px_-12px_rgb(0_0_0/0.35)]",
        "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <motion.span
        aria-hidden
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="relative drop-shadow-[0_1px_2px_rgb(0_0_0/0.3)]">{children}</span>
    </motion.button>
  );
}
