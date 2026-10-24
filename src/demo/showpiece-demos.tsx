import { useState } from "react";
import {
  Coin3D,
  ExpandingPanels3D,
  FlipClock3D,
  GalleryWall3D,
  Globe3D,
  NotificationStack3D,
  PageTurn,
  TextCylinder3D,
  type StackNotification,
} from "@/components/depth";

const tones = [
  "from-violet-500/70 to-fuchsia-500/40",
  "from-cyan-400/70 to-sky-500/40",
  "from-pink-400/70 to-rose-500/40",
  "from-amber-400/70 to-orange-500/40",
  "from-emerald-400/70 to-teal-500/40",
  "from-indigo-400/70 to-purple-500/40",
];

export function DemoGlobe() {
  return (
    <Globe3D
      size={260}
      markers={[
        { lat: 19, lon: 73, label: "Mumbai" },
        { lat: 51, lon: 0, label: "London" },
        { lat: 40, lon: -74, label: "New York" },
        { lat: 35, lon: 139, label: "Tokyo" },
        { lat: -33, lon: 151, label: "Sydney" },
        { lat: -23, lon: -46, label: "São Paulo" },
      ]}
    />
  );
}

export function DemoClock() {
  return <FlipClock3D />;
}

export function DemoCounter() {
  const [n, setN] = useState(1280);
  return (
    <div className="flex flex-col items-center gap-4">
      <FlipClock3D value={String(n).padStart(5, "0")} />
      <button
        type="button"
        onClick={() => setN((v) => v + Math.ceil(Math.random() * 90))}
        className="rounded-full border border-depth-border bg-depth-surface px-4 py-1.5 text-sm outline-none transition-colors hover:border-depth-accent focus-visible:ring-2 focus-visible:ring-depth-accent"
      >
        Add visitors
      </button>
    </div>
  );
}

export function DemoCylinder() {
  return (
    <div className="text-center">
      <p className="text-sm text-depth-muted">We build for</p>
      <TextCylinder3D
        words={["designers", "founders", "students", "agencies", "teams", "makers"]}
        className="w-64"
        wordClassName="bg-gradient-to-r from-depth-accent to-depth-accent-2 bg-clip-text text-transparent"
      />
    </div>
  );
}

export function DemoCoin() {
  return (
    <Coin3D
      front={<span className="text-5xl font-black text-depth-accent">D</span>}
      back={
        <span className="text-center font-mono text-xs uppercase tracking-widest text-depth-muted">
          depth
          <br />
          ui
        </span>
      }
    />
  );
}

export function DemoWall() {
  const items = Array.from({ length: 16 }, (_, i) => (
    <div key={i} className={`flex h-full items-end bg-gradient-to-br ${tones[i % tones.length]} p-3`}>
      <span className="font-mono text-xs text-white/90">frame-{String(i + 1).padStart(2, "0")}</span>
    </div>
  ));
  return <GalleryWall3D items={items} columns={4} height={420} />;
}

export function DemoBookTurn() {
  const page = (t: string, body: string, c: string) => (
    <div className="flex h-full flex-col">
      <div className={`mb-3 h-20 rounded-lg bg-gradient-to-br ${c}`} />
      <h4 className="font-semibold">{t}</h4>
      <p className="mt-1 text-xs text-depth-muted">{body}</p>
    </div>
  );
  return (
    <PageTurn
      pageWidth={150}
      pageHeight={226}
      pages={[
        page("Depth UI", "A field guide to CSS 3D.", tones[0]),
        page("Contents", "01 Cards · 02 Scenes · 03 Controls · 04 Showpieces", tones[1]),
        page("Cards", "Tilt, spotlight, holo, flip.", tones[2]),
        page("Scenes", "Cubes, orbits, carousels.", tones[3]),
        page("Controls", "Buttons that feel physical.", tones[4]),
        page("The end", "Copy it and make it yours.", tones[5]),
      ]}
    />
  );
}

const notes: StackNotification[] = [
  { id: "1", title: "Deploy succeeded", body: "depthui.vercel.app is live on the latest commit.", time: "now" },
  { id: "2", title: "New star on GitHub", body: "Someone starred depthui/depthui.", time: "2m" },
  { id: "3", title: "Pull request merged", body: "Bump framer-motion to 14.4.0.", time: "1h" },
  { id: "4", title: "Weekly digest", body: "Three new components shipped this week.", time: "1d" },
];

export function DemoNotifs() {
  return <NotificationStack3D items={notes} />;
}

export function DemoPanels() {
  return (
    <ExpandingPanels3D
      height={320}
      panels={[
        { title: "Tilt", subtitle: "Pointer-driven rotation", background: `bg-gradient-to-br ${tones[0]}` },
        { title: "Flip", subtitle: "Spring card flips", background: `bg-gradient-to-br ${tones[1]}` },
        { title: "Orbit", subtitle: "Rings around a core", background: `bg-gradient-to-br ${tones[2]}` },
        { title: "Cube", subtitle: "Drag to spin", background: `bg-gradient-to-br ${tones[3]}` },
        { title: "Globe", subtitle: "Wireframe, no WebGL", background: `bg-gradient-to-br ${tones[4]}` },
      ]}
    />
  );
}
