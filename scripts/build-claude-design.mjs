// Builds the Claude Design "Design System" files from this repo, ready to publish.
//   node scripts/build-claude-design.mjs [outDir]     (default: dist/claude-design)
//   -> <outDir>/project/design-system.json, tokens.json, README.md, components/*
//
// The published system: https://claude.ai/artifact/UtzAMSDiAoCHeSE4cxQZ8T
// Images live in that system's asset store; ASSETS below holds their upload ids.
// If you add or replace an image, upload it to the system first and record its id here.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = process.argv[2] || join(root, "dist/claude-design");
const read = (p) => readFileSync(join(root, p), "utf8");
const json = (p) => JSON.parse(read(p));
const out = (p, data) => { const f = join(outDir, "project", p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, data); };

const C = json("color/tokens.json").color;
const T = json("typography/tokens.json");
const S = json("slides/tokens.json");
const Y = json("yakkety-mascot/tokens.json").color.yakkety;
const FONT_LINK = `<link rel="stylesheet" href="${T.font.family.sans.href}">`;

// ---------- tokens.json ----------
const colorTokens = [];
for (const group of ["brand", "neutral", "dark", "ncssm"]) {
  for (const [name, t] of Object.entries(C[group])) {
    const pantone = t.pantone ? ` Pantone ${t.pantone}.` : "";
    colorTokens.push({ name, value: t.value.replace(/\s+/g, ""), usage: t.usage + pantone });
  }
}
for (const name of ["toffee", "toffee-dark", "apricot", "cream-tile"]) {
  colorTokens.push({ name: `yakkety-${name}`, value: Y[name].value, usage: `Yakkety mascot only: ${Y[name].usage}` });
}

const px = (v) => (typeof v === "number" ? `${v}px` : v);
const style = (name, t, extra = {}) => ({
  name, fontSize: px(t.size), lineHeight: t.lineHeight, fontWeight: t.weight,
  ...(t.letterSpacing && t.letterSpacing !== "0" ? { letterSpacing: t.letterSpacing } : {}),
  ...(t.style === "italic" ? { fontStyle: "italic" } : {}),
  usage: t.usage ? t.usage + (t.transform === "uppercase" ? " Uppercase." : "") : (t.transform === "uppercase" ? "Uppercase." : undefined),
  ...extra,
});
const samples = {
  stat: "300 → 680", divider: "NCSSM Online", cover: "Wednesday, October 7", statement: "Plan a fall outing with your family",
  title: "Shape of tonight", number: "01", quote: "“Prototyper Extraordinaire.”", lead: "8:15–9:15 PM",
  "body-large": "Foundation Reception, Fri Oct 16", panel: "How should young alums take part?", body: "Get Claude Code running on your laptop",
  "card-title": "The Fairies", secondary: "Open to anyone, one license left", eyebrow: "GROWING THE YAC", label: "ANNOUNCEMENTS",
  "label-small": "KICK OFF", footer: "Akhil · 07",
};
const slideStyles = Object.entries(T.type.slide).map(([n, t]) => style(`slide-${n}`, t, { sample: samples[n] }));
const webStyles = Object.entries(T.type.web).map(([n, t]) => style(`web-${n}`, t, { usage: "Web scale: derived from the slide scale, not yet used in a shipped page." + (t.transform === "uppercase" ? " Uppercase." : "") }));

