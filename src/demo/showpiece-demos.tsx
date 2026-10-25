import { useState } from "react";
import {
  BarChart3D,
  Coin3D,
  Envelope3D,
  Folder3D,
  Laptop3D,
  Phone3D,
  Dice3D,
  Ticket3D,
  CardFan3D,
  PeelCard,
  Turntable3D,
  SlotMachine3D,
  NewtonsCradle3D,
  Bookshelf3D,
  Prism3D,
  Doors3D,
  RubiksCube3D,
  Hourglass3D,
  Gyroscope3D,
  Badge3D,
  Pyramid3D,
  Helix3D,
  Vault3D,
  FoldPanels3D,
  EightBall3D,
  Compass3D,
  Tunnel3D,
  PinArt3D,
  TileFlip3D,
  ImageTrail3D,
  StackScroll3D,
  TagCloud3D,
  Extrude3D,
  Knob3D,
  RadialMenu3D,
  WheelPicker3D,
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

export function DemoBars() {
  return (
    <div className="w-full max-w-md">
      <BarChart3D
        data={[
          { label: "Mon", value: 42 },
          { label: "Tue", value: 68 },
          { label: "Wed", value: 55 },
          { label: "Thu", value: 91 },
          { label: "Fri", value: 74 },
          { label: "Sat", value: 38 },
        ]}
        format={(v) => `${v}k visits`}
      />
    </div>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));

export function DemoWheel() {
  const [month, setMonth] = useState("Oct");
  const [day, setDay] = useState("24");
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        <WheelPicker3D label="Month" options={MONTHS} value={month} onChange={setMonth} className="w-28" />
        <WheelPicker3D label="Day" options={DAYS} value={day} onChange={setDay} className="w-20" />
      </div>
      <p className="font-mono text-sm text-depth-muted" aria-live="polite">
        Selected: <span className="text-depth-accent">{month} {day}</span>
      </p>
    </div>
  );
}

const ic = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

export function DemoRadial() {
  const [last, setLast] = useState("nothing yet");
  const pick = (n: string) => () => setLast(n);
  return (
    <div className="flex flex-col items-center gap-2">
      <RadialMenu3D
        radius={112}
        items={[
          { label: "Home", icon: ic("M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"), onSelect: pick("Home") },
          { label: "Search", icon: ic("M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5"), onSelect: pick("Search") },
          { label: "Mail", icon: ic("M3 6h18v12H3zM3 7l9 7 9-7"), onSelect: pick("Mail") },
          { label: "Photos", icon: ic("M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01"), onSelect: pick("Photos") },
          { label: "Settings", icon: ic("M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2-1-2-4-2 1-2-1-1-2H9L8 8 6 9 4 8 2 12l2 1v2l-2 1 2 4 2-1 2 1 1 2h4l1-2 2-1 2 1 2-4-2-1z"), onSelect: pick("Settings") },
        ]}
      />
      <p className="font-mono text-xs text-depth-muted" aria-live="polite">picked: {last}</p>
    </div>
  );
}

export function DemoExtrude() {
  return (
    <Extrude3D depth={30} layers={16}>
      <span className="block px-2 text-7xl font-black leading-none tracking-tighter sm:text-8xl">DEPTH</span>
    </Extrude3D>
  );
}

export function DemoKnobs() {
  const [vol, setVol] = useState(64);
  return (
    <div className="flex flex-wrap items-start justify-center gap-10">
      <Knob3D label="Volume" value={vol} onChange={setVol} />
      <Knob3D label="Bass" defaultValue={25} size={112} />
    </div>
  );
}

/** Fit a fixed-size piece to narrow screens (computed once on mount). */
const fit = (max: number) => () =>
  Math.max(240, Math.min(max, (typeof window === "undefined" ? max : window.innerWidth) - 76));

export function DemoTagCloud() {
  const [size] = useState(fit(340));
  return (
    <TagCloud3D
      size={size}
      tags={[
        "React", "Tailwind", "Motion", "TypeScript", "Vite", "CSS 3D", "Accessible", "Dark mode",
        "Copy-paste", "No WebGL", "GPU", "Open source", "Spring", "Perspective", "Themes", "Cards",
        "Buttons", "Modal", "Toast", "Globe", "Parallax", "Tilt", "Orbit", "Cube",
      ]}
    />
  );
}

