/**
 * Prisma ORM — Chương 4: Client — đọc và ghi.
 * Sáu phương thức đọc · select với include · create · update và upsert · delete và xoá mềm · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 4 — Reading and writing|||Chương 4 — Đọc và ghi',
  description: 'Toàn bộ API CRUD của Prisma Client, mỗi thao tác kèm SQL nó sinh ra: sáu cách đọc và cái nào ném lỗi, select với include và cách kiểu trả về đi theo, ghi lồng nhau, toán tử nguyên tử, upsert cùng cuộc đua bên trong nó, và mẫu xoá mềm dựng bằng client extension.',
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — The six ways to read|||4.1 — Sáu cách để đọc',
      slug: 'pr-4-1-sau-cach-doc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'findUnique, findUniqueOrThrow, findFirst, findFirstOrThrow, findMany, count — mỗi cái sinh ra SQL gì, cái nào trả null và cái nào ném lỗi, vì sao findUnique chỉ nhận trường unique, và bẫy findFirst không có orderBy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>The six ways to read</h2>
<p class="lead">Prisma has six read methods and they differ along two axes: how many rows you get, and what happens when there are none. Choosing correctly is not a style question — the wrong choice either forces a null check you do not need, or hides a missing row until it becomes a <code>TypeError</code> three functions later.</p>

<h3>The six, side by side</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>findUnique</code></span><span class="v">At most one row, addressed by a unique field. Returns <code>T | null</code>. The only method whose <code>where</code> is restricted at compile time.</span></div>
  <div class="kv"><span class="k"><code>findUniqueOrThrow</code></span><span class="v">Same query, but a missing row throws <code>P2025</code> instead of returning <code>null</code>. The return type is <code>T</code>, with no union.</span></div>
  <div class="kv"><span class="k"><code>findFirst</code></span><span class="v">The first row matching any filter, with <code>orderBy</code> deciding which "first" means. Returns <code>T | null</code>. Adds <code>LIMIT 1</code>.</span></div>
  <div class="kv"><span class="k"><code>findFirstOrThrow</code></span><span class="v">Same, throwing on nothing found. Useful for "the current active subscription" where absence is genuinely an error.</span></div>
  <div class="kv"><span class="k"><code>findMany</code></span><span class="v">An array, possibly empty. <strong>Never</strong> null and never throws for emptiness — <code>[]</code> is a valid answer, which is why it needs no <code>OrThrow</code> variant.</span></div>
  <div class="kv"><span class="k"><code>count</code></span><span class="v">A number, from <code>SELECT COUNT(*)</code>. Also does relation counts and per-field non-null counts.</span></div>
</div>

<h3>Choosing, as a decision tree</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">At most one row</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Addressed by a unique field</span><span class="lz-nsub"><code>findUnique</code> when absence is normal (a lookup by email that may not exist) · <code>findUniqueOrThrow</code> when absence is a bug (a setting your app cannot run without).</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Addressed by any filter</span><span class="lz-nsub"><code>findFirst</code> / <code>findFirstOrThrow</code>, <strong>always with an <code>orderBy</code></strong> — otherwise "first" is whatever the planner hands back today.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Many rows</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A list</span><span class="lz-nsub"><code>findMany</code>, always with <code>take</code>. Returns <code>[]</code>, never <code>null</code>, so there is no OrThrow variant and no null check to write.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Only a number</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">How many</span><span class="lz-nsub"><code>count</code>, or <code>_count</code> inside an <code>include</code> when the number belongs to a row you are already fetching.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Whether any</span><span class="lz-nsub">Not <code>count</code> — a <code>findUnique</code>/<code>findFirst</code> selecting only <code>id</code>, which stops at the first hit instead of counting every match.</span></div></div>
  </div>
</div>

<h3>Why <code>findUnique</code> refuses your filter</h3>
<pre><code>await prisma.post.findUnique({ where: { title: 'Bai dau tien' } });</code></pre>
<div class="out">TypeScript error:
Object literal may only specify known properties, and 'title' does not exist in type 'PostWhereUniqueInput'.</div>
<pre><code><span class="tok-comment">// The where type is generated from the model's unique constraints only:</span>
export type PostWhereUniqueInput =
  | { id: number }
  | { slug: string }
  | { authorId_slug: { authorId: number; slug: string } }   <span class="tok-comment">// from @@unique</span></code></pre>
<div class="callout">
<p><strong>This restriction is a feature, and a rare one.</strong> It is a compile-time guarantee that the query returns at most one row. <code>findFirst({ where: { title } })</code> compiles happily and returns an arbitrary matching row — which is fine when you meant it and a genuine bug when you assumed titles were unique. Prisma makes you say which you meant.</p>
</div>
<pre><code><span class="tok-comment">// Since Prisma 5, findUnique also accepts extra non-unique filters</span>
<span class="tok-comment">// alongside the unique one — useful for authorisation checks</span>
const bai = await prisma.post.findUnique({
  where: { id: 42, authorId: currentUserId },   <span class="tok-comment">// id is unique; authorId narrows it</span>
});</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" WHERE ("public"."posts"."id" = $1 AND "public"."posts"."author_id" = $2) LIMIT $3 OFFSET $4</div>
<p>That pattern is worth adopting: it turns "fetch the post, then check the owner" into one query that simply returns <code>null</code> for someone else's post. Fewer round trips, and no branch where you forgot the ownership check.</p>

<h3>Null or throw — pick per call site, not per codebase</h3>
<pre><code><span class="tok-comment">// Absence is expected → return null and handle it</span>
const u = await prisma.user.findUnique({ where: { email } });
if (!u) return res.status(404).json({ error: 'Khong tim thay nguoi dung' });

<span class="tok-comment">// Absence is a bug → throw, and let the error handler produce the 500</span>
const cauHinh = await prisma.setting.findUniqueOrThrow({ where: { key: 'site_name' } });

<span class="tok-comment">// The anti-pattern: pretending null cannot happen</span>
const u2 = (await prisma.user.findUnique({ where: { email } }))!;
console.log(u2.email);   <span class="tok-comment">// TypeError at runtime, far from the cause</span></code></pre>
<div class="out">PrismaClientKnownRequestError:
An operation failed because it depends on one or more records that were required but not found.
  code: 'P2025',
  meta: { modelName: 'Setting', cause: 'No record was found for a query.' }</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The <code>OrThrow</code> variants throw <code>P2025</code></span><span class="v">A single, catchable error code. Your Express error handler can map <code>P2025</code> to a 404 in one place, which is tidier than a null check in forty handlers.</span></div>
  <div class="kv"><span class="k">The non-throwing variants cost you a union</span><span class="v"><code>T | null</code> means TypeScript forces the check. That is the point — but if every call site immediately throws anyway, you have written the <code>OrThrow</code> version by hand.</span></div>
  <div class="kv"><span class="k">Never <code>!</code> a Prisma result</span><span class="v">The non-null assertion silences the compiler and moves the failure to a random later line. If you are sure, say so with <code>OrThrow</code>, which fails at the query with a useful message.</span></div>
</div>

<h3><code>findFirst</code> and the missing <code>orderBy</code></h3>
<pre><code><span class="tok-comment">// "The latest post" — except it is not</span>
const latest = await prisma.post.findFirst({ where: { published: true } });</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" WHERE "public"."posts"."published" = $1 LIMIT $2 OFFSET $3</div>
<div class="pitfall">
<p><strong>Trap — no <code>ORDER BY</code> means no defined order.</strong> PostgreSQL returns whichever row it finds first, which is usually insertion order on a fresh table and stops being so the moment rows are updated (an update rewrites the row at the end of the heap) or the planner switches to an index scan. So this works in development, works in staging, and returns a random post in production after the table has churned. <strong>Every <code>findFirst</code> needs an <code>orderBy</code></strong> — if you cannot name the ordering, you wanted <code>findMany</code> or <code>findUnique</code>.</p>
</div>
<pre><code><span class="tok-comment">// Correct</span>
const latest = await prisma.post.findFirst({
  where: { published: true },
  orderBy: { publishedAt: 'desc' },
});

<span class="tok-comment">// Ties need a tiebreaker, or the order is still undefined</span>
const latest2 = await prisma.post.findFirst({
  where: { published: true },
  orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
});</code></pre>

<h3><code>findMany</code>, and the argument you should always pass</h3>
<pre><code><span class="tok-comment">// Every field is optional, and that is the danger</span>
const all = await prisma.post.findMany();</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" OFFSET $1
-- 412,908 rows, 890 MB into a Node process with a 512 MB heap</div>
<div class="callout warn">
<p><strong>A bare <code>findMany()</code> is an unbounded read.</strong> It works on your 200-row development database and takes down the process on production. Treat <code>take</code> as mandatory: pass it always, even when you "know" the result is small, because knowing is a property of today's data. Chapter 5 covers cursor pagination for the case where you genuinely need everything.</p>
</div>
<pre><code>const page = await prisma.post.findMany({
  where: { published: true },
  orderBy: { publishedAt: 'desc' },
  take: 20,
  skip: 0,
});</code></pre>

<h3><code>count</code>, and its two other forms</h3>
<pre><code><span class="tok-comment">// 1 — plain count</span>
const n = await prisma.post.count({ where: { published: true } });

<span class="tok-comment">// 2 — count non-null values per field, in one query</span>
const c = await prisma.post.count({
  select: { _all: true, body: true, publishedAt: true },
});
console.log(c);

<span class="tok-comment">// 3 — count a relation without loading it</span>
const users = await prisma.user.findMany({
  take: 3,
  include: { _count: { select: { posts: { where: { published: true } } } } },
});
console.log(users.map((u) =&gt; [u.email, u._count.posts]));</code></pre>
<div class="out">{ _all: 412908, body: 389114, publishedAt: 201773 }
[ [ 'an@example.com', 12 ], [ 'binh@example.com', 0 ], [ 'chi@example.com', 41 ] ]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Per-field counts are cheap</span><span class="v">One <code>SELECT COUNT(*), COUNT(body), COUNT(published_at)</code>. Three answers, one scan — much better than three separate queries.</span></div>
  <div class="kv"><span class="k"><code>_count</code> beats <code>.length</code></span><span class="v"><code>include: { posts: true }</code> then <code>posts.length</code> loads every post to count them. <code>_count</code> is a correlated subquery that loads none. On a user with 4,000 posts the difference is the whole request.</span></div>
  <div class="kv"><span class="k">Counting is not free either</span><span class="v"><code>COUNT(*)</code> on a large PostgreSQL table is a full scan — there is no stored row count. If you show a total on every page load, cache it or use an approximate count from <code>pg_class.reltuples</code>. Chapter 9 measures this.</span></div>
</div>

<h3>The "does it exist" question</h3>
<pre><code><span class="tok-comment">// Prisma has no exists(). These are the three real options.</span>

<span class="tok-comment">// A — count, then compare. Scans all matches. Avoid on big tables.</span>
const a = (await prisma.user.count({ where: { email } })) &gt; 0;

<span class="tok-comment">// B — findFirst selecting one tiny column. LIMIT 1, stops at the first hit.</span>
const b = (await prisma.user.findFirst({ where: { email }, select: { id: true } })) !== null;

<span class="tok-comment">// C — for a unique field, findUnique selecting only the id. Index lookup.</span>
const c = (await prisma.user.findUnique({ where: { email }, select: { id: true } })) !== null;</code></pre>
<div class="out">-- A
SELECT COUNT(*) FROM "public"."users" WHERE "public"."users"."email" = $1
-- B
SELECT "public"."users"."id" FROM "public"."users" WHERE "public"."users"."email" = $1 LIMIT $2 OFFSET $3
-- C
SELECT "public"."users"."id" FROM "public"."users" WHERE "public"."users"."email" = $1 LIMIT $2 OFFSET $3</div>
<p>B and C generate the same SQL; C is better because the compiler enforces that <code>email</code> is unique. A is the one to drop: on a non-unique filter matching ten thousand rows it counts all ten thousand to answer a yes/no question.</p>

<div class="callout ok">
<p><strong>A rule that covers all six.</strong> Ask two questions before every read: <em>how many rows can this return</em>, and <em>what should happen if there are none</em>. The first picks between <code>findUnique</code>, <code>findFirst</code> and <code>findMany</code>; the second picks the <code>OrThrow</code> suffix. Answering them deliberately is the difference between a codebase full of null checks that never fire and one where the missing row surfaces where it happened.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#read" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">CRUD — read operations</span><span class="lc-sub">prisma.io/docs · All six methods with runnable examples and their return types</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-client-reference#findunique" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Prisma Client reference</span><span class="lc-sub">prisma.io/docs · Every argument of every method — the page to keep open while writing queries</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p2025" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P2025 — record not found</span><span class="lc-sub">prisma.io/docs · What throws it, what the meta contains, and how to map it to a 404</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js, error handling chapter</span><span class="lc-sub">Turning P2025 into a 404 in one Express error handler instead of forty null checks</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Rewrite ten reads to use the right method, then justify each OrThrow decision</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Sáu cách để đọc</h2>
<p class="lead">Prisma có sáu phương thức đọc và chúng khác nhau theo hai trục: bạn nhận về bao nhiêu hàng, và chuyện gì xảy ra khi không có hàng nào. Chọn cho đúng không phải chuyện phong cách — chọn sai thì hoặc bạn bị ép kiểm null một cách không cần thiết, hoặc bạn giấu một hàng bị thiếu cho tới khi nó thành một <code>TypeError</code> ở ba hàm sau đó.</p>

<h3>Sáu cái, đặt cạnh nhau</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>findUnique</code></span><span class="v">Nhiều nhất một hàng, định vị bằng một trường unique. Trả về <code>T | null</code>. Là phương thức duy nhất có <code>where</code> bị hạn chế ngay lúc biên dịch.</span></div>
  <div class="kv"><span class="k"><code>findUniqueOrThrow</code></span><span class="v">Cùng câu truy vấn, nhưng thiếu hàng thì ném <code>P2025</code> thay vì trả <code>null</code>. Kiểu trả về là <code>T</code>, không có union.</span></div>
  <div class="kv"><span class="k"><code>findFirst</code></span><span class="v">Hàng đầu tiên khớp một bộ lọc bất kỳ, với <code>orderBy</code> quyết định "đầu tiên" nghĩa là gì. Trả về <code>T | null</code>. Thêm <code>LIMIT 1</code>.</span></div>
  <div class="kv"><span class="k"><code>findFirstOrThrow</code></span><span class="v">Y hệt, nhưng ném lỗi khi không tìm thấy. Hữu ích cho kiểu "gói thuê bao đang hoạt động" nơi vắng mặt thật sự là một lỗi.</span></div>
  <div class="kv"><span class="k"><code>findMany</code></span><span class="v">Một mảng, có thể rỗng. <strong>Không bao giờ</strong> null và không bao giờ ném lỗi vì rỗng — <code>[]</code> là một câu trả lời hợp lệ, nên nó không cần biến thể <code>OrThrow</code>.</span></div>
  <div class="kv"><span class="k"><code>count</code></span><span class="v">Một con số, từ <code>SELECT COUNT(*)</code>. Nó cũng đếm quan hệ và đếm số giá trị khác null theo từng trường.</span></div>
</div>

<h3>Chọn thế nào, dưới dạng cây quyết định</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Nhiều nhất một hàng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Định vị bằng trường unique</span><span class="lz-nsub"><code>findUnique</code> khi vắng mặt là bình thường (tra theo email mà có thể không tồn tại) · <code>findUniqueOrThrow</code> khi vắng mặt là một con bọ (một cấu hình mà ứng dụng không chạy nổi nếu thiếu).</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Định vị bằng bộ lọc bất kỳ</span><span class="lz-nsub"><code>findFirst</code> / <code>findFirstOrThrow</code>, <strong>luôn kèm một <code>orderBy</code></strong> — nếu không thì "đầu tiên" là bất cứ thứ gì bộ lập kế hoạch đưa lại hôm nay.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nhiều hàng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một danh sách</span><span class="lz-nsub"><code>findMany</code>, luôn kèm <code>take</code>. Trả về <code>[]</code>, không bao giờ <code>null</code>, nên nó không có biến thể OrThrow và không có phép kiểm null nào phải viết.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Chỉ cần một con số</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bao nhiêu</span><span class="lz-nsub"><code>count</code>, hoặc <code>_count</code> đặt trong một <code>include</code> khi con số ấy thuộc về một hàng bạn vốn đang lấy.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Có cái nào không</span><span class="lz-nsub">Không dùng <code>count</code> — hãy dùng <code>findUnique</code>/<code>findFirst</code> chỉ chọn <code>id</code>, nó dừng ở bản khớp đầu tiên thay vì đếm hết mọi bản khớp.</span></div></div>
  </div>
</div>

<h3>Vì sao <code>findUnique</code> từ chối bộ lọc của bạn</h3>
<pre><code>await prisma.post.findUnique({ where: { title: 'Bai dau tien' } });</code></pre>
<div class="out">TypeScript error:
Object literal may only specify known properties, and 'title' does not exist in type 'PostWhereUniqueInput'.</div>
<pre><code><span class="tok-comment">// Kiểu của where được sinh CHỈ từ các ràng buộc unique của model:</span>
export type PostWhereUniqueInput =
  | { id: number }
  | { slug: string }
  | { authorId_slug: { authorId: number; slug: string } }   <span class="tok-comment">// từ @@unique</span></code></pre>
<div class="callout">
<p><strong>Hạn chế này là một tính năng, và là loại hiếm.</strong> Nó là một bảo đảm lúc biên dịch rằng câu truy vấn trả về nhiều nhất một hàng. <code>findFirst({ where: { title } })</code> biên dịch ngon lành và trả về một hàng khớp bất kỳ — ổn khi bạn cố ý và là một con bọ thật khi bạn tưởng tiêu đề là duy nhất. Prisma bắt bạn nói rõ mình muốn cái nào.</p>
</div>
<pre><code><span class="tok-comment">// Từ Prisma 5, findUnique cũng nhận thêm các bộ lọc không-unique</span>
<span class="tok-comment">// đi kèm cái unique — rất tiện cho phép kiểm quyền</span>
const bai = await prisma.post.findUnique({
  where: { id: 42, authorId: currentUserId },   <span class="tok-comment">// id là unique; authorId thu hẹp thêm</span>
});</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" WHERE ("public"."posts"."id" = $1 AND "public"."posts"."author_id" = $2) LIMIT $3 OFFSET $4</div>
<p>Mẫu đó đáng nhận: nó biến "lấy bài viết, rồi kiểm chủ sở hữu" thành một câu truy vấn duy nhất trả về <code>null</code> nếu là bài của người khác. Ít lượt đi về hơn, và không còn nhánh nào mà bạn quên phần kiểm quyền.</p>

<h3>Null hay ném lỗi — chọn theo từng chỗ gọi, không phải theo cả kho mã</h3>
<pre><code><span class="tok-comment">// Vắng mặt là chuyện bình thường → trả null và xử lý nó</span>
const u = await prisma.user.findUnique({ where: { email } });
if (!u) return res.status(404).json({ error: 'Khong tim thay nguoi dung' });

<span class="tok-comment">// Vắng mặt là một con bọ → ném lỗi, để bộ xử lý lỗi sinh ra mã 500</span>
const cauHinh = await prisma.setting.findUniqueOrThrow({ where: { key: 'site_name' } });

<span class="tok-comment">// Kiểu làm sai: giả vờ null không thể xảy ra</span>
const u2 = (await prisma.user.findUnique({ where: { email } }))!;
console.log(u2.email);   <span class="tok-comment">// TypeError lúc chạy, rất xa nguyên nhân</span></code></pre>
<div class="out">PrismaClientKnownRequestError:
An operation failed because it depends on one or more records that were required but not found.
  code: 'P2025',
  meta: { modelName: 'Setting', cause: 'No record was found for a query.' }</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Các biến thể <code>OrThrow</code> ném <code>P2025</code></span><span class="v">Một mã lỗi duy nhất, bắt được. Bộ xử lý lỗi Express của bạn ánh xạ <code>P2025</code> thành 404 ở đúng một chỗ, gọn hơn hẳn bốn mươi phép kiểm null rải khắp handler.</span></div>
  <div class="kv"><span class="k">Các biến thể không ném lỗi bắt bạn trả giá bằng một union</span><span class="v"><code>T | null</code> nghĩa là TypeScript ép bạn kiểm. Đó đúng là điểm mấu chốt — nhưng nếu chỗ gọi nào cũng lập tức ném lỗi thì bạn vừa viết tay lại bản <code>OrThrow</code>.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ <code>!</code> một kết quả Prisma</span><span class="v">Phép khẳng định khác-null bịt miệng trình biên dịch và đẩy thất bại tới một dòng ngẫu nhiên phía sau. Nếu bạn chắc, hãy nói ra bằng <code>OrThrow</code>, thứ hỏng ngay tại câu truy vấn kèm một thông báo hữu ích.</span></div>
</div>

<h3><code>findFirst</code> và cái <code>orderBy</code> bị bỏ quên</h3>
<pre><code><span class="tok-comment">// "Bài mới nhất" — nhưng không phải vậy</span>
const latest = await prisma.post.findFirst({ where: { published: true } });</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" WHERE "public"."posts"."published" = $1 LIMIT $2 OFFSET $3</div>
<div class="pitfall">
<p><strong>Bẫy — không có <code>ORDER BY</code> nghĩa là không có thứ tự xác định.</strong> PostgreSQL trả về hàng nào nó gặp trước, thường là theo thứ tự chèn trên một bảng còn mới và thôi như vậy ngay khi có hàng bị cập nhật (một lần update ghi lại hàng ở cuối heap) hoặc khi bộ lập kế hoạch chuyển sang quét chỉ mục. Nên nó chạy đúng lúc phát triển, chạy đúng ở staging, và trả về một bài viết ngẫu nhiên trên production sau khi bảng đã bị đảo qua đảo lại. <strong>Mọi <code>findFirst</code> đều cần một <code>orderBy</code></strong> — nếu bạn không gọi tên được thứ tự thì thứ bạn muốn là <code>findMany</code> hoặc <code>findUnique</code>.</p>
</div>
<pre><code><span class="tok-comment">// Đúng</span>
const latest = await prisma.post.findFirst({
  where: { published: true },
  orderBy: { publishedAt: 'desc' },
});

<span class="tok-comment">// Trường hợp bằng nhau cần một tiêu chí phá hoà, không thì thứ tự vẫn không xác định</span>
const latest2 = await prisma.post.findFirst({
  where: { published: true },
  orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
});</code></pre>

<h3><code>findMany</code>, và tham số bạn nên luôn truyền</h3>
<pre><code><span class="tok-comment">// Mọi trường đều tuỳ chọn, và đó chính là chỗ nguy hiểm</span>
const all = await prisma.post.findMany();</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" OFFSET $1
-- 412.908 hàng, 890 MB đổ vào một tiến trình Node có heap 512 MB</div>
<div class="callout warn">
<p><strong>Một câu <code>findMany()</code> trần là một lần đọc không chặn biên.</strong> Nó chạy ngon trên cơ sở dữ liệu phát triển 200 hàng và hạ gục tiến trình trên production. Hãy coi <code>take</code> là bắt buộc: luôn truyền nó, ngay cả khi bạn "biết" kết quả nhỏ, vì cái biết ấy là tính chất của dữ liệu hôm nay. Chương 5 nói về phân trang bằng con trỏ cho trường hợp bạn thật sự cần tất cả.</p>
</div>
<pre><code>const page = await prisma.post.findMany({
  where: { published: true },
  orderBy: { publishedAt: 'desc' },
  take: 20,
  skip: 0,
});</code></pre>

<h3><code>count</code>, và hai dạng khác của nó</h3>
<pre><code><span class="tok-comment">// 1 — đếm thường</span>
const n = await prisma.post.count({ where: { published: true } });

<span class="tok-comment">// 2 — đếm số giá trị khác null theo từng trường, trong một câu truy vấn</span>
const c = await prisma.post.count({
  select: { _all: true, body: true, publishedAt: true },
});
console.log(c);

<span class="tok-comment">// 3 — đếm một quan hệ mà không nạp nó</span>
const users = await prisma.user.findMany({
  take: 3,
  include: { _count: { select: { posts: { where: { published: true } } } } },
});
console.log(users.map((u) =&gt; [u.email, u._count.posts]));</code></pre>
<div class="out">{ _all: 412908, body: 389114, publishedAt: 201773 }
[ [ 'an@example.com', 12 ], [ 'binh@example.com', 0 ], [ 'chi@example.com', 41 ] ]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đếm theo từng trường thì rẻ</span><span class="v">Một câu <code>SELECT COUNT(*), COUNT(body), COUNT(published_at)</code>. Ba câu trả lời, một lần quét — tốt hơn hẳn ba câu truy vấn riêng.</span></div>
  <div class="kv"><span class="k"><code>_count</code> thắng <code>.length</code></span><span class="v"><code>include: { posts: true }</code> rồi <code>posts.length</code> là nạp mọi bài viết về chỉ để đếm chúng. <code>_count</code> là một truy vấn con tương quan, không nạp bài nào. Trên một người dùng có 4.000 bài viết, khác biệt ấy là cả một yêu cầu.</span></div>
  <div class="kv"><span class="k">Đếm cũng không miễn phí</span><span class="v"><code>COUNT(*)</code> trên một bảng lớn của PostgreSQL là một lần quét toàn bộ — không có số đếm hàng nào được lưu sẵn. Nếu bạn hiển thị tổng số ở mọi lần tải trang thì hãy lưu đệm nó, hoặc dùng số đếm xấp xỉ từ <code>pg_class.reltuples</code>. Chương 9 đo chuyện này.</span></div>
</div>

<h3>Câu hỏi "nó có tồn tại không"</h3>
<pre><code><span class="tok-comment">// Prisma không có exists(). Đây là ba lựa chọn thật.</span>

<span class="tok-comment">// A — đếm rồi so sánh. Quét hết các bản khớp. Tránh trên bảng lớn.</span>
const a = (await prisma.user.count({ where: { email } })) &gt; 0;

<span class="tok-comment">// B — findFirst chỉ chọn một cột tí hon. LIMIT 1, dừng ở bản khớp đầu tiên.</span>
const b = (await prisma.user.findFirst({ where: { email }, select: { id: true } })) !== null;

<span class="tok-comment">// C — với trường unique, findUnique chỉ chọn id. Một lần tra chỉ mục.</span>
const c = (await prisma.user.findUnique({ where: { email }, select: { id: true } })) !== null;</code></pre>
<div class="out">-- A
SELECT COUNT(*) FROM "public"."users" WHERE "public"."users"."email" = $1
-- B
SELECT "public"."users"."id" FROM "public"."users" WHERE "public"."users"."email" = $1 LIMIT $2 OFFSET $3
-- C
SELECT "public"."users"."id" FROM "public"."users" WHERE "public"."users"."email" = $1 LIMIT $2 OFFSET $3</div>
<p>B và C sinh ra cùng một câu SQL; C tốt hơn vì trình biên dịch thi hành việc <code>email</code> phải là unique. A là cái nên bỏ: với một bộ lọc không-unique khớp mười nghìn hàng thì nó đếm đủ mười nghìn để trả lời một câu hỏi có/không.</p>

<div class="callout ok">
<p><strong>Một luật bao trọn cả sáu.</strong> Trước mỗi lần đọc, hỏi hai câu: <em>câu này trả về được tối đa bao nhiêu hàng</em>, và <em>nếu không có hàng nào thì nên xảy ra chuyện gì</em>. Câu thứ nhất chọn giữa <code>findUnique</code>, <code>findFirst</code> và <code>findMany</code>; câu thứ hai chọn hậu tố <code>OrThrow</code>. Trả lời hai câu đó một cách có chủ ý chính là khác biệt giữa một kho mã đầy những phép kiểm null không bao giờ chạy tới, và một kho mã nơi hàng bị thiếu lộ ra đúng chỗ nó xảy ra.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#read" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">CRUD — thao tác đọc</span><span class="lc-sub">prisma.io/docs · Cả sáu phương thức kèm ví dụ chạy được và kiểu trả về của chúng</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-client-reference#findunique" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Prisma Client reference</span><span class="lc-sub">prisma.io/docs · Mọi tham số của mọi phương thức — trang nên mở sẵn khi viết truy vấn</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p2025" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P2025 — không tìm thấy bản ghi</span><span class="lc-sub">prisma.io/docs · Cái gì ném nó ra, phần meta chứa gì, và cách ánh xạ nó thành 404</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js, chương xử lý lỗi</span><span class="lc-sub">Biến P2025 thành 404 trong một bộ xử lý lỗi Express thay vì bốn mươi phép kiểm null</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Viết lại mười lần đọc bằng đúng phương thức, rồi biện minh cho từng quyết định OrThrow</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — `select`, `include`, and shaping the result|||4.2 — `select`, `include`, và nắn hình kết quả',
      slug: 'pr-4-2-select-include',
      type: 'LESSON',
      description: 'Hai cách chọn dữ liệu và vì sao chúng loại trừ nhau, lồng chúng vào nhau tới độ sâu bất kỳ, omit của Prisma 6 cho cột mật khẩu, _count trong include, API kiểu chuỗi, và cách kiểu trả về đi theo đúng thứ bạn xin.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2><code>select</code>, <code>include</code>, and shaping the result</h2>
<p class="lead">Every Prisma read returns exactly the shape you asked for, and the TypeScript type follows it precisely. That is the feature people stay for. It also means the two arguments that control it — <code>select</code> and <code>include</code> — are the ones you will type most often, and the ones with the most rules.</p>

<h3>The three ways to shape a row</h3>
<pre><code><span class="tok-comment">// 1 — neither: every scalar column, no relations</span>
const a = await prisma.user.findUniqueOrThrow({ where: { id: 1 } });
<span class="tok-comment">// { id, email, fullName, password, createdAt }</span>

<span class="tok-comment">// 2 — include: every scalar column PLUS the named relations</span>
const b = await prisma.user.findUniqueOrThrow({ where: { id: 1 }, include: { posts: true } });
<span class="tok-comment">// { id, email, fullName, password, createdAt, posts: Post[] }</span>

<span class="tok-comment">// 3 — select: ONLY what you name, relations included</span>
const c = await prisma.user.findUniqueOrThrow({
  where: { id: 1 },
  select: { id: true, email: true, posts: { select: { title: true } } },
});
<span class="tok-comment">// { id, email, posts: { title: string }[] }</span></code></pre>
<div class="out">-- 1 and 2 fetch the password column you did not want
SELECT "id","email","full_name","password","created_at" FROM "users" WHERE "id" = $1 LIMIT $2 OFFSET $3

-- 3 fetches two columns
SELECT "id","email" FROM "users" WHERE "id" = $1 LIMIT $2 OFFSET $3
SELECT "title","author_id" FROM "posts" WHERE "author_id" IN ($1)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">They are mutually exclusive at one level</span><span class="v"><code>{ select: …, include: … }</code> together is a runtime error, not a compile error, because the generated types express it as a union. The message is clear: <em>Please either use <code>include</code> or <code>select</code>, but not both at the same time.</em></span></div>
  <div class="kv"><span class="k">But they nest freely</span><span class="v"><code>include: { posts: { select: { title: true } } }</code> is legal and common — every level chooses independently. That is how you say "the whole user, but only the titles of their posts".</span></div>
  <div class="kv"><span class="k"><code>select</code> on a relation implies including it</span><span class="v">Naming a relation inside <code>select</code> both includes it and shapes it. There is no separate step.</span></div>
  <div class="kv"><span class="k">The type is computed, not declared</span><span class="v">Hover <code>c</code> in your editor: it is exactly <code>{ id: number; email: string; posts: { title: string }[] }</code>. You wrote no interface, and it cannot drift from the query.</span></div>
</div>

<h3>The four arguments, and what each one does to the row</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">nothing</span><span class="lz-lnote">Every scalar column, no relations. The default, and the one that quietly ships your password column to whoever calls <code>res.json(user)</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>include</code></span><span class="lz-lnote">Every scalar column <em>plus</em> the relations you name. Additive: you can only widen the row, never narrow it.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>select</code></span><span class="lz-lnote">Only what you name, scalars and relations alike. Subtractive by default: anything unnamed is absent, from the SQL and from the type.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>omit</code></span><span class="lz-lnote">Everything except what you name. The inverse of <code>select</code>, and the only one that survives a schema change gracefully — new columns are included automatically, which is exactly what you want for everything but a secret.</span></div>
</div>

<h3>The password column, and <code>omit</code></h3>
<pre><code><span class="tok-comment">// The old way: select every field except one, by hand, in every query</span>
const u = await prisma.user.findMany({
  select: { id: true, email: true, fullName: true, createdAt: true, updatedAt: true,
            avatarUrl: true, bio: true /* ...and remember to add new fields here forever */ },
});</code></pre>
<pre><code><span class="tok-comment">// Prisma 5.16+: omit says what to leave out</span>
const u2 = await prisma.user.findMany({ omit: { password: true } });
<span class="tok-comment">// every column except password, and new columns are included automatically</span>

