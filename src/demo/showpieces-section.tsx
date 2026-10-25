import { Showcase, type CodeFile } from "./showcase";
import {
  DemoBars,
  DemoExtrude,
  DemoKnobs,
  DemoRadial,
  DemoWheel,
  DemoBookTurn,
  DemoClock,
  DemoCoin,
  DemoCounter,
  DemoCylinder,
  DemoEnvelope,
  DemoFolder,
  DemoLaptop,
  DemoPhone,
  DemoDice,
  DemoTicket,
  DemoFan,
  DemoPeel,
  DemoTurntable,
  DemoSlots,
  DemoCradle,
  DemoShelf,
  DemoPrism,
  DemoDoors,
  DemoRubik,
  DemoHourglass,
  DemoGyro,
  DemoBadge,
  DemoPyramid,
  DemoHelix,
  DemoVault,
  DemoFold,
  DemoEightBall,
  DemoCompass,
  DemoTunnel,
  DemoPinArt,
  DemoTileFlip,
  DemoTrail,
  DemoScrollStack,
  DemoTagCloud,
  DemoGlobe,
  DemoNotifs,
  DemoPanels,
  DemoWall,
} from "./showpiece-demos";

import globeSrc from "@/components/depth/showpieces/globe-3d.tsx?raw";
import clockSrc from "@/components/depth/showpieces/flip-clock-3d.tsx?raw";
import cylinderSrc from "@/components/depth/showpieces/text-cylinder-3d.tsx?raw";
import coinSrc from "@/components/depth/showpieces/coin-3d.tsx?raw";
import wallSrc from "@/components/depth/showpieces/gallery-wall-3d.tsx?raw";
import pageSrc from "@/components/depth/showpieces/page-turn.tsx?raw";
import notifSrc from "@/components/depth/showpieces/notification-stack-3d.tsx?raw";
import panelsSrc from "@/components/depth/showpieces/expanding-panels-3d.tsx?raw";
import barsSrc from "@/components/depth/showpieces/bar-chart-3d.tsx?raw";
import wheelSrc from "@/components/depth/showpieces/wheel-picker-3d.tsx?raw";
import radialSrc from "@/components/depth/showpieces/radial-menu-3d.tsx?raw";
import extrudeSrc from "@/components/depth/showpieces/extrude-3d.tsx?raw";
import knobSrc from "@/components/depth/showpieces/knob-3d.tsx?raw";
import tagSrc from "@/components/depth/showpieces/tag-cloud-3d.tsx?raw";
import laptopSrc from "@/components/depth/showpieces/laptop-3d.tsx?raw";
import folderSrc from "@/components/depth/showpieces/folder-3d.tsx?raw";
import envelopeSrc from "@/components/depth/showpieces/envelope-3d.tsx?raw";
import phoneSrc from "@/components/depth/showpieces/phone-3d.tsx?raw";
import diceSrc from "@/components/depth/showpieces/dice-3d.tsx?raw";
import ticketSrc from "@/components/depth/showpieces/ticket-3d.tsx?raw";
import fanSrc from "@/components/depth/showpieces/card-fan-3d.tsx?raw";
import peelSrc from "@/components/depth/showpieces/peel-card.tsx?raw";
import turntableSrc from "@/components/depth/showpieces/turntable-3d.tsx?raw";
import slotSrc from "@/components/depth/showpieces/slot-machine-3d.tsx?raw";
import cradleSrc from "@/components/depth/showpieces/newtons-cradle-3d.tsx?raw";
import shelfSrc from "@/components/depth/showpieces/bookshelf-3d.tsx?raw";
import prismSrc from "@/components/depth/showpieces/prism-3d.tsx?raw";
import doorsSrc from "@/components/depth/showpieces/doors-3d.tsx?raw";
import rubikSrc from "@/components/depth/showpieces/rubiks-cube-3d.tsx?raw";
import hourglassSrc from "@/components/depth/showpieces/hourglass-3d.tsx?raw";
import gyroSrc from "@/components/depth/showpieces/gyroscope-3d.tsx?raw";
import badgeSrc from "@/components/depth/showpieces/badge-3d.tsx?raw";
import pyramidSrc from "@/components/depth/showpieces/pyramid-3d.tsx?raw";
import helixSrc from "@/components/depth/showpieces/helix-3d.tsx?raw";
import vaultSrc from "@/components/depth/showpieces/vault-3d.tsx?raw";
import foldSrc from "@/components/depth/showpieces/fold-panels-3d.tsx?raw";
import eightSrc from "@/components/depth/showpieces/eight-ball-3d.tsx?raw";
import compassSrc from "@/components/depth/showpieces/compass-3d.tsx?raw";
import tunnelSrc from "@/components/depth/showpieces/tunnel-3d.tsx?raw";
import pinSrc from "@/components/depth/showpieces/pin-art-3d.tsx?raw";
import tileSrc from "@/components/depth/showpieces/tile-flip-3d.tsx?raw";
import trailSrc from "@/components/depth/showpieces/image-trail-3d.tsx?raw";
import stackSrc from "@/components/depth/showpieces/stack-scroll-3d.tsx?raw";
import progressHookSrc from "@/hooks/use-scroll-progress.ts?raw";
import tiltHookSrc from "@/hooks/use-tilt.ts?raw";
import utilsSrc from "@/lib/utils.ts?raw";