export function DemoLaptop() {
  const [w] = useState(fit(560));
  return (
    <Laptop3D width={w}>
      <div className="flex h-full flex-col bg-depth-bg">
        <div className="flex items-center gap-1.5 border-b border-depth-border px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-depth-accent-3" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="ml-3 h-2 w-24 rounded bg-depth-border" />
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2 p-3">
          {["Revenue", "Users", "Uptime"].map((t, i) => (
            <div key={t} className="rounded-md border border-depth-border bg-depth-surface p-2">
              <p className="font-mono text-[8px] uppercase text-depth-muted">{t}</p>
              <p className="text-sm font-semibold sm:text-lg">{["$48k", "12.4k", "99.9%"][i]}</p>
            </div>
          ))}
          <div className="col-span-3 rounded-md bg-gradient-to-r from-depth-accent/40 via-depth-accent-3/30 to-depth-accent-2/40" />
        </div>
      </div>
    </Laptop3D>
  );
}

export function DemoFolder() {
  return <Folder3D label="Project files" papers={[{ title: "Brief" }, { title: "Designs" }, { title: "Notes" }]} />;
}

export function DemoEnvelope() {
  return (
    <Envelope3D width={280}>
      <span className="block text-sm font-semibold">You are invited</span>
      <span className="mt-2 block text-xs text-depth-muted">Join the Depth UI community and star the repo.</span>
      <span className="mt-3 block h-1.5 w-3/4 rounded bg-depth-border" />
    </Envelope3D>
  );
}

export function DemoPhone() {
  const chip = (t: string, c: string) => (
    <span className={`whitespace-nowrap rounded-full border border-depth-border bg-depth-surface px-3 py-1.5 text-xs font-medium shadow-lg ${c}`}>{t}</span>
  );
  return (
    <Phone3D
      width={200}
      chips={[
        { node: chip("+24% this week", "text-emerald-600"), x: -38, y: 14, z: 70 },
        { node: chip("Deployed ✓", ""), x: 64, y: 62, z: 90 },
      ]}
    >
      <div className="flex h-full flex-col gap-2 px-3 pb-3">
        <div className="h-24 rounded-2xl bg-gradient-to-br from-depth-accent to-depth-accent-2" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl border border-depth-border bg-depth-surface p-2">
            <span className="h-7 w-7 rounded-lg bg-depth-elevated" />
            <span className="flex flex-1 flex-col gap-1">
              <span className="h-1.5 w-3/4 rounded bg-depth-border" />
              <span className="h-1.5 w-1/2 rounded bg-depth-border" />
            </span>
          </div>
        ))}
      </div>
    </Phone3D>
  );
}

export function DemoDice() {
  const [last, setLast] = useState<number | null>(null);
  return (
    <div className="flex flex-col items-center gap-10 py-6">
      <div className="flex gap-12">
        <Dice3D onRoll={setLast} />
        <Dice3D initial={6} size={72} />
      </div>
      <p className="text-sm text-depth-muted">
        {last ? `You rolled a ${last}.` : "Click a die, or focus it and press Enter."}
      </p>
    </div>
  );
}

export function DemoTicket() {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <Ticket3D />
      <p className="text-xs text-depth-muted">Click the ticket to tear off the stub.</p>
    </div>
  );
}

const FAN: { t: string; c: string; g: string }[] = [
  { t: "Cards", c: "A", g: "from-rose-500 to-orange-400" },
  { t: "Buttons", c: "B", g: "from-orange-400 to-amber-300" },
  { t: "Modals", c: "C", g: "from-emerald-500 to-teal-400" },
  { t: "Charts", c: "D", g: "from-sky-500 to-indigo-500" },
  { t: "Globes", c: "E", g: "from-violet-500 to-fuchsia-500" },
];

export function DemoFan() {
  const [pick, setPick] = useState<number | null>(null);
  const [w] = useState(() => Math.max(96, Math.min(140, ((typeof window === "undefined" ? 600 : window.innerWidth) - 76) / 2.3)));
  return (
    <div className="flex flex-col items-center gap-4 pt-10">
      <CardFan3D
        width={w}
        height={w * 1.4}
        onSelect={setPick}
        cards={FAN.map((x) => (
          <span className={`flex h-full w-full flex-col justify-between bg-gradient-to-br ${x.g} p-3 text-white`}>
            <span className="text-2xl font-bold">{x.c}</span>
            <span className="text-sm font-semibold">{x.t}</span>
          </span>
        ))}
      />
      <p className="mt-8 text-xs text-depth-muted">{pick === null ? "Hover, tab or arrow through the hand." : `Picked: ${FAN[pick].t}`}</p>
    </div>
  );
}

