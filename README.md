# Shubham Gupta personal website

AI-generated website draft, based on Shubham’s supplied biodata and website plan.

A single page with a life timeline, a gallery of 21 supplied personal photographs, a three-question mini game, family story, partner expectations, draft non-negotiables, and contact details. No installation or build step is needed.

## Preview

Run a static web server from this folder and open its local address. For example:

```sh
python3 -m http.server 4174 --bind 127.0.0.1
```

Then visit http://127.0.0.1:4174. JavaScript modules need HTTP, so use the local server rather than opening index.html directly from Finder.

## Make it personal

The **Edit preview** button opens a panel to preview up to eight extra photos or videos, write captions, and edit non-negotiables. Files are previewed on your device; nothing is uploaded. These extra preview edits last for the current browser session and reset on reload. The 21 saved photos persist after reload. This panel is a preview convenience, not a publishing system.

The gallery contains all 21 supplied photos, saved permanently in the website. Eight appear initially; View all photos expands the complete set. Every photo is also reachable in the larger viewer using arrow buttons or keyboard arrows. WebP images and smaller thumbnails keep loading light. The three initial non-negotiables are suggested draft wording requested by Shubham, not verified personal requirements. They can be edited or removed; leaving the field empty hides that section.

To keep permanent changes, edit the content in `index.html`, photo captions and ordering in `photo-data.js`, and the corresponding defaults in `script.js`, and place chosen media in `assets/`. When publishing, remove the editing controls if desired. This site has only been served locally; it has not been deployed publicly.

## Files

- `index.html`: page content and accessible dialogs.
- `styles.css`: responsive layout, illustrations’ presentation, and motion controls.
- `script.js`: gallery, contact controls, local preview editor, and motion preferences.
- `game.js`: the self-contained three-question side quest.
- `photo-data.js`: saved gallery photos, ordering, captions, alternative text, and thumbnail focal points.
- `assets/`: local WebP photos and thumbnails, original SVG artwork, and favicon; no external image or font service.

The game stores no answers and makes no compatibility predictions. The page contains no trackers, analytics, external libraries, or automatic messages. The contact dialog exposes only Shubham’s supplied number; relatives’ numbers, exact birth time, and salary are absent.

## Accessibility and motion

Uses native buttons and modal dialogs, visible focus indicators, a skip link, keyboard-operable gallery controls, and reduced-motion support. Motion can also be paused from the footer. Uploaded videos do not autoplay; they use native playback controls. If publishing videos with speech, add captions or a transcript.

## Photo asset preparation

All 21 source files were converted successfully. The source files were left untouched. EXIF orientation was corrected, colors normalized where needed, and embedded metadata removed from website copies. Full viewer images have a longest edge of at most 2000 pixels; thumbnails at most 700 pixels, without upscaling. Per-photo dimensions and filenames are recorded in `assets/photo-manifest.json`.

Original files totaled 34,441,835 bytes. Full viewer images total 7,265,020 bytes, and thumbnails total 1,197,674 bytes: 8,462,694 bytes combined, a 75.43% reduction. Outputs are in `assets/photos/`.

Gallery checks passed for all 21 full images, next/previous navigation, keyboard focus restoration, expansion/collapse, reload and reset persistence, and 390px/320px layouts.
