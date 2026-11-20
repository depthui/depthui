import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Avatar3D — a raised avatar that shows a photo, or initials when there is no
 * photo or it fails to load. An optional status dot shows presence. The status
 * is also written in hidden text so screen readers hear it. For a row of
 * overlapping avatars use AvatarStack.
 */
export interface Avatar3DProps {
  /** Image address. If it is missing or fails, initials are shown. */
  src?: string;
  /** Full name. Used for the initials, the colour and the accessible name. */
  name: string;
  /** Size of the avatar. */
  size?: "sm" | "md" | "lg" | "xl";
  /** Circle or rounded square. */
  shape?: "circle" | "square";
  /** Presence dot shown at the bottom right. */
  status?: "online" | "away" | "busy" | "offline";
  /** Extra classes added to the outer element. */
  className?: string;
}

const SIZES = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg", xl: "h-20 w-20 text-2xl" } as const;
const DOT = { sm: "h-2.5 w-2.5", md: "h-3 w-3", lg: "h-3.5 w-3.5", xl: "h-4 w-4" } as const;
const STATUS = { online: "bg-emerald-500", away: "bg-amber-500", busy: "bg-red-500", offline: "bg-slate-400" } as const;
const HUES = [262, 200, 150, 28, 330, 12, 180, 45];

function initials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "?";
  return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase();
}

export function Avatar3D({ src, name, size = "md", shape = "circle", status, className }: Avatar3DProps) {
  const [failed, setFailed] = useState(false);
  const hue = HUES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];
  const round = shape === "circle" ? "rounded-full" : "rounded-xl";
  return (
    <span role="img" aria-label={status ? `${name}, ${status}` : name} className={cn("relative inline-flex shrink-0", SIZES[size], className)}>
      <span
        className={cn("flex h-full w-full items-center justify-center overflow-hidden border-2 border-depth-surface font-semibold text-white shadow-[0_3px_0_rgb(0_0_0/0.18),0_8px_14px_rgb(0_0_0/0.18)]", round)}
        style={{ backgroundImage: `linear-gradient(135deg, hsl(${hue} 75% 58%), hsl(${(hue + 40) % 360} 70% 42%))` }}
      >
        {src && !failed ? (
          <img src={src} alt="" draggable={false} onError={() => setFailed(true)} className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden>{initials(name)}</span>
        )}
      </span>
      {status && <span aria-hidden className={cn("absolute bottom-0 right-0 rounded-full border-2 border-depth-surface", DOT[size], STATUS[status], shape === "square" && "-bottom-0.5 -right-0.5")} />}
    </span>
  );
}
