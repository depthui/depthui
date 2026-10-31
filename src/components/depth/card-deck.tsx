import { useCallback, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * CardDeck — a stack of cards in 3D space. Swipe, click or press
 * Enter / arrow keys to send the top card to the back.
 */
export interface CardDeckProps {
  /** Cards in the stack, first item on top. */
  cards: ReactNode[];
  /** Width of each card in px. */
  width?: number;
  /** Height of each card in px. */
  height?: number;
  /** How many cards are visible behind the top one. */
  visible?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function CardDeck({
  cards,
  width = 300,
  height = 190,
  visible = 3,
  className,
}: CardDeckProps) {
  const reduced = !!useReducedMotion();
  const n = cards.length;
  const [order, setOrder] = useState(() => cards.map((_, i) => i));

  const next = useCallback(
    () => setOrder((o) => [...o.slice(1), o[0]]),
    [],
  );
  const prev = useCallback(
    () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]),
    [],
  );

  return (
    <div
      role="group"
      aria-roledescription="card deck"
      aria-label={`Card deck, ${n} cards. Press Enter or arrow keys to cycle.`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      className={cn(
        "relative rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent",
        className,
      )}
      style={{ width, height: height + visible * 18, perspective: 900 }}
    >
      {cards.map((card, i) => {
        const pos = order.indexOf(i);
        const isTop = pos === 0;
        return (
          <motion.div
            key={i}
            drag={isTop ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 600) next();
            }}
            onTap={() => isTop && next()}
            initial={false}
            animate={{
              y: pos * 18,
              scale: 1 - pos * 0.06,
              rotateX: reduced ? 0 : -pos * 3,
              opacity: pos > visible ? 0 : 1 - pos * 0.12,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            style={{
              width,
              height,
              zIndex: n - pos,
              transformOrigin: "50% 100%",
              pointerEvents: isTop ? "auto" : "none",
            }}
            className={cn(
              "absolute left-0 top-0 overflow-hidden rounded-2xl border border-depth-border bg-depth-surface shadow-[0_20px_40px_-24px_var(--depth-shadow)]",
              isTop && "cursor-grab active:cursor-grabbing",
            )}
          >
            {card}
          </motion.div>
        );
      })}
    </div>
  );
}
