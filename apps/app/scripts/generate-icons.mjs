// Generates the favicon + social-share binaries into apps/app/public/ from the
// shared Wusel vector marks. Run with `pnpm generate:icons` and commit the
// outputs (favicon.ico, apple-touch-icon.png, og-image.png) so the build needs
// no fonts/native deps at runtime. favicon.svg is authored by hand and served
// as-is (modern browsers prefer it).
//
// Deps: @resvg/resvg-js (SVG -> PNG, loads a font file for the "Capture" text),
// png-to-ico (PNGs -> .ico), geist (the Geist TTFs used across the site).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const require = createRequire(import.meta.url);
const dir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(dir, '../public');

// Geist ships static-weight TTFs; resolve the package root via its allowed
// `./font/sans` subpath export (its main entry has no export), then read the ttf.
const geistRoot = path.resolve(path.dirname(require.resolve('geist/font/sans')), '..');
const geistFonts = ['Geist-Regular', 'Geist-Medium', 'Geist-SemiBold'].map((f) =>
  path.join(geistRoot, `dist/fonts/geist-sans/${f}.ttf`),
);

const LAV = '#8a8ef6'; // lavender-500 — the Wusel brand accent (header wordmark + favicon)

// Wusel "W" mark (single path, bbox x:0-273 y:103-306). Same path used by favicon.svg.
const W_MARK =
  'M255.7,104.2c-2.9-1.1-6-.8-8.7.8-5.1,2.9-9.2,6.5-12.2,10.6-6.2,8.1-11.3,15.3-15.2,21.6-4,6.4-7.3,12.8-9.9,18.9-2.5,5.8-5.2,12.4-8.3,19.9-3.3,8.5-6.4,15.8-9.2,21.7-2.8,6-5.4,11.1-7.8,15.2l-1.4,2.5c-1.8-3-3.5-6-5.1-9-3.4-6.3-6.4-12.8-9.1-19.4-5.8-13.9-15.9-28.7-30.2-43.9l-1.1-.8-2.5-1.1-1.4-.3c-12.4,0-23,6.1-31.7,18.1-2.4,3.4-5.5,8.9-9.7,16.9-4,7.8-9,17.9-14.7,30-.8,1.5-1.6,3.7-2.4,6.5l-3,9.7c-.3.9-.6,1.8-.8,2.7-2.6-4.4-5.1-9.7-7.6-15.5-2.8-6.6-5.1-13-6.8-19.2-2.1-7.2-2.5-10.7-2.5-12.5-.3-8.8-1-15.5-2-20.3-1.3-6.1-5.8-12.2-14-19-4.7-3.4-9.5-5.1-14.3-5.1s-10,2.8-12.1,5.4C4.2,143.7,0,151,0,159.7s.2,2.1.3,3c.2,1,.4,2.3.7,4,4.6,20.6,9.7,40.7,15.2,59.9,2.8,9.1,6.1,18.5,9.8,27.9,3.8,9.8,8.6,18.8,14,26.7,5.8,8.4,13,14.8,21.4,19.1,9.5,4.4,14.1,5.3,16.9,5.3s.9,0,1.3,0c9,0,21.5-4.9,30.5-27.4v-.2c2.2-6.3,5-14.8,8.2-25.3,2.2-7.3,4.9-15.9,7.9-25.4,1.4,2.3,2.8,4.7,4.2,7.1,3.8,7,7.5,14,11.2,20.9,3.9,7.3,8.1,13.6,12.6,18.7,5.2,6,11.2,9.5,17.7,10.3,1.5.3,3.4.6,5.5.7,2,.2,4.2.3,6.5.3l1.2-.2,2.3-.9,1.1-.6c20.6-18.3,37.2-34.9,49.3-49.5,12.4-15,21.4-30.7,26.8-46.8,5.4-16,8.1-34.7,8.1-55.5l-.4-2.4c-7.3-19.3-12.5-23.5-16.7-25Z';

