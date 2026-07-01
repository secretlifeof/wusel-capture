import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import { type Tool, createAnnotation, normalizeRect } from './annotations';
import type { Annotation } from '../types';

interface CanvasProps {
	imageDataUrl: string;
	imageWidth: number;
	imageHeight: number;
	tool: Tool;
	color: string;
	fontSize: number;
	annotations: Annotation[];
	selectedId: string | null;
	onSelect: (id: string | null) => void;
	checkpoint: () => void;
	setAnnotations: Dispatch<SetStateAction<Annotation[]>>;
	onToolHandled: () => void;
}

type DragKind = 'create' | 'pencil' | 'move' | 'resize' | 'arrow-start' | 'arrow-end';
interface DragState {
	kind: DragKind;
	id: string;
	startX: number;
	startY: number;
	orig: Annotation;
}

const CONTAINER_PADDING = 48; // p-6 on both sides

export function Canvas({
	imageDataUrl,
	imageWidth,
	imageHeight,
	tool,
	color,
	fontSize,
	annotations,
	selectedId,
	onSelect,
	checkpoint,
	setAnnotations,
	onToolHandled,
}: CanvasProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<DragState | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [containerWidth, setContainerWidth] = useState(0);
	const [editingId, setEditingId] = useState<string | null>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const ro = new ResizeObserver(() => setContainerWidth(el.clientWidth));
		ro.observe(el);
		setContainerWidth(el.clientWidth);
		return () => ro.disconnect();
	}, []);

	// Focus the text editor after it mounts. Doing it in an effect (rather than
	// relying on autoFocus during the pointerdown) avoids the browser's native
	// focus handling on the click stealing focus right back.
	useEffect(() => {
		if (!editingId) return;
		const id = requestAnimationFrame(() => {
			const el = textareaRef.current;
			if (el) {
				el.focus();
				el.setSelectionRange(el.value.length, el.value.length);
			}
		});
		return () => cancelAnimationFrame(id);
	}, [editingId]);

	const scale = containerWidth > 0 ? Math.min(1, (containerWidth - CONTAINER_PADDING) / imageWidth) : 1;

	const toNatural = useCallback(
		(e: { clientX: number; clientY: number }) => {
			const rect = stageRef.current!.getBoundingClientRect();
			return {
				x: clamp((e.clientX - rect.left) / scale, 0, imageWidth),
				y: clamp((e.clientY - rect.top) / scale, 0, imageHeight),
			};
		},
		[scale, imageWidth, imageHeight],
	);

	const annById = (id: string) => annotations.find((a) => a.id === id);

	const handlePointerDown = (e: React.PointerEvent) => {
		// Ignore clicks that originate in the text editor textarea.
		if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
		const targetEl = e.target as HTMLElement;
		const pt = toNatural(e);
		// NOTE: pointer capture is set ONLY for drag operations below. Capturing it
		// for a text-creation click steals focus from the freshly-mounted textarea.
		const capture = () => stageRef.current?.setPointerCapture(e.pointerId);

		const handle = targetEl.closest('[data-handle]')?.getAttribute('data-handle');
		if (handle && selectedId) {
			const orig = annById(selectedId);
			if (!orig) return;
			capture();
			checkpoint();
			const kind: DragKind =
				handle === 'br' ? 'resize' : handle === 'start' ? 'arrow-start' : 'arrow-end';
			dragRef.current = { kind, id: selectedId, startX: pt.x, startY: pt.y, orig };
			return;
		}

		if (tool === 'select') {
			const hitId = targetEl.closest('[data-ann-id]')?.getAttribute('data-ann-id') ?? null;
			onSelect(hitId);
			if (hitId) {
				const orig = annById(hitId);
				if (orig) {
					capture();
					checkpoint();
					dragRef.current = { kind: 'move', id: hitId, startX: pt.x, startY: pt.y, orig };
				}
			}
			return;
		}

		// Creation tools.
		checkpoint();
		const ann = createAnnotation(tool, pt.x, pt.y, color, fontSize);
		setAnnotations((prev) => [...prev, ann]);
		onSelect(ann.id);
		if (tool === 'text') {
			// Prevent the browser's native focus handling for this click (it would
			// steal focus from the textarea we're about to mount). The textarea is
			// then focused in the editingId effect. No pointer capture either.
			e.preventDefault();
			setEditingId(ann.id);
			onToolHandled();
		} else if (tool === 'pencil') {
			capture();
			dragRef.current = { kind: 'pencil', id: ann.id, startX: pt.x, startY: pt.y, orig: ann };
		} else {
			capture();
			dragRef.current = { kind: 'create', id: ann.id, startX: pt.x, startY: pt.y, orig: ann };
		}
	};

	const handlePointerMove = (e: React.PointerEvent) => {
		const drag = dragRef.current;
		if (!drag) return;
		const pt = toNatural(e);
		setAnnotations((prev) => prev.map((a) => (a.id === drag.id ? applyDrag(a, drag, pt) : a)));
	};

	const handlePointerUp = () => {
		const drag = dragRef.current;
		dragRef.current = null;
		if (!drag) return;
		if (drag.kind === 'create') {
			setAnnotations((prev) =>
				prev
					.map((a) => (a.id === drag.id ? normalizeRect(a) : a))
					// Drop accidental tiny shapes (a click without a real drag).
					.filter((a) => a.id !== drag.id || a.type === 'text' || a.w >= 5 || a.h >= 5),
			);
			onToolHandled();
		} else if (drag.kind === 'pencil') {
			// Drop a stroke that was just a click (no real path). Stay in pencil mode.
			setAnnotations((prev) =>
				prev.filter((a) => a.id !== drag.id || (a.points?.length ?? 0) >= 2),
			);
		}
	};

	const updateText = (id: string, text: string) =>
		setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, text } : a)));

	const finishEditing = (id: string) => {
		setEditingId((cur) => (cur === id ? null : cur));
		// Remove empty text annotations.
		setAnnotations((prev) => prev.filter((a) => !(a.id === id && a.type === 'text' && !a.text?.trim())));
	};

	const lineWidthNatural = Math.max(3, Math.round(imageWidth / 400));

	return (
		<div
			ref={containerRef}
			className="flex flex-1 items-start justify-center overflow-auto bg-sand-100 px-6 pb-6 pt-20"
		>
			<div
				ref={stageRef}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				className="relative shrink-0 select-none rounded-sm shadow-sm"
				style={{
					width: imageWidth * scale,
					height: imageHeight * scale,
					cursor: tool === 'select' ? 'default' : 'crosshair',
					touchAction: 'none',
				}}
			>
				<img
					src={imageDataUrl}
					alt="Screenshot"
					draggable={false}
					className="pointer-events-none block h-full w-full rounded-sm"
				/>

				{/* Arrows + pencil strokes live in one SVG layer using natural coordinates. */}
				<svg
					className="pointer-events-none absolute inset-0"
					width={imageWidth * scale}
					height={imageHeight * scale}
					viewBox={`0 0 ${imageWidth} ${imageHeight}`}
				>
					{annotations
						.filter((a) => a.type === 'arrow' || a.type === 'pencil')
						.map((a) =>
							a.type === 'pencil' ? (
								<PencilShape
									key={a.id}
									a={a}
									lineWidth={lineWidthNatural}
									selected={a.id === selectedId}
								/>
							) : (
								<ArrowShape
									key={a.id}
									a={a}
									lineWidth={lineWidthNatural}
									selected={a.id === selectedId}
								/>
							),
						)}
				</svg>

				{annotations
					.filter((a) => a.type === 'rect' || a.type === 'redact')
					.map((a) => {
						const r = normalizeRect(a);
						const selected = a.id === selectedId;
						return (
							<div
								key={a.id}
								data-ann-id={a.id}
								className="absolute"
								style={{
									left: r.x * scale,
									top: r.y * scale,
									width: r.w * scale,
									height: r.h * scale,
									cursor: tool === 'select' ? 'move' : 'crosshair',
									...(a.type === 'rect'
										? { border: `${Math.max(1, lineWidthNatural * scale)}px solid ${a.color}` }
										: {
												backdropFilter: 'blur(6px)',
												WebkitBackdropFilter: 'blur(6px)',
												background: 'rgba(120,120,120,0.18)',
												border: '1px dashed rgba(0,0,0,0.4)',
											}),
									outline: selected ? '2px solid var(--color-ring)' : undefined,
									outlineOffset: '2px',
								}}
							>
								{selected && tool === 'select' ? <Handle position="br" /> : null}
							</div>
						);
					})}

				{annotations
					.filter((a) => a.type === 'text')
					.map((a) => {
						const selected = a.id === selectedId;
						const editing = a.id === editingId;
						const common = {
							left: a.x * scale,
							top: a.y * scale,
							fontSize: (a.fontSize ?? fontSize) * scale,
							color: a.color,
							fontWeight: 600,
							lineHeight: 1.25,
						} as const;
						return editing ? (
							<textarea
								key={a.id}
								ref={textareaRef}
								value={a.text ?? ''}
								onChange={(e) => updateText(a.id, e.target.value)}
								onBlur={() => finishEditing(a.id)}
								onKeyDown={(e) => {
									if (e.key === 'Escape') (e.target as HTMLTextAreaElement).blur();
								}}
								className="absolute resize-none overflow-hidden border border-dashed border-ring bg-white/40 p-0 outline-none"
								style={{ ...common, minWidth: 40, fontFamily: 'Geist, ui-sans-serif, system-ui, sans-serif' }}
							/>
						) : (
							<div
								key={a.id}
								data-ann-id={a.id}
								onDoubleClick={() => setEditingId(a.id)}
								className="absolute whitespace-pre"
								style={{
									...common,
									fontFamily: 'Geist, ui-sans-serif, system-ui, sans-serif',
									cursor: tool === 'select' ? 'move' : 'crosshair',
									textShadow:
										a.color === '#ffffff'
											? '0 0 3px rgba(0,0,0,0.7)'
											: '0 0 3px rgba(255,255,255,0.9)',
									outline: selected ? '2px solid var(--color-ring)' : undefined,
									outlineOffset: '3px',
								}}
							>
								{a.text || ' '}
							</div>
						);
					})}

				{/* Arrow endpoint handles for the selected arrow. */}
				{(() => {
					const sel = selectedId ? annById(selectedId) : undefined;
					if (!sel || sel.type !== 'arrow' || tool !== 'select') return null;
					return (
						<>
							<Handle position="start" style={{ left: sel.x * scale, top: sel.y * scale }} />
							<Handle position="end" style={{ left: (sel.x + sel.w) * scale, top: (sel.y + sel.h) * scale }} />
						</>
					);
				})()}
			</div>
		</div>
	);
}

