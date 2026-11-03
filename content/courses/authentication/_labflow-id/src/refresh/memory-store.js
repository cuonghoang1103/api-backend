// src/refresh/memory-store.js — the same store in a Map: for tests, the Lab 5 grader, and one-process demos.
export function memoryStore() {
  const rows = new Map(); // id -> row
  const byDigest = new Map(); // digest -> id
  const api = {
    rows,
    async insert(s) { rows.set(s.id, { ...s }); byDigest.set(s.digest, s.id); },
    async getByDigest(digest) { const id = byDigest.get(digest); return id ? { ...rows.get(id) } : null; },
    async getById(id) { const r = rows.get(id); return r ? { ...r } : null; },
    async markUsed(id, f) { const r = rows.get(id); if (r) { r.usedAt = f.usedAt; r.replacedBy = f.replacedBy; } },
    async revokeFamily(familyId, t) { let n = 0; for (const r of rows.values()) if (r.familyId === familyId && !r.revokedAt) { r.revokedAt = t; n++; } return n; },
    async revokeAllForUser(userId, t) { let n = 0; for (const r of rows.values()) if (r.userId === userId && !r.revokedAt) { r.revokedAt = t; n++; } return n; },
    async revokeFamilyForUser(userId, familyId, t) { let n = 0; for (const r of rows.values()) if (r.userId === userId && r.familyId === familyId && !r.revokedAt) { r.revokedAt = t; n++; } return n; },
    async listFamilies(userId, t) {
      const fam = new Map();
      for (const r of rows.values()) {
        if (r.userId !== userId || r.revokedAt || r.expiresAt <= t) continue;
        const f = fam.get(r.familyId) ?? { familyId: r.familyId, firstSeen: r.createdAt, lastSeen: r.createdAt, ip: r.ip, userAgent: r.userAgent, expiresAt: r.expiresAt };
        f.firstSeen = Math.min(f.firstSeen, r.createdAt);
        f.lastSeen = Math.max(f.lastSeen, r.createdAt);
        f.expiresAt = Math.max(f.expiresAt, r.expiresAt);
        fam.set(r.familyId, f);
      }
      return [...fam.values()].sort((a, b) => b.lastSeen - a.lastSeen);
    },
  };
  return api;
}
