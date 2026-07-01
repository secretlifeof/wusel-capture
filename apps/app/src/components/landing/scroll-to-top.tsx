import { cn } from '@wusel-capture/ui';
import { ChevronUp } from '@wusel-capture/icons';

const ROUND_ICON_BUTTON_CLASS =
  'flex size-8 md:size-13 cursor-pointer items-center justify-center rounded-full border border-secondary bg-sand-50 transition-colors hover:bg-sand-100';

// Global fixed scroll-to-top button (bottom-right). It reveals after scrolling
// and then glides to the centre of the footer entirely via CSS scroll-driven
// animations from the shared theme — `.global-scroll-top` rides `--main-scroll`
// (reveal) and `.global-scroll-top-inner` fades out on the footer's `--bottom-fade`
// while the `.footer-scroll-top` twin fades in there. No JS scroll listeners.
export function ScrollToTop() {
  return (
    <div className="global-scroll-top fixed inset-e-6 bottom-6 z-30">
      <button
        type="button"
        aria-label="Scroll to top"
        className={cn(ROUND_ICON_BUTTON_CLASS, 'global-scroll-top-inner')}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp className="size-4 text-muted-foreground md:size-6" />
      </button>
    </div>
  );
}