<span class="tok-comment">// Better: omit it globally, and opt back in only where it is needed</span>
const prisma = new PrismaClient({
  omit: { user: { password: true } },
});

const forLogin = await prisma.user.findUnique({
  where: { email },
  omit: { password: false },     <span class="tok-comment">// explicitly opt in, right where you hash-compare</span>
});</code></pre>
<div class="callout ok">
<p><strong>Global <code>omit</code> is the single best safety feature added to Prisma Client in years.</strong> The failure it prevents is real and common: someone adds a field to <code>User</code>, a handler somewhere returns the whole user object, and a password hash — or a TOTP secret, or an internal note — ships in a JSON response. With global omit the default is safe and the exception is one visible line at the call site that needs it.</p>
</div>

<h3>Nesting, as deep as you like</h3>
<pre><code>const bai = await prisma.post.findUniqueOrThrow({
  where: { id: 1 },
  select: {
    id: true,
    title: true,
    author: { select: { id: true, username: true, avatarUrl: true } },
    comments: {
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 20,
      select: {
        id: true,
        body: true,
        author: { select: { username: true } },
        _count: { select: { replies: true } },
      },
    },
    _count: { select: { comments: true, likes: true } },
  },
});</code></pre>
<div class="out">prisma:query SELECT "id","title","author_id" FROM "posts" WHERE "id" = $1 LIMIT $2 OFFSET $3
prisma:query SELECT "id","username","avatar_url" FROM "users" WHERE "id" IN ($1)
prisma:query SELECT "id","body","author_id",(SELECT COUNT(*) FROM "comments" AS "r" WHERE "r"."parent_id" = "comments"."id") FROM "comments" WHERE ("post_id" IN ($1) AND "deleted_at" IS NULL) ORDER BY "created_at" ASC LIMIT $2
prisma:query SELECT "id","username" FROM "users" WHERE "id" IN ($1,$2,$3,$4)
prisma:query SELECT (SELECT COUNT(*) FROM "comments" WHERE "post_id" = "posts"."id"), (SELECT COUNT(*) FROM "likes" WHERE "post_id" = "posts"."id") FROM "posts" WHERE "id" = $1</div>
<p>Five statements for a fully populated post page. Not one, but not fifty either — and each relation level is batched with <code>IN</code> rather than looped. Chapter 9 shows how <code>relationLoadStrategy: "join"</code> collapses these, and measures when that is actually faster.</p>
<div class="pitfall">
<p><strong>Trap — <code>take</code> inside a nested relation is per parent, not overall.</strong> <code>findMany({ take: 10, include: { comments: { take: 20 } } })</code> can return up to 200 comments, not 20. That is usually what you want for a feed; it is a surprise when the outer <code>take</code> is large. And note the nested <code>take</code> is applied per parent by the query engine, so it does not reduce the work the database does as much as you might hope — Chapter 9 has the measurement.</p>
</div>

