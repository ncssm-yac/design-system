# NCSSM YAC Design System

<img src="yakkety-mascot/icon/png/yakkety-icon-128.png" width="72" alt="Yakkety app icon">

The shared home for the visual identity of the NCSSM Young Alumni Council (YAC): colours, type, slide templates, NCSSM's marks, mascots and the rules for using them. If you're making something for YAC (slides, a website, an app, a social post), start here so everything looks like it belongs together.

## The short version

- **Colours**: NCSSM Blue `#346094` as the ground, NCSSM Orange `#D57E00` as the one accent, Midnight `#1C2633` for text, Paper `#F7F5F0` for backgrounds.
- **Type**: Montserrat for everything (Verdana as the fallback). Bold titles, medium body, uppercase tracked labels.
- **Signature details**: an Orange dot before every eyebrow, 6px accent rules, Blue callout panels.
- **Logo**: NCSSM's catalyst logos for now. The YAC's own logo is still in progress.

## What's inside

| Directory | What it is | Status |
| --- | --- | --- |
| [`color/`](color/) | Brand colours, neutrals, NCSSM accents, contrast pairings | v1 |
| [`typography/`](typography/) | Montserrat, weights, the slide type scale and a web scale | v1 |
| [`slides/`](slides/) | Layout rules, recurring patterns and 16 Claude Design slide templates | v1 |
| [`ncssm-marks/`](ncssm-marks/) | NCSSM's official logos (SVG and PNG): stacked, horizontal and abbreviated catalyst logos, Foundation, Unicorn, Dragon | Master files from NCSSM |
| [`yakkety-mascot/`](yakkety-mascot/) | Yakkety, the YAC's AI Secretary: a Toffee-coloured yak, with five expressions, a wordmark and lockups, app icons, chat avatars, custom emoji, a favicon, colour tokens, usage rules and the research behind it | v1, locked |
| [Claude Design system](https://claude.ai/artifact/UtzAMSDiAoCHeSE4cxQZ8T) | This system published as a Claude Design "Design System", so decks and designs pick it up. Built by `scripts/build-claude-design.mjs` | v1 |
| [`.claude/skills/yac-biweekly/`](.claude/skills/yac-biweekly/SKILL.md) | The biweekly deck assistant: an exec officer talks to it, and it plans the agenda, writes an outline, builds the deck from the slide templates and exports it to Google Slides | v1 |
| [`tokens.css`](tokens.css) | Every token as a CSS variable (`--yac-blue`, `--yac-slide-title-size`, …), generated | — |

## Using the tokens

On a web page:

```html
<link rel="stylesheet" href="tokens.css">
<style>
  body { font-family: var(--yac-font-sans); background: var(--yac-paper); color: var(--yac-midnight); }
  .eyebrow { color: var(--yac-blue); letter-spacing: 4px; text-transform: uppercase; font-weight: 700; }
</style>
```

In code, read the `tokens.json` files directly. In Claude Design, which allows only inline hex values, copy from the templates in [`slides/templates/`](slides/templates/).

After changing any `tokens.json` or slide template, rebuild the generated files:

```bash
node scripts/build.mjs     # writes tokens.css and slides/preview.html; no dependencies
```

## Updating the Claude Design system

The Claude Design copy is generated from this repo. After a change here, run `node scripts/build-claude-design.mjs` and ask Claude to republish `dist/claude-design/project/` to https://claude.ai/artifact/UtzAMSDiAoCHeSE4cxQZ8T. Its brand-book text is `scripts/claude-design-readme.md`. Images live in that system's asset store; a new or changed image is uploaded there first and its id recorded in the script's `ASSETS` table.

## The biweekly deck skill

Executive officers prepare the biweekly deck by talking to Claude Code in this repo; the `yac-biweekly` skill does the rest. It reads the exec and leadership minutes and the last meeting's notes, asks the exec what is missing, writes a short outline to `biweekly/YYYY.MM.DD/outline.md`, builds the deck as a Claude Slides artifact from [`slides/templates/`](slides/templates/), takes changes, and exports to Google Slides when the exec says "export". Working files live in `biweekly/`, which is gitignored (it holds member names).

The export uses [`scripts/export-gslides.mjs`](scripts/export-gslides.mjs), which needs Playwright with Chromium (`npm i -g playwright`; cloud sessions already have Chromium under `/opt/pw-browsers`). It replaces the older Claude Chat skill `yac-biweekly-deck-brief`, which stopped at a Claude Design brief.

## Conventions

- **One directory per part of the system** (a mascot, a logo, a colour palette, a slide template). Each has its own `README.md` covering what it is, when to use it, the rules, and how to edit it.
- **Source plus exports.** Keep the editable source (code, SVG or design file) next to ready-to-use exports (PNG and so on), so people who just need a file don't have to build anything.
- **Tokens as JSON.** Colours and other values go in a `tokens.json` so apps and slides can share exact values. `tokens.css` is generated from them.
- **Record decisions.** Note what was tried and why it was kept or dropped, so future YAC members don't redo the same debates.
- **NCSSM's marks are NCSSM's.** Copy master files unchanged and note where they came from; don't redraw them.

## Adding to the system

1. Create a new top-level directory, such as `social-templates/`.
2. Add a `README.md` that follows the structure of [`yakkety-mascot/README.md`](yakkety-mascot/README.md).
3. If it has values, add a `tokens.json` and wire it into [`scripts/build.mjs`](scripts/build.mjs).
4. Add a row to the table above.
