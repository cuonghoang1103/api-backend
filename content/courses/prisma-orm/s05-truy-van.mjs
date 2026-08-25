/**
 * Prisma ORM — Chương 5: Truy vấn sâu.
 * Bộ lọc vô hướng · lọc theo quan hệ và logic · sắp xếp · phân trang offset với con trỏ · tổng hợp và groupBy · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 5 — Querying deeply|||Chương 5 — Truy vấn sâu',
  description: 'Mọi thứ nằm giữa where và kết quả: đủ bộ toán tử lọc cho từng kiểu, some/every/none và AND/OR/NOT, sắp xếp theo quan hệ và theo nulls, vì sao skip chết ở trang 5000 còn con trỏ thì không, và aggregate với groupBy làm được gì mà không cần rời client.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — Every filter operator|||5.1 — Đủ mọi toán tử lọc',
      slug: 'pr-5-1-toan-tu-loc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Toán tử lọc theo từng kiểu: so sánh cho số và ngày, contains/startsWith và mode insensitive, in/notIn, has/hasEvery cho mảng, lọc theo đường dẫn JSON — kèm cảnh báo chỉ mục cho từng cái, vì phần lớn chúng không dùng được B-tree.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Every filter operator</h2>
<p class="lead">The <code>where</code> argument is a small language, and it is worth learning completely because half of it compiles to SQL that no ordinary index can serve. Each operator below comes with the SQL it produces and a note on whether an index helps — which is the information you actually need when the page gets slow.</p>

<h3>Equality, and the null that is not null</h3>
<pre><code>where: { published: true }                    <span class="tok-comment">// = $1</span>
where: { published: { equals: true } }        <span class="tok-comment">// identical, more explicit</span>
where: { published: { not: true } }           <span class="tok-comment">// &lt;&gt; $1  — and see the warning</span>
where: { deletedAt: null }                    <span class="tok-comment">// IS NULL</span>
where: { deletedAt: { not: null } }           <span class="tok-comment">// IS NOT NULL</span></code></pre>
<div class="out">SELECT ... WHERE "posts"."published" = $1
SELECT ... WHERE "posts"."published" &lt;&gt; $1
SELECT ... WHERE "posts"."deleted_at" IS NULL</div>
<div class="pitfall">
<p><strong>Trap — <code>{ not: true }</code> does not include NULL rows.</strong> In SQL, <code>NULL &lt;&gt; true</code> evaluates to <code>NULL</code>, which is not <code>TRUE</code>, so the row is excluded. A nullable <code>published</code> column filtered with <code>{ not: true }</code> silently drops every row where it was never set. If you mean "false or unset", say so: <code>{ OR: [{ published: false }, { published: null }] }</code>. This is standard three-valued logic and it catches everyone once.</p>
</div>

<h3>Comparison — numbers, dates, strings</h3>
<pre><code>where: { views: { gt: 100 } }                        <span class="tok-comment">// &gt;</span>
where: { views: { gte: 100, lte: 500 } }             <span class="tok-comment">// BETWEEN, effectively</span>
where: { createdAt: { gte: new Date('2026-01-01') } }
where: { title: { gt: 'M' } }                        <span class="tok-comment">// collation order, rarely what you want</span></code></pre>
<div class="out">SELECT ... WHERE ("posts"."views" &gt;= $1 AND "posts"."views" &lt;= $2)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Index: yes, and this is the good case</span><span class="v">A B-tree serves range scans directly. <code>@@index([views])</code> makes <code>views &gt; 100</code> an index range scan instead of a sequential one — provided the range is selective enough that the planner prefers it.</span></div>
  <div class="kv"><span class="k">Composite order still matters</span><span class="v"><code>@@index([published, views])</code> serves <code>WHERE published = true AND views &gt; 100</code>. Reversed, it does not. Equality columns first, the range column last — Lesson 2.3.</span></div>
  <div class="kv"><span class="k">Dates are just ordered values</span><span class="v">A date range is a B-tree range scan like any other. The common mistake is comparing a <code>Timestamptz</code> against a locally-constructed <code>Date</code> without thinking about zones — Lesson 2.4.</span></div>
</div>

<h3>Strings — and the operator that ignores your index</h3>
<pre><code>where: { title: { contains:   'prisma' } }    <span class="tok-comment">// LIKE '%prisma%'</span>
where: { title: { startsWith: 'Huong' } }     <span class="tok-comment">// LIKE 'Huong%'</span>
where: { title: { endsWith:   '.md' } }       <span class="tok-comment">// LIKE '%.md'</span>
where: { title: { contains: 'prisma', mode: 'insensitive' } }  <span class="tok-comment">// ILIKE</span></code></pre>
<div class="out">-- contains
SELECT ... WHERE "posts"."title"::text LIKE $1        -- params: ["%prisma%"]
-- startsWith
SELECT ... WHERE "posts"."title"::text LIKE $1        -- params: ["Huong%"]
-- insensitive
SELECT ... WHERE "posts"."title"::text ILIKE $1       -- params: ["%prisma%"]</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">startsWith</span><span class="lz-t">Index: YES</span><span class="lz-d"><code>LIKE 'Huong%'</code> has no leading wildcard, so a B-tree range scan works — but only with the C collation or a <code>text_pattern_ops</code> index. On a normal locale-aware index PostgreSQL cannot use it, which surprises people.</span></div>
  <div class="lz-step"><span class="lz-k">contains / endsWith</span><span class="lz-t">Index: NO</span><span class="lz-d">A leading <code>%</code> means every row must be examined. On 400,000 rows this is a sequential scan every time. It is the single most common cause of "the search box is slow".</span></div>
  <div class="lz-step"><span class="lz-k">mode: insensitive</span><span class="lz-t">Index: NO, and worse</span><span class="lz-d"><code>ILIKE</code> defeats an ordinary index entirely. The fix is a functional index on <code>lower(col)</code> plus a <code>lower()</code> comparison in raw SQL, or the <code>citext</code> type.</span></div>
  <div class="lz-step"><span class="lz-k">The real fix</span><span class="lz-t">pg_trgm</span><span class="lz-d">A GIN trigram index makes <code>LIKE '%…%'</code> and <code>ILIKE</code> index-backed. Two lines in a hand-written migration, and it is what the CuongThai post search uses.</span></div>
</div>
<pre><code><span class="tok-comment">-- The migration that makes &#96;contains&#96; fast</span>
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "posts_title_trgm_idx" ON "posts" USING gin ("title" gin_trgm_ops);</code></pre>
<pre><code>EXPLAIN ANALYZE SELECT * FROM posts WHERE title ILIKE '%prisma%';</code></pre>
<div class="out">-- before the index
Seq Scan on posts  (cost=0.00..12842.00 rows=41 width=97) (actual time=0.4..184.2 rows=38 loops=1)
Execution Time: 184.377 ms

-- after the index
Bitmap Heap Scan on posts  (cost=52.03..188.41 rows=41 width=97) (actual time=0.9..2.1 rows=38 loops=1)
  -&gt;  Bitmap Index Scan on posts_title_trgm_idx  (cost=0.00..52.02 rows=41 width=0)
Execution Time: 2.203 ms</div>
<p>Eighty-four times faster, and the Prisma code did not change at all. That is the shape of most Prisma performance work: the query was fine, the schema was missing something.</p>

<h3>Lists and sets</h3>
<pre><code>where: { id:     { in:    [1, 2, 3] } }        <span class="tok-comment">// IN ($1,$2,$3)</span>
where: { id:     { notIn: [1, 2, 3] } }        <span class="tok-comment">// NOT IN</span>
where: { status: { in: ['MOI', 'DANG_XU_LY'] } }

<span class="tok-comment">// Array columns (PostgreSQL String[])</span>
where: { tags: { has:      'prisma' } }        <span class="tok-comment">// $1 = ANY(tags)</span>
where: { tags: { hasEvery: ['a', 'b'] } }      <span class="tok-comment">// tags @&gt; ARRAY[...]</span>
where: { tags: { hasSome:  ['a', 'b'] } }      <span class="tok-comment">// tags &amp;&amp; ARRAY[...]</span>
where: { tags: { isEmpty:  true } }            <span class="tok-comment">// array_length IS NULL</span></code></pre>
<div class="out">SELECT ... WHERE "posts"."tags" @&gt; $1        -- params: [["a","b"]]</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>in</code> with an empty array matches nothing</span><span class="v"><code>{ id: { in: [] } }</code> becomes <code>WHERE 1=0</code>. Correct, and a common source of "my filter returns zero rows" when the array came from a <code>.map()</code> over an empty list. Check before you filter.</span></div>
  <div class="kv"><span class="k"><code>notIn</code> and NULL</span><span class="v">Same three-valued-logic trap as <code>not</code>: <code>NOT IN</code> excludes NULL rows. If the column is nullable, add the NULL case explicitly.</span></div>
  <div class="kv"><span class="k">Array operators need GIN</span><span class="v"><code>@@index([tags], type: Gin)</code>. Without it, <code>has</code> and <code>hasEvery</code> are sequential scans — the array containment operators cannot use a B-tree at all.</span></div>
  <div class="kv"><span class="k">A long <code>in</code> list is not free</span><span class="v">Ten thousand ids in an <code>IN</code> clause is ten thousand bind parameters, and PostgreSQL caps a statement at 65,535. Past a few hundred, a temporary table or a join is faster and safer.</span></div>
</div>

<h3>JSON columns</h3>
<pre><code>where: { settings: { path: ['theme'],           equals: 'toi' } }
where: { settings: { path: ['notify', 'email'], equals: true  } }
where: { settings: { path: ['tags'],            array_contains: ['vip'] } }
where: { settings: { string_contains: 'dark' } }</code></pre>
<div class="out">SELECT ... WHERE ("posts"."settings"#&gt;$1) = $2      -- params: [["theme"], "\\"toi\\""]</div>
<div class="callout warn">
<p><strong>JSON filters are sequential scans unless you build the index yourself.</strong> Prisma cannot declare an index on a JSON path, so a filter on <code>settings.theme</code> examines every row. The fix is a hand-written expression index, and it must match the query exactly — including the operator. If you find yourself indexing three different JSON paths, that is the database telling you those should have been columns.</p>
</div>
<pre><code><span class="tok-comment">-- Index one specific path</span>
CREATE INDEX "users_theme_idx" ON "users" ((settings-&gt;&gt;'theme'));

<span class="tok-comment">-- Or index the whole document for containment queries</span>
CREATE INDEX "users_settings_gin" ON "users" USING gin (settings jsonb_path_ops);</code></pre>

<h3>Combining conditions</h3>
<pre><code><span class="tok-comment">// Sibling keys are ANDed implicitly</span>
where: { published: true, views: { gt: 100 } }

<span class="tok-comment">// Explicit boolean structure, nestable to any depth</span>
where: {
  AND: [
    { published: true },
    { OR: [{ views: { gt: 1000 } }, { featured: true }] },
    { NOT: { authorId: { in: bannedIds } } },
  ],
}</code></pre>
<div class="out">SELECT ... WHERE ("posts"."published" = $1
  AND ("posts"."views" &gt; $2 OR "posts"."featured" = $3)
  AND NOT ("posts"."author_id" IN ($4,$5)))</div>
<pre><code><span class="tok-comment">// Building a filter from optional request parameters</span>
const where: Prisma.PostWhereInput = {
  published: true,
  ...(q.author  &amp;&amp; { authorId: Number(q.author) }),
  ...(q.search  &amp;&amp; { title: { contains: q.search, mode: 'insensitive' as const } }),
  ...(q.tag     &amp;&amp; { tags: { has: q.tag } }),
  ...(q.from    &amp;&amp; { createdAt: { gte: new Date(q.from) } }),
};

const rows = await prisma.post.findMany({ where, take: 20, orderBy: { createdAt: 'desc' } });</code></pre>
<div class="callout ok">
<p><strong>Spread-if is the idiomatic way to build a dynamic filter.</strong> An <code>undefined</code> value in a <code>where</code> is ignored by Prisma, so <code>{ authorId: undefined }</code> is harmless — but spreading is clearer, keeps the object shape honest, and avoids the one case where it is not harmless: <code>{ id: undefined }</code> passed to <code>findUnique</code> throws rather than matching everything. Typing the object as <code>Prisma.PostWhereInput</code> keeps the whole thing checked.</p>
</div>

<h3>Case-insensitive search, done three ways</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>mode: 'insensitive'</code></span><span class="v">Easiest, and unindexable. Fine on a small table, fine behind a filter that has already narrowed to a few hundred rows, wrong as the primary filter on a large one.</span></div>
  <div class="kv"><span class="k">Store a normalised column</span><span class="v">Add <code>emailLower String @unique</code>, write both, filter on the lower one. Ugly, completely portable, and the fastest of the three because it is a plain B-tree equality.</span></div>
  <div class="kv"><span class="k"><code>@db.Citext</code></span><span class="v">A PostgreSQL type that compares case-insensitively by default. Needs <code>CREATE EXTENSION citext</code>, uses the index normally, and makes the whole problem disappear at the schema level.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">Filtering and sorting</span><span class="lc-sub">prisma.io/docs · The complete operator list per scalar type, with examples</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-client-reference#filter-conditions-and-operators" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Filter conditions — reference</span><span class="lc-sub">prisma.io/docs · Every operator with its exact SQL and provider support</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/pgtrgm.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_trgm</span><span class="lc-sub">postgresql.org · Trigram indexes for LIKE and ILIKE, and how similarity search works</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, index chapter</span><span class="lc-sub">Which operator each index type can serve — the theory behind every warning above</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Write twelve filters from plain-language specs, then check which ones use an index</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Đủ mọi toán tử lọc</h2>
<p class="lead">Tham số <code>where</code> là một ngôn ngữ nhỏ, và nó đáng học cho hết vì một nửa trong đó biên dịch ra thứ SQL mà không chỉ mục thông thường nào phục vụ nổi. Mỗi toán tử dưới đây đi kèm câu SQL nó sinh ra và một ghi chú về chuyện chỉ mục có giúp được không — đó mới là thông tin bạn thật sự cần khi trang bắt đầu chậm.</p>

<h3>So bằng, và cái null không phải null</h3>
<pre><code>where: { published: true }                    <span class="tok-comment">// = $1</span>
where: { published: { equals: true } }        <span class="tok-comment">// y hệt, tường minh hơn</span>
where: { published: { not: true } }           <span class="tok-comment">// &lt;&gt; $1  — và xem lời cảnh báo</span>
where: { deletedAt: null }                    <span class="tok-comment">// IS NULL</span>
where: { deletedAt: { not: null } }           <span class="tok-comment">// IS NOT NULL</span></code></pre>
<div class="out">SELECT ... WHERE "posts"."published" = $1
SELECT ... WHERE "posts"."published" &lt;&gt; $1
SELECT ... WHERE "posts"."deleted_at" IS NULL</div>
<div class="pitfall">
<p><strong>Bẫy — <code>{ not: true }</code> KHÔNG bao gồm các hàng NULL.</strong> Trong SQL, <code>NULL &lt;&gt; true</code> cho ra <code>NULL</code>, mà <code>NULL</code> không phải <code>TRUE</code>, nên hàng đó bị loại. Một cột <code>published</code> cho phép null mà lọc bằng <code>{ not: true }</code> sẽ âm thầm rụng mọi hàng chưa từng được gán. Nếu bạn muốn nói "false hoặc chưa gán" thì hãy nói ra: <code>{ OR: [{ published: false }, { published: null }] }</code>. Đây là logic ba giá trị tiêu chuẩn và nó bẫy ai cũng một lần.</p>
</div>

<h3>So sánh — số, ngày, chuỗi</h3>
<pre><code>where: { views: { gt: 100 } }                        <span class="tok-comment">// &gt;</span>
where: { views: { gte: 100, lte: 500 } }             <span class="tok-comment">// thực chất là BETWEEN</span>
where: { createdAt: { gte: new Date('2026-01-01') } }
where: { title: { gt: 'M' } }                        <span class="tok-comment">// theo thứ tự đối chiếu, hiếm khi đúng ý</span></code></pre>
<div class="out">SELECT ... WHERE ("posts"."views" &gt;= $1 AND "posts"."views" &lt;= $2)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ mục: có, và đây là trường hợp đẹp</span><span class="v">Một cây B-tree phục vụ quét khoảng trực tiếp. <code>@@index([views])</code> biến <code>views &gt; 100</code> thành một lần quét khoảng theo chỉ mục thay vì quét tuần tự — miễn là khoảng ấy đủ chọn lọc để bộ lập kế hoạch chịu dùng.</span></div>
  <div class="kv"><span class="k">Thứ tự trong chỉ mục phức hợp vẫn quan trọng</span><span class="v"><code>@@index([published, views])</code> phục vụ <code>WHERE published = true AND views &gt; 100</code>. Đảo lại thì không. Cột so bằng lên trước, cột khoảng xuống cuối — Bài 2.3.</span></div>
  <div class="kv"><span class="k">Ngày chỉ là giá trị có thứ tự</span><span class="v">Một khoảng ngày là một lần quét khoảng B-tree như mọi khoảng khác. Lỗi phổ biến là so một <code>Timestamptz</code> với một <code>Date</code> dựng ở địa phương mà không nghĩ tới múi giờ — Bài 2.4.</span></div>
</div>

<h3>Chuỗi — và toán tử phớt lờ chỉ mục của bạn</h3>
<pre><code>where: { title: { contains:   'prisma' } }    <span class="tok-comment">// LIKE '%prisma%'</span>
where: { title: { startsWith: 'Huong' } }     <span class="tok-comment">// LIKE 'Huong%'</span>
where: { title: { endsWith:   '.md' } }       <span class="tok-comment">// LIKE '%.md'</span>
where: { title: { contains: 'prisma', mode: 'insensitive' } }  <span class="tok-comment">// ILIKE</span></code></pre>
<div class="out">-- contains
SELECT ... WHERE "posts"."title"::text LIKE $1        -- tham số: ["%prisma%"]
-- startsWith
SELECT ... WHERE "posts"."title"::text LIKE $1        -- tham số: ["Huong%"]
-- insensitive
SELECT ... WHERE "posts"."title"::text ILIKE $1       -- tham số: ["%prisma%"]</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">startsWith</span><span class="lz-t">Chỉ mục: CÓ</span><span class="lz-d"><code>LIKE 'Huong%'</code> không có ký tự đại diện ở đầu, nên quét khoảng B-tree dùng được — nhưng chỉ với đối chiếu C hoặc một chỉ mục <code>text_pattern_ops</code>. Trên một chỉ mục theo locale bình thường thì PostgreSQL không dùng được, và điều đó làm người ta bất ngờ.</span></div>
  <div class="lz-step"><span class="lz-k">contains / endsWith</span><span class="lz-t">Chỉ mục: KHÔNG</span><span class="lz-d">Một dấu <code>%</code> ở đầu nghĩa là mọi hàng đều phải xem xét. Trên 400.000 hàng thì đây là quét tuần tự mỗi lần. Nó là nguyên nhân phổ biến nhất của câu "ô tìm kiếm chậm quá".</span></div>
  <div class="lz-step"><span class="lz-k">mode: insensitive</span><span class="lz-t">Chỉ mục: KHÔNG, và tệ hơn</span><span class="lz-d"><code>ILIKE</code> vô hiệu hoá hẳn một chỉ mục thường. Cách vá là một chỉ mục theo hàm trên <code>lower(col)</code> cộng một phép so <code>lower()</code> trong SQL thô, hoặc dùng kiểu <code>citext</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Cách vá thật</span><span class="lz-t">pg_trgm</span><span class="lz-d">Một chỉ mục trigram GIN khiến <code>LIKE '%…%'</code> và <code>ILIKE</code> được chỉ mục đỡ. Hai dòng trong một migration viết tay, và đó chính là thứ phần tìm bài viết của CuongThai đang dùng.</span></div>
</div>
<pre><code><span class="tok-comment">-- Migration khiến &#96;contains&#96; nhanh lên</span>
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "posts_title_trgm_idx" ON "posts" USING gin ("title" gin_trgm_ops);</code></pre>
<pre><code>EXPLAIN ANALYZE SELECT * FROM posts WHERE title ILIKE '%prisma%';</code></pre>
<div class="out">-- trước khi có chỉ mục
Seq Scan on posts  (cost=0.00..12842.00 rows=41 width=97) (actual time=0.4..184.2 rows=38 loops=1)
Execution Time: 184.377 ms

-- sau khi có chỉ mục
Bitmap Heap Scan on posts  (cost=52.03..188.41 rows=41 width=97) (actual time=0.9..2.1 rows=38 loops=1)
  -&gt;  Bitmap Index Scan on posts_title_trgm_idx  (cost=0.00..52.02 rows=41 width=0)
Execution Time: 2.203 ms</div>
<p>Nhanh gấp tám mươi tư lần, và đoạn mã Prisma không đổi một chữ. Đó là hình dạng của phần lớn công việc tối ưu hiệu năng Prisma: câu truy vấn vốn ổn, chỉ là lược đồ thiếu một thứ.</p>

<h3>Danh sách và tập hợp</h3>
<pre><code>where: { id:     { in:    [1, 2, 3] } }        <span class="tok-comment">// IN ($1,$2,$3)</span>
where: { id:     { notIn: [1, 2, 3] } }        <span class="tok-comment">// NOT IN</span>
where: { status: { in: ['MOI', 'DANG_XU_LY'] } }

<span class="tok-comment">// Cột mảng (String[] của PostgreSQL)</span>
where: { tags: { has:      'prisma' } }        <span class="tok-comment">// $1 = ANY(tags)</span>
where: { tags: { hasEvery: ['a', 'b'] } }      <span class="tok-comment">// tags @&gt; ARRAY[...]</span>
where: { tags: { hasSome:  ['a', 'b'] } }      <span class="tok-comment">// tags &amp;&amp; ARRAY[...]</span>
where: { tags: { isEmpty:  true } }            <span class="tok-comment">// array_length IS NULL</span></code></pre>
<div class="out">SELECT ... WHERE "posts"."tags" @&gt; $1        -- tham số: [["a","b"]]</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>in</code> với mảng rỗng thì khớp không gì cả</span><span class="v"><code>{ id: { in: [] } }</code> thành <code>WHERE 1=0</code>. Đúng, và là nguồn phổ biến của chuyện "bộ lọc của tôi trả về không hàng nào" khi cái mảng đến từ một <code>.map()</code> trên một danh sách rỗng. Hãy kiểm trước khi lọc.</span></div>
  <div class="kv"><span class="k"><code>notIn</code> và NULL</span><span class="v">Cùng cái bẫy logic ba giá trị như <code>not</code>: <code>NOT IN</code> loại các hàng NULL. Nếu cột cho phép null thì hãy thêm trường hợp NULL một cách tường minh.</span></div>
  <div class="kv"><span class="k">Toán tử mảng cần GIN</span><span class="v"><code>@@index([tags], type: Gin)</code>. Không có nó thì <code>has</code> và <code>hasEvery</code> là quét tuần tự — các toán tử chứa-mảng hoàn toàn không dùng được B-tree.</span></div>
  <div class="kv"><span class="k">Một danh sách <code>in</code> dài không miễn phí</span><span class="v">Mười nghìn id trong một mệnh đề <code>IN</code> là mười nghìn tham số ràng buộc, và PostgreSQL giới hạn một câu lệnh ở 65.535. Quá vài trăm thì một bảng tạm hay một phép join sẽ nhanh hơn và an toàn hơn.</span></div>
</div>

<h3>Cột JSON</h3>
<pre><code>where: { settings: { path: ['theme'],           equals: 'toi' } }
where: { settings: { path: ['notify', 'email'], equals: true  } }
where: { settings: { path: ['tags'],            array_contains: ['vip'] } }
where: { settings: { string_contains: 'dark' } }</code></pre>
<div class="out">SELECT ... WHERE ("posts"."settings"#&gt;$1) = $2      -- tham số: [["theme"], "\\"toi\\""]</div>
<div class="callout warn">
<p><strong>Lọc JSON là quét tuần tự trừ khi bạn tự dựng chỉ mục.</strong> Prisma không khai được chỉ mục trên một đường dẫn JSON, nên một bộ lọc trên <code>settings.theme</code> xem xét mọi hàng. Cách vá là một chỉ mục theo biểu thức viết tay, và nó phải khớp câu truy vấn chính xác — kể cả toán tử. Nếu bạn thấy mình đang đánh chỉ mục cho ba đường dẫn JSON khác nhau thì đó là cơ sở dữ liệu đang nói với bạn rằng lẽ ra chúng nên là các cột.</p>
</div>
<pre><code><span class="tok-comment">-- Đánh chỉ mục cho một đường dẫn cụ thể</span>
CREATE INDEX "users_theme_idx" ON "users" ((settings-&gt;&gt;'theme'));

<span class="tok-comment">-- Hoặc đánh chỉ mục cả tài liệu cho các truy vấn kiểm phần tử</span>
CREATE INDEX "users_settings_gin" ON "users" USING gin (settings jsonb_path_ops);</code></pre>

<h3>Kết hợp điều kiện</h3>
<pre><code><span class="tok-comment">// Các khoá cùng cấp được AND ngầm với nhau</span>
where: { published: true, views: { gt: 100 } }

<span class="tok-comment">// Cấu trúc luận lý tường minh, lồng sâu bao nhiêu cũng được</span>
where: {
  AND: [
    { published: true },
    { OR: [{ views: { gt: 1000 } }, { featured: true }] },
    { NOT: { authorId: { in: bannedIds } } },
  ],
}</code></pre>
<div class="out">SELECT ... WHERE ("posts"."published" = $1
  AND ("posts"."views" &gt; $2 OR "posts"."featured" = $3)
  AND NOT ("posts"."author_id" IN ($4,$5)))</div>
<pre><code><span class="tok-comment">// Dựng bộ lọc từ các tham số yêu cầu tuỳ chọn</span>
const where: Prisma.PostWhereInput = {
  published: true,
  ...(q.author  &amp;&amp; { authorId: Number(q.author) }),
  ...(q.search  &amp;&amp; { title: { contains: q.search, mode: 'insensitive' as const } }),
  ...(q.tag     &amp;&amp; { tags: { has: q.tag } }),
  ...(q.from    &amp;&amp; { createdAt: { gte: new Date(q.from) } }),
};

const rows = await prisma.post.findMany({ where, take: 20, orderBy: { createdAt: 'desc' } });</code></pre>
<div class="callout ok">
<p><strong>Trải-nếu-có là cách đúng kiểu để dựng một bộ lọc động.</strong> Một giá trị <code>undefined</code> trong <code>where</code> bị Prisma bỏ qua, nên <code>{ authorId: undefined }</code> vô hại — nhưng trải ra thì rõ ràng hơn, giữ hình dạng đối tượng trung thực, và tránh được đúng một trường hợp mà nó không vô hại: <code>{ id: undefined }</code> truyền vào <code>findUnique</code> sẽ ném lỗi chứ không khớp tất cả. Gán kiểu <code>Prisma.PostWhereInput</code> cho đối tượng ấy giữ cho toàn bộ nó được kiểm.</p>
</div>

<h3>Tìm không phân biệt hoa thường, ba cách</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>mode: 'insensitive'</code></span><span class="v">Dễ nhất, và không đánh chỉ mục được. Ổn trên bảng nhỏ, ổn khi nằm sau một bộ lọc đã thu hẹp xuống vài trăm hàng, sai khi làm bộ lọc chính trên một bảng lớn.</span></div>
  <div class="kv"><span class="k">Lưu một cột đã chuẩn hoá</span><span class="v">Thêm <code>emailLower String @unique</code>, ghi cả hai, lọc trên cái viết thường. Xấu, di động hoàn toàn, và nhanh nhất trong ba cách vì nó là một phép so bằng B-tree thuần.</span></div>
  <div class="kv"><span class="k"><code>@db.Citext</code></span><span class="v">Một kiểu của PostgreSQL mặc định so sánh không phân biệt hoa thường. Cần <code>CREATE EXTENSION citext</code>, dùng chỉ mục bình thường, và làm cả bài toán biến mất ngay ở tầng lược đồ.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">Filtering and sorting</span><span class="lc-sub">prisma.io/docs · Danh sách toán tử đầy đủ theo từng kiểu vô hướng, kèm ví dụ</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-client-reference#filter-conditions-and-operators" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Filter conditions — tra cứu</span><span class="lc-sub">prisma.io/docs · Mọi toán tử kèm SQL chính xác và mức hỗ trợ theo provider</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/pgtrgm.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_trgm</span><span class="lc-sub">postgresql.org · Chỉ mục trigram cho LIKE và ILIKE, và cách tìm theo độ tương tự hoạt động</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương chỉ mục</span><span class="lc-sub">Mỗi loại chỉ mục phục vụ được toán tử nào — phần lý thuyết sau mọi lời cảnh báo ở trên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Viết mười hai bộ lọc từ mô tả bằng lời, rồi kiểm cái nào dùng được chỉ mục</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Filtering by relations|||5.2 — Lọc theo quan hệ',
      slug: 'pr-5-2-loc-quan-he',
      type: 'LESSON',
      description: 'some, every, none và is/isNot — mỗi cái thành SQL nào, vì sao every có một bẫy logic mà ai cũng dính, lọc qua nhiều tầng quan hệ, phân biệt lọc cha với lọc con, và mẫu lọc theo nhiều thẻ cùng lúc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Filtering by relations</h2>
<p class="lead">Filtering a list by something on a related table is where a query builder earns its keep, because the SQL involves a correlated subquery that is easy to get subtly wrong. Prisma gives you four operators for it. Three behave exactly as their names suggest; the fourth has a logic trap that catches everyone, and it is worth meeting here rather than in a bug report.</p>

<h3>The four operators</h3>
<pre><code><span class="tok-comment">// TO-MANY relations: some / every / none</span>
where: { posts: { some:  { published: true } } }   <span class="tok-comment">// at least one published post</span>
where: { posts: { every: { published: true } } }   <span class="tok-comment">// all posts published — read the warning</span>
where: { posts: { none:  { published: true } } }   <span class="tok-comment">// no published post</span>
where: { posts: { none:  {} } }                    <span class="tok-comment">// no posts at all</span>

<span class="tok-comment">// TO-ONE relations: is / isNot</span>
where: { author: { is:    { role: 'ADMIN' } } }
where: { author: { isNot: { role: 'ADMIN' } } }
where: { author: { role: 'ADMIN' } }               <span class="tok-comment">// shorthand for is</span>
where: { profile: { is: null } }                   <span class="tok-comment">// optional relation absent</span></code></pre>
<div class="out">-- some
SELECT ... FROM "users" WHERE EXISTS (
  SELECT 1 FROM "posts" WHERE "posts"."author_id" = "users"."id" AND "posts"."published" = $1)

-- none
SELECT ... FROM "users" WHERE NOT EXISTS (
  SELECT 1 FROM "posts" WHERE "posts"."author_id" = "users"."id" AND "posts"."published" = $1)

-- every
SELECT ... FROM "users" WHERE NOT EXISTS (
  SELECT 1 FROM "posts" WHERE "posts"."author_id" = "users"."id" AND NOT ("posts"."published" = $1))</div>

<h3>The four operators, and what each asks the database</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">To-many</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">some</span><span class="lz-nsub"><code>EXISTS (… matching …)</code>. "At least one." The one you want nine times out of ten, and the only one with no surprises.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">none</span><span class="lz-nsub"><code>NOT EXISTS (… matching …)</code>. "Not a single one." <code>none: {}</code> with an empty filter means "has no related rows at all".</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">every</span><span class="lz-nsub"><code>NOT EXISTS (… NOT matching …)</code>. "None of them violate it" — which is <strong>true for a parent with no children</strong>. Pair it with <code>some: {}</code>.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">To-one</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">is / isNot</span><span class="lz-nsub">A join on the single related row. <code>is: null</code> means the relation is absent; <code>isNot</code> excludes rows with no relation at all, which is the same three-valued-logic trap one level up.</span></div></div>
  </div>
</div>

<h3>The <code>every</code> trap</h3>
<pre><code><span class="tok-comment">// "Users all of whose posts are published"</span>
const u = await prisma.user.findMany({ where: { posts: { every: { published: true } } } });</code></pre>
<div class="out">[
  { id: 1, email: 'an@example.com' },     -- has 3 posts, all published ✓
  { id: 7, email: 'binh@example.com' },   -- has NO posts at all        ← surprise
  { id: 9, email: 'chi@example.com' }     -- has NO posts at all        ← surprise
]</div>
<div class="pitfall">
<p><strong>Trap — <code>every</code> is true for an empty collection.</strong> Look at the generated SQL: <code>NOT EXISTS (… WHERE NOT condition)</code>. A user with zero posts has no row that violates the condition, so <code>NOT EXISTS</code> is true and they match. This is <em>vacuous truth</em> — mathematically correct, and almost never what the product manager meant. "All of their posts are published" in English implies they have posts. Say so explicitly:</p>
</div>
<pre><code><span class="tok-comment">// What you actually meant: has posts, AND all of them are published</span>
const u = await prisma.user.findMany({
  where: {
    AND: [
      { posts: { some:  {} } },                 <span class="tok-comment">// at least one post exists</span>
      { posts: { every: { published: true } } },
    ],
  },
});</code></pre>
<div class="out">[ { id: 1, email: 'an@example.com' } ]</div>

<h3>Filtering the parents versus filtering the children</h3>
<pre><code><span class="tok-comment">// A — filter the PARENTS. Only users who have a published post appear,</span>
<span class="tok-comment">//     and each one arrives with ALL their posts.</span>
const a = await prisma.user.findMany({
  where:   { posts: { some: { published: true } } },
  include: { posts: true },
});

<span class="tok-comment">// B — filter the CHILDREN. Every user appears, each with only their</span>
<span class="tok-comment">//     published posts — possibly an empty array.</span>
const b = await prisma.user.findMany({
  include: { posts: { where: { published: true } } },
});

<span class="tok-comment">// C — both. Only users with a published post, showing only those posts.</span>
const c = await prisma.user.findMany({
  where:   { posts: { some: { published: true } } },
  include: { posts: { where: { published: true } } },
});</code></pre>
<div class="out">-- A: 12 users, some with posts: [ …drafts included… ]
-- B: 340 users, most with posts: []
-- C: 12 users, each with only published posts</div>
<div class="callout warn">
<p><strong>This is the most common relation-query mistake there is.</strong> B is what people write when they meant C, and it looks correct in development where every test user has a published post. In production it returns every user in the database, most of them with an empty array, and the page renders three hundred empty cards. The <code>where</code> at the top level chooses <em>rows</em>; the <code>where</code> inside an <code>include</code> chooses <em>what comes with each row</em>. They are independent, and you usually need both.</p>
</div>

<h3>Through several levels</h3>
<pre><code><span class="tok-comment">// "Posts that have a comment written by an admin"</span>
where: { comments: { some: { author: { role: 'ADMIN' } } } }

<span class="tok-comment">// "Users who have commented on a post in the Prisma category"</span>
where: { comments: { some: { post: { categories: { some: { slug: 'prisma' } } } } } }

<span class="tok-comment">// "Orders with at least one line item of an out-of-stock product"</span>
where: { items: { some: { product: { stock: { lte: 0 } } } } }</code></pre>
<div class="out">SELECT ... FROM "posts" WHERE EXISTS (
  SELECT 1 FROM "comments" WHERE "comments"."post_id" = "posts"."id" AND EXISTS (
    SELECT 1 FROM "users" WHERE "users"."id" = "comments"."author_id" AND "users"."role" = $1))</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nesting is unlimited</span><span class="v">Each level becomes another <code>EXISTS</code>. Readable, and exactly the SQL a competent hand-writer would produce.</span></div>
  <div class="kv"><span class="k">Index every hop</span><span class="v">A three-level filter is three correlated subqueries. Each one needs an index on the foreign key it joins by, or you have three nested sequential scans and a query that takes seconds.</span></div>
  <div class="kv"><span class="k">Check the plan past two levels</span><span class="v">PostgreSQL usually flattens <code>EXISTS</code> into a semi-join, which is fast. Sometimes it does not. Three levels deep is where <code>EXPLAIN ANALYZE</code> stops being optional.</span></div>
  <div class="kv"><span class="k">Filtering ≠ fetching</span><span class="v">None of these load the related rows. They narrow the parent list. Add <code>include</code> or <code>select</code> separately if you also want the data.</span></div>
</div>

<h3>The "all of these tags" problem</h3>
<pre><code><span class="tok-comment">// WRONG — this means "has a tag that is both nodejs AND prisma", i.e. never</span>
where: { tags: { some: { name: { in: ['nodejs', 'prisma'] } } } }   <span class="tok-comment">// actually: ANY of them</span>

<span class="tok-comment">// RIGHT — one &#96;some&#96; per required tag, ANDed</span>
where: {
  AND: ['nodejs', 'prisma'].map((name) =&gt; ({ tags: { some: { name: name } } })),
}</code></pre>
<div class="out">SELECT ... FROM "posts"
WHERE EXISTS (SELECT 1 FROM "_PostToTag" pt JOIN "tags" t ON t.id = pt."A"
              WHERE pt."B" = "posts"."id" AND t."name" = $1)
  AND EXISTS (SELECT 1 FROM "_PostToTag" pt JOIN "tags" t ON t.id = pt."A"
              WHERE pt."B" = "posts"."id" AND t."name" = $2)</div>
<p>One <code>EXISTS</code> per tag, all required. It generalises to any number of tags, and it is the standard way to express set containment against a many-to-many. If the tags live in a <code>String[]</code> column instead of a table, the same thing is one operator: <code>{ tags: { hasEvery: ['nodejs', 'prisma'] } }</code> — which is a real argument for the array column when tags are simple strings.</p>

<h3>Relation counts as a filter</h3>
<pre><code><span class="tok-comment">// Prisma cannot filter directly on _count. These are the two real options.</span>

<span class="tok-comment">// A — a raw query, when you need the exact count comparison</span>
const active = await prisma.$queryRaw&lt;{ id: number }[]&gt;&#96;
  SELECT u.id FROM users u
  JOIN posts p ON p.author_id = u.id
  GROUP BY u.id HAVING COUNT(p.id) &gt; \${nguong}&#96;;

<span class="tok-comment">// B — a maintained counter column, when the check is on a hot path</span>
model User {
  id        Int @id @default(autoincrement())
  postCount Int @default(0) @map("post_count")
  @@index([postCount])
}

await prisma.user.findMany({ where: { postCount: { gt: 10 } } });</code></pre>
<div class="callout ok">
<p><strong>The denormalised counter is not a hack.</strong> "Users with more than ten posts" as a <code>HAVING COUNT(*)</code> cannot use an index — it must aggregate every group before it can filter. As a plain integer column it is an index range scan. The cost is keeping it correct: increment it in the same transaction that creates the post, and add a scheduled job that recomputes it. That is real work, and it is the right trade the moment the query is on a page users load constantly.</p>
</div>

<h3>Filtering a to-one relation that may be absent</h3>
<pre><code><span class="tok-comment">// Users with no profile at all</span>
where: { profile: { is: null } }

<span class="tok-comment">// Users whose profile exists and has a bio</span>
where: { profile: { is: { bio: { not: null } } } }

<span class="tok-comment">// Users with no profile, OR a profile with no bio</span>
where: { OR: [{ profile: { is: null } }, { profile: { is: { bio: null } } }] }

<span class="tok-comment">// Posts whose category is NOT the archive one — note this EXCLUDES</span>
<span class="tok-comment">// posts with no category at all, which is usually not what you want</span>
where: { category: { isNot: { slug: 'archive' } } }
where: { OR: [{ categoryId: null }, { category: { isNot: { slug: 'archive' } } }] }</code></pre>
<div class="out">SELECT ... FROM "users" WHERE NOT EXISTS (
  SELECT 1 FROM "profiles" WHERE "profiles"."user_id" = "users"."id")</div>
<p>The <code>isNot</code> case is the same three-valued-logic trap as <code>not</code> from Lesson 5.1, one level up: an absent relation is not a relation that fails the test, so it does not match. Whenever you write a negative filter on an optional relation, ask what should happen to rows that have nothing there — and then write that down too.</p>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting#filter-on-relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Filter on relations</span><span class="lc-sub">prisma.io/docs · <code>some</code>, <code>every</code>, <code>none</code>, <code>is</code>, <code>isNot</code> with the SQL each generates</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#filter-a-list-of-relations" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Filtering a list of relations</span><span class="lc-sub">prisma.io/docs · The parent-versus-child distinction, which is the trap in this lesson</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/functions-subquery.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — EXISTS and subquery expressions</span><span class="lc-sub">postgresql.org · What the planner does with a correlated EXISTS, and when it becomes a semi-join</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, subquery chapter</span><span class="lc-sub">EXISTS versus IN versus JOIN, measured — the SQL underneath every filter here</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Translate eight plain-language requirements into relation filters, including two that need the every fix</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Lọc theo quan hệ</h2>
<p class="lead">Lọc một danh sách theo thứ gì đó nằm ở bảng liên quan là chỗ một query builder thật sự đáng đồng tiền, vì phần SQL liên quan là một truy vấn con tương quan rất dễ viết sai một cách tinh vi. Prisma cho bạn bốn toán tử để làm việc đó. Ba cái cư xử đúng như tên gọi; cái thứ tư có một cái bẫy logic bẫy tất cả mọi người, và gặp nó ở đây thì hơn là gặp trong một báo cáo lỗi.</p>

<h3>Bốn toán tử</h3>
<pre><code><span class="tok-comment">// Quan hệ TỚI-NHIỀU: some / every / none</span>
where: { posts: { some:  { published: true } } }   <span class="tok-comment">// có ít nhất một bài đã đăng</span>
where: { posts: { every: { published: true } } }   <span class="tok-comment">// mọi bài đều đã đăng — đọc lời cảnh báo</span>
where: { posts: { none:  { published: true } } }   <span class="tok-comment">// không có bài nào đã đăng</span>
where: { posts: { none:  {} } }                    <span class="tok-comment">// không có bài nào cả</span>

<span class="tok-comment">// Quan hệ TỚI-MỘT: is / isNot</span>
where: { author: { is:    { role: 'ADMIN' } } }
where: { author: { isNot: { role: 'ADMIN' } } }
where: { author: { role: 'ADMIN' } }               <span class="tok-comment">// viết tắt của is</span>
where: { profile: { is: null } }                   <span class="tok-comment">// quan hệ tuỳ chọn vắng mặt</span></code></pre>
<div class="out">-- some
SELECT ... FROM "users" WHERE EXISTS (
  SELECT 1 FROM "posts" WHERE "posts"."author_id" = "users"."id" AND "posts"."published" = $1)

-- none
SELECT ... FROM "users" WHERE NOT EXISTS (
  SELECT 1 FROM "posts" WHERE "posts"."author_id" = "users"."id" AND "posts"."published" = $1)

-- every
SELECT ... FROM "users" WHERE NOT EXISTS (
  SELECT 1 FROM "posts" WHERE "posts"."author_id" = "users"."id" AND NOT ("posts"."published" = $1))</div>

<h3>Bốn toán tử, và mỗi cái hỏi cơ sở dữ liệu điều gì</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Tới-nhiều</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">some</span><span class="lz-nsub"><code>EXISTS (… khớp …)</code>. "Ít nhất một." Là cái bạn cần chín trên mười lần, và là cái duy nhất không có bất ngờ nào.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">none</span><span class="lz-nsub"><code>NOT EXISTS (… khớp …)</code>. "Không một cái nào." <code>none: {}</code> với bộ lọc rỗng nghĩa là "hoàn toàn không có hàng liên quan nào".</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">every</span><span class="lz-nsub"><code>NOT EXISTS (… KHÔNG khớp …)</code>. "Không cái nào vi phạm" — và điều đó <strong>đúng với một cha không có con nào</strong>. Hãy ghép nó với <code>some: {}</code>.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Tới-một</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">is / isNot</span><span class="lz-nsub">Một phép join với hàng liên quan duy nhất. <code>is: null</code> nghĩa là quan hệ vắng mặt; <code>isNot</code> loại những hàng hoàn toàn không có quan hệ, đúng cái bẫy logic ba giá trị dịch lên một tầng.</span></div></div>
  </div>
</div>

<h3>Cái bẫy của <code>every</code></h3>
<pre><code><span class="tok-comment">// "Những người dùng mà MỌI bài viết đều đã đăng"</span>
const u = await prisma.user.findMany({ where: { posts: { every: { published: true } } } });</code></pre>
<div class="out">[
  { id: 1, email: 'an@example.com' },     -- có 3 bài, đều đã đăng ✓
  { id: 7, email: 'binh@example.com' },   -- KHÔNG có bài nào cả   ← bất ngờ
  { id: 9, email: 'chi@example.com' }     -- KHÔNG có bài nào cả   ← bất ngờ
]</div>
<div class="pitfall">
<p><strong>Bẫy — <code>every</code> đúng với một tập hợp rỗng.</strong> Nhìn câu SQL sinh ra: <code>NOT EXISTS (… WHERE NOT điều kiện)</code>. Một người dùng có không bài viết nào thì không có hàng nào vi phạm điều kiện, nên <code>NOT EXISTS</code> đúng và họ được khớp. Đây là <em>chân lý rỗng</em> — đúng về mặt toán học, và gần như không bao giờ là thứ người quản lý sản phẩm muốn nói. "Mọi bài viết của họ đều đã đăng" trong tiếng Việt hàm ý họ có bài viết. Hãy nói ra tường minh:</p>
</div>
<pre><code><span class="tok-comment">// Thứ bạn thật sự muốn nói: có bài viết, VÀ tất cả đều đã đăng</span>
const u = await prisma.user.findMany({
  where: {
    AND: [
      { posts: { some:  {} } },                 <span class="tok-comment">// tồn tại ít nhất một bài</span>
      { posts: { every: { published: true } } },
    ],
  },
});</code></pre>
<div class="out">[ { id: 1, email: 'an@example.com' } ]</div>

<h3>Lọc cha so với lọc con</h3>
<pre><code><span class="tok-comment">// A — lọc CHA. Chỉ những người dùng có bài đã đăng mới xuất hiện,</span>
<span class="tok-comment">//     và mỗi người mang theo TẤT CẢ bài viết của họ.</span>
const a = await prisma.user.findMany({
  where:   { posts: { some: { published: true } } },
  include: { posts: true },
});

<span class="tok-comment">// B — lọc CON. Mọi người dùng đều xuất hiện, mỗi người chỉ mang theo</span>
<span class="tok-comment">//     các bài đã đăng — có thể là một mảng rỗng.</span>
const b = await prisma.user.findMany({
  include: { posts: { where: { published: true } } },
});

<span class="tok-comment">// C — cả hai. Chỉ người dùng có bài đã đăng, và chỉ hiện những bài đó.</span>
const c = await prisma.user.findMany({
  where:   { posts: { some: { published: true } } },
  include: { posts: { where: { published: true } } },
});</code></pre>
<div class="out">-- A: 12 người dùng, một số kèm posts: [ …có cả bản nháp… ]
-- B: 340 người dùng, phần lớn kèm posts: []
-- C: 12 người dùng, mỗi người chỉ kèm bài đã đăng</div>
<div class="callout warn">
<p><strong>Đây là lỗi truy vấn quan hệ phổ biến nhất từng có.</strong> B là thứ người ta viết ra khi họ định viết C, và nó trông đúng ở môi trường phát triển nơi mọi người dùng thử đều có một bài đã đăng. Trên production nó trả về mọi người dùng trong cơ sở dữ liệu, phần lớn kèm một mảng rỗng, và trang vẽ ra ba trăm cái thẻ trống. <code>where</code> ở tầng trên chọn <em>hàng nào</em>; <code>where</code> bên trong một <code>include</code> chọn <em>cái gì đi kèm mỗi hàng</em>. Chúng độc lập, và bạn thường cần cả hai.</p>
</div>

<h3>Xuyên qua nhiều tầng</h3>
<pre><code><span class="tok-comment">// "Bài viết có một bình luận do quản trị viên viết"</span>
where: { comments: { some: { author: { role: 'ADMIN' } } } }

<span class="tok-comment">// "Người dùng từng bình luận vào một bài thuộc chuyên mục Prisma"</span>
where: { comments: { some: { post: { categories: { some: { slug: 'prisma' } } } } } }

<span class="tok-comment">// "Đơn hàng có ít nhất một dòng hàng thuộc sản phẩm đã hết"</span>
where: { items: { some: { product: { stock: { lte: 0 } } } } }</code></pre>
<div class="out">SELECT ... FROM "posts" WHERE EXISTS (
  SELECT 1 FROM "comments" WHERE "comments"."post_id" = "posts"."id" AND EXISTS (
    SELECT 1 FROM "users" WHERE "users"."id" = "comments"."author_id" AND "users"."role" = $1))</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Lồng nhau không giới hạn</span><span class="v">Mỗi tầng thành một câu <code>EXISTS</code> nữa. Đọc được, và đúng bằng thứ SQL mà một người viết tay giỏi sẽ tạo ra.</span></div>
  <div class="kv"><span class="k">Đánh chỉ mục cho mọi chặng</span><span class="v">Một bộ lọc ba tầng là ba truy vấn con tương quan. Mỗi cái cần một chỉ mục trên khoá ngoại mà nó join theo, nếu không bạn có ba lần quét tuần tự lồng nhau và một câu truy vấn mất vài giây.</span></div>
  <div class="kv"><span class="k">Quá hai tầng thì kiểm kế hoạch</span><span class="v">PostgreSQL thường làm phẳng <code>EXISTS</code> thành một semi-join, và như vậy thì nhanh. Đôi khi nó không làm. Sâu ba tầng là chỗ <code>EXPLAIN ANALYZE</code> thôi còn là tuỳ chọn.</span></div>
  <div class="kv"><span class="k">Lọc ≠ lấy về</span><span class="v">Không cái nào trong số này nạp các hàng liên quan. Chúng thu hẹp danh sách cha. Hãy thêm <code>include</code> hoặc <code>select</code> riêng nếu bạn cũng muốn dữ liệu đó.</span></div>
</div>

<h3>Bài toán "đủ tất cả các thẻ này"</h3>
<pre><code><span class="tok-comment">// SAI — cái này nghĩa là "có một thẻ vừa là nodejs VỪA là prisma", tức là không bao giờ</span>
where: { tags: { some: { name: { in: ['nodejs', 'prisma'] } } } }   <span class="tok-comment">// thật ra: MỘT trong số đó</span>

<span class="tok-comment">// ĐÚNG — mỗi thẻ bắt buộc một &#96;some&#96;, AND lại với nhau</span>
where: {
  AND: ['nodejs', 'prisma'].map((name) =&gt; ({ tags: { some: { name: name } } })),
}</code></pre>
<div class="out">SELECT ... FROM "posts"
WHERE EXISTS (SELECT 1 FROM "_PostToTag" pt JOIN "tags" t ON t.id = pt."A"
              WHERE pt."B" = "posts"."id" AND t."name" = $1)
  AND EXISTS (SELECT 1 FROM "_PostToTag" pt JOIN "tags" t ON t.id = pt."A"
              WHERE pt."B" = "posts"."id" AND t."name" = $2)</div>
<p>Mỗi thẻ một câu <code>EXISTS</code>, tất cả đều bắt buộc. Nó tổng quát hoá cho số thẻ tuỳ ý, và là cách chuẩn để diễn đạt phép chứa tập hợp với một quan hệ nhiều–nhiều. Nếu các thẻ nằm trong một cột <code>String[]</code> thay vì một bảng thì cũng chuyện đó chỉ là một toán tử: <code>{ tags: { hasEvery: ['nodejs', 'prisma'] } }</code> — và đó là một lý lẽ thật cho cột mảng khi thẻ chỉ là những chuỗi đơn giản.</p>

<h3>Số đếm quan hệ dùng làm bộ lọc</h3>
<pre><code><span class="tok-comment">// Prisma không lọc trực tiếp trên _count được. Đây là hai lựa chọn thật.</span>

<span class="tok-comment">// A — một truy vấn thô, khi bạn cần đúng phép so sánh số đếm</span>
const active = await prisma.$queryRaw&lt;{ id: number }[]&gt;&#96;
  SELECT u.id FROM users u
  JOIN posts p ON p.author_id = u.id
  GROUP BY u.id HAVING COUNT(p.id) &gt; \${nguong}&#96;;

<span class="tok-comment">// B — một cột đếm được duy trì, khi phép kiểm nằm trên đường nóng</span>
model User {
  id        Int @id @default(autoincrement())
  postCount Int @default(0) @map("post_count")
  @@index([postCount])
}

await prisma.user.findMany({ where: { postCount: { gt: 10 } } });</code></pre>
<div class="callout ok">
<p><strong>Cột đếm phi chuẩn hoá không phải một mẹo vặt.</strong> "Người dùng có hơn mười bài viết" viết bằng <code>HAVING COUNT(*)</code> thì không dùng được chỉ mục — nó phải tổng hợp mọi nhóm rồi mới lọc được. Còn dưới dạng một cột số nguyên thuần thì đó là một lần quét khoảng theo chỉ mục. Cái giá là phải giữ nó đúng: tăng nó trong cùng giao dịch tạo bài viết, và thêm một tác vụ theo lịch tính lại. Đó là công việc thật, và là đánh đổi đúng ngay khi câu truy vấn ấy nằm trên một trang mà người dùng tải liên tục.</p>
</div>

<h3>Lọc một quan hệ tới-một có thể vắng mặt</h3>
<pre><code><span class="tok-comment">// Người dùng hoàn toàn chưa có hồ sơ</span>
where: { profile: { is: null } }

<span class="tok-comment">// Người dùng có hồ sơ và hồ sơ đó có phần giới thiệu</span>
where: { profile: { is: { bio: { not: null } } } }

<span class="tok-comment">// Người dùng chưa có hồ sơ, HOẶC có hồ sơ mà không có phần giới thiệu</span>
where: { OR: [{ profile: { is: null } }, { profile: { is: { bio: null } } }] }

<span class="tok-comment">// Bài viết có chuyên mục KHÔNG phải chuyên mục lưu trữ — lưu ý cái này LOẠI</span>
<span class="tok-comment">// những bài không thuộc chuyên mục nào, và đó thường không phải ý bạn</span>
where: { category: { isNot: { slug: 'archive' } } }
where: { OR: [{ categoryId: null }, { category: { isNot: { slug: 'archive' } } }] }</code></pre>
<div class="out">SELECT ... FROM "users" WHERE NOT EXISTS (
  SELECT 1 FROM "profiles" WHERE "profiles"."user_id" = "users"."id")</div>
<p>Trường hợp <code>isNot</code> là đúng cái bẫy logic ba giá trị của <code>not</code> ở Bài 5.1, chỉ dịch lên một tầng: một quan hệ vắng mặt không phải là một quan hệ trượt phép kiểm, nên nó không khớp. Mỗi khi bạn viết một bộ lọc phủ định trên một quan hệ tuỳ chọn, hãy hỏi xem những hàng chẳng có gì ở đó thì nên ra sao — rồi viết luôn điều đó ra.</p>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting#filter-on-relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Filter on relations</span><span class="lc-sub">prisma.io/docs · <code>some</code>, <code>every</code>, <code>none</code>, <code>is</code>, <code>isNot</code> kèm SQL mỗi cái sinh ra</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#filter-a-list-of-relations" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Lọc một danh sách quan hệ</span><span class="lc-sub">prisma.io/docs · Phân biệt cha với con, tức cái bẫy của bài này</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/functions-subquery.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — EXISTS và biểu thức truy vấn con</span><span class="lc-sub">postgresql.org · Bộ lập kế hoạch làm gì với một EXISTS tương quan, và khi nào nó thành semi-join</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương truy vấn con</span><span class="lc-sub">EXISTS so với IN so với JOIN, đo bằng số — phần SQL nằm dưới mọi bộ lọc ở đây</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Dịch tám yêu cầu bằng lời thành bộ lọc quan hệ, trong đó hai cái cần cách vá cho every</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Ordering, and pagination that survives|||5.3 — Sắp xếp, và phân trang sống sót được',
      slug: 'pr-5-3-sap-xep-phan-trang',
      type: 'LESSON',
      description: 'orderBy nhiều khoá, sắp theo quan hệ và theo _count, nulls first/last, rồi phân trang: vì sao skip chết ở trang 5000 đo bằng số thật, con trỏ hoạt động ra sao, và cách chọn khoá con trỏ đúng để không trùng và không sót hàng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Ordering, and pagination that survives</h2>
<p class="lead">Every list endpoint has an ordering and a pagination strategy, and both are usually chosen once by copying an example. That is fine until the table reaches a million rows, at which point <code>skip</code> degrades in a way that looks like a database problem and is actually an algorithmic one. This lesson measures it, then shows the fix.</p>

<h3><code>orderBy</code>, in full</h3>
<pre><code><span class="tok-comment">// Single key</span>
orderBy: { createdAt: 'desc' }

<span class="tok-comment">// Several keys — an ARRAY, because object key order is not a contract</span>
orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { id: 'desc' }]

<span class="tok-comment">// Through a to-one relation</span>
orderBy: { author: { username: 'asc' } }

<span class="tok-comment">// By the size of a to-many relation</span>
orderBy: { comments: { _count: 'desc' } }

<span class="tok-comment">// Nulls explicitly placed</span>
orderBy: { publishedAt: { sort: 'desc', nulls: 'last' } }

<span class="tok-comment">// By relevance, when using full-text search (PostgreSQL preview feature)</span>
orderBy: { _relevance: { fields: ['title'], search: 'prisma', sort: 'desc' } }</code></pre>
<div class="out">SELECT ... FROM "posts"
LEFT JOIN "users" ON "users"."id" = "posts"."author_id"
ORDER BY "posts"."featured" DESC, "posts"."published_at" DESC NULLS LAST, "posts"."id" DESC
LIMIT $1 OFFSET $2</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Use an array for multiple keys</span><span class="v"><code>{ a: 'asc', b: 'desc' }</code> happens to work in V8 because object key order is preserved for string keys — but it is not part of the API contract and TypeScript will not stop you reordering it. An array makes the priority explicit.</span></div>
  <div class="kv"><span class="k">Always end with a unique tiebreaker</span><span class="v">Two posts published in the same second have no defined order without <code>{ id: 'desc' }</code> at the end. Without it, the same row can appear on page 1 and page 2 of the same listing.</span></div>
  <div class="kv"><span class="k">NULLs sort last in PostgreSQL by default for DESC</span><span class="v">And first for ASC. That is the opposite of what most people expect for "newest first with undated drafts at the bottom", so state it: <code>nulls: 'last'</code>.</span></div>
  <div class="kv"><span class="k"><code>_count</code> ordering is a join plus a group</span><span class="v">"Most commented posts" cannot use a plain index. On a large table this is the query to replace with a maintained counter column — the same trade as Lesson 5.2.</span></div>
</div>

<h3>Offset pagination, and where it breaks</h3>
<pre><code>const page = Number(q.page ?? 1);
const size = 20;

const [rows, total] = await Promise.all([
  prisma.post.findMany({
    where:   { published: true },
    orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
    skip:    (page - 1) * size,
    take:    size,
  }),
  prisma.post.count({ where: { published: true } }),
]);</code></pre>
<div class="out">SELECT ... FROM "posts" WHERE "published" = $1
ORDER BY "published_at" DESC, "id" DESC LIMIT $2 OFFSET $3</div>
<pre><code><span class="tok-comment">-- The same query at four different offsets. 2,000,000 rows.</span>
EXPLAIN ANALYZE SELECT * FROM posts ORDER BY published_at DESC, id DESC LIMIT 20 OFFSET 0;
EXPLAIN ANALYZE SELECT * FROM posts ORDER BY published_at DESC, id DESC LIMIT 20 OFFSET 10000;
EXPLAIN ANALYZE SELECT * FROM posts ORDER BY published_at DESC, id DESC LIMIT 20 OFFSET 100000;
EXPLAIN ANALYZE SELECT * FROM posts ORDER BY published_at DESC, id DESC LIMIT 20 OFFSET 1000000;</code></pre>
<div class="out">OFFSET       0 → Execution Time:    0.094 ms
OFFSET   10000 → Execution Time:    9.812 ms
OFFSET  100000 → Execution Time:   96.447 ms
OFFSET 1000000 → Execution Time:  982.115 ms</div>
<div class="callout warn">
<p><strong>Linear, and there is no index that fixes it.</strong> <code>OFFSET 1000000</code> means the database walks and discards a million rows before returning twenty. The index is being used perfectly — it is the algorithm that is wrong. And the <code>count</code> alongside it is a second full scan, because PostgreSQL stores no row count. A "page 50,000" link on a big table is two seconds of work to render twenty rows.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The other failure: drift</span><span class="v">Between loading page 1 and page 2, three new posts are inserted at the top. Everything shifts down by three, so three rows you already saw reappear on page 2 and three you have not seen are skipped. Offset paginates over <em>positions</em>, and positions move.</span></div>
  <div class="kv"><span class="k">When offset is still right</span><span class="v">An admin table with numbered pages and a few thousand rows. A report the user jumps around in. Anything where "page 7" must be a meaningful, linkable concept. Offset is not wrong — it is wrong at scale.</span></div>
</div>

<h3>Cursor pagination</h3>
<pre><code>const page = await prisma.post.findMany({
  where:   { published: true },
  orderBy: { id: 'desc' },
  take:    20,
  ...(cursor &amp;&amp; { cursor: { id: Number(cursor) }, skip: 1 }),   <span class="tok-comment">// skip the cursor row itself</span>
});

const next = page.length === 20 ? page[page.length - 1].id : null;
res.json({ rows: page, nextCursor: next });</code></pre>
<div class="out">SELECT ... FROM "posts" WHERE "published" = $1 AND "id" &lt;= $2
ORDER BY "id" DESC LIMIT $3 OFFSET $4

OFFSET       0 → Execution Time: 0.081 ms
after 10,000  → Execution Time: 0.079 ms
after 100,000 → Execution Time: 0.083 ms
after 1,000,000 → Execution Time: 0.088 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Constant time</span><span class="lz-t">0.08 ms at any depth</span><span class="lz-d">The cursor becomes a <code>WHERE id &lt;= $2</code>, so the index seeks straight to the position instead of counting to it. Page one million costs the same as page one.</span></div>
  <div class="lz-step"><span class="lz-k">No drift</span><span class="lz-t">Rows are not skipped or repeated</span><span class="lz-d">The cursor names a <em>row</em>, not a position. Inserting at the top does not move it, so the next page continues exactly where the last one stopped.</span></div>
  <div class="lz-step"><span class="lz-k">No page numbers</span><span class="lz-t">Only next and previous</span><span class="lz-d">You cannot jump to page 50. For an infinite-scroll feed that is no loss; for a numbered admin table it rules the technique out.</span></div>
  <div class="lz-step"><span class="lz-k"><code>skip: 1</code> is required</span><span class="lz-d">The cursor row is <em>included</em> by default. Forget the skip and the last row of each page becomes the first row of the next — a duplicate at every boundary, which is subtle enough to reach production.</span><span class="lz-t">Or you duplicate a row</span></div>
</div>

<h3>Choosing the cursor key</h3>
<pre><code><span class="tok-comment">// WRONG — publishedAt is not unique, so rows sharing a timestamp are lost</span>
orderBy: { publishedAt: 'desc' },
cursor:  { publishedAt: lastSeen },

<span class="tok-comment">// RIGHT — order by (timestamp, id) and cursor on the unique id</span>
orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
cursor:  { id: lastSeenId },
skip:    1,</code></pre>
<div class="pitfall">
<p><strong>Trap — the cursor field must be unique, and the ordering must end with it.</strong> Prisma's <code>cursor</code> only accepts a unique field, which prevents half of this mistake at compile time. The half it cannot prevent: if your <code>orderBy</code> does not end with that same unique field, the sort order and the cursor disagree, and rows near a tie can be skipped or repeated. The rule is simple — <strong>whatever you cursor on must be the last key in <code>orderBy</code></strong>.</p>
</div>

<h3>Compound cursors, when one key is not enough</h3>
<pre><code><span class="tok-comment">// Prisma's cursor takes a unique field, which covers most cases.</span>
<span class="tok-comment">// When you need "after this timestamp AND this id", write the comparison yourself:</span>
const rows = await prisma.post.findMany({
  where: {
    published: true,
    OR: [
      { publishedAt: { lt: lastAt } },
      { publishedAt: lastAt, id: { lt: lastId } },
    ],
  },
  orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
  take: 20,
});</code></pre>
<div class="out">SELECT ... FROM "posts" WHERE ("published" = $1 AND (
  "published_at" &lt; $2 OR ("published_at" = $3 AND "id" &lt; $4)))
ORDER BY "published_at" DESC, "id" DESC LIMIT $5</div>
<p>That <code>OR</code> is the row-value comparison <code>(published_at, id) &lt; ($2, $4)</code> written out longhand — PostgreSQL supports the tuple form directly in raw SQL, and it uses a composite index on <code>(published_at, id)</code> cleanly. This is the shape every "load more" feed with a non-unique sort key needs.</p>

<h3>Choosing, and what to send the client</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Infinite scroll, feed, chat, log</span><span class="v">Cursor. There are no page numbers to lose, the data changes under the user constantly, and constant-time paging is the whole requirement.</span></div>
  <div class="kv"><span class="k">Admin table, report, export</span><span class="v">Offset. Page numbers matter, the row count is bounded, and a jump to page 40 is a real user action.</span></div>
  <div class="kv"><span class="k">Both, in one API</span><span class="v">Perfectly reasonable: offset for the admin listing, cursor for the public feed, over the same table. They are query strategies, not architectural commitments.</span></div>
  <div class="kv"><span class="k">Do not send a total with a cursor</span><span class="v">A <code>count</code> alongside a cursor query throws away the constant-time property you just bought. If the UI needs an approximate total, read <code>pg_class.reltuples</code> instead — it is free and accurate to within a few percent.</span></div>
</div>
<pre><code><span class="tok-comment">// The response shape that makes both strategies usable by a client</span>
{
  "rows": [ /* … */ ],
  "nextCursor": 41827,       <span class="tok-comment">// null when there is no next page</span>
  "hasMore": true
}

