import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // GitHub Pages serves this repo's site from /wusel-capture/, not the domain
  // root, so every emitted asset and route URL needs that prefix. The CI build
  // sets BASE_PATH; dev and preview stay at '/'. Swap to '/' (and drop the env
  // var from the workflow) if the site ever moves to its own domain.
  base: process.env.BASE_PATH ?? '/',
  // Pin the dev server to 3000 (strict) so it never roams onto another tool's
  // port — notably the figma-bridge dev server on 4321, which it would
  // otherwise silently shadow.
  server: { port: 3000, strictPort: true },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    // SPA mode: prerender a static HTML shell, no Node SSR server required.
    // crawlLinks follows the in-app links (footer/legal) so every route is also
    // emitted as static HTML for SEO and no-JS access.
    tanstackStart({
      spa: { enabled: true },
      prerender: { enabled: true, crawlLinks: true },
    }),
    viteReact(),
  ],
  // The local @wusel-capture/ui + /icons packages are consumed as source via
  // pnpm workspace links; dedupe React so we never load two copies.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
