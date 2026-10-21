# Building the deck

The deck is a Claude Slides artifact built from the YAC slide templates. The look is the **Oct 7 biweekly deck**; the templates in `slides/templates/` already encode it. Read `slides/README.md` once for the layout rules, and open a template before you use it.

## Set up

1. Working folder: `biweekly/YYYY.MM.DD/deck/`. Files: `project/deck.json` and `project/slides/<id>.html`, one `<section>` per file.
2. Create the artifact from the Slides type (call the Artifact tool with `action: "quickstart"`, intent `slides`, to get its `type_url`, then publish with that `type_url` and the title `YYYY.MM.DD - YAC Biweekly`). The create result carries the type's own instructions on file format and publishing. Follow them, with these differences:
   - Write files under `biweekly/YYYY.MM.DD/deck/` (that is the `root`), so the export step can read them later.
   - Typeface: Montserrat. In `deck.json` `faces`, key `montserrat`, `family` `Montserrat`, `href` `https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600&display=swap`.
   - Design system: if "NCSSM YAC Design System" is visible to this account, install it as the type's instructions say. If it is not, carry on; the templates carry their hex values inline.
   - Do not verify, re-read or screenshot the artifact unless the exec asks. For layout-heavy edits use the local render below.
3. Artifacts are private. Tell the exec the link only opens for them until they share it from the page's Share menu.

## Slides from templates

Copy the template file, give the section the slide's id (the file name without `.html`), replace every `[bracketed]` string, and keep the markup. Adjust repeating blocks by copying or removing a sibling.

| Section | Template | Notes |
|:-|:-|:-|
| Cover + opener | `cover` | Eyebrow `YAC BIWEEKLY`, date line, time line, opener label and prompt. No footer. |
| Shape of tonight | `agenda` | 4–6 columns numbered 01–06, first column Orange rule, others Blue. Groups, never times. Run of show goes in the notes. |
| Announcements | `announcements` | 2–3 blocks per slide; four blocks switch to two columns. Split rather than shrink. |
| An event with a date, place and RSVP | `event` | QR frame plus label; full URL in the notes. |
| Section opener | `divider` / `divider-photo` | Use `divider-photo` only when a photo exists or is promised. |
| Statement, mission, concept | `statement` | Headline sentence, up to three numbered cards, one Blue key-date card. |
| Timeline, open questions, discuss | `two-column` | Ends with a Blue **Discuss** panel. |
| A number that matters | `stat-chart` | Only confirmed numbers. Bars are proportional. |
| Social media update and ask | `social-update` | Frame for the latest post, Blue **The ask** panel. |
| Teammate Tribute | `teammate-tribute` | Name, one line, up to two quote cards, Blue prompt card. |
| Breakout rooms | `breakout` | Rooms with members, **Plan**, **Nominate**, minutes panel. |
| Event photos | `photo-grid` | Frames until photos exist. |
| The Catalyst | `catalyst-tease` then `catalyst-reveal` | Always a pair. The tease has no name and no footer. |
| Before we go | `closing` | Always last. Up to five cards plus the Blue **Next biweekly** card. Nothing after it. |
| Members bring their own slides | `divider` | Build only a divider for the owner, with the note `INSERT: owner supplies slides`. Never invent their content. |

Need something the templates do not cover? Combine the closest template with the recurring pieces in `slides/README.md` (eyebrow, accent rule, ruled card, callout panel). Do not introduce new colors, sizes or fonts.

## Rules every slide follows

- **No slide numbers.** Slides move at the last minute.
- **Presenter tag.** Bottom right on content slides: first name, or `Name & Name`, in the footer style. None on the cover, dividers, or the Catalyst tease.
- **One idea per slide.** A sentence beats a bullet list. Split a slide rather than shrink text.
- **Slide length.** Cover, divider, tease: 1–3 lines. Announcements, big number, reveal: 2–5 blocks. Concept, mission, recap: 4–8 short lines. Breakout instructions, Before we go, rosters: up to ~12 short lines in labeled groups. Nothing a presenter would read aloud verbatim.
- **Voice.** Fragments over sentences. Sentence-case titles. Uppercase only through the label style. Em-dashes and middle dots (`Fri, Oct 16 · 5:30–7:30 PM`). No exclamation marks, no emoji (the opener prompt is the one place an emoji from the exec may stay), no closing pleasantries, no "thank you" slide.
- **Never invent** a fact, name, quote or number. Unknowns become `[Owner — what to fill]` and go in your reply.
- **Times.** No segment minutes on slides. Event dates and times, breakout timeboxes and the next biweekly do appear.
- **Anything members act on in the meeting** gets a QR frame and a short label. The full URL goes in the speaker notes. Never print a raw URL.
- **Photos.** Dashed placeholder frame with `[Photo — Owner to send]`. List every frame in your reply so the exec can ask for them in one message.
- **Sensitive items stay off.** Personnel news, individual feedback, anything the exec asked to keep vague. NCSSM Online nominee names are never printed. The Catalyst recipient appears only on the reveal.
- **Yakkety** may appear on Paper slides, never on Blue, Orange or Midnight.
- **Speaker notes** (`<aside>`, plain text, 4,000 characters at most): presenter, minutes, the source of each fact ("from the 2026.10.20 leadership minutes"), full URLs, and `[confirm]` flags. On the agenda slide, the run of show: segment, owner, minutes, total 60, and what to cut first if the meeting runs long.
- **Catalyst tagline** is warm, clever and specific; offer one pick and at most two alternates, and mark it *(swap if you like)* in the notes.

## Check a layout locally

When a change is layout-heavy (a new block count, long text, a breakout with many rooms), render it:

```bash
node scripts/export-gslides.mjs --deck biweekly/YYYY.MM.DD/deck --out biweekly/YYYY.MM.DD/.export --png biweekly/YYYY.MM.DD/.preview
```

Open the PNGs in `.preview/` (the Read tool shows images). The script needs Playwright with Chromium; if it is missing, skip the check and say you could not render locally.
