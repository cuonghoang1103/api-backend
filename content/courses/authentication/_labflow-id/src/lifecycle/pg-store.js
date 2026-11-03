// src/lifecycle/pg-store.js — the one-time-token store on PostgreSQL (lesson 6.3). Times are epoch ms in JavaScript.
import { q } from '../db.js';

const row = (r) => r ? { id: r.id, userId: r.user_id, purpose: r.purpose, digest: r.digest,
  createdAt: +r.created_at, expiresAt: +r.expires_at, usedAt: r.used_at ? +r.used_at : null } : null;
const ts = (ms) => new Date(ms);

export const pgStore = {
  async insert(s) {
    await q(`INSERT INTO one_time_tokens (id, user_id, purpose, digest, created_at, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)`, [s.id, s.userId, s.purpose, s.digest, ts(s.createdAt), ts(s.expiresAt)]);
  },
  async getByDigest(digest) { return row((await q('SELECT * FROM one_time_tokens WHERE digest = $1', [digest])).rows[0]); },
  async markUsed(id, t) { await q('UPDATE one_time_tokens SET used_at = $2 WHERE id = $1', [id, ts(t)]); },
};
