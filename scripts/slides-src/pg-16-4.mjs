/**
 * pg-16-4 — PostgreSQL · Chapter 16 · Lesson 16.4 "Capstone: diagnose four real failures" + Lab 9 brief (slide EN, kiểu FU, 26/10/2026, agent c16).
 * Nguồn: content/courses/postgresql/s16-production-capstone.mjs › postgresql-16-4-capstone.
 * Output = chạy thật (video-bai-giang/src/khung/pg/that/pg-16-4.out.txt + that/c16/cap/*): PostgreSQL 16.15 container nháp pgc16tmp (bản sao lược đồ thật,
 * dữ liệu giả): ca 1 idle in transaction ⇒ VACUUM "40000 are dead but not yet removable", pg_cancel_backend KHÔNG gỡ được, pg_terminate_backend gỡ được
 * ⇒ "40000 removed" · ca 3 đếm kết nối theo ứng dụng · ảnh chụp 60 giây (pg_stat_statements) · Lab 9 xem trước: prisma db pull 8 model + app Node/Prisma
 * trên bản sao CT Shop (PostgreSQL 17.11). Ca 2 = số thật bài 16.3 (80.00 vs 70.00); ca 4 = số thật bài 15.3 (that/pg-15-3.out.txt, agent c15).
 */
import { lamDeck, sql, psql, sh, run, tbl, two, box, kw, cards, steps, vsd, c } from './_pg-chung.mjs';
import { doctorPic, lab9Pic, courseMapPic } from './pg-16-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
const P = (t) => `<p style="font-size:21px;margin:0">${t}</p>`;
export const deck = { key: 'pg-16-4', code: 'PG 16.4', title: 'Capstone: diagnose four real failures', sub: 'symptom ≠ cause · statistics first · the brief for Lab 9' };

