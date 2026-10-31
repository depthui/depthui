import { cn } from "@/lib/utils";

/**
 * AvatarStack — overlapping avatars. Hover or focus one and it lifts out of
 * the pile. Falls back to a gradient with initials when there is no image,
 * and collapses extra people into a "+N" chip.
 */
export interface AvatarPerson {
  name: string;
  src?: string;
}

export interface AvatarStackProps {
  /** People to show, each with a name and optional image src. */
  people: AvatarPerson[];
  /** Most avatars shown before "+N". */
  max?: number;
  /** Avatar diameter in px. */
  size?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

const GRADS = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-400 to-sky-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-pink-400 to-rose-500",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function AvatarStack({ people, max = 4, size = 44, className }: AvatarStackProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  const ring = "ring-2 ring-depth-bg";

  return (
    <ul
      aria-label={`${people.length} people: ${people.map((p) => p.name).join(", ")}`}
      className={cn("flex items-center", className)}
    >
      {shown.map((p, i) => (
        <li
          key={p.name}
          className="-ml-2 first:ml-0 transition-transform duration-200 ease-out hover:z-10 hover:-translate-y-2 hover:scale-110 focus-within:z-10 focus-within:-translate-y-2 focus-within:scale-110"
          style={{ width: size, height: size }}
        >
          <span
            tabIndex={0}
            title={p.name}
            className={cn(
              "flex h-full w-full items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white outline-none focus-visible:ring-depth-accent",
              ring,
              !p.src && "bg-gradient-to-br",
              !p.src && GRADS[i % GRADS.length],
            )}
          >
            {p.src ? (
              <img src={p.src} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <span aria-label={p.name}>{initials(p.name)}</span>
            )}
          </span>
        </li>
      ))}
      {extra > 0 && (
        <li
          className={cn(
            "-ml-2 flex items-center justify-center rounded-full bg-depth-elevated text-xs font-semibold text-depth-text",
            ring,
          )}
          style={{ width: size, height: size }}
          aria-hidden
        >
          +{extra}
        </li>
      )}
    </ul>
  );
}
