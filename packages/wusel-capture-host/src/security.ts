import { resolve, sep } from 'node:path';

// Capture IDs and asset names come from the browser — never trust them as paths.
export function sanitizeId(id: string): string {
	const cleaned = (id ?? '').replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '');
	return cleaned.slice(0, 120) || 'capture';
}

export function sanitizeFilename(name: string): string {
	const base = (name ?? '').replace(/[\\/]/g, '').replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '');
	return base.slice(0, 120) || 'file';
}

// True only if `child` is `parent` or strictly inside it (path-traversal guard).
export function isInside(parent: string, child: string): boolean {
	const p = resolve(parent);
	const c = resolve(child);
	return c === p || c.startsWith(p + sep);
}
