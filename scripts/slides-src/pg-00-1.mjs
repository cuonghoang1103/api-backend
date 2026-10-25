/**
 * pg-00-1 — PostgreSQL · Section 0 · Lesson 0.1 "About this course & the full roadmap" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s00-intro.mjs › postgresql-0-1-gioi-thieu. Output psql = chạy thật trên PostgreSQL 17.11 (pgcourse17).
 * Bổ sung so với bài web: Ch17 mới (SQL Server · MySQL · PostgreSQL · MongoDB), 9 lab dự án CT Shop, thi cuối khoá PE/FE, hai đường học.
 */
import { lamDeck, psql, two, box, cards, steps, kw, flow, tbl, c } from './_pg-chung.mjs';

export const deck = { key: 'pg-00-1', code: 'PG 0.1', title: 'About this course & the full roadmap', sub: 'PostgreSQL — from zero to production' };

/* Dòng thời gian lịch sử (SVG) — nhãn đặt theo công thức 0,602 × cỡ chữ. */
const timeline = () => {
  const ev = [
    ['1970s', 'Ingres', 'Stonebraker, UC Berkeley'],
    ['1986', 'POSTGRES', '"post-Ingres" project'],
    ['1994', 'Postgres95', 'Yu & Chen add SQL'],
    ['1996', 'PostgreSQL', 'open source, renamed'],
    ['2024', 'PostgreSQL 17', 'version in this course'],
  ];
  const W = 1110, x0 = 130, step = (W - 280) / (ev.length - 1);
  let s = `<svg viewBox="0 0 ${W} 250" width="${W}" height="250" font-family="Arial">`;
  s += `<line x1="40" y1="120" x2="${W - 30}" y2="120" stroke="#b85a2b" stroke-width="5" stroke-linecap="round"/>`;
  s += `<path d="M${W - 30},108 L${W - 8},120 L${W - 30},132 z" fill="#b85a2b"/>`;
  ev.forEach(([y, t, d], i) => {
    const x = x0 + i * step, mau = i === 3 ? '#336791' : '#e08a1e';
    s += `<circle cx="${x}" cy="120" r="15" fill="#fff" stroke="${mau}" stroke-width="5"/>`;
    s += `<text x="${x}" y="80" text-anchor="middle" font-size="26" font-weight="800" fill="${mau}">${y}</text>`;
    s += `<text x="${x}" y="172" text-anchor="middle" font-size="23" font-weight="700" fill="#333">${t}</text>`;
    s += `<text x="${x}" y="202" text-anchor="middle" font-size="17" fill="#666">${d}</text>`;
  });
  return s + '</svg>';
};

/* Ứng dụng có / không có CSDL (SVG). */
const memVsDisk = () => `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">
  <rect x="10" y="20" width="500" height="190" rx="14" fill="#fdf0ee" stroke="#c0392b" stroke-width="2.5"/>
  <text x="260" y="58" text-anchor="middle" font-size="24" font-weight="800" fill="#a52a1d">App WITHOUT a database</text>
  <rect x="60" y="80" width="170" height="70" rx="10" fill="#fff" stroke="#c0392b" stroke-width="2"/>
  <text x="145" y="122" text-anchor="middle" font-size="20" fill="#333">variables / arrays</text>
  <text x="300" y="112" font-size="40">🔌</text><text x="350" y="112" font-size="22" fill="#a52a1d" font-weight="700">restart</text>
  <text x="260" y="190" text-anchor="middle" font-size="21" fill="#a52a1d">→ everything is gone</text>
  <rect x="600" y="20" width="500" height="190" rx="14" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="2.5"/>
  <text x="850" y="58" text-anchor="middle" font-size="24" font-weight="800" fill="#1f6b40">App WITH PostgreSQL</text>
  <rect x="630" y="80" width="150" height="70" rx="10" fill="#fff" stroke="#2f7d4f" stroke-width="2"/>
  <text x="705" y="122" text-anchor="middle" font-size="20" fill="#333">your app</text>
  <line x1="782" y1="115" x2="900" y2="115" stroke="#2f7d4f" stroke-width="3"/><path d="M900,106 L916,115 L900,124 z" fill="#2f7d4f"/>
  <text x="840" y="104" text-anchor="middle" font-size="17" fill="#1f6b40" font-weight="700">SQL</text>
  <text x="930" y="132" font-size="52">🐘</text><text x="1000" y="112" font-size="20" fill="#333">disk</text><text x="1000" y="138" font-size="28">💾</text>
  <text x="850" y="190" text-anchor="middle" font-size="21" fill="#1f6b40">→ data survives crashes &amp; restarts</text>
</svg>`;

