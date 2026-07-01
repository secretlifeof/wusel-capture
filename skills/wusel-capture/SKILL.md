---
name: wusel-capture
description: >-
  Implement a UI change from an annotated browser screenshot captured with Wusel
  Capture. Use this whenever a prompt says "I captured a browser screenshot with
  annotations", references an annotated.png and/or capture.json, mentions "wusel
  capture", or otherwise asks you to implement a UI/design change or debugging fix
  from a screenshot with drawn comments (text notes, arrows, rectangles, freehand,
  redactions). It teaches you to find the exact page and component the annotations
  point at, then make the smallest change by reusing the target repo's existing
  components, design tokens, and conventions.
---

# Wusel Capture: implement the annotated change, reuse what exists

You are working in the LOCAL repository that renders the captured page. Change EXACTLY
what the annotations ask for — nothing more — by reusing the components, tokens, and
conventions already in this repo. This skill is repo-agnostic: discover the repo's
conventions, do not assume a framework.

## 1. Read the inputs (image first, then JSON)

1. Open `annotated.png` FIRST and look at the drawn comments before reading anything else.
2. Then parse `capture.json` (Tier B) or the inline context (Tier A):
   - `note` — the user's primary instruction. Authoritative; the drawings point at *where* it applies.
   - `page.url`, `page.title` — which page/route to find.
   - `annotations[]` — the drawn comments. `diagnostics` — console errors / failed requests (only for debugging tasks).
3. Interpret each annotation `type`. **Coordinates are natural device pixels** (image pixels),
   origin top-left; divide by `page.devicePixelRatio` to reason in CSS px if needed.
   - `text` — an instruction pinned at (x,y); its `text` is what to do there.
   - `arrow` — points from (x,y) to (x+w, y+h); the **head** end marks the target element.
   - `rect` — bounds the target region/element.
   - `redact` — a blacked-out box: **sensitive; ignore its contents**, never a target.
   - `pencil` — freehand emphasis over a region (`points[]`); "look here".
4. Build a target list: for each non-redact annotation, note (region, instruction). Cross-reference every drawing with `note`.

## 2. Locate the page from `page.url`

Take the pathname (ignore origin/query/hash). Discover the routing convention, then map path → source:
- **File-based routes** (Next.js app/pages, TanStack Router, SvelteKit, Remix, Nuxt): look under
  `app/`, `pages/`, `src/routes/`, `routes/`. e.g. `/settings/profile` → `routes/settings/profile.*`,
  `app/settings/profile/page.*`, `pages/settings/profile.*`, or that segment's index/layout file.
- **Config/table routes** (React Router, Vue Router): grep for a route table —
  `createBrowserRouter`, `<Route path=`, `routes = [`, `path:` — find the entry whose `path` matches,
  then follow its `component`/`element`/`lazy` import.
- **Fallback (always do this too):** grep the repo for a unique visible string from the screenshot
  (a heading, button label, `<title>`). The file that owns that literal is almost always on/near the
  target route. Prefer this when routing is dynamic or unclear.

## 3. Locate the annotated component

1. From the route/page component, walk DOWN toward the smallest element that owns each annotated
   region (arrow-head / rect bounds + nearby visible labels in the image).
2. Grep the repo for the on-screen text nearest each annotation — visible label, placeholder,
   `aria-label`, `alt`, heading. That literal pins the exact JSX/markup/template. For i18n: grep the
   translated string in locale files, then grep the returned key.
3. Confirm the element by matching its siblings/layout to the screenshot before editing.

## 4. Implement by REUSING the design system (discover first, then write)

BEFORE writing any markup or styles, discover what already exists:
- **Existing component:** grep for a primitive that already does this (`Button`, `Card`, `Badge`,
  `Input`, a `components/ui` or design-system package). Reuse it. Read 1–2 sibling components in the
  same folder and copy their `className`/prop/token patterns.
- **Token / theme source:** find it before touching color/spacing/typography — `tailwind.config.*` or
  `@theme` in CSS (Tailwind v4), CSS custom properties (`--color-*`, `--space-*`), a theme file, or a
  design-system package's tokens. Use the token/utility, never a raw hex or px.
- **Typography/fonts:** reuse the repo's existing font utilities/classes; do not add a font or arbitrary size.

**Do NOT:**
- add a new component when a suitable one already exists,
- hardcode colors, spacing, radii, or font sizes (use existing tokens/utilities),
- introduce a new styling approach (no CSS-in-JS in a Tailwind repo, no stylesheet in a CSS-modules repo, etc.),
- restyle or "improve" elements the annotations did not mark.

## 5. Scope and verify

1. Change ONLY what the annotations + `note` call for — the smallest safe diff.
2. Match the surrounding file's conventions (imports, formatting, naming).
3. Run the repo's checks if present (type-check, lint, format from `package.json` scripts); fix what you touched.
4. Summarize: what changed, which existing component/token you reused, and why it fits the current
   design system. If a request is ambiguous or would require a new pattern, say so instead of inventing one.
