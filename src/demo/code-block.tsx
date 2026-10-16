import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/** Tiny dependency-free highlighter: comments, strings, keywords, numbers, JSX tags. */
const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\b(import|export|from|const|let|function|return|type|interface|extends|default|if|else|new|as|true|false|null|undefined|void|typeof|in|of|npm|install)\b|\b(\d+(?:\.\d+)?)\b|(<\/?[A-Z][A-Za-z0-9.]*)/g;

const CLASSES = [
  "",
  "italic text-depth-muted",
  "text-emerald-700 dark:text-emerald-300",
  "text-violet-700 dark:text-violet-300",
  "text-amber-700 dark:text-amber-300",
  "text-sky-700 dark:text-cyan-300",
];

function highlight(code: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of code.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(code.slice(last, start));
    const kind = m.findIndex((v, i) => i > 0 && v !== undefined);
    out.push(
      <span key={key++} className={CLASSES[kind]}>
        {m[0]}
      </span>,
    );
    last = start + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CodeBlock({
  code,
  className,
  maxHeight = 460,
}: {
  code: string;
  className?: string;
  maxHeight?: number;
}) {
  const [copied, setCopied] = useState(false);
  const nodes = useMemo(() => highlight(code), [code]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className={cn("relative rounded-xl border border-depth-border bg-depth-elevated", className)}>
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 z-10 rounded-md border border-depth-border bg-depth-surface px-2.5 py-1 font-mono text-xs text-depth-muted outline-none transition-colors hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre
        className="overflow-auto p-4 pr-20 font-mono text-[13px] leading-relaxed text-depth-text"
        style={{ maxHeight }}
        tabIndex={0}
      >
        <code>{nodes}</code>
      </pre>
    </div>
  );
}
