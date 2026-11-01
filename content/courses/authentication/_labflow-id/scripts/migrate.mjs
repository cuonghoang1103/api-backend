// scripts/migrate.mjs — apply sql/NNN_*.sql in order, once each (a tiny version of what Prisma/Flyway do).
import fs from 'node:fs';
import { pool } from '../src/db.js';

await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz DEFAULT now())');
const done = new Set((await pool.query('SELECT name FROM schema_migrations')).rows.map((r) => r.name));
for (const file of fs.readdirSync('sql').filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort()) {
  if (done.has(file)) continue;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(fs.readFileSync(`sql/${file}`, 'utf8'));
    await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
    await client.query('COMMIT');
    console.log('applied', file);
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}
await pool.end();
