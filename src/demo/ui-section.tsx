import { useState } from "react";
import {
  AuroraBackground,
  AvatarStack,
  Button3D,
  DotGlow,
  FlipWords,
  GlowInput,
  Loader3D,
  Modal3D,
  ProgressRing,
  Switch3D,
  TextReveal,
  Tooltip3D,
  useToast,
} from "@/components/depth";
import { Showcase, type CodeFile } from "./showcase";

import modalSrc from "@/components/depth/ui/modal-3d.tsx?raw";
import toastSrc from "@/components/depth/ui/toast.tsx?raw";
import switchSrc from "@/components/depth/ui/switch-3d.tsx?raw";
import inputSrc from "@/components/depth/ui/glow-input.tsx?raw";
import tooltipSrc from "@/components/depth/ui/tooltip-3d.tsx?raw";
import loaderSrc from "@/components/depth/ui/loader-3d.tsx?raw";
import avatarSrc from "@/components/depth/ui/avatar-stack.tsx?raw";
import ringSrc from "@/components/depth/ui/progress-ring.tsx?raw";
import flipSrc from "@/components/depth/ui/flip-words.tsx?raw";
import revealSrc from "@/components/depth/ui/text-reveal.tsx?raw";
import auroraSrc from "@/components/depth/ui/aurora-background.tsx?raw";
import dotSrc from "@/components/depth/ui/dot-glow.tsx?raw";
import statsSrc from "@/components/depth/blocks/stats-section.tsx?raw";
import progressHookSrc from "@/hooks/use-scroll-progress.ts?raw";
import utilsSrc from "@/lib/utils.ts?raw";
import motionCss from "@/styles/depth-motion.css?raw";

const utils: CodeFile = { name: "lib/utils.ts", code: utilsSrc };
const css: CodeFile = { name: "styles/depth-motion.css", code: motionCss };
const f = (n: string, code: string): CodeFile => ({ name: `components/depth/ui/${n}.tsx`, code });

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button3D onClick={() => toast({ title: "Saved", description: "Your changes are live.", tone: "success" })}>
        Success
      </Button3D>
      <Button3D variant="neutral" onClick={() => toast({ title: "Heads up", description: "A new version is available.", tone: "info" })}>
        Info
      </Button3D>
      <Button3D variant="neutral" onClick={() => toast({ title: "Upload failed", description: "Check your connection.", tone: "error" })}>
        Error
      </Button3D>
    </div>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button3D onClick={() => setOpen(true)}>Open modal</Button3D>
      <Modal3D
        open={open}
        onClose={() => setOpen(false)}
        title="Delete project?"
        description="This cannot be undone. All files and history will be removed."
        footer={
          <>
            <Button3D variant="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button3D>
            <Button3D onClick={() => setOpen(false)}>Delete</Button3D>
          </>
        }
      >
        <GlowInput label="Type the project name to confirm" />
      </Modal3D>
    </>
  );
}

function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <Switch3D checked={on} onCheckedChange={setOn} label={`Notifications ${on ? "on" : "off"}`} />
      <Switch3D defaultChecked={false} label="Weekly digest" />
      <Switch3D disabled label="Disabled" />
    </div>
  );
}

const people = ["Aria Chen", "Dev Rao", "Mira Sol", "Leo Park", "Ana Costa", "Sam Ito", "Zoe Lin"].map((name) => ({ name }));

