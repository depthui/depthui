import { useState } from "react";
import { Button3D, Kanban3D, type KanbanItem, type KanbanMove } from "@/components/depth";

const KANBAN_COLUMNS = [
  { id: "todo", title: "Not started", tone: "slate" as const },
  { id: "doing", title: "Processing", tone: "amber" as const },
  { id: "done", title: "Success", tone: "green" as const },
  { id: "failed", title: "Failed", tone: "red" as const },
];
const KANBAN_CARDS: KanbanItem[] = [
  { id: "k1", columnId: "todo", title: "Design the pricing page", description: "Three tiers, annual toggle.", tag: "Design" },
  { id: "k2", columnId: "todo", title: "Write the launch post", tag: "Marketing" },
  { id: "k3", columnId: "todo", title: "Add dark mode to docs", description: "Check every code block.", tag: "Docs" },
  { id: "k4", columnId: "doing", title: "Build the kanban board", description: "Drag, drop and keyboard.", tag: "Feature" },
  { id: "k5", columnId: "doing", title: "Migrate to Tailwind v4", tag: "Chore" },
  { id: "k6", columnId: "done", title: "Ship the globe component", tag: "Feature" },
  { id: "k7", columnId: "done", title: "Set up CI", description: "Typecheck and build.", tag: "Chore" },
  { id: "k8", columnId: "failed", title: "Import legacy data", description: "Timed out on step 3.", tag: "Bug" },
];

export function KanbanDemo() {
  const [last, setLast] = useState<string>("Drag a card, or focus its grip and press Space.");
  const [n, setN] = useState(9);
  const [cards, setCards] = useState(KANBAN_CARDS);
  const title = (id: string, list: KanbanItem[]) => list.find((c) => c.id === id)?.title ?? id;
  const name = (id: string) => KANBAN_COLUMNS.find((c) => c.id === id)?.title ?? id;
  function change(next: KanbanItem[], move?: KanbanMove) {
    setCards(next);
    if (move) setLast(`Moved "${title(move.id, next)}" from ${name(move.from)} to ${name(move.to)}, position ${move.index + 1}.`);
  }
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button3D
          variant="neutral"
          onClick={() => {
            setCards((c) => [{ id: `k${n}`, columnId: "todo", title: `New task ${n - 8}`, tag: "Task" }, ...c]);
            setN((x) => x + 1);
          }}
        >
          Add task
        </Button3D>
        <p className="text-xs text-depth-muted" role="status">{last}</p>
      </div>
      <Kanban3D columns={KANBAN_COLUMNS} cards={cards} onCardsChange={change} />
    </div>
  );
}
