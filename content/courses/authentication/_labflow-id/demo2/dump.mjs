// demo2/dump.mjs — what an attacker sees after one SQL injection or one leaked backup: the table, row by row.
import { pool } from '../src/db.js';
const table = process.argv[2] ?? 'users';
const cols = process.argv[3] ?? 'id, email, password_hash';
const { rows } = await pool.query(`SELECT ${cols} FROM ${table} ORDER BY length(id), id LIMIT ${Number(process.argv[4] ?? 5)}`);
for (const r of rows) console.log(Object.values(r).join(' | '));
await pool.end();
