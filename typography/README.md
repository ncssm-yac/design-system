# Typography

One family: **Montserrat**. It's NCSSM's primary font, and every YAC deck sets everything in it, from 144px divider titles to 24px footers. NCSSM names Verdana as the substitute and Georgia as a secondary serif.

Status: **v1** (October 2026). Values: [`tokens.json`](tokens.json), or `--yac-*` variables in [`../tokens.css`](../tokens.css).

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400..700;1,400..700&display=swap">
```

```css
font-family: Montserrat, Verdana, sans-serif;
```

In a Claude Design deck, add Montserrat to `faces` in `project/deck.json` with that same `href`.

## Weights

| Weight | Used for |
| --- | --- |
| 400 Regular | Rare; use Medium for body |
| 500 Medium | Body text and subtitles (the default, not 400) |
| 600 Semibold | Leads, panel text, footers, emphasis inside body |
| 700 Bold | Titles, labels, eyebrows, numbers |

Emphasise with weight, colour or italic, never with a new size.

## Slide scale (1920 × 1080)

| Role | Size | Weight | Line height | Tracking | Example |
| --- | --- | --- | --- | --- | --- |
| Stat | 160 | 700 | 1.0 | −3px | 300 → 680 |
| Divider | 144 | 700 | 1.05 | −2px | NCSSM Online |
| Cover | 128 | 700 | 1.05 | −2px | Wednesday, October 7 |
| Statement | 104–120 | 700 | 1.05 | −2px | Plan a fall outing with your family |
| Title | 88 | 700 | 1.05 | −1px | Shape of tonight |
| Number | 64 | 700 | 1.0 | 0 | 01 |
| Quote | 52 | 600 italic | 1.2 | 0 | "Prototyper Extraordinaire." |
| Lead | 48 | 500 | 1.25 | 0 | 8:15–9:15 PM |
| Body large | 44 | 500 | 1.25 | 0 | One line beside an accent rule |
| Panel | 40 | 600 | 1.25 | 0 | Text in a Blue callout |
| Body | 36 | 500 | 1.3 | 0 | Card and column text |
| Card title | 30 | 700 | 1.15 | 0 | The Fairies |
| Secondary | 28–32 | 500 | 1.3 | 0 | Supporting line, in Slate |
| Eyebrow | 26 | 700 | 1.2 | 4px, UPPERCASE | GROWING THE YAC |
| Label | 26 | 700 | 1.2 | 3px, UPPERCASE | ANNOUNCEMENTS block label |
| Label small | 24 | 700 | 1.2 | 2px, UPPERCASE | KICK OFF |
| Footer | 24 | 600 | 1.2 | 2px | Akhil · 07 |

Nothing goes below 24px on a slide.

## Web scale

For a website, an app or a doc. It is scaled down from the slide scale and hasn't been used in a shipped page yet, so adjust it the first time it is.

| Role | Size | Weight | Line height |
| --- | --- | --- | --- |
| Display | 56 | 700 | 1.05 |
| H1 | 40 | 700 | 1.1 |
| H2 | 28 | 700 | 1.15 |
| Lead | 20 | 500 | 1.4 |
| Body | 16 | 500 | 1.5 |
| Small | 14 | 500 | 1.4 |
| Label | 12 | 700, 1.5px tracking, uppercase | 1.3 |

## Rules

- Big titles get negative tracking (−1 to −3px); uppercase labels get positive tracking (2–4px). Everything else is 0.
- Write titles in sentence case: "Before we go", not "Before We Go". Only labels and eyebrows are uppercase, and CSS makes them uppercase, so type them in sentence case too.
- Use the middle dot ( · ) to separate items on one line (Fri, Oct 16 · 5:30–7:30 PM; Akhil · 07) and an en dash for ranges (8:15–9:15 PM).
- Use Georgia only for long-form reading or a pull quote, never for titles or labels.
