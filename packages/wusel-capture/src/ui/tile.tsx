import * as React from 'react';

import { cn } from '../lib/cn';

// Section title placed ABOVE a tile/group — matches the app's DetailSection
// heading (packages/ui-core/src/detail-section-layout.tsx): text-lg, semibold,
// `text-muted-foreground` (a visible lighter bark, bark-300). No icon.
export function SectionTitle({ className, ...props }: React.ComponentProps<'h2'>) {
	return <h2 className={cn('text-lg font-semibold text-muted-foreground', className)} {...props} />;
}

// Transparent, edge-to-edge band — only top/bottom borders (no left/right, so
// nothing doubles against the column's border or a neighbouring tile). No
// background, no shadow. Content-only; the title lives above it (section title)
// or as a TilePill at the top-left.
export function Tile({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('flex flex-col border-y bg-transparent px-4 py-3', className)} {...props} />;
}

// The app's TileTitle pill, shown at a tile's top-left corner. The negative left
// margin (the app's `--tile-pill-indent`) pulls it slightly left of the content.
export function TilePill({ className, ...props }: React.ComponentProps<'span'>) {
	return (
		<span
			className={cn(
				'-ml-(--tile-pill-indent) inline-flex w-fit items-center rounded-full border bg-white/30 px-3 py-0.5 text-[11px] tracking-wide text-muted-foreground',
				className,
			)}
			{...props}
		/>
	);
}
