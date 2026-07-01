import { openUri } from '../../open-uri';
import type { ProviderAdapter, ProviderInput } from '../types';

// A "deep-link" provider hands the capture to an editor/agent by opening a URL it
// has registered (e.g. `vscode://anthropic.claude-code/open?prompt=…` or
// `codex://new?prompt=…`). The capture files are already on disk before this runs,
// so the URI only carries the prompt — the tool reads the screenshot from the path.
export interface DeepLinkSpec {
	id: string;
	label: string;
	buildUri(input: ProviderInput): string;
	message?: string; // success line; defaults to `Opened <label>.`
}

export function deepLinkProvider(spec: DeepLinkSpec): ProviderAdapter {
	return {
		id: spec.id,
		label: spec.label,
		kind: 'deep-link',
		async deliver(input) {
			await openUri(spec.buildUri(input));
			return { message: spec.message ?? `Opened ${spec.label}.` };
		},
	};
}
