import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { devVariantAttrs } from './dev-attrs';
import { cn } from './utils';

// -----------------------------------------------------------------------------
// Heading — Responsive heading with size variants
// -----------------------------------------------------------------------------

const headingVariants = cva('leading-tight tracking-tight', {
  variants: {
    size: {
      sm: 'text-xl md:text-2xl',
      lg: 'text-3xl md:text-4xl lg:text-6xl',
      xl: 'text-4xl md:text-5xl lg:text-7xl',
    },
    align: {
      left: 'text-start',
      center: 'text-center',
      right: 'text-end',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

function Heading({
  className,
  size,
  align,
  as: Tag = 'h2',
  ...props
}: Omit<React.ComponentProps<'h2'>, 'ref'> &
  VariantProps<typeof headingVariants> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  }) {
  return (
    <Tag
      data-slot="heading"
      {...devVariantAttrs({ size: size ?? 'default', align: align ?? undefined })}
      className={cn(headingVariants({ size, align }), className)}
      {...props}
    />
  );
}

export { Heading, headingVariants };
