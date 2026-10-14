// Regenerates every Yakkety asset from src/yakkety.mjs.
//   node scripts/build.mjs          -> SVGs only (no dependencies)
//   node scripts/build.mjs --png    -> SVGs + PNGs + favicon.ico (needs `npm i -D playwright`)
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { STATES, mascotSVG, iconSVG, emojiSVG, avatarSVG, wordmarkSVG, lockupSVG } from "../src/yakkety.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = (p, data) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), data); console.log("wrote", p); };

const emojiName = (s) => (s === "idle" ? "yakkety" : `yakkety-${s}`);
for (const s of STATES) out(`svg/yakkety-${s}.svg`, mascotSVG(s));
for (const s of STATES) out(`emoji/${emojiName(s)}.svg`, emojiSVG(s));
out("icon/yakkety-icon.svg", iconSVG("rounded"));
out("icon/yakkety-icon-square.svg", iconSVG("square"));
out("avatar/yakkety-avatar.svg", avatarSVG("square"));
out("avatar/yakkety-avatar-circle.svg", avatarSVG("circle"));
for (const c of ["toffee", "chocolate", "white"]) out(`wordmark/yakkety-wordmark-${c}.svg`, wordmarkSVG(c));
for (const l of ["horizontal", "stacked"]) for (const bg of ["light", "dark"]) out(`wordmark/yakkety-lockup-${l}-${bg}.svg`, lockupSVG(l, bg));

if (process.argv.includes("--png")) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage();
  const render = async (svgPath, w, h, dest) => {
    const svg = readFileSync(join(root, svgPath), "utf8").replace(/width="[\d.]+" height="[\d.]+"/, `width="${w}" height="${h}"`);
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style>${svg}`);
    const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
    out(dest, png);
    return png;
  };
  for (const size of [16, 32, 48, 64, 128, 180, 192, 256, 512, 1024]) {
    await render("icon/yakkety-icon.svg", size, size, `icon/png/yakkety-icon-${size}.png`);
  }
  for (const size of [180, 512, 1024]) {
    await render("icon/yakkety-icon-square.svg", size, size, `icon/png/yakkety-icon-square-${size}.png`);
  }
  for (const size of [256, 512, 1024]) {
    await render("avatar/yakkety-avatar.svg", size, size, `avatar/yakkety-avatar-${size}.png`);
  }
  const dims = (p) => readFileSync(join(root, p), "utf8").match(/width="([\d.]+)" height="([\d.]+)"/).slice(1).map(Number);
  for (const f of ["wordmark-toffee", "wordmark-chocolate", "wordmark-white", "lockup-horizontal-light", "lockup-horizontal-dark", "lockup-stacked-light", "lockup-stacked-dark"]) {
    const [w, h] = dims(`wordmark/yakkety-${f}.svg`);
    const W = 1600, H = Math.round((h / w) * W);
    await render(`wordmark/yakkety-${f}.svg`, W, H, `wordmark/png/yakkety-${f}.png`);
  }
  for (const s of STATES) await render(`svg/yakkety-${s}.svg`, 840, 848, `png/yakkety-${s}.png`);
  for (const s of STATES) await render(`emoji/${emojiName(s)}.svg`, 128, 128, `emoji/png/${emojiName(s)}.png`);

  // favicon.ico holding 16, 32 and 48px PNGs
  const pngs = [16, 32, 48].map((s) => [s, readFileSync(join(root, `icon/png/yakkety-icon-${s}.png`))]);
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(([s, buf], i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(s, e); header.writeUInt8(s, e + 1); header.writeUInt8(0, e + 2); header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(buf.length, e + 8); header.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  out("icon/favicon.ico", Buffer.concat([header, ...pngs.map(([, b]) => b)]));
  await browser.close();
}
