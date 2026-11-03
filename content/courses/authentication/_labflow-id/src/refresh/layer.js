// src/refresh/layer.js — Chapter 5 = Lab 5 reference: refresh tokens that rotate, detect reuse, and revoke by family.
// store = { insert, getByDigest, getById, markUsed, revokeFamily, revokeAllForUser, listFamilies, revokeFamilyForUser }.
// A refresh token is a long-lived secret kept ONLY as a digest (lesson 1.3). Every use rotates it: the old one is marked
// used and a new one is minted in the same family. Presenting an already-used token is either a browser race (two tabs,
// lesson 5.5) or theft — and theft must revoke the whole family (lesson 5.2).
import { newToken, tokenDigest } from '../crypto/index.js';

export function refreshLayer({ store, now = () => Date.now(), familyTtlMs = 30 * 24 * 3600e3, graceMs = 10e3 }) {
  const recent = new Map(); // parentDigest -> { token, row, at }: the just-minted child, for the grace window (5.5)

  /** Start a new family (a new login on a new device), or add to an existing one during rotation. */
  async function issue(userId, { ip = null, ua = null, familyId, expiresAt } = {}) {
    const token = newToken('lfid_rt');
    const t = now();
    const row = {
      id: newToken('rt'), familyId: familyId ?? newToken('fam'), userId,
      digest: tokenDigest(token), createdAt: t, expiresAt: expiresAt ?? t + familyTtlMs,
      usedAt: null, replacedBy: null, revokedAt: null, ip, userAgent: ua,
    };
    await store.insert(row);
    return { token, row };
  }

  /** Rotate a presented token. ⇒ { token, row } (fresh token), or { error } with a reason. */
  async function rotate(presented, { ip = null, ua = null } = {}) {
    const digest = tokenDigest(presented);
    const rec = await store.getByDigest(digest);
    if (!rec) return { error: 'INVALID' };                 // never issued, or already pruned
    if (rec.revokedAt) return { error: 'REVOKED' };         // the family was revoked (sign-out, theft, password change)
    const t = now();
    if (t >= rec.expiresAt) return { error: 'EXPIRED' };    // the family's 30 days are up
    if (rec.usedAt) {
      const cached = recent.get(digest);
      if (cached && t - cached.at <= graceMs) return { token: cached.token, row: cached.row, raced: true }; // 5.5: the race
      await store.revokeFamily(rec.familyId, t);            // 5.2: reuse outside the grace window ⇒ theft ⇒ revoke the family
      return { error: 'REUSE_DETECTED', familyId: rec.familyId };
    }
    const next = await issue(rec.userId, { ip, ua, familyId: rec.familyId, expiresAt: rec.expiresAt });
    await store.markUsed(rec.id, { usedAt: t, replacedBy: next.row.id });
    recent.set(digest, { token: next.token, row: next.row, at: t });
    return { token: next.token, row: next.row };
  }

  const revokeFamily = (familyId) => store.revokeFamily(familyId, now());          // one device / login
  const revokeAll = (userId) => store.revokeAllForUser(userId, now());             // every device (password change, 5.3)
  const revokeDevice = (userId, familyId) => store.revokeFamilyForUser(userId, familyId, now());
  const listDevices = (userId) => store.listFamilies(userId, now());              // the devices page (5.4)

  return { issue, rotate, revokeFamily, revokeAll, revokeDevice, listDevices };
}
