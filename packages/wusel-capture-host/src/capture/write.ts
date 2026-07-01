import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { isInside, sanitizeFilename, sanitizeId } from '../security';
import type { Asset } from '../types';

export interface WrittenCapture {
	folder: string;
	files: Record<string, string>; // asset name -> absolute path
}

// Write the capture assets into `<projectPath>/<captureRoot>/<id>/`, refusing to
// write anywhere outside that root.
export function writeCapture(
	projectPath: string,
	captureRoot: string,
	id: string,
	assets: Asset[],
): WrittenCapture {
	const root = resolve(projectPath, captureRoot);
	const folder = resolve(root, sanitizeId(id));
	if (!isInside(root, folder)) throw new Error('refusing to write outside the capture root');

	mkdirSync(folder, { recursive: true });
	const files: Record<string, string> = {};
	for (const asset of assets) {
		const dest = join(folder, sanitizeFilename(asset.name));
		if (!isInside(folder, dest)) continue;
		const buf =
			asset.encoding === 'base64'
				? Buffer.from(asset.data, 'base64')
				: Buffer.from(asset.data, 'utf8');
		writeFileSync(dest, buf);
		files[asset.name] = dest;
	}
	return { folder, files };
}
