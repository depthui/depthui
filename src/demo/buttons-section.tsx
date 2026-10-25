import type { ReactNode } from "react";
import {
  ArrowButton,
  BeamButton,
  BrutalButton,
  FillButton,
  GlassButton,
  GradientButton,
  LoadingButton,
  MagneticButton,
  NeonButton,
  RippleButton,
  RollButton,
  ShimmerButton,
} from "@/components/depth";
import { Showcase, type CodeFile, pick } from "./showcase";

import magneticSrc from "@/components/depth/buttons/magnetic-button.tsx?raw";
import shimmerSrc from "@/components/depth/buttons/shimmer-button.tsx?raw";
import beamSrc from "@/components/depth/buttons/beam-button.tsx?raw";
import rippleSrc from "@/components/depth/buttons/ripple-button.tsx?raw";
import glassSrc from "@/components/depth/buttons/glass-button.tsx?raw";
import neonSrc from "@/components/depth/buttons/neon-button.tsx?raw";
import rollSrc from "@/components/depth/buttons/roll-button.tsx?raw";
import fillSrc from "@/components/depth/buttons/fill-button.tsx?raw";
import loadingSrc from "@/components/depth/buttons/loading-button.tsx?raw";
import gradientSrc from "@/components/depth/buttons/gradient-button.tsx?raw";
import brutalSrc from "@/components/depth/buttons/brutal-button.tsx?raw";
import arrowSrc from "@/components/depth/buttons/arrow-button.tsx?raw";
import utilsSrc from "@/lib/utils.ts?raw";
import motionCss from "@/styles/depth-motion.css?raw";

const utils: CodeFile = { name: "lib/utils.ts", code: utilsSrc };
const css: CodeFile = { name: "styles/depth-motion.css", code: motionCss };
const file = (n: string, code: string): CodeFile => ({ name: `components/depth/buttons/${n}.tsx`, code });

interface Entry {
  id: string;
  title: string;
  blurb: string;
  usage: string;
  files: CodeFile[];
  demo: ReactNode;
}

const wait = (ms: number, fail = false) =>
  new Promise((res, rej) => setTimeout(fail ? () => rej(new Error("failed")) : res, ms));

