import { ClaudeCodeVscodeDeepLink } from './claude-code-vscode';
import { Codex } from './codex';
import { GenericWebhook, OpenAIApi } from './stubs';
import type { ProviderAdapter } from './types';

// Claude Code and Codex are both wired (deep-link providers). The remaining
// entries are registered stubs that throw until implemented, so adding a
// destination is adapter work behind one interface — not a rewrite.
const REGISTRY: Record<string, ProviderAdapter> = {
	[ClaudeCodeVscodeDeepLink.id]: ClaudeCodeVscodeDeepLink,
	[Codex.id]: Codex,
	[OpenAIApi.id]: OpenAIApi,
	[GenericWebhook.id]: GenericWebhook,
};

export function getProvider(id: string): ProviderAdapter {
	const provider = REGISTRY[id];
	if (!provider) throw new Error(`unknown provider: ${id}`);
	return provider;
}

// Lightweight catalog for discovery (e.g. surfacing the list to the UI).
export function listProviders(): Array<{ id: string; label?: string; kind?: string }> {
	return Object.values(REGISTRY).map(({ id, label, kind }) => ({ id, label, kind }));
}

export type { ProviderAdapter, ProviderInput, ProviderResult } from './types';
