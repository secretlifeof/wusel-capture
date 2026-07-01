# @wusel-capture/extension — Wusel Capture

A Chrome (MV3) extension that screenshots the current page, lets you annotate the
image, and **sends it to Claude Code in VS Code** (or exports an annotated PNG
plus a JSON file of browser context).

It reuses the Wusel design system (shared Tailwind theme + Phosphor icons) so it
looks and feels like the app.

## What it does

1. Click the toolbar icon and pick a capture mode:
   - **Full page** — full page beyond the viewport (via the Chrome Debugger API).
   - **Visible area** — the visible viewport (`captureVisibleTab`).
   - **Select region** — drag a rectangle to capture a region.
2. The screenshot opens in an editor tab. Annotate it:
   - **Text**, **Pencil** (freehand), **Arrow**, **Rectangle**, and **Redact** (pixelated).
   - Color palette, undo/redo, delete; drag to move, drag handles to resize.
3. Write a free-form note for the AI in the side panel.
4. **Send to Claude Code** — opens Claude Code in VS Code with a prompt pre-filled
   that references the saved annotated screenshot + context JSON. Press Enter in
   Claude Code to start. (Or **Download image + JSON** to hand off manually:
   `wusel-capture-<timestamp>.png|jpg` + `.json`.)

## Send to Claude Code — two tiers

- **Tier A (no install):** the extension downloads the capture into
  `wusel-capture/<id>/` under your Downloads folder, then opens the documented
  `vscode://anthropic.claude-code/open?prompt=…` deep link. The prompt references
  the downloaded files by absolute path. Chrome shows a one-time "Open Visual
  Studio Code?" prompt.
- **Tier B (native host):** install `@wusel-capture/host`. The extension hands the
  capture to the native host, which maps the page URL to a local project folder,
  writes the capture into `<project>/.wusel-capture/<id>/`, and opens the deep link
  itself (no browser prompt). See that package's README to install.

The Send button uses Tier B when the host is installed and silently falls back to
Tier A otherwise.

## Build & install

```bash
pnpm --filter @wusel-capture/extension build
```

Then in Chrome: open `chrome://extensions`, enable **Developer mode**, click
**Load unpacked**, and select `packages/wusel-capture/dist`.

For iterative development:

```bash
pnpm --filter @wusel-capture/extension dev
```

This rebuilds on change. Reload the unpacked extension in `chrome://extensions`
after each rebuild (MV3 has no hot reload for the service worker / content scripts).

## Architecture

- `popup.html` / `src/popup` — mode chooser. Sends a `CAPTURE` message to the service worker.
- `src/background/service-worker.ts` — performs the capture, gathers page info +
  diagnostics from the bridge, stores the payload in IndexedDB, opens the editor,
  and (for Send) talks to the native host.
- `editor.html` / `src/editor` — canvas annotation editor + side panel + export + send.
- `src/content/collector.ts` — **MAIN world**, document_start: patches console and
  wraps fetch/XHR to buffer console errors + failed requests.
- `src/content/bridge.ts` — **ISOLATED world**: owns `chrome.runtime` messaging,
  answers page-info requests, and drives the region-selection overlay.

The two contexts hand off the screenshot through IndexedDB (`src/storage.ts`)
because full-page PNGs exceed `chrome.storage.session` quota.

## Privacy

- No cookies, auth headers, request/response bodies, or storage values are captured.
- Token-like query parameters in captured request URLs are redacted (`[REDACTED]`).
- The **Redact** tool pixelates sensitive regions of the screenshot before send/export.

## Known limitations

- Cannot capture internal pages (`chrome://`, the Chrome Web Store).
- Full-page capture briefly shows Chrome's "started debugging this browser" banner
  and fails if DevTools is already attached to the tab.
- **Select region** captures within the current viewport only.
- Diagnostics only include events that occurred after the page loaded (the
  collector installs at `document_start`); requests from web workers are not seen.
- On tabs open before the extension was installed, reload the page so the content
  scripts inject (otherwise only basic page metadata is captured).
