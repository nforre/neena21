<!--
Guidance for AI coding agents working on this repository (neena21).
Keep these concise and focused on discoverable, actionable patterns.
-->

# Copilot instructions — neena21

This is a tiny, static, client-side scrapbook web page (single-page) intended to be edited by hand and deployed as static files (GitHub Pages, Netlify, etc.). Keep suggestions tightly scoped to visible files and avoid adding backend code or heavy tooling unless requested.

Core files to inspect
- `index.html` — single page markup and semantic IDs used by the JS (see below).
- `js/script.js` — small app logic; primary source of interactive behavior and configuration.
- `css/styles.css` — styling; follows simple CSS variables at top for color tokens.

Quick architecture overview
- Single-page, client-only app. There is no build step: files are plain HTML/CSS/JS and intended to be deployed as-is.
- `js/script.js` contains a small "pages" array with 21 entries (replaceable) and three top-level config constants (`HER_NAME`, `YOUR_NAME`, `PLAYLIST_URL`).
- The UI wires DOM elements by ID (for example `#photo`, `#page-title`, `#page-text`, `#prevBtn`, `#nextBtn`, `#dots`). Prefer editing these IDs in the DOM and JS consistently.

Project-specific conventions and patterns
- Content is stored inline in `js/script.js` through the `pages` array; images referenced there use paths like `assets/images/photo1.jpg`.
- The project expects exactly 21 slots by default (Array.from({length:21})). If you change the length, ensure UI labels (`pageCounter`) and any UX math still work.
- Photo fallback: broken image URLs fall back to a `via.placeholder.com` URL constructed in `script.js`. Maintain that pattern when changing image handling.

What to change and how
- To add or edit content, modify `pages` in `js/script.js` (title, text, img). Example entry:
	{ title: "reason #1", text: "short memory or joke", img: "assets/images/photo1.jpg" }
- To update deploy-time QR behaviour, `pageQR` is generated from `window.location.href`; avoid changing that unless adding build-time static QR generation.
- To change colors, edit the CSS variables at the top of `css/styles.css` (for example `--accent`, `--bg`).

Developer workflows & checks
- No dependency manager or build. Open `index.html` in a browser for manual testing. Use browser DevTools to inspect console errors (image load errors are swallowed and replaced by the placeholder).
- Keyboard/navigation patterns are deliberate: ArrowLeft/ArrowRight, click dots, swipe gestures on touch devices. Preserve these handlers when refactoring.

When adding code
- Keep code minimal and client-only. If adding new JS, prefer to keep it in `js/script.js` or a new file under `js/` and include it from `index.html` with `defer`.
- Respect existing DOM IDs and class names used by CSS and JS — for example changing `#photo` or `.dot` requires updates across files.

Examples of concrete tasks you may be asked
- "Add social-share buttons" — add markup to `index.html`, styles in `css/styles.css`, and minimal handlers in `js/script.js` that open external links in a new tab.
- "Increase slots to 30" — update Array.from length in `js/script.js` and ensure the dots UI scales (it will, but verify layout at multiple widths).

Edge cases and gotchas
- There is no bundler — use only browser-compatible JS features (ES6 is fine). Avoid Node-only APIs.
- The `PLAYLIST_URL` is used to create a QR image via an external API (`api.qrserver.com`). If changing this, ensure the QR URLs are URL-encoded.

If unsure, ask these clarifying questions
1. Do you want a build step (e.g., bundler, minifier) or keep static files?
2. Should media be stored in the repo or served from an external CDN?

Feedback
If anything here is unclear or you want more detail on testing, deployment, or content conventions, tell me which area to expand.
