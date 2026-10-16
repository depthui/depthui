import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * RollButton — on hover each letter rolls up and a second copy rolls into
 * place, one letter after another. Pass the label as a plain string.
 */
export interface RollButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: string;
  /** Delay between letters in ms. */
  stagger?: number;
}

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function RollButton({
  children,
  stagger = 18,
  className,
  ...props
}: RollButtonProps) {
  const chars = Array.from(children);
  const letter = (c: string) => (c === " " ? " " : c);

  return (
    <button
      type="button"
      aria-label={children}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-xl bg-depth-accent px-7 py-3.5 font-medium text-white outline-none transition-transform duration-150 active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="relative block overflow-hidden">
        <span className="flex">
          {chars.map((c, i) => (
            <span
              key={i}
              className={cn(
                "inline-block transition-transform duration-300 group-hover:-translate-y-full group-focus-visible:-translate-y-full",
                EASE,
              )}
              style={{ transitionDelay: `${i * stagger}ms` }}
            >
              {letter(c)}
            </span>
          ))}
        </span>
        <span className="absolute inset-0 flex">
          {chars.map((c, i) => (
            <span
              key={i}
              className={cn(
                "inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0",
                EASE,
              )}
              style={{ transitionDelay: `${i * stagger}ms` }}
            >
              {letter(c)}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}
