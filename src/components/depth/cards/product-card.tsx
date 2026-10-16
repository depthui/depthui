import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { TiltCard, TiltLayer } from "../tilt-card";
import { cn } from "@/lib/utils";

/**
 * ProductCard — a shop card. The product floats above the card and recolours
 * when you pick a swatch; there is a favourite heart and an add button.
 * Pass `image` to replace the built-in product shape with your own picture.
 */
export interface ProductColor {
  name: string;
  /** Any CSS colour. */
  value: string;
}

export interface ProductCardProps {
  name: string;
  price: number;
  currency?: string;
  description?: string;
  /** 0 to 5. */
  rating?: number;
  colors?: ProductColor[];
  badge?: string;
  image?: ReactNode;
  onAdd?: (color?: ProductColor) => void;
  className?: string;
}

function Stars({ value }: { value: number }) {
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="13" height="13" aria-hidden className={i < Math.round(value) ? "text-amber-400" : "text-depth-border"} fill="currentColor">
          <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
        </svg>
      ))}
    </span>
  );
}

export function ProductCard({
  name,
  price,
  currency = "$",
  description,
  rating,
  colors = [],
  badge,
  image,
  onAdd,
  className,
}: ProductCardProps) {
  const [colorIdx, setColorIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const color = colors[colorIdx];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <TiltCard max={8} className={cn("w-72 p-0", className)}>
      <div className="relative m-2 h-48 rounded-xl bg-depth-elevated">
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-depth-accent px-2.5 py-1 text-[11px] font-semibold text-white">
            {badge}
          </span>
        )}
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          onClick={() => setLiked((l) => !l)}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-depth-border bg-depth-surface outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-depth-accent"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className={liked ? "text-depth-accent-3" : "text-depth-muted"}>
            <path d="M12 20s-7-4.4-9-9.2C1.6 7.2 4 4 7.2 4c1.9 0 3.3 1 4.8 2.8C13.5 5 14.9 4 16.8 4 20 4 22.4 7.2 21 10.8 19 15.6 12 20 12 20z" />
          </svg>
        </button>

        <TiltLayer z={80} className="flex h-full items-center justify-center">
          {image ?? (
            <div className="depth-float relative" aria-hidden>
              <motion.div
                animate={{ backgroundColor: color?.value ?? "var(--depth-accent)" }}
                transition={{ duration: 0.35 }}
                className="h-28 w-28 rotate-12 rounded-[2rem] shadow-[0_24px_40px_-14px_rgb(0_0_0/0.35)]"
              />
              <div className="absolute inset-0 rotate-12 rounded-[2rem] bg-gradient-to-br from-white/45 via-transparent to-black/25" />
            </div>
          )}
        </TiltLayer>
      </div>

      <div className="px-5 pb-5 pt-3">
        <TiltLayer z={35}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold tracking-tight">{name}</h3>
            <span className="font-semibold tabular-nums">
              {currency}
              {price}
            </span>
          </div>
          {typeof rating === "number" && (
            <div className="mt-1">
              <Stars value={rating} />
            </div>
          )}
          {description && <p className="mt-2 text-sm text-depth-muted">{description}</p>}
        </TiltLayer>

        {colors.length > 0 && (
          <TiltLayer z={45} className="mt-4">
            <div role="radiogroup" aria-label="Colour" className="flex gap-2">
              {colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  role="radio"
                  aria-checked={i === colorIdx}
                  aria-label={c.name}
                  onClick={() => setColorIdx(i)}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-surface",
                    i === colorIdx ? "scale-110 border-depth-text" : "border-depth-border hover:scale-105",
                  )}
                  style={{ background: c.value }}
                />
              ))}
            </div>
          </TiltLayer>
        )}

        <TiltLayer z={60} className="mt-4">
          <button
            type="button"
            onClick={() => {
              onAdd?.(color);
              setAdded(true);
              window.clearTimeout(timer.current);
              timer.current = window.setTimeout(() => setAdded(false), 1400);
            }}
            className={cn(
              "w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-surface",
              added ? "bg-emerald-600" : "bg-depth-accent hover:opacity-90",
            )}
          >
            <span aria-live="polite">{added ? "Added to cart" : "Add to cart"}</span>
          </button>
        </TiltLayer>
      </div>
    </TiltCard>
  );
}
