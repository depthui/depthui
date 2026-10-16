import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * GitHubStarButton — a "Star on GitHub" pill with a live star count.
 * It is a plain link to the repo, so it works with no JavaScript. The count
 * is fetched once per browser session from the public GitHub API and cached;
 * if the request fails or is rate limited the button simply shows no count.
 */
export interface GitHubStarButtonProps {
  /** "owner/name", e.g. "depthui/depthui". */
  repo: string;
  /** Hide the count and show only the label. */
  showCount?: boolean;
  label?: string;
  className?: string;
}

function format(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k` : String(n);
}

function useStars(repo: string, enabled: boolean) {
  const key = `depth-stars:${repo}`;
  const [stars, setStars] = useState<number | null>(() => {
    try {
      const v = sessionStorage.getItem(key);
      return v ? Number(v) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!enabled || stars !== null) return;
    const ctrl = new AbortController();
    fetch(`https://api.github.com/repos/${repo}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { stargazers_count?: number }) => {
        if (typeof d.stargazers_count !== "number") return;
        setStars(d.stargazers_count);
        try {
          sessionStorage.setItem(key, String(d.stargazers_count));
        } catch {
          /* storage unavailable: fine */
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [repo, enabled, stars, key]);

  return stars;
}

export function GitHubStarButton({
  repo,
  showCount = true,
  label = "Star",
  className,
}: GitHubStarButtonProps) {
  const stars = useStars(repo, showCount);

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} ${repo} on GitHub${stars !== null ? `, ${stars} stars` : ""}`}
      className={cn(
        "group inline-flex h-9 items-center overflow-hidden rounded-full border border-depth-border bg-depth-surface text-sm font-medium text-depth-text outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent",
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 pl-3 pr-3">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
        {label}
      </span>
      {showCount && stars !== null && (
        <span className="inline-flex h-full items-center gap-1 border-l border-depth-border bg-depth-elevated px-2.5 font-mono text-xs">
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="currentColor"
            className="text-amber-400 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-125"
            aria-hidden
          >
            <path d="m12 2.5 2.93 5.94 6.57.95-4.75 4.63 1.12 6.54L12 17.47l-5.87 3.09 1.12-6.54L2.5 9.39l6.57-.95L12 2.5Z" />
          </svg>
          {format(stars)}
        </span>
      )}
    </a>
  );
}
