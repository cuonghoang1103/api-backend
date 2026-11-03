// src/users.js — the users table (PostgreSQL), shaped as the small "store" that signIn() expects.
import { q } from './db.js';

const row = (r) => r && { id: r.id, email: r.email, name: r.name, role: r.role, passwordHash: r.password_hash,
  mustChangePassword: r.must_change_password, emailVerifiedAt: r.email_verified_at ? +r.email_verified_at : null,
  status: r.status ?? 'active' };

export const users = {
  // Chapter 6: an active account only (a deleted one is gone from every flow). signIn and reset use this.
  async findByEmail(email) {
    return row((await q(`SELECT * FROM users WHERE email = $1 AND status = 'active'`, [email])).rows[0]);
  },
  async findById(id) {
    return row((await q('SELECT * FROM users WHERE id = $1', [id])).rows[0]);
  },
  // Chapter 6: a new account starts UNVERIFIED (email_verified_at is null) until the address is proven (lesson 6.2).
  async create({ email, name, role = 'STUDENT', passwordHash }) {
    const r = await q(`INSERT INTO users (id, email, name, role, password_hash)
      VALUES ('usr_' || nextval('user_seq'), $1, $2, $3, $4) RETURNING *`, [email.trim().toLowerCase(), name, role, passwordHash]);
    return row(r.rows[0]);
  },
  async updateHash(id, passwordHash) {
    await q('UPDATE users SET password_hash = $2 WHERE id = $1', [id, passwordHash]);
  },
  // Changing the email un-verifies it: the new address must be proven too (lesson 6.5).
  async updateEmail(id, email) {
    await q('UPDATE users SET email = $2, email_verified_at = NULL WHERE id = $1', [id, email]);
  },
  async flagMustChange(id) {
    await q('UPDATE users SET must_change_password = true WHERE id = $1', [id]);
  },
  async markEmailVerified(id, t = Date.now()) {
    await q('UPDATE users SET email_verified_at = $2 WHERE id = $1', [id, new Date(t)]);
  },
  async setStatus(id, status) {
    await q('UPDATE users SET status = $2 WHERE id = $1', [id, status]);
  },
};