export function DemoPeel() {
  const [w] = useState(() => Math.min(280, (typeof window === "undefined" ? 280 : window.innerWidth) - 76));
  return (
    <PeelCard
      width={w}
      height={320}
      reveal={
        <span className="flex h-full flex-col items-end justify-end text-right">
          <span className="text-[10px] uppercase tracking-widest opacity-80">Code</span>
          <span className="text-lg font-bold">DEPTH25</span>
        </span>
      }
    >
      <span className="flex h-full flex-col justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-depth-muted">Gift card</span>
        <span className="text-3xl font-bold leading-tight">Peel the corner</span>
        <span className="text-sm text-depth-muted">Hover, focus or tap.</span>
      </span>
    </PeelCard>
  );
}

export function DemoTurntable() {
  const [size] = useState(fit(320));
  return <Turntable3D size={size} />;
}

export function DemoSlots() {
  return <SlotMachine3D />;
}

export function DemoCradle() {
  const [w] = useState(() => (typeof window === "undefined" ? 600 : window.innerWidth) - 76);
  return <NewtonsCradle3D ball={w < 320 ? 36 : 46} length={w < 320 ? 120 : 150} />;
}

export function DemoShelf() {
  const [scale] = useState(() => Math.min(1, ((typeof window === "undefined" ? 600 : window.innerWidth) - 76) / 420));
  const k = (n: number) => Math.round(n * scale);
  return (
    <div className="py-10">
      <Bookshelf3D
        depth={k(120)}
        books={[
          { title: "Perspective", color: "#7c3aed", thickness: k(34), height: k(190) },
          { title: "Parallax", color: "#0ea5e9", thickness: k(42), height: k(170) },
          { title: "Vanishing Point", color: "#e11d48", thickness: k(30), height: k(200) },
          { title: "Z-Index", color: "#16a34a", thickness: k(38), height: k(180) },
          { title: "Depth of Field", color: "#f59e0b", thickness: k(46), height: k(195) },
          { title: "Isometric", color: "#334155", thickness: k(32), height: k(175) },
        ]}
      />
    </div>
  );
}

export function DemoPrism() {
  const [w] = useState(() => Math.min(260, (typeof window === "undefined" ? 600 : window.innerWidth) - 96));
  const face = (t: string, s: string, g: string) => (
    <div className={`flex h-full flex-col justify-end bg-gradient-to-br ${g} p-5 text-white`}>
      <p className="text-xl font-bold">{t}</p>
      <p className="text-sm opacity-90">{s}</p>
    </div>
  );
  return (
    <Prism3D
      width={w}
      labels={["Design", "Build", "Ship"]}
      faces={[
        face("Design", "Sketch it in depth.", "from-violet-500 to-fuchsia-500"),
        face("Build", "Copy, paste, tweak.", "from-sky-500 to-indigo-500"),
        face("Ship", "No WebGL, no bundle bloat.", "from-emerald-500 to-teal-400"),
      ]}
    />
  );
}

export function DemoDoors() {
  const [w] = useState(() => Math.min(280, (typeof window === "undefined" ? 600 : window.innerWidth) - 76));
  return (
    <Doors3D width={w} height={320}>
      <span className="block text-white">
        <span className="block text-xs uppercase tracking-widest opacity-80">Welcome in</span>
        <span className="block text-2xl font-bold">Depth UI</span>
      </span>
    </Doors3D>
  );
}

export function DemoRubik() {
  const [size] = useState(() => Math.max(150, Math.min(210, (typeof window === "undefined" ? 600 : window.innerWidth) - 150)));
  return <RubiksCube3D size={size} />;
}

export function DemoHourglass() {
  const [flips, setFlips] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <Hourglass3D seconds={12} onFinish={() => setFlips((n) => n + 1)} />
      <p className="text-xs text-depth-muted">
        {flips ? `Ran out ${flips}×. Click to flip it.` : "Click the hourglass to flip it."}
      </p>
    </div>
  );
}

export function DemoGyro() {
  const [size] = useState(() => Math.min(230, (typeof window === "undefined" ? 600 : window.innerWidth) - 100));
  return <Gyroscope3D size={size} />;
}

export function DemoBadge() {
  return (
    <Badge3D>
      <div className="flex h-full flex-col items-center px-4 text-center">
        <div className="mb-3 h-20 w-20 rounded-full bg-gradient-to-br from-depth-accent to-depth-accent-2" />
        <p className="text-lg font-bold">Akram</p>
        <p className="text-xs text-depth-muted">Creator, Depth UI</p>
        <p className="mt-auto pb-4 font-mono text-[10px] uppercase tracking-widest text-depth-muted">Drag me</p>
      </div>
    </Badge3D>
  );
}

export function DemoPyramid() {
  return <Pyramid3D />;
}

export function DemoHelix() {
  return <Helix3D />;
}

