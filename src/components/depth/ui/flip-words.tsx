import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * FlipWords — cycles through a list of words with a 3D flip, so one word in
 * a headline can keep changing. The width is reserved for the longest word,
 * so surrounding text never jumps. Screen readers get the full list once
 * instead of every change.
 */
export interface FlipWordsProps {
  words: string[];
  /** Milliseconds each word stays. */
  interval?: number;
  className?: string;
}

export function FlipWords({ words, interval = 2400, className }: FlipWordsProps) {
  const reduced = !!useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => window.clearInterval(t);
  }, [words.length, interval]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span
      className={cn("relative inline-grid align-baseline", className)}
      style={{ perspective: 600 }}
    >
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {longest}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          aria-hidden
          initial={{ opacity: 0, rotateX: reduced ? 0 : -90, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: reduced ? 0 : 90, y: reduced ? 0 : -10 }}
          transition={{ duration: reduced ? 0.15 : 0.35, ease: "easeOut" }}
          className="col-start-1 row-start-1 inline-block text-left"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
