/**
 * Prisma ORM — Mục 0: Prisma giải quyết gì, và cài đặt.
 * Vấn đề · cài trong một phút · năm phút đầu tiên · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Section 0 — What Prisma solves, and getting set up|||Mục 0 — Prisma giải quyết gì, và cài đặt',
  description: 'Vì sao giữa mã và cơ sở dữ liệu cần một lớp nữa, Prisma KHÔNG phải cái gì, cài trong một phút, năm phút đầu tiên với schema đầu tiên và truy vấn đầu tiên, và bản đồ mười ba mục phía trước.',
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — What Prisma solves|||0.1 — Prisma giải quyết gì',
      slug: 'pr-0-1-van-de',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Khoảng cách giữa một hàng dữ liệu và một đối tượng, thứ trình điều khiển thô trả về mà bạn phải tự vá, ba việc Prisma làm tốt hơn mọi lựa chọn khác, ba việc nó KHÔNG làm, nó khác Knex/Drizzle/TypeORM ở đâu, và bản đồ mười ba mục.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What Prisma solves</h2>
<p class="lead">Your database speaks in rows. Your program thinks in objects. Every application that touches a database has to translate between the two, and the only real question is whether you write that translation by hand, generate it, or pretend it does not exist until it breaks at three in the morning. Prisma is one answer: describe your data once, and let a generator produce the types, the queries and the migrations from that single description.</p>

<h3>The gap, shown in code</h3>
<p>Here is the honest version of talking to PostgreSQL with nothing but the driver. It works. Read it and count the things that can go wrong silently.</p>
<pre><code><span class="tok-comment">// raw-driver.js — the &#96;pg&#96; driver, no abstraction at all</span>
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const { rows } = await pool.query(
  'SELECT id, full_name, email, created_at FROM users WHERE email = $1',
  ['an@example.com'],
);
const user = rows[0];

console.log(user);
console.log(typeof user.id, typeof user.created_at);</code></pre>
<div class="out">{
  id: 42,
  full_name: 'Nguyen Van An',
  email: 'an@example.com',
  created_at: 2026-03-14T09:12:44.318Z
}
number object</div>
<p>Nothing is wrong with that output. What is wrong is everything TypeScript knows about it, which is nothing at all:</p>
<pre><code><span class="tok-comment">// TypeScript's view of the same variable</span>
const user = rows[0];        <span class="tok-comment">// any</span>
user.fullName;               <span class="tok-comment">// undefined — the column is full_name. No error.</span>
user.emial;                  <span class="tok-comment">// undefined — typo. No error.</span>
user.deleted_at.getTime();   <span class="tok-comment">// TypeError at runtime — column not selected</span></code></pre>
<p>Three bugs, zero compiler complaints, and all three only appear when a real user hits that path. The column names live in a string the compiler never reads; the shape of the result lives in your head. Multiply that by two hundred queries and you have the maintenance profile of a typical hand-rolled data layer.</p>

<h3>Where Prisma sits</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Your application code</span><span class="lz-lnote">Calls like <code>prisma.user.findUnique({ where: { email } })</code>. Fully typed, autocompleted, and impossible to misspell — a wrong field name is a compile error, not a runtime <code>undefined</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Generated Prisma Client</span><span class="lz-lnote">Not a library you install — a package <strong>written for your schema</strong> by <code>prisma generate</code> into <code>node_modules/.prisma/client</code>. Change the schema, regenerate, and the types change with it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Query engine</span><span class="lz-lnote">Turns the JavaScript object you passed into SQL, manages the connection pool, and maps rows back to objects. In Prisma 4–5 this is a Rust binary shipped alongside your app; from Prisma 6 the query compiler can run in WebAssembly with no binary at all.</span></div>
  <div class="lz-layer"><span class="lz-lname">Database driver / wire protocol</span><span class="lz-lnote">The actual PostgreSQL, MySQL, SQLite, SQL Server, MongoDB or CockroachDB connection. This layer is unchanged — Prisma sends ordinary SQL that you can read in the logs and paste into <code>psql</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Your database</span><span class="lz-lnote">Still the source of truth, still enforcing its own constraints, still the thing that will reject bad data long after any application-level check has been bypassed.</span></div>
</div>
<p>Notice the bottom two layers. Prisma does not replace SQL and it does not hide your database — it sends SQL you can read, and every constraint you rely on still lives in PostgreSQL. That matters more than it sounds, and Chapter 10 is entirely about the moments you should drop through those layers on purpose.</p>

<h3>The same query, with Prisma</h3>
<pre><code><span class="tok-comment">// prisma-version.ts</span>
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const user = await prisma.user.findUnique({
  where: { email: 'an@example.com' },
  select: { id: true, fullName: true, email: true, createdAt: true },
});

<span class="tok-comment">// user is: { id: number; fullName: string | null; email: string; createdAt: Date } | null</span>
console.log(user?.fullName);</code></pre>
<div class="out">Nguyen Van An</div>
<p>Every one of the three silent bugs above is now a red squiggle in your editor. <code>user.emial</code> does not compile. <code>user.deletedAt</code> does not compile, <em>because you did not select it</em> — the type reflects the exact <code>select</code> you wrote, not the whole table. And <code>user</code> is <code>| null</code>, so the compiler makes you handle "no such email" before it will build.</p>

<h3>Three things Prisma does better than the alternatives</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Types derived from the database, not written twice</span><span class="v">With a driver or a query builder you write the TypeScript interface by hand and hope it matches the table. Prisma generates it. When a column becomes nullable, every place that forgot to handle <code>null</code> turns red on the next build — before deploy, not after.</span></div>
  <div class="kv"><span class="k">One file is both the schema and the migration source</span><span class="v">You edit <code>schema.prisma</code> and Prisma <em>computes the SQL diff</em> against the previous state. No writing <code>ALTER TABLE</code> by hand, no drift between "what the code thinks" and "what the database has" — and a command that tells you when they disagree anyway.</span></div>
  <div class="kv"><span class="k">Relations that read like objects and execute like SQL</span><span class="v"><code>include: { posts: { include: { comments: true } } }</code> fetches three levels. You never write a JOIN, and — critically — you never write the N+1 loop that a naive hand-rolled layer produces. Chapter 9 measures exactly what it does instead.</span></div>
</div>

<h3>Three things Prisma is NOT</h3>
<div class="callout warn">
<p><strong>Not a reason to skip SQL.</strong> Every Prisma query becomes SQL, and when it is slow you will be reading <code>EXPLAIN ANALYZE</code> like everyone else. Prisma removes the typing, not the thinking. The CuongThai PostgreSQL course exists precisely because this course cannot replace it.</p>
<p><strong>Not a database abstraction that lets you swap engines.</strong> The marketing implies portability; reality does not deliver it. Native types (<code>@db.VarChar(50)</code>), <code>@@index</code> types, partial indexes, JSON operators, full-text search and array columns are all provider-specific. Writing PostgreSQL and "switching to MySQL later" is a plan that has never once survived contact with a real schema.</p>
<p><strong>Not a query optimizer.</strong> Prisma will happily generate a query that scans four million rows because you asked it to. It does not add indexes, it does not rewrite your filter, and it does not warn you. Your <code>@@index</code> declarations are yours to get right.</p>
</div>

<h3>How it compares to the neighbours</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Raw driver (<code>pg</code>, <code>mysql2</code>)</span><span class="v">Maximum control, zero safety. Correct choice for a script, a migration tool, or a query so specific that any abstraction is in the way. Wrong choice for two hundred endpoints.</span></div>
  <div class="kv"><span class="k">Query builder (Knex, Kysely)</span><span class="v">SQL with a JavaScript syntax. Kysely in particular is fully typed and excellent — but <em>you</em> supply the types, usually from a separate schema definition, and there is no migration generation. Closer to SQL, further from a single source of truth.</span></div>
  <div class="kv"><span class="k">Drizzle</span><span class="v">Schema in TypeScript rather than a separate DSL, no engine binary, and SQL that looks like SQL. The genuine modern alternative. Trade-off: relation loading and migration tooling are less finished, and the schema is code rather than a declarative document you can hand to a non-JavaScript teammate.</span></div>
  <div class="kv"><span class="k">TypeORM, Sequelize</span><span class="v">The Active Record / decorator generation. Types are declared by you on entity classes and are not checked against the database; lazy loading makes N+1 easy to write by accident. Still everywhere in older codebases, and the reason many people think "ORM" means "slow".</span></div>
  <div class="kv"><span class="k">Prisma</span><span class="v">Declarative schema file → generated client → generated migrations. The strongest end-to-end type story of the group, and the most opinionated. You give up some SQL expressiveness at the edges and buy it back with <code>$queryRaw</code> when you need it.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — "the ORM will handle performance."</strong> It will not, and the belief that it will is how a page that took 40 ms in development takes 9 seconds in production. Prisma's job ends at generating correct SQL. Whether that SQL uses an index, whether you fetched 12 columns when you needed 2, and whether you issued one query or four hundred are decisions you made — usually without noticing. Turn on query logging on day one (Lesson 0.3) and you will never be surprised by this.</p>
</div>

<h3>What this course covers, and what it deliberately does not</h3>
<p>Two other CuongThai courses touch this territory, and the boundaries are drawn on purpose:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Node.js, Chapter 7</span><span class="v">Uses Prisma <em>as a means</em> to move a Notes API off in-memory storage onto PostgreSQL. Application-shaped: connection pooling in an Express app, keeping the HTTP contract, one N+1 example. Read it for the application; read this for Prisma.</span></div>
  <div class="kv"><span class="k">PostgreSQL</span><span class="v">The database itself — SQL, joins, window functions, indexes, <code>EXPLAIN</code>, the planner. This course points back to it constantly and never tries to replace it.</span></div>
  <div class="kv"><span class="k">This course</span><span class="v">Prisma as its own subject: the whole schema language, every relation kind, what <code>generate</code> actually writes, migrations and the shadow database, transactions and isolation, relation load strategies measured, raw SQL safely, engines and binary targets, and a diagnosis cookbook for the error codes.</span></div>
</div>

<h3>The thirteen sections ahead</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Foundations</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">0 · Setup</span><span class="lz-nsub">Why a layer here at all, install, first schema, first query</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">1 · What an ORM is</span><span class="lz-nsub">The impedance mismatch, what <code>generate</code> writes, reading the generated client</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">2 · Schema language</span><span class="lz-nsub">datasource, generator, models, every attribute, native types, enums</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">3 · Relations</span><span class="lz-nsub">1-1, 1-n, n-n implicit and explicit, self-relations, <code>onDelete</code></span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Using the client</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">4 · Reading and writing</span><span class="lz-nsub">find*, create, update, upsert, delete, nested writes, select vs include</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">5 · Querying deeply</span><span class="lz-nsub">Filters, relation filters, ordering, cursor pagination, groupBy</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">6 · Migrations</span><span class="lz-nsub">dev vs deploy, the shadow database, drift, hand-written SQL</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">7 · Transactions</span><span class="lz-nsub">Sequential vs interactive, isolation levels, real race conditions</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Production</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">8 · The type system</span><span class="lz-nsub">Generated types, <code>GetPayload</code>, validators, and the enum that broke prod</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">9 · Performance</span><span class="lz-nsub">N+1 measured, relation load strategies, indexes, connection pool</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">10 · Raw SQL</span><span class="lz-nsub">$queryRaw safely, Prisma.sql, views, unsupported types, escape hatches</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">11 · Shipping it</span><span class="lz-nsub">Engines, binary targets, Docker, serverless, seeding, CI</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">12 · Diagnosis</span><span class="lz-nsub">The first five minutes, P1xxx–P6xxx, drift, and the final quiz</span></div></div>
  </div>
</div>

<div class="callout ok">
<p><strong>How to read this course.</strong> Every command shown was run against a real PostgreSQL 16 and a real Prisma 6 install, and every <code>.out</code> block is that run's actual output — including the ugly errors, which are the most useful part. Type them yourself. A schema language is learned by watching <code>prisma format</code> reject what you wrote, not by reading about it.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">What is Prisma? — official introduction</span><span class="lc-sub">prisma.io/docs · The maintainers' own framing of the problem, including the honest list of what Prisma does not do</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/overview/prisma-in-your-stack" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Prisma in your stack</span><span class="lc-sub">prisma.io/docs · Where it fits with REST, GraphQL, Next.js and serverless — read before deciding it belongs in yours</span></span></a>
<a class="link-card" href="https://martinfowler.com/bliki/OrmHate.html" target="_blank" rel="noopener"><span class="lc-ico">📝</span><span class="lc-body"><span class="lc-title">Martin Fowler — OrmHate</span><span class="lc-sub">martinfowler.com · Written in 2012 and still the clearest account of why the mapping problem is genuinely hard, and why blaming the ORM usually misses it</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Exercises with solutions, paired to this course section by section</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">The layer underneath. Take it alongside this one; Prisma without SQL is a ceiling you hit fast</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Prisma giải quyết gì</h2>
<p class="lead">Cơ sở dữ liệu nói bằng hàng. Chương trình của bạn nghĩ bằng đối tượng. Mọi ứng dụng có chạm tới cơ sở dữ liệu đều phải dịch giữa hai thứ đó, và câu hỏi thật sự chỉ là: bạn viết phần dịch ấy bằng tay, sinh nó ra bằng máy, hay giả vờ nó không tồn tại cho tới lúc nó vỡ vào ba giờ sáng. Prisma là một câu trả lời: mô tả dữ liệu MỘT lần, rồi để bộ sinh mã dựng ra hệ kiểu, câu truy vấn và migration từ đúng bản mô tả đó.</p>

<h3>Khoảng cách ấy, nhìn bằng mã</h3>
<p>Đây là bản trung thực của việc nói chuyện với PostgreSQL mà không có gì ngoài trình điều khiển. Nó chạy được. Đọc và đếm xem có bao nhiêu thứ có thể hỏng trong im lặng.</p>
<pre><code><span class="tok-comment">// raw-driver.js — trình điều khiển &#96;pg&#96;, không một lớp trừu tượng nào</span>
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const { rows } = await pool.query(
  'SELECT id, full_name, email, created_at FROM users WHERE email = $1',
  ['an@example.com'],
);
const user = rows[0];

console.log(user);
console.log(typeof user.id, typeof user.created_at);</code></pre>
<div class="out">{
  id: 42,
  full_name: 'Nguyen Van An',
  email: 'an@example.com',
  created_at: 2026-03-14T09:12:44.318Z
}
number object</div>
<p>Output đó không có gì sai. Cái sai nằm ở chỗ TypeScript biết gì về nó — và câu trả lời là không biết gì cả:</p>
<pre><code><span class="tok-comment">// TypeScript nhìn thấy đúng biến ấy như sau</span>
const user = rows[0];        <span class="tok-comment">// any</span>
user.fullName;               <span class="tok-comment">// undefined — cột tên là full_name. Không báo lỗi.</span>
user.emial;                  <span class="tok-comment">// undefined — gõ sai. Không báo lỗi.</span>
user.deleted_at.getTime();   <span class="tok-comment">// TypeError lúc chạy — cột không được chọn</span></code></pre>
<p>Ba con bọ, không một lời phàn nàn nào từ trình biên dịch, và cả ba chỉ lộ ra khi một người dùng thật đi vào đúng nhánh đó. Tên cột nằm trong một chuỗi mà trình biên dịch không bao giờ đọc; hình dạng kết quả nằm trong đầu bạn. Nhân con số ấy với hai trăm câu truy vấn, bạn có đúng chân dung bảo trì của một lớp dữ liệu tự viết tay.</p>

<h3>Prisma nằm ở đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mã ứng dụng của bạn</span><span class="lz-lnote">Những lời gọi kiểu <code>prisma.user.findUnique({ where: { email } })</code>. Có kiểu đầy đủ, có gợi ý gõ, và không thể gõ sai tên — một tên trường sai là lỗi biên dịch, không phải một <code>undefined</code> lúc chạy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Prisma Client được sinh ra</span><span class="lz-lnote">Không phải một thư viện bạn cài — mà là một gói <strong>viết riêng cho lược đồ của bạn</strong> do <code>prisma generate</code> đẻ ra trong <code>node_modules/.prisma/client</code>. Đổi lược đồ, sinh lại, hệ kiểu đổi theo.</span></div>
  <div class="lz-layer"><span class="lz-lname">Query engine</span><span class="lz-lnote">Biến đối tượng JavaScript bạn truyền vào thành SQL, quản lý connection pool, và ánh xạ hàng trả về thành đối tượng. Ở Prisma 4–5 đây là một tệp nhị phân Rust đi kèm ứng dụng; từ Prisma 6 trình biên dịch truy vấn có thể chạy bằng WebAssembly, không cần nhị phân nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Trình điều khiển / giao thức đường truyền</span><span class="lz-lnote">Kết nối PostgreSQL, MySQL, SQLite, SQL Server, MongoDB hay CockroachDB thật. Lớp này không đổi — Prisma gửi SQL bình thường, bạn đọc được trong log và dán thẳng vào <code>psql</code> được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cơ sở dữ liệu của bạn</span><span class="lz-lnote">Vẫn là nguồn sự thật, vẫn tự thi hành ràng buộc của nó, vẫn là thứ sẽ từ chối dữ liệu sai rất lâu sau khi mọi phép kiểm ở tầng ứng dụng đã bị đi vòng.</span></div>
</div>
<p>Để ý hai lớp dưới cùng. Prisma KHÔNG thay thế SQL và KHÔNG giấu cơ sở dữ liệu của bạn — nó gửi SQL bạn đọc được, và mọi ràng buộc bạn trông cậy vẫn sống trong PostgreSQL. Điều đó quan trọng hơn nghe có vẻ, và Chương 10 dành trọn cho những lúc bạn nên chủ động rơi xuống qua các lớp ấy.</p>

<h3>Cũng câu truy vấn đó, với Prisma</h3>
<pre><code><span class="tok-comment">// prisma-version.ts</span>
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const user = await prisma.user.findUnique({
  where: { email: 'an@example.com' },
  select: { id: true, fullName: true, email: true, createdAt: true },
});

<span class="tok-comment">// kiểu của user là: { id: number; fullName: string | null; email: string; createdAt: Date } | null</span>
console.log(user?.fullName);</code></pre>
<div class="out">Nguyen Van An</div>
<p>Cả ba con bọ im lặng ở trên giờ đều là gạch đỏ trong trình soạn thảo. <code>user.emial</code> không biên dịch được. <code>user.deletedAt</code> không biên dịch được, <em>bởi vì bạn đã không chọn nó</em> — kiểu phản ánh đúng cái <code>select</code> bạn vừa viết, chứ không phải cả bảng. Và <code>user</code> có <code>| null</code>, nên trình biên dịch bắt bạn xử lý trường hợp "không có email nào như thế" trước khi cho build.</p>

<h3>Ba việc Prisma làm tốt hơn mọi lựa chọn khác</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểu suy ra từ cơ sở dữ liệu, không phải viết hai lần</span><span class="v">Với trình điều khiển hay query builder, bạn tự viết interface TypeScript rồi hy vọng nó khớp bảng. Prisma sinh ra nó. Khi một cột trở thành cho phép null, mọi chỗ quên xử lý <code>null</code> đỏ lên ngay lần build kế tiếp — trước khi deploy, không phải sau.</span></div>
  <div class="kv"><span class="k">Một tệp vừa là lược đồ vừa là nguồn của migration</span><span class="v">Bạn sửa <code>schema.prisma</code> và Prisma <em>tự tính ra phần SQL chênh lệch</em> so với trạng thái trước. Không viết <code>ALTER TABLE</code> tay, không trôi dạt giữa "mã nghĩ gì" và "cơ sở dữ liệu có gì" — và có sẵn một câu lệnh báo cho bạn khi hai thứ đó vẫn cứ lệch nhau.</span></div>
  <div class="kv"><span class="k">Quan hệ đọc như đối tượng, chạy như SQL</span><span class="v"><code>include: { posts: { include: { comments: true } } }</code> lấy ba tầng. Bạn không bao giờ viết JOIN, và — quan trọng hơn — bạn không bao giờ viết cái vòng lặp N+1 mà một lớp tự chế ngây thơ sinh ra. Chương 9 đo bằng số thật xem nó làm gì thay thế.</span></div>
</div>

<h3>Ba việc Prisma KHÔNG phải</h3>
<div class="callout warn">
<p><strong>Không phải cái cớ để khỏi học SQL.</strong> Mọi câu truy vấn Prisma đều thành SQL, và khi nó chậm thì bạn vẫn ngồi đọc <code>EXPLAIN ANALYZE</code> như mọi người. Prisma bỏ đi phần gõ, không bỏ đi phần nghĩ. Khoá PostgreSQL của CuongThai tồn tại chính vì khoá này không thay thế được nó.</p>
<p><strong>Không phải lớp trừu tượng cho phép đổi cơ sở dữ liệu.</strong> Quảng cáo gợi ý tính di động; thực tế không giao hàng. Native type (<code>@db.VarChar(50)</code>), kiểu <code>@@index</code>, partial index, toán tử JSON, full-text search và cột mảng đều gắn chặt với từng provider. Viết cho PostgreSQL rồi "sau này chuyển sang MySQL" là một kế hoạch chưa một lần sống sót khi gặp lược đồ thật.</p>
<p><strong>Không phải bộ tối ưu truy vấn.</strong> Prisma sẵn lòng sinh ra câu truy vấn quét bốn triệu hàng vì bạn bảo nó thế. Nó không tự thêm chỉ mục, không viết lại bộ lọc của bạn, và không cảnh báo gì. Những khai báo <code>@@index</code> là việc của bạn, và bạn phải làm đúng.</p>
</div>

<h3>So với hàng xóm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trình điều khiển thô (<code>pg</code>, <code>mysql2</code>)</span><span class="v">Toàn quyền, không an toàn gì. Lựa chọn đúng cho một script, một công cụ migration, hay một câu truy vấn đặc thù tới mức mọi lớp trừu tượng đều vướng chân. Lựa chọn sai cho hai trăm endpoint.</span></div>
  <div class="kv"><span class="k">Query builder (Knex, Kysely)</span><span class="v">SQL viết bằng cú pháp JavaScript. Riêng Kysely có kiểu đầy đủ và rất tốt — nhưng <em>bạn</em> là người cung cấp hệ kiểu, thường từ một bản định nghĩa lược đồ riêng, và không có sinh migration. Gần SQL hơn, xa "một nguồn sự thật duy nhất" hơn.</span></div>
  <div class="kv"><span class="k">Drizzle</span><span class="v">Lược đồ viết bằng TypeScript thay vì một DSL riêng, không có engine nhị phân, và SQL trông ra SQL. Đây là lựa chọn thay thế hiện đại thật sự. Đánh đổi: phần nạp quan hệ và công cụ migration chưa hoàn thiện bằng, và lược đồ là mã chứ không phải một văn bản khai báo bạn đưa cho đồng nghiệp không viết JavaScript đọc được.</span></div>
  <div class="kv"><span class="k">TypeORM, Sequelize</span><span class="v">Thế hệ Active Record / decorator. Kiểu do bạn khai trên lớp entity và KHÔNG được đối chiếu với cơ sở dữ liệu; lazy loading khiến N+1 rất dễ viết ra mà không biết. Vẫn đầy trong các kho mã cũ, và là lý do nhiều người nghĩ "ORM" nghĩa là "chậm".</span></div>
  <div class="kv"><span class="k">Prisma</span><span class="v">Tệp lược đồ khai báo → client sinh ra → migration sinh ra. Câu chuyện hệ kiểu đầu-cuối mạnh nhất nhóm, và cũng áp đặt nhất. Bạn mất một phần sức biểu đạt của SQL ở rìa, rồi mua lại bằng <code>$queryRaw</code> khi cần.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — "ORM sẽ lo hiệu năng."</strong> Không đâu, và niềm tin ấy chính là cách một trang chạy 40 mili giây lúc phát triển thành 9 giây trên production. Việc của Prisma dừng ở chỗ sinh ra SQL đúng. Còn SQL ấy có dùng chỉ mục không, bạn lấy 12 cột trong khi cần 2 không, và bạn bắn một câu truy vấn hay bốn trăm câu — đều là quyết định của bạn, thường là quyết định vô thức. Bật log truy vấn ngay ngày đầu (Bài 0.3) thì chuyện này không bao giờ làm bạn bất ngờ nữa.</p>
</div>

<h3>Khoá này dạy gì, và cố ý KHÔNG dạy gì</h3>
<p>Hai khoá khác của CuongThai có chạm vào vùng đất này, và ranh giới được vạch có chủ ý:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Node.js, Chương 7</span><span class="v">Dùng Prisma <em>như một phương tiện</em> để chuyển Notes API từ lưu trong RAM sang PostgreSQL. Góc nhìn ứng dụng: connection pool trong app Express, giữ nguyên hợp đồng HTTP, một ví dụ N+1. Đọc nó để hiểu ứng dụng; đọc khoá này để hiểu Prisma.</span></div>
  <div class="kv"><span class="k">PostgreSQL</span><span class="v">Bản thân cơ sở dữ liệu — SQL, join, hàm cửa sổ, chỉ mục, <code>EXPLAIN</code>, bộ lập kế hoạch. Khoá này trỏ ngược về đó liên tục và không bao giờ định thay thế nó.</span></div>
  <div class="kv"><span class="k">Khoá này</span><span class="v">Prisma như một chủ đề độc lập: toàn bộ ngôn ngữ lược đồ, mọi kiểu quan hệ, <code>generate</code> thật sự viết ra cái gì, migration và shadow database, transaction và mức cô lập, chiến lược nạp quan hệ đo bằng số, SQL thô cho an toàn, engine và binary target, và một sách công thức chẩn đoán theo mã lỗi.</span></div>
</div>

<h3>Mười ba mục phía trước</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Nền tảng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">0 · Cài đặt</span><span class="lz-nsub">Vì sao cần một lớp ở đây, cài, lược đồ đầu tiên, truy vấn đầu tiên</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">1 · ORM là gì</span><span class="lz-nsub">Lệch trở kháng, <code>generate</code> viết ra gì, đọc client được sinh</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">2 · Ngôn ngữ lược đồ</span><span class="lz-nsub">datasource, generator, model, mọi thuộc tính, native type, enum</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">3 · Quan hệ</span><span class="lz-nsub">1-1, 1-n, n-n ẩn và tường minh, tự quan hệ, <code>onDelete</code></span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Dùng client</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">4 · Đọc và ghi</span><span class="lz-nsub">find*, create, update, upsert, delete, ghi lồng nhau, select với include</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">5 · Truy vấn sâu</span><span class="lz-nsub">Bộ lọc, lọc theo quan hệ, sắp xếp, phân trang con trỏ, groupBy</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">6 · Migration</span><span class="lz-nsub">dev với deploy, shadow database, trôi dạt, SQL viết tay</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">7 · Giao dịch</span><span class="lz-nsub">Tuần tự với tương tác, mức cô lập, tranh chấp thật</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Production</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">8 · Hệ kiểu</span><span class="lz-nsub">Kiểu sinh ra, <code>GetPayload</code>, validator, và cái enum làm vỡ prod</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">9 · Hiệu năng</span><span class="lz-nsub">N+1 đo bằng số, chiến lược nạp quan hệ, chỉ mục, connection pool</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">10 · SQL thô</span><span class="lz-nsub">$queryRaw an toàn, Prisma.sql, view, kiểu không hỗ trợ, cửa thoát</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">11 · Đưa lên chạy</span><span class="lz-nsub">Engine, binary target, Docker, serverless, seed, CI</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">12 · Chẩn đoán</span><span class="lz-nsub">Năm phút đầu, P1xxx–P6xxx, trôi dạt, và quiz cuối khoá</span></div></div>
  </div>
</div>

<div class="callout ok">
<p><strong>Cách đọc khoá này.</strong> Mọi câu lệnh trong đây đều đã chạy thật trên một PostgreSQL 16 và một bản cài Prisma 6 thật, và mọi khối <code>.out</code> là output thật của lần chạy đó — kể cả những lỗi xấu xí, vốn là phần hữu ích nhất. Hãy tự gõ lại. Một ngôn ngữ lược đồ chỉ học được bằng cách nhìn <code>prisma format</code> từ chối thứ bạn vừa viết, chứ không phải bằng cách đọc về nó.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">What is Prisma? — giới thiệu chính thức</span><span class="lc-sub">prisma.io/docs · Cách chính người làm ra nó đặt vấn đề, kèm danh sách trung thực những gì Prisma không làm</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/overview/prisma-in-your-stack" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Prisma in your stack</span><span class="lc-sub">prisma.io/docs · Nó khớp vào REST, GraphQL, Next.js và serverless thế nào — đọc trước khi quyết định nó có thuộc về stack của bạn không</span></span></a>
<a class="link-card" href="https://martinfowler.com/bliki/OrmHate.html" target="_blank" rel="noopener"><span class="lc-ico">📝</span><span class="lc-body"><span class="lc-title">Martin Fowler — OrmHate</span><span class="lc-sub">martinfowler.com · Viết năm 2012 và tới nay vẫn là bài rõ nhất về việc vì sao bài toán ánh xạ thật sự khó, và vì sao đổ lỗi cho ORM thường là trượt mất trọng tâm</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Bài tập kèm lời giải, ghép theo từng mục của khoá này</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Lớp nằm dưới. Học song song với khoá này; Prisma mà không có SQL là một cái trần bạn đụng rất nhanh</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Getting Prisma running|||0.2 — Cho Prisma chạy lên',
      slug: 'pr-0-2-cai-dat',
      type: 'LESSON',
      description: 'PostgreSQL trong một câu lệnh Docker, prisma init và bốn tệp nó đẻ ra, DATABASE_URL đọc đúng từng phần, prisma generate làm gì với node_modules, và bốn thứ cần sửa ngay ở lần đầu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Getting Prisma running</h2>
<p class="lead">Prisma needs three things before it can do anything useful: a database it can reach, a schema file, and a generated client. This lesson gets all three in about five minutes, then spends the rest of its length on the parts people skip and regret — what <code>DATABASE_URL</code> actually contains, where the generated client lands, and the four settings worth fixing before you write a single model.</p>

<h3>Step 1 — a database to point at</h3>
<p>You need PostgreSQL running somewhere. If you have one already, skip ahead. If not, Docker gives you one in a single command:</p>
<pre><code><span class="tok-comment"># One throwaway PostgreSQL 16, port 5432, data in a named volume</span>
docker run -d --name pg-hoc \\
  -e POSTGRES_PASSWORD=matkhau \\
  -e POSTGRES_USER=student \\
  -e POSTGRES_DB=hocprisma \\
  -p 5432:5432 \\
  -v pg-hoc-data:/var/lib/postgresql/data \\
  postgres:16-alpine

<span class="tok-comment"># Confirm it is actually accepting connections, not merely "running"</span>
docker exec pg-hoc pg_isready -U student -d hocprisma</code></pre>
<div class="out">4a9b2f1c8d3e7061b5a4c9e2f8d13a7be0c5419d6f2a8b3c7e1d0946af58b2c3
/var/run/postgresql:5432 - accepting connections</div>
<div class="callout">
<p><strong>No Docker?</strong> Every example in this course also works against a local PostgreSQL install (<code>apt install postgresql-16</code>, <code>brew install postgresql@16</code>) or a free hosted instance from Neon, Supabase or Railway. Only the connection string changes. SQLite works too for Chapters 1–5 and needs no server at all — set <code>provider = "sqlite"</code> and <code>url = "file:./dev.db"</code> — but the moment you reach migrations, native types or transactions, PostgreSQL is what this course assumes.</p>
</div>

<h3>Step 2 — a project and the two packages</h3>
<p>There are exactly two, and the split matters:</p>
<pre><code>mkdir hoc-prisma &amp;&amp; cd hoc-prisma
npm init -y
npm install prisma --save-dev
npm install @prisma/client
npm install -D typescript tsx @types/node

npx prisma -v</code></pre>
<div class="out">prisma                  : 6.7.0
@prisma/client          : 6.7.0
Computed binaryTarget   : debian-openssl-3.0.x
Operating System        : linux
Architecture            : x64
Node.js                 : v22.14.0
Query Engine (Node-API) : libquery-engine 34ace0eb2704183d2c05b60b52fba5c43c13f303
Schema Engine           : schema-engine-cli 34ace0eb2704183d2c05b60b52fba5c43c13f303
Default Engines Hash    : 34ace0eb2704183d2c05b60b52fba5c43c13f303
Studio                  : 0.511.0</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>prisma</code> — devDependency</span><span class="v">The CLI. Used at build time and by you at a terminal: <code>init</code>, <code>generate</code>, <code>migrate</code>, <code>studio</code>, <code>db pull</code>. Your running server never imports it, which is why it belongs in <code>devDependencies</code> and why a production Docker image can drop it — <em>with one exception covered in Chapter 11: if you run migrations at container start, the CLI must survive into the final image.</em></span></div>
  <div class="kv"><span class="k"><code>@prisma/client</code> — dependency</span><span class="v">What your application imports. Notice that the version you install is a <strong>placeholder</strong>: it contains no models until <code>prisma generate</code> writes them. Install it and import it before generating and you get an error telling you exactly that.</span></div>
</div>
<p>Keep the two versions in lockstep. A CLI newer than the client generates output the client cannot read, and the error message when this happens ("<code>Prisma Client could not be generated due to a version mismatch</code>") is clear, but only if you know to look for it.</p>

<h3>Step 3 — <code>prisma init</code></h3>
<pre><code>npx prisma init --datasource-provider postgresql</code></pre>
<div class="out">✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore file. Don't forget to add &#96;.env&#96; in it to not commit any private information.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database.
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can now start querying your database.</div>
<p>Four files exist now. Know what each one is for, because two of them are dangerous to get wrong:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">prisma/schema.prisma</span><span class="lz-t">The source of truth</span><span class="lz-d">Your models, your datasource, your generator. This is the file the entire course is about. It is committed to git and reviewed like any other code.</span></div>
  <div class="lz-step"><span class="lz-k">.env</span><span class="lz-t">The connection string</span><span class="lz-d">Contains <code>DATABASE_URL</code>. <strong>Never committed.</strong> Prisma reads it automatically — you do not need <code>dotenv</code> for the CLI, though your application still does unless it is Node 20+ with <code>--env-file</code>.</span></div>
  <div class="lz-step"><span class="lz-k">.gitignore</span><span class="lz-t">The safety net</span><span class="lz-d"><code>init</code> creates one if missing but only <em>warns</em> if it exists. Check it yourself, now — an accidental <code>.env</code> commit means rotating a database password under pressure.</span></div>
  <div class="lz-step"><span class="lz-k">node_modules/.prisma/client</span><span class="lz-t">The generated code</span><span class="lz-d">Does not exist yet. Written by <code>generate</code>, rebuilt on every <code>npm install</code> via a postinstall hook, and never committed. If it goes missing, regenerating is always the fix.</span></div>
</div>

<h3>The connection string, read carefully</h3>
<p>Open <code>.env</code> and replace the placeholder. Every part of this URL does something:</p>
<pre><code><span class="tok-comment"># .env</span>
DATABASE_URL="postgresql://student:matkhau@localhost:5432/hocprisma?schema=public&amp;connection_limit=10&amp;pool_timeout=20"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>postgresql://</code></span><span class="v">The protocol, which must match the <code>provider</code> in <code>schema.prisma</code>. <code>postgres://</code> is accepted as an alias. A mismatch here produces <code>P1012</code> at validation time, not at connect time.</span></div>
  <div class="kv"><span class="k"><code>student:matkhau</code></span><span class="v">User and password. If your password contains <code>@</code>, <code>:</code>, <code>/</code> or <code>?</code> it <strong>must be percent-encoded</strong> — <code>p@ss</code> becomes <code>p%40ss</code>. This is the single most common "why can't it connect" of all, because the failure looks like a wrong password rather than a malformed URL.</span></div>
  <div class="kv"><span class="k"><code>localhost:5432</code></span><span class="v">Host and port. Inside Docker Compose this becomes the service name, not <code>localhost</code> — a container's <code>localhost</code> is itself. Chapter 11 covers this properly; it is the second most common connection failure.</span></div>
  <div class="kv"><span class="k"><code>/hocprisma</code></span><span class="v">The database name. Not the schema — the database. Getting these two confused is why people end up with tables in a database they did not mean to touch.</span></div>
  <div class="kv"><span class="k"><code>?schema=public</code></span><span class="v">The PostgreSQL schema (namespace) Prisma writes into. Defaults to <code>public</code>. Set it to something else and you can host several environments in one database — a genuinely useful trick for a cheap VPS.</span></div>
  <div class="kv"><span class="k"><code>connection_limit=10</code></span><span class="v">Pool size. Prisma's default is <code>num_cpus * 2 + 1</code>, which on a 16-core machine means 33 connections <em>per process</em>. PostgreSQL's default <code>max_connections</code> is 100. Multiply by four app instances and you have already run out. Chapter 9 measures this.</span></div>
  <div class="kv"><span class="k"><code>pool_timeout=20</code></span><span class="v">Seconds to wait for a free connection before throwing <code>P2024</code>. When you see that error in production it almost never means the database is slow — it means every connection is held by a query that is slow.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the <code>.env</code> that is not read.</strong> The Prisma CLI reads <code>.env</code> from the current working directory <em>and</em> from <code>prisma/.env</code>, and it does this itself, without <code>dotenv</code>. Your application does <strong>not</strong>. So <code>npx prisma migrate dev</code> works, and then <code>node index.js</code> fails with "<code>Environment variable not found: DATABASE_URL</code>" and it looks like Prisma is broken. It is not. Either load the file yourself (<code>import 'dotenv/config'</code>) or run Node with <code>--env-file=.env</code>. Also: if both <code>.env</code> and <code>prisma/.env</code> exist, the CLI loads both and one silently wins — keep exactly one.</p>
</div>

<h3>Step 4 — a first model and the generated client</h3>
<p>Replace the contents of <code>prisma/schema.prisma</code>:</p>
<pre><code>generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  fullName  String?  @map("full_name")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")
}</code></pre>
<p>Two commands turn that into a real table and a real TypeScript API:</p>
<pre><code>npx prisma migrate dev --name khoi_tao
npx prisma generate</code></pre>
<div class="out">Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "hocprisma", schema "public" at "localhost:5432"

Applying migration &#96;20260823041207_khoi_tao&#96;

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260823041207_khoi_tao/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v6.7.0) to ./node_modules/@prisma/client in 84ms</div>
<p>Look at what <code>migrate dev</code> wrote, because you will be reading these files for the rest of your career:</p>
<pre><code>cat prisma/migrations/20260823041207_khoi_tao/migration.sql</code></pre>
<div class="out">-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");</div>
<p>Plain SQL. Reviewable in a pull request, runnable in <code>psql</code>, and — importantly — <strong>editable before you commit it</strong>. Chapter 6 is built on that last point.</p>

<h3>Where the generated client actually goes</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">You run <code>prisma generate</code></span><span class="lz-d">The CLI parses <code>schema.prisma</code> and validates every model, attribute and relation. Errors stop here, before any code is written.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Code is written to <code>node_modules/.prisma/client</code></span><span class="lz-d">A full package: <code>index.js</code>, <code>index.d.ts</code> (often tens of thousands of lines), a copy of your schema, and — in Prisma 5 and earlier — the query engine binary for your platform.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>@prisma/client</code> re-exports it</span><span class="lz-d">The package you installed is a thin shim that forwards to <code>.prisma/client</code>. That indirection is why the import path never changes even though the content is regenerated constantly.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>postinstall</code> keeps it alive</span><span class="lz-d"><code>@prisma/client</code> ships a postinstall hook that reruns <code>generate</code>. This is why a fresh <code>npm ci</code> works — and why <code>--ignore-scripts</code> in a Dockerfile produces a client with no models at all.</span></div>
</div>
<pre><code><span class="tok-comment"># Proof that the generated client is yours, not a library's</span>
grep -c "findUnique" node_modules/.prisma/client/index.d.ts
grep -o "model User" node_modules/.prisma/client/schema.prisma
wc -l node_modules/.prisma/client/index.d.ts</code></pre>
<div class="out">18
model User
6142</div>
<p>Six thousand lines of TypeScript for a single four-field model. That number is worth remembering: it grows roughly linearly with your schema, and Chapter 8 explains why a large schema can slow your editor to a crawl and what to do about it.</p>

<h3>Four things to fix on day one</h3>
<div class="callout ok">
<p><strong>1 · Pin the versions.</strong> Change <code>"^6.7.0"</code> to <code>"6.7.0"</code> for both packages. A minor bump of the CLI without the client is a broken build, and it will happen on a machine that is not yours.</p>
<p><strong>2 · Add the scripts you will type fifty times a day.</strong></p>
<pre><code><span class="tok-comment">// package.json</span>
"scripts": {
  "db:gen": "prisma generate",
  "db:mig": "prisma migrate dev",
  "db:push": "prisma db push",
  "db:studio": "prisma studio",
  "db:status": "prisma migrate status"
}</code></pre>
<p><strong>3 · Turn on query logging now, not after the first slow page.</strong> One constructor argument buys you every SQL statement Prisma sends, and it is the single highest-value thing in this lesson.</p>
<p><strong>4 · Check <code>.gitignore</code> yourself.</strong> It must contain <code>.env</code> and should contain <code>node_modules</code>. <code>prisma init</code> only warns when the file already exists; a warning in a wall of green output is a warning nobody reads.</p>
</div>
<pre><code><span class="tok-comment">// src/db.ts — the client you will import everywhere</span>
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: [
    { emit: 'stdout', level: 'query' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ],
});</code></pre>
<div class="out">prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."full_name", "public"."users"."created_at" FROM "public"."users" WHERE "public"."users"."email" = $1 LIMIT $2 OFFSET $3
prisma:query COMMIT</div>

<div class="pitfall">
<p><strong>Trap — one <code>PrismaClient</code>, not one per file.</strong> Each instance opens its own connection pool. Construct it inside a request handler, or let a Next.js dev server hot-reload a module that constructs it at the top level, and you will exhaust <code>max_connections</code> in about ninety seconds. The error is <code>P1001</code> or <code>too many clients already</code>, and it looks like a database problem. Export exactly one instance from one module, as above. The Next.js-specific version of this trap — and the <code>globalThis</code> workaround it needs — is in Chapter 11.</p>
</div>

<h3>Verify the whole chain works</h3>
<pre><code><span class="tok-comment"># A table exists, in the right database, with the right columns</span>
docker exec -it pg-hoc psql -U student -d hocprisma -c "\\d users"</code></pre>
<div class="out">                                     Table "public.users"
   Column   |              Type              | Nullable |              Default
------------+--------------------------------+----------+-----------------------------------
 id         | integer                        | not null | nextval('users_id_seq'::regclass)
 email      | text                           | not null |
 full_name  | text                           |          |
 created_at | timestamp(3) without time zone | not null | CURRENT_TIMESTAMP
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE, btree (email)</div>
<p>Column names are snake_case in the database and camelCase in your code, exactly as the <code>@map</code> attributes asked. That translation is one of the quiet reasons Prisma is pleasant to use with an existing SQL-conventional database, and Chapter 2 covers it in full.</p>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Start from scratch — PostgreSQL + TypeScript</span><span class="lc-sub">prisma.io/docs · The official walkthrough this lesson follows, with the SQLite and MySQL variants one click away</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/connection-urls" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">Connection URLs — full reference</span><span class="lc-sub">prisma.io/docs · Every query parameter per provider, including the SSL options you will need for a hosted database</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">Generating Prisma Client</span><span class="lc-sub">prisma.io/docs · Custom output paths, the postinstall hook, and why generation is not optional</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">If the <code>docker run</code> above was unfamiliar: volumes, ports and why the container's localhost is not yours</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Set-up exercises: build the connection string, fix a broken .env, spot the version mismatch</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cho Prisma chạy lên</h2>
<p class="lead">Prisma cần ba thứ trước khi làm được việc gì có ích: một cơ sở dữ liệu nó với tới được, một tệp lược đồ, và một client được sinh ra. Bài này dựng đủ cả ba trong khoảng năm phút, rồi dành phần còn lại cho những chỗ người ta hay bỏ qua và sau đó hối hận — <code>DATABASE_URL</code> thật sự chứa gì, client sinh ra rơi vào đâu, và bốn thiết lập đáng sửa trước khi bạn viết dòng model đầu tiên.</p>

<h3>Bước 1 — một cơ sở dữ liệu để trỏ vào</h3>
<p>Bạn cần một PostgreSQL đang chạy ở đâu đó. Có sẵn rồi thì nhảy qua. Chưa có thì Docker cho bạn một cái bằng đúng một câu lệnh:</p>
<pre><code><span class="tok-comment"># Một PostgreSQL 16 dùng tạm, cổng 5432, dữ liệu để trong volume có tên</span>
docker run -d --name pg-hoc \\
  -e POSTGRES_PASSWORD=matkhau \\
  -e POSTGRES_USER=student \\
  -e POSTGRES_DB=hocprisma \\
  -p 5432:5432 \\
  -v pg-hoc-data:/var/lib/postgresql/data \\
  postgres:16-alpine

<span class="tok-comment"># Xác nhận nó thật sự nhận kết nối, chứ không chỉ "đang chạy"</span>
docker exec pg-hoc pg_isready -U student -d hocprisma</code></pre>
<div class="out">4a9b2f1c8d3e7061b5a4c9e2f8d13a7be0c5419d6f2a8b3c7e1d0946af58b2c3
/var/run/postgresql:5432 - accepting connections</div>
<div class="callout">
<p><strong>Không có Docker?</strong> Mọi ví dụ trong khoá này cũng chạy được với PostgreSQL cài trực tiếp (<code>apt install postgresql-16</code>, <code>brew install postgresql@16</code>) hoặc một bản miễn phí trên Neon, Supabase hay Railway. Chỉ chuỗi kết nối là đổi. SQLite cũng dùng được cho Chương 1–5 và không cần máy chủ nào — đặt <code>provider = "sqlite"</code> và <code>url = "file:./dev.db"</code> — nhưng ngay khi tới migration, native type hay transaction thì PostgreSQL là thứ khoá này giả định.</p>
</div>

<h3>Bước 2 — một dự án và hai gói</h3>
<p>Đúng hai gói, và cách chia chúng có ý nghĩa:</p>
<pre><code>mkdir hoc-prisma &amp;&amp; cd hoc-prisma
npm init -y
npm install prisma --save-dev
npm install @prisma/client
npm install -D typescript tsx @types/node

npx prisma -v</code></pre>
<div class="out">prisma                  : 6.7.0
@prisma/client          : 6.7.0
Computed binaryTarget   : debian-openssl-3.0.x
Operating System        : linux
Architecture            : x64
Node.js                 : v22.14.0
Query Engine (Node-API) : libquery-engine 34ace0eb2704183d2c05b60b52fba5c43c13f303
Schema Engine           : schema-engine-cli 34ace0eb2704183d2c05b60b52fba5c43c13f303
Default Engines Hash    : 34ace0eb2704183d2c05b60b52fba5c43c13f303
Studio                  : 0.511.0</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>prisma</code> — devDependency</span><span class="v">Bộ CLI. Dùng lúc build và dùng bởi chính bạn ở terminal: <code>init</code>, <code>generate</code>, <code>migrate</code>, <code>studio</code>, <code>db pull</code>. Máy chủ đang chạy không bao giờ import nó, nên nó thuộc <code>devDependencies</code>, và nên một ảnh Docker production có thể bỏ nó đi — <em>trừ một ngoại lệ nói ở Chương 11: nếu bạn chạy migration lúc container khởi động thì CLI bắt buộc phải sống tới ảnh cuối.</em></span></div>
  <div class="kv"><span class="k"><code>@prisma/client</code> — dependency</span><span class="v">Thứ ứng dụng của bạn import. Để ý: bản bạn vừa cài chỉ là một <strong>chỗ giữ chỗ</strong> — nó không chứa model nào cho tới khi <code>prisma generate</code> viết chúng vào. Cài rồi import trước khi generate thì bạn nhận đúng một lỗi nói thẳng điều đó.</span></div>
</div>
<p>Giữ hai phiên bản đi cùng nhau. CLI mới hơn client sẽ sinh ra thứ client không đọc nổi, và thông báo lỗi lúc ấy ("<code>Prisma Client could not be generated due to a version mismatch</code>") thì rõ, nhưng chỉ rõ nếu bạn biết mà tìm.</p>

<h3>Bước 3 — <code>prisma init</code></h3>
<pre><code>npx prisma init --datasource-provider postgresql</code></pre>
<div class="out">✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore file. Don't forget to add &#96;.env&#96; in it to not commit any private information.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database.
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can now start querying your database.</div>
<p>Giờ có bốn tệp. Hãy biết từng tệp để làm gì, vì hai trong số đó sai là nguy hiểm:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">prisma/schema.prisma</span><span class="lz-t">Nguồn sự thật</span><span class="lz-d">Model của bạn, datasource của bạn, generator của bạn. Đây là tệp mà cả khoá học này nói về. Nó được commit vào git và được review như mọi đoạn mã khác.</span></div>
  <div class="lz-step"><span class="lz-k">.env</span><span class="lz-t">Chuỗi kết nối</span><span class="lz-d">Chứa <code>DATABASE_URL</code>. <strong>Không bao giờ commit.</strong> Prisma tự đọc nó — bạn không cần <code>dotenv</code> cho phần CLI, dù ứng dụng của bạn thì vẫn cần, trừ khi chạy Node 20+ với <code>--env-file</code>.</span></div>
  <div class="lz-step"><span class="lz-k">.gitignore</span><span class="lz-t">Lưới an toàn</span><span class="lz-d"><code>init</code> tạo mới nếu chưa có nhưng chỉ <em>cảnh báo</em> nếu đã có. Tự kiểm lại, ngay bây giờ — lỡ commit <code>.env</code> nghĩa là phải đổi mật khẩu cơ sở dữ liệu trong lúc cuống.</span></div>
  <div class="lz-step"><span class="lz-k">node_modules/.prisma/client</span><span class="lz-t">Mã được sinh ra</span><span class="lz-d">Chưa tồn tại. Do <code>generate</code> viết ra, dựng lại sau mỗi <code>npm install</code> nhờ móc postinstall, và không bao giờ commit. Nếu nó biến mất thì sinh lại luôn là câu trả lời.</span></div>
</div>

<h3>Chuỗi kết nối, đọc cho kỹ</h3>
<p>Mở <code>.env</code> và thay chỗ giữ chỗ. Mọi phần của URL này đều có việc:</p>
<pre><code><span class="tok-comment"># .env</span>
DATABASE_URL="postgresql://student:matkhau@localhost:5432/hocprisma?schema=public&amp;connection_limit=10&amp;pool_timeout=20"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>postgresql://</code></span><span class="v">Giao thức, phải khớp <code>provider</code> trong <code>schema.prisma</code>. <code>postgres://</code> được chấp nhận như tên gọi khác. Lệch ở đây sinh ra <code>P1012</code> lúc kiểm lược đồ, không phải lúc kết nối.</span></div>
  <div class="kv"><span class="k"><code>student:matkhau</code></span><span class="v">Người dùng và mật khẩu. Nếu mật khẩu chứa <code>@</code>, <code>:</code>, <code>/</code> hay <code>?</code> thì <strong>bắt buộc phải mã hoá phần trăm</strong> — <code>p@ss</code> thành <code>p%40ss</code>. Đây là nguyên nhân "sao không kết nối được" phổ biến nhất, vì nó trông y hệt sai mật khẩu chứ không giống một URL viết hỏng.</span></div>
  <div class="kv"><span class="k"><code>localhost:5432</code></span><span class="v">Máy chủ và cổng. Bên trong Docker Compose thì đây là tên service, không phải <code>localhost</code> — <code>localhost</code> của một container là chính nó. Chương 11 nói kỹ; đây là nguyên nhân hỏng kết nối phổ biến thứ hai.</span></div>
  <div class="kv"><span class="k"><code>/hocprisma</code></span><span class="v">Tên cơ sở dữ liệu. Không phải schema — mà là database. Lẫn hai thứ này là lý do người ta tạo bảng nhầm vào một cơ sở dữ liệu họ không định đụng tới.</span></div>
  <div class="kv"><span class="k"><code>?schema=public</code></span><span class="v">Schema (không gian tên) của PostgreSQL mà Prisma ghi vào. Mặc định <code>public</code>. Đặt khác đi thì bạn nhét được nhiều môi trường vào chung một cơ sở dữ liệu — một mẹo thật sự có ích với VPS giá rẻ.</span></div>
  <div class="kv"><span class="k"><code>connection_limit=10</code></span><span class="v">Kích thước pool. Mặc định của Prisma là <code>số nhân * 2 + 1</code>, tức trên máy 16 nhân là 33 kết nối <em>cho mỗi tiến trình</em>. <code>max_connections</code> mặc định của PostgreSQL là 100. Nhân với bốn bản chạy ứng dụng là bạn đã hết chỗ. Chương 9 đo bằng số thật.</span></div>
  <div class="kv"><span class="k"><code>pool_timeout=20</code></span><span class="v">Số giây chờ một kết nối rỗi trước khi ném <code>P2024</code>. Khi thấy lỗi ấy trên production thì hầu như không bao giờ nghĩa là cơ sở dữ liệu chậm — mà nghĩa là mọi kết nối đang bị giữ bởi một câu truy vấn chậm.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cái <code>.env</code> không được đọc.</strong> CLI của Prisma đọc <code>.env</code> ở thư mục hiện tại <em>và</em> ở <code>prisma/.env</code>, và nó tự làm việc đó, không cần <code>dotenv</code>. Ứng dụng của bạn thì <strong>không</strong>. Thế nên <code>npx prisma migrate dev</code> chạy ngon, rồi <code>node index.js</code> chết với "<code>Environment variable not found: DATABASE_URL</code>" và trông như Prisma hỏng. Nó không hỏng. Hoặc tự nạp tệp (<code>import 'dotenv/config'</code>), hoặc chạy Node với <code>--env-file=.env</code>. Thêm nữa: nếu tồn tại cả <code>.env</code> lẫn <code>prisma/.env</code> thì CLI nạp cả hai và một cái âm thầm thắng — giữ đúng một tệp thôi.</p>
</div>

<h3>Bước 4 — model đầu tiên và client được sinh ra</h3>
<p>Thay toàn bộ nội dung <code>prisma/schema.prisma</code>:</p>
<pre><code>generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  fullName  String?  @map("full_name")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")
}</code></pre>
<p>Hai câu lệnh biến đoạn đó thành một bảng thật và một API TypeScript thật:</p>
<pre><code>npx prisma migrate dev --name khoi_tao
npx prisma generate</code></pre>
<div class="out">Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "hocprisma", schema "public" at "localhost:5432"

Applying migration &#96;20260823041207_khoi_tao&#96;

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260823041207_khoi_tao/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v6.7.0) to ./node_modules/@prisma/client in 84ms</div>
<p>Hãy nhìn thứ <code>migrate dev</code> vừa viết ra, vì bạn sẽ đọc loại tệp này suốt phần đời nghề nghiệp còn lại:</p>
<pre><code>cat prisma/migrations/20260823041207_khoi_tao/migration.sql</code></pre>
<div class="out">-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");</div>
<p>SQL thuần. Review được trong pull request, chạy được trong <code>psql</code>, và — quan trọng — <strong>sửa được trước khi bạn commit nó</strong>. Chương 6 dựng trên đúng điểm cuối này.</p>

<h3>Client sinh ra thật sự nằm ở đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bạn chạy <code>prisma generate</code></span><span class="lz-d">CLI phân tích <code>schema.prisma</code> và kiểm mọi model, thuộc tính và quan hệ. Lỗi dừng ở đây, trước khi có dòng mã nào được viết.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mã được viết vào <code>node_modules/.prisma/client</code></span><span class="lz-d">Một gói đầy đủ: <code>index.js</code>, <code>index.d.ts</code> (thường hàng chục nghìn dòng), một bản sao lược đồ của bạn, và — ở Prisma 5 trở về trước — tệp nhị phân query engine cho nền tảng của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>@prisma/client</code> xuất lại nó</span><span class="lz-d">Gói bạn cài chỉ là lớp vỏ mỏng chuyển tiếp tới <code>.prisma/client</code>. Chính lớp gián tiếp đó khiến đường import không bao giờ đổi dù nội dung bị sinh lại liên tục.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>postinstall</code> giữ nó sống</span><span class="lz-d"><code>@prisma/client</code> kèm một móc postinstall chạy lại <code>generate</code>. Nhờ vậy một lần <code>npm ci</code> sạch vẫn chạy — và cũng vì vậy <code>--ignore-scripts</code> trong Dockerfile sinh ra một client không có model nào.</span></div>
</div>
<pre><code><span class="tok-comment"># Bằng chứng client sinh ra là của BẠN, không phải của một thư viện</span>
grep -c "findUnique" node_modules/.prisma/client/index.d.ts
grep -o "model User" node_modules/.prisma/client/schema.prisma
wc -l node_modules/.prisma/client/index.d.ts</code></pre>
<div class="out">18
model User
6142</div>
<p>Sáu nghìn dòng TypeScript cho đúng một model bốn trường. Con số ấy đáng nhớ: nó tăng gần như tuyến tính theo lược đồ của bạn, và Chương 8 giải thích vì sao một lược đồ lớn có thể làm trình soạn thảo bò như rùa, cùng cách xử lý.</p>

<h3>Bốn thứ cần sửa ngay ngày đầu</h3>
<div class="callout ok">
<p><strong>1 · Ghim phiên bản.</strong> Đổi <code>"^6.7.0"</code> thành <code>"6.7.0"</code> cho cả hai gói. Một lần nhảy minor của CLI mà client đứng yên là một bản build hỏng, và nó sẽ xảy ra trên một cái máy không phải máy bạn.</p>
<p><strong>2 · Thêm sẵn những script bạn sẽ gõ năm mươi lần mỗi ngày.</strong></p>
<pre><code><span class="tok-comment">// package.json</span>
"scripts": {
  "db:gen": "prisma generate",
  "db:mig": "prisma migrate dev",
  "db:push": "prisma db push",
  "db:studio": "prisma studio",
  "db:status": "prisma migrate status"
}</code></pre>
<p><strong>3 · Bật log truy vấn ngay, đừng đợi tới trang chậm đầu tiên.</strong> Một tham số của hàm dựng mua cho bạn mọi câu SQL Prisma gửi đi, và đó là thứ đáng giá nhất trong cả bài này.</p>
<p><strong>4 · Tự kiểm <code>.gitignore</code>.</strong> Nó phải chứa <code>.env</code> và nên chứa <code>node_modules</code>. <code>prisma init</code> chỉ cảnh báo khi tệp đã tồn tại; mà một dòng cảnh báo nằm giữa bức tường chữ xanh là dòng không ai đọc.</p>
</div>
<pre><code><span class="tok-comment">// src/db.ts — client bạn sẽ import ở khắp nơi</span>
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: [
    { emit: 'stdout', level: 'query' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ],
});</code></pre>
<div class="out">prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."full_name", "public"."users"."created_at" FROM "public"."users" WHERE "public"."users"."email" = $1 LIMIT $2 OFFSET $3
prisma:query COMMIT</div>

<div class="pitfall">
<p><strong>Bẫy — MỘT <code>PrismaClient</code>, không phải mỗi tệp một cái.</strong> Mỗi thực thể mở connection pool riêng. Dựng nó bên trong một handler, hoặc để máy chủ dev của Next.js nạp nóng lại một module dựng nó ở mức đầu tệp, thì bạn sẽ vét sạch <code>max_connections</code> trong khoảng chín mươi giây. Lỗi hiện ra là <code>P1001</code> hoặc <code>too many clients already</code>, và trông như lỗi cơ sở dữ liệu. Hãy xuất đúng một thực thể từ đúng một module, như trên. Bản riêng của bẫy này cho Next.js — cùng mẹo <code>globalThis</code> mà nó cần — nằm ở Chương 11.</p>
</div>

<h3>Kiểm lại cả chuỗi có chạy không</h3>
<pre><code><span class="tok-comment"># Có một bảng, đúng cơ sở dữ liệu, đúng các cột</span>
docker exec -it pg-hoc psql -U student -d hocprisma -c "\\d users"</code></pre>
<div class="out">                                     Table "public.users"
   Column   |              Type              | Nullable |              Default
------------+--------------------------------+----------+-----------------------------------
 id         | integer                        | not null | nextval('users_id_seq'::regclass)
 email      | text                           | not null |
 full_name  | text                           |          |
 created_at | timestamp(3) without time zone | not null | CURRENT_TIMESTAMP
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE, btree (email)</div>
<p>Tên cột là snake_case dưới cơ sở dữ liệu và camelCase trong mã, đúng như mấy thuộc tính <code>@map</code> yêu cầu. Phép dịch ấy là một trong những lý do thầm lặng khiến Prisma dễ chịu khi dùng với một cơ sở dữ liệu SQL đặt tên theo lối truyền thống, và Chương 2 nói đủ về nó.</p>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Start from scratch — PostgreSQL + TypeScript</span><span class="lc-sub">prisma.io/docs · Bản hướng dẫn chính thức mà bài này đi theo, có sẵn biến thể SQLite và MySQL cách một cú bấm</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/connection-urls" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">Connection URLs — tra cứu đầy đủ</span><span class="lc-sub">prisma.io/docs · Mọi tham số truy vấn theo từng provider, kể cả các tuỳ chọn SSL bạn sẽ cần với cơ sở dữ liệu thuê</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">Generating Prisma Client</span><span class="lc-sub">prisma.io/docs · Đường xuất tuỳ chỉnh, móc postinstall, và vì sao sinh mã không phải tuỳ chọn</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Nếu câu <code>docker run</code> ở trên còn lạ: volume, cổng, và vì sao localhost của container không phải localhost của bạn</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Bài tập cài đặt: dựng chuỗi kết nối, sửa một .env hỏng, tìm ra chỗ lệch phiên bản</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Your first five minutes|||0.3 — Năm phút đầu tiên của bạn',
      slug: 'pr-0-3-nam-phut',
      type: 'LESSON',
      description: 'Hai model và một quan hệ, rồi mười bốn câu truy vấn dựng nên mô hình tinh thần: create lồng nhau, findMany với include, select, update, upsert, delete, count, groupBy — mỗi câu kèm SQL Prisma thật sự gửi xuống, và Studio để nhìn tận mắt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Your first five minutes</h2>
<p class="lead">Fourteen queries, each shown with the SQL Prisma actually sent. That last part is the whole point of this lesson: most people learn Prisma as a set of magic incantations and only discover the SQL when something is slow. Learn them together from the first minute and you will never write a query whose cost surprises you.</p>

<h3>A schema with a relation</h3>
<p>Replace <code>prisma/schema.prisma</code> with this. It is two models and one relation — the smallest thing that is still interesting:</p>
<pre><code>generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  fullName  String?  @map("full_name")
  createdAt DateTime @default(now()) @map("created_at")

  posts     Post[]

  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  body      String?
  published Boolean  @default(false)
  views     Int      @default(0)
  createdAt DateTime @default(now()) @map("created_at")

  authorId  Int      @map("author_id")
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([authorId])
  @@map("posts")
}</code></pre>
<pre><code>npx prisma migrate dev --name them_post</code></pre>
<div class="out">Applying migration &#96;20260823044930_them_post&#96;

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260823044930_them_post/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v6.7.0) to ./node_modules/@prisma/client in 91ms</div>
<p>Three lines in that schema are doing the real work, and each gets a full chapter later:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">posts Post[]</span><span class="lz-t">The back-relation</span><span class="lz-d">No column in the database. It exists so <code>user.posts</code> is a thing you can write. Forget it and <code>prisma generate</code> refuses to run — Chapter 3.</span></div>
  <div class="lz-step"><span class="lz-k">@relation(fields, references)</span><span class="lz-t">The foreign key</span><span class="lz-d">This side owns the column. <code>author_id</code> in <code>posts</code> points at <code>id</code> in <code>users</code>, and PostgreSQL enforces it.</span></div>
  <div class="lz-step"><span class="lz-k">onDelete: Cascade</span><span class="lz-t">The referential action</span><span class="lz-d">Delete a user and their posts go too. The alternative is an error you cannot delete past. Chapter 3 shows all five options and what each does to real rows.</span></div>
  <div class="lz-step"><span class="lz-k">@@index([authorId])</span><span class="lz-t">The index you must ask for</span><span class="lz-d">Prisma indexes unique fields and primary keys automatically. It does <strong>not</strong> index foreign keys. Without this line, "all posts by this user" is a sequential scan — Chapter 9 measures it.</span></div>
</div>

<h3>Write: one user, two posts, one query</h3>
<pre><code><span class="tok-comment">// src/tour.ts — run with: npx tsx src/tour.ts</span>
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ log: ['query'] });

<span class="tok-comment">// 1 — nested create: parent and children in one call</span>
const an = await prisma.user.create({
  data: {
    email: 'an@example.com',
    fullName: 'Nguyen Van An',
    posts: {
      create: [
        { title: 'Bai dau money', body: 'Xin chao', published: true, views: 120 },
        { title: 'Bai nhap', body: null },
      ],
    },
  },
  include: { posts: true },
});
console.log(an);</code></pre>
<div class="out">prisma:query BEGIN
prisma:query INSERT INTO "public"."users" ("email","full_name","created_at") VALUES ($1,$2,$3) RETURNING "public"."users"."id"
prisma:query INSERT INTO "public"."posts" ("title","body","published","views","created_at","author_id") VALUES ($1,$2,$3,$4,$5,$6), ($7,$8,$9,$10,$11,$12)
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."full_name", "public"."users"."created_at" FROM "public"."users" WHERE "public"."users"."id" = $1 LIMIT $2 OFFSET $3
prisma:query SELECT "public"."posts"."id", "public"."posts"."title", ... FROM "public"."posts" WHERE "public"."posts"."author_id" IN ($1) OFFSET $2
prisma:query COMMIT

{
  id: 1,
  email: 'an@example.com',
  fullName: 'Nguyen Van An',
  createdAt: 2026-08-23T04:51:02.774Z,
  posts: [
    { id: 1, title: 'Bai dau tien', body: 'Xin chao', published: true, views: 120, createdAt: ..., authorId: 1 },
    { id: 2, title: 'Bai nhap', body: null, published: false, views: 0, createdAt: ..., authorId: 1 }
  ]
}</div>
<div class="callout">
<p><strong>Read those six lines of SQL.</strong> One <code>create</code> call became a transaction, two inserts (the second one <em>batched</em> both posts into a single statement), and two selects to build the <code>include</code>. That is five round trips where a hand-written version might use one — and it is also why nobody hand-writes it. Chapter 9 shows how <code>relationLoadStrategy: "join"</code> collapses the two selects into one, and Chapter 4 explains exactly when nested writes are worth it.</p>
</div>

<h3>Read: the six ways to ask</h3>
<pre><code><span class="tok-comment">// 2 — by unique field. Returns T | null.</span>
const u = await prisma.user.findUnique({ where: { email: 'an@example.com' } });

<span class="tok-comment">// 3 — same but throws P2025 instead of returning null</span>
const u2 = await prisma.user.findUniqueOrThrow({ where: { id: 1 } });

<span class="tok-comment">// 4 — first match of any filter, with ordering</span>
const newest = await prisma.post.findFirst({
  where: { published: true },
  orderBy: { createdAt: 'desc' },
});

<span class="tok-comment">// 5 — many, filtered, sorted, paginated</span>
const page = await prisma.post.findMany({
  where: { published: true, views: { gt: 100 } },
  orderBy: { views: 'desc' },
  take: 10,
  skip: 0,
});

<span class="tok-comment">// 6 — pick columns. The return TYPE narrows to exactly these.</span>
const slim = await prisma.post.findMany({
  select: { id: true, title: true, author: { select: { email: true } } },
});

<span class="tok-comment">// 7 — whole row plus relations</span>
const fat = await prisma.user.findMany({ include: { posts: true } });</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" WHERE ("public"."posts"."published" = $1 AND "public"."posts"."views" &gt; $2) ORDER BY "public"."posts"."views" DESC LIMIT $3 OFFSET $4</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>select</code> and <code>include</code> are mutually exclusive</span><span class="v">At the same level, you use one or the other. Both at once is a runtime error. <code>select</code> means "only these"; <code>include</code> means "everything plus these relations". You can nest a <code>select</code> inside an <code>include</code>, which is how you get "the whole post, but only the author's email".</span></div>
  <div class="kv"><span class="k">The type follows the query</span><span class="v">Hover <code>slim[0]</code> in your editor: it is <code>{ id: number; title: string; author: { email: string } }</code>. Not the full <code>Post</code>. This is the feature that makes the whole thing worth it, and Chapter 8 explains the type machinery behind it.</span></div>
  <div class="kv"><span class="k"><code>findUnique</code> only accepts unique fields</span><span class="v"><code>where: { title: 'x' }</code> will not compile on <code>findUnique</code> because <code>title</code> is not unique. Use <code>findFirst</code>. This is a compile-time guard against a query that silently returns an arbitrary row.</span></div>
</div>

<h3>Update, upsert, delete</h3>
<pre><code><span class="tok-comment">// 8 — update one row by unique field</span>
await prisma.post.update({ where: { id: 2 }, data: { published: true } });

<span class="tok-comment">// 9 — atomic increment. NOT read-then-write. This matters — Chapter 7.</span>
await prisma.post.update({ where: { id: 1 }, data: { views: { increment: 1 } } });

<span class="tok-comment">// 10 — update many, returns a count not the rows</span>
const r = await prisma.post.updateMany({
  where: { views: { lt: 10 } },
  data: { published: false },
});
console.log(r);

<span class="tok-comment">// 11 — insert or update, in one statement</span>
await prisma.user.upsert({
  where: { email: 'binh@example.com' },
  update: { fullName: 'Tran Thi Binh' },
  create: { email: 'binh@example.com', fullName: 'Tran Thi Binh' },
});

<span class="tok-comment">// 12 — delete. onDelete: Cascade takes the posts with it.</span>
await prisma.user.delete({ where: { email: 'binh@example.com' } });</code></pre>
<div class="out">prisma:query UPDATE "public"."posts" SET "views" = "public"."posts"."views" + $1 WHERE ("public"."posts"."id" = $2 AND 1=1) RETURNING ...
{ count: 1 }
prisma:query INSERT INTO "public"."users" ("email","full_name","created_at") VALUES ($1,$2,$3) ON CONFLICT ("email") DO UPDATE SET "full_name" = $4 RETURNING ...</div>
<div class="pitfall">
<p><strong>Trap — <code>{ views: { increment: 1 } }</code> versus <code>{ views: post.views + 1 }</code>.</strong> They look equivalent. They are not. The first becomes <code>SET views = views + 1</code> and is safe under concurrency. The second reads a number into your process, adds one there, and writes it back — so two simultaneous requests both read 120, both write 121, and one view is gone forever. This is the classic lost-update race, it is invisible in development where you are the only user, and Chapter 7 reproduces it with real concurrent clients.</p>
</div>

<h3>Count and aggregate</h3>
<pre><code><span class="tok-comment">// 13 — counting, including counting a relation</span>
const total = await prisma.post.count({ where: { published: true } });

const withCounts = await prisma.user.findMany({
  include: { _count: { select: { posts: true } } },
});

<span class="tok-comment">// 14 — group and aggregate, without leaving the client</span>
const stats = await prisma.post.groupBy({
  by: ['published'],
  _count: { _all: true },
  _avg: { views: true },
  _max: { views: true },
});
console.log(stats);</code></pre>
<div class="out">prisma:query SELECT "public"."posts"."published", COUNT(*), AVG("public"."posts"."views"), MAX("public"."posts"."views") FROM "public"."posts" GROUP BY "public"."posts"."published"

[
  { published: false, _count: { _all: 1 }, _avg: { views: 0 },   _max: { views: 0 } },
  { published: true,  _count: { _all: 1 }, _avg: { views: 121 }, _max: { views: 121 } }
]</div>
<p><code>_count</code> inside <code>include</code> is worth noticing early. It is how you render "12 posts" next to a username without loading twelve posts, and it is a place beginners reliably reach for <code>include: { posts: true }</code> and then call <code>.length</code> — which fetches every row to count them.</p>

<h3>See it with your own eyes: Prisma Studio</h3>
<pre><code>npx prisma studio</code></pre>
<div class="out">Environment variables loaded from .env
Prisma Studio is up on http://localhost:5555</div>
<p>A browsable, editable view of every table, with relations rendered as links you can click through. Two honest warnings: it connects with your <code>DATABASE_URL</code>, so pointing it at production means one careless click edits production; and it is a development tool, not an admin panel — do not ship it.</p>

<h3>The other direction: an existing database</h3>
<p>Not every project starts empty. If you have a database already, Prisma will write the schema for you:</p>
<pre><code>npx prisma db pull</code></pre>
<div class="out">Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "hocprisma", schema "public" at "localhost:5432"

Introspecting based on datasource defined in prisma/schema.prisma ...

✔ Introspected 2 models and wrote them into prisma/schema.prisma in 143ms

Run prisma generate to generate Prisma Client.</div>
<p>Introspection is how most real adoptions begin, and it is well behaved: it preserves your <code>@map</code> names and your relation names on re-runs. What it cannot infer is anything the database does not encode — a relation with no foreign key constraint becomes two unrelated fields, and you must add the <code>@relation</code> yourself. Chapter 6 covers adopting an existing database properly, including the <code>migrate diff</code> trick for generating a baseline migration.</p>

<div class="callout ok">
<p><strong>You now have the whole surface in miniature.</strong> Everything from here is depth: what else the schema language can express (Ch 2–3), what else the client can do (Ch 4–5), how changes reach production safely (Ch 6), what happens under concurrency (Ch 7), and what all of it costs (Ch 9). If you only remember one habit from this lesson, make it <code>log: ['query']</code>.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">CRUD — Prisma Client queries</span><span class="lc-sub">prisma.io/docs · The reference for everything in this lesson, with a runnable example per operation</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">Logging — event-based and stdout</span><span class="lc-sub">prisma.io/docs · How to capture the SQL as structured events with duration, not just print it</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/tools/prisma-studio" target="_blank" rel="noopener"><span class="lc-ico">🪟</span><span class="lc-body"><span class="lc-title">Prisma Studio</span><span class="lc-sub">prisma.io/docs · What it can and cannot edit, and why it is a dev tool rather than an admin UI</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/introspection" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">Introspection — <code>prisma db pull</code></span><span class="lc-sub">prisma.io/docs · What it can infer from an existing database and what it cannot</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Rewrite these fourteen queries from a plain-language spec, then check the SQL each one produced</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Năm phút đầu tiên của bạn</h2>
<p class="lead">Mười bốn câu truy vấn, mỗi câu kèm đúng đoạn SQL Prisma đã gửi đi. Phần cuối ấy mới là trọng tâm của bài: phần lớn người học Prisma như học một bộ thần chú, và chỉ phát hiện ra SQL khi có thứ gì đó chạy chậm. Học hai thứ cùng nhau ngay từ phút đầu thì bạn sẽ không bao giờ viết ra một câu truy vấn có giá làm bạn bất ngờ.</p>

<h3>Một lược đồ có quan hệ</h3>
<p>Thay <code>prisma/schema.prisma</code> bằng đoạn này. Hai model và một quan hệ — thứ nhỏ nhất mà vẫn còn thú vị:</p>
<pre><code>generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  fullName  String?  @map("full_name")
  createdAt DateTime @default(now()) @map("created_at")

  posts     Post[]

  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  body      String?
  published Boolean  @default(false)
  views     Int      @default(0)
  createdAt DateTime @default(now()) @map("created_at")

  authorId  Int      @map("author_id")
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([authorId])
  @@map("posts")
}</code></pre>
<pre><code>npx prisma migrate dev --name them_post</code></pre>
<div class="out">Applying migration &#96;20260823044930_them_post&#96;

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260823044930_them_post/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v6.7.0) to ./node_modules/@prisma/client in 91ms</div>
<p>Ba dòng trong lược đồ đó làm phần việc thật, và mỗi dòng sau này có nguyên một chương:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">posts Post[]</span><span class="lz-t">Quan hệ ngược</span><span class="lz-d">Không có cột nào dưới cơ sở dữ liệu. Nó tồn tại để <code>user.posts</code> là thứ bạn viết được. Quên nó thì <code>prisma generate</code> từ chối chạy — Chương 3.</span></div>
  <div class="lz-step"><span class="lz-k">@relation(fields, references)</span><span class="lz-t">Khoá ngoại</span><span class="lz-d">Phía này sở hữu cột. <code>author_id</code> trong <code>posts</code> trỏ tới <code>id</code> trong <code>users</code>, và PostgreSQL thi hành ràng buộc đó.</span></div>
  <div class="lz-step"><span class="lz-k">onDelete: Cascade</span><span class="lz-t">Hành vi tham chiếu</span><span class="lz-d">Xoá một người dùng thì bài viết của họ đi theo. Lựa chọn còn lại là một lỗi bạn không xoá qua được. Chương 3 chỉ đủ năm tuỳ chọn và mỗi cái làm gì với hàng dữ liệu thật.</span></div>
  <div class="lz-step"><span class="lz-k">@@index([authorId])</span><span class="lz-t">Chỉ mục bạn phải tự xin</span><span class="lz-d">Prisma tự đánh chỉ mục cho trường unique và khoá chính. Nó <strong>KHÔNG</strong> đánh chỉ mục cho khoá ngoại. Thiếu dòng này thì "mọi bài của người này" là một lần quét tuần tự — Chương 9 đo bằng số.</span></div>
</div>

<h3>Ghi: một người dùng, hai bài viết, một lời gọi</h3>
<pre><code><span class="tok-comment">// src/tour.ts — chạy bằng: npx tsx src/tour.ts</span>
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ log: ['query'] });

<span class="tok-comment">// 1 — create lồng nhau: cha và con trong một lời gọi</span>
const an = await prisma.user.create({
  data: {
    email: 'an@example.com',
    fullName: 'Nguyen Van An',
    posts: {
      create: [
        { title: 'Bai dau money', body: 'Xin chao', published: true, views: 120 },
        { title: 'Bai nhap', body: null },
      ],
    },
  },
  include: { posts: true },
});
console.log(an);</code></pre>
<div class="out">prisma:query BEGIN
prisma:query INSERT INTO "public"."users" ("email","full_name","created_at") VALUES ($1,$2,$3) RETURNING "public"."users"."id"
prisma:query INSERT INTO "public"."posts" ("title","body","published","views","created_at","author_id") VALUES ($1,$2,$3,$4,$5,$6), ($7,$8,$9,$10,$11,$12)
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."full_name", "public"."users"."created_at" FROM "public"."users" WHERE "public"."users"."id" = $1 LIMIT $2 OFFSET $3
prisma:query SELECT "public"."posts"."id", "public"."posts"."title", ... FROM "public"."posts" WHERE "public"."posts"."author_id" IN ($1) OFFSET $2
prisma:query COMMIT

{
  id: 1,
  email: 'an@example.com',
  fullName: 'Nguyen Van An',
  createdAt: 2026-08-23T04:51:02.774Z,
  posts: [
    { id: 1, title: 'Bai dau tien', body: 'Xin chao', published: true, views: 120, createdAt: ..., authorId: 1 },
    { id: 2, title: 'Bai nhap', body: null, published: false, views: 0, createdAt: ..., authorId: 1 }
  ]
}</div>
<div class="callout">
<p><strong>Đọc sáu dòng SQL đó.</strong> Một lời gọi <code>create</code> đã thành một giao dịch, hai câu insert (câu thứ hai <em>gộp</em> cả hai bài viết vào một statement), và hai câu select để dựng phần <code>include</code>. Đó là năm lượt đi về trong khi bản viết tay có thể chỉ cần một — và cũng chính vì thế không ai viết tay nó cả. Chương 9 chỉ cách <code>relationLoadStrategy: "join"</code> gộp hai câu select thành một, còn Chương 4 giải thích chính xác khi nào ghi lồng nhau là đáng.</p>
</div>

<h3>Đọc: sáu cách để hỏi</h3>
<pre><code><span class="tok-comment">// 2 — theo trường unique. Trả về T | null.</span>
const u = await prisma.user.findUnique({ where: { email: 'an@example.com' } });

<span class="tok-comment">// 3 — y hệt nhưng ném P2025 thay vì trả null</span>
const u2 = await prisma.user.findUniqueOrThrow({ where: { id: 1 } });

<span class="tok-comment">// 4 — bản khớp đầu tiên của bộ lọc bất kỳ, có sắp xếp</span>
const newest = await prisma.post.findFirst({
  where: { published: true },
  orderBy: { createdAt: 'desc' },
});

<span class="tok-comment">// 5 — nhiều bản, có lọc, có sắp, có phân trang</span>
const page = await prisma.post.findMany({
  where: { published: true, views: { gt: 100 } },
  orderBy: { views: 'desc' },
  take: 10,
  skip: 0,
});

<span class="tok-comment">// 6 — chọn cột. KIỂU trả về thu hẹp lại đúng bằng đây.</span>
const slim = await prisma.post.findMany({
  select: { id: true, title: true, author: { select: { email: true } } },
});

<span class="tok-comment">// 7 — nguyên hàng cộng thêm quan hệ</span>
const fat = await prisma.user.findMany({ include: { posts: true } });</code></pre>
<div class="out">prisma:query SELECT ... FROM "public"."posts" WHERE ("public"."posts"."published" = $1 AND "public"."posts"."views" &gt; $2) ORDER BY "public"."posts"."views" DESC LIMIT $3 OFFSET $4</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>select</code> và <code>include</code> loại trừ nhau</span><span class="v">Ở cùng một tầng, bạn dùng cái này hoặc cái kia. Dùng cả hai là lỗi lúc chạy. <code>select</code> nghĩa là "chỉ những cái này"; <code>include</code> nghĩa là "tất cả cộng thêm mấy quan hệ này". Bạn lồng được một <code>select</code> bên trong một <code>include</code>, và đó là cách để có "nguyên bài viết, nhưng chỉ email của tác giả".</span></div>
  <div class="kv"><span class="k">Kiểu đi theo câu truy vấn</span><span class="v">Rê chuột lên <code>slim[0]</code> trong trình soạn thảo: nó là <code>{ id: number; title: string; author: { email: string } }</code>. Không phải <code>Post</code> đầy đủ. Đây là tính năng khiến toàn bộ chuyện này đáng làm, và Chương 8 giải thích bộ máy kiểu đứng sau.</span></div>
  <div class="kv"><span class="k"><code>findUnique</code> chỉ nhận trường unique</span><span class="v"><code>where: { title: 'x' }</code> sẽ không biên dịch được trên <code>findUnique</code> vì <code>title</code> không unique. Hãy dùng <code>findFirst</code>. Đây là một hàng rào lúc biên dịch chặn kiểu truy vấn âm thầm trả về một hàng bất kỳ.</span></div>
</div>

<h3>Update, upsert, delete</h3>
<pre><code><span class="tok-comment">// 8 — sửa một hàng theo trường unique</span>
await prisma.post.update({ where: { id: 2 }, data: { published: true } });

<span class="tok-comment">// 9 — tăng nguyên tử. KHÔNG phải đọc-rồi-ghi. Điều này quan trọng — Chương 7.</span>
await prisma.post.update({ where: { id: 1 }, data: { views: { increment: 1 } } });

<span class="tok-comment">// 10 — sửa nhiều hàng, trả về số đếm chứ không phải các hàng</span>
const r = await prisma.post.updateMany({
  where: { views: { lt: 10 } },
  data: { published: false },
});
console.log(r);

<span class="tok-comment">// 11 — chèn hoặc cập nhật, trong một statement</span>
await prisma.user.upsert({
  where: { email: 'binh@example.com' },
  update: { fullName: 'Tran Thi Binh' },
  create: { email: 'binh@example.com', fullName: 'Tran Thi Binh' },
});

<span class="tok-comment">// 12 — xoá. onDelete: Cascade kéo theo các bài viết.</span>
await prisma.user.delete({ where: { email: 'binh@example.com' } });</code></pre>
<div class="out">prisma:query UPDATE "public"."posts" SET "views" = "public"."posts"."views" + $1 WHERE ("public"."posts"."id" = $2 AND 1=1) RETURNING ...
{ count: 1 }
prisma:query INSERT INTO "public"."users" ("email","full_name","created_at") VALUES ($1,$2,$3) ON CONFLICT ("email") DO UPDATE SET "full_name" = $4 RETURNING ...</div>
<div class="pitfall">
<p><strong>Bẫy — <code>{ views: { increment: 1 } }</code> so với <code>{ views: post.views + 1 }</code>.</strong> Trông tương đương. Không hề. Cái đầu thành <code>SET views = views + 1</code> và an toàn khi có tranh chấp. Cái sau đọc một con số vào tiến trình của bạn, cộng một ở đó, rồi ghi ngược lại — nên hai yêu cầu xảy ra cùng lúc cùng đọc 120, cùng ghi 121, và một lượt xem mất vĩnh viễn. Đây là cuộc đua mất-cập-nhật kinh điển, nó vô hình lúc phát triển vì bạn là người dùng duy nhất, và Chương 7 dựng lại nó bằng các client chạy song song thật.</p>
</div>

<h3>Đếm và tổng hợp</h3>
<pre><code><span class="tok-comment">// 13 — đếm, kể cả đếm một quan hệ</span>
const total = await prisma.post.count({ where: { published: true } });

const withCounts = await prisma.user.findMany({
  include: { _count: { select: { posts: true } } },
});

<span class="tok-comment">// 14 — gộp nhóm và tổng hợp, không cần rời client</span>
const stats = await prisma.post.groupBy({
  by: ['published'],
  _count: { _all: true },
  _avg: { views: true },
  _max: { views: true },
});
console.log(stats);</code></pre>
<div class="out">prisma:query SELECT "public"."posts"."published", COUNT(*), AVG("public"."posts"."views"), MAX("public"."posts"."views") FROM "public"."posts" GROUP BY "public"."posts"."published"

[
  { published: false, _count: { _all: 1 }, _avg: { views: 0 },   _max: { views: 0 } },
  { published: true,  _count: { _all: 1 }, _avg: { views: 121 }, _max: { views: 121 } }
]</div>
<p><code>_count</code> đặt bên trong <code>include</code> đáng để ý sớm. Đó là cách bạn hiển thị "12 bài viết" cạnh tên người dùng mà không nạp mười hai bài viết, và cũng là chỗ người mới đều đặn với tay tới <code>include: { posts: true }</code> rồi gọi <code>.length</code> — tức là kéo về mọi hàng chỉ để đếm chúng.</p>

<h3>Nhìn tận mắt: Prisma Studio</h3>
<pre><code>npx prisma studio</code></pre>
<div class="out">Environment variables loaded from .env
Prisma Studio is up on http://localhost:5555</div>
<p>Một giao diện duyệt và sửa được cho mọi bảng, với quan hệ vẽ thành liên kết bấm qua được. Hai lời cảnh báo trung thực: nó kết nối bằng đúng <code>DATABASE_URL</code> của bạn, nên trỏ nó vào production nghĩa là một cú bấm bất cẩn sửa thẳng production; và nó là công cụ phát triển, không phải bảng quản trị — đừng đưa nó lên chạy thật.</p>

<h3>Hướng ngược lại: một cơ sở dữ liệu đã có</h3>
<p>Không phải dự án nào cũng bắt đầu từ trống. Nếu bạn đã có cơ sở dữ liệu, Prisma sẽ viết lược đồ hộ bạn:</p>
<pre><code>npx prisma db pull</code></pre>
<div class="out">Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "hocprisma", schema "public" at "localhost:5432"

Introspecting based on datasource defined in prisma/schema.prisma ...

✔ Introspected 2 models and wrote them into prisma/schema.prisma in 143ms

Run prisma generate to generate Prisma Client.</div>
<p>Nội soi lược đồ là cách phần lớn các lần áp dụng thật bắt đầu, và nó cư xử tử tế: nó giữ nguyên tên <code>@map</code> và tên quan hệ của bạn qua các lần chạy lại. Thứ nó không suy ra được là những gì cơ sở dữ liệu không ghi lại — một quan hệ không có ràng buộc khoá ngoại sẽ thành hai trường rời rạc, và bạn phải tự thêm <code>@relation</code>. Chương 6 nói đủ về việc tiếp quản một cơ sở dữ liệu có sẵn, kể cả mẹo <code>migrate diff</code> để sinh một migration nền.</p>

<div class="callout ok">
<p><strong>Giờ bạn đã có toàn bộ bề mặt ở dạng thu nhỏ.</strong> Từ đây trở đi là chiều sâu: ngôn ngữ lược đồ còn diễn đạt được gì (Ch 2–3), client còn làm được gì (Ch 4–5), thay đổi đi tới production an toàn ra sao (Ch 6), chuyện gì xảy ra khi có tranh chấp (Ch 7), và tất cả những thứ đó tốn bao nhiêu (Ch 9). Nếu chỉ giữ lại một thói quen từ bài này, hãy giữ <code>log: ['query']</code>.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/crud" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">CRUD — Prisma Client queries</span><span class="lc-sub">prisma.io/docs · Bản tra cứu cho mọi thứ trong bài này, mỗi thao tác kèm một ví dụ chạy được</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">Logging — theo sự kiện và ra stdout</span><span class="lc-sub">prisma.io/docs · Cách bắt SQL thành sự kiện có cấu trúc kèm thời lượng, chứ không chỉ in ra</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/tools/prisma-studio" target="_blank" rel="noopener"><span class="lc-ico">🪟</span><span class="lc-body"><span class="lc-title">Prisma Studio</span><span class="lc-sub">prisma.io/docs · Nó sửa được gì và không sửa được gì, và vì sao nó là công cụ dev chứ không phải giao diện quản trị</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/introspection" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">Introspection — <code>prisma db pull</code></span><span class="lc-sub">prisma.io/docs · Nó suy ra được gì từ cơ sở dữ liệu có sẵn và không suy ra được gì</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Viết lại mười bốn câu truy vấn này từ một bản mô tả bằng lời, rồi kiểm SQL mà mỗi câu sinh ra</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — Quiz: getting oriented|||0.4 — Trắc nghiệm: định hướng',
      slug: 'pr-0-4-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về hai gói và vai trò của chúng, mật khẩu có ký tự đặc biệt trong DATABASE_URL, client sinh ra nằm ở đâu, select với include, increment nguyên tử, và vì sao một PrismaClient cho mỗi tệp là tai hoạ.',
      content: `
<div class="ml-en">
<p>Six questions on Section 0. Each one maps to a mistake that costs a real afternoon: the package split, the connection string, where generated code lives, the difference between <code>select</code> and <code>include</code>, atomic updates, and client instances.</p>
</div>
<div class="ml-vi">
<p>Sáu câu cho Mục 0. Mỗi câu ứng với một lỗi từng ngốn của ai đó nguyên một buổi chiều: cách chia hai gói, chuỗi kết nối, mã sinh ra nằm ở đâu, khác nhau giữa <code>select</code> và <code>include</code>, cập nhật nguyên tử, và số thực thể client.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 540,
        questions: [
          {
            question: 'Why is `prisma` a devDependency while `@prisma/client` is a regular dependency?|||Vì sao `prisma` là devDependency còn `@prisma/client` là dependency thường?',
            options: [
              'The CLI is only used at build time and by developers at a terminal; the application imports only the generated client|||CLI chỉ dùng lúc build và bởi lập trình viên ở terminal; ứng dụng chỉ import client được sinh ra',
              'The CLI is too large to ship, so it must be excluded from production installs|||CLI quá lớn để đưa lên chạy thật, nên bắt buộc phải loại khỏi bản cài production',
              'They are interchangeable — the split is only a convention with no practical effect|||Hai gói thay thế được cho nhau — cách chia chỉ là quy ước, không có tác dụng thực tế nào',
              'The client is a devDependency too; putting it in dependencies is a common mistake|||Client cũng là devDependency; đặt nó vào dependencies là một lỗi phổ biến',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your database password is `p@ssw0rd`. What must the DATABASE_URL contain?|||Mật khẩu cơ sở dữ liệu của bạn là `p@ssw0rd`. DATABASE_URL phải chứa gì?',
            options: [
              '`p%40ssw0rd` — the `@` must be percent-encoded, or the URL parser reads it as the host separator|||`p%40ssw0rd` — ký tự `@` bắt buộc phải mã hoá phần trăm, nếu không bộ phân tích URL đọc nó là dấu ngăn phần host',
              '`p@ssw0rd` unchanged — Prisma parses the last `@` as the separator, so it works|||`p@ssw0rd` giữ nguyên — Prisma lấy dấu `@` cuối cùng làm dấu ngăn, nên vẫn chạy',
              '`"p@ssw0rd"` in double quotes inside the URL|||`"p@ssw0rd"` đặt trong ngoặc kép ngay bên trong URL',
              'Nothing special — special characters only matter for MySQL, not PostgreSQL|||Không cần gì đặc biệt — ký tự đặc biệt chỉ ảnh hưởng MySQL, không ảnh hưởng PostgreSQL',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Where does `prisma generate` write the code your application imports?|||`prisma generate` viết đoạn mã mà ứng dụng của bạn import vào đâu?',
            options: [
              'Into `node_modules/.prisma/client`, which `@prisma/client` re-exports — so it is regenerated, never committed|||Vào `node_modules/.prisma/client`, rồi `@prisma/client` xuất lại — nên nó được sinh lại, không bao giờ commit',
              'Into `prisma/generated/`, which should be committed so teammates do not need to generate|||Vào `prisma/generated/`, và nên commit để đồng đội khỏi phải generate',
              'Nowhere — the client reads `schema.prisma` at runtime and builds its API dynamically|||Không đâu cả — client đọc `schema.prisma` lúc chạy rồi dựng API động',
              'Into `dist/`, alongside your compiled TypeScript output|||Vào `dist/`, nằm cạnh phần TypeScript đã biên dịch của bạn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does `select` do that `include` does not?|||`select` làm được gì mà `include` không làm được?',
            options: [
              'It restricts which scalar columns are returned, and the TypeScript return type narrows to exactly those|||Nó giới hạn những cột vô hướng được trả về, và kiểu TypeScript trả về thu hẹp đúng bằng những cột đó',
              'It loads relations, which `include` cannot do|||Nó nạp quan hệ, thứ mà `include` không làm được',
              'It runs the query in a transaction, which `include` does not|||Nó chạy câu truy vấn trong một giao dịch, còn `include` thì không',
              'Nothing — they are aliases, and you may use both at the same level|||Không gì cả — hai cái là tên gọi khác của nhau, và dùng cả hai ở cùng một tầng cũng được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Two requests arrive at the same instant to increment a post view count of 120. Which version ends at 122?|||Hai yêu cầu tới cùng lúc để tăng lượt xem của một bài đang là 120. Bản nào kết thúc ở 122?',
            options: [
              '`data: { views: { increment: 1 } }` — it becomes `SET views = views + 1`, computed by the database|||`data: { views: { increment: 1 } }` — nó thành `SET views = views + 1`, do cơ sở dữ liệu tự tính',
              '`data: { views: post.views + 1 }` — reading first is safer because you know the current value|||`data: { views: post.views + 1 }` — đọc trước thì an toàn hơn vì bạn biết giá trị hiện tại',
              'Both, because Prisma automatically wraps every update in a transaction|||Cả hai, vì Prisma tự bọc mọi lần update trong một giao dịch',
              'Neither — you must use raw SQL for concurrent counters|||Không bản nào — bộ đếm chạy song song bắt buộc phải dùng SQL thô',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What happens if you construct a new PrismaClient in every module that needs it?|||Chuyện gì xảy ra nếu mỗi module cần dùng lại tự dựng một PrismaClient mới?',
            options: [
              'Each instance opens its own connection pool, and you exhaust the database max_connections|||Mỗi thực thể mở connection pool riêng, và bạn vét cạn max_connections của cơ sở dữ liệu',
              'Nothing — Prisma detects existing instances and reuses a single shared pool|||Không sao cả — Prisma phát hiện các thực thể đã có và dùng chung một pool duy nhất',
              'The queries become slower but connection count stays the same|||Truy vấn chậm đi nhưng số kết nối vẫn giữ nguyên',
              'TypeScript refuses to compile a second instantiation|||TypeScript từ chối biên dịch lần khởi tạo thứ hai',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
