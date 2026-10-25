import { useState, type ReactNode } from "react";
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
  GlowInput,
  GridFloor,
  HoloCard,
  IsometricGrid,
  LayerStack,
  Loader3D,
  Marquee3D,
  Modal3D,
  Orbit3D,
  SpotlightCard,
  Text3D,
  TiltCard,
  TiltLayer,
  Tooltip3D,
  useToast,
  type CardsSectionItem,
} from "@/components/depth";
import { cn } from "@/lib/utils";
import { LazyMount } from "./lazy-mount";
import { Ico } from "./block-data";

/** A labelled frame that holds one component in the demo's showcase grids. */
export function Tile({
  label,
  className,
  children,
  center = true,
}: {
  label: string;
  className?: string;
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[340px] flex-col overflow-x-clip rounded-2xl border border-depth-border bg-depth-surface/60 p-5",
        className,
      )}
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-depth-muted">{label}</p>
      <div className={cn("flex flex-1 items-center justify-center py-4", !center && "items-stretch")}>
        <LazyMount className={cn("flex w-full items-center justify-center", !center && "items-stretch")}>
          {children}
        </LazyMount>
      </div>
    </div>
  );
}

export const articles: CardsSectionItem[] = [
  { id: "a1", category: "Design", title: "Why depth beats decoration", excerpt: "Real perspective makes an interface easier to read, not just prettier.", author: "Mira Sol", date: "Mar 4", readTime: "5 min", tone: 0, href: "#cards" },
  { id: "a2", category: "Engineering", title: "Animating with motion values", excerpt: "Skip React renders for anything that follows a pointer.", author: "Dev Rao", date: "Mar 11", readTime: "7 min", tone: 1, href: "#cards" },
  { id: "a3", category: "Design", title: "Light and dark, one set of tokens", excerpt: "Name colours by role and the theme switch becomes free.", author: "Ana Costa", date: "Mar 18", readTime: "4 min", tone: 2, href: "#cards" },
  { id: "a4", category: "Performance", title: "Transform and opacity only", excerpt: "The two properties the browser can animate without layout.", author: "Dev Rao", date: "Mar 25", readTime: "6 min", tone: 3, href: "#cards" },
  { id: "a5", category: "Engineering", title: "Copy-paste beats packages", excerpt: "Owning the source means owning the fix.", author: "Leo Park", date: "Apr 2", readTime: "3 min", tone: 4, href: "#cards" },
  { id: "a6", category: "Performance", title: "Respecting reduced motion", excerpt: "A calm fallback for everyone who asks for one.", author: "Mira Sol", date: "Apr 9", readTime: "4 min", tone: 0, href: "#cards" },
];

const slides = [
  ["Tilt", "Pointer-driven rotation", "from-violet-500/30"],
  ["Flip", "Spring-based card flip", "from-cyan-400/30"],
  ["Depth", "Layered parallax", "from-pink-400/30"],
  ["Cube", "Drag to spin", "from-amber-400/30"],
  ["Ring", "3D carousel", "from-emerald-400/30"],
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
const tones = [
  "from-violet-500/40 to-fuchsia-500/10",
  "from-cyan-400/40 to-sky-500/10",
  "from-pink-400/40 to-rose-500/10",
  "from-amber-400/40 to-orange-500/10",
];
const chip = (t: string, c: string) => (
  <span key={t} className={`rounded-full border border-depth-border bg-gradient-to-r ${c} bg-depth-surface px-2.5 py-1.5 text-xs font-medium shadow-md`}>
    {t}
  </span>
);

/* ---------------- small card / scene demos ---------------- */

export function DemoTilt() {
  return (
    <TiltCard className="w-64">
      <TiltLayer z={20}>
        <span className="rounded-full bg-depth-accent/15 px-3 py-1 font-mono text-xs text-depth-accent">New</span>
      </TiltLayer>
      <TiltLayer z={60} className="mt-5">
        <h3 className="text-2xl font-semibold">Spatial UI</h3>
      </TiltLayer>
      <TiltLayer z={35} className="mt-2">
        <p className="text-sm text-depth-muted">Every layer has its own depth.</p>
      </TiltLayer>
      <TiltLayer z={80} className="mt-6">
        <span className="inline-block rounded-lg bg-depth-accent px-4 py-2 text-sm font-medium text-white">Explore</span>
      </TiltLayer>
    </TiltCard>
  );
}

export function DemoSpotlight() {
  return (
    <SpotlightCard className="w-64">
      <h3 className="text-xl font-semibold">Spotlight</h3>
      <p className="mt-2 text-sm text-depth-muted">The border lights up only where your pointer is.</p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {["Fast", "Light", "Themed"].map((t) => (
          <span key={t} className="rounded-md border border-depth-border bg-depth-elevated py-2 text-center text-xs">{t}</span>
        ))}
      </div>
    </SpotlightCard>
  );
}

export function DemoHolo() {
  return (
    <HoloCard>
      <div className="flex h-full flex-col justify-between bg-gradient-to-br from-depth-accent/20 via-transparent to-depth-accent-2/20 p-5">
        <div className="flex items-center justify-between font-mono text-xs text-depth-muted">
          <span>No. 001</span>
          <span>RARE</span>
        </div>
        <div>
          <div className="mb-4 h-20 rounded-xl bg-gradient-to-br from-depth-accent to-depth-accent-3 opacity-80" />
          <h3 className="text-2xl font-semibold">Holo</h3>
          <p className="text-sm text-depth-muted">Tilt me around.</p>
        </div>
      </div>
    </HoloCard>
  );
}

export function DemoFlip() {
  return (
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
          <p className="text-sm text-depth-muted">A spring-driven flip with no layout thrash.</p>
        </div>
      }
    />
  );
}

