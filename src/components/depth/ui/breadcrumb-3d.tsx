import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Breadcrumb3D — a trail of raised chips showing where you are. The last item
 * is the current page. Long trails collapse the middle into an "…" button that
 * expands them. A nav landmark with an ordered list and aria-current="page".
 */
export interface BreadcrumbItem {
  /** Unique id of the item. */
  id: string;
  /** Text of the item. */
  label: ReactNode;
  /** Link address. Leave it out to use onClick instead, or for the current page. */
  href?: string;
  /** Called when the item is clicked, for apps with their own router. */
  onClick?: () => void;
}

export interface Breadcrumb3DProps {
  /** The trail, from the root to the current page. */
  items: BreadcrumbItem[];
  /** Collapse the middle when the trail is longer than this. Use 0 to never collapse. */
  maxItems?: number;
  /** Accessible name of the navigation. */
  "aria-label"?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

const chip =
  "rounded-lg border border-depth-border bg-depth-surface px-2.5 py-1 text-sm outline-none transition-[transform,color] shadow-[0_2px_0_var(--depth-border)] hover:-translate-y-px hover:text-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent";

export function Breadcrumb3D({ items, maxItems = 4, "aria-label": ariaLabel = "Breadcrumb", className }: Breadcrumb3DProps) {
  const [expanded, setExpanded] = useState(false);
  const collapse = maxItems > 0 && items.length > maxItems && !expanded;
  const shown: (BreadcrumbItem | "more")[] = collapse ? [items[0], "more", ...items.slice(items.length - (maxItems - 2))] : items;

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {shown.map((it, i) => {
          const last = i === shown.length - 1;
          return (
            <li key={it === "more" ? "more" : it.id} className="flex items-center gap-1.5">
              {it === "more" ? (
                <button type="button" aria-label={`Show ${items.length - maxItems + 1} hidden levels`} onClick={() => setExpanded(true)} className={chip}>…</button>
              ) : last ? (
                <span aria-current="page" className="rounded-lg bg-depth-elevated px-2.5 py-1 text-sm font-medium">{it.label}</span>
              ) : it.href ? (
                <a href={it.href} onClick={it.onClick} className={cn(chip, "text-depth-muted")}>{it.label}</a>
              ) : (
                <button type="button" onClick={it.onClick} className={cn(chip, "text-depth-muted")}>{it.label}</button>
              )}
              {!last && (
                <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 text-depth-muted">
                  <path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
