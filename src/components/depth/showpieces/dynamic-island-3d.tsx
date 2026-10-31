import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * DynamicIsland3D — a pill that morphs between states, in the spirit of the
 * iPhone's Dynamic Island. Size and corner radius ride one spring, and the
 * content blurs and scales between states, so every change feels like one
 * continuous movement. It also tilts a little with your pointer.
 *
 * The size animates width and height, which relayouts: that is fine for one
 * small element, and it is what gives the pill its true morph.
 */
export type IslandMode = "idle" | "call" | "timer" | "music";

export interface DynamicIsland3DProps {
  /** Current mode when controlled: "idle", "call", "timer" or "music". */
  mode?: IslandMode;
  /** Starting mode when uncontrolled. */
  defaultMode?: IslandMode;
  /** Called with the new mode whenever it changes. */
  onModeChange?: (mode: IslandMode) => void;
  /** Show the built-in mode switcher below the pill. */
  controls?: boolean;
  /** Extra classes added to the outer element. */
  className?: string;
}

const SIZE: Record<IslandMode, { w: number; h: number; r: number }> = {
  idle: { w: 124, h: 36, r: 18 },
  call: { w: 320, h: 76, r: 38 },
  timer: { w: 240, h: 64, r: 32 },
  music: { w: 340, h: 98, r: 34 },
};
const MODES: IslandMode[] = ["idle", "call", "timer", "music"];

function Timer() {
  const [s, setS] = useState(252);
  useEffect(() => {
    const id = window.setInterval(() => setS((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <div className="flex h-full items-center justify-between px-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-black" aria-hidden>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="13" r="7" /><path d="M12 9v4l2 2M9 3h6" /></svg>
      </span>
      <span className="font-mono text-2xl font-semibold tabular-nums text-amber-400">{mm}:{ss}</span>
    </div>
  );
}

function Equalizer({ reduced }: { reduced: boolean }) {
  return (
    <span className="flex h-6 items-end gap-[3px]" aria-hidden>
      {[0.9, 0.5, 1, 0.65].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] origin-bottom rounded-full bg-emerald-400"
          style={{ height: "100%" }}
          animate={reduced ? { scaleY: h } : { scaleY: [h * 0.4, 1, h * 0.5, h] }}
          transition={{ duration: 0.9 + i * 0.17, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export function DynamicIsland3D({ mode: modeProp, defaultMode = "idle", onModeChange, controls = true, className }: DynamicIsland3DProps) {
  const reduced = !!useReducedMotion();
  const [inner, setInner] = useState<IslandMode>(defaultMode);
  const mode = modeProp ?? inner;
  const set = (m: IslandMode) => {
    if (modeProp === undefined) setInner(m);
    onModeChange?.(m);
  };
  const { ref, rotateX, rotateY, handlers } = useTilt({ max: 7 });
  const s = SIZE[mode];

  const body = {
    idle: <span className="flex h-full items-center justify-end pr-3.5"><span className="h-3 w-3 rounded-full bg-neutral-800 ring-1 ring-neutral-700" /></span>,
    call: (
      <div className="flex h-full items-center gap-3 px-4">
        <span className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-pink-400 to-orange-400" aria-hidden />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[11px] text-neutral-400">Incoming call</span>
          <span className="block truncate text-base font-semibold">Maya Rao</span>
        </span>
        <span className="flex gap-2" aria-hidden>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4 15c4-4 12-4 16 0l-2 3-3-1.5v-2a9 9 0 0 0-6 0v2L6 18z" /></svg></span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 3l3 1 1 4-2 1.5a11 11 0 0 0 6.500 6.500L16 14l4 1 1 3-2 3C10 21 3 14 3 5z" /></svg></span>
        </span>
      </div>
    ),
    timer: <Timer />,
    music: (
      <div className="flex h-full flex-col justify-center gap-2 px-4">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400" aria-hidden />
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold">Midnight Depth</span>
            <span className="block truncate text-xs text-neutral-400">The Perspectives</span>
          </span>
          <Equalizer reduced={reduced} />
        </div>
        <span className="block h-1 overflow-hidden rounded-full bg-neutral-800" aria-hidden>
          <motion.span className="block h-full origin-left rounded-full bg-white/80" initial={{ scaleX: 0.2 }} animate={{ scaleX: reduced ? 0.4 : [0.2, 1] }} transition={{ duration: 30, ease: "linear" }} />
        </span>
      </div>
    ),
  }[mode];

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      <div ref={ref} {...handlers} style={{ perspective: 700 }}>
        <motion.div
          role="status"
          aria-live="polite"
          aria-label={`Island: ${mode}`}
          className="relative overflow-hidden bg-black text-white shadow-[0_22px_38px_-16px_var(--depth-shadow)] ring-1 ring-white/10 will-change-transform"
          animate={{ width: s.w, height: s.h, borderRadius: s.r }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30, mass: 0.9 }}
          style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={mode}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { delay: reduced ? 0 : 0.1, duration: reduced ? 0 : 0.3 } }}
              exit={{ opacity: 0, scale: 0.88, filter: "blur(8px)", transition: { duration: reduced ? 0 : 0.14 } }}
            >
              {body}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      {controls && (
        <div role="radiogroup" aria-label="Island state" className="flex gap-1 rounded-full border border-depth-border bg-depth-surface p-1">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={m === mode}
              onClick={() => set(m)}
              className={cn("rounded-full px-3.5 py-1.5 text-xs font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent", m === mode ? "bg-depth-accent text-white" : "text-depth-muted hover:text-depth-text")}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
