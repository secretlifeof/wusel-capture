import type { ProviderAdapter } from './types';

// Placeholder adapters from the blueprint. The capture is already written to the
// project folder (with prompt.md) before the provider runs, so each of these
// only needs to deliver that folder to its destination — drop a real
// implementation in `deliver` to enable it.

function notImplemented(id: string, hint: string): ProviderAdapter {
	return {
		id,
		async deliver() {
			throw new Error(`provider "${id}" is not implemented yet — ${hint}`);
		},
	};
}

// OpenAI Responses API with the annotated image + prompt; show the reply.
export const OpenAIApi = notImplemented('openai-api', 'POST the image + prompt to the OpenAI Responses API');

// POST the capture folder + prompt to a configured webhook URL.
export const GenericWebhook = notImplemented('generic-webhook', 'POST the capture to a configured webhook URL');
