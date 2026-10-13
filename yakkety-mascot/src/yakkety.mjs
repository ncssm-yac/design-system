// Yakkety mascot: the single source of truth for every Yakkety drawing.
// All art is flat SVG built from circles, ellipses and simple curves on a 200 x 210 grid.
// Run scripts/build.mjs to regenerate the files in svg/ and icon/.

export const TOFFEE = {
  body: "#E8873A", // signature Toffee
  dark: "#B8611E", // fringe, ears, fur hem, freckles
  light: "#FBD3A6", // muzzle, belly, inner ear
  horn: "#A8876A", // bone horn tip
  hoof: "#4E2A12", // horn base, hooves, nostrils, mouth
  tile: "#FFE9D2", // icon background
};
export const INK = "#1E1B2E"; // pupils and closed eyes
export const TONGUE = "#F27B8E";
export const SWEAT = "#8FD3F5";

export const STATES = ["idle", "thinking", "done", "needs-you", "oops"];

function fringe(c) {
  // Arc over the head, then a row of rounded tufts hanging over the eyes
  let d = "M34,98 C34,56 64,32 100,32 C136,32 166,56 166,98";
  const n = 7, w = 132 / n;
  for (let i = 0; i < n; i++) {
    const x0 = 166 - i * w, x1 = x0 - w, mid = (x0 + x1) / 2;
    const base = i === 0 || i === n - 1 ? 92 : 84;
    const drop = i % 2 ? 100 : 96;
    d += ` Q${mid.toFixed(1)},${drop} ${x1.toFixed(1)},${base}`;
  }
  return `<path d="${d} Z" fill="${c.dark}"/>`;
}

function eyes(state) {
  if (state === "done") {
    return `<path d="M58,110 Q74,94 90,110" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<path d="M110,110 Q126,94 142,110" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  }
  const look = { idle: [0, 3], thinking: [-6, -4], "needs-you": [0, 1], oops: [7, 4] }[state] || [0, 3];
  const r = state === "needs-you" ? 10 : 13;
  const eye = (cx) => `<circle cx="${cx}" cy="106" r="24" fill="#FFFFFF"/>` +
    `<circle cx="${cx + look[0]}" cy="${106 + look[1]}" r="${r}" fill="${INK}"/>` +
    `<circle cx="${cx + look[0] - 4}" cy="${106 + look[1] - 5}" r="4.2" fill="#FFFFFF"/>`;
  return eye(74) + eye(126);
}

function mouth(c, state) {
  const s = `stroke="${c.hoof}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  switch (state) {
    case "done": return `<path d="M86,147 Q100,168 114,147 Z" fill="${c.hoof}"/><ellipse cx="100" cy="157" rx="6" ry="3.6" fill="${TONGUE}"/>`;
    case "thinking": return `<path d="M93,152 Q101,148 109,153" ${s}/>`;
    case "needs-you": return `<ellipse cx="100" cy="152" rx="5" ry="6.5" fill="${c.hoof}"/>`;
    case "oops": return `<path d="M87,153 q6.5,-5 13,0 q6.5,5 13,0" ${s}/>`;
    default: return `<path d="M87,147 Q100,161 113,147" ${s}/>`;
  }
}

function extra(c, state) {
  if (state === "thinking") return `<circle cx="176" cy="40" r="4" fill="${c.dark}"/><circle cx="186" cy="26" r="5.5" fill="${c.dark}"/><circle cx="196" cy="9" r="7" fill="${c.dark}"/>`;
  if (state === "needs-you") return `<g transform="translate(166,6)"><rect width="30" height="30" rx="10" fill="${INK}"/><path d="M8,30 L4,40 L16,30Z" fill="${INK}"/><rect x="13" y="6" width="4.4" height="12" rx="2.2" fill="#FFFFFF"/><circle cx="15.2" cy="23" r="2.4" fill="#FFFFFF"/></g>`;
  if (state === "oops") return `<path d="M44,62 C44,62 34,76 34,82 a10,10 0 0 0 20,0 C54,76 44,62 44,62Z" fill="${SWEAT}"/>`;
  return "";
}

// The character itself, without a viewBox wrapper.
function character(c, state, withExtras, id) {
  // Two-tone horn, like a real yak: dark base, bone tip
  const hornPath = "M58,62 C30,60 13,44 18.5,15 C20,6 30.5,5 32.5,13 C35.5,34 48,42 70,42 Z";
  const horn = `<path d="${hornPath}" fill="${c.hoof}"/><path d="${hornPath}" fill="${c.horn}" clip-path="url(#${id}-tip)"/>`;
  const ear = `<ellipse cx="30" cy="102" rx="15" ry="8.5" transform="rotate(-24 30 102)" fill="${c.dark}"/>` +
    `<ellipse cx="31.5" cy="101.5" rx="8" ry="4.2" transform="rotate(-24 31.5 101.5)" fill="${c.light}"/>`;
  const mirror = (s) => `<g transform="translate(200,0) scale(-1,1)">${s}</g>`;
  const hem = [50, 66, 82, 100, 118, 134, 150].map((x) => `<circle cx="${x}" cy="187" r="10" fill="${c.dark}"/>`).join("");
  const freckles = [[49, 139, 3.4], [57, 143.5, 3.4], [48, 147.5, 3]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.dark}"/><circle cx="${200 - x}" cy="${y}" r="${r}" fill="${c.dark}"/>`).join("");
  return [
    `<defs><clipPath id="${id}-tip"><rect x="0" y="0" width="60" height="31"/></clipPath></defs>`,
    horn, mirror(horn), ear, mirror(ear),
    `<path d="M100,34 C142,34 164,60 166,102 C168,142 168,178 152,190 L48,190 C32,178 32,142 34,102 C36,60 58,34 100,34Z" fill="${c.body}"/>`,
    `<ellipse cx="100" cy="166" rx="42" ry="26" fill="${c.light}"/>`,
    `<rect x="64" y="184" width="24" height="20" rx="8" fill="${c.hoof}"/><rect x="112" y="184" width="24" height="20" rx="8" fill="${c.hoof}"/>`,
    hem,
    `<ellipse cx="100" cy="142" rx="33" ry="21" fill="${c.light}"/>`,
    `<ellipse cx="88" cy="136" rx="4.2" ry="3" fill="${c.hoof}"/><ellipse cx="112" cy="136" rx="4.2" ry="3" fill="${c.hoof}"/>`,
    freckles,
    eyes(state), fringe(c), mouth(c, state),
    withExtras ? extra(c, state) : "",
  ].join("\n  ");
}

/** Full-body mascot on a transparent background. */
export function mascotSVG(state = "idle", c = TOFFEE) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -2 210 212" width="420" height="424" role="img" aria-label="Yakkety the yak (${state})">
  ${character(c, state, true, "yak")}
</svg>
`;
}

/**
 * App icon: the full-body yak centred on a tile with room on every side.
 * shape "rounded" has its own rounded corners; "square" is full-bleed for
 * platforms that apply their own mask (iOS, Android adaptive icons).
 */
export function iconSVG(shape = "rounded", c = TOFFEE) {
  const radius = shape === "rounded" ? 52 : 0; // 23% of the 228-unit tile
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -10 228 228" width="512" height="512" role="img" aria-label="Yakkety">
  <rect x="-14" y="-10" width="228" height="228" rx="${radius}" fill="${c.tile}"/>
  ${character(c, "idle", false, "icon")}
</svg>
`;
}
