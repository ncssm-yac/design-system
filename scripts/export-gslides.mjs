// Turns a Claude Slides deck (project/deck.json + project/slides/*.html) into Google Slides batchUpdate requests.
//
//   node scripts/export-gslides.mjs --deck <dir holding project/> --page 12192000x6858000 --out <dir> [--layout <blank layout id>] [--chunk <bytes>] [--only id,id] [--png <dir>]
//
// Each slide is rendered in headless Chromium at 1920 x 1080 and every painted box, rule and text block is
// measured, so the Google Slides copy matches what was reviewed. Writes to --out:
//   chunk-NN.json     requests for update_presentation, about 16 KB each (--chunk N changes it), split between shapes.
//                     Send them in order, unchanged; together they build every slide (slide ids are slide01, slide02 ...).
//   plan.json         { slides: [{ id, key, notes }], chunks: [{ file, requests, bytes }] }
//   notes.json        [{ key, text }]  speaker notes to insert once the slides exist
// With --png it also saves a PNG of each slide, handy for checking a build without opening Slides.
//
// Known limits of the Slides API: no letter-spacing, no per-corner radii, no box-shadows or gradients, and images need a
// public URL, so a photo or QR frame becomes a labelled placeholder to replace in Slides.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => (v.startsWith("--") ? [...a, [v.slice(2), all[i + 1]]] : a), []));
if (!args.deck || !args.out) {
  console.error("usage: node scripts/export-gslides.mjs --deck <dir> --out <dir> [--page 12192000x6858000] [--layout <blank layout id>] [--chunk <bytes>] [--only <slide ids>] [--png <dir>]");
  process.exit(1);
}
const [PAGE_W, PAGE_H] = (args.page || "12192000x6858000").split("x").map(Number);
const EMU = PAGE_W / 1920; // EMU per canvas px
const PT = PAGE_W / 12700 / 1920; // pt per canvas px
const INSET_X = 91440; // Slides' default text-box insets
const INSET_Y = 45720;

function loadPlaywright() {
  const require = createRequire(import.meta.url);
  try { return require("playwright"); } catch {}
  const root = execSync("npm root -g", { encoding: "utf8" }).trim();
  return createRequire(join(root, "x.js"))("playwright");
}
const { chromium } = loadPlaywright();

const deckDir = resolve(args.deck);
const deck = JSON.parse(readFileSync(join(deckDir, "project/deck.json"), "utf8"));
mkdirSync(args.out, { recursive: true });
if (args.png) mkdirSync(args.png, { recursive: true });

const FONT_LINK = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600&display=swap">`;
const RESET = `<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1920px;height:1080px;overflow:hidden}section{position:relative;width:1920px;height:1080px;overflow:hidden}aside{display:none}p,h1,h2,h3{font-weight:inherit}</style>`;

