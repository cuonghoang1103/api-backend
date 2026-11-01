// demo3/touch-cost.mjs — lesson 3.1: what "update last_seen_at on every request" costs. 1,000 GET /me with one session,
// then PostgreSQL's own counter of updated session rows.  node demo3/touch-cost.mjs <port>
import { pool } from '../src/db.js';
const port = process.argv[2] ?? '4800';
const base = `http://localhost:${port}`;
const res = await fetch(base + '/sign-in', { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'an@student.labflow.example', password: 'an-lab-2026' }) });
const cookie = res.headers.get('set-cookie').split(';')[0];
const updated = async () => { await new Promise((r) => setTimeout(r, 11000)); // idle backends flush statistics after ~10 s (PostgreSQL 15+)
  return Number((await pool.query(`SELECT n_tup_upd FROM pg_stat_user_tables WHERE relname = 'sessions'`)).rows[0].n_tup_upd); };
const before = await updated();
const ms = [];
for (let i = 0; i < 1000; i++) {
  const t0 = performance.now();
  const r = await fetch(base + '/me', { headers: { cookie } });
  await r.arrayBuffer();
  ms.push(performance.now() - t0);
}
ms.sort((a, b) => a - b);
console.log(`port ${port}: 1,000 × GET /me in ${(ms.reduce((s, x) => s + x, 0) / 1000).toFixed(2)} s · median ${ms[500].toFixed(2)} ms · p99 ${ms[990].toFixed(2)} ms · sessions rows updated: ${(await updated()) - before}`);
await pool.end();
