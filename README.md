# Wusel Capture

> Mark up any web page in your browser, and let your AI implement the change.

[![License: MIT](https://img.shields.io/badge/license-MIT-blueviolet.svg)](./LICENSE)

**[secretlifeof.github.io/wusel-capture](https://secretlifeof.github.io/wusel-capture)** ·
[Privacy](https://secretlifeof.github.io/wusel-capture/privacy) ·
[Report a bug](https://github.com/secretlifeof/wusel-capture/issues)

Wusel Capture is a Chrome extension that turns a design change into a task your AI
coding assistant can ship. Screenshot any page — full page, viewport, or a region you
select — annotate it with text, arrows, boxes, and redaction, add a note, and send it.
The annotated image plus the page's browser context is handed to **Claude Code** or
**Codex** in VS Code, which finds the code behind the page and implements the change.

It's open source, free, and private: captures are processed locally in your browser and
go straight to your own assistant — never to our servers. Note that your assistant is a
third party: when you send a capture, Claude Code or Codex transmits it to Anthropic or
OpenAI under your own account, exactly as if you had pasted it in yourself. See the
[Privacy Policy](https://secretlifeof.github.io/wusel-capture/privacy).

## Features

- **Private by design** — captures are processed locally and handed to your own Claude
  Code / Codex. Nothing is sent to our servers.
- **Any page, any detail** — grab the full page, the visible viewport, or a region you
  select, then annotate with text, arrows, boxes, and redaction.
- **Context, not just pixels** — each capture bundles the page URL together with console
  errors and failed requests, so your assistant sees what you saw.
- **Open source** — MIT-licensed and transparent. Add the skill your AI uses with a
  single `npx` command.

## How it works

1. **Install the extension** — add Wusel Capture to Chrome and pin it.
2. **Annotate the change** — screenshot the page and mark what needs to change.
3. **Your AI ships it** — send to VS Code, where Claude Code or Codex implements the
   change using your existing components, design tokens, and patterns.

## Get started

Add the skill your assistant uses to understand a capture:

```bash
npx skills add wusel-capture
```

Then install the browser extension from the
[latest GitHub release](https://github.com/secretlifeof/wusel-capture/releases/latest)
and load it unpacked from `chrome://extensions` (it isn't on the Chrome Web Store yet).

That's all you need. For **zero-prompt delivery** — captures written straight into the
matching local project folder, with no "Open VS Code?" prompt — you can optionally
install the native messaging host; see
[`packages/wusel-capture-host`](./packages/wusel-capture-host/README.md) for setup.

## Supported assistants

- **Claude Code** (VS Code) — the default.
- **Codex** (VS Code).

Choose the target from the **Send to** menu in the editor's side panel.

## Development

Wusel Capture is a pnpm-workspaces + Turborepo monorepo (Vite · Tailwind CSS v4 ·
TanStack Start · oxlint / oxfmt).

```bash
pnpm install
pnpm dev          # landing page + extension watchers (turbo)
pnpm build        # build everything
pnpm type-check   # type-check every package
```

To work on a single package:

```bash
pnpm --filter @wusel-capture/web dev          # the marketing site
pnpm --filter @wusel-capture/extension build  # build the Chrome extension → dist/
```

Each package documents itself in its own `README.md`.

### The website

`apps/app` is published to GitHub Pages on every push to `main` that touches it
(`.github/workflows/pages.yml`). It is prerendered to static HTML — no server. Because
Pages serves it from a project subpath, CI builds it with `BASE_PATH=/wusel-capture/`;
locally it runs at `/`. Fonts are self-hosted rather than loaded from Google Fonts, so
the site makes no third-party requests at all.

### The extension

To run the extension in development:

1. Build it:

   ```bash
   pnpm --filter @wusel-capture/extension build
   ```

2. Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**,
   and select `packages/wusel-capture/dist`.

3. For iterative work, run the watcher and reload the extension in
   `chrome://extensions` after each rebuild (MV3 has no hot reload for the
   service worker / content scripts):

   ```bash
   pnpm --filter @wusel-capture/extension dev
   ```

See [`packages/wusel-capture`](./packages/wusel-capture/README.md) for the full
architecture and details.

## Legal

- [Privacy Policy](https://secretlifeof.github.io/wusel-capture/privacy)
- [Cookie Policy](https://secretlifeof.github.io/wusel-capture/cookies) — there are none
- [Terms of Use](https://secretlifeof.github.io/wusel-capture/terms)
- [Imprint](https://secretlifeof.github.io/wusel-capture/imprint)

## License

[MIT](./LICENSE)
