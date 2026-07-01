// Builds the host, registers the native-messaging manifest for installed
// Chromium-family browsers, and writes an example config (if none exists).
//
// Usage:
//   pnpm --filter @wusel-capture/host install-host -- --extension-id <ID>
//   (find the unpacked extension's ID at chrome://extensions)

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HOST_NAME = 'com.wusel.capture';

function argFlag(name) {
	const i = process.argv.indexOf(name);
	return i >= 0 ? process.argv[i + 1] : undefined;
}

// 1. Build the binary (build.mjs runs on import via top-level await).
await import('./build.mjs');
const binPath = resolve(root, 'dist/index.mjs');

// 2. Resolve the extension ID.
const extensionId = process.env.WUSEL_EXTENSION_ID ?? argFlag('--extension-id');
if (!extensionId) {
	console.error(
		'\nMissing extension ID. Load the unpacked extension at chrome://extensions, copy its ID, then run:\n' +
			'  pnpm --filter @wusel-capture/host install-host -- --extension-id <ID>\n',
	);
	process.exit(1);
}

// 3. Write the native-messaging manifest into each installed browser's host dir.
const manifest = {
	name: HOST_NAME,
	description: 'Wusel Capture native host',
	path: binPath,
	type: 'stdio',
	allowed_origins: [`chrome-extension://${extensionId}/`],
};

const home = homedir();
const browserBases =
	platform() === 'darwin'
		? {
				'Google Chrome': `${home}/Library/Application Support/Google/Chrome`,
				Chromium: `${home}/Library/Application Support/Chromium`,
				Brave: `${home}/Library/Application Support/BraveSoftware/Brave-Browser`,
				'Microsoft Edge': `${home}/Library/Application Support/Microsoft Edge`,
			}
		: platform() === 'linux'
			? {
					'Google Chrome': `${home}/.config/google-chrome`,
					Chromium: `${home}/.config/chromium`,
					Brave: `${home}/.config/BraveSoftware/Brave-Browser`,
					'Microsoft Edge': `${home}/.config/microsoft-edge`,
				}
			: {};

if (platform() === 'win32') {
	console.error('\nWindows: register the manifest via the registry — see README. Not auto-installed.\n');
	process.exit(1);
}

let wrote = 0;
for (const [name, base] of Object.entries(browserBases)) {
	if (!existsSync(base)) continue; // skip browsers that aren't installed
	const dir = join(base, 'NativeMessagingHosts');
	mkdirSync(dir, { recursive: true });
	writeFileSync(join(dir, `${HOST_NAME}.json`), JSON.stringify(manifest, null, 2));
	console.log(`✓ ${name}: ${join(dir, `${HOST_NAME}.json`)}`);
	wrote++;
}
if (wrote === 0) console.warn('No Chromium-family browser dirs found — nothing registered.');

// 4. Example config (do not overwrite an existing one).
const cfgPath = join(home, '.wusel-capture', 'config.json');
if (!existsSync(cfgPath)) {
	mkdirSync(dirname(cfgPath), { recursive: true });
	const example = {
		captureRoot: '.wusel-capture',
		defaultProvider: 'claude-code-vscode',
		inbox: '~/wusel-capture-inbox',
		projects: [
			{
				name: 'example',
				match: ['http://localhost:5173/*', 'http://localhost:3000/*'],
				path: '/absolute/path/to/your/project',
			},
		],
	};
	writeFileSync(cfgPath, JSON.stringify(example, null, 2));
	console.log(`✓ wrote example config: ${cfgPath} (edit the project mappings)`);
} else {
	console.log(`• config exists, left untouched: ${cfgPath}`);
}

console.log('\nDone. Reload the extension and use "Send to Claude Code".');
