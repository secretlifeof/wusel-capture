import { Button } from '@wusel-capture/ui';
import { Link } from '@tanstack/react-router';

import { Wordmark } from '@/components/landing/wordmark';
import { site } from '@/lib/site';

// Fixed, frosted navigation. The .landing-nav-pill halos (from the shared theme)
// stay invisible at the top of the hero and ease in as the user scrolls.
export function SiteHeader() {
  return (
    <div className="landing-nav pointer-events-none fixed inset-s-0 inset-e-0 top-0 z-50 pt-4">
      <div className="relative px-6">
        <div className="grid grid-cols-[1fr_auto] items-center">
          <Link to="/" className="pointer-events-auto flex items-center">
            <span className="relative inline-flex items-center">
              <span className="landing-nav-pill -inset-8 sm:-inset-16" aria-hidden="true" />
              <Wordmark className="text-lavender-500" />
            </span>
          </Link>

          <nav className="pointer-events-auto relative flex items-center justify-end gap-4 sm:gap-6">
            <span className="landing-nav-pill -inset-8 sm:-inset-16" aria-hidden="true" />
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="hidden text-sm font-medium text-public-text-muted transition-colors hover:text-public-text-heading sm:inline"
            >
              GitHub
            </a>
            <Button
              asChild
              className="rounded-full px-5 text-sm sm:inline-flex lg:px-7 lg:text-base"
            >
              <a href="#get-started">Get started</a>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
