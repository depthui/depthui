import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Switch3D — a toggle with a raised, glossy knob that squashes when pressed
 * and springs across the track. A real `role="switch"` button, so it works
 * with the keyboard and screen readers. Controlled or uncontrolled.
 */
export interface Switch3DProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Visible label. Clicking it toggles the switch. */
  label?: ReactNode;
  /** Required when there is no visible label. */
  "aria-label"?: string;
  className?: string;
}

export function Switch3D({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  label,
  "aria-label": ariaLabel,
  className,
}: Switch3DProps) {
  const reduced = !!useReducedMotion();
  const [inner, setInner] = useState(defaultChecked);
  const checked = checkedProp ?? inner;

  function toggle() {
    const next = !checked;
    if (checkedProp === undefined) setInner(next);
    onCheckedChange?.(next);
  }

  return (
    <label
      className={cn(
        "inline-flex items-center gap-3",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label ? undefined : ariaLabel}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative h-8 w-14 shrink-0 rounded-full p-1 outline-none transition-colors duration-300",
          "shadow-[inset_0_2px_5px_rgb(0_0_0/0.3)] focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg",
          checked ? "bg-depth-accent" : "bg-depth-border",
        )}
      >
        <motion.span
          aria-hidden
          initial={false}
          animate={{ x: checked ? 24 : 0 }}
          whileTap={reduced || disabled ? undefined : { scaleX: 1.25 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }}
          className="block h-6 w-6 rounded-full bg-gradient-to-b from-white to-slate-200 shadow-[0_4px_8px_rgb(0_0_0/0.35),inset_0_-2px_3px_rgb(0_0_0/0.12),inset_0_2px_2px_rgb(255_255_255/0.95)]"
          style={{ transformOrigin: checked ? "100% 50%" : "0% 50%" }}
        />
      </button>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
