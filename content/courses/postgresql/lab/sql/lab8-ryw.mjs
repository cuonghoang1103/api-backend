// ═══════════════════════════════════════════════════════════════════════════
// CT Shop · Lab 8 — "read your own writes" on a replica, measured
// Lab 8 — "đọc lại cái mình vừa ghi" trên bản sao, đo thật
// cuongthai.com/courses/postgresql · PostgreSQL 17 · Node 18+
//
//   npm i pg
//   node lab8-ryw.mjs 500          # 500 orders per test
// A checkout writes the order on the PRIMARY, then the "thank you" page reads it back.
// If that read goes to the REPLICA, is the order there yet?
// ═══════════════════════════════════════════════════════════════════════════
import pg from 'pg';

const PRIMARY = process.env.PRIMARY_URL ?? 'postgresql://postgres:ctshop-lab8@127.0.0.1:5481/ctshop';
const REPLICA = process.env.REPLICA_URL ?? 'postgresql://postgres:ctshop-lab8@127.0.0.1:5482/ctshop';
const N = Number(process.argv[2] ?? 500);

const primary = new pg.Client(PRIMARY);
const replica = new pg.Client(REPLICA);
await primary.connect();
await replica.connect();

const placeOrder = async (i) =>
  (await primary.query(`INSERT INTO shop.orders (customer_id, note) VALUES ($1, 'ryw test') RETURNING id`, [1 + (i % 290)])).rows[0].id;
const seenOnReplica = async (id) => (await replica.query('SELECT 1 FROM shop.orders WHERE id = $1', [id])).rowCount === 1;

// 1) naive: write on the primary, read on the replica straight away
let missed = 0;
for (let i = 0; i < N; i++) if (!(await seenOnReplica(await placeOrder(i)))) missed++;
console.log(`1) read on the replica right after COMMIT    : ${String(missed).padStart(4)} / ${N} orders NOT found`);

// 2) wait until the replica has replayed past the primary's WAL position taken AFTER the commit
missed = 0;
const waits = [];
for (let i = 0; i < N; i++) {
  const id = await placeOrder(i);
  const { lsn } = (await primary.query('SELECT pg_current_wal_lsn() AS lsn')).rows[0];
  const t0 = performance.now();
  while (!(await replica.query('SELECT pg_last_wal_replay_lsn() >= $1::pg_lsn AS ok', [lsn])).rows[0].ok) { /* poll */ }
  waits.push(performance.now() - t0);
  if (!(await seenOnReplica(id))) missed++;
}
waits.sort((a, b) => a - b);
const avg = waits.reduce((s, x) => s + x, 0) / N;
console.log(`2) wait for the replica to reach the commit LSN: ${String(missed).padStart(4)} / ${N} NOT found` +
  ` · wait avg ${avg.toFixed(2)} ms, p99 ${waits[Math.floor(N * 0.99) - 1].toFixed(2)} ms, max ${waits[N - 1].toFixed(2)} ms`);

// 3) the simplest fix: a request that has just written reads from the PRIMARY (Prisma: prisma.$primary())
missed = 0;
for (let i = 0; i < N; i++) {
  const id = await placeOrder(i);
  if ((await primary.query('SELECT 1 FROM shop.orders WHERE id = $1', [id])).rowCount !== 1) missed++;
}
console.log(`3) read your own write from the PRIMARY       : ${String(missed).padStart(4)} / ${N} NOT found`);

await primary.query(`DELETE FROM shop.orders WHERE note = 'ryw test'`);
await primary.end();
await replica.end();
