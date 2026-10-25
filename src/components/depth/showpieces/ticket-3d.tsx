import { useState } from "react";
import { motion, useMotionTemplate, useTransform } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * Ticket3D — a boarding pass that tilts with the pointer under a moving
 * glare. Click (or press Enter) and the stub tears off along the perforation.
 */
export interface Ticket3DProps {
  title?: string;
  from?: string;
  to?: string;
  date?: string;
  seat?: string;
  gate?: string;
  code?: string;
  className?: string;
}

export function Ticket3D({
  title = "Depth Airways",
  from = "BOM",
  to = "SFO",
  date = "24 OCT 2026",
  seat = "12A",
  gate = "B7",
  code = "DU-0925",
  className,
}: Ticket3DProps) {
  const { ref, x, y, rotateX, rotateY, handlers, reduced } = useTilt({ max: 10 });
  const [torn, setTorn] = useState(false);
  const gx = useTransform(x, [0, 1], [0, 100]);
  const gy = useTransform(y, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, var(--depth-glare), transparent 55%)`;

  const notch = "absolute h-5 w-5 rounded-full bg-depth-bg border border-depth-border";

  return (
    <div
      ref={ref}
      {...handlers}
      role="button"
      tabIndex={0}
      aria-pressed={torn}
      aria-label={torn ? "Ticket stub torn off. Press to restore" : "Tear off the stub"}
      onClick={() => setTorn((t) => !t)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setTorn((t) => !t);
        }
      }}
      className={cn(
        "relative w-[22rem] max-w-full cursor-pointer select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg",
        className,
      )}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative flex will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
        }}
      >
        {/* main */}
        <div className="relative flex-1 overflow-hidden rounded-l-2xl border border-r-0 border-depth-border bg-depth-surface p-5 shadow-[0_26px_40px_-26px_var(--depth-shadow)]">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-depth-accent via-depth-accent-3 to-depth-accent-2" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-depth-muted">{title}</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold tracking-tight">{from}</p>
              <p className="text-[11px] text-depth-muted">Mumbai</p>
            </div>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-depth-accent" aria-hidden>
              <path d="M2 16l20-6-8 12-3-5-9-1zM11 17l-1 5" />
            </svg>
            <div className="text-right">
              <p className="text-3xl font-bold tracking-tight">{to}</p>
              <p className="text-[11px] text-depth-muted">San Francisco</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
            {[["Date", date], ["Gate", gate], ["Seat", seat]].map(([k, v]) => (
              <div key={k}>
                <p className="font-mono text-[9px] uppercase tracking-widest text-depth-muted">{k}</p>
                <p className="font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: glare }} />
        </div>

        {/* perforation */}
        <div aria-hidden className="relative w-0 self-stretch">
          <span className={cn(notch, "-left-2.5 -top-2.5")} />
          <span className={cn(notch, "-bottom-2.5 -left-2.5")} />
          <span className="absolute inset-y-3 left-0 border-l-2 border-dashed border-depth-border" />
        </div>

        {/* stub */}
        <motion.div
          animate={
            torn
              ? { x: 10, y: 30, rotateZ: 8, rotateY: 12 }
              : { x: 0, y: 0, rotateZ: 0, rotateY: 0 }
          }
          transition={{ type: "spring", stiffness: 170, damping: 14 }}
          className="relative flex w-24 flex-col items-center justify-between overflow-hidden rounded-r-2xl border border-l-0 border-depth-border bg-depth-elevated p-4"
          style={{ transformOrigin: "0% 100%" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-depth-muted">Stub</p>
          <div
            aria-hidden
            className="h-16 w-full opacity-80"
            style={{
              background:
                "repeating-linear-gradient(90deg, var(--depth-text) 0 2px, transparent 2px 4px, var(--depth-text) 4px 5px, transparent 5px 9px)",
            }}
          />
          <p className="font-mono text-[11px] font-semibold">{code}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
