import { X } from '@wusel-capture/icons';
import { type ReactNode, useEffect } from 'react';

import { cn } from '../lib/cn';

// Mirrors the app's Dialog (packages/ui-core/src/dialog.tsx): a blurred backdrop
// and a centered `surfacePanelCard`-styled panel with the `shadow-dialog` token.
// Plain (no Radix) — closes on Escape and backdrop click.

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50">
			{/* backdrop */}
			<div
				className="fixed inset-0 bg-white/10 backdrop-blur-md animate-in fade-in-0"
				onClick={onClose}
				aria-hidden="true"
			/>
			{/* panel */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className={cn(
					'fixed top-[15vh] left-1/2 z-50 grid w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 gap-4',
					'overflow-visible rounded-lg border bg-white px-6 pt-6 pb-6 shadow-dialog sm:max-w-lg',
					'animate-in fade-in-0 zoom-in-95 duration-200',
				)}
			>
				{/* Title floats above the panel — the app's DialogTitle styling. */}
				<h2 className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 text-dashboard-title text-2xl font-medium whitespace-nowrap text-bark-400 sm:-top-14 sm:text-3xl">
					{title}
				</h2>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					className="absolute top-4 right-4 cursor-pointer rounded-md p-1 text-muted-foreground opacity-70 transition-opacity hover:text-lavender-600 hover:opacity-100 [&_svg]:size-5"
				>
					<X />
				</button>
				{children}
			</div>
		</div>
	);
}
