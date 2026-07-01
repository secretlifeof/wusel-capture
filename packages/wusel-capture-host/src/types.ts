// Native messaging contract (mirrors the extension's send.ts payload).

export interface Asset {
	name: string;
	mimeType: string;
	encoding: 'base64' | 'utf8';
	data: string;
}

export interface CaptureMessage {
	type: 'capture.send';
	version: string;
	provider?: string;
	capture: {
		id: string;
		url: string;
		title: string;
		note: string;
		capturedAt: string;
		captureMode: string;
		session?: string; // optional existing Claude Code session id to resume
	};
	assets: Asset[];
}

export interface HostResponse {
	version: '1.0';
	type: 'capture.result';
	ok: boolean;
	captureFolder?: string;
	provider?: string;
	message?: string;
	error?: string;
}
