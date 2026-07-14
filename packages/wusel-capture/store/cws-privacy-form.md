# Chrome Web Store — "Personvern" tab answers

Copy-paste source for the Privacy tab of the Wusel Capture store submission.
Every answer below was written against the actual source code. Keep it in sync if the
extension's behaviour changes — these are certifications, not marketing copy.

**Upload `wusel-capture-0.1.0.zip` (rebuilt without `activeTab`) BEFORE filling this in.**
The form generates one justification field per permission in the uploaded manifest.

---

## Beskrivelse av enkeltformål (831 / 1000)

Wusel Capture has a single purpose: to let a developer screenshot the web page they are currently viewing, annotate it, and hand that annotated screenshot — together with the page's technical context — to their own local AI coding assistant (Claude Code or Codex in VS Code) so it can implement the change.

Everything in the extension serves that one flow: capture the page (full page, visible viewport, or a user-drawn region), draw annotations (text, arrows, boxes, pixelated redaction) and a note on it, then deliver the result. Delivery is either a file saved to the user's own disk plus a vscode:// deep link, or — if the user installed our optional open-source native host — written directly into the matching local project folder.

No capture is ever sent to us. The extension has no backend, no analytics and no telemetry.

---

## Begrunnelse for scripting (840 / 1000)

Used for exactly one call. chrome.scripting.executeScript() injects a small self-contained function (collectPageInfo) into the tab the user has just captured, and only in response to that user-initiated capture.

It returns only the technical context needed to describe the capture to the AI assistant: page URL, document title, user agent, viewport size, device pixel ratio, scroll position, screen size, browser name and version, platform and language. It does not read DOM content, page text, form values, cookies or storage.

We inject programmatically rather than relying only on the static content script because a tab that was already open when the extension was installed or updated still hosts a stale content script. Injecting on demand guarantees the current bundled code runs, so a capture is never silently missing its context.

---

## Begrunnelse for tabs (785 / 1000)

Needed to identify and act on the single tab the user is capturing:

• chrome.tabs.query({active:true, currentWindow:true}) — from the popup, to learn which tab and window the user wants to capture.
• chrome.tabs.captureVisibleTab(windowId) — the viewport screenshot, and the source image a region crop is cut from.
• chrome.tabs.sendMessage(tabId, …) — to start the region-selection overlay, and to fetch that tab's buffered diagnostics.
• chrome.tabs.get(tabId) — fallback to read the tab's URL and title if script injection fails.
• chrome.tabs.create() — to open the extension's own annotation editor page.

We never enumerate tabs the user is not capturing, never read browsing history, and never observe tabs in the background. Each call happens because the user clicked Capture.

---

## Begrunnelse for downloads (782 / 1000)

Two uses, both writing to the user's own disk, both user-initiated.

1. Delivering a capture. When the optional native host is not installed, we save the annotated PNG with chrome.downloads.download({saveAs:true}) so the user chooses the location, then call chrome.downloads.search({id}) once to resolve that file's absolute on-disk path. We need that path because it is interpolated into the vscode:// deep link — the assistant has to know where the image is in order to open it.

2. The explicit "Download image + JSON" button in the editor, which exports the annotated PNG and the capture context as files.

The URL passed to chrome.downloads.download is always a blob: URL created inside the extension from the image the user just annotated. We never download from a remote URL.

---

## Begrunnelse for storage (726 / 1000)

chrome.storage.local holds only two small UI preferences, so they survive between sessions:

• wusel.providerId — which assistant the user picked in the "Send to" menu (Claude Code or Codex).
• wusel.claudeSessionId — an optional Claude Code session id the user may type in, so a capture goes into an existing session instead of a new one.

That is the entire contents of chrome.storage. No images, no page content, no URLs, no personal data.

Capture payloads are held in the extension's own IndexedDB rather than chrome.storage, because a full-page PNG exceeds the storage quota. They exist only to hand a capture from the popup to the editor tab, never leave the machine, and are pruned automatically to the 10 most recent.

