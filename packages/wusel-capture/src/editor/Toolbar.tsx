import {
	type IconComponent,
	type IconProps,
	ArrowUpRight,
	EyeOff,
	Pencil,
	RotateCcw,
	Square,
	Trash,
	Type,
} from '@wusel-capture/icons';
import type { ReactNode } from 'react';

import { cn } from '../lib/cn';
import { PALETTE, type Tool } from './annotations';

// No cursor/pointer glyph exists in @wusel-capture/icons, so the select tool
// uses a small inline SVG (already solid, so the active "fill" weight is a no-op).
function CursorIcon({ className }: IconProps) {
	return (
		<svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
			<path d="M48 24a8 8 0 0 0-8 9.4l40 176a8 8 0 0 0 14.7 2.4l34-58 58-34a8 8 0 0 0-2.4-14.7l-176-40A8 8 0 0 0 48 24Z" />
		</svg>
	);
}

interface ToolDef {
	tool: Tool;
	label: string;
	icon: IconComponent;
}

const TOOLS: ToolDef[] = [
	{ tool: 'select', label: 'Select', icon: CursorIcon },
	{ tool: 'pencil', label: 'Draw', icon: Pencil },
	{ tool: 'text', label: 'Text', icon: Type },
	{ tool: 'arrow', label: 'Arrow', icon: ArrowUpRight },
	{ tool: 'rect', label: 'Rectangle', icon: Square },
	{ tool: 'redact', label: 'Redact', icon: EyeOff },
];

interface ToolbarProps {
	tool: Tool;
	onToolChange: (tool: Tool) => void;
	color: string;
	onColorChange: (color: string) => void;
	canUndo: boolean;
	canRedo: boolean;
	onUndo: () => void;
	onRedo: () => void;
	hasSelection: boolean;
	onDelete: () => void;
}

function IconButton({
	active,
	title,
	onClick,
	disabled,
	children,
}: {
	active?: boolean;
	title: string;
	onClick: () => void;
	disabled?: boolean;
	children: ReactNode;
}) {
	return (
		<button
			type="button"
			title={title}
			aria-label={title}
			aria-pressed={active}
			disabled={disabled}
			onClick={onClick}
			className={cn(
				'flex size-9 items-center justify-center rounded-sm transition-colors [&_svg]:size-5',
				'disabled:pointer-events-none disabled:opacity-40',
				// Active never changes the background — only the icon goes lavender (+ filled weight).
				active ? 'text-lavender-500' : 'text-foreground hover:text-lavender-500',
			)}
		>
			{children}
		</button>
	);
}

function Divider() {
	return <span className="mx-1 h-6 w-px bg-secondary" aria-hidden="true" />;
}

export function Toolbar({
	tool,
	onToolChange,
	color,
	onColorChange,
	canUndo,
	canRedo,
	onUndo,
	onRedo,
	hasSelection,
	onDelete,
}: ToolbarProps) {
	return (
		<div className="flex items-center gap-1 rounded-full border border-secondary bg-white px-2 py-1.5 shadow-sm">
			{TOOLS.map(({ tool: t, label, icon: Icon }) => (
				<IconButton key={t} title={label} active={tool === t} onClick={() => onToolChange(t)}>
					<Icon weight={tool === t ? 'fill' : 'bold'} />
				</IconButton>
			))}

			<Divider />

			<div className="flex items-center gap-1 px-1">
				{PALETTE.map((c) => (
					<button
						key={c}
						type="button"
						title={`Color ${c}`}
						aria-label={`Color ${c}`}
						aria-pressed={color === c}
						onClick={() => onColorChange(c)}
						className={cn(
							'size-6 rounded-full border transition-transform',
							color === c ? 'border-foreground ring-2 ring-ring/40' : 'border-black/15 hover:scale-110',
						)}
						style={{ backgroundColor: c }}
					/>
				))}
			</div>

			<Divider />

			<IconButton title="Undo" onClick={onUndo} disabled={!canUndo}>
				<RotateCcw />
			</IconButton>
			<IconButton title="Redo" onClick={onRedo} disabled={!canRedo}>
				<RotateCcw className="size-5 -scale-x-100" />
			</IconButton>
			<IconButton title="Delete" onClick={onDelete} disabled={!hasSelection}>
				<Trash />
			</IconButton>
		</div>
	);
}
