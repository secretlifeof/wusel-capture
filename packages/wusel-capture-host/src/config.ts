import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

export interface ProjectMapping {
	name: string;
	match: string[]; // URL globs, e.g. "http://localhost:5173/*"
	path: string; // absolute project path (may use ~)
}

export interface HostConfig {
	captureRoot: string;
	defaultProvider: string;
	inbox: string; // fallback folder when no project matches
	projects: ProjectMapping[];
}

const DEFAULTS: HostConfig = {
	captureRoot: '.wusel-capture',
	defaultProvider: 'claude-code-vscode',
	inbox: join(homedir(), 'wusel-capture-inbox'),
	projects: [],
};

export function expandHome(p: string): string {
	return p.startsWith('~') ? join(homedir(), p.slice(1)) : p;
}

export function configPath(): string {
	return join(homedir(), '.wusel-capture', 'config.json');
}

export function loadConfig(): HostConfig {
	const path = configPath();
	if (!existsSync(path)) return DEFAULTS;
	try {
		const parsed = JSON.parse(readFileSync(path, 'utf8')) as Partial<HostConfig>;
		return {
			captureRoot: parsed.captureRoot ?? DEFAULTS.captureRoot,
			defaultProvider: parsed.defaultProvider ?? DEFAULTS.defaultProvider,
			inbox: expandHome(parsed.inbox ?? DEFAULTS.inbox),
			projects: Array.isArray(parsed.projects) ? parsed.projects : [],
		};
	} catch {
		return DEFAULTS;
	}
}

function globToRegex(glob: string): RegExp {
	const escaped = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
	return new RegExp(`^${escaped}$`);
}

// Map a page URL to the project folder it belongs to, falling back to the inbox.
export function resolveProjectPath(config: HostConfig, url: string): { path: string; project?: string } {
	for (const project of config.projects) {
		if (project.match.some((g) => globToRegex(g).test(url))) {
			return { path: resolve(expandHome(project.path)), project: project.name };
		}
	}
	return { path: resolve(config.inbox) };
}
