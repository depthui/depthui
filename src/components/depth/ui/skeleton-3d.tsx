import { cn } from "@/lib/utils";

/**
 * Skeleton3D — a loading placeholder with a soft sheen that sweeps across.
 * Use `lines` for a block of text, or set a size and `circle` for an avatar.
 * The sweep is one transform animation, and it stops for people who prefer
 * reduced motion. Hidden from screen readers; mark the loading region with
 * `aria-busy` on its parent.
 */
export interface Skeleton3DProps {
  /** Number of text lines. The last one is shorter. */
  lines?: number;
  /** Render a round placeholder instead of lines, for avatars. */
  circle?: boolean;
  /** Extra classes added to the outer element. */
  className?: string;
}

function Bar({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative block overflow-hidden rounded-md bg-depth-border/70", className)}>
      <span className="depth-skeleton absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent dark:via-white/10" />
    </span>
  );
}

export function Skeleton3D({ lines, circle, className }: Skeleton3DProps) {
  if (lines && lines > 0) {
    return (
      <div aria-hidden className={cn("flex w-full flex-col gap-2.5", className)}>
        {Array.from({ length: lines }, (_, i) => (
          <Bar key={i} className={cn("h-3.5", i === lines - 1 && lines > 1 ? "w-3/5" : "w-full")} />
        ))}
      </div>
    );
  }
  return <Bar className={cn("h-4 w-full", circle && "aspect-square h-auto w-12 rounded-full", className)} />;
}
