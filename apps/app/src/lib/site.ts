// Central place for the marketing links/commands.
export const site = {
  name: 'Wusel Capture',
  // Production origin, used for absolute canonical / Open Graph URLs. The site
  // is published to GitHub Pages from apps/app (see .github/workflows/pages.yml);
  // update this and Vite's `base` together if it ever moves to its own domain.
  url: 'https://secretlifeof.github.io/wusel-capture',
  github: 'https://github.com/secretlifeof/wusel-capture',
  // Packed extension is shipped as a release asset until it lands on the
  // Chrome Web Store.
  extensionDownload: 'https://github.com/secretlifeof/wusel-capture/releases/latest',
  skillCommand: 'npx skills add wusel-capture',
  // The Chrome Web Store listing points at this page.
  privacyPolicy: 'https://secretlifeof.github.io/wusel-capture/privacy',
  contactEmail: 'wusel-capture@wusel.app',
  maintainer: 'Espen Finnesand',
} as const;
