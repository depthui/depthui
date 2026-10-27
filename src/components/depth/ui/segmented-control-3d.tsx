import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * SegmentedControl3D — a row of options with one raised thumb that slides to
 * the chosen one. The thumb moves with a transform, so it stays smooth. It is
 * a real radio group: arrow keys move the choice, and only the chosen option is
 * in the tab order. Controlled or uncontrolled.
 */
export interface SegmentedOption<T extends string = string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControl3DProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  size?: "sm" | "md" | "lg";
  /** Stretch to the full width and share it equally. */
  fullWidth?: boolean;
  /** Required: names the group for screen readers. */
  "aria-label": string;
  className?: string;
}

const SIZES = { sm: "h-8 text-xs px-3", md: "h-10 text-sm px-4", lg: "h-12 text-base px-5" } as const;

export function SegmentedControl3D<T extends string = string>({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = "md",
  fullWidth,
  "aria-label": ariaLabel,
  className,
}: SegmentedControl3DProps<T>) {
  const reduced = !!useReducedMotion();
  const id = useId();
  const [inner, setInner] = useState<T | undefined>(defaultValue ?? options.find((o) => !o.disabled)?.value);
  const value = valueProp ?? inner;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(v: T) {
    if (valueProp === undefined) setInner(v);
    onValueChange?.(v);
  }

  function onKeyDown(e: KeyboardEvent, from: number) {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    const edge = e.key === "Home" ? 0 : e.key === "End" ? options.length - 1 : -1;
    if (!dir && edge < 0) return;
    e.preventDefault();
    const n = options.length;
    let i: number;
    if (edge >= 0) {
      i = edge;
      const s = edge === 0 ? 1 : -1;
      for (let k = 0; k < n && options[i].disabled; k++) i = (i + s + n) % n;
    } else {
      i = from;
      for (let k = 0; k < n; k++) {
        i = (i + dir + n) % n;
        if (!options[i].disabled) break;
      }
    }
    if (options[i].disabled) return;
    select(options[i].value);
    refs.current[i]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "relative items-center gap-1 rounded-xl border border-depth-border bg-depth-elevated p-1 shadow-[inset_0_2px_5px_rgb(0_0_0/0.14)]",
        fullWidth ? "flex w-full" : "inline-flex",
        className,
      )}
    >
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={o.disabled}
            tabIndex={selected ? 0 : -1}
            onClick={() => select(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium outline-none transition-colors duration-200",
              "focus-visible:ring-2 focus-visible:ring-depth-accent",
              SIZES[size],
              fullWidth && "flex-1",
              selected ? "text-depth-text" : "text-depth-muted hover:text-depth-text",
              o.disabled && "cursor-not-allowed opacity-40",
            )}
          >
            {selected && (
              <motion.span
                aria-hidden
                layoutId={`${id}-thumb`}
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-lg border border-depth-border bg-depth-surface shadow-[0_3px_0_var(--depth-border),0_8px_14px_rgb(0_0_0/0.14),inset_0_1px_1px_rgb(255_255_255/0.5)]"
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