<span class="tok-comment">// hasMore without a second query: ask for one more than you need</span>
const rows = await prisma.post.findMany({ take: size + 1, /* … */ });
const hasMore = rows.length &gt; size;
if (hasMore) rows.pop();</code></pre>
<div class="callout ok">
<p><strong>The <code>take: size + 1</code> trick is worth adopting everywhere.</strong> It answers "is there a next page" with no extra query and no count. Fetch twenty-one rows, return twenty, and the twenty-first — if it exists — is your <code>hasMore</code>. One statement, exact answer, constant cost.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/pagination" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Pagination</span><span class="lc-sub">prisma.io/docs · Offset and cursor side by side, with the <code>skip: 1</code> rule and the trade-offs</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting#sorting" target="_blank" rel="noopener"><span class="lc-ico">↕️</span><span class="lc-body"><span class="lc-title">Sorting</span><span class="lc-sub">prisma.io/docs · Multiple keys, relation ordering, <code>_count</code>, and null placement</span></span></a>
<a class="link-card" href="https://use-the-index-luke.com/no-offset" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Use The Index, Luke — "No Offset"</span><span class="lc-sub">use-the-index-luke.com · The definitive explanation of why OFFSET degrades, with the row-value fix</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, index chapter</span><span class="lc-sub">Why an index serves ORDER BY without a sort step, and what breaks that</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Convert an offset endpoint to cursors, then prove the drift bug existed before and does not after</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Sắp xếp, và phân trang sống sót được</h2>
<p class="lead">Mọi endpoint trả danh sách đều có một cách sắp xếp và một chiến lược phân trang, và cả hai thường được chọn đúng một lần bằng cách chép từ ví dụ. Như thế vẫn ổn cho tới khi bảng đạt một triệu hàng, lúc đó <code>skip</code> xuống cấp theo kiểu trông như lỗi cơ sở dữ liệu mà thật ra là lỗi thuật toán. Bài này đo nó bằng số, rồi chỉ cách vá.</p>