const tokens = {
  name: "NCSSM YAC Design System",
  version: 1,
  meta: { source: "github.com/ncssm-yac/design-system (color/, typography/, slides/ tokens.json)" },
  color: { themes: [{ id: "light", name: "Deck" }], tokens: colorTokens },
  type: {
    fonts: [],
    families: { sans: T.font.family.sans.value, serif: T.font.family.serif.value },
    groups: [
      { name: "Slide (1920 × 1080)", family: "sans", styles: slideStyles },
      { name: "Web", family: "sans", styles: webStyles },
    ],
  },
  spacing: {
    tokens: [
      ...Object.entries(S.space).map(([n, t]) => ({ name: `space-${n}`, value: px(t.value), usage: t.usage || "Spacing step." })),
      { name: "slide-padding", value: "128px", usage: "Margin on every side of a 1920 × 1080 slide (160px at the bottom when it has a footer)." },
      { name: "footer-inset", value: "64px", usage: "Distance from the slide's bottom edge to the pinned footer line." },
    ],
  },
  radius: {
    tokens: [
      { name: "radius-card", value: "16px", usage: S.radius.card.usage + " Ruled cards use it on the bottom corners only." },
      { name: "radius-tile", value: "12px", usage: S.radius.tile.usage },
      { name: "radius-bar", value: "8px", usage: "Top corners of chart bars." },
      { name: "radius-pill", value: "999px", usage: "Pills and tags." },
    ],
  },
  shadow: {
    tokens: Object.entries(C.effect).map(([n, t]) => ({ name: n, value: t.value.replace(/\s*,\s*/g, ","), usage: t.usage })),
  },
  borderWidth: {
    tokens: [
      { name: "border-accent", value: "6px", usage: S.border.accent.usage },
      { name: "border-hairline", value: "2px", usage: "Hairlines (Mist) and outlined-card borders (Fog)." },
      { name: "border-placeholder", value: "3px", usage: "Dashed Mist frame on placeholders." },
    ],
  },
  opacity: {
    tokens: Object.entries(C.opacity).map(([n, t]) => ({ name: `opacity-${n}`, value: String(t.value), usage: t.usage })),
  },
};
out("tokens.json", JSON.stringify(tokens, null, 2) + "\n");

// ---------- previews ----------
// Previews use var(--token, fallback) so they render before the page has compiled tokens.css.
const v = (name) => {
  const t = colorTokens.find((c) => c.name === name);
  return `var(--${name}, ${t.value})`;
};
const BASE = `<style>
html,body{margin:0;background:${v("paper")}}
.stage{font-family:Montserrat,Verdana,sans-serif;color:${v("midnight")}}
.stage *{margin:0;box-sizing:border-box}
.stage aside{display:none}
</style>`;

const marker = (group, height, subtitle) => `<!-- @dsCard group="${group}" height=${height} subtitle="${subtitle}" -->`;

