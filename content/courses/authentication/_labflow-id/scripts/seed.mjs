// scripts/seed.mjs — Chapter 2: An, Binh and Co Lan are EXISTING accounts, imported straight into PostgreSQL
// (the new password policy applies to new passwords; Binh's "123456" gets flagged at her next sign-in — lesson 2.4).
import { pool } from '../src/db.js';
import { hashPassword } from '../src/passwords/index.js';

const USERS = [
  ['usr_1', 'an@student.labflow.example', 'Nguyen Van An', 'STUDENT', 'an-lab-2026'],
  ['usr_2', 'binh@student.labflow.example', 'Tran Thi Binh', 'STUDENT', '123456'],
  ['usr_3', 'lan@labflow.example', 'Co Lan', 'LAB_MANAGER', 'lan-lab-2026'],
];
for (const [id, email, name, role, password] of USERS) {
  await pool.query(`INSERT INTO users (id, email, name, role, password_hash) VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash`, [id, email, name, role, await hashPassword(password)]);
  console.log('seeded', id, email, role);
}
await pool.query(`SELECT setval('user_seq', 3)`);
await pool.end();
