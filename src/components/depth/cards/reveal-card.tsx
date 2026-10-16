import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * RevealCard — a full-bleed card showing only its title. On hover, keyboard
 * focus or tap, a panel slides up with the details. Only `transform` moves.
 */
export interface RevealCardProps {
  title: string;
  eyebrow?: string;
  /** The details shown when the panel opens. */
  children?: ReactNode;
  /** Full-bleed background. Defaults to a gradient. */
  background?: ReactNode;
  className?: string;
}

export function RevealCard({
  title,
  eyebrow,
  children,
  background,
  className,
}: RevealCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <article
      tabIndex={0}
      data-open={open}
      aria-expanded={open}
      onPointerUp={(e) => e.pointerType === "touch" && setOpen((o) => !o)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((o) => !o);
        }
      }}
      className={cn(
        "group relative h-72 w-64 cursor-pointer overflow-hidden rounded-2xl border border-depth-border bg-depth-surface outline-none",
        "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110 group-focus-visible:scale-110 group-data-[open=true]:scale-110",
        )}
      >
        {background ?? (
          <div className="h-full w-full bg-gradient-to-br from-depth-accent via-depth-accent-3 to-depth-accent-2">
            <span aria-hidden className="absolute -left-8 top-6 h-36 w-36 rounded-full bg-white/20" />
            <span aria-hidden className="absolute right-6 top-24 h-20 w-20 rotate-12 rounded-3xl bg-white/20" />
          </div>
        )}
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 translate-y-[calc(100%-4.5rem)] rounded-t-2xl border-t border-depth-border bg-depth-surface/95 p-4 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:translate-y-0 group-focus-visible:translate-y-0 group-data-[open=true]:translate-y-0",
        )}
      >
        <div className="flex h-10 flex-col justify-center">
          {eyebrow && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-depth-accent">{eyebrow}</span>
          )}
          <h3 className="text-lg font-semibold leading-tight tracking-tight">{title}</h3>
        </div>
        <div className="mt-3 text-sm text-depth-muted">{children}</div>
      </div>
    </article>
  );
}
