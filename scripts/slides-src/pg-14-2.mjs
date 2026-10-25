/**
 * pg-14-2 — PostgreSQL · Chapter 14 · Lesson 14.2 "Pooling: in the app, and in front of it" (slide EN, kiểu FU, 26/10/2026, agent c14).
 * Nguồn: content/courses/postgresql/s14-ket-noi-van-hanh.mjs › postgresql-14-2-pool-pgbouncer. Output = chạy thật PostgreSQL 17.11 (pgc14tmp)
 * + PgBouncer 1.23.1 (edoburu/pgbouncer:v1.23.1-p3) + Prisma 5.22: video-bai-giang/src/khung/pg/that/pg-14-2a.out.txt (Prisma pool 21 / connection_limit=2
 * & pool_timeout=2 ⇒ P2024) · pg-14-2b (pgbench thẳng vs qua PgBouncer) · pg-14-2c (SHOW POOLS 150 khách, 10 backend) · pg-14-2d (bẫy transaction mode:
 * SET mất, PREPARE "does not exist", advisory lock rò) · pg-14-2e (LISTEN qua PgBouncer không nhận) · pg-14-2f (Prisma qua PgBouncer: 176/200 lỗi vs
 * pgbouncer=true 200/200) · pg-14-2g (30 khách ngồi im: transaction vs session).
 * Bổ sung so với web: bến xe buýt, Prisma pool thật trong CuongThai (src/config/database.ts), dòng thời gian P2024, PgBouncer đo thật cả mặt
 * KHÔNG đẹp (thêm một chặng ⇒ chậm hơn khi ít khách), SHOW POOLS session vs transaction, bẫy chạy thật dưới tải.
 */
import { lamDeck, sql, psql, sh, run, two, box, kw, cards, steps, vsd, flow } from './_pg-chung.mjs';
import { busPic, prismaTimeline, bouncerPic, modesPic } from './pg-14-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-14-2', code: 'PG 14.2', title: 'Pooling: in the app, and in front of it', sub: 'pool size · Prisma pool · PgBouncer modes · what transaction mode breaks' };

