import { useState, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * FillButton — a colour fill sweeps in from whichever side your pointer
 * entered, and leaves through the side you exit by.
 */
export type FillButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type Side = "left" | "right";

export function FillButton({ className, children, ...props }: FillButtonProps) {
  const [side, setSide] = useState<Side>("left");

  const pick = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    setSide(e.clientX - r.left < r.width / 2 ? "left" : "right");
  };

  return (
    <button
      type="button"
      onPointerEnter={pick}
      onPointerLeave={pick}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-depth-text bg-transparent px-7 py-3.5 font-medium text-depth-text outline-none transition-colors duration-300 hover:text-depth-bg focus-visible:text-depth-bg",
        "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 scale-x-0 bg-depth-text transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        style={{ transformOrigin: side }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}