const ENTRIES: Entry[] = [
  {
    id: "magnetic-button",
    title: "Magnetic Button",
    blurb: "Pulls toward your pointer before you touch it. The label drifts a little less than the body.",
    usage: `import { MagneticButton } from "@/components/depth";

<MagneticButton strength={0.35} reach={48}>
  Hover near me
</MagneticButton>`,
    files: [file("magnetic-button", magneticSrc), utils],
    demo: <MagneticButton>Hover near me</MagneticButton>,
  },
  {
    id: "shimmer-button",
    title: "Shimmer Button",
    blurb: "A soft highlight sweeps across the face on a slow loop.",
    usage: `import { ShimmerButton } from "@/components/depth";

<ShimmerButton>Upgrade to Pro</ShimmerButton>`,
    files: [file("shimmer-button", shimmerSrc), css, utils],
    demo: <ShimmerButton>Upgrade to Pro</ShimmerButton>,
  },
  {
    id: "beam-button",
    title: "Beam Button",
    blurb: "A beam of light circles the border. One rotating gradient, no JavaScript per frame.",
    usage: `import { BeamButton } from "@/components/depth";

<BeamButton duration={4} thickness={1.5}>
  Start building
</BeamButton>`,
    files: [file("beam-button", beamSrc), css, utils],
    demo: <BeamButton>Start building</BeamButton>,
  },
  {
    id: "ripple-button",
    title: "Ripple Button",
    blurb: "Click anywhere on it and a ripple spreads from that point. Keyboard activation ripples from the centre.",
    usage: `import { RippleButton } from "@/components/depth";

<RippleButton onClick={save}>Save changes</RippleButton>`,
    files: [file("ripple-button", rippleSrc), utils],
    demo: <RippleButton>Save changes</RippleButton>,
  },
  {
    id: "glass-button",
    title: "Glass Button",
    blurb: "Frosted glass with a highlight that follows your pointer. Looks best over a colourful background.",
    usage: `import { GlassButton } from "@/components/depth";

<GlassButton>Continue</GlassButton>`,
    files: [file("glass-button", glassSrc), utils],
    demo: (
      <div className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 py-12">
        <GlassButton>Continue</GlassButton>
      </div>
    ),
  },
  {
    id: "neon-button",
    title: "Neon Button",
    blurb: "A glowing outline that brightens on hover. Three tones.",
    usage: `import { NeonButton } from "@/components/depth";

<NeonButton tone="violet">Violet</NeonButton>
<NeonButton tone="cyan">Cyan</NeonButton>
<NeonButton tone="pink">Pink</NeonButton>`,
    files: [file("neon-button", neonSrc), utils],
    demo: (
      <div className="flex flex-wrap justify-center gap-5">
        <NeonButton tone="violet">Violet</NeonButton>
        <NeonButton tone="cyan">Cyan</NeonButton>
        <NeonButton tone="pink">Pink</NeonButton>
      </div>
    ),
  },
  {
    id: "roll-button",
    title: "Roll Button",
    blurb: "Letters roll up one after another to reveal the same word underneath.",
    usage: `import { RollButton } from "@/components/depth";

// children must be a plain string
<RollButton stagger={18}>Read the docs</RollButton>`,
    files: [file("roll-button", rollSrc), utils],
    demo: <RollButton>Read the docs</RollButton>,
  },
  {
    id: "fill-button",
    title: "Fill Button",
    blurb: "The fill enters from the side your pointer came in on, and leaves the same way.",
    usage: `import { FillButton } from "@/components/depth";

<FillButton>Hover from any side</FillButton>`,
    files: [file("fill-button", fillSrc), utils],
    demo: <FillButton>Hover from any side</FillButton>,
  },
  {
    id: "loading-button",
    title: "Loading Button",
    blurb: "Idle, loading, success, error. Return a Promise from onClick and it handles the rest.",
    usage: `import { LoadingButton } from "@/components/depth";

<LoadingButton
  onClick={() => fetch("/api/save", { method: "POST" })}
  loadingLabel="Saving…"
  successLabel="Saved"
  errorLabel="Try again"
>
  Save
</LoadingButton>

// or control it yourself
<LoadingButton status={status}>Save</LoadingButton>`,
    files: [file("loading-button", loadingSrc), utils],
    demo: (
      <div className="flex flex-wrap justify-center gap-5">
        <LoadingButton onClick={() => wait(1400)} loadingLabel="Saving…" successLabel="Saved">
          Save
        </LoadingButton>
        <LoadingButton onClick={() => wait(1400, true)} loadingLabel="Sending…" errorLabel="Try again">
          Send (fails)
        </LoadingButton>
      </div>
    ),
  },
  {
    id: "gradient-button",
    title: "Gradient Button",
    blurb: "A colour flow runs through the whole button. Text contrast stays readable in both themes.",
    usage: `import { GradientButton } from "@/components/depth";

<GradientButton>Get started free</GradientButton>`,
    files: [file("gradient-button", gradientSrc), css, utils],
    demo: <GradientButton>Get started free</GradientButton>,
  },
  {
    id: "brutal-button",
    title: "Brutal Button",
    blurb: "Flat colour, hard edge, hard shadow. It slams into the shadow when pressed.",
    usage: `import { BrutalButton } from "@/components/depth";

<BrutalButton offset={5}>Download</BrutalButton>`,
    files: [file("brutal-button", brutalSrc), utils],
    demo: <BrutalButton>Download</BrutalButton>,
  },
  {
    id: "arrow-button",
    title: "Arrow Button",
    blurb: "The arrow chip grows until it fills the whole pill.",
    usage: `import { ArrowButton } from "@/components/depth";

<ArrowButton>See pricing</ArrowButton>`,
    files: [file("arrow-button", arrowSrc), utils],
    demo: <ArrowButton>See pricing</ArrowButton>,
  },
];

export const BUTTON_NAV = ENTRIES.map((e) => ({ id: e.id, label: e.title }));

export function ButtonsSection({ only }: { only?: string } = {}) {
  return pick(
    <>
      {ENTRIES.map((e) => (
        <Showcase
          key={e.id}
          id={e.id}
          title={e.title}
          blurb={e.blurb}
          usage={e.usage}
          files={e.files}
          previewClassName="min-h-[220px]"
        >
          {e.demo}
        </Showcase>
      ))}
    </>,
    only,
  );
}
