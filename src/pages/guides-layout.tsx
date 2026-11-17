import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import { GitHubStarButton, ThemeToggle } from "@/components/depth";
import { REPO } from "@/lib/site";

const link =
  "rounded-full px-3 py-2 text-sm text-depth-muted outline-none transition-colors hover:text-depth-text focus-visible:ring-2 focus-visible:ring-depth-accent";

/** Shell for /guides pages: a slim header, the page, and a footer with links. */
export default function GuidesLayout() {
  return (
    <div className="min-h-screen bg-depth-bg text-depth-text">
      <header className="sticky top-0 z-50 border-b border-depth-border bg-depth-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span
              aria-hidden
              className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-depth-accent to-depth-accent-2"
              style={{ transform: "perspective(40px) rotateY(-24deg) rotateX(12deg)" }}
            />
            Depth UI
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1">
            <Link to="/components" className={link}>Components</Link>
            <Link to="/guides" className={link}>Guides</Link>
            <GitHubStarButton repo={REPO} className="ml-2 hidden sm:inline-flex" />
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
        <Suspense fallback={<div aria-busy className="h-[60vh] animate-pulse rounded-2xl bg-depth-elevated/50" />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t border-depth-border py-8 text-center font-mono text-xs text-depth-muted">
        depth-ui: copy a component, own the code.
      </footer>
    </div>
  );
}