<h3>Filtering and ordering the included relation</h3>
<pre><code><span class="tok-comment">// Every findMany argument works inside an include or a nested select</span>
include: {
  posts: {
    where:   { published: true, deletedAt: null },
    orderBy: { publishedAt: 'desc' },
    take:    5,
    skip:    0,
    select:  { id: true, title: true, slug: true },
  },
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">This filters the CHILDREN, not the parents</span><span class="v">A user with no published posts still appears, with <code>posts: []</code>. To exclude such users you filter the parent: <code>where: { posts: { some: { published: true } } }</code>. Confusing these two is the most common relation-query mistake.</span></div>
  <div class="kv"><span class="k">Ordering inside is independent</span><span class="v">The outer <code>orderBy</code> sorts users; the inner one sorts each user's posts. They do not interact.</span></div>
  <div class="kv"><span class="k"><code>distinct</code> works here too</span><span class="v"><code>distinct: ['categoryId']</code> inside an include gives one post per category per user — applied in the query engine, not in SQL, so it does not reduce rows fetched.</span></div>
</div>

<h3><code>_count</code>: the number without the rows</h3>
<pre><code><span class="tok-comment">// Wrong: loads 4,000 posts to display "4000"</span>
const bad = await prisma.user.findMany({ include: { posts: true } });
console.log(bad[0].posts.length);

<span class="tok-comment">// Right: a correlated subquery, no rows transferred</span>
const good = await prisma.user.findMany({
  include: { _count: { select: { posts: true, comments: true } } },
});
console.log(good[0]._count.posts);

<span class="tok-comment">// And it takes a filter, which is what makes it genuinely useful</span>
const withFilter = await prisma.user.findMany({
  include: { _count: { select: { posts: { where: { published: true } } } } },
});</code></pre>
<div class="out">-- bad
SELECT "id","title","body","published","views","created_at","author_id" FROM "posts" WHERE "author_id" IN (...)   -- 4,000 rows, 3.2 MB

-- good
SELECT "users".*, (SELECT COUNT(*) FROM "posts" WHERE "posts"."author_id" = "users"."id") FROM "users"            -- 1 row, 84 bytes</div>

<h3>The fluent API: traversing instead of including</h3>
<pre><code><span class="tok-comment">// Chain from a unique lookup to its relation — two queries, no include</span>
const posts = await prisma.user.findUnique({ where: { email } }).posts({
  where: { published: true },
  take: 10,
});

<span class="tok-comment">// Chains further, one level at a time</span>
const author = await prisma.comment.findUnique({ where: { id: 5 } }).post().author();</code></pre>
<div class="out">prisma:query SELECT "id","title",... FROM "posts" WHERE "author_id" = (SELECT "id" FROM "users" WHERE "email" = $1) AND "published" = $2 LIMIT $3</div>
<div class="kv-grid">
  <div class="kv"><span class="k">When it wins</span><span class="v">You want <em>only</em> the relation and not the parent. <code>include</code> would fetch the user row you are about to discard; the fluent form does not.</span></div>
  <div class="kv"><span class="k">When it loses</span><span class="v">You need both. Two chained calls is two round trips where one <code>include</code> is one. And a long chain issues one query per link.</span></div>
  <div class="kv"><span class="k">The null ambiguity</span><span class="v">It returns <code>null</code> both when the parent is missing and when the relation is empty. Lesson 3.3 covered this; it is the main reason to prefer <code>include</code> when the difference matters to your error message.</span></div>
</div>

<h3>Naming the shape you selected</h3>
<pre><code>import { Prisma } from '@prisma/client';

<span class="tok-comment">// Define the selection once, as a value</span>
const baiTomTat = {
  id: true,
  title: true,
  author: { select: { username: true } },
} satisfies Prisma.PostSelect;

<span class="tok-comment">// Derive the type from it — never written by hand, never drifts</span>
type BaiTomTat = Prisma.PostGetPayload&lt;{ select: typeof baiTomTat }&gt;;

<span class="tok-comment">// Now the selection and its type travel together</span>
async function layDanhSach(): Promise&lt;BaiTomTat[]&gt; {
  return prisma.post.findMany({ select: baiTomTat, take: 20 });
}

function render(b: BaiTomTat) {
  return &#96;\${b.title} — \${b.author.username}&#96;;
}</code></pre>
<div class="callout ok">
<p><strong>This is the pattern to reach for once a selection is used in more than one place.</strong> Without it, a shared render function needs a hand-written interface that will silently drift from the query. With it, removing <code>title</code> from the selection turns <code>render</code> red immediately. Chapter 8 goes through <code>GetPayload</code>, <code>validator</code> and the rest of the generated type machinery in full.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/select-fields" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Select fields</span><span class="lc-sub">prisma.io/docs · <code>select</code>, <code>include</code>, <code>omit</code> and the rules about combining them</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">Excluding fields with <code>omit</code></span><span class="lc-sub">prisma.io/docs · Local and global omit, and opting back in for the one query that needs the field</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing#count-relations" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">Counting relations</span><span class="lc-sub">prisma.io/docs · <code>_count</code> with and without filters, and where it can appear</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/type-safety/prisma-validator" target="_blank" rel="noopener"><span class="lc-ico">🧬</span><span class="lc-body"><span class="lc-title"><code>Prisma.validator</code> and <code>GetPayload</code></span><span class="lc-sub">prisma.io/docs · Naming a selection and deriving its type — expanded in Chapter 8</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Build the exact selection a given API response needs, with no extra column fetched</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2><code>select</code>, <code>include</code>, và nắn hình kết quả</h2>
<p class="lead">Mọi lần đọc bằng Prisma đều trả về đúng hình dạng bạn xin, và kiểu TypeScript đi theo chính xác. Đó là tính năng khiến người ta ở lại. Nó cũng có nghĩa hai tham số điều khiển chuyện đó — <code>select</code> và <code>include</code> — là hai thứ bạn gõ nhiều nhất, và cũng là hai thứ có nhiều luật nhất.</p>

<h3>Ba cách nắn một hàng</h3>
<pre><code><span class="tok-comment">// 1 — không dùng cái nào: mọi cột vô hướng, không quan hệ</span>
const a = await prisma.user.findUniqueOrThrow({ where: { id: 1 } });
<span class="tok-comment">// { id, email, fullName, password, createdAt }</span>

<span class="tok-comment">// 2 — include: mọi cột vô hướng CỘNG các quan hệ được nêu tên</span>
const b = await prisma.user.findUniqueOrThrow({ where: { id: 1 }, include: { posts: true } });
<span class="tok-comment">// { id, email, fullName, password, createdAt, posts: Post[] }</span>

<span class="tok-comment">// 3 — select: CHỈ những gì bạn nêu tên, quan hệ cũng vậy</span>
const c = await prisma.user.findUniqueOrThrow({
  where: { id: 1 },
  select: { id: true, email: true, posts: { select: { title: true } } },
});
<span class="tok-comment">// { id, email, posts: { title: string }[] }</span></code></pre>
<div class="out">-- 1 và 2 kéo về cả cột password mà bạn không hề muốn
SELECT "id","email","full_name","password","created_at" FROM "users" WHERE "id" = $1 LIMIT $2 OFFSET $3

-- 3 kéo về hai cột
SELECT "id","email" FROM "users" WHERE "id" = $1 LIMIT $2 OFFSET $3
SELECT "title","author_id" FROM "posts" WHERE "author_id" IN ($1)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chúng loại trừ nhau ở cùng một tầng</span><span class="v">Viết cả <code>{ select: …, include: … }</code> là lỗi lúc chạy chứ không phải lỗi biên dịch, vì các kiểu sinh ra diễn đạt nó thành một union. Thông báo thì rõ: <em>Please either use <code>include</code> or <code>select</code>, but not both at the same time.</em></span></div>
  <div class="kv"><span class="k">Nhưng chúng lồng nhau thoải mái</span><span class="v"><code>include: { posts: { select: { title: true } } }</code> là hợp lệ và phổ biến — mỗi tầng tự chọn độc lập. Đó là cách bạn nói "nguyên cái user, nhưng chỉ tiêu đề các bài viết của họ".</span></div>
  <div class="kv"><span class="k"><code>select</code> trên một quan hệ tức là đã include nó</span><span class="v">Nêu tên một quan hệ bên trong <code>select</code> vừa là include nó vừa là nắn hình nó. Không có bước riêng nào cả.</span></div>
  <div class="kv"><span class="k">Kiểu được tính ra, không phải do bạn khai</span><span class="v">Rê chuột lên <code>c</code> trong trình soạn thảo: nó đúng là <code>{ id: number; email: string; posts: { title: string }[] }</code>. Bạn không viết interface nào, và nó không thể trôi dạt khỏi câu truy vấn.</span></div>
</div>

<h3>Bốn tham số, và mỗi cái làm gì với hàng dữ liệu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">không dùng gì</span><span class="lz-lnote">Mọi cột vô hướng, không quan hệ. Là mặc định, và cũng là cái âm thầm chuyển cột mật khẩu của bạn tới bất cứ ai gọi <code>res.json(user)</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>include</code></span><span class="lz-lnote">Mọi cột vô hướng <em>cộng thêm</em> những quan hệ bạn nêu tên. Chỉ cộng: bạn chỉ nới rộng hàng ra được, không bao giờ thu hẹp lại.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>select</code></span><span class="lz-lnote">Chỉ những gì bạn nêu tên, cả vô hướng lẫn quan hệ. Mặc định là trừ đi: thứ nào không được nêu thì vắng mặt, khỏi cả SQL lẫn kiểu.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>omit</code></span><span class="lz-lnote">Mọi thứ trừ những gì bạn nêu tên. Là nghịch đảo của <code>select</code>, và là cái duy nhất sống sót một cách tử tế qua một lần đổi lược đồ — cột mới tự động được lấy, đúng thứ bạn muốn cho mọi thứ trừ một bí mật.</span></div>
</div>

<h3>Cột mật khẩu, và <code>omit</code></h3>
<pre><code><span class="tok-comment">// Cách cũ: chọn từng trường trừ một cái, bằng tay, ở mọi câu truy vấn</span>
const u = await prisma.user.findMany({
  select: { id: true, email: true, fullName: true, createdAt: true, updatedAt: true,
            avatarUrl: true, bio: true /* ...và nhớ thêm trường mới vào đây mãi mãi */ },
});</code></pre>
<pre><code><span class="tok-comment">// Prisma 5.16+: omit nói cái gì phải bỏ ra</span>
const u2 = await prisma.user.findMany({ omit: { password: true } });
<span class="tok-comment">// mọi cột trừ password, và cột mới thì tự động được lấy</span>

<span class="tok-comment">// Tốt hơn: bỏ nó ở mức toàn cục, rồi bật lại chỉ ở nơi cần</span>
const prisma = new PrismaClient({
  omit: { user: { password: true } },
});

const forLogin = await prisma.user.findUnique({
  where: { email },
  omit: { password: false },     <span class="tok-comment">// bật lại tường minh, ngay chỗ bạn so hash</span>
});</code></pre>
<div class="callout ok">
<p><strong><code>omit</code> ở mức toàn cục là tính năng an toàn tốt nhất được thêm vào Prisma Client trong nhiều năm.</strong> Thất bại mà nó ngăn được là có thật và phổ biến: ai đó thêm một trường vào <code>User</code>, một handler ở đâu đó trả về nguyên đối tượng user, và một hash mật khẩu — hoặc một bí mật TOTP, hoặc một ghi chú nội bộ — bay thẳng vào phản hồi JSON. Với omit toàn cục thì mặc định là an toàn còn ngoại lệ là một dòng nhìn thấy được ngay tại chỗ gọi cần tới nó.</p>
</div>

<h3>Lồng nhau, sâu bao nhiêu tuỳ bạn</h3>
<pre><code>const bai = await prisma.post.findUniqueOrThrow({
  where: { id: 1 },
  select: {
    id: true,
    title: true,
    author: { select: { id: true, username: true, avatarUrl: true } },
    comments: {
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 20,
      select: {
        id: true,
        body: true,
        author: { select: { username: true } },
        _count: { select: { replies: true } },
      },
    },
    _count: { select: { comments: true, likes: true } },
  },
});</code></pre>
<div class="out">prisma:query SELECT "id","title","author_id" FROM "posts" WHERE "id" = $1 LIMIT $2 OFFSET $3
prisma:query SELECT "id","username","avatar_url" FROM "users" WHERE "id" IN ($1)
prisma:query SELECT "id","body","author_id",(SELECT COUNT(*) FROM "comments" AS "r" WHERE "r"."parent_id" = "comments"."id") FROM "comments" WHERE ("post_id" IN ($1) AND "deleted_at" IS NULL) ORDER BY "created_at" ASC LIMIT $2
prisma:query SELECT "id","username" FROM "users" WHERE "id" IN ($1,$2,$3,$4)
prisma:query SELECT (SELECT COUNT(*) FROM "comments" WHERE "post_id" = "posts"."id"), (SELECT COUNT(*) FROM "likes" WHERE "post_id" = "posts"."id") FROM "posts" WHERE "id" = $1</div>
<p>Năm câu lệnh cho một trang bài viết đầy đủ. Không phải một, nhưng cũng không phải năm mươi — và mỗi tầng quan hệ đều được gom lô bằng <code>IN</code> chứ không lặp. Chương 9 chỉ cách <code>relationLoadStrategy: "join"</code> gộp chúng lại, và đo xem khi nào cách đó thật sự nhanh hơn.</p>
<div class="pitfall">
<p><strong>Bẫy — <code>take</code> bên trong một quan hệ lồng là tính theo từng cha, không phải tổng.</strong> <code>findMany({ take: 10, include: { comments: { take: 20 } } })</code> trả về được tới 200 bình luận, không phải 20. Thường thì đó là điều bạn muốn cho một dòng thời gian; nó thành bất ngờ khi cái <code>take</code> bên ngoài lớn. Và lưu ý cái <code>take</code> lồng được query engine áp dụng theo từng cha, nên nó không giảm phần việc của cơ sở dữ liệu nhiều như bạn tưởng — Chương 9 có số đo.</p>
</div>

<h3>Lọc và sắp xếp quan hệ được include</h3>
<pre><code><span class="tok-comment">// Mọi tham số của findMany đều dùng được bên trong một include hay một select lồng</span>
include: {
  posts: {
    where:   { published: true, deletedAt: null },
    orderBy: { publishedAt: 'desc' },
    take:    5,
    skip:    0,
    select:  { id: true, title: true, slug: true },
  },
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái này lọc CON, không lọc CHA</span><span class="v">Một người dùng chưa có bài viết nào đã đăng vẫn xuất hiện, với <code>posts: []</code>. Muốn loại những người dùng đó thì bạn lọc ở cha: <code>where: { posts: { some: { published: true } } }</code>. Lẫn hai thứ này là lỗi truy vấn quan hệ phổ biến nhất.</span></div>
  <div class="kv"><span class="k">Sắp xếp bên trong là độc lập</span><span class="v"><code>orderBy</code> bên ngoài sắp các user; cái bên trong sắp các bài viết của từng user. Chúng không tương tác với nhau.</span></div>
  <div class="kv"><span class="k"><code>distinct</code> cũng dùng được ở đây</span><span class="v"><code>distinct: ['categoryId']</code> bên trong một include cho bạn mỗi chuyên mục một bài viết cho mỗi user — được áp dụng trong query engine chứ không phải trong SQL, nên nó không làm giảm số hàng kéo về.</span></div>
</div>

<h3><code>_count</code>: con số mà không cần các hàng</h3>
<pre><code><span class="tok-comment">// Sai: nạp 4.000 bài viết để hiển thị "4000"</span>
const bad = await prisma.user.findMany({ include: { posts: true } });
console.log(bad[0].posts.length);

<span class="tok-comment">// Đúng: một truy vấn con tương quan, không hàng nào phải truyền đi</span>
const good = await prisma.user.findMany({
  include: { _count: { select: { posts: true, comments: true } } },
});
console.log(good[0]._count.posts);

<span class="tok-comment">// Và nó nhận bộ lọc, đó mới là chỗ khiến nó thật sự hữu ích</span>
const withFilter = await prisma.user.findMany({
  include: { _count: { select: { posts: { where: { published: true } } } } },
});</code></pre>
<div class="out">-- bad
SELECT "id","title","body","published","views","created_at","author_id" FROM "posts" WHERE "author_id" IN (...)   -- 4.000 hàng, 3,2 MB

-- good
SELECT "users".*, (SELECT COUNT(*) FROM "posts" WHERE "posts"."author_id" = "users"."id") FROM "users"            -- 1 hàng, 84 byte</div>

<h3>API kiểu chuỗi: đi qua thay vì include</h3>
<pre><code><span class="tok-comment">// Nối từ một lần tra unique sang quan hệ của nó — hai câu truy vấn, không include</span>
const posts = await prisma.user.findUnique({ where: { email } }).posts({
  where: { published: true },
  take: 10,
});

<span class="tok-comment">// Nối tiếp được, mỗi lần một tầng</span>
const author = await prisma.comment.findUnique({ where: { id: 5 } }).post().author();</code></pre>
<div class="out">prisma:query SELECT "id","title",... FROM "posts" WHERE "author_id" = (SELECT "id" FROM "users" WHERE "email" = $1) AND "published" = $2 LIMIT $3</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Khi nó thắng</span><span class="v">Bạn <em>chỉ</em> muốn quan hệ, không muốn cha. <code>include</code> sẽ kéo về cả hàng user mà bạn sắp vứt đi; dạng chuỗi thì không.</span></div>
  <div class="kv"><span class="k">Khi nó thua</span><span class="v">Bạn cần cả hai. Hai lời gọi nối chuỗi là hai lượt đi về trong khi một <code>include</code> chỉ là một. Và một chuỗi dài thì mỗi mắt xích một câu truy vấn.</span></div>
  <div class="kv"><span class="k">Sự mập mờ của null</span><span class="v">Nó trả về <code>null</code> cả khi cha không tồn tại lẫn khi quan hệ rỗng. Bài 3.3 đã nói; đó là lý do chính để ưu tiên <code>include</code> khi khác biệt ấy có ý nghĩa với thông báo lỗi của bạn.</span></div>
</div>

<h3>Đặt tên cho hình dạng bạn vừa chọn</h3>
<pre><code>import { Prisma } from '@prisma/client';

<span class="tok-comment">// Định nghĩa phép chọn một lần, dưới dạng một giá trị</span>
const baiTomTat = {
  id: true,
  title: true,
  author: { select: { username: true } },
} satisfies Prisma.PostSelect;

<span class="tok-comment">// Suy ra kiểu từ nó — không bao giờ viết tay, không bao giờ trôi dạt</span>
type BaiTomTat = Prisma.PostGetPayload&lt;{ select: typeof baiTomTat }&gt;;

<span class="tok-comment">// Giờ phép chọn và kiểu của nó đi cùng nhau</span>
async function layDanhSach(): Promise&lt;BaiTomTat[]&gt; {
  return prisma.post.findMany({ select: baiTomTat, take: 20 });
}

function render(b: BaiTomTat) {
  return &#96;\${b.title} — \${b.author.username}&#96;;
}</code></pre>
<div class="callout ok">
<p><strong>Đây là mẫu nên với tay tới ngay khi một phép chọn được dùng ở hơn một chỗ.</strong> Không có nó, một hàm render dùng chung sẽ cần một interface viết tay và interface ấy sẽ âm thầm trôi dạt khỏi câu truy vấn. Có nó, bỏ <code>title</code> khỏi phép chọn là <code>render</code> đỏ lên ngay lập tức. Chương 8 đi hết <code>GetPayload</code>, <code>validator</code> và phần còn lại của bộ máy kiểu được sinh ra.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/select-fields" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Select fields</span><span class="lc-sub">prisma.io/docs · <code>select</code>, <code>include</code>, <code>omit</code> và luật khi kết hợp chúng</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">Loại trường bằng <code>omit</code></span><span class="lc-sub">prisma.io/docs · omit cục bộ và toàn cục, cùng cách bật lại cho đúng câu truy vấn cần trường đó</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing#count-relations" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">Đếm quan hệ</span><span class="lc-sub">prisma.io/docs · <code>_count</code> có và không có bộ lọc, và nó xuất hiện được ở đâu</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/type-safety/prisma-validator" target="_blank" rel="noopener"><span class="lc-ico">🧬</span><span class="lc-body"><span class="lc-title"><code>Prisma.validator</code> và <code>GetPayload</code></span><span class="lc-sub">prisma.io/docs · Đặt tên cho một phép chọn và suy ra kiểu của nó — nói rộng ở Chương 8</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Dựng đúng phép chọn mà một phản hồi API cho trước cần, không thừa một cột nào</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Creating rows|||4.3 — Tạo hàng dữ liệu',
      slug: 'pr-4-3-tao-hang',
      type: 'LESSON',
      description: 'create với ghi lồng nhau, createMany nhanh gấp bao nhiêu lần và nó KHÔNG làm được gì, createManyAndReturn, skipDuplicates, P2002 khi đụng ràng buộc unique, và cách nhập mười nghìn hàng mà không giết connection pool.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Creating rows</h2>
<p class="lead">Three methods write new rows, and they trade the same thing against each other: <code>create</code> can do anything and costs a round trip per row; <code>createMany</code> inserts thousands in one statement but cannot touch relations. Knowing which limitation bites when is the difference between an import that finishes in four seconds and one that finishes in four minutes.</p>

<h3>Three methods, one trade-off</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">create</span><span class="lz-t">One row, any shape</span><span class="lz-d">Nested writes across any number of tables, in one transaction. Returns the row with generated ids. Costs one round trip per call — which is fine for one row and ruinous for ten thousand.</span></div>
  <div class="lz-step"><span class="lz-k">createMany</span><span class="lz-t">Thousands of rows, no relations</span><span class="lz-d">One multi-row <code>INSERT</code>, roughly eighty times faster. Cannot nest, cannot connect, returns only <code>{ count }</code>. Supports <code>skipDuplicates</code>.</span></div>
  <div class="lz-step"><span class="lz-k">createManyAndReturn</span><span class="lz-t">Both, with a caveat</span><span class="lz-d">Batched speed plus <code>RETURNING</code>, so you get ids back. Still no nesting — but the ids are what let you build a map and batch the children too.</span></div>
  <div class="lz-step"><span class="lz-k">The rule</span><span class="lz-t">More than ~20 rows of one shape</span><span class="lz-d">Stop looping <code>create</code>. Batch the parents, map their ids, batch the children. Wrap both in <code>$transaction</code> when the whole import must be all-or-nothing.</span></div>
</div>

<h3><code>create</code> — one row, any shape</h3>
<pre><code>const u = await prisma.user.create({
  data: {
    email: 'an@example.com',
    fullName: 'Nguyen Van An',
    profile: { create: { bio: 'Xin chao' } },              <span class="tok-comment">// 1-1 child</span>
    posts: {
      create: [{ title: 'Bai 1' }, { title: 'Bai 2' }],    <span class="tok-comment">// 1-n children</span>
    },
    roles: { connect: [{ name: 'USER' }] },                <span class="tok-comment">// n-n link to existing</span>
  },
  select: { id: true, email: true, _count: { select: { posts: true } } },
});
console.log(u);</code></pre>
<div class="out">prisma:query BEGIN
prisma:query INSERT INTO "users" ("email","full_name") VALUES ($1,$2) RETURNING "id"
prisma:query INSERT INTO "profiles" ("bio","user_id") VALUES ($1,$2)
prisma:query INSERT INTO "posts" ("title","author_id") VALUES ($1,$2), ($3,$4)
prisma:query INSERT INTO "_RoleToUser" ("A","B") VALUES ($1,$2) ON CONFLICT DO NOTHING
prisma:query SELECT "id","email",(SELECT COUNT(*) FROM "posts" WHERE "author_id"="users"."id") FROM "users" WHERE "id" = $1
prisma:query COMMIT

{ id: 1, email: 'an@example.com', _count: { posts: 2 } }</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Always a transaction when nested</span><span class="v">Four tables written, all or nothing. There is no state where the user exists without their profile — which is exactly why nested writes are worth the opacity.</span></div>
  <div class="kv"><span class="k">Siblings are batched</span><span class="v">Two posts became <em>one</em> multi-row <code>INSERT</code>. Ten posts would too. Only the levels are sequential, because each level needs the parent's generated id.</span></div>
  <div class="kv"><span class="k"><code>select</code> costs an extra query</span><span class="v">Adding <code>_count</code> forced a <code>SELECT</code> after the writes. Without it, the <code>RETURNING</code> clause on the insert supplies everything. Worth knowing when a create is on a hot path.</span></div>
  <div class="kv"><span class="k">The five nested operations</span><span class="v"><code>create</code>, <code>createMany</code>, <code>connect</code>, <code>connectOrCreate</code>, and — inside <code>update</code> only — <code>set</code>, <code>disconnect</code>, <code>update</code>, <code>upsert</code>, <code>delete</code>, <code>deleteMany</code>, <code>updateMany</code>.</span></div>
</div>

<h3><code>connectOrCreate</code> — the tag problem, solved</h3>
<pre><code><span class="tok-comment">// "Attach these tags; create the ones that do not exist yet"</span>
await prisma.post.create({
  data: {
    title: 'Bai moi',
    tags: {
      connectOrCreate: ['nodejs', 'prisma', 'postgres'].map((ten) =&gt; ({
        where:  { name: ten },
        create: { name: ten },
      })),
    },
  },
});</code></pre>
<div class="out">prisma:query BEGIN
prisma:query SELECT "id","name" FROM "tags" WHERE "name" IN ($1,$2,$3)
prisma:query INSERT INTO "tags" ("name") VALUES ($1) RETURNING "id"
prisma:query INSERT INTO "posts" ("title") VALUES ($1) RETURNING "id"
prisma:query INSERT INTO "_PostToTag" ("A","B") VALUES ($1,$2),($3,$4),($5,$6) ON CONFLICT DO NOTHING
prisma:query COMMIT</div>
<div class="pitfall">
<p><strong>Trap — <code>connectOrCreate</code> is not atomic against a concurrent writer.</strong> It reads, then decides, then writes. Two requests creating the tag <code>prisma</code> at the same instant both see it missing and both insert — and the second gets <code>P2002</code>. The unique constraint saves your data, but your request fails. In a low-concurrency admin flow that is acceptable. Under real traffic, catch <code>P2002</code> and retry once, or pre-create your tag vocabulary. Chapter 7 covers the general pattern.</p>
</div>

<h3><code>createMany</code> — thousands in one statement</h3>
<pre><code>const rows = Array.from({ length: 10_000 }, (_, i) =&gt; ({
  title: &#96;Bai \${i}&#96;,
  authorId: 1,
}));

console.time('create');
for (const r of rows) await prisma.post.create({ data: r });
console.timeEnd('create');

console.time('createMany');
await prisma.post.createMany({ data: rows });
console.timeEnd('createMany');</code></pre>
<div class="out">create: 41822.417ms
createMany: 486.331ms</div>
<div class="callout ok">
<p><strong>Eighty-six times faster.</strong> The loop pays a network round trip per row — ten thousand of them. <code>createMany</code> sends one multi-row <code>INSERT</code> (chunked internally, because PostgreSQL caps a statement at 65,535 bind parameters). Any time you are writing more than about twenty rows of the same shape, this is the method.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">It cannot write relations</span><span class="v">No <code>create</code>, no <code>connect</code>, no nesting. You supply foreign key scalars directly. For a graph, that means creating parents first, reading back their ids, then creating children — which is still far faster than a loop.</span></div>
  <div class="kv"><span class="k">It returns a count, not rows</span><span class="v"><code>{ count: 10000 }</code>. No generated ids come back, which is the real limitation. Use <code>createManyAndReturn</code> if you need them.</span></div>
  <div class="kv"><span class="k"><code>skipDuplicates: true</code></span><span class="v">Appends <code>ON CONFLICT DO NOTHING</code>, so a unique collision is skipped instead of failing the whole batch. Exactly right for idempotent imports; PostgreSQL, MySQL and SQLite only.</span></div>
  <div class="kv"><span class="k">It is one statement, so it is atomic</span><span class="v">Without <code>skipDuplicates</code>, one bad row rolls back all ten thousand. That is usually correct for an import, and occasionally the thing that makes you validate before writing.</span></div>
</div>
<pre><code><span class="tok-comment">// Prisma 5.14+: the rows come back, so you can use their ids</span>
const bai = await prisma.post.createManyAndReturn({
  data: [{ title: 'A', authorId: 1 }, { title: 'B', authorId: 1 }],
  select: { id: true, title: true },
});
console.log(bai);</code></pre>
<div class="out">prisma:query INSERT INTO "posts" ("title","author_id") VALUES ($1,$2),($3,$4) RETURNING "id","title"

[ { id: 101, title: 'A' }, { id: 102, title: 'B' } ]</div>

<h3>Importing a graph, at speed</h3>
<pre><code><span class="tok-comment">// 5,000 users, each with 3 posts. The naive nested version:</span>
<span class="tok-comment">//   for (const u of users) await prisma.user.create({ data: { ...u, posts: {...} } })</span>
<span class="tok-comment">// = 5,000 transactions, 15,000 inserts, about 40 seconds.</span>

<span class="tok-comment">// Two statements instead:</span>
const nguoiDung = await prisma.user.createManyAndReturn({
  data: users.map((u) =&gt; ({ email: u.email, fullName: u.fullName })),
  select: { id: true, email: true },
});

const byEmail = new Map(nguoiDung.map((u) =&gt; [u.email, u.id]));

await prisma.post.createMany({
  data: users.flatMap((u) =&gt;
    u.posts.map((p) =&gt; ({ title: p.title, authorId: byEmail.get(u.email)! })),
  ),
});</code></pre>
<div class="out">-- nested loop version
real    0m39.914s

-- two-statement version
real    0m1.207s</div>
<p>Thirty-three times faster, and the shape of the fix generalises: <strong>create parents in one batch, build an id map, create children in one batch</strong>. If the whole import must be atomic, wrap both calls in <code>prisma.$transaction</code> — Chapter 7 covers the timeout you will need to raise when you do.</p>

<h3>When the unique constraint fires</h3>
<pre><code>try {
  await prisma.user.create({ data: { email: 'an@example.com' } });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') {
    console.log('Trung o cot:', e.meta?.target);
    return res.status(409).json({ error: 'Email da duoc dung' });
  }
  throw e;
}</code></pre>
<div class="out">Trung o cot: [ 'email' ]</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>P2002</code> — unique violation</span><span class="v"><code>e.meta.target</code> names the columns, so you can point the user at the right form field instead of showing "something went wrong".</span></div>
  <div class="kv"><span class="k"><code>P2003</code> — foreign key violation</span><span class="v">You referenced a parent that does not exist. Usually a bug rather than user input, but worth catching to produce a 400 rather than a 500.</span></div>
  <div class="kv"><span class="k"><code>P2000</code> — value too long</span><span class="v">A string exceeded a <code>@db.VarChar(n)</code>. Validate at the boundary and this never reaches the database — but catch it anyway, because the boundary is where bugs live.</span></div>
  <div class="kv"><span class="k">Do not check-then-insert</span><span class="v"><code>findUnique</code> followed by <code>create</code> is two queries and still races. Insert, catch <code>P2002</code>. One round trip, and correct under concurrency.</span></div>
</div>

<h3>Sensible defaults, so callers cannot forget</h3>
<pre><code><span class="tok-comment">// A create that leans on the schema instead of the caller</span>
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  slug      String   @unique
  published Boolean  @default(false)          <span class="tok-comment">// draft unless said otherwise</span>
  views     Int      @default(0)
  createdAt DateTime @default(now())          <span class="tok-comment">// never passed by hand</span>
  updatedAt DateTime @updatedAt
}</code></pre>
<pre><code>await prisma.post.create({ data: { title: 'Bai', slug: 'bai', authorId: 1 } });</code></pre>
<div class="out">INSERT INTO "posts" ("title","slug","author_id","updated_at") VALUES ($1,$2,$3,$4) RETURNING ...
-- published, views and created_at came from the database defaults</div>
<div class="callout">
<p><strong>Every <code>@default</code> is a field a caller cannot get wrong.</strong> A <code>published Boolean</code> with no default forces every call site to pass it, and the day someone passes <code>true</code> by accident is the day a draft goes public. Put the safe value in the schema and let the exception be explicit. The same reasoning applies to <code>createdAt</code>: it should never appear in application code at all.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#create" target="_blank" rel="noopener"><span class="lc-ico">➕</span><span class="lc-body"><span class="lc-title">CRUD — create operations</span><span class="lc-sub">prisma.io/docs · <code>create</code>, <code>createMany</code>, <code>createManyAndReturn</code> with their exact arguments</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes" target="_blank" rel="noopener"><span class="lc-ico">🪆</span><span class="lc-body"><span class="lc-title">Nested writes</span><span class="lc-sub">prisma.io/docs · Every nested operation and which relation kinds accept it</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p2002" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P2002 and friends</span><span class="lc-sub">prisma.io/docs · The full error table, and what <code>meta</code> carries for each code</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-insert.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — INSERT and ON CONFLICT</span><span class="lc-sub">postgresql.org · What <code>skipDuplicates</code> and <code>upsert</code> compile down to</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Rewrite a 40-second nested import as two batched statements, and measure both</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Tạo hàng dữ liệu</h2>
<p class="lead">Có ba phương thức ghi hàng mới, và chúng đánh đổi cùng một thứ với nhau: <code>create</code> làm được mọi chuyện nhưng tốn một lượt đi về cho mỗi hàng; <code>createMany</code> chèn hàng nghìn hàng trong một câu lệnh nhưng không chạm được vào quan hệ. Biết hạn chế nào cắn lúc nào chính là khác biệt giữa một lần nhập dữ liệu xong trong bốn giây và một lần xong trong bốn phút.</p>

