import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Builds the two extension PAGES (popup + editor) as static HTML bundles.
// The service worker and content scripts are built separately with esbuild
// (see scripts/build-scripts.mjs) because they need IIFE / single-file output
// and must survive across Vite rebuilds (hence emptyOutDir: false here).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    // The MV3 extension CSP forbids inline scripts. Vite injects its
    // module-preload polyfill inline (and it is unneeded — Chrome supports
    // modulepreload natively), so disable it to avoid a CSP violation.
    modulePreload: { polyfill: false },
    // Extension pages are loaded from the extension root, so relative asset
    // URLs resolve correctly regardless of the generated extension id.
    rollupOptions: {
      input: {
        popup: fileURLToPath(new URL('./popup.html', import.meta.url)),
        editor: fileURLToPath(new URL('./editor.html', import.meta.url)),
      },
    },
  },
});