<h3><code>orderBy</code>, nói đủ</h3>
<pre><code><span class="tok-comment">// Một khoá</span>
orderBy: { createdAt: 'desc' }

<span class="tok-comment">// Nhiều khoá — một MẢNG, vì thứ tự khoá trong đối tượng không phải một cam kết</span>
orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { id: 'desc' }]

<span class="tok-comment">// Xuyên qua một quan hệ tới-một</span>
orderBy: { author: { username: 'asc' } }

<span class="tok-comment">// Theo kích thước của một quan hệ tới-nhiều</span>
orderBy: { comments: { _count: 'desc' } }

<span class="tok-comment">// Đặt vị trí cho các giá trị null một cách tường minh</span>
orderBy: { publishedAt: { sort: 'desc', nulls: 'last' } }

<span class="tok-comment">// Theo độ liên quan, khi dùng tìm kiếm toàn văn (tính năng preview của PostgreSQL)</span>
orderBy: { _relevance: { fields: ['title'], search: 'prisma', sort: 'desc' } }</code></pre>
<div class="out">SELECT ... FROM "posts"
LEFT JOIN "users" ON "users"."id" = "posts"."author_id"
ORDER BY "posts"."featured" DESC, "posts"."published_at" DESC NULLS LAST, "posts"."id" DESC
LIMIT $1 OFFSET $2</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng mảng khi có nhiều khoá</span><span class="v"><code>{ a: 'asc', b: 'desc' }</code> tình cờ chạy đúng trên V8 vì thứ tự khoá chuỗi trong đối tượng được giữ nguyên — nhưng đó không phải một phần cam kết của API và TypeScript sẽ không ngăn bạn sắp lại. Một mảng làm thứ tự ưu tiên trở nên tường minh.</span></div>
  <div class="kv"><span class="k">Luôn kết thúc bằng một khoá phá hoà duy nhất</span><span class="v">Hai bài viết đăng trong cùng một giây không có thứ tự xác định nếu thiếu <code>{ id: 'desc' }</code> ở cuối. Không có nó thì cùng một hàng có thể xuất hiện ở cả trang 1 lẫn trang 2 của cùng một danh sách.</span></div>
  <div class="kv"><span class="k">Mặc định NULL xếp cuối với DESC trong PostgreSQL</span><span class="v">Và xếp đầu với ASC. Đó là ngược với thứ phần lớn người ta mong đợi cho kiểu "mới nhất trước, bản nháp chưa có ngày thì xuống dưới", nên hãy nói ra: <code>nulls: 'last'</code>.</span></div>
  <div class="kv"><span class="k">Sắp theo <code>_count</code> là một phép join cộng một phép gộp nhóm</span><span class="v">"Bài viết nhiều bình luận nhất" không dùng được chỉ mục thường. Trên một bảng lớn thì đây là câu truy vấn nên thay bằng một cột đếm được duy trì — cùng đánh đổi như ở Bài 5.2.</span></div>