// Slide templates: each 1920 x 1080 section drawn at half size.
const TEMPLATES = [
  ["cover", "CoverSlide", "Cover", "Eyebrow, big date, time, and a ruled block for the opener. Blue."],
  ["agenda", "AgendaSlide", "Agenda", "Numbered columns with 6px top rules; the current section in Orange. Paper."],
  ["divider", "DividerSlide", "Section divider", "Eyebrow and a 144px section name, centred vertically. Blue."],
  ["divider-photo", "PhotoDividerSlide", "Photo divider", "The divider over a full-bleed photo, text at the bottom. Blue."],
  ["announcements", "AnnouncementsSlide", "Announcements", "Three label-and-line items beside Orange left rules. Paper."],
  ["statement", "StatementSlide", "Statement", "A sentence headline, numbered outlined cards and one Blue key-date card. Paper."],
  ["two-column", "TwoColumnSlide", "Two columns", "Two ruled columns and a Blue Discuss panel. Paper."],
  ["stat-chart", "StatChartSlide", "Stat and chart", "One huge number beside a simple bar chart. Paper."],
  ["photo-grid", "PhotoGridSlide", "Photo grid", "Six photo tiles and a dot-and-date caption. Midnight."],
  ["catalyst-tease", "CatalystTeaseSlide", "Catalyst tease", "The Catalyst: a glowing Orange dot, no name yet. Midnight."],
  ["catalyst-reveal", "CatalystRevealSlide", "Catalyst reveal", "The dot grows into the member's photo; name and tagline build in. Midnight."],
  ["closing", "ClosingSlide", "Before we go", "Orange-ruled cards and a Blue card for the next meeting. Paper."],
];
const WHEN = {
  CoverSlide: "Use it as the first slide; it doubles as the opener while people join. Fill the eyebrow with the meeting name, the title with the date, the lead with the time, and the bottom block with the opener prompt.",
  AgendaSlide: "Use it second. One column per section of the night, numbered 01–05; colour the current or first section Orange and the rest Blue. Never put times on the slide; the run of show goes in the notes.",
  DividerSlide: "Use it before each section. The eyebrow names the part of the agenda; the title names the topic.",
  PhotoDividerSlide: "Use it instead of the plain divider when you have a strong photo. Replace the Blue Deep frame with an uploaded image (object-fit: cover) and keep the text on top.",
  AnnouncementsSlide: "Use it for three or four short items. Each is a label, one line, and an optional Slate line saying who to ask. For four items use two columns (grid 1fr 1fr, gap 64px).",
  StatementSlide: "Use it when the slide makes one point and has a few steps. The headline is a full sentence; the last card can be Blue for the one date or fact to remember.",
  TwoColumnSlide: "Use it for a timeline next to open questions, followed by a question for the room. Dates are bold 36px Orange; below 36px use Orange deep.",
  StatChartSlide: "Use it when one number is the story. Bars are Blue tint; the bar that matters is Blue, its value in Orange deep. Bar heights are proportional (the tallest is 360px). Put the source and raw values in the notes.",
  PhotoGridSlide: "Use it for event recaps. Replace each tile with an img (object-fit: cover, 12px corners).",
  CatalystTeaseSlide: "Use it as the second-last section of a biweekly: the member recognition. No name on this slide. It uses data-transition=\"magic\" so #catalyst-dot grows into the reveal.",
  CatalystRevealSlide: "Follows the tease. Put the member's headshot in the circle; the lines build in one at a time.",
  ClosingSlide: "Use it as the last slide (“Before we go”); nothing comes after it. White cards with an Orange top rule for asks and dates, one Blue card for the next meeting. QR codes go at the bottom of a card (200 × 200, object-fit: contain), URLs in the notes.",
};
for (const [file, comp, label, subtitle] of TEMPLATES) {
  const section = read(`slides/templates/${file}.html`).trim();
  const staged = section.replace(/<section /, '<section class="slide" ');
  out(`components/${comp}/preview.html`, `${marker("Slide templates", 540, subtitle)}
${FONT_LINK}
${BASE}
<style>
.frame{width:960px;height:540px;overflow:hidden}
.scale{width:1920px;height:1080px;transform:scale(.5);transform-origin:0 0}
.slide{position:relative;width:1920px;height:1080px;overflow:hidden}
.slide>*:not([style*="position:absolute"]){position:relative}
</style>
<div class="stage frame"><div class="scale">
${staged}
</div></div>
`);
  out(`components/${comp}/README.md`, `# ${comp}

The ${label.toLowerCase()} slide of a YAC deck, on Claude Design's 1920 × 1080 canvas. ${subtitle}

${WHEN[comp]}

Copy the markup below into \`project/slides/<id>.html\` of a Claude Design deck and set the section's \`id\` to the slide id. Replace every \`[bracketed]\` placeholder with real content or leave it bracketed with an owner (\`[Lily — one-line update]\`); never invent figures or names. The \`<aside>\` is the speaker notes. Claude Design slides take inline styles only, so the colours are hex values of the tokens (Blue \`#346094\`, Orange \`#d57e00\`, Midnight \`#1c2633\`, Paper \`#f7f5f0\`, Slate \`#5a6878\`).

\`\`\`html
${section}
\`\`\`
`);
}

