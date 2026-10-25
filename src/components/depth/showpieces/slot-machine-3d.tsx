import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * SlotMachine3D — reels that are real cylinders. Press Spin and they roll to a
 * random symbol one after another. Call `onResult` to react to a win.
 */
export interface SlotMachine3DProps {
  symbols?: string[];
  reels?: number;
  /** Height of one symbol in px. */
  itemHeight?: number;
  onResult?: (result: string[], won: boolean) => void;
  className?: string;
}

const DEFAULT = ["7", "★", "◆", "●", "▲", "♥", "✦", "BAR"];

function Reel({
  symbols,
  itemHeight,
  index,
  spinSignal,
  reduced,
  onStop,
}: {
  symbols: string[];
  itemHeight: number;
  index: number;
  spinSignal: number;
  reduced: boolean;
  onStop: (i: number, symbolIndex: number) => void;
}) {
  const n = symbols.length;
  const step = 360 / n;
  const radius = itemHeight / 2 / Math.tan(Math.PI / n);
  const rot = useMotionValue(0);

  useEffect(() => {
    if (spinSignal === 0) return;
    const target = Math.floor(Math.random() * n);
    const want = -target * step;
    const cur = rot.get();
    const base = want + 360 * Math.floor((cur - want) / 360);
    const next = base - 360 * (3 + index * 2);
    if (reduced) {
      rot.set(next);
      onStop(index, target);
      return;
    }
    const controls = animate(rot, next, { duration: 1.4 + index * 0.45, ease: [0.2, 0.7, 0.2, 1] });
    let live = true;
    controls.then(() => live && onStop(index, target));
    return () => {
      live = false;
      controls.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinSignal]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-depth-border bg-depth-bg" style={{ width: itemHeight * 1.05, height: itemHeight * 1.9, perspective: 500 }}>
      <motion.div
        className="absolute left-0 top-1/2 w-full will-change-transform"
        style={{ height: itemHeight, marginTop: -itemHeight / 2, transformStyle: "preserve-3d", rotateX: rot }}
      >
        {symbols.map((s, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-depth-surface font-bold backface-hidden"
            style={{ transform: `rotateX(${i * step}deg) translateZ(${radius}px)` }}
          >
            <span className={cn(s.length > 1 ? "text-lg" : "text-3xl", i % 2 ? "text-depth-accent" : "text-depth-text")}>{s}</span>
          </div>
        ))}
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-depth-bg via-transparent to-depth-bg" />
    </div>
  );
}

export function SlotMachine3D({
  symbols = DEFAULT,
  reels = 3,
  itemHeight = 64,
  onResult,
  className,
}: SlotMachine3DProps) {
  const reduced = !!useReducedMotion();
  const [signal, setSignal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [message, setMessage] = useState("Press spin");

  const onStop = (i: number, sym: number) => {
    setResult((r) => {
      const next = [...r];
      next[i] = symbols[sym];
      if (next.filter(Boolean).length === reels) {
        const won = next.every((x) => x === next[0]);
        setBusy(false);
        setMessage(won ? "Jackpot!" : "Try again");
        onResult?.(next, won);
      }
      return next;
    });
  };

  const spin = () => {
    if (busy) return;
    setResult([]);
    setBusy(true);
    setMessage("Spinning…");
    setSignal((s) => s + 1);
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="rounded-3xl border border-depth-border bg-gradient-to-b from-depth-elevated to-depth-surface p-4 shadow-[0_26px_40px_-24px_var(--depth-shadow)]">
        <div className="flex gap-2">
          {Array.from({ length: reels }, (_, i) => (
            <Reel key={i} index={i} symbols={symbols} itemHeight={itemHeight} spinSignal={signal} reduced={reduced} onStop={onStop} />
          ))}
        </div>
        <div aria-hidden className="mt-3 h-1 rounded-full bg-gradient-to-r from-depth-accent via-depth-accent-3 to-depth-accent-2" />
      </div>
      <p className="text-sm text-depth-muted" aria-live="polite">{message}</p>
      <button
        type="button"
        onClick={spin}
        disabled={busy}
        className="rounded-full bg-depth-accent px-6 py-2 text-sm font-semibold text-white outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:opacity-50"
      >
        Spin
      </button>
    </div>
  );
}
