import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Mirror of @wusel-capture/ui's `cn` so the local UI primitives merge
// Tailwind classes with the same conflict-resolution semantics as the app.
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
