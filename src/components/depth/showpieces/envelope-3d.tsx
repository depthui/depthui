import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Envelope3D — an envelope whose flap swings open in 3D and lets the
 * letter rise out. Click, tap, Enter or Space toggles it. `children` is the
 * letter's content.
 */
export interface Envelope3DProps {
  /** Content of the letter inside the envelope. */
  children?: ReactNode;
  /** Width in px. */
  width?: number;
  /** Controlled open state. */
  open?: boolean;
  /** Called with the new open state whenever it changes. */
  onOpenChange?: (open: boolean) => void;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Envelope3D({ children, width = 300, open: openProp, onOpenChange, className }: Envelope3DProps) {
  const reduced = !!useReducedMotion();
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const h = width * 0.66;
  const set = (v: boolean) => {
    if (openProp === undefined) setInner(v);
    onOpenChange?.(v);
  };
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 120, damping: 18 };

  return (
    <button
      type="button"
      aria-pressed={open}
      aria-label={open ? "Close envelope" : "Open envelope"}
      onClick={() => set(!open)}
      className={cn(
        "relative block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg",
        className,
      )}
      style={{ width, height: h, perspective: 1100, marginTop: h * 0.6 }}
    >
      <span aria-hidden className="absolute inset-0 rounded-xl bg-gradient-to-br from-depth-accent/90 to-depth-accent-2/90" />

      {/* letter */}
      <motion.span
        animate={{ y: open ? -h * 0.62 : 0 }}
        transition={{ ...spring, delay: open && !reduced ? 0.25 : 0 }}
        className="absolute inset-x-[7%] bottom-[6%] top-[8%] overflow-hidden rounded-md border border-depth-border bg-depth-surface p-4 text-left text-sm text-depth-text shadow-md"
        style={{ zIndex: 2 }}
      >
        {children ?? (
          <>
            <span className="block text-xs font-semibold">Hello 👋</span>
            <span className="mt-2 block h-1.5 w-full rounded bg-depth-border" />
            <span className="mt-2 block h-1.5 w-4/5 rounded bg-depth-border" />
          </>
        )}
      </motion.span>

      {/* front pocket: two side triangles and the bottom */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-depth-accent to-depth-accent-2"
        style={{ zIndex: 3, clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }}
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl bg-black/10"
        style={{ zIndex: 3, clipPath: "polygon(0 100%, 50% 45%, 100% 100%)" }}
      />

      {/* flap */}
      <motion.span
        aria-hidden
        animate={{ rotateX: open ? -180 : 0, zIndex: open ? 1 : 4 }}
        transition={spring}
        className="absolute inset-x-0 top-0 block bg-gradient-to-b from-depth-accent to-depth-accent-2"
        style={{
          height: h * 0.55,
          transformOrigin: "50% 0%",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          filter: open ? "brightness(0.85)" : undefined,
        }}
      />
    </button>
  );
}
