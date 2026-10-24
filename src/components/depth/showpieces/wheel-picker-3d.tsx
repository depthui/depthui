import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * WheelPicker3D — an iOS-style picker. Options sit on a cylinder you turn by
 * dragging, scrolling the mouse wheel, clicking an option, or pressing the
 * arrow keys. It snaps to the nearest option and reports it through onChange.
 * Works as a controlled (`value`) or uncontrolled (`defaultValue`) input.
 */
export interface WheelPicker3DProps {
  options: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Accessible name. */
  label: string;
  /** Row height in px. */
  itemHeight?: number;
  className?: string;
}

const STEP = 20; // degrees between options

export function WheelPicker3D({
  options,
  value,
  defaultValue,
  onChange,
  label,
  itemHeight = 40,
  className,
}: WheelPicker3DProps) {
  const reduced = !!useReducedMotion();
  const [inner, setInner] = useState(() => Math.max(0, options.indexOf(defaultValue ?? options[0])));
  const selected = value !== undefined ? Math.max(0, options.indexOf(value)) : inner;
  const pos = useMotionValue(selected * STEP); // degrees along the cylinder
  const rotateX = useTransform(pos, (v) => -v);
  // Only options near the front are rendered. With more than 360/STEP options
  // the far ones would wrap round the cylinder and land on top of the others.
  const [center, setCenter] = useState(selected);
  useMotionValueEvent(pos, "change", (v) => {
    const c = Math.round(v / STEP);
    setCenter((p) => (p === c ? p : c));
  });
  const radius = itemHeight / 2 / Math.tan((STEP / 2) * (Math.PI / 180));
  const last = options.length - 1;
  const dragging = useRef(false);
  const wheelAcc = useRef(0);

  const goTo = (i: number, notify = true) => {
    const idx = Math.min(last, Math.max(0, i));
    animate(pos, idx * STEP, reduced ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 26 });
    if (notify && idx !== selected) {
      if (value === undefined) setInner(idx);
      onChange?.(options[idx]);
    }
  };

  // Follow external value changes.
  useEffect(() => {
    if (!dragging.current) goTo(selected, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={selected}
      aria-valuemin={0}
      aria-valuemax={last}
      aria-valuetext={options[selected]}
      onKeyDown={(e) => {
        const k = e.key;
        if (k === "ArrowDown" || k === "ArrowRight") goTo(selected + 1);
        else if (k === "ArrowUp" || k === "ArrowLeft") goTo(selected - 1);
        else if (k === "PageDown") goTo(selected + 3);
        else if (k === "PageUp") goTo(selected - 3);
        else if (k === "Home") goTo(0);
        else if (k === "End") goTo(last);
        else return;
        e.preventDefault();
      }}
      onWheel={(e) => {
        wheelAcc.current += e.deltaY;
        if (Math.abs(wheelAcc.current) > 40) {
          goTo(selected + Math.sign(wheelAcc.current));
          wheelAcc.current = 0;
        }
      }}
      className={cn(
        "relative w-44 touch-none select-none rounded-2xl border border-depth-border bg-depth-surface outline-none focus-visible:ring-2 focus-visible:ring-depth-accent",
        className,
      )}
      style={{
        height: itemHeight * 5,
        perspective: 600,
        maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
      }}
    >
      {/* selection band */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2 rounded-lg border-y border-depth-accent/40 bg-depth-accent/10"
        style={{ top: itemHeight * 2, height: itemHeight }}
      />
      <motion.div
        aria-hidden
        onPanStart={() => {
          dragging.current = true;
          pos.stop();
        }}
        onPan={(_, info) => pos.set(Math.min(last * STEP, Math.max(0, pos.get() - info.delta.y * 0.45)))}
        onPanEnd={() => {
          dragging.current = false;
          goTo(Math.round(pos.get() / STEP));
        }}
        className="absolute inset-x-0 cursor-grab active:cursor-grabbing"
        style={{ top: itemHeight * 2, height: itemHeight, transformStyle: "preserve-3d", rotateX }}
      >
        {options.map((o, i) =>
          Math.abs(i - center) > 5 ? null : (
          <div
            key={o}
            onClick={() => goTo(i)}
            className={cn(
              "backface-hidden absolute inset-0 flex items-center justify-center text-lg font-medium",
              i === selected ? "text-depth-text" : "text-depth-muted",
            )}
            style={{ transform: `rotateX(${i * STEP}deg) translateZ(${radius}px)` }}
          >
            {o}
          </div>
          ),
        )}
      </motion.div>
    </div>
  );
}
