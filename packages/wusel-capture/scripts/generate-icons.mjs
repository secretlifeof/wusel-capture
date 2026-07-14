// Generates public/icons/icon-{16,32,48,128}.png (the extension icons
// referenced by manifest.json) plus store/icon-128.png (the Chrome Web Store
// listing icon, whose guidelines want the artwork inside a 96x96 area of the
// 128x128 canvas) from assets/wusel-w.svg. Run with `pnpm generate:icons` and
// commit the outputs so the build needs no native deps at runtime (mirrors
// apps/app/scripts/generate-icons.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = fs.readFileSync(path.join(root, 'assets/wusel-w.svg'), 'utf8');
const outDir = path.join(root, 'public/icons');
fs.mkdirSync(outDir, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: 'rgba(0,0,0,0)',
    font: { loadSystemFonts: false },
  })
    .render()
    .asPng();
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), png);
}

console.log('Wrote icon-{16,32,48,128}.png to', outDir);

// Web Store listing icon: the W glyph is 273 units wide inside the 320 viewBox.
// Widening the viewBox to 364 (= 273 * 128/96) shrinks the glyph to 96px on the
// 128px canvas, per the store's "96x96 artwork, ~16px transparent padding" rule.
const storeDir = path.join(root, 'store');
fs.mkdirSync(storeDir, { recursive: true });
const storeSvg = svg.replace('viewBox="0 0 320 320"', 'viewBox="-22 -22 364 364"');
const storePng = new Resvg(storeSvg, {
  fitTo: { mode: 'width', value: 128 },
  background: 'rgba(0,0,0,0)',
  font: { loadSystemFonts: false },
})
  .render()
  .asPng();
fs.writeFileSync(path.join(storeDir, 'icon-128.png'), storePng);

console.log('Wrote store listing icon to', path.join(storeDir, 'icon-128.png'));
