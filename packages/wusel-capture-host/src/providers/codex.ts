import { deepLinkProvider } from './kinds/deep-link';

// Opens the Codex deep link (handled by the `openai.chatgpt` IDE extension / Codex
// app). `codex://new?prompt=…` populates the chatbox but does not run it — same
// prefill-don't-submit behavior as Claude Code. `&path=` points Codex at the
// resolved project folder so it opens in the right repo.
export const Codex = deepLinkProvider({
	id: 'codex',
	label: 'Codex',
	message: 'Opened Codex.',
	buildUri({ prompt, projectPath }) {
		const path = projectPath ? `&path=${encodeURIComponent(projectPath)}` : '';
		return `codex://new?prompt=${encodeURIComponent(prompt)}${path}`;
	},
});
