import { Children, isValidElement, useState, type ReactElement, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";
import { PropsTable } from "./props-table";

export interface CodeFile {
  name: string;
  code: string;
}

export interface ShowcaseProps {
  id: string;
  title: string;
  blurb: string;
  usage: string;
  files: CodeFile[];
  children: ReactNode;
  previewClassName?: string;
}

type Tab = "preview" | "usage" | "source";
const TABS: { id: Tab; label: string }[] = [
  { id: "preview", label: "Preview" },
  { id: "usage", label: "Usage" },
  { id: "source", label: "Source" },
];

export function Showcase({
  id,
  title,
  blurb,
  usage,
  files,
  children,
  previewClassName,
}: ShowcaseProps) {
  const [tab, setTab] = useState<Tab>("preview");
  const [fileIdx, setFileIdx] = useState(0);
  const file = files[Math.min(fileIdx, files.length - 1)];

  return (
    <section id={id} className="scroll-mt-24 py-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 max-w-xl text-depth-muted">{blurb}</p>

      <div
        role="tablist"
        aria-label={`${title} views`}
        className="mt-6 flex gap-1 border-b border-depth-border"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium outline-none transition-colors focus-visible:text-depth-accent",
              tab === t.id ? "text-depth-text" : "text-depth-muted hover:text-depth-text",
            )}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId={`tab-${id}`}
                className="absolute inset-x-0 -bottom-px h-0.5 bg-depth-accent"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "preview" && (
          <div
            className={cn(
              "bg-depth-grid flex min-h-[380px] items-center justify-center overflow-x-clip rounded-2xl border border-depth-border bg-depth-surface/60 p-4 sm:p-8",
              previewClassName,
            )}
          >
            {children}
          </div>
        )}

        {tab === "usage" && <CodeBlock code={usage} />}

        {tab === "source" && (
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => setFileIdx(i)}
                  className={cn(
                    "rounded-md border px-3 py-1 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-depth-accent",
                    i === fileIdx
                      ? "border-depth-accent bg-depth-accent/10 text-depth-text"
                      : "border-depth-border text-depth-muted hover:text-depth-text",
                  )}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <CodeBlock key={file.name} code={file.code} />
          </div>
        )}
      </div>

      <PropsTable files={files} />
    </section>
  );
}

/**
 * Render only the child whose `id` matches `only` out of a section's fragment.
 * With no `only`, the whole section is returned. The doc routes use this so a
 * page shows one component instead of the whole group.
 */
export function pick(tree: ReactElement, only?: string): ReactNode {
  if (!only) return tree;
  return Children.toArray((tree.props as { children?: ReactNode }).children).filter(
    (c) => isValidElement(c) && (c.props as { id?: string }).id === only,
  );
}
