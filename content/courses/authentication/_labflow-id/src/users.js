// src/users.js — the users table (PostgreSQL), shaped as the small "store" that signIn() expects.
import { q } from './db.js';

const row = (r) => r && { id: r.id, email: r.email, name: r.name, role: r.role, passwordHash: r.password_hash, mustChangePassword: r.must_change_password };

export const users = {
  async findByEmail(email) {
    return row((await q('SELECT * FROM users WHERE email = $1', [email])).rows[0]);
  },
  async findById(id) {
    return row((await q('SELECT * FROM users WHERE id = $1', [id])).rows[0]);
  },
  async create({ email, name, role = 'STUDENT', passwordHash }) {
    const r = await q(`INSERT INTO users (id, email, name, role, password_hash)
      VALUES ('usr_' || nextval('user_seq'), $1, $2, $3, $4) RETURNING *`, [email.trim().toLowerCase(), name, role, passwordHash]);
    return row(r.rows[0]);
  },
  async updateHash(id, passwordHash) {
    await q('UPDATE users SET password_hash = $2 WHERE id = $1', [id, passwordHash]);
  },
  async flagMustChange(id) {
    await q('UPDATE users SET must_change_password = true WHERE id = $1', [id]);
  },
};
