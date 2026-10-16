import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * GlowInput — a text field with a floating label and a gradient that flows
 * around the border while it has focus. Needs depth-motion.css for the flow.
 * The visible label doubles as the accessible name; errors are announced.
 */
export interface GlowInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  label: string;
  hint?: string;
  error?: string;
}

const FLOW =
  "linear-gradient(90deg, var(--depth-accent), var(--depth-accent-2), var(--depth-accent-3), var(--depth-accent), var(--depth-accent-2), var(--depth-accent-3), var(--depth-accent))";

export function GlowInput({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: GlowInputProps) {
  const uid = useId();
  const inputId = id ?? uid;
  const msgId = `${inputId}-msg`;
  const message = error ?? hint;

  return (
    <div className={className}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl p-px transition-colors",
          error ? "bg-rose-500" : "bg-depth-border",
        )}
      >
        {!error && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
          >
            <span
              className="depth-gradient-x absolute inset-y-0 left-0 w-[200%]"
              style={{ background: FLOW }}
            />
          </span>
        )}
        <div className="relative rounded-[11px] bg-depth-surface">
          <input
            id={inputId}
            placeholder=" "
            aria-invalid={error ? true : undefined}
            aria-describedby={message ? msgId : undefined}
            className="peer block w-full rounded-[11px] bg-transparent px-4 pb-2 pt-6 text-base text-depth-text outline-none placeholder:text-transparent disabled:opacity-50"
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute left-4 top-4 origin-left text-depth-muted transition-transform duration-200",
              "peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-depth-accent",
              "peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-75",
            )}
          >
            {label}
          </label>
        </div>
      </div>
      {message && (
        <p
          id={msgId}
          role={error ? "alert" : undefined}
          className={cn("mt-1.5 px-1 text-xs", error ? "text-rose-500" : "text-depth-muted")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