/* Client ↔ server. */
const clientServer = () => flow([
  { t: 'Client', s: 'psql · your app · Prisma', mau: '#e08a1e' },
  { t: 'SQL over the network', s: 'port 5432', mau: '#b85a2b' },
  { t: 'PostgreSQL server', s: 'plans & runs the query', mau: '#336791' },
  { t: 'Data files on disk', s: 'tables, indexes, WAL', mau: '#2f7d4f' },
], { h: 140, fs: 21 });

const chap = (n, t, d, moi = false) => `<div data-k="chap" style="display:flex;gap:10px;align-items:flex-start;padding:5px 8px;border-radius:8px;${moi ? 'background:#fff3c4;' : ''}">` +
  `<span style="flex:0 0 34px;height:34px;border-radius:7px;background:${moi ? '#c0392b' : '#336791'};color:#fff;font-weight:800;font-size:18px;display:flex;align-items:center;justify-content:center">${n}</span>` +
  `<span style="font-size:19px;line-height:1.3"><b>${t}</b><br><span style="color:#666;font-size:16px">${d}</span></span></div>`;
const stage = (h, mau, items) => `<div data-k="stage" style="border:2px solid ${mau};border-radius:12px;padding:8px 10px;display:flex;flex-direction:column;gap:2px">` +
  `<div style="font-weight:800;color:${mau};font-size:18px;letter-spacing:.4px;text-transform:uppercase;margin-bottom:2px">${h}</div>${items.join('')}</div>`;

