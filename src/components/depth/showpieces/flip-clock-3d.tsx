import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * FlipClock3D — split-flap digits that fold over when they change.
 * Give it a `value` string (for example "12:45" or a counter) or leave it
 * empty to show the current time. Only transforms animate. Screen readers get
 * the plain text, not every flap.
 */
export interface FlipClock3DProps {
  /** Text to show. Omit to show the current time as HH:MM:SS. */
  value?: string;
  /** Hide seconds when showing the current time. */
  hideSeconds?: boolean;
  className?: string;
  tileClassName?: string;
}

function nowString(hideSeconds: boolean) {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return hideSeconds ? `${p(d.getHours())}:${p(d.getMinutes())}` : `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function FlipClock3D({ value, hideSeconds = false, className, tileClassName }: FlipClock3DProps) {
  const [live, setLive] = useState(() => nowString(hideSeconds));

  useEffect(() => {
    if (value !== undefined) return;
    const t = window.setInterval(() => setLive(nowString(hideSeconds)), 1000);
    return () => window.clearInterval(t);
  }, [value, hideSeconds]);

  const text = value ?? live;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)} role="timer" aria-label={text}>
      {[...text].map((ch, i) =>
        ch === ":" || ch === " " || ch === "." || ch === "," ? (
          <span key={i} aria-hidden className="px-0.5 text-4xl font-bold text-depth-muted sm:text-5xl">
            {ch === " " ? " " : ch}
          </span>
        ) : (
          <FlipTile key={i} char={ch} className={tileClassName} />
        ),
      )}
    </div>
  );
}

const HALF = "absolute inset-x-0 overflow-hidden";
const GLYPH = "absolute inset-x-0 flex h-[200%] items-center justify-center";

function Half({ char, part }: { char: string; part: "top" | "bottom" }) {
  return (
    <div className={cn(HALF, part === "top" ? "top-0 h-1/2" : "bottom-0 h-1/2")}>
      <span className={cn(GLYPH, part === "top" ? "top-0" : "bottom-0")}>{char}</span>
    </div>
  );
}

function FlipTile({ char, className }: { char: string; className?: string }) {
  const reduced = !!useReducedMotion();
  const [cur, setCur] = useState(char);
  const [prev, setPrev] = useState(char);
  const [flip, setFlip] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (char === cur) return;
    setPrev(cur);
    setCur(char);
    setFlip((n) => n + 1);
  }, [char, cur]);

  const face = "bg-depth-elevated";

  return (
    <div
      aria-hidden
      className={cn(
        "relative h-16 w-11 select-none rounded-lg border border-depth-border text-4xl font-bold tabular-nums text-depth-text shadow-[0_14px_30px_-16px_var(--depth-shadow)] sm:h-20 sm:w-14 sm:text-5xl",
        className,
      )}
      style={{ perspective: 400 }}
    >
      {/* static halves: top shows the new digit, bottom still shows the old one */}
      <div className={cn("absolute inset-0 overflow-hidden rounded-lg", face)}>
        <Half char={cur} part="top" />
        <Half char={reduced ? cur : prev} part="bottom" />
      </div>

      {flip > 0 && !reduced && (
        <>
          {/* old top folds down */}
          <motion.div
            key={`t${flip}`}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -90 }}
            transition={{ duration: 0.22, ease: "easeIn" }}
            className={cn(HALF, "top-0 h-1/2 rounded-t-lg backface-hidden", face)}
            style={{ transformOrigin: "bottom", transformStyle: "preserve-3d" }}
          >
            <span className={cn(GLYPH, "top-0")}>{prev}</span>
          </motion.div>
          {/* new bottom unfolds */}
          <motion.div
            key={`b${flip}`}
            initial={{ rotateX: 90 }}
            animate={{ rotateX: 0 }}
            transition={{ duration: 0.22, delay: 0.22, ease: "easeOut" }}
            onAnimationComplete={() => setPrev(cur)}
            className={cn(HALF, "bottom-0 h-1/2 rounded-b-lg backface-hidden", face)}
            style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
          >
            <span className={cn(GLYPH, "bottom-0")}>{cur}</span>
          </motion.div>
        </>
      )}

      {/* hinge line */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-depth-border" />
    </div>
  );
}