</div>

<h3>Phân trang bằng offset, và chỗ nó vỡ</h3>
<pre><code>const page = Number(q.page ?? 1);
const size = 20;

const [rows, total] = await Promise.all([
  prisma.post.findMany({
    where:   { published: true },
    orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
    skip:    (page - 1) * size,
    take:    size,
  }),
  prisma.post.count({ where: { published: true } }),
]);</code></pre>
<div class="out">SELECT ... FROM "posts" WHERE "published" = $1
ORDER BY "published_at" DESC, "id" DESC LIMIT $2 OFFSET $3</div>
<pre><code><span class="tok-comment">-- Cùng một câu truy vấn ở bốn mức offset. 2.000.000 hàng.</span>
EXPLAIN ANALYZE SELECT * FROM posts ORDER BY published_at DESC, id DESC LIMIT 20 OFFSET 0;
EXPLAIN ANALYZE SELECT * FROM posts ORDER BY published_at DESC, id DESC LIMIT 20 OFFSET 10000;
EXPLAIN ANALYZE SELECT * FROM posts ORDER BY published_at DESC, id DESC LIMIT 20 OFFSET 100000;
EXPLAIN ANALYZE SELECT * FROM posts ORDER BY published_at DESC, id DESC LIMIT 20 OFFSET 1000000;</code></pre>
<div class="out">OFFSET       0 → Execution Time:    0.094 ms
OFFSET   10000 → Execution Time:    9.812 ms
OFFSET  100000 → Execution Time:   96.447 ms
OFFSET 1000000 → Execution Time:  982.115 ms</div>
<div class="callout warn">
<p><strong>Tuyến tính, và không có chỉ mục nào vá được.</strong> <code>OFFSET 1000000</code> nghĩa là cơ sở dữ liệu đi qua rồi vứt bỏ một triệu hàng trước khi trả về hai mươi. Chỉ mục đang được dùng hoàn hảo — cái sai là thuật toán. Và câu <code>count</code> đi kèm là một lần quét toàn bộ thứ hai, vì PostgreSQL không lưu số đếm hàng nào cả. Một liên kết "trang 50.000" trên bảng lớn là hai giây công sức để vẽ ra hai mươi hàng.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Thất bại còn lại: trôi vị trí</span><span class="v">Giữa lúc tải trang 1 và trang 2, có ba bài mới được chèn lên đầu. Mọi thứ dịch xuống ba, nên ba hàng bạn đã xem hiện lại ở trang 2 và ba hàng bạn chưa xem bị bỏ qua. Offset phân trang theo <em>vị trí</em>, mà vị trí thì di chuyển.</span></div>
  <div class="kv"><span class="k">Khi nào offset vẫn đúng</span><span class="v">Một bảng quản trị có số trang và vài nghìn hàng. Một báo cáo mà người dùng nhảy qua nhảy lại. Bất cứ chỗ nào mà "trang 7" phải là một khái niệm có nghĩa và gắn liên kết được. Offset không sai — nó sai khi ở quy mô lớn.</span></div>
