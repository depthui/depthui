import { useEffect } from "react";
import { Link } from "react-router-dom";
import { GUIDES } from "@/guides/render";

export default function GuidesIndex() {
  useEffect(() => {
    document.title = "React 3D UI Guides: Tilt Cards, Kanban, CSS 3D · Depth UI";
  }, []);
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight">Guides</h1>
      <p className="mt-3 text-depth-muted">Short, practical guides to building 3D interfaces in React with CSS, Tailwind and Framer Motion.</p>
      <ul className="mt-10 space-y-4">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              to={`/guides/${g.slug}`}
              className="group block rounded-2xl border border-depth-border bg-depth-surface p-5 outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent"
            >
              <h2 className="text-lg font-semibold tracking-tight group-hover:text-depth-accent">{g.title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-depth-muted">{g.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
