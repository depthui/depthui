import type { ReactNode } from "react";
import {
  HeroFloat,
  type FAQItem,
  type Feature,
  type FeatureTab,
  type FooterColumn,
  type FooterSocial,
  type NavbarItem,
  type PricingPlan,
  type Stat,
  type Testimonial,
  type TimelineStep,
} from "@/components/depth";

/** Placeholder content (names, quotes, prices) shared by the docs page and the landing template. All fictional; replace freely. */

export function Ico({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const P = {
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  palette: "M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2.2-.6-1.4.2-2.8 1.8-2.8H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01",
  accessibility: "M12 5a1 1 0 1 0 0 .01M5 8.5l7 1.5 7-1.5M12 10v4M9 21l3-7 3 7",
  code: "M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h13",
  users: "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1a4 4 0 0 0-3-3.9M16 4.1a3.5 3.5 0 0 1 0 6.8",
  mail: "M3 6h18v12H3zM3 7l9 7 9-7",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  rss: "M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8M6 19h.01",
  rocket: "M5 15c-1 1-1.5 4-1.5 4s3-.5 4-1.5M14 4c3-1 6-1 6-1s0 3-1 6l-6 6-5-5 6-6zM9 9l-4 1 3 3M15 15l-1 4-3-3",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
};

export const icons = {
  layers: <Ico d={P.layers} />,
  bolt: <Ico d={P.bolt} />,
  palette: <Ico d={P.palette} />,
  accessibility: <Ico d={P.accessibility} />,
  code: <Ico d={P.code} />,
  moon: <Ico d={P.moon} />,
  book: <Ico d={P.book} />,
  users: <Ico d={P.users} />,
  mail: <Ico d={P.mail} />,
  link: <Ico d={P.link} />,
  rss: <Ico d={P.rss} />,
  rocket: <Ico d={P.rocket} />,
  star: <Ico d={P.star} />,
};

/* ---------------- navbar ---------------- */
export const navItems: NavbarItem[] = [
  {
    label: "Components",
    links: [
      { label: "3D Cards", description: "Tilt, flip, holo and spotlight cards", href: "#tilt-card", icon: icons.layers },
      { label: "Scenes", description: "Orbit, cube, carousel and cover flow", href: "#orbit-3d", icon: icons.rocket },
      { label: "Controls", description: "Dock and extruded buttons", href: "#button-3d", icon: icons.bolt },
      { label: "Page blocks", description: "Navbar, hero, pricing and more", href: "#hero-section", icon: icons.palette },
    ],
    featured: (
      <>
        <p className="font-mono text-[10px] uppercase tracking-widest text-depth-accent">New</p>
        <p className="mt-2 text-sm font-semibold">Landing template</p>
        <p className="mt-1 text-xs leading-snug text-depth-muted">
          Every block, assembled into a full page.
        </p>
      </>
    ),
  },
  {
    label: "Resources",
    links: [
      { label: "Documentation", description: "Copy-paste setup guide", href: "#getting-started", icon: icons.book },
      { label: "Theming", description: "Light and dark tokens", href: "#theme", icon: icons.moon },
      { label: "Source", description: "Every component's code", href: "#footer", icon: icons.code },
    ],
  },
  { label: "Pricing", href: "#pricing-table" },
  { label: "FAQ", href: "#faq-accordion" },
];

/* ---------------- hero visual ---------------- */
export function HeroMock() {
  const bars = [38, 62, 46, 78, 56, 90, 70, 84];
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-depth-border bg-depth-surface">
        <div className="flex items-center gap-1.5 border-b border-depth-border bg-depth-elevated px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-depth-accent-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded-md bg-depth-bg px-3 py-0.5 font-mono text-[10px] text-depth-muted">
            app.depth.dev / overview
          </span>
        </div>
        <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[8.5rem_1fr]">
          <div className="space-y-2 border-r border-depth-border p-3">
            {["Overview", "Projects", "Insights", "Settings"].map((t, i) => (
              <div
                key={t}
                className={`rounded-md px-2 py-1.5 text-[11px] ${
                  i === 0 ? "bg-depth-accent/15 font-medium text-depth-accent" : "text-depth-muted"
                }`}
              >
                <span className="hidden sm:inline">{t}</span>
                <span className="sm:hidden">{t.charAt(0)}</span>
              </div>
            ))}
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ["Revenue", "$48.2k"],
                ["Users", "12.4k"],
                ["Uptime", "99.99%"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-depth-border bg-depth-elevated p-2.5 sm:p-3">
                  <p className="font-mono text-[9px] uppercase text-depth-muted sm:text-[10px]">{k}</p>
                  <p className="mt-1 text-sm font-semibold sm:text-lg">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex h-24 items-end gap-1.5 rounded-lg border border-depth-border bg-depth-elevated p-3 sm:mt-4 sm:h-32 sm:gap-2">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-depth-accent to-depth-accent-2"
                  style={{ height: `${h}%`, opacity: 0.55 + i * 0.05 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <HeroFloat z={70} className="-right-2 top-10 sm:-right-8">
        <span className="flex items-center gap-2 rounded-xl border border-depth-border bg-depth-surface px-3 py-2 text-xs font-medium shadow-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Deployed
        </span>
      </HeroFloat>
      <HeroFloat z={95} delay={1.4} className="-left-2 bottom-12 sm:-left-8">
        <span className="rounded-xl border border-depth-border bg-depth-surface px-3 py-2 text-xs font-medium shadow-xl">
          <span className="text-depth-accent">+24%</span> this week
        </span>
      </HeroFloat>
    </>
  );
}

/* ---------------- features ---------------- */
function Spark({ heights }: { heights: number[] }) {
  return (
    <div className="flex h-12 items-end gap-1" aria-hidden>
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-depth-accent/70 to-depth-accent-2/70"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export const features: Feature[] = [
  {
    title: "Real depth, no WebGL",
    description:
      "Every effect is CSS 3D transforms driven by motion values, so it runs on the GPU and never re-renders React.",
    icon: icons.layers,
    size: "wide",
    visual: <Spark heights={[30, 55, 40, 75, 52, 88, 64, 95, 70, 82]} />,
  },
  {
    title: "Light and dark, built in",
    description: "Tokens switch themes with one class, and every component follows.",
    icon: icons.moon,
    size: "tall",
    visual: (
      <div className="grid grid-cols-2 gap-2" aria-hidden>
        <div className="h-24 rounded-xl border border-depth-border bg-white" />
        <div className="h-24 rounded-xl border border-depth-border bg-slate-900" />
        <div className="col-span-2 h-12 rounded-xl bg-gradient-to-r from-depth-accent to-depth-accent-2 opacity-80" />
      </div>
    ),
  },
  {
    title: "Copy, paste, own",
    description: "Components are plain source files. No package to fight with.",
    icon: icons.code,
  },
  {
    title: "Accessible by default",
    description: "Keyboard support, focus rings and reduced-motion handling throughout.",
    icon: icons.accessibility,
  },
  {
    title: "Themed with tokens",
    description:
      "Change a handful of CSS variables and the whole library takes on your brand, from cards to navbars.",
    icon: icons.palette,
    size: "wide",
    visual: (
      <div className="flex gap-2" aria-hidden>
        {["bg-depth-accent", "bg-depth-accent-2", "bg-depth-accent-3", "bg-depth-elevated", "bg-depth-border"].map((c) => (
          <span key={c} className={`h-9 flex-1 rounded-lg border border-depth-border ${c}`} />
        ))}
      </div>
    ),
  },
  {
    title: "Fast by design",
    description: "Only transform and opacity animate, so scrolling stays smooth.",
    icon: icons.bolt,
  },
];

const Panel = ({ children }: { children: ReactNode }) => (
  <div className="rounded-xl border border-depth-border bg-depth-elevated p-4">{children}</div>
);

export const featureTabs: FeatureTab[] = [
  {
    id: "cards",
    label: "3D cards",
    title: "Cards that react to you",
    description: "Tilt, glare, spotlight and foil, all driven by the pointer.",
    icon: icons.layers,
    visual: (
      <div className="grid gap-3 sm:grid-cols-3" aria-hidden>
        {["from-violet-500/40", "from-cyan-400/40", "from-pink-400/40"].map((c) => (
          <div key={c} className={`h-36 rounded-xl border border-depth-border bg-gradient-to-br ${c} to-transparent`} />
        ))}
      </div>
    ),
  },
  {
    id: "blocks",
    label: "Page blocks",
    title: "Whole sections, ready to ship",
    description: "Navbar, hero, pricing, FAQ and footer that match the cards.",
    icon: icons.palette,
    visual: (
      <Panel>
        <div className="space-y-2" aria-hidden>
          {[70, 100, 55, 85].map((w, i) => (
            <div key={i} className="h-3 rounded-full bg-depth-border" style={{ width: `${w}%` }} />
          ))}
          <div className="mt-3 h-9 w-28 rounded-lg bg-depth-accent" />
        </div>
      </Panel>
    ),
  },
  {
    id: "themes",
    label: "Theming",
    title: "One set of tokens",
    description: "Switch light and dark, or re-brand with a few variables.",
    icon: icons.moon,
    visual: (
      <div className="flex flex-wrap gap-3" aria-hidden>
        {["bg-depth-accent", "bg-depth-accent-2", "bg-depth-accent-3"].map((c) => (
          <span key={c} className={`h-20 w-20 rounded-2xl shadow-lg ${c}`} />
        ))}
      </div>
    ),
  },
];

/* ---------------- logos / testimonials ---------------- */
export const logos = ["Lumio", "Vertex", "Nimbus", "Quanta", "Orbital", "Helix", "Pulse", "Atlas"];

export const testimonials: Testimonial[] = [
  { quote: "We dropped it into our marketing site in an afternoon. It feels expensive and it stays at 60fps.", name: "Maya Chen", role: "Design Engineer, Lumio" },
  { quote: "The copy-paste model is perfect. I changed three tokens and it matched our brand.", name: "Arjun Mehta", role: "Frontend Lead, Vertex" },
  { quote: "Finally a 3D library that does not ship a 400kB WebGL runtime.", name: "Sofia Rossi", role: "CTO, Nimbus" },
  { quote: "Dark mode just worked. Every block, first try.", name: "Tom Becker", role: "Indie Maker" },
  { quote: "Our Lighthouse score did not move after adding the hero. That never happens.", name: "Priya Nair", role: "Product Engineer, Quanta" },
  { quote: "The navbar menu alone sold my team on it.", name: "Leo Martins", role: "Founder, Orbital" },
];

/* ---------------- stats / steps / pricing / faq ---------------- */
export const stats: Stat[] = [
  { value: 19, label: "3D components" },
  { value: 12, label: "Page blocks" },
  { value: 2, label: "Themes, light and dark" },
  { value: 0, label: "WebGL or canvas" },
];

export const steps: TimelineStep[] = [
  { title: "Copy a block", description: "Grab the file and the shared helpers. Everything is plain React and Tailwind." },
  { title: "Set your tokens", description: "Edit the depth-* CSS variables once. Light and dark both follow." },
  { title: "Drop in your content", description: "Pass your own links, features, plans and copy through typed props." },
  { title: "Ship it", description: "No WebGL, no runtime to configure. It builds with the rest of your app." },
];

export const plans: PricingPlan[] = [
  {
    name: "Starter",
    description: "For side projects and experiments.",
    monthly: 0,
    yearly: 0,
    features: ["All card components", "Light and dark themes", "Community support"],
    cta: "Start free",
  },
  {
    name: "Pro",
    description: "For teams shipping marketing sites.",
    monthly: 19,
    yearly: 15,
    features: ["Everything in Starter", "All page blocks", "Landing templates", "Priority support"],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Team",
    description: "For agencies and larger orgs.",
    monthly: 49,
    yearly: 39,
    features: ["Everything in Pro", "Unlimited seats", "Custom theming help", "Shared component registry"],
    cta: "Contact sales",
  },
];

export const faqs: FAQItem[] = [
  {
    question: "Does it use WebGL or Three.js?",
    answer: "No. Every effect is CSS 3D transforms animated by Framer Motion, so there is no canvas and no extra runtime.",
  },
  {
    question: "How do I install it?",
    answer: "Copy the component file you want, plus lib/utils.ts and any helper it lists. Then install framer-motion, clsx and tailwind-merge.",
  },
  {
    question: "Can I change the colours?",
    answer: "Yes. Edit the depth-* variables in index.css. Light and dark are defined side by side.",
  },
  {
    question: "Is it accessible?",
    answer: "Interactive components support the keyboard, show focus rings, and switch off motion when the user prefers reduced motion.",
  },
  {
    question: "What about performance?",
    answer: "Pointer effects run through motion values, so they never re-render React, and only transform and opacity are animated.",
  },
];

/* ---------------- footer ---------------- */
export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Components", href: "#tilt-card" },
      { label: "Blocks", href: "#hero-section" },
      { label: "Pricing", href: "#pricing-table" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#getting-started" },
      { label: "Theming", href: "#theme" },
      { label: "FAQ", href: "#faq-accordion" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#top" },
      { label: "Contact", href: "#top" },
      { label: "Privacy", href: "#top" },
    ],
  },
];

export const footerSocials: FooterSocial[] = [
  { label: "Website", href: "#top", icon: icons.link },
  { label: "Email", href: "#top", icon: icons.mail },
  { label: "RSS feed", href: "#top", icon: icons.rss },
];

/* ---------------- small shared pieces ---------------- */
export function LogoItem({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2 px-3 text-lg font-semibold tracking-tight text-depth-muted">
      <span aria-hidden className="h-5 w-5 rounded-md bg-gradient-to-br from-depth-accent to-depth-accent-2 opacity-70" />
      {name}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-depth-accent">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-depth-muted sm:text-lg">{description}</p>}
    </div>
  );
}
