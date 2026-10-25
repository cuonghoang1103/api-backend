/**
 * pg-03-1 — PostgreSQL · Chapter 3 · Lesson 3.1 "Primary keys: the identity of a row" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s03-bang-rang-buoc.mjs › postgresql-3-1-khoa-chinh. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-03-1.out.txt). Bổ sung: thẻ căn cước, bảng không khoá, \d tag (chỉ mục tự tạo),
 * identity có lỗ hổng, identity vs uuid, so sánh SQL Server, schema Prisma của cuongthai.com.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { idCard, arrow } from './pg-03-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-03-1', code: 'PG 3.1', title: 'Primary keys: the identity of a row', sub: 'Unique, never NULL, and stable' };

/* CCCD: số định danh khác nhau dù trùng tên. */
const people = () => `<svg viewBox="0 0 1110 280" width="1110" height="280" font-family="Arial">
  ${idCard(20, 30, 400, '079201000111', 'NGUYEN VAN AN')}
  ${idCard(470, 30, 400, '079201000222', 'NGUYEN VAN AN')}
  <text x="975" y="95" text-anchor="middle" font-size="22" font-weight="800" fill="#2f7d4f">same name</text>
  <text x="975" y="125" text-anchor="middle" font-size="22" font-weight="800" fill="#2f7d4f">two people</text>
  <text x="975" y="165" text-anchor="middle" font-size="21" fill="#b85a2b" font-weight="800">ID number</text>
  <text x="975" y="193" text-anchor="middle" font-size="21" fill="#b85a2b" font-weight="800">tells them apart</text>
  <rect x="20" y="238" width="400" height="30" rx="6" fill="#fff3c4" stroke="#e08a1e" stroke-width="2"/><rect x="470" y="238" width="400" height="30" rx="6" fill="#fff3c4" stroke="#e08a1e" stroke-width="2"/>
  <text x="220" y="259" text-anchor="middle" font-size="18" font-weight="700" fill="#7a3d12">unique · issued once · never changes</text><text x="670" y="259" text-anchor="middle" font-size="18" font-weight="700" fill="#7a3d12">unique · issued once · never changes</text>
</svg>`;

/* Hai promise: UNIQUE + NOT NULL. */
const twoPromises = () => `<svg viewBox="0 0 1110 150" width="1110" height="150" font-family="Arial">
  <rect x="20" y="20" width="300" height="110" rx="12" fill="#eef4fa" stroke="#336791" stroke-width="3" data-k="p-uq"/><text x="170" y="64" text-anchor="middle" font-size="30" font-weight="800" fill="#336791">UNIQUE</text><text x="170" y="98" text-anchor="middle" font-size="20" fill="#555">no two rows share it</text>
  <text x="352" y="86" text-anchor="middle" font-size="46" font-weight="800" fill="#e08a1e">+</text>
  <rect x="385" y="20" width="300" height="110" rx="12" fill="#eef4fa" stroke="#336791" stroke-width="3" data-k="p-nn"/><text x="535" y="64" text-anchor="middle" font-size="30" font-weight="800" fill="#336791">NOT NULL</text><text x="535" y="98" text-anchor="middle" font-size="20" fill="#555">every row has one</text>
  <text x="717" y="86" text-anchor="middle" font-size="46" font-weight="800" fill="#e08a1e">+</text>
  <rect x="750" y="20" width="340" height="110" rx="12" fill="#fff7ef" stroke="#e08a1e" stroke-width="3" data-k="p-ix"/><text x="920" y="64" text-anchor="middle" font-size="28" font-weight="800" fill="#b85a2b">an automatic index</text><text x="920" y="98" text-anchor="middle" font-size="20" fill="#555">fast lookup by key</text>
</svg>`;

