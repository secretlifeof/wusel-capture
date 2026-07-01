// Orchestrates the full extension build:
//   1. cleans dist/
//   2. esbuild-bundles the service worker (ESM) + content scripts (IIFE)
//   3. runs `vite build` for the popup + editor pages (which also copies
//      public/ -> dist, i.e. manifest.json + fonts)
//
// In --watch mode it keeps esbuild in incremental mode and runs vite in watch
// too, so editing any source rebuilds the relevant output. Reload the unpacked
// extension in chrome://extensions after a rebuild.

import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const watch = process.argv.includes('--watch');
const outdir = resolve(root, 'dist');

/** @type {esbuild.BuildOptions} */
const shared = {
  bundle: true,
  platform: 'browser',
  target: 'es2022',
  logLevel: 'info',
  sourcemap: watch ? 'inline' : false,
  outdir,
};

const serviceWorker = {
  ...shared,
  entryPoints: { 'service-worker': resolve(root, 'src/background/service-worker.ts') },
  format: 'esm',
};

// Content scripts must be classic scripts (no ESM import/export at runtime).
const contentScripts = {
  ...shared,
  entryPoints: {
    collector: resolve(root, 'src/content/collector.ts'),
    bridge: resolve(root, 'src/content/bridge.ts'),
  },
  format: 'iife',
};

function runVite() {
  const args = ['vite', 'build', ...(watch ? ['--watch'] : [])];
  const child = spawn('pnpm', ['exec', ...args], { cwd: root, stdio: 'inherit' });
  return child;
}

async function main() {
  await rm(outdir, { recursive: true, force: true });

  if (watch) {
    const swCtx = await esbuild.context(serviceWorker);
    const csCtx = await esbuild.context(contentScripts);
    await Promise.all([swCtx.watch(), csCtx.watch()]);
    runVite(); // vite --watch keeps running; emptyOutDir:false preserves esbuild output
    console.log('\n[wusel-capture] watching… load dist/ as an unpacked extension.');
  } else {
    await Promise.all([esbuild.build(serviceWorker), esbuild.build(contentScripts)]);
    await new Promise((res, rej) => {
      const child = runVite();
      child.on('exit', (code) => (code === 0 ? res() : rej(new Error(`vite exited ${code}`))));
    });
    console.log('\n[wusel-capture] built dist/. Load it via chrome://extensions → Load unpacked.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