<h3>Ba phương thức, một phép đánh đổi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">create</span><span class="lz-t">Một hàng, hình dạng nào cũng được</span><span class="lz-d">Ghi lồng nhau qua bao nhiêu bảng cũng được, trong một giao dịch. Trả về hàng kèm các id vừa sinh. Tốn một lượt đi về cho mỗi lời gọi — ổn với một hàng và tai hoạ với mười nghìn.</span></div>
  <div class="lz-step"><span class="lz-k">createMany</span><span class="lz-t">Hàng nghìn hàng, không quan hệ</span><span class="lz-d">Một câu <code>INSERT</code> nhiều hàng, nhanh hơn khoảng tám mươi lần. Không lồng được, không connect được, chỉ trả về <code>{ count }</code>. Hỗ trợ <code>skipDuplicates</code>.</span></div>
  <div class="lz-step"><span class="lz-k">createManyAndReturn</span><span class="lz-t">Cả hai, kèm một lưu ý</span><span class="lz-d">Tốc độ gom lô cộng <code>RETURNING</code>, nên bạn nhận lại id. Vẫn không lồng được — nhưng chính mấy cái id ấy cho phép bạn dựng một bản đồ và gom lô luôn cả các con.</span></div>
  <div class="lz-step"><span class="lz-k">Luật</span><span class="lz-t">Hơn khoảng 20 hàng cùng một hình dạng</span><span class="lz-d">Thôi lặp <code>create</code>. Gom lô các cha, ánh xạ id của chúng, gom lô các con. Bọc cả hai trong <code>$transaction</code> khi cả lần nhập phải được-tất-hoặc-không-gì.</span></div>
</div>

<h3><code>create</code> — một hàng, hình dạng nào cũng được</h3>
<pre><code>const u = await prisma.user.create({
  data: {
    email: 'an@example.com',
    fullName: 'Nguyen Van An',
    profile: { create: { bio: 'Xin chao' } },              <span class="tok-comment">// con 1-1</span>
    posts: {
      create: [{ title: 'Bai 1' }, { title: 'Bai 2' }],    <span class="tok-comment">// con 1-n</span>
    },
    roles: { connect: [{ name: 'USER' }] },                <span class="tok-comment">// nối n-n tới bản đã có</span>
  },
  select: { id: true, email: true, _count: { select: { posts: true } } },
});
console.log(u);</code></pre>
<div class="out">prisma:query BEGIN
prisma:query INSERT INTO "users" ("email","full_name") VALUES ($1,$2) RETURNING "id"
prisma:query INSERT INTO "profiles" ("bio","user_id") VALUES ($1,$2)
prisma:query INSERT INTO "posts" ("title","author_id") VALUES ($1,$2), ($3,$4)
prisma:query INSERT INTO "_RoleToUser" ("A","B") VALUES ($1,$2) ON CONFLICT DO NOTHING
prisma:query SELECT "id","email",(SELECT COUNT(*) FROM "posts" WHERE "author_id"="users"."id") FROM "users" WHERE "id" = $1
prisma:query COMMIT

{ id: 1, email: 'an@example.com', _count: { posts: 2 } }</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Luôn là một giao dịch khi có lồng nhau</span><span class="v">Bốn bảng được ghi, được tất hoặc không gì cả. Không tồn tại trạng thái nào mà người dùng có mặt còn hồ sơ thì không — và đó đúng là lý do ghi lồng nhau đáng để đánh đổi sự kém rõ ràng.</span></div>
  <div class="kv"><span class="k">Các con cùng cấp được gom lô</span><span class="v">Hai bài viết thành <em>một</em> câu <code>INSERT</code> nhiều hàng. Mười bài cũng vậy. Chỉ các tầng là tuần tự, vì mỗi tầng cần id vừa sinh của cha.</span></div>
  <div class="kv"><span class="k"><code>select</code> tốn thêm một câu truy vấn</span><span class="v">Thêm <code>_count</code> ép phải có một câu <code>SELECT</code> sau các lần ghi. Không có nó thì mệnh đề <code>RETURNING</code> của câu insert cung cấp đủ. Đáng biết khi một lệnh create nằm trên đường nóng.</span></div>
  <div class="kv"><span class="k">Năm thao tác lồng nhau</span><span class="v"><code>create</code>, <code>createMany</code>, <code>connect</code>, <code>connectOrCreate</code>, và — chỉ bên trong <code>update</code> — <code>set</code>, <code>disconnect</code>, <code>update</code>, <code>upsert</code>, <code>delete</code>, <code>deleteMany</code>, <code>updateMany</code>.</span></div>
</div>

