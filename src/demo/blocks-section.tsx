import {
  AnimatedNavbar,
  Button3D,
  CTASection,
  FAQAccordion,
  FeatureGrid,
  FeatureTabs,
  Footer,
  HeroSection,
  Marquee,
  PricingTable,
  StatsSection,
  TestimonialWall,
  ThemeToggle,
  TimelineSteps,
} from "@/components/depth";
import { Showcase, type CodeFile, pick } from "./showcase";
import { usage } from "./usage";
import {
  HeroMock,
  faqs,
  featureTabs,
  features,
  footerColumns,
  footerSocials,
  logos,
  LogoItem,
  navItems,
  plans,
  stats,
  steps,
  testimonials,
} from "./block-data";

import navbarSrc from "@/components/depth/blocks/animated-navbar.tsx?raw";
import heroSrc from "@/components/depth/blocks/hero-section.tsx?raw";
import gridSrc from "@/components/depth/blocks/feature-grid.tsx?raw";
import tabsSrc from "@/components/depth/blocks/feature-tabs.tsx?raw";
import marqueeSrc from "@/components/depth/blocks/marquee.tsx?raw";
import testimonialsSrc from "@/components/depth/blocks/testimonials.tsx?raw";
import statsSrc from "@/components/depth/blocks/stats-section.tsx?raw";
import progressHookSrc from "@/hooks/use-scroll-progress.ts?raw";
import timelineSrc from "@/components/depth/blocks/timeline-steps.tsx?raw";
import pricingSrc from "@/components/depth/blocks/pricing-table.tsx?raw";
import faqSrc from "@/components/depth/blocks/faq-accordion.tsx?raw";
import ctaSrc from "@/components/depth/blocks/cta-section.tsx?raw";
import footerSrc from "@/components/depth/blocks/footer.tsx?raw";
import spotlightSrc from "@/components/depth/spotlight-card.tsx?raw";
import tiltCardSrc from "@/components/depth/tilt-card.tsx?raw";
import tiltHookSrc from "@/hooks/use-tilt.ts?raw";
import utilsSrc from "@/lib/utils.ts?raw";
import motionCss from "@/styles/depth-motion.css?raw";

const f = (name: string, code: string): CodeFile => ({ name, code });
const utils = f("lib/utils.ts", utilsSrc);
const tiltHook = f("hooks/use-tilt.ts", tiltHookSrc);
const motion = f("styles/depth-motion.css", motionCss);
const b = (name: string, code: string) => f(`components/depth/blocks/${name}`, code);

const signIn = (
  <a
    href="#top"
    className="rounded-full bg-depth-accent px-4 py-2 text-sm font-medium text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-depth-accent focus-visible:ring-offset-2 focus-visible:ring-offset-depth-surface"
  >
    Sign up
  </a>
);

