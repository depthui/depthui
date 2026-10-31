import { useState } from "react";
import { Reorder, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ReorderList3D — a list you can rearrange by dragging. The row you hold
 * lifts toward you, tips back a little and throws a deeper shadow, while the
 * others slide out of the way on a spring. Each row also has up and down
 * buttons, so it works with a keyboard.
 */
export interface ReorderItem3D {
  id: string;
  title: string;
  subtitle?: string;
}

export interface ReorderList3DProps {
  /** The rows to show. Each needs a unique id, a title and an optional subtitle. */
  items: ReorderItem3D[];
  /** Called with the new order of items after a row moves. */
  onChange?: (items: ReorderItem3D[]) => void;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function ReorderList3D({ items, onChange, className }: ReorderList3DProps) {
  const reduced = !!useReducedMotion();
  const [order, setOrder] = useState(items);
  const apply = (next: ReorderItem3D[]) => {
    setOrder(next);
    onChange?.(next);
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    apply(next);
  };

  return (
    <Reorder.Group
      axis="y"
      values={order}
      onReorder={apply}
      className={cn("w-full max-w-sm space-y-2", className)}
      style={{ perspective: 900 }}
      aria-label="Reorderable list"
    >
      {order.map((item, i) => (
        <Reorder.Item
          key={item.id}
          value={item}
          whileDrag={reduced ? { scale: 1.02 } : { scale: 1.05, rotateX: -7, zIndex: 20, boxShadow: "0 28px 44px -14px var(--depth-shadow)" }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="relative flex cursor-grab touch-none select-none items-center gap-3 rounded-2xl border border-depth-border bg-depth-surface px-4 py-3 active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d" }}
        >
          <span aria-hidden className="grid grid-cols-2 gap-[3px] text-depth-muted">
            {Array.from({ length: 6 }, (_, k) => <span key={k} className="h-[3px] w-[3px] rounded-full bg-current" />)}
          </span>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-depth-accent/15 font-mono text-xs font-bold text-depth-accent" aria-hidden>{i + 1}</span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold">{item.title}</span>
            {item.subtitle && <span className="block truncate text-xs text-depth-muted">{item.subtitle}</span>}
          </span>
          <span className="flex flex-col">
            <button type="button" aria-label={`Move ${item.title} up`} disabled={i === 0} onClick={() => move(i, -1)} onPointerDown={(e) => e.stopPropagation()} className="rounded px-1 text-xs leading-none text-depth-muted outline-none hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent disabled:opacity-30">▲</button>
            <button type="button" aria-label={`Move ${item.title} down`} disabled={i === order.length - 1} onClick={() => move(i, 1)} onPointerDown={(e) => e.stopPropagation()} className="rounded px-1 text-xs leading-none text-depth-muted outline-none hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent disabled:opacity-30">▼</button>
          </span>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
