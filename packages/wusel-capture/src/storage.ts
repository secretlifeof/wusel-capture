// Tiny IndexedDB key/value store for handing a capture payload from the service
// worker to the editor tab. Both run on the same chrome-extension:// origin, so
// they share one database. Full-page PNGs routinely exceed chrome.storage.session
// quota, hence IndexedDB rather than session storage.

import type { CapturePayload } from './types';

const DB_NAME = 'ck-capture';
const STORE = 'captures';
const VERSION = 1;

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
	return openDb().then(
		(db) =>
			new Promise<T>((resolve, reject) => {
				const transaction = db.transaction(STORE, mode);
				const request = run(transaction.objectStore(STORE));
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
				transaction.oncomplete = () => db.close();
			}),
	);
}

export function putCapture(payload: CapturePayload): Promise<IDBValidKey> {
	return tx('readwrite', (store) => store.put(payload));
}

export function getCapture(id: string): Promise<CapturePayload | undefined> {
	return tx('readonly', (store) => store.get(id) as IDBRequest<CapturePayload | undefined>);
}

export function deleteCapture(id: string): Promise<undefined> {
	return tx('readwrite', (store) => store.delete(id) as IDBRequest<undefined>);
}

// Keep only the most recent N captures so the store does not grow unbounded,
// while still surviving an editor-tab reload (we do NOT delete on open).
export function pruneCaptures(keepNewest: number): Promise<void> {
	return openDb().then(
		(db) =>
			new Promise<void>((resolve, reject) => {
				const transaction = db.transaction(STORE, 'readwrite');
				const store = transaction.objectStore(STORE);
				const req = store.getAll() as IDBRequest<CapturePayload[]>;
				req.onsuccess = () => {
					const stale = req.result
						.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt))
						.slice(keepNewest);
					for (const old of stale) store.delete(old.id);
				};
				transaction.oncomplete = () => {
					db.close();
					resolve();
				};
				transaction.onerror = () => reject(transaction.error);
			}),
	);
}
