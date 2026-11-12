/**
 * Prisma ORM — Chương 9: Hiệu năng.
 * Đo trước · N+1 và chiến lược nạp quan hệ · chỉ mục Prisma thật sự dùng · connection pool · cache · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
import G09_1 from './giang/pr-09-1.mjs';
import G09_2 from './giang/pr-09-2.mjs';
import G09_3 from './giang/pr-09-3.mjs';
import G09_4 from './giang/pr-09-4.mjs';
import G09_5 from './giang/pr-09-5.mjs';
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 9 — Performance|||Chương 9 — Hiệu năng',
  description: 'Vòng lặp đo–vá–đo lại: bắt SQL kèm thời lượng, đọc EXPLAIN ANALYZE của chính câu Prisma sinh ra, N+1 ở đủ dạng cùng relationLoadStrategy đo bằng số thật, những chỉ mục truy vấn Prisma thật sự dùng được, chỉnh connection pool bằng số chứ không bằng cảm giác, và tầng cache trước khi chạm cơ sở dữ liệu.',
  lessons: [
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — Measure before you change anything|||9.1 — Đo trước khi đổi bất cứ thứ gì',
      slug: 'pr-9-1-do-truoc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vòng lặp năm bước: bắt sự kiện query kèm thời lượng, tìm câu chậm nhất và câu chạy nhiều nhất, dựng lại SQL đầy đủ với tham số, chạy EXPLAIN ANALYZE lên nó, và đo lại — cùng ba con số phân biệt truy vấn chậm với ứng dụng chậm.',
      content: `
${G09_1}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Measure before you change anything</h2>
<p class="lead">Almost every Prisma performance problem is one of three things: a query that runs too often, a query that reads too much, or a pool that is too small. All three are visible in the query log, and none of them are visible from reading the code. This lesson is the loop — capture, rank, explain, fix, re-measure — and every later lesson in the chapter assumes you are running it.</p>

<h3>Step 1 — capture, with durations</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });
const log: { sql: string; params: string; ms: number }[] = [];
prisma.$on('query', (e) =&gt; log.push({ sql: e.query, params: e.params, ms: e.duration }));

<span class="tok-comment">// Wrap one request and report what it cost</span>
export function start() {
  const from = log.length;
  return () =&gt; { const cua = log.slice(from); return { count: cua.length, totalMs: cua.reduce((s, q) =&gt; s + q.ms, 0), queryText: cua }; };
}

<span class="tok-comment">// The page measured below: a feed of 40 posts, their authors one by one,
// a title search, the comments of the 40 posts, and a count of my posts</span>
const done = start();
const t0 = performance.now();
await getHomePage(1);
console.log(done(), 'wall clock', performance.now() - t0);</code></pre>
<div class="out">{ count: 44, totalMs: 579 } · dong ho tuong: ca trang 604.5 ms, vong 40 findUnique 21.7 ms</div>
<p>Run against a 1.2-million-post database (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker (4 CPUs, 2 GB), Prisma 6.19.3): one home page sent <strong>44 queries</strong>. That count is the first finding. The second is that the two clocks disagree: the query events summed to the total above, while a wall clock around the 40 author lookups alone measured about 20 ms.</p>

<h3>Step 2 — rank by total time, not by slowest</h3>
<pre><code class="language-javascript">function rank(cua: { sql: string; ms: number }[]) {
  const groups = new Map&lt;string, { count: number; total: number; max: number }&gt;();
  for (const q of cua) {
    const khuon = q.sql.replace(/\\$\\d+/g, '?').replace(/\\s+/g, ' ');   <span class="tok-comment">// repeats group together</span>
    const n = groups.get(khuon) ?? { count: 0, total: 0, max: 0 };
    n.count++; n.total += q.ms; n.max = Math.max(n.max, q.ms);
    groups.set(khuon, n);
  }
  return [...groups.entries()].map(([sql, n]) =&gt; ({ sql, ...n })).sort((a, b) =&gt; b.total - a.total);
}
console.table(rank(done().queryText));</code></pre>
<div class="out">┌─────────┬──────────────────────────────────────────────────────────────┬───────┬───────┬─────┐
│ (index) │ sql                                                          │ count │ total │ max │
├─────────┼──────────────────────────────────────────────────────────────┼───────┼───────┼─────┤
│ 0       │ 'SELECT … FROM "posts" WHERE ("posts"."published" = ? AND "' │ 1     │ 293   │ 293 │
│ 1       │ 'SELECT … FROM (SELECT "posts"."id" FROM "posts" WHERE "pos' │ 1     │ 246   │ 246 │
│ 2       │ 'SELECT … FROM "comments" WHERE "comments"."post_id" IN (?,' │ 1     │ 40    │ 40  │
│ 3       │ 'SELECT … FROM "posts" WHERE "posts"."published" = ? ORDER ' │ 1     │ 0     │ 0   │
│ 4       │ 'SELECT … FROM "users" WHERE ("users"."id" = ? AND 1=1) LIM' │ 40    │ 0     │ 0   │</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Rows 0 and 1</span><span class="v">The title search and the COUNT of my posts: single queries doing too much work. They go to EXPLAIN — step 4.</span></div>
  <div class="kv"><span class="k">Row 4: 40 calls, "0 ms"</span><span class="v"><code>e.duration</code> is a whole number of milliseconds. Forty sub-millisecond lookups sum to 0 in the log, yet the loop took about 20 ms of wall time in round trips. On a real network each one also pays the latency.</span></div>
  <div class="kv"><span class="k">Normalising the SQL</span><span class="v">Replacing $1, $2 with ? collapses the forty lookups into one row. Without it, 44 rows and no pattern.</span></div>
  <div class="kv"><span class="k">So read two numbers</span><span class="v">Count per pattern, and a wall clock around any loop. The log alone hides an N+1 on a fast network.</span></div>
</div>

<h3>Step 3 — reconstruct the real SQL</h3>
<pre><code class="language-javascript">function stop(sql: string, params: string): string {
  const p: unknown[] = JSON.parse(params);
  return sql.replace(/\\$(\\d+)/g, (_, i) =&gt; {
    const v = p[Number(i) - 1];
    if (v === null) return 'NULL';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return &#96;'\${String(v).replace(/'/g, "''")}'&#96;;
  });
}
const cham = [...done().queryText].sort((a, b) =&gt; b.ms - a.ms)[0];
console.log('params:', cham.params);
console.log('EXPLAIN (ANALYZE, BUFFERS) ' + stop(cham.sql, cham.params) + ';');</code></pre>
<div class="out">└─────────┴──────────────────────────────────────────────────────────────┴───────┴───────┴─────┘
params cua cau cham nhat: [true,"%prisma%",20,0]</div>
<p>Prisma logs the SQL and the parameters separately — the parameters as a JSON string. Ten lines put them back, ready for EXPLAIN. Keep the function in the repository; copying eight parameters by hand is how people end up guessing at the plan.</p>

<h3>Step 4 — read the plan</h3>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "EXPLAIN (ANALYZE, BUFFERS) SELECT …"</code></pre>
<div class="out"> Limit  (cost=121938.02..121940.36 rows=20 width=1896) (actual time=280.434..283.631 rows=20 loops=1)
   Buffers: shared hit=2504 read=112255
   -&gt;  Gather Merge  (cost=121938.02..121948.52 rows=90 width=1896) (actual time=277.906..281.101 rows=20 loops=1)
         Workers Launched: 2
         Buffers: shared hit=2504 read=112255
               Buffers: shared hit=2504 read=112255
               -&gt;  Parallel Seq Scan on posts  (cost=0.00..120936.80 rows=45 width=1896) (actual time=195.303..267.603 rows=400 loops=3)
                     Filter: (published AND (title ~~* '%prisma%'::text))
                     Rows Removed by Filter: 399600
 Execution Time: 297.437 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Parallel Seq Scan</span><span class="v">Two workers plus the leader read the whole table. <code>Rows Removed by Filter</code> is per process: about 400,000 each, three processes, to return twenty.</span></div>
  <div class="kv"><span class="k">read= in Buffers</span><span class="v">Pages fetched from disk rather than cache. Most of this query was I/O — which is why BUFFERS is worth always adding.</span></div>
  <div class="kv"><span class="k"><code>ILIKE '%prisma%'</code></span><span class="v">A leading wildcard: no B-tree can serve it at any column order. The fix is a trigram index (Lesson 5.5).</span></div>
</div>

<h3>Step 5 — fix, then measure again</h3>
<pre><code class="language-sql">CREATE INDEX CONCURRENTLY posts_title_trgm ON posts USING gin (title gin_trgm_ops);
ANALYZE posts;</code></pre>
<div class="out"> Limit  (cost=569.96..570.01 rows=20 width=1896) (actual time=1.663..1.666 rows=20 loops=1)
         -&gt;  Bitmap Heap Scan on posts  (cost=97.23..567.09 rows=108 width=1896) (actual time=0.227..1.435 rows=1200 loops=1)
               Recheck Cond: (title ~~* '%prisma%'::text)
               -&gt;  Bitmap Index Scan on posts_title_trgm  (cost=0.00..97.20 rows=120 width=0) (actual time=0.135..0.135 rows=1200 loops=1)
 Execution Time: 1.723 ms

-- the whole page, after
{ count: 44, totalMs: 269 } · dong ho tuong: ca trang 304.3 ms, vong 40 findUnique 30.5 ms</div>
<div class="pitfall">
<p><strong>Trap — the page is still slow, and the temptation is to keep indexing.</strong> The search went from hundreds of milliseconds to under two, and the page roughly halved. Re-rank before touching anything else: the top row is now the COUNT by <code>author_id</code> — a foreign key with no index (Lesson 9.3). One fix per round, then measure the whole page again.</p>
</div>

<h3>The three numbers to watch</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Queries per request</span><span class="v">A small constant. If it grows with the items on the page, it is an N+1 — the highest-value thing to fix.</span></div>
  <div class="kv"><span class="k">Query time per request</span><span class="v">The database share of latency. 40 ms of a 900 ms request means look elsewhere.</span></div>
  <div class="kv"><span class="k">Rows read versus returned</span><span class="v">From EXPLAIN. Hundreds of thousands read to return twenty is a missing index.</span></div>
</div>
<pre><code class="language-javascript">test('trang chu khong bi N+1', async () =&gt; {
  const from = log.length;
  await getHomePage(1);
  const count = log.length - from;
  assert.ok(count &lt;= 6, &#96;trang chu ton \${count} truy van&#96;);
});</code></pre>
<div class="out">AssertionError [ERR_ASSERTION]: trang chu ton 41 truy van</div>
<p>A query-count assertion is the cheapest performance test there is: milliseconds to run, no load generator, and it fails the build the day someone puts an <code>await</code> inside a loop. Run for real, the page above sent 41 queries and the test went red.</p>

<h3>In production: <code>pg_stat_statements</code></h3>
<pre><code class="language-sql">SELECT calls, round(total_exec_time::numeric, 0) AS tong_ms, round(mean_exec_time::numeric, 2) AS tb_ms,
       rows, left(regexp_replace(query, '\\\\s+', ' ', 'g'), 70) AS truy_van
FROM pg_stat_statements
WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database())
ORDER BY total_exec_time DESC LIMIT 6;</code></pre>
<div class="out"> calls | tong_ms | tb_ms  | rows |                                truy_van                                
-------+---------+--------+------+------------------------------------------------------------------------
    50 |   11435 | 228.71 |   50 | SELECT COUNT(*) AS "_count$_all" FROM (SELECT "public"."posts"."id" FR
    50 |    1545 |  30.90 | 6000 | SELECT "public"."comments"."id", "public"."comments"."body", "public".
    50 |      63 |   1.27 | 1000 | SELECT "public"."posts"."id", "public"."posts"."title", "public"."post
  2000 |      24 |   0.01 | 2000 | SELECT "public"."users"."id", "public"."users"."email", "public"."user
    50 |       6 |   0.13 | 2000 | SELECT "public"."posts"."id", "public"."posts"."title", "public"."post
     1 |       0 |   0.13 |    1 | &lt;insufficient privilege&gt;
(6 rows)</div>
<p>The same ranking, aggregated over every request — here after 50 home-page loads. The COUNT dominates database time; the 2,000 author lookups cost about 0.01 ms each inside PostgreSQL. Their price is the round trips, which <code>pg_stat_statements</code> cannot see — another reason to count queries in the application too.</p>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">Logging — event-based</span><span class="lc-sub">prisma.io/docs · The <code>query</code> event, its fields, and capturing duration properly</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/using-explain.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — using EXPLAIN</span><span class="lc-sub">postgresql.org · Reading a plan: cost, rows, loops, buffers, and what each node means</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/pgstatstatements.html" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_stat_statements</span><span class="lc-sub">postgresql.org · Enabling it, what it records, and the reset workflow</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, EXPLAIN chapter</span><span class="lc-sub">Every plan node in depth — the reference for step 4 of this loop</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Instrument a slow endpoint, rank its queries, and identify which of the three problems it has</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Đo trước khi đổi bất cứ thứ gì</h2>
<p class="lead">Gần như mọi bài toán hiệu năng của Prisma đều là một trong ba thứ: một câu truy vấn chạy quá nhiều lần, một câu truy vấn đọc quá nhiều, hoặc một cái pool quá nhỏ. Cả ba đều nhìn thấy được trong log truy vấn, và không cái nào nhìn thấy được bằng cách đọc mã. Bài này là cái vòng lặp — bắt, xếp hạng, giải thích, vá, đo lại — và mọi bài sau trong chương đều giả định bạn đang chạy nó.</p>

<h3>Bước 1 — bắt, kèm thời lượng</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });
const log: { sql: string; params: string; ms: number }[] = [];
prisma.$on('query', (e) =&gt; log.push({ sql: e.query, params: e.params, ms: e.duration }));

<span class="tok-comment">// Wrap one request and report what it cost</span>
export function start() {
  const from = log.length;
  return () =&gt; { const cua = log.slice(from); return { count: cua.length, totalMs: cua.reduce((s, q) =&gt; s + q.ms, 0), queryText: cua }; };
}

<span class="tok-comment">// The page measured below: a feed of 40 posts, their authors one by one,
// a title search, the comments of the 40 posts, and a count of my posts</span>
const done = start();
const t0 = performance.now();
await getHomePage(1);
console.log(done(), 'wall clock', performance.now() - t0);</code></pre>
<div class="out">{ count: 44, totalMs: 579 } · dong ho tuong: ca trang 604.5 ms, vong 40 findUnique 21.7 ms</div>
<p>Chạy trên một cơ sở dữ liệu 1,2 triệu bài (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker (4 CPU, 2 GB), Prisma 6.19.3): một trang chủ gửi <strong>44 truy vấn</strong>. Con số đếm là phát hiện đầu tiên. Phát hiện thứ hai là hai đồng hồ không khớp: tổng thời lượng sự kiện ở trên, còn đồng hồ tường bọc riêng 40 lần tìm tác giả đo được khoảng 20 ms.</p>

<h3>Bước 2 — xếp hạng theo tổng thời gian, không theo cái chậm nhất</h3>
<pre><code class="language-javascript">function rank(cua: { sql: string; ms: number }[]) {
  const groups = new Map&lt;string, { count: number; total: number; max: number }&gt;();
  for (const q of cua) {
    const khuon = q.sql.replace(/\\$\\d+/g, '?').replace(/\\s+/g, ' ');   <span class="tok-comment">// repeats group together</span>
    const n = groups.get(khuon) ?? { count: 0, total: 0, max: 0 };
    n.count++; n.total += q.ms; n.max = Math.max(n.max, q.ms);
    groups.set(khuon, n);
  }
  return [...groups.entries()].map(([sql, n]) =&gt; ({ sql, ...n })).sort((a, b) =&gt; b.total - a.total);
}
console.table(rank(done().queryText));</code></pre>
<div class="out">┌─────────┬──────────────────────────────────────────────────────────────┬───────┬───────┬─────┐
│ (index) │ sql                                                          │ count │ total │ max │
├─────────┼──────────────────────────────────────────────────────────────┼───────┼───────┼─────┤
│ 0       │ 'SELECT … FROM "posts" WHERE ("posts"."published" = ? AND "' │ 1     │ 293   │ 293 │
│ 1       │ 'SELECT … FROM (SELECT "posts"."id" FROM "posts" WHERE "pos' │ 1     │ 246   │ 246 │
│ 2       │ 'SELECT … FROM "comments" WHERE "comments"."post_id" IN (?,' │ 1     │ 40    │ 40  │
│ 3       │ 'SELECT … FROM "posts" WHERE "posts"."published" = ? ORDER ' │ 1     │ 0     │ 0   │
│ 4       │ 'SELECT … FROM "users" WHERE ("users"."id" = ? AND 1=1) LIM' │ 40    │ 0     │ 0   │</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hàng 0 và 1</span><span class="v">Câu tìm theo tiêu đề và câu COUNT bài của tôi: mỗi câu làm quá nhiều việc. Chúng đi tiếp tới EXPLAIN — bước 4.</span></div>
  <div class="kv"><span class="k">Hàng 4: 40 lần gọi, "0 ms"</span><span class="v"><code>e.duration</code> là số nguyên mili giây. Bốn mươi lần tìm dưới một mili giây cộng lại ra 0 trong log, vậy mà vòng lặp tốn khoảng 20 ms thời gian thật cho các lượt đi về. Trên mạng thật, mỗi lượt còn trả thêm độ trễ.</span></div>
  <div class="kv"><span class="k">Chuẩn hoá câu SQL</span><span class="v">Thay $1, $2 bằng ? gộp bốn mươi lần tìm vào một hàng. Không có nó, bảng có 44 hàng và chẳng thấy mẫu nào.</span></div>
  <div class="kv"><span class="k">Nên đọc hai con số</span><span class="v">Số lần mỗi mẫu, và đồng hồ tường quanh mọi vòng lặp. Chỉ nhìn log thì N+1 trên mạng nhanh sẽ biến mất.</span></div>
</div>

<h3>Bước 3 — dựng lại đúng câu SQL thật</h3>
<pre><code class="language-javascript">function stop(sql: string, params: string): string {
  const p: unknown[] = JSON.parse(params);
  return sql.replace(/\\$(\\d+)/g, (_, i) =&gt; {
    const v = p[Number(i) - 1];
    if (v === null) return 'NULL';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return &#96;'\${String(v).replace(/'/g, "''")}'&#96;;
  });
}
const cham = [...done().queryText].sort((a, b) =&gt; b.ms - a.ms)[0];
console.log('params:', cham.params);
console.log('EXPLAIN (ANALYZE, BUFFERS) ' + stop(cham.sql, cham.params) + ';');</code></pre>
<div class="out">└─────────┴──────────────────────────────────────────────────────────────┴───────┴───────┴─────┘
params cua cau cham nhat: [true,"%prisma%",20,0]</div>
<p>Prisma ghi câu SQL và tham số riêng — tham số ở dạng chuỗi JSON. Mười dòng ghép chúng lại, sẵn sàng cho EXPLAIN. Hãy giữ hàm này trong kho mã; chép tay tám tham số là lý do người ta đoán mò kế hoạch.</p>

<h3>Bước 4 — đọc cái kế hoạch</h3>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "EXPLAIN (ANALYZE, BUFFERS) SELECT …"</code></pre>
<div class="out"> Limit  (cost=121938.02..121940.36 rows=20 width=1896) (actual time=280.434..283.631 rows=20 loops=1)
   Buffers: shared hit=2504 read=112255
   -&gt;  Gather Merge  (cost=121938.02..121948.52 rows=90 width=1896) (actual time=277.906..281.101 rows=20 loops=1)
         Workers Launched: 2
         Buffers: shared hit=2504 read=112255
               Buffers: shared hit=2504 read=112255
               -&gt;  Parallel Seq Scan on posts  (cost=0.00..120936.80 rows=45 width=1896) (actual time=195.303..267.603 rows=400 loops=3)
                     Filter: (published AND (title ~~* '%prisma%'::text))
                     Rows Removed by Filter: 399600
 Execution Time: 297.437 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Parallel Seq Scan</span><span class="v">Hai worker cùng tiến trình chính đọc cả bảng. <code>Rows Removed by Filter</code> tính theo từng tiến trình: khoảng 400.000 mỗi tiến trình, ba tiến trình, để trả về hai mươi hàng.</span></div>
  <div class="kv"><span class="k">read= trong Buffers</span><span class="v">Số trang đọc từ đĩa chứ không từ bộ đệm. Phần lớn câu này là I/O — vì thế luôn nên thêm BUFFERS.</span></div>
  <div class="kv"><span class="k"><code>ILIKE '%prisma%'</code></span><span class="v">Ký tự đại diện ở đầu: không cây B nào phục vụ được, ở bất kỳ thứ tự cột nào. Cách sửa là chỉ mục trigram (Bài 5.5).</span></div>
</div>

<h3>Bước 5 — vá, rồi đo lại</h3>
<pre><code class="language-sql">CREATE INDEX CONCURRENTLY posts_title_trgm ON posts USING gin (title gin_trgm_ops);
ANALYZE posts;</code></pre>
<div class="out"> Limit  (cost=569.96..570.01 rows=20 width=1896) (actual time=1.663..1.666 rows=20 loops=1)
         -&gt;  Bitmap Heap Scan on posts  (cost=97.23..567.09 rows=108 width=1896) (actual time=0.227..1.435 rows=1200 loops=1)
               Recheck Cond: (title ~~* '%prisma%'::text)
               -&gt;  Bitmap Index Scan on posts_title_trgm  (cost=0.00..97.20 rows=120 width=0) (actual time=0.135..0.135 rows=1200 loops=1)
 Execution Time: 1.723 ms

-- cả trang, sau khi vá
{ count: 44, totalMs: 269 } · dong ho tuong: ca trang 304.3 ms, vong 40 findUnique 30.5 ms</div>
<div class="pitfall">
<p><strong>Bẫy — trang vẫn chậm, và cám dỗ là cứ đánh thêm chỉ mục.</strong> Câu tìm kiếm từ vài trăm mili giây xuống dưới hai, và cả trang giảm khoảng một nửa. Xếp hạng lại trước khi đụng thứ khác: hàng đầu bây giờ là câu COUNT theo <code>author_id</code> — một khoá ngoại không có chỉ mục (Bài 9.3). Mỗi vòng sửa một thứ, rồi đo lại cả trang.</p>
</div>

<h3>Ba con số cần canh</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Số truy vấn mỗi yêu cầu</span><span class="v">Một hằng số nhỏ. Nếu nó tăng theo số mục trên trang, đó là N+1 — thứ đáng sửa nhất.</span></div>
  <div class="kv"><span class="k">Thời gian truy vấn mỗi yêu cầu</span><span class="v">Phần của cơ sở dữ liệu trong độ trễ. 40 ms trên một yêu cầu 900 ms nghĩa là hãy tìm chỗ khác.</span></div>
  <div class="kv"><span class="k">Số hàng đọc so với số hàng trả về</span><span class="v">Lấy từ EXPLAIN. Đọc hàng trăm nghìn để trả về hai mươi là thiếu chỉ mục.</span></div>
</div>
<pre><code class="language-javascript">test('trang chu khong bi N+1', async () =&gt; {
  const from = log.length;
  await getHomePage(1);
  const count = log.length - from;
  assert.ok(count &lt;= 6, &#96;trang chu ton \${count} truy van&#96;);
});</code></pre>
<div class="out">AssertionError [ERR_ASSERTION]: trang chu ton 41 truy van</div>
<p>Một phép thử đếm truy vấn là phép thử hiệu năng rẻ nhất: chạy vài mili giây, không cần máy tạo tải, và đánh đỏ bản dựng đúng ngày ai đó đặt một <code>await</code> trong vòng lặp. Chạy thật, trang ở trên gửi 41 truy vấn và phép thử đỏ.</p>

<h3>Trên production: <code>pg_stat_statements</code></h3>
<pre><code class="language-sql">SELECT calls, round(total_exec_time::numeric, 0) AS tong_ms, round(mean_exec_time::numeric, 2) AS tb_ms,
       rows, left(regexp_replace(query, '\\\\s+', ' ', 'g'), 70) AS truy_van
FROM pg_stat_statements
WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database())
ORDER BY total_exec_time DESC LIMIT 6;</code></pre>
<div class="out"> calls | tong_ms | tb_ms  | rows |                                truy_van                                
-------+---------+--------+------+------------------------------------------------------------------------
    50 |   11435 | 228.71 |   50 | SELECT COUNT(*) AS "_count$_all" FROM (SELECT "public"."posts"."id" FR
    50 |    1545 |  30.90 | 6000 | SELECT "public"."comments"."id", "public"."comments"."body", "public".
    50 |      63 |   1.27 | 1000 | SELECT "public"."posts"."id", "public"."posts"."title", "public"."post
  2000 |      24 |   0.01 | 2000 | SELECT "public"."users"."id", "public"."users"."email", "public"."user
    50 |       6 |   0.13 | 2000 | SELECT "public"."posts"."id", "public"."posts"."title", "public"."post
     1 |       0 |   0.13 |    1 | &lt;insufficient privilege&gt;
(6 rows)</div>
<p>Cùng phép xếp hạng, gộp trên mọi yêu cầu — ở đây sau 50 lượt tải trang chủ. Câu COUNT chiếm phần lớn thời gian của cơ sở dữ liệu; 2.000 lần tìm tác giả chỉ tốn khoảng 0,01 ms mỗi lần bên trong PostgreSQL. Cái giá của chúng là các lượt đi về, thứ <code>pg_stat_statements</code> không thấy được — thêm một lý do để đếm truy vấn ngay trong ứng dụng.</p>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">Logging — theo sự kiện</span><span class="lc-sub">prisma.io/docs · Sự kiện <code>query</code>, các trường của nó, và cách bắt thời lượng cho đúng</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/using-explain.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — dùng EXPLAIN</span><span class="lc-sub">postgresql.org · Đọc một kế hoạch: cost, rows, loops, buffers, và mỗi nút nghĩa là gì</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/pgstatstatements.html" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_stat_statements</span><span class="lc-sub">postgresql.org · Cách bật, nó ghi lại gì, và quy trình reset</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương EXPLAIN</span><span class="lc-sub">Mọi nút kế hoạch nói sâu — bản tra cứu cho bước 4 của vòng lặp này</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Gắn đo đạc vào một endpoint chậm, xếp hạng các truy vấn của nó, và xác định nó thuộc loại nào trong ba bài toán</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — N+1 in all its forms|||9.2 — N+1 ở đủ mọi dạng',
      slug: 'pr-9-2-n-cong-1',
      type: 'LESSON',
      description: 'Năm dạng của quá nhiều truy vấn đo trên 1,2 triệu bài: vòng lặp, Promise.all, _count gộp cả bảng khi không bật relationJoins, include toả rộng, lời gọi findUnique cùng nhịp mà Prisma tự gom; join so với query đo thật, và hai mẫu khi include là công cụ sai.',
      content: `
${G09_2}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>N+1 in all its forms</h2>
<p class="lead">Prisma has no lazy loading, so the classic N+1 cannot happen by accident — Lesson 1.1 showed that an un-included relation is <code>undefined</code> and crashes rather than quietly querying. And yet the ranking table in Lesson 9.1 found forty-one calls to the same statement. N+1 gets in four other ways, and this lesson names all of them.</p>

<h3>Form 1 — the explicit loop</h3>
<p>Every number in this lesson is a median of five runs after one warm-up (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker (4 CPUs, 2 GB), Prisma 6.19.3), on 5,000 users, 1.2 million posts and 600,000 comments with the foreign keys indexed.</p>
<pre><code class="language-javascript"><span class="tok-comment">// The obvious one. Everybody writes it once.</span>
const posts = await prisma.post.findMany({ orderBy: { id: 'desc' }, take: 40 });
for (const b of posts) {
  const author = await prisma.user.findUnique({ where: { id: b.authorId } });
}
<span class="tok-comment">// Fix: ask for the relation with the parent</span>
await prisma.post.findMany({ orderBy: { id: 'desc' }, take: 40, include: { author: true } });</code></pre>
<div class="out">vong lap findUnique (40 bai)        41 truy van ·    25.1 ms ·    80 hang ·    66 KB
include: { author: true }            2 truy van ·     2.3 ms ·    80 hang ·    66 KB
prisma:query SELECT … FROM "posts" WHERE 1=1 ORDER BY "id" DESC LIMIT $1 OFFSET $2
prisma:query SELECT … FROM "users" WHERE "id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3</div>
<p>Forty-one queries became two — the default loads the relation with a second query using <code>IN (…)</code> — and the same 80 objects arrived about ten times faster.</p>

<h3>Form 2 — the loop hidden in a helper, and a fix that was slower</h3>
<pre><code class="language-javascript">const countComments = (postId: number) =&gt; prisma.comment.count({ where: { postId } });
for (const b of posts) await countComments(b.id);                         <span class="tok-comment">// sequential</span>
await Promise.all(posts.map((b) =&gt; countComments(b.id)));                 <span class="tok-comment">// concurrent</span>
await prisma.post.findMany({ take: 40, include: { _count: { select: { comments: true } } } });</code></pre>
<div class="out">tuan tu: for + await count          41 truy van ·    21.1 ms ·    40 hang ·    35 KB
Promise.all(map count)              41 truy van ·     5.5 ms ·    40 hang ·    35 KB
include: { _count: comments }        1 truy van ·    71.1 ms ·    40 hang ·    35 KB
prisma:query SELECT … FROM "posts" LEFT JOIN (SELECT "post_id", COUNT(*) AS "_aggr_count_comments" FROM "comments" WHERE 1=1 GROUP BY "post_id") AS "aggr_selection</div>
<div class="pitfall">
<p><strong>Trap — the usual fix, <code>_count</code>, can be the slowest of the three.</strong> Without the <code>relationJoins</code> preview, Prisma 6.19.3 sends <code>_count</code> as a LEFT JOIN on a sub-select that runs <code>GROUP BY post_id</code> over the <em>entire</em> comments table — 600,000 rows aggregated to count the comments of 40 posts. It was slower than the sequential loop. With <code>relationJoins</code> enabled the same include became a LATERAL subquery limited to the 40 posts:</p>
<div class="out">include author (co relationJoins)    1 truy van ·     2.7 ms ·    80 hang ·    66 KB
prisma:query SELECT … FROM "posts" AS "t0" LEFT JOIN LATERAL (SELECT JSONB_BUILD_OBJECT('id', "id", 'email', "email", 'username', "username", 'fullName', "full_nam
_count comments (co relationJoins)   1 truy van ·     1.5 ms ·    40 hang ·    35 KB
prisma:query SELECT … FROM "posts" AS "t0" LEFT JOIN LATERAL (SELECT COUNT(*) AS "_aggr_count_comments" FROM "comments" AS "t2" WHERE "id" = "post_id") AS "t1" ON</div>
<p>And <code>Promise.all</code> only hid the forty-one queries from the wall clock — the database still ran every one. Count queries; then time the fix too.</p>
</div>

<h3>Form 3 — the nested <code>include</code> that fans out</h3>
<pre><code class="language-javascript">await prisma.user.findMany({ take: 20,
  include: { posts: { take: 10, orderBy: { id: 'desc' }, include: { comments: { include: { author: true } } } } } });
<span class="tok-comment">// what twenty cards actually render</span>
await prisma.user.findMany({ take: 20,
  select: { id: true, username: true, avatarUrl: true, _count: { select: { posts: true } },
    posts: { take: 3, orderBy: { publishedAt: 'desc' }, select: { id: true, title: true, _count: { select: { comments: true } } } } } });</code></pre>
<div class="out">include long 3 tang                  4 truy van ·    45.3 ms ·  1420 hang ·   725 KB
prisma:query SELECT … FROM "users" WHERE 1=1 ORDER BY "id" ASC LIMIT $1 OFFSET $2
prisma:query SELECT … FROM "posts" WHERE "author_id" IN ($1 … $n) ORDER BY "id" DESC OFFSET $21
prisma:query SELECT … FROM "comments" WHERE "post_id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$2
prisma:query SELECT … FROM "users" WHERE "id" IN ($1 … $n) OFFSET $21
select dung thu the hien             2 truy van ·    61.4 ms ·    80 hang ·     6 KB</div>
<p>Not an N+1 — four batched queries — and still the problem: 1,420 objects and 725 KB for twenty cards, because every level multiplies rows. The narrow select sent 6 KB, yet took longer: its two <code>_count</code> fields aggregate whole tables (form 2). Bytes and time are separate measurements; take both.</p>

<h3>Form 4 — the loop in the caller, which Prisma batches</h3>
<pre><code class="language-javascript">class PostService {
  getById(id: number)    { return prisma.post.findUniqueOrThrow({ where: { id }, include: { author: true } }); }
  getByIds(ids: number[]) { return prisma.post.findMany({ where: { id: { in: ids } }, include: { author: true } }); }
}
await Promise.all(ids.map((id) =&gt; svc.getById(id)));
await svc.getByIds(ids);</code></pre>
<div class="out">Promise.all(ids.map(getById))        2 truy van ·     4.6 ms ·    80 hang ·    66 KB
prisma:query SELECT … FROM "users" WHERE "id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3
prisma:query SELECT … FROM "posts" WHERE "id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3
prisma:query SELECT … FROM "users" WHERE "id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3
getByIds(ids)                        2 truy van ·     2.6 ms ·    80 hang ·    66 KB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Two queries, not forty-one</span><span class="v">Prisma batches <code>findUnique</code> / <code>findUniqueOrThrow</code> calls made in the same tick into one <code>IN</code> query — this caller pattern is not an N+1 in Prisma 6.19.3.</span></div>
  <div class="kv"><span class="k">What is not batched</span><span class="v">A <code>for … await</code> loop (one call per tick), and <code>findFirst</code> / <code>findMany</code>. Those stay one query each.</span></div>
  <div class="kv"><span class="k">Still write getByIds</span><span class="v">The batching depends on how the caller awaits. A plural method makes the efficient path explicit and independent of it.</span></div>
</div>

<h3><code>relationLoadStrategy</code> — join versus query, measured</h3>
<pre><code class="language-javascript">generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["relationJoins"]
}
await prisma.post.findMany({ take: 40, include: { author: true, comments: { take: 5 } }, relationLoadStrategy: 'join' });   <span class="tok-comment">// or 'query'</span></code></pre>
<div class="out">hep · 2 tang · query                 3 truy van ·     4.0 ms ·   200 hang ·    79 KB
hep · 2 tang · join                  1 truy van ·     3.9 ms ·   200 hang ·    79 KB
hep · 3 tang · query                 4 truy van ·     6.5 ms ·   320 hang ·   173 KB
hep · 3 tang · join                  1 truy van ·     7.0 ms ·   320 hang ·   173 KB
rong (body 6 KB) · 3 tang · query    4 truy van ·     7.7 ms ·   320 hang ·   403 KB
rong (body 6 KB) · 3 tang · join     1 truy van ·     8.2 ms ·   320 hang ·   403 KB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">With the flag on, join is the default</span><span class="v">A plain <code>include</code> became one LATERAL query without naming a strategy.</span></div>
  <div class="kv"><span class="k">Small differences either way</span><span class="v">Two and three levels: within about a millisecond of each other on localhost. Across a region boundary, one round trip instead of three matters more.</span></div>
  <div class="kv"><span class="k">A wide parent did not blow up</span><span class="v">With a 6 KB body, three levels: join was not dramatically worse — Prisma's join aggregates the children into JSON per parent, so the parent row is not repeated per child.</span></div>
  <div class="kv"><span class="k">Measure per query</span><span class="v">It is an argument, not a setting. Try both on the queries that matter, on your own data.</span></div>
</div>

<h3>Two patterns for when <code>include</code> is the wrong tool</h3>
<pre><code class="language-javascript"><span class="tok-comment">// 1 — the newest 3 posts of each of 20 users, in one pass</span>
const feed = await prisma.$queryRaw&#96;
  SELECT u.id, u.username, b.*
  FROM users u
  LEFT JOIN LATERAL (
    SELECT id AS post_id, title, published_at FROM posts
    WHERE author_id = u.id AND published
    ORDER BY published_at DESC LIMIT 3
  ) b ON true
  WHERE u.id = ANY(\${ids}::int[])&#96;;</code></pre>
<div class="out">include posts take 3 (20 user)       2 truy van ·    12.9 ms ·    74 hang ·     5 KB
$queryRaw LATERAL                    1 truy van ·     6.5 ms ·    56 hang ·     6 KB</div>
<pre><code class="language-javascript"><span class="tok-comment">// 2 — a stored counter, when a count is sorted or filtered on</span>
model Post {
  id           Int @id @default(autoincrement())
  commentCount Int @default(0) @map("comment_count")
  @@index([commentCount])
}
await prisma.$transaction([
  prisma.comment.create({ data: { postId, body } }),
  prisma.post.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } }),
]);</code></pre>
<p>The raw LATERAL query did the top-3-per-user in one pass, roughly twice as fast as the include. The stored counter is the answer when "the ten most-commented posts" must be sorted: <code>_count</code> cannot be indexed, a column can.</p>

<h3>The rule</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Count queries per request, in a test</span><span class="lz-lnote">The only reliable detector. It should be a small constant and never grow with the number of items rendered.</span></div>
  <div class="lz-layer"><span class="lz-lname">Then count rows transferred</span><span class="lz-lnote">Four batched queries returning 5,606 rows for a twenty-card page is a problem the query count does not show. <code>select</code> what the page renders, nothing more.</span></div>
  <div class="lz-layer"><span class="lz-lname">Then try <code>join</code>, on that query</span><span class="lz-lnote">Measure both strategies on real data. It is a per-query argument and the answer genuinely differs by query shape.</span></div>
  <div class="lz-layer"><span class="lz-lname">Then leave Prisma, deliberately</span><span class="lz-lnote">A lateral join or a denormalised counter, when the access pattern is one Prisma's relation loading was not designed for. That is not a failure of the tool — Chapter 10 is about doing it well.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#relation-load-strategies" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Relation load strategies</span><span class="lc-sub">prisma.io/docs · <code>join</code> versus <code>query</code>, the preview flag, and the maintainers' guidance</span></span></a>
<a class="link-card" href="https://www.prisma.io/blog/prisma-orm-now-lets-you-choose-the-best-join-strategy-preview" target="_blank" rel="noopener"><span class="lc-ico">📣</span><span class="lc-body"><span class="lc-title">Choosing a join strategy — Prisma blog</span><span class="lc-sub">prisma.io/blog · Their own benchmarks and the reasoning behind keeping <code>query</code> as the default</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-LATERAL" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — LATERAL joins</span><span class="lc-sub">postgresql.org · The mechanism behind <code>join</code> strategy, and the top-N-per-group pattern</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js, Prisma chapter</span><span class="lc-sub">The same N+1 from the application side, with the Notes API as the worked example</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Find all four N+1 forms in one codebase, fix each, and prove it with a query-count test</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>N+1 ở đủ mọi dạng</h2>
<p class="lead">Prisma không có lazy loading, nên N+1 kinh điển không thể xảy ra một cách vô tình — Bài 1.1 đã chỉ ra rằng một quan hệ không được include là <code>undefined</code> và làm chết chương trình chứ không âm thầm bắn truy vấn. Vậy mà bảng xếp hạng ở Bài 9.1 vẫn tìm thấy bốn mươi mốt lời gọi cùng một câu lệnh. N+1 lẻn vào bằng bốn đường khác, và bài này gọi tên hết.</p>

<h3>Dạng 1 — vòng lặp tường minh</h3>
<p>Mọi con số trong bài này là trung vị của năm lần chạy sau một lần làm nóng (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker (4 CPU, 2 GB), Prisma 6.19.3), trên 5.000 người dùng, 1,2 triệu bài và 600.000 bình luận, khoá ngoại đã có chỉ mục.</p>
<pre><code class="language-javascript"><span class="tok-comment">// Cái hiển nhiên. Ai cũng viết nó một lần.</span>
const posts = await prisma.post.findMany({ orderBy: { id: 'desc' }, take: 40 });
for (const b of posts) {
  const author = await prisma.user.findUnique({ where: { id: b.authorId } });
}
<span class="tok-comment">// Sửa: xin quan hệ cùng với bản ghi cha</span>
await prisma.post.findMany({ orderBy: { id: 'desc' }, take: 40, include: { author: true } });</code></pre>
<div class="out">vong lap findUnique (40 bai)        41 truy van ·    25.1 ms ·    80 hang ·    66 KB
include: { author: true }            2 truy van ·     2.3 ms ·    80 hang ·    66 KB
prisma:query SELECT … FROM "posts" WHERE 1=1 ORDER BY "id" DESC LIMIT $1 OFFSET $2
prisma:query SELECT … FROM "users" WHERE "id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3</div>
<p>Bốn mươi mốt truy vấn thành hai — mặc định tải quan hệ bằng một truy vấn thứ hai dùng <code>IN (…)</code> — và cùng 80 đối tượng về nhanh hơn khoảng mười lần.</p>

<h3>Dạng 2 — vòng lặp giấu trong hàm phụ, và một cách sửa còn chậm hơn</h3>
<pre><code class="language-javascript">const countComments = (postId: number) =&gt; prisma.comment.count({ where: { postId } });
for (const b of posts) await countComments(b.id);                         <span class="tok-comment">// tuần tự</span>
await Promise.all(posts.map((b) =&gt; countComments(b.id)));                 <span class="tok-comment">// đồng thời</span>
await prisma.post.findMany({ take: 40, include: { _count: { select: { comments: true } } } });</code></pre>
<div class="out">tuan tu: for + await count          41 truy van ·    21.1 ms ·    40 hang ·    35 KB
Promise.all(map count)              41 truy van ·     5.5 ms ·    40 hang ·    35 KB
include: { _count: comments }        1 truy van ·    71.1 ms ·    40 hang ·    35 KB
prisma:query SELECT … FROM "posts" LEFT JOIN (SELECT "post_id", COUNT(*) AS "_aggr_count_comments" FROM "comments" WHERE 1=1 GROUP BY "post_id") AS "aggr_selection</div>
<div class="pitfall">
<p><strong>Bẫy — cách sửa quen thuộc, <code>_count</code>, có thể chậm nhất trong ba.</strong> Không bật bản thử nghiệm <code>relationJoins</code>, Prisma 6.19.3 gửi <code>_count</code> thành một LEFT JOIN trên truy vấn con chạy <code>GROUP BY post_id</code> trên <em>toàn bộ</em> bảng bình luận — gộp 600.000 hàng để đếm bình luận của 40 bài. Nó chậm hơn cả vòng lặp tuần tự. Bật <code>relationJoins</code> thì cùng include ấy thành truy vấn con LATERAL chỉ trên 40 bài:</p>
<div class="out">include author (co relationJoins)    1 truy van ·     2.7 ms ·    80 hang ·    66 KB
prisma:query SELECT … FROM "posts" AS "t0" LEFT JOIN LATERAL (SELECT JSONB_BUILD_OBJECT('id', "id", 'email', "email", 'username', "username", 'fullName', "full_nam
_count comments (co relationJoins)   1 truy van ·     1.5 ms ·    40 hang ·    35 KB
prisma:query SELECT … FROM "posts" AS "t0" LEFT JOIN LATERAL (SELECT COUNT(*) AS "_aggr_count_comments" FROM "comments" AS "t2" WHERE "id" = "post_id") AS "t1" ON</div>
<p>Còn <code>Promise.all</code> chỉ giấu bốn mươi mốt truy vấn khỏi đồng hồ tường — cơ sở dữ liệu vẫn chạy từng câu. Đếm truy vấn; rồi đo cả cách sửa.</p>
</div>

<h3>Dạng 3 — <code>include</code> lồng nhau nở bung ra</h3>
<pre><code class="language-javascript">await prisma.user.findMany({ take: 20,
  include: { posts: { take: 10, orderBy: { id: 'desc' }, include: { comments: { include: { author: true } } } } } });
<span class="tok-comment">// thứ hai mươi thẻ thật sự hiển thị</span>
await prisma.user.findMany({ take: 20,
  select: { id: true, username: true, avatarUrl: true, _count: { select: { posts: true } },
    posts: { take: 3, orderBy: { publishedAt: 'desc' }, select: { id: true, title: true, _count: { select: { comments: true } } } } } });</code></pre>
<div class="out">include long 3 tang                  4 truy van ·    45.3 ms ·  1420 hang ·   725 KB
prisma:query SELECT … FROM "users" WHERE 1=1 ORDER BY "id" ASC LIMIT $1 OFFSET $2
prisma:query SELECT … FROM "posts" WHERE "author_id" IN ($1 … $n) ORDER BY "id" DESC OFFSET $21
prisma:query SELECT … FROM "comments" WHERE "post_id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$2
prisma:query SELECT … FROM "users" WHERE "id" IN ($1 … $n) OFFSET $21
select dung thu the hien             2 truy van ·    61.4 ms ·    80 hang ·     6 KB</div>
<p>Không phải N+1 — bốn truy vấn đã gom — mà vẫn là vấn đề: 1.420 đối tượng và 725 KB cho hai mươi thẻ, vì mỗi tầng nhân số hàng lên. select gọn chỉ gửi 6 KB, vậy mà lại lâu hơn: hai trường <code>_count</code> của nó gộp cả bảng (dạng 2). Byte và thời gian là hai phép đo riêng; hãy lấy cả hai.</p>

<h3>Dạng 4 — vòng lặp ở bên gọi, và Prisma tự gom</h3>
<pre><code class="language-javascript">class PostService {
  getById(id: number)    { return prisma.post.findUniqueOrThrow({ where: { id }, include: { author: true } }); }
  getByIds(ids: number[]) { return prisma.post.findMany({ where: { id: { in: ids } }, include: { author: true } }); }
}
await Promise.all(ids.map((id) =&gt; svc.getById(id)));
await svc.getByIds(ids);</code></pre>
<div class="out">Promise.all(ids.map(getById))        2 truy van ·     4.6 ms ·    80 hang ·    66 KB
prisma:query SELECT … FROM "users" WHERE "id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3
prisma:query SELECT … FROM "posts" WHERE "id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3
prisma:query SELECT … FROM "users" WHERE "id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3
getByIds(ids)                        2 truy van ·     2.6 ms ·    80 hang ·    66 KB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai truy vấn, không phải bốn mươi mốt</span><span class="v">Prisma gom các lời gọi <code>findUnique</code> / <code>findUniqueOrThrow</code> trong cùng một nhịp thành một truy vấn <code>IN</code> — kiểu gọi này không phải N+1 ở Prisma 6.19.3.</span></div>
  <div class="kv"><span class="k">Thứ không được gom</span><span class="v">Vòng <code>for … await</code> (mỗi nhịp một lời gọi), và <code>findFirst</code> / <code>findMany</code>. Chúng vẫn mỗi lần một truy vấn.</span></div>
  <div class="kv"><span class="k">Vẫn viết getByIds</span><span class="v">Việc gom phụ thuộc vào cách bên gọi await. Một phương thức số nhiều làm đường hiệu quả thành tường minh, không phụ thuộc điều đó.</span></div>
</div>

<h3><code>relationLoadStrategy</code> — join so với query, đo thật</h3>
<pre><code class="language-javascript">generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["relationJoins"]
}
await prisma.post.findMany({ take: 40, include: { author: true, comments: { take: 5 } }, relationLoadStrategy: 'join' });   <span class="tok-comment">// hoặc 'query'</span></code></pre>
<div class="out">hep · 2 tang · query                 3 truy van ·     4.0 ms ·   200 hang ·    79 KB
hep · 2 tang · join                  1 truy van ·     3.9 ms ·   200 hang ·    79 KB
hep · 3 tang · query                 4 truy van ·     6.5 ms ·   320 hang ·   173 KB
hep · 3 tang · join                  1 truy van ·     7.0 ms ·   320 hang ·   173 KB
rong (body 6 KB) · 3 tang · query    4 truy van ·     7.7 ms ·   320 hang ·   403 KB
rong (body 6 KB) · 3 tang · join     1 truy van ·     8.2 ms ·   320 hang ·   403 KB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Bật cờ thì join là mặc định</span><span class="v">Một <code>include</code> trơn thành một truy vấn LATERAL mà không cần khai chiến lược.</span></div>
  <div class="kv"><span class="k">Chênh lệch nhỏ, khi bên này khi bên kia</span><span class="v">Hai và ba tầng: cách nhau khoảng một mili giây trên localhost. Qua ranh giới vùng mạng, một lượt đi về thay vì ba mới đáng kể.</span></div>
  <div class="kv"><span class="k">Bản ghi cha rộng không làm nổ</span><span class="v">Với body 6 KB, ba tầng: join không tệ hơn đáng kể — join của Prisma gom con thành JSON theo từng cha, nên hàng cha không bị lặp theo từng con.</span></div>
  <div class="kv"><span class="k">Đo theo từng truy vấn</span><span class="v">Đó là một đối số, không phải một thiết lập. Thử cả hai trên các truy vấn quan trọng, trên dữ liệu của bạn.</span></div>
</div>

<h3>Hai mẫu cho khi <code>include</code> là công cụ sai</h3>
<pre><code class="language-javascript"><span class="tok-comment">// 1 — 3 bài mới nhất của mỗi người trong 20 người, trong một lượt</span>
const feed = await prisma.$queryRaw&#96;
  SELECT u.id, u.username, b.*
  FROM users u
  LEFT JOIN LATERAL (
    SELECT id AS post_id, title, published_at FROM posts
    WHERE author_id = u.id AND published
    ORDER BY published_at DESC LIMIT 3
  ) b ON true
  WHERE u.id = ANY(\${ids}::int[])&#96;;</code></pre>
<div class="out">include posts take 3 (20 user)       2 truy van ·    12.9 ms ·    74 hang ·     5 KB
$queryRaw LATERAL                    1 truy van ·     6.5 ms ·    56 hang ·     6 KB</div>
<pre><code class="language-javascript"><span class="tok-comment">// 2 — cột đếm lưu sẵn, khi phải sắp hay lọc theo số đếm</span>
model Post {
  id           Int @id @default(autoincrement())
  commentCount Int @default(0) @map("comment_count")
  @@index([commentCount])
}
await prisma.$transaction([
  prisma.comment.create({ data: { postId, body } }),
  prisma.post.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } }),
]);</code></pre>
<p>Câu LATERAL thô làm top-3 mỗi người trong một lượt, nhanh khoảng gấp đôi include. Cột đếm lưu sẵn là câu trả lời khi "mười bài nhiều bình luận nhất" phải sắp xếp: <code>_count</code> không lập chỉ mục được, một cột thì được.</p>

<h3>Luật</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đếm số truy vấn mỗi yêu cầu, trong một bài kiểm</span><span class="lz-lnote">Bộ dò đáng tin duy nhất. Nó phải là một hằng số nhỏ và không bao giờ tăng theo số phần tử được vẽ ra.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rồi đếm số hàng truyền đi</span><span class="lz-lnote">Bốn câu truy vấn đã gom lô trả về 5.606 hàng cho một trang hai mươi thẻ là một vấn đề mà con số đếm truy vấn không cho thấy. Hãy <code>select</code> đúng thứ trang vẽ ra, không hơn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rồi thử <code>join</code>, trên chính câu truy vấn ấy</span><span class="lz-lnote">Đo cả hai chiến lược trên dữ liệu thật. Nó là một tham số theo từng truy vấn và câu trả lời thật sự khác nhau tuỳ hình dạng truy vấn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rồi rời Prisma, một cách có chủ ý</span><span class="lz-lnote">Một lateral join hoặc một cột đếm phi chuẩn hoá, khi mẫu truy cập là thứ mà phần nạp quan hệ của Prisma không được thiết kế cho. Đó không phải thất bại của công cụ — Chương 10 nói về cách làm việc đó cho tử tế.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#relation-load-strategies" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Relation load strategies</span><span class="lc-sub">prisma.io/docs · <code>join</code> so với <code>query</code>, cờ preview, và hướng dẫn của chính đội ngũ</span></span></a>
<a class="link-card" href="https://www.prisma.io/blog/prisma-orm-now-lets-you-choose-the-best-join-strategy-preview" target="_blank" rel="noopener"><span class="lc-ico">📣</span><span class="lc-body"><span class="lc-title">Chọn chiến lược join — blog Prisma</span><span class="lc-sub">prisma.io/blog · Số đo của chính họ và lý do giữ <code>query</code> làm mặc định</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-LATERAL" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — LATERAL join</span><span class="lc-sub">postgresql.org · Cơ chế đứng sau chiến lược <code>join</code>, và mẫu lấy top-N theo nhóm</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js, chương Prisma</span><span class="lc-sub">Cũng N+1 ấy nhìn từ phía ứng dụng, với Notes API làm ví dụ chạy xuyên suốt</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Tìm cả bốn dạng N+1 trong một kho mã, vá từng cái, và chứng minh bằng một bài kiểm đếm truy vấn</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — Indexes your Prisma queries can use|||9.3 — Chỉ mục mà truy vấn Prisma dùng được',
      slug: 'pr-9-3-chi-muc',
      type: 'LESSON',
      description: 'Từ câu truy vấn Prisma tới chỉ mục đúng: khoá ngoại chưa ai đánh, thứ tự cột trong chỉ mục phức hợp, chỉ mục phủ, cách tìm chỉ mục không ai dùng và cột thiếu chỉ mục bằng pg_stat, và bốn kiểu truy vấn không chỉ mục nào cứu được.',
      content: `
${G09_3}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Indexes your Prisma queries can use</h2>
<p class="lead">Prisma writes the SQL; PostgreSQL decides whether an index helps. That means index design is a conversation between what you wrote in <code>findMany</code> and what you declared in <code>@@index</code>, and the two are easy to get out of step. This lesson goes from query to index, then shows how to find the indexes nobody uses and the columns nobody indexed.</p>

<h3>Start from the query, not the schema</h3>
<pre><code class="language-javascript">await prisma.post.findMany({
  where:   { authorId: 42, published: true, deletedAt: null },
  orderBy: { publishedAt: 'desc' },
  take:    20,
});</code></pre>
<pre><code class="language-sql">-- the index that query wants — hand-written, because of the predicate
CREATE INDEX posts_tac_gia_dang ON posts (author_id, published, published_at DESC)
  WHERE deleted_at IS NULL;</code></pre>
<div class="out">-- before
              -&gt;  Parallel Seq Scan on posts  (actual time=6.180..228.766 rows=80 loops=3)
                    Rows Removed by Filter: 399920
Execution Time: 247.972 ms
-- after
  -&gt;  Index Scan using posts_tac_gia_dang on posts  (actual time=0.016..0.030 rows=20 loops=1)
        Index Cond: ((author_id = 42) AND (published = true))
Execution Time: 0.043 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Equality columns first</span><span class="v">author_id, published — then the sort column in the direction of the ORDER BY, so the first twenty index entries are the answer.</span></div>
  <div class="kv"><span class="k">The soft-delete filter is the predicate</span><span class="v">A partial index never contains deleted rows — and is only usable by queries that repeat <code>deleted_at IS NULL</code> (see the covering-index section).</span></div>
  <div class="kv"><span class="k">Verify</span><span class="v">Index Scan and no Sort node. Measured (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker (4 CPUs, 2 GB), Prisma 6.19.3) on 1.2 million posts.</span></div>
</div>

<h3>The foreign key nobody indexed</h3>
<pre><code class="language-sql">SELECT c.conrelid::regclass AS bang, a.attname AS cot, c.conname AS rang_buoc
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid AND a.attnum = i.indkey[0])
ORDER BY 1, 2;</code></pre>
<div class="out">bang   |    cot    |        rang_buoc        
----------+-----------+-------------------------
 posts    | author_id | posts_author_id_fkey
 comments | author_id | comments_author_id_fkey
 comments | post_id   | comments_post_id_fkey
(3 rows)</div>
<p>A schema created by <code>db push</code> from relations alone: three foreign keys, none indexed. PostgreSQL indexes primary keys and unique constraints; it never indexes the referencing side, and Prisma does not add one. In Lesson 9.1 the slowest query left after the trigram fix was exactly a COUNT by <code>author_id</code>. CuongThai itself carries a migration named <code>20261026080000_add_fk_indexes_low_risk</code> — added after the fact, which is the normal way this goes.</p>

<h3>Column order, measured</h3>
<pre><code class="language-javascript">// A:  where { authorId: 42 }, orderBy { publishedAt: 'desc' }, take 20
// B:  where { publishedAt: { gt: 2026-08-01 } }, take 20          <span class="tok-comment">// no orderBy</span>
// B2: same where, orderBy { publishedAt: 'asc' }, take 20
// C:  where { authorId: 42 }                                     <span class="tok-comment">// every row</span></code></pre>
<div class="out">-- idx_ab (author_id, published_at)
A: Index Scan Backward using idx_ab on posts  · 0.029 ms
B: Index Scan using posts_pkey on posts  · 413.691 ms
B2: Parallel Seq Scan on posts  · 226.853 ms
C: Bitmap Heap Scan on posts  → Bitmap Index Scan on idx_ab  · 0.187 ms
-- idx_ba (published_at, author_id)
A: Index Scan Backward using idx_ba on posts  · 0.741 ms
B: Index Scan using posts_pkey on posts  · 388.904 ms
B2: Index Scan using idx_ba on posts  · 0.018 ms
C: Index Scan using idx_ba on posts  · 10.185 ms

-- why B ignores both
B: Index Scan using posts_pkey on posts  · 413.691 ms
B: Index Scan using posts_pkey on posts  · 388.904 ms
-- B: SELECT … FROM "posts" WHERE "posts"."published_at" &gt; '2026-08-01 00:00:00 UTC' ORDER BY "posts"."id" ASC LIMIT 20 OFFSET 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">take without orderBy adds ORDER BY id</span><span class="v">Prisma makes <code>take</code> deterministic by sorting on the primary key. Query B therefore walked <code>posts_pkey</code> and filtered — both column orders lost. Give every paginated query an explicit <code>orderBy</code> that matches an index.</span></div>
  <div class="kv"><span class="k">Equality first, range or sort last</span><span class="v">A with idx_ab and B2 with idx_ba read just the entries they return. A composite index serves its prefixes: C used idx_ab cheaply.</span></div>
  <div class="kv"><span class="k">The "wrong" order is not a Seq Scan</span><span class="v">With idx_ba, A and C still used the index — scanning far more of it. Slower by one to two orders of magnitude, not a full table read.</span></div>
  <div class="kv"><span class="k">Direction lives in @@index</span><span class="v"><code>@@index([authorId, publishedAt(sort: Desc)])</code> generates:<br><code>CREATE INDEX "posts_author_id_published_at_idx" ON "posts"("author_id", "published_at" DESC);</code></span></div>
</div>

<h3>A covering index — and a partial index that does nothing</h3>
<pre><code class="language-javascript">await prisma.post.findMany({
  where:  { authorId: 42, published: true },          <span class="tok-comment">// no deletedAt: null</span>
  orderBy: { publishedAt: 'desc' },
  select: { id: true, title: true, publishedAt: true },
  take:   20,
});</code></pre>
<pre><code class="language-sql">CREATE INDEX posts_bang_liet_ke ON posts (author_id, published, published_at DESC)
  INCLUDE (id, title);
VACUUM ANALYZE posts;</code></pre>
<div class="out">-- only the partial index posts_tac_gia_dang exists
              -&gt;  Parallel Seq Scan on posts  (actual time=3.805..181.426 rows=80 loops=3)
Execution Time: 200.514 ms
-- with the INCLUDE index
  -&gt;  Index Only Scan using posts_bang_liet_ke on posts  (actual time=0.019..0.021 rows=20 loops=1)
        Heap Fetches: 0
        Buffers: shared hit=4
Execution Time: 0.033 ms</div>
<div class="pitfall">
<p><strong>Trap — a partial index is used only when the query repeats its predicate.</strong> This list query forgot <code>deletedAt: null</code>, so <code>posts_tac_gia_dang</code> — built <code>WHERE deleted_at IS NULL</code> — could not answer it and PostgreSQL scanned the table. The INCLUDE index, built without a predicate, answered from the index alone: Index Only Scan, zero heap fetches.</p>
</div>

<h3>Finding the indexes nobody uses — and the scans nobody fixed</h3>
<div class="out">bang  |       chi_muc       | so_lan_dung | kich_thuoc 
-------+---------------------+-------------+------------
 posts | posts_bang_liet_ke  |           4 | 67 MB
 posts | posts_tac_gia_dang  |           0 | 33 MB
 posts | posts_published_idx |           0 | 8144 kB
(3 rows)
 bang  | seq_scan | seq_tup_read | idx_scan | hang_moi_lan_quet | so_hang 
-------+----------+--------------+----------+-------------------+---------
 posts |       30 |     14400000 |       10 |            480000 | 1201029
(1 row)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Zero scans</span><span class="v">An index that costs disk and write throughput and buys nothing. Check <code>stats_reset</code> first: zero over two hours means nothing, over two months it is a candidate.</span></div>
  <div class="kv"><span class="k">seq_tup_read ÷ seq_scan</span><span class="v">Close to the table size: full scans of a large table — find the query in pg_stat_statements. Close to zero, or a tiny table: nothing to do.</span></div>
  <div class="kv"><span class="k">Drop in a migration, concurrently</span><span class="v"><code>DROP INDEX CONCURRENTLY</code> takes no exclusive lock — and done by hand, the next migrate diff reports drift.</span></div>
</div>

<h3>Four queries no index can save</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>contains</code> without a trigram index</span><span class="v"><code>LIKE '%x%'</code> cannot use a B-tree at any column order. The fix is <code>pg_trgm</code> — Lesson 5.5, and it is an extension plus a GIN index, not a rearrangement.</span></div>
  <div class="kv"><span class="k">A large <code>OFFSET</code></span><span class="v">The index is used perfectly and the database still walks a million entries to discard them. Keyset pagination — Lesson 5.3 — with a single unique sort key or a raw row comparison; Lesson 9.5 measures a two-column Prisma cursor that is no faster than OFFSET. No index exists that fixes offset.</span></div>
  <div class="kv"><span class="k"><code>COUNT(*)</code> on a big table</span><span class="v">PostgreSQL has no stored row count, so a total is a full scan even with every index in place. Cache it, or read the estimate from <code>pg_class.reltuples</code>.</span></div>
  <div class="kv"><span class="k">A filter that matches most rows</span><span class="v"><code>WHERE published = true</code> when nearly every row is published. Measured: <code>where: { published: true }</code> (90 % of rows) used a covering index-only scan and still read about a million entries (rong: Index Only Scan using posts_bang_liet_ke on posts  · 127.581 ms). An index cannot make returning most of a table cheap. This is not a problem to fix.</span></div>
</div>

<div class="note-ct">
<p><strong>From the CuongThai codebase.</strong> This repository has a migration named <code>20260622_add_performance_indexes</code> — added after the fact, which is the normal way this goes. The lesson embedded in the name is that indexes are added when a query is measured, not when a model is written. The <code>@@index([authorId])</code> you add with the relation is the exception: that one is predictable, and Lesson 2.3 argues for adding it immediately.</p>
</div>

<h3>Learning sources for this lesson</h3>
<div class="pitfall">
<p><strong>Trap — adding an index for every column that appears in a &#96;where&#96;.</strong> An index is not free: every &#96;INSERT&#96;, &#96;UPDATE&#96; and &#96;DELETE&#96; must update it, it occupies disk and cache, and the planner has to consider it on every query. Ten indexes on a hot write table can halve write throughput while helping no read that was actually slow. Worse, an index the planner never chooses costs everything and returns nothing — and Postgres will tell you which ones those are (&#96;pg_stat_user_indexes&#96;, &#96;idx_scan = 0&#96;). Add an index because a specific slow query&#39;s &#96;EXPLAIN&#96; asked for it, verify the plan changed, and delete the ones that never get scanned.</p>
</div>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/indexes" target="_blank" rel="noopener"><span class="lc-ico">📇</span><span class="lc-body"><span class="lc-title">Prisma — indexes</span><span class="lc-sub">prisma.io/docs · <code>@@index</code> with sort, type and ops, and what cannot be declared</span></span></a>
<a class="link-card" href="https://use-the-index-luke.com/" target="_blank" rel="noopener"><span class="lc-ico">🔦</span><span class="lc-body"><span class="lc-title">Use The Index, Luke</span><span class="lc-sub">use-the-index-luke.com · The best free book on index design; the column-order chapter is the one to read first</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/indexes-index-only-scans.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — index-only scans</span><span class="lc-sub">postgresql.org · <code>INCLUDE</code>, the visibility map, and when Heap Fetches stops being zero</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, index chapter</span><span class="lc-sub">B-tree internals, selectivity and the planner's cost model — the theory behind every rule here</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Find the unindexed foreign keys and unused indexes in a real schema, then fix both</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Chỉ mục mà truy vấn Prisma dùng được</h2>
<p class="lead">Prisma viết SQL; PostgreSQL quyết định chỉ mục có giúp được không. Nghĩa là thiết kế chỉ mục là một cuộc đối thoại giữa thứ bạn viết trong <code>findMany</code> và thứ bạn khai trong <code>@@index</code>, và hai bên rất dễ lệch nhịp. Bài này đi từ câu truy vấn tới cái chỉ mục, rồi chỉ cách tìm những chỉ mục không ai dùng và những cột không ai đánh chỉ mục.</p>

<h3>Bắt đầu từ câu truy vấn, không phải từ lược đồ</h3>
<pre><code class="language-javascript">await prisma.post.findMany({
  where:   { authorId: 42, published: true, deletedAt: null },
  orderBy: { publishedAt: 'desc' },
  take:    20,
});</code></pre>
<pre><code class="language-sql">-- chỉ mục câu truy vấn ấy cần — viết tay, vì có điều kiện
CREATE INDEX posts_tac_gia_dang ON posts (author_id, published, published_at DESC)
  WHERE deleted_at IS NULL;</code></pre>
<div class="out">-- trước
              -&gt;  Parallel Seq Scan on posts  (actual time=6.180..228.766 rows=80 loops=3)
                    Rows Removed by Filter: 399920
Execution Time: 247.972 ms
-- sau
  -&gt;  Index Scan using posts_tac_gia_dang on posts  (actual time=0.016..0.030 rows=20 loops=1)
        Index Cond: ((author_id = 42) AND (published = true))
Execution Time: 0.043 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cột so bằng đứng trước</span><span class="v">author_id, published — rồi cột sắp xếp theo đúng chiều của ORDER BY, để hai mươi mục đầu tiên của chỉ mục chính là kết quả.</span></div>
  <div class="kv"><span class="k">Bộ lọc xoá mềm thành điều kiện</span><span class="v">Một chỉ mục một phần không bao giờ chứa hàng đã xoá — và chỉ dùng được cho truy vấn lặp lại <code>deleted_at IS NULL</code> (xem mục chỉ mục phủ).</span></div>
  <div class="kv"><span class="k">Kiểm lại</span><span class="v">Index Scan và không còn nút Sort. Đo thật (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker (4 CPU, 2 GB), Prisma 6.19.3) trên 1,2 triệu bài.</span></div>
</div>

<h3>Cái khoá ngoại không ai đánh chỉ mục</h3>
<pre><code class="language-sql">SELECT c.conrelid::regclass AS bang, a.attname AS cot, c.conname AS rang_buoc
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid AND a.attnum = i.indkey[0])
ORDER BY 1, 2;</code></pre>
<div class="out">bang   |    cot    |        rang_buoc        
----------+-----------+-------------------------
 posts    | author_id | posts_author_id_fkey
 comments | author_id | comments_author_id_fkey
 comments | post_id   | comments_post_id_fkey
(3 rows)</div>
<p>Một lược đồ dựng bằng <code>db push</code> chỉ từ các quan hệ: ba khoá ngoại, không cái nào có chỉ mục. PostgreSQL lập chỉ mục cho khoá chính và ràng buộc unique; nó không bao giờ lập chỉ mục phía tham chiếu, và Prisma cũng không thêm. Ở Bài 9.1, câu chậm nhất còn lại sau khi vá trigram chính là câu COUNT theo <code>author_id</code>. Bản thân CuongThai có một migration tên <code>20261026080000_add_fk_indexes_low_risk</code> — thêm vào sau, như thường lệ.</p>

<h3>Thứ tự cột, chứng minh bằng số</h3>
<pre><code class="language-javascript">// A:  where { authorId: 42 }, orderBy { publishedAt: 'desc' }, take 20
// B:  where { publishedAt: { gt: 2026-08-01 } }, take 20          <span class="tok-comment">// không orderBy</span>
// B2: cùng điều kiện, orderBy { publishedAt: 'asc' }, take 20
// C:  where { authorId: 42 }                                     <span class="tok-comment">// mọi hàng</span></code></pre>
<div class="out">-- idx_ab (author_id, published_at)
A: Index Scan Backward using idx_ab on posts  · 0.029 ms
B: Index Scan using posts_pkey on posts  · 413.691 ms
B2: Parallel Seq Scan on posts  · 226.853 ms
C: Bitmap Heap Scan on posts  → Bitmap Index Scan on idx_ab  · 0.187 ms
-- idx_ba (published_at, author_id)
A: Index Scan Backward using idx_ba on posts  · 0.741 ms
B: Index Scan using posts_pkey on posts  · 388.904 ms
B2: Index Scan using idx_ba on posts  · 0.018 ms
C: Index Scan using idx_ba on posts  · 10.185 ms

-- vì sao B bỏ qua cả hai
B: Index Scan using posts_pkey on posts  · 413.691 ms
B: Index Scan using posts_pkey on posts  · 388.904 ms
-- B: SELECT … FROM "posts" WHERE "posts"."published_at" &gt; '2026-08-01 00:00:00 UTC' ORDER BY "posts"."id" ASC LIMIT 20 OFFSET 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">take không orderBy kéo theo ORDER BY id</span><span class="v">Prisma làm <code>take</code> ổn định bằng cách sắp theo khoá chính. Vì thế truy vấn B đi theo <code>posts_pkey</code> rồi lọc — cả hai thứ tự cột đều thua. Hãy cho mọi truy vấn phân trang một <code>orderBy</code> tường minh khớp với một chỉ mục.</span></div>
  <div class="kv"><span class="k">So bằng trước, phạm vi hay sắp xếp sau</span><span class="v">A với idx_ab và B2 với idx_ba chỉ đọc đúng những mục trả về. Chỉ mục ghép phục vụ các tiền tố của nó: C dùng idx_ab rất rẻ.</span></div>
  <div class="kv"><span class="k">Thứ tự "sai" không thành Seq Scan</span><span class="v">Với idx_ba, A và C vẫn dùng chỉ mục — quét nhiều hơn hẳn. Chậm hơn một tới hai bậc, không phải đọc cả bảng.</span></div>
  <div class="kv"><span class="k">Chiều nằm trong @@index</span><span class="v"><code>@@index([authorId, publishedAt(sort: Desc)])</code> sinh ra:<br><code>CREATE INDEX "posts_author_id_published_at_idx" ON "posts"("author_id", "published_at" DESC);</code></span></div>
</div>

<h3>Chỉ mục phủ — và một chỉ mục một phần chẳng làm gì</h3>
<pre><code class="language-javascript">await prisma.post.findMany({
  where:  { authorId: 42, published: true },          <span class="tok-comment">// không có deletedAt: null</span>
  orderBy: { publishedAt: 'desc' },
  select: { id: true, title: true, publishedAt: true },
  take:   20,
});</code></pre>
<pre><code class="language-sql">CREATE INDEX posts_bang_liet_ke ON posts (author_id, published, published_at DESC)
  INCLUDE (id, title);
VACUUM ANALYZE posts;</code></pre>
<div class="out">-- chỉ có chỉ mục một phần posts_tac_gia_dang
              -&gt;  Parallel Seq Scan on posts  (actual time=3.805..181.426 rows=80 loops=3)
Execution Time: 200.514 ms
-- có chỉ mục INCLUDE
  -&gt;  Index Only Scan using posts_bang_liet_ke on posts  (actual time=0.019..0.021 rows=20 loops=1)
        Heap Fetches: 0
        Buffers: shared hit=4
Execution Time: 0.033 ms</div>
<div class="pitfall">
<p><strong>Bẫy — chỉ mục một phần chỉ được dùng khi truy vấn lặp lại đúng điều kiện của nó.</strong> Truy vấn danh sách này quên <code>deletedAt: null</code>, nên <code>posts_tac_gia_dang</code> — dựng với <code>WHERE deleted_at IS NULL</code> — không trả lời được và PostgreSQL quét cả bảng. Chỉ mục INCLUDE, dựng không có điều kiện, trả lời chỉ bằng chỉ mục: Index Only Scan, không lần nào phải đọc bảng.</p>
</div>

<h3>Tìm chỉ mục không ai dùng — và những lần quét chưa sửa</h3>
<div class="out">bang  |       chi_muc       | so_lan_dung | kich_thuoc 
-------+---------------------+-------------+------------
 posts | posts_bang_liet_ke  |           4 | 67 MB
 posts | posts_tac_gia_dang  |           0 | 33 MB
 posts | posts_published_idx |           0 | 8144 kB
(3 rows)
 bang  | seq_scan | seq_tup_read | idx_scan | hang_moi_lan_quet | so_hang 
-------+----------+--------------+----------+-------------------+---------
 posts |       30 |     14400000 |       10 |            480000 | 1201029
(1 row)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không lần nào dùng</span><span class="v">Một chỉ mục tốn đĩa, tốn thông lượng ghi, và không mua được gì. Xem <code>stats_reset</code> trước: không lần nào trong hai giờ thì chưa nói lên gì, trong hai tháng thì đáng cân nhắc.</span></div>
  <div class="kv"><span class="k">seq_tup_read ÷ seq_scan</span><span class="v">Gần bằng cỡ bảng: quét cả một bảng lớn — tìm câu đó trong pg_stat_statements. Gần không, hoặc bảng nhỏ: không có gì phải làm.</span></div>
  <div class="kv"><span class="k">Bỏ trong migration, CONCURRENTLY</span><span class="v"><code>DROP INDEX CONCURRENTLY</code> không giữ khoá độc quyền — và làm bằng tay thì lần migrate diff sau báo trôi dạt.</span></div>
</div>

<h3>Bốn kiểu truy vấn không chỉ mục nào cứu được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>contains</code> mà không có chỉ mục trigram</span><span class="v"><code>LIKE '%x%'</code> không dùng được B-tree ở bất kỳ thứ tự cột nào. Cách vá là <code>pg_trgm</code> — Bài 5.5, và đó là một extension cộng một chỉ mục GIN, không phải một lần sắp xếp lại.</span></div>
  <div class="kv"><span class="k">Một <code>OFFSET</code> lớn</span><span class="v">Chỉ mục được dùng hoàn hảo mà cơ sở dữ liệu vẫn đi qua một triệu mục để vứt chúng đi. Phân trang keyset — Bài 5.3 — với một khoá sắp xếp duy nhất hoặc phép so sánh theo hàng trong SQL thô; Bài 9.5 đo một cursor hai cột của Prisma chẳng nhanh hơn OFFSET. Không tồn tại chỉ mục nào vá được offset.</span></div>
  <div class="kv"><span class="k"><code>COUNT(*)</code> trên một bảng lớn</span><span class="v">PostgreSQL không lưu số đếm hàng, nên một con số tổng là một lần quét toàn bộ dù có đủ mọi chỉ mục. Hãy lưu đệm nó, hoặc đọc con số ước lượng từ <code>pg_class.reltuples</code>.</span></div>
  <div class="kv"><span class="k">Một bộ lọc khớp gần hết các hàng</span><span class="v"><code>WHERE published = true</code> khi gần hết đã đăng. Đo thật: <code>where: { published: true }</code> (90 % số hàng) dùng một lần quét chỉ-mục-phủ mà vẫn đọc khoảng một triệu mục (rong: Index Only Scan using posts_bang_liet_ke on posts  · 127.581 ms). Chỉ mục không làm rẻ được việc trả về gần hết một bảng.</span></div>
</div>

<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai.</strong> Kho này có một migration tên <code>20260622_add_performance_indexes</code> — thêm vào sau khi đã chạy, và đó là cách chuyện này diễn ra một cách bình thường. Bài học nằm trong chính cái tên: chỉ mục được thêm khi một câu truy vấn đã được đo, chứ không phải khi một model được viết ra. Cái <code>@@index([authorId])</code> bạn thêm cùng với quan hệ là ngoại lệ: cái đó đoán trước được, và Bài 2.3 lập luận cho việc thêm nó ngay.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<div class="pitfall">
<p><strong>Bẫy — thêm chỉ mục cho mọi cột xuất hiện trong một &#96;where&#96;.</strong> Một chỉ mục không miễn phí: mọi &#96;INSERT&#96;, &#96;UPDATE&#96; và &#96;DELETE&#96; đều phải cập nhật nó, nó chiếm đĩa và chiếm bộ nhớ đệm, và bộ lập kế hoạch phải cân nhắc nó ở mọi truy vấn. Mười chỉ mục trên một bảng ghi nhiều có thể làm thông lượng ghi giảm một nửa mà chẳng giúp được phép đọc nào vốn đang chậm. Tệ hơn, một chỉ mục mà bộ lập kế hoạch chẳng bao giờ chọn thì tốn đủ thứ và trả về con số không — và Postgres nói cho bạn biết những cái đó là cái nào (&#96;pg_stat_user_indexes&#96;, &#96;idx_scan = 0&#96;). Hãy thêm chỉ mục vì &#96;EXPLAIN&#96; của một truy vấn chậm cụ thể đòi nó, xác nhận kế hoạch đã đổi, và xoá những cái chẳng bao giờ được quét tới.</p>
</div>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/indexes" target="_blank" rel="noopener"><span class="lc-ico">📇</span><span class="lc-body"><span class="lc-title">Prisma — indexes</span><span class="lc-sub">prisma.io/docs · <code>@@index</code> kèm sort, type và ops, và những gì không khai được</span></span></a>
<a class="link-card" href="https://use-the-index-luke.com/" target="_blank" rel="noopener"><span class="lc-ico">🔦</span><span class="lc-body"><span class="lc-title">Use The Index, Luke</span><span class="lc-sub">use-the-index-luke.com · Cuốn sách miễn phí hay nhất về thiết kế chỉ mục; chương thứ tự cột nên đọc trước</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/indexes-index-only-scans.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — index-only scan</span><span class="lc-sub">postgresql.org · <code>INCLUDE</code>, bản đồ khả kiến, và khi nào Heap Fetches thôi bằng không</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương chỉ mục</span><span class="lc-sub">Bên trong B-tree, độ chọn lọc và mô hình chi phí của bộ lập kế hoạch — lý thuyết sau mọi luật ở đây</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Tìm những khoá ngoại thiếu chỉ mục và những chỉ mục không ai dùng trong một lược đồ thật, rồi vá cả hai</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — The connection pool, sized by arithmetic|||9.4 — Connection pool, tính bằng số học',
      slug: 'pr-9-4-connection-pool',
      type: 'LESSON',
      description: 'Pool mặc định là số nhân × 2 + 1 cho mỗi tiến trình (đo: 21 trên máy 10 nhân), container báo sai số CPU, phép tính theo max_connections, pg_stat_activity, tải thật 10/50/200 kết nối, và PgBouncer phải có pgbouncer=true.',
      content: `
${G09_4}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>The connection pool, sized by arithmetic</h2>
<p class="lead">Prisma's pool default is <code>num_cpus * 2 + 1</code>, which is a sensible number for one process and a disaster when multiplied by eight containers on a sixteen-core host. Pool sizing is arithmetic, not judgement — this lesson does the arithmetic, then shows how to measure whether you got it right.</p>

<h3>The default, and the multiplication</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient();                    <span class="tok-comment">// no connection_limit</span>
const viec = Promise.all(Array.from({ length: 60 }, () =&gt; prisma.$queryRaw&#96;SELECT 1 AS x FROM pg_sleep(0.5)&#96;));
await ngu(250);
console.log((await prisma.$metrics.json()).gauges);   <span class="tok-comment">// previewFeatures = ["metrics"]</span></code></pre>
<div class="out">60 truy van pg_sleep(0.5) cung luc, client khong dat connection_limit:
  prisma_client_queries_wait           39
  prisma_pool_connections_busy         21
  prisma_pool_connections_idle         0
  prisma_pool_connections_open         21
┌─────────┬──────────┬────┬────────────┐
│ (index) │ state    │ so │ lau_nhat   │
├─────────┼──────────┼────┼────────────┤
│ 0       │ 'active' │ 21 │ '00:00:00' │
└─────────┴──────────┴────┴────────────┘</div>
<div class="kv-grid">
  <div class="kv"><span class="k">21 = 10 × 2 + 1</span><span class="v">On a 10-core machine (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker (4 CPUs, 2 GB), Prisma 6.19.3) the default pool opened 21 connections and 39 queries waited. That is per process: four such processes hold 84.</span></div>
  <div class="kv"><span class="k">A PrismaPromise is lazy</span><span class="v">A query built and never awaited (or .then-ed) never runs. Mapping queries into an array starts nothing until Promise.all touches it.</span></div>
  <div class="kv"><span class="k">$metrics</span><span class="v">Behind the <code>metrics</code> preview, which Prisma 6.19.3 reports as deprecated on generate. pg_stat_activity (below) needs no flag.</span></div>
</div>
<pre><code class="language-bash">docker run --rm --cpus=2 node:22-alpine node -e "…os.cpus().length, os.availableParallelism()"</code></pre>
<div class="out">os.cpus().length = 10 · availableParallelism() = 2
10</div>
<div class="pitfall">
<p><strong>Trap — <code>--cpus=2</code> does not change what <code>os.cpus()</code> reports.</strong> A CPU quota is enforced by the scheduler; the container still lists every core of the host (10 here). <code>os.availableParallelism()</code> does read the quota (2). Neither should size your pool: write <code>connection_limit</code> into DATABASE_URL.</p>
</div>

<h3>The arithmetic</h3>
<div class="out">max_connections 
-----------------
 100
(1 row)
 superuser_reserved_connections 
--------------------------------
 3
(1 row)</div>
<pre><code class="language-javascript">// available = max_connections − reserved − others (psql, cron, migrations)
//           =      100        −    3     −  10   = 87
// connection_limit = 87 / 6 containers ≈ 14 → 12</code></pre>
<pre><code class="language-bash">DATABASE_URL="postgresql://u:p@host:5432/db?connection_limit=12&amp;pool_timeout=20&amp;connect_timeout=10"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>connection_limit</code></span><span class="v">The pool size — the number that matters, and the one nobody sets.</span></div>
  <div class="kv"><span class="k"><code>pool_timeout</code></span><span class="v">How long a query waits for a free connection before P2024 (default 10 s).</span></div>
  <div class="kv"><span class="k"><code>connect_timeout</code></span><span class="v">How long opening a new connection may take (default 5 s).</span></div>
  <div class="kv"><span class="k">Count the workers too</span><span class="v">Every process with a PrismaClient is another pool. A background worker usually needs 3 or 4.</span></div>
</div>

<h3>Measure it</h3>
<pre><code class="language-javascript">// an "HTTP call" of 3 s inside an interactive transaction, six real queries meanwhile
const tx = prisma.$transaction(async (t) =&gt; { await t.post.findFirst(); await ngu(3000); }, { timeout: 10000 });</code></pre>
<pre><code class="language-sql">SELECT state, count(*) AS so, max(now() - state_change)::interval(0) AS lau_nhat
FROM pg_stat_activity WHERE datname = current_database() GROUP BY state;</code></pre>
<div class="out">┌─────────┬───────────────────────┬────┬────────────┐
│ (index) │ state                 │ so │ lau_nhat   │
├─────────┼───────────────────────┼────┼────────────┤
│ 0       │ 'active'              │ 6  │ '00:00:01' │
│ 1       │ 'idle in transaction' │ 1  │ '00:00:01' │
└─────────┴───────────────────────┴────┴────────────┘</div>
<div class="callout ok">
<p><strong><code>idle in transaction</code> is always worth investigating.</strong> A connection held by a transaction that is doing nothing — the Lesson 7.1 mistake, visible from the database side. Set <code>idle_in_transaction_session_timeout</code> as a backstop.</p>
</div>

<h3>Why a bigger pool is often not faster</h3>
<pre><code class="language-javascript">// 200 concurrent workers for 8 s, three rounds; each loop one query aggregating ~240 rows
new PrismaClient({ datasourceUrl: &#96;\${URL}?connection_limit=\${n}&amp;pool_timeout=30&#96; });</code></pre>
<div class="out">connection_limit=10   → p50  535 ms · p99   713 ms · thong luong   387 truy van/s · loi 0
connection_limit=50   → p50  631 ms · p99  1114 ms · thong luong   323 truy van/s · loi 0
connection_limit=200  → p50  997 ms · p99  2114 ms · thong luong    89 truy van/s · loi 6627 — P2037 Too many database connections opened
connection_limit=10   → p50  494 ms · p99   632 ms · thong luong   416 truy van/s · loi 0
connection_limit=50   → p50  467 ms · p99  1000 ms · thong luong   425 truy van/s · loi 0
connection_limit=200  → p50 1134 ms · p99  2097 ms · thong luong    82 truy van/s · loi 7001 — P2037 Too many database connections opened
connection_limit=10   → p50  510 ms · p99   856 ms · thong luong   375 truy van/s · loi 0
connection_limit=50   → p50  443 ms · p99   618 ms · thong luong   466 truy van/s · loi 0
connection_limit=200  → p50  895 ms · p99  1625 ms · thong luong   107 truy van/s · loi 8341 — P2037 Too many database connections opened</div>
<div class="kv-grid">
  <div class="kv"><span class="k">10 and 50: about the same</span><span class="v">On a 4-CPU database (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker (4 CPUs, 2 GB), Prisma 6.19.3) five times the connections bought no throughput; 50 had the worse tail latency in two of three rounds.</span></div>
  <div class="kv"><span class="k">200: P2037</span><span class="v">More than max_connections allows: thousands of failed queries, and the throughput fell.</span></div>
  <div class="kv"><span class="k">Then measure</span><span class="v">Raise the pool only when queries wait for connections and the database still has CPU to spare.</span></div>
</div>

<h3>When processes outnumber connections: PgBouncer</h3>
<pre><code class="language-javascript">datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        <span class="tok-comment">// PgBouncer</span>
  directUrl = env("DIRECT_URL")          <span class="tok-comment">// PostgreSQL, for migrate</span>
}</code></pre>
<pre><code class="language-bash">DATABASE_URL="postgresql://u:p@pgbouncer:6432/db?pgbouncer=true&amp;connection_limit=1"
DIRECT_URL="postgresql://u:p@postgres:5432/db"</code></pre>
<div class="out">qua PgBouncer + pgbouncer=true: 200 tho, 2295 truy van ok, 0 loi · PostgreSQL thay toi da 20 ket noi
qua PgBouncer (KHONG co pgbouncer=true): 200 tho, 1285 truy van ok, 23786 loi · PostgreSQL thay toi da 20 ket noi
  loi dau tien:  … message: "prepared statement \\"s0\\" does not</div>
<div class="pitfall">
<p><strong>Trap — PgBouncer in transaction mode without <code>pgbouncer=true</code>.</strong> Measured through PgBouncer 1.23.1 with a pool of 20: with the flag, 200 client connections ran without a single error and PostgreSQL saw 20 connections. Without it, Prisma's named prepared statements landed on a different server connection and tens of thousands of queries failed with <em>prepared statement "s0" does not exist</em>. Migrations go through <code>directUrl</code>, and session features — <code>SET</code>, session advisory locks (Lesson 7.3), LISTEN/NOTIFY — are lost.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-pool" target="_blank" rel="noopener"><span class="lc-ico">🏊</span><span class="lc-body"><span class="lc-title">Prisma — connection pool</span><span class="lc-sub">prisma.io/docs · The default formula, every URL parameter, and the sizing guidance</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/pgbouncer" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">Prisma with PgBouncer</span><span class="lc-sub">prisma.io/docs · The <code>pgbouncer=true</code> flag, <code>directUrl</code>, and what stops working</span></span></a>
<a class="link-card" href="https://wiki.postgresql.org/wiki/Number_Of_Database_Connections" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL wiki — how many connections</span><span class="lc-sub">wiki.postgresql.org · The community answer to "why is a bigger pool slower", with the formula</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">CPU limits versus what a container reports — the reason the default pool size is wrong in containers</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Size a pool from a real deployment description, then reproduce the too-many-clients failure</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Connection pool, tính bằng số học</h2>
<p class="lead">Mặc định pool của Prisma là <code>num_cpus * 2 + 1</code> — một con số hợp lý cho một tiến trình, và là thảm hoạ khi nhân với tám container trên một máy chủ mười sáu nhân. Đặt kích thước pool là phép số học, không phải cảm tính — bài này làm phép tính đó, rồi chỉ cách đo xem mình tính đúng chưa.</p>

<h3>Mặc định, và phép nhân</h3>
<pre><code class="language-javascript">const prisma = new PrismaClient();                    <span class="tok-comment">// không đặt connection_limit</span>
const viec = Promise.all(Array.from({ length: 60 }, () =&gt; prisma.$queryRaw&#96;SELECT 1 AS x FROM pg_sleep(0.5)&#96;));
await ngu(250);
console.log((await prisma.$metrics.json()).gauges);   <span class="tok-comment">// previewFeatures = ["metrics"]</span></code></pre>
<div class="out">60 truy van pg_sleep(0.5) cung luc, client khong dat connection_limit:
  prisma_client_queries_wait           39
  prisma_pool_connections_busy         21
  prisma_pool_connections_idle         0
  prisma_pool_connections_open         21
┌─────────┬──────────┬────┬────────────┐
│ (index) │ state    │ so │ lau_nhat   │
├─────────┼──────────┼────┼────────────┤
│ 0       │ 'active' │ 21 │ '00:00:00' │
└─────────┴──────────┴────┴────────────┘</div>
<div class="kv-grid">
  <div class="kv"><span class="k">21 = 10 × 2 + 1</span><span class="v">Trên máy 10 nhân (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker (4 CPU, 2 GB), Prisma 6.19.3) pool mặc định mở 21 kết nối và 39 truy vấn phải chờ. Đó là cho MỖI tiến trình: bốn tiến trình như thế giữ 84.</span></div>
  <div class="kv"><span class="k">PrismaPromise là lười</span><span class="v">Một truy vấn tạo ra mà không await (hay .then) thì không bao giờ chạy. map ra một mảng truy vấn chưa khởi động gì cho tới khi Promise.all chạm vào.</span></div>
  <div class="kv"><span class="k">$metrics</span><span class="v">Nằm sau bản thử nghiệm <code>metrics</code>, mà Prisma 6.19.3 báo đã khai tử lúc generate. pg_stat_activity (bên dưới) không cần cờ nào.</span></div>
</div>
<pre><code class="language-bash">docker run --rm --cpus=2 node:22-alpine node -e "…os.cpus().length, os.availableParallelism()"</code></pre>
<div class="out">os.cpus().length = 10 · availableParallelism() = 2
10</div>
<div class="pitfall">
<p><strong>Bẫy — <code>--cpus=2</code> không đổi con số <code>os.cpus()</code> báo về.</strong> Hạn mức CPU do bộ lập lịch thi hành; container vẫn liệt kê mọi nhân của máy chủ (ở đây 10). <code>os.availableParallelism()</code> có đọc hạn mức (2). Đừng để con số nào quyết định pool: hãy ghi <code>connection_limit</code> vào DATABASE_URL.</p>
</div>

<h3>Phép số học</h3>
<div class="out">max_connections 
-----------------
 100
(1 row)
 superuser_reserved_connections 
--------------------------------
 3
(1 row)</div>
<pre><code class="language-javascript">// available = max_connections − reserved − others (psql, cron, migrations)
//           =      100        −    3     −  10   = 87
// connection_limit = 87 / 6 container ≈ 14 → 12</code></pre>
<pre><code class="language-bash">DATABASE_URL="postgresql://u:p@host:5432/db?connection_limit=12&amp;pool_timeout=20&amp;connect_timeout=10"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>connection_limit</code></span><span class="v">Cỡ pool — con số quan trọng, và là cái không ai đặt.</span></div>
  <div class="kv"><span class="k"><code>pool_timeout</code></span><span class="v">Một truy vấn chờ kết nối rảnh bao lâu trước khi P2024 (mặc định 10 s).</span></div>
  <div class="kv"><span class="k"><code>connect_timeout</code></span><span class="v">Mở một kết nối mới được phép mất bao lâu (mặc định 5 s).</span></div>
  <div class="kv"><span class="k">Đếm cả worker</span><span class="v">Mỗi tiến trình có một PrismaClient là thêm một pool. Worker nền thường chỉ cần 3 hoặc 4.</span></div>
</div>

<h3>Đo nó</h3>
<pre><code class="language-javascript">// một "lời gọi HTTP" 3 s trong giao dịch tương tác, cùng lúc sáu truy vấn thật
const tx = prisma.$transaction(async (t) =&gt; { await t.post.findFirst(); await ngu(3000); }, { timeout: 10000 });</code></pre>
<pre><code class="language-sql">SELECT state, count(*) AS so, max(now() - state_change)::interval(0) AS lau_nhat
FROM pg_stat_activity WHERE datname = current_database() GROUP BY state;</code></pre>
<div class="out">┌─────────┬───────────────────────┬────┬────────────┐
│ (index) │ state                 │ so │ lau_nhat   │
├─────────┼───────────────────────┼────┼────────────┤
│ 0       │ 'active'              │ 6  │ '00:00:01' │
│ 1       │ 'idle in transaction' │ 1  │ '00:00:01' │
└─────────┴───────────────────────┴────┴────────────┘</div>
<div class="callout ok">
<p><strong><code>idle in transaction</code> luôn đáng điều tra.</strong> Một kết nối bị giữ bởi giao dịch đang không làm gì — đúng lỗi của Bài 7.1, nhìn từ phía cơ sở dữ liệu. Đặt <code>idle_in_transaction_session_timeout</code> làm chốt chặn.</p>
</div>

<h3>Vì sao pool to hơn thường KHÔNG nhanh hơn</h3>
<pre><code class="language-javascript">// 200 luồng chạy 8 s, ba vòng; mỗi vòng lặp một truy vấn gộp ~240 hàng
new PrismaClient({ datasourceUrl: &#96;\${URL}?connection_limit=\${n}&amp;pool_timeout=30&#96; });</code></pre>
<div class="out">connection_limit=10   → p50  535 ms · p99   713 ms · thong luong   387 truy van/s · loi 0
connection_limit=50   → p50  631 ms · p99  1114 ms · thong luong   323 truy van/s · loi 0
connection_limit=200  → p50  997 ms · p99  2114 ms · thong luong    89 truy van/s · loi 6627 — P2037 Too many database connections opened
connection_limit=10   → p50  494 ms · p99   632 ms · thong luong   416 truy van/s · loi 0
connection_limit=50   → p50  467 ms · p99  1000 ms · thong luong   425 truy van/s · loi 0
connection_limit=200  → p50 1134 ms · p99  2097 ms · thong luong    82 truy van/s · loi 7001 — P2037 Too many database connections opened
connection_limit=10   → p50  510 ms · p99   856 ms · thong luong   375 truy van/s · loi 0
connection_limit=50   → p50  443 ms · p99   618 ms · thong luong   466 truy van/s · loi 0
connection_limit=200  → p50  895 ms · p99  1625 ms · thong luong   107 truy van/s · loi 8341 — P2037 Too many database connections opened</div>
<div class="kv-grid">
  <div class="kv"><span class="k">10 và 50: gần như nhau</span><span class="v">Trên cơ sở dữ liệu 4 CPU (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker (4 CPU, 2 GB), Prisma 6.19.3) gấp năm lần kết nối không mua thêm thông lượng; 50 có độ trễ đuôi tệ hơn ở hai trong ba vòng.</span></div>
  <div class="kv"><span class="k">200: P2037</span><span class="v">Vượt mức max_connections cho phép: hàng nghìn truy vấn hỏng, và thông lượng tụt.</span></div>
  <div class="kv"><span class="k">Rồi đo</span><span class="v">Chỉ nâng pool khi truy vấn phải chờ kết nối và cơ sở dữ liệu vẫn còn CPU.</span></div>
</div>

<h3>Khi số tiến trình vượt quá số kết nối: PgBouncer</h3>
<pre><code class="language-javascript">datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        <span class="tok-comment">// PgBouncer</span>
  directUrl = env("DIRECT_URL")          <span class="tok-comment">// PostgreSQL, cho migrate</span>
}</code></pre>
<pre><code class="language-bash">DATABASE_URL="postgresql://u:p@pgbouncer:6432/db?pgbouncer=true&amp;connection_limit=1"
DIRECT_URL="postgresql://u:p@postgres:5432/db"</code></pre>
<div class="out">qua PgBouncer + pgbouncer=true: 200 tho, 2295 truy van ok, 0 loi · PostgreSQL thay toi da 20 ket noi
qua PgBouncer (KHONG co pgbouncer=true): 200 tho, 1285 truy van ok, 23786 loi · PostgreSQL thay toi da 20 ket noi
  loi dau tien:  … message: "prepared statement \\"s0\\" does not</div>
<div class="pitfall">
<p><strong>Bẫy — PgBouncer chế độ transaction mà thiếu <code>pgbouncer=true</code>.</strong> Đo qua PgBouncer 1.23.1, pool 20: có cờ, 200 kết nối phía client chạy không một lỗi và PostgreSQL chỉ thấy 20 kết nối. Thiếu cờ, các prepared statement có tên của Prisma rơi vào một kết nối máy chủ khác và hàng chục nghìn truy vấn hỏng với <em>prepared statement "s0" does not exist</em>. Migration đi qua <code>directUrl</code>, và các tính năng phiên — <code>SET</code>, khoá advisory phiên (Bài 7.3), LISTEN/NOTIFY — không còn.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-pool" target="_blank" rel="noopener"><span class="lc-ico">🏊</span><span class="lc-body"><span class="lc-title">Prisma — connection pool</span><span class="lc-sub">prisma.io/docs · Công thức mặc định, mọi tham số URL, và hướng dẫn đặt kích thước</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/pgbouncer" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">Prisma với PgBouncer</span><span class="lc-sub">prisma.io/docs · Cờ <code>pgbouncer=true</code>, <code>directUrl</code>, và cái gì ngừng chạy</span></span></a>
<a class="link-card" href="https://wiki.postgresql.org/wiki/Number_Of_Database_Connections" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Wiki PostgreSQL — bao nhiêu kết nối</span><span class="lc-sub">wiki.postgresql.org · Câu trả lời của cộng đồng cho "vì sao pool to hơn lại chậm hơn", kèm công thức</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Hạn mức CPU đối lại thứ container tự báo — lý do kích thước pool mặc định luôn sai trong container</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Tính kích thước pool từ một mô tả triển khai thật, rồi tái hiện lỗi too-many-clients</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — The query you should not send at all|||9.5 — Câu truy vấn lẽ ra đừng gửi',
      slug: 'pr-9-5-truy-van-khong-gui',
      type: 'LESSON',
      description: 'Chọn ít cột (và omit), phân trang keyset — cursor hai cột của Prisma không nhanh hơn OFFSET, đếm xấp xỉ bằng reltuples, gộp ghi bằng createMany (tự chia lô), và cache với luật xoá khoá ở mọi đường ghi.',
      content: `
${G09_5}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>The query you should not send at all</h2>
<p class="lead">The four previous lessons made queries faster. This one removes them. A query that never leaves the process costs nothing, and the five techniques here — narrower rows, cursor pagination, approximate counts, batched writes, and a cache with an honest invalidation rule — between them account for most of the difference between an application that survives its own traffic and one that does not.</p>

<h3>1. Select less, because rows travel</h3>
<pre><code class="language-javascript">await prisma.post.findMany({ where: { deletedAt: null }, orderBy: { id: 'desc' }, include: { author: true }, take: 20 });
await prisma.post.findMany({ where: { deletedAt: null }, orderBy: { id: 'desc' }, take: 20,
  select: { id: true, title: true, createdAt: true, author: { select: { id: true, username: true, avatarUrl: true } } } });

const db = new PrismaClient({ omit: { user: { passwordHash: true, email: true } } });   <span class="tok-comment">// global</span>
await db.user.findFirstOrThrow({ omit: { passwordHash: false } });                   <span class="tok-comment">// opt back in</span></code></pre>
<div class="out">include: { author: true } → 20 hang ·   32.8 KB JSON · 1.7 ms · co passwordHash? true
select: { ... }           → 20 hang ·    3.2 KB JSON · 1.8 ms · co passwordHash? false
omit toan cuc { user: { passwordHash, email } } → cac khoa cua user: id, username, fullName, avatarUrl, bio, metadata, createdAt
mo lai tung truy van omit: { passwordHash: false } → co passwordHash? true</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Ten times less JSON</span><span class="v">Same twenty rows (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker (4 CPUs, 2 GB), Prisma 6.19.3): the include carried every column of every author, including a 400-character metadata blob.</span></div>
  <div class="kv"><span class="k">Security, the real reason</span><span class="v"><code>include: { author: true }</code> pulled <code>passwordHash</code> into the process — one <code>res.json(posts)</code> away from the browser. A select cannot leak a column it never asked for.</span></div>
  <div class="kv"><span class="k">omit</span><span class="v">Generally available in Prisma 6: a global omit hides a field from every query, and a single query can opt back in.</span></div>
</div>

<h3>2. Offset pagination — and a Prisma cursor that is no faster</h3>
<pre><code class="language-javascript">await prisma.post.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: n, take: 20, select: { id: true } });
await prisma.post.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], cursor: { id: lastId }, skip: 1, take: 20, select: { id: true } });</code></pre>
<div class="out">-- 1.2M posts, index (created_at DESC, id DESC), median of 3
skip       0 →      0.9 ms
skip     200 →      0.8 ms
skip   10000 →      1.2 ms
skip  200000 →      9.8 ms
skip 1000000 →     43.8 ms
cursor o hang       0 →      0.7 ms
cursor o hang   10000 →      1.3 ms
cursor o hang  200000 →      9.6 ms
cursor o hang 1000000 →     47.6 ms</div>
<div class="pitfall">
<p><strong>Trap — a Prisma cursor over a two-column order reads from the start, like OFFSET.</strong> Prisma expresses "after this row" as an OR, which the index cannot seek on:</p>
<div class="out">SQL cua cursor: SELECT "id" FROM "posts" WHERE (("created_at" = (SELECT "created_at" FROM "posts" WHERE ("id") = ($1)) AND "id" &lt;= (SELECT "id" FROM "posts" WHERE ("id") = ($2))) OR ("created_at" &lt; (SELECT "created_at" FROM "posts" WHERE ("id") = ($3)))) ORDER BY "created_at" DESC, "id" DESC LIMIT $4 OFFSET $5

-- EXPLAIN at row 200,000: Prisma cursor, then a row comparison
-&gt;  Index Only Scan using posts_tao_id on posts  (actual time=53.711..53.714 rows=21 loops=1)
Filter: (((created_at = $0) AND (id &lt;= $1)) OR (created_at &lt; $2))
Rows Removed by Filter: 1000000
Execution Time: 53.774 ms
-&gt;  Index Only Scan using posts_tao_id on posts  (actual time=0.051..0.053 rows=20 loops=1)
Index Cond: (ROW(created_at, id) &lt; ROW($0, 200000))
Execution Time: 0.093 ms</div>
<p>The index is read from the top and a million rows are filtered out. A row comparison in raw SQL — <code>WHERE (created_at, id) &lt; ($1, $2)</code> — or a cursor ordered by the unique id alone seeks straight to the position:</p>
<div class="out">o hang       0: keyset tho (created_at, id) &lt; (...) →   0.8 ms · cursor Prisma, orderBy chi id →   0.8 ms
o hang 1000000: keyset tho (created_at, id) &lt; (...) →   0.6 ms · cursor Prisma, orderBy chi id →   0.7 ms</div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Always tie-break with a unique column</span><span class="v">Two posts can share a timestamp; without <code>id</code> in the order a page can repeat or skip rows.</span></div>
  <div class="kv"><span class="k">Then measure the deep pages</span><span class="v">The first page is fast with any method. Test the cursor at row 1,000,000 before calling it constant.</span></div>
  <div class="kv"><span class="k">The cost: no page numbers</span><span class="v">Keyset gives next and previous, not "jump to page 500" — exactly right for feeds, chats and logs.</span></div>
</div>

<h3>3. <code>count()</code> is a sequential scan</h3>
<pre><code class="language-sql">SELECT reltuples::bigint AS uoc_luong FROM pg_class WHERE oid = 'posts'::regclass;</code></pre>
<div class="out">post.count()            → 1200000 · 59.1 ms
reltuples (uoc luong)   → 1199848 · 0.5 ms · lech 0.01 %
take: 21 (con trang sau?) → co · 1.0 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Exact count, whole table</span><span class="v">Always a full scan, linear in rows. A person reading "1.2 million" cannot tell it from the estimate.</span></div>
  <div class="kv"><span class="k">reltuples</span><span class="v">Kept by ANALYZE and autovacuum — within a hundredth of a percent here; it lags after a bulk load.</span></div>
  <div class="kv"><span class="k">"Has more pages" without counting</span><span class="v">Ask for take: 21, show 20. If 21 came back, there is a next page.</span></div>
</div>

<h3>4. Batch the writes</h3>
<pre><code class="language-javascript">for (const d of data) await prisma.notification.create({ data: d });
await prisma.$transaction(data.map((d) =&gt; prisma.notification.upsert({
  where: { uk_thong_bao: { userId: d.userId, key: d.key } }, create: d, update: { seenAt: null } })));
await prisma.notification.createMany({ data, skipDuplicates: true });</code></pre>
<div class="out">500 x await create      →   417 ms (500 truy van)
$transaction([...500])  →   245 ms (502 truy van, gom BEGIN/COMMIT)
createMany(500)         →    13 ms (3 truy van)
createMany(20.000 hang x 3 cot = 60.000 tham so) → 20000 hang · 3 cau INSERT · 359 ms
createMany(30.000 hang x 3 cot = 90.000 tham so) → 30000 hang · 4 cau INSERT</div>
<div class="kv-grid">
  <div class="kv"><span class="k">createMany</span><span class="v">One multi-row INSERT — about thirty times faster than the loop here.</span></div>
  <div class="kv"><span class="k">$transaction([...]) is not one round trip</span><span class="v">It ran 502 statements — BEGIN, 500 upserts, COMMIT — on one connection. It saves the 500 separate commits, not the per-statement round trips.</span></div>
  <div class="kv"><span class="k">The bind-parameter cap</span><span class="v">PostgreSQL allows 65,535 parameters per statement. Prisma split 60,000 into 3 INSERTs and 90,000 into 4 on its own — no manual chunking needed for createMany.</span></div>
  <div class="kv"><span class="k">Not inside an interactive transaction</span><span class="v">A callback transaction holding 500 writes keeps one connection and its locks for the whole loop (Lesson 7.4).</span></div>
</div>

<h3>5. The cache, and the only honest invalidation rule</h3>
<pre><code class="language-javascript">async function getProfile(userId: number) {
  const key = &#96;ho-so:\${userId}&#96;;
  const daCo = await redis.get(key);
  if (daCo) return JSON.parse(daCo);
  const hoSo = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, avatarUrl: true, bio: true } });
  if (hoSo) await redis.set(key, JSON.stringify(hoSo), 'EX', 300);
  return hoSo;
}
<span class="tok-comment">// every write path: update, then delete the key</span>
await prisma.user.update({ where: { id }, data });
await redis.del(&#96;ho-so:\${id}&#96;);</code></pre>
<div class="out">lan dau (miss): 19.58 ms · 1 truy van  ·  20 lan sau (hit): trung vi 0.57 ms · 0 truy van
ghi bio MOI nhung quen redis.del → doc lai: bio bio bio  …(cu)
sau redis.del → doc lai: bio MOI</div>
<div class="pitfall">
<p><strong>Trap — one write path that forgets the delete.</strong> A hit needed no query and no connection. Then one update that did not delete the key served the old bio until the TTL expired — invisible until a user notices. Delete, do not overwrite, on every write path; the TTL is only a backstop.</p>
</div>

<h3>The decision, in order</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Can I not ask?</span><span class="lz-d">Is this value already on the page? Already loaded by the parent request? Derivable from something you have? The cheapest query is the one you deleted.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Can I ask for less?</span><span class="lz-d"><code>select</code> instead of <code>include</code>, <code>take: 21</code> instead of <code>count()</code>, an approximate total instead of an exact one.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Can I ask once instead of N times?</span><span class="lz-d">Lesson 9.2 for reads, <code>createMany</code> and <code>$transaction([...])</code> for writes.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Can the database answer it faster?</span><span class="lz-d">Lesson 9.3 — the right index, in the right column order.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Only then, cache</span><span class="lz-d">A cache in front of a bad query hides the problem and adds an invalidation bug. Fix steps 1–4 first; cache what is still hot afterwards.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/select-fields" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Prisma — select, include and omit</span><span class="lc-sub">prisma.io/docs · Choosing fields, and the global <code>omit</code> for secrets</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/pagination" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — pagination</span><span class="lc-sub">prisma.io/docs · Offset versus cursor, with the trade-offs stated plainly</span></span></a>
<a class="link-card" href="https://use-the-index-luke.com/no-offset" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">Use The Index, Luke — "No Offset"</span><span class="lc-sub">use-the-index-luke.com · Why offset pagination is both slow and incorrect, with keyset as the fix</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">Prisma — batch operations</span><span class="lc-sub">prisma.io/docs · <code>createMany</code>, <code>createManyAndReturn</code>, and the array form of <code>$transaction</code></span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">The cache layer in full: TTL, eviction, stampede, and invalidation that holds up</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Convert an offset endpoint to a cursor, then measure page 10,000 before and after</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Câu truy vấn lẽ ra đừng gửi</h2>
<p class="lead">Bốn bài trước làm truy vấn nhanh hơn. Bài này XOÁ chúng đi. Một truy vấn không bao giờ rời khỏi tiến trình thì tốn không đồng nào, và năm kỹ thuật ở đây — hàng hẹp hơn, phân trang bằng con trỏ, đếm xấp xỉ, gộp ghi, và một cache có luật vô hiệu hoá trung thực — cộng lại chiếm phần lớn khoảng cách giữa một ứng dụng sống sót nổi lưu lượng của chính nó và một ứng dụng thì không.</p>

<h3>1. Chọn ít đi, vì hàng phải đi đường dây</h3>
<pre><code class="language-javascript">await prisma.post.findMany({ where: { deletedAt: null }, orderBy: { id: 'desc' }, include: { author: true }, take: 20 });
await prisma.post.findMany({ where: { deletedAt: null }, orderBy: { id: 'desc' }, take: 20,
  select: { id: true, title: true, createdAt: true, author: { select: { id: true, username: true, avatarUrl: true } } } });

const db = new PrismaClient({ omit: { user: { passwordHash: true, email: true } } });   <span class="tok-comment">// toàn cục</span>
await db.user.findFirstOrThrow({ omit: { passwordHash: false } });                   <span class="tok-comment">// mở lại</span></code></pre>
<div class="out">include: { author: true } → 20 hang ·   32.8 KB JSON · 1.7 ms · co passwordHash? true
select: { ... }           → 20 hang ·    3.2 KB JSON · 1.8 ms · co passwordHash? false
omit toan cuc { user: { passwordHash, email } } → cac khoa cua user: id, username, fullName, avatarUrl, bio, metadata, createdAt
mo lai tung truy van omit: { passwordHash: false } → co passwordHash? true</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Ít hơn mười lần JSON</span><span class="v">Cùng hai mươi hàng (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker (4 CPU, 2 GB), Prisma 6.19.3): include mang theo mọi cột của mọi tác giả, kể cả một khối metadata 400 ký tự.</span></div>
  <div class="kv"><span class="k">Bảo mật, lý do thật</span><span class="v"><code>include: { author: true }</code> kéo <code>passwordHash</code> vào tiến trình — chỉ cách trình duyệt một lần <code>res.json(posts)</code>. select không thể làm lộ cột nó chưa từng xin.</span></div>
  <div class="kv"><span class="k">omit</span><span class="v">Đã chính thức ở Prisma 6: omit toàn cục giấu một trường khỏi mọi truy vấn, và từng truy vấn vẫn mở lại được.</span></div>
</div>

<h3>2. Phân trang bằng offset — và một cursor của Prisma chẳng nhanh hơn</h3>
<pre><code class="language-javascript">await prisma.post.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: n, take: 20, select: { id: true } });
await prisma.post.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], cursor: { id: lastId }, skip: 1, take: 20, select: { id: true } });</code></pre>
<div class="out">-- 1,2 triệu bài, chỉ mục (created_at DESC, id DESC), trung vị 3 lần
skip       0 →      0.9 ms
skip     200 →      0.8 ms
skip   10000 →      1.2 ms
skip  200000 →      9.8 ms
skip 1000000 →     43.8 ms
cursor o hang       0 →      0.7 ms
cursor o hang   10000 →      1.3 ms
cursor o hang  200000 →      9.6 ms
cursor o hang 1000000 →     47.6 ms</div>
<div class="pitfall">
<p><strong>Bẫy — cursor của Prisma trên thứ tự hai cột đọc từ đầu, y như OFFSET.</strong> Prisma viết "sau hàng này" thành một phép OR, mà chỉ mục không nhảy tới được:</p>
<div class="out">SQL cua cursor: SELECT "id" FROM "posts" WHERE (("created_at" = (SELECT "created_at" FROM "posts" WHERE ("id") = ($1)) AND "id" &lt;= (SELECT "id" FROM "posts" WHERE ("id") = ($2))) OR ("created_at" &lt; (SELECT "created_at" FROM "posts" WHERE ("id") = ($3)))) ORDER BY "created_at" DESC, "id" DESC LIMIT $4 OFFSET $5

-- EXPLAIN ở hàng 200.000: cursor của Prisma, rồi phép so sánh theo hàng
-&gt;  Index Only Scan using posts_tao_id on posts  (actual time=53.711..53.714 rows=21 loops=1)
Filter: (((created_at = $0) AND (id &lt;= $1)) OR (created_at &lt; $2))
Rows Removed by Filter: 1000000
Execution Time: 53.774 ms
-&gt;  Index Only Scan using posts_tao_id on posts  (actual time=0.051..0.053 rows=20 loops=1)
Index Cond: (ROW(created_at, id) &lt; ROW($0, 200000))
Execution Time: 0.093 ms</div>
<p>Chỉ mục bị đọc từ đầu và một triệu hàng bị lọc bỏ. Phép so sánh theo hàng trong SQL thô — <code>WHERE (created_at, id) &lt; ($1, $2)</code> — hoặc cursor chỉ sắp theo id duy nhất thì nhảy thẳng tới vị trí:</p>
<div class="out">o hang       0: keyset tho (created_at, id) &lt; (...) →   0.8 ms · cursor Prisma, orderBy chi id →   0.8 ms
o hang 1000000: keyset tho (created_at, id) &lt; (...) →   0.6 ms · cursor Prisma, orderBy chi id →   0.7 ms</div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Luôn phá hoà bằng một cột duy nhất</span><span class="v">Hai bài có thể trùng thời điểm; thiếu <code>id</code> trong thứ tự thì một trang có thể lặp hoặc bỏ sót hàng.</span></div>
  <div class="kv"><span class="k">Rồi đo các trang sâu</span><span class="v">Trang đầu thì cách nào cũng nhanh. Hãy thử cursor ở hàng 1.000.000 trước khi gọi nó là hằng số.</span></div>
  <div class="kv"><span class="k">Cái giá: không có số trang</span><span class="v">Keyset cho trang sau và trang trước, không cho "nhảy tới trang 500" — đúng ý cho feed, chat và nhật ký.</span></div>
</div>

<h3>3. <code>count()</code> là một cú quét tuần tự</h3>
<pre><code class="language-sql">SELECT reltuples::bigint AS uoc_luong FROM pg_class WHERE oid = 'posts'::regclass;</code></pre>
<div class="out">post.count()            → 1200000 · 59.1 ms
reltuples (uoc luong)   → 1199848 · 0.5 ms · lech 0.01 %
take: 21 (con trang sau?) → co · 1.0 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đếm chính xác, cả bảng</span><span class="v">Luôn là quét cả bảng, tăng tuyến tính theo số hàng. Người đọc "1,2 triệu" không phân biệt được với số ước lượng.</span></div>
  <div class="kv"><span class="k">reltuples</span><span class="v">Được ANALYZE và autovacuum cập nhật — ở đây lệch chưa tới một phần trăm của một phần trăm; nó trễ sau khi nạp hàng loạt.</span></div>
  <div class="kv"><span class="k">"Còn trang sau" mà không đếm</span><span class="v">Xin take: 21, hiện 20. Về đủ 21 thì còn trang sau.</span></div>
</div>

<h3>4. Gộp các lệnh ghi</h3>
<pre><code class="language-javascript">for (const d of data) await prisma.notification.create({ data: d });
await prisma.$transaction(data.map((d) =&gt; prisma.notification.upsert({
  where: { uk_thong_bao: { userId: d.userId, key: d.key } }, create: d, update: { seenAt: null } })));
await prisma.notification.createMany({ data, skipDuplicates: true });</code></pre>
<div class="out">500 x await create      →   417 ms (500 truy van)
$transaction([...500])  →   245 ms (502 truy van, gom BEGIN/COMMIT)
createMany(500)         →    13 ms (3 truy van)
createMany(20.000 hang x 3 cot = 60.000 tham so) → 20000 hang · 3 cau INSERT · 359 ms
createMany(30.000 hang x 3 cot = 90.000 tham so) → 30000 hang · 4 cau INSERT</div>
<div class="kv-grid">
  <div class="kv"><span class="k">createMany</span><span class="v">Một câu INSERT nhiều hàng — nhanh hơn vòng lặp khoảng ba mươi lần ở đây.</span></div>
  <div class="kv"><span class="k">$transaction([...]) không phải một lượt đi về</span><span class="v">Nó chạy 502 câu lệnh — BEGIN, 500 upsert, COMMIT — trên một kết nối. Nó tiết kiệm 500 lần commit riêng, không tiết kiệm lượt đi về của từng câu.</span></div>
  <div class="kv"><span class="k">Trần số tham số</span><span class="v">PostgreSQL cho 65.535 tham số mỗi câu lệnh. Prisma tự chia 60.000 thành 3 câu INSERT và 90.000 thành 4 — createMany không cần tự chia lô.</span></div>
  <div class="kv"><span class="k">Đừng bọc trong giao dịch tương tác</span><span class="v">Một giao dịch callback giữ 500 lệnh ghi thì giữ một kết nối và khoá của nó suốt vòng lặp (Bài 7.4).</span></div>
</div>

<h3>5. Cache, và luật vô hiệu hoá trung thực DUY NHẤT</h3>
<pre><code class="language-javascript">async function getProfile(userId: number) {
  const key = &#96;ho-so:\${userId}&#96;;
  const daCo = await redis.get(key);
  if (daCo) return JSON.parse(daCo);
  const hoSo = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, avatarUrl: true, bio: true } });
  if (hoSo) await redis.set(key, JSON.stringify(hoSo), 'EX', 300);
  return hoSo;
}
<span class="tok-comment">// mọi đường ghi: cập nhật, rồi xoá khoá</span>
await prisma.user.update({ where: { id }, data });
await redis.del(&#96;ho-so:\${id}&#96;);</code></pre>
<div class="out">lan dau (miss): 19.58 ms · 1 truy van  ·  20 lan sau (hit): trung vi 0.57 ms · 0 truy van
ghi bio MOI nhung quen redis.del → doc lai: bio bio bio  …(cu)
sau redis.del → doc lai: bio MOI</div>
<div class="pitfall">
<p><strong>Bẫy — một đường ghi quên xoá khoá.</strong> Lần trúng đệm không cần truy vấn nào, không chiếm kết nối nào. Rồi một lần cập nhật không xoá khoá đã trả tiểu sử cũ cho tới khi hết hạn — vô hình cho tới khi người dùng nhận ra. Xoá, đừng ghi đè, ở mọi đường ghi; TTL chỉ là chốt chặn cuối.</p>
</div>

<h3>Quyết định, theo thứ tự</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Có thể KHÔNG hỏi không?</span><span class="lz-d">Giá trị này đã có sẵn trên trang chưa? Request cha đã nạp chưa? Suy ra được từ thứ bạn đang cầm không? Truy vấn rẻ nhất là truy vấn bạn đã xoá.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Có thể hỏi ÍT hơn không?</span><span class="lz-d"><code>select</code> thay <code>include</code>, <code>take: 21</code> thay <code>count()</code>, một con số xấp xỉ thay một con số chính xác.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Có thể hỏi MỘT lần thay vì N lần không?</span><span class="lz-d">Bài 9.2 cho đọc, <code>createMany</code> và <code>$transaction([...])</code> cho ghi.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cơ sở dữ liệu trả lời nhanh hơn được không?</span><span class="lz-d">Bài 9.3 — đúng chỉ mục, đúng thứ tự cột.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Chỉ ĐẾN LÚC ĐÓ mới cache</span><span class="lz-d">Một cache đặt trước một truy vấn tồi thì giấu vấn đề đi và tặng thêm một con bug vô hiệu hoá. Sửa bước 1–4 trước; cache thứ nào vẫn còn nóng sau đó.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/select-fields" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Prisma — select, include và omit</span><span class="lc-sub">prisma.io/docs · Chọn trường, và <code>omit</code> toàn cục cho bí mật</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/pagination" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — phân trang</span><span class="lc-sub">prisma.io/docs · Offset đối lại con trỏ, nói thẳng cái được cái mất</span></span></a>
<a class="link-card" href="https://use-the-index-luke.com/no-offset" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">Use The Index, Luke — "No Offset"</span><span class="lc-sub">use-the-index-luke.com · Vì sao phân trang offset vừa chậm vừa SAI, và keyset là cách vá</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">Prisma — thao tác theo lô</span><span class="lc-sub">prisma.io/docs · <code>createMany</code>, <code>createManyAndReturn</code>, và dạng mảng của <code>$transaction</code></span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">Tầng cache đầy đủ: TTL, đẩy khoá, stampede, và vô hiệu hoá đứng vững</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Đổi một endpoint offset sang con trỏ, rồi đo trang 10.000 trước và sau</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 9.6 ─────────────────────────── */
    {
      title: '9.6 — Quiz: performance|||9.6 — Quiz: hiệu năng',
      slug: 'pr-9-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về đo trước khi vá, N+1, chỉ mục, connection pool, phân trang và cache — mỗi câu bám vào một phép đo có thật trong chương này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.6</span>
<h2>Quiz: performance</h2>
<p class="lead">Eight questions over the whole chapter. Each one has a number behind it that was measured, not guessed — if an answer feels like a matter of taste, go back and find the measurement.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Measure before you fix (9.1). N+1 has four shapes and only one of them looks like a loop (9.2). An index is chosen by the query, and column order decides whether it is used (9.3). Pool size is arithmetic, and bigger is often slower (9.4). The cheapest query is the one you deleted (9.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.6</span>
<h2>Quiz: hiệu năng</h2>
<p class="lead">Tám câu trải khắp chương. Mỗi câu có một CON SỐ ĐO THẬT đứng sau, không phải phỏng đoán — nếu một đáp án nghe như chuyện khẩu vị, hãy quay lại tìm phép đo.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Đo trước khi vá (9.1). N+1 có bốn hình dạng và chỉ một trong số đó trông giống vòng lặp (9.2). Chỉ mục do CÂU TRUY VẤN chọn, và thứ tự cột quyết định nó có được dùng hay không (9.3). Kích thước pool là phép số học, và to hơn thường chậm hơn (9.4). Truy vấn rẻ nhất là truy vấn bạn đã xoá (9.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Your log shows one query taking 890 ms and another taking 4 ms. Which one do you optimise first?|||Nhật ký cho thấy một truy vấn mất 890 ms và một truy vấn mất 4 ms. Bạn tối ưu cái nào trước?',
            options: [
              'The 890 ms one — it is obviously the slowest|||Cái 890 ms — rõ ràng nó chậm nhất',
              'Whichever has the larger count x duration total; the 4 ms query called 3,000 times per request costs 12 s, the 890 ms query called once costs 890 ms|||Cái nào có tổng số lần x thời lượng lớn hơn; truy vấn 4 ms gọi 3.000 lần mỗi request tốn 12 giây, còn truy vấn 890 ms gọi một lần tốn 890 ms',
              'Neither — always start with indexes|||Không cái nào — luôn bắt đầu từ chỉ mục',
              'The 4 ms one, because small queries are easier to fix|||Cái 4 ms, vì truy vấn nhỏ dễ sửa hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which of these is NOT a form of N+1?|||Cái nào sau đây KHÔNG phải một dạng của N+1?',
            options: [
              'A for-loop calling findUnique once per item|||Một vòng for gọi findUnique cho mỗi phần tử',
              'A helper function called inside .map() that queries internally|||Một hàm phụ gọi bên trong .map() và bên trong nó có truy vấn',
              'Promise.all over a helper that runs one count() per item|||Promise.all trên một hàm phụ chạy một count() cho mỗi phần tử',
              'A single findMany with select and take: 20|||Một findMany duy nhất có select và take: 20',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'A query filters on status and orders by createdAt. Which composite index does the planner actually use?|||Một truy vấn lọc theo status và sắp xếp theo createdAt. Bộ lập kế hoạch THẬT SỰ dùng chỉ mục ghép nào?',
            options: [
              '@@index([status, createdAt]) — equality column first, then the ordering column|||@@index([status, createdAt]) — cột so sánh bằng đứng trước, rồi tới cột sắp xếp',
              '@@index([createdAt, status]) — the ordering column must come first|||@@index([createdAt, status]) — cột sắp xếp phải đứng trước',
              'Either one; PostgreSQL reorders index columns automatically|||Cái nào cũng được; PostgreSQL tự sắp xếp lại cột chỉ mục',
              'Neither; a composite index cannot serve a filter and a sort together|||Không cái nào; một chỉ mục ghép không phục vụ được đồng thời lọc và sắp xếp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Six application containers share a PostgreSQL with max_connections = 100 and 3 reserved for superusers. Roughly what connection_limit should each container get?|||Sáu container ứng dụng dùng chung một PostgreSQL có max_connections = 100 và 3 kết nối để dành cho superuser. Mỗi container nên đặt connection_limit khoảng bao nhiêu?',
            options: [
              '33, the num_cpus * 2 + 1 default on a 16-core host|||33, tức mặc định num_cpus * 2 + 1 trên máy 16 nhân',
              'About 12: (100 - 3 - roughly 10 for psql, monitoring, migrations and cron) / 6, rounded down for headroom|||Khoảng 12: (100 - 3 - chừng 10 cho psql, giám sát, migration và cron) / 6, làm tròn xuống lấy khoảng thở',
              '100, so no container ever waits for a connection|||100, để không container nào phải đợi kết nối',
              'It does not matter as long as pool_timeout is high enough|||Không quan trọng, miễn pool_timeout đủ lớn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In the chapter’s benchmark on a 4-CPU database, connection_limit=50 did no better than 10, and 200 failed with P2037. Why?|||Trong phép đo của chương trên database 4 CPU, connection_limit=50 không hơn 10, còn 200 thì hỏng với P2037. Vì sao?',
            options: [
              'Prisma has a bug above 128 connections|||Prisma có lỗi khi vượt quá 128 kết nối',
              'The pool itself consumes CPU proportional to its size|||Bản thân cái pool tiêu tốn CPU tỉ lệ với kích thước của nó',
              'Beyond the database’s CPUs, more concurrent queries only add contention; past max_connections the extra connections are refused|||Vượt quá số CPU của database, thêm truy vấn song song chỉ thêm tranh chấp; vượt max_connections thì kết nối thừa bị từ chối',
              'The network cannot carry 200 simultaneous connections|||Mạng không tải nổi 200 kết nối cùng lúc',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A feed endpoint uses skip: (page - 1) * 20. What are the two problems with it?|||Một endpoint feed dùng skip: (page - 1) * 20. Nó có HAI vấn đề gì?',
            options: [
              'It is slow on high page numbers, and it is unstable: a row inserted mid-paging shifts everything so the user sees one row twice and misses another|||Nó chậm ở số trang lớn, và nó KHÔNG ổn định: một hàng chèn vào giữa lúc lật trang đẩy mọi thứ lệch đi nên người dùng thấy một hàng hai lần và bỏ sót một hàng khác',
              'It cannot be indexed, and it returns rows out of order|||Nó không đánh chỉ mục được, và nó trả hàng sai thứ tự',
              'It only works on PostgreSQL, and it needs a raw query|||Nó chỉ chạy trên PostgreSQL, và nó cần truy vấn thô',
              'It is fine; offset pagination has no problems at any scale|||Không sao cả; phân trang offset không có vấn đề gì ở mọi quy mô',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You need "about how many posts are there" for a page header on a 1.2M-row table. What do you do?|||Bạn cần "có khoảng bao nhiêu bài viết" cho phần đầu trang, trên một bảng 1,2 triệu hàng. Bạn làm gì?',
            options: [
              'prisma.socialPost.count() — accuracy matters more than 1.2 seconds|||prisma.socialPost.count() — độ chính xác quan trọng hơn 1,2 giây',
              'Read reltuples from pg_class: 0.1 ms instead of 1,200 ms, and 0.06% off — a human cannot tell the difference|||Đọc reltuples từ pg_class: 0,1 ms thay vì 1.200 ms, lệch 0,06% — con người không phân biệt nổi',
              'Cache the exact count forever, since it only grows|||Cache con số chính xác vĩnh viễn, vì nó chỉ tăng',
              'Count in JavaScript after findMany() with no take|||Đếm trong JavaScript sau findMany() không có take',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'On a cache write path, why delete the key rather than write the new value into it?|||Ở đường ghi có cache, vì sao phải XOÁ khoá thay vì ghi giá trị mới vào nó?',
            options: [
              'Deleting is faster than setting in Redis|||Xoá nhanh hơn ghi trong Redis',
              'Two concurrent updates can write to the cache in the opposite order from the database writes, leaving the losing value cached; deleting forces the next reader to reload from the source of truth|||Hai lần cập nhật song song có thể ghi vào cache theo thứ tự NGƯỢC với hai lần ghi cơ sở dữ liệu, để lại đúng cái giá trị đã thua; xoá thì buộc người đọc kế tiếp nạp lại từ nguồn sự thật',
              'Redis cannot overwrite an existing key without deleting it first|||Redis không ghi đè được một khoá đã có nếu chưa xoá nó',
              'It does not matter; both approaches are equivalent|||Không quan trọng; hai cách là như nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
