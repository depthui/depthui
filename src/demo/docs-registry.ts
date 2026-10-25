import { NAV } from "./nav";

/** Which lazy chunk holds a component's docs. */
export type GroupKey = "core" | "buttons" | "cards" | "ui" | "showpieces" | "blocks";

const GROUP_OF: Record<string, GroupKey> = {
  Start: "core",
  Cards: "core",
  Scenes: "core",
  "Controls & text": "core",
  Buttons: "buttons",
  "More cards": "cards",
  "UI elements": "ui",
  "Text & backgrounds": "ui",
  Showpieces: "showpieces",
  Blocks: "blocks",
};

export interface DocEntry {
  id: string;
  label: string;
  /** Sidebar group title. */
  group: string;
  key: GroupKey;
  /** URL segment: /components/<slug>. */
  slug: string;
}

const flat = NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title, key: GROUP_OF[g.title] })));

// "globe-3d" becomes "globe", unless that would clash with another id.
const strip = (id: string) => id.replace(/-3d$/, "");
const taken = new Set(flat.map((e) => e.id));
const counts = new Map<string, number>();
flat.forEach((e) => counts.set(strip(e.id), (counts.get(strip(e.id)) ?? 0) + 1));

export const DOCS: DocEntry[] = flat.map((e) => {
  const base = strip(e.id);
  const clash = base !== e.id && (taken.has(base) || (counts.get(base) ?? 0) > 1);
  return { ...e, slug: base === e.id || clash ? e.id : base };
});

const bySlugMap = new Map(DOCS.map((d) => [d.slug, d]));
const byIdMap = new Map(DOCS.map((d) => [d.id, d]));

/** Find an entry by its URL slug. Old ids (like "globe-3d") work too. */
export const findDoc = (slugOrId: string | undefined) =>
  slugOrId ? bySlugMap.get(slugOrId) ?? byIdMap.get(slugOrId) : undefined;

export const docPath = (e: DocEntry) => `/components/${e.slug}`;
export const docIndex = (e: DocEntry) => DOCS.findIndex((d) => d.id === e.id);