---

## Begrunnelse for debugger (876 / 1000)

Used for one feature only: the full-page screenshot.

A full-page screenshot must include content below the fold, and no standard extension API can do that — chrome.tabs.captureVisibleTab returns only the visible viewport. The sole way to capture beyond the viewport is the DevTools Protocol command Page.captureScreenshot with captureBeyondViewport:true, which requires the debugger permission.

The flow is tightly scoped. When — and only when — the user clicks "Full page", we call chrome.debugger.attach on that one tab, send exactly two commands (Page.getLayoutMetrics to measure the page, then Page.captureScreenshot to render it), and detach in a finally block so the session always ends with the capture.

No other CDP domains are enabled. We do not use Network, DOM, Input or Runtime. We never attach to a tab the user is not capturing, and never hold a session open.

---

## Begrunnelse for nativeMessaging (829 / 1000)

Powers an optional open-source companion host (com.wusel.capture) that the user installs deliberately via npx. The extension is fully functional without it and falls back silently to a normal download if it is absent.

Its only purpose is to remove friction. Without the host, sending a capture means a "Save file" dialog plus an "Open VS Code?" prompt. With it, we call chrome.runtime.sendNativeMessage once per send, passing the annotated PNG and the capture JSON. The host writes those two files into the user's matching local project folder and opens the capture in their locally installed VS Code.

It is a one-shot message, not a persistent port, and only runs when the user clicks Send. The host is MIT-licensed, lives in the same public repository, runs entirely on the user's machine, and sends nothing over the network.

---

## Begrunnelse for Vertstillatelse — `<all_urls>` (988 / 1000)

Wusel Capture screenshots and annotates whatever page the developer is working on. That page can be any URL — localhost, a staging domain, a customer's production site — so a fixed host list is impossible. A narrower match pattern would simply mean the extension fails on the page the user needs it for.

<all_urls> is required by the whole capture flow: the content scripts that draw the region-selection overlay and buffer page diagnostics, chrome.scripting.executeScript for page context, chrome.tabs.sendMessage, captureVisibleTab, and chrome.debugger.attach for full-page capture.

One component does run on every page: a small collector holding a rolling in-memory buffer of the last 100 console errors and failed network requests, so a capture can show the assistant what went wrong. It records no headers, cookies or request/response bodies, redacts token-like URL parameters, and is discarded on unload. It is read only when the user takes a capture, and never leaves the device.

---

## Bruker du ekstern kode?

**→ Nei, jeg bruker ikke Ekstern kode**

(No justification field appears for "Nei". Verified: everything is bundled by esbuild/Vite;
`modulePreload.polyfill` is disabled to avoid inline script; the Geist font ships in
`public/fonts/`; there is no `eval`, no `new Function`, no dynamic `import()`, no wasm,
no CDN and no remote `<script>`. The only `fetch()` in the extension targets a `data:` URL.)

---

## Databruk — tick exactly these three

- [x] **Innhold på nettsteder** — screenshots contain page text and images; console error text is captured.
- [x] **Brukeraktivitet** — the collector wraps `fetch`/`XHR` to log _failed_ requests (Google's own
      example for this category names "network monitoring"), and page context includes scroll position.
- [x] **Nettlogg** — `capture.json` carries url + title + `capturedAt`, and IndexedDB retains the last 10.

Leave unticked: Personlig identifiserende informasjon, Helseinformasjon, Økonomisk informasjon,
Autentiseringsinformasjon, Personlig kommunikasjon, Posisjon.

## Sertifiseringer — tick all three

All three are true as written.

## Nettadresse til personvernregler

```
https://secretlifeof.github.io/wusel-capture/privacy
```

Source: `apps/app/src/routes/privacy.tsx`, published to GitHub Pages by
`.github/workflows/pages.yml`. The same site also carries the Cookie Policy (there are no
cookies), Terms and Imprint, all linked from the footer.