export function DemoDeck() {
  return (
    <CardDeck
      width={240}
      cards={[["Plan", "from-violet-500/30"], ["Build", "from-cyan-400/30"], ["Ship", "from-pink-400/30"], ["Repeat", "from-amber-400/30"]].map(([t, c]) => (
        <div key={t} className={`flex h-full flex-col justify-between bg-gradient-to-br ${c} to-transparent p-5`}>
          <span className="font-mono text-xs text-depth-muted">drag or click</span>
          <h3 className="text-3xl font-semibold">{t}</h3>
        </div>
      ))}
    />
  );
}

export function DemoBook() {
  return (
    <BookCard
      width={150}
      height={210}
      cover={
        <div className="flex h-full flex-col justify-between p-5">
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-80">handbook</span>
          <h3 className="text-2xl font-bold leading-tight">Depth UI</h3>
        </div>
      }
      left={<p className="text-xs text-depth-muted">Contents<br />01 Cards<br />02 Scenes<br />03 Controls</p>}
      right={
        <div className="flex h-full flex-col justify-between">
          <h4 className="font-semibold">Chapter 1</h4>
          <p className="text-xs text-depth-muted">Plain CSS 3D, driven by motion values.</p>
        </div>
      }
    />
  );
}

export function DemoStack() {
  return (
    <DepthStack>
      <DepthLayer depth={0.1}><div className="h-56 w-56 rounded-full bg-depth-accent/20 blur-2xl" /></DepthLayer>
      <DepthLayer depth={0.4}><div className="h-36 w-36 rounded-3xl border border-depth-accent-2/50 bg-depth-accent-2/10" /></DepthLayer>
      <DepthLayer depth={0.8}>
        <div className="rounded-xl border border-depth-border bg-depth-elevated px-5 py-3 text-lg font-semibold shadow-xl">Foreground</div>
      </DepthLayer>
    </DepthStack>
  );
}

export function DemoCube() {
  return (
    <Cube3D
      size={150}
      faces={["Tailwind", "Motion", "React", "3D", "GPU", "Light"].map((t) => (
        <span key={t} className="text-lg font-semibold">{t}</span>
      ))}
    />
  );
}

export function DemoCarousel() {
  return (
    <Carousel3D
      items={slides.map(([t, d, c]) => (
        <div key={t} className={`flex h-full flex-col justify-end bg-gradient-to-t ${c} to-transparent p-5`}>
          <h3 className="text-2xl font-semibold">{t}</h3>
          <p className="text-sm text-depth-muted">{d}</p>
        </div>
      ))}
    />
  );
}

