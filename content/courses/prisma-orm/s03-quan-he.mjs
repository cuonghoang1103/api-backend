/**
 * Prisma ORM — Chương 3: Quan hệ.
 * Hai phía một quan hệ · 1-n · 1-1 · n-n ẩn và tường minh · tự quan hệ và nhiều quan hệ · onDelete · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 3 — Relations|||Chương 3 — Quan hệ',
  description: 'Mọi kiểu quan hệ Prisma diễn đạt được: một-nhiều, một-một, nhiều-nhiều ẩn và tường minh, tự quan hệ, nhiều quan hệ giữa cùng hai model — cùng năm hành vi onDelete nhìn tận mắt bằng dữ liệu thật, và lý do @relation phải có quan hệ ngược.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — Two sides, one foreign key|||3.1 — Hai phía, một khoá ngoại',
      slug: 'pr-3-1-hai-phia',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao mọi quan hệ Prisma cần đúng hai trường trong khi cơ sở dữ liệu chỉ có một cột, bốn tham số của @relation, phía nào sở hữu khoá ngoại, và lỗi thiếu quan hệ ngược — chính là lỗi đã chặn một lần generate trong kho này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Two sides, one foreign key</h2>
<p class="lead">A relation in the database is one column with a constraint on it. A relation in Prisma is <em>three</em> things: the scalar that holds the value, the field you traverse from this side, and the field you traverse from the other side. Understanding why it needs all three — and which of them exists in SQL — makes every relation error in this chapter obvious rather than mysterious.</p>

<h3>The anatomy, labelled</h3>
<pre><code>model User {
  id    Int    @id @default(autoincrement())
  email String @unique

  posts Post[] <span class="tok-comment">// ③ back-relation — NO column exists for this</span>

  @@map("users")
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String

  authorId Int    @map("author_id")  <span class="tok-comment">// ① the scalar — THIS is the real column</span>
  author   User   @relation(fields: [authorId], references: [id])  <span class="tok-comment">// ② the link</span>

  @@index([authorId])
  @@map("posts")
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">① The relation scalar — <code>authorId Int</code></span><span class="lz-lnote">The only one of the three that is a column. <code>author_id INTEGER NOT NULL</code>, with a <code>REFERENCES users(id)</code> constraint. You can read it, filter on it, and set it directly.</span></div>
  <div class="lz-layer"><span class="lz-lname">② The relation field — <code>author User @relation(...)</code></span><span class="lz-lnote">Exists only in the generated client. It is what makes <code>include: { author: true }</code> and <code>author: { connect: { id: 1 } }</code> possible. Because it carries <code>fields:</code>, this side <strong>owns</strong> the foreign key.</span></div>
  <div class="lz-layer"><span class="lz-lname">③ The back-relation — <code>posts Post[]</code></span><span class="lz-lnote">Also client-only, and also mandatory. Without it Prisma cannot express the relation as bidirectional, and <code>generate</code> refuses to run. It has no <code>@relation</code> arguments because the other side already declared them.</span></div>
</div>

<h3>The error you will meet on your first relation</h3>
<pre><code><span class="tok-comment">// Post declares the relation; User says nothing back</span>
model User { id       Int  @id @default(autoincrement()) }
model    Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}</code></pre>
<pre><code>npx prisma validate</code></pre>
<div class="out">error: Error validating field &#96;author&#96; in model &#96;Post&#96;: The relation field &#96;author&#96; on model &#96;Post&#96; is missing an opposite relation field on the model &#96;User&#96;. Either run &#96;prisma format&#96; or add it manually.
  --&gt;  prisma/schema.prisma:9
   |
 8 |   authorId Int
 9 |   author   User @relation(fields: [authorId], references: [id])
   |

Validation Error Count: 1</div>
<div class="callout ok">
<p><strong>The fix is in the message: run <code>prisma format</code>.</strong> It adds the missing field for you, correctly named and correctly typed. This is the single best argument for binding <code>prisma format</code> to your save keystroke — it turns a class of error into a non-event.</p>
</div>
<div class="note-ct">
<p><strong>From the CuongThai codebase.</strong> On 2026-06-29 this exact error blocked a <code>prisma generate</code>: the models <code>NoteSubjectShare</code> and <code>NoteSubjectShareRecipient</code> declared relations whose opposite fields did not exist in the parent models. The lesson written into the repository's instructions afterwards is one sentence — <em>every relation needs its opposite field</em> — and it is in the schema rules section precisely because it was learned by losing time to it.</p>
</div>

<h3>The four arguments of <code>@relation</code></h3>
<pre><code>author User @relation(
  name: "BaiVietCuaTacGia",   <span class="tok-comment">// disambiguates multiple relations — Lesson 3.5</span>
  fields:     [authorId],     <span class="tok-comment">// which local scalar(s) hold the value</span>
  references: [id],           <span class="tok-comment">// which column(s) on the other model they point at</span>
  onDelete:   Cascade,        <span class="tok-comment">// what happens when the referenced row is deleted</span>
  onUpdate:   Cascade,        <span class="tok-comment">// what happens when the referenced key changes</span>
  map:        "fk_post_author"<span class="tok-comment">// the constraint name in the database</span>
)</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>fields</code> + <code>references</code> go together</span><span class="v">Always both, always the same length, always on <strong>one side only</strong>. The side that has them owns the foreign key column. Putting them on both sides is an error; putting them on neither is an error.</span></div>
  <div class="kv"><span class="k">They can be composite</span><span class="v"><code>fields: [tenantId, userId], references: [tenantId, id]</code> — a two-column foreign key, which requires a matching <code>@@id</code> or <code>@@unique</code> on the target.</span></div>
  <div class="kv"><span class="k"><code>references</code> must point at something unique</span><span class="v">A primary key, a <code>@unique</code> field, or a <code>@@unique</code> combination. Pointing at an ordinary column is rejected — SQL requires it, and so does Prisma.</span></div>
  <div class="kv"><span class="k"><code>name</code> is not a database name</span><span class="v">It disambiguates when two relations connect the same pair of models. <code>map</code> is the one that names the SQL constraint. Two different jobs, and confusing them is the same trap as <code>@@unique</code>'s <code>name</code> versus <code>map</code> from Lesson 2.3.</span></div>
</div>

<h3>Which side owns the key? The rule is mechanical</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">One-to-many</span><span class="lz-t">The "many" side owns it</span><span class="lz-d">Many posts, one author → <code>Post.authorId</code>. There is no other option: you cannot store a list of post ids in a single column on <code>users</code>.</span></div>
  <div class="lz-step"><span class="lz-k">One-to-one</span><span class="lz-t">You choose, and it matters</span><span class="lz-d">Either side can hold it. Put it on the side that is optional and created later — a <code>Profile</code> referencing a <code>User</code>, not the reverse. Lesson 3.3 shows why the wrong choice makes user creation impossible.</span></div>
  <div class="lz-step"><span class="lz-k">Many-to-many</span><span class="lz-t">Neither — a third table owns both</span><span class="lz-d">Prisma can create and manage that table for you (implicit) or you can declare it as a model (explicit). Lesson 3.4 is entirely about choosing between them.</span></div>
  <div class="lz-step"><span class="lz-k">Self-relation</span><span class="lz-t">Same model, both sides</span><span class="lz-d">A comment replying to a comment, an employee managing an employee. Needs an explicit <code>name</code> because Prisma cannot tell the two fields apart otherwise — Lesson 3.5.</span></div>
</div>

<h3>What the client gains from each side</h3>
<pre><code><span class="tok-comment">// From the owning side: filter on the scalar, or traverse the relation</span>
await prisma.post.findMany({ where: { authorId: 1 } });                 <span class="tok-comment">// the column</span>
await prisma.post.findMany({ where: { author: { email: 'an@x.com' } } });<span class="tok-comment">// the relation</span>
await prisma.post.findMany({ include: { author: true } });

<span class="tok-comment">// From the back-relation side: filter by the collection, count it, include it</span>
await prisma.user.findMany({ where: { posts: { some: { published: true } } } });
await prisma.user.findMany({ where: { posts: { none: {} } } });          <span class="tok-comment">// users with no posts</span>
await prisma.user.findMany({ include: { _count: { select: { posts: true } } } });</code></pre>
<div class="out">prisma:query SELECT "public"."users"."id", "public"."users"."email" FROM "public"."users" WHERE (EXISTS (SELECT "t1"."id" FROM "public"."posts" AS "t1" WHERE ("t1"."published" = $1 AND "t1"."author_id" = "public"."users"."id"))) OFFSET $2</div>
<p><code>some</code> became an <code>EXISTS</code> subquery, which is exactly what you would have written by hand and exactly what the planner likes. <code>none</code> becomes <code>NOT EXISTS</code>, and <code>every</code> becomes a <code>NOT EXISTS</code> over the negated condition — a small piece of logic that is easy to get backwards in raw SQL and impossible to get backwards here.</p>

<h3>Setting a relation: three ways, one column</h3>
<pre><code><span class="tok-comment">// A — write the scalar directly. Simplest, and no existence check.</span>
await prisma.post.create({ data: { title: 'A', authorId: 1 } });

<span class="tok-comment">// B — connect an existing row. Prisma verifies it exists first.</span>
await prisma.post.create({ data: { title: 'B', author: { connect: { id: 1 } } } });

<span class="tok-comment">// C — create the parent and child together, in one transaction.</span>
await prisma.post.create({
  data: { title: 'C', author: { create: { email: 'moi@example.com' } } },
});</code></pre>
<div class="out">-- A: one statement, and PostgreSQL rejects a bad author_id with a constraint violation (P2003)
INSERT INTO "posts" ("title","author_id") VALUES ($1,$2) RETURNING ...

-- B: also one statement — connect by primary key needs no lookup
INSERT INTO "posts" ("title","author_id") VALUES ($1,$2) RETURNING ...

-- C: a transaction, parent first
BEGIN
INSERT INTO "users" ("email") VALUES ($1) RETURNING "id"
INSERT INTO "posts" ("title","author_id") VALUES ($2,$3) RETURNING ...
COMMIT</div>
<div class="pitfall">
<p><strong>Trap — <code>connect</code> by a non-primary unique field is an extra query.</strong> <code>connect: { id: 1 }</code> can be written straight into the <code>INSERT</code> because the id <em>is</em> the foreign key value. <code>connect: { email: 'an@x.com' }</code> cannot — Prisma must first look up the id, so it becomes two statements inside a transaction. Harmless once; noticeable in a loop of five hundred imports. If you already hold the id, pass the scalar.</p>
</div>

<h3>The one thing the database does not know</h3>
<pre><code><span class="tok-comment">// Prisma sees a relation. PostgreSQL sees a constraint.</span>
docker exec -it pg-hoc psql -U student -d hocprisma -c "\\d posts"</code></pre>
<div class="out">Indexes:
    "posts_pkey" PRIMARY KEY, btree (id)
    "posts_author_id_idx" btree (author_id)
Foreign-key constraints:
    "posts_author_id_fkey" FOREIGN KEY (author_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT</div>
<p>One constraint. No trace of <code>author</code>, no trace of <code>posts</code> — those two names exist only in your schema file and in the generated client. This is why <code>db pull</code> on an existing database produces relation fields named after tables (<code>users</code>, <code>posts</code>) rather than after intent: the database never stored the intent. It is also why a database with no foreign key constraints introspects into two unrelated <code>Int</code> columns, and you must write the <code>@relation</code> yourself.</p>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Relations — the overview page</span><span class="lc-sub">prisma.io/docs · The anatomy above in the maintainers' own words, with every relation kind linked from it</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference#relation" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title"><code>@relation</code> — full reference</span><span class="lc-sub">prisma.io/docs · Every argument, including composite <code>fields</code> and the rules on what <code>references</code> may point at</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — foreign keys</span><span class="lc-sub">postgresql.org · What the constraint actually guarantees, and what it costs on write</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, constraints chapter</span><span class="lc-sub">Foreign keys from the database side: deferrable constraints, and what a violation looks like</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Fix six broken relations — each missing a different one of the three required pieces</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Hai phía, một khoá ngoại</h2>
<p class="lead">Một quan hệ dưới cơ sở dữ liệu là một cột kèm một ràng buộc. Một quan hệ trong Prisma là <em>ba</em> thứ: trường vô hướng giữ giá trị, trường bạn đi qua từ phía này, và trường bạn đi qua từ phía kia. Hiểu vì sao nó cần cả ba — và cái nào trong ba tồn tại dưới SQL — khiến mọi lỗi quan hệ trong chương này thành hiển nhiên thay vì bí ẩn.</p>

<h3>Giải phẫu, dán nhãn</h3>
<pre><code>model User {
  id    Int    @id @default(autoincrement())
  email String @unique

  posts Post[] <span class="tok-comment">// ③ quan hệ ngược — KHÔNG có cột nào cho nó cả</span>

  @@map("users")
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String

  authorId Int    @map("author_id")  <span class="tok-comment">// ① trường vô hướng — ĐÂY mới là cột thật</span>
  author   User   @relation(fields: [authorId], references: [id])  <span class="tok-comment">// ② mối nối</span>

  @@index([authorId])
  @@map("posts")
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">① Trường vô hướng của quan hệ — <code>authorId Int</code></span><span class="lz-lnote">Thứ duy nhất trong ba cái là một cột. <code>author_id INTEGER NOT NULL</code>, kèm ràng buộc <code>REFERENCES users(id)</code>. Bạn đọc được nó, lọc theo nó, và gán thẳng cho nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">② Trường quan hệ — <code>author User @relation(...)</code></span><span class="lz-lnote">Chỉ tồn tại trong client sinh ra. Nó là thứ khiến <code>include: { author: true }</code> và <code>author: { connect: { id: 1 } }</code> khả thi. Vì nó mang <code>fields:</code> nên phía này <strong>sở hữu</strong> khoá ngoại.</span></div>
  <div class="lz-layer"><span class="lz-lname">③ Quan hệ ngược — <code>posts Post[]</code></span><span class="lz-lnote">Cũng chỉ có trong client, và cũng bắt buộc. Không có nó thì Prisma không diễn đạt được quan hệ là hai chiều, và <code>generate</code> từ chối chạy. Nó không có tham số <code>@relation</code> nào vì phía kia đã khai rồi.</span></div>
</div>

<h3>Lỗi bạn sẽ gặp ở quan hệ đầu tiên của mình</h3>
<pre><code><span class="tok-comment">// Post khai quan hệ; User không nói lại gì</span>
model User { id       Int  @id @default(autoincrement()) }
model    Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}</code></pre>
<pre><code>npx prisma validate</code></pre>
<div class="out">error: Error validating field &#96;author&#96; in model &#96;Post&#96;: The relation field &#96;author&#96; on model &#96;Post&#96; is missing an opposite relation field on the model &#96;User&#96;. Either run &#96;prisma format&#96; or add it manually.
  --&gt;  prisma/schema.prisma:9
   |
 8 |   authorId Int
 9 |   author   User @relation(fields: [authorId], references: [id])
   |

Validation Error Count: 1</div>
<div class="callout ok">
<p><strong>Cách vá nằm ngay trong thông báo: chạy <code>prisma format</code>.</strong> Nó thêm hộ bạn trường còn thiếu, đúng tên và đúng kiểu. Đây là lý lẽ mạnh nhất cho việc gắn <code>prisma format</code> vào phím lưu của bạn — nó biến cả một lớp lỗi thành chuyện không xảy ra.</p>
</div>
<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai.</strong> Ngày 29/06/2026 đúng lỗi này đã chặn một lần <code>prisma generate</code>: hai model <code>NoteSubjectShare</code> và <code>NoteSubjectShareRecipient</code> khai những quan hệ mà trường đối ứng không tồn tại trong model cha. Bài học được viết vào chỉ dẫn của kho sau đó chỉ có một câu — <em>mọi quan hệ đều cần trường đối ứng của nó</em> — và nó nằm ở phần luật lược đồ đúng vì nó được học bằng cách mất thời gian cho nó.</p>
</div>

<h3>Bốn tham số của <code>@relation</code></h3>
<pre><code>author User @relation(
  name: "BaiVietCuaTacGia",   <span class="tok-comment">// phân biệt khi có nhiều quan hệ — Bài 3.5</span>
  fields:     [authorId],     <span class="tok-comment">// trường vô hướng nào ở phía này giữ giá trị</span>
  references: [id],           <span class="tok-comment">// nó trỏ tới cột nào của model kia</span>
  onDelete:   Cascade,        <span class="tok-comment">// chuyện gì xảy ra khi hàng được tham chiếu bị xoá</span>
  onUpdate:   Cascade,        <span class="tok-comment">// chuyện gì xảy ra khi khoá được tham chiếu đổi giá trị</span>
  map:        "fk_post_author"<span class="tok-comment">// tên ràng buộc dưới cơ sở dữ liệu</span>
)</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>fields</code> và <code>references</code> đi cùng nhau</span><span class="v">Luôn có cả hai, luôn cùng độ dài, và luôn chỉ ở <strong>một phía</strong>. Phía nào có chúng thì phía đó sở hữu cột khoá ngoại. Đặt ở cả hai phía là lỗi; không đặt ở phía nào cũng là lỗi.</span></div>
  <div class="kv"><span class="k">Chúng có thể là phức hợp</span><span class="v"><code>fields: [tenantId, userId], references: [tenantId, id]</code> — một khoá ngoại hai cột, và nó đòi bên đích phải có <code>@@id</code> hoặc <code>@@unique</code> tương ứng.</span></div>
  <div class="kv"><span class="k"><code>references</code> phải trỏ vào thứ gì đó unique</span><span class="v">Một khoá chính, một trường <code>@unique</code>, hoặc một tổ hợp <code>@@unique</code>. Trỏ vào một cột thường sẽ bị từ chối — SQL đòi vậy, và Prisma cũng vậy.</span></div>
  <div class="kv"><span class="k"><code>name</code> không phải tên dưới cơ sở dữ liệu</span><span class="v">Nó phân biệt khi có hai quan hệ nối cùng một cặp model. <code>map</code> mới là thứ đặt tên cho ràng buộc SQL. Hai việc khác nhau, và lẫn lộn chúng chính là cái bẫy <code>name</code> so với <code>map</code> của <code>@@unique</code> ở Bài 2.3.</span></div>
</div>

<h3>Phía nào sở hữu khoá? Luật này máy móc</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Một–nhiều</span><span class="lz-t">Phía "nhiều" sở hữu nó</span><span class="lz-d">Nhiều bài viết, một tác giả → <code>Post.authorId</code>. Không có lựa chọn nào khác: bạn không lưu được một danh sách id bài viết vào một cột đơn trên <code>users</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Một–một</span><span class="lz-t">Bạn chọn, và lựa chọn ấy có ý nghĩa</span><span class="lz-d">Phía nào giữ cũng được. Hãy đặt nó ở phía tuỳ chọn và được tạo sau — một <code>Profile</code> tham chiếu tới <code>User</code>, chứ không phải ngược lại. Bài 3.3 chỉ vì sao chọn sai làm cho việc tạo người dùng thành bất khả.</span></div>
  <div class="lz-step"><span class="lz-k">Nhiều–nhiều</span><span class="lz-t">Không phía nào — một bảng thứ ba giữ cả hai</span><span class="lz-d">Prisma tạo và quản lý bảng đó hộ bạn (ẩn), hoặc bạn khai nó thành một model (tường minh). Bài 3.4 dành trọn cho việc chọn giữa hai cách.</span></div>
  <div class="lz-step"><span class="lz-k">Tự quan hệ</span><span class="lz-t">Cùng một model, cả hai phía</span><span class="lz-d">Một bình luận trả lời một bình luận, một nhân viên quản lý một nhân viên. Cần một <code>name</code> tường minh vì nếu không Prisma không phân biệt nổi hai trường — Bài 3.5.</span></div>
</div>

<h3>Client được gì từ mỗi phía</h3>
<pre><code><span class="tok-comment">// Từ phía sở hữu: lọc theo cột, hoặc đi qua quan hệ</span>
await prisma.post.findMany({ where: { authorId: 1 } });                 <span class="tok-comment">// cột</span>
await prisma.post.findMany({ where: { author: { email: 'an@x.com' } } });<span class="tok-comment">// quan hệ</span>
await prisma.post.findMany({ include: { author: true } });

<span class="tok-comment">// Từ phía quan hệ ngược: lọc theo tập hợp, đếm nó, include nó</span>
await prisma.user.findMany({ where: { posts: { some: { published: true } } } });
await prisma.user.findMany({ where: { posts: { none: {} } } });          <span class="tok-comment">// người dùng chưa có bài nào</span>
await prisma.user.findMany({ include: { _count: { select: { posts: true } } } });</code></pre>
<div class="out">prisma:query SELECT "public"."users"."id", "public"."users"."email" FROM "public"."users" WHERE (EXISTS (SELECT "t1"."id" FROM "public"."posts" AS "t1" WHERE ("t1"."published" = $1 AND "t1"."author_id" = "public"."users"."id"))) OFFSET $2</div>
<p><code>some</code> đã thành một truy vấn con <code>EXISTS</code>, đúng thứ bạn sẽ viết bằng tay và đúng thứ bộ lập kế hoạch ưa. <code>none</code> thành <code>NOT EXISTS</code>, còn <code>every</code> thành một <code>NOT EXISTS</code> trên điều kiện phủ định — một mẩu logic rất dễ viết ngược trong SQL thô và không thể viết ngược ở đây.</p>

<h3>Gán một quan hệ: ba cách, một cột</h3>
<pre><code><span class="tok-comment">// A — ghi thẳng vào trường vô hướng. Đơn giản nhất, và không kiểm tồn tại.</span>
await prisma.post.create({ data: { title: 'A', authorId: 1 } });

<span class="tok-comment">// B — nối tới một hàng đã có. Prisma kiểm nó tồn tại trước.</span>
await prisma.post.create({ data: { title: 'B', author: { connect: { id: 1 } } } });

<span class="tok-comment">// C — tạo cha và con cùng lúc, trong một giao dịch.</span>
await prisma.post.create({
  data: { title: 'C', author: { create: { email: 'moi@example.com' } } },
});</code></pre>
<div class="out">-- A: một câu lệnh, và PostgreSQL từ chối author_id sai bằng một lỗi vi phạm ràng buộc (P2003)
INSERT INTO "posts" ("title","author_id") VALUES ($1,$2) RETURNING ...

-- B: cũng một câu lệnh — connect theo khoá chính không cần tra cứu
INSERT INTO "posts" ("title","author_id") VALUES ($1,$2) RETURNING ...

-- C: một giao dịch, cha trước
BEGIN
INSERT INTO "users" ("email") VALUES ($1) RETURNING "id"
INSERT INTO "posts" ("title","author_id") VALUES ($2,$3) RETURNING ...
COMMIT</div>
<div class="pitfall">
<p><strong>Bẫy — <code>connect</code> theo một trường unique không phải khoá chính là thêm một câu truy vấn.</strong> <code>connect: { id: 1 }</code> ghi thẳng được vào câu <code>INSERT</code> vì cái id ấy <em>chính là</em> giá trị khoá ngoại. <code>connect: { email: 'an@x.com' }</code> thì không — Prisma phải tra id trước, nên nó thành hai câu lệnh trong một giao dịch. Vô hại một lần; thấy rõ trong một vòng lặp nhập năm trăm bản ghi. Nếu bạn đã cầm sẵn id thì hãy truyền thẳng trường vô hướng.</p>
</div>

<h3>Điều duy nhất cơ sở dữ liệu không biết</h3>
<pre><code><span class="tok-comment">// Prisma nhìn thấy một quan hệ. PostgreSQL nhìn thấy một ràng buộc.</span>
docker exec -it pg-hoc psql -U student -d hocprisma -c "\\d posts"</code></pre>
<div class="out">Indexes:
    "posts_pkey" PRIMARY KEY, btree (id)
    "posts_author_id_idx" btree (author_id)
Foreign-key constraints:
    "posts_author_id_fkey" FOREIGN KEY (author_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT</div>
<p>Một ràng buộc. Không có dấu vết nào của <code>author</code>, không dấu vết nào của <code>posts</code> — hai cái tên đó chỉ tồn tại trong tệp lược đồ của bạn và trong client sinh ra. Vì vậy <code>db pull</code> trên một cơ sở dữ liệu có sẵn đẻ ra những trường quan hệ đặt tên theo bảng (<code>users</code>, <code>posts</code>) chứ không theo ý định: cơ sở dữ liệu chưa bao giờ lưu cái ý định ấy. Cũng vì vậy một cơ sở dữ liệu không có ràng buộc khoá ngoại sẽ nội soi ra thành hai cột <code>Int</code> rời rạc, và bạn phải tự viết <code>@relation</code>.</p>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Relations — trang tổng quan</span><span class="lc-sub">prisma.io/docs · Phần giải phẫu ở trên nói bằng lời của chính người làm ra nó, kèm liên kết tới mọi kiểu quan hệ</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference#relation" target="_blank" rel="noopener"><span class="lc-ico">📕</span><span class="lc-body"><span class="lc-title"><code>@relation</code> — tra cứu đầy đủ</span><span class="lc-sub">prisma.io/docs · Mọi tham số, kể cả <code>fields</code> phức hợp và luật về những gì <code>references</code> được phép trỏ tới</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — khoá ngoại</span><span class="lc-sub">postgresql.org · Ràng buộc ấy thật sự bảo đảm điều gì, và nó tốn gì lúc ghi</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương ràng buộc</span><span class="lc-sub">Khoá ngoại nhìn từ phía cơ sở dữ liệu: ràng buộc hoãn được, và một lần vi phạm trông ra sao</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Sửa sáu quan hệ hỏng — mỗi cái thiếu một trong ba mảnh bắt buộc</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — One-to-many, and the five `onDelete` behaviours|||3.2 — Một–nhiều, và năm hành vi `onDelete`',
      slug: 'pr-3-2-mot-nhieu',
      type: 'LESSON',
      description: 'Quan hệ phổ biến nhất, làm cho đúng: khoá ngoại bắt buộc so với tuỳ chọn, năm giá trị onDelete chạy thật trên dữ liệu thật và mỗi cái để lại gì, onUpdate, và vì sao mặc định của Prisma khác mặc định của SQL.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>One-to-many, and the five <code>onDelete</code> behaviours</h2>
<p class="lead">One-to-many is nine relations out of ten. The declaration is easy; the part worth your attention is what happens when the parent row is deleted, because there are five answers, they behave very differently on real data, and the default is not what most people assume.</p>

<h3>Required or optional — the choice that shapes your code</h3>
<pre><code>model Post {
  id         Int       @id @default(autoincrement())
  title      String

  <span class="tok-comment">// REQUIRED: every post must have an author</span>
  authorId   Int       @map("author_id")
  author     User      @relation(fields: [authorId], references: [id])

  <span class="tok-comment">// OPTIONAL: a post may or may not be in a category</span>
  categoryId Int?      @map("category_id")
  category   Category? @relation(fields: [categoryId], references: [id])

  @@index([authorId])
  @@index([categoryId])
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Required (<code>Int</code> + <code>User</code>)</span><span class="v"><code>NOT NULL</code>. <code>create</code> will not compile without an author. The relation field is <code>User</code>, never <code>null</code>, so <code>post.author.email</code> needs no guard after an <code>include</code>.</span></div>
  <div class="kv"><span class="k">Optional (<code>Int?</code> + <code>Category?</code>)</span><span class="v">Nullable. <code>create</code> may omit it, and every read must handle <code>null</code>. It also unlocks <code>onDelete: SetNull</code>, which the required version cannot use.</span></div>
  <div class="kv"><span class="k">Both scalars must match</span><span class="v"><code>Int</code> with <code>Category?</code> is a validation error, and so is <code>Int?</code> with <code>Category</code>. The optionality lives on both or on neither.</span></div>
  <div class="kv"><span class="k">Index it. Always.</span><span class="v">Neither PostgreSQL nor Prisma indexes the referencing column. <code>@@index([authorId])</code> is not optional in practice, and Lesson 2.3 explains what it costs to forget.</span></div>
</div>

<h3>The five behaviours, run against real rows</h3>
<pre><code><span class="tok-comment">// Setup: one author, three posts, then delete the author</span>
await prisma.user.create({
  data: {
    email: 'an@example.com',
    posts: { create: [{ title: 'A' }, { title: 'B' }, { title: 'C' }] },
  },
});
await prisma.user.delete({ where: { email: 'an@example.com' } });</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>Restrict</code> — refuse while children exist</span><span class="lz-lnote">The delete throws <code>P2003</code>. Nothing is removed. You must delete or reassign the posts first. <strong>This is Prisma's default for a required relation</strong>, and it is the safe one: no data disappears by surprise.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Cascade</code> — take the children with it</span><span class="lz-lnote">Author and all three posts are gone, in one statement, executed by PostgreSQL. Correct for genuinely owned data (a post's comments, an order's line items). Dangerous where "owned" is an assumption — cascading through four levels can delete far more than you meant.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>SetNull</code> — orphan them deliberately</span><span class="lz-lnote">Author gone, three posts survive with <code>author_id = NULL</code>. Requires an optional relation; on a required one, Prisma rejects the schema. Right when the child outlives the parent — a post whose category was deleted.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>SetDefault</code> — reassign to a fallback</span><span class="lz-lnote">Children get the column's <code>@default</code>, so that default must reference a row that exists — an "unknown author" placeholder. Rarely used, and it fails loudly if the default id has itself been deleted.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>NoAction</code> — hand it to the database</span><span class="lz-lnote">Prisma emits no behaviour and lets the constraint decide. On PostgreSQL it behaves like <code>Restrict</code> but can be deferred to the end of a transaction, which is the one thing <code>Restrict</code> cannot do. Reach for it only when you need that.</span></div>
</div>
<pre><code><span class="tok-comment">// Restrict (the default) — what the failure looks like</span>
await prisma.user.delete({ where: { email: 'an@example.com' } });</code></pre>
<div class="out">PrismaClientKnownRequestError:
Invalid &#96;prisma.user.delete()&#96; invocation:

Foreign key constraint violated on the constraint: &#96;posts_author_id_fkey&#96;
  code: 'P2003',
  meta: { modelName: 'User', field_name: 'posts_author_id_fkey (index)' }</div>
<pre><code><span class="tok-comment">// Cascade — one statement, and PostgreSQL does the rest</span>
author User @relation(fields: [authorId], references: [id], onDelete: Cascade)</code></pre>
<div class="out">prisma:query DELETE FROM "public"."users" WHERE ("public"."users"."email" = $1 AND 1=1)
-- posts: 0 rows remain</div>
<pre><code><span class="tok-comment">// SetNull — needs the optional form</span>
categoryId Int?
category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)</code></pre>
<div class="out">SELECT id, title, category_id FROM posts;
 id | title | category_id
----+-------+-------------
  1 | A     |
  2 | B     |
  3 | C     |</div>

<h3>The defaults, and why they differ from SQL</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Required relation → <code>onDelete: Restrict</code></span><span class="v">Prisma's default. Deleting a parent that still has children fails. Deliberately conservative — the tool refuses to guess that you meant to delete data you did not name.</span></div>
  <div class="kv"><span class="k">Optional relation → <code>onDelete: SetNull</code></span><span class="v">Prisma's default. The child survives with a <code>NULL</code>, which is the only behaviour that makes sense when the link was already allowed to be absent.</span></div>
  <div class="kv"><span class="k">Both → <code>onUpdate: Cascade</code></span><span class="v">If the referenced key value changes, children follow automatically. This differs from plain SQL, whose default is <code>NO ACTION</code>. In practice it rarely fires, because primary keys should not change — but when you do renumber something, it saves you.</span></div>
  <div class="kv"><span class="k">Write it down anyway</span><span class="v">Defaults are invisible in review. A reviewer reading <code>@relation(fields: [x], references: [id])</code> cannot tell whether you thought about deletion. Declaring <code>onDelete</code> explicitly turns a silent assumption into a decision someone can argue with.</span></div>
</div>

<h3>Cascade depth: the thing to check before you ship it</h3>
<pre><code>model User    { id Int @id  posts Post[] }
model Post    { id Int @id  authorId Int  author User @relation(fields:[authorId], references:[id], onDelete: Cascade)
                comments Comment[] }
model Comment { id Int @id  postId Int  post Post @relation(fields:[postId], references:[id], onDelete: Cascade)
                reactions Reaction[] }
model Reaction{ id Int @id  commentId Int comment Comment @relation(fields:[commentId], references:[id], onDelete: Cascade) }</code></pre>
<pre><code><span class="tok-comment">-- Before deleting one user, ask what goes with them</span>
SELECT
  (SELECT count(*) FROM posts     WHERE author_id = 1)                          AS posts,
  (SELECT count(*) FROM comments  WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1)) AS comments,
  (SELECT count(*) FROM reactions WHERE comment_id IN
     (SELECT id FROM comments WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1)))    AS reactions;</code></pre>
<div class="out"> posts | comments | reactions
-------+----------+-----------
   214 |     3891 |     41207</div>
<div class="pitfall">
<p><strong>Trap — one <code>delete</code>, forty-five thousand rows.</strong> Deleting that user removes 45,312 rows across four tables, holds locks on all of them for the duration, and cannot be undone. Two habits prevent the bad version of this: count first (the query above), and prefer <strong>soft delete</strong> for anything a user can trigger — a <code>deletedAt DateTime?</code> column, filtered out in your queries. Real deletion then becomes a scheduled job that runs deliberately rather than a click that runs immediately. Chapter 4 shows the soft-delete filter pattern in full.</p>
</div>

<h3>Reading and writing the "many" side</h3>
<pre><code><span class="tok-comment">// Filter the children as you include them</span>
const u = await prisma.user.findUniqueOrThrow({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true },
    },
  },
});

<span class="tok-comment">// Nested writes on the collection — five operations, one call</span>
await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      create:     [{ title: 'Bai moi' }],              <span class="tok-comment">// new child</span>
      connect:    [{ id: 42 }],                        <span class="tok-comment">// adopt an existing one</span>
      disconnect: [{ id: 17 }],                        <span class="tok-comment">// orphan it (optional relations only)</span>
      update:     [{ where: { id: 3 }, data: { published: true } }],
      deleteMany: { published: false },                <span class="tok-comment">// remove matching children</span>
    },
  },
});</code></pre>
<div class="out">prisma:query BEGIN
prisma:query INSERT INTO "public"."posts" ("title","author_id") VALUES ($1,$2) RETURNING "id"
prisma:query UPDATE "public"."posts" SET "author_id" = $1 WHERE ("public"."posts"."id" = $2)
prisma:query UPDATE "public"."posts" SET "author_id" = $1 WHERE ("public"."posts"."id" = $2)
prisma:query UPDATE "public"."posts" SET "published" = $1 WHERE ("public"."posts"."id" = $2)
prisma:query DELETE FROM "public"."posts" WHERE ("public"."posts"."author_id" = $1 AND "public"."posts"."published" = $2)
prisma:query COMMIT</div>
<div class="callout ok">
<p><strong>All of it in one transaction.</strong> That is the real argument for nested writes: five operations that must all succeed or all fail, expressed once, with no <code>$transaction</code> boilerplate and no chance of forgetting the rollback. The cost is that the SQL is no longer obvious from the call — which is why <code>log: ['query']</code> was Lesson 0.2's most important advice.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">One-to-many relations</span><span class="lc-sub">prisma.io/docs · Required and optional forms, with the SQL each produces per provider</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions" target="_blank" rel="noopener"><span class="lc-ico">⚠️</span><span class="lc-body"><span class="lc-title">Referential actions</span><span class="lc-sub">prisma.io/docs · All five behaviours, the defaults table, and the caveats under <code>relationMode = "prisma"</code></span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes" target="_blank" rel="noopener"><span class="lc-ico">✍️</span><span class="lc-body"><span class="lc-title">Nested writes</span><span class="lc-sub">prisma.io/docs · Every nested operation, and which ones are legal on which relation kind</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, constraints chapter</span><span class="lc-sub">What <code>ON DELETE CASCADE</code> costs in locks, and why a deep cascade is a long transaction</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Pick the right <code>onDelete</code> for eight real relations, then predict what a delete removes</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Một–nhiều, và năm hành vi <code>onDelete</code></h2>
<p class="lead">Một–nhiều chiếm chín trên mười quan hệ. Phần khai báo thì dễ; phần đáng để bạn chú ý là chuyện gì xảy ra khi hàng cha bị xoá, vì có tới năm câu trả lời, chúng cư xử rất khác nhau trên dữ liệu thật, và giá trị mặc định không phải thứ phần lớn người ta tưởng.</p>

<h3>Bắt buộc hay tuỳ chọn — lựa chọn định hình mã của bạn</h3>
<pre><code>model Post {
  id         Int       @id @default(autoincrement())
  title      String

  <span class="tok-comment">// BẮT BUỘC: mọi bài viết đều phải có tác giả</span>
  authorId   Int       @map("author_id")
  author     User      @relation(fields: [authorId], references: [id])

  <span class="tok-comment">// TUỲ CHỌN: một bài viết có thể thuộc hoặc không thuộc chuyên mục nào</span>
  categoryId Int?      @map("category_id")
  category   Category? @relation(fields: [categoryId], references: [id])

  @@index([authorId])
  @@index([categoryId])
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Bắt buộc (<code>Int</code> + <code>User</code>)</span><span class="v"><code>NOT NULL</code>. <code>create</code> không biên dịch được nếu thiếu tác giả. Trường quan hệ có kiểu <code>User</code>, không bao giờ <code>null</code>, nên <code>post.author.email</code> không cần canh gác sau một lần <code>include</code>.</span></div>
  <div class="kv"><span class="k">Tuỳ chọn (<code>Int?</code> + <code>Category?</code>)</span><span class="v">Cho phép null. <code>create</code> bỏ qua được, và mọi lần đọc đều phải xử lý <code>null</code>. Nó cũng mở khoá <code>onDelete: SetNull</code>, thứ mà bản bắt buộc không dùng được.</span></div>
  <div class="kv"><span class="k">Hai trường phải khớp nhau</span><span class="v"><code>Int</code> đi với <code>Category?</code> là lỗi kiểm, và <code>Int?</code> đi với <code>Category</code> cũng vậy. Tính tuỳ chọn nằm ở cả hai hoặc không ở đâu cả.</span></div>
  <div class="kv"><span class="k">Đánh chỉ mục. Luôn luôn.</span><span class="v">Cả PostgreSQL lẫn Prisma đều không đánh chỉ mục cho cột tham chiếu. <code>@@index([authorId])</code> trên thực tế là bắt buộc, và Bài 2.3 nói quên nó thì tốn gì.</span></div>
</div>

<h3>Năm hành vi, chạy trên hàng dữ liệu thật</h3>
<pre><code><span class="tok-comment">// Dựng: một tác giả, ba bài viết, rồi xoá tác giả</span>
await prisma.user.create({
  data: {
    email: 'an@example.com',
    posts: { create: [{ title: 'A' }, { title: 'B' }, { title: 'C' }] },
  },
});
await prisma.user.delete({ where: { email: 'an@example.com' } });</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>Restrict</code> — từ chối khi còn con</span><span class="lz-lnote">Lệnh xoá ném <code>P2003</code>. Không thứ gì bị gỡ đi. Bạn phải xoá hoặc chuyển các bài viết trước. <strong>Đây là mặc định của Prisma cho quan hệ bắt buộc</strong>, và nó là lựa chọn an toàn: không dữ liệu nào biến mất một cách bất ngờ.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Cascade</code> — kéo con đi theo</span><span class="lz-lnote">Tác giả và cả ba bài viết biến mất, trong một câu lệnh, do PostgreSQL thi hành. Đúng cho dữ liệu thật sự thuộc sở hữu (bình luận của một bài viết, dòng hàng của một đơn hàng). Nguy hiểm ở chỗ "thuộc sở hữu" chỉ là một giả định — xoá dây chuyền qua bốn tầng có thể xoá nhiều hơn bạn định rất nhiều.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>SetNull</code> — cố ý để chúng mồ côi</span><span class="lz-lnote">Tác giả mất, ba bài viết sống sót với <code>author_id = NULL</code>. Cần quan hệ tuỳ chọn; đặt lên quan hệ bắt buộc thì Prisma từ chối lược đồ. Đúng khi con sống lâu hơn cha — một bài viết mà chuyên mục của nó bị xoá.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>SetDefault</code> — chuyển sang một giá trị dự phòng</span><span class="lz-lnote">Con nhận <code>@default</code> của cột, nên cái mặc định đó phải trỏ tới một hàng có thật — một "tác giả không rõ" đóng thế. Ít dùng, và nó hỏng rất ầm ĩ nếu chính cái id mặc định cũng đã bị xoá.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>NoAction</code> — trao lại cho cơ sở dữ liệu</span><span class="lz-lnote">Prisma không phát ra hành vi nào và để ràng buộc tự quyết. Trên PostgreSQL nó hành xử như <code>Restrict</code> nhưng hoãn được tới cuối giao dịch, và đó là điều duy nhất <code>Restrict</code> không làm được. Chỉ với tay tới nó khi bạn cần đúng điều đó.</span></div>
</div>
<pre><code><span class="tok-comment">// Restrict (mặc định) — thất bại trông thế nào</span>
await prisma.user.delete({ where: { email: 'an@example.com' } });</code></pre>
<div class="out">PrismaClientKnownRequestError:
Invalid &#96;prisma.user.delete()&#96; invocation:

Foreign key constraint violated on the constraint: &#96;posts_author_id_fkey&#96;
  code: 'P2003',
  meta: { modelName: 'User', field_name: 'posts_author_id_fkey (index)' }</div>
<pre><code><span class="tok-comment">// Cascade — một câu lệnh, PostgreSQL lo phần còn lại</span>
author User @relation(fields: [authorId], references: [id], onDelete: Cascade)</code></pre>
<div class="out">prisma:query DELETE FROM "public"."users" WHERE ("public"."users"."email" = $1 AND 1=1)
-- posts: còn lại 0 hàng</div>
<pre><code><span class="tok-comment">// SetNull — cần dạng tuỳ chọn</span>
categoryId Int?
category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)</code></pre>
<div class="out">SELECT id, title, category_id FROM posts;
 id | title | category_id
----+-------+-------------
  1 | A     |
  2 | B     |
  3 | C     |</div>

<h3>Các giá trị mặc định, và vì sao chúng khác SQL</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Quan hệ bắt buộc → <code>onDelete: Restrict</code></span><span class="v">Mặc định của Prisma. Xoá một cha còn con thì hỏng. Bảo thủ một cách có chủ ý — công cụ từ chối đoán rằng bạn muốn xoá dữ liệu mà bạn không nêu tên.</span></div>
  <div class="kv"><span class="k">Quan hệ tuỳ chọn → <code>onDelete: SetNull</code></span><span class="v">Mặc định của Prisma. Con sống sót với một <code>NULL</code>, và đó là hành vi duy nhất hợp lý khi mối nối vốn dĩ đã được phép vắng mặt.</span></div>
  <div class="kv"><span class="k">Cả hai → <code>onUpdate: Cascade</code></span><span class="v">Nếu giá trị khoá được tham chiếu đổi, các con tự đi theo. Chỗ này khác SQL thuần, vốn mặc định <code>NO ACTION</code>. Trên thực tế nó ít khi kích hoạt, vì khoá chính không nên đổi — nhưng khi bạn thật sự đánh số lại thứ gì đó thì nó cứu bạn.</span></div>
  <div class="kv"><span class="k">Cứ viết ra dù sao đi nữa</span><span class="v">Giá trị mặc định thì vô hình khi review. Một người đọc <code>@relation(fields: [x], references: [id])</code> không biết được bạn đã nghĩ về chuyện xoá hay chưa. Khai <code>onDelete</code> tường minh biến một giả định im lặng thành một quyết định người khác tranh luận được.</span></div>
</div>

<h3>Độ sâu dây chuyền: thứ cần kiểm trước khi đưa lên chạy</h3>
<pre><code>model User    { id Int @id  posts Post[] }
model Post    { id Int @id  authorId Int  author User @relation(fields:[authorId], references:[id], onDelete: Cascade)
                comments Comment[] }
model Comment { id Int @id  postId Int  post Post @relation(fields:[postId], references:[id], onDelete: Cascade)
                reactions Reaction[] }
model Reaction{ id Int @id  commentId Int comment Comment @relation(fields:[commentId], references:[id], onDelete: Cascade) }</code></pre>
<pre><code><span class="tok-comment">-- Trước khi xoá một người dùng, hỏi xem cái gì đi theo họ</span>
SELECT
  (SELECT count(*) FROM posts     WHERE author_id = 1)                          AS posts,
  (SELECT count(*) FROM comments  WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1)) AS comments,
  (SELECT count(*) FROM reactions WHERE comment_id IN
     (SELECT id FROM comments WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1)))    AS reactions;</code></pre>
<div class="out"> posts | comments | reactions
-------+----------+-----------
   214 |     3891 |     41207</div>
<div class="pitfall">
<p><strong>Bẫy — một lệnh <code>delete</code>, bốn mươi lăm nghìn hàng.</strong> Xoá người dùng ấy gỡ đi 45.312 hàng trải trên bốn bảng, giữ khoá trên tất cả trong suốt thời gian đó, và không hoàn tác được. Hai thói quen chặn được bản tệ nhất của chuyện này: đếm trước (câu truy vấn ở trên), và ưu tiên <strong>xoá mềm</strong> cho bất cứ thứ gì người dùng bấm được — một cột <code>deletedAt DateTime?</code>, lọc bỏ trong các truy vấn của bạn. Xoá thật khi đó thành một tác vụ chạy theo lịch một cách có chủ ý, thay vì một cú bấm chạy ngay lập tức. Chương 4 chỉ đủ mẫu lọc xoá mềm.</p>
</div>

<h3>Đọc và ghi phía "nhiều"</h3>
<pre><code><span class="tok-comment">// Lọc các con ngay lúc include chúng</span>
const u = await prisma.user.findUniqueOrThrow({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true },
    },
  },
});

<span class="tok-comment">// Ghi lồng nhau trên tập hợp — năm thao tác, một lời gọi</span>
await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      create:     [{ title: 'Bai moi' }],              <span class="tok-comment">// con mới</span>
      connect:    [{ id: 42 }],                        <span class="tok-comment">// nhận nuôi một con đã có</span>
      disconnect: [{ id: 17 }],                        <span class="tok-comment">// cho nó mồ côi (chỉ quan hệ tuỳ chọn)</span>
      update:     [{ where: { id: 3 }, data: { published: true } }],
      deleteMany: { published: false },                <span class="tok-comment">// xoá các con khớp điều kiện</span>
    },
  },
});</code></pre>
<div class="out">prisma:query BEGIN
prisma:query INSERT INTO "public"."posts" ("title","author_id") VALUES ($1,$2) RETURNING "id"
prisma:query UPDATE "public"."posts" SET "author_id" = $1 WHERE ("public"."posts"."id" = $2)
prisma:query UPDATE "public"."posts" SET "author_id" = $1 WHERE ("public"."posts"."id" = $2)
prisma:query UPDATE "public"."posts" SET "published" = $1 WHERE ("public"."posts"."id" = $2)
prisma:query DELETE FROM "public"."posts" WHERE ("public"."posts"."author_id" = $1 AND "public"."posts"."published" = $2)
prisma:query COMMIT</div>
<div class="callout ok">
<p><strong>Tất cả trong một giao dịch.</strong> Đó mới là lý lẽ thật cho ghi lồng nhau: năm thao tác phải cùng thành công hoặc cùng thất bại, diễn đạt một lần, không cần khung <code>$transaction</code> và không có cơ hội quên phần quay lui. Cái giá là SQL không còn hiển nhiên từ lời gọi — và vì thế <code>log: ['query']</code> là lời khuyên quan trọng nhất của Bài 0.2.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">One-to-many relations</span><span class="lc-sub">prisma.io/docs · Dạng bắt buộc và tuỳ chọn, kèm SQL mỗi dạng sinh ra theo từng provider</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions" target="_blank" rel="noopener"><span class="lc-ico">⚠️</span><span class="lc-body"><span class="lc-title">Referential actions</span><span class="lc-sub">prisma.io/docs · Cả năm hành vi, bảng giá trị mặc định, và các lưu ý dưới <code>relationMode = "prisma"</code></span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes" target="_blank" rel="noopener"><span class="lc-ico">✍️</span><span class="lc-body"><span class="lc-title">Nested writes</span><span class="lc-sub">prisma.io/docs · Mọi thao tác lồng nhau, và cái nào hợp lệ với kiểu quan hệ nào</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương ràng buộc</span><span class="lc-sub"><code>ON DELETE CASCADE</code> tốn gì về khoá, và vì sao một dây chuyền sâu là một giao dịch dài</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Chọn <code>onDelete</code> đúng cho tám quan hệ thật, rồi dự đoán một lệnh xoá gỡ đi những gì</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — One-to-one, and where to put the key|||3.3 — Một–một, và đặt khoá ở đâu',
      slug: 'pr-3-3-mot-mot',
      type: 'LESSON',
      description: 'Quan hệ một–một thật ra là một–nhiều cộng @unique, phía nào giữ khoá và vì sao chọn sai làm tạo người dùng thành bất khả, khi nào nên tách bảng và khi nào nên trải phẳng, và quan hệ một–một bắt buộc hai chiều là thứ không tồn tại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>One-to-one, and where to put the key</h2>
<p class="lead">A one-to-one relation is a one-to-many with a <code>@unique</code> on the foreign key. That is the entire mechanism, and it explains everything that follows — including why a required one-to-one on both sides is not something you can build, and why choosing the wrong side to hold the key can make a whole model uncreatable.</p>

<h3>The declaration</h3>
<pre><code>model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique

  profile Profile? <span class="tok-comment">// back-relation, always optional</span>

  @@map("users")
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  avatar String? @db.VarChar(500)

  userId Int     @unique @map("user_id")     <span class="tok-comment">// @unique is what makes it one-to-one</span>
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}</code></pre>
<div class="out">CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "bio" TEXT,
    "avatar" VARCHAR(500),
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;</div>
<div class="callout">
<p><strong>Remove the <code>@unique</code> and you have a one-to-many.</strong> Nothing else changes — same column, same constraint, same cascade. The unique index is the whole difference, which is worth knowing because it is also the whole cost: converting a one-to-one into a one-to-many later is a single <code>DROP INDEX</code>, while going the other way requires that no duplicates already exist.</p>
</div>

<h3>Which side holds the key — and why it decides your code</h3>
<pre><code><span class="tok-comment">// WRONG WAY ROUND — User holds the key to Profile</span>
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  profileId Int     @unique @map("profile_id")
  profile   Profile @relation(fields: [profileId], references: [id])
}
model Profile {
  id   Int     @id @default(autoincrement())
  bio  String?
  user User?
}</code></pre>
<pre><code><span class="tok-comment">// Now try to register a new user with no profile yet</span>
await prisma.user.create({ data: { email: 'moi@example.com' } });</code></pre>
<div class="out">TypeScript error:
Property 'profile' is missing in type '{ email: string; }' but required in type 'UserCreateInput'.

<span class="tok-comment">// You must invent an empty Profile before a User can exist:</span>
await prisma.user.create({
  data: { email: 'moi@example.com', profile: { create: {} } },
});</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Rule</span><span class="lz-t">The key goes on the side that is optional</span><span class="lz-d">A user exists without a profile; a profile makes no sense without a user. So <code>Profile</code> holds <code>userId</code>, and <code>User.profile</code> is <code>Profile?</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Corollary</span><span class="lz-t">The key goes on the side created later</span><span class="lz-d">The row that comes into existence second is the one that can reference the first. Reversing it means you cannot create either without the other.</span></div>
  <div class="lz-step"><span class="lz-k">Corollary</span><span class="lz-t">The key goes on the smaller or rarer side</span><span class="lz-d">Ten million users, forty thousand with a subscription → <code>Subscription.userId</code>, not <code>User.subscriptionId</code>, which would be a mostly-<code>NULL</code> column on the big table.</span></div>
  <div class="lz-step"><span class="lz-k">Fixing it later</span><span class="lz-t">A real migration with a backfill</span><span class="lz-d">Add the column on the other side, copy the pairs across, drop the old one. Not hard, but not free either — this is a decision worth five minutes now.</span></div>
</div>

<h3>The relation you cannot express</h3>
<pre><code><span class="tok-comment">// Required on BOTH sides — a user must have a profile AND vice versa</span>
model User    { id Int @id  profile Profile }   <span class="tok-comment">// no ?</span>
model Profile { id Int @id  userId Int @unique  user User @relation(...) }</code></pre>
<div class="out">error: Error parsing attribute "@relation": The relation field &#96;profile&#96; on model &#96;User&#96; is required. This is no longer valid because it's not possible to enforce this constraint on the database level.</div>
<p>Prisma is right to refuse. To create either row you would need the other to already exist, which is a chicken-and-egg the database cannot resolve — the only way out is deferrable constraints inside an explicit transaction, which is more machinery than the requirement is worth. The back-relation side of a one-to-one is <strong>always</strong> optional. Enforce "every user must have a profile" in your application, or ask why the two are separate tables at all.</p>

<h3>When to split a table, and when not to</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Split — the extra data is rare</span><span class="v">Forty thousand subscriptions on ten million users. As columns on <code>users</code> that is ten million mostly-<code>NULL</code> values in every row read; as a table it is a small side table touched only when needed.</span></div>
  <div class="kv"><span class="k">Split — the extra data is large</span><span class="v">A long biography, a settings blob, a cached render. PostgreSQL reads whole pages, so a 4 KB text column makes every <code>SELECT id, email</code> on that table slower, whether you asked for it or not.</span></div>
  <div class="kv"><span class="k">Split — the lifecycles differ</span><span class="v">Different retention rules, different access permissions, different write frequency. A <code>UserSession</code> written on every request does not belong in the same table as a <code>User</code> written twice a year.</span></div>
  <div class="kv"><span class="k">Do not split — three fields you always read</span><span class="v"><code>bio</code>, <code>avatar</code>, <code>website</code> on a profile page you load with the user anyway. That is a join on every request in exchange for nothing. Put them on <code>users</code>.</span></div>
  <div class="kv"><span class="k">Do not split — to "keep the model tidy"</span><span class="v">A table is a storage decision, not an organisational one. Tidy your code with modules; leave the schema shaped by how the data is read and written.</span></div>
</div>
<pre><code><span class="tok-comment">// From the CuongThai schema: extended profile fields live ON the user table,</span>
<span class="tok-comment">// because they are loaded with every profile view. Splitting would buy nothing.</span>
model User {
  id            Int       @id @default(autoincrement())
  username      String    @unique(map: "uk_user_username") @db.VarChar(50)
  email         String    @unique(map: "uk_user_email") @db.VarChar(100)
  fullName      String?   @map("full_name") @db.VarChar(100)
  bio           String?   @db.Text
  avatarUrl     String?   @map("avatar_url") @db.VarChar(500)
  coverPhotoUrl String?   @map("cover_photo_url") @db.VarChar(500)
  lastActiveAt  DateTime? @map("last_active_at")

  @@map("users")
}</code></pre>

<h3>Working with it from the client</h3>
<pre><code><span class="tok-comment">// Create both at once</span>
await prisma.user.create({
  data: { email: 'an@example.com', profile: { create: { bio: 'Xin chao' } } },
});

<span class="tok-comment">// Create the profile later, connecting to an existing user</span>
await prisma.profile.create({ data: { bio: 'Moi', user: { connect: { id: 1 } } } });

<span class="tok-comment">// Upsert the profile through the user — the idiomatic "save profile" call</span>
await prisma.user.update({
  where: { id: 1 },
  data: {
    profile: {
      upsert: { create: { bio: 'Lan dau' }, update: { bio: 'Cap nhat' } },
    },
  },
});

<span class="tok-comment">// Read it, handling the optional side</span>
const u = await prisma.user.findUniqueOrThrow({ where: { id: 1 }, include: { profile: true } });
console.log(u.profile?.bio ?? '(chua co)');

<span class="tok-comment">// Or traverse with the fluent API — one query, no include</span>
const p = await prisma.user.findUnique({ where: { id: 1 } }).profile();</code></pre>
<div class="out">prisma:query SELECT "public"."profiles"."id", "public"."profiles"."bio", "public"."profiles"."avatar", "public"."profiles"."user_id" FROM "public"."profiles" WHERE ("public"."profiles"."user_id" = $1) LIMIT $2 OFFSET $3</div>
<div class="pitfall">
<p><strong>Trap — the fluent API returns <code>null</code> for two different reasons.</strong> <code>prisma.user.findUnique({ where: { id: 999 } }).profile()</code> returns <code>null</code> whether user 999 does not exist or exists without a profile. Those are different situations and your error message probably needs to distinguish them. Use <code>findUniqueOrThrow</code> plus <code>include</code> when the difference matters; keep the fluent form for the case where "no profile" and "no user" are equally fine.</p>
</div>

<h3>The other one-to-one: sharing a primary key</h3>
<pre><code><span class="tok-comment">// The Profile's id IS the User's id — no separate key, no separate sequence</span>
model Profile {
  id   Int     @id                         <span class="tok-comment">// no @default — it comes from User</span>
  bio  String?
  user User    @relation(fields: [id], references: [id], onDelete: Cascade)

  @@map("profiles")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">What it buys</span><span class="v">One column instead of two, one index instead of two, and the one-to-one is enforced by the primary key itself — a duplicate is structurally impossible rather than merely constrained.</span></div>
  <div class="kv"><span class="k">What it costs</span><span class="v">You must supply the id on create (<code>{ id: user.id }</code>), so a profile can never exist before its user. Usually fine, occasionally awkward with data imports.</span></div>
  <div class="kv"><span class="k">When to reach for it</span><span class="v">Table splits where the child is genuinely an extension of the parent and will never be addressed independently. It is the tidiest form of the pattern and the least commonly known.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-one-relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">One-to-one relations</span><span class="lc-sub">prisma.io/docs · Both directions, the required-side restriction, and the shared-primary-key form</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#fluent-api" target="_blank" rel="noopener"><span class="lc-ico">🌊</span><span class="lc-body"><span class="lc-title">The fluent API</span><span class="lc-sub">prisma.io/docs · <code>.profile()</code>, <code>.posts()</code> and where chaining beats <code>include</code></span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/storage-toast.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — TOAST storage</span><span class="lc-sub">postgresql.org · Why a large text column affects reads that never select it, which is the real argument for splitting</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, tables chapter</span><span class="lc-sub">Row layout and page reads — the storage facts behind "split or not"</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Given five pairs of models, decide which side holds the key and justify it</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Một–một, và đặt khoá ở đâu</h2>
<p class="lead">Một quan hệ một–một chính là một–nhiều cộng thêm một <code>@unique</code> trên khoá ngoại. Đó là toàn bộ cơ chế, và nó giải thích mọi thứ theo sau — kể cả vì sao một quan hệ một–một bắt buộc ở cả hai phía là thứ bạn không dựng được, và vì sao chọn nhầm phía giữ khoá có thể khiến cả một model không tạo nổi.</p>

<h3>Cách khai</h3>
<pre><code>model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique

  profile Profile? <span class="tok-comment">// quan hệ ngược, luôn tuỳ chọn</span>

  @@map("users")
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  avatar String? @db.VarChar(500)

  userId Int     @unique @map("user_id")     <span class="tok-comment">// @unique là thứ biến nó thành một–một</span>
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}</code></pre>
<div class="out">CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "bio" TEXT,
    "avatar" VARCHAR(500),
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;</div>
<div class="callout">
<p><strong>Bỏ cái <code>@unique</code> đi thì bạn có một quan hệ một–nhiều.</strong> Không gì khác đổi — vẫn cột ấy, ràng buộc ấy, dây chuyền ấy. Chỉ mục unique là toàn bộ khác biệt, và điều đó đáng biết vì nó cũng là toàn bộ cái giá: đổi một–một thành một–nhiều về sau chỉ là một câu <code>DROP INDEX</code>, còn đi ngược lại thì đòi hỏi hiện chưa có bản trùng nào.</p>
</div>

<h3>Phía nào giữ khoá — và vì sao nó quyết định mã của bạn</h3>
<pre><code><span class="tok-comment">// NGƯỢC ĐỜI — User giữ khoá tới Profile</span>
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  profileId Int     @unique @map("profile_id")
  profile   Profile @relation(fields: [profileId], references: [id])
}
model Profile {
  id   Int     @id @default(autoincrement())
  bio  String?
  user User?
}</code></pre>
<pre><code><span class="tok-comment">// Giờ thử đăng ký một người dùng mới chưa có hồ sơ</span>
await prisma.user.create({ data: { email: 'moi@example.com' } });</code></pre>
<div class="out">TypeScript error:
Property 'profile' is missing in type '{ email: string; }' but required in type 'UserCreateInput'.

<span class="tok-comment">// Bạn buộc phải bịa ra một Profile rỗng trước khi một User được phép tồn tại:</span>
await prisma.user.create({
  data: { email: 'moi@example.com', profile: { create: {} } },
});</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Luật</span><span class="lz-t">Khoá nằm ở phía tuỳ chọn</span><span class="lz-d">Một người dùng tồn tại được mà chưa có hồ sơ; một hồ sơ thì vô nghĩa nếu không có người dùng. Nên <code>Profile</code> giữ <code>userId</code>, và <code>User.profile</code> là <code>Profile?</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Hệ quả</span><span class="lz-t">Khoá nằm ở phía được tạo sau</span><span class="lz-d">Hàng ra đời sau là hàng tham chiếu được tới hàng ra đời trước. Đảo ngược lại nghĩa là bạn không tạo được bên nào nếu thiếu bên kia.</span></div>
  <div class="lz-step"><span class="lz-k">Hệ quả</span><span class="lz-t">Khoá nằm ở phía nhỏ hơn hoặc hiếm hơn</span><span class="lz-d">Mười triệu người dùng, bốn mươi nghìn người có gói thuê bao → <code>Subscription.userId</code>, không phải <code>User.subscriptionId</code>, vốn sẽ là một cột gần như toàn <code>NULL</code> trên cái bảng khổng lồ.</span></div>
  <div class="lz-step"><span class="lz-k">Sửa về sau</span><span class="lz-t">Một migration thật kèm bước đổ dữ liệu</span><span class="lz-d">Thêm cột ở phía kia, chép các cặp sang, bỏ cột cũ. Không khó, nhưng cũng không miễn phí — đây là quyết định đáng dành năm phút ngay bây giờ.</span></div>
</div>

<h3>Quan hệ bạn không diễn đạt được</h3>
<pre><code><span class="tok-comment">// Bắt buộc ở CẢ HAI phía — người dùng phải có hồ sơ VÀ ngược lại</span>
model User    { id Int @id  profile Profile }   <span class="tok-comment">// không có ?</span>
model Profile { id Int @id  userId Int @unique  user User @relation(...) }</code></pre>
<div class="out">error: Error parsing attribute "@relation": The relation field &#96;profile&#96; on model &#96;User&#96; is required. This is no longer valid because it's not possible to enforce this constraint on the database level.</div>
<p>Prisma từ chối là đúng. Để tạo một trong hai hàng, bạn cần hàng kia đã tồn tại, và đó là bài toán con gà quả trứng mà cơ sở dữ liệu không giải nổi — lối thoát duy nhất là ràng buộc hoãn được bên trong một giao dịch tường minh, một bộ máy đắt hơn giá trị của yêu cầu ấy. Phía quan hệ ngược của một–một <strong>luôn luôn</strong> tuỳ chọn. Hãy thi hành luật "mọi người dùng phải có hồ sơ" trong ứng dụng, hoặc hỏi lại vì sao hai thứ đó lại là hai bảng riêng.</p>

<h3>Khi nào nên tách bảng, và khi nào không</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tách — phần dữ liệu thêm là hiếm</span><span class="v">Bốn mươi nghìn thuê bao trên mười triệu người dùng. Để thành cột trên <code>users</code> thì đó là mười triệu giá trị gần như toàn <code>NULL</code> nằm trong mọi lần đọc hàng; để thành bảng thì đó là một bảng phụ nhỏ chỉ bị chạm khi cần.</span></div>
  <div class="kv"><span class="k">Tách — phần dữ liệu thêm là lớn</span><span class="v">Một tiểu sử dài, một khối cài đặt, một bản kết xuất được lưu đệm. PostgreSQL đọc theo cả trang, nên một cột văn bản 4 KB làm mọi câu <code>SELECT id, email</code> trên bảng đó chậm đi, dù bạn có xin nó hay không.</span></div>
  <div class="kv"><span class="k">Tách — vòng đời khác nhau</span><span class="v">Luật giữ dữ liệu khác nhau, quyền truy cập khác nhau, tần suất ghi khác nhau. Một <code>UserSession</code> ghi ở mọi yêu cầu không thuộc về cùng cái bảng với một <code>User</code> ghi mỗi năm hai lần.</span></div>
  <div class="kv"><span class="k">Đừng tách — ba trường bạn luôn đọc cùng nhau</span><span class="v"><code>bio</code>, <code>avatar</code>, <code>website</code> trên một trang hồ sơ mà bạn vốn đã nạp cùng người dùng. Đó là một phép join ở mọi yêu cầu để đổi lấy con số không. Cứ để chúng trên <code>users</code>.</span></div>
  <div class="kv"><span class="k">Đừng tách — để "cho model gọn gàng"</span><span class="v">Một cái bảng là quyết định lưu trữ, không phải quyết định sắp xếp. Hãy dọn mã bằng module; để lược đồ được định hình bởi cách dữ liệu được đọc và ghi.</span></div>
</div>
<pre><code><span class="tok-comment">// Từ lược đồ CuongThai: các trường hồ sơ mở rộng nằm NGAY TRÊN bảng user,</span>
<span class="tok-comment">// vì chúng được nạp cùng mọi lần xem hồ sơ. Tách ra chẳng đổi lại được gì.</span>
model User {
  id            Int       @id @default(autoincrement())
  username      String    @unique(map: "uk_user_username") @db.VarChar(50)
  email         String    @unique(map: "uk_user_email") @db.VarChar(100)
  fullName      String?   @map("full_name") @db.VarChar(100)
  bio           String?   @db.Text
  avatarUrl     String?   @map("avatar_url") @db.VarChar(500)
  coverPhotoUrl String?   @map("cover_photo_url") @db.VarChar(500)
  lastActiveAt  DateTime? @map("last_active_at")

  @@map("users")
}</code></pre>

<h3>Làm việc với nó từ phía client</h3>
<pre><code><span class="tok-comment">// Tạo cả hai cùng lúc</span>
await prisma.user.create({
  data: { email: 'an@example.com', profile: { create: { bio: 'Xin chao' } } },
});

<span class="tok-comment">// Tạo hồ sơ sau, nối tới một người dùng đã có</span>
await prisma.profile.create({ data: { bio: 'Moi', user: { connect: { id: 1 } } } });

<span class="tok-comment">// Upsert hồ sơ thông qua người dùng — lời gọi "lưu hồ sơ" đúng kiểu</span>
await prisma.user.update({
  where: { id: 1 },
  data: {
    profile: {
      upsert: { create: { bio: 'Lan dau' }, update: { bio: 'Cap nhat' } },
    },
  },
});

<span class="tok-comment">// Đọc nó, có xử lý phía tuỳ chọn</span>
const u = await prisma.user.findUniqueOrThrow({ where: { id: 1 }, include: { profile: true } });
console.log(u.profile?.bio ?? '(chua co)');

<span class="tok-comment">// Hoặc đi qua bằng API kiểu chuỗi — một câu truy vấn, không cần include</span>
const p = await prisma.user.findUnique({ where: { id: 1 } }).profile();</code></pre>
<div class="out">prisma:query SELECT "public"."profiles"."id", "public"."profiles"."bio", "public"."profiles"."avatar", "public"."profiles"."user_id" FROM "public"."profiles" WHERE ("public"."profiles"."user_id" = $1) LIMIT $2 OFFSET $3</div>
<div class="pitfall">
<p><strong>Bẫy — API kiểu chuỗi trả về <code>null</code> vì hai lý do khác nhau.</strong> <code>prisma.user.findUnique({ where: { id: 999 } }).profile()</code> trả <code>null</code> dù người dùng 999 không tồn tại hay tồn tại mà chưa có hồ sơ. Đó là hai tình huống khác nhau và thông báo lỗi của bạn nhiều khả năng cần phân biệt chúng. Hãy dùng <code>findUniqueOrThrow</code> cộng <code>include</code> khi khác biệt ấy quan trọng; giữ dạng chuỗi cho trường hợp "không có hồ sơ" và "không có người dùng" đều ổn như nhau.</p>
</div>

<h3>Dạng một–một còn lại: dùng chung khoá chính</h3>
<pre><code><span class="tok-comment">// id của Profile CHÍNH LÀ id của User — không khoá riêng, không sequence riêng</span>
model Profile {
  id   Int     @id                         <span class="tok-comment">// không @default — nó đến từ User</span>
  bio  String?
  user User    @relation(fields: [id], references: [id], onDelete: Cascade)

  @@map("profiles")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó đổi lại được gì</span><span class="v">Một cột thay vì hai, một chỉ mục thay vì hai, và tính một–một do chính khoá chính thi hành — một bản trùng là bất khả về cấu trúc chứ không chỉ bị ràng buộc chặn.</span></div>
  <div class="kv"><span class="k">Nó tốn gì</span><span class="v">Bạn phải cung cấp id lúc tạo (<code>{ id: user.id }</code>), nên một hồ sơ không bao giờ tồn tại trước người dùng của nó. Thường thì ổn, thỉnh thoảng vướng khi nhập dữ liệu.</span></div>
  <div class="kv"><span class="k">Khi nào với tay tới nó</span><span class="v">Những lần tách bảng mà con thật sự là phần mở rộng của cha và sẽ không bao giờ được gọi tên độc lập. Đây là dạng gọn nhất của mẫu này và cũng là dạng ít người biết nhất.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-one-relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">One-to-one relations</span><span class="lc-sub">prisma.io/docs · Cả hai chiều, hạn chế ở phía bắt buộc, và dạng dùng chung khoá chính</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#fluent-api" target="_blank" rel="noopener"><span class="lc-ico">🌊</span><span class="lc-body"><span class="lc-title">API kiểu chuỗi</span><span class="lc-sub">prisma.io/docs · <code>.profile()</code>, <code>.posts()</code> và chỗ nối chuỗi thắng <code>include</code></span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/storage-toast.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — lưu trữ TOAST</span><span class="lc-sub">postgresql.org · Vì sao một cột văn bản lớn ảnh hưởng cả những lần đọc không hề chọn nó, tức lý lẽ thật cho việc tách bảng</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương bảng</span><span class="lc-sub">Bố cục hàng và cách đọc trang — những sự thật lưu trữ đứng sau câu hỏi "tách hay không"</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Cho năm cặp model, quyết định phía nào giữ khoá và giải thích vì sao</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Many-to-many: implicit versus explicit|||3.4 — Nhiều–nhiều: ẩn so với tường minh',
      slug: 'pr-3-4-nhieu-nhieu',
      type: 'LESSON',
      description: 'Bảng nối Prisma tự tạo trông ra sao và đặt tên theo luật nào, API connect/disconnect/set, khi nào buộc phải chuyển sang bảng tường minh, cách chuyển mà không mất dữ liệu, và vì sao gần như dự án nào cũng phải chuyển.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Many-to-many: implicit versus explicit</h2>
<p class="lead">Many-to-many needs a third table. Prisma offers to create and manage it invisibly, which is delightful for about six months and then becomes the migration you were putting off. This lesson shows both forms, the exact moment the implicit one stops being enough, and how to convert without losing rows.</p>

<h3>Implicit: two lines, no join model</h3>
<pre><code>model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[] <span class="tok-comment">// that is all</span>
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[] <span class="tok-comment">// and that</span>
}</code></pre>
<pre><code>npx prisma migrate dev --name nhieu_nhieu_an
docker exec -it pg-hoc psql -U student -d hocprisma -c "\\d \\"_CategoryToPost\\""</code></pre>
<div class="out">           Table "public._CategoryToPost"
 Column |  Type   | Nullable | Default
--------+---------+----------+---------
 A      | integer | not null |
 B      | integer | not null |
Indexes:
    "_CategoryToPost_AB_pkey" PRIMARY KEY, btree ("A", "B")
    "_CategoryToPost_B_index" btree ("B")
Foreign-key constraints:
    "_CategoryToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"(id) ON DELETE CASCADE
    "_CategoryToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"(id) ON DELETE CASCADE</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Name</span><span class="lz-t"><code>_</code> + the two models, alphabetically</span><span class="lz-d"><code>_CategoryToPost</code>, not <code>_PostToCategory</code>. Alphabetical order also decides which model is <code>A</code> and which is <code>B</code>, which matters the moment you write raw SQL against it.</span></div>
  <div class="lz-step"><span class="lz-k">Columns</span><span class="lz-t">Exactly <code>A</code> and <code>B</code></span><span class="lz-d">No timestamps, no extra fields, no id of its own. The primary key is the pair, so a duplicate link is structurally impossible.</span></div>
  <div class="lz-step"><span class="lz-k">Cascades</span><span class="lz-t">Always <code>ON DELETE CASCADE</code></span><span class="lz-d">Not configurable. Delete a post and its links vanish, which is correct — a link to a deleted row is meaningless.</span></div>
  <div class="lz-step"><span class="lz-k">Visibility</span><span class="lz-t">Absent from Prisma Client</span><span class="lz-d">There is no <code>prisma.categoryToPost</code>. You manipulate the relation only through <code>connect</code>, <code>disconnect</code> and <code>set</code> on either side.</span></div>
</div>
<pre><code><span class="tok-comment">// The whole API for an implicit many-to-many</span>
await prisma.post.create({
  data: { title: 'A', categories: { connect: [{ id: 1 }, { id: 2 }] } },
});

await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      connect:    [{ id: 3 }],       <span class="tok-comment">// add one</span>
      disconnect: [{ id: 1 }],       <span class="tok-comment">// remove one</span>
    },
  },
});

<span class="tok-comment">// set = replace the entire list. This is the one people get wrong.</span>
await prisma.post.update({
  where: { id: 1 },
  data: { categories: { set: [{ id: 2 }, { id: 4 }] } },
});

<span class="tok-comment">// Query in both directions</span>
await prisma.post.findMany({ where: { categories: { some: { name: 'nodejs' } } } });
await prisma.category.findMany({ include: { _count: { select: { posts: true } } } });</code></pre>
<div class="out">prisma:query DELETE FROM "public"."_CategoryToPost" WHERE "B" = $1
prisma:query INSERT INTO "public"."_CategoryToPost" ("A","B") VALUES ($1,$2), ($3,$4) ON CONFLICT DO NOTHING</div>
<div class="pitfall">
<p><strong>Trap — <code>set</code> deletes everything first.</strong> It is a replace, not a merge: every existing link is removed and the given list is inserted. Send <code>set: []</code> and you have cleared the relation entirely. This is exactly what a naive "save the form" handler does when the user's browser sent no categories — one empty multi-select and a post's tags are gone. Use <code>connect</code> and <code>disconnect</code> for incremental edits, and reserve <code>set</code> for when you genuinely have the complete intended list in hand.</p>
</div>

<h3>Explicit: the join table as a model you own</h3>
<pre><code>model Post {
  id         Int            @id @default(autoincrement())
  title      String
  categories PostCategory[]
}

model Category {
  id    Int            @id @default(autoincrement())
  name  String         @unique
  posts PostCategory[]
}

model PostCategory {
  postId     Int      @map("post_id")
  categoryId Int      @map("category_id")

  <span class="tok-comment">// The reason to do this at all: the join carries data</span>
  attachedAt DateTime @default(now()) @map("gan_luc")
  assignerId Int?     @map("nguoi_gan_id")
  isPrimary  Boolean  @default(false) @map("la_chinh")

  post       Post     @relation(fields: [postId],     references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@id([postId, categoryId])
  @@index([categoryId])
  @@map("post_category")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">You get a delegate</span><span class="v"><code>prisma.postCategory.findMany()</code>, <code>createMany</code>, <code>deleteMany</code>, <code>groupBy</code> — the join is an ordinary model with the full client API.</span></div>
  <div class="kv"><span class="k">You get extra columns</span><span class="v">When the link was made, who made it, whether it is the primary category, a sort order. None of this is expressible implicitly.</span></div>
  <div class="kv"><span class="k">You get per-side cascades</span><span class="v">Here: delete a post and its links go; delete a category and the delete is <em>refused</em> while posts still use it. The implicit table cascades both ways with no choice.</span></div>
  <div class="kv"><span class="k">You pay in verbosity</span><span class="v"><code>connect</code> becomes a nested create through the join model. Every query gains one level of nesting. It is more code for more control, and it is the right trade more often than people expect.</span></div>
</div>
<pre><code><span class="tok-comment">// Writing through an explicit join</span>
await prisma.post.create({
  data: {
    title: 'Bai moi',
    categories: {
      create: [
        { category: { connect: { id: 1 } }, isPrimary: true },
        { category: { connect: { id: 2 } } },
      ],
    },
  },
});

<span class="tok-comment">// Reading: two levels of nesting instead of one</span>
const p = await prisma.post.findUniqueOrThrow({
  where: { id: 1 },
  include: { categories: { include: { category: true }, orderBy: { attachedAt: 'asc' } } },
});
console.log(p.categories.map((c) =&gt; c.category.name));

<span class="tok-comment">// And the thing implicit cannot do at all: query the link itself</span>
const stats = await prisma.postCategory.groupBy({
  by: ['categoryId'],
  _count: { _all: true },
  orderBy: { _count: { categoryId: 'desc' } },
  take: 5,
});</code></pre>
<div class="out">[
  { categoryId: 3, _count: { _all: 1204 } },
  { categoryId: 1, _count: { _all: 987 } },
  { categoryId: 7, _count: { _all: 412 } }
]</div>

<h3>Choosing, honestly</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Implicit is right</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A pure set membership</span><span class="lz-nsub">Post ↔ tag, user ↔ role, product ↔ colour. The link carries no information beyond "these two are connected", and you are confident it never will.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Explicit is right</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The link has attributes</span><span class="lz-nsub">Enrolment with a grade, membership with a role, order line with a quantity. The moment you want <em>when</em> or <em>how much</em>, implicit is finished.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">You need to query the link</span><span class="lz-nsub">"Which tags are used most", "links created this week", "remove every link older than a year". All trivial with a delegate and impossible without one.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Another table references the link</span><span class="lz-nsub">An audit record pointing at a specific enrolment needs that enrolment to have a stable, referenceable identity.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">You share the database</span><span class="lz-nsub">A table called <code>_CategoryToPost</code> with columns <code>A</code> and <code>B</code> is undocumentable to a DBA or an analytics team. Give it a real name.</span></div></div>
  </div>
</div>
<div class="callout warn">
<p><strong>The honest recommendation: start explicit unless you are certain.</strong> Implicit is genuinely nicer to write, and the conversion later is a real migration with a data copy — which someone will schedule for "next sprint" for a year. If there is any chance the link will one day need a timestamp, a creator, or a sort order, the explicit version costs you twenty extra lines today and saves that migration entirely.</p>
</div>

<h3>Converting implicit to explicit, without losing rows</h3>
<pre><code><span class="tok-comment">-- Hand-written migration. The old table's columns are A and B, alphabetically:</span>
<span class="tok-comment">-- A = Category (the alphabetically first model), B = Post.</span>

CREATE TABLE "post_category" (
    "post_id"     INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "gan_luc"     TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "la_chinh"    BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "post_category_pkey" PRIMARY KEY ("post_id","category_id")
);

<span class="tok-comment">-- Copy every existing link across BEFORE dropping anything</span>
INSERT INTO "post_category" ("post_id", "category_id")
SELECT "B", "A" FROM "_CategoryToPost";

CREATE INDEX "post_category_category_id_idx" ON "post_category"("category_id");
ALTER TABLE "post_category" ADD CONSTRAINT "post_category_post_id_fkey"
  FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE;
ALTER TABLE "post_category" ADD CONSTRAINT "post_category_category_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT;

<span class="tok-comment">-- Only now, and only after verifying the counts match</span>
DROP TABLE "_CategoryToPost";</code></pre>
<pre><code><span class="tok-comment">-- The verification that must pass before the DROP</span>
SELECT (SELECT count(*) FROM "_CategoryToPost") AS cu,
       (SELECT count(*) FROM "post_category")   AS moi;</code></pre>
<div class="out"> cu  | moi
-----+------
 8412| 8412</div>
<div class="callout ok">
<p><strong>Note the <code>SELECT "B", "A"</code>.</strong> The columns are swapped because <code>A</code> is <code>Category</code> — alphabetically before <code>Post</code> — while the new table lists <code>post_id</code> first. Getting this backwards silently pairs every post with the wrong category, and because both columns are integers nothing complains. This is the single highest-risk line in the migration, and the count check above does not catch it: verify a handful of pairs by hand as well.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Many-to-many relations</span><span class="lc-sub">prisma.io/docs · Both forms in full, including the naming conventions for the implicit table</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations#conventions-for-relation-tables-in-implicit-m-n-relations" target="_blank" rel="noopener"><span class="lc-ico">📐</span><span class="lc-body"><span class="lc-title">Implicit relation table conventions</span><span class="lc-sub">prisma.io/docs · The A/B rule and how to override the table name with <code>@relation("Ten")</code></span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#disconnect-all-related-records" target="_blank" rel="noopener"><span class="lc-ico">✂️</span><span class="lc-body"><span class="lc-title">connect, disconnect, set</span><span class="lc-sub">prisma.io/docs · What each one emits, and the replace semantics of <code>set</code> spelled out</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, JOIN chapter</span><span class="lc-sub">Join tables from the SQL side — what Prisma is generating, and how to query it directly</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Convert an implicit relation to explicit, with the data copy and the verification query</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Nhiều–nhiều: ẩn so với tường minh</h2>
<p class="lead">Nhiều–nhiều cần một bảng thứ ba. Prisma đề nghị tạo và quản lý nó một cách vô hình, và điều đó thật dễ chịu trong khoảng sáu tháng rồi trở thành cái migration bạn cứ hoãn mãi. Bài này chỉ cả hai dạng, đúng thời điểm dạng ẩn ngừng đủ dùng, và cách chuyển đổi mà không mất hàng nào.</p>

<h3>Ẩn: hai dòng, không có model nối</h3>
<pre><code>model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[] <span class="tok-comment">// chỉ vậy thôi</span>
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[] <span class="tok-comment">// và vậy</span>
}</code></pre>
<pre><code>npx prisma migrate dev --name nhieu_nhieu_an
docker exec -it pg-hoc psql -U student -d hocprisma -c "\\d \\"_CategoryToPost\\""</code></pre>
<div class="out">           Table "public._CategoryToPost"
 Column |  Type   | Nullable | Default
--------+---------+----------+---------
 A      | integer | not null |
 B      | integer | not null |
Indexes:
    "_CategoryToPost_AB_pkey" PRIMARY KEY, btree ("A", "B")
    "_CategoryToPost_B_index" btree ("B")
Foreign-key constraints:
    "_CategoryToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"(id) ON DELETE CASCADE
    "_CategoryToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"(id) ON DELETE CASCADE</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Tên</span><span class="lz-t"><code>_</code> cộng hai model, theo thứ tự bảng chữ cái</span><span class="lz-d"><code>_CategoryToPost</code>, không phải <code>_PostToCategory</code>. Thứ tự chữ cái cũng quyết định model nào là <code>A</code> và model nào là <code>B</code>, và điều đó quan trọng ngay khi bạn viết SQL thô lên nó.</span></div>
  <div class="lz-step"><span class="lz-k">Cột</span><span class="lz-t">Đúng <code>A</code> và <code>B</code></span><span class="lz-d">Không mốc thời gian, không trường phụ, không id riêng. Khoá chính là cặp giá trị, nên một mối nối trùng là bất khả về cấu trúc.</span></div>
  <div class="lz-step"><span class="lz-k">Dây chuyền</span><span class="lz-t">Luôn <code>ON DELETE CASCADE</code></span><span class="lz-d">Không cấu hình được. Xoá một bài viết thì các mối nối của nó biến mất, và như thế là đúng — một mối nối tới một hàng đã bị xoá thì vô nghĩa.</span></div>
  <div class="lz-step"><span class="lz-k">Khả kiến</span><span class="lz-t">Vắng mặt khỏi Prisma Client</span><span class="lz-d">Không có <code>prisma.categoryToPost</code>. Bạn chỉ thao tác quan hệ ấy qua <code>connect</code>, <code>disconnect</code> và <code>set</code> từ một trong hai phía.</span></div>
</div>
<pre><code><span class="tok-comment">// Toàn bộ API của một quan hệ nhiều–nhiều ẩn</span>
await prisma.post.create({
  data: { title: 'A', categories: { connect: [{ id: 1 }, { id: 2 }] } },
});

await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      connect:    [{ id: 3 }],       <span class="tok-comment">// thêm một</span>
      disconnect: [{ id: 1 }],       <span class="tok-comment">// bỏ một</span>
    },
  },
});

<span class="tok-comment">// set = thay thế toàn bộ danh sách. Đây là chỗ người ta hay làm sai.</span>
await prisma.post.update({
  where: { id: 1 },
  data: { categories: { set: [{ id: 2 }, { id: 4 }] } },
});

<span class="tok-comment">// Truy vấn từ cả hai chiều</span>
await prisma.post.findMany({ where: { categories: { some: { name: 'nodejs' } } } });
await prisma.category.findMany({ include: { _count: { select: { posts: true } } } });</code></pre>
<div class="out">prisma:query DELETE FROM "public"."_CategoryToPost" WHERE "B" = $1
prisma:query INSERT INTO "public"."_CategoryToPost" ("A","B") VALUES ($1,$2), ($3,$4) ON CONFLICT DO NOTHING</div>
<div class="pitfall">
<p><strong>Bẫy — <code>set</code> xoá sạch trước đã.</strong> Nó là thay thế chứ không phải trộn: mọi mối nối hiện có bị gỡ và danh sách được đưa vào sẽ chèn mới. Gửi <code>set: []</code> là bạn đã xoá trắng quan hệ. Đây đúng là thứ một handler "lưu biểu mẫu" ngây thơ làm khi trình duyệt của người dùng không gửi chuyên mục nào — một ô chọn nhiều để trống và các thẻ của bài viết bay sạch. Hãy dùng <code>connect</code> và <code>disconnect</code> cho các lần sửa từng phần, và để dành <code>set</code> cho khi bạn thật sự cầm trong tay danh sách đầy đủ như ý.</p>
</div>

<h3>Tường minh: bảng nối là một model do bạn sở hữu</h3>
<pre><code>model Post {
  id         Int            @id @default(autoincrement())
  title      String
  categories PostCategory[]
}

model Category {
  id    Int            @id @default(autoincrement())
  name  String         @unique
  posts PostCategory[]
}

model PostCategory {
  postId     Int      @map("post_id")
  categoryId Int      @map("category_id")

  <span class="tok-comment">// Lý do làm chuyện này ngay từ đầu: mối nối mang theo dữ liệu</span>
  attachedAt DateTime @default(now()) @map("gan_luc")
  assignerId Int?     @map("nguoi_gan_id")
  isPrimary  Boolean  @default(false) @map("la_chinh")

  post       Post     @relation(fields: [postId],     references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@id([postId, categoryId])
  @@index([categoryId])
  @@map("post_category")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Bạn có một delegate</span><span class="v"><code>prisma.postCategory.findMany()</code>, <code>createMany</code>, <code>deleteMany</code>, <code>groupBy</code> — bảng nối là một model bình thường với đầy đủ API của client.</span></div>
  <div class="kv"><span class="k">Bạn có các cột phụ</span><span class="v">Mối nối được tạo lúc nào, ai tạo, có phải chuyên mục chính không, thứ tự sắp xếp. Không thứ nào trong đó diễn đạt được ở dạng ẩn.</span></div>
  <div class="kv"><span class="k">Bạn có dây chuyền riêng cho từng phía</span><span class="v">Ở đây: xoá một bài viết thì các mối nối đi theo; xoá một chuyên mục thì lệnh xoá bị <em>từ chối</em> khi vẫn còn bài dùng nó. Bảng ẩn thì cascade cả hai chiều, không cho chọn.</span></div>
  <div class="kv"><span class="k">Bạn trả giá bằng sự dài dòng</span><span class="v"><code>connect</code> trở thành một lệnh create lồng qua model nối. Mọi truy vấn mọc thêm một tầng lồng. Nhiều mã hơn để đổi lấy nhiều quyền kiểm soát hơn, và đó là đánh đổi đúng đắn thường xuyên hơn người ta tưởng.</span></div>
</div>
<pre><code><span class="tok-comment">// Ghi qua một bảng nối tường minh</span>
await prisma.post.create({
  data: {
    title: 'Bai moi',
    categories: {
      create: [
        { category: { connect: { id: 1 } }, isPrimary: true },
        { category: { connect: { id: 2 } } },
      ],
    },
  },
});

<span class="tok-comment">// Đọc: hai tầng lồng thay vì một</span>
const p = await prisma.post.findUniqueOrThrow({
  where: { id: 1 },
  include: { categories: { include: { category: true }, orderBy: { attachedAt: 'asc' } } },
});
console.log(p.categories.map((c) =&gt; c.category.name));

<span class="tok-comment">// Và điều dạng ẩn hoàn toàn không làm được: truy vấn chính mối nối</span>
const stats = await prisma.postCategory.groupBy({
  by: ['categoryId'],
  _count: { _all: true },
  orderBy: { _count: { categoryId: 'desc' } },
  take: 5,
});</code></pre>
<div class="out">[
  { categoryId: 3, _count: { _all: 1204 } },
  { categoryId: 1, _count: { _all: 987 } },
  { categoryId: 7, _count: { _all: 412 } }
]</div>

<h3>Chọn thế nào, nói thật</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Ẩn là đúng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một quan hệ thuộc-tập thuần tuý</span><span class="lz-nsub">Bài viết ↔ thẻ, người dùng ↔ vai trò, sản phẩm ↔ màu. Mối nối không mang thông tin nào ngoài "hai cái này có nối với nhau", và bạn tự tin nó sẽ không bao giờ mang.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Tường minh là đúng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mối nối có thuộc tính</span><span class="lz-nsub">Ghi danh kèm điểm, thành viên kèm vai trò, dòng đơn hàng kèm số lượng. Ngay khi bạn muốn biết <em>lúc nào</em> hay <em>bao nhiêu</em> thì dạng ẩn hết đường.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn cần truy vấn chính mối nối</span><span class="lz-nsub">"Thẻ nào được dùng nhiều nhất", "các mối nối tạo trong tuần này", "bỏ mọi mối nối cũ hơn một năm". Đều dễ như bỡn khi có delegate và bất khả khi không có.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một bảng khác tham chiếu tới mối nối</span><span class="lz-nsub">Một bản ghi kiểm toán trỏ tới một lần ghi danh cụ thể thì cần lần ghi danh ấy có một danh tính ổn định, tham chiếu được.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn dùng chung cơ sở dữ liệu</span><span class="lz-nsub">Một cái bảng tên <code>_CategoryToPost</code> với hai cột <code>A</code> và <code>B</code> là thứ không giải thích nổi cho một DBA hay một đội phân tích. Hãy cho nó một cái tên tử tế.</span></div></div>
  </div>
</div>
<div class="callout warn">
<p><strong>Lời khuyên thật lòng: bắt đầu bằng tường minh trừ khi bạn chắc chắn.</strong> Dạng ẩn quả thật dễ chịu hơn khi viết, còn việc chuyển đổi về sau là một migration thật kèm một lần chép dữ liệu — thứ mà ai đó sẽ xếp vào "sprint sau" suốt một năm. Nếu có bất kỳ khả năng nào là mối nối một ngày sẽ cần một mốc thời gian, một người tạo, hay một thứ tự sắp xếp, thì bản tường minh tốn của bạn hai mươi dòng hôm nay và tiết kiệm trọn cái migration ấy.</p>
</div>

<h3>Chuyển từ ẩn sang tường minh mà không mất hàng nào</h3>
<pre><code><span class="tok-comment">-- Migration viết tay. Hai cột của bảng cũ là A và B, theo thứ tự chữ cái:</span>
<span class="tok-comment">-- A = Category (model đứng trước theo bảng chữ cái), B = Post.</span>

CREATE TABLE "post_category" (
    "post_id"     INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "gan_luc"     TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "la_chinh"    BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "post_category_pkey" PRIMARY KEY ("post_id","category_id")
);

<span class="tok-comment">-- Chép mọi mối nối hiện có sang TRƯỚC khi xoá bất cứ thứ gì</span>
INSERT INTO "post_category" ("post_id", "category_id")
SELECT "B", "A" FROM "_CategoryToPost";

CREATE INDEX "post_category_category_id_idx" ON "post_category"("category_id");
ALTER TABLE "post_category" ADD CONSTRAINT "post_category_post_id_fkey"
  FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE;
ALTER TABLE "post_category" ADD CONSTRAINT "post_category_category_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT;

<span class="tok-comment">-- Chỉ tới lúc này, và chỉ sau khi đã đối chiếu số lượng khớp</span>
DROP TABLE "_CategoryToPost";</code></pre>
<pre><code><span class="tok-comment">-- Phép kiểm bắt buộc phải qua trước khi DROP</span>
SELECT (SELECT count(*) FROM "_CategoryToPost") AS cu,
       (SELECT count(*) FROM "post_category")   AS moi;</code></pre>
<div class="out"> cu  | moi
-----+------
 8412| 8412</div>
<div class="callout ok">
<p><strong>Để ý câu <code>SELECT "B", "A"</code>.</strong> Hai cột bị đảo vì <code>A</code> là <code>Category</code> — đứng trước <code>Post</code> theo bảng chữ cái — trong khi bảng mới liệt kê <code>post_id</code> trước. Viết ngược chỗ này sẽ âm thầm ghép mọi bài viết với chuyên mục sai, và vì cả hai cột đều là số nguyên nên không có gì phàn nàn. Đây là dòng rủi ro cao nhất trong cả migration, và phép đếm ở trên KHÔNG bắt được nó: hãy kiểm bằng tay vài cặp nữa.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Many-to-many relations</span><span class="lc-sub">prisma.io/docs · Cả hai dạng nói đủ, kèm quy ước đặt tên cho bảng ẩn</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations#conventions-for-relation-tables-in-implicit-m-n-relations" target="_blank" rel="noopener"><span class="lc-ico">📐</span><span class="lc-body"><span class="lc-title">Quy ước bảng quan hệ ẩn</span><span class="lc-sub">prisma.io/docs · Luật A/B và cách ghi đè tên bảng bằng <code>@relation("Ten")</code></span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#disconnect-all-related-records" target="_blank" rel="noopener"><span class="lc-ico">✂️</span><span class="lc-body"><span class="lc-title">connect, disconnect, set</span><span class="lc-sub">prisma.io/docs · Mỗi cái phát ra gì, và ngữ nghĩa thay-thế của <code>set</code> nói cho rõ</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương JOIN</span><span class="lc-sub">Bảng nối nhìn từ phía SQL — thứ Prisma đang sinh ra, và cách truy vấn thẳng vào nó</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Chuyển một quan hệ ẩn sang tường minh, kèm bước chép dữ liệu và câu truy vấn đối chiếu</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — Self-relations and multiple relations|||3.5 — Tự quan hệ và nhiều quan hệ',
      slug: 'pr-3-5-tu-quan-he',
      type: 'LESSON',
      description: 'Khi một model trỏ vào chính nó — cây bình luận, cấp trên, danh mục lồng nhau — và khi hai model nối nhau nhiều hơn một lần; vì sao lúc đó @relation("Ten") trở thành bắt buộc, và cách truy vấn một cây sâu tuỳ ý bằng CTE đệ quy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Self-relations and multiple relations</h2>
<p class="lead">Two situations make Prisma unable to guess which field pairs with which: a model that relates to itself, and two models connected more than once. Both are solved by the same argument — <code>@relation("Ten")</code> — and both produce error messages that are perfectly clear once you know what they are about. This lesson covers the shapes and then the query that self-relations always eventually need.</p>

<h3>Self-relation, one-to-many: a comment tree</h3>
<pre><code>model Comment {
  id       Int       @id @default(autoincrement())
  body     String
  postId   Int       @map("post_id")

  parentId Int?      @map("parent_id")
  parent   Comment?  @relation("TraLoi", fields: [parentId], references: [id], onDelete: Cascade)
  replies  Comment[] @relation("TraLoi")

  @@index([postId])
  @@index([parentId])
  @@map("comments")
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The name is mandatory</span><span class="lz-t"><code>@relation("TraLoi")</code> on both fields</span><span class="lz-d">Without it Prisma sees two <code>Comment</code> fields on <code>Comment</code> and cannot tell whether <code>parent</code> pairs with <code>replies</code> or with itself. The name is the pairing.</span></div>
  <div class="lz-step"><span class="lz-k">The parent must be optional</span><span class="lz-t"><code>parentId Int?</code></span><span class="lz-d">A root comment has no parent. Required would mean every comment needs a parent, which has no base case and no first row.</span></div>
  <div class="lz-step"><span class="lz-k"><code>onDelete: Cascade</code> recurses</span><span class="lz-t">Deleting a comment deletes its whole subtree</span><span class="lz-d">PostgreSQL follows the cascade down every level. Usually what you want for replies; check the depth before you rely on it.</span></div>
  <div class="lz-step"><span class="lz-k">Index the parent</span><span class="lz-t"><code>@@index([parentId])</code></span><span class="lz-d">"Give me the replies to this comment" is the query the whole feature is built on, and it is a sequential scan without this line.</span></div>
</div>
<pre><code><span class="tok-comment">// Reading a fixed depth is easy — and each level is one more query</span>
const roots = await prisma.comment.findMany({
  where: { postId: 1, parentId: null },
  include: { replies: { include: { replies: true } } },   <span class="tok-comment">// three levels</span>
  orderBy: { id: 'asc' },
});</code></pre>
<div class="out">prisma:query SELECT ... FROM "comments" WHERE ("post_id" = $1 AND "parent_id" IS NULL) ORDER BY "id" ASC
prisma:query SELECT ... FROM "comments" WHERE "parent_id" IN ($1,$2,$3)
prisma:query SELECT ... FROM "comments" WHERE "parent_id" IN ($1,$2,$3,$4,$5,$6,$7)</div>
<div class="pitfall">
<p><strong>Trap — <code>include</code> cannot express "all the way down".</strong> Each nesting level is written out by hand and costs one query. Ten levels means ten <code>include</code>s and ten statements, and eleven levels silently returns a truncated tree with no error at all. There is no recursive <code>include</code> in Prisma and there is unlikely ever to be one, because the type would have to be infinite. For an arbitrarily deep tree you need the recursive CTE below.</p>
</div>

<h3>The query a comment tree eventually needs</h3>
<pre><code><span class="tok-comment">// A recursive CTE: the whole subtree, any depth, in ONE query</span>
type Node = { id: number; body: string; parentId: number | null; depth: number; path: number[] };

const tree = await prisma.$queryRaw&lt;Node[]&gt;&#96;
  WITH RECURSIVE tree AS (
    SELECT id, body, parent_id AS "parentId", 0 AS depth, ARRAY[id] AS path
    FROM comments
    WHERE post_id = \${postId} AND parent_id IS NULL

    UNION ALL

    SELECT c.id, c.body, c.parent_id, tree.depth + 1, tree.path || c.id
    FROM comments c
    JOIN tree ON c.parent_id = tree.id
    WHERE tree.depth &lt; 10
  )
  SELECT * FROM tree ORDER BY path&#96;;</code></pre>
<div class="out">[
  { id: 1,  body: 'Bai hay',        parentId: null, depth: 0, path: [1] },
  { id: 4,  body: 'Dong y',         parentId: 1,    depth: 1, path: [1, 4] },
  { id: 9,  body: 'Vi sao?',        parentId: 4,    depth: 2, path: [1, 4, 9] },
  { id: 12, body: 'Vi no nhanh',    parentId: 9,    depth: 3, path: [1, 4, 9, 12] },
  { id: 2,  body: 'Chua thuyet phuc', parentId: null, depth: 0, path: [2] }
]</div>
<div class="callout ok">
<p><strong>Three details make that query production-ready.</strong> <code>ORDER BY path</code> returns the rows already in display order, so the client renders them without sorting. <code>depth</code> gives you the indentation for free. And <code>WHERE tree.depth &lt; 10</code> is a hard stop: a cycle in the data — which a bug or a bad import can create — would otherwise loop forever and take the connection with it. Always bound a recursive CTE.</p>
</div>

<h3>Self-relation, one-to-one: the manager chain</h3>
<pre><code>model Employee {
  id       Int       @id @default(autoincrement())
  name     String

  <span class="tok-comment">// Each employee has at most one direct report — a strict chain</span>
  parentId Int?      @unique @map("cap_tren_id")
  capTren  Employee? @relation("ChuoiQuanLy", fields: [parentId], references: [id])
  capDuoi  Employee? @relation("ChuoiQuanLy")

  @@map("nhan_vien")
}</code></pre>
<p>Note that both sides are optional, and both must be — exactly as in Lesson 3.3, and for the same reason. Drop the <code>@unique</code> and you are back to a one-to-many, which is the shape an org chart usually actually wants: one manager, many reports.</p>

<h3>Self-relation, many-to-many: following</h3>
<pre><code>model User {
  id           Int    @id @default(autoincrement())
  username     String @unique

  <span class="tok-comment">// Implicit, if the follow carries no data</span>
  dangTheoDoi  User[] @relation("TheoDoi")
  nguoiTheoDoi User[] @relation("TheoDoi")
}</code></pre>
<pre><code><span class="tok-comment">// Explicit, once you want to know WHEN — which you always eventually do</span>
model User {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  dangTheoDoi  Follow[] @relation("NguoiTheoDoi")
  nguoiTheoDoi Follow[] @relation("NguoiDuocTheoDoi")
}

model Follow {
  followerId       Int      @map("nguoi_theo_doi_id")
  followingId      Int      @map("nguoi_duoc_theo_doi_id")
  createdAt        DateTime @default(now()) @map("tao_luc") @db.Timestamptz(3)

  nguoiTheoDoi     User     @relation("NguoiTheoDoi",     fields: [followerId],     references: [id], onDelete: Cascade)
  nguoiDuocTheoDoi User     @relation("NguoiDuocTheoDoi", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
  @@index([followingId])
  @@map("follow")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Two relation names, not one</span><span class="v">The explicit form has <em>two</em> separate relations from <code>Follow</code> to <code>User</code>, so each needs its own name. Reusing one name here is the most common error in this shape.</span></div>
  <div class="kv"><span class="k">The composite id prevents duplicates</span><span class="v"><code>@@id([followerId, followingId])</code> makes following someone twice structurally impossible — better than checking in application code, which races.</span></div>
  <div class="kv"><span class="k">Index the reverse direction</span><span class="v">The primary key indexes <code>(follower, followee)</code>, which serves "who do I follow". "Who follows me" needs <code>@@index([followingId])</code> or it scans.</span></div>
  <div class="kv"><span class="k">What it still cannot stop</span><span class="v">Following yourself. No schema constraint expresses that in Prisma — it needs a database <code>CHECK</code> constraint added by hand, or a check in your service layer.</span></div>
</div>
<pre><code><span class="tok-comment">-- The CHECK Prisma cannot declare, added in a hand-written migration</span>
ALTER TABLE "follow" ADD CONSTRAINT "follow_khong_tu_theo_doi"
  CHECK ("nguoi_theo_doi_id" &lt;&gt; "nguoi_duoc_theo_doi_id");</code></pre>

<h3>Two models, two relations</h3>
<pre><code>model User {
  id       Int    @id @default(autoincrement())
  username String @unique

  daViet   Post[] @relation("TacGia")
  daDuyet  Post[] @relation("NguoiDuyet")
}

model Post {
  id         Int    @id @default(autoincrement())
  title      String

  authorId   Int    @map("tac_gia_id")
  author     User   @relation("TacGia", fields: [authorId], references: [id])

  approverId Int?   @map("nguoi_duyet_id")
  nguoiDuyet User?  @relation("NguoiDuyet", fields: [approverId], references: [id], onDelete: SetNull)

  @@index([authorId])
  @@index([approverId])
}</code></pre>
<pre><code><span class="tok-comment">// Remove the names and see what Prisma says</span>
npx prisma validate</code></pre>
<div class="out">error: Error validating model "Post": Ambiguous relation detected. The fields &#96;tacGia&#96; and &#96;nguoiDuyet&#96; in model &#96;Post&#96; both refer to &#96;User&#96;. Please provide different relation names for them by adding &#96;@relation(&lt;name&gt;)&#96;.
  --&gt;  prisma/schema.prisma:18</div>
<p>Clear, and it names the fix. Note the two different <code>onDelete</code> choices in the working version, which is the point of separating them: deleting a user must not silently delete the posts they wrote (<code>Restrict</code>, the default), but it should clear the reviewer field on posts they merely approved (<code>SetNull</code>). One relation, one policy.</p>

<h3>Naming the implicit join table</h3>
<pre><code><span class="tok-comment">// Without a name: table is _CategoryToPost, columns A and B</span>
categories Category[]

<span class="tok-comment">// With a name: table is _PhanLoai — readable to a DBA, stable across model renames</span>
categories Category[] @relation("PhanLoai")</code></pre>
<div class="out">           Table "public._PhanLoai"
 Column |  Type   | Nullable
--------+---------+----------
 A      | integer | not null
 B      | integer | not null</div>
<div class="callout">
<p><strong>A small habit worth adopting.</strong> Naming implicit relations costs nothing and buys two things: a table name a human can read in a backup or an analytics tool, and stability — rename the <code>Category</code> model later and an unnamed join table renames with it, which is a migration you did not ask for. The columns are still <code>A</code> and <code>B</code>; only the table name improves.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/self-relations" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">Self-relations</span><span class="lc-sub">prisma.io/docs · All three cardinalities, with the required <code>@relation</code> names spelled out</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations#disambiguating-relations" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">Disambiguating relations</span><span class="lc-sub">prisma.io/docs · When two models relate more than once, and how the name resolves it</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/queries-with.html" target="_blank" rel="noopener"><span class="lc-ico">🌳</span><span class="lc-body"><span class="lc-title">PostgreSQL — WITH RECURSIVE</span><span class="lc-sub">postgresql.org · The CTE above from the source, including cycle detection</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, CTE chapter</span><span class="lc-sub">Recursive CTEs properly: trees, graphs, and how to bound them so they terminate</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Model a comment tree, a follow graph and a two-relation review flow — then query all three</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Tự quan hệ và nhiều quan hệ</h2>
<p class="lead">Có hai tình huống khiến Prisma không đoán nổi trường nào ghép với trường nào: một model quan hệ với chính nó, và hai model nối với nhau nhiều hơn một lần. Cả hai đều được giải bằng cùng một tham số — <code>@relation("Ten")</code> — và cả hai đều sinh ra những thông báo lỗi hoàn toàn rõ ràng, một khi bạn biết chúng nói về chuyện gì. Bài này nói các hình dạng, rồi tới câu truy vấn mà tự quan hệ rốt cuộc bao giờ cũng cần.</p>

<h3>Tự quan hệ, một–nhiều: cây bình luận</h3>
<pre><code>model Comment {
  id       Int       @id @default(autoincrement())
  body     String
  postId   Int       @map("post_id")

  parentId Int?      @map("parent_id")
  parent   Comment?  @relation("TraLoi", fields: [parentId], references: [id], onDelete: Cascade)
  replies  Comment[] @relation("TraLoi")

  @@index([postId])
  @@index([parentId])
  @@map("comments")
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cái tên là bắt buộc</span><span class="lz-t"><code>@relation("TraLoi")</code> ở cả hai trường</span><span class="lz-d">Không có nó thì Prisma nhìn thấy hai trường kiểu <code>Comment</code> trên <code>Comment</code> và không biết <code>parent</code> ghép với <code>replies</code> hay ghép với chính nó. Cái tên chính là phép ghép đôi.</span></div>
  <div class="lz-step"><span class="lz-k">Cha phải tuỳ chọn</span><span class="lz-t"><code>parentId Int?</code></span><span class="lz-d">Một bình luận gốc không có cha. Bắt buộc nghĩa là mọi bình luận đều cần cha, và như thế thì không có trường hợp cơ sở, không có hàng đầu tiên.</span></div>
  <div class="lz-step"><span class="lz-k"><code>onDelete: Cascade</code> đi đệ quy</span><span class="lz-t">Xoá một bình luận là xoá cả cây con của nó</span><span class="lz-d">PostgreSQL đi theo dây chuyền xuống mọi tầng. Thường là đúng ý cho phần trả lời; hãy kiểm độ sâu trước khi trông cậy vào nó.</span></div>
  <div class="lz-step"><span class="lz-k">Đánh chỉ mục cho cha</span><span class="lz-t"><code>@@index([parentId])</code></span><span class="lz-d">"Cho tôi các trả lời của bình luận này" là câu truy vấn mà cả tính năng dựng trên nó, và nó là một lần quét tuần tự nếu thiếu dòng này.</span></div>
</div>
<pre><code><span class="tok-comment">// Đọc một độ sâu cố định thì dễ — và mỗi tầng là thêm một câu truy vấn</span>
const roots = await prisma.comment.findMany({
  where: { postId: 1, parentId: null },
  include: { replies: { include: { replies: true } } },   <span class="tok-comment">// ba tầng</span>
  orderBy: { id: 'asc' },
});</code></pre>
<div class="out">prisma:query SELECT ... FROM "comments" WHERE ("post_id" = $1 AND "parent_id" IS NULL) ORDER BY "id" ASC
prisma:query SELECT ... FROM "comments" WHERE "parent_id" IN ($1,$2,$3)
prisma:query SELECT ... FROM "comments" WHERE "parent_id" IN ($1,$2,$3,$4,$5,$6,$7)</div>
<div class="pitfall">
<p><strong>Bẫy — <code>include</code> không diễn đạt được "xuống tới tận cùng".</strong> Mỗi tầng lồng phải viết ra bằng tay và tốn một câu truy vấn. Mười tầng nghĩa là mười cái <code>include</code> và mười câu lệnh, còn tầng thứ mười một thì âm thầm trả về một cái cây bị cắt cụt mà không báo lỗi gì. Prisma không có <code>include</code> đệ quy và nhiều khả năng sẽ không bao giờ có, vì cái kiểu ấy sẽ phải là vô hạn. Với một cái cây sâu tuỳ ý, bạn cần CTE đệ quy ngay dưới đây.</p>
</div>

<h3>Câu truy vấn mà một cây bình luận rốt cuộc sẽ cần</h3>
<pre><code><span class="tok-comment">// Một CTE đệ quy: cả cây con, sâu bao nhiêu cũng được, trong MỘT câu truy vấn</span>
type Node = { id: number; body: string; parentId: number | null; depth: number; path: number[] };

const tree = await prisma.$queryRaw&lt;Node[]&gt;&#96;
  WITH RECURSIVE tree AS (
    SELECT id, body, parent_id AS "parentId", 0 AS depth, ARRAY[id] AS path
    FROM comments
    WHERE post_id = \${postId} AND parent_id IS NULL

    UNION ALL

    SELECT c.id, c.body, c.parent_id, tree.depth + 1, tree.path || c.id
    FROM comments c
    JOIN tree ON c.parent_id = tree.id
    WHERE tree.depth &lt; 10
  )
  SELECT * FROM tree ORDER BY path&#96;;</code></pre>
<div class="out">[
  { id: 1,  body: 'Bai hay',        parentId: null, depth: 0, path: [1] },
  { id: 4,  body: 'Dong y',         parentId: 1,    depth: 1, path: [1, 4] },
  { id: 9,  body: 'Vi sao?',        parentId: 4,    depth: 2, path: [1, 4, 9] },
  { id: 12, body: 'Vi no nhanh',    parentId: 9,    depth: 3, path: [1, 4, 9, 12] },
  { id: 2,  body: 'Chua thuyet phuc', parentId: null, depth: 0, path: [2] }
]</div>
<div class="callout ok">
<p><strong>Ba chi tiết khiến câu truy vấn ấy dùng được trên production.</strong> <code>ORDER BY path</code> trả về các hàng đã đúng thứ tự hiển thị, nên phía client vẽ ra mà không cần sắp lại. <code>depth</code> cho bạn mức thụt lề miễn phí. Còn <code>WHERE tree.depth &lt; 10</code> là một cái phanh cứng: một chu trình trong dữ liệu — thứ mà một con bọ hay một lần nhập dữ liệu hỏng có thể tạo ra — nếu không sẽ lặp vô tận và kéo theo cả cái kết nối. Luôn chặn biên cho một CTE đệ quy.</p>
</div>

<h3>Tự quan hệ, một–một: chuỗi quản lý</h3>
<pre><code>model Employee {
  id       Int       @id @default(autoincrement())
  name     String

  <span class="tok-comment">// Mỗi người có nhiều nhất một cấp dưới trực tiếp — một chuỗi thẳng</span>
  parentId Int?      @unique @map("cap_tren_id")
  capTren  Employee? @relation("ChuoiQuanLy", fields: [parentId], references: [id])
  capDuoi  Employee? @relation("ChuoiQuanLy")

  @@map("nhan_vien")
}</code></pre>
<p>Để ý cả hai phía đều tuỳ chọn, và bắt buộc phải thế — đúng như ở Bài 3.3, và vì cùng một lý do. Bỏ cái <code>@unique</code> đi thì bạn quay lại quan hệ một–nhiều, vốn mới là hình dạng mà một sơ đồ tổ chức thường thật sự muốn: một cấp trên, nhiều cấp dưới.</p>

<h3>Tự quan hệ, nhiều–nhiều: theo dõi</h3>
<pre><code>model User {
  id           Int    @id @default(autoincrement())
  username     String @unique

  <span class="tok-comment">// Dạng ẩn, nếu mối theo dõi không mang dữ liệu gì</span>
  dangTheoDoi  User[] @relation("TheoDoi")
  nguoiTheoDoi User[] @relation("TheoDoi")
}</code></pre>
<pre><code><span class="tok-comment">// Dạng tường minh, khi bạn muốn biết LÚC NÀO — và bao giờ bạn cũng sẽ muốn</span>
model User {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  dangTheoDoi  Follow[] @relation("NguoiTheoDoi")
  nguoiTheoDoi Follow[] @relation("NguoiDuocTheoDoi")
}

model Follow {
  followerId       Int      @map("nguoi_theo_doi_id")
  followingId      Int      @map("nguoi_duoc_theo_doi_id")
  createdAt        DateTime @default(now()) @map("tao_luc") @db.Timestamptz(3)

  nguoiTheoDoi     User     @relation("NguoiTheoDoi",     fields: [followerId],     references: [id], onDelete: Cascade)
  nguoiDuocTheoDoi User     @relation("NguoiDuocTheoDoi", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
  @@index([followingId])
  @@map("follow")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai tên quan hệ, không phải một</span><span class="v">Dạng tường minh có <em>hai</em> quan hệ riêng biệt từ <code>Follow</code> tới <code>User</code>, nên mỗi cái cần một tên riêng. Dùng lại một tên ở đây là lỗi phổ biến nhất của hình dạng này.</span></div>
  <div class="kv"><span class="k">Khoá phức hợp chặn bản trùng</span><span class="v"><code>@@id([followerId, followingId])</code> khiến việc theo dõi ai đó hai lần là bất khả về cấu trúc — tốt hơn hẳn việc kiểm trong mã ứng dụng, vốn có tranh chấp.</span></div>
  <div class="kv"><span class="k">Đánh chỉ mục cho chiều ngược</span><span class="v">Khoá chính đánh chỉ mục <code>(người theo dõi, người được theo dõi)</code>, phục vụ câu "tôi đang theo dõi ai". Câu "ai đang theo dõi tôi" cần <code>@@index([followingId])</code> nếu không nó quét.</span></div>
  <div class="kv"><span class="k">Thứ nó vẫn không chặn được</span><span class="v">Tự theo dõi chính mình. Không ràng buộc nào trong lược đồ Prisma diễn đạt được điều đó — nó cần một ràng buộc <code>CHECK</code> của cơ sở dữ liệu thêm bằng tay, hoặc một phép kiểm trong tầng dịch vụ của bạn.</span></div>
</div>
<pre><code><span class="tok-comment">-- Cái CHECK mà Prisma không khai được, thêm trong một migration viết tay</span>
ALTER TABLE "follow" ADD CONSTRAINT "follow_khong_tu_theo_doi"
  CHECK ("nguoi_theo_doi_id" &lt;&gt; "nguoi_duoc_theo_doi_id");</code></pre>

<h3>Hai model, hai quan hệ</h3>
<pre><code>model User {
  id       Int    @id @default(autoincrement())
  username String @unique

  daViet   Post[] @relation("TacGia")
  daDuyet  Post[] @relation("NguoiDuyet")
}

model Post {
  id         Int    @id @default(autoincrement())
  title      String

  authorId   Int    @map("tac_gia_id")
  author     User   @relation("TacGia", fields: [authorId], references: [id])

  approverId Int?   @map("nguoi_duyet_id")
  nguoiDuyet User?  @relation("NguoiDuyet", fields: [approverId], references: [id], onDelete: SetNull)

  @@index([authorId])
  @@index([approverId])
}</code></pre>
<pre><code><span class="tok-comment">// Bỏ hai cái tên đi rồi xem Prisma nói gì</span>
npx prisma validate</code></pre>
<div class="out">error: Error validating model "Post": Ambiguous relation detected. The fields &#96;tacGia&#96; and &#96;nguoiDuyet&#96; in model &#96;Post&#96; both refer to &#96;User&#96;. Please provide different relation names for them by adding &#96;@relation(&lt;name&gt;)&#96;.
  --&gt;  prisma/schema.prisma:18</div>
<p>Rõ ràng, và nó nêu luôn cách vá. Để ý hai lựa chọn <code>onDelete</code> khác nhau trong bản chạy được, vì đó chính là điểm của việc tách chúng ra: xoá một người dùng thì không được âm thầm xoá những bài họ đã viết (<code>Restrict</code>, mặc định), nhưng nên xoá trường người duyệt trên những bài họ chỉ đi duyệt (<code>SetNull</code>). Một quan hệ, một chính sách.</p>

<h3>Đặt tên cho bảng nối ẩn</h3>
<pre><code><span class="tok-comment">// Không đặt tên: bảng là _CategoryToPost, hai cột A và B</span>
categories Category[]

<span class="tok-comment">// Có tên: bảng là _PhanLoai — DBA đọc được, và ổn định khi model đổi tên</span>
categories Category[] @relation("PhanLoai")</code></pre>
<div class="out">           Table "public._PhanLoai"
 Column |  Type   | Nullable
--------+---------+----------
 A      | integer | not null
 B      | integer | not null</div>
<div class="callout">
<p><strong>Một thói quen nhỏ đáng nhận.</strong> Đặt tên cho quan hệ ẩn không tốn gì và đổi lại hai thứ: một tên bảng mà con người đọc được trong một bản sao lưu hay một công cụ phân tích, và tính ổn định — đổi tên model <code>Category</code> về sau thì một bảng nối không tên sẽ đổi tên theo, tức là một migration bạn không hề xin. Hai cột vẫn là <code>A</code> và <code>B</code>; chỉ tên bảng khá lên.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/self-relations" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">Self-relations</span><span class="lc-sub">prisma.io/docs · Cả ba lực lượng quan hệ, kèm những tên <code>@relation</code> bắt buộc nói rõ ra</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations#disambiguating-relations" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">Disambiguating relations</span><span class="lc-sub">prisma.io/docs · Khi hai model nối nhau nhiều hơn một lần, và cái tên gỡ rối ra sao</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/queries-with.html" target="_blank" rel="noopener"><span class="lc-ico">🌳</span><span class="lc-body"><span class="lc-title">PostgreSQL — WITH RECURSIVE</span><span class="lc-sub">postgresql.org · Cái CTE ở trên nói từ nguồn gốc, kèm cả phần phát hiện chu trình</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương CTE</span><span class="lc-sub">CTE đệ quy cho tử tế: cây, đồ thị, và cách chặn biên để chúng dừng lại</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Mô hình hoá một cây bình luận, một đồ thị theo dõi và một luồng duyệt hai quan hệ — rồi truy vấn cả ba</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Chapter 3 quiz|||3.6 — Trắc nghiệm Chương 3',
      slug: 'pr-3-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu: ba mảnh của một quan hệ, mặc định onDelete, phía nào giữ khoá một–một, set trong nhiều–nhiều, khi nào bảng nối phải tường minh, vì sao tự quan hệ cần tên, giới hạn của include lồng, và một–một bắt buộc hai chiều.',
      content: `
<div class="ml-en">
<p>Eight questions on relations. Half of them correspond to a schema mistake that only shows itself under real data — which is why they are worth getting right on paper first.</p>
</div>
<div class="ml-vi">
<p>Tám câu về quan hệ. Một nửa trong số đó ứng với một lỗi lược đồ chỉ lộ ra khi có dữ liệu thật — và vì thế chúng đáng được làm đúng trên giấy trước.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A Prisma relation needs three pieces. Which of them is an actual database column?|||Một quan hệ Prisma cần ba mảnh. Mảnh nào là một cột thật dưới cơ sở dữ liệu?',
            options: [
              'Only the relation scalar (authorId Int) — the relation field and the back-relation exist solely in the generated client|||Chỉ trường vô hướng của quan hệ (authorId Int) — trường quan hệ và quan hệ ngược chỉ tồn tại trong client sinh ra',
              'All three — each relation field becomes its own column|||Cả ba — mỗi trường quan hệ thành một cột riêng',
              'The relation field (author User), because it carries the @relation attribute|||Trường quan hệ (author User), vì nó mang thuộc tính @relation',
              'The back-relation (posts Post[]), which stores an array of child ids|||Quan hệ ngược (posts Post[]), vốn lưu một mảng id của các con',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is Prisma default onDelete for a REQUIRED relation, and what does it do?|||Mặc định onDelete của Prisma cho một quan hệ BẮT BUỘC là gì, và nó làm gì?',
            options: [
              'Restrict — deleting a parent that still has children fails with P2003, and nothing is removed|||Restrict — xoá một cha còn con thì hỏng với P2003, và không thứ gì bị gỡ đi',
              'Cascade — the children are deleted along with the parent|||Cascade — các con bị xoá theo cha',
              'SetNull — the children survive with a NULL foreign key|||SetNull — các con sống sót với khoá ngoại bằng NULL',
              'NoAction — Prisma emits nothing and PostgreSQL silently allows the orphan|||NoAction — Prisma không phát ra gì và PostgreSQL âm thầm cho phép hàng mồ côi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In a one-to-one User ↔ Profile, which side should hold the foreign key?|||Trong quan hệ một–một User ↔ Profile, phía nào nên giữ khoá ngoại?',
            options: [
              'Profile — it is the optional side, created later; putting it on User makes creating a user without a profile impossible|||Profile — nó là phía tuỳ chọn, được tạo sau; đặt lên User thì tạo một người dùng chưa có hồ sơ là bất khả',
              'User — the parent should always own the key to its child|||User — cha thì luôn nên sở hữu khoá tới con của nó',
              'Both — a one-to-one requires the key on each side to enforce uniqueness|||Cả hai — một–một đòi mỗi phía một khoá để thi hành tính duy nhất',
              'Neither — Prisma creates a hidden join table as it does for many-to-many|||Không phía nào — Prisma tạo một bảng nối ẩn như với nhiều–nhiều',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does `categories: { set: [] }` do on an implicit many-to-many?|||`categories: { set: [] }` làm gì với một quan hệ nhiều–nhiều ẩn?',
            options: [
              'Deletes every existing link — set is a replace, not a merge, so an empty list clears the relation|||Xoá sạch mọi mối nối hiện có — set là thay thế chứ không phải trộn, nên danh sách rỗng xoá trắng quan hệ',
              'Nothing — an empty list is a no-op and existing links are kept|||Không làm gì — danh sách rỗng là thao tác rỗng và các mối nối cũ được giữ',
              'Adds no links but marks the relation as explicitly empty for future writes|||Không thêm mối nối nào nhưng đánh dấu quan hệ là rỗng tường minh cho các lần ghi sau',
              'Throws a validation error — set requires at least one element|||Ném lỗi kiểm — set đòi ít nhất một phần tử',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'When must a many-to-many join table be explicit rather than implicit?|||Khi nào một bảng nối nhiều–nhiều buộc phải tường minh thay vì ẩn?',
            options: [
              'As soon as the link itself carries data (when, by whom, a quantity) or you need to query the link directly|||Ngay khi bản thân mối nối mang dữ liệu (lúc nào, bởi ai, số lượng) hoặc bạn cần truy vấn thẳng vào mối nối',
              'When either side has more than 10,000 rows, for performance reasons|||Khi một trong hai phía có hơn 10.000 hàng, vì lý do hiệu năng',
              'When the two models are in different PostgreSQL schemas|||Khi hai model nằm ở hai schema PostgreSQL khác nhau',
              'Never — implicit tables support extra columns via @relation arguments|||Không bao giờ — bảng ẩn hỗ trợ cột phụ thông qua các tham số của @relation',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does a self-relation require `@relation("Ten")` on both fields?|||Vì sao một tự quan hệ đòi `@relation("Ten")` ở cả hai trường?',
            options: [
              'Both fields have the same model type, so without a shared name Prisma cannot tell which field pairs with which|||Cả hai trường cùng kiểu model, nên không có một cái tên chung thì Prisma không biết trường nào ghép với trường nào',
              'The name becomes the foreign key constraint name in the database|||Cái tên đó trở thành tên ràng buộc khoá ngoại dưới cơ sở dữ liệu',
              'It tells Prisma to generate a recursive include for the relation|||Nó bảo Prisma sinh ra một include đệ quy cho quan hệ đó',
              'It is optional — prisma format infers the pairing from the field names|||Nó là tuỳ chọn — prisma format suy ra phép ghép từ tên các trường',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How do you read a comment tree of arbitrary depth?|||Bạn đọc một cây bình luận sâu tuỳ ý bằng cách nào?',
            options: [
              'A recursive CTE via $queryRaw with a depth bound — nested include cannot express "all the way down" and silently truncates|||Một CTE đệ quy qua $queryRaw kèm chặn độ sâu — include lồng nhau không diễn đạt được "xuống tới tận cùng" và âm thầm cắt cụt',
              'include: { replies: true } — Prisma follows a self-relation recursively by default|||include: { replies: true } — Prisma mặc định đi theo tự quan hệ một cách đệ quy',
              'findMany with `depth: Infinity` in the query arguments|||findMany với `depth: Infinity` trong tham số truy vấn',
              'A loop of findMany calls, one per level, which is the only supported approach|||Một vòng lặp các lời gọi findMany, mỗi tầng một lần, và đó là cách duy nhất được hỗ trợ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does Prisma reject a one-to-one that is required on both sides?|||Vì sao Prisma từ chối một quan hệ một–một bắt buộc ở cả hai phía?',
            options: [
              'Neither row could ever be created first, and the database cannot enforce that constraint — so the back-relation side is always optional|||Không hàng nào tạo được trước, và cơ sở dữ liệu không thi hành nổi ràng buộc ấy — nên phía quan hệ ngược luôn tuỳ chọn',
              'Because a required one-to-one would need a composite primary key across two tables|||Vì một–một bắt buộc sẽ cần một khoá chính phức hợp trải trên hai bảng',
              'It does not reject it — the restriction was removed in Prisma 5|||Nó không từ chối — hạn chế đó đã bị bỏ ở Prisma 5',
              'Because the generated TypeScript type would be recursive and infinite|||Vì kiểu TypeScript sinh ra sẽ đệ quy và vô hạn',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
