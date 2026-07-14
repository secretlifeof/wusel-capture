import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { site } from '@/lib/site';

import appCss from '../app.css?url';

const title = 'Wusel Capture — design in the browser, ship with your AI';
const description =
  'Mark up any web page in your browser, and let your AI implement the change. Install the Chrome extension and add the skill via npx skills.';
const ogImage = `${site.url}/og-image.png`;

// The site is served from a GitHub Pages project path (/wusel-capture/), so
// files in public/ are not at the server root. Vite rewrites the URLs it parses
// (imports, CSS url()), but not paths we hand-write into <link> tags — those
// have to be prefixed explicitly. BASE_URL is '/' during dev.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, '/');

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title },
      { name: 'description', content: description },
      // Open Graph (Facebook, LinkedIn, Slack, …)
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: site.url },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: site.name },
      // Twitter / X
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // Modern browsers use the crisp, scalable SVG (the Wusel "W" mark).
      { rel: 'icon', type: 'image/svg+xml', href: asset('favicon.svg') },
      // `alternate icon` keeps the .ico as a legacy-only fallback so Chrome doesn't prefer it.
      { rel: 'alternate icon', type: 'image/x-icon', href: asset('favicon.ico'), sizes: 'any' },
      { rel: 'apple-touch-icon', href: asset('apple-touch-icon.png') },
      // Geist + Caveat are self-hosted (see app.css). Preload the body face so
      // the first paint isn't a flash of fallback text.
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: asset('fonts/Geist-Variable.woff2'),
        crossOrigin: 'anonymous',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
