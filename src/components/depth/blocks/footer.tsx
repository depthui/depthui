import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Footer — brand blurb, link columns, socials, newsletter signup and a large
 * faded wordmark. Collapses to two columns on phones.
 */
export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterSocial {
  label: string;
  href: string;
  icon: ReactNode;
}

export interface FooterProps {
  brand: ReactNode;
  description?: string;
  columns: FooterColumn[];
  socials?: FooterSocial[];
  /** Show the email signup form. */
  newsletter?: boolean;
  onSubscribe?: (email: string) => void;
  /** Left side of the bottom bar, e.g. a copyright line. */
  bottom?: ReactNode;
  /** Big decorative word under everything. */
  wordmark?: string;
  className?: string;
}

export function Footer({
  brand,
  description,
  columns,
  socials,
  newsletter = true,
  onSubscribe,
  bottom,
  wordmark,
  className,
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    onSubscribe?.(email.trim());
    setDone(true);
  }

  return (
    <footer className={cn("relative overflow-hidden border-t border-depth-border bg-depth-surface/60", className)}>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="text-lg font-semibold">{brand}</div>
            {description && (
              <p className="mt-3 max-w-xs text-sm text-depth-muted">{description}</p>
            )}

            {newsletter && (
              <form onSubmit={submit} className="mt-6 max-w-sm">
                <label htmlFor="depth-footer-email" className="text-sm font-medium">
                  Get product updates
                </label>
                {done ? (
                  <p role="status" className="mt-2 rounded-xl border border-depth-border bg-depth-elevated px-4 py-2.5 text-sm text-depth-accent">
                    Thanks, you are on the list.
                  </p>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <input
                      id="depth-footer-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="min-w-0 flex-1 rounded-xl border border-depth-border bg-depth-bg px-3 py-2.5 text-sm text-depth-text outline-none placeholder:text-depth-muted focus:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent/40"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-xl bg-depth-accent px-4 py-2.5 text-sm font-medium text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg"
                    >
                      Subscribe
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-depth-muted">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-depth-text/80 outline-none transition-colors hover:text-depth-accent focus-visible:text-depth-accent focus-visible:underline"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-depth-border py-6 text-sm text-depth-muted sm:flex-row sm:items-center">
          <div>{bottom}</div>
          {socials && (
            <ul className="flex items-center gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-depth-border text-depth-text outline-none transition-colors hover:border-depth-accent hover:text-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent [&>svg]:h-4 [&>svg]:w-4"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {wordmark && (
        <div
          aria-hidden
          className="pointer-events-none -mb-[0.12em] select-none overflow-hidden text-center text-[22vw] font-bold leading-[0.8] tracking-tighter sm:text-[9rem]"
        >
          <span className="bg-gradient-to-b from-depth-text/25 to-transparent bg-clip-text text-transparent">
            {wordmark}
          </span>
        </div>
      )}
    </footer>
  );
}
