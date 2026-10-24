import { useEffect, useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * TagCloud3D — tags spread evenly over a sphere that turns in space.
 * Each frame the tag positions are rotated in plain maths and written
 * straight to the DOM as transform and opacity (no React re-renders), so
 * 30+ tags stay smooth. Drag to spin, hover or focus to slow it down.
 * Tags can be links. Under prefers-reduced-motion it shows a still sphere.
 */
export interface CloudTag {
  label: string;
  href?: string;
}

export interface TagCloud3DProps {
  tags: (string | CloudTag)[];
  /** Diameter in px. */
  size?: number;
  /** Idle speed, radians per second. */
  speed?: number;
  className?: string;
  tagClassName?: string;
}

export function TagCloud3D({ tags, size = 340, speed = 0.35, className, tagClassName }: TagCloud3DProps) {
  const reduced = !!useReducedMotion();
  const items = tags.map((t) => (typeof t === "string" ? { label: t } : t));
  const refs = useRef<(HTMLElement | null)[]>([]);
  const state = useRef({ yaw: 0.4, pitch: 0.25, vx: 0, vy: 0, hover: false, drag: false });
  const R = size / 2 - 28;

  // Fibonacci sphere: even spacing without clumping at the poles.
  const points = useRef<{ x: number; y: number; z: number }[]>([]);
  if (points.current.length !== items.length) {
    const n = items.length;
    points.current = items.map((_, i) => {
      const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
    });
  }

  const paint = () => {
    const { yaw, pitch } = state.current;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    points.current.forEach((p, i) => {
      const el = refs.current[i];
      if (!el) return;
      const x1 = p.x * cy + p.z * sy;
      const z1 = -p.x * sy + p.z * cy;
      const y2 = p.y * cp - z1 * sp;
      const z2 = p.y * sp + z1 * cp;
      const depth = (z2 + 1) / 2; // 0 back, 1 front
      el.style.transform = `translate3d(${x1 * R}px, ${y2 * R}px, 0) translate(-50%, -50%) scale(${0.65 + depth * 0.55})`;
      el.style.opacity = String(0.25 + depth * 0.75);
      el.style.zIndex = String(Math.round(depth * 100));
      el.style.pointerEvents = depth < 0.3 ? "none" : "auto";
    });
  };

  useEffect(paint, [items.length, size]); // eslint-disable-line react-hooks/exhaustive-deps

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const s = state.current;
    const dt = delta / 1000;
    const base = s.hover || s.drag ? speed * 0.25 : speed;
    s.yaw += (base + s.vx) * dt;
    s.pitch += s.vy * dt;
    s.pitch = Math.max(-1.1, Math.min(1.1, s.pitch));
    s.vx *= 0.94;
    s.vy *= 0.94;
    paint();
  });

  const tagCls =
    "absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-depth-border bg-depth-surface px-3 py-1 text-sm font-medium text-depth-text shadow-sm outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-depth-accent";

  return (
    <div
      className={cn("relative touch-none select-none", className)}
      style={{ width: size, height: size }}
      role="list"
      aria-label="Tags"
      onPointerEnter={(e) => e.pointerType !== "touch" && (state.current.hover = true)}
      onPointerLeave={() => {
        state.current.hover = false;
        state.current.drag = false;
      }}
      onPointerDown={() => (state.current.drag = true)}
      onPointerUp={() => (state.current.drag = false)}
      onPointerMove={(e) => {
        if (!state.current.drag) return;
        state.current.vx += e.movementX * 0.02;
        state.current.vy -= e.movementY * 0.02;
      }}
    >
      {items.map((t, i) =>
        t.href ? (
          <a
            key={t.label + i}
            role="listitem"
            ref={(el) => {
              refs.current[i] = el;
            }}
            href={t.href}
            className={cn(tagCls, tagClassName)}
          >
            {t.label}
          </a>
        ) : (
          <span
            key={t.label + i}
            role="listitem"
            tabIndex={0}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn(tagCls, tagClassName)}
          >
            {t.label}
          </span>
        ),
      )}
    </div>
  );
}
