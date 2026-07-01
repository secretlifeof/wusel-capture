import * as React from 'react';

import { cn } from '../lib/cn';

// Local mirror of @wusel-capture/ui Button — same class strings so it is
// visually identical to the app, but without coupling to the app's UI
// dependency graph. Light mode only.

type Variant = 'default' | 'outline-round' | 'ghost' | 'destructive';
type Size = 'cta' | 'default' | 'sm' | 'icon' | 'icon-sm';

const base =
	"inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-sm text-sm font-medium transition-[color,background-color,box-shadow] duration-250 ease outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5";

const variants: Record<Variant, string> = {
	default: 'bg-primary text-primary-foreground hover:bg-interactive-active hover:text-white rounded-full',
	'outline-round':
		'border border-secondary text-foreground hover:bg-button-hover-bg hover:text-button-hover-foreground rounded-full',
	ghost: 'text-foreground hover:bg-bark-400 hover:text-white',
	destructive: 'bg-destructive text-white hover:bg-destructive/90',
};

const sizes: Record<Size, string> = {
	cta: 'h-11 rounded-full px-5 lg:px-6',
	default: 'h-10 px-6 py-2',
	sm: 'h-9 px-3 py-1.5 text-xs',
	icon: 'size-10',
	'icon-sm': 'size-9',
};

export interface ButtonProps extends React.ComponentProps<'button'> {
	variant?: Variant;
	size?: Size;
}

export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
	return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
