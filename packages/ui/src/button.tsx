import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { devVariantAttrs } from './dev-attrs';
import { cn } from './utils';

const buttonVariantsBase = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-sm text-sm font-medium transition-[color,background-color,box-shadow] duration-250 ease disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 [&_svg]:shrink-0 [&_svg]:text-current outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-interactive-active hover:text-white rounded-full',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline: 'border rounded-sm hover:bg-bark-400 hover:text-white text-foreground',
        'outline-round':
          'border hover:bg-button-hover-bg hover:text-button-hover-foreground text-foreground rounded-full',
        secondary:
          'border border-toolbar-control bg-toolbar-control-foreground text-toolbar-control [&_svg]:fill-toolbar-control [&_svg]:stroke-none hover:bg-toolbar-control/10',
        ghost:
          'hover:bg-bark-400 hover:text-white data-[state=open]:bg-sand-100 data-[state=open]:text-bark-300 data-[state=open]:[&_svg]:text-bark-200 data-[state=open]:[&_svg]:opacity-100',
        'ghost-muted': 'text-muted-foreground hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        'icon-round':
          'bg-icon-button-bg hover:bg-button-hover-bg rounded-full [&_svg]:fill-icon-button-fg [&_svg]:stroke-none hover:[&_svg]:fill-icon-button-fg-hover data-[state=open]:bg-sand-100! data-[state=open]:[&_svg]:fill-bark-300!',
        'icon-round-outline':
          'bg-transparent border border-muted-foreground/30 hover:bg-button-hover-bg rounded-full [&_svg]:fill-muted-foreground [&_svg]:stroke-none hover:[&_svg]:fill-icon-button-fg-hover data-[state=open]:bg-sand-100! data-[state=open]:[&_svg]:fill-bark-300!',
        'icon-subtle':
          'bg-icon-button-bg hover:bg-button-hover-bg rounded-sm [&_svg]:fill-icon-button-fg [&_svg]:stroke-none hover:[&_svg]:fill-icon-button-fg-hover',
      },
      size: {
        default: 'h-10 px-6 py-2 has-[>svg]:px-4',
        // Compact on mobile/tablet, full height + padding at desktop (lg).
        cta: 'h-11 rounded-full px-5 py-2 has-[>svg]:px-4 lg:h-button-cta lg:px-6',
        // Large public/marketing pill CTA: fluid text, compact on mobile/tablet,
        // grows to full size at desktop (lg). Content-width (never full-width).
        landing:
          'h-auto rounded-full px-7 py-3 text-[clamp(0.9rem,1.2vw,1.2rem)] has-[>svg]:px-4 md:px-8 md:py-3.5 lg:px-10 lg:py-4',
        sm: 'h-9 gap-1 px-3 py-1.5 font-base text-xs [&_svg]:size-4! has-[>svg:only-child]:px-1.5',
        md: 'h-10 px-4 [&_svg]:size-4! has-[>svg:only-child]:px-1.5',
        lg: 'h-11 px-6 has-[>svg]:px-4',
        icon: 'size-10',
        'circle-sm': 'size-8 rounded-full p-0',
        circle: 'size-10 rounded-full p-0',
      },
    },
    compoundVariants: [
      {
        variant: 'ghost',
        size: 'icon',
        class:
          'gap-0 p-0 hover:bg-transparent [&_svg]:opacity-60 hover:[&_svg]:text-accent [&_svg]:size-full! data-[state=open]:bg-sand-100! data-[state=open]:[&_svg]:text-bark-200! data-[state=open]:[&_svg]:opacity-100!',
      },
      {
        variant: 'ghost',
        size: 'circle-sm',
        class:
          'border border-current text-muted-foreground hover:text-foreground hover:bg-accent/50 [&_svg]:size-4',
      },
      {
        variant: 'ghost',
        size: 'circle',
        class:
          'border border-current text-muted-foreground hover:text-foreground hover:bg-accent/50 [&_svg]:size-full!',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const buttonVariants = (props?: Parameters<typeof buttonVariantsBase>[0]) => {
  const resolvedVariant = props?.variant ?? 'default';
  const resolvedSize = props?.size ?? (resolvedVariant === 'default' ? 'cta' : 'default');

  return buttonVariantsBase({
    ...props,
    variant: resolvedVariant,
    size: resolvedSize,
  });
};

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  const resolvedVariant = variant ?? 'default';
  const resolvedSize = size ?? (resolvedVariant === 'default' ? 'cta' : 'default');

  // Wrap bare text children in a span so the icon-only padding heuristic
  // (`has-[>svg:only-child]`) only matches genuine icon-only buttons. A raw text
  // node is not an element child, so an icon + text button (e.g. `<Icon/> Save`)
  // would otherwise look like an icon-only button to `:only-child` and get the
  // tight square padding. Skipped for `asChild` (Slot needs its single child).
  const content =
    asChild || children == null
      ? children
      : React.Children.map(children, (child) =>
          typeof child === 'string' || typeof child === 'number' ? <span>{child}</span> : child,
        );

  return (
    <Comp
      data-slot="button"
      {...devVariantAttrs({ variant: resolvedVariant, size: resolvedSize })}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {content}
    </Comp>
  );
}

export { Button, buttonVariants };
