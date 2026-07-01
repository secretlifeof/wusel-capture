// Bundles the native host into a single executable ESM file with a node shebang.

import { chmodSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outfile = resolve(root, 'dist/index.mjs');

await esbuild.build({
	entryPoints: [resolve(root, 'src/index.ts')],
	outfile,
	bundle: true,
	platform: 'node',
	format: 'esm',
	target: 'node20',
	banner: { js: '#!/usr/bin/env node' },
	logLevel: 'info',
});

chmodSync(outfile, 0o755);
console.log(`[wusel-capture-host] built ${outfile}`);
