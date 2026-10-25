/**
 * pg-00-4 — PostgreSQL · Section 0 · Lesson 0.4 "The mental model: a server you talk to in SQL" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s00-intro.mjs › postgresql-0-4-mo-hinh. Output = chạy thật PostgreSQL 17.11 (container pgcourse17),
 * lưu ở video-bai-giang/src/khung/pg/that/pg-00-4{,b}.{sql,out.txt}. Bổ sung: ví dụ nhà hàng, mỗi kết nối = một tiến trình backend (pg_stat_activity),
 * khai báo vs vòng lặp, cùng câu hỏi — kế hoạch đổi khi thêm chỉ mục (6,4 ms → 0,22 ms), bản đồ dự án Notes xuyên khoá.
 */
import { lamDeck, sql, sh, psql, run, two, box, cards as cards0, steps, kw, flow, tbl, vsd, c } from './_pg-chung.mjs';

/* <b> trong .card bị khung render phóng to thành khối riêng ⇒ đổi sang span đậm. */
const cards = (items, cot) => cards0(items.map(([h, p]) => [h, p.replace(/<b>/g, '<span style="font-weight:800;color:#262626">').replace(/<\/b>/g, '</span>')]), cot);

export const deck = { key: 'pg-00-4', code: 'PG 0.4', title: 'The mental model: a server you talk to in SQL', sub: 'Client, server, one connection = one process, declarative SQL' };

const NAU = '#b85a2b', PG = '#336791', CAM = '#e08a1e', LA = '#2f7d4f', DO = '#c0392b';

/* Hai tiến trình, một socket (SVG). */
const haiTienTrinh = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>
  <rect data-k="proc" x="10" y="20" width="360" height="260" rx="16" fill="#fff7ef" stroke="${CAM}" stroke-width="4"/>
  <text x="190" y="62" text-anchor="middle" font-size="26" font-weight="800" fill="${NAU}">Process 1 · YOUR APP</text>
  <text x="190" y="100" text-anchor="middle" font-size="21" fill="#555">Node / Python / Go / psql</text>
  <rect x="50" y="125" width="280" height="62" rx="10" fill="#fff" stroke="${CAM}" stroke-width="2.5"/><text x="190" y="165" text-anchor="middle" font-size="22" font-family="Menlo,monospace" fill="#333">SELECT * FROM notes</text>
  <text x="190" y="228" text-anchor="middle" font-size="20" fill="#777">its own memory · its own variables</text>
  <rect data-k="proc" x="740" y="20" width="360" height="260" rx="16" fill="#eef4fa" stroke="${PG}" stroke-width="4"/>
  <text x="920" y="62" text-anchor="middle" font-size="26" font-weight="800" fill="${PG}">Process 2 · POSTGRESQL</text>
  <text x="920" y="100" text-anchor="middle" font-size="21" fill="#555">a server, always running</text>
  <text x="920" y="165" text-anchor="middle" font-size="64">🐘</text>
  <text x="920" y="228" text-anchor="middle" font-size="20" fill="#777">its own memory · the data files on disk</text>
  <line x1="380" y1="120" x2="730" y2="120" stroke="${NAU}" stroke-width="4" marker-end="url(#ah)"/>
  <line x1="730" y1="190" x2="380" y2="190" stroke="${LA}" stroke-width="4" marker-end="url(#ah)"/>
  <text x="555" y="104" text-anchor="middle" font-size="22" font-weight="800" fill="${NAU}">SQL (just text)</text>
  <text x="555" y="226" text-anchor="middle" font-size="22" font-weight="800" fill="${LA}">rows (a result table)</text>
  <text x="555" y="154" text-anchor="middle" font-size="20" fill="#666">TCP socket · port 5432</text>
