/**
 * pg-01-1 — PostgreSQL · Chapter 1 · Lesson 1.1 "The relational model & why it won" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s01-vi-sao.mjs › postgresql-1-1-mo-hinh-quan-he. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-01-1.out.txt). Bổ sung: ví dụ sổ ghi chép đời thường, ERD Crow's Foot, JOIN khâu dòng, FK chặn cả xoá.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-01-1', code: 'PG 1.1', title: 'The relational model & why it won', sub: 'Tables, keys and relationships' };

/* Sổ ghi chép: một "bảng" ngoài đời. */
const notebook = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <g data-k="nb"><rect x="30" y="20" width="470" height="260" rx="12" fill="#fffaf0" stroke="#b85a2b" stroke-width="3"/>
  <text x="265" y="55" text-anchor="middle" font-size="24" font-weight="800" fill="#b85a2b">📒 Class register (paper)</text>
  <line x1="50" y1="72" x2="480" y2="72" stroke="#b85a2b" stroke-width="2"/>
  <text x="62" y="102" font-size="21" font-weight="700" fill="#555">No.</text><text x="140" y="102" font-size="21" font-weight="700" fill="#555">Name</text><text x="330" y="102" font-size="21" font-weight="700" fill="#555">Phone</text>
  <line x1="50" y1="112" x2="480" y2="112" stroke="#ccc" stroke-width="1.5"/>
  <text x="62" y="146" font-size="21" fill="#333">1</text><text x="140" y="146" font-size="21" fill="#333">Cuong</text><text x="330" y="146" font-size="21" fill="#333">090…</text>
  <line x1="50" y1="158" x2="480" y2="158" stroke="#ccc" stroke-width="1.5"/>
  <text x="62" y="192" font-size="21" fill="#333">2</text><text x="140" y="192" font-size="21" fill="#333">Mai</text><text x="330" y="192" font-size="21" fill="#333">091…</text>
  <line x1="50" y1="204" x2="480" y2="204" stroke="#ccc" stroke-width="1.5"/>
  <text x="62" y="238" font-size="21" fill="#333">3</text><text x="140" y="238" font-size="21" fill="#333">An</text><text x="330" y="238" font-size="21" fill="#333">098…</text></g>
  <path d="M520,150 L585,150" stroke="#e08a1e" stroke-width="5"/><path d="M585,134 L615,150 L585,166 z" fill="#e08a1e"/>
  <g data-k="tb"><rect x="640" y="20" width="440" height="260" rx="12" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="860" y="55" text-anchor="middle" font-size="24" font-weight="800" fill="#336791">🐘 PostgreSQL table <tspan font-family="Menlo,monospace">students</tspan></text>
  <rect x="660" y="72" width="400" height="38" fill="#336791"/>
  <text x="680" y="98" font-size="20" font-weight="700" fill="#fff" font-family="Menlo,monospace">id</text><text x="750" y="98" font-size="20" font-weight="700" fill="#fff" font-family="Menlo,monospace">name</text><text x="900" y="98" font-size="20" font-weight="700" fill="#fff" font-family="Menlo,monospace">phone</text>
  <g font-family="Menlo,monospace" font-size="20" fill="#333"><text x="680" y="140">1</text><text x="750" y="140">Cuong</text><text x="900" y="140">090…</text>
  <text x="680" y="186">2</text><text x="750" y="186">Mai</text><text x="900" y="186">091…</text><text x="680" y="232">3</text><text x="750" y="232">An</text><text x="900" y="232">098…</text></g>
  <line x1="660" y1="152" x2="1060" y2="152" stroke="#c9d5e2"/><line x1="660" y1="198" x2="1060" y2="198" stroke="#c9d5e2"/></g>
