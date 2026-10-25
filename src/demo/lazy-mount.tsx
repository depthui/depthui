import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Mounts its children only while they are near the viewport.
 *
 * The landing page shows dozens of live 3D pieces, and many of them run their
 * own animation loop. Rendering them all at once makes the page lag, so each
 * one mounts shortly before it scrolls into view and (by default) unmounts
 * again when it is far away, which stops its animation and frees its memory.
 * While it is unmounted a placeholder keeps the last measured height, so the
 * page does not jump.
 */
export function LazyMount({
  children,
  className,
  rootMargin = "400px 0px",
  minHeight = 220,
  unmount = true,
}: {
  children: ReactNode;
  className?: string;
  /** How far outside the viewport counts as "near". */
  rootMargin?: string;
  /** Placeholder height before the first mount, in px. */
  minHeight?: number;
  /** Unmount again when scrolled far away. Turn off for things that must keep their state. */
  unmount?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const height = useRef(minHeight);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setOn(true);
        else if (unmount) {
          if (el.offsetHeight > 0) height.current = el.offsetHeight;
          setOn(false);
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, unmount]);

  return (
    <div ref={ref} className={cn(className)} style={on ? undefined : { minHeight: height.current }}>
      {on ? children : null}
    </div>
  );
}
