import { useMemo, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * DateRangePicker3D — pick a start and an end date on one calendar. Click a
 * start date, then an end date; days between are tinted and previewed as you
 * move. Clicking again starts a new range. Arrow keys move by day and week,
 * PageUp and PageDown change month, Enter or Space picks, Escape drops a
 * half-picked range. Use Calendar3D for a single date.
 */
export interface DateRange {
  /** First day of the range, or null when nothing is picked. */
  start: Date | null;
  /** Last day of the range, or null while only the start is picked. */
  end: Date | null;
}

export interface DateRangePicker3DProps {
  /** Selected range. Set it to control the component. */
  value?: DateRange;
  /** Starting range when uncontrolled. */
  defaultValue?: DateRange;
  /** Called whenever the range changes. */
  onValueChange?: (range: DateRange) => void;
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

const k = (d: Date) => d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
const day0 = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const EMPTY: DateRange = { start: null, end: null };

export function DateRangePicker3D({ value: valueProp, defaultValue = EMPTY, onValueChange, min, max, weekStartsOn = 0, locale = "en-US", className }: DateRangePicker3DProps) {
  const [inner, setInner] = useState<DateRange>(defaultValue);
  const range = valueProp ?? inner;
  const today = useMemo(() => day0(new Date()), []);
  const [focus, setFocus] = useState<Date>(() => day0(range.start ?? today));
  const [hover, setHover] = useState<Date | null>(null);

  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(focus);
  const weekdays = useMemo(() => {
    const long = new Intl.DateTimeFormat(locale, { weekday: "long" });
    const narrow = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(2023, 0, 1 + ((i + weekStartsOn) % 7)); return { long: long.format(d), short: narrow.format(d) }; });
  }, [locale, weekStartsOn]);
  const cells = useMemo(() => {
    const first = new Date(focus.getFullYear(), focus.getMonth(), 1);
    const start = addDays(first, -((first.getDay() - weekStartsOn + 7) % 7));
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [focus, weekStartsOn]);

  const off = (d: Date) => (!!min && d < day0(min)) || (!!max && d > day0(max));
  function commit(r: DateRange) {
    if (valueProp === undefined) setInner(r);
    onValueChange?.(r);
  }
  function pick(d: Date) {
    if (off(d)) return;
    setFocus(d);
    if (!range.start || range.end) commit({ start: d, end: null });
    else commit(d < range.start ? { start: d, end: range.start } : { start: range.start, end: d });
  }
  function shiftMonth(n: number) {
    const t = new Date(focus.getFullYear(), focus.getMonth() + n, 1);
    return new Date(t.getFullYear(), t.getMonth(), Math.min(focus.getDate(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()));
  }
  function moveTo(d: Date) {
    setFocus(d);
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-rk="${k(d)}"]`)?.focus());
  }
  function onKeyDown(e: KeyboardEvent) {
    const wd = (focus.getDay() - weekStartsOn + 7) % 7;
    const next =
      e.key === "ArrowRight" ? addDays(focus, 1) : e.key === "ArrowLeft" ? addDays(focus, -1)
      : e.key === "ArrowDown" ? addDays(focus, 7) : e.key === "ArrowUp" ? addDays(focus, -7)
      : e.key === "Home" ? addDays(focus, -wd) : e.key === "End" ? addDays(focus, 6 - wd)
      : e.key === "PageDown" ? shiftMonth(1) : e.key === "PageUp" ? shiftMonth(-1) : null;
    if (e.key === "Escape" && range.start && !range.end) { commit(EMPTY); return; }
    if (!next) return;
    e.preventDefault();
    moveTo(next);
    if (range.start && !range.end) setHover(next);
  }

  // While only the start is picked, preview the range up to the hovered or focused day.
  const previewEnd = range.start && !range.end ? hover : null;
  const lo = range.start && (range.end ?? previewEnd) ? (range.start < (range.end ?? previewEnd)! ? range.start : (range.end ?? previewEnd)!) : null;
  const hi = range.start && (range.end ?? previewEnd) ? (range.start < (range.end ?? previewEnd)! ? (range.end ?? previewEnd)! : range.start) : null;
  const fmt = (d: Date | null) => (d ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d) : "…");
  const nav = "flex h-9 w-9 items-center justify-center rounded-lg border border-depth-border bg-depth-surface outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-depth-accent";

  return (
    <div className={cn("w-full max-w-xs rounded-2xl border border-depth-border bg-depth-surface p-4 shadow-[0_14px_32px_rgb(0_0_0/0.14)]", className)}>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label="Previous month" className={nav} onClick={() => moveTo(shiftMonth(-1))}>
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4"><path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h3 aria-live="polite" className="text-sm font-semibold">{monthName}</h3>
        <button type="button" aria-label="Next month" className={nav} onClick={() => moveTo(shiftMonth(1))}>
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div role="grid" aria-label={monthName} onKeyDown={onKeyDown} onMouseLeave={() => setHover(null)}>
        <div role="row" className="mb-1 grid grid-cols-7 text-center">
          {weekdays.map((w, i) => <span key={i} role="columnheader" aria-label={w.long} className="py-1 text-[11px] font-medium text-depth-muted">{w.short}</span>)}
        </div>
        {Array.from({ length: 6 }, (_, r) => (
          <div key={r} role="row" className="grid grid-cols-7">
            {cells.slice(r * 7, r * 7 + 7).map((d, c) => {
              const inMonth = d.getMonth() === focus.getMonth();
              const isStart = !!lo && k(d) === k(lo), isEnd = !!hi && k(d) === k(hi);
              const inside = !!lo && !!hi && k(d) > k(lo) && k(d) < k(hi);
              const edge = isStart || isEnd;
              const disabled = off(d);
              const isFocus = k(d) === k(focus);
              return (
                <div key={k(d)} role="gridcell" aria-selected={edge || inside} className={cn("py-0.5", inside && "bg-depth-accent/15", isStart && !!hi && k(lo!) !== k(hi) && "rounded-l-lg bg-depth-accent/15", isEnd && !!lo && k(lo) !== k(hi!) && "rounded-r-lg bg-depth-accent/15", c === 0 && inside && "rounded-l-lg", c === 6 && inside && "rounded-r-lg")}>
                  <button
                    type="button"
                    data-rk={k(d)}
                    tabIndex={isFocus ? 0 : -1}
                    disabled={disabled}
                    aria-current={k(d) === k(today) ? "date" : undefined}
                    aria-label={`${new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(d)}${isStart && range.end ? ", range start" : ""}${isEnd && range.end ? ", range end" : ""}`}
                    onClick={() => pick(d)}
                    onMouseEnter={() => range.start && !range.end && setHover(d)}
                    onFocus={() => { if (!isFocus) setFocus(d); }}
                    className={cn(
                      "flex aspect-square w-full items-center justify-center rounded-lg text-sm tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent",
                      !inMonth && !edge && "text-depth-muted/50",
                      !edge && !inside && "hover:bg-depth-elevated",
                      edge && "bg-depth-accent font-semibold text-white shadow-[0_3px_0_rgb(0_0_0/0.25)]",
                      k(d) === k(today) && !edge && "font-semibold text-depth-accent",
                      disabled && "cursor-not-allowed opacity-30 hover:bg-transparent",
                    )}
                  >
                    {d.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p role="status" className="mt-3 text-center text-xs text-depth-muted">
        {range.start ? `${fmt(range.start)} to ${fmt(range.end)}` : "Pick a start date"}
      </p>
    </div>
  );
}
