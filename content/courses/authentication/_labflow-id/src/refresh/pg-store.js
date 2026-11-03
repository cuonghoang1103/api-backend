// src/refresh/pg-store.js — the refresh-token store on PostgreSQL (lesson 5.1). Times are epoch ms in JavaScript.
import { q } from '../db.js';

const row = (r) => r ? {
  id: r.id, familyId: r.family_id, userId: r.user_id, digest: r.digest,
  createdAt: +r.created_at, expiresAt: +r.expires_at,
  usedAt: r.used_at ? +r.used_at : null, replacedBy: r.replaced_by,
  revokedAt: r.revoked_at ? +r.revoked_at : null, ip: r.ip, userAgent: r.user_agent,
} : null;
const ts = (ms) => new Date(ms);

export const pgStore = {
  async insert(s) {
    await q(`INSERT INTO refresh_tokens (id, family_id, user_id, digest, created_at, expires_at, ip, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [s.id, s.familyId, s.userId, s.digest, ts(s.createdAt), ts(s.expiresAt), s.ip, s.userAgent]);
  },
  async getByDigest(digest) { return row((await q('SELECT * FROM refresh_tokens WHERE digest = $1', [digest])).rows[0]); },
  async getById(id) { return row((await q('SELECT * FROM refresh_tokens WHERE id = $1', [id])).rows[0]); },
  async markUsed(id, f) {
    await q('UPDATE refresh_tokens SET used_at = $2, replaced_by = $3 WHERE id = $1', [id, ts(f.usedAt), f.replacedBy]);
  },
  // Revoke every token of a family that is not already revoked. Returns how many rows it touched.
  async revokeFamily(familyId, t) {
    return (await q('UPDATE refresh_tokens SET revoked_at = $2 WHERE family_id = $1 AND revoked_at IS NULL', [familyId, ts(t)])).rowCount;
  },
  async revokeAllForUser(userId, t) {
    return (await q('UPDATE refresh_tokens SET revoked_at = $2 WHERE user_id = $1 AND revoked_at IS NULL', [userId, ts(t)])).rowCount;
  },
  async revokeFamilyForUser(userId, familyId, t) {
    return (await q('UPDATE refresh_tokens SET revoked_at = $3 WHERE user_id = $1 AND family_id = $2 AND revoked_at IS NULL', [userId, familyId, ts(t)])).rowCount;
  },
  // One entry per live family (a device): the current token's times, the login's ip/ua.
  async listFamilies(userId, t) {
    const r = await q(`SELECT family_id,
        min(created_at) AS first_seen, max(created_at) AS last_seen,
        (array_agg(ip ORDER BY created_at))[1] AS ip,
        (array_agg(user_agent ORDER BY created_at))[1] AS user_agent,
        max(expires_at) AS expires_at
      FROM refresh_tokens
      WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > $2
      GROUP BY family_id ORDER BY max(created_at) DESC`, [userId, ts(t)]);
    return r.rows.map((x) => ({ familyId: x.family_id, firstSeen: +x.first_seen, lastSeen: +x.last_seen,
      ip: x.ip, userAgent: x.user_agent, expiresAt: +x.expires_at }));
  },
};
