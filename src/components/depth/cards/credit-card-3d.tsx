import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * CreditCard3D — a payment card that leans toward the pointer, catches a
 * moving shine, and flips over to show its back on click, tap or Enter.
 * The brand name and numbers are whatever you pass in.
 */
export interface CreditCard3DProps {
  /** Shown as given, e.g. "•••• •••• •••• 4821". */
  number: string;
  name: string;
  expires: string;
  cvv?: string;
  brand?: string;
  /** Card width in px. Height follows the standard card ratio. */
  width?: number;
  className?: string;
}

export function CreditCard3D({
  number,
  name,
  expires,
  cvv = "•••",
  brand = "Depth Bank",
  width = 320,
  className,
}: CreditCard3DProps) {
  const { ref, x, y, rotateX, rotateY, handlers, reduced } = useTilt({ max: 12 });
  const [flipped, setFlipped] = useState(false);
  const flip = useSpring(0, { stiffness: 120, damping: 16 });

  useEffect(() => {
    flip.set(flipped ? 180 : 0);
  }, [flipped, flip]);

  const gx = useTransform(x, [0, 1], [0, 100]);
  const gy = useTransform(y, [0, 1], [0, 100]);
  const shine = useMotionTemplate`radial-gradient(260px circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.35), transparent 60%)`;

  const face =
    "absolute inset-0 overflow-hidden rounded-2xl backface-hidden shadow-[0_30px_60px_-24px_var(--depth-shadow)]";

  return (
    <div
      ref={ref}
      {...handlers}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label="Payment card. Press Enter to flip it over."
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      className={cn(
        "cursor-pointer select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg",
        className,
      )}
      style={{ perspective: 1000, width, aspectRatio: "1.586 / 1" }}
    >
      <motion.div
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full will-change-transform"
      >
        <motion.div
          style={{ rotateY: flip, transformStyle: "preserve-3d" }}
          className="relative h-full w-full"
        >
          {/* front */}
          <div className={cn(face, "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 p-5 text-white")}>
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold tracking-wide">{brand}</span>
              <span aria-hidden className="relative h-7 w-11">
                <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-rose-500/90" />
                <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-amber-400/90 mix-blend-screen" />
              </span>
            </div>
            <div aria-hidden className="mt-5 h-8 w-11 rounded-md border border-amber-200/60 bg-gradient-to-br from-amber-200 to-amber-400">
              <div className="mx-auto mt-2 h-px w-7 bg-amber-700/40" />
              <div className="mx-auto mt-1.5 h-px w-7 bg-amber-700/40" />
              <div className="mx-auto mt-1.5 h-px w-7 bg-amber-700/40" />
            </div>
            <p className="mt-4 font-mono text-lg tracking-[0.18em] drop-shadow">{number}</p>
            <div className="mt-3 flex items-end justify-between text-xs">
              <span>
                <span className="block text-[9px] uppercase tracking-widest text-white/70">Card holder</span>
                {name}
              </span>
              <span>
                <span className="block text-[9px] uppercase tracking-widest text-white/70">Expires</span>
                {expires}
              </span>
            </div>
            {!reduced && (
              <motion.div aria-hidden style={{ background: shine }} className="pointer-events-none absolute inset-0" />
            )}
          </div>

          {/* back */}
          <div
            className={cn(face, "bg-gradient-to-br from-slate-800 to-slate-950 text-white")}
            style={{ transform: "rotateY(180deg)" }}
          >
            <div aria-hidden className="mt-6 h-10 w-full bg-black" />
            <div className="mx-5 mt-5 flex items-center gap-3">
              <div aria-hidden className="h-8 flex-1 rounded bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_6px,#f3f4f6_6px,#f3f4f6_12px)]" />
              <span className="rounded bg-white px-3 py-1.5 font-mono text-sm italic text-slate-900">{cvv}</span>
            </div>
            <p className="mx-5 mt-5 text-[10px] leading-relaxed text-white/60">
              This card is a sample for demonstration and is not linked to any account.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
