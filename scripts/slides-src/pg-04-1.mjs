/**
 * pg-04-1 — PostgreSQL · Chapter 4 · Lesson 4.1 "INSERT: many rows, RETURNING & UPSERT" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s04-chen-truy-van.mjs › postgresql-4-1-insert. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-04-1.out.txt + pg-04-1.bench.txt). Bổ sung so với bài web: ví dụ giao hàng, giải phẫu INSERT,
 * lỗi hay gặp (NOT NULL, identity), đo 50.000 dòng (19,1 s / 0,19 s / 0,14 s), INSERT…SELECT, COPY nhập+xuất, EXCLUDED,
 * cờ (xmax = 0), MERGE của PG 17 (RETURNING merge_action()), đối chiếu SQL Server, upsert Prisma + bảng giá CT Shop.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { anatomy, chuyen, cotDo, rePhim } from './pg-04-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-04-1', code: 'PG 4.1', title: 'INSERT: many rows, RETURNING & UPSERT', sub: 'Getting data in — fast and safely' };

const NOTE_DDL = `CREATE TABLE note (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      text NOT NULL,
  author     text NOT NULL,
  tag        text,
  views      int NOT NULL DEFAULT 0,
  pinned     boolean NOT NULL DEFAULT false,
  created_at date NOT NULL
);`;

export const slides = lamDeck({ chuong: 'Chapter 4 — Inserting & querying data', bai: '4.1' }, [
  { cover: true, t: 'INSERT:<br>many rows, RETURNING & UPSERT', sub: 'Getting data in — fast, safe, and without duplicates.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><b>Multi-row INSERT</b> — one statement, many rows (and why it is far faster)</li>
<li><b>RETURNING</b> — get the generated ids back, no second query</li>
<li><b>DEFAULT</b> and the three errors every beginner meets</li>
<li><b>INSERT … SELECT</b> and <b>COPY</b> — copy and bulk-load data</li>
<li><b>UPSERT</b> — <code class="i">ON CONFLICT DO UPDATE / DO NOTHING</code>, and its trap</li>
</ul>
${box('SQL Server developer?', 'You will see a small table in this lesson: <code class="i">OUTPUT</code> → <code class="i">RETURNING</code>, <code class="i">MERGE</code> ↔ <code class="i">ON CONFLICT</code>, <code class="i">BULK INSERT</code> → <code class="i">COPY</code>.', 'lam')}` },

  { t: 'Everyday example first: five parcels', giua: true, body: `
<div style="zoom:1.0">${chuyen()}</div>
<p style="font-size:24px;margin:0">Sending five parcels, you load <b>one truck</b> and drive once — you do not make five trips. <code class="i">INSERT … VALUES (…), (…), (…)</code> is the truck: one statement, one network wait, one commit.</p>` },

  { t: 'The table we use for the whole chapter', body: `
${two(sql(NOTE_DDL, { sm: true }),
`<ul style="font-size:22px">
<li><code class="i">id</code> — the database numbers rows for us (identity)</li>
<li><code class="i">tag</code> — <b>nullable</b>: a note may have no tag</li>
<li><code class="i">views</code>, <code class="i">pinned</code> — have a <b>DEFAULT</b></li>
<li>No default on <code class="i">title</code>, <code class="i">author</code>, <code class="i">created_at</code> — we must supply them</li>
</ul>`, 'r64')}
${box('Same table, four lessons', 'Lessons 4.1–4.4 all run on this small <code class="i">note</code> table. In the real-world slides we also use the <b>CT Shop</b> database (2,000 orders) that you build in the labs.', 'info')}` },

  { t: 'Many rows in one INSERT — and get the ids back', body: `
${zm(run(`INSERT INTO note (title, author, tag, views, pinned, created_at) VALUES
  ('Intro to SQL',         'Cuong', 'sql',  120, true,  '2026-01-10'),
  ('Indexes deep dive',    'Cuong', 'sql',   90, false, '2026-02-14'),
  ('Timezones done right', 'Lan',   'date',  45, false, '2026-03-01'),
  ('JSONB in practice',    'Lan',   'sql',   30, false, '2026-03-05'),
  ('My reading list',      'Minh',  NULL,     8, false, '2026-03-20'),
  ('Backup strategy',      'Cuong', 'ops',   12, true,  '2026-04-02')
RETURNING id, title;`, ` id |        title
----+----------------------
  1 | Intro to SQL
  2 | Indexes deep dive
  3 | Timezones done right
  4 | JSONB in practice
  5 | My reading list
  6 | Backup strategy
(6 rows)

INSERT 0 6`, { hlOut: [3, 4, 5, 6, 7, 8] }), 1.0)}
<p style="font-size:21px;margin:0">Six rows, <b>one</b> statement. <code class="i">RETURNING</code> hands back the new ids — the idiom for “insert a row, then use its id”: no second query.</p>` },

  { t: 'Anatomy of an INSERT', giua: true, body: `
${anatomy([
    ['INSERT INTO note', 'which table'],
    ['(title, author)', 'which columns'],
    ["VALUES ('A','x'), ('B','y')", 'one bracket = one row'],
    ['RETURNING id', 'what to hand back'],
  ], { fs: 23 })}
<div style="zoom:1.2">${two(box('Columns and values must line up', 'Two columns listed → each row needs <b>exactly two</b> values, in the same order. <b>Always list the columns</b>: without the list, a later <code class="i">ALTER TABLE ADD COLUMN</code> breaks your statement.', 'info'),
box('INSERT 0 6', 'The command tag: the <b>0</b> is a legacy field (always 0 today), the <b>6</b> is the number of rows inserted. Your code can read it as the affected-row count.', 'xanh'))}</div>` },

  { t: 'Let DEFAULT do the work', body: `
${zm(run(`INSERT INTO note (title, author, tag, created_at)
VALUES ('Quick draft', 'Minh', NULL, '2026-04-10')
RETURNING id, title, views, pinned;`, ` id |    title    | views | pinned
----+-------------+-------+--------
  7 | Quick draft |     0 | f
(1 row)

INSERT 0 1`, { hlOut: [3] }), 1.2)}
${two(`<p style="margin:0">We did <b>not</b> mention <code class="i">views</code> or <code class="i">pinned</code>. They took their <b>DEFAULT</b> from the table definition: <code class="i">0</code> and <code class="i">false</code> (<code class="i">f</code>).</p>`,
box('Write only what you really know', 'A column you skip gets its DEFAULT — or NULL if it has none. Use <code class="i">DEFAULT</code> as an explicit value too: <code class="i">VALUES (…, DEFAULT)</code>.', 'xanh'))}` },

  { t: 'Three INSERT errors you will meet', body: `
${zm(run(`INSERT INTO note (title, author) VALUES ('No date', 'Lan');
INSERT INTO note (id, title, author, created_at)
VALUES (99, 'Forced id', 'Lan', '2026-05-01');`, `ERROR:  null value in column "created_at" of relation "note"
        violates not-null constraint
DETAIL:  Failing row contains (8, No date, Lan, null, 0, f, null).

ERROR:  cannot insert a non-DEFAULT value into column "id"
DETAIL:  Column "id" is an identity column defined as GENERATED ALWAYS.
HINT:  Use OVERRIDING SYSTEM VALUE to override.`, { hlOut: [3, 5, 7] }), 1.12)}
<ul style="font-size:21px;margin:0">
<li><b>NOT NULL</b> — a required column was skipped. The DETAIL line shows the whole failing row.</li>
<li><b>GENERATED ALWAYS</b> — the database owns <code class="i">id</code>; typing your own is refused (override only for data migrations: <code class="i">OVERRIDING SYSTEM VALUE</code>).</li>
<li>Notice <code class="i">8</code> in the failing row: the failed insert still <b>used up</b> an identity number — gaps are normal (lesson 3.1).</li>
</ul>` },

  { t: 'Why batch? Measured on 50,000 rows', body: `
${cotDo([
    ['one INSERT per row', 19.1, '#c0392b', '19.1 s'],
    ['1,000 rows per INSERT', 0.19, '#e08a1e', '0.19 s'],
    ['COPY', 0.14, '#2f7d4f', '0.14 s'],
  ])}
${box('What the numbers say', '50,000 rows into a two-column table, same machine, same server. The loop of single INSERTs is <b>~100× slower</b>: every statement pays a network round trip and its own commit (a disk flush). Batching keeps the work the same and removes the waiting.', 'lam')}
<p class="nho">Run on PostgreSQL 17.11 in Docker, psql inside the container (no real network — over the internet the gap is even bigger).</p>` },

  { t: 'INSERT … SELECT: copy rows inside the server', body: `
${zm(run(`CREATE TABLE note_archive (LIKE note INCLUDING DEFAULTS);

INSERT INTO note_archive (id, title, author, tag, views, pinned, created_at)
SELECT id, title, author, tag, views, pinned, created_at
FROM note WHERE created_at < '2026-03-01';

SELECT id, title, created_at FROM note_archive ORDER BY id;`, ` id |       title       | created_at
----+-------------------+------------
  1 | Intro to SQL      | 2026-01-10
  2 | Indexes deep dive | 2026-02-14
(2 rows)`, { hl: [3, 4, 5], hlOut: [3, 4] }), 1.2)}
<p style="font-size:21px;margin:0">The rows travel <b>inside</b> the server — nothing goes to your app and back. Perfect for back-fills, archive tables and summary tables. <code class="i">LIKE note</code> clones the columns of an existing table.</p>` },

  { t: 'COPY: the bulk-load road', body: `
${zm(sql(`COPY tag_seed (tag, label) FROM STDIN WITH (FORMAT csv);`, { sm: true }) + psql(`sql,Structured Query Language
date,Dates and times
ops,Operations
\\.
COPY 3`, { title: 'the data follows the command, ended by \\. — psql prints the tag', sm: true, hl: [5] }) +
  sql(`COPY (SELECT id, title, views FROM note WHERE pinned ORDER BY id)
  TO STDOUT WITH (FORMAT csv, HEADER);`, { sm: true }) + psql(`id,title,views
1,Intro to SQL,120
6,Backup strategy,12`, { title: 'psql 17 · pgcourse — CSV out', sm: true }), 1.0)}
${two(box('COPY … FROM', 'Loads a whole file/stream in one command — the fastest way in (0.14 s for 50,000 rows). It is how <code class="i">pg_restore</code> works. From your laptop use psql\'s <code class="i">\\copy</code>.', 'xanh'),
box('COPY … TO', 'Exports a table or any <b>query</b> as CSV. <code class="i">(SELECT …)</code> in brackets = export exactly what you filtered.', 'info'))}` },

  { t: 'UPSERT: insert, or update if it already exists', giua: true, body: `
${rePhim()}
<p style="font-size:22px;margin:0">Hotel check-in: <b>if your name is on the list</b>, the clerk adds a stamp to your card; <b>if not</b>, they write a new line. The two-step way (look first, then write) can fail when two people check in at once — <code class="i">ON CONFLICT</code> does both in one atomic step.</p>` },

  { t: 'DO UPDATE: a counter that creates itself', body: `
${zm(run(`CREATE TABLE tag_stat (tag text PRIMARY KEY, hits int NOT NULL DEFAULT 0);

INSERT INTO tag_stat (tag, hits) VALUES ('sql', 1)
  ON CONFLICT (tag) DO UPDATE SET hits = tag_stat.hits + 1;   -- run 3 times
SELECT * FROM tag_stat;`, ` tag | hits
-----+------
 sql |    3
(1 row)`, { hl: [3, 4], hlOut: [3] }), 1.2)}
${two(tbl(['tag', 'hits'], [['sql', 1]], { cap: '1st run → inserted' }), tbl(['tag', 'hits'], [['sql', 3]], { cap: '3rd run → updated twice', hl: [0], o: [[0, 1]] }), 'r46')}
<p style="font-size:20px;margin:0">First run inserts. Runs 2 and 3 hit the primary key, so <code class="i">DO UPDATE</code> runs instead: <code class="i">tag_stat.hits</code> (the <b>existing</b> row) <code class="i">+ 1</code>.</p>` },

  { t: 'DO NOTHING — and what RETURNING tells you', body: `
${zm(run(`INSERT INTO tag_stat (tag, hits) VALUES ('sql', 999)
  ON CONFLICT (tag) DO NOTHING;                    -- INSERT 0 0
INSERT INTO tag_stat (tag, hits) VALUES ('sql', 1)
  ON CONFLICT (tag) DO NOTHING RETURNING tag;
INSERT INTO tag_stat (tag, hits) VALUES ('new', 1)
  ON CONFLICT (tag) DO NOTHING RETURNING tag;`, `INSERT 0 0

 tag
-----
(0 rows)

 tag
-----
 new
(1 row)`, { hlOut: [1, 5, 10] }), 1.12)}
<ul style="font-size:21px;margin:0">
<li>The 999 is <b>ignored</b>; the old row stays. <code class="i">INSERT 0 0</code> = zero rows written.</li>
<li><b>Empty RETURNING = the conflict branch ran.</b> A row back = it was really inserted.</li>
</ul>` },

  { t: 'EXCLUDED, and “was it an insert or an update?”', body: `
${zm(run(`INSERT INTO tag_stat (tag, hits) VALUES ('sql', 10), ('ops', 5)
ON CONFLICT (tag) DO UPDATE SET hits = tag_stat.hits + EXCLUDED.hits
RETURNING tag, hits, (xmax = 0) AS inserted;`, ` tag | hits | inserted
-----+------+----------
 sql |   13 | f
 ops |    5 | t
(2 rows)`, { hl: [2, 3], hlOut: [3, 4] }), 1.4)}
${two(box('EXCLUDED', 'The <b>row you tried to insert</b>. <code class="i">tag_stat.hits</code> = what is in the table, <code class="i">EXCLUDED.hits</code> = what you offered. Add them: 3 + 10 = 13.', 'info'),
box('(xmax = 0) AS inserted', 'A well-known trick: <code class="i">xmax = 0</code> is true for a brand-new row, false for an updated one. Handy for “created or updated?” in an API.', 'xanh'))}` },

  { t: 'Trap: DO NOTHING without a target swallows real bugs', body: `
${vsd(
    zm(sql(`INSERT INTO account (email, phone)
VALUES ('b@x.com', '0901')
ON CONFLICT DO NOTHING;`, { sm: true }), 1.05) + `<p style="font-size:19px;margin:6px 0 0">→ <code class="i">INSERT 0 0</code>. Success! But the phone <code class="i">0901</code> belongs to someone else — the new account was silently dropped.</p>`,
    zm(sql(`INSERT INTO account (email, phone)
VALUES ('b@x.com', '0901')
ON CONFLICT (email) DO NOTHING;`, { sm: true }), 1.05) + `<p style="font-size:19px;margin:6px 0 0">→ <code class="i">ERROR: duplicate key … "account_phone_key"</code>. Only an <b>email</b> clash is skipped; the phone clash is reported.</p>`,
    '✗ No target', '✓ Name the constraint')}
${box('Rule', 'Always write <code class="i">ON CONFLICT (column)</code>. And when you must know whether the row was written, add <code class="i">RETURNING id</code>: an empty result means the conflict branch ran.', 'do2')}` },

  { t: 'Coming from SQL Server?', body: `
<div style="zoom:1.18"><table class="t">
<tr><th style="width:230px">Task</th><th>SQL Server (T-SQL)</th><th>PostgreSQL</th></tr>
<tr><td>Get generated ids back</td><td><code class="i">OUTPUT inserted.id</code></td><td><code class="i">RETURNING id</code></td></tr>
<tr><td>Insert or update</td><td><code class="i">MERGE … WHEN MATCHED / NOT MATCHED</code></td><td><code class="i">ON CONFLICT … DO UPDATE</code> (or <code class="i">MERGE</code>, PG 15+)</td></tr>
<tr><td>Force an identity value</td><td><code class="i">SET IDENTITY_INSERT t ON</code></td><td><code class="i">OVERRIDING SYSTEM VALUE</code></td></tr>
<tr><td>Bulk load a file</td><td><code class="i">BULK INSERT</code> / <code class="i">bcp</code></td><td><code class="i">COPY</code> / psql <code class="i">\\copy</code></td></tr>
<tr><td>Rows per VALUES list</td><td>max 1,000</td><td>no such cap (bind parameters: 65,535)</td></tr>
</table></div>
${box('Same ideas, different words', 'Everything in this lesson exists in T-SQL under another name. The <b>one big difference</b>: PostgreSQL has a dedicated, atomic upsert (<code class="i">ON CONFLICT</code>) — the safe way to “insert or update”.', 'lam')}` },

  { t: 'MERGE in PostgreSQL 17 — and when to use which', body: `
${zm(run(`MERGE INTO tag_stat t
USING (VALUES ('sql', 1), ('mrg', 1)) AS s(tag, hits) ON t.tag = s.tag
WHEN MATCHED THEN UPDATE SET hits = t.hits + s.hits
WHEN NOT MATCHED THEN INSERT (tag, hits) VALUES (s.tag, s.hits)
RETURNING merge_action(), t.tag, t.hits;`, ` merge_action | tag | hits
--------------+-----+------
 UPDATE       | sql |   14
 INSERT       | mrg |    1
(2 rows)`, { hlOut: [3, 4] }), 1.15)}
${two(box('MERGE (T-SQL style)', 'Standard SQL; can also <b>DELETE</b>. PostgreSQL 17 added <code class="i">RETURNING</code> with <code class="i">merge_action()</code>. Under heavy concurrency it may raise a unique-violation error you must retry.', 'info'),
box('ON CONFLICT (PostgreSQL style)', 'Built for “insert or update <b>one key</b>”, with a <b>guarantee</b>: it either inserts or updates, even when many sessions race. Prefer it for counters, seeds and sync jobs.', 'xanh'))}` },

  { t: 'Real world (1): the upsert in cuongthai.com', body: `
${zm(sql(`await prisma.role.upsert({
  where:  { name: 'ROLE_ADMIN' },
  update: {},
  create: { name: 'ROLE_ADMIN' },
});`, { lang: 'typescript' }), 1.25)}
<p style="font-size:22px;margin:0">This is a line from the real seed of this website (<code class="i">prisma/seed.ts</code>). It runs on <b>every deploy</b>. The first time it creates <code class="i">ROLE_ADMIN</code>; every later time it finds it and does nothing — never a duplicate, never an error.</p>
${box('Same idea as INSERT … ON CONFLICT', 'Prisma\'s <code class="i">upsert()</code> = “create it, or update it if the unique key exists”. When the query qualifies, Prisma sends a native <code class="i">INSERT … ON CONFLICT</code> to PostgreSQL. An <b>idempotent</b> job is one you can run again safely — upserts make seeds, imports and syncs idempotent.', 'xanh')}` },

  { t: 'Real world (2): CT Shop price list', body: `
<p style="margin:0;font-size:22px">A supplier sends new prices. Existing SKUs get the new price, unknown SKUs are created. We try it <b>inside a transaction</b> and <code class="i">ROLLBACK</code> so the shop data stays untouched.</p>
${zm(run(`BEGIN;
INSERT INTO product (sku, name, category_id, price, stock) VALUES
  ('CT0501', 'Bút dạ quang Thiên Long', 5, 7500, 122),
  ('CT9999', 'Bút thử nghiệm',          5, 5000,  10)
ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
RETURNING sku, price, (xmax = 0) AS inserted;
ROLLBACK;`, ` sku   |  price  | inserted
--------+---------+----------
 CT0501 | 7500.00 | f
 CT9999 | 5000.00 | t
(2 rows)`, { hl: [5], hlOut: [3, 4] }), 1.3)}` },

  { t: 'Your turn: restock the toy shop', body: `
<p style="margin:0">Table <code class="i">toy (sku text PRIMARY KEY, name text NOT NULL, qty int NOT NULL DEFAULT 0)</code> holds T1 Robot 5, T2 Kite 3, T3 Puzzle 8. A delivery arrives: <b>10 more T2 Kites</b> and a <b>new T9 Drone ×2</b>. In <b>one statement</b>, add the quantities and show which SKUs were new.</p>
${zm(run(`INSERT INTO toy (sku, name, qty) VALUES ('T2','Kite',10), ('T9','Drone',2)
ON CONFLICT (sku) DO UPDATE SET qty = toy.qty + EXCLUDED.qty
RETURNING sku, qty, (xmax = 0) AS inserted;`, ` sku | qty | inserted
-----+-----+----------
 T2  |  13 | f
 T9  |   2 | t
(2 rows)`, { hlOut: [3, 4] }), 1.4)}
<p class="nho">Try it yourself first. Hint: the conflict target is the PRIMARY KEY; the old quantity is <code class="i">toy.qty</code>, the delivered one is <code class="i">EXCLUDED.qty</code>.</p>` },

  { t: 'Self-check — pause the video and answer', to: true, body: `
${steps([
    'Why is one INSERT with 1,000 rows much faster than 1,000 INSERTs?',
    'What does <code class="i">RETURNING</code> give you, and what does an <b>empty</b> RETURNING mean after <code class="i">ON CONFLICT DO NOTHING</code>?',
    'In <code class="i">DO UPDATE SET hits = tag_stat.hits + EXCLUDED.hits</code>, which side is the old row and which is the new one?',
  ])}
${box('Answers', `<ol style="margin:0;font-size:21px"><li>One network round trip and one commit instead of 1,000 of each — 19.1 s vs 0.19 s on 50,000 rows.</li>
<li>The rows just written (ids, defaults) with no second query. Empty = nothing was inserted: the conflict branch ran.</li>
<li><code class="i">tag_stat.hits</code> = the existing row; <code class="i">EXCLUDED.hits</code> = the row you tried to insert.</li></ol>`, 'xanh')}` },

  { t: 'Summary', to: true, body: `
<ul>
<li><b>Batch</b>: multi-row <code class="i">VALUES</code> for hundreds, <code class="i">COPY</code> for millions</li>
<li><code class="i">RETURNING</code> returns ids/defaults — no second query</li>
<li>List your columns; let <code class="i">DEFAULT</code> fill the rest</li>
<li>UPSERT = <code class="i">ON CONFLICT (key) DO UPDATE / DO NOTHING</code> — always name the key</li>
</ul>
${box('Next: 4.2 SELECT & WHERE', 'Data is in. Now ask the questions: pick columns, filter rows with AND/OR/IN/BETWEEN/LIKE — and meet the NULL trap. Then do the labs on <b>Code Lab → PostgreSQL</b>.', 'lam')}` },
]);
