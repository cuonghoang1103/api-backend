/**
 * pr-09-4 — Prisma ORM · Chapter 9 · Lesson 9.4 "The connection pool, sized by arithmetic" (deck video, 12/11/2026). Bài web: pr-9-4-connection-pool.
 * Output THẬT (`chay.sh p9-4`, prisma-pg9 PostgreSQL 16.14, 4 CPU / 2 GB, max_connections 100; Prisma 6.19.3; Mac M1 Max 10 nhân; PgBouncer 1.23.1 transaction mode
 * trong container prisma-pgb, default_pool_size 20): container --cpus=2 ⇒ os.cpus() 10, availableParallelism() 2 · pool mặc định = 21 (10 × 2 + 1), 39 truy vấn chờ ·
 * idle in transaction khi giao dịch tương tác chờ 3 s · tải 200 luồng × 8 s với connection_limit 10 / 50 / 200 (3 vòng) — 200 ⇒ P2037 too many clients ·
 * qua PgBouncer: pgbouncer=true ⇒ 0 lỗi, PostgreSQL thấy 20 kết nối; thiếu cờ ⇒ prepared statement "s0" does not exist. Số trên slide ĐỌC TỪ output.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p9-4/bench.txt": "$ for vong in 1 2 3; do for n in 10 50 200; do DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c94 npx tsx p9/94/pool.mts bench $n 2>&1 | grep -v deprecated; done; done\nconnection_limit=10   → p50  535 ms · p99   713 ms · thong luong   387 truy van/s · loi 0\nconnection_limit=50   → p50  631 ms · p99  1114 ms · thong luong   323 truy van/s · loi 0\nconnection_limit=200  → p50  997 ms · p99  2114 ms · thong luong    89 truy van/s · loi 6627 — P2037 Too many database connections opened: FATAL: remaining connection slots are reserved for roles with the SUPERUSER attribute\nconnection_limit=10   → p50  494 ms · p99   632 ms · thong luong   416 truy van/s · loi 0\nconnection_limit=50   → p50  467 ms · p99  1000 ms · thong luong   425 truy van/s · loi 0\nconnection_limit=200  → p50 1134 ms · p99  2097 ms · thong luong    82 truy van/s · loi 7001 — P2037 Too many database connections opened: FATAL: sorry, too many clients already\nconnection_limit=10   → p50  510 ms · p99   856 ms · thong luong   375 truy van/s · loi 0\nconnection_limit=50   → p50  443 ms · p99   618 ms · thong luong   466 truy van/s · loi 0\nconnection_limit=200  → p50  895 ms · p99  1625 ms · thong luong   107 truy van/s · loi 8341 — P2037 Too many database connections opened: FATAL: sorry, too many clients already\n",
 "demo/out/p9-4/macdinh.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c94 npx tsx p9/94/pool.mts macdinh 2>&1 | grep -v deprecated\n60 truy van pg_sleep(0.5) cung luc, client khong dat connection_limit:\n  prisma_client_queries_wait           39\n  prisma_pool_connections_busy         21\n  prisma_pool_connections_idle         0\n  prisma_pool_connections_open         21\n┌─────────┬──────────┬────┬────────────┐\n│ (index) │ state    │ so │ lau_nhat   │\n├─────────┼──────────┼────┼────────────┤\n│ 0       │ 'active' │ 21 │ '00:00:00' │\n└─────────┴──────────┴────┴────────────┘\n",
 "demo/out/p9-4/cpus.txt": "$ docker run --rm --cpus=2 node:22-alpine node -e \"const os=require('os');console.log('os.cpus().length =', os.cpus().length, '· availableParallelism() =', os.availableParallelism())\"\nos.cpus().length = 10 · availableParallelism() = 2\n$ sysctl -n hw.ncpu\n10\n",
 "demo/out/p9-4/max-conn.txt": "$ docker exec -i prisma-pg9 psql -U student -d c94 -c 'SHOW max_connections;' -c 'SHOW superuser_reserved_connections;'\n max_connections \n-----------------\n 100\n(1 row)\n\n superuser_reserved_connections \n--------------------------------\n 3\n(1 row)\n\n",
 "demo/out/p9-4/idle-tx.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c94 npx tsx p9/94/pool.mts idle-tx 2>&1 | grep -v deprecated\n┌─────────┬───────────────────────┬────┬────────────┐\n│ (index) │ state                 │ so │ lau_nhat   │\n├─────────┼───────────────────────┼────┼────────────┤\n│ 0       │ 'active'              │ 6  │ '00:00:01' │\n│ 1       │ 'idle in transaction' │ 1  │ '00:00:01' │\n└─────────┴───────────────────────┴────┴────────────┘\n",
 "demo/out/p9-4/pgbouncer.txt": "$ npx tsx p9/94/pgb.mts co 2>&1 | grep -v deprecated\nqua PgBouncer + pgbouncer=true: 200 tho, 2295 truy van ok, 0 loi · PostgreSQL thay toi da 20 ket noi\n$ npx tsx p9/94/pgb.mts khong 2>&1 | grep -v deprecated\nqua PgBouncer (KHONG co pgbouncer=true): 200 tho, 1285 truy van ok, 23786 loi · PostgreSQL thay toi da 20 ket noi\n  loi dau tien:  ConnectorError(ConnectorError { user_facing_error: None, kind: QueryError(PostgresError { code: \"26000\", message: \"prepared statement \\\"s0\\\" does not \n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, prs, two, box, cards, c, tbl, steps , icards, cmp, bars, hub, tiers, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-09-4', code: 'PR 9.4', title: 'The connection pool, sized by arithmetic', sub: 'Chapter 9 · Lesson 9.4' };

const DEMO = 'demo';
const OUT = (t, ch = 'p9-4') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/docker exec -i prisma-pg9 psql -U student -d c94/g, 'psql').replace(/p9\/9\d\//g, '').replace(/ 2>&1 \| grep -v deprecated/g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const MOI = 'terminal — PostgreSQL 16.14 (Docker, 4 CPU, max_connections 100) · Prisma 6.19.3';
const bo$ = (t) => gon(OUT(t)).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');
const BENCH = bo$('bench').split('\n').map((l) => l.replace(/ — P2037 .*$/, ' (P2037)'));

export const slides = lamDeck({ chuong: 'Chapter 9 — Performance', bai: '9.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 9 · Lesson 9.4', t: 'The connection pool, sized by arithmetic', sub: 'The default, the multiplication, the measurement — and PgBouncer when processes outnumber connections' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['plug', "Prisma's default pool, and what a container reports", ''],
      ['server', 'The budget: max_connections divided by processes', ''],
      ['gauge', 'Reading pg_stat_activity and the pool metrics', ''],
      ['stack', '10, 50, 200 connections under the same load', ''],
      ['shield', 'PgBouncer — and the flag that makes it work', ''],
    ], 2) },
  /* 3 */ { t: 'The default — and the multiplication', body: two(ts(`// no connection_limit in the URL
const prisma = new PrismaClient();
// 60 queries at once, each pg_sleep(0.5)
const ngu5 = () => prisma.$queryRaw\`
  SELECT 1 AS x FROM pg_sleep(0.5)\`;
const viec = Promise.all(
  Array.from({ length: 60 }, ngu5));
await ngu(250);
// previewFeatures = ["metrics"]
const m = await prisma.$metrics.json();`, { sm: true }), tp(bo$('macdinh'), { wrap: 60, fs: 12, title: MOI }), '') +
      cards([
        ['21 = 10 cores × 2 + 1', 'The default pool on this 10-core Mac. 39 queries waited for a connection.'],
        ['Multiply it', 'Four such processes: 84. Plus a worker, a migration, psql — past 100.'],
        ['PrismaPromise is lazy', 'A query built and not awaited never runs: the map above needs Promise.all (or .then) to start.'],
      ], 3) },
  /* 4 */ { t: 'What a container reports', body: tp(gon(OUT('cpus')), { wrap: 108, fs: 15, title: 'terminal — Docker, node:22-alpine' }) + tp(bo$('max-conn'), { fs: 13, title: MOI }) +
      box('--cpus=2 does not change os.cpus()', 'A CPU quota is enforced by the scheduler; /proc still lists every core. Node&#39;s availableParallelism() does read the quota (2). Do not let either decide your pool — write connection_limit into DATABASE_URL.', 'do2') },
  /* 5 */ { t: 'The arithmetic', body: sql(`-- available = max_connections − reserved − others  =  100 − 3 − 10 (psql, cron, migrate)  =  87
-- connection_limit = 87 / 6 containers ≈ 14 → round down to 12`, { sm: true }) + prs(`# .env — every environment
DATABASE_URL="postgresql://u:p@host:5432/db?connection_limit=12&pool_timeout=20&connect_timeout=10"`, { sm: true }) + tbl(['Parameter', 'Meaning'], [
      [c('connection_limit'), 'the pool size — the one nobody sets'],
      [c('pool_timeout'), 'wait for a free connection before P2024 (default 10 s)'],
      [c('connect_timeout'), 'TCP + startup of a new connection (default 5 s)'],
      ['a worker process', 'another pool — give it 3 or 4'],
    ]) + box('Measured here: max_connections 100, 3 reserved', 'The budget is arithmetic, not a guess — and a pool of 21 per process (the default on this Mac) would allow four processes before the next deploy fails.', 'lam') },
  /* 6 */ { t: 'Measure it: pg_stat_activity', body: two(ts(`// a 3 s "HTTP call" inside a transaction
const tx = prisma.$transaction(async (t) => {
  await t.post.findFirst();
  await ngu(3000);
}, { timeout: 10000 });
// six real queries meanwhile
const sau = () => prisma.$queryRaw\`
  SELECT 1 AS x FROM pg_sleep(1.5)\`;
Promise.all(Array.from({ length: 6 }, sau));`, { sm: true }) + sql(`SELECT state, count(*) AS so,
       max(now() - state_change) AS lau_nhat
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY state;`, { sm: true }), tp(bo$('idle-tx'), { wrap: 60, fs: 13, title: MOI }), '') +
      box('idle in transaction: always investigate', 'A connection held by a transaction that is doing nothing — the Lesson 7.1 mistake, visible from the database. idle_in_transaction_session_timeout is the backstop.', 'lam') },
  /* 7 */ { t: 'Same load, three pool sizes', body: ts(`// 200 concurrent workers for 8 s, one query each loop (240 rows aggregated per author)
const prisma = new PrismaClient({ datasourceUrl: \`\${URL}?connection_limit=\${n}&pool_timeout=30\` });`, { sm: true }) +
      tp(BENCH.join('\n'), { wrap: 116, fs: 13, title: MOI + ' · 3 rounds' }) +
      box('Five times the connections, no more throughput', 'On a 4-CPU database, 10 and 50 connections did about the same work across three rounds (roughly 320–470 queries/s, varying round to round), and 50 had a worse p99 in two of them. 200 asked for more than max_connections and failed with P2037. Raise the pool only when queries_wait stays above zero and the database has CPU to spare.', 'xanh') },
  /* 8 */ { t: 'When processes outnumber connections: PgBouncer', body: prs(`DATABASE_URL="postgresql://u:p@pgbouncer:6432/db?pgbouncer=true&connection_limit=1"   # url
DIRECT_URL="postgresql://u:p@postgres:5432/db"                                       # directUrl, for migrate`, { sm: true }) + two(prs(`datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}`, { sm: true }), tp(bo$('pgbouncer').replace(/ConnectorError\(.*?message: /, '… message: '), { wrap: 62, fs: 12, title: 'PgBouncer 1.23.1, transaction mode, pool 20 · 200 client connections' }), '') +
      cards([
        ['pgbouncer=true', 'Prisma stops using named prepared statements. Without it: "prepared statement s0 does not exist" — thousands of errors.'],
        ['PostgreSQL saw 20', '200 client connections multiplexed onto default_pool_size.'],
        ['What you give up', 'Session state: SET, session advisory locks (7.3), LISTEN/NOTIFY. Migrations go through directUrl.'],
      ], 3) },
  /* 9 */ { t: 'The order of operations', body: cmp(['Step', 'Tool'], [
      ['Budget', c('max_connections') + ' − reserved − others, divided by processes'],
      ['Write it down', c('connection_limit') + ' in every DATABASE_URL'],
      ['Watch', c('pg_stat_activity') + ' states and ' + c('prisma_client_queries_wait')],
      ['Raise only on evidence', 'waiting queries and spare database CPU'],
      ['Many short-lived processes', 'PgBouncer in transaction mode + ' + c('pgbouncer=true') + ' + ' + c('directUrl')],
    ]) + box('$metrics is a deprecated preview', 'Prisma 6.19.3 warns "Preview feature metrics is deprecated" on generate. pg_stat_activity works without it.', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Print ${c('os.cpus()')} inside a limited container`,
      `Fire 60 queries; read the pool gauges`,
      `Hold a transaction open; find it in ${c('pg_stat_activity')}`,
      `Run 200 workers at 10 / 50 / 200 connections`,
    ]), box('Keep these', `<ul><li>Default = cores × 2 + 1, per process</li><li>Set connection_limit everywhere</li><li>Bigger pool ≠ faster</li><li>PgBouncer needs pgbouncer=true</li></ul>`, 'lam'), '') },
]);
