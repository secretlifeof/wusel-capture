import { normalizeRect } from './annotations';
import type { Annotation, BrowserCapture, CapturePayload } from '../types';

export type ExportFormat = 'png' | 'jpeg';

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('Could not load the image.'));
		img.src = src;
	});
}

// Renders the screenshot + annotations onto a canvas at NATURAL resolution and
// returns the encoded blob. Redactions are baked in (pixelated), so sensitive
// regions never leave in the exported image.
export async function compositeImage(
	payload: CapturePayload,
	annotations: Annotation[],
	format: ExportFormat,
	quality: number,
): Promise<Blob> {
	const img = await loadImage(payload.imageDataUrl);
	const w = payload.imageWidth;
	const h = payload.imageHeight;

	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas context unavailable.');

	if (format === 'jpeg') {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, w, h);
	}
	ctx.drawImage(img, 0, 0, w, h);

	// Ensure Geist is actually loaded before drawing text onto the canvas.
	await Promise.allSettled([document.fonts.load('600 32px Geist'), document.fonts.ready]);
	const lineW = Math.max(3, Math.round(w / 400));

	// Redactions first (they obscure the screenshot beneath), annotations on top.
	for (const a of annotations) if (a.type === 'redact') drawRedact(ctx, img, a);
	for (const a of annotations) {
		if (a.type === 'rect') drawRect(ctx, a, lineW);
		else if (a.type === 'arrow') drawArrow(ctx, a, lineW);
		else if (a.type === 'pencil') drawPencil(ctx, a, lineW);
		else if (a.type === 'text') drawText(ctx, a);
	}

	return new Promise((resolve, reject) =>
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error('Export failed.'))),
			`image/${format}`,
			quality,
		),
	);
}

function drawRedact(ctx: CanvasRenderingContext2D, img: HTMLImageElement, a: Annotation) {
	const { x, y, w, h } = normalizeRect(a);
	if (w <= 0 || h <= 0) return;
	// Pixelate by downscaling the region and drawing it back without smoothing.
	const factor = 0.06;
	const tw = Math.max(1, Math.round(w * factor));
	const th = Math.max(1, Math.round(h * factor));
	const tmp = document.createElement('canvas');
	tmp.width = tw;
	tmp.height = th;
	const tctx = tmp.getContext('2d');
	if (!tctx) return;
	tctx.drawImage(img, x, y, w, h, 0, 0, tw, th);
	ctx.save();
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(tmp, 0, 0, tw, th, x, y, w, h);
	ctx.restore();
}

function drawRect(ctx: CanvasRenderingContext2D, a: Annotation, lineW: number) {
	const r = normalizeRect(a);
	ctx.save();
	ctx.strokeStyle = a.color;
	ctx.lineWidth = lineW;
	ctx.lineJoin = 'round';
	ctx.strokeRect(r.x, r.y, r.w, r.h);
	ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, a: Annotation, lineW: number) {
	const x1 = a.x;
	const y1 = a.y;
	const x2 = a.x + a.w;
	const y2 = a.y + a.h;
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const head = Math.max(14, lineW * 4);
	ctx.save();
	ctx.strokeStyle = a.color;
	ctx.fillStyle = a.color;
	ctx.lineWidth = lineW;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(x2, y2);
	ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
	ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

function drawPencil(ctx: CanvasRenderingContext2D, a: Annotation, lineW: number) {
	const pts = a.points ?? [];
	if (pts.length < 2) return;
	ctx.save();
	ctx.strokeStyle = a.color;
	ctx.lineWidth = lineW;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();
	ctx.moveTo(pts[0].x, pts[0].y);
	for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
	ctx.stroke();
	ctx.restore();
}

function drawText(ctx: CanvasRenderingContext2D, a: Annotation) {
	const fontSize = a.fontSize ?? 28;
	const lines = (a.text ?? '').split('\n');
	ctx.save();
	ctx.font = `600 ${fontSize}px Geist, ui-sans-serif, system-ui, sans-serif`;
	ctx.textBaseline = 'top';
	ctx.lineJoin = 'round';
	ctx.lineWidth = Math.max(3, fontSize / 6);
	// Contrast halo so colored text stays legible on any background.
	ctx.strokeStyle = a.color === '#ffffff' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)';
	const lineHeight = fontSize * 1.25;
	lines.forEach((line, i) => {
		const y = a.y + i * lineHeight;
		ctx.strokeText(line, a.x, y);
		ctx.fillStyle = a.color;
		ctx.fillText(line, a.x, y);
	});
	ctx.restore();
}

export function buildBrowserCapture(
	payload: CapturePayload,
	annotations: Annotation[],
	note: string,
	image: BrowserCapture['image'],
): BrowserCapture {
	return {
		version: '1.0',
		capturedAt: payload.capturedAt,
		captureMode: payload.captureMode,
		page: payload.page,
		note,
		annotations,
		diagnostics: payload.diagnostics,
		image,
	};
}

function anchorDownload(url: string, filename: string) {
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
}

export async function downloadBlob(blob: Blob, filename: string): Promise<void> {
	const url = URL.createObjectURL(blob);
	try {
		if (chrome?.downloads?.download) {
			await chrome.downloads.download({ url, filename, saveAs: false });
			setTimeout(() => URL.revokeObjectURL(url), 60_000);
		} else {
			anchorDownload(url, filename);
			setTimeout(() => URL.revokeObjectURL(url), 10_000);
		}
	} catch {
		anchorDownload(url, filename);
		setTimeout(() => URL.revokeObjectURL(url), 10_000);
	}
}

export function downloadJson(data: unknown, filename: string): Promise<void> {
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
	return downloadBlob(blob, filename);
}
