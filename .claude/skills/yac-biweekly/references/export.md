# Export to Google Slides

Run this only when the exec says **export**. The exec does nothing in this phase except read your final message. The Claude Slides page has its own "Send to Google Slides" button, but that is a human click; you build the Google deck yourself with the Slides connector so nothing is left for the exec to do.

How it works: `scripts/export-gslides.mjs` renders each slide of the draft in headless Chromium at 1920 x 1080, measures every box, rule and text block, and writes Google Slides `batchUpdate` requests in chunks of about 16 KB. You send the chunks, in order, into a copy of an existing biweekly deck so the file has the same page size and theme. Tested end to end on the Oct 21 draft: the Google slides match the draft closely.

Budget for it: a 16-slide deck is about 12 chunks, and each chunk costs you roughly 12k tokens to read and send. That is expected. Do not shortcut it by retyping or editing the requests.

## Steps

1. **Base deck.** Search Drive for Google Slides decks in *YAC Biweeklies* (folder ID in sources.md) and take the newest `YYYY.MM.DD - YAC Biweekly`.
2. **Target name.** `YYYY.MM.DD - YAC Biweekly`. If that title already exists in the folder, use `YYYY.MM.DD - YAC Biweekly (v2)` (then v3). Never overwrite or delete a deck the exec may have edited.
3. **Copy.** `copy_file` the base into *YAC Biweeklies* with the target name. Note the new deck's `id` and `viewUrl`.
4. **Read the copy.** `read_presentation` with fields `pageSize` and `slides(objectId,slideProperties.layoutObjectId)`. Record:
   - the page size (width x height in EMU)
   - the **first slide's layout ID** (use it for every new slide; a master can lack the predefined `BLANK` layout, as the Oct 7 deck's does)
   - every existing slide ID. These are the base's old content, deleted in step 8.
5. **Generate requests.** From the repo root:

   ```bash
   node scripts/export-gslides.mjs --deck biweekly/YYYY.MM.DD/deck --out biweekly/YYYY.MM.DD/.export --page <width>x<height> --layout <layout id> --png biweekly/YYYY.MM.DD/.preview
   ```

   It prints the chunk list and writes `chunk-NN.json`, `plan.json` and `notes.json`. Slide ids in the new deck are `slide01`, `slide02`, ... in deck order. `--only id,id` exports just those slides (their ids keep their deck position); use it to redo a single slide after a fix.
6. **Push the chunks.** For each `chunk-NN.json`, in order: print the file with Bash (`cat`), then send exactly that array as `requests` in one `update_presentation` call. Do one chunk per call and never combine or edit chunks; a chunk can end in the middle of a slide, and the next chunk continues it. If a call fails, read the error, fix the cause, and resend. When a slide is half built, delete it (`deleteObject` on `slideNN`), re-export that slide with `--only`, and send its chunks again. Never leave a half-built slide.
7. **Speaker notes.** `read_presentation` with fields `slides(objectId,slideProperties.notesPage.notesProperties.speakerNotesObjectId)`, then one `update_presentation` call with an `insertText` request (`insertionIndex` 0) per new slide, using the speaker-notes object ID and the text in `notes.json` (skip slides without notes).
8. **Remove the base's old slides.** One `update_presentation` call with a `deleteObject` request for each old slide ID from step 4. Only those; never a `slideNN`. (This can share a call with step 7.)
9. **Check.** Fetch thumbnails (`read_slide_page_thumbnail`, `thumbnailProperties` `{"thumbnailSize":"MEDIUM"}`, `pageId` `slideNN`) for the cover, the agenda, the Catalyst reveal and the closing slide. Download each `contentUrl` with curl, and look at it next to the matching PNG in `.preview/`. Fix anything wrong (text clipped, a block missing, wrong colors) by re-exporting only that slide.
10. **Tell the exec.** The link (`viewUrl` from the copy), the slide count, and what is still manual (below).

## What the exec still does by hand

Say these plainly, in a short list, after the link:

- **Photos and QR codes** appear as labelled frames (`[Photo — add in Slides]`, `[QR code]`). The Slides API can only take an image from a public URL, so drop them in.
- **Late member slides**: paste them in at the right spot.
- Any further edit happens in Google Slides.

Also mention the small known differences from the draft: uppercase labels are a little less widely spaced, the Catalyst glow is missing, and some card corners are square.

## If something fails

- No Drive or Slides connector, or access denied: tell the exec which one and stop. Do not retry blindly.
- No Chromium or Playwright: use the global install (`npm i -g playwright`; Chromium is usually under `/opt/pw-browsers`; never run `playwright install`). If it cannot run, say the export is blocked and offer the artifact's own **Share → Export → Send to Google Slides** as the manual fallback.
- The copy worked but later steps failed: leave the copy in place, tell the exec its link and that it is incomplete, and offer to retry into a new `(v2)` copy. Do not delete it.

## Limits to remember

The Slides API has no letter-spacing, no per-corner radii, no shadows or gradients, and images need a public URL. The exporter therefore draws photos, QR codes and shadows as plain frames and approximates rounded corners. Everything else (positions, fonts, sizes, colors, line spacing, dashed frames, notes) is carried over.

If someone later wants photos and QR codes placed automatically, the fix is to host them at a public URL (for example a small public bucket) and have the exporter emit `createImage` requests.
