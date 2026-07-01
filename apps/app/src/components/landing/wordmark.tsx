import { cn } from '@wusel-capture/ui';

import { WuselLogo } from '@/components/landing/wusel-logo';

/** Brand lockup: the Wusel wordmark, a divider, and "Capture". Caller controls
 *  the color via `className` (lavender in the header, sand on the dark footer);
 *  the logo, divider and text inherit it via currentColor. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-lg font-medium tracking-tight',
        className,
      )}
    >
      <span className="sr-only">Wusel Capture</span>
      <WuselLogo aria-hidden="true" className="h-[1.6em] w-auto shrink-0" />
      <span aria-hidden="true" className="h-6 w-px shrink-0 bg-current opacity-60" />
      <span aria-hidden="true" className="font-semibold">Capture</span>
    </span>
  );
}
