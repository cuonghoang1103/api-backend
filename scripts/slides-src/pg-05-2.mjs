/**
 * pg-05-2 — PostgreSQL · Chapter 5 · Lesson 5.2 "OUTER JOINs: keeping the unmatched rows" (slide EN, kiểu FU, 25/10/2026, agent c5).
 * Nguồn: content/courses/postgresql/s05-join.mjs › postgresql-5-2-outer-join. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-05-2.out.txt, schema ch05 + ctshop). Bổ sung: danh sách nộp bài (đời thường), NULL-pad bằng hình dây nối,
 * count(*) vs count(cột), COALESCE, anti-join (IS NULL / NOT EXISTS / bẫy NOT IN trả 0 dòng), RIGHT/FULL, bốn hình Venn có số dòng thật,
 * WHERE vs ON, khách CT Shop chưa mua (291–300), so sánh SQL Server, Prisma.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { joinPic, twoLists, fourShapes } from './pg-05-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-05-2', code: 'PG 5.2', title: 'OUTER JOINs: keeping the unmatched rows', sub: 'LEFT, RIGHT, FULL and the anti-join' };

const USER = { name: 'app_user', cols: ['id', 'name'], wc: [60, 150], rows: [[1, 'Cuong'], [2, 'Lan'], [3, 'Minh'], [4, 'Ngoc']] };
const NOTE = { name: 'note', cols: ['id', 'user_id', 'title'], wc: [60, 110, 220], rows: [[1, 1, 'Intro to SQL'], [2, 1, 'Indexes'], [3, 2, 'Timezones'], [4, 3, 'Backup'], [5, null, 'Orphan draft']] };
const PAIRS = [[0, 0], [0, 1], [1, 2], [2, 3]];

export const slides = lamDeck({ chuong: 'Chapter 5 — JOINs: combining tables', bai: '5.2' }, [
  { cover: true, t: 'OUTER JOINs:<br>keeping the unmatched rows', sub: 'LEFT, RIGHT and FULL —<br>and the famous “find rows with no partner” query.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Why <b>INNER JOIN silently drops</b> rows — and when that is the wrong answer</li>
<li><b>LEFT JOIN</b>: keep every left row, fill the gaps with <b>NULL</b></li>
<li>The <b>anti-join</b>: <code class="i">LEFT JOIN … WHERE right.id IS NULL</code> — customers with no orders</li>
<li>Why <code class="i">NOT IN</code> can return <b>zero rows</b> by mistake</li>
<li><b>RIGHT</b> and <b>FULL</b> JOIN, and the <b>WHERE vs ON</b> trap</li>
</ul>
${box('Where we are', 'Lesson 5.1: INNER JOIN keeps only matched pairs. Today the unmatched rows — often the <b>most interesting</b> rows — come back.', 'lam')}` },

  { t: 'Everyday example first: who has not handed in?', giua: true, body: `
${twoLists({ tl: 'Class roll (students)', tr: 'Submitted homework', l: ['An', 'Binh', 'Chi', 'Dung'], r: ['An — homework 1', 'Binh — homework 1', 'An — homework 2'], pairs: [[0, 0], [1, 1], [0, 2]], h: 290 })}
<p style="font-size:23px;margin:0">Match the roll to the submissions and you get <b>An, Binh</b> — but the teacher wants to know about <b>Chi and Dung</b>, who matched <b>nothing</b>. A plain match throws exactly those people away. An <b>outer</b> join keeps them, with an empty slot for the missing homework.</p>` },

  { t: 'INNER JOIN silently drops Ngoc', giua: true, body: `
${zm(run(`SELECT u.name, n.title
FROM app_user u JOIN note n ON n.user_id = u.id
ORDER BY u.id, n.id;`, `  name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
 Lan   | Timezones
 Minh  | Backup
(4 rows)`), 1.3)}
<p style="font-size:23px;margin:0">Four users exist, but only <b>three</b> appear: <b>Ngoc</b> wrote nothing, so there is no pair and the row is gone. For “list all users and their notes” that is a wrong answer — with no error to warn you.</p>` },

  { t: 'LEFT JOIN: keep every row from the left table', giua: true, body: `
${zm(run(`SELECT u.name, n.title
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
ORDER BY u.id, n.id;`, `  name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
 Lan   | Timezones
 Minh  | Backup
 Ngoc  |
(5 rows)`, { hl: [2], hlOut: [7] }), 1.3)}
<p style="font-size:23px;margin:0"><b>Ngoc</b> survived, with an empty (<b>NULL</b>) title. That empty cell is the signal: “this left row had <b>no match</b> on the right”. “Left” means the table written <b>before</b> the word JOIN.</p>` },

  { t: 'What LEFT JOIN does, line by line', body: `
${joinPic({ L: USER, R: NOTE, pairs: PAIRS, keepL: [3], dropR: [4], gap: 420, titleL: 'app_user u (left)', titleR: 'note n (right)' })}
<p style="font-size:22px;margin:0">Matched users get their notes as before. <b>Ngoc</b> has no match, so a row is made anyway — with <b>NULL</b> in every right-hand column. The orphan note belongs to the <i>right</i> table and is dropped (a LEFT join protects only the left side).</p>` },

  { t: 'Trap: count(*) counts the padding row', giua: true, body: `
${zm(run(`SELECT u.name,
       count(*)    AS wrong_count,
       count(n.id) AS notes
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
GROUP BY u.id, u.name ORDER BY u.id;`, `  name  | wrong_count | notes
-------+-------------+-------
 Cuong |           2 |     2
 Lan   |           1 |     1
 Minh  |           1 |     1
 Ngoc  |           1 |     0
(4 rows)`, { hlOut: [7] }), 1.2)}
${box('Count a column of the right table', '<code class="i">count(*)</code> counts rows — and Ngoc\'s padding row is a row, so she “has 1 note”. <code class="i">count(n.id)</code> counts only <b>non-NULL</b> values, so the padding row adds 0. Report “notes per user (even zero)” = LEFT JOIN + <code class="i">count(right.key)</code>.', 'lam')}` },

  { t: 'Show NULL as something readable', giua: true, body: `
${zm(run(`SELECT u.name,
       COALESCE(n.title, '(no notes yet)') AS title
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
ORDER BY u.id, n.id;`, `  name  |     title
-------+----------------
 Cuong | Intro to SQL
 Cuong | Indexes
 Lan   | Timezones
 Minh  | Backup
 Ngoc  | (no notes yet)
(5 rows)`, { hlOut: [7] }), 1.25)}
<p style="font-size:22px;margin:0"><code class="i">COALESCE(a, b)</code> returns the first non-NULL argument. Careful: a NULL can mean “no partner” <b>or</b> “the partner exists but this column is NULL”. To test for “no partner” always look at the partner's <b>key</b> (<code class="i">n.id</code>), never at a data column.</p>` },

  { t: 'The anti-join: rows with NO partner', body: `
${zm(run(`SELECT u.name
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
WHERE n.id IS NULL
ORDER BY u.id;`, ` name
------
 Ngoc
(1 row)`, { hl: [3], hlOut: [3] }), 1.25)}
${steps([
    '<b>LEFT JOIN</b> keeps everyone — Ngoc gets <code class="i">n.id = NULL</code> from the padding.',
    '<b>WHERE n.id IS NULL</b> keeps exactly the rows the padding created.',
    'Result: the users who wrote <b>no note at all</b>.',
  ])}
<p class="nho" style="font-size:20px">“Customers with no orders”, “posts with no comments”, “files no record points at” — all the same query shape.</p>` },

  { t: 'Anti-join, second way: NOT EXISTS', body: `
${zm(run(`SELECT u.name FROM app_user u
WHERE NOT EXISTS (
  SELECT 1 FROM note n WHERE n.user_id = u.id
)
ORDER BY u.id;`, ` name
------
 Ngoc
(1 row)`, { hl: [2, 3, 4] }), 1.25)}
${two(box('Same rows', 'Both forms find Ngoc. <code class="i">NOT EXISTS</code> reads like English (“no note exists for this user”) and is the form many teams prefer.', 'xanh'),
box('Performance', 'PostgreSQL turns both into the same <b>anti-join</b> plan. Pick the one your team reads fastest; check with <code class="i">EXPLAIN</code> in Chapter 10.', 'info'))}` },

  { t: 'Trap: NOT IN and NULL = zero rows', giua: true, body: `
${zm(run(`SELECT u.name FROM app_user u
WHERE u.id NOT IN (SELECT user_id FROM note)
ORDER BY u.id;`, ` name
------
(0 rows)`, { hlOut: [1, 2] }), 1.3)}
${box('Why zero rows?', '<code class="i">note.user_id</code> contains a <b>NULL</b> (the orphan draft). <code class="i">4 NOT IN (1, 2, 3, NULL)</code> is never true — “is 4 different from an unknown value?” is <i>unknown</i>. One NULL in the list empties the whole result — and Ngoc, who clearly wrote nothing, vanishes.', 'bad')}` },

  { t: 'Three ways to write “no partner”', giua: true, body: `
${zm(run(`SELECT u.name FROM app_user u
WHERE u.id NOT IN (SELECT user_id FROM note
                   WHERE user_id IS NOT NULL)
ORDER BY u.id;`, ` name
------
 Ngoc
(1 row)`, { hlOut: [3] }), 1.2)}
${zm(`<table class="t">
<tr><th style="width:360px">Form</th><th>Safe with NULL?</th></tr>
<tr><td><code class="i">LEFT JOIN … WHERE r.id IS NULL</code></td><td class="xanh">yes</td></tr>
<tr><td><code class="i">WHERE NOT EXISTS (SELECT 1 …)</code></td><td class="xanh">yes — the one to prefer</td></tr>
<tr><td><code class="i">WHERE x NOT IN (SELECT …)</code></td><td class="do">no — add <code class="i">IS NOT NULL</code> inside, or avoid</td></tr>
</table>`, 1.15)}` },

  { t: 'RIGHT JOIN: the mirror image', giua: true, body: `
${zm(run(`SELECT u.name AS author, n.title
FROM app_user u RIGHT JOIN note n ON n.user_id = u.id
ORDER BY n.id;`, ` author |    title
--------+--------------
 Cuong  | Intro to SQL
 Cuong  | Indexes
 Lan    | Timezones
 Minh   | Backup
        | Orphan draft
(5 rows)`, { hlOut: [7] }), 1.25)}
${two(box('What it keeps', 'Every row of the <b>right</b> table (note). The authorless <b>Orphan draft</b> survives with a NULL author; Ngoc, on the left, is dropped.', 'info'),
box('In practice', 'Swap the two tables and write <code class="i">LEFT JOIN</code> — identical result, easier to read. Most teams never write RIGHT JOIN.', 'xanh'))}` },

  { t: 'FULL JOIN: keep both sides', body: `
${zm(run(`SELECT u.name AS author, n.title
FROM app_user u FULL JOIN note n ON n.user_id = u.id
ORDER BY u.id NULLS LAST, n.id NULLS LAST;`, ` author |    title
--------+--------------
 Cuong  | Intro to SQL
 Cuong  | Indexes
 Lan    | Timezones
 Minh   | Backup
 Ngoc   |
        | Orphan draft
(6 rows)`, { hlOut: [7, 8] }), 1.0)}
${joinPic({ L: USER, R: NOTE, pairs: PAIRS, keepL: [3], keepR: [4], gap: 420, titleL: 'app_user', titleR: 'note', rowH: 36, fs: 18 })}` },

  { t: 'FULL JOIN for reconciliation', giua: true, body: `
${zm(run(`SELECT u.name AS author, n.title
FROM app_user u FULL JOIN note n ON n.user_id = u.id
WHERE u.id IS NULL OR n.id IS NULL
ORDER BY u.id NULLS LAST;`, ` author |    title
--------+--------------
 Ngoc   |
        | Orphan draft
(2 rows)`, { hl: [3], hlOut: [3, 4] }), 1.3)}
<p style="font-size:23px;margin:0">Only the <b>lopsided</b> rows: users with no notes <i>and</i> notes with no user. This is the “compare two lists” query — payments vs invoices, imported file vs database — to find what exists on one side only.</p>` },

  { t: 'The four shapes, side by side', body: `
${fourShapes({ rows: [4, 5, 5, 6] })}
${zm(`<table class="t">
<tr><th style="width:130px">Shape</th><th>Keeps</th><th style="width:300px">Our data</th></tr>
<tr><td><b>INNER</b></td><td>matched pairs only</td><td>4 rows</td></tr>
<tr><td><b>LEFT</b></td><td>all left + matches (NULL-padded)</td><td>5 rows (+ Ngoc)</td></tr>
<tr><td><b>RIGHT</b></td><td>all right + matches</td><td>5 rows (+ Orphan draft)</td></tr>
<tr><td><b>FULL</b></td><td>everything from both sides</td><td>6 rows (+ both)</td></tr>
</table>`, 0.95)}` },

  { t: 'Trap: a WHERE on the right table kills the LEFT', giua: true, body: `
${zm(run(`SELECT u.name, n.title
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
WHERE n.tag = 'sql'
ORDER BY u.id, n.id;`, `  name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
(2 rows)`, { hl: [3], hlOut: [3, 4] }), 1.3)}
<p style="font-size:23px;margin:0"><b>WHERE runs after the join.</b> Lan's and Minh's notes carry other tags, and Ngoc's padding row has <code class="i">n.tag</code> = NULL — <code class="i">NULL = 'sql'</code> is not true — so all three are thrown away. Your LEFT JOIN quietly became an INNER JOIN, and three users are gone.</p>` },

  { t: 'The fix: put the optional-side filter in ON', giua: true, body: `
${zm(run(`SELECT u.name, n.title
FROM app_user u
LEFT JOIN note n ON n.user_id = u.id AND n.tag = 'sql'
ORDER BY u.id, n.id;`, `  name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
 Lan   |
 Minh  |
 Ngoc  |
(5 rows)`, { hl: [3], hlOut: [5, 6, 7] }), 1.3)}
${box('Rule', '<b>ON</b> decides what counts as a <i>match</i>: every user stays, with a title only where a sql note exists. A filter on the <b>preserved</b> (left) side belongs in <b>WHERE</b>; a filter on the <b>optional</b> (right) side belongs in <b>ON</b>.', 'lam')}` },

  { t: 'Real data: CT Shop customers who never ordered', body: `
${zm(run(`\\c ctshop
SELECT c.id, c.full_name
FROM customer c LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL
ORDER BY c.id;`, ` id  |    full_name
-----+------------------
 291 | Phạm Quốc Bình
 292 | Hoàng Thu Chi
 293 | Vũ Gia Dũng
 294 | Đặng Văn Hà
 295 | Bùi Thị Khoa
 296 | Nguyễn Minh Linh
 297 | Trần Quốc Nam
 298 | Lê Thu Phúc
 299 | Phạm Gia Trang
 300 | Hoàng Văn An
(10 rows)`, { hlOut: [3, 4, 5] }), 0.95)}
<p style="font-size:21px;margin:0">300 customers, 2000 orders: exactly <b>10</b> customers (291–300) never bought anything — the list a marketing email wants. <code class="i">NOT EXISTS</code> gives the same count (10).</p>` },

  { t: 'Real data: zero is a number too', body: `
${zm(run(`SELECT c.id, c.full_name, count(o.id) AS orders
FROM customer c LEFT JOIN orders o ON o.customer_id = c.id
WHERE c.id IN (1, 2, 290, 291)
GROUP BY c.id, c.full_name ORDER BY c.id;`, `  id  |   full_name    | orders
-----+----------------+--------
   1 | Trần Thị Bình  |      7
   2 | Lê Minh Chi    |      7
 290 | Lê Minh An     |     10
 291 | Phạm Quốc Bình |      0`, { hlOut: [6] }), 0.92)}
${zm(run(`SELECT o.status, count(*) AS orders_without_payment
FROM orders o LEFT JOIN payment p ON p.order_id = o.id
WHERE p.id IS NULL
GROUP BY o.status ORDER BY o.status;`, `  status   | orders_without_payment
-----------+------------------------
 cancelled |                    157
 pending   |                    180`), 0.92)}
<p style="font-size:19px;margin:0">Customer 291 shows <b>0</b>, not a missing row. The anti-join on <code class="i">payment</code> finds orders nobody paid: only <i>cancelled</i> and <i>pending</i> — a good sanity check.</p>` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:360px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">LEFT OUTER JOIN</code> / <code class="i">LEFT JOIN</code></td><td><b>Identical</b>; the word OUTER is optional in both</td></tr>
<tr><td><code class="i">FULL OUTER JOIN</code></td><td><b>Same</b></td></tr>
<tr><td><code class="i">ISNULL(a, b)</code></td><td><code class="i">COALESCE(a, b)</code> (standard; SQL Server has it too)</td></tr>
<tr><td><code class="i">NOT IN</code> + NULL → empty result</td><td><b>Same trap</b>; use NOT EXISTS</td></tr>
<tr><td>Sort: NULLs come <b>first</b> in ascending order</td><td>NULLs come <b>last</b> — control with <code class="i">NULLS FIRST / LAST</code></td></tr>
</table>`, 1.28)}` },

  { t: 'In production: profiles with zeros, accounts to clean', body: `
${zm(sql(`// cuongthai.com — a brand-new user still gets a full profile
const profile = await prisma.user.findUnique({
  where: { id },
  include: { _count: { select: { posts: true, followers: true } } },
});                                  // counts are 0, row is never lost

// "accounts that never posted" = an anti-join, in Prisma words
const quiet = await prisma.user.findMany({
  where: { posts: { none: {} } },    // “has no related post”
});`, { sm: true, lang: 'typescript' }), 1.1)}
${two(box('Profile page', 'An INNER JOIN would make a user with no posts and no followers <b>disappear</b>. LEFT JOIN (or Prisma <code class="i">_count</code>) keeps the row and shows zeros.', 'xanh'),
box('Clean-up jobs', '“Accounts with no activity” and “files no record references” are anti-joins. Prisma’s <code class="i">none: {}</code> filter expresses the idea; use raw SQL when you need the exact LEFT JOIN … IS NULL shape.', 'info'))}` },

  { t: 'Exercise: every user and their sql notes', giua: true, to: true, body: `
<p style="font-size:26px;margin:0">Write one query that lists <b>every user</b> with the <b>number of notes tagged sql</b> they wrote — <b>0</b> for users with none.</p>
${box('Think first', 'Which join keeps Ngoc, Lan and Minh? Where does the <code class="i">tag = \'sql\'</code> condition go — ON or WHERE? What do you count: <code class="i">count(*)</code> or <code class="i">count(n.id)</code>? What happens if you get the condition wrong?', 'lam')}
<p class="nho">Pause the video and write it yourself.</p>` },

  { t: 'Exercise: the answer', giua: true, body: `
${zm(run(`SELECT u.name, count(n.id) AS sql_notes
FROM app_user u
LEFT JOIN note n ON n.user_id = u.id AND n.tag = 'sql'
GROUP BY u.id, u.name
ORDER BY u.id;`, `  name  | sql_notes
-------+-----------
 Cuong |         2
 Lan   |         0
 Minh  |         0
 Ngoc  |         0
(4 rows)`, { hl: [3], hlOut: [3, 4, 5, 6] }), 1.3)}
<p style="font-size:22px;margin:0"><b>LEFT JOIN</b> keeps the four users; the tag test sits in <b>ON</b>, so users with other notes stay with 0; <b>count(n.id)</b> ignores the padding. Move the tag test to WHERE and only Cuong would be left.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>Write the <b>anti-join</b> that finds users with no notes. Which column do you test for NULL, and why that one?</li>
<li>A LEFT JOIN suddenly returns fewer rows after you added <code class="i">WHERE n.tag = 'sql'</code>. What happened, and what are two fixes?</li>
<li>Why can <code class="i">NOT IN (SELECT user_id FROM note)</code> return no rows at all?</li>
</ol>
${box('Answers', '<b>1.</b> <code class="i">LEFT JOIN note n ON n.user_id = u.id WHERE n.id IS NULL</code> — test the partner\'s <b>key</b>, which is never NULL for a real row. <b>2.</b> WHERE discarded the NULL padding rows; move the condition into ON (or test <code class="i">… OR n.id IS NULL</code>, which is cruder). <b>3.</b> The list contains a NULL; <code class="i">x NOT IN (…, NULL)</code> is never true. Use NOT EXISTS.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li><b>LEFT JOIN</b> keeps every left row; missing partners become <b>NULL</b>. RIGHT is its mirror; FULL keeps both sides</li>
<li><b>Anti-join</b> = <code class="i">LEFT JOIN … WHERE right.id IS NULL</code> (or <code class="i">NOT EXISTS</code>) — never trust <code class="i">NOT IN</code> with NULLs</li>
<li>Count with <code class="i">count(right.key)</code>; filter the optional side in <b>ON</b></li>
</ul>
${box('Next: 5.3 — many tables & the self-join', 'Real questions span three, four, five tables — and sometimes a table joins <b>itself</b> (employee → manager). Same JOIN, a few new habits with aliases.', 'lam')}` },
]);