// Slide pieces: the building blocks the templates repeat.
const PIECES = [
  {
    name: "Eyebrow", sub: "Orange dot plus an uppercase section label, above a title.",
    html: `<div style="display:flex;flex-direction:column;gap:32px;padding:48px">
  <div style="display:flex;flex-direction:row;align-items:center;gap:20px">
    <div style="width:20px;height:20px;background:#d57e00;border-radius:50%"></div>
    <p style="font-size:26px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#346094">Growing the YAC</p>
  </div>
  <div style="display:flex;flex-direction:row;align-items:center;gap:20px;background:#346094;padding:32px">
    <div style="width:24px;height:24px;background:#d57e00;border-radius:50%"></div>
    <p style="font-size:26px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#f7f5f0">YAC Biweekly</p>
  </div>
</div>`,
    guide: "Put it directly above a title or statement, 24px above it. The dot is 20px on Paper (label in `blue`) and 24px on Blue (label in `paper`). The label is `slide-eyebrow`: 26px bold, 4px tracking, uppercase. It names the section of the agenda the slide belongs to, not the slide itself. One per slide.",
  },
  {
    name: "AccentItem", sub: "Label and one line beside a 6px Orange left rule.",
    html: `<div style="display:flex;flex-direction:column;gap:20px;border-left:6px solid #d57e00;padding:8px 0 8px 36px;margin:48px;width:560px">
  <h3 style="font-size:26px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#346094">AI coding workshop</h3>
  <p style="font-size:44px;font-weight:500;line-height:1.25">Sunday, Oct 11 · 1:30 PM ET</p>
  <p style="font-size:32px;font-weight:500;line-height:1.3;color:#5a6878">Open to anyone, one license left</p>
</div>`,
    guide: "Use it for announcement-style items: a `slide-label` in `blue`, one `slide-body-large` line, and an optional `slide-secondary` line in `slate`. The rule is `border-accent` in `orange`; padding 8px 0 8px 36px. Lay out three in a row (gap 56px) or four in a 2 × 2 grid (gap 64px).",
  },
  {
    name: "RuledCard", sub: "White card with a 6px top rule; square top, round bottom.",
    html: `<div style="display:flex;flex-direction:row;gap:32px;padding:48px">
  <div style="width:440px;display:flex;flex-direction:column;gap:20px;background:#ffffff;border-top:6px solid #d57e00;border-radius:0 0 16px 16px;padding:36px">
    <h3 style="font-size:26px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#346094">Foundation Reception</h3>
    <p style="font-size:34px;font-weight:600;line-height:1.3">Fri, Oct 16 · 5:30–7:30 PM</p>
    <p style="font-size:28px;font-weight:500;line-height:1.3;color:#5a6878">RSVP if you can make it</p>
  </div>
  <div style="width:440px;display:flex;flex-direction:column;gap:12px;background:#ffffff;border-top:6px solid #346094;border-radius:0 0 16px 16px;padding:24px">
    <h3 style="font-size:30px;font-weight:700;line-height:1.15">The Fairies</h3>
    <p style="font-size:24px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#346094">UNC Family 1</p>
    <p style="font-size:28px;font-weight:500;line-height:1.35">Sam<br>Kaavya<br>Parker</p>
  </div>
</div>`,
    guide: "Use it for asks, dates and groups (families, teams). `white` on `paper`, a `border-accent` top rule (`orange` for asks and the featured card, `blue` for a set of equals), corners `0 0 16px 16px` (`radius-card` on the bottom only), 36px padding. Content: a `slide-label` or `slide-card-title`, then body. Cards in a row share one height; let content set it.",
  },
  {
    name: "OutlinedCard", sub: "White card with a Fog border and a big Blue number.",
    html: `<div style="display:flex;flex-direction:row;gap:32px;padding:48px">
  <div style="width:360px;display:flex;flex-direction:column;gap:20px;background:#ffffff;border:2px solid #e2e6ec;border-radius:16px;padding:36px">
    <p style="font-size:48px;font-weight:700;color:#346094">1</p>
    <p style="font-size:36px;font-weight:500;line-height:1.3">Pick a fall-themed activity</p>
  </div>
  <div style="width:360px;display:flex;flex-direction:column;gap:20px;background:#ffffff;border:2px solid #e2e6ec;border-radius:16px;padding:36px">
    <p style="font-size:48px;font-weight:700;color:#346094">2</p>
    <p style="font-size:36px;font-weight:500;line-height:1.3">Up to $15 per person, on the YAC</p>
  </div>
</div>`,
    guide: "Use it for numbered steps. `white`, a `border-hairline` in `fog`, `radius-card`, 36px padding; a 48px bold number in `blue`, then `slide-body`. Only number things that are really a sequence.",
  },
  {
    name: "CalloutPanel", sub: "Blue panel for a question, a last call or the next meeting.",
    html: `<div style="padding:48px;width:1100px">
  <div style="display:flex;flex-direction:column;gap:16px;background:#346094;border-radius:16px;padding:36px 40px">
    <p style="font-size:24px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#f7f5f0;opacity:0.8">Discuss</p>
    <p style="font-size:40px;font-weight:600;line-height:1.25;color:#f7f5f0">How should NCSSM young alums be informed and take part in this process?</p>
  </div>
</div>`,
    guide: "Use one per slide for the thing the room should act on: Discuss, Last call, Next biweekly, a key date. `blue` fill, `radius-card`, padding 36px 40px; a label in `paper` at `opacity-label`, then `slide-panel` text in `paper`. Never put Orange text on it.",
  },
  {
    name: "ColumnHeader", sub: "Uppercase Blue label over a Mist hairline.",
    html: `<div style="display:flex;flex-direction:row;gap:64px;padding:48px">
  <div style="width:520px;display:flex;flex-direction:column;gap:24px">
    <h3 style="font-size:26px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#346094;border-bottom:2px solid #c9d3e0;padding:0 0 20px 0">What's next</h3>
    <div style="display:flex;flex-direction:row;align-items:baseline;gap:32px"><p style="width:160px;font-size:36px;font-weight:700;color:#d57e00">Dec 11</p><p style="font-size:36px;font-weight:500">Trustees</p></div>
    <div style="display:flex;flex-direction:row;align-items:baseline;gap:32px"><p style="width:160px;font-size:36px;font-weight:700;color:#d57e00">Jan 28</p><p style="font-size:36px;font-weight:500">Board of Governors</p></div>
  </div>
  <div style="width:520px;display:flex;flex-direction:column;gap:24px">
    <h3 style="font-size:26px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#346094;border-bottom:2px solid #c9d3e0;padding:0 0 20px 0">Open questions</h3>
    <p style="font-size:36px;font-weight:500;line-height:1.3">Admissions by congressional district</p>
  </div>
</div>`,
    guide: "Use it to head columns of plain text. `slide-label` in `blue` with a `border-hairline` in `mist` underneath and 20px below the text. Columns sit 64px apart. Dates in a timeline are 36px bold `orange` in a fixed-width column.",
  },
  {
    name: "Placeholder", sub: "Dashed frame for a photo or copy someone still owes.",
    html: `<div style="display:flex;flex-direction:row;gap:32px;padding:48px">
  <div style="width:520px;height:300px;background:#e2e6ec;border:3px dashed #c9d3e0;border-radius:16px;display:flex;align-items:center;justify-content:center;padding:32px">
    <p style="font-size:24px;color:#5a6878;text-align:center">[Rooftop photo — The Lenny at 555]</p>
  </div>
  <div style="width:520px;height:300px;border:3px dashed #c9d3e0;border-radius:16px;display:flex;align-items:center;justify-content:center;padding:32px">
    <p style="font-size:40px;font-weight:500;color:#5a6878">[Lily — one-line update]</p>
  </div>
</div>`,
    guide: "Use it wherever content isn't in yet, so the gap is visible and owned. `border-placeholder` dashed in `mist`, `radius-card`; a `fog` fill for image slots, none for copy. The text is bracketed, in `slate`, and names who supplies it. On Midnight slides use a `night` fill with `haze` text instead.",
  },
  {
    name: "SlideFooter", sub: "Presenter and slide number, pinned bottom right.",
    html: `<div style="position:relative;width:1100px;height:160px;background:#f7f5f0">
  <p style="position:absolute;right:48px;bottom:64px;width:800px;text-align:right;font-size:24px;font-weight:600;letter-spacing:2px;color:#5a6878">Seven &amp; Akhil · 19</p>
</div>`,
    guide: "Put it on every content slide; covers and dividers have none. One `slide-footer` line in `slate` (`haze` on Midnight), pinned `right:128px; bottom:64px; width:800px; text-align:right`: `Presenter · NN`, two-digit slide number, `&` between two presenters. A slide with a footer uses padding 128px 128px 160px.",
  },
];
for (const p of PIECES) {
  out(`components/${p.name}/preview.html`, `${marker("Slide pieces", 220, p.sub)}
${FONT_LINK}
${BASE}
<style>.frame{width:640px;overflow:hidden}.scale{width:1280px;transform:scale(.5);transform-origin:0 0}</style>
<div class="stage frame"><div class="scale">
${p.html}
</div></div>
`);
  out(`components/${p.name}/README.md`, `# ${p.name}

${p.sub}

${p.guide}

Markup, as used on a Claude Design slide (inline styles, hex values of the tokens):

\`\`\`html
${p.html}
\`\`\`
`);
}

