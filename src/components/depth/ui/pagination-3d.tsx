import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Pagination3D — page buttons with a raised thumb that slides to the current
 * page. Long ranges collapse with ellipses (1 … 4 5 6 … 20). A real `nav`
 * landmark, `aria-current="page"`, disabled previous and next at the ends.
 * Controlled or uncontrolled.
 */
export interface Pagination3DProps {
  /** Total number of pages. */
  total: number;
  /** Controlled current page, starting at 1. Pair it with onPageChange. */
  page?: number;
  /** Initial page when uncontrolled. */
  defaultPage?: number;
  /** Called with the new page number when it changes. */
  onPageChange?: (page: number) => void;
  /** Pages shown either side of the current one. */
  siblings?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

function range(page: number, total: number, sib: number): (number | "gap-l" | "gap-r")[] {
  const keep = new Set([1, total, page]);
  for (let i = 1; i <= sib; i++) { keep.add(page - i); keep.add(page + i); }
  const nums = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "gap-l" | "gap-r")[] = [];
  nums.forEach((n, i) => {
    const prev = nums[i - 1];
    if (prev && n - prev === 2) out.push(prev + 1);
    else if (prev && n - prev > 2) out.push(i < nums.length / 2 ? "gap-l" : "gap-r");
    out.push(n);
  });
  return out;
}

export function Pagination3D({ total, page: pageProp, defaultPage = 1, onPageChange, siblings = 1, className }: Pagination3DProps) {
  const reduced = !!useReducedMotion();
  const id = useId();
  const [inner, setInner] = useState(defaultPage);
  const page = Math.min(total, Math.max(1, pageProp ?? inner));
  const go = (p: number) => {
    const n = Math.min(total, Math.max(1, p));
    if (n === page) return;
    if (pageProp === undefined) setInner(n);
    onPageChange?.(n);
  };
  const base = "relative inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent";
  const arrow = (dir: -1 | 1) => {
    const off = dir < 0 ? page <= 1 : page >= total;
    return (
      <button type="button" aria-label={dir < 0 ? "Previous page" : "Next page"} disabled={off} onClick={() => go(page + dir)} className={cn(base, "text-depth-muted hover:text-depth-text", off && "cursor-not-allowed opacity-35 hover:text-depth-muted")}>
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={dir < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
        </svg>
      </button>
    );
  };
  return (
    <nav aria-label="Pagination" className={cn("inline-flex items-center gap-1 rounded-xl border border-depth-border bg-depth-elevated p-1 shadow-[inset_0_2px_5px_rgb(0_0_0/0.12)]", className)}>
      {arrow(-1)}
      {range(page, total, siblings).map((n) =>
        typeof n === "string" ? (
          <span key={n} aria-hidden className="inline-flex h-9 w-6 items-center justify-center text-depth-muted">…</span>
        ) : (
          <button key={n} type="button" aria-label={`Page ${n}`} aria-current={n === page ? "page" : undefined} onClick={() => go(n)} className={cn(base, n === page ? "text-depth-text" : "text-depth-muted hover:text-depth-text")}>
            {n === page && (
              <motion.span
                aria-hidden
                layoutId={`${id}-thumb`}
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-lg border border-depth-border bg-depth-surface shadow-[0_3px_0_var(--depth-border),0_8px_14px_rgb(0_0_0/0.14),inset_0_1px_1px_rgb(255_255_255/0.5)]"
              />
            )}
            <span className="relative z-10 tabular-nums">{n}</span>
          </button>
        ),
      )}
      {arrow(1)}
    </nav>
  );
}
