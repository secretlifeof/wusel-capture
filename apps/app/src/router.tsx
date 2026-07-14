import { createRouter as createTanStackRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    // Matches Vite's `base`. Without it the router would resolve `/privacy`
    // against the domain root, which 404s on a GitHub Pages project path.
    basepath: import.meta.env.BASE_URL,
    defaultPreload: 'intent',
    scrollRestoration: true,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
