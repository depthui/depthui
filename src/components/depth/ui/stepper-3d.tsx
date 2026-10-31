import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Stepper3D — a row of numbered steps with a connecting bar that fills as you
 * move on. Finished steps show a tick, the current one is raised and ringed.
 * Pass `onStepClick` to let people jump back to finished steps. Uses
 * `aria-current="step"` on the current one.
 */
export interface StepperStep {
  label: ReactNode;
  description?: ReactNode;
}

export interface Stepper3DProps {
  /** Steps to show, in order. */
  steps: StepperStep[];
  /** Zero-based index of the current step. */
  current: number;
  /** Called with the step index when a step is clicked. */
  onStepClick?: (index: number) => void;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Stepper3D({ steps, current, onStepClick, className }: Stepper3DProps) {
  const reduced = !!useReducedMotion();
  const t = reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" as const };
  return (
    <ol className={cn("flex w-full items-start", className)}>
      {steps.map((s, i) => {
        const done = i < current;
        const here = i === current;
        const clickable = !!onStepClick && done;
        const Dot = clickable ? "button" : "div";
        return (
          <Fragment key={i}>
            <li className="flex min-w-0 flex-col items-center gap-2 text-center" aria-current={here ? "step" : undefined}>
              <Dot
                {...(clickable ? { type: "button" as const, onClick: () => onStepClick?.(i), "aria-label": `Go back to step ${i + 1}` } : {})}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold outline-none transition-all duration-300",
                  "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg",
                  done && "border-transparent bg-gradient-to-b from-depth-accent to-depth-accent-2 text-white shadow-[0_3px_0_rgb(0_0_0/0.25)]",
                  here && "-translate-y-0.5 border-depth-accent bg-depth-surface text-depth-accent shadow-[0_4px_0_var(--depth-border),0_0_0_4px_rgb(124_58_237/0.18)]",
                  !done && !here && "border-depth-border bg-depth-elevated text-depth-muted",
                  clickable && "cursor-pointer hover:-translate-y-0.5",
                )}
              >
                {done ? (
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </Dot>
              <div className="px-1">
                <div className={cn("text-xs font-medium sm:text-sm", here ? "text-depth-text" : "text-depth-muted")}>{s.label}</div>
                {s.description && <div className="mt-0.5 hidden text-xs text-depth-muted sm:block">{s.description}</div>}
              </div>
            </li>
            {i < steps.length - 1 && (
              <li aria-hidden className="mt-[17px] h-1 min-w-4 flex-1 overflow-hidden rounded-full bg-depth-border">
                <motion.div className="h-full origin-left bg-gradient-to-r from-depth-accent to-depth-accent-2" initial={false} animate={{ scaleX: done ? 1 : 0 }} transition={t} />
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