</div>

<h3>Phân trang bằng con trỏ</h3>
<pre><code>const page = await prisma.post.findMany({
  where:   { published: true },
  orderBy: { id: 'desc' },
  take:    20,
  ...(cursor &amp;&amp; { cursor: { id: Number(cursor) }, skip: 1 }),   <span class="tok-comment">// bỏ qua chính hàng con trỏ</span>
});

const next = page.length === 20 ? page[page.length - 1].id : null;
res.json({ rows: page, nextCursor: next });</code></pre>
<div class="out">SELECT ... FROM "posts" WHERE "published" = $1 AND "id" &lt;= $2
ORDER BY "id" DESC LIMIT $3 OFFSET $4

OFFSET       0 → Execution Time: 0.081 ms
sau 10.000     → Execution Time: 0.079 ms
sau 100.000    → Execution Time: 0.083 ms
sau 1.000.000  → Execution Time: 0.088 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Thời gian hằng</span><span class="lz-t">0,08 ms ở mọi độ sâu</span><span class="lz-d">Con trỏ trở thành một <code>WHERE id &lt;= $2</code>, nên chỉ mục nhảy thẳng tới vị trí thay vì đếm tới đó. Trang một triệu tốn đúng bằng trang một.</span></div>
  <div class="lz-step"><span class="lz-k">Không trôi</span><span class="lz-t">Hàng không bị bỏ sót hay lặp lại</span><span class="lz-d">Con trỏ nêu tên một <em>hàng</em>, không phải một vị trí. Chèn thêm ở đầu không làm nó dịch đi, nên trang kế tiếp đi tiếp đúng chỗ trang trước dừng lại.</span></div>
  <div class="lz-step"><span class="lz-k">Không có số trang</span><span class="lz-t">Chỉ có tiếp và lùi</span><span class="lz-d">Bạn không nhảy tới trang 50 được. Với một dòng thời gian cuộn vô tận thì chẳng mất gì; với một bảng quản trị có đánh số thì điều đó loại luôn kỹ thuật này.</span></div>
  <div class="lz-step"><span class="lz-k">Bắt buộc phải có <code>skip: 1</code></span><span class="lz-d">Hàng con trỏ mặc định <em>được bao gồm</em>. Quên cái skip thì hàng cuối của mỗi trang thành hàng đầu của trang sau — một bản trùng ở mọi ranh giới, và nó tinh vi đủ để lọt lên production.</span><span class="lz-t">Không thì bạn lặp một hàng</span></div>
</div>

<h3>Chọn khoá cho con trỏ</h3>
<pre><code><span class="tok-comment">// SAI — publishedAt không unique, nên các hàng cùng mốc thời gian bị mất</span>
orderBy: { publishedAt: 'desc' },
cursor:  { publishedAt: lastSeen },

<span class="tok-comment">// ĐÚNG — sắp theo (mốc thời gian, id) và đặt con trỏ trên id unique</span>
orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
cursor:  { id: lastSeenId },
skip:    1,</code></pre>
<div class="pitfall">
<p><strong>Bẫy — trường làm con trỏ phải unique, và thứ tự sắp xếp phải kết thúc bằng nó.</strong> <code>cursor</code> của Prisma chỉ nhận trường unique, nên nó chặn một nửa lỗi này ngay lúc biên dịch. Nửa còn lại nó không chặn được: nếu <code>orderBy</code> của bạn không kết thúc bằng đúng trường unique ấy thì thứ tự sắp xếp và con trỏ bất đồng, và các hàng gần chỗ bằng nhau có thể bị bỏ sót hoặc lặp lại. Luật thì đơn giản — <strong>thứ bạn đặt con trỏ lên phải là khoá cuối cùng trong <code>orderBy</code></strong>.</p>
</div>

<h3>Con trỏ phức hợp, khi một khoá không đủ</h3>
<pre><code><span class="tok-comment">// cursor của Prisma nhận một trường unique, và thế là đủ cho phần lớn trường hợp.</span>
<span class="tok-comment">// Khi bạn cần "sau mốc thời gian này VÀ id này", hãy tự viết phép so sánh:</span>
const rows = await prisma.post.findMany({
  where: {
    published: true,
    OR: [
      { publishedAt: { lt: lastAt } },
      { publishedAt: lastAt, id: { lt: lastId } },
    ],
  },
  orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
  take: 20,
});</code></pre>
<div class="out">SELECT ... FROM "posts" WHERE ("published" = $1 AND (
  "published_at" &lt; $2 OR ("published_at" = $3 AND "id" &lt; $4)))
ORDER BY "published_at" DESC, "id" DESC LIMIT $5</div>
<p>Cái <code>OR</code> đó chính là phép so sánh bộ giá trị <code>(published_at, id) &lt; ($2, $4)</code> viết dài ra — PostgreSQL hỗ trợ dạng bộ trực tiếp trong SQL thô, và nó dùng sạch sẽ một chỉ mục phức hợp trên <code>(published_at, id)</code>. Đây là hình dạng mà mọi dòng thời gian kiểu "tải thêm" với khoá sắp xếp không-unique đều cần.</p>

<h3>Chọn thế nào, và gửi gì cho client</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cuộn vô tận, dòng thời gian, chat, nhật ký</span><span class="v">Con trỏ. Không có số trang nào để mất, dữ liệu đổi liên tục dưới chân người dùng, và phân trang thời gian hằng chính là toàn bộ yêu cầu.</span></div>
  <div class="kv"><span class="k">Bảng quản trị, báo cáo, xuất dữ liệu</span><span class="v">Offset. Số trang có ý nghĩa, số hàng có giới hạn, và nhảy tới trang 40 là một hành động thật của người dùng.</span></div>
  <div class="kv"><span class="k">Cả hai, trong một API</span><span class="v">Hoàn toàn hợp lý: offset cho danh sách quản trị, con trỏ cho dòng thời gian công khai, trên cùng một bảng. Chúng là chiến lược truy vấn, không phải cam kết kiến trúc.</span></div>
  <div class="kv"><span class="k">Đừng gửi tổng số kèm con trỏ</span><span class="v">Một câu <code>count</code> đi kèm truy vấn con trỏ là vứt bỏ đúng cái tính chất thời gian hằng bạn vừa mua được. Nếu giao diện cần một tổng số xấp xỉ thì hãy đọc <code>pg_class.reltuples</code> — nó miễn phí và chính xác trong khoảng vài phần trăm.</span></div>
</div>
<pre><code><span class="tok-comment">// Hình dạng phản hồi khiến cả hai chiến lược đều dùng được từ phía client</span>
{
  "rows": [ /* … */ ],
  "nextCursor": 41827,       <span class="tok-comment">// null khi không còn trang sau</span>
  "hasMore": true
}

<span class="tok-comment">// hasMore mà không cần câu truy vấn thứ hai: xin nhiều hơn một hàng so với nhu cầu</span>
const rows = await prisma.post.findMany({ take: size + 1, /* … */ });
const hasMore = rows.length &gt; size;
if (hasMore) rows.pop();</code></pre>
<div class="callout ok">
<p><strong>Mẹo <code>take: size + 1</code> đáng dùng ở khắp nơi.</strong> Nó trả lời câu "còn trang sau không" mà không cần câu truy vấn thêm và không cần đếm. Lấy hai mươi mốt hàng, trả về hai mươi, và hàng thứ hai mươi mốt — nếu tồn tại — chính là <code>hasMore</code> của bạn. Một câu lệnh, câu trả lời chính xác, chi phí hằng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/pagination" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Pagination</span><span class="lc-sub">prisma.io/docs · Offset và con trỏ đặt cạnh nhau, kèm luật <code>skip: 1</code> và các đánh đổi</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting#sorting" target="_blank" rel="noopener"><span class="lc-ico">↕️</span><span class="lc-body"><span class="lc-title">Sorting</span><span class="lc-sub">prisma.io/docs · Nhiều khoá, sắp theo quan hệ, <code>_count</code>, và vị trí của null</span></span></a>
<a class="link-card" href="https://use-the-index-luke.com/no-offset" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Use The Index, Luke — "No Offset"</span><span class="lc-sub">use-the-index-luke.com · Bản giải thích dứt khoát về việc vì sao OFFSET xuống cấp, kèm cách vá bằng so sánh bộ giá trị</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương chỉ mục</span><span class="lc-sub">Vì sao một chỉ mục phục vụ được ORDER BY mà không cần bước sắp xếp, và cái gì phá vỡ điều đó</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Chuyển một endpoint offset sang con trỏ, rồi chứng minh lỗi trôi vị trí có trước và không còn sau</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Aggregation and `groupBy`|||5.4 — Tổng hợp và `groupBy`',
      slug: 'pr-5-4-tong-hop',
      type: 'LESSON',
      description: 'aggregate với năm hàm, groupBy với having, distinct và chỗ nó chạy ở đâu, gộp nhiều truy vấn bằng $transaction, và bốn thứ groupBy KHÔNG làm được — cùng chỗ để rơi xuống SQL thô.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Aggregation and <code>groupBy</code></h2>
<p class="lead">Prisma can compute sums, averages and grouped counts without leaving the client, which covers most dashboard queries. It also stops short in four specific places, and knowing exactly where the wall is saves you from discovering it halfway through building a reports page.</p>

<h3><code>aggregate</code> — five functions, one query</h3>
<pre><code>const k = await prisma.post.aggregate({
  where: { published: true },
  _count: { _all: true, body: true },
  _sum:   { views: true },
  _avg:   { views: true },
  _min:   { publishedAt: true },
  _max:   { views: true, publishedAt: true },
});
console.log(k);</code></pre>
<div class="out">prisma:query SELECT COUNT(*), COUNT("posts"."body"), SUM("posts"."views"),
  AVG("posts"."views"), MIN("posts"."published_at"),
  MAX("posts"."views"), MAX("posts"."published_at")
  FROM "posts" WHERE "posts"."published" = $1

{
  _count: { _all: 201773, body: 189114 },
  _sum:   { views: 48219044 },
  _avg:   { views: 239.0 },
  _min:   { publishedAt: 2024-01-03T02:11:08.000Z },
  _max:   { views: 184029, publishedAt: 2026-08-23T04:11:52.000Z }
}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">One statement for all of it</span><span class="v">Seven aggregate functions, one scan. Doing this as seven separate <code>count</code>/<code>findFirst</code> calls is seven scans of the same table — a real difference on anything large.</span></div>
  <div class="kv"><span class="k"><code>_count: { field }</code> counts non-NULL</span><span class="v"><code>_all: true</code> counts rows; <code>body: true</code> counts rows where <code>body</code> is not null. That distinction is how you get a "completeness" metric in the same query.</span></div>
  <div class="kv"><span class="k"><code>_avg</code> and <code>_sum</code> return <code>null</code> on no rows</span><span class="v">Not <code>0</code>. <code>SUM</code> of an empty set is <code>NULL</code> in SQL, and Prisma passes that through faithfully. Every consumer needs <code>?? 0</code>.</span></div>
  <div class="kv"><span class="k">Decimal columns come back as Decimal</span><span class="v"><code>_sum</code> of a <code>Decimal</code> is a <code>Prisma.Decimal</code>, not a number — the same serialisation trap as Lesson 2.1. Convert at the API boundary.</span></div>
</div>

<h3><code>groupBy</code> — the dashboard query</h3>
<pre><code>const byMonth = await prisma.order.groupBy({
  by:      ['status'],
  where:   { createdAt: { gte: dauThang } },
  _count:  { _all: true },
  _sum:    { total: true },
  _avg:    { total: true },
  orderBy: { _sum: { total: 'desc' } },
});
console.log(byMonth);</code></pre>
<div class="out">prisma:query SELECT "orders"."status", COUNT(*), SUM("orders"."total"), AVG("orders"."total")
  FROM "orders" WHERE "orders"."created_at" &gt;= $1
  GROUP BY "orders"."status"
  ORDER BY SUM("orders"."total") DESC

