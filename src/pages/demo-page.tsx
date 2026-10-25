import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AnimatedNavbar,
  ArrowButton,
  AuroraBackground,
  AvatarStack,
  BeamButton,
  BeamCard,
  BrutalButton,
  Button3D,
  CardsSection,
  CreditCard3D,
  CTASection,
  DotGlow,
  FAQAccordion,
  FeatureGrid,
  FeatureTabs,
  FillButton,
  FlipWords,
  Footer,
  GitHubStarButton,
  GlassButton,
  GlowInput,
  GradientButton,
  HeroSection,
  LoadingButton,
  MagneticButton,
  Marquee,
  MetricCard,
  NeonButton,
  PricingTable,
  ProductCard,
  ProfileCard,
  ProgressRing,
  RevealCard,
  RippleButton,
  RollButton,
  ScrollReveal3D,
  ShimmerButton,
  StatsSection,
  Switch3D,
  TestimonialWall,
  TextReveal,
  ThemeToggle,
  TimelineSteps,
  type NavbarItem,
} from "@/components/depth";
import { REPO } from "@/lib/site";
import {
  HeroMock,
  LogoItem,
  SectionHeading,
  faqs,
  featureTabs,
  features,
  footerColumns,
  footerSocials,
  logos,
  plans,
  stats,
  steps,
  testimonials,
} from "@/demo/block-data";
import {
  DemoBook,
  DemoCarousel,
  DemoCube,
  DemoDeck,
  DemoDock,
  DemoFlip,
  DemoFloor,
  DemoHolo,
  DemoIso,
  DemoLayers,
  DemoMarquee3D,
  DemoOrbit,
  DemoSpotlight,
  DemoStack,
  DemoText3D,
  DemoTilt,
  DemoCoverFlow,
  Playground,
  Tile,
  articles,
} from "@/demo/demo-parts";
import {
  DemoBars,
  DemoBookTurn,
  DemoClock,
  DemoCoin,
  DemoCounter,
  DemoCylinder,
  DemoEnvelope,
  DemoExtrude,
  DemoFolder,
  DemoGlobe,
  DemoKnobs,
  DemoLaptop,
  DemoPhone,
  DemoIsland,
  DemoReorder,
  DemoExpand,
  DemoTabs,
  DemoAccordion,
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
  DemoRadial,
  DemoWheel,
  DemoTagCloud,
  DemoNotifs,
  DemoPanels,
  DemoWall,
} from "@/demo/showpiece-demos";

const nav: NavbarItem[] = [
  {
    label: "Library",
    links: [
      { label: "Buttons", description: "12 styles, one family", href: "#buttons" },
      { label: "Cards", description: "Profile, product, metric…", href: "#cards" },
      { label: "3D scenes", description: "Cubes, orbits, carousels", href: "#scenes" },
      { label: "Showpieces", description: "Globe, flip clock, page turn", href: "#showpieces" },
      { label: "UI elements", description: "Modal, toast, inputs", href: "#ui" },
    ],
  },
  { label: "How it works", href: "#how" },
  { label: "Customers", href: "#customers" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const sec = "mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function BtnTile({ name, children, className }: { name: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={"flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-2xl border border-depth-border bg-depth-surface/60 p-5 " + (className ?? "")}>
      {children}
      <span className="font-mono text-[11px] uppercase tracking-widest text-depth-muted">{name}</span>
    </div>
  );
}

/**
 * A complete landing page built from the library. Every component the
 * library ships appears somewhere on this page. Copy it as a starting point.
 */
