import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Calendar3D — a month calendar for picking a date. Days are raised tiles and
 * the chosen day pops forward. Arrow keys move by day and week, PageUp and
 * PageDown change month, Home and End jump to the start and end of the week.
 * Dates before min or after max are disabled.
 */
export interface Calendar3DProps {
  /** Selected date. Set it to control the component. */
  value?: Date | null;
  /** Starting date when uncontrolled. */
  defaultValue?: Date | null;
  /** Called with the chosen date. */
  onValueChange?: (date: Date) => void;
  /** Earliest date that can be chosen. */
  min?: Date;
  /** Latest date that can be chosen. */
  max?: Date;
  /** Day the week starts on: 0 is Sunday, 1 is Monday. */
  weekStartsOn?: 0 | 1;
  /** Locale for month and weekday names, such as "en-US" or "hi-IN". */
  locale?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const day0 = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export function Calendar3D({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  weekStartsOn = 0,
  locale = "en-US",
  className,
}: Calendar3DProps) {
  const reduced = !!useReducedMotion();
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const today = useMemo(() => day0(new Date()), []);
  const [focus, setFocus] = useState<Date>(() => day0(value ?? today));
  const grid = useRef<HTMLDivElement>(null);

  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(focus);
  const weekdays = useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const narrow = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2023, 0, 1 + ((i + weekStartsOn) % 7)); // 2023-01-01 is a Sunday
      return { long: f.format(d), short: narrow.format(d) };
    });
  }, [locale, weekStartsOn]);

  const cells = useMemo(() => {
    const first = new Date(focus.getFullYear(), focus.getMonth(), 1);
    const lead = (first.getDay() - weekStartsOn + 7) % 7;
    const start = addDays(first, -lead);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [focus, weekStartsOn]);

  const disabled = (d: Date) => (!!min && d < day0(min)) || (!!max && d > day0(max));

  function pick(d: Date) {
    if (disabled(d)) return;
    if (valueProp === undefined) setInner(d);
    onValueChange?.(d);
    setFocus(d);
  }
  function moveFocus(d: Date) {
    setFocus(d);
    requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>(`[data-k="${key(d)}"]`)?.focus());
  }
  function shiftMonth(n: number) {
    const t = new Date(focus.getFullYear(), focus.getMonth() + n, 1);
    const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
    return new Date(t.getFullYear(), t.getMonth(), Math.min(focus.getDate(), last));
  }
  function onKeyDown(e: KeyboardEvent) {
    const wd = (focus.getDay() - weekStartsOn + 7) % 7;
    const next =
      e.key === "ArrowRight" ? addDays(focus, 1)
      : e.key === "ArrowLeft" ? addDays(focus, -1)
      : e.key === "ArrowDown" ? addDays(focus, 7)
      : e.key === "ArrowUp" ? addDays(focus, -7)
      : e.key === "Home" ? addDays(focus, -wd)
      : e.key === "End" ? addDays(focus, 6 - wd)
      : e.key === "PageDown" ? shiftMonth(1)
      : e.key === "PageUp" ? shiftMonth(-1)
      : null;
    if (!next) return;
    e.preventDefault();
    moveFocus(next);
  }

  const nav = "flex h-9 w-9 items-center justify-center rounded-lg border border-depth-border bg-depth-surface outline-none transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-depth-accent";

  return (
    <div className={cn("w-full max-w-xs rounded-2xl border border-depth-border bg-depth-surface p-4 shadow-[0_14px_32px_rgb(0_0_0/0.14)]", className)}>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label="Previous month" className={nav} onClick={() => moveFocus(shiftMonth(-1))}>
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4"><path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h3 aria-live="polite" className="text-sm font-semibold">{monthName}</h3>
        <button type="button" aria-label="Next month" className={nav} onClick={() => moveFocus(shiftMonth(1))}>
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div ref={grid} role="grid" aria-label={monthName} onKeyDown={onKeyDown}>
        <div role="row" className="mb-1 grid grid-cols-7 text-center">
          {weekdays.map((w, i) => (
            <span key={i} role="columnheader" aria-label={w.long} className="py-1 text-[11px] font-medium text-depth-muted">{w.short}</span>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, r) => (
          <div key={r} role="row" className="grid grid-cols-7">
            {cells.slice(r * 7, r * 7 + 7).map((d) => {
              const inMonth = d.getMonth() === focus.getMonth();
              const selected = !!value && key(d) === key(value);
              const isToday = key(d) === key(today);
              const off = disabled(d);
              const isFocus = key(d) === key(focus);
              return (
                <div key={key(d)} role="gridcell" aria-selected={selected} className="p-0.5">
                  <button
                    type="button"
                    data-k={key(d)}
                    tabIndex={isFocus ? 0 : -1}
                    disabled={off}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(d)}
                    onClick={() => pick(d)}
                    onFocus={() => !isFocus && setFocus(d)}
                    className={cn(
                      "relative flex aspect-square w-full items-center justify-center rounded-lg text-sm tabular-nums outline-none transition-colors",
                      "focus-visible:ring-2 focus-visible:ring-depth-accent",
                      !inMonth && "text-depth-muted/50",
                      inMonth && !selected && "hover:bg-depth-elevated",
                      isToday && !selected && "font-semibold text-depth-accent",
                      off && "cursor-not-allowed opacity-30 hover:bg-transparent",
                    )}
                  >
                    {selected && (
                      <motion.span
                        aria-hidden
                        layoutId="cal3d-sel"
                        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 30 }}
                        className="absolute inset-0 rounded-lg bg-depth-accent shadow-[0_3px_0_rgb(0_0_0/0.25),0_6px_12px_rgb(0_0_0/0.18)]"
                      />
                    )}
                    <span className={cn("relative", selected && "font-semibold text-white")}>{d.getDate()}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
