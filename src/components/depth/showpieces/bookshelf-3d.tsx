import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Bookshelf3D — books standing spine-out on a shelf. Hover or focus one and
 * it slides forward and turns to show its cover. Each book is a real box
 * (spine, cover, back cover and top), so the turn is genuine 3D.
 */
export interface Book3DItem {
  title: string;
  /** CSS colour for the book. */
  color: string;
  /** Spine thickness in px. */
  thickness?: number;
  height?: number;
  /** Optional cover content. Defaults to the title. */
  cover?: ReactNode;
}

export interface Bookshelf3DProps {
  books: Book3DItem[];
  /** Book depth (cover width) in px. */
  depth?: number;
  className?: string;
}

export function Bookshelf3D({ books, depth = 120, className }: Bookshelf3DProps) {
  const reduced = !!useReducedMotion();
  const [on, setOn] = useState<number | null>(null);
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 180, damping: 18 };
  const tallest = Math.max(...books.map((b) => b.height ?? 190));

  return (
    <div
      role="group"
      aria-label="Bookshelf"
      className={cn("relative mx-auto w-fit px-5", className)}
      style={{ perspective: 1100 }}
      onPointerLeave={() => setOn(null)}
    >
      <div className="flex items-end gap-[3px]" style={{ height: tallest + 6, transformStyle: "preserve-3d", transform: "rotateX(12deg)" }}>
        {books.map((b, i) => {
          const t = b.thickness ?? 38;
          const h = b.height ?? 190;
          const d = depth;
          const lift = on === i;
          const face = "absolute backface-hidden";
          return (
            <div key={i} style={{ width: t, height: h, transformStyle: "preserve-3d", zIndex: lift ? 5 : 0 }}>
              <motion.button
                type="button"
                aria-label={b.title}
                aria-pressed={lift}
                onPointerEnter={(e) => e.pointerType !== "touch" && setOn(i)}
                onFocus={() => setOn(i)}
                onBlur={() => setOn((o) => (o === i ? null : o))}
                onClick={() => setOn(lift ? null : i)}
                animate={{ z: lift ? d * 0.9 : 0, rotateY: lift ? -90 : 0, x: lift ? (d - t) / 2 : 0, y: lift ? -8 : 0 }}
                transition={spring}
                className="absolute inset-0 block rounded-sm outline-none will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* spine */}
                <span
                  className={cn(face, "flex items-center justify-center overflow-hidden rounded-sm")}
                  style={{ width: t, height: h, background: b.color, transform: `translateZ(${d / 2}px)`, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12), inset -5px 0 8px rgba(0,0,0,.18)" }}
                >
                  <span className="whitespace-nowrap text-[11px] font-semibold tracking-wide text-white" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                    {b.title}
                  </span>
                </span>
                {/* front cover (turns to face you) */}
                <span
                  className={cn(face, "flex flex-col justify-between overflow-hidden rounded-sm p-3 text-left text-white")}
                  style={{ width: d, height: h, left: (t - d) / 2, backgroundColor: b.color, backgroundImage: "linear-gradient(135deg, rgba(255,255,255,.14), rgba(0,0,0,.4))", transform: `rotateY(90deg) translateZ(${t / 2}px)` }}
                >
                  {b.cover ?? <span className="text-lg font-bold leading-tight">{b.title}</span>}
                </span>
                {/* back cover */}
                <span className={face} style={{ width: d, height: h, left: (t - d) / 2, background: b.color, transform: `rotateY(-90deg) translateZ(${t / 2}px)`, filter: "brightness(.7)" }} />
                {/* pages, top */}
                <span className={face} style={{ width: t, height: d, top: (h - d) / 2, background: "repeating-linear-gradient(90deg,#f3f1e8 0 2px,#dcd8c8 2px 3px)", transform: `rotateX(90deg) translateZ(${h / 2}px)` }} />
                {/* back */}
                <span className={face} style={{ width: t, height: h, background: b.color, transform: `rotateY(180deg) translateZ(${d / 2}px)` }} />
              </motion.button>
            </div>
          );
        })}
      </div>
      <div aria-hidden className="mt-0 h-3 rounded-sm bg-gradient-to-b from-depth-elevated to-depth-border shadow-[0_14px_18px_-10px_var(--depth-shadow)]" />
    </div>
  );
}
