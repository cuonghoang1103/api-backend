// src/sessions/memory-store.js — the same store in a Map: for tests, the Lab 3 grader, and one-process demos. Not for production
// (a restart signs everyone out, and two processes do not share it — lesson 3.5).
export function memoryStore() {
  const rows = new Map();
  const log = { inserts: 0, updates: 0, deletes: 0 };
  return {
    rows, log,
    async insert(s) { log.inserts++; rows.set(s.digest, { ...s }); },
    async get(digest) { const s = rows.get(digest); return s ? { ...s } : null; },
    async update(digest, f) { log.updates++; if (rows.has(digest)) Object.assign(rows.get(digest), f); },
    async delete(digest) { log.deletes++; rows.delete(digest); },
    async deleteByUser(userId) { let n = 0; for (const [d, s] of rows) if (s.userId === userId) { rows.delete(d); n++; } return n; },
  };
}
