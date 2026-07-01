import type { CaptureMessage } from '../types';

export interface ProviderInput {
	capture: CaptureMessage['capture'];
	captureFolder: string;
	projectPath: string;
	files: Record<string, string>; // asset name -> absolute path
	prompt: string;
}

export interface ProviderResult {
	message: string;
}

export interface ProviderAdapter {
	id: string;
	label?: string; // human name for UI/messages (e.g. "Codex")
	kind?: string; // delivery mechanism (e.g. "deep-link"), for grouping/discovery
	deliver(input: ProviderInput): Promise<ProviderResult>;
}