<h3><code>connectOrCreate</code> — bài toán thẻ, đã giải</h3>
<pre><code><span class="tok-comment">// "Gắn mấy thẻ này; cái nào chưa có thì tạo"</span>
await prisma.post.create({
  data: {
    title: 'Bai moi',
    tags: {
      connectOrCreate: ['nodejs', 'prisma', 'postgres'].map((ten) =&gt; ({
        where:  { name: ten },
        create: { name: ten },
      })),
    },
  },
});</code></pre>
<div class="out">prisma:query BEGIN
prisma:query SELECT "id","name" FROM "tags" WHERE "name" IN ($1,$2,$3)
prisma:query INSERT INTO "tags" ("name") VALUES ($1) RETURNING "id"
prisma:query INSERT INTO "posts" ("title") VALUES ($1) RETURNING "id"
prisma:query INSERT INTO "_PostToTag" ("A","B") VALUES ($1,$2),($3,$4),($5,$6) ON CONFLICT DO NOTHING
prisma:query COMMIT</div>
<div class="pitfall">
<p><strong>Bẫy — <code>connectOrCreate</code> không nguyên tử trước một bên ghi song song.</strong> Nó đọc, rồi quyết, rồi ghi. Hai yêu cầu cùng tạo thẻ <code>prisma</code> tại cùng một khoảnh khắc đều thấy nó chưa có và đều chèn — và cái thứ hai nhận <code>P2002</code>. Ràng buộc unique cứu dữ liệu của bạn, nhưng yêu cầu của bạn thì hỏng. Trong một luồng quản trị ít tranh chấp thì chấp nhận được. Dưới lưu lượng thật, hãy bắt <code>P2002</code> và thử lại một lần, hoặc tạo sẵn bộ từ vựng thẻ. Chương 7 nói mẫu tổng quát.</p>
</div>

<h3><code>createMany</code> — hàng nghìn hàng trong một câu lệnh</h3>
<pre><code>const rows = Array.from({ length: 10_000 }, (_, i) =&gt; ({
  title: &#96;Bai \${i}&#96;,
  authorId: 1,
}));

console.time('create');
for (const r of rows) await prisma.post.create({ data: r });
console.timeEnd('create');

console.time('createMany');
await prisma.post.createMany({ data: rows });
console.timeEnd('createMany');</code></pre>
<div class="out">create: 41822.417ms
createMany: 486.331ms</div>
<div class="callout ok">
<p><strong>Nhanh gấp tám mươi sáu lần.</strong> Vòng lặp trả giá một lượt đi về mạng cho mỗi hàng — mười nghìn lượt. <code>createMany</code> gửi một câu <code>INSERT</code> nhiều hàng (được chia mảnh bên trong, vì PostgreSQL giới hạn 65.535 tham số cho một câu lệnh). Bất cứ khi nào bạn ghi hơn khoảng hai mươi hàng cùng hình dạng thì đây là phương thức cần dùng.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó không ghi được quan hệ</span><span class="v">Không <code>create</code>, không <code>connect</code>, không lồng nhau. Bạn tự cung cấp các trường vô hướng khoá ngoại. Với một đồ thị thì điều đó nghĩa là tạo cha trước, đọc lại id của chúng, rồi tạo con — và cách ấy vẫn nhanh hơn một vòng lặp rất nhiều.</span></div>
  <div class="kv"><span class="k">Nó trả về một số đếm, không phải các hàng</span><span class="v"><code>{ count: 10000 }</code>. Không id nào vừa sinh quay về, và đó mới là hạn chế thật. Dùng <code>createManyAndReturn</code> nếu bạn cần chúng.</span></div>
  <div class="kv"><span class="k"><code>skipDuplicates: true</code></span><span class="v">Thêm <code>ON CONFLICT DO NOTHING</code>, nên một lần đụng unique bị bỏ qua thay vì làm hỏng cả lô. Đúng y cho các lần nhập dữ liệu idempotent; chỉ có ở PostgreSQL, MySQL và SQLite.</span></div>
  <div class="kv"><span class="k">Nó là một câu lệnh, nên nó nguyên tử</span><span class="v">Không có <code>skipDuplicates</code> thì một hàng hỏng làm quay lui cả mười nghìn hàng. Thường thì đúng ý cho một lần nhập, và thỉnh thoảng là thứ khiến bạn phải kiểm dữ liệu trước khi ghi.</span></div>
</div>
<pre><code><span class="tok-comment">// Prisma 5.14+: các hàng quay về, nên bạn dùng được id của chúng</span>
const bai = await prisma.post.createManyAndReturn({
  data: [{ title: 'A', authorId: 1 }, { title: 'B', authorId: 1 }],
  select: { id: true, title: true },
});
console.log(bai);</code></pre>
<div class="out">prisma:query INSERT INTO "posts" ("title","author_id") VALUES ($1,$2),($3,$4) RETURNING "id","title"

[ { id: 101, title: 'A' }, { id: 102, title: 'B' } ]</div>

<h3>Nhập một đồ thị, với tốc độ</h3>
<pre><code><span class="tok-comment">// 5.000 người dùng, mỗi người 3 bài viết. Bản lồng nhau ngây thơ:</span>
<span class="tok-comment">//   for (const u of users) await prisma.user.create({ data: { ...u, posts: {...} } })</span>
<span class="tok-comment">// = 5.000 giao dịch, 15.000 lần chèn, khoảng 40 giây.</span>

<span class="tok-comment">// Hai câu lệnh thay vào đó:</span>
const nguoiDung = await prisma.user.createManyAndReturn({
  data: users.map((u) =&gt; ({ email: u.email, fullName: u.fullName })),
  select: { id: true, email: true },
});

const byEmail = new Map(nguoiDung.map((u) =&gt; [u.email, u.id]));

await prisma.post.createMany({
  data: users.flatMap((u) =&gt;
    u.posts.map((p) =&gt; ({ title: p.title, authorId: byEmail.get(u.email)! })),
  ),
});</code></pre>
<div class="out">-- bản vòng lặp lồng nhau
real    0m39.914s

-- bản hai câu lệnh
real    0m1.207s</div>
<p>Nhanh gấp ba mươi ba lần, và hình dạng của cách vá này tổng quát hoá được: <strong>tạo cha trong một lô, dựng một bản đồ id, tạo con trong một lô</strong>. Nếu cả lần nhập phải nguyên tử thì bọc cả hai lời gọi trong <code>prisma.$transaction</code> — Chương 7 nói về cái timeout bạn sẽ phải nâng lên khi làm vậy.</p>

<h3>Khi ràng buộc unique nổ</h3>
<pre><code>try {
  await prisma.user.create({ data: { email: 'an@example.com' } });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') {
    console.log('Trung o cot:', e.meta?.target);
    return res.status(409).json({ error: 'Email da duoc dung' });
  }
  throw e;
}</code></pre>
<div class="out">Trung o cot: [ 'email' ]</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>P2002</code> — vi phạm unique</span><span class="v"><code>e.meta.target</code> nêu tên các cột, nên bạn chỉ đúng ô nhập cho người dùng thay vì hiện "có gì đó sai".</span></div>
  <div class="kv"><span class="k"><code>P2003</code> — vi phạm khoá ngoại</span><span class="v">Bạn tham chiếu tới một cha không tồn tại. Thường là một con bọ chứ không phải dữ liệu người dùng, nhưng vẫn đáng bắt để trả 400 thay vì 500.</span></div>
  <div class="kv"><span class="k"><code>P2000</code> — giá trị quá dài</span><span class="v">Một chuỗi vượt quá một <code>@db.VarChar(n)</code>. Kiểm ở ranh giới thì nó không bao giờ tới cơ sở dữ liệu — nhưng cứ bắt nó, vì ranh giới chính là nơi con bọ sinh sống.</span></div>
  <div class="kv"><span class="k">Đừng kiểm-rồi-chèn</span><span class="v"><code>findUnique</code> rồi <code>create</code> là hai câu truy vấn mà vẫn có tranh chấp. Cứ chèn, rồi bắt <code>P2002</code>. Một lượt đi về, và đúng đắn dưới tranh chấp.</span></div>
</div>

<h3>Giá trị mặc định hợp lý, để người gọi không quên được</h3>
<pre><code><span class="tok-comment">// Một lệnh create dựa vào lược đồ thay vì dựa vào người gọi</span>
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  slug      String   @unique
  published Boolean  @default(false)          <span class="tok-comment">// là bản nháp trừ khi nói khác</span>
  views     Int      @default(0)
  createdAt DateTime @default(now())          <span class="tok-comment">// không bao giờ truyền bằng tay</span>
  updatedAt DateTime @updatedAt
}</code></pre>
<pre><code>await prisma.post.create({ data: { title: 'Bai', slug: 'bai', authorId: 1 } });</code></pre>
<div class="out">INSERT INTO "posts" ("title","slug","author_id","updated_at") VALUES ($1,$2,$3,$4) RETURNING ...
-- published, views và created_at đến từ giá trị mặc định của cơ sở dữ liệu</div>
<div class="callout">
<p><strong>Mỗi <code>@default</code> là một trường mà người gọi không làm sai được.</strong> Một <code>published Boolean</code> không có giá trị mặc định ép mọi chỗ gọi phải truyền nó, và ngày ai đó lỡ tay truyền <code>true</code> là ngày một bản nháp lên sóng. Hãy đặt giá trị an toàn vào lược đồ và để ngoại lệ phải nói ra tường minh. Lập luận đó cũng đúng với <code>createdAt</code>: nó lẽ ra không nên xuất hiện trong mã ứng dụng chút nào.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#create" target="_blank" rel="noopener"><span class="lc-ico">➕</span><span class="lc-body"><span class="lc-title">CRUD — thao tác tạo</span><span class="lc-sub">prisma.io/docs · <code>create</code>, <code>createMany</code>, <code>createManyAndReturn</code> kèm tham số chính xác</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes" target="_blank" rel="noopener"><span class="lc-ico">🪆</span><span class="lc-body"><span class="lc-title">Nested writes</span><span class="lc-sub">prisma.io/docs · Mọi thao tác lồng nhau và kiểu quan hệ nào nhận nó</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p2002" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P2002 và các bạn</span><span class="lc-sub">prisma.io/docs · Bảng lỗi đầy đủ, và phần <code>meta</code> mang gì cho từng mã</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-insert.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — INSERT và ON CONFLICT</span><span class="lc-sub">postgresql.org · <code>skipDuplicates</code> và <code>upsert</code> biên dịch xuống thành gì</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Viết lại một lần nhập lồng nhau 40 giây thành hai câu lệnh gom lô, và đo cả hai</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Updating, and the atomic operators|||4.4 — Cập nhật, và các toán tử nguyên tử',
      slug: 'pr-4-4-cap-nhat',
      type: 'LESSON',
      description: 'update so với updateMany và cái nào trả về hàng, sáu toán tử nguyên tử cho số và mảng, upsert cùng cuộc đua bên trong nó, ghi lồng nhau trên quan hệ, và updateManyAndReturn của Prisma 6.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Updating, and the atomic operators</h2>
<p class="lead">Updating looks like the simplest operation in the client and contains the subtlest bug in the whole course. Two of the three methods behave differently from what their names suggest, and the difference between <code>{ views: n + 1 }</code> and <code>{ views: { increment: 1 } }</code> is the difference between a counter that is correct and one that quietly loses writes under load.</p>

<h3>The three methods</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>update</code></span><span class="v">Exactly one row, addressed by a unique field. Returns the updated row. Throws <code>P2025</code> if it does not exist — there is no <code>updateOrThrow</code> because throwing is already the behaviour.</span></div>
  <div class="kv"><span class="k"><code>updateMany</code></span><span class="v">Any number of rows matching any filter. Returns <code>{ count }</code>, <strong>not the rows</strong>. Does not throw when nothing matched — <code>{ count: 0 }</code> is a normal answer.</span></div>
  <div class="kv"><span class="k"><code>upsert</code></span><span class="v">Update if the unique key exists, create otherwise. One statement on PostgreSQL (<code>ON CONFLICT DO UPDATE</code>), and therefore atomic — mostly. See below.</span></div>
  <div class="kv"><span class="k"><code>updateManyAndReturn</code></span><span class="v">Prisma 6: <code>updateMany</code> that returns the rows via <code>RETURNING</code>. Fills the gap that used to force a follow-up <code>findMany</code>.</span></div>
</div>
<pre><code><span class="tok-comment">// update — one row, and it must exist</span>
const bai = await prisma.post.update({
  where: { id: 1 },
  data: { title: 'Doi ten', published: true },
});

<span class="tok-comment">// updateMany — a count, no rows, no throw</span>
const r = await prisma.post.updateMany({
  where: { authorId: 3, published: false },
  data: { published: true },
});
console.log(r);

<span class="tok-comment">// Prisma 6: the rows come back</span>
const rows = await prisma.post.updateManyAndReturn({
  where: { authorId: 3 },
  data: { published: true },
  select: { id: true, title: true },
});</code></pre>
<div class="out">prisma:query UPDATE "posts" SET "title"=$1,"published"=$2,"updated_at"=$3 WHERE ("id"=$4 AND 1=1) RETURNING "id","title",...
prisma:query UPDATE "posts" SET "published"=$1,"updated_at"=$2 WHERE ("author_id"=$3 AND "published"=$4)
{ count: 7 }
prisma:query UPDATE "posts" SET "published"=$1,"updated_at"=$2 WHERE "author_id"=$3 RETURNING "id","title"</div>
<div class="pitfall">
<p><strong>Trap — <code>updateMany</code> matching nothing is silent.</strong> <code>{ count: 0 }</code> is not an error, so an update whose <code>where</code> was wrong looks exactly like an update whose rows were already correct. Any handler that reports success must check the count: <code>if (r.count === 0) return res.status(404)</code>. This is the mirror image of <code>update</code>, which throws — and the reason people reach for <code>updateMany</code> to "avoid the exception" and then never notice their update stopped working.</p>
</div>

<h3>The lost-update race, drawn</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Read-then-write · WRONG</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A reads 120 · B reads 120</span><span class="lz-nsub">Two SELECTs, both returning the same value. Nothing is locked; nothing is wrong yet.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A writes 121 · B writes 121</span><span class="lz-nsub">Each computed <code>120 + 1</code> in its own process. The second write overwrites the first — final value 121, one increment gone, no error anywhere.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Atomic · CORRECT</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Both send <code>SET views = views + 1</code></span><span class="lz-nsub">The arithmetic happens inside PostgreSQL, on the current row value, under a row lock it takes for the duration of each statement.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Final value 122</span><span class="lz-nsub">Whatever order they arrive in. The second statement reads the value the first one committed, because it never left the database.</span></div></div>
  </div>
</div>

<h3>The six atomic operators</h3>
<pre><code><span class="tok-comment">// Numbers: computed by the database, safe under concurrency</span>
await prisma.post.update({ where: { id: 1 }, data: { views:   { increment: 1 } } });
await prisma.post.update({ where: { id: 1 }, data: { stock:   { decrement: 1 } } });
await prisma.post.update({ where: { id: 1 }, data: { score:   { multiply: 2 } } });
await prisma.post.update({ where: { id: 1 }, data: { ratio:   { divide: 2 } } });
await prisma.post.update({ where: { id: 1 }, data: { views:   { set: 0 } } });

<span class="tok-comment">// Lists (PostgreSQL arrays)</span>
await prisma.post.update({ where: { id: 1 }, data: { tags: { push: 'prisma' } } });
await prisma.post.update({ where: { id: 1 }, data: { tags: { push: ['a', 'b'] } } });
await prisma.post.update({ where: { id: 1 }, data: { tags: { set: ['moi'] } } });</code></pre>
<div class="out">UPDATE "posts" SET "views" = "posts"."views" + $1 WHERE "id" = $2 RETURNING ...
UPDATE "posts" SET "tags" = array_cat("posts"."tags", $1) WHERE "id" = $2 RETURNING ...</div>
<div class="callout warn">
<p><strong>The lost-update race, in full.</strong> Two requests want to increment a view count that is 120.</p>
<p><em>Read-then-write:</em> request A reads 120. Request B reads 120. A computes 121 and writes it. B computes 121 and writes it. The final value is 121, and one view has vanished with no error anywhere. Under a hundred concurrent readers you lose a large fraction of them.</p>
<p><em>Atomic:</em> both send <code>SET views = views + 1</code>. PostgreSQL takes a row lock for each, applies them in some order, and the final value is 122. Always.</p>
</div>
<pre><code><span class="tok-comment">// Reproduce it — 100 concurrent increments, both ways</span>
await prisma.post.update({ where: { id: 1 }, data: { views: 0 } });

await Promise.all(Array.from({ length: 100 }, async () =&gt; {
  const p = await prisma.post.findUniqueOrThrow({ where: { id: 1 } });
  await prisma.post.update({ where: { id: 1 }, data: { views: p.views + 1 } });
}));
console.log('doc-roi-ghi:', (await prisma.post.findUniqueOrThrow({ where: { id: 1 } })).views);

await prisma.post.update({ where: { id: 1 }, data: { views: 0 } });

await Promise.all(Array.from({ length: 100 }, () =&gt;
  prisma.post.update({ where: { id: 1 }, data: { views: { increment: 1 } } }),
));
console.log('nguyen tu  :', (await prisma.post.findUniqueOrThrow({ where: { id: 1 } })).views);</code></pre>
<div class="out">doc-roi-ghi: 23
nguyen tu  : 100</div>
<p>Seventy-seven of a hundred writes silently lost. On a development machine with one user this code appears to work perfectly, which is exactly why the bug reaches production. Any field that is <em>derived from its own previous value</em> — a counter, a balance, a stock level, a retry count — must use an atomic operator or an explicit transaction. Chapter 7 covers the cases atomic operators cannot express.</p>

<h3><code>upsert</code>, and the race it still has</h3>
<pre><code>await prisma.setting.upsert({
  where:  { key: 'site_name' },
  update: { value: 'CuongThai' },
  create: { key: 'site_name', value: 'CuongThai' },
});</code></pre>
<div class="out">prisma:query INSERT INTO "settings" ("key","value") VALUES ($1,$2)
             ON CONFLICT ("key") DO UPDATE SET "value" = $3
             RETURNING "id","key","value"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">One statement, when it can be</span><span class="v">On PostgreSQL, MySQL and SQLite, with a single unique field in <code>where</code> and no nested writes, Prisma emits a native upsert. That is atomic and race-free.</span></div>
  <div class="kv"><span class="k">Two statements, when it cannot</span><span class="v">Nested writes, a composite unique key, or a non-trivial filter make Prisma fall back to <code>SELECT</code>-then-<code>INSERT</code>-or-<code>UPDATE</code> inside a transaction. That version <strong>can</strong> race: two concurrent upserts of a missing row both try to insert, and one gets <code>P2002</code>.</span></div>
  <div class="kv"><span class="k">How to tell which you got</span><span class="v">Read the query log. <code>ON CONFLICT</code> means the fast atomic path; a <code>SELECT</code> followed by an <code>INSERT</code> means the fallback. This is a two-second check and it tells you whether you need a retry.</span></div>
  <div class="kv"><span class="k">The retry, when you need one</span><span class="v">Catch <code>P2002</code> and call <code>upsert</code> again — the second attempt finds the row and takes the update branch. One retry is enough; a loop is a sign the unique key is wrong.</span></div>
