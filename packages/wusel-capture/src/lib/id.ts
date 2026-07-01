// crypto.randomUUID is available in service workers, extension pages, and
// secure content-script contexts.
export function makeId(prefix = 'cap'): string {
	return `${prefix}_${crypto.randomUUID()}`;
}

// Compact, filename-safe timestamp like 20260629-142530.
export function fileStamp(date = new Date()): string {
	const p = (n: number) => String(n).padStart(2, '0');
	return (
		`${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}` +
		`-${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`
	);
}
