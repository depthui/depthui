import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Select3D — a custom dropdown whose menu tips open like a lid. It follows the
 * WAI-ARIA combobox and listbox pattern: arrow keys, Home/End, type-ahead,
 * Enter or Space to choose, Escape to close, and a click outside closes it. It
 * opens upward when there is no room below. Controlled or uncontrolled.
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Select3DProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** When set, a hidden input is rendered so the value posts with a form. */
  name?: string;
  /** Required: names the select for screen readers. */
  "aria-label": string;
  className?: string;
}

export function Select3D({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  disabled,
  name,
  "aria-label": ariaLabel,
  className,
}: Select3DProps) {
  const reduced = !!useReducedMotion();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const [inner, setInner] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const [active, setActive] = useState(0);
  const value = valueProp ?? inner;
  const selected = options.findIndex((o) => o.value === value);
  const typed = useRef({ text: "", t: 0 });

  useEffect(() => {
    if (!open) return;
    const close = (e: globalThis.PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function show() {
    if (disabled) return;
    const r = btn.current?.getBoundingClientRect();
    if (r) setUp(window.innerHeight - r.bottom < 280 && r.top > window.innerHeight - r.bottom);
    setActive(selected >= 0 ? selected : Math.max(0, options.findIndex((o) => !o.disabled)));
    setOpen(true);
  }
  function choose(i: number) {
    const o = options[i];
    if (!o || o.disabled) return;
    if (valueProp === undefined) setInner(o.value);
    onValueChange?.(o.value);
    setOpen(false);
    btn.current?.focus();
  }
  function move(from: number, dir: 1 | -1) {
    for (let k = 1; k <= options.length; k++) {
      const i = (from + dir * k + options.length * 2) % options.length;
      if (!options[i].disabled) return i;
    }
    return from;
  }
  function onKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); show(); }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => move(a, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => move(a, -1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(move(-1, 1)); }
    else if (e.key === "End") { e.preventDefault(); setActive(move(options.length, -1)); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(active); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "Tab") setOpen(false);
    else if (e.key.length === 1) {
      const now = Date.now();
      typed.current.text = now - typed.current.t > 600 ? e.key : typed.current.text + e.key;
      typed.current.t = now;
      const q = typed.current.text.toLowerCase();
      const i = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(q));
      if (i >= 0) setActive(i);
    }
  }

  const current = selected >= 0 ? options[selected] : undefined;

  return (
    <div ref={root} className={cn("relative inline-block w-full max-w-xs", className)}>
      <button
        ref={btn}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-o${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-depth-border bg-depth-surface px-4 text-sm outline-none transition-shadow duration-200",
          "shadow-[0_3px_0_var(--depth-border),inset_0_1px_1px_rgb(255_255_255/0.4)] focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg",
          open && "translate-y-0.5 shadow-[0_1px_0_var(--depth-border)]",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span className={cn("truncate", !current && "text-depth-muted")}>{current?.label ?? placeholder}</span>
        <svg aria-hidden viewBox="0 0 24 24" className={cn("h-4 w-4 shrink-0 text-depth-muted transition-transform duration-200", open && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {name && <input type="hidden" name={name} value={value ?? ""} />}
      <AnimatePresence>
        {open && (
          <motion.ul
            id={`${id}-list`}
            role="listbox"
            aria-label={ariaLabel}
            initial={reduced ? { opacity: 0 } : { opacity: 0, rotateX: up ? 16 : -16, scale: 0.97 }}
            animate={{ opacity: 1, rotateX: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, rotateX: up ? 10 : -10, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.16, ease: "easeOut" }}
            style={{ transformPerspective: 700, transformOrigin: up ? "50% 100%" : "50% 0%" }}
            className={cn(
              "absolute left-0 z-30 max-h-64 w-full overflow-auto rounded-xl border border-depth-border bg-depth-surface p-1 shadow-[0_18px_40px_-8px_rgb(0_0_0/0.35)]",
              up ? "bottom-full mb-2" : "top-full mt-2",
            )}
          >
            {options.map((o, i) => (
              <li
                key={o.value}
                id={`${id}-o${i}`}
                role="option"
                aria-selected={i === selected}
                aria-disabled={o.disabled || undefined}
                onPointerEnter={() => !o.disabled && setActive(i)}
                onClick={() => choose(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm",
                  i === active && "bg-depth-elevated",
                  i === selected && "font-medium text-depth-accent",
                  o.disabled && "cursor-not-allowed opacity-40",
                )}
              >
                <span className="truncate">{o.label}</span>
                {i === selected && (
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
