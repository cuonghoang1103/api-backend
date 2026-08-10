/**
 * PostgreSQL — Chương 9: Chỉ mục (MỞ Giai đoạn 3 — Hiệu năng).
 * Chỉ mục là gì + B-tree + Seq Scan vs Index Scan (đọc EXPLAIN ANALYZE) ·
 * chọn cột nào để index + chỉ mục tổ hợp & thứ tự cột + covering (INCLUDE) ·
 * khi chỉ mục KHÔNG được dùng (hàm trên cột, độ chọn lọc) + partial + chi phí ghi ·
 * các loại chỉ mục B-tree/GIN/BRIN/GiST/unique. Output CHẠY THẬT PG 15.4 (schema ch9,
 * bảng event 500.000 dòng, 62 MB). max_parallel_workers_per_gather=0 để plan gọn.
 * LUẬT: < > trong code/out → &lt; &gt; (kể cả mũi tên -> của EXPLAIN → -&gt;, @> → @&gt;);
 * & → &amp;; backtick → &#96;; ${ → \${. Khối .out LUÔN đóng </div> (KHÔNG </code></pre>).
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 9 — Indexes|||Chương 9 — Chỉ mục',
  description: 'Vì sao một truy vấn chậm và chỉ mục đúng làm nó nhanh ra sao: B-tree, đọc EXPLAIN ANALYZE, quét tuần tự vs quét chỉ mục, chỉ mục tổ hợp và thứ tự cột, covering index, khi chỉ mục không được dùng, độ chọn lọc, partial index, chi phí ghi, và các loại chỉ mục GIN/BRIN/GiST.',
  lessons: [
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — What an index is: B-tree, Seq Scan vs Index Scan|||9.1 — Chỉ mục là gì: B-tree, Seq Scan vs Index Scan',
      slug: 'postgresql-9-1-chi-muc-la-gi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chỉ mục là một cấu trúc B-tree đã sắp xếp giúp Postgres nhảy thẳng tới dòng cần thay vì đọc cả bảng; cách đọc EXPLAIN ANALYZE để thấy Seq Scan biến thành Index Scan.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1 · Phase 3 — Performance</span>
<h2>The book index, for your table</h2>
<p class="lead">Everything so far was about getting the <em>right</em> answer. Phase 3 is about getting it <em>fast</em>. The single most important tool is the <strong>index</strong>: a separate, sorted structure that lets Postgres jump straight to the rows you asked for instead of reading the whole table. Like the index at the back of a book — you don't read all 900 pages to find "MVCC", you look it up and turn to page 412.</p>
<p>All measurements in this chapter run on a real 500,000-row table called <code>event</code> (62 MB on disk):</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> event (
  id         bigint <span class="tok-keyword">GENERATED ALWAYS AS IDENTITY PRIMARY KEY</span>,
  user_id    int           <span class="tok-keyword">NOT NULL</span>,
  status     text          <span class="tok-keyword">NOT NULL</span>,   <span class="tok-comment">-- 'active' | 'done' | 'pending'</span>
  amount     numeric(10,2) <span class="tok-keyword">NOT NULL</span>,
  email      text          <span class="tok-keyword">NOT NULL</span>,
  created_at timestamptz   <span class="tok-keyword">NOT NULL</span>,
  props      jsonb         <span class="tok-keyword">NOT NULL</span>
);  <span class="tok-comment">-- 500,000 rows inserted with generate_series</span></code></pre>

<h3>Without an index: a Sequential Scan</h3>
<p>Find one row by email. There's no index on <code>email</code> yet, so Postgres has no choice but to read every row and check it. <code>EXPLAIN ANALYZE</code> runs the query and reports what actually happened:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> email = <span class="tok-string">'user250000@example.com'</span>;</code></pre>
<div class="out"> Seq Scan on event  (cost=0.00..14138.00 rows=1 width=87) (actual time=17.460..34.613 rows=1 loops=1)
   Filter: (email = 'user250000@example.com'::text)
   Rows Removed by Filter: 499999
 Planning Time: 0.048 ms
 Execution Time: 34.625 ms</div>
<p>Read that plan line by line — it's the skill this whole phase rests on:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Seq Scan on event</span><span class="v">The access method: a <strong>sequential scan</strong> — read the table top to bottom. This is what "slow" looks like on a big table.</span></div>
  <div class="kv"><span class="k">cost=0.00..14138.00</span><span class="v">The planner's <em>estimated</em> effort in arbitrary units (startup..total). Used to compare plans, not a time.</span></div>
  <div class="kv"><span class="k">actual time=17.460..34.613</span><span class="v">The <em>real</em> milliseconds this run took (first row..last row), because we used ANALYZE.</span></div>
  <div class="kv"><span class="k">Rows Removed by Filter: 499999</span><span class="v">The tell-tale sign: Postgres inspected all 500,000 rows and threw away 499,999 to find one. Pure waste.</span></div>
</div>

<h3>Add an index: an Index Scan</h3>
<p>Now build a B-tree index on <code>email</code> and run the exact same query:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_email <span class="tok-keyword">ON</span> event(email);   <span class="tok-comment">-- builds a sorted B-tree (19 MB)</span>

<span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> email = <span class="tok-string">'user250000@example.com'</span>;</code></pre>
<div class="out"> Index Scan using idx_event_email on event  (cost=0.42..8.44 rows=1 width=87) (actual time=0.023..0.024 rows=1 loops=1)
   Index Cond: (email = 'user250000@example.com'::text)
 Planning Time: 0.597 ms
 Execution Time: 0.078 ms</div>
<p>The plan changed completely. <strong>Index Scan</strong> replaced Seq Scan; <code>Index Cond</code> replaced <code>Filter</code> (the condition is now satisfied <em>by the index</em>, not by inspecting rows); <code>Rows Removed by Filter</code> is gone. Execution time fell from <strong>34.6 ms to 0.078 ms — about 440× faster</strong>. The estimated <code>cost</code> dropped from 14138 to 8.44, which is why the planner chose it.</p>

<h3>Why it's a B-tree</h3>
<p>Postgres's default index is a <strong>B-tree</strong> — a balanced tree of sorted keys. To find a value it walks from the root down through a few levels to a leaf, then follows a pointer to the table row. For 500,000 rows that's ~3 hops instead of 500,000 comparisons. The tree stays balanced as you insert, so lookups stay fast (logarithmic) no matter the size.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Root</span><span class="lz-v">One page of separator keys — "values &lt; M go left, ≥ M go right". Chosen in a couple of comparisons.</span></div>
  <div class="lz-layer"><span class="lz-k">Internal</span><span class="lz-v">More separator pages, narrowing the range with each level. A tree this size is only 3–4 levels deep.</span></div>
  <div class="lz-layer"><span class="lz-k">Leaf</span><span class="lz-v">Sorted keys + a pointer (TID) to the actual table row. Leaves are linked, so range scans read sideways.</span></div>
</div>
<div class="callout ok">A B-tree is fast for <strong>equality</strong> (<code>=</code>), <strong>ranges</strong> (<code>&lt;</code>, <code>&gt;</code>, <code>BETWEEN</code>), <code>IN</code>, prefix <code>LIKE 'abc%'</code>, and it can also supply <strong>sorted order</strong> (<code>ORDER BY</code>) for free because its leaves are already sorted. That covers the overwhelming majority of real queries — B-tree is the right default 95% of the time.</div>
<div class="note-ct">Every primary key you've created since Chapter 3 already has a B-tree index behind it (that's how a PK enforces uniqueness and stays fast). Looking a user up by <code>id</code> has always been an Index Scan; this lesson just makes it visible — and shows you how to give the <em>other</em> columns you filter on the same treatment.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: run EXPLAIN ANALYZE and watch a Seq Scan become an Index Scan</span><span class="lc-sub">The Code Lab track builds the 500k-row table so you can measure it yourself.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1 · Giai đoạn 3 — Hiệu năng</span>
<h2>Mục lục sách, cho bảng của bạn</h2>
<p class="lead">Mọi thứ tới giờ là về lấy <em>đúng</em> câu trả lời. Giai đoạn 3 là về lấy nó <em>nhanh</em>. Công cụ quan trọng nhất là <strong>chỉ mục (index)</strong>: một cấu trúc riêng, đã sắp xếp, cho Postgres nhảy thẳng tới các dòng bạn hỏi thay vì đọc cả bảng. Như mục lục cuối sách — bạn không đọc hết 900 trang để tìm "MVCC", bạn tra nó rồi giở tới trang 412.</p>
<p>Mọi phép đo trong chương này chạy trên một bảng <code>event</code> thật 500.000 dòng (62 MB trên đĩa):</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> event (
  id         bigint <span class="tok-keyword">GENERATED ALWAYS AS IDENTITY PRIMARY KEY</span>,
  user_id    int           <span class="tok-keyword">NOT NULL</span>,
  status     text          <span class="tok-keyword">NOT NULL</span>,   <span class="tok-comment">-- 'active' | 'done' | 'pending'</span>
  amount     numeric(10,2) <span class="tok-keyword">NOT NULL</span>,
  email      text          <span class="tok-keyword">NOT NULL</span>,
  created_at timestamptz   <span class="tok-keyword">NOT NULL</span>,
  props      jsonb         <span class="tok-keyword">NOT NULL</span>
);  <span class="tok-comment">-- 500.000 dòng chèn bằng generate_series</span></code></pre>

<h3>Không có chỉ mục: một Sequential Scan</h3>
<p>Tìm một dòng theo email. Chưa có chỉ mục trên <code>email</code>, nên Postgres không còn cách nào ngoài đọc mọi dòng và kiểm tra. <code>EXPLAIN ANALYZE</code> chạy truy vấn và báo cáo điều thực sự xảy ra:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> email = <span class="tok-string">'user250000@example.com'</span>;</code></pre>
<div class="out"> Seq Scan on event  (cost=0.00..14138.00 rows=1 width=87) (actual time=17.460..34.613 rows=1 loops=1)
   Filter: (email = 'user250000@example.com'::text)
   Rows Removed by Filter: 499999
 Planning Time: 0.048 ms
 Execution Time: 34.625 ms</div>
<p>Đọc plan đó từng dòng — đây là kỹ năng mà cả giai đoạn này dựa vào:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Seq Scan on event</span><span class="v">Phương pháp truy cập: một <strong>quét tuần tự</strong> — đọc bảng từ đầu tới cuối. Đây là dáng vẻ của "chậm" trên bảng lớn.</span></div>
  <div class="kv"><span class="k">cost=0.00..14138.00</span><span class="v">Công sức <em>ước lượng</em> của bộ lập kế hoạch theo đơn vị quy ước (khởi động..tổng). Dùng để so plan, không phải thời gian.</span></div>
  <div class="kv"><span class="k">actual time=17.460..34.613</span><span class="v">Số mili-giây <em>thật</em> lần chạy này (dòng đầu..dòng cuối), vì ta dùng ANALYZE.</span></div>
  <div class="kv"><span class="k">Rows Removed by Filter: 499999</span><span class="v">Dấu hiệu tố cáo: Postgres xét cả 500.000 dòng và vứt đi 499.999 để tìm một dòng. Lãng phí thuần tuý.</span></div>
</div>

<h3>Thêm chỉ mục: một Index Scan</h3>
<p>Giờ dựng một chỉ mục B-tree trên <code>email</code> rồi chạy đúng truy vấn đó:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_email <span class="tok-keyword">ON</span> event(email);   <span class="tok-comment">-- dựng một B-tree đã sắp (19 MB)</span>

<span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> email = <span class="tok-string">'user250000@example.com'</span>;</code></pre>
<div class="out"> Index Scan using idx_event_email on event  (cost=0.42..8.44 rows=1 width=87) (actual time=0.023..0.024 rows=1 loops=1)
   Index Cond: (email = 'user250000@example.com'::text)
 Planning Time: 0.597 ms
 Execution Time: 0.078 ms</div>
<p>Plan đổi hoàn toàn. <strong>Index Scan</strong> thay cho Seq Scan; <code>Index Cond</code> thay cho <code>Filter</code> (điều kiện giờ được thoả mãn <em>bởi chỉ mục</em>, không phải bằng xét từng dòng); <code>Rows Removed by Filter</code> biến mất. Thời gian chạy rơi từ <strong>34,6 ms xuống 0,078 ms — nhanh khoảng 440×</strong>. <code>cost</code> ước lượng rớt từ 14138 xuống 8,44, đó là lý do bộ lập kế hoạch chọn nó.</p>

<h3>Vì sao là B-tree</h3>
<p>Chỉ mục mặc định của Postgres là một <strong>B-tree</strong> — một cây cân bằng của các khoá đã sắp. Để tìm một giá trị nó đi từ gốc xuống qua vài tầng tới một lá, rồi theo con trỏ tới dòng bảng. Với 500.000 dòng đó là ~3 bước nhảy thay vì 500.000 phép so sánh. Cây giữ cân bằng khi bạn chèn, nên tra cứu luôn nhanh (logarit) bất kể kích thước.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Gốc (Root)</span><span class="lz-v">Một trang khoá phân tách — "giá trị &lt; M sang trái, ≥ M sang phải". Chọn trong vài phép so sánh.</span></div>
  <div class="lz-layer"><span class="lz-k">Trong (Internal)</span><span class="lz-v">Thêm trang phân tách, thu hẹp khoảng ở mỗi tầng. Cây cỡ này chỉ sâu 3–4 tầng.</span></div>
  <div class="lz-layer"><span class="lz-k">Lá (Leaf)</span><span class="lz-v">Khoá đã sắp + con trỏ (TID) tới dòng bảng thật. Các lá được nối, nên quét khoảng đọc ngang.</span></div>
</div>
<div class="callout ok">Một B-tree nhanh cho <strong>bằng</strong> (<code>=</code>), <strong>khoảng</strong> (<code>&lt;</code>, <code>&gt;</code>, <code>BETWEEN</code>), <code>IN</code>, <code>LIKE 'abc%'</code> đầu chuỗi, và nó cũng cấp <strong>thứ tự đã sắp</strong> (<code>ORDER BY</code>) miễn phí vì lá của nó đã sắp sẵn. Điều đó bao phủ áp đảo phần lớn truy vấn thật — B-tree là mặc định đúng 95% thời gian.</div>
<div class="note-ct">Mọi khoá chính bạn tạo từ Chương 3 đều đã có một chỉ mục B-tree phía sau (đó là cách một PK ép tính duy nhất và giữ nhanh). Tra một user theo <code>id</code> luôn là một Index Scan; bài này chỉ làm nó hiện ra — và chỉ cho bạn cách cho các cột <em>khác</em> mà bạn lọc theo được đối xử y hệt.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chạy EXPLAIN ANALYZE và nhìn Seq Scan thành Index Scan</span><span class="lc-sub">Track Code Lab dựng bảng 500k dòng để bạn tự đo.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — Which columns, composite indexes & covering|||9.2 — Cột nào, chỉ mục tổ hợp & covering',
      slug: 'postgresql-9-2-to-hop-covering',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Index các cột bạn lọc/sắp/join theo; một chỉ mục tổ hợp nhiều cột và vì sao thứ tự cột quyết định; covering index (INCLUDE) cho Index Only Scan không chạm bảng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>What to index, and multi-column indexes</h2>
<p class="lead">Which columns deserve an index? The ones you <strong>filter</strong> on (<code>WHERE</code>), <strong>join</strong> on, and <strong>sort</strong> by. When a query uses several columns together, one <em>composite</em> index over all of them beats several single-column ones — but only if you get the column order right, which is the subtle part.</p>

<h3>A composite index serves filter + sort at once</h3>
<p>"The 5 most recent events for user 42" filters on <code>user_id</code> and sorts by <code>created_at</code>. With no helpful index, Postgres scans the table and sorts the matches:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> id, created_at, amount <span class="tok-keyword">FROM</span> event
<span class="tok-keyword">WHERE</span> user_id = 42 <span class="tok-keyword">ORDER BY</span> created_at <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 5;</code></pre>
<div class="out"> Limit  (cost=14146.24..14146.25 rows=5 width=22) (actual time=28.015..28.017 rows=5 loops=1)
   -&gt;  Sort  (cost=14146.24..14147.48 rows=496 width=22) (actual time=28.013..28.013 rows=5 loops=1)
         Sort Key: created_at DESC
         Sort Method: top-N heapsort  Memory: 25kB
         -&gt;  Seq Scan on event  (cost=0.00..14138.00 rows=496 width=22) (actual time=0.018..27.886 rows=500 loops=1)
               Filter: (user_id = 42)
               Rows Removed by Filter: 499500
 Execution Time: 28.050 ms</div>
<p>Two costs: a Seq Scan (throwing away 499,500 rows), then a Sort. Now a <strong>composite index on both columns, in the order (filter, then sort)</strong>:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_user_created <span class="tok-keyword">ON</span> event(user_id, created_at);</code></pre>
<div class="out"> Limit  (cost=0.42..19.99 rows=5 width=22) (actual time=0.036..0.042 rows=5 loops=1)
   -&gt;  Index Scan Backward using idx_event_user_created on event  (cost=0.42..1941.03 rows=496 width=22) (actual time=0.035..0.040 rows=5 loops=1)
         Index Cond: (user_id = 42)
 Execution Time: 0.055 ms</div>
<p>28 ms → 0.055 ms. The <code>Sort</code> node is <em>gone</em>: because the index is ordered by <code>(user_id, created_at)</code>, the rows for user 42 already come out in <code>created_at</code> order. Postgres reads the index <strong>backward</strong> and stops after 5. One index served both the filter and the sort.</p>

<h3>Column order is everything</h3>
<p>An index on <code>(user_id, created_at)</code> is like a phone book sorted by (last name, first name). It's great for "everyone named Nguyen", useless for "everyone whose first name is An" — the first name only helps <em>after</em> you've fixed the last name. Query the <strong>second</strong> column alone and the composite index can't seek:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> id, user_id <span class="tok-keyword">FROM</span> event
<span class="tok-keyword">WHERE</span> created_at = <span class="tok-string">'2024-06-22 14:40:00+00'</span>;   <span class="tok-comment">-- leading column user_id absent</span></code></pre>
<div class="out"> Seq Scan on event  (cost=0.00..14137.74 rows=1 width=12) (actual time=13.487..37.894 rows=1 loops=1)
   Filter: (created_at = '2024-06-22 14:40:00+00'::timestamp with time zone)
   Rows Removed by Filter: 499999
 Execution Time: 37.939 ms</div>
<p>Straight back to a Seq Scan — the index was no help. <strong>Rule: put the columns you filter by <em>equality</em> first, the range/sort column last.</strong> A composite index on <code>(a, b, c)</code> can serve <code>WHERE a=</code>, <code>WHERE a= AND b=</code>, and <code>WHERE a= AND b= AND c=</code> — always a <em>left prefix</em> — but not <code>WHERE b=</code> alone.</p>

<h3>Covering index — INCLUDE, and the Index Only Scan</h3>
<p>If an index contains <em>every column a query needs</em>, Postgres can answer from the index alone and never touch the table — an <strong>Index Only Scan</strong>. Add non-key columns with <code>INCLUDE</code>:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_user_incl <span class="tok-keyword">ON</span> event(user_id) <span class="tok-keyword">INCLUDE</span> (amount);

<span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> user_id, sum(amount) <span class="tok-keyword">FROM</span> event
<span class="tok-keyword">WHERE</span> user_id = 42 <span class="tok-keyword">GROUP BY</span> user_id;</code></pre>
<div class="out"> GroupAggregate  (cost=0.42..24.53 rows=392 width=36) (actual time=0.129..0.129 rows=1 loops=1)
   Group Key: user_id
   -&gt;  Index Only Scan using idx_event_user_incl on event  (cost=0.42..17.14 rows=498 width=10) (actual time=0.035..0.090 rows=500 loops=1)
         Index Cond: (user_id = 42)
         Heap Fetches: 0
 Execution Time: 0.151 ms</div>
<p><strong>Index Only Scan</strong> with <code>Heap Fetches: 0</code> — Postgres computed the sum reading only the index, never the table. Both <code>user_id</code> (the key) and <code>amount</code> (included) live in the index, so there was nothing left to fetch from the heap.</p>
<div class="callout ok">Index the columns you <code>WHERE</code>/<code>JOIN</code>/<code>ORDER BY</code> on. For multi-column queries, prefer <strong>one composite index</strong> with equality columns first and the range/sort column last, over several single-column indexes. Reach for <code>INCLUDE</code> when a hot query reads just a couple of extra columns — you turn it into a table-free Index Only Scan.</div>
<div class="note-ct">A feed query like "this user's posts, newest first" is exactly <code>(user_id, created_at)</code>. The site's foreign keys deserve indexes too: Postgres indexes the PK automatically but <em>not</em> the FK column on the child side — so <code>comment.note_id</code>, <code>note.user_id</code> etc. each need their own index or every join and every "delete the parent" check falls back to a Seq Scan.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: composite indexes, column order, and INCLUDE</span><span class="lc-sub">The Code Lab track proves the left-prefix rule with EXPLAIN.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Index cột nào, và chỉ mục nhiều cột</h2>
<p class="lead">Cột nào đáng có chỉ mục? Những cột bạn <strong>lọc</strong> (<code>WHERE</code>), <strong>join</strong>, và <strong>sắp xếp</strong> theo. Khi một truy vấn dùng nhiều cột cùng nhau, một chỉ mục <em>tổ hợp</em> trên tất cả chúng thắng nhiều chỉ mục một-cột — nhưng chỉ khi bạn đặt đúng thứ tự cột, đó là phần tinh tế.</p>

<h3>Một chỉ mục tổ hợp phục vụ lọc + sắp cùng lúc</h3>
<p>"5 event mới nhất của user 42" lọc theo <code>user_id</code> và sắp theo <code>created_at</code>. Không có chỉ mục hữu ích, Postgres quét bảng rồi sắp các dòng khớp:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> id, created_at, amount <span class="tok-keyword">FROM</span> event
<span class="tok-keyword">WHERE</span> user_id = 42 <span class="tok-keyword">ORDER BY</span> created_at <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 5;</code></pre>
<div class="out"> Limit  (cost=14146.24..14146.25 rows=5 width=22) (actual time=28.015..28.017 rows=5 loops=1)
   -&gt;  Sort  (cost=14146.24..14147.48 rows=496 width=22) (actual time=28.013..28.013 rows=5 loops=1)
         Sort Key: created_at DESC
         Sort Method: top-N heapsort  Memory: 25kB
         -&gt;  Seq Scan on event  (cost=0.00..14138.00 rows=496 width=22) (actual time=0.018..27.886 rows=500 loops=1)
               Filter: (user_id = 42)
               Rows Removed by Filter: 499500
 Execution Time: 28.050 ms</div>
<p>Hai chi phí: một Seq Scan (vứt đi 499.500 dòng), rồi một Sort. Giờ một <strong>chỉ mục tổ hợp trên cả hai cột, theo thứ tự (lọc, rồi sắp)</strong>:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_user_created <span class="tok-keyword">ON</span> event(user_id, created_at);</code></pre>
<div class="out"> Limit  (cost=0.42..19.99 rows=5 width=22) (actual time=0.036..0.042 rows=5 loops=1)
   -&gt;  Index Scan Backward using idx_event_user_created on event  (cost=0.42..1941.03 rows=496 width=22) (actual time=0.035..0.040 rows=5 loops=1)
         Index Cond: (user_id = 42)
 Execution Time: 0.055 ms</div>
<p>28 ms → 0,055 ms. Nút <code>Sort</code> <em>biến mất</em>: vì chỉ mục đã sắp theo <code>(user_id, created_at)</code>, các dòng của user 42 đã ra sẵn theo thứ tự <code>created_at</code>. Postgres đọc chỉ mục <strong>ngược (backward)</strong> và dừng sau 5 dòng. Một chỉ mục phục vụ cả lọc lẫn sắp.</p>

<h3>Thứ tự cột là tất cả</h3>
<p>Một chỉ mục trên <code>(user_id, created_at)</code> giống danh bạ sắp theo (họ, tên). Nó tuyệt cho "mọi người họ Nguyễn", vô dụng cho "mọi người tên An" — tên chỉ giúp <em>sau khi</em> bạn đã cố định họ. Hỏi cột <strong>thứ hai</strong> một mình và chỉ mục tổ hợp không thể nhảy tìm (seek):</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> id, user_id <span class="tok-keyword">FROM</span> event
<span class="tok-keyword">WHERE</span> created_at = <span class="tok-string">'2024-06-22 14:40:00+00'</span>;   <span class="tok-comment">-- vắng cột đầu user_id</span></code></pre>
<div class="out"> Seq Scan on event  (cost=0.00..14137.74 rows=1 width=12) (actual time=13.487..37.894 rows=1 loops=1)
   Filter: (created_at = '2024-06-22 14:40:00+00'::timestamp with time zone)
   Rows Removed by Filter: 499999
 Execution Time: 37.939 ms</div>
<p>Thẳng về một Seq Scan — chỉ mục vô ích. <strong>Luật: đặt các cột bạn lọc theo <em>bằng</em> trước, cột khoảng/sắp cuối.</strong> Một chỉ mục tổ hợp trên <code>(a, b, c)</code> phục vụ được <code>WHERE a=</code>, <code>WHERE a= AND b=</code>, và <code>WHERE a= AND b= AND c=</code> — luôn là một <em>tiền tố trái</em> — nhưng không phục vụ <code>WHERE b=</code> một mình.</p>

<h3>Covering index — INCLUDE, và Index Only Scan</h3>
<p>Nếu một chỉ mục chứa <em>mọi cột một truy vấn cần</em>, Postgres có thể trả lời từ riêng chỉ mục và không bao giờ chạm bảng — một <strong>Index Only Scan</strong>. Thêm các cột không-khoá bằng <code>INCLUDE</code>:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_user_incl <span class="tok-keyword">ON</span> event(user_id) <span class="tok-keyword">INCLUDE</span> (amount);

<span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> user_id, sum(amount) <span class="tok-keyword">FROM</span> event
<span class="tok-keyword">WHERE</span> user_id = 42 <span class="tok-keyword">GROUP BY</span> user_id;</code></pre>
<div class="out"> GroupAggregate  (cost=0.42..24.53 rows=392 width=36) (actual time=0.129..0.129 rows=1 loops=1)
   Group Key: user_id
   -&gt;  Index Only Scan using idx_event_user_incl on event  (cost=0.42..17.14 rows=498 width=10) (actual time=0.035..0.090 rows=500 loops=1)
         Index Cond: (user_id = 42)
         Heap Fetches: 0
 Execution Time: 0.151 ms</div>
<p><strong>Index Only Scan</strong> với <code>Heap Fetches: 0</code> — Postgres tính tổng chỉ đọc chỉ mục, không hề đọc bảng. Cả <code>user_id</code> (khoá) và <code>amount</code> (được include) đều nằm trong chỉ mục, nên không còn gì phải lấy từ heap.</p>
<div class="callout ok">Index các cột bạn <code>WHERE</code>/<code>JOIN</code>/<code>ORDER BY</code>. Với truy vấn nhiều cột, ưu tiên <strong>một chỉ mục tổ hợp</strong> với cột bằng trước và cột khoảng/sắp cuối, hơn là nhiều chỉ mục một-cột. Dùng <code>INCLUDE</code> khi một truy vấn nóng chỉ đọc thêm vài cột — bạn biến nó thành một Index Only Scan không đụng bảng.</div>
<div class="note-ct">Một truy vấn feed như "bài của user này, mới nhất trước" đúng là <code>(user_id, created_at)</code>. Các khoá ngoại của trang cũng đáng có chỉ mục: Postgres tự index PK nhưng <em>không</em> tự index cột FK ở phía con — nên <code>comment.note_id</code>, <code>note.user_id</code>… mỗi cái cần chỉ mục riêng, nếu không mọi join và mọi phép kiểm "xoá cha" rơi về Seq Scan.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chỉ mục tổ hợp, thứ tự cột, và INCLUDE</span><span class="lc-sub">Track Code Lab chứng minh luật tiền-tố-trái bằng EXPLAIN.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — When indexes are NOT used, selectivity & partial indexes|||9.3 — Khi chỉ mục KHÔNG được dùng, độ chọn lọc & partial index',
      slug: 'postgresql-9-3-khong-dung-selectivity-partial',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao một hàm trên cột vô hiệu hoá chỉ mục (và expression index cứu nó); vì sao bộ lập kế hoạch bỏ qua chỉ mục khi truy vấn trả về nhiều dòng (độ chọn lọc); partial index; và chi phí ghi của chỉ mục.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Why the index you built isn't being used</h2>
<p class="lead">You add an index and the query is still slow. Almost always one of three things: a <strong>function wraps the column</strong>, the query <strong>isn't selective enough</strong> to be worth an index, or the index simply doesn't fit the predicate. Indexes also aren't free — they cost you on every write — so the last part is knowing when <em>not</em> to add one.</p>

<h3>A function on the column defeats a plain index</h3>
<p>There's an index on <code>email</code>, but wrap the column in <code>lower()</code> and Postgres can't use it — the index stores <code>email</code>, not <code>lower(email)</code>:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> id <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> lower(email) = <span class="tok-string">'user250000@example.com'</span>;</code></pre>
<div class="out"> Seq Scan on event  (cost=0.00..15388.00 rows=2500 width=8) (actual time=87.565..163.337 rows=1 loops=1)
   Filter: (lower(email) = 'user250000@example.com'::text)
   Rows Removed by Filter: 499999
 Execution Time: 163.373 ms</div>
<p>163 ms — back to reading everything. The fix is an <strong>expression index</strong>: index the expression the query actually uses.</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_lower_email <span class="tok-keyword">ON</span> event(lower(email));</code></pre>
<div class="out"> Bitmap Heap Scan on event  (cost=115.80..5400.73 rows=2500 width=8) (actual time=0.053..0.054 rows=1 loops=1)
   Recheck Cond: (lower(email) = 'user250000@example.com'::text)
   Heap Blocks: exact=1
   -&gt;  Bitmap Index Scan on idx_event_lower_email  (cost=0.00..115.17 rows=2500 width=0) (actual time=0.041..0.042 rows=1 loops=1)
         Index Cond: (lower(email) = 'user250000@example.com'::text)
 Execution Time: 0.102 ms</div>
<p>163 ms → 0.1 ms. Same trap bites <code>WHERE date(created_at) = ...</code>, <code>WHERE email ILIKE ...</code>, and a leading-wildcard <code>LIKE '%foo'</code> (no B-tree can seek a suffix). Match the index to the exact expression — or rewrite the query to leave the column bare.</p>

<h3>Selectivity: the planner is right to skip an index</h3>
<p>Sometimes a Seq Scan is <em>correct</em>. Our <code>status</code> column is 66% <code>'active'</code>, 1% <code>'pending'</code>. With an index on <code>status</code>, watch the planner choose differently for each. First the common value:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_status <span class="tok-keyword">ON</span> event(status);
<span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> avg(amount) <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'active'</span>;   <span class="tok-comment">-- 330,000 rows</span></code></pre>
<div class="out"> Aggregate  (cost=14963.84..14963.85 rows=1 width=32) (actual time=78.718..78.718 rows=1 loops=1)
   -&gt;  Seq Scan on event  (cost=0.00..14138.00 rows=330333 width=6) (actual time=0.049..51.347 rows=330000 loops=1)
         Filter: (status = 'active'::text)
         Rows Removed by Filter: 170000
 Execution Time: 78.820 ms</div>
<p>It <em>ignored</em> the index — and rightly so. When a query returns most of the table, hopping through an index to 330,000 scattered rows is <em>slower</em> than reading the table straight through. Now the rare value:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> avg(amount) <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'pending'</span>;   <span class="tok-comment">-- 5,000 rows</span></code></pre>
<div class="out"> Aggregate  (cost=114.76..114.77 rows=1 width=8) (actual time=0.541..0.541 rows=1 loops=1)
   -&gt;  Bitmap Heap Scan on event  (cost=55.80..102.97 rows=4717 width=6) (actual time=0.201..0.420 rows=5000 loops=1)
         Recheck Cond: (status = 'pending'::text)
         Heap Blocks: exact=5000
         -&gt;  Bitmap Index Scan on idx_event_status  (cost=0.00..55.80 rows=4717 width=0) (actual time=0.480..0.480 rows=5000 loops=1)
               Index Cond: (status = 'pending'::text)
 Execution Time: 6.810 ms</div>
<p>Same index, opposite decision: 1% of rows is selective enough that the index wins. <strong>An index only helps when a query returns a small fraction of the table</strong> — indexing a low-cardinality flag you always filter to its common value is wasted disk.</p>

<h3>Partial index — index only the rows you query</h3>
<p>If you only ever query <code>status = 'pending'</code>, index <em>just those rows</em> with a <code>WHERE</code> clause on the index. It's tiny and stays out of the way of the other 99%:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_pending <span class="tok-keyword">ON</span> event(created_at) <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'pending'</span>;</code></pre>
<div class="out">   full  index on status  | 3408 kB
   partial idx_event_pending | 128 kB</div>
<p>128 kB versus 3.4 MB — a <strong>27× smaller</strong> index, because it holds 5,000 rows instead of 500,000. It's used for any query whose <code>WHERE</code> implies the partial condition, e.g. "oldest pending jobs". Partial indexes are the standard tool for "hot subset" columns — unprocessed rows, soft-deleted flags, active sessions.</p>

<h3>The cost side: writes</h3>
<p>Every index must be <em>updated on every INSERT, UPDATE, and DELETE</em>. Inserting 100,000 rows into a bare copy versus the fully-indexed <code>event</code> (nine indexes, built up across this chapter):</p>
<div class="out">   into bare table (0 indexes):   116 ms
   into event     (9 indexes):   1330 ms   -- ~11x slower</div>
<div class="callout warn">Indexes trade write speed and disk for read speed. Nine indexes made writes ~11× slower here. The discipline: index what you actually query, drop indexes nothing uses (<code>pg_stat_user_indexes.idx_scan = 0</code> flags them), and remember every redundant index is a tax on every write forever.</div>
<div class="note-ct">The site's "unread notifications" and "pending moderation" queues are perfect partial-index targets — a <code>WHERE read = false</code> partial index stays kilobytes even as the notifications table grows to millions. And the write-cost lesson is why the feed tables aren't blanketed in indexes: each one would slow every new post and every like.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: expression indexes, selectivity, and partial indexes</span><span class="lc-sub">The Code Lab track makes the planner flip between Seq Scan and index.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Vì sao chỉ mục bạn dựng không được dùng</h2>
<p class="lead">Bạn thêm một chỉ mục mà truy vấn vẫn chậm. Gần như luôn là một trong ba: một <strong>hàm bọc quanh cột</strong>, truy vấn <strong>không đủ chọn lọc</strong> để đáng dùng chỉ mục, hoặc chỉ mục đơn giản không khớp vị từ. Chỉ mục cũng không miễn phí — chúng tốn phí ở mỗi lần ghi — nên phần cuối là biết khi nào <em>đừng</em> thêm.</p>

<h3>Một hàm trên cột vô hiệu hoá chỉ mục thường</h3>
<p>Có một chỉ mục trên <code>email</code>, nhưng bọc cột trong <code>lower()</code> là Postgres không dùng được nó — chỉ mục lưu <code>email</code>, không phải <code>lower(email)</code>:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> id <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> lower(email) = <span class="tok-string">'user250000@example.com'</span>;</code></pre>
<div class="out"> Seq Scan on event  (cost=0.00..15388.00 rows=2500 width=8) (actual time=87.565..163.337 rows=1 loops=1)
   Filter: (lower(email) = 'user250000@example.com'::text)
   Rows Removed by Filter: 499999
 Execution Time: 163.373 ms</div>
<p>163 ms — lại đọc mọi thứ. Cách sửa là một <strong>expression index (chỉ mục biểu thức)</strong>: index chính biểu thức mà truy vấn dùng.</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_lower_email <span class="tok-keyword">ON</span> event(lower(email));</code></pre>
<div class="out"> Bitmap Heap Scan on event  (cost=115.80..5400.73 rows=2500 width=8) (actual time=0.053..0.054 rows=1 loops=1)
   Recheck Cond: (lower(email) = 'user250000@example.com'::text)
   Heap Blocks: exact=1
   -&gt;  Bitmap Index Scan on idx_event_lower_email  (cost=0.00..115.17 rows=2500 width=0) (actual time=0.041..0.042 rows=1 loops=1)
         Index Cond: (lower(email) = 'user250000@example.com'::text)
 Execution Time: 0.102 ms</div>
<p>163 ms → 0,1 ms. Cùng cái bẫy cắn <code>WHERE date(created_at) = ...</code>, <code>WHERE email ILIKE ...</code>, và <code>LIKE '%foo'</code> ký-tự-đại-diện-đầu (không B-tree nào nhảy tìm được hậu tố). Khớp chỉ mục với đúng biểu thức — hoặc viết lại truy vấn để cột trần.</p>

<h3>Độ chọn lọc: bộ lập kế hoạch bỏ qua chỉ mục là đúng</h3>
<p>Đôi khi một Seq Scan là <em>đúng</em>. Cột <code>status</code> của ta 66% là <code>'active'</code>, 1% là <code>'pending'</code>. Với một chỉ mục trên <code>status</code>, xem bộ lập kế hoạch chọn khác nhau cho mỗi giá trị. Trước hết giá trị phổ biến:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_status <span class="tok-keyword">ON</span> event(status);
<span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> avg(amount) <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'active'</span>;   <span class="tok-comment">-- 330.000 dòng</span></code></pre>
<div class="out"> Aggregate  (cost=14963.84..14963.85 rows=1 width=32) (actual time=78.718..78.718 rows=1 loops=1)
   -&gt;  Seq Scan on event  (cost=0.00..14138.00 rows=330333 width=6) (actual time=0.049..51.347 rows=330000 loops=1)
         Filter: (status = 'active'::text)
         Rows Removed by Filter: 170000
 Execution Time: 78.820 ms</div>
<p>Nó <em>bỏ qua</em> chỉ mục — và đúng đắn. Khi một truy vấn trả về phần lớn bảng, nhảy qua chỉ mục tới 330.000 dòng rải rác <em>chậm hơn</em> đọc bảng thẳng một mạch. Giờ giá trị hiếm:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> avg(amount) <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'pending'</span>;   <span class="tok-comment">-- 5.000 dòng</span></code></pre>
<div class="out"> Aggregate  (cost=114.76..114.77 rows=1 width=8) (actual time=0.541..0.541 rows=1 loops=1)
   -&gt;  Bitmap Heap Scan on event  (cost=55.80..102.97 rows=4717 width=6) (actual time=0.201..0.420 rows=5000 loops=1)
         Recheck Cond: (status = 'pending'::text)
         Heap Blocks: exact=5000
         -&gt;  Bitmap Index Scan on idx_event_status  (cost=0.00..55.80 rows=4717 width=0) (actual time=0.480..0.480 rows=5000 loops=1)
               Index Cond: (status = 'pending'::text)
 Execution Time: 6.810 ms</div>
<p>Cùng chỉ mục, quyết định ngược lại: 1% số dòng đủ chọn lọc để chỉ mục thắng. <strong>Một chỉ mục chỉ giúp khi truy vấn trả về một phần nhỏ của bảng</strong> — index một cờ ít giá trị mà bạn luôn lọc về giá trị phổ biến là phí đĩa.</p>

<h3>Partial index — chỉ index các dòng bạn hỏi</h3>
<p>Nếu bạn chỉ bao giờ hỏi <code>status = 'pending'</code>, hãy index <em>chỉ các dòng đó</em> bằng một mệnh đề <code>WHERE</code> trên chỉ mục. Nó tí hon và không cản đường 99% còn lại:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_pending <span class="tok-keyword">ON</span> event(created_at) <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'pending'</span>;</code></pre>
<div class="out">   chỉ mục đầy đủ trên status  | 3408 kB
   partial idx_event_pending    | 128 kB</div>
<p>128 kB so với 3,4 MB — một chỉ mục <strong>nhỏ hơn 27×</strong>, vì nó giữ 5.000 dòng thay vì 500.000. Nó được dùng cho bất kỳ truy vấn nào có <code>WHERE</code> ngụ ý điều kiện partial, ví dụ "job pending cũ nhất". Partial index là công cụ chuẩn cho các cột "tập con nóng" — dòng chưa xử lý, cờ xoá-mềm, phiên đang hoạt động.</p>

<h3>Mặt chi phí: ghi</h3>
<p>Mọi chỉ mục phải được <em>cập nhật ở mỗi INSERT, UPDATE, và DELETE</em>. Chèn 100.000 dòng vào một bản sao trơ so với bảng <code>event</code> đầy chỉ mục (chín chỉ mục, dựng dồn qua chương này):</p>
<div class="out">   vào bảng trơ (0 chỉ mục):    116 ms
   vào event   (9 chỉ mục):    1330 ms   -- chậm ~11 lần</div>
<div class="callout warn">Chỉ mục đánh đổi tốc độ ghi và đĩa lấy tốc độ đọc. Chín chỉ mục làm ghi chậm ~11× ở đây. Kỷ luật: index thứ bạn thật sự hỏi, bỏ chỉ mục không ai dùng (<code>pg_stat_user_indexes.idx_scan = 0</code> tố cáo chúng), và nhớ mỗi chỉ mục thừa là một thứ thuế trên mọi lần ghi, mãi mãi.</div>
<div class="note-ct">Hàng đợi "thông báo chưa đọc" và "chờ kiểm duyệt" của trang là mục tiêu partial-index hoàn hảo — một partial index <code>WHERE read = false</code> ở lại cỡ kilobyte kể cả khi bảng thông báo lớn tới hàng triệu dòng. Và bài học chi phí ghi là vì sao các bảng feed không bị phủ kín chỉ mục: mỗi cái sẽ làm chậm mọi bài mới và mọi lượt like.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: expression index, độ chọn lọc, và partial index</span><span class="lc-sub">Track Code Lab làm bộ lập kế hoạch lật giữa Seq Scan và chỉ mục.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Index types: B-tree, GIN, BRIN, GiST & unique|||9.4 — Các loại chỉ mục: B-tree, GIN, BRIN, GiST & unique',
      slug: 'postgresql-9-4-loai-chi-muc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ngoài B-tree: GIN cho jsonb/mảng/full-text (@>), BRIN tí hon cho dữ liệu sắp tự nhiên, GiST cho khoảng/hình học, và chỉ mục unique thực thi ràng buộc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Beyond B-tree — the right index for the shape of data</h2>
<p class="lead">B-tree handles ordered, scalar values — the vast majority of queries. But some data needs a different structure: the "contains" question over documents and arrays, huge naturally-ordered tables, geometric overlap. Postgres ships an index type for each. You rarely need them, but when you do, nothing else works.</p>

<h3>GIN — for jsonb, arrays, and full-text</h3>
<p>A B-tree indexes a whole value; <strong>GIN</strong> (Generalized Inverted iNdex) indexes the <em>elements inside</em> a value — every key in a jsonb, every element of an array, every word (lexeme) of a document. It powers the containment operator <code>@&gt;</code>. Our <code>props</code> column holds <code>{"tags": [...]}</code>; find events tagged <code>t15</code> — first with no GIN index:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> props @&gt; <span class="tok-string">'{"tags": ["t15"]}'</span>;</code></pre>
<div class="out">   -&gt;  Seq Scan on event  (cost=0.00..14138.00 rows=24617 width=0) (actual time=0.021..97.380 rows=25000 loops=1)
         Filter: (props @&gt; '{"tags": ["t15"]}'::jsonb)
         Rows Removed by Filter: 475000
 Execution Time: 98.711 ms</div>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_props <span class="tok-keyword">ON</span> event <span class="tok-keyword">USING GIN</span> (props);</code></pre>
<div class="out">   -&gt;  Bitmap Heap Scan on event  (cost=294.78..8490.49 rows=24617 width=0) (actual time=4.041..17.519 rows=25000 loops=1)
         Recheck Cond: (props @&gt; '{"tags": ["t15"]}'::jsonb)
         -&gt;  Bitmap Index Scan on idx_event_props  (cost=0.00..288.63 rows=24617 width=0) (actual time=3.217..3.217 rows=25000 loops=1)
               Index Cond: (props @&gt; '{"tags": ["t15"]}'::jsonb)
 Execution Time: 18.798 ms</div>
<p>99 ms → 19 ms — and it scales far better as the table grows. GIN is what makes jsonb querying and full-text search practical (Chapter 13 builds on it). It's slower to build and update than B-tree, so use it where you actually query the contents.</p>

<h3>BRIN — tiny index for naturally-ordered big tables</h3>
<p><strong>BRIN</strong> (Block Range INdex) stores just the min/max value per <em>block range</em> of the table — not per row. If a column is physically sorted (append-only timestamps, sequential ids), that's enough to skip whole swaths of the table. The magic is the size. Compare a B-tree and a BRIN on <code>created_at</code>:</p>
<div class="out">   B-tree(created_at) | 11 MB
   BRIN(created_at)   | 24 kB</div>
<p><strong>24 kB versus 11 MB</strong> — roughly 450× smaller, for the same 500,000 rows. A range query still flies:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_created_brin <span class="tok-keyword">ON</span> event <span class="tok-keyword">USING BRIN</span> (created_at);
<span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> event
<span class="tok-keyword">WHERE</span> created_at <span class="tok-keyword">BETWEEN</span> <span class="tok-string">'2024-03-01'</span> <span class="tok-keyword">AND</span> <span class="tok-string">'2024-03-08'</span>;</code></pre>
<div class="out">   -&gt;  Bitmap Heap Scan on event  (cost=14.65..8144.59 rows=10351 width=0) (actual time=0.519..2.623 rows=10081 loops=1)
         Recheck Cond: ((created_at &gt;= '2024-03-01 ...') AND (created_at &lt;= '2024-03-08 ...'))
         Heap Blocks: lossy=256
         -&gt;  Bitmap Index Scan on idx_event_created_brin  (cost=0.00..12.06 rows=16129 width=0) (actual time=0.027..0.027 rows=2560 loops=1)
 Execution Time: 3.147 ms</div>
<p>BRIN is "lossy" — it narrows to a set of blocks and rechecks (<code>Recheck Cond</code>). It only works if the column is physically ordered; on random data it degrades to a Seq Scan. Perfect for time-series and log tables that only ever append.</p>

<h3>The rest of the toolbox</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">B-tree (default)</span><span class="v">Equality, ranges, sorting, prefix LIKE. Your answer 95% of the time.</span></div>
  <div class="kv"><span class="k">GIN</span><span class="v">"Contains" over composite values: jsonb <code>@&gt;</code>, array overlap <code>&amp;&amp;</code>, full-text <code>@@</code>.</span></div>
  <div class="kv"><span class="k">BRIN</span><span class="v">Huge, naturally-ordered tables. Kilobytes instead of megabytes; append-only data.</span></div>
  <div class="kv"><span class="k">GiST</span><span class="v">Geometric / range / "nearest neighbour" and overlap — PostGIS, <code>tsrange</code>, exclusion constraints ("no two bookings overlap").</span></div>
  <div class="kv"><span class="k">Hash</span><span class="v">Equality only, no ranges. Rarely worth it over B-tree; mostly a historical curiosity.</span></div>
</div>

<h3>A unique index is a constraint</h3>
<p>You've been creating these since Chapter 3 without calling them indexes. A <code>PRIMARY KEY</code> or <code>UNIQUE</code> constraint <em>is</em> a unique B-tree index — it's how Postgres both enforces uniqueness and makes the lookup fast. <code>CREATE UNIQUE INDEX</code> is the same thing spelled directly:</p>
<pre><code><span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_event_email <span class="tok-keyword">ON</span> event(email);   <span class="tok-comment">-- rejects duplicates AND speeds lookups</span></code></pre>
<div class="callout ok">Reach for B-tree by default. Use <strong>GIN</strong> when you query <em>inside</em> jsonb/arrays/text, <strong>BRIN</strong> for append-only time-series where index size matters, and <strong>GiST</strong> for ranges/geometry/overlap. And remember every unique constraint you write is already an index working for you.</div>
<div class="note-ct">This maps straight onto the site: tag and jsonb-metadata search wants GIN (Chapter 13 wires up full-text this way), an events/audit-log table that only appends is the textbook BRIN case, and "these two bookings can't overlap" is a GiST exclusion constraint. That's Phase 3's foundation laid — next chapter reads the planner itself with EXPLAIN, to understand <em>why</em> it picks each of these.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next chapter: EXPLAIN & the query planner</span><span class="lc-sub">Read cost estimates, join strategies, and why the planner chose the plan it did.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Vượt khỏi B-tree — chỉ mục đúng cho hình dạng dữ liệu</h2>
<p class="lead">B-tree xử lý các giá trị vô hướng, có thứ tự — phần lớn áp đảo truy vấn. Nhưng vài loại dữ liệu cần cấu trúc khác: câu hỏi "chứa" trên tài liệu và mảng, bảng khổng lồ sắp tự nhiên, chồng lấn hình học. Postgres có một loại chỉ mục cho mỗi thứ. Bạn hiếm khi cần chúng, nhưng khi cần, không gì khác chạy được.</p>

<h3>GIN — cho jsonb, mảng, và full-text</h3>
<p>Một B-tree index cả một giá trị; <strong>GIN</strong> (Generalized Inverted iNdex) index các <em>phần tử bên trong</em> một giá trị — mỗi khoá trong một jsonb, mỗi phần tử của một mảng, mỗi từ (lexeme) của một tài liệu. Nó cấp sức cho toán tử chứa <code>@&gt;</code>. Cột <code>props</code> của ta giữ <code>{"tags": [...]}</code>; tìm event gắn thẻ <code>t15</code> — trước hết không có chỉ mục GIN:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> event <span class="tok-keyword">WHERE</span> props @&gt; <span class="tok-string">'{"tags": ["t15"]}'</span>;</code></pre>
<div class="out">   -&gt;  Seq Scan on event  (cost=0.00..14138.00 rows=24617 width=0) (actual time=0.021..97.380 rows=25000 loops=1)
         Filter: (props @&gt; '{"tags": ["t15"]}'::jsonb)
         Rows Removed by Filter: 475000
 Execution Time: 98.711 ms</div>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_props <span class="tok-keyword">ON</span> event <span class="tok-keyword">USING GIN</span> (props);</code></pre>
<div class="out">   -&gt;  Bitmap Heap Scan on event  (cost=294.78..8490.49 rows=24617 width=0) (actual time=4.041..17.519 rows=25000 loops=1)
         Recheck Cond: (props @&gt; '{"tags": ["t15"]}'::jsonb)
         -&gt;  Bitmap Index Scan on idx_event_props  (cost=0.00..288.63 rows=24617 width=0) (actual time=3.217..3.217 rows=25000 loops=1)
               Index Cond: (props @&gt; '{"tags": ["t15"]}'::jsonb)
 Execution Time: 18.798 ms</div>
<p>99 ms → 19 ms — và co giãn tốt hơn nhiều khi bảng lớn lên. GIN là thứ làm truy vấn jsonb và full-text search khả thi (Chương 13 xây trên nó). Nó dựng và cập nhật chậm hơn B-tree, nên dùng nơi bạn thật sự hỏi nội dung.</p>

<h3>BRIN — chỉ mục tí hon cho bảng lớn sắp tự nhiên</h3>
<p><strong>BRIN</strong> (Block Range INdex) chỉ lưu giá trị min/max cho mỗi <em>dải khối (block range)</em> của bảng — không phải mỗi dòng. Nếu một cột được sắp về mặt vật lý (timestamp chỉ-thêm, id tuần tự), thế là đủ để bỏ qua cả mảng lớn của bảng. Điều kỳ diệu là kích thước. So một B-tree và một BRIN trên <code>created_at</code>:</p>
<div class="out">   B-tree(created_at) | 11 MB
   BRIN(created_at)   | 24 kB</div>
<p><strong>24 kB so với 11 MB</strong> — nhỏ hơn khoảng 450×, cho cùng 500.000 dòng. Một truy vấn khoảng vẫn bay:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_event_created_brin <span class="tok-keyword">ON</span> event <span class="tok-keyword">USING BRIN</span> (created_at);
<span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> event
<span class="tok-keyword">WHERE</span> created_at <span class="tok-keyword">BETWEEN</span> <span class="tok-string">'2024-03-01'</span> <span class="tok-keyword">AND</span> <span class="tok-string">'2024-03-08'</span>;</code></pre>
<div class="out">   -&gt;  Bitmap Heap Scan on event  (cost=14.65..8144.59 rows=10351 width=0) (actual time=0.519..2.623 rows=10081 loops=1)
         Recheck Cond: ((created_at &gt;= '2024-03-01 ...') AND (created_at &lt;= '2024-03-08 ...'))
         Heap Blocks: lossy=256
         -&gt;  Bitmap Index Scan on idx_event_created_brin  (cost=0.00..12.06 rows=16129 width=0) (actual time=0.027..0.027 rows=2560 loops=1)
 Execution Time: 3.147 ms</div>
<p>BRIN là "lossy" — nó thu hẹp về một tập khối rồi kiểm lại (<code>Recheck Cond</code>). Nó chỉ chạy nếu cột được sắp về mặt vật lý; trên dữ liệu ngẫu nhiên nó thoái hoá thành Seq Scan. Hoàn hảo cho bảng chuỗi-thời-gian và log chỉ bao giờ thêm vào.</p>

<h3>Phần còn lại của hộp công cụ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">B-tree (mặc định)</span><span class="v">Bằng, khoảng, sắp xếp, LIKE đầu chuỗi. Câu trả lời của bạn 95% thời gian.</span></div>
  <div class="kv"><span class="k">GIN</span><span class="v">"Chứa" trên giá trị phức hợp: jsonb <code>@&gt;</code>, giao mảng <code>&amp;&amp;</code>, full-text <code>@@</code>.</span></div>
  <div class="kv"><span class="k">BRIN</span><span class="v">Bảng khổng lồ, sắp tự nhiên. Kilobyte thay vì megabyte; dữ liệu chỉ-thêm.</span></div>
  <div class="kv"><span class="k">GiST</span><span class="v">Hình học / khoảng / "hàng xóm gần nhất" và chồng lấn — PostGIS, <code>tsrange</code>, ràng buộc loại trừ ("không hai đặt chỗ nào chồng nhau").</span></div>
  <div class="kv"><span class="k">Hash</span><span class="v">Chỉ bằng, không khoảng. Hiếm khi đáng hơn B-tree; phần lớn là hiếu kỳ lịch sử.</span></div>
</div>

<h3>Một chỉ mục unique là một ràng buộc</h3>
<p>Bạn đã tạo những cái này từ Chương 3 mà không gọi chúng là chỉ mục. Một ràng buộc <code>PRIMARY KEY</code> hay <code>UNIQUE</code> <em>chính là</em> một chỉ mục B-tree unique — đó là cách Postgres vừa ép tính duy nhất vừa làm tra cứu nhanh. <code>CREATE UNIQUE INDEX</code> là đúng thứ đó viết trực tiếp:</p>
<pre><code><span class="tok-keyword">CREATE UNIQUE INDEX</span> uq_event_email <span class="tok-keyword">ON</span> event(email);   <span class="tok-comment">-- từ chối trùng VÀ tăng tốc tra cứu</span></code></pre>
<div class="callout ok">Mặc định chọn B-tree. Dùng <strong>GIN</strong> khi bạn hỏi <em>bên trong</em> jsonb/mảng/text, <strong>BRIN</strong> cho chuỗi-thời-gian chỉ-thêm nơi kích thước chỉ mục quan trọng, và <strong>GiST</strong> cho khoảng/hình học/chồng lấn. Và nhớ mọi ràng buộc unique bạn viết đã là một chỉ mục đang làm việc cho bạn.</div>
<div class="note-ct">Điều này ánh xạ thẳng vào trang: tìm thẻ và siêu-dữ-liệu-jsonb cần GIN (Chương 13 nối full-text theo cách này), một bảng event/nhật-ký-kiểm-toán chỉ thêm là ca BRIN kinh điển, và "hai đặt chỗ này không được chồng nhau" là một ràng buộc loại trừ GiST. Đó là nền của Giai đoạn 3 đã đặt xong — chương tới đọc chính bộ lập kế hoạch bằng EXPLAIN, để hiểu <em>vì sao</em> nó chọn mỗi cái này.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Chương tới: EXPLAIN & bộ lập kế hoạch truy vấn</span><span class="lc-sub">Đọc ước lượng chi phí, chiến lược join, và vì sao bộ lập kế hoạch chọn plan đó.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 9.5 Quiz ─────────────────────────── */
    {
      title: '9.5 — Chapter 9 quiz|||9.5 — Kiểm tra Chương 9',
      slug: 'postgresql-9-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về B-tree, đọc EXPLAIN ANALYZE, chỉ mục tổ hợp & thứ tự cột, covering, độ chọn lọc, partial index, chi phí ghi, và các loại chỉ mục.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on indexes and reading query plans. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: the left-prefix rule for composite indexes (9.2), and that an index only helps a <em>selective</em> query — the planner is right to Seq Scan a common value (9.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về chỉ mục và đọc plan truy vấn. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: luật tiền-tố-trái cho chỉ mục tổ hợp (9.2), và việc một chỉ mục chỉ giúp truy vấn <em>chọn lọc</em> — bộ lập kế hoạch Seq Scan một giá trị phổ biến là đúng (9.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'In an EXPLAIN ANALYZE plan, "Rows Removed by Filter: 499999" on a Seq Scan tells you what?|||Trong một plan EXPLAIN ANALYZE, "Rows Removed by Filter: 499999" trên một Seq Scan cho bạn biết gì?',
            options: [
              'The query is fast|||Truy vấn nhanh',
              'Postgres inspected nearly every row and discarded almost all of them — a missing index|||Postgres xét gần như mọi dòng và vứt bỏ hầu hết — thiếu một chỉ mục',
              'The index is corrupt|||Chỉ mục bị hỏng',
              'There are 499999 matching rows|||Có 499999 dòng khớp',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'PostgreSQL\'s default index type is best for?|||Loại chỉ mục mặc định của PostgreSQL tốt nhất cho?',
            options: [
              'jsonb containment only|||Chỉ chứa jsonb',
              'B-tree: equality, ranges, sorting, and prefix LIKE|||B-tree: bằng, khoảng, sắp xếp, và LIKE đầu chuỗi',
              'Full-text search only|||Chỉ full-text search',
              'Geometric overlap only|||Chỉ chồng lấn hình học',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A composite index on (user_id, created_at) can efficiently serve which query?|||Một chỉ mục tổ hợp trên (user_id, created_at) phục vụ hiệu quả truy vấn nào?',
            options: [
              'WHERE created_at = X (only the second column)|||WHERE created_at = X (chỉ cột thứ hai)',
              'WHERE user_id = 42 ORDER BY created_at (a left prefix)|||WHERE user_id = 42 ORDER BY created_at (một tiền tố trái)',
              'Any query on either column alone|||Bất kỳ truy vấn nào trên một trong hai cột',
              'Only WHERE user_id = 42 AND created_at = X, nothing else|||Chỉ WHERE user_id = 42 AND created_at = X, không gì khác',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An "Index Only Scan" with "Heap Fetches: 0" means?|||Một "Index Only Scan" với "Heap Fetches: 0" nghĩa là?',
            options: [
              'The query failed|||Truy vấn thất bại',
              'Postgres answered entirely from the index without reading the table|||Postgres trả lời hoàn toàn từ chỉ mục mà không đọc bảng',
              'The index is unused|||Chỉ mục không được dùng',
              'It read the whole heap|||Nó đọc cả heap',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does WHERE lower(email) = \'x\' not use a plain index on email?|||Vì sao WHERE lower(email) = \'x\' không dùng một chỉ mục thường trên email?',
            options: [
              'lower() is not allowed in WHERE|||lower() không được phép trong WHERE',
              'The index stores email, not lower(email); you need an expression index on lower(email)|||Chỉ mục lưu email, không phải lower(email); bạn cần một expression index trên lower(email)',
              'Indexes never work with text|||Chỉ mục không bao giờ chạy với text',
              'email must be a primary key|||email phải là khoá chính',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The planner chooses a Seq Scan for WHERE status = \'active\' (66% of rows) but an index for \'pending\' (1%). Why?|||Bộ lập kế hoạch chọn Seq Scan cho WHERE status = \'active\' (66% dòng) nhưng chỉ mục cho \'pending\' (1%). Vì sao?',
            options: [
              'A bug in the planner|||Một lỗi của bộ lập kế hoạch',
              'An index only helps a selective query; reading most of the table is faster sequentially|||Chỉ mục chỉ giúp truy vấn chọn lọc; đọc phần lớn bảng nhanh hơn theo tuần tự',
              'The active rows are corrupt|||Các dòng active bị hỏng',
              'pending has no index|||pending không có chỉ mục',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the main trade-off of adding many indexes to a table?|||Đánh đổi chính của việc thêm nhiều chỉ mục vào một bảng là gì?',
            options: [
              'Reads get slower|||Đọc chậm đi',
              'Every INSERT/UPDATE/DELETE gets slower and disk usage grows, since each index must be maintained|||Mỗi INSERT/UPDATE/DELETE chậm đi và dùng nhiều đĩa hơn, vì mỗi chỉ mục phải được duy trì',
              'Nothing, indexes are free|||Không gì cả, chỉ mục miễn phí',
              'The table can no longer be queried|||Bảng không còn truy vấn được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which index type would you use to query inside a jsonb column with the @> containment operator?|||Bạn dùng loại chỉ mục nào để truy vấn bên trong một cột jsonb với toán tử chứa @>?',
            options: [
              'B-tree|||B-tree',
              'GIN|||GIN',
              'BRIN|||BRIN',
              'Hash|||Hash',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