const utils: CodeFile = { name: "lib/utils.ts", code: utilsSrc };
const tilt: CodeFile = { name: "hooks/use-tilt.ts", code: tiltHookSrc };
const f = (n: string, code: string): CodeFile => ({ name: `components/depth/showpieces/${n}.tsx`, code });

export function ShowpiecesSection() {
  return (
    <>
      <Showcase
        id="globe-3d"
        title="Globe"
        blurb="A wireframe globe made of CSS circles, with markers that vanish as they turn away. Drag to spin."
        usage={`import { Globe3D } from "@/components/depth";

<Globe3D
  size={260}
  speed={12}
  markers={[{ lat: 19, lon: 73, label: "Mumbai" }, { lat: 51, lon: 0, label: "London" }]}
/>`}
        files={[f("globe-3d", globeSrc), utils]}
        previewClassName="min-h-[360px]"
      >
        <DemoGlobe />
      </Showcase>

      <Showcase
        id="flip-clock-3d"
        title="Flip Clock"
        blurb="Split-flap digits that fold over when they change. Shows the time, or any value you give it."
        usage={`import { FlipClock3D } from "@/components/depth";

<FlipClock3D />                       // current time
<FlipClock3D hideSeconds />
<FlipClock3D value={String(visitors).padStart(5, "0")} />`}
        files={[f("flip-clock-3d", clockSrc), utils]}
        previewClassName="min-h-[300px]"
      >
        <div className="flex flex-col items-center gap-10">
          <DemoClock />
          <DemoCounter />
        </div>
      </Showcase>

      <Showcase
        id="text-cylinder-3d"
        title="Text Cylinder"
        blurb="Words around a vertical cylinder, like a slot reel. Drag it, or hover to pause."
        usage={`import { TextCylinder3D } from "@/components/depth";

<TextCylinder3D words={["designers", "founders", "makers"]} itemHeight={56} speed={22} />`}
        files={[f("text-cylinder-3d", cylinderSrc), utils]}
        previewClassName="min-h-[260px]"
      >
        <DemoCylinder />
      </Showcase>

      <Showcase
        id="coin-3d"
        title="Coin"
        blurb="A coin with a real rim built from stacked discs. It tilts with your pointer and flips on click."
        usage={`import { Coin3D } from "@/components/depth";

<Coin3D size={170} thickness={16} front={<span>D</span>} back={<span>depth ui</span>} />`}
        files={[f("coin-3d", coinSrc), tilt, utils]}
        previewClassName="min-h-[320px]"
      >
        <DemoCoin />
      </Showcase>

      <Showcase
        id="gallery-wall-3d"
        title="Gallery Wall"
        blurb="A grid laid back on a tilted plane. Move across it and the wall drifts while the tile under you lifts."
        usage={`import { GalleryWall3D } from "@/components/depth";

<GalleryWall3D columns={4} height={420} items={images.map((src) => <img src={src} className="h-full w-full object-cover" />)} />`}
        files={[f("gallery-wall-3d", wallSrc), utils]}
        previewClassName="overflow-hidden p-0 sm:p-0"
      >
        <DemoWall />
      </Showcase>

      <Showcase
        id="page-turn"
        title="Page Turn"
        blurb="An open book with pages that turn like paper. Click a page, use the buttons or the arrow keys."
        usage={`import { PageTurn } from "@/components/depth";

// pages come in pairs: front and back of each leaf
<PageTurn pageWidth={150} pageHeight={226} pages={[<Cover />, <Contents />, <PageOne />, <PageTwo />]} />`}
        files={[f("page-turn", pageSrc), utils]}
        previewClassName="min-h-[440px]"
      >
        <DemoBookTurn />
      </Showcase>

      <Showcase
        id="notification-stack-3d"
        title="Notification Stack"
        blurb="Notifications piled in depth. Hover, focus or tap to fan them out, and dismiss any of them."
        usage={`import { NotificationStack3D } from "@/components/depth";

<NotificationStack3D
  items={[{ id: "1", title: "Deploy succeeded", body: "Live on the latest commit.", time: "now" }]}
  onDismiss={(id) => console.log(id)}
/>`}
        files={[f("notification-stack-3d", notifSrc), utils]}
        previewClassName="min-h-[420px] items-start"
      >
        <DemoNotifs />
      </Showcase>

      <Showcase
        id="expanding-panels-3d"
        title="Expanding Panels"
        blurb="One panel opens wide while its neighbours lean away in 3D. Hover, focus or tap."
        usage={`import { ExpandingPanels3D } from "@/components/depth";

<ExpandingPanels3D
  height={320}
  panels={[
    { title: "Tilt", subtitle: "Pointer-driven rotation", background: "bg-gradient-to-br from-violet-500/70 to-fuchsia-500/40" },
    { title: "Flip", subtitle: "Spring card flips", background: "bg-gradient-to-br from-cyan-400/70 to-sky-500/40" },
  ]}
/>`}
        files={[f("expanding-panels-3d", panelsSrc), utils]}
        previewClassName="min-h-[380px]"
      >
        <DemoPanels />
      </Showcase>
      <Showcase
        id="bar-chart-3d"
        title="Bar Chart"
        blurb="Extruded bars with a lit front, shaded side and bright top. They grow from the floor when scrolled into view. Hover or tap a bar for its value."
        usage={`import { BarChart3D } from "@/components/depth";

<BarChart3D
  height={240}
  depth={22}
  data={[{ label: "Mon", value: 42 }, { label: "Tue", value: 68, color: "var(--depth-accent-2)" }]}
  format={(v) => v + "k visits"}
/>`}
        files={[f("bar-chart-3d", barsSrc), utils]}
        previewClassName="min-h-[400px]"
      >
        <DemoBars />
      </Showcase>
      <Showcase
        id="wheel-picker-3d"
        title="Wheel Picker"
        blurb="An iOS-style picker on a cylinder. Drag, scroll, click an option or use the arrow keys. It snaps to the nearest value."
        usage={`import { WheelPicker3D } from "@/components/depth";

const [month, setMonth] = useState("Oct");

<WheelPicker3D label="Month" options={["Jan", "Feb", "Mar"]} value={month} onChange={setMonth} />`}
        files={[f("wheel-picker-3d", wheelSrc), utils]}
        previewClassName="min-h-[360px]"
      >
        <DemoWheel />
      </Showcase>

      <Showcase
        id="radial-menu-3d"
        title="Radial Menu"
        blurb="A round button that fans its actions out along an arc, each popping forward in 3D. Esc closes, arrow keys move between actions."
        usage={`import { RadialMenu3D } from "@/components/depth";

<RadialMenu3D
  radius={112}
  items={[{ label: "Home", icon: <HomeIcon />, onSelect: goHome }, { label: "Mail", icon: <MailIcon /> }]}
/>`}
        files={[f("radial-menu-3d", radialSrc), utils]}
        previewClassName="min-h-[340px]"
      >
        <DemoRadial />
      </Showcase>

      <Showcase
        id="extrude-3d"
        title="Extrude"
        blurb="Gives flat text or an icon real thickness by stacking copies along Z. It sways on its own; drag to look around."
        usage={`import { Extrude3D } from "@/components/depth";

<Extrude3D depth={30} layers={16} color="var(--depth-accent)">
  <span className="text-8xl font-black">DEPTH</span>
</Extrude3D>`}
        files={[f("extrude-3d", extrudeSrc), utils]}
        previewClassName="min-h-[340px]"
      >
        <DemoExtrude />
      </Showcase>

      <Showcase
        id="knob-3d"
        title="Knob"
        blurb="A rotary dial with a bevelled cap and ticks that light up to the value. Drag up or down, or use the keyboard."
        usage={`import { Knob3D } from "@/components/depth";

<Knob3D label="Volume" value={volume} onChange={setVolume} min={0} max={100} />
<Knob3D label="Bass" defaultValue={25} size={112} />`}
        files={[f("knob-3d", knobSrc), utils]}
        previewClassName="min-h-[320px]"
      >
        <DemoKnobs />
      </Showcase>

      <Showcase
        id="tag-cloud-3d"
        title="Tag Cloud"
        blurb="Tags spread over a turning sphere. Drag to spin it, hover to slow it. Tags can be links."
        usage={`import { TagCloud3D } from "@/components/depth";

<TagCloud3D size={340} tags={["React", "Tailwind", { label: "Docs", href: "/components" }]} />`}
        files={[f("tag-cloud-3d", tagSrc), utils]}
        previewClassName="min-h-[420px]"
      >
        <DemoTagCloud />
      </Showcase>

      <Showcase
        id="laptop-3d"
        title="Laptop"
        blurb="A laptop whose lid opens as you scroll it into view. Put anything on the screen."
        usage={`import { Laptop3D } from "@/components/depth";

<Laptop3D width={560}>
  <YourDashboard />
</Laptop3D>

// or control it
<Laptop3D open={isOpen}>...</Laptop3D>`}
        files={[f("laptop-3d", laptopSrc), { name: "hooks/use-scroll-progress.ts", code: progressHookSrc }, utils]}
        previewClassName="min-h-[460px]"
      >
        <DemoLaptop />
      </Showcase>

      <Showcase
        id="folder-3d"
        title="Folder"
        blurb="A folder that tips open and fans out its papers on hover, focus or tap."
        usage={`import { Folder3D } from "@/components/depth";

<Folder3D label="Project files" papers={[{ title: "Brief" }, { title: "Designs" }, { title: "Notes" }]} />`}
        files={[f("folder-3d", folderSrc), utils]}
        previewClassName="min-h-[380px]"
      >
        <DemoFolder />
      </Showcase>

      <Showcase
        id="envelope-3d"
        title="Envelope"
        blurb="The flap swings open in 3D and the letter rises out. Click, tap, Enter or Space."
        usage={`import { Envelope3D } from "@/components/depth";

<Envelope3D width={300}>
  <p>You are invited</p>
</Envelope3D>`}
        files={[f("envelope-3d", envelopeSrc), utils]}
        previewClassName="min-h-[400px]"
      >
        <DemoEnvelope />
      </Showcase>

      <Showcase
        id="phone-3d"
        title="Phone"
        blurb="A phone with real thickness that tilts with your pointer, with chips floating in front of it."
        usage={`import { Phone3D } from "@/components/depth";

<Phone3D width={200} chips={[{ node: <Chip>+24%</Chip>, x: -38, y: 14, z: 70 }]}>
  <YourAppScreen />
</Phone3D>`}
        files={[f("phone-3d", phoneSrc), tilt, utils]}
        previewClassName="min-h-[520px]"
      >
        <DemoPhone />
      </Showcase>

      <Showcase
        id="dice-3d"
        title="Dice"
        blurb="A real six-sided die. Click it and it tumbles, jumps and lands on a random face. Opposite faces add to seven."
        usage={`import { Dice3D } from "@/components/depth";

<Dice3D size={96} onRoll={(n) => console.log(n)} />`}
        files={[f("dice-3d", diceSrc), utils]}
        previewClassName="min-h-[360px]"
      >
        <DemoDice />
      </Showcase>

      <Showcase
        id="ticket-3d"
        title="Ticket"
        blurb="A boarding pass that tilts under a moving glare. Click it and the stub tears off along the perforation."
        usage={`import { Ticket3D } from "@/components/depth";

<Ticket3D from="BOM" to="SFO" date="24 OCT 2026" seat="12A" gate="B7" code="DU-0925" />`}
        files={[f("ticket-3d", ticketSrc), tilt, utils]}
        previewClassName="min-h-[320px]"
      >
        <DemoTicket />
      </Showcase>

      <Showcase
        id="card-fan-3d"
        title="Card fan"
        blurb="A hand of cards in an arc. The one you point at rises while its neighbours part. Works with Tab and arrow keys."
        usage={`import { CardFan3D } from "@/components/depth";

<CardFan3D cards={[<CardA />, <CardB />, <CardC />]} onSelect={(i) => {}} />`}
        files={[f("card-fan-3d", fanSrc), utils]}
        previewClassName="min-h-[420px]"
      >
        <DemoFan />
      </Showcase>

      <Showcase
        id="peel-card"
        title="Peel card"
        blurb="A card with a curling corner. Hover, focus or tap and it peels back to show what is underneath."
        usage={`import { PeelCard } from "@/components/depth";

<PeelCard reveal={<p>Your code: DEPTH25</p>}>
  <p>Peel the corner</p>
</PeelCard>`}
        files={[f("peel-card", peelSrc), utils]}
        previewClassName="min-h-[400px]"
      >
        <DemoPeel />
      </Showcase>

      <Showcase
        id="turntable-3d"
        title="Turntable"
        blurb="A record player: the vinyl spins and the tonearm swings onto it when you press play."
        usage={`import { Turntable3D } from "@/components/depth";

<Turntable3D title="Midnight Depth" artist="The Perspectives" />`}
        files={[f("turntable-3d", turntableSrc), utils]}
        previewClassName="min-h-[460px]"
      >
        <DemoTurntable />
      </Showcase>

      <Showcase
        id="slot-machine-3d"
        title="Slot machine"
        blurb="Three reels that are real cylinders. They roll to a random symbol one after another, and you get a callback with the result."
        usage={`import { SlotMachine3D } from "@/components/depth";

<SlotMachine3D onResult={(symbols, won) => console.log(symbols, won)} />`}
        files={[f("slot-machine-3d", slotSrc), utils]}
        previewClassName="min-h-[400px]"
      >
        <DemoSlots />
      </Showcase>

      <Showcase
        id="newtons-cradle-3d"
        title="Newton's cradle"
        blurb="The desk toy. Each ball hangs from two strings, and the swing fades out by itself. Click to set it going again."
        usage={`import { NewtonsCradle3D } from "@/components/depth";

<NewtonsCradle3D balls={5} amplitude={38} />`}
        files={[f("newtons-cradle-3d", cradleSrc), utils]}
        previewClassName="min-h-[320px]"
      >
        <DemoCradle />
      </Showcase>

      <Showcase
        id="bookshelf-3d"
        title="Bookshelf"
        blurb="Books standing on a shelf. Point at one and it slides out and turns to show its cover. Each book is a real box."
        usage={`import { Bookshelf3D } from "@/components/depth";

<Bookshelf3D books={[{ title: "Perspective", color: "#7c3aed" }]} />`}
        files={[f("bookshelf-3d", shelfSrc), utils]}
        previewClassName="min-h-[380px]"
      >
        <DemoShelf />
      </Showcase>

      <Showcase
        id="prism-3d"
        title="Prism"
        blurb="A rotating prism that works as tabs. Three to eight faces, buttons, dots and arrow keys. It always turns the same way."
        usage={`import { Prism3D } from "@/components/depth";

<Prism3D faces={[<Design />, <Build />, <Ship />]} labels={["Design", "Build", "Ship"]} />`}
        files={[f("prism-3d", prismSrc), utils]}
        previewClassName="min-h-[340px]"
      >
        <DemoPrism />
      </Showcase>

      <Showcase
        id="doors-3d"
        title="Doors"
        blurb="Two doors on real hinges. Hover, focus or click and they swing open on a room lit from within."
        usage={`import { Doors3D } from "@/components/depth";

<Doors3D>
  <h3>Welcome in</h3>
</Doors3D>`}
        files={[f("doors-3d", doorsSrc), utils]}
        previewClassName="min-h-[420px]"
      >
        <DemoDoors />
      </Showcase>

      <Showcase
        id="rubiks-cube-3d"
        title="Puzzle cube"
        blurb="A 3x3 cube made of 27 real cubies. Scramble it and layers turn one by one. Solve plays the same moves backwards. Drag to look around."
        usage={`import { RubiksCube3D } from "@/components/depth";

<RubiksCube3D size={210} turnSeconds={0.32} />`}
        files={[f("rubiks-cube-3d", rubikSrc), utils]}
        previewClassName="min-h-[460px]"
      >
        <DemoRubik />
      </Showcase>

      <Showcase
        id="hourglass-3d"
        title="Hourglass"
        blurb="Sand runs from one bulb to the other. Click to flip it, even halfway through, and it carries on from where the sand is."
        usage={`import { Hourglass3D } from "@/components/depth";

<Hourglass3D seconds={20} onFinish={() => console.log("done")} />`}
        files={[f("hourglass-3d", hourglassSrc), utils]}
        previewClassName="min-h-[440px]"
      >
        <DemoHourglass />
      </Showcase>

      <Showcase
        id="gyroscope-3d"
        title="Gyroscope"
        blurb="Three nested rings turning on different axes around a glowing core. Pure CSS, so no JavaScript runs per frame."
        usage={`import { Gyroscope3D } from "@/components/depth";

<Gyroscope3D size={220} seconds={9} />`}
        files={[f("gyroscope-3d", gyroSrc), utils]}
        previewClassName="min-h-[360px]"
      >
        <DemoGyro />
      </Showcase>

      <Showcase
        id="badge-3d"
        title="Badge"
        blurb="An ID badge on a lanyard. Grab it and swing it. When you let go it settles back on a loose spring."
        usage={`import { Badge3D } from "@/components/depth";

<Badge3D>
  <YourBadgeContent />
</Badge3D>`}
        files={[f("badge-3d", badgeSrc), utils]}
        previewClassName="min-h-[520px]"
      >
        <DemoBadge />
      </Showcase>

      <Showcase
        id="pyramid-3d"
        title="Pyramid"
        blurb="A four-sided pyramid with a label on every face. It turns on its own. Drag to spin it and it keeps the swing."
        usage={`import { Pyramid3D } from "@/components/depth";

<Pyramid3D labels={["Depth", "Light", "Space", "Form"]} />`}
        files={[f("pyramid-3d", pyramidSrc), utils]}
        previewClassName="min-h-[400px]"
      >
        <DemoPyramid />
      </Showcase>

      <Showcase
        id="helix-3d"
        title="Helix"
        blurb="A double helix turning in space. The near side is bigger and brighter than the far side, so it reads as real depth."
        usage={`import { Helix3D } from "@/components/depth";

<Helix3D pairs={16} height={320} seconds={9} />`}
        files={[f("helix-3d", helixSrc), utils]}
        previewClassName="min-h-[420px]"
      >
        <DemoHelix />
      </Showcase>

      <Showcase
        id="vault-3d"
        title="Vault"
        blurb="A safe with a real combination dial. Turn it to each number, let go to lock it in, and the heavy door swings open."
        usage={`import { Vault3D } from "@/components/depth";

<Vault3D code={[12, 47, 83]} onOpen={() => console.log("open")}>
  <p>What is inside</p>
</Vault3D>`}
        files={[f("vault-3d", vaultSrc), utils]}
        previewClassName="min-h-[480px]"
      >
        <DemoVault />
      </Showcase>

      <Showcase
        id="fold-panels-3d"
        title="Folding screen"
        blurb="One picture cut across hinged panels that zig-zag shut and unfold flat. Each panel hangs on the one before it."
        usage={`import { FoldPanels3D } from "@/components/depth";

<FoldPanels3D panels={5} panelWidth={90} height={260}>
  <YourPicture />
</FoldPanels3D>`}
        files={[f("fold-panels-3d", foldSrc), utils]}
        previewClassName="min-h-[440px]"
      >
        <DemoFold />
      </Showcase>

      <Showcase
        id="eight-ball-3d"
        title="Magic 8 Ball"
        blurb="Think of a question, then shake the ball. It rattles around and an answer floats up in the window."
        usage={`import { EightBall3D } from "@/components/depth";

<EightBall3D onAnswer={(a) => console.log(a)} />`}
        files={[f("eight-ball-3d", eightSrc), utils]}
        previewClassName="min-h-[420px]"
      >
        <DemoEightBall />
      </Showcase>

      <Showcase
        id="compass-3d"
        title="Compass"
        blurb="The needle points at your pointer wherever it is on the page, and swings past before it settles."
        usage={`import { Compass3D } from "@/components/depth";

<Compass3D size={240} />`}
        files={[f("compass-3d", compassSrc), utils]}
        previewClassName="min-h-[360px]"
      >
        <DemoCompass />
      </Showcase>

      <Showcase
        id="tunnel-3d"
        title="Tunnel"
        blurb="Glowing frames rushing toward you down an endless tunnel. The tunnel bends toward your pointer, and hovering speeds it up."
        usage={`import { Tunnel3D } from "@/components/depth";

<Tunnel3D className="h-[340px] w-full" speed={260} twist={5}>
  <h2>Into the depth</h2>
</Tunnel3D>`}
        files={[f("tunnel-3d", tunnelSrc), utils]}
        previewClassName="min-h-[380px] !p-0"
      >
        <DemoTunnel />
      </Showcase>

      <Showcase
        id="pin-art-3d"
        title="Pin art"
        blurb="The pin-impression toy. Pins rise to meet your pointer and ease back down. Press and hold to push harder."
        usage={`import { PinArt3D } from "@/components/depth";

<PinArt3D cols={18} rows={12} lift={70} />`}
        files={[f("pin-art-3d", pinSrc), utils]}
        previewClassName="min-h-[400px]"
      >
        <DemoPinArt />
      </Showcase>

      <Showcase
        id="tile-flip-3d"
        title="Tile flip"
        blurb="A picture cut into tiles that flip to a second picture in a ripple from wherever you click."
        usage={`import { TileFlip3D } from "@/components/depth";

<TileFlip3D front={<Before />} back={<After />} cols={6} rows={4} width={360} height={240} />`}
        files={[f("tile-flip-3d", tileSrc), utils]}
        previewClassName="min-h-[360px]"
      >
        <DemoTileFlip />
      </Showcase>

      <Showcase
        id="image-trail-3d"
        title="Image trail"
        blurb="Cards that follow your pointer, tilt in from depth, float up and fade away. They are reused from a small pool, so fast swipes stay smooth."
        usage={`import { ImageTrail3D } from "@/components/depth";

<ImageTrail3D className="h-[380px] w-full" items={[<CardA />, <CardB />, <CardC />]} />`}
        files={[f("image-trail-3d", trailSrc), utils]}
        previewClassName="min-h-[420px]"
      >
        <DemoTrail />
      </Showcase>

      <Showcase
        id="stack-scroll-3d"
        title="Stack scroll"
        blurb="Cards that pile up as you scroll. Each one sticks, and as the next slides over it, it shrinks, tips back and dims."
        usage={`import { StackScroll3D } from "@/components/depth";

<StackScroll3D height={400} cards={[<StepOne />, <StepTwo />, <StepThree />]} />`}
        files={[f("stack-scroll-3d", stackSrc), utils]}
        previewClassName="min-h-[460px]"
      >
        <DemoScrollStack />
      </Showcase>
    </>
  );
}
