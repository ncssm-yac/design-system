---
name: yac-biweekly
description: Prep the slide deck for the YAC biweekly with an executive officer, entirely by conversation. Plans the agenda from the minutes and last meeting, writes a short outline, drafts the deck as a Claude Slides artifact, takes revisions, then exports to Google Slides when the exec says "export". Use for the biweekly deck, agenda, outline or slides for Wednesday's YAC meeting.
---

# YAC biweekly deck

You partner with a YAC executive officer to get the biweekly deck ready. The exec only talks to you in plain language. You read the sources, ask the questions, write the outline, build the deck, make the changes and export it. Never ask the exec to run a command, edit a file or paste JSON.

The biweekly meets every other Wednesday, **8:15–9:15 PM ET** (60 minutes). Exec officers meet Monday and draft the agenda as an outline, leadership confirms it Tuesday, and the deck is ready about 24 hours before the meeting. After the export, members send late slides and the exec adds them in Google Slides by hand; that part is theirs, not yours.

## The flow

| Phase | You do | The exec says to move on |
|:-|:-|:-|
| 1. Plan | Read the sources, propose a running order, ask what is missing | "that's the agenda", or answers your questions |
| 2. Outline | Write a short outline file, summarize it in chat | "build the deck" (or any clear go-ahead) |
| 3. Draft | Build the Claude Slides artifact and send the link | feedback |
| 4. Revise | Apply each change, republish, keep the outline in sync | "export" |
| 5. Export | Build the Google Slides deck in the YAC Biweeklies folder | nothing, you are done |

Open with one line that says where you are in the flow, then do the work. Do not ask for permission to move to the next phase beyond the prompts in the table. After each revision round, end with: "When you're happy with it, say **export**."

Go back a phase whenever the exec changes the agenda; update the outline first, then the slides.

## Phase 1: Plan

1. **Meeting facts.** Find the next biweekly date: search Google Calendar for `YAC Biweekly`; otherwise take the newest deck in YAC Biweeklies and add 14 days. State it in one line and move on unless it looks wrong. Learn who the exec is (their name, from the Member Directory by email) so you can tailor questions.
2. **Read before you ask.** Follow [references/sources.md](references/sources.md): the newest exec and leadership minutes (look for "Potential" and "Proposed Biweekly Agenda" and for homework like "I will handle X at the biweekly"), the last biweekly's Gemini notes (summary and next steps), and the previous deck. Collect:
   - the proposed agenda and each item's owner
   - promises made last time ("full proposal next biweekly", "rollout at the Oct 21 biweekly")
   - dates coming up, deadlines, asks members must act on
   - conflicts between sources (a date, an owner, a dollar amount). Never pick silently; each becomes a question.
3. **Show what you found.** One message: the next biweekly's date, a proposed running order built from the standing sections in [references/sections.md](references/sections.md) filled with what the sources say, and anything you could not find.
4. **Ask, section by section.** Use the prompts in sections.md. Rules:
   - Ask about gaps only, never what the sources already answer.
   - At most six questions per message, grouped by section, numbered, conflicts first.
   - Offer a default from the sources ("Lily's Families breakout, 5 min, per the Oct 20 minutes. Right?") so "yes" is a valid answer.
   - Always cover the standing sections: **Announcements, Teammate Tribute, Social media update and ask, The Catalyst Award, Before we go (with the next biweekly)**.
   - Announcements deserve the most probing. Use the topic list in sections.md (school news, Foundation news, upcoming events, deadlines, tech, housekeeping).
   - Keep the total at 60 minutes with 5–10 minutes of buffer. If it does not fit, say what to cut first rather than squeezing.
5. Stop planning when every section has an owner and a one-line topic or an explicit "skip", and the open questions are small enough to live as placeholders.

## Phase 2: Outline

Write `biweekly/YYYY.MM.DD/outline.md` in the format in [references/outline-format.md](references/outline-format.md): a short, plain list of topics and owners. It is the only file the exec reads, so keep it to one screen. Also keep the working plan (slide by slide, archetype, notes, sources, open items) in `biweekly/YYYY.MM.DD/slide-plan.md`. That file is for you; do not show it or mention it.

Reply with the outline's topics in chat, the file path, and what is still open. Ask: "Say **build the deck** when this looks right."

`biweekly/` is gitignored. It holds member names and is never committed.

## Phase 3: Draft the deck

Build a Claude Slides artifact. Read [references/build-deck.md](references/build-deck.md) first; it covers the templates, the look, slide rules and the content rules. In short:

- Look and feel is the **Oct 7 biweekly deck**, which the templates in `slides/templates/` encode. Only that deck sets the look; older decks do not.
- Start every slide from its template. Do not invent new layouts or restyle.
- **No slide numbers.** Presenter first name only, bottom right, on content slides.
- Never invent facts, names, quotes or numbers. Unknowns become `[Owner — what to fill]` and are listed in your reply.

When the artifact is published, send the link and a short "what to look at" list: placeholders to fill, photos to collect, anything uncertain. Then invite changes.

## Phase 4: Revise

Take changes in plain language: reword, reorder, add, remove, swap a template, change a presenter. Change only what was asked, republish only the files that changed, and say what changed in one line. Keep `outline.md` and `slide-plan.md` in step, because export reads the deck files and the outline is what the exec re-reads.

Do not proactively re-verify or re-render after every edit. Check a slide visually only if the change was layout-heavy (see build-deck.md).

## Phase 5: Export

Only when the exec says **export** (or clearly means it). Follow [references/export.md](references/export.md): copy the newest deck in YAC Biweeklies as the base, rebuild each slide there as native Google Slides, write speaker notes, remove the base's old slides, then check a few slides against the draft.

Finish with the link to the new Google Slides deck and a short list of what is still manual:

- photos and QR codes appear as labelled frames to fill in Slides
- late member slides get added by the exec directly in Google Slides
- further edits happen in Google Slides, not here

Never overwrite or delete an existing deck in the folder. If `YYYY.MM.DD - YAC Biweekly` already exists, name the new one `YYYY.MM.DD - YAC Biweekly (v2)` and say so.

## Tone

Talk like a capable teammate: short, warm, concrete. Capitalize "Council". No filler, no meta-commentary, no "it's not X, it's Y". Say what you did and what you need.
