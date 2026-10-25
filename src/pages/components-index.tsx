import { useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { CodeBlock } from "@/demo/code-block";
import { usage } from "@/demo/usage";
import { NAV } from "@/demo/nav";
import { DOCS, docPath, findDoc } from "@/demo/docs-registry";

/** /components: install steps and a searchable list of every component. */
export default function ComponentsIndex() {
  const { hash } = useLocation();
  const [q, setQ] = useState("");
  const bySlug = useMemo(() => new Map(DOCS.map((d) => [d.id, d])), []);

  // Old links like /components#globe-3d now go to /components/globe.
  const legacy = findDoc(hash.slice(1));
  if (legacy) return <Navigate to={docPath(legacy)} replace />;

  const needle = q.trim().toLowerCase();
  const groups = NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => !needle || i.label.toLowerCase().includes(needle) || i.id.includes(needle)),
  })).filter((g) => g.items.length);

  return (
    <>
      <div className="bg-depth-grid -mx-6 border-b border-depth-border px-6 pb-14 pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-depth-accent">react · tailwind · framer motion</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          3D components that stay{" "}
          <span className="bg-gradient-to-r from-depth-accent via-depth-accent-3 to-depth-accent-2 bg-clip-text text-transparent">light</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-depth-muted">
          CSS 3D transforms on the GPU, motion values instead of re-renders, light and dark themes, and source you copy and own.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-depth-accent px-5 py-2.5 text-sm font-medium text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg"
        >
          See the landing page →
        </Link>
      </div>

      <section className="scroll-mt-24 py-10">
        <h2 className="text-2xl font-semibold tracking-tight">Getting started</h2>
        <div className="mt-3 space-y-4 text-depth-muted">
          <p>Copy a component, its helper files and the theme tokens into your project.</p>
          <CodeBlock code={usage.install} />
        </div>
      </section>

      <section className="py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            All components <span className="font-mono text-sm text-depth-muted">{DOCS.length}</span>
          </h2>
          <label className="block">
            <span className="sr-only">Search components</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search components…"
              className="w-64 max-w-full rounded-full border border-depth-border bg-depth-surface px-4 py-2 text-sm outline-none placeholder:text-depth-muted focus-visible:ring-2 focus-visible:ring-depth-accent"
            />
          </label>
        </div>
        <p className="mt-2 text-sm text-depth-muted">Each one opens on its own page and loads only what it needs.</p>

        {groups.map((g) => (
          <div key={g.title} className="mt-8">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-depth-muted">{g.title}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {g.items.map((i) => (
                <li key={i.id}>
                  <Link
                    to={docPath(bySlug.get(i.id)!)}
                    className="block truncate rounded-xl border border-depth-border bg-depth-surface px-3.5 py-2.5 text-sm font-medium outline-none transition-colors hover:border-depth-accent hover:text-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent"
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!groups.length && <p className="mt-8 text-depth-muted">Nothing matches “{q}”.</p>}
      </section>
    </>
  );
}
