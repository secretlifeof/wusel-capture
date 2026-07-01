// Central place for the placeholder marketing links/commands. Swap these for the
// real Chrome Web Store URL and repo once they exist.
export const site = {
  name: 'Wusel Capture',
  // Production origin, used for absolute canonical / Open Graph URLs.
  url: 'https://capture.wusel.dev',
  github: 'https://github.com/wusel-capture/wusel-capture',
  // Packed extension is shipped as a release asset until it lands on the
  // Chrome Web Store.
  extensionDownload: 'https://github.com/wusel-capture/wusel-capture/releases/latest',
  skillCommand: 'npx skills add wusel-capture',
} as const;
