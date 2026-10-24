import { useCallback, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { REPO } from "@/lib/site";
import {
  BookCard,
  Button3D,
  CardDeck,
  Carousel3D,
  CoverFlow,
  Cube3D,
  DepthLayer,
  DepthStack,
  Dock3D,
  FlipCard,
  GitHubStarButton,
  GridFloor,
  HoloCard,
  IsometricGrid,
  LayerStack,
  Marquee3D,
  Orbit3D,
  ScrollReveal3D,
  SpotlightCard,
  Text3D,
  ThemeToggle,
  TiltCard,
  TiltLayer,
  useTheme,
} from "@/components/depth";
import { Showcase, type CodeFile } from "@/demo/showcase";
import { CodeBlock } from "@/demo/code-block";
import { ButtonsSection } from "@/demo/buttons-section";
import { CardsDemoSection } from "@/demo/cards-section-demo";
import { UISection } from "@/demo/ui-section";
import { ShowpiecesSection } from "@/demo/showpieces-section";
import { BlocksSection } from "@/demo/blocks-section";
import { MobileDrawer } from "@/demo/mobile-drawer";
import { NavList } from "@/demo/nav-list";
import { NAV_IDS, useActiveSection } from "@/demo/nav";
import { usage } from "@/demo/usage";

import tiltSrc from "@/components/depth/tilt-card.tsx?raw";
import spotlightSrc from "@/components/depth/spotlight-card.tsx?raw";
import holoSrc from "@/components/depth/holo-card.tsx?raw";
import flipSrc from "@/components/depth/flip-card.tsx?raw";
import deckSrc from "@/components/depth/card-deck.tsx?raw";
import bookSrc from "@/components/depth/book-card.tsx?raw";
import stackSrc from "@/components/depth/depth-stack.tsx?raw";
import cubeSrc from "@/components/depth/cube-3d.tsx?raw";
import carouselSrc from "@/components/depth/carousel-3d.tsx?raw";
import coverFlowSrc from "@/components/depth/cover-flow.tsx?raw";
import orbitSrc from "@/components/depth/orbit-3d.tsx?raw";
import layerSrc from "@/components/depth/layer-stack.tsx?raw";
import isoSrc from "@/components/depth/isometric-grid.tsx?raw";
import floorSrc from "@/components/depth/grid-floor.tsx?raw";
import marqueeSrc from "@/components/depth/marquee-3d.tsx?raw";
import revealSrc from "@/components/depth/scroll-reveal-3d.tsx?raw";
import buttonSrc from "@/components/depth/button-3d.tsx?raw";
import dockSrc from "@/components/depth/dock-3d.tsx?raw";
import textSrc from "@/components/depth/text-3d.tsx?raw";
import themeSrc from "@/components/depth/theme.tsx?raw";
import tiltHookSrc from "@/hooks/use-tilt.ts?raw";
import progressHookSrc from "@/hooks/use-scroll-progress.ts?raw";
import utilsSrc from "@/lib/utils.ts?raw";
import motionCss from "@/styles/depth-motion.css?raw";
import indexCss from "@/index.css?raw";
import starSrc from "@/components/depth/github-star-button.tsx?raw";

const f = (name: string, code: string): CodeFile => ({ name, code });
const utils = f("lib/utils.ts", utilsSrc);
const tiltHook = f("hooks/use-tilt.ts", tiltHookSrc);
const motion = f("styles/depth-motion.css", motionCss);

const slides = [
  { t: "Tilt", d: "Pointer-driven rotation", c: "from-violet-500/30" },
  { t: "Flip", d: "Spring-based card flip", c: "from-cyan-400/30" },
  { t: "Depth", d: "Layered parallax", c: "from-pink-400/30" },
  { t: "Cube", d: "Drag to spin", c: "from-amber-400/30" },
  { t: "Ring", d: "3D carousel", c: "from-emerald-400/30" },
];

const albums = [
  ["Aurora", "from-violet-500/50 to-fuchsia-500/10"],
  ["Tidal", "from-cyan-400/50 to-sky-500/10"],
  ["Ember", "from-amber-400/50 to-orange-500/10"],
  ["Bloom", "from-pink-400/50 to-rose-500/10"],
  ["Moss", "from-emerald-400/50 to-teal-500/10"],
  ["Dusk", "from-indigo-400/50 to-purple-500/10"],
  ["Frost", "from-sky-300/50 to-blue-500/10"],
];

const marqueeItems = Array.from({ length: 16 }, (_, i) => {
  const tones = [
    "from-violet-500/40 to-fuchsia-500/10",
    "from-cyan-400/40 to-sky-500/10",
    "from-pink-400/40 to-rose-500/10",
    "from-amber-400/40 to-orange-500/10",
  ];
  return (
    <div
      key={i}
      className={`flex h-24 w-44 items-end rounded-xl border border-depth-border bg-gradient-to-br ${tones[i % 4]} bg-depth-surface p-3`}
    >
      <span className="font-mono text-xs text-depth-text">card-{String(i + 1).padStart(2, "0")}</span>
    </div>
  );
});

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const dockItems = [
  { label: "Home", icon: <Icon d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" /> },
  { label: "Search", icon: <Icon d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5" /> },
  { label: "Mail", icon: <Icon d="M3 6h18v12H3zM3 7l9 7 9-7" /> },
  { label: "Photos", icon: <Icon d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01" /> },
  { label: "Settings", icon: <Icon d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2-1-2-4-2 1-2-1-1-2H9L8 8 6 9 4 8 2 12l2 1v2l-2 1 2 4 2-1 2 1 1 2h4l1-2 2-1 2 1 2-4-2-1z" /> },
];

const chip = (t: string, c: string) => (
  <span
    key={t}
    className={`rounded-full border border-depth-border bg-gradient-to-r ${c} bg-depth-surface px-2.5 py-1.5 text-xs font-medium shadow-md`}
  >
    {t}
  </span>
);

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
      <span
        aria-hidden
        className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-depth-accent to-depth-accent-2"
        style={{ transform: "perspective(40px) rotateY(-24deg) rotateX(12deg)" }}
      />
      Depth UI
    </a>
  );
}

function Intro({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-4 text-depth-muted">{children}</div>
    </section>
  );
}

function ThemeReadout() {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col items-center gap-4">
      <ThemeToggle className="h-14 w-14" />
      <p className="font-mono text-sm text-depth-muted">
        current theme: <span className="text-depth-accent">{theme}</span>
      </p>
    </div>
  );
}

export default function ComponentsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(NAV_IDS);

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
            <span className="hidden font-mono text-xs text-depth-muted lg:inline">v0.5</span>
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
          <div className="bg-depth-grid -mx-6 border-b border-depth-border px-6 pb-14 pt-16">
            <p className="font-mono text-xs uppercase tracking-widest text-depth-accent">
              react · tailwind · framer motion
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              3D components that stay{" "}
              <span className="bg-gradient-to-r from-depth-accent via-depth-accent-3 to-depth-accent-2 bg-clip-text text-transparent">
                light
              </span>
              .
            </h1>
            <p className="mt-5 max-w-xl text-lg text-depth-muted">
              CSS 3D transforms on the GPU, motion values instead of re-renders,
              light and dark themes, and source you copy and own.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-depth-accent px-5 py-2.5 text-sm font-medium text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-bg"
            >
              See the landing page →
            </Link>
          </div>

          <Intro id="getting-started" title="Getting started">
            <p>Copy a component, its helper files and the theme tokens into your project.</p>
            <CodeBlock code={usage.install} />
          </Intro>

          <Showcase
            id="theme"
            title="Theme & toggle"
            blurb="Light and dark themes run on CSS variables. Flip the toggle here or in the header."
            usage={usage.theme}
            files={[
              f("components/depth/theme.tsx", themeSrc),
              f("index.css (tokens)", indexCss),
              f("index.html (script)", usage.themeScript),
            ]}
            previewClassName="min-h-[260px]"
          >
            <ThemeReadout />
          </Showcase>

          {/* ---------------- Cards ---------------- */}
          <Showcase
            id="tilt-card"
            title="Tilt Card"
            blurb="Hover the card. Layers float at different depths and a glare follows the pointer."
            usage={usage.tiltCard}
            files={[f("components/depth/tilt-card.tsx", tiltSrc), tiltHook, utils]}
          >
            <TiltCard className="w-72">
              <TiltLayer z={20}>
                <span className="rounded-full bg-depth-accent/15 px-3 py-1 font-mono text-xs text-depth-accent">
                  New
                </span>
              </TiltLayer>
              <TiltLayer z={60} className="mt-6">
                <h3 className="text-2xl font-semibold">Spatial UI</h3>
              </TiltLayer>
              <TiltLayer z={35} className="mt-2">
                <p className="text-sm text-depth-muted">
                  Every layer has its own translateZ, so the card feels physical.
                </p>
              </TiltLayer>
              <TiltLayer z={80} className="mt-8">
                <button className="rounded-lg bg-depth-accent px-4 py-2 text-sm font-medium text-white">
                  Explore
                </button>
              </TiltLayer>
            </TiltCard>
          </Showcase>

          <Showcase
            id="spotlight-card"
            title="Spotlight Card"
            blurb="A soft light and a glowing edge track your pointer across the card."
            usage={usage.spotlightCard}
            files={[f("components/depth/spotlight-card.tsx", spotlightSrc), utils]}
          >
            <SpotlightCard className="w-72">
              <h3 className="text-xl font-semibold">Spotlight</h3>
              <p className="mt-2 text-sm text-depth-muted">
                Move across the card. The border lights up only where your
                pointer is.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {["Fast", "Light", "Themed"].map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-depth-border bg-depth-elevated py-2 text-center text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </Showcase>

          <Showcase
            id="holo-card"
            title="Holo Card"
            blurb="A collectible-style card. The rainbow foil and shine slide as you move."
            usage={usage.holoCard}
            files={[f("components/depth/holo-card.tsx", holoSrc), tiltHook, utils]}
          >
            <HoloCard>
              <div className="flex h-full flex-col justify-between bg-gradient-to-br from-depth-accent/20 via-transparent to-depth-accent-2/20 p-5">
                <div className="flex items-center justify-between font-mono text-xs text-depth-muted">
                  <span>No. 001</span>
                  <span>RARE</span>
                </div>
                <div>
                  <div className="mb-4 h-24 rounded-xl bg-gradient-to-br from-depth-accent to-depth-accent-3 opacity-80" />
                  <h3 className="text-2xl font-semibold">Holo</h3>
                  <p className="text-sm text-depth-muted">Tilt me around.</p>
                </div>
              </div>
            </HoloCard>
          </Showcase>

          <Showcase
            id="flip-card"
            title="Flip Card"
            blurb="Hover, tap, or press Enter. Backface culling keeps both sides crisp."
            usage={usage.flipCard}
            files={[f("components/depth/flip-card.tsx", flipSrc), utils]}
          >
            <FlipCard
              front={
                <div className="flex h-full flex-col justify-between">
                  <span className="font-mono text-xs text-depth-accent-2">front</span>
                  <h3 className="text-2xl font-semibold">Hover me</h3>
                </div>
              }
              back={
                <div className="flex h-full flex-col justify-between bg-gradient-to-br from-depth-accent/20 to-transparent">
                  <span className="font-mono text-xs text-depth-accent-3">back</span>
                  <p className="text-sm text-depth-muted">
                    A spring-driven rotateY with no layout thrash.
                  </p>
                </div>
              }
            />
          </Showcase>

          <Showcase
            id="card-deck"
            title="Card Deck"
            blurb="Swipe, click, or press Enter to send the top card to the back."
            usage={usage.cardDeck}
            files={[f("components/depth/card-deck.tsx", deckSrc), utils]}
          >
            <CardDeck
              width={270}
              cards={[
                ["Plan", "from-violet-500/30"],
                ["Build", "from-cyan-400/30"],
                ["Ship", "from-pink-400/30"],
                ["Repeat", "from-amber-400/30"],
              ].map(([t, c]) => (
                <div
                  key={t}
                  className={`flex h-full flex-col justify-between bg-gradient-to-br ${c} to-transparent p-5`}
                >
                  <span className="font-mono text-xs text-depth-muted">drag or click</span>
                  <h3 className="text-3xl font-semibold">{t}</h3>
                </div>
              ))}
            />
          </Showcase>

          <Showcase
            id="book-card"
            title="Book"
            blurb="Hover, tap, or press Enter. The cover swings open to reveal the pages."
            usage={usage.bookCard}
            files={[f("components/depth/book-card.tsx", bookSrc), utils]}
          >
            <BookCard
              width={160}
              height={220}
              cover={
                <div className="flex h-full flex-col justify-between p-5">
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-80">
                    handbook
                  </span>
                  <h3 className="text-2xl font-bold leading-tight">Depth UI</h3>
                </div>
              }
              left={<p className="text-xs text-depth-muted">Contents<br />01 Cards<br />02 Scenes<br />03 Controls</p>}
              right={
                <div className="flex h-full flex-col justify-between">
                  <h4 className="font-semibold">Chapter 1</h4>
                  <p className="text-xs text-depth-muted">
                    Everything you see is plain CSS 3D, driven by motion values.
                  </p>
                </div>
              }
            />
          </Showcase>

          {/* ---------------- Scenes ---------------- */}
          <Showcase
            id="depth-stack"
            title="Depth Stack"
            blurb="Move the pointer across the scene. Closer layers shift more."
            usage={usage.depthStack}
            files={[f("components/depth/depth-stack.tsx", stackSrc), utils]}
          >
            <DepthStack>
              <DepthLayer depth={0.1}>
                <div className="h-64 w-64 rounded-full bg-depth-accent/20 blur-2xl" />
              </DepthLayer>
              <DepthLayer depth={0.4}>
                <div className="h-40 w-40 rounded-3xl border border-depth-accent-2/50 bg-depth-accent-2/10" />
              </DepthLayer>
              <DepthLayer depth={0.8}>
                <div className="rounded-xl border border-depth-border bg-depth-elevated px-6 py-3 text-lg font-semibold shadow-xl">
                  Foreground
                </div>
              </DepthLayer>
            </DepthStack>
          </Showcase>

          <Showcase
            id="cube-3d"
            title="Cube"
            blurb="Idles on its own. Grab it and spin it."
            usage={usage.cube}
            files={[f("components/depth/cube-3d.tsx", cubeSrc), utils]}
          >
            <Cube3D
              size={170}
              faces={["Tailwind", "Motion", "React", "3D", "GPU", "Light"].map((t) => (
                <span key={t} className="text-lg font-semibold">
                  {t}
                </span>
              ))}
            />
          </Showcase>

          <Showcase
            id="carousel-3d"
            title="Ring Carousel"
            blurb="Arrow keys or buttons. Click any side card to bring it forward."
            usage={usage.carousel}
            files={[f("components/depth/carousel-3d.tsx", carouselSrc), utils]}
          >
            <Carousel3D
              items={slides.map((s) => (
                <div
                  key={s.t}
                  className={`flex h-full flex-col justify-end bg-gradient-to-t ${s.c} to-transparent p-5`}
                >
                  <h3 className="text-2xl font-semibold">{s.t}</h3>
                  <p className="text-sm text-depth-muted">{s.d}</p>
                </div>
              ))}
            />
          </Showcase>

          <Showcase
            id="cover-flow"
            title="Cover Flow"
            blurb="The classic album browser. Click a cover or use the arrow keys."
            usage={usage.coverFlow}
            files={[f("components/depth/cover-flow.tsx", coverFlowSrc), utils]}
          >
            <CoverFlow
              itemWidth={160}
              itemHeight={210}
              items={albums.map(([t, c]) => (
                <div
                  key={t}
                  className={`flex h-full flex-col justify-end bg-gradient-to-br ${c} p-4`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-depth-muted">
                    album
                  </span>
                  <h3 className="text-xl font-semibold">{t}</h3>
                </div>
              ))}
            />
          </Showcase>

          <Showcase
            id="orbit-3d"
            title="Orbit"
            blurb="Items circle a core on tilted rings and always face you. Pure CSS."
            usage={usage.orbit}
            files={[f("components/depth/orbit-3d.tsx", orbitSrc), motion, utils]}
            previewClassName="min-h-[320px]"
          >
            <Orbit3D
              center={
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-depth-accent to-depth-accent-2 text-sm font-bold text-white shadow-xl">
                  Core
                </div>
              }
              rings={[
                {
                  radius: 66,
                  duration: 18,
                  items: [
                    chip("React", "from-sky-400/20 to-transparent"),
                    chip("Tailwind", "from-cyan-400/20 to-transparent"),
                    chip("Motion", "from-pink-400/20 to-transparent"),
                  ],
                },
                {
                  radius: 110,
                  duration: 30,
                  reverse: true,
                  items: [
                    chip("TS", "from-blue-400/20 to-transparent"),
                    chip("Vite", "from-violet-400/20 to-transparent"),
                    chip("CSS 3D", "from-amber-400/20 to-transparent"),
                    chip("GPU", "from-emerald-400/20 to-transparent"),
                  ],
                },
              ]}
            />
          </Showcase>

          <Showcase
            id="layer-stack"
            title="Layer Stack"
            blurb="Hover, tap, or press Enter to explode the stack. Great for architecture diagrams."
            usage={usage.layerStack}
            files={[f("components/depth/layer-stack.tsx", layerSrc), utils]}
            previewClassName="min-h-[400px]"
          >
            <LayerStack
              size={150}
              layers={[
                ["Database", "from-emerald-400/40"],
                ["API", "from-cyan-400/40"],
                ["Logic", "from-violet-500/40"],
                ["UI", "from-pink-400/40"],
              ].map(([t, c]) => (
                <div
                  key={t}
                  className={`flex h-full items-end bg-gradient-to-br ${c} to-transparent p-3`}
                >
                  <span className="font-mono text-xs font-medium">{t}</span>
                </div>
              ))}
            />
          </Showcase>

          <Showcase
            id="isometric-grid"
            title="Isometric Grid"
            blurb="Hover or tap a tile and it lifts off the surface."
            usage={usage.isometricGrid}
            files={[f("components/depth/isometric-grid.tsx", isoSrc), utils]}
            previewClassName="min-h-[400px]"
          >
            <IsometricGrid
              size={60}
              gap={10}
              items={["Auth", "Billing", "Search", "Mail", "Files", "Chat", "Maps", "Docs", "Admin"].map(
                (t) => (
                  <span key={t}>{t}</span>
                ),
              )}
            />
          </Showcase>

          <Showcase
            id="grid-floor"
            title="Grid Floor"
            blurb="An endless perspective floor. Pure CSS, one transform animation."
            usage={usage.gridFloor}
            files={[f("components/depth/grid-floor.tsx", floorSrc), motion, utils]}
            previewClassName="overflow-hidden p-0 sm:p-0"
          >
            <GridFloor className="h-[380px]">
              <h3 className="text-3xl font-bold tracking-tight">Infinite floor</h3>
            </GridFloor>
          </Showcase>

          <Showcase
            id="marquee-3d"
            title="3D Marquee"
            blurb="Columns scroll in opposite directions on a tilted plane. Hover to pause."
            usage={usage.marquee}
            files={[f("components/depth/marquee-3d.tsx", marqueeSrc), motion, utils]}
            previewClassName="overflow-hidden p-0 sm:p-0"
          >
            <Marquee3D items={marqueeItems} />
          </Showcase>

          <Showcase
            id="scroll-reveal-3d"
            title="Scroll Reveal"
            blurb="Keep scrolling. The panel starts tilted back and flattens as it reaches the middle of the screen."
            usage={usage.scrollReveal}
            files={[f("components/depth/scroll-reveal-3d.tsx", revealSrc), f("hooks/use-scroll-progress.ts", progressHookSrc), utils]}
            previewClassName="min-h-[460px]"
          >
            <div className="w-full max-w-xl">
              <ScrollReveal3D>
                <div className="flex items-center gap-1.5 border-b border-depth-border bg-depth-elevated px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-depth-accent-3" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-3">
                  {["Revenue", "Users", "Latency"].map((t, i) => (
                    <div key={t} className="rounded-lg border border-depth-border bg-depth-elevated p-3">
                      <p className="font-mono text-[10px] uppercase text-depth-muted">{t}</p>
                      <p className="mt-1 text-xl font-semibold">{["$48k", "12.4k", "42ms"][i]}</p>
                    </div>
                  ))}
                  <div className="h-24 rounded-lg bg-gradient-to-r from-depth-accent/30 via-depth-accent-3/20 to-depth-accent-2/30 sm:col-span-3" />
                </div>
              </ScrollReveal3D>
            </div>
          </Showcase>

          {/* ---------------- Controls & text ---------------- */}
          <Showcase
            id="button-3d"
            title="3D Button"
            blurb="Leans toward your pointer and presses down when clicked."
            usage={usage.button}
            files={[f("components/depth/button-3d.tsx", buttonSrc), tiltHook, utils]}
            previewClassName="min-h-[260px]"
          >
            <div className="flex flex-wrap items-center justify-center gap-8">
              <Button3D>Get started</Button3D>
              <Button3D variant="neutral" depth={6}>
                Learn more
              </Button3D>
            </div>
          </Showcase>

          <Showcase
            id="dock-3d"
            title="Dock"
            blurb="Icons magnify as your pointer approaches, on a tilted glass shelf."
            usage={usage.dock}
            files={[f("components/depth/dock-3d.tsx", dockSrc), utils]}
            previewClassName="min-h-[280px]"
          >
            <Dock3D items={dockItems} baseSize={38} />
          </Showcase>

          <Showcase
            id="text-3d"
            title="3D Text"
            blurb="Stacked layers give the headline real thickness. Move your pointer over it."
            usage={usage.text3d}
            files={[f("components/depth/text-3d.tsx", textSrc), tiltHook, utils]}
          >
            <Text3D text="DEPTH" />
          </Showcase>

          <Showcase
            id="github-star"
            title="GitHub Star Button"
            blurb="A star pill for your navbar. It is a plain link, with a live star count fetched once per session. If GitHub cannot be reached it just shows no count."
            usage={`import { GitHubStarButton } from "@/components/depth";

<GitHubStarButton repo="depthui/depthui" />
<GitHubStarButton repo="depthui/depthui" showCount={false} label="Star us" />`}
            files={[f("components/depth/github-star-button.tsx", starSrc), utils]}
            previewClassName="min-h-[200px]"
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              <GitHubStarButton repo={REPO} />
              <GitHubStarButton repo={REPO} showCount={false} label="Star us" />
            </div>
          </Showcase>

          <ButtonsSection />
          <CardsDemoSection />
          <UISection />
          <ShowpiecesSection />

          {/* ---------------- Page blocks ---------------- */}
          <BlocksSection />

          <footer className="mt-10 border-t border-depth-border pt-8 font-mono text-xs text-depth-muted">
            depth-ui — copy a component, own the code.
          </footer>
        </main>
      </div>
    </div>
  );
}
