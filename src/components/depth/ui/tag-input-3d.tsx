import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * TagInput3D — type a word and press Enter (or a comma) to turn it into a
 * chip. Backspace on an empty field removes the last chip, and every chip has
 * its own remove button. Chips pop in and out. Pasting "a, b, c" adds three.
 * Controlled or uncontrolled.
 */
export interface TagInput3DProps {
  /** Tags for controlled use. */
  value?: string[];
  /** Starting tags when the component manages its own state. */
  defaultValue?: string[];
  /** Called with the full tag list after every change. */
  onValueChange?: (tags: string[]) => void;
  /** Hint text shown while there are no tags. */
  placeholder?: string;
  /** Most tags allowed. Further input is ignored. */
  max?: number;
  /** Allow the same tag twice. Off by default. */
  allowDuplicates?: boolean;
  /** Words offered under the field. Clicking one adds it. */
  suggestions?: string[];
  /** Stops all interaction and dims the field. */
  disabled?: boolean;
  /** Names the field for screen readers when there is no visible label. */
  "aria-label"?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function TagInput3D({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  placeholder = "Add a tag…",
  max = 10,
  allowDuplicates = false,
  suggestions,
  disabled,
  "aria-label": ariaLabel = "Tags",
  className,
}: TagInput3DProps) {
  const reduced = !!useReducedMotion();
  const id = useId();
  const field = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState(defaultValue);
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const tags = valueProp ?? inner;

  function set(next: string[]) {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  }
  function add(raw: string) {
    const words = raw.split(",").map((w) => w.trim()).filter(Boolean);
    if (!words.length) return;
    let next = [...tags];
    for (const w of words) {
      if (next.length >= max) break;
      if (!allowDuplicates && next.some((t) => t.toLowerCase() === w.toLowerCase())) continue;
      next = [...next, w];
    }
    if (next.length !== tags.length) { set(next); setNote(`Added ${next[next.length - 1]}. ${next.length} of ${max} tags.`); }
    setText("");
  }
  function remove(i: number) {
    setNote(`Removed ${tags[i]}.`);
    set(tags.filter((_, k) => k !== i));
    field.current?.focus();
  }
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(text); }
    else if (e.key === "Backspace" && !text && tags.length) remove(tags.length - 1);
  }
  const full = tags.length >= max;
  const offered = (suggestions ?? []).filter((s) => allowDuplicates || !tags.some((t) => t.toLowerCase() === s.toLowerCase())).slice(0, 6);

  return (
    <div className={cn("w-full max-w-md", disabled && "pointer-events-none opacity-50", className)}>
      <div
        onClick={() => field.current?.focus()}
        className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-depth-border bg-depth-surface px-3 py-2 shadow-[inset_0_2px_4px_rgb(0_0_0/0.08)] transition-shadow focus-within:border-depth-accent focus-within:shadow-[0_0_0_3px_rgb(124_58_237/0.22)]"
      >
        <AnimatePresence initial={false}>
          {tags.map((t, i) => (
            <motion.span
              key={t}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, scale: 0.7, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-b from-depth-accent to-depth-accent-2 py-1 pl-2.5 pr-1 text-xs font-medium text-white shadow-[0_2px_0_rgb(0_0_0/0.22)]"
            >
              {t}
              <button type="button" onClick={(e) => { e.stopPropagation(); remove(i); }} aria-label={`Remove ${t}`} className="flex h-4 w-4 items-center justify-center rounded-full outline-none transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white">
                <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          ref={field}
          id={id}
          value={text}
          onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setText(e.target.value))}
          onKeyDown={onKeyDown}
          onBlur={() => text.trim() && add(text)}
          disabled={disabled || full}
          aria-label={ariaLabel}
          placeholder={full ? `Limit of ${max} reached` : tags.length ? "" : placeholder}
          className="min-w-[7ch] flex-1 bg-transparent text-sm outline-none placeholder:text-depth-muted"
        />
      </div>
      {offered.length > 0 && !full && (
        <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Suggestions">
          {offered.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="rounded-md border border-depth-border px-2 py-1 text-xs text-depth-muted outline-none transition-colors hover:border-depth-accent hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent">
              + {s}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">{note}</p>
    </div>
  );
}