// Runs inside the page: returns the painted pieces of the one <section>, in paint order.
function extractSlide() {
  const sec = document.querySelector("section");
  const sr = sec.getBoundingClientRect();
  const num = (v) => parseFloat(v) || 0;
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(/[,/ ]+/).filter(Boolean).map(Number);
    return a === 0 ? null : { r, g, b, a };
  };
  const bgOf = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c && c.a === 1) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const opacityOf = (el) => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) o *= num(getComputedStyle(e).opacity || 1); return o; };
  const mix = (c, bg, o) => ({ r: Math.round(c.r * o + bg.r * (1 - o)), g: Math.round(c.g * o + bg.g * (1 - o)), b: Math.round(c.b * o + bg.b * (1 - o)), a: 1 });
  const rel = (r) => ({ x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height });
  const items = [];
  const notes = sec.querySelector("aside")?.innerText.trim() || "";

  const runsOf = (el, root) => {
    const out = [];
    const visit = (node, cs) => {
      if (node.nodeType === 3) {
        let t = node.textContent.replace(/\s+/g, " ");
        const tt = cs.textTransform;
        if (tt === "uppercase") t = t.toUpperCase(); else if (tt === "lowercase") t = t.toLowerCase();
        if (t) out.push({ text: t, cs });
      } else if (node.nodeType === 1) {
        if (node.tagName === "BR") { out.push({ text: "\n", cs }); return; }
        const ncs = getComputedStyle(node);
        for (const k of node.childNodes) visit(k, ncs);
      }
    };
    for (const k of el.childNodes) visit(k, getComputedStyle(el));
    // trim spaces at line starts and ends
    let text = out.map((r) => r.text).join("");
    return out.map((r, i) => {
      let t = r.text;
      if (i === 0 || out[i - 1].text === "\n") t = t.replace(/^ +/, "");
      if (i === out.length - 1 || out[i + 1]?.text === "\n") t = t.replace(/ +$/, "");
      return { ...r, text: t };
    }).filter((r) => r.text !== "");
  };

  const hasOwnText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const TEXT_TAGS = new Set(["H1", "H2", "H3", "P", "LI"]);

  const walk = (el) => {
    for (const child of el.children) {
      if (child.tagName === "ASIDE") continue;
      const cs = getComputedStyle(child);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const r = rel(child.getBoundingClientRect());
      const op = opacityOf(child);
      const parentBg = bgOf(child.parentElement);
      const bg = parse(cs.backgroundColor);
      const widths = ["Top", "Right", "Bottom", "Left"].map((s) => num(cs[`border${s}Width`]) * (cs[`border${s}Style`] === "none" ? 0 : 1));
      const colors = ["Top", "Right", "Bottom", "Left"].map((s) => parse(cs[`border${s}Color`]));
      const radiusOf = (v) => (String(v).includes("%") ? (num(v) / 100) * Math.min(r.w, r.h) : num(v));
      const radius = Math.max(...["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map((s) => radiusOf(cs[`border${s}Radius`])));
      if (child.tagName === "IMG") {
        items.push({ kind: "img", ...r, alt: child.getAttribute("alt") || "", radius });
        continue;
      }
      if (bg || widths.some((w) => w > 0)) {
        items.push({
          kind: "box", ...r, radius, op,
          fill: bg ? { ...bg, a: bg.a * op } : null,
          widths, colors, styles: ["Top", "Right", "Bottom", "Left"].map((s) => cs[`border${s}Style`]),
        });
      }
      if (TEXT_TAGS.has(child.tagName) || (child.tagName === "DIV" && hasOwnText(child))) {
        const runs = runsOf(child);
        if (runs.length) {
          const bgc = bg ? { ...bg, a: 1 } : parentBg;
          const pad = ["Top", "Right", "Bottom", "Left"].map((s) => num(cs[`padding${s}`]) + num(cs[`border${s}Width`]));
          items.push({
            kind: "text", x: r.x + pad[3], y: r.y + pad[0], w: r.w - pad[1] - pad[3], h: r.h - pad[0] - pad[2],
            align: cs.textAlign === "start" ? "left" : cs.textAlign === "end" ? "right" : cs.textAlign,
            lineHeight: cs.lineHeight === "normal" ? 0 : num(cs.lineHeight) / num(cs.fontSize),
            runs: runs.map((u) => {
              const c = parse(u.cs.color) || { r: 0, g: 0, b: 0, a: 1 };
              const o = op * c.a;
              return {
                text: u.text, size: num(u.cs.fontSize), weight: num(u.cs.fontWeight) || 400, italic: u.cs.fontStyle === "italic",
                color: o < 1 ? mix(c, bgc, o) : c, underline: u.cs.textDecorationLine.includes("underline"),
              };
            }),
          });
        }
        continue; // text blocks have no further painted children
      }
      walk(child);
    }
  };
  walk(sec);
  return { background: parse(getComputedStyle(sec).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 }, items, notes };
}

const r3 = (v) => Math.round((v / 255) * 1000) / 1000;
const rgb = (c) => ({ red: r3(c.r), green: r3(c.g), blue: r3(c.b) });
const emu = (v) => Math.round(v * EMU);
const fillOf = (c) => ({ solidFill: { color: { rgbColor: rgb(c) }, alpha: c.a ?? 1 } });
const weightFamily = (w) => ({ fontFamily: "Montserrat", weight: w >= 700 ? 700 : w >= 600 ? 600 : w >= 500 ? 500 : 400 });

function buildRequests(slideId, data) {
  const reqs = [];
  const marks = [0]; // start index of each unit (one slide setup or one shape with its styling)
  let n = 0;
  const id = () => { marks.push(reqs.length); return `${slideId}_${String(++n).padStart(3, "0")}`; };
  const place = (x, y, w, h) => ({
    pageObjectId: slideId,
    size: { width: { magnitude: emu(w), unit: "EMU" }, height: { magnitude: emu(h), unit: "EMU" } },
    transform: { scaleX: 1, scaleY: 1, translateX: emu(x), translateY: emu(y), unit: "EMU" },
  });
  const rect = (x, y, w, h, fill, shapeType = "RECTANGLE", outline = null) => {
    const oid = id();
    reqs.push({ createShape: { objectId: oid, shapeType, elementProperties: place(x, y, w, h) } });
    const props = { shapeBackgroundFill: fill ? fillOf(fill) : { propertyState: "NOT_RENDERED" } };
    props.outline = outline
      ? { outlineFill: fillOf(outline.color), weight: { magnitude: outline.width * PT, unit: "PT" }, dashStyle: outline.dash || "SOLID" }
      : { propertyState: "NOT_RENDERED" };
    reqs.push({ updateShapeProperties: { objectId: oid, shapeProperties: props, fields: "shapeBackgroundFill,outline" } });
    return oid;
  };
  const textBox = (x, y, w, h, align, lineHeight, runs, anchor = "TOP") => {
    const oid = id();
        // widen on the side opposite the alignment so Slides never wraps earlier than Chromium did
    const grow = Math.max(8, w * 0.03);
    let bx = x, bw = w + grow;
    if (align === "right") { bx = x - grow; bw = w + grow; } else if (align === "center") { bx = x - grow / 2; bw = w + grow; }
    reqs.push({
      createShape: {
        objectId: oid, shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: { width: { magnitude: emu(bw) + 2 * INSET_X, unit: "EMU" }, height: { magnitude: emu(h) + 2 * INSET_Y, unit: "EMU" } },
          transform: { scaleX: 1, scaleY: 1, translateX: emu(bx) - INSET_X, translateY: emu(y) - INSET_Y, unit: "EMU" },
        },
      },
    });
    // fold line breaks into the run before them, then merge neighbours that share a style
    const key = (r) => [r.size, r.weight, r.italic, r.underline, r.color.r, r.color.g, r.color.b].join("|");
    const merged = [];
    for (const r of runs) {
      const last = merged[merged.length - 1];
      if (r.text === "\n" && last) last.text += "\n";
      else if (last && key(last) === key(r)) last.text += r.text;
      else merged.push({ ...r });
    }
    runs = merged;
    const full = runs.map((r) => r.text).join("");
    reqs.push({ insertText: { objectId: oid, text: full, insertionIndex: 0 } });
    let at = 0;
    for (const r of runs) {
      {
        const style = {
          weightedFontFamily: weightFamily(r.weight), fontSize: { magnitude: Math.round(r.size * PT * 10) / 10, unit: "PT" },
          foregroundColor: { opaqueColor: { rgbColor: rgb(r.color) } },
        };
        const fields = ["weightedFontFamily", "fontSize", "foregroundColor"];
        if (r.weight >= 700) { style.bold = true; fields.push("bold"); }
        if (r.italic) { style.italic = true; fields.push("italic"); }
        if (r.underline) { style.underline = true; fields.push("underline"); }
        reqs.push({ updateTextStyle: { objectId: oid, textRange: { type: "FIXED_RANGE", startIndex: at, endIndex: at + r.text.length }, style, fields: fields.join(",") } });
      }
      at += r.text.length;
    }
    const pct = lineHeight ? Math.round((lineHeight / 1.219) * 1000) / 10 : 100;
    reqs.push({
      updateParagraphStyle: {
        objectId: oid, textRange: { type: "ALL" },
        style: { alignment: { left: "START", center: "CENTER", right: "END", justify: "JUSTIFIED" }[align] || "START", lineSpacing: pct },
        fields: "alignment,lineSpacing",
      },
    });
    if (anchor !== "TOP") reqs.push({ updateShapeProperties: { objectId: oid, shapeProperties: { contentAlignment: anchor }, fields: "contentAlignment" } });
    return oid;
  };

  reqs.unshift(
    { createSlide: { objectId: slideId, slideLayoutReference: args.layout ? { layoutId: args.layout } : { predefinedLayout: "BLANK" } } },
    { updatePageProperties: { objectId: slideId, pageProperties: { pageBackgroundFill: fillOf(data.background) }, fields: "pageBackgroundFill.solidFill.color" } },
  );

  for (const it of data.items) {
    if (it.kind === "img") {
      const box = rect(it.x, it.y, it.w, it.h, { r: 232, g: 236, b: 241, a: 1 }, it.radius >= Math.min(it.w, it.h) / 2 * 0.9 ? "ELLIPSE" : "RECTANGLE", { color: { r: 201, g: 211, b: 224, a: 1 }, width: 3, dash: "DASH" });
      textBox(it.x + 24, it.y + it.h / 2 - 20, it.w - 48, 40, "center", 0, [{ text: `[${it.alt || "Photo"} — add in Slides]`, size: 24, weight: 500, italic: false, color: { r: 90, g: 104, b: 120, a: 1 }, underline: false }]);
      continue;
    }
    if (it.kind === "box") {
      const [bt, br, bb, bl] = it.widths;
      const uniform = it.widths.every((w) => w === it.widths[0] && w > 0) && it.colors.every((c) => c && c.r === it.colors[0].r && c.g === it.colors[0].g && c.b === it.colors[0].b);
      const minSide = Math.min(it.w, it.h);
      const ratio = it.radius / (minSide || 1);
      const shapeType = ratio >= 0.45 ? (it.w / it.h < 1.15 && it.w / it.h > 0.87 ? "ELLIPSE" : "ROUND_RECTANGLE") : ratio >= 0.1 && it.radius > 0 ? "ROUND_RECTANGLE" : "RECTANGLE";
      if (it.fill || uniform) {
        const dash = it.styles[0] === "dashed" ? "DASH" : it.styles[0] === "dotted" ? "DOT" : "SOLID";
        rect(it.x, it.y, it.w, it.h, it.fill, shapeType, uniform ? { color: { ...it.colors[0], a: 1 }, width: it.widths[0], dash } : null);
      }
      if (!uniform) {
        const side = (w, c, x, y, rw, rh) => { if (w > 0 && c) rect(x, y, rw, rh, { ...c, a: c.a }, "RECTANGLE"); };
        side(bt, it.colors[0], it.x, it.y, it.w, bt);
        side(bb, it.colors[2], it.x, it.y + it.h - bb, it.w, bb);
        side(bl, it.colors[3], it.x, it.y, bl, it.h);
        side(br, it.colors[1], it.x + it.w - br, it.y, br, it.h);
      }
      continue;
    }
    if (it.kind === "text") textBox(it.x, it.y, it.w, it.h, it.align, it.lineHeight, it.runs);
  }
  const units = [];
  for (let i = 0; i < marks.length; i++) {
    const end = i + 1 < marks.length ? marks[i + 1] : reqs.length;
    if (end > marks[i]) units.push(reqs.slice(marks[i], end));
  }
  return units;
}

