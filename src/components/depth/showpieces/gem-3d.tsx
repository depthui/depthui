import { useMemo, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Gem3D — a cut gem: a flat table on top, a crown of angled facets, and a
 * pavilion that comes to a point. The faces are translucent, so you see the
 * far facets through the near ones, and a few flash as it turns. Faces are
 * clip-path polygons placed with rotate and translateZ. Needs depth-motion.css.
 */
export interface Gem3DProps {
  /** Girdle diameter in px. */
  size?: number;
  /** Number of sides, 6 to 12. */
  sides?: number;
  /** Base hue in degrees (0 red, 200 blue, 280 violet). */
  hue?: number;
  /** Seconds per turn. */
  seconds?: number;
  className?: string;
}

export function Gem3D({ size = 200, sides = 8, hue = 265, seconds = 12, className }: Gem3DProps) {
  const n = Math.min(12, Math.max(6, sides));
  const r = size / 2;
  const rt = r * 0.56; // table radius
  const hc = size * 0.26; // crown height
  const hp = size * 0.5; // pavilion height
  const step = 360 / n;
  const cos = Math.cos(Math.PI / n);
  const sin = Math.sin(Math.PI / n);

  const f = useMemo(() => {
    const wb = 2 * r * sin;
    const wt = 2 * rt * sin;
    const ab = r * cos;
    const at = rt * cos;
    return {
      wb,
      ab,
      crownL: Math.hypot(hc, ab - at),
      crownTilt: (Math.atan2(ab - at, hc) * 180) / Math.PI,
      inset: ((wb - wt) / 2 / wb) * 100,
      pavL: Math.hypot(hp, ab),
      pavTilt: (Math.atan2(ab, hp) * 180) / Math.PI,
    };
  }, [r, rt, hc, hp, cos, sin]);

  const shade = (i: number, base: number) => `hsl(${hue + (i % 4) * 9} 88% ${base + (i % 2) * 14}% / .82)`;
  const box: CSSProperties = { width: size * 1.4, height: size * 1.1, perspective: 900 };

  return (
    <div role="img" aria-label="A turning cut gem" className={cn("relative", className)} style={box}>
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateX(-16deg)" }}>
        <div
          className="depth-rot-y absolute left-1/2"
          style={{ top: hc + size * 0.1, width: 2, height: 2, transformStyle: "preserve-3d", animationDuration: `${seconds}s` }}
        >
          {/* crown facets, flaring up from the girdle */}
          {Array.from({ length: n }, (_, i) => (
            <span
              key={`c${i}`}
              aria-hidden
              className="absolute block"
              style={{
                width: f.wb,
                height: f.crownL,
                left: -f.wb / 2,
                top: -f.crownL,
                transformOrigin: "50% 100%",
                transform: `rotateY(${i * step}deg) translateZ(${f.ab}px) rotateX(${f.crownTilt}deg)`,
                clipPath: `polygon(${f.inset}% 0, ${100 - f.inset}% 0, 100% 100%, 0 100%)`,
                background: `linear-gradient(${i % 2 ? 160 : 200}deg, ${shade(i, 58)}, ${shade(i + 1, 36)})`,
              }}
            >
              {i % 3 === 0 && <span className="depth-sparkle absolute inset-0 bg-white" style={{ animationDelay: `${i * 0.35}s` }} />}
            </span>
          ))}
          {/* table */}
          <span
            aria-hidden
            className="absolute block"
            style={{
              width: rt * 2,
              height: rt * 2,
              left: -rt,
              top: -rt - hc,
              transform: "rotateX(90deg)",
              clipPath: `polygon(${Array.from({ length: n }, (_, i) => `${50 + 50 * Math.cos(i * (2 * Math.PI) / n)}% ${50 + 50 * Math.sin(i * (2 * Math.PI) / n)}%`).join(",")})`,
              background: `linear-gradient(135deg, hsl(${hue} 90% 88% / .9), hsl(${hue + 20} 90% 66% / .85))`,
            }}
          />
          {/* pavilion facets, narrowing to the point */}
          {Array.from({ length: n }, (_, i) => (
            <span
              key={`p${i}`}
              aria-hidden
              className="absolute block"
              style={{
                width: f.wb,
                height: f.pavL,
                left: -f.wb / 2,
                top: 0,
                transformOrigin: "50% 0%",
                transform: `rotateY(${i * step}deg) translateZ(${f.ab}px) rotateX(${-f.pavTilt}deg)`,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: `linear-gradient(${i % 2 ? 20 : -20}deg, ${shade(i, 30)}, ${shade(i + 2, 52)})`,
              }}
            >
              {i % 4 === 1 && <span className="depth-sparkle absolute inset-0 bg-white" style={{ animationDelay: `${i * 0.5}s` }} />}
            </span>
          ))}
        </div>
      </div>
      <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full blur-2xl" style={{ bottom: 0, width: size * 0.9, height: size * 0.14, background: `hsl(${hue} 90% 60% / .35)` }} />
    </div>
  );
}