export function UISection() {
  return (
    <>
      <Showcase
        id="modal-3d"
        title="Modal"
        blurb="Opens with a 3D tilt. Focus is trapped, Esc closes it, and focus returns to the button."
        usage={`import { Modal3D } from "@/components/depth";

const [open, setOpen] = useState(false);

<Modal3D open={open} onClose={() => setOpen(false)} title="Delete project?"
  description="This cannot be undone." footer={<button>Cancel</button>}>
  …content
</Modal3D>`}
        files={[f("modal-3d", modalSrc), utils]}
        previewClassName="min-h-[220px]"
      >
        <ModalDemo />
      </Showcase>

      <Showcase
        id="toast"
        title="Toast"
        blurb="Stacked notifications that tuck behind each other. Hover or focus to pause the countdown."
        usage={`// 1. wrap your app once
import { ToastProvider } from "@/components/depth";
<ToastProvider max={4}><App /></ToastProvider>

// 2. anywhere inside
import { useToast } from "@/components/depth";
const { toast } = useToast();
toast({ title: "Saved", description: "Changes are live.", tone: "success" });`}
        files={[f("toast", toastSrc), css, utils]}
        previewClassName="min-h-[220px]"
      >
        <ToastDemo />
      </Showcase>

      <Showcase
        id="switch-3d"
        title="Switch"
        blurb="A toggle with a raised thumb. Works with a keyboard and screen readers."
        usage={`import { Switch3D } from "@/components/depth";

<Switch3D checked={on} onCheckedChange={setOn} label="Notifications" />
<Switch3D defaultChecked aria-label="Dark mode" />`}
        files={[f("switch-3d", switchSrc), utils]}
        previewClassName="min-h-[220px]"
      >
        <SwitchDemo />
      </Showcase>

      <Showcase
        id="glow-input"
        title="Glow Input"
        blurb="A floating label and a flowing gradient border while focused."
        usage={`import { GlowInput } from "@/components/depth";

<GlowInput label="Email" type="email" hint="We never share it." />
<GlowInput label="Password" type="password" error="Too short." />`}
        files={[f("glow-input", inputSrc), css, utils]}
        previewClassName="min-h-[260px]"
      >
        <div className="flex w-full max-w-sm flex-col gap-6">
          <GlowInput label="Email" type="email" hint="We never share it." />
          <GlowInput label="Password" type="password" error="Use at least 8 characters." />
        </div>
      </Showcase>

      <Showcase
        id="tooltip-3d"
        title="Tooltip"
        blurb="Pops forward on hover or keyboard focus. Esc dismisses it."
        usage={`import { Tooltip3D } from "@/components/depth";

<Tooltip3D content="Copy link" side="top">
  <button>Share</button>
</Tooltip3D>`}
        files={[f("tooltip-3d", tooltipSrc), utils]}
        previewClassName="min-h-[260px]"
      >
        <div className="flex flex-wrap justify-center gap-6">
          {(["top", "bottom", "left", "right"] as const).map((s) => (
            <Tooltip3D key={s} content={`Shown on the ${s}`} side={s}>
              <Button3D variant="neutral">{s}</Button3D>
            </Tooltip3D>
          ))}
        </div>
      </Showcase>

      <Showcase
        id="loader-3d"
        title="Loader"
        blurb="Three spinners built from CSS 3D transforms."
        usage={`import { Loader3D } from "@/components/depth";

<Loader3D variant="cube" size={56} />
<Loader3D variant="rings" />
<Loader3D variant="dots" />`}
        files={[f("loader-3d", loaderSrc), css, utils]}
        previewClassName="min-h-[220px]"
      >
        <div className="flex flex-wrap items-center justify-center gap-14">
          <Loader3D variant="cube" />
          <Loader3D variant="rings" />
          <Loader3D variant="dots" />
        </div>
      </Showcase>

      <Showcase
        id="avatar-stack"
        title="Avatar Stack"
        blurb="Overlapping avatars that lift on hover, with a +N counter."
        usage={`import { AvatarStack } from "@/components/depth";

<AvatarStack people={[{ name: "Aria Chen" }, { name: "Dev Rao" }]} max={5} />`}
        files={[f("avatar-stack", avatarSrc), utils]}
        previewClassName="min-h-[180px]"
      >
        <AvatarStack people={people} max={5} />
      </Showcase>

      <Showcase
        id="progress-ring"
        title="Progress Ring"
        blurb="The ring draws itself while the number counts up when it scrolls into view."
        usage={`import { ProgressRing } from "@/components/depth";

<ProgressRing value={72} size={140} thickness={10} label="Complete" />`}
        files={[f("progress-ring", ringSrc), f("../blocks/stats-section", statsSrc), utils]}
        previewClassName="min-h-[240px]"
      >
        <div className="flex flex-wrap justify-center gap-10">
          <ProgressRing value={72} label="Complete" />
          <ProgressRing value={38} size={110} thickness={8} />
        </div>
      </Showcase>

      <Showcase
        id="flip-words"
        title="Flip Words"
        blurb="One word in a headline keeps changing, with a 3D flip."
        usage={`import { FlipWords } from "@/components/depth";

<h2>Build <FlipWords words={["faster", "deeper", "calmer"]} /> interfaces</h2>`}
        files={[f("flip-words", flipSrc), utils]}
        previewClassName="min-h-[200px]"
      >
        <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Build{" "}
          <FlipWords words={["faster", "deeper", "calmer", "bolder"]} className="text-depth-accent" />{" "}
          interfaces
        </h3>
      </Showcase>

      <Showcase
        id="text-reveal"
        title="Text Reveal"
        blurb="Scroll and the paragraph lights up word by word."
        usage={`import { TextReveal } from "@/components/depth";

<TextReveal text="Depth turns flat pages into places you can move through." />`}
        files={[f("text-reveal", revealSrc), { name: "hooks/use-scroll-progress.ts", code: progressHookSrc }, utils]}
        previewClassName="min-h-[320px]"
      >
        <TextReveal
          className="max-w-xl text-2xl font-semibold leading-snug sm:text-3xl"
          text="Depth turns flat pages into places you can move through. Every layer earns its place, and every motion has a reason."
        />
      </Showcase>

      <Showcase
        id="aurora-background"
        title="Aurora Background"
        blurb="Slow drifting colour clouds behind your content."
        usage={`import { AuroraBackground } from "@/components/depth";

<AuroraBackground className="py-24 text-center">
  <h1>Hello</h1>
</AuroraBackground>`}
        files={[f("aurora-background", auroraSrc), css, utils]}
        previewClassName="overflow-hidden p-0 sm:p-0"
      >
        <AuroraBackground className="flex h-[340px] w-full items-center justify-center">
          <h3 className="text-3xl font-bold tracking-tight">Northern light</h3>
        </AuroraBackground>
      </Showcase>

      <Showcase
        id="dot-glow"
        title="Dot Glow"
        blurb="A dot grid that lights up around your pointer."
        usage={`import { DotGlow } from "@/components/depth";

<DotGlow spacing={24} radius={170} className="h-80">
  <h2>Move your pointer</h2>
</DotGlow>`}
        files={[f("dot-glow", dotSrc), utils]}
        previewClassName="overflow-hidden p-0 sm:p-0"
      >
        <DotGlow className="flex h-[340px] w-full items-center justify-center">
          <h3 className="text-2xl font-semibold tracking-tight">Move your pointer</h3>
        </DotGlow>
      </Showcase>
    </>
  );
}
