import { cn } from '@wusel-capture/ui';
import { ChevronUp } from '@wusel-capture/icons';
import { Link } from '@tanstack/react-router';

import { Wordmark } from '@/components/landing/wordmark';
import { site } from '@/lib/site';

// Mirrors the shared circular-icon-button chrome from the design system.
const ROUND_ICON_BUTTON_CLASS =
  'flex size-8 md:size-13 cursor-pointer items-center justify-center rounded-full border border-secondary bg-sand-50 transition-colors hover:bg-sand-100';

const legalLinks = [
  { label: 'Terms', to: '/terms' },
  { label: 'Imprint', to: '/imprint' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Cookies', to: '/cookies' },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer bg-bark-800 pt-16 pb-24 md:pb-6">
      {/* Scroll-to-top — parked just above the footer, fades in via the shared
          --bottom-fade view-timeline (see theme.css). */}
      <button
        type="button"
        aria-label="Scroll to top"
        className={cn(ROUND_ICON_BUTTON_CLASS, 'footer-scroll-top')}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp className="size-4 text-muted-foreground md:size-6" />
      </button>

      <div className="px-6 md:px-12.5">
        {/* 2×2 grid: wordmark / GitHub on the top row, the two taglines on the
            bottom row. Sharing a grid row makes the taglines' tops align
            regardless of the differing heights above them. Source order is the
            mobile stack (brand + tagline, then link + questions); md:order-*
            reflows it into the desktop grid. */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-center md:grid-cols-2 md:items-start md:text-start">
          <Link
            to="/"
            className="mb-2 inline-block justify-self-center md:order-1 md:mb-0 md:justify-self-start"
          >
            <Wordmark className="text-sand-200" />
          </Link>

          <p className="max-w-xs justify-self-center text-[clamp(0.8rem,1vw,1rem)] leading-relaxed text-sand-400 md:order-3 md:justify-self-start">
            Mark up any page in your browser, and let your AI ship the change.
          </p>

          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="justify-self-center text-[clamp(0.8rem,1vw,1rem)] text-sand-200 underline underline-offset-2 transition-colors hover:text-sand-100 md:order-2 md:justify-self-end"
          >
            GitHub
          </a>

          <p className="max-w-xs justify-self-center text-[clamp(0.8rem,1vw,1rem)] leading-relaxed text-sand-400 md:order-4 md:justify-self-end md:text-end">
            Found a bug or have an idea to share?{' '}
            <a
              href={`${site.github}/issues`}
              target="_blank"
              rel="noreferrer"
              className="text-sand-200 underline underline-offset-2 transition-colors hover:text-sand-100"
            >
              Open an issue
            </a>{' '}
            and we&rsquo;ll take a look.
          </p>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[clamp(0.7rem,0.9vw,0.85rem)] text-sand-500 underline underline-offset-2 opacity-60 transition-colors hover:text-sand-200 hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-[clamp(0.7rem,0.9vw,0.85rem)] text-sand-500 opacity-60">
            © Wusel Capture {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
