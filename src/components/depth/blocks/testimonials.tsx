import { cn } from "@/lib/utils";
import { Marquee } from "./marquee";

/**
 * TestimonialWall — two rows of quote cards drifting in opposite directions.
 * Built on Marquee, so it is CSS only and pauses on hover.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const GRADIENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-400 to-sky-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-pink-400 to-rose-500",
];

export function TestimonialCard({
  quote,
  name,
  role,
  index = 0,
  className,
}: Testimonial & { index?: number; className?: string }) {
  return (
    <figure
      className={cn(
        "flex w-72 flex-col justify-between rounded-2xl border border-depth-border bg-depth-surface p-5 shadow-[0_18px_40px_-26px_var(--depth-shadow)] transition-transform duration-300 hover:-translate-y-1 sm:w-80",
        className,
      )}
    >
      <blockquote className="text-sm leading-relaxed text-depth-text/90">“{quote}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white",
            GRADIENTS[index % GRADIENTS.length],
          )}
        >
          {name.charAt(0)}
        </span>
        <span>
          <span className="block text-sm font-medium">{name}</span>
          <span className="block text-xs text-depth-muted">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export interface TestimonialWallProps {
  items: Testimonial[];
  /** Seconds per loop for the first row; the second row is a little slower. */
  duration?: number;
  className?: string;
}

export function TestimonialWall({ items, duration = 50, className }: TestimonialWallProps) {
  const rowA = items.filter((_, i) => i % 2 === 0);
  const rowB = items.filter((_, i) => i % 2 === 1);
  const card = (t: Testimonial, i: number) => <TestimonialCard key={t.name} {...t} index={i} />;

  return (
    <div className={cn("flex flex-col", className)}>
      <Marquee items={rowA.map(card)} duration={duration} repeat={2} className="py-4" />
      <Marquee items={rowB.map((t, i) => card(t, i + 2))} duration={duration * 1.15} reverse repeat={2} className="py-4" />
    </div>
  );
}
