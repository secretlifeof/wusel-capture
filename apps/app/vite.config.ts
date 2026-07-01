import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
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