/** Docs entries for every page block, in the same order as the sidebar. */
export function BlocksSection({ only }: { only?: string } = {}) {
  return pick(
    <>
      <Showcase
        id="animated-navbar"
        title="Animated Navbar"
        blurb="A floating pill. A highlight glides between items, menus swing down in 3D, and phones get a hamburger with an accordion."
        usage={usage.navbar}
        files={[b("animated-navbar.tsx", navbarSrc), utils]}
        previewClassName="items-start pt-8 sm:pt-10 min-h-[460px]"
      >
        <AnimatedNavbar
          logo={<span className="font-semibold tracking-tight">Depth UI</span>}
          items={navItems}
          actions={
            <>
              <ThemeToggle className="h-9 w-9" />
              {signIn}
            </>
          }
        />
      </Showcase>

      <Showcase
        id="hero-section"
        title="Hero"
        blurb="A staggered headline over a glowing grid, with a visual that tilts back in 3D and follows your pointer. Floating chips sit at their own depth."
        usage={usage.hero}
        files={[b("hero-section.tsx", heroSrc), tiltHook, motion, utils]}
        previewClassName="block p-0 sm:p-0"
      >
        <HeroSection
          badge={
            <span className="rounded-full border border-depth-border bg-depth-surface px-3 py-1 font-mono text-xs text-depth-muted">
              <span className="text-depth-accent">New</span> · v0.5 blocks
            </span>
          }
          title={
            <>
              Interfaces with{" "}
              <span className="bg-gradient-to-r from-depth-accent via-depth-accent-3 to-depth-accent-2 bg-clip-text text-transparent">
                real depth
              </span>
            </>
          }
          description="Copy-paste 3D components and page sections that stay light, themed and accessible."
          actions={
            <>
              <Button3D>Get started</Button3D>
              <Button3D variant="neutral" depth={6}>
                Read the docs
              </Button3D>
            </>
          }
          visual={<HeroMock />}
        />
      </Showcase>

      <Showcase
        id="feature-grid"
        title="Feature Grid"
        blurb="A bento grid. Cards fade up as they enter and each has a pointer spotlight. Features can span two columns or two rows."
        usage={usage.featureGrid}
        files={[b("feature-grid.tsx", gridSrc), f("components/depth/spotlight-card.tsx", spotlightSrc), utils]}
        previewClassName="items-start"
      >
        <div className="w-full">
          <FeatureGrid features={features} />
        </div>
      </Showcase>

      <Showcase
        id="feature-tabs"
        title="Feature Tabs"
        blurb="Pick a feature on the left and the stage swings around in 3D. Arrow keys move between tabs."
        usage={usage.featureTabs}
        files={[b("feature-tabs.tsx", tabsSrc), utils]}
        previewClassName="items-start"
      >
        <div className="w-full">
          <FeatureTabs tabs={featureTabs} />
        </div>
      </Showcase>

      <Showcase
        id="marquee"
        title="Marquee"
        blurb="An endless horizontal ticker for logos or badges. CSS only, pauses on hover, fades at the edges. Stack two with reverse for opposing rows."
        usage={usage.marqueeRow}
        files={[b("marquee.tsx", marqueeSrc), motion, utils]}
        previewClassName="min-h-[260px]"
      >
        <div className="w-full space-y-5">
          <Marquee items={logos.map((l) => <LogoItem key={l} name={l} />)} duration={32} />
          <Marquee items={[...logos].reverse().map((l) => <LogoItem key={l} name={l} />)} duration={40} reverse />
        </div>
      </Showcase>

      <Showcase
        id="testimonials"
        title="Testimonials"
        blurb="Two rows of quote cards drifting in opposite directions. Built on Marquee, so it is CSS only."
        usage={usage.testimonials}
        files={[b("testimonials.tsx", testimonialsSrc), b("marquee.tsx", marqueeSrc), motion, utils]}
        previewClassName="min-h-[320px] p-0 sm:p-0"
      >
        <div className="w-full">
          <TestimonialWall items={testimonials} />
        </div>
      </Showcase>

      <Showcase
        id="stats-section"
        title="Stats"
        blurb="Numbers count up once when they scroll into view, on cards that lean toward the pointer."
        usage={usage.stats}
        files={[b("stats-section.tsx", statsSrc), f("components/depth/tilt-card.tsx", tiltCardSrc), tiltHook, utils]}
      >
        <div className="w-full">
          <StatsSection stats={stats} />
        </div>
      </Showcase>

      <Showcase
        id="timeline-steps"
        title="Timeline Steps"
        blurb="A how-it-works timeline. The line draws down as you scroll and each step swings in from the side."
        usage={usage.timeline}
        files={[b("timeline-steps.tsx", timelineSrc), { name: "hooks/use-scroll-progress.ts", code: progressHookSrc }, utils]}
        previewClassName="items-start"
      >
        <div className="w-full max-w-xl">
          <TimelineSteps steps={steps} />
        </div>
      </Showcase>

      <Showcase
        id="pricing-table"
        title="Pricing"
        blurb="Plan cards with a monthly and yearly switch. Prices slide on change and each card leans toward the pointer."
        usage={usage.pricing}
        files={[b("pricing-table.tsx", pricingSrc), tiltHook, utils]}
        previewClassName="items-start"
      >
        <div className="w-full">
          <PricingTable plans={plans} />
        </div>
      </Showcase>

      <Showcase
        id="faq-accordion"
        title="FAQ"
        blurb="An accessible accordion. Answers swing down in 3D and the plus turns into a cross."
        usage={usage.faq}
        files={[b("faq-accordion.tsx", faqSrc), utils]}
        previewClassName="items-start"
      >
        <div className="w-full max-w-2xl">
          <FAQAccordion items={faqs} defaultOpen={0} />
        </div>
      </Showcase>

      <Showcase
        id="cta-section"
        title="Call to Action"
        blurb="A banner with glass shapes that drift at different depths as your pointer moves."
        usage={usage.cta}
        files={[b("cta-section.tsx", ctaSrc), utils]}
      >
        <div className="w-full">
          <CTASection
            title="Ready to add some depth?"
            description="Copy a component, set your tokens and ship it today."
            actions={
              <>
                <Button3D>Get started</Button3D>
                <Button3D variant="neutral" depth={6}>
                  Browse components
                </Button3D>
              </>
            }
          />
        </div>
      </Showcase>

      <Showcase
        id="footer"
        title="Footer"
        blurb="Brand blurb, link columns, socials, a newsletter signup and a large faded wordmark."
        usage={usage.footer}
        files={[b("footer.tsx", footerSrc), utils]}
        previewClassName="block p-0 sm:p-0"
      >
        <Footer
          brand="Depth UI"
          description="3D components and page blocks for React, Tailwind and Framer Motion."
          columns={footerColumns}
          socials={footerSocials}
          wordmark="DEPTH"
          bottom={<span>© 2026 Depth UI. Sample footer.</span>}
        />
      </Showcase>
    </>,
    only,
  );
}
