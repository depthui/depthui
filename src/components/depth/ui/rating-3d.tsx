import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Rating3D — star rating with glossy, raised stars. Hover previews a rating and
 * the stars pop in order when one is chosen. A real radio group (arrow keys,
 * one tab stop), or read-only with a text label for screen readers. Click the
 * chosen star again to clear it. Controlled or uncontrolled.
 */
export interface Rating3DProps {
  /** Current rating. Set it to control the component. */
  value?: number;
  /** Starting rating when uncontrolled. */
  defaultValue?: number;
  /** Called with the new rating whenever it changes. */
  onValueChange?: (value: number) => void;
  /** Number of stars. */
  max?: number;
  /** Star size in px. */
  size?: number;
  /** Show the rating without letting the user change it. */
  readOnly?: boolean;
  /** Allow clicking the chosen star to clear it. */
  allowClear?: boolean;
  /** Accessible name of the rating group. */
  "aria-label"?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

const STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5z";

export function Rating3D({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  size = 32,
  readOnly,
  allowClear = true,
  "aria-label": ariaLabel = "Rating",
  className,
}: Rating3DProps) {
  const reduced = !!useReducedMotion();
  const [inner, setInner] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const value = valueProp ?? inner;
  const shown = hover ?? value;

  function set(v: number) {
    if (valueProp === undefined) setInner(v);
    onValueChange?.(v);
  }
  function onKeyDown(e: KeyboardEvent, i: number) {
    const dir = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = Math.min(max, Math.max(1, i + 1 + dir));
    set(n);
    refs.current[n - 1]?.focus();
  }

  const star = (i: number) => {
    const filled = i < shown;
    return (
      <motion.svg
        aria-hidden
        viewBox="0 0 24 24"
        width={size}
        height={size}
        initial={false}
        variants={{ on: { scale: [1, 1.28, 1], transition: { duration: 0.35, delay: reduced ? 0 : i * 0.04 } }, off: { scale: 1 } }}
        animate={filled ? "on" : "off"}
        style={{ filter: filled ? "drop-shadow(0 3px 2px rgb(0 0 0 / .3))" : "none" }}
      >
        <defs>
          <linearGradient id="depth-star-on" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <path
          d={STAR}
          fill={filled ? "url(#depth-star-on)" : "var(--depth-border)"}
          stroke={filled ? "#b45309" : "var(--depth-muted)"}
          strokeOpacity={filled ? 0.7 : 0.35}
          strokeWidth="1"
          strokeLinejoin="round"
          style={{ transition: "fill .2s" }}
        />
      </motion.svg>
    );
  };

  if (readOnly) {
    return (
      <div role="img" aria-label={`${ariaLabel}: ${value} out of ${max}`} className={cn("inline-flex gap-1", className)}>
        {Array.from({ length: max }, (_, i) => <span key={i}>{star(i)}</span>)}
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label={ariaLabel} onPointerLeave={() => setHover(null)} className={cn("inline-flex gap-1", className)}>
      {Array.from({ length: max }, (_, i) => (
        <motion.button
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="button"
          role="radio"
          aria-checked={value === i + 1}
          aria-label={`${i + 1} star${i ? "s" : ""}`}
          tabIndex={value === i + 1 || (value === 0 && i === 0) ? 0 : -1}
          onPointerEnter={(e) => e.pointerType !== "touch" && setHover(i + 1)}
          onClick={() => set(allowClear && value === i + 1 ? 0 : i + 1)}
          onKeyDown={(e) => onKeyDown(e, i)}
          whileHover={reduced ? undefined : { y: -3, rotate: -6 }}
          whileTap={reduced ? undefined : { scale: 0.85 }}
          className="rounded-lg p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-depth-accent"
        >
          {star(i)}
        </motion.button>
      ))}
    </div>
  );
}
