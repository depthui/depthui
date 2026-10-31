import { useId, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Checkbox3D — a drop-in checkbox with a raised, pressable box. The tick draws
 * itself in, and the box sinks when you press it. A real `role="checkbox"`
 * button: keyboard, screen readers and labels work. Supports the mixed
 * (indeterminate) state. Controlled or uncontrolled.
 */
export interface Checkbox3DProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new checked state whenever it changes. */
  onCheckedChange?: (checked: boolean) => void;
  /** Show the mixed state (a dash). It clears as soon as the user clicks. */
  indeterminate?: boolean;
  /** Stops the user from changing the checkbox. */
  disabled?: boolean;
  /** Visible label shown next to the checkbox. */
  label?: ReactNode;
  /** Smaller helper text shown under the label. */
  description?: ReactNode;
  /** When set, a hidden input is rendered so the value posts with a form. */
  name?: string;
  /** Value posted with the form when checked. Used with name. */
  value?: string;
  /** Required when there is no visible label. */
  "aria-label"?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Checkbox3D({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  indeterminate = false,
  disabled,
  label,
  description,
  name,
  value = "on",
  "aria-label": ariaLabel,
  className,
}: Checkbox3DProps) {
  const reduced = !!useReducedMotion();
  const id = useId();
  const [inner, setInner] = useState(defaultChecked);
  const checked = checkedProp ?? inner;
  const on = checked || indeterminate;

  function toggle() {
    const next = indeterminate ? true : !checked;
    if (checkedProp === undefined) setInner(next);
    onCheckedChange?.(next);
  }

  const t = reduced ? { duration: 0 } : { duration: 0.28, ease: "easeOut" as const };

  return (
    <div className={cn("inline-flex items-start gap-3", disabled && "cursor-not-allowed opacity-50", className)}>
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        aria-label={label ? undefined : ariaLabel}
        aria-describedby={description ? `${id}-d` : undefined}
        disabled={disabled}
        onClick={toggle}
        className="mt-px shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg"
      >
        <motion.span
          aria-hidden
          initial={false}
          whileTap={reduced || disabled ? undefined : { y: 2, scale: 0.94 }}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-lg border transition-colors duration-200",
            on
              ? "border-transparent bg-gradient-to-b from-depth-accent to-depth-accent-2 shadow-[0_3px_0_rgb(0_0_0/0.28),0_6px_10px_rgb(0_0_0/0.18),inset_0_1px_1px_rgb(255_255_255/0.55)]"
              : "border-depth-border bg-depth-surface shadow-[0_3px_0_var(--depth-border),inset_0_1px_2px_rgb(0_0_0/0.12)]",
          )}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              d={indeterminate ? "M6 12h12" : "M5 12.5l4.5 4.5L19 7.5"}
              initial={false}
              animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
              transition={t}
            />
          </svg>
        </motion.span>
      </button>
      {name && <input type="checkbox" name={name} value={value} checked={checked} disabled={disabled} readOnly hidden />}
      {(label || description) && (
        <div className="min-w-0 text-sm leading-6">
          {label && (
            <label htmlFor={id} className={cn("block select-none", !disabled && "cursor-pointer")}>
              {label}
            </label>
          )}
          {description && (
            <p id={`${id}-d`} className="-mt-0.5 text-xs leading-5 text-depth-muted">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
