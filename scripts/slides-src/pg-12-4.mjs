/**
 * pg-12-4 — PostgreSQL · Chapter 12 · Lesson 12.4 "Materialized views: trading freshness for speed" (slide EN, kiểu FU, 26/10/2026, agent c12).
 * Nguồn: content/courses/postgresql/s12-ham-trigger-view.mjs › postgresql-12-4-materialized-view. Output = chạy thật PostgreSQL 17.11 (container pgcourse17,
 * schema ch12): video-bai-giang/src/khung/pg/that/pg-12-4.sql + pg-12-4.out.txt (psql -X -a) + pg-12-4.prisma.txt (Prisma 5.22: $queryRaw / $executeRaw, db pull).
 * Bổ sung so với web: máy ảnh (đời thường), MV 8192 bytes vs view 0, 1 triệu dòng sự kiện (view 49,7 ms · MV 0,023 ms; top-5: 205 ms vs 0,047 ms; tập nhỏ chỉ 2,3×),
 * MV có chỉ mục riêng, khoá AccessExclusiveLock vs ExclusiveLock (pg_locks), CONCURRENTLY cần UNIQUE index + thời gian làm mới thật, WITH NO DATA (has not been populated),
 * cột refreshed_at, pg_cron KHÔNG có trong container (0 rows) ⇒ cron.service.ts của CuongThai (node-cron), Prisma db pull KHÔNG introspect MV, bảng xếp hạng top-5.
 * Số 17.11 thay các số cũ 4416/2416 của bài web (khối output thay nguyên).
 */
import { lamDeck, sql, psql, run, tbl, two, box, kw, cards, steps, vsd } from './_pg-chung.mjs';
import { XANH, DO, CAM, PG, mayAnhPic, khoaPic, tuoiPic, thanhPic } from './pg-12-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-12-4', code: 'PG 12.4', title: 'Materialized views: trading freshness for speed', sub: 'REFRESH · CONCURRENTLY · unique index · scheduling' };

