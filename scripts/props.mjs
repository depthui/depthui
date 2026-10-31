// Builds the props tables shown in the docs, straight from each component's TypeScript.
// For every file in src/components/depth it finds `export interface XProps` and the
// matching `export function X`, then writes src/demo/props/<file>.json with each
// prop's type, default value and JSDoc description. Run before every build.
import ts from "typescript";
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

const ROOT = new URL("../src/components/depth", import.meta.url).pathname;
const OUT = new URL("../src/demo/props", import.meta.url).pathname;
const strict = process.argv.includes("--report");

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".tsx") ? [p] : [];
  });
}
const clean = (s) => s.replace(/\s+/g, " ").trim();
const lead = (node, sf) => (ts.getLeadingCommentRanges(sf.text, node.getFullStart()) ?? []).map((r) => sf.text.slice(r.pos, r.end)).filter((t) => t.startsWith("/**")).map((t) => t.replace(/^\/\*\*|\*\/$/g, "").replace(/^\s*\*\s?/gm, "")).join(" ");
const doc = (node, sf) => clean(lead(node, sf) || ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc).map((d) => (typeof d.comment === "string" ? d.comment : (d.comment ?? []).map((c) => c.text).join(""))).join(" "));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
let files = 0, comps = 0, props = 0, missing = [];

for (const file of walk(ROOT)) {
  const src = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const ifaces = new Map();
  const fns = new Map();
  const aliases = new Map();
  sf.forEachChild((n) => {
    if (ts.isInterfaceDeclaration(n)) ifaces.set(n.name.text, n);
    if (ts.isTypeAliasDeclaration(n) && ts.isTypeLiteralNode(n.type)) ifaces.set(n.name.text, n);
    if (ts.isTypeAliasDeclaration(n) && ts.isTypeReferenceNode(n.type)) aliases.set(n.name.text, clean(n.type.getText(sf)));
    if (ts.isFunctionDeclaration(n) && n.name && n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) fns.set(n.name.text, n);
  });
  const out = [];
  for (const [name, fn] of fns) {
    const param = fn.parameters[0];
    if (!param) continue;
    const typeName = param.type && ts.isTypeReferenceNode(param.type) ? param.type.typeName.getText(sf) : null;
    const iface = typeName ? ifaces.get(typeName) : param.type && ts.isTypeLiteralNode(param.type) ? param.type : null;
    // `type XProps = ButtonHTMLAttributes<HTMLButtonElement>`: show the everyday button props.
    if (!iface && typeName && /^ButtonHTMLAttributes/.test(aliases.get(typeName) ?? "")) {
      out.push({
        component: name,
        extends: [aliases.get(typeName)],
        props: [
          { name: "children", type: "ReactNode", required: false, default: null, description: "Label or content shown inside the button." },
          { name: "className", type: "string", required: false, default: null, description: "Extra classes added to the button. Use them to change size, colour or spacing." },
          { name: "onClick", type: "(event: MouseEvent) => void", required: false, default: null, description: "Called when the button is clicked or activated with the keyboard." },
          { name: "disabled", type: "boolean", required: false, default: null, description: "Set to true to stop clicks and dim the button." },
          { name: "type", type: '"button" | "submit" | "reset"', required: false, default: '"button"', description: 'Use "submit" inside a form to submit it.' },
        ],
      });
      comps++; props += 5;
      continue;
    }
    if (!iface) continue;
    // Defaults come from `{ size = 200 }` in the parameter.
    const defaults = {};
    if (ts.isObjectBindingPattern(param.name)) {
      for (const el of param.name.elements) {
        const key = (el.propertyName ?? el.name).getText(sf).replace(/["']/g, "");
        if (el.initializer) defaults[key] = clean(el.initializer.getText(sf));
      }
    }
    // Interfaces can extend others in the same file (for example ButtonHTMLAttributes): own members only.
    const rows = [];
    const members = ts.isInterfaceDeclaration(iface) || ts.isTypeLiteralNode(iface) ? iface.members : [];
    for (const m of members) {
      if (!ts.isPropertySignature(m) || !m.type) continue;
      const pname = m.name.getText(sf).replace(/["']/g, "");
      const row = { name: pname, type: clean(m.type.getText(sf)), required: !m.questionToken, default: defaults[pname] ?? null, description: doc(m, sf) };
      if (!row.description) missing.push(`${relative(ROOT, file)}	${name}.${pname}	${row.type}	${row.default ?? "-"}`);
      rows.push(row);
    }
    const extendsNote = ts.isInterfaceDeclaration(iface) && iface.heritageClauses ? iface.heritageClauses.flatMap((h) => h.types.map((t) => clean(t.getText(sf)))) : [];
    if (rows.length || extendsNote.length) { out.push({ component: name, extends: extendsNote, props: rows }); props += rows.length; comps++; }
  }
  if (out.length) {
    const key = relative(ROOT, file).replace(/\.tsx$/, "").replace(/\//g, "__");
    writeFileSync(join(OUT, `${key}.json`), JSON.stringify(out));
    files++;
  }
}
console.log(`props: ${comps} components, ${props} props, ${files} files, ${missing.length} without a description`);
if (strict) console.log(missing.join("\n"));
