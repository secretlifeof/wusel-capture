// Native messaging host for Wusel Capture.
//
// Launched by Chrome per `chrome.runtime.sendNativeMessage`: it reads exactly one
// length-prefixed JSON message from stdin, writes the project capture to disk,
// hands it to the configured provider (Claude Code deep link), writes one
// length-prefixed JSON response to stdout, and exits.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { writeCapture } from './capture/write';
import { loadConfig, resolveProjectPath } from './config';
import { buildPrompt } from './prompt';
import { getProvider } from './providers';
import type { CaptureMessage, HostResponse } from './types';

async function handle(message: CaptureMessage): Promise<HostResponse> {
	if (!message || message.type !== 'capture.send') {
		throw new Error('unsupported message type');
	}
	const config = loadConfig();
	const { path: projectPath } = resolveProjectPath(config, message.capture.url);

	const { folder, files } = writeCapture(
		projectPath,
		config.captureRoot,
		message.capture.id,
		message.assets ?? [],
	);

	const imagePath = files['annotated.png'] ?? folder;
	const jsonPath = files['capture.json'] ?? folder;
	const prompt = buildPrompt(message.capture, imagePath, jsonPath);
	writeFileSync(join(folder, 'prompt.md'), prompt, 'utf8');

	const provider = getProvider(message.provider ?? config.defaultProvider);
	const result = await provider.deliver({
		capture: message.capture,
		captureFolder: folder,
		projectPath,
		files,
		prompt,
	});

	return {
		version: '1.0',
		type: 'capture.result',
		ok: true,
		captureFolder: folder,
		provider: provider.id,
		message: result.message,
	};
}

function readMessage(): Promise<CaptureMessage> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		let expected = -1;

		const tryParse = () => {
			const buf = Buffer.concat(chunks);
			if (expected < 0 && buf.length >= 4) expected = buf.readUInt32LE(0);
			if (expected >= 0 && buf.length >= 4 + expected) {
				cleanup();
				try {
					resolve(JSON.parse(buf.subarray(4, 4 + expected).toString('utf8')) as CaptureMessage);
				} catch (e) {
					reject(e instanceof Error ? e : new Error(String(e)));
				}
			}
		};
		const onData = (chunk: Buffer) => {
			chunks.push(chunk);
			tryParse();
		};
		const onEnd = () => {
			cleanup();
			reject(new Error('stdin closed before a full message arrived'));
		};
		const cleanup = () => {
			process.stdin.off('data', onData);
			process.stdin.off('end', onEnd);
		};
		process.stdin.on('data', onData);
		process.stdin.on('end', onEnd);
	});
}

function writeMessage(obj: HostResponse): Promise<void> {
	return new Promise((resolve) => {
		const json = Buffer.from(JSON.stringify(obj), 'utf8');
		const header = Buffer.alloc(4);
		header.writeUInt32LE(json.length, 0); // Chrome caps host->extension at 1 MiB; our response is tiny.
		process.stdout.write(Buffer.concat([header, json]), () => resolve());
	});
}

async function main() {
	let response: HostResponse;
	try {
		response = await handle(await readMessage());
	} catch (err) {
		response = {
			version: '1.0',
			type: 'capture.result',
			ok: false,
			error: err instanceof Error ? err.message : String(err),
		};
	}
	await writeMessage(response);
	process.exit(0);
}

void main();