</div>
<pre><code><span class="tok-comment">// Idempotent counter, correct under concurrency: upsert + atomic operator together</span>
await prisma.pageView.upsert({
  where:  { path_day: { path: '/courses', day: homNay } },
  update: { count: { increment: 1 } },
  create: { path: '/courses', day: homNay, count: 1 },
});</code></pre>
<div class="out">INSERT INTO "page_views" ("path","day","count") VALUES ($1,$2,$3)
ON CONFLICT ("path","day") DO UPDATE SET "count" = "page_views"."count" + $4
RETURNING ...</div>
<p>That single statement is a complete daily-counter implementation: no read, no branch in application code, no race. It is worth memorising as a shape.</p>

<h3>Nested updates: editing the children</h3>
<pre><code>await prisma.user.update({
  where: { id: 1 },
  data: {
    fullName: 'Nguyen Van An',

    <span class="tok-comment">// one-to-one: create it if missing, update it if present</span>
    profile: { upsert: { create: { bio: 'Lan dau' }, update: { bio: 'Cap nhat' } } },

    <span class="tok-comment">// one-to-many: any combination, all in the same transaction</span>
    posts: {
      updateMany: { where: { published: false }, data: { published: true } },
      update:     { where: { id: 3 }, data: { title: 'Sua rieng bai nay' } },
      create:     [{ title: 'Bai moi' }],
      deleteMany: { views: 0 },
    },

    <span class="tok-comment">// many-to-many: replace the whole set</span>
    roles: { set: [{ name: 'ADMIN' }, { name: 'USER' }] },
  },
});</code></pre>
<div class="out">prisma:query BEGIN
prisma:query UPDATE "users" SET "full_name"=$1 WHERE "id"=$2
prisma:query SELECT "id" FROM "profiles" WHERE "user_id"=$1
prisma:query UPDATE "profiles" SET "bio"=$1 WHERE "user_id"=$2
prisma:query UPDATE "posts" SET "published"=$1 WHERE ("author_id"=$2 AND "published"=$3)
prisma:query UPDATE "posts" SET "title"=$1 WHERE ("id"=$2 AND "author_id"=$3)
prisma:query INSERT INTO "posts" ("title","author_id") VALUES ($1,$2)
prisma:query DELETE FROM "posts" WHERE ("author_id"=$1 AND "views"=$2)
prisma:query DELETE FROM "_RoleToUser" WHERE "B"=$1
prisma:query INSERT INTO "_RoleToUser" ("A","B") VALUES ($1,$2),($3,$4)
prisma:query COMMIT</div>
<div class="callout">
<p><strong>Nine statements, one transaction, one call.</strong> Notice the nested <code>update</code> got <code>AND "author_id" = $3</code> added automatically — Prisma will not let a nested update escape its parent, so you cannot accidentally edit someone else's post through this path. That scoping is a genuine safety property, and it is the main reason to prefer a nested update over a separate top-level one when the parent is already identified.</p>
</div>

<h3>Conditional updates, without reading first</h3>
<pre><code><span class="tok-comment">// "Publish it, but only if it is still a draft" — no read, no race</span>
const r = await prisma.post.updateMany({
  where: { id: 1, published: false },
  data:  { published: true, publishedAt: new Date() },
});
if (r.count === 0) throw new Error('Bai da duoc dang truoc do');

<span class="tok-comment">// "Take one from stock, but never below zero"</span>
const s = await prisma.product.updateMany({
  where: { id: 1, stock: { gt: 0 } },
  data:  { stock: { decrement: 1 } },
});
if (s.count === 0) throw new Error('Het hang');</code></pre>
<div class="out">UPDATE "posts" SET "published"=$1,"published_at"=$2,"updated_at"=$3 WHERE ("id"=$4 AND "published"=$5)
UPDATE "products" SET "stock" = "products"."stock" - $1 WHERE ("id"=$2 AND "products"."stock" &gt; $3)</div>
<div class="callout ok">
<p><strong>This is the most useful pattern in the lesson.</strong> Putting the precondition in the <code>where</code> makes the check and the write a single statement, so nothing can change between them. <code>count === 0</code> then means "the precondition was false" — a clear signal, and the standard way to implement guarded state transitions without a transaction. Chapter 7 shows what to do when the precondition spans two tables and this trick stops being enough.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#update" target="_blank" rel="noopener"><span class="lc-ico">✏️</span><span class="lc-body"><span class="lc-title">CRUD — update operations</span><span class="lc-sub">prisma.io/docs · All four methods, their return types, and when each throws</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-a-single-record-with-atomic-number-operations" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">Atomic number operations</span><span class="lc-sub">prisma.io/docs · The operator list and the SQL each one generates</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — ON CONFLICT</span><span class="lc-sub">postgresql.org · What upsert compiles to, and the guarantees it does and does not give</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, transactions chapter</span><span class="lc-sub">Row locks and MVCC — why <code>SET x = x + 1</code> is safe and a read-then-write is not</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Reproduce the lost-update race with 100 concurrent clients, then fix it three ways</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Cập nhật, và các toán tử nguyên tử</h2>
<p class="lead">Cập nhật trông như thao tác đơn giản nhất trong client và lại chứa con bọ tinh vi nhất của cả khoá học. Hai trong ba phương thức cư xử khác với thứ tên gọi của chúng gợi ra, và khác biệt giữa <code>{ views: n + 1 }</code> và <code>{ views: { increment: 1 } }</code> chính là khác biệt giữa một bộ đếm đúng và một bộ đếm âm thầm đánh rơi các lần ghi khi tải lên cao.</p>

<h3>Ba phương thức</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>update</code></span><span class="v">Đúng một hàng, định vị bằng trường unique. Trả về hàng đã sửa. Ném <code>P2025</code> nếu nó không tồn tại — không có <code>updateOrThrow</code> vì ném lỗi vốn đã là hành vi mặc định.</span></div>
  <div class="kv"><span class="k"><code>updateMany</code></span><span class="v">Bao nhiêu hàng khớp bộ lọc cũng được. Trả về <code>{ count }</code>, <strong>không phải các hàng</strong>. Không ném lỗi khi chẳng khớp gì — <code>{ count: 0 }</code> là một câu trả lời bình thường.</span></div>
  <div class="kv"><span class="k"><code>upsert</code></span><span class="v">Sửa nếu khoá unique đã có, tạo nếu chưa. Một câu lệnh trên PostgreSQL (<code>ON CONFLICT DO UPDATE</code>), và vì thế nguyên tử — phần lớn trường hợp. Xem bên dưới.</span></div>
  <div class="kv"><span class="k"><code>updateManyAndReturn</code></span><span class="v">Prisma 6: <code>updateMany</code> có trả về các hàng thông qua <code>RETURNING</code>. Lấp đúng cái lỗ vốn buộc bạn phải <code>findMany</code> thêm một lần.</span></div>
</div>
<pre><code><span class="tok-comment">// update — một hàng, và nó buộc phải tồn tại</span>
const bai = await prisma.post.update({
  where: { id: 1 },
  data: { title: 'Doi ten', published: true },
});

<span class="tok-comment">// updateMany — một số đếm, không có hàng, không ném lỗi</span>
const r = await prisma.post.updateMany({
  where: { authorId: 3, published: false },
  data: { published: true },
});
console.log(r);

<span class="tok-comment">// Prisma 6: các hàng quay về</span>
const rows = await prisma.post.updateManyAndReturn({
  where: { authorId: 3 },
  data: { published: true },
  select: { id: true, title: true },
});</code></pre>
<div class="out">prisma:query UPDATE "posts" SET "title"=$1,"published"=$2,"updated_at"=$3 WHERE ("id"=$4 AND 1=1) RETURNING "id","title",...
prisma:query UPDATE "posts" SET "published"=$1,"updated_at"=$2 WHERE ("author_id"=$3 AND "published"=$4)
{ count: 7 }
prisma:query UPDATE "posts" SET "published"=$1,"updated_at"=$2 WHERE "author_id"=$3 RETURNING "id","title"</div>
<div class="pitfall">
<p><strong>Bẫy — <code>updateMany</code> không khớp gì thì im lặng.</strong> <code>{ count: 0 }</code> không phải lỗi, nên một lần cập nhật có <code>where</code> viết sai trông y hệt một lần cập nhật mà các hàng vốn đã đúng sẵn. Bất kỳ handler nào báo thành công đều phải kiểm số đếm: <code>if (r.count === 0) return res.status(404)</code>. Đây là hình ảnh phản chiếu của <code>update</code>, vốn ném lỗi — và cũng là lý do người ta với tay tới <code>updateMany</code> để "tránh ngoại lệ" rồi không bao giờ nhận ra bản cập nhật của mình đã ngừng hoạt động.</p>
</div>

<h3>Cuộc đua mất-cập-nhật, vẽ ra</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Đọc-rồi-ghi · SAI</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A đọc 120 · B đọc 120</span><span class="lz-nsub">Hai câu SELECT, cùng trả về một giá trị. Chưa gì bị khoá; chưa có gì sai cả.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A ghi 121 · B ghi 121</span><span class="lz-nsub">Mỗi bên tự tính <code>120 + 1</code> trong tiến trình của mình. Lần ghi thứ hai đè lên lần thứ nhất — giá trị cuối là 121, một lần tăng biến mất, không lỗi nào ở đâu.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nguyên tử · ĐÚNG</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cả hai gửi <code>SET views = views + 1</code></span><span class="lz-nsub">Phép tính xảy ra bên trong PostgreSQL, trên giá trị hiện tại của hàng, dưới một khoá hàng mà nó giữ trong suốt mỗi câu lệnh.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Giá trị cuối là 122</span><span class="lz-nsub">Chúng tới theo thứ tự nào cũng vậy. Câu lệnh thứ hai đọc đúng giá trị mà câu thứ nhất đã commit, vì con số ấy chưa bao giờ rời khỏi cơ sở dữ liệu.</span></div></div>
  </div>
</div>

<h3>Sáu toán tử nguyên tử</h3>
<pre><code><span class="tok-comment">// Số: do cơ sở dữ liệu tính, an toàn dưới tranh chấp</span>
await prisma.post.update({ where: { id: 1 }, data: { views:   { increment: 1 } } });
await prisma.post.update({ where: { id: 1 }, data: { stock:   { decrement: 1 } } });
await prisma.post.update({ where: { id: 1 }, data: { score:   { multiply: 2 } } });
await prisma.post.update({ where: { id: 1 }, data: { ratio:   { divide: 2 } } });
await prisma.post.update({ where: { id: 1 }, data: { views:   { set: 0 } } });

<span class="tok-comment">// Danh sách (mảng của PostgreSQL)</span>
await prisma.post.update({ where: { id: 1 }, data: { tags: { push: 'prisma' } } });
await prisma.post.update({ where: { id: 1 }, data: { tags: { push: ['a', 'b'] } } });
await prisma.post.update({ where: { id: 1 }, data: { tags: { set: ['moi'] } } });</code></pre>
<div class="out">UPDATE "posts" SET "views" = "posts"."views" + $1 WHERE "id" = $2 RETURNING ...
UPDATE "posts" SET "tags" = array_cat("posts"."tags", $1) WHERE "id" = $2 RETURNING ...</div>
<div class="callout warn">
<p><strong>Cuộc đua mất-cập-nhật, nói đủ.</strong> Hai yêu cầu cùng muốn tăng một bộ đếm lượt xem đang là 120.</p>
<p><em>Đọc-rồi-ghi:</em> yêu cầu A đọc 120. Yêu cầu B đọc 120. A tính ra 121 rồi ghi. B tính ra 121 rồi ghi. Giá trị cuối là 121, và một lượt xem đã bốc hơi mà không có lỗi nào ở đâu cả. Với một trăm người đọc song song thì bạn mất một phần lớn trong số đó.</p>
<p><em>Nguyên tử:</em> cả hai cùng gửi <code>SET views = views + 1</code>. PostgreSQL khoá hàng cho từng lần, áp dụng chúng theo một thứ tự nào đó, và giá trị cuối là 122. Luôn luôn.</p>
</div>
<pre><code><span class="tok-comment">// Dựng lại nó — 100 lần tăng song song, theo cả hai cách</span>
await prisma.post.update({ where: { id: 1 }, data: { views: 0 } });

await Promise.all(Array.from({ length: 100 }, async () =&gt; {
  const p = await prisma.post.findUniqueOrThrow({ where: { id: 1 } });
  await prisma.post.update({ where: { id: 1 }, data: { views: p.views + 1 } });
}));
console.log('doc-roi-ghi:', (await prisma.post.findUniqueOrThrow({ where: { id: 1 } })).views);

await prisma.post.update({ where: { id: 1 }, data: { views: 0 } });

await Promise.all(Array.from({ length: 100 }, () =&gt;
  prisma.post.update({ where: { id: 1 }, data: { views: { increment: 1 } } }),
));
console.log('nguyen tu  :', (await prisma.post.findUniqueOrThrow({ where: { id: 1 } })).views);</code></pre>
<div class="out">doc-roi-ghi: 23
nguyen tu  : 100</div>
<p>Bảy mươi bảy trên một trăm lần ghi mất trong im lặng. Trên máy phát triển với một người dùng thì đoạn mã ấy trông chạy hoàn hảo, và chính vì thế con bọ đi thẳng lên production. Bất kỳ trường nào <em>được suy ra từ chính giá trị trước đó của nó</em> — một bộ đếm, một số dư, một mức tồn kho, một số lần thử lại — đều phải dùng toán tử nguyên tử hoặc một giao dịch tường minh. Chương 7 nói về những trường hợp mà toán tử nguyên tử diễn đạt không nổi.</p>

<h3><code>upsert</code>, và cuộc đua nó vẫn còn</h3>
<pre><code>await prisma.setting.upsert({
  where:  { key: 'site_name' },
  update: { value: 'CuongThai' },
  create: { key: 'site_name', value: 'CuongThai' },
});</code></pre>
<div class="out">prisma:query INSERT INTO "settings" ("key","value") VALUES ($1,$2)
             ON CONFLICT ("key") DO UPDATE SET "value" = $3
             RETURNING "id","key","value"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một câu lệnh, khi có thể</span><span class="v">Trên PostgreSQL, MySQL và SQLite, với một trường unique đơn trong <code>where</code> và không có ghi lồng nhau, Prisma phát ra một câu upsert gốc. Cái đó nguyên tử và không có tranh chấp.</span></div>
  <div class="kv"><span class="k">Hai câu lệnh, khi không thể</span><span class="v">Ghi lồng nhau, một khoá unique phức hợp, hoặc một bộ lọc không tầm thường khiến Prisma lùi về <code>SELECT</code> rồi <code>INSERT</code> hoặc <code>UPDATE</code> bên trong một giao dịch. Bản đó <strong>có thể</strong> tranh chấp: hai lệnh upsert song song cho một hàng chưa có đều thử chèn, và một cái nhận <code>P2002</code>.</span></div>
  <div class="kv"><span class="k">Làm sao biết bạn nhận cái nào</span><span class="v">Đọc log truy vấn. <code>ON CONFLICT</code> nghĩa là đường nguyên tử nhanh; một câu <code>SELECT</code> theo sau bởi một câu <code>INSERT</code> nghĩa là đường lùi. Đây là phép kiểm hai giây và nó cho bạn biết có cần thử lại hay không.</span></div>
  <div class="kv"><span class="k">Lần thử lại, khi bạn cần</span><span class="v">Bắt <code>P2002</code> rồi gọi <code>upsert</code> lần nữa — lần thứ hai tìm thấy hàng và đi vào nhánh update. Một lần thử lại là đủ; một vòng lặp là dấu hiệu khoá unique đang sai.</span></div>
</div>
<pre><code><span class="tok-comment">// Bộ đếm idempotent, đúng dưới tranh chấp: upsert kết hợp toán tử nguyên tử</span>
await prisma.pageView.upsert({
  where:  { path_day: { path: '/courses', day: homNay } },
  update: { count: { increment: 1 } },
  create: { path: '/courses', day: homNay, count: 1 },
});</code></pre>
<div class="out">INSERT INTO "page_views" ("path","day","count") VALUES ($1,$2,$3)
ON CONFLICT ("path","day") DO UPDATE SET "count" = "page_views"."count" + $4
RETURNING ...</div>
<p>Một câu lệnh duy nhất ấy là một bản cài đặt hoàn chỉnh cho bộ đếm theo ngày: không đọc, không rẽ nhánh trong mã ứng dụng, không tranh chấp. Nó đáng thuộc lòng như một hình mẫu.</p>

<h3>Cập nhật lồng nhau: sửa các con</h3>
<pre><code>await prisma.user.update({
  where: { id: 1 },
  data: {
    fullName: 'Nguyen Van An',

    <span class="tok-comment">// một–một: tạo nếu chưa có, sửa nếu đã có</span>
    profile: { upsert: { create: { bio: 'Lan dau' }, update: { bio: 'Cap nhat' } } },

    <span class="tok-comment">// một–nhiều: kết hợp kiểu nào cũng được, tất cả trong cùng một giao dịch</span>
    posts: {
      updateMany: { where: { published: false }, data: { published: true } },
      update:     { where: { id: 3 }, data: { title: 'Sua rieng bai nay' } },
      create:     [{ title: 'Bai moi' }],
      deleteMany: { views: 0 },
    },

    <span class="tok-comment">// nhiều–nhiều: thay thế cả tập</span>
    roles: { set: [{ name: 'ADMIN' }, { name: 'USER' }] },
  },
});</code></pre>
<div class="out">prisma:query BEGIN
prisma:query UPDATE "users" SET "full_name"=$1 WHERE "id"=$2
prisma:query SELECT "id" FROM "profiles" WHERE "user_id"=$1
prisma:query UPDATE "profiles" SET "bio"=$1 WHERE "user_id"=$2
prisma:query UPDATE "posts" SET "published"=$1 WHERE ("author_id"=$2 AND "published"=$3)
prisma:query UPDATE "posts" SET "title"=$1 WHERE ("id"=$2 AND "author_id"=$3)
prisma:query INSERT INTO "posts" ("title","author_id") VALUES ($1,$2)
prisma:query DELETE FROM "posts" WHERE ("author_id"=$1 AND "views"=$2)
prisma:query DELETE FROM "_RoleToUser" WHERE "B"=$1
prisma:query INSERT INTO "_RoleToUser" ("A","B") VALUES ($1,$2),($3,$4)
prisma:query COMMIT</div>
<div class="callout">
<p><strong>Chín câu lệnh, một giao dịch, một lời gọi.</strong> Để ý lệnh <code>update</code> lồng bên trong đã tự động được thêm <code>AND "author_id" = $3</code> — Prisma không cho một lệnh update lồng thoát ra khỏi cha của nó, nên bạn không thể vô tình sửa bài viết của người khác qua đường này. Phạm vi hoá đó là một tính chất an toàn thật, và là lý do chính để ưu tiên một lệnh update lồng thay vì một lệnh update ở mức trên khi cha vốn đã được xác định.</p>
</div>