export const slides = lamDeck({ chuong: 'Chapter 16 — PostgreSQL in production & capstone', bai: '16.4' }, [
  { cover: true, t: 'Capstone: diagnose<br>four real failures', sub: 'Symptom first, cause later — from the database’s own statistics ·<br>and the brief for Lab 9: a Node + Prisma app on CT Shop' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A 4-step method for any incident — and why <b>restart comes last</b></li>
<li>Four real failures: a slow table, wrong balances, “too many clients”, data that “disappears”</li>
<li>For each: symptom → first query → evidence (run for real) → fix</li>
<li>A 60-second snapshot script to run before touching anything</li>
<li>The whole course as a map of symptoms — and the brief for <b>Lab 9</b></li>
</ul>
${box('What is being tested', 'Not memory. The skill is knowing which of the fifteen chapters this particular symptom belongs to.', 'lam')}` },

  { t: 'Everyday example: a doctor takes the vitals first', giua: true, body: `
${doctorPic()}
${P('A good doctor does not hand out painkillers before measuring anything — the pain is often far from its cause. An on-call engineer is in the same seat: measure the database first, then decide.')}` },

  { t: 'The method: statistics before guesses', to: true, giua: true, body: `
${steps([
    '<b>Snapshot before you change anything</b> — <code class="i">pg_stat_activity</code>, top of <code class="i">pg_stat_statements</code>, connections per app. Sixty seconds, and your only chance.',
    '<b>Ask “right now” first</b> — <code class="i">pg_stat_activity</code>: a stuck transaction, a lock wait, a connection flood. Most incidents end here.',
    '<b>Then ask “what has been expensive”</b> — <code class="i">pg_stat_statements</code> by <code class="i">total_exec_time</code>: the slow burns.',
    '<b>Only now EXPLAIN</b> — once you know <i>which</i> query, <code class="i">EXPLAIN (ANALYZE, BUFFERS)</code> says <i>why</i>.',
  ])}
${box('→ Restart last, never first', 'It usually restores service and always erases the evidence — so the cause survives and comes back with nothing left to diagnose.', 'bad')}` },

  { t: 'Case 1 — “slow since this afternoon, no deploy”', to: true, giua: true, body: `
${two(`<div>${box('Symptom', 'Response time ×3 over an hour. No deploy, no traffic spike, error rate flat. Queries on <b>one table</b> got much worse than the rest.', 'bad')}
${box('First query — not EXPLAIN', 'Who has held a transaction the longest?', 'lam')}</div>`,
  sql(`SELECT pid, application_name, state,
       now() - xact_start AS tuoi, backend_xmin
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
  AND pid <> pg_backend_pid()
ORDER BY tuoi DESC;`, { sm: false }), 'r46')}
${P('What you are looking for: a session in <code class="i">idle in transaction</code> for minutes or hours. It pins a snapshot (its <code class="i">backend_xmin</code>), so VACUUM cannot remove any row version newer than it — anywhere in the database (Ch 11, 14).')}` },

  { t: 'Case 1 — the evidence (real)', giua: true, body: `
${two(zm(psql(`-- session "web-quen-commit": BEGIN; SELECT count(*) FROM songs; …then nothing
UPDATE songs SET duration_sec = duration_sec + 1 WHERE id <= 20000;  -- ×2
VACUUM (VERBOSE) songs;
tuples: 0 removed, 87054 remain, 40000 are dead but not yet removable
removable cutoff: 5349, which was 3 XIDs old when operation ended

 pid | application_name |        state        |      tuoi       | backend_xmin
-----+------------------+---------------------+-----------------+--------------
 237 | web-quen-commit  | idle in transaction | 00:00:03.797513 |         5349`, { sm: true, title: 'psql 16.15 — real schema replica, fake data (trimmed)', hl: [4, 5, 9] }), 1.0),
  `<div>${box('Read it', 'VACUUM ran, found <b>40,000</b> dead row versions and could remove <b>none</b>: the cutoff 5349 is exactly the <code class="i">backend_xmin</code> of the idle session.', 'lam')}
${box('The misleading part', 'The slow table is often <b>not</b> the one the stuck session touched. Cause: global. Symptom: local. “Which query is slow?” is the wrong first question here.', 'bad')}</div>`, 'r64')}` },

  { t: 'Case 1 — the fix: terminate, not cancel (real)', giua: true, body: `
${two(zm(psql(`SELECT pg_cancel_backend(pid) FROM pg_stat_activity
 WHERE application_name = 'web-quen-commit';
 pg_cancel_backend
-------------------
 t
SELECT pid, state FROM pg_stat_activity
 WHERE application_name = 'web-quen-commit';
 pid |        state
-----+---------------------
 237 | idle in transaction
-- ↑ still there
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
 WHERE application_name = 'web-quen-commit';
 pg_terminate_backend
----------------------
 t`, { sm: true, title: 'psql 16.15 (trimmed)', hl: [10, 16] }), 0.98),
  `<div>${zm(psql(`VACUUM (VERBOSE) songs;
tuples: 40000 removed, 45466 remain,
  0 are dead but not yet removable`, { sm: true, title: 'right after', hl: [2] }), 1.1)}
${steps(['<code class="i">pg_cancel_backend</code> cancels a <b>running query</b>; an idle session has none — it returns <code class="i">t</code> and changes nothing', '<code class="i">pg_terminate_backend</code> ends the session and rolls its transaction back', 'Then <code class="i">idle_in_transaction_session_timeout</code> (16.3) and find the code path that forgot to commit'])}</div>`, 'r46')}` },

  { t: 'Case 2 — “balances are wrong, and there is no error”', giua: true, body: `
${two(`<div>${box('Symptom', 'Occasional, not reproducible, always <b>less</b> than it should be. No exception in any log; every transaction reports success.', 'bad')}
${box('First move — do NOT query the database', 'Read the code path that writes the balance and look for this shape:', 'lam')}
${sql(`const row = await db.query(
  'SELECT balance FROM accounts WHERE id=$1', [id]);
const moi = row.balance - amount;      // ← computed here
await db.query(
  'UPDATE accounts SET balance=$1 WHERE id=$2', [moi, id]);`, { sm: true, lang: 'javascript', hl: [3] })}</div>`,
  `<div>${zm(psql(`A đọc|100.00
B đọc|100.00
cuối cùng|80.00
-- ↑ should be 70.00
-- atomic: SET balance = balance - 10 / - 20
cuối cùng|70.00`, { sm: true, title: 'two real sessions — measured in 16.3', hl: [3, 6] }), 1.1)}
${box('Fix', 'One atomic statement — <code class="i">UPDATE accounts SET balance = balance - $1 WHERE id = $2</code> — or <code class="i">SELECT … FOR UPDATE</code> first when the new value cannot be computed from the old one (Ch 11).', 'xanh')}</div>`)}` },

  { t: 'Case 3 — “too many clients” at deploy (real)', giua: true, body: `
${two(zm(psql(`SELECT usename, application_name, count(*)
FROM pg_stat_activity
WHERE backend_type = 'client backend'
GROUP BY 1, 2 ORDER BY 3 DESC;
 usename  | application_name | count
----------+------------------+-------
 postgres | backend-web      |     8
 postgres | worker-email     |     5
 postgres | cron-backup      |     1
 postgres | prisma-migrate   |     1
 postgres | psql             |     1`, { sm: true, title: 'psql 16.15 — count AND attribute', hl: [7, 8] }), 1.05),
  `<div>${box('Symptom', 'The app still runs, but the migration at deploy cannot connect; later, under load, user requests fail too.', 'bad')}
${box('What it is', 'The multiplication of 14.1: someone added a worker container, and processes × pool crossed <code class="i">max_connections</code>. The migration fails first because it connects <b>last</b>. Measured in 14.1: <code class="i">FATAL: sorry, too many clients already</code>.', 'lam')}
${box('Fix', 'Shrink pools so the product fits with headroom, or PgBouncer in transaction mode — and shrink anyway (14.2). Never “just raise max_connections”.', 'xanh')}</div>`)}` },

  { t: 'Case 4 — “my change vanished, then came back later”', giua: true, body: `
${two(`<div>${box('Symptom', 'Intermittent. Save, navigate, the change is not there; reload a bit later and it is. Only since a read replica was added.', 'bad')}
${sql(`-- on the PRIMARY (the query of 15.3)
SELECT application_name, state,
  pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn))
    AS tre_byte,
  pg_wal_lsn_diff(sent_lsn, flush_lsn) AS chua_flush,
  replay_lag
FROM pg_stat_replication;`, { sm: true })}</div>`,
  `<div>${zm(psql(` application_name |   state   | tre_byte | chua_flush |   replay_lag
------------------+-----------+----------+------------+-----------------
 walreceiver      | streaming | 68 MB    |          0 | 00:00:00.661019
--- primary
201001
--- standby
1001
  tre_thoi_gian
-----------------
 00:00:18.340312`, { sm: true, title: 'measured in 15.3 — replay paused, 200,000 rows written', hl: [3, 5, 7] }), 0.86)}
${box('What it is — and the fix', 'Asynchronous replication (<code class="i">sync_state = async</code>, the default): nothing is broken, the standby is simply behind. Route reads that follow a write <b>in the same user action</b> to the primary; keep replicas for truly independent reads.', 'xanh')}</div>`)}` },

  { t: 'The pattern behind all four', body: `
${tbl(['case', 'the symptom points at…', '…the cause is', 'first query'], [
    ['1', 'one slow table', 'an <b>idle</b> session elsewhere', '<code class="i">pg_stat_activity</code> by <code class="i">xact_start</code>'],
    ['2', 'a bug in the data', 'correct-looking code, two requests at once', 'read the code path'],
    ['3', 'the deploy / the migration', 'an unrelated new container', 'connections per <code class="i">application_name</code>'],
    ['4', 'a “lost” write', 'correct, default configuration', '<code class="i">pg_stat_replication</code>'],
  ], { hl: [0, 2] })}
${box('The habit is the product of this course', 'In every case the first useful action was a query against the database’s own statistics — not a guess, not a code review marathon, not a restart.', 'xanh')}` },

  { t: 'Trap: the restart erases the evidence', giua: true, body: `
${two(cards([
    ['Case 1', 'kills the stuck transaction — VACUUM catches up, the forgotten <code class="i">BEGIN</code> stays in the code'],
    ['Case 3', 'drops all connections — the pool math is still wrong, next deploy fails again'],
    ['All cases', 'empties <code class="i">pg_stat_activity</code> — the only record of who held what'],
  ], 1), `<div>${box('The temptation', 'Under pressure, restarting “to clear things” is enormous — and it usually <b>works</b>. That is exactly the problem: the symptom goes, the cause survives, and it returns next week with no evidence of the first time.', 'bad')}
${box('The rule', 'Spend <b>sixty seconds</b> capturing state first. Paste it somewhere. <b>Then</b> restart if you must. An incident you can explain is worth more than one you merely survived.', 'xanh')}</div>`, 'r46')}` },

  { t: 'The 60-second snapshot (real)', body: `
${two(sql(`-- chup-trang-thai.sql — run BEFORE touching anything
SELECT pid, application_name AS app, state,
       wait_event_type AS cho,
       now() - xact_start AS tuoi_gd,
       left(query, 40) AS query
FROM pg_stat_activity
WHERE backend_type = 'client backend'
  AND pid <> pg_backend_pid()
ORDER BY xact_start NULLS LAST LIMIT 8;

SELECT application_name AS app, count(*)
FROM pg_stat_activity
WHERE backend_type = 'client backend'
GROUP BY 1 ORDER BY 2 DESC;

SELECT calls, round(total_exec_time) AS tong_ms,
       round(mean_exec_time::numeric, 2) AS tb_ms,
       left(query, 45) AS query
FROM pg_stat_statements
ORDER BY total_exec_time DESC LIMIT 3;`, { sm: true }),
  zm(psql(` pid  |       app       |        state        |   cho   |    tuoi_gd
------+-----------------+---------------------+---------+----------------
 1186 | web-quen-commit | idle in transaction | Client  | 00:00:03.174381
 1187 | backend-web     | active              | Timeout | 00:00:03.16031
 1188 | backend-web     | active              | Timeout | 00:00:03.066551
       app       | count
-----------------+-------
 backend-web     |     3
 web-quen-commit |     1
 calls | tong_ms | tb_ms  |                     query
-------+---------+--------+-----------------------------------------------
    40 |    4555 | 113.87 | SELECT count(*) FROM notes WHERE title LIKE $
     1 |      86 |  85.87 | DO $$ BEGIN FOR i IN 1..300 LOOP PERFORM id F`, { sm: true, title: 'psql 16.15 + pg_stat_statements — staged incident (trimmed)', hl: [3, 12] }), 0.92))}
${P('Three answers in one run: who holds a transaction, who owns the connections, what has cost the most. Note <code class="i">round(…::numeric, 2)</code>: <code class="i">mean_exec_time</code> is double precision.')}` },

  { t: 'The whole course, as symptoms', giua: true, body: `
${courseMapPic()}
${P('Seventeen chapters, read backwards: every symptom you will meet in production points to one of them. That map — not any single command — is what you take away.')}` },

  { t: 'Lab 9 brief: a Node + Prisma app on CT Shop', giua: true, body: `
${lab9Pic()}
${P('Lab 9 wires everything together: Prisma models from CT Shop, migrations applied with <code class="i">migrate deploy</code> by an owner role, a right-sized pool, an order placed in a transaction, a monthly revenue report in raw SQL, and the checklist script green.')}` },

  { t: 'Lab 9 first look ①: introspect CT Shop (real)', giua: true, body: `
${two(zm(sh(`$ npx prisma db pull
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "c16_shop",
  schemas "shop" at "127.0.0.1:54317"
✔ Introspected 8 models and wrote them into
  prisma/schema.prisma in 246ms
*** WARNING ***
These constraints are not supported by Prisma Client,
because Prisma currently does not fully support check
constraints.
  - Model: "customer", constraint: "customer_email_check"
  - Model: "orders", constraint: "orders_status_check"
  …(11 in total)`, { sm: true, title: 'terminal — Prisma 5.22 on a copy of CT Shop (trimmed)', hl: [5, 8] }), 1.0),
  sql(`model orders {          // written by db pull (real)
  id          BigInt   @id @default(autoincrement())
  customer_id BigInt
  status      String   @default("pending")
  created_at  DateTime @default(now()) @db.Timestamptz(6)
  note        String?
  order_item  order_item[]
  customer    customer @relation(fields: [customer_id],
                references: [id], onDelete: NoAction)
  payment     payment?
  @@index([customer_id])
  @@schema("shop")
}`, { sm: true, lang: 'typescript', hl: [11] }))}
${P('Your Ch 3 constraints survive in the database, but Prisma cannot see CHECKs — the database stays the guard. <code class="i">@@index([customer_id])</code> is the index you added in the 16.3 exercise.')}` },

  { t: 'Lab 9 first look ②: query + raw report (real)', giua: true, body: `
${two(sql(`const prisma = new PrismaClient({ datasourceUrl:
  '…?schema=shop&connection_limit=5&pool_timeout=10' });

const don = await prisma.orders.findMany({
  where: { customer_id: 42n },
  orderBy: { created_at: 'desc' },
  take: 3, select: { id: true, status: true } });

// Prisma has no date_trunc ⇒ real SQL, safe params
const rows = await prisma.$queryRaw\`
  SELECT to_char(date_trunc('month', paid_at
         AT TIME ZONE 'Asia/Ho_Chi_Minh'), 'YYYY-MM')
         AS thang, count(*) AS so_don,
         sum(amount)::text AS doanh_thu
  FROM shop.payment WHERE paid_at >= \${tu}
  GROUP BY 1 ORDER BY 1 LIMIT 4\`;`, { sm: true, lang: 'typescript', hl: [2, 10] }),
  zm(sh(`prisma:query 5ms SELECT "orders"."id", "orders"."status"
  FROM "orders" WHERE "orders"."customer_id" = $1
  ORDER BY "orders"."created_at" DESC LIMIT $2 OFFSET $3
đơn của khách 42: 1841:shipped 1256:shipped 1238:paid
prisma:query 25ms  SELECT to_char(date_trunc('month', …
┌─────────┬───────────┬────────┬───────────────┐
│ (index) │ thang     │ so_don │ doanh_thu     │
├─────────┼───────────┼────────┼───────────────┤
│ 0       │ '2026-01' │ 75     │ '48698000.00' │
│ 1       │ '2026-02' │ 64     │ '31046000.00' │
│ 2       │ '2026-03' │ 92     │ '63914000.00' │
│ 3       │ '2026-04' │ 69     │ '37252000.00' │
└─────────┴───────────┴────────┴───────────────┘`, { sm: true, title: 'tsx app.mts — Prisma 5.22 → PostgreSQL 17.11 (trimmed)', hl: [4, 9] }), 0.95))}` },

  { t: 'Lab 9: what you will hand in', to: true, giua: true, body: `
${cards([
    ['Schema & migrations', 'db pull → schema.prisma; every later change as a migration file applied with <code class="i">migrate deploy</code>; <code class="i">migrate diff</code> empty'],
    ['Connections', 'pool size justified by the arithmetic: processes × pool &lt; max_connections with headroom'],
    ['Checkout', 'an order + items + stock in ONE transaction, no read-modify-write, safe under two concurrent buyers'],
    ['Report', 'monthly revenue via <code class="i">$queryRaw</code>, an index that makes it fast, EXPLAIN (ANALYZE, BUFFERS) before/after'],
    ['Operations', 'app role vs owner role, timeouts on the role, kiem-tra.sql run and explained'],
    ['Restore drill', 'dump → restore into a fresh DB → row counts match'],
  ], 2)}` },

  { t: 'Exercise: which case is this?', body: `
${two(zm(psql(` pid  |       app       |        state        |   cho   |    tuoi_gd
------+-----------------+---------------------+---------+----------------
 1186 | web-quen-commit | idle in transaction | Client  | 00:00:03.174381
 1187 | backend-web     | active              | Timeout | 00:00:03.16031
 1188 | backend-web     | active              | Timeout | 00:00:03.066551
 1189 | backend-web     | active              | Timeout | 00:00:03.043431`, { sm: true, title: 'snapshot from the staged incident', hl: [3] }), 1.0),
  `<div>${box('Task', 'Users say one page has been getting slower all afternoon. You ran the 60-second snapshot and got this. Which case, which line, what do you run — in order?', '')}
${box('Answer', 'Case 1. Line 1186: <b>idle in transaction</b> (its client went quiet). Run <code class="i">VACUUM (VERBOSE)</code> on the slow table and look for “dead but not yet removable” → <code class="i">pg_terminate_backend(1186)</code> (cancel would not end it) → VACUUM again → set <code class="i">idle_in_transaction_session_timeout</code> → find the code that forgot to commit.', 'xanh')}</div>`, 'r46')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why is “which query is slow?” the wrong first question in case 1?</li>
<li>Name two things a restart destroys, and what to do in the sixty seconds before it.</li>
<li>Why did <code class="i">pg_cancel_backend</code> return <code class="i">t</code> and still not help?</li>
</ol>
${box('Answers', '① the cause is a session that is not running any query; the slow table is only where it shows · ② the stuck session/connections and the whole of <code class="i">pg_stat_activity</code> (plus in-memory state) — run the snapshot and save it · ③ it cancels a running query; an idle-in-transaction session has none, only <code class="i">pg_terminate_backend</code> ends it.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Snapshot → “right now” → “expensive over time” → EXPLAIN → restart last</li>
<li>Case 1 idle transaction · Case 2 lost update · Case 3 connection math · Case 4 replica lag</li>
<li>Every symptom pointed somewhere other than its cause</li>
<li>The habit: ask the database’s own statistics first</li>
<li>Lab 9: Node + Prisma on CT Shop — schema, pool, transaction, report, checklist, restore</li>
</ul>
${box('Next — Lab 9', 'Build it. After that: Chapter 17 puts PostgreSQL next to SQL Server, MySQL and MongoDB, and the final exams (PE + FE) wait for you.', 'lam')}` },
]);
