import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * ArrowButton — a pill with an arrow chip. On hover the chip's colour grows
 * until it floods the whole button, and the arrow nudges forward.
 */
export type ArrowButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ArrowButton({ className, children, ...props }: ArrowButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-depth-border bg-depth-surface py-2 pl-6 pr-2 font-medium text-depth-text outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-depth-accent transition-transform duration-500 ease-out group-hover:scale-[14] group-focus-visible:scale-[14]"
      />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
        {children}
      </span>
      <span className="relative z-10 flex h-9 w-9 items-center justify-center text-white">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  );
}