[
  { status: 'DA_GIAO',    _count: { _all: 4128 }, _sum: { total: 812440000 }, _avg: { total: 196812.5 } },
  { status: 'DANG_XU_LY', _count: { _all:  391 }, _sum: { total:  74280000 }, _avg: { total: 189974.4 } },
  { status: 'DA_HUY',     _count: { _all:  204 }, _sum: { total:  31900000 }, _avg: { total: 156372.5 } }
]</div>
<pre><code><span class="tok-comment">// Group by several fields, and filter the GROUPS with &#96;having&#96;</span>
const byAuthor = await prisma.post.groupBy({
  by:     ['authorId', 'published'],
  _count: { _all: true },
  _avg:   { views: true },
  having: { views: { _avg: { gt: 100 } } },      <span class="tok-comment">// HAVING AVG(views) &gt; 100</span>
  orderBy: [{ authorId: 'asc' }],
});</code></pre>
<div class="out">SELECT "author_id", "published", COUNT(*), AVG("views") FROM "posts"
GROUP BY "author_id", "published"
HAVING AVG("views") &gt; $1
ORDER BY "author_id" ASC</div>
<div class="callout">
<p><strong><code>where</code> filters rows; <code>having</code> filters groups.</strong> <code>where: { views: { gt: 100 } }</code> means "only consider posts with over 100 views, then average them". <code>having: { views: { _avg: { gt: 100 } } }</code> means "consider all posts, then keep authors whose average exceeds 100". Different questions, different answers, and mixing them up produces a report that is confidently wrong.</p>
</div>

<h3>The four things <code>groupBy</code> cannot do</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Group by an expression</span><span class="lz-lnote">"Orders per month" needs <code>GROUP BY date_trunc('month', created_at)</code>. You can only group by columns, so this needs raw SQL — or a generated <code>month</code> column maintained by a trigger.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Group across a relation</span><span class="lz-lnote">"Revenue per customer city" spans <code>orders</code> and <code>customers</code>. <code>groupBy</code> works on one model. Raw SQL, or denormalise the city onto the order — which is what most e-commerce schemas end up doing anyway, because the city at order time is not the city today.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Window functions</span><span class="lz-lnote">Running totals, rank within group, "each customer's three most recent orders". <code>ROW_NUMBER() OVER (PARTITION BY …)</code> has no Prisma equivalent and probably never will.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Fill gaps in a series</span><span class="lz-lnote">A day with no orders produces no row, so a 30-day chart silently has 26 bars. The fix is <code>generate_series</code> and a <code>LEFT JOIN</code> — raw SQL, and the single most common reason a dashboard query leaves Prisma.</span></div>
</div>
<pre><code><span class="tok-comment">// All four, in one raw query — this is the shape of most real dashboard SQL</span>
type Day = { day: Date; orderCount: bigint; revenue: bigint };

const bieuDo = await prisma.$queryRaw&lt;Day[]&gt;&#96;
  SELECT d.day,
         COUNT(o.id)               AS "orderCount",
         COALESCE(SUM(o.total), 0) AS "revenue"
  FROM generate_series(\${from}::date, \${to}::date, '1 day') AS d(day)
  LEFT JOIN orders o
    ON o.created_at &gt;= d.day
   AND o.created_at &lt;  d.day + INTERVAL '1 day'
   AND o.status = 'DA_GIAO'
  GROUP BY d.day
  ORDER BY d.day&#96;;</code></pre>
<div class="out">[
  { day: 2026-08-01, orderCount: 128n, revenue: 24180000n },
  { day: 2026-08-02, orderCount:   0n, revenue:        0n },   ← the gap, filled
  { day: 2026-08-03, orderCount:  94n, revenue: 18402000n }
]</div>
<div class="pitfall">
<p><strong>Trap — <code>COUNT</code> and <code>SUM</code> come back as <code>BigInt</code> from a raw query.</strong> PostgreSQL returns <code>bigint</code> for both, and the driver maps it to the JavaScript <code>bigint</code> primitive. <code>JSON.stringify</code> then throws <code>TypeError: Do not know how to serialize a BigInt</code>. Cast in SQL (<code>COUNT(*)::int</code>) or convert in JavaScript (<code>Number(row.orderCount)</code>) before the response — and note that Prisma's own <code>_count</code> does this for you, which is why the problem only appears once you drop to raw.</p>
</div>

<h3><code>distinct</code>, and where it actually runs</h3>
<pre><code><span class="tok-comment">// One post per author — the newest, because of the ordering</span>
const onePostPerPerson = await prisma.post.findMany({
  distinct: ['authorId'],
  orderBy:  [{ authorId: 'asc' }, { publishedAt: 'desc' }],
  take:     50,
});</code></pre>
<div class="out">prisma:query SELECT DISTINCT ON ("posts"."author_id") ... FROM "posts"
  ORDER BY "posts"."author_id" ASC, "posts"."published_at" DESC LIMIT $1</div>
<div class="kv-grid">
  <div class="kv"><span class="k">On PostgreSQL: a real <code>DISTINCT ON</code></span><span class="v">Executed in the database, and it requires the distinct columns to come first in <code>orderBy</code> — which is a PostgreSQL rule, not a Prisma one, and the error message says so plainly.</span></div>
  <div class="kv"><span class="k">On other providers: in memory</span><span class="v">MySQL has no <code>DISTINCT ON</code>, so Prisma fetches the rows and de-duplicates in the query engine. Correct results, and <code>take</code> is applied <em>after</em> de-duplication — so the database may return far more rows than you asked for.</span></div>
  <div class="kv"><span class="k">Inside an <code>include</code>, always in memory</span><span class="v">A <code>distinct</code> on a nested relation is applied by the engine. It shapes the result but does not reduce the work the database did. Check the query log before relying on it for performance.</span></div>
</div>

<h3>Several aggregates in one round trip</h3>
<pre><code><span class="tok-comment">// A dashboard needs six numbers. Six awaits = six round trips.</span>
const [
  tongNguoiDung, nguoiDungMoi, tongBai, baiHomNay, theoTrangThai, topTacGia,
] = await prisma.$transaction([
  prisma.user.count(),
  prisma.user.count({ where: { createdAt: { gte: homNay } } }),
  prisma.post.count({ where: { published: true } }),
  prisma.post.count({ where: { createdAt: { gte: homNay } } }),
  prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
  prisma.post.groupBy({ by: ['authorId'], _count: { _all: true },
                        orderBy: { _count: { authorId: 'desc' } }, take: 5 }),
]);</code></pre>
<div class="out">-- six separate awaits
real    0m0.412s

-- one $transaction array
real    0m0.087s</div>
<p>Nearly five times faster, and the numbers are now consistent with each other — they all see the same snapshot, so the totals cannot disagree because a row was inserted between query three and query four. The array form of <code>$transaction</code> is covered properly in Chapter 7; for read-only dashboards it is simply free.</p>

<div class="callout ok">
<p><strong>When to stop using <code>groupBy</code> entirely.</strong> If a dashboard query takes more than a second, no amount of Prisma will fix it — aggregating a million rows on every page load is the wrong shape regardless of the client. The answers are the same as they have always been: a summary table refreshed on a schedule, a materialised view, or a counter maintained on write. Chapter 9 measures the first two; the point here is that reaching raw SQL is not the last step, it is the second-to-last.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">Aggregation, grouping and summarizing</span><span class="lc-sub">prisma.io/docs · <code>aggregate</code>, <code>groupBy</code>, <code>count</code> and <code>distinct</code> in one page</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-client-reference#groupby" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title"><code>groupBy</code> — reference</span><span class="lc-sub">prisma.io/docs · The <code>having</code> syntax and the rules linking <code>by</code>, <code>orderBy</code> and the aggregates</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/functions-srf.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — generate_series</span><span class="lc-sub">postgresql.org · The gap-filling function every time-series chart needs</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, window functions chapter</span><span class="lc-sub">Running totals, ranks and partitions — everything <code>groupBy</code> cannot express</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Build a six-number dashboard in one round trip, then add a 30-day chart with no missing bars</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Tổng hợp và <code>groupBy</code></h2>
<p class="lead">Prisma tính được tổng, trung bình và số đếm theo nhóm mà không cần rời client, và bấy nhiêu phủ hết phần lớn truy vấn của một bảng điều khiển. Nó cũng dừng lại ở đúng bốn chỗ, và biết chính xác bức tường nằm ở đâu sẽ cứu bạn khỏi việc phát hiện ra nó khi đang xây dở một trang báo cáo.</p>

<h3><code>aggregate</code> — năm hàm, một câu truy vấn</h3>
<pre><code>const k = await prisma.post.aggregate({
  where: { published: true },
  _count: { _all: true, body: true },
  _sum:   { views: true },
  _avg:   { views: true },
  _min:   { publishedAt: true },
  _max:   { views: true, publishedAt: true },
});
console.log(k);</code></pre>
<div class="out">prisma:query SELECT COUNT(*), COUNT("posts"."body"), SUM("posts"."views"),
  AVG("posts"."views"), MIN("posts"."published_at"),
  MAX("posts"."views"), MAX("posts"."published_at")
  FROM "posts" WHERE "posts"."published" = $1

{
  _count: { _all: 201773, body: 189114 },
  _sum:   { views: 48219044 },
  _avg:   { views: 239.0 },
  _min:   { publishedAt: 2024-01-03T02:11:08.000Z },
  _max:   { views: 184029, publishedAt: 2026-08-23T04:11:52.000Z }
}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một câu lệnh cho tất cả</span><span class="v">Bảy hàm tổng hợp, một lần quét. Làm chuyện này bằng bảy lời gọi <code>count</code>/<code>findFirst</code> riêng là bảy lần quét cùng một bảng — khác biệt thật trên bất cứ thứ gì lớn.</span></div>
  <div class="kv"><span class="k"><code>_count: { trường }</code> đếm giá trị khác NULL</span><span class="v"><code>_all: true</code> đếm số hàng; <code>body: true</code> đếm số hàng có <code>body</code> khác null. Phân biệt ấy là cách bạn có một chỉ số "độ đầy đủ" ngay trong cùng câu truy vấn.</span></div>
  <div class="kv"><span class="k"><code>_avg</code> và <code>_sum</code> trả <code>null</code> khi không có hàng nào</span><span class="v">Không phải <code>0</code>. <code>SUM</code> của một tập rỗng là <code>NULL</code> trong SQL, và Prisma chuyển tiếp điều đó một cách trung thực. Mọi nơi tiêu thụ đều cần <code>?? 0</code>.</span></div>
  <div class="kv"><span class="k">Cột Decimal quay về dưới dạng Decimal</span><span class="v"><code>_sum</code> của một <code>Decimal</code> là một <code>Prisma.Decimal</code>, không phải number — đúng cái bẫy tuần tự hoá ở Bài 2.1. Hãy đổi ngay tại ranh giới API.</span></div>
</div>

<h3><code>groupBy</code> — câu truy vấn của bảng điều khiển</h3>
<pre><code>const byMonth = await prisma.order.groupBy({
  by:      ['status'],
  where:   { createdAt: { gte: dauThang } },
  _count:  { _all: true },
  _sum:    { total: true },
  _avg:    { total: true },
  orderBy: { _sum: { total: 'desc' } },
});
console.log(byMonth);</code></pre>
<div class="out">prisma:query SELECT "orders"."status", COUNT(*), SUM("orders"."total"), AVG("orders"."total")
  FROM "orders" WHERE "orders"."created_at" &gt;= $1
  GROUP BY "orders"."status"
  ORDER BY SUM("orders"."total") DESC

[
  { status: 'DA_GIAO',    _count: { _all: 4128 }, _sum: { total: 812440000 }, _avg: { total: 196812.5 } },
  { status: 'DANG_XU_LY', _count: { _all:  391 }, _sum: { total:  74280000 }, _avg: { total: 189974.4 } },
  { status: 'DA_HUY',     _count: { _all:  204 }, _sum: { total:  31900000 }, _avg: { total: 156372.5 } }
]</div>
<pre><code><span class="tok-comment">// Gộp theo nhiều trường, và lọc chính các NHÓM bằng &#96;having&#96;</span>
const byAuthor = await prisma.post.groupBy({
  by:     ['authorId', 'published'],
  _count: { _all: true },
  _avg:   { views: true },
  having: { views: { _avg: { gt: 100 } } },      <span class="tok-comment">// HAVING AVG(views) &gt; 100</span>
  orderBy: [{ authorId: 'asc' }],
});</code></pre>
<div class="out">SELECT "author_id", "published", COUNT(*), AVG("views") FROM "posts"
GROUP BY "author_id", "published"
HAVING AVG("views") &gt; $1
ORDER BY "author_id" ASC</div>
<div class="callout">
<p><strong><code>where</code> lọc hàng; <code>having</code> lọc nhóm.</strong> <code>where: { views: { gt: 100 } }</code> nghĩa là "chỉ xét những bài có trên 100 lượt xem, rồi tính trung bình chúng". <code>having: { views: { _avg: { gt: 100 } } }</code> nghĩa là "xét mọi bài, rồi giữ lại những tác giả có trung bình vượt 100". Hai câu hỏi khác nhau, hai câu trả lời khác nhau, và lẫn lộn chúng đẻ ra một báo cáo sai một cách rất tự tin.</p>
</div>

<h3>Bốn thứ <code>groupBy</code> không làm được</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Gộp theo một biểu thức</span><span class="lz-lnote">"Số đơn theo tháng" cần <code>GROUP BY date_trunc('month', created_at)</code>. Bạn chỉ gộp theo cột được, nên chuyện này cần SQL thô — hoặc một cột <code>month</code> sinh ra và duy trì bằng trigger.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Gộp xuyên qua một quan hệ</span><span class="lz-lnote">"Doanh thu theo thành phố của khách" trải qua <code>orders</code> và <code>customers</code>. <code>groupBy</code> làm việc trên một model. Hãy dùng SQL thô, hoặc phi chuẩn hoá thành phố vào chính đơn hàng — mà phần lớn lược đồ thương mại điện tử rốt cuộc đều làm thế, vì thành phố lúc đặt hàng không phải thành phố hôm nay.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Hàm cửa sổ</span><span class="lz-lnote">Tổng luỹ tiến, thứ hạng trong nhóm, "ba đơn gần nhất của mỗi khách". <code>ROW_NUMBER() OVER (PARTITION BY …)</code> không có bản tương đương trong Prisma và nhiều khả năng sẽ không bao giờ có.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Lấp chỗ trống trong một chuỗi</span><span class="lz-lnote">Một ngày không có đơn nào thì không sinh ra hàng nào, nên một biểu đồ 30 ngày âm thầm chỉ có 26 cột. Cách vá là <code>generate_series</code> cộng một <code>LEFT JOIN</code> — SQL thô, và là lý do phổ biến nhất khiến một truy vấn bảng điều khiển rời khỏi Prisma.</span></div>
</div>
<pre><code><span class="tok-comment">// Cả bốn, trong một truy vấn thô — đây là hình dạng của phần lớn SQL bảng điều khiển thật</span>
type Day = { day: Date; orderCount: bigint; revenue: bigint };

const bieuDo = await prisma.$queryRaw&lt;Day[]&gt;&#96;
  SELECT d.day,
         COUNT(o.id)               AS "orderCount",
         COALESCE(SUM(o.total), 0) AS "revenue"
  FROM generate_series(\${from}::date, \${to}::date, '1 day') AS d(day)
  LEFT JOIN orders o
    ON o.created_at &gt;= d.day
   AND o.created_at &lt;  d.day + INTERVAL '1 day'
   AND o.status = 'DA_GIAO'
  GROUP BY d.day
  ORDER BY d.day&#96;;</code></pre>
<div class="out">[
  { day: 2026-08-01, orderCount: 128n, revenue: 24180000n },
  { day: 2026-08-02, orderCount:   0n, revenue:        0n },   ← chỗ trống, đã lấp
  { day: 2026-08-03, orderCount:  94n, revenue: 18402000n }
]</div>
<div class="pitfall">
<p><strong>Bẫy — <code>COUNT</code> và <code>SUM</code> quay về dưới dạng <code>BigInt</code> từ một truy vấn thô.</strong> PostgreSQL trả về <code>bigint</code> cho cả hai, và trình điều khiển ánh xạ nó sang kiểu nguyên thuỷ <code>bigint</code> của JavaScript. <code>JSON.stringify</code> khi ấy ném <code>TypeError: Do not know how to serialize a BigInt</code>. Hãy ép kiểu trong SQL (<code>COUNT(*)::int</code>) hoặc đổi trong JavaScript (<code>Number(row.orderCount)</code>) trước khi trả về — và lưu ý <code>_count</code> của chính Prisma làm hộ bạn việc đó, nên vấn đề chỉ xuất hiện khi bạn rơi xuống SQL thô.</p>
</div>

<h3><code>distinct</code>, và nó thật sự chạy ở đâu</h3>
<pre><code><span class="tok-comment">// Mỗi tác giả một bài — bài mới nhất, nhờ thứ tự sắp xếp</span>
const onePostPerPerson = await prisma.post.findMany({
  distinct: ['authorId'],
  orderBy:  [{ authorId: 'asc' }, { publishedAt: 'desc' }],
  take:     50,
});</code></pre>
<div class="out">prisma:query SELECT DISTINCT ON ("posts"."author_id") ... FROM "posts"
  ORDER BY "posts"."author_id" ASC, "posts"."published_at" DESC LIMIT $1</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Trên PostgreSQL: một <code>DISTINCT ON</code> thật</span><span class="v">Thực thi trong cơ sở dữ liệu, và nó đòi các cột distinct phải đứng đầu trong <code>orderBy</code> — đó là luật của PostgreSQL chứ không phải của Prisma, và thông báo lỗi nói thẳng điều đó.</span></div>
  <div class="kv"><span class="k">Trên các provider khác: trong bộ nhớ</span><span class="v">MySQL không có <code>DISTINCT ON</code>, nên Prisma kéo các hàng về rồi khử trùng trong query engine. Kết quả đúng, và <code>take</code> được áp dụng <em>sau</em> khi khử trùng — nên cơ sở dữ liệu có thể trả về nhiều hàng hơn bạn xin rất nhiều.</span></div>
  <div class="kv"><span class="k">Bên trong một <code>include</code> thì luôn ở bộ nhớ</span><span class="v">Một <code>distinct</code> trên quan hệ lồng nhau do engine áp dụng. Nó nắn kết quả nhưng không giảm phần việc cơ sở dữ liệu đã làm. Hãy kiểm log truy vấn trước khi trông cậy vào nó về mặt hiệu năng.</span></div>
