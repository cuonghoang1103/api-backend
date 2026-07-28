/**
 * Node.js — Chương 7: PostgreSQL + Prisma.
 * Mọi output là đo thật: Node v22.21.0, PostgreSQL 15.4, prisma 7.9.1,
 * @prisma/adapter-pg, bảng Note 751.000 dòng trên máy local.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 7 — PostgreSQL and Prisma|||Chương 7 — PostgreSQL và Prisma',
  description: 'Đổi ruột Notes API từ RAM sang PostgreSQL: kết nối và pool, lược đồ và migration, transaction, bẫy N+1, chỉ mục đo bằng EXPLAIN ANALYZE, và hợp đồng API khi có dữ liệu thật.',
  lessons: [
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — Why a database, and what one connection really costs|||7.1 — Vì sao cần cơ sở dữ liệu, và một kết nối thật sự tốn gì',
      slug: 'nodejs-7-1-ket-noi-va-pool',
      type: 'VIDEO',
      description: 'Chứng minh dữ liệu trong RAM biến mất, đo giá của một kết nối PostgreSQL, và hiểu pool bằng bốn phép đo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Why a database, and what one connection really costs</h2>
<p class="lead">The Notes API from chapter 5 works. It also loses every note the moment the process stops — which is every deploy, every crash, every <code>Ctrl+C</code>. This chapter replaces that <code>Map</code> with PostgreSQL, and it starts where most tutorials skip: with the connection, because almost every "the database is slow" incident in production is really a connection problem.</p>

<h3>First, the failure we are fixing</h3>
<p>Chapter 5 stored notes in <code>new Map()</code>. Here is that store meeting an ordinary restart — nothing exotic, just the thing that happens on every deploy:</p>
<pre><code><span class="tok-comment"># with the in-memory service</span>
curl -X POST /api/v1/notes -d '{"title":"Learning Prisma"}'   <span class="tok-comment"># 201, id 1</span>
kill %1 &amp;&amp; node src/index.mjs                                 <span class="tok-comment"># restart, like a deploy</span>
curl /api/v1/notes</code></pre>
<div class="out">{"items":[],"page":1,"limit":10,"total":0}</div>
<p>Now the same sequence after this chapter's swap, captured from the real server run at the end of lesson 7.3:</p>
<div class="out">{"items":[{"id":1,"title":"Learning Prisma","slug":"note-1785169979420",
  "body":"đã sửa","pinned":false,"authorId":1,
  "createdAt":"2026-07-27T16:32:59.481Z","updatedAt":"2026-07-27T16:32:59.614Z",
  "version":1}],"page":1,"limit":10,"total":1}</div>
<div class="callout ok">Same request, same route file, same status code — the note is simply still there. That is the entire user-visible difference, and it is worth the whole chapter.</div>

<h3>What you actually buy with a relational database</h3>
<p>Durability is only the headline. The list below is what makes a database different from "a file you write JSON into", and every item shows up later in this course:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Durability</span><span class="v">A committed write survives a crash — the database wrote it to disk (its write-ahead log) before answering you.</span></div>
  <div class="kv"><span class="k">Shared truth</span><span class="v">Two Node processes (chapter 17 runs several containers) see the same data. Two <code>Map</code>s never do.</span></div>
  <div class="kv"><span class="k">Constraints</span><span class="v">"email is unique", "a note must belong to a user that exists" — enforced by the database, so a bug in your code cannot corrupt the data.</span></div>
  <div class="kv"><span class="k">Transactions</span><span class="v">Several writes that either all happen or none do (lesson 7.3). Impossible to build correctly by hand.</span></div>
  <div class="kv"><span class="k">Query engine</span><span class="v">Filter, sort, group and join millions of rows with an index (lesson 7.5) instead of a JavaScript <code>for</code> loop over everything.</span></div>
  <div class="kv"><span class="k">Concurrency control</span><span class="v">Two users editing the same note at the same instant get a defined outcome, not a coin flip (lesson 7.6).</span></div>
</div>

<h3>The shape of the stack</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">your route / service code</span><span class="lz-lnote">prisma.note.findMany({ where: … })</span></div>
  <div class="lz-layer"><span class="lz-lname">Prisma Client</span><span class="lz-lnote">turns that object into SQL and the rows back into JS values</span></div>
  <div class="lz-layer"><span class="lz-lname">driver adapter (pg)</span><span class="lz-lnote">owns the TCP sockets — this is the pool</span></div>
  <div class="lz-layer"><span class="lz-lname">PostgreSQL</span><span class="lz-lnote">one OS process per connection, plans and runs the query</span></div>
</div>
<p>Read that bottom layer twice. PostgreSQL forks <strong>an operating-system process for every open connection</strong>. That single design fact explains everything else in this lesson: why connections are expensive, why you reuse them, and why "just raise the pool size" is how people take a database down.</p>

<h3>Measurement 1 — what a fresh connection costs</h3>
<p>Fifty trivial <code>SELECT 1</code> queries, run two ways against the same local PostgreSQL 15.4:</p>
<pre><code><span class="tok-comment">// A: a brand-new connection for every query</span>
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; <span class="tok-number">50</span>; i++) {
  <span class="tok-keyword">const</span> c = <span class="tok-keyword">new</span> pg.<span class="tok-fn">Client</span>({ connectionString });
  <span class="tok-keyword">await</span> c.<span class="tok-fn">connect</span>();
  <span class="tok-keyword">await</span> c.<span class="tok-fn">query</span>(<span class="tok-string">'SELECT 1'</span>);
  <span class="tok-keyword">await</span> c.<span class="tok-fn">end</span>();
}

<span class="tok-comment">// B: one connection, reused</span>
<span class="tok-keyword">const</span> c = <span class="tok-keyword">new</span> pg.<span class="tok-fn">Client</span>({ connectionString });
<span class="tok-keyword">await</span> c.<span class="tok-fn">connect</span>();
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; <span class="tok-number">50</span>; i++) <span class="tok-keyword">await</span> c.<span class="tok-fn">query</span>(<span class="tok-string">'SELECT 1'</span>);</code></pre>
<div class="out">A: 50 queries, new connection each time : 402ms  (8.03ms/query)
B: 50 queries, one reused connection    :  19ms  (0.38ms/query)
B is 21.2× faster than A</div>
<p>The query itself is not 8ms of work — it is roughly 0.38ms of work wrapped in 7.6ms of handshake: TCP connect, authentication, PostgreSQL forking a backend process, session setup, then tearing all of it down again. On a network (your database is rarely on the same machine as your API) that overhead grows, because the handshake is several round trips, not one.</p>
<div class="callout">This is the whole argument for a connection pool in one number. A pool keeps N connections open and hands them out; your query pays the 0.38ms, not the 8.03ms.</div>

<h3>Measurement 2 — the pool, seen from the outside</h3>
<p>Twenty queries that each take exactly 100ms (<code>SELECT 1 FROM pg_sleep(0.1)</code>), all fired at once with <code>Promise.all</code>, against pools of different sizes. The second column is the number of PostgreSQL backends actually open, read from <code>pg_stat_activity</code>:</p>
<div class="out">pool max = 1             20 queries × 100ms -> 2160ms   | backends open: 1
pool max = 5             20 queries × 100ms ->  437ms   | backends open: 5
pool max = 10 (default)  20 queries × 100ms ->  237ms   | backends open: 10
pool max = 20            20 queries × 100ms ->  132ms   | backends open: 20</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">20 requests arrive</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">pool has 10 slots</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">10 run, 10 queue</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">slot freed → next in line runs</span></div>
</div>
<p>Nothing here is magic: with one slot the 20 queries serialise (20 × 100ms ≈ 2.1s), with 20 slots they run together (≈ 130ms). Notice the shape though — going 1 → 5 saved 1.7 seconds, going 10 → 20 saved 105ms. Pool size has sharply diminishing returns, which matters because the cost of a big pool is very real.</p>

<h3>Measurement 3 — why bigger is not better</h3>
<p>PostgreSQL's default <code>max_connections</code> is 100. Here is what happens when a client asks for the 101st, opened one at a time until it breaks:</p>
<div class="out">opened 100 connections, then it broke:
  sorry, too many clients already
  code = 53300</div>
<p>Now the version that actually happens in production. Your API runs 3 containers, each container accidentally builds 4 Prisma clients (one per module that forgot to share), each client opens a pool of 10:</p>
<div class="out">LỖI:
Invalid \`prisma.$queryRaw()\` invocation:
Raw query failed. Code: \`53300\`. Message: \`sorry, too many clients already\`
cause: 12 PrismaClient × pool of 10 = 120 connections &gt; max_connections 100</div>
<div class="pitfall"><strong>The arithmetic nobody does until it is 2am.</strong> Total connections = (number of processes) × (pool size per process) — plus your migrations job, plus the psql session you left open, plus any background worker (chapter 13). It must stay under <code>max_connections</code> with room to spare, because PostgreSQL reserves a few slots for superusers and refuses <em>everything</em> once it is full: a full database rejects your health check too, so the whole service looks dead.</div>
<div class="callout warn">Practical sizing: start with a pool of <strong>5–10 per process</strong> and count your processes. A 4-core API container serving normal CRUD saturates its CPU long before it saturates 10 database connections. If you truly need hundreds of clients, the answer is a connection pooler (PgBouncer) in front of PostgreSQL, not a bigger pool in Node.</div>

<h3>One client per process — the rule and the reason</h3>
<p>Every <code>new PrismaClient()</code> creates its own pool. Create one in a request handler and you have created a pool per request; the process will fall over in minutes. There is exactly one correct shape:</p>
<pre><code><span class="tok-comment">// src/db.mjs — created once, imported everywhere</span>
<span class="tok-keyword">import</span> <span class="tok-string">'dotenv/config'</span>;
<span class="tok-keyword">import</span> { PrismaPg } <span class="tok-keyword">from</span> <span class="tok-string">'@prisma/adapter-pg'</span>;
<span class="tok-keyword">import</span> { PrismaClient } <span class="tok-keyword">from</span> <span class="tok-string">'../generated/prisma/client.ts'</span>;

<span class="tok-keyword">const</span> adapter = <span class="tok-keyword">new</span> <span class="tok-fn">PrismaPg</span>({ connectionString: process.env.DATABASE_URL });
<span class="tok-keyword">export const</span> prisma = <span class="tok-keyword">new</span> <span class="tok-fn">PrismaClient</span>({ adapter });</code></pre>
<p>ES modules make this easy: a module body runs once per process no matter how many files import it, so <code>import { prisma } from './db.mjs'</code> in twenty files still means one client and one pool.</p>

<h3>The first request is always the slow one</h3>
<p>Prisma connects lazily — the pool opens on the first query, not at import. Here is the server log from lesson 7.3's real run, unedited:</p>
<div class="out">POST /api/v1/notes 201 91.7ms
POST /api/v1/notes 201 3.9ms
GET  /api/v1/notes?page=1&amp;limit=10 200 21.9ms
GET  /api/v1/notes?q=prisma 200 12.9ms
PATCH /api/v1/notes/1 200 7.2ms
DELETE /api/v1/notes/2 204 6.7ms</div>
<p>91.7ms then 3.9ms — a 24× difference for identical work. That first request paid for the connection handshake. In production this is the request that arrives one second after a deploy, and it is why a health check that touches the database is worth having: it warms the pool before real users do.</p>
<pre><code><span class="tok-comment">// warm the pool at boot instead of on a user's request</span>
<span class="tok-keyword">await</span> prisma.$<span class="tok-fn">connect</span>();
<span class="tok-keyword">const</span> server = <span class="tok-fn">createApp</span>().<span class="tok-fn">listen</span>(PORT);</code></pre>

<h3>Setting it up, exactly as run</h3>
<pre><code>npm i prisma @prisma/client @prisma/adapter-pg
npm i -D dotenv
npx prisma init --datasource-provider postgresql</code></pre>
<div class="out">prisma/
  schema.prisma
prisma.config.ts
.env
.gitignore</div>
<p><code>prisma.config.ts</code> is where Prisma 7 reads its settings, and it is plain code — which is why the <code>.env</code> file is loaded explicitly:</p>
<pre><code><span class="tok-keyword">import</span> <span class="tok-string">"dotenv/config"</span>;
<span class="tok-keyword">import</span> { defineConfig } <span class="tok-keyword">from</span> <span class="tok-string">"prisma/config"</span>;

<span class="tok-keyword">export default</span> <span class="tok-fn">defineConfig</span>({
  schema: <span class="tok-string">"prisma/schema.prisma"</span>,
  migrations: { path: <span class="tok-string">"prisma/migrations"</span> },
  datasource: {
    url: process.env[<span class="tok-string">"DATABASE_URL"</span>],
    shadowDatabaseUrl: process.env[<span class="tok-string">"SHADOW_DATABASE_URL"</span>],   <span class="tok-comment">// lesson 7.2</span>
  },
});</code></pre>
<div class="pitfall"><strong>Prisma 7 changed three things every older tutorial gets wrong.</strong> (1) The generator is <code>prisma-client</code> writing into <code>generated/prisma</code>, not <code>prisma-client-js</code> writing into <code>node_modules</code> — so you import from your own folder. (2) A <strong>driver adapter is required</strong>: without <code>new PrismaClient({ adapter })</code> the client throws at construction with a message telling you to install <code>@prisma/adapter-pg</code>. (3) <code>.env</code> is <strong>not</strong> auto-loaded any more; <code>import "dotenv/config"</code> or your variables are silently undefined. If a blog post from 2024 does none of these, it is describing Prisma 5.</div>
<div class="callout danger">Never put the real <code>DATABASE_URL</code> in a committed file. <code>prisma init</code> adds <code>.env</code> to <code>.gitignore</code> for you — keep it that way, and put a redacted copy in <code>.env.example</code> so teammates know which variables exist. Chapter 9 covers secrets properly.</div>

<div class="note-ct">
  <strong>How cuongthai.com does it.</strong> One file — <code>src/config/database.ts</code> — builds a single <code>PrismaClient</code> at process start and exports it; every service imports that. The comment at the top of that file says out loud why it is not a hot-reload singleton: production has no hot reload, and a cached global made environment-variable changes invisible after a deploy. Log levels are chosen from <code>NODE_ENV</code> (query timings in development, errors only in production), and the shutdown handler from lesson 5.5 calls <code>prisma.$disconnect()</code> so the pool closes cleanly instead of leaving PostgreSQL backends to time out.
</div>

<a class="link-card codelab" href="/code-lab/prisma-orm${REF}#module-2370" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 2370 — Connection Pooling, Serverless and Edge</span><span class="lc-sub">10 exercises on pool sizing and client lifetime.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Vì sao cần cơ sở dữ liệu, và một kết nối thật sự tốn gì</h2>
<p class="lead">Notes API của chương 5 chạy được. Nó cũng mất sạch mọi ghi chú ngay khi tiến trình dừng — tức là mỗi lần deploy, mỗi lần sập, mỗi lần bạn bấm <code>Ctrl+C</code>. Chương này thay cái <code>Map</code> đó bằng PostgreSQL, và bắt đầu từ chỗ hầu hết bài hướng dẫn bỏ qua: <strong>kết nối</strong> — vì gần như mọi sự cố "database chậm" trên production thật ra là sự cố kết nối.</p>

<h3>Trước hết, nhìn thẳng vào lỗi cần sửa</h3>
<p>Chương 5 giữ ghi chú trong <code>new Map()</code>. Đây là cái kho đó gặp một lần khởi động lại bình thường — không có gì bất thường, đúng thứ xảy ra ở mỗi lần deploy:</p>
<pre><code><span class="tok-comment"># với service lưu trong RAM</span>
curl -X POST /api/v1/notes -d '{"title":"Learning Prisma"}'   <span class="tok-comment"># 201, id 1</span>
kill %1 &amp;&amp; node src/index.mjs                                 <span class="tok-comment"># khởi động lại, y như deploy</span>
curl /api/v1/notes</code></pre>
<div class="out">{"items":[],"page":1,"limit":10,"total":0}</div>
<p>Giờ là cùng chuỗi lệnh đó sau khi đổi ruột ở chương này, chép nguyên từ lần chạy server thật ở cuối bài 7.3:</p>
<div class="out">{"items":[{"id":1,"title":"Learning Prisma","slug":"note-1785169979420",
  "body":"đã sửa","pinned":false,"authorId":1,
  "createdAt":"2026-07-27T16:32:59.481Z","updatedAt":"2026-07-27T16:32:59.614Z",
  "version":1}],"page":1,"limit":10,"total":1}</div>
<div class="callout ok">Cùng một request, cùng một file route, cùng mã trạng thái — ghi chú đơn giản là vẫn còn đó. Đó là toàn bộ khác biệt mà người dùng thấy được, và nó đáng giá cả một chương.</div>

<h3>Bạn thật sự mua được gì khi dùng CSDL quan hệ</h3>
<p>Bền vững chỉ là cái tít. Danh sách dưới đây mới là thứ phân biệt một cơ sở dữ liệu với "một file JSON bạn tự ghi", và mỗi mục đều quay lại trong khoá học này:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Bền vững</span><span class="v">Lệnh ghi đã commit thì sống sót qua cả sự cố sập máy — CSDL đã ghi xuống đĩa (nhật ký WAL) trước khi trả lời bạn.</span></div>
  <div class="kv"><span class="k">Một sự thật dùng chung</span><span class="v">Hai tiến trình Node (chương 17 chạy nhiều container) nhìn thấy cùng một dữ liệu. Hai cái <code>Map</code> thì không bao giờ.</span></div>
  <div class="kv"><span class="k">Ràng buộc</span><span class="v">"email là duy nhất", "ghi chú phải thuộc về một người dùng có thật" — do CSDL cưỡng chế, nên một con bug trong code của bạn không thể làm hỏng dữ liệu.</span></div>
  <div class="kv"><span class="k">Giao dịch (transaction)</span><span class="v">Nhiều lệnh ghi hoặc là xảy ra hết, hoặc là không cái nào xảy ra (bài 7.3). Tự viết tay thì không thể đúng được.</span></div>
  <div class="kv"><span class="k">Bộ máy truy vấn</span><span class="v">Lọc, sắp xếp, gom nhóm và nối hàng triệu dòng bằng chỉ mục (bài 7.5) thay vì một vòng <code>for</code> JavaScript quét sạch mọi thứ.</span></div>
  <div class="kv"><span class="k">Kiểm soát tương tranh</span><span class="v">Hai người sửa cùng một ghi chú trong cùng một khoảnh khắc sẽ có một kết cục xác định, không phải tung đồng xu (bài 7.6).</span></div>
</div>

<h3>Hình dáng của cả tầng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">code route / service của bạn</span><span class="lz-lnote">prisma.note.findMany({ where: … })</span></div>
  <div class="lz-layer"><span class="lz-lname">Prisma Client</span><span class="lz-lnote">biến object đó thành SQL và biến dòng dữ liệu về thành giá trị JS</span></div>
  <div class="lz-layer"><span class="lz-lname">driver adapter (pg)</span><span class="lz-lnote">giữ các socket TCP — đây chính là pool</span></div>
  <div class="lz-layer"><span class="lz-lname">PostgreSQL</span><span class="lz-lnote">một tiến trình hệ điều hành cho mỗi kết nối, lập kế hoạch và chạy truy vấn</span></div>
</div>
<p>Hãy đọc tầng dưới cùng hai lần. PostgreSQL sinh ra <strong>một tiến trình của hệ điều hành cho MỖI kết nối đang mở</strong>. Riêng chi tiết thiết kế đó giải thích mọi thứ còn lại trong bài: vì sao kết nối đắt, vì sao phải dùng lại, và vì sao "cứ tăng pool lên" là cách người ta làm sập cơ sở dữ liệu.</p>

<h3>Phép đo 1 — một kết nối mới tốn bao nhiêu</h3>
<p>Năm mươi truy vấn <code>SELECT 1</code> tầm thường, chạy theo hai cách trên cùng một PostgreSQL 15.4 local:</p>
<pre><code><span class="tok-comment">// A: mở kết nối mới toanh cho mỗi truy vấn</span>
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; <span class="tok-number">50</span>; i++) {
  <span class="tok-keyword">const</span> c = <span class="tok-keyword">new</span> pg.<span class="tok-fn">Client</span>({ connectionString });
  <span class="tok-keyword">await</span> c.<span class="tok-fn">connect</span>();
  <span class="tok-keyword">await</span> c.<span class="tok-fn">query</span>(<span class="tok-string">'SELECT 1'</span>);
  <span class="tok-keyword">await</span> c.<span class="tok-fn">end</span>();
}

<span class="tok-comment">// B: một kết nối, dùng đi dùng lại</span>
<span class="tok-keyword">const</span> c = <span class="tok-keyword">new</span> pg.<span class="tok-fn">Client</span>({ connectionString });
<span class="tok-keyword">await</span> c.<span class="tok-fn">connect</span>();
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; <span class="tok-number">50</span>; i++) <span class="tok-keyword">await</span> c.<span class="tok-fn">query</span>(<span class="tok-string">'SELECT 1'</span>);</code></pre>
<div class="out">A: 50 truy vấn, mỗi lần mở kết nối mới : 402ms  (8.03ms/truy vấn)
B: 50 truy vấn, dùng lại 1 kết nối     :  19ms  (0.38ms/truy vấn)
B nhanh hơn A 21.2 lần</div>
<p>Bản thân truy vấn không tốn 8ms — nó là khoảng 0,38ms công việc thật được bọc trong 7,6ms bắt tay: kết nối TCP, xác thực, PostgreSQL sinh tiến trình backend, dựng phiên làm việc, rồi phá bỏ tất cả. Trên mạng thật (cơ sở dữ liệu hiếm khi nằm cùng máy với API) phần chi phí này còn phình ra, vì bắt tay là nhiều lượt đi–về chứ không phải một.</p>
<div class="callout">Đây là toàn bộ lý lẽ cho connection pool, gói trong một con số. Pool giữ sẵn N kết nối mở và phát ra khi cần; truy vấn của bạn trả 0,38ms chứ không phải 8,03ms.</div>

<h3>Phép đo 2 — nhìn pool từ bên ngoài</h3>
<p>Hai mươi truy vấn mỗi cái mất đúng 100ms (<code>SELECT 1 FROM pg_sleep(0.1)</code>), bắn cùng lúc bằng <code>Promise.all</code>, với các cỡ pool khác nhau. Cột thứ hai là số backend PostgreSQL thật sự đang mở, đọc từ <code>pg_stat_activity</code>:</p>
<div class="out">pool max = 1             20 truy vấn × 100ms -> 2160ms   | backend đang mở: 1
pool max = 5             20 truy vấn × 100ms ->  437ms   | backend đang mở: 5
pool max = 10 (mặc định) 20 truy vấn × 100ms ->  237ms   | backend đang mở: 10
pool max = 20            20 truy vấn × 100ms ->  132ms   | backend đang mở: 20</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">20 request ập tới</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">pool có 10 chỗ</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">10 cái chạy, 10 cái xếp hàng</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">có chỗ trống → cái kế tiếp chạy</span></div>
</div>
<p>Không có gì huyền bí: với một chỗ thì 20 truy vấn phải xếp hàng (20 × 100ms ≈ 2,1 giây), với 20 chỗ thì chúng chạy cùng nhau (≈ 130ms). Nhưng hãy để ý hình dạng — đi từ 1 lên 5 tiết kiệm được 1,7 giây, đi từ 10 lên 20 chỉ tiết kiệm 105ms. Cỡ pool có lợi ích giảm dần rất nhanh, và điều đó quan trọng vì cái giá của pool lớn thì rất thật.</p>

<h3>Phép đo 3 — vì sao to hơn không có nghĩa là tốt hơn</h3>
<p><code>max_connections</code> mặc định của PostgreSQL là 100. Đây là chuyện xảy ra khi một client xin cái thứ 101, mở lần lượt cho tới khi gãy:</p>
<div class="out">mở được 100 kết nối rồi gãy:
  sorry, too many clients already
  code = 53300</div>
<p>Còn đây là phiên bản thật sự xảy ra trên production. API của bạn chạy 3 container, mỗi container lỡ tạo 4 Prisma client (mỗi module quên dùng chung một cái), mỗi client mở pool 10:</p>
<div class="out">LỖI:
Invalid \`prisma.$queryRaw()\` invocation:
Raw query failed. Code: \`53300\`. Message: \`sorry, too many clients already\`
nguyên nhân: 12 PrismaClient × pool 10 = 120 kết nối &gt; max_connections 100</div>
<div class="pitfall"><strong>Phép tính không ai làm cho tới 2 giờ sáng.</strong> Tổng kết nối = (số tiến trình) × (cỡ pool mỗi tiến trình) — cộng thêm job chạy migration, cộng phiên psql bạn quên đóng, cộng mọi worker chạy nền (chương 13). Con số đó phải nằm dưới <code>max_connections</code> và còn dư, vì PostgreSQL để dành vài chỗ cho superuser và từ chối <em>tất cả</em> khi đã đầy: một cơ sở dữ liệu đầy kết nối sẽ từ chối cả health check của bạn, nên cả dịch vụ trông như đã chết.</div>
<div class="callout warn">Cách chọn thực dụng: bắt đầu với pool <strong>5–10 cho mỗi tiến trình</strong> rồi đếm số tiến trình. Một container API 4 nhân phục vụ CRUD bình thường sẽ cạn CPU trước khi cạn 10 kết nối CSDL. Nếu bạn thật sự cần hàng trăm client, câu trả lời là đặt một bộ gom kết nối (PgBouncer) trước PostgreSQL, chứ không phải pool to hơn trong Node.</div>

<h3>Mỗi tiến trình một client — quy tắc và lý do</h3>
<p>Mỗi lần <code>new PrismaClient()</code> là tạo thêm một pool riêng. Tạo nó trong một hàm xử lý request nghĩa là bạn tạo một pool cho mỗi request; tiến trình sẽ đổ trong vài phút. Chỉ có đúng một hình dạng đúng:</p>
<pre><code><span class="tok-comment">// src/db.mjs — tạo một lần, import khắp nơi</span>
<span class="tok-keyword">import</span> <span class="tok-string">'dotenv/config'</span>;
<span class="tok-keyword">import</span> { PrismaPg } <span class="tok-keyword">from</span> <span class="tok-string">'@prisma/adapter-pg'</span>;
<span class="tok-keyword">import</span> { PrismaClient } <span class="tok-keyword">from</span> <span class="tok-string">'../generated/prisma/client.ts'</span>;

<span class="tok-keyword">const</span> adapter = <span class="tok-keyword">new</span> <span class="tok-fn">PrismaPg</span>({ connectionString: process.env.DATABASE_URL });
<span class="tok-keyword">export const</span> prisma = <span class="tok-keyword">new</span> <span class="tok-fn">PrismaClient</span>({ adapter });</code></pre>
<p>ES module làm việc này dễ: thân module chỉ chạy một lần cho mỗi tiến trình dù có bao nhiêu file import nó, nên <code>import { prisma } from './db.mjs'</code> ở hai mươi file vẫn chỉ là một client và một pool.</p>

<h3>Request đầu tiên bao giờ cũng là request chậm</h3>
<p>Prisma kết nối kiểu lười — pool mở ở truy vấn đầu tiên, không phải lúc import. Đây là log server từ lần chạy thật ở bài 7.3, không chỉnh sửa:</p>
<div class="out">POST /api/v1/notes 201 91.7ms
POST /api/v1/notes 201 3.9ms
GET  /api/v1/notes?page=1&amp;limit=10 200 21.9ms
GET  /api/v1/notes?q=prisma 200 12.9ms
PATCH /api/v1/notes/1 200 7.2ms
DELETE /api/v1/notes/2 204 6.7ms</div>
<p>91,7ms rồi 3,9ms — chênh 24 lần cho cùng một khối lượng công việc. Request đầu tiên đã trả tiền cho màn bắt tay kết nối. Trên production đây chính là request tới một giây sau khi deploy, và đó là lý do một health check có chạm vào cơ sở dữ liệu là đáng có: nó làm nóng pool trước khi người dùng thật đến.</p>
<pre><code><span class="tok-comment">// làm nóng pool lúc khởi động thay vì bắt request của người dùng gánh</span>
<span class="tok-keyword">await</span> prisma.$<span class="tok-fn">connect</span>();
<span class="tok-keyword">const</span> server = <span class="tok-fn">createApp</span>().<span class="tok-fn">listen</span>(PORT);</code></pre>

<h3>Cài đặt, đúng như đã chạy</h3>
<pre><code>npm i prisma @prisma/client @prisma/adapter-pg
npm i -D dotenv
npx prisma init --datasource-provider postgresql</code></pre>
<div class="out">prisma/
  schema.prisma
prisma.config.ts
.env
.gitignore</div>
<p><code>prisma.config.ts</code> là nơi Prisma 7 đọc cấu hình, và nó là code thuần — vì vậy file <code>.env</code> phải được nạp một cách tường minh:</p>
<pre><code><span class="tok-keyword">import</span> <span class="tok-string">"dotenv/config"</span>;
<span class="tok-keyword">import</span> { defineConfig } <span class="tok-keyword">from</span> <span class="tok-string">"prisma/config"</span>;

<span class="tok-keyword">export default</span> <span class="tok-fn">defineConfig</span>({
  schema: <span class="tok-string">"prisma/schema.prisma"</span>,
  migrations: { path: <span class="tok-string">"prisma/migrations"</span> },
  datasource: {
    url: process.env[<span class="tok-string">"DATABASE_URL"</span>],
    shadowDatabaseUrl: process.env[<span class="tok-string">"SHADOW_DATABASE_URL"</span>],   <span class="tok-comment">// bài 7.2</span>
  },
});</code></pre>
<div class="pitfall"><strong>Prisma 7 đổi ba thứ mà mọi bài hướng dẫn cũ đều nói sai.</strong> (1) Generator bây giờ là <code>prisma-client</code> sinh code vào <code>generated/prisma</code>, không phải <code>prisma-client-js</code> sinh vào <code>node_modules</code> — nên bạn import từ thư mục của chính mình. (2) <strong>Bắt buộc phải có driver adapter</strong>: thiếu <code>new PrismaClient({ adapter })</code> thì client ném lỗi ngay lúc khởi tạo, kèm hướng dẫn cài <code>@prisma/adapter-pg</code>. (3) <code>.env</code> <strong>không</strong> còn tự nạp; phải <code>import "dotenv/config"</code> nếu không biến môi trường sẽ là undefined trong im lặng. Bài blog nào từ 2024 không có cả ba điều này thì nó đang mô tả Prisma 5.</div>
<div class="callout danger">Đừng bao giờ đặt <code>DATABASE_URL</code> thật vào file được commit. <code>prisma init</code> đã tự thêm <code>.env</code> vào <code>.gitignore</code> — hãy giữ nguyên như thế, và để một bản đã che giá trị trong <code>.env.example</code> để đồng đội biết có những biến nào. Chương 9 nói tử tế về quản lý bí mật.</div>

<div class="note-ct">
  <strong>cuongthai.com làm thế nào.</strong> Đúng một file — <code>src/config/database.ts</code> — dựng một <code>PrismaClient</code> duy nhất lúc tiến trình khởi động rồi export ra; mọi service đều import cái đó. Ghi chú ở đầu file nói thẳng vì sao nó không phải singleton kiểu hot-reload: production không có hot reload, và một biến global được cache từng làm cho thay đổi biến môi trường trở nên vô hình sau khi deploy. Mức log chọn theo <code>NODE_ENV</code> (đo thời gian truy vấn khi dev, chỉ lỗi khi production), và bộ xử lý tắt máy ở bài 5.5 gọi <code>prisma.$disconnect()</code> để pool đóng sạch thay vì bỏ mặc các backend PostgreSQL chờ hết giờ.
</div>

<a class="link-card codelab" href="/code-lab/prisma-orm${REF}#module-2370" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 2370 — Connection Pooling, Serverless and Edge</span><span class="lc-sub">10 bài tập về chọn cỡ pool và vòng đời client.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — The schema, and migrations that survive production|||7.2 — Lược đồ, và migration sống sót được trên production',
      slug: 'nodejs-7-2-luoc-do-va-migration',
      type: 'VIDEO',
      description: 'Viết lược đồ Prisma, đọc file SQL nó sinh ra, phân biệt migrate dev với migrate deploy, và diễn tập một migration hỏng giữa chừng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>The schema, and migrations that survive production</h2>
<p class="lead">A migration is the only piece of your code that runs <em>once</em>, against data you cannot recreate, usually while users are online. Everything else can be redeployed. This lesson writes the Notes schema, then deliberately breaks a migration on a table with data in it, so the failure you meet at work is the second time you see it, not the first.</p>

<h3>The schema is a description, not a script</h3>
<pre><code><span class="tok-keyword">model</span> User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String   @db.VarChar(80)
  createdAt DateTime @default(now())

  notes Note[]
}

<span class="tok-keyword">model</span> Note {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(200)
  slug      String   @unique
  body      String
  pinned    Boolean  @default(false)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  version   Int      @default(1)

  author User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags   NoteTag[]
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>@id @default(autoincrement())</code></span><span class="v">Primary key backed by a PostgreSQL <code>SERIAL</code> sequence.</span></div>
  <div class="kv"><span class="k"><code>@unique</code></span><span class="v">A real unique index in the database — the constraint that produces the <code>P2002</code> error in lesson 7.6.</span></div>
  <div class="kv"><span class="k"><code>@db.VarChar(200)</code></span><span class="v">Without it, <code>String</code> becomes <code>TEXT</code>. Length limits belong in your validation layer (lesson 6.3) <em>and</em> here.</span></div>
  <div class="kv"><span class="k"><code>@updatedAt</code></span><span class="v">Prisma writes the current time on every update — this one is client-side, not a database trigger.</span></div>
  <div class="kv"><span class="k"><code>@relation(… onDelete: Cascade)</code></span><span class="v">Deleting a user deletes their notes, enforced by a foreign key in PostgreSQL.</span></div>
  <div class="kv"><span class="k"><code>Note[]</code> on User</span><span class="v">The back-relation. It creates no column — it is how you write <code>include: { notes: true }</code>.</span></div>
</div>
<div class="pitfall">Forget the back-relation and <code>prisma generate</code> stops with <em>"The relation field <code>author</code> on model <code>Note</code> is missing an opposite relation field on model <code>User</code>"</em>. Every relation is two fields. When two models are related twice (say <code>author</code> and <code>lastEditor</code>, both pointing at <code>User</code>), each pair needs its own name: <code>@relation("NoteAuthor")</code> and <code>@relation("NoteEditor")</code>, or Prisma cannot tell which back-relation belongs to which.</div>

<h3>What <code>migrate dev</code> actually does</h3>
<pre><code>npx prisma migrate dev --name init</code></pre>
<div class="out">Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "notesdemo", schema "public" at "localhost:5433"

Applying migration \`20260727162756_init\`

The following migration(s) have been created and applied from new schema changes:

prisma/migrations/
  └─ 20260727162756_init/
    └─ migration.sql

Your database is now in sync with your schema.</div>
<p>The generated <code>migration.sql</code> is ordinary SQL you can read, review and put in a pull request:</p>
<pre><code><span class="tok-comment">-- CreateTable</span>
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

<span class="tok-comment">-- CreateIndex</span>
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

<span class="tok-comment">-- AddForeignKey</span>
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;</code></pre>
<div class="callout ok">This file is the deliverable. Read it in code review the way you read any other change — an <code>ALTER TABLE … NOT NULL</code> on a big table is a lock; a <code>DROP COLUMN</code> is data you will never get back. The schema file describes intent; the SQL file describes what will happen to production.</div>

<h3>Where the history lives</h3>
<p>Prisma keeps a table in your database listing what has been applied. Nothing else — no magic:</p>
<div class="out">      migration_name            |          finished_at          | applied_steps_count
--------------------------------+-------------------------------+---------------------
 20260727162756_init            | 2026-07-27 16:27:56.850153+00 |                   1
 20260727163003_add_tags_...    | 2026-07-27 16:30:03.940225+00 |                   1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">edit schema.prisma</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">migrate dev → SQL file</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">commit the SQL file</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">migrate deploy on production</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>migrate dev</code></span><span class="v"><strong>Development only.</strong> Compares, writes a new SQL file, applies it, regenerates the client — and offers to reset the database when it cannot reconcile.</span></div>
  <div class="kv"><span class="k"><code>migrate deploy</code></span><span class="v"><strong>Production.</strong> Applies pending files in order. Never creates a file, never resets, never asks a question. This is what runs in CI.</span></div>
  <div class="kv"><span class="k"><code>migrate status</code></span><span class="v">Reads the history table and reports what is pending or failed.</span></div>
  <div class="kv"><span class="k"><code>migrate resolve</code></span><span class="v">Marks a failed migration as rolled-back or applied. A human decision — see the end of this lesson.</span></div>
  <div class="kv"><span class="k"><code>db push</code></span><span class="v">Pushes the schema with no migration file. Fine for a throwaway prototype, <strong>never</strong> for a database whose history you need.</span></div>
  <div class="kv"><span class="k"><code>migrate reset</code></span><span class="v">Drops everything and replays. On production this is the command that ends careers.</span></div>
</div>
<div class="pitfall">The migration timestamp is <strong>UTC</strong>. The <code>init</code> migration above is named <code>20260727162756</code> — created at 23:27 Vietnam time. When you are comparing a migration name against a log line, check which clock each one uses before concluding that something ran seven hours late.</div>

<h3>A second migration, and what changed</h3>
<p>Adding tags and a <code>version</code> column produces exactly the SQL you would have written by hand:</p>
<pre><code>npx prisma migrate dev --name add_tags_and_version</code></pre>
<pre><code><span class="tok-comment">-- AlterTable</span>
ALTER TABLE "Note" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

<span class="tok-comment">-- CreateTable</span>
CREATE TABLE "NoteTag" (
    "noteId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("noteId","tagId")
);</code></pre>
<p>Note the join table: a many-to-many relation is a table with two foreign keys and a compound primary key. Prisma can hide it (<code>tags Tag[]</code> on both sides, implicit table) but writing it explicitly as <code>NoteTag</code> lets you add columns later — who attached the tag, when — and you will want that.</p>
<div class="callout">Adding <code>NOT NULL DEFAULT 1</code> is safe because every existing row can take the default. Adding <code>NOT NULL</code> <em>without</em> a default to a table that has rows is the single most common way a migration fails on production. That is the next experiment.</div>

<h3>Drift: when the database and the history disagree</h3>
<p>Somebody fixes production at 2am with <code>psql</code>. One column, no migration file. Now the database contains something the migration history has never heard of. First surprise — <code>migrate status</code> does <strong>not</strong> notice:</p>
<pre><code>psql&gt; ALTER TABLE "Note" ADD COLUMN "hotfix_col" text;
npx prisma migrate status</code></pre>
<div class="out">2 migrations found in prisma/migrations

Database schema is up to date!</div>
<p><code>migrate status</code> only reads the history table; it never compares real columns. The command that actually compares is <code>migrate diff</code>:</p>
<pre><code>npx prisma migrate diff \\
  --from-migrations ./prisma/migrations \\
  --to-config-datasource \\
  --script</code></pre>
<div class="out">-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "hotfix_col" TEXT;</div>
<p>That output reads: "to get from what the migrations describe to what the database really is, you would have to run this." Now run <code>migrate dev</code> in that state and watch it refuse to guess:</p>
<div class="out">Drift detected: Your database schema is not in sync with your migration history.

[*] Changed the \`Note\` table
  [+] Added column \`hotfix_col\`

We need to reset the "public" schema at "localhost:5433"
You may use prisma migrate reset to drop the development database.
All data will be lost.</div>
<div class="callout danger">On your laptop, resetting is fine. On production it is a data-loss event, and <code>migrate dev</code> is exactly the command that offers it — which is why production runs <code>migrate deploy</code> and nothing else. If you see a reset prompt against a real database, stop and read the drift summary: it is telling you someone changed the database outside of migrations.</div>
<p>To resolve drift honestly: take the <code>migrate diff</code> output, put it into a real migration file, mark it applied, and the history matches reality again.</p>

<h3>The failure rehearsal: a migration that dies halfway</h3>
<p>The table has rows. The migration adds a required column with no default:</p>
<pre><code><span class="tok-comment">-- prisma/migrations/20260727170000_add_slug/migration.sql</span>
ALTER TABLE "Note" ADD COLUMN "slug" TEXT NOT NULL;
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");</code></pre>
<pre><code>npx prisma migrate deploy</code></pre>
<div class="out">Applying migration \`20260727170000_add_slug\`
Error: P3018

A migration failed to apply. New migrations cannot be applied before the error is recovered from.
Migration name: 20260727170000_add_slug

Database error code: 23502
Database error:
ERROR: column "slug" of relation "Note" contains null values</div>
<p>Run it again — a deploy retry, a second CI run, a colleague pushing — and the error changes into the one that blocks everything:</p>
<div class="out">Error: P3009

migrate found failed migrations in the target database, new migrations will not be applied.
The \`20260727170000_add_slug\` migration started at 2026-07-27 16:31:07.258768 UTC failed</div>
<div class="callout warn"><strong>P3018 is the first failure. P3009 is every attempt after it.</strong> From this moment, no migration can deploy — including the innocent one your teammate wrote. A stuck migration is an outage of your ability to ship.</div>
<p>Before touching anything, ask the only question that matters: <em>how much of it applied?</em> Check the database and the history table:</p>
<div class="out">column_name          |  migration_name          | finished_at | applied_steps_count
---------------------+--------------------------+-------------+--------------------
 id, title, body,    | 20260727162756_init      | 16:27:56    |          1
 pinned, authorId,   | 20260727163003_add_tags  | 16:30:03    |          1
 createdAt, updatedAt| 20260727170000_add_slug  | (empty)     |          0
 version             |
 (no "slug")</div>
<p>No <code>slug</code> column, <code>applied_steps_count = 0</code>, no <code>finished_at</code>: PostgreSQL runs DDL inside a transaction, so this migration rolled itself back completely. That is the good case — and it is why you check instead of assuming.</p>

<h3>Recovering, in the order that is safe</h3>
<pre><code><span class="tok-comment"># 1. tell Prisma the failed migration left nothing behind</span>
npx prisma migrate resolve --rolled-back "20260727170000_add_slug"</code></pre>
<div class="out">Migration 20260727170000_add_slug marked as rolled back.</div>
<pre><code><span class="tok-comment">-- 2. rewrite it in three steps that any table can survive</span>
ALTER TABLE "Note" ADD COLUMN "slug" TEXT;                       <span class="tok-comment">-- nullable first</span>
UPDATE "Note" SET "slug" = 'note-' || "id" WHERE "slug" IS NULL;  <span class="tok-comment">-- backfill</span>
ALTER TABLE "Note" ALTER COLUMN "slug" SET NOT NULL;              <span class="tok-comment">-- then tighten</span>
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");</code></pre>
<pre><code>npx prisma migrate deploy</code></pre>
<div class="out">The following migration(s) have been applied:
migrations/
  └─ 20260727170000_add_slug/
    └─ migration.sql
All migrations have been successfully applied.

 id |    title     |  slug
----+--------------+--------
  1 | Bài đầu tiên | note-1</div>
<p>The history now holds both attempts, which is exactly right — an audit trail, not a cover-up:</p>
<div class="out">      migration_name            | applied_steps_count | rolled_back
--------------------------------+---------------------+-------------
 20260727170000_add_slug        |                   0 | t
 20260727170000_add_slug        |                   1 | f</div>
<div class="pitfall"><strong>Never reach for <code>--applied</code> to make the red go away.</strong> <code>resolve --applied</code> tells Prisma "this ran successfully" — if it did not, every future migration is computed from a false starting point, and the corruption compounds silently. Use <code>--rolled-back</code> when the database really is untouched (check first, as above); use <code>--applied</code> only when you manually finished the work by hand and verified it.</div>
<div class="callout ok"><strong>The three-step pattern generalises.</strong> Add nullable → backfill → tighten. The same shape covers renaming a column (add new, copy, deploy code that writes both, drop old) and changing a type. Each step is safe on its own and safe to stop after, which is what makes it deployable while users are online.</div>

<div class="note-ct">
  <strong>How cuongthai.com does it.</strong> The project's own rules file forbids <code>migrate reset</code> and <code>db push</code> against production outright, and forbids auto-running <code>migrate resolve</code> after a failure — because this exact sequence happened here: a migration hit "table already exists", then P3009 blocked every subsequent deploy. The written protocol is: stop, report the exact error and migration name, check how much applied, propose a fix, wait for a human. Deployed migration files are also never edited — a mistake in one is corrected by a new migration, because the old file's checksum is already recorded in the database of every environment that ran it.
</div>

<a class="link-card codelab" href="/code-lab/prisma-orm${REF}#module-436" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 436 — Migrations and Schema Changes</span><span class="lc-sub">10 exercises on evolving a schema without losing data.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Lược đồ, và migration sống sót được trên production</h2>
<p class="lead">Migration là đoạn code duy nhất của bạn chạy <em>một lần</em>, trên dữ liệu không tạo lại được, thường là lúc người dùng đang online. Mọi thứ khác đều deploy lại được. Bài này viết lược đồ cho Notes, rồi cố tình làm hỏng một migration trên bảng đã có dữ liệu, để lần bạn gặp sự cố ở chỗ làm là lần thứ hai chứ không phải lần đầu.</p>

<h3>Lược đồ là một bản mô tả, không phải một kịch bản</h3>
<pre><code><span class="tok-keyword">model</span> User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String   @db.VarChar(80)
  createdAt DateTime @default(now())

  notes Note[]
}

<span class="tok-keyword">model</span> Note {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(200)
  slug      String   @unique
  body      String
  pinned    Boolean  @default(false)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  version   Int      @default(1)

  author User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags   NoteTag[]
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>@id @default(autoincrement())</code></span><span class="v">Khoá chính dựa trên một sequence <code>SERIAL</code> của PostgreSQL.</span></div>
  <div class="kv"><span class="k"><code>@unique</code></span><span class="v">Một chỉ mục duy nhất thật trong CSDL — chính ràng buộc sinh ra lỗi <code>P2002</code> ở bài 7.6.</span></div>
  <div class="kv"><span class="k"><code>@db.VarChar(200)</code></span><span class="v">Không có nó thì <code>String</code> thành <code>TEXT</code>. Giới hạn độ dài nên nằm ở tầng kiểm tra dữ liệu (bài 6.3) <em>và</em> ở đây.</span></div>
  <div class="kv"><span class="k"><code>@updatedAt</code></span><span class="v">Prisma ghi thời điểm hiện tại mỗi lần cập nhật — cái này chạy ở phía client, không phải trigger của CSDL.</span></div>
  <div class="kv"><span class="k"><code>@relation(… onDelete: Cascade)</code></span><span class="v">Xoá một người dùng thì xoá luôn ghi chú của họ, do khoá ngoại trong PostgreSQL cưỡng chế.</span></div>
  <div class="kv"><span class="k"><code>Note[]</code> ở User</span><span class="v">Quan hệ ngược. Nó không tạo cột nào — nó là thứ cho phép bạn viết <code>include: { notes: true }</code>.</span></div>
</div>
<div class="pitfall">Quên quan hệ ngược thì <code>prisma generate</code> dừng lại với <em>"The relation field <code>author</code> on model <code>Note</code> is missing an opposite relation field on model <code>User</code>"</em>. Mọi quan hệ đều là hai trường. Khi hai model có quan hệ với nhau hai lần (ví dụ <code>author</code> và <code>lastEditor</code> cùng trỏ tới <code>User</code>), mỗi cặp phải có tên riêng: <code>@relation("NoteAuthor")</code> và <code>@relation("NoteEditor")</code>, nếu không Prisma không biết quan hệ ngược nào thuộc về cái nào.</div>

<h3><code>migrate dev</code> thật ra làm gì</h3>
<pre><code>npx prisma migrate dev --name init</code></pre>
<div class="out">Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "notesdemo", schema "public" at "localhost:5433"

Applying migration \`20260727162756_init\`

The following migration(s) have been created and applied from new schema changes:

prisma/migrations/
  └─ 20260727162756_init/
    └─ migration.sql

Your database is now in sync with your schema.</div>
<p>File <code>migration.sql</code> sinh ra là SQL bình thường, bạn đọc được, review được, và đưa vào pull request được:</p>
<pre><code><span class="tok-comment">-- CreateTable</span>
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

<span class="tok-comment">-- CreateIndex</span>
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

<span class="tok-comment">-- AddForeignKey</span>
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;</code></pre>
<div class="callout ok">File này mới là sản phẩm bàn giao. Hãy đọc nó trong code review y như mọi thay đổi khác — một câu <code>ALTER TABLE … NOT NULL</code> trên bảng lớn là một cái khoá; một câu <code>DROP COLUMN</code> là dữ liệu bạn sẽ không lấy lại được. File lược đồ mô tả ý định; file SQL mô tả điều sẽ xảy ra với production.</div>

<h3>Lịch sử nằm ở đâu</h3>
<p>Prisma giữ một bảng ngay trong cơ sở dữ liệu của bạn, liệt kê những gì đã áp. Không có gì khác — không phép màu nào:</p>
<div class="out">      migration_name            |          finished_at          | applied_steps_count
--------------------------------+-------------------------------+---------------------
 20260727162756_init            | 2026-07-27 16:27:56.850153+00 |                   1
 20260727163003_add_tags_...    | 2026-07-27 16:30:03.940225+00 |                   1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">sửa schema.prisma</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">migrate dev → file SQL</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">commit file SQL</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">migrate deploy trên production</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>migrate dev</code></span><span class="v"><strong>Chỉ dùng khi dev.</strong> So sánh, ghi file SQL mới, áp nó, sinh lại client — và đề nghị xoá sạch cơ sở dữ liệu khi nó không dung hoà được.</span></div>
  <div class="kv"><span class="k"><code>migrate deploy</code></span><span class="v"><strong>Production.</strong> Áp các file còn tồn theo thứ tự. Không bao giờ tạo file, không bao giờ reset, không bao giờ hỏi. Đây là lệnh chạy trong CI.</span></div>
  <div class="kv"><span class="k"><code>migrate status</code></span><span class="v">Đọc bảng lịch sử và báo cái nào đang chờ hoặc đã lỗi.</span></div>
  <div class="kv"><span class="k"><code>migrate resolve</code></span><span class="v">Đánh dấu một migration lỗi là đã cuộn ngược hoặc đã áp. Đây là quyết định của con người — xem cuối bài.</span></div>
  <div class="kv"><span class="k"><code>db push</code></span><span class="v">Đẩy lược đồ mà không sinh file migration. Ổn cho bản nháp vứt đi, <strong>tuyệt đối không</strong> cho cơ sở dữ liệu mà bạn cần lịch sử.</span></div>
  <div class="kv"><span class="k"><code>migrate reset</code></span><span class="v">Xoá sạch rồi chạy lại từ đầu. Trên production, đây là lệnh kết thúc sự nghiệp.</span></div>
</div>
<div class="pitfall">Dấu thời gian của migration là <strong>giờ UTC</strong>. Migration <code>init</code> ở trên tên là <code>20260727162756</code> — được tạo lúc 23 giờ 27 giờ Việt Nam. Khi đối chiếu tên migration với một dòng log, hãy kiểm tra mỗi bên dùng đồng hồ nào trước khi kết luận có thứ gì đó chạy trễ bảy tiếng.</div>

<h3>Migration thứ hai, và nó đổi gì</h3>
<p>Thêm thẻ và cột <code>version</code> sinh ra đúng thứ SQL mà bạn sẽ tự viết bằng tay:</p>
<pre><code>npx prisma migrate dev --name add_tags_and_version</code></pre>
<pre><code><span class="tok-comment">-- AlterTable</span>
ALTER TABLE "Note" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

<span class="tok-comment">-- CreateTable</span>
CREATE TABLE "NoteTag" (
    "noteId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("noteId","tagId")
);</code></pre>
<p>Để ý bảng nối: quan hệ nhiều–nhiều là một bảng có hai khoá ngoại và một khoá chính ghép. Prisma có thể giấu nó đi (<code>tags Tag[]</code> ở cả hai phía, bảng ngầm), nhưng viết tường minh thành <code>NoteTag</code> cho phép bạn thêm cột về sau — ai gắn thẻ, gắn lúc nào — và bạn sẽ cần đến điều đó.</p>
<div class="callout">Thêm <code>NOT NULL DEFAULT 1</code> là an toàn vì mọi dòng đang có đều nhận được giá trị mặc định. Thêm <code>NOT NULL</code> mà <em>không</em> có mặc định vào bảng đã có dữ liệu là cách phổ biến nhất khiến migration chết trên production. Đó chính là thí nghiệm tiếp theo.</div>

<h3>Trôi lệch (drift): khi CSDL và lịch sử nói khác nhau</h3>
<p>Ai đó chữa cháy production lúc 2 giờ sáng bằng <code>psql</code>. Một cột, không file migration. Giờ cơ sở dữ liệu chứa một thứ mà lịch sử migration chưa từng nghe nói tới. Bất ngờ đầu tiên — <code>migrate status</code> <strong>không</strong> nhận ra:</p>
<pre><code>psql&gt; ALTER TABLE "Note" ADD COLUMN "hotfix_col" text;
npx prisma migrate status</code></pre>
<div class="out">2 migrations found in prisma/migrations

Database schema is up to date!</div>
<p><code>migrate status</code> chỉ đọc bảng lịch sử; nó không bao giờ so cột thật. Lệnh thật sự so sánh là <code>migrate diff</code>:</p>
<pre><code>npx prisma migrate diff \\
  --from-migrations ./prisma/migrations \\
  --to-config-datasource \\
  --script</code></pre>
<div class="out">-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "hotfix_col" TEXT;</div>
<p>Kết quả đó đọc là: "để đi từ thứ mà các migration mô tả tới thứ mà cơ sở dữ liệu đang thật sự là, bạn sẽ phải chạy câu này". Giờ chạy <code>migrate dev</code> trong trạng thái đó và xem nó từ chối đoán mò:</p>
<div class="out">Drift detected: Your database schema is not in sync with your migration history.

[*] Changed the \`Note\` table
  [+] Added column \`hotfix_col\`

We need to reset the "public" schema at "localhost:5433"
You may use prisma migrate reset to drop the development database.
All data will be lost.</div>
<div class="callout danger">Trên máy bạn, reset thì không sao. Trên production đó là một sự kiện mất dữ liệu, và <code>migrate dev</code> chính là lệnh đề nghị làm điều đó — vì vậy production chỉ chạy <code>migrate deploy</code>, không chạy gì khác. Nếu bạn thấy lời mời reset trên một cơ sở dữ liệu thật, hãy dừng lại và đọc phần tóm tắt drift: nó đang nói cho bạn biết có người đã sửa CSDL bên ngoài migration.</div>
<p>Cách xử lý drift một cách trung thực: lấy kết quả <code>migrate diff</code>, đưa vào một file migration thật, đánh dấu là đã áp, thế là lịch sử khớp lại với hiện thực.</p>

<h3>Diễn tập sự cố: một migration chết giữa đường</h3>
<p>Bảng đã có dữ liệu. Migration thêm một cột bắt buộc mà không có giá trị mặc định:</p>
<pre><code><span class="tok-comment">-- prisma/migrations/20260727170000_add_slug/migration.sql</span>
ALTER TABLE "Note" ADD COLUMN "slug" TEXT NOT NULL;
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");</code></pre>
<pre><code>npx prisma migrate deploy</code></pre>
<div class="out">Applying migration \`20260727170000_add_slug\`
Error: P3018

A migration failed to apply. New migrations cannot be applied before the error is recovered from.
Migration name: 20260727170000_add_slug

Database error code: 23502
Database error:
ERROR: column "slug" of relation "Note" contains null values</div>
<p>Chạy lại lần nữa — thử deploy lại, CI chạy lần hai, hoặc đồng nghiệp vừa push — và lỗi đổi thành cái chặn tất cả:</p>
<div class="out">Error: P3009

migrate found failed migrations in the target database, new migrations will not be applied.
The \`20260727170000_add_slug\` migration started at 2026-07-27 16:31:07.258768 UTC failed</div>
<div class="callout warn"><strong>P3018 là lần hỏng đầu tiên. P3009 là mọi lần sau đó.</strong> Từ giây phút này, không migration nào deploy được — kể cả cái vô can mà đồng đội bạn vừa viết. Một migration kẹt là một sự cố mất khả năng ship hàng.</div>
<p>Trước khi đụng vào bất cứ thứ gì, hãy hỏi câu duy nhất quan trọng: <em>nó đã áp được bao nhiêu?</em> Kiểm tra cả cơ sở dữ liệu lẫn bảng lịch sử:</p>
<div class="out">column_name          |  migration_name          | finished_at | applied_steps_count
---------------------+--------------------------+-------------+--------------------
 id, title, body,    | 20260727162756_init      | 16:27:56    |          1
 pinned, authorId,   | 20260727163003_add_tags  | 16:30:03    |          1
 createdAt, updatedAt| 20260727170000_add_slug  | (trống)     |          0
 version             |
 (KHÔNG có "slug")</div>
<p>Không có cột <code>slug</code>, <code>applied_steps_count = 0</code>, không có <code>finished_at</code>: PostgreSQL chạy lệnh DDL bên trong một transaction, nên migration này đã tự cuộn ngược hoàn toàn. Đó là trường hợp may — và chính vì thế bạn phải kiểm tra thay vì phỏng đoán.</p>

<h3>Khắc phục, theo đúng thứ tự an toàn</h3>
<pre><code><span class="tok-comment"># 1. báo cho Prisma biết migration hỏng không để lại gì</span>
npx prisma migrate resolve --rolled-back "20260727170000_add_slug"</code></pre>
<div class="out">Migration 20260727170000_add_slug marked as rolled back.</div>
<pre><code><span class="tok-comment">-- 2. viết lại thành ba bước mà bảng nào cũng chịu được</span>
ALTER TABLE "Note" ADD COLUMN "slug" TEXT;                       <span class="tok-comment">-- cho phép NULL trước</span>
UPDATE "Note" SET "slug" = 'note-' || "id" WHERE "slug" IS NULL;  <span class="tok-comment">-- điền dữ liệu</span>
ALTER TABLE "Note" ALTER COLUMN "slug" SET NOT NULL;              <span class="tok-comment">-- rồi mới siết</span>
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");</code></pre>
<pre><code>npx prisma migrate deploy</code></pre>
<div class="out">The following migration(s) have been applied:
migrations/
  └─ 20260727170000_add_slug/
    └─ migration.sql
All migrations have been successfully applied.

 id |    title     |  slug
----+--------------+--------
  1 | Bài đầu tiên | note-1</div>
<p>Lịch sử bây giờ giữ cả hai lần thử, và như thế là đúng — đó là dấu vết kiểm toán, không phải sự che đậy:</p>
<div class="out">      migration_name            | applied_steps_count | rolled_back
--------------------------------+---------------------+-------------
 20260727170000_add_slug        |                   0 | t
 20260727170000_add_slug        |                   1 | f</div>
<div class="pitfall"><strong>Đừng bao giờ vớ lấy <code>--applied</code> chỉ để cho hết màu đỏ.</strong> <code>resolve --applied</code> nói với Prisma rằng "cái này đã chạy xong" — nếu sự thật không phải vậy thì mọi migration về sau đều được tính từ một điểm xuất phát sai, và sự hỏng hóc âm thầm nhân lên. Dùng <code>--rolled-back</code> khi cơ sở dữ liệu thật sự chưa bị đụng tới (kiểm tra trước, như ở trên); chỉ dùng <code>--applied</code> khi bạn đã tự tay làm nốt phần việc đó và đã xác minh.</div>
<div class="callout ok"><strong>Mẫu ba bước này dùng được cho mọi trường hợp.</strong> Thêm cột cho phép NULL → điền dữ liệu → siết ràng buộc. Cùng hình dạng đó áp dụng cho việc đổi tên cột (thêm cột mới, chép sang, deploy code ghi cả hai, rồi bỏ cột cũ) và đổi kiểu dữ liệu. Từng bước đều an toàn khi đứng riêng và an toàn khi dừng lại giữa chừng — đó là thứ khiến nó deploy được trong lúc người dùng đang online.</div>

<div class="note-ct">
  <strong>cuongthai.com làm thế nào.</strong> File quy tắc của chính dự án cấm thẳng <code>migrate reset</code> và <code>db push</code> trên production, và cấm tự động chạy <code>migrate resolve</code> sau khi hỏng — bởi vì đúng chuỗi sự kiện này đã xảy ra ở đây: một migration đâm vào lỗi "table already exists", rồi P3009 chặn mọi lần deploy sau đó. Quy trình được ghi thành văn là: dừng lại, báo cáo chính xác thông báo lỗi và tên migration, kiểm tra đã áp được bao nhiêu, đề xuất cách sửa, chờ con người quyết. File migration đã deploy cũng không bao giờ bị sửa — sai sót trong một file được chữa bằng một migration mới, vì checksum của file cũ đã được ghi vào cơ sở dữ liệu của mọi môi trường từng chạy nó.
</div>

<a class="link-card codelab" href="/code-lab/prisma-orm${REF}#module-436" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 436 — Migrations and Schema Changes</span><span class="lc-sub">10 bài tập về việc tiến hoá lược đồ mà không mất dữ liệu.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — CRUD, transactions, and swapping the Notes API onto PostgreSQL|||7.3 — CRUD, transaction, và đổi ruột Notes API sang PostgreSQL',
      slug: 'nodejs-7-3-crud-transaction',
      type: 'VIDEO',
      description: 'Giữ lời hứa của bài 5.5: cùng router, cùng mã trạng thái, ruột đổi từ Map sang PostgreSQL — cộng với chứng minh transaction cuộn ngược thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>CRUD, transactions, and swapping the Notes API onto PostgreSQL</h2>
<p class="lead">Lesson 5.5 made a promise: the layered structure exists so that storage can change without the HTTP layer noticing. This lesson collects on it — and reports the honest cost, down to the line count.</p>

<h3>The five operations</h3>
<pre><code><span class="tok-comment">// create</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">create</span>({ data: { title, body, slug, authorId } });

<span class="tok-comment">// read one — returns null when there is no row</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findUnique</span>({ where: { id } });

<span class="tok-comment">// read many, with filter, order and window</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findMany</span>({
  where: { authorId, title: { contains: q, mode: <span class="tok-string">'insensitive'</span> } },
  orderBy: { id: <span class="tok-string">'asc'</span> }, skip: <span class="tok-number">0</span>, take: <span class="tok-number">10</span>,
});

<span class="tok-comment">// update — throws P2025 if the row does not exist</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">update</span>({ where: { id }, data: patch });

<span class="tok-comment">// delete — also throws P2025</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">delete</span>({ where: { id } });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>findUnique</code> vs <code>findFirst</code></span><span class="v"><code>findUnique</code> only accepts unique fields and can use the index directly; <code>findFirst</code> takes any filter and adds <code>LIMIT 1</code>.</span></div>
  <div class="kv"><span class="k"><code>update</code> vs <code>updateMany</code></span><span class="v"><code>update</code> targets one row by unique key and throws if missing; <code>updateMany</code> takes any filter and returns <code>{ count }</code> — the basis of the locking trick in lesson 7.6.</span></div>
  <div class="kv"><span class="k"><code>upsert</code></span><span class="v">Insert, or update if the unique key is taken — one round trip, and the database decides.</span></div>
  <div class="kv"><span class="k"><code>createMany</code></span><span class="v">One <code>INSERT</code> with many rows. Seeding 1000 notes with it took <strong>175ms</strong>; a thousand separate <code>create</code> calls cannot come close.</span></div>
  <div class="kv"><span class="k"><code>…OrThrow</code></span><span class="v"><code>findUniqueOrThrow</code> turns "not found" into an exception, which pairs neatly with the centralised error handler from lesson 5.4.</span></div>
</div>

<h3>Missing rows: null or exception, pick deliberately</h3>
<p>The route layer from chapter 5 expects <code>null</code> for "not found" and a boolean from delete. Prisma throws instead, with a code — so the service translates once, and the routes keep the shape they already had:</p>
<pre><code><span class="tok-keyword">export async function</span> <span class="tok-fn">update</span>(id, patch) {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">return await</span> prisma.note.<span class="tok-fn">update</span>({ where: { id }, data: patch });
  } <span class="tok-keyword">catch</span> (err) {
    <span class="tok-keyword">if</span> (err.code === <span class="tok-string">'P2025'</span>) <span class="tok-keyword">return null</span>;   <span class="tok-comment">// no row to update</span>
    <span class="tok-keyword">throw</span> err;                                <span class="tok-comment">// anything else is a real fault</span>
  }
}</code></pre>
<div class="callout">That <code>throw err</code> is not decoration. Swallowing every exception here would turn a dead database into a tidy 404, and you would spend an afternoon looking for the missing note that was never missing. Translate the one error you understand; let the rest reach the error handler.</div>

<h3>The service, rewritten</h3>
<pre><code><span class="tok-comment">// src/services/notes.service.mjs — chapter 7 version</span>
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">'../db.mjs'</span>;

<span class="tok-keyword">const</span> AUTHOR_ID = <span class="tok-number">1</span>;   <span class="tok-comment">// chapter 8 replaces this with the logged-in user</span>

<span class="tok-keyword">export async function</span> <span class="tok-fn">list</span>({ page = <span class="tok-number">1</span>, limit = <span class="tok-number">10</span>, q }) {
  <span class="tok-keyword">const</span> where = {
    authorId: AUTHOR_ID,
    ...(q ? { title: { contains: q, mode: <span class="tok-string">'insensitive'</span> } } : {}),
  };
  <span class="tok-keyword">const</span> [items, total] = <span class="tok-keyword">await</span> prisma.$<span class="tok-fn">transaction</span>([
    prisma.note.<span class="tok-fn">findMany</span>({ where, orderBy: { id: <span class="tok-string">'asc'</span> },
                            skip: (page - <span class="tok-number">1</span>) * limit, take: limit }),
    prisma.note.<span class="tok-fn">count</span>({ where }),
  ]);
  <span class="tok-keyword">return</span> { items, page, limit, total };
}</code></pre>
<p>The rows and the total come from one <code>$transaction([…])</code> — an array of queries sent together and run in one transaction, so the count cannot describe a different instant than the page. Two separate awaits would let a write slip between them and produce <code>total: 41</code> next to 40 visible items forever.</p>

<h3>The honest diff</h3>
<p>Here is the router change, produced by <code>diff</code> on the two real files:</p>
<pre><code>-import * as service from '../services/notes.service.mem.mjs';
+import * as service from '../services/notes.service.pg.mjs';

-router.get('/', (req, res) =&gt; {
-  res.json(service.list({ page, limit, q: req.query.q }));
+router.get('/', async (req, res) =&gt; {
+  res.json(await service.list({ page, limit, q: req.query.q }));

-router.get('/:id', (req, res) =&gt; {
-  const note = service.get(Number(req.params.id));
+router.get('/:id', async (req, res) =&gt; {
+  const note = await service.get(Number(req.params.id));</code></pre>
<div class="out">11 changed lines out of 39 in the router:
  1  import line
  5  handlers gained the keyword \`async\`
  5  service calls gained \`await\`
  0  status codes, paths, validation rules or error branches touched</div>
<div class="callout ok"><strong>The promise, corrected.</strong> Lesson 5.5 said "one file changes". The truth is one file is <em>rewritten</em> (the service) and the router gains two keywords per handler — because a database call is asynchronous and an in-memory <code>Map</code> is not. What did not change is everything that makes it an API: routes, status codes, the <code>Location</code> header, validation, the 404 branch, the error handler. Had the chapter-5 handlers been written <code>async</code> from the start, the router would have been byte-identical.</div>
<div class="pitfall">Express 5 forwards a rejected promise from a handler to your error handler — Express 4 does not (we proved it in lesson 5.1: the request hung forever). Adding <code>await</code> to handlers on Express 4 without <code>try/catch</code> or a wrapper is how a "small change to use a database" turns into requests that never answer.</div>

<h3>Running it — every response captured from the real server</h3>
<pre><code>curl -i -X POST localhost:3077/api/v1/notes \\
  -H 'Content-Type: application/json' \\
  -d '{"title":"Learning Prisma","body":"chuong 7"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /api/v1/notes/1
Content-Type: application/json; charset=utf-8
ETag: W/"c6-hFRwcUoSrK6bPKqFlhgUHr/T0Yw"</div>
<pre><code>curl "localhost:3077/api/v1/notes?q=prisma"</code></pre>
<div class="out">{"items":[{"id":1,"title":"Learning Prisma","slug":"note-1785169979420",
  "body":"chuong 7","pinned":false,"authorId":1,
  "createdAt":"2026-07-27T16:32:59.481Z","updatedAt":"2026-07-27T16:32:59.481Z",
  "version":1}],"page":1,"limit":10,"total":1}</div>
<pre><code>curl localhost:3077/api/v1/notes/999
curl -X PATCH localhost:3077/api/v1/notes/1 -d '{"body":"đã sửa"}' -H 'Content-Type: application/json'
curl -X DELETE localhost:3077/api/v1/notes/2
curl -X POST localhost:3077/api/v1/notes -d '{"body":"no title"}' -H 'Content-Type: application/json'</code></pre>
<div class="out">GET    → {"error":{"code":"NOTE_NOT_FOUND","message":"Note 999 does not exist"}}   [404]
PATCH  → {"id":1,…,"body":"đã sửa","updatedAt":"2026-07-27T16:32:59.614Z"}         [200]
DELETE → (empty body)                                                              [204]
POST   → {"error":{"code":"VALIDATION_FAILED","message":"title is required"}}      [422]</div>
<div class="callout ok">Compare this block with the same block at the end of lesson 5.5: identical codes, identical error shape. From the client's point of view nothing happened — except that the data is still there tomorrow. <code>updatedAt</code> moved by itself on the PATCH, which is <code>@updatedAt</code> doing its job.</div>

<h3>Transactions, demonstrated rather than defined</h3>
<p>Two writes that belong together: create a note, then create its tag. The tag name is deliberately too long for <code>VarChar(40)</code>, so the second write fails. First without a transaction:</p>
<pre><code><span class="tok-keyword">const</span> note = <span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">create</span>({ data: { … } });
<span class="tok-keyword">await</span> prisma.tag.<span class="tok-fn">create</span>({ data: { name: <span class="tok-string">'x'</span>.<span class="tok-fn">repeat</span>(<span class="tok-number">60</span>) } });   <span class="tok-comment">// fails</span></code></pre>
<div class="out">before: 1 note, 0 tag
error : P2000 - The provided value for the column is too long for the column's type
after : 2 note, 0 tag   &lt;- the note WAS written, the tag was not: half-finished data</div>
<p>Now the identical scenario inside <code>$transaction</code>:</p>
<pre><code><span class="tok-keyword">await</span> prisma.$<span class="tok-fn">transaction</span>(<span class="tok-keyword">async</span> (tx) =&gt; {
  <span class="tok-keyword">await</span> tx.note.<span class="tok-fn">create</span>({ data: { … } });
  <span class="tok-keyword">await</span> tx.tag.<span class="tok-fn">create</span>({ data: { name: <span class="tok-string">'y'</span>.<span class="tok-fn">repeat</span>(<span class="tok-number">60</span>) } });   <span class="tok-comment">// still fails</span>
});</code></pre>
<div class="out">error inside transaction: P2000
notes before 2 -> after 2   &lt;- rolled back, no orphan row left behind</div>
<div class="callout"><strong>The rule that decides whether you need one:</strong> if a failure halfway would leave data that is <em>wrong</em> rather than merely <em>incomplete</em>, you need a transaction. Money moved out of one account but not into the other. An order created with no line items. A user created without their default settings row.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>$transaction([a, b, c])</code></span><span class="v">Batch: independent queries sent in one round trip, one transaction. Cannot use the result of <code>a</code> inside <code>b</code>.</span></div>
  <div class="kv"><span class="k"><code>$transaction(async tx =&gt; …)</code></span><span class="v">Interactive: you write logic between the queries. Use <code>tx</code>, never the outer <code>prisma</code>, or that query runs outside the transaction.</span></div>
</div>
<div class="pitfall"><strong>Using <code>prisma</code> instead of <code>tx</code> inside the callback is a silent bug</strong> — no error, no warning, the query simply commits on its own connection and will not roll back with the others. Search your codebase for <code>prisma.</code> inside a <code>$transaction</code> callback; it is one of the highest-value greps you can run.</div>

<h3>A transaction holds a connection — so keep it short</h3>
<p>Interactive transactions time out after 5 seconds by default. Here is a transaction that calls a slow third-party API in the middle:</p>
<div class="out">after 6.1s -> P2028: Transaction API error: A query cannot be executed on an expired
transaction. The timeout for this transaction was 5000 ms, however 6045 ms passed
since the start of the transaction. Consider increasing the interactive transaction
timeout or doing less work in the transaction.</div>
<p>Raising the timeout works and is usually the wrong fix:</p>
<pre><code><span class="tok-keyword">await</span> prisma.$<span class="tok-fn">transaction</span>(<span class="tok-keyword">async</span> (tx) =&gt; { … },
  { timeout: <span class="tok-number">15000</span>, maxWait: <span class="tok-number">5000</span> });</code></pre>
<div class="out">with timeout: 15000 -> completed normally</div>
<div class="callout warn">An open transaction occupies one pool slot <em>and</em> one PostgreSQL backend, and holds its locks the whole time. Ten concurrent transactions each waiting six seconds on an external API will drain a pool of ten, and then every other request in the process queues behind them — the incident looks like "the database is down" while the database is idle. Do the HTTP call first, then open the transaction around the writes only.</div>

<h3>Where the money is: <code>createMany</code> and batching</h3>
<div class="out">seed finished: 50 users, 1000 notes in 175ms   (createMany, 2 statements)</div>
<p>One thousand rows in a fifth of a second because it is one <code>INSERT</code> with a thousand tuples. The same work as a thousand awaited <code>create</code> calls would be a thousand round trips — and lesson 7.4 measures exactly what round trips cost.</p>

<div class="note-ct">
  <strong>How cuongthai.com does it.</strong> The same three-layer split runs the real site: routes translate HTTP, services own the rules, and the Prisma client is imported from one place. Because services never touch <code>req</code>/<code>res</code>, the identical <code>notes</code> functions are called from HTTP routes, from the scheduled AI jobs, and from tests. Transactions are used where they earn it — issuing a Pro activation code and marking it redeemed, creating a message thread with its first message — and deliberately not wrapped around anything that talks to R2 or an AI provider, because a five-second upload inside a transaction is a pool slot held hostage.
</div>

<a class="link-card codelab" href="/code-lab/prisma-orm${REF}#module-2368" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 2368 — Transactions and Batch Operations</span><span class="lc-sub">10 exercises on atomic writes and batching.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>CRUD, transaction, và đổi ruột Notes API sang PostgreSQL</h2>
<p class="lead">Bài 5.5 đã hứa: cấu trúc phân tầng tồn tại để tầng lưu trữ có thể thay đổi mà tầng HTTP không hay biết. Bài này đến đòi lời hứa đó — và báo cáo cái giá thật, chi tiết tới từng dòng.</p>

<h3>Năm thao tác</h3>
<pre><code><span class="tok-comment">// tạo</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">create</span>({ data: { title, body, slug, authorId } });

<span class="tok-comment">// đọc một — trả về null khi không có dòng nào</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findUnique</span>({ where: { id } });

<span class="tok-comment">// đọc nhiều, có lọc, sắp xếp và cửa sổ</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findMany</span>({
  where: { authorId, title: { contains: q, mode: <span class="tok-string">'insensitive'</span> } },
  orderBy: { id: <span class="tok-string">'asc'</span> }, skip: <span class="tok-number">0</span>, take: <span class="tok-number">10</span>,
});

<span class="tok-comment">// cập nhật — ném P2025 nếu dòng đó không tồn tại</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">update</span>({ where: { id }, data: patch });

<span class="tok-comment">// xoá — cũng ném P2025</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">delete</span>({ where: { id } });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>findUnique</code> và <code>findFirst</code></span><span class="v"><code>findUnique</code> chỉ nhận trường duy nhất nên dùng thẳng được chỉ mục; <code>findFirst</code> nhận mọi bộ lọc và thêm <code>LIMIT 1</code>.</span></div>
  <div class="kv"><span class="k"><code>update</code> và <code>updateMany</code></span><span class="v"><code>update</code> nhắm đúng một dòng theo khoá duy nhất và ném lỗi nếu thiếu; <code>updateMany</code> nhận mọi bộ lọc và trả về <code>{ count }</code> — nền tảng của mẹo khoá ở bài 7.6.</span></div>
  <div class="kv"><span class="k"><code>upsert</code></span><span class="v">Chèn mới, hoặc cập nhật nếu khoá duy nhất đã có — một lượt đi về, và cơ sở dữ liệu là người quyết định.</span></div>
  <div class="kv"><span class="k"><code>createMany</code></span><span class="v">Một lệnh <code>INSERT</code> nhiều dòng. Nạp 1000 ghi chú bằng nó mất <strong>175ms</strong>; một nghìn lệnh <code>create</code> riêng lẻ không thể tới gần con số đó.</span></div>
  <div class="kv"><span class="k"><code>…OrThrow</code></span><span class="v"><code>findUniqueOrThrow</code> biến "không tìm thấy" thành ngoại lệ, ăn khớp gọn gàng với bộ xử lý lỗi tập trung ở bài 5.4.</span></div>
</div>

<h3>Không tìm thấy dòng: null hay ngoại lệ, hãy chọn có chủ đích</h3>
<p>Tầng route của chương 5 mong nhận <code>null</code> cho "không tìm thấy" và một giá trị boolean từ lệnh xoá. Prisma thì ném lỗi, kèm mã — nên service dịch một lần, còn route giữ nguyên hình dạng vốn có:</p>
<pre><code><span class="tok-keyword">export async function</span> <span class="tok-fn">update</span>(id, patch) {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">return await</span> prisma.note.<span class="tok-fn">update</span>({ where: { id }, data: patch });
  } <span class="tok-keyword">catch</span> (err) {
    <span class="tok-keyword">if</span> (err.code === <span class="tok-string">'P2025'</span>) <span class="tok-keyword">return null</span>;   <span class="tok-comment">// không có dòng nào để sửa</span>
    <span class="tok-keyword">throw</span> err;                                <span class="tok-comment">// còn lại là hỏng thật</span>
  }
}</code></pre>
<div class="callout">Dòng <code>throw err</code> đó không phải để trang trí. Nuốt hết mọi ngoại lệ ở đây sẽ biến một cơ sở dữ liệu đã chết thành một lỗi 404 gọn gàng, và bạn sẽ mất cả buổi chiều đi tìm ghi chú "biến mất" mà thật ra chưa từng biến mất. Chỉ dịch đúng cái lỗi bạn hiểu; phần còn lại để nó đi tới bộ xử lý lỗi.</div>

<h3>Service, viết lại</h3>
<pre><code><span class="tok-comment">// src/services/notes.service.mjs — bản chương 7</span>
<span class="tok-keyword">import</span> { prisma } <span class="tok-keyword">from</span> <span class="tok-string">'../db.mjs'</span>;

<span class="tok-keyword">const</span> AUTHOR_ID = <span class="tok-number">1</span>;   <span class="tok-comment">// chương 8 sẽ thay bằng người dùng đang đăng nhập</span>

<span class="tok-keyword">export async function</span> <span class="tok-fn">list</span>({ page = <span class="tok-number">1</span>, limit = <span class="tok-number">10</span>, q }) {
  <span class="tok-keyword">const</span> where = {
    authorId: AUTHOR_ID,
    ...(q ? { title: { contains: q, mode: <span class="tok-string">'insensitive'</span> } } : {}),
  };
  <span class="tok-keyword">const</span> [items, total] = <span class="tok-keyword">await</span> prisma.$<span class="tok-fn">transaction</span>([
    prisma.note.<span class="tok-fn">findMany</span>({ where, orderBy: { id: <span class="tok-string">'asc'</span> },
                            skip: (page - <span class="tok-number">1</span>) * limit, take: limit }),
    prisma.note.<span class="tok-fn">count</span>({ where }),
  ]);
  <span class="tok-keyword">return</span> { items, page, limit, total };
}</code></pre>
<p>Danh sách dòng và tổng số đến từ cùng một <code>$transaction([…])</code> — một mảng truy vấn gửi đi cùng nhau và chạy trong một transaction, nên con số tổng không thể mô tả một thời điểm khác với trang dữ liệu. Hai lần <code>await</code> tách rời sẽ cho phép một lệnh ghi chen vào giữa và sinh ra <code>total: 41</code> nằm cạnh 40 mục nhìn thấy được, mãi mãi.</p>

<h3>Bản diff trung thực</h3>
<p>Đây là thay đổi ở router, do lệnh <code>diff</code> sinh ra trên hai file thật:</p>
<pre><code>-import * as service from '../services/notes.service.mem.mjs';
+import * as service from '../services/notes.service.pg.mjs';

-router.get('/', (req, res) =&gt; {
-  res.json(service.list({ page, limit, q: req.query.q }));
+router.get('/', async (req, res) =&gt; {
+  res.json(await service.list({ page, limit, q: req.query.q }));

-router.get('/:id', (req, res) =&gt; {
-  const note = service.get(Number(req.params.id));
+router.get('/:id', async (req, res) =&gt; {
+  const note = await service.get(Number(req.params.id));</code></pre>
<div class="out">11 dòng thay đổi trên tổng 39 dòng của router:
  1  dòng import
  5  handler được thêm từ khoá \`async\`
  5  lời gọi service được thêm \`await\`
  0  mã trạng thái, đường dẫn, luật kiểm tra dữ liệu hay nhánh lỗi bị đụng tới</div>
<div class="callout ok"><strong>Lời hứa, nói lại cho đúng.</strong> Bài 5.5 bảo "đổi một file". Sự thật là một file bị <em>viết lại</em> (service) và router được thêm hai từ khoá cho mỗi handler — vì một lời gọi cơ sở dữ liệu là bất đồng bộ, còn <code>Map</code> trong RAM thì không. Thứ KHÔNG đổi là tất cả những gì làm nên một API: đường dẫn, mã trạng thái, header <code>Location</code>, kiểm tra dữ liệu, nhánh 404, bộ xử lý lỗi. Nếu handler của chương 5 đã được viết <code>async</code> ngay từ đầu, router sẽ giống hệt nhau tới từng byte.</div>
<div class="pitfall">Express 5 tự chuyển một promise bị từ chối trong handler tới bộ xử lý lỗi của bạn — Express 4 thì không (chúng ta đã chứng minh ở bài 5.1: request treo vĩnh viễn). Thêm <code>await</code> vào handler trên Express 4 mà không có <code>try/catch</code> hay lớp bọc chính là cách một "thay đổi nhỏ để dùng cơ sở dữ liệu" biến thành những request không bao giờ có câu trả lời.</div>

<h3>Chạy thử — mọi phản hồi đều chép từ server thật</h3>
<pre><code>curl -i -X POST localhost:3077/api/v1/notes \\
  -H 'Content-Type: application/json' \\
  -d '{"title":"Learning Prisma","body":"chuong 7"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /api/v1/notes/1
Content-Type: application/json; charset=utf-8
ETag: W/"c6-hFRwcUoSrK6bPKqFlhgUHr/T0Yw"</div>
<pre><code>curl "localhost:3077/api/v1/notes?q=prisma"</code></pre>
<div class="out">{"items":[{"id":1,"title":"Learning Prisma","slug":"note-1785169979420",
  "body":"chuong 7","pinned":false,"authorId":1,
  "createdAt":"2026-07-27T16:32:59.481Z","updatedAt":"2026-07-27T16:32:59.481Z",
  "version":1}],"page":1,"limit":10,"total":1}</div>
<pre><code>curl localhost:3077/api/v1/notes/999
curl -X PATCH localhost:3077/api/v1/notes/1 -d '{"body":"đã sửa"}' -H 'Content-Type: application/json'
curl -X DELETE localhost:3077/api/v1/notes/2
curl -X POST localhost:3077/api/v1/notes -d '{"body":"no title"}' -H 'Content-Type: application/json'</code></pre>
<div class="out">GET    → {"error":{"code":"NOTE_NOT_FOUND","message":"Note 999 does not exist"}}   [404]
PATCH  → {"id":1,…,"body":"đã sửa","updatedAt":"2026-07-27T16:32:59.614Z"}         [200]
DELETE → (không có nội dung)                                                       [204]
POST   → {"error":{"code":"VALIDATION_FAILED","message":"title is required"}}      [422]</div>
<div class="callout ok">So khối này với khối y hệt ở cuối bài 5.5: cùng mã trạng thái, cùng hình dạng lỗi. Dưới góc nhìn của client thì chẳng có gì xảy ra — ngoại trừ việc ngày mai dữ liệu vẫn còn đó. Trường <code>updatedAt</code> tự nhảy khi PATCH, đó là <code>@updatedAt</code> đang làm việc của nó.</div>

<h3>Transaction, chứng minh thay vì định nghĩa</h3>
<p>Hai lệnh ghi phải đi cùng nhau: tạo ghi chú, rồi tạo thẻ cho nó. Tên thẻ được cố ý làm dài quá <code>VarChar(40)</code> nên lệnh ghi thứ hai sẽ hỏng. Trước hết là khi không có transaction:</p>
<pre><code><span class="tok-keyword">const</span> note = <span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">create</span>({ data: { … } });
<span class="tok-keyword">await</span> prisma.tag.<span class="tok-fn">create</span>({ data: { name: <span class="tok-string">'x'</span>.<span class="tok-fn">repeat</span>(<span class="tok-number">60</span>) } });   <span class="tok-comment">// hỏng</span></code></pre>
<div class="out">trước: 1 note, 0 tag
lỗi  : P2000 - The provided value for the column is too long for the column's type
sau  : 2 note, 0 tag   &lt;- note ĐÃ ghi, tag thì không: dữ liệu nửa vời</div>
<p>Giờ là đúng kịch bản đó nhưng đặt trong <code>$transaction</code>:</p>
<pre><code><span class="tok-keyword">await</span> prisma.$<span class="tok-fn">transaction</span>(<span class="tok-keyword">async</span> (tx) =&gt; {
  <span class="tok-keyword">await</span> tx.note.<span class="tok-fn">create</span>({ data: { … } });
  <span class="tok-keyword">await</span> tx.tag.<span class="tok-fn">create</span>({ data: { name: <span class="tok-string">'y'</span>.<span class="tok-fn">repeat</span>(<span class="tok-number">60</span>) } });   <span class="tok-comment">// vẫn hỏng</span>
});</code></pre>
<div class="out">lỗi trong transaction: P2000
note trước 2 -> sau 2   &lt;- đã cuộn ngược, không còn dòng rác nào</div>
<div class="callout"><strong>Quy tắc quyết định bạn có cần transaction hay không:</strong> nếu hỏng giữa chừng để lại dữ liệu <em>sai</em> chứ không chỉ <em>thiếu</em>, thì bạn cần transaction. Tiền đã trừ ở tài khoản này mà chưa cộng vào tài khoản kia. Một đơn hàng được tạo mà không có dòng hàng nào. Một người dùng được tạo mà thiếu dòng cấu hình mặc định.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>$transaction([a, b, c])</code></span><span class="v">Kiểu lô: các truy vấn độc lập gửi trong một lượt đi về, chung một transaction. Không dùng được kết quả của <code>a</code> bên trong <code>b</code>.</span></div>
  <div class="kv"><span class="k"><code>$transaction(async tx =&gt; …)</code></span><span class="v">Kiểu tương tác: bạn viết logic xen giữa các truy vấn. Phải dùng <code>tx</code>, tuyệt đối không dùng <code>prisma</code> bên ngoài, nếu không truy vấn đó chạy ngoài transaction.</span></div>
</div>
<div class="pitfall"><strong>Dùng <code>prisma</code> thay vì <code>tx</code> bên trong hàm callback là một con bug im lặng</strong> — không lỗi, không cảnh báo, truy vấn đó đơn giản là commit trên kết nối riêng của nó và sẽ không cuộn ngược cùng những cái khác. Hãy tìm chữ <code>prisma.</code> nằm trong callback <code>$transaction</code> khắp mã nguồn của bạn; đó là một trong những lần grep đáng giá nhất bạn có thể chạy.</div>

<h3>Transaction giữ một kết nối — nên hãy làm cho nhanh</h3>
<p>Transaction kiểu tương tác hết hạn sau 5 giây theo mặc định. Đây là một transaction gọi API bên thứ ba chậm ở giữa:</p>
<div class="out">sau 6.1s -> P2028: Transaction API error: A query cannot be executed on an expired
transaction. The timeout for this transaction was 5000 ms, however 6045 ms passed
since the start of the transaction. Consider increasing the interactive transaction
timeout or doing less work in the transaction.</div>
<p>Nâng thời gian chờ thì chạy được, và thường là cách sửa sai:</p>
<pre><code><span class="tok-keyword">await</span> prisma.$<span class="tok-fn">transaction</span>(<span class="tok-keyword">async</span> (tx) =&gt; { … },
  { timeout: <span class="tok-number">15000</span>, maxWait: <span class="tok-number">5000</span> });</code></pre>
<div class="out">với timeout: 15000 -> chạy xong bình thường</div>
<div class="callout warn">Một transaction đang mở chiếm một chỗ trong pool <em>và</em> một backend PostgreSQL, đồng thời giữ khoá suốt thời gian đó. Mười transaction đồng thời, mỗi cái chờ sáu giây một API bên ngoài, sẽ vét cạn một pool mười chỗ, và rồi mọi request khác trong tiến trình phải xếp hàng sau chúng — sự cố trông như "cơ sở dữ liệu chết" trong khi cơ sở dữ liệu đang rảnh. Hãy gọi HTTP trước, rồi mới mở transaction chỉ bao quanh các lệnh ghi.</div>

<h3>Chỗ hái ra tiền: <code>createMany</code> và gộp lô</h3>
<div class="out">seed xong: 50 user, 1000 note trong 175ms   (createMany, 2 câu lệnh)</div>
<p>Một nghìn dòng trong một phần năm giây, vì đó là một câu <code>INSERT</code> với một nghìn bộ giá trị. Cùng khối lượng đó mà viết thành một nghìn lệnh <code>create</code> có <code>await</code> sẽ là một nghìn lượt đi về — và bài 7.4 đo chính xác một lượt đi về đắt cỡ nào.</p>

<div class="note-ct">
  <strong>cuongthai.com làm thế nào.</strong> Đúng cách chia ba tầng này đang chạy trang thật: route dịch HTTP, service giữ luật nghiệp vụ, và Prisma client được import từ một chỗ duy nhất. Vì service không bao giờ chạm vào <code>req</code>/<code>res</code>, cùng những hàm <code>notes</code> đó được gọi từ route HTTP, từ các job AI chạy theo lịch, và từ test. Transaction chỉ dùng ở chỗ nó xứng đáng — phát mã kích hoạt Pro và đánh dấu đã dùng, tạo một luồng tin nhắn kèm tin nhắn đầu tiên — và cố tình KHÔNG bọc quanh bất cứ thứ gì nói chuyện với R2 hay nhà cung cấp AI, vì một lần tải file năm giây nằm trong transaction là một chỗ pool bị bắt làm con tin.
</div>

<a class="link-card codelab" href="/code-lab/prisma-orm${REF}#module-2368" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 2368 — Transactions and Batch Operations</span><span class="lc-sub">10 bài tập về ghi nguyên tử và gộp lô.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Relations, and the N+1 problem measured|||7.4 — Quan hệ, và bẫy N+1 đo bằng số thật',
      slug: 'nodejs-7-4-quan-he-va-n-plus-1',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-7-4-quan-he-va-n-plus-1.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-7-4-quan-he-va-n-plus-1.jpg',
        scenario: 'nodejs-n-plus-1',
        durationSeconds: 22,
        caption: { en: "Relations and the N+1 trap", vi: "Quan hệ và bẫy N+1" },
      },
      type: 'VIDEO',
      description: 'Đọc dữ liệu liên quan bằng include/select, nhìn SQL Prisma sinh ra, và đo chênh lệch giữa 51 truy vấn với 2 truy vấn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Relations, and the N+1 problem measured</h2>
<p class="lead">N+1 is the most common performance bug in applications that use an ORM, and it is invisible in code review: the loop looks innocent, each query is fast, and the endpoint is simply slow. This lesson makes it visible by counting the SQL statements your code actually sends.</p>

<h3>The three shapes of relation</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">one-to-many</span><span class="lz-v">User → Note. The foreign key lives on the many side (<code>Note.authorId</code>).</span></div>
  <div class="lz-node"><span class="lz-k">many-to-many</span><span class="lz-v">Note ↔ Tag through <code>NoteTag</code>. Two foreign keys, compound primary key.</span></div>
  <div class="lz-node"><span class="lz-k">one-to-one</span><span class="lz-v">User → Profile. Same as one-to-many plus <code>@unique</code> on the foreign key.</span></div>
</div>
<pre><code><span class="tok-comment">// read a user with their notes</span>
<span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>({ include: { notes: <span class="tok-keyword">true</span> } });

<span class="tok-comment">// only the fields you need — from both sides</span>
<span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>({
  select: { id: <span class="tok-keyword">true</span>, name: <span class="tok-keyword">true</span>,
            notes: { select: { id: <span class="tok-keyword">true</span>, title: <span class="tok-keyword">true</span> } } },
});

<span class="tok-comment">// filter the parent by something about the children</span>
<span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>({ where: { notes: { some: { pinned: <span class="tok-keyword">true</span> } } } });

<span class="tok-comment">// create parent and children in one call, in one transaction</span>
<span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">create</span>({
  data: { email, name, notes: { create: [{ title, slug, body }] } },
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>include</code></span><span class="v">"Give me the whole row, plus this relation."</span></div>
  <div class="kv"><span class="k"><code>select</code></span><span class="v">"Give me exactly these fields." You cannot use both at the same level — <code>select</code> already says everything.</span></div>
  <div class="kv"><span class="k"><code>some</code> / <code>every</code> / <code>none</code></span><span class="v">Filter a parent by its children. Becomes an SQL <code>EXISTS</code> subquery.</span></div>
  <div class="kv"><span class="k">Nested <code>create</code> / <code>connect</code></span><span class="v"><code>create</code> makes a new related row; <code>connect</code> links an existing one. Both run inside one implicit transaction.</span></div>
  <div class="kv"><span class="k"><code>_count</code></span><span class="v"><code>include: { _count: { select: { notes: true } } }</code> returns "how many" without shipping the rows.</span></div>
</div>

<h3>What <code>include</code> really sends</h3>
<p>Prisma does not emit a <code>JOIN</code> by default. It sends one query per level and stitches the results in JavaScript. Captured from the real query log:</p>
<div class="out">SELECT "User"."id", "User"."email", "User"."name", "User"."createdAt"
  FROM "User" WHERE "User"."id" &lt;= $1 OFFSET $2

SELECT "Note"."id", "Note"."title", "Note"."slug", "Note"."body", "Note"."pinned",
       "Note"."authorId", "Note"."createdAt", "Note"."updatedAt", "Note"."version"
  FROM "Note" WHERE "Note"."authorId" IN ($1,$2) ORDER BY "Note"."id" ASC OFFSET $3</div>
<p>Two statements, and the second one uses <code>IN (…)</code> with every parent id it just fetched. That <code>IN</code> is the entire trick: it is the difference between two round trips and fifty-one.</p>
<div class="callout">Two queries instead of one join is a deliberate trade: a join duplicates the parent row once per child (a user with 20 notes comes back 20 times over the wire), while two queries send each row once. For deep or wide relations the two-query strategy usually transfers far less data.</div>

<h3>The experiment: 50 users, 1000 notes, five ways</h3>
<p>Every run counts the SQL statements by listening to Prisma's <code>query</code> event, so the numbers are not estimates:</p>
<pre><code><span class="tok-keyword">const</span> prisma = <span class="tok-keyword">new</span> <span class="tok-fn">PrismaClient</span>({
  adapter, log: [{ emit: <span class="tok-string">'event'</span>, level: <span class="tok-string">'query'</span> }],
});
<span class="tok-keyword">let</span> queries = <span class="tok-number">0</span>;
prisma.$<span class="tok-fn">on</span>(<span class="tok-string">'query'</span>, () =&gt; { queries++; });</code></pre>
<pre><code><span class="tok-comment">// A. the loop — the bug we are hunting</span>
<span class="tok-keyword">const</span> users = <span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>();
<span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> u <span class="tok-keyword">of</span> users) {
  <span class="tok-keyword">const</span> notes = <span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findMany</span>({ where: { authorId: u.id } });
}</code></pre>
<div class="out">A. loop (N+1)                        79ms    51 SQL queries   1000 notes
B. include (one Prisma call)         14ms     2 SQL queries   1000 notes
C. findMany + group with a Map       12ms     2 SQL queries   1000 notes
D. groupBy (when you only need counts) 5ms     1 SQL query     1000 notes
E. include + select 2 columns         3ms     2 SQL queries   1000 notes</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">A</span><span class="lz-t">1 + 50 queries</span></div>
  <div class="lz-step"><span class="lz-n">B</span><span class="lz-t">2 queries, same result</span></div>
  <div class="lz-step"><span class="lz-n">E</span><span class="lz-t">2 queries, fewer columns → 26× faster than A</span></div>
</div>
<p>Read the first column and then the second. A is 5.6× slower than B on a database running on <em>the same machine</em>, where a round trip costs about 0.4ms. Your production database is not on the same machine. Put it one millisecond away — a modest, realistic network — and the arithmetic changes shape: A pays 51 round trips ≈ +51ms, B pays 2 ≈ +2ms. The gap widens with every user you add, which is why this bug always appears <em>after</em> launch: it was fine with 10 users in development.</p>
<div class="pitfall"><strong>How to recognise N+1 in a code review:</strong> an <code>await</code> on a database call inside a <code>for</code>, <code>map</code> or <code>forEach</code> over rows you just fetched. That is the whole pattern. It also hides inside helper functions — <code>await enrich(note)</code> looks harmless until you open <code>enrich</code> and find a query in it.</div>

<h3>Fixing it without <code>include</code></h3>
<p>Sometimes the shape you need does not map onto <code>include</code>. Then fetch both sets and join in memory — still two queries:</p>
<pre><code><span class="tok-keyword">const</span> [users, notes] = <span class="tok-keyword">await</span> Promise.<span class="tok-fn">all</span>([
  prisma.user.<span class="tok-fn">findMany</span>(),
  prisma.note.<span class="tok-fn">findMany</span>({ where: { authorId: { <span class="tok-keyword">in</span>: ids } } }),
]);
<span class="tok-keyword">const</span> byUser = <span class="tok-keyword">new</span> <span class="tok-fn">Map</span>(users.<span class="tok-fn">map</span>(u =&gt; [u.id, []]));
<span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> n <span class="tok-keyword">of</span> notes) byUser.<span class="tok-fn">get</span>(n.authorId)?.<span class="tok-fn">push</span>(n);</code></pre>
<p>This is the "dataloader" pattern in its simplest form: collect the ids, fetch once with <code>in</code>, index by key. Row C above is exactly this code — 12ms, two queries.</p>

<h3>Do not fetch what you are only going to count</h3>
<pre><code><span class="tok-comment">// wrong: 1000 rows travel the network so you can call .length</span>
<span class="tok-keyword">const</span> users = <span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>({ include: { notes: <span class="tok-keyword">true</span> } });
users.<span class="tok-fn">map</span>(u =&gt; u.notes.length);

<span class="tok-comment">// right: the database counts and sends 50 numbers</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">groupBy</span>({ by: [<span class="tok-string">'authorId'</span>], _count: { _all: <span class="tok-keyword">true</span> } });
<span class="tok-comment">// or, keeping the parent rows:</span>
<span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>({ include: { _count: { select: { notes: <span class="tok-keyword">true</span> } } } });</code></pre>
<div class="out">D. groupBy   5ms   1 SQL query   (vs B: 14ms, 2 queries carrying 1000 rows)</div>

<h3>Columns are bandwidth</h3>
<p>Same 50 users and 1000 notes, serialised to JSON as an API would:</p>
<div class="out">every column      : 322.1 KB
select 4 columns  :  50.1 KB     (6.4× smaller)</div>
<p>The <code>body</code> field is what costs you — a list endpoint almost never needs it, and a mobile client on 4G certainly does not. Reach for <code>select</code> on list endpoints and <code>include</code> on detail endpoints, and the difference shows up as time-to-first-render on someone's phone.</p>
<div class="callout ok"><code>omit</code> is the mirror image and often more maintainable: <code>omit: { body: true }</code> keeps every future column automatically while dropping the one you know is heavy. With <code>select</code> you must remember to add new fields; with <code>omit</code> you must remember to exclude new heavy ones. Pick per endpoint.</div>

<h3>Reading the query log while you develop</h3>
<pre><code><span class="tok-keyword">const</span> prisma = <span class="tok-keyword">new</span> <span class="tok-fn">PrismaClient</span>({
  adapter,
  log: process.env.NODE_ENV === <span class="tok-string">'development'</span>
    ? [{ emit: <span class="tok-string">'event'</span>, level: <span class="tok-string">'query'</span> }]
    : [<span class="tok-string">'error'</span>],
});
prisma.$<span class="tok-fn">on</span>(<span class="tok-string">'query'</span>, (e) =&gt; {
  <span class="tok-keyword">if</span> (e.duration &gt; <span class="tok-number">50</span>) console.warn(<span class="tok-string">'SLOW'</span>, e.duration + <span class="tok-string">'ms'</span>, e.query);
});</code></pre>
<div class="callout warn">Never log every query in production: it is a flood, it costs real CPU, and query text plus parameters can contain personal data. Log slow queries only, and lift the counting idea into a test — "this endpoint must issue at most 3 statements" is an assertion that fails the day someone adds a loop, which is the only way N+1 is ever caught early.</div>

<div class="note-ct">
  <strong>How cuongthai.com does it.</strong> The feed is where this bites hardest: a page of posts needs each post's author, media, reaction counts and "did I react" flag. Done naively that is one query per post per relation — the loop that turns a 40ms endpoint into 900ms. The site fetches the page of posts once, collects the ids, and resolves each relation with a single <code>in</code> query plus <code>_count</code> aggregates, then stitches them together — the C and D shapes above. In development the client logs queries with timings, which is how a nested include that quietly returned entire article bodies inside a list endpoint was found and replaced with a <code>select</code>.
</div>

<a class="link-card codelab" href="/code-lab/prisma-orm${REF}#module-433" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 433 — Relations and Nested Operations</span><span class="lc-sub">10 exercises on include, select and nested writes.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Quan hệ, và bẫy N+1 đo bằng số thật</h2>
<p class="lead">N+1 là lỗi hiệu năng phổ biến nhất trong các ứng dụng dùng ORM, và nó vô hình khi review code: vòng lặp trông vô hại, mỗi truy vấn đều nhanh, và endpoint thì đơn giản là chậm. Bài này làm cho nó hiện hình bằng cách đếm số câu lệnh SQL mà code của bạn thật sự gửi đi.</p>

<h3>Ba hình dạng của quan hệ</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">một–nhiều</span><span class="lz-v">User → Note. Khoá ngoại nằm ở phía "nhiều" (<code>Note.authorId</code>).</span></div>
  <div class="lz-node"><span class="lz-k">nhiều–nhiều</span><span class="lz-v">Note ↔ Tag qua <code>NoteTag</code>. Hai khoá ngoại, khoá chính ghép.</span></div>
  <div class="lz-node"><span class="lz-k">một–một</span><span class="lz-v">User → Profile. Giống một–nhiều cộng thêm <code>@unique</code> trên khoá ngoại.</span></div>
</div>
<pre><code><span class="tok-comment">// đọc người dùng kèm ghi chú của họ</span>
<span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>({ include: { notes: <span class="tok-keyword">true</span> } });

<span class="tok-comment">// chỉ lấy những trường bạn cần — ở cả hai phía</span>
<span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>({
  select: { id: <span class="tok-keyword">true</span>, name: <span class="tok-keyword">true</span>,
            notes: { select: { id: <span class="tok-keyword">true</span>, title: <span class="tok-keyword">true</span> } } },
});

<span class="tok-comment">// lọc cha theo đặc điểm của con</span>
<span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>({ where: { notes: { some: { pinned: <span class="tok-keyword">true</span> } } } });

<span class="tok-comment">// tạo cha và con trong một lời gọi, trong một transaction</span>
<span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">create</span>({
  data: { email, name, notes: { create: [{ title, slug, body }] } },
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>include</code></span><span class="v">"Cho tôi cả dòng dữ liệu, cộng thêm quan hệ này."</span></div>
  <div class="kv"><span class="k"><code>select</code></span><span class="v">"Cho tôi đúng những trường này." Không dùng cả hai ở cùng một cấp — <code>select</code> đã nói hết rồi.</span></div>
  <div class="kv"><span class="k"><code>some</code> / <code>every</code> / <code>none</code></span><span class="v">Lọc cha theo con. Dịch thành truy vấn con <code>EXISTS</code> trong SQL.</span></div>
  <div class="kv"><span class="k"><code>create</code> / <code>connect</code> lồng nhau</span><span class="v"><code>create</code> tạo dòng liên quan mới; <code>connect</code> nối vào dòng đã có. Cả hai chạy trong một transaction ngầm.</span></div>
  <div class="kv"><span class="k"><code>_count</code></span><span class="v"><code>include: { _count: { select: { notes: true } } }</code> trả về "bao nhiêu cái" mà không phải chuyển các dòng dữ liệu về.</span></div>
</div>

<h3><code>include</code> thật sự gửi gì đi</h3>
<p>Prisma mặc định KHÔNG sinh <code>JOIN</code>. Nó gửi một truy vấn cho mỗi cấp rồi ghép kết quả bằng JavaScript. Chép từ log truy vấn thật:</p>
<div class="out">SELECT "User"."id", "User"."email", "User"."name", "User"."createdAt"
  FROM "User" WHERE "User"."id" &lt;= $1 OFFSET $2

SELECT "Note"."id", "Note"."title", "Note"."slug", "Note"."body", "Note"."pinned",
       "Note"."authorId", "Note"."createdAt", "Note"."updatedAt", "Note"."version"
  FROM "Note" WHERE "Note"."authorId" IN ($1,$2) ORDER BY "Note"."id" ASC OFFSET $3</div>
<p>Hai câu lệnh, và câu thứ hai dùng <code>IN (…)</code> với toàn bộ id cha vừa lấy được. Chính cái <code>IN</code> đó là toàn bộ mẹo: nó là khác biệt giữa hai lượt đi về và năm mươi mốt lượt.</p>
<div class="callout">Hai truy vấn thay vì một phép join là một đánh đổi có chủ ý: join nhân bản dòng cha một lần cho mỗi dòng con (một người dùng có 20 ghi chú sẽ được gửi về 20 lần trên đường truyền), còn hai truy vấn thì mỗi dòng chỉ gửi một lần. Với quan hệ sâu hoặc rộng, chiến lược hai truy vấn thường truyền ít dữ liệu hơn hẳn.</div>

<h3>Thí nghiệm: 50 người dùng, 1000 ghi chú, năm cách</h3>
<p>Mỗi lần chạy đều đếm số câu lệnh SQL bằng cách nghe sự kiện <code>query</code> của Prisma, nên các con số không phải ước lượng:</p>
<pre><code><span class="tok-keyword">const</span> prisma = <span class="tok-keyword">new</span> <span class="tok-fn">PrismaClient</span>({
  adapter, log: [{ emit: <span class="tok-string">'event'</span>, level: <span class="tok-string">'query'</span> }],
});
<span class="tok-keyword">let</span> queries = <span class="tok-number">0</span>;
prisma.$<span class="tok-fn">on</span>(<span class="tok-string">'query'</span>, () =&gt; { queries++; });</code></pre>
<pre><code><span class="tok-comment">// A. vòng lặp — con bug chúng ta đang săn</span>
<span class="tok-keyword">const</span> users = <span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>();
<span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> u <span class="tok-keyword">of</span> users) {
  <span class="tok-keyword">const</span> notes = <span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findMany</span>({ where: { authorId: u.id } });
}</code></pre>
<div class="out">A. vòng lặp (N+1)                     79ms    51 truy vấn SQL   1000 ghi chú
B. include (1 lệnh Prisma)            14ms     2 truy vấn SQL   1000 ghi chú
C. findMany + gom bằng Map            12ms     2 truy vấn SQL   1000 ghi chú
D. groupBy (chỉ cần số lượng)          5ms     1 truy vấn SQL   1000 ghi chú
E. include + select 2 cột              3ms     2 truy vấn SQL   1000 ghi chú</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">A</span><span class="lz-t">1 + 50 truy vấn</span></div>
  <div class="lz-step"><span class="lz-n">B</span><span class="lz-t">2 truy vấn, cùng kết quả</span></div>
  <div class="lz-step"><span class="lz-n">E</span><span class="lz-t">2 truy vấn, ít cột hơn → nhanh hơn A 26 lần</span></div>
</div>
<p>Hãy đọc cột thứ nhất rồi đọc cột thứ hai. A chậm hơn B 5,6 lần trên một cơ sở dữ liệu chạy <em>ngay trên cùng một máy</em>, nơi một lượt đi về chỉ tốn khoảng 0,4ms. Cơ sở dữ liệu production của bạn không nằm cùng máy. Đặt nó cách một mili-giây thôi — một mạng khiêm tốn và thực tế — thì phép tính đổi hình dạng ngay: A trả 51 lượt đi về ≈ +51ms, B trả 2 lượt ≈ +2ms. Khoảng cách nới rộng theo mỗi người dùng bạn thêm vào, và đó là lý do con bug này luôn xuất hiện <em>sau</em> khi ra mắt: lúc dev với 10 người dùng thì mọi thứ vẫn ổn.</p>
<div class="pitfall"><strong>Cách nhận ra N+1 khi review code:</strong> một chữ <code>await</code> gọi cơ sở dữ liệu nằm trong <code>for</code>, <code>map</code> hoặc <code>forEach</code> duyệt qua đúng những dòng bạn vừa lấy về. Toàn bộ dấu hiệu chỉ có vậy. Nó cũng núp trong các hàm phụ trợ — <code>await enrich(note)</code> trông vô hại cho tới khi bạn mở <code>enrich</code> ra và thấy một truy vấn nằm trong đó.</div>

<h3>Sửa mà không dùng <code>include</code></h3>
<p>Đôi khi hình dạng dữ liệu bạn cần không ánh xạ được vào <code>include</code>. Khi đó hãy lấy cả hai tập rồi ghép trong bộ nhớ — vẫn chỉ là hai truy vấn:</p>
<pre><code><span class="tok-keyword">const</span> [users, notes] = <span class="tok-keyword">await</span> Promise.<span class="tok-fn">all</span>([
  prisma.user.<span class="tok-fn">findMany</span>(),
  prisma.note.<span class="tok-fn">findMany</span>({ where: { authorId: { <span class="tok-keyword">in</span>: ids } } }),
]);
<span class="tok-keyword">const</span> byUser = <span class="tok-keyword">new</span> <span class="tok-fn">Map</span>(users.<span class="tok-fn">map</span>(u =&gt; [u.id, []]));
<span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> n <span class="tok-keyword">of</span> notes) byUser.<span class="tok-fn">get</span>(n.authorId)?.<span class="tok-fn">push</span>(n);</code></pre>
<p>Đây là mẫu "dataloader" ở dạng đơn giản nhất: gom id lại, lấy một lần bằng <code>in</code>, rồi lập chỉ mục theo khoá. Dòng C ở trên chính là đoạn code này — 12ms, hai truy vấn.</p>

<h3>Đừng tải về thứ mà bạn chỉ định đếm</h3>
<pre><code><span class="tok-comment">// sai: 1000 dòng chạy qua mạng chỉ để bạn gọi .length</span>
<span class="tok-keyword">const</span> users = <span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>({ include: { notes: <span class="tok-keyword">true</span> } });
users.<span class="tok-fn">map</span>(u =&gt; u.notes.length);

<span class="tok-comment">// đúng: cơ sở dữ liệu đếm và gửi về 50 con số</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">groupBy</span>({ by: [<span class="tok-string">'authorId'</span>], _count: { _all: <span class="tok-keyword">true</span> } });
<span class="tok-comment">// hoặc, nếu vẫn cần dòng cha:</span>
<span class="tok-keyword">await</span> prisma.user.<span class="tok-fn">findMany</span>({ include: { _count: { select: { notes: <span class="tok-keyword">true</span> } } } });</code></pre>
<div class="out">D. groupBy   5ms   1 truy vấn SQL   (so với B: 14ms, 2 truy vấn cõng 1000 dòng)</div>

<h3>Cột chính là băng thông</h3>
<p>Cùng 50 người dùng và 1000 ghi chú đó, chuyển thành JSON như một API sẽ làm:</p>
<div class="out">đủ mọi cột    : 322,1 KB
select 4 cột  :  50,1 KB     (nhỏ hơn 6,4 lần)</div>
<p>Trường <code>body</code> mới là thứ ngốn tiền — một endpoint danh sách gần như không bao giờ cần tới nó, và một máy điện thoại đang dùng 4G thì chắc chắn là không. Hãy dùng <code>select</code> cho endpoint danh sách và <code>include</code> cho endpoint chi tiết, khác biệt sẽ hiện ra thành thời gian hiển thị trên máy của người khác.</p>
<div class="callout ok"><code>omit</code> là hình ảnh phản chiếu và thường dễ bảo trì hơn: <code>omit: { body: true }</code> giữ lại mọi cột thêm vào sau này một cách tự động trong khi vẫn bỏ đi cái cột bạn biết là nặng. Với <code>select</code> bạn phải nhớ bổ sung trường mới; với <code>omit</code> bạn phải nhớ loại trừ trường nặng mới. Hãy chọn theo từng endpoint.</div>

<h3>Đọc log truy vấn trong lúc phát triển</h3>
<pre><code><span class="tok-keyword">const</span> prisma = <span class="tok-keyword">new</span> <span class="tok-fn">PrismaClient</span>({
  adapter,
  log: process.env.NODE_ENV === <span class="tok-string">'development'</span>
    ? [{ emit: <span class="tok-string">'event'</span>, level: <span class="tok-string">'query'</span> }]
    : [<span class="tok-string">'error'</span>],
});
prisma.$<span class="tok-fn">on</span>(<span class="tok-string">'query'</span>, (e) =&gt; {
  <span class="tok-keyword">if</span> (e.duration &gt; <span class="tok-number">50</span>) console.warn(<span class="tok-string">'CHẬM'</span>, e.duration + <span class="tok-string">'ms'</span>, e.query);
});</code></pre>
<div class="callout warn">Đừng bao giờ log mọi truy vấn trên production: nó là một trận lụt, nó tốn CPU thật, và nội dung truy vấn cùng tham số có thể chứa dữ liệu cá nhân. Chỉ log truy vấn chậm, và hãy nâng ý tưởng đếm truy vấn lên thành một bài test — "endpoint này được phép gửi tối đa 3 câu lệnh" là một khẳng định sẽ đỏ ngay ngày có người thêm một vòng lặp, và đó là cách duy nhất bắt được N+1 từ sớm.</div>

<div class="note-ct">
  <strong>cuongthai.com làm thế nào.</strong> Bảng tin (feed) là chỗ đau nhất: một trang bài viết cần tác giả của từng bài, media, số lượt cảm xúc và cờ "tôi đã thả cảm xúc chưa". Làm ngây thơ thì đó là một truy vấn cho mỗi bài nhân mỗi quan hệ — đúng cái vòng lặp biến endpoint 40ms thành 900ms. Trang thật lấy một trang bài viết trước, gom id lại, rồi giải từng quan hệ bằng một truy vấn <code>in</code> duy nhất cộng với các phép gộp <code>_count</code>, sau đó ghép lại — chính là hình dạng C và D ở trên. Khi dev, client có log truy vấn kèm thời gian, và nhờ đó người ta phát hiện một include lồng nhau đang âm thầm trả về nguyên phần thân bài viết bên trong một endpoint danh sách, rồi thay nó bằng <code>select</code>.
</div>

<a class="link-card codelab" href="/code-lab/prisma-orm${REF}#module-433" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 433 — Relations and Nested Operations</span><span class="lc-sub">10 bài tập về include, select và ghi lồng nhau.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — Indexes, and reading EXPLAIN ANALYZE|||7.5 — Chỉ mục, và cách đọc EXPLAIN ANALYZE',
      slug: 'nodejs-7-5-chi-muc-va-explain',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-7-5-chi-muc-va-explain.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-7-5-chi-muc-va-explain.jpg',
        scenario: 'nodejs-index-explain',
        durationSeconds: 19,
        caption: { en: "Indexes and EXPLAIN ANALYZE", vi: "Chỉ mục và EXPLAIN ANALYZE" },
      },
      type: 'VIDEO',
      description: 'Đo cùng một truy vấn trên 751.000 dòng trước và sau khi có chỉ mục, học đọc kế hoạch thực thi, và biết cái giá phải trả khi ghi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Indexes, and reading EXPLAIN ANALYZE</h2>
<p class="lead">Every table in this lesson holds 751,000 notes — small by production standards, large enough that the difference between a good plan and a bad one is the difference between an API and an outage. The tool that shows you which one you have is <code>EXPLAIN ANALYZE</code>, and it is the single most useful thing in this chapter.</p>

<h3>The query, before</h3>
<p>"Twenty most recent notes by one author" — the most ordinary query an API ever runs:</p>
<pre><code>EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title FROM "Note"
WHERE "authorId" = 7
ORDER BY "createdAt" DESC
LIMIT 20;</code></pre>
<div class="out">Limit  (cost=33881.63..33883.97 rows=20) (actual time=26.855..28.594 rows=20 loops=1)
  Buffers: shared hit=16136 read=14097
  -&gt;  Gather Merge  (actual time=26.853..28.590 rows=20 loops=1)
        Workers Launched: 2
        -&gt;  Sort  (actual time=25.208..25.209 rows=20 loops=3)
              Sort Key: "createdAt" DESC
              Sort Method: top-N heapsort  Memory: 26kB
              -&gt;  Parallel Seq Scan on "Note"  (actual time=6.067..24.828 rows=3340 loops=3)
                    Filter: ("authorId" = 7)
                    Rows Removed by Filter: 163660
Execution Time: 28.618 ms</div>
<p>Read it from the inside out, because that is the order it runs:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Parallel Seq Scan</code></span><span class="v">PostgreSQL read <strong>the entire table</strong>, with two helper workers, to find rows for author 7.</span></div>
  <div class="kv"><span class="k"><code>Rows Removed by Filter: 163660</code></span><span class="v">Per worker. Roughly half a million rows were examined and thrown away.</span></div>
  <div class="kv"><span class="k"><code>Sort … top-N heapsort</code></span><span class="v">Everything that survived had to be sorted before the <code>LIMIT 20</code> could mean anything.</span></div>
  <div class="kv"><span class="k"><code>Buffers: hit=16136 read=14097</code></span><span class="v">30,233 8KB pages touched ≈ 236MB of table walked. <code>read</code> means it came from disk, not cache.</span></div>
  <div class="kv"><span class="k"><code>Execution Time: 28.618 ms</code></span><span class="v">The honest number — <code>cost</code> is the planner's guess, <code>actual time</code> is what happened.</span></div>
</div>
<div class="callout warn">28ms for twenty rows sounds survivable. It is not: this work is repeated for every request, it scales with the table, and it evicts other data from cache while it runs. Fifty requests per second means fifty full-table scans per second.</div>

<h3>The index, and the same query after</h3>
<p>Declare it in the schema — an index is part of your data model, not a production hotfix:</p>
<pre><code><span class="tok-keyword">model</span> Note {
  …
  @@index([authorId, createdAt(sort: Desc)])
}</code></pre>
<pre><code>npx prisma migrate dev --name index_note_author_created</code></pre>
<div class="out">-- CreateIndex
CREATE INDEX "Note_authorId_createdAt_idx" ON "Note"("authorId", "createdAt" DESC);</div>
<div class="out">Limit  (cost=0.42..69.59 rows=20) (actual time=0.098..0.112 rows=20 loops=1)
  Buffers: shared read=5
  -&gt;  Index Scan using "Note_authorId_createdAt_idx" on "Note"
        (actual time=0.098..0.109 rows=20 loops=1)
        Index Cond: ("authorId" = 7)
Execution Time: 0.129 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">28.618ms → 0.129ms</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">222× faster</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">30,233 pages → 5</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">no Sort node at all</span></div>
</div>
<p>The <code>Sort</code> disappeared, and that is the part people miss. Because the index stores <code>createdAt</code> in descending order <em>within</em> each <code>authorId</code>, the rows come out of the index already in the order you asked for; PostgreSQL walks five pages, takes twenty rows and stops. That is why the column order in <code>@@index([authorId, createdAt])</code> matters: equality column first, then the column you sort or range-scan on.</p>
<div class="callout ok"><strong>The rule of thumb that covers most real indexes:</strong> the columns you compare with <code>=</code>, then the column you <code>ORDER BY</code> or use with <code>&gt;</code>/<code>&lt;</code>, then anything you merely select. An index on <code>(createdAt, authorId)</code> would <em>not</em> have removed the sort here.</div>

<h3>Indexes are not free — the write tax, measured</h3>
<p>Inserting 50,000 rows into the same table with different numbers of indexes:</p>
<div class="out">2 indexes (pk + unique slug)                 336ms / 50k rows
3 indexes (+ authorId,createdAt)             382ms / 50k rows   (+14%)
6 indexes (+ title, pinned, updatedAt)       552ms / 50k rows   (+64%)</div>
<p>Every index is a second data structure the database maintains on every <code>INSERT</code>, <code>UPDATE</code> and <code>DELETE</code>. It costs disk too — the index size on this table went from 47MB to 62MB for one useful index. Three speculative indexes bought nothing and made writes 44% slower than the useful set.</p>
<div class="pitfall"><strong>"Add an index on every column that appears in a WHERE" is bad advice.</strong> Index what your slow queries actually use, verify with <code>EXPLAIN ANALYZE</code> that the plan changed, and delete indexes nothing uses — PostgreSQL will tell you which ones those are via <code>pg_stat_user_indexes.idx_scan</code>.</div>

<h3>Four ways an index quietly does nothing</h3>
<p>Same table, same 751,000 rows, four queries:</p>
<div class="out">WHERE slug = 'bulk-4242'          Index Scan            0.065 ms
WHERE lower(slug) = 'bulk-4242'   Parallel Seq Scan    71.771 ms
WHERE slug LIKE '%4242'           Parallel Seq Scan    35.947 ms
WHERE title = 'Ghi chú số 4242'   Parallel Seq Scan    31.801 ms  (no index on title)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A function around the column</span><span class="v"><code>lower(slug)</code> is not <code>slug</code>. The B-tree stores the raw value, so it cannot be used — <strong>1100× slower</strong>. Fix: store a normalised column, or create an expression index on <code>lower(slug)</code>.</span></div>
  <div class="kv"><span class="k">A leading wildcard</span><span class="v"><code>LIKE '%4242'</code> cannot use a B-tree — the index is sorted by prefix. <code>LIKE 'bulk%'</code> can. For "contains" search you want full-text search or a trigram index.</span></div>
  <div class="kv"><span class="k">A type mismatch</span><span class="v">Comparing a <code>text</code> column to a number, or an <code>int</code> column to a string, can force a cast that disables the index.</span></div>
  <div class="kv"><span class="k">Low selectivity</span><span class="v">An index on <code>pinned</code> (two possible values) is usually ignored: reading 40% of the table through an index is slower than reading it straight through.</span></div>
</div>
<div class="callout"><code>contains</code> in Prisma compiles to <code>LIKE '%…%'</code>, and <code>mode: 'insensitive'</code> compiles to <code>ILIKE</code> — both of them seq scans on a big table. That is fine for the 40-row Notes demo and wrong for a search box over a million rows; chapter 12 and PostgreSQL's own full-text search are the real answers.</div>

<h3>Counting is not free either</h3>
<div class="out">SELECT count(*) FROM "Note";     Parallel Seq Scan    40.018 ms   (751,000 rows)</div>
<p>PostgreSQL has no stored row count — <code>count(*)</code> reads the table (or a whole index) every time. A list endpoint that returns <code>{ items, total }</code> pays this on <em>every page request</em>. For large tables, either drop the exact total from the API contract or use the planner's estimate:</p>
<pre><code>SELECT reltuples::bigint AS approx
  FROM pg_class WHERE relname = 'Note';   <span class="tok-comment">-- microseconds, approximate</span></code></pre>

<h3>How to use this on your own code</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">find the slow query in the log</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">EXPLAIN (ANALYZE, BUFFERS) it</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">look for Seq Scan + Rows Removed</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">add the index, measure again</span></div>
</div>
<pre><code><span class="tok-comment">// get the SQL Prisma will send, without running it</span>
prisma.$<span class="tok-fn">on</span>(<span class="tok-string">'query'</span>, (e) =&gt; console.log(e.query, e.params));</code></pre>
<div class="callout warn"><code>EXPLAIN ANALYZE</code> <strong>runs</strong> the query — on an <code>UPDATE</code> or <code>DELETE</code> it really updates or deletes. Wrap those in <code>BEGIN; … ROLLBACK;</code>. Also measure against realistic data volumes: on 100 rows every plan looks the same, which is exactly why these problems ship.</div>
<div class="pitfall">A freshly loaded table has no statistics, and the planner guesses badly until it does. Run <code>ANALYZE "Note";</code> after a bulk import before you trust any plan — the numbers in this lesson were all taken after an explicit <code>ANALYZE</code>.</div>

<div class="note-ct">
  <strong>How cuongthai.com does it.</strong> Indexes here are declared in <code>schema.prisma</code> and shipped as migrations, never created by hand on the server — an index that exists only on production is drift, and lesson 7.2 showed where that leads. The lesson learned the hard way is the write side: adding indexes "just in case" to a table that the AI content jobs insert into by the thousand made those jobs measurably slower for no read benefit. The rule now is that an index arrives with the <code>EXPLAIN ANALYZE</code> output that justifies it, in the same pull request.
</div>

<a class="link-card codelab" href="/code-lab/postgresql${REF}#module-867" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 867 — Indexes &amp; Query Performance</span><span class="lc-sub">10 exercises on index types, planning and EXPLAIN.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Chỉ mục, và cách đọc EXPLAIN ANALYZE</h2>
<p class="lead">Mọi bảng trong bài này chứa 751.000 ghi chú — nhỏ so với chuẩn production, nhưng đủ lớn để khác biệt giữa một kế hoạch tốt và một kế hoạch tồi trở thành khác biệt giữa một API và một sự cố. Công cụ cho bạn thấy mình đang có cái nào là <code>EXPLAIN ANALYZE</code>, và nó là thứ hữu ích nhất trong cả chương này.</p>

<h3>Truy vấn, lúc chưa có chỉ mục</h3>
<p>"Hai mươi ghi chú mới nhất của một tác giả" — truy vấn bình thường nhất mà một API từng chạy:</p>
<pre><code>EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title FROM "Note"
WHERE "authorId" = 7
ORDER BY "createdAt" DESC
LIMIT 20;</code></pre>
<div class="out">Limit  (cost=33881.63..33883.97 rows=20) (actual time=26.855..28.594 rows=20 loops=1)
  Buffers: shared hit=16136 read=14097
  -&gt;  Gather Merge  (actual time=26.853..28.590 rows=20 loops=1)
        Workers Launched: 2
        -&gt;  Sort  (actual time=25.208..25.209 rows=20 loops=3)
              Sort Key: "createdAt" DESC
              Sort Method: top-N heapsort  Memory: 26kB
              -&gt;  Parallel Seq Scan on "Note"  (actual time=6.067..24.828 rows=3340 loops=3)
                    Filter: ("authorId" = 7)
                    Rows Removed by Filter: 163660
Execution Time: 28.618 ms</div>
<p>Hãy đọc từ trong ra ngoài, vì đó là thứ tự nó chạy:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Parallel Seq Scan</code></span><span class="v">PostgreSQL đã đọc <strong>toàn bộ bảng</strong>, có hai tiến trình phụ giúp sức, chỉ để tìm các dòng của tác giả số 7.</span></div>
  <div class="kv"><span class="k"><code>Rows Removed by Filter: 163660</code></span><span class="v">Tính trên mỗi worker. Tức là khoảng nửa triệu dòng đã bị xem xét rồi vứt đi.</span></div>
  <div class="kv"><span class="k"><code>Sort … top-N heapsort</code></span><span class="v">Tất cả những gì còn sống sót phải được sắp xếp thì <code>LIMIT 20</code> mới có ý nghĩa.</span></div>
  <div class="kv"><span class="k"><code>Buffers: hit=16136 read=14097</code></span><span class="v">30.233 trang 8KB bị chạm tới ≈ đi bộ qua 236MB dữ liệu bảng. <code>read</code> nghĩa là lấy từ đĩa chứ không phải từ cache.</span></div>
  <div class="kv"><span class="k"><code>Execution Time: 28.618 ms</code></span><span class="v">Con số trung thực — <code>cost</code> là phỏng đoán của bộ lập kế hoạch, <code>actual time</code> mới là điều đã xảy ra.</span></div>
</div>
<div class="callout warn">28ms cho hai mươi dòng nghe có vẻ sống được. Không đâu: khối việc này lặp lại ở mỗi request, nó phình theo kích thước bảng, và trong lúc chạy nó đẩy dữ liệu khác ra khỏi cache. Năm mươi request mỗi giây nghĩa là năm mươi lần quét toàn bảng mỗi giây.</div>

<h3>Chỉ mục, và cũng truy vấn đó sau khi có nó</h3>
<p>Hãy khai báo trong lược đồ — chỉ mục là một phần của mô hình dữ liệu, không phải bản vá nóng trên production:</p>
<pre><code><span class="tok-keyword">model</span> Note {
  …
  @@index([authorId, createdAt(sort: Desc)])
}</code></pre>
<pre><code>npx prisma migrate dev --name index_note_author_created</code></pre>
<div class="out">-- CreateIndex
CREATE INDEX "Note_authorId_createdAt_idx" ON "Note"("authorId", "createdAt" DESC);</div>
<div class="out">Limit  (cost=0.42..69.59 rows=20) (actual time=0.098..0.112 rows=20 loops=1)
  Buffers: shared read=5
  -&gt;  Index Scan using "Note_authorId_createdAt_idx" on "Note"
        (actual time=0.098..0.109 rows=20 loops=1)
        Index Cond: ("authorId" = 7)
Execution Time: 0.129 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">28,618ms → 0,129ms</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">nhanh hơn 222 lần</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">30.233 trang → 5 trang</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">biến mất hẳn bước Sort</span></div>
</div>
<p>Bước <code>Sort</code> đã biến mất, và đó mới là phần người ta hay bỏ sót. Vì chỉ mục lưu <code>createdAt</code> theo thứ tự giảm dần <em>bên trong</em> từng <code>authorId</code>, các dòng đi ra khỏi chỉ mục đã sẵn đúng thứ tự bạn yêu cầu; PostgreSQL đi qua năm trang, lấy hai mươi dòng rồi dừng. Đó là lý do thứ tự cột trong <code>@@index([authorId, createdAt])</code> rất quan trọng: cột so bằng đứng trước, rồi tới cột bạn sắp xếp hoặc quét theo khoảng.</p>
<div class="callout ok"><strong>Quy tắc ngón tay cái bao phủ hầu hết chỉ mục thực tế:</strong> các cột bạn so bằng <code>=</code> trước, rồi tới cột bạn <code>ORDER BY</code> hoặc dùng với <code>&gt;</code>/<code>&lt;</code>, rồi mới tới những cột chỉ để lấy ra. Một chỉ mục <code>(createdAt, authorId)</code> sẽ <em>không</em> loại bỏ được bước sắp xếp ở đây.</div>

<h3>Chỉ mục không miễn phí — thuế ghi, đo bằng số</h3>
<p>Chèn 50.000 dòng vào cùng một bảng với số lượng chỉ mục khác nhau:</p>
<div class="out">2 chỉ mục (pk + slug duy nhất)                336ms / 50k dòng
3 chỉ mục (+ authorId,createdAt)              382ms / 50k dòng   (+14%)
6 chỉ mục (+ title, pinned, updatedAt)        552ms / 50k dòng   (+64%)</div>
<p>Mỗi chỉ mục là một cấu trúc dữ liệu thứ hai mà cơ sở dữ liệu phải bảo trì ở mọi lệnh <code>INSERT</code>, <code>UPDATE</code> và <code>DELETE</code>. Nó cũng tốn đĩa — kích thước chỉ mục của bảng này tăng từ 47MB lên 62MB chỉ vì một chỉ mục hữu ích. Ba chỉ mục thêm vào theo cảm tính không mua được gì mà làm việc ghi chậm hơn 44% so với bộ chỉ mục hữu ích.</p>
<div class="pitfall"><strong>"Cứ đánh chỉ mục lên mọi cột xuất hiện trong WHERE" là lời khuyên tồi.</strong> Hãy đánh chỉ mục cho đúng những truy vấn chậm mà bạn thật sự có, xác minh bằng <code>EXPLAIN ANALYZE</code> rằng kế hoạch đã đổi, và xoá những chỉ mục không ai dùng — PostgreSQL sẽ chỉ cho bạn biết chúng là cái nào qua <code>pg_stat_user_indexes.idx_scan</code>.</div>

<h3>Bốn cách chỉ mục âm thầm trở nên vô dụng</h3>
<p>Cùng một bảng, cùng 751.000 dòng, bốn truy vấn:</p>
<div class="out">WHERE slug = 'bulk-4242'          Index Scan            0,065 ms
WHERE lower(slug) = 'bulk-4242'   Parallel Seq Scan    71,771 ms
WHERE slug LIKE '%4242'           Parallel Seq Scan    35,947 ms
WHERE title = 'Ghi chú số 4242'   Parallel Seq Scan    31,801 ms  (title không có chỉ mục)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Bọc một hàm quanh cột</span><span class="v"><code>lower(slug)</code> không phải là <code>slug</code>. Cây B-tree lưu giá trị thô nên không dùng được — <strong>chậm hơn 1100 lần</strong>. Cách sửa: lưu sẵn một cột đã chuẩn hoá, hoặc tạo chỉ mục biểu thức trên <code>lower(slug)</code>.</span></div>
  <div class="kv"><span class="k">Dấu sao ở đầu chuỗi</span><span class="v"><code>LIKE '%4242'</code> không dùng được B-tree — chỉ mục sắp xếp theo tiền tố. <code>LIKE 'bulk%'</code> thì dùng được. Muốn tìm kiếm kiểu "chứa" thì bạn cần full-text search hoặc chỉ mục trigram.</span></div>
  <div class="kv"><span class="k">Lệch kiểu dữ liệu</span><span class="v">So một cột <code>text</code> với một con số, hoặc cột <code>int</code> với một chuỗi, có thể sinh ra phép ép kiểu làm chỉ mục mất tác dụng.</span></div>
  <div class="kv"><span class="k">Độ chọn lọc thấp</span><span class="v">Chỉ mục trên <code>pinned</code> (chỉ hai giá trị) thường bị bỏ qua: đọc 40% số dòng qua chỉ mục còn chậm hơn đọc thẳng cả bảng.</span></div>
</div>
<div class="callout">Trong Prisma, <code>contains</code> biên dịch thành <code>LIKE '%…%'</code>, còn <code>mode: 'insensitive'</code> thành <code>ILIKE</code> — cả hai đều là quét tuần tự trên bảng lớn. Điều đó ổn với bản demo Notes 40 dòng và sai với một ô tìm kiếm trên một triệu dòng; chương 12 và full-text search của chính PostgreSQL mới là câu trả lời thật.</div>

<h3>Đếm cũng không miễn phí</h3>
<div class="out">SELECT count(*) FROM "Note";     Parallel Seq Scan    40,018 ms   (751.000 dòng)</div>
<p>PostgreSQL không lưu sẵn số dòng — <code>count(*)</code> đọc cả bảng (hoặc cả một chỉ mục) mỗi lần. Một endpoint danh sách trả về <code>{ items, total }</code> phải trả cái giá này ở <em>mỗi lần lật trang</em>. Với bảng lớn, hoặc là bỏ con số tổng chính xác khỏi hợp đồng API, hoặc dùng ước lượng của bộ lập kế hoạch:</p>
<pre><code>SELECT reltuples::bigint AS approx
  FROM pg_class WHERE relname = 'Note';   <span class="tok-comment">-- vài micro-giây, gần đúng</span></code></pre>

<h3>Dùng thứ này lên code của chính bạn thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">tìm truy vấn chậm trong log</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">chạy EXPLAIN (ANALYZE, BUFFERS)</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">soi Seq Scan + Rows Removed</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">thêm chỉ mục, đo lại</span></div>
</div>
<pre><code><span class="tok-comment">// lấy chính câu SQL mà Prisma sẽ gửi, không cần chạy nó</span>
prisma.$<span class="tok-fn">on</span>(<span class="tok-string">'query'</span>, (e) =&gt; console.log(e.query, e.params));</code></pre>
<div class="callout warn"><code>EXPLAIN ANALYZE</code> <strong>có chạy thật</strong> truy vấn — với <code>UPDATE</code> hay <code>DELETE</code> thì nó cập nhật hoặc xoá thật. Hãy bọc những câu đó trong <code>BEGIN; … ROLLBACK;</code>. Và hãy đo trên lượng dữ liệu sát thực tế: với 100 dòng thì kế hoạch nào trông cũng như nhau, và đó chính xác là lý do những vấn đề này lọt lên production.</div>
<div class="pitfall">Một bảng vừa nạp dữ liệu xong thì chưa có thống kê, và bộ lập kế hoạch sẽ đoán rất tệ cho tới khi có. Hãy chạy <code>ANALYZE "Note";</code> sau khi nhập hàng loạt rồi mới tin bất kỳ kế hoạch nào — mọi con số trong bài này đều được lấy sau một lệnh <code>ANALYZE</code> tường minh.</div>

<div class="note-ct">
  <strong>cuongthai.com làm thế nào.</strong> Chỉ mục ở đây được khai báo trong <code>schema.prisma</code> và đi ra dưới dạng migration, không bao giờ tạo tay trên máy chủ — một chỉ mục chỉ tồn tại trên production chính là drift, và bài 7.2 đã cho thấy nó dẫn tới đâu. Bài học phải trả giá là ở phía ghi: thêm chỉ mục "phòng khi cần" vào một bảng mà các job AI chèn vào hàng nghìn dòng đã làm những job đó chậm đi thấy rõ mà chẳng lợi gì cho việc đọc. Quy tắc bây giờ là một chỉ mục phải đi kèm kết quả <code>EXPLAIN ANALYZE</code> chứng minh cho nó, trong cùng một pull request.
</div>

<a class="link-card codelab" href="/code-lab/postgresql${REF}#module-867" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 867 — Indexes &amp; Query Performance</span><span class="lc-sub">10 bài tập về loại chỉ mục, lập kế hoạch và EXPLAIN.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 7.6 ─────────────────────────── */
    {
      title: '7.6 — Keeping the chapter-6 contract with a real database|||7.6 — Giữ hợp đồng của chương 6 khi đã có cơ sở dữ liệu thật',
      slug: 'nodejs-7-6-hop-dong-api-voi-du-lieu-that',
      type: 'VIDEO',
      description: 'Con trỏ phân trang trên 751.000 dòng, P2002 thành 409, chống ghi đè bằng cột version, và vì sao $queryRawUnsafe làm lộ cả bảng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.6</span>
<h2>Keeping the chapter-6 contract with a real database</h2>
<p class="lead">Chapter 6 designed an API: paginate, return 409 on conflict, refuse a stale update. All of that was hand-waved against a <code>Map</code>. This lesson implements every promise against 751,000 real rows — and each one turns out to be a two-line change with a large number attached.</p>

<h3>Pagination: the numbers that decide the design</h3>
<p>Same table, same 20 rows per page, median of seven runs through Prisma:</p>
<div class="out">skip: 0,      take: 20               1.0ms
skip: 100000, take: 20              11.7ms
skip: 700000, take: 20             108.6ms
where id &gt; cursor, take: 20          0.6ms
count(*) over the whole table       41.7ms</div>
<p><code>OFFSET</code> is not a jump — the database produces every skipped row and throws it away. Page 35,000 costs 108ms of work to return twenty rows, and page 1 costs 1ms, which is why "the app gets slower the deeper you scroll" is a real, reproducible complaint. Cursor pagination reads from the index at the position you name and stops after twenty:</p>
<pre><code><span class="tok-comment">// page 1</span>
<span class="tok-keyword">const</span> page = <span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findMany</span>({
  where: { authorId }, orderBy: { id: <span class="tok-string">'desc'</span> }, take: <span class="tok-number">20</span>,
});
<span class="tok-keyword">const</span> nextCursor = page.length === <span class="tok-number">20</span> ? page[<span class="tok-number">19</span>].id : <span class="tok-keyword">null</span>;

<span class="tok-comment">// next page — the client sends the cursor back</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findMany</span>({
  where: { authorId, id: { lt: cursor } },
  orderBy: { id: <span class="tok-string">'desc'</span> }, take: <span class="tok-number">20</span>,
});</code></pre>
<div class="out">deep offset : 108.6ms      cursor : 0.6ms      → 181× faster</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Prisma's <code>cursor</code> option</span><span class="v"><code>cursor: { id }, skip: 1</code> is the same idea with nicer syntax; the explicit <code>where: { id: { lt: cursor } }</code> is easier to reason about and to index.</span></div>
  <div class="kv"><span class="k">Sorting by something not unique</span><span class="v">Ordering by <code>createdAt</code> alone breaks with ties. Order by <code>[createdAt desc, id desc]</code> and make the cursor carry both values.</span></div>
  <div class="kv"><span class="k">Offset is still fine</span><span class="v">Admin tables with page numbers, small result sets, anything under a few thousand rows. Use the right one, not the fashionable one.</span></div>
  <div class="kv"><span class="k">Drop the total</span><span class="v">If you keep <code>total</code>, you pay the 41.7ms <code>count(*)</code> on every page. <code>hasMore: boolean</code> costs nothing.</span></div>
