import * as React from 'react';

import { Button } from './button';
import { cn } from './utils';

/**
 * Large pill call-to-action used across the public/marketing pages (landing
 * hero, pricing, demo). Wraps {@link Button} with the `landing` size: fluid
 * text that's compact on mobile/tablet and grows to the full size at desktop
 * (lg). Content-width by default — never full-width.
 *
 * Pass `variant="outline"` for the secondary (bordered) style; it gets the
 * white-fill hover used on the gradient backgrounds. Supports `asChild` to
 * render a `<Link>`/`<a>` (e.g. `<CtaButton asChild><Link …/></CtaButton>`).
 */
export function CtaButton({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      size="landing"
      variant={variant}
      className={cn(variant === 'outline' && 'hover:bg-white hover:text-foreground', className)}
      {...props}
    />
  );
}
