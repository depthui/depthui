import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { LayoutGroup, motion, useDragControls, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Kanban3D — a board of columns (Not started, Processing, Done, Failed...)
 * where cards drag between columns and reorder inside them. Drag with a mouse,
 * pen or finger (use the grip on touch so the page still scrolls), or use the
 * keyboard: focus a grip, press Space to pick the card up, move it with the
 * arrow keys, then Space to drop it or Esc to put it back. Moves are announced
 * to screen readers. Cards slide into place with a layout animation. Controlled
 * or uncontrolled: the cards live in one flat list, and a card's order in the
 * list is its order in its column.
 */
export type KanbanTone = "slate" | "violet" | "amber" | "green" | "red" | "cyan" | "pink";

export interface KanbanColumn {
  /** Unique id. Cards point at it with `columnId`. */
  id: string;
  /** Heading shown at the top of the column. */
  title: string;
  /** Colour of the dot next to the title. */
  tone?: KanbanTone;
}

export interface KanbanItem {
  /** Unique id of the card. */
  id: string;
  /** Id of the column the card sits in. */
  columnId: string;
  title: string;
  /** Optional second line under the title. */
  description?: string;
  /** Optional small label, for example "Design" or "Bug". */
  tag?: string;
}

export interface KanbanMove {
  /** Id of the card that moved. */
  id: string;
  /** Column it left. */
  from: string;
  /** Column it joined. */
  to: string;
  /** Its new position in that column, starting at 0. */
  index: number;
}

export interface Kanban3DProps {
  /** The columns, left to right. */
  columns: KanbanColumn[];
  /** Cards, when you control the board yourself. */
  cards?: KanbanItem[];
  /** Starting cards when you let the board keep its own state. */
  defaultCards?: KanbanItem[];
  /** Called with the new list of cards, and a description of the move, after every change. */
  onCardsChange?: (cards: KanbanItem[], move?: KanbanMove) => void;
  /** Draw each card yourself. The grip and drag behaviour stay. */
  renderCard?: (card: KanbanItem) => ReactNode;
  /** Text shown in a column with no cards. */
  emptyText?: string;
  /** Extra classes added to the outer element. */
  className?: string;
}

const DOT: Record<KanbanTone, string> = {
  slate: "bg-slate-400",
  violet: "bg-violet-500",
  amber: "bg-amber-400",
  green: "bg-emerald-500",
  red: "bg-red-500",
  cyan: "bg-cyan-500",
  pink: "bg-pink-500",
};

/** Put card `id` into column `to` so it ends up at position `index` there. */
function moveCard(cards: KanbanItem[], id: string, to: string, index: number): KanbanItem[] {
  const card = cards.find((c) => c.id === id);
  if (!card) return cards;
  const rest = cards.filter((c) => c.id !== id);
  const col = rest.filter((c) => c.columnId === to);
  const moved = { ...card, columnId: to };
  const at = index >= col.length ? (col.length ? rest.indexOf(col[col.length - 1]) + 1 : rest.length) : rest.indexOf(col[index]);
  return [...rest.slice(0, at), moved, ...rest.slice(at)];
}

export function Kanban3D({
  columns,
  cards: cardsProp,
  defaultCards = [],
  onCardsChange,
  renderCard,
  emptyText = "Drop cards here",
  className,
}: Kanban3DProps) {
  const reduced = !!useReducedMotion();
  const uid = useId();
  const board = useRef<HTMLDivElement>(null);
  const [inner, setInner] = useState(defaultCards);
  const cards = cardsProp ?? inner;
  const [dragId, setDragId] = useState<string | null>(null);
  // Where a dragged card would land: which column, and which position in it.
  const [target, setTarget] = useState<{ col: string; index: number } | null>(null);
  const [grab, setGrab] = useState<{ id: string; snapshot: KanbanItem[] } | null>(null);
  const [say, setSay] = useState("");

  const commit = useCallback(
    (next: KanbanItem[], move?: KanbanMove) => {
      if (cardsProp === undefined) setInner(next);
      onCardsChange?.(next, move);
    },
    [cardsProp, onCardsChange],
  );

  const colTitle = (id: string) => columns.find((c) => c.id === id)?.title ?? id;
  const inCol = (id: string, list = cards) => list.filter((c) => c.columnId === id);

  /** Find the column under a point and the position inside it. */
  function hit(x: number, y: number, id: string) {
    // The dragged card is under the pointer too, so skip it and look at what is beneath.
    const els = document.elementsFromPoint(x, y).filter((e) => !(e as HTMLElement).closest(`[data-card-id="${CSS.escape(id)}"]`));
    const colEl = els
      .map((e) => (e as HTMLElement).closest<HTMLElement>("[data-kanban-col]"))
      .find((e) => e && e.dataset.board === uid);
    if (!colEl) return null;
    const rows = Array.from(colEl.querySelectorAll<HTMLElement>("[data-card-id]")).filter((e) => e.dataset.cardId !== id);
    let index = 0;
    for (const r of rows) {
      const b = r.getBoundingClientRect();
      if (y > b.top + b.height / 2) index++;
    }
    return { col: colEl.dataset.kanbanCol as string, index };
  }

  function onDrag(x: number, y: number, id: string) {
    const t = hit(x, y, id);
    setTarget((p) => (p?.col === t?.col && p?.index === t?.index ? p : t));
    // Nudge the board sideways when the pointer nears an edge.
    const el = board.current;
    if (el) {
      const r = el.getBoundingClientRect();
      if (x < r.left + 48) el.scrollLeft -= 14;
      else if (x > r.right - 48) el.scrollLeft += 14;
    }
  }

  function onDrop(id: string) {
    const t = target;
    setDragId(null);
    setTarget(null);
    if (!t) return;
    const card = cards.find((c) => c.id === id);
    if (!card) return;
    const list = inCol(t.col).filter((c) => c.id !== id);
    const index = Math.min(t.index, list.length);
    const before = inCol(card.columnId).findIndex((c) => c.id === id);
    if (card.columnId === t.col && before === index) return;
    commit(moveCard(cards, id, t.col, index), { id, from: card.columnId, to: t.col, index });
  }

  // Keyboard: Space picks a card up and drops it, arrows move it, Esc puts it back.
  function onGripKey(e: KeyboardEvent, card: KanbanItem) {
    const mine = grab?.id === card.id;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!mine) {
        setGrab({ id: card.id, snapshot: cards });
        const col = inCol(card.columnId);
        setSay(`Picked up ${card.title}. Column ${colTitle(card.columnId)}, position ${col.findIndex((c) => c.id === card.id) + 1} of ${col.length}. Use the arrow keys to move it, Space to drop, Escape to cancel.`);
      } else {
        setGrab(null);
        const col = inCol(card.columnId);
        setSay(`Dropped ${card.title} in ${colTitle(card.columnId)}, position ${col.findIndex((c) => c.id === card.id) + 1} of ${col.length}.`);
      }
      return;
    }
    if (!mine) return;
    if (e.key === "Escape") {
      e.preventDefault();
      commit(grab!.snapshot);
      setGrab(null);
      setSay(`Cancelled. ${card.title} went back.`);
      return;
    }
    const col = inCol(card.columnId);
    const pos = col.findIndex((c) => c.id === card.id);
    const ci = columns.findIndex((c) => c.id === card.columnId);
    let to = card.columnId;
    let index = pos;
    if (e.key === "ArrowUp") index = Math.max(0, pos - 1);
    else if (e.key === "ArrowDown") index = Math.min(col.length - 1, pos + 1);
    else if (e.key === "ArrowLeft" && ci > 0) { to = columns[ci - 1].id; index = Math.min(pos, inCol(to).length); }
    else if (e.key === "ArrowRight" && ci < columns.length - 1) { to = columns[ci + 1].id; index = Math.min(pos, inCol(to).length); }
    else return;
    e.preventDefault();
    if (to === card.columnId && index === pos) return;
    commit(moveCard(cards, card.id, to, index), { id: card.id, from: card.columnId, to, index });
    setSay(`${card.title} is now in ${colTitle(to)}, position ${index + 1} of ${inCol(to).filter((c) => c.id !== card.id).length + 1}.`);
  }

  // A moved card is a new element, so give the grip focus back after a keyboard move.
  useEffect(() => {
    if (!grab) return;
    const el = board.current?.querySelector<HTMLElement>(`[data-grip="${CSS.escape(grab.id)}"]`);
    if (el && document.activeElement !== el) el.focus();
  }, [cards, grab]);

  // Tabbing away drops the card where it is.
  useEffect(() => {
    if (!grab) return;
    const onFocusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement | null)?.dataset?.grip !== grab.id) setGrab(null);
    };
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, [grab]);

  return (
    <div className={cn("w-full", className)}>
      <LayoutGroup id={uid}>
        <div
          ref={board}
          role="group"
          aria-label="Kanban board"
          className="flex w-full snap-x gap-3 overflow-x-auto pb-3 sm:gap-4"
        >
          {columns.map((col) => {
            const list = inCol(col.id);
            const over = target?.col === col.id;
            return (
              <section
                key={col.id}
                data-kanban-col={col.id}
                data-board={uid}
                aria-label={`${col.title}, ${list.length} ${list.length === 1 ? "card" : "cards"}`}
                className={cn(
                  "w-[240px] shrink-0 snap-start rounded-2xl border bg-depth-elevated/60 p-3 transition-colors duration-200 sm:min-w-[200px] sm:flex-1",
                  over ? "border-depth-accent bg-depth-accent/5" : "border-depth-border",
                )}
              >
                <header className="mb-3 flex items-center gap-2 px-1">
                  <span aria-hidden className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_8px_currentColor]", DOT[col.tone ?? "slate"])} />
                  <h3 className="text-sm font-semibold tracking-tight">{col.title}</h3>
                  <span className="ml-auto rounded-full bg-depth-surface px-2 py-0.5 text-xs tabular-nums text-depth-muted">{list.length}</span>
                </header>
                <ul className="relative flex min-h-[72px] flex-col gap-2.5">
                  {list.map((card) => {
                    const idx = list.filter((c) => c.id !== dragId).findIndex((c) => c.id === card.id);
                    const lineBefore = over && dragId !== null && dragId !== card.id && target!.index === idx;
                    return (
                      <KCard
                        key={card.id}
                        card={card}
                        bid={uid}
                        reduced={reduced}
                        dragging={dragId === card.id}
                        grabbed={grab?.id === card.id}
                        lineBefore={lineBefore}
                        renderCard={renderCard}
                        onStart={() => setDragId(card.id)}
                        onDrag={(x, y) => onDrag(x, y, card.id)}
                        onEnd={() => onDrop(card.id)}
                        onGripKey={(e) => onGripKey(e, card)}
                      />
                    );
                  })}
                  {list.length === 0 && (
                    <li aria-hidden className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-depth-border px-3 py-5 text-xs text-depth-muted">
                      {emptyText}
                    </li>
                  )}
                  {over && dragId !== null && target!.index >= list.filter((c) => c.id !== dragId).length && list.some((c) => c.id !== dragId) && (
                    <li aria-hidden className="pointer-events-none -mt-1.5 h-0.5 rounded-full bg-depth-accent" />
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </LayoutGroup>
      <div aria-live="assertive" className="sr-only">{say}</div>
    </div>
  );
}

interface KCardProps {
  card: KanbanItem;
  bid: string;
  reduced: boolean;
  dragging: boolean;
  grabbed: boolean;
  lineBefore: boolean;
  renderCard?: (card: KanbanItem) => ReactNode;
  onStart: () => void;
  onDrag: (x: number, y: number) => void;
  onEnd: () => void;
  onGripKey: (e: KeyboardEvent) => void;
}

function KCard({ card, bid, reduced, dragging, grabbed, lineBefore, renderCard, onStart, onDrag, onEnd, onGripKey }: KCardProps) {
  const controls = useDragControls();
  return (
    <motion.li
      layoutId={`${bid}-${card.id}`}
      data-card-id={card.id}
      drag
      dragControls={controls}
      dragListener={false}
      dragSnapToOrigin
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={onStart}
      onDrag={(_, info) => onDrag(info.point.x - window.scrollX, info.point.y - window.scrollY)}
      onDragEnd={onEnd}
      // Mouse and pen can grab anywhere on the card. Touch uses the grip so the page still scrolls.
      onPointerDown={(e) => {
        if (e.pointerType === "touch") return;
        if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
        controls.start(e);
      }}
      whileDrag={reduced ? { zIndex: 50 } : { scale: 1.04, rotate: 2.5, zIndex: 50 }}
      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
      style={{ transformPerspective: 800 }}
      className={cn(
        "relative cursor-grab touch-pan-y select-none rounded-xl border bg-depth-surface p-3 active:cursor-grabbing",
        "shadow-[0_3px_0_var(--depth-border),0_8px_16px_-10px_var(--depth-shadow)]",
        dragging ? "border-depth-accent opacity-95 shadow-[0_24px_40px_-14px_var(--depth-shadow)]" : "border-depth-border",
        grabbed && "ring-2 ring-depth-accent ring-offset-2 ring-offset-depth-bg",
        lineBefore && "before:absolute before:-top-[7px] before:left-0 before:right-0 before:h-0.5 before:rounded-full before:bg-depth-accent",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {renderCard ? (
            renderCard(card)
          ) : (
            <>
              {card.tag && (
                <span className="mb-1.5 inline-block rounded-md bg-depth-accent/10 px-1.5 py-0.5 text-[11px] font-medium text-depth-accent">{card.tag}</span>
              )}
              <p className="text-sm font-medium leading-snug">{card.title}</p>
              {card.description && <p className="mt-1 text-xs leading-relaxed text-depth-muted">{card.description}</p>}
            </>
          )}
        </div>
        <button
          type="button"
          data-grip={card.id}
          aria-label={`Move ${card.title}. Press Space to pick up.`}
          aria-pressed={grabbed}
          onPointerDown={(e) => {
            controls.start(e);
            e.stopPropagation();
          }}
          onKeyDown={onGripKey}
          className="-mr-1 -mt-0.5 flex h-7 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-depth-muted outline-none transition-colors hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent"
        >
          <svg aria-hidden viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <circle cx="5" cy="3.5" r="1.3" /><circle cx="11" cy="3.5" r="1.3" />
            <circle cx="5" cy="8" r="1.3" /><circle cx="11" cy="8" r="1.3" />
            <circle cx="5" cy="12.5" r="1.3" /><circle cx="11" cy="12.5" r="1.3" />
          </svg>
        </button>
      </div>
    </motion.li>
  );
}