// Full "Wusel" script wordmark, viewBox 0 0 1000 370.4 (paths from
// components/landing/wusel-logo.tsx — keep in sync if the mark changes upstream).
const WUSEL_PATHS = [
  'M862.1,207.6c-4.3-5.9-10.3-9.1-16.9-9.1s-15.3,3.7-22.4,10.9c-6.7,6.2-14.5,11.6-23.2,16.3-5.3,2.9-11.2,4.3-17.6,4.3s-15.1-1.8-21.3-5.4c-.6-.3-1.1-.7-1.7-1,4.8-.8,8.8-2.2,12.1-4.3,10.1-5.7,18.5-10.5,25-14.4,6.7-4,12.3-7.7,16.9-11.2,4.8-3.7,9.1-7.8,12.8-12.1,12.4-14.9,18.4-27.9,18.4-39.6,0-19.5-15.7-34.3-46.6-43.9-9.1-3-19-4.6-29.3-4.6s-28.6,3.4-44.8,10.2c-17.5,7.7-30.1,15.9-38.4,24.9-9.1,9.9-13.7,22.8-13.7,38.3s.3,9.1.9,13.6c.6,4.4,1.5,9.1,2.7,13.7l.5,1.6c8.2,19.7,17,35.5,26.3,46.8,9.5,11.6,19.5,20.2,29.5,25.4,9.9,5.2,19.9,8.4,29.9,9.7,9,1.1,17.6,1.7,25.6,1.7,16,0,30.4-2.3,42.8-6.7,13.4-4.9,24.5-13.8,32.8-26.6,3.4-4.7,5.1-11.2,5.1-18.8s-1.6-13.1-4.7-18.6l-.7-1.1ZM763.7,168.2c-5.4,4.3-9.2,7.1-14.9,11.3l-5.8,4.3-.5.4c-1.6,1.5-3.9,1.9-6.3,1.2-3.9-1.1-7-4.8-8.3-9.6l.2-1.7c4.2-8.5,9.1-16.1,14.5-22.7,5.6-6.8,11.4-12.3,17.3-16.3,5.8-3.9,11.1-5.7,15.8-5.3h.5c1.5.6,1.6.7,2.7,1.4l.3.2c4.6,3.7,5.2,5.3,5.3,5.3l.4.8c.7,1.2,1.9,3.1,1.9,5.4,0,3.8-1.1,7.1-2.8,9-3.8,3.4-8.9,7.4-14.4,11.8l-5.8,4.5Z',
  'M993.8,255.5v-.3c-5-12.2-14.3-13.6-18.1-13.6s-9.3,1.2-14.7,6.4c.4-9.1.8-19.7,1.4-32.6.7-16.8,1.5-36.9,2.6-59.7l2.4-48.4c.5-14.2,1.1-26.7,1.8-37.2.7-10.8,1.2-19.9,1.4-26.7.7-12.6-3.4-23.5-11.8-31.6-8.2-7.8-18.4-11.8-30.3-11.8s-31.6,1.9-31.6,26.3.3,6.2.9,8.3c.8,2.9,1.4,6.3,1.7,9.8.4,4.1.6,8.2.6,12.5l.4,71c.3,15.7.5,35.6.6,59.1.1,24.3.2,52.1.2,82.5s4.4,20.7,13,31.4l2.2,2,.8.6c14.1,8.3,24,12.1,32,12.1h11.9c1.4.1,2.8.2,4.2.2,6.5,0,12.7-1.2,18-3.5h0c8.2-3.6,13.7-10.3,15.6-19,.5-2,.7-4.5.7-8.8,0-6.9-2-16.4-6.2-29Z',
  W_MARK,
  'M469.8,109.8c-1.8-7-3.9-11.8-6.8-14.9-3.2-3.4-7.2-5.5-12-6.2-3-.4-6.9-.8-12.1-1.1h-6.4c-2.3,0-4.5.2-6.4.6-4.7.9-7.7,2.3-9.9,4.5-3.7,3.7-5.6,9.8-6.7,21.4-1,11.7-3.8,23.1-8.2,34-4.4,10.9-11.4,22-20.6,32.9-1.3,1.4-2.3,2.4-3,3-.5-.9-1.3-2.3-2.1-4.3-1.9-5.3-3.5-11-4.6-16.8-1.1-5.6-1.5-11.5-1.3-17.4.5-11.5,2.1-23.1,4.6-34.7,1-4.5,1.4-7.8,1.4-10.4,0-7.1-2.4-13-7.1-17.5-4-3.8-9.9-6.7-18.1-9-3.5-1-7.2-1.6-11-1.6-6.9,0-13.4,2-19.2,6-8.9,5.5-11.3,12.4-11.7,17.2-1.3,7.7-2.4,15.4-3.2,22.3-.8,7.1-1.3,13.5-1.3,19.2,0,23,5,43.4,14.9,60.4,6.3,11.8,15.1,21.2,26.1,28.1,11.1,6.9,23,10.5,35.5,10.5s18.9-2.2,26.3-6.6c2.1-.9,4.1-2,6-3.2,1.3-.8,2.5-1.6,3.7-2.5,1.1,3,2.1,5.8,2.9,8.4,1.1,3.4,2.3,6.4,3.6,9l.2.3c1.4,2.3,3,4.4,5.4,6.7,2.6,2.6,5.6,5.3,9.9,5.3h1.3c3.2-.5,6.4-1.8,9.9-4h0c3.8-2.3,5.9-4.1,7.2-6.1l1-2c5.4-14.7,8.4-27.6,9-38.2l2-53.9c.3-3.9.4-7.5.4-10.8v-7.4s.4-18.8.4-18.8l-.3-2.4Z',
  'M648.6,152.7c-2.8-4.7-5.8-8.2-9-10.5l-.4-.3c-11.2-6.6-23.5-9.9-36.9-9.9s-8.7.4-14.5,1.1c-5.4.7-11.8,1.8-19,3.1l-12.8,2.4c-13.6,2.4-24.2,8.5-31.5,18.3-7,9.4-10.5,20.3-10.5,32.4s3.3,24.2,9.7,34.6c2.2,3.8,4.8,8,7.6,12,2.6,3.7,5.2,7.7,7.8,11.9v.2c4.5,6.2,8.4,12.2,11.9,17.7,3.5,5.5,6.7,11,9.5,16,1.8,3.4,2.7,6.8,2.7,10.3,0,5.6-2.1,11.2-6.2,17-5.9,7.8-12.5,11.5-21,11.5s-1.2,0-2.1-.1c-1.2-.1-2.5-.3-4.1-.5-2.7-.6-6.3-1-10.5-1.1-3.9-.1-6.9-.2-9.1-.2l-4.6,2.3-5.4,7.5-.8,5.1c7.6,23.8,26.8,37,54,37s55.2-15.9,67.8-47.4c3.8-9.1,5.7-18,5.7-26.5,0-15.5-5.7-30.5-17-44.6-12.8-15.7-22.7-29.2-29.2-40.1-2.2-3.8-3.3-7.4-3.3-10.7s1.3-7,4.1-9.8,7.4-4.8,13.3-5.4h.2c1.6-.2,3.4-.4,5.7-.4h9.5c4.1,0,7.5,0,10.4-.2,3.2-.1,5.9-.4,8.1-.7h.3c1.9-.4,3.6-.8,5.4-1.4,2.2-.7,4.5-1.7,7.1-3.2,1.5-.7,3-1.5,4.3-2.2.4-.2.7-.3.7-.3l3.9-3.3,3.6-8.4-.3-5.1c-1.1-1.9-2.7-4.6-4.7-8Z',
];

