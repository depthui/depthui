import { useState } from "react";
import { TiltCard, TiltLayer } from "../tilt-card";
import { cn } from "@/lib/utils";

/**
 * ProfileCard — a person card that tilts toward the pointer. The avatar,
 * name, stats and button all sit at different depths.
 */
export interface ProfileStat {
  label: string;
  value: string;
}

export interface ProfileCardProps {
  /** Person's display name. */
  name: string;
  /** Job title or short description under the name. */
  role: string;
  /** Username shown next to the name, e.g. "@akram". */
  handle?: string;
  /** Short paragraph about the person. */
  bio?: string;
  /** Shown in the avatar. Defaults to the initials of `name`. */
  initials?: string;
  /** Label and value pairs shown in a row, such as followers. */
  stats?: ProfileStat[];
  /** Called with true or false when the follow button is toggled. */
  onFollowChange?: (following: boolean) => void;
  /** Extra classes added to the outer element. */
  className?: string;
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function ProfileCard({
  name,
  role,
  handle,
  bio,
  initials,
  stats,
  onFollowChange,
  className,
}: ProfileCardProps) {
  const [following, setFollowing] = useState(false);

  return (
    <TiltCard max={9} className={cn("w-72 p-0", className)}>
      <div className="h-24 rounded-t-2xl bg-gradient-to-br from-depth-accent via-depth-accent-3 to-depth-accent-2 opacity-90" />

      <div className="px-6 pb-6">
        <TiltLayer z={70} className="-mt-10 w-fit">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-depth-surface bg-gradient-to-br from-depth-accent to-depth-accent-2 text-2xl font-bold text-white shadow-xl">
            {initials ?? initialsOf(name)}
          </span>
        </TiltLayer>

        <TiltLayer z={40} className="mt-3">
          <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
          <p className="text-sm text-depth-muted">
            {handle && <span className="text-depth-accent">@{handle}</span>}
            {handle && " · "}
            {role}
          </p>
        </TiltLayer>

        {bio && (
          <TiltLayer z={25} className="mt-3">
            <p className="text-sm leading-relaxed text-depth-muted">{bio}</p>
          </TiltLayer>
        )}

        {stats && stats.length > 0 && (
          <TiltLayer z={30} className="mt-5">
            <dl
              className="grid gap-2 border-y border-depth-border py-3 text-center"
              style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <dd className="font-semibold">{s.value}</dd>
                  <dt className="text-xs text-depth-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </TiltLayer>
        )}

        <TiltLayer z={55} className="mt-5">
          <button
            type="button"
            aria-pressed={following}
            onClick={() => {
              setFollowing((f) => {
                onFollowChange?.(!f);
                return !f;
              });
            }}
            className={cn(
              "w-full rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-surface",
              following
                ? "border border-depth-border bg-depth-elevated text-depth-text"
                : "bg-depth-accent text-white hover:opacity-90",
            )}
          >
            {following ? "Following" : "Follow"}
          </button>
        </TiltLayer>
      </div>
    </TiltCard>
  );
}
