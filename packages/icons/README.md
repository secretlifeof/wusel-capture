# @wusel-capture/icons

Type-safe icon components — only the icons Wusel Capture actually uses.

Thin wrappers around [Phosphor Icons](https://phosphoricons.com) that give every glyph
a consistent default size (48) and weight (bold). Exports about two dozen named icons —
`ArrowRight`, `Camera`, `Check`, `ChevronDown`, `ChevronUp`, `Download`, `Pencil`,
`Send`, `Trash`, `Type`, `X`, … — plus the `createIcon` / `createDirectionalIcon`
helpers (the latter auto-mirrors under `dir="rtl"`) and the `IconComponent` /
`IconProps` types.

## Usage

```tsx
import { Camera, Send } from '@wusel-capture/icons';

<Camera />                                    // 48px, bold by default
<Send size={20} className="text-lavender-600" />;
```

Requires React 19+ (peer dependency).

> Internal workspace package for **Wusel Capture** — `private`, consumed via
> `workspace:*`, and not published to npm.
