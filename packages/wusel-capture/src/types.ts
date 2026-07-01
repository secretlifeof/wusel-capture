// Shared types across all entrypoints (popup, editor, service worker, content
// scripts). Kept dependency-free so it can be imported from any context.

export type CaptureMode = 'fullpage' | 'viewport' | 'region';

export type AnnotationType = 'text' | 'pencil' | 'arrow' | 'rect' | 'redact';

// Annotations are stored in NATURAL image-pixel coordinates and scaled to the
// displayed size when rendered / converted at export time.
export interface Annotation {
	id: string;
	type: AnnotationType;
	x: number;
	y: number;
	// width/height for rect/redact; for `arrow` (x,y)->(x+w,y+h); ignored for text/pencil.
	w: number;
	h: number;
	text?: string;
	color: string;
	fontSize?: number;
	// Freehand path for `pencil` (natural-pixel coordinates).
	points?: { x: number; y: number }[];
}

export interface ConsoleErrorEntry {
	level: 'error' | 'warn';
	message: string;
	source?: string;
	timestamp: string;
}

export interface FailedRequestEntry {
	url: string;
	method: string;
	status: number; // 0 == network/transport failure
	statusText: string;
	type: 'fetch' | 'xhr';
	timestamp: string;
}

export interface Diagnostics {
	consoleErrors: ConsoleErrorEntry[];
	failedRequests: FailedRequestEntry[];
}

export interface BrowserInfo {
	name: string; // e.g. "Chrome" (the EMULATED UA's browser when device mode is on)
	version: string; // e.g. "120.0.6099.110"
	platform: string; // e.g. "macOS"
	language: string;
	screen: { width: number; height: number };
	// The page presents as a mobile device. In a desktop browser this means DevTools
	// device emulation is active (e.g. mimicking an iPhone).
	mobile: boolean;
	touchPoints: number; // navigator.maxTouchPoints
}

export interface PageInfo {
	url: string;
	title: string;
	userAgent: string;
	viewport: { width: number; height: number };
	devicePixelRatio: number;
	scroll: { x: number; y: number };
	browser: BrowserInfo;
}

// Persisted to IndexedDB by the service worker and read once by the editor.
export interface CapturePayload {
	id: string;
	capturedAt: string; // ISO
	captureMode: CaptureMode;
	imageDataUrl: string;
	imageWidth: number; // natural (device) pixels
	imageHeight: number;
	page: PageInfo;
	diagnostics: Diagnostics;
}

// The JSON file the user downloads alongside the annotated image.
export interface BrowserCapture {
	version: '1.0';
	capturedAt: string;
	captureMode: CaptureMode;
	page: PageInfo;
	note: string;
	annotations: Annotation[];
	diagnostics: Diagnostics;
	image: {
		filename: string;
		format: 'png' | 'jpeg';
	};
}

// ---- Messaging contracts -------------------------------------------------

export interface CaptureRequest {
	type: 'CAPTURE';
	mode: CaptureMode;
	tabId: number;
	windowId: number;
}

// service worker -> bridge content script
export type BridgeRequest = { type: 'GET_PAGE_INFO' } | { type: 'START_REGION_SELECT' };

export interface PageInfoResponse {
	page: PageInfo;
	diagnostics: Diagnostics;
}

export type RegionSelectResponse =
	| { cancelled: true }
	| {
			cancelled: false;
			rect: { x: number; y: number; w: number; h: number }; // CSS px, viewport-relative
			devicePixelRatio: number;
	  };

export type RuntimeMessage = CaptureRequest | BridgeRequest;
