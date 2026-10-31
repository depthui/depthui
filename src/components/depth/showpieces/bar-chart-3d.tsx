import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * BarChart3D — extruded bars with a lit front, a shaded side and a bright top.
 * Bars grow from the floor when the chart scrolls into view (transform only),
 * and hovering or tapping a bar shows its value. A hidden table gives screen
 * readers the data.
 */
export interface BarDatum {
  label: string;
  value: number;
  /** Any CSS colour or var(), e.g. "var(--depth-accent-2)". */
  color?: string;
}

export interface BarChart3DProps {
  /** Bars to draw, each with a label and a number. */
  data: BarDatum[];
  /** Plot height in px. */
  height?: number;
  /** Bar depth (the extrusion) in px. */
  depth?: number;
  /** Format the value label. */
  format?: (v: number) => string;
  /** Extra classes added to the outer element. */
  className?: string;
}

const PALETTE = ["var(--depth-accent)", "var(--depth-accent-2)", "var(--depth-accent-3)"];
const mix = (c: string, w: string, p: number) => `color-mix(in oklab, ${c} ${100 - p}%, ${w})`;

export function BarChart3D({
  data,
  height = 240,
  depth = 22,
  format = (v) => v.toLocaleString(),
  className,
}: BarChart3DProps) {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <table className="sr-only">
        <caption>Bar chart data</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{format(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div aria-hidden className="relative" style={{ paddingTop: depth + 28, paddingRight: depth }}>
        {/* floor gridlines */}
        <div className="absolute inset-x-0" style={{ top: depth + 28, height }}>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <div key={t} className="absolute inset-x-0 border-t border-dashed border-depth-border/70" style={{ top: `${t * 100}%` }} />
          ))}
        </div>
        <div className="relative flex items-end justify-around gap-2 sm:gap-4" style={{ height }}>
          {data.map((d, i) => (
            <Bar
              key={d.label}
              d={d}
              index={i}
              h={Math.max(4, (d.value / max) * height)}
              depth={depth}
              play={inView}
              reduced={reduced}
              active={active === i}
              onActive={(on) => setActive(on ? i : null)}
              format={format}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-around gap-2 sm:gap-4">
          {data.map((d) => (
            <span key={d.label} className="min-w-0 flex-1 truncate text-center font-mono text-[11px] text-depth-muted">
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bar({
  d,
  index,
  h,
  depth,
  play,
  reduced,
  active,
  onActive,
  format,
}: {
  d: BarDatum;
  index: number;
  h: number;
  depth: number;
  play: boolean;
  reduced: boolean;
  active: boolean;
  onActive: (on: boolean) => void;
  format: (v: number) => string;
}) {
  const color = d.color ?? PALETTE[index % PALETTE.length];
  const p: MotionValue<number> = useMotionValue(reduced ? 1 : 0);
  const topY = useTransform(p, (v) => (1 - v) * h);

  useEffect(() => {
    if (!play || reduced) return;
    const c = animate(p, 1, { duration: 0.9, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [play, reduced, index, p]);

  return (
    <div
      onPointerEnter={(e) => e.pointerType !== "touch" && onActive(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && onActive(false)}
      onClick={() => onActive(!active)}
      className="relative min-w-0 flex-1 cursor-default"
      style={{ height: h, maxWidth: 72 }}
    >
      {/* value label */}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-depth-border bg-depth-surface px-2 py-0.5 font-mono text-[11px] shadow-md transition-opacity duration-150",
          active ? "opacity-100" : "opacity-0",
        )}
        style={{ top: -depth - 26 }}
      >
        {format(d.value)}
      </span>
      <motion.div
        className="absolute inset-0 transition-[filter] duration-150"
        style={{ filter: active ? "brightness(1.12) saturate(1.1)" : undefined }}
      >
        {/* front */}
        <motion.div
          className="absolute inset-0 rounded-b-[3px]"
          style={{
            background: `linear-gradient(to top, ${mix(color, "black", 12)}, ${color})`,
            scaleY: p,
            transformOrigin: "bottom",
          }}
        />
        {/* right side */}
        <motion.div
          className="absolute bottom-0 left-full"
          style={{
            width: depth,
            height: h,
            background: mix(color, "black", 38),
            scaleY: p,
            transformOrigin: "left bottom",
            skewY: -45,
          }}
        />
        {/* top */}
        <motion.div
          className="absolute left-0 w-full"
          style={{
            top: 0,
            height: depth,
            y: topY,
            background: mix(color, "white", 30),
            transformOrigin: "left bottom",
            skewX: -45,
            marginTop: -depth,
          }}
        />
      </motion.div>
    </div>
  );
}
