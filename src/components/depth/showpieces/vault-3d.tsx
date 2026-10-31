import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Vault3D — a safe with a real combination dial. Turn the dial (drag it, or
 * use the arrow keys) to each number in the code, then press Enter or let go
 * to lock it in. Get all of them right and the heavy door swings open.
 */
export interface Vault3DProps {
  /** Numbers from 0 to 99, entered in order. */
  code?: number[];
  /** What is inside. */
  children?: ReactNode;
  /** Size of the safe in px. */
  size?: number;
  /** Called once the correct code has been entered and the door opens. */
  onOpen?: () => void;
  /** Extra classes added to the outer element. */
  className?: string;
}

const wrap = (n: number) => ((n % 100) + 100) % 100;
const near = (a: number, b: number) => Math.min(Math.abs(a - b), 100 - Math.abs(a - b)) <= 2;

export function Vault3D({ code = [12, 47, 83], children, size = 280, onOpen, className }: Vault3DProps) {
  const reduced = !!useReducedMotion();
  const angle = useMotionValue(0); // degrees, 3.6 per number
  const door = useMotionValue(0);
  const shake = useMotionValue(0);
  const [num, setNum] = useState(0);
  const [step, setStep] = useState(0);
  const [msg, setMsg] = useState("Turn the dial");
  const open = step >= code.length;
  const dial = useRef<HTMLDivElement>(null);
  const last = useRef<number | null>(null);

  useEffect(() => angle.on("change", (v) => setNum(wrap(Math.round(v / 3.6)))), [angle]);

  const confirm = () => {
    if (open) return;
    if (near(num, code[step])) {
      const s = step + 1;
      setStep(s);
      if (s >= code.length) {
        setMsg("Unlocked");
        animate(door, -102, reduced ? { duration: 0 } : { type: "spring", stiffness: 40, damping: 11 });
        onOpen?.();
      } else setMsg(`Click! ${s} of ${code.length}`);
    } else {
      setStep(0);
      setMsg("Wrong number, start again");
      if (!reduced) animate(shake, [0, -8, 8, -6, 6, 0], { duration: 0.4 });
    }
  };

  const reset = () => {
    animate(door, 0, reduced ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 14 });
    setStep(0);
    setMsg("Turn the dial");
  };

  const ang = (e: React.PointerEvent) => {
    const r = dial.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };

  const d = size * 0.5;
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative" style={{ width: size, height: size, perspective: 1100 }}>
        {/* inside */}
        <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-depth-border bg-depth-bg p-6 text-center">
          <div aria-hidden={!open}>{children}</div>
        </div>
        {/* door */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ rotateY: door, transformOrigin: "0% 50%", transformStyle: "preserve-3d", pointerEvents: open ? "none" : "auto" }}
        >
          <div className="absolute inset-0 rounded-3xl border border-depth-border bg-gradient-to-br from-depth-elevated via-depth-surface to-depth-border shadow-[0_26px_40px_-22px_var(--depth-shadow)] backface-hidden">
            {/* hinges */}
            {[0.18, 0.78].map((y) => (
              <span key={y} aria-hidden className="absolute -left-1 h-8 w-3 rounded bg-depth-muted" style={{ top: `${y * 100}%` }} />
            ))}
            <div className="absolute inset-[8%] rounded-2xl border border-depth-border" />
            {/* lamps */}
            <div className="absolute left-1/2 top-[9%] flex -translate-x-1/2 gap-2" aria-hidden>
              {code.map((_, i) => (
                <span key={i} className={cn("h-2.5 w-2.5 rounded-full transition-colors", i < step ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-depth-border")} />
              ))}
            </div>
            {/* dial */}
            <motion.div style={{ x: shake }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                ref={dial}
                role="slider"
                tabIndex={0}
                aria-label="Combination dial"
                aria-valuemin={0}
                aria-valuemax={99}
                aria-valuenow={num}
                aria-valuetext={`${num}`}
                className="pointer-events-auto relative cursor-grab touch-none rounded-full border-4 border-depth-border bg-gradient-to-br from-depth-surface to-depth-elevated shadow-[0_10px_20px_-8px_var(--depth-shadow)] outline-none focus-visible:ring-2 focus-visible:ring-depth-accent active:cursor-grabbing"
                style={{ width: d, height: d }}
                onPointerDown={(e) => { last.current = ang(e); e.currentTarget.setPointerCapture(e.pointerId); }}
                onPointerMove={(e) => {
                  if (last.current === null) return;
                  const now = ang(e);
                  let dlt = now - last.current;
                  if (dlt > 180) dlt -= 360;
                  if (dlt < -180) dlt += 360;
                  angle.set(angle.get() + dlt);
                  last.current = now;
                }}
                onPointerUp={() => { last.current = null; confirm(); }}
                onPointerCancel={() => { last.current = null; }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") angle.set(angle.get() + (e.shiftKey ? 18 : 3.6));
                  else if (e.key === "ArrowLeft") angle.set(angle.get() - (e.shiftKey ? 18 : 3.6));
                  else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); confirm(); }
                }}
              >
                <motion.div className="absolute inset-0 will-change-transform" style={{ rotate: angle }}>
                  {Array.from({ length: 20 }, (_, i) => (
                    <span key={i} aria-hidden className="absolute left-1/2 top-0 origin-[50%_100%]" style={{ height: d / 2 - 4, transform: `translateX(-50%) rotate(${i * 18}deg)` }}>
                      <span className={cn("block w-[2px] bg-depth-text", i % 5 === 0 ? "h-3" : "h-1.5")} />
                    </span>
                  ))}
                  <span aria-hidden className="absolute left-1/2 top-[10%] h-[20%] w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-depth-accent to-depth-accent-2" />
                </motion.div>
                <span aria-hidden className="absolute left-1/2 top-[-6px] h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[10px] border-x-transparent border-t-red-500" />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold tabular-nums" aria-hidden>{String(num).padStart(2, "0")}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <p className="text-sm text-depth-muted" aria-live="polite">{msg}</p>
      {open && (
        <button type="button" onClick={reset} className="rounded-full border border-depth-border bg-depth-surface px-4 py-1.5 text-sm font-medium outline-none hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent">Close the door</button>
      )}
    </div>
  );
}
