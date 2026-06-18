/**
 * IndexedDB-backed storage for user-uploaded notification sounds.
 *
 * Why IndexedDB instead of localStorage?
 *   - Audio files (even 50KB MP3) are too big for localStorage's ~5MB
 *     practical limit. localStorage is also synchronous and blocks
 *     the main thread when reading large strings.
 *   - IndexedDB stores Blobs natively (no base64 round-trip, no
 *     33% size inflation from encoding), and reads are async.
 *
 * Storage shape:
 *   DB:        `cuong-sound-prefs`
 *   Store:     `sounds` (keyPath: 'id')
 *   Record:    { id: 'message' | 'notification' | 'login' | 'post',
 *                name: string, blob: Blob, updatedAt: number }
 *
 * Record key matches the 4 SoundKind values so we can do a single
 * `get(id)` to retrieve the user's override for that event.
 */

const DB_NAME = 'cuong-sound-prefs';
const DB_VERSION = 1;
const STORE = 'sounds';

export type SoundKind = 'message' | 'notification' | 'login' | 'post';

export interface SoundRecord {
  id: SoundKind;
  name: string;
  blob: Blob;
  /** mime type of the blob, captured at upload time so we can
   *  hand the right value to `new Audio(blob)` */
  type: string;
  updatedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only available in the browser'));
  }
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IndexedDB upgrade blocked'));
  });
  return dbPromise;
}

function tx(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  return openDb().then((db) => db.transaction(STORE, mode).objectStore(STORE));
}

function reqAsPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveSound(rec: SoundRecord): Promise<void> {
  const store = await tx('readwrite');
  await reqAsPromise(store.put(rec));
}

export async function getSound(id: SoundKind): Promise<SoundRecord | null> {
  try {
    const store = await tx('readonly');
    const result = await reqAsPromise<SoundRecord | undefined>(store.get(id) as IDBRequest<SoundRecord | undefined>);
    return result ?? null;
  } catch {
    return null;
  }
}

export async function deleteSound(id: SoundKind): Promise<void> {
  const store = await tx('readwrite');
  await reqAsPromise(store.delete(id));
}

export async function listSounds(): Promise<SoundRecord[]> {
  try {
    const store = await tx('readonly');
    const all = await reqAsPromise<SoundRecord[]>(store.getAll() as IDBRequest<SoundRecord[]>);
    return Array.isArray(all) ? all : [];
  } catch {
    return [];
  }
}
