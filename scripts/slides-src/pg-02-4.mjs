/**
 * pg-02-4 — PostgreSQL · Chapter 2 · Lesson 2.4 "UUID, enum, array & jsonb" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s02-kieu-du-lieu.mjs › postgresql-2-4-uuid-enum-array-jsonb. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-02-4.out.txt). Bổ sung: vé xếp hàng đoán được vs mã ngẫu nhiên, bậc thang thứ tự enum, ALTER TYPE ADD VALUE vs CHECK,
 * unnest + đếm tag, jsonb vs json (khoá trùng/khoá sắp lại), || / jsonb_set / - để sửa, bẫy "two hundred" + JSON null ≠ SQL NULL, đối chiếu SQL Server, enum Prisma & vụ vỡ seed 08/08.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
const ss = (t) => box('🔁 Coming from SQL Server?', t, 'lam');
export const deck = { key: 'pg-02-4', code: 'PG 2.4', title: 'UUID, enum, array & jsonb', sub: 'four PostgreSQL specialities — and when each one earns its place' };

/* Hai vé: số thứ tự vs mã ngẫu nhiên. */
const tickets = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <g data-k="t-seq"><rect x="30" y="30" width="470" height="230" rx="16" fill="#fff7ef" stroke="#e08a1e" stroke-width="4"/>
  <circle cx="30" cy="145" r="16" fill="#fff"/><circle cx="500" cy="145" r="16" fill="#fff"/>
  <text x="265" y="76" text-anchor="middle" font-size="24" font-weight="800" fill="#b85a2b">🎟 Queue ticket — bigint</text>
  <text x="265" y="160" text-anchor="middle" font-size="86" font-weight="900" fill="#262626" font-family="Menlo,monospace">#4 217</text>
  <text x="265" y="205" text-anchor="middle" font-size="21" fill="#555">small · ordered · easy to index</text>
  <text x="265" y="238" text-anchor="middle" font-size="20" font-weight="700" fill="#c0392b">guessable · leaks “4,217 so far”</text></g>
  <g data-k="t-uuid"><rect x="560" y="30" width="520" height="230" rx="16" fill="#eef4fa" stroke="#336791" stroke-width="4"/>
  <circle cx="560" cy="145" r="16" fill="#fff"/><circle cx="1080" cy="145" r="16" fill="#fff"/>
  <text x="820" y="76" text-anchor="middle" font-size="24" font-weight="800" fill="#245077">🔑 Random code — uuid</text>
  <text x="820" y="150" text-anchor="middle" font-size="28" font-weight="800" fill="#262626" font-family="Menlo,monospace">88e29c25-39bf-4f3f-</text>
  <text x="820" y="188" text-anchor="middle" font-size="28" font-weight="800" fill="#262626" font-family="Menlo,monospace">82f0-cf732bd2c497</text>
  <text x="820" y="226" text-anchor="middle" font-size="20" fill="#555">128 bits · cannot be guessed · made anywhere</text>
  <text x="820" y="250" text-anchor="middle" font-size="20" font-weight="700" fill="#2f7d4f">no central counter needed</text></g>
