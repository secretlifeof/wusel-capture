import { ChevronDown, Download, HelpCircle, Send } from '@wusel-capture/icons';
import { type ReactNode, useEffect, useState } from 'react';

import { cn } from '../lib/cn';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { Textarea } from '../ui/textarea';
import { SectionTitle, Tile, TilePill } from '../ui/tile';
import type { CaptureMode, CapturePayload } from '../types';
import { DEFAULT_PROVIDER_ID, getProviderOption, PROVIDERS } from './providers';

export interface SendStatus {
	kind: 'ok' | 'error';
	message: string;
}

const MODE_LABEL: Record<CaptureMode, string> = {
	fullpage: 'Full page',
	viewport: 'Visible area',
	region: 'Region',
};

interface SidePanelProps {
	payload: CapturePayload;
	note: string;
	onNoteChange: (value: string) => void;
	onDownload: () => void;
	downloading: boolean;
	onSend: (providerId: string, sessionId?: string) => void;
	sending: boolean;
	sendStatus: SendStatus | null;
}

const SESSION_STORAGE_KEY = 'wusel.claudeSessionId';
const PROVIDER_STORAGE_KEY = 'wusel.providerId';

// chrome.storage only exists inside the extension. Reach it via globalThis with a
// narrow local type so this component also renders in plain web contexts (e.g. the
// marketing site's scaled editor preview) — no ambient `chrome` global required,
// and no runtime throw in browsers where `chrome` is undefined (Firefox/Safari).
type ExtLocalStorage = {
	get(keys: string[], cb: (r: Record<string, unknown>) => void): void;
	set(items: Record<string, unknown>): void;
};
const extLocal = (): ExtLocalStorage | undefined =>
	(globalThis as { chrome?: { storage?: { local?: ExtLocalStorage } } }).chrome?.storage?.local;

// Read-only field: app label style above, value below (same body font, no mono).
function MetaField({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid gap-0.5">
			<span className="text-sm font-medium text-muted-foreground">{label}</span>
			<span className="break-words text-sm text-foreground">{value}</span>
		</div>
	);
}

// A content-only row with the app's pill title at the top-left. Borders come
// from the enclosing `divide-y border-y` group, so internal lines never double.
function ContextRow({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-2 px-4 py-3">
			<div className="flex items-center justify-between">
				<TilePill>{title}</TilePill>
				{count !== undefined ? <span className="text-xs text-muted-foreground">{count}</span> : null}
			</div>
			{children}
		</div>
	);
}

