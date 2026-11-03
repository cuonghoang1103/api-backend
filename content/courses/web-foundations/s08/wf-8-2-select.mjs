/**
 * Bài 8.2 — SELECT (nâng cấp 02/11/2026). Output thật: _demo/_t8/chay.sh (sqlite3 3.54 trên blog.sql: WHERE/AND/OR/LIKE/IN,
 * ORDER BY/LIMIT/OFFSET, bẫy "= NULL" trả 0 dòng, count/sum/avg/GROUP BY/HAVING; 300 000 dòng: SCAN ~22 ms → SEARCH qua chỉ mục ~6 ms).
 * Deck: scripts/slides-src/wf-8-2.mjs (9 slide, WF/v1/wf-8-2). Code Lab: wf-8-2-select.
 */
import { walkWf, ra, nguon, lienKet } from '../_slides.mjs';
import { OUT } from '../_ma.mjs';


const G = walkWf('wf-8-2', 'SELECT', 'SELECT', [
  [1, 'SELECT',
    '<p>Every screen that shows data starts with a SELECT: the feed, the search results, the profile page. This lesson builds SELECT one clause at a time on the chapter\'s blog database, with the real output after each step, and ends with the one change that makes a slow query fast.</p>',
    '<p>Mọi màn hình hiển thị dữ liệu đều bắt đầu bằng một SELECT: bảng tin, kết quả tìm kiếm, trang hồ sơ. Bài này dựng SELECT từng mệnh đề một trên CSDL blog của chương, có output thật sau mỗi bước, và kết thúc bằng một thay đổi biến truy vấn chậm thành nhanh.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to choose columns and filter rows, combine conditions, sort and page results, avoid the NULL trap that silently returns nothing, summarise data with COUNT, SUM, AVG and GROUP BY, and read a query plan to see whether an index is used.</p>',
    '<p>Bạn sẽ chọn được cột và lọc dòng, kết hợp điều kiện, sắp xếp và chia trang kết quả, tránh bẫy NULL lặng lẽ trả về không gì cả, tóm tắt dữ liệu bằng COUNT, SUM, AVG và GROUP BY, và đọc kế hoạch truy vấn để xem chỉ mục có được dùng không.</p>'],
  [3, 'Columns and rows',
    '<p>SELECT names the columns, FROM names the table, WHERE keeps only rows that match. Conditions combine with AND and OR, LIKE matches patterns with percent signs, and IN tests a list. Here: published posts with at least eighty views, then anything about SQL or by users two and three.</p>',
    '<p>SELECT gọi tên các cột, FROM gọi tên bảng, WHERE chỉ giữ dòng khớp. Điều kiện kết hợp bằng AND và OR, LIKE khớp mẫu với dấu phần trăm, và IN kiểm một danh sách. Ở đây: bài đã đăng có ít nhất tám mươi lượt xem, rồi mọi bài về SQL hoặc của người dùng hai và ba.</p>'],
  [4, 'Sort and page',
    '<p>ORDER BY sorts, DESC means largest first, and LIMIT keeps the first rows. "Top two published posts" is filter, sort, cut. OFFSET skips rows, which turns Lesson 6.5\'s page and limit into SQL: page two of size two skips two rows.</p>',
    '<p>ORDER BY sắp xếp, DESC nghĩa là lớn nhất trước, và LIMIT giữ các dòng đầu. "Hai bài đã đăng hàng đầu" là lọc, sắp, cắt. OFFSET bỏ qua dòng, biến page và limit của Bài 6.5 thành SQL: trang hai cỡ hai bỏ qua hai dòng.</p>'],
  [5, 'The NULL trap',
    '<p>NULL means "unknown", and comparing anything with unknown gives unknown, never true. So "user_id equals NULL" matched zero rows, even though one post has no author. The correct test is IS NULL. COUNT of a column also skips NULLs.</p>',
    '<p>NULL nghĩa là "chưa biết", và so bất cứ thứ gì với chưa biết cũng ra chưa biết, không bao giờ ra đúng. Vì vậy "user_id bằng NULL" khớp không dòng nào, dù có một bài không có tác giả. Phép kiểm đúng là IS NULL. COUNT trên một cột cũng bỏ qua NULL.</p>'],
  [6, 'Summaries',
    '<p>Aggregate functions turn many rows into one: four published posts, five hundred forty-five views, about one hundred thirty-six on average. GROUP BY makes one summary per group, such as per author, and HAVING filters the groups after they are counted.</p>',
    '<p>Hàm tổng hợp biến nhiều dòng thành một: bốn bài đã đăng, năm trăm bốn mươi lăm lượt xem, trung bình khoảng một trăm ba mươi sáu. GROUP BY tạo một bản tóm tắt cho mỗi nhóm, ví dụ mỗi tác giả, và HAVING lọc các nhóm sau khi đã đếm.</p>'],
  [7, 'The order SQL runs in',
    '<p>SQL is written SELECT first, but runs FROM, then WHERE, then GROUP BY and HAVING, then SELECT, then ORDER BY and LIMIT. That explains why WHERE cannot use COUNT and why "newest ten" needs both ORDER BY and LIMIT.</p>',
    '<p>SQL viết SELECT trước, nhưng chạy FROM, rồi WHERE, rồi GROUP BY và HAVING, rồi SELECT, rồi ORDER BY và LIMIT. Điều đó giải thích vì sao WHERE không dùng được COUNT và vì sao "mười bài mới nhất" cần cả ORDER BY lẫn LIMIT.</p>'],
  [8, 'An index, measured',
    '<p>On three hundred thousand rows, finding one user\'s events meant scanning the whole table: about twenty-two milliseconds per query. After CREATE INDEX, the plan changed from SCAN to SEARCH using the index, and the same query took about six milliseconds, most of it starting the sqlite3 program.</p>',
    '<p>Trên ba trăm nghìn dòng, tìm sự kiện của một người dùng nghĩa là quét cả bảng: khoảng hai mươi hai mili giây mỗi truy vấn. Sau CREATE INDEX, kế hoạch đổi từ SCAN sang SEARCH dùng chỉ mục, và cùng truy vấn mất khoảng sáu mili giây, phần lớn là thời gian khởi động chương trình sqlite3.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to write eight SELECTs for questions about the blog, from "unpublished posts" to "authors with more than one post", and to add an index to a large table yourself. "Done when" checks each answer against the expected rows.</p>',
    '<p>Bài luyện yêu cầu bạn viết tám câu SELECT cho các câu hỏi về blog, từ "bài chưa đăng" tới "tác giả có hơn một bài", và tự thêm chỉ mục cho một bảng lớn. "Xong khi" kiểm từng câu trả lời với các dòng mong đợi.</p>'],
]);