export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.1' }, [
  { cover: true, t: 'About this course<br>& the full roadmap', sub: 'PostgreSQL — from zero to production.<br>Every query in this course runs on a real server.' },

  { t: 'What you will get from this lesson', body: `
<ul>
<li>What problem a <b>database</b> solves — and the four guarantees PostgreSQL gives you</li>
<li>Where PostgreSQL came from: <b>Berkeley, 1986 → open source, 1996 → PostgreSQL 17 (used in this course)</b></li>
<li>PostgreSQL vs MySQL vs SQLite — and a rule of thumb for choosing</li>
<li>The <b>full roadmap</b>: 4 stages, 17 chapters, 9 labs on one growing project, a final exam</li>
<li>Two ways to study: the full path for beginners, the shortcut if you already know SQL Server/MySQL</li>
</ul>
${box('Promise of this course', 'Not “write some SQL and hope it is fast”, but understand what the database stores on disk, why one query is 1,000× slower than another, and how to make it both correct and fast under real load.', 'lam')}` },

  { t: 'What problem does a database solve?', body: `
${memVsDisk()}
<p>A database is the part of your system that <b>remembers</b>: it keeps data on disk, lets many people read and write at the same time without corrupting it, answers questions in milliseconds, and never lets a half-finished change become permanent.</p>` },

  { t: 'Four guarantees PostgreSQL gives you', body: cards([
    ['💾 Durable storage', 'Write once; it survives crashes, restarts and power loss. This is the “D” in ACID — Chapter 1.'],
    ['⚡ Fast queries', 'Find 20 rows among one million in under a millisecond — if you understand indexes (Chapters 9–10).'],
    ['👥 Many users at once', 'Thousands of concurrent reads and writes, none overwriting another — MVCC, Chapter 11.'],
    ['⚖️ All or nothing', 'A transaction happens completely or not at all. Money never disappears in the middle of a transfer.'],
  ], 2) + box('', `These four ideas come back in almost every chapter. Keep them in mind as the “why” behind each feature.`, 'xanh') },

  { t: 'Where PostgreSQL came from', body: `${timeline()}
<p style="font-size:21px">Professor <b>Michael Stonebraker</b> (Turing Award 2014) built <b>Ingres</b>, then started <b>POSTGRES</b> (“post-Ingres”) in 1986. In 1994 <b>Andrew Yu</b> and <b>Jolly Chen</b> replaced its query language with <b>SQL</b> (Postgres95). In 1996 it became fully open source and was renamed <b>PostgreSQL</b>.</p>` },

  { t: 'Why that history matters to you', body: two(
    `<ul>
<li><b>Community-owned</b>: no single company owns PostgreSQL — it cannot be bought and shut down</li>
<li><b>~30 years</b> of continuous development: decades to make “correctness” really correct</li>
<li><b>Free forever</b>, including commercial use (PostgreSQL License)</li>
<li>A new major version <b>every year</b> (this course uses <b>17</b>)</li>
</ul>`,
    cards([
      ['Who uses it', 'Apple, Instagram, Reddit, Spotify — and the whole backend of cuongthai.com.'],
      ['Why learn it', '“PostgreSQL” and “SQL” sit near the top of most backend job posts; the skills transfer to every SQL database.'],
    ], 1)) },

  { t: 'What PostgreSQL is: a server you talk to in SQL', body: `
${clientServer()}
${two(`<ul style="font-size:21px">
<li>An <b>object-relational</b> database <b>server</b> — a program that runs all the time and waits for connections</li>
<li>You never open its files directly: you send <b>SQL</b>, it plans and runs it, and sends rows back</li>
<li>${kw('psql', 'the official command-line client')} — on the right is a real psql session</li>
</ul>`,
psql(`pgcourse=# SELECT split_part(version(), ' on ', 1) AS version;
                  version
--------------------------------------------
 PostgreSQL 17.11 (Debian 17.11-1.pgdg13+2)
(1 row)`, { sm: true }), 'r46')}` },

  { t: 'PostgreSQL vs MySQL vs SQLite', body: `
<table class="t">
<tr><th style="width:170px"></th><th>SQLite</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td><b>Shape</b></td><td>One file embedded in your app — <b>no server</b></td><td>A server, like Postgres</td><td>A server</td></tr>
<tr><td><b>Best for</b></td><td>Mobile apps, desktop tools, tests</td><td>Classic web apps (PHP/WordPress), read-heavy sites</td><td>Any serious backend; the safe default</td></tr>
<tr><td><b>Strengths</b></td><td>Zero setup, tiny, fast for one user</td><td>Very popular, historically simpler</td><td>Richest types (JSONB, arrays), full-text search, window functions, CTEs, real ACID with MVCC, strong planner</td></tr>
<tr><td><b>Weak spot</b></td><td>Many writers at the same time</td><td>Fewer types, looser by default</td><td>Needs a server to run (Docker makes it easy)</td></tr>
</table>
${box('Rule of thumb', 'Building a web backend and not sure which database to pick? <b>Pick PostgreSQL.</b> You will not outgrow it for a very long time, and the SQL you learn here is standard and portable. (Chapter 17 compares SQL Server · MySQL · PostgreSQL · MongoDB in depth.)', 'xanh')}` },

  { t: 'Course map (1/2) — stages 1 and 2', body: two(
    stage('Stage 1 · Foundations', '#336791', [
      chap(0, 'Introduction & how to study', 'install, psql, the mental model, two study paths'),
      chap(1, 'Why PostgreSQL exists', 'relational model, ACID, client-server'),
      chap(2, 'Data types', 'numeric, text, timestamptz, uuid, enum, array, jsonb'),
      chap(3, 'Tables, constraints & schema design', 'PK/FK, unique, check, identity · <b>Lab 1</b>'),
      chap(4, 'Inserting & querying', 'INSERT, SELECT, WHERE, ORDER BY, LIMIT, UPSERT · <b>Lab 2</b>'),
    ]),
    stage('Stage 2 · Deeper queries', '#e08a1e', [
      chap(5, 'JOINs', 'inner, left, right, full, self, cross'),
      chap(6, 'Aggregation & grouping', 'GROUP BY, HAVING, FILTER · <b>Lab 3</b>'),
      chap(7, 'Subqueries & CTEs', 'correlated, EXISTS, WITH, recursive'),
      chap(8, 'Window functions', 'ROW_NUMBER, RANK, LAG/LEAD, frames · <b>Lab 4</b>'),
    ])) },

  { t: 'Course map (2/2) — stages 3 and 4', body: two(
    stage('Stage 3 · Performance & internals', '#2f7d4f', [
      chap(9, 'Indexes', 'B-tree, composite, covering, partial, GIN, BRIN'),
      chap(10, 'EXPLAIN & the planner', 'scans, joins, statistics, buffers · <b>Lab 5</b>'),
      chap(11, 'Transactions & concurrency', 'MVCC, isolation levels, locks, deadlock'),
      chap(12, 'Functions, triggers & views', 'PL/pgSQL, triggers, materialized views · <b>Lab 6</b>'),
    ]),
    stage('Stage 4 · Production', '#b85a2b', [
      chap(13, 'JSONB & full-text search', 'jsonb operators, GIN, tsvector, trigram · <b>Lab 7</b>'),
      chap(14, 'Connections, pooling & operating', 'PgBouncer, VACUUM, monitoring'),
      chap(15, 'Backup, replication & scaling', 'pg_dump, WAL, PITR, replicas, partitioning · <b>Lab 8</b>'),
      chap(16, 'Production & capstone', 'Prisma migrations, a real schema · <b>Lab 9</b>'),
      chap(17, 'SQL Server · MySQL · PostgreSQL · MongoDB', 'same data, four systems — when to use which', true),
    ])) },

  { t: 'Labs: one real project that grows with you', body: `
<p>Every lab builds on the previous one — the same online shop, <b>CT Shop</b>, from an empty database to a production app.</p>
${tbl(['Lab', 'After', 'You build'], [
  ['1', 'Ch 3', 'Schema: 8 tables, primary/foreign keys, CHECK, UNIQUE, identity'],
  ['2', 'Ch 4', 'Load sample data, 10 queries, safe UPDATE/DELETE'],
  ['3', 'Ch 6', 'JOIN + revenue reports by month and category'],
  ['4', 'Ch 8', 'CTEs + window functions: top-3 per category, month-over-month'],
  ['5', 'Ch 10', '1 million orders: measure EXPLAIN ANALYZE before/after indexes'],
  ['6', 'Ch 12', 'Place an order in a transaction, triggers, views'],
  ['7', 'Ch 13', 'Product attributes in JSONB + product search'],
  ['8', 'Ch 15', 'Backup/restore, read-only role, a streaming replica'],
  ['9', 'Ch 16', 'Capstone: a Node.js + Prisma app on CT Shop'],
])}
<p class="nho">Each lab: brief · requirements · downloadable SQL · step-by-step guide · solution · solution video. Final exam: practical (PE) + multiple choice (FE).</p>` },

  { t: 'Two ways to study this course', body: two(
    box('Full path — new to databases', steps([
      'Section 0 → Chapter 17, <b>in order</b>',
      'Type and run every query yourself',
      'Do every lab and every chapter quiz',
      'Finish with the final exam (PE + FE)',
    ]), 'lam'),
    box('Shortcut — already know SQL Server / MySQL (e.g. DBI202)', steps([
      'Lesson <b>0.5 “From SQL Server/MySQL to PostgreSQL”</b>',
      'Skim Chapters 2–7 (lessons tagged <i>“Know SQL Server? You can skim”</i>)',
      'Study Chapters 8–17 carefully',
      'Still do <b>all labs</b> + the final exam',
    ])) + `<p class="nho">General theory (ERD, normalization, keys) is explained briefly here, with “go deeper” links to the DBI202 course. Lesson 0.2 shows both paths in detail.</p>`) },

  { t: 'Who this course is for — and the time it takes', body: two(`
<ul>
<li><b>No database experience needed.</b> If you can use a terminal and have written a little code in any language, you are ready</li>
<li>Chapter 1 starts from zero</li>
<li>Took the Node.js course (Chapter 7, Prisma)? This goes deep into the database behind it</li>
</ul>`, cards([
    ['⏱ Time budget', '≈ 2–3 hours per chapter if you type and run every query → 17 chapters ≈ 45–55 hours.'],
    ['🎯 The real goal', 'Look at a slow query, read its plan, and know exactly what to fix — not “finish the course”.'],
  ], 1)) },

  { t: 'This website runs on PostgreSQL', body: two(`
<ul>
<li><b>cuongthai.com</b> runs on PostgreSQL in production</li>
<li>≈ <b>248 tables</b>, <b>95 migrations</b>, a <b>6,980-line</b> schema</li>
<li>Every user, post, message, course and note you see lives there</li>
<li>When a chapter says “this is how it is done in production”, it means <b>here</b></li>
</ul>`, box('A real production bug you will dissect (Chapter 14)', `<p style="font-size:22px;margin:0">12 app instances × connection pool of 10<br>= <b class="do">120 connections</b> &gt; server limit <b>100</b></p><p style="font-size:19px;margin:6px 0 0">⇒ <code>53300: sorry, too many clients already</code></p>`, 'do2')) },

  { t: 'Trap: “we can switch the database later”', body: two(
    `<p>“Start with SQLite, move to Postgres when we grow” sounds careful — and is often the <b class="do">most expensive decision of the whole project</b>.</p>
<ul>
<li><b>Data outlives code.</b> You can replace every service, framework and language while the schema stays</li>
<li>You <b>cannot</b> replace the schema while the data stays</li>
<li>Migrating a live database = a <b>one-way door</b>: downtime, dual writes, a reload — measured in <b>weeks</b></li>
</ul>`,
    box('Do this instead', 'Choose PostgreSQL on day one. It costs nothing extra: every provider’s free tier has it, and the SQL you write is <b>more</b> portable, not less.', 'xanh')) },

  { t: 'Check yourself', body: `
<ol>
<li>Name the four guarantees a database gives an application. Which letter of ACID is “survives a power loss”?</li>
<li>Who started the POSTGRES project, in which year — and why was it renamed <b>PostgreSQL</b> in 1996?</li>
<li>You build a mobile note app that works offline for one user. SQLite or PostgreSQL? And for the web backend of a shop with thousands of users?</li>
</ol>
${box('Answers', '1) durable storage · fast queries · many users at once · all-or-nothing — “D” = Durability. 2) Michael Stonebraker, 1986 at UC Berkeley; renamed because it now spoke SQL. 3) SQLite on the phone (one file, no server); PostgreSQL for the shop backend (many concurrent writers, ACID, rich types).', 'xanh')}` },

  { t: 'Summary', body: `
<ul>
<li>A database <b>remembers</b>: durable, fast, many users, all-or-nothing</li>
<li>PostgreSQL: Berkeley 1986 → open source 1996 → a new major version every year; owned by the community</li>
<li>Default choice for a web backend; SQLite for embedded, MySQL is the other big server</li>
<li>17 chapters in 4 stages + 9 labs on <b>CT Shop</b> + a final exam</li>
<li>Next: <b>0.2 — How to study this course</b> (the full path and the shortcut in detail)</li>
</ul>
${box('Practice', 'PostgreSQL track on Code Lab — <b>cuongthai.com/code-lab</b> · Official docs: <b>postgresql.org/docs</b>', 'lam')}` },
]);
