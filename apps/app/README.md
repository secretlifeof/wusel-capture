# @wusel-capture/web

The Wusel Capture marketing site — [capture.wusel.dev](https://capture.wusel.dev).

A Vite + TanStack Start / Router single-page app. Its hero embeds a faithful,
scaled-down **live preview of the real editor** by importing the extension's
`@wusel-capture/extension/editor` components, so the marketing shot never drifts from
the product.

## Development

```bash
pnpm --filter @wusel-capture/web dev       # dev server on http://localhost:3000
pnpm --filter @wusel-capture/web build     # production build
pnpm --filter @wusel-capture/web preview   # preview the build
```

> Internal workspace package for **Wusel Capture** — `private` and not published to npm.
