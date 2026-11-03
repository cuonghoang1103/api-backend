// src/lifecycle/memory-store.js — the same one-time-token store in a Map: for tests, the Lab 6 grader, and demos.
export function memoryStore() {
  const rows = new Map();          // id -> row
  const byDigest = new Map();      // digest -> id
  return {
    rows,
    async insert(s) { rows.set(s.id, { ...s }); byDigest.set(s.digest, s.id); },
    async getByDigest(digest) { const id = byDigest.get(digest); return id ? { ...rows.get(id) } : null; },
    async markUsed(id, t) { const r = rows.get(id); if (r) r.usedAt = t; },
  };
}
