import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

/**
 * TextReveal — a paragraph that lights up word by word as you scroll past
 * it. Driven by scroll progress, so it never re-renders React.
 */
export interface TextRevealProps {
  text: string;
  /** Opacity of words that have not been reached yet. */
  dim?: number;
  className?: string;
}

export function TextReveal({ text, dim = 0.15, className }: TextRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = !!useReducedMotion();
  const scrollYProgress = useScrollProgress(ref, ["top", 0.9], ["bottom", 0.7]);
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <p ref={ref} className={cn("flex flex-wrap gap-x-[0.28em]", className)}>
      {words.map((w, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          dim={reduced ? 1 : dim}
        >
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  dim,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  dim: number;
}) {
  const opacity = useTransform(progress, range, [dim, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
