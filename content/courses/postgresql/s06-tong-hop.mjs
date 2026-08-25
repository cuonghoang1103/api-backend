/**
 * PostgreSQL — Chương 6: Tổng hợp & gom nhóm.
 * COUNT/SUM/AVG/MIN/MAX + COUNT(*) vs COUNT(col) vs COUNT(DISTINCT) · GROUP BY
 * (luật cột không tổng hợp) · HAVING vs WHERE + FILTER · tổng hợp trên JOIN
 * (thuần fan-out, LEFT JOIN đếm 0). Output chạy thật PG 15.4 (schema ch6).
 * LUẬT: < > trong code → &lt; &gt; (>= >); & → &amp;; backtick → &#96;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 6 — Aggregation & grouping|||Chương 6 — Tổng hợp & gom nhóm',
  description: 'Tóm tắt nhiều dòng thành một con số: COUNT/SUM/AVG/MIN/MAX, GROUP BY để tính theo nhóm, HAVING và FILTER để lọc, và cách tổng hợp đúng trên JOIN mà không bị fan-out làm phồng số.',
  lessons: [
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — Aggregate functions: many rows into one number|||6.1 — Hàm tổng hợp: nhiều dòng thành một con số',
      slug: 'postgresql-6-1-ham-tong-hop',
      type: 'LESSON',
      isFreePreview: true,
      description: 'COUNT, SUM, AVG, MIN, MAX trên cả bảng, cách chúng bỏ qua NULL, và COUNT(*) vs COUNT(cột) vs COUNT(DISTINCT).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Collapsing rows into a summary</h2>
<p class="lead">So far every query returned one output row per input row. Aggregate functions do the opposite: they fold many rows into a single value — a count, a total, an average. Every dashboard number you've ever seen is an aggregate. This lesson covers the five core ones and the NULL behaviour that quietly trips people up.</p>

<h3>The five you'll use constantly</h3>
<p>Run over the whole <code>note</code> table (7 rows, one with a <code>NULL</code> views), all five at once:</p>
<pre><code>SELECT count(*)                AS total_notes,
       count(views)            AS notes_with_views,
       count(DISTINCT user_id) AS authors,
       sum(views)              AS total_views,
       round(avg(views),1)     AS avg_views,
       min(views)              AS min_views,
       max(views)              AS max_views
FROM note;</code></pre>
<div class="out"> total_notes | notes_with_views | authors | total_views | avg_views | min_views | max_views
-------------+------------------+---------+-------------+-----------+-----------+-----------
           7 |                6 |       3 |         357 |      59.5 |        12 |       120
(1 row)</div>
<p>Seven input rows became one summary row. Notice each column answers a different question — how many notes, how many distinct authors, total and average views, smallest and largest.</p>

<h3>The NULL rule — and COUNT(*) vs COUNT(col)</h3>
<p>Here's the detail that matters: <strong>every aggregate except <code>count(*)</code> ignores NULL</strong>. Look at the numbers above. There are 7 notes, but one has <code>views = NULL</code>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">count(*) = 7</span><span class="v">Counts <em>rows</em>, NULLs included. "How many notes exist?"</span></div>
  <div class="kv"><span class="k">count(views) = 6</span><span class="v">Counts <em>non-NULL values</em> of that column. "How many notes have a views number?" The NULL one is skipped.</span></div>
  <div class="kv"><span class="k">avg(views) = 59.5</span><span class="v">357 ÷ <strong>6</strong>, not ÷ 7 — the NULL row isn't averaged in. This is usually what you want, but know it's happening.</span></div>
  <div class="kv"><span class="k">count(DISTINCT user_id) = 3</span><span class="v">Counts <em>distinct</em> values. Seven notes, but only three different authors.</span></div>
</div>
<p>That <code>avg</code> divides by 6, not 7, is the subtle one. If you truly wanted to treat missing views as zero, you'd write <code>avg(coalesce(views,0))</code> — but the default "ignore NULL" is right far more often than not. The rule to memorize: <strong><code>count(*)</code> counts rows; every other aggregate skips NULLs.</strong></p>
<div class="callout ok"><code>count(*)</code> for "how many rows"; <code>count(col)</code> for "how many have a value"; <code>count(DISTINCT col)</code> for "how many different values". These three are not interchangeable, and picking the wrong one is a classic off-by-a-lot bug in reports.</div>
<div class="note-ct">Every stat on the site's admin dashboard is one of these: total users is <code>count(*)</code>, active-this-week is <code>count(*)</code> with a filter, and "distinct authors who posted" is <code>count(DISTINCT author_id)</code>. Getting <code>count(*)</code> vs <code>count(DISTINCT)</code> confused is exactly how a "we have 10,000 posters" number turns out to mean 10,000 posts by 400 people.</div>
<h3>What an aggregate does to NULL</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">COUNT(*)</span><span class="lz-lnote">Counts <em>rows</em>. Never skips anything, never looks at a value. This is the only count that answers "how many rows are there".</span></div>
<div class="lz-layer"><span class="lz-lname">COUNT(col)</span><span class="lz-lnote">Counts <em>non-NULL values</em> in that column. On a column with 40% NULLs it returns 60% of the row count — and that difference is often the bug.</span></div>
<div class="lz-layer"><span class="lz-lname">SUM / AVG / MIN / MAX</span><span class="lz-lnote">Skip NULLs silently. <code>AVG</code> divides by the count of non-NULL values, not by the row count — so a missing rating does not drag the average down, it is simply absent from it.</span></div>
<div class="lz-layer"><span class="lz-lname">on zero rows</span><span class="lz-lnote"><code>COUNT</code> returns <code>0</code>; every other aggregate returns <code>NULL</code>. That asymmetry is why <code>COALESCE(SUM(x), 0)</code> is such a common wrapper.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — reading <code>AVG</code> as "the average per row".</strong> A product with 100 orders and 30 missing <code>rating</code> values reports <code>AVG(rating)</code> over 70 rows, not 100. The number is correct SQL and wrong business analysis: it silently answers "the average among people who rated" while the dashboard label says "average rating". Decide explicitly which one you mean. If missing should count as zero, write <code>AVG(COALESCE(rating, 0))</code>; if it should be excluded, keep <code>AVG(rating)</code> but show <code>COUNT(rating)</code> next to it so the reader can see the denominator.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: run all five aggregates and watch NULL get skipped</span><span class="lc-sub">The Code Lab track sets up the note table used across this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Gộp nhiều dòng thành một bản tóm tắt</h2>
<p class="lead">Tới giờ mọi truy vấn trả về một dòng ra cho mỗi dòng vào. Hàm tổng hợp làm ngược lại: gấp nhiều dòng thành một giá trị duy nhất — một số đếm, một tổng, một trung bình. Mọi con số dashboard bạn từng thấy đều là một phép tổng hợp. Bài này bàn năm hàm cốt lõi và hành vi NULL âm thầm làm người ta vấp.</p>

<h3>Năm hàm bạn dùng liên tục</h3>
<p>Chạy trên cả bảng <code>note</code> (7 dòng, một dòng views <code>NULL</code>), cả năm cùng lúc:</p>
<pre><code>SELECT count(*)                AS total_notes,
       count(views)            AS notes_with_views,
       count(DISTINCT user_id) AS authors,
       sum(views)              AS total_views,
       round(avg(views),1)     AS avg_views,
       min(views)              AS min_views,
       max(views)              AS max_views
FROM note;</code></pre>
<div class="out"> total_notes | notes_with_views | authors | total_views | avg_views | min_views | max_views
-------------+------------------+---------+-------------+-----------+-----------+-----------
           7 |                6 |       3 |         357 |      59.5 |        12 |       120
(1 row)</div>
<p>Bảy dòng vào thành một dòng tóm tắt. Để ý mỗi cột trả lời một câu hỏi khác nhau — bao nhiêu note, bao nhiêu tác giả khác nhau, tổng và trung bình views, nhỏ nhất và lớn nhất.</p>

<h3>Luật NULL — và COUNT(*) vs COUNT(cột)</h3>
<p>Đây là chi tiết quan trọng: <strong>mọi hàm tổng hợp trừ <code>count(*)</code> đều bỏ qua NULL</strong>. Nhìn các con số trên. Có 7 note, nhưng một cái có <code>views = NULL</code>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">count(*) = 7</span><span class="v">Đếm <em>dòng</em>, kể cả NULL. "Có bao nhiêu note?"</span></div>
  <div class="kv"><span class="k">count(views) = 6</span><span class="v">Đếm <em>giá trị khác NULL</em> của cột đó. "Bao nhiêu note có số views?" Cái NULL bị bỏ qua.</span></div>
  <div class="kv"><span class="k">avg(views) = 59.5</span><span class="v">357 ÷ <strong>6</strong>, không phải ÷ 7 — dòng NULL không được tính vào trung bình. Thường đây là cái bạn muốn, nhưng hãy biết là nó đang xảy ra.</span></div>
  <div class="kv"><span class="k">count(DISTINCT user_id) = 3</span><span class="v">Đếm giá trị <em>khác nhau</em>. Bảy note, nhưng chỉ ba tác giả khác nhau.</span></div>
</div>
<p><code>avg</code> chia cho 6, không phải 7, là cái tinh tế. Nếu bạn thật sự muốn coi views thiếu là không, bạn viết <code>avg(coalesce(views,0))</code> — nhưng mặc định "bỏ qua NULL" đúng nhiều hơn là sai. Luật cần thuộc: <strong><code>count(*)</code> đếm dòng; mọi hàm tổng hợp khác bỏ qua NULL.</strong></p>
<div class="callout ok"><code>count(*)</code> cho "bao nhiêu dòng"; <code>count(cột)</code> cho "bao nhiêu cái có giá trị"; <code>count(DISTINCT cột)</code> cho "bao nhiêu giá trị khác nhau". Ba cái này không thay thế cho nhau, và chọn nhầm là một bug lệch-rất-xa kinh điển trong báo cáo.</div>
<div class="note-ct">Mọi số liệu trên dashboard admin của trang này là một trong số này: tổng user là <code>count(*)</code>, hoạt-động-tuần-này là <code>count(*)</code> có bộ lọc, và "số tác giả khác nhau đã đăng" là <code>count(DISTINCT author_id)</code>. Lẫn lộn <code>count(*)</code> với <code>count(DISTINCT)</code> đúng là cách một con số "ta có 10.000 người đăng" hoá ra nghĩa là 10.000 bài của 400 người.</div>
<h3>Phép tổng hợp làm gì với NULL</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">COUNT(*)</span><span class="lz-lnote">Đếm <em>dòng</em>. Không bỏ qua gì, không nhìn giá trị nào. Đây là phép đếm DUY NHẤT trả lời "có bao nhiêu dòng".</span></div>
<div class="lz-layer"><span class="lz-lname">COUNT(col)</span><span class="lz-lnote">Đếm <em>giá trị KHÁC NULL</em> trong cột đó. Trên một cột có 40% NULL, nó trả về 60% số dòng — và chênh lệch ấy thường chính là con bug.</span></div>
<div class="lz-layer"><span class="lz-lname">SUM / AVG / MIN / MAX</span><span class="lz-lnote">Bỏ qua NULL trong im lặng. <code>AVG</code> chia cho SỐ GIÁ TRỊ khác NULL, không chia cho số dòng — nên một đánh giá thiếu không kéo trung bình xuống, nó chỉ đơn giản không có mặt trong đó.</span></div>
<div class="lz-layer"><span class="lz-lname">khi không có dòng nào</span><span class="lz-lnote"><code>COUNT</code> trả <code>0</code>; mọi phép tổng hợp khác trả <code>NULL</code>. Chính sự bất đối xứng ấy khiến <code>COALESCE(SUM(x), 0)</code> trở thành lớp bọc quen thuộc.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đọc <code>AVG</code> thành "trung bình trên mỗi dòng".</strong> Một sản phẩm có 100 đơn và 30 giá trị <code>rating</code> bị thiếu sẽ báo <code>AVG(rating)</code> trên 70 dòng, không phải 100. Con số ấy ĐÚNG về SQL và SAI về phân tích kinh doanh: nó âm thầm trả lời "trung bình trong SỐ NGƯỜI CÓ ĐÁNH GIÁ" trong khi nhãn trên dashboard ghi "điểm trung bình". Hãy quyết tường minh bạn muốn cái nào. Nếu thiếu nên tính là 0, viết <code>AVG(COALESCE(rating, 0))</code>; nếu nên loại ra, giữ <code>AVG(rating)</code> nhưng hiện <code>COUNT(rating)</code> ngay cạnh để người đọc thấy MẪU SỐ.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chạy cả năm hàm và xem NULL bị bỏ qua</span><span class="lc-sub">Track Code Lab dựng bảng note dùng xuyên suốt chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — GROUP BY: a summary per group|||6.2 — GROUP BY: một tóm tắt cho mỗi nhóm',
      slug: 'postgresql-6-2-group-by',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tính hàm tổng hợp riêng cho từng nhóm, gom theo nhiều cột, và luật "cột không tổng hợp phải nằm trong GROUP BY".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>One number per category, not one for everything</h2>
<p class="lead">Lesson 6.1 gave a single total for the whole table. Usually you want the total <em>per group</em> — notes per author, revenue per month, users per city. <code>GROUP BY</code> splits the rows into groups and runs the aggregate once per group. It's the workhorse of every report.</p>

<h3>GROUP BY in action</h3>
<p>Add <code>GROUP BY u.name</code> and the aggregates compute separately for each author:</p>
<pre><code>SELECT u.name AS author, count(*) AS notes, sum(n.views) AS total_views
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY u.name
ORDER BY total_views DESC NULLS LAST;</code></pre>
<div class="out"> author | notes | total_views
--------+-------+-------------
 Cuong  |     3 |         210
 Lan    |     2 |         105
 Minh   |     2 |          42
(3 rows)</div>
<p>Instead of one grand total, we get one row per author, each with that author's own count and sum. Group by a different column and you slice the same data another way — here by <code>tag</code>:</p>
<pre><code>SELECT tag, count(*) AS notes, round(avg(views),1) AS avg_views
FROM note GROUP BY tag ORDER BY notes DESC, tag;</code></pre>
<div class="out"> tag  | notes | avg_views
------+-------+-----------
 sql  |     4 |      75.0
 ops  |     2 |      12.0
 date |     1 |      45.0
(3 rows)</div>

<h3>The rule everyone hits: every selected column must be grouped or aggregated</h3>
<p>This error is a rite of passage. Once you <code>GROUP BY</code>, every column in <code>SELECT</code> must <em>either</em> appear in the <code>GROUP BY</code> <em>or</em> be inside an aggregate. Why? A group of many rows has one <code>tag</code> but many different <code>views</code> — so "which views?" has no single answer:</p>
<pre><code>SELECT tag, views FROM note GROUP BY tag;</code></pre>
<div class="out">ERROR:  column "note.views" must appear in the GROUP BY clause or be used in an aggregate function
LINE 1: SELECT tag, views FROM note GROUP BY tag;
                    ^</div>
<p>Postgres refuses to guess. Either group by <code>views</code> too, or wrap it — <code>sum(views)</code>, <code>max(views)</code>, <code>avg(views)</code>. The mental model: <strong>after <code>GROUP BY</code>, each output row <em>is</em> a whole group, so any bare column must be one that's constant across the group.</strong></p>

<h3>Grouping by more than one column</h3>
<p>List several columns and you get one row per <em>combination</em> — city × tag:</p>
<pre><code>SELECT u.city, n.tag, count(*) AS notes
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY u.city, n.tag
ORDER BY u.city, n.tag;</code></pre>
<div class="out">  city  | tag  | notes
--------+------+-------
 Danang | date |     1
 Danang | sql  |     1
 Hanoi  | ops  |     2
 Hanoi  | sql  |     3
(4 rows)</div>
<p>Each distinct (city, tag) pair is its own group. This is how "sales by region and product" or "signups by country and month" reports are built — group by every dimension you want to break the number down by.</p>
<div class="note-ct">The site's analytics runs exactly these queries: posts grouped by day for the activity chart, users grouped by role for the breakdown, reactions grouped by type. Each chart is a <code>GROUP BY</code> over one or two dimensions with a <code>count</code> or <code>sum</code> — the shape you just learned is quite literally what draws those bars.</div>
<h3>The grain rule</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">GROUP BY sets the grain</span><span class="lz-d">One output row per distinct combination of the grouping columns. <code>GROUP BY user_id</code> means one row per user — the individual notes stop existing as rows.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Every selected column must survive the collapse</span><span class="lz-d">A column is legal only if it is grouped by, or wrapped in an aggregate. <code>n.title</code> is neither, and PostgreSQL refuses — because which of the twelve titles would it show?</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The functional-dependency exception</span><span class="lz-d">Group by a primary key and you may select any column of that same table: <code>GROUP BY u.id</code> permits <code>u.name</code>, because one <code>id</code> can only have one name. PostgreSQL knows this; MySQL historically guessed.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">NULL is one group</span><span class="lz-d">All NULL values collapse into a single group, even though <code>NULL = NULL</code> is not true. Grouping uses "not distinct from", not equality.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — adding a column to <code>GROUP BY</code> just to make the error go away.</strong> The error "column must appear in the GROUP BY clause" has two very different fixes, and the easy one is usually wrong. Adding <code>n.title</code> to the grouping does silence it — by changing the grain to one row per (user, title), which is no longer "per user" at all, and your counts quietly become 1. Read the error as a question: <em>at what grain do I actually want one row?</em> If the answer is per user, the title does not belong in the output; use an aggregate such as <code>string_agg(n.title, ', ')</code> or <code>max(n.title)</code> and say what you mean.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: group by author, by tag, and by two columns</span><span class="lc-sub">The Code Lab track includes the "must appear in GROUP BY" error to feel it.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Một con số cho mỗi hạng mục, không phải một cho tất cả</h2>
<p class="lead">Bài 6.1 cho một tổng duy nhất cho cả bảng. Thường bạn muốn tổng <em>cho mỗi nhóm</em> — note mỗi tác giả, doanh thu mỗi tháng, user mỗi thành phố. <code>GROUP BY</code> chia các dòng thành nhóm và chạy hàm tổng hợp một lần cho mỗi nhóm. Nó là con ngựa thồ của mọi báo cáo.</p>

<h3>GROUP BY trong hành động</h3>
<p>Thêm <code>GROUP BY u.name</code> và các hàm tổng hợp tính riêng cho từng tác giả:</p>
<pre><code>SELECT u.name AS author, count(*) AS notes, sum(n.views) AS total_views
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY u.name
ORDER BY total_views DESC NULLS LAST;</code></pre>
<div class="out"> author | notes | total_views
--------+-------+-------------
 Cuong  |     3 |         210
 Lan    |     2 |         105
 Minh   |     2 |          42
(3 rows)</div>
<p>Thay vì một tổng lớn, ta có một dòng cho mỗi tác giả, mỗi dòng kèm số đếm và tổng của riêng tác giả đó. Gom theo một cột khác là bạn cắt lát cùng dữ liệu theo cách khác — ở đây theo <code>tag</code>:</p>
<pre><code>SELECT tag, count(*) AS notes, round(avg(views),1) AS avg_views
FROM note GROUP BY tag ORDER BY notes DESC, tag;</code></pre>
<div class="out"> tag  | notes | avg_views
------+-------+-----------
 sql  |     4 |      75.0
 ops  |     2 |      12.0
 date |     1 |      45.0
(3 rows)</div>

<h3>Luật ai cũng dính: mọi cột được chọn phải được gom hoặc tổng hợp</h3>
<p>Lỗi này là một lễ trưởng thành. Khi đã <code>GROUP BY</code>, mọi cột trong <code>SELECT</code> phải <em>hoặc</em> xuất hiện trong <code>GROUP BY</code> <em>hoặc</em> nằm trong một hàm tổng hợp. Vì sao? Một nhóm nhiều dòng có một <code>tag</code> nhưng nhiều <code>views</code> khác nhau — nên "views nào?" không có câu trả lời duy nhất:</p>
<pre><code>SELECT tag, views FROM note GROUP BY tag;</code></pre>
<div class="out">ERROR:  column "note.views" must appear in the GROUP BY clause or be used in an aggregate function
LINE 1: SELECT tag, views FROM note GROUP BY tag;
                    ^</div>
<p>Postgres từ chối đoán. Hoặc gom theo cả <code>views</code>, hoặc bọc nó — <code>sum(views)</code>, <code>max(views)</code>, <code>avg(views)</code>. Mô hình tư duy: <strong>sau <code>GROUP BY</code>, mỗi dòng ra <em>chính là</em> cả một nhóm, nên bất kỳ cột trần nào phải là cột không đổi trong cả nhóm.</strong></p>

<h3>Gom theo nhiều hơn một cột</h3>
<p>Liệt kê vài cột là bạn có một dòng cho mỗi <em>tổ hợp</em> — thành phố × tag:</p>
<pre><code>SELECT u.city, n.tag, count(*) AS notes
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY u.city, n.tag
ORDER BY u.city, n.tag;</code></pre>
<div class="out">  city  | tag  | notes
--------+------+-------
 Danang | date |     1
 Danang | sql  |     1
 Hanoi  | ops  |     2
 Hanoi  | sql  |     3
(4 rows)</div>
<p>Mỗi cặp (city, tag) khác nhau là một nhóm riêng. Đây là cách các báo cáo "doanh số theo vùng và sản phẩm" hay "đăng ký theo quốc gia và tháng" được dựng — gom theo mọi chiều bạn muốn tách nhỏ con số.</p>
<div class="note-ct">Phần phân tích của trang này chạy đúng các truy vấn này: bài đăng gom theo ngày cho biểu đồ hoạt động, user gom theo vai trò cho bảng phân tích, cảm xúc gom theo loại. Mỗi biểu đồ là một <code>GROUP BY</code> trên một hai chiều với một <code>count</code> hay <code>sum</code> — hình bạn vừa học đúng nghĩa đen là thứ vẽ nên các cột đó.</div>
<h3>Luật về ĐỘ MỊN</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">GROUP BY đặt ra độ mịn</span><span class="lz-d">Một dòng ra cho mỗi tổ hợp khác nhau của các cột gom nhóm. <code>GROUP BY user_id</code> nghĩa là một dòng mỗi user — từng note không còn tồn tại dưới dạng dòng nữa.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mọi cột được chọn phải SỐNG SÓT qua cú gom</span><span class="lz-d">Một cột chỉ hợp lệ khi nó được gom theo, hoặc được bọc trong một phép tổng hợp. <code>n.title</code> không thuộc cái nào, và PostgreSQL từ chối — vì trong mười hai cái title, nó biết hiện cái nào?</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ngoại lệ phụ thuộc hàm</span><span class="lz-d">Gom theo khoá chính thì bạn được chọn bất kỳ cột nào CỦA CHÍNH bảng đó: <code>GROUP BY u.id</code> cho phép <code>u.name</code>, vì một <code>id</code> chỉ có thể có một tên. PostgreSQL biết điều này; MySQL ngày xưa thì ĐOÁN.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">NULL là MỘT nhóm</span><span class="lz-d">Mọi giá trị NULL gộp thành đúng một nhóm, dù <code>NULL = NULL</code> không đúng. Gom nhóm dùng "không khác biệt với", không dùng phép bằng.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — thêm một cột vào <code>GROUP BY</code> chỉ để cho hết báo lỗi.</strong> Lỗi "column must appear in the GROUP BY clause" có HAI cách chữa rất khác nhau, và cách dễ thường là cách sai. Thêm <code>n.title</code> vào nhóm đúng là làm nó im — bằng cách ĐỔI ĐỘ MỊN thành một dòng mỗi (user, title), thứ không còn là "mỗi user" nữa, và các con đếm của bạn lặng lẽ thành 1. Hãy đọc lỗi ấy như một CÂU HỎI: <em>tôi thật sự muốn một dòng ở độ mịn nào?</em> Nếu câu trả lời là mỗi user, thì title không thuộc về đầu ra; dùng một phép tổng hợp như <code>string_agg(n.title, ', ')</code> hoặc <code>max(n.title)</code> và nói đúng ý mình.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: gom theo tác giả, theo tag, và theo hai cột</span><span class="lc-sub">Track Code Lab gồm lỗi "phải nằm trong GROUP BY" để bạn cảm nhận.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — HAVING vs WHERE, and FILTER|||6.3 — HAVING vs WHERE, và FILTER',
      slug: 'postgresql-6-3-having-filter',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lọc dòng trước khi gom (WHERE) vs lọc nhóm sau khi gom (HAVING), thứ tự thực thi các mệnh đề, và FILTER cho tổng hợp có điều kiện.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Filtering before vs after grouping</h2>
<p class="lead">Two filters, two moments. <code>WHERE</code> removes <em>rows</em> before they're grouped; <code>HAVING</code> removes <em>groups</em> after the aggregate is computed. Mixing them up gives wrong results or errors. Then <code>FILTER</code> lets one query compute several conditional totals at once — the trick behind compact dashboards.</p>

<h3>HAVING — a WHERE for groups</h3>
<p>You can't filter on an aggregate in <code>WHERE</code> (the aggregate doesn't exist yet at that stage). <code>HAVING</code> runs <em>after</em> grouping, so it can. "Authors with at least 3 notes":</p>
<pre><code>SELECT u.name AS author, count(*) AS notes
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY u.name
HAVING count(*) &gt;= 3
ORDER BY notes DESC;</code></pre>
<div class="out"> author | notes
--------+-------
 Cuong  |     3
(1 row)</div>
<p>Only Cuong survives the <code>HAVING count(*) &gt;= 3</code>. The other authors were grouped, counted, and then their groups were discarded because the count was too low.</p>

<h3>The order the clauses actually run</h3>
<p>SQL is written <code>SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY</code>, but it <em>executes</em> in a different order — and knowing it explains everything about where each filter goes:</p>
<div class="lz-flow">
  <div class="lz-step"><strong>FROM / JOIN</strong><span>assemble the rows</span></div>
  <div class="lz-step"><strong>WHERE</strong><span>filter individual rows</span></div>
  <div class="lz-step"><strong>GROUP BY</strong><span>collapse into groups</span></div>
  <div class="lz-step"><strong>HAVING</strong><span>filter the groups</span></div>
  <div class="lz-step"><strong>SELECT</strong><span>compute output columns</span></div>
  <div class="lz-step"><strong>ORDER BY / LIMIT</strong><span>sort &amp; trim</span></div>
</div>
<p>So <code>WHERE</code> filters raw rows (it can't see aggregates), then grouping happens, then <code>HAVING</code> filters the resulting groups (it can see aggregates). Use both together — <code>WHERE</code> to drop rows you never want counted, <code>HAVING</code> to drop groups by their totals:</p>
<pre><code>SELECT tag, count(*) AS notes, sum(views) AS total_views
FROM note
WHERE views IS NOT NULL       <span class="tok-comment">-- drop rows first</span>
GROUP BY tag
HAVING sum(views) &gt; 50         <span class="tok-comment">-- then drop small groups</span>
ORDER BY tag;</code></pre>
<div class="out"> tag | notes | total_views
-----+-------+-------------
 sql |     4 |         300
(1 row)</div>
<p><code>WHERE</code> first removed the NULL-views row; grouping and summing followed; <code>HAVING</code> then kept only groups whose total exceeded 50. Only <code>sql</code> (300) qualified — <code>date</code> (45) and <code>ops</code> (12) fell short.</p>

<h3>FILTER — several conditional totals in one pass</h3>
<p>Often you want a total <em>and</em> a few sub-totals in the same row: total notes, sql notes, pinned notes. Rather than three queries, attach a <code>FILTER (WHERE ...)</code> to each aggregate:</p>
<pre><code>SELECT count(*)                            AS total,
       count(*) FILTER (WHERE tag='sql')   AS sql_notes,
       count(*) FILTER (WHERE pinned)      AS pinned_notes,
       sum(views) FILTER (WHERE tag='sql') AS sql_views
FROM note;</code></pre>
<div class="out"> total | sql_notes | pinned_notes | sql_views
-------+-----------+--------------+-----------
     7 |         4 |            2 |       300
(1 row)</div>
<p>Each aggregate counted only the rows matching its own <code>FILTER</code>, all in a single scan of the table. This is far cleaner (and faster) than running four separate queries, and it's the idiom for a metrics row: total plus several breakdowns side by side.</p>
<div class="callout ok">Remember the split: <strong><code>WHERE</code> filters rows, <code>HAVING</code> filters groups.</strong> If your condition mentions an aggregate (<code>count</code>, <code>sum</code>…), it must go in <code>HAVING</code>. And reach for <code>FILTER</code> whenever you'd otherwise write several near-identical queries that differ only by a condition.</div>
<div class="note-ct">The admin "system stats" panel is one <code>FILTER</code> query: total users, plus users FILTER (WHERE role='ADMIN'), plus active FILTER (WHERE last_seen &gt; …) — all computed in a single pass instead of hammering the database with a dozen counts. It's the difference between one fast query and twelve slow ones behind the same dashboard.</div>
<div class="pitfall"><p><strong>Trap — putting an aggregate condition in <code>WHERE</code>.</strong> <code>WHERE COUNT(*) &gt; 5</code> does not merely fail, it fails with a message that sends people the wrong way: "aggregate functions are not allowed in WHERE". The reason is order, not permission — <code>WHERE</code> runs <em>before</em> rows are grouped, so at that moment no count exists yet. <code>HAVING</code> runs after. The practical rule is worth memorising as a pair: filter individual rows in <code>WHERE</code> (cheaper, because it removes rows before grouping), filter whole groups in <code>HAVING</code>. And when both apply, use both — <code>WHERE created_at &gt;= '2026-01-01' … HAVING COUNT(*) &gt; 5</code> is not redundant, it is the efficient form.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: HAVING, the clause order, and FILTER metrics</span><span class="lc-sub">The Code Lab track builds a one-row dashboard with FILTER.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Lọc trước vs sau khi gom nhóm</h2>
<p class="lead">Hai bộ lọc, hai thời điểm. <code>WHERE</code> gỡ <em>dòng</em> trước khi chúng được gom; <code>HAVING</code> gỡ <em>nhóm</em> sau khi hàm tổng hợp đã tính. Lẫn lộn chúng cho kết quả sai hoặc lỗi. Rồi <code>FILTER</code> cho một truy vấn tính nhiều tổng có điều kiện cùng lúc — mẹo đằng sau các dashboard gọn.</p>

<h3>HAVING — một WHERE cho nhóm</h3>
<p>Bạn không thể lọc theo một hàm tổng hợp trong <code>WHERE</code> (ở giai đoạn đó hàm tổng hợp chưa tồn tại). <code>HAVING</code> chạy <em>sau</em> khi gom, nên nó làm được. "Tác giả có ít nhất 3 note":</p>
<pre><code>SELECT u.name AS author, count(*) AS notes
FROM note n JOIN app_user u ON u.id = n.user_id
GROUP BY u.name
HAVING count(*) &gt;= 3
ORDER BY notes DESC;</code></pre>
<div class="out"> author | notes
--------+-------
 Cuong  |     3
(1 row)</div>
<p>Chỉ Cuong sống sót qua <code>HAVING count(*) &gt;= 3</code>. Các tác giả khác đã được gom, đếm, rồi nhóm của họ bị loại vì số đếm quá thấp.</p>

<h3>Thứ tự các mệnh đề thật sự chạy</h3>
<p>SQL được viết <code>SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY</code>, nhưng nó <em>thực thi</em> theo thứ tự khác — và biết nó giải thích mọi thứ về việc mỗi bộ lọc đặt ở đâu:</p>
<div class="lz-flow">
  <div class="lz-step"><strong>FROM / JOIN</strong><span>ráp các dòng</span></div>
  <div class="lz-step"><strong>WHERE</strong><span>lọc từng dòng</span></div>
  <div class="lz-step"><strong>GROUP BY</strong><span>gộp thành nhóm</span></div>
  <div class="lz-step"><strong>HAVING</strong><span>lọc các nhóm</span></div>
  <div class="lz-step"><strong>SELECT</strong><span>tính cột ra</span></div>
  <div class="lz-step"><strong>ORDER BY / LIMIT</strong><span>sắp &amp; cắt</span></div>
</div>
<p>Nên <code>WHERE</code> lọc dòng thô (nó không thấy hàm tổng hợp), rồi gom xảy ra, rồi <code>HAVING</code> lọc các nhóm kết quả (nó thấy hàm tổng hợp). Dùng cả hai cùng nhau — <code>WHERE</code> để bỏ dòng bạn không bao giờ muốn đếm, <code>HAVING</code> để bỏ nhóm theo tổng của chúng:</p>
<pre><code>SELECT tag, count(*) AS notes, sum(views) AS total_views
FROM note
WHERE views IS NOT NULL       <span class="tok-comment">-- bỏ dòng trước</span>
GROUP BY tag
HAVING sum(views) &gt; 50         <span class="tok-comment">-- rồi bỏ nhóm nhỏ</span>
ORDER BY tag;</code></pre>
<div class="out"> tag | notes | total_views
-----+-------+-------------
 sql |     4 |         300
(1 row)</div>
<p><code>WHERE</code> trước tiên gỡ dòng views-NULL; gom và cộng theo sau; <code>HAVING</code> rồi chỉ giữ các nhóm có tổng vượt 50. Chỉ <code>sql</code> (300) đủ điều kiện — <code>date</code> (45) và <code>ops</code> (12) thiếu.</p>

<h3>FILTER — nhiều tổng có điều kiện trong một lượt</h3>
<p>Thường bạn muốn một tổng <em>và</em> vài tổng con trong cùng một dòng: tổng note, note sql, note ghim. Thay vì ba truy vấn, gắn một <code>FILTER (WHERE ...)</code> vào mỗi hàm tổng hợp:</p>
<pre><code>SELECT count(*)                            AS total,
       count(*) FILTER (WHERE tag='sql')   AS sql_notes,
       count(*) FILTER (WHERE pinned)      AS pinned_notes,
       sum(views) FILTER (WHERE tag='sql') AS sql_views
FROM note;</code></pre>
<div class="out"> total | sql_notes | pinned_notes | sql_views
-------+-----------+--------------+-----------
     7 |         4 |            2 |       300
(1 row)</div>
<p>Mỗi hàm tổng hợp chỉ đếm các dòng khớp <code>FILTER</code> của riêng nó, tất cả trong một lần quét bảng. Cái này gọn hơn nhiều (và nhanh hơn) so với chạy bốn truy vấn riêng, và là thành ngữ cho một dòng số liệu: tổng cộng thêm vài phân tích cạnh nhau.</p>
<div class="callout ok">Nhớ sự phân chia: <strong><code>WHERE</code> lọc dòng, <code>HAVING</code> lọc nhóm.</strong> Nếu điều kiện của bạn nhắc tới một hàm tổng hợp (<code>count</code>, <code>sum</code>…), nó phải vào <code>HAVING</code>. Và vươn tới <code>FILTER</code> mỗi khi bạn định viết vài truy vấn gần-giống-hệt chỉ khác nhau một điều kiện.</div>
<div class="note-ct">Panel "thống kê hệ thống" của admin là một truy vấn <code>FILTER</code>: tổng user, cộng user FILTER (WHERE role='ADMIN'), cộng active FILTER (WHERE last_seen &gt; …) — tất cả tính trong một lượt thay vì nện cơ sở dữ liệu bằng cả tá phép đếm. Đó là khác biệt giữa một truy vấn nhanh và mười hai truy vấn chậm sau cùng một dashboard.</div>
<div class="pitfall"><p><strong>Bẫy — đặt điều kiện tổng hợp vào <code>WHERE</code>.</strong> <code>WHERE COUNT(*) &gt; 5</code> không chỉ hỏng, nó hỏng kèm một thông báo đẩy người ta đi sai đường: "aggregate functions are not allowed in WHERE". Lý do là THỨ TỰ, không phải quyền — <code>WHERE</code> chạy TRƯỚC khi các dòng được gom nhóm, nên ở thời điểm ấy chưa hề có con đếm nào. <code>HAVING</code> chạy SAU. Luật thực dụng đáng nhớ theo cặp: lọc TỪNG DÒNG ở <code>WHERE</code> (rẻ hơn, vì nó bỏ dòng đi trước khi gom), lọc CẢ NHÓM ở <code>HAVING</code>. Và khi cả hai cùng áp, hãy dùng cả hai — <code>WHERE created_at &gt;= '2026-01-01' … HAVING COUNT(*) &gt; 5</code> không thừa, đó mới là dạng hiệu quả.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: HAVING, thứ tự mệnh đề, và số liệu FILTER</span><span class="lc-sub">Track Code Lab dựng một dashboard một-dòng bằng FILTER.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Aggregating over joins: taming fan-out|||6.4 — Tổng hợp trên JOIN: thuần hoá fan-out',
      slug: 'postgresql-6-4-tong-hop-tren-join',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao count(*) trên một join một-nhiều đếm sai, cách sửa bằng COUNT(DISTINCT), và LEFT JOIN + count(cột) để đếm cả số 0.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>The join-plus-aggregate bug — and how to fix it</h2>
<p class="lead">Chapter 5 warned that joining across a one-to-many relationship multiplies rows (fan-out). Now that you're aggregating, that multiplication becomes wrong <em>numbers</em> — inflated counts and sums that look plausible and are simply false. This lesson shows the bug happening and the two tools that fix it.</p>

<h3>The bug: counting over a fan-out join</h3>
<p>"How many notes does each author have?" — tempting to join notes to their comments and <code>count(*)</code>. But that counts note-comment <em>pairs</em>, not notes:</p>
<pre><code>SELECT u.name, count(*) AS wrong_count
FROM app_user u
JOIN note n    ON n.user_id = u.id
JOIN comment c ON c.note_id = n.id
GROUP BY u.name ORDER BY u.name;</code></pre>
<div class="out"> name  | wrong_count
-------+-------------
 Cuong |           3
 Lan   |           1
(2 rows)</div>
<p>Two things went wrong. Cuong's "3" is really his <em>comment</em> count (one note of his got 3 comments), not his note count. And <strong>Minh disappeared entirely</strong> — his notes have no comments, so the INNER JOIN to <code>comment</code> dropped them, and with them the whole author. A number that's both inflated <em>and</em> missing rows is the signature of an un-tamed fan-out.</p>

<h3>Fix 1: COUNT(DISTINCT) + LEFT JOIN</h3>
<p>Count <em>distinct notes</em> so duplicates from the fan-out collapse, and use <code>LEFT JOIN</code> so authors whose notes have no comments still appear:</p>
<pre><code>SELECT u.name,
       count(DISTINCT n.id) AS notes,
       count(c.id)          AS comments
FROM app_user u
JOIN note n     ON n.user_id = u.id
LEFT JOIN comment c ON c.note_id = n.id
GROUP BY u.name ORDER BY u.name;</code></pre>
<div class="out"> name  | notes | comments
-------+-------+----------
 Cuong |     3 |        3
 Lan   |     2 |        1
 Minh  |     2 |        0
(3 rows)</div>
<p>Now the numbers are true: Cuong has 3 notes and 3 comments, Minh has 2 notes and 0 comments (and he's back). <code>count(DISTINCT n.id)</code> ignored the fan-out duplication; <code>count(c.id)</code> counted only real comments (skipping the NULLs the LEFT JOIN produced for Minh). For sums, the equivalent fix is to aggregate <em>before</em> joining — a subquery in Chapter 7 — so each note's views are added once, not once per comment.</p>

<h3>Fix 2: count(col), not count(*), when a LEFT JOIN can produce NULLs</h3>
<p>One more subtlety. To count notes per user <em>including</em> users with zero, a LEFT JOIN is right — but <code>count(*)</code> would count the placeholder row and report 1 for a user with no notes. <code>count(n.id)</code> counts only real notes:</p>
<pre><code>SELECT u.name, count(n.id) AS notes, count(*) AS rows_star
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
GROUP BY u.name ORDER BY notes DESC, u.name;</code></pre>
<div class="out"> name  | notes | rows_star
-------+-------+-----------
 Cuong |     3 |         3
 Lan   |     2 |         2
 Minh  |     2 |         2
 Ngoc  |     0 |         1
(4 rows)</div>
<p>Look at Ngoc: <code>count(n.id)</code> correctly says <strong>0</strong> notes, but <code>count(*)</code> says <strong>1</strong> — because the LEFT JOIN gave her one all-NULL note row, and <code>count(*)</code> counts rows regardless. This is the exact case where <code>count(*)</code> and <code>count(col)</code> diverge, and getting it wrong turns "users with no notes" into "users with one note".</p>
<div class="callout danger">Two habits that prevent most report bugs: when a query <code>JOIN</code>s across a one-to-many and then aggregates, use <strong><code>count(DISTINCT ...)</code></strong> (or pre-aggregate in a subquery) so fan-out doesn't inflate. And after a <strong><code>LEFT JOIN</code></strong>, count a real column (<code>count(n.id)</code>), never <code>count(*)</code>, or the unmatched rows count as one instead of zero.</div>
<div class="note-ct">This is the fan-out from Chapter 5, now with numbers attached. A "posts and their like counts" panel on the site must <code>count(DISTINCT post.id)</code> when it also joins comments, or every post with 10 comments reports 10× its real like total. And the "all users with their post count (including new users at 0)" list is precisely the <code>LEFT JOIN</code> + <code>count(post.id)</code> pattern above — <code>count(*)</code> there would show every brand-new user as having written one post.</div>
<h3>Two orders of operations, two different numbers</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Join then aggregate</span><span class="lz-nsub">the shape that inflates</span></span>
<span class="lz-nbody">The join multiplies rows first, so any <code>SUM</code> of a one-side column is counted once per many-side row. Correct for <code>SUM(item.price)</code>; wrong for <code>SUM(order.total)</code>. The two live in the same query and only one of them is safe.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Aggregate then join</span><span class="lz-nsub">the shape that stays honest</span></span>
<span class="lz-nbody">Collapse the many-side to one row per key in a subquery, then join that. The one-side is never duplicated, so both sums are correct. Costs one extra scan and buys you a number you can defend.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">The tell</span><span class="lz-nsub">count before you sum</span></span>
<span class="lz-nbody">Add <code>COUNT(*)</code> beside your <code>SUM</code>. If it is larger than the number of orders you expect, the grain is wrong and every aggregate in that query is suspect — not just the one you noticed.</span>
</div>
</div>
<div class="pitfall"><p><strong>Trap — <code>COUNT(DISTINCT …)</code> as a patch for a fan-out.</strong> It does produce the right number, which is exactly why it is dangerous: it fixes the symptom you looked at and leaves every other aggregate in the query still inflated. A query with <code>COUNT(DISTINCT o.id)</code> next to a plain <code>SUM(o.total)</code> is reporting a correct order count beside a wrong revenue figure, and nothing marks the second one as suspect. Treat a needed <code>DISTINCT</code> as a signal that the grain is wrong, and fix the grain — aggregate the many-side first. Keep <code>DISTINCT</code> for the cases where duplicates are genuinely in the data, not created by your own join.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next chapter: subqueries & CTEs</span><span class="lc-sub">To pre-aggregate before joining — and write queries in readable steps.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Bug join-cộng-tổng-hợp — và cách sửa</h2>
<p class="lead">Chương 5 cảnh báo join qua một quan hệ một-nhiều nhân dòng (fan-out). Giờ khi bạn tổng hợp, phép nhân đó thành <em>con số</em> sai — số đếm và tổng phồng lên trông có vẻ hợp lý mà đơn giản là sai. Bài này cho thấy bug xảy ra và hai công cụ sửa nó.</p>

<h3>Bug: đếm trên một join fan-out</h3>
<p>"Mỗi tác giả có bao nhiêu note?" — dễ bị cám dỗ join note với bình luận của chúng rồi <code>count(*)</code>. Nhưng cái đó đếm <em>cặp</em> note-bình-luận, không phải note:</p>
<pre><code>SELECT u.name, count(*) AS wrong_count
FROM app_user u
JOIN note n    ON n.user_id = u.id
JOIN comment c ON c.note_id = n.id
GROUP BY u.name ORDER BY u.name;</code></pre>
<div class="out"> name  | wrong_count
-------+-------------
 Cuong |           3
 Lan   |           1
(2 rows)</div>
<p>Hai thứ sai. Số "3" của Cuong thật ra là số <em>bình luận</em> của anh ấy (một note của anh nhận 3 bình luận), không phải số note. Và <strong>Minh biến mất hoàn toàn</strong> — các note của anh không có bình luận, nên INNER JOIN sang <code>comment</code> rớt chúng, và rớt luôn cả tác giả. Một con số vừa phồng <em>vừa</em> thiếu dòng là dấu hiệu của một fan-out chưa thuần.</p>

<h3>Sửa 1: COUNT(DISTINCT) + LEFT JOIN</h3>
<p>Đếm <em>note khác nhau</em> để các bản trùng từ fan-out gộp lại, và dùng <code>LEFT JOIN</code> để các tác giả có note không bình luận vẫn xuất hiện:</p>
<pre><code>SELECT u.name,
       count(DISTINCT n.id) AS notes,
       count(c.id)          AS comments
FROM app_user u
JOIN note n     ON n.user_id = u.id
LEFT JOIN comment c ON c.note_id = n.id
GROUP BY u.name ORDER BY u.name;</code></pre>
<div class="out"> name  | notes | comments
-------+-------+----------
 Cuong |     3 |        3
 Lan   |     2 |        1
 Minh  |     2 |        0
(3 rows)</div>
<p>Giờ các con số đúng: Cuong có 3 note và 3 bình luận, Minh có 2 note và 0 bình luận (và anh ấy trở lại). <code>count(DISTINCT n.id)</code> bỏ qua bản trùng do fan-out; <code>count(c.id)</code> chỉ đếm bình luận thật (bỏ các NULL mà LEFT JOIN tạo cho Minh). Với tổng (sum), cách sửa tương đương là tổng hợp <em>trước</em> khi join — một truy vấn con ở Chương 7 — để views của mỗi note được cộng một lần, không phải một lần mỗi bình luận.</p>

<h3>Sửa 2: count(cột), không phải count(*), khi một LEFT JOIN có thể sinh NULL</h3>
<p>Thêm một điểm tinh tế. Để đếm note mỗi user <em>kể cả</em> user bằng không, một LEFT JOIN là đúng — nhưng <code>count(*)</code> sẽ đếm dòng giữ chỗ và báo 1 cho một user không có note. <code>count(n.id)</code> chỉ đếm note thật:</p>
<pre><code>SELECT u.name, count(n.id) AS notes, count(*) AS rows_star
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
GROUP BY u.name ORDER BY notes DESC, u.name;</code></pre>
<div class="out"> name  | notes | rows_star
-------+-------+-----------
 Cuong |     3 |         3
 Lan   |     2 |         2
 Minh  |     2 |         2
 Ngoc  |     0 |         1
(4 rows)</div>
<p>Nhìn Ngoc: <code>count(n.id)</code> nói đúng <strong>0</strong> note, nhưng <code>count(*)</code> nói <strong>1</strong> — vì LEFT JOIN cho cô ấy một dòng note toàn NULL, và <code>count(*)</code> đếm dòng bất kể. Đây đúng là trường hợp <code>count(*)</code> và <code>count(cột)</code> khác nhau, và làm sai biến "user không có note" thành "user có một note".</p>
<div class="callout danger">Hai thói quen ngăn đa số bug báo cáo: khi một truy vấn <code>JOIN</code> qua một-nhiều rồi tổng hợp, dùng <strong><code>count(DISTINCT ...)</code></strong> (hoặc tổng hợp trước trong một truy vấn con) để fan-out không phồng số. Và sau một <strong><code>LEFT JOIN</code></strong>, hãy đếm một cột thật (<code>count(n.id)</code>), không bao giờ <code>count(*)</code>, nếu không các dòng không khớp bị tính là một thay vì không.</div>
<div class="note-ct">Đây là fan-out từ Chương 5, giờ gắn con số vào. Một panel "bài đăng và số like của chúng" trên trang phải <code>count(DISTINCT post.id)</code> khi nó cũng join bình luận, nếu không mỗi bài có 10 bình luận báo gấp 10 lần tổng like thật. Và danh sách "mọi user kèm số bài (gồm cả user mới ở 0)" chính là mẫu <code>LEFT JOIN</code> + <code>count(post.id)</code> ở trên — <code>count(*)</code> ở đó sẽ hiện mọi user mới toanh như đã viết một bài.</div>
<h3>Hai thứ tự thao tác, hai con số khác nhau</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Join rồi tổng hợp</span><span class="lz-nsub">hình dạng làm phồng số</span></span>
<span class="lz-nbody">Cú join nhân dòng lên trước, nên mọi <code>SUM</code> của một cột phía MỘT bị đếm một lần cho mỗi dòng phía NHIỀU. Đúng với <code>SUM(item.price)</code>; SAI với <code>SUM(order.total)</code>. Hai cái nằm trong CÙNG một truy vấn và chỉ một cái an toàn.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Tổng hợp rồi join</span><span class="lz-nsub">hình dạng giữ được sự trung thực</span></span>
<span class="lz-nbody">Gom phía NHIỀU về một dòng mỗi khoá trong một subquery, rồi join cái đó. Phía MỘT không bao giờ bị nhân bản, nên cả hai con tổng đều đúng. Trả giá thêm một lượt quét và đổi lấy một con số bạn bảo vệ được.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Dấu hiệu</span><span class="lz-nsub">đếm trước khi cộng</span></span>
<span class="lz-nbody">Thêm <code>COUNT(*)</code> cạnh <code>SUM</code>. Nếu nó lớn hơn số đơn hàng bạn trông đợi thì độ mịn đã sai, và MỌI phép tổng hợp trong truy vấn ấy đều đáng ngờ — không riêng cái bạn vừa để ý.</span>
</div>
</div>
<div class="pitfall"><p><strong>Bẫy — dùng <code>COUNT(DISTINCT …)</code> như miếng vá cho fan-out.</strong> Nó ĐÚNG là ra con số đúng, và chính vì thế mà nó nguy hiểm: nó chữa cái triệu chứng bạn vừa nhìn thấy và để nguyên mọi phép tổng hợp khác trong truy vấn vẫn đang phồng. Một truy vấn có <code>COUNT(DISTINCT o.id)</code> nằm cạnh một <code>SUM(o.total)</code> trần đang báo một con đếm đơn hàng ĐÚNG bên cạnh một con doanh thu SAI, và không có gì đánh dấu cái thứ hai là đáng ngờ. Hãy coi việc PHẢI dùng <code>DISTINCT</code> là tín hiệu độ mịn đã sai, rồi chữa độ mịn — tổng hợp phía NHIỀU trước. Giữ <code>DISTINCT</code> cho những trường hợp bản trùng nằm thật trong dữ liệu, chứ không phải do chính cú join của bạn tạo ra.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Chương tới: truy vấn con & CTE</span><span class="lc-sub">Để tổng hợp trước khi join — và viết truy vấn thành các bước dễ đọc.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.5 Quiz ─────────────────────────── */
    {
      title: '6.5 — Chapter 6 quiz|||6.5 — Kiểm tra Chương 6',
      slug: 'postgresql-6-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về hàm tổng hợp & NULL, GROUP BY và luật của nó, HAVING vs WHERE, FILTER, và fan-out khi tổng hợp trên join.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on aggregation and grouping. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: HAVING vs WHERE (6.3) and taming fan-out with COUNT(DISTINCT) (6.4). Both produce plausible-but-wrong numbers when misused.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về tổng hợp và gom nhóm. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: HAVING vs WHERE (6.3) và thuần fan-out bằng COUNT(DISTINCT) (6.4). Cả hai cho ra số hợp-lý-nhưng-sai khi dùng nhầm.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Over a 7-row table where one row has views = NULL, what is count(*) vs count(views)?|||Trên một bảng 7 dòng mà một dòng có views = NULL, count(*) vs count(views) là?',
            options: [
              'Both 7|||Cả hai đều 7',
              'count(*) = 7, count(views) = 6 (aggregates skip NULL)|||count(*) = 7, count(views) = 6 (hàm tổng hợp bỏ qua NULL)',
              'Both 6|||Cả hai đều 6',
              'count(*) = 6, count(views) = 7|||count(*) = 6, count(views) = 7',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'avg(views) over those 7 rows (one NULL) divides the sum by?|||avg(views) trên 7 dòng đó (một NULL) chia tổng cho?',
            options: [
              '7 (all rows)|||7 (mọi dòng)',
              '6 (only non-NULL values are averaged)|||6 (chỉ giá trị khác NULL được tính trung bình)',
              '5|||5',
              'It errors on NULL|||Nó lỗi vì NULL',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With GROUP BY tag, why does SELECT tag, views ... error?|||Với GROUP BY tag, vì sao SELECT tag, views ... lỗi?',
            options: [
              'views is a reserved word|||views là từ khoá',
              'A non-aggregated column must appear in GROUP BY or be inside an aggregate|||Một cột không tổng hợp phải nằm trong GROUP BY hoặc trong một hàm tổng hợp',
              'You cannot select two columns|||Không thể chọn hai cột',
              'tag must be aggregated|||tag phải được tổng hợp',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'To keep only groups whose count(*) >= 3, use?|||Để chỉ giữ các nhóm có count(*) >= 3, dùng?',
            options: [
              'WHERE count(*) >= 3|||WHERE count(*) >= 3',
              'HAVING count(*) >= 3|||HAVING count(*) >= 3',
              'ORDER BY count(*)|||ORDER BY count(*)',
              'FILTER (WHERE count(*) >= 3)|||FILTER (WHERE count(*) >= 3)',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The difference between WHERE and HAVING is?|||Khác biệt giữa WHERE và HAVING là?',
            options: [
              'They are identical|||Chúng giống hệt nhau',
              'WHERE filters rows before grouping; HAVING filters groups after aggregation|||WHERE lọc dòng trước khi gom; HAVING lọc nhóm sau khi tổng hợp',
              'HAVING runs before WHERE|||HAVING chạy trước WHERE',
              'WHERE only works without GROUP BY|||WHERE chỉ chạy khi không có GROUP BY',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'count(*) FILTER (WHERE tag=\'sql\') does what?|||count(*) FILTER (WHERE tag=\'sql\') làm gì?',
            options: [
              'Filters the whole query to sql rows|||Lọc cả truy vấn về các dòng sql',
              'Counts only the rows matching that condition, within the same query|||Chỉ đếm các dòng khớp điều kiện đó, trong cùng truy vấn',
              'Raises an error|||Báo lỗi',
              'Groups by tag|||Gom theo tag',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Joining notes to their comments then count(*) per author gives the wrong note count because?|||Join note với bình luận của chúng rồi count(*) mỗi tác giả cho số note sai vì?',
            options: [
              'count(*) is broken|||count(*) bị hỏng',
              'Fan-out: each note repeats once per comment, so you count note-comment pairs; use count(DISTINCT note.id)|||Fan-out: mỗi note lặp một lần mỗi bình luận, nên bạn đếm cặp note-bình-luận; dùng count(DISTINCT note.id)',
              'GROUP BY is not allowed with JOIN|||GROUP BY không được dùng với JOIN',
              'Comments cannot be joined|||Không thể join bình luận',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After a LEFT JOIN, to count real matches (0 for unmatched users), use?|||Sau một LEFT JOIN, để đếm số khớp thật (0 cho user không khớp), dùng?',
            options: [
              'count(*) — it gives 0 for unmatched|||count(*) — nó cho 0 khi không khớp',
              'count(child.id) — count(*) would count the NULL placeholder row as 1|||count(child.id) — count(*) sẽ đếm dòng NULL giữ chỗ là 1',
              'sum(*)|||sum(*)',
              'count(DISTINCT *)|||count(DISTINCT *)',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
