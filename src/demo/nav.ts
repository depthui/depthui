import { useEffect, useState } from "react";
import { BUTTON_NAV } from "./buttons-section";

export interface NavItem {
  id: string;
  label: string;
}
export interface NavGroup {
  title: string;
  items: NavItem[];
}

/** Single source of truth for the sidebar (desktop) and the drawer (mobile).
 *  Page sections in App.tsx follow this same order. */
export const NAV: NavGroup[] = [
  {
    title: "Start",
    items: [
      { id: "getting-started", label: "Getting started" },
      { id: "theme", label: "Theme & toggle" },
    ],
  },
  {
    title: "Cards",
    items: [
      { id: "tilt-card", label: "Tilt Card" },
      { id: "spotlight-card", label: "Spotlight Card" },
      { id: "holo-card", label: "Holo Card" },
      { id: "flip-card", label: "Flip Card" },
      { id: "card-deck", label: "Card Deck" },
      { id: "book-card", label: "Book" },
    ],
  },
  {
    title: "Scenes",
    items: [
      { id: "depth-stack", label: "Depth Stack" },
      { id: "cube-3d", label: "Cube" },
      { id: "carousel-3d", label: "Ring Carousel" },
      { id: "cover-flow", label: "Cover Flow" },
      { id: "orbit-3d", label: "Orbit" },
      { id: "layer-stack", label: "Layer Stack" },
      { id: "isometric-grid", label: "Isometric Grid" },
      { id: "grid-floor", label: "Grid Floor" },
      { id: "marquee-3d", label: "3D Marquee" },
      { id: "scroll-reveal-3d", label: "Scroll Reveal" },
    ],
  },
  {
    title: "Controls & text",
    items: [
      { id: "button-3d", label: "3D Button" },
      { id: "dock-3d", label: "Dock" },
      { id: "text-3d", label: "3D Text" },
      { id: "github-star", label: "GitHub Star" },
    ],
  },
  { title: "Buttons", items: BUTTON_NAV },
  {
    title: "More cards",
    items: [
      { id: "profile-card", label: "Profile Card" },
      { id: "product-card", label: "Product Card" },
      { id: "credit-card-3d", label: "Credit Card" },
      { id: "metric-card", label: "Metric Card" },
      { id: "article-card", label: "Article Card" },
      { id: "beam-card", label: "Beam Card" },
      { id: "reveal-card", label: "Reveal Card" },
      { id: "cards-section", label: "Cards Section" },
    ],
  },
  {
    title: "UI elements",
    items: [
      { id: "modal-3d", label: "Modal" },
      { id: "toast", label: "Toast" },
      { id: "switch-3d", label: "Switch" },
      { id: "glow-input", label: "Glow Input" },
      { id: "tooltip-3d", label: "Tooltip" },
      { id: "loader-3d", label: "Loader" },
      { id: "avatar-stack", label: "Avatar Stack" },
      { id: "progress-ring", label: "Progress Ring" },
    ],
  },
  {
    title: "Text & backgrounds",
    items: [
      { id: "flip-words", label: "Flip Words" },
      { id: "text-reveal", label: "Text Reveal" },
      { id: "aurora-background", label: "Aurora" },
      { id: "dot-glow", label: "Dot Glow" },
    ],
  },
  {
    title: "Showpieces",
    items: [
      { id: "globe-3d", label: "Globe" },
      { id: "flip-clock-3d", label: "Flip Clock" },
      { id: "text-cylinder-3d", label: "Text Cylinder" },
      { id: "coin-3d", label: "Coin" },
      { id: "gallery-wall-3d", label: "Gallery Wall" },
      { id: "page-turn", label: "Page Turn" },
      { id: "notification-stack-3d", label: "Notification Stack" },
      { id: "expanding-panels-3d", label: "Expanding Panels" },
      { id: "tag-cloud-3d", label: "Tag Cloud" },
      { id: "laptop-3d", label: "Laptop" },
      { id: "folder-3d", label: "Folder" },
      { id: "envelope-3d", label: "Envelope" },
      { id: "phone-3d", label: "Phone" },
      { id: "dice-3d", label: "Dice" },
      { id: "ticket-3d", label: "Ticket" },
      { id: "card-fan-3d", label: "Card fan" },
      { id: "peel-card", label: "Peel card" },
      { id: "turntable-3d", label: "Turntable" },
      { id: "slot-machine-3d", label: "Slot machine" },
      { id: "newtons-cradle-3d", label: "Newton's cradle" },
      { id: "bookshelf-3d", label: "Bookshelf" },
      { id: "prism-3d", label: "Prism" },
      { id: "doors-3d", label: "Doors" },
      { id: "rubiks-cube-3d", label: "Puzzle cube" },
      { id: "hourglass-3d", label: "Hourglass" },
      { id: "gyroscope-3d", label: "Gyroscope" },
      { id: "badge-3d", label: "Badge" },
      { id: "pyramid-3d", label: "Pyramid" },
      { id: "helix-3d", label: "Helix" },
      { id: "vault-3d", label: "Vault" },
      { id: "fold-panels-3d", label: "Folding screen" },
      { id: "eight-ball-3d", label: "Magic 8 Ball" },
      { id: "compass-3d", label: "Compass" },
      { id: "tunnel-3d", label: "Tunnel" },
      { id: "pin-art-3d", label: "Pin art" },
      { id: "tile-flip-3d", label: "Tile flip" },
      { id: "image-trail-3d", label: "Image trail" },
      { id: "stack-scroll-3d", label: "Stack scroll" },
      { id: "bar-chart-3d", label: "Bar Chart" },
      { id: "wheel-picker-3d", label: "Wheel Picker" },
      { id: "radial-menu-3d", label: "Radial Menu" },
      { id: "extrude-3d", label: "Extrude" },
      { id: "knob-3d", label: "Knob" },
    ],
  },
  {
    title: "Blocks",
    items: [
      { id: "animated-navbar", label: "Animated Navbar" },
      { id: "hero-section", label: "Hero" },
      { id: "feature-grid", label: "Feature Grid" },
      { id: "feature-tabs", label: "Feature Tabs" },
      { id: "marquee", label: "Marquee" },
      { id: "testimonials", label: "Testimonials" },
      { id: "stats-section", label: "Stats" },
      { id: "timeline-steps", label: "Timeline Steps" },
      { id: "pricing-table", label: "Pricing" },
      { id: "faq-accordion", label: "FAQ" },
      { id: "cta-section", label: "Call to Action" },
      { id: "footer", label: "Footer" },
    ],
  },
];

export const NAV_IDS = NAV.flatMap((g) => g.items.map((i) => i.id));

/** Tracks which section is crossing a band near the top of the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);

  return active;
}