function ArrowShape({ a, lineWidth, selected }: { a: Annotation; lineWidth: number; selected: boolean }) {
	const x1 = a.x;
	const y1 = a.y;
	const x2 = a.x + a.w;
	const y2 = a.y + a.h;
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const head = Math.max(14, lineWidth * 4);
	const hx1 = x2 - head * Math.cos(angle - Math.PI / 6);
	const hy1 = y2 - head * Math.sin(angle - Math.PI / 6);
	const hx2 = x2 - head * Math.cos(angle + Math.PI / 6);
	const hy2 = y2 - head * Math.sin(angle + Math.PI / 6);
	return (
		<g data-ann-id={a.id} style={{ pointerEvents: 'auto' }}>
			{/* Wide invisible hit area for easier selection. */}
			<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={Math.max(20, lineWidth * 4)} />
			<line
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				stroke={a.color}
				strokeWidth={lineWidth}
				strokeLinecap="round"
			/>
			<polygon points={`${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`} fill={a.color} />
			{selected ? (
				<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-ring)" strokeWidth={lineWidth + 4} strokeOpacity={0.25} strokeLinecap="round" />
			) : null}
		</g>
	);
}

function PencilShape({ a, lineWidth, selected }: { a: Annotation; lineWidth: number; selected: boolean }) {
	const pts = (a.points ?? []).map((p) => `${p.x},${p.y}`).join(' ');
	if (!pts) return null;
	return (
		<g data-ann-id={a.id} style={{ pointerEvents: 'auto' }}>
			{/* Wide invisible hit area for easier selection. */}
			<polyline points={pts} fill="none" stroke="transparent" strokeWidth={Math.max(20, lineWidth * 3)} />
			{selected ? (
				<polyline
					points={pts}
					fill="none"
					stroke="var(--color-ring)"
					strokeWidth={lineWidth + 4}
					strokeOpacity={0.25}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			) : null}
			<polyline
				points={pts}
				fill="none"
				stroke={a.color}
				strokeWidth={lineWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
	);
}

function Handle({
	position,
	style,
}: {
	position: 'br' | 'start' | 'end';
	style?: React.CSSProperties;
}) {
	return (
		<span
			data-handle={position}
			className="absolute z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white"
			style={
				position === 'br'
					? { right: 0, bottom: 0, transform: 'translate(50%,50%)' }
					: { position: 'absolute', ...style }
			}
		/>
	);
}

function clamp(v: number, min: number, max: number) {
	return Math.max(min, Math.min(max, v));
}

function applyDrag(a: Annotation, drag: DragState, pt: { x: number; y: number }): Annotation {
	const { kind, orig, startX, startY } = drag;
	switch (kind) {
		case 'create':
			return { ...a, w: pt.x - startX, h: pt.y - startY };
		case 'pencil':
			return { ...a, points: [...(a.points ?? []), pt] };
		case 'move': {
			const dx = pt.x - startX;
			const dy = pt.y - startY;
			if (orig.points) {
				return { ...a, points: orig.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) };
			}
			return { ...a, x: orig.x + dx, y: orig.y + dy };
		}
		case 'resize':
			return { ...a, w: pt.x - orig.x, h: pt.y - orig.y };
		case 'arrow-end':
			return { ...a, w: pt.x - orig.x, h: pt.y - orig.y };
		case 'arrow-start': {
			const endX = orig.x + orig.w;
			const endY = orig.y + orig.h;
			return { ...a, x: pt.x, y: pt.y, w: endX - pt.x, h: endY - pt.y };
		}
		default:
			return a;
	}
}
