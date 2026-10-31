import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Turntable3D — a record player seen from above at an angle. The vinyl spins
 * on a CSS animation (transform only, paused when stopped) and the tonearm
 * swings onto the record when you press play. Needs depth-motion.css.
 */
export interface Turntable3DProps {
  /** Track title shown under the record. */
  title?: string;
  /** Artist name shown under the title. */
  artist?: string;
  /** Controlled playing state. */
  playing?: boolean;
  /** Called with the new playing state when playback starts or stops. */
  onPlayingChange?: (playing: boolean) => void;
  /** Width in px. */
  size?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Turntable3D({
  title = "Midnight Depth",
  artist = "The Perspectives",
  playing: playingProp,
  onPlayingChange,
  size = 320,
  className,
}: Turntable3DProps) {
  const reduced = !!useReducedMotion();
  const [inner, setInner] = useState(false);
  const playing = playingProp ?? inner;
  const toggle = () => {
    if (playingProp === undefined) setInner(!playing);
    onPlayingChange?.(!playing);
  };
  const platter = size * 0.72;

  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <div style={{ width: size, height: size * 0.78, perspective: 1100 }}>
        <div
          className="relative"
          style={{
            width: size,
            height: size * 0.9,
            transformStyle: "preserve-3d",
            transform: "rotateX(48deg) translateY(-6%)",
          }}
        >
          {/* plinth */}
          <div
            className="absolute inset-0 rounded-[1.4rem] border border-depth-border bg-gradient-to-br from-depth-elevated to-depth-border shadow-[0_30px_40px_-20px_var(--depth-shadow)]"
            style={{ transform: "translateZ(0)" }}
          />
          {/* platter + record */}
          <div
            aria-hidden
            className="absolute rounded-full bg-neutral-800 shadow-xl"
            style={{ width: platter, height: platter, left: size * 0.06, top: size * 0.09, transform: "translateZ(6px)" }}
          >
            <div
              className="depth-spin absolute inset-[4%] rounded-full"
              style={
                {
                  "--depth-orbit-duration": "2.2s",
                  animationPlayState: playing && !reduced ? "running" : "paused",
                  background:
                    "repeating-radial-gradient(circle, #15131f 0 2px, #231f33 2px 3px), conic-gradient(from 20deg, transparent 0 30%, rgba(255,255,255,.18) 38%, transparent 46% 80%, rgba(255,255,255,.14) 88%, transparent)",
                  backgroundBlendMode: "screen",
                } as React.CSSProperties
              }
            >
              <div className="absolute inset-[32%] flex items-center justify-center rounded-full bg-gradient-to-br from-depth-accent to-depth-accent-3">
                <span className="h-2 w-2 rounded-full bg-depth-bg" />
              </div>
            </div>
          </div>
          {/* tonearm */}
          <motion.div
            aria-hidden
            className="absolute"
            animate={{ rotate: playing ? 24 : -8 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 12 }}
            style={{
              right: size * 0.07,
              top: size * 0.08,
              width: 14,
              height: size * 0.56,
              transformOrigin: "50% 8px",
              transform: "translateZ(18px)",
            }}
          >
            <span className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full border border-depth-border bg-depth-surface shadow" />
            <span className="absolute left-1/2 top-3 h-[88%] w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-depth-text/80 to-depth-text/50" />
            <span className="absolute bottom-0 left-1/2 h-6 w-4 -translate-x-1/2 rounded-sm bg-depth-text" />
          </motion.div>
        </div>
      </div>

      <div className="text-center">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-depth-muted">{artist}</p>
      </div>
      <button
        type="button"
        aria-pressed={playing}
        onClick={toggle}
        className="inline-flex items-center gap-2 rounded-full border border-depth-border bg-depth-surface px-5 py-2 text-sm font-medium outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden><path d="M7 4l13 8-13 8z" /></svg>
        )}
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
