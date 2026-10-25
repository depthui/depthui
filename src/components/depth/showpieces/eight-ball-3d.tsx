import { useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * EightBall3D — ask a question, then shake the ball (click, tap, or press
 * Enter). It rattles around and one answer floats up in the window. The
 * answer is announced to screen readers.
 */
export interface EightBall3DProps {
  answers?: string[];
  /** Ball diameter in px. */
  size?: number;
  onAnswer?: (answer: string) => void;
  className?: string;
}

const DEFAULT = [
  "It is certain", "Without a doubt", "Yes", "Most likely", "Signs say yes",
  "Ask again later", "Cannot say now", "Concentrate and ask again",
  "Don't count on it", "My sources say no", "Very doubtful", "Outlook not good",
];

export function EightBall3D({ answers = DEFAULT, size = 220, onAnswer, className }: EightBall3DProps) {
  const reduced = !!useReducedMotion();
  const [text, setText] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const r = useMotionValue(0);

  const shake = async () => {
    if (shaking) return;
    setShaking(true);
    setText(null);
    if (!reduced) {
      const o = { duration: 0.9, ease: "easeInOut" as const };
      animate(x, [0, -22, 24, -18, 16, -8, 0], o);
      animate(y, [0, 14, -16, 12, -10, 6, 0], o);
      await animate(r, [0, -16, 14, -12, 9, -4, 0], o);
    }
    const a = answers[Math.floor(Math.random() * answers.length)];
    setText(a);
    setShaking(false);
    onAnswer?.(a);
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Shake the ball"
        onClick={shake}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); shake(); } }}
        className="relative cursor-pointer select-none rounded-full outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg"
        style={{ width: size, height: size, x, y, rotate: r, background: "radial-gradient(circle at 34% 26%, #5b5b6e 0%, #1c1c27 38%, #05050a 78%)", boxShadow: "0 36px 44px -22px var(--depth-shadow), inset -14px -18px 34px rgba(0,0,0,.6)" }}
      >
        <span aria-hidden className="absolute rounded-full bg-white/25 blur-[6px]" style={{ left: "17%", top: "9%", width: "26%", height: "14%", transform: "rotate(-32deg)" }} />
        <span className="absolute left-1/2 top-[44%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-950 shadow-[inset_0_0_14px_rgba(0,0,0,.9)]" style={{ width: size * 0.56, height: size * 0.56, border: "3px solid #2a2a38" }}>
          {text ? (
            <motion.span
              key={text}
              initial={{ opacity: 0, scale: 0.6, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.7 }}
              className="flex items-end justify-center bg-indigo-700 px-[17%] pb-[10%] text-center font-semibold leading-tight text-indigo-100"
              style={{ width: "92%", height: "92%", clipPath: "polygon(50% 0,100% 100%,0 100%)", fontSize: Math.max(8, size * 0.048) }}
            >
              {text}
            </motion.span>
          ) : (
            <span className="text-3xl font-black text-white/90" style={{ fontSize: size * 0.22 }}>8</span>
          )}
        </span>
      </motion.div>
      <p className="text-sm text-depth-muted" aria-live="polite">
        {shaking ? "Shaking…" : text ? `The ball says: ${text}.` : "Think of a question, then shake the ball."}
      </p>
    </div>
  );
}
