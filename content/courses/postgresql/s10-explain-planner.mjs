/**
 * PostgreSQL — Chương 10: EXPLAIN & bộ lập kế hoạch (Giai đoạn 3 — Hiệu năng).
 * Đọc EXPLAIN vs EXPLAIN ANALYZE (cost/rows/width/actual/loops, đọc cây từ trong ra) ·
 * ba chiến lược JOIN Nested Loop/Hash/Merge (2 bảng customer 10k + ord 500k) ·
 * thống kê & ước lượng: ANALYZE, cột tương quan → ước lượng sai → CREATE STATISTICS ·
 * BUFFERS (shared hit/read) + quy trình tinh chỉnh. Output CHẠY THẬT PG 15.4 (schema ch10),
 * SET max_parallel_workers_per_gather=0 để plan gọn.
 * LUẬT: < > trong code/out → &lt; &gt; (mũi tên -> của EXPLAIN → -&gt;, so sánh >= → &gt;=);
 * & → &amp;; backtick → &#96;; ${ → \${. Khối .out LUÔN đóng </div> (KHÔNG </code></pre>).
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 10 — EXPLAIN & the query planner|||Chương 10 — EXPLAIN & bộ lập kế hoạch',
  description: 'Đọc kế hoạch truy vấn để hiểu vì sao Postgres chọn cách chạy như vậy: giải phẫu EXPLAIN và EXPLAIN ANALYZE, ba chiến lược JOIN (Nested Loop / Hash / Merge), cách bộ lập kế hoạch ước lượng số dòng và khi nào nó sai, đọc BUFFERS, và một quy trình tinh chỉnh có kỷ luật.',
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — Reading a plan: EXPLAIN vs EXPLAIN ANALYZE|||10.1 — Đọc một plan: EXPLAIN vs EXPLAIN ANALYZE',
      slug: 'postgresql-10-1-doc-explain',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Giải phẫu một plan: cost/rows/width là ước lượng, actual time/rows/loops là thật; cách đọc cây plan từ trong ra ngoài; và vì sao ước lượng khớp thực tế là dấu hiệu khoẻ mạnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1 · Phase 3 — Performance</span>
<h2>The planner shows its work</h2>
<p class="lead">Chapter 9 used <code>EXPLAIN ANALYZE</code> to prove an index helped. This chapter goes deeper: every number in a plan, why Postgres chose <em>this</em> plan over the alternatives, and how to act on what you read. The planner is a cost-based optimiser — it estimates the cost of several ways to run your query and picks the cheapest. <code>EXPLAIN</code> shows you that decision.</p>
<p>All examples use two tables: <code>customer</code> (10,000 rows) and <code>ord</code> (500,000 orders, each with a <code>customer_id</code>).</p>

<h3>Plain EXPLAIN — the estimate, without running</h3>
<p><code>EXPLAIN</code> alone shows the plan the optimiser <em>would</em> use, with its cost estimates. It does <strong>not</strong> execute the query — instant and safe, even on an <code>UPDATE</code> or <code>DELETE</code>:</p>
<pre><code><span class="tok-keyword">EXPLAIN</span> <span class="tok-keyword">SELECT</span> count(*), avg(amount) <span class="tok-keyword">FROM</span> ord <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'refunded'</span>;</code></pre>
<div class="out"> Aggregate  (cost=10114.75..10114.76 rows=1 width=40)
   -&gt;  Seq Scan on ord  (cost=0.00..10067.00 rows=9550 width=6)
         Filter: (status = 'refunded'::text)</div>
<p>Read the tree <strong>inside-out, bottom-up</strong>: the indented <code>Seq Scan</code> runs first and feeds its rows up to the <code>Aggregate</code>. Each node carries three estimates:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">cost=0.00..10067.00</span><span class="v"><strong>startup..total</strong> cost in arbitrary units. Startup = work before the first row (0 for a seq scan); total = work for all rows. Used only to compare plans.</span></div>
  <div class="kv"><span class="k">rows=9550</span><span class="v">The planner's <em>estimated</em> row count out of this node. This number drives every downstream decision — get it wrong and the whole plan can go wrong.</span></div>
  <div class="kv"><span class="k">width=6</span><span class="v">Estimated average bytes per row. Matters for memory (sorts, hashes) and network.</span></div>
</div>

<h3>EXPLAIN ANALYZE — actually run it, and compare</h3>
<p>Add <code>ANALYZE</code> and Postgres <em>runs</em> the query and reports what really happened, next to the estimates:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> count(*), avg(amount) <span class="tok-keyword">FROM</span> ord <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'refunded'</span>;</code></pre>
<div class="out"> Aggregate  (cost=10114.75..10114.76 rows=1 width=40) (actual time=27.426..27.427 rows=1 loops=1)
   -&gt;  Seq Scan on ord  (cost=0.00..10067.00 rows=9550 width=6) (actual time=0.011..26.700 rows=10000 loops=1)
         Filter: (status = 'refunded'::text)
         Rows Removed by Filter: 490000
 Planning Time: 0.789 ms
 Execution Time: 27.518 ms</div>
<p>Now each node has an <code>actual</code> block too:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">actual time=0.011..26.700</span><span class="v">Real milliseconds: time to the <em>first</em> row .. time to the <em>last</em> row, for this node.</span></div>
  <div class="kv"><span class="k">rows=10000</span><span class="v">The <em>actual</em> rows produced. Compare to the estimate (9550): close, so the stats are healthy.</span></div>
  <div class="kv"><span class="k">loops=1</span><span class="v">How many times this node ran. Times and rows are <strong>per loop</strong> — multiply by loops for the total (crucial in Nested Loops, next lesson).</span></div>
</div>
<p>The single most useful comparison is <strong>estimated rows vs actual rows</strong>. Here 9550 ≈ 10000 — the planner understood the data, so it costed the plan correctly. When those two diverge wildly (say estimate 5, actual 500,000), the planner made its choice on bad information — the root cause of most bad plans, which lesson 10.3 tackles.</p>
<div class="callout warn"><code>EXPLAIN</code> never runs the query; <code>EXPLAIN ANALYZE</code> <em>does</em> — including the side effects of <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code>. To time a write without changing data, wrap it: <code>BEGIN; EXPLAIN ANALYZE UPDATE ...; ROLLBACK;</code> (the same safety trick from Chapter 1).</div>
<div class="note-ct">This is the tool behind every "why is this endpoint slow?" investigation on the site. Paste the exact query into <code>EXPLAIN ANALYZE</code>, look for a <code>Seq Scan</code> with a huge <code>Rows Removed by Filter</code>, and you've usually found the missing index in one step — no guessing, no profiler.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: read cost, rows, and actual on real plans</span><span class="lc-sub">The Code Lab track builds the customer + ord tables used all chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1 · Giai đoạn 3 — Hiệu năng</span>
<h2>Bộ lập kế hoạch cho xem bài làm của nó</h2>
<p class="lead">Chương 9 dùng <code>EXPLAIN ANALYZE</code> để chứng minh một chỉ mục có giúp. Chương này đi sâu hơn: từng con số trong một plan, vì sao Postgres chọn <em>plan này</em> thay vì các phương án khác, và cách hành động theo điều bạn đọc được. Bộ lập kế hoạch là một trình tối ưu dựa trên chi phí — nó ước lượng chi phí của vài cách chạy truy vấn và chọn cách rẻ nhất. <code>EXPLAIN</code> cho bạn thấy quyết định đó.</p>
<p>Mọi ví dụ dùng hai bảng: <code>customer</code> (10.000 dòng) và <code>ord</code> (500.000 đơn, mỗi đơn có một <code>customer_id</code>).</p>

<h3>EXPLAIN trơn — ước lượng, không chạy</h3>
<p><code>EXPLAIN</code> một mình cho thấy plan mà trình tối ưu <em>sẽ</em> dùng, kèm ước lượng chi phí. Nó <strong>không</strong> chạy truy vấn — tức thì và an toàn, kể cả trên một <code>UPDATE</code> hay <code>DELETE</code>:</p>
<pre><code><span class="tok-keyword">EXPLAIN</span> <span class="tok-keyword">SELECT</span> count(*), avg(amount) <span class="tok-keyword">FROM</span> ord <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'refunded'</span>;</code></pre>
<div class="out"> Aggregate  (cost=10114.75..10114.76 rows=1 width=40)
   -&gt;  Seq Scan on ord  (cost=0.00..10067.00 rows=9550 width=6)
         Filter: (status = 'refunded'::text)</div>
<p>Đọc cây <strong>từ trong ra, dưới lên</strong>: <code>Seq Scan</code> thụt vào chạy trước và đưa dòng của nó lên <code>Aggregate</code>. Mỗi nút mang ba ước lượng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">cost=0.00..10067.00</span><span class="v"><strong>khởi động..tổng</strong> chi phí theo đơn vị quy ước. Khởi động = việc trước dòng đầu (0 cho seq scan); tổng = việc cho mọi dòng. Chỉ dùng để so plan.</span></div>
  <div class="kv"><span class="k">rows=9550</span><span class="v">Số dòng <em>ước lượng</em> ra khỏi nút này. Con số này lái mọi quyết định phía sau — sai nó là cả plan có thể sai.</span></div>
  <div class="kv"><span class="k">width=6</span><span class="v">Số byte trung bình ước lượng mỗi dòng. Quan trọng cho bộ nhớ (sort, hash) và mạng.</span></div>
</div>

<h3>EXPLAIN ANALYZE — chạy thật, và so sánh</h3>
<p>Thêm <code>ANALYZE</code> là Postgres <em>chạy</em> truy vấn và báo cáo điều thực sự xảy ra, ngay cạnh ước lượng:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> count(*), avg(amount) <span class="tok-keyword">FROM</span> ord <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'refunded'</span>;</code></pre>
<div class="out"> Aggregate  (cost=10114.75..10114.76 rows=1 width=40) (actual time=27.426..27.427 rows=1 loops=1)
   -&gt;  Seq Scan on ord  (cost=0.00..10067.00 rows=9550 width=6) (actual time=0.011..26.700 rows=10000 loops=1)
         Filter: (status = 'refunded'::text)
         Rows Removed by Filter: 490000
 Planning Time: 0.789 ms
 Execution Time: 27.518 ms</div>
<p>Giờ mỗi nút có thêm một khối <code>actual</code>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">actual time=0.011..26.700</span><span class="v">Mili-giây thật: thời gian tới dòng <em>đầu</em> .. thời gian tới dòng <em>cuối</em>, cho nút này.</span></div>
  <div class="kv"><span class="k">rows=10000</span><span class="v">Số dòng <em>thật</em> tạo ra. So với ước lượng (9550): sát nhau, nên thống kê khoẻ mạnh.</span></div>
  <div class="kv"><span class="k">loops=1</span><span class="v">Số lần nút này chạy. Thời gian và số dòng là <strong>mỗi vòng</strong> — nhân với loops ra tổng (then chốt trong Nested Loop, bài sau).</span></div>
</div>
<p>Phép so sánh hữu ích nhất là <strong>rows ước lượng vs rows thật</strong>. Ở đây 9550 ≈ 10000 — bộ lập kế hoạch hiểu dữ liệu, nên nó tính chi phí đúng. Khi hai số đó lệch nhau khủng khiếp (ví dụ ước lượng 5, thật 500.000), bộ lập kế hoạch chọn dựa trên thông tin sai — nguồn gốc của phần lớn plan tồi, mà bài 10.3 xử lý.</p>
<div class="callout warn"><code>EXPLAIN</code> không bao giờ chạy truy vấn; <code>EXPLAIN ANALYZE</code> <em>có</em> — kể cả tác dụng phụ của <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code>. Để đo một lệnh ghi mà không đổi dữ liệu, bọc nó: <code>BEGIN; EXPLAIN ANALYZE UPDATE ...; ROLLBACK;</code> (đúng mẹo an toàn từ Chương 1).</div>
<div class="note-ct">Đây là công cụ đằng sau mọi cuộc điều tra "vì sao endpoint này chậm?" trên trang. Dán đúng truy vấn vào <code>EXPLAIN ANALYZE</code>, tìm một <code>Seq Scan</code> với <code>Rows Removed by Filter</code> khổng lồ, và bạn thường đã tìm ra chỉ mục thiếu trong một bước — không đoán, không cần profiler.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đọc cost, rows, và actual trên plan thật</span><span class="lc-sub">Track Code Lab dựng bảng customer + ord dùng cả chương.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — Join strategies: Nested Loop, Hash & Merge|||10.2 — Chiến lược JOIN: Nested Loop, Hash & Merge',
      slug: 'postgresql-10-2-chien-luoc-join',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba cách Postgres thực hiện một JOIN và khi nào nó chọn cách nào: Nested Loop cho ít dòng, Hash Join cho join lớn, Merge Join cho dữ liệu đã sắp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Three ways to join two tables</h2>
<p class="lead">A <code>JOIN</code> in SQL is one operation, but Postgres has <em>three</em> algorithms to execute it, and the planner picks based on how many rows are involved and whether they're indexed or sorted. Recognising each in a plan tells you instantly whether the join is healthy.</p>

<h3>Nested Loop — great for a few rows</h3>
<p>For each row on the outer side, look up matches on the inner side. It's a nested <code>for</code> loop. Cheap <em>only</em> when the outer side is small and the inner lookup is indexed. Fetch 5 orders and their customers:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> o.id, o.amount, c.name, c.city
<span class="tok-keyword">FROM</span> ord o <span class="tok-keyword">JOIN</span> customer c <span class="tok-keyword">ON</span> c.id = o.customer_id
<span class="tok-keyword">WHERE</span> o.id <span class="tok-keyword">BETWEEN</span> 1 <span class="tok-keyword">AND</span> 5;</code></pre>
<div class="out"> Nested Loop  (cost=0.71..50.04 rows=5 width=33) (actual time=0.026..0.036 rows=5 loops=1)
   -&gt;  Index Scan using ord_pkey on ord o  (cost=0.42..8.52 rows=5 width=18) (actual time=0.019..0.021 rows=5 loops=1)
         Index Cond: ((id &gt;= 1) AND (id &lt;= 5))
   -&gt;  Index Scan using customer_pkey on customer c  (cost=0.29..8.30 rows=1 width=23) (actual time=0.001..0.001 rows=1 loops=5)
         Index Cond: (id = o.customer_id)
 Execution Time: 0.087 ms</div>
<p>The outer scan finds 5 orders; the inner scan runs once per order — <code>loops=5</code>. Because the inner side hits <code>customer_pkey</code>, each lookup is ~instant. Total: 0.087 ms. But watch that <code>loops</code>: if the outer side were 500,000 rows, this same plan would do 500,000 index lookups — a Nested Loop over a large outer side is a classic performance trap.</p>

<h3>Hash Join — the workhorse for big joins</h3>
<p>Join every order to its customer. There's no filter, so millions of rows are involved and a Nested Loop would be hopeless. Postgres builds a <strong>hash table</strong> of the smaller side (customer) in memory, then scans the big side (ord) once, probing the hash:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> c.region, count(*), sum(o.amount)
<span class="tok-keyword">FROM</span> ord o <span class="tok-keyword">JOIN</span> customer c <span class="tok-keyword">ON</span> c.id = o.customer_id
<span class="tok-keyword">GROUP BY</span> c.region;</code></pre>
<div class="out"> HashAggregate  (cost=14186.94..14186.98 rows=3 width=46) (actual time=176.307..176.310 rows=3 loops=1)
   Group Key: c.region
   -&gt;  Hash Join  (cost=311.00..10441.06 rows=499451 width=12) (actual time=2.527..107.581 rows=500000 loops=1)
         Hash Cond: (o.customer_id = c.id)
         -&gt;  Seq Scan on ord o  (cost=0.00..8817.00 rows=500000 width=10) (actual time=0.006..30.763 rows=500000 loops=1)
         -&gt;  Hash  (cost=186.00..186.00 rows=10000 width=10) (actual time=2.469..2.470 rows=10000 loops=1)
               Buckets: 16384  Batches: 1  Memory Usage: 558kB
               -&gt;  Seq Scan on customer c  (cost=0.00..186.00 rows=10000 width=10) (actual time=0.005..1.058 rows=10000 loops=1)
 Execution Time: 176.440 ms</div>
<p>The <code>Hash</code> node builds a 558 kB table of all 10,000 customers (<code>loops=1</code>, built once), then the <code>Hash Join</code> scans 500,000 orders and probes it. No index needed — it's <code>loops=1</code> on both sides. This is the right shape for large joins, and why <strong>joining unindexed big tables is fine</strong> as long as one side fits in <code>work_mem</code>.</p>

<h3>Merge Join — for pre-sorted inputs</h3>
<p>If both sides are already sorted on the join key, Postgres can zip them together like a merge sort. To reveal it, disable the other two strategies (a <em>diagnostic</em> trick — never do this in production) on the same query:</p>
<pre><code><span class="tok-keyword">SET</span> enable_hashjoin = off;  <span class="tok-keyword">SET</span> enable_nestloop = off;   <span class="tok-comment">-- diagnosis only!</span>
<span class="tok-comment">-- ...same join as above...</span></code></pre>
<div class="out"> Merge Join  (cost=65543.56..73087.57 rows=499451 width=12) (actual time=112.763..206.352 rows=500000 loops=1)
   Merge Cond: (o.customer_id = c.id)
   -&gt;  Sort  (cost=64692.92..65942.92 rows=500000 width=10) (actual time=110.673..147.153 rows=500000 loops=1)
         Sort Key: o.customer_id
         Sort Method: external merge  Disk: 10824kB
         -&gt;  Seq Scan on ord o  (cost=0.00..8817.00 rows=500000 width=10) ...
   -&gt;  Sort  (cost=850.39..875.39 rows=10000 width=10) (actual time=2.081..2.504 rows=10000 loops=1)
         Sort Key: c.id ...</div>
<p>Merge Join needs both inputs sorted, so here it had to <code>Sort</code> both first — the big one even spilled to disk (<code>external merge Disk: 10824kB</code>). Total cost <strong>76833 vs the Hash Join's 14186</strong>, which is exactly why the planner rejected it. Merge Join shines when the sort is free — inputs already ordered by an index.</p>
<div class="callout ok">Rule of thumb the planner follows: <strong>few rows + indexed inner → Nested Loop</strong>; <strong>large unsorted join → Hash Join</strong>; <strong>both sides already sorted on the key → Merge Join</strong>. In a plan, a Nested Loop with a big <code>loops=</code> count, or a Hash/Merge that spills to disk, is where to look when a join is slow.</div>
<div class="note-ct">The tell-tale bug on the site was always a Nested Loop over a large outer side because a foreign-key column had no index (Chapter 9): the inner "lookup" fell back to a Seq Scan run thousands of times — <code>loops=5000</code>, each a full table scan. Indexing the FK let the planner switch to a Hash Join and the endpoint went from seconds to milliseconds.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: spot Nested Loop, Hash, and Merge in plans</span><span class="lc-sub">The Code Lab track flips a query between all three with planner knobs.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Ba cách join hai bảng</h2>
<p class="lead">Một <code>JOIN</code> trong SQL là một phép, nhưng Postgres có <em>ba</em> thuật toán để thực hiện nó, và bộ lập kế hoạch chọn dựa trên có bao nhiêu dòng tham gia và chúng đã được index hay sắp chưa. Nhận ra từng cái trong một plan cho bạn biết ngay join có khoẻ không.</p>

<h3>Nested Loop — tuyệt cho ít dòng</h3>
<p>Với mỗi dòng ở phía ngoài, tra các khớp ở phía trong. Đó là một vòng <code>for</code> lồng nhau. Rẻ <em>chỉ khi</em> phía ngoài nhỏ và phép tra phía trong có index. Lấy 5 đơn và khách hàng của chúng:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> o.id, o.amount, c.name, c.city
<span class="tok-keyword">FROM</span> ord o <span class="tok-keyword">JOIN</span> customer c <span class="tok-keyword">ON</span> c.id = o.customer_id
<span class="tok-keyword">WHERE</span> o.id <span class="tok-keyword">BETWEEN</span> 1 <span class="tok-keyword">AND</span> 5;</code></pre>
<div class="out"> Nested Loop  (cost=0.71..50.04 rows=5 width=33) (actual time=0.026..0.036 rows=5 loops=1)
   -&gt;  Index Scan using ord_pkey on ord o  (cost=0.42..8.52 rows=5 width=18) (actual time=0.019..0.021 rows=5 loops=1)
         Index Cond: ((id &gt;= 1) AND (id &lt;= 5))
   -&gt;  Index Scan using customer_pkey on customer c  (cost=0.29..8.30 rows=1 width=23) (actual time=0.001..0.001 rows=1 loops=5)
         Index Cond: (id = o.customer_id)
 Execution Time: 0.087 ms</div>
<p>Quét ngoài tìm 5 đơn; quét trong chạy một lần mỗi đơn — <code>loops=5</code>. Vì phía trong đánh vào <code>customer_pkey</code>, mỗi phép tra gần như tức thì. Tổng: 0,087 ms. Nhưng để ý <code>loops</code> đó: nếu phía ngoài là 500.000 dòng, chính plan này sẽ làm 500.000 phép tra chỉ mục — một Nested Loop trên một phía ngoài lớn là cái bẫy hiệu năng kinh điển.</p>

<h3>Hash Join — con ngựa thồ cho join lớn</h3>
<p>Join mọi đơn với khách của nó. Không có bộ lọc, nên hàng triệu dòng tham gia và một Nested Loop sẽ vô vọng. Postgres dựng một <strong>bảng băm</strong> của phía nhỏ hơn (customer) trong bộ nhớ, rồi quét phía lớn (ord) một lần, dò vào bảng băm:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> c.region, count(*), sum(o.amount)
<span class="tok-keyword">FROM</span> ord o <span class="tok-keyword">JOIN</span> customer c <span class="tok-keyword">ON</span> c.id = o.customer_id
<span class="tok-keyword">GROUP BY</span> c.region;</code></pre>
<div class="out"> HashAggregate  (cost=14186.94..14186.98 rows=3 width=46) (actual time=176.307..176.310 rows=3 loops=1)
   Group Key: c.region
   -&gt;  Hash Join  (cost=311.00..10441.06 rows=499451 width=12) (actual time=2.527..107.581 rows=500000 loops=1)
         Hash Cond: (o.customer_id = c.id)
         -&gt;  Seq Scan on ord o  (cost=0.00..8817.00 rows=500000 width=10) (actual time=0.006..30.763 rows=500000 loops=1)
         -&gt;  Hash  (cost=186.00..186.00 rows=10000 width=10) (actual time=2.469..2.470 rows=10000 loops=1)
               Buckets: 16384  Batches: 1  Memory Usage: 558kB
               -&gt;  Seq Scan on customer c  (cost=0.00..186.00 rows=10000 width=10) (actual time=0.005..1.058 rows=10000 loops=1)
 Execution Time: 176.440 ms</div>
<p>Nút <code>Hash</code> dựng một bảng 558 kB gồm cả 10.000 khách (<code>loops=1</code>, dựng một lần), rồi <code>Hash Join</code> quét 500.000 đơn và dò nó. Không cần index — <code>loops=1</code> cả hai phía. Đây là hình đúng cho join lớn, và là lý do <strong>join hai bảng lớn không index vẫn ổn</strong> miễn một phía vừa trong <code>work_mem</code>.</p>

<h3>Merge Join — cho đầu vào đã sắp</h3>
<p>Nếu cả hai phía đã sắp theo khoá join, Postgres có thể ghép chúng như một merge sort. Để lộ nó ra, tắt hai chiến lược kia (một mẹo <em>chẩn đoán</em> — không bao giờ làm thế trong production) trên cùng truy vấn:</p>
<pre><code><span class="tok-keyword">SET</span> enable_hashjoin = off;  <span class="tok-keyword">SET</span> enable_nestloop = off;   <span class="tok-comment">-- chỉ để chẩn đoán!</span>
<span class="tok-comment">-- ...cùng join như trên...</span></code></pre>
<div class="out"> Merge Join  (cost=65543.56..73087.57 rows=499451 width=12) (actual time=112.763..206.352 rows=500000 loops=1)
   Merge Cond: (o.customer_id = c.id)
   -&gt;  Sort  (cost=64692.92..65942.92 rows=500000 width=10) (actual time=110.673..147.153 rows=500000 loops=1)
         Sort Key: o.customer_id
         Sort Method: external merge  Disk: 10824kB
         -&gt;  Seq Scan on ord o  (cost=0.00..8817.00 rows=500000 width=10) ...
   -&gt;  Sort  (cost=850.39..875.39 rows=10000 width=10) (actual time=2.081..2.504 rows=10000 loops=1)
         Sort Key: c.id ...</div>
<p>Merge Join cần cả hai đầu vào đã sắp, nên ở đây nó phải <code>Sort</code> cả hai trước — cái lớn còn tràn ra đĩa (<code>external merge Disk: 10824kB</code>). Tổng chi phí <strong>76833 so với Hash Join 14186</strong>, đúng là lý do bộ lập kế hoạch từ chối nó. Merge Join toả sáng khi sort miễn phí — đầu vào đã sắp sẵn theo một chỉ mục.</p>
<div class="callout ok">Quy tắc ngón tay cái bộ lập kế hoạch theo: <strong>ít dòng + phía trong có index → Nested Loop</strong>; <strong>join lớn chưa sắp → Hash Join</strong>; <strong>cả hai phía đã sắp theo khoá → Merge Join</strong>. Trong một plan, một Nested Loop với <code>loops=</code> lớn, hoặc một Hash/Merge tràn đĩa, là chỗ cần nhìn khi một join chậm.</div>
<div class="note-ct">Con bug tố cáo trên trang luôn là một Nested Loop trên một phía ngoài lớn vì một cột khoá ngoại không có index (Chương 9): phép "tra" phía trong rơi về một Seq Scan chạy hàng nghìn lần — <code>loops=5000</code>, mỗi lần một quét bảng đầy đủ. Index cột FK để bộ lập kế hoạch chuyển sang Hash Join và endpoint đi từ giây xuống mili-giây.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: nhận diện Nested Loop, Hash, và Merge trong plan</span><span class="lc-sub">Track Code Lab lật một truy vấn qua cả ba bằng planner knob.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Statistics: how the planner estimates, and when it\'s wrong|||10.3 — Thống kê: bộ lập kế hoạch ước lượng ra sao, và khi nào sai',
      slug: 'postgresql-10-3-thong-ke-uoc-luong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'ANALYZE thu thập thống kê để bộ lập kế hoạch ước lượng số dòng; vì sao các cột tương quan làm nó ước lượng thấp; và cách CREATE STATISTICS sửa lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Where the row estimates come from</h2>
<p class="lead">Every <code>rows=</code> estimate in a plan comes from <strong>statistics</strong> Postgres keeps about your data — collected by <code>ANALYZE</code> and stored in the system catalogs. Good estimates make good plans; bad estimates make the planner choose the wrong join or skip the right index. Understanding where they come from is how you fix a plan that's built on a wrong number.</p>

<h3>ANALYZE and the statistics</h3>
<p>The autovacuum daemon runs <code>ANALYZE</code> automatically after enough changes, sampling each table to record: how many distinct values a column has, the most common values and their frequencies, and a histogram of the spread. From those, the planner estimates how many rows a <code>WHERE</code> will match. When the estimate ≈ actual (as in 10.1, 9550 vs 10000), the stats are current and trustworthy.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">ANALYZE samples the table</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Stores n_distinct, common values, histogram in pg_statistic</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Planner estimates rows= for each filter</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Costs the plans, picks the cheapest</span></div>
</div>

<h3>Where it goes wrong: correlated columns</h3>
<p>The planner assumes columns are <em>independent</em>. In our <code>customer</code> table, <code>city</code> fully determines <code>region</code> (every Hanoi customer is in the North). Ask for both and watch the estimate collapse:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> customer <span class="tok-keyword">WHERE</span> city = <span class="tok-string">'Hanoi'</span> <span class="tok-keyword">AND</span> region = <span class="tok-string">'North'</span>;</code></pre>
<div class="out"> Seq Scan on customer  (cost=0.00..236.00 rows=400 width=37) (actual time=0.010..1.811 rows=2000 loops=1)
   Filter: ((city = 'Hanoi'::text) AND (region = 'North'::text))
   Rows Removed by Filter: 8000</div>
<p>Estimate <strong>400, actual 2000</strong> — off by 5×. The planner reasoned: 1 in 5 customers are in Hanoi, 1 in 5 are in the North, so 1/5 × 1/5 = 1/25 → 400. But the two conditions aren't independent; <code>region</code> adds no filtering once <code>city</code> is fixed. On a join, a 5× underestimate like this is exactly what pushes the planner into a Nested Loop that then runs millions of loops.</p>

<h3>The fix: extended statistics</h3>
<p>Tell Postgres the columns are related with <code>CREATE STATISTICS</code>, then re-analyze:</p>
<pre><code><span class="tok-keyword">CREATE STATISTICS</span> st_cust_city_region (dependencies) <span class="tok-keyword">ON</span> city, region <span class="tok-keyword">FROM</span> customer;
<span class="tok-keyword">ANALYZE</span> customer;</code></pre>
<div class="out"> Seq Scan on customer  (cost=0.00..236.00 rows=2000 width=37) (actual time=0.004..0.588 rows=2000 loops=1)
   Filter: ((city = 'Hanoi'::text) AND (region = 'North'::text))
   Rows Removed by Filter: 8000</div>
<p>Now the estimate is <strong>2000 = actual</strong>, spot on. Postgres learned the functional dependency <code>city → region</code> and stopped double-counting the filter. Extended statistics are the standard fix whenever <code>EXPLAIN ANALYZE</code> shows a large estimate-vs-actual gap on multi-column filters.</p>
<div class="callout ok">Diagnose plans by comparing <code>rows</code> (estimate) with actual <code>rows</code>. A small gap = healthy stats. A large gap means: stats are stale (run <code>ANALYZE</code>), the sample is too small (raise the column's statistics target), or columns are correlated (<code>CREATE STATISTICS</code>). Fix the estimate and the plan usually fixes itself.</div>
<div class="note-ct">This is why a query can suddenly go slow after a big data import even though nothing about the code changed: the freshly loaded rows aren't in the stats yet, so the planner estimates on stale numbers and picks a bad plan. A manual <code>ANALYZE</code> right after a bulk load — or after a migration that reshapes a table — is a cheap habit that prevents a class of mystery slowdowns.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: watch an estimate break and CREATE STATISTICS fix it</span><span class="lc-sub">The Code Lab track reproduces the correlated-columns underestimate.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Các ước lượng số dòng đến từ đâu</h2>
<p class="lead">Mọi ước lượng <code>rows=</code> trong một plan đến từ <strong>thống kê</strong> mà Postgres giữ về dữ liệu của bạn — thu thập bởi <code>ANALYZE</code> và lưu trong catalog hệ thống. Ước lượng tốt tạo plan tốt; ước lượng tồi khiến bộ lập kế hoạch chọn sai join hoặc bỏ qua chỉ mục đúng. Hiểu chúng từ đâu ra là cách bạn sửa một plan dựng trên một con số sai.</p>

<h3>ANALYZE và thống kê</h3>
<p>Daemon autovacuum chạy <code>ANALYZE</code> tự động sau đủ thay đổi, lấy mẫu mỗi bảng để ghi lại: một cột có bao nhiêu giá trị khác nhau, các giá trị phổ biến nhất và tần suất của chúng, và một biểu đồ phân bố. Từ đó, bộ lập kế hoạch ước lượng một <code>WHERE</code> sẽ khớp bao nhiêu dòng. Khi ước lượng ≈ thật (như ở 10.1, 9550 vs 10000), thống kê là hiện thời và đáng tin.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">ANALYZE lấy mẫu bảng</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Lưu n_distinct, giá trị phổ biến, biểu đồ vào pg_statistic</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Bộ lập kế hoạch ước lượng rows= cho mỗi bộ lọc</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Tính chi phí các plan, chọn cái rẻ nhất</span></div>
</div>

<h3>Chỗ nó sai: các cột tương quan</h3>
<p>Bộ lập kế hoạch giả định các cột <em>độc lập</em>. Trong bảng <code>customer</code> của ta, <code>city</code> quyết định hoàn toàn <code>region</code> (mọi khách Hà Nội đều ở North). Hỏi cả hai và xem ước lượng sụp đổ:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> customer <span class="tok-keyword">WHERE</span> city = <span class="tok-string">'Hanoi'</span> <span class="tok-keyword">AND</span> region = <span class="tok-string">'North'</span>;</code></pre>
<div class="out"> Seq Scan on customer  (cost=0.00..236.00 rows=400 width=37) (actual time=0.010..1.811 rows=2000 loops=1)
   Filter: ((city = 'Hanoi'::text) AND (region = 'North'::text))
   Rows Removed by Filter: 8000</div>
<p>Ước lượng <strong>400, thật 2000</strong> — lệch 5×. Bộ lập kế hoạch suy luận: 1 trong 5 khách ở Hà Nội, 1 trong 5 ở North, nên 1/5 × 1/5 = 1/25 → 400. Nhưng hai điều kiện không độc lập; <code>region</code> không lọc thêm gì một khi <code>city</code> đã cố định. Trên một join, một ước lượng thấp 5× như thế đúng là thứ đẩy bộ lập kế hoạch vào một Nested Loop rồi chạy hàng triệu vòng.</p>

<h3>Cách sửa: thống kê mở rộng</h3>
<p>Bảo Postgres rằng các cột có liên hệ bằng <code>CREATE STATISTICS</code>, rồi phân tích lại:</p>
<pre><code><span class="tok-keyword">CREATE STATISTICS</span> st_cust_city_region (dependencies) <span class="tok-keyword">ON</span> city, region <span class="tok-keyword">FROM</span> customer;
<span class="tok-keyword">ANALYZE</span> customer;</code></pre>
<div class="out"> Seq Scan on customer  (cost=0.00..236.00 rows=2000 width=37) (actual time=0.004..0.588 rows=2000 loops=1)
   Filter: ((city = 'Hanoi'::text) AND (region = 'North'::text))
   Rows Removed by Filter: 8000</div>
<p>Giờ ước lượng là <strong>2000 = thật</strong>, chính xác. Postgres học được phụ thuộc hàm <code>city → region</code> và ngừng đếm trùng bộ lọc. Thống kê mở rộng là cách sửa chuẩn mỗi khi <code>EXPLAIN ANALYZE</code> cho thấy khoảng cách ước-lượng-vs-thật lớn trên bộ lọc nhiều cột.</p>
<div class="callout ok">Chẩn đoán plan bằng cách so <code>rows</code> (ước lượng) với <code>rows</code> thật. Khoảng cách nhỏ = thống kê khoẻ. Khoảng cách lớn nghĩa là: thống kê cũ (chạy <code>ANALYZE</code>), mẫu quá nhỏ (tăng statistics target của cột), hoặc các cột tương quan (<code>CREATE STATISTICS</code>). Sửa ước lượng thì plan thường tự sửa.</div>
<div class="note-ct">Đây là lý do một truy vấn có thể đột nhiên chậm sau một lần nhập dữ liệu lớn dù không có gì trong mã đổi: các dòng vừa nạp chưa vào thống kê, nên bộ lập kế hoạch ước lượng trên số cũ và chọn plan tồi. Một <code>ANALYZE</code> thủ công ngay sau một lần nạp hàng loạt — hoặc sau một migration định hình lại bảng — là một thói quen rẻ tiền chặn được cả một lớp chậm bí ẩn.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: xem một ước lượng vỡ và CREATE STATISTICS sửa nó</span><span class="lc-sub">Track Code Lab tái hiện ước lượng thấp do cột tương quan.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — BUFFERS and a tuning workflow|||10.4 — BUFFERS và quy trình tinh chỉnh',
      slug: 'postgresql-10-4-buffers-tinh-chinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đọc EXPLAIN (ANALYZE, BUFFERS) để thấy I/O thật (shared hit vs read), và một quy trình có kỷ luật: đọc plan → tìm điểm nghẽn → sửa → đo lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Seeing the I/O, and a workflow to act on it</h2>
<p class="lead">Time in a plan can be misleading — it depends on what's cached. The <code>BUFFERS</code> option shows the real work: how many 8 kB pages the query touched, and whether they came from cache or disk. Combined with everything so far, it gives you a repeatable tuning workflow instead of guessing.</p>

<h3>EXPLAIN (ANALYZE, BUFFERS)</h3>
<p>Count a date range with no index — a full scan of the 30 MB table:</p>
<pre><code><span class="tok-keyword">EXPLAIN</span> (ANALYZE, BUFFERS) <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> ord
<span class="tok-keyword">WHERE</span> created_at <span class="tok-keyword">BETWEEN</span> <span class="tok-string">'2024-06-01'</span> <span class="tok-keyword">AND</span> <span class="tok-string">'2024-06-02'</span>;</code></pre>
<div class="out"> Aggregate  (cost=11320.61..11320.62 rows=1 width=8) (actual time=27.562..27.563 rows=1 loops=1)
   Buffers: shared hit=3817
   -&gt;  Seq Scan on ord  (cost=0.00..11317.00 rows=1445 width=0) (actual time=11.356..27.387 rows=1441 loops=1)
         Filter: ((created_at &gt;= '2024-06-01 ...') AND (created_at &lt;= '2024-06-02 ...'))
         Rows Removed by Filter: 498559
         Buffers: shared hit=3817</div>
<div class="kv-grid">
  <div class="kv"><span class="k">shared hit=3817</span><span class="v">3,817 pages read <em>from cache</em> (≈ 30 MB — the whole table). <code>hit</code> = already in memory, cheap.</span></div>
  <div class="kv"><span class="k">shared read=N</span><span class="v">Pages read <em>from disk</em> (0 here — the table was warm). <code>read</code> = a cache miss, the expensive kind.</span></div>
</div>
<p>The query scanned all 3,817 pages to return a count of 1,441 rows — it read the entire table to answer a question about one day. That's the waste <code>BUFFERS</code> makes visible.</p>

<h3>Act on it: an index that fits the data</h3>
<p><code>created_at</code> is physically ordered (rows were inserted over time), so an index on it is dense and selective. Add it and re-measure the exact same query:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_ord_created <span class="tok-keyword">ON</span> ord(created_at);</code></pre>
<div class="out"> Aggregate  (cost=48.93..48.94 rows=1 width=8) (actual time=0.280..0.281 rows=1 loops=1)
   Buffers: shared hit=1 read=6
   -&gt;  Index Only Scan using idx_ord_created on ord  (cost=0.42..45.32 rows=1445 width=0) (actual time=0.042..0.196 rows=1441 loops=1)
         Index Cond: ((created_at &gt;= '2024-06-01 ...') AND (created_at &lt;= '2024-06-02 ...'))
         Heap Fetches: 0
 Execution Time: 0.307 ms</div>
<p><strong>3,817 buffers → 7 buffers. 27.5 ms → 0.3 ms.</strong> The Index Only Scan touched 7 pages instead of the whole table, because the day's rows sit together in the index. <code>BUFFERS</code> is what proves the fix worked at the I/O level, not just on a possibly-cached clock.</p>

<h3>The tuning workflow</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">1 · Measure</span><span class="lz-v">Run <code>EXPLAIN (ANALYZE, BUFFERS)</code> on the real query with real parameters.</span></div>
  <div class="lz-layer"><span class="lz-k">2 · Find the culprit</span><span class="lz-v">Look for a <code>Seq Scan</code> with high <code>Rows Removed by Filter</code>, a big <code>loops=</code> on a Nested Loop, a sort spilling to <code>Disk</code>, or an estimate far from actual.</span></div>
  <div class="lz-layer"><span class="lz-k">3 · Fix the cause</span><span class="lz-v">Add the right index (Ch 9), <code>ANALYZE</code> / <code>CREATE STATISTICS</code> for bad estimates (10.3), or rewrite the query.</span></div>
  <div class="lz-layer"><span class="lz-k">4 · Re-measure</span><span class="lz-v">Confirm buffers and time actually dropped. Never assume — the planner may not use the index you added.</span></div>
</div>
<div class="callout warn">The <code>enable_hashjoin = off</code> style knobs from 10.2 are for <em>diagnosis only</em> — to see what an alternative plan would cost. Never set them in application code or production config to "force" a plan; fix the underlying cause (index, statistics, query shape) so the planner chooses correctly on its own.</div>
<div class="note-ct">This is the exact loop used to fix slow endpoints on the site: measure with BUFFERS, spot the giant Seq Scan or the FK-less Nested Loop, add one index, and watch buffers fall from thousands to single digits. That closes Chapter 10 — you can now read <em>why</em> a query runs the way it does. Next, Phase 3 turns to correctness under concurrency: transactions, MVCC, isolation levels, and locks.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next chapter: transactions, MVCC & isolation</span><span class="lc-sub">How Postgres keeps concurrent transactions correct — and the locks and anomalies to know.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Nhìn thấy I/O, và một quy trình để hành động</h2>
<p class="lead">Thời gian trong một plan có thể gây hiểu lầm — nó phụ thuộc vào cái gì được cache. Tuỳ chọn <code>BUFFERS</code> cho thấy công việc thật: truy vấn chạm bao nhiêu trang 8 kB, và chúng đến từ cache hay đĩa. Kết hợp với mọi thứ tới giờ, nó cho bạn một quy trình tinh chỉnh lặp lại được thay vì đoán.</p>

<h3>EXPLAIN (ANALYZE, BUFFERS)</h3>
<p>Đếm một khoảng ngày không có index — một quét đầy đủ bảng 30 MB:</p>
<pre><code><span class="tok-keyword">EXPLAIN</span> (ANALYZE, BUFFERS) <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> ord
<span class="tok-keyword">WHERE</span> created_at <span class="tok-keyword">BETWEEN</span> <span class="tok-string">'2024-06-01'</span> <span class="tok-keyword">AND</span> <span class="tok-string">'2024-06-02'</span>;</code></pre>
<div class="out"> Aggregate  (cost=11320.61..11320.62 rows=1 width=8) (actual time=27.562..27.563 rows=1 loops=1)
   Buffers: shared hit=3817
   -&gt;  Seq Scan on ord  (cost=0.00..11317.00 rows=1445 width=0) (actual time=11.356..27.387 rows=1441 loops=1)
         Filter: ((created_at &gt;= '2024-06-01 ...') AND (created_at &lt;= '2024-06-02 ...'))
         Rows Removed by Filter: 498559
         Buffers: shared hit=3817</div>
<div class="kv-grid">
  <div class="kv"><span class="k">shared hit=3817</span><span class="v">3.817 trang đọc <em>từ cache</em> (≈ 30 MB — cả bảng). <code>hit</code> = đã ở trong bộ nhớ, rẻ.</span></div>
  <div class="kv"><span class="k">shared read=N</span><span class="v">Trang đọc <em>từ đĩa</em> (0 ở đây — bảng đang ấm). <code>read</code> = một lần trượt cache, loại đắt.</span></div>
</div>
<p>Truy vấn quét cả 3.817 trang để trả về đếm 1.441 dòng — nó đọc toàn bộ bảng để trả lời một câu hỏi về một ngày. Đó là lãng phí mà <code>BUFFERS</code> làm hiện ra.</p>

<h3>Hành động: một chỉ mục khớp dữ liệu</h3>
<p><code>created_at</code> được sắp về mặt vật lý (dòng chèn theo thời gian), nên một chỉ mục trên nó dày và chọn lọc. Thêm nó rồi đo lại đúng truy vấn đó:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> idx_ord_created <span class="tok-keyword">ON</span> ord(created_at);</code></pre>
<div class="out"> Aggregate  (cost=48.93..48.94 rows=1 width=8) (actual time=0.280..0.281 rows=1 loops=1)
   Buffers: shared hit=1 read=6
   -&gt;  Index Only Scan using idx_ord_created on ord  (cost=0.42..45.32 rows=1445 width=0) (actual time=0.042..0.196 rows=1441 loops=1)
         Index Cond: ((created_at &gt;= '2024-06-01 ...') AND (created_at &lt;= '2024-06-02 ...'))
         Heap Fetches: 0
 Execution Time: 0.307 ms</div>
<p><strong>3.817 buffer → 7 buffer. 27,5 ms → 0,3 ms.</strong> Index Only Scan chạm 7 trang thay vì cả bảng, vì các dòng của ngày đó nằm cạnh nhau trong chỉ mục. <code>BUFFERS</code> là thứ chứng minh cách sửa có tác dụng ở mức I/O, không chỉ trên một đồng hồ có thể đang được cache.</p>

<h3>Quy trình tinh chỉnh</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">1 · Đo</span><span class="lz-v">Chạy <code>EXPLAIN (ANALYZE, BUFFERS)</code> trên truy vấn thật với tham số thật.</span></div>
  <div class="lz-layer"><span class="lz-k">2 · Tìm thủ phạm</span><span class="lz-v">Tìm một <code>Seq Scan</code> với <code>Rows Removed by Filter</code> cao, một <code>loops=</code> lớn trên Nested Loop, một sort tràn ra <code>Disk</code>, hoặc ước lượng lệch xa thật.</span></div>
  <div class="lz-layer"><span class="lz-k">3 · Sửa nguyên nhân</span><span class="lz-v">Thêm chỉ mục đúng (Ch9), <code>ANALYZE</code> / <code>CREATE STATISTICS</code> cho ước lượng tồi (10.3), hoặc viết lại truy vấn.</span></div>
  <div class="lz-layer"><span class="lz-k">4 · Đo lại</span><span class="lz-v">Xác nhận buffer và thời gian thật sự giảm. Đừng bao giờ giả định — bộ lập kế hoạch có thể không dùng chỉ mục bạn thêm.</span></div>
</div>
<div class="callout warn">Các knob kiểu <code>enable_hashjoin = off</code> từ 10.2 là <em>chỉ để chẩn đoán</em> — để xem một plan thay thế tốn bao nhiêu. Đừng bao giờ đặt chúng trong mã ứng dụng hay cấu hình production để "ép" một plan; hãy sửa nguyên nhân gốc (chỉ mục, thống kê, hình dạng truy vấn) để bộ lập kế hoạch tự chọn đúng.</div>
<div class="note-ct">Đây đúng là vòng lặp dùng để sửa các endpoint chậm trên trang: đo bằng BUFFERS, phát hiện Seq Scan khổng lồ hoặc Nested Loop thiếu index FK, thêm một chỉ mục, và nhìn buffer rơi từ hàng nghìn xuống một chữ số. Đó khép lại Chương 10 — giờ bạn đọc được <em>vì sao</em> một truy vấn chạy như nó chạy. Tiếp theo, Giai đoạn 3 quay sang tính đúng đắn dưới đồng thời: giao dịch, MVCC, mức cô lập, và khoá.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Chương tới: giao dịch, MVCC & cô lập</span><span class="lc-sub">Postgres giữ các giao dịch đồng thời đúng đắn ra sao — và các khoá, dị thường cần biết.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 10.5 Quiz ─────────────────────────── */
    {
      title: '10.5 — Chapter 10 quiz|||10.5 — Kiểm tra Chương 10',
      slug: 'postgresql-10-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về đọc EXPLAIN/EXPLAIN ANALYZE, ba chiến lược JOIN, thống kê & ước lượng, và BUFFERS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on reading query plans. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: comparing estimated vs actual rows to spot a bad plan (10.1, 10.3), and recognising which join strategy is which — a Nested Loop with a huge loops count is the usual culprit (10.2).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về đọc plan truy vấn. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: so rows ước lượng vs thật để phát hiện plan tồi (10.1, 10.3), và nhận ra chiến lược join nào là nào — một Nested Loop với loops khổng lồ là thủ phạm thường gặp (10.2).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is the difference between EXPLAIN and EXPLAIN ANALYZE?|||Khác biệt giữa EXPLAIN và EXPLAIN ANALYZE là gì?',
            options: [
              'They are identical|||Chúng giống hệt',
              'EXPLAIN only shows the estimated plan; EXPLAIN ANALYZE actually runs the query and reports real timings and row counts|||EXPLAIN chỉ hiện plan ước lượng; EXPLAIN ANALYZE thật sự chạy truy vấn và báo thời gian, số dòng thật',
              'EXPLAIN ANALYZE is faster|||EXPLAIN ANALYZE nhanh hơn',
              'EXPLAIN runs the query, ANALYZE does not|||EXPLAIN chạy truy vấn, ANALYZE thì không',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In a plan node, "cost=0.00..10067.00" means?|||Trong một nút plan, "cost=0.00..10067.00" nghĩa là?',
            options: [
              'Milliseconds of runtime|||Số mili-giây chạy',
              'Estimated startup cost .. total cost, in arbitrary units used to compare plans|||Chi phí khởi động ước lượng .. tổng, theo đơn vị quy ước dùng để so plan',
              'Number of rows|||Số dòng',
              'Bytes of memory|||Số byte bộ nhớ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A large gap between estimated rows and actual rows in a plan usually indicates?|||Một khoảng cách lớn giữa rows ước lượng và rows thật trong một plan thường cho thấy?',
            options: [
              'The query is correct|||Truy vấn đúng',
              'Bad statistics — stale, too small a sample, or correlated columns — which can lead the planner to a bad plan|||Thống kê tồi — cũ, mẫu quá nhỏ, hoặc cột tương quan — có thể dẫn bộ lập kế hoạch tới plan tồi',
              'The table is empty|||Bảng rỗng',
              'An index is missing|||Thiếu một chỉ mục',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which join strategy is best when the outer side has few rows and the inner side is indexed?|||Chiến lược join nào tốt nhất khi phía ngoài ít dòng và phía trong có index?',
            options: [
              'Hash Join|||Hash Join',
              'Nested Loop|||Nested Loop',
              'Merge Join|||Merge Join',
              'Cross Join|||Cross Join',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A Hash Join works by?|||Một Hash Join hoạt động bằng cách?',
            options: [
              'Sorting both inputs first|||Sắp cả hai đầu vào trước',
              'Building an in-memory hash table of the smaller side, then scanning the larger side once and probing it|||Dựng một bảng băm trong bộ nhớ của phía nhỏ hơn, rồi quét phía lớn một lần và dò vào nó',
              'Looping over every pair of rows|||Lặp qua mọi cặp dòng',
              'Using the primary key only|||Chỉ dùng khoá chính',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The planner estimates WHERE city=\'Hanoi\' AND region=\'North\' at 400 rows but the actual is 2000. Why, and what fixes it?|||Bộ lập kế hoạch ước lượng WHERE city=\'Hanoi\' AND region=\'North\' là 400 dòng nhưng thật là 2000. Vì sao, và gì sửa nó?',
            options: [
              'A bug; restart Postgres|||Một lỗi; khởi động lại Postgres',
              'It assumes the columns are independent and multiplies selectivities; CREATE STATISTICS on the correlated columns fixes it|||Nó giả định các cột độc lập và nhân độ chọn lọc; CREATE STATISTICS trên các cột tương quan sửa nó',
              'The table needs a primary key|||Bảng cần một khoá chính',
              'region should be dropped|||Nên bỏ cột region',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In EXPLAIN (ANALYZE, BUFFERS), "shared hit" vs "shared read" mean?|||Trong EXPLAIN (ANALYZE, BUFFERS), "shared hit" vs "shared read" nghĩa là?',
            options: [
              'hit = pages found in cache; read = pages fetched from disk|||hit = trang tìm thấy trong cache; read = trang lấy từ đĩa',
              'hit = rows matched; read = rows scanned|||hit = dòng khớp; read = dòng quét',
              'They are the same|||Chúng giống nhau',
              'hit = disk; read = cache|||hit = đĩa; read = cache',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'When is it appropriate to use SET enable_hashjoin = off?|||Khi nào thích hợp dùng SET enable_hashjoin = off?',
            options: [
              'In production config to force fast plans|||Trong cấu hình production để ép plan nhanh',
              'For diagnosis only — to see what an alternative plan would cost — never in production|||Chỉ để chẩn đoán — xem một plan thay thế tốn bao nhiêu — không bao giờ trong production',
              'Whenever a query is slow|||Bất cứ khi nào một truy vấn chậm',
              'To permanently disable hash joins|||Để tắt hash join vĩnh viễn',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
