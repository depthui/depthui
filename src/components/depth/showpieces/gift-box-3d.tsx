import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * GiftBox3D — a wrapped box with a bow. Hover, focus or tap and the lid lifts
 * off and tilts away, light pours out of the box, and sparkles float up. The
 * box and the lid are real cuboids. It also tilts with your pointer.
 */
export interface GiftBox3DProps {
  /** Box width in px. */
  size?: number;
  /** Box and ribbon colours. */
  colors?: [string, string];
  /** Controlled open state. Leave unset to let the box manage itself. */
  open?: boolean;
  /** Called with the new open state when the box opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function GiftBox3D({ size = 150, colors = ["#7c3aed", "#fbbf24"], open: openProp, onOpenChange, className }: GiftBox3DProps) {
  const reduced = !!useReducedMotion();
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const set = (v: boolean) => {
    if (openProp === undefined) setInner(v);
    onOpenChange?.(v);
  };
  const { ref, rotateX, rotateY, handlers } = useTilt({ max: 10 });
  const [box, ribbon] = colors;
  const W = size;
  const Hb = size * 0.72;
  const Hl = size * 0.26;
  const LW = size * 1.08;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 110, damping: 13 };

  const face = (w: number, h: number, tf: string, bg: string, extra?: React.CSSProperties) => ({
    position: "absolute" as const,
    width: w,
    height: h,
    left: "50%",
    top: "50%",
    marginLeft: -w / 2,
    marginTop: -h / 2,
    transform: tf,
    background: bg,
    ...extra,
  });
  const stripeV = (c: string) => `linear-gradient(90deg, transparent 42%, ${c} 42% 58%, transparent 58%)`;
  const stripeH = (c: string) => `linear-gradient(0deg, transparent 42%, ${c} 42% 58%, transparent 58%)`;
  const shade = (a: number) => `linear-gradient(rgba(0,0,0,${a}), rgba(0,0,0,${a}))`;
  const side = (a: number) => `${stripeV(ribbon)}, ${shade(a)}, ${box}`;

  return (
    <div
      ref={ref}
      {...handlers}
      role="button"
      tabIndex={0}
      aria-pressed={open}
      aria-label={open ? "Close the gift box" : "Open the gift box"}
      onPointerEnter={(e) => e.pointerType !== "touch" && set(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && set(false)}
      onFocus={() => set(true)}
      onBlur={() => set(false)}
      onClick={() => set(!open)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(!open); } }}
      className={cn("relative cursor-pointer select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg", className)}
      style={{ width: size * 1.7, height: size * 1.9, perspective: 1000 }}
    >
      <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateX(-24deg) rotateY(-32deg)" }}>
          <div className="absolute left-1/2" style={{ top: size * 0.82, width: 0, height: 0, transformStyle: "preserve-3d" }}>
            {/* box body: its centre sits at y = Hb / 2 below the lid line */}
            <div className="absolute" style={{ left: -W / 2, top: 0, width: W, height: Hb, transformStyle: "preserve-3d" }}>
              <span aria-hidden style={face(W, Hb, `translateZ(${W / 2}px)`, side(0))} />
              <span aria-hidden style={face(W, Hb, `rotateY(180deg) translateZ(${W / 2}px)`, side(0.35))} />
              <span aria-hidden style={face(W, Hb, `rotateY(90deg) translateZ(${W / 2}px)`, side(0.15))} />
              <span aria-hidden style={face(W, Hb, `rotateY(-90deg) translateZ(${W / 2}px)`, side(0.3))} />
              <span aria-hidden style={face(W, W, `rotateX(-90deg) translateZ(${Hb / 2}px)`, shade(0.5) + "," + box)} />
              {/* light inside, seen once the lid is off */}
              <motion.span aria-hidden animate={{ opacity: open ? 1 : 0 }} transition={spring} style={face(W * 0.94, W * 0.94, "rotateX(90deg) translateZ(-1px)", "radial-gradient(circle, #fff7c2 0%, #fbbf24 45%, rgba(251,191,36,0) 78%)")} />
            </div>
            {/* sparkles */}
            {[-0.32, -0.1, 0.12, 0.3, 0.02].map((x, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute block rounded-full bg-amber-200"
                style={{ left: x * W, top: Hb * 0.1, width: 5 + (i % 3) * 2, height: 5 + (i % 3) * 2, boxShadow: "0 0 10px 3px rgba(253,224,71,.8)" }}
                animate={open && !reduced ? { y: [-4, -Hb * (0.9 + i * 0.12)], opacity: [0, 1, 0] } : { y: 0, opacity: 0 }}
                transition={open ? { duration: 1.6, repeat: Infinity, delay: i * 0.28, ease: "easeOut" } : { duration: 0.2 }}
              />
            ))}
            {/* lid */}
            <motion.div
              className="absolute will-change-transform"
              animate={{ y: open ? -size * 0.7 : 0, x: open ? size * 0.34 : 0, rotateZ: open ? 16 : 0 }}
              transition={spring}
              style={{ left: -LW / 2, top: -Hl + 2, width: LW, height: Hl, transformStyle: "preserve-3d" }}
            >
              <span aria-hidden style={face(LW, Hl, `translateZ(${LW / 2}px)`, `${stripeV(ribbon)}, ${box}`)} />
              <span aria-hidden style={face(LW, Hl, `rotateY(180deg) translateZ(${LW / 2}px)`, `${stripeV(ribbon)}, ${shade(0.35)}, ${box}`)} />
              <span aria-hidden style={face(LW, Hl, `rotateY(90deg) translateZ(${LW / 2}px)`, `${stripeV(ribbon)}, ${shade(0.15)}, ${box}`)} />
              <span aria-hidden style={face(LW, Hl, `rotateY(-90deg) translateZ(${LW / 2}px)`, `${stripeV(ribbon)}, ${shade(0.3)}, ${box}`)} />
              <span aria-hidden style={face(LW, LW, `rotateX(90deg) translateZ(${Hl / 2}px)`, `${stripeV(ribbon)}, ${stripeH(ribbon)}, ${box}`)} />
              {/* bow */}
              <span aria-hidden className="absolute block rounded-full" style={{ left: "50%", top: -Hl * 1.1, width: size * 0.34, height: size * 0.24, marginLeft: -size * 0.36, border: `${size * 0.055}px solid ${ribbon}`, transform: "rotateZ(-24deg)" }} />
              <span aria-hidden className="absolute block rounded-full" style={{ left: "50%", top: -Hl * 1.1, width: size * 0.34, height: size * 0.24, marginLeft: size * 0.02, border: `${size * 0.055}px solid ${ribbon}`, transform: "rotateZ(24deg)" }} />
              <span aria-hidden className="absolute block rounded-md" style={{ left: "50%", top: -Hl * 0.75, width: size * 0.12, height: size * 0.12, marginLeft: -size * 0.06, background: ribbon, transform: "translateZ(2px)" }} />
            </motion.div>
          </div>
        </div>
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute bottom-3 left-1/2 h-4 -translate-x-1/2 rounded-[50%] bg-black/25 blur-md" style={{ width: size * 1.1 }} />
    </div>
  );
}
