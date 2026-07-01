# Wusel Capture

> Mark up any web page in your browser, and let your AI implement the change.

[![License: MIT](https://img.shields.io/badge/license-MIT-blueviolet.svg)](./LICENSE)

**[capture.wusel.dev](https://capture.wusel.dev)** · [Report a bug](https://github.com/wusel-capture/wusel-capture/issues)

Wusel Capture is a Chrome extension that turns a design change into a task your AI
coding assistant can ship. Screenshot any page — full page, viewport, or a region you
select — annotate it with text, arrows, boxes, and redaction, add a note, and send it.
The annotated image plus the page's browser context is handed to **Claude Code** or
**Codex** in VS Code, which finds the code behind the page and implements the change.

It's open source, free, and private: captures are processed locally in your browser and
go straight to your own assistant — never to our servers.

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
[latest GitHub release](https://github.com/wusel-capture/wusel-capture/releases/latest)
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

## License

[MIT](./LICENSE)
