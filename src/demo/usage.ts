/** Usage snippets shown in each component's "Usage" tab. */

export const usage = {
  install: `# 1. dependencies
npm install framer-motion clsx tailwind-merge

# 2. copy these into your project
src/lib/utils.ts
src/hooks/use-tilt.ts            # only for tilt-based components
src/styles/depth-motion.css      # only for GridFloor / Marquee3D
src/components/depth/<component>.tsx

# 3. copy the theme tokens + utilities from index.css
# 4. add the no-flash theme script to index.html (see the Theme section)`,

  tiltCard: `import { TiltCard, TiltLayer } from "@/components/depth";

<TiltCard className="w-80" max={12} depthScale={1}>
  <TiltLayer z={20}>
    <span>New</span>
  </TiltLayer>
  <TiltLayer z={60}>
    <h3 className="text-2xl font-semibold">Spatial UI</h3>
  </TiltLayer>
  <TiltLayer z={80}>
    <button>Explore</button>
  </TiltLayer>
</TiltCard>`,

  spotlightCard: `import { SpotlightCard } from "@/components/depth";

<SpotlightCard className="w-80" radius={260}>
  <h3 className="text-xl font-semibold">Spotlight</h3>
  <p className="text-depth-muted">Light and border follow your pointer.</p>
</SpotlightCard>`,

  flipCard: `import { FlipCard } from "@/components/depth";

<FlipCard
  axis="y"            // "x" | "y"
  trigger="hover"     // "hover" | "click"
  front={<h3>Front</h3>}
  back={<p>Back</p>}
/>`,

  cardDeck: `import { CardDeck } from "@/components/depth";

<CardDeck
  width={300}
  height={190}
  visible={3}
  cards={[
    <div className="p-5">Card one</div>,
    <div className="p-5">Card two</div>,
    <div className="p-5">Card three</div>,
  ]}
/>`,

  depthStack: `import { DepthStack, DepthLayer } from "@/components/depth";

<DepthStack strength={40} tilt={8}>
  <DepthLayer depth={0.1}>{/* background */}</DepthLayer>
  <DepthLayer depth={0.4}>{/* middle */}</DepthLayer>
  <DepthLayer depth={0.8}>{/* foreground */}</DepthLayer>
</DepthStack>`,

  cube: `import { Cube3D } from "@/components/depth";

<Cube3D
  size={170}
  speed={18}   // deg/sec idle spin, 0 to disable
  faces={[
    <span>Front</span>, <span>Right</span>, <span>Back</span>,
    <span>Left</span>,  <span>Top</span>,   <span>Bottom</span>,
  ]}
/>`,

  carousel: `import { Carousel3D } from "@/components/depth";

<Carousel3D
  itemWidth={220}
  itemHeight={280}
  items={slides.map((s) => (
    <div className="p-5">{s.title}</div>
  ))}
/>`,

  button: `import { Button3D } from "@/components/depth";

<Button3D onClick={save}>Get started</Button3D>
<Button3D variant="neutral" depth={6}>Learn more</Button3D>`,

  text3d: `import { Text3D } from "@/components/depth";

<Text3D text="DEPTH" layers={14} spacing={1.6} className="text-8xl" />`,

  gridFloor: `// needs src/styles/depth-motion.css imported from your main CSS file
import { GridFloor } from "@/components/depth";

<GridFloor cell={48} tilt={68} className="h-80">
  <h2 className="text-3xl font-bold">Infinite floor</h2>
</GridFloor>`,

  marquee: `// needs src/styles/depth-motion.css imported from your main CSS file
import { Marquee3D } from "@/components/depth";

<Marquee3D
  columns={4}
  duration={32}
  copies={6}   // keep even; raise it if you have few items
  items={items.map((i) => <Card key={i.id} {...i} />)}
/>`,

  theme: `// main.tsx
import { ThemeProvider } from "@/components/depth";

createRoot(root).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);

// anywhere in your UI
import { ThemeToggle, useTheme } from "@/components/depth";

<ThemeToggle />

const { theme, setTheme, toggle } = useTheme(); // "light" | "dark"`,

  themeScript: `<!-- index.html, inside <head>: applies the saved/system theme before first paint -->
<script>
  (function () {
    try {
      var t = localStorage.getItem("depth-theme");
      var dark = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", dark);
    } catch (e) {}
  })();
</script>`,

  holoCard: `import { HoloCard } from "@/components/depth";

<HoloCard max={14}>
  <div className="flex h-full flex-col justify-between p-5">
    <span className="font-mono text-xs">No. 001</span>
    <h3 className="text-2xl font-semibold">Holo</h3>
  </div>
</HoloCard>`,

  bookCard: `import { BookCard } from "@/components/depth";

<BookCard
  width={170}
  height={230}
  cover={<div className="p-5 text-xl font-bold">Depth UI</div>}
  left={<p>Inside cover</p>}
  right={<p>First page</p>}
/>`,

  coverFlow: `import { CoverFlow } from "@/components/depth";

<CoverFlow
  itemWidth={180}
  itemHeight={240}
  spacing={54}
  items={albums.map((a) => (
    <div className="p-4">{a.title}</div>
  ))}
/>`,

  orbit: `// needs src/styles/depth-motion.css imported from your main CSS file
import { Orbit3D } from "@/components/depth";

<Orbit3D
  tilt={66}
  center={<div className="rounded-full p-4">Core</div>}
  rings={[
    { radius: 64, items: [<Chip>A</Chip>, <Chip>B</Chip>, <Chip>C</Chip>] },
    { radius: 108, duration: 32, reverse: true, items: chips },
  ]}
/>`,

  layerStack: `import { LayerStack } from "@/components/depth";

// layers are listed bottom to top
<LayerStack
  size={150}
  gap={6}
  spread={54}
  layers={[<Layer>Database</Layer>, <Layer>API</Layer>, <Layer>UI</Layer>]}
/>`,

  isometricGrid: `import { IsometricGrid } from "@/components/depth";

<IsometricGrid
  columns={3}
  size={60}
  lift={28}
  items={features.map((f) => <span>{f}</span>)}
/>`,

  scrollReveal: `import { ScrollReveal3D } from "@/components/depth";

<ScrollReveal3D from={24} fromScale={0.86}>
  <img src="/dashboard.png" alt="Product screenshot" />
</ScrollReveal3D>`,

  dock: `import { Dock3D } from "@/components/depth";

<Dock3D
  baseSize={44}
  magnification={1.7}
  items={[
    { label: "Home", icon: <HomeIcon />, onClick: goHome },
    { label: "Search", icon: <SearchIcon /> },
    { label: "Mail", icon: <MailIcon /> },
  ]}
/>`,

  navbar: `import { AnimatedNavbar } from "@/components/depth";

// Add "sticky top-4" to pin it. Items with \`links\` open the 3D dropdown.
<AnimatedNavbar
  className="sticky top-4"
  logo={<a href="/">Acme</a>}
  items={[
    {
      label: "Products",
      links: [
        { label: "Analytics", description: "Track everything", href: "/analytics", icon: <ChartIcon /> },
        { label: "Automation", description: "Save hours", href: "/automation", icon: <BoltIcon /> },
      ],
      featured: <p>New: AI reports</p>,   // optional promo panel
    },
    { label: "Pricing", href: "/pricing" },
  ]}
  actions={<><ThemeToggle /><a href="/signup">Sign up</a></>}
/>`,

  hero: `// needs src/styles/depth-motion.css (HeroFloat uses .depth-float)
import { HeroSection, HeroFloat, Button3D } from "@/components/depth";

<HeroSection
  badge={<span>v1.0 is out</span>}
  title={<>Ship interfaces with <em>depth</em></>}
  description="3D components that stay light."
  actions={<><Button3D>Get started</Button3D><a href="/docs">Docs</a></>}
  visual={
    <>
      <img src="/app.png" alt="App screenshot" className="rounded-xl" />
      <HeroFloat z={70} className="-right-6 top-10">
        <span className="chip">Deployed</span>
      </HeroFloat>
    </>
  }
/>`,

  featureGrid: `import { FeatureGrid } from "@/components/depth";

<FeatureGrid
  features={[
    { title: "Fast", description: "GPU only.", icon: <BoltIcon />, size: "wide" },
    { title: "Themed", description: "Light and dark.", icon: <MoonIcon />, size: "tall" },
    { title: "Accessible", description: "Keyboard ready.", icon: <A11yIcon /> },
  ]}
/>`,

  featureTabs: `import { FeatureTabs } from "@/components/depth";

<FeatureTabs
  tabs={[
    { id: "cards", label: "Cards", title: "Reactive cards", description: "Tilt and glare.", visual: <CardsDemo /> },
    { id: "blocks", label: "Blocks", title: "Page sections", description: "Ready to ship.", visual: <BlocksDemo /> },
  ]}
/>`,

  marqueeRow: `// needs src/styles/depth-motion.css
import { Marquee } from "@/components/depth";

<Marquee duration={30} items={logos.map((l) => <Logo key={l} name={l} />)} />
<Marquee reverse duration={40} items={moreLogos} />   // opposing row`,

  testimonials: `// needs src/styles/depth-motion.css
import { TestimonialWall } from "@/components/depth";

<TestimonialWall
  items={[
    { quote: "Feels expensive.", name: "Maya Chen", role: "Design Engineer" },
    { quote: "Dark mode just worked.", name: "Tom Becker", role: "Maker" },
  ]}
/>`,

  stats: `import { StatsSection, AnimatedCounter } from "@/components/depth";

<StatsSection
  stats={[
    { value: 19, label: "Components" },
    { value: 99.9, decimals: 1, suffix: "%", label: "Uptime" },
    { value: 12, prefix: "$", suffix: "k", label: "Saved" },
  ]}
/>

// or a single counter anywhere
<AnimatedCounter value={1200} suffix="+" />`,

  timeline: `import { TimelineSteps } from "@/components/depth";

<TimelineSteps
  steps={[
    { title: "Copy a block", description: "Plain React and Tailwind." },
    { title: "Set your tokens", description: "Edit the depth-* variables." },
    { title: "Ship it", description: "No runtime to configure." },
  ]}
/>`,

  pricing: `import { PricingTable } from "@/components/depth";

<PricingTable
  currency="$"
  savingsLabel="Save 20%"
  plans={[
    { name: "Starter", monthly: 0, yearly: 0, features: ["Cards"], cta: "Start free" },
    { name: "Pro", monthly: 19, yearly: 15, features: ["Everything"], highlighted: true, onSelect: buyPro },
  ]}
/>`,

  faq: `import { FAQAccordion } from "@/components/depth";

<FAQAccordion
  defaultOpen={0}
  multiple={false}
  items={[
    { question: "Does it use WebGL?", answer: "No, only CSS 3D transforms." },
    { question: "Can I re-theme it?", answer: <p>Yes, edit the tokens.</p> },
  ]}
/>`,

  cta: `import { CTASection, Button3D } from "@/components/depth";

<CTASection
  title="Ready to add some depth?"
  description="Copy a component and ship it today."
  actions={<Button3D>Get started</Button3D>}
/>`,

  footer: `import { Footer } from "@/components/depth";

<Footer
  brand="Acme"
  description="Interfaces with depth."
  wordmark="ACME"
  columns={[
    { title: "Product", links: [{ label: "Pricing", href: "/pricing" }] },
    { title: "Company", links: [{ label: "About", href: "/about" }] },
  ]}
  socials={[{ label: "Email", href: "mailto:hi@acme.dev", icon: <MailIcon /> }]}
  onSubscribe={(email) => api.subscribe(email)}
  bottom={<span>© 2026 Acme</span>}
/>`,
};