export const slides = lamDeck({ chuong: 'Chapter 14 — Connections, pooling & operating', bai: '14.2' }, [
  { cover: true, t: 'Pooling: in the app,<br>and in front of it', sub: 'How big a pool should be, Prisma’s pool,<br>and PgBouncer — run for real' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>connection pool</b> is, as a bus line you can picture</li>
<li>The pool inside your app: Prisma’s <code class="i">connection_limit</code> and <code class="i">pool_timeout</code>, with a real timeout</li>
<li>How big a pool should be — <b>smaller than you think</b></li>
<li><b>PgBouncer</b> run for real: 150 clients on 10 server connections</li>
<li>Exactly what <b>transaction mode</b> breaks — SET, prepared statements, advisory locks, LISTEN — each one reproduced</li>
</ul>
${box('Remember from 14.1', 'Opening a connection cost ~6.8 ms vs ~0.4 ms per reused query, and the server refuses connection 101 (an app role: 98). Pooling is the answer to both.', 'lam')}` },

  { t: 'Everyday example: a bus line, not a taxi per passenger', giua: true, body: `
${busPic()}
<p style="font-size:21px;margin:0">A <b>pool</b> keeps a few connections open and lends them out: a request borrows one, runs, and gives it back for the next request. Too few buses ⇒ people wait at the stop; too many ⇒ the road (the CPU) jams.</p>` },

  { t: 'A connection pool, step by step', to: true, giua: true, body: `
${flow([{ t: 'request', s: 'needs the DB' }, { t: 'borrow', s: 'a free connection', mau: '#2f7d4f' }, { t: 'run query', s: 'on that connection' }, { t: 'give back', s: 'to the pool', mau: '#2f7d4f' }], { h: 130 })}
${cards([
    ['No free connection?', 'The request <b>waits in a queue</b> inside the pool — not at the database.'],
    ['Waited too long?', 'After <code class="i">pool_timeout</code> the pool gives up with an error (Prisma: <b>P2024</b>).'],
    ['Pool size', 'The maximum number of connections the pool will ever open — per process.'],
  ])}
${kw('connection pool', 'a set of open connections shared by many requests')}` },

  { t: 'The pool already inside CuongThai: Prisma', giua: true, body: `
${zm(sql(`// src/config/database.ts (CuongThai, real file — excerpt)
const prismaClient = new PrismaClient({
  ...(process.env.DATABASE_URL
    ? { datasources: { db: { url: process.env.DATABASE_URL } } }
    : {}),
  log: buildLogLevels(process.env.NODE_ENV),
});   // DATABASE_URL has no connection_limit ⇒ Prisma picks the pool size itself`, { sm: true, lang: 'typescript', hl: [4, 7] }), 1.25)}
${zm(psql(`prisma:info Starting a postgresql pool with 21 connections.`, { title: 'Prisma 5.22 log — the same code on a 10-core machine (real)', sm: true }), 1.25)}
${two(box('Prisma’s default pool', '<code class="i">connection_limit</code> = <b>physical CPUs × 2 + 1</b> — per PrismaClient, i.e. per Node.js process.', 'lam'),
  box('So', 'The same code opens 9 connections on a 4-core VPS and 21 on a 10-core laptop. Know which number your server will see.', ''))}` },

  { t: 'Prisma pool settings live in the URL', to: true, giua: true, body: `
${zm(sql(`DATABASE_URL="postgresql://app:***@db:5432/shop?connection_limit=6&pool_timeout=10"`, { lang: 'bash' }), 0.95)}
${cards([
    ['connection_limit', 'Pool size per PrismaClient. Default <b>CPUs × 2 + 1</b>. Set it explicitly in production.'],
    ['pool_timeout', 'Seconds a query may wait for a free connection. Default <b>10</b>; then error P2024. 0 = wait forever (don’t).'],
    ['connect_timeout', 'Seconds to establish a NEW connection. Default <b>5</b>.'],
  ])}
${box('One Node.js process = one PrismaClient', 'Create it once and reuse it (CuongThai does). A new PrismaClient per request = a new pool per request = the 14.1 disaster.', 'bad')}` },

  { t: 'Watch a pool run out (Prisma, real)', giua: true, body: `
${two(zm(sql(`const p = new PrismaClient({ datasources: { db: { url:
  URL + '?connection_limit=2&pool_timeout=2' } } });
// 6 requests at once, each holds a connection 1.5 s
await Promise.all([1, 2, 3, 4, 5, 6].map(async (n) => {
  try {
    await p.$queryRaw\`SELECT 1 AS ok FROM pg_sleep(1.5)\`;
    log(\`request \${n}: done at \${t()}\`);
  } catch (e) { log(\`request \${n}: ERROR \${e.code}\`); }
}));`, { sm: true, lang: 'typescript', hl: [2] }), 1.0),
  zm(psql(`prisma:info Starting a postgresql pool with 2 connections.
request 1: done at +1.51 s
request 2: done at +3.02 s
request 3: done at +1.51 s
request 4: ERROR P2024 at +2.02 s — Timed out fetching
  a new connection from the connection pool.
  (Current connection pool timeout: 2,
   connection limit: 2)
request 5: done at +3.02 s
request 6: ERROR P2024 at +2.02 s — (same)`, { sm: true, title: 'tsx prisma-14-2.mts — Prisma 5.22 → PostgreSQL 17.11', hl: [5, 10] }), 0.98), 'r46')}
${box('Read the times', 'Only <b>2</b> requests ever run at once. Two more waited 1.5 s and finished at +3.02 s; the last two would have waited 3 s, so after <b>2 s</b> the pool gave up on them.', 'lam')}` },

  { t: 'Picture the run: two lanes, one queue, one deadline', giua: true, body: `
${prismaTimeline()}
${box('What P2024 really means', 'Not “the database is down”. It means <b>your own pool</b> had no free connection for <code class="i">pool_timeout</code> seconds — usually because queries hold connections too long, or the pool is too small for the traffic.', 'lam')}` },

  { t: 'Sizing: smaller than you think', to: true, giua: true, body: `
${box('Starting formula', '<code class="i">pool_size ≈ CPU cores × 2 + effective disks</code> — on a 4-core VPS with an SSD that is about <b>9–10</b>. This is where Prisma’s default comes from.', 'lam')}
${two(box('Why not 100?', 'A connection <b>waiting</b> for a CPU or the disk does no work — it adds contention. 100 busy backends on 4 cores = more context switching and lock fights, and slower answers for everyone.', 'bad'),
  box('Queueing is a feature', 'A request that waits 3 ms for a slot and then runs in 1 ms beats 100 requests that start at once and each take 200 ms. The pool protects the database from the application.', 'xanh'))}` },

  { t: 'Then multiply, and compare with the limit', giua: true, body: `
${zm(psql(`total connections = (connecting processes) × (pool per process)

cuongthai.com:  12 × 10 = 120   >   max_connections = 100   ✗
shrink pools:   12 ×  6 =  72   <   97 − room for psql, migrate   ✓`, { title: 'the budget', sm: false }), 1.1)}
${two(box('Way out 1 — shrink the pools', 'Set <code class="i">connection_limit</code> so the product fits under 97 with headroom for your own <code class="i">psql</code>, migrations and the monitoring role.', 'xanh'),
  box('Way out 2 — a pooler in front', 'When there are many processes (or serverless), let them all connect to <b>PgBouncer</b>, which shares a few real connections among them.', 'lam'))}` },

  { t: 'PgBouncer: a pool for the pools', giua: true, body: `
${bouncerPic()}
<p style="font-size:21px;margin:0">${kw('PgBouncer', 'a tiny, single-process connection pooler that speaks the PostgreSQL protocol')} Applications connect to it exactly as if it were PostgreSQL. It keeps a handful of <b>server connections</b> and hands them to <b>client connections</b> as needed. Numbers above: a real run, next slides.</p>` },

  { t: 'Three pool modes: when is the connection returned?', giua: true, body: `
${modesPic()}
${cards([
    ['session', 'Safe: everything works as without PgBouncer. Barely multiplexes — an idle client still occupies a server connection.'],
    ['transaction', 'Returned at COMMIT/ROLLBACK. Huge ratios (hundreds of clients on 10–20 connections). <b>What almost everyone runs</b> — and what breaks session state.'],
    ['statement', 'Returned after every statement: multi-statement transactions are impossible. Rarely right.'],
  ])}` },

  { t: 'Session vs transaction: 30 idle clients (real)', giua: true, body: `
${zm(psql(`-- 30 clients: each runs SELECT 1, then SITS IDLE for 15 s (no transaction), then SELECT 2
-- pool_mode = transaction, default_pool_size = 10 — SHOW POOLS at second 8:
 database  | cl_active | cl_waiting | sv_active | sv_idle |  pool_mode
-----------+-----------+------------+-----------+---------+-------------
 bench     |        30 |          0 |         0 |       1 | transaction

-- the same 30 clients, pool_mode = session — SHOW POOLS at second 8:
 database  | cl_active | cl_waiting | sv_active | sv_idle | pool_mode
-----------+-----------+------------+-----------+---------+-------------
 bench     |        10 |         20 |        10 |       0 | session`, { sm: true, title: 'pgbouncer=# SHOW POOLS — PgBouncer 1.23.1 admin console (7 of 16 columns)', hl: [5, 10] }), 1.15)}
${two(box('transaction', 'All 30 clients connected, <b>nobody waiting</b>, and only <b>1</b> server connection was even needed — idle clients hold nothing.', 'xanh'),
  box('session', 'Only 10 clients got in; <b>20 wait</b> although the 10 lucky ones are doing nothing at all.', 'bad'))}` },

  { t: '150 clients: straight in vs through PgBouncer (real)', body: `
${zm(psql(`### straight to PostgreSQL (max_connections = 100)
$ pgbench -h 127.0.0.1 -S -c 150 -j 4 -T 10 bench
pgbench: error: connection to server … failed: FATAL:  sorry, too many clients already

### through PgBouncer 1.23.1 (pool_mode = transaction, default_pool_size = 10)
$ pgbench -h pgc14bouncer -S -c 150 -j 4 -T 10 bench
number of clients: 150
latency average = 32.606 ms
tps = 4600.337166 (without initial connection time)

pgbouncer=# SHOW POOLS;            -- during the run
 database  | cl_active | cl_waiting | sv_active | sv_idle |  pool_mode
 bench     |        21 |        129 |        10 |       0 | transaction
postgres=# SELECT backend_type, count(*) FROM pg_stat_activity
           WHERE datname = 'bench' GROUP BY 1;
 client backend |    10`, { sm: true, title: 'terminal — pgbench 17.11 (excerpt)', hl: [3, 9, 13, 16] }), 1.08)}
${box('Read it', 'Straight in, client 61 was refused. Through PgBouncer all 150 ran — on exactly <b>10</b> PostgreSQL backends; 129 clients queued <b>inside PgBouncer</b> for microseconds each.', 'xanh')}` },

  { t: 'Honest numbers: PgBouncer is not a speed-up', giua: true, body: `
${two(zm(psql(`### 10 clients, each KEEPS its connection
direct                tps = 5660.3
via PgBouncer         tps = 2519.2

### 10 clients, NEW connection per transaction (-C)
direct                tps =  156.0   avg connect 12.7 ms
via PgBouncer         tps =   61.3   avg connect 32.5 ms`, { sm: true, title: 'pgbench -S -T 10, same run as before (excerpt)', hl: [3, 7] }), 1.12),
  `<div>${box('Why slower here', 'Every query now makes <b>one more hop</b>, and PgBouncer is a <b>single process</b> doing SCRAM authentication for each new client. With only 10 well-behaved clients there is nothing to save.', 'bad')}
${box('What it is actually for', 'Admission control: hundreds of client connections (many processes, autoscaling, serverless) sharing a few real ones, and never hitting <code class="i">max_connections</code>.', 'xanh')}</div>`)}
<p style="font-size:19px;margin:0">Measured on one laptop with Docker — compare the ratios, not the absolute numbers. Real networks add latency to both paths.</p>` },

  { t: 'What transaction mode breaks (real, under load)', giua: true, body: `
${two(zm(psql(`SET statement_timeout = '1s';
SET
SHOW statement_timeout;
 0                                   ← landed on another backend
PREPARE lay(int) AS SELECT abalance FROM pgbench_accounts WHERE aid = $1;
PREPARE
EXECUTE lay(1);
ERROR:  prepared statement "lay" does not exist
SELECT pg_advisory_lock(42);
SELECT pg_advisory_unlock(42);
WARNING:  you don't own a lock of type ExclusiveLock
 f`, { sm: true, title: 'psql through PgBouncer while 30 pgbench clients run (excerpt)', hl: [4, 8, 11] }), 1.05),
  `<div>${cards([
    ['SET', 'Applies to whichever backend served it. Use <code class="i">SET LOCAL</code> inside an explicit transaction.'],
    ['PREPARE / prepared statements', 'Prepared on one backend, missing on the next.'],
    ['Session advisory lock', 'Taken on one backend, “unlocked” on another ⇒ the lock <b>leaks</b>. Use <code class="i">pg_advisory_xact_lock</code>.'],
  ], 1)}</div>`, 'r64')}` },

  { t: 'LISTEN/NOTIFY, temp tables, migrations', giua: true, body: `
${two(zm(psql(`-- another session sends after ~1.5 s:  NOTIFY kenh, 'don-hang-moi';
=== through PgBouncer (transaction) ===
LISTEN kenh;
LISTEN
SELECT pg_sleep(3);
SELECT 1 AS sau;
   1
=== straight to PostgreSQL ===
LISTEN kenh;
LISTEN
SELECT pg_sleep(3);
Asynchronous notification "kenh" with payload "don-hang-moi"
  received from server process with PID 6245.`, { sm: true, title: 'psql — PostgreSQL 17.11 / PgBouncer 1.23.1 (excerpt)', hl: [12] }), 1.0),
  `<div>${box('LISTEN is session state', 'Through transaction mode the notification simply <b>never arrives</b> — no error. Listeners need a direct connection.', 'bad')}
${box('Temp tables', '<code class="i">CREATE TEMP TABLE</code> belongs to one backend you no longer control.', '')}
${box('Migrations', 'Run <code class="i">prisma migrate</code> on a <b>direct</b> URL: long DDL and advisory locks through a pooler fail in ways that are hard to diagnose.', 'lam')}</div>`)}` },

  { t: 'Prisma behind PgBouncer: pgbouncer=true (real)', giua: true, body: `
${two(zm(psql(`URL …/bench?connection_limit=5
  200 queries: 19 ok, 181 errors
  40 × Raw query failed. Code: \`26000\`.
       Message: \`ERROR: prepared statement "s0" does not exist\`
  35 × … "s1" does not exist   35 × … "s2" does not exist
  38 × … "s3" does not exist   33 × … "s4" does not exist
URL …/bench?connection_limit=5&pgbouncer=true
  200 queries: 200 ok, 0 errors`, { sm: true, title: 'tsx prisma-14-2b.mts — 200 queries through PgBouncer (excerpt)', hl: [2, 8] }), 1.0),
  box('Why', 'Prisma prepares every query (s0, s1…) on its connection. Through transaction mode the next query lands on another backend ⇒ error 26000. <code class="i">pgbouncer=true</code> turns that off. (PgBouncer 1.21+ can track protocol-level prepared statements with <code class="i">max_prepared_statements</code>; in 1.23.1 it is <b>0 = off</b> by default.)', 'lam'))}
${zm(sql(`datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")  // through PgBouncer: …&pgbouncer=true
  directUrl = env("DIRECT_URL")    // straight to PostgreSQL: used by prisma migrate
}`, { sm: true, lang: 'typescript', hl: [3, 4] }), 1.2)}` },

  { t: 'Deciding — and the trap after you add PgBouncer', giua: true, body: `
${two(box('App pool only', 'A handful of processes and <i>processes × pool</i> fits under 97 with headroom. Simplest thing that works — do not add a component you do not need.', 'xanh'),
  box('Add PgBouncer (transaction mode)', 'Many processes, autoscaling or serverless, or pools already tuned down and still not fitting. Set <code class="i">pgbouncer=true</code>, keep a direct URL for migrations and listeners.', 'lam'))}
${box('Trap — the failure just moves', 'PgBouncer limits <b>server</b> connections, not the client connections your app opens to it. If 120 clients want 10 server connections they queue in PgBouncer: no “too many clients” in the PostgreSQL log any more, just client timeouts. Alarm on <code class="i">cl_waiting</code> / <code class="i">maxwait</code> from <code class="i">SHOW POOLS</code>, and size <code class="i">default_pool_size</code> by the CPU formula — not by client count.', 'bad')}` },

  { t: 'Exercise — with the answer', giua: true, to: true, body: `
${two(`<div>${steps([
    'Your app runs on 8 containers, 4 vCPUs each, Prisma default pool. <code class="i">max_connections = 100</code>. Fit?',
    'You put PgBouncer (transaction mode) in front. Which <code class="i">default_pool_size</code> would you start with for a 4-core database server?',
    'Which of these still work through it: <code class="i">SET search_path</code>, <code class="i">SET LOCAL</code> inside BEGIN…COMMIT, <code class="i">LISTEN</code>, <code class="i">pg_advisory_xact_lock</code>?',
  ])}</div>`,
  `<div>${box('Answer', '1) 8 × (2·4+1) = <b>72</b> ≤ 97 ✓ — but no headroom for a scale-out.<br>2) About <b>4 × 2 + 1 ≈ 9–10</b>, then measure.<br>3) Works: <b>SET LOCAL</b> in a transaction, <b>pg_advisory_xact_lock</b>. Broken: plain <b>SET</b> (slide 16: SHOW said 0) and <b>LISTEN</b> (slide 17: nothing arrived).', 'xanh')}</div>`)}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Prisma throws <b>P2024</b>. Is the database down?</li>
<li>Why does a pool of 100 on a 4-core server usually make responses slower, not faster?</li>
<li>Through PgBouncer in transaction mode, your app gets <i>prepared statement "s0" does not exist</i>. One-word fix in the URL?</li>
</ol>
${box('Answers', '1) <b>No</b> — your own pool had no free connection within pool_timeout. 2) 100 processes fight over 4 cores: context switching and contention; queueing in a small pool is faster. 3) <code class="i">pgbouncer=true</code> (and a <code class="i">directUrl</code> for migrations).', 'xanh')}` },

  { t: 'Summary & next', giua: true, body: `
<ul>
<li>A pool lends a few open connections to many requests; it queues them and gives up after <code class="i">pool_timeout</code></li>
<li>Prisma: <code class="i">connection_limit</code> (default CPUs × 2 + 1, per process) and <code class="i">pool_timeout</code> (P2024)</li>
<li>Small pools are faster; budget processes × pool under <code class="i">max_connections</code></li>
<li>PgBouncer transaction mode: 150 clients on 10 backends — not a speed-up, an admission controller</li>
<li>It breaks SET, PREPARE, session advisory locks, LISTEN, temp tables ⇒ <code class="i">pgbouncer=true</code> + direct URL</li>
</ul>
${box('Next — 14.3 VACUUM & bloat', 'The other half of operating PostgreSQL: who cleans up the dead row versions every UPDATE leaves behind, when, and what stops them.', 'lam')}` },
]);
