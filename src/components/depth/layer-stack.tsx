import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * LayerStack — isometric stack of layers that explodes apart on hover
 * (desktop), tap (touch) or Enter / Space (keyboard). Good for "how it's built"
 * diagrams and feature explainers.
 */
export interface LayerStackProps {
  /** Layers from bottom to top. */
  layers: ReactNode[];
  /** Edge length of each square layer in px. */
  size?: number;
  /** Z distance between layers when collapsed. */
  gap?: number;
  /** Z distance between layers when exploded. */
  spread?: number;
  className?: string;
  layerClassName?: string;
}

export function LayerStack({
  layers,
  size = 170,
  gap = 6,
  spread = 54,
  className,
  layerClassName,
}: LayerStackProps) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label="Layer stack. Press Enter to explode or collapse."
      onPointerEnter={(e) => e.pointerType !== "touch" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && setOpen(false)}
      onPointerUp={(e) => e.pointerType === "touch" && toggle()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent",
        className,
      )}
      style={{ perspective: 1400, width: size * 1.7, height: size * 1.55 }}
    >
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: "rotateX(58deg) rotateZ(-38deg)",
        }}
      >
        {layers.map((layer, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ z: i * (open ? spread : gap) }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
            style={{ width: size, height: size }}
            className={cn(
              "absolute inset-0 overflow-hidden rounded-2xl border border-depth-border bg-depth-surface/80 shadow-[0_10px_30px_-12px_var(--depth-shadow)]",
              layerClassName,
            )}
          >
            {layer}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
