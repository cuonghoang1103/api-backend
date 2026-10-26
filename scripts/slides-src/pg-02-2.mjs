/**
 * pg-02-2 — PostgreSQL · Chapter 2 · Lesson 2.2 "Text: text, varchar & the char(n) trap" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s02-kieu-du-lieu.mjs › postgresql-2-2-text. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-02-2.out.txt). Bổ sung: ba mẫu đơn (text/varchar/char) vẽ từng ô, varchar(n) đếm KÝ TỰ chứ không byte,
 * khoảng trắng cuối bị cắt âm thầm, bảng ký tự vs byte (tiếng Việt, emoji, tiếng Nhật), é gộp vs tách dấu + normalize(), phân biệt hoa/thường, || với NULL, đối chiếu SQL Server.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
const ss = (t) => box('🔁 Coming from SQL Server?', t, 'lam');
export const deck = { key: 'pg-02-2', code: 'PG 2.2', title: 'Text: text, varchar & the char(n) trap', sub: 'text · varchar(n) · char(n) · characters vs bytes' };

/* Ba mẫu đơn. */
const forms = () => `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">
  <g data-k="f-text"><rect x="10" y="14" width="340" height="290" rx="12" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="3"/>
  <text x="180" y="50" text-anchor="middle" font-size="24" font-weight="800" fill="#1f6b40" font-family="Menlo,monospace">text</text>
  <text x="180" y="76" text-anchor="middle" font-size="17" fill="#555">a free page — write any length</text>
  <rect x="34" y="94" width="292" height="150" rx="6" fill="#fff" stroke="#9fd0b2" stroke-width="2"/>
  <text x="48" y="128" font-size="22" fill="#333" font-family="Menlo,monospace">Hi!</text>
  <text x="48" y="162" font-size="19" fill="#999" font-family="Menlo,monospace">…or a whole essay…</text>
  <text x="180" y="278" text-anchor="middle" font-size="18" fill="#555">up to ~1 GB per value</text></g>
  <g data-k="f-vc"><rect x="385" y="14" width="340" height="290" rx="12" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="555" y="50" text-anchor="middle" font-size="24" font-weight="800" fill="#245077" font-family="Menlo,monospace">varchar(5)</text>
  <text x="555" y="76" text-anchor="middle" font-size="17" fill="#555">a form with 5 boxes — at most 5</text>
  <g stroke="#336791" stroke-width="2" fill="#fff"><rect x="405" y="110" width="52" height="60"/><rect x="457" y="110" width="52" height="60"/><rect x="509" y="110" width="52" height="60"/><rect x="561" y="110" width="52" height="60"/><rect x="613" y="110" width="52" height="60"/></g>
  <g font-size="34" font-weight="800" fill="#333" font-family="Menlo,monospace" text-anchor="middle"><text x="431" y="152">h</text><text x="483" y="152">i</text></g>
  
  <text x="555" y="212" text-anchor="middle" font-size="19" fill="#555">“hi” fills 2 boxes — nothing is added</text>
  <text x="555" y="278" text-anchor="middle" font-size="18" fill="#2f7d4f" font-weight="700">stored as: hi</text></g>
  <g data-k="f-ch"><rect x="760" y="14" width="340" height="290" rx="12" fill="#fdf0ee" stroke="#c0392b" stroke-width="3"/>
  <text x="930" y="50" text-anchor="middle" font-size="24" font-weight="800" fill="#a52a1d" font-family="Menlo,monospace">char(5)</text>
  <text x="930" y="76" text-anchor="middle" font-size="17" fill="#555">every box is always filled</text>
  <g stroke="#c0392b" stroke-width="2"><rect x="780" y="110" width="52" height="60" fill="#fff"/><rect x="832" y="110" width="52" height="60" fill="#fff"/><rect x="884" y="110" width="52" height="60" fill="#f6d5d0"/><rect x="936" y="110" width="52" height="60" fill="#f6d5d0"/><rect x="988" y="110" width="52" height="60" fill="#f6d5d0"/></g>
  <g font-size="34" font-weight="800" fill="#333" font-family="Menlo,monospace" text-anchor="middle"><text x="806" y="152">h</text><text x="858" y="152">i</text></g>
  <g font-size="26" fill="#c0392b" text-anchor="middle" font-family="Menlo,monospace"><text x="910" y="150">␣</text><text x="962" y="150">␣</text><text x="1014" y="150">␣</text></g>
  <text x="930" y="212" text-anchor="middle" font-size="19" fill="#555">blank spaces glued on the end</text>
  <text x="930" y="278" text-anchor="middle" font-size="18" fill="#c0392b" font-weight="700">stored as: hi␣␣␣</text></g>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 2 — Data types', bai: '2.2' }, [
  { cover: true, t: 'Text: text, varchar<br>& the char(n) trap', sub: 'Three ways to store words —<br>one default, one habit to drop, one type to avoid.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>The three text types — and the surprising fact that <b>none is faster</b></li>
<li>Trap 1: a length limit <b>rejects</b> on insert but <b>silently cuts</b> on a cast</li>
<li>Trap 2: <code class="i">char(n)</code> glues invisible spaces onto your data</li>
<li><b>Characters vs bytes</b> — why “Nguyễn” is 6 characters but 8 bytes</li>
<li>Case-sensitive comparison, and a safe set of string functions</li>
</ul>
${ss('<code class="i">NVARCHAR(n)</code> / <code class="i">VARCHAR(MAX)</code> → <code class="i">text</code> (PostgreSQL text is always Unicode — no <code class="i">N\'…\'</code> prefix). <code class="i">+</code> joins strings → <code class="i">||</code>. And <b>= is case-SENSITIVE</b> here: <code class="i">\'a\' = \'A\'</code> is false (SQL Server’s default collation says true).')}` },

  { t: 'Everyday example first: three kinds of form', body: `
${forms()}
<p style="font-size:23px;margin:0"><b>text</b> is a blank page. <b>varchar(n)</b> is a form with a fixed number of boxes — it never <i>adds</i> anything. <b>char(n)</b> is a form where every unused box is stamped with a blank space.</p>` },

  { t: 'The three text types', body: `
${zm(`<table class="t"><tr><th>Type</th><th>Length</th><th>What it adds</th><th>Verdict</th></tr>
<tr><td><code class="i">text</code></td><td>any (up to ~1 GB)</td><td>nothing — the simplest</td><td class="xanh">default choice</td></tr>
<tr><td><code class="i">varchar(n)</code></td><td>at most n characters</td><td>a length rule enforced by the database</td><td>when the limit is a real rule</td></tr>
<tr><td><code class="i">char(n)</code></td><td>exactly n (padded)</td><td>blank padding</td><td class="do">almost never</td></tr></table>`, 1.4)}
${two(box('Unlike some databases…', 'In PostgreSQL <code class="i">varchar(500)</code> is <b>not</b> faster or smaller than <code class="i">text</code>. The question is never “speed” — it is: “do I want the database to <b>reject</b> values longer than n?”', 'lam'),
box('Rule of thumb', 'username or country code → a limit makes sense. A free-form body or description → <code class="i">text</code>.', 'xanh'))}` },

  { t: 'Is varchar(n) faster? Measure it', body: `
${zm(run(`SELECT pg_column_size('hello'::text)         AS text5,
       pg_column_size('hello'::varchar(500))  AS vc5_in_500,
       pg_column_size('hello'::char(5))       AS char5;`, ` text5 | vc5_in_500 | char5
-------+------------+-------
     9 |          9 |     9
(1 row)`, { hlOut: [3] }), 0.88)}
${zm(run(`CREATE TABLE t_big (body text);
INSERT INTO t_big SELECT repeat('x', 100000);
SELECT length(body) AS chars, pg_column_size(body) AS stored_bytes FROM t_big;`, `CREATE TABLE
INSERT 0 1

 chars  | stored_bytes
--------+--------------
 100000 |         1156
(1 row)`, { hlOut: [6] }), 0.88)}
<ul style="font-size:22px"><li>The same 5 letters cost <b>9 bytes</b> in all three — one storage format underneath.</li><li>A 100,000-character text is stored in ~1 KB: PostgreSQL <b>compresses</b> large values automatically.</li></ul>` },

  { t: 'Trap 1: the limit rejects — but a cast cuts', body: `
${zm(run(`CREATE TABLE t_vc (code varchar(3));
INSERT INTO t_vc VALUES ('abcdef');`, `CREATE TABLE
ERROR:  value too long for type character varying(3)`, { hlOut: [2] }), 1.0)}
${zm(run(`SELECT 'abcdef'::varchar(3) AS cast_cuts,
       'ab'::varchar(3)     AS short_ok;`, ` cast_cuts | short_ok
-----------+----------
 abc       | ab
(1 row)`, { hlOut: [3] }), 1.0)}
${two(box('Column limit = guard', 'Bad data is <b>refused</b> at <code class="i">INSERT</code> — good.', 'xanh'), box('Explicit cast = scissors', '<code class="i">::varchar(3)</code> quietly <b>drops</b> characters. Never use a cast as validation.', 'do2'))}` },

  { t: 'varchar(n): characters, not bytes', body: `
${zm(run(`INSERT INTO t_vc VALUES ('abc   ');   -- 3 letters + 3 spaces
SELECT code, length(code) FROM t_vc;`, `INSERT 0 1

 code | length
------+--------
 abc  |      3
(1 row)`, { hlOut: [5] }), 0.82)}
${zm(run(`CREATE TABLE t_title (title varchar(10));
INSERT INTO t_title VALUES ('Học PostgreSQL');   -- 14 characters
INSERT INTO t_title VALUES ('Học SQL');          -- 7 characters`, `CREATE TABLE
ERROR:  value too long for type character varying(10)
INSERT 0 1`, { hlOut: [2] }), 0.82)}
<ul style="font-size:22px"><li>Extra <b>spaces</b> past n are dropped silently (the SQL standard) — letters never are.</li><li><code class="i">varchar(10)</code> allows <b>10 characters</b>, not 10 bytes: “Học SQL” is 7 characters but 9 bytes and fits. <span class="nho">(SQL Server counts bytes for VARCHAR.)</span></li></ul>` },

  { t: 'Trap 2: char(n) pads with blanks', body: `
${zm(run(`SELECT ('hi'::char(5)) || '|'    AS char_padded,
       length('hi'::char(5))      AS char_len,
       octet_length('hi'::char(5)) AS char_bytes,
       ('hi'::varchar(5)) || '|'  AS varchar_nopad;`, ` char_padded | char_len | char_bytes | varchar_nopad
-------------+----------+------------+---------------
 hi|         |        2 |          5 | hi|
(1 row)`, { hlOut: [3] }), 1.15)}
<ul style="font-size:23px">
<li><code class="i">||</code> casts <code class="i">char(5)</code> to text and <b>strips the trailing blanks</b> — so you get <code class="i">hi|</code>, the padding is <i>hidden</i>.</li>
<li>Yet it is stored: <code class="i">octet_length</code> = <b>5</b>, <code class="i">pg_column_size</code> = <b>9 B</b> for char(5) vs <b>6 B</b> for text — while <code class="i">length()</code> says <b>2</b>.</li>
</ul>
${box('Rule', 'Even for a fixed-width code, use <code class="i">varchar(n)</code> or <code class="i">text</code> + a CHECK. You avoid a lifetime of stray-space bugs.', 'do2')}` },

  { t: 'char(n): the confusing comparisons', body: `
${zm(run(`CREATE TABLE t_c (code char(5));
INSERT INTO t_c VALUES ('hi');
SELECT code, code = 'hi' AS eq_hi, code::text = 'hi' AS text_eq, octet_length(code) AS bytes
FROM t_c;`, `CREATE TABLE
INSERT 0 1

 code  | eq_hi | text_eq | bytes
-------+-------+---------+-------
 hi    | t     | t       |     5
(1 row)`, { hlOut: [6] }), 1.1)}
${two(box('What you see', 'The value prints as <code class="i">hi···</code> with padding; equality quietly <b>ignores</b> the blanks.', ''), box('What you get', 'Casting to <code class="i">text</code> or <code class="i">||</code> strips them, <code class="i">length()</code> skips them, yet the byte size is 5 — each tool disagrees. That is the bug farm.', 'do2'))}
<p style="font-size:22px;margin:0">Copying a char column to text, a file or an API changes the value. Avoid the type.</p>` },

  { t: 'Characters vs bytes (Unicode)', body: `
${zm(tbl(['text', 'length()', 'octet_length()', 'why'], [
  ['café', '4', '5', 'é = 2 bytes'],
  ['Xin chào', '8', '9', 'à = 2 bytes'],
  ['Nguyễn Văn Á', '12', '16', 'ễ = 3, ă = 2, Á = 2'],
  ['日本語', '3', '9', 'each = 3 bytes'],
  ['😀', '1', '4', 'emoji = 4 bytes'],
], { cap: 'real results from PostgreSQL 17 (UTF-8)', hl: [2] }), 1.5)}
<ul style="font-size:23px">
<li><code class="i">length()</code> counts <b>characters</b> — what the user sees; <code class="i">octet_length()</code> counts <b>bytes</b> — what is stored.</li>
<li>Limits on <code class="i">varchar(n)</code> use <b>characters</b>; disk size uses bytes. Think in characters unless you budget storage.</li>
</ul>` },

  { t: 'Same look, different bytes: é as one or two characters', body: `
${zm(run(`SELECT length('e' || U&'\\0301')                  AS e_plus_accent_chars,
       'é' = 'e' || U&'\\0301'                   AS same_look_equal;
SELECT normalize(U&'e\\0301', NFC) = 'é'          AS nfc_equal,
       length(normalize(U&'e\\0301', NFC))        AS len_after;`, ` e_plus_accent_chars | same_look_equal
---------------------+-----------------
                   2 | f
(1 row)

 nfc_equal | len_after
-----------+-----------
 t         |         1
(1 row)`, { hlOut: [3, 8] }), 0.9)}
<ul style="font-size:22px">
<li>Vietnamese text can arrive <b>precomposed</b> (é = 1 character) or <b>decomposed</b> (e + a combining accent = 2). They look identical but are <b>not equal</b>.</li>
<li>Fix: <code class="i">normalize(text, NFC)</code> when you store, so searches and unique indexes behave.</li>
</ul>` },

  { t: 'Comparisons are case-sensitive', body: `
${zm(run(`SELECT 'Cuong@Example.com' = 'cuong@example.com'        AS equal_raw,
       lower('Cuong@Example.com') = 'cuong@example.com' AS equal_lower;`, ` equal_raw | equal_lower
-----------+-------------
 f         | t
(1 row)`, { hlOut: [3] }), 1.2)}
${two(box('Why it matters', 'A <code class="i">UNIQUE</code> email column treats <code class="i">Cuong@…</code> and <code class="i">cuong@…</code> as <b>two different</b> users unless you normalise.', 'do2'),
box('Three fixes', '① store <code class="i">lower(email)</code> · ② compare with <code class="i">ILIKE</code> · ③ the <code class="i">citext</code> extension (case-insensitive type).', 'xanh'))}
${ss('SQL Server’s default collation is case-INsensitive, so <code class="i">WHERE email = \'A@x.com\'</code> “just works” there. In PostgreSQL decide on purpose — lowercase on the way in.')}` },

  { t: 'Everyday string functions', body: `
${zm(run(`SELECT upper('postgres')              AS up,
       lower('PostgreSQL')            AS low,
       'Post' || 'gres'               AS joined,
       substring('PostgreSQL' from 1 for 4) AS sub,
       position('gre' in 'PostgreSQL') AS pos,
       trim('  hi  ')                 AS trimmed;`, `    up    |    low     |  joined  | sub  | pos | trimmed
----------+------------+----------+------+-----+---------
 POSTGRES | postgresql | Postgres | Post |   5 | hi
(1 row)`, { hlOut: [3] }), 0.95)}
${zm(run(`SELECT left('PostgreSQL', 4) AS l, right('PostgreSQL', 3) AS r,
       replace('a-b-c', '-', '+') AS rep, split_part('a,b,c', ',', 2) AS part,
       initcap('xin chào bạn') AS ic,
       'abc' LIKE 'a%' AS lk, 'ABC' ILIKE 'a%' AS ilk;`, '  l   |  r  |  rep  | part |      ic      | lk | ilk\n------+-----+-------+------+--------------+----+-----\n Post | SQL | a+b+c | b    | Xin Chào Bạn | t  | t\n(1 row)', {}), 0.95)}` },

  { t: 'NULL swallows ||', body: `
${zm(run(`SELECT 'abc' || NULL            AS pipe_null,
       concat('abc', NULL)       AS concat_null,
       coalesce(NULL, 'fallback') AS coal;`, ` pipe_null | concat_null |   coal
-----------+-------------+----------
           | abc         | fallback
(1 row)`, { hlOut: [3] }), 1.3)}
<ul style="font-size:24px">
<li><code class="i">||</code> with a NULL gives <b>NULL</b> — the whole name vanishes if one part is missing.</li>
<li><code class="i">concat()</code> skips NULLs; <code class="i">coalesce(x, 'default')</code> replaces them. Pick on purpose.</li>
</ul>
${ss('Same idea as <code class="i">+</code> vs <code class="i">CONCAT</code> in SQL Server — only the operator changes: <code class="i">||</code> instead of <code class="i">+</code>.')}` },

  { t: 'Choosing a text type', body: `
${zm(vsd(
  `<p style="font-size:20px;margin:0"><code class="i">varchar(255)</code> “because everyone does”</p><ul style="font-size:18px;margin:6px 0 0;padding-left:22px"><li>255 is a leftover MySQL detail — meaningless here</li><li>Not faster, not smaller than <code class="i">text</code></li><li>It <b>will</b> reject a real long name or a URL with tracking parameters</li><li>Changing it later = <code class="i">ALTER TABLE</code> on a live table</li></ul>`,
  `<p style="font-size:20px;margin:0"><code class="i">text</code> — or a limit the <b>business</b> really has</p><ul style="font-size:18px;margin:6px 0 0;padding-left:22px"><li><code class="i">varchar(2)</code> for an ISO country code</li><li><code class="i">text</code> + app-level length check for names, bodies, URLs</li><li><code class="i">citext</code> when case-insensitive matching is required</li><li><b>Never</b> <code class="i">char(n)</code></li></ul>`), 1.3)}` },

  { t: 'In production: how cuongthai.com chooses', body: `
${zm(two(sql(`model User {
  username String  @unique @db.VarChar(50)
  email    String  @unique @db.VarChar(100)
  bio      String? @db.Text
}

model Course {
  title            String  @db.VarChar(255)
  shortDescription String? @db.VarChar(500)
  description      String? @db.Text
}`, { sm: true, lang: 'typescript', hl: [2, 3, 4, 9] }),
`<ul style="font-size:21px;margin:0"><li>Real limits where a rule exists: <b>username 50</b>, <b>email 100</b>, course <b>short description 500</b> — the DB itself refuses longer text.</li>
<li>Free-form fields (<b>bio</b>, <b>description</b>) are <code class="i">Text</code>.</li>
<li>Prisma’s plain <code class="i">String</code> becomes <b><code class="i">text</code></b> in PostgreSQL; <code class="i">@db.VarChar(n)</code> adds the limit.</li>
<li>CT Shop (Lab 1) uses <code class="i">text</code> everywhere and adds <code class="i">CHECK</code> rules where needed.</li>
<li class="nho" style="font-size:19px">Honest note: course <b>title</b> is still <code class="i">VarChar(255)</code> — the habit from the previous slide. It works, but nobody chose 255 for a business reason.</li></ul>`, 'r55'), 1.08)}` },

  { t: 'Exercise: bytes, characters, and a safe code column', to: true, body: `
<ol>
<li>Predict <code class="i">length()</code> and <code class="i">octet_length()</code> of <code class="i">'Xin chào'</code>. Then run them.</li>
<li>Design the column for an <b>ISO country code</b> (“VN”, “US”) — which type, which extra rule?</li>
</ol>
${zm(run(`SELECT 'Xin chào' AS s, length('Xin chào') AS chars, octet_length('Xin chào') AS bytes;`, `    s     | chars | bytes
----------+-------+-------
 Xin chào |     8 |     9
(1 row)`, { hlOut: [3] }), 1.1)}
${box('Answer', '8 characters, 9 bytes (à = 2). Country code: <code class="i">country_code varchar(2) NOT NULL CHECK (country_code = upper(country_code))</code> — a real business limit, never <code class="i">char(2)</code>.', 'xanh')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Is <code class="i">varchar(500)</code> faster than <code class="i">text</code> in PostgreSQL? What is the real difference?</li>
<li>What is the difference between inserting <code class="i">'abcdef'</code> into a <code class="i">varchar(3)</code> column and casting it with <code class="i">::varchar(3)</code>?</li>
<li>Why is <code class="i">char(5)</code> a bad idea for storing a code?</li>
</ol>
${box('Answers', '1) No — same storage and speed; varchar adds a length rule. 2) The column <b>rejects</b> with an error; the cast silently <b>cuts</b> to “abc”. 3) It pads with blanks, so length, bytes, concatenation and copies disagree — hidden bugs.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Default to <b>text</b>; use <b>varchar(n)</b> only for a real business limit; <b>never char(n)</b></li>
<li>A column limit <b>rejects</b>; a <code class="i">::varchar(n)</code> cast <b>cuts</b></li>
<li><b>length()</b> = characters, <b>octet_length()</b> = bytes; normalise é with <code class="i">normalize(…, NFC)</code></li>
<li><code class="i">=</code> is case-sensitive; <code class="i">||</code> with NULL gives NULL</li>
<li>Next: <b>2.3 — Booleans, dates & time zones</b></li>
</ul>
${box('Practice', 'Reproduce the char(n) padding surprise in the PostgreSQL track on Code Lab — <b>cuongthai.com/code-lab</b>', 'lam')}` },
]);
