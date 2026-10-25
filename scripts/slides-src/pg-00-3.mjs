/**
 * pg-00-3 — PostgreSQL · Section 0 · Lesson 0.3 "Installing PostgreSQL & meeting psql" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s00-intro.mjs › postgresql-0-3-cai-dat. Mọi output = chạy thật (PostgreSQL 17.11 trong container pgcourse17;
 * phần Docker/lỗi kết nối chạy thật trên máy này) — lưu ở video-bai-giang/src/khung/pg/that/pg-00-3{,b,c}.{sql,out.txt}.
 * Khác bài web: bài web dùng postgres:15 + cổng 5433; slide dùng postgres:17 + cổng 5444 (cổng 5433 trên máy đo đã bận — đó chính là lỗi
 * "port is already allocated" ở slide 10).
 */
import { lamDeck, sql, sh, psql, run, two, box, cards as cards0, steps, kw, flow, tbl, vsd, c } from './_pg-chung.mjs';

/* <b> trong .card bị khung render phóng to thành khối riêng ⇒ đổi sang span đậm (báo cáo cho phiên điều phối). */
const cards = (items, cot) => cards0(items.map(([h, p]) => [h, p.replace(/<b>/g, '<span style="font-weight:800;color:#262626">').replace(/<\/b>/g, '</span>')]), cot);

export const deck = { key: 'pg-00-3', code: 'PG 0.3', title: 'Installing PostgreSQL & meeting psql', sub: 'Docker, native install, connection strings, first queries' };

const NAU = '#b85a2b', PG = '#336791', CAM = '#e08a1e', LA = '#2f7d4f', DO = '#c0392b';

/* Chuỗi kết nối tô màu từng phần + nhãn (SVG, chữ mã 0,602 × 28). */
const uri = () => {
  const fs = 28, cw = fs * 0.602, x0 = 20, y = 70;
  const parts = [['postgresql://', '#777', 'scheme', 0], ['postgres', PG, 'user', 1], [':', '#777', '', 0], ['123456', DO, 'password', 2], ['@', '#777', '', 0], ['localhost', LA, 'host', 1], [':', '#777', '', 0], ['5444', CAM, 'port', 2], ['/', '#777', '', 0], ['postgres', NAU, 'database', 1]];
  let x = x0, s = `<svg viewBox="0 0 1110 240" width="1110" height="240" font-family="Arial">`;
  parts.forEach(([t, m, lab, row]) => {
    const w = t.length * cw;
    s += `<text data-k="uri" x="${x}" y="${y}" font-family="Menlo,Consolas,monospace" font-size="${fs}" font-weight="700" fill="${m}" xml:space="preserve">${t}</text>`;
    if (lab) {
      const cx = x + w / 2, ly = 118 + row * 48;
      s += `<line x1="${x + 2}" y1="${y + 12}" x2="${x + w - 2}" y2="${y + 12}" stroke="${m}" stroke-width="4"/>`;
      s += `<line x1="${cx}" y1="${y + 12}" x2="${cx}" y2="${ly - 24}" stroke="${m}" stroke-width="2"/>`;
      s += `<text x="${cx}" y="${ly}" text-anchor="middle" font-size="22" font-weight="800" fill="${m}">${lab}</text>`;
    }
    x += w;
  });
  return s + '</svg>';
};