/* identity: bộ đếm 1,2,3 -> lỗ hổng. */
const counter = () => {
  const cell = (x, t, bad) => `<rect x="${x}" y="30" width="110" height="64" rx="8" fill="${bad ? '#fde2e0' : '#eef4fa'}" stroke="${bad ? '#c0392b' : '#336791'}" stroke-width="3" ${bad ? 'stroke-dasharray="7 5"' : ''}/><text x="${x + 55}" y="73" text-anchor="middle" font-size="30" font-weight="800" fill="${bad ? '#c0392b' : '#336791'}" font-family="Menlo,monospace">${t}</text>`;
  return `<svg viewBox="0 0 1110 160" width="1110" height="160" font-family="Arial">
  <text x="20" y="24" font-size="20" font-weight="800" fill="#b85a2b">the hidden counter (a sequence) only goes UP — it never hands a number out twice</text>
  ${cell(20, '1')}${cell(170, '2')}${cell(320, '3', true)}${cell(470, '4')}
  <text x="375" y="125" text-anchor="middle" font-size="18" fill="#c0392b" font-weight="700">deleted</text>
  <text x="525" y="125" text-anchor="middle" font-size="18" fill="#2f7d4f" font-weight="700">next new row</text>
  <text x="640" y="68" font-size="24" font-weight="800" fill="#404040">⇒ ids 1, 2, <tspan fill="#c0392b">·</tspan>, 4 — <tspan fill="#2f7d4f">gaps are normal</tspan></text>
  <text x="640" y="100" font-size="19" fill="#666">Keys are for identity, not for counting rows.</text></svg>`;
};

