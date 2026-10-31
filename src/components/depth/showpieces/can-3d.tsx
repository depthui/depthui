import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Can3D — a product can. The label wraps all the way round a real cylinder,
 * built from thin vertical slices that each show their own strip of one label
 * image, with metal rims top and bottom. It turns on its own and pauses when
 * you hover or focus it. A fixed highlight on top sells the metal. Needs
 * depth-motion.css.
 */
export interface Can3DProps {
  /** Brand text printed round the label. */
  name?: string;
  /** Two label colours. */
  colors?: [string, string];
  /** Can width in px. */
  width?: number;
  /** Seconds per turn. */
  seconds?: number;
  /** Extra classes added to the outer element. */
  className?: string;
}

export function Can3D({ name = "DEPTH COLA", colors = ["#7c3aed", "#ec4899"], width = 120, seconds = 10, className }: Can3DProps) {
  const [paused, setPaused] = useState(false);
  const slices = 40;
  const r = width / 2;
  const height = width * 1.9;
  const circ = 2 * Math.PI * r;
  const sliceW = circ / slices;

  const label = useMemo(() => {
    const W = 800;
    const H = 400;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
      <rect y="${H * 0.42}" width="${W}" height="${H * 0.16}" fill="rgba(255,255,255,.9)"/>
      <text x="${W * 0.25}" y="${H * 0.545}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${H * 0.115}" fill="${colors[0]}">${name}</text>
      <text x="${W * 0.75}" y="${H * 0.545}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${H * 0.115}" fill="${colors[1]}">${name}</text>
      <circle cx="${W * 0.5}" cy="${H * 0.2}" r="${H * 0.08}" fill="rgba(255,255,255,.85)"/>
      <circle cx="${W * 0.0}" cy="${H * 0.2}" r="${H * 0.08}" fill="rgba(255,255,255,.85)"/>
      <circle cx="${W * 0.5}" cy="${H * 0.82}" r="${H * 0.05}" fill="rgba(255,255,255,.6)"/>
      <circle cx="${W * 0.0}" cy="${H * 0.82}" r="${H * 0.05}" fill="rgba(255,255,255,.6)"/>
    </svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [name, colors]);

  return (
    <div
      role="img"
      aria-label={`${name} can, turning`}
      tabIndex={0}
      onPointerEnter={(e) => e.pointerType !== "touch" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn("relative rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-4 focus-visible:ring-offset-depth-bg", className)}
      style={{ width: width * 1.5, height: height + width * 0.5, perspective: 1000 }}
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateX(-12deg)" }}>
        <div
          className="depth-rot-y absolute left-1/2"
          style={{ top: width * 0.25, width: 2, height, transformStyle: "preserve-3d", animationDuration: `${seconds}s`, animationPlayState: paused ? "paused" : "running" }}
        >
          {Array.from({ length: slices }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute top-0 block backface-hidden"
              style={{
                width: sliceW + 1,
                height,
                left: -(sliceW + 1) / 2,
                transform: `rotateY(${(i * 360) / slices}deg) translateZ(${r}px)`,
                backgroundImage: label,
                backgroundSize: `${circ}px 100%`,
                backgroundPosition: `${-i * sliceW}px 0`,
              }}
            />
          ))}
          {/* rims and lids */}
          {[0, height].map((y, k) => (
            <span key={k} aria-hidden className="absolute block rounded-full" style={{ width: width * 0.96, height: width * 0.96, left: -width * 0.48, top: y - width * 0.48, transform: "rotateX(90deg)", background: "radial-gradient(circle, #f3f4f6 0 38%, #9ca3af 40% 62%, #e5e7eb 64%)" }} />
          ))}
        </div>
      </div>
      {/* fixed highlight, so the metal looks lit from one side while it turns */}
      <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-md mix-blend-soft-light" style={{ top: width * 0.25, width, height, background: "linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,0) 22%, rgba(255,255,255,.75) 34%, rgba(255,255,255,0) 48%, rgba(0,0,0,.2) 78%, rgba(0,0,0,.6))" }} />
      <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-black/30 blur-md" style={{ bottom: 6, width: width * 1.1, height: width * 0.18 }} />
    </div>
  );
}
