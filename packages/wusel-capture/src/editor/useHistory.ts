import { useCallback, useState } from 'react';

// Undo/redo with explicit checkpoints. An interaction (drag, resize, text edit)
// calls checkpoint() once at its start, then set() freely while it runs, so the
// whole interaction collapses into a single undo step.
export function useHistory<T>(initial: T) {
	const [present, setPresent] = useState<T>(initial);
	const [undoStack, setUndoStack] = useState<T[]>([]);
	const [redoStack, setRedoStack] = useState<T[]>([]);

	const checkpoint = useCallback(() => {
		setUndoStack((s) => [...s, present]);
		setRedoStack([]);
	}, [present]);

	const undo = useCallback(() => {
		setUndoStack((s) => {
			if (s.length === 0) return s;
			setRedoStack((r) => [...r, present]);
			setPresent(s[s.length - 1]);
			return s.slice(0, -1);
		});
	}, [present]);

	const redo = useCallback(() => {
		setRedoStack((r) => {
			if (r.length === 0) return r;
			setUndoStack((u) => [...u, present]);
			setPresent(r[r.length - 1]);
			return r.slice(0, -1);
		});
	}, [present]);

	const reset = useCallback((value: T) => {
		setPresent(value);
		setUndoStack([]);
		setRedoStack([]);
	}, []);

	return {
		present,
		set: setPresent,
		checkpoint,
		undo,
		redo,
		reset,
		canUndo: undoStack.length > 0,
		canRedo: redoStack.length > 0,
	};
}
