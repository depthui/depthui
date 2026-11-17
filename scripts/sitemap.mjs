// Writes public/sitemap.xml from the docs nav, so every component page is listed.
// Run automatically before `npm run build`.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const SITE = process.env.SITE_URL ?? "https://depthui.vercel.app";
const nav = readFileSync(new URL("../src/demo/nav.ts", import.meta.url), "utf8");
const ids = [...nav.matchAll(/id:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);

// Same rule as src/demo/docs-registry.ts: "globe-3d" becomes "globe" unless that clashes.
const strip = (id) => id.replace(/-3d$/, "");
const taken = new Set(ids);
const counts = new Map();
ids.forEach((id) => counts.set(strip(id), (counts.get(strip(id)) ?? 0) + 1));
const slugs = ids.map((id) => {
  const base = strip(id);
  const clash = base !== id && (taken.has(base) || counts.get(base) > 1);
  return base === id || clash ? id : base;
});

// Use the date of the latest commit, so lastmod only changes when the site does.
// (A lastmod that changes on every build teaches Google to ignore it.)
let today = new Date().toISOString().slice(0, 10);
try { today = execSync("git log -1 --format=%cs", { cwd: new URL("..", import.meta.url).pathname }).toString().trim() || today; } catch {}
const guides = JSON.parse(readFileSync(new URL("../src/guides/guides.json", import.meta.url), "utf8"));
const url = (path, pri) => `  <url><loc>${SITE}${path}</loc><lastmod>${today}</lastmod><priority>${pri}</priority></url>`;
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[url("/", "1.0"), url("/components", "0.9"), url("/guides", "0.8"), ...guides.map((g) => url(`/guides/${g.slug}`, "0.8")), ...slugs.map((s) => url(`/components/${s}`, "0.7"))].join("\n")}
</urlset>
`;
writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`sitemap.xml: ${slugs.length + 2} urls`);
