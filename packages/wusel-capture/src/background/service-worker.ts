// Capture orchestration. Receives a CAPTURE request from the popup, produces a
// screenshot (viewport / full-page via the Debugger API / cropped region),
// gathers page metadata + buffered diagnostics from the bridge content script,
// persists everything to IndexedDB, and opens the editor tab.

import { makeId } from '../lib/id';
import { collectPageInfo } from '../lib/page-info';
import { redactUrl } from '../lib/redact';
import { pruneCaptures, putCapture } from '../storage';
import type {
	CaptureMode,
	CapturePayload,
	CaptureRequest,
	Diagnostics,
	PageInfo,
	PageInfoResponse,
	RegionSelectResponse,
} from '../types';

const MAX_DIMENSION = 16_384; // Chrome's max canvas/texture dimension.

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
	if (!message || typeof message !== 'object' || (message as { type?: string }).type !== 'CAPTURE') {
		return false;
	}
	handleCapture(message as CaptureRequest)
		.then(() => sendResponse({ ok: true }))
		.catch((err: unknown) =>
			sendResponse({ ok: false, error: err instanceof Error ? err.message : String(err) }),
		);
	return true; // keep the channel open for the async response
});

async function handleCapture(req: CaptureRequest): Promise<void> {
	const { mode, tabId, windowId } = req;
	const info = await getPageInfo(tabId);

	const imageDataUrl = await capture(mode, tabId, windowId);
	const { width, height } = await imageSize(imageDataUrl);

	const payload: CapturePayload = {
		id: makeId(),
		capturedAt: new Date().toISOString(),
		captureMode: mode,
		imageDataUrl,
		imageWidth: width,
		imageHeight: height,
		page: info.page,
		diagnostics: redactDiagnostics(info.diagnostics),
	};

	await putCapture(payload);
	await pruneCaptures(10).catch(() => undefined);
	await chrome.tabs.create({ url: chrome.runtime.getURL(`editor.html?id=${payload.id}`) });
}

function capture(mode: CaptureMode, tabId: number, windowId: number): Promise<string> {
	if (mode === 'viewport') return captureViewport(windowId);
	if (mode === 'fullpage') return captureFullPage(tabId);
	return captureRegion(tabId, windowId);
}

// ---- viewport ------------------------------------------------------------

function captureViewport(windowId: number): Promise<string> {
	return chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
}

// ---- full page (Debugger API) -------------------------------------------

async function captureFullPage(tabId: number): Promise<string> {
	const target: chrome.debugger.Debuggee = { tabId };
	try {
		await chrome.debugger.attach(target, '1.3');
	} catch (err) {
		throw new Error(
			`Could not attach the debugger (is DevTools open?): ${err instanceof Error ? err.message : String(err)}`,
		);
	}
	try {
		const metrics = (await sendCmd(target, 'Page.getLayoutMetrics')) as {
			cssContentSize?: { width: number; height: number };
			contentSize?: { width: number; height: number };
		};
		const content = metrics.cssContentSize ?? metrics.contentSize;
		if (!content) throw new Error('Could not determine the page size.');

		const clip = {
			x: 0,
			y: 0,
			width: Math.min(content.width, MAX_DIMENSION),
			height: Math.min(content.height, MAX_DIMENSION),
			scale: 1,
		};
		const result = (await sendCmd(target, 'Page.captureScreenshot', {
			format: 'png',
			captureBeyondViewport: true,
			clip,
		})) as { data: string };
		return `data:image/png;base64,${result.data}`;
	} finally {
		await chrome.debugger.detach(target).catch(() => undefined);
	}
}

function sendCmd(target: chrome.debugger.Debuggee, method: string, params?: object): Promise<unknown> {
	return new Promise((resolve, reject) => {
		chrome.debugger.sendCommand(target, method, params, (res) => {
			const err = chrome.runtime.lastError;
			if (err) reject(new Error(err.message));
			else resolve(res);
		});
	});
}

// ---- region --------------------------------------------------------------

async function captureRegion(tabId: number, windowId: number): Promise<string> {
	const sel = (await chrome.tabs.sendMessage(tabId, {
		type: 'START_REGION_SELECT',
	})) as RegionSelectResponse;
	if (sel.cancelled) throw new Error('Selection cancelled.');

	const full = await captureViewport(windowId);
	return cropDataUrl(full, sel.rect, sel.devicePixelRatio);
}

async function cropDataUrl(
	dataUrl: string,
	rect: { x: number; y: number; w: number; h: number },
	dpr: number,
): Promise<string> {
	const bitmap = await createImageBitmap(await dataUrlToBlob(dataUrl));
	const sx = Math.round(rect.x * dpr);
	const sy = Math.round(rect.y * dpr);
	const sw = Math.max(1, Math.round(rect.w * dpr));
	const sh = Math.max(1, Math.round(rect.h * dpr));
	const canvas = new OffscreenCanvas(sw, sh);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas context unavailable.');
	ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, sw, sh);
	bitmap.close();
	return blobToDataUrl(await canvas.convertToBlob({ type: 'image/png' }));
}

// ---- page info + diagnostics --------------------------------------------

async function getPageInfo(tabId: number): Promise<PageInfoResponse> {
	// Page + browser info via executeScript: this injects the CURRENT bundled
	// collectPageInfo into the page, so it works even when an already-open tab is
	// still running a stale content script (which wouldn't have the browser fields).
	const page = await getPageMeta(tabId);

	// Diagnostics (buffered console errors / failed requests) come from the bridge
	// content script if present — best-effort.
	let diagnostics: Diagnostics = { consoleErrors: [], failedRequests: [] };
	try {
		const res = (await chrome.tabs.sendMessage(tabId, { type: 'GET_PAGE_INFO' })) as
			| PageInfoResponse
			| undefined;
		if (res?.diagnostics) diagnostics = res.diagnostics;
	} catch {
		// bridge not present (page predates install, or restricted)
	}
	return { page, diagnostics };
}

async function getPageMeta(tabId: number): Promise<PageInfo> {
	try {
		// collectPageInfo is self-contained, so it serializes cleanly into the page.
		const [{ result }] = await chrome.scripting.executeScript({ target: { tabId }, func: collectPageInfo });
		if (result) return result as PageInfo;
	} catch {
		// fall through to the tab-metadata-only fallback
	}
	const tab = await chrome.tabs.get(tabId);
	return {
		url: tab.url ?? '',
		title: tab.title ?? '',
		userAgent: '',
		viewport: { width: 0, height: 0 },
		devicePixelRatio: 1,
		scroll: { x: 0, y: 0 },
		browser: {
			name: '',
			version: '',
			platform: '',
			language: '',
			screen: { width: 0, height: 0 },
			mobile: false,
			touchPoints: 0,
		},
	};
}

function redactDiagnostics(d: Diagnostics): Diagnostics {
	return {
		consoleErrors: d.consoleErrors,
		failedRequests: d.failedRequests.map((r) => ({ ...r, url: redactUrl(r.url) })),
	};
}

// ---- helpers -------------------------------------------------------------

async function imageSize(dataUrl: string): Promise<{ width: number; height: number }> {
	const bitmap = await createImageBitmap(await dataUrlToBlob(dataUrl));
	const size = { width: bitmap.width, height: bitmap.height };
	bitmap.close();
	return size;
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
	return (await fetch(dataUrl)).blob();
}

function blobToDataUrl(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(blob);
	});
}
