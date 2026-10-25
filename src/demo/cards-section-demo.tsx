import { useState } from "react";
import {
  ArticleCard,
  BeamCard,
  Button3D,
  CardsSection,
  CreditCard3D,
  MetricCard,
  ProductCard,
  ProfileCard,
  RevealCard,
  type CardsSectionItem,
} from "@/components/depth";
import { Showcase, type CodeFile, pick } from "./showcase";

import profileSrc from "@/components/depth/cards/profile-card.tsx?raw";
import productSrc from "@/components/depth/cards/product-card.tsx?raw";
import creditSrc from "@/components/depth/cards/credit-card-3d.tsx?raw";
import metricSrc from "@/components/depth/cards/metric-card.tsx?raw";
import articleSrc from "@/components/depth/cards/article-card.tsx?raw";
import beamSrc from "@/components/depth/cards/beam-card.tsx?raw";
import revealSrc from "@/components/depth/cards/reveal-card.tsx?raw";
import sectionSrc from "@/components/depth/blocks/cards-section.tsx?raw";
import tiltCardSrc from "@/components/depth/tilt-card.tsx?raw";
import spotlightSrc from "@/components/depth/spotlight-card.tsx?raw";
import statsSrc from "@/components/depth/blocks/stats-section.tsx?raw";
import tiltHookSrc from "@/hooks/use-tilt.ts?raw";
import utilsSrc from "@/lib/utils.ts?raw";
import motionCss from "@/styles/depth-motion.css?raw";

const utils: CodeFile = { name: "lib/utils.ts", code: utilsSrc };
const hook: CodeFile = { name: "hooks/use-tilt.ts", code: tiltHookSrc };
const css: CodeFile = { name: "styles/depth-motion.css", code: motionCss };
const f = (dir: string, n: string, code: string): CodeFile => ({ name: `components/depth/${dir}${n}.tsx`, code });

const articles: CardsSectionItem[] = [
  { id: "a1", category: "Design", title: "Why depth beats decoration", excerpt: "Real perspective makes an interface easier to read, not just prettier.", author: "Mira Sol", date: "Mar 4", readTime: "5 min", tone: 0, href: "#cards-section" },
  { id: "a2", category: "Engineering", title: "Animating with motion values", excerpt: "Skip React renders for anything that follows a pointer.", author: "Dev Rao", date: "Mar 11", readTime: "7 min", tone: 1, href: "#cards-section" },
  { id: "a3", category: "Design", title: "Light and dark, one set of tokens", excerpt: "Name colours by role and the theme switch becomes free.", author: "Ana Costa", date: "Mar 18", readTime: "4 min", tone: 2, href: "#cards-section" },
  { id: "a4", category: "Performance", title: "Transform and opacity only", excerpt: "The two properties the browser can animate without layout.", author: "Dev Rao", date: "Mar 25", readTime: "6 min", tone: 3, href: "#cards-section" },
  { id: "a5", category: "Engineering", title: "Copy-paste beats packages", excerpt: "Owning the source means owning the fix.", author: "Leo Park", date: "Apr 2", readTime: "3 min", tone: 4, href: "#cards-section" },
  { id: "a6", category: "Performance", title: "Respecting reduced motion", excerpt: "A calm fallback for everyone who asks for one.", author: "Mira Sol", date: "Apr 9", readTime: "4 min", tone: 0, href: "#cards-section" },
];

function ProductDemo() {
  const [n, setN] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <ProductCard
        className="w-72"
        name="Aero Headphones"
        price={189}
        rating={4.5}
        badge="New"
        description="Wireless, 40-hour battery."
        colors={[
          { name: "Violet", value: "#8b5cf6" },
          { name: "Cyan", value: "#22d3ee" },
          { name: "Rose", value: "#fb7185" },
        ]}
        onAdd={() => setN((v) => v + 1)}
      />
      <p className="font-mono text-xs text-depth-muted" aria-live="polite">
        in cart: {n}
      </p>
    </div>
  );
}