/* Ba cấp: máy chủ ⊃ cơ sở dữ liệu ⊃ lược đồ ⊃ bảng (SVG lồng nhau). */
const baCap = () => `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">
  <rect data-k="cap" x="8" y="8" width="1094" height="314" rx="18" fill="#eef4fa" stroke="${PG}" stroke-width="4"/>
  <text x="30" y="46" font-size="26" font-weight="800" fill="${PG}">🖥️ SERVER (one PostgreSQL instance · port 5432)</text>
  <rect data-k="cap" x="30" y="66" width="190" height="80" rx="12" fill="#fff" stroke="#999" stroke-width="2.5"/><text x="125" y="114" text-anchor="middle" font-size="22" fill="#555">template1</text>
  <rect data-k="cap" x="30" y="164" width="190" height="80" rx="12" fill="#fff" stroke="#999" stroke-width="2.5"/><text x="125" y="212" text-anchor="middle" font-size="22" fill="#555">postgres</text>
  <rect data-k="cap" x="250" y="66" width="836" height="240" rx="14" fill="#fffaf0" stroke="${CAM}" stroke-width="4"/>
  <text x="270" y="100" font-size="24" font-weight="800" fill="${NAU}">🗄️ DATABASE  pgcourse</text>
  <rect x="280" y="120" width="780" height="168" rx="12" fill="#fff" stroke="${LA}" stroke-width="3"/>
  <text x="300" y="152" font-size="22" font-weight="800" fill="${LA}">📁 SCHEMA  public</text>
  <rect data-k="cap" x="310" y="172" width="210" height="96" rx="10" fill="#f1f9f4" stroke="${LA}" stroke-width="2.5"/>
  <text x="415" y="208" text-anchor="middle" font-size="22" font-weight="700" fill="#1f6b40">📋 TABLE</text><text x="415" y="242" text-anchor="middle" font-size="26" font-family="Menlo,monospace" fill="#333">notes</text>
  <rect data-k="cap" x="545" y="172" width="210" height="96" rx="10" fill="#f1f9f4" stroke="${LA}" stroke-width="2.5"/>
  <text x="650" y="208" text-anchor="middle" font-size="22" font-weight="700" fill="#1f6b40">📋 TABLE</text><text x="650" y="242" text-anchor="middle" font-size="26" font-family="Menlo,monospace" fill="#333">users …</text>
  <text x="900" y="226" text-anchor="middle" font-size="22" fill="#666">connected to ONE database</text>
  <text x="900" y="254" text-anchor="middle" font-size="22" fill="#666">at a time</text>
</svg>`;

/* Bảng đường đi: terminal → localhost:5444 → ánh xạ cổng → container. */
const duongDi = () => flow([
  { t: 'psql', s: 'in your terminal', mau: CAM },
  { t: 'localhost : 5444', s: 'host port (yours)', mau: NAU },
  { t: 'port mapping', s: '5444 → 5432', mau: '#7a5a9a' },
  { t: 'container', s: 'PostgreSQL 17 · :5432', mau: PG },
], { h: 140, fs: 21 });