</div>

<h3>Nhiều phép tổng hợp trong một lượt đi về</h3>
<pre><code><span class="tok-comment">// Một bảng điều khiển cần sáu con số. Sáu lần await = sáu lượt đi về.</span>
const [
  tongNguoiDung, nguoiDungMoi, tongBai, baiHomNay, theoTrangThai, topTacGia,
] = await prisma.$transaction([
  prisma.user.count(),
  prisma.user.count({ where: { createdAt: { gte: homNay } } }),
  prisma.post.count({ where: { published: true } }),
  prisma.post.count({ where: { createdAt: { gte: homNay } } }),
  prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
  prisma.post.groupBy({ by: ['authorId'], _count: { _all: true },
                        orderBy: { _count: { authorId: 'desc' } }, take: 5 }),
]);</code></pre>
<div class="out">-- sáu lần await riêng
real    0m0.412s

-- một mảng $transaction
real    0m0.087s</div>
<p>Nhanh gần gấp năm lần, và các con số giờ nhất quán với nhau — tất cả đều nhìn cùng một bản chụp, nên các tổng không thể lệch nhau chỉ vì có một hàng được chèn vào giữa câu truy vấn thứ ba và thứ tư. Dạng mảng của <code>$transaction</code> được nói đủ ở Chương 7; với một bảng điều khiển chỉ đọc thì nó đơn giản là miễn phí.</p>

<div class="callout ok">
<p><strong>Khi nào nên thôi dùng <code>groupBy</code> hẳn.</strong> Nếu một truy vấn bảng điều khiển mất hơn một giây thì không lượng Prisma nào vá được — tổng hợp một triệu hàng ở mỗi lần tải trang là một hình dạng sai, bất kể client là gì. Câu trả lời vẫn như xưa nay: một bảng tổng hợp làm mới theo lịch, một materialised view, hoặc một cột đếm duy trì lúc ghi. Chương 9 đo hai cái đầu; điều đáng nói ở đây là rơi xuống SQL thô không phải bước cuối cùng, nó là bước áp chót.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">Aggregation, grouping and summarizing</span><span class="lc-sub">prisma.io/docs · <code>aggregate</code>, <code>groupBy</code>, <code>count</code> và <code>distinct</code> gói trong một trang</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-client-reference#groupby" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title"><code>groupBy</code> — tra cứu</span><span class="lc-sub">prisma.io/docs · Cú pháp <code>having</code> và các luật ràng buộc <code>by</code>, <code>orderBy</code> với các hàm tổng hợp</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/functions-srf.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — generate_series</span><span class="lc-sub">postgresql.org · Hàm lấp chỗ trống mà mọi biểu đồ theo thời gian đều cần</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương hàm cửa sổ</span><span class="lc-sub">Tổng luỹ tiến, thứ hạng và phân vùng — mọi thứ <code>groupBy</code> diễn đạt không nổi</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Dựng một bảng điều khiển sáu con số trong một lượt đi về, rồi thêm biểu đồ 30 ngày không thiếu cột nào</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Search: four levels, measured|||5.5 — Tìm kiếm: bốn cấp độ, đo bằng số',
      slug: 'pr-5-5-tim-kiem',
      type: 'LESSON',
      description: 'Từ contains tới tsvector: bốn cách làm ô tìm kiếm, mỗi cách đo trên cùng 400k hàng, cột tsvector sinh tự động cộng chỉ mục GIN, xử lý tiếng Việt không dấu, và mốc để chuyển sang một máy tìm kiếm riêng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Search: four levels, measured</h2>
<p class="lead">Every application grows a search box, and there are exactly four answers in increasing order of effort. Most teams start at level one and stay there past the point where it hurts, because the failure is gradual — the box gets slower month by month rather than breaking. Here are all four, measured on the same 400,000 rows.</p>

<h3>Level 1 — <code>contains</code></h3>
<pre><code>const result = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: q, mode: 'insensitive' } },
      { body:  { contains: q, mode: 'insensitive' } },
    ],
  },
  take: 20,
});</code></pre>
<div class="out">SELECT ... WHERE ("title"::text ILIKE $1 OR "body"::text ILIKE $2) LIMIT $3
-- params: ["%prisma%", "%prisma%"]

Execution Time: 412.883 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">What it costs</span><span class="v">A sequential scan over every row, twice. 413 ms at 400,000 rows, and it grows linearly — at four million it is four seconds.</span></div>
  <div class="kv"><span class="k">What it gets wrong</span><span class="v">No stemming ("chạy" does not match "chạying"), no ranking (a title match scores the same as a body match), no multi-word logic (searching "prisma migrate" finds only that exact substring).</span></div>
  <div class="kv"><span class="k">When it is genuinely fine</span><span class="v">Under about 10,000 rows, or when the search is already narrowed by another indexed filter — searching within one user's own documents, for instance.</span></div>
</div>

<h3>Level 2 — trigram index</h3>
<pre><code><span class="tok-comment">-- A hand-written migration. Two statements, no code change.</span>
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);
CREATE INDEX "posts_body_trgm"  ON "posts" USING gin ("body"  gin_trgm_ops);</code></pre>
<div class="out">-- exactly the same Prisma query as level 1
Bitmap Heap Scan on posts (actual time=1.8..4.9 rows=38 loops=1)
  -&gt;  BitmapOr
        -&gt;  Bitmap Index Scan on posts_title_trgm
        -&gt;  Bitmap Index Scan on posts_body_trgm
Execution Time: 5.104 ms</div>
<div class="callout ok">
<p><strong>Eighty times faster, and the application code did not change.</strong> This is the highest-value two lines in the chapter. A GIN trigram index makes <code>ILIKE '%…%'</code> index-backed, which is normally impossible. It also brings fuzzy matching for free — <code>similarity()</code> and the <code>%</code> operator let you handle typos, which no amount of <code>contains</code> ever will. The costs are real but modest: the index is larger than a B-tree and writes are slower, so measure both if the table is write-heavy.</p>
</div>
<pre><code><span class="tok-comment">// Fuzzy matching, once the trigram index exists</span>
const attach = await prisma.$queryRaw&lt;{ id: number; title: string; sim: number }[]&gt;&#96;
  SELECT id, title, similarity(title, \${q}) AS sim
  FROM posts
  WHERE title % \${q}
  ORDER BY sim DESC
  LIMIT 20&#96;;</code></pre>
<div class="out">[
  { id: 4182, title: 'Huong dan Prisma from dau', sim: 0.42 },
  { id: 9013, title: 'Prima facie: doc lai',    sim: 0.31 }   ← typo tolerance
]</div>

<h3>Level 3 — PostgreSQL full-text search</h3>
<pre><code><span class="tok-comment">-- A generated column, maintained by PostgreSQL on every write</span>
ALTER TABLE "posts" ADD COLUMN "search" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("body",  '')), 'B')
  ) STORED;

CREATE INDEX "posts_search_idx" ON "posts" USING gin ("search");</code></pre>
<pre><code><span class="tok-comment">// Prisma cannot model tsvector, so mark it Unsupported and query it raw</span>
model Post {
  id     Int         @id @default(autoincrement())
  title  String
  body   String?
  search Unsupported ("tsvector")?      <span class="tok-comment">// generated; never written by the client</span>

  @@index([search], map: "posts_search_idx")
  @@map("posts")
}</code></pre>
<pre><code>const result = await prisma.$queryRaw&lt;{ id: number; title: string; rank: number }[]&gt;&#96;
  SELECT id, title, ts_rank("search", websearch_to_tsquery('simple', \${q})) AS rank
  FROM posts
  WHERE "search" @@ websearch_to_tsquery('simple', \${q})
  ORDER BY rank DESC, id DESC
  LIMIT 20&#96;;</code></pre>
<div class="out">Bitmap Heap Scan on posts (actual time=0.6..1.8 rows=41 loops=1)
  -&gt;  Bitmap Index Scan on posts_search_idx
Execution Time: 2.011 ms

[
  { id: 4182, title: 'Huong dan Prisma from dau', rank: 0.6079 },
  { id: 7710, title: 'Migrate voi Prisma',      rank: 0.2432 }
]</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Ranking</span><span class="lz-t"><code>setweight</code> + <code>ts_rank</code></span><span class="lz-d">A match in the title (weight A) outranks one in the body (weight B). This is the thing <code>contains</code> can never give you, and it is what makes results feel correct rather than merely present.</span></div>
  <div class="lz-step"><span class="lz-k">Query syntax</span><span class="lz-t"><code>websearch_to_tsquery</code></span><span class="lz-d">Accepts what users actually type: <code>prisma -mysql "exact phrase" or migrate</code>. Unlike <code>to_tsquery</code>, malformed input does not throw — which matters when the input is a text box.</span></div>
  <div class="lz-step"><span class="lz-k">Generated column</span><span class="lz-t"><code>GENERATED ALWAYS … STORED</code></span><span class="lz-d">PostgreSQL recomputes it on every insert and update. No trigger to maintain, no way for the index to fall out of sync with the data — which is the failure mode of the hand-maintained version.</span></div>
  <div class="lz-step"><span class="lz-k">Vietnamese</span><span class="lz-t"><code>'simple'</code>, not <code>'english'</code></span><span class="lz-d">There is no Vietnamese stemmer in core PostgreSQL. <code>'simple'</code> just lowercases and splits on whitespace, which is correct here — <code>'english'</code> would mangle Vietnamese words by applying English stemming rules to them.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — accent-insensitive search in Vietnamese.</strong> A user typing <code>tieng viet</code> will not match <code>tiếng việt</code>, because they are different strings and <code>'simple'</code> does not fold diacritics. The fix is the <code>unaccent</code> extension, applied on both sides — in the generated column and in the query. Miss one side and search silently returns nothing for half your users, which is the kind of bug that survives for months because the people it affects assume the content is not there.</p>
</div>
<pre><code><span class="tok-comment">-- Accent-insensitive: unaccent on BOTH sides</span>
CREATE EXTENSION IF NOT EXISTS unaccent;

<span class="tok-comment">-- unaccent() is not IMMUTABLE by default, so wrap it for a generated column</span>
CREATE FUNCTION unaccented(text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  AS $$ SELECT unaccent('unaccent', $1) $$;

ALTER TABLE "posts" ADD COLUMN "search" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', unaccented(coalesce("title", ''))), 'A') ||
    setweight(to_tsvector('simple', unaccented(coalesce("body",  ''))), 'B')
  ) STORED;</code></pre>
<pre><code>WHERE "search" @@ websearch_to_tsquery('simple', unaccented(\${q}))</code></pre>

<h3>Level 4 — a dedicated search engine</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The threshold</span><span class="v">Typo tolerance across the whole corpus, faceted filters, synonyms, per-user relevance tuning, or millions of documents. PostgreSQL full-text search handles a lot, and it stops well short of that list.</span></div>
  <div class="kv"><span class="k">What it costs</span><span class="v">A second datastore to run, an indexing pipeline to keep in sync, and a permanent consistency question — the search index is always a little behind the database, and the UI has to be honest about it.</span></div>
  <div class="kv"><span class="k">Do not skip level 3</span><span class="v">Teams reach for Elasticsearch at 50,000 rows and inherit an operational burden that a <code>tsvector</code> column would have deferred by years. Measure first; the numbers above are the argument.</span></div>
  <div class="kv"><span class="k">Prisma's own <code>search</code> operator</span><span class="v">There is a preview <code>fullTextSearch</code> feature exposing <code>{ title: { search: 'prisma &amp; migrate' } }</code>. It compiles to <code>to_tsquery</code> with no stored column and no index — so it is convenient and does not solve the performance problem. Use the raw form above.</span></div>
</div>

<h3>The four, side by side</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · <code>contains</code></span><span class="lz-lnote">413 ms · zero setup · no ranking, no stemming, no typo tolerance. Correct answer below ~10,000 rows or behind another indexed filter.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · trigram index</span><span class="lz-lnote">5 ms · two lines of SQL, no code change · adds fuzzy matching. The best effort-to-benefit ratio of the four, by a wide margin.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · <code>tsvector</code> + GIN</span><span class="lz-lnote">2 ms · a generated column, an <code>Unsupported</code> field and raw queries · adds ranking and real query syntax. Where most applications should end up.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · search engine</span><span class="lz-lnote">Sub-millisecond · a second system to operate · adds everything else. Justified by requirements, not by row count alone.</span></div>
</div>

<div class="note-ct">
<p><strong>From the CuongThai codebase.</strong> This database runs <code>pg_trgm</code> for fuzzy post search and <code>pgvector</code> for embeddings — level two plus a semantic layer, with no separate search engine. The trigram index arrived as a hand-written migration (<code>20260623_gin_social_posts_content_trgm</code>) for exactly the reason described above: Prisma cannot declare a GIN trigram index, the application query did not change, and the search box stopped being slow.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.postgresql.org/docs/current/textsearch.html" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">PostgreSQL — full text search</span><span class="lc-sub">postgresql.org · <code>tsvector</code>, <code>tsquery</code>, weights, ranking and dictionaries, from the source</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/pgtrgm.html" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_trgm</span><span class="lc-sub">postgresql.org · Trigram indexes, <code>similarity()</code> and the <code>%</code> operator</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">Prisma — full-text search</span><span class="lc-sub">prisma.io/docs · The preview <code>search</code> operator, its syntax and its limits</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, index chapter</span><span class="lc-sub">GIN internals: why it serves containment queries and what it costs on write</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Take a search box through all four levels on the same dataset, measuring at each step</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Tìm kiếm: bốn cấp độ, đo bằng số</h2>
<p class="lead">Ứng dụng nào rồi cũng mọc ra một ô tìm kiếm, và có đúng bốn câu trả lời xếp theo mức công sức tăng dần. Phần lớn đội bắt đầu ở cấp một rồi ở lại đó quá lâu sau khi nó bắt đầu đau, vì thất bại diễn ra từ từ — ô tìm kiếm chậm dần theo từng tháng chứ không hỏng hẳn. Đây là cả bốn cấp, đo trên cùng 400.000 hàng.</p>

<h3>Cấp 1 — <code>contains</code></h3>
<pre><code>const result = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: q, mode: 'insensitive' } },
      { body:  { contains: q, mode: 'insensitive' } },
    ],
  },
  take: 20,
});</code></pre>
<div class="out">SELECT ... WHERE ("title"::text ILIKE $1 OR "body"::text ILIKE $2) LIMIT $3
-- tham số: ["%prisma%", "%prisma%"]

Execution Time: 412.883 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó tốn gì</span><span class="v">Một lần quét tuần tự qua mọi hàng, hai lần. 413 ms ở 400.000 hàng, và nó tăng tuyến tính — ở bốn triệu hàng thì là bốn giây.</span></div>
  <div class="kv"><span class="k">Nó sai ở đâu</span><span class="v">Không rút gốc từ, không xếp hạng (khớp ở tiêu đề tính điểm y hệt khớp ở nội dung), không có logic nhiều từ (tìm "prisma migrate" chỉ ra đúng chuỗi con đó).</span></div>
  <div class="kv"><span class="k">Khi nào nó thật sự ổn</span><span class="v">Dưới khoảng 10.000 hàng, hoặc khi phép tìm vốn đã bị thu hẹp bởi một bộ lọc có chỉ mục khác — ví dụ tìm trong đúng tài liệu của một người dùng.</span></div>
</div>

<h3>Cấp 2 — chỉ mục trigram</h3>
<pre><code><span class="tok-comment">-- Một migration viết tay. Hai câu lệnh, không đổi dòng mã nào.</span>
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);
CREATE INDEX "posts_body_trgm"  ON "posts" USING gin ("body"  gin_trgm_ops);</code></pre>
<div class="out">-- đúng câu truy vấn Prisma của cấp 1
Bitmap Heap Scan on posts (actual time=1.8..4.9 rows=38 loops=1)
  -&gt;  BitmapOr
        -&gt;  Bitmap Index Scan on posts_title_trgm
        -&gt;  Bitmap Index Scan on posts_body_trgm
Execution Time: 5.104 ms</div>
<div class="callout ok">
<p><strong>Nhanh gấp tám mươi lần, và mã ứng dụng không đổi một chữ.</strong> Đây là hai dòng đáng giá nhất trong cả chương. Một chỉ mục trigram GIN khiến <code>ILIKE '%…%'</code> được chỉ mục đỡ, điều vốn dĩ là bất khả. Nó còn cho thêm phép khớp mờ miễn phí — <code>similarity()</code> và toán tử <code>%</code> cho phép bạn xử lý lỗi gõ, thứ mà <code>contains</code> không bao giờ làm được. Cái giá là có thật nhưng vừa phải: chỉ mục to hơn B-tree và ghi chậm hơn, nên hãy đo cả hai nếu bảng nặng ghi.</p>
</div>
<pre><code><span class="tok-comment">// Khớp mờ, một khi đã có chỉ mục trigram</span>
const attach = await prisma.$queryRaw&lt;{ id: number; title: string; sim: number }[]&gt;&#96;
  SELECT id, title, similarity(title, \${q}) AS sim
  FROM posts
  WHERE title % \${q}
  ORDER BY sim DESC
  LIMIT 20&#96;;</code></pre>
