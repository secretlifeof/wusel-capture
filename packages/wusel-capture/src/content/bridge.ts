// Runs in the ISOLATED world. Owns chrome.runtime messaging. Accumulates the
// diagnostics relayed by the MAIN-world collector, answers GET_PAGE_INFO with
// page metadata + diagnostics, and drives the region-selection overlay.

import { collectPageInfo } from '../lib/page-info';
import type {
	ConsoleErrorEntry,
	FailedRequestEntry,
	PageInfoResponse,
	RegionSelectResponse,
} from '../types';

const MAX = 100;
const consoleErrors: ConsoleErrorEntry[] = [];
const failedRequests: FailedRequestEntry[] = [];

let flushResolve: (() => void) | null = null;

function replace<T>(target: T[], next: T[]) {
	target.length = 0;
	for (const item of next.slice(-MAX)) target.push(item);
}
function pushCapped<T>(target: T[], item: T) {
	target.push(item);
	if (target.length > MAX) target.shift();
}

window.addEventListener('message', (e: MessageEvent) => {
	if (e.source !== window) return;
	const d = e.data as
		| {
				__ckCollector?: boolean;
				kind?: string;
				entryType?: string;
				payload?: unknown;
				console?: ConsoleErrorEntry[];
				requests?: FailedRequestEntry[];
		  }
		| null;
	if (!d?.__ckCollector) return;

	if (d.kind === 'entry') {
		if (d.entryType === 'console') pushCapped(consoleErrors, d.payload as ConsoleErrorEntry);
		else if (d.entryType === 'request') pushCapped(failedRequests, d.payload as FailedRequestEntry);
	} else if (d.kind === 'snapshot') {
		// Collector buffer is authoritative — replace to dedupe.
		replace(consoleErrors, d.console ?? []);
		replace(failedRequests, d.requests ?? []);
		flushResolve?.();
		flushResolve = null;
	}
});

function requestFlush(): Promise<void> {
	return new Promise((resolve) => {
		flushResolve = resolve;
		window.postMessage({ __ckBridge: true, kind: 'flush' }, '*');
		setTimeout(() => {
			flushResolve = null;
			resolve();
		}, 80);
	});
}

async function handleGetPageInfo(): Promise<PageInfoResponse> {
	await requestFlush();
	return {
		page: collectPageInfo(),
		diagnostics: { consoleErrors: consoleErrors.slice(), failedRequests: failedRequests.slice() },
	};
}

function startRegionSelect(): Promise<RegionSelectResponse> {
	return new Promise((resolve) => {
		const overlay = document.createElement('div');
		Object.assign(overlay.style, {
			position: 'fixed',
			inset: '0',
			zIndex: '2147483647',
			cursor: 'crosshair',
			background: 'transparent',
		} satisfies Partial<CSSStyleDeclaration>);

		const box = document.createElement('div');
		Object.assign(box.style, {
			position: 'fixed',
			display: 'none',
			border: '2px solid #fff',
			boxShadow: '0 0 0 9999px rgba(15,15,15,0.4)',
			pointerEvents: 'none',
		} satisfies Partial<CSSStyleDeclaration>);

		const hint = document.createElement('div');
		hint.textContent = 'Drag to select · Esc to cancel';
		Object.assign(hint.style, {
			position: 'fixed',
			top: '12px',
			left: '50%',
			transform: 'translateX(-50%)',
			zIndex: '2147483647',
			background: 'rgba(0,0,0,0.78)',
			color: '#fff',
			font: '500 13px/1.4 ui-sans-serif, system-ui, sans-serif',
			padding: '6px 14px',
			borderRadius: '9999px',
			pointerEvents: 'none',
		} satisfies Partial<CSSStyleDeclaration>);

		overlay.appendChild(box);
		const host = document.documentElement;
		host.appendChild(overlay);
		host.appendChild(hint);

		let dragging = false;
		let startX = 0;
		let startY = 0;
		let rect = { x: 0, y: 0, w: 0, h: 0 };

		const cleanup = () => {
			overlay.remove();
			hint.remove();
			window.removeEventListener('keydown', onKey, true);
		};
		const finish = (res: RegionSelectResponse) => {
			cleanup();
			// Two frames so the page repaints without the overlay before capture.
			requestAnimationFrame(() => requestAnimationFrame(() => resolve(res)));
		};
		const update = (e: MouseEvent) => {
			const x = Math.min(startX, e.clientX);
			const y = Math.min(startY, e.clientY);
			const w = Math.abs(e.clientX - startX);
			const h = Math.abs(e.clientY - startY);
			rect = { x, y, w, h };
			Object.assign(box.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				finish({ cancelled: true });
			}
		};

		overlay.addEventListener('mousedown', (e) => {
			dragging = true;
			startX = e.clientX;
			startY = e.clientY;
			box.style.display = 'block';
			update(e);
		});
		overlay.addEventListener('mousemove', (e) => {
			if (dragging) update(e);
		});
		overlay.addEventListener('mouseup', (e) => {
			if (!dragging) return;
			dragging = false;
			update(e);
			if (rect.w < 4 || rect.h < 4) finish({ cancelled: true });
			else finish({ cancelled: false, rect, devicePixelRatio: window.devicePixelRatio });
		});
		window.addEventListener('keydown', onKey, true);
	});
}

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
	const type = (message as { type?: string } | null)?.type;
	if (type === 'GET_PAGE_INFO') {
		handleGetPageInfo().then(sendResponse);
		return true;
	}
	if (type === 'START_REGION_SELECT') {
		startRegionSelect().then(sendResponse);
		return true;
	}
	return false;
});
