import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Combobox3D — a text box that filters a list as you type, then lets you pick
 * an option. Follows the ARIA combobox pattern: the input keeps focus and
 * aria-activedescendant points at the highlighted option. Arrow keys move,
 * Enter picks, Escape closes. Use Select3D when there is nothing to search.
 */
export interface ComboboxOption {
  /** Value returned when the option is chosen. */
  value: string;
  /** Text shown in the list and the input. */
  label: string;
  /** Stop this option from being chosen. */
  disabled?: boolean;
}

export interface Combobox3DProps {
  /** All the options that can be chosen. */
  options: ComboboxOption[];
  /** Chosen value. Set it to control the component. */
  value?: string | null;
  /** Starting value when uncontrolled. */
  defaultValue?: string | null;
  /** Called with the chosen value, or null when cleared. */
  onValueChange?: (value: string | null) => void;
  /** Hint shown while the input is empty. */
  placeholder?: string;
  /** Text shown when nothing matches. */
  emptyText?: string;
  /** Required: names the input for screen readers. */
  "aria-label": string;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Combobox3D({ options, value: valueProp, defaultValue = null, onValueChange, placeholder = "Search…", emptyText = "No matches", "aria-label": ariaLabel, className }: Combobox3DProps) {
  const uid = useId();
  const [inner, setInner] = useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const chosen = options.find((o) => o.value === value);
  const [text, setText] = useState(chosen?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q || (chosen && text === chosen.label)) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, text, chosen]);

  function commit(v: string | null) {
    if (valueProp === undefined) setInner(v);
    onValueChange?.(v);
  }
  function pick(o: ComboboxOption) {
    if (o.disabled) return;
    commit(o.value);
    setText(o.label);
    setOpen(false);
  }
  function move(dir: 1 | -1) {
    if (!filtered.length) return;
    let i = active;
    for (let k = 0; k < filtered.length; k++) {
      i = (i + dir + filtered.length) % filtered.length;
      if (!filtered[i].disabled) break;
    }
    setActive(i);
    requestAnimationFrame(() => list.current?.querySelector(`[data-i="${i}"]`)?.scrollIntoView({ block: "nearest" }));
  }
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); if (!open) setOpen(true); else move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (!open) setOpen(true); else move(-1); }
    else if (e.key === "Enter" && open && filtered[active]) { e.preventDefault(); pick(filtered[active]); }
    else if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); setText(chosen?.label ?? ""); }
  }

  return (
    <div className={cn("relative w-full max-w-xs", className)}>
      <input
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        aria-autocomplete="list"
        aria-activedescendant={open && filtered[active] ? `${uid}-o${active}` : undefined}
        value={text}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => { setText(e.target.value); setOpen(true); setActive(0); if (value !== null) commit(null); }}
        onFocus={() => setOpen(true)}
        onBlur={() => { setOpen(false); setText(chosen?.label ?? ""); }}
        onKeyDown={onKeyDown}
        className="h-11 w-full rounded-xl border border-depth-border bg-depth-elevated px-3.5 text-sm shadow-[inset_0_2px_5px_rgb(0_0_0/0.14)] outline-none transition-shadow placeholder:text-depth-muted focus-visible:ring-2 focus-visible:ring-depth-accent"
      />
      {open && (
        <ul
          ref={list}
          id={`${uid}-list`}
          role="listbox"
          aria-label={ariaLabel}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-auto rounded-xl border border-depth-border bg-depth-surface p-1.5 shadow-[0_18px_40px_rgb(0_0_0/0.25)]"
        >
          {filtered.length === 0 && <li role="presentation" className="px-3 py-2 text-sm text-depth-muted">{emptyText}</li>}
          {filtered.map((o, i) => (
            <li
              key={o.value}
              id={`${uid}-o${i}`}
              data-i={i}
              role="option"
              aria-selected={o.value === value}
              aria-disabled={o.disabled || undefined}
              onMouseEnter={() => !o.disabled && setActive(i)}
              onClick={() => pick(o)}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm",
                i === active && "bg-depth-accent text-white",
                o.disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {o.label}
              {o.value === value && <span aria-hidden>✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
