import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Dock3D — icons magnify as the pointer approaches, on a tilted glass shelf.
 *
 * This is the one component that animates size (neighbours have to make room),
 * so keep the item count small. Everything else here only animates transform.
 */
export interface DockItem {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export interface Dock3DProps {
  items: DockItem[];
  /** Resting icon size in px. */
  baseSize?: number;
  /** Size multiplier directly under the pointer. */
  magnification?: number;
  /** Pointer distance (px) over which magnification fades out. */
  distance?: number;
  className?: string;
}

export function Dock3D({
  items,
  baseSize = 48,
  magnification = 1.7,
  distance = 140,
  className,
}: Dock3DProps) {
  const reduced = !!useReducedMotion();
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ perspective: 700, paddingTop: baseSize * (magnification - 1) + 28 }}
    >
      <motion.div
        onPointerMove={(e) => {
          if (reduced || e.pointerType === "touch") return;
          mouseX.set(e.clientX);
        }}
        onPointerLeave={() => mouseX.set(Infinity)}
        className="relative flex items-end gap-3 px-4 pb-3"
      >
        {/* tilted glass shelf */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-14 rounded-2xl border border-depth-border bg-depth-elevated/80 shadow-[0_20px_40px_-20px_var(--depth-shadow)]"
          style={{ transform: "rotateX(52deg)", transformOrigin: "bottom" }}
        />
        {items.map((item) => (
          <DockIcon
            key={item.label}
            item={item}
            mouseX={mouseX}
            baseSize={baseSize}
            magnification={magnification}
            distance={distance}
          />
        ))}
      </motion.div>
    </div>
  );
}

function DockIcon({
  item,
  mouseX,
  baseSize,
  magnification,
  distance,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  baseSize: number;
  magnification: number;
  distance: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const delta = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const target = useTransform(
    delta,
    [-distance, 0, distance],
    [baseSize, baseSize * magnification, baseSize],
  );
  const size = useSpring(target, { mass: 0.1, stiffness: 180, damping: 14 });

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={item.onClick}
      aria-label={item.label}
      style={{ width: size, height: size }}
      className="group relative flex items-center justify-center rounded-xl border border-depth-border bg-depth-surface text-depth-text shadow-lg outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent"
    >
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-depth-border bg-depth-surface px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {item.label}
      </span>
      <span className="flex h-1/2 w-1/2 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
        {item.icon}
      </span>
    </motion.button>
  );
}