export default function DemoPage() {
  const navigate = useNavigate();
  const [notify, setNotify] = useState(true);

  return (
    <div id="top" className="min-h-screen bg-depth-bg">
      <div className="pointer-events-none sticky top-0 z-50 px-4 pt-4">
        <AnimatedNavbar
          className="pointer-events-auto"
          logo={
            <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span
                aria-hidden
                className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-depth-accent to-depth-accent-2"
                style={{ transform: "perspective(40px) rotateY(-24deg) rotateX(12deg)" }}
              />
              Depth UI
            </Link>
          }
          items={nav}
          actions={
            <>
              <GitHubStarButton repo={REPO} className="hidden sm:inline-flex" />
              <ThemeToggle className="h-9 w-9" />
              <Link
                to="/components"
                className="rounded-full bg-depth-accent px-4 py-2 text-sm font-medium text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-surface"
              >
                Docs
              </Link>
            </>
          }
        />
      </div>

      <main>
        <AuroraBackground className="-mt-16 pt-16">
          <HeroSection
            badge={
              <span className="rounded-full border border-depth-border bg-depth-surface px-3 py-1 font-mono text-xs text-depth-muted">
                <span className="text-depth-accent">v0.5</span> · open source
              </span>
            }
            title={
              <>
                Build <FlipWords words={["deeper", "faster", "calmer", "bolder"]} className="text-depth-accent" />
                <br />
                interfaces with{" "}
                <span className="bg-gradient-to-r from-depth-accent via-depth-accent-3 to-depth-accent-2 bg-clip-text text-transparent">
                  real depth
                </span>
              </>
            }
            description="Copy-paste React components in CSS 3D. No WebGL, no heavy runtime, light and dark themes built in."
            actions={
              <>
                <ShimmerButton onClick={() => navigate("/components")}>Browse components</ShimmerButton>
                <GitHubStarButton repo={REPO} className="h-11" />
              </>
            }
            visual={<HeroMock />}
          />
        </AuroraBackground>

        <section aria-label="Trusted by" className="py-10">
          <p className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-depth-muted">
            Loved by teams building fast sites
          </p>
          <Marquee items={logos.map((l) => <LogoItem key={l} name={l} />)} duration={34} />
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <TextReveal
            className="text-2xl font-semibold leading-snug tracking-tight sm:text-4xl"
            text="Most 3D on the web means a heavy engine and a slow page. Depth UI uses plain CSS transforms the GPU already loves, so every card tilts, every scene spins, and your page still feels instant."
          />
        </section>

        <section id="features" className={sec}>
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to look expensive"
            description="Depth, motion and theming, without the weight of a 3D engine."
          />
          <FeatureGrid features={features} />
        </section>

        {/* ---------------- Buttons ---------------- */}
        <section id="buttons" className={sec}>
          <SectionHeading eyebrow="Buttons" title="A button for every mood" description="Twelve styles, all keyboard friendly and reduced-motion aware." />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <BtnTile name="3D">
              <Button3D>Get started</Button3D>
            </BtnTile>
            <BtnTile name="Magnetic"><MagneticButton>Hover near</MagneticButton></BtnTile>
            <BtnTile name="Shimmer"><ShimmerButton>Upgrade</ShimmerButton></BtnTile>
            <BtnTile name="Beam"><BeamButton>Build</BeamButton></BtnTile>
            <BtnTile name="Ripple"><RippleButton>Click me</RippleButton></BtnTile>
            <BtnTile name="Glass" className="!border-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400">
              <GlassButton>Continue</GlassButton>
            </BtnTile>
            <BtnTile name="Neon"><NeonButton tone="cyan">Neon</NeonButton></BtnTile>
            <BtnTile name="Roll"><RollButton>Read docs</RollButton></BtnTile>
            <BtnTile name="Fill"><FillButton>From any side</FillButton></BtnTile>
            <BtnTile name="Loading">
              <LoadingButton onClick={() => wait(1400)} loadingLabel="Saving…" successLabel="Saved">Save</LoadingButton>
            </BtnTile>
            <BtnTile name="Gradient"><GradientButton>Start free</GradientButton></BtnTile>
            <BtnTile name="Brutal"><BrutalButton>Download</BrutalButton></BtnTile>
            <BtnTile name="Arrow" className="col-span-2 lg:col-span-4"><ArrowButton>Explore all components</ArrowButton></BtnTile>
          </div>
        </section>

        {/* ---------------- Cards ---------------- */}
        <section id="cards" className={sec}>
          <SectionHeading eyebrow="Cards" title="Cards with real presence" description="Hover, tilt, flip and reveal. All of them below are live." />
          <div className="grid justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProfileCard
              className="w-full max-w-[18rem]"
              name="Aria Chen"
              role="Product Designer"
              handle="ariachen"
              bio="Building calm interfaces with a bit of depth."
              stats={[{ label: "Followers", value: "12.4k" }, { label: "Posts", value: "342" }, { label: "Likes", value: "98k" }]}
            />
            <ProductCard
              className="w-full max-w-[18rem]"
              name="Aero Headphones"
              price={189}
              rating={4.5}
              badge="New"
              description="Wireless, 40-hour battery."
              colors={[{ name: "Violet", value: "#8b5cf6" }, { name: "Cyan", value: "#22d3ee" }, { name: "Rose", value: "#fb7185" }]}
            />
            <div className="flex items-center md:col-span-2 lg:col-span-1">
              <CreditCard3D number="•••• •••• •••• 4821" name="AKRAM KHAN" expires="08/29" cvv="123" width={300} />
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Monthly revenue" value={48200} prefix="$" delta={12.4} data={[12, 18, 15, 24, 22, 31, 38]} />
            <MetricCard label="Churn" value={2.1} suffix="%" decimals={1} delta={-0.6} data={[30, 28, 29, 24, 22, 20, 18]} />
            <BeamCard className="md:col-span-1" contentClassName="p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-depth-accent">Pro</p>
              <h3 className="mt-2 text-xl font-semibold">Everything unlocked</h3>
              <p className="mt-2 text-sm text-depth-muted">Unlimited projects and early access.</p>
            </BeamCard>
            <RevealCard title="Northern Lights" eyebrow="Travel" className="h-full min-h-[220px]">
              Seven nights in Tromsø with guided aurora hunts.
            </RevealCard>
          </div>

          <div className="mt-16">
            <SectionHeading title="Fresh from the blog" description="A filterable cards section, ready to drop in." />
            <CardsSection items={articles} />
          </div>
        </section>

        {/* ---------------- Scenes ---------------- */}
        <section id="scenes" className={sec}>
          <SectionHeading eyebrow="3D scenes" title="Move things in space" description="Interactive scenes built with transforms only. Drag, hover, tilt." />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Tile label="Tilt card"><DemoTilt /></Tile>
            <Tile label="Spotlight card"><DemoSpotlight /></Tile>
            <Tile label="Holo card"><DemoHolo /></Tile>
            <Tile label="Flip card"><DemoFlip /></Tile>
            <Tile label="Card deck"><DemoDeck /></Tile>
            <Tile label="Book"><DemoBook /></Tile>
            <Tile label="Depth stack"><DemoStack /></Tile>
            <Tile label="Cube (drag it)"><DemoCube /></Tile>
            <Tile label="Layer stack"><DemoLayers /></Tile>
            <Tile label="Orbit" className="md:col-span-2 lg:col-span-1"><DemoOrbit /></Tile>
            <Tile label="Isometric grid" className="md:col-span-2 lg:col-span-1"><DemoIso /></Tile>
            <Tile label="Dock" className="md:col-span-2 lg:col-span-1"><DemoDock /></Tile>
            <Tile label="Ring carousel" className="md:col-span-2 lg:col-span-3"><DemoCarousel /></Tile>
            <Tile label="Cover flow" className="md:col-span-2 lg:col-span-3"><DemoCoverFlow /></Tile>
            <Tile label="3D marquee" className="md:col-span-2 lg:col-span-3 min-h-[420px]"><DemoMarquee3D /></Tile>
            <Tile label="Grid floor" className="md:col-span-2 lg:col-span-2"><DemoFloor /></Tile>
            <Tile label="3D text" className="md:col-span-2 lg:col-span-1"><DemoText3D /></Tile>
          </div>
        </section>

        {/* ---------------- Showpieces ---------------- */}
        <section id="showpieces" className={sec}>
          <SectionHeading eyebrow="Showpieces" title="The ones people screenshot" description="Fifty-three signature pieces: a wireframe globe, split-flap clock, page-turning book, 3D charts and more." />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Tile label="Globe (drag it)"><DemoGlobe /></Tile>
            <Tile label="Coin (click it)"><DemoCoin /></Tile>
            <Tile label="Text cylinder"><DemoCylinder /></Tile>
            <Tile label="Flip clock" className="md:col-span-2"><div className="flex flex-col items-center gap-8"><DemoClock /><DemoCounter /></div></Tile>
            <Tile label="Notification stack" className="items-stretch"><DemoNotifs /></Tile>
            <Tile label="Page turn" className="md:col-span-2 min-h-[440px]"><DemoBookTurn /></Tile>
            <Tile label="Expanding panels" className="md:col-span-2 lg:col-span-1 min-h-[400px]"><DemoPanels /></Tile>
            <Tile label="3D bar chart" className="md:col-span-2"><DemoBars /></Tile>
            <Tile label="Wheel picker"><DemoWheel /></Tile>
            <Tile label="Radial menu (click +)"><DemoRadial /></Tile>
            <Tile label="Extrude (drag it)" className="md:col-span-2"><DemoExtrude /></Tile>
            <Tile label="Knobs (drag up or down)"><DemoKnobs /></Tile>
            <Tile label="Laptop (opens as you scroll)" className="md:col-span-2 lg:col-span-3 min-h-[460px]"><DemoLaptop /></Tile>
            <Tile label="Tag cloud (drag it)" className="md:col-span-2 lg:col-span-1 min-h-[420px]"><DemoTagCloud /></Tile>
            <Tile label="Phone"><DemoPhone /></Tile>
            <Tile label="Folder"><DemoFolder /></Tile>
            <Tile label="Envelope (click it)" className="md:col-span-2 lg:col-span-3"><DemoEnvelope /></Tile>
            <Tile label="Dice (click to roll)"><DemoDice /></Tile>
            <Tile label="Ticket (click to tear)" className="md:col-span-2"><DemoTicket /></Tile>
            <Tile label="Card fan" className="md:col-span-2 lg:col-span-2 min-h-[420px]"><DemoFan /></Tile>
            <Tile label="Peel card"><DemoPeel /></Tile>
            <Tile label="Turntable" className="md:col-span-2 lg:col-span-3"><DemoTurntable /></Tile>
            <Tile label="Slot machine"><DemoSlots /></Tile>
            <Tile label="Newton's cradle (click)" className="md:col-span-2"><DemoCradle /></Tile>
            <Tile label="Bookshelf (point at a book)" className="md:col-span-2 lg:col-span-2"><DemoShelf /></Tile>
            <Tile label="Prism"><DemoPrism /></Tile>
            <Tile label="Doors" className="md:col-span-2 lg:col-span-3"><DemoDoors /></Tile>
            <Tile label="Puzzle cube (drag, scramble)" className="md:col-span-2"><DemoRubik /></Tile>
            <Tile label="Hourglass (click to flip)"><DemoHourglass /></Tile>
            <Tile label="Gyroscope"><DemoGyro /></Tile>
            <Tile label="Badge (drag to swing)" className="md:col-span-2 lg:col-span-1 min-h-[480px]"><DemoBadge /></Tile>
            <Tile label="Pyramid (drag it)"><DemoPyramid /></Tile>
            <Tile label="Helix"><DemoHelix /></Tile>
            <Tile label="Vault (crack the code)" className="md:col-span-2 min-h-[460px]"><DemoVault /></Tile>
            <Tile label="Folding screen" className="md:col-span-2 lg:col-span-2"><DemoFold /></Tile>
            <Tile label="Magic 8 Ball (click)"><DemoEightBall /></Tile>
            <Tile label="Compass (move your mouse)" className="md:col-span-2 lg:col-span-3"><DemoCompass /></Tile>
            <Tile label="Tunnel (hover to speed up)" className="md:col-span-2 lg:col-span-3 !p-0"><DemoTunnel /></Tile>
            <Tile label="Pin art (move over it)" className="md:col-span-2"><DemoPinArt /></Tile>
            <Tile label="Tile flip (click a tile)"><DemoTileFlip /></Tile>
            <Tile label="Image trail (move your pointer)" className="md:col-span-2 lg:col-span-2"><DemoTrail /></Tile>
            <Tile label="Stack scroll (scroll inside)"><DemoScrollStack /></Tile>
            <Tile label="Dynamic island (switch states)" className="md:col-span-2"><DemoIsland /></Tile>
            <Tile label="Reorder list (drag a row)"><DemoReorder /></Tile>
            <Tile label="Expanding cards (click one)" className="md:col-span-2 lg:col-span-2"><DemoExpand /></Tile>
            <Tile label="3D tabs"><DemoTabs /></Tile>
            <Tile label="3D accordion" className="md:col-span-2 lg:col-span-3"><DemoAccordion /></Tile>
            <Tile label="Gallery wall" className="md:col-span-2 lg:col-span-3 !p-0"><DemoWall /></Tile>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
          <SectionHeading eyebrow="How it works" title="From copy to shipped in four steps" />
          <TimelineSteps steps={steps} />
        </section>

        {/* ---------------- UI elements ---------------- */}
        <section id="ui" className={sec}>
          <SectionHeading eyebrow="UI elements" title="The small parts, done properly" description="Focus trapping, live regions and keyboard support included." />
          <div className="grid gap-5 md:grid-cols-2">
            <Tile label="Modal · toast · tooltip · loader"><Playground /></Tile>
            <Tile label="Inputs & switches">
              <div className="flex w-full max-w-sm flex-col gap-6">
                <GlowInput label="Email" type="email" hint="We never share it." />
                <Switch3D checked={notify} onCheckedChange={setNotify} label={`Notifications ${notify ? "on" : "off"}`} />
              </div>
            </Tile>
            <Tile label="Avatar stack · progress ring">
              <div className="flex flex-wrap items-center justify-center gap-10">
                <AvatarStack
                  max={5}
                  people={["Aria Chen", "Dev Rao", "Mira Sol", "Leo Park", "Ana Costa", "Sam Ito", "Zoe Lin"].map((name) => ({ name }))}
                />
                <ProgressRing value={72} label="Complete" />
              </div>
            </Tile>
            <DotGlow className="flex min-h-[340px] items-center justify-center rounded-2xl border border-depth-border bg-depth-surface/60 p-5">
              <div className="text-center">
                <p className="font-mono text-[11px] uppercase tracking-widest text-depth-muted">Dot glow</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">Move your pointer</h3>
              </div>
            </DotGlow>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          <SectionHeading eyebrow="Explore" title="One system, many surfaces" />
          <FeatureTabs tabs={featureTabs} />
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          <StatsSection stats={stats} />
        </section>

        <section id="customers" className="scroll-mt-24 py-16 sm:py-24">
          <SectionHeading eyebrow="Customers" title="Teams ship faster with Depth UI" description="Sample quotes from fictional teams, shown for layout." />
          <TestimonialWall items={testimonials} />
        </section>

        <section id="pricing" className={sec}>
          <SectionHeading eyebrow="Pricing" title="Simple, honest plans" description="Sample pricing, shown for layout." />
          <PricingTable plans={plans} />
        </section>

        <section id="faq" className="mx-auto max-w-2xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          <FAQAccordion items={faqs} defaultOpen={0} />
        </section>

        {/* Scroll reveal: sits near the page bottom to prove it works anywhere. */}
        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-24">
          <SectionHeading eyebrow="Scroll reveal" title="Panels that settle into place" />
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
              <div className="h-28 rounded-lg bg-gradient-to-r from-depth-accent/30 via-depth-accent-3/20 to-depth-accent-2/30 sm:col-span-3" />
            </div>
          </ScrollReveal3D>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 sm:pb-28">
          <CTASection
            title="Ready to add some depth?"
            description="Copy a component, set your tokens and ship it today. It is open source."
            actions={
              <>
                <Button3D onClick={() => navigate("/components")}>Browse the docs</Button3D>
                <GitHubStarButton repo={REPO} className="h-11" />
              </>
            }
          />
        </section>
      </main>

      <Footer
        brand="Depth UI"
        description="3D components and page blocks for React, Tailwind and Framer Motion."
        columns={footerColumns}
        socials={footerSocials}
        wordmark="DEPTH"
        bottom={<span>© 2026 Depth UI. Sample footer.</span>}
      />
    </div>
  );
}