// ---------- cover ----------
out("components/Cover/preview.html", `<!-- @dsCard height=300 -->
${FONT_LINK}
<style>
html,body{margin:0;background:${v("paper")}}
.cover{position:relative;width:960px;height:300px;background:${v("paper")};font-family:Montserrat,Verdana,sans-serif;overflow:hidden}
.blue{fill:${v("blue")}}.mid{fill:${v("midnight")}}.tint{fill:${v("blue-tint")}}.org{fill:${v("orange")}}.deep{fill:${v("blue-deep")}}
.card{rx:var(--radius-card,16px)}
.name{position:absolute;left:40px;top:152px;margin:0;font-size:64px;line-height:.95;font-weight:700;letter-spacing:-1px;color:${v("midnight")}}
.tag{position:absolute;left:40px;top:226px;margin:0;width:440px;font-size:14px;font-weight:500;color:${v("slate")}}
</style>
<div class="cover">
<svg width="960" height="120" viewBox="0 0 960 120" aria-hidden="true">
<!-- blocks: blue 420×120, midnight 220×120, blue-deep 120×120, blue-tint 168×120, orange disc r=48 (the catalyst dot at slide scale ÷ ~0.4) -->
<!-- arrangement: a strip of unequal bands bleeding off the top, flush like the decks' cover → divider → content rhythm -->
<!-- pattern: discs (literal motif: the Orange dot before every eyebrow, the Catalyst spark); five 20px dots at space-lg pitch on the Blue band -->
<!-- scales: gaps space-md (20px), bottom corners radius-card (16px), dot sizes from dot.light (20px) -->
<rect class="blue" x="-16" y="-16" width="436" height="136" rx="16"/>
<rect class="deep" x="440" y="-16" width="120" height="136" rx="16"/>
<rect class="mid" x="580" y="-16" width="220" height="136" rx="16"/>
<rect class="tint" x="820" y="-16" width="160" height="136" rx="16"/>
<circle class="org" cx="690" cy="52" r="48"/>
<circle class="org" cx="50" cy="80" r="10"/><circle class="org" cx="102" cy="80" r="10"/><circle class="org" cx="154" cy="80" r="10"/><circle class="org" cx="206" cy="80" r="10"/><circle class="org" cx="258" cy="80" r="10"/>
</svg>
<p class="name">NCSSM YAC Design System</p>
<p class="tag">NCSSM Blue as the ground, Orange as the spark, Montserrat for everything.</p>
</div>
`);

