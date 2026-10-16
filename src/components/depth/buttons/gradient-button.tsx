import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * GradientButton — a gradient that keeps flowing sideways. The gradient is
 * twice as wide as the button and loops by translating exactly half its
 * width, so it only animates `transform`. Needs depth-motion.css.
 */
export type GradientButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

// Stops are darkened a little so white text stays readable in both themes.
const dark = (v: string) => `color-mix(in oklab, ${v} 72%, black)`;
const A = dark("var(--depth-accent)");
const B = dark("var(--depth-accent-3)");
const C = dark("var(--depth-accent-2)");

export function GradientButton({ className, children, ...props }: GradientButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-xl px-7 py-3.5 font-semibold text-white outline-none transition-transform duration-150 active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="depth-gradient-x absolute inset-y-0 left-0 -z-10 w-[200%]"
        style={{ background: `linear-gradient(90deg, ${A}, ${B}, ${C}, ${A}, ${B}, ${C}, ${A})` }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}