export function SidePanel({
	payload,
	note,
	onNoteChange,
	onDownload,
	downloading,
	onSend,
	sending,
	sendStatus,
}: SidePanelProps) {
	const { page, diagnostics } = payload;
	const consoleCount = diagnostics.consoleErrors.length;
	const requestCount = diagnostics.failedRequests.length;
	const captured = new Date(payload.capturedAt);

	const [helpOpen, setHelpOpen] = useState(false);
	const [sessionId, setSessionId] = useState('');
	const [providerId, setProviderId] = useState(DEFAULT_PROVIDER_ID);
	const provider = getProviderOption(providerId);

	// Persisted optional Claude Code session id (reuse the same chat) + provider choice.
	useEffect(() => {
		extLocal()?.get([SESSION_STORAGE_KEY, PROVIDER_STORAGE_KEY], (r) => {
			const storedSession = r?.[SESSION_STORAGE_KEY];
			if (typeof storedSession === 'string') setSessionId(storedSession);
			const storedProvider = r?.[PROVIDER_STORAGE_KEY];
			if (typeof storedProvider === 'string' && PROVIDERS.some((p) => p.id === storedProvider)) {
				setProviderId(storedProvider);
			}
		});
	}, []);

	const updateSessionId = (value: string) => {
		setSessionId(value);
		extLocal()?.set({ [SESSION_STORAGE_KEY]: value });
	};

	const updateProviderId = (value: string) => {
		setProviderId(value);
		extLocal()?.set({ [PROVIDER_STORAGE_KEY]: value });
	};

	const send = () =>
		onSend(providerId, provider.usesSession ? sessionId.trim() || undefined : undefined);

	return (
		<aside className="flex h-full w-[340px] shrink-0 flex-col gap-5 overflow-y-auto border-l bg-sand-50 py-5">
			<p className="px-4 text-base font-medium text-lavender-600">Wusel Capture</p>

			{/* Note */}
			<section className="flex flex-col gap-1.5">
				<SectionTitle className="px-4">Note for the AI</SectionTitle>
				<Tile>
					<Textarea
						value={note}
						onChange={(e) => onNoteChange(e.target.value)}
						rows={1}
						placeholder="What should the AI do?"
						className="max-h-48 min-h-0 border-0 bg-transparent p-0 focus-visible:ring-0"
					/>
				</Tile>
			</section>

			{/* Actions — send / download (sits right under the note) */}
			<section className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between px-4">
					<SectionTitle>Actions</SectionTitle>
					<button
						type="button"
						aria-label="What do these buttons do?"
						onClick={() => setHelpOpen(true)}
						className="text-muted-foreground transition-colors hover:text-lavender-600 [&_svg]:size-4"
					>
						<HelpCircle />
					</button>
				</div>
				<Tile className="items-center gap-2">
					<label className="flex w-full flex-col gap-1">
						<span className="text-sm font-medium text-muted-foreground">Send to</span>
						{/* Native select styled like shadcn's SelectTrigger: hide the OS arrow
						    (appearance-none) and draw our own chevron, inset from the right edge
						    with pr-8 clearance so the value never runs under it. */}
						<div className="relative">
							<select
								value={providerId}
								onChange={(e) => updateProviderId(e.target.value)}
								className="h-9 w-full appearance-none rounded-sm border border-secondary bg-input pl-3 pr-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
							>
								{PROVIDERS.map((p) => (
									<option key={p.id} value={p.id}>
										{p.label}
									</option>
								))}
							</select>
							<ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50" />
						</div>
					</label>
					<Button variant="default" size="cta" disabled={sending} onClick={send}>
						<Send />
						{sending ? 'Opening…' : `Send to ${provider.label}`}
					</Button>
					<Button variant="outline-round" size="cta" disabled={downloading} onClick={onDownload}>
						<Download />
						{downloading ? 'Saving…' : 'Download'}
					</Button>

					{sendStatus ? (
						<p
							className={cn(
								'self-stretch break-words text-center text-xs',
								sendStatus.kind === 'error' ? 'text-destructive' : 'text-muted-foreground',
							)}
						>
							{sendStatus.message}
						</p>
					) : null}
				</Tile>
			</section>

			{/* Information — page info + diagnostics (one divide-y group → single lines) */}
			<section className="flex flex-col gap-2">
				<SectionTitle className="px-4">Information</SectionTitle>
				<div className="divide-y border-y">
					<ContextRow title="Page info">
						<div className="flex flex-col gap-3">
							<MetaField label="Title" value={page.title || '—'} />
							<MetaField label="URL" value={page.url || '—'} />
							<MetaField label="Mode" value={MODE_LABEL[payload.captureMode]} />
							<MetaField
								label="Browser"
								value={`${page.browser?.name ?? ''} ${page.browser?.version ?? ''}`.trim() || '—'}
							/>
							<MetaField label="Platform" value={page.browser?.platform || '—'} />
							<MetaField
								label="Device"
								value={page.browser?.mobile ? 'Mobile (DevTools emulation)' : 'Desktop'}
							/>
							<MetaField label="Language" value={page.browser?.language || '—'} />
							<MetaField label="Viewport" value={`${page.viewport.width}×${page.viewport.height}`} />
							<MetaField label="DPR" value={String(page.devicePixelRatio)} />
							<MetaField
								label="Screen"
								value={
									page.browser?.screen
										? `${page.browser.screen.width}×${page.browser.screen.height}`
										: '—'
								}
							/>
							<MetaField label="Captured" value={captured.toLocaleString()} />
						</div>
					</ContextRow>

					<ContextRow title="Console errors" count={consoleCount}>
						{consoleCount === 0 ? (
							<p className="text-xs text-muted-foreground">No console errors.</p>
						) : (
							<ul className="flex max-h-40 flex-col gap-1.5 overflow-y-auto">
								{diagnostics.consoleErrors.map((e, i) => (
									<li key={i} className="text-xs">
										<span className={cn('font-medium', e.level === 'error' ? 'text-destructive' : 'text-amber-600')}>
											{e.level}
										</span>{' '}
										<span className="break-words text-foreground">{e.message}</span>
										{e.source ? (
											<span className="block truncate font-mono text-muted-foreground">{e.source}</span>
										) : null}
									</li>
								))}
							</ul>
						)}
					</ContextRow>

					<ContextRow title="Failed requests" count={requestCount}>
						{requestCount === 0 ? (
							<p className="text-xs text-muted-foreground">No failed requests.</p>
						) : (
							<ul className="flex max-h-40 flex-col gap-1.5 overflow-y-auto">
								{diagnostics.failedRequests.map((r, i) => (
									<li key={i} className="text-xs">
										<span className="font-medium text-destructive">{r.status || 'ERR'}</span>{' '}
										<span className="text-muted-foreground">{r.method}</span>{' '}
										<span className="break-all font-mono text-foreground">{r.url}</span>
									</li>
								))}
							</ul>
						)}
					</ContextRow>
				</div>
			</section>

			<Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Export options">
				<div className="grid gap-4 text-base">
					<div className="grid gap-1">
						<p className="font-medium text-foreground">Send</p>
						<p className="text-muted-foreground">
							Opens the selected assistant (Claude Code or Codex) with the screenshot and context
							pre-filled. Press Enter there to start — nothing runs automatically. With the Wusel Capture
							native host installed, the capture is written into your mapped project folder; otherwise you
							save the image and the deep link points the assistant to it. Codex requires its IDE extension
							(openai.chatgpt) or app to be installed.
						</p>
					</div>
					<div className="grid gap-1">
						<p className="font-medium text-foreground">Download</p>
						<p className="text-muted-foreground">
							Downloads the annotated image and a JSON context file. You save the image, then hand both to
							any AI yourself.
						</p>
					</div>

					{provider.usesSession ? (
						<div className="grid gap-1.5 border-t pt-4">
							<p className="font-medium text-foreground">Always use the same chat</p>
							<p className="text-muted-foreground">
								Paste a Claude Code session id to send every capture into that one chat. Find it in Claude
								Code&apos;s session history. Leave empty to start a fresh chat each time.
							</p>
							<input
								type="text"
								value={sessionId}
								onChange={(e) => updateSessionId(e.target.value)}
								placeholder="Claude Code session id (optional)"
								className="mt-1 h-9 w-full rounded-sm border border-secondary bg-input px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
							/>
						</div>
					) : null}
				</div>
			</Modal>
		</aside>
	);
}
