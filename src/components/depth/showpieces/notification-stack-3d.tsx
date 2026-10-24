import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * NotificationStack3D — notifications piled in depth like a deck of cards.
 * Hover or focus (or tap) fans them out into a list; each one can be
 * dismissed. Collapsed, only the top three are visible.
 */
export interface StackNotification {
  id: string;
  title: string;
  body?: string;
  time?: string;
  icon?: ReactNode;
}

export interface NotificationStack3DProps {
  items: StackNotification[];
  onDismiss?: (id: string) => void;
  /** Height of one notification in px. */
  itemHeight?: number;
  className?: string;
}

const GAP = 10;

export function NotificationStack3D({
  items,
  onDismiss,
  itemHeight = 76,
  className,
}: NotificationStack3DProps) {
  const reduced = !!useReducedMotion();
  const [gone, setGone] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const list = items.filter((n) => !gone.includes(n.id));

  const dismiss = (id: string) => {
    setGone((g) => [...g, id]);
    onDismiss?.(id);
  };

  const collapsedH = itemHeight + Math.min(list.length - 1, 2) * 14;
  const openH = list.length * itemHeight + Math.max(list.length - 1, 0) * GAP;
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 26 };

  return (
    <div
      className={cn("w-full max-w-sm", className)}
      style={{ perspective: 900 }}
      onPointerEnter={(e) => e.pointerType !== "touch" && setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onClick={() => setOpen(true)}
    >
      <motion.ul
        role="list"
        aria-label="Notifications"
        className="relative"
        animate={{ height: list.length ? (open ? openH : collapsedH) : 0 }}
        transition={spring}
      >
        <AnimatePresence initial={false}>
          {list.map((n, i) => {
            const depth = open ? 0 : Math.min(i, 3);
            return (
              <motion.li
                key={n.id}
                layout={false}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{
                  opacity: open ? 1 : i > 2 ? 0 : 1 - i * 0.12,
                  y: open ? i * (itemHeight + GAP) : i * 14,
                  scale: open ? 1 : 1 - depth * 0.045,
                  rotateX: open ? 0 : depth * -2,
                }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={spring}
                style={{ height: itemHeight, zIndex: list.length - i, transformOrigin: "50% 0%" }}
                className="absolute inset-x-0 top-0 flex items-start gap-3 rounded-2xl border border-depth-border bg-depth-surface p-3.5 shadow-[0_18px_30px_-20px_var(--depth-shadow)]"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-depth-accent to-depth-accent-2 text-white"
                >
                  {n.icon ?? <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{n.title}</p>
                    {n.time && <span className="shrink-0 font-mono text-[10px] text-depth-muted">{n.time}</span>}
                  </div>
                  {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-depth-muted">{n.body}</p>}
                </div>
                <button
                  type="button"
                  aria-label={`Dismiss ${n.title}`}
                  tabIndex={open || i === 0 ? 0 : -1}
                  onClick={(e) => {
                    e.stopPropagation();
                    dismiss(n.id);
                  }}
                  className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-depth-muted outline-none transition-colors hover:bg-depth-elevated hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
      {list.length === 0 && <p className="py-6 text-center text-sm text-depth-muted">You are all caught up.</p>}
    </div>
  );
}
