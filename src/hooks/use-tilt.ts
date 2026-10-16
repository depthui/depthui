import { useCallback, useRef } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface UseTiltOptions {
  /** Max rotation in degrees at the card edge. */
  max?: number;
  stiffness?: number;
  damping?: number;
}

export interface TiltApi {
  ref: React.RefObject<HTMLDivElement | null>;
  /** Normalised pointer position, 0..1, springed. 0.5 = centre. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  handlers: {
    onPointerEnter: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerLeave: () => void;
  };
  /** True when motion should be skipped (prefers-reduced-motion). */
  reduced: boolean;
}

/**
 * Shared pointer -> rotation engine.
 *
 * Performance notes:
 *  - Everything is a MotionValue, so pointer moves never trigger React renders.
 *  - The bounding rect is measured once on enter, not on every move.
 *  - Touch pointers are ignored so scrolling stays smooth on mobile.
 *  - Respects prefers-reduced-motion.
 */
export function useTilt({
  max = 12,
  stiffness = 220,
  damping = 22,
}: UseTiltOptions = {}): TiltApi {
  const ref = useRef<HTMLDivElement | null>(null);
  const rect = useRef<DOMRect | null>(null);
  const reducedPref = useReducedMotion();
  const reduced = !!reducedPref;

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const x = useSpring(rawX, { stiffness, damping });
  const y = useSpring(rawY, { stiffness, damping });

  const rotateX = useTransform(y, [0, 1], [max, -max]);
  const rotateY = useTransform(x, [0, 1], [-max, max]);

  const onPointerEnter = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    rect.current = ref.current?.getBoundingClientRect() ?? null;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduced || e.pointerType === "touch") return;
      const r = rect.current ?? ref.current?.getBoundingClientRect();
      if (!r) return;
      rawX.set((e.clientX - r.left) / r.width);
      rawY.set((e.clientY - r.top) / r.height);
    },
    [rawX, rawY, reduced],
  );

  const onPointerLeave = useCallback(() => {
    rect.current = null;
    rawX.set(0.5);
    rawY.set(0.5);
  }, [rawX, rawY]);

  return {
    ref,
    x,
    y,
    rotateX,
    rotateY,
    handlers: { onPointerEnter, onPointerMove, onPointerLeave },
    reduced,
  };
}
