import { Showcase, type CodeFile } from "./showcase";
import {
  DemoBookTurn,
  DemoClock,
  DemoCoin,
  DemoCounter,
  DemoCylinder,
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
    </>
  );
}
