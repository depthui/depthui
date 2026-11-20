import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * InlineEdit3D — text that turns into an input when you click it, like a
 * document title. Enter or leaving the field saves, Escape cancels. The text
 * is a real button, so it works with a keyboard and screen readers. Empty
 * values show the placeholder.
 */
export interface InlineEdit3DProps {
  /** Current text. Set it to control the component. */
  value?: string;
  /** Starting text when uncontrolled. */
  defaultValue?: string;
  /** Called with the new text when an edit is saved. */
  onValueChange?: (value: string) => void;
  /** Shown when the text is empty. */
  placeholder?: string;
  /** Required: names the field for screen readers. */
  "aria-label": string;
  /** Extra classes added to the text and the input. */
  className?: string;
}

export function InlineEdit3D({ value: valueProp, defaultValue = "", onValueChange, placeholder = "Click to edit", "aria-label": ariaLabel, className }: InlineEdit3DProps) {
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const input = useRef<HTMLInputElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const cancelled = useRef(false);
  const wasEditing = useRef(false);

  useEffect(() => {
    if (editing) { input.current?.focus(); input.current?.select(); }
    else if (wasEditing.current) btn.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  function save() {
    if (cancelled.current) { cancelled.current = false; setEditing(false); return; }
    const v = draft.trim();
    if (v !== value) {
      if (valueProp === undefined) setInner(v);
      onValueChange?.(v);
    }
    setEditing(false);
  }

  const shared = "h-10 rounded-lg px-3 text-base font-medium";
  return editing ? (
    <input
      ref={input}
      aria-label={ariaLabel}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") { e.preventDefault(); save(); }
        else if (e.key === "Escape") { e.preventDefault(); cancelled.current = true; setEditing(false); }
      }}
      className={cn(shared, "w-full max-w-xs border border-depth-accent bg-depth-elevated shadow-[inset_0_2px_5px_rgb(0_0_0/0.14)] outline-none focus-visible:ring-2 focus-visible:ring-depth-accent", className)}
    />
  ) : (
    <button
      ref={btn}
      type="button"
      aria-label={`${ariaLabel}: ${value || "empty"}. Edit`}
      onClick={() => { setDraft(value); cancelled.current = false; setEditing(true); }}
      className={cn(shared, "group inline-flex max-w-xs items-center gap-2 border border-transparent text-left outline-none transition-colors hover:border-depth-border hover:bg-depth-elevated focus-visible:ring-2 focus-visible:ring-depth-accent", !value && "text-depth-muted", className)}
    >
      <span className="truncate">{value || placeholder}</span>
      <svg aria-hidden viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 text-depth-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <path d="M13.5 3.5l3 3L7 16H4v-3l9.5-9.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
