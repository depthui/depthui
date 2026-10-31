import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * OtpInput3D — a one-time-code field made of raised boxes. The focused box
 * lifts and glows. Typing moves on to the next box, Backspace moves back,
 * arrow keys move around, and pasting a whole code fills every box. The first
 * box carries `autocomplete="one-time-code"` so phones can offer the SMS code.
 * Controlled or uncontrolled; the value is a plain string with no gaps.
 */
export interface OtpInput3DProps {
  /** Number of boxes. */
  length?: number;
  /** Controlled value. Pair it with onValueChange. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the current code whenever it changes. */
  onValueChange?: (value: string) => void;
  /** Called once when every box is filled. */
  onComplete?: (value: string) => void;
  /** Digits only (default), or any letters and numbers. */
  numeric?: boolean;
  /** Hide the characters, like a password. */
  mask?: boolean;
  /** Show the error style. */
  invalid?: boolean;
  /** Disable all boxes. */
  disabled?: boolean;
  /** Focus the first box on mount. */
  autoFocus?: boolean;
  /** Accessible label for the input group. */
  "aria-label"?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function OtpInput3D({
  length = 6,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onComplete,
  numeric = true,
  mask,
  invalid,
  disabled,
  autoFocus,
  "aria-label": ariaLabel = "One-time code",
  className,
}: OtpInput3DProps) {
  const [inner, setInner] = useState(defaultValue.slice(0, length));
  const value = (valueProp ?? inner).slice(0, length);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  // Latest value, so fast typing (focus moves before React re-renders) never reads a stale one.
  const latest = useRef(value);
  latest.current = value;
  const allowed = numeric ? /[0-9]/ : /[A-Za-z0-9]/;

  const focusAt = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  function commit(next: string) {
    latest.current = next;
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
    if (next.length === length) onComplete?.(next);
  }
  function onChange(i: number, raw: string) {
    const c = [...raw].reverse().find((ch) => allowed.test(ch));
    if (!c) return;
    commit(latest.current.slice(0, i) + c + latest.current.slice(i + 1));
    focusAt(i + 1);
  }
  function onKeyDown(e: KeyboardEvent, i: number) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (latest.current[i]) commit(latest.current.slice(0, i) + latest.current.slice(i + 1));
      else if (i > 0) { commit(latest.current.slice(0, i - 1) + latest.current.slice(i)); focusAt(i - 1); }
    } else if (e.key === "Delete") {
      e.preventDefault();
      commit(latest.current.slice(0, i) + latest.current.slice(i + 1));
    } else if (e.key === "ArrowLeft") { e.preventDefault(); focusAt(i - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); focusAt(Math.min(i + 1, latest.current.length)); }
  }
  function onPaste(e: ClipboardEvent, i: number) {
    e.preventDefault();
    const chars = [...e.clipboardData.getData("text")].filter((ch) => allowed.test(ch)).join("");
    if (!chars) return;
    const next = (latest.current.slice(0, i) + chars).slice(0, length);
    commit(next);
    focusAt(next.length >= length ? length - 1 : next.length);
  }

  return (
    <div role="group" aria-label={ariaLabel} className={cn("inline-flex gap-2", className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={value[i] ?? ""}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(e, i)}
          onPaste={(e) => onPaste(e, i)}
          onFocus={(e) => {
            if (i > latest.current.length) focusAt(latest.current.length);
            else e.currentTarget.select();
          }}
          type={mask ? "password" : "text"}
          inputMode={numeric ? "numeric" : "text"}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && i === 0}
          disabled={disabled}
          maxLength={2}
          aria-label={`${ariaLabel}, character ${i + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-14 w-11 rounded-xl border bg-depth-surface text-center text-xl font-semibold text-depth-text outline-none",
            "shadow-[0_3px_0_var(--depth-border),inset_0_1px_1px_rgb(255_255_255/0.4)] transition-all duration-150",
            "focus:-translate-y-0.5 focus:border-depth-accent focus:shadow-[0_5px_0_var(--depth-border),0_0_0_3px_rgb(124_58_237/0.25)]",
            value[i] ? "border-depth-accent/60" : "border-depth-border",
            invalid && "border-red-500 focus:border-red-500 focus:shadow-[0_5px_0_var(--depth-border),0_0_0_3px_rgb(239_68_68/0.25)]",
            disabled && "cursor-not-allowed opacity-50",
          )}
        />
      ))}
    </div>
  );
}
