// Runs in the page's MAIN world at document_start so it can observe the real
// page context: console errors/warnings, uncaught errors, unhandled rejections,
// and failed fetch/XHR requests. It owns NO chrome.* APIs; it relays everything
// to the ISOLATED-world bridge via window.postMessage. The bridge is the
// canonical buffer and forwards to the service worker on demand.
//
// Limitation: only events after this script installs are seen (it runs early,
// but anything logged before document_start, or from web workers, is missed).
//
// All page patches are wrapped in try/catch: a frozen console / non-writable
// fetch must never break the host page or abort the rest of the collector.

interface ConsoleEntry {
	level: 'error' | 'warn';
	message: string;
	source?: string;
	timestamp: string;
}
interface RequestEntry {
	url: string;
	method: string;
	status: number;
	statusText: string;
	type: 'fetch' | 'xhr';
	timestamp: string;
}

(() => {
	const MAX = 100;
	const consoleErrors: ConsoleEntry[] = [];
	const failedRequests: RequestEntry[] = [];

	const now = () => new Date().toISOString();
	const push = <T>(arr: T[], item: T) => {
		arr.push(item);
		if (arr.length > MAX) arr.shift();
	};
	const post = (msg: Record<string, unknown>) =>
		window.postMessage({ __ckCollector: true, ...msg }, '*');
	const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}…` : s);
	const stringify = (a: unknown) => {
		if (typeof a === 'string') return a;
		if (a instanceof Error) return a.stack || a.message;
		try {
			return JSON.stringify(a);
		} catch {
			return String(a);
		}
	};

	const recordConsole = (level: 'error' | 'warn', args: unknown[], source?: string) => {
		const entry: ConsoleEntry = {
			level,
			message: truncate(args.map(stringify).join(' '), 2000),
			source,
			timestamp: now(),
		};
		push(consoleErrors, entry);
		post({ kind: 'entry', entryType: 'console', payload: entry });
	};

	const recordRequest = (r: Omit<RequestEntry, 'timestamp'>) => {
		const entry: RequestEntry = { ...r, timestamp: now() };
		push(failedRequests, entry);
		post({ kind: 'entry', entryType: 'request', payload: entry });
	};

	// --- console -----------------------------------------------------------
	try {
		const origError = console.error.bind(console);
		const origWarn = console.warn.bind(console);
		console.error = (...args: unknown[]) => {
			try {
				recordConsole('error', args);
			} catch {
				/* never break the page */
			}
			return origError(...args);
		};
		console.warn = (...args: unknown[]) => {
			try {
				recordConsole('warn', args);
			} catch {
				/* never break the page */
			}
			return origWarn(...args);
		};
	} catch {
		/* console not patchable */
	}

	window.addEventListener('error', (e: ErrorEvent) => {
		const source = e.filename ? `${e.filename}:${e.lineno}:${e.colno}` : undefined;
		recordConsole('error', [e.message || 'Uncaught error'], source);
	});
	window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
		const reason = e.reason as { message?: string } | string | undefined;
		const message = typeof reason === 'object' && reason?.message ? reason.message : String(reason);
		recordConsole('error', [`Unhandled rejection: ${message}`]);
	});

	// --- fetch -------------------------------------------------------------
	try {
		const origFetch = window.fetch;
		if (typeof origFetch === 'function') {
			window.fetch = async function (this: unknown, ...args: Parameters<typeof fetch>) {
				const [input, init] = args;
				const url =
					typeof input === 'string'
						? input
						: input instanceof URL
							? input.href
							: ((input as Request)?.url ?? String(input));
				const method = init?.method ?? (input as Request)?.method ?? 'GET';
				try {
					const res = await origFetch.apply(this as typeof globalThis, args);
					if (!res.ok) {
						recordRequest({ url, method, status: res.status, statusText: res.statusText, type: 'fetch' });
					}
					return res;
				} catch (err) {
					const msg = err instanceof Error ? err.message : 'Network error';
					recordRequest({ url, method, status: 0, statusText: msg, type: 'fetch' });
					throw err;
				}
			} as typeof fetch;
		}
	} catch {
		/* fetch not patchable */
	}

	// --- XHR ---------------------------------------------------------------
	try {
		const Xhr = window.XMLHttpRequest;
		if (Xhr) {
			const open = Xhr.prototype.open;
			const send = Xhr.prototype.send;
			Xhr.prototype.open = function (
				this: XMLHttpRequest & { __ck?: { method: string; url: string } },
				method: string,
				url: string | URL,
				...rest: unknown[]
			) {
				this.__ck = { method, url: String(url) };
				return open.apply(this, [method, url, ...rest] as never);
			} as typeof open;
			Xhr.prototype.send = function (
				this: XMLHttpRequest & { __ck?: { method: string; url: string } },
				...a: unknown[]
			) {
				this.addEventListener('loadend', () => {
					if (this.status === 0 || this.status >= 400) {
						const meta = this.__ck ?? { method: 'GET', url: '' };
						recordRequest({
							url: meta.url,
							method: meta.method,
							status: this.status,
							statusText: this.statusText || (this.status === 0 ? 'Network error' : ''),
							type: 'xhr',
						});
					}
				});
				return send.apply(this, a as never);
			} as typeof send;
		}
	} catch {
		/* XHR not patchable */
	}

	// --- bridge handshake --------------------------------------------------
	window.addEventListener('message', (e: MessageEvent) => {
		if (e.source !== window) return;
		const data = e.data as { __ckBridge?: boolean; kind?: string } | null;
		if (data?.__ckBridge && data.kind === 'flush') {
			post({ kind: 'snapshot', console: consoleErrors.slice(), requests: failedRequests.slice() });
		}
	});
})();
