import { useRef, type ReactNode } from "react";
import { animate, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Room3D — stand inside a room and look around. Drag to turn your head, and
 * it drifts gently when you let go. The room is a cube seen from the inside:
 * four walls, a floor and a ceiling, placed round a camera at the centre.
 * Give it your own faces, or use the built-in room.
 */
export interface Room3DProps {
  /** Six faces in this order: front, right, back, left, ceiling, floor. */
  faces?: ReactNode[];
  /** Viewport width in px. */
  width?: number;
  /** Viewport height in px. */
  height?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

const P = 520; // perspective distance: larger is a narrower field of view
const S = 1040; // room edge

function wall(tone: string, children?: ReactNode) {
  return (
    <div className="relative h-full w-full" style={{ background: `linear-gradient(180deg, ${tone}, color-mix(in srgb, ${tone} 62%, #000))` }}>
      {children}
    </div>
  );
}
const frame = (l: string, t: string, w: string, h: string, bg: string) => (
  <span aria-hidden className="absolute rounded-sm border-[6px] border-white/85 shadow-lg" style={{ left: l, top: t, width: w, height: h, background: bg }} />
);

function defaultFaces(): ReactNode[] {
  return [
    wall("#7c3aed", <>{frame("14%", "18%", "30%", "36%", "linear-gradient(135deg,#fde68a,#fb7185)")}{frame("56%", "22%", "26%", "28%", "linear-gradient(135deg,#67e8f9,#6366f1)")}<span className="absolute bottom-[10%] left-[10%] right-[10%] h-[14%] rounded-md bg-black/30" /></>),
    wall("#2563eb", <>{frame("22%", "14%", "56%", "52%", "linear-gradient(180deg,#bae6fd,#38bdf8 60%,#16a34a 61%)")}</>),
    wall("#db2777", <>{frame("30%", "20%", "40%", "40%", "linear-gradient(135deg,#fef08a,#f97316)")}<span className="absolute bottom-[8%] left-[38%] h-[22%] w-[24%] rounded-t-full bg-black/30" /></>),
    wall("#0d9488", <>{frame("16%", "16%", "26%", "34%", "linear-gradient(135deg,#f0abfc,#7c3aed)")}{frame("50%", "16%", "32%", "34%", "linear-gradient(135deg,#a7f3d0,#047857)")}</>),
    <div key="c" className="h-full w-full bg-neutral-100" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,.08) 2px, transparent 2px), linear-gradient(rgba(0,0,0,.08) 2px, transparent 2px)", backgroundSize: "25% 25%" }}><span className="absolute inset-[34%] rounded-md bg-amber-200 shadow-[0_0_80px_30px_rgba(253,224,71,.7)]" /></div>,
    <div key="f" className="h-full w-full" style={{ background: "conic-gradient(#1f2937 25%, #e5e7eb 0 50%, #1f2937 0 75%, #e5e7eb 0)", backgroundSize: "25% 25%" }} />,
  ];
}

export function Room3D({ faces, width = 460, height = 300, className }: Room3DProps) {
  const reduced = !!useReducedMotion();
  const list = faces ?? defaultFaces();
  const yaw = useMotionValue(20);
  const pitch = useMotionValue(-4);
  const scene = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const idle = useRef(true);

  useAnimationFrame((_, dt) => {
    if (idle.current && !reduced) yaw.set(yaw.get() + (dt / 1000) * 6);
    if (scene.current) scene.current.style.transform = `translateZ(${P}px) rotateX(${pitch.get()}deg) rotateY(${yaw.get()}deg)`;
  });

  const tf = [
    `translateZ(${-S / 2}px)`,
    `rotateY(90deg) translateZ(${-S / 2}px)`,
    `rotateY(180deg) translateZ(${-S / 2}px)`,
    `rotateY(270deg) translateZ(${-S / 2}px)`,
    `rotateX(-90deg) translateZ(${-S / 2}px)`,
    `rotateX(90deg) translateZ(${-S / 2}px)`,
  ];

  return (
    <div
      role="img"
      aria-label="A room seen from inside. Drag to look around."
      className={cn("relative cursor-grab touch-none select-none overflow-hidden rounded-2xl border border-depth-border bg-black active:cursor-grabbing", className)}
      style={{ width, height, perspective: P }}
      onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; idle.current = false; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        yaw.set(yaw.get() - (e.clientX - drag.current.x) * 0.25);
        pitch.set(Math.max(-70, Math.min(70, pitch.get() + (e.clientY - drag.current.y) * 0.25)));
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => { drag.current = null; animate(pitch, -4, { duration: 1.2 }); window.setTimeout(() => (idle.current = true), 1500); }}
      onPointerCancel={() => { drag.current = null; idle.current = true; }}
    >
      <div ref={scene} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
        {list.slice(0, 6).map((face, i) => (
          <div key={i} aria-hidden className="absolute overflow-hidden" style={{ width: S, height: S, left: -S / 2, top: -S / 2, transform: tf[i] }}>
            {face}
          </div>
        ))}
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,.45)" }} />
    </div>
  );
}