</svg>`;

/* postmaster → một backend cho mỗi kết nối. */
const backends = () => `<svg viewBox="0 0 1110 280" width="1110" height="280" font-family="Arial">
  <defs><marker id="b2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${PG}"/></marker></defs>
  <rect data-k="pm" x="450" y="10" width="210" height="64" rx="12" fill="#eef4fa" stroke="${PG}" stroke-width="3.5"/>
  <text x="555" y="40" text-anchor="middle" font-size="22" font-weight="800" fill="${PG}">postmaster</text><text x="555" y="62" text-anchor="middle" font-size="16" fill="#555">listens on :5432</text>
  ${[0, 1, 2].map((i) => {
    const x = 70 + i * 360;
    return `<line x1="555" y1="76" x2="${x + 150}" y2="146" stroke="${PG}" stroke-width="3" marker-end="url(#b2)"/>
    <rect data-k="be" x="${x}" y="150" width="300" height="70" rx="12" fill="#fff" stroke="${[CAM, LA, NAU][i]}" stroke-width="3.5"/>
    <text x="${x + 150}" y="180" text-anchor="middle" font-size="21" font-weight="800" fill="${[CAM, LA, NAU][i]}">backend #${i + 1} (own process)</text>
    <text x="${x + 150}" y="206" text-anchor="middle" font-size="17" fill="#555">serves ONE connection</text>
    <text x="${x + 150}" y="255" text-anchor="middle" font-size="19" fill="#777">${['your psql', 'your app (pool)', 'a colleague'][i]}</text>`;
  }).join('')}
