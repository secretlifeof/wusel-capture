// Capture delivery to an AI coding assistant (Claude Code, Codex, …).
//
// One action, two tiers:
//   Tier B (native host): hand the capture to the `com.wusel.capture` native
//     messaging host, which writes it into the URL-mapped project folder and
//     opens the selected provider's deep link itself.
//   Tier A (no install): download the annotated image + capture.json (no
//     subfolder), resolve their absolute paths, and open the provider's deep link
//     from the browser (pre-fills the prompt, the user presses Enter).
//
// Tier B is attempted first; if the host isn't installed it falls back to Tier A.

import { makeId } from '../lib/id';
import type { Annotation, CapturePayload } from '../types';
import { buildBrowserCapture, compositeImage } from './export';
import { getProviderOption } from './providers';

const NATIVE_HOST = 'com.wusel.capture';

// Filename for a downloaded capture: first 10 chars of the page title, then the
// date, then the time. No folder. e.g. "Wusel-Ki_2026-06-29_143000".
function captureFileBase(title: string, when: Date): string {
	const prefix =
		(title || '').slice(0, 10).replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'capture';
	const p = (n: number) => String(n).padStart(2, '0');
	const date = `${when.getFullYear()}-${p(when.getMonth() + 1)}-${p(when.getDate())}`;
	const time = `${p(when.getHours())}${p(when.getMinutes())}${p(when.getSeconds())}`;
	return `${prefix}_${date}_${time}`;
}

export interface SendResult {
	ok: boolean;
	via?: 'host' | 'download';
	folder?: string;
	error?: string;
}

interface HostResponse {
	ok?: boolean;
	captureFolder?: string;
	message?: string;
	error?: string;
}

export async function sendCapture(
	providerId: string,
	payload: CapturePayload,
	annotations: Annotation[],
	note: string,
	// Optional existing session id — when set, every send focuses that same chat
	// (Claude Code's `?session=` only resumes an id that already exists).
	sessionId?: string,
): Promise<SendResult> {
	const provider = getProviderOption(providerId);
	const imageBlob = await compositeImage(payload, annotations, 'png', 0.92);
	const capture = buildBrowserCapture(payload, annotations, note, {
		filename: 'annotated.png',
		format: 'png',
	});
	const jsonText = JSON.stringify(capture, null, 2);

	// Tier B — native host (writes into the mapped project folder).
	try {
		const base64 = await blobToBase64(imageBlob);
		const resp = await trySendViaHost({
			type: 'capture.send',
			version: '1.0',
			provider: provider.id,
			capture: {
				id: makeId('cap'),
				url: payload.page.url,
				title: payload.page.title,
				note,
				capturedAt: payload.capturedAt,
				captureMode: payload.captureMode,
				session: sessionId || undefined,
			},
			assets: [
				{ name: 'annotated.png', mimeType: 'image/png', encoding: 'base64', data: base64 },
				{ name: 'capture.json', mimeType: 'application/json', encoding: 'utf8', data: jsonText },
			],
		});
		if (resp?.ok) return { ok: true, via: 'host', folder: resp.captureFolder };
		// host present but refused — fall through to Tier A
	} catch {
		// host not installed / errored — fall back to Tier A
	}

	// Tier A — the user SAVES the image via a dialog (they pick the location; no
	// folder is created), then the provider deep link points at that saved path.
	// Context (note + diagnostics) is folded into the prompt, so there is a single
	// user-picked file.
	try {
		const base = captureFileBase(payload.page.title, new Date(payload.capturedAt));
		// saveAs: true → a Save dialog; the user picks where the image lives.
		const imgPath = await downloadAndResolve(imageBlob, `${base}.png`, true);
		openDeepLink(provider.buildUri(buildPrompt(payload, note, imgPath), { sessionId }));
		return { ok: true, via: 'download', folder: imgPath.replace(/[/\\][^/\\]+$/, '') };
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : String(err) };
	}
}

function trySendViaHost(message: unknown): Promise<HostResponse | undefined> {
	return new Promise((resolve, reject) => {
		try {
			chrome.runtime.sendNativeMessage(NATIVE_HOST, message as object, (resp) => {
				const err = chrome.runtime.lastError;
				if (err) reject(new Error(err.message));
				else resolve(resp as HostResponse | undefined);
			});
		} catch (e) {
			reject(e instanceof Error ? e : new Error(String(e)));
		}
	});
}

