/**
 * pg-14-1 — PostgreSQL · Chapter 14 · Lesson 14.1 "What a connection costs" (slide EN, kiểu FU, 26/10/2026, agent c14).
 * Nguồn: content/courses/postgresql/s14-ket-noi-van-hanh.mjs › postgresql-14-1-gia-ket-noi. Output = chạy thật PostgreSQL 17.11
 * (container nháp pgc14tmp, max_connections mặc định 100): video-bai-giang/src/khung/pg/that/pg-14-1a.out.txt (ps: một tiến trình mỗi kết nối,
 * bộ nhớ /proc/<pid>/smaps_rollup) · pg-14-1b (pg_stat_activity) · pg-14-1c (SHOW + cạn kết nối: 100 / 97, FATAL thật) · pg-14-1d (node-postgres 8.13.1:
 * 6,765 vs 0,425 vs 0,442 ms — 15,9×) · pg-14-1e (pgbench -C vs không -C: 270 vs 4558 tps) · pg-14-1f (gom theo usename/application_name).
 * Bổ sung so với web: ps thật, bộ nhớ riêng mỗi backend (idle ~1,1 MB riêng · sắp xếp 256 MB ⇒ đỉnh ~308 MB), các bước của một lần connect,
 * pgbench -C, reserved_connections (PG16+), thông báo FATAL khác nhau cho superuser và role thường, serverless.
 */
import { lamDeck, sql, psql, sh, run, two, box, kw, cards, steps, vsd } from './_pg-chung.mjs';
import { waiterPic, forkPic, connectBars, slotsPic, multiplyPic, serverlessPic } from './pg-14-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-14-1', code: 'PG 14.1', title: 'What a connection costs', sub: 'one process per connection · max_connections · too many clients' };

