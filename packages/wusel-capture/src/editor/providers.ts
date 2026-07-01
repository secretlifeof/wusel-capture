// UI-facing provider catalog. The host owns the real delivery adapters; this is
// the extension's small mirror (id + label + capabilities) so the editor can offer
// a picker and build the Tier-A browser deep link when the native host is absent.
// Keep the ids in sync with `packages/wusel-capture-host/src/providers`.

export interface ProviderOption {
	id: string;
	label: string;
	usesSession: boolean; // show the "same chat" session-id field (Claude Code only)
	// Tier-A fallback URI, opened from the browser when the native host isn't
	// installed. The host builds richer URIs (with a resolved project `path`) in Tier B.
	buildUri(prompt: string, opts: { sessionId?: string }): string;
}

export const PROVIDERS: ProviderOption[] = [
	{
		id: 'claude-code-vscode',
		label: 'Claude Code',
		usesSession: true,
		buildUri: (prompt, { sessionId }) =>
			`vscode://anthropic.claude-code/open?prompt=${encodeURIComponent(prompt)}` +
			(sessionId ? `&session=${encodeURIComponent(sessionId)}` : ''),
	},
	{
		id: 'codex',
		label: 'Codex',
		usesSession: false,
		buildUri: (prompt) => `codex://new?prompt=${encodeURIComponent(prompt)}`,
	},
];

export const DEFAULT_PROVIDER_ID = 'claude-code-vscode';

export function getProviderOption(id: string): ProviderOption {
	return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
}
