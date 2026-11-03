// src/mfa/store.js — PostgreSQL persistence for the second factor (lessons 7.3, 7.5): TOTP secret, recovery codes, passkeys.
import { q } from '../db.js';

export const totpStore = {
  async put(userId, secret) { await q(`INSERT INTO totp_secrets (user_id, secret) VALUES ($1, $2)
    ON CONFLICT (user_id) DO UPDATE SET secret = $2, confirmed_at = NULL, created_at = now()`, [userId, secret]); },
  async get(userId) { const r = (await q('SELECT * FROM totp_secrets WHERE user_id = $1', [userId])).rows[0]; return r ? { secret: r.secret, confirmedAt: r.confirmed_at ? +r.confirmed_at : null } : null; },
  async confirm(userId) { await q('UPDATE totp_secrets SET confirmed_at = now() WHERE user_id = $1', [userId]); },
  async remove(userId) { await q('DELETE FROM totp_secrets WHERE user_id = $1', [userId]); },
};

export const recoveryStore = {
  async replaceAll(userId, digests) {
    await q('DELETE FROM recovery_codes WHERE user_id = $1', [userId]);
    for (const d of digests) await q('INSERT INTO recovery_codes (user_id, digest) VALUES ($1, $2)', [userId, d]);
  },
  async liveDigests(userId) { return (await q('SELECT id, digest FROM recovery_codes WHERE user_id = $1 AND used_at IS NULL', [userId])).rows.map((r) => ({ id: r.id, digest: r.digest })); },
  async markUsed(id) { await q('UPDATE recovery_codes SET used_at = now() WHERE id = $1', [id]); },
};

export const passkeyStore = {
  async add(userId, c) { await q(`INSERT INTO passkeys (id, user_id, public_key, counter, transports) VALUES ($1, $2, $3, $4, $5)`,
    [c.id, userId, c.publicKey, c.counter, JSON.stringify(c.transports ?? [])]); },
  async listForUser(userId) { return (await q('SELECT * FROM passkeys WHERE user_id = $1', [userId])).rows.map(mapKey); },
  async getById(id) { return mapKey((await q('SELECT * FROM passkeys WHERE id = $1', [id])).rows[0]); },
  async bumpCounter(id, counter) { await q('UPDATE passkeys SET counter = $2, last_used_at = now() WHERE id = $1', [id, counter]); },
};
const mapKey = (r) => r ? { id: r.id, userId: r.user_id, publicKey: r.public_key, counter: Number(r.counter), transports: JSON.parse(r.transports || '[]') } : null;
