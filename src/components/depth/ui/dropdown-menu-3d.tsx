import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * DropdownMenu3D — a button that opens a floating menu. The menu tilts in from
 * the trigger. It follows the menu button pattern: Arrow keys move, Home and
 * End jump, Enter or Space choose, Escape and outside clicks close it and focus
 * returns to the trigger.
 */
export interface MenuItem {
  /** Unique id of the item. */
  id: string;
  /** Text of the item. */
  label: ReactNode;
  /** Optional icon shown before the label. */
  icon?: ReactNode;
  /** Small hint shown at the end, such as a shortcut. */
  hint?: ReactNode;
  /** Colour the item as a destructive action. */
  danger?: boolean;
  /** Stop this item from being chosen. */
  disabled?: boolean;
  /** Draw a divider line above this item. */
  separatorBefore?: boolean;
}

export interface DropdownMenu3DProps {
  /** The items in the menu. */
  items: MenuItem[];
  /** Called with the id of the chosen item. */
  onSelect?: (id: string) => void;
  /** Content of the trigger button. */
  children: ReactNode;
  /** Which edge of the trigger the menu lines up with. */
  align?: "start" | "end";
  /** Accessible name of the menu. */
  "aria-label"?: string;
  /** Extra classes added to the trigger button. */
  className?: string;
}

export function DropdownMenu3D({ items, onSelect, children, align = "start", "aria-label": ariaLabel = "Menu", className }: DropdownMenu3DProps) {
  const reduced = !!useReducedMotion();
  const uid = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = () => items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);

  function close(refocus = true) {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  }
  function focusAt(i: number | undefined) {
    if (i !== undefined) refs.current[i]?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const on = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", on);
    return () => document.removeEventListener("pointerdown", on);
  }, [open]);

  function onMenuKey(e: KeyboardEvent) {
    const list = enabled();
    const cur = list.indexOf(refs.current.findIndex((r) => r === document.activeElement));
    if (e.key === "ArrowDown") focusAt(list[(cur + 1) % list.length]);
    else if (e.key === "ArrowUp") focusAt(list[(cur - 1 + list.length) % list.length]);
    else if (e.key === "Home") focusAt(list[0]);
    else if (e.key === "End") focusAt(list[list.length - 1]);
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") setOpen(false);
    else return;
    if (e.key !== "Tab") e.preventDefault();
  }
  function onTriggerKey(e: KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    setOpen(true);
    const list = enabled();
    requestAnimationFrame(() => focusAt(e.key === "ArrowDown" ? list[0] : list[list.length - 1]));
  }
  function choose(it: MenuItem) {
    if (it.disabled) return;
    onSelect?.(it.id);
    close();
  }

  return (
    <div ref={root} className="relative inline-block">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${uid}-menu` : undefined}
        onClick={() => {
          setOpen((o) => !o);
          requestAnimationFrame(() => focusAt(enabled()[0]));
        }}
        onKeyDown={onTriggerKey}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border border-depth-border bg-depth-surface px-4 py-2.5 text-sm font-medium outline-none transition-[transform,box-shadow] duration-150",
          "shadow-[0_4px_0_var(--depth-border),0_8px_14px_rgb(0_0_0/0.12)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--depth-border)]",
          "focus-visible:ring-2 focus-visible:ring-depth-accent",
          className,
        )}
      >
        {children}
        <svg aria-hidden viewBox="0 0 20 20" className={cn("h-4 w-4 text-depth-muted transition-transform", open && "rotate-180")}>
          <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <div className={cn("absolute top-full z-30 pt-2", align === "end" ? "right-0" : "left-0")} style={{ perspective: 700 }}>
            <motion.div
              id={`${uid}-menu`}
              role="menu"
              aria-label={ariaLabel}
              onKeyDown={onMenuKey}
              initial={reduced ? { opacity: 0 } : { opacity: 0, rotateX: -18, y: -6 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, rotateX: -12, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top center" }}
              className="min-w-[13rem] rounded-xl border border-depth-border bg-depth-surface p-1.5 shadow-[0_18px_40px_rgb(0_0_0/0.25)]"
            >
              {items.map((it, i) => (
                <div key={it.id}>
                  {it.separatorBefore && <div role="separator" className="my-1 h-px bg-depth-border" />}
                  <button
                    ref={(el) => { refs.current[i] = el; }}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    disabled={it.disabled}
                    onClick={() => choose(it)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors",
                      "focus-visible:bg-depth-accent focus-visible:text-white hover:bg-depth-elevated",
                      it.danger ? "text-red-600 dark:text-red-400" : "text-depth-text",
                      it.disabled && "cursor-not-allowed opacity-40",
                    )}
                  >
                    {it.icon && <span aria-hidden className="flex h-4 w-4 items-center justify-center">{it.icon}</span>}
                    <span className="flex-1">{it.label}</span>
                    {it.hint && <span className="font-mono text-[11px] opacity-60">{it.hint}</span>}
                  </button>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