export function DemoVault() {
  const [size] = useState(() => Math.max(250, Math.min(300, (typeof window === "undefined" ? 600 : window.innerWidth) - 76)));
  return (
    <div className="flex flex-col items-center gap-2">
      <Vault3D size={size} code={[12, 47, 83]}>
        <p className="text-xs uppercase tracking-widest text-depth-muted">Inside</p>
        <p className="mt-1 text-xl font-bold">Depth UI v1</p>
        <p className="mt-1 text-xs text-depth-muted">You cracked it.</p>
      </Vault3D>
      <p className="text-xs text-depth-muted">Hint: 12, then 47, then 83. Drag the dial, let go to lock each one in.</p>
    </div>
  );
}

export function DemoFold() {
  const [pw] = useState(() => Math.max(52, Math.min(96, Math.floor(((typeof window === "undefined" ? 600 : window.innerWidth) - 90) / 5))));
  return (
    <FoldPanels3D panels={5} panelWidth={pw} height={Math.round(pw * 2.8)}>
      <div
        className="h-full w-full"
        style={{ background: "linear-gradient(120deg,#7c3aed 0%,#ec4899 35%,#f59e0b 65%,#22d3ee 100%)" }}
      >
        <div className="flex h-full w-full flex-col justify-between p-5 text-white">
          <span className="font-mono text-xs uppercase tracking-widest">Folding screen</span>
          <span className="text-5xl font-black leading-none tracking-tight">Fold<br />it in<br />depth</span>
        </div>
      </div>
    </FoldPanels3D>
  );
}

export function DemoEightBall() {
  const [size] = useState(() => Math.min(220, (typeof window === "undefined" ? 600 : window.innerWidth) - 110));
  return <EightBall3D size={size} />;
}

export function DemoCompass() {
  const [size] = useState(() => Math.min(260, (typeof window === "undefined" ? 600 : window.innerWidth) - 110));
  return <Compass3D size={size} />;
}

export function DemoTunnel() {
  return (
    <Tunnel3D className="h-[340px] w-full">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest opacity-70">Hover to speed up</p>
        <p className="mt-1 text-3xl font-black tracking-tight">Into the depth</p>
      </div>
    </Tunnel3D>
  );
}

export function DemoPinArt() {
  const [cols] = useState(() => ((typeof window === "undefined" ? 800 : window.innerWidth) < 520 ? 10 : 18));
  return <PinArt3D cols={cols} rows={12} />;
}

export function DemoTileFlip() {
  const [w] = useState(() => Math.min(360, (typeof window === "undefined" ? 600 : window.innerWidth) - 90));
  const h = Math.round(w * 0.68);
  const scene = (g: string, label: string) => (
    <div className="flex h-full w-full items-end p-4 text-white" style={{ background: g }}>
      <span className="text-3xl font-black tracking-tight">{label}</span>
    </div>
  );
  return (
    <TileFlip3D
      width={w}
      height={h}
      cols={6}
      rows={4}
      front={scene("linear-gradient(135deg,#7c3aed,#ec4899 55%,#f59e0b)", "Before")}
      back={scene("linear-gradient(135deg,#0ea5e9,#22d3ee 50%,#34d399)", "After")}
    />
  );
}

export function DemoTrail() {
  const palette = [
    "linear-gradient(135deg,#7c3aed,#ec4899)",
    "linear-gradient(135deg,#0ea5e9,#22d3ee)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#10b981,#84cc16)",
    "linear-gradient(135deg,#6366f1,#a78bfa)",
    "linear-gradient(135deg,#f43f5e,#fb923c)",
  ];
  return (
    <ImageTrail3D
      className="h-[380px] w-full bg-depth-elevated/40"
      items={palette.map((g, i) => (
        <div key={i} className="flex h-full w-full items-end p-2 text-white" style={{ background: g }}>
          <span className="text-2xl font-black">{String(i + 1).padStart(2, "0")}</span>
        </div>
      ))}
    />
  );
}

export function DemoScrollStack() {
  const cards = [
    ["Sketch", "from-violet-500 to-fuchsia-500"],
    ["Prototype", "from-sky-500 to-indigo-500"],
    ["Build", "from-emerald-500 to-teal-500"],
    ["Polish", "from-amber-500 to-orange-500"],
    ["Ship", "from-rose-500 to-pink-500"],
  ];
  return (
    <StackScroll3D
      className="w-full max-w-md bg-depth-elevated/40"
      height={400}
      cards={cards.map(([t, g], i) => (
        <div className={`flex h-full w-full flex-col justify-between bg-gradient-to-br ${g} p-6 text-white`}>
          <span className="font-mono text-xs uppercase tracking-widest opacity-80">Step {i + 1}</span>
          <span className="text-4xl font-black tracking-tight">{t}</span>
        </div>
      ))}
    />
  );
}