</div>
<div class="callout ok">Chapter 6 proved the correctness argument on the same data: with offset, a row inserted between two page requests shifts the window and the client sees the same record twice. A cursor is a position in the data, not a position in a result set, so an insert cannot shift it.</div>

<h3>Unique violations become 409, not 500</h3>
<p>Two users register with the same email, or two requests race to create the same slug. The database is the only place that can decide, and it answers with an error you can catch:</p>
<pre><code><span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">create</span>({ data: { slug: <span class="tok-string">'bulk-1'</span>, … } });   <span class="tok-comment">// slug already exists</span></code></pre>
<div class="out">code       : P2002
message    : Unique constraint failed on the fields: (\`slug\`)
class      : PrismaClientKnownRequestError
meta       : { modelName: "Note", driverAdapterError: { cause: {
               originalCode: "23505",
               originalMessage: "duplicate key value violates unique constraint \\"Note_slug_key\\"",
               constraint: { fields: ["slug"] } } } }</div>
<pre><code><span class="tok-comment">// translate once, in the service layer</span>
<span class="tok-keyword">try</span> {
  <span class="tok-keyword">return await</span> prisma.note.<span class="tok-fn">create</span>({ data });
} <span class="tok-keyword">catch</span> (err) {
  <span class="tok-keyword">if</span> (err.code === <span class="tok-string">'P2002'</span>) {
    <span class="tok-keyword">const</span> fields = err.meta?.driverAdapterError?.cause?.constraint?.fields ?? [];
    <span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">409</span>, <span class="tok-string">'DUPLICATE'</span>, \`\${fields.<span class="tok-fn">join</span>(<span class="tok-string">', '</span>)} already exists\`);
  }
  <span class="tok-keyword">throw</span> err;
}</code></pre>
<div class="pitfall">Older tutorials read the field list from <code>err.meta.target</code>. In Prisma 7 with a driver adapter that property is <strong>undefined</strong> — the constraint details moved under <code>meta.driverAdapterError.cause.constraint.fields</code>. Log the whole <code>err.meta</code> once in development rather than trusting a blog post, and always keep a fallback: the message string always names the field.</div>
<div class="callout warn"><strong>Do not "check then insert".</strong> <code>findUnique</code> followed by <code>create</code> has a gap between the two queries, and two concurrent requests both find nothing and both insert. Let the unique index be the referee and catch P2002 — that is the only version that is correct under concurrency. Chapter 6's status-code table already told you which code to send; now you know where the error comes from.</div>

<h3>The lost update, and the version column that stops it</h3>
<p>Chapter 6 reproduced this bug with a <code>Map</code>: A and B both open note 42, A saves a new title, B saves a full object built from what they loaded — and A's change is gone with no error anywhere. The fix is one integer column and one <code>where</code> clause:</p>
<pre><code><span class="tok-keyword">const</span> updated = <span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">updateMany</span>({
  where: { id, version: clientVersion },              <span class="tok-comment">// only if nothing changed</span>
  data: { ...patch, version: { increment: <span class="tok-number">1</span> } },
});
<span class="tok-keyword">if</span> (updated.count === <span class="tok-number">0</span>)
  <span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">409</span>, <span class="tok-string">'STALE_VERSION'</span>,
    <span class="tok-string">'Someone else edited this note. Reload and try again.'</span>);</code></pre>
<p>Both writers loaded version 1. Run in sequence, as two users would:</p>
<div class="out">created note id=1251006 version=1
A writes with version=1 -&gt; 1 row updated  (success)
B writes with version=1 -&gt; 0 rows updated (blocked -&gt; API returns 409)
final state: body="A sửa" version=2   &lt;- A's change was NOT lost</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">both read version 1</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">A writes → version becomes 2</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">B's WHERE matches nothing</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">count 0 → 409, B reloads</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Why <code>updateMany</code></span><span class="v"><code>update</code> only accepts a unique key in <code>where</code>. <code>updateMany</code> accepts any filter and returns a count — the count <em>is</em> the concurrency check.</span></div>
  <div class="kv"><span class="k">Optimistic</span><span class="v">Nobody is blocked, nothing is locked; the loser simply loses and is told. Perfect for HTTP, where "hold a lock while a human types" is not an option.</span></div>
  <div class="kv"><span class="k">Same shape as ETag</span><span class="v">Lesson 6.5's <code>If-Match</code> + <code>412</code> is this exact mechanism at the HTTP layer. Version column = server side, ETag = wire format.</span></div>
  <div class="kv"><span class="k">Pessimistic locking</span><span class="v">When you truly must serialise (stock levels, seat booking), PostgreSQL has <code>SELECT … FOR UPDATE</code> inside a transaction. Use it narrowly and briefly.</span></div>
</div>

<h3>Raw SQL, and the one line that leaks the table</h3>
<p>Prisma covers most needs, but sometimes you want SQL. There are two ways, and the difference is not stylistic. The variable below is what an attacker types into a search box:</p>
<pre><code><span class="tok-keyword">const</span> evil = <span class="tok-string">"bulk-1' OR '1'='1"</span>;

<span class="tok-comment">// A: string concatenation</span>
<span class="tok-keyword">await</span> prisma.$<span class="tok-fn">queryRawUnsafe</span>(
  \`SELECT count(*)::int AS n FROM "Note" WHERE slug = '\${evil}'\`);

<span class="tok-comment">// B: tagged template — the value travels as a parameter</span>
<span class="tok-keyword">await</span> prisma.$queryRaw\`SELECT count(*)::int AS n FROM "Note" WHERE slug = \${evil}\`;

<span class="tok-comment">// C: the normal Prisma API</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">count</span>({ where: { slug: evil } });</code></pre>
<div class="out">A. $queryRawUnsafe + concatenation -&gt; 751002 rows
B. $queryRaw (tagged template)     -&gt; 0 rows
C. prisma.note.count({ where })    -&gt; 0 rows</div>
<div class="callout danger">A returned the entire table. The quote closed the string, <code>OR '1'='1'</code> made the condition always true, and the database did exactly what it was told. Nothing about A looks alarming in a diff — it is a template literal, the same thing you write a hundred times a day. Chapter 9 goes further into injection; the habit to build now is simply: <strong>values never go into SQL text.</strong> <code>$queryRaw</code> as a tagged template is safe because Prisma turns every <code>\${…}</code> into a bound parameter. <code>$queryRawUnsafe</code> is named that way for a reason.</div>
<div class="pitfall">Raw queries also skip Prisma's type mapping. <code>SELECT count(*)</code> comes back as a JavaScript <code>BigInt</code> and <code>JSON.stringify</code> throws "Do not know how to serialize a BigInt" — cast in SQL (<code>count(*)::int</code>) or convert in JS. And <code>SELECT pg_sleep(0.1)</code> fails outright with <code>UnsupportedNativeDataType: void</code>; write <code>SELECT 1 FROM pg_sleep(0.1)</code>. Both of these cost real minutes the first time.</div>

<h3>The final shape of the list endpoint</h3>
<pre><code><span class="tok-keyword">export async function</span> <span class="tok-fn">list</span>({ cursor, limit = <span class="tok-number">20</span>, authorId }) {
  <span class="tok-keyword">const</span> take = Math.<span class="tok-fn">min</span>(limit, <span class="tok-number">50</span>);
  <span class="tok-keyword">const</span> items = <span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findMany</span>({
    where: { authorId, ...(cursor ? { id: { lt: cursor } } : {}) },
    orderBy: { id: <span class="tok-string">'desc'</span> },
    take: take + <span class="tok-number">1</span>,                      <span class="tok-comment">// one extra row answers "is there more?"</span>
    omit: { body: <span class="tok-keyword">true</span> },                 <span class="tok-comment">// lesson 7.4: 322KB -&gt; 50KB</span>
  });
  <span class="tok-keyword">const</span> hasMore = items.length &gt; take;
  <span class="tok-keyword">if</span> (hasMore) items.<span class="tok-fn">pop</span>();
  <span class="tok-keyword">return</span> { items, nextCursor: hasMore ? items.<span class="tok-fn">at</span>(-<span class="tok-number">1</span>).id : <span class="tok-keyword">null</span> };
}</code></pre>
<p>Take one more row than you need, and the extra row tells you whether a next page exists — no <code>count(*)</code>, no second query, no 41.7ms per request. Every decision in that function came from a measurement in this chapter.</p>

<div class="note-ct">
  <strong>How cuongthai.com does it.</strong> The feed and the messenger are cursor-paginated for exactly the reason measured above — an offset feed gets slower for the users who read the most, and it duplicates posts whenever someone publishes while you scroll. Unique-violation handling shows up in registration and in the Pro activation codes: the <code>P2002</code> path returns a clear 409 with the conflicting field instead of a 500. And the site keeps one hard rule about raw SQL — parameters only, never interpolation — after a review found string-built SQL in an internal admin script that would have been an injection hole the day it grew a query parameter.
</div>

<a class="link-card codelab" href="/code-lab/prisma-orm${REF}#module-432" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 432 — Query Filtering and Pagination</span><span class="lc-sub">10 exercises on filters, cursors and page windows.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.6</span>
<h2>Giữ hợp đồng của chương 6 khi đã có cơ sở dữ liệu thật</h2>
<p class="lead">Chương 6 đã thiết kế một API: phân trang, trả 409 khi xung đột, từ chối bản cập nhật đã cũ. Tất cả những điều đó mới chỉ nói suông trên một cái <code>Map</code>. Bài này hiện thực hoá từng lời hứa trên 751.000 dòng dữ liệu thật — và mỗi lời hứa hoá ra chỉ là thay đổi hai dòng, kèm một con số rất lớn.</p>

<h3>Phân trang: những con số quyết định thiết kế</h3>
<p>Cùng một bảng, cùng 20 dòng mỗi trang, lấy trung vị của bảy lần chạy qua Prisma:</p>
<div class="out">skip: 0,      take: 20               1,0ms
skip: 100000, take: 20              11,7ms
skip: 700000, take: 20             108,6ms
where id &gt; con trỏ, take: 20         0,6ms
count(*) toàn bảng                  41,7ms</div>
<p><code>OFFSET</code> không phải là một cú nhảy — cơ sở dữ liệu vẫn sinh ra mọi dòng bị bỏ qua rồi vứt đi. Trang thứ 35.000 tốn 108ms công việc để trả về hai mươi dòng, còn trang 1 tốn 1ms, và đó là lý do "ứng dụng càng cuộn sâu càng chậm" là một lời phàn nàn có thật, tái hiện được. Phân trang bằng con trỏ đọc từ chỉ mục ngay tại vị trí bạn chỉ ra rồi dừng sau hai mươi dòng:</p>
<pre><code><span class="tok-comment">// trang 1</span>
<span class="tok-keyword">const</span> page = <span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findMany</span>({
  where: { authorId }, orderBy: { id: <span class="tok-string">'desc'</span> }, take: <span class="tok-number">20</span>,
});
<span class="tok-keyword">const</span> nextCursor = page.length === <span class="tok-number">20</span> ? page[<span class="tok-number">19</span>].id : <span class="tok-keyword">null</span>;

<span class="tok-comment">// trang kế — client gửi con trỏ trở lại</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findMany</span>({
  where: { authorId, id: { lt: cursor } },
  orderBy: { id: <span class="tok-string">'desc'</span> }, take: <span class="tok-number">20</span>,
});</code></pre>
<div class="out">offset sâu : 108,6ms      con trỏ : 0,6ms      → nhanh hơn 181 lần</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tuỳ chọn <code>cursor</code> của Prisma</span><span class="v"><code>cursor: { id }, skip: 1</code> là cùng ý tưởng với cú pháp gọn hơn; viết tường minh <code>where: { id: { lt: cursor } }</code> thì dễ suy luận và dễ đánh chỉ mục hơn.</span></div>
  <div class="kv"><span class="k">Sắp xếp theo cột không duy nhất</span><span class="v">Sắp theo mỗi <code>createdAt</code> sẽ vỡ khi có giá trị trùng. Hãy sắp theo <code>[createdAt desc, id desc]</code> và cho con trỏ mang cả hai giá trị.</span></div>
  <div class="kv"><span class="k">Offset vẫn ổn</span><span class="v">Bảng quản trị có số trang, tập kết quả nhỏ, mọi thứ dưới vài nghìn dòng. Hãy dùng cái đúng, không phải cái đang thời thượng.</span></div>
  <div class="kv"><span class="k">Bỏ con số tổng đi</span><span class="v">Nếu giữ <code>total</code>, bạn trả 41,7ms cho <code>count(*)</code> ở mọi trang. <code>hasMore: boolean</code> thì không tốn gì.</span></div>
</div>
<div class="callout ok">Chương 6 đã chứng minh phần lập luận về tính đúng đắn trên cùng dữ liệu này: với offset, một dòng được chèn vào giữa hai lần lật trang sẽ làm cửa sổ dịch đi và client nhìn thấy cùng một bản ghi hai lần. Con trỏ là một vị trí trong dữ liệu, không phải vị trí trong một tập kết quả, nên một lệnh chèn không thể làm nó dịch đi.</div>

<h3>Vi phạm ràng buộc duy nhất thành 409, không phải 500</h3>
<p>Hai người dùng đăng ký cùng một email, hoặc hai request đua nhau tạo cùng một slug. Cơ sở dữ liệu là nơi duy nhất phán xử được, và nó trả lời bằng một lỗi bạn bắt được:</p>
<pre><code><span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">create</span>({ data: { slug: <span class="tok-string">'bulk-1'</span>, … } });   <span class="tok-comment">// slug đã tồn tại</span></code></pre>
<div class="out">code       : P2002
message    : Unique constraint failed on the fields: (\`slug\`)
lớp lỗi    : PrismaClientKnownRequestError
meta       : { modelName: "Note", driverAdapterError: { cause: {
               originalCode: "23505",
               originalMessage: "duplicate key value violates unique constraint \\"Note_slug_key\\"",
               constraint: { fields: ["slug"] } } } }</div>
<pre><code><span class="tok-comment">// dịch một lần, ở tầng service</span>
<span class="tok-keyword">try</span> {
  <span class="tok-keyword">return await</span> prisma.note.<span class="tok-fn">create</span>({ data });
} <span class="tok-keyword">catch</span> (err) {
  <span class="tok-keyword">if</span> (err.code === <span class="tok-string">'P2002'</span>) {
    <span class="tok-keyword">const</span> fields = err.meta?.driverAdapterError?.cause?.constraint?.fields ?? [];
    <span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">409</span>, <span class="tok-string">'DUPLICATE'</span>, \`\${fields.<span class="tok-fn">join</span>(<span class="tok-string">', '</span>)} đã tồn tại\`);
  }
  <span class="tok-keyword">throw</span> err;
}</code></pre>
<div class="pitfall">Các bài hướng dẫn cũ đọc danh sách trường từ <code>err.meta.target</code>. Với Prisma 7 dùng driver adapter, thuộc tính đó là <strong>undefined</strong> — chi tiết ràng buộc đã chuyển xuống <code>meta.driverAdapterError.cause.constraint.fields</code>. Hãy log nguyên <code>err.meta</code> một lần khi dev thay vì tin một bài blog, và luôn giữ phương án dự phòng: chuỗi message bao giờ cũng nêu tên trường.</div>
<div class="callout warn"><strong>Đừng "kiểm tra rồi chèn".</strong> <code>findUnique</code> rồi mới <code>create</code> có một khe hở giữa hai truy vấn, và hai request đồng thời sẽ cùng thấy trống rồi cùng chèn. Hãy để chỉ mục duy nhất làm trọng tài và bắt lỗi P2002 — đó là phiên bản duy nhất đúng khi có tương tranh. Bảng mã trạng thái của chương 6 đã cho bạn biết nên trả mã nào; giờ bạn biết lỗi đó từ đâu ra.</div>

<h3>Mất bản cập nhật, và cột version chặn đứng nó</h3>
<p>Chương 6 đã tái hiện con bug này bằng <code>Map</code>: A và B cùng mở ghi chú 42, A lưu tiêu đề mới, B lưu nguyên một object dựng từ dữ liệu họ đã tải về — và thay đổi của A biến mất mà chẳng có lỗi nào ở đâu cả. Cách sửa là một cột số nguyên và một mệnh đề <code>where</code>:</p>
<pre><code><span class="tok-keyword">const</span> updated = <span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">updateMany</span>({
  where: { id, version: clientVersion },              <span class="tok-comment">// chỉ khi chưa ai đổi</span>
  data: { ...patch, version: { increment: <span class="tok-number">1</span> } },
});
<span class="tok-keyword">if</span> (updated.count === <span class="tok-number">0</span>)
  <span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">409</span>, <span class="tok-string">'STALE_VERSION'</span>,
    <span class="tok-string">'Người khác vừa sửa ghi chú này. Hãy tải lại rồi thử lại.'</span>);</code></pre>
<p>Cả hai người ghi đều đã tải về version 1. Chạy tuần tự, đúng như hai người dùng thật:</p>
<div class="out">tạo note id=1251006 version=1
A ghi với version=1 -&gt; 1 dòng bị sửa  (thành công)
B ghi với version=1 -&gt; 0 dòng bị sửa  (bị chặn -&gt; API trả 409)
trạng thái cuối: body="A sửa" version=2   &lt;- thay đổi của A KHÔNG bị mất</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">cả hai đọc version 1</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">A ghi → version thành 2</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">WHERE của B không khớp gì</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">count 0 → 409, B tải lại</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao dùng <code>updateMany</code></span><span class="v"><code>update</code> chỉ nhận khoá duy nhất trong <code>where</code>. <code>updateMany</code> nhận mọi bộ lọc và trả về một con số đếm — con số đó <em>chính là</em> phép kiểm tra tương tranh.</span></div>
  <div class="kv"><span class="k">Lạc quan (optimistic)</span><span class="v">Không ai bị chặn, không gì bị khoá; người thua đơn giản là thua và được báo. Rất hợp với HTTP, nơi "giữ khoá trong lúc con người gõ phím" là chuyện không thể.</span></div>
  <div class="kv"><span class="k">Cùng hình dạng với ETag</span><span class="v"><code>If-Match</code> + <code>412</code> ở bài 6.5 chính là cơ chế này nhưng ở tầng HTTP. Cột version = phía máy chủ, ETag = định dạng trên đường truyền.</span></div>
  <div class="kv"><span class="k">Khoá bi quan</span><span class="v">Khi bạn thật sự phải xếp hàng tuần tự (số lượng tồn kho, đặt chỗ ngồi), PostgreSQL có <code>SELECT … FOR UPDATE</code> bên trong transaction. Hãy dùng hẹp và ngắn.</span></div>
</div>

<h3>SQL thô, và một dòng làm lộ cả bảng</h3>
<p>Prisma phủ được hầu hết nhu cầu, nhưng đôi khi bạn muốn viết SQL. Có hai cách, và khác biệt giữa chúng không phải chuyện thẩm mỹ. Biến bên dưới là thứ kẻ tấn công gõ vào ô tìm kiếm:</p>
<pre><code><span class="tok-keyword">const</span> evil = <span class="tok-string">"bulk-1' OR '1'='1"</span>;

<span class="tok-comment">// A: nối chuỗi</span>
<span class="tok-keyword">await</span> prisma.$<span class="tok-fn">queryRawUnsafe</span>(
  \`SELECT count(*)::int AS n FROM "Note" WHERE slug = '\${evil}'\`);

<span class="tok-comment">// B: tagged template — giá trị đi theo đường tham số</span>
<span class="tok-keyword">await</span> prisma.$queryRaw\`SELECT count(*)::int AS n FROM "Note" WHERE slug = \${evil}\`;

<span class="tok-comment">// C: API bình thường của Prisma</span>
<span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">count</span>({ where: { slug: evil } });</code></pre>
<div class="out">A. $queryRawUnsafe + nối chuỗi -&gt; 751002 dòng
B. $queryRaw (tagged template) -&gt; 0 dòng
C. prisma.note.count({ where }) -&gt; 0 dòng</div>
<div class="callout danger">A đã trả về nguyên cả bảng. Dấu nháy đóng chuỗi lại, <code>OR '1'='1'</code> làm điều kiện luôn đúng, và cơ sở dữ liệu đã làm đúng thứ nó được bảo. Chẳng có gì ở A trông đáng báo động trong một bản diff — nó là một template literal, đúng thứ bạn viết cả trăm lần mỗi ngày. Chương 9 sẽ đi sâu hơn về tấn công tiêm nhiễm; thói quen cần dựng từ bây giờ đơn giản là: <strong>giá trị không bao giờ đi vào phần văn bản của câu SQL.</strong> <code>$queryRaw</code> ở dạng tagged template thì an toàn vì Prisma biến mọi <code>\${…}</code> thành tham số ràng buộc. <code>$queryRawUnsafe</code> được đặt tên như vậy là có lý do.</div>
<div class="pitfall">Truy vấn thô cũng bỏ qua phép ánh xạ kiểu của Prisma. <code>SELECT count(*)</code> trả về một <code>BigInt</code> của JavaScript và <code>JSON.stringify</code> sẽ ném "Do not know how to serialize a BigInt" — hãy ép kiểu ngay trong SQL (<code>count(*)::int</code>) hoặc chuyển đổi trong JS. Và <code>SELECT pg_sleep(0.1)</code> thì hỏng thẳng với <code>UnsupportedNativeDataType: void</code>; phải viết <code>SELECT 1 FROM pg_sleep(0.1)</code>. Cả hai cái này đều ngốn của bạn vài phút thật sự trong lần đầu gặp.</div>

<h3>Hình dạng cuối cùng của endpoint danh sách</h3>
<pre><code><span class="tok-keyword">export async function</span> <span class="tok-fn">list</span>({ cursor, limit = <span class="tok-number">20</span>, authorId }) {
  <span class="tok-keyword">const</span> take = Math.<span class="tok-fn">min</span>(limit, <span class="tok-number">50</span>);
  <span class="tok-keyword">const</span> items = <span class="tok-keyword">await</span> prisma.note.<span class="tok-fn">findMany</span>({
    where: { authorId, ...(cursor ? { id: { lt: cursor } } : {}) },
    orderBy: { id: <span class="tok-string">'desc'</span> },
    take: take + <span class="tok-number">1</span>,                      <span class="tok-comment">// lấy dư 1 dòng để biết "còn nữa không"</span>
    omit: { body: <span class="tok-keyword">true</span> },                 <span class="tok-comment">// bài 7.4: 322KB -&gt; 50KB</span>
  });
  <span class="tok-keyword">const</span> hasMore = items.length &gt; take;
  <span class="tok-keyword">if</span> (hasMore) items.<span class="tok-fn">pop</span>();
  <span class="tok-keyword">return</span> { items, nextCursor: hasMore ? items.<span class="tok-fn">at</span>(-<span class="tok-number">1</span>).id : <span class="tok-keyword">null</span> };
}</code></pre>
<p>Lấy dư một dòng so với nhu cầu, và chính dòng dư đó cho bạn biết có trang kế hay không — không cần <code>count(*)</code>, không cần truy vấn thứ hai, không mất 41,7ms mỗi request. Mọi quyết định trong hàm đó đều đến từ một phép đo trong chương này.</p>

<div class="note-ct">
  <strong>cuongthai.com làm thế nào.</strong> Bảng tin và messenger đều phân trang bằng con trỏ đúng vì lý do vừa đo ở trên — bảng tin dùng offset sẽ chậm dần với chính những người đọc nhiều nhất, và nó lặp lại bài viết mỗi khi có ai đăng bài trong lúc bạn đang cuộn. Xử lý vi phạm ràng buộc duy nhất xuất hiện ở phần đăng ký và ở mã kích hoạt Pro: nhánh <code>P2002</code> trả về 409 rõ ràng kèm tên trường xung đột thay vì một cú 500. Và trang này giữ một quy tắc cứng về SQL thô — chỉ dùng tham số, không bao giờ nội suy chuỗi — sau khi một lần review phát hiện SQL dựng bằng nối chuỗi trong một script quản trị nội bộ, thứ sẽ thành lỗ hổng tiêm nhiễm ngay ngày nó mọc thêm một tham số truy vấn.
</div>

<a class="link-card codelab" href="/code-lab/prisma-orm${REF}#module-432" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 432 — Query Filtering and Pagination</span><span class="lc-sub">10 bài tập về bộ lọc, con trỏ và cửa sổ trang.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 7.7 ─────────────────────────── */
    {
      title: '7.7 — Chapter 7 quiz|||7.7 — Kiểm tra chương 7',
      slug: 'nodejs-7-7-quiz',
      type: 'QUIZ',
      description: 'Tám câu về pool, migration, transaction, N+1, chỉ mục và tương tranh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question below has a measurement behind it somewhere in this chapter. If one feels like a guess, the number that settles it is in lesson 7.1 to 7.6 — go and read the output block, not the prose.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mỗi câu dưới đây đều có một phép đo đứng sau, nằm đâu đó trong chương này. Nếu câu nào bạn thấy như đang đoán, con số phân định nó nằm ở bài 7.1 tới 7.6 — hãy quay lại đọc khối kết quả, đừng đọc phần văn xuôi.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Fifty SELECT 1 queries took 402ms with a new connection each time and 19ms on one reused connection. What does the extra ~7.6ms per query pay for?|||Năm mươi truy vấn SELECT 1 mất 402ms khi mỗi lần mở kết nối mới và 19ms khi dùng lại một kết nối. Khoảng ~7,6ms dôi ra ở mỗi truy vấn trả tiền cho việc gì?',
            options: [
              'Parsing and planning the SQL statement|||Phân tích và lập kế hoạch cho câu lệnh SQL',
              'The TCP handshake, authentication and PostgreSQL forking a backend process|||Bắt tay TCP, xác thực và việc PostgreSQL sinh ra một tiến trình backend',
              'Writing the result to the write-ahead log|||Ghi kết quả vào nhật ký write-ahead log',
              'Converting the rows into JavaScript objects|||Chuyển các dòng dữ liệu thành object JavaScript',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your API runs 3 containers. Each creates 4 PrismaClient instances with a pool of 10. PostgreSQL has max_connections = 100. What happens?|||API của bạn chạy 3 container. Mỗi container tạo 4 instance PrismaClient với pool 10. PostgreSQL có max_connections = 100. Chuyện gì xảy ra?',
            options: [
              'Nothing — Prisma shares one pool across instances|||Không sao — Prisma dùng chung một pool cho mọi instance',
              'Queries get slower but still succeed|||Truy vấn chậm đi nhưng vẫn chạy được',
              '120 connections are requested; once the limit is hit every query fails with 53300 "too many clients already"|||120 kết nối bị yêu cầu; khi chạm trần thì mọi truy vấn hỏng với lỗi 53300 "too many clients already"',
              'PostgreSQL queues the extra connections until slots free up|||PostgreSQL cho các kết nối thừa xếp hàng cho tới khi có chỗ trống',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A migration failed on production with P3018 and every later deploy now reports P3009. What is the correct FIRST step?|||Một migration hỏng trên production với lỗi P3018 và mọi lần deploy sau đó báo P3009. Bước ĐẦU TIÊN đúng đắn là gì?',
            options: [
              'Run prisma migrate resolve --applied to unblock deploys|||Chạy prisma migrate resolve --applied để thông đường deploy',
              'Run prisma migrate reset so the history is clean again|||Chạy prisma migrate reset cho lịch sử sạch trở lại',
              'Check how much of the migration actually applied — the database columns and the _prisma_migrations row — before deciding anything|||Kiểm tra migration đã áp được bao nhiêu — các cột trong CSDL và dòng trong _prisma_migrations — trước khi quyết định bất cứ điều gì',
              'Edit the failed migration.sql to use CREATE TABLE IF NOT EXISTS and redeploy|||Sửa file migration.sql hỏng thành CREATE TABLE IF NOT EXISTS rồi deploy lại',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Adding a required column to a table that already has rows keeps failing with "column contains null values". Which migration shape is safe?|||Thêm một cột bắt buộc vào bảng đã có dữ liệu cứ hỏng với lỗi "column contains null values". Hình dạng migration nào là an toàn?',
            options: [
              'Add the column as nullable, backfill it with UPDATE, then SET NOT NULL|||Thêm cột cho phép NULL, điền dữ liệu bằng UPDATE, rồi mới SET NOT NULL',
              'Delete the existing rows first, then add the column|||Xoá các dòng đang có trước, rồi mới thêm cột',
              'Add the column with prisma db push instead of a migration|||Thêm cột bằng prisma db push thay vì bằng migration',
              'Wrap the ALTER TABLE in a transaction|||Bọc câu ALTER TABLE trong một transaction',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Inside prisma.$transaction(async (tx) => { … }) you call prisma.note.create(...) instead of tx.note.create(...). What happens?|||Bên trong prisma.$transaction(async (tx) => { … }) bạn gọi prisma.note.create(...) thay vì tx.note.create(...). Chuyện gì xảy ra?',
            options: [
              'Prisma throws an error telling you to use tx|||Prisma ném lỗi bảo bạn phải dùng tx',
              'It works identically — tx and prisma are the same object|||Vẫn chạy y hệt — tx và prisma là cùng một object',
              'That write runs on its own connection, commits independently, and will not roll back with the others|||Lệnh ghi đó chạy trên kết nối riêng, commit độc lập, và sẽ không cuộn ngược cùng những cái khác',
              'The transaction times out immediately|||Transaction hết hạn ngay lập tức',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Fetching 50 users and their notes: a loop took 79ms with 51 SQL queries, include took 14ms with 2. Why does the gap get much worse in production?|||Lấy 50 người dùng cùng ghi chú của họ: vòng lặp mất 79ms với 51 truy vấn SQL, include mất 14ms với 2. Vì sao khoảng cách đó tệ hơn nhiều trên production?',
            options: [
              'Production databases have more indexes|||Cơ sở dữ liệu production có nhiều chỉ mục hơn',
              'Each query pays a network round trip, so 51 round trips grow much faster than 2 as latency rises|||Mỗi truy vấn phải trả một lượt đi về qua mạng, nên 51 lượt phình nhanh hơn 2 lượt rất nhiều khi độ trễ tăng',
              'Prisma caches include results but not loop results|||Prisma cache kết quả của include nhưng không cache kết quả của vòng lặp',
              'The loop opens a new connection for every iteration|||Vòng lặp mở một kết nối mới ở mỗi vòng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'On 751,000 rows, WHERE "authorId" = 7 ORDER BY "createdAt" DESC LIMIT 20 went from 28.6ms to 0.129ms after adding an index. Which index was it, and why that order?|||Trên 751.000 dòng, câu WHERE "authorId" = 7 ORDER BY "createdAt" DESC LIMIT 20 đi từ 28,6ms xuống 0,129ms sau khi thêm chỉ mục. Đó là chỉ mục nào, và vì sao thứ tự cột như vậy?',
            options: [
              '(createdAt, authorId) — the sort column must come first|||(createdAt, authorId) — cột dùng để sắp xếp phải đứng trước',
              '(authorId, createdAt DESC) — equality column first, then the sort column, so the rows leave the index already ordered|||(authorId, createdAt DESC) — cột so bằng trước, rồi tới cột sắp xếp, để các dòng ra khỏi chỉ mục là đã đúng thứ tự',
              'One index on authorId and a separate one on createdAt|||Một chỉ mục trên authorId và một chỉ mục riêng trên createdAt',
              '(id, authorId) — the primary key must lead every index|||(id, authorId) — khoá chính phải đứng đầu mọi chỉ mục',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two users load note 42 (version 1) and both save. The service runs updateMany({ where: { id, version: 1 }, data: { …, version: { increment: 1 } } }). What does the second writer get?|||Hai người dùng cùng mở ghi chú 42 (version 1) rồi cùng lưu. Service chạy updateMany({ where: { id, version: 1 }, data: { …, version: { increment: 1 } } }). Người ghi thứ hai nhận được gì?',
            options: [
              'count: 1 — their write overwrites the first one|||count: 1 — bản ghi của họ đè lên bản của người thứ nhất',
              'A P2002 unique constraint error|||Lỗi P2002 vi phạm ràng buộc duy nhất',
              'count: 0, because version is now 2 — the service turns that into 409 and the first writer keeps their change|||count: 0, vì version giờ là 2 — service biến nó thành 409 và thay đổi của người thứ nhất được giữ lại',
              'The request blocks until the first transaction commits|||Request bị chặn cho tới khi transaction thứ nhất commit',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
  ],
};
