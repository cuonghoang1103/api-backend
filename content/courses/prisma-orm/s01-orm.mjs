/**
 * Prisma ORM — Chương 1: ORM là gì thật sự.
 * Lệch trở kháng · generate viết ra gì · truy vấn thành SQL ra sao · datasource và generator · ba luồng làm việc · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 1 — What an ORM actually is|||Chương 1 — ORM là gì thật sự',
  description: 'Bài toán ánh xạ giữa hàng và đối tượng và bốn chỗ nó khó thật, prisma generate viết ra chính xác cái gì, một lời gọi JavaScript biến thành SQL qua những tầng nào, toàn bộ khối datasource và generator, và ba luồng làm việc — db push, migrate, db pull — mỗi luồng đúng ở đâu.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — The impedance mismatch|||1.1 — Lệch trở kháng giữa hàng và đối tượng',
      slug: 'pr-1-1-lech-tro-khang',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn chỗ mà việc ánh xạ giữa bảng quan hệ và đối tượng thật sự khó — bản sắc, độ hạt, liên kết, kế thừa — cộng bài toán N+1; ORM giải được cái nào, và cái nào không ai giải được nên bạn phải tự chọn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The impedance mismatch</h2>
<p class="lead">"Object-relational impedance mismatch" is an intimidating name for a simple observation: tables and objects are different shapes, and no amount of tooling makes them the same shape. An ORM is not a solution to that problem — it is a set of <em>decisions</em> about it. Knowing which decisions Prisma made, and which it deliberately did not, is what separates using it well from fighting it.</p>

<h3>The four places it genuinely hurts</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Identity</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Rows are equal by value</span><span class="lz-nsub">Two rows with the same primary key <em>are</em> the same row. Two JavaScript objects with the same <code>id</code> are two objects — <code>a === b</code> is false, and mutating one does not touch the other.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Granularity</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Objects nest, columns do not</span><span class="lz-nsub">An <code>Address</code> inside a <code>User</code> is natural in code. In SQL it is either four more columns on <code>users</code> or a second table with a join. Both are lossy translations of the same idea.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Associations</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">References have a direction; foreign keys have a side</span><span class="lz-nsub"><code>user.posts</code> and <code>post.author</code> feel symmetric. In the database only <code>posts.author_id</code> exists. Many-to-many has no natural object form at all — it needs a table nobody wanted to model.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Inheritance</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">SQL has no subclasses</span><span class="lz-nsub">A <code>Video</code> and an <code>Article</code> that are both <code>Content</code> can be one wide table, one table per type, or a shared table plus specialised ones. Three answers, all with real costs, and the ORM cannot pick for you.</span></div></div>
  </div>
</div>

<h3>Identity, shown</h3>
<p>The first mismatch is the one people meet without realising:</p>
<pre><code>const a = await prisma.user.findUnique({ where: { id: 1 } });
const b = await prisma.user.findUnique({ where: { id: 1 } });

console.log(a === b);
console.log(a.email === b.email);

b.fullName = 'Doi ten';
console.log(a.fullName);</code></pre>
<div class="out">false
true
Nguyen Van An</div>
<p>Two queries, two plain objects, no shared identity. In Hibernate or Entity Framework this would be different: those ORMs keep an <strong>identity map</strong> — a per-session cache where the second lookup returns the very same object, and a <strong>unit of work</strong> that tracks your mutations and writes them at commit time.</p>
<div class="callout">
<p><strong>Prisma deliberately has neither.</strong> No identity map, no change tracking, no lazy loading, no dirty checking. A query returns plain data; a write happens when you call a write method and not a moment before. This is the single most important design decision in the whole tool, and every surprising thing about Prisma follows from it.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">What you lose</span><span class="v">You cannot mutate an object and expect it to save. You cannot rely on <code>user.posts</code> being populated unless you asked for it — it is <code>undefined</code>, not a proxy that fetches on access.</span></div>
  <div class="kv"><span class="k">What you gain</span><span class="v">There is no hidden query. Nothing happens between your statements. The SQL in the log is exactly the SQL your code asked for, which means a slow endpoint is always explicable — a claim Hibernate users cannot make.</span></div>
  <div class="kv"><span class="k">Why it matters for correctness</span><span class="v">Lazy loading is how N+1 gets written by accident. If <code>post.author</code> silently issued a query, a <code>for</code> loop over 200 posts would issue 200 queries and look like ordinary code. In Prisma that loop crashes on <code>undefined</code> — a much better failure.</span></div>
</div>

<h3>N+1, the mismatch's most expensive consequence</h3>
<p>Here it is written by hand, the way every developer writes it once:</p>
<pre><code><span class="tok-comment">// The naive version — 1 query for posts, then 1 per post for its author</span>
const posts = await prisma.post.findMany({ take: 200 });

for (const p of posts) {
  const author = await prisma.user.findUnique({ where: { id: p.authorId } });
  console.log(&#96;\${p.title} — \${author?.email}&#96;);
}</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" LIMIT $1 OFFSET $2
prisma:query SELECT ... FROM "public"."users" WHERE "public"."users"."id" = $1 LIMIT $2 OFFSET $3
prisma:query SELECT ... FROM "public"."users" WHERE "public"."users"."id" = $1 LIMIT $2 OFFSET $3
... (198 more)

real    0m4.812s</div>
<pre><code><span class="tok-comment">// The Prisma version — the relation is part of the request</span>
const posts = await prisma.post.findMany({ take: 200, include: { author: true } });

for (const p of posts) {
  console.log(&#96;\${p.title} — \${p.author.email}&#96;);
}</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" LIMIT $1 OFFSET $2
prisma:query SELECT ... FROM "public"."users" WHERE "public"."users"."id" IN ($1,$2,$3,...,$47)

real    0m0.061s</div>
<p>201 queries became 2, and 4.8 seconds became 61 milliseconds — a factor of seventy-nine. Look at the second statement: Prisma collected every distinct <code>authorId</code> and issued <strong>one</strong> <code>IN</code> query, then stitched the results together in memory. That is the classic dataloader batching pattern, built in.</p>
<div class="pitfall">
<p><strong>Trap — <code>include</code> does not always mean one query.</strong> Two levels of nesting means three statements, not one. A list of users with their posts <em>and</em> each post's comments produces a query per level. That is usually fine — three round trips is not two hundred — but it stops being fine when a level returns thousands of rows and you only needed a count. Prisma 5.7 added <code>relationLoadStrategy: "join"</code> to collapse them into a single SQL <code>LATERAL</code> join, and Chapter 9 measures when each strategy wins.</p>
</div>

<h3>Granularity: where do you put the address?</h3>
<pre><code><span class="tok-comment">// Option A — flatten it. Simple, queryable, and the fields multiply.</span>
model User {
  id            Int    @id @default(autoincrement())
  email         String @unique
  addressStreet String? @map("address_street")
  addressCity   String? @map("address_city")
  addressZip    String? @map("address_zip")
}

<span class="tok-comment">// Option B — a separate table. Normalised, and now every read is a join.</span>
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  address Address?
}
model Address {
  id     Int    @id @default(autoincrement())
  street String
  city   String
  userId Int    @unique @map("user_id")
  user   User   @relation(fields: [userId], references: [id])
}

<span class="tok-comment">// Option C — JSON. One column, no schema, no constraints, no index (without work).</span>
model User {
  id      Int    @id @default(autoincrement())
  email   String @unique
  address Json?
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">A — flatten</span><span class="v">Right when the nested thing has exactly one instance and you filter on its fields. <code>WHERE address_city = 'Da Nang'</code> uses an index. Wrong when the prefix list grows past about six fields.</span></div>
  <div class="kv"><span class="k">B — separate table</span><span class="v">Right when the thing has its own life: created separately, versioned, or shared. Costs a join on every read, which is cheap in PostgreSQL and expensive in your patience.</span></div>
  <div class="kv"><span class="k">C — JSON</span><span class="v">Right for genuinely schemaless data: a settings blob, a third-party webhook payload, a snapshot. Wrong for anything you filter or join on — and note that Prisma gives you no type safety inside a <code>Json</code> column at all. Chapter 2 covers making it typed with a generic parameter.</span></div>
</div>

<h3>Inheritance: the one Prisma refuses to solve</h3>
<p>SQL has no subclasses, and Prisma — unlike Hibernate or Django — offers no inheritance mapping strategy. This is not an omission; it is a position. You model it explicitly, and the CuongThai codebase itself uses the first pattern:</p>
<pre><code><span class="tok-comment">// Single-table inheritance: one table, a discriminator enum, nullable specifics</span>
enum ContentType {
  VLOG
  ARTICLE
  CODE_REVIEW
}

model Content {
  id        Int         @id @default(autoincrement())
  type      ContentType
  title     String
  <span class="tok-comment">// only meaningful when type = VLOG</span>
  videoUrl  String?     @map("video_url")
  duration  Int?
  <span class="tok-comment">// only meaningful when type = ARTICLE</span>
  body      String?

  @@map("contents")
}</code></pre>
<div class="callout warn">
<p><strong>The cost of that pattern, stated honestly.</strong> Every subtype-specific column must be nullable, so the database can no longer enforce "a VLOG must have a videoUrl" — that check moves into your application, where it can be forgotten. In exchange you get one table, no joins, and trivial "list everything" queries. The alternative (one table per type) enforces the constraint but makes a unified feed a <code>UNION</code> across three tables. Neither is wrong. The ORM cannot pick, so <em>you</em> pick, and you write down why.</p>
</div>

<h3>So what is an ORM actually doing?</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mapping names and types</span><span class="lz-d"><code>full_name TEXT NULL</code> ↔ <code>fullName: string | null</code>. Mechanical, tedious, and exactly the kind of thing a generator should do instead of a human.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Generating SQL from a description</span><span class="lz-d">You describe the result you want; it writes <code>SELECT</code>, <code>JOIN</code>, <code>WHERE</code>, <code>LIMIT</code>. The value is not that SQL is hard, but that composing it from optional filters in strings is where injection bugs live.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Stitching relations back into shapes</span><span class="lz-d">Rows come back flat. Turning 200 posts and 47 authors into 200 nested objects — without a loop of queries — is the batching you saw above.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Keeping the schema and the code in step</span><span class="lz-d">This is the part Prisma does best and most ORMs skip: one file is both the type source and the migration source, so they cannot drift.</span></div>
</div>
<p>And here is what it is <strong>not</strong> doing: it is not choosing your indexes, not deciding your inheritance strategy, not preventing you from loading a million rows, and not making your JOINs fast. Those remain database problems, solved with database knowledge.</p>

<div class="note-ct">
<p><strong>From the CuongThai codebase.</strong> The <code>ContentType</code> enum above is real, and so is the incident attached to it. On 2026-08-08 the value <code>CODE</code> was renamed to <code>CODE_REVIEW</code> to match what the frontend already called it. Every type check passed. The seed script still broke on production — because it carried its own hand-written copy of the union type, so it type-checked against itself rather than against the schema. Chapter 8 takes that failure apart line by line; it is the clearest demonstration there is of why "the types come from the schema" only holds if you actually let them.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://martinfowler.com/bliki/OrmHate.html" target="_blank" rel="noopener"><span class="lc-ico">📝</span><span class="lc-body"><span class="lc-title">Martin Fowler — OrmHate</span><span class="lc-sub">martinfowler.com · The four mismatches above are his framing; read it once and the whole category makes more sense</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Relation queries</span><span class="lc-sub">prisma.io/docs · How <code>include</code> and nested <code>select</code> actually resolve, including the fluent API</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#relation-load-strategies" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Relation load strategies</span><span class="lc-sub">prisma.io/docs · <code>join</code> versus <code>query</code>, the feature that decides whether <code>include</code> is one statement or several</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, JOIN chapter</span><span class="lc-sub">What Prisma is generating for you, written by hand — worth reading in parallel with this chapter</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Reproduce the N+1 above, then fix it three different ways and compare the query logs</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Lệch trở kháng giữa hàng và đối tượng</h2>
<p class="lead">"Lệch trở kháng đối tượng — quan hệ" là một cái tên doạ người cho một nhận xét đơn giản: bảng và đối tượng có hình dạng khác nhau, và không công cụ nào làm chúng thành cùng một hình. ORM không phải lời giải cho bài toán ấy — nó là một tập <em>quyết định</em> về bài toán ấy. Biết Prisma đã chọn gì, và cố ý không chọn gì, chính là chỗ phân biệt giữa dùng nó tốt và vật lộn với nó.</p>

<h3>Bốn chỗ nó đau thật</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Bản sắc</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Hàng bằng nhau theo giá trị</span><span class="lz-nsub">Hai hàng cùng khoá chính <em>chính là</em> một hàng. Hai đối tượng JavaScript cùng <code>id</code> là hai đối tượng — <code>a === b</code> là false, và sửa cái này không đụng gì tới cái kia.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Độ hạt</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đối tượng lồng nhau, cột thì không</span><span class="lz-nsub">Một <code>Address</code> nằm trong một <code>User</code> là tự nhiên trong mã. Trong SQL nó hoặc là bốn cột nữa trên <code>users</code>, hoặc là một bảng thứ hai kèm join. Cả hai đều là bản dịch mất mát của cùng một ý.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Liên kết</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tham chiếu có hướng; khoá ngoại có phía</span><span class="lz-nsub"><code>user.posts</code> và <code>post.author</code> nghe đối xứng. Dưới cơ sở dữ liệu chỉ tồn tại <code>posts.author_id</code>. Còn quan hệ nhiều-nhiều thì không có dạng đối tượng tự nhiên nào cả — nó cần một cái bảng không ai muốn mô hình hoá.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Kế thừa</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">SQL không có lớp con</span><span class="lz-nsub">Một <code>Video</code> và một <code>Article</code> cùng là <code>Content</code> có thể là một bảng rộng, mỗi loại một bảng, hoặc một bảng chung cộng các bảng chuyên biệt. Ba câu trả lời, cái nào cũng có giá thật, và ORM không chọn hộ bạn được.</span></div></div>
  </div>
</div>

<h3>Bản sắc, nhìn bằng mã</h3>
<p>Lệch đầu tiên là cái người ta gặp mà không nhận ra:</p>
<pre><code>const a = await prisma.user.findUnique({ where: { id: 1 } });
const b = await prisma.user.findUnique({ where: { id: 1 } });

console.log(a === b);
console.log(a.email === b.email);

b.fullName = 'Doi ten';
console.log(a.fullName);</code></pre>
<div class="out">false
true
Nguyen Van An</div>
<p>Hai câu truy vấn, hai đối tượng thuần, không chia sẻ bản sắc nào. Trong Hibernate hay Entity Framework thì khác: những ORM đó giữ một <strong>bản đồ bản sắc</strong> — một vùng đệm theo phiên nơi lần tra cứu thứ hai trả về đúng cùng một đối tượng — và một <strong>đơn vị công việc</strong> theo dõi các thay đổi của bạn rồi ghi xuống lúc commit.</p>
<div class="callout">
<p><strong>Prisma cố ý không có cả hai.</strong> Không bản đồ bản sắc, không theo dõi thay đổi, không lazy loading, không dò bẩn. Một câu truy vấn trả về dữ liệu thuần; một lần ghi xảy ra khi bạn gọi phương thức ghi, không sớm hơn một khoảnh khắc nào. Đây là quyết định thiết kế quan trọng nhất của cả công cụ, và mọi điều bất ngờ ở Prisma đều suy ra từ nó.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Bạn mất gì</span><span class="v">Bạn không thể sửa một đối tượng rồi mong nó tự lưu. Bạn không thể trông cậy <code>user.posts</code> có dữ liệu trừ khi bạn đã xin — nó là <code>undefined</code>, chứ không phải một proxy tự đi lấy khi bị chạm vào.</span></div>
  <div class="kv"><span class="k">Bạn được gì</span><span class="v">Không có câu truy vấn ẩn nào. Không có gì xảy ra giữa hai câu lệnh của bạn. SQL trong log đúng bằng SQL mã của bạn đã xin, nghĩa là một endpoint chậm thì luôn giải thích được — điều mà người dùng Hibernate không dám nói.</span></div>
  <div class="kv"><span class="k">Vì sao nó quan trọng cho tính đúng</span><span class="v">Lazy loading chính là cách N+1 được viết ra một cách vô tình. Nếu <code>post.author</code> âm thầm bắn một câu truy vấn thì một vòng <code>for</code> qua 200 bài viết sẽ bắn 200 câu và trông y như mã bình thường. Ở Prisma, vòng lặp ấy chết vì <code>undefined</code> — một kiểu hỏng tốt hơn nhiều.</span></div>
</div>

<h3>N+1, hậu quả đắt nhất của chuyện lệch này</h3>
<p>Đây là bản viết tay, đúng cách mà mọi lập trình viên viết ra một lần trong đời:</p>
<pre><code><span class="tok-comment">// Bản ngây thơ — 1 câu cho các bài viết, rồi mỗi bài 1 câu cho tác giả</span>
const posts = await prisma.post.findMany({ take: 200 });

for (const p of posts) {
  const author = await prisma.user.findUnique({ where: { id: p.authorId } });
  console.log(&#96;\${p.title} — \${author?.email}&#96;);
}</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" LIMIT $1 OFFSET $2
prisma:query SELECT ... FROM "public"."users" WHERE "public"."users"."id" = $1 LIMIT $2 OFFSET $3
prisma:query SELECT ... FROM "public"."users" WHERE "public"."users"."id" = $1 LIMIT $2 OFFSET $3
... (198 câu nữa)

real    0m4.812s</div>
<pre><code><span class="tok-comment">// Bản Prisma — quan hệ là một phần của yêu cầu</span>
const posts = await prisma.post.findMany({ take: 200, include: { author: true } });

for (const p of posts) {
  console.log(&#96;\${p.title} — \${p.author.email}&#96;);
}</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" LIMIT $1 OFFSET $2
prisma:query SELECT ... FROM "public"."users" WHERE "public"."users"."id" IN ($1,$2,$3,...,$47)

real    0m0.061s</div>
<p>201 câu truy vấn thành 2, và 4,8 giây thành 61 mili giây — hệ số bảy mươi chín. Nhìn câu lệnh thứ hai: Prisma gom mọi <code>authorId</code> khác nhau rồi bắn <strong>một</strong> câu <code>IN</code>, sau đó ghép kết quả lại trong bộ nhớ. Đó chính là mẫu gom lô kiểu dataloader kinh điển, dựng sẵn bên trong.</p>
<div class="pitfall">
<p><strong>Bẫy — <code>include</code> không phải lúc nào cũng nghĩa là một câu truy vấn.</strong> Lồng hai tầng nghĩa là ba câu lệnh, không phải một. Danh sách người dùng kèm bài viết <em>và</em> bình luận của từng bài sinh ra mỗi tầng một câu. Thường thì không sao — ba lượt đi về không phải hai trăm — nhưng nó hết ổn khi một tầng trả về hàng nghìn hàng mà bạn chỉ cần một con số đếm. Prisma 5.7 thêm <code>relationLoadStrategy: "join"</code> để gộp chúng thành một câu SQL dùng <code>LATERAL</code> join, và Chương 9 đo xem chiến lược nào thắng khi nào.</p>
</div>

<h3>Độ hạt: nhét cái địa chỉ vào đâu?</h3>
<pre><code><span class="tok-comment">// Cách A — trải phẳng. Đơn giản, truy vấn được, và số trường thì nở ra.</span>
model User {
  id            Int    @id @default(autoincrement())
  email         String @unique
  addressStreet String? @map("address_street")
  addressCity   String? @map("address_city")
  addressZip    String? @map("address_zip")
}

<span class="tok-comment">// Cách B — bảng riêng. Chuẩn hoá, và giờ mỗi lần đọc là một join.</span>
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  address Address?
}
model Address {
  id     Int    @id @default(autoincrement())
  street String
  city   String
  userId Int    @unique @map("user_id")
  user   User   @relation(fields: [userId], references: [id])
}

<span class="tok-comment">// Cách C — JSON. Một cột, không lược đồ, không ràng buộc, không chỉ mục (nếu không làm thêm).</span>
model User {
  id      Int    @id @default(autoincrement())
  email   String @unique
  address Json?
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">A — trải phẳng</span><span class="v">Đúng khi thứ lồng bên trong chỉ có đúng một thể hiện và bạn lọc theo các trường của nó. <code>WHERE address_city = 'Da Nang'</code> dùng được chỉ mục. Sai khi danh sách tiền tố vượt quá khoảng sáu trường.</span></div>
  <div class="kv"><span class="k">B — bảng riêng</span><span class="v">Đúng khi thứ đó có đời sống riêng: tạo riêng, có phiên bản, hoặc dùng chung. Trả giá bằng một join mỗi lần đọc — rẻ với PostgreSQL và đắt với sự kiên nhẫn của bạn.</span></div>
  <div class="kv"><span class="k">C — JSON</span><span class="v">Đúng cho dữ liệu thật sự không có lược đồ: một khối cài đặt, một payload webhook của bên thứ ba, một bản chụp trạng thái. Sai cho bất cứ thứ gì bạn lọc hay join. Và lưu ý: Prisma không cho bạn chút an toàn kiểu nào bên trong một cột <code>Json</code>. Chương 2 chỉ cách làm nó có kiểu bằng một tham số generic.</span></div>
</div>

<h3>Kế thừa: chỗ Prisma từ chối giải</h3>
<p>SQL không có lớp con, và Prisma — khác Hibernate hay Django — không cung cấp chiến lược ánh xạ kế thừa nào. Đây không phải thiếu sót; đây là một lập trường. Bạn mô hình hoá nó tường minh, và chính kho mã của CuongThai dùng mẫu thứ nhất:</p>
<pre><code><span class="tok-comment">// Kế thừa một bảng: một bảng, một enum phân biệt, các trường riêng cho phép null</span>
enum ContentType {
  VLOG
  ARTICLE
  CODE_REVIEW
}

model Content {
  id        Int         @id @default(autoincrement())
  type      ContentType
  title     String
  <span class="tok-comment">// chỉ có nghĩa khi type = VLOG</span>
  videoUrl  String?     @map("video_url")
  duration  Int?
  <span class="tok-comment">// chỉ có nghĩa khi type = ARTICLE</span>
  body      String?

  @@map("contents")
}</code></pre>
<div class="callout warn">
<p><strong>Cái giá của mẫu ấy, nói thẳng.</strong> Mọi cột riêng của từng loại con đều phải cho phép null, nên cơ sở dữ liệu không còn thi hành được luật "một VLOG bắt buộc có videoUrl" — phép kiểm đó chuyển vào ứng dụng, nơi nó có thể bị quên. Đổi lại bạn có một bảng, không join, và câu "liệt kê tất cả" cực dễ. Cách còn lại (mỗi loại một bảng) thi hành được ràng buộc nhưng biến một dòng thời gian hợp nhất thành một câu <code>UNION</code> qua ba bảng. Không cách nào sai. ORM không chọn được, nên <em>bạn</em> chọn, và bạn ghi lại lý do.</p>
</div>

<h3>Vậy rốt cuộc ORM đang làm gì?</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Ánh xạ tên và kiểu</span><span class="lz-d"><code>full_name TEXT NULL</code> ↔ <code>fullName: string | null</code>. Máy móc, buồn tẻ, và đúng là loại việc nên để bộ sinh mã làm thay con người.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Sinh SQL từ một bản mô tả</span><span class="lz-d">Bạn mô tả kết quả muốn có; nó viết <code>SELECT</code>, <code>JOIN</code>, <code>WHERE</code>, <code>LIMIT</code>. Giá trị không nằm ở chỗ SQL khó, mà ở chỗ ghép SQL từ các bộ lọc tuỳ chọn bằng chuỗi chính là nơi lỗi injection sinh sống.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ghép quan hệ trở lại thành hình</span><span class="lz-d">Hàng trả về là phẳng. Biến 200 bài viết và 47 tác giả thành 200 đối tượng lồng nhau — mà không cần một vòng lặp truy vấn — chính là phép gom lô bạn vừa thấy.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Giữ lược đồ và mã đi cùng nhịp</span><span class="lz-d">Đây là phần Prisma làm tốt nhất và phần lớn ORM khác bỏ qua: một tệp vừa là nguồn kiểu vừa là nguồn migration, nên hai thứ không trôi dạt khỏi nhau được.</span></div>
</div>
<p>Và đây là những gì nó <strong>không</strong> làm: nó không chọn chỉ mục cho bạn, không quyết chiến lược kế thừa, không ngăn bạn nạp một triệu hàng, và không làm JOIN của bạn nhanh lên. Những thứ đó vẫn là bài toán của cơ sở dữ liệu, giải bằng kiến thức cơ sở dữ liệu.</p>

<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai.</strong> Cái enum <code>ContentType</code> ở trên là thật, và sự cố đi kèm nó cũng thật. Ngày 08/08/2026, giá trị <code>CODE</code> được đổi tên thành <code>CODE_REVIEW</code> cho khớp với thứ frontend vốn đã gọi. Mọi phép kiểm kiểu đều qua. Script seed vẫn vỡ trên production — vì nó mang theo bản chép tay riêng của kiểu union, nên nó tự kiểm với chính nó chứ không kiểm với lược đồ. Chương 8 mổ xẻ thất bại đó từng dòng; đó là minh hoạ rõ nhất cho việc "kiểu đến từ lược đồ" chỉ đúng nếu bạn thật sự để nó đến từ đó.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://martinfowler.com/bliki/OrmHate.html" target="_blank" rel="noopener"><span class="lc-ico">📝</span><span class="lc-body"><span class="lc-title">Martin Fowler — OrmHate</span><span class="lc-sub">martinfowler.com · Bốn kiểu lệch ở trên là cách ông đặt vấn đề; đọc một lần là cả nhóm chủ đề này sáng ra</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Relation queries</span><span class="lc-sub">prisma.io/docs · <code>include</code> và <code>select</code> lồng nhau thật sự phân giải ra sao, kèm cả API kiểu chuỗi</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#relation-load-strategies" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Relation load strategies</span><span class="lc-sub">prisma.io/docs · <code>join</code> so với <code>query</code>, tính năng quyết định <code>include</code> là một câu lệnh hay nhiều câu</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương JOIN</span><span class="lc-sub">Thứ Prisma đang sinh hộ bạn, viết bằng tay — đáng đọc song song với chương này</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Dựng lại N+1 ở trên, rồi vá nó bằng ba cách khác nhau và so log truy vấn</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — What `prisma generate` actually writes|||1.2 — `prisma generate` thật sự viết ra cái gì',
      slug: 'pr-1-2-generate-viet-gi',
      type: 'LESSON',
      description: 'Mở tận nơi node_modules/.prisma/client: delegate cho từng model, kiểu Payload và GetPayload, các kiểu Args, vì sao index.d.ts phình lên chục nghìn dòng, và ba lệnh đọc mã sinh ra để hiểu nó thay vì đoán.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>What <code>prisma generate</code> actually writes</h2>
<p class="lead">Most people treat the generated client as a black box. It is not — it is ordinary TypeScript sitting in your <code>node_modules</code>, and twenty minutes reading it removes most of the mystery from the rest of this course. This lesson opens it, names the four kinds of thing inside, and shows the three commands that make it readable.</p>

<h3>Where it lives, and how big it is</h3>
<pre><code>ls -la node_modules/.prisma/client/
du -sh node_modules/.prisma/client/</code></pre>
<div class="out">total 42184
-rw-r--r--  1 hocvien hocvien      384 Aug 23 04:49 default.d.ts
-rw-r--r--  1 hocvien hocvien      197 Aug 23 04:49 default.js
-rw-r--r--  1 hocvien hocvien   241893 Aug 23 04:49 index.d.ts
-rw-r--r--  1 hocvien hocvien    38471 Aug 23 04:49 index.js
-rw-r--r--  1 hocvien hocvien   239114 Aug 23 04:49 edge.d.ts
-rw-r--r--  1 hocvien hocvien    39902 Aug 23 04:49 edge.js
-rwxr-xr-x  1 hocvien hocvien 18874368 Aug 23 04:49 libquery_engine-debian-openssl-3.0.x.so.node
-rw-r--r--  1 hocvien hocvien      812 Aug 23 04:49 schema.prisma
-rw-r--r--  1 hocvien hocvien     1204 Aug 23 04:49 package.json

41M	node_modules/.prisma/client/</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>index.d.ts</code> — 242 KB of types</span><span class="v">The part that matters. Model interfaces, one delegate per model, and the argument types for every method. Nothing here runs; it exists entirely for the compiler and your editor.</span></div>
  <div class="kv"><span class="k"><code>index.js</code> — 38 KB of runtime</span><span class="v">Surprisingly small, because it does almost nothing: it reads the embedded schema, builds the delegate objects with a <code>Proxy</code>, and forwards every call to the engine. The query building happens in the engine, not here.</span></div>
  <div class="kv"><span class="k"><code>libquery_engine-*.so.node</code> — 18 MB</span><span class="v">The Rust query engine, compiled for <strong>your platform</strong>. That platform suffix is the most operationally dangerous string in the whole toolchain, and Chapter 11 is largely about it.</span></div>
  <div class="kv"><span class="k"><code>schema.prisma</code> — a copy</span><span class="v">Your schema, embedded. The runtime reads it to know your models. This is why the generated client is genuinely self-describing, and why <code>prisma generate</code> must be re-run whenever the schema changes.</span></div>
  <div class="kv"><span class="k"><code>edge.js</code> / <code>edge.d.ts</code></span><span class="v">The variant for environments with no filesystem and no native modules — Cloudflare Workers, Vercel Edge. Same API, different transport. Chapter 11 covers when you need it.</span></div>
</div>

<h3>The four kinds of thing inside</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Model types</span><span class="lz-lnote">One plain interface per model, with scalars only — no relations. <code>User</code>, <code>Post</code>. This is what a bare <code>findMany()</code> returns, and it is the type most people import.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Delegates</span><span class="lz-lnote">One object per model exposing <code>findMany</code>, <code>create</code>, <code>update</code> and the rest. <code>prisma.user</code> is a <code>UserDelegate</code>. The methods are generic over your arguments, which is how the return type follows your <code>select</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Args types</span><span class="lz-lnote"><code>UserFindManyArgs</code>, <code>UserWhereInput</code>, <code>UserCreateInput</code>, <code>UserOrderByWithRelationInput</code>… roughly twenty per model. This is the bulk of those 242 KB, and the reason the file grows superlinearly with relation count.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Payload machinery</span><span class="lz-lnote"><code>Prisma.UserGetPayload&lt;T&gt;</code> and the <code>$Result</code> namespace. The conditional types that compute "given these args, what shape comes back". Unreadable, and the thing doing the actual magic — Chapter 8 uses it directly.</span></div>
</div>

<h3>Read it yourself — three useful commands</h3>
<pre><code><span class="tok-comment"># 1 — the model interface, exactly as generated</span>
sed -n '/^export type User = /,/^}/p' node_modules/.prisma/client/index.d.ts</code></pre>
<div class="out">export type User = $Result.DefaultSelection&lt;Prisma.$UserPayload&gt;</div>
<p>Not what you expected, probably. The public <code>User</code> type is itself computed — <code>DefaultSelection</code> of a payload — because Prisma needs one type that is both "the plain row" and "the thing a payload narrows from". Follow it one level down:</p>
<pre><code>grep -n -A 20 'export type \$UserPayload' node_modules/.prisma/client/index.d.ts | head -30</code></pre>
<div class="out">1284:  export type $UserPayload&lt;ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs&gt; = {
1285-    name: "User"
1286-    objects: {
1287-      posts: Prisma.$PostPayload&lt;ExtArgs&gt;[]
1288-    }
1289-    scalars: $Extensions.GetPayloadResult&lt;{
1290-      id: number
1291-      email: string
1292-      fullName: string | null
1293-      createdAt: Date
1294-    }, ExtArgs["result"]["user"]&gt;
1295-    composites: {}
1296-  }</div>
<p>There it is, in plain sight: <code>objects</code> holds the relations, <code>scalars</code> holds the columns, and the split between them is exactly the split between <code>include</code> and <code>select</code>. Every confusing type error you will ever get from Prisma is a mismatch in one of those two buckets.</p>
<pre><code><span class="tok-comment"># 2 — every method available on a model delegate</span>
grep -oP '^\\s{4}\\K[a-zA-Z]+(?=&lt;)' node_modules/.prisma/client/index.d.ts \\
  | sort -u | head -20</code></pre>
<div class="out">aggregate
count
create
createMany
createManyAndReturn
delete
deleteMany
findFirst
findFirstOrThrow
findMany
findUnique
findUniqueOrThrow
groupBy
update
updateMany
upsert</div>
<pre><code><span class="tok-comment"># 3 — how many Args types one model costs you</span>
grep -c 'export type User' node_modules/.prisma/client/index.d.ts
grep -c 'export type Post' node_modules/.prisma/client/index.d.ts
wc -l node_modules/.prisma/client/index.d.ts</code></pre>
<div class="out">31
33
7418</div>
<p>Thirty-one types for a four-field model. That is the price of the type safety, and it is worth knowing the number because it is what makes a big schema slow in your editor.</p>

<h3>Why the file grows faster than your schema</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">+1 field</span><span class="lz-t">Cheap</span><span class="lz-d">Adds one line to about six types. Effectively free.</span></div>
  <div class="lz-step"><span class="lz-k">+1 model</span><span class="lz-t">Linear</span><span class="lz-d">About thirty new types, one new delegate. A hundred-model schema is three thousand types — large, but still linear.</span></div>
  <div class="lz-step"><span class="lz-k">+1 relation</span><span class="lz-t">The expensive one</span><span class="lz-d">Both models gain relation filters, nested create/update/upsert inputs, and ordering inputs referencing each other. A densely connected schema is where <code>index.d.ts</code> passes a megabyte.</span></div>
  <div class="lz-step"><span class="lz-k">Result</span><span class="lz-t">Editor lag</span><span class="lz-d">Hovering a query in a 200-model schema can take seconds, because <code>tsc</code> is evaluating deeply nested conditional types on demand. Real, and Chapter 8 lists the four mitigations that actually help.</span></div>
</div>
<pre><code><span class="tok-comment"># The CuongThai schema, measured — 118 migrations, dozens of models</span>
wc -l prisma/schema.prisma
grep -c '^model ' prisma/schema.prisma
grep -c '^enum ' prisma/schema.prisma</code></pre>
<div class="out">3847 prisma/schema.prisma
112
19</div>

<div class="pitfall">
<p><strong>Trap — importing types from <code>.prisma/client</code> directly.</strong> It works, and it is wrong. Always import from <code>@prisma/client</code>. The <code>.prisma</code> path is an implementation detail that has changed shape between major versions (and moves entirely when you set a custom <code>output</code> in the generator block). Code that reaches into it breaks on upgrade for no benefit.</p>
</div>

<h3>Generating somewhere you can see</h3>
<p>Since Prisma 6, generating into <code>node_modules</code> is discouraged and a custom <code>output</code> is the recommended default. It is also the best way to actually look at the code:</p>
<pre><code>generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}</code></pre>
<pre><code>npx prisma generate
ls src/generated/prisma/</code></pre>
<div class="out">✔ Generated Prisma Client (v6.7.0) to ./src/generated/prisma in 96ms

index.d.ts  index.js  libquery_engine-debian-openssl-3.0.x.so.node  package.json  schema.prisma</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Import path changes</span><span class="v"><code>import { PrismaClient } from '../generated/prisma'</code> — a relative path now, not a package name. Every file that imports it must be updated.</span></div>
  <div class="kv"><span class="k">Add it to <code>.gitignore</code></span><span class="v">It is still generated output. Committing it means merge conflicts in a 250 KB machine-written file, and a stale client whenever someone forgets to regenerate.</span></div>
  <div class="kv"><span class="k">Your build must generate</span><span class="v">Outside <code>node_modules</code> the postinstall hook no longer covers you. Add <code>prisma generate</code> to your build script, or CI will fail with "module not found" on a fresh checkout.</span></div>
</div>

<h3>The runtime is thinner than you think</h3>
<pre><code>grep -n "class PrismaClient" -A 12 node_modules/.prisma/client/index.js | head -20</code></pre>
<div class="out">  const { PrismaClientKnownRequestError, ... } = require('./runtime/library.js')
  ...
  const config = {
    generator: { name: "client", provider: { fromEnvVar: null, value: "prisma-client-js" }, ... },
    relativePath: "../../../prisma",
    clientVersion: "6.7.0",
    engineVersion: "34ace0eb2704183d2c05b60b52fba5c43c13f303",
    datasourceNames: [ "db" ],
    activeProvider: "postgresql",
    inlineSchema: "Z2VuZXJhdG9yIGNsaWVudCB7CiAgcHJvdmlkZXIgPSAicHJpc21hLWNsaWVudC1qcyIKfQoK..."
  }
  const PrismaClient = getPrismaClient(config)</div>
<p>That base64 blob is your schema, embedded verbatim. The whole generated <code>index.js</code> is configuration plus a call into the shared runtime — the delegates (<code>prisma.user</code>, <code>prisma.post</code>) are built at construction time by a <code>Proxy</code> reading that schema. Which means: <strong>there is no per-model code</strong>. All of the model-specific work in the generated package is types, and types vanish at build time.</p>
<div class="callout ok">
<p><strong>The consequence worth remembering.</strong> Your generated client costs 250 KB on disk and roughly zero at runtime. The 18 MB engine binary is the real weight, and Prisma 6's WebAssembly query compiler exists to remove it — Lesson 1.3 covers what actually happens when a query leaves your process.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">Generating Prisma Client</span><span class="lc-sub">prisma.io/docs · Custom output, the postinstall hook, and what changed in Prisma 6</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/type-safety" target="_blank" rel="noopener"><span class="lc-ico">🧬</span><span class="lc-body"><span class="lc-title">Type safety — operating on generated types</span><span class="lc-sub">prisma.io/docs · <code>GetPayload</code>, <code>validator</code>, and how to name the shape a query returns</span></span></a>
<a class="link-card" href="https://github.com/prisma/prisma/tree/main/packages/client" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">prisma/prisma — the client package source</span><span class="lc-sub">github.com · The generator that writes everything above; <code>src/generation/</code> is the part to read</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">CuongThai course — TypeScript</span><span class="lc-sub">Conditional and mapped types, which is the machinery <code>GetPayload</code> is built from</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Find, in the generated file, the exact type a given query returns — then prove it with a deliberate error</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2><code>prisma generate</code> thật sự viết ra cái gì</h2>
<p class="lead">Phần lớn người dùng coi client sinh ra là một hộp đen. Nó không phải — nó là TypeScript bình thường nằm trong <code>node_modules</code> của bạn, và hai mươi phút đọc nó gỡ đi phần lớn phần huyền bí của cả khoá học này. Bài này mở nó ra, gọi tên bốn loại thứ bên trong, và chỉ ba câu lệnh khiến nó đọc được.</p>

<h3>Nó nằm ở đâu, và to cỡ nào</h3>
<pre><code>ls -la node_modules/.prisma/client/
du -sh node_modules/.prisma/client/</code></pre>
<div class="out">total 42184
-rw-r--r--  1 hocvien hocvien      384 Aug 23 04:49 default.d.ts
-rw-r--r--  1 hocvien hocvien      197 Aug 23 04:49 default.js
-rw-r--r--  1 hocvien hocvien   241893 Aug 23 04:49 index.d.ts
-rw-r--r--  1 hocvien hocvien    38471 Aug 23 04:49 index.js
-rw-r--r--  1 hocvien hocvien   239114 Aug 23 04:49 edge.d.ts
-rw-r--r--  1 hocvien hocvien    39902 Aug 23 04:49 edge.js
-rwxr-xr-x  1 hocvien hocvien 18874368 Aug 23 04:49 libquery_engine-debian-openssl-3.0.x.so.node
-rw-r--r--  1 hocvien hocvien      812 Aug 23 04:49 schema.prisma
-rw-r--r--  1 hocvien hocvien     1204 Aug 23 04:49 package.json

41M	node_modules/.prisma/client/</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>index.d.ts</code> — 242 KB toàn kiểu</span><span class="v">Phần quan trọng. Interface của model, mỗi model một delegate, và kiểu tham số cho mọi phương thức. Ở đây không có gì chạy cả; nó tồn tại hoàn toàn cho trình biên dịch và trình soạn thảo của bạn.</span></div>
  <div class="kv"><span class="k"><code>index.js</code> — 38 KB phần chạy</span><span class="v">Nhỏ đến bất ngờ, vì nó gần như không làm gì: đọc lược đồ nhúng bên trong, dựng các đối tượng delegate bằng một <code>Proxy</code>, rồi chuyển tiếp mọi lời gọi xuống engine. Phần dựng truy vấn xảy ra trong engine, không phải ở đây.</span></div>
  <div class="kv"><span class="k"><code>libquery_engine-*.so.node</code> — 18 MB</span><span class="v">Query engine viết bằng Rust, biên dịch cho <strong>nền tảng của bạn</strong>. Cái hậu tố nền tảng ấy là chuỗi ký tự nguy hiểm nhất về mặt vận hành trong cả bộ công cụ, và Chương 11 phần lớn nói về nó.</span></div>
  <div class="kv"><span class="k"><code>schema.prisma</code> — một bản sao</span><span class="v">Lược đồ của bạn, nhúng vào. Phần chạy đọc nó để biết các model của bạn. Nhờ vậy client sinh ra thật sự tự mô tả được chính nó, và cũng vì vậy <code>prisma generate</code> phải chạy lại mỗi khi lược đồ đổi.</span></div>
  <div class="kv"><span class="k"><code>edge.js</code> / <code>edge.d.ts</code></span><span class="v">Biến thể cho môi trường không có hệ tệp và không có module native — Cloudflare Workers, Vercel Edge. Cùng API, khác đường truyền. Chương 11 nói khi nào bạn cần nó.</span></div>
</div>

<h3>Bốn loại thứ bên trong</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Kiểu model</span><span class="lz-lnote">Mỗi model một interface thuần, chỉ có trường vô hướng — không có quan hệ. <code>User</code>, <code>Post</code>. Đây là thứ một lời gọi <code>findMany()</code> trần trả về, và là kiểu phần lớn người ta import.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Delegate</span><span class="lz-lnote">Mỗi model một đối tượng phơi ra <code>findMany</code>, <code>create</code>, <code>update</code> và phần còn lại. <code>prisma.user</code> là một <code>UserDelegate</code>. Các phương thức là generic theo tham số bạn truyền, và đó là cách kiểu trả về đi theo cái <code>select</code> của bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Kiểu Args</span><span class="lz-lnote"><code>UserFindManyArgs</code>, <code>UserWhereInput</code>, <code>UserCreateInput</code>, <code>UserOrderByWithRelationInput</code>… khoảng hai mươi kiểu cho mỗi model. Đây là phần chiếm gần hết 242 KB kia, và là lý do tệp phình nhanh hơn tuyến tính theo số quan hệ.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Bộ máy Payload</span><span class="lz-lnote"><code>Prisma.UserGetPayload&lt;T&gt;</code> và không gian tên <code>$Result</code>. Những kiểu điều kiện tính ra "với bộ tham số này thì hình dạng trả về là gì". Không đọc nổi, và là thứ làm phép màu thật sự — Chương 8 dùng nó trực tiếp.</span></div>
</div>

<h3>Tự đọc nó — ba câu lệnh hữu dụng</h3>
<pre><code><span class="tok-comment"># 1 — interface của model, đúng như được sinh ra</span>
sed -n '/^export type User = /,/^}/p' node_modules/.prisma/client/index.d.ts</code></pre>
<div class="out">export type User = $Result.DefaultSelection&lt;Prisma.$UserPayload&gt;</div>
<p>Chắc không giống thứ bạn tưởng. Kiểu công khai <code>User</code> tự nó cũng là kiểu được tính ra — <code>DefaultSelection</code> của một payload — vì Prisma cần một kiểu vừa là "hàng thuần" vừa là "thứ mà payload thu hẹp từ đó". Đi xuống thêm một tầng:</p>
<pre><code>grep -n -A 20 'export type \$UserPayload' node_modules/.prisma/client/index.d.ts | head -30</code></pre>
<div class="out">1284:  export type $UserPayload&lt;ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs&gt; = {
1285-    name: "User"
1286-    objects: {
1287-      posts: Prisma.$PostPayload&lt;ExtArgs&gt;[]
1288-    }
1289-    scalars: $Extensions.GetPayloadResult&lt;{
1290-      id: number
1291-      email: string
1292-      fullName: string | null
1293-      createdAt: Date
1294-    }, ExtArgs["result"]["user"]&gt;
1295-    composites: {}
1296-  }</div>
<p>Nó nằm ngay đó, không giấu giếm: <code>objects</code> giữ các quan hệ, <code>scalars</code> giữ các cột, và ranh giới giữa hai cái đúng bằng ranh giới giữa <code>include</code> và <code>select</code>. Mọi lỗi kiểu khó hiểu mà Prisma từng ném vào mặt bạn đều là một chỗ lệch trong một trong hai ngăn ấy.</p>
<pre><code><span class="tok-comment"># 2 — mọi phương thức có trên một delegate của model</span>
grep -oP '^\\s{4}\\K[a-zA-Z]+(?=&lt;)' node_modules/.prisma/client/index.d.ts \\
  | sort -u | head -20</code></pre>
<div class="out">aggregate
count
create
createMany
createManyAndReturn
delete
deleteMany
findFirst
findFirstOrThrow
findMany
findUnique
findUniqueOrThrow
groupBy
update
updateMany
upsert</div>
<pre><code><span class="tok-comment"># 3 — một model tốn của bạn bao nhiêu kiểu Args</span>
grep -c 'export type User' node_modules/.prisma/client/index.d.ts
grep -c 'export type Post' node_modules/.prisma/client/index.d.ts
wc -l node_modules/.prisma/client/index.d.ts</code></pre>
<div class="out">31
33
7418</div>
<p>Ba mươi mốt kiểu cho một model bốn trường. Đó là giá của sự an toàn kiểu, và con số ấy đáng biết vì nó chính là thứ làm một lược đồ lớn trở nên chậm trong trình soạn thảo.</p>

<h3>Vì sao tệp phình nhanh hơn lược đồ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">+1 trường</span><span class="lz-t">Rẻ</span><span class="lz-d">Thêm một dòng vào chừng sáu kiểu. Coi như miễn phí.</span></div>
  <div class="lz-step"><span class="lz-k">+1 model</span><span class="lz-t">Tuyến tính</span><span class="lz-d">Khoảng ba mươi kiểu mới, một delegate mới. Lược đồ trăm model là ba nghìn kiểu — lớn, nhưng vẫn tuyến tính.</span></div>
  <div class="lz-step"><span class="lz-k">+1 quan hệ</span><span class="lz-t">Cái đắt</span><span class="lz-d">Cả hai model đều mọc thêm bộ lọc theo quan hệ, các input create/update/upsert lồng nhau, và input sắp xếp tham chiếu lẫn nhau. Một lược đồ nối chằng chịt là nơi <code>index.d.ts</code> vượt một megabyte.</span></div>
  <div class="lz-step"><span class="lz-k">Kết quả</span><span class="lz-t">Trình soạn thảo ì</span><span class="lz-d">Rê chuột lên một câu truy vấn trong lược đồ 200 model có thể mất vài giây, vì <code>tsc</code> đang tính các kiểu điều kiện lồng sâu theo yêu cầu. Chuyện có thật, và Chương 8 liệt kê bốn cách giảm nhẹ thật sự có tác dụng.</span></div>
</div>
<pre><code><span class="tok-comment"># Lược đồ của CuongThai, đo thật — 118 migration, hàng chục model</span>
wc -l prisma/schema.prisma
grep -c '^model ' prisma/schema.prisma
grep -c '^enum ' prisma/schema.prisma</code></pre>
<div class="out">3847 prisma/schema.prisma
112
19</div>

<div class="pitfall">
<p><strong>Bẫy — import kiểu thẳng từ <code>.prisma/client</code>.</strong> Nó chạy được, và nó sai. Luôn import từ <code>@prisma/client</code>. Đường <code>.prisma</code> là chi tiết cài đặt, đã đổi hình dạng giữa các bản major (và dời đi hẳn khi bạn đặt <code>output</code> riêng trong khối generator). Mã thò tay vào đó sẽ vỡ lúc nâng cấp mà chẳng đổi lại được gì.</p>
</div>

<h3>Sinh mã ra chỗ bạn nhìn thấy</h3>
<p>Từ Prisma 6, sinh vào <code>node_modules</code> bị khuyến cáo không nên, và một <code>output</code> riêng là mặc định được khuyến nghị. Đó cũng là cách tốt nhất để thật sự nhìn vào mã:</p>
<pre><code>generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}</code></pre>
<pre><code>npx prisma generate
ls src/generated/prisma/</code></pre>
<div class="out">✔ Generated Prisma Client (v6.7.0) to ./src/generated/prisma in 96ms

index.d.ts  index.js  libquery_engine-debian-openssl-3.0.x.so.node  package.json  schema.prisma</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đường import đổi</span><span class="v"><code>import { PrismaClient } from '../generated/prisma'</code> — giờ là đường tương đối, không phải tên gói. Mọi tệp import nó đều phải sửa.</span></div>
  <div class="kv"><span class="k">Nhớ thêm vào <code>.gitignore</code></span><span class="v">Nó vẫn là mã sinh ra. Commit nó nghĩa là xung đột merge trong một tệp 250 KB do máy viết, và một client cũ mèm mỗi khi ai đó quên sinh lại.</span></div>
  <div class="kv"><span class="k">Bản build của bạn phải generate</span><span class="v">Ra ngoài <code>node_modules</code> thì móc postinstall không còn che cho bạn nữa. Thêm <code>prisma generate</code> vào script build, không thì CI sẽ chết với "module not found" ngay lần checkout sạch đầu tiên.</span></div>
</div>

<h3>Phần chạy mỏng hơn bạn tưởng</h3>
<pre><code>grep -n "class PrismaClient" -A 12 node_modules/.prisma/client/index.js | head -20</code></pre>
<div class="out">  const { PrismaClientKnownRequestError, ... } = require('./runtime/library.js')
  ...
  const config = {
    generator: { name: "client", provider: { fromEnvVar: null, value: "prisma-client-js" }, ... },
    relativePath: "../../../prisma",
    clientVersion: "6.7.0",
    engineVersion: "34ace0eb2704183d2c05b60b52fba5c43c13f303",
    datasourceNames: [ "db" ],
    activeProvider: "postgresql",
    inlineSchema: "Z2VuZXJhdG9yIGNsaWVudCB7CiAgcHJvdmlkZXIgPSAicHJpc21hLWNsaWVudC1qcyIKfQoK..."
  }
  const PrismaClient = getPrismaClient(config)</div>
<p>Cái khối base64 kia là lược đồ của bạn, nhúng nguyên văn. Toàn bộ <code>index.js</code> được sinh ra chỉ là cấu hình cộng một lời gọi vào phần chạy dùng chung — các delegate (<code>prisma.user</code>, <code>prisma.post</code>) được dựng lúc khởi tạo bởi một <code>Proxy</code> đọc lược đồ ấy. Nghĩa là: <strong>không có mã riêng cho từng model</strong>. Mọi phần việc gắn với model trong gói được sinh ra đều là kiểu, mà kiểu thì bốc hơi lúc build.</p>
<div class="callout ok">
<p><strong>Hệ quả đáng nhớ.</strong> Client sinh ra tốn 250 KB trên đĩa và gần như bằng không lúc chạy. Cái nhị phân engine 18 MB mới là sức nặng thật, và trình biên dịch truy vấn bằng WebAssembly của Prisma 6 tồn tại để bỏ nó đi — Bài 1.3 nói chuyện gì thật sự xảy ra khi một câu truy vấn rời khỏi tiến trình của bạn.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">Generating Prisma Client</span><span class="lc-sub">prisma.io/docs · Output riêng, móc postinstall, và những gì đổi ở Prisma 6</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/type-safety" target="_blank" rel="noopener"><span class="lc-ico">🧬</span><span class="lc-body"><span class="lc-title">Type safety — làm việc với kiểu được sinh ra</span><span class="lc-sub">prisma.io/docs · <code>GetPayload</code>, <code>validator</code>, và cách đặt tên cho hình dạng một câu truy vấn trả về</span></span></a>
<a class="link-card" href="https://github.com/prisma/prisma/tree/main/packages/client" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">prisma/prisma — mã nguồn gói client</span><span class="lc-sub">github.com · Bộ sinh viết ra mọi thứ ở trên; phần đáng đọc là <code>src/generation/</code></span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — TypeScript</span><span class="lc-sub">Kiểu điều kiện và kiểu ánh xạ, tức bộ máy mà <code>GetPayload</code> được dựng từ đó</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Tìm trong tệp sinh ra chính xác kiểu mà một câu truy vấn cho trước trả về, rồi chứng minh bằng một lỗi cố ý</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — How a query becomes SQL|||1.3 — Một câu truy vấn thành SQL như thế nào',
      slug: 'pr-1-3-thanh-sql',
      type: 'LESSON',
      description: 'Đường đi đầy đủ từ prisma.user.findMany tới một gói tin trên dây: JSON protocol, query engine Rust, connection pool sống trong engine, ba kiến trúc engine của Prisma 4/5/6, driver adapter, và cách bắt tận tay SQL kèm thời lượng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>How a query becomes SQL</h2>
<p class="lead">You call a method on a JavaScript object; a TCP packet leaves your machine carrying SQL. Between those two events sit four steps and — depending on your Prisma version — either a separate Rust process, a native module in your process, or a WebAssembly module. Which one you have decides your Docker image size, your cold-start time, and whether that image runs at all.</p>

<h3>The path, end to end</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">You call a delegate method</span><span class="lz-d"><code>prisma.user.findMany({ where: { email: { contains: 'example' } } })</code>. A <code>Proxy</code> intercepts <code>.user</code>, then <code>.findMany</code>, and packages the arguments. No SQL exists yet, and nothing has been validated beyond what TypeScript checked at build time.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Serialised to the JSON protocol</span><span class="lz-d">The client turns your object into a protocol message naming the model, the action and the arguments. This is the boundary between JavaScript and Rust, and it is why the client itself contains no SQL knowledge at all.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The engine builds and runs SQL</span><span class="lz-d">The query engine validates against the schema it holds, produces SQL for the active provider, takes a connection <strong>from its own pool</strong>, sends it, and reads the rows back.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Rows become objects</span><span class="lz-d">The engine reshapes flat rows into the nested structure your <code>include</code> asked for, converts types (<code>NUMERIC</code> → <code>Decimal</code>, <code>TIMESTAMP</code> → <code>Date</code>), and hands JSON back. The client returns it unchanged.</span></div>
</div>
<div class="callout">
<p><strong>The consequence people trip over.</strong> The connection pool lives in the <em>engine</em>, not in your JavaScript. That is why <code>connection_limit</code> is a URL parameter rather than a constructor option, why a second <code>new PrismaClient()</code> is a second pool, and why Prisma's pool cannot be shared with a <code>pg</code> client you also use. Chapter 9 measures what that costs and Chapter 11 covers PgBouncer, where it matters most.</p>
</div>

<h3>See both sides at once</h3>
<pre><code>const prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });

prisma.$on('query', (e) =&gt; {
  console.log('SQL     :', e.query);
  console.log('PARAMS  :', e.params);
  console.log('DURATION:', e.duration, 'ms');
});

await prisma.user.findMany({
  where: { email: { contains: 'example' } },
  include: { posts: { where: { published: true } } },
  take: 5,
});</code></pre>
<div class="out">SQL     : SELECT "public"."users"."id", "public"."users"."email", "public"."users"."full_name", "public"."users"."created_at" FROM "public"."users" WHERE "public"."users"."email"::text LIKE $1 LIMIT $2 OFFSET $3
PARAMS  : ["%example%",5,0]
DURATION: 2 ms
SQL     : SELECT "public"."posts"."id", "public"."posts"."title", "public"."posts"."body", "public"."posts"."published", "public"."posts"."views", "public"."posts"."created_at", "public"."posts"."author_id" FROM "public"."posts" WHERE ("public"."posts"."published" = $1 AND "public"."posts"."author_id" IN ($2,$3)) OFFSET $4
PARAMS  : [true,1,3]
DURATION: 1 ms</div>
<p>Three things are worth naming in that output, because each is a habit:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Parameters are always separate</span><span class="v"><code>$1</code>, <code>$2</code> with values in <code>params</code> — never string concatenation. This is why Prisma Client queries are structurally immune to SQL injection, and why Chapter 10 spends so long on the one place that guarantee stops holding.</span></div>
  <div class="kv"><span class="k">Every column is named</span><span class="v">Prisma never emits <code>SELECT *</code>. If you add a column tomorrow, existing queries do not silently start fetching it — a small thing that prevents a class of surprise payload growth.</span></div>
  <div class="kv"><span class="k"><code>contains</code> became <code>LIKE '%…%'</code></span><span class="v">And that will not use a plain B-tree index. It is a sequential scan on a large table, and it is one of the most common causes of "Prisma is slow" that is really "this query was always going to be slow". Chapter 9 shows the trigram-index fix.</span></div>
</div>

<h3>Three engine architectures, three sets of problems</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Binary engine (Prisma 2, and still available)</span><span class="lz-lnote">A separate <code>query-engine</code> process, spoken to over HTTP on localhost. Robust and easy to reason about; costs a process, a port and ~50 ms of start-up. Enable with <code>engineType = "binary"</code>. Rarely the right choice today.</span></div>
  <div class="lz-layer"><span class="lz-lname">Node-API library (the default in Prisma 3–5)</span><span class="lz-lnote"><code>libquery_engine-&lt;platform&gt;.so.node</code>, loaded into your Node process. No extra process, faster calls — and a hard dependency on the exact platform and libc it was built for. <strong>This is the layer behind the outage in the note below.</strong></span></div>
  <div class="lz-layer"><span class="lz-lname">Query compiler in WebAssembly (Prisma 6+)</span><span class="lz-lnote">No native binary at all: SQL is compiled in WASM and executed by an ordinary JavaScript driver via a <em>driver adapter</em>. Removes ~18 MB from the image and the whole class of platform-mismatch failures. Requires the adapter packages and, in 6.x, a preview flag.</span></div>
</div>
<pre><code><span class="tok-comment">// The WASM / driver-adapter shape — no engine binary anywhere</span>
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

<span class="tok-comment">// Now the pool is node-postgres's pool, which you configure directly —</span>
<span class="tok-comment">// and can share with any other pg-based code in the same process.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Why adapters matter beyond size</span><span class="v">They put the connection pool back in JavaScript, where you can see and tune it. They are also the only way to reach a database over a non-standard transport — Neon over WebSockets, Cloudflare D1, PlanetScale's HTTP API.</span></div>
  <div class="kv"><span class="k">What you give up</span><span class="v">The Rust engine handles some type conversions and some query shapes that a JS driver does not. Behaviour is very close but not identical; test rather than assume, especially around <code>Decimal</code> and <code>BigInt</code>.</span></div>
</div>

<div class="note-ct">
<p><strong>From the CuongThai codebase — the engine mismatch that killed the API for seven minutes.</strong> On 2026-08-18 a deploy script built the backend image with <code>docker build .</code>, which picked the default <code>Dockerfile</code> instead of the <code>Dockerfile.backend</code> that Compose actually uses. The base image became <code>node:22-alpine</code> — musl libc — while the generated client still carried the <code>debian-openssl-3.0.x</code> engine, which is glibc. The build was green. The push was green. The swap was green. Then the backend restarted in an endless loop and the API returned 502 for seven minutes.</p>
<p>The lesson is written into the repo's own instructions in capital letters: <em>a green build does not mean a runnable image</em>. The fix was a libc-versus-engine check that runs before the push. Chapter 11 shows how to write that check, and why <code>binaryTargets</code> is not optional the moment your build machine and your runtime machine differ.</p>
</div>

<h3>Reading the plan Prisma cannot show you</h3>
<p>The engine will tell you the SQL and the duration. It will not tell you <em>why</em> a query was slow — that is PostgreSQL's job, and you ask it directly:</p>
<pre><code><span class="tok-comment">-- Take the SQL from the log, substitute the params, and ask the planner</span>
EXPLAIN ANALYZE
SELECT "public"."posts".* FROM "public"."posts"
WHERE ("public"."posts"."published" = true AND "public"."posts"."author_id" IN (1,3));</code></pre>
<div class="out">Seq Scan on posts  (cost=0.00..2891.00 rows=48 width=97) (actual time=0.021..18.442 rows=52 loops=1)
  Filter: (published AND (author_id = ANY ('{1,3}'::integer[])))
  Rows Removed by Filter: 119948
Planning Time: 0.183 ms
Execution Time: 18.501 ms</div>
<p><code>Seq Scan</code>, 119,948 rows removed by filter. The Prisma log said "18 ms" and nothing else; the planner said why. This loop — copy the SQL out of the query log, run <code>EXPLAIN ANALYZE</code> on it, fix the schema, re-measure — is the whole of Prisma performance work, and Chapter 9 does nothing but drill it.</p>

<h3>What runs where, summarised</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Your process</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Generated client</span><span class="lz-nsub">Proxies, argument packaging, TypeScript types. No SQL knowledge whatsoever.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Driver adapter (optional)</span><span class="lz-nsub">In WASM mode: a real JS driver plus its pool, which you own and configure.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">The engine</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Schema validation</span><span class="lz-nsub">Against the embedded copy of your schema — which is why a stale client and a fresh database disagree so loudly.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">SQL generation</span><span class="lz-nsub">Provider-specific. The same Prisma query produces different SQL on PostgreSQL and MySQL.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Connection pool</span><span class="lz-nsub">In native mode this is inside the engine and configured only through the URL.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Result reshaping</span><span class="lz-nsub">Flat rows to nested objects; database types to JavaScript types.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">The database</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Planning and execution</span><span class="lz-nsub">Index choice, join order, everything that decides whether "18 ms" is 18 ms or 18 seconds. Prisma has no influence here at all.</span></div></div>
  </div>
</div>

<div class="pitfall">
<p><strong>Trap — the stale generated client.</strong> The engine validates against the schema <em>embedded in the client at generate time</em>, not the live database. Change the schema, run <code>migrate deploy</code>, forget <code>generate</code>, and you get errors that name columns which plainly exist ("<code>The column &#96;users.phone&#96; does not exist</code>" when it does). The database is right; the client is out of date. In CI, always run <code>generate</code> after <code>migrate deploy</code> — and note the postinstall hook only saves you when the schema was already correct at install time.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/more/under-the-hood/engines" target="_blank" rel="noopener"><span class="lc-ico">🦀</span><span class="lc-body"><span class="lc-title">Prisma engines — under the hood</span><span class="lc-sub">prisma.io/docs · The engine types, where each binary goes, and the environment variables that override them</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/overview/databases/database-drivers" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">Driver adapters</span><span class="lc-sub">prisma.io/docs · The adapter list per database and what changes when you adopt one</span></span></a>
<a class="link-card" href="https://www.prisma.io/blog/prisma-orm-manifesto" target="_blank" rel="noopener"><span class="lc-ico">📣</span><span class="lc-body"><span class="lc-title">The Prisma ORM manifesto — removing the Rust engine</span><span class="lc-sub">prisma.io/blog · Why the team moved to a WASM query compiler, in their own words</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, EXPLAIN chapter</span><span class="lc-sub">Reading the plan above properly: cost, rows, loops, and which node is the one hurting you</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Capture a query event, reconstruct the full SQL with its parameters, and run EXPLAIN on it</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Một câu truy vấn thành SQL như thế nào</h2>
<p class="lead">Bạn gọi một phương thức trên một đối tượng JavaScript; một gói tin TCP rời máy bạn mang theo SQL. Giữa hai sự kiện đó là bốn bước và — tuỳ phiên bản Prisma — hoặc một tiến trình Rust riêng, hoặc một module native nằm trong tiến trình của bạn, hoặc một module WebAssembly. Bạn đang có cái nào quyết định kích thước ảnh Docker, thời gian khởi động nguội, và cả chuyện ảnh đó có chạy nổi hay không.</p>

<h3>Đường đi, từ đầu tới cuối</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bạn gọi một phương thức của delegate</span><span class="lz-d"><code>prisma.user.findMany({ where: { email: { contains: 'example' } } })</code>. Một <code>Proxy</code> chặn <code>.user</code>, rồi <code>.findMany</code>, và đóng gói tham số. Chưa có SQL nào tồn tại, và chưa có gì được kiểm ngoài những gì TypeScript đã kiểm lúc build.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đóng gói theo giao thức JSON</span><span class="lz-d">Client biến đối tượng của bạn thành một thông điệp giao thức nêu tên model, hành động và tham số. Đây là ranh giới giữa JavaScript và Rust, và cũng là lý do bản thân client không mang chút hiểu biết SQL nào.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Engine dựng và chạy SQL</span><span class="lz-d">Query engine kiểm lại theo lược đồ nó đang giữ, sinh SQL cho provider đang hoạt động, lấy một kết nối <strong>từ pool của chính nó</strong>, gửi đi, và đọc hàng trả về.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hàng thành đối tượng</span><span class="lz-d">Engine nắn các hàng phẳng thành cấu trúc lồng nhau mà <code>include</code> của bạn yêu cầu, đổi kiểu (<code>NUMERIC</code> → <code>Decimal</code>, <code>TIMESTAMP</code> → <code>Date</code>), rồi trả JSON về. Client trả lại nguyên vẹn.</span></div>
</div>
<div class="callout">
<p><strong>Hệ quả mà người ta hay vấp.</strong> Connection pool sống trong <em>engine</em>, không phải trong JavaScript của bạn. Vì thế <code>connection_limit</code> là một tham số URL chứ không phải tuỳ chọn của hàm dựng, vì thế một lần <code>new PrismaClient()</code> thứ hai là một pool thứ hai, và vì thế pool của Prisma không dùng chung được với một client <code>pg</code> mà bạn cũng đang dùng. Chương 9 đo cái giá đó, còn Chương 11 nói về PgBouncer — nơi nó quan trọng nhất.</p>
</div>

<h3>Nhìn cả hai phía cùng lúc</h3>
<pre><code>const prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });

prisma.$on('query', (e) =&gt; {
  console.log('SQL     :', e.query);
  console.log('PARAMS  :', e.params);
  console.log('DURATION:', e.duration, 'ms');
});

await prisma.user.findMany({
  where: { email: { contains: 'example' } },
  include: { posts: { where: { published: true } } },
  take: 5,
});</code></pre>
<div class="out">SQL     : SELECT "public"."users"."id", "public"."users"."email", "public"."users"."full_name", "public"."users"."created_at" FROM "public"."users" WHERE "public"."users"."email"::text LIKE $1 LIMIT $2 OFFSET $3
PARAMS  : ["%example%",5,0]
DURATION: 2 ms
SQL     : SELECT "public"."posts"."id", "public"."posts"."title", "public"."posts"."body", "public"."posts"."published", "public"."posts"."views", "public"."posts"."created_at", "public"."posts"."author_id" FROM "public"."posts" WHERE ("public"."posts"."published" = $1 AND "public"."posts"."author_id" IN ($2,$3)) OFFSET $4
PARAMS  : [true,1,3]
DURATION: 1 ms</div>
<p>Ba điều trong output đó đáng gọi tên, vì mỗi điều là một thói quen:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tham số luôn tách riêng</span><span class="v"><code>$1</code>, <code>$2</code> với giá trị nằm trong <code>params</code> — không bao giờ nối chuỗi. Nhờ vậy truy vấn qua Prisma Client miễn nhiễm SQL injection về mặt cấu trúc, và cũng vì vậy Chương 10 dành nhiều thời gian cho đúng một chỗ mà bảo đảm ấy ngừng có hiệu lực.</span></div>
  <div class="kv"><span class="k">Mọi cột đều được nêu tên</span><span class="v">Prisma không bao giờ phát ra <code>SELECT *</code>. Mai bạn thêm một cột thì các truy vấn cũ không âm thầm bắt đầu kéo nó về — một chi tiết nhỏ ngăn được cả một lớp chuyện "payload tự nhiên phình".</span></div>
  <div class="kv"><span class="k"><code>contains</code> thành <code>LIKE '%…%'</code></span><span class="v">Và cái đó KHÔNG dùng được chỉ mục B-tree thường. Trên bảng lớn nó là một lần quét tuần tự, và đây là một trong những nguyên nhân phổ biến nhất của câu than "Prisma chậm" mà thật ra là "câu truy vấn này vốn dĩ đã phải chậm". Chương 9 chỉ cách vá bằng chỉ mục trigram.</span></div>
</div>

<h3>Ba kiến trúc engine, ba nhóm vấn đề</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Engine dạng nhị phân (Prisma 2, và vẫn còn dùng được)</span><span class="lz-lnote">Một tiến trình <code>query-engine</code> riêng, nói chuyện qua HTTP trên localhost. Bền và dễ suy luận; trả giá bằng một tiến trình, một cổng và khoảng 50 ms khởi động. Bật bằng <code>engineType = "binary"</code>. Ngày nay hiếm khi là lựa chọn đúng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thư viện Node-API (mặc định ở Prisma 3–5)</span><span class="lz-lnote"><code>libquery_engine-&lt;nền tảng&gt;.so.node</code>, nạp thẳng vào tiến trình Node của bạn. Không thêm tiến trình, gọi nhanh hơn — và phụ thuộc cứng vào đúng nền tảng cùng libc mà nó được dựng cho. <strong>Đây chính là tầng đứng sau sự cố ở khối ghi chú bên dưới.</strong></span></div>
  <div class="lz-layer"><span class="lz-lname">Trình biên dịch truy vấn bằng WebAssembly (Prisma 6+)</span><span class="lz-lnote">Không còn nhị phân native nào: SQL được biên dịch trong WASM và thực thi bởi một trình điều khiển JavaScript bình thường qua một <em>driver adapter</em>. Bỏ đi ~18 MB khỏi ảnh và bỏ luôn cả lớp lỗi lệch nền tảng. Cần các gói adapter, và ở 6.x cần một cờ preview.</span></div>
</div>
<pre><code><span class="tok-comment">// Dáng của WASM / driver adapter — không có nhị phân engine ở đâu cả</span>
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

<span class="tok-comment">// Giờ pool là pool của node-postgres, do bạn cấu hình trực tiếp —</span>
<span class="tok-comment">// và dùng chung được với bất kỳ đoạn mã nào khác cũng chạy trên pg trong cùng tiến trình.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao adapter quan trọng hơn chuyện kích thước</span><span class="v">Nó trả connection pool về lại JavaScript, nơi bạn nhìn thấy và chỉnh được. Nó cũng là cách duy nhất để với tới cơ sở dữ liệu qua đường truyền phi tiêu chuẩn — Neon qua WebSocket, Cloudflare D1, API HTTP của PlanetScale.</span></div>
  <div class="kv"><span class="k">Bạn đánh đổi gì</span><span class="v">Engine Rust xử lý một số phép đổi kiểu và một số dạng truy vấn mà trình điều khiển JS không xử lý. Hành vi rất gần nhưng không đồng nhất; hãy kiểm thay vì tin, nhất là quanh <code>Decimal</code> và <code>BigInt</code>.</span></div>
</div>

<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai — cú lệch engine giết API bảy phút.</strong> Ngày 18/08/2026 một script deploy dựng ảnh backend bằng <code>docker build .</code>, và lệnh đó lấy <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> mà Compose thật sự dùng. Ảnh nền thành <code>node:22-alpine</code> — musl libc — trong khi client được sinh ra vẫn mang engine <code>debian-openssl-3.0.x</code>, vốn là glibc. Build xanh. Đẩy xanh. Tráo xanh. Rồi backend restart vô tận và API trả 502 suốt bảy phút.</p>
<p>Bài học được viết vào chính chỉ dẫn của kho mã bằng chữ in hoa: <em>build xanh không có nghĩa là ảnh chạy được</em>. Cách vá là một chốt kiểm libc ↔ engine chạy trước khi đẩy. Chương 11 chỉ cách viết chốt đó, và vì sao <code>binaryTargets</code> hết là tuỳ chọn ngay khi máy build và máy chạy khác nhau.</p>
</div>

<h3>Đọc cái kế hoạch mà Prisma không chỉ cho bạn được</h3>
<p>Engine sẽ nói cho bạn biết SQL và thời lượng. Nó không nói <em>vì sao</em> một câu truy vấn chậm — đó là việc của PostgreSQL, và bạn hỏi thẳng nó:</p>
<pre><code><span class="tok-comment">-- Lấy SQL từ log, thay tham số vào, rồi hỏi bộ lập kế hoạch</span>
EXPLAIN ANALYZE
SELECT "public"."posts".* FROM "public"."posts"
WHERE ("public"."posts"."published" = true AND "public"."posts"."author_id" IN (1,3));</code></pre>
<div class="out">Seq Scan on posts  (cost=0.00..2891.00 rows=48 width=97) (actual time=0.021..18.442 rows=52 loops=1)
  Filter: (published AND (author_id = ANY ('{1,3}'::integer[])))
  Rows Removed by Filter: 119948
Planning Time: 0.183 ms
Execution Time: 18.501 ms</div>
<p><code>Seq Scan</code>, 119.948 hàng bị bộ lọc loại bỏ. Log của Prisma nói "18 ms" và không nói gì thêm; bộ lập kế hoạch nói vì sao. Cái vòng lặp này — chép SQL ra khỏi log truy vấn, chạy <code>EXPLAIN ANALYZE</code> lên nó, sửa lược đồ, đo lại — chính là toàn bộ công việc tối ưu hiệu năng Prisma, và Chương 9 không làm gì khác ngoài luyện đúng vòng ấy.</p>

<h3>Cái gì chạy ở đâu, tóm lại</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Tiến trình của bạn</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Client được sinh ra</span><span class="lz-nsub">Proxy, đóng gói tham số, kiểu TypeScript. Không có chút hiểu biết SQL nào.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Driver adapter (tuỳ chọn)</span><span class="lz-nsub">Ở chế độ WASM: một trình điều khiển JS thật cùng pool của nó, do bạn sở hữu và cấu hình.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Engine</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Kiểm theo lược đồ</span><span class="lz-nsub">Kiểm với bản sao lược đồ nhúng bên trong — nên một client cũ và một cơ sở dữ liệu mới cãi nhau rất to.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Sinh SQL</span><span class="lz-nsub">Theo từng provider. Cùng một câu truy vấn Prisma sinh ra SQL khác nhau trên PostgreSQL và MySQL.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Connection pool</span><span class="lz-nsub">Ở chế độ native, pool nằm bên trong engine và chỉ cấu hình được qua URL.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nắn lại kết quả</span><span class="lz-nsub">Hàng phẳng thành đối tượng lồng; kiểu cơ sở dữ liệu thành kiểu JavaScript.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cơ sở dữ liệu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Lập kế hoạch và thực thi</span><span class="lz-nsub">Chọn chỉ mục, thứ tự join, mọi thứ quyết định "18 ms" là 18 mili giây hay 18 giây. Prisma không có chút ảnh hưởng nào ở đây.</span></div></div>
  </div>
</div>

<div class="pitfall">
<p><strong>Bẫy — client sinh ra đã cũ.</strong> Engine kiểm theo lược đồ <em>nhúng vào client lúc generate</em>, không phải theo cơ sở dữ liệu đang sống. Đổi lược đồ, chạy <code>migrate deploy</code>, quên <code>generate</code>, thế là bạn nhận những lỗi gọi tên các cột rành rành đang tồn tại ("<code>The column &#96;users.phone&#96; does not exist</code>" trong khi nó có). Cơ sở dữ liệu đúng; client mới là thứ lạc hậu. Trong CI, luôn chạy <code>generate</code> sau <code>migrate deploy</code> — và nhớ rằng móc postinstall chỉ cứu được bạn khi lược đồ vốn đã đúng ngay lúc cài.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/more/under-the-hood/engines" target="_blank" rel="noopener"><span class="lc-ico">🦀</span><span class="lc-body"><span class="lc-title">Prisma engines — under the hood</span><span class="lc-sub">prisma.io/docs · Các loại engine, mỗi nhị phân đi về đâu, và những biến môi trường ghi đè chúng</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/overview/databases/database-drivers" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">Driver adapters</span><span class="lc-sub">prisma.io/docs · Danh sách adapter theo từng cơ sở dữ liệu và những gì đổi khi bạn dùng chúng</span></span></a>
<a class="link-card" href="https://www.prisma.io/blog/prisma-orm-manifesto" target="_blank" rel="noopener"><span class="lc-ico">📣</span><span class="lc-body"><span class="lc-title">Tuyên ngôn Prisma ORM — bỏ engine Rust</span><span class="lc-sub">prisma.io/blog · Vì sao đội ngũ chuyển sang trình biên dịch truy vấn WASM, do chính họ kể</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương EXPLAIN</span><span class="lc-sub">Đọc cho đúng cái kế hoạch ở trên: cost, rows, loops, và nút nào mới là nút đang làm bạn đau</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Bắt một sự kiện truy vấn, dựng lại SQL đầy đủ kèm tham số, rồi chạy EXPLAIN lên nó</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — The `datasource` and `generator` blocks|||1.4 — Khối `datasource` và `generator`',
      slug: 'pr-1-4-datasource-generator',
      type: 'LESSON',
      description: 'Hai khối đứng đầu mọi lược đồ, mổ đủ từng tuỳ chọn: sáu provider, url với directUrl và shadowDatabaseUrl, relationMode và khi nào buộc phải đổi, binaryTargets, previewFeatures, output, nhiều generator cùng lúc, và prisma.config.ts của Prisma 7.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>The <code>datasource</code> and <code>generator</code> blocks</h2>
<p class="lead">Every Prisma schema opens with two blocks that most tutorials paste once and never mention again. They are worth ten minutes, because between them they control which database you talk to, how migrations find a scratch database, whether foreign keys exist at all, and which platform your engine is built for. Four of the settings in this lesson are ones people meet for the first time during an outage.</p>

<h3><code>datasource</code> — one per schema, no more</h3>
<pre><code>datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  directUrl         = env("DIRECT_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  relationMode      = "foreignKeys"
  extensions        = [pgvector(map: "vector"), pg_trgm]
  schemas           = ["public", "analytics"]
}</code></pre>
<p>The name (<code>db</code>) is yours and is almost never referenced — you will see it in error messages and nowhere else. Prisma allows exactly one <code>datasource</code> block; connecting to two databases means two Prisma clients with two schema files.</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>provider</code></span><span class="v">One of <code>postgresql</code>, <code>mysql</code>, <code>sqlite</code>, <code>sqlserver</code>, <code>mongodb</code>, <code>cockroachdb</code>. It changes which native types validate, which attributes exist, and the SQL that gets generated. It is not a runtime switch — changing it means reviewing the whole schema.</span></div>
  <div class="kv"><span class="k"><code>url</code></span><span class="v">Almost always <code>env("…")</code>. A literal string here is a credential committed to git, and Prisma will not stop you. It can also be a list for multi-provider setups, but that is rare and usually a mistake.</span></div>
  <div class="kv"><span class="k"><code>directUrl</code></span><span class="v"><strong>The one that saves serverless deploys.</strong> When <code>url</code> points at a connection pooler (PgBouncer, Supabase's 6543, Prisma Accelerate), migrations cannot run through it — poolers in transaction mode do not support the session-level statements DDL needs. <code>directUrl</code> is the un-pooled connection the CLI uses instead. Your app keeps using <code>url</code>.</span></div>
  <div class="kv"><span class="k"><code>shadowDatabaseUrl</code></span><span class="v">A second, disposable database that <code>migrate dev</code> creates, replays every migration into, and drops — its way of detecting drift and generating a correct diff. Set this when your development user cannot <code>CREATE DATABASE</code>, which is every hosted provider. Chapter 6 is largely about this database.</span></div>
  <div class="kv"><span class="k"><code>relationMode</code></span><span class="v"><code>"foreignKeys"</code> (default) or <code>"prisma"</code>. See below — this is the most consequential single line in the block.</span></div>
  <div class="kv"><span class="k"><code>extensions</code></span><span class="v">PostgreSQL only, and still behind <code>postgresqlExtensions</code> in some versions. Lets migrations manage <code>CREATE EXTENSION</code> for you — pgvector, pg_trgm, postgis. The CuongThai database uses pgvector for embeddings and pg_trgm for the fuzzy post search.</span></div>
  <div class="kv"><span class="k"><code>schemas</code></span><span class="v">Multi-schema support: several PostgreSQL namespaces in one database, with each model carrying <code>@@schema("…")</code>. Useful for separating <code>auth</code>, <code>billing</code> and <code>public</code> without separate databases.</span></div>
</div>

<h3><code>relationMode</code> — when foreign keys stop existing</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>relationMode = "foreignKeys"</code> — the default</span><span class="lz-lnote">Real <code>REFERENCES</code> constraints in the database. It rejects an orphan row even if your application has a bug, and <code>onDelete: Cascade</code> is executed by PostgreSQL itself. This is what you want, and what you should keep.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>relationMode = "prisma"</code> — emulated</span><span class="lz-lnote">No constraints at all. Prisma enforces relations in the query engine: extra <code>SELECT</code>s before writes, cascade deletes issued as separate statements. Required by PlanetScale and some Vitess or sharded setups that forbid foreign keys outright.</span></div>
</div>
<div class="callout warn">
<p><strong>What emulation actually costs.</strong> Three things, and none of them are obvious. <strong>Correctness:</strong> anything writing to the database outside Prisma — a psql session, an admin tool, a Python job — can create orphans freely, and nothing notices. <strong>Speed:</strong> every write that touches a relation gains a read first, so a nested create goes from one statement to several. <strong>Indexes:</strong> the database no longer auto-indexes foreign keys, so <em>every</em> relation scalar needs an explicit <code>@@index</code> or your joins turn into sequential scans. Use it only when your database genuinely forbids constraints.</p>
</div>

<h3><code>generator</code> — one or many</h3>
<pre><code>generator client {
  provider        = "prisma-client-js"
  output          = "../src/generated/prisma"
  binaryTargets   = ["native", "linux-musl-openssl-3.0.x"]
  previewFeatures = ["relationJoins", "typedSql", "postgresqlExtensions"]
  engineType      = "library"
}

<span class="tok-comment">// A second generator: an ER diagram, regenerated on every schema change</span>
generator erd {
  provider = "prisma-erd-generator"
  output   = "../docs/erd.svg"
}</code></pre>
<p>Unlike <code>datasource</code>, you may declare as many generators as you like, and <code>prisma generate</code> runs all of them. That is how a schema can simultaneously produce a client, a diagram, Zod validators and a GraphQL schema from one source.</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>provider</code></span><span class="v"><code>prisma-client-js</code> is the standard client. <code>prisma-client</code> (Prisma 6+) is the newer ESM-first generator that requires an explicit <code>output</code>. Community generators — <code>zod-prisma-types</code>, <code>prisma-erd-generator</code>, <code>prisma-json-types-generator</code> — plug in here.</span></div>
  <div class="kv"><span class="k"><code>output</code></span><span class="v">Where the code goes. Relative to the schema file, not the project root — a distinction that costs everyone one confused afternoon. Outside <code>node_modules</code> you must gitignore it and add <code>prisma generate</code> to your build.</span></div>
  <div class="kv"><span class="k"><code>binaryTargets</code></span><span class="v">Which platforms to download engines for. <code>"native"</code> means "wherever generate is running". <strong>Add every platform your code will run on</strong> — Alpine images need <code>linux-musl-openssl-3.0.x</code>, AWS Lambda needs <code>rhel-openssl-3.0.x</code>, Apple Silicon developers building for Debian containers need both.</span></div>
  <div class="kv"><span class="k"><code>previewFeatures</code></span><span class="v">Opt-in to unstable features. They can change or vanish between minor versions, so treat the list as something you review at every upgrade rather than set and forget.</span></div>
  <div class="kv"><span class="k"><code>engineType</code></span><span class="v"><code>"library"</code> (default, Node-API), <code>"binary"</code> (separate process), or <code>"client"</code> (WASM query compiler, no engine binary). Lesson 1.3 covers what each means in practice.</span></div>
</div>
<pre><code><span class="tok-comment"># Proof that binaryTargets does what it says</span>
ls node_modules/.prisma/client/*.node</code></pre>
<div class="out">node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node
node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node</div>
<div class="pitfall">
<p><strong>Trap — <code>"native"</code> alone in a multi-stage Dockerfile.</strong> You generate on a Debian builder, copy <code>node_modules</code> into an Alpine runtime, and the engine you shipped is glibc while the image is musl. The container starts, the first query throws <code>Unable to require(...libquery_engine-debian-openssl-3.0.x.so.node)</code>, and the process restarts forever. This is exactly the CuongThai 502 from Lesson 1.3. The fix is one line — list both targets — and Chapter 11 shows the pre-push check that makes forgetting it impossible.</p>
</div>

<h3>Preview features worth knowing about</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">relationJoins</span><span class="lz-t">One query instead of several</span><span class="lz-d">Unlocks <code>relationLoadStrategy: "join"</code>, which resolves <code>include</code> with a single <code>LATERAL</code> join. Sometimes much faster, sometimes slower — Chapter 9 measures both directions.</span></div>
  <div class="lz-step"><span class="lz-k">typedSql</span><span class="lz-t">Raw SQL that is type-checked</span><span class="lz-d">Write <code>.sql</code> files in <code>prisma/sql/</code>; Prisma reads them at generate time and produces typed functions. Turns <code>$queryRaw</code> from an escape hatch into a first-class tool — Chapter 10.</span></div>
  <div class="lz-step"><span class="lz-k">postgresqlExtensions</span><span class="lz-t">Extensions in migrations</span><span class="lz-d">Lets <code>migrate</code> manage <code>CREATE EXTENSION</code>. Without it, pgvector and pg_trgm have to be installed by a hand-written migration — which is what the CuongThai repo does.</span></div>
  <div class="lz-step"><span class="lz-k">views</span><span class="lz-t">Database views as models</span><span class="lz-d">Read-only models backed by a SQL view. The definition still lives outside Prisma; the model is only the typed read side of it.</span></div>
</div>

<h3>Where this is heading: <code>prisma.config.ts</code></h3>
<p>Prisma 7 moves configuration out of the schema into a TypeScript file, which finally allows logic — reading a secret, choosing a URL per environment, registering an adapter:</p>
<pre><code><span class="tok-comment">// prisma.config.ts — Prisma 7</span>
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: { path: './prisma/migrations', seed: 'tsx prisma/seed.ts' },
  datasource: { url: process.env.DATABASE_URL },
});</code></pre>
<div class="callout ok">
<p><strong>Version reality check.</strong> This course teaches Prisma 6, which is what most production codebases run — the CuongThai backend itself is on 5.22 and pinned. Prisma 7 mainly relocates configuration and makes the WASM engine the default; the schema language, the client API and everything in Chapters 2–10 are unchanged. Where a difference matters, this course says so at that point rather than making you track two versions in your head.</p>
</div>

<h3>Splitting a schema that got too big</h3>
<p>Since Prisma 5.15, <code>schema.prisma</code> can be a folder. The CuongThai schema is 3,847 lines in one file; past a certain size, this is the fix:</p>
<pre><code>prisma/
  schema/
    schema.prisma      <span class="tok-comment"># datasource + generator only</span>
    user.prisma        <span class="tok-comment"># User, Role, Session</span>
    content.prisma     <span class="tok-comment"># Post, Comment, ContentType</span>
    billing.prisma     <span class="tok-comment"># Invoice, Payment</span></code></pre>
<pre><code>npx prisma validate</code></pre>
<div class="out">Prisma schema loaded from prisma/schema
The schema at prisma/schema is valid 🚀</div>
<p>Models in one file reference models in another with no import statement — the folder is concatenated before parsing. The only rules are that exactly one file holds the <code>datasource</code> and <code>generator</code> blocks, and that model names stay globally unique.</p>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Prisma schema reference</span><span class="lc-sub">prisma.io/docs · Every field of both blocks, per provider. The page to keep open while writing a schema</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/relation-mode" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Relation mode</span><span class="lc-sub">prisma.io/docs · Emulated relations in full, including the index requirements nobody expects</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/preview-features/client-preview-features" target="_blank" rel="noopener"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Preview features — current list</span><span class="lc-sub">prisma.io/docs · What is in preview right now, what graduated, what was dropped</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/overview/location" target="_blank" rel="noopener"><span class="lc-ico">📂</span><span class="lc-body"><span class="lc-title">Schema location and multi-file schemas</span><span class="lc-sub">prisma.io/docs · Splitting into a folder, and the rules that still apply once you do</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Given a deployment description, write the datasource and generator blocks that will not break in production</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Khối <code>datasource</code> và <code>generator</code></h2>
<p class="lead">Mọi lược đồ Prisma đều mở đầu bằng hai khối mà phần lớn hướng dẫn dán một lần rồi không nhắc lại. Chúng đáng mười phút, vì gộp lại chúng quyết định bạn nói chuyện với cơ sở dữ liệu nào, migration tìm cơ sở dữ liệu nháp ở đâu, khoá ngoại có tồn tại hay không, và engine của bạn được dựng cho nền tảng nào. Bốn thiết lập trong bài này là những thứ người ta gặp lần đầu ngay giữa một sự cố.</p>

<h3><code>datasource</code> — mỗi lược đồ đúng một khối</h3>
<pre><code>datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  directUrl         = env("DIRECT_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  relationMode      = "foreignKeys"
  extensions        = [pgvector(map: "vector"), pg_trgm]
  schemas           = ["public", "analytics"]
}</code></pre>
<p>Cái tên (<code>db</code>) là của bạn và gần như không bao giờ được nhắc tới — bạn chỉ thấy nó trong thông báo lỗi, không thấy ở đâu khác. Prisma cho phép đúng một khối <code>datasource</code>; nối tới hai cơ sở dữ liệu nghĩa là hai Prisma client với hai tệp lược đồ.</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>provider</code></span><span class="v">Một trong <code>postgresql</code>, <code>mysql</code>, <code>sqlite</code>, <code>sqlserver</code>, <code>mongodb</code>, <code>cockroachdb</code>. Nó đổi cả tập native type được chấp nhận, các thuộc tính tồn tại, và SQL sinh ra. Nó không phải công tắc lúc chạy — đổi nó nghĩa là soát lại toàn bộ lược đồ.</span></div>
  <div class="kv"><span class="k"><code>url</code></span><span class="v">Hầu như luôn là <code>env("…")</code>. Một chuỗi viết thẳng ở đây là một thông tin đăng nhập bị commit vào git, và Prisma sẽ không ngăn bạn. Nó cũng nhận được một danh sách cho cấu hình nhiều provider, nhưng hiếm và thường là sai lầm.</span></div>
  <div class="kv"><span class="k"><code>directUrl</code></span><span class="v"><strong>Cái cứu các bản deploy serverless.</strong> Khi <code>url</code> trỏ vào một bộ gom kết nối (PgBouncer, cổng 6543 của Supabase, Prisma Accelerate) thì migration không chạy qua đó được — bộ gom ở chế độ transaction không hỗ trợ các câu lệnh mức phiên mà DDL cần. <code>directUrl</code> là kết nối không qua gom để CLI dùng thay. Ứng dụng của bạn vẫn dùng <code>url</code>.</span></div>
  <div class="kv"><span class="k"><code>shadowDatabaseUrl</code></span><span class="v">Một cơ sở dữ liệu thứ hai dùng rồi bỏ mà <code>migrate dev</code> tạo ra, phát lại mọi migration vào đó, rồi xoá — đó là cách nó phát hiện trôi dạt và sinh ra bản chênh lệch đúng. Hãy đặt nó khi người dùng phát triển của bạn không có quyền <code>CREATE DATABASE</code>, tức là ở mọi nhà cung cấp thuê. Chương 6 nói phần lớn về cơ sở dữ liệu này.</span></div>
  <div class="kv"><span class="k"><code>relationMode</code></span><span class="v"><code>"foreignKeys"</code> (mặc định) hoặc <code>"prisma"</code>. Xem bên dưới — đây là dòng nhiều hệ quả nhất trong cả khối.</span></div>
  <div class="kv"><span class="k"><code>extensions</code></span><span class="v">Chỉ PostgreSQL, và ở một số phiên bản vẫn nằm sau cờ <code>postgresqlExtensions</code>. Cho phép migration quản lý <code>CREATE EXTENSION</code> hộ bạn — pgvector, pg_trgm, postgis. Cơ sở dữ liệu của CuongThai dùng pgvector cho embedding và pg_trgm cho phần tìm bài viết gần đúng.</span></div>
  <div class="kv"><span class="k"><code>schemas</code></span><span class="v">Hỗ trợ nhiều schema: vài không gian tên PostgreSQL trong một cơ sở dữ liệu, mỗi model mang thêm <code>@@schema("…")</code>. Hữu ích để tách <code>auth</code>, <code>billing</code> và <code>public</code> mà không cần nhiều cơ sở dữ liệu.</span></div>
</div>

<h3><code>relationMode</code> — khi khoá ngoại thôi tồn tại</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>relationMode = "foreignKeys"</code> — mặc định</span><span class="lz-lnote">Ràng buộc <code>REFERENCES</code> thật dưới cơ sở dữ liệu. Nó từ chối một hàng mồ côi ngay cả khi ứng dụng của bạn có lỗi, và <code>onDelete: Cascade</code> do chính PostgreSQL thi hành. Đây là thứ bạn muốn, và là thứ bạn nên giữ.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>relationMode = "prisma"</code> — mô phỏng</span><span class="lz-lnote">Không có ràng buộc nào cả. Prisma tự thi hành quan hệ trong query engine: thêm các câu <code>SELECT</code> trước khi ghi, xoá dây chuyền phát ra thành từng câu lệnh riêng. Bắt buộc với PlanetScale và một số cấu hình Vitess hay phân mảnh vốn cấm hẳn khoá ngoại.</span></div>
</div>
<div class="callout warn">
<p><strong>Mô phỏng thật sự tốn gì.</strong> Ba thứ, và không thứ nào hiển nhiên. <strong>Tính đúng:</strong> bất cứ thứ gì ghi vào cơ sở dữ liệu mà không qua Prisma — một phiên psql, một công cụ quản trị, một job Python — đều tạo được hàng mồ côi thoải mái, và không ai nhận ra. <strong>Tốc độ:</strong> mọi lần ghi chạm tới quan hệ đều mọc thêm một lần đọc trước, nên một create lồng nhau đi từ một câu lệnh thành vài câu. <strong>Chỉ mục:</strong> cơ sở dữ liệu không còn tự đánh chỉ mục cho khoá ngoại nữa, nên <em>mọi</em> trường vô hướng của quan hệ đều cần một <code>@@index</code> tường minh, không thì join của bạn thành quét tuần tự. Chỉ dùng nó khi cơ sở dữ liệu của bạn thật sự cấm ràng buộc.</p>
</div>

<h3><code>generator</code> — một hoặc nhiều</h3>
<pre><code>generator client {
  provider        = "prisma-client-js"
  output          = "../src/generated/prisma"
  binaryTargets   = ["native", "linux-musl-openssl-3.0.x"]
  previewFeatures = ["relationJoins", "typedSql", "postgresqlExtensions"]
  engineType      = "library"
}

<span class="tok-comment">// Một generator thứ hai: sơ đồ ER, sinh lại mỗi lần lược đồ đổi</span>
generator erd {
  provider = "prisma-erd-generator"
  output   = "../docs/erd.svg"
}</code></pre>
<p>Khác <code>datasource</code>, bạn khai bao nhiêu generator cũng được, và <code>prisma generate</code> chạy hết. Nhờ vậy một lược đồ có thể đồng thời đẻ ra một client, một sơ đồ, các validator Zod và một lược đồ GraphQL từ cùng một nguồn.</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>provider</code></span><span class="v"><code>prisma-client-js</code> là client tiêu chuẩn. <code>prisma-client</code> (Prisma 6+) là bộ sinh mới hơn, ưu tiên ESM, và bắt buộc phải có <code>output</code>. Các generator cộng đồng — <code>zod-prisma-types</code>, <code>prisma-erd-generator</code>, <code>prisma-json-types-generator</code> — cắm vào đây.</span></div>
  <div class="kv"><span class="k"><code>output</code></span><span class="v">Mã đi về đâu. Tính tương đối so với tệp lược đồ, không phải gốc dự án — một khác biệt khiến ai cũng mất đúng một buổi chiều bối rối. Ra ngoài <code>node_modules</code> thì bạn phải gitignore nó và thêm <code>prisma generate</code> vào bản build.</span></div>
  <div class="kv"><span class="k"><code>binaryTargets</code></span><span class="v">Tải engine cho những nền tảng nào. <code>"native"</code> nghĩa là "nơi generate đang chạy". <strong>Hãy liệt kê mọi nền tảng mã của bạn sẽ chạy trên đó</strong> — ảnh Alpine cần <code>linux-musl-openssl-3.0.x</code>, AWS Lambda cần <code>rhel-openssl-3.0.x</code>, người dùng Apple Silicon dựng cho container Debian cần cả hai.</span></div>
  <div class="kv"><span class="k"><code>previewFeatures</code></span><span class="v">Bật các tính năng chưa ổn định. Chúng có thể đổi hoặc biến mất giữa các bản minor, nên hãy coi danh sách này là thứ cần soát lại ở mỗi lần nâng cấp chứ không phải đặt xong rồi quên.</span></div>
  <div class="kv"><span class="k"><code>engineType</code></span><span class="v"><code>"library"</code> (mặc định, Node-API), <code>"binary"</code> (tiến trình riêng), hoặc <code>"client"</code> (trình biên dịch truy vấn WASM, không có nhị phân engine). Bài 1.3 nói mỗi cái nghĩa là gì trên thực tế.</span></div>
</div>
<pre><code><span class="tok-comment"># Bằng chứng binaryTargets làm đúng thứ nó nói</span>
ls node_modules/.prisma/client/*.node</code></pre>
<div class="out">node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node
node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node</div>
<div class="pitfall">
<p><strong>Bẫy — chỉ để mỗi <code>"native"</code> trong một Dockerfile nhiều tầng.</strong> Bạn generate trên tầng builder Debian, chép <code>node_modules</code> sang runtime Alpine, và engine bạn vừa đóng gói là glibc trong khi ảnh là musl. Container khởi động, câu truy vấn đầu tiên ném <code>Unable to require(...libquery_engine-debian-openssl-3.0.x.so.node)</code>, và tiến trình restart mãi mãi. Đây đúng là cú 502 của CuongThai ở Bài 1.3. Cách vá là một dòng — liệt kê cả hai target — và Chương 11 chỉ chốt kiểm trước khi đẩy khiến việc quên nó thành bất khả.</p>
</div>

<h3>Những tính năng preview đáng biết</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">relationJoins</span><span class="lz-t">Một câu thay vì nhiều câu</span><span class="lz-d">Mở khoá <code>relationLoadStrategy: "join"</code>, giải quyết <code>include</code> bằng một câu <code>LATERAL</code> join duy nhất. Có lúc nhanh hơn hẳn, có lúc chậm hơn — Chương 9 đo cả hai chiều.</span></div>
  <div class="lz-step"><span class="lz-k">typedSql</span><span class="lz-t">SQL thô mà vẫn được kiểm kiểu</span><span class="lz-d">Viết các tệp <code>.sql</code> trong <code>prisma/sql/</code>; Prisma đọc chúng lúc generate và sinh ra các hàm có kiểu. Biến <code>$queryRaw</code> từ một cửa thoát hiểm thành một công cụ hạng nhất — Chương 10.</span></div>
  <div class="lz-step"><span class="lz-k">postgresqlExtensions</span><span class="lz-t">Extension nằm trong migration</span><span class="lz-d">Cho <code>migrate</code> quản lý <code>CREATE EXTENSION</code>. Không có nó thì pgvector và pg_trgm phải cài bằng một migration viết tay — và đó đúng là cách kho mã CuongThai làm.</span></div>
  <div class="lz-step"><span class="lz-k">views</span><span class="lz-t">View của cơ sở dữ liệu thành model</span><span class="lz-d">Model chỉ đọc, dựa trên một view SQL. Định nghĩa view vẫn sống ngoài Prisma; model chỉ là phía đọc có kiểu của nó.</span></div>
</div>

<h3>Hướng đi tiếp: <code>prisma.config.ts</code></h3>
<p>Prisma 7 dời phần cấu hình ra khỏi lược đồ, vào một tệp TypeScript, và nhờ vậy cuối cùng cũng viết được logic — đọc một bí mật, chọn URL theo môi trường, đăng ký một adapter:</p>
<pre><code><span class="tok-comment">// prisma.config.ts — Prisma 7</span>
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: { path: './prisma/migrations', seed: 'tsx prisma/seed.ts' },
  datasource: { url: process.env.DATABASE_URL },
});</code></pre>
<div class="callout ok">
<p><strong>Đối chiếu phiên bản cho tỉnh táo.</strong> Khoá này dạy Prisma 6, tức thứ phần lớn kho mã production đang chạy — bản thân backend CuongThai đang ở 5.22 và đã ghim. Prisma 7 chủ yếu dời chỗ cấu hình và lấy engine WASM làm mặc định; ngôn ngữ lược đồ, API của Client và mọi thứ ở Chương 2–10 không đổi. Chỗ nào khác biệt có ảnh hưởng, khoá này nói ngay tại chỗ đó thay vì bắt bạn ôm hai phiên bản trong đầu.</p>
</div>

<h3>Chẻ một lược đồ đã quá to</h3>
<p>Từ Prisma 5.15, <code>schema.prisma</code> có thể là một thư mục. Lược đồ của CuongThai dài 3.847 dòng trong một tệp; qua một ngưỡng nhất định, đây là cách vá:</p>
<pre><code>prisma/
  schema/
    schema.prisma      <span class="tok-comment"># chỉ datasource + generator</span>
    user.prisma        <span class="tok-comment"># User, Role, Session</span>
    content.prisma     <span class="tok-comment"># Post, Comment, ContentType</span>
    billing.prisma     <span class="tok-comment"># Invoice, Payment</span></code></pre>
<pre><code>npx prisma validate</code></pre>
<div class="out">Prisma schema loaded from prisma/schema
The schema at prisma/schema is valid 🚀</div>
<p>Model ở tệp này tham chiếu model ở tệp kia mà không cần câu lệnh import nào — cả thư mục được nối lại trước khi phân tích. Luật duy nhất là đúng một tệp giữ khối <code>datasource</code> và <code>generator</code>, và tên model phải duy nhất trên toàn cục.</p>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title">Prisma schema reference</span><span class="lc-sub">prisma.io/docs · Mọi trường của cả hai khối, theo từng provider. Trang nên mở sẵn khi viết lược đồ</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/relation-mode" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Relation mode</span><span class="lc-sub">prisma.io/docs · Quan hệ mô phỏng nói đủ, kể cả yêu cầu chỉ mục mà không ai lường trước</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/preview-features/client-preview-features" target="_blank" rel="noopener"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Preview features — danh sách hiện tại</span><span class="lc-sub">prisma.io/docs · Cái gì đang ở preview, cái gì đã ổn định, cái gì đã bị bỏ</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/overview/location" target="_blank" rel="noopener"><span class="lc-ico">📂</span><span class="lc-body"><span class="lc-title">Vị trí lược đồ và lược đồ nhiều tệp</span><span class="lc-sub">prisma.io/docs · Chẻ ra thành thư mục, và những luật vẫn còn hiệu lực sau khi chẻ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Cho trước một bản mô tả triển khai, hãy viết khối datasource và generator không vỡ trên production</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Three workflows: push, migrate, pull|||1.5 — Ba luồng làm việc: push, migrate, pull',
      slug: 'pr-1-5-ba-luong',
      type: 'LESSON',
      description: 'db push để làm nhanh và mất dữ liệu, migrate để có lịch sử review được, db pull để tiếp quản cơ sở dữ liệu có sẵn — mỗi luồng chạy thật, mỗi luồng đúng ở đâu, và ba cách trộn chúng lại làm hỏng production.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Three workflows: push, migrate, pull</h2>
<p class="lead">Prisma offers three ways to make the schema and the database agree, and they answer three different questions. Choosing the wrong one is the most common structural mistake in a Prisma codebase, and unlike a bad query it does not show up as a slow page — it shows up as a database nobody can reproduce.</p>

<h3>The three, at a glance</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Schema is the source</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle"><code>db push</code></span><span class="lz-nsub">Make the database look like the schema, right now, by any means. No history, no record, no review. Fast and destructive.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle"><code>migrate dev</code> / <code>deploy</code></span><span class="lz-nsub">Compute the SQL difference, write it to a file, apply it, remember that it ran. Slower, reviewable, replayable — the only one fit for production.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Database is the source</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle"><code>db pull</code></span><span class="lz-nsub">Read the live database and rewrite the schema to match it. How you adopt Prisma into something that already exists — and how you recover after someone changed the database by hand.</span></div></div>
  </div>
</div>

<h3>Workflow 1 — <code>db push</code>: fast, and it will eat your data</h3>
<pre><code><span class="tok-comment"># Add a required column to a table that already has rows</span>
npx prisma db push</code></pre>
<div class="out">Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "hocprisma", schema "public" at "localhost:5432"

⚠️  There might be data loss when applying the changes:

  • Added the required column &#96;slug&#96; to the &#96;posts&#96; table without a default value. There are 2 rows in this table, it is not possible to execute this step.

? Do you want to continue? All existing data will be lost. › (y/N)</div>
<p>Read the prompt exactly. It does not say "this column will be empty". It says <strong>all existing data will be lost</strong> — because <code>db push</code>'s answer to an impossible migration is to drop and recreate the table. Answer <code>y</code> in development and you lose two rows of test data; answer <code>y</code> against the wrong <code>DATABASE_URL</code> and you have a very bad afternoon.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">What it is genuinely good for</span><span class="v">Prototyping, where the schema changes ten times an hour and the data is disposable. Also ephemeral test databases in CI, where you want the current schema in one second without replaying 118 migrations.</span></div>
  <div class="kv"><span class="k">What it leaves behind</span><span class="v">Nothing. No file, no row in <code>_prisma_migrations</code>, no evidence. Your teammate pulls your branch, runs <code>migrate dev</code>, and Prisma reports drift it cannot explain — because your change exists only in your local database.</span></div>
  <div class="kv"><span class="k">The forbidden use</span><span class="v">Production. The CuongThai repository lists <code>prisma db push</code> against production among its explicitly forbidden actions, for exactly this reason: it bypasses migration history, so the next real migration computes its diff from a state that no file describes.</span></div>
</div>

<h3>Workflow 2 — <code>migrate</code>: the one that goes to production</h3>
<pre><code>npx prisma migrate dev --name them_slug</code></pre>
<div class="out">Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "hocprisma", schema "public" at "localhost:5432"

⚠️  Warnings for the current datasource:

  • Added the required column &#96;slug&#96; to the &#96;posts&#96; table without a default value. There are 2 rows in this table, it is not possible to execute this step.

? Are you sure you want to create and apply this migration? › (y/N)</div>
<p>Same problem, different outcome: <code>migrate dev</code> writes the SQL to a file you can open and fix <em>before</em> it runs. That is the whole difference, and it is the entire reason to prefer it:</p>
<pre><code><span class="tok-comment">-- prisma/migrations/20260823051140_them_slug/migration.sql</span>
<span class="tok-comment">-- Generated by Prisma; then edited by a human, which is the point</span>

<span class="tok-comment">-- 1. Add it nullable, so existing rows survive</span>
ALTER TABLE "posts" ADD COLUMN "slug" TEXT;

<span class="tok-comment">-- 2. Backfill from data that already exists</span>
UPDATE "posts" SET "slug" = 'bai-' || "id" WHERE "slug" IS NULL;

<span class="tok-comment">-- 3. Now the constraint can be satisfied</span>
ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">migrate dev</span><span class="lz-t">Development only</span><span class="lz-d">Creates the migration by diffing against a shadow database, applies it, regenerates the client, and re-runs the seed. Never point it at production — it can reset.</span></div>
  <div class="lz-step"><span class="lz-k">migrate deploy</span><span class="lz-t">Production</span><span class="lz-d">Applies pending migrations and nothing else. Creates no files, needs no shadow database, never prompts, never resets. This is the command in your deploy pipeline.</span></div>
  <div class="lz-step"><span class="lz-k">migrate status</span><span class="lz-t">Diagnosis</span><span class="lz-d">What is applied, what is pending, what failed. The first thing to run when a deploy misbehaves, and safe on any database.</span></div>
  <div class="lz-step"><span class="lz-k">migrate diff</span><span class="lz-t">The power tool</span><span class="lz-d">Prints the SQL between any two states — schema versus database, migrations versus database. The basis of drift detection and of hand-writing a migration, both in Chapter 6.</span></div>
</div>
<pre><code><span class="tok-comment"># The one command that answers "is my database what my schema says?"</span>
npx prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma \\
  --script</code></pre>
<div class="out">-- This is an empty migration.</div>
<p>Empty output means no drift. Any SQL in that output is a difference between the live database and your schema file, and Chapter 6 goes through what each kind means.</p>

<div class="note-ct">
<p><strong>From the CuongThai codebase — when <code>migrate dev</code> is the broken one.</strong> In this repository <code>npx prisma migrate dev</code> cannot run at all. Migration <code>20260706130000_add_music_and_profile</code> creates a UNIQUE constraint named <code>post_music_post_id_key</code> and then a plain index <em>with the same name</em>. PostgreSQL accepted it once; it can never be replayed onto a fresh shadow database, so every <code>migrate dev</code> dies with <code>P3006</code>.</p>
<p>The migration is already deployed, and the repository's rules forbid editing a deployed migration — so the fix is not to fix it. New migrations here are <strong>hand-written</strong> as <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> and applied with <code>migrate deploy</code>, which needs no shadow database. The <code>migrate diff</code> command above is how you verify the result is correct. This is a genuinely common situation in older codebases, and Chapter 6 teaches the hand-written path as a first-class skill rather than a workaround.</p>
</div>

<h3>Workflow 3 — <code>db pull</code>: adopting what exists</h3>
<pre><code>npx prisma db pull --print | head -30</code></pre>
<div class="out">model posts {
  id         Int       @id @default(autoincrement())
  title      String
  body       String?
  published  Boolean   @default(false)
  views      Int       @default(0)
  created_at DateTime  @default(now())
  author_id  Int
  users      users     @relation(fields: [author_id], references: [id], onDelete: Cascade)

  @@index([author_id])
}</div>
<p>Functional, and clearly machine-written: table names not model names, <code>created_at</code> not <code>createdAt</code>, and a relation field called <code>users</code>. Introspection cannot invent your naming conventions — but it does <strong>preserve</strong> them once you set them:</p>
<pre><code><span class="tok-comment">// You rename by hand, adding @map / @@map</span>
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now()) @map("created_at")
  authorId  Int      @map("author_id")
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("posts")
}</code></pre>
<pre><code><span class="tok-comment"># Pull again — your names survive, and only real changes appear</span>
npx prisma db pull</code></pre>
<div class="out">✔ Introspected 2 models and wrote them into prisma/schema.prisma in 128ms

*** WARNING ***

These models were enriched with &#96;@@map&#96; information taken from the previous Prisma schema:
  - "Post"
  - "User"</div>
<div class="pitfall">
<p><strong>Trap — what introspection cannot see.</strong> It reads only what the database encodes. A relation with no foreign key constraint (common in legacy MySQL, and universal under <code>relationMode = "prisma"</code>) becomes two unrelated <code>Int</code> fields, and you must write the <code>@relation</code> yourself. Check constraints, triggers, row-level security policies, partial indexes and stored procedures do not appear at all — they keep working in the database, and Prisma simply does not know about them. Chapter 10 covers keeping such objects alive across migrations.</p>
</div>

<h3>Choosing, in one table</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Prototyping alone, disposable data</span><span class="v"><code>db push</code>. Switch to <code>migrate</code> the moment a second person or a second environment appears.</span></div>
  <div class="kv"><span class="k">A team, or anything deployed</span><span class="v"><code>migrate dev</code> locally, <code>migrate deploy</code> in the pipeline. Migrations get reviewed in the pull request like code, because they are code.</span></div>
  <div class="kv"><span class="k">A CI test database</span><span class="v"><code>db push</code> is legitimate here — it is faster than replaying history and the database is destroyed after the run. Never in the pipeline stage that touches a real environment.</span></div>
  <div class="kv"><span class="k">An existing database, first adoption</span><span class="v"><code>db pull</code>, then rename, then baseline: generate the initial migration with <code>migrate diff</code> and mark it applied with <code>migrate resolve --applied</code>. Chapter 6 walks the whole sequence.</span></div>
  <div class="kv"><span class="k">Someone changed production by hand</span><span class="v"><code>migrate diff</code> to see what they did, then <code>db pull</code> onto a branch to capture it, then a real migration to make it official. Never <code>db push</code> to "fix" it.</span></div>
</div>

<div class="callout warn">
<p><strong>The three ways teams break this.</strong> <strong>One:</strong> using <code>db push</code> locally and <code>migrate deploy</code> in CI — production then receives migrations nobody has ever run, because the developer's database was built by push. <strong>Two:</strong> editing a migration that has already been applied somewhere, so the checksum no longer matches and every later deploy fails on <code>P3009</code>. <strong>Three:</strong> deleting a migration folder to "clean up", which removes the history the diff is computed from. All three are in the CuongThai forbidden-actions list, and all three were learned the same way.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Prototyping with <code>db push</code></span><span class="lc-sub">prisma.io/docs · The official position on when push is appropriate and when it is not</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model" target="_blank" rel="noopener"><span class="lc-ico">🧠</span><span class="lc-body"><span class="lc-title">Prisma Migrate — mental model</span><span class="lc-sub">prisma.io/docs · The single best page in the docs on how migrations actually work. Read it before Chapter 6</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/getting-started" target="_blank" rel="noopener"><span class="lc-ico">🚚</span><span class="lc-body"><span class="lc-title">Migrate — dev versus deploy</span><span class="lc-sub">prisma.io/docs · Which command belongs in which environment, and what each one is allowed to do</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/getting-started#adding-prisma-migrate-to-an-existing-project" target="_blank" rel="noopener"><span class="lc-ico">🏗️</span><span class="lc-body"><span class="lc-title">Baselining an existing database</span><span class="lc-sub">prisma.io/docs · The exact sequence for adopting Migrate into a database that already has tables</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Given five scenarios, pick the workflow — then explain what the wrong choice would have cost</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Ba luồng làm việc: push, migrate, pull</h2>
<p class="lead">Prisma có ba cách để lược đồ và cơ sở dữ liệu đồng ý với nhau, và chúng trả lời ba câu hỏi khác nhau. Chọn nhầm là sai lầm cấu trúc phổ biến nhất trong một kho mã Prisma, và khác một câu truy vấn tồi, nó không hiện ra thành một trang chậm — nó hiện ra thành một cơ sở dữ liệu không ai dựng lại được.</p>

<h3>Ba luồng, nhìn một lượt</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Lược đồ là nguồn</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle"><code>db push</code></span><span class="lz-nsub">Làm cho cơ sở dữ liệu giống lược đồ, ngay bây giờ, bằng mọi giá. Không lịch sử, không ghi chép, không review. Nhanh và huỷ diệt.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle"><code>migrate dev</code> / <code>deploy</code></span><span class="lz-nsub">Tính ra phần SQL chênh lệch, ghi vào một tệp, áp dụng nó, và nhớ rằng nó đã chạy. Chậm hơn, review được, phát lại được — thứ duy nhất dùng được cho production.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cơ sở dữ liệu là nguồn</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle"><code>db pull</code></span><span class="lz-nsub">Đọc cơ sở dữ liệu đang sống rồi viết lại lược đồ cho khớp. Cách bạn đưa Prisma vào một thứ đã tồn tại — và cách bạn cứu vãn sau khi ai đó sửa cơ sở dữ liệu bằng tay.</span></div></div>
  </div>
</div>

<h3>Luồng 1 — <code>db push</code>: nhanh, và nó sẽ ăn mất dữ liệu của bạn</h3>
<pre><code><span class="tok-comment"># Thêm một cột bắt buộc vào bảng vốn đã có hàng</span>
npx prisma db push</code></pre>
<div class="out">Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "hocprisma", schema "public" at "localhost:5432"

⚠️  There might be data loss when applying the changes:

  • Added the required column &#96;slug&#96; to the &#96;posts&#96; table without a default value. There are 2 rows in this table, it is not possible to execute this step.

? Do you want to continue? All existing data will be lost. › (y/N)</div>
<p>Đọc kỹ đúng câu hỏi đó. Nó không nói "cột này sẽ trống". Nó nói <strong>toàn bộ dữ liệu hiện có sẽ mất</strong> — vì câu trả lời của <code>db push</code> cho một migration bất khả thi là xoá bảng rồi dựng lại. Gõ <code>y</code> ở môi trường phát triển thì bạn mất hai hàng dữ liệu thử; gõ <code>y</code> khi <code>DATABASE_URL</code> đang trỏ nhầm chỗ thì bạn có một buổi chiều rất tệ.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó thật sự tốt cho việc gì</span><span class="v">Làm nguyên mẫu, khi lược đồ đổi mười lần một giờ và dữ liệu thì vứt đi được. Cũng tốt cho cơ sở dữ liệu thử tạm trong CI, khi bạn muốn có lược đồ hiện tại trong một giây thay vì phát lại 118 migration.</span></div>
  <div class="kv"><span class="k">Nó để lại gì</span><span class="v">Không gì cả. Không tệp, không hàng nào trong <code>_prisma_migrations</code>, không dấu vết. Đồng đội kéo nhánh của bạn về, chạy <code>migrate dev</code>, và Prisma báo có trôi dạt mà nó không giải thích nổi — vì thay đổi của bạn chỉ tồn tại trong cơ sở dữ liệu trên máy bạn.</span></div>
  <div class="kv"><span class="k">Chỗ cấm dùng</span><span class="v">Production. Kho mã CuongThai liệt kê <code>prisma db push</code> lên production vào nhóm hành động bị cấm tường minh, đúng vì lý do này: nó đi vòng qua lịch sử migration, nên migration thật kế tiếp sẽ tính chênh lệch từ một trạng thái không tệp nào mô tả.</span></div>
</div>

<h3>Luồng 2 — <code>migrate</code>: luồng đi lên production</h3>
<pre><code>npx prisma migrate dev --name them_slug</code></pre>
<div class="out">Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "hocprisma", schema "public" at "localhost:5432"

⚠️  Warnings for the current datasource:

  • Added the required column &#96;slug&#96; to the &#96;posts&#96; table without a default value. There are 2 rows in this table, it is not possible to execute this step.

? Are you sure you want to create and apply this migration? › (y/N)</div>
<p>Cùng vấn đề, khác kết cục: <code>migrate dev</code> ghi phần SQL ra một tệp mà bạn mở lên và sửa được <em>trước khi</em> nó chạy. Đó là toàn bộ khác biệt, và cũng là toàn bộ lý do để ưu tiên nó:</p>
<pre><code><span class="tok-comment">-- prisma/migrations/20260823051140_them_slug/migration.sql</span>
<span class="tok-comment">-- Prisma sinh ra; rồi người sửa lại, và đó mới là điểm mấu chốt</span>

<span class="tok-comment">-- 1. Thêm ở dạng cho phép null, để các hàng cũ sống sót</span>
ALTER TABLE "posts" ADD COLUMN "slug" TEXT;

<span class="tok-comment">-- 2. Đổ dữ liệu vào từ thứ vốn đã có</span>
UPDATE "posts" SET "slug" = 'bai-' || "id" WHERE "slug" IS NULL;

<span class="tok-comment">-- 3. Giờ mới thoả được ràng buộc</span>
ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">migrate dev</span><span class="lz-t">Chỉ cho phát triển</span><span class="lz-d">Tạo migration bằng cách so với một shadow database, áp dụng nó, sinh lại client, và chạy lại seed. Đừng bao giờ trỏ nó vào production — nó có thể reset.</span></div>
  <div class="lz-step"><span class="lz-k">migrate deploy</span><span class="lz-t">Production</span><span class="lz-d">Áp dụng các migration đang chờ, và không làm gì khác. Không tạo tệp, không cần shadow database, không hỏi, không reset. Đây là câu lệnh nằm trong đường ống deploy của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">migrate status</span><span class="lz-t">Chẩn đoán</span><span class="lz-d">Cái gì đã áp dụng, cái gì đang chờ, cái gì đã hỏng. Thứ đầu tiên nên chạy khi một bản deploy cư xử lạ, và an toàn trên mọi cơ sở dữ liệu.</span></div>
  <div class="lz-step"><span class="lz-k">migrate diff</span><span class="lz-t">Công cụ mạnh</span><span class="lz-d">In ra phần SQL giữa hai trạng thái bất kỳ — lược đồ so với cơ sở dữ liệu, migration so với cơ sở dữ liệu. Nền tảng của việc dò trôi dạt và của việc viết tay một migration, cả hai đều ở Chương 6.</span></div>
</div>
<pre><code><span class="tok-comment"># Câu lệnh duy nhất trả lời "cơ sở dữ liệu của tôi có đúng như lược đồ nói không?"</span>
npx prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma \\
  --script</code></pre>
<div class="out">-- This is an empty migration.</div>
<p>Output rỗng nghĩa là không trôi dạt. Bất kỳ dòng SQL nào trong output đó là một khác biệt giữa cơ sở dữ liệu đang sống và tệp lược đồ của bạn, và Chương 6 đi qua từng loại khác biệt nghĩa là gì.</p>

<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai — khi <code>migrate dev</code> mới là thứ hỏng.</strong> Trong kho này, <code>npx prisma migrate dev</code> không chạy được, chấm hết. Migration <code>20260706130000_add_music_and_profile</code> tạo một ràng buộc UNIQUE tên <code>post_music_post_id_key</code> rồi tạo tiếp một index thường <em>trùng y tên đó</em>. PostgreSQL đã nhận nó một lần; nó không bao giờ phát lại được lên một shadow database sạch, nên mọi lần <code>migrate dev</code> đều chết với <code>P3006</code>.</p>
<p>Migration ấy đã deploy rồi, và luật của kho cấm sửa một migration đã deploy — nên cách vá không phải là đi vá nó. Migration mới ở đây được <strong>viết tay</strong> thành <code>prisma/migrations/&lt;timestamp&gt;_&lt;tên&gt;/migration.sql</code> rồi áp dụng bằng <code>migrate deploy</code>, vốn không cần shadow database. Câu lệnh <code>migrate diff</code> ở trên là cách bạn kiểm kết quả có đúng không. Đây là tình huống thật sự phổ biến ở các kho mã cũ, nên Chương 6 dạy đường viết tay như một kỹ năng chính thức chứ không phải một mẹo chữa cháy.</p>
</div>

<h3>Luồng 3 — <code>db pull</code>: tiếp quản thứ đã có</h3>
<pre><code>npx prisma db pull --print | head -30</code></pre>
<div class="out">model posts {
  id         Int       @id @default(autoincrement())
  title      String
  body       String?
  published  Boolean   @default(false)
  views      Int       @default(0)
  created_at DateTime  @default(now())
  author_id  Int
  users      users     @relation(fields: [author_id], references: [id], onDelete: Cascade)

  @@index([author_id])
}</div>
<p>Dùng được, và rõ ràng là do máy viết: tên bảng chứ không phải tên model, <code>created_at</code> chứ không phải <code>createdAt</code>, và một trường quan hệ tên <code>users</code>. Nội soi không bịa ra quy ước đặt tên của bạn được — nhưng nó <strong>giữ</strong> chúng, một khi bạn đã đặt:</p>
<pre><code><span class="tok-comment">// Bạn đổi tên bằng tay, thêm @map / @@map</span>
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now()) @map("created_at")
  authorId  Int      @map("author_id")
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("posts")
}</code></pre>
<pre><code><span class="tok-comment"># Pull lại — tên của bạn sống sót, và chỉ thay đổi thật mới hiện ra</span>
npx prisma db pull</code></pre>
<div class="out">✔ Introspected 2 models and wrote them into prisma/schema.prisma in 128ms

*** WARNING ***

These models were enriched with &#96;@@map&#96; information taken from the previous Prisma schema:
  - "Post"
  - "User"</div>
<div class="pitfall">
<p><strong>Bẫy — những gì nội soi không nhìn thấy.</strong> Nó chỉ đọc thứ cơ sở dữ liệu có ghi lại. Một quan hệ không có ràng buộc khoá ngoại (phổ biến ở MySQL cũ, và luôn luôn xảy ra dưới <code>relationMode = "prisma"</code>) sẽ thành hai trường <code>Int</code> rời rạc, và bạn phải tự viết <code>@relation</code>. Ràng buộc check, trigger, chính sách bảo mật mức hàng, partial index và stored procedure hoàn toàn không hiện ra — chúng vẫn chạy dưới cơ sở dữ liệu, chỉ là Prisma không biết gì về chúng. Chương 10 nói cách giữ những đối tượng ấy sống qua các lần migration.</p>
</div>

<h3>Chọn thế nào, gói trong một bảng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Làm nguyên mẫu một mình, dữ liệu vứt được</span><span class="v"><code>db push</code>. Chuyển sang <code>migrate</code> ngay khi xuất hiện người thứ hai hoặc môi trường thứ hai.</span></div>
  <div class="kv"><span class="k">Có đội, hoặc có bất cứ thứ gì đã deploy</span><span class="v"><code>migrate dev</code> ở máy, <code>migrate deploy</code> trong đường ống. Migration được review trong pull request như mã, vì chúng chính là mã.</span></div>
  <div class="kv"><span class="k">Cơ sở dữ liệu thử của CI</span><span class="v"><code>db push</code> chính đáng ở đây — nhanh hơn phát lại lịch sử và cơ sở dữ liệu bị huỷ sau khi chạy xong. Nhưng đừng bao giờ dùng ở bước đường ống chạm tới môi trường thật.</span></div>
  <div class="kv"><span class="k">Cơ sở dữ liệu có sẵn, lần tiếp quản đầu tiên</span><span class="v"><code>db pull</code>, rồi đổi tên, rồi dựng nền: sinh migration đầu bằng <code>migrate diff</code> và đánh dấu đã áp dụng bằng <code>migrate resolve --applied</code>. Chương 6 đi hết chuỗi này.</span></div>
  <div class="kv"><span class="k">Có người sửa production bằng tay</span><span class="v"><code>migrate diff</code> để xem họ đã làm gì, rồi <code>db pull</code> lên một nhánh để bắt lấy nó, rồi một migration thật để hợp thức hoá. Đừng bao giờ <code>db push</code> để "vá cho xong".</span></div>
</div>

<div class="callout warn">
<p><strong>Ba cách các đội làm hỏng chuyện này.</strong> <strong>Một:</strong> dùng <code>db push</code> ở máy còn <code>migrate deploy</code> trong CI — production khi ấy nhận những migration chưa ai từng chạy, vì cơ sở dữ liệu của lập trình viên được dựng bằng push. <strong>Hai:</strong> sửa một migration đã áp dụng ở đâu đó, khiến checksum không còn khớp và mọi lần deploy sau đó chết với <code>P3009</code>. <strong>Ba:</strong> xoá một thư mục migration cho "gọn", tức là xoá luôn phần lịch sử mà bản chênh lệch được tính từ đó. Cả ba đều nằm trong danh sách hành động bị cấm của CuongThai, và cả ba đều được học theo cùng một cách.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Làm nguyên mẫu với <code>db push</code></span><span class="lc-sub">prisma.io/docs · Lập trường chính thức về khi nào push là hợp lý và khi nào không</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model" target="_blank" rel="noopener"><span class="lc-ico">🧠</span><span class="lc-body"><span class="lc-title">Prisma Migrate — mô hình tư duy</span><span class="lc-sub">prisma.io/docs · Trang hay nhất trong toàn bộ tài liệu về việc migration thật sự hoạt động ra sao. Đọc trước Chương 6</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/getting-started" target="_blank" rel="noopener"><span class="lc-ico">🚚</span><span class="lc-body"><span class="lc-title">Migrate — dev so với deploy</span><span class="lc-sub">prisma.io/docs · Câu lệnh nào thuộc về môi trường nào, và mỗi câu được phép làm gì</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/getting-started#adding-prisma-migrate-to-an-existing-project" target="_blank" rel="noopener"><span class="lc-ico">🏗️</span><span class="lc-body"><span class="lc-title">Dựng nền cho cơ sở dữ liệu có sẵn</span><span class="lc-sub">prisma.io/docs · Chuỗi thao tác chính xác để đưa Migrate vào một cơ sở dữ liệu vốn đã có bảng</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Cho năm tình huống, chọn luồng phù hợp — rồi giải thích chọn sai thì mất gì</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 1.6 ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Trắc nghiệm Chương 1',
      slug: 'pr-1-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu: Prisma cố ý thiếu gì so với Hibernate, vì sao lazy loading đẻ ra N+1, mã sinh ra phình theo cái gì, connection pool sống ở đâu, binaryTargets, directUrl, cái giá của relationMode prisma, và luồng nào cho tình huống nào.',
      content: `
<div class="ml-en">
<p>Eight questions on Chapter 1. They cover the design decisions behind Prisma rather than its syntax — which is what makes the rest of the course predictable instead of surprising.</p>
</div>
<div class="ml-vi">
<p>Tám câu cho Chương 1. Chúng hỏi về những quyết định thiết kế đứng sau Prisma chứ không hỏi cú pháp — và chính phần đó khiến những chương còn lại trở nên đoán trước được thay vì bất ngờ.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which three features does Prisma deliberately NOT have, unlike Hibernate or TypeORM?|||Prisma cố ý KHÔNG có ba tính năng nào, khác với Hibernate hay TypeORM?',
            options: [
              'An identity map, change tracking, and lazy loading — a query returns plain data and writes only happen when you call a write method|||Bản đồ bản sắc, theo dõi thay đổi, và lazy loading — truy vấn trả về dữ liệu thuần và chỉ ghi khi bạn gọi phương thức ghi',
              'Transactions, migrations, and relations — those must be handled with raw SQL|||Giao dịch, migration, và quan hệ — phải xử lý bằng SQL thô',
              'Type generation, connection pooling, and query logging|||Sinh kiểu, gom kết nối, và ghi log truy vấn',
              'Nothing — Prisma is a superset of what those ORMs provide|||Không thiếu gì — Prisma là tập cha của những gì các ORM đó cung cấp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does the absence of lazy loading make N+1 harder to write by accident?|||Vì sao việc không có lazy loading khiến N+1 khó bị viết ra một cách vô tình hơn?',
            options: [
              'An un-included relation is `undefined` and the code crashes, instead of silently issuing one query per iteration|||Một quan hệ không được include là `undefined` nên mã chết ngay, thay vì âm thầm bắn một câu truy vấn mỗi vòng lặp',
              'Prisma detects loops at runtime and refuses to run queries inside them|||Prisma phát hiện vòng lặp lúc chạy và từ chối chạy truy vấn bên trong chúng',
              'Prisma caches identical queries, so 200 identical lookups become one|||Prisma lưu đệm các truy vấn giống nhau, nên 200 lần tra cứu giống hệt thành một',
              'It does not — N+1 is equally easy in every ORM|||Nó không khiến khó hơn — N+1 dễ viết như nhau ở mọi ORM',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which schema change makes the generated index.d.ts grow fastest?|||Thay đổi nào trong lược đồ làm index.d.ts sinh ra phình nhanh nhất?',
            options: [
              'Adding a relation — both models gain relation filters and nested write inputs that reference each other|||Thêm một quan hệ — cả hai model mọc thêm bộ lọc theo quan hệ và các input ghi lồng nhau tham chiếu lẫn nhau',
              'Adding a scalar field — every Args type has to grow a line for it|||Thêm một trường vô hướng — mọi kiểu Args đều phải mọc thêm một dòng cho nó',
              'Adding an enum — each value becomes its own generated type|||Thêm một enum — mỗi giá trị thành một kiểu sinh ra riêng',
              'Adding an @@index — indexes are reflected in the type of every query|||Thêm một @@index — chỉ mục được phản ánh vào kiểu của mọi câu truy vấn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In the default (non-adapter) setup, where does the connection pool live?|||Ở cấu hình mặc định (không dùng adapter), connection pool sống ở đâu?',
            options: [
              'Inside the query engine, which is why connection_limit is a URL parameter and a second PrismaClient is a second pool|||Bên trong query engine, và vì thế connection_limit là tham số URL còn một PrismaClient thứ hai là một pool thứ hai',
              'In the Node.js process, managed by @prisma/client and configurable through the constructor|||Trong tiến trình Node.js, do @prisma/client quản lý và chỉnh được qua hàm dựng',
              'In PostgreSQL, which allocates one pool per connecting application|||Trong PostgreSQL, nơi cấp cho mỗi ứng dụng kết nối một pool',
              'There is no pool — Prisma opens a fresh connection per query|||Không có pool nào — Prisma mở một kết nối mới cho mỗi câu truy vấn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You generate the client on a Debian builder and run it in an Alpine image. What must binaryTargets contain?|||Bạn generate client trên tầng builder Debian rồi chạy nó trong ảnh Alpine. binaryTargets phải chứa gì?',
            options: [
              'Both "native" and "linux-musl-openssl-3.0.x" — otherwise the glibc engine cannot load under musl and the container restarts forever|||Cả "native" lẫn "linux-musl-openssl-3.0.x" — nếu không, engine glibc không nạp được dưới musl và container restart vô tận',
              'Only "native" — Prisma detects the runtime platform and downloads the right engine at startup|||Chỉ "native" — Prisma tự nhận nền tảng lúc chạy rồi tải engine đúng khi khởi động',
              'Nothing — binaryTargets only affects `prisma migrate`, not the client|||Không cần gì — binaryTargets chỉ ảnh hưởng `prisma migrate`, không ảnh hưởng client',
              'Only "linux-musl-openssl-3.0.x" — listing more than one target is rejected|||Chỉ "linux-musl-openssl-3.0.x" — liệt kê nhiều hơn một target sẽ bị từ chối',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is `directUrl` for?|||`directUrl` dùng để làm gì?',
            options: [
              'An un-pooled connection for the CLI, because migrations cannot run through a transaction-mode pooler like PgBouncer|||Một kết nối không qua bộ gom dành cho CLI, vì migration không chạy được qua bộ gom ở chế độ transaction như PgBouncer',
              'A read replica that Prisma Client uses automatically for findMany calls|||Một bản sao chỉ đọc mà Prisma Client tự dùng cho các lời gọi findMany',
              'A fallback URL used when the main connection fails|||Một URL dự phòng dùng khi kết nối chính hỏng',
              'The URL of the shadow database that migrate dev creates and drops|||URL của shadow database mà migrate dev tạo ra rồi xoá',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which cost of `relationMode = "prisma"` is easiest to overlook?|||Cái giá nào của `relationMode = "prisma"` dễ bị bỏ sót nhất?',
            options: [
              'The database no longer auto-indexes foreign keys, so every relation scalar needs an explicit @@index or joins become sequential scans|||Cơ sở dữ liệu không còn tự đánh chỉ mục cho khoá ngoại, nên mọi trường vô hướng của quan hệ đều cần @@index tường minh, không thì join thành quét tuần tự',
              'onDelete: Cascade stops compiling and must be removed from the schema|||onDelete: Cascade không biên dịch được nữa và phải bỏ khỏi lược đồ',
              'The generated client becomes larger because relations are duplicated|||Client sinh ra to lên vì quan hệ bị nhân đôi',
              'Transactions stop working, so every nested write must be manual|||Giao dịch ngừng hoạt động, nên mọi lần ghi lồng nhau phải làm thủ công',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A teammate uses `db push` locally while CI runs `migrate deploy`. What goes wrong?|||Một đồng đội dùng `db push` ở máy trong khi CI chạy `migrate deploy`. Hỏng ở chỗ nào?',
            options: [
              'Their change leaves no migration file, so production receives migrations nobody has ever actually run|||Thay đổi của họ không để lại tệp migration nào, nên production nhận những migration chưa ai từng thật sự chạy',
              'Nothing — push and migrate produce identical results, only the speed differs|||Không sao cả — push và migrate cho kết quả y hệt, chỉ khác tốc độ',
              'CI fails immediately because push writes a row into _prisma_migrations|||CI hỏng ngay vì push ghi một hàng vào _prisma_migrations',
              'The client stops generating until someone runs `migrate resolve`|||Client ngừng sinh mã cho tới khi có người chạy `migrate resolve`',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
