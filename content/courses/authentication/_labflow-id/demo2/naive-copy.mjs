// demo2/naive-copy.mjs — lesson 2.1: the migration a hurried team writes: users go to PostgreSQL exactly as they were in v0.1.
import { pool } from '../src/db.js';
import { population } from './population.mjs';

await pool.query('DROP TABLE IF EXISTS naive_users');
await pool.query('CREATE TABLE naive_users (id text PRIMARY KEY, email text, password text)');
for (const p of population()) await pool.query('INSERT INTO naive_users VALUES ($1, $2, $3)', [p.id, p.email, p.password]);
console.log('copied', (await pool.query('SELECT count(*) FROM naive_users')).rows[0].count, 'users');
await pool.end();
