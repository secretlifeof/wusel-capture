# @wusel-capture/tailwind-config

Shared Tailwind CSS v4 theme tokens and global styles for Wusel Capture.

A single `theme.css` — the source of truth for the design system used by both the app
and the extension. It defines the color scales (sand, bark, sage, lavender), the
semantic surface tokens (input / raised / default / sunken), component tokens, and
bundles the [`tailwindcss-animate`](https://github.com/jamiebuilds/tailwindcss-animate)
plugin.

## Usage

Import it once in your app's CSS, right after Tailwind, then declare your own content
sources:

```css
@import 'tailwindcss';
@import '@wusel-capture/tailwind-config/theme.css';

@source './**/*.{ts,tsx}';
```

> Internal workspace package for **Wusel Capture** — `private`, consumed via
> `workspace:*`, and not published to npm.
