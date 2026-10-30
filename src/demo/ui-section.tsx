import { useState } from "react";
import {
  AuroraBackground,
  AvatarStack,
  Checkbox3D,
  Pagination3D,
  ProgressBar3D,
  Skeleton3D,
  Stepper3D,
  OtpInput3D,
  Rating3D,
  SegmentedControl3D,
  Select3D,
  Slider3D,
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
import { Showcase, type CodeFile, pick } from "./showcase";

import checkboxSrc from "@/components/depth/ui/checkbox-3d.tsx?raw";
import segmentedSrc from "@/components/depth/ui/segmented-control-3d.tsx?raw";
import sliderSrc from "@/components/depth/ui/slider-3d.tsx?raw";
import selectSrc from "@/components/depth/ui/select-3d.tsx?raw";
import ratingSrc from "@/components/depth/ui/rating-3d.tsx?raw";
import otpSrc from "@/components/depth/ui/otp-input-3d.tsx?raw";
import progressBarSrc from "@/components/depth/ui/progress-bar-3d.tsx?raw";
import stepperSrc from "@/components/depth/ui/stepper-3d.tsx?raw";
import paginationSrc from "@/components/depth/ui/pagination-3d.tsx?raw";
import skeletonSrc from "@/components/depth/ui/skeleton-3d.tsx?raw";
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

function CheckboxDemo() {
  const [all, setAll] = useState(false);
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const mixed = a !== b;
  return (
    <div className="flex flex-col gap-4">
      <Checkbox3D
        label="Select all"
        indeterminate={mixed}
        checked={a && b}
        onCheckedChange={(v) => { setAll(v); setA(v); setB(v); }}
        aria-label="Select all"
      />
      <div className="flex flex-col gap-3 pl-8">
        <Checkbox3D label="Email me product news" description="One short email a month." checked={a} onCheckedChange={setA} />
        <Checkbox3D label="Send weekly digest" checked={b} onCheckedChange={setB} />
        <Checkbox3D label="Disabled option" disabled />
      </div>
      <span className="sr-only">{String(all)}</span>
    </div>
  );
}

function SegmentedDemo() {
  const [v, setV] = useState("month");
  return (
    <div className="flex flex-col items-center gap-5">
      <SegmentedControl3D
        aria-label="Billing period"
        value={v}
        onValueChange={setV}
        options={[{ value: "month", label: "Monthly" }, { value: "year", label: "Yearly" }, { value: "life", label: "Lifetime" }]}
      />
      <SegmentedControl3D
        aria-label="View"
        size="sm"
        defaultValue="grid"
        options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }, { value: "map", label: "Map", disabled: true }]}
      />
    </div>
  );
}

function SliderDemo() {
  const [v, setV] = useState(40);
  return (
    <div className="w-full max-w-sm">
      <Slider3D aria-label="Volume" value={v} onValueChange={setV} formatValue={(n) => `${n}%`} />
      <Slider3D aria-label="Price" defaultValue={250} min={0} max={1000} step={50} formatValue={(n) => `$${n}`} />
    </div>
  );
}

function SelectDemo() {
  const [v, setV] = useState<string | undefined>();
  return (
    <div className="flex w-full max-w-xs flex-col gap-3 pb-40">
      <Select3D
        aria-label="Framework"
        placeholder="Choose a framework"
        value={v}
        onValueChange={setV}
        options={[
          { value: "react", label: "React" },
          { value: "vue", label: "Vue" },
          { value: "svelte", label: "Svelte" },
          { value: "solid", label: "Solid", disabled: true },
          { value: "angular", label: "Angular" },
        ]}
      />
    </div>
  );
}

function RatingDemo() {
  const [v, setV] = useState(3);
  return (
    <div className="flex flex-col items-center gap-4">
      <Rating3D aria-label="Your rating" value={v} onValueChange={setV} />
      <Rating3D aria-label="Average rating" value={4} readOnly size={22} />
      <p className="text-xs text-depth-muted">{v ? `You rated it ${v} out of 5` : "Not rated yet"}</p>
    </div>
  );
}

function OtpDemo() {
  const [done, setDone] = useState("");
  return (
    <div className="flex flex-col items-center gap-4">
      <OtpInput3D onComplete={setDone} onValueChange={() => setDone("")} />
      <p className="text-xs text-depth-muted">{done ? `Entered ${done}` : "Type or paste a 6 digit code"}</p>
    </div>
  );
}

function ProgressBarDemo() {
  const [v, setV] = useState(64);
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <ProgressBar3D label="Uploading" value={v} />
      <ProgressBar3D label="Storage" value={82} size="sm" />
      <ProgressBar3D label="Working…" size="lg" />
      <div className="flex gap-2">
        <Button3D variant="neutral" onClick={() => setV((x) => Math.max(0, x - 15))}>-15</Button3D>
        <Button3D variant="neutral" onClick={() => setV((x) => Math.min(100, x + 15))}>+15</Button3D>
      </div>
    </div>
  );
}

function StepperDemo() {
  const [s, setS] = useState(1);
  const steps = [{ label: "Account", description: "Your details" }, { label: "Plan", description: "Pick a tier" }, { label: "Payment", description: "Card" }, { label: "Done" }];
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6">
      <Stepper3D steps={steps} current={s} onStepClick={setS} />
      <div className="flex gap-2">
        <Button3D variant="neutral" onClick={() => setS((x) => Math.max(0, x - 1))}>Back</Button3D>
        <Button3D onClick={() => setS((x) => Math.min(steps.length, x + 1))}>Next</Button3D>
      </div>
    </div>
  );
}

function PaginationDemo() {
  const [p, setP] = useState(6);
  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination3D total={20} page={p} onPageChange={setP} />
      <Pagination3D total={5} defaultPage={2} />
      <p className="text-xs text-depth-muted">Page {p} of 20</p>
    </div>
  );
}