// Tier A prompt: references the single saved image and folds the context inline
// (note + page + a capped diagnostics summary), keeping the deep-link URL bounded.
export function buildPrompt(payload: CapturePayload, note: string, imagePath: string): string {
	const { page, diagnostics } = payload;
	const b = page.browser ?? {
		name: '',
		version: '',
		platform: '',
		language: '',
		screen: { width: 0, height: 0 },
		mobile: false,
		touchPoints: 0,
	};
	const trunc = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}…` : s);
	const lines = [
		'I captured a browser screenshot with annotations for a UI/debugging task.',
		'',
		`Task: ${note.trim() || '(no note provided)'}`,
		'',
		`Page: ${page.title || '(untitled)'} — ${page.url}`,
		`Browser: ${b.name} ${b.version} on ${b.platform || 'unknown'} (lang ${b.language || 'n/a'})`,
		`Viewport: ${page.viewport.width}x${page.viewport.height} · DPR ${page.devicePixelRatio} · screen ${b.screen.width}x${b.screen.height}`,
		b.mobile
			? `Device emulation: ON — the page is rendered as a mobile device (DevTools device mode, e.g. an iPhone). ${b.touchPoints} touch points. The screenshot reflects that emulated viewport, not a real desktop window.`
			: 'Device emulation: off (desktop viewport).',
		`User agent: ${page.userAgent}`,
		'',
		`Screenshot: ${imagePath}`,
	];

	const errors = diagnostics.consoleErrors;
	if (errors.length) {
		lines.push('', `Console errors (${errors.length}):`);
		for (const e of errors.slice(0, 5)) lines.push(`- ${e.level}: ${trunc(e.message, 160)}`);
		if (errors.length > 5) lines.push(`- …and ${errors.length - 5} more`);
	}

	const requests = diagnostics.failedRequests;
	if (requests.length) {
		lines.push('', `Failed requests (${requests.length}):`);
		for (const r of requests.slice(0, 5)) lines.push(`- ${r.status || 'ERR'} ${r.method} ${trunc(r.url, 200)}`);
		if (requests.length > 5) lines.push(`- …and ${requests.length - 5} more`);
	}

	lines.push(
		'',
		'Please open and inspect the screenshot, identify the likely cause, find the relevant',
		'source files in this repo, and propose the smallest safe fix. Preserve the existing design system.',
		'',
		'Use the /wusel-capture skill to do this.',
	);
	return lines.join('\n');
}

function openDeepLink(url: string) {
	// Anchor click triggers the external-protocol handler from this extension page.
	const a = document.createElement('a');
	a.href = url;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	a.remove();
}

// Download a blob and resolve its absolute on-disk path once saved. `saveAs:true`
// shows the Save dialog so the user picks the location; `filename` is the
// suggested name (relative to Downloads).
function downloadAndResolve(blob: Blob, filename: string, saveAs: boolean): Promise<string> {
	const url = URL.createObjectURL(blob);
	return new Promise((resolve, reject) => {
		chrome.downloads.download({ url, filename, saveAs }, (downloadId) => {
			if (chrome.runtime.lastError || downloadId == null) {
				URL.revokeObjectURL(url);
				reject(new Error(chrome.runtime.lastError?.message ?? 'Download failed.'));
				return;
			}
			const onChanged = (delta: chrome.downloads.DownloadDelta) => {
				if (delta.id !== downloadId || !delta.state) return;
				if (delta.state.current === 'complete') {
					chrome.downloads.onChanged.removeListener(onChanged);
					chrome.downloads.search({ id: downloadId }, (items) => {
						URL.revokeObjectURL(url);
						const path = items[0]?.filename;
						if (path) resolve(path);
						else reject(new Error('Could not resolve download path.'));
					});
				} else if (delta.state.current === 'interrupted') {
					chrome.downloads.onChanged.removeListener(onChanged);
					URL.revokeObjectURL(url);
					reject(new Error(delta.error?.current === 'USER_CANCELED' ? 'Save canceled.' : 'Download interrupted.'));
				}
			};
			chrome.downloads.onChanged.addListener(onChanged);
		});
	});
}

function blobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			resolve(result.slice(result.indexOf(',') + 1)); // strip data:…;base64,
		};
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(blob);
	});
}