</svg>`;

/* Bảng/dòng/cột chú thích. */
const anatomy = () => `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">
  <rect x="240" y="60" width="620" height="44" fill="#336791"/>
  <g font-family="Menlo,monospace" font-size="22" font-weight="700" fill="#fff"><text x="262" y="90">id</text><text x="352" y="90">username</text><text x="560" y="90">email</text></g>
  <g font-family="Menlo,monospace" font-size="22" fill="#333">
  <rect x="240" y="104" width="620" height="44" fill="#fff3c4" stroke="#e08a1e" stroke-width="3" data-k="row"/>
  <text x="262" y="134">1</text><text x="352" y="134">cuong</text><text x="560" y="134">cuong@example.com</text>
  <rect x="240" y="148" width="620" height="44" fill="#fff" stroke="#c9d5e2" stroke-width="1.5"/>
  <text x="262" y="178">2</text><text x="352" y="178">mai</text><text x="560" y="178">mai@example.com</text></g>
  <rect x="340" y="56" width="190" height="140" fill="none" stroke="#2f7d4f" stroke-width="3.5" stroke-dasharray="8 5" data-k="col"/>
  <text x="435" y="226" text-anchor="middle" font-size="22" font-weight="800" fill="#2f7d4f">COLUMN = one attribute, one fixed type</text>
  <path d="M868,126 L905,126" stroke="#e08a1e" stroke-width="3.5"/><path d="M898,118 L912,126 L898,134 z" fill="#e08a1e"/>
  <text x="920" y="120" font-size="22" font-weight="800" fill="#b85a2b">ROW</text><text x="920" y="146" font-size="19" fill="#666">one user</text>
  <text x="550" y="38" text-anchor="middle" font-size="22" font-weight="800" fill="#336791">TABLE <tspan font-family="Menlo,monospace">users</tspan> = one kind of thing</text>
</svg>`;

/* ERD Crow's Foot: users ||──o{ notes. */
const erd = () => `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">
  <g data-k="e-users"><rect x="60" y="40" width="330" height="240" rx="6" fill="#fff" stroke="#336791" stroke-width="3"/>
  <rect x="60" y="40" width="330" height="48" rx="6" fill="#336791"/><text x="225" y="73" text-anchor="middle" font-size="26" font-weight="800" fill="#fff" font-family="Menlo,monospace">users</text>
  <g font-family="Menlo,monospace" font-size="21" fill="#333"><text x="80" y="128" font-weight="800" fill="#b85a2b">PK</text><text x="135" y="128">id  bigint</text>
  <text x="135" y="170">username  text  UQ</text><text x="135" y="212">email  text</text></g></g>
  <g data-k="e-notes"><rect x="720" y="40" width="330" height="240" rx="6" fill="#fff" stroke="#e08a1e" stroke-width="3"/>
  <rect x="720" y="40" width="330" height="48" rx="6" fill="#e08a1e"/><text x="885" y="73" text-anchor="middle" font-size="26" font-weight="800" fill="#fff" font-family="Menlo,monospace">notes</text>
  <g font-family="Menlo,monospace" font-size="21" fill="#333"><text x="740" y="128" font-weight="800" fill="#b85a2b">PK</text><text x="795" y="128">id  bigint</text>
  <text x="740" y="170" font-weight="800" fill="#336791">FK</text><text x="795" y="170">user_id  bigint</text>
  <text x="795" y="212">title  varchar(200)</text><text x="795" y="254">pinned  boolean</text></g></g>
  <line x1="390" y1="165" x2="720" y2="165" stroke="#404040" stroke-width="3"/>
  <line x1="420" y1="145" x2="420" y2="185" stroke="#404040" stroke-width="3"/><line x1="436" y1="145" x2="436" y2="185" stroke="#404040" stroke-width="3"/>
  <path d="M720,165 L676,140 M720,165 L676,190 M720,165 L676,165" stroke="#404040" stroke-width="3"/><circle cx="662" cy="165" r="10" fill="#fff" stroke="#404040" stroke-width="3"/>
  <text x="555" y="132" text-anchor="middle" font-size="21" font-weight="800" fill="#b85a2b">one user …</text>
  <text x="555" y="212" text-anchor="middle" font-size="21" font-weight="800" fill="#b85a2b">… has zero or many notes</text>
  <text x="555" y="312" text-anchor="middle" font-size="19" fill="#666">‖ = exactly one      ○{ = zero or many (the “crow’s foot”)</text>
</svg>`;

/* JOIN khâu dòng: notes.user_id → users.id. */
const stitch = () => {
  const notes = [['1', 1, 'Hoc PostgreSQL'], ['2', 1, 'Mua ca phe'], ['3', 2, 'Doc tai lieu']];
  const users = [[1, 'cuong'], [2, 'mai']];
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Menlo,monospace">`;
  s += `<text x="60" y="26" font-size="21" font-weight="800" fill="#e08a1e" font-family="Arial">notes (user_id)</text><text x="760" y="26" font-size="21" font-weight="800" fill="#336791" font-family="Arial">users (id)</text>`;
  notes.forEach(([id, uid, t], i) => {
    const y = 44 + i * 62;
    s += `<rect x="40" y="${y}" width="400" height="50" rx="8" fill="#fff7ef" stroke="#e08a1e" stroke-width="2.5"/><text x="58" y="${y + 33}" font-size="20" fill="#333">${id} │ </text><text x="105" y="${y + 33}" font-size="20" fill="#333">${t}</text><rect x="352" y="${y + 8}" width="76" height="34" rx="6" fill="#fff3c4" stroke="#e08a1e"/><text x="390" y="${y + 32}" text-anchor="middle" font-size="19" font-weight="700" fill="#7a3d12">uid=${uid}</text>`;
  });
  users.forEach(([id, u], i) => {
    const y = 44 + i * 100 + 14;
    s += `<rect x="700" y="${y}" width="360" height="56" rx="8" fill="#eef4fa" stroke="#336791" stroke-width="2.5"/><text x="720" y="${y + 35}" font-size="21" fill="#333">id=${id} │ ${u}</text>`;
  });
  const uy = (id) => 44 + (id - 1) * 100 + 14 + 28;
  notes.forEach(([, uid], i) => { const y = 44 + i * 62 + 25; s += `<path d="M440,${y} C570,${y} 570,${uy(uid)} 700,${uy(uid)}" fill="none" stroke="${uid === 1 ? '#2f7d4f' : '#b85a2b'}" stroke-width="3.5"/><circle cx="700" cy="${uy(uid)}" r="5" fill="#336791"/>`; });
  return s + `</svg>`;
};