</svg>`;

/* Hành trình của một câu SQL. */
const hanhTrinh = () => flow([
  { t: '1 · Connect', s: 'TCP + log in', mau: CAM },
  { t: '2 · Send SQL', s: 'a text string', mau: NAU },
  { t: '3 · Plan & run', s: 'on data on disk', mau: PG },
  { t: '4 · Rows back', s: 'a result table', mau: LA },
], { h: 150, fs: 22 });

const trongServer = () => flow([
  { t: 'Parser', s: 'is the SQL valid?', mau: '#7a5a9a' },
  { t: 'Planner', s: 'picks a strategy', mau: PG },
  { t: 'Executor', s: 'runs the plan', mau: LA },
  { t: 'Storage', s: 'tables, indexes, WAL', mau: NAU },
], { h: 150, fs: 22 });

export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.4' }, [
  { cover: true, t: 'The mental model:<br>a server you talk to in SQL', sub: 'The one picture that makes almost<br>everything about databases obvious.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>PostgreSQL is a <b>separate program</b> — a server — not a library inside your code</li>
<li>Four things that picture explains: connection cost, connection limits, SQL as text, data outliving the app</li>
<li>One connection = <b>one server process</b> (we will look at them for real)</li>
<li>SQL is <b>declarative</b>: you say <i>what</i>, the planner decides <i>how</i></li>
<li>The running project of the first chapters: the database of a <b>Notes API</b></li>
</ul>` },

  { t: 'An everyday picture: the restaurant', body: two(`
<ul>
<li>You (the <b>client</b>) write your order on paper</li>
<li>The waiter carries it across — that is the <b>network</b></li>
<li>The kitchen (the <b>server</b>) decides <i>how</i> to cook it — you never tell the chef which pan</li>
<li>The dish comes back: <b>rows</b></li>
</ul>`, cards([
    ['🧾 Order on paper', 'SQL — plain <b>text</b>, sent over a connection.'],
    ['👨‍🍳 Kitchen', 'PostgreSQL — runs on its own, even when you leave the table.'],
    ['📖 Pantry', 'The data files on disk — they stay when the dining room closes.'],
  ], 1)) + box('Remember', 'You never walk into the kitchen. You only order. Everything in this course is about ordering well — and understanding what the kitchen does with the order.', 'lam') },

  { t: 'Client and server — two processes, not one library', to: true, body: `
${haiTienTrinh()}
<p style="font-size:24px">Your Node / Python / Go app and PostgreSQL are <b>two programs</b> that talk through a socket — usually on different machines in production.</p>
${cards([
    ['→ What goes right', 'One <b>string of SQL text</b>. Nothing else — no objects, no file handles.'],
    ['← What comes back', 'A <b>result table</b>: column names + rows, then “(n rows)”.'],
    ['⛓ What links them', 'One <b>TCP connection</b> (port 5432) — opened once, reused for many statements.'],
  ], 3)}` },

  { t: 'Four things this one picture explains', body: cards([
    ['⏱ Why connections are expensive', 'Opening one = a network round trip + a login. That is why apps keep a <b>pool</b> of reused connections (Chapter 14). Node.js course: 8 ms new vs 0.38 ms reused.'],
    ['🚧 Why there is a connection limit', 'Each connection is a real server process using memory. Default limit: <b>100</b>. Go over it and you get <code class="i">too many clients already</code> — a real production incident on this site.'],
    ['📝 Why SQL is text', 'You send a string over the wire. That is also why you must never build that string from user input — <b>SQL injection</b> works exactly like this.'],
    ['💾 Why the database outlives the app', 'Restart your app and the data is still there: it lives in the server’s files, not in your app’s memory.'],
  ], 2) },

  { t: 'One connection = one server process (real)', body: `
${backends()}
${psql(`pgcourse=# SELECT pid, state, left(query,26) AS query
pgcourse-# FROM pg_stat_activity
pgcourse-# WHERE datname = 'pgcourse' AND backend_type = 'client backend';
 pid | state  |           query
-----+--------+----------------------------
 210 | active | SELECT pg_sleep(3)
 211 | active | SELECT pid, state, left(qu
(2 rows)`, { sm: true, hl: [5, 6] })}` },

  { t: 'The limit is real: max_connections', to: true, body: `${two(
    psql(`pgcourse=# SHOW max_connections;
 max_connections
-----------------
 100
(1 row)

pgcourse=# SELECT pg_backend_pid() AS my_backend;
 my_backend
------------
        195
(1 row)`, { sm: true, hl: [4, 9] }),
    `<ul style="font-size:23px"><li><b>100</b> connections by default — each one a backend process</li><li><code class="i">pg_backend_pid()</code> = the process serving <b>you</b> right now</li><li>12 app copies × a pool of 10 = <b class="do">120</b> &gt; 100</li></ul>${box('', '<code class="i">FATAL: sorry, too many clients already</code> — the incident dissected in Chapter 14.', 'do2')}`, 'r46')}
${(() => { const u = 1090 / 125; return `<svg viewBox="0 0 1100 130" width="1100" height="130" font-family="Arial"><rect x="10" y="30" width="${100 * u}" height="44" rx="6" fill="#eef4fa" stroke="${PG}" stroke-width="3"/><rect x="${10 + 100 * u}" y="30" width="${20 * u}" height="44" rx="6" fill="#fdf0ee" stroke="${DO}" stroke-width="3"/><text x="${10 + 50 * u}" y="60" text-anchor="middle" font-size="22" font-weight="800" fill="${PG}">100 allowed</text><text x="${10 + 110 * u}" y="60" text-anchor="middle" font-size="19" font-weight="800" fill="${DO}">+20</text><line x1="${10 + 100 * u}" y1="14" x2="${10 + 100 * u}" y2="92" stroke="${DO}" stroke-width="3" stroke-dasharray="6 5"/><text x="${10 + 100 * u}" y="116" text-anchor="middle" font-size="19" fill="${DO}">max_connections = 100  ·  12 × 10 = 120 connections wanted</text></svg>`; })()}` },

  { t: 'The journey of one SQL statement', body: `
${hanhTrinh()}
${trongServer()}
<p style="font-size:21px">Inside step 3 the server runs a pipeline: <b>parse</b> the text, <b>plan</b> a strategy, <b>execute</b> it against the files, send the rows back. Chapters 9–10 open up the planner.</p>` },

  { t: 'Send SQL, get a table', to: true, body: `
${psql(`pgcourse=# SELECT title FROM notes WHERE pinned = true ORDER BY created_at DESC, id;
      title
------------------
 Learn PostgreSQL
 Read the manual
(2 rows)`, { hl: [3, 4, 5] })}
${flow([{ t: 'Client', s: 'one line of SQL text', mau: CAM }, { t: 'PostgreSQL', s: 'plans · runs · answers', mau: PG }, { t: 'Result table', s: '1 column · 2 rows', mau: LA }], { h: 150, fs: 22 })}
${two(box('What travelled', '<b>→</b> one line of text. <b>←</b> a small table: 1 column, 2 rows.', 'lam'), box('What did NOT travel', 'No loop, no index name, no “read the file” — only the <b>result you want</b>.', 'xanh'))}` },

  { t: 'SQL is declarative: WHAT, not HOW', to: true, body: `
${vsd(`<p style="font-size:20px;margin:0 0 6px">The usual programming style — you write the <b>how</b>:</p>${sql(`const result = [];
for (const n of notes) {
  if (n.pinned) result.push(n);
}
result.sort((a, b) => b.created - a.created);`, { lang: 'javascript', sm: true })}`,
`<p style="font-size:20px;margin:0 0 6px">SQL — you describe the <b>what</b>:</p>${sql(`SELECT title
FROM notes
WHERE pinned = true
ORDER BY created_at DESC;`, { sm: true })}<p style="font-size:19px;margin:8px 0 0">The planner may scan, use an index, sort — or skip the sort if an index already gives the order.</p>`, 'Imperative — a loop you write', 'Declarative — a result you describe')}
${cards([['🔁 With a loop', 'You are responsible for the <b>correctness AND the speed</b> of every step — and the database only sees one row at a time.'], ['🎯 With SQL', 'The database sees the <b>whole question</b>, so it can reorder, use an index, or run in parallel — things you cannot do from a loop in your app.']], 2)}` },

  { t: 'The planner chooses the how (real plan)', to: true, body: `
${psql(`pgcourse=# EXPLAIN SELECT title FROM notes WHERE pinned = true ORDER BY created_at DESC;
                          QUERY PLAN
---------------------------------------------------------------
 Sort  (cost=14.13..14.33 rows=80 width=426)
   Sort Key: created_at DESC
   ->  Seq Scan on notes  (cost=0.00..11.60 rows=80 width=426)
         Filter: pinned`, { sm: true, hl: [4, 6] })}
${two(`<ul style="font-size:22px"><li>You never wrote <b>Seq Scan</b> or <b>Sort</b> — the planner picked them</li><li><code class="i">EXPLAIN</code> shows the plan <b>without</b> running the query</li></ul>`, box('Chapter 10', 'Reading plans like this is the most valuable skill in the course. Today: just know that a plan exists.', 'xanh'))}` },

  { t: 'Faster without touching the query', body: `
${two(psql(`pgcourse=# EXPLAIN (ANALYZE, COSTS OFF)
pgcourse-# SELECT title FROM big WHERE pinned;
 Seq Scan on big (actual time=0.039..6.386
                  rows=200 loops=1)
   Filter: pinned
   Rows Removed by Filter: 199800
 Execution Time: 6.404 ms`, { sm: true, hl: [3, 7], title: 'before — 200,000 rows' }),
    psql(`pgcourse=# CREATE INDEX big_pinned_idx
pgcourse-#   ON big (id) WHERE pinned;
CREATE INDEX
pgcourse=# EXPLAIN (ANALYZE, COSTS OFF)
pgcourse-# SELECT title FROM big WHERE pinned;
 Index Scan using big_pinned_idx on big
   (actual time=0.010..0.197 rows=200 loops=1)
 Execution Time: 0.218 ms`, { sm: true, hl: [6, 8], title: 'after — same query, new index' }))}
${box('Why declarative matters', 'Same SQL, <b>~29× faster</b> (6.4 ms → 0.22 ms): we changed the <i>how</i> (an index) and never touched the <i>what</i>. Chapters 9–10 teach exactly this.', 'xanh')}` },

  { t: 'A glimpse of why PostgreSQL: rich types', body: `
${psql(`pgcourse=# SELECT
pgcourse-#   '{"lang":"vi","tags":["db","sql"]}'::jsonb  AS data,
pgcourse-#   array[1,2,3]                                 AS nums,
pgcourse-#   '3 days'::interval                           AS span;
                 data                  |  nums   |  span
---------------------------------------+---------+--------
 {"lang": "vi", "tags": ["db", "sql"]} | {1,2,3} | 3 days
(1 row)

pgcourse=# SELECT ('{"lang":"vi","tags":["db","sql"]}'::jsonb) ->> 'lang' AS lang;
 lang
------
 vi
(1 row)`, { sm: true, hl: [6, 7, 13] })}
<p style="font-size:21px">JSON, arrays and intervals are <b>first-class values</b> — you can even reach <i>inside</i> them with <code class="i">-&gt;&gt;</code>. MySQL and SQLite do part of this; PostgreSQL does most, and does it correctly. Chapter 2 covers each type, Chapter 13 digs into JSONB.</p>` },

  { t: 'The through-line: the database of a Notes API', to: true, body: `
${cards([
    ['Ch 1 – 4', 'ONE table: types, constraints, inserting and selecting <code class="i">notes</code>.'],
    ['Ch 5 – 8', 'MANY tables: users, tags, JOINs, aggregates — “notes per user”, “top tag”.'],
    ['Ch 9 – 12', 'MILLIONS of rows: indexes, plans, transactions, triggers.'],
    ['Ch 13 – 16', 'PRODUCTION: JSON fields, search, pools, backup — and the real 248-table schema of this site.'],
  ], 4)}
${box('Same app, two sides', 'Chapter 7 of the <b>Node.js course</b> builds this Notes API from the <i>application</i> side (Prisma, connection pool, N+1). This course builds it from the <i>database</i> side — together they form one complete picture.', 'lam')}
${box('Then the labs', 'From Chapter 3 on, the labs turn it into a bigger project: <b>CT Shop</b> (9 labs).', 'xanh')}` },

  { t: 'Trap: designing tables around today’s SCREENS', body: `
${vsd(`<p style="font-size:21px;margin:0 0 6px">A table that mirrors the current UI:</p>${sql(`CREATE TABLE dashboard_row (
  user_name text, last_note text,
  note_count int, top_tag text
);`, { sm: true })}<p style="font-size:19px;margin:6px 0 0">Looks productive — and locks you in the day the design changes.</p>`,
`<p style="font-size:21px;margin:0 0 6px">Model the <b>things that exist</b>:</p>${sql(`CREATE TABLE users (...);
CREATE TABLE notes (..., user_id ...);
CREATE TABLE tags  (...);`, { sm: true })}<p style="font-size:19px;margin:6px 0 0">The dashboard becomes <b>one query</b> over them. A redesign = a new query, not a migration.</p>`, '✗ shaped like a layout', '✓ shaped like the business')}
${box('Rule of thumb', 'If you can name it in a sentence about the <b>business</b> without the word “page”, it is probably a table: a user, an order, an order line.', 'lam')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why is opening a database connection “expensive”, and what do apps do about it?</li>
<li>What does <code class="i">backend_type = 'client backend'</code> in <code class="i">pg_stat_activity</code> represent?</li>
<li>You added an index and the same SQL got 29× faster. What does that say about SQL being declarative?</li>
</ol>
${box('Answers', '1) a network round trip + login, and each is a server process — apps keep a pool of reused connections. 2) one server process serving one connection. 3) the <i>what</i> never changed; the planner chose a better <i>how</i> once it had a better option.', 'xanh')}` },

  { t: 'Summary', to: true, body: `
<ul>
<li>PostgreSQL is a <b>server</b>; your app is a <b>client</b>; they talk over a socket</li>
<li>Consequences: connections cost, are limited (100), SQL is text, data outlives the app</li>
<li>One connection = <b>one process</b> (<code class="i">pg_stat_activity</code>, <code class="i">pg_backend_pid()</code>)</li>
<li>SQL says <b>what</b>; the planner picks <b>how</b> — and an index changes the how without touching the what</li>
<li>Model the <b>business</b>, not the screens</li>
<li>Next: <b>0.5 — From SQL Server / MySQL to PostgreSQL</b> (shortcut path) or <b>Chapter 1</b> (full path)</li>
</ul>
${box('Practice', 'PostgreSQL track on Code Lab — <b>cuongthai.com/code-lab/postgresql</b>', 'lam')}` },
]);
