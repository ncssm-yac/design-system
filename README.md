# NCSSM YAC Design System

<img src="yakkety-mascot/icon/png/yakkety-icon-128.png" width="72" alt="Yakkety app icon">

The shared home for the YAC's visual identity: mascots, icons, colour tokens and the rules for using them. If you're making something for YAC (slides, a website, an app, a social post), start here so everything looks like it belongs together.

## What's inside

| Directory | What it is | Status |
| --- | --- | --- |
| [`yakkety-mascot/`](yakkety-mascot/) | Yakkety, the YAC's AI secretary: a Toffee-coloured yak, with five expressions, app icons, a favicon, colour tokens, usage rules and the research behind it | v1, locked |

## Conventions

- **One directory per part of the system** (a mascot, a logo, a colour palette, a slide template). Each has its own `README.md` covering what it is, when to use it, the rules, and how to edit it.
- **Source plus exports.** Keep the editable source (code, SVG or design file) next to ready-to-use exports (PNG and so on), so people who just need a file don't have to build anything.
- **Tokens as JSON.** Colours and other values go in a `tokens.json` so apps and slides can share exact values.
- **Record decisions.** Note what was tried and why it was kept or dropped, so future YAC members don't redo the same debates.

## Adding to the system

1. Create a new top-level directory, such as `slide-template/`.
2. Add a `README.md` that follows the structure of [`yakkety-mascot/README.md`](yakkety-mascot/README.md).
3. Add a row to the table above.
