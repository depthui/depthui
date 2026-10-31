// Runs after `vite build`. Writes a real HTML file for every route, so crawlers
// and link previews get a proper title, description, canonical link, structured
// data and readable text without running any JavaScript. React replaces the
// static text as soon as the app loads, so visitors never see it.
//   dist/index.html                      home
//   dist/components.html                 component list
//   dist/components/<slug>.html          one per component
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SITE = (process.env.SITE_URL ?? "https://depthui.vercel.app").replace(/\/$/, "");
const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");

// ---- Read the docs structure from source, so this never goes stale ----
const nav = readFileSync(join(root, "src/demo/nav.ts"), "utf8");
const groups = [];
for (const line of nav.split("\n")) {
  const g = line.match(/^\s*title:\s*"([^"]+)"/);
  if (g) groups.push({ title: g[1], items: [] });
  for (const m of line.matchAll(/\{\s*id:\s*"([a-z0-9-]+)",\s*label:\s*"([^"]+)"\s*\}/g)) groups.at(-1)?.items.push({ id: m[1], label: m[2] });
}
const strip = (id) => id.replace(/-3d$/, "");
const all = groups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })));
const taken = new Set(all.map((e) => e.id));
const counts = new Map();
all.forEach((e) => counts.set(strip(e.id), (counts.get(strip(e.id)) ?? 0) + 1));
for (const e of all) {
  const base = strip(e.id);
  const clash = base !== e.id && (taken.has(base) || counts.get(base) > 1);
  e.slug = base === e.id || clash ? e.id : base;
}
const docs = all;

// Short descriptions come from each Showcase's `blurb`.
const blurbs = new Map();
for (const f of readdirSync(join(root, "src/demo")).filter((f) => f.endsWith(".tsx"))) {
  const s = readFileSync(join(root, "src/demo", f), "utf8");
  for (const m of s.matchAll(/id="([a-z0-9-]+)"\s+title="([^"]+)"\s+blurb="([^"]*)"/g)) blurbs.set(m[1], m[3]);
}
// Props tables come from scripts/props.mjs output.
const propsDir = join(root, "src/demo/props");
const propFiles = new Set(existsSync(propsDir) ? readdirSync(propsDir) : []);
function propsFor(id) {
  for (const k of [id, `ui__${id}`, `showpieces__${id}`, `buttons__${id}`, `cards__${id}`, `blocks__${id}`]) {
    if (propFiles.has(`${k}.json`)) return JSON.parse(readFileSync(join(propsDir, `${k}.json`), "utf8"));
  }
  return [];
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const trim = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…");

const nameOf = (e) => e.label;
const links = () =>
  groups
    .map((g) => `<h3>${esc(g.title)}</h3><ul>${g.items.map((i) => { const e = all.find((x) => x.id === i.id); return `<li><a href="${SITE}/components/${e.slug}">${esc(i.label)}</a></li>`; }).join("")}</ul>`)
    .join("");

function page({ path, title, description, body, crumbs, type = "WebPage" }) {
  const url = SITE + path;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  const ld = [{ "@context": "https://schema.org", "@type": type, name: title, description, url, isPartOf: { "@type": "WebSite", name: "Depth UI", url: SITE + "/" } }];
  if (crumbs) ld.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: SITE + c[1] })) });
  html = html.replace("</head>", `${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n    ")}\n  </head>`);
  // Crawler-readable text, clipped out of view. React replaces it on load.
  html = html.replace('<div id="root"></div>', `<div id="root"><div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">${body}</div></div>`);
  // Flat files (components/kanban.html) work with Vercel `cleanUrls` and GitHub Pages alike.
  const file = path === "/" ? join(dist, "index.html") : join(dist, `${path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const KW = "CSS 3D, Tailwind CSS v4 and Framer Motion, no WebGL";
const count = all.length;

// Home
page({
  path: "/",
  title: "Depth UI: Free Copy-Paste 3D React Components (CSS 3D, Tailwind, Framer Motion)",
  description: `Free, open-source library of ${Math.floor(count / 10) * 10}+ copy-paste 3D React components: tilt cards, carousels, kanban, forms and more. CSS 3D, Tailwind v4, Framer Motion. No WebGL.`,
  body: `<h1>Depth UI: free copy-paste 3D React components</h1><p>Depth UI is an open-source React component library built with ${KW}. Copy the source into your project and own every line. Light and dark themes are built in.</p><p><a href="https://github.com/depthui/depthui">View the source on GitHub</a>. <a href="${SITE}/components">Browse all ${count} components</a>.</p><h2>All components</h2>${links()}`,
  type: "WebSite",
});

// Component list
page({
  path: "/components",
  title: "All 3D React Components: Cards, Carousels, Kanban, Forms · Depth UI",
  description: `Browse ${count} free copy-paste React components with live previews, usage code, full source and props tables. ${KW}.`,
  body: `<h1>All Depth UI components</h1>${links()}`,
  crumbs: [["Home", "/"], ["Components", "/components"]],
});

// One page per component
let n = 0;
for (const e of docs) {
  const blurb = blurbs.get(e.id) ?? `${e.label} from the ${e.group} group of Depth UI.`;
  const props = propsFor(e.id);
  const guide = e.id === "getting-started" || e.id === "theme";
  const title = guide ? `${e.label}: Install and Use Depth UI 3D React Components` : `${e.label}: Free Copy-Paste 3D React Component · Depth UI`;
  const first = blurb.split(/(?<=\.)\s/)[0];
  const description = trim(`${e.label}: ${first} Free, open source, with live preview, usage and source.`, 158);
  const propsHtml = props
    .map(
      (c) =>
        `<h3>${esc(c.component)} props</h3><table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>${c.props
          .map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.type)}</td><td>${esc(p.default ?? "")}</td><td>${esc(p.description)}</td></tr>`)
          .join("")}</tbody></table>`,
    )
    .join("");
  page({
    path: `/components/${e.slug}`,
    title,
    description,
    body: `<nav><a href="${SITE}/">Depth UI</a> / <a href="${SITE}/components">Components</a> / ${esc(e.group)}</nav><h1>${esc(nameOf(e))}</h1><p>${esc(blurb)}</p><p>Install it the shadcn way: copy the source file into your project. It uses ${KW}.</p>${propsHtml}<h2>More components</h2>${links()}`,
    crumbs: [["Home", "/"], ["Components", "/components"], [e.label, `/components/${e.slug}`]],
  });
  n++;
}
console.log(`prerender: ${n + 2} pages written`);