import { existsSync, readdirSync } from "node:fs";
// Use CHROMIUM_PATH, then a Chromium under /opt/pw-browsers (cloud sessions), then Playwright's own browser.
const bundled = existsSync("/opt/pw-browsers")
  ? readdirSync("/opt/pw-browsers").filter((d) => d.startsWith("chromium-")).map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`).find(existsSync)
  : undefined;
const executablePath = process.env.CHROMIUM_PATH || bundled;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const plan = { slides: [], chunks: [] };
const MAX = Number(args.chunk || 16000); // bytes per update_presentation call
let chunk = [], size = 0, chunkNo = 0;
const flush = () => {
  if (!chunk.length) return;
  const name = `chunk-${String(++chunkNo).padStart(2, "0")}.json`;
  writeFileSync(join(args.out, name), JSON.stringify(chunk));
  plan.chunks.push({ file: name, requests: chunk.length, bytes: size });
  chunk = []; size = 0;
};

const only = args.only ? new Set(args.only.split(",")) : null; // slide ids to export; keys keep their deck position
for (const [i, sid] of deck.order.entries()) {
  if (only && !only.has(sid)) continue;
  const file = join(deckDir, "project/slides", `${sid}.html`);
  const html = readFileSync(file, "utf8");
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8">${FONT_LINK}${RESET}</head><body>${html}</body></html>`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const data = await page.evaluate(extractSlide);
  const key = `slide${String(i + 1).padStart(2, "0")}`;
  const units = buildRequests(key, data);
  for (const u of units) {
    const len = JSON.stringify(u).length;
    if (size && size + len > MAX) flush();
    chunk.push(...u); size += len;
  }
  plan.slides.push({ id: sid, key, notes: data.notes });
  if (args.png) await page.screenshot({ path: join(args.png, `${String(i + 1).padStart(2, "0")}-${sid}.png`) });
}
flush();
await browser.close();
writeFileSync(join(args.out, "plan.json"), JSON.stringify(plan, null, 1));
writeFileSync(join(args.out, "notes.json"), JSON.stringify(plan.slides.filter((s) => s.notes).map((s) => ({ key: s.key, text: s.notes })), null, 1));
console.log(`wrote ${plan.slides.length} slides in ${plan.chunks.length} chunks to ${args.out}`);
for (const c of plan.chunks) console.log(`  ${c.file}  ${c.requests} requests  ${c.bytes} bytes`);
