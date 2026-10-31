import { useEffect, useId, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Dropzone3D — drag files onto it, or click (or press Enter) to browse. The
 * zone lifts and glows while files are over it. Chosen files appear below with
 * a size, an image preview when they are pictures, and a remove button. Files
 * that are too big, the wrong type or over the limit are refused with a message
 * that screen readers announce. Files stay in the browser: nothing is uploaded.
 */
export interface Dropzone3DProps {
  /** Allowed types, like the HTML `accept` attribute: "image/*" or ".pdf,.png". Leave out to allow all. */
  accept?: string;
  /** Allow more than one file. */
  multiple?: boolean;
  /** Largest file in megabytes. Bigger files are refused. */
  maxSizeMB?: number;
  /** Most files that can be held at once. */
  maxFiles?: number;
  /** Called with the full list of held files whenever it changes. */
  onFilesChange?: (files: File[]) => void;
  /** Called with a message when a file is refused. */
  onReject?: (message: string) => void;
  /** Main line shown inside the zone. */
  label?: string;
  /** Smaller line under the label. */
  hint?: string;
  /** Stops all interaction and dims the zone. */
  disabled?: boolean;
  /** Extra classes added to the outer element. */
  className?: string;
}

const size = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`);

function matches(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean).some((rule) =>
    rule.startsWith(".") ? file.name.toLowerCase().endsWith(rule) : rule.endsWith("/*") ? file.type.startsWith(rule.slice(0, -1)) : file.type === rule,
  );
}

export function Dropzone3D({
  accept,
  multiple = true,
  maxSizeMB = 10,
  maxFiles = 8,
  onFilesChange,
  onReject,
  label = "Drop files here",
  hint,
  disabled,
  className,
}: Dropzone3DProps) {
  const reduced = !!useReducedMotion();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ key: string; file: File; url?: string }[]>([]);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("");
  const depth = useRef(0);
  const live = useRef(files);
  live.current = files;

  // Free the preview URLs when the component goes away.
  useEffect(() => () => live.current.forEach((f) => f.url && URL.revokeObjectURL(f.url)), []);

  function commit(next: typeof files) {
    setFiles(next);
    onFilesChange?.(next.map((f) => f.file));
  }
  function add(list: FileList | File[] | null) {
    if (!list || disabled) return;
    const incoming = Array.from(list);
    const room = multiple ? maxFiles - files.length : 1;
    const accepted: typeof files = [];
    const problems: string[] = [];
    for (const file of incoming) {
      if (!matches(file, accept)) problems.push(`${file.name} is not an allowed type.`);
      else if (file.size > maxSizeMB * 1048576) problems.push(`${file.name} is larger than ${maxSizeMB} MB.`);
      else if (accepted.length >= room) problems.push(`Only ${multiple ? maxFiles : 1} file${maxFiles === 1 || !multiple ? "" : "s"} allowed.`);
      else accepted.push({ key: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`, file, url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined });
    }
    const message = [...new Set(problems)].join(" ");
    setMsg(message);
    if (message) onReject?.(message);
    if (accepted.length) {
      if (!multiple) files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
      commit(multiple ? [...files, ...accepted] : accepted);
    }
  }
  function remove(key: string) {
    const gone = files.find((f) => f.key === key);
    if (gone?.url) URL.revokeObjectURL(gone.url);
    setMsg("");
    commit(files.filter((f) => f.key !== key));
  }
  const prevent = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current?.click(); } };

  return (
    <div className={cn("w-full max-w-md", className)}>
      <motion.div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-describedby={`${id}-msg`}
        onClick={() => !disabled && input.current?.click()}
        onKeyDown={onKey}
        onDragEnter={(e) => { prevent(e); depth.current++; if (!disabled) setOver(true); }}
        onDragOver={prevent}
        onDragLeave={(e) => { prevent(e); depth.current = Math.max(0, depth.current - 1); if (!depth.current) setOver(false); }}
        onDrop={(e) => { prevent(e); depth.current = 0; setOver(false); add(e.dataTransfer.files); }}
        animate={reduced ? undefined : over ? { y: -4, scale: 1.015 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-9 text-center outline-none transition-colors duration-200",
          "focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg",
          over ? "border-depth-accent bg-depth-accent/10 shadow-[0_18px_40px_-16px_var(--depth-accent)]" : "border-depth-border bg-depth-surface/60 hover:border-depth-accent/60",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <motion.svg aria-hidden viewBox="0 0 24 24" className="h-9 w-9 text-depth-accent" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" animate={reduced ? undefined : { y: over ? -5 : 0 }}>
          <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
        </motion.svg>
        <p className="text-sm font-medium">{over ? "Release to add" : label}</p>
        <p className="text-xs text-depth-muted">{hint ?? `${accept ? accept.replace(/,/g, ", ") : "Any file"} · up to ${maxSizeMB} MB${multiple ? ` · ${maxFiles} files` : ""}`}</p>
        <input ref={input} type="file" hidden tabIndex={-1} accept={accept} multiple={multiple} disabled={disabled} onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      </motion.div>
      <p id={`${id}-msg`} role="status" aria-live="polite" className={cn("mt-2 text-xs", msg ? "text-red-500" : "sr-only")}>{msg}</p>
      <ul className="mt-2 space-y-2" aria-label="Chosen files">
        <AnimatePresence initial={false}>
          {files.map((f) => (
            <motion.li
              key={f.key}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: reduced ? 0 : 0.22 }}
              className="flex items-center gap-3 rounded-xl border border-depth-border bg-depth-surface p-2.5"
            >
              {f.url ? (
                <img src={f.url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
              ) : (
                <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-depth-elevated text-[10px] font-semibold uppercase text-depth-muted">
                  {f.file.name.split(".").pop()?.slice(0, 4) || "file"}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{f.file.name}</p>
                <p className="text-xs text-depth-muted">{size(f.file.size)}</p>
              </div>
              <button type="button" onClick={() => remove(f.key)} aria-label={`Remove ${f.file.name}`} className="rounded-full p-1.5 text-depth-muted outline-none transition-colors hover:bg-depth-elevated hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent">
                <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
