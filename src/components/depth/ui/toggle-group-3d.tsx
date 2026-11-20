import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * ToggleGroup3D — a row of raised toggle buttons, like bold, italic and
 * underline in an editor. Each button is a real button with aria-pressed. In
 * single mode choosing one switches the others off; in multiple mode any can be on.
 * Use SegmentedControl3D when exactly one choice must always be selected.
 */
export interface ToggleItem {
  /** Value of the item. */
  value: string;
  /** Visible content: text or an icon. */
  label: ReactNode;
  /** Required when the label is only an icon, so screen readers can name it. */
  "aria-label"?: string;
  /** Stop this item from being toggled. */
  disabled?: boolean;
}

export interface ToggleGroup3DProps {
  /** The buttons in the group. */
  items: ToggleItem[];
  /** "single" allows one pressed item at most, "multiple" allows any number. */
  type?: "single" | "multiple";
  /** Pressed values. Set it to control the component. */
  value?: string[];
  /** Pressed values at the start when uncontrolled. */
  defaultValue?: string[];
  /** Called with the new list of pressed values. */
  onValueChange?: (value: string[]) => void;
  /** Size of the buttons. */
  size?: "sm" | "md";
  /** Required: names the group for screen readers. */
  "aria-label": string;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function ToggleGroup3D({ items, type = "multiple", value: valueProp, defaultValue = [], onValueChange, size = "md", "aria-label": ariaLabel, className }: ToggleGroup3DProps) {
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;

  function toggle(v: string) {
    const on = value.includes(v);
    const next = on ? value.filter((x) => x !== v) : type === "single" ? [v] : [...value, v];
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  }

  return (
    <div role="group" aria-label={ariaLabel} className={cn("inline-flex gap-1.5 rounded-xl border border-depth-border bg-depth-elevated p-1 shadow-[inset_0_2px_5px_rgb(0_0_0/0.14)]", className)}>
      {items.map((it) => {
        const on = value.includes(it.value);
        return (
          <button
            key={it.value}
            type="button"
            aria-pressed={on}
            aria-label={it["aria-label"]}
            disabled={it.disabled}
            onClick={() => toggle(it.value)}
            className={cn(
              "flex items-center justify-center rounded-lg font-medium outline-none transition-[transform,box-shadow,background-color,color] duration-150 focus-visible:ring-2 focus-visible:ring-depth-accent",
              size === "sm" ? "h-8 min-w-8 px-2 text-xs" : "h-10 min-w-10 px-3 text-sm",
              on
                ? "translate-y-[2px] bg-depth-accent text-white shadow-[inset_0_2px_4px_rgb(0_0_0/0.3)]"
                : "bg-depth-surface text-depth-text shadow-[0_3px_0_var(--depth-border),0_6px_10px_rgb(0_0_0/0.1)] hover:-translate-y-px",
              it.disabled && "cursor-not-allowed opacity-40",
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
