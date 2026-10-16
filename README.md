# Depth UI

Copy-paste 3D React components built on **Tailwind CSS v4** and **Framer Motion**,
with light and dark themes. No WebGL, no Three.js: just CSS 3D transforms driven by
motion values, so it stays light.

## Routes

| Path | What |
| --- | --- |
| `/components` | Docs: every component with Preview / Usage / Source |
| `/demo` | A full landing page built from the library |

The app uses `react-router-dom`. When you deploy the static build, configure a fallback so unknown paths
serve `index.html` (Netlify `_redirects`: `/* /index.html 200`; Vercel: a rewrite to `/`).

## Run

```bash
npm install
npm run dev
```

The demo site has a **Preview / Usage / Source** tab for every component. The Source tab
shows the real files (imported with Vite's `?raw`), so it never goes out of date.

## Components

| Component | File | What it does |
| --- | --- | --- |
| `TiltCard` / `TiltLayer` | `tilt-card.tsx` | Pointer tilt, moving glare, per-layer `translateZ` |
| `SpotlightCard` | `spotlight-card.tsx` | Light and glowing border that follow the pointer |
| `HoloCard` | `holo-card.tsx` | Collectible card with rainbow foil and shine |
| `FlipCard` | `flip-card.tsx` | Spring flip on hover / tap / keyboard |
| `CardDeck` | `card-deck.tsx` | Stacked cards, swipe / click / keys to cycle |
| `BookCard` | `book-card.tsx` | Hardcover whose cover swings open |
| `DepthStack` / `DepthLayer` | `depth-stack.tsx` | Layered pointer parallax |
| `Cube3D` | `cube-3d.tsx` | Idle-rotating, draggable cube |
| `Carousel3D` | `carousel-3d.tsx` | Ring carousel with keyboard + click nav |
| `CoverFlow` | `cover-flow.tsx` | Classic album-browser fan layout |
| `Orbit3D` | `orbit-3d.tsx` | Items orbiting a core on tilted rings (CSS only) |
| `LayerStack` | `layer-stack.tsx` | Isometric stack that explodes apart |
| `IsometricGrid` | `isometric-grid.tsx` | Isometric tiles that lift on hover / tap |
| `GridFloor` | `grid-floor.tsx` | Endless perspective grid (CSS only) |
| `Marquee3D` | `marquee-3d.tsx` | Tilted, counter-scrolling marquee columns (CSS only) |
| `ScrollReveal3D` | `scroll-reveal-3d.tsx` | Panel that flattens as it scrolls into view |
| `Button3D` | `button-3d.tsx` | Extruded button that leans and presses |
| `Dock3D` | `dock-3d.tsx` | Magnifying icon dock on a tilted shelf |
| `Text3D` | `text-3d.tsx` | Extruded headline from stacked layers |
| `GitHubStarButton` | `github-star-button.tsx` | "Star on GitHub" pill with a live count; set the repo in `src/lib/site.ts` |
| `ThemeProvider` / `ThemeToggle` / `useTheme` | `theme.tsx` | Light/dark switching |

## Page blocks

Whole-section components in `src/components/depth/blocks/`, themed for light and dark:

| Block | File | What it does |
| --- | --- | --- |
| `AnimatedNavbar` | `animated-navbar.tsx` | Floating pill, gliding hover highlight, 3D mega-menu dropdowns, hamburger + accordion on phones |
| `HeroSection` / `HeroFloat` | `hero-section.tsx` | Staggered headline, glowing grid, tilting visual with floating chips |
| `FeatureGrid` | `feature-grid.tsx` | Bento grid with spotlight cards (wide / tall spans) |
| `FeatureTabs` | `feature-tabs.tsx` | Tab list with a 3D-swinging stage, arrow-key navigation |
| `Marquee` | `marquee.tsx` | Endless horizontal ticker (CSS only), pauses on hover |
| `TestimonialWall` | `testimonials.tsx` | Two opposing marquee rows of quote cards |
| `StatsSection` / `AnimatedCounter` | `stats-section.tsx` | Count-up numbers on tilting cards |
| `TimelineSteps` | `timeline-steps.tsx` | Scroll-drawn "how it works" timeline |
| `PricingTable` | `pricing-table.tsx` | Plans with monthly / yearly switch and sliding prices |
| `FAQAccordion` | `faq-accordion.tsx` | Accessible accordion with 3D reveal |
| `CTASection` | `cta-section.tsx` | Banner with pointer-parallax glass shapes |
| `Footer` | `footer.tsx` | Link columns, socials, newsletter form, faded wordmark |

`src/pages/demo-page.tsx` assembles the whole library (buttons, cards, scenes, UI elements and blocks) into a
complete landing page, served at `/demo`. Copy it as a starting point for your own site.
All names, quotes and prices in `src/demo/block-data.tsx` are fictional placeholders.

Shared engine: `src/hooks/use-tilt.ts`. Keyframes for GridFloor, Marquee3D and Orbit3D: `src/styles/depth-motion.css`. Scroll-driven components (`ScrollReveal3D`, `TextReveal`, `TimelineSteps`) use `src/hooks/use-scroll-progress.ts`, which re-measures every frame so they work anywhere on a page.

## Buttons (v0.5)

All in `src/components/depth/buttons/`. Each file stands alone (plus `lib/utils.ts`; some need `depth-motion.css`).

| Component | Effect |
| --- | --- |
| `MagneticButton` | Pulls toward the pointer before contact |
| `ShimmerButton` | Highlight sweeps across the face |
| `BeamButton` | Light beam circles the border |
| `RippleButton` | Click ripple from the press point |
| `GlassButton` | Frosted glass, pointer-following highlight |
| `NeonButton` | Glowing outline, 3 tones |
| `RollButton` | Letters roll on hover (string children) |
| `FillButton` | Fill enters from the side the pointer came from |
| `LoadingButton` | idle / loading / success / error, driven by a returned Promise |
| `GradientButton` | Flowing gradient |
| `BrutalButton` | Hard offset shadow |
| `ArrowButton` | Arrow chip grows to fill the pill |

## More cards and a cards section (v0.5)

`ProfileCard`, `ProductCard`, `CreditCard3D`, `MetricCard`, `ArticleCard`, `BeamCard`, `RevealCard` in `cards/`, and `CardsSection` (filter chips + animated grid) in `blocks/`.

## UI elements (v0.5)

In `src/components/depth/ui/`: `Modal3D` (focus trap, Esc, scroll lock), `ToastProvider` + `useToast` (wrap your app once), `Switch3D`, `GlowInput`, `Tooltip3D`, `Loader3D`, `AvatarStack`, `ProgressRing`, `FlipWords`, `TextReveal`, `AuroraBackground`, `DotGlow`.

## Theming (light + dark)

- Tokens are CSS variables in `src/index.css`: `:root` is light, `.dark` overrides for dark.
- Components only use `depth-*` colour utilities (`bg-depth-surface`, `text-depth-muted`, ...), so
  changing a token re-themes everything. Colours that need a theme-aware value use
  variables directly (`--depth-glare`, `--depth-shadow`, `--depth-spot`, `--depth-grid-strong`).
- Dark mode is class-based (`<html class="dark">`) via `@custom-variant dark`.
- `index.html` has a tiny inline script that applies the saved or system theme before first paint,
  so there is no flash.
- The choice is saved in `localStorage` (`depth-theme`) and follows the OS setting until the user picks one.
- Wrap your app in `<ThemeProvider>` and drop `<ThemeToggle />` anywhere.

## Demo site navigation

`src/demo/nav.ts` is the single list of sections. The desktop sidebar and the mobile drawer
both render it through `nav-list.tsx`, with scroll-spy highlighting the current section.
Below the `lg` breakpoint a menu button in the navbar opens `mobile-drawer.tsx`
(closes on Esc, backdrop tap, link tap or swipe-left; locks page scroll; traps focus).
To add a component, add its id to `nav.ts` and a `<Showcase id="...">` to `App.tsx`.

## Using a component in your own project

1. `npm i framer-motion clsx tailwind-merge`
2. Copy the component file, plus `lib/utils.ts`, plus `hooks/use-tilt.ts` if it imports it,
   plus `styles/depth-motion.css` for GridFloor / Marquee3D / Orbit3D.
3. Copy the theme tokens, `@theme inline` block and 3D utilities from `index.css`.
4. Add the theme script from `index.html` and wrap your app in `ThemeProvider`.

## Performance rules (follow these for every new component)

1. **Motion values, not state.** Pointer-driven values go through `useMotionValue` / `useSpring` / `useTransform` so React never re-renders on mouse move.
2. **Animate only `transform` and `opacity`.** Those are compositor-only. Never animate width, height, top or left (GridFloor and Marquee3D loop by translating exactly one cell / half the content). `Dock3D` is the one documented exception, because neighbours must make room.
3. **Measure once.** Cache `getBoundingClientRect()` on pointer enter, not on every move.
4. **Ignore touch pointers** for hover effects so scrolling stays smooth.
5. **Respect `prefers-reduced-motion`** via `useReducedMotion` (JS) or the media query (CSS animations).
6. **`will-change: transform` only on interactive elements**, never on whole pages.
7. **Pause idle loops** (`useAnimationFrame`) while the user interacts.
8. **Keyboard and ARIA** for anything clickable.

## Adding a new component

- One file in `src/components/depth/`, exported from `index.ts`.
- Accept `className` and merge with `cn()`.
- Use only `depth-*` tokens or `var(--depth-*)` so it works in both themes. Check it in light and dark.
- Add a usage snippet to `src/demo/usage.ts` and a `<Showcase>` to `App.tsx` with its source files.

## Ideas for next components

Parallax hero, 3D image gallery wall, stacked notification list, 3D progress ring, page-turn.