export function CardsDemoSection({ only }: { only?: string } = {}) {
  return pick(
    <>
      <Showcase
        id="profile-card"
        title="Profile Card"
        blurb="A tilting card with layered avatar, stats and a follow toggle."
        usage={`import { ProfileCard } from "@/components/depth";

<ProfileCard
  name="Aria Chen"
  role="Product Designer"
  handle="ariachen"
  bio="Building calm interfaces."
  stats={[{ label: "Followers", value: "12.4k" }, { label: "Posts", value: "342" }]}
  onFollowChange={(following) => console.log(following)}
/>`}
        files={[f("cards/", "profile-card", profileSrc), f("", "tilt-card", tiltCardSrc), hook, utils]}
        previewClassName="min-h-[420px]"
      >
        <ProfileCard
          className="w-72"
          name="Aria Chen"
          role="Product Designer"
          handle="ariachen"
          bio="Building calm interfaces with a bit of depth."
          stats={[
            { label: "Followers", value: "12.4k" },
            { label: "Posts", value: "342" },
            { label: "Likes", value: "98k" },
          ]}
        />
      </Showcase>

      <Showcase
        id="product-card"
        title="Product Card"
        blurb="Pick a colour and the product recolours. Heart it, add it to the cart."
        usage={`import { ProductCard } from "@/components/depth";

<ProductCard
  name="Aero Headphones"
  price={189}
  rating={4.5}
  badge="New"
  colors={[{ name: "Violet", value: "#8b5cf6" }, { name: "Cyan", value: "#22d3ee" }]}
  onAdd={(color) => addToCart(color)}
/>`}
        files={[f("cards/", "product-card", productSrc), f("", "tilt-card", tiltCardSrc), hook, utils]}
        previewClassName="min-h-[460px]"
      >
        <ProductDemo />
      </Showcase>

      <Showcase
        id="credit-card-3d"
        title="Credit Card"
        blurb="Tilts with your pointer. Click or press Enter to flip it over."
        usage={`import { CreditCard3D } from "@/components/depth";

<CreditCard3D
  number="•••• •••• •••• 4821"
  name="AKRAM KHAN"
  expires="08/29"
  cvv="123"
  width={320}
/>`}
        files={[f("cards/", "credit-card-3d", creditSrc), hook, utils]}
        previewClassName="min-h-[320px]"
      >
        <CreditCard3D number="•••• •••• •••• 4821" name="AKRAM KHAN" expires="08/29" cvv="123" width={320} />
      </Showcase>

      <Showcase
        id="metric-card"
        title="Metric Card"
        blurb="A spotlight card with a counting number and a sparkline that draws itself."
        usage={`import { MetricCard } from "@/components/depth";

<MetricCard
  label="Monthly revenue"
  value={48200}
  prefix="$"
  delta={12.4}
  data={[12, 18, 15, 24, 22, 31, 38]}
/>`}
        files={[f("cards/", "metric-card", metricSrc), f("", "spotlight-card", spotlightSrc), f("blocks/", "stats-section", statsSrc), utils]}
        previewClassName="min-h-[260px]"
      >
        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <MetricCard label="Monthly revenue" value={48200} prefix="$" delta={12.4} data={[12, 18, 15, 24, 22, 31, 38]} />
          <MetricCard label="Churn" value={2.1} suffix="%" decimals={1} delta={-0.6} data={[30, 28, 29, 24, 22, 20, 18]} />
        </div>
      </Showcase>

      <Showcase
        id="article-card"
        title="Article Card"
        blurb="A blog or news card. The cover zooms and the arrow slides on hover."
        usage={`import { ArticleCard } from "@/components/depth";

<ArticleCard
  title="Why depth beats decoration"
  excerpt="Real perspective makes interfaces easier to read."
  category="Design"
  author="Mira Sol"
  date="Mar 4"
  readTime="5 min"
  tone={0}
  href="/blog/depth"
/>`}
        files={[f("cards/", "article-card", articleSrc), utils]}
        previewClassName="min-h-[380px]"
      >
        <ArticleCard className="w-80" {...articles[0]} />
      </Showcase>

      <Showcase
        id="beam-card"
        title="Beam Card"
        blurb="A light beam circles the card border. Put anything inside."
        usage={`import { BeamCard } from "@/components/depth";

<BeamCard duration={5} className="w-80" contentClassName="p-6">
  <h3 className="text-lg font-semibold">Pro plan</h3>
  <p>Everything unlocked.</p>
</BeamCard>`}
        files={[f("cards/", "beam-card", beamSrc), css, utils]}
        previewClassName="min-h-[280px]"
      >
        <BeamCard className="w-80" contentClassName="p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-depth-accent">Pro</p>
          <h3 className="mt-2 text-xl font-semibold">Everything unlocked</h3>
          <p className="mt-2 text-sm text-depth-muted">Unlimited projects, priority support and early access.</p>
          <Button3D className="mt-5">Upgrade</Button3D>
        </BeamCard>
      </Showcase>

      <Showcase
        id="reveal-card"
        title="Reveal Card"
        blurb="Hover, focus or tap and a details panel slides up over the image."
        usage={`import { RevealCard } from "@/components/depth";

<RevealCard title="Northern Lights" eyebrow="Travel" className="h-72 w-72">
  Seven nights in Tromsø with guided aurora hunts.
</RevealCard>`}
        files={[f("cards/", "reveal-card", revealSrc), utils]}
        previewClassName="min-h-[360px]"
      >
        <RevealCard title="Northern Lights" eyebrow="Travel" className="h-72 w-72">
          Seven nights in Tromsø with guided aurora hunts and warm cabins.
        </RevealCard>
      </Showcase>

      <Showcase
        id="cards-section"
        title="Cards Section"
        blurb="A full section: filter chips with a sliding highlight above an animated grid of article cards."
        usage={`import { CardsSection } from "@/components/depth";

<CardsSection
  items={[
    { id: "1", category: "Design", title: "…", excerpt: "…", author: "…", date: "…", readTime: "5 min" },
  ]}
/>`}
        files={[f("blocks/", "cards-section", sectionSrc), f("cards/", "article-card", articleSrc), utils]}
        previewClassName="items-start"
      >
        <CardsSection items={articles} />
      </Showcase>
    </>,
    only,
  );
}
