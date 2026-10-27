import { Suspense, useCallback, useRef, useState } from "react";
import { Link, Outlet, useMatch } from "react-router-dom";
import { GitHubStarButton, ThemeToggle } from "@/components/depth";
import { REPO } from "@/lib/site";
import { MobileDrawer } from "@/demo/mobile-drawer";
import { NavList } from "@/demo/nav-list";
import { findDoc } from "@/demo/docs-registry";

function Logo() {
  return (
    <Link to="/components" className="flex items-center gap-2 font-semibold tracking-tight">
      <span
        aria-hidden
        className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-depth-accent to-depth-accent-2"
        style={{ transform: "perspective(40px) rotateY(-24deg) rotateX(12deg)" }}
      />
      Depth UI
    </Link>
  );
}

/** Shell for every /components page: header, sidebar, mobile drawer. The page itself is the <Outlet />. */
export default function ComponentsLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const match = useMatch("/components/:slug");
  const active = findDoc(match?.params.slug)?.id ?? "";

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuBtn.current?.focus();
  }, []);

  return (
    <div id="top" className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-depth-border bg-depth-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-depth-border bg-depth-surface text-depth-text outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent lg:hidden"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden rounded-full border border-depth-border bg-depth-surface px-3.5 py-2 text-sm outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent md:inline-flex"
            >
              Landing page
            </Link>
            <GitHubStarButton repo={REPO} className="hidden sm:inline-flex" />
            <a
              href={`https://github.com/${REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star on GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-depth-border bg-depth-surface outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent sm:hidden"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden><path d="m12 2.5 2.93 5.94 6.57.95-4.75 4.63 1.12 6.54L12 17.47l-5.87 3.09 1.12-6.54L2.5 9.39l6.57-.95L12 2.5Z" /></svg>
            </a>
            <span className="hidden font-mono text-xs text-depth-muted lg:inline">v0.18</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise trap position: fixed. */}
      <MobileDrawer open={menuOpen} onClose={closeMenu} active={active} logo={<Logo />} />

      <div className="mx-auto max-w-7xl gap-10 px-6 lg:grid lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-10">
            <NavList active={active} />
          </div>
        </aside>

        <main className="min-w-0 pb-24">
          <Suspense fallback={<div aria-busy className="h-[60vh] animate-pulse rounded-2xl bg-depth-elevated/50 mt-10" />}>
            <Outlet />
          </Suspense>
          <footer className="mt-10 border-t border-depth-border pt-8 font-mono text-xs text-depth-muted">
            depth-ui — copy a component, own the code.
          </footer>
        </main>
      </div>
    </div>
  );
}
