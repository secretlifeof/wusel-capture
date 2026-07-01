import type { CaptureMessage } from './types';

// Short, file-referencing prompt (absolute paths, so it resolves regardless of
// which workspace VS Code currently has open).
export function buildPrompt(
	capture: CaptureMessage['capture'],
	imagePath: string,
	jsonPath: string,
): string {
	return [
		'I captured a browser screenshot with annotations for a UI/debugging task.',
		'',
		`Task: ${capture.note?.trim() || '(no note provided)'}`,
		'',
		`Page: ${capture.title || '(untitled)'} — ${capture.url}`,
		'',
		'Files:',
		`- ${imagePath}   (screenshot with my annotations)`,
		`- ${jsonPath}   (page metadata, console errors, failed network requests)`,
		'',
		'Please open and inspect the screenshot first, then the JSON context. Identify the',
		'likely cause, find the relevant source files in this repo, and propose the smallest',
		'safe fix. Preserve the existing design system.',
		'',
		'Use the /wusel-capture skill to do this.',
	].join('\n');
}
