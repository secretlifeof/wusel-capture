# @wusel-capture/tsconfig

Shared TypeScript configuration for the Wusel Capture monorepo.

Three base configs that every workspace package extends:

- **`base.json`** — strict defaults, ES2022, bundler resolution, declarations on.
- **`node.json`** — extends `base` for Node tooling (Node types, NodeNext resolution).
- **`react.json`** — extends `base` for React apps (JSX, DOM libs, declarations off).

## Usage

```jsonc
// tsconfig.json
{
  "extends": "@wusel-capture/tsconfig/react.json"
}
```

Use `react.json` for browser / React code, `node.json` for CLIs and build scripts, and
`base.json` when you need neither preset.

> Internal workspace package for **Wusel Capture** — `private`, consumed via
> `workspace:*`, and not published to npm.