// ---------- README (brand book) ----------
out("README.md", read("scripts/claude-design-readme.md"));

// ---------- asset groups ----------
const ASSETS = {
  "NCSSM marks": {
    tile: "l",
    files: {
      "ncssm-horizontal-fullcolor.png": "87dabefae96fe5fe3d37c005019de1e1",
      "ncssm-abbreviated-fullcolor.png": "cbe6357f9aaae40ccfec3632d92b4518",
      "ncssm-foundation-blue.png": "a8cb5e894e4f51613cfb6ab87b5a02de",
      "ncssm-foundation-white.png": "6ddcba12fc3d925326313c164fd478f6",
      "durham-unicorn-blue.png": "a3122ca3328d2f7391c22bf59520a488",
      "morganton-dragon-head-green.png": "9472706ecccf209e6ea3ae7c27c28b33",
    },
    src: (f) => `ncssm-marks/png/${f}`,
  },
  Yakkety: {
    tile: "m",
    files: {
      "yakkety-idle.svg": "4ff091e26a8cbb950ac3714cc327383c",
      "yakkety-thinking.svg": "081776ff900405515133c86e8d02b767",
      "yakkety-done.svg": "2576e0e1c2cfbe447aaaae2fc6f34e49",
      "yakkety-needs-you.svg": "2685707a16f97bbe478a5b1aa3a7f8c7",
      "yakkety-oops.svg": "4576dd6848ffc952505697cf949c9a39",
      "yakkety-icon.svg": "092bc8910fb91393b893dc0ded3e9f18",
      "yakkety-icon-512.png": "227c94214ee892258909ffde1ac2bdc0",
    },
    src: (f) => (f.startsWith("yakkety-icon") ? (f.endsWith(".png") ? "yakkety-mascot/icon/png/yakkety-icon-512.png" : "yakkety-mascot/icon/yakkety-icon.svg") : `yakkety-mascot/svg/${f}`),
  },
};
const assetGroups = {};
for (const [group, g] of Object.entries(ASSETS)) {
  const files = {};
  for (const [name, blob] of Object.entries(g.files)) {
    files[name] = { name, blob, size: statSync(join(root, g.src(name))).size, type: name.endsWith(".svg") ? "image/svg+xml" : "image/png" };
  }
  assetGroups[group] = { name: group, tile: g.tile, order: Object.keys(g.files), files };
}
out("assets/NCSSM marks/README.md", `# NCSSM marks

NCSSM's official logos, unchanged master files from NCSSM Communications. Full colour on \`paper\` or \`white\`; the white Foundation logo on \`blue\` or \`midnight\`.

- \`ncssm-horizontal-fullcolor.png\`: the default NCSSM logo for slides and web (catalyst plus the school's full name).
- \`ncssm-abbreviated-fullcolor.png\`: catalyst over "NCSSM", for square spaces, apparel, or after the full logo has appeared.
- \`ncssm-foundation-blue.png\` / \`ncssm-foundation-white.png\`: the NCSSM Foundation logo, for Foundation events such as the Reception.
- \`durham-unicorn-blue.png\`: NCSSM-Durham athletics mascot; school spirit and clubs only.
- \`morganton-dragon-head-green.png\`: NCSSM-Morganton athletics mascot; school spirit and clubs only.

Never separate the catalyst from the school's name, recolour, stretch or redraw a mark. Vector, stacked, grayscale and reversed versions: the NCSSM Communications Kiosk (sites.google.com/ncssm.edu/commskiosk/brand-logos). The YAC's own logo is not settled; don't make one.
`);
out("assets/Yakkety/README.md", `# Yakkety

Yakkety, the YAC's AI secretary: a Toffee yak with five expressions and an app icon. Flat colour in its own palette (\`yakkety-toffee\` and friends); it is not recoloured to Blue or Orange.

- \`yakkety-idle.svg\`: the default face.
- \`yakkety-thinking.svg\`: working on something.
- \`yakkety-done.svg\`: a real win; use sparingly.
- \`yakkety-needs-you.svg\`: waiting on a decision.
- \`yakkety-oops.svg\`: something failed; honest, not dramatic.
- \`yakkety-icon.svg\`, \`yakkety-icon-512.png\`: app icon and avatar on the \`yakkety-cream-tile\` background.

Put Yakkety on \`paper\`, \`white\` or the cream tile only, never on \`blue\`, \`orange\` or \`midnight\`. Keep a quarter of its width as clear space. No props, outlines, shadows, cropping or stretching.
`);

// ---------- index ----------
const now = new Date().toISOString();
out("design-system.json", JSON.stringify({
  v: 3,
  layout: "files",
  createdOnFiles: { v: 1, at: process.env.CREATED_AT || now },
  title: "NCSSM YAC Design System",
  namespace: "NcssmYac",
  libraries: [],
  sections: {},
  groups: Object.keys(ASSETS),
  assetGroups,
  blobs: {},
  docs: { readme: "project/README.md", sections: [] },
  lastChange: { by: process.env.DS_BY || "Akhil Jariwala", at: now, via: "Claude Code", note: process.env.DS_NOTE || "Built from github.com/ncssm-yac/design-system" },
}, null, 2) + "\n");

const count = (d) => readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(join(d, e.name)) : 1), 0);
console.log(`wrote ${count(join(outDir, "project"))} files to ${join(outDir, "project")}`);
