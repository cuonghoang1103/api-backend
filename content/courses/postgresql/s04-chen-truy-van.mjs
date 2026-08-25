/**
 * PostgreSQL — Chương 4: Chèn & truy vấn.
 * INSERT (nhiều dòng/RETURNING/DEFAULT/UPSERT ON CONFLICT) · SELECT & WHERE
 * (toán tử, IN, BETWEEN, LIKE/ILIKE, IS NULL, bẫy NULL) · ORDER BY/LIMIT/OFFSET/
 * DISTINCT/DISTINCT ON · UPDATE & DELETE an toàn (WHERE, RETURNING, BEGIN/ROLLBACK).
 * Output chạy thật PG 15.4 (schema ch4 trong DB pgcourse, bảng note 7→6 dòng).
 * LUẬT: < > trong code → &lt; &gt; (so sánh, <>); & → &amp;;
 * backtick → &#96;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 4 — Inserting & querying data|||Chương 4 — Chèn & truy vấn',
  description: 'Đưa dữ liệu vào (INSERT nhiều dòng, RETURNING, UPSERT) và lấy đúng cái bạn cần ra (SELECT, WHERE, ORDER BY, LIMIT, DISTINCT), rồi sửa và xoá an toàn với UPDATE/DELETE.',
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — INSERT: many rows, RETURNING & UPSERT|||4.1 — INSERT: nhiều dòng, RETURNING & UPSERT',
      slug: 'postgresql-4-1-insert',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chèn nhiều dòng trong một câu lệnh, lấy lại giá trị vừa sinh bằng RETURNING, để DEFAULT tự điền, và UPSERT với ON CONFLICT.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Getting data in — more than one row at a time</h2>
<p class="lead">You've inserted rows already; this lesson turns that into fluency. Insert many rows in one statement, get back the ids the database just generated, let defaults fill themselves, and handle the "insert or update if it already exists" case with a single UPSERT — the four INSERT skills you'll use every day.</p>

<h3>The table we'll query all chapter</h3>
<p>Everything in this chapter runs against one small <code>note</code> table. Here it is, populated with a <strong>multi-row INSERT</strong> — one statement, many rows, commas between them:</p>
<pre><code>CREATE TABLE note (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      text NOT NULL,
  author     text NOT NULL,
  tag        text,
  views      int NOT NULL DEFAULT 0,
  pinned     boolean NOT NULL DEFAULT false,
  created_at date NOT NULL
);

INSERT INTO note (title, author, tag, views, pinned, created_at) VALUES
  ('Intro to SQL',         'Cuong', 'sql',  120, true,  '2026-01-10'),
  ('Indexes deep dive',    'Cuong', 'sql',   90, false, '2026-02-14'),
  ('Timezones done right', 'Lan',   'date',  45, false, '2026-03-01'),
  ('JSONB in practice',    'Lan',   'sql',   30, false, '2026-03-05'),
  ('My reading list',      'Minh',  NULL,     8, false, '2026-03-20'),
  ('Backup strategy',      'Cuong', 'ops',   12, true,  '2026-04-02')
RETURNING id, title;</code></pre>
<div class="out"> id |        title
----+----------------------
  1 | Intro to SQL
  2 | Indexes deep dive
  3 | Timezones done right
  4 | JSONB in practice
  5 | My reading list
  6 | Backup strategy
(6 rows)</div>
<p>One statement inserted six rows — far faster than six separate <code>INSERT</code>s, because it's one round-trip and one transaction. And the <code>RETURNING</code> clause handed back the auto-generated <code>id</code>s. That's the idiom for "insert a row and immediately use its new id" — no second query needed.</p>

<h3>Let DEFAULT do the work</h3>
<p>You only list the columns you're supplying; any column with a <code>DEFAULT</code> (or that's nullable) fills itself. Omit <code>views</code> and <code>pinned</code> and they take their defaults:</p>
<pre><code>INSERT INTO note (title, author, tag, created_at)
VALUES ('Quick draft', 'Minh', NULL, '2026-04-10')
RETURNING id, title, views, pinned;</code></pre>
<div class="out"> id |    title    | views | pinned
----+-------------+-------+--------
  7 | Quick draft |     0 | f
(1 row)</div>
<p><code>views</code> became <code>0</code> and <code>pinned</code> became <code>f</code> (false) automatically — the defaults from the table definition. Only spell out what you actually know.</p>

<h3>UPSERT — insert, or update if it already exists</h3>
<p>Constantly you need "insert this row, but if a row with that key already exists, update it instead". Doing it in two steps is racy; <code>INSERT ... ON CONFLICT</code> does it atomically in one. Here's a per-tag hit counter that increments on every conflict:</p>
<pre><code>CREATE TABLE tag_stat (tag text PRIMARY KEY, hits int NOT NULL DEFAULT 0);

INSERT INTO tag_stat (tag, hits) VALUES ('sql', 1)
  ON CONFLICT (tag) DO UPDATE SET hits = tag_stat.hits + 1;   <span class="tok-comment">-- run 3 times</span>
SELECT * FROM tag_stat;</code></pre>
<div class="out"> tag | hits
-----+------
 sql |    3
(1 row)</div>
<p>The first call inserted <code>('sql', 1)</code>. The next two hit the primary-key conflict on <code>tag='sql'</code> and ran the <code>DO UPDATE</code> instead, each adding 1 — so <code>hits</code> is 3. This single statement is the whole "increment a counter, creating it if missing" pattern. The other flavour, <code>DO NOTHING</code>, skips silently on conflict instead of updating:</p>
<pre><code>INSERT INTO tag_stat (tag, hits) VALUES ('sql', 999)
  ON CONFLICT (tag) DO NOTHING;
SELECT * FROM tag_stat;</code></pre>
<div class="out"> tag | hits
-----+------
 sql |    3
(1 row)</div>
<p>The row already existed, so <code>DO NOTHING</code> left it untouched — the <code>999</code> was ignored. Use <code>DO NOTHING</code> for "insert if new, otherwise leave it alone" (e.g. idempotent seeding); use <code>DO UPDATE</code> when you want to merge new values in.</p>
<div class="callout ok">Three habits from this lesson: batch inserts into <strong>one multi-row statement</strong>; use <strong><code>RETURNING</code></strong> to get generated ids without a second query; reach for <strong><code>ON CONFLICT</code></strong> whenever you'd otherwise "check then insert" (which has a race window).</div>
<div class="note-ct">This site's content seeder is a giant idempotent UPSERT: re-running it doesn't create duplicate courses, it updates the existing ones by their unique <code>slug</code> — exactly <code>ON CONFLICT (slug) DO UPDATE</code>. That's why deploying the same course file twice is safe: the second run re-authors in place instead of inserting a second copy.</div>
<h3>Four ways to insert, and when each pays</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">One row at a time</span><span class="lz-d">Fine for user actions. Every statement is its own transaction and its own round trip, so a loop of a thousand inserts is a thousand round trips.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Multi-row VALUES</span><span class="lz-d">One statement, many rows. Typically an order of magnitude faster than the loop, and the simplest change you can make to a slow import.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">INSERT … SELECT</span><span class="lz-d">Copies rows without them ever leaving the server. The right tool for backfills and for building a summary table.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">COPY</span><span class="lz-d">The bulk-load path, dramatically faster than any <code>INSERT</code> form. This is how you load a million rows, and how <code>pg_restore</code> works.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>ON CONFLICT DO NOTHING</code> used as "insert if new".</strong> It does exactly that, and it also swallows conflicts you did not anticipate: a unique index you added later, a constraint on a different column, a genuine bug writing duplicate keys. The insert reports success having written nothing, and the caller cannot tell the difference. Prefer naming the target — <code>ON CONFLICT (email) DO NOTHING</code> — so a conflict on any other constraint still raises. And when you need to know whether the row was written, add <code>RETURNING id</code>: an empty result means the conflict path was taken.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: build the note table and an UPSERT counter</span><span class="lc-sub">The Code Lab track sets up the exact data used across this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Đưa dữ liệu vào — nhiều hơn một dòng mỗi lần</h2>
<p class="lead">Bạn đã chèn dòng rồi; bài này biến việc đó thành thành thạo. Chèn nhiều dòng trong một câu lệnh, lấy lại các id cơ sở dữ liệu vừa sinh, để mặc định tự điền, và xử lý tình huống "chèn hoặc cập nhật nếu đã tồn tại" bằng một UPSERT duy nhất — bốn kỹ năng INSERT bạn dùng mỗi ngày.</p>

<h3>Bảng ta sẽ truy vấn suốt chương</h3>
<p>Mọi thứ trong chương này chạy trên một bảng <code>note</code> nhỏ. Đây là nó, đổ dữ liệu bằng một <strong>INSERT nhiều dòng</strong> — một câu lệnh, nhiều dòng, phẩy ngăn giữa chúng:</p>
<pre><code>CREATE TABLE note (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      text NOT NULL,
  author     text NOT NULL,
  tag        text,
  views      int NOT NULL DEFAULT 0,
  pinned     boolean NOT NULL DEFAULT false,
  created_at date NOT NULL
);

INSERT INTO note (title, author, tag, views, pinned, created_at) VALUES
  ('Intro to SQL',         'Cuong', 'sql',  120, true,  '2026-01-10'),
  ('Indexes deep dive',    'Cuong', 'sql',   90, false, '2026-02-14'),
  ('Timezones done right', 'Lan',   'date',  45, false, '2026-03-01'),
  ('JSONB in practice',    'Lan',   'sql',   30, false, '2026-03-05'),
  ('My reading list',      'Minh',  NULL,     8, false, '2026-03-20'),
  ('Backup strategy',      'Cuong', 'ops',   12, true,  '2026-04-02')
RETURNING id, title;</code></pre>
<div class="out"> id |        title
----+----------------------
  1 | Intro to SQL
  2 | Indexes deep dive
  3 | Timezones done right
  4 | JSONB in practice
  5 | My reading list
  6 | Backup strategy
(6 rows)</div>
<p>Một câu lệnh chèn sáu dòng — nhanh hơn nhiều so với sáu lệnh <code>INSERT</code> riêng, vì nó là một vòng đi-về và một giao dịch. Và mệnh đề <code>RETURNING</code> trả lại các <code>id</code> tự sinh. Đó là thành ngữ cho "chèn một dòng rồi dùng ngay id mới của nó" — không cần truy vấn thứ hai.</p>

<h3>Để DEFAULT làm việc</h3>
<p>Bạn chỉ liệt kê các cột mình cấp; cột nào có <code>DEFAULT</code> (hoặc cho phép null) tự điền. Bỏ qua <code>views</code> và <code>pinned</code> thì chúng nhận mặc định:</p>
<pre><code>INSERT INTO note (title, author, tag, created_at)
VALUES ('Quick draft', 'Minh', NULL, '2026-04-10')
RETURNING id, title, views, pinned;</code></pre>
<div class="out"> id |    title    | views | pinned
----+-------------+-------+--------
  7 | Quick draft |     0 | f
(1 row)</div>
<p><code>views</code> thành <code>0</code> và <code>pinned</code> thành <code>f</code> (false) tự động — mặc định từ định nghĩa bảng. Chỉ ghi ra cái bạn thật sự biết.</p>

<h3>UPSERT — chèn, hoặc cập nhật nếu đã tồn tại</h3>
<p>Bạn liên tục cần "chèn dòng này, nhưng nếu một dòng với khoá đó đã tồn tại thì cập nhật thay vì chèn". Làm hai bước thì dễ dính đua tranh (race); <code>INSERT ... ON CONFLICT</code> làm nguyên tử trong một bước. Đây là một bộ đếm lượt theo tag, tăng mỗi lần đụng độ:</p>
<pre><code>CREATE TABLE tag_stat (tag text PRIMARY KEY, hits int NOT NULL DEFAULT 0);

INSERT INTO tag_stat (tag, hits) VALUES ('sql', 1)
  ON CONFLICT (tag) DO UPDATE SET hits = tag_stat.hits + 1;   <span class="tok-comment">-- chạy 3 lần</span>
SELECT * FROM tag_stat;</code></pre>
<div class="out"> tag | hits
-----+------
 sql |    3
(1 row)</div>
<p>Lần đầu chèn <code>('sql', 1)</code>. Hai lần sau đụng khoá chính trên <code>tag='sql'</code> và chạy <code>DO UPDATE</code> thay vì chèn, mỗi lần cộng 1 — nên <code>hits</code> là 3. Câu lệnh duy nhất này chính là toàn bộ mẫu "tăng một bộ đếm, tạo nó nếu chưa có". Biến thể kia, <code>DO NOTHING</code>, âm thầm bỏ qua khi đụng độ thay vì cập nhật:</p>
<pre><code>INSERT INTO tag_stat (tag, hits) VALUES ('sql', 999)
  ON CONFLICT (tag) DO NOTHING;
SELECT * FROM tag_stat;</code></pre>
<div class="out"> tag | hits
-----+------
 sql |    3
(1 row)</div>
<p>Dòng đã tồn tại, nên <code>DO NOTHING</code> để nguyên nó — số <code>999</code> bị bỏ qua. Dùng <code>DO NOTHING</code> cho "chèn nếu mới, còn không thì để yên" (ví dụ seed idempotent); dùng <code>DO UPDATE</code> khi bạn muốn trộn giá trị mới vào.</p>
<div class="callout ok">Ba thói quen từ bài này: gộp nhiều lần chèn thành <strong>một câu lệnh nhiều dòng</strong>; dùng <strong><code>RETURNING</code></strong> để lấy id sinh ra mà không cần truy vấn thứ hai; vươn tới <strong><code>ON CONFLICT</code></strong> mỗi khi bạn định "kiểm rồi chèn" (vốn có khe đua tranh).</div>
<div class="note-ct">Seeder nội dung của trang này là một UPSERT idempotent khổng lồ: chạy lại không tạo khoá học trùng, nó cập nhật cái đang có theo <code>slug</code> duy nhất — đúng là <code>ON CONFLICT (slug) DO UPDATE</code>. Đó là lý do deploy cùng một file khoá học hai lần vẫn an toàn: lần chạy thứ hai soạn-lại tại chỗ thay vì chèn thêm một bản.</div>
<h3>Bốn cách chèn, và khi nào mỗi cách đáng dùng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một dòng mỗi lần</span><span class="lz-d">Ổn cho thao tác của người dùng. Mỗi câu lệnh là một giao dịch riêng và một vòng mạng riêng, nên một vòng lặp chèn một nghìn dòng là một nghìn vòng mạng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">VALUES nhiều dòng</span><span class="lz-d">Một câu lệnh, nhiều dòng. Thường nhanh hơn vòng lặp một bậc độ lớn, và là thay đổi ĐƠN GIẢN NHẤT bạn làm được cho một cú nhập liệu chậm.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">INSERT … SELECT</span><span class="lz-d">Chép dòng mà chúng không hề rời khỏi máy chủ. Đúng công cụ cho các đợt nạp bù và cho việc dựng một bảng tổng hợp.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">COPY</span><span class="lz-d">Đường nạp hàng loạt, nhanh hơn hẳn mọi dạng <code>INSERT</code>. Đây là cách bạn nạp một triệu dòng, và là cách <code>pg_restore</code> hoạt động.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — dùng <code>ON CONFLICT DO NOTHING</code> như "chèn nếu chưa có".</strong> Nó làm đúng như vậy, và nó cũng NUỐT luôn những xung đột bạn không lường trước: một chỉ mục duy nhất bạn thêm về sau, một ràng buộc trên cột khác, một con bug thật đang ghi khoá trùng. Lệnh chèn báo THÀNH CÔNG dù không ghi gì cả, và bên gọi không phân biệt được. Hãy nêu rõ đích — <code>ON CONFLICT (email) DO NOTHING</code> — để xung đột trên bất kỳ ràng buộc nào khác vẫn ném lỗi. Và khi cần biết dòng có được ghi hay không, thêm <code>RETURNING id</code>: kết quả rỗng nghĩa là nhánh xung đột đã chạy.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng bảng note và một bộ đếm UPSERT</span><span class="lc-sub">Track Code Lab dựng đúng bộ dữ liệu dùng xuyên suốt chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — SELECT & WHERE: getting exactly the rows you want|||4.2 — SELECT & WHERE: lấy đúng những dòng bạn cần',
      slug: 'postgresql-4-2-select-where',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chọn cột và cột tính, lọc với các toán tử, IN, BETWEEN, LIKE/ILIKE, IS NULL — và cạm bẫy NULL trong so sánh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Asking the database a question</h2>
<p class="lead">A <code>SELECT</code> has two jobs: choose which <em>columns</em> to show (projection) and which <em>rows</em> to keep (the <code>WHERE</code> filter). Master the handful of filter operators here and you can express almost any "find me the rows where…" question — plus the one NULL trap that quietly breaks filters.</p>

<h3>Projection: columns and computed values</h3>
<p>List the columns you want; you can also compute new ones and name them with <code>AS</code>:</p>
<pre><code>SELECT id, title, views, views * 2 AS double_views
FROM note ORDER BY id LIMIT 3;</code></pre>
<div class="out"> id |        title         | views | double_views
----+----------------------+-------+--------------
  1 | Intro to SQL         |   120 |          240
  2 | Indexes deep dive    |    90 |          180
  3 | Timezones done right |    45 |           90
(3 rows)</div>
<p><code>double_views</code> doesn't exist in the table — it's computed per row. <code>SELECT *</code> grabs every column, which is handy while exploring but best avoided in real app code (name the columns you need, so a schema change can't surprise you).</p>

<h3>WHERE: the filter operators</h3>
<p>Combine conditions with <code>AND</code>, <code>OR</code>, <code>NOT</code> and the comparison operators (<code>=</code>, <code>&lt;&gt;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>):</p>
<pre><code>SELECT title, author, views
FROM note WHERE author = 'Cuong' AND views &gt; 50 ORDER BY id;</code></pre>
<div class="out">       title       | author | views
-------------------+--------+-------
 Intro to SQL      | Cuong  |   120
 Indexes deep dive | Cuong  |    90
(2 rows)</div>
<p>For membership and ranges, <code>IN</code> and <code>BETWEEN</code> read more clearly than a pile of <code>OR</code>s. <code>BETWEEN</code> is inclusive of both ends:</p>
<pre><code>SELECT title, tag  FROM note WHERE tag IN ('sql','ops') ORDER BY id;
SELECT title, created_at FROM note
  WHERE created_at BETWEEN '2026-03-01' AND '2026-03-31' ORDER BY created_at;</code></pre>
<div class="out">       title       | tag
-------------------+-----
 Intro to SQL      | sql
 Indexes deep dive | sql
 JSONB in practice | sql
 Backup strategy   | ops
(4 rows)

        title         | created_at
----------------------+------------
 Timezones done right | 2026-03-01
 JSONB in practice    | 2026-03-05
 My reading list      | 2026-03-20
(3 rows)</div>

<h3>Pattern matching: LIKE vs ILIKE</h3>
<p><code>LIKE</code> matches a text pattern where <code>%</code> means "any run of characters". <code>LIKE</code> is case-sensitive; <code>ILIKE</code> is the case-insensitive version. The difference matters:</p>
<pre><code>SELECT title FROM note WHERE title LIKE  '%sql%';   <span class="tok-comment">-- case-sensitive</span>
SELECT title FROM note WHERE title ILIKE '%sql%';   <span class="tok-comment">-- case-insensitive</span></code></pre>
<div class="out"> title
-------
(0 rows)

    title
--------------
 Intro to SQL
(1 row)</div>
<p><code>LIKE '%sql%'</code> found nothing — no title contains lowercase "sql". <code>ILIKE '%sql%'</code> matched "Intro to SQL" because it ignores case. For user-facing search, <code>ILIKE</code> is almost always what you want.</p>

<h3>The NULL trap — the one that bites everyone</h3>
<p><code>NULL</code> means "unknown", and unknown compared to anything is <em>also</em> unknown — never true. So you must test it with <code>IS NULL</code> / <code>IS NOT NULL</code>, never <code>= NULL</code>. Worse, a normal inequality <strong>silently skips</strong> NULL rows:</p>
<pre><code>SELECT title, tag FROM note WHERE tag IS NULL ORDER BY id;
SELECT title, tag FROM note WHERE tag &lt;&gt; 'sql' ORDER BY id;   <span class="tok-comment">-- expects "not sql"</span></code></pre>
<div class="out">      title      | tag
-----------------+-----
 My reading list |
 Quick draft     |
(2 rows)

        title         | tag
----------------------+------
 Timezones done right | date
 Backup strategy      | ops
(2 rows)</div>
<p>Look carefully: <code>tag &lt;&gt; 'sql'</code> returned the <code>date</code> and <code>ops</code> notes but <strong>not</strong> the two NULL-tagged ones — even though "unknown" is arguably "not sql". Postgres refuses to guess: <code>NULL &lt;&gt; 'sql'</code> is unknown, so those rows are dropped. If you wanted them, you must say so explicitly: <code>WHERE tag &lt;&gt; 'sql' OR tag IS NULL</code>.</p>
<div class="pitfall"><p><strong>Never write <code>= NULL</code> or <code>&lt;&gt; NULL</code>.</strong> They're always "unknown" and match nothing. Use <code>IS NULL</code> / <code>IS NOT NULL</code>. And remember that any inequality filter (<code>&lt;&gt;</code>, <code>&lt;</code>, <code>&gt;</code>) silently excludes NULL rows — if NULL should count, add <code>OR col IS NULL</code>.</p></div>
<div class="note-ct">This NULL rule is behind a whole class of "missing data" bugs. On this site an early support-inbox query filtered threads with a condition that silently excluded a NULL-valued side, so admin chats "disappeared" — they were never lost, the filter just dropped the unknown rows. Whenever rows go missing unexpectedly, the first suspect is a NULL slipping through an inequality.</div>
<h3>Reading a WHERE clause the way the server does</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Three-valued logic</span><span class="lz-lnote">Every condition is TRUE, FALSE or UNKNOWN. <code>WHERE</code> keeps only TRUE — so a row where the test is UNKNOWN is dropped, exactly like FALSE, but for a different reason.</span></div>
<div class="lz-layer"><span class="lz-lname">NULL propagates</span><span class="lz-lnote">Any comparison with NULL is UNKNOWN, including <code>NULL = NULL</code>. Use <code>IS NULL</code> and <code>IS DISTINCT FROM</code>, which are the only operators that treat NULL as a value.</span></div>
<div class="lz-layer"><span class="lz-lname">AND / OR are not symmetric with NULL</span><span class="lz-lnote"><code>FALSE AND UNKNOWN</code> is FALSE, but <code>TRUE AND UNKNOWN</code> is UNKNOWN. This is why adding a harmless-looking condition can make rows disappear.</span></div>
<div class="lz-layer"><span class="lz-lname">NOT does not flip UNKNOWN</span><span class="lz-lnote"><code>NOT UNKNOWN</code> is still UNKNOWN. So <code>WHERE NOT (status = 'x')</code> does not return the rows where status is NULL, which is almost never what people expect.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>WHERE tag != 'ops'</code> silently excluding NULL rows.</strong> The condition reads as "everything that is not ops", and a note with no tag at all is certainly not ops — yet it does not appear, because <code>NULL != 'ops'</code> is UNKNOWN rather than TRUE. The count on the page is quietly too low, and the rows that vanished are precisely the ones with missing data, which is the group you most often needed to see. Write <code>WHERE tag IS DISTINCT FROM 'ops'</code> when NULL should count as different, or <code>WHERE tag != 'ops' OR tag IS NULL</code> if you prefer the explicit form.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: filter the note table and reproduce the NULL trap</span><span class="lc-sub">The Code Lab track makes the &lt;&gt; vs IS NULL difference stick.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Đặt câu hỏi cho cơ sở dữ liệu</h2>
<p class="lead">Một <code>SELECT</code> có hai việc: chọn <em>cột</em> nào để hiện (projection) và <em>dòng</em> nào để giữ (bộ lọc <code>WHERE</code>). Nắm vững nhúm toán tử lọc ở đây là bạn diễn đạt được gần như mọi câu hỏi "tìm cho tôi các dòng mà…" — cộng với một cạm bẫy NULL âm thầm phá vỡ bộ lọc.</p>

<h3>Projection: cột và giá trị tính</h3>
<p>Liệt kê các cột bạn muốn; bạn cũng có thể tính cột mới và đặt tên bằng <code>AS</code>:</p>
<pre><code>SELECT id, title, views, views * 2 AS double_views
FROM note ORDER BY id LIMIT 3;</code></pre>
<div class="out"> id |        title         | views | double_views
----+----------------------+-------+--------------
  1 | Intro to SQL         |   120 |          240
  2 | Indexes deep dive    |    90 |          180
  3 | Timezones done right |    45 |           90
(3 rows)</div>
<p><code>double_views</code> không tồn tại trong bảng — nó được tính cho mỗi dòng. <code>SELECT *</code> lấy mọi cột, tiện khi khám phá nhưng nên tránh trong mã app thật (hãy đặt tên các cột bạn cần, để một thay đổi lược đồ không thể gây bất ngờ).</p>

<h3>WHERE: các toán tử lọc</h3>
<p>Kết hợp điều kiện bằng <code>AND</code>, <code>OR</code>, <code>NOT</code> và các toán tử so sánh (<code>=</code>, <code>&lt;&gt;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>):</p>
<pre><code>SELECT title, author, views
FROM note WHERE author = 'Cuong' AND views &gt; 50 ORDER BY id;</code></pre>
<div class="out">       title       | author | views
-------------------+--------+-------
 Intro to SQL      | Cuong  |   120
 Indexes deep dive | Cuong  |    90
(2 rows)</div>
<p>Cho việc thuộc tập và khoảng, <code>IN</code> và <code>BETWEEN</code> đọc rõ hơn một đống <code>OR</code>. <code>BETWEEN</code> bao gồm cả hai đầu:</p>
<pre><code>SELECT title, tag  FROM note WHERE tag IN ('sql','ops') ORDER BY id;
SELECT title, created_at FROM note
  WHERE created_at BETWEEN '2026-03-01' AND '2026-03-31' ORDER BY created_at;</code></pre>
<div class="out">       title       | tag
-------------------+-----
 Intro to SQL      | sql
 Indexes deep dive | sql
 JSONB in practice | sql
 Backup strategy   | ops
(4 rows)

        title         | created_at
----------------------+------------
 Timezones done right | 2026-03-01
 JSONB in practice    | 2026-03-05
 My reading list      | 2026-03-20
(3 rows)</div>

<h3>Khớp mẫu: LIKE vs ILIKE</h3>
<p><code>LIKE</code> khớp một mẫu chữ trong đó <code>%</code> nghĩa là "một chuỗi ký tự bất kỳ". <code>LIKE</code> phân biệt hoa/thường; <code>ILIKE</code> là phiên bản không phân biệt. Khác biệt có ý nghĩa:</p>
<pre><code>SELECT title FROM note WHERE title LIKE  '%sql%';   <span class="tok-comment">-- phân biệt hoa/thường</span>
SELECT title FROM note WHERE title ILIKE '%sql%';   <span class="tok-comment">-- không phân biệt</span></code></pre>
<div class="out"> title
-------
(0 rows)

    title
--------------
 Intro to SQL
(1 row)</div>
<p><code>LIKE '%sql%'</code> không tìm thấy gì — không tiêu đề nào chứa "sql" chữ thường. <code>ILIKE '%sql%'</code> khớp "Intro to SQL" vì nó bỏ qua hoa/thường. Cho tìm kiếm hướng người dùng, <code>ILIKE</code> gần như luôn là cái bạn muốn.</p>

<h3>Cạm bẫy NULL — cái cắn tất cả mọi người</h3>
<p><code>NULL</code> nghĩa là "không rõ", và không-rõ đem so với bất cứ thứ gì <em>cũng</em> là không-rõ — không bao giờ đúng. Nên bạn phải kiểm nó bằng <code>IS NULL</code> / <code>IS NOT NULL</code>, không bao giờ <code>= NULL</code>. Tệ hơn, một phép bất đẳng thường <strong>âm thầm bỏ qua</strong> các dòng NULL:</p>
<pre><code>SELECT title, tag FROM note WHERE tag IS NULL ORDER BY id;
SELECT title, tag FROM note WHERE tag &lt;&gt; 'sql' ORDER BY id;   <span class="tok-comment">-- kỳ vọng "không phải sql"</span></code></pre>
<div class="out">      title      | tag
-----------------+-----
 My reading list |
 Quick draft     |
(2 rows)

        title         | tag
----------------------+------
 Timezones done right | date
 Backup strategy      | ops
(2 rows)</div>
<p>Nhìn kỹ: <code>tag &lt;&gt; 'sql'</code> trả về các note <code>date</code> và <code>ops</code> nhưng <strong>không</strong> trả hai note tag-NULL — dù "không rõ" có thể coi là "không phải sql". Postgres từ chối đoán: <code>NULL &lt;&gt; 'sql'</code> là không-rõ, nên các dòng đó bị rớt. Nếu bạn muốn chúng, phải nói rõ: <code>WHERE tag &lt;&gt; 'sql' OR tag IS NULL</code>.</p>
<div class="pitfall"><p><strong>Đừng bao giờ viết <code>= NULL</code> hay <code>&lt;&gt; NULL</code>.</strong> Chúng luôn "không rõ" và không khớp gì. Dùng <code>IS NULL</code> / <code>IS NOT NULL</code>. Và nhớ rằng mọi bộ lọc bất đẳng thức (<code>&lt;&gt;</code>, <code>&lt;</code>, <code>&gt;</code>) âm thầm loại các dòng NULL — nếu NULL nên được tính, thêm <code>OR col IS NULL</code>.</p></div>
<div class="note-ct">Luật NULL này đứng sau cả một loại bug "mất dữ liệu". Trên trang này một truy vấn hộp thư hỗ trợ thuở đầu lọc các cuộc trò chuyện bằng một điều kiện âm thầm loại một phía có giá trị NULL, nên các chat của admin "biến mất" — chúng không hề mất, bộ lọc chỉ rớt các dòng không-rõ. Mỗi khi dòng biến mất bất ngờ, nghi phạm đầu tiên là một NULL lọt qua một bất đẳng thức.</div>
<h3>Đọc mệnh đề WHERE theo cách máy chủ đọc</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Lô-gíc BA giá trị</span><span class="lz-lnote">Mọi điều kiện là TRUE, FALSE hoặc UNKNOWN. <code>WHERE</code> chỉ giữ TRUE — nên một dòng mà phép kiểm ra UNKNOWN sẽ bị bỏ, y hệt FALSE, nhưng vì một lý do khác.</span></div>
<div class="lz-layer"><span class="lz-lname">NULL LAN RA</span><span class="lz-lnote">Mọi phép so sánh với NULL đều là UNKNOWN, kể cả <code>NULL = NULL</code>. Hãy dùng <code>IS NULL</code> và <code>IS DISTINCT FROM</code>, hai toán tử duy nhất coi NULL như một giá trị.</span></div>
<div class="lz-layer"><span class="lz-lname">AND / OR không đối xứng với NULL</span><span class="lz-lnote"><code>FALSE AND UNKNOWN</code> là FALSE, nhưng <code>TRUE AND UNKNOWN</code> là UNKNOWN. Đó là lý do thêm một điều kiện trông vô hại lại làm các dòng biến mất.</span></div>
<div class="lz-layer"><span class="lz-lname">NOT không lật được UNKNOWN</span><span class="lz-lnote"><code>NOT UNKNOWN</code> vẫn là UNKNOWN. Nên <code>WHERE NOT (status = 'x')</code> KHÔNG trả về những dòng có status là NULL, thứ gần như không bao giờ đúng ý người ta.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>WHERE tag != 'ops'</code> âm thầm loại luôn các dòng NULL.</strong> Điều kiện ấy đọc thành "mọi thứ không phải ops", và một note hoàn toàn không có tag thì chắc chắn không phải ops — vậy mà nó không hiện ra, vì <code>NULL != 'ops'</code> là UNKNOWN chứ không phải TRUE. Con số trên trang lặng lẽ thấp đi, và những dòng biến mất chính là những dòng THIẾU DỮ LIỆU, đúng cái nhóm bạn thường cần nhìn nhất. Hãy viết <code>WHERE tag IS DISTINCT FROM 'ops'</code> khi NULL nên được tính là khác, hoặc <code>WHERE tag != 'ops' OR tag IS NULL</code> nếu bạn thích dạng tường minh.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: lọc bảng note và tái hiện cạm bẫy NULL</span><span class="lc-sub">Track Code Lab làm khác biệt &lt;&gt; vs IS NULL đọng lại.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — ORDER BY, LIMIT/OFFSET & DISTINCT|||4.3 — ORDER BY, LIMIT/OFFSET & DISTINCT',
      slug: 'postgresql-4-3-order-limit-distinct',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sắp xếp theo nhiều khoá (và NULLS LAST), phân trang với LIMIT/OFFSET, loại trùng với DISTINCT và DISTINCT ON.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Ordering, paging, and removing duplicates</h2>
<p class="lead">Filtering finds the right rows; this lesson shapes how they come back. Sort by one or several keys, page through results with <code>LIMIT</code>/<code>OFFSET</code>, and collapse duplicates with <code>DISTINCT</code> — the tools behind every "sorted, paginated list" you've ever scrolled.</p>

<h3>ORDER BY — one or more sort keys</h3>
<p>Sort by several columns; each can be <code>ASC</code> (default) or <code>DESC</code>. The second key breaks ties in the first:</p>
<pre><code>SELECT title, author, views FROM note ORDER BY author ASC, views DESC;</code></pre>
<div class="out">        title         | author | views
----------------------+--------+-------
 Intro to SQL         | Cuong  |   120
 Indexes deep dive    | Cuong  |    90
 Backup strategy      | Cuong  |    12
 Timezones done right | Lan    |    45
 JSONB in practice    | Lan    |    30
 My reading list      | Minh   |     8
 Quick draft          | Minh   |     0
(7 rows)</div>
<p>Grouped by author alphabetically, and within each author sorted by views high-to-low. Where NULLs land in the order is also yours to control — by default NULLs sort as if largest (last in ascending). Make it explicit with <code>NULLS LAST</code>:</p>
<pre><code>SELECT title, tag FROM note ORDER BY tag NULLS LAST;</code></pre>
<div class="out">        title         | tag
----------------------+------
 Timezones done right | date
 Backup strategy      | ops
 Intro to SQL         | sql
 JSONB in practice    | sql
 Indexes deep dive    | sql
 My reading list      |
 Quick draft          |
(7 rows)</div>

<h3>LIMIT and OFFSET — paging</h3>
<p><code>LIMIT n</code> returns at most n rows; <code>OFFSET m</code> skips the first m. Together they page through a sorted result. "Top 3 most viewed" and then "the next 3" (page 2):</p>
<pre><code>SELECT title, views FROM note ORDER BY views DESC LIMIT 3;
SELECT title, views FROM note ORDER BY views DESC LIMIT 3 OFFSET 3;</code></pre>
<div class="out">        title         | views
----------------------+-------
 Intro to SQL         |   120
 Indexes deep dive    |    90
 Timezones done right |    45
(3 rows)

       title       | views
-------------------+-------
 JSONB in practice |    30
 Backup strategy   |    12
 My reading list   |     8
(3 rows)</div>
<div class="callout warn">Always pair <code>LIMIT</code>/<code>OFFSET</code> with an <code>ORDER BY</code>. Without one, "the first 3 rows" is whatever order Postgres happens to return — which can change between runs, so page 2 might repeat or skip rows. And note: a <em>large</em> <code>OFFSET</code> is slow, because the database still walks and discards all the skipped rows. On a big table, page 100000 hurts; Chapter 10 shows the "keyset / cursor" pagination that fixes it.</div>

<h3>DISTINCT — collapse duplicates</h3>
<p><code>DISTINCT</code> removes duplicate rows from the result. Which tags are actually in use?</p>
<pre><code>SELECT DISTINCT tag FROM note ORDER BY tag NULLS LAST;</code></pre>
<div class="out"> tag
------
 date
 ops
 sql

(4 rows)</div>
<p>Three distinct tags plus the NULL group — the four <code>sql</code> notes collapsed into one <code>sql</code> row. There's also a Postgres-specific power tool, <code>DISTINCT ON (col)</code>, which keeps the <em>first row per group</em> given an <code>ORDER BY</code>. "The newest note per author":</p>
<pre><code>SELECT DISTINCT ON (author) author, title, created_at
FROM note ORDER BY author, created_at DESC;</code></pre>
<div class="out"> author |       title       | created_at
--------+-------------------+------------
 Cuong  | Backup strategy   | 2026-04-02
 Lan    | JSONB in practice | 2026-03-05
 Minh   | Quick draft       | 2026-04-10
(3 rows)</div>
<p><code>DISTINCT ON (author)</code> kept exactly one row per author — and because we ordered by <code>created_at DESC</code> within each author, it's the newest one. That "latest row per group" query is surprisingly common (last message per conversation, latest price per product) and <code>DISTINCT ON</code> is the tidiest way to write it.</p>
<div class="note-ct">This is the shape of the feed: notes and posts come back <code>ORDER BY created_at DESC LIMIT n</code>, paged as you scroll. The site deliberately moved hot, deep-scrolling lists off large <code>OFFSET</code> onto keyset pagination for exactly the slowness warned about above — a measured jump from ~100 ms at a deep offset down to under a millisecond with a cursor.</div>
<h3>ORDER BY, LIMIT and the pagination trap</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">No ORDER BY means no order</span><span class="lz-d">Rows come back in whatever order was convenient. It looks stable in testing and changes after an update, a <code>VACUUM</code>, or a plan change.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">NULLS FIRST / LAST</span><span class="lz-d">NULLs sort last ascending and first descending by default. Say it explicitly whenever the column is nullable and the position matters.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">OFFSET reads and discards</span><span class="lz-d"><code>OFFSET 999980</code> makes the server produce a million rows and throw away all but twenty. The cost grows with the page number.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Keyset pagination is O(1)</span><span class="lz-d"><code>WHERE (created_at, id) &lt; ($1, $2) ORDER BY created_at DESC, id DESC LIMIT 20</code> jumps straight to the page using the index. Node.js Chapter 6 measured 0.015ms against a full scan.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — paginating with <code>LIMIT/OFFSET</code> on a non-unique sort key.</strong> Sorting by <code>created_at</code> alone, with several rows sharing a timestamp, means their relative order is undefined — and page 2 may re-show a row already seen on page 1 while another is never shown at all. Users report "the list skips items" and it reproduces only when the data has ties, which test fixtures rarely do. Always end the sort with a unique column: <code>ORDER BY created_at DESC, id DESC</code>. That single addition also makes keyset pagination possible.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: sort, paginate and de-duplicate the note table</span><span class="lc-sub">The Code Lab track includes the "latest per author" DISTINCT ON query.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Sắp xếp, phân trang, và loại trùng</h2>
<p class="lead">Lọc tìm đúng dòng; bài này định hình cách chúng trở về. Sắp theo một hay vài khoá, lật trang kết quả bằng <code>LIMIT</code>/<code>OFFSET</code>, và gộp trùng bằng <code>DISTINCT</code> — các công cụ đằng sau mọi "danh sách có sắp xếp, phân trang" bạn từng cuộn qua.</p>

<h3>ORDER BY — một hay nhiều khoá sắp</h3>
<p>Sắp theo vài cột; mỗi cột có thể <code>ASC</code> (mặc định) hoặc <code>DESC</code>. Khoá thứ hai phá thế hoà của khoá thứ nhất:</p>
<pre><code>SELECT title, author, views FROM note ORDER BY author ASC, views DESC;</code></pre>
<div class="out">        title         | author | views
----------------------+--------+-------
 Intro to SQL         | Cuong  |   120
 Indexes deep dive    | Cuong  |    90
 Backup strategy      | Cuong  |    12
 Timezones done right | Lan    |    45
 JSONB in practice    | Lan    |    30
 My reading list      | Minh   |     8
 Quick draft          | Minh   |     0
(7 rows)</div>
<p>Gom theo tác giả theo bảng chữ cái, và trong mỗi tác giả sắp theo views cao-xuống-thấp. NULL rơi vào đâu trong thứ tự cũng do bạn kiểm soát — mặc định NULL sắp như thể lớn nhất (cuối cùng khi tăng dần). Hãy nói rõ bằng <code>NULLS LAST</code>:</p>
<pre><code>SELECT title, tag FROM note ORDER BY tag NULLS LAST;</code></pre>
<div class="out">        title         | tag
----------------------+------
 Timezones done right | date
 Backup strategy      | ops
 Intro to SQL         | sql
 JSONB in practice    | sql
 Indexes deep dive    | sql
 My reading list      |
 Quick draft          |
(7 rows)</div>

<h3>LIMIT và OFFSET — phân trang</h3>
<p><code>LIMIT n</code> trả về tối đa n dòng; <code>OFFSET m</code> bỏ qua m dòng đầu. Cùng nhau chúng lật trang một kết quả đã sắp. "Top 3 xem nhiều nhất" rồi "3 cái tiếp" (trang 2):</p>
<pre><code>SELECT title, views FROM note ORDER BY views DESC LIMIT 3;
SELECT title, views FROM note ORDER BY views DESC LIMIT 3 OFFSET 3;</code></pre>
<div class="out">        title         | views
----------------------+-------
 Intro to SQL         |   120
 Indexes deep dive    |    90
 Timezones done right |    45
(3 rows)

       title       | views
-------------------+-------
 JSONB in practice |    30
 Backup strategy   |    12
 My reading list   |     8
(3 rows)</div>
<div class="callout warn">Luôn ghép <code>LIMIT</code>/<code>OFFSET</code> với một <code>ORDER BY</code>. Không có nó, "3 dòng đầu" là thứ tự bất kỳ Postgres tình cờ trả — có thể đổi giữa các lần chạy, nên trang 2 có thể lặp hoặc rớt dòng. Và lưu ý: một <code>OFFSET</code> <em>lớn</em> thì chậm, vì cơ sở dữ liệu vẫn phải đi qua và vứt bỏ mọi dòng bị bỏ. Trên một bảng lớn, trang 100000 đau; Chương 10 chỉ cách phân trang "keyset / cursor" khắc phục nó.</div>

<h3>DISTINCT — gộp trùng</h3>
<p><code>DISTINCT</code> loại các dòng trùng khỏi kết quả. Những tag nào đang thật sự được dùng?</p>
<pre><code>SELECT DISTINCT tag FROM note ORDER BY tag NULLS LAST;</code></pre>
<div class="out"> tag
------
 date
 ops
 sql
 (null)
(4 rows)</div>
<p>Ba tag khác nhau cộng nhóm NULL — bốn note <code>sql</code> gộp thành một dòng <code>sql</code>. Cũng có một công cụ mạnh riêng của Postgres, <code>DISTINCT ON (col)</code>, giữ <em>dòng đầu tiên mỗi nhóm</em> theo một <code>ORDER BY</code>. "Note mới nhất mỗi tác giả":</p>
<pre><code>SELECT DISTINCT ON (author) author, title, created_at
FROM note ORDER BY author, created_at DESC;</code></pre>
<div class="out"> author |       title       | created_at
--------+-------------------+------------
 Cuong  | Backup strategy   | 2026-04-02
 Lan    | JSONB in practice | 2026-03-05
 Minh   | Quick draft       | 2026-04-10
(3 rows)</div>
<p><code>DISTINCT ON (author)</code> giữ đúng một dòng mỗi tác giả — và vì ta sắp theo <code>created_at DESC</code> trong mỗi tác giả, đó là cái mới nhất. Truy vấn "dòng mới nhất mỗi nhóm" đó phổ biến bất ngờ (tin nhắn cuối mỗi cuộc trò chuyện, giá mới nhất mỗi sản phẩm) và <code>DISTINCT ON</code> là cách viết gọn nhất.</p>
<div class="note-ct">Đây là hình hài của bảng tin: note và bài đăng trở về <code>ORDER BY created_at DESC LIMIT n</code>, phân trang khi bạn cuộn. Trang này cố ý chuyển các danh sách nóng, cuộn-sâu khỏi <code>OFFSET</code> lớn sang phân trang keyset đúng vì sự chậm cảnh báo ở trên — một bước nhảy đo được từ ~100 ms ở offset sâu xuống dưới một mili-giây với cursor.</div>
<h3>ORDER BY, LIMIT và cái bẫy phân trang</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Không có ORDER BY nghĩa là KHÔNG CÓ thứ tự</span><span class="lz-d">Các dòng trở về theo thứ tự nào tiện nhất. Nó trông ổn định lúc kiểm thử rồi đổi sau một lần cập nhật, một cú <code>VACUUM</code>, hay một lần đổi kế hoạch.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">NULLS FIRST / LAST</span><span class="lz-d">Mặc định NULL xếp CUỐI khi tăng dần và ĐẦU khi giảm dần. Hãy nói rõ ra bất cứ khi nào cột cho phép NULL và vị trí ấy quan trọng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">OFFSET là ĐỌC RỒI VỨT</span><span class="lz-d"><code>OFFSET 999980</code> bắt máy chủ sinh ra một triệu dòng rồi vứt hết trừ hai mươi cái. Chi phí tăng theo SỐ TRANG.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Phân trang theo khoá là O(1)</span><span class="lz-d"><code>WHERE (created_at, id) &lt; ($1, $2) ORDER BY created_at DESC, id DESC LIMIT 20</code> nhảy thẳng tới trang cần bằng chỉ mục. Chương 6 khoá Node.js đo được 0,015ms so với một lượt quét trọn bảng.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — phân trang bằng <code>LIMIT/OFFSET</code> trên một khoá sắp KHÔNG duy nhất.</strong> Sắp chỉ theo <code>created_at</code>, với vài dòng trùng dấu thời gian, nghĩa là thứ tự tương đối của chúng KHÔNG XÁC ĐỊNH — và trang 2 có thể hiện lại một dòng đã thấy ở trang 1 trong khi một dòng khác chẳng bao giờ được hiện. Người dùng báo "danh sách bị nhảy mục" và nó chỉ tái hiện khi dữ liệu có trùng lặp, thứ mà dữ liệu test hiếm khi có. Luôn KẾT THÚC phép sắp bằng một cột duy nhất: <code>ORDER BY created_at DESC, id DESC</code>. Đúng một dòng thêm ấy cũng là thứ làm cho phân trang theo khoá trở nên khả thi.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: sắp, phân trang và loại trùng bảng note</span><span class="lc-sub">Track Code Lab gồm truy vấn "mới nhất mỗi tác giả" bằng DISTINCT ON.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — UPDATE & DELETE — safely|||4.4 — UPDATE & DELETE — an toàn',
      slug: 'postgresql-4-4-update-delete',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sửa và xoá dòng với WHERE và RETURNING, và vì sao một câu lệnh thiếu WHERE là tai hoạ — chốt an toàn bằng BEGIN/ROLLBACK.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Changing and removing rows — with the safety on</h2>
<p class="lead"><code>UPDATE</code> and <code>DELETE</code> are the two statements that can ruin your day, because both do <em>exactly what you say</em> — and if you forget the <code>WHERE</code>, what you said was "every row". This lesson covers doing them well: always filter, use <code>RETURNING</code> to confirm, and wrap risky ones in a transaction you can undo.</p>

<h3>UPDATE ... WHERE ... RETURNING</h3>
<p><code>UPDATE</code> sets new column values for the rows a <code>WHERE</code> selects. <code>RETURNING</code> shows you exactly what changed — invaluable for confirming you hit the right rows:</p>
<pre><code>UPDATE note SET views = views + 1 WHERE id = 1 RETURNING id, title, views;</code></pre>
<div class="out"> id |    title     | views
----+--------------+-------
  1 | Intro to SQL |   121
(1 row)</div>
<p>One row matched and its <code>views</code> went 120 → 121. An <code>UPDATE</code> can touch many rows at once — the <code>WHERE</code> decides how many. Unpin everything by one author:</p>
<pre><code>UPDATE note SET pinned = false WHERE author = 'Cuong' RETURNING id, title, pinned;</code></pre>
<div class="out"> id |       title       | pinned
----+-------------------+--------
  2 | Indexes deep dive | f
  6 | Backup strategy   | f
  1 | Intro to SQL      | f
(3 rows)</div>
<p>Three rows updated in one statement. <code>RETURNING</code> confirms it hit exactly Cuong's notes and nobody else's.</p>

<h3>The catastrophe: a missing WHERE</h3>
<p>Here's the one that has cost people their weekend. <code>UPDATE</code> and <code>DELETE</code> with <strong>no <code>WHERE</code> apply to every row in the table</strong>. When you're unsure, run it inside an explicit transaction so you can look before you leap — and <code>ROLLBACK</code> if it's wrong:</p>
<pre><code>BEGIN;
UPDATE note SET views = 0;          <span class="tok-comment">-- NO WHERE = every row!</span>
SELECT count(*) AS rows_hit, sum(views) AS total_views FROM note;
ROLLBACK;                            <span class="tok-comment">-- undo the whole thing</span>
SELECT count(*) AS rows, sum(views) AS total_views FROM note;   <span class="tok-comment">-- after rollback</span></code></pre>
<div class="out"> rows_hit | total_views
----------+-------------
        7 |           0
(1 row)

 rows | total_views
------+-------------
    7 |         306
(1 row)</div>
<p>Inside the transaction, the WHERE-less <code>UPDATE</code> zeroed all 7 rows (total views → 0). Because we hadn't committed, <code>ROLLBACK</code> threw the whole change away — the second query, after rollback, shows the original data intact (306 total views). <strong><code>BEGIN</code> ... inspect ... <code>ROLLBACK</code> / <code>COMMIT</code></strong> is your seatbelt for any statement you're not 100% sure about.</p>

<h3>DELETE ... WHERE ... RETURNING</h3>
<p><code>DELETE</code> removes whole rows; the same rules apply — always a <code>WHERE</code>, and <code>RETURNING</code> to see what left:</p>
<pre><code>DELETE FROM note WHERE title = 'Quick draft' RETURNING id, title;
SELECT count(*) AS remaining FROM note;</code></pre>
<div class="out"> id |    title
----+-------------
  7 | Quick draft
(1 row)

 remaining
-----------
         6
(1 row)</div>
<p>One row removed, six remain. Note that a real <code>DELETE</code> can be blocked or cascade based on the foreign keys from Chapter 3 — deleting a row other tables still reference obeys the <code>ON DELETE</code> rule you chose there.</p>
<div class="callout danger">The rules that keep you safe: <strong>every <code>UPDATE</code>/<code>DELETE</code> gets a <code>WHERE</code></strong> unless you truly mean "all rows". When unsure, wrap it in <code>BEGIN ... ROLLBACK</code> and inspect first. Use <code>RETURNING</code> to confirm the blast radius. And prefer a <em>soft delete</em> (a <code>deleted_at</code> timestamp column) over a hard <code>DELETE</code> for anything a user might want back.</div>
<div class="note-ct">This site rarely hard-deletes user content. Deleting a message or a chat sets a per-viewer <code>deleted_at</code> instead of removing the row — which is why there's a "Deleted" tab that can restore it. Real <code>DELETE</code> is reserved for genuinely disposable data; anything a human might regret losing is a soft delete, recoverable by clearing that timestamp.</div>
<h3>The shape of a safe write</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Write the SELECT first</span><span class="lz-d">Run <code>SELECT * FROM t WHERE …</code> with the exact condition, and look at the rows. Only then change the verb to <code>UPDATE</code> or <code>DELETE</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Wrap it in a transaction</span><span class="lz-d"><code>BEGIN;</code> … check the reported row count … <code>COMMIT;</code> or <code>ROLLBACK;</code>. The count is your last chance to notice a missing <code>WHERE</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">RETURNING tells you what happened</span><span class="lz-d"><code>UPDATE … RETURNING id, status</code> hands back the affected rows in the same round trip — no second query, and no guessing.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Make the condition do the work</span><span class="lz-d"><code>UPDATE account SET balance = balance - 30 WHERE id = $1 AND balance &gt;= 30</code> is safe under concurrency; read-then-write is not (1.2).</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>UPDATE</code> or <code>DELETE</code> with no <code>WHERE</code>, typed by hand.</strong> Nothing in SQL asks for confirmation: <code>DELETE FROM order;</code> is valid and empties the table. It usually happens by selecting only part of a statement in a GUI and pressing run, and the reported row count is the only warning you get — after the fact. Two habits prevent it entirely: start psql with <code>--single-transaction</code> or type <code>BEGIN;</code> before any manual write, and set <code>\\set ON_ERROR_STOP on</code>. The paranoia is cheap, and it is the difference between a rollback and a restore from last night's backup.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next chapter: JOINs — combining tables</span><span class="lc-sub">You can now read and write one table. Next: reassemble data split across many.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Sửa và xoá dòng — với chốt an toàn bật</h2>
<p class="lead"><code>UPDATE</code> và <code>DELETE</code> là hai câu lệnh có thể phá hỏng ngày của bạn, vì cả hai làm <em>đúng y điều bạn nói</em> — và nếu bạn quên <code>WHERE</code>, điều bạn nói là "mọi dòng". Bài này bàn cách làm cho tốt: luôn lọc, dùng <code>RETURNING</code> để xác nhận, và bọc những cái rủi ro trong một giao dịch bạn có thể hoàn tác.</p>

<h3>UPDATE ... WHERE ... RETURNING</h3>
<p><code>UPDATE</code> đặt giá trị cột mới cho các dòng mà <code>WHERE</code> chọn. <code>RETURNING</code> cho bạn xem chính xác cái gì đã đổi — vô giá để xác nhận bạn trúng đúng dòng:</p>
<pre><code>UPDATE note SET views = views + 1 WHERE id = 1 RETURNING id, title, views;</code></pre>
<div class="out"> id |    title     | views
----+--------------+-------
  1 | Intro to SQL |   121
(1 row)</div>
<p>Một dòng khớp và <code>views</code> của nó đi 120 → 121. Một <code>UPDATE</code> có thể chạm nhiều dòng cùng lúc — <code>WHERE</code> quyết định bao nhiêu. Bỏ ghim mọi thứ của một tác giả:</p>
<pre><code>UPDATE note SET pinned = false WHERE author = 'Cuong' RETURNING id, title, pinned;</code></pre>
<div class="out"> id |       title       | pinned
----+-------------------+--------
  2 | Indexes deep dive | f
  6 | Backup strategy   | f
  1 | Intro to SQL      | f
(3 rows)</div>
<p>Ba dòng được cập nhật trong một câu lệnh. <code>RETURNING</code> xác nhận nó trúng đúng các note của Cuong và không của ai khác.</p>

<h3>Tai hoạ: thiếu WHERE</h3>
<p>Đây là cái đã ngốn cuối tuần của nhiều người. <code>UPDATE</code> và <code>DELETE</code> <strong>không có <code>WHERE</code> áp dụng cho mọi dòng trong bảng</strong>. Khi không chắc, hãy chạy nó trong một giao dịch tường minh để nhìn trước khi nhảy — và <code>ROLLBACK</code> nếu sai:</p>
<pre><code>BEGIN;
UPDATE note SET views = 0;          <span class="tok-comment">-- KHÔNG WHERE = mọi dòng!</span>
SELECT count(*) AS rows_hit, sum(views) AS total_views FROM note;
ROLLBACK;                            <span class="tok-comment">-- vứt bỏ toàn bộ thay đổi</span>
SELECT count(*) AS rows, sum(views) AS total_views FROM note;   <span class="tok-comment">-- sau rollback</span></code></pre>
<div class="out"> rows_hit | total_views
----------+-------------
        7 |           0
(1 row)

 rows | total_views
------+-------------
    7 |         306
(1 row)</div>
<p>Bên trong giao dịch, <code>UPDATE</code> thiếu-WHERE đã đặt về 0 cả 7 dòng (tổng views → 0). Vì ta chưa commit, <code>ROLLBACK</code> ném bỏ toàn bộ thay đổi — truy vấn thứ hai, sau rollback, cho thấy dữ liệu gốc nguyên vẹn (tổng 306 views). <strong><code>BEGIN</code> ... xem xét ... <code>ROLLBACK</code> / <code>COMMIT</code></strong> là dây an toàn cho bất kỳ câu lệnh nào bạn chưa chắc 100%.</p>

<h3>DELETE ... WHERE ... RETURNING</h3>
<p><code>DELETE</code> gỡ nguyên dòng; cùng các luật đó — luôn có <code>WHERE</code>, và <code>RETURNING</code> để xem cái gì đã đi:</p>
<pre><code>DELETE FROM note WHERE title = 'Quick draft' RETURNING id, title;
SELECT count(*) AS remaining FROM note;</code></pre>
<div class="out"> id |    title
----+-------------
  7 | Quick draft
(1 row)

 remaining
-----------
         6
(1 row)</div>
<p>Một dòng bị gỡ, còn sáu. Lưu ý một <code>DELETE</code> thật có thể bị chặn hoặc lan (cascade) tuỳ các khoá ngoại từ Chương 3 — xoá một dòng mà bảng khác còn tham chiếu tuân theo luật <code>ON DELETE</code> bạn đã chọn ở đó.</p>
<div class="callout danger">Các luật giữ bạn an toàn: <strong>mọi <code>UPDATE</code>/<code>DELETE</code> đều có <code>WHERE</code></strong> trừ khi bạn thật sự có ý "mọi dòng". Khi không chắc, bọc nó trong <code>BEGIN ... ROLLBACK</code> và xem trước. Dùng <code>RETURNING</code> để xác nhận bán kính vụ nổ. Và ưu tiên <em>xoá mềm</em> (một cột dấu thời gian <code>deleted_at</code>) hơn là <code>DELETE</code> cứng cho bất cứ thứ gì người dùng có thể muốn lấy lại.</div>
<div class="note-ct">Trang này hiếm khi xoá cứng nội dung người dùng. Xoá một tin nhắn hay một cuộc trò chuyện đặt một <code>deleted_at</code> theo-từng-người-xem thay vì gỡ dòng — đó là lý do có một tab "Đã xoá" có thể phục hồi nó. <code>DELETE</code> thật dành cho dữ liệu thật sự bỏ đi được; bất cứ thứ gì con người có thể tiếc khi mất là một xoá mềm, phục hồi được bằng cách xoá dấu thời gian đó.</div>
<h3>Hình dạng của một lệnh ghi AN TOÀN</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Viết câu SELECT TRƯỚC</span><span class="lz-d">Chạy <code>SELECT * FROM t WHERE …</code> với ĐÚNG điều kiện ấy, và nhìn các dòng. Chỉ khi đó mới đổi động từ thành <code>UPDATE</code> hay <code>DELETE</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bọc trong một giao dịch</span><span class="lz-d"><code>BEGIN;</code> … xem con số dòng nó báo … <code>COMMIT;</code> hoặc <code>ROLLBACK;</code>. Con số ấy là cơ hội CUỐI CÙNG để bạn nhận ra mình quên <code>WHERE</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">RETURNING cho bạn biết chuyện gì đã xảy ra</span><span class="lz-d"><code>UPDATE … RETURNING id, status</code> trả lại các dòng bị ảnh hưởng trong CÙNG một vòng mạng — không cần truy vấn thứ hai, và không phải đoán.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Để chính ĐIỀU KIỆN làm việc</span><span class="lz-d"><code>UPDATE account SET balance = balance - 30 WHERE id = $1 AND balance &gt;= 30</code> an toàn khi chạy song song; đọc-rồi-ghi thì không (1.2).</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — gõ tay một lệnh <code>UPDATE</code> hay <code>DELETE</code> KHÔNG có <code>WHERE</code>.</strong> Không có gì trong SQL hỏi bạn xác nhận: <code>DELETE FROM order;</code> là hợp lệ và làm rỗng cả bảng. Nó thường xảy ra khi bạn bôi đen chỉ một PHẦN câu lệnh trong một công cụ đồ hoạ rồi bấm chạy, và con số dòng nó báo là cảnh báo DUY NHẤT bạn nhận được — sau khi việc đã rồi. Hai thói quen ngăn nó hoàn toàn: khởi động psql với <code>--single-transaction</code> hoặc gõ <code>BEGIN;</code> trước mọi lệnh ghi thủ công, và đặt <code>\\set ON_ERROR_STOP on</code>. Sự đa nghi ấy rẻ tiền, và nó là khác biệt giữa một cú rollback và một cú phục hồi từ bản sao lưu tối qua.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Chương tới: JOIN — kết hợp các bảng</span><span class="lc-sub">Giờ bạn đọc và ghi được một bảng. Tiếp theo: ráp lại dữ liệu tách trên nhiều bảng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 4.5 Quiz ─────────────────────────── */
    {
      title: '4.5 — Chapter 4 quiz|||4.5 — Kiểm tra Chương 4',
      slug: 'postgresql-4-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về INSERT/RETURNING/UPSERT, WHERE & bẫy NULL, ORDER BY/LIMIT/OFFSET/DISTINCT, và UPDATE/DELETE an toàn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on inserting and querying. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: the NULL trap in WHERE (4.2) and never running an UPDATE/DELETE without a WHERE (4.4). Both are quiet data-loss bugs.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về chèn và truy vấn. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: cạm bẫy NULL trong WHERE (4.2) và không bao giờ chạy UPDATE/DELETE mà thiếu WHERE (4.4). Cả hai là bug mất dữ liệu âm thầm.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'How do you get back the id a single INSERT just generated, without a second query?|||Làm sao lấy lại id mà một INSERT vừa sinh, không cần truy vấn thứ hai?',
            options: [
              'SELECT max(id) right after|||SELECT max(id) ngay sau đó',
              'Add a RETURNING clause to the INSERT|||Thêm mệnh đề RETURNING vào INSERT',
              'It is impossible in one statement|||Không thể trong một câu lệnh',
              'Read it from a log file|||Đọc từ một file log',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'INSERT ... ON CONFLICT (key) DO UPDATE ... is used to?|||INSERT ... ON CONFLICT (key) DO UPDATE ... dùng để?',
            options: [
              'Delete conflicting rows|||Xoá các dòng đụng độ',
              'Insert a row, or update it if the key already exists (UPSERT), atomically|||Chèn một dòng, hoặc cập nhật nếu khoá đã tồn tại (UPSERT), một cách nguyên tử',
              'Ignore all inserts|||Bỏ qua mọi lần chèn',
              'Create a new table|||Tạo một bảng mới',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which correctly tests for a NULL tag?|||Cái nào kiểm đúng một tag NULL?',
            options: [
              'WHERE tag = NULL|||WHERE tag = NULL',
              'WHERE tag IS NULL|||WHERE tag IS NULL',
              'WHERE tag <> NULL|||WHERE tag <> NULL',
              'WHERE tag = ""|||WHERE tag = ""',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'WHERE tag <> \'sql\' returns rows where tag is \'date\', \'ops\'... but what about rows where tag IS NULL?|||WHERE tag <> \'sql\' trả các dòng tag là \'date\', \'ops\'... còn các dòng tag IS NULL thì sao?',
            options: [
              'They are included|||Chúng được bao gồm',
              'They are silently excluded (NULL <> anything is unknown)|||Chúng bị âm thầm loại (NULL <> bất cứ gì là không-rõ)',
              'It raises an error|||Nó báo lỗi',
              'Only the first NULL row is included|||Chỉ dòng NULL đầu tiên được bao gồm',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For a case-insensitive text search, use?|||Cho tìm kiếm chữ không phân biệt hoa/thường, dùng?',
            options: [
              'LIKE|||LIKE',
              'ILIKE|||ILIKE',
              'IN|||IN',
              'BETWEEN|||BETWEEN',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why must LIMIT/OFFSET always be paired with ORDER BY?|||Vì sao LIMIT/OFFSET luôn phải đi cùng ORDER BY?',
            options: [
              'It runs faster|||Nó chạy nhanh hơn',
              'Without ORDER BY the row order is unspecified, so paging can repeat or skip rows|||Không có ORDER BY thì thứ tự dòng không xác định, nên phân trang có thể lặp hoặc rớt dòng',
              'OFFSET requires it syntactically|||OFFSET bắt buộc nó về cú pháp',
              'It removes duplicates|||Nó loại trùng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which keeps exactly one row per author — the newest by created_at?|||Cái nào giữ đúng một dòng mỗi tác giả — mới nhất theo created_at?',
            options: [
              'SELECT DISTINCT author ...|||SELECT DISTINCT author ...',
              'SELECT DISTINCT ON (author) ... ORDER BY author, created_at DESC|||SELECT DISTINCT ON (author) ... ORDER BY author, created_at DESC',
              'GROUP BY created_at|||GROUP BY created_at',
              'LIMIT 1|||LIMIT 1',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You run UPDATE note SET views = 0; with no WHERE. What happens?|||Bạn chạy UPDATE note SET views = 0; không có WHERE. Điều gì xảy ra?',
            options: [
              'Only the first row is updated|||Chỉ dòng đầu tiên được cập nhật',
              'Every row in the table is updated|||Mọi dòng trong bảng được cập nhật',
              'It raises an error requiring WHERE|||Nó báo lỗi đòi phải có WHERE',
              'Nothing changes|||Không gì đổi',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
