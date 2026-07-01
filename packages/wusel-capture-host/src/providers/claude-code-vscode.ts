import { deepLinkProvider } from './kinds/deep-link';

// Opens the documented Claude Code VS Code deep link. It pre-fills the prompt
// (referencing the saved capture files) but does not auto-submit — the user
// presses Enter in Claude Code. `?session=` resumes an existing chat when set.
export const ClaudeCodeVscodeDeepLink = deepLinkProvider({
	id: 'claude-code-vscode',
	label: 'Claude Code',
	message: 'Opened Claude Code in VS Code.',
	buildUri({ prompt, capture }) {
		const session = capture.session ? `&session=${encodeURIComponent(capture.session)}` : '';
		return `vscode://anthropic.claude-code/open?prompt=${encodeURIComponent(prompt)}${session}`;
	},
});
