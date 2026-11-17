import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Blocks, GUIDES, findGuide } from "@/guides/render";
import { DOCS, docPath } from "@/demo/docs-registry";

export default function GuideArticle() {
  const { slug } = useParams();
  const guide = findGuide(slug);

  useEffect(() => {
    if (!guide) return;
    const prev = document.title;
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const canon = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const before = { desc: desc?.content, canon: canon?.href };
    document.title = `${guide.title} · Depth UI`;
    if (desc) desc.content = guide.description;
    if (canon) canon.href = `https://depthui.vercel.app/guides/${guide.slug}`;
    return () => {
      document.title = prev;
      if (desc && before.desc !== undefined) desc.content = before.desc;
      if (canon && before.canon) canon.href = before.canon;
    };
  }, [guide]);

  if (!guide) return <Navigate to="/guides" replace />;
  const comps = guide.related.map((s) => DOCS.find((d) => d.slug === s)).filter((d) => !!d);
  const others = GUIDES.filter((g) => g.slug !== guide.slug);

  return (
    <article>
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-depth-muted">
        <Link to="/guides" className="hover:text-depth-text">Guides</Link> / {guide.slug}
      </nav>
      <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight">{guide.title}</h1>
      <p className="mt-3 text-sm text-depth-muted">
        <time dateTime={guide.published}>{new Date(guide.published).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</time>
        {" · "}by the Depth UI team
      </p>
      <Blocks blocks={guide.blocks} />

      {comps.length > 0 && (
        <section aria-label="Components from this guide" className="mt-12 rounded-2xl border border-depth-border bg-depth-elevated/60 p-5">
          <h2 className="text-lg font-semibold tracking-tight">Try the components</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {comps.map((d) => (
              <li key={d!.id}>
                <Link to={docPath(d!)} className="inline-flex rounded-full border border-depth-border bg-depth-surface px-3.5 py-1.5 text-sm outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent">
                  {d!.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {others.length > 0 && (
        <section aria-label="More guides" className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">More guides</h2>
          <ul className="mt-3 space-y-2">
            {others.map((g) => (
              <li key={g.slug}>
                <Link to={`/guides/${g.slug}`} className="text-depth-accent underline decoration-depth-accent/40 underline-offset-4 hover:decoration-depth-accent">{g.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
