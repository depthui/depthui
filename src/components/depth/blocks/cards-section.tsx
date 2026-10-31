import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArticleCard, type ArticleCardProps } from "../cards/article-card";
import { cn } from "@/lib/utils";

/**
 * CardsSection — a filterable grid of cards. Pick a category and the cards
 * that do not match fade out while the rest glide into their new places.
 * Needs cards/article-card.
 */
export interface CardsSectionItem extends ArticleCardProps {
  id: string;
  /** Used for the filter chips. */
  category: string;
}

export interface CardsSectionProps {
  /** Cards to show. Each needs an id and a category used for the filter chips. */
  items: CardsSectionItem[];
  /** Label of the chip that shows every category. */
  allLabel?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function CardsSection({ items, allLabel = "All", className }: CardsSectionProps) {
  const uid = useId();
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState<string>(allLabel);

  const categories = useMemo(
    () => [allLabel, ...Array.from(new Set(items.map((i) => i.category)))],
    [items, allLabel],
  );
  const visible = active === allLabel ? items : items.filter((i) => i.category === active);

  return (
    <div className={className}>
      <div
        role="group"
        aria-label="Filter by category"
        className="mb-8 flex flex-wrap justify-center gap-2"
      >
        {categories.map((c) => {
          const on = c === active;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(c)}
              className={cn(
                "relative rounded-full border border-depth-border px-4 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent",
                on ? "border-transparent text-white" : "bg-depth-surface text-depth-muted hover:text-depth-text",
              )}
            >
              {on && (
                <motion.span
                  layoutId={`${uid}-chip`}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-depth-accent"
                />
              )}
              <span className="relative">{c}</span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map(({ id, ...card }) => (
            <motion.div
              key={id}
              layout={!reduced}
              initial={{ opacity: 0, scale: reduced ? 1 : 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.92 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
              className="flex"
            >
              <ArticleCard {...card} className={cn("w-full", card.className)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