export function DemoCoverFlow() {
  return (
    <CoverFlow
      itemWidth={150}
      itemHeight={200}
      items={albums.map(([t, c]) => (
        <div key={t} className={`flex h-full flex-col justify-end bg-gradient-to-br ${c} p-4`}>
          <span className="font-mono text-[10px] uppercase tracking-widest text-depth-muted">album</span>
          <h3 className="text-xl font-semibold">{t}</h3>
        </div>
      ))}
    />
  );
}

export function DemoOrbit() {
  return (
    <Orbit3D
      center={
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-depth-accent to-depth-accent-2 text-sm font-bold text-white shadow-xl">Core</div>
      }
      rings={[
        { radius: 66, duration: 18, items: [chip("React", "from-sky-400/20 to-transparent"), chip("Tailwind", "from-cyan-400/20 to-transparent"), chip("Motion", "from-pink-400/20 to-transparent")] },
        { radius: 110, duration: 30, reverse: true, items: [chip("TS", "from-blue-400/20 to-transparent"), chip("Vite", "from-violet-400/20 to-transparent"), chip("CSS 3D", "from-amber-400/20 to-transparent"), chip("GPU", "from-emerald-400/20 to-transparent")] },
      ]}
    />
  );
}

export function DemoLayers() {
  return (
    <LayerStack
      size={140}
      layers={[["Database", "from-emerald-400/40"], ["API", "from-cyan-400/40"], ["Logic", "from-violet-500/40"], ["UI", "from-pink-400/40"]].map(([t, c]) => (
        <div key={t} className={`flex h-full items-end bg-gradient-to-br ${c} to-transparent p-3`}>
          <span className="font-mono text-xs font-medium">{t}</span>
        </div>
      ))}
    />
  );
}

export function DemoIso() {
  return (
    <IsometricGrid
      size={56}
      gap={10}
      items={["Auth", "Billing", "Search", "Mail", "Files", "Chat", "Maps", "Docs", "Admin"].map((t) => <span key={t}>{t}</span>)}
    />
  );
}

export function DemoFloor() {
  return (
    <GridFloor className="h-[300px] w-full">
      <h3 className="text-3xl font-bold tracking-tight">Infinite floor</h3>
    </GridFloor>
  );
}

export function DemoMarquee3D() {
  const items = Array.from({ length: 16 }, (_, i) => (
    <div key={i} className={`flex h-24 w-44 items-end rounded-xl border border-depth-border bg-gradient-to-br ${tones[i % 4]} bg-depth-surface p-3`}>
      <span className="font-mono text-xs">card-{String(i + 1).padStart(2, "0")}</span>
    </div>
  ));
  return <Marquee3D items={items} />;
}

const dockIcons = [
  ["Home", "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"],
  ["Search", "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5"],
  ["Mail", "M3 6h18v12H3zM3 7l9 7 9-7"],
  ["Photos", "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01"],
  ["Settings", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2-1-2-4-2 1-2-1-1-2H9L8 8 6 9 4 8 2 12l2 1v2l-2 1 2 4 2-1 2 1 1 2h4l1-2 2-1 2 1 2-4-2-1z"],
];
export function DemoDock() {
  return <Dock3D baseSize={38} items={dockIcons.map(([label, d]) => ({ label, icon: <Ico d={d} /> }))} />;
}

export function DemoText3D() {
  return <Text3D text="DEPTH" />;
}

/* ---------------- interactive playground ---------------- */

export function Playground() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button3D onClick={() => setOpen(true)}>Open modal</Button3D>
      <Button3D variant="neutral" onClick={() => toast({ title: "Saved", description: "Your changes are live.", tone: "success" })}>
        Show toast
      </Button3D>
      <Tooltip3D content="Hover or focus me">
        <Button3D variant="neutral">Tooltip</Button3D>
      </Tooltip3D>
      <Loader3D variant="cube" size={40} />
      <Modal3D
        open={open}
        onClose={() => setOpen(false)}
        title="Invite your team"
        description="Everyone gets the same light and dark tokens."
        footer={
          <>
            <Button3D variant="neutral" onClick={() => setOpen(false)}>Cancel</Button3D>
            <Button3D
              onClick={() => {
                setOpen(false);
                toast({ title: "Invites sent", tone: "success" });
              }}
            >
              Send
            </Button3D>
          </>
        }
      >
        <GlowInput label="Email address" type="email" />
      </Modal3D>
    </div>
  );
}
