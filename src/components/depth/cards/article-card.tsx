import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * ArticleCard — a blog or content card. The cover zooms and an arrow slides
 * in on hover. Renders as a link. Pass `cover` to use your own image.
 */
export interface ArticleCardProps {
  /** Article headline. */
  title: string;
  /** Short summary shown under the title. */
  excerpt?: string;
  /** Category label shown over the cover. */
  category?: string;
  /** Author name shown in the footer. */
  author?: string;
  /** Publish date as display text. It is shown as given. */
  date?: string;
  /** Reading time as display text, such as "5 min read". */
  readTime?: string;
  /** URL the card links to. */
  href?: string;
  /** Replaces the built-in gradient cover. Should fill its box. */
  cover?: ReactNode;
  /** Picks the gradient when no cover is given. */
  tone?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

const TONES = [
  "from-violet-500 via-fuchsia-500 to-pink-400",
  "from-cyan-400 via-sky-500 to-indigo-500",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-emerald-400 via-teal-500 to-cyan-500",
  "from-pink-400 via-rose-500 to-red-500",
];

export function ArticleCard({
  title,
  excerpt,
  category,
  author,
  date,
  readTime,
  href = "#",
  cover,
  tone = 0,
  className,
}: ArticleCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-depth-border bg-depth-surface text-left shadow-[0_18px_40px_-30px_var(--depth-shadow)] outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-depth-accent",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110 group-focus-visible:scale-110">
          {cover ?? (
            <div className={cn("relative h-full w-full bg-gradient-to-br", TONES[Math.abs(tone) % TONES.length])}>
              <span aria-hidden className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/20" />
              <span aria-hidden className="absolute bottom-3 left-6 h-16 w-16 rotate-12 rounded-2xl bg-white/20" />
              <span aria-hidden className="absolute bottom-10 right-16 h-8 w-8 rounded-full border-2 border-white/40" />
            </div>
          )}
        </div>
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-depth-surface/90 px-2.5 py-1 text-[11px] font-semibold text-depth-text backdrop-blur">
            {category}
          </span>
        )}
        <span
          aria-hidden
          className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-depth-surface text-depth-text opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M8 7h9v9" />
          </svg>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug tracking-tight">{title}</h3>
        {excerpt && <p className="mt-2 line-clamp-2 text-sm text-depth-muted">{excerpt}</p>}
        {(author || date || readTime) && (
          <div className="mt-auto flex items-center gap-3 pt-5 text-xs text-depth-muted">
            {author && (
              <span className="flex items-center gap-2">
                <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full bg-depth-accent/15 text-[10px] font-semibold text-depth-accent">
                  {author.charAt(0)}
                </span>
                <span className="text-depth-text">{author}</span>
              </span>
            )}
            <span>{[date, readTime].filter(Boolean).join(" · ")}</span>
          </div>
        )}
      </div>
    </a>
  );
}