export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.3' }, [
  { cover: true, t: 'Installing PostgreSQL<br>&amp; meeting psql', sub: 'Run a real server in one command,<br>connect, and send your first SQL.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Three ways to get a PostgreSQL server — and why we use <b>Docker</b></li>
<li>Start a <b>PostgreSQL 17</b> server with one command, and keep its data safe</li>
<li>Connect with <b>psql</b> using flags or a <b>connection string</b></li>
<li>Read the three most common connection errors</li>
<li>Server → database → schema → table, your first table, and the psql <b>meta-commands</b></li>
</ul>
${box('Goal', 'By the end you have a working server on your own machine and you have typed your first real queries.', 'lam')}` },

  { t: 'Three ways to get a PostgreSQL server', to: true, body: cards([
    ['🐳 Docker  (this course)', 'One command, nothing installed on your system, and <code class="i">docker rm</code> undoes it. Break it, rebuild it in seconds.'],
    ['💻 Native install', 'Runs all the time, a bit faster, but adds a service with its own user, data folder and upgrade path. Worth it once Postgres is daily work.'],
    ['☁️ Managed cloud', 'Free tiers, nothing to install. But every query has network latency, and you cannot read server logs or config — Chapter 10 needs both.'],
  ], 3) + box('Rule', 'Learning ⇒ Docker. Production ⇒ a managed service or a server you run properly. The SQL you type is identical in all three.', 'xanh') },

  { t: 'Docker in three words', to: true, body: two(`
<ul>
<li><b>Image</b> — a frozen recipe: “PostgreSQL 17 on Debian”, downloaded once (<code class="i">postgres:17</code>)</li>
<li><b>Container</b> — a running copy of that recipe: the actual server process</li>
<li><b>Port mapping</b> — a door from your machine into the container: <code class="i">-p 5444:5432</code></li>
</ul>`, cards([
    ['🍳 Everyday picture', 'Image = recipe card. Container = the dish you cooked from it. Cook ten dishes, the card never changes.'],
  ], 1)) + duongDi() },

  { t: 'Option A — one command (Docker)', body: `
${sh(`$ docker run -d --name pgdemo \\
    -e POSTGRES_PASSWORD=123456 \\
    -p 5444:5432 \\
    -v pgdemo_data:/var/lib/postgresql/data \\
    postgres:17
deb4c40c90542456d24a775b65e50f4c207cfc497bce14d6a9b020d6e827bbdf`, { hl: [2, 3, 4], sm: false })}
<table class="t" style="font-size:19px">
<tr><td style="width:300px"><code class="i">-d --name pgdemo</code></td><td>run in the background, call it <b>pgdemo</b></td></tr>
<tr><td><code class="i">-e POSTGRES_PASSWORD=…</code></td><td>password of the superuser <b>postgres</b></td></tr>
<tr><td><code class="i">-p 5444:5432</code></td><td>machine port <b>5444</b> → container port <b>5432</b> (Postgres’ own port)</td></tr>
<tr><td><code class="i">-v pgdemo_data:/var/lib…</code></td><td>keep the data in a <b>named volume</b> (next slides)</td></tr>
</table>` },

  { t: 'Is it running?', to: true, body: `
${sh(`$ docker ps --filter name=pgdemo
NAMES     IMAGE         STATUS         PORTS
pgdemo    postgres:17   Up 8 seconds   0.0.0.0:5444->5432/tcp, [::]:5444->5432/tcp

$ docker logs pgdemo 2>&1 | tail -3
LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
LOG:  database system was shut down at 2026-10-25 10:47:55 UTC
LOG:  database system is ready to accept connections`, { hl: [3, 7] })}
${two(box('✓ Healthy when', '<code class="i">docker ps</code> says <b>Up</b> and the log ends with <b>ready to accept connections</b>.', 'xanh'), box('Not yet?', 'The first start takes a few seconds while the data folder is created. Run <code class="i">docker logs</code> again before you worry.', 'lam'))}` },

  { t: 'Trap: <code>docker rm</code> and the data is gone', body: `
${vsd(`${sh(`$ docker run -d --name pgdemo2 \\
    -e POSTGRES_PASSWORD=123456 \\
    -p 5444:5432 postgres:17
… CREATE TABLE keep … INSERT 42
$ docker rm -f pgdemo2
$ docker run … (a new one)
=> SELECT * FROM keep;
ERROR:  relation "keep" does not exist`, { sm: true, hl: [8] })}`,
`${sh(`$ docker run -d --name pgdemo \\
    -e POSTGRES_PASSWORD=123456 \\
    -p 5444:5432 \\
    -v pgdemo_data:/var/lib/postgresql/data \\
    postgres:17
… CREATE TABLE keep … INSERT 42
$ docker rm -f pgdemo   (volume stays)
$ docker run … (same -v again)
=> SELECT * FROM keep;
  x
 42`, { sm: true, hl: [10, 11] })}`, '✗ no volume — data lives inside the container', '✓ named volume — data outlives the container')}
<p style="font-size:21px">Always start with <code class="i">-v name:/var/lib/postgresql/data</code>. It is the difference between a restart and a restore from backup.</p>
${two(sh(`$ docker volume ls --filter name=pgdemo
DRIVER    VOLUME NAME
local     pgdemo_data`, { sm: true, hl: [3] }), box('After <code class="i">docker rm</code>', 'Container gone — the <b>volume</b> <code class="i">pgdemo_data</code> still holds the tables.', 'lam'))}` },

  { t: 'Option B — a native install', body: `
<table class="t">
<tr><th style="width:170px">System</th><th>How</th><th style="width:360px">After it</th></tr>
<tr><td><b>macOS</b></td><td><code class="i">brew install postgresql@17</code> then <code class="i">brew services start postgresql@17</code> — or the one-click app <b>Postgres.app</b></td><td rowspan="3">a service listens on port <b>5432</b>; <code class="i">psql</code> is installed with it</td></tr>
<tr><td><b>Ubuntu / Debian</b></td><td><code class="i">sudo apt install postgresql</code> — it starts by itself</td></tr>
<tr><td><b>Windows</b></td><td>the <b>EnterpriseDB</b> installer from postgresql.org: server + psql + pgAdmin in one</td></tr>
</table>
${two(box('Client ≠ server', '<code class="i">psql</code> is only the <b>client</b>. A psql 14 can talk to a server 17 (and the reverse). Check yours:', 'lam'), sh(`$ psql -V
psql (PostgreSQL) 14.19 (Homebrew)`, { sm: true }))}
<p class="nho">Whichever you pick, the rest of the lesson is identical — only the port in the connection changes (5432 for a native install).</p>` },

  { t: 'Connect: the anatomy of a connection', to: true, body: `
${uri()}
${two(sh(`$ psql "postgresql://postgres@localhost:5444/postgres"
postgres=#`, { sm: true }), sh(`$ psql -h localhost -p 5444 -U postgres -d postgres
Password for user postgres:`, { sm: true }))}
<p style="font-size:21px">Two spellings of the same thing. Skip the password in the URL — psql asks for it (or reads <code class="i">PGPASSWORD</code>), so it never lands in your shell history.</p>` },

  { t: 'Three errors you will meet — and what they mean', body: `
<table class="t" style="font-size:19px">
<tr><th style="width:42%">What psql says (real)</th><th>Meaning</th><th style="width:30%">Fix</th></tr>
<tr><td><code class="i">FATAL:  password authentication failed for user "postgres"</code></td><td>The server is there; the <b>password</b> is wrong</td><td>retype it · check <code class="i">POSTGRES_PASSWORD</code></td></tr>
<tr><td><code class="i">FATAL:  database "nodb" does not exist</code></td><td>Logged in fine; that <b>database name</b> is wrong</td><td><code class="i">\\l</code> to list them</td></tr>
<tr><td><code class="i">port 5999 failed: Connection refused</code></td><td>Nothing is <b>listening</b> on that port</td><td><code class="i">docker ps</code> — wrong port, or not started</td></tr>
<tr><td><code class="i">Bind for 127.0.0.1:5433 failed: port is already allocated</code></td><td>(at <code class="i">docker run</code>) that <b>machine port</b> is taken</td><td>pick another: <code class="i">-p 5444:5432</code></td></tr>
</table>
${box('Read errors top to bottom', 'Each message tells you <i>which layer</i> failed: network (refused) → login (password) → database (does not exist). Fix that layer, not the one above it.', 'xanh')}` },

  { t: 'Connected — who am I talking to?', body: `
${psql(`pgcourse=# \\conninfo
You are connected to database "pgcourse" as user "postgres" on host "127.0.0.1" at port "5432".

pgcourse=# SELECT split_part(version(), ' on ', 1) AS version;
                  version
--------------------------------------------
 PostgreSQL 17.11 (Debian 17.11-1.pgdg13+2)
(1 row)`, { hl: [2, 7] })}
${two(box('Good habit', 'Run <code class="i">\\conninfo</code> before anything that could destroy data — it takes one second and tells you <b>which</b> server and database you are on.', 'xanh'), box('The prompt', '<code class="i">pgcourse=#</code> = ready · database name · <code class="i">#</code> means superuser (<code class="i">&gt;</code> for a normal user).', 'lam'))}` },

  { t: 'Server → database → schema → table', to: true, body: `${baCap()}
<p style="font-size:21px">One server holds many <b>databases</b>; each holds <b>schemas</b> (folders; the default is <code class="i">public</code>); each holds <b>tables</b>. You are always inside exactly one database.</p>` },

  { t: 'Your own database: CREATE DATABASE and \\c', body: `
${psql(`pgcourse=# CREATE DATABASE demo03;
CREATE DATABASE
pgcourse=# \\c demo03
You are now connected to database "demo03" as user "postgres".
demo03=# \\conninfo
You are connected to database "demo03" as user "postgres" on host "127.0.0.1" at port "5432".
demo03=# \\c pgcourse
You are now connected to database "pgcourse" as user "postgres".
pgcourse=# DROP DATABASE demo03;
DROP DATABASE`, { hl: [4, 7] })}
${two(`<ul style="font-size:22px"><li>The prompt follows you: <code class="i">demo03=#</code></li><li><code class="i">\\c name</code> switches database <b>inside</b> psql</li></ul>`, box('Throw-away is cheap', 'Create, test, <code class="i">DROP DATABASE</code>. A database you can rebuild in seconds is a database you are not afraid of.', 'xanh'))}` },

  { t: 'Your first table and first query', body: `
${sql(`CREATE TABLE notes (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      varchar(200) NOT NULL,
  body       text,
  pinned     boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO notes (title, body) VALUES
  ('Learn PostgreSQL', 'Day one'), ('Buy coffee', NULL),
  ('Read the manual', 'The EXPLAIN chapter');`, { sm: true })}
${psql(`CREATE TABLE
INSERT 0 3`, { sm: true })}
${box('Running example', 'This <code class="i">notes</code> table follows us through the first chapters — the same Notes app as the Node.js course. Every column is explained in Chapter 2.', 'lam')}` },

  { t: 'Reading the result', body: `
${tbl(['id', 'title', 'pinned', 'created_at'], [
    ['1', 'Learn PostgreSQL', 'f', '2026-10-25 17:42:46.311212+07'],
    ['2', 'Buy coffee', 'f', '2026-10-25 17:42:46.311212+07'],
    ['3', 'Read the manual', 'f', '2026-10-25 17:42:46.311212+07']], { cap: 'SELECT id, title, pinned, created_at FROM notes ORDER BY id;  — real output', o: [[0, 0], [1, 0], [2, 0], [0, 2], [0, 3], [1, 3], [2, 3]] })}
${cards([
    ['id: 1, 2, 3', 'Filled automatically — <code class="i">GENERATED ALWAYS AS IDENTITY</code>. You never typed it.'],
    ['pinned: f', 'Not in the INSERT, so the <b>DEFAULT</b> false was used.'],
    ['created_at: identical', '<code class="i">now()</code> returns the time the <b>transaction</b> started — one value for all 3 rows.'],
  ], 3)}` },

  { t: 'psql meta-commands: the daily toolkit', body: `
<table class="t">
<tr><th style="width:210px">Command</th><th>What it does</th></tr>
<tr><td><code class="i">\\l</code></td><td>list all databases on the server</td></tr>
<tr><td><code class="i">\\c dbname</code></td><td>connect to (switch into) another database</td></tr>
<tr><td><code class="i">\\dt</code></td><td>list the tables of the current database</td></tr>
<tr><td><code class="i">\\d table</code></td><td>describe a table: columns, types, defaults, indexes</td></tr>
<tr><td><code class="i">\\x</code></td><td>expanded display — one column per line (great for wide rows)</td></tr>
<tr><td><code class="i">\\timing</code></td><td>print how long every statement took</td></tr>
<tr><td><code class="i">\\? · \\h CREATE TABLE</code></td><td>help on psql commands · help on SQL syntax</td></tr>
<tr><td><code class="i">\\q</code></td><td>quit psql</td></tr>
</table>
${box('Not SQL', 'A backslash command is a <b>shortcut of the client</b> (psql), never sent to the server — that is why it needs no semicolon.', 'lam')}` },

  { t: '\\dt and \\d — see what you built', body: `
${psql(`pgcourse=# \\dt
         List of relations
 Schema | Name  | Type  |  Owner
--------+-------+-------+----------
 ch00   | notes | table | postgres
(1 row)

pgcourse=# \\d notes
                                     Table "ch00.notes"
   Column   |           Type           | Collation | Nullable |           Default
------------+--------------------------+-----------+----------+------------------------------
 id         | bigint                   |           | not null | generated always as identity
 title      | character varying(200)   |           | not null |
 body       | text                     |           |          |
 pinned     | boolean                  |           | not null | false
 created_at | timestamp with time zone |           | not null | now()
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)`, { sm: true, hl: [17, 18] })}
<p style="font-size:20px;margin:0">PostgreSQL created the index <code class="i">notes_pkey</code> for the primary key <b>by itself</b> (Chapter 9).</p>` },

  { t: '\\x and \\timing — wide rows, and how long', body: two(
    psql(`pgcourse=# \\x
Expanded display is on.
pgcourse=# SELECT * FROM notes WHERE id = 1;
-[ RECORD 1 ]-----------------------------
id         | 1
title      | Learn PostgreSQL
body       | Day one
pinned     | f
created_at | 2026-10-25 17:42:46.311212+07`, { sm: true }),
    psql(`pgcourse=# \\x
Expanded display is off.
pgcourse=# \\timing on
Timing is on.
pgcourse=# SELECT count(*) FROM notes;
 count
-------
     3
(1 row)

Time: 0.426 ms`, { sm: true, hl: [11] })) + box('When to use which', '<code class="i">\\x</code> when a row is wider than your screen — the table wraps into an unreadable mess. <code class="i">\\timing</code> when you compare two versions of the same query (Chapters 9–10).', 'lam') },

  { t: 'Help is built in: \\h and \\?', body: `
${psql(`pgcourse=# \\h DROP DATABASE
Command:     DROP DATABASE
Description: remove a database
Syntax:
DROP DATABASE [ IF EXISTS ] name [ [ WITH ] ( option [, ...] ) ]

where option can be:

    FORCE

URL: https://www.postgresql.org/docs/17/sql-dropdatabase.html`, { sm: true })}
${two(cards([['\\h <i>COMMAND</i>', 'The exact syntax of any SQL command — offline, for <b>your</b> server version.']], 1), cards([['\\?', 'Every psql backslash command, grouped: General · Help · Query Buffer · Input/Output …']], 1))}` },

  { t: 'Traps: the missing semicolon — and “why not a GUI?”', body: two(
    `${psql(`pgcourse=# SELECT count(*)
pgcourse-# FROM notes
pgcourse-# ;
 count
-------
     3`, { sm: true, hl: [2, 3] })}
<p style="font-size:24px">The prompt changed from <code class="i">=#</code> to <b><code class="i">-#</code></b>: psql is <b>still waiting</b> for the end of the statement. Type <code class="i">;</code> and Enter.</p>
${box('Why it exists', 'A statement may span many lines, so the server cannot guess where it ends — <code class="i">;</code> means “send it now”.', 'lam')}`,
    `${cards([
      ['pgAdmin · DBeaver · TablePlus', 'Pleasant tools — use them later.'],
      ['Learn psql first', 'It is on <b>every</b> server, needs no install, and is what you open at 2 a.m. when something is on fire.'],
    ], 1)}
${box('What only psql gives you', `<span style="font-size:21px">over <b>SSH</b> on a screenless server · whole files: <code class="i">psql -f setup.sql</code> · scripts, CI, backups</span>`, 'xanh')}`) },

  { t: 'Exercise — your own database', to: true, body: `
${steps([
    'Start a PostgreSQL 17 container with <b>a named volume</b> and a host port that is free',
    'Connect with psql and run <code class="i">\\conninfo</code>',
    'Create a database <code class="i">shop</code> and switch into it',
    'Create a table <code class="i">product(id, name, price)</code>, insert 2 rows, read them back',
    'Describe the table with <code class="i">\\d product</code>, then quit with <code class="i">\\q</code>',
  ])}
${box('Solution (outline)', `<code class="i">docker run -d --name pg -e POSTGRES_PASSWORD=… -p 5444:5432 -v pgdata:/var/lib/postgresql/data postgres:17</code> → <code class="i">psql "postgresql://postgres@localhost:5444/postgres"</code> → <code class="i">CREATE DATABASE shop; \\c shop</code> → <code class="i">CREATE TABLE product (id int PRIMARY KEY, name text, price numeric(10,2));</code> …`, 'xanh')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why do we run PostgreSQL in Docker for learning, and what does <code class="i">-p 5444:5432</code> mean?</li>
<li>You <code class="i">docker rm</code> the container and your tables are gone. What flag was missing?</li>
<li>psql prints <code class="i">pgcourse-#</code> and nothing happens. What is wrong?</li>
</ol>
${box('Answers', '1) one command, nothing installed, disposable; machine port 5444 → container port 5432. 2) <code class="i">-v name:/var/lib/postgresql/data</code> (a named volume). 3) The statement has no <code class="i">;</code> yet — type it and press Enter.', 'xanh')}` },

  { t: 'Summary', to: true, body: `
<ul>
<li>Server options: <b>Docker</b> (learning) · native · managed cloud — the SQL is identical</li>
<li><code class="i">docker run … -p host:5432 -v volume:… postgres:17</code> — and <b>always</b> a volume</li>
<li>Connect with flags or <code class="i">postgresql://user@host:port/db</code>; read the error layer by layer</li>
<li>Server ⊃ database ⊃ schema ⊃ table · <code class="i">\\l \\c \\dt \\d \\x \\timing \\q</code> · <code class="i">\\h</code> for syntax</li>
<li>Next: <b>0.4 — The mental model: a server you talk to in SQL</b></li>
</ul>
${box('Practice', 'PostgreSQL track on Code Lab — <b>cuongthai.com/code-lab/postgresql</b> (it walks through this same setup).', 'lam')}` },
]);
