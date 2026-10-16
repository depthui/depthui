import { useEffect, type RefObject } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

type Edge = "top" | "bottom";
/** [edge of the element, fraction of the viewport height from the top]. */
type Mark = readonly [Edge, number];

/**
 * Scroll progress of an element, 0 to 1, as a motion value.
 *
 * progress is 0 when `from` is reached and 1 when `to` is reached, for example
 *   from: ["top", 1]     the element's top edge enters the bottom of the screen
 *   to:   ["bottom", 1]  its bottom edge reaches the bottom of the screen
 *
 * Unlike framer-motion's `useScroll({ target })`, the element is measured on
 * every scroll frame instead of once, so the result stays correct when the
 * page above it changes height (images loading, accordions, animated
 * sections). That is why it works anywhere on a page. Listeners only run
 * while the element is near the viewport, and nothing re-renders.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  from: Mark,
  to: Mark,
): MotionValue<number> {
  const progress = useMotionValue(0);
  const [fromEdge, fromFrac] = from;
  const [toEdge, toFrac] = to;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const a = r[fromEdge] - vh * fromFrac;
      const b = r[toEdge] - vh * toFrac;
      const span = a - b;
      const p = span === 0 ? 1 : a / span;
      progress.set(Math.min(1, Math.max(0, p)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    let listening = false;
    const on = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      measure();
    };
    const off = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };

    // Only track while the element is within a screen of the viewport.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? on() : off()), {
      rootMargin: "100% 0px 100% 0px",
    });
    io.observe(el);
    measure();

    return () => {
      io.disconnect();
      off();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, progress, fromEdge, fromFrac, toEdge, toFrac]);

  return progress;
}
