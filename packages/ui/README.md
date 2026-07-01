# @wusel-capture/ui

Local UI primitives — only the components Wusel Capture actually uses.

A tiny component library shared by the landing page and the extension: `Button` (and
`buttonVariants`), `CtaButton`, `Heading` (and `headingVariants`), and the `cn`
class-merging helper. Built with [class-variance-authority](https://cva.style) and
Radix UI's `Slot`, styled with the shared Tailwind theme.

## Usage

```tsx
import { Button, Heading, cn } from '@wusel-capture/ui';

<Heading as="h1" size="xl">Wusel Capture</Heading>
<Button variant="default" className={cn('mt-4')}>Get started</Button>;
```

Requires React 19+ (peer dependency) and the
[`@wusel-capture/tailwind-config`](../tailwind-config) theme for its design tokens.

> Internal workspace package for **Wusel Capture** — `private`, consumed via
> `workspace:*`, and not published to npm.
