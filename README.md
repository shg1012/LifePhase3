# Shubham Gupta personal website

AI-generated website draft, based on Shubham’s supplied biodata and website plan.

A single page with a life timeline, a gallery of 21 supplied personal photographs, a three-question mini game, family story, partner expectations, draft non-negotiables, and contact details. No installation or build step is needed.

## Preview

Run a static web server from this folder and open its local address. For example:

```sh
python3 -m http.server 4174 --bind 127.0.0.1
```

Then visit http://127.0.0.1:4174. JavaScript modules need HTTP, so use the local server rather than opening index.html directly from Finder.

## Content and publishing

The live website is https://shg1012.github.io/LifePhase3/. GitHub Pages publishes updates pushed to the repository.

The gallery contains all 21 supplied photos. Eight appear initially; View all photos expands the complete set. Every photo is reachable in the larger viewer using arrow buttons or keyboard arrows. WebP images and smaller thumbnails keep loading light.

The three non-negotiables are suggested draft wording requested by Shubham. Edit that section directly in `index.html` when the wording is ready. Edit photo captions and ordering in `photo-data.js` and place new photos in `assets/`. The website has no visitor editing or file upload feature.

## Files

- `index.html`: page content and accessible dialogs.
- `styles.css`: responsive layout, illustrations’ presentation, and motion controls.
- `script.js`: gallery, contact controls, and motion preferences.
- `game.js`: the self-contained three-question side quest.
- `photo-data.js`: saved gallery photos, ordering, captions, alternative text, and thumbnail focal points.
- `assets/`: local WebP photos and thumbnails, original SVG artwork, and favicon; no external image or font service.

The game stores no answers and makes no compatibility predictions. The page contains no trackers, analytics, external libraries, or automatic messages. The contact dialog exposes only Shubham’s supplied number; relatives’ numbers, exact birth time, and salary are absent.

## Accessibility and motion

Uses native buttons and modal dialogs, visible focus indicators, a skip link, keyboard-operable gallery controls, and reduced-motion support. Motion can also be paused from the footer.

## Photo asset preparation

All 21 source files were converted successfully. The source files were left untouched. EXIF orientation was corrected, colors normalized where needed, and embedded metadata removed from website copies. Full viewer images have a longest edge of at most 2000 pixels; thumbnails at most 700 pixels, without upscaling. Per-photo dimensions and filenames are recorded in `assets/photo-manifest.json`.

Original files totaled 34,441,835 bytes. Full viewer images total 7,265,020 bytes, and thumbnails total 1,197,674 bytes: 8,462,694 bytes combined, a 75.43% reduction. Outputs are in `assets/photos/`.

Gallery checks passed for all 21 full images, next/previous navigation, keyboard focus restoration, expansion/collapse, reload persistence, and 390px/320px layouts.
