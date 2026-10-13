The visual identity of NCSSM's Young Alumni Council (YAC): NCSSM Blue as the ground, NCSSM Orange as the one accent, Montserrat for everything. It is drawn from the YAC's biweekly and workshop decks and from NCSSM's own brand guide. Use it for slides first; the same rules hold for web pages, docs and social posts.

## Content fundamentals

- Write the way the YAC talks in its meetings: warm, direct, plain. Speak to members as "you" and the council as "we" ("We're now taking attendance at biweeklies").
- Sentence case for every title and line ("Before we go", "Shape of tonight"). Uppercase only through the label styles (`slide-eyebrow`, `slide-label`, `slide-label-small`).
- One idea per slide. Prefer a sentence headline ("Plan a fall outing with your family") to a bulleted list; turn lists into cards, columns or one big number.
- Separate items on a line with a middle dot (`Fri, Oct 16 · 5:30–7:30 PM`, `Akhil · 07`); use an en dash for ranges (`8:15–9:15 PM`).
- Never invent a number, a quote or a name. Unknowns stay bracketed with an owner: `[Lily — one-line update]`, `[Photo of Iesha]`.
- Speaker notes (the slide's `<aside>`) say who presents, for how long, and where facts came from. Links go in the notes, not on the slide; on the slide, use a QR code.
- Don't put nominee names or members' private details on slides.
- No emoji. No exclamation-mark hype.

## Colour

- Make `paper` the default background. Use `blue` for the cover and section dividers and `midnight` for the Catalyst and photo slides. A deck rotates through these three; nothing else is a slide background.
- Set text in `midnight` on `paper` and `white`; in `paper` on `blue` and `midnight`. Use `slate` for secondary text and footers on light grounds and `haze` on `midnight`.
- Use `orange` as the single accent: the dot before an eyebrow, a `border-accent` rule, the current agenda number, one big number or a tagline. If more than a couple of things on a slide are orange, nothing stands out.
- `orange` is 2.8:1 on `paper`: use it for shapes and for text at 36px bold or larger. Below that, use `orange-deep` (4.7:1). Never set `orange` text on `blue` (2.1:1).
- Use `white` for cards on `paper`; `fog` for outlined-card borders and image placeholders; `mist` for hairlines and dashed placeholder frames; `blue-tint` for chart bars that aren't the highlight.
- `blue-deep` is the frame behind text on a photo divider until the photo is in; `night` is a placeholder or raised surface on `midnight`.
- `cool-gray`, `light-blue`, `purple`, `gold` and `green` are NCSSM's other brand colours. The YAC hasn't used them; reach for them only for a chart that needs more than two series, and check contrast first.
- `yakkety-*` colours belong to the mascot only. Don't use Toffee as a UI accent; the YAC accent is `orange`.

## Type

- Set everything in `sans` (Montserrat, falling back to Verdana). Load it from Google Fonts: `https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400..700;1,400..700&display=swap`. In a Claude Design deck, add it to `faces` in `project/deck.json` with that href.
- Body text is weight 500, not 400. Titles, labels and numbers are 700; leads, panels and footers 600.
- On slides use the `Slide (1920 × 1080)` styles: `slide-title` (88px) top-left on content slides, `slide-cover` and `slide-divider` on Blue, `slide-statement` for a sentence headline, `slide-body` (36px) in cards and columns. Nothing on a slide is smaller than 24px.
- Track big titles tight (−1 to −3px) and uppercase labels loose (2–4px). Everything else is 0.
- Emphasise with weight, colour or italic, never a new size. The one italic is `slide-quote`, in `orange` on `midnight`, for the Catalyst tagline.
- `serif` (Georgia) is NCSSM's secondary face: long-form reading or a pull quote only, never titles or labels.
- The `Web` styles are a first pass scaled from the slide scale; adjust them the first time a page ships.

## Layout

- Slides are 1920 × 1080 with `slide-padding` (128px) on every side, or `128px 128px 160px` when there's a footer.
- The title sits top-left at the top margin on every content slide so it never jumps. Fill the height with `justify-content: space-between` rather than leaving the bottom third empty.
- Space with the scale: `space-md` (20px) inside blocks, `space-lg` (32px) between cards, `space-2xl` (64px) between columns, `space-xl`–`space-4xl` from title to content.
- Corners: `radius-card` (16px) on cards and panels; ruled cards round only the bottom (`0 0 16px 16px`); `radius-tile` (12px) on photo tiles; `radius-bar` on chart bar tops.
- No drop shadows, gradients or left-border cards outside the patterns below. The only shadow is `catalyst-glow` / `catalyst-glow-small`, on the Catalyst dot.
- Every content slide gets a `SlideFooter`; covers and dividers don't.

## Slide pieces and templates

The components are slide markup, not a code library. Copy a card's HTML into a Claude Design slide (`project/slides/<id>.html`); slides take inline styles only, so the markup carries hex values of these tokens.

- **Slide pieces**: `Eyebrow`, `AccentItem`, `RuledCard`, `OutlinedCard`, `CalloutPanel`, `ColumnHeader`, `Placeholder`, `SlideFooter`.
- **Slide templates**: `CoverSlide`, `AgendaSlide`, `DividerSlide`, `PhotoDividerSlide`, `AnnouncementsSlide`, `StatementSlide`, `TwoColumnSlide`, `StatChartSlide`, `PhotoGridSlide`, `CatalystTeaseSlide`, `CatalystRevealSlide`, `ClosingSlide`.

A biweekly runs: `CoverSlide` (doubles as the opener) → `AgendaSlide` (sections 01–05, no times) → a `DividerSlide` before each section and content slides inside it → `CatalystTeaseSlide` → `CatalystRevealSlide` → `ClosingSlide`, which is always last. Every slide uses `data-transition="fade"` except the Catalyst tease, which uses `magic` so `#catalyst-dot` carries into the reveal.

## Logos and marks

- The YAC's own logo is not settled. Don't draw, combine or approximate one; set "Young Alumni Council" in plain `sans` where a name is needed.
- Use NCSSM's marks from the `NCSSM marks` assets, unchanged. `ncssm-horizontal-fullcolor.png` is the default; `ncssm-abbreviated-fullcolor.png` for square spaces. The catalyst is never separated from the school's name, so there is no catalyst-only file.
- Full-colour marks go on `paper` or `white`. On `blue` or `midnight` use a reversed (white) version; only the Foundation logo has one here (`ncssm-foundation-white.png`).
- The Unicorn (Durham) and Dragon (Morganton) are athletics mascots: school spirit and clubs only, never in place of the school logo, and never one campus's mascot for the other.
- Give every mark clear space at least the height of the catalyst. Never stretch, recolour or add effects.

## Yakkety

- Yakkety is the YAC's AI secretary, a Toffee yak. Use the `Yakkety` assets: `yakkety-idle` by default, `yakkety-thinking` while working, `yakkety-needs-you` when waiting on someone, `yakkety-oops` for a failure, and `yakkety-done` only for real wins.
- Place it on `paper`, `white` or `yakkety-cream-tile` only, with a quarter of its width as clear space. Never on `blue`, `orange` or `midnight`, never recoloured, cropped or given props.
- It appears when it has something to say: tech updates, the AI workshop, a status. It is not decoration on every slide.

## Iconography

- The decks use almost no icons: the Orange dot does the work of a bullet or marker. In Claude Design slides, `<x-icon>` is fine for a media frame (`Play`, `Image`) in `orange` on `midnight`.
- No emoji as icons or section markers.
- QR codes stand in for links on slides: 200–232px square, on a `white` card, with a `slide-label-small` caption ("RSVP", "Scan to open").