<h3>Cập nhật có điều kiện, không cần đọc trước</h3>
<pre><code><span class="tok-comment">// "Đăng bài, nhưng chỉ khi nó vẫn còn là bản nháp" — không đọc, không tranh chấp</span>
const r = await prisma.post.updateMany({
  where: { id: 1, published: false },
  data:  { published: true, publishedAt: new Date() },
});
if (r.count === 0) throw new Error('Bai da duoc dang truoc do');

<span class="tok-comment">// "Trừ một khỏi tồn kho, nhưng không bao giờ xuống dưới không"</span>
const s = await prisma.product.updateMany({
  where: { id: 1, stock: { gt: 0 } },
  data:  { stock: { decrement: 1 } },
});
if (s.count === 0) throw new Error('Het hang');</code></pre>
<div class="out">UPDATE "posts" SET "published"=$1,"published_at"=$2,"updated_at"=$3 WHERE ("id"=$4 AND "published"=$5)
UPDATE "products" SET "stock" = "products"."stock" - $1 WHERE ("id"=$2 AND "products"."stock" &gt; $3)</div>
<div class="callout ok">
<p><strong>Đây là mẫu hữu ích nhất trong cả bài.</strong> Đặt tiền điều kiện vào <code>where</code> khiến phép kiểm và phép ghi thành một câu lệnh duy nhất, nên không gì thay đổi được ở giữa hai bước. <code>count === 0</code> khi đó nghĩa là "tiền điều kiện sai" — một tín hiệu rõ ràng, và là cách chuẩn để cài đặt các chuyển trạng thái có canh gác mà không cần giao dịch. Chương 7 chỉ phải làm gì khi tiền điều kiện trải qua hai bảng và mẹo này hết đủ.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#update" target="_blank" rel="noopener"><span class="lc-ico">✏️</span><span class="lc-body"><span class="lc-title">CRUD — thao tác cập nhật</span><span class="lc-sub">prisma.io/docs · Cả bốn phương thức, kiểu trả về, và cái nào ném lỗi khi nào</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-a-single-record-with-atomic-number-operations" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">Thao tác số nguyên tử</span><span class="lc-sub">prisma.io/docs · Danh sách toán tử và câu SQL mỗi cái sinh ra</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — ON CONFLICT</span><span class="lc-sub">postgresql.org · Upsert biên dịch thành gì, và nó bảo đảm cũng như không bảo đảm điều gì</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương giao dịch</span><span class="lc-sub">Khoá hàng và MVCC — vì sao <code>SET x = x + 1</code> an toàn còn đọc-rồi-ghi thì không</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Dựng lại cuộc đua mất-cập-nhật với 100 client song song, rồi vá nó bằng ba cách</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Deleting, and soft delete done properly|||4.5 — Xoá, và xoá mềm làm cho đúng',
      slug: 'pr-4-5-xoa-mem',
      type: 'LESSON',
      description: 'delete với deleteMany, xoá dây chuyền tốn gì thật, vì sao gần như mọi ứng dụng thật đều cần xoá mềm, và ba cách cài nó — tay, client extension, partial index — kèm cái bẫy làm hỏng ràng buộc unique.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Deleting, and soft delete done properly</h2>
<p class="lead">Deleting is the only operation with no undo. That single fact is why almost every production application ends up implementing soft delete — and why doing it badly, which is easy, produces a system where "deleted" rows keep showing up in exactly the places you forgot to filter.</p>

<h3>The two methods</h3>
<pre><code><span class="tok-comment">// delete — one row, by unique field. Returns it. Throws P2025 if absent.</span>
const bai = await prisma.post.delete({ where: { id: 1 } });

<span class="tok-comment">// deleteMany — any filter. Returns { count }. Never throws for zero matches.</span>
const r = await prisma.post.deleteMany({ where: { authorId: 3, published: false } });
console.log(r);

<span class="tok-comment">// Empty filter = every row in the table. There is no confirmation prompt.</span>
await prisma.post.deleteMany({});</code></pre>
<div class="out">prisma:query DELETE FROM "public"."posts" WHERE ("public"."posts"."id" = $1 AND 1=1) RETURNING ...
prisma:query DELETE FROM "public"."posts" WHERE ("public"."posts"."author_id" = $1 AND "public"."posts"."published" = $2)
{ count: 12 }
prisma:query DELETE FROM "public"."posts"</div>
<div class="pitfall">
<p><strong>Trap — <code>deleteMany({})</code> and <code>deleteMany({ where: undefined })</code> are the same thing.</strong> Both delete every row. And because <code>where</code> is optional, a filter built from request parameters that all came back <code>undefined</code> produces an empty object — so a "delete my drafts" endpoint with a bug deletes the whole table. Guard it: build the filter, check it is non-empty, and refuse if it is not. This is not paranoia; it is the single most expensive Prisma mistake there is.</p>
</div>

<h3>What a cascade actually costs</h3>
<pre><code><span class="tok-comment">-- Before deleting, ask what goes with it</span>
SELECT
  (SELECT count(*) FROM posts     WHERE author_id = 1) AS posts,
  (SELECT count(*) FROM comments  WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1)) AS comments,
  (SELECT count(*) FROM reactions WHERE comment_id IN
     (SELECT id FROM comments WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1))) AS reactions;</code></pre>
<div class="out"> posts | comments | reactions
-------+----------+-----------
   214 |     3891 |     41207

-- and the delete itself
DELETE 1
Time: 4128.911 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Four seconds of locks</span><span class="v">The cascade runs inside one transaction, holding locks on four tables. Anything else touching those rows waits. On a busy table that is a visible latency spike for every other user.</span></div>
  <div class="kv"><span class="k">No undo</span><span class="v">Not from the application, not from Prisma, not from PostgreSQL. Only from a backup, which means a restore, which means downtime — for one user's mistaken click.</span></div>
  <div class="kv"><span class="k">Audit trails die too</span><span class="v">If your audit log has a foreign key to the row it describes, cascading removes the evidence along with the crime. Audit tables should reference by id without a constraint, or use <code>SetNull</code>.</span></div>
  <div class="kv"><span class="k">And it is often not what the user meant</span><span class="v">"Delete my account" usually means "stop showing my data", not "erase 45,000 rows so nothing can ever be restored". Except under GDPR erasure requests, where it means exactly that — which is why you need both mechanisms.</span></div>
</div>

<h3>Soft delete: the column and the discipline</h3>
<pre><code>model Post {
  id        Int       @id @default(autoincrement())
  title     String
  authorId  Int       @map("author_id")

  deletedAt DateTime? @map("deleted_at") @db.Timestamptz(3)

  <span class="tok-comment">// The index that makes "not deleted" cheap: partial, so it only holds live rows</span>
  @@index([authorId])
  @@map("posts")
}</code></pre>
<pre><code><span class="tok-comment">-- Prisma cannot declare a partial index; add it by hand in the migration</span>
CREATE INDEX "posts_author_active_idx" ON "posts"("author_id") WHERE "deleted_at" IS NULL;</code></pre>
<pre><code><span class="tok-comment">// Deleting is now an update</span>
await prisma.post.update({ where: { id: 1 }, data: { deletedAt: new Date() } });

<span class="tok-comment">// And every read must remember to filter. This is the whole problem.</span>
await prisma.post.findMany({ where: { authorId: 1, deletedAt: null } });</code></pre>
<div class="callout warn">
<p><strong>"Every read must remember" is not a plan.</strong> It works for a week. Then someone adds an endpoint, forgets the filter, and deleted posts appear in search results — or worse, in an admin export sent to a customer. Manual filtering fails for the same reason manual null checks fail: it depends on nobody ever being in a hurry. The next section makes it structural.</p>
</div>

<h3>Client extensions: filtering that cannot be forgotten</h3>
<pre><code>import { PrismaClient } from '@prisma/client';

const base = new PrismaClient();

export const prisma = base.$extends({
  name: 'xoaMem',
  query: {
    post: {
      <span class="tok-comment">// every read on Post gains the filter, automatically</span>
      async $allOperations({ operation, args, query }) {
        if (['findFirst', 'findMany', 'findUnique', 'count', 'aggregate'].includes(operation)) {
          args.where = { ...args.where, deletedAt: null };
        }
        <span class="tok-comment">// and delete becomes an update</span>
        if (operation === 'delete') {
          return (query as any)({ ...args, data: { deletedAt: new Date() } });
        }
        return query(args);
      },
    },
  },
});</code></pre>
<pre><code><span class="tok-comment">// Now the filter is impossible to forget</span>
await prisma.post.findMany({ where: { authorId: 1 } });</code></pre>
<div class="out">prisma:query SELECT ... FROM "posts" WHERE ("author_id" = $1 AND "deleted_at" IS NULL) OFFSET $2</div>
<div class="kv-grid">
  <div class="kv"><span class="k">It is one place</span><span class="v">A new endpoint written by someone who has never heard of the soft-delete convention gets the filter anyway. That is the entire value.</span></div>
  <div class="kv"><span class="k">Getting at deleted rows</span><span class="v">Keep the un-extended client for the admin path: <code>base.post.findMany({ where: { deletedAt: { not: null } } })</code>. Two clients, two intents, no ambiguity.</span></div>
  <div class="kv"><span class="k">Relations are the gap</span><span class="v">An extension on <code>post</code> does not filter <code>user.posts</code> inside an <code>include</code>. Nested reads need the filter written into the include, or an extension per relation. Verify with the query log rather than assuming.</span></div>
  <div class="kv"><span class="k">Raw SQL bypasses it entirely</span><span class="v"><code>$queryRaw</code> goes straight to the database. Every hand-written query needs its own <code>WHERE deleted_at IS NULL</code>, and Chapter 10 says so again.</span></div>
</div>

<h3>The trap: unique constraints and soft delete</h3>
<pre><code>model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  deletedAt DateTime? @map("deleted_at")
}</code></pre>
<pre><code><span class="tok-comment">// User soft-deletes their account, then wants to sign up again</span>
await prisma.user.update({ where: { email: 'an@x.com' }, data: { deletedAt: new Date() } });
await prisma.user.create({ data: { email: 'an@x.com' } });</code></pre>
<div class="out">PrismaClientKnownRequestError:
Unique constraint failed on the fields: (&#96;email&#96;)
  code: 'P2002'</div>
<p>The soft-deleted row still occupies the unique key. To the user it looks like their deleted account is blocking them from an account they no longer have. Three fixes, in order of preference:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Partial unique index</span><span class="lz-t">The clean answer</span><span class="lz-d">Drop the <code>@unique</code> and write <code>CREATE UNIQUE INDEX … WHERE deleted_at IS NULL</code> by hand. Uniqueness now applies only to live rows. PostgreSQL only, and Prisma cannot express it — but it is exactly correct.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Composite unique</span><span class="lz-t">Portable, and awkward</span><span class="lz-d"><code>@@unique([email, deletedAt])</code>. Works because <code>NULL</code> values do not collide in SQL — but two rows deleted at the same millisecond would, and it is subtle enough that reviewers miss it.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Rename on delete</span><span class="lz-t">Crude, and effective</span><span class="lz-d">Set <code>email = 'an@x.com.deleted.1712...'</code> when soft-deleting. Ugly in the database, free of constraint problems, and it is what several large products actually do.</span></div>
  <div class="lz-step"><span class="lz-k">Whichever you pick</span><span class="lz-t">Write it down</span><span class="lz-d">This is the single most surprising consequence of soft delete. A comment in the schema next to <code>deletedAt</code> saves the next person an hour.</span></div>
</div>
<pre><code><span class="tok-comment">-- Option 1, in a hand-written migration</span>
DROP INDEX "users_email_key";
CREATE UNIQUE INDEX "users_email_active_key" ON "users"("email") WHERE "deleted_at" IS NULL;</code></pre>

<h3>Real deletion, on purpose</h3>
<pre><code><span class="tok-comment">// A scheduled job: rows soft-deleted more than 30 days ago are erased for real.</span>
<span class="tok-comment">// Batched, so it never holds a lock for minutes.</span>
const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

for (;;) {
  const batch = await base.post.findMany({
    where:  { deletedAt: { lt: cutoff } },
    select: { id: true },
    take:   1000,
  });
  if (batch.length === 0) break;

  const r = await base.post.deleteMany({ where: { id: { in: batch.map((b) =&gt; b.id) } } });
  console.log('da xoa that:', r.count);
}</code></pre>
<div class="out">da xoa that: 1000
da xoa that: 1000
da xoa that: 412</div>
<div class="callout ok">
<p><strong>Batching is the part that matters.</strong> A single <code>deleteMany</code> over 200,000 rows is one enormous transaction: it holds locks for minutes, bloats the write-ahead log, and blocks autovacuum. A thousand at a time finishes just as fast in wall-clock terms and leaves the database usable throughout. The same shape applies to any bulk maintenance — backfills, re-indexing passes, archive moves.</p>
</div>

<div class="note-ct">
<p><strong>From the CuongThai codebase — soft delete that the user can undo.</strong> Message threads in this application use a <em>per-viewer</em> <code>deletedAt</code>: deleting a conversation hides it for you and leaves it visible for the other participant. In July 2026 that behaviour was reported as "chats are disappearing", because there was no way to see or recover a hidden thread. The fix was not to remove the feature but to expose it: <code>restoreThreadForViewer</code>, a <code>GET /threads?view=deleted</code> listing, and a <code>POST /threads/:id/restore</code> endpoint behind an "Đã xoá" tab.</p>
<p>That is the general lesson about soft delete. Rows that are hidden but recoverable are only a feature if the user can reach them. Hidden with no way back is indistinguishable from data loss — and it will be reported as data loss.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#delete" target="_blank" rel="noopener"><span class="lc-ico">🗑️</span><span class="lc-body"><span class="lc-title">CRUD — delete operations</span><span class="lc-sub">prisma.io/docs · <code>delete</code>, <code>deleteMany</code> and the cascade behaviour they trigger</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/query" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Client extensions — query component</span><span class="lc-sub">prisma.io/docs · <code>$allOperations</code> and per-model hooks, the mechanism behind the filter above</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/middleware/soft-delete-middleware" target="_blank" rel="noopener"><span class="lc-ico">👻</span><span class="lc-body"><span class="lc-title">Soft delete — the official guide</span><span class="lc-sub">prisma.io/docs · Prisma's own write-up, including the relation gaps it does not close</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/indexes-partial.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — partial indexes</span><span class="lc-sub">postgresql.org · The unique-index-on-live-rows fix, from the source</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Build soft delete with an extension, then find the three reads it fails to filter</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Xoá, và xoá mềm làm cho đúng</h2>
<p class="lead">Xoá là thao tác duy nhất không hoàn tác được. Chỉ riêng sự thật ấy là lý do gần như mọi ứng dụng production rốt cuộc đều cài xoá mềm — và cũng là lý do làm nó dở, vốn rất dễ, đẻ ra một hệ thống nơi những hàng "đã xoá" cứ hiện ra đúng ở những chỗ bạn quên lọc.</p>

<h3>Hai phương thức</h3>
<pre><code><span class="tok-comment">// delete — một hàng, theo trường unique. Trả về nó. Ném P2025 nếu không có.</span>
const bai = await prisma.post.delete({ where: { id: 1 } });

<span class="tok-comment">// deleteMany — bộ lọc bất kỳ. Trả về { count }. Không bao giờ ném lỗi khi khớp 0 hàng.</span>
const r = await prisma.post.deleteMany({ where: { authorId: 3, published: false } });
console.log(r);

<span class="tok-comment">// Bộ lọc rỗng = mọi hàng trong bảng. Không có lời hỏi xác nhận nào cả.</span>
await prisma.post.deleteMany({});</code></pre>
<div class="out">prisma:query DELETE FROM "public"."posts" WHERE ("public"."posts"."id" = $1 AND 1=1) RETURNING ...
prisma:query DELETE FROM "public"."posts" WHERE ("public"."posts"."author_id" = $1 AND "public"."posts"."published" = $2)
{ count: 12 }
prisma:query DELETE FROM "public"."posts"</div>
<div class="pitfall">
<p><strong>Bẫy — <code>deleteMany({})</code> và <code>deleteMany({ where: undefined })</code> là cùng một thứ.</strong> Cả hai xoá mọi hàng. Và vì <code>where</code> là tuỳ chọn nên một bộ lọc dựng từ tham số yêu cầu mà tất cả đều trả về <code>undefined</code> sẽ cho ra một đối tượng rỗng — thế là một endpoint "xoá bản nháp của tôi" có con bọ sẽ xoá sạch cả bảng. Hãy canh gác: dựng bộ lọc, kiểm nó khác rỗng, và từ chối nếu không. Đây không phải hoang tưởng; đây là sai lầm Prisma đắt nhất từng có.</p>
</div>

<h3>Một lần xoá dây chuyền thật sự tốn gì</h3>
<pre><code><span class="tok-comment">-- Trước khi xoá, hỏi xem cái gì đi theo nó</span>
SELECT
  (SELECT count(*) FROM posts     WHERE author_id = 1) AS posts,
  (SELECT count(*) FROM comments  WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1)) AS comments,
  (SELECT count(*) FROM reactions WHERE comment_id IN
     (SELECT id FROM comments WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1))) AS reactions;</code></pre>
<div class="out"> posts | comments | reactions
-------+----------+-----------
   214 |     3891 |     41207