</svg>`;

/* Bậc thang thứ tự enum. */
const ladder = () => `<svg viewBox="0 0 1110 260" width="1110" height="260" font-family="Arial">
  <g data-k="lad"><rect x="60" y="150" width="250" height="60" fill="#e8f0f8" stroke="#336791" stroke-width="3"/>
  <rect x="310" y="100" width="250" height="110" fill="#fff3c4" stroke="#e08a1e" stroke-width="3"/>
  <rect x="560" y="50" width="250" height="160" fill="#fde2e0" stroke="#c0392b" stroke-width="3"/>
  <text x="185" y="188" text-anchor="middle" font-size="30" font-weight="800" fill="#245077" font-family="Menlo,monospace">low</text>
  <text x="435" y="168" text-anchor="middle" font-size="30" font-weight="800" fill="#b85a2b" font-family="Menlo,monospace">medium</text>
  <text x="685" y="138" text-anchor="middle" font-size="30" font-weight="800" fill="#a52a1d" font-family="Menlo,monospace">high</text></g>
  <path d="M185,128 L685,28" stroke="#404040" stroke-width="3" fill="none" stroke-dasharray="8 6"/>
  <text x="940" y="76" font-size="24" font-weight="800" fill="#404040">declared order</text>
  <text x="940" y="108" font-size="22" fill="#555">= sort order</text>
  <text x="940" y="150" font-size="22" fill="#c0392b" font-weight="700">NOT alphabetical:</text>
  <text x="940" y="180" font-size="21" fill="#555" font-family="Menlo,monospace">high &lt; low &lt; medium</text>
  <text x="940" y="206" font-size="21" fill="#555" font-family="Menlo,monospace">(that would be wrong)</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 2 — Data types', bai: '2.4' }, [
  { cover: true, t: 'UUID, enum,<br>array & jsonb', sub: 'Four PostgreSQL specialities —<br>used well they remove whole tables, used badly they hide a mess.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><b>uuid</b> — a globally unique id, and when it beats a counter</li>
<li><b>enum</b> — a fixed set of named values, with real ordering</li>
<li><b>array</b> — several values in one column (and when a table is better)</li>
<li><b>jsonb</b> — queryable JSON inside a relational table</li>
</ul>
${ss('<code class="i">UNIQUEIDENTIFIER</code> / <code class="i">NEWID()</code> → <code class="i">uuid</code> / <code class="i">gen_random_uuid()</code>. SQL Server has <b>no enum</b> (people use CHECK or a lookup table) and <b>no array type</b>. JSON there is plain text read with <code class="i">JSON_VALUE</code>; here <code class="i">jsonb</code> is a real binary type with operators.')}` },

  { t: 'Everyday example first: queue ticket vs random code', body: `
${tickets()}
<p style="font-size:23px;margin:0">A <b>queue ticket</b> is small and ordered but tells everyone how many people came before. A <b>random code</b> reveals nothing and can be printed by any counter without phoning head office. Databases face the same choice for ids.</p>` },

  { t: 'uuid: a 128-bit identifier', body: `
${zm(run(`SELECT gen_random_uuid() AS id;`, `                  id
--------------------------------------
 88e29c25-39bf-4f3f-82f0-cf732bd2c497
(1 row)`, { hlOut: [3] }), 0.78)}
${zm(run(`SELECT pg_typeof(gen_random_uuid()) AS t,
       pg_column_size(gen_random_uuid()) AS bytes,
       length(gen_random_uuid()::text)   AS text_chars;`, `  t   | bytes | text_chars
------+-------+------------
 uuid |    16 |         36
(1 row)`, { hlOut: [3] }), 0.78)}
${zm(run(`SELECT 'not-a-uuid'::uuid;
SELECT 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11'::uuid;`, `ERROR:  invalid input syntax for type uuid: "not-a-uuid"

 a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
(1 row)`, { hlOut: [1] }), 0.78)}
<p style="font-size:21px;margin:0">Stored in <b>16 bytes</b> (the text form is 36 characters). Bad text is refused; upper case is normalised to lower.</p>` },

  { t: 'uuid in a table — and when to choose it', body: `
${zm(run(`CREATE TABLE orders_demo (
  id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note text
);
INSERT INTO orders_demo (note) VALUES ('first'), ('second');`, `CREATE TABLE
INSERT 0 2`, {}), 1.05)}
${two(box('Use uuid when…', 'ids must be <b>unguessable</b> (do not leak “how many users”) · or are <b>generated in many places</b> (client, two servers) with no shared counter.', 'xanh'),
box('Prefer bigint identity when…', 'you want a <b>small, ordered</b> key. A random uuid costs 16 bytes vs 8 and spreads inserts across the index — less cache-friendly.', ''))}
${box('Real use', 'Public URLs and API ids (<code class="i">/orders/88e29c25-…</code>) are a classic use: an attacker cannot just try the next number — an IDOR defence.', 'lam')}` },

  { t: 'enum: a fixed set — in declared order', body: `
${zm(run(`CREATE TYPE mood AS ENUM ('low', 'medium', 'high');
CREATE TABLE tasks (id int, priority mood);
INSERT INTO tasks VALUES (1,'high'), (2,'low'), (3,'medium');
SELECT id, priority FROM tasks ORDER BY priority;`, `CREATE TYPE
CREATE TABLE
INSERT 0 3

 id | priority
----+----------
  2 | low
  3 | medium
  1 | high
(3 rows)`, { hlOut: [6, 7, 8] }), 1.0)}
${ladder()}` },

  { t: 'enum rejects strangers — and compares in order', body: `
${zm(run(`INSERT INTO tasks VALUES (4, 'urgent');`, `ERROR:  invalid input value for enum mood: "urgent"`, { hlOut: [1] }), 0.9)}
${zm(run(`SELECT id, priority FROM tasks WHERE priority >= 'medium' ORDER BY priority;`, ` id | priority
----+----------
  3 | medium
  1 | high
(2 rows)`, {}), 0.9)}
${zm(run(`SELECT enum_range(NULL::mood) AS all_values, pg_column_size('low'::mood) AS bytes;`, `    all_values     | bytes
-------------------+-------
 {low,medium,high} |     4
(1 row)`, { hlOut: [3] }), 0.9)}
<ul style="font-size:21px"><li>A value outside the list is <b>refused</b> — a typo can never become data.</li><li>Comparison follows the declared order; storage is only <b>4 bytes</b> whatever the label length.</li></ul>` },

  { t: 'Changing an enum — and the alternative', body: `
${zm(run(`ALTER TYPE mood ADD VALUE 'urgent' AFTER 'high';
INSERT INTO tasks VALUES (4, 'urgent');
SELECT id, priority FROM tasks ORDER BY priority;`, `ALTER TYPE
INSERT 0 1

 id | priority
----+----------
  2 | low
  3 | medium
  1 | high
  4 | urgent
(4 rows)`, { hlOut: [9] }), 0.82)}
${zm(run(`CREATE TABLE tasks2 (id int,
  status text NOT NULL CHECK (status IN ('todo','doing','done')));
INSERT INTO tasks2 VALUES (1, 'blocked');`, `CREATE TABLE
ERROR:  new row for relation "tasks2" violates check constraint "tasks2_status_check"
DETAIL:  Failing row contains (1, blocked).`, { hlOut: [2, 3] }), 0.82)}
<ul style="font-size:21px"><li><b>Adding</b> a value is easy (<code class="i">ADD VALUE</code>); <b>removing or renaming</b> one is painful.</li><li>If the set will change often, use <code class="i">text + CHECK</code> or a small <b>lookup table</b> with a foreign key.</li></ul>` },

  { t: 'array: several values in one column', body: `
${zm(run(`SELECT array[10,20,30]                 AS arr,
       (array[10,20,30])[2]            AS element_2,
       array_length(array[10,20,30],1) AS len,
       30 = ANY(array[10,20,30])       AS contains_30;`, `    arr     | element_2 | len | contains_30
------------+-----------+-----+-------------
 {10,20,30} |        20 |   3 | t
(1 row)`, { hlOut: [3] }), 1.15)}
<ul style="font-size:23px">
<li>Any type can be an array: <code class="i">int[]</code>, <code class="i">text[]</code>. Written <code class="i">{10,20,30}</code>.</li>
<li>Indexing starts at <b>1</b>: <code class="i">arr[2]</code> is the second element (20), not the third.</li>
<li><code class="i">x = ANY(arr)</code> asks “is x in the list?”</li>
</ul>
${ss('There is no array column in SQL Server — you would add a child table or store JSON text.')}` },

  { t: 'Array columns: tags on posts', body: `
${zm(run(`CREATE TABLE posts (id int, title text, tags text[]);
INSERT INTO posts VALUES
  (1, 'Intro to SQL', '{sql,beginner}'),
  (2, 'Indexes',      array['sql','performance']),
  (3, 'Docker',       '{devops}');
SELECT title FROM posts WHERE 'sql' = ANY(tags) ORDER BY id;
SELECT title FROM posts WHERE tags @> ARRAY['sql','performance'];`, `CREATE TABLE
INSERT 0 3

    title
--------------
 Intro to SQL
 Indexes
(2 rows)

  title
---------
 Indexes
(1 row)`, { hlOut: [6, 7, 12] }), 0.85)}
<ul style="font-size:20px"><li><code class="i">ANY(tags)</code>: has this tag. <code class="i">@&gt;</code>: contains <b>all</b> of these tags.</li><li>Great for a short list you always read whole. For “count posts per tag over millions of rows”, a real <b>tag table</b> + JOIN scales better.</li></ul>` },

  { t: 'jsonb: JSON you can query', body: `
${zm(run(`SELECT '{"name":"Cuong","tags":["db","sql"],"age":25}'::jsonb ->> 'name'      AS name,
       '{"name":"Cuong","tags":["db","sql"],"age":25}'::jsonb -> 'tags' -> 0 AS tag0,
       '{"a":1}'::jsonb @> '{"a":1}'::jsonb                                  AS contains;`, ` name  | tag0 | contains
-------+------+----------
 Cuong | "db" | t
(1 row)`, { hlOut: [3] }), 1.0)}
${tbl(['operator', 'meaning', 'returns'], [
  ['->', 'get a field / array element', 'jsonb  (note the quotes: "db")'],
  ['->>', 'get it as text', 'text   (Cuong)'],
  ['@>', 'does the left contain the right?', 'boolean'],
], { cap: 'the three operators you need first' })}
<p style="font-size:21px;margin:0">Chapter 13 goes deep (GIN indexes make these fast on millions of rows). Here: just enough to use it safely.</p>` },

  { t: 'jsonb inside a real table', body: `
${zm(run(`CREATE TABLE product (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text, attrs jsonb NOT NULL DEFAULT '{}');
INSERT INTO product (name, attrs) VALUES
  ('Notebook A5', '{"pages": 200, "color": "blue", "tags": ["paper","school"]}'),
  ('USB Hub', '{"ports": 4, "usb": "3.0"}'), ('Pen', '{}');
SELECT name, attrs -> 'pages' AS pages_json, attrs ->> 'pages' AS pages_text,
       (attrs ->> 'pages')::int + 1 AS pages_plus_1 FROM product ORDER BY id;`, `CREATE TABLE
INSERT 0 3

    name     | pages_json | pages_text | pages_plus_1
-------------+------------+------------+--------------
 Notebook A5 | 200        | 200        |          201
 USB Hub     |            |            |
 Pen         |            |            |
(3 rows)`, { hlOut: [6] }), 0.92)}
<ul style="font-size:20px"><li>Three products, three different shapes — no empty columns. This is jsonb at its best.</li><li>A missing key gives an empty (NULL) result, not an error. <code class="i">-&gt;&gt;</code> then <code class="i">::int</code> turns text into a number.</li></ul>` },

  { t: 'Filtering jsonb: @>, ? and jsonb_typeof', body: `
${zm(run(`SELECT name FROM product WHERE attrs @> '{"color":"blue"}';
SELECT name FROM product WHERE attrs ? 'ports';
SELECT name, jsonb_typeof(attrs -> 'pages') AS t FROM product ORDER BY id;`, `    name
-------------
 Notebook A5
(1 row)

  name
---------
 USB Hub
(1 row)

    name     |   t
-------------+--------
 Notebook A5 | number
 USB Hub     |
 Pen         |
(3 rows)`, { hlOut: [3, 8, 13] }), 0.95)}
<ul style="font-size:21px"><li><code class="i">@&gt;</code> = “contains this fragment”. <code class="i">?</code> = “has this key”. <code class="i">jsonb_typeof</code> tells number / string / array / object.</li></ul>` },

  { t: 'jsonb vs json: what “b” buys you', body: `
${zm(run(`SELECT '{"b":2,"a":1,"a":3}'::jsonb AS jsonb_val,
       '{"b":2,"a":1,"a":3}'::json  AS json_val;`, `    jsonb_val     |      json_val
------------------+---------------------
 {"a": 3, "b": 2} | {"b":2,"a":1,"a":3}
(1 row)`, { hlOut: [3] }), 1.2)}
${two(box('jsonb (binary)', 'Parsed once: keys <b>sorted</b>, duplicate keys <b>deduplicated</b> (last wins), indexable, fast to query. This is the one to use.', 'xanh'), box('json (text)', 'Stores the exact text, spaces and duplicates included. Re-parsed on every query; only for “keep the original bytes”.', ''))}` },

  { t: 'Changing jsonb: ||, jsonb_set, −', body: `
${zm(run(`UPDATE product SET attrs = attrs || '{"color":"red"}' WHERE name = 'Notebook A5';
SELECT jsonb_set(attrs, '{pages}', '250') AS patched FROM product WHERE name = 'Notebook A5';
UPDATE product SET attrs = attrs - 'tags' WHERE name = 'Notebook A5';
SELECT attrs FROM product WHERE name = 'Notebook A5';`, `UPDATE 1

                           patched
-------------------------------------------------------------
 {"tags": ["paper", "school"], "color": "red", "pages": 250}
(1 row)

UPDATE 1

             attrs
--------------------------------
 {"color": "red", "pages": 200}
(1 row)`, { hlOut: [5, 12] }), 0.9)}
<ul style="font-size:20px"><li><code class="i">||</code> merges (right side wins) · <code class="i">jsonb_set(doc, path, value)</code> patches one key · <code class="i">- 'key'</code> removes a key.</li><li><code class="i">jsonb_set</code> only <i>returns</i> the patched value — wrap it in an <code class="i">UPDATE</code> to save it.</li></ul>` },

  { t: 'jsonb traps: no schema, no safety net', body: `
${zm(run(`INSERT INTO product (name, attrs) VALUES ('Typo', '{"pages": "two hundred"}');
SELECT name FROM product WHERE (attrs ->> 'pages')::int > 100;`, `INSERT 0 1
ERROR:  invalid input syntax for type integer: "two hundred"`, { hlOut: [2] }), 0.88)}
${zm(run(`INSERT INTO product (name, attrs) VALUES ('Bad', '{not json}');`, `ERROR:  invalid input syntax for type json
DETAIL:  Token "not" is invalid.`, { hlOut: [1] }), 0.88)}
${zm(run(`SELECT 'null'::jsonb AS json_null, 'null'::jsonb IS NULL AS is_sql_null;`, ` json_null | is_sql_null
-----------+-------------
 null      | f`, { hlOut: [3] }), 0.88)}
<ul style="font-size:21px"><li>Valid JSON is the <b>only</b> rule: a number field can quietly hold text and one bad row breaks a later query.</li><li>JSON <code class="i">null</code> is a value; SQL <code class="i">NULL</code> means “no value” — two different things.</li></ul>` },

  { t: 'Choosing — and the jsonb trap', body: `
${zm(vsd(
  `<p style="font-size:20px;margin:0">jsonb to <b>avoid deciding</b> the schema</p><ul style="font-size:18px;margin:6px 0 0;padding-left:22px"><li>Month 1: feels flexible</li><li>Month 6: an <b>undocumented schema</b> with no NOT NULL, no foreign keys, no type checks</li><li>A deploy renames <code class="i">userId</code> → <code class="i">user_id</code> in half the rows — every query handles both, forever</li><li>You cannot migrate what you cannot list</li></ul>`,
  `<p style="font-size:20px;margin:0">Each tool for its job</p><ul style="font-size:18px;margin:6px 0 0;padding-left:22px"><li><b>uuid</b>: unguessable / generated everywhere</li><li><b>enum</b>: tiny, stable set (+ CHECK/lookup table if it changes)</li><li><b>array</b>: short list read whole (tags)</li><li><b>jsonb</b>: shape outside your control (webhooks, per-product attributes) — and <b>promote</b> any field you filter on into a real column</li></ul>`), 1.4)}` },

  { t: 'In production: where these appear', body: `
${zm(two(sql(`-- CT Shop (Lab 1)
attrs  jsonb NOT NULL DEFAULT '{}'
-- cuongthai.com (Prisma)
cues   Json @db.JsonB
id     String @id @default(uuid())
         @db.Uuid          -- used once
enum CyberTaskType { TASK STUDY ROUTINE }`, { sm: true, lang: 'typescript', hl: [2, 4, 5] }),
`<ul style="font-size:20px;margin:0"><li>CT Shop keeps per-product attributes in <b>jsonb</b>; the fixed fields stay real columns.</li><li>The site stores caption <b>cues</b> as <code class="i">JsonB</code> — a shape that changes by lesson.</li><li>Prisma <code class="i">enum</code> becomes a real PostgreSQL <code class="i">ENUM</code> type (<code class="i">CyberTaskType</code>).</li><li>Ids are mostly <code class="i">Int autoincrement</code>; <code class="i">uuid</code> only where an unguessable id is needed.</li></ul>`, 'r55'), 1.1)}
${box('A real scar (8 Aug 2026)', 'An enum value was renamed (<code class="i">CODE</code> → <code class="i">CODE_REVIEW</code>); every check passed, yet <b>production seed broke</b> — <code class="i">seed.ts</code> held a hand-copied union of the enum. Enums are rigid on purpose: import the type, never copy it.', 'do2')}` },

  { t: 'Exercise: pick the type', to: true, body: `
<p style="margin:0">For each field choose <b>uuid · enum · array · jsonb</b> — or a plain column:</p>
<ol>
<li>public share link id for a note, so strangers cannot guess the next one</li>
<li>ticket status: <i>open · in_progress · closed</i> (rarely changes)</li>
<li>the tags of a blog post (3–5 short words)</li>
<li>raw payload of a payment webhook whose fields vary by provider</li>
</ol>
${box('Answer', '1) <code class="i">uuid</code> · 2) <code class="i">enum</code> (or text + CHECK) · 3) <code class="i">text[]</code> (or a tag table if you must count per tag) · 4) <code class="i">jsonb</code> — and promote the fields you filter on into real columns.', 'xanh')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>When would you choose <code class="i">uuid</code> over <code class="i">bigint identity</code> for a primary key — and what does it cost?</li>
<li>Why does an enum sort <code class="i">low, medium, high</code> and not alphabetically?</li>
<li>What is the real danger of using <code class="i">jsonb</code> “to avoid deciding the schema”?</li>
</ol>
${box('Answers', '1) Unguessable ids or ids made in many places with no shared counter; costs 16 bytes vs 8 and random index inserts. 2) Enum values sort by <b>declaration order</b>. 3) An undocumented schema with no constraints — typos and renamed keys silently split your data.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>uuid</b> — 128-bit, <code class="i">gen_random_uuid()</code>; for unguessable / distributed ids</li>
<li><b>enum</b> — stable named set, declared order; add is easy, remove is hard</li>
<li><b>array</b> — short list in a column; <code class="i">ANY</code>, <code class="i">@&gt;</code>; index from 1</li>
<li><b>jsonb</b> — <code class="i">-&gt;</code>, <code class="i">-&gt;&gt;</code>, <code class="i">@&gt;</code>, <code class="i">||</code>; promote filtered fields to columns</li>
<li>Next: <b>Chapter 3 — Tables, constraints & schema design</b></li>
</ul>
${box('Practice', 'Query jsonb with <code class="i">-&gt;&gt;</code> and <code class="i">@&gt;</code> in the PostgreSQL track on Code Lab — <b>cuongthai.com/code-lab</b>', 'lam')}` },
]);
