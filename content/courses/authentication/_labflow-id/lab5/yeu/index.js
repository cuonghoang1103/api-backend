// lab5/yeu/index.js — a first attempt that "works": it rotates and hands out new tokens, and even has a devices page.
// But it never marks a token used, so it cannot tell a rotated token from a stolen one — no reuse detection, no grace,
// and a revoked token still refreshes.
import { newToken, tokenDigest } from '../../src/crypto/index.js';

export function refreshLayer({ store, now = () => Date.now(), familyTtlMs = 30 * 24 * 3600e3, graceMs = 10e3 }) {
  async function issue(userId, { ip = null, ua = null, familyId, expiresAt } = {}) {
    const token = newToken('lfid_rt'); const t = now();
    const row = { id: newToken('rt'), familyId: familyId ?? newToken('fam'), userId, digest: tokenDigest(token),
      createdAt: t, expiresAt: expiresAt ?? t + familyTtlMs, usedAt: null, replacedBy: null, revokedAt: null, ip, userAgent: ua };
    await store.insert(row);
    return { token, row };
  }
  async function rotate(presented) {
    const rec = await store.getByDigest(tokenDigest(presented));
    if (!rec) return { error: 'INVALID' };
    const next = await issue(rec.userId, { familyId: rec.familyId }); // just mint a new one — looks fine, until it isn't
    return { token: next.token, row: next.row };
  }
  return {
    issue, rotate,
    revokeFamily: (familyId) => store.revokeFamily(familyId, now()),
    revokeAll: (userId) => store.revokeAllForUser(userId, now()),
    revokeDevice: (userId, familyId) => store.revokeFamilyForUser(userId, familyId, now()),
    listDevices: (userId) => store.listFamilies(userId, now()),
  };
}
