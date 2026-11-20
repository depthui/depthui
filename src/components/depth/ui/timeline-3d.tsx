import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Timeline3D — a vertical timeline. Events fade and rise into view as you
 * scroll, and the line between them draws itself. Rendered as an ordered list.
 */
export interface TimelineEvent {
  /** Unique id of the event. */
  id: string;
  /** Short heading. */
  title: ReactNode;
  /** Date or label shown beside the heading, such as "Mar 2026". */
  time?: ReactNode;
  /** Longer text under the heading. */
  description?: ReactNode;
  /** Icon or emoji shown in the marker. Defaults to a dot. */
  icon?: ReactNode;
  /** "done" fills the marker, "current" pulses it, "upcoming" leaves it hollow. */
  status?: "done" | "current" | "upcoming";
}

export interface Timeline3DProps {
  /** The events, in order from first to last. */
  events: TimelineEvent[];
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Timeline3D({ events, className }: Timeline3DProps) {
  const reduced = !!useReducedMotion();
  return (
    <ol className={cn("relative w-full", className)}>
      {events.map((e, i) => {
        const status = e.status ?? "done";
        const last = i === events.length - 1;
        return (
          <motion.li
            key={e.id}
            aria-current={status === "current" ? "step" : undefined}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: reduced ? 0 : 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {!last && (
              <motion.span
                aria-hidden
                initial={reduced ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{ transformOrigin: "top" }}
                className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 bg-depth-border"
              />
            )}
            <span
              aria-hidden
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs",
                status === "done" && "border-depth-accent bg-depth-accent text-white shadow-[0_3px_0_rgb(0_0_0/0.25),0_6px_12px_rgb(0_0_0/0.15)]",
                status === "current" && "border-depth-accent bg-depth-surface text-depth-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--depth-accent)_25%,transparent)]",
                status === "upcoming" && "border-depth-border bg-depth-elevated text-depth-muted",
              )}
            >
              {e.icon ?? <span className={cn("h-2 w-2 rounded-full", status === "upcoming" ? "bg-depth-border" : "bg-current")} />}
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-sm font-semibold">{e.title}</h3>
                {e.time && <span className="font-mono text-xs text-depth-muted">{e.time}</span>}
              </div>
              {e.description && <p className="mt-1 text-sm leading-relaxed text-depth-muted">{e.description}</p>}
              <span className="sr-only">{status === "done" ? "Completed" : status === "current" ? "In progress" : "Upcoming"}</span>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
