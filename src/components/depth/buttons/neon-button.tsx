import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * NeonButton — a glowing outline that floods with colour on hover. The glow
 * is a blurred layer whose opacity changes, so it never repaints a shadow.
 */
export interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: "violet" | "cyan" | "pink";
}

const TONES = {
  violet: "[--neon:var(--depth-accent)]",
  cyan: "[--neon:var(--depth-accent-2)]",
  pink: "[--neon:var(--depth-accent-3)]",
} as const;

export function NeonButton({
  tone = "violet",
  className,
  children,
  ...props
}: NeonButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "group relative isolate inline-flex items-center justify-center rounded-xl border border-[var(--neon)] bg-depth-surface px-7 py-3.5 font-medium text-[var(--neon)] outline-none transition-[color,transform] duration-300 hover:text-white active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-[var(--neon)] focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:pointer-events-none disabled:opacity-50",
        TONES[tone],
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute -inset-1.5 -z-10 rounded-2xl bg-[var(--neon)] opacity-25 blur-lg transition-opacity duration-300 group-hover:opacity-70"
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-xl bg-[var(--neon)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span className="relative">{children}</span>
    </button>
  );
}
