# Slides

How YAC decks look, taken from the decks we've built with Claude Design: *YAC Biweekly — Sept 23*, *YAC Biweekly — Oct 7* and the *Yakety AI Coding Workshop*. It covers the 1920 × 1080 layout, the patterns every deck repeats, and copy-paste templates in Claude Design's slide format.

Status: **v1** (October 2026). Layout values: [`tokens.json`](tokens.json). Templates: [`templates/`](templates/). Open [`preview.html`](preview.html) in a browser to see them all.

## Quick start

| I need… | Use |
| --- | --- |
| A new biweekly deck | Run the `yac-biweekly` skill (`.claude/skills/yac-biweekly/`); it builds from these templates |
| One slide of a known kind | Copy the matching file from `templates/` into `project/slides/<id>.html` and change the id |
| Exact colours or sizes | [`../color/`](../color/), [`../typography/`](../typography/), [`tokens.json`](tokens.json) |

## Templates

| File | Pattern | Background |
| --- | --- | --- |
| `cover.html` | Eyebrow, big date, time, then a ruled block for the opener | Blue |
| `agenda.html` | Numbered columns with 6px top rules; the current section in Orange | Paper |
| `divider.html` | Eyebrow and a 144px section name, vertically centred | Blue |
| `divider-photo.html` | The same over a full-bleed photo, text at the bottom | Blue + photo |
| `announcements.html` | Three items, each a label and a line beside an Orange left rule | Paper |
| `statement.html` | Eyebrow, a headline sentence, numbered cards, one Blue key-date card | Paper |
| `two-column.html` | Two ruled columns (dates in Orange) and a Blue "Discuss" panel | Paper |
| `stat-chart.html` | One huge number beside a simple bar chart | Paper |
| `photo-grid.html` | Six photo tiles and a dot-and-date caption | Midnight |
| `catalyst-tease.html` | "The Catalyst": a glowing Orange dot, no name yet | Midnight |
| `catalyst-reveal.html` | The dot grows into the member's photo; name and tagline build in | Midnight |
| `closing.html` | "Before we go": up to five Orange-ruled cards, one Blue card for the next meeting | Paper |
| `event.html` | One event: name, when and where, QR code for the RSVP | Paper |
| `social-update.html` | Social media update: headline, a frame for the latest post, a Blue "The ask" panel | Paper |
| `breakout.html` | Breakout rooms: room cards, Plan and Nominate, a minutes panel | Paper |
| `teammate-tribute.html` | Teammate Tribute: the teammate's name, a line about them, quote cards | Paper |

Text in `[brackets]` is a placeholder. The `<aside>` in each is the speaker notes.

## Layout

- **Canvas** 1920 × 1080, **padding** 128px on every side (1664 × 824 inside). With a footer, the bottom padding is 160px.
- **Title** top-left at the top margin, every time, so it never jumps between slides. Titles are never centred, except on the Catalyst tease.
- **Footer**: one 24px line, pinned `right:128px; bottom:64px`, right-aligned, Slate: the presenter's first name (`Lily`, `Iesha & Nandhini`). No slide numbers, so slides can be added or moved at the last minute. Covers, dividers and the Catalyst tease have no footer.
- **Spacing**: 20px inside blocks, 32px between cards, 64px between columns, 48–96px from title to content. Use `justify-content: space-between` to fill the height rather than leaving the bottom third empty.
- **Corners**: 16px on cards and panels; ruled cards are square on top and round below (`0 0 16px 16px`); 12px on photo tiles.

## The recurring pieces

| Piece | Recipe |
| --- | --- |
| Eyebrow | 20px Orange dot (24px on Blue), 20px gap, 26px bold uppercase label with 4px tracking, Blue on Paper or Paper on Blue |
| Accent rule | `border-top: 6px solid` on a card or column, or `border-left: 6px solid` with 36px left padding on a one-line item. Orange for the featured one, Blue for the rest |
| Ruled card | White, 6px top rule, `0 0 16px 16px` corners, 36px padding, label then body |
| Outlined card | White, `2px solid #E2E6EC`, 16px corners, 36px padding, a big Blue number then body |
| Callout panel | Blue, 16px corners, `36px 40px` padding, a Paper label at 80% opacity, then 40px semibold Paper text. For "Discuss", "Last call", "Next biweekly" |
| Column header | 26px bold uppercase Blue label with `border-bottom: 2px solid #C9D3E0` and 20px bottom padding |
| Placeholder | `3px dashed #C9D3E0`, Fog fill, bracketed copy in Slate: `[Rooftop photo — Akhil to source]` |
| QR code | 200–232px square, `object-fit: contain`, on a white card with a small uppercase caption ("RSVP", "Scan to open"). The full URL goes in the notes |

## A deck's rhythm

1. **Cover** (Blue), which doubles as the opener while people join.
2. **Agenda** (Paper): sections numbered 01–05, no times on the slide; the run of show lives in the notes.
3. **Content** (Paper), with a **divider** (Blue) before each section.
4. **The Catalyst** (Midnight): a tease, then a reveal with a magic transition.
5. **Before we go** (Paper), the last slide; nothing after it.

Every slide uses `data-transition="fade"`, except the Catalyst tease, which uses `magic` so the dot carries over to the reveal.

## Writing slides

- One idea per slide. A sentence headline beats a bulleted list; turn lists into cards, columns or a number.
- Sentence-case titles. Uppercase only through the label style.
- Never invent a number, a quote or a name. Unknowns go in brackets with an owner: `[Lily — one-line update]`.
- Speaker notes say who presents, for how long, and where the facts came from. Links go in the notes, not on the slide.
- Don't put member nominee names or private data on slides.
- Yakkety can appear on Paper slides (see [`../yakkety-mascot/`](../yakkety-mascot/)), never on Blue, Orange or Midnight.
- NCSSM marks come from [`../ncssm-marks/`](../ncssm-marks/). Don't put an unofficial YAC logo on a slide until it's settled.

## Editing the templates

The templates are plain files. After changing one, rebuild the preview:

```bash
node scripts/build.mjs     # from the repo root; also rebuilds tokens.css
```

Claude Design's slide format allows only inline styles (no classes, `var()` or `margin`), so the templates use hex values. Keep them in step with [`../color/tokens.json`](../color/tokens.json).