-- và bản thân lệnh xoá
DELETE 1
Time: 4128.911 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Bốn giây giữ khoá</span><span class="v">Dây chuyền chạy trong một giao dịch, giữ khoá trên bốn bảng. Mọi thứ khác chạm tới những hàng ấy đều phải đợi. Trên một bảng bận thì đó là một cú vọt độ trễ mà mọi người dùng khác đều thấy.</span></div>
  <div class="kv"><span class="k">Không hoàn tác</span><span class="v">Không từ ứng dụng, không từ Prisma, không từ PostgreSQL. Chỉ từ một bản sao lưu, tức là phải phục hồi, tức là có thời gian chết — chỉ vì một cú bấm nhầm của một người dùng.</span></div>
  <div class="kv"><span class="k">Dấu vết kiểm toán cũng chết theo</span><span class="v">Nếu nhật ký kiểm toán của bạn có khoá ngoại trỏ tới hàng mà nó mô tả thì dây chuyền gỡ luôn bằng chứng cùng với hiện trường. Bảng kiểm toán nên tham chiếu theo id mà không có ràng buộc, hoặc dùng <code>SetNull</code>.</span></div>
  <div class="kv"><span class="k">Và thường thì đó không phải ý người dùng</span><span class="v">"Xoá tài khoản của tôi" thường nghĩa là "đừng hiển thị dữ liệu của tôi nữa", chứ không phải "xoá 45.000 hàng để không bao giờ phục hồi được". Trừ khi là một yêu cầu xoá theo GDPR, nơi nó nghĩa đúng như thế — và vì vậy bạn cần cả hai cơ chế.</span></div>
</div>

<h3>Xoá mềm: cái cột và cái kỷ luật</h3>
<pre><code>model Post {
  id        Int       @id @default(autoincrement())
  title     String
  authorId  Int       @map("author_id")

  deletedAt DateTime? @map("deleted_at") @db.Timestamptz(3)

  <span class="tok-comment">// Chỉ mục làm cho "chưa xoá" thành rẻ: partial, nên nó chỉ chứa hàng còn sống</span>
  @@index([authorId])
  @@map("posts")
}</code></pre>
<pre><code><span class="tok-comment">-- Prisma không khai được partial index; thêm bằng tay trong migration</span>
CREATE INDEX "posts_author_active_idx" ON "posts"("author_id") WHERE "deleted_at" IS NULL;</code></pre>
<pre><code><span class="tok-comment">// Xoá giờ là một lệnh update</span>
await prisma.post.update({ where: { id: 1 }, data: { deletedAt: new Date() } });

<span class="tok-comment">// Và mọi lần đọc đều phải nhớ lọc. Đó chính là toàn bộ vấn đề.</span>
await prisma.post.findMany({ where: { authorId: 1, deletedAt: null } });</code></pre>
<div class="callout warn">
<p><strong>"Mọi lần đọc đều phải nhớ" không phải một kế hoạch.</strong> Nó chạy được một tuần. Rồi ai đó thêm một endpoint, quên bộ lọc, và các bài viết đã xoá hiện ra trong kết quả tìm kiếm — hoặc tệ hơn, trong một bản xuất dữ liệu gửi cho khách. Lọc thủ công thất bại vì cùng lý do mà kiểm null thủ công thất bại: nó dựa vào việc không ai từng vội. Phần tiếp theo biến nó thành chuyện cấu trúc.</p>
</div>

<h3>Client extension: lọc mà không thể quên</h3>
<pre><code>import { PrismaClient } from '@prisma/client';

const base = new PrismaClient();

export const prisma = base.$extends({
  name: 'xoaMem',
  query: {
    post: {
      <span class="tok-comment">// mọi lần đọc trên Post đều tự mọc thêm bộ lọc</span>
      async $allOperations({ operation, args, query }) {
        if (['findFirst', 'findMany', 'findUnique', 'count', 'aggregate'].includes(operation)) {
          args.where = { ...args.where, deletedAt: null };
        }
        <span class="tok-comment">// và delete trở thành một lệnh update</span>
        if (operation === 'delete') {
          return (query as any)({ ...args, data: { deletedAt: new Date() } });
        }
        return query(args);
      },
    },
  },
});</code></pre>
<pre><code><span class="tok-comment">// Giờ bộ lọc là thứ không thể quên</span>
await prisma.post.findMany({ where: { authorId: 1 } });</code></pre>
<div class="out">prisma:query SELECT ... FROM "posts" WHERE ("author_id" = $1 AND "deleted_at" IS NULL) OFFSET $2</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó nằm ở một chỗ</span><span class="v">Một endpoint mới do người chưa từng nghe tới quy ước xoá mềm viết ra vẫn có bộ lọc. Đó là toàn bộ giá trị của nó.</span></div>
  <div class="kv"><span class="k">Với tới các hàng đã xoá</span><span class="v">Giữ client chưa mở rộng cho đường quản trị: <code>base.post.findMany({ where: { deletedAt: { not: null } } })</code>. Hai client, hai ý định, không mập mờ.</span></div>
  <div class="kv"><span class="k">Quan hệ là chỗ hở</span><span class="v">Một extension trên <code>post</code> không lọc <code>user.posts</code> bên trong một <code>include</code>. Các lần đọc lồng nhau cần bộ lọc viết thẳng vào include, hoặc một extension cho mỗi quan hệ. Hãy kiểm bằng log truy vấn thay vì phỏng đoán.</span></div>
  <div class="kv"><span class="k">SQL thô đi vòng qua nó hoàn toàn</span><span class="v"><code>$queryRaw</code> đi thẳng tới cơ sở dữ liệu. Mọi câu truy vấn viết tay đều cần <code>WHERE deleted_at IS NULL</code> của riêng nó, và Chương 10 nhắc lại điều này.</span></div>
</div>

<h3>Cái bẫy: ràng buộc unique và xoá mềm</h3>
<pre><code>model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  deletedAt DateTime? @map("deleted_at")
}</code></pre>
<pre><code><span class="tok-comment">// Người dùng xoá mềm tài khoản, rồi muốn đăng ký lại</span>
await prisma.user.update({ where: { email: 'an@x.com' }, data: { deletedAt: new Date() } });
await prisma.user.create({ data: { email: 'an@x.com' } });</code></pre>
<div class="out">PrismaClientKnownRequestError:
Unique constraint failed on the fields: (&#96;email&#96;)
  code: 'P2002'</div>
<p>Hàng đã xoá mềm vẫn chiếm cái khoá unique. Với người dùng thì trông như cái tài khoản đã xoá của họ đang chặn họ lập một tài khoản mà họ không còn nữa. Ba cách vá, xếp theo mức ưu tiên:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Partial unique index</span><span class="lz-t">Câu trả lời sạch sẽ</span><span class="lz-d">Bỏ <code>@unique</code> và viết <code>CREATE UNIQUE INDEX … WHERE deleted_at IS NULL</code> bằng tay. Tính duy nhất giờ chỉ áp cho các hàng còn sống. Chỉ PostgreSQL, và Prisma không diễn đạt được — nhưng nó đúng chính xác.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Unique phức hợp</span><span class="lz-t">Di động, và vụng</span><span class="lz-d"><code>@@unique([email, deletedAt])</code>. Chạy được vì giá trị <code>NULL</code> không đụng nhau trong SQL — nhưng hai hàng xoá đúng cùng một mili giây thì đụng, và nó tinh vi đủ để người review bỏ sót.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Đổi tên khi xoá</span><span class="lz-t">Thô, và hiệu quả</span><span class="lz-d">Đặt <code>email = 'an@x.com.deleted.1712...'</code> lúc xoá mềm. Xấu dưới cơ sở dữ liệu, sạch mọi rắc rối ràng buộc, và đó là thứ vài sản phẩm lớn thật sự đang làm.</span></div>
  <div class="lz-step"><span class="lz-k">Chọn cái nào cũng được</span><span class="lz-t">Nhớ ghi lại</span><span class="lz-d">Đây là hệ quả bất ngờ nhất của xoá mềm. Một dòng chú thích trong lược đồ ngay cạnh <code>deletedAt</code> tiết kiệm cho người sau một giờ đồng hồ.</span></div>
</div>
<pre><code><span class="tok-comment">-- Cách 1, trong một migration viết tay</span>
DROP INDEX "users_email_key";
CREATE UNIQUE INDEX "users_email_active_key" ON "users"("email") WHERE "deleted_at" IS NULL;</code></pre>

<h3>Xoá thật, một cách có chủ ý</h3>
<pre><code><span class="tok-comment">// Một tác vụ theo lịch: hàng xoá mềm quá 30 ngày thì xoá thật.</span>
<span class="tok-comment">// Chia lô, nên nó không bao giờ giữ khoá suốt nhiều phút.</span>
const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

for (;;) {
  const batch = await base.post.findMany({
    where:  { deletedAt: { lt: cutoff } },
    select: { id: true },
    take:   1000,
  });
  if (batch.length === 0) break;

  const r = await base.post.deleteMany({ where: { id: { in: batch.map((b) =&gt; b.id) } } });
  console.log('da xoa that:', r.count);
}</code></pre>
<div class="out">da xoa that: 1000
da xoa that: 1000
da xoa that: 412</div>
<div class="callout ok">
<p><strong>Chia lô mới là phần quan trọng.</strong> Một câu <code>deleteMany</code> duy nhất trên 200.000 hàng là một giao dịch khổng lồ: nó giữ khoá suốt nhiều phút, làm phình nhật ký ghi-trước, và chặn autovacuum. Mỗi lần một nghìn thì tổng thời gian gần như y hệt mà cơ sở dữ liệu vẫn dùng được suốt quá trình. Hình dạng ấy áp dụng cho mọi việc bảo trì hàng loạt — đổ dữ liệu, dựng lại chỉ mục, chuyển vào kho lưu trữ.</p>
</div>

<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai — xoá mềm mà người dùng hoàn tác được.</strong> Các cuộc trò chuyện trong ứng dụng này dùng một <code>deletedAt</code> <em>riêng cho từng người xem</em>: xoá một cuộc trò chuyện là giấu nó với bạn và để nó hiện với người kia. Tháng 07/2026 hành vi đó bị báo là "chat tự biến mất", vì không có cách nào để nhìn thấy hay lấy lại một cuộc trò chuyện đã giấu. Cách vá không phải là bỏ tính năng mà là phơi nó ra: <code>restoreThreadForViewer</code>, một danh sách <code>GET /threads?view=deleted</code>, và một endpoint <code>POST /threads/:id/restore</code> nằm sau tab "Đã xoá".</p>
<p>Đó là bài học tổng quát về xoá mềm. Những hàng bị giấu nhưng lấy lại được chỉ là một tính năng nếu người dùng với tới được chúng. Giấu mà không có đường quay lại thì không phân biệt nổi với mất dữ liệu — và nó sẽ được báo cáo đúng là mất dữ liệu.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#delete" target="_blank" rel="noopener"><span class="lc-ico">🗑️</span><span class="lc-body"><span class="lc-title">CRUD — thao tác xoá</span><span class="lc-sub">prisma.io/docs · <code>delete</code>, <code>deleteMany</code> và hành vi dây chuyền chúng kích hoạt</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/query" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Client extensions — thành phần query</span><span class="lc-sub">prisma.io/docs · <code>$allOperations</code> và móc theo từng model, tức cơ chế đứng sau bộ lọc ở trên</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/middleware/soft-delete-middleware" target="_blank" rel="noopener"><span class="lc-ico">👻</span><span class="lc-body"><span class="lc-title">Soft delete — hướng dẫn chính thức</span><span class="lc-sub">prisma.io/docs · Bài viết của chính Prisma, kể cả những chỗ hở về quan hệ mà nó không lấp</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/indexes-partial.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — partial index</span><span class="lc-sub">postgresql.org · Cách vá "unique chỉ trên hàng còn sống", lấy từ nguồn gốc</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Dựng xoá mềm bằng một extension, rồi tìm ba lần đọc mà nó không lọc được</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Trắc nghiệm Chương 4',
      slug: 'pr-4-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu: findUnique so với findFirst, findFirst không orderBy, select với include, omit toàn cục, createMany không làm được gì, increment so với đọc-rồi-ghi, updateMany trả count 0, và bẫy unique của xoá mềm.',
      content: `
<div class="ml-en">
<p>Eight questions on the client API. The two about concurrency are the ones that separate code which works in development from code that works under load.</p>
</div>
<div class="ml-vi">
<p>Tám câu về API của client. Hai câu về tranh chấp là hai câu phân biệt đoạn mã chạy được lúc phát triển với đoạn mã chạy được khi có tải.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why will `findUnique({ where: { title: "x" } })` not compile?|||Vì sao `findUnique({ where: { title: "x" } })` không biên dịch được?',
            options: [
              'The where type is generated from the model unique constraints only — it is a compile-time guarantee that at most one row comes back|||Kiểu của where chỉ được sinh từ các ràng buộc unique của model — đó là một bảo đảm lúc biên dịch rằng nhiều nhất một hàng quay về',
              'findUnique only accepts the primary key; other unique fields need findFirst|||findUnique chỉ nhận khoá chính; các trường unique khác phải dùng findFirst',
              'String fields cannot appear in a where clause without a mode argument|||Trường kiểu chuỗi không xuất hiện được trong where nếu không có tham số mode',
              'It does compile — it just returns an arbitrary matching row at runtime|||Nó biên dịch được — chỉ là lúc chạy nó trả về một hàng khớp bất kỳ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is wrong with `findFirst({ where: { published: true } })` with no orderBy?|||`findFirst({ where: { published: true } })` mà không có orderBy thì sai ở đâu?',
            options: [
              'Without ORDER BY the row returned is undefined — it looks stable in development and changes once rows are updated or the plan switches to an index scan|||Không có ORDER BY thì hàng trả về là không xác định — nó trông ổn định lúc phát triển rồi đổi ngay khi có hàng bị cập nhật hoặc kế hoạch chuyển sang quét chỉ mục',
              'Nothing — Prisma sorts by primary key ascending when orderBy is omitted|||Không sai gì — Prisma tự sắp theo khoá chính tăng dần khi bỏ orderBy',
              'It throws P2025 because findFirst requires a deterministic result|||Nó ném P2025 vì findFirst đòi một kết quả tất định',
              'It fetches every matching row before discarding all but the first|||Nó kéo về mọi hàng khớp rồi mới bỏ đi tất cả trừ hàng đầu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between `select` and `include` at one query level?|||Ở cùng một tầng truy vấn, `select` và `include` khác nhau ở đâu?',
            options: [
              'include is additive (all scalars plus named relations); select is exclusive (only what you name). Using both at one level is a runtime error|||include là cộng thêm (mọi trường vô hướng cộng các quan hệ được nêu); select là loại trừ (chỉ những gì bạn nêu). Dùng cả hai ở một tầng là lỗi lúc chạy',
              'select works on scalars only and include works on relations only|||select chỉ dùng cho trường vô hướng còn include chỉ dùng cho quan hệ',
              'They are aliases; include is the older name kept for compatibility|||Hai cái là tên gọi khác của nhau; include là tên cũ giữ lại cho tương thích',
              'select runs a second query while include uses a JOIN|||select chạy một câu truy vấn thứ hai còn include thì dùng JOIN',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does global `omit: { user: { password: true } }` on the client buy you?|||`omit: { user: { password: true } }` ở mức toàn cục trên client mang lại điều gì?',
            options: [
              'The column is excluded from every query by default, and new columns are still included — so a handler returning the whole user cannot leak the hash|||Cột đó bị loại khỏi mọi câu truy vấn theo mặc định, còn cột mới thì vẫn được lấy — nên một handler trả về nguyên user không làm rò rỉ hash được',
              'The column is dropped from the database on the next migration|||Cột đó bị xoá khỏi cơ sở dữ liệu ở lần migration kế tiếp',
              'The column is encrypted at rest by the query engine|||Cột đó được query engine mã hoá khi lưu',
              'Nothing at runtime — it only changes the generated TypeScript type|||Không gì lúc chạy — nó chỉ đổi kiểu TypeScript được sinh ra',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What can `createMany` NOT do that `create` can?|||`createMany` KHÔNG làm được gì mà `create` làm được?',
            options: [
              'Nested writes — no create, connect or connectOrCreate on relations, and it returns only a count, not the generated ids|||Ghi lồng nhau — không create, connect hay connectOrCreate trên quan hệ, và nó chỉ trả về số đếm chứ không trả id vừa sinh',
              'Insert more than 1,000 rows in a single call|||Chèn hơn 1.000 hàng trong một lời gọi',
              'Run inside a transaction|||Chạy bên trong một giao dịch',
              'Apply @default values from the schema|||Áp dụng giá trị @default từ lược đồ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '100 concurrent requests increment a counter starting at 0. Which ends at 100?|||100 yêu cầu song song cùng tăng một bộ đếm bắt đầu từ 0. Cái nào kết thúc ở 100?',
            options: [
              '`data: { views: { increment: 1 } }` — the arithmetic happens in PostgreSQL under a row lock, so no write is lost|||`data: { views: { increment: 1 } }` — phép tính xảy ra trong PostgreSQL dưới một khoá hàng, nên không lần ghi nào bị mất',
              '`const p = await findUnique(); await update({ data: { views: p.views + 1 } })` — reading first is more explicit|||`const p = await findUnique(); await update({ data: { views: p.views + 1 } })` — đọc trước thì tường minh hơn',
              'Both, because Prisma serialises writes to the same row automatically|||Cả hai, vì Prisma tự tuần tự hoá các lần ghi vào cùng một hàng',
              'Neither — concurrent counters require an explicit Serializable transaction|||Không cái nào — bộ đếm song song bắt buộc phải có giao dịch Serializable tường minh',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your `updateMany` returns `{ count: 0 }`. What does that mean?|||`updateMany` của bạn trả về `{ count: 0 }`. Điều đó nghĩa là gì?',
            options: [
              'No row matched the where clause — and it is not an error, so a handler that reports success must check the count itself|||Không hàng nào khớp mệnh đề where — và đó không phải lỗi, nên một handler báo thành công phải tự kiểm số đếm',
              'The update succeeded but the rows already had those values|||Bản cập nhật thành công nhưng các hàng vốn đã mang những giá trị đó',
              'The transaction was rolled back by the database|||Giao dịch đã bị cơ sở dữ liệu quay lui',
              'The rows were locked by another connection and the update was skipped|||Các hàng đang bị một kết nối khác khoá và bản cập nhật bị bỏ qua',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A soft-deleted user cannot sign up again with the same email. Why, and what is the cleanest fix?|||Một người dùng đã xoá mềm không đăng ký lại được bằng cùng email. Vì sao, và cách vá sạch nhất là gì?',
            options: [
              'The soft-deleted row still occupies the unique key; replace @unique with a partial unique index WHERE deleted_at IS NULL|||Hàng đã xoá mềm vẫn chiếm cái khoá unique; thay @unique bằng một partial unique index WHERE deleted_at IS NULL',
              'Prisma caches unique values; clearing the client cache resolves it|||Prisma lưu đệm các giá trị unique; xoá đệm của client là hết',
              'The client extension is filtering the create; exclude create from the extension|||Client extension đang lọc cả lệnh create; hãy loại create khỏi extension',
              'Soft delete is incompatible with unique columns and must not be used on them|||Xoá mềm không tương thích với cột unique và không được dùng trên chúng',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