export const slides = lamDeck({ chuong: 'Chapter 12 — Functions, triggers & views', bai: '12.4' }, [
  { cover: true, t: 'Materialized views:<br>a photograph you refresh', sub: 'speed for freshness — REFRESH, CONCURRENTLY,<br>unique indexes and a refresh schedule' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>materialized view</b> stores — and why it is fast <b>and</b> stale</li>
<li>Measure the gain: <b>1,000,000 rows</b> read in 49.7 ms vs 0.023 ms</li>
<li><code class="i">REFRESH</code>: the lock it takes, and <code class="i">CONCURRENTLY</code> with its <b>unique index</b></li>
<li>Indexes on a matview, <code class="i">WITH NO DATA</code>, a <b>refreshed_at</b> column</li>
<li>The trap: <b>never scheduling</b> the refresh — and the options to schedule it</li>
</ul>
${box('Remember from 12.3', 'A view re-runs its query <b>every time</b>. When that query is <b>expensive</b> and a slightly old answer is fine, we store the answer instead.', 'lam')}` },

  { t: 'Everyday example first: a photograph', giua: true, body: `
${mayAnhPic()}` },

  { t: 'CREATE MATERIALIZED VIEW: run now, keep the rows', giua: true, body: `
${two(zm(sql(`CREATE MATERIALIZED VIEW note_summary_mv AS
  SELECT u.id AS user_id, u.email,
         count(n.id) AS so_note,
         coalesce(sum(n.views),0) AS tong_views
  FROM users u LEFT JOIN notes n
       ON n.user_id = u.id
  GROUP BY u.id, u.email;`, { sm: true, hl: [1] }), 1.1),
  zm(psql(`SELECT 20
   relname       | relkind | size_on_disk
-----------------+---------+--------------
 note_summary    | v       | 0 bytes
 note_summary_mv | m       | 8192 bytes

 matviewname   | ispopulated
-----------------+-------------
 note_summary_mv | t`, { sm: true, hl: [1, 5, 6] }), 1.12))}
<p style="font-size:21px;margin:0">Look at the <b>command tag</b>: <code class="i">SELECT 20</code> — the query ran <b>now</b> and stored 20 rows. A plain <code class="i">CREATE VIEW</code> prints <code class="i">CREATE VIEW</code> and stores nothing. Here <code class="i">relkind = 'm'</code> and the data takes disk space like a table.</p>` },

  { t: 'View vs materialized view', giua: true, body: `
<div style="zoom:1.28"><table class="t">
<tr><th></th><th>View</th><th>Materialized view</th></tr>
<tr><td>Stores</td><td>a <b>query</b> (0 bytes)</td><td>the <b>rows</b> the query produced</td></tr>
<tr><td>Freshness</td><td>always current</td><td><b>stale</b> until <code class="i">REFRESH</code></td></tr>
<tr><td>Read cost</td><td>the full query, <b>every time</b></td><td>like reading a table</td></tr>
<tr><td>Own indexes</td><td>no (indexes live on the base tables)</td><td><b>yes</b> — it is a real relation</td></tr>
<tr><td>Writable</td><td>sometimes (simple views)</td><td>never — only <code class="i">REFRESH</code></td></tr>
<tr><td>Best for</td><td>naming a query, hiding columns</td><td>expensive aggregates, dashboards, leaderboards</td></tr>
</table></div>` },

  { t: 'Watch it go stale', giua: true, body: `
${two(zm(run(`INSERT INTO notes (user_id, title, body, views)
VALUES (1, 'Note moi', 'x', 2000);

SELECT 'view' AS loai, tong_views
FROM note_summary WHERE user_id=1
UNION ALL
SELECT 'matview', tong_views
FROM note_summary_mv WHERE user_id=1;`, `  loai   | tong_views
---------+------------
 view    |       3433
 matview |       1433
(2 rows)`, { sm: true, hlOut: [3, 4] }), 1.15),
  `<div>${box('Not a bug — the deal', 'The <b>view</b> shows the present (3433). The <b>matview</b> still shows the answer from <b>before</b> the INSERT (1433). You chose speed; the price is <b>age</b>.', 'do2')}
${box('Who notices?', 'A dashboard says “user 1: 1433 views” while the real number is 3433. Nothing warns the reader — a stale number <b>looks exactly like</b> a fresh one.', 'lam')}</div>`)}` },

  { t: 'REFRESH: take a new photograph', giua: true, body: `
${two(zm(run(`REFRESH MATERIALIZED VIEW note_summary_mv;

SELECT tong_views
FROM note_summary_mv WHERE user_id=1;`, `REFRESH MATERIALIZED VIEW
 tong_views
------------
       3433
(1 row)`, { sm: true, hlOut: [3] }), 1.2),
  `<div>${steps([
    'Re-run the <b>whole</b> defining query on the <b>current</b> data.',
    'Replace the stored rows with the new answer (a full rewrite).',
    'Until it finishes the <b>old photo</b> is what you read — then the new one.',
  ])}
${box('Plain REFRESH rebuilds everything', 'It does not “patch” changed rows: on a big matview it rewrites all of it — and takes a heavy lock (see slide 10).', 'lam')}</div>`)}` },

  { t: 'What you buy: 1,000,000 rows vs 300', body: `
${thanhPic([['view  (re-run query)', 49.7, DO, 'th-a'], ['matview (stored rows)', 0.023, XANH, 'th-b']], { titleTxt: 'SELECT … WHERE ngay = … on 1,000,000 events — EXPLAIN ANALYZE, ms', max: 52, unit: 'ms' })}
${two(zm(psql(`-- view: scans all 1,000,000 rows
 GroupAggregate (actual rows=1 loops=1)
   ->  Seq Scan on ev (actual rows=3334)
         Rows Removed by Filter: 996666
 Execution Time: 49.685 ms`, { sm: true, hl: [3, 5] }), 1.12),
  zm(psql(`-- matview: scans 300 stored rows
 Seq Scan on doanh_thu_ngay_mv (rows=1)
   Rows Removed by Filter: 299
 Execution Time: 0.023 ms
-- top 5 by total: 205.2 ms vs 0.047 ms`, { sm: true, hl: [3, 4] }), 1.12))}
<p style="font-size:19px;margin:0">On the <b>tiny</b> 20-user data from the web page the gap is only <b>0.133 ms vs 0.058 ms</b> (≈ 2×). The advantage <b>grows with the work avoided</b> — measure your case; do not adopt a matview on faith.</p>` },

  { t: 'A matview can have its own indexes', giua: true, body: `
${two(zm(sql(`CREATE MATERIALIZED VIEW ev_user_mv AS
  SELECT user_id, count(*) AS so_don,
         sum(tien) AS tong
  FROM ev GROUP BY user_id;

CREATE UNIQUE INDEX ON ev_user_mv (user_id);
CREATE INDEX ON ev_user_mv (tong DESC);`, { sm: true, hl: [6, 7] }), 1.15),
  zm(psql(`EXPLAIN SELECT * FROM ev_user_mv
  WHERE user_id = 42;
 Index Scan using ev_user_mv_user_id_idx
   on ev_user_mv
   Index Cond: (user_id = 42)

EXPLAIN SELECT * FROM ev_user_mv
  ORDER BY tong DESC LIMIT 3;
 Limit
   ->  Index Scan using ev_user_mv_tong_idx`, { sm: true, hl: [3, 4, 10] }), 1.15))}
<p style="font-size:21px;margin:0">A plain view cannot be indexed — it is not stored. A <b>matview</b> is a real relation, so <b>point lookups</b> and <b>top-N</b> queries on the stored result become index scans. (And the unique index is needed for <code class="i">CONCURRENTLY</code>.)</p>` },

  { t: 'REFRESH takes a heavy lock', body: `
${khoaPic()}
${two(zm(psql(`BEGIN;
REFRESH MATERIALIZED VIEW doanh_thu_ngay_mv;
SELECT mode, granted FROM pg_locks WHERE relation = …;
        mode
---------------------
 ShareLock
 ExclusiveLock
 AccessExclusiveLock   ← blocks even SELECT`, { sm: true, hl: [7] }), 1.0),
  zm(psql(`BEGIN;
REFRESH MATERIALIZED VIEW CONCURRENTLY doanh_thu_ngay_mv;
SELECT mode, granted FROM pg_locks WHERE relation = …;
       mode
------------------
 AccessShareLock
 ExclusiveLock         ← readers still allowed
 RowExclusiveLock`, { sm: true, hl: [7] }), 1.0))}` },

  { t: 'CONCURRENTLY needs a UNIQUE index', body: `
${two(zm(run(`REFRESH MATERIALIZED VIEW CONCURRENTLY mv_khong_idx;`, `ERROR:  cannot refresh materialized view
        "ch12.mv_khong_idx" concurrently
HINT:  Create a unique index with no WHERE
       clause on one or more columns of the
       materialized view.`, { sm: true, hlOut: [1, 3] }), 1.0),
  zm(run(`CREATE UNIQUE INDEX ON mv_khong_idx (user_id);
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_khong_idx;`, `CREATE INDEX
REFRESH MATERIALIZED VIEW`, { sm: true, hlOut: [2] }), 1.05))}
${box('Why the unique index?', 'CONCURRENTLY builds the new result in a temporary table, then <b>compares</b> it with the old rows — it needs a <b>unique key</b> to match old row ↔ new row, and applies only the <b>differences</b> (inserts, updates, deletes). Readers keep using the old rows meanwhile.', 'lam')}
<p style="font-size:20px;margin:0">The hint is exact: a unique index <b>with no WHERE clause</b>. The matview must also already be <b>populated</b>.</p>` },

  { t: 'What does CONCURRENTLY cost?', body: `
${two(zm(psql(`\\timing on
REFRESH MATERIALIZED VIEW doanh_thu_ngay_mv;
Time: 48.803 ms
REFRESH MATERIALIZED VIEW doanh_thu_ngay_mv;
Time: 102.986 ms
REFRESH MATERIALIZED VIEW CONCURRENTLY doanh_thu_ngay_mv;
Time: 80.997 ms
REFRESH MATERIALIZED VIEW CONCURRENTLY doanh_thu_ngay_mv;
Time: 66.570 ms`, { sm: true }), 1.1),
  `<div>${box('Honest reading', 'On 300 stored rows both finish in <b>tens of milliseconds</b> and the numbers jitter run to run — the timing difference is not the point here.', 'lam')}
${box('The point is the LOCK', 'Plain REFRESH is quicker on paper but <b>blocks readers</b>; CONCURRENTLY does more work (diff + temp table, more I/O) yet <b>readers never wait</b>. On a big matview in production, readers not waiting is what matters.', 'ok')}</div>`)}
<p style="font-size:19px;margin:0">Rule: plain <code class="i">REFRESH</code> for quiet times or tiny matviews; <code class="i">CONCURRENTLY</code> whenever people are reading — which, for a dashboard, is always.</p>` },

  { t: 'WITH NO DATA: create now, fill later', body: `
${two(zm(sql(`CREATE MATERIALIZED VIEW mv_rong AS
  SELECT * FROM note_summary
WITH NO DATA;

SELECT count(*) FROM mv_rong;

REFRESH MATERIALIZED VIEW mv_rong;
SELECT count(*) AS dong FROM mv_rong;`, { sm: true, hl: [3] }), 1.05),
  zm(psql(` matviewname | ispopulated
-------------+-------------
 mv_rong     | f

ERROR:  materialized view "mv_rong" has not
        been populated
HINT:  Use the REFRESH MATERIALIZED VIEW
       command.

 dong
------
   20`, { sm: true, hl: [3, 5] }), 1.05))}
<p style="font-size:21px;margin:0"><code class="i">WITH NO DATA</code> creates the <b>structure only</b> — handy in a migration so a slow query does not hold up the deploy. Reading it before the first refresh is an <b>error</b>, not an empty table: PostgreSQL would rather refuse than show nothing as if it were the truth.</p>` },

  { t: 'Show the age: a refreshed_at column', body: `
${tuoiPic()}
${two(zm(sql(`CREATE MATERIALIZED VIEW note_summary_ts AS
  SELECT user_id, email, so_note,
         tong_views,
         now() AS refreshed_at
  FROM note_summary;`, { sm: true, hl: [5] }), 1.0),
  zm(psql(`SELECT user_id, tong_views, refreshed_at …
       1 |       3433 | 2026-10-26 01:24:44.13+07
-- INSERT a note, then REFRESH
       1 |       3434 | 2026-10-26 01:24:45.25+07`, { sm: true, hl: [2, 4] }), 1.05))}
<p style="font-size:20px;margin:0"><code class="i">now()</code> inside the defining query is frozen at refresh time, so every row carries <b>when the photo was taken</b>. Show it next to the number: an old figure then <b>looks old</b>, instead of passing for a business trend.</p>` },

  { t: 'Who runs the REFRESH? Pick a scheduler', body: `
${cards([
    ['pg_cron (extension)', 'Runs SQL inside the database on a cron schedule: <code class="i">cron.schedule(\'*/15 * * * *\', $$REFRESH …$$)</code>. <b>Not installed</b> in our container (<code class="i">pg_available_extensions</code> → 0 rows) — on managed hosts it is often available.'],
    ['An app job (node-cron)', 'CuongThai already has <code class="i">src/services/cron.service.ts</code> with <code class="i">cron.schedule(\'17 * * * *\', …)</code>. Add one line that runs <code class="i">REFRESH … CONCURRENTLY</code> via <code class="i">$executeRaw</code>.'],
    ['OS cron / systemd timer', '<code class="i">psql -c "REFRESH MATERIALIZED VIEW CONCURRENTLY …"</code> from the host — simple and independent of the app.'],
  ])}
${box('Ship the schedule WITH the matview', 'Create the refresh job in the <b>same change</b> as the <code class="i">CREATE MATERIALIZED VIEW</code>. A matview has no expiry date, no background worker, no warning — if nobody schedules it, it serves the numbers of the afternoon you built it, for <b>months</b>. Never refresh in a <b>trigger</b> on every write: that re-runs the whole query per row.', 'do2')}` },

  { t: 'View, matview or summary table?', body: `
<div style="zoom:1.1"><table class="t">
<tr><th>You need…</th><th>Choose</th><th>Cost</th></tr>
<tr><td>a name for a query you repeat</td><td><b>View</b></td><td>none to store; full query per read</td></tr>
<tr><td>hide columns / rows, safe slice</td><td><b>View</b> (+ roles)</td><td>none</td></tr>
<tr><td>an <b>expensive</b> aggregate, an <b>hour-old</b> answer is OK</td><td><b>Materialized view</b></td><td>disk + a <b>scheduled</b> refresh</td></tr>
<tr><td>fresh <b>and</b> fast, you measured the other two are not enough</td><td><b>Summary table + AFTER trigger</b> (12.2)</td><td>slower writes, more code</td></tr>
</table></div>
${box('Start simple', 'Begin with a <b>view</b>. If <code class="i">EXPLAIN ANALYZE</code> shows the query is too slow <b>and</b> the answer may be a little old, move to a matview. Add triggers only when both fail.', 'ok')}` },

  { t: 'Coming from SQL Server? Indexed view vs matview', body: `
<div style="zoom:1.1"><table class="t">
<tr><th>Idea</th><th>SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Stored query result</td><td><b>indexed view</b> (<code class="i">WITH SCHEMABINDING</code> + unique clustered index)</td><td><b>materialized view</b></td></tr>
<tr><td>Freshness</td><td>maintained <b>automatically</b> on every write</td><td>a <b>snapshot</b>: stale until <code class="i">REFRESH</code></td></tr>
<tr><td>Restrictions</td><td>strict (no outer joins, limited aggregates…)</td><td>any query, even window functions</td></tr>
<tr><td>Cost on writes</td><td>every INSERT/UPDATE pays to update the view</td><td>writes unaffected; the refresh pays</td></tr>
<tr><td>Who refreshes?</td><td>the engine</td><td><b>you</b> (cron / job)</td></tr>
</table></div>
${box('Mental switch', 'In SQL Server freshness is free but writes are slower and the query is restricted. In PostgreSQL the query is free-form and writes are fast — <b>freshness is your job</b>.', 'lam')}` },

  { t: 'In a real project: CuongThai + Prisma', body: `
${two(`<div>${sql(`// read a matview, refresh it — Prisma 5.22
const top = await prisma.$queryRaw\`
  SELECT hang, user_id, tong_views
  FROM top_user_mv ORDER BY hang LIMIT 3\`;

await prisma.$executeRawUnsafe(
  'REFRESH MATERIALIZED VIEW CONCURRENTLY top_user_mv');`, { sm: true, lang: 'typescript', hl: [6] })}
${zm(psql(`before: 1 → user 8 (6225) · 2 → user 1 · 3 → user 11
 -- UPDATE a note of user 20 (+10000), then:
after : 1 → user 20 (11417) · 2 → user 8 · 3 → user 1`, { sm: true, hl: [3] }), 1.0)}</div>`,
    `<div>${box('Prisma sees views, not matviews', 'With <code class="i">previewFeatures = ["views"]</code>, <code class="i">prisma db pull</code> introspected the ordinary views (as <code class="i">@@ignore</code> without a unique id) but <b>no materialized view</b> — all of ours were missing. Use <code class="i">$queryRaw</code> to read and <code class="i">$executeRaw</code> to refresh.', 'lam')}
${box('A real finding', 'CuongThai has <b>no materialized view</b> today (no <code class="i">CREATE MATERIALIZED VIEW</code> in <code class="i">prisma/migrations</code>) — but it already has the scheduler: <code class="i">node-cron</code> in <code class="i">cron.service.ts</code>.', 'ok')}</div>`)}` },

  { t: 'Your turn: a top-5 leaderboard', body: `
<p style="font-size:21px;margin:0">Build <code class="i">top_user_mv</code>: the <b>5 users with the most views</b>, with a <b>rank</b>. Make it refreshable <b>without blocking readers</b>. Then change the data and prove it is stale until refreshed.</p>
${two(zm(sql(`CREATE MATERIALIZED VIEW top_user_mv AS
  SELECT user_id, email, tong_views,
    rank() OVER (ORDER BY tong_views DESC) AS hang
  FROM note_summary
  ORDER BY tong_views DESC LIMIT 5;

CREATE UNIQUE INDEX ON top_user_mv (user_id);

UPDATE notes SET views = views + 5000
 WHERE id = 7;     -- note of user 8
REFRESH MATERIALIZED VIEW CONCURRENTLY top_user_mv;`, { sm: true, hl: [7, 11] }), 0.95),
  zm(psql(`hang | user_id | tong_views     (before)
 1 |    1 |   3434
 2 |   11 |   1475
 3 |   20 |   1417

hang | user_id | tong_views     (after UPDATE,
 1 |    1 |   3434          still stale)
 2 |   11 |   1475

hang | user_id | tong_views     (after REFRESH)
 1 |    8 |   6225
 2 |    1 |   3434`, { sm: true, hl: [11, 12] }), 1.0))}
<p style="font-size:19px;margin:0">The unique index on <code class="i">user_id</code> unlocks <code class="i">CONCURRENTLY</code>. After the UPDATE the board still shows the old order; only the refresh brings user 8 to rank 1.</p>` },

  { t: 'Self-check', to: true, giua: true, body: `
<ol>
<li>Why does <code class="i">REFRESH MATERIALIZED VIEW CONCURRENTLY</code> fail on a matview without any index — and what exactly must you create?</li>
<li>A plain <code class="i">REFRESH</code> runs at 12:00 on a busy website. What do readers experience, and which lock mode explains it?</li>
<li>Your dashboard shows a matview and nobody scheduled the refresh. What can you add so readers can <b>see</b> the age?</li>
</ol>
${box('Answers', '1) It needs a <b>unique index with no WHERE clause</b> to match old and new rows (the HINT says so). 2) They <b>wait</b> — plain REFRESH takes <b>AccessExclusiveLock</b>, which blocks even SELECT. 3) A <code class="i">now() AS refreshed_at</code> column in the defining query — and a scheduler (pg_cron, app job or OS cron).', 'ok')}` },

  { t: 'Summary — and what comes next', to: true, giua: true, body: `
<ul>
<li><b>Materialized view</b> = the <b>rows</b> of a query, stored: fast to read, can be indexed — and <b>stale</b> until <code class="i">REFRESH</code>.</li>
<li>Measure first: the gain grows with the work avoided (49.7 ms → 0.023 ms on 1M rows; barely 2× on tiny data).</li>
<li><b>REFRESH CONCURRENTLY</b> + <b>unique index</b> = readers never blocked. <code class="i">WITH NO DATA</code> for a quick create.</li>
<li><b>Always schedule it</b> in the same change, and show <code class="i">refreshed_at</code> to readers.</li>
</ul>
${box('Next: Lab 6 — triggers & views for CT Shop', 'You now have functions, triggers, views and matviews. The lab puts them to work on the shop: stock rules, an audit log and a sales dashboard.', 'lam')}` },
]);