function svgToPng(svg, width, { fonts } = {}) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: 'rgba(0,0,0,0)',
    font: { fontFiles: fonts ?? [], loadSystemFonts: false, defaultFontFamily: 'Geist' },
  });
  return resvg.render().asPng();
}

// --- Social-share (Open Graph) image: 1200x630, wordmark centered on the gradient ---
function buildOgImage() {
  const W = 1200;
  const H = 630;
  const cy = H / 2;

  // Lockup geometry (mirrors components/landing/wordmark.tsx: logo | divider | "Capture").
  const logoH = 116;
  const scale = logoH / 370.4; // Wusel logo viewBox is 0 0 1000 370.4
  const logoW = 1000 * scale;
  const gap = 36;
  const dividerW = 4;
  const dividerH = 84;
  const fontSize = 96;

  const dividerX = logoW + gap;
  const textX = dividerX + dividerW + gap;

  // Positioned at a local origin (x≈0); we measure then translate to center.
  const lockup = `
    <g fill="${LAV}" transform="translate(0 ${cy - logoH / 2}) scale(${scale})">
      ${WUSEL_PATHS.map((d) => `<path d="${d}"/>`).join('')}
    </g>
    <rect x="${dividerX}" y="${cy - dividerH / 2}" width="${dividerW}" height="${dividerH}" rx="2" fill="${LAV}" opacity="0.6"/>
    <text x="${textX}" y="${cy + fontSize * 0.34}" font-family="Geist" font-weight="600" font-size="${fontSize}" letter-spacing="-2" fill="${LAV}">Capture</text>
  `;

  // Pass 1: measure the lockup's real bounding box (needs the font loaded for the text).
  const measure = new Resvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${lockup}</svg>`,
    { font: { fontFiles: geistFonts, loadSystemFonts: false, defaultFontFamily: 'Geist' } },
  );
  const bbox = measure.getBBox();
  if (!bbox) throw new Error('Could not measure lockup bbox (font failed to load?)');
  const dx = (W - bbox.width) / 2 - bbox.x;

  // Pass 2: full image — sand gradient + top-center lavender glow (mirrors the hero) + centered lockup.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f7f3ec"/>
        <stop offset="1" stop-color="#ece5d8"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="0.12" r="0.75">
        <stop offset="0" stop-color="${LAV}" stop-opacity="0.26"/>
        <stop offset="1" stop-color="${LAV}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sand)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <g transform="translate(${dx} 0)">${lockup}</g>
  </svg>`;

  return svgToPng(svg, W, { fonts: geistFonts });
}

// --- Apple touch icon: 180x180, lavender W on an opaque sand background (iOS masks corners) ---
function buildAppleIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
    <rect width="320" height="320" fill="#f4efe6"/>
    <path fill="${LAV}" transform="translate(23.5 -44.5)" d="${W_MARK}"/>
  </svg>`;
  return svgToPng(svg, 180);
}

async function main() {
  fs.mkdirSync(publicDir, { recursive: true });

  const faviconSvg = fs.readFileSync(path.join(publicDir, 'favicon.svg'), 'utf8');

  // favicon.ico: transparent lavender W at 16/32/48 for legacy browsers.
  const icoPngs = [16, 32, 48].map((size) => svgToPng(faviconSvg, size));
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), await pngToIco(icoPngs));

  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buildAppleIcon());
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), buildOgImage());

  console.log('Wrote favicon.ico, apple-touch-icon.png, og-image.png to', publicDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
