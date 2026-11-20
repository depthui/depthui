import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * PasswordInput3D — a password field with a show and hide button and an
 * optional strength meter. Strength is scored from length and variety of
 * characters (a simple guide, not a security guarantee), and the result is
 * announced politely to screen readers as the person types.
 */
export interface PasswordInput3DProps {
  /** Current value. Set it to control the component. */
  value?: string;
  /** Called with the new value on every change. */
  onValueChange?: (value: string) => void;
  /** Hint shown while the field is empty. */
  placeholder?: string;
  /** Show the strength meter under the field. */
  showStrength?: boolean;
  /** Browser autofill hint: "current-password" to log in, "new-password" to sign up. */
  autoComplete?: "current-password" | "new-password";
  /** Required: names the field for screen readers. */
  "aria-label": string;
  /** Extra classes added to the outer element. */
  className?: string;
}

const LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;
const COLORS = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"] as const;

/** 0 to 4. */
export function scorePassword(p: string) {
  if (!p) return 0;
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;
  let s = (p.length >= 8 ? 1 : 0) + (p.length >= 12 ? 1 : 0) + (kinds >= 3 ? 1 : 0) + (kinds === 4 && p.length >= 10 ? 1 : 0);
  if (p.length < 6) s = Math.min(s, 1);
  return Math.min(4, Math.max(p.length ? 1 : 0, s));
}

export function PasswordInput3D({ value: valueProp, onValueChange, placeholder = "Password", showStrength, autoComplete = "current-password", "aria-label": ariaLabel, className }: PasswordInput3DProps) {
  const uid = useId();
  const [inner, setInner] = useState("");
  const [shown, setShown] = useState(false);
  const value = valueProp ?? inner;
  const score = scorePassword(value);

  return (
    <div className={cn("w-full max-w-xs", className)}>
      <div className="relative">
        <input
          type={shown ? "text" : "password"}
          aria-label={ariaLabel}
          aria-describedby={showStrength ? `${uid}-s` : undefined}
          autoComplete={autoComplete}
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChange={(e) => { if (valueProp === undefined) setInner(e.target.value); onValueChange?.(e.target.value); }}
          className="h-11 w-full rounded-xl border border-depth-border bg-depth-elevated pl-3.5 pr-11 text-sm shadow-[inset_0_2px_5px_rgb(0_0_0/0.14)] outline-none placeholder:text-depth-muted focus-visible:ring-2 focus-visible:ring-depth-accent"
        />
        <button
          type="button"
          aria-label="Show password"
          aria-pressed={shown}
          onClick={() => setShown((s) => !s)}
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-depth-muted outline-none transition-colors hover:bg-depth-surface hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-4.5 w-4.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
            {!shown && <path d="M4 4l16 16" />}
          </svg>
        </button>
      </div>
      {showStrength && (
        <div id={`${uid}-s`} className="mt-2.5">
          <div aria-hidden className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", value && i <= score ? COLORS[score] : "bg-depth-border")} />
            ))}
          </div>
          <p role="status" className="mt-1.5 text-xs text-depth-muted">{value ? `Strength: ${LABELS[score]}` : "Use 12 or more characters with a mix of types."}</p>
        </div>
      )}
    </div>
  );
}