export default {
  title: '8.2 — SELECT: asking the database questions|||8.2 — SELECT: đặt câu hỏi cho cơ sở dữ liệu',
  slug: 'wf-8-2-select',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/9ylj9NR0Lcg', durationSeconds: 0 },
  description: 'SELECT trên CSDL blog thật (sqlite3): chọn cột, WHERE với AND/OR/LIKE/IN, ORDER BY/LIMIT/OFFSET = phân trang của Bài 6.5, bẫy "= NULL" trả 0 dòng (IS NULL đúng, count(cột) bỏ NULL), count/sum/avg/GROUP BY/HAVING, thứ tự chạy thật của SQL, chỉ mục đo thật trên 300 000 dòng: SCAN ~22 ms → SEARCH USING INDEX ~6 ms.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>SELECT is how you ask the database a question</h2>
<p class="lead">After this lesson you can write SELECT queries that pick columns, filter rows with combined conditions, sort and page results, count and summarise per group, avoid the NULL comparison that silently returns nothing, and check with <code>EXPLAIN QUERY PLAN</code> whether your query uses an index. Each feed, search box and dashboard you build — and each <code>findMany</code> an ORM writes for you (Lesson 8.5) — becomes one of these queries.</p>

<h3>Step 1 — SELECT columns FROM table WHERE condition</h3>
<p>All outputs come from the blog database of Lesson 8.1 (<code>sqlite3 blog.db</code>, then <code>.mode table</code>):</p>
${ra(OUT['_t8/out/select-where'])}
<table>
<thead><tr><th>Write</th><th>Means</th></tr></thead>
<tbody>
<tr><td><code>SELECT title, views</code></td><td>Only these columns. <code>SELECT *</code> = every column (handy in the shell, avoid in app code: it sends columns you do not need, maybe a password hash).</td></tr>
<tr><td><code>WHERE published = 1 AND views &gt;= 80</code></td><td>Both must be true. Comparisons: <code>= &lt;&gt; &lt; &lt;= &gt; &gt;=</code>.</td></tr>
<tr><td><code>OR</code></td><td>Either. Mixing AND and OR? Use parentheses: <code>a AND (b OR c)</code>.</td></tr>
<tr><td><code>LIKE '%SQL%'</code></td><td>Pattern: <code>%</code> = any characters, <code>_</code> = one character.</td></tr>
<tr><td><code>IN (2, 3)</code></td><td>Equal to any value in the list. <code>BETWEEN 10 AND 100</code> includes both ends.</td></tr>
</tbody>
</table>
<p>Text values go in <strong>single quotes</strong> (<code>'Lan'</code>); double quotes are for column names. Writing <code>"Lan"</code> may be read as a column called Lan.</p>

<h3>Step 2 — ORDER BY, LIMIT, OFFSET</h3>
${ra(OUT['_t8/out/order-limit'])}
<p>"Top two" = filter, sort, cut. <code>LIMIT 2 OFFSET 2</code> skips two rows and takes two — exactly <code>?page=2&amp;limit=2</code> from Lesson 6.5: <code>OFFSET = (page − 1) × limit</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — LIMIT without ORDER BY.</strong> Without <code>ORDER BY</code>, rows come back in whatever order is convenient for the database — often insertion order on a small table, something else once the table grows, an index is added or the database is upgraded. Paging without a stable order shows some rows twice and skips others. Always sort by something unique at the end: <code>ORDER BY created_at DESC, id DESC</code>.</p></div>

<h3>Step 3 — NULL is not a value, it is "unknown"</h3>
${ra(OUT['_t8/out/null'])}
<p>The "Orphan Draft" post has no author (<code>user_id</code> is NULL). Yet <code>WHERE user_id = NULL</code> matched <strong>zero</strong> rows: comparing anything with NULL gives NULL ("unknown"), which WHERE treats as "not true". Use <code>IS NULL</code> / <code>IS NOT NULL</code>. The third query shows the other surprise: <code>count(*)</code> counts rows, <code>count(user_id)</code> counts only non-NULL values.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>WHERE status &lt;&gt; 'deleted'</code> also drops the NULLs.</strong> Rows whose status is NULL are not "different from deleted" — they are unknown, so they disappear from the result too. When a column can be NULL, write it out: <code>WHERE status &lt;&gt; 'deleted' OR status IS NULL</code> — or, better, make the column <code>NOT NULL</code> with a default.</p></div>

<h3>Step 4 — summaries: COUNT, SUM, AVG, GROUP BY, HAVING</h3>
${ra(OUT['_t8/out/aggregate'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Aggregate</span><span class="lz-t">count · sum · avg · min · max</span><span class="lz-d">Many rows → one value. Without GROUP BY: one row for the whole result.</span></div>
<div class="lz-step"><span class="lz-k">GROUP BY user_id</span><span class="lz-t">one row per group</span><span class="lz-d">Lan (1): 3 posts, 245 views; Minh (2): 2 posts, 303 views; NULL forms its own group.</span></div>
<div class="lz-step"><span class="lz-k">HAVING</span><span class="lz-t">filter the groups</span><span class="lz-d"><code>HAVING count(*) &gt;= 2</code> — authors with at least two posts. WHERE filters rows before grouping; HAVING filters groups after.</span></div>
</div>
<p>Every column in the SELECT of a grouped query must be either in the GROUP BY or inside an aggregate. PostgreSQL refuses <code>SELECT user_id, title … GROUP BY user_id</code> ("which title?"); SQLite quietly picks one row's title — another reason to learn on SQLite but check against the real database you deploy.</p>

<h3>Step 5 — the order SQL really runs in</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">1 FROM</span><span class="lz-t">which table(s)</span><span class="lz-d">And joins (Lesson 8.4). All rows start here.</span></div>
<div class="lz-layer"><span class="lz-k">2 WHERE</span><span class="lz-t">filter rows</span><span class="lz-d">Cannot use <code>count(*)</code>: groups do not exist yet.</span></div>
<div class="lz-layer"><span class="lz-k">3 GROUP BY · HAVING</span><span class="lz-t">form and filter groups</span><span class="lz-d">Aggregates are computed here.</span></div>
<div class="lz-layer"><span class="lz-k">4 SELECT</span><span class="lz-t">choose and name columns</span><span class="lz-d">Aliases (<code>AS posts</code>) are born here, so standard SQL does not let WHERE use them.</span></div>
<div class="lz-layer"><span class="lz-k">5 ORDER BY · LIMIT</span><span class="lz-t">sort, then cut</span><span class="lz-d">The cut happens after sorting — "newest ten" needs both.</span></div>
</div>

<h3>Step 6 — finding rows fast: an index (measured)</h3>
<p>The blog has six posts; real tables have millions of rows. We filled a table <code>events</code> with 300,000 rows and asked for one user's events, before and after adding an index:</p>
${ra(OUT['_t8/out/index'])}
<p><code>SCAN events</code> means "read every row and test it". After <code>CREATE INDEX</code>, the plan says <code>SEARCH … USING COVERING INDEX</code>: the database jumps straight to the matching entries, like the index at the back of a book. On this laptop the query went from about 22 ms to about 6 ms — and most of those 6 ms is starting the <code>sqlite3</code> program itself; the lookup is now a tiny fraction. The cost: a bigger file and slightly slower writes, because every insert also updates the index.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Index these</span><span class="v">Columns in frequent WHERE, JOIN (foreign keys!) and ORDER BY clauses: <code>posts.user_id</code>, <code>users.email</code>.</span></div>
  <div class="kv"><span class="k">Already indexed</span><span class="v">Primary keys and UNIQUE columns get an index automatically.</span></div>
  <div class="kv"><span class="k">Do not bother</span><span class="v">Tiny tables, columns rarely searched, or columns with only two values (published 0/1).</span></div>
  <div class="kv"><span class="k">Check, do not guess</span><span class="v"><code>EXPLAIN QUERY PLAN</code> in SQLite, <code>EXPLAIN ANALYZE</code> in PostgreSQL.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (35 minutes) — eight questions, eight SELECTs</strong></p>
<ol>
<li>Titles of unpublished posts.</li>
<li>Posts with between 40 and 150 views, most viewed first.</li>
<li>Users whose email ends with <code>@example.com</code>, newest account first.</li>
<li>The third and fourth most viewed posts (use LIMIT and OFFSET).</li>
<li>How many posts have no author?</li>
<li>Total and average views of published posts per author.</li>
<li>Authors with more than 200 total views (HAVING).</li>
<li>Create a 300,000-row <code>events</code> table with the recursive query from the course folder (or 30,000 rows by hand with a loop), run <code>EXPLAIN QUERY PLAN</code> for a user's events, add an index, and run it again.</li>
</ol>
<p>Hint: <code>.timer on</code> in sqlite3 prints the time of each statement.</p>
<p><strong>Done when:</strong> (1) returns Draft Post and Orphan Draft; (2) returns Hello World, Old Announcement, Learning SQL in that order; (4) returns Old Announcement then Learning SQL; (5) returns 1; (7) returns Lan and Minh; and your plan in (8) changes from <code>SCAN</code> to <code>SEARCH … USING … INDEX</code>. Then Code Lab module 8.2.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">query</span><span class="v">truy vấn — một câu hỏi gửi CSDL.</span></div>
  <div class="kv"><span class="k">clause</span><span class="v">mệnh đề — SELECT, FROM, WHERE…</span></div>
  <div class="kv"><span class="k">predicate</span><span class="v">điều kiện lọc trong WHERE.</span></div>
  <div class="kv"><span class="k">NULL</span><span class="v">giá trị chưa biết — kiểm bằng IS NULL.</span></div>
  <div class="kv"><span class="k">aggregate function</span><span class="v">hàm tổng hợp — count, sum, avg, min, max.</span></div>
  <div class="kv"><span class="k">GROUP BY / HAVING</span><span class="v">gom nhóm / lọc nhóm.</span></div>
  <div class="kv"><span class="k">pagination</span><span class="v">phân trang — LIMIT + OFFSET.</span></div>
  <div class="kv"><span class="k">index</span><span class="v">chỉ mục — tìm dòng không cần quét cả bảng.</span></div>
  <div class="kv"><span class="k">full table scan</span><span class="v">quét toàn bảng — SCAN.</span></div>
  <div class="kv"><span class="k">query plan</span><span class="v">kế hoạch truy vấn — CSDL định làm thế nào.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>SELECT columns FROM table WHERE conditions ORDER BY … LIMIT … OFFSET …</li>
  <li>AND/OR (with parentheses), LIKE with %, IN, BETWEEN; text in single quotes.</li>
  <li>Never <code>= NULL</code>: use <code>IS NULL</code>; <code>count(column)</code> skips NULLs.</li>
  <li>Aggregates summarise; GROUP BY makes one row per group; HAVING filters groups.</li>
  <li>Runs as FROM → WHERE → GROUP BY/HAVING → SELECT → ORDER BY → LIMIT.</li>
  <li>Index the columns you search and join on; confirm with the query plan.</li>
</ul>
${nguon('📗', 'SQLite — SELECT', 'The full syntax diagram and every clause', 'https://sqlite.org/lang_select.html')}
${nguon('📘', 'Use The Index, Luke', 'A free, practical book about indexes for developers', 'https://use-the-index-luke.com/')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-4-2-select-where', title: 'PostgreSQL 4.2 — SELECT and WHERE', sub: 'The same queries on PostgreSQL, with its stricter rules', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>SELECT là cách bạn đặt câu hỏi cho cơ sở dữ liệu</h2>
<p class="lead">Học xong bài này bạn viết được truy vấn SELECT chọn cột, lọc dòng bằng điều kiện kết hợp, sắp xếp và chia trang, đếm và tóm tắt theo nhóm, tránh phép so NULL lặng lẽ trả về không gì, và kiểm bằng <code>EXPLAIN QUERY PLAN</code> xem truy vấn có dùng chỉ mục không. Mọi bảng tin, ô tìm kiếm và bảng điều khiển bạn dựng — và mọi <code>findMany</code> mà ORM viết giúp bạn (Bài 8.5) — đều trở thành một trong những truy vấn này.</p>

<h3>Bước 1 — SELECT cột FROM bảng WHERE điều kiện</h3>
<p>Mọi output lấy từ CSDL blog ở Bài 8.1 (<code>sqlite3 blog.db</code>, rồi <code>.mode table</code>):</p>
${ra(OUT['_t8/out/select-where'])}
<table>
<thead><tr><th>Viết</th><th>Nghĩa là</th></tr></thead>
<tbody>
<tr><td><code>SELECT title, views</code></td><td>Chỉ các cột này. <code>SELECT *</code> = mọi cột (tiện trong shell, tránh trong mã app: nó gửi cả cột bạn không cần, có khi là hash mật khẩu).</td></tr>
<tr><td><code>WHERE published = 1 AND views &gt;= 80</code></td><td>Cả hai phải đúng. Phép so: <code>= &lt;&gt; &lt; &lt;= &gt; &gt;=</code>.</td></tr>
<tr><td><code>OR</code></td><td>Một trong hai. Trộn AND và OR? Dùng ngoặc: <code>a AND (b OR c)</code>.</td></tr>
<tr><td><code>LIKE '%SQL%'</code></td><td>Mẫu: <code>%</code> = ký tự bất kỳ, <code>_</code> = một ký tự.</td></tr>
<tr><td><code>IN (2, 3)</code></td><td>Bằng một giá trị bất kỳ trong danh sách. <code>BETWEEN 10 AND 100</code> gồm cả hai đầu.</td></tr>
</tbody>
</table>
<p>Giá trị chữ đặt trong <strong>nháy đơn</strong> (<code>'Lan'</code>); nháy kép dành cho tên cột. Viết <code>"Lan"</code> có thể bị hiểu là một cột tên Lan.</p>

<h3>Bước 2 — ORDER BY, LIMIT, OFFSET</h3>
${ra(OUT['_t8/out/order-limit'])}
<p>"Hai bài hàng đầu" = lọc, sắp, cắt. <code>LIMIT 2 OFFSET 2</code> bỏ qua hai dòng rồi lấy hai — đúng <code>?page=2&amp;limit=2</code> ở Bài 6.5: <code>OFFSET = (page − 1) × limit</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — LIMIT mà không ORDER BY.</strong> Không có <code>ORDER BY</code>, dòng trả về theo thứ tự nào tiện cho CSDL — thường là thứ tự chèn khi bảng nhỏ, khác đi khi bảng lớn lên, khi thêm chỉ mục hay khi nâng cấp CSDL. Chia trang không có thứ tự ổn định sẽ hiện có dòng hai lần và bỏ sót dòng khác. Luôn sắp theo một thứ duy nhất ở cuối: <code>ORDER BY created_at DESC, id DESC</code>.</p></div>

<h3>Bước 3 — NULL không phải giá trị, nó là "chưa biết"</h3>
${ra(OUT['_t8/out/null'])}
<p>Bài "Orphan Draft" không có tác giả (<code>user_id</code> là NULL). Vậy mà <code>WHERE user_id = NULL</code> khớp <strong>không</strong> dòng nào: so bất cứ thứ gì với NULL ra NULL ("chưa biết"), và WHERE coi đó là "không đúng". Dùng <code>IS NULL</code> / <code>IS NOT NULL</code>. Truy vấn thứ ba cho thấy bất ngờ còn lại: <code>count(*)</code> đếm dòng, <code>count(user_id)</code> chỉ đếm giá trị khác NULL.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>WHERE status &lt;&gt; 'deleted'</code> cũng bỏ mất NULL.</strong> Dòng có status là NULL không "khác deleted" — nó là chưa biết, nên cũng biến mất khỏi kết quả. Khi một cột có thể NULL, hãy viết rõ: <code>WHERE status &lt;&gt; 'deleted' OR status IS NULL</code> — hoặc tốt hơn, đặt cột <code>NOT NULL</code> kèm giá trị mặc định.</p></div>

<h3>Bước 4 — tóm tắt: COUNT, SUM, AVG, GROUP BY, HAVING</h3>
${ra(OUT['_t8/out/aggregate'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Tổng hợp</span><span class="lz-t">count · sum · avg · min · max</span><span class="lz-d">Nhiều dòng → một giá trị. Không có GROUP BY: một dòng cho cả kết quả.</span></div>
<div class="lz-step"><span class="lz-k">GROUP BY user_id</span><span class="lz-t">mỗi nhóm một dòng</span><span class="lz-d">Lan (1): 3 bài, 245 lượt xem; Minh (2): 2 bài, 303 lượt xem; NULL tự thành một nhóm.</span></div>
<div class="lz-step"><span class="lz-k">HAVING</span><span class="lz-t">lọc các nhóm</span><span class="lz-d"><code>HAVING count(*) &gt;= 2</code> — tác giả có ít nhất hai bài. WHERE lọc dòng trước khi gom; HAVING lọc nhóm sau khi gom.</span></div>
</div>
<p>Mọi cột trong SELECT của truy vấn có gom nhóm phải nằm trong GROUP BY hoặc bên trong một hàm tổng hợp. PostgreSQL từ chối <code>SELECT user_id, title … GROUP BY user_id</code> ("title nào?"); SQLite lặng lẽ lấy title của một dòng — thêm một lý do để học trên SQLite nhưng kiểm lại trên đúng CSDL bạn deploy.</p>

<h3>Bước 5 — thứ tự SQL thật sự chạy</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">1 FROM</span><span class="lz-t">bảng nào</span><span class="lz-d">Và các phép nối (Bài 8.4). Mọi dòng bắt đầu từ đây.</span></div>
<div class="lz-layer"><span class="lz-k">2 WHERE</span><span class="lz-t">lọc dòng</span><span class="lz-d">Không dùng được <code>count(*)</code>: nhóm chưa tồn tại.</span></div>
<div class="lz-layer"><span class="lz-k">3 GROUP BY · HAVING</span><span class="lz-t">tạo và lọc nhóm</span><span class="lz-d">Hàm tổng hợp được tính ở đây.</span></div>
<div class="lz-layer"><span class="lz-k">4 SELECT</span><span class="lz-t">chọn và đặt tên cột</span><span class="lz-d">Bí danh (<code>AS posts</code>) sinh ra ở đây, nên SQL chuẩn không cho WHERE dùng chúng.</span></div>
<div class="lz-layer"><span class="lz-k">5 ORDER BY · LIMIT</span><span class="lz-t">sắp rồi cắt</span><span class="lz-d">Cắt xảy ra sau khi sắp — "mười bài mới nhất" cần cả hai.</span></div>
</div>

<h3>Bước 6 — tìm dòng thật nhanh: chỉ mục (đo thật)</h3>
<p>Blog có sáu bài; bảng thật có hàng triệu dòng. Ta đổ 300 000 dòng vào bảng <code>events</code> rồi hỏi sự kiện của một người dùng, trước và sau khi thêm chỉ mục:</p>
${ra(OUT['_t8/out/index'])}
<p><code>SCAN events</code> nghĩa là "đọc từng dòng và kiểm". Sau <code>CREATE INDEX</code>, kế hoạch ghi <code>SEARCH … USING COVERING INDEX</code>: CSDL nhảy thẳng tới các mục khớp, như mục lục cuối sách. Trên laptop này truy vấn giảm từ khoảng 22 ms xuống khoảng 6 ms — và phần lớn 6 ms đó là khởi động chính chương trình <code>sqlite3</code>; việc tra giờ chỉ còn một phần rất nhỏ. Cái giá: tệp lớn hơn và ghi chậm hơn chút, vì mỗi lần chèn cũng cập nhật chỉ mục.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Đánh chỉ mục</span><span class="v">Cột hay dùng trong WHERE, JOIN (khoá ngoại!) và ORDER BY: <code>posts.user_id</code>, <code>users.email</code>.</span></div>
  <div class="kv"><span class="k">Đã có sẵn</span><span class="v">Khoá chính và cột UNIQUE tự có chỉ mục.</span></div>
  <div class="kv"><span class="k">Không cần</span><span class="v">Bảng rất nhỏ, cột hiếm khi tìm, hay cột chỉ có hai giá trị (published 0/1).</span></div>
  <div class="kv"><span class="k">Kiểm, đừng đoán</span><span class="v"><code>EXPLAIN QUERY PLAN</code> trong SQLite, <code>EXPLAIN ANALYZE</code> trong PostgreSQL.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (35 phút) — tám câu hỏi, tám câu SELECT</strong></p>
<ol>
<li>Tiêu đề các bài chưa đăng.</li>
<li>Bài có từ 40 tới 150 lượt xem, xem nhiều nhất trước.</li>
<li>Người dùng có email kết thúc bằng <code>@example.com</code>, tài khoản mới nhất trước.</li>
<li>Bài xem nhiều thứ ba và thứ tư (dùng LIMIT và OFFSET).</li>
<li>Có bao nhiêu bài không có tác giả?</li>
<li>Tổng và trung bình lượt xem của bài đã đăng theo từng tác giả.</li>
<li>Tác giả có tổng lượt xem trên 200 (HAVING).</li>
<li>Tạo bảng <code>events</code> 300 000 dòng bằng truy vấn đệ quy trong thư mục khoá (hoặc 30 000 dòng bằng vòng lặp tự viết), chạy <code>EXPLAIN QUERY PLAN</code> cho sự kiện của một người dùng, thêm chỉ mục, rồi chạy lại.</li>
</ol>
<p>Gợi ý: <code>.timer on</code> trong sqlite3 in thời gian của từng câu lệnh.</p>
<p><strong>Xong khi:</strong> (1) trả Draft Post và Orphan Draft; (2) trả Hello World, Old Announcement, Learning SQL theo đúng thứ tự; (4) trả Old Announcement rồi Learning SQL; (5) trả 1; (7) trả Lan và Minh; và kế hoạch ở (8) đổi từ <code>SCAN</code> sang <code>SEARCH … USING … INDEX</code>. Sau đó làm module Code Lab 8.2.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">query</span><span class="v">truy vấn — một câu hỏi gửi CSDL.</span></div>
  <div class="kv"><span class="k">clause</span><span class="v">mệnh đề — SELECT, FROM, WHERE…</span></div>
  <div class="kv"><span class="k">predicate</span><span class="v">điều kiện lọc trong WHERE.</span></div>
  <div class="kv"><span class="k">NULL</span><span class="v">giá trị chưa biết — kiểm bằng IS NULL.</span></div>
  <div class="kv"><span class="k">aggregate function</span><span class="v">hàm tổng hợp — count, sum, avg, min, max.</span></div>
  <div class="kv"><span class="k">GROUP BY / HAVING</span><span class="v">gom nhóm / lọc nhóm.</span></div>
  <div class="kv"><span class="k">pagination</span><span class="v">phân trang — LIMIT + OFFSET.</span></div>
  <div class="kv"><span class="k">index</span><span class="v">chỉ mục — tìm dòng không cần quét cả bảng.</span></div>
  <div class="kv"><span class="k">full table scan</span><span class="v">quét toàn bảng — SCAN.</span></div>
  <div class="kv"><span class="k">query plan</span><span class="v">kế hoạch truy vấn — CSDL định làm thế nào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>SELECT cột FROM bảng WHERE điều kiện ORDER BY … LIMIT … OFFSET …</li>
  <li>AND/OR (kèm ngoặc), LIKE với %, IN, BETWEEN; chữ trong nháy đơn.</li>
  <li>Không bao giờ <code>= NULL</code>: dùng <code>IS NULL</code>; <code>count(cột)</code> bỏ qua NULL.</li>
  <li>Hàm tổng hợp tóm tắt; GROUP BY tạo mỗi nhóm một dòng; HAVING lọc nhóm.</li>
  <li>Chạy theo thứ tự FROM → WHERE → GROUP BY/HAVING → SELECT → ORDER BY → LIMIT.</li>
  <li>Đánh chỉ mục cho cột hay tìm và hay nối; xác nhận bằng kế hoạch truy vấn.</li>
</ul>
${nguon('📗', 'SQLite — SELECT', 'Sơ đồ cú pháp đầy đủ và từng mệnh đề', 'https://sqlite.org/lang_select.html')}
${nguon('📘', 'Use The Index, Luke', 'Sách miễn phí, thực dụng về chỉ mục cho lập trình viên', 'https://use-the-index-luke.com/')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-4-2-select-where', title: 'PostgreSQL 4.2 — SELECT và WHERE', sub: 'Cùng các truy vấn trên PostgreSQL, với luật chặt chẽ hơn', cta: 'Mở bài' })}
</div>
`,
};