export const slides = lamDeck({ chuong: 'Chapter 14 — Connections, pooling & operating', bai: '14.1' }, [
  { cover: true, t: 'What a connection costs', sub: 'One connection = one process, the 100-connection wall,<br>and why apps run out of connections' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>See it with <code class="i">ps</code>: PostgreSQL starts one <b>operating-system process</b> per connection</li>
<li>What a backend process costs in <b>memory</b>, measured</li>
<li>What a connection costs in <b>time</b>: new connection per query vs reuse (Node.js, pgbench)</li>
<li>Hit the <code class="i">max_connections</code> wall on purpose — and read the two error messages</li>
<li>The multiplication that exhausts connections in production, and the serverless version of it</li>
</ul>
${box('Phase 4 — In production', 'Chapters 1–13 assumed you already had a connection. From here on the topic is keeping a real database alive: connections (14.1–14.2), cleanup (14.3), monitoring (14.4).', 'lam')}` },

  { t: 'Everyday example: a waiter for every guest', giua: true, body: `
${waiterPic()}
<p style="font-size:22px;margin:0">Hiring a new waiter for each guest who walks in is slow, and you pay wages even while the guest only sits. That is exactly how PostgreSQL treats connections — which is why the rest of this chapter is about <b>sharing</b> them.</p>` },

  { t: 'One connection = one operating-system process (real)', giua: true, body: `
${two(zm(sh(`$ docker exec pgc14tmp ps -o pid,ppid,rss,cmd -u postgres
    PID    PPID   RSS CMD
      1       0 28116 postgres
     60       1  6024 postgres: checkpointer
     61       1  7336 postgres: background writer
     63       1 10308 postgres: walwriter
     64       1  9404 postgres: autovacuum launcher
     65       1  8552 postgres: logical replication launcher
   1093       1 16056 postgres: postgres shop [local] SELECT
   1101       1 16056 postgres: postgres shop [local] SELECT
   1109       1 16056 postgres: postgres shop [local] SELECT`, { sm: true, title: 'terminal — PostgreSQL 17.11 in Docker', hl: [9, 10, 11] }), 1.12),
  `<div>${box('Read it', 'Three clients (web-1, web-2, worker) are connected ⇒ <b>three extra processes</b> 1093, 1101, 1109. Their parent (PPID) is process 1 — the <b>postmaster</b>, which forked them.', 'lam')}
${box('The others', 'checkpointer, background writer, walwriter, autovacuum launcher… are PostgreSQL’s own helper processes. They exist with zero clients.', '')}</div>`, 'r64')}
<p style="font-size:20px;margin:0">The process title even shows <b>user · database · client · current command</b>. Not a thread, not a lightweight handle: a real process with its own memory.</p>` },

  { t: 'Picture it: the postmaster forks a backend per client', giua: true, body: `
${forkPic()}
<p style="font-size:21px;margin:0">Every backend shares the big data cache (<code class="i">shared_buffers</code>) but has its <b>own private memory</b> for sorting, hashing and caches. Name to remember: ${kw('backend', 'the server process serving ONE connection')}</p>` },

  { t: 'Why a process, not a thread?', to: true, giua: true, body: `
${cards([
    ['✓ Isolation', 'A backend that crashes or leaks memory cannot corrupt the others; the postmaster cleans up and the rest keep running.'],
    ['✓ Simplicity', 'Designed in the 1980s for Unix, where fork() was the portable way to run work in parallel. Each backend is single-threaded code.'],
    ['✗ The bill', 'Starting a process is slow, every process costs memory, and hundreds of them fight over the same CPU cores.'],
  ])}
${two(box('Still true in 17', 'Moving PostgreSQL to threads has been discussed by its developers since 2023, but every released version — 17 included — runs <b>one process per connection</b>. (MySQL, by contrast, uses one <i>thread</i> per connection.)', ''),
  box('Consequence for you', 'Connections are a <b>scarce, expensive resource</b>. Applications must not open one per request — they borrow from a pool (14.2).', 'lam'))}` },

  { t: 'What a backend costs in memory (measured)', giua: true, body: `
${two(zm(psql(`$ grep -E '^(Rss|Pss|Private_Dirty)' /proc/1093/smaps_rollup
Rss:               16056 kB      # backend web-1, idle
Pss:                3797 kB
Private_Dirty:      1088 kB

-- session 'bao-cao': SET work_mem = '256MB';
-- sort 3,000,000 rows ORDER BY random()
peak Private_Dirty while sorting :  315436 kB  (~308 MB)
after the sort (sleeping)        :   11152 kB`, { sm: true, title: 'terminal — /proc of the backend process (excerpt)', hl: [4, 8] }), 1.12),
  `<div>${box('Idle: cheap-ish', 'RSS 16 MB looks big, but most of it is <b>shared</b>. The memory really owned by an idle backend is about <b>1 MB</b>; its fair share (Pss) ~4 MB.', 'xanh')}
${box('Busy: can be huge', 'A big sort or hash may use up to <code class="i">work_mem</code> <b>per operation</b>. Here one session reached ~308 MB, then gave most of it back.', 'bad')}</div>`)}
<p style="font-size:20px;margin:0">So the danger is not 100 idle connections — it is 100 <b>busy</b> ones, each allowed several × <code class="i">work_mem</code>.</p>` },

  { t: 'What a connection costs in time (Node.js, real)', giua: true, body: `
${two(zm(sql(`// A. a NEW connection for every query
for (let i = 0; i < 50; i++) {
  const c = new pg.Client(CFG);
  await c.connect();
  await c.query('SELECT 1');
  await c.end();
}
// B. ONE connection, reused 50 times
// C. pg.Pool({ max: 10 }), 50 × pool.query()`, { sm: true, lang: 'javascript', hl: [3, 4] }), 1.0),
  zm(psql(`A. new connection per query :   338.25 ms for 50 → 6.765 ms/query
B. one connection, reused   :    21.27 ms for 50 → 0.425 ms/query
C. pool (max 10)            :    22.09 ms for 50 → 0.442 ms/query

→ opening a new connection costs 15.9× a reused one`, { sm: true, title: 'node k14-1-do.mjs — node-postgres 8.13.1 → PostgreSQL 17.11', hl: [1, 5] }), 1.08), 'r46')}
${connectBars({ rh: 42 })}` },

  { t: 'Where do the 7 milliseconds go?', to: true, giua: true, body: `
${steps([
    '<b>TCP handshake</b> with the server (plus a <b>TLS</b> handshake over a real network).',
    '<b>Authentication</b>: SCRAM-SHA-256 (the PostgreSQL 14+ default) — deliberately slow hashing, thousands of rounds.',
    'The postmaster calls <b>fork()</b>: a new backend process is created.',
    'The backend <b>initialises</b>: attaches shared memory, loads the system catalogs it needs, applies settings.',
    'Only now does <code class="i">SELECT 1</code> run — in about <b>0.4 ms</b>.',
  ])}
${box('Read the numbers', 'Setup was ~94% of line A’s time (6.765 vs 0.425 ms) — on the same machine, no real network. Reuse (B) or a pool (C) pays it once. The pool costs almost nothing extra and lets many requests run at once: <b>the whole case for pooling in one measurement</b>.', 'xanh')}` },

  { t: 'The same with pgbench: -C opens a connection per transaction', giua: true, body: `
${zm(psql(`$ pgbench -h 127.0.0.1 -S -c 10 -j 2 -T 10 bench        # each client KEEPS its connection
number of transactions actually processed: 45441
latency average = 2.194 ms
tps = 4558.115750 (without initial connection time)

$ pgbench -h 127.0.0.1 -S -c 10 -j 2 -T 10 -C bench     # -C = NEW connection per transaction
number of transactions actually processed: 2710
latency average = 36.967 ms
average connection time = 7.265 ms
tps = 270.513482 (including reconnection times)`, { sm: true, title: 'terminal — pgbench 17.11, select-only, 10 clients, 10 s (excerpt)', hl: [4, 10] }), 1.18)}
${two(box('Same server, same query', 'Only one flag changed. Throughput fell from <b>4,558</b> to <b>270</b> transactions per second — about <b>17× fewer</b>.', 'bad'),
  box('pgbench', 'PostgreSQL’s own benchmark tool (ships with the server). <code class="i">-S</code> = read-only test, <code class="i">-c</code> clients, <code class="i">-T</code> seconds. You will use it again in 14.2.', 'lam'))}` },

  { t: 'The wall: max_connections', giua: true, body: `
${two(zm(psql(`shop=# SHOW max_connections;
 max_connections
-----------------
 100
(1 row)

shop=# SHOW superuser_reserved_connections;
 superuser_reserved_connections
--------------------------------
 3
(1 row)

shop=# SHOW reserved_connections;
 reserved_connections
----------------------
 0
(1 row)`, { sm: true, title: 'psql (17.11) — shop', hl: [4, 10, 16] }), 0.98),
  `<div>${cards([
    ['max_connections = 100', 'The default — and what cuongthai.com runs in production. Changing it needs a <b>restart</b>.'],
    ['superuser_reserved = 3', 'Of those 100, three are kept back so a superuser can still log in when everything else is full.'],
    ['reserved_connections = 0', 'New in PostgreSQL 16: slots for roles granted <code class="i">pg_use_reserved_connections</code> (e.g. a monitoring role).'],
  ], 1)}</div>`, 'r46')}` },

  { t: 'Hit the wall on purpose (real)', body: `
${zm(psql(`$ node k14-1-tuong.mjs postgres      # superuser: open connections in a loop
[postgres] opened 100 connections before failing
ERROR 53300: sorry, too many clients already
$ psql -U postgres -d shop
psql: error: … failed: FATAL:  sorry, too many clients already

$ node k14-1-tuong.mjs app           # the same loop as an ordinary role
[app] opened 97 connections before failing
ERROR 53300: remaining connection slots are reserved for roles with the SUPERUSER attribute
$ psql -U postgres -d shop           # while app holds 97, the admin still gets in
 in_use | max
--------+-----
     98 | 100`, { sm: true, title: 'terminal — PostgreSQL 17.11, max_connections = 100 (excerpt)', hl: [3, 5, 9, 13] }), 1.2)}
${two(box('Two messages, one cause', '<code class="i">too many clients already</code> = all 100 used. <code class="i">remaining connection slots are reserved…</code> = an app role hit 97. Both are SQLSTATE <b>53300</b>.', 'bad'),
  box('It does not degrade gracefully', 'Every new request fails instantly — including the one you wanted to use to investigate. That is what the 3 reserved slots are for.', 'lam'))}` },

  { t: 'Picture it: 100 slots, 3 kept for the admin', giua: true, body: `
${slotsPic()}
<p style="font-size:21px;margin:0">Connect your application with a <b>normal role</b>, never as <code class="i">postgres</code>: then the app stops at 97 and the reserve stays free for you. An app that logs in as superuser can eat the reserve too — and lock you out of your own server.</p>` },

  { t: 'The arithmetic that exhausts connections', giua: true, body: `
${multiplyPic()}
${steps([
    'A pool size is <b>per process</b> — pool 10 in two containers is 20 connections.',
    'Count <b>every</b> process that connects: web containers, workers, cron jobs, the migration runner, your own psql, a metrics exporter.',
    'Multiply, then compare with 97. cuongthai.com’s own case (Chapter 0): <b>12 × 10 = 120 &gt; 100</b>.',
  ])}` },

  { t: 'Why it never shows up in testing', to: true, giua: true, body: `
${box('Invisible until it is total', 'At normal load the pools sit half-empty and 120 &gt; 100 hurts nobody — rarely are all 12 processes busy at once. The first traffic spike that makes them all busy makes connection 98 fail.', 'bad')}
${box('Then it gets worse by itself', 'A failing health check restarts a container ⇒ the new container opens a fresh pool ⇒ more connection attempts ⇒ more failures. The system drives itself further into the wall.', 'bad')}
${box('What to do instead', 'Do the multiplication on paper <b>before</b> you scale out, keep headroom (aim ≤ 80% of 97), and alarm on connections in use (14.4).', 'xanh')}` },

  { t: 'Who is holding the connections? (real)', giua: true, body: `
${two(zm(run(`SELECT usename, application_name, state, count(*)
FROM pg_stat_activity
WHERE backend_type = 'client backend'
GROUP BY 1, 2, 3 ORDER BY count(*) DESC;`, ` usename  | application_name | state  | count
----------+------------------+--------+-------
 app      | web              | active |     3
 app      | worker           | active |     1
 postgres | cron-bao-cao     | active |     1
 postgres | psql             | active |     1
(4 rows)`, { hlOut: [3], title: 'psql (17.11) — shop' }), 1.1),
  `<div>${box('Set application_name', 'Give every service a name in its connection string (<code class="i">?application_name=web</code>). Then this query tells you <b>who</b> holds the slots. Very often it is a service nobody remembered was still connected.', 'lam')}
${box('Filter backend_type', 'Unfiltered, <code class="i">count(*)</code> from <code class="i">pg_stat_activity</code> said <b>11</b> — it also lists the 5 helper processes. Count only <code class="i">client backend</code> rows.', '')}</div>`)}` },

  { t: 'Trap: “fix” it by raising max_connections', giua: true, body: `
${zm(vsd(`<p style="margin:0 0 6px;font-size:20px"><code class="i">max_connections = 500</code> on the CuongThai database container:</p>
${sql(`# docker-compose.yml (CuongThai, real values)
#   container memory limit: 2 GB
#   shared_buffers = 512MB · work_mem = 12MB
500 busy backends × 12 MB × 2 sorts ≈ 12 GB`, { sm: true, lang: 'bash' })}
<p style="margin:6px 0 0;font-size:19px">A clean “too many clients” error becomes the Linux <b>OOM killer</b> killing PostgreSQL — the whole database goes down. And beyond a few hundred backends throughput <b>falls</b>: more processes fighting for the same cores.</p>`,
  `<ul style="font-size:21px">
<li>Keep <code class="i">max_connections</code> modest (100–300)</li>
<li><b>Pool</b> in the app, sized to what the server can serve (14.2)</li>
<li>Shrink pools so <i>processes × pool</i> fits with headroom</li>
<li>Many processes or serverless ⇒ <b>PgBouncer</b> in front (14.2)</li>
<li>Connect apps with a normal role, keep the reserve for admins</li>
</ul>`), 1.14)}` },

  { t: 'Serverless: the same problem, multiplied', giua: true, body: `
${serverlessPic()}
<p style="font-size:20px;margin:0">Each serverless instance (Vercel, AWS Lambda…) is its own process with its own connection, and a traffic spike starts hundreds of them — each paying the ~7 ms connect cost on a cold start. The standard answers: a <b>pooler</b> in front (PgBouncer, or the one your host provides such as Supabase/Neon), <code class="i">connection_limit=1</code> per instance, or an HTTP-based driver.</p>` },

  { t: 'Exercise — with the answer', giua: true, to: true, body: `
${two(`<div>${steps([
    'A VPS with 4 vCPUs runs PostgreSQL with <code class="i">max_connections = 100</code>.',
    'You run 3 web containers + 1 worker, all with Prisma’s default pool (<code class="i">2 × cores + 1</code>), plus 1 cron job and 1 metrics exporter (1 connection each). Do you fit?',
    'Marketing wants 10 web containers for a sale. Still fine?',
  ])}</div>`,
  `<div>${box('Answer', 'Default pool = 2 × 4 + 1 = <b>9</b>.<br>Today: (3 + 1) × 9 + 2 = <b>38</b> ≤ 97 ✓ — headroom.<br>Sale: (10 + 1) × 9 + 2 = <b>101</b> &gt; 97 ✗ — the sale day fails with error 53300.', 'xanh')}
${box('Fix', 'Set <code class="i">connection_limit=6</code> ⇒ 11 × 6 + 2 = 68 ✓, or put PgBouncer in front (next lesson). Check it live with the grouped <code class="i">pg_stat_activity</code> query.', 'lam')}</div>`)}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Three apps are connected. How many extra operating-system processes does the server run, and who started them?</li>
<li>An app role gets <i>“remaining connection slots are reserved for roles with the SUPERUSER attribute”</i>. How many connections are in use, roughly?</li>
<li>Why is raising <code class="i">max_connections</code> to 1,000 a bad fix for that error?</li>
</ol>
${box('Answers', '1) <b>Three</b> backends, forked by the postmaster. 2) About <b>97</b> — the normal slots are full; only the 3 superuser slots remain. 3) Every busy backend may use several × work_mem ⇒ <b>out of memory</b>, and more processes than cores makes throughput drop. Pool instead.', 'xanh')}` },

  { t: 'Summary & next', to: true, giua: true, body: `
<ul>
<li>One connection = one <b>process</b> forked by the postmaster; idle ~1 MB private, busy up to several × work_mem</li>
<li>Opening a connection cost ~6.8 ms vs ~0.4 ms per query when reused (15.9×); pgbench -C: 270 vs 4,558 tps</li>
<li><code class="i">max_connections</code> = 100, 3 reserved for superusers ⇒ error 53300 at 100 / 97</li>
<li>Exhaustion comes from multiplication: processes × pool size</li>
<li>Do not raise the limit — pool, size pools, and use PgBouncer when there are many processes</li>
</ul>
${box('Next — 14.2 Pooling', 'How big should a pool be (smaller than you think), Prisma’s pool settings, and PgBouncer — run for real — with exactly what its transaction mode breaks.', 'lam')}` },
]);
