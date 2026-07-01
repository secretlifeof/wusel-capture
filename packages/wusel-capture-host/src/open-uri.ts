import { spawn } from 'node:child_process';

// Open a URI with the OS handler (used for the vscode:// deep link). Resolves
// once the opener command exits, so the host doesn't terminate before the deep
// link is actually handed off to the OS. The opener (`open`/`xdg-open`/`start`)
// returns promptly after delegating to the launcher.
export function openUri(uri: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const [cmd, args] =
			process.platform === 'darwin'
				? (['open', [uri]] as const)
				: process.platform === 'win32'
					? (['cmd', ['/c', 'start', '', uri]] as const)
					: (['xdg-open', [uri]] as const);
		try {
			const child = spawn(cmd, [...args], { stdio: 'ignore' });
			child.on('error', reject);
			child.on('close', () => resolve());
		} catch (e) {
			reject(e instanceof Error ? e : new Error(String(e)));
		}
	});
}