<div class="out">[
  { id: 4182, title: 'Huong dan Prisma from dau', sim: 0.42 },
  { id: 9013, title: 'Prima facie: doc lai',    sim: 0.31 }   ← chịu được lỗi gõ
]</div>

<h3>Cấp 3 — tìm kiếm toàn văn của PostgreSQL</h3>
<pre><code><span class="tok-comment">-- Một cột sinh ra, do PostgreSQL tự duy trì ở mọi lần ghi</span>
ALTER TABLE "posts" ADD COLUMN "search" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("body",  '')), 'B')
  ) STORED;

CREATE INDEX "posts_search_idx" ON "posts" USING gin ("search");</code></pre>
<pre><code><span class="tok-comment">// Prisma không mô hình hoá được tsvector, nên đánh dấu Unsupported và truy vấn thô</span>
model Post {
  id     Int         @id @default(autoincrement())
  title  String
  body   String?
  search Unsupported ("tsvector")?      <span class="tok-comment">// sinh ra; client không bao giờ ghi</span>

  @@index([search], map: "posts_search_idx")
  @@map("posts")
}</code></pre>
<pre><code>const result = await prisma.$queryRaw&lt;{ id: number; title: string; rank: number }[]&gt;&#96;
  SELECT id, title, ts_rank("search", websearch_to_tsquery('simple', \${q})) AS rank
  FROM posts
  WHERE "search" @@ websearch_to_tsquery('simple', \${q})
  ORDER BY rank DESC, id DESC
  LIMIT 20&#96;;</code></pre>
<div class="out">Bitmap Heap Scan on posts (actual time=0.6..1.8 rows=41 loops=1)
  -&gt;  Bitmap Index Scan on posts_search_idx
Execution Time: 2.011 ms

[
  { id: 4182, title: 'Huong dan Prisma from dau', rank: 0.6079 },
  { id: 7710, title: 'Migrate voi Prisma',      rank: 0.2432 }
]</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Xếp hạng</span><span class="lz-t"><code>setweight</code> + <code>ts_rank</code></span><span class="lz-d">Khớp ở tiêu đề (trọng số A) xếp trên khớp ở nội dung (trọng số B). Đây là thứ <code>contains</code> không bao giờ cho bạn, và là thứ khiến kết quả cảm thấy đúng chứ không chỉ đơn thuần là có.</span></div>
  <div class="lz-step"><span class="lz-k">Cú pháp truy vấn</span><span class="lz-t"><code>websearch_to_tsquery</code></span><span class="lz-d">Nhận đúng thứ người dùng gõ ra: <code>prisma -mysql "cụm chính xác" or migrate</code>. Khác <code>to_tsquery</code>, đầu vào hỏng không làm nó ném lỗi — và điều đó quan trọng khi đầu vào là một ô nhập chữ.</span></div>
  <div class="lz-step"><span class="lz-k">Cột sinh ra</span><span class="lz-t"><code>GENERATED ALWAYS … STORED</code></span><span class="lz-d">PostgreSQL tính lại nó ở mọi lần chèn và cập nhật. Không có trigger phải duy trì, không có cách nào để chỉ mục lệch nhịp với dữ liệu — và đó chính là kiểu hỏng của bản duy trì bằng tay.</span></div>
  <div class="lz-step"><span class="lz-k">Tiếng Việt</span><span class="lz-t"><code>'simple'</code>, không phải <code>'english'</code></span><span class="lz-d">Lõi PostgreSQL không có bộ rút gốc từ tiếng Việt. <code>'simple'</code> chỉ hạ chữ thường và tách theo khoảng trắng, và như thế là đúng ở đây — <code>'english'</code> sẽ băm nát từ tiếng Việt bằng cách áp luật rút gốc tiếng Anh lên chúng.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — tìm kiếm không dấu trong tiếng Việt.</strong> Người dùng gõ <code>tieng viet</code> sẽ không khớp <code>tiếng việt</code>, vì đó là hai chuỗi khác nhau và <code>'simple'</code> không gỡ dấu. Cách vá là extension <code>unaccent</code>, áp dụng ở cả hai phía — trong cột sinh ra và trong câu truy vấn. Bỏ sót một phía thì tìm kiếm âm thầm trả về rỗng cho một nửa số người dùng, và đó là loại lỗi sống sót hàng tháng trời vì những người bị ảnh hưởng cứ tưởng nội dung không có ở đó.</p>
</div>
<pre><code><span class="tok-comment">-- Không phân biệt dấu: unaccent ở CẢ HAI phía</span>
CREATE EXTENSION IF NOT EXISTS unaccent;

<span class="tok-comment">-- unaccent() mặc định không IMMUTABLE, nên phải bọc lại mới dùng cho cột sinh ra</span>
CREATE FUNCTION unaccented(text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  AS $$ SELECT unaccent('unaccent', $1) $$;

ALTER TABLE "posts" ADD COLUMN "search" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', unaccented(coalesce("title", ''))), 'A') ||
    setweight(to_tsvector('simple', unaccented(coalesce("body",  ''))), 'B')
  ) STORED;</code></pre>
<pre><code>WHERE "search" @@ websearch_to_tsquery('simple', unaccented(\${q}))</code></pre>

<h3>Cấp 4 — một máy tìm kiếm riêng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ngưỡng chuyển</span><span class="v">Chịu lỗi gõ trên toàn bộ kho dữ liệu, bộ lọc phân mặt, từ đồng nghĩa, chỉnh độ liên quan theo từng người dùng, hoặc hàng triệu tài liệu. Tìm kiếm toàn văn của PostgreSQL kham được nhiều thứ, và nó dừng lại khá xa trước danh sách đó.</span></div>
  <div class="kv"><span class="k">Nó tốn gì</span><span class="v">Thêm một kho dữ liệu phải vận hành, một đường ống lập chỉ mục phải giữ đồng bộ, và một câu hỏi nhất quán vĩnh viễn — chỉ mục tìm kiếm luôn chậm hơn cơ sở dữ liệu một chút, và giao diện phải trung thực về điều đó.</span></div>
  <div class="kv"><span class="k">Đừng bỏ qua cấp 3</span><span class="v">Nhiều đội với tay tới Elasticsearch ở mốc 50.000 hàng và thừa hưởng một gánh nặng vận hành mà một cột <code>tsvector</code> đáng lẽ đã hoãn được vài năm. Hãy đo trước; những con số ở trên chính là lý lẽ.</span></div>
  <div class="kv"><span class="k">Toán tử <code>search</code> của chính Prisma</span><span class="v">Có một tính năng preview <code>fullTextSearch</code> phơi ra <code>{ title: { search: 'prisma &amp; migrate' } }</code>. Nó biên dịch thành <code>to_tsquery</code> mà không có cột lưu sẵn và không có chỉ mục — nên nó tiện và không giải quyết bài toán hiệu năng. Hãy dùng dạng thô ở trên.</span></div>
</div>

<h3>Bốn cấp, đặt cạnh nhau</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · <code>contains</code></span><span class="lz-lnote">413 ms · không cần chuẩn bị gì · không xếp hạng, không rút gốc từ, không chịu được lỗi gõ. Câu trả lời đúng khi dưới ~10.000 hàng hoặc khi nằm sau một bộ lọc có chỉ mục khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · chỉ mục trigram</span><span class="lz-lnote">5 ms · hai dòng SQL, không đổi mã · thêm khớp mờ. Tỉ lệ công-sức-trên-lợi-ích tốt nhất trong bốn cấp, hơn hẳn phần còn lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · <code>tsvector</code> + GIN</span><span class="lz-lnote">2 ms · một cột sinh ra, một trường <code>Unsupported</code> và các truy vấn thô · thêm xếp hạng và cú pháp truy vấn thật. Đây là chỗ phần lớn ứng dụng nên dừng lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · máy tìm kiếm</span><span class="lz-lnote">Dưới một mili giây · thêm một hệ thống phải vận hành · thêm mọi thứ còn lại. Được biện minh bởi yêu cầu chức năng, không phải bởi riêng số hàng.</span></div>
</div>

<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai.</strong> Cơ sở dữ liệu này chạy <code>pg_trgm</code> cho phần tìm bài viết gần đúng và <code>pgvector</code> cho embedding — tức cấp hai cộng một tầng ngữ nghĩa, không có máy tìm kiếm riêng nào. Chỉ mục trigram đến dưới dạng một migration viết tay (<code>20260623_gin_social_posts_content_trgm</code>) đúng vì lý do mô tả ở trên: Prisma không khai được chỉ mục trigram GIN, câu truy vấn của ứng dụng không đổi, và ô tìm kiếm thôi chậm.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.postgresql.org/docs/current/textsearch.html" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">PostgreSQL — tìm kiếm toàn văn</span><span class="lc-sub">postgresql.org · <code>tsvector</code>, <code>tsquery</code>, trọng số, xếp hạng và từ điển, lấy từ nguồn gốc</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/pgtrgm.html" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_trgm</span><span class="lc-sub">postgresql.org · Chỉ mục trigram, <code>similarity()</code> và toán tử <code>%</code></span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">Prisma — full-text search</span><span class="lc-sub">prisma.io/docs · Toán tử <code>search</code> ở dạng preview, cú pháp và giới hạn của nó</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương chỉ mục</span><span class="lc-sub">Bên trong GIN: vì sao nó phục vụ được truy vấn chứa và nó tốn gì lúc ghi</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Đưa một ô tìm kiếm đi qua cả bốn cấp trên cùng một bộ dữ liệu, đo ở từng bước</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 5.6 ─────────────────────────── */
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Trắc nghiệm Chương 5',
      slug: 'pr-5-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu: not và NULL, contains với chỉ mục, every trên tập rỗng, lọc cha so với lọc con, cursor phải unique, skip:1, where so với having, và BigInt từ truy vấn thô.',
      content: `
<div class="ml-en">
<p>Eight questions on querying. Four of them are three-valued-logic or off-by-one traps — the kind that produce a wrong answer rather than an error.</p>
</div>
<div class="ml-vi">
<p>Tám câu về truy vấn. Bốn trong số đó là bẫy logic ba giá trị hoặc bẫy lệch một — loại đẻ ra một câu trả lời sai chứ không phải một lỗi.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A nullable `published` column, filtered with `{ not: true }`. Which rows come back?|||Một cột `published` cho phép null, lọc bằng `{ not: true }`. Những hàng nào quay về?',
            options: [
              'Only rows where published is false — NULL rows are excluded, because NULL <> true is NULL, not TRUE|||Chỉ những hàng có published bằng false — các hàng NULL bị loại, vì NULL <> true cho ra NULL chứ không phải TRUE',
              'Rows where published is false and rows where it is NULL|||Những hàng có published bằng false và những hàng có nó bằng NULL',
              'Only rows where published is NULL|||Chỉ những hàng có published bằng NULL',
              'All rows — `not` with a boolean is ignored by the query engine|||Mọi hàng — `not` đi với boolean thì bị query engine bỏ qua',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is `{ title: { contains: "x" } }` slow on a large table, and what fixes it?|||Vì sao `{ title: { contains: "x" } }` chậm trên bảng lớn, và cái gì vá được?',
            options: [
              'It becomes LIKE with a leading wildcard, which no B-tree can serve; a GIN trigram index (pg_trgm) makes it index-backed|||Nó thành LIKE có ký tự đại diện ở đầu, thứ mà không B-tree nào phục vụ nổi; một chỉ mục trigram GIN (pg_trgm) khiến nó được chỉ mục đỡ',
              'It transfers every row to the client to filter there; using select fixes it|||Nó chuyển mọi hàng về client để lọc ở đó; dùng select là hết',
              'It is slow only with mode: insensitive; removing that makes it use the index|||Nó chỉ chậm khi có mode: insensitive; bỏ cái đó đi là nó dùng được chỉ mục',
              'A plain @@index([title]) resolves it — Prisma just needs to be told the column is searchable|||Một @@index([title]) thường là xong — chỉ cần bảo Prisma rằng cột đó tìm kiếm được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '`where: { posts: { every: { published: true } } }` returns users with no posts. Why?|||`where: { posts: { every: { published: true } } }` trả về cả những người dùng không có bài nào. Vì sao?',
            options: [
              'It compiles to NOT EXISTS (… NOT matching …), and a parent with no children has no violating row — vacuous truth. Pair it with `some: {}`|||Nó biên dịch thành NOT EXISTS (… KHÔNG khớp …), và một cha không có con thì không có hàng nào vi phạm — chân lý rỗng. Hãy ghép nó với `some: {}`',
              'It is a Prisma bug, fixed by using `none: { published: false }` instead|||Đó là một con bọ của Prisma, vá bằng cách dùng `none: { published: false }` thay thế',
              'Because `every` ignores the filter and matches all parents|||Vì `every` bỏ qua bộ lọc và khớp mọi cha',
              'Because users with no posts have posts: null, which matches any filter|||Vì người dùng không có bài nào thì posts là null, và null khớp mọi bộ lọc',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does `include: { posts: { where: { published: true } } }` filter?|||`include: { posts: { where: { published: true } } }` lọc cái gì?',
            options: [
              'The children only — every user still appears, most with posts: []. To filter the users you also need a top-level where|||Chỉ các con — mọi người dùng vẫn xuất hiện, phần lớn kèm posts: []. Muốn lọc người dùng thì cần thêm một where ở tầng trên',
              'The parents only — only users with a published post appear, each with all their posts|||Chỉ các cha — chỉ người dùng có bài đã đăng mới xuất hiện, mỗi người kèm tất cả bài viết',
              'Both — it filters the users and their posts in one go|||Cả hai — nó lọc cả người dùng lẫn bài viết của họ trong một lần',
              'Nothing — a where inside include is ignored and must go at the top level|||Không gì cả — where bên trong include bị bỏ qua và phải đặt ở tầng trên',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'At OFFSET 1000000 a query takes 982 ms. What is the fix?|||Ở OFFSET 1000000 một câu truy vấn mất 982 ms. Cách vá là gì?',
            options: [
              'Cursor pagination — the cursor becomes WHERE id <= $2, so the index seeks to the position instead of counting to it, in constant time|||Phân trang bằng con trỏ — con trỏ thành WHERE id <= $2, nên chỉ mục nhảy thẳng tới vị trí thay vì đếm tới đó, với thời gian hằng',
              'An index on the ORDER BY column — the scan is slow because it has to sort|||Một chỉ mục trên cột ORDER BY — nó chậm vì phải sắp xếp',
              'Increasing the connection pool so more rows can be fetched in parallel|||Tăng connection pool để lấy được nhiều hàng song song hơn',
              'Adding take alongside skip, which lets PostgreSQL skip the discarded rows|||Thêm take đi kèm skip, để PostgreSQL bỏ qua được các hàng bị vứt',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why must `skip: 1` accompany a cursor?|||Vì sao `skip: 1` phải đi kèm một con trỏ?',
            options: [
              'The cursor row is included by default, so without it the last row of each page becomes the first row of the next|||Hàng con trỏ mặc định được bao gồm, nên nếu thiếu thì hàng cuối của mỗi trang thành hàng đầu của trang sau',
              'It tells Prisma the cursor is a position rather than a row id|||Nó báo cho Prisma biết con trỏ là một vị trí chứ không phải một id hàng',
              'It is only needed when the cursor field is not the primary key|||Nó chỉ cần khi trường con trỏ không phải khoá chính',
              'It is not required — Prisma excludes the cursor row automatically|||Nó không bắt buộc — Prisma tự loại hàng con trỏ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In `groupBy`, what is the difference between `where` and `having`?|||Trong `groupBy`, `where` và `having` khác nhau ở đâu?',
            options: [
              'where filters the rows before grouping; having filters the resulting groups by an aggregate|||where lọc các hàng trước khi gộp nhóm; having lọc các nhóm kết quả theo một hàm tổng hợp',
              'where filters groups; having filters rows — the names are inherited from SQL and reversed in Prisma|||where lọc nhóm; having lọc hàng — tên gọi thừa hưởng từ SQL và bị đảo trong Prisma',
              'They are equivalent; having is an alias kept for SQL familiarity|||Hai cái tương đương; having là tên gọi khác giữ lại cho quen với SQL',
              'having runs in the query engine while where runs in the database|||having chạy trong query engine còn where chạy trong cơ sở dữ liệu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A raw query with COUNT(*) throws "Do not know how to serialize a BigInt". Why?|||Một truy vấn thô có COUNT(*) ném lỗi "Do not know how to serialize a BigInt". Vì sao?',
            options: [
              'PostgreSQL returns bigint for COUNT and SUM, which maps to the JavaScript bigint primitive; cast in SQL or convert with Number() before responding|||PostgreSQL trả về bigint cho COUNT và SUM, và nó ánh xạ sang kiểu nguyên thuỷ bigint của JavaScript; hãy ép kiểu trong SQL hoặc đổi bằng Number() trước khi trả về',
              'The column type is wrong in the schema and should be BigInt|||Kiểu cột trong lược đồ đang sai và lẽ ra phải là BigInt',
              'Raw queries always return strings; the error comes from parsing|||Truy vấn thô luôn trả về chuỗi; lỗi đến từ khâu phân tích',
              'It only happens with $executeRaw; $queryRaw converts automatically|||Nó chỉ xảy ra với $executeRaw; $queryRaw tự đổi kiểu',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
