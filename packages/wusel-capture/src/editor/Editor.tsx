import { useCallback, useEffect, useMemo, useState } from 'react';

import { fileStamp } from '../lib/id';
import { getCapture } from '../storage';
import type { Annotation, CapturePayload } from '../types';
import { type Tool, DEFAULT_COLOR, defaultFontSize } from './annotations';
import { Canvas } from './canvas';
import { type ExportFormat, buildBrowserCapture, compositeImage, downloadBlob, downloadJson } from './export';
import { getProviderOption } from './providers';
import { SidePanel, type SendStatus } from './side-panel';
import { sendCapture } from './send';
import { Toolbar } from './toolbar';
import { useHistory } from './useHistory';

function isTypingTarget(el: EventTarget | null): boolean {
	const node = el as HTMLElement | null;
	if (!node) return false;
	const tag = node.tagName;
	return tag === 'INPUT' || tag === 'TEXTAREA' || node.isContentEditable;
}

export function Editor() {
	const [payload, setPayload] = useState<CapturePayload | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);

	const [tool, setTool] = useState<Tool>('select');
	const [color, setColor] = useState<string>(DEFAULT_COLOR);
	const format = 'png' as ExportFormat; // PNG default; JPG kept in code but hidden for now.
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [note, setNote] = useState('');
	const [downloading, setDownloading] = useState(false);
	const [sending, setSending] = useState(false);
	const [sendStatus, setSendStatus] = useState<SendStatus | null>(null);

	const { present: annotations, set, checkpoint, undo, redo, canUndo, canRedo } =
		useHistory<Annotation[]>([]);

	useEffect(() => {
		const id = new URLSearchParams(location.search).get('id');
		if (!id) {
			setLoadError('No capture specified.');
			return;
		}
		getCapture(id)
			.then((p) => {
				if (!p) {
					setLoadError('Capture not found (it may already have been opened).');
					return;
				}
				setPayload(p);
				// Kept in IndexedDB (not deleted on open) so reloading the editor
				// tab still works; the service worker prunes to the most recent few.
			})
			.catch((err) => setLoadError(err instanceof Error ? err.message : String(err)));
	}, []);

	const fontSize = useMemo(() => (payload ? defaultFontSize(payload.imageWidth) : 28), [payload]);

	const deleteSelected = useCallback(() => {
		if (!selectedId) return;
		checkpoint();
		set((prev) => prev.filter((a) => a.id !== selectedId));
		setSelectedId(null);
	}, [selectedId, checkpoint, set]);

	const handleColorChange = useCallback(
		(c: string) => {
			setColor(c);
			if (selectedId) {
				checkpoint();
				set((prev) => prev.map((a) => (a.id === selectedId ? { ...a, color: c } : a)));
			}
		},
		[selectedId, checkpoint, set],
	);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (isTypingTarget(e.target)) return;
			const mod = e.metaKey || e.ctrlKey;
			if (mod && e.key.toLowerCase() === 'z') {
				e.preventDefault();
				if (e.shiftKey) redo();
				else undo();
			} else if (mod && e.key.toLowerCase() === 'y') {
				e.preventDefault();
				redo();
			} else if (e.key === 'Delete' || e.key === 'Backspace') {
				if (selectedId) {
					e.preventDefault();
					deleteSelected();
				}
			} else if (e.key === 'Escape') {
				setSelectedId(null);
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [undo, redo, deleteSelected, selectedId]);

	const handleDownload = useCallback(async () => {
		if (!payload) return;
		setDownloading(true);
		try {
			const base = `wusel-capture-${fileStamp(new Date(payload.capturedAt))}`;
			const ext = format === 'jpeg' ? 'jpg' : 'png';
			const blob = await compositeImage(payload, annotations, format, 0.92);
			await downloadBlob(blob, `${base}.${ext}`);
			const json = buildBrowserCapture(payload, annotations, note, {
				filename: `${base}.${ext}`,
				format,
			});
			await downloadJson(json, `${base}.json`);
		} catch (err) {
			setLoadError(err instanceof Error ? err.message : String(err));
		} finally {
			setDownloading(false);
		}
	}, [payload, annotations, format, note]);

	const handleSend = useCallback(
		async (providerId: string, sessionId?: string) => {
		if (!payload) return;
		const label = getProviderOption(providerId).label;
		setSending(true);
		setSendStatus(null);
		try {
			const result = await sendCapture(providerId, payload, annotations, note, sessionId);
			if (result.ok) {
				setSendStatus({
					kind: 'ok',
					message:
						result.via === 'host'
							? `Opened ${label}. Capture saved to ${result.folder}.`
							: `Capture saved to ${result.folder}. Approve the open prompt and press Enter in ${label}.`,
				});
			} else {
				setSendStatus({ kind: 'error', message: result.error ?? 'Send failed.' });
			}
		} catch (err) {
			setSendStatus({ kind: 'error', message: err instanceof Error ? err.message : String(err) });
		} finally {
			setSending(false);
		}
	}, [payload, annotations, note]);

	if (loadError) {
		return (
			<div className="flex h-screen items-center justify-center p-8 text-center">
				<div className="max-w-sm">
					<p className="text-base font-medium text-foreground">Could not load capture</p>
					<p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
				</div>
			</div>
		);
	}

	if (!payload) {
		return (
			<div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
				Loading capture…
			</div>
		);
	}

	return (
		<div className="flex h-screen">
			<div className="relative flex min-w-0 flex-1 flex-col">
					<div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
						<div className="pointer-events-auto">
							<Toolbar
								tool={tool}
								onToolChange={setTool}
								color={color}
								onColorChange={handleColorChange}
								canUndo={canUndo}
								canRedo={canRedo}
								onUndo={undo}
								onRedo={redo}
								hasSelection={selectedId !== null}
								onDelete={deleteSelected}
							/>
						</div>
					</div>

					<Canvas
						imageDataUrl={payload.imageDataUrl}
						imageWidth={payload.imageWidth}
						imageHeight={payload.imageHeight}
						tool={tool}
						color={color}
						fontSize={fontSize}
						annotations={annotations}
						selectedId={selectedId}
						onSelect={setSelectedId}
						checkpoint={checkpoint}
						setAnnotations={set}
						onToolHandled={() => setTool('select')}
					/>
				</div>

				<SidePanel
					payload={payload}
					note={note}
					onNoteChange={setNote}
					onDownload={handleDownload}
					downloading={downloading}
					onSend={handleSend}
					sending={sending}
					sendStatus={sendStatus}
				/>
		</div>
	);
}
