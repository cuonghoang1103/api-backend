// src/sessions/pg-store.js — the session store on PostgreSQL (lesson 3.1). Times are epoch milliseconds in JavaScript.
import { q } from '../db.js';

const row = (r) => r ? { userId: r.user_id, createdAt: +r.created_at, expiresAt: +r.expires_at, lastSeenAt: +r.last_seen_at,
  authAt: +r.auth_at, ip: r.ip, userAgent: r.user_agent } : null;
const ts = (ms) => new Date(ms);

export const pgStore = {
  async insert(s) {
    await q(`INSERT INTO sessions (digest, user_id, created_at, expires_at, last_seen_at, auth_at, ip, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [s.digest, s.userId, ts(s.createdAt), ts(s.expiresAt), ts(s.lastSeenAt), ts(s.authAt), s.ip, s.userAgent]);
  },
  async get(digest) { return row((await q('SELECT * FROM sessions WHERE digest = $1', [digest])).rows[0]); },
  async update(digest, f) {
    if (f.lastSeenAt) await q('UPDATE sessions SET last_seen_at = $2 WHERE digest = $1', [digest, ts(f.lastSeenAt)]);
    if (f.authAt) await q('UPDATE sessions SET auth_at = $2 WHERE digest = $1', [digest, ts(f.authAt)]);
  },
  async delete(digest) { await q('DELETE FROM sessions WHERE digest = $1', [digest]); },
  async deleteByUser(userId) { return (await q('DELETE FROM sessions WHERE user_id = $1', [userId])).rowCount; },
};
