import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * RadialMenu3D — a round button that fans its actions out along an arc, each
 * one popping forward in 3D. Click or press Enter to open, Esc or an outside
 * click to close, arrow keys to move between actions.
 */
export interface RadialMenuItem {
  label: string;
  icon: ReactNode;
  onSelect?: () => void;
}

export interface RadialMenu3DProps {
  items: RadialMenuItem[];
  /** Distance from the centre button in px. */
  radius?: number;
  /** Arc in degrees. 0 is right, -90 is up. Defaults to the upper half. */
  startAngle?: number;
  endAngle?: number;
  /** Content of the centre button. */
  trigger?: ReactNode;
  label?: string;
  className?: string;
}

export function RadialMenu3D({
  items,
  radius = 120,
  startAngle = -180,
  endAngle = 0,
  trigger,
  label = "Actions",
  className,
}: RadialMenu3DProps) {
  const reduced = !!useReducedMotion();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const trig = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const size = radius * 2 + 80;
  const n = items.length;
  const angleOf = (i: number) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    return ((startAngle + (endAngle - startAngle) * t) * Math.PI) / 180;
  };

  const focusItem = (i: number) => btns.current[(i + n) % n]?.focus();

  return (
    <div
      ref={root}
      className={cn("relative", className)}
      style={{ width: size, height: radius + 80, perspective: 700 }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          trig.current?.focus();
        }
      }}
    >
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 12, width: 0, height: 0 }}>
        {items.map((it, i) => {
          const a = angleOf(i);
          const x = Math.cos(a) * radius;
          const y = Math.sin(a) * radius;
          return (
            <motion.button
              key={it.label}
              ref={(el) => {
                btns.current[i] = el;
              }}
              type="button"
              role="menuitem"
              aria-label={it.label}
              title={it.label}
              tabIndex={open ? 0 : -1}
              onClick={() => {
                it.onSelect?.();
                setOpen(false);
                trig.current?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") (e.preventDefault(), focusItem(i + 1));
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") (e.preventDefault(), focusItem(i - 1));
              }}
              animate={
                open
                  ? { x, y, scale: 1, opacity: 1, rotateX: 0, z: 40 }
                  : { x: 0, y: 0, scale: 0.4, opacity: 0, rotateX: 70, z: 0 }
              }
              transition={
                reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18, delay: open ? i * 0.045 : 0 }
              }
              whileHover={open && !reduced ? { scale: 1.14, z: 70 } : undefined}
              whileTap={open && !reduced ? { scale: 0.94 } : undefined}
              style={{ pointerEvents: open ? "auto" : "none" }}
              className="absolute -left-6 -top-6 flex h-12 w-12 items-center justify-center rounded-full border border-depth-border bg-depth-surface text-depth-text shadow-[0_14px_24px_-12px_var(--depth-shadow)] outline-none hover:border-depth-accent hover:text-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent"
            >
              <span className="h-5 w-5 [&>svg]:h-full [&>svg]:w-full">{it.icon}</span>
            </motion.button>
          );
        })}
      </div>
      <button
        ref={trig}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => {
          setOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => focusItem(0));
          }
        }}
        className="absolute bottom-3 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-depth-accent to-depth-accent-2 text-white shadow-[0_18px_30px_-12px_var(--depth-accent)] outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg"
        style={{ transform: `translateX(-50%) rotate(${open ? 135 : 0}deg)` }}
      >
        {trigger ?? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
        )}
      </button>
    </div>
  );
}