/* many-to-many: note ↔ tag qua note_tag. */
const junction = () => `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">
  <g data-k="j-note"><rect x="20" y="40" width="250" height="160" rx="10" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/><text x="145" y="75" text-anchor="middle" font-size="24" font-weight="800" fill="#b85a2b">note</text>
   <text x="145" y="115" text-anchor="middle" font-size="22" fill="#333">1 · Intro to SQL</text><text x="145" y="150" text-anchor="middle" font-size="22" fill="#333">2 · Joins</text></g>
  <g data-k="j-mid"><rect x="420" y="30" width="270" height="180" rx="10" fill="#fff" stroke="#336791" stroke-width="3"/><rect x="420" y="30" width="270" height="40" rx="10" fill="#336791"/><text x="555" y="58" text-anchor="middle" font-size="22" font-weight="800" fill="#fff" font-family="Menlo,monospace">note_tag</text>
   <g font-family="Menlo,monospace" font-size="21" fill="#333"><text x="440" y="102">(1, sql)</text><text x="440" y="132">(1, db)</text><text x="440" y="162">(2, sql)</text><text x="440" y="192" fill="#c0392b">(1, sql) ✗</text></g>
   </g><text x="555" y="238" text-anchor="middle" font-size="18" fill="#336791" font-weight="700">PRIMARY KEY (note_id, tag_slug)</text>
  <g data-k="j-tag"><rect x="840" y="40" width="250" height="160" rx="10" fill="#eef4fa" stroke="#336791" stroke-width="3"/><text x="965" y="75" text-anchor="middle" font-size="24" font-weight="800" fill="#336791">tag</text>
   <text x="965" y="115" text-anchor="middle" font-size="22" fill="#333">sql · SQL</text><text x="965" y="150" text-anchor="middle" font-size="22" fill="#333">db · Database</text></g>
  ${arrow(270, 110, 420, 100, '#e08a1e')}${arrow(270, 140, 420, 130, '#e08a1e')}${arrow(840, 110, 690, 100, '#336791')}${arrow(840, 140, 690, 160, '#336791')}
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 3 — Tables, constraints & schema design', bai: '3.1' }, [
  { cover: true, t: 'Primary keys:<br>the identity of a row', sub: 'The one rule every table needs —<br>unique, never NULL, never changing.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Why every table needs a <b>name for each row</b> — and what <code class="i">PRIMARY KEY</code> really guarantees</li>
<li>See the database <b>refuse</b> a duplicate key and a missing key (real errors)</li>
<li><b>Natural</b> key vs <b>surrogate</b> key — and why we default to the surrogate</li>
<li><b>Identity</b> column (1, 2, 3 …) vs <b>uuid</b> — which one to pick</li>
<li><b>Composite</b> keys for linking tables (many-to-many)</li>
</ul>
${box('Where we are', 'Chapter 2 gave each column a <b>type</b>. Now we give each <b>row</b> an identity, then (3.2) connect tables with foreign keys.', 'lam')}` },

  { t: 'Everyday example first: the ID number', giua: true, body: `
${people()}
<p style="font-size:24px;margin:0">Two people can both be called <b>Nguyen Van An</b>. What the state uses to tell them apart is the <b>ID number</b>: unique, issued once, never reused. A <b>primary key</b> is the ID number of a row.</p>` },

  { t: 'The problem: a table with no key', giua: true, body: `
${zm(two(tbl(['name', 'city'], [['Mai', 'Hanoi'], ['Mai', 'Hanoi'], ['An', 'Danang']], { cap: 'students — no key', hl: [0, 1] }),
box('Which Mai do you mean?', 'Two identical rows. <code class="i">UPDATE … WHERE name = \'Mai\'</code> changes <b>both</b>. A foreign key cannot point at “the” Mai. You cannot delete just one of them.', 'do2'), 'r46'), 1.45)}
${box('The rule', 'A table is a <b>set of rows</b>. To work with <i>one</i> row you need a value that identifies it for sure — the <b>primary key (PK)</b>: the column (or columns) that gives every row a unique name.', 'lam')}` },

  { t: 'PRIMARY KEY = two promises + one gift', giua: true, body: `
${twoPromises()}
${zm(sql(`CREATE TABLE tag (
  slug  text PRIMARY KEY,
  label text NOT NULL
);
INSERT INTO tag VALUES ('sql','SQL'), ('db','Database');`, { sm: true, hl: [2] }), 1.4)}
<p style="font-size:23px;margin:0">The database enforces both promises on <b>every</b> insert and update. Writing <code class="i">PRIMARY KEY</code> means “unique <i>and</i> not null” — you never write them separately.</p>` },

  { t: 'Watch both promises being enforced (real errors)', giua: true, body: `
${zm(run(`INSERT INTO tag VALUES ('sql','Structured Query Language');   -- same key

INSERT INTO tag (label) VALUES ('No slug');                   -- no key`, `ERROR:  duplicate key value violates unique constraint "tag_pkey"
DETAIL:  Key (slug)=(sql) already exists.
ERROR:  null value in column "slug" of relation "tag" violates not-null constraint
DETAIL:  Failing row contains (null, No slug).`, { hlOut: [1, 2, 3, 4] }), 1.4)}
<ul style="font-size:23px;margin:2px 0 0">
<li>Both bad rows are rejected <b>before they exist</b> — no clean-up job needed</li>
<li>Read the error: it names the <b>constraint</b> (<code class="i">tag_pkey</code>) and the <b>bad value</b> (<code class="i">slug = sql</code>)</li>
</ul>` },

  { t: 'The free gift: an automatic index', body: `
${zm(run(`\\d tag`, `                Table "ch3.tag"
 Column | Type | Collation | Nullable | Default
--------+------+-----------+----------+---------
 slug   | text |           | not null |
 label  | text |           | not null |
Indexes:
    "tag_pkey" PRIMARY KEY, btree (slug)`, { hlOut: [4, 5, 7] }), 1.3)}
${two(box('Not null — for free', '<code class="i">slug</code> shows <b>not null</b> although we never wrote it: PRIMARY KEY added it.', 'info'),
box('An index — for free', '<code class="i">tag_pkey … btree (slug)</code> is a <b>B-tree index</b> (Chapter 9). Looking a row up by its key is fast from row one — never add a second index on the PK.', 'xanh'))}` },

  { t: 'Two schools of keys: natural vs surrogate', body: `
${two(`<div class="card" style="border-color:#9fd0b2;background:#f1f9f4"><div class="h" style="color:#1f6b40">Surrogate key — the default</div><p>A meaningless, generated number: <code class="i">id bigint GENERATED ALWAYS AS IDENTITY</code>.</p><ul style="margin:6px 0 0;font-size:20px"><li>carries no business meaning</li><li>never needs to change</li><li>small and fast</li></ul></div>`,
`<div class="card"><div class="h">Natural key — the exception</div><p>A real-world value that is already unique: country code <code class="i">VN</code>, an email, an ISBN.</p><ul style="margin:6px 0 0;font-size:20px"><li>one column fewer</li><li>but real life changes: people change email, countries rename</li><li>change a PK ⇒ change every row that points at it</li></ul></div>`)}
${box('Rule of thumb', 'Surrogate <code class="i">bigint</code> identity for entity tables (users, notes, products). Natural key only for tiny, truly unchangeable lookup tables (currency codes). Put <code class="i">UNIQUE</code> on the natural value (e.g. email) — so it stays unique <i>without</i> being the identity.', 'lam')}` },

  { t: 'Identity column: the database hands out numbers', body: `
${zm(run(`CREATE TABLE person (
  id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);
INSERT INTO person (name) VALUES ('Cuong'), ('Mai'), ('An');
SELECT * FROM person;
INSERT INTO person (id, name) VALUES (99, 'Hacker');`, ` id | name
----+-------
  1 | Cuong
  2 | Mai
  3 | An
(3 rows)

ERROR:  cannot insert a non-DEFAULT value into column "id"
DETAIL:  Column "id" is an identity column defined as GENERATED ALWAYS.
HINT:  Use OVERRIDING SYSTEM VALUE to override.`, { hlOut: [7, 8, 9] }), 1.08)}
<p style="font-size:22px;margin:0"><code class="i">GENERATED ALWAYS</code> = the database owns the number; you cannot type your own (by accident). It also works when two people insert at once — no duplicates.</p>` },

  { t: 'Gaps are normal', body: `
${counter()}
${zm(run(`DELETE FROM person WHERE id = 3;
INSERT INTO person (name) VALUES ('Binh');
SELECT * FROM person ORDER BY id;`, ` id | name
----+-------
  1 | Cuong
  2 | Mai
  4 | Binh
(3 rows)`, { hlOut: [5] }), 1.2)}
<p style="font-size:22px;margin:0">Rolled-back inserts and failed inserts also burn numbers. So never use the id as “row count” or require it to be gap-free (for invoice numbers use a separate, carefully designed rule).</p>` },

  { t: 'Identity vs uuid', body: `
${zm(`<table class="t">
<tr><th style="width:190px"></th><th>bigint identity</th><th>uuid</th></tr>
<tr><td><b>Looks like</b></td><td><code class="i">42</code></td><td><code class="i">3f2b8c1e-…-9a07</code> (36 chars)</td></tr>
<tr><td><b>Size</b></td><td>8 bytes</td><td>16 bytes</td></tr>
<tr><td><b>Who creates it</b></td><td>the database (a counter)</td><td>anyone — app, phone, another server</td></tr>
<tr><td><b>Guessable in a URL?</b></td><td class="do">yes — /orders/41, /orders/43</td><td class="xanh">no</td></tr>
<tr><td><b>Index friendliness</b></td><td class="xanh">best — new rows append at the end</td><td>random order spreads inserts (time-ordered v7 helps)</td></tr>
</table>`, 1.1)}
${zm(sql(`CREATE TABLE session_tok (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint NOT NULL
);`, { sm: true }), 1.05)}
<p style="font-size:22px;margin:0">Default: <b>bigint identity</b>. Use <b>uuid</b> when ids are public/secret (tokens), or generated outside the database.</p>` },

  { t: 'Composite key: the pair is the identity', body: `
${junction()}
${zm(run(`CREATE TABLE note_tag (
  note_id  bigint,
  tag_slug text,
  PRIMARY KEY (note_id, tag_slug)
);
INSERT INTO note_tag VALUES (1,'sql'), (1,'db'), (2,'sql');
INSERT INTO note_tag VALUES (1,'sql');`, `ERROR:  duplicate key value violates unique constraint "note_tag_pkey"
DETAIL:  Key (note_id, tag_slug)=(1, sql) already exists.`, { hlOut: [1, 2] }), 1.1)}` },

  { t: 'What the pair allows — and forbids', to: true, giua: true, body: `
<ul>
<li>Note <b>1</b> may have <b>sql</b> and <b>db</b> — one note, many tags</li>
<li>Tag <b>sql</b> may sit on note <b>1</b> and note <b>2</b> — one tag, many notes</li>
<li>But the pair <b>(1, sql)</b> may appear <b>once</b> — a note cannot carry the same tag twice</li>
</ul>
${box('Many-to-many in one sentence', 'A <b>junction table</b> (also “link table”) has a composite PK made of the two foreign-key columns. Rule of thumb: <b>single surrogate PK</b> for entity tables, <b>composite PK</b> for pure link tables.', 'xanh')}
<p class="nho" style="font-size:21px">Theory of keys (candidate, super, composite) lives in DBI202 → cuongthai.com/courses/introduction-to-databases (lesson “Relational model” and “E/R model”).</p>` },

  { t: 'The trap: email as the primary key', giua: true, body: `
${vsd(`${zm(sql(`CREATE TABLE acct (
  email text PRIMARY KEY,
  name  text
);
-- notes point at acct(email) …
UPDATE acct SET email = 'cuong@new.com'
WHERE  email = 'cuong@old.com';`, { sm: true }), 1.05)}<p style="font-size:19px;margin:6px 0 0">Every table pointing at the email must change <b>at the same moment</b>; here the FK even blocks it: <i>“Key (email)=(cuong@old.com) is still referenced from table acct_note”</i>.</p>`,
`${zm(sql(`CREATE TABLE acct2 (
  id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name  text
);
UPDATE acct2 SET email = 'cuong@new.com'
WHERE  id = 1;      -- UPDATE 1`, { sm: true }), 1.05)}<p style="font-size:19px;margin:6px 0 0">The identity stays <b>1</b>; only an attribute changes. <code class="i">UNIQUE</code> still keeps emails distinct.</p>`, '✗ Natural key you cannot change', '✓ Generated key + UNIQUE email')}
<p style="font-size:22px;margin:0">Every argument for the email key is true — unique, never null — until a user changes it. <b>Identity must not depend on anything that can change.</b></p>` },

  { t: 'Coming from SQL Server? Quick map', body: `
${zm(`<table class="t">
<tr><th style="width:330px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">id INT IDENTITY(1,1) PRIMARY KEY</code></td><td><code class="i">id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY</code></td></tr>
<tr><td><code class="i">NEWID()</code> / <code class="i">uniqueidentifier</code></td><td><code class="i">gen_random_uuid()</code> / <code class="i">uuid</code></td></tr>
<tr><td>PRIMARY KEY is <b>clustered</b> by default (table stored in key order)</td><td>No clustered PK: the table is a <b>heap</b>; the PK is a normal B-tree index</td></tr>
<tr><td><code class="i">SET IDENTITY_INSERT t ON</code></td><td><code class="i">OVERRIDING SYSTEM VALUE</code> in the INSERT</td></tr>
<tr><td>Constraint name: you choose (or <code class="i">PK__t__3213E83F…</code>)</td><td>Default <code class="i">t_pkey</code> — readable, predictable</td></tr>
</table>`, 1.15)}
${box('Old PostgreSQL code you will meet', '<code class="i">id serial PRIMARY KEY</code> is the pre-10 way to get an auto number. It still works; new code should prefer <code class="i">GENERATED … AS IDENTITY</code> (standard SQL, safer).', 'lam')}` },

  { t: 'In production: how cuongthai.com does it', body: `
${zm(sql(`model User {
  id       Int     @id @default(autoincrement())   // surrogate identity
  username String  @unique(map: "uk_user_username")  // natural, but only UNIQUE
  email    String  @unique(map: "uk_user_email")
}

model PostTag {                                    // junction table
  postId Int
  tagId  Int
  @@id([postId, tagId], map: "pk_post_tags")       // composite PK
}`, { sm: true, lang: 'typescript' }), 1.18)}
${two(box('What Prisma generates', '<code class="i">@id @default(autoincrement())</code> ⇒ an identity-style integer primary key; <code class="i">@@id([a, b])</code> ⇒ <code class="i">PRIMARY KEY (a, b)</code>; <code class="i">@unique</code> ⇒ a UNIQUE constraint.', 'info'),
box('The site’s own schema', 'About 600 models, nearly all with a generated integer id; the link tables (post↔tag, user↔role, project↔skill) use composite keys. The exact rules of this lesson.', 'xanh'))}` },

  { t: 'Exercise: keys for a tiny school', giua: true, body: `
<p style="font-size:23px;margin:0">Design two tables. <b>student</b>: generated id, a unique email, a full name. <b>enroll</b>: which student takes which course — a student may take many courses, a course has many students, but never the same pair twice. Then try to break both.</p>
${zm(sql(`CREATE TABLE student (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email     text NOT NULL UNIQUE,
  full_name text NOT NULL
);
CREATE TABLE enroll (
  student_id  bigint NOT NULL,
  course_code text   NOT NULL,
  PRIMARY KEY (student_id, course_code)
);`, { sm: true }), 1.2)}
<p class="nho">Pause the video and write it yourself first. Hint: which table needs a surrogate key, which a composite key?</p>` },

  { t: 'Exercise: the answer, and breaking it', giua: true, body: `
${zm(run(`INSERT INTO enroll VALUES (1,'PG101'), (1,'DB202'), (2,'PG101');
INSERT INTO enroll VALUES (1, 'PG101');
INSERT INTO student (email, full_name)
VALUES ('an@example.com', 'An again');`, `ERROR:  duplicate key value violates unique constraint "enroll_pkey"
DETAIL:  Key (student_id, course_code)=(1, PG101) already exists.
ERROR:  duplicate key value violates unique constraint "student_email_key"
DETAIL:  Key (email)=(an@example.com) already exists.`, { hlOut: [1, 2, 3, 4] }), 1.12)}
${two(box('enroll_pkey', 'The <b>pair</b> repeated ⇒ rejected. Other pairs with the same student, or the same course, are fine.', 'info'),
box('student_email_key', 'Same email ⇒ rejected by <code class="i">UNIQUE</code>, even though <code class="i">id</code> would be new. Two kinds of “unique”: identity vs business rule.', 'info'))}
<p class="nho">Note the auto-names: <code class="i">table_pkey</code> and <code class="i">table_column_key</code>. In 3.2 the student_id column becomes a foreign key.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>Name the <b>two guarantees</b> of a PRIMARY KEY — and the <b>free extra</b> PostgreSQL adds.</li>
<li>Why is an <b>email</b> a risky primary key even though it is unique?</li>
<li>A <b>note_tag</b> table links notes to tags. What is its primary key, and what does it forbid?</li>
</ol>
${box('Answers', '<b>1.</b> UNIQUE + NOT NULL; plus an automatic B-tree index. <b>2.</b> It can change; a changed PK must be changed in every table that points at it (use a generated id and put UNIQUE on the email). <b>3.</b> Composite <code class="i">(note_id, tag_slug)</code> — forbids the same tag on the same note twice.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, body: `
<ul>
<li>PK = <b>UNIQUE + NOT NULL</b> + an automatic index; the row’s permanent name</li>
<li>Default: <code class="i">bigint GENERATED ALWAYS AS IDENTITY</code>; natural values get <code class="i">UNIQUE</code>, not the PK role</li>
<li>Identity has <b>gaps</b>; use <b>uuid</b> for public or externally generated ids</li>
<li><b>Composite</b> PK for junction tables (many-to-many)</li>
<li>Never make a changeable value (email!) the identity</li>
</ul>
${box('Next: 3.2 — Foreign keys', 'A key is only useful when other tables can <b>point at it</b>. Next we add <code class="i">REFERENCES</code> and decide what happens when the parent row is deleted.', 'lam')}` },
]);
