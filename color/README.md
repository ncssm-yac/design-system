# Colour

The YAC's palette is NCSSM's: **Blue** and **Orange** are the school's official brand colours, and the YAC uses them the way the Claude Design slide decks do, with Blue as the ground and Orange as the spark. A small set of neutrals and dark surfaces, all taken from the decks, does the rest.

Status: **v1** (October 2026). Values: [`tokens.json`](tokens.json), or `--yac-*` variables in [`../tokens.css`](../tokens.css).

## Brand

| Token | Hex | Used for |
| --- | --- | --- |
| Blue | `#346094` | NCSSM primary (Pantone 653 C). Covers, section dividers, labels, callout panels. |
| Orange | `#D57E00` | NCSSM accent (Pantone 145 C). The dot, accent rules, the highlighted item, big numbers. |
| Orange deep | `#A05F00` | Orange for small text on light backgrounds. New in this system. |
| Midnight | `#1C2633` | Body text. Background for the Catalyst slides and photo grids. |
| Paper | `#F7F5F0` | Default slide background. Text on Blue and Midnight. |
| White | `#FFFFFF` | Cards and panels on Paper. |

## Neutrals and dark surfaces

| Token | Hex | Used for |
| --- | --- | --- |
| Slate | `#5A6878` | Secondary text, footers, placeholder copy |
| Mist | `#C9D3E0` | Hairlines under column headers, pill outlines, dashed placeholders |
| Fog | `#E2E6EC` | Outlined-card borders, placeholder image fills |
| Blue tint | `#9FB4CF` | Chart bars that aren't the highlight |
| Blue deep | `#2B5280` | Image frame behind text on photo dividers |
| Night | `#2B3A50` | Photo placeholders on Midnight |
| Haze | `#A9B6C8` | Secondary text on Midnight |

## Other NCSSM colours

NCSSM's brand guide also lists these. The YAC hasn't used them yet. Reach for them only when you need more categories than Blue and Orange can carry (a chart with five series, say), and check contrast first.

| Token | Hex | Pantone |
| --- | --- | --- |
| Cool gray | `#8A8A8D` | Cool Gray 8 C (NCSSM's second primary) |
| Light blue | `#99CAEA` | 291 C |
| Purple | `#853175` | 512 C |
| Gold | `#F4C300` | 7406 C |
| Green | `#4B8B2A` | 363 C |

## Pairings that pass

Text contrast (WCAG 2.x). AA needs 4.5:1 for body text and 3:1 for large text (24px bold or 32px regular on screen).

| Text ↓ / background → | Paper | White | Blue | Midnight |
| --- | --- | --- | --- | --- |
| Midnight | 14.0 | 15.3 | — | — |
| Blue | 5.9 | 6.5 | — | 2.4 ✗ |
| Slate | 5.2 | 5.7 | 1.1 ✗ | 2.7 ✗ |
| Orange | 2.8 ✗ | 3.1 large only | 2.1 ✗ | 5.0 |
| Orange deep | 4.7 | 5.1 | — | — |
| Paper | — | — | 5.9 | 14.0 |
| Haze | — | — | 3.2 large only | 7.4 |

## Rules

**Do**
- Make Paper the default. Use Blue for covers and section dividers, and Midnight for the Catalyst and photo slides. That gives a deck three backgrounds and a rhythm.
- Use Orange as the one accent: a dot, a 6px rule, the current agenda item, one big number. If more than a couple of things on a slide are orange, nothing stands out.
- Use Orange deep instead of Orange for text smaller than 36px bold on light backgrounds.
- Keep text on Blue in Paper.

**Don't**
- Put Orange text on Blue (2.1:1), or Slate or Blue text on Midnight.
- Introduce new blues or greys. If something needs a new value, add a token here first.
- Confuse Orange with Yakkety's Toffee (`#E8873A`). Toffee is the mascot's colour and stays on the mascot; the YAC accent is Orange.
- Put Yakkety on Blue or Orange slides. The mascot sits on Paper, White or its cream tile (see [`yakkety-mascot/`](../yakkety-mascot/)).

## Where the values came from

| Value | Source |
| --- | --- |
| Blue, Orange, the other NCSSM colours | NCSSM Communications Kiosk, *Brand & Logos* (the "Branding Kit PDF Overview" in the YAC Brand Assets Drive folder) |
| Midnight, Paper, the neutrals and dark surfaces | The Claude Design decks: *YAC Biweekly — Sept 23*, *YAC Biweekly — Oct 7*, *Yakety AI Coding Workshop* |
| Orange deep | Added here: Orange darkened until it passes 4.5:1 on Paper |
