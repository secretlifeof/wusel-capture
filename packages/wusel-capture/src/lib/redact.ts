// Light, best-effort redaction for URLs captured in diagnostics. We never store
// request/response bodies, headers, or cookies — only the request line — and we
// additionally strip token-like query parameters from the URL itself so a
// captured failing request can't leak a session token into the JSON file.

const SECRET_KEY = /(token|secret|password|authorization|cookie|session|jwt|api[_-]?key|access)/i;

export function redactUrl(rawUrl: string): string {
	try {
		const url = new URL(rawUrl, 'http://invalid.local');
		let changed = false;
		// Materialize keys first — we mutate searchParams inside the loop.
		for (const key of Array.from(url.searchParams.keys())) {
			if (SECRET_KEY.test(key)) {
				url.searchParams.set(key, '[REDACTED]');
				changed = true;
			}
		}
		if (!changed) return rawUrl;
		// Reconstruct without the synthetic base if it was a relative URL.
		return url.origin === 'http://invalid.local' ? url.pathname + url.search : url.toString();
	} catch {
		return rawUrl;
	}
}
