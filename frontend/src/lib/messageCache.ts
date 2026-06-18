/**
 * IndexedDB-backed cache for chat messages.
 *
 * Why this exists:
 *   The bug we fixed: after a hard refresh, a sign-out, or a sign-in
 *   on a different device, the messenger page briefly (or sometimes
 *   permanently) shows an empty thread even though messages exist on
 *   the server. Root cause was that `messagesByThread` is pure
 *   in-memory state — refresh nukes it, and the subsequent REST fetch
 *   either fails silently (cookie race, stale JWT) or the server
 *   returns a transient empty payload while still indexing.
 *
 *   The fix: persist the last-known messages per thread in IndexedDB
 *   and surface them INSTANTLY when the user reopens the chat,
 *   BEFORE the server fetch resolves. If the user truly has no
 *   messages, the cache is empty and the empty state is correct.
 *   If the server later returns messages, they replace the cache.
 *
 * Storage shape:
 *   DB:        `cuong-message-cache`
 *   Store:     `threads` (keyPath: 'threadId')
 *   Record:    { threadId, messages: MessagingMessage[],
 *                savedAt: number, userId: number }
 *
 *   The `userId` field is per-record so a user logging out and a
 *   different user logging in on the same device cannot see each
 *   other's cached messages. The store rehydrates only records that
 *   match the active user.
 *
 * Size:
 *   1000 messages × ~2KB each = 2MB. IndexedDB handles this with
 *   no practical limit. We cap at MAX_MESSAGES_PER_THREAD to keep
 *   the store from growing unbounded for power users.
 */

const DB_NAME = 'cuong-message-cache';
const DB_VERSION = 1;
const STORE = 'threads';
const MAX_MESSAGES_PER_THREAD = 2000;

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
        const store = db.createObjectStore(STORE, { keyPath: 'threadId' });
        // Index so we can list/clear by user
        store.createIndex('userId', 'userId', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IndexedDB upgrade blocked'));
  });
  return dbPromise;
}

async function tx(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  const db = await openDb();
  return db.transaction(STORE, mode).objectStore(STORE);
}

function reqAsPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export interface MessageCacheRecord {
  threadId: number;
  messages: unknown[];
  savedAt: number;
  userId: number;
}

export async function saveMessages(
  threadId: number,
  userId: number,
  messages: unknown[],
): Promise<void> {
  try {
    const store = await tx('readwrite');
    // Trim the tail to keep the record from growing without bound
    const trimmed = messages.length > MAX_MESSAGES_PER_THREAD
      ? messages.slice(messages.length - MAX_MESSAGES_PER_THREAD)
      : messages;
    await reqAsPromise(
      store.put({ threadId, messages: trimmed, savedAt: Date.now(), userId }),
    );
  } catch {
    // Silent — cache is best-effort. The store still works without
    // it, just without the optimistic restore on next load.
  }
}

export async function loadMessages(
  threadId: number,
  userId: number,
): Promise<unknown[] | null> {
  try {
    const store = await tx('readonly');
    const rec = await reqAsPromise<MessageCacheRecord | undefined>(
      store.get(threadId) as IDBRequest<MessageCacheRecord | undefined>,
    );
    if (!rec) return null;
    // Cross-user leak guard. If the active user doesn't match the
    // cached record, drop it and return null.
    if (rec.userId !== userId) return null;
    return Array.isArray(rec.messages) ? rec.messages : null;
  } catch {
    return null;
  }
}

/** Drop every cached thread for the given user. Called on logout so
 *  the next user (on a shared device) doesn't see the previous
 *  user's chat history appear from the cache. */
export async function clearForUser(userId: number): Promise<void> {
  try {
    const store = await tx('readwrite');
    const idx = store.index('userId');
    const range = IDBKeyRange.only(userId);
    await new Promise<void>((resolve, reject) => {
      const req = idx.openCursor(range);
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore — best-effort
  }
}

/** Wipe everything. Used for "clear all" debugging or when the
 *  schema changes. Not called from production code paths. */
export async function clearAll(): Promise<void> {
  try {
    const store = await tx('readwrite');
    await reqAsPromise(store.clear());
  } catch {
    // ignore
  }
}
