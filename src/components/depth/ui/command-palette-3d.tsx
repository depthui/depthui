import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useOverlay } from "@/hooks/use-overlay";
import { cn } from "@/lib/utils";

/**
 * CommandPalette3D — a Ctrl+K / Cmd+K search box that jumps to any action. Type
 * to filter (label, group and keywords), use Up and Down to move, Enter to run,
 * Esc to close. It follows the combobox and listbox pattern, so screen readers
 * announce the highlighted result. Items can be grouped.
 */
export interface CommandItem {
  /** Unique id. */
  id: string;
  /** Text shown and searched. */
  label: string;
  /** Heading the item is listed under, like "Navigate". */
  group?: string;
  /** Extra words that also match the search. */
  keywords?: string[];
  /** Small text on the right, such as a shortcut. */
  hint?: string;
  /** Icon shown before the label. */
  icon?: ReactNode;
  /** Called when the item is chosen. The palette closes first. */
  onSelect: () => void;
}

export interface CommandPalette3DProps {
  /** Whether the palette is visible. */
  open: boolean;
  /** Called when it should open or close. */
  onOpenChange: (open: boolean) => void;
  /** Everything that can be searched. */
  items: CommandItem[];
  /** Hint text in the empty search box. */
  placeholder?: string;
  /** Key that opens it together with Ctrl or Cmd. Use "" to turn the shortcut off. */
  hotkey?: string;
  /** Message shown when nothing matches. */
  emptyText?: string;
}

export function CommandPalette3D({ open, onOpenChange, items, placeholder = "Type a command or search…", hotkey = "k", emptyText = "No results found." }: CommandPalette3DProps) {
  const reduced = !!useReducedMotion();
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const close = () => onOpenChange(false);
  useOverlay(open, panel, close, false);

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey.toLowerCase()) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hotkey, open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      const raf = requestAnimationFrame(() => field.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return items;
    return items.filter((i) => {
      const hay = `${i.label} ${i.group ?? ""} ${(i.keywords ?? []).join(" ")}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [items, q]);

  const run = (item?: CommandItem) => {
    if (!item) return;
    close();
    requestAnimationFrame(() => item.onSelect());
  };

  useEffect(() => {
    panel.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (typeof document === "undefined") return null;
  let lastGroup: string | undefined;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div key="palette" className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-[14vh]" style={{ perspective: 1200 }}>
          <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.15 }} onClick={close} className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={reduced ? { opacity: 0 } : { opacity: 0, rotateX: -14, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, rotateX: -8, y: -8, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "50% 0%" }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-depth-border bg-depth-surface shadow-[0_40px_80px_-30px_var(--depth-shadow)]"
          >
            <div className="flex items-center gap-3 border-b border-depth-border px-4">
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-depth-muted" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              <input
                ref={field}
                value={q}
                onChange={(e) => { setQ(e.target.value); setActive(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (results.length ? (a + 1) % results.length : 0)); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0)); }
                  else if (e.key === "Home") { e.preventDefault(); setActive(0); }
                  else if (e.key === "End") { e.preventDefault(); setActive(Math.max(0, results.length - 1)); }
                  else if (e.key === "Enter") { e.preventDefault(); run(results[active]); }
                }}
                role="combobox"
                aria-expanded="true"
                aria-controls={`${id}-list`}
                aria-activedescendant={results[active] ? `${id}-o${active}` : undefined}
                aria-autocomplete="list"
                placeholder={placeholder}
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-depth-muted"
              />
              <kbd className="hidden rounded border border-depth-border px-1.5 py-0.5 font-mono text-[10px] text-depth-muted sm:block">Esc</kbd>
            </div>
            <ul id={`${id}-list`} role="listbox" aria-label="Results" className="max-h-[320px] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-depth-muted">{emptyText}</li>}
              {results.map((item, i) => {
                const head = item.group && item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                return (
                  <li key={item.id} role="presentation">
                    {head && <div role="presentation" className="px-3 pb-1 pt-2.5 text-[11px] font-medium uppercase tracking-wider text-depth-muted">{head}</div>}
                    <div
                      id={`${id}-o${i}`}
                      data-idx={i}
                      role="option"
                      aria-selected={i === active}
                      onPointerMove={() => i !== active && setActive(i)}
                      onClick={() => run(item)}
                      className={cn("relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm", i === active && "text-depth-text")}
                    >
                      {i === active && (
                        <motion.span aria-hidden layoutId={`${id}-hl`} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }} className="absolute inset-0 rounded-lg bg-depth-elevated shadow-[inset_0_0_0_1px_var(--depth-border)]" />
                      )}
                      {item.icon && <span className="relative shrink-0 text-depth-muted">{item.icon}</span>}
                      <span className="relative min-w-0 flex-1 truncate">{item.label}</span>
                      {item.hint && <span className="relative shrink-0 font-mono text-xs text-depth-muted">{item.hint}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="sr-only" aria-live="polite">{results.length} result{results.length === 1 ? "" : "s"}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
