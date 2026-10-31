import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * RippleButton — a ripple expands from the exact point you click or tap.
 * Keyboard activation ripples from the centre.
 */
export interface RippleButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  /** Content shown inside the button. */
  children?: ReactNode;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function RippleButton({
  children,
  className,
  onClick,
  ...props
}: RippleButtonProps) {
  const reduced = !!useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const next = useRef(0);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (!reduced) {
      const r = e.currentTarget.getBoundingClientRect();
      const fromKeyboard = e.detail === 0;
      const x = fromKeyboard ? r.width / 2 : e.clientX - r.left;
      const y = fromKeyboard ? r.height / 2 : e.clientY - r.top;
      const size = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2;
      setRipples((rs) => [...rs, { id: next.current++, x, y, size }]);
    }
    onClick?.(e);
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-depth-accent px-7 py-3.5 font-medium text-white outline-none",
        "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          onAnimationComplete={() => setRipples((rs) => rs.filter((x) => x.id !== r.id))}
          className="pointer-events-none absolute rounded-full bg-white"
          style={{ left: r.x - r.size / 2, top: r.y - r.size / 2, width: r.size, height: r.size }}
        />
      ))}
    </motion.button>
  );
}
