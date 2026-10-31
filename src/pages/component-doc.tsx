import { Suspense, lazy, useEffect, type ComponentType } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DOCS, docIndex, docPath, findDoc, type GroupKey } from "@/demo/docs-registry";

type SectionProps = { only?: string };

// One lazy chunk per group. Opening /components/globe downloads the showpieces
// chunk only; it never loads buttons, blocks, and so on.
const SECTIONS: Record<GroupKey, ComponentType<SectionProps>> = {
  core: lazy(() => import("@/demo/core-section").then((m) => ({ default: m.CoreSection }))),
  buttons: lazy(() => import("@/demo/buttons-section").then((m) => ({ default: m.ButtonsSection }))),
  cards: lazy(() => import("@/demo/cards-section-demo").then((m) => ({ default: m.CardsDemoSection }))),
  ui: lazy(() => import("@/demo/ui-section").then((m) => ({ default: m.UISection }))),
  showpieces: lazy(() => import("@/demo/showpieces-section").then((m) => ({ default: m.ShowpiecesSection }))),
  blocks: lazy(() => import("@/demo/blocks-section").then((m) => ({ default: m.BlocksSection }))),
};

function Pager({ i }: { i: number }) {
  const prev = DOCS[i - 1];
  const next = DOCS[i + 1];
  const cls =
    "group flex min-w-0 flex-col rounded-xl border border-depth-border bg-depth-surface px-4 py-3 outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent";
  return (
    <nav aria-label="Previous and next component" className="mt-12 grid grid-cols-2 gap-3 border-t border-depth-border pt-6">
      {prev ? (
        <Link to={docPath(prev)} className={cls}>
          <span className="font-mono text-[11px] uppercase tracking-widest text-depth-muted">← Previous</span>
          <span className="truncate font-medium group-hover:text-depth-accent">{prev.label}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={docPath(next)} className={cn(cls, "items-end text-right")}>
          <span className="font-mono text-[11px] uppercase tracking-widest text-depth-muted">Next →</span>
          <span className="truncate font-medium group-hover:text-depth-accent">{next.label}</span>
        </Link>
      ) : <span />}
    </nav>
  );
}
/** /components/:slug: the docs for exactly one component, loaded on demand. */
export default function ComponentDoc() {
  const { slug } = useParams();
  const entry = findDoc(slug);

  // Each docs page gets its own title, description and canonical link, so it can
  // be found and shared on its own.
  useEffect(() => {
    if (!entry) return;
    const prevTitle = document.title;
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const canon = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prev = { desc: desc?.content, canon: canon?.href };
    document.title = `${entry.label}: free copy-paste 3D React component · Depth UI`;
    if (desc) desc.content = `${entry.label} from Depth UI. A free, open-source ${entry.group.toLowerCase()} component for React with live preview, usage and full source. CSS 3D, Tailwind v4 and Framer Motion, no WebGL.`;
    if (canon) canon.href = `https://depthui.vercel.app${docPath(entry)}`;
    return () => {
      document.title = prevTitle;
      if (desc && prev.desc !== undefined) desc.content = prev.desc;
      if (canon && prev.canon) canon.href = prev.canon;
    };
  }, [entry]);

  if (!entry) return <Navigate to="/components" replace />;
  // Old ids still work, but the canonical URL is the short slug.
  if (slug !== entry.slug) return <Navigate to={docPath(entry)} replace />;

  const Section = SECTIONS[entry.key];
  const i = docIndex(entry);

  return (
    <article key={entry.id} className="pt-6">
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-depth-muted">
        <Link to="/components" className="hover:text-depth-accent">Components</Link>
        <span aria-hidden> / </span>
        <span>{entry.group}</span>
      </nav>
      <Suspense fallback={<div aria-busy className="mt-10 h-[60vh] animate-pulse rounded-2xl bg-depth-elevated/50" />}>
        <Section only={entry.id} />
      </Suspense>
      <Pager i={i} />
    </article>
  );
}