export const slides = lamDeck({ chuong: 'Chapter 1 — Why PostgreSQL exists', bai: '1.1' }, [
  { cover: true, t: 'The relational model<br>& why it won', sub: 'Tables, keys and relationships —<br>the one idea behind the whole course.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>What a <b>table, row and column</b> are — starting from a paper register</li>
<li>How <b>primary keys</b> and <b>foreign keys</b> connect tables <i>without copying data</i></li>
<li>How to draw it: an <b>ERD</b> with Crow’s Foot notation</li>
<li>How a <b>JOIN</b> stitches rows back together — and how the database <b>refuses</b> a broken link</li>
<li>Why this model beat spreadsheets, JSON files and one giant table</li>
</ul>
${box('Where we are', 'Lesson 0.4 said PostgreSQL is a <b>server you talk to in SQL</b>, and SQL is <b>declarative</b>: you say <i>what</i> you want, the server finds <i>how</i>. Now we look at what the data itself looks like.', 'lam')}` },

  { t: 'Everyday example first: a paper register', body: `
${notebook()}
<p style="font-size:24px">A class register is already a database table: <b>one page = one kind of thing</b> (students), <b>one line = one student</b>, <b>one column = one fact</b> (name, phone). PostgreSQL keeps exactly this shape — but for millions of lines, with many writers, and with rules the paper never enforced.</p>` },

  { t: 'Table, row, column — three words', body: `
${anatomy()}
${two(`<ul style="font-size:23px"><li><b>Table</b> — models one kind of thing: <code class="i">users</code>, <code class="i">notes</code>, <code class="i">orders</code></li>
<li><b>Row</b> — one instance (one user)</li>
<li><b>Column</b> — one attribute with a <b>fixed type</b> (<code class="i">text</code>, <code class="i">bigint</code>, <code class="i">boolean</code>)</li></ul>`,
box('A database = a set of tables', 'There is no other building block yet. Everything else in this course — keys, indexes, views, even JSON — is built on top of tables.', 'lam'))}` },

  { t: 'Why not one big table? (the problem)', body: `
<p style="font-size:24px;margin:0">Imagine every note lives in <b>one</b> sheet that repeats the owner’s data on each line. Now <b>cuong</b> renames himself to <b>cuong_hoang</b> — and we update only the first line:</p>
${zm(two(tbl(['note_id', 'title', 'username', 'email'], [
  ['1', 'Hoc PostgreSQL', 'cuong', 'cuong@example.com'],
  ['2', 'Mua ca phe', 'cuong', 'cuong@example.com'],
  ['3', 'Doc tai lieu', 'mai', 'mai@example.com'],
], { cap: 'BEFORE — the name is typed on every line', hl: [0, 1] }), tbl(['note_id', 'title', 'username', 'email'], [
  ['1', 'Hoc PostgreSQL', 'cuong_hoang', 'cuong@example.com'],
  ['2', 'Mua ca phe', 'cuong', 'cuong@example.com'],
  ['3', 'Doc tai lieu', 'mai', 'mai@example.com'],
], { cap: 'AFTER a missed line — two “different” people', hl: [0], bo: [1] })), 1.05)}
${two(box('Rename = touch every line', 'Thousands of rows for one change. Miss one and the data <b>contradicts itself</b> — and nothing tells you which line is right.', 'do2'),
box('Wasted + fragile', 'The same email is stored again and again. A typo on one line creates a “second Cuong” nobody can detect.', 'do2'))}` },

  { t: 'The idea: store each fact exactly once', body: `
${stitch()}
<ul style="font-size:25px">
<li>Put people in <code class="i">users</code>, notes in <code class="i">notes</code></li>
<li>A note does <b>not</b> copy the owner — it stores only the owner’s <b>number</b>: <code class="i">user_id</code></li>
<li>That number is a <b>key</b>: the way one row points to another row</li>
</ul>
${box('Result', 'Renaming cuong now changes <b>one row</b> in <code class="i">users</code> — every note automatically “sees” the new name, because they only hold the number <b>1</b>.', 'xanh')}` },

  { t: 'Two kinds of key', to: true, giua: true, body: two(
    box('Primary key (PK)', `<p style="margin:0">A column (here <code class="i">id</code>) that <b>identifies each row uniquely</b>.</p><ul style="margin:6px 0 0"><li>No two rows share it</li><li>Never <code class="i">NULL</code></li><li>It is the row’s permanent name</li></ul>`, 'lam'),
    box('Foreign key (FK)', `<p style="margin:0"><code class="i">notes.user_id REFERENCES users(id)</code> says: <b>“this note belongs to that user”</b>.</p><ul style="margin:6px 0 0"><li>The value must exist in the other table</li><li>It is how tables relate</li></ul>`, '')) +
    `<p class="nho" style="margin-top:10px">Deeper theory of keys (candidate, composite, surrogate) lives in the DBI202 course: <b>cuongthai.com/courses/introduction-to-databases</b>. Here we only need PK and FK.</p>` },

  { t: 'Creating the two tables', body: `
${zm(sql(`CREATE TABLE users (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username text NOT NULL UNIQUE,
  email    text NOT NULL
);

CREATE TABLE notes (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id  bigint NOT NULL REFERENCES users(id),
  title    varchar(200) NOT NULL,
  pinned   boolean NOT NULL DEFAULT false
);`, { sm: true, hl: [9] }), 1.18)}
<ul style="font-size:22px;margin-top:2px">
<li><code class="i">GENERATED ALWAYS AS IDENTITY</code> — PostgreSQL hands out 1, 2, 3 … for you</li>
<li><code class="i">NOT NULL</code> — the fact is required · <code class="i">UNIQUE</code> — no two users share a username</li>
<li><code class="i">REFERENCES users(id)</code> — the foreign key; <code class="i">DEFAULT false</code> — value used when you omit it</li>
</ul>` },

  { t: 'Drawing it: an ERD (Crow’s Foot)', to: true, body: `
${erd()}
<p style="font-size:25px;margin:0">An <b>ERD</b> (Entity-Relationship Diagram) shows tables, keys and the <b>cardinality</b> of each link. Read it aloud: <i>“one user has zero or many notes; each note belongs to exactly one user.”</i> Full ERD theory: DBI202 → <b>cuongthai.com/courses/introduction-to-databases</b>.</p>` },

  { t: 'Rows in the two tables', body: `
${zm(two(tbl(['id', 'username', 'email'], [['1', 'cuong', 'cuong@example.com'], ['2', 'mai', 'mai@example.com']], { cap: 'users' }),
tbl(['id', 'user_id', 'title', 'pinned'], [['1', '1', 'Hoc PostgreSQL', 't'], ['2', '1', 'Mua ca phe', 'f'], ['3', '2', 'Doc tai lieu', 't']], { cap: 'notes', o: [[0, 1], [1, 1], [2, 1]] }), 'r37'), 1.3)}
${zm(psql(`pgcourse=# SELECT * FROM notes ORDER BY id;
 id | user_id |     title      | pinned
----+---------+----------------+--------
  1 |       1 | Hoc PostgreSQL | t
  2 |       1 | Mua ca phe     | f
  3 |       2 | Doc tai lieu   | t
(3 rows)`, { sm: true }), 1.3)}
<p class="nho">The highlighted <code class="i">user_id</code> cells are the foreign key: 1, 1, 2 point at users cuong, cuong, mai. (In psql, <code class="i">t</code>/<code class="i">f</code> = true/false.)</p>` },

  { t: 'JOIN: stitch the rows back together', body: `
${zm(run(`SELECT u.username, n.title, n.pinned
FROM notes n
JOIN users u ON u.id = n.user_id
ORDER BY u.username, n.id;`, ` username |     title      | pinned
----------+----------------+--------
 cuong    | Hoc PostgreSQL | t
 cuong    | Mua ca phe     | f
 mai      | Doc tai lieu   | t
(3 rows)`, {}), 1.3)}
<ul style="font-size:25px">
<li><code class="i">JOIN … ON u.id = n.user_id</code> = “for each note, find the user whose <b>id equals</b> its <b>user_id</b>”</li>
<li>The database does the stitching <i>when you ask</i>; nothing is copied in storage (Chapter 5 covers JOIN in full)</li>
</ul>` },

  { t: 'Change a fact once — everyone sees it', body: `
${zm(run(`UPDATE users SET username = 'cuong_hoang' WHERE id = 1;

SELECT u.username, n.title
FROM notes n JOIN users u ON u.id = n.user_id
ORDER BY n.id;`, `UPDATE 1

  username   |     title
-------------+----------------
 cuong_hoang | Hoc PostgreSQL
 cuong_hoang | Mua ca phe
 mai         | Doc tai lieu
(3 rows)`, {}), 1.25)}
${box('One row changed, every note follows', 'We updated <b>1 row</b> (<code class="i">UPDATE 1</code>) and both of his notes now show the new name. This principle — <b>every fact stored exactly once</b> — is called <b>normalization</b>.', 'xanh')}` },

  { t: 'Referential integrity: the database refuses a broken link', body: `
${zm(run(`INSERT INTO notes (user_id, title)
VALUES (999, 'note mo coi');`, `ERROR:  insert or update on table "notes" violates foreign key constraint "notes_user_id_fkey"
DETAIL:  Key (user_id)=(999) is not present in table "users".`, { hlOut: [1, 2] }), 1.2)}
<ul style="font-size:25px">
<li>There is no user 999, so a note pointing at 999 would be an <b>orphan</b></li>
<li>PostgreSQL rejects it <b>before</b> it is stored — your application code cannot forget to check</li>
<li>The error names the <b>constraint</b> (<code class="i">notes_user_id_fkey</code>) and the <b>bad value</b> (<code class="i">user_id = 999</code>) — read it, it tells you everything</li>
</ul>
${zm(two(tbl(['users.id'], [['1'], ['2']], { cap: 'the only users that exist' }), box('Try it', 'Change <code class="i">999</code> to <code class="i">1</code> and the INSERT succeeds: the link now points at a real user.', 'xanh'), 'r37'), 1.2)}` },

  { t: 'It protects the other direction too', body: `
${zm(run(`DELETE FROM users WHERE id = 2;`, `ERROR:  update or delete on table "users" violates foreign key constraint "notes_user_id_fkey" on table "notes"
DETAIL:  Key (id)=(2) is still referenced from table "notes".`, { hlOut: [1, 2] }), 1.08)}
${two(box('What happened', 'User 2 (mai) still has a note. Deleting her would leave note 3 pointing at nobody — so PostgreSQL <b>blocks the delete</b>.', 'info'),
box('How to proceed (later chapters)', 'Delete her notes first, or declare the FK with <code class="i">ON DELETE CASCADE</code> / <code class="i">SET NULL</code> — a design choice you will make in Chapter 3.', ''))}
${zm(two(tbl(['users.id', 'username'], [['1', 'cuong'], ['2', 'mai']], { cap: 'users', hl: [1] }), tbl(['notes.id', 'user_id', 'title'], [['3', '2', 'Doc tai lieu']], { cap: 'notes — still points at user 2', hl: [0] })), 1.2)}
<p style="font-size:24px">The rule lives <b>with the data</b>, where a script written at 2 a.m. cannot bypass it.</p>` },

  { t: 'Why the relational model won', to: true, body: steps([
    '<b>Every fact lives in exactly ONE place.</b> A name is stored once; nothing can contradict it because there is no second copy.',
    '<b>Relationships are VALUES, not pointers.</b> A row refers to another by its key, so the database can <i>verify</i> the target exists.',
    '<b>Queries are DECLARATIVE.</b> You describe the result; the planner chooses how — add an index and the same query gets faster with no code change.',
    '<b>Structure is ENFORCED, not hoped for.</b> Types, <code class="i">NOT NULL</code>, foreign keys and <code class="i">CHECK</code> must hold — even for code you have not written yet.',
  ]) + `<p class="nho" style="margin-top:8px">“Relational” comes from Codd’s 1970 paper: a <i>relation</i> is a mathematical set of tuples (rows) — not “tables that have relationships”, though the practical effect is the same.</p>` },

  { t: 'Spreadsheet, JSON file, giant table — and why they lose', body: `
${zm(`<table class="t">
<tr><th style="width:230px">Alternative</th><th>What breaks</th></tr>
<tr><td><b>JSON file / object in memory</b></td><td>Two writers corrupt it · you can’t ask “all pinned notes of users in Hanoi” without writing a loop · everything is lost on restart</td></tr>
<tr><td><b>Spreadsheet</b></td><td>Fine for one person and 200 rows · collapses at a million rows, many users, or any link between sheets</td></tr>
<tr><td><b>One giant table</b></td><td>Repeated data: a rename touches thousands of rows, and missing one makes data contradict itself</td></tr>
<tr><td class="xanh"><b>Related tables (PostgreSQL)</b></td><td class="xanh">Each fact once · linked by keys · integrity enforced by the database · queried with SQL, not loops</td></tr>
</table>`, 1.2)}` },

  { t: 'Trap: “copy it to avoid a JOIN”', body: zm(vsd(
    `<p style="font-size:21px;margin:0">Copy <code class="i">user_name</code> into the orders table “so queries are simpler”.</p><ul style="font-size:20px"><li>Simpler <b>today</b></li><li>A second source of truth <b>forever</b></li><li>After the first rename, nothing tells you which copy is right</li><li>Months later: two screens show two names for one person</li></ul>`,
    `<p style="font-size:21px;margin:0">Keep one copy and <b>JOIN</b>. Denormalize only as a <b>performance decision, after measuring</b>, with a written plan to keep copies in sync (a trigger, a job, a materialized view).</p>`), 1.3) +
    `<p style="margin-top:8px;font-size:26px"><b>Rule:</b> “the JOIN feels annoying” is not a measurement.</p>` },

  { t: 'In production: how cuongthai.com uses it', body: `
${zm(two(sql(`model Comment {
  id          Int     @id
  postId      Int?    @map("post_id")
  userId      Int?    @map("user_id")
  userName    String  @map("user_name")

  post Post? @relation(
    fields: [postId], references: [id],
    onDelete: Cascade)
  user User? @relation(
    fields: [userId], references: [id],
    onDelete: SetNull)
}`, { sm: true, lang: 'typescript', hl: [7, 10] }),
`<ul style="font-size:22px;margin:0"><li>This site’s schema has <b>~248 tables</b> joined by foreign keys</li>
<li><code class="i">comments.post_id</code> → <code class="i">posts.id</code>: delete a post and its comments <b>cascade</b> away</li>
<li><code class="i">comments.user_id</code> → <code class="i">users.id</code>: delete a user and the comment stays with <code class="i">user_id = NULL</code></li>
<li>The table also keeps a copy, <code class="i">user_name</code> — a snapshot that survives account deletion (a deliberate, documented exception)</li></ul>`, 'r46'), 1.05)}
<p style="font-size:21px">This is Prisma’s schema language (Chapter 16): each <code class="i">@relation</code> becomes a real PostgreSQL <code class="i">FOREIGN KEY</code> with the <code class="i">ON DELETE</code> rule you choose.</p>` },

  { t: 'Exercise: model a library', to: true, body: `
<p style="margin:0">A library lends <b>books</b> to <b>members</b>. A member can borrow many books; each loan records one member and one book and a date.</p>
<ol>
<li>Which tables do you need? (Careful: “loan” is a <b>third</b> table.)</li>
<li>Which columns are primary keys, which are foreign keys?</li>
<li>Draw the ERD in words: how many loans can a member have? A book?</li>
</ol>
${box('Answer', `<b>members</b>(<u>id</u>, name) · <b>books</b>(<u>id</u>, title) · <b>loans</b>(<u>id</u>, <b>member_id</b> FK→members, <b>book_id</b> FK→books, loaned_on).<br>members ‖──○{ loans · books ‖──○{ loans: one member has zero-or-many loans; one book appears in zero-or-many loans. (members ↔ books is <i>many-to-many</i>; the loans table is the bridge.)`, 'xanh')}` },

  { t: 'Check yourself', to: true, body: `
<ol>
<li>What is the difference between a <b>primary key</b> and a <b>foreign key</b>?</li>
<li>Why is storing the owner’s name in every note a bad idea?</li>
<li>You run <code class="i">INSERT INTO notes (user_id, title) VALUES (999, 'x')</code> and user 999 does not exist. What happens, and which part of the error message names the culprit?</li>
</ol>
${box('Answers', '1) PK identifies a row inside its own table (unique, not null); FK is a column in another table that holds a PK value to link to that row. 2) A rename must touch many rows, and a missed row makes data contradict itself. 3) PostgreSQL rejects the INSERT with a foreign-key violation; <code class="i">notes_user_id_fkey</code> is the constraint and <code class="i">Key (user_id)=(999) is not present in table "users"</code> names the bad value.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A database is a set of <b>tables</b>; a table has <b>rows</b> and typed <b>columns</b></li>
<li><b>PK</b> names a row; <b>FK</b> points to another table’s PK — facts are stored <b>once</b></li>
<li><b>JOIN</b> stitches rows together on demand; an <b>ERD</b> draws the links</li>
<li>The database <b>enforces</b> the links — orphans and dangling deletes are refused</li>
<li>Next: <b>1.2 — ACID</b>: four guarantees, each proven with a real experiment</li>
</ul>
${box('Practice', 'Model two related tables from scratch in the PostgreSQL track on Code Lab — <b>cuongthai.com/code-lab</b>', 'lam')}` },
]);
