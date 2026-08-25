/**
 * PostgreSQL — Chương 7: Truy vấn con & CTE.
 * Subquery vô hướng/IN/WHERE · correlated + EXISTS/NOT EXISTS + bẫy NOT IN với NULL ·
 * CTE WITH (dễ đọc + tổng-hợp-trước-join sửa fan-out sum) · CTE đệ quy (cây phân cấp).
 * Output chạy thật PG 15.4 (schema ch7 trong DB pgcourse).
 * LUẬT: < > trong code/out → &lt; &gt; (so sánh >, chuỗi ' > '); & → &amp;;
 * backtick → &#96;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 7 — Subqueries & CTEs|||Chương 7 — Truy vấn con & CTE',
  description: 'Truy vấn lồng trong truy vấn: subquery vô hướng và IN, subquery tương quan với EXISTS (và bẫy NOT IN), CTE WITH để viết theo bước dễ đọc và tổng hợp trước khi join, cùng CTE đệ quy để đi qua cây phân cấp.',
  lessons: [
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — Subqueries: a query inside a query|||7.1 — Truy vấn con: một truy vấn bên trong truy vấn',
      slug: 'postgresql-7-1-subquery',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Subquery vô hướng (một giá trị) trong SELECT và WHERE, và subquery IN để lọc theo một tập tính động.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>A query that feeds another query</h2>
<p class="lead">A subquery is a <code>SELECT</code> wrapped in parentheses and used inside another statement. It lets you compute something on the fly — an average, a set of ids — and use that result immediately. It's how you ask questions that depend on the data itself, like "which notes are above average?"</p>

<h3>Scalar subquery — a single value</h3>
<p>A <em>scalar</em> subquery returns exactly one value, so you can drop it anywhere a value fits. Show each note next to the table-wide average views — the subquery computes the average once:</p>
<pre><code>SELECT title, views, (SELECT round(avg(views),1) FROM note) AS overall_avg
FROM note ORDER BY id;</code></pre>
<div class="out">    title     | views | overall_avg
--------------+-------+-------------
 Intro to SQL |   120 |        51.7
 Indexes      |    90 |        51.7
 Timezones    |    45 |        51.7
 Backup       |    12 |        51.7
 JSONB        |    30 |        51.7
 Window funcs |    60 |        51.7
 Orphan draft |     5 |        51.7
(7 rows)</div>
<p>Every row shows the same <code>51.7</code> — the one average, attached to each row for comparison. The same scalar subquery shines in <code>WHERE</code>: filter to notes whose views beat the average, without hardcoding a number:</p>
<pre><code>SELECT title, views FROM note
WHERE views &gt; (SELECT avg(views) FROM note)
ORDER BY views DESC;</code></pre>
<div class="out">    title     | views
--------------+-------
 Intro to SQL |   120
 Indexes      |    90
 Window funcs |    60
(3 rows)</div>
<p>Three notes beat the 51.7 average. The comparison stays correct as the data changes — add rows and the threshold recomputes itself. That's the point of a subquery over a literal: the filter adapts to the data.</p>

<h3>IN subquery — filter against a set</h3>
<p>A subquery can also return a <em>column of values</em>, and <code>IN</code> tests membership against it. "Notes written by users in Hanoi" — the inner query produces the Hanoi user ids, the outer keeps notes whose <code>user_id</code> is among them:</p>
<pre><code>SELECT title FROM note
WHERE user_id IN (SELECT id FROM app_user WHERE city='Hanoi')
ORDER BY id;</code></pre>
<div class="out">    title
--------------
 Intro to SQL
 Indexes
 Backup
 JSONB
(4 rows)</div>
<p>You didn't have to know <em>which</em> users are in Hanoi — the subquery found them. This "filter by a set computed elsewhere" pattern is everywhere: items in active categories, orders from premium customers, posts by followed users. Many such queries can also be written as a JOIN (Chapter 5); a subquery is often the clearer way to express "keep rows whose key is in this set".</p>
<div class="note-ct">The feed uses exactly this to show "posts from people you follow": <code>WHERE author_id IN (SELECT followee_id FROM follow WHERE follower_id = :me)</code>. The inner query is your follow list, computed fresh each time; the outer query filters the global post stream down to it. Change who you follow, and the set the feed filters against changes with no code edit.</div>
<h3>Three places a subquery can stand</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">In WHERE — a value or a set</span><span class="lz-lnote"><code>WHERE user_id IN (SELECT id FROM app_user WHERE plan = 'pro')</code>. Runs once, produces a list, filters the outer rows against it. The most common shape by far.</span></div>
<div class="lz-layer"><span class="lz-lname">In FROM — a derived table</span><span class="lz-lnote"><code>FROM (SELECT user_id, COUNT(*) c FROM note GROUP BY user_id) t</code>. Behaves exactly like a table, must have an alias, and is how you aggregate before joining (6.4).</span></div>
<div class="lz-layer"><span class="lz-lname">In SELECT — a scalar</span><span class="lz-lnote"><code>SELECT u.name, (SELECT COUNT(*) FROM note n WHERE n.user_id = u.id)</code>. Must return exactly one row and one column, or the query errors at runtime rather than at parse time.</span></div>
</div>
<p>Only the third form runs per outer row; the first two run once. That single distinction predicts the performance of every subquery you will write, and it is what the next lesson is about.</p>
<div class="pitfall"><p><strong>Trap — <code>NOT IN</code> against a column that can be NULL.</strong> <code>WHERE id NOT IN (SELECT user_id FROM note)</code> returns <em>zero rows</em> the moment one <code>user_id</code> is NULL, and it does so silently. The logic is airtight and deeply unhelpful: <code>id NOT IN (1, 2, NULL)</code> means "id ≠ 1 AND id ≠ 2 AND id ≠ NULL", and that last comparison is <code>UNKNOWN</code>, never true — so the whole condition can never be true. <code>NOT EXISTS</code> has no such flaw and is the safe default; if you must keep <code>NOT IN</code>, add <code>WHERE user_id IS NOT NULL</code> inside the subquery. This is one of the few SQL bugs that turns a working report into an empty one overnight, when the first NULL arrives.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: scalar and IN subqueries on the note table</span><span class="lc-sub">The Code Lab track sets up the data used across this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Một truy vấn nuôi một truy vấn khác</h2>
<p class="lead">Một truy vấn con là một <code>SELECT</code> bọc trong ngoặc và dùng bên trong một câu lệnh khác. Nó cho bạn tính một thứ ngay lúc chạy — một trung bình, một tập id — rồi dùng kết quả đó ngay. Đây là cách bạn đặt các câu hỏi phụ thuộc vào chính dữ liệu, như "note nào trên trung bình?"</p>

<h3>Subquery vô hướng — một giá trị duy nhất</h3>
<p>Một subquery <em>vô hướng</em> trả về đúng một giá trị, nên bạn có thể đặt nó ở bất cứ đâu một giá trị vừa. Hiện mỗi note cạnh trung bình views của cả bảng — subquery tính trung bình một lần:</p>
<pre><code>SELECT title, views, (SELECT round(avg(views),1) FROM note) AS overall_avg
FROM note ORDER BY id;</code></pre>
<div class="out">    title     | views | overall_avg
--------------+-------+-------------
 Intro to SQL |   120 |        51.7
 Indexes      |    90 |        51.7
 Timezones    |    45 |        51.7
 Backup       |    12 |        51.7
 JSONB        |    30 |        51.7
 Window funcs |    60 |        51.7
 Orphan draft |     5 |        51.7
(7 rows)</div>
<p>Mọi dòng hiện cùng một <code>51.7</code> — một trung bình duy nhất, gắn vào mỗi dòng để so sánh. Cùng subquery vô hướng đó toả sáng trong <code>WHERE</code>: lọc các note có views vượt trung bình, không cần gõ cứng một con số:</p>
<pre><code>SELECT title, views FROM note
WHERE views &gt; (SELECT avg(views) FROM note)
ORDER BY views DESC;</code></pre>
<div class="out">    title     | views
--------------+-------
 Intro to SQL |   120
 Indexes      |    90
 Window funcs |    60
(3 rows)</div>
<p>Ba note vượt trung bình 51.7. Phép so sánh vẫn đúng khi dữ liệu đổi — thêm dòng thì ngưỡng tự tính lại. Đó là điểm hơn của một subquery so với một hằng số: bộ lọc thích ứng với dữ liệu.</p>

<h3>Subquery IN — lọc theo một tập</h3>
<p>Một subquery cũng có thể trả về một <em>cột các giá trị</em>, và <code>IN</code> kiểm việc thuộc tập đó. "Note viết bởi user ở Hà Nội" — truy vấn trong sinh ra các id user Hà Nội, truy vấn ngoài giữ các note có <code>user_id</code> nằm trong đó:</p>
<pre><code>SELECT title FROM note
WHERE user_id IN (SELECT id FROM app_user WHERE city='Hanoi')
ORDER BY id;</code></pre>
<div class="out">    title
--------------
 Intro to SQL
 Indexes
 Backup
 JSONB
(4 rows)</div>
<p>Bạn không cần biết <em>những</em> user nào ở Hà Nội — subquery tìm ra chúng. Mẫu "lọc theo một tập tính ở nơi khác" này ở khắp nơi: món trong danh mục đang bật, đơn từ khách hàng cao cấp, bài đăng của user được theo dõi. Nhiều truy vấn kiểu này cũng viết được bằng JOIN (Chương 5); một subquery thường là cách rõ hơn để diễn đạt "giữ dòng có khoá nằm trong tập này".</p>
<div class="note-ct">Bảng tin dùng đúng cái này để hiện "bài từ những người bạn theo dõi": <code>WHERE author_id IN (SELECT followee_id FROM follow WHERE follower_id = :me)</code>. Truy vấn trong là danh sách theo dõi của bạn, tính tươi mỗi lần; truy vấn ngoài lọc dòng chảy bài đăng toàn cục xuống còn nó. Đổi người bạn theo dõi, và tập mà bảng tin lọc theo đổi mà không cần sửa mã.</div>
<h3>Ba chỗ một subquery được đứng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Trong WHERE — một giá trị hoặc một tập</span><span class="lz-lnote"><code>WHERE user_id IN (SELECT id FROM app_user WHERE plan = 'pro')</code>. Chạy MỘT lần, sinh ra một danh sách, lọc các dòng ngoài theo nó. Hình dạng phổ biến nhất, xa hơn mọi dạng khác.</span></div>
<div class="lz-layer"><span class="lz-lname">Trong FROM — một bảng dẫn xuất</span><span class="lz-lnote"><code>FROM (SELECT user_id, COUNT(*) c FROM note GROUP BY user_id) t</code>. Hành xử y hệt một cái bảng, BẮT BUỘC có alias, và đây là cách bạn tổng hợp trước khi join (6.4).</span></div>
<div class="lz-layer"><span class="lz-lname">Trong SELECT — một giá trị vô hướng</span><span class="lz-lnote"><code>SELECT u.name, (SELECT COUNT(*) FROM note n WHERE n.user_id = u.id)</code>. Phải trả về ĐÚNG một dòng một cột, không thì truy vấn lỗi lúc CHẠY chứ không phải lúc phân tích cú pháp.</span></div>
</div>
<p>Chỉ dạng thứ ba chạy theo TỪNG dòng ngoài; hai dạng đầu chạy một lần. Đúng một sự phân biệt ấy dự đoán được hiệu năng của mọi subquery bạn sẽ viết, và đó là nội dung của bài kế tiếp.</p>
<div class="pitfall"><p><strong>Bẫy — <code>NOT IN</code> trên một cột có thể NULL.</strong> <code>WHERE id NOT IN (SELECT user_id FROM note)</code> trả về <em>KHÔNG DÒNG NÀO</em> ngay khoảnh khắc có một <code>user_id</code> là NULL, và nó làm thế trong im lặng. Lô-gíc thì kín kẽ mà vô cùng vô ích: <code>id NOT IN (1, 2, NULL)</code> nghĩa là "id ≠ 1 VÀ id ≠ 2 VÀ id ≠ NULL", mà phép so cuối là <code>UNKNOWN</code>, không bao giờ đúng — nên cả điều kiện không thể nào đúng. <code>NOT EXISTS</code> không có khuyết tật ấy và là mặc định an toàn; nếu buộc phải giữ <code>NOT IN</code>, thêm <code>WHERE user_id IS NOT NULL</code> vào TRONG subquery. Đây là một trong số ít bug SQL biến một báo cáo đang chạy thành báo cáo rỗng sau một đêm, đúng lúc cái NULL đầu tiên xuất hiện.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: subquery vô hướng và IN trên bảng note</span><span class="lc-sub">Track Code Lab dựng dữ liệu dùng xuyên suốt chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Correlated subqueries, EXISTS & the NOT IN trap|||7.2 — Subquery tương quan, EXISTS & bẫy NOT IN',
      slug: 'postgresql-7-2-correlated-exists',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Subquery tương quan chạy cho mỗi dòng ngoài, EXISTS/NOT EXISTS để kiểm sự tồn tại, và vì sao NOT IN im lặng trả rỗng khi gặp NULL.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Subqueries that see the outer row — and one that bites</h2>
<p class="lead">A <em>correlated</em> subquery refers to the outer query's current row, so it re-runs per row — perfect for "for each X, look up something about it". <code>EXISTS</code> builds on that for existence checks, and it's safer than its cousin <code>NOT IN</code>, which has a famous NULL trap that returns zero rows when you least expect it.</p>

<h3>Correlated subquery — one lookup per outer row</h3>
<p>Notice the inner query references <code>n.id</code> from the outer query — so it runs once for <em>each</em> note, counting that note's comments:</p>
<pre><code>SELECT n.title,
       (SELECT count(*) FROM comment c WHERE c.note_id = n.id) AS comments
FROM note n ORDER BY n.id;</code></pre>
<div class="out">    title     | comments
--------------+----------
 Intro to SQL |        2
 Indexes      |        0
 Timezones    |        1
 Backup       |        0
 JSONB        |        0
 Window funcs |        0
 Orphan draft |        0
(7 rows)</div>
<p>Each row got its own comment count, including the zeros — because the correlated subquery runs fresh per note. (A LEFT JOIN + GROUP BY from Chapter 6 gives the same answer; correlated subqueries are often the more readable choice when you want one derived value per row.)</p>

<h3>EXISTS / NOT EXISTS — "is there at least one?"</h3>
<p>When you only care <em>whether</em> a match exists (not how many), <code>EXISTS</code> is the tool. It stops at the first match, so it's efficient. "Users who have written at least one note":</p>
<pre><code>SELECT u.name FROM app_user u
WHERE EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id)
ORDER BY u.id;</code></pre>
<div class="out"> name
-------
 Cuong
 Lan
 Minh
(3 rows)</div>
<p>The <code>SELECT 1</code> is idiomatic — <code>EXISTS</code> only checks whether a row comes back, not what's in it. Flip to <code>NOT EXISTS</code> for the opposite — the "find the orphans" question from Chapter 5, written as a subquery:</p>
<pre><code>SELECT u.name FROM app_user u
WHERE NOT EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id)
ORDER BY u.id;</code></pre>
<div class="out"> name
------
 Ngoc
(1 row)</div>

<h3>The NOT IN trap — NULL makes it return nothing</h3>
<p>You'd think "users with no notes" could also be written with <code>NOT IN</code>. It usually works — until the subquery returns a <code>NULL</code>. Our <code>note</code> table has one row with <code>user_id = NULL</code> (the orphan draft), and watch what that does:</p>
<pre><code>SELECT u.name FROM app_user u
WHERE u.id NOT IN (SELECT user_id FROM note)
ORDER BY u.id;</code></pre>
<div class="out"> name
------
(0 rows)</div>
<p><strong>Zero rows</strong> — even though Ngoc clearly has no notes. Here's why: the subquery returns <code>{1, 2, 3, NULL}</code>. For Ngoc, <code>4 NOT IN (1,2,3,NULL)</code> asks "is 4 different from all of these?" — and <code>4 &lt;&gt; NULL</code> is <em>unknown</em> (the NULL trap from Chapter 4), so the whole condition is never true. One NULL in the list silently poisons the entire <code>NOT IN</code>.</p>
<div class="callout danger">Prefer <strong><code>NOT EXISTS</code> over <code>NOT IN</code></strong> whenever the subquery column could be NULL. <code>NOT EXISTS</code> handles NULLs correctly and is usually as fast or faster. (<code>NOT IN</code> is fine only when you're certain the subquery never yields NULL.) This exact bug — a query that "returns nothing for no reason" — is one of the most time-wasting in SQL.</div>
<div class="note-ct">This trap has burned real features here: a "users who haven't completed onboarding" query written with <code>NOT IN</code> silently returned an empty list the moment one row in the compared column was NULL, making it look like everyone had onboarded. Rewriting it as <code>NOT EXISTS</code> fixed it instantly. When a "find the missing" query mysteriously finds none, suspect a NULL in a <code>NOT IN</code>.</div>
<h3>Correlated or not — the one question that matters</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">?</span><span class="lz-t">Does the inner query mention an outer column?</span><span class="lz-d">That is the entire test. <code>WHERE n.user_id = u.id</code> mentions <code>u</code>, which comes from outside — so it is correlated.</span></div>
<div class="lz-step"><span class="lz-k">no</span><span class="lz-t">Uncorrelated → runs once</span><span class="lz-d">The server evaluates it a single time and reuses the result for every outer row. Cost is independent of how many rows the outer query has.</span></div>
<div class="lz-step"><span class="lz-k">yes</span><span class="lz-t">Correlated → conceptually runs per row</span><span class="lz-d">Ten thousand outer rows means ten thousand evaluations, unless the planner rewrites it into a join — which PostgreSQL often does, and Chapter 10 shows you how to confirm.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">EXISTS stops at the first hit</span><span class="lz-d">Unlike <code>COUNT(*) &gt; 0</code>, which must find every match before comparing, <code>EXISTS</code> returns as soon as one row qualifies. On a large child table that difference is the whole query.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — writing <code>(SELECT COUNT(*) …) &gt; 0</code> when you meant <code>EXISTS</code>.</strong> They return the same boolean and read almost the same, so the substitution feels free. It is not: the count must scan every matching child row to produce a number you then throw away, while <code>EXISTS</code> stops at the first one. On a user with 40,000 notes, the count reads 40,000 rows to answer a question that the first row already settled. The same trap has a mirror image — <code>COUNT(*) = 0</code> should be <code>NOT EXISTS</code>. Use a count when you want the number; use <code>EXISTS</code> when you want the answer yes or no.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: EXISTS vs the NOT IN NULL trap, side by side</span><span class="lc-sub">The Code Lab track reproduces the empty-result bug and its fix.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Subquery thấy được dòng ngoài — và một cái cắn bạn</h2>
<p class="lead">Một subquery <em>tương quan</em> tham chiếu dòng hiện tại của truy vấn ngoài, nên nó chạy lại mỗi dòng — hoàn hảo cho "với mỗi X, tra một thứ về nó". <code>EXISTS</code> dựng trên đó để kiểm sự tồn tại, và nó an toàn hơn người anh em <code>NOT IN</code>, vốn có một bẫy NULL nổi tiếng trả về rỗng đúng lúc bạn không ngờ.</p>

<h3>Subquery tương quan — một lần tra cho mỗi dòng ngoài</h3>
<p>Để ý truy vấn trong tham chiếu <code>n.id</code> từ truy vấn ngoài — nên nó chạy một lần cho <em>mỗi</em> note, đếm bình luận của note đó:</p>
<pre><code>SELECT n.title,
       (SELECT count(*) FROM comment c WHERE c.note_id = n.id) AS comments
FROM note n ORDER BY n.id;</code></pre>
<div class="out">    title     | comments
--------------+----------
 Intro to SQL |        2
 Indexes      |        0
 Timezones    |        1
 Backup       |        0
 JSONB        |        0
 Window funcs |        0
 Orphan draft |        0
(7 rows)</div>
<p>Mỗi dòng có số bình luận của riêng nó, kể cả các số 0 — vì subquery tương quan chạy mới cho mỗi note. (Một LEFT JOIN + GROUP BY từ Chương 6 cho cùng đáp án; subquery tương quan thường là lựa chọn dễ đọc hơn khi bạn muốn một giá trị dẫn xuất cho mỗi dòng.)</p>

<h3>EXISTS / NOT EXISTS — "có ít nhất một không?"</h3>
<p>Khi bạn chỉ quan tâm <em>liệu</em> có một cái khớp (không phải bao nhiêu), <code>EXISTS</code> là công cụ. Nó dừng ở cái khớp đầu tiên, nên hiệu quả. "User đã viết ít nhất một note":</p>
<pre><code>SELECT u.name FROM app_user u
WHERE EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id)
ORDER BY u.id;</code></pre>
<div class="out"> name
-------
 Cuong
 Lan
 Minh
(3 rows)</div>
<p>Cái <code>SELECT 1</code> là thành ngữ — <code>EXISTS</code> chỉ kiểm có một dòng trả về hay không, không quan tâm trong đó có gì. Lật sang <code>NOT EXISTS</code> cho điều ngược lại — câu hỏi "tìm mồ côi" từ Chương 5, viết dưới dạng subquery:</p>
<pre><code>SELECT u.name FROM app_user u
WHERE NOT EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id)
ORDER BY u.id;</code></pre>
<div class="out"> name
------
 Ngoc
(1 row)</div>

<h3>Bẫy NOT IN — NULL khiến nó trả về rỗng</h3>
<p>Bạn sẽ nghĩ "user không có note" cũng viết được bằng <code>NOT IN</code>. Nó thường chạy — cho tới khi subquery trả về một <code>NULL</code>. Bảng <code>note</code> của ta có một dòng <code>user_id = NULL</code> (bản nháp mồ côi), xem nó làm gì:</p>
<pre><code>SELECT u.name FROM app_user u
WHERE u.id NOT IN (SELECT user_id FROM note)
ORDER BY u.id;</code></pre>
<div class="out"> name
------
(0 rows)</div>
<p><strong>Không dòng nào</strong> — dù Ngoc rõ ràng không có note. Lý do: subquery trả về <code>{1, 2, 3, NULL}</code>. Với Ngoc, <code>4 NOT IN (1,2,3,NULL)</code> hỏi "4 có khác tất cả những cái này không?" — và <code>4 &lt;&gt; NULL</code> là <em>không rõ</em> (bẫy NULL từ Chương 4), nên cả điều kiện không bao giờ đúng. Một NULL trong danh sách âm thầm đầu độc toàn bộ <code>NOT IN</code>.</p>
<div class="callout danger">Hãy ưu tiên <strong><code>NOT EXISTS</code> hơn <code>NOT IN</code></strong> mỗi khi cột subquery có thể NULL. <code>NOT EXISTS</code> xử lý NULL đúng và thường nhanh bằng hoặc hơn. (<code>NOT IN</code> chỉ ổn khi bạn chắc chắn subquery không bao giờ ra NULL.) Đúng cái bug này — một truy vấn "trả về rỗng không vì lý do gì" — là một trong những thứ tốn thời gian nhất trong SQL.</div>
<div class="note-ct">Bẫy này đã đốt tính năng thật ở đây: một truy vấn "user chưa hoàn tất onboarding" viết bằng <code>NOT IN</code> âm thầm trả về danh sách rỗng ngay khi một dòng trong cột so sánh là NULL, khiến trông như ai cũng đã onboard. Viết lại thành <code>NOT EXISTS</code> sửa ngay. Khi một truy vấn "tìm cái còn thiếu" bí ẩn không tìm thấy gì, hãy nghi một NULL trong một <code>NOT IN</code>.</div>
<h3>Có tương quan hay không — câu hỏi duy nhất đáng hỏi</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">?</span><span class="lz-t">Truy vấn trong có nhắc tới một cột bên NGOÀI không?</span><span class="lz-d">Đó là toàn bộ phép kiểm. <code>WHERE n.user_id = u.id</code> nhắc tới <code>u</code>, thứ đến từ bên ngoài — vậy là có tương quan.</span></div>
<div class="lz-step"><span class="lz-k">không</span><span class="lz-t">Không tương quan → chạy MỘT lần</span><span class="lz-d">Máy chủ tính đúng một lần rồi dùng lại kết quả cho mọi dòng ngoài. Chi phí độc lập với việc truy vấn ngoài có bao nhiêu dòng.</span></div>
<div class="lz-step"><span class="lz-k">có</span><span class="lz-t">Có tương quan → về khái niệm là chạy MỖI DÒNG</span><span class="lz-d">Mười nghìn dòng ngoài nghĩa là mười nghìn lượt tính, trừ khi planner viết lại nó thành một cú join — điều PostgreSQL thường làm, và Chương 10 chỉ bạn cách xác nhận.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">EXISTS dừng ở cú khớp ĐẦU TIÊN</span><span class="lz-d">Khác <code>COUNT(*) &gt; 0</code> vốn phải tìm hết mọi cú khớp rồi mới so sánh, <code>EXISTS</code> trả về ngay khi có MỘT dòng đủ điều kiện. Trên một bảng con lớn, khác biệt ấy chính là cả truy vấn.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — viết <code>(SELECT COUNT(*) …) &gt; 0</code> khi ý bạn là <code>EXISTS</code>.</strong> Chúng trả về cùng một giá trị đúng/sai và đọc gần như giống nhau, nên việc thay thế có cảm giác miễn phí. Không hề: phép đếm phải quét MỌI dòng con khớp để ra một con số rồi bạn vứt đi, trong khi <code>EXISTS</code> dừng ở cái đầu tiên. Trên một user có 40.000 note, phép đếm đọc 40.000 dòng để trả lời một câu hỏi mà dòng đầu tiên đã giải quyết xong. Cùng cái bẫy ấy có ảnh gương — <code>COUNT(*) = 0</code> đáng lẽ phải là <code>NOT EXISTS</code>. Dùng đếm khi bạn muốn CON SỐ; dùng <code>EXISTS</code> khi bạn muốn câu trả lời CÓ hay KHÔNG.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: EXISTS vs bẫy NULL của NOT IN, cạnh nhau</span><span class="lc-sub">Track Code Lab tái hiện bug kết-quả-rỗng và cách sửa.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — CTEs (WITH): queries in readable steps|||7.3 — CTE (WITH): truy vấn theo bước dễ đọc',
      slug: 'postgresql-7-3-cte',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Common Table Expression với WITH để đặt tên các bước, và mẫu tổng-hợp-trước-khi-join để sửa triệt để fan-out sum.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Naming the steps: the WITH clause</h2>
<p class="lead">As queries grow, nesting subqueries becomes unreadable. A <strong>CTE</strong> (Common Table Expression), written with <code>WITH</code>, lets you name a subquery and refer to it like a temporary table — turning one dense statement into a sequence of clear steps. It also gives us the clean fix for the fan-out <em>sum</em> problem left open in Chapter 6.</p>

<h3>WITH — a named, reusable step</h3>
<p>Define a CTE up front, then <code>SELECT</code> from it as if it were a table. Here <code>author_stats</code> summarises notes per author, and the main query joins it to names and filters:</p>
<pre><code>WITH author_stats AS (
  SELECT user_id, count(*) AS notes, sum(views) AS total_views
  FROM note WHERE user_id IS NOT NULL
  GROUP BY user_id
)
SELECT u.name, s.notes, s.total_views
FROM author_stats s JOIN app_user u ON u.id = s.user_id
WHERE s.total_views &gt; 100
ORDER BY s.total_views DESC;</code></pre>
<div class="out"> name  | notes | total_views
-------+-------+-------------
 Cuong |     2 |         210
 Lan   |     2 |         105
(2 rows)</div>
<p>The same query could be written as a subquery in the <code>FROM</code> clause, but the CTE reads top-to-bottom like steps: "first compute author stats, then join and filter". For anything beyond trivial, that readability is worth a lot — and you can define several CTEs (comma-separated) and even have later ones build on earlier ones.</p>

<h3>The clean fix for fan-out sums</h3>
<p>Recall the Chapter 6 problem: summing a value across a one-to-many join multiplies it. Watch it happen — total views per author, but joined through comments:</p>
<pre><code>SELECT u.name, sum(n.views) AS wrong_views
FROM app_user u
JOIN note n    ON n.user_id = u.id
JOIN comment c ON c.note_id = n.id
GROUP BY u.name ORDER BY u.name;</code></pre>
<div class="out"> name  | wrong_views
-------+-------------
 Cuong |         240
 Lan   |          45
(2 rows)</div>
<p>Cuong's real total is 210 (120 + 90), but this reports <strong>240</strong> — his "Intro" note (120 views) has 2 comments, so its 120 got added <em>twice</em>, while his comment-less "Indexes" note dropped out of the INNER JOIN entirely. The numbers are simply wrong. The fix: <strong>aggregate the "many" side first, in a CTE, so each note joins to a single pre-counted row</strong>:</p>
<pre><code>WITH note_comments AS (
  SELECT note_id, count(*) AS comments
  FROM comment GROUP BY note_id
)
SELECT u.name,
       sum(n.views)                 AS total_views,
       coalesce(sum(nc.comments),0) AS comments
FROM app_user u
JOIN note n ON n.user_id = u.id
LEFT JOIN note_comments nc ON nc.note_id = n.id
GROUP BY u.name ORDER BY u.name;</code></pre>
<div class="out"> name  | total_views | comments
-------+-------------+----------
 Cuong |         210 |        2
 Lan   |         105 |        1
 Minh  |          42 |        0
(3 rows)</div>
<p>Now every note appears once (the comment counts were collapsed to one row per note <em>before</em> the join), so <code>sum(views)</code> is correct: Cuong 210, Lan 105, and Minh is back with his 42. This "pre-aggregate, then join" pattern is the definitive cure for double-counted sums — and CTEs make it read cleanly.</p>
<div class="callout ok">Two uses for CTEs: <strong>readability</strong> (name each step of a complex query) and <strong>correctness</strong> (aggregate a one-to-many side <em>before</em> joining it, so its rows don't multiply a sum). When a report's totals look too big, a pre-aggregating CTE is very often the fix.</div>
<div class="note-ct">Analytics dashboards here lean on this constantly: to show "each post with its view total and its comment count", the query pre-aggregates comments per post in a CTE and only then joins — otherwise a post with many comments would report an inflated view count. The CTE is both what makes the query readable and what keeps its numbers honest.</div>
<h3>What a CTE buys, and what it costs</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Readability</span><span class="lz-nsub">the real reason to use one</span></span>
<span class="lz-nbody">A nested subquery three levels deep reads inside-out; a chain of named CTEs reads top-down like paragraphs. Same plan, far lower chance the next person misreads it. Name each step after what it produces, not how it works.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Reuse</span><span class="lz-nsub">reference it twice, define it once</span></span>
<span class="lz-nbody">A CTE can be referenced several times in the main query. A derived table in <code>FROM</code> cannot — you would have to repeat it, and then the two copies drift apart during the next edit.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">The optimisation fence</span><span class="lz-nsub">changed in PostgreSQL 12</span></span>
<span class="lz-nbody">Before 12, every CTE was materialised — the planner could not push a filter into it. From 12 onward it inlines them when it can, and <code>MATERIALIZED</code> / <code>NOT MATERIALIZED</code> let you override. Advice written before 2019 says the opposite of what is true today.</span>
</div>
</div>
<div class="pitfall"><p><strong>Trap — reaching for a CTE to "make it faster".</strong> A CTE is a naming device, not an optimisation. On PostgreSQL 12+ an inlined CTE produces the same plan as the equivalent subquery — no faster — and a materialised one can be genuinely <em>slower</em>, because it computes the full intermediate result before any outer filter is applied. If your CTE selects a million rows and the outer query keeps ten, forcing <code>MATERIALIZED</code> makes you pay for 999,990 rows you discard. Choose a CTE when it makes the query readable; reach for <code>EXPLAIN</code> (Chapter 10) when you want it fast.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: rewrite with a CTE and fix the fan-out sum</span><span class="lc-sub">The Code Lab track walks through pre-aggregating before the join.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Đặt tên các bước: mệnh đề WITH</h2>
<p class="lead">Khi truy vấn lớn lên, lồng subquery trở nên khó đọc. Một <strong>CTE</strong> (Common Table Expression), viết bằng <code>WITH</code>, cho bạn đặt tên một subquery và tham chiếu nó như một bảng tạm — biến một câu lệnh dày đặc thành một chuỗi bước rõ ràng. Nó cũng cho ta cách sửa gọn cho vấn đề fan-out <em>sum</em> còn bỏ ngỏ ở Chương 6.</p>

<h3>WITH — một bước có tên, tái dùng được</h3>
<p>Định nghĩa một CTE ở đầu, rồi <code>SELECT</code> từ nó như thể nó là một bảng. Ở đây <code>author_stats</code> tóm tắt note mỗi tác giả, và truy vấn chính join nó với tên và lọc:</p>
<pre><code>WITH author_stats AS (
  SELECT user_id, count(*) AS notes, sum(views) AS total_views
  FROM note WHERE user_id IS NOT NULL
  GROUP BY user_id
)
SELECT u.name, s.notes, s.total_views
FROM author_stats s JOIN app_user u ON u.id = s.user_id
WHERE s.total_views &gt; 100
ORDER BY s.total_views DESC;</code></pre>
<div class="out"> name  | notes | total_views
-------+-------+-------------
 Cuong |     2 |         210
 Lan   |     2 |         105
(2 rows)</div>
<p>Cùng truy vấn đó có thể viết dưới dạng một subquery trong mệnh đề <code>FROM</code>, nhưng CTE đọc từ trên xuống như các bước: "trước tiên tính thống kê tác giả, rồi join và lọc". Với bất cứ gì hơn mức tầm thường, sự dễ đọc đó đáng giá lắm — và bạn có thể định nghĩa nhiều CTE (ngăn bằng phẩy) và thậm chí để cái sau dựng trên cái trước.</p>

<h3>Cách sửa gọn cho fan-out sum</h3>
<p>Nhớ lại vấn đề Chương 6: cộng một giá trị qua một join một-nhiều nhân nó lên. Xem nó xảy ra — tổng views mỗi tác giả, nhưng join qua bình luận:</p>
<pre><code>SELECT u.name, sum(n.views) AS wrong_views
FROM app_user u
JOIN note n    ON n.user_id = u.id
JOIN comment c ON c.note_id = n.id
GROUP BY u.name ORDER BY u.name;</code></pre>
<div class="out"> name  | wrong_views
-------+-------------
 Cuong |         240
 Lan   |          45
(2 rows)</div>
<p>Tổng thật của Cuong là 210 (120 + 90), nhưng cái này báo <strong>240</strong> — note "Intro" của anh (120 views) có 2 bình luận, nên 120 của nó bị cộng <em>hai lần</em>, còn note "Indexes" không bình luận rớt khỏi INNER JOIN hoàn toàn. Các con số đơn giản là sai. Cách sửa: <strong>tổng hợp phía "nhiều" trước, trong một CTE, để mỗi note join với một dòng đã đếm sẵn</strong>:</p>
<pre><code>WITH note_comments AS (
  SELECT note_id, count(*) AS comments
  FROM comment GROUP BY note_id
)
SELECT u.name,
       sum(n.views)                 AS total_views,
       coalesce(sum(nc.comments),0) AS comments
FROM app_user u
JOIN note n ON n.user_id = u.id
LEFT JOIN note_comments nc ON nc.note_id = n.id
GROUP BY u.name ORDER BY u.name;</code></pre>
<div class="out"> name  | total_views | comments
-------+-------------+----------
 Cuong |         210 |        2
 Lan   |         105 |        1
 Minh  |          42 |        0
(3 rows)</div>
<p>Giờ mỗi note xuất hiện một lần (số bình luận đã gộp về một dòng mỗi note <em>trước</em> khi join), nên <code>sum(views)</code> đúng: Cuong 210, Lan 105, và Minh trở lại với 42 của anh. Mẫu "tổng hợp trước, rồi join" này là thuốc chữa dứt điểm cho các tổng bị đếm-hai-lần — và CTE khiến nó đọc gọn gàng.</p>
<div class="callout ok">Hai công dụng của CTE: <strong>dễ đọc</strong> (đặt tên từng bước của một truy vấn phức tạp) và <strong>đúng đắn</strong> (tổng hợp một phía một-nhiều <em>trước</em> khi join nó, để các dòng của nó không nhân một tổng lên). Khi các tổng của một báo cáo trông quá lớn, một CTE tổng-hợp-trước rất thường là cách sửa.</div>
<div class="note-ct">Các dashboard phân tích ở đây dựa vào cái này liên tục: để hiện "mỗi bài đăng kèm tổng views và số bình luận của nó", truy vấn tổng hợp bình luận mỗi bài trong một CTE rồi mới join — nếu không một bài nhiều bình luận sẽ báo số views phồng lên. CTE vừa là thứ khiến truy vấn dễ đọc vừa là thứ giữ các con số trung thực.</div>
<h3>CTE mua được gì, và trả giá bằng gì</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Dễ đọc</span><span class="lz-nsub">lý do THẬT để dùng nó</span></span>
<span class="lz-nbody">Một subquery lồng ba tầng phải đọc từ trong ra; một chuỗi CTE có tên đọc từ trên xuống như các đoạn văn. Cùng một kế hoạch, mà khả năng người sau đọc nhầm thấp hơn hẳn. Đặt tên mỗi bước theo thứ nó SINH RA, không theo cách nó chạy.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Dùng lại</span><span class="lz-nsub">tham chiếu hai lần, định nghĩa một lần</span></span>
<span class="lz-nbody">Một CTE tham chiếu được nhiều lần trong truy vấn chính. Một bảng dẫn xuất trong <code>FROM</code> thì không — bạn sẽ phải chép lại, và rồi hai bản trôi dạt khỏi nhau ở lần sửa kế tiếp.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Hàng rào tối ưu</span><span class="lz-nsub">đã đổi ở PostgreSQL 12</span></span>
<span class="lz-nbody">Trước bản 12, mọi CTE đều bị vật chất hoá — planner không đẩy được bộ lọc vào trong. Từ 12 trở đi nó nội tuyến khi có thể, và <code>MATERIALIZED</code> / <code>NOT MATERIALIZED</code> cho bạn ghi đè. Lời khuyên viết trước 2019 nói NGƯỢC với sự thật hôm nay.</span>
</div>
</div>
<div class="pitfall"><p><strong>Bẫy — với tay lấy CTE để "cho nhanh hơn".</strong> CTE là một công cụ ĐẶT TÊN, không phải một phép tối ưu. Trên PostgreSQL 12+, một CTE được nội tuyến cho ra đúng kế hoạch như subquery tương đương — không nhanh hơn — và một CTE bị vật chất hoá có thể CHẬM HƠN thật, vì nó tính trọn kết quả trung gian TRƯỚC khi bất kỳ bộ lọc ngoài nào được áp. Nếu CTE của bạn chọn một triệu dòng mà truy vấn ngoài chỉ giữ mười, ép <code>MATERIALIZED</code> là bắt bạn trả tiền cho 999.990 dòng vứt đi. Chọn CTE khi nó làm truy vấn DỄ ĐỌC; với tay lấy <code>EXPLAIN</code> (Chương 10) khi bạn muốn nó NHANH.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: viết lại bằng CTE và sửa fan-out sum</span><span class="lc-sub">Track Code Lab đi qua việc tổng hợp trước khi join.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Recursive CTEs: walking a hierarchy|||7.4 — CTE đệ quy: đi qua cây phân cấp',
      slug: 'postgresql-7-4-recursive-cte',
      type: 'LESSON',
      isFreePreview: true,
      description: 'WITH RECURSIVE để đi qua cây phân cấp: tính cấp bậc quản lý và dựng đường dẫn đầy đủ từ đỉnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Following a chain: recursive CTEs</h2>
<p class="lead">Some data is a tree: an employee reports to a manager who reports to another manager; a comment replies to a comment; a category sits under a parent category. A plain join reaches one level up. A <strong>recursive CTE</strong> follows the chain as deep as it goes — the one SQL feature built specifically for hierarchies.</p>

<h3>The shape of a recursive CTE</h3>
<p>A <code>WITH RECURSIVE</code> has two parts joined by <code>UNION ALL</code>: an <strong>anchor</strong> (where to start) and a <strong>recursive step</strong> (how to get from the current rows to the next ones). Here we start at the top boss and walk down, numbering levels:</p>
<pre><code>WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 1 AS level          <span class="tok-comment">-- anchor: the top (no manager)</span>
  FROM employee WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.level + 1   <span class="tok-comment">-- step: people who report to a found row</span>
  FROM employee e JOIN chain c ON e.manager_id = c.id
)
SELECT level, name FROM chain ORDER BY level, name;</code></pre>
<div class="out"> level | name
-------+-------
     1 | Alice
     2 | Bob
     2 | Carol
     3 | Dave
     4 | Erin
(5 rows)</div>
<p>The anchor found Alice (level 1). The recursive step then found everyone whose manager is Alice (Bob, Carol — level 2), then everyone whose manager is <em>them</em> (Dave — level 3), then Dave's reports (Erin — level 4), stopping when no new rows appear. That's the whole org chart, with depth computed automatically.</p>

<h3>Building a path as you descend</h3>
<p>The recursive step can accumulate a value down the chain — here, concatenating names into a full path from the top:</p>
<pre><code>WITH RECURSIVE tree AS (
  SELECT id, name, manager_id, name::text AS path
  FROM employee WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, t.path || ' &gt; ' || e.name
  FROM employee e JOIN tree t ON e.manager_id = t.id
)
SELECT path FROM tree ORDER BY path;</code></pre>
<div class="out">           path
---------------------------
 Alice
 Alice &gt; Bob
 Alice &gt; Bob &gt; Dave
 Alice &gt; Bob &gt; Dave &gt; Erin
 Alice &gt; Carol
(5 rows)</div>
<p>Each level appended its own name to the parent's path, producing the full lineage for every employee — <code>Alice &gt; Bob &gt; Dave &gt; Erin</code> shows Erin is four levels deep. The same technique builds category breadcrumbs, comment-reply threads, and any "show the whole branch" view.</p>
<div class="callout warn">A recursive CTE keeps going until the recursive step returns no new rows. If your data has a <em>cycle</em> (A manages B who manages A — usually a data bug), it would loop forever; guard against it by tracking visited ids in the path and stopping if one repeats. For clean tree data, it simply terminates when it runs out of children.</div>
<div class="note-ct">Threaded comment replies on this site are exactly this: a comment's <code>parent_id</code> points at another comment, and rendering a full thread walks the chain with a recursive CTE — the same query shape as the org chart above, just over comments. Category trees and any nested navigation use the identical pattern.</div>
<h3>The two halves of a recursive CTE</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The anchor</span><span class="lz-d">A plain query that produces the starting rows — the root of the tree, the first day of the range. It runs once and never again.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">UNION ALL</span><span class="lz-d">Almost always <code>ALL</code>, not plain <code>UNION</code>: the plain form deduplicates on every iteration, which is both slower and rarely what a tree walk wants.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The recursive term</span><span class="lz-d">A query that references the CTE by name. Each pass sees only the rows produced by the <em>previous</em> pass — not the whole accumulated set. That is the detail people get wrong.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Stop when a pass returns nothing</span><span class="lz-d">There is no explicit exit. The recursion ends when the recursive term produces zero rows, which is why a cycle in the data means it never ends.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — trusting the data to be acyclic.</strong> An org chart where two people are accidentally each other's manager, or a category tree where someone set a parent to its own child, turns a recursive CTE into an infinite loop that consumes memory until the connection dies. It works perfectly on your seed data and takes production down the day someone saves a bad row in the admin panel. Two defences, and use both: carry the visited path in an array and add <code>WHERE NOT node.id = ANY(path)</code>, and add a depth column with <code>WHERE depth &lt; 100</code>. The depth guard costs nothing and turns an outage into a truncated result you can notice.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next chapter: window functions</span><span class="lc-sub">Rankings, running totals, and per-row-with-its-group calculations — closing Phase 2.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Đi theo một chuỗi: CTE đệ quy</h2>
<p class="lead">Có dữ liệu là một cây: một nhân viên báo cáo cho một quản lý, người này báo cáo cho một quản lý khác; một bình luận trả lời một bình luận; một danh mục nằm dưới một danh mục cha. Một join thường vươn lên một cấp. Một <strong>CTE đệ quy</strong> đi theo chuỗi sâu hết mức — tính năng SQL duy nhất dựng riêng cho cây phân cấp.</p>

<h3>Hình của một CTE đệ quy</h3>
<p>Một <code>WITH RECURSIVE</code> có hai phần nối bằng <code>UNION ALL</code>: một <strong>mỏ neo (anchor)</strong> (bắt đầu ở đâu) và một <strong>bước đệ quy</strong> (làm sao đi từ các dòng hiện tại sang các dòng kế). Ở đây ta bắt đầu ở sếp cao nhất và đi xuống, đánh số cấp:</p>
<pre><code>WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 1 AS level          <span class="tok-comment">-- neo: đỉnh (không quản lý)</span>
  FROM employee WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.level + 1   <span class="tok-comment">-- bước: người báo cáo cho một dòng đã tìm</span>
  FROM employee e JOIN chain c ON e.manager_id = c.id
)
SELECT level, name FROM chain ORDER BY level, name;</code></pre>
<div class="out"> level | name
-------+-------
     1 | Alice
     2 | Bob
     2 | Carol
     3 | Dave
     4 | Erin
(5 rows)</div>
<p>Mỏ neo tìm ra Alice (cấp 1). Bước đệ quy rồi tìm mọi người có quản lý là Alice (Bob, Carol — cấp 2), rồi mọi người có quản lý là <em>họ</em> (Dave — cấp 3), rồi cấp dưới của Dave (Erin — cấp 4), dừng khi không còn dòng mới. Đó là toàn bộ sơ đồ tổ chức, với độ sâu tính tự động.</p>

<h3>Dựng một đường dẫn khi đi xuống</h3>
<p>Bước đệ quy có thể tích luỹ một giá trị dọc chuỗi — ở đây, nối tên thành một đường dẫn đầy đủ từ đỉnh:</p>
<pre><code>WITH RECURSIVE tree AS (
  SELECT id, name, manager_id, name::text AS path
  FROM employee WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, t.path || ' &gt; ' || e.name
  FROM employee e JOIN tree t ON e.manager_id = t.id
)
SELECT path FROM tree ORDER BY path;</code></pre>
<div class="out">           path
---------------------------
 Alice
 Alice &gt; Bob
 Alice &gt; Bob &gt; Dave
 Alice &gt; Bob &gt; Dave &gt; Erin
 Alice &gt; Carol
(5 rows)</div>
<p>Mỗi cấp nối thêm tên của chính nó vào đường dẫn của cha, tạo ra dòng dõi đầy đủ cho mỗi nhân viên — <code>Alice &gt; Bob &gt; Dave &gt; Erin</code> cho thấy Erin sâu bốn cấp. Cùng kỹ thuật đó dựng breadcrumb danh mục, luồng trả lời bình luận, và mọi khung nhìn "hiện cả nhánh".</p>
<div class="callout warn">Một CTE đệ quy cứ chạy tới khi bước đệ quy không trả về dòng mới nào. Nếu dữ liệu có một <em>chu trình</em> (A quản lý B, B quản lý A — thường là bug dữ liệu), nó sẽ lặp vô tận; hãy phòng bằng cách theo dõi các id đã thăm trong đường dẫn và dừng nếu một cái lặp lại. Với dữ liệu cây sạch, nó đơn giản dừng khi hết con.</div>
<div class="note-ct">Trả lời bình luận lồng nhau trên trang này đúng là cái này: một <code>parent_id</code> của bình luận trỏ tới một bình luận khác, và hiển thị một luồng đầy đủ đi theo chuỗi bằng một CTE đệ quy — cùng hình truy vấn như sơ đồ tổ chức ở trên, chỉ khác là trên bình luận. Cây danh mục và mọi điều hướng lồng nhau dùng mẫu y hệt.</div>
<h3>Hai nửa của một CTE đệ quy</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Phần neo</span><span class="lz-d">Một truy vấn thường sinh ra các dòng KHỞI ĐẦU — gốc của cây, ngày đầu của khoảng. Nó chạy một lần và không bao giờ nữa.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">UNION ALL</span><span class="lz-d">Gần như luôn là <code>ALL</code>, không phải <code>UNION</code> trần: dạng trần khử trùng lặp ở MỖI vòng, vừa chậm hơn vừa hiếm khi là thứ một cú duyệt cây muốn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Phần đệ quy</span><span class="lz-d">Một truy vấn tham chiếu CTE bằng chính tên nó. Mỗi lượt chỉ nhìn thấy các dòng do lượt TRƯỚC sinh ra — không phải toàn bộ tập đã tích luỹ. Đó là chi tiết người ta hay hiểu sai.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Dừng khi một lượt không ra dòng nào</span><span class="lz-d">Không có lối thoát tường minh. Đệ quy kết thúc khi phần đệ quy sinh ra 0 dòng, và chính vì thế một chu trình trong DỮ LIỆU nghĩa là nó không bao giờ kết thúc.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tin rằng dữ liệu không có chu trình.</strong> Một sơ đồ tổ chức mà hai người vô tình làm quản lý của nhau, hay một cây danh mục mà ai đó đặt cha thành chính con của nó, sẽ biến một CTE đệ quy thành vòng lặp vô hạn ngốn bộ nhớ tới khi kết nối chết. Nó chạy hoàn hảo trên dữ liệu seed của bạn và hạ gục production vào ngày có người lưu một dòng xấu trong trang quản trị. Hai lớp phòng thủ, và hãy dùng CẢ HAI: mang đường đã đi trong một mảng rồi thêm <code>WHERE NOT node.id = ANY(path)</code>, và thêm một cột độ sâu với <code>WHERE depth &lt; 100</code>. Chốt độ sâu không tốn gì và biến một sự cố thành một kết quả bị cắt ngắn mà bạn nhận ra được.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Chương tới: hàm cửa sổ</span><span class="lc-sub">Xếp hạng, tổng luỹ tiến, và tính mỗi-dòng-cùng-nhóm-của-nó — khép lại Giai đoạn 2.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 7.5 Quiz ─────────────────────────── */
    {
      title: '7.5 — Chapter 7 quiz|||7.5 — Kiểm tra Chương 7',
      slug: 'postgresql-7-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về subquery vô hướng/IN, correlated & EXISTS, bẫy NOT IN, CTE và tổng-hợp-trước-join, và CTE đệ quy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on subqueries and CTEs. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: the NOT IN NULL trap (7.2) and pre-aggregating in a CTE to fix fan-out sums (7.3). Both silently corrupt results otherwise.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về truy vấn con và CTE. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: bẫy NULL của NOT IN (7.2) và tổng-hợp-trước trong CTE để sửa fan-out sum (7.3). Nếu không cả hai âm thầm làm hỏng kết quả.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A scalar subquery returns?|||Một subquery vô hướng trả về?',
            options: [
              'A whole table|||Cả một bảng',
              'Exactly one value, usable anywhere a value fits|||Đúng một giá trị, dùng được ở bất cứ đâu một giá trị vừa',
              'A column of many values|||Một cột nhiều giá trị',
              'Nothing|||Không gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'WHERE views > (SELECT avg(views) FROM note) is better than hardcoding a number because?|||WHERE views > (SELECT avg(views) FROM note) tốt hơn gõ cứng một số vì?',
            options: [
              'It runs faster|||Nó chạy nhanh hơn',
              'The threshold recomputes as the data changes|||Ngưỡng tự tính lại khi dữ liệu đổi',
              'Subqueries are always required|||Subquery luôn bắt buộc',
              'It avoids using WHERE|||Nó tránh dùng WHERE',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A correlated subquery is one that?|||Một subquery tương quan là loại?',
            options: [
              'Runs once for the whole query|||Chạy một lần cho cả truy vấn',
              'References the outer query\'s current row, re-running per row|||Tham chiếu dòng hiện tại của truy vấn ngoài, chạy lại mỗi dòng',
              'Cannot use WHERE|||Không thể dùng WHERE',
              'Only works with GROUP BY|||Chỉ chạy với GROUP BY',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'To check whether at least one matching row exists, the efficient tool is?|||Để kiểm liệu có ít nhất một dòng khớp, công cụ hiệu quả là?',
            options: [
              'count(*) > 0 always|||count(*) > 0 luôn luôn',
              'EXISTS (SELECT 1 ...) — stops at the first match|||EXISTS (SELECT 1 ...) — dừng ở cái khớp đầu tiên',
              'DISTINCT|||DISTINCT',
              'GROUP BY|||GROUP BY',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why can NOT IN (SELECT col ...) suddenly return zero rows?|||Vì sao NOT IN (SELECT col ...) có thể bỗng trả về không dòng nào?',
            options: [
              'It is a syntax error|||Nó là lỗi cú pháp',
              'If the subquery yields a NULL, comparisons become unknown and nothing qualifies — use NOT EXISTS|||Nếu subquery ra một NULL, các so sánh thành không-rõ và không gì đủ điều kiện — dùng NOT EXISTS',
              'NOT IN is not valid SQL|||NOT IN không phải SQL hợp lệ',
              'It always returns zero rows|||Nó luôn trả về không dòng nào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A CTE is written with which keyword?|||Một CTE được viết bằng từ khoá nào?',
            options: [
              'HAVING|||HAVING',
              'WITH|||WITH',
              'USING|||USING',
              'OVER|||OVER',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'To sum a value per author without a one-to-many join inflating it, you should?|||Để cộng một giá trị theo tác giả mà không bị một join một-nhiều làm phồng, bạn nên?',
            options: [
              'Use count(*) instead|||Dùng count(*) thay thế',
              'Pre-aggregate the "many" side in a CTE, then join the summarized rows|||Tổng hợp trước phía "nhiều" trong một CTE, rồi join các dòng đã tóm tắt',
              'Remove the GROUP BY|||Bỏ GROUP BY',
              'Use SELECT *|||Dùng SELECT *',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A WITH RECURSIVE CTE has an anchor and a recursive step joined by?|||Một CTE WITH RECURSIVE có một mỏ neo và một bước đệ quy nối bằng?',
            options: [
              'JOIN|||JOIN',
              'UNION ALL|||UNION ALL',
              'GROUP BY|||GROUP BY',
              'HAVING|||HAVING',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
