/**
 * Bài 8.5 — ORM với Prisma (nâng cấp 02/11/2026). Output thật: _demo/_t8/prisma/chay-prisma.sh (Prisma 5.22 của repo + SQLite trong thư
 * mục tạm, client sinh ra ở thư mục tạm): db push, mỗi lời gọi Prisma kèm đúng câu SQL nó gửi (log query), include = 2 truy vấn + IN,
 * create tự bọc giao dịch, lỗi P2002/P2025, $queryRaw an toàn vs $queryRawUnsafe bị injection, tsc bắt lỗi tên trường và kiểu.
 * Deck: scripts/slides-src/wf-8-5.mjs (9 slide, WF/v1/wf-8-5). Code Lab: wf-8-5-orm-prisma.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const buoc = (...n) => { const p = OUT['_t8/out/prisma'].split(/\n+(?=> )/); return n.map((i) => p[i].trim()).join('\n\n'); };

const G = walkWf('wf-8-5', 'ORMs and Prisma', 'ORM và Prisma', [
  [1, 'ORMs and Prisma',
    '<p>Writing SQL strings by hand in every route is slow and easy to get wrong. An ORM lets you describe the data once and then read and write it with ordinary, typed JavaScript calls. This lesson runs Prisma, the ORM used in this website\'s own backend, and prints the exact SQL behind every call.</p>',
    '<p>Tự viết chuỗi SQL trong mọi route vừa chậm vừa dễ sai. ORM cho bạn mô tả dữ liệu một lần rồi đọc ghi nó bằng những lời gọi JavaScript bình thường, có kiểu. Bài này chạy Prisma, ORM mà chính backend của website này dùng, và in ra đúng câu SQL đứng sau mỗi lời gọi.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to read a Prisma schema, create the database from it, query and write with relations, recognise Prisma\'s error codes and turn them into HTTP status codes, let TypeScript catch wrong field names, and use raw SQL safely when you need it.</p>',
    '<p>Bạn sẽ đọc được một lược đồ Prisma, tạo CSDL từ nó, truy vấn và ghi kèm quan hệ, nhận ra mã lỗi của Prisma và đổi chúng thành mã trạng thái HTTP, để TypeScript bắt lỗi tên trường sai, và dùng SQL thô một cách an toàn khi cần.</p>'],
  [3, 'What an ORM does',
    '<p>You write the schema: models, fields, relations. Prisma generates a client with one method per operation. Each call becomes SQL with parameters, the database answers rows, and the client hands you plain JavaScript objects with the right types.</p>',
    '<p>Bạn viết lược đồ: model, trường, quan hệ. Prisma sinh ra một client với mỗi thao tác một hàm. Mỗi lời gọi trở thành SQL có tham số, CSDL trả về các dòng, và client trao cho bạn object JavaScript bình thường với đúng kiểu.</p>'],
  [4, 'One schema, three models',
    '<p>User, Post and Comment, with their relations written on both sides. db push created the SQLite tables and generated the client in milliseconds. In a team project you use migrations instead, so every change is a reviewed file.</p>',
    '<p>User, Post và Comment, với quan hệ được ghi ở cả hai phía. db push tạo các bảng SQLite và sinh client trong vài mili giây. Trong dự án nhóm bạn dùng migration thay vào đó, để mọi thay đổi là một tệp được review.</p>'],
  [5, 'Calls become SQL',
    '<p>findMany with where, orderBy, take and select became one SELECT with three parameters. findUnique with include sent two queries: the user, then all their posts with WHERE authorId IN. That is how Prisma avoids N plus one — as long as you use include instead of a loop.</p>',
    '<p>findMany với where, orderBy, take và select thành một câu SELECT với ba tham số. findUnique với include gửi hai truy vấn: người dùng, rồi mọi bài của họ với WHERE authorId IN. Đó là cách Prisma tránh N cộng một — miễn là bạn dùng include thay cho vòng lặp.</p>'],
  [6, 'Writes and errors',
    '<p>create with connect ran inside an automatic transaction. A duplicate email threw error P2002 and an update of a missing row threw P2025. Catch them and answer 409 and 404, instead of letting the API crash with a 500.</p>',
    '<p>create với connect chạy bên trong một giao dịch tự động. Email trùng ném lỗi P2002 và cập nhật một dòng không tồn tại ném P2025. Hãy bắt chúng và trả 409 và 404, thay vì để API sập với lỗi 500.</p>'],
  [7, 'Types catch mistakes',
    '<p>Because the client is generated from the schema, TypeScript knows every field. A typo in a field name and a string method called on a number were both reported before the code ever ran, with a suggestion for the right name.</p>',
    '<p>Vì client được sinh từ lược đồ, TypeScript biết mọi trường. Một lỗi gõ tên trường và một hàm chuỗi gọi trên một số đều bị báo trước khi mã chạy, kèm gợi ý tên đúng.</p>'],
  [8, 'Raw SQL, safely',
    '<p>The tagged template queryRaw turned the search value into a parameter: the injection matched nothing. queryRawUnsafe glued it into the text and returned every post. An ORM protects you only while you stay on its safe paths.</p>',
    '<p>Tagged template queryRaw biến giá trị tìm kiếm thành tham số: đòn injection không khớp gì. queryRawUnsafe ghép nó vào chuỗi và trả về mọi bài. ORM chỉ bảo vệ bạn khi bạn đi trên những lối an toàn của nó.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to set up Prisma with SQLite in an empty folder, add a Tag model, log the SQL of your own queries, and map Prisma errors to HTTP codes. "Done when" checks a two-query include and a 409 for a duplicate.</p>',
    '<p>Bài luyện yêu cầu bạn dựng Prisma với SQLite trong một thư mục trống, thêm model Tag, ghi log SQL của các truy vấn của chính bạn, và đổi lỗi Prisma thành mã HTTP. "Xong khi" kiểm một include hai truy vấn và mã 409 cho bản ghi trùng.</p>'],
]);

export default {
  title: '8.5 — ORMs with Prisma: JavaScript instead of SQL strings|||8.5 — ORM với Prisma: JavaScript thay cho chuỗi SQL',
  slug: 'wf-8-5-orm-prisma',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/rLRIB6AF2Dg', durationSeconds: 0 },
  description: 'Prisma 5.22 chạy thật trên SQLite: lược đồ User/Post/Comment, db push; mỗi lời gọi in đúng câu SQL nó gửi (findMany → 1 SELECT có tham số, include → 2 truy vấn + IN, create tự bọc BEGIN/COMMIT); lỗi P2002 → 409, P2025 → 404; tsc bắt tên trường gõ sai và gọi hàm chuỗi trên số; $queryRaw (tham số) an toàn vs $queryRawUnsafe bị injection; N+1 với vòng lặp; db push vs migration.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>An ORM lets you write JavaScript instead of SQL strings — and you can still see the SQL</h2>
<p class="lead">After this lesson you can read and write a Prisma schema, create a database from it, query with filters, sorting and relations, create and update rows, turn Prisma's error codes into the right HTTP status, let TypeScript catch mistakes before the code runs, and fall back to raw SQL without opening an injection hole. Prisma is what the backend of this very website uses, and what the Node.js and Next.js courses build on — so every call below is one you will write for real.</p>

<h3>Step 1 — what an ORM does</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Schema</span><span class="lz-d">You describe models, fields and relations once in <code>schema.prisma</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Generate</span><span class="lz-d">Prisma writes a client: <code>prisma.post.findMany</code>, <code>prisma.user.create</code>… with TypeScript types for every field.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Call</span><span class="lz-d">Your route calls <code>await prisma.post.findMany({ where: … })</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">SQL + parameters</span><span class="lz-d">The client turns it into SQL with placeholders (Lesson 8.3) and sends it.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Objects</span><span class="lz-d">Rows come back as plain objects: <code>published</code> is a real <code>true</code>, not <code>1</code>.</span></div>
</div>
<p>ORM = Object-Relational Mapping: mapping between rows in tables and objects in your code. Other popular ones: Drizzle and TypeORM (Node), Hibernate/JPA (Java, the Spring course), SQLAlchemy (Python), Entity Framework (C#).</p>

<h3>Step 2 — the schema, and creating the database</h3>
<p>The blog of Lessons 8.1–8.4, described once for Prisma (using SQLite so it runs with no database server):</p>
${ma('prisma', CODE['_t8/prisma/schema.prisma'])}
${ra(OUT['_t8/out/prisma-push'])}
<table>
<thead><tr><th>Schema</th><th>Becomes in SQL</th></tr></thead>
<tbody>
<tr><td><code>id Int @id @default(autoincrement())</code></td><td><code>INTEGER PRIMARY KEY</code></td></tr>
<tr><td><code>email String @unique</code></td><td><code>TEXT NOT NULL UNIQUE</code> (fields are required unless marked <code>?</code>)</td></tr>
<tr><td><code>author User? @relation(fields: [authorId], references: [id], onDelete: Cascade)</code></td><td>a foreign key <code>authorId</code> → <code>User.id</code> with ON DELETE CASCADE (Lesson 8.4)</td></tr>
<tr><td><code>posts Post[]</code></td><td>nothing in the table — the "other side" of the relation, so you can write <code>include: { posts: true }</code></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>prisma db push</code> on a real database.</strong> <code>db push</code> makes the database match the schema right now, and may drop columns or tables to do it (it warns, but scripts and tired people click yes). It is for prototypes. For anything with real data use <code>prisma migrate dev</code> to write a migration file, review it, commit it, and <code>prisma migrate deploy</code> it to production — so every change to the database is in Git and can be checked before it runs.</p></div>

<h3>Step 3 — reading: every call, with the SQL it sends</h3>
<p>The demo turns on Prisma's query log, so each call prints the exact SQL and parameters:</p>
${ma('javascript', CODE['_t8/prisma/demo.mjs'], [4, 6])}
${ra(buoc(0, 1))}
<ul>
<li><code>findMany</code> with <code>where</code>, <code>orderBy</code>, <code>take</code> and <code>select</code> became one SELECT — the same query you wrote by hand in Lesson 8.2 — with the values as <code>?</code> parameters. <code>published</code> came back as <code>true</code>.</li>
<li><code>include: { posts }</code> sent <strong>two</strong> queries: the user, then <code>WHERE authorId IN (?)</code> for all their posts. Prisma does not use one JOIN here, but it never does one query per row either: with 100 users it is still two queries.</li>
<li><code>select</code> chooses columns. Without it Prisma returns every scalar field — including a <code>passwordHash</code> if the model has one. Select only what the response needs.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Trap — N+1 is still easy to write.</strong> <code>for (const post of posts) { post.author = await prisma.user.findUnique({ where: { id: post.authorId } }); }</code> looks innocent and sends one query per post (Lesson 8.4). Use <code>include</code> (or <code>select</code> with a relation) on the first query, and watch the query log while developing: the number of lines should not grow with the number of rows.</p></div>

<h3>Step 4 — writing, and errors you should expect</h3>
${ra(buoc(2, 3, 4))}
<p><code>create</code> with <code>connect</code> checked that user 1 exists and inserted the post <em>inside a transaction</em> (<code>BEGIN IMMEDIATE … COMMIT</code>), all generated for you. The two failures are the ones every API meets daily; catch them by code and answer properly instead of crashing with 500:</p>
<pre><code class="language-javascript">import { Prisma } from '@prisma/client';

try {
  const user = await prisma.user.create({ data: { name, email } });
  return res.status(201).json(user);
} catch (err) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Email already registered' });
    if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' });
  }
  throw err;   // anything else is a real bug → 500 and a log line
}</code></pre>
<p>For several writes that must succeed together (the bank transfer of Lesson 8.3), wrap them: <code>await prisma.$transaction([ … , … ])</code> — Prisma sends BEGIN, the statements, and COMMIT or ROLLBACK.</p>

<h3>Step 5 — types catch mistakes before the code runs</h3>
${ma('typescript', CODE['_t8/prisma/check.ts'])}
${ra(OUT['_t8/out/prisma-types'])}
<p>The generated client knows the schema, so TypeScript (Chapter 9) rejected a misspelled field — with a "Did you mean 'title'?" — and a string method on a number. With raw SQL strings, both mistakes would only appear at runtime, possibly in production.</p>

<h3>Step 6 — raw SQL, the safe way and the unsafe way</h3>
<p>Some queries are easier in SQL (reports, full-text search). Prisma allows it, and its two methods differ in exactly the way Lesson 8.3 showed:</p>
${ra(buoc(5, 6))}
<p>The tagged template (<code>prisma.$queryRaw</code> followed directly by a template literal) turns every <code>\${value}</code> into a parameter: the injection matched nothing. <code>$queryRawUnsafe</code> with string gluing sent the attacker's text as SQL and returned every post. The word "Unsafe" in the name is not a joke — if you must use it, pass values as extra parameters, never by concatenation.</p>

<h3>Step 7 — what an ORM gives you, and what it costs</h3>
<table>
<thead><tr><th>Gives you</th><th>Costs you</th></tr></thead>
<tbody>
<tr><td>One schema as the source of truth; generated types</td><td>Another tool and file format to learn</td></tr>
<tr><td>Parameters by default — no injection on the normal path</td><td>Generated SQL is not always what you would write; complex reports may need raw SQL</td></tr>
<tr><td>Relations with <code>include</code>, transactions with <code>$transaction</code></td><td>Easy to hide N+1 and over-fetching behind innocent-looking calls</td></tr>
<tr><td>Migrations tracked in Git</td><td>You still need SQL to debug, read query plans and fix data</td></tr>
</tbody>
</table>
<p>That is why this chapter taught SQL first: an ORM is a convenience on top of SQL, not a replacement for understanding it. When a Prisma query is slow, you turn on the query log, copy the SQL and run <code>EXPLAIN</code> on it (Lesson 8.2).</p>

<div class="callout ok">
<p><strong>🧪 Practice (45 minutes) — your own Prisma project</strong></p>
<ol>
<li>In an empty folder: <code>npm init -y</code>, <code>npm i prisma@5 @prisma/client@5</code>, save the schema from Step 2 as <code>prisma/schema.prisma</code> (remove the <code>output</code> line), run <code>npx prisma db push</code>.</li>
<li>Write <code>index.mjs</code> that creates two users with posts, then prints published posts ordered by views. Turn on <code>log: ['query']</code> and read the SQL.</li>
<li>Add a <code>Tag</code> model with a many-to-many relation to <code>Post</code> (<code>tags Tag[]</code> / <code>posts Post[]</code>), push again, tag two posts and query posts with <code>include: { tags: true }</code>.</li>
<li>Write <code>createUser(name, email)</code> that returns <code>{ status: 201 }</code>, <code>{ status: 409 }</code> for a duplicate email; and <code>publishPost(id)</code> that returns 404 for a missing post.</li>
<li>Run <code>npx prisma studio</code> and look at your data in the browser.</li>
</ol>
<p>Hint: Prisma creates the join table for an implicit many-to-many (<code>_PostToTag</code>) by itself — look at it in Studio.</p>
<p><strong>Done when:</strong> the query log shows exactly two queries for "users with their posts" no matter how many users you create; the tag query returns each post with its tags; <code>createUser</code> with an existing email returns 409 (code P2002); and <code>publishPost(999)</code> returns 404 (code P2025). Then Code Lab module 8.5.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ORM</span><span class="v">ánh xạ đối tượng–quan hệ — dòng ↔ object.</span></div>
  <div class="kv"><span class="k">model</span><span class="v">mô hình — một bảng trong lược đồ Prisma.</span></div>
  <div class="kv"><span class="k">relation field</span><span class="v">trường quan hệ — posts Post[], author User?.</span></div>
  <div class="kv"><span class="k">generated client</span><span class="v">client được sinh — có kiểu theo lược đồ.</span></div>
  <div class="kv"><span class="k">include / select</span><span class="v">kèm quan hệ / chọn trường.</span></div>
  <div class="kv"><span class="k">db push vs migrate</span><span class="v">đẩy thẳng lược đồ / tạo tệp migration để review.</span></div>
  <div class="kv"><span class="k">P2002 / P2025</span><span class="v">vi phạm unique / không tìm thấy bản ghi.</span></div>
  <div class="kv"><span class="k">$transaction</span><span class="v">gom nhiều thao tác thành một giao dịch.</span></div>
  <div class="kv"><span class="k">$queryRaw vs $queryRawUnsafe</span><span class="v">SQL thô có tham số / SQL thô ghép chuỗi.</span></div>
  <div class="kv"><span class="k">over-fetching</span><span class="v">lấy thừa — trả về cột không cần (vd hash mật khẩu).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>An ORM maps rows to objects: one schema, a generated typed client, SQL with parameters underneath.</li>
  <li>Turn on the query log: every call is real SQL you already know how to read.</li>
  <li>Use <code>include</code>/<code>select</code> instead of loops (no N+1), and select only the fields you send.</li>
  <li>Map P2002 → 409 and P2025 → 404; use <code>$transaction</code> for writes that belong together.</li>
  <li>Generated types catch wrong field names and types before runtime.</li>
  <li>Raw SQL: tagged <code>$queryRaw</code> only; never glue values into <code>$queryRawUnsafe</code>.</li>
  <li><code>db push</code> for prototypes, migrations for real data.</li>
</ul>
${nguon('📗', 'Prisma docs — CRUD', 'findMany, create, update, include and select with examples', 'https://www.prisma.io/docs/orm/prisma-client/queries/crud')}
${nguon('📘', 'Prisma docs — Error reference', 'Every P-code, including P2002 and P2025', 'https://www.prisma.io/docs/orm/reference/error-reference')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-1-3-thanh-sql', title: 'Prisma ORM 1.3 — How calls become SQL', sub: 'The Prisma course: schema, relations, migrations and performance in depth', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>ORM cho bạn viết JavaScript thay cho chuỗi SQL — và bạn vẫn nhìn được SQL</h2>
<p class="lead">Học xong bài này bạn đọc và viết được một lược đồ Prisma, tạo CSDL từ nó, truy vấn với lọc, sắp xếp và quan hệ, tạo và cập nhật dòng, đổi mã lỗi của Prisma thành đúng mã trạng thái HTTP, để TypeScript bắt lỗi trước khi mã chạy, và quay về SQL thô mà không mở lỗ hổng injection. Prisma chính là thứ backend của website này dùng, và là nền của khoá Node.js và Next.js — nên mỗi lời gọi dưới đây đều là thứ bạn sẽ viết thật.</p>

<h3>Bước 1 — ORM làm gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Lược đồ</span><span class="lz-d">Bạn mô tả model, trường và quan hệ một lần trong <code>schema.prisma</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Sinh mã</span><span class="lz-d">Prisma viết một client: <code>prisma.post.findMany</code>, <code>prisma.user.create</code>… kèm kiểu TypeScript cho mọi trường.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Gọi</span><span class="lz-d">Route của bạn gọi <code>await prisma.post.findMany({ where: … })</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">SQL + tham số</span><span class="lz-d">Client đổi nó thành SQL với chỗ giữ chỗ (Bài 8.3) rồi gửi đi.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Object</span><span class="lz-d">Các dòng trở về thành object bình thường: <code>published</code> là <code>true</code> thật, không phải <code>1</code>.</span></div>
</div>
<p>ORM = Object-Relational Mapping: ánh xạ giữa dòng trong bảng và object trong mã. Vài cái phổ biến khác: Drizzle và TypeORM (Node), Hibernate/JPA (Java, khoá Spring), SQLAlchemy (Python), Entity Framework (C#).</p>

<h3>Bước 2 — lược đồ, và tạo CSDL</h3>
<p>Blog của Bài 8.1–8.4, mô tả một lần cho Prisma (dùng SQLite để chạy không cần máy chủ CSDL):</p>
${ma('prisma', CODE['_t8/prisma/schema.prisma'])}
${ra(OUT['_t8/out/prisma-push'])}
<table>
<thead><tr><th>Lược đồ</th><th>Thành trong SQL</th></tr></thead>
<tbody>
<tr><td><code>id Int @id @default(autoincrement())</code></td><td><code>INTEGER PRIMARY KEY</code></td></tr>
<tr><td><code>email String @unique</code></td><td><code>TEXT NOT NULL UNIQUE</code> (trường bắt buộc trừ khi có dấu <code>?</code>)</td></tr>
<tr><td><code>author User? @relation(fields: [authorId], references: [id], onDelete: Cascade)</code></td><td>khoá ngoại <code>authorId</code> → <code>User.id</code> với ON DELETE CASCADE (Bài 8.4)</td></tr>
<tr><td><code>posts Post[]</code></td><td>không có gì trong bảng — "phía bên kia" của quan hệ, để bạn viết được <code>include: { posts: true }</code></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>prisma db push</code> trên CSDL thật.</strong> <code>db push</code> làm CSDL khớp lược đồ ngay lúc này, và có thể xoá cột hay bảng để làm được vậy (nó có cảnh báo, nhưng script và người mệt mỏi vẫn bấm có). Nó dành cho bản thử. Với mọi thứ có dữ liệu thật hãy dùng <code>prisma migrate dev</code> để viết một tệp migration, review, commit, rồi <code>prisma migrate deploy</code> lên production — để mọi thay đổi CSDL đều nằm trong Git và được kiểm trước khi chạy.</p></div>

<h3>Bước 3 — đọc: mỗi lời gọi, kèm câu SQL nó gửi</h3>
<p>Bản demo bật nhật ký truy vấn của Prisma, nên mỗi lời gọi in ra đúng câu SQL và tham số:</p>
${ma('javascript', CODE['_t8/prisma/demo.mjs'], [4, 6])}
${ra(buoc(0, 1))}
<ul>
<li><code>findMany</code> với <code>where</code>, <code>orderBy</code>, <code>take</code> và <code>select</code> thành một câu SELECT — đúng truy vấn bạn tự viết ở Bài 8.2 — với các giá trị là tham số <code>?</code>. <code>published</code> trở về là <code>true</code>.</li>
<li><code>include: { posts }</code> gửi <strong>hai</strong> truy vấn: người dùng, rồi <code>WHERE authorId IN (?)</code> cho mọi bài của họ. Ở đây Prisma không dùng một JOIN, nhưng cũng không bao giờ mỗi dòng một truy vấn: với 100 người dùng vẫn là hai truy vấn.</li>
<li><code>select</code> chọn cột. Không có nó Prisma trả mọi trường thường — kể cả <code>passwordHash</code> nếu model có. Chỉ chọn thứ response cần.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — N+1 vẫn rất dễ viết.</strong> <code>for (const post of posts) { post.author = await prisma.user.findUnique({ where: { id: post.authorId } }); }</code> trông vô hại và gửi mỗi bài một truy vấn (Bài 8.4). Hãy dùng <code>include</code> (hoặc <code>select</code> kèm quan hệ) ở truy vấn đầu, và để mắt tới nhật ký truy vấn khi phát triển: số dòng log không được tăng theo số dòng dữ liệu.</p></div>

<h3>Bước 4 — ghi, và những lỗi bạn nên chờ sẵn</h3>
${ra(buoc(2, 3, 4))}
<p><code>create</code> với <code>connect</code> kiểm người dùng 1 có tồn tại rồi chèn bài <em>bên trong một giao dịch</em> (<code>BEGIN IMMEDIATE … COMMIT</code>), tất cả được sinh giúp bạn. Hai lỗi kia là thứ API nào cũng gặp hằng ngày; hãy bắt chúng theo mã và trả lời cho đúng thay vì sập với 500:</p>
<pre><code class="language-javascript">import { Prisma } from '@prisma/client';

try {
  const user = await prisma.user.create({ data: { name, email } });
  return res.status(201).json(user);
} catch (err) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Email already registered' });
    if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' });
  }
  throw err;   // mọi thứ khác là lỗi thật → 500 và một dòng log
}</code></pre>
<p>Với nhiều lần ghi phải cùng thành công (lần chuyển tiền ở Bài 8.3), hãy bọc chúng: <code>await prisma.$transaction([ … , … ])</code> — Prisma gửi BEGIN, các câu lệnh, rồi COMMIT hoặc ROLLBACK.</p>

<h3>Bước 5 — kiểu dữ liệu bắt lỗi trước khi mã chạy</h3>
${ma('typescript', CODE['_t8/prisma/check.ts'])}
${ra(OUT['_t8/out/prisma-types'])}
<p>Client được sinh ra biết lược đồ, nên TypeScript (Chương 9) từ chối một tên trường gõ sai — kèm "Did you mean 'title'?" — và một hàm chuỗi gọi trên số. Với chuỗi SQL thô, cả hai lỗi chỉ lộ ra lúc chạy, có khi ngay trên production.</p>

<h3>Bước 6 — SQL thô, cách an toàn và cách không an toàn</h3>
<p>Vài truy vấn viết bằng SQL dễ hơn (báo cáo, tìm kiếm toàn văn). Prisma cho phép, và hai hàm của nó khác nhau đúng như Bài 8.3 đã cho thấy:</p>
${ra(buoc(5, 6))}
<p>Tagged template (<code>prisma.$queryRaw</code> đi liền một template literal) biến mọi <code>\${giá trị}</code> thành tham số: đòn injection không khớp gì. <code>$queryRawUnsafe</code> với chuỗi ghép đã gửi chữ của kẻ tấn công như SQL và trả về mọi bài. Chữ "Unsafe" trong tên không phải đùa — nếu buộc phải dùng, hãy truyền giá trị như tham số phụ, không bao giờ bằng phép ghép.</p>

<h3>Bước 7 — ORM cho bạn gì, và lấy của bạn gì</h3>
<table>
<thead><tr><th>Cho bạn</th><th>Lấy của bạn</th></tr></thead>
<tbody>
<tr><td>Một lược đồ làm nguồn sự thật; kiểu được sinh sẵn</td><td>Thêm một công cụ và một định dạng tệp phải học</td></tr>
<tr><td>Tham số là mặc định — không injection trên lối bình thường</td><td>SQL sinh ra không phải lúc nào cũng như bạn viết; báo cáo phức tạp có thể cần SQL thô</td></tr>
<tr><td>Quan hệ với <code>include</code>, giao dịch với <code>$transaction</code></td><td>Dễ giấu N+1 và lấy thừa sau những lời gọi trông vô hại</td></tr>
<tr><td>Migration được theo dõi trong Git</td><td>Bạn vẫn cần SQL để gỡ lỗi, đọc kế hoạch truy vấn và sửa dữ liệu</td></tr>
</tbody>
</table>
<p>Đó là lý do chương này dạy SQL trước: ORM là sự tiện lợi đặt trên SQL, không phải thứ thay thế cho việc hiểu nó. Khi một truy vấn Prisma chậm, bạn bật nhật ký truy vấn, chép câu SQL và chạy <code>EXPLAIN</code> trên nó (Bài 8.2).</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (45 phút) — dự án Prisma của riêng bạn</strong></p>
<ol>
<li>Trong một thư mục trống: <code>npm init -y</code>, <code>npm i prisma@5 @prisma/client@5</code>, lưu lược đồ ở Bước 2 thành <code>prisma/schema.prisma</code> (bỏ dòng <code>output</code>), chạy <code>npx prisma db push</code>.</li>
<li>Viết <code>index.mjs</code> tạo hai người dùng kèm bài viết, rồi in các bài đã đăng sắp theo lượt xem. Bật <code>log: ['query']</code> và đọc SQL.</li>
<li>Thêm model <code>Tag</code> có quan hệ nhiều-nhiều với <code>Post</code> (<code>tags Tag[]</code> / <code>posts Post[]</code>), push lại, gắn thẻ hai bài và truy vấn bài với <code>include: { tags: true }</code>.</li>
<li>Viết <code>createUser(name, email)</code> trả <code>{ status: 201 }</code>, <code>{ status: 409 }</code> khi email trùng; và <code>publishPost(id)</code> trả 404 khi không có bài.</li>
<li>Chạy <code>npx prisma studio</code> và xem dữ liệu của bạn trong trình duyệt.</li>
</ol>
<p>Gợi ý: với nhiều-nhiều ngầm định Prisma tự tạo bảng nối (<code>_PostToTag</code>) — hãy xem nó trong Studio.</p>
<p><strong>Xong khi:</strong> nhật ký truy vấn hiện đúng hai truy vấn cho "người dùng kèm bài" dù bạn tạo bao nhiêu người dùng; truy vấn thẻ trả mỗi bài kèm thẻ của nó; <code>createUser</code> với email đã có trả 409 (mã P2002); và <code>publishPost(999)</code> trả 404 (mã P2025). Sau đó làm module Code Lab 8.5.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ORM</span><span class="v">ánh xạ đối tượng–quan hệ — dòng ↔ object.</span></div>
  <div class="kv"><span class="k">model</span><span class="v">mô hình — một bảng trong lược đồ Prisma.</span></div>
  <div class="kv"><span class="k">relation field</span><span class="v">trường quan hệ — posts Post[], author User?.</span></div>
  <div class="kv"><span class="k">generated client</span><span class="v">client được sinh — có kiểu theo lược đồ.</span></div>
  <div class="kv"><span class="k">include / select</span><span class="v">kèm quan hệ / chọn trường.</span></div>
  <div class="kv"><span class="k">db push vs migrate</span><span class="v">đẩy thẳng lược đồ / tạo tệp migration để review.</span></div>
  <div class="kv"><span class="k">P2002 / P2025</span><span class="v">vi phạm unique / không tìm thấy bản ghi.</span></div>
  <div class="kv"><span class="k">$transaction</span><span class="v">gom nhiều thao tác thành một giao dịch.</span></div>
  <div class="kv"><span class="k">$queryRaw vs $queryRawUnsafe</span><span class="v">SQL thô có tham số / SQL thô ghép chuỗi.</span></div>
  <div class="kv"><span class="k">over-fetching</span><span class="v">lấy thừa — trả về cột không cần (vd hash mật khẩu).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>ORM ánh xạ dòng sang object: một lược đồ, một client có kiểu được sinh, bên dưới là SQL có tham số.</li>
  <li>Bật nhật ký truy vấn: mỗi lời gọi là SQL thật mà bạn đã biết đọc.</li>
  <li>Dùng <code>include</code>/<code>select</code> thay cho vòng lặp (không N+1), và chỉ chọn các trường bạn gửi đi.</li>
  <li>Đổi P2002 → 409 và P2025 → 404; dùng <code>$transaction</code> cho các lần ghi đi cùng nhau.</li>
  <li>Kiểu được sinh bắt tên trường và kiểu sai trước lúc chạy.</li>
  <li>SQL thô: chỉ dùng <code>$queryRaw</code> dạng tagged template; không bao giờ ghép giá trị vào <code>$queryRawUnsafe</code>.</li>
  <li><code>db push</code> cho bản thử, migration cho dữ liệu thật.</li>
</ul>
${nguon('📗', 'Prisma docs — CRUD', 'findMany, create, update, include và select có ví dụ', 'https://www.prisma.io/docs/orm/prisma-client/queries/crud')}
${nguon('📘', 'Prisma docs — Error reference', 'Mọi mã P, kể cả P2002 và P2025', 'https://www.prisma.io/docs/orm/reference/error-reference')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-1-3-thanh-sql', title: 'Prisma ORM 1.3 — Lời gọi thành SQL thế nào', sub: 'Khoá Prisma: lược đồ, quan hệ, migration và hiệu năng, sâu hơn', cta: 'Mở bài' })}
</div>
`,
};
