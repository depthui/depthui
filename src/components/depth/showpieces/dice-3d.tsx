import { useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Dice3D — a six-sided die that tumbles when you click, tap, or press Enter
 * or Space, and lands on a random face. Opposite faces add up to seven, like
 * a real die. The result is announced to screen readers.
 */
export interface Dice3DProps {
  /** Edge length in px. */
  size?: number;
  /** Called with the rolled number once the die has landed. */
  onRoll?: (value: number) => void;
  /** Starting face, 1 to 6. */
  initial?: number;
  className?: string;
}

// Which cell of the 3x3 grid holds a pip, per face value.
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

// Face transforms: front=1, right=2, top=3, bottom=4, left=5, back=6.
const FACE: Record<number, string> = {
  1: "",
  2: "rotateY(90deg)",
  3: "rotateX(90deg)",
  4: "rotateX(-90deg)",
  5: "rotateY(-90deg)",
  6: "rotateY(180deg)",
};
// Cube rotation (x, y) that brings each face to the front.
const SHOW: Record<number, [number, number]> = {
  1: [0, 0],
  2: [0, -90],
  3: [-90, 0],
  4: [90, 0],
  5: [0, 90],
  6: [0, 180],
};

export function Dice3D({ size = 96, onRoll, initial = 1, className }: Dice3DProps) {
  const reduced = !!useReducedMotion();
  const [value, setValue] = useState(initial);
  const [rolling, setRolling] = useState(false);
  const rx = useMotionValue(SHOW[initial][0] - 24);
  const ry = useMotionValue(SHOW[initial][1] + 28);
  const lift = useMotionValue(0);
  const half = size / 2;

  const roll = () => {
    if (rolling) return;
    const v = 1 + Math.floor(Math.random() * 6);
    const [bx, by] = SHOW[v];
    // Land a little off-axis so the die reads as 3D, after two to three full turns.
    const to = (cur: number, base: number, spins: number) =>
      cur - (((cur % 360) + 360) % 360) + 360 * spins + base;
    const tx = to(rx.get(), bx - 24, 2);
    const ty = to(ry.get(), by + 28, 3);
    setRolling(true);
    if (reduced) {
      rx.set(tx);
      ry.set(ty);
      setValue(v);
      setRolling(false);
      onRoll?.(v);
      return;
    }
    const ease = [0.2, 0.8, 0.25, 1] as const;
    animate(rx, tx, { duration: 1.3, ease });
    animate(lift, [0, -70, 0], { duration: 1.1, times: [0, 0.4, 1], ease: "easeInOut" });
    animate(ry, ty, { duration: 1.3, ease }).then(() => {
      setValue(v);
      setRolling(false);
      onRoll?.(v);
    });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Roll the die"
      onClick={roll}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          roll();
        }
      }}
      className={cn(
        "relative cursor-pointer select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg",
        className,
      )}
      style={{ width: size, height: size, perspective: 700 }}
    >
      <span className="sr-only" aria-live="polite">
        {rolling ? "Rolling" : `Rolled ${value}`}
      </span>
      <motion.div
        className="relative h-full w-full will-change-transform"
        style={{ transformStyle: "preserve-3d", y: lift, rotateX: rx, rotateY: ry }}
      >
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            aria-hidden
            className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 rounded-2xl border border-depth-border bg-gradient-to-br from-depth-surface to-depth-elevated p-3.5 backface-hidden"
            style={{ transform: `${FACE[n]} translateZ(${half}px)`.trim() }}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="flex items-center justify-center">
                {PIPS[n].includes(i) && (
                  <span
                    className={cn(
                      "block h-[70%] w-[70%] rounded-full shadow-inner",
                      n === 1 ? "bg-depth-accent-3" : "bg-depth-text",
                    )}
                  />
                )}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-1/2 h-3 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/25 blur-md"
      />
    </div>
  );
}
