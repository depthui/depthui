import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CodeBlock } from "@/demo/code-block";
import data from "./guides.json";

export type GuideBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang: string; code: string };

export interface Guide {
  slug: string;
  title: string;
  description: string;
  published: string;
  /** Component slugs this guide is about. Their docs pages link back to the guide. */
  related: string[];
  blocks: GuideBlock[];
}

export const GUIDES = data as Guide[];
export const findGuide = (slug: string | undefined) => GUIDES.find((g) => g.slug === slug);
export const guidesFor = (componentSlug: string) => GUIDES.filter((g) => g.related.includes(componentSlug));

/** Text with `code` and [links](/path). The same syntax is read by scripts/prerender.mjs. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const code = part.match(/^`([^`]+)`$/);
        if (code) return <code key={i} className="rounded bg-depth-elevated px-1.5 py-0.5 font-mono text-[0.9em]">{code[1]}</code>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link)
          return (
            <Link key={i} to={link[2]} className="font-medium text-depth-accent underline decoration-depth-accent/40 underline-offset-4 hover:decoration-depth-accent">
              {link[1]}
            </Link>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function Blocks({ blocks }: { blocks: GuideBlock[] }): ReactNode {
  return blocks.map((b, i) => {
    if (b.type === "h2") return <h2 key={i} className="mt-10 text-2xl font-semibold tracking-tight">{b.text}</h2>;
    if (b.type === "p") return <p key={i} className="mt-4 leading-7 text-depth-muted"><Inline text={b.text} /></p>;
    if (b.type === "ul")
      return (
        <ul key={i} className="mt-4 list-disc space-y-2 pl-6 leading-7 text-depth-muted marker:text-depth-accent">
          {b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}
        </ul>
      );
    return <div key={i} className="mt-5"><CodeBlock code={b.code} /></div>;
  });
}
