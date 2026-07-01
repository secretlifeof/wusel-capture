import { makeId } from '../lib/id';
import type { Annotation, AnnotationType } from '../types';

// Editor tool: the pointer/select tool plus one per annotation type.
export type Tool = 'select' | AnnotationType;

// Annotation colors are plain hex (drawn on a canvas + used as inline styles),
// independent of the Tailwind theme tokens.
export const PALETTE = ['#e5484d', '#f5a524', '#30a46c', '#3b82f6', '#1a1a1a', '#ffffff'] as const;
export const DEFAULT_COLOR = PALETTE[0];

// Default text size scales with the screenshot resolution so it reads similarly
// regardless of devicePixelRatio / capture size.
export function defaultFontSize(imageWidth: number): number {
	return Math.min(64, Math.max(16, Math.round(imageWidth / 55)));
}

export function createAnnotation(
	type: AnnotationType,
	x: number,
	y: number,
	color: string,
	fontSize: number,
): Annotation {
	return {
		id: makeId('an'),
		type,
		x,
		y,
		w: 0,
		h: 0,
		color,
		text: type === 'text' ? '' : undefined,
		fontSize: type === 'text' ? fontSize : undefined,
		points: type === 'pencil' ? [{ x, y }] : undefined,
	};
}

// Normalize a rect/redact so width/height are positive (drag can go any way).
export function normalizeRect(a: Annotation): Annotation {
	if (a.type === 'arrow' || a.type === 'text' || a.type === 'pencil') return a;
	const x = a.w < 0 ? a.x + a.w : a.x;
	const y = a.h < 0 ? a.y + a.h : a.y;
	return { ...a, x, y, w: Math.abs(a.w), h: Math.abs(a.h) };
}