function SkeletonDemo() {
  return (
    <div aria-busy="true" className="flex w-full max-w-sm items-start gap-4 rounded-2xl border border-depth-border bg-depth-surface p-4">
      <Skeleton3D circle className="w-14 shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton3D className="h-4 w-1/2" />
        <Skeleton3D lines={3} />
      </div>
    </div>
  );
}

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

export function UISection({ only }: { only?: string } = {}) {
  return pick(
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

      <Showcase
        id="checkbox-3d"
        title="Checkbox"
        blurb="A raised checkbox that sinks when pressed. The tick draws itself in. It supports the mixed state, a label and a description."
        usage={`import { Checkbox3D } from "@/components/depth";

<Checkbox3D label="Email me product news" description="One short email a month." />`}
        files={[f("checkbox-3d", checkboxSrc), utils]}
        previewClassName="min-h-[260px]"
      >
        <CheckboxDemo />
      </Showcase>

      <Showcase
        id="segmented-control-3d"
        title="Segmented control"
        blurb="A row of options with one raised thumb that slides to the choice. It is a real radio group: arrow keys move the choice."
        usage={`import { SegmentedControl3D } from "@/components/depth";

<SegmentedControl3D
  aria-label="Billing period"
  defaultValue="month"
  options={[{ value: "month", label: "Monthly" }, { value: "year", label: "Yearly" }]}
/>`}
        files={[f("segmented-control-3d", segmentedSrc), utils]}
        previewClassName="min-h-[220px]"
      >
        <SegmentedDemo />
      </Showcase>

      <Showcase
        id="slider-3d"
        title="Slider"
        blurb="A range slider with a glossy knob and a value bubble that lifts while you drag. Keyboard and touch work too."
        usage={`import { Slider3D } from "@/components/depth";

<Slider3D aria-label="Volume" defaultValue={40} formatValue={(n) => n + "%"} />`}
        files={[f("slider-3d", sliderSrc), utils]}
        previewClassName="min-h-[240px]"
      >
        <SliderDemo />
      </Showcase>

      <Showcase
        id="select-3d"
        title="Select"
        blurb="A custom dropdown whose menu tips open like a lid. Arrow keys, type-ahead and Escape work, and it opens upward when there is no room below."
        usage={`import { Select3D } from "@/components/depth";

<Select3D
  aria-label="Framework"
  placeholder="Choose a framework"
  options={[{ value: "react", label: "React" }, { value: "vue", label: "Vue" }]}
/>`}
        files={[f("select-3d", selectSrc), utils]}
        previewClassName="min-h-[340px]"
      >
        <SelectDemo />
      </Showcase>

      <Showcase
        id="rating-3d"
        title="Rating"
        blurb="Glossy stars that preview on hover and pop in order when chosen. Use it to collect a rating, or read-only to show one."
        usage={`import { Rating3D } from "@/components/depth";

<Rating3D aria-label="Your rating" defaultValue={3} />`}
        files={[f("rating-3d", ratingSrc), utils]}
        previewClassName="min-h-[260px]"
      >
        <RatingDemo />
      </Showcase>

      <Showcase
        id="otp-input-3d"
        title="OTP input"
        blurb="A one-time code field. The focused box lifts and glows. Typing moves on, Backspace goes back, and pasting a code fills every box."
        usage={`import { OtpInput3D } from "@/components/depth";

<OtpInput3D length={6} onComplete={(code) => verify(code)} />`}
        files={[f("otp-input-3d", otpSrc), utils]}
        previewClassName="min-h-[220px]"
      >
        <OtpDemo />
      </Showcase>

      <Showcase
        id="progress-bar-3d"
        title="Progress bar"
        blurb="A raised, glossy bar. The fill is scaled with a transform and has a moving sheen. Leave the value out for an indeterminate bar."
        usage={`import { ProgressBar3D } from "@/components/depth";

<ProgressBar3D label="Uploading" value={64} />`}
        files={[f("progress-bar-3d", progressBarSrc), css, utils]}
        previewClassName="min-h-[340px]"
      >
        <ProgressBarDemo />
      </Showcase>

      <Showcase
        id="stepper-3d"
        title="Stepper"
        blurb="Numbered steps joined by a bar that fills as you move on. Finished steps show a tick, and can be clicked to go back."
        usage={`import { Stepper3D } from "@/components/depth";

<Stepper3D current={1} steps={[{ label: "Account" }, { label: "Plan" }, { label: "Done" }]} />`}
        files={[f("stepper-3d", stepperSrc), utils]}
        previewClassName="min-h-[240px]"
      >
        <StepperDemo />
      </Showcase>

      <Showcase
        id="pagination-3d"
        title="Pagination"
        blurb="Page buttons with a raised thumb that slides to the current page. Long ranges collapse with ellipses."
        usage={`import { Pagination3D } from "@/components/depth";

<Pagination3D total={20} onPageChange={(p) => load(p)} />`}
        files={[f("pagination-3d", paginationSrc), utils]}
        previewClassName="min-h-[240px]"
      >
        <PaginationDemo />
      </Showcase>

      <Showcase
        id="skeleton-3d"
        title="Skeleton"
        blurb="A loading placeholder with a soft sheen sweeping across. Use lines for text, or circle for an avatar. Stops for reduced motion."
        usage={`import { Skeleton3D } from "@/components/depth";

<Skeleton3D lines={3} />
<Skeleton3D circle className="w-12" />`}
        files={[f("skeleton-3d", skeletonSrc), css, utils]}
        previewClassName="min-h-[200px]"
      >
        <SkeletonDemo />
      </Showcase>
    </>,
    only,
  );
}
