/**
 * pg-05-3 — PostgreSQL · Chapter 5 · Lesson 5.3 "Joining many tables & the self-join" (slide EN, kiểu FU, 25/10/2026, agent c5).
 * Nguồn: content/courses/postgresql/s05-join.mjs › postgresql-5-3-multi-self-join. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-05-3.out.txt, schema ch05 + ctshop). Bổ sung: thời khoá biểu (đời thường), sơ đồ chuỗi bảng + alias,
 * join kết hợp trái (số dòng từng bước), lỗi alias thật, LEFT rồi INNER làm rơi dòng, self-join cây quản lý (hai/ba cấp, cặp đồng nghiệp),
 * LATERAL ↔ OUTER APPLY, "FK không tự có chỉ mục", SocialComment.parentId của cuongthai.com, bảng đối chiếu SQL Server.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, flow, c } from './_pg-chung.mjs';
import { chainPic, orgTree } from './pg-05-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-05-3', code: 'PG 5.3', title: 'Joining many tables & the self-join', sub: 'Chains of joins, aliases, and a table joined to itself' };

const NOTE_COL = ['id', 'user_id', 'title'];
const commentChain = () => chainPic({
  w: 1110, h: 350,
  boxes: [
    { id: 'c', t: 'comment', alias: 'c', x: 8, y: 130, bw: 230, bh: 150, lines: ['id', 'note_id', 'user_id', 'body'], c: '#7a5a9a' },
    { id: 'n', t: 'note', alias: 'n', x: 470, y: 44, bw: 220, bh: 118, lines: ['id', 'user_id', 'title'], c: '#336791' },
    { id: 'au', t: 'app_user', alias: 'au', x: 930, y: 44, bw: 170, bh: 106, lines: ['id', 'name'], c: '#2f7d4f' },
    { id: 'cu', t: 'app_user', alias: 'cu', x: 930, y: 236, bw: 170, bh: 106, lines: ['id', 'name'], c: '#b85a2b' },
  ],
  edges: [
    { from: 'c', to: 'n', on: 'n.id = c.note_id', dy: -8 },
    { from: 'n', to: 'au', on: 'au.id = n.user_id', dy: -26 },
    { from: 'c', to: 'cu', on: 'cu.id = c.user_id', dy: 0 },
  ],
});
const lessonChain = () => chainPic({
  w: 1110, h: 270,
  boxes: [
    { id: 'l', t: 'lesson', x: 20, y: 80, bw: 300, bh: 110, lines: ['Math · Mon 9:00', 'teacher_id, room_id'], c: '#7a5a9a' },
    { id: 't', t: 'teacher', x: 700, y: 10, bw: 280, bh: 96, lines: ['Ms Hoa'], c: '#2f7d4f' },
    { id: 'r', t: 'room', x: 700, y: 150, bw: 280, bh: 96, lines: ['B204'], c: '#b85a2b' },
  ],
  edges: [{ from: 'l', to: 't', on: 'teacher_id', dy: -14 }, { from: 'l', to: 'r', on: 'room_id', dy: 14 }],
});

export const slides = lamDeck({ chuong: 'Chapter 5 — JOINs: combining tables', bai: '5.3' }, [
  { cover: true, t: 'Joining many tables<br>& the self-join', sub: 'Chains of JOINs, aliases —<br>and a table that joins itself.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Chain <b>three, four, five</b> tables with one <code class="i">JOIN … ON</code> per relationship</li>
<li>Use the <b>same table twice</b> with two aliases (note author vs commenter)</li>
<li>Read a join <b>left to right</b> and see why one INNER join can undo an earlier LEFT join</li>
<li>The <b>self-join</b>: employee → manager, grand-manager, colleagues; categories → parent</li>
<li><code class="i">LATERAL</code> (T-SQL <code class="i">APPLY</code>), and the myth “more joins = slower”</li>
</ul>
${box('Where we are', '5.1: INNER matches pairs. 5.2: OUTER keeps the unmatched. Today the same JOIN scales up — no new keyword, only <b>more of them</b>, and a few habits with aliases.', 'lam')}` },

  { t: 'Everyday example first: a school timetable', giua: true, body: `
${lessonChain()}
<p style="font-size:23px;margin:0">A timetable row says only <b>“teacher 7, room 12”</b>. To print “Math — Ms Hoa — room B204” you look up <b>two different tables</b>: one hop to the teacher list, one hop to the room list. Every extra fact is one more hop — one more <b>JOIN</b> in the query.</p>` },

  { t: 'Our data: comments on notes', body: `
${two(tbl(['id', 'note_id', 'user_id', 'body'], [[1, 1, 2, 'Great intro!'], [2, 1, 3, 'Thanks'], [3, 3, 1, 'Very clear']], { cap: 'comment' }),
tbl(['id', 'user_id', 'title'], [[1, 1, 'Intro to SQL'], [2, 1, 'Indexes'], [3, 2, 'Timezones'], [4, 3, 'Backup'], [5, null, 'Orphan draft']], { cap: 'note (from 5.1)' }), 'r46')}
<ul style="font-size:23px;margin:4px 0 0">
<li>A comment points at <b>a note</b> (<code class="i">note_id</code>) and at <b>the person who wrote it</b> (<code class="i">user_id</code>)</li>
<li>A note points at <b>its author</b> (<code class="i">user_id</code>) — both people live in the <b>same</b> table <code class="i">app_user</code></li>
</ul>
${box('The question', '“Show each comment with the note it is on and <b>both</b> people involved: who wrote the note, who commented.”', 'lam')}` },

  { t: 'Chaining three joins', body: `
${zm(run(`SELECT c.body, n.title,
       au.name AS note_author, cu.name AS commenter
FROM comment c
JOIN note n      ON n.id = c.note_id
JOIN app_user au ON au.id = n.user_id   -- who wrote the note
JOIN app_user cu ON cu.id = c.user_id   -- who wrote the comment
ORDER BY c.id;`, `     body     |    title     | note_author | commenter
--------------+--------------+-------------+-----------
 Great intro! | Intro to SQL | Cuong       | Lan
 Thanks       | Intro to SQL | Cuong       | Minh
 Very clear   | Timezones    | Lan         | Cuong
(3 rows)`, { hl: [4, 5, 6], hlOut: [3, 4, 5] }), 1.15)}
<p style="font-size:22px;margin:0">One query, four table references (<code class="i">app_user</code> used <b>twice</b>), and the whole picture assembles: what was said, on which note, by whom, on whose note.</p>` },

  { t: 'The same query as a picture', body: `
${commentChain()}
<p style="font-size:22px;margin:0">Each <b>JOIN … ON</b> is one arrow. The two <code class="i">app_user</code> boxes are the <b>same table</b> playing two roles — the aliases <b>au</b> (author) and <b>cu</b> (commenter) are what tell PostgreSQL which role each column belongs to.</p>` },

  { t: 'Read it left to right', giua: true, body: `
${flow([{ t: 'comment', s: '3 rows', mau: '#7a5a9a' }, { t: '+ note', s: '3 rows', mau: '#336791' }, { t: '+ au', s: '3 rows', mau: '#2f7d4f' }, { t: '+ cu', s: '3 rows', mau: '#b85a2b' }], { h: 160, fs: 24 })}
${steps([
    '<code class="i">a JOIN b JOIN c</code> means <b>(a JOIN b) JOIN c</b> — the third join sees the <b>combined result</b> of the first two, so it may use columns from either.',
    '<b>Written order ≠ executed order.</b> For INNER joins the planner may reorder them freely; your job is to state the relationships correctly (Chapter 10.2 shows its choice).',
    'Every join is judged by the same questions as 5.1: <b>is the key unique?</b> how many rows come out?',
  ])}` },

  { t: 'Alias mistakes PostgreSQL catches for you', body: `
${zm(run(`SELECT c.body, name FROM comment c
JOIN app_user ON app_user.id = c.user_id
JOIN app_user ON app_user.id = c.user_id;`, `ERROR:  table name "app_user" specified more than once`, { hlOut: [1] }), 1.0)}
${zm(run(`SELECT c.body FROM comment c
JOIN app_user au ON au.id = n.user_id
JOIN note n      ON n.id = c.note_id;`, `ERROR:  missing FROM-clause entry for table "n"
LINE 1: ...c.body FROM comment c JOIN app_user au ON au.id = n.user_id ...
                                                             ^`, { hlOut: [1] }), 1.0)}
${two(box('Same table twice', 'Needs <b>two different aliases</b>. Without them PostgreSQL cannot tell which <code class="i">app_user</code> you mean.', 'info'),
box('Use a table before it is joined', 'The ON clause may only mention tables that appear <b>earlier</b> in the FROM list. Join <code class="i">note</code> first, then use <code class="i">n.user_id</code>.', 'info'))}` },

  { t: 'Trap: an INNER join after a LEFT join', giua: true, body: `
${zm(run(`SELECT n.title, c.body, u.name
FROM note n
LEFT JOIN comment c ON c.note_id = n.id
JOIN app_user u ON u.id = c.user_id
ORDER BY n.id, c.id;`, `    title     |     body     | name
--------------+--------------+-------
 Intro to SQL | Great intro! | Lan
 Intro to SQL | Thanks       | Minh
 Timezones    | Very clear   | Cuong
(3 rows)`, { hl: [4], hlOut: [3, 4, 5] }), 1.25)}
${box('Three notes vanished', 'The LEFT join kept <b>Indexes, Backup and the Orphan draft</b> (no comment → padding row, <code class="i">c.user_id</code> = NULL). Then the INNER join tested <code class="i">u.id = NULL</code>, which is never true, and threw those rows away — the same effect as a WHERE on the right table (5.2).', 'bad')}` },

  { t: 'The fix: once LEFT, keep LEFT', giua: true, body: `
${zm(run(`SELECT n.title, c.body, u.name
FROM note n
LEFT JOIN comment c ON c.note_id = n.id
LEFT JOIN app_user u ON u.id = c.user_id
ORDER BY n.id, c.id;`, `    title     |     body     | name
--------------+--------------+-------
 Intro to SQL | Great intro! | Lan
 Intro to SQL | Thanks       | Minh
 Indexes      |              |
 Timezones    | Very clear   | Cuong
 Backup       |              |
 Orphan draft |              |
(6 rows)`, { hl: [4], hlOut: [5, 7, 8] }), 1.2)}
<p style="font-size:22px;margin:0">Six rows: every note is back, comment and commenter filled in where they exist. <b>Rule:</b> after one LEFT JOIN in a chain, make every <b>later</b> join in that chain a LEFT JOIN too.</p>` },

  { t: 'Real data: four CT Shop tables', giua: true, body: `
${zm(run(`\\c ctshop
SELECT o.id AS order_id, c.full_name, p.name AS product, oi.qty
FROM orders o
JOIN customer c    ON c.id = o.customer_id
JOIN order_item oi ON oi.order_id = o.id
JOIN product p     ON p.id = oi.product_id
WHERE o.id IN (1, 2)
ORDER BY o.id, p.name;`, ` order_id |  full_name   |             product              | qty
----------+--------------+----------------------------------+-----
        1 | Vũ Thị Bình  | Máy tính Casio FX-880BTG         |   1
        1 | Vũ Thị Bình  | Thước thép Deli 30cm             |   1
        2 | Vũ Gia Trang | Bút chì gỗ Thiên Long 2B GP-01   |   1
        2 | Vũ Gia Trang | Máy tính Deli D82TL              |   1
        2 | Vũ Gia Trang | Sách Clean Code (bản tiếng Việt) |   2
(5 rows)`, { hl: [4, 5, 6], hlOut: [3, 4, 5, 6, 7] }), 1.0)}
<p style="font-size:21px;margin:0">An order (customer, items, products) is the classic multi-table shape: <b>orders → customer</b> (many-to-one), <b>orders → order_item</b> (one-to-many), <b>order_item → product</b>. Orders 1 and 2 have 2 and 3 items, hence 5 rows — the order and customer repeat once per item.</p>` },

  { t: 'The self-join: a table that points at itself', body: `
${two(`<div>${tbl(['id', 'name', 'manager_id'], [[1, 'Alice', null], [2, 'Bob', 1], [3, 'Carol', 1], [4, 'Dave', 2]], { cap: 'employee', o: [[1, 2], [2, 2], [3, 2]] })}</div>`,
`<div>${orgTree({ w: 520, h: 300 })}</div>`)}
<p style="font-size:23px;margin:0"><code class="i">manager_id</code> points at <b>another row of the same table</b>. To print each employee next to the manager's <i>name</i> you join the table to itself — once as “the employee” (<b>e</b>), once as “the manager” (<b>m</b>).</p>` },

  { t: 'Self-join with LEFT: employee and manager', giua: true, body: `
${zm(run(`SELECT e.name AS employee, m.name AS manager
FROM employee e LEFT JOIN employee m ON m.id = e.manager_id
ORDER BY e.id;`, ` employee | manager
----------+---------
 Alice    |
 Bob      | Alice
 Carol    | Alice
 Dave     | Bob
(4 rows)`, { hl: [2], hlOut: [3] }), 1.3)}
<p style="font-size:23px;margin:0">The <b>same physical table</b> plays two roles. It is a <b>LEFT</b> join on purpose: Alice, the top boss, has <code class="i">manager_id = NULL</code>.</p>` },

  { t: 'INNER silently drops the boss', giua: true, body: `
${zm(run(`SELECT e.name AS employee, m.name AS manager
FROM employee e JOIN employee m ON m.id = e.manager_id
ORDER BY e.id;`, ` employee | manager
----------+---------
 Bob      | Alice
 Carol    | Alice
 Dave     | Bob
(3 rows)`, { hlOut: [3, 4, 5] }), 1.3)}
${box('The hierarchy trap', 'The top of any tree has <b>no parent</b>. INNER JOIN drops the CEO (and the root category, the first comment in a thread…) without a word. Self-joins are <b>almost always LEFT</b>.', 'bad')}` },

  { t: 'Two levels: the manager’s manager', giua: true, body: `
${zm(run(`SELECT e.name AS employee, m.name AS manager,
       g.name AS grand_manager
FROM employee e
LEFT JOIN employee m ON m.id = e.manager_id
LEFT JOIN employee g ON g.id = m.manager_id
ORDER BY e.id;`, ` employee | manager | grand_manager
----------+---------+---------------
 Alice    |         |
 Bob      | Alice   |
 Carol    | Alice   |
 Dave     | Bob     | Alice
(4 rows)`, { hl: [5], hlOut: [6] }), 1.25)}
<p style="font-size:22px;margin:0">Three copies of one table: e, m, g. Each hop up the tree costs one more self-join. For “any depth” you need a <b>recursive CTE</b> (Chapter 7) — one join per level does not scale.</p>` },

  { t: 'Pairs of colleagues: a.id < b.id', body: `
${zm(run(`SELECT a.name AS one, b.name AS other,
       m.name AS shared_manager
FROM employee a
JOIN employee b ON b.manager_id = a.manager_id
                AND a.id < b.id
JOIN employee m ON m.id = a.manager_id;`, ` one | other | shared_manager
-----+-------+----------------
 Bob | Carol | Alice
(1 row)`, { hl: [5], hlOut: [3] }), 1.0)}
${zm(run(`SELECT count(*) AS pairs_without_rule
FROM employee a JOIN employee b ON b.manager_id = a.manager_id;`, ` pairs_without_rule
--------------------
                  5
(1 row)`, { hlOut: [3] }), 0.95)}
<p style="font-size:21px;margin:0">Without <code class="i">a.id &lt; b.id</code> every pair appears twice (Bob–Carol <i>and</i> Carol–Bob) and every employee is paired with <b>themselves</b>: 5 rows instead of 1.</p>` },

  { t: 'Real data: the category tree in CT Shop', body: `
${zm(run(`SELECT ch.name AS category, pa.name AS parent
FROM category ch LEFT JOIN category pa ON pa.id = ch.parent_id
ORDER BY ch.id;`, `     category     |     parent
------------------+-----------------
 Bút & mực        |
 Vở & giấy        |
 Dụng cụ học tập  |
 Sách & tài liệu  |
 Bút bi           | Bút & mực
 Bút chì & tẩy    | Bút & mực
 Bút dạ quang     | Bút & mực
 Vở ô ly          | Vở & giấy
 Sổ tay           | Vở & giấy
 Máy tính cầm tay | Dụng cụ học tập
 Thước & compa    | Dụng cụ học tập
 Giáo trình IT    | Sách & tài liệu
(12 rows)`, { hlOut: [3, 4, 5, 6, 7] }), 1.0)}
<p style="font-size:19px;margin:0">Four root categories (parent NULL) and eight children: the whole shop menu in one self-join.</p>` },

  { t: 'LATERAL: a subquery that sees the left row', body: `
${zm(run(`SELECT u.name, last_n.title
FROM app_user u
LEFT JOIN LATERAL (
  SELECT n.title FROM note n
  WHERE n.user_id = u.id
  ORDER BY n.id DESC LIMIT 1
) last_n ON true
ORDER BY u.id;`, `  name  |   title
-------+-----------
 Cuong | Indexes
 Lan   | Timezones
 Minh  | Backup
 Ngoc  |
(4 rows)`, { hl: [3, 4, 5, 6, 7], hlOut: [3] }), 1.0)}
<p style="font-size:22px;margin:0">“<b>The latest note of each user</b>” — a top-1 <i>per row</i>. A plain subquery cannot see <code class="i">u.id</code>; <code class="i">LATERAL</code> can. <code class="i">LEFT JOIN LATERAL … ON true</code> keeps Ngoc (no notes); plain <code class="i">JOIN LATERAL</code> would drop her. In SQL Server this is <code class="i">OUTER APPLY</code> / <code class="i">CROSS APPLY</code>.</p>` },

  { t: 'Myth: more joins = a slower query', body: `
${vsd(`<p style="font-size:21px;margin:0">“Six joins must cost six times one join, so flatten the schema into one wide table.”</p>`, `<p style="font-size:21px;margin:0">Six joins over small, <b>indexed</b> tables usually beat scanning one wide, denormalized table — each join reads only the rows the previous step needs.</p>`, '✗ The instinct', '✓ What measures show')}
${zm(run(`\\d comment`, `Indexes:
    "comment_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "comment_note_id_fkey" FOREIGN KEY (note_id) REFERENCES note(id)
    "comment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES app_user(id)`, { hlOut: [1, 2] }), 1.05)}
${box('What really costs: a join key with no index', 'PostgreSQL indexes the <b>primary key</b> automatically, but <b>not</b> the foreign-key column on the child side: <code class="i">comment.note_id</code> has no index above. Joining on it scans the whole table. Count <b>missing indexes</b>, not joins — Chapter 9 measures it.', 'xanh')}` },

  { t: 'Coming from SQL Server? Quick map', giua: true, body: `
${zm(`<table class="t">
<tr><th style="width:360px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Chain of <code class="i">JOIN … ON</code>, aliases</td><td><b>Identical</b>; same self-join pattern</td></tr>
<tr><td><code class="i">CROSS APPLY</code> / <code class="i">OUTER APPLY</code></td><td><code class="i">JOIN LATERAL … ON true</code> / <code class="i">LEFT JOIN LATERAL … ON true</code></td></tr>
<tr><td><code class="i">SELECT TOP 1 …</code> inside APPLY</td><td><code class="i">… ORDER BY … LIMIT 1</code> inside LATERAL</td></tr>
<tr><td>Recursive hierarchy: <code class="i">WITH cte AS (… UNION ALL …)</code></td><td>Same, but you write <code class="i">WITH RECURSIVE</code> (Chapter 7)</td></tr>
<tr><td>Join hints <code class="i">INNER LOOP JOIN</code>, <code class="i">OPTION (FORCE ORDER)</code></td><td>No hints — steer with indexes and statistics (Chapter 10)</td></tr>
</table>`, 1.12)}` },

  { t: 'In production: replies are a self-join', body: `
${zm(sql(`model SocialComment {                              // trimmed from schema.prisma
  id       Int   @id @default(autoincrement())
  parentId Int?  @map("parent_id")                  // NULL = top-level comment
  parent   SocialComment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies  SocialComment[] @relation("CommentReplies")
  @@index([parentId], name: "idx_social_comments_parent")   // the join key has its OWN index
  @@map("social_comments")
}`, { sm: true, lang: 'typescript' }), 1.05)}
${zm(sql(`-- "replying to …": the comment table joined to itself
SELECT r.id, r.parent_id, p.id AS replying_to
FROM social_comments r
LEFT JOIN social_comments p ON p.id = r.parent_id;`, { sm: true }), 1.0)}
<p style="font-size:20px;margin:0">Threaded replies on cuongthai.com work exactly like the employee table: <code class="i">parentId</code> = <code class="i">manager_id</code>. The schema also adds an index on the join key — the lesson of the previous slide.</p>` },

  { t: 'Exercise: two multi-table queries', giua: true, to: true, body: `
<ol style="font-size:24px">
<li>List each comment's <b>body</b>, the <b>note title</b> and the <b>commenter's name</b> — only for comments on notes tagged <code class="i">sql</code>.</li>
<li>List the employees whose manager is <b>Alice</b>, with the manager's name.</li>
</ol>
${box('Before you run it', 'How many tables does query 1 need — two or three? Which joins can be INNER? Does query 2 need a LEFT join? Why or why not?', 'lam')}
<p class="nho">Pause the video and write both queries.</p>` },

  { t: 'Exercise: the answers (real output)', giua: true, body: `
${two(`${zm(run(`SELECT c.body, n.title, cu.name AS commenter
FROM comment c
JOIN note n ON n.id = c.note_id
JOIN app_user cu ON cu.id = c.user_id
WHERE n.tag = 'sql'
ORDER BY c.id;`, `     body     |    title     | commenter
--------------+--------------+-----------
 Great intro! | Intro to SQL | Lan
 Thanks       | Intro to SQL | Minh
(2 rows)`, { hlOut: [3, 4] }), 1.05)}`,
`${zm(run(`SELECT e.name AS employee, m.name AS manager
FROM employee e
JOIN employee m ON m.id = e.manager_id
WHERE m.name = 'Alice'
ORDER BY e.id;`, ` employee | manager
----------+---------
 Bob      | Alice
 Carol    | Alice
(2 rows)`, { hlOut: [3, 4] }), 1.05)}`)}
<p style="font-size:21px;margin:0">1) Three tables: comment → note (for the tag), comment → app_user (for the commenter); the note's author is not needed. 2) INNER is right: asking for rows whose manager is Alice already excludes anyone without a manager.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:25px">
<li>Why does a query that uses <code class="i">app_user</code> twice need two aliases?</li>
<li>Why is a self-join on <code class="i">manager_id</code> usually a <b>LEFT</b> join?</li>
<li>A chain starts with <code class="i">LEFT JOIN comment</code> then <code class="i">JOIN app_user</code> and some rows vanish. Why?</li>
</ol>
${box('Answers', '<b>1.</b> PostgreSQL must know which role each column belongs to; aliases (au, cu) name the two roles — otherwise “table name specified more than once”. <b>2.</b> The root of the tree has no parent; INNER would drop it. <b>3.</b> After the LEFT join the padding rows have NULL keys, and the INNER join discards them — keep later joins LEFT.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, giua: true, body: `
<ul>
<li>One <code class="i">JOIN … ON</code> per relationship; read left to right; <b>alias</b> every table, use <b>two aliases</b> for the same table twice</li>
<li><b>Self-join</b> = one table in two roles (employee/manager, category/parent, comment/reply) — usually <b>LEFT</b></li>
<li>Once a chain turns LEFT, keep it LEFT; <code class="i">LATERAL</code> = top-N per row</li>
<li>Joins are not slow — a join key <b>without an index</b> is</li>
</ul>
${box('Next: 5.4 — CROSS JOIN & the join traps', 'Every combination on purpose, the accidental cross product, and the trap behind most “my numbers are wrong” bugs: <b>fan-out</b>.', 'lam')}` },
]);
