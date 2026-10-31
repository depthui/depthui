import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Folder3D — a folder whose front flap tips forward and whose papers fan
 * out on hover, focus or tap. It is one button, so it works by keyboard.
 */
export interface FolderPaper {
  title: string;
  content?: ReactNode;
}

export interface Folder3DProps {
  /** Up to three papers. */
  papers?: FolderPaper[];
  /** Text printed on the folder front. */
  label?: string;
  /** Width in px. */
  width?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Folder3D({
  papers = [{ title: "Brief" }, { title: "Designs" }, { title: "Notes" }],
  label = "Project files",
  width = 240,
  className,
}: Folder3DProps) {
  const reduced = !!useReducedMotion();
  const [open, setOpen] = useState(false);
  const h = width * 0.72;
  const list = papers.slice(0, 3);
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 220, damping: 20 };
  const spread = [-14, 0, 14];
  const lift = [-0.52, -0.62, -0.5];

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={`${label}, ${list.length} files`}
      onPointerEnter={(e) => e.pointerType !== "touch" && setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      className={cn(
        "relative block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg",
        className,
      )}
      style={{ width, height: h, perspective: 900, marginTop: h * 0.55 }}
    >
      {/* back panel with tab */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 top-3 rounded-2xl rounded-tl-none bg-gradient-to-b from-amber-400 to-amber-500" />
      <span aria-hidden className="absolute left-0 top-0 h-5 w-[38%] rounded-t-xl bg-amber-400" />

      {/* papers */}
      {list.map((p, i) => (
        <motion.span
          key={p.title}
          aria-hidden
          animate={{
            y: open ? h * lift[i] : -h * 0.04,
            rotate: open ? spread[i] : 0,
            x: open ? (i - 1) * width * 0.06 : 0,
          }}
          transition={{ ...spring, delay: reduced ? 0 : i * 0.03 }}
          className="absolute inset-x-[6%] bottom-[18%] flex h-[78%] flex-col gap-2 overflow-hidden rounded-lg border border-depth-border bg-depth-surface p-3 text-left shadow-md"
          style={{ zIndex: i + 1, transformOrigin: "50% 100%" }}
        >
          <span className="text-xs font-semibold text-depth-text">{p.title}</span>
          {p.content ?? (
            <>
              <span className="h-1.5 w-full rounded bg-depth-border" />
              <span className="h-1.5 w-4/5 rounded bg-depth-border" />
              <span className="h-1.5 w-3/5 rounded bg-depth-border" />
            </>
          )}
        </motion.span>
      ))}

      {/* front flap */}
      <motion.span
        aria-hidden
        animate={{ rotateX: open ? -28 : 0 }}
        transition={spring}
        className="absolute inset-x-0 bottom-0 flex h-[66%] items-end rounded-2xl bg-gradient-to-b from-amber-300 to-amber-400 p-4 shadow-[0_-8px_20px_-12px_rgba(0,0,0,.35)]"
        style={{ zIndex: 10, transformOrigin: "50% 100%" }}
      >
        <span className="text-sm font-semibold text-amber-950">{label}</span>
      </motion.span>
    </button>
  );
}
