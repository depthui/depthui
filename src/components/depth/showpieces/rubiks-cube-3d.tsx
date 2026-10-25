import { useEffect, useRef, useState } from "react";
import { animate, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * RubiksCube3D — a 3x3 cube made of 27 real cubies. Scramble it and layers
 * turn one at a time; Solve plays the same moves backwards. Drag to look
 * around it. The cubies are moved by writing matrices straight to the DOM, so
 * a whole turn costs no React renders.
 */
export interface RubiksCube3DProps {
  /** Edge length of the whole cube in px. */
  size?: number;
  /** Seconds per layer turn when scrambling. */
  turnSeconds?: number;
  className?: string;
}

type Axis = "x" | "y" | "z";
interface Move { axis: Axis; layer: number; dir: 1 | -1 }
interface Cubie {
  i: number; j: number; k: number;
  base: DOMMatrix | null;
  wrap: HTMLDivElement | null;
  inner: HTMLDivElement | null;
}

const COLORS = { f: "#22c55e", b: "#3b82f6", r: "#ef4444", l: "#f97316", u: "#f8fafc", d: "#facc15" };

export function RubiksCube3D({ size = 210, turnSeconds = 0.32, className }: RubiksCube3DProps) {
  const reduced = !!useReducedMotion();
  const S = size / 3;
  const cubies = useRef<Cubie[]>([]);
  if (cubies.current.length === 0) {
    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++)
        for (let k = -1; k <= 1; k++)
          cubies.current.push({ i, j, k, base: null, wrap: null, inner: null });
  }
  const history = useRef<Move[]>([]);
  const alive = useRef(true);
  const [busy, setBusy] = useState(false);
  const rx = useMotionValue(-26);
  const ry = useMotionValue(-38);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    alive.current = true;
    cubies.current.forEach((c) => (c.base = new DOMMatrix().translate(c.i * S, c.j * S, c.k * S)));
    return () => { alive.current = false; };
  }, [S]);

  useAnimationFrame(() => {
    if (!drag.current && !reduced) ry.set(ry.get() + 0.12);
    if (sceneRef.current) sceneRef.current.style.transform = `rotateX(${rx.get()}deg) rotateY(${ry.get()}deg)`;
  });

  const turn = (m: Move, seconds: number) =>
    new Promise<void>((resolve) => {
      const sel = cubies.current.filter((c) => ({ x: c.i, y: c.j, z: c.k })[m.axis] === m.layer);
      const deg = m.dir * 90;
      const fn = `rotate${m.axis.toUpperCase()}`;
      const finish = () => {
        const R = new DOMMatrix().rotate(m.axis === "x" ? deg : 0, m.axis === "y" ? deg : 0, m.axis === "z" ? deg : 0);
        for (const c of sel) {
          if (!c.base || !c.inner || !c.wrap) continue;
          c.base = R.multiply(c.base);
          const p = R.transformPoint(new DOMPoint(c.i, c.j, c.k));
          c.i = Math.round(p.x); c.j = Math.round(p.y); c.k = Math.round(p.z);
          c.inner.style.transform = c.base.toString();
          c.wrap.style.transform = "none";
        }
        resolve();
      };
      if (seconds === 0) return finish();
      animate(0, deg, {
        duration: seconds,
        ease: "easeInOut",
        onUpdate: (a) => sel.forEach((c) => c.wrap && (c.wrap.style.transform = `${fn}(${a}deg)`)),
        onComplete: finish,
      });
    });

  const run = async (moves: Move[], seconds: number, record: boolean) => {
    setBusy(true);
    for (const m of moves) {
      if (!alive.current) return;
      await turn(m, reduced ? 0 : seconds);
      if (record) history.current.push(m);
    }
    if (alive.current) setBusy(false);
  };

  const scramble = () => {
    if (busy) return;
    const moves: Move[] = Array.from({ length: 14 }, () => ({
      axis: (["x", "y", "z"] as const)[Math.floor(Math.random() * 3)],
      layer: Math.floor(Math.random() * 3) - 1,
      dir: Math.random() < 0.5 ? 1 : -1,
    }));
    run(moves, turnSeconds, true);
  };

  const solve = () => {
    if (busy || history.current.length === 0) return;
    const back = [...history.current].reverse().map((m) => ({ ...m, dir: (-m.dir) as 1 | -1 }));
    history.current = [];
    run(back, turnSeconds * 0.7, false);
  };

  const faces: [keyof typeof COLORS, string][] = [
    ["f", `translateZ(${S / 2}px)`],
    ["b", `rotateY(180deg) translateZ(${S / 2}px)`],
    ["r", `rotateY(90deg) translateZ(${S / 2}px)`],
    ["l", `rotateY(-90deg) translateZ(${S / 2}px)`],
    ["u", `rotateX(90deg) translateZ(${S / 2}px)`],
    ["d", `rotateX(-90deg) translateZ(${S / 2}px)`],
  ];
  const want = (c: Cubie, f: keyof typeof COLORS) =>
    (f === "f" && c.k === 1) || (f === "b" && c.k === -1) || (f === "r" && c.i === 1) ||
    (f === "l" && c.i === -1) || (f === "d" && c.j === 1) || (f === "u" && c.j === -1);

  return (
    <div className={cn("flex flex-col items-center gap-10", className)}>
      <div
        role="img"
        aria-label="A 3 by 3 puzzle cube. Drag to rotate it."
        className="relative cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ width: size * 1.4, height: size * 1.4, perspective: 900 }}
        onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          ry.set(ry.get() + (e.clientX - drag.current.x) * 0.5);
          rx.set(Math.max(-80, Math.min(80, rx.get() - (e.clientY - drag.current.y) * 0.5)));
          drag.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <div ref={sceneRef} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
          {cubies.current.map((c, idx) => (
            <div key={idx} ref={(n) => { c.wrap = n; }} className="absolute left-0 top-0 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
              <div
                ref={(n) => { c.inner = n; }}
                className="absolute"
                style={{ width: S, height: S, left: -S / 2, top: -S / 2, transformStyle: "preserve-3d", transform: `translate3d(${c.i * S}px,${c.j * S}px,${c.k * S}px)` }}
              >
                {faces.map(([f, t]) => (
                  <span key={f} aria-hidden className="absolute inset-0 block rounded-[3px] bg-neutral-900 backface-hidden" style={{ transform: t }}>
                    {want(c, f) && <span className="absolute inset-[7%] block rounded-[3px]" style={{ background: COLORS[f] }} />}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={scramble} disabled={busy} className="rounded-full bg-depth-accent px-5 py-2 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg disabled:opacity-50">Scramble</button>
        <button type="button" onClick={solve} disabled={busy} className="rounded-full border border-depth-border bg-depth-surface px-5 py-2 text-sm font-semibold outline-none hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent disabled:opacity-50">Solve</button>
      </div>
    </div>
  );
}
