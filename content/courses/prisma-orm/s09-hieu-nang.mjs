/**
 * Prisma ORM — Chương 9: Hiệu năng.
 * Đo trước · N+1 và chiến lược nạp quan hệ · chỉ mục Prisma thật sự dùng · connection pool · cache · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
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
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Measure before you change anything</h2>
<p class="lead">Almost every Prisma performance problem is one of three things: a query that runs too often, a query that reads too much, or a pool that is too small. All three are visible in the query log, and none of them are visible from reading the code. This lesson is the loop — capture, rank, explain, fix, re-measure — and every later lesson in the chapter assumes you are running it.</p>

<h3>Step 1 — capture, with durations</h3>
<pre><code>const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
});

const nhatKy: { sql: string; params: string; ms: number }[] = [];

prisma.$on('query', (e) =&gt; {
  nhatKy.push({ sql: e.query, params: e.params, ms: e.duration });
});

<span class="tok-comment">// Wrap a single request and report what it cost</span>
export function batDau() {
  const tu = nhatKy.length;
  return () =&gt; {
    const cua = nhatKy.slice(tu);
    const tong = cua.reduce((s, q) =&gt; s + q.ms, 0);
    return { so: cua.length, tongMs: tong, cauTruyVan: cua };
  };
}</code></pre>
<pre><code>const xong = batDau();
await layTrangChu(userId);
console.log(xong());</code></pre>
<div class="out">{
  so: 47,
  tongMs: 812,
  cauTruyVan: [ … ]
}</div>
<div class="callout warn">
<p><strong>Forty-seven queries for one page.</strong> That number, not the 812 ms, is the finding. A page needing forty-seven round trips is an N+1 somewhere — and no index will fix it, because each individual query is probably fast. Count first, then look at durations. The two numbers point at completely different problems.</p>
</div>

<h3>Step 2 — rank by total time, not by slowest</h3>
<pre><code>function xepHang(cua: { sql: string; ms: number }[]) {
  const nhom = new Map&lt;string, { so: number; tong: number; max: number }&gt;();

  for (const q of cua) {
    <span class="tok-comment">// normalise: collapse the parameter placeholders so repeats group together</span>
    const khuon = q.sql.replace(/\\$\\d+/g, '?').replace(/\\s+/g, ' ');
    const n = nhom.get(khuon) ?? { so: 0, tong: 0, max: 0 };
    n.so++; n.tong += q.ms; n.max = Math.max(n.max, q.ms);
    nhom.set(khuon, n);
  }

  return [...nhom.entries()]
    .map(([sql, n]) =&gt; ({ sql: sql.slice(0, 90), ...n }))
    .sort((a, b) =&gt; b.tong - a.tong);
}

console.table(xepHang(xong().cauTruyVan));</code></pre>
<div class="out">┌─────────┬────────────────────────────────────────────────────┬─────┬───────┬──────┐
│ (index) │ sql                                                │ so  │ tong  │ max  │
├─────────┼────────────────────────────────────────────────────┼─────┼───────┼──────┤
│ 0       │ 'SELECT ... FROM "users" WHERE "users"."id" = ? …' │ 41  │ 402   │ 14   │
│ 1       │ 'SELECT ... FROM "posts" WHERE "published" = ? O…' │ 1   │ 311   │ 311  │
│ 2       │ 'SELECT ... FROM "comments" WHERE "post_id" IN …' │ 1   │  61   │ 61   │
│ 3       │ 'SELECT COUNT(*) FROM "posts" WHERE …'             │ 1   │  38   │ 38   │
└─────────┴────────────────────────────────────────────────────┴─────┴───────┴──────┘</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Row 0</span><span class="lz-t">41 calls, 402 ms total, 14 ms each</span><span class="lz-d">Every individual query is fast. The problem is that it runs forty-one times — a textbook N+1, and the fix is an <code>include</code>, not an index. Lesson 9.2.</span></div>
  <div class="lz-step"><span class="lz-k">Row 1</span><span class="lz-t">1 call, 311 ms</span><span class="lz-d">One query doing too much work. This one goes to <code>EXPLAIN ANALYZE</code> — it is a missing index, a bad plan, or too many rows. Lesson 9.3.</span></div>
  <div class="lz-step"><span class="lz-k">Ranking by total, not max</span><span class="lz-t">Is the whole point</span><span class="lz-d">Sorting by slowest single query would put row 1 first and hide row 0 entirely — yet row 0 costs more. A hundred 4 ms queries beat one 300 ms query for total damage, and only the total column shows it.</span></div>
  <div class="lz-step"><span class="lz-k">Normalising the SQL</span><span class="lz-t">Is what makes grouping work</span><span class="lz-d">Replacing <code>$1</code>, <code>$2</code> with <code>?</code> collapses forty-one distinct-looking statements into one row. Without it the table has forty-seven rows and no pattern is visible.</span></div>
</div>

<h3>Step 3 — reconstruct the real SQL</h3>
<pre><code><span class="tok-comment">// Prisma logs the SQL and the params separately. Put them back together.</span>
function dungLai(sql: string, params: string): string {
  const p: unknown[] = JSON.parse(params);
  return sql.replace(/\\$(\\d+)/g, (_, i) =&gt; {
    const v = p[Number(i) - 1];
    if (v === null) return 'NULL';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return &#96;'\${String(v).replace(/'/g, "''")}'&#96;;
  });
}

const chamNhat = xong().cauTruyVan.sort((a, b) =&gt; b.ms - a.ms)[0];
console.log('EXPLAIN ANALYZE ' + dungLai(chamNhat.sql, chamNhat.params) + ';');</code></pre>
<div class="out">EXPLAIN ANALYZE SELECT "public"."posts"."id", "public"."posts"."title", ...
FROM "public"."posts"
WHERE ("public"."posts"."published" = true AND "public"."posts"."title"::text ILIKE '%prisma%')
ORDER BY "public"."posts"."published_at" DESC LIMIT 20 OFFSET 0;</div>
<div class="callout ok">
<p><strong>That reconstruction function is worth keeping in your repository.</strong> Copying a logged query into psql by hand and substituting eight parameters is tedious enough that people skip it — and skipping it means guessing at the plan instead of reading it. Thirty lines of code turns "I think this is slow because…" into a fact. Note the quote-escaping: it is for your own convenience in a dev tool, and this function must never be used to build a query you actually run.</p>
</div>

<h3>Step 4 — read the plan</h3>
<pre><code>psql "$DATABASE_URL" -c "EXPLAIN (ANALYZE, BUFFERS) SELECT …"</code></pre>
<div class="out">Limit  (cost=18422.44..18422.49 rows=20 width=97) (actual time=308.1..308.2 rows=20 loops=1)
  Buffers: shared hit=142 read=8891
  -&gt;  Sort  (cost=18422.44..18424.19 rows=698 width=97) (actual time=308.1..308.1 rows=20 loops=1)
        Sort Key: published_at DESC
        Sort Method: top-N heapsort  Memory: 29kB
        -&gt;  Seq Scan on posts  (cost=0.00..18403.88 rows=698 width=97)
                               (actual time=0.4..306.9 rows=412 loops=1)
              Filter: (published AND (title ~~* '%prisma%'::text))
              Rows Removed by Filter: 411612
Planning Time: 0.211 ms
Execution Time: 308.284 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Seq Scan</code> plus <code>Rows Removed by Filter: 411612</code></span><span class="v">The finding. It read four hundred thousand rows to return twenty. Everything else in the plan is downstream of that.</span></div>
  <div class="kv"><span class="k"><code>read=8891</code> in Buffers</span><span class="v">Blocks fetched from disk rather than cache. High <code>read</code> relative to <code>hit</code> means the query is I/O bound, which is why <code>BUFFERS</code> is worth always adding.</span></div>
  <div class="kv"><span class="k">Estimated 698 rows, actual 412</span><span class="v">Close enough. A large gap between <code>rows=</code> in the cost estimate and <code>rows=</code> in the actual means the planner has stale statistics — run <code>ANALYZE</code> on the table before concluding anything else.</span></div>
  <div class="kv"><span class="k"><code>Sort Method: top-N heapsort</code></span><span class="v">Good — it kept only 20 rows in memory rather than sorting all 412. <code>external merge Disk</code> here would mean <code>work_mem</code> is too small, which is a different fix entirely.</span></div>
</div>

<h3>Step 5 — fix, then measure again</h3>
<pre><code><span class="tok-comment">-- The fix indicated by the plan: an index the ILIKE can use (Lesson 5.5)</span>
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX CONCURRENTLY "posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);
ANALYZE "posts";</code></pre>
<div class="out">-- same query, after
Limit  (actual time=4.1..4.2 rows=20 loops=1)
  Buffers: shared hit=418 read=61
  -&gt;  Sort  (actual time=4.1..4.1 rows=20 loops=1)
        -&gt;  Bitmap Heap Scan on posts  (actual time=1.2..3.8 rows=412 loops=1)
              -&gt;  Bitmap Index Scan on posts_title_trgm  (actual time=0.9..0.9 rows=412 loops=1)
Execution Time: 4.281 ms

-- and the request as a whole
{ so: 47, tongMs: 505 }        ← was 812
</div>
<div class="pitfall">
<p><strong>Trap — the page is still slow, and the temptation is to keep indexing.</strong> The slowest query went from 311 ms to 4 ms and the page went from 812 ms to 505 ms — the remaining 402 ms is the forty-one-call N+1 in row 0, which no index touches. This is why the ranking table comes before the plan: it tells you <em>which kind</em> of problem you have. Fixing the visible slow query first is the right order only when it is also the expensive one.</p>
</div>

<h3>The three numbers to watch</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Queries per request</span><span class="lz-lnote">Should be a small constant — under ten for most pages. If it grows with the number of items on the page, that is an N+1 and it is the highest-value thing to fix. Assert on it in tests: <code>expect(so).toBeLessThan(10)</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Total query time per request</span><span class="lz-lnote">The database's share of your latency. If it is 40 ms of a 900 ms request, the database is not your problem and further optimisation there is wasted effort.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rows read versus rows returned</span><span class="lz-lnote">From <code>EXPLAIN</code>. Four hundred thousand read to return twenty is the signature of a missing index. Twenty read to return twenty is optimal and there is nothing left to do.</span></div>
</div>
<pre><code><span class="tok-comment">// Make it a test, so a regression is caught before review</span>
test('trang chu khong bi N+1', async () =&gt; {
  const xong = batDau();
  await layTrangChu(1);
  const { so } = xong();
  expect(so).toBeLessThanOrEqual(6);
});</code></pre>
<div class="callout">
<p><strong>A query-count assertion is the cheapest performance test there is.</strong> It runs in milliseconds, needs no load generator, and catches the exact regression that matters: someone adds an <code>include</code> inside a loop, or removes one from a query, and the count jumps from six to sixty. Latency tests are noisy and slow; a count is deterministic. Put one on every page that renders a list.</p>
</div>

<h3>In production: <code>pg_stat_statements</code></h3>
<pre><code><span class="tok-comment">-- The same ranking, but across every request the server has served</span>
SELECT calls,
       round(total_exec_time::numeric, 0) AS tong_ms,
       round(mean_exec_time::numeric, 2)  AS tb_ms,
       rows,
       left(query, 80) AS truy_van
FROM pg_stat_statements
WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database())
ORDER BY total_exec_time DESC
LIMIT 10;</code></pre>
<div class="out"> calls  | tong_ms  | tb_ms |  rows   |                    truy_van
--------+----------+-------+---------+-------------------------------------------------
 891204 |  1284018 |  1.44 | 891204  | SELECT ... FROM "users" WHERE "users"."id" = $1
   4128 |   402891 | 97.60 |  82560  | SELECT ... FROM "posts" WHERE "published" = $1 …
  12094 |   184022 | 15.22 | 241880  | SELECT ... FROM "comments" WHERE "post_id" IN …</div>
<p>Row one is the same N+1, seen from production: 891,204 calls at 1.44 ms each is twenty-one minutes of database time spent on a query that is individually trivial. <code>pg_stat_statements</code> is the same ranking as step 2, aggregated over everything, and it is the first place to look when the problem is "the site is slow" rather than "this page is slow".</p>

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
<pre><code>const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
});

const nhatKy: { sql: string; params: string; ms: number }[] = [];

prisma.$on('query', (e) =&gt; {
  nhatKy.push({ sql: e.query, params: e.params, ms: e.duration });
});

<span class="tok-comment">// Bọc một yêu cầu và báo lại nó tốn bao nhiêu</span>
export function batDau() {
  const tu = nhatKy.length;
  return () =&gt; {
    const cua = nhatKy.slice(tu);
    const tong = cua.reduce((s, q) =&gt; s + q.ms, 0);
    return { so: cua.length, tongMs: tong, cauTruyVan: cua };
  };
}</code></pre>
<pre><code>const xong = batDau();
await layTrangChu(userId);
console.log(xong());</code></pre>
<div class="out">{
  so: 47,
  tongMs: 812,
  cauTruyVan: [ … ]
}</div>
<div class="callout warn">
<p><strong>Bốn mươi bảy câu truy vấn cho một trang.</strong> Chính con số đó, không phải 812 mili giây, mới là phát hiện. Một trang cần bốn mươi bảy lượt đi về là một N+1 ở đâu đó — và không chỉ mục nào vá được, vì từng câu truy vấn riêng lẻ có lẽ đều nhanh. Hãy đếm trước, rồi mới nhìn thời lượng. Hai con số ấy chỉ vào hai bài toán hoàn toàn khác nhau.</p>
</div>

<h3>Bước 2 — xếp hạng theo tổng thời gian, không theo cái chậm nhất</h3>
<pre><code>function xepHang(cua: { sql: string; ms: number }[]) {
  const nhom = new Map&lt;string, { so: number; tong: number; max: number }&gt;();

  for (const q of cua) {
    <span class="tok-comment">// chuẩn hoá: gộp các chỗ giữ tham số lại để các lần lặp gom về một nhóm</span>
    const khuon = q.sql.replace(/\\$\\d+/g, '?').replace(/\\s+/g, ' ');
    const n = nhom.get(khuon) ?? { so: 0, tong: 0, max: 0 };
    n.so++; n.tong += q.ms; n.max = Math.max(n.max, q.ms);
    nhom.set(khuon, n);
  }

  return [...nhom.entries()]
    .map(([sql, n]) =&gt; ({ sql: sql.slice(0, 90), ...n }))
    .sort((a, b) =&gt; b.tong - a.tong);
}

console.table(xepHang(xong().cauTruyVan));</code></pre>
<div class="out">┌─────────┬────────────────────────────────────────────────────┬─────┬───────┬──────┐
│ (index) │ sql                                                │ so  │ tong  │ max  │
├─────────┼────────────────────────────────────────────────────┼─────┼───────┼──────┤
│ 0       │ 'SELECT ... FROM "users" WHERE "users"."id" = ? …' │ 41  │ 402   │ 14   │
│ 1       │ 'SELECT ... FROM "posts" WHERE "published" = ? O…' │ 1   │ 311   │ 311  │
│ 2       │ 'SELECT ... FROM "comments" WHERE "post_id" IN …' │ 1   │  61   │ 61   │
│ 3       │ 'SELECT COUNT(*) FROM "posts" WHERE …'             │ 1   │  38   │ 38   │
└─────────┴────────────────────────────────────────────────────┴─────┴───────┴──────┘</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Dòng 0</span><span class="lz-t">41 lời gọi, tổng 402 ms, mỗi lần 14 ms</span><span class="lz-d">Từng câu truy vấn đều nhanh. Vấn đề là nó chạy bốn mươi mốt lần — một N+1 giáo khoa, và cách vá là một <code>include</code>, không phải một chỉ mục. Bài 9.2.</span></div>
  <div class="lz-step"><span class="lz-k">Dòng 1</span><span class="lz-t">1 lời gọi, 311 ms</span><span class="lz-d">Một câu truy vấn làm quá nhiều việc. Cái này đi thẳng tới <code>EXPLAIN ANALYZE</code> — đó là thiếu chỉ mục, một kế hoạch tồi, hoặc quá nhiều hàng. Bài 9.3.</span></div>
  <div class="lz-step"><span class="lz-k">Xếp theo tổng, không theo max</span><span class="lz-t">Chính là trọng tâm</span><span class="lz-d">Sắp theo câu truy vấn đơn chậm nhất sẽ đưa dòng 1 lên đầu và giấu hẳn dòng 0 — trong khi dòng 0 mới tốn nhiều hơn. Một trăm câu 4 ms thắng một câu 300 ms về tổng thiệt hại, và chỉ cột tổng mới cho thấy điều đó.</span></div>
  <div class="lz-step"><span class="lz-k">Chuẩn hoá SQL</span><span class="lz-t">Là thứ khiến việc gom nhóm chạy được</span><span class="lz-d">Thay <code>$1</code>, <code>$2</code> bằng <code>?</code> gộp bốn mươi mốt câu lệnh trông khác nhau thành một dòng. Không có nó thì bảng có bốn mươi bảy dòng và không thấy được mẫu nào.</span></div>
</div>

<h3>Bước 3 — dựng lại đúng câu SQL thật</h3>
<pre><code><span class="tok-comment">// Prisma ghi log SQL và tham số riêng ra. Hãy ghép chúng lại.</span>
function dungLai(sql: string, params: string): string {
  const p: unknown[] = JSON.parse(params);
  return sql.replace(/\\$(\\d+)/g, (_, i) =&gt; {
    const v = p[Number(i) - 1];
    if (v === null) return 'NULL';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return &#96;'\${String(v).replace(/'/g, "''")}'&#96;;
  });
}

const chamNhat = xong().cauTruyVan.sort((a, b) =&gt; b.ms - a.ms)[0];
console.log('EXPLAIN ANALYZE ' + dungLai(chamNhat.sql, chamNhat.params) + ';');</code></pre>
<div class="out">EXPLAIN ANALYZE SELECT "public"."posts"."id", "public"."posts"."title", ...
FROM "public"."posts"
WHERE ("public"."posts"."published" = true AND "public"."posts"."title"::text ILIKE '%prisma%')
ORDER BY "public"."posts"."published_at" DESC LIMIT 20 OFFSET 0;</div>
<div class="callout ok">
<p><strong>Cái hàm dựng lại đó đáng giữ trong kho mã của bạn.</strong> Chép một câu truy vấn từ log vào psql bằng tay rồi thay tám tham số vào thì nhọc đủ để người ta bỏ qua — mà bỏ qua nghĩa là đoán kế hoạch thay vì đọc nó. Ba mươi dòng mã biến "tôi nghĩ chỗ này chậm vì…" thành một sự kiện. Lưu ý phần thoát dấu nháy: nó dành cho sự tiện lợi của chính bạn trong một công cụ phát triển, và cái hàm này không bao giờ được dùng để dựng một câu truy vấn bạn thật sự chạy.</p>
</div>

<h3>Bước 4 — đọc cái kế hoạch</h3>
<pre><code>psql "$DATABASE_URL" -c "EXPLAIN (ANALYZE, BUFFERS) SELECT …"</code></pre>
<div class="out">Limit  (cost=18422.44..18422.49 rows=20 width=97) (actual time=308.1..308.2 rows=20 loops=1)
  Buffers: shared hit=142 read=8891
  -&gt;  Sort  (cost=18422.44..18424.19 rows=698 width=97) (actual time=308.1..308.1 rows=20 loops=1)
        Sort Key: published_at DESC
        Sort Method: top-N heapsort  Memory: 29kB
        -&gt;  Seq Scan on posts  (cost=0.00..18403.88 rows=698 width=97)
                               (actual time=0.4..306.9 rows=412 loops=1)
              Filter: (published AND (title ~~* '%prisma%'::text))
              Rows Removed by Filter: 411612
Planning Time: 0.211 ms
Execution Time: 308.284 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Seq Scan</code> cộng <code>Rows Removed by Filter: 411612</code></span><span class="v">Phát hiện. Nó đọc bốn trăm nghìn hàng để trả về hai mươi. Mọi thứ khác trong kế hoạch đều là hệ quả của chỗ đó.</span></div>
  <div class="kv"><span class="k"><code>read=8891</code> trong Buffers</span><span class="v">Số khối lấy từ đĩa chứ không phải từ đệm. <code>read</code> cao so với <code>hit</code> nghĩa là câu truy vấn bị giới hạn bởi I/O, và vì thế <code>BUFFERS</code> đáng thêm vào luôn.</span></div>
  <div class="kv"><span class="k">Ước lượng 698 hàng, thực tế 412</span><span class="v">Đủ sát. Một khoảng cách lớn giữa <code>rows=</code> trong ước lượng chi phí và <code>rows=</code> trong phần thực tế nghĩa là bộ lập kế hoạch có thống kê cũ — hãy chạy <code>ANALYZE</code> lên bảng trước khi kết luận bất cứ điều gì khác.</span></div>
  <div class="kv"><span class="k"><code>Sort Method: top-N heapsort</code></span><span class="v">Tốt — nó chỉ giữ 20 hàng trong bộ nhớ chứ không sắp cả 412. Nếu ở đây là <code>external merge Disk</code> thì nghĩa là <code>work_mem</code> quá nhỏ, và đó là cách vá hoàn toàn khác.</span></div>
</div>

<h3>Bước 5 — vá, rồi đo lại</h3>
<pre><code><span class="tok-comment">-- Cách vá mà kế hoạch chỉ ra: một chỉ mục mà ILIKE dùng được (Bài 5.5)</span>
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX CONCURRENTLY "posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);
ANALYZE "posts";</code></pre>
<div class="out">-- cùng câu truy vấn, sau khi vá
Limit  (actual time=4.1..4.2 rows=20 loops=1)
  Buffers: shared hit=418 read=61
  -&gt;  Sort  (actual time=4.1..4.1 rows=20 loops=1)
        -&gt;  Bitmap Heap Scan on posts  (actual time=1.2..3.8 rows=412 loops=1)
              -&gt;  Bitmap Index Scan on posts_title_trgm  (actual time=0.9..0.9 rows=412 loops=1)
Execution Time: 4.281 ms

-- và cả yêu cầu nói chung
{ so: 47, tongMs: 505 }        ← trước là 812
</div>
<div class="pitfall">
<p><strong>Bẫy — trang vẫn chậm, và cám dỗ là đi thêm chỉ mục nữa.</strong> Câu truy vấn chậm nhất đi từ 311 ms xuống 4 ms còn trang đi từ 812 ms xuống 505 ms — 402 ms còn lại là cái N+1 bốn mươi mốt lời gọi ở dòng 0, thứ mà không chỉ mục nào đụng tới. Vì thế bảng xếp hạng phải đứng trước cái kế hoạch: nó nói cho bạn biết bạn đang có <em>loại</em> bài toán nào. Vá câu truy vấn chậm nhìn thấy được trước chỉ là thứ tự đúng khi nó cũng là câu tốn kém nhất.</p>
</div>

<h3>Ba con số cần canh</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Số truy vấn trên mỗi yêu cầu</span><span class="lz-lnote">Phải là một hằng số nhỏ — dưới mười với phần lớn trang. Nếu nó tăng theo số phần tử trên trang thì đó là một N+1 và là thứ đáng vá nhất. Hãy khẳng định nó trong bài kiểm: <code>expect(so).toBeLessThan(10)</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tổng thời gian truy vấn trên mỗi yêu cầu</span><span class="lz-lnote">Phần cơ sở dữ liệu chiếm trong độ trễ của bạn. Nếu nó là 40 ms trong một yêu cầu 900 ms thì cơ sở dữ liệu không phải vấn đề của bạn, và tối ưu thêm ở đó là công sức phí phạm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Số hàng đọc so với số hàng trả về</span><span class="lz-lnote">Lấy từ <code>EXPLAIN</code>. Đọc bốn trăm nghìn để trả hai mươi là chữ ký của một chỉ mục còn thiếu. Đọc hai mươi để trả hai mươi là tối ưu và không còn gì để làm.</span></div>
</div>
<pre><code><span class="tok-comment">// Biến nó thành một bài kiểm, để một lần thụt lùi bị bắt trước khi review</span>
test('trang chu khong bi N+1', async () =&gt; {
  const xong = batDau();
  await layTrangChu(1);
  const { so } = xong();
  expect(so).toBeLessThanOrEqual(6);
});</code></pre>
<div class="callout">
<p><strong>Một phép khẳng định về số truy vấn là bài kiểm hiệu năng rẻ nhất từng có.</strong> Nó chạy trong vài mili giây, không cần bộ tạo tải, và bắt đúng cái thụt lùi quan trọng: có người thêm một <code>include</code> vào trong một vòng lặp, hoặc bỏ một cái ra khỏi truy vấn, và con số nhảy từ sáu lên sáu mươi. Bài kiểm độ trễ thì nhiễu và chậm; một con số đếm thì tất định. Hãy đặt một cái lên mọi trang có vẽ danh sách.</p>
</div>

<h3>Trên production: <code>pg_stat_statements</code></h3>
<pre><code><span class="tok-comment">-- Cũng bảng xếp hạng ấy, nhưng trên mọi yêu cầu mà máy chủ đã phục vụ</span>
SELECT calls,
       round(total_exec_time::numeric, 0) AS tong_ms,
       round(mean_exec_time::numeric, 2)  AS tb_ms,
       rows,
       left(query, 80) AS truy_van
FROM pg_stat_statements
WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database())
ORDER BY total_exec_time DESC
LIMIT 10;</code></pre>
<div class="out"> calls  | tong_ms  | tb_ms |  rows   |                    truy_van
--------+----------+-------+---------+-------------------------------------------------
 891204 |  1284018 |  1.44 | 891204  | SELECT ... FROM "users" WHERE "users"."id" = $1
   4128 |   402891 | 97.60 |  82560  | SELECT ... FROM "posts" WHERE "published" = $1 …
  12094 |   184022 | 15.22 | 241880  | SELECT ... FROM "comments" WHERE "post_id" IN …</div>
<p>Dòng một chính là cái N+1 ấy, nhìn từ production: 891.204 lời gọi mỗi lời 1,44 ms là hai mươi mốt phút thời gian cơ sở dữ liệu tiêu cho một câu truy vấn tự nó chẳng đáng gì. <code>pg_stat_statements</code> là đúng bảng xếp hạng ở bước 2, tổng hợp trên mọi thứ, và là nơi đầu tiên nên nhìn khi bài toán là "trang web chậm" chứ không phải "trang này chậm".</p>

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
      description: 'Bốn cách N+1 lẻn vào một kho mã Prisma dù không có lazy loading, relationLoadStrategy join so với query đo trên cùng dữ liệu, khi nào join thắng và khi nào nó thua, và hai mẫu thay thế khi include là sai công cụ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>N+1 in all its forms</h2>
<p class="lead">Prisma has no lazy loading, so the classic N+1 cannot happen by accident — Lesson 1.1 showed that an un-included relation is <code>undefined</code> and crashes rather than quietly querying. And yet the ranking table in Lesson 9.1 found forty-one calls to the same statement. N+1 gets in four other ways, and this lesson names all of them.</p>

<h3>Form 1 — the explicit loop</h3>
<pre><code><span class="tok-comment">// The obvious one. Everybody writes it once.</span>
const bai = await prisma.post.findMany({ take: 40 });
for (const b of bai) {
  const tacGia = await prisma.user.findUnique({ where: { id: b.authorId } });
  render(b, tacGia);
}</code></pre>
<div class="out">41 queries · 402 ms total · 14 ms each</div>
<pre><code><span class="tok-comment">// Fix: ask for the relation with the parent</span>
const bai = await prisma.post.findMany({ take: 40, include: { author: true } });</code></pre>
<div class="out">2 queries · 18 ms total</div>

<h3>Form 2 — the loop hidden in a helper</h3>
<pre><code><span class="tok-comment">// The helper is fine. Calling it in a map is not.</span>
async function demBinhLuan(postId: number) {
  return prisma.comment.count({ where: { postId } });
}

const bai = await prisma.post.findMany({ take: 40 });
const kq = await Promise.all(
  bai.map(async (b) =&gt; ({ ...b, so: await demBinhLuan(b.id) })),
);</code></pre>
<div class="out">41 queries · 128 ms total
-- Promise.all makes them concurrent, which hides it: the wall clock looks acceptable
-- while the database does forty-one times the work and holds forty-one connections</div>
<pre><code><span class="tok-comment">// Fix: _count, which is one correlated subquery (Lesson 4.2)</span>
const bai = await prisma.post.findMany({
  take: 40,
  include: { _count: { select: { comments: true } } },
});</code></pre>
<div class="out">1 query · 6 ms</div>
<div class="pitfall">
<p><strong>Trap — <code>Promise.all</code> makes N+1 invisible in latency and worse in load.</strong> Forty sequential 14 ms queries take 560 ms and look obviously wrong. Forty concurrent ones take 40 ms and look fine — while consuming forty pool connections at once, which is how a page that "performs well" in isolation takes the site down at fifty concurrent users. Count queries, not milliseconds.</p>
</div>

<h3>Form 3 — the nested <code>include</code> that fans out</h3>
<pre><code>const nguoiDung = await prisma.user.findMany({
  take: 20,
  include: {
    posts: {
      take: 10,
      include: { comments: { include: { author: true } } },
    },
  },
});</code></pre>
<div class="out">prisma:query SELECT ... FROM "users" LIMIT $1                                    -- 20 users
prisma:query SELECT ... FROM "posts" WHERE "author_id" IN ($1…$20)               -- 200 posts
prisma:query SELECT ... FROM "comments" WHERE "post_id" IN ($1…$200)             -- 4,182 comments
prisma:query SELECT ... FROM "users" WHERE "id" IN ($1…$1204)                    -- 1,204 authors

4 queries · 1,284 ms · 5,606 rows transferred for a page that renders 20 cards</div>
<div class="callout warn">
<p><strong>This is not N+1 — it is four queries — and it is still the problem.</strong> Prisma batched perfectly; the cost is that each level multiplies the row count, and the fourth query alone returns 1,204 full user rows. The ranking table from Lesson 9.1 shows this as one slow query rather than many fast ones, which is why <em>rows transferred</em> is the third number to watch. The fix is not batching; it is asking for less.</p>
</div>
<pre><code><span class="tok-comment">// Fix: the page renders 20 cards, so fetch what 20 cards need</span>
const nguoiDung = await prisma.user.findMany({
  take: 20,
  select: {
    id: true,
    username: true,
    avatarUrl: true,
    _count: { select: { posts: true } },
    posts: {
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, _count: { select: { comments: true } } },
    },
  },
});</code></pre>
<div class="out">2 queries · 24 ms · 80 rows</div>

<h3>Form 4 — the loop in the caller</h3>
<pre><code><span class="tok-comment">// The service is correct in isolation. The route is what creates the N+1.</span>
class BaiVietService {
  async layTheoId(id: number) {
    return prisma.post.findUniqueOrThrow({ where: { id }, include: { author: true } });
  }
}

<span class="tok-comment">// somewhere else, months later</span>
const kq = await Promise.all(ids.map((id) =&gt; svc.layTheoId(id)));</code></pre>
<pre><code><span class="tok-comment">// Fix: give the service a batch method, and use it</span>
class BaiVietService {
  async layTheoIds(ids: number[]) {
    return prisma.post.findMany({ where: { id: { in: ids } }, include: { author: true } });
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">This is the one that survives review</span><span class="v">Both files look reasonable. The N+1 exists only in the combination, so it is invisible in a diff and only shows up in the query log — which is the argument for the query-count test from Lesson 9.1.</span></div>
  <div class="kv"><span class="k">Every single-id method wants a plural sibling</span><span class="v">If <code>layTheoId</code> exists, someone will eventually map over it. Providing <code>layTheoIds</code> means the correct thing is also the convenient thing.</span></div>
  <div class="kv"><span class="k">Or a DataLoader</span><span class="v">In GraphQL this is what <code>dataloader</code> exists for: it collects the individual calls within a tick and issues one <code>IN</code> query. Worth it when the call sites genuinely cannot be batched by hand.</span></div>
</div>

<h3><code>relationLoadStrategy</code> — one query instead of several</h3>
<pre><code>generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["relationJoins"]
}</code></pre>
<pre><code><span class="tok-comment">// The default: one SELECT per relation level, stitched in the engine</span>
await prisma.post.findMany({
  take: 40,
  include: { author: true, comments: { take: 5 } },
  relationLoadStrategy: 'query',
});

<span class="tok-comment">// The alternative: one SELECT with LATERAL joins, stitched by PostgreSQL</span>
await prisma.post.findMany({
  take: 40,
  include: { author: true, comments: { take: 5 } },
  relationLoadStrategy: 'join',
});</code></pre>
<div class="out">-- strategy: 'query'
SELECT ... FROM "posts" LIMIT $1
SELECT ... FROM "users" WHERE "id" IN ($1…$27)
SELECT ... FROM "comments" WHERE "post_id" IN ($1…$40)
3 queries · 31 ms

-- strategy: 'join'
SELECT "posts".*, "author".*, "comments".* FROM "posts"
LEFT JOIN LATERAL (SELECT ... FROM "users" WHERE …) AS "author" ON true
LEFT JOIN LATERAL (SELECT ... FROM "comments" WHERE … LIMIT 5) AS "comments" ON true
LIMIT $1
1 query · 19 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">join wins on latency</span><span class="lz-t">One round trip instead of three</span><span class="lz-d">Most of the saving is network, not database work. On a database in the same datacentre it is a modest win; across a region boundary, where each round trip is 30 ms, it is decisive.</span></div>
  <div class="lz-step"><span class="lz-k">query wins on rows transferred</span><span class="lz-t">When the parent is wide</span><span class="lz-d">A <code>LATERAL</code> join repeats the parent row for each child. Forty posts with a 4 KB body and five comments each means the body crosses the wire five times — 800 KB instead of 160 KB.</span></div>
  <div class="lz-step"><span class="lz-k">query wins on deep nesting</span><span class="lz-t">Three levels or more</span><span class="lz-d">The row multiplication compounds. Two levels is usually fine; at three the join can transfer an order of magnitude more data than the separate queries.</span></div>
  <div class="lz-step"><span class="lz-k">Measure per query, not globally</span><span class="lz-t">It is an argument, not a setting</span><span class="lz-d">There is a global default, and setting it is a mistake — the right strategy depends on the shape of each query. Set it on the ones you have measured.</span></div>
</div>
<pre><code><span class="tok-comment">// The measurement worth doing on your own data</span>
for (const cl of ['query', 'join'] as const) {
  const t0 = performance.now();
  await prisma.post.findMany({
    take: 40,
    include: { author: true, comments: { take: 5, include: { author: true } } },
    relationLoadStrategy: cl,
  });
  console.log(cl, (performance.now() - t0).toFixed(1), 'ms');
}</code></pre>
<div class="out">-- narrow parent (post without body)
query 31.2 ms
join  19.4 ms      ← join wins

-- wide parent (post with a 6 KB body), three levels
query 48.1 ms
join  212.7 ms     ← join loses badly: the body is repeated 200 times</div>

<h3>Two patterns for when <code>include</code> is the wrong tool</h3>
<pre><code><span class="tok-comment">// 1 — the feed problem: N parents, the newest 3 children of each.</span>
<span class="tok-comment">//     include with take does this per parent, which is correct but slow.</span>
<span class="tok-comment">//     A lateral join in raw SQL does it in one pass.</span>
const feed = await prisma.$queryRaw&lt;any[]&gt;&#96;
  SELECT u.id, u.username, b.*
  FROM users u
  LEFT JOIN LATERAL (
    SELECT id, title, published_at FROM posts
    WHERE author_id = u.id AND published
    ORDER BY published_at DESC LIMIT 3
  ) b ON true
  WHERE u.id = ANY(\${ids}::int[])&#96;;</code></pre>
<pre><code><span class="tok-comment">// 2 — the denormalised counter, when _count is still too slow</span>
model Post {
  id           Int @id @default(autoincrement())
  commentCount Int @default(0) @map("comment_count")
  @@index([commentCount])
}

<span class="tok-comment">// maintained in the same transaction that creates the comment</span>
await prisma.$transaction([
  prisma.comment.create({ data: { postId, body } }),
  prisma.post.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } }),
]);</code></pre>
<div class="callout ok">
<p><strong>The counter is the answer when the count appears in a list <em>and</em> you sort or filter by it.</strong> <code>_count</code> is a correlated subquery — cheap for twenty rows, and it cannot be indexed, so "the ten most commented posts" has to compute the count for every post before it can sort. As a plain column it is an index range scan. The cost is keeping it correct: increment in the same transaction, and add a scheduled job that recomputes it, because it will drift eventually.</p>
</div>

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
<pre><code><span class="tok-comment">// Dạng hiển nhiên. Ai cũng viết nó một lần trong đời.</span>
const bai = await prisma.post.findMany({ take: 40 });
for (const b of bai) {
  const tacGia = await prisma.user.findUnique({ where: { id: b.authorId } });
  render(b, tacGia);
}</code></pre>
<div class="out">41 truy vấn · tổng 402 ms · mỗi lần 14 ms</div>
<pre><code><span class="tok-comment">// Vá: xin luôn quan hệ cùng với cha</span>
const bai = await prisma.post.findMany({ take: 40, include: { author: true } });</code></pre>
<div class="out">2 truy vấn · tổng 18 ms</div>

<h3>Dạng 2 — vòng lặp giấu trong một hàm phụ</h3>
<pre><code><span class="tok-comment">// Cái hàm phụ thì ổn. Gọi nó trong một map thì không.</span>
async function demBinhLuan(postId: number) {
  return prisma.comment.count({ where: { postId } });
}

const bai = await prisma.post.findMany({ take: 40 });
const kq = await Promise.all(
  bai.map(async (b) =&gt; ({ ...b, so: await demBinhLuan(b.id) })),
);</code></pre>
<div class="out">41 truy vấn · tổng 128 ms
-- Promise.all làm chúng chạy song song, và điều đó giấu vấn đề đi: đồng hồ trông chấp nhận được
-- trong khi cơ sở dữ liệu làm gấp bốn mươi mốt lần công việc và giữ bốn mươi mốt kết nối</div>
<pre><code><span class="tok-comment">// Vá: _count, tức một truy vấn con tương quan (Bài 4.2)</span>
const bai = await prisma.post.findMany({
  take: 40,
  include: { _count: { select: { comments: true } } },
});</code></pre>
<div class="out">1 truy vấn · 6 ms</div>
<div class="pitfall">
<p><strong>Bẫy — <code>Promise.all</code> làm N+1 vô hình về độ trễ và tệ hơn về tải.</strong> Bốn mươi câu 14 ms chạy tuần tự mất 560 ms và trông sai rành rành. Bốn mươi câu chạy song song mất 40 ms và trông ổn — trong khi ngốn bốn mươi kết nối pool cùng lúc, và đó là cách một trang "chạy tốt" khi thử riêng lại hạ gục cả trang web ở mốc năm mươi người dùng đồng thời. Hãy đếm truy vấn, đừng đếm mili giây.</p>
</div>

<h3>Dạng 3 — <code>include</code> lồng nhau nở bung ra</h3>
<pre><code>const nguoiDung = await prisma.user.findMany({
  take: 20,
  include: {
    posts: {
      take: 10,
      include: { comments: { include: { author: true } } },
    },
  },
});</code></pre>
<div class="out">prisma:query SELECT ... FROM "users" LIMIT $1                                    -- 20 người dùng
prisma:query SELECT ... FROM "posts" WHERE "author_id" IN ($1…$20)               -- 200 bài viết
prisma:query SELECT ... FROM "comments" WHERE "post_id" IN ($1…$200)             -- 4.182 bình luận
prisma:query SELECT ... FROM "users" WHERE "id" IN ($1…$1204)                    -- 1.204 tác giả

4 truy vấn · 1.284 ms · 5.606 hàng truyền đi cho một trang vẽ 20 cái thẻ</div>
<div class="callout warn">
<p><strong>Đây không phải N+1 — nó là bốn câu truy vấn — và nó vẫn là vấn đề.</strong> Prisma đã gom lô hoàn hảo; cái giá là mỗi tầng nhân số hàng lên, và riêng câu thứ tư trả về 1.204 hàng người dùng đầy đủ. Bảng xếp hạng ở Bài 9.1 hiện chuyện này thành một câu truy vấn chậm chứ không phải nhiều câu nhanh, và vì thế <em>số hàng truyền đi</em> mới là con số thứ ba cần canh. Cách vá không phải gom lô; mà là xin ít lại.</p>
</div>
<pre><code><span class="tok-comment">// Vá: trang vẽ 20 cái thẻ, vậy hãy lấy đúng thứ 20 cái thẻ cần</span>
const nguoiDung = await prisma.user.findMany({
  take: 20,
  select: {
    id: true,
    username: true,
    avatarUrl: true,
    _count: { select: { posts: true } },
    posts: {
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, _count: { select: { comments: true } } },
    },
  },
});</code></pre>
<div class="out">2 truy vấn · 24 ms · 80 hàng</div>

<h3>Dạng 4 — vòng lặp nằm ở bên gọi</h3>
<pre><code><span class="tok-comment">// Cái service tự nó đúng. Chính cái route mới tạo ra N+1.</span>
class BaiVietService {
  async layTheoId(id: number) {
    return prisma.post.findUniqueOrThrow({ where: { id }, include: { author: true } });
  }
}

<span class="tok-comment">// ở một chỗ khác, vài tháng sau</span>
const kq = await Promise.all(ids.map((id) =&gt; svc.layTheoId(id)));</code></pre>
<pre><code><span class="tok-comment">// Vá: cho service một phương thức nhận lô, và dùng nó</span>
class BaiVietService {
  async layTheoIds(ids: number[]) {
    return prisma.post.findMany({ where: { id: { in: ids } }, include: { author: true } });
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Đây là dạng sống sót qua review</span><span class="v">Cả hai tệp đều trông hợp lý. N+1 chỉ tồn tại trong sự kết hợp, nên nó vô hình trong một bản diff và chỉ lộ ra trong log truy vấn — và đó là lý lẽ cho bài kiểm đếm truy vấn ở Bài 9.1.</span></div>
  <div class="kv"><span class="k">Mọi phương thức nhận một id đều muốn có một người anh em số nhiều</span><span class="v">Nếu <code>layTheoId</code> tồn tại thì rốt cuộc sẽ có người map lên nó. Cung cấp sẵn <code>layTheoIds</code> nghĩa là thứ đúng đắn cũng là thứ tiện tay.</span></div>
  <div class="kv"><span class="k">Hoặc một DataLoader</span><span class="v">Trong GraphQL thì <code>dataloader</code> tồn tại đúng vì chuyện này: nó gom các lời gọi lẻ trong cùng một tick rồi bắn một câu <code>IN</code>. Đáng dùng khi các chỗ gọi thật sự không gom lô bằng tay được.</span></div>
</div>

<h3><code>relationLoadStrategy</code> — một câu truy vấn thay vì nhiều câu</h3>
<pre><code>generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["relationJoins"]
}</code></pre>
<pre><code><span class="tok-comment">// Mặc định: mỗi tầng quan hệ một câu SELECT, ghép lại trong engine</span>
await prisma.post.findMany({
  take: 40,
  include: { author: true, comments: { take: 5 } },
  relationLoadStrategy: 'query',
});

<span class="tok-comment">// Lựa chọn khác: một câu SELECT với các LATERAL join, do PostgreSQL ghép</span>
await prisma.post.findMany({
  take: 40,
  include: { author: true, comments: { take: 5 } },
  relationLoadStrategy: 'join',
});</code></pre>
<div class="out">-- chiến lược: 'query'
SELECT ... FROM "posts" LIMIT $1
SELECT ... FROM "users" WHERE "id" IN ($1…$27)
SELECT ... FROM "comments" WHERE "post_id" IN ($1…$40)
3 truy vấn · 31 ms

-- chiến lược: 'join'
SELECT "posts".*, "author".*, "comments".* FROM "posts"
LEFT JOIN LATERAL (SELECT ... FROM "users" WHERE …) AS "author" ON true
LEFT JOIN LATERAL (SELECT ... FROM "comments" WHERE … LIMIT 5) AS "comments" ON true
LIMIT $1
1 truy vấn · 19 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">join thắng về độ trễ</span><span class="lz-t">Một lượt đi về thay vì ba</span><span class="lz-d">Phần lớn khoản tiết kiệm là mạng, không phải công việc của cơ sở dữ liệu. Với một cơ sở dữ liệu cùng trung tâm dữ liệu thì đó là thắng lợi vừa phải; qua ranh giới vùng, nơi mỗi lượt đi về là 30 ms, thì nó có tính quyết định.</span></div>
  <div class="lz-step"><span class="lz-k">query thắng về số hàng truyền đi</span><span class="lz-t">Khi cha rộng</span><span class="lz-d">Một phép <code>LATERAL</code> join lặp lại hàng cha cho mỗi con. Bốn mươi bài viết có nội dung 4 KB và mỗi bài năm bình luận nghĩa là cái nội dung ấy đi qua đường truyền năm lần — 800 KB thay vì 160 KB.</span></div>
  <div class="lz-step"><span class="lz-k">query thắng khi lồng sâu</span><span class="lz-t">Từ ba tầng trở lên</span><span class="lz-d">Phép nhân số hàng dồn lại. Hai tầng thì thường ổn; tới tầng ba thì phép join có thể truyền đi nhiều dữ liệu hơn cả một bậc so với các truy vấn riêng.</span></div>
  <div class="lz-step"><span class="lz-k">Đo theo từng truy vấn, không theo toàn cục</span><span class="lz-t">Nó là một tham số, không phải một thiết lập</span><span class="lz-d">Có một mặc định toàn cục, và đặt nó là một sai lầm — chiến lược đúng phụ thuộc vào hình dạng từng câu truy vấn. Hãy đặt nó cho những câu bạn đã đo.</span></div>
</div>
<pre><code><span class="tok-comment">// Phép đo đáng làm trên chính dữ liệu của bạn</span>
for (const cl of ['query', 'join'] as const) {
  const t0 = performance.now();
  await prisma.post.findMany({
    take: 40,
    include: { author: true, comments: { take: 5, include: { author: true } } },
    relationLoadStrategy: cl,
  });
  console.log(cl, (performance.now() - t0).toFixed(1), 'ms');
}</code></pre>
<div class="out">-- cha hẹp (bài viết không có nội dung dài)
query 31.2 ms
join  19.4 ms      ← join thắng

-- cha rộng (bài viết có nội dung 6 KB), ba tầng
query 48.1 ms
join  212.7 ms     ← join thua đậm: cái nội dung bị lặp 200 lần</div>

<h3>Hai mẫu cho khi <code>include</code> là công cụ sai</h3>
<pre><code><span class="tok-comment">// 1 — bài toán dòng thời gian: N cha, mỗi cha 3 con mới nhất.</span>
<span class="tok-comment">//     include kèm take làm việc đó theo từng cha, đúng nhưng chậm.</span>
<span class="tok-comment">//     Một lateral join trong SQL thô làm nó trong một lượt.</span>
const feed = await prisma.$queryRaw&lt;any[]&gt;&#96;
  SELECT u.id, u.username, b.*
  FROM users u
  LEFT JOIN LATERAL (
    SELECT id, title, published_at FROM posts
    WHERE author_id = u.id AND published
    ORDER BY published_at DESC LIMIT 3
  ) b ON true
  WHERE u.id = ANY(\${ids}::int[])&#96;;</code></pre>
<pre><code><span class="tok-comment">// 2 — cột đếm phi chuẩn hoá, khi _count vẫn còn chậm</span>
model Post {
  id           Int @id @default(autoincrement())
  commentCount Int @default(0) @map("comment_count")
  @@index([commentCount])
}

<span class="tok-comment">// duy trì trong cùng giao dịch tạo ra bình luận</span>
await prisma.$transaction([
  prisma.comment.create({ data: { postId, body } }),
  prisma.post.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } }),
]);</code></pre>
<div class="callout ok">
<p><strong>Cột đếm là câu trả lời khi con số ấy xuất hiện trong một danh sách <em>và</em> bạn sắp xếp hoặc lọc theo nó.</strong> <code>_count</code> là một truy vấn con tương quan — rẻ với hai mươi hàng, và nó không đánh chỉ mục được, nên "mười bài nhiều bình luận nhất" buộc phải tính số đếm cho mọi bài rồi mới sắp được. Ở dạng một cột thuần thì đó là một lần quét khoảng theo chỉ mục. Cái giá là giữ nó đúng: tăng trong cùng giao dịch, và thêm một tác vụ theo lịch tính lại, vì rốt cuộc nó sẽ lệch.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Indexes your Prisma queries can use</h2>
<p class="lead">Prisma writes the SQL; PostgreSQL decides whether an index helps. That means index design is a conversation between what you wrote in <code>findMany</code> and what you declared in <code>@@index</code>, and the two are easy to get out of step. This lesson goes from query to index, then shows how to find the indexes nobody uses and the columns nobody indexed.</p>

<h3>Start from the query, not the schema</h3>
<pre><code><span class="tok-comment">// The query the page actually runs</span>
await prisma.post.findMany({
  where:   { authorId: 42, published: true, deletedAt: null },
  orderBy: { publishedAt: 'desc' },
  take:    20,
});</code></pre>
<div class="out">SELECT ... FROM "posts"
WHERE ("author_id" = $1 AND "published" = $2 AND "deleted_at" IS NULL)
ORDER BY "published_at" DESC
LIMIT $3</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Equality columns first</span><span class="lz-t"><code>author_id</code>, <code>published</code></span><span class="lz-d">Columns compared with <code>=</code> go at the front of the index, most selective first. <code>author_id</code> narrows to one author's posts; <code>published</code> only halves it.</span></div>
  <div class="lz-step"><span class="lz-k">2 · The sort column last</span><span class="lz-t"><code>published_at DESC</code></span><span class="lz-d">With the equality columns fixed, the remaining index entries are already in <code>published_at</code> order — so PostgreSQL can read twenty and stop, with no sort step at all.</span></div>
  <div class="lz-step"><span class="lz-k">3 · The soft-delete filter becomes a predicate</span><span class="lz-t"><code>WHERE deleted_at IS NULL</code></span><span class="lz-d">A partial index. It excludes deleted rows from the index entirely, which makes it smaller and means the filter costs nothing at query time.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Verify, do not assume</span><span class="lz-t"><code>EXPLAIN ANALYZE</code></span><span class="lz-d">The plan must show <code>Index Scan</code> and no <code>Sort</code> node. If a <code>Sort</code> is still there, the ordering does not match the index and step 2 was wrong.</span></div>
</div>
<pre><code><span class="tok-comment">-- The index that query wants, written by hand because of the predicate</span>
CREATE INDEX "posts_tac_gia_dang" ON "posts" ("author_id", "published", "published_at" DESC)
  WHERE "deleted_at" IS NULL;</code></pre>
<div class="out">-- before
Seq Scan on posts (actual time=0.3..184.2 rows=214 loops=1)
  Rows Removed by Filter: 411798
  -&gt;  Sort (actual time=184.4..184.4 rows=20 loops=1)
Execution Time: 184.612 ms

-- after
Limit (actual time=0.04..0.09 rows=20 loops=1)
  -&gt;  Index Scan using posts_tac_gia_dang on posts (actual time=0.03..0.07 rows=20 loops=1)
        Index Cond: ((author_id = 42) AND (published = true))
Execution Time: 0.118 ms</div>
<p>No <code>Sort</code> node, twenty rows examined instead of four hundred thousand, and 1,564 times faster. Every part of that came from reading the query first and writing the index to match it.</p>

<h3>The foreign key nobody indexed</h3>
<pre><code><span class="tok-comment">-- Find every foreign key with no index on the referencing column</span>
SELECT c.conrelid::regclass AS bang,
       a.attname            AS cot,
       c.conname            AS rang_buoc
FROM pg_constraint c
JOIN pg_attribute  a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid = c.conrelid AND a.attnum = i.indkey[0]
  )
ORDER BY 1, 2;</code></pre>
<div class="out">      bang       |       cot        |          rang_buoc
-----------------+------------------+------------------------------
 comments        | author_id        | comments_author_id_fkey
 order_items     | product_id       | order_items_product_id_fkey
 notifications   | actor_id         | notifications_actor_id_fkey</div>
<div class="callout warn">
<p><strong>Run that query on your own database before reading further.</strong> PostgreSQL indexes primary keys and unique constraints automatically; it does <strong>not</strong> index the referencing side of a foreign key, and neither does Prisma. Every row it returns is a relation where "all the children of this parent" is a sequential scan — and also a table where deleting a parent has to scan the child table to check the constraint, which is why an unindexed foreign key makes deletes slow as well as reads.</p>
</div>

<h3>Column order, demonstrated</h3>
<pre><code>-- Two indexes over the same two columns, opposite order
CREATE INDEX "idx_ab" ON "posts" ("author_id", "published_at");
CREATE INDEX "idx_ba" ON "posts" ("published_at", "author_id");</code></pre>
<div class="out">-- Query A: WHERE author_id = 42 ORDER BY published_at DESC
idx_ab → Index Scan, 0.09 ms          ← equality first, then sort: perfect
idx_ba → Seq Scan,  184 ms            ← cannot seek: author_id is not the leading column

-- Query B: WHERE published_at > '2026-08-01'
idx_ab → Seq Scan,  191 ms            ← author_id is leading and unconstrained
idx_ba → Index Scan, 2.1 ms           ← range on the leading column: usable

-- Query C: WHERE author_id = 42
idx_ab → Index Scan, 0.06 ms          ← a prefix of the index is enough
idx_ba → Seq Scan,  188 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A composite index serves its prefixes</span><span class="v"><code>(a, b, c)</code> serves <code>a</code>, <code>(a, b)</code> and <code>(a, b, c)</code>. It does not serve <code>b</code> alone or <code>(b, c)</code>. So one well-ordered composite index often replaces three single-column ones.</span></div>
  <div class="kv"><span class="k">Equality first, range or sort last</span><span class="v">The rule that generates the right order. Once a range appears, columns after it in the index cannot be used to seek — only to filter.</span></div>
  <div class="kv"><span class="k">Direction matters for the sort, not the seek</span><span class="v"><code>ORDER BY a ASC, b DESC</code> needs an index declared with those directions. PostgreSQL can read an index backwards, but not half-backwards.</span></div>
  <div class="kv"><span class="k">In Prisma</span><span class="v"><code>@@index([authorId, publishedAt(sort: Desc)])</code>. The <code>sort:</code> argument is what generates the <code>DESC</code> in the DDL, and it is easy to forget.</span></div>
</div>

<h3>A covering index: skipping the table entirely</h3>
<pre><code><span class="tok-comment">// A list page that needs only three columns</span>
await prisma.post.findMany({
  where:  { authorId: 42, published: true },
  select: { id: true, title: true, publishedAt: true },
  take:   20,
});</code></pre>
<pre><code><span class="tok-comment">-- INCLUDE puts the extra columns in the index without making them part of the key</span>
CREATE INDEX "posts_bang_liet_ke" ON "posts" ("author_id", "published", "published_at" DESC)
  INCLUDE ("id", "title");</code></pre>
<div class="out">-- without INCLUDE
Index Scan using posts_tac_gia_dang on posts (actual time=0.03..0.28 rows=20)
  Buffers: shared hit=24            ← 20 index entries + 20 heap fetches

-- with INCLUDE
Index Only Scan using posts_bang_liet_ke on posts (actual time=0.02..0.05 rows=20)
  Heap Fetches: 0
  Buffers: shared hit=4             ← the table was never touched</div>
<div class="callout ok">
<p><strong><code>Index Only Scan</code> with <code>Heap Fetches: 0</code> is as fast as a read gets.</strong> Everything the query needs is in the index, so the table pages are never read. The cost is a larger index and slower writes, so it is worth it for a query that runs constantly on a hot page and not worth it in general. Note that <code>Heap Fetches</code> only stays at zero while the visibility map is current — a table that is written heavily and not vacuumed will start fetching from the heap again.</p>
</div>

<h3>Finding the indexes nobody uses</h3>
<pre><code>SELECT s.relname AS bang,
       s.indexrelname AS chi_muc,
       s.idx_scan AS so_lan_dung,
       pg_size_pretty(pg_relation_size(s.indexrelid)) AS kich_thuoc
FROM pg_stat_user_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.idx_scan &lt; 50
  AND NOT i.indisunique
  AND NOT i.indisprimary
ORDER BY pg_relation_size(s.indexrelid) DESC
LIMIT 10;</code></pre>
<div class="out">     bang      |          chi_muc            | so_lan_dung | kich_thuoc
---------------+-----------------------------+-------------+------------
 posts         | posts_views_idx             |           0 | 84 MB
 comments      | comments_created_at_idx      |           3 | 41 MB
 notifications | notifications_type_idx       |          12 | 18 MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Zero scans, 84 MB</span><span class="v">An index that has never been used since the last statistics reset. It costs disk, it costs write throughput on every insert and update, and it buys nothing. Drop it — after checking how long the counter has been accumulating.</span></div>
  <div class="kv"><span class="k">Check the reset time first</span><span class="v"><code>SELECT stats_reset FROM pg_stat_database WHERE datname = current_database()</code>. A zero count over two hours means nothing; over two months it is conclusive.</span></div>
  <div class="kv"><span class="k">Exclude unique and primary</span><span class="v">They exist to enforce a constraint, not to serve queries. A unique index with zero scans is still doing its job.</span></div>
  <div class="kv"><span class="k">Drop with <code>CONCURRENTLY</code></span><span class="v"><code>DROP INDEX CONCURRENTLY</code> does not take an exclusive lock. And drop it in a migration, not by hand, or the next <code>migrate diff</code> reports it as drift.</span></div>
</div>

<h3>Finding the columns nobody indexed</h3>
<pre><code><span class="tok-comment">-- Tables doing large sequential scans: the other half of the picture</span>
SELECT relname AS bang,
       seq_scan, seq_tup_read,
       idx_scan,
       CASE WHEN seq_scan = 0 THEN 0
            ELSE seq_tup_read / seq_scan END AS hang_moi_lan_quet,
       n_live_tup AS so_hang
FROM pg_stat_user_tables
WHERE seq_scan &gt; 0
ORDER BY seq_tup_read DESC
LIMIT 10;</code></pre>
<div class="out">   bang    | seq_scan | seq_tup_read | idx_scan | hang_moi_lan_quet | so_hang
-----------+----------+--------------+----------+-------------------+---------
 posts     |    41208 |  16983412008 |  1284091 |            412139 |  412204
 comments  |     8104 |    891204882 |  4128204 |            109971 |  110042
 users     |   184028 |      1840280 |  8912044 |                10 |      12</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>posts</code>: 41,208 scans reading the whole table each time</span><span class="lz-lnote">Sixteen billion rows read in total. Some query has no index and runs constantly. Find it in <code>pg_stat_statements</code> and index it — this row is the highest-value finding in the chapter.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>users</code>: 184,028 scans, 10 rows each</span><span class="lz-lnote">Harmless. The table has twelve rows, so PostgreSQL correctly ignores any index — a sequential scan of one page is cheaper than an index lookup. Never "fix" this.</span></div>
  <div class="lz-layer"><span class="lz-lname">The ratio is the signal</span><span class="lz-lnote"><code>seq_tup_read / seq_scan</code> close to <code>n_live_tup</code> means full scans of a large table. Close to zero, or a small table, means nothing to do.</span></div>
  <div class="lz-layer"><span class="lz-lname">Run <code>ANALYZE</code> before believing any of it</span><span class="lz-lnote">Stale statistics make the planner choose sequential scans it would otherwise avoid. If these numbers look wrong, <code>ANALYZE</code> the table and re-measure before adding an index.</span></div>
</div>

<h3>Four queries no index can save</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>contains</code> without a trigram index</span><span class="v"><code>LIKE '%x%'</code> cannot use a B-tree at any column order. The fix is <code>pg_trgm</code> — Lesson 5.5, and it is an extension plus a GIN index, not a rearrangement.</span></div>
  <div class="kv"><span class="k">A large <code>OFFSET</code></span><span class="v">The index is used perfectly and the database still walks a million entries to discard them. Cursor pagination — Lesson 5.3. No index exists that fixes offset.</span></div>
  <div class="kv"><span class="k"><code>COUNT(*)</code> on a big table</span><span class="v">PostgreSQL has no stored row count, so a total is a full scan even with every index in place. Cache it, or read the estimate from <code>pg_class.reltuples</code>.</span></div>
  <div class="kv"><span class="k">A filter that matches most rows</span><span class="v"><code>WHERE published = true</code> when 95% are published. The planner correctly refuses the index — reading 95% of a table through an index is slower than reading it directly. This is not a problem to fix.</span></div>
</div>

<div class="note-ct">
<p><strong>From the CuongThai codebase.</strong> This repository has a migration named <code>20260622_add_performance_indexes</code> — added after the fact, which is the normal way this goes. The lesson embedded in the name is that indexes are added when a query is measured, not when a model is written. The <code>@@index([authorId])</code> you add with the relation is the exception: that one is predictable, and Lesson 2.3 argues for adding it immediately.</p>
</div>

<h3>Learning sources for this lesson</h3>
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
<pre><code><span class="tok-comment">// Câu truy vấn mà trang thật sự chạy</span>
await prisma.post.findMany({
  where:   { authorId: 42, published: true, deletedAt: null },
  orderBy: { publishedAt: 'desc' },
  take:    20,
});</code></pre>
<div class="out">SELECT ... FROM "posts"
WHERE ("author_id" = $1 AND "published" = $2 AND "deleted_at" IS NULL)
ORDER BY "published_at" DESC
LIMIT $3</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Cột so bằng lên trước</span><span class="lz-t"><code>author_id</code>, <code>published</code></span><span class="lz-d">Các cột so bằng <code>=</code> đứng đầu chỉ mục, cái chọn lọc nhất trước. <code>author_id</code> thu về bài của một tác giả; <code>published</code> chỉ giảm đi một nửa.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Cột sắp xếp xuống cuối</span><span class="lz-t"><code>published_at DESC</code></span><span class="lz-d">Khi các cột so bằng đã cố định, những mục chỉ mục còn lại vốn đã theo thứ tự <code>published_at</code> — nên PostgreSQL đọc hai mươi cái rồi dừng, hoàn toàn không cần bước sắp xếp.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Bộ lọc xoá mềm thành một điều kiện của chỉ mục</span><span class="lz-t"><code>WHERE deleted_at IS NULL</code></span><span class="lz-d">Một partial index. Nó loại hẳn các hàng đã xoá khỏi chỉ mục, khiến chỉ mục nhỏ hơn và khiến bộ lọc ấy không tốn gì lúc truy vấn.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Kiểm lại, đừng phỏng đoán</span><span class="lz-t"><code>EXPLAIN ANALYZE</code></span><span class="lz-d">Kế hoạch phải hiện <code>Index Scan</code> và không có nút <code>Sort</code> nào. Nếu vẫn còn <code>Sort</code> thì thứ tự sắp xếp không khớp chỉ mục và bước 2 đã sai.</span></div>
</div>
<pre><code><span class="tok-comment">-- Cái chỉ mục mà câu truy vấn ấy muốn, viết tay vì có điều kiện lọc</span>
CREATE INDEX "posts_tac_gia_dang" ON "posts" ("author_id", "published", "published_at" DESC)
  WHERE "deleted_at" IS NULL;</code></pre>
<div class="out">-- trước
Seq Scan on posts (actual time=0.3..184.2 rows=214 loops=1)
  Rows Removed by Filter: 411798
  -&gt;  Sort (actual time=184.4..184.4 rows=20 loops=1)
Execution Time: 184.612 ms

-- sau
Limit (actual time=0.04..0.09 rows=20 loops=1)
  -&gt;  Index Scan using posts_tac_gia_dang on posts (actual time=0.03..0.07 rows=20 loops=1)
        Index Cond: ((author_id = 42) AND (published = true))
Execution Time: 0.118 ms</div>
<p>Không còn nút <code>Sort</code>, hai mươi hàng được xem xét thay vì bốn trăm nghìn, và nhanh gấp 1.564 lần. Mọi phần trong đó đến từ việc đọc câu truy vấn trước rồi viết chỉ mục cho khớp.</p>

<h3>Cái khoá ngoại không ai đánh chỉ mục</h3>
<pre><code><span class="tok-comment">-- Tìm mọi khoá ngoại không có chỉ mục trên cột tham chiếu</span>
SELECT c.conrelid::regclass AS bang,
       a.attname            AS cot,
       c.conname            AS rang_buoc
FROM pg_constraint c
JOIN pg_attribute  a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid = c.conrelid AND a.attnum = i.indkey[0]
  )
ORDER BY 1, 2;</code></pre>
<div class="out">      bang       |       cot        |          rang_buoc
-----------------+------------------+------------------------------
 comments        | author_id        | comments_author_id_fkey
 order_items     | product_id       | order_items_product_id_fkey
 notifications   | actor_id         | notifications_actor_id_fkey</div>
<div class="callout warn">
<p><strong>Hãy chạy câu truy vấn đó lên chính cơ sở dữ liệu của bạn trước khi đọc tiếp.</strong> PostgreSQL tự đánh chỉ mục cho khoá chính và ràng buộc unique; nó <strong>không</strong> đánh chỉ mục cho phía tham chiếu của một khoá ngoại, và Prisma cũng không. Mỗi hàng nó trả về là một quan hệ mà câu "mọi con của cha này" là một lần quét tuần tự — và cũng là một cái bảng mà việc xoá một cha buộc phải quét bảng con để kiểm ràng buộc, nên một khoá ngoại thiếu chỉ mục làm chậm cả xoá lẫn đọc.</p>
</div>

<h3>Thứ tự cột, chứng minh bằng số</h3>
<pre><code>-- Hai chỉ mục trên cùng hai cột, thứ tự ngược nhau
CREATE INDEX "idx_ab" ON "posts" ("author_id", "published_at");
CREATE INDEX "idx_ba" ON "posts" ("published_at", "author_id");</code></pre>
<div class="out">-- Truy vấn A: WHERE author_id = 42 ORDER BY published_at DESC
idx_ab → Index Scan, 0,09 ms          ← so bằng trước rồi tới sắp xếp: hoàn hảo
idx_ba → Seq Scan,  184 ms            ← không nhảy được: author_id không phải cột dẫn đầu

-- Truy vấn B: WHERE published_at > '2026-08-01'
idx_ab → Seq Scan,  191 ms            ← author_id dẫn đầu mà không bị ràng buộc gì
idx_ba → Index Scan, 2,1 ms           ← khoảng trên cột dẫn đầu: dùng được

-- Truy vấn C: WHERE author_id = 42
idx_ab → Index Scan, 0,06 ms          ← một tiền tố của chỉ mục là đủ
idx_ba → Seq Scan,  188 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ mục phức hợp phục vụ các tiền tố của nó</span><span class="v"><code>(a, b, c)</code> phục vụ <code>a</code>, <code>(a, b)</code> và <code>(a, b, c)</code>. Nó không phục vụ riêng <code>b</code> hay <code>(b, c)</code>. Nên một chỉ mục phức hợp sắp đúng thứ tự thường thay được ba chỉ mục một cột.</span></div>
  <div class="kv"><span class="k">So bằng trước, khoảng hoặc sắp xếp sau cùng</span><span class="v">Luật sinh ra thứ tự đúng. Ngay khi có một khoảng xuất hiện, các cột sau nó trong chỉ mục không còn dùng để nhảy được — chỉ dùng để lọc.</span></div>
  <div class="kv"><span class="k">Chiều quan trọng với phần sắp xếp, không quan trọng với phần nhảy</span><span class="v"><code>ORDER BY a ASC, b DESC</code> cần một chỉ mục khai đúng những chiều đó. PostgreSQL đọc ngược một chỉ mục được, nhưng không đọc ngược một nửa được.</span></div>
  <div class="kv"><span class="k">Trong Prisma</span><span class="v"><code>@@index([authorId, publishedAt(sort: Desc)])</code>. Tham số <code>sort:</code> là thứ sinh ra chữ <code>DESC</code> trong DDL, và nó rất dễ bị quên.</span></div>
</div>

<h3>Chỉ mục phủ: bỏ qua hẳn cái bảng</h3>
<pre><code><span class="tok-comment">// Một trang danh sách chỉ cần ba cột</span>
await prisma.post.findMany({
  where:  { authorId: 42, published: true },
  select: { id: true, title: true, publishedAt: true },
  take:   20,
});</code></pre>
<pre><code><span class="tok-comment">-- INCLUDE đưa các cột phụ vào chỉ mục mà không cho chúng thành một phần của khoá</span>
CREATE INDEX "posts_bang_liet_ke" ON "posts" ("author_id", "published", "published_at" DESC)
  INCLUDE ("id", "title");</code></pre>
<div class="out">-- không có INCLUDE
Index Scan using posts_tac_gia_dang on posts (actual time=0.03..0.28 rows=20)
  Buffers: shared hit=24            ← 20 mục chỉ mục + 20 lần lấy từ heap

-- có INCLUDE
Index Only Scan using posts_bang_liet_ke on posts (actual time=0.02..0.05 rows=20)
  Heap Fetches: 0
  Buffers: shared hit=4             ← cái bảng chưa hề bị chạm tới</div>
<div class="callout ok">
<p><strong><code>Index Only Scan</code> với <code>Heap Fetches: 0</code> là mức nhanh nhất mà một lần đọc có thể đạt.</strong> Mọi thứ câu truy vấn cần đều nằm trong chỉ mục, nên các trang của bảng không bao giờ bị đọc. Cái giá là chỉ mục to hơn và ghi chậm hơn, nên nó đáng cho một câu truy vấn chạy liên tục trên một trang nóng và không đáng ở mức chung chung. Lưu ý <code>Heap Fetches</code> chỉ ở mức không khi bản đồ khả kiến còn mới — một cái bảng bị ghi nhiều mà không vacuum sẽ bắt đầu lấy lại từ heap.</p>
</div>

<h3>Tìm những chỉ mục không ai dùng</h3>
<pre><code>SELECT s.relname AS bang,
       s.indexrelname AS chi_muc,
       s.idx_scan AS so_lan_dung,
       pg_size_pretty(pg_relation_size(s.indexrelid)) AS kich_thuoc
FROM pg_stat_user_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.idx_scan &lt; 50
  AND NOT i.indisunique
  AND NOT i.indisprimary
ORDER BY pg_relation_size(s.indexrelid) DESC
LIMIT 10;</code></pre>
<div class="out">     bang      |          chi_muc            | so_lan_dung | kich_thuoc
---------------+-----------------------------+-------------+------------
 posts         | posts_views_idx             |           0 | 84 MB
 comments      | comments_created_at_idx      |           3 | 41 MB
 notifications | notifications_type_idx       |          12 | 18 MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không lần quét nào, 84 MB</span><span class="v">Một chỉ mục chưa từng được dùng kể từ lần reset thống kê gần nhất. Nó tốn đĩa, tốn thông lượng ghi ở mọi lần chèn và cập nhật, và không đổi lại gì. Hãy xoá nó — sau khi kiểm bộ đếm đã tích luỹ được bao lâu.</span></div>
  <div class="kv"><span class="k">Kiểm thời điểm reset trước đã</span><span class="v"><code>SELECT stats_reset FROM pg_stat_database WHERE datname = current_database()</code>. Số không sau hai giờ thì chẳng nói lên gì; sau hai tháng thì đó là kết luận.</span></div>
  <div class="kv"><span class="k">Loại trừ unique và khoá chính</span><span class="v">Chúng tồn tại để thi hành một ràng buộc, không phải để phục vụ truy vấn. Một chỉ mục unique không lần quét nào vẫn đang làm đúng việc của nó.</span></div>
  <div class="kv"><span class="k">Xoá bằng <code>CONCURRENTLY</code></span><span class="v"><code>DROP INDEX CONCURRENTLY</code> không lấy khoá độc quyền. Và hãy xoá trong một migration, đừng xoá tay, không thì lần <code>migrate diff</code> kế tiếp báo nó là trôi dạt.</span></div>
</div>

<h3>Tìm những cột không ai đánh chỉ mục</h3>
<pre><code><span class="tok-comment">-- Các bảng đang bị quét tuần tự nhiều: nửa còn lại của bức tranh</span>
SELECT relname AS bang,
       seq_scan, seq_tup_read,
       idx_scan,
       CASE WHEN seq_scan = 0 THEN 0
            ELSE seq_tup_read / seq_scan END AS hang_moi_lan_quet,
       n_live_tup AS so_hang
FROM pg_stat_user_tables
WHERE seq_scan &gt; 0
ORDER BY seq_tup_read DESC
LIMIT 10;</code></pre>
<div class="out">   bang    | seq_scan | seq_tup_read | idx_scan | hang_moi_lan_quet | so_hang
-----------+----------+--------------+----------+-------------------+---------
 posts     |    41208 |  16983412008 |  1284091 |            412139 |  412204
 comments  |     8104 |    891204882 |  4128204 |            109971 |  110042
 users     |   184028 |      1840280 |  8912044 |                10 |      12</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>posts</code>: 41.208 lần quét, mỗi lần đọc cả bảng</span><span class="lz-lnote">Tổng cộng mười sáu tỉ hàng được đọc. Có một câu truy vấn nào đó không có chỉ mục và chạy liên tục. Tìm nó trong <code>pg_stat_statements</code> rồi đánh chỉ mục — dòng này là phát hiện đáng giá nhất trong cả chương.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>users</code>: 184.028 lần quét, mỗi lần 10 hàng</span><span class="lz-lnote">Vô hại. Bảng có mười hai hàng, nên PostgreSQL phớt lờ mọi chỉ mục là đúng — quét tuần tự một trang rẻ hơn một lần tra chỉ mục. Đừng bao giờ đi "vá" chuyện này.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái tỉ lệ mới là tín hiệu</span><span class="lz-lnote"><code>seq_tup_read / seq_scan</code> gần bằng <code>n_live_tup</code> nghĩa là đang quét toàn bộ một bảng lớn. Gần bằng không, hoặc bảng nhỏ, thì không có gì phải làm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chạy <code>ANALYZE</code> trước khi tin bất cứ con số nào</span><span class="lz-lnote">Thống kê cũ khiến bộ lập kế hoạch chọn quét tuần tự ở những chỗ lẽ ra nó tránh. Nếu mấy con số này trông lạ thì hãy <code>ANALYZE</code> cái bảng rồi đo lại trước khi thêm chỉ mục.</span></div>
</div>

<h3>Bốn kiểu truy vấn không chỉ mục nào cứu được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>contains</code> mà không có chỉ mục trigram</span><span class="v"><code>LIKE '%x%'</code> không dùng được B-tree ở bất kỳ thứ tự cột nào. Cách vá là <code>pg_trgm</code> — Bài 5.5, và đó là một extension cộng một chỉ mục GIN, không phải một lần sắp xếp lại.</span></div>
  <div class="kv"><span class="k">Một <code>OFFSET</code> lớn</span><span class="v">Chỉ mục được dùng hoàn hảo mà cơ sở dữ liệu vẫn đi qua một triệu mục để vứt chúng đi. Phân trang bằng con trỏ — Bài 5.3. Không tồn tại chỉ mục nào vá được offset.</span></div>
  <div class="kv"><span class="k"><code>COUNT(*)</code> trên một bảng lớn</span><span class="v">PostgreSQL không lưu số đếm hàng, nên một con số tổng là một lần quét toàn bộ dù có đủ mọi chỉ mục. Hãy lưu đệm nó, hoặc đọc con số ước lượng từ <code>pg_class.reltuples</code>.</span></div>
  <div class="kv"><span class="k">Một bộ lọc khớp gần hết các hàng</span><span class="v"><code>WHERE published = true</code> khi 95% đã đăng. Bộ lập kế hoạch từ chối chỉ mục là đúng — đọc 95% một cái bảng qua chỉ mục thì chậm hơn đọc thẳng. Đây không phải vấn đề cần vá.</span></div>
</div>

<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai.</strong> Kho này có một migration tên <code>20260622_add_performance_indexes</code> — thêm vào sau khi đã chạy, và đó là cách chuyện này diễn ra một cách bình thường. Bài học nằm trong chính cái tên: chỉ mục được thêm khi một câu truy vấn đã được đo, chứ không phải khi một model được viết ra. Cái <code>@@index([authorId])</code> bạn thêm cùng với quan hệ là ngoại lệ: cái đó đoán trước được, và Bài 2.3 lập luận cho việc thêm nó ngay.</p>
</div>

<h3>Nguồn học cho bài này</h3>
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
      description: 'Mặc định num_cpus*2+1 nghĩa là gì trên máy 16 nhân, phép nhân làm cạn max_connections, cách đo pool đang bận bao nhiêu, vì sao pool to hơn thường chậm hơn, và PgBouncer với directUrl khi số tiến trình vượt quá số kết nối.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>The connection pool, sized by arithmetic</h2>
<p class="lead">Prisma's pool default is <code>num_cpus * 2 + 1</code>, which is a sensible number for one process and a disaster when multiplied by eight containers on a sixteen-core host. Pool sizing is arithmetic, not judgement — this lesson does the arithmetic, then shows how to measure whether you got it right.</p>

<h3>The default, and the multiplication</h3>
<pre><code><span class="tok-comment"># What Prisma picks when you do not say</span>
node -e "console.log(require('os').cpus().length * 2 + 1)"</code></pre>
<div class="out">33</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One process on a 16-core host</span><span class="lz-lnote">33 connections. Comfortable, and well under PostgreSQL's default <code>max_connections</code> of 100.</span></div>
  <div class="lz-layer"><span class="lz-lname">Four containers on that host</span><span class="lz-lnote">132 connections. Already over the limit — and each container sees 16 CPUs because <code>os.cpus()</code> reports the <em>host</em>, not the container's CPU quota.</span></div>
  <div class="lz-layer"><span class="lz-lname">Plus a migration job, a worker, a cron</span><span class="lz-lnote">Each opens its own pool. Plus <code>psql</code> sessions, plus the monitoring agent, plus whatever superuser connections PostgreSQL reserves.</span></div>
  <div class="lz-layer"><span class="lz-lname">The result</span><span class="lz-lnote"><code>FATAL: sorry, too many clients already</code> on the container that started last — which is usually the new deploy, so the symptom is "the deploy failed" rather than "the pool is too big".</span></div>
</div>
<pre><code><span class="tok-comment"># Prove the container problem</span>
docker run --rm --cpus=2 node:22-alpine node -e "console.log(require('os').cpus().length)"</code></pre>
<div class="out">16</div>
<div class="pitfall">
<p><strong>Trap — <code>--cpus=2</code> does not change what <code>os.cpus()</code> reports.</strong> A CPU quota is enforced by the scheduler; it does not virtualise <code>/proc/cpuinfo</code>. So a container limited to two cores still computes a pool of 33, and four of them still ask for 132 connections. <strong>Always set <code>connection_limit</code> explicitly in containers.</strong> The default is only correct for a process that has the machine to itself, which in 2026 is almost nothing.</p>
</div>

<h3>The arithmetic</h3>
<pre><code><span class="tok-comment"># The budget</span>
psql "$DATABASE_URL" -c "SHOW max_connections;"
psql "$DATABASE_URL" -c "SHOW superuser_reserved_connections;"</code></pre>
<div class="out"> max_connections
-----------------
 100

 superuser_reserved_connections
--------------------------------
 3</div>
<pre><code><span class="tok-comment">// available = max_connections − reserved − (other consumers)</span>
<span class="tok-comment">//    100     −      3         −     10 (psql, monitoring, migrations, cron)</span>
<span class="tok-comment">//  = 87 for the application</span>

<span class="tok-comment">// connection_limit = available / number_of_processes</span>
<span class="tok-comment">//    87 / 6 app containers ≈ 14, round down for headroom → 12</span></code></pre>
<pre><code><span class="tok-comment"># .env — set it, in every environment</span>
DATABASE_URL="postgresql://u:p@host:5432/db?connection_limit=12&amp;pool_timeout=20&amp;connect_timeout=10"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>connection_limit</code></span><span class="v">The pool size. This is the number that matters, and the one nobody sets.</span></div>
  <div class="kv"><span class="k"><code>pool_timeout</code> — default 10s</span><span class="v">How long a query waits for a free connection before <code>P2024</code>. Raising it hides the problem; lowering it turns a slow request into a fast failure, which is often what you want behind a load balancer.</span></div>
  <div class="kv"><span class="k"><code>connect_timeout</code> — default 5s</span><span class="v">How long establishing a new TCP connection may take. Worth raising over a slow network, and worth lowering when a fast failure is better than a hung request.</span></div>
  <div class="kv"><span class="k">Count the workers too</span><span class="v">A background worker with its own <code>PrismaClient</code> is another pool. It usually needs far fewer connections than a web container — set it to 3 or 4 and give the budget to the request path.</span></div>
</div>

<h3>Measure it</h3>
<pre><code><span class="tok-comment">-- Who is connected, and what are they doing?</span>
SELECT state,
       count(*) AS so,
       max(now() - state_change)::interval(0) AS lau_nhat
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY state
ORDER BY so DESC;</code></pre>
<div class="out">        state        | so |  lau_nhat
---------------------+----+-----------
 idle                | 61 | 00:14:22
 active              |  8 | 00:00:00
 idle in transaction |  3 | 00:04:11     ← this row is a problem
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>idle</code></span><span class="lz-t">Normal</span><span class="lz-d">Pooled connections waiting for work. Sixty-one idle connections out of a hundred means your pools are larger than your load requires — which costs PostgreSQL memory but is otherwise harmless.</span></div>
  <div class="lz-step"><span class="lz-k"><code>active</code></span><span class="lz-t">The real concurrency</span><span class="lz-d">Queries actually running. If this is consistently 8 while you have 72 connections open, the pool is six times larger than it needs to be.</span></div>
  <div class="lz-step"><span class="lz-k"><code>idle in transaction</code></span><span class="lz-t">Always investigate</span><span class="lz-d">A transaction that is open and not executing anything — usually an interactive <code>$transaction</code> doing an HTTP call, exactly as in Lesson 7.1. Each one holds locks and blocks vacuum. Four minutes is a bug.</span></div>
  <div class="lz-step"><span class="lz-k">Set <code>idle_in_transaction_session_timeout</code></span><span class="lz-t">A backstop</span><span class="lz-d">PostgreSQL will kill such a session after the configured interval. Thirty seconds is a reasonable production value, and it turns a silent lock-holder into a loud error.</span></div>
</div>
<pre><code><span class="tok-comment">-- The Prisma metric, if you enable it</span>
const m = await prisma.$metrics.json();
console.log(m.gauges.filter((g) =&gt; g.key.includes('pool')));</code></pre>
<div class="out">[
  { key: 'prisma_pool_connections_open',  value: 12 },
  { key: 'prisma_pool_connections_busy',  value: 3  },
  { key: 'prisma_pool_connections_idle',  value: 9  },
  { key: 'prisma_client_queries_wait',    value: 0  }   ← queries waiting for a connection
]</div>
<div class="callout ok">
<p><strong><code>prisma_client_queries_wait</code> is the number to alert on.</strong> Zero means the pool is big enough. Consistently above zero means requests are queuing for a connection, and that is the signal to either raise <code>connection_limit</code> — if the budget allows — or find the query that is holding connections too long. Enable metrics with <code>previewFeatures = ["metrics"]</code> and export them to Prometheus; it is ten lines and it removes the guesswork permanently.</p>
</div>

<h3>Why a bigger pool is often slower</h3>
<pre><code><span class="tok-comment"># Same load, three pool sizes. 8-core database, 200 concurrent clients.</span>
for n in 10 50 200; do
  echo "connection_limit=$n"
  DATABASE_URL="…?connection_limit=$n" node bench.js
done</code></pre>
<div class="out">connection_limit=10   → p50  41ms   p99  118ms   thong luong 4,120 req/s
connection_limit=50   → p50  38ms   p99  184ms   thong luong 4,208 req/s
connection_limit=200  → p50 112ms   p99  891ms   thong luong 2,914 req/s</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Two hundred connections is 30% slower</span><span class="v">Not a measurement error. The database has eight cores; two hundred concurrent queries means constant context switching, lock contention, and each query getting a fraction of a core.</span></div>
  <div class="kv"><span class="k">Queueing is not waste</span><span class="v">A request waiting 5 ms for a connection and then running in 40 ms finishes faster than one that starts immediately and takes 112 ms because it is competing with 199 others. The pool is a queue, and a queue is how you keep the server in its efficient range.</span></div>
  <div class="kv"><span class="k">The starting point</span><span class="v">Roughly <code>cores × 2 + effective_spindle_count</code> for the whole database, divided across your processes. On an 8-core managed instance that is about 20 connections total — far fewer than most people assume.</span></div>
  <div class="kv"><span class="k">Then measure</span><span class="v">Raise it only when <code>queries_wait</code> is consistently above zero <em>and</em> the database is not CPU-saturated. If the database is at 100% CPU, a bigger pool makes everything worse.</span></div>
</div>

<h3>When processes outnumber connections: PgBouncer</h3>
<pre><code><span class="tok-comment"># Serverless: 200 concurrent lambdas, each with its own pool</span>
<span class="tok-comment"># 200 × 5 = 1,000 connections against a max_connections of 100.</span>
<span class="tok-comment"># No connection_limit setting fixes this — the arithmetic does not work.</span></code></pre>
<pre><code>datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        <span class="tok-comment">// through PgBouncer, port 6543</span>
  directUrl = env("DIRECT_URL")          <span class="tok-comment">// straight to PostgreSQL, port 5432</span>
}</code></pre>
<pre><code><span class="tok-comment"># .env</span>
DATABASE_URL="postgresql://u:p@host:6543/db?pgbouncer=true&amp;connection_limit=1"
DIRECT_URL="postgresql://u:p@host:5432/db"</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>pgbouncer=true</code></span><span class="lz-lnote">Tells Prisma to disable prepared statements, which transaction-mode pooling cannot support — a prepared statement lives on a server connection that the next transaction may not get. Omit this flag and you get intermittent <code>prepared statement "s0" already exists</code> errors that are very hard to diagnose.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>connection_limit=1</code></span><span class="lz-lnote">Each lambda needs one connection to the pooler, not five. The pooler multiplexes them onto a small number of real PostgreSQL connections.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>directUrl</code></span><span class="lz-lnote">Migrations cannot run through a transaction-mode pooler — Lesson 1.4. The CLI uses this URL; the application never does.</span></div>
  <div class="lz-layer"><span class="lz-lname">What you give up</span><span class="lz-lnote">Session-level features: <code>SET</code>, advisory locks held across statements, <code>LISTEN</code>/<code>NOTIFY</code>, and prepared statement caching. Lesson 7.3's session advisory locks stop working — use the <code>_xact_</code> variants.</span></div>
</div>
<div class="callout warn">
<p><strong>PgBouncer in transaction mode is not transparent, and the failures are subtle.</strong> A <code>SET LOCAL</code> inside a transaction is fine; a <code>SET</code> outside one silently applies to a connection someone else gets next. <code>pg_advisory_lock</code> taken in one statement and released in another may release a lock on a different connection. If you adopt a pooler, re-read every place you use a session-level feature — and the ones this course flagged are the whole list for a normal application.</p>
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
<pre><code><span class="tok-comment"># Prisma chọn gì khi bạn không nói gì</span>
node -e "console.log(require('os').cpus().length * 2 + 1)"</code></pre>
<div class="out">33</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một tiến trình trên máy 16 nhân</span><span class="lz-lnote">33 kết nối. Thoải mái, và còn xa mức <code>max_connections</code> mặc định 100 của PostgreSQL.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bốn container trên chính máy đó</span><span class="lz-lnote">132 kết nối. Đã vượt trần — và mỗi container đều thấy 16 CPU, vì <code>os.cpus()</code> báo cáo <em>máy chủ</em>, không phải hạn mức CPU của container.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cộng thêm một job migration, một worker, một cron</span><span class="lz-lnote">Mỗi cái mở pool riêng. Cộng các phiên <code>psql</code>, cộng agent giám sát, cộng cả phần kết nối PostgreSQL để dành cho superuser.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kết quả</span><span class="lz-lnote"><code>FATAL: sorry, too many clients already</code> rơi vào container khởi động SAU CÙNG — thường là bản deploy mới, nên triệu chứng nhìn ra là "deploy hỏng" chứ không phải "pool quá to".</span></div>
</div>
<pre><code><span class="tok-comment"># Chứng minh vấn đề của container</span>
docker run --rm --cpus=2 node:22-alpine node -e "console.log(require('os').cpus().length)"</code></pre>
<div class="out">16</div>
<div class="pitfall">
<p><strong>Bẫy — <code>--cpus=2</code> KHÔNG đổi thứ <code>os.cpus()</code> báo về.</strong> Hạn mức CPU do bộ định thời cưỡng chế; nó không ảo hoá <code>/proc/cpuinfo</code>. Nên một container bị giới hạn hai nhân vẫn tính ra pool 33, và bốn cái vẫn đòi 132 kết nối. <strong>Trong container thì LUÔN đặt <code>connection_limit</code> tường minh.</strong> Mặc định chỉ đúng cho tiến trình sở hữu nguyên cái máy — thứ mà năm 2026 gần như không còn.</p>
</div>

<h3>Phép số học</h3>
<pre><code><span class="tok-comment"># Ngân sách</span>
psql "$DATABASE_URL" -c "SHOW max_connections;"
psql "$DATABASE_URL" -c "SHOW superuser_reserved_connections;"</code></pre>
<div class="out"> max_connections
-----------------
 100

 superuser_reserved_connections
--------------------------------
 3</div>
<pre><code><span class="tok-comment">// dùng được = max_connections − để dành − (những kẻ tiêu thụ khác)</span>
<span class="tok-comment">//     100    −      3        −   10 (psql, giám sát, migration, cron)</span>
<span class="tok-comment">//  = 87 cho ứng dụng</span>

<span class="tok-comment">// connection_limit = dùng được / số tiến trình</span>
<span class="tok-comment">//    87 / 6 container ứng dụng ≈ 14, làm tròn xuống lấy khoảng thở → 12</span></code></pre>
<pre><code><span class="tok-comment"># .env — đặt nó, ở MỌI môi trường</span>
DATABASE_URL="postgresql://u:p@host:5432/db?connection_limit=12&amp;pool_timeout=20&amp;connect_timeout=10"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>connection_limit</code></span><span class="v">Kích thước pool. Đây là con số quan trọng nhất, và là con số không ai đặt.</span></div>
  <div class="kv"><span class="k"><code>pool_timeout</code> — mặc định 10s</span><span class="v">Một truy vấn chờ bao lâu để có kết nối rảnh trước khi ném <code>P2024</code>. Nâng nó lên là giấu vấn đề; hạ xuống thì biến một request chậm thành một thất bại nhanh — sau một bộ cân bằng tải, đó thường là thứ bạn muốn.</span></div>
  <div class="kv"><span class="k"><code>connect_timeout</code> — mặc định 5s</span><span class="v">Mở một kết nối TCP mới được phép mất bao lâu. Đáng nâng khi mạng chậm, và đáng hạ khi thà hỏng nhanh còn hơn treo.</span></div>
  <div class="kv"><span class="k">Đếm cả worker</span><span class="v">Một worker nền có <code>PrismaClient</code> riêng là MỘT pool nữa. Nó thường cần ít kết nối hơn container web nhiều — đặt 3 hoặc 4 và dồn ngân sách cho đường request.</span></div>
</div>

<h3>Đo nó</h3>
<pre><code><span class="tok-comment">-- Ai đang nối, và họ đang làm gì?</span>
SELECT state,
       count(*) AS so,
       max(now() - state_change)::interval(0) AS lau_nhat
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY state
ORDER BY so DESC;</code></pre>
<div class="out">        state        | so |  lau_nhat
---------------------+----+-----------
 idle                | 61 | 00:14:22
 active              |  8 | 00:00:00
 idle in transaction |  3 | 00:04:11     ← dòng này là vấn đề
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>idle</code></span><span class="lz-t">Bình thường</span><span class="lz-d">Kết nối trong pool đang đợi việc. Sáu mươi mốt kết nối rảnh trên một trăm nghĩa là pool của bạn lớn hơn tải thực cần — tốn bộ nhớ của PostgreSQL, còn lại thì vô hại.</span></div>
  <div class="lz-step"><span class="lz-k"><code>active</code></span><span class="lz-t">Mức song song THẬT</span><span class="lz-d">Truy vấn đang chạy thật. Nếu nó ổn định ở 8 trong khi bạn mở 72 kết nối, pool đang to gấp sáu lần mức cần.</span></div>
  <div class="lz-step"><span class="lz-k"><code>idle in transaction</code></span><span class="lz-t">LUÔN phải điều tra</span><span class="lz-d">Một giao dịch đang mở mà không chạy gì — thường là <code>$transaction</code> tương tác đang gọi HTTP, đúng như Bài 7.1. Mỗi cái giữ khoá và chặn vacuum. Bốn phút là một con bug.</span></div>
  <div class="lz-step"><span class="lz-k">Đặt <code>idle_in_transaction_session_timeout</code></span><span class="lz-t">Lưới đỡ</span><span class="lz-d">PostgreSQL sẽ giết phiên như vậy sau khoảng thời gian cấu hình. Ba mươi giây là giá trị production hợp lý, và nó biến một kẻ giữ khoá lặng lẽ thành một lỗi ồn ào.</span></div>
</div>
<pre><code><span class="tok-comment">-- Chỉ số của Prisma, nếu bạn bật</span>
const m = await prisma.$metrics.json();
console.log(m.gauges.filter((g) =&gt; g.key.includes('pool')));</code></pre>
<div class="out">[
  { key: 'prisma_pool_connections_open',  value: 12 },
  { key: 'prisma_pool_connections_busy',  value: 3  },
  { key: 'prisma_pool_connections_idle',  value: 9  },
  { key: 'prisma_client_queries_wait',    value: 0  }   ← truy vấn đang đợi kết nối
]</div>
<div class="callout ok">
<p><strong><code>prisma_client_queries_wait</code> mới là con số để đặt cảnh báo.</strong> Bằng không nghĩa là pool đủ to. Ổn định lớn hơn không nghĩa là request đang xếp hàng chờ kết nối, và đó là tín hiệu để hoặc nâng <code>connection_limit</code> — nếu ngân sách cho phép — hoặc đi tìm truy vấn đang giữ kết nối quá lâu. Bật chỉ số bằng <code>previewFeatures = ["metrics"]</code> rồi xuất sang Prometheus; mười dòng, và nó xoá vĩnh viễn việc phải đoán.</p>
</div>

<h3>Vì sao pool to hơn thường CHẬM hơn</h3>
<pre><code><span class="tok-comment"># Cùng một tải, ba kích thước pool. Database 8 nhân, 200 client song song.</span>
for n in 10 50 200; do
  echo "connection_limit=$n"
  DATABASE_URL="…?connection_limit=$n" node bench.js
done</code></pre>
<div class="out">connection_limit=10   → p50  41ms   p99  118ms   thong luong 4,120 req/s
connection_limit=50   → p50  38ms   p99  184ms   thong luong 4,208 req/s
connection_limit=200  → p50 112ms   p99  891ms   thong luong 2,914 req/s</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai trăm kết nối CHẬM hơn 30%</span><span class="v">Không phải sai số đo. Database có tám nhân; hai trăm truy vấn song song nghĩa là chuyển ngữ cảnh liên tục, tranh khoá, và mỗi truy vấn chỉ được một phần nhỏ của một nhân.</span></div>
  <div class="kv"><span class="k">Xếp hàng KHÔNG phải lãng phí</span><span class="v">Một request đợi 5 ms để có kết nối rồi chạy trong 40 ms thì XONG SỚM HƠN cái bắt đầu ngay lập tức nhưng mất 112 ms vì phải tranh với 199 cái khác. Pool là một hàng đợi, và hàng đợi là cách giữ máy chủ trong vùng chạy hiệu quả của nó.</span></div>
  <div class="kv"><span class="k">Điểm khởi đầu</span><span class="v">Xấp xỉ <code>số_nhân × 2 + số_trục_đĩa_hiệu_dụng</code> cho TOÀN database, chia cho số tiến trình của bạn. Trên một instance 8 nhân, đó là khoảng 20 kết nối tất cả — ít hơn nhiều so với mức đa số người ta tưởng.</span></div>
  <div class="kv"><span class="k">Rồi mới đo</span><span class="v">Chỉ nâng khi <code>queries_wait</code> ổn định lớn hơn không <em>và</em> database chưa bão hoà CPU. Nếu database đang 100% CPU, pool to hơn làm mọi thứ tệ hơn.</span></div>
</div>

<h3>Khi số tiến trình vượt quá số kết nối: PgBouncer</h3>
<pre><code><span class="tok-comment"># Serverless: 200 lambda song song, mỗi cái một pool riêng</span>
<span class="tok-comment"># 200 × 5 = 1.000 kết nối, đối đầu max_connections = 100.</span>
<span class="tok-comment"># KHÔNG giá trị connection_limit nào sửa được — phép số học không ra.</span></code></pre>
<pre><code>datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        <span class="tok-comment">// qua PgBouncer, cổng 6543</span>
  directUrl = env("DIRECT_URL")          <span class="tok-comment">// thẳng vào PostgreSQL, cổng 5432</span>
}</code></pre>
<pre><code><span class="tok-comment"># .env</span>
DATABASE_URL="postgresql://u:p@host:6543/db?pgbouncer=true&amp;connection_limit=1"
DIRECT_URL="postgresql://u:p@host:5432/db"</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>pgbouncer=true</code></span><span class="lz-lnote">Bảo Prisma tắt prepared statement, thứ mà pooling ở chế độ giao dịch không đỡ nổi — một prepared statement sống trên một kết nối máy chủ mà giao dịch kế tiếp có thể không nhận được. Bỏ cờ này thì bạn gặp lỗi <code>prepared statement "s0" already exists</code> lúc có lúc không, và cực khó chẩn đoán.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>connection_limit=1</code></span><span class="lz-lnote">Mỗi lambda cần MỘT kết nối tới pooler, không phải năm. Pooler ghép chúng lên một số nhỏ kết nối PostgreSQL thật.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>directUrl</code></span><span class="lz-lnote">Migration không chạy qua pooler chế độ giao dịch được — Bài 1.4. CLI dùng URL này; ứng dụng thì không bao giờ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái bạn đánh đổi</span><span class="lz-lnote">Các tính năng mức phiên: <code>SET</code>, advisory lock giữ qua nhiều câu lệnh, <code>LISTEN</code>/<code>NOTIFY</code>, và cache prepared statement. Advisory lock mức phiên ở Bài 7.3 ngừng hoạt động — dùng biến thể <code>_xact_</code>.</span></div>
</div>
<div class="callout warn">
<p><strong>PgBouncer chế độ giao dịch KHÔNG trong suốt, và những hỏng hóc của nó rất tinh vi.</strong> <code>SET LOCAL</code> bên trong một giao dịch thì ổn; <code>SET</code> ngoài giao dịch thì lặng lẽ áp lên một kết nối mà người khác nhận kế tiếp. <code>pg_advisory_lock</code> lấy ở câu lệnh này rồi nhả ở câu lệnh khác có thể nhả khoá trên một kết nối khác. Nếu bạn dùng pooler, hãy đọc lại MỌI chỗ có dùng tính năng mức phiên — và những chỗ khoá này đã điểm mặt chính là toàn bộ danh sách đó với một ứng dụng bình thường.</p>
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
      description: 'Chọn ít cột thay vì cả hàng, phân trang bằng con trỏ thay vì offset, đếm xấp xỉ thay vì count() quét bảng, gộp ghi thay vì vòng lặp await, và đặt một tầng cache trước Prisma với luật vô hiệu hoá không tự lừa mình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>The query you should not send at all</h2>
<p class="lead">The four previous lessons made queries faster. This one removes them. A query that never leaves the process costs nothing, and the five techniques here — narrower rows, cursor pagination, approximate counts, batched writes, and a cache with an honest invalidation rule — between them account for most of the difference between an application that survives its own traffic and one that does not.</p>

<h3>1. Select less, because rows travel</h3>
<pre><code><span class="tok-comment">// The feed list. What does it actually render?</span>
const posts = await prisma.socialPost.findMany({
  where: { deletedAt: null },
  include: { author: true },
  take: 20,
});</code></pre>
<pre><code><span class="tok-comment">-- What that sends over the wire, per row</span>
SELECT "id","content","mediaUrls","metadata","createdAt","updatedAt",
       "authorId","deletedAt","editedAt","pinnedAt", …           <span class="tok-comment">-- every column</span>
<span class="tok-comment">-- plus every column of "User", including "passwordHash" and "email"</span></code></pre>
<pre><code><span class="tok-comment">// The same list, asking for what the card shows</span>
const posts = await prisma.socialPost.findMany({
  where: { deletedAt: null },
  select: {
    id: true,
    content: true,
    createdAt: true,
    author: { select: { id: true, username: true, avatarUrl: true } },
    _count: { select: { comments: true, likes: true } },
  },
  take: 20,
});</code></pre>
<div class="out">include: true   → 20 rows,  412 KB transferred,  31.4 ms
select: {...}   → 20 rows,   47 KB transferred,   6.9 ms

(the 365 KB difference is mostly "metadata" JSON and the author's
 unused columns — 8.8x less data, 4.5x faster)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bytes</span><span class="lz-t">Serialised twice</span><span class="lz-d">PostgreSQL builds the row, the wire protocol encodes it, the engine decodes it, and the client turns it into JavaScript objects. A column you do not use pays that cost four times.</span></div>
  <div class="lz-step"><span class="lz-k">TOAST</span><span class="lz-t">The hidden read</span><span class="lz-d">A large <code>text</code> or <code>jsonb</code> value lives out of line in a TOAST table. Selecting it is an extra read per row that an index cannot help with. Not selecting it skips the read entirely.</span></div>
  <div class="lz-step"><span class="lz-k">Security</span><span class="lz-t">The real reason</span><span class="lz-d"><code>include: { author: true }</code> pulls <code>passwordHash</code>, <code>email</code>, <code>resetToken</code> into your process — and one <code>res.json(posts)</code> away from the browser. <code>select</code> makes leaking a field a deliberate act.</span></div>
  <div class="lz-step"><span class="lz-k">The habit</span><span class="lz-t">Default to <code>select</code></span><span class="lz-d">Write <code>select</code> for every list endpoint from the start. <code>include</code> is for the detail page where you genuinely want the whole object, and even there it is worth listing the fields.</span></div>
</div>
<div class="callout ok">
<p><strong><code>omit</code> is the other direction, and it is available from Prisma 5.16.</strong> <code>omit: { passwordHash: true }</code> on the client's global config removes a field from every query, everywhere, permanently. It is the right tool for secrets — a deny-list that cannot be forgotten — while <code>select</code> stays the right tool for payload size. Use both: <code>omit</code> globally for the fields that must never travel, <code>select</code> per query for the ones this endpoint does not need.</p>
</div>

<h3>2. Offset pagination dies at page 500</h3>
<pre><code><span class="tok-comment">// The obvious pagination</span>
const trang = await prisma.socialPost.findMany({
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * 20,
  take: 20,
});</code></pre>
<pre><code><span class="tok-comment"># Same query, four page numbers. 1.2M rows.</span>
EXPLAIN ANALYZE SELECT * FROM "SocialPost" ORDER BY "createdAt" DESC OFFSET %n% LIMIT 20;</code></pre>
<div class="out">OFFSET     0  → Limit … actual time=0.031..0.412 rows=20  loops=1     0.5 ms
OFFSET   200  → Limit … actual time=0.028..2.104 rows=20  loops=1     2.2 ms
OFFSET 10000  → Limit … actual time=0.026..94.31 rows=20  loops=1    94.6 ms
OFFSET 200000 → Limit … actual time=0.031..1873. rows=20  loops=1  1874.2 ms</div>
<div class="pitfall">
<p><strong>Trap — <code>OFFSET n</code> reads and throws away <code>n</code> rows.</strong> The database has no way to jump to row 200,000 of an ordered result; it produces them in order and discards the first 200,000. The cost is linear in the page number, so the page nobody visits is the one that ties up a connection for two seconds. Worse, it is <em>unstable</em>: a row inserted while a user pages through shifts everything down, so they see one row twice and never see another.</p>
</div>
<pre><code><span class="tok-comment">// Cursor pagination — constant cost, and stable</span>
const trang = await prisma.socialPost.findMany({
  orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],   <span class="tok-comment">// tie-break: createdAt is not unique</span>
  cursor: cursorId ? { id: cursorId } : undefined,
  skip: cursorId ? 1 : 0,                             <span class="tok-comment">// skip the cursor row itself</span>
  take: 20,
});
const tiepTheo = trang.length === 20 ? trang[19].id : null;</code></pre>
<div class="out">cursor at row      0  →  0.5 ms
cursor at row  10000  →  0.6 ms
cursor at row 200000  →  0.5 ms

(the index seeks straight to the cursor; the page number is irrelevant)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Always tie-break with a unique column</span><span class="v"><code>orderBy: { createdAt: 'desc' }</code> alone is ambiguous when two posts share a timestamp — the database may order them differently between calls, and a cursor into an ambiguous order skips or repeats rows. Add <code>{ id: 'desc' }</code>.</span></div>
  <div class="kv"><span class="k">Index the order</span><span class="v">The cursor is only fast if <code>@@index([createdAt(sort: Desc), id(sort: Desc)])</code> exists. Without it the plan is a sort of the whole table and the cursor buys nothing.</span></div>
  <div class="kv"><span class="k">The cost: no page numbers</span><span class="v">Cursor pagination gives "next" and "previous", not "jump to page 500". For a feed, a chat, an activity log, that is exactly right. For an admin table where a human wants page numbers, keep offset — those tables are small and nobody pages to 200,000.</span></div>
  <div class="kv"><span class="k">Keyset, the raw version</span><span class="v"><code>WHERE ("createdAt","id") &lt; ($1,$2) ORDER BY … LIMIT 20</code> is the same idea in SQL, and works when the cursor is not a primary key. Prisma's <code>cursor</code> requires a unique field; row-value comparison does not.</span></div>
</div>

<h3>3. <code>count()</code> is a sequential scan</h3>
<pre><code><span class="tok-comment">// "1,247,891 posts" in the header</span>
const tong = await prisma.socialPost.count();</code></pre>
<div class="out">EXPLAIN ANALYZE SELECT count(*) FROM "SocialPost";

 Finalize Aggregate  (cost=…) (actual time=1204.8..1204.8 rows=1)
   ->  Gather  (workers planned=2, launched=2)
         ->  Partial Aggregate
               ->  Parallel Seq Scan on "SocialPost"  (rows=519954)
 Execution Time: 1206.402 ms</div>
<pre><code><span class="tok-comment">-- The approximation the planner already keeps</span>
SELECT reltuples::bigint AS uoc_luong
FROM pg_class
WHERE oid = '"SocialPost"'::regclass;</code></pre>
<div class="out">  uoc_luong
-------------
     1247104

Execution Time: 0.118 ms   (10,000x faster, 0.06% off)</div>
<pre><code><span class="tok-comment">// In Prisma, through a typed raw query</span>
const [{ uoc_luong }] = await prisma.$queryRaw&lt;{ uoc_luong: bigint }[]&gt;&#96;
  SELECT reltuples::bigint AS uoc_luong
  FROM pg_class WHERE oid = '"SocialPost"'::regclass&#96;;</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Exact count, small filtered set</span><span class="lz-lnote"><code>count()</code> with a <code>where</code> that an index covers is fine — it counts index entries, not table rows. "How many unread notifications does this user have" is a cheap count.</span></div>
  <div class="lz-layer"><span class="lz-lname">Exact count, whole table</span><span class="lz-lnote">Always a full scan, always linear. If a human is reading the number, they cannot tell 1,247,891 from "about 1.2 million" — so do not pay a second of database time for the last three digits.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>reltuples</code> caveat</span><span class="lz-lnote">It is updated by <code>ANALYZE</code> and autovacuum, so it lags after a bulk load. On a table with normal write traffic it is within a fraction of a percent; after inserting a million rows in a batch job, run <code>ANALYZE</code> or the number stays stale.</span></div>
  <div class="lz-layer"><span class="lz-lname">"Has more pages" without counting</span><span class="lz-lnote">Ask for <code>take: 21</code> and show 20. If you got 21, there is a next page. That answers the only question the UI actually has, and it costs one extra row.</span></div>
</div>

<h3>4. Batch the writes</h3>
<pre><code><span class="tok-comment">// A loop of awaits: 500 round trips</span>
for (const d of duLieu) {
  await prisma.notification.create({ data: d });
}</code></pre>
<pre><code><span class="tok-comment">// createMany: one statement</span>
await prisma.notification.createMany({ data: duLieu, skipDuplicates: true });

<span class="tok-comment">// $transaction with an array: one round trip, one transaction,</span>
<span class="tok-comment">// for operations that createMany cannot express</span>
await prisma.$transaction(
  duLieu.map((d) =&gt; prisma.notification.upsert({
    where: { uk_thong_bao: { userId: d.userId, key: d.key } },
    create: d,
    update: { seenAt: null },
  })),
);</code></pre>
<div class="out">500 x await create        →  4,812 ms   (500 round trips, 500 transactions)
$transaction([...500])    →    611 ms   (1 round trip, 1 transaction)
createMany(500)           →     38 ms   (1 statement)

Same 500 rows. 127x between the ends.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>createMany</code> — the fastest, the most limited</span><span class="v">One <code>INSERT … VALUES (…),(…),(…)</code>. It cannot write nested relations and, on databases other than PostgreSQL and CockroachDB, it does not return the created rows. <code>createManyAndReturn</code> (Prisma 5.14+) does return them on PostgreSQL.</span></div>
  <div class="kv"><span class="k"><code>$transaction([...])</code> — the general batch</span><span class="v">Any list of operations, sent together, all-or-nothing. It is not a loop of awaits with a transaction around it: the whole array goes out in one round trip, which is where most of the 8x comes from.</span></div>
  <div class="kv"><span class="k">Chunk very large batches</span><span class="v">PostgreSQL's protocol caps a statement at 65,535 bind parameters. Ten columns means about 6,500 rows per <code>createMany</code>. Chunk at 1,000 — it is comfortably inside the limit and keeps each statement short enough not to block other work.</span></div>
  <div class="kv"><span class="k">Do not wrap a batch in an interactive transaction</span><span class="v">A <code>$transaction(async (tx) =&gt; …)</code> holding 500 writes keeps one connection and one write lock for the whole duration — Lesson 7.1. The array form is over in one round trip.</span></div>
</div>

<h3>5. The cache, and the only honest invalidation rule</h3>
<pre><code><span class="tok-comment">// Read-through: ask the cache, fall back to Prisma, store the answer</span>
async function layHoSo(userId: string) {
  const khoa = &#96;ho-so:\${userId}&#96;;
  const daCo = await redis.get(khoa);
  if (daCo) return JSON.parse(daCo);

  const hoSo = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, avatarUrl: true, bio: true },
  });
  if (hoSo) await redis.set(khoa, JSON.stringify(hoSo), 'EX', 300);
  return hoSo;
}</code></pre>
<pre><code><span class="tok-comment">// Every write path must delete the key. Every one.</span>
async function capNhatHoSo(userId: string, data: CapNhatHoSo) {
  const hoSo = await prisma.user.update({ where: { id: userId }, data });
  await redis.del(&#96;ho-so:\${userId}&#96;);      <span class="tok-comment">// delete, do not overwrite</span>
  return hoSo;
}</code></pre>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Read</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cache hit</span><span class="lz-nsub">0.2 ms, no connection taken from the pool</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cache miss</span><span class="lz-nsub">Prisma query, then store with a TTL</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Write</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Update the row</span><span class="lz-nsub">Prisma, inside its transaction</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Delete the key</span><span class="lz-nsub">Never write the new value — see below</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Backstop</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">TTL</span><span class="lz-nsub">Every key expires, so a missed invalidation is wrong for minutes, not forever</span></div></div>
  </div>
</div>
<div class="callout warn">
<p><strong>Delete the key, do not write the new value into it.</strong> Two concurrent updates that each write their own value into the cache can land in the opposite order from the two database writes, and the cache ends up holding the value that lost. Deleting has no such race: whoever reads next reloads from the database, which is the single source of truth. This is the whole argument, and it is why "cache-aside with delete" beats "write-through" for anything you did not carefully design.</p>
</div>
<div class="pitfall">
<p><strong>Trap — a cache without a TTL is a second database you do not back up.</strong> Every invalidation path you forget becomes permanently wrong data. A TTL turns "forever wrong" into "wrong for five minutes", which is the difference between a bug report and an outage. Set one on every key, including the ones you are certain you invalidate correctly — you are not certain.</p>
</div>
<div class="note-ct">
<p><strong>CuongThai, in practice.</strong> The feed does not cache post rows: they change (edits, likes, comment counts) more often than they are read twice, so the cache would mostly serve misses and stale counts. What is cached is what is read constantly and changes rarely — the profile card, the category list, the course tree. That is the actual rule: cache what is <em>read many times per write</em>, and measure that ratio before writing a cache rather than after debugging one.</p>
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
<pre><code><span class="tok-comment">// Danh sách feed. Nó THẬT SỰ vẽ ra cái gì?</span>
const posts = await prisma.socialPost.findMany({
  where: { deletedAt: null },
  include: { author: true },
  take: 20,
});</code></pre>
<pre><code><span class="tok-comment">-- Thứ nó gửi qua đường dây, cho MỖI hàng</span>
SELECT "id","content","mediaUrls","metadata","createdAt","updatedAt",
       "authorId","deletedAt","editedAt","pinnedAt", …           <span class="tok-comment">-- mọi cột</span>
<span class="tok-comment">-- cộng MỌI cột của "User", kể cả "passwordHash" và "email"</span></code></pre>
<pre><code><span class="tok-comment">// Cùng danh sách đó, chỉ xin thứ cái thẻ hiển thị</span>
const posts = await prisma.socialPost.findMany({
  where: { deletedAt: null },
  select: {
    id: true,
    content: true,
    createdAt: true,
    author: { select: { id: true, username: true, avatarUrl: true } },
    _count: { select: { comments: true, likes: true } },
  },
  take: 20,
});</code></pre>
<div class="out">include: true   → 20 hang,  412 KB truyen,  31.4 ms
select: {...}   → 20 hang,   47 KB truyen,   6.9 ms

(365 KB chenh lech chu yeu la JSON "metadata" va nhung cot khong dung
 cua tac gia — it hon 8,8 lan du lieu, nhanh hon 4,5 lan)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Byte</span><span class="lz-t">Tuần tự hoá hai lượt</span><span class="lz-d">PostgreSQL dựng hàng, giao thức đường dây mã hoá nó, engine giải mã, rồi client biến nó thành object JavaScript. Một cột bạn không dùng phải trả cái giá đó BỐN lần.</span></div>
  <div class="lz-step"><span class="lz-k">TOAST</span><span class="lz-t">Cú đọc ẩn</span><span class="lz-d">Một giá trị <code>text</code> hay <code>jsonb</code> lớn nằm ngoài dòng, trong bảng TOAST. Chọn nó là thêm một lần đọc cho mỗi hàng mà chỉ mục không cứu được. Không chọn nó là bỏ hẳn lần đọc đó.</span></div>
  <div class="lz-step"><span class="lz-k">Bảo mật</span><span class="lz-t">Lý do THẬT</span><span class="lz-d"><code>include: { author: true }</code> kéo <code>passwordHash</code>, <code>email</code>, <code>resetToken</code> vào tiến trình của bạn — và chỉ cách trình duyệt đúng một dòng <code>res.json(posts)</code>. <code>select</code> biến việc rò một trường thành một hành động CỐ Ý.</span></div>
  <div class="lz-step"><span class="lz-k">Thói quen</span><span class="lz-t">Mặc định là <code>select</code></span><span class="lz-d">Viết <code>select</code> cho mọi endpoint danh sách ngay từ đầu. <code>include</code> dành cho trang chi tiết, chỗ bạn thật sự muốn cả object — và ngay cả ở đó, liệt kê trường ra vẫn đáng.</span></div>
</div>
<div class="callout ok">
<p><strong><code>omit</code> là chiều ngược lại, có từ Prisma 5.16.</strong> <code>omit: { passwordHash: true }</code> trong cấu hình toàn cục của client gỡ một trường khỏi MỌI truy vấn, ở MỌI chỗ, vĩnh viễn. Đó là công cụ đúng cho bí mật — một danh sách cấm không thể quên — còn <code>select</code> vẫn là công cụ đúng cho kích thước gói tin. Dùng cả hai: <code>omit</code> toàn cục cho những trường không bao giờ được đi, <code>select</code> theo từng truy vấn cho những trường endpoint này không cần.</p>
</div>

<h3>2. Phân trang bằng offset chết ở trang 500</h3>
<pre><code><span class="tok-comment">// Cách phân trang ai cũng nghĩ ra đầu tiên</span>
const trang = await prisma.socialPost.findMany({
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * 20,
  take: 20,
});</code></pre>
<pre><code><span class="tok-comment"># Cùng một truy vấn, bốn số trang. Bảng 1,2 triệu hàng.</span>
EXPLAIN ANALYZE SELECT * FROM "SocialPost" ORDER BY "createdAt" DESC OFFSET %n% LIMIT 20;</code></pre>
<div class="out">OFFSET     0  → Limit … actual time=0.031..0.412 rows=20  loops=1     0.5 ms
OFFSET   200  → Limit … actual time=0.028..2.104 rows=20  loops=1     2.2 ms
OFFSET 10000  → Limit … actual time=0.026..94.31 rows=20  loops=1    94.6 ms
OFFSET 200000 → Limit … actual time=0.031..1873. rows=20  loops=1  1874.2 ms</div>
<div class="pitfall">
<p><strong>Bẫy — <code>OFFSET n</code> ĐỌC rồi VỨT ĐI <code>n</code> hàng.</strong> Cơ sở dữ liệu không có cách nào nhảy thẳng tới hàng thứ 200.000 của một kết quả đã sắp xếp; nó sinh ra chúng theo thứ tự rồi bỏ 200.000 cái đầu. Chi phí tuyến tính theo số trang, nên cái trang không ai vào lại chính là cái giữ một kết nối suốt hai giây. Tệ hơn, nó KHÔNG ỔN ĐỊNH: một hàng chèn vào trong lúc người dùng đang lật trang sẽ đẩy mọi thứ xuống, nên họ thấy một hàng hai lần và không bao giờ thấy một hàng khác.</p>
</div>
<pre><code><span class="tok-comment">// Phân trang bằng con trỏ — chi phí hằng số, và ổn định</span>
const trang = await prisma.socialPost.findMany({
  orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],   <span class="tok-comment">// phá hoà: createdAt không duy nhất</span>
  cursor: cursorId ? { id: cursorId } : undefined,
  skip: cursorId ? 1 : 0,                             <span class="tok-comment">// bỏ chính hàng con trỏ</span>
  take: 20,
});
const tiepTheo = trang.length === 20 ? trang[19].id : null;</code></pre>
<div class="out">con tro o hang      0  →  0.5 ms
con tro o hang  10000  →  0.6 ms
con tro o hang 200000  →  0.5 ms

(chi muc nhay THANG toi con tro; so trang khong lien quan)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">LUÔN phá hoà bằng một cột duy nhất</span><span class="v">Riêng <code>orderBy: { createdAt: 'desc' }</code> là nhập nhằng khi hai bài trùng dấu thời gian — cơ sở dữ liệu có thể xếp chúng khác nhau giữa hai lời gọi, và một con trỏ đi vào thứ tự nhập nhằng thì bỏ sót hoặc lặp hàng. Thêm <code>{ id: 'desc' }</code>.</span></div>
  <div class="kv"><span class="k">Đánh chỉ mục theo đúng thứ tự sắp xếp</span><span class="v">Con trỏ chỉ nhanh nếu <code>@@index([createdAt(sort: Desc), id(sort: Desc)])</code> tồn tại. Không có nó thì kế hoạch là sắp xếp cả bảng, và con trỏ chẳng mua được gì.</span></div>
  <div class="kv"><span class="k">Cái giá: không còn số trang</span><span class="v">Con trỏ cho "kế tiếp" và "trước đó", không cho "nhảy tới trang 500". Với một feed, một khung chat, một nhật ký hoạt động, thế là chính xác. Với bảng quản trị nơi con người muốn số trang, cứ giữ offset — những bảng đó nhỏ và không ai lật tới 200.000.</span></div>
  <div class="kv"><span class="k">Keyset, bản thô</span><span class="v"><code>WHERE ("createdAt","id") &lt; ($1,$2) ORDER BY … LIMIT 20</code> là cùng một ý tưởng viết bằng SQL, và dùng được cả khi con trỏ không phải khoá chính. <code>cursor</code> của Prisma đòi một trường duy nhất; so sánh bộ-giá-trị thì không.</span></div>
</div>

<h3>3. <code>count()</code> là một cú quét tuần tự</h3>
<pre><code><span class="tok-comment">// "1.247.891 bài viết" trên đầu trang</span>
const tong = await prisma.socialPost.count();</code></pre>
<div class="out">EXPLAIN ANALYZE SELECT count(*) FROM "SocialPost";

 Finalize Aggregate  (cost=…) (actual time=1204.8..1204.8 rows=1)
   ->  Gather  (workers planned=2, launched=2)
         ->  Partial Aggregate
               ->  Parallel Seq Scan on "SocialPost"  (rows=519954)
 Execution Time: 1206.402 ms</div>
<pre><code><span class="tok-comment">-- Con số xấp xỉ mà bộ lập kế hoạch VỐN ĐÃ giữ sẵn</span>
SELECT reltuples::bigint AS uoc_luong
FROM pg_class
WHERE oid = '"SocialPost"'::regclass;</code></pre>
<div class="out">  uoc_luong
-------------
     1247104

Execution Time: 0.118 ms   (nhanh hon 10.000 lan, lech 0,06%)</div>
<pre><code><span class="tok-comment">// Trong Prisma, qua một truy vấn thô có kiểu</span>
const [{ uoc_luong }] = await prisma.$queryRaw&lt;{ uoc_luong: bigint }[]&gt;&#96;
  SELECT reltuples::bigint AS uoc_luong
  FROM pg_class WHERE oid = '"SocialPost"'::regclass&#96;;</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đếm chính xác, tập đã lọc nhỏ</span><span class="lz-lnote"><code>count()</code> kèm <code>where</code> mà chỉ mục phủ được thì hoàn toàn ổn — nó đếm mục chỉ mục, không đếm hàng trong bảng. "Người này có bao nhiêu thông báo chưa đọc" là một phép đếm rẻ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đếm chính xác, cả bảng</span><span class="lz-lnote">Luôn là quét toàn bộ, luôn tuyến tính. Nếu con người đọc con số đó, họ không phân biệt nổi 1.247.891 với "khoảng 1,2 triệu" — nên đừng trả một giây thời gian cơ sở dữ liệu để lấy ba chữ số cuối.</span></div>
  <div class="lz-layer"><span class="lz-lname">Điều cần lưu ý ở <code>reltuples</code></span><span class="lz-lnote">Nó do <code>ANALYZE</code> và autovacuum cập nhật, nên nó trễ sau một lần nạp hàng loạt. Trên một bảng có lưu lượng ghi bình thường, nó lệch trong phần nhỏ của một phần trăm; sau khi chèn một triệu hàng bằng job, chạy <code>ANALYZE</code> nếu không con số cứ cũ mãi.</span></div>
  <div class="lz-layer"><span class="lz-lname">"Còn trang nữa không" mà không đếm</span><span class="lz-lnote">Xin <code>take: 21</code> và hiển thị 20. Nếu nhận được 21 thì còn trang sau. Nó trả lời đúng câu hỏi DUY NHẤT mà giao diện thật sự có, và tốn thêm đúng một hàng.</span></div>
</div>

<h3>4. Gộp các lệnh ghi</h3>
<pre><code><span class="tok-comment">// Vòng lặp await: 500 lượt đi về</span>
for (const d of duLieu) {
  await prisma.notification.create({ data: d });
}</code></pre>
<pre><code><span class="tok-comment">// createMany: một câu lệnh</span>
await prisma.notification.createMany({ data: duLieu, skipDuplicates: true });

<span class="tok-comment">// $transaction dạng mảng: một lượt đi về, một giao dịch,</span>
<span class="tok-comment">// cho những thao tác mà createMany không diễn đạt nổi</span>
await prisma.$transaction(
  duLieu.map((d) =&gt; prisma.notification.upsert({
    where: { uk_thong_bao: { userId: d.userId, key: d.key } },
    create: d,
    update: { seenAt: null },
  })),
);</code></pre>
<div class="out">500 x await create        →  4.812 ms   (500 luot di ve, 500 giao dich)
$transaction([...500])    →    611 ms   (1 luot di ve, 1 giao dich)
createMany(500)           →     38 ms   (1 cau lenh)

Cung 500 hang. Chenh 127 lan giua hai dau.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>createMany</code> — nhanh nhất, hạn chế nhất</span><span class="v">Một câu <code>INSERT … VALUES (…),(…),(…)</code>. Nó không ghi được quan hệ lồng nhau và, trên cơ sở dữ liệu khác PostgreSQL và CockroachDB, nó không trả về hàng vừa tạo. <code>createManyAndReturn</code> (Prisma 5.14+) thì có trả, trên PostgreSQL.</span></div>
  <div class="kv"><span class="k"><code>$transaction([...])</code> — lô hàng tổng quát</span><span class="v">Bất kỳ danh sách thao tác nào, gửi cùng nhau, được ăn cả ngã về không. Nó KHÔNG phải một vòng lặp await bọc trong giao dịch: cả mảng đi ra trong MỘT lượt đi về, và đó là chỗ phần lớn con số 8 lần đến từ.</span></div>
  <div class="kv"><span class="k">Chia nhỏ những lô rất lớn</span><span class="v">Giao thức của PostgreSQL chặn một câu lệnh ở 65.535 tham số ràng buộc. Mười cột nghĩa là khoảng 6.500 hàng mỗi <code>createMany</code>. Chia lô 1.000 — nằm thoải mái trong giới hạn và giữ mỗi câu lệnh đủ ngắn để không chặn việc khác.</span></div>
  <div class="kv"><span class="k">Đừng bọc một lô trong giao dịch tương tác</span><span class="v">Một <code>$transaction(async (tx) =&gt; …)</code> ôm 500 lệnh ghi giữ một kết nối và một khoá ghi suốt cả quãng đó — Bài 7.1. Dạng mảng thì xong trong một lượt đi về.</span></div>
</div>

<h3>5. Cache, và luật vô hiệu hoá trung thực DUY NHẤT</h3>
<pre><code><span class="tok-comment">// Đọc xuyên qua: hỏi cache, hụt thì hỏi Prisma, rồi cất câu trả lời</span>
async function layHoSo(userId: string) {
  const khoa = &#96;ho-so:\${userId}&#96;;
  const daCo = await redis.get(khoa);
  if (daCo) return JSON.parse(daCo);

  const hoSo = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, avatarUrl: true, bio: true },
  });
  if (hoSo) await redis.set(khoa, JSON.stringify(hoSo), 'EX', 300);
  return hoSo;
}</code></pre>
<pre><code><span class="tok-comment">// MỌI đường ghi phải XOÁ khoá. Mọi đường.</span>
async function capNhatHoSo(userId: string, data: CapNhatHoSo) {
  const hoSo = await prisma.user.update({ where: { id: userId }, data });
  await redis.del(&#96;ho-so:\${userId}&#96;);      <span class="tok-comment">// XOÁ, đừng ghi đè</span>
  return hoSo;
}</code></pre>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Đọc</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Trúng cache</span><span class="lz-nsub">0,2 ms, không lấy kết nối nào khỏi pool</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Hụt cache</span><span class="lz-nsub">Truy vấn Prisma, rồi cất kèm TTL</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Ghi</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cập nhật hàng</span><span class="lz-nsub">Prisma, bên trong giao dịch của nó</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Xoá khoá</span><span class="lz-nsub">ĐỪNG BAO GIỜ ghi giá trị mới — xem dưới</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Lưới đỡ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">TTL</span><span class="lz-nsub">Mọi khoá đều hết hạn, nên một lần quên vô hiệu hoá chỉ sai trong vài phút, không sai mãi mãi</span></div></div>
  </div>
</div>
<div class="callout warn">
<p><strong>XOÁ khoá, đừng ghi giá trị mới vào nó.</strong> Hai lần cập nhật song song, mỗi lần tự ghi giá trị của mình vào cache, có thể rơi xuống theo thứ tự NGƯỢC với hai lần ghi cơ sở dữ liệu, và cache đọng lại đúng cái giá trị đã thua. Xoá thì không có cuộc đua đó: ai đọc kế tiếp sẽ nạp lại từ cơ sở dữ liệu, nơi là nguồn sự thật duy nhất. Đó là toàn bộ lập luận, và đó là lý do "cache-aside kèm xoá" thắng "write-through" với bất cứ thứ gì bạn chưa thiết kế thật cẩn thận.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — một cache không có TTL là một cơ sở dữ liệu THỨ HAI mà bạn không sao lưu.</strong> Mỗi đường vô hiệu hoá bạn quên sẽ thành dữ liệu sai VĨNH VIỄN. TTL biến "sai mãi mãi" thành "sai trong năm phút", và đó là khoảng cách giữa một phiếu báo lỗi với một sự cố ngừng dịch vụ. Đặt TTL cho mọi khoá, kể cả những khoá bạn chắc chắn là mình vô hiệu hoá đúng — bạn không chắc chắn đâu.</p>
</div>
<div class="note-ct">
<p><strong>CuongThai, trong thực tế.</strong> Feed KHÔNG cache hàng bài viết: chúng đổi (sửa bài, lượt thích, số bình luận) thường xuyên hơn mức được đọc tới lần thứ hai, nên cache sẽ chủ yếu phục vụ những cú hụt và những con số đếm cũ. Thứ được cache là thứ đọc liên tục mà hiếm khi đổi — thẻ hồ sơ, danh sách danh mục, cây khoá học. Đó mới là luật thật: cache thứ được <em>đọc nhiều lần cho mỗi lần ghi</em>, và ĐO cái tỉ lệ đó trước khi viết cache, chứ không phải sau khi ngồi gỡ lỗi cho nó.</p>
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
              'A nested include that fans out one query per parent row|||Một include lồng nhau nở ra một truy vấn cho mỗi hàng cha',
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
            question: 'In the chapter benchmark, connection_limit=200 against an 8-core database was 30% slower than connection_limit=10. Why?|||Trong phép đo của chương, connection_limit=200 trên một database 8 nhân CHẬM hơn connection_limit=10 tới 30%. Vì sao?',
            options: [
              'Prisma has a bug above 128 connections|||Prisma có lỗi khi vượt quá 128 kết nối',
              'The pool itself consumes CPU proportional to its size|||Bản thân cái pool tiêu tốn CPU tỉ lệ với kích thước của nó',
              'Two hundred concurrent queries on eight cores means constant context switching and lock contention; queueing in the pool keeps the server in its efficient range|||Hai trăm truy vấn song song trên tám nhân nghĩa là chuyển ngữ cảnh liên tục và tranh khoá; xếp hàng trong pool giữ máy chủ ở vùng chạy hiệu quả',
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
