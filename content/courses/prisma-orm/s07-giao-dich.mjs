/**
 * Prisma ORM — Chương 7: Giao dịch và tranh chấp.
 * Hai dạng $transaction · mức cô lập · bốn cuộc đua · khoá · timeout và thử lại · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 7 — Transactions and concurrency|||Chương 7 — Giao dịch và tranh chấp',
  description: 'Hai dạng $transaction và cái nào giữ kết nối, bốn mức cô lập dựng lại bằng hai client chạy thật, bốn kiểu tranh chấp kinh điển cùng cách chặn từng cái, khoá bi quan với khoá lạc quan với advisory lock, và timeout — con số mặc định 5 giây đã giết nhiều lần nhập dữ liệu.',
  lessons: [
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — Two kinds of `$transaction`|||7.1 — Hai dạng `$transaction`',
      slug: 'pr-7-1-hai-dang',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dạng mảng so với dạng tương tác: cái nào chạy được, cái nào giữ một kết nối suốt thời gian bạn nghĩ, ghi lồng nhau vốn đã là giao dịch, và ba lỗi làm cạn connection pool trong một phút.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Two kinds of <code>$transaction</code></h2>
<p class="lead">Prisma has two transaction APIs that look similar and behave very differently. One takes an array and is essentially free; the other takes a callback, holds a connection open for as long as your code runs inside it, and is the fastest way to exhaust a connection pool. Choosing between them is the whole of this lesson.</p>

<h3>The array form — sequential operations</h3>
<pre><code>const [nguoiDung, baiViet, donHang] = await prisma.$transaction([
  prisma.user.count(),
  prisma.post.count({ where: { published: true } }),
  prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
]);</code></pre>
<div class="out">prisma:query BEGIN
prisma:query SELECT COUNT(*) FROM "users"
prisma:query SELECT COUNT(*) FROM "posts" WHERE "published" = $1
prisma:query SELECT "status", COUNT(*) FROM "orders" GROUP BY "status"
prisma:query COMMIT</div>
<div class="kv-grid">
  <div class="kv"><span class="k">All or nothing</span><span class="v">One <code>BEGIN</code>, one <code>COMMIT</code>. Any failure rolls back everything, and the promise rejects with the original error.</span></div>
  <div class="kv"><span class="k">One consistent snapshot</span><span class="v">Every query sees the same view of the database, so three counts cannot disagree because a row was inserted between the second and the third. This alone makes it worth using for dashboards.</span></div>
  <div class="kv"><span class="k">One round trip's worth of latency</span><span class="v">The queries are sent together rather than awaited one at a time. Lesson 5.4 measured this at nearly five times faster for six dashboard queries.</span></div>
  <div class="kv"><span class="k">No logic between the steps</span><span class="v">This is the limitation. You cannot use the result of query one to decide query two, because all of them are built before any of them runs. If you need that, you need the other form.</span></div>
</div>

<h3>The interactive form — a callback</h3>
<pre><code>const kq = await prisma.$transaction(async (tx) =&gt; {
  <span class="tok-comment">// 1 — read</span>
  const tk = await tx.taiKhoan.findUniqueOrThrow({ where: { id: tuId } });

  <span class="tok-comment">// 2 — decide, in JavaScript, with the value we just read</span>
  if (tk.soDu.lessThan(soTien)) throw new Error('So du khong du');

  <span class="tok-comment">// 3 — write, twice</span>
  await tx.taiKhoan.update({ where: { id: tuId },  data: { soDu: { decrement: soTien } } });
  await tx.taiKhoan.update({ where: { id: denId }, data: { soDu: { increment: soTien } } });

  <span class="tok-comment">// 4 — and record it</span>
  return tx.giaoDich.create({ data: { tuId, denId, soTien } });
});</code></pre>
<div class="out">prisma:query BEGIN
prisma:query SELECT ... FROM "tai_khoan" WHERE "id" = $1 LIMIT $2
prisma:query UPDATE "tai_khoan" SET "so_du" = "tai_khoan"."so_du" - $1 WHERE "id" = $2
prisma:query UPDATE "tai_khoan" SET "so_du" = "tai_khoan"."so_du" + $1 WHERE "id" = $2
prisma:query INSERT INTO "giao_dich" ("tu_id","den_id","so_tien") VALUES ($1,$2,$3) RETURNING ...
prisma:query COMMIT</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Use <code>tx</code>, never <code>prisma</code></span><span class="lz-t">Inside the callback</span><span class="lz-d">A call on <code>prisma</code> inside the callback runs on a <em>different connection, outside the transaction</em>. It will not see the uncommitted writes, it will not be rolled back, and nothing warns you. This is the single most common bug in interactive transactions.</span></div>
  <div class="lz-step"><span class="lz-k">Throw to roll back</span><span class="lz-t">Any thrown error</span><span class="lz-d">Rolls back and rejects the outer promise. Returning a value commits. There is no explicit <code>rollback()</code>; the exception is the mechanism.</span></div>
  <div class="lz-step"><span class="lz-k">It holds a connection</span><span class="lz-t">For the entire callback</span><span class="lz-d">One of your pool's connections is unavailable to everyone else from <code>BEGIN</code> to <code>COMMIT</code> — including while your JavaScript is doing something that is not a query.</span></div>
  <div class="lz-step"><span class="lz-k">And it has a deadline</span><span class="lz-t">5 seconds by default</span><span class="lz-d">Exceed it and Prisma rolls back with <code>P2028</code>. Lesson 7.5 covers the two timeouts and when to raise them.</span></div>
</div>

<h3>The <code>tx</code> mistake, shown</h3>
<pre><code>await prisma.$transaction(async (tx) =&gt; {
  await tx.user.update({ where: { id: 1 }, data: { email: 'moi@x.com' } });

  <span class="tok-comment">// WRONG — a different connection. Reads the OLD value.</span>
  const u1 = await prisma.user.findUniqueOrThrow({ where: { id: 1 } });

  <span class="tok-comment">// RIGHT — same connection, same transaction. Reads the new value.</span>
  const u2 = await tx.user.findUniqueOrThrow({ where: { id: 1 } });

  console.log('prisma:', u1.email, '| tx:', u2.email);
});</code></pre>
<div class="out">prisma: cu@x.com | tx: moi@x.com</div>
<div class="pitfall">
<p><strong>Trap — and it gets worse than a stale read.</strong> If your pool has one free connection and the transaction is holding it, that <code>prisma.user.findUnique</code> waits for a connection that will not be released until the transaction ends — and the transaction cannot end until the query returns. That is a self-deadlock: the request hangs until <code>pool_timeout</code> fires with <code>P2024</code>. It happens on a busy server and never on your laptop, which is the worst possible failure profile. Never reference the outer client inside the callback; pass <code>tx</code> into any helper the callback calls.</p>
</div>
<pre><code><span class="tok-comment">// Type a helper so it accepts either client and cannot be called wrongly</span>
type TxClient = Omit&lt;PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'&gt;;

async function ghiNhatKy(db: TxClient, hanhDong: string, nguoiDungId: number) {
  return db.auditLog.create({ data: { hanhDong, nguoiDungId } });
}

await prisma.$transaction(async (tx) =&gt; {
  await tx.post.delete({ where: { id: 42 } });
  await ghiNhatKy(tx, 'XOA_BAI', currentUserId);    <span class="tok-comment">// same transaction</span>
});</code></pre>

<h3>Nested writes are already a transaction</h3>
<pre><code><span class="tok-comment">// This needs no $transaction — it is one already</span>
await prisma.user.create({
  data: {
    email: 'an@example.com',
    profile: { create: { bio: 'Xin chao' } },
    posts:   { create: [{ title: 'A' }, { title: 'B' }] },
  },
});</code></pre>
<div class="out">BEGIN
INSERT INTO "users" ... RETURNING "id"
INSERT INTO "profiles" ...
INSERT INTO "posts" ... VALUES ($1,$2),($3,$4)
COMMIT</div>
<div class="callout ok">
<p><strong>Reach for a transaction only when a nested write cannot express what you need.</strong> Every nested write, every <code>updateMany</code>, every single <code>update</code> with an atomic operator is already atomic. The three cases that genuinely need an explicit transaction are: operations across models that are not related, a decision in JavaScript between a read and a write, and a guard that spans more than one table. Everything else is a transaction you do not have to hold open.</p>
</div>

<h3>Choosing, in one table</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nothing — a single call</span><span class="lz-lnote">One <code>create</code> with nested writes, one <code>update</code> with <code>increment</code>, one <code>updateMany</code> with the precondition in the <code>where</code>. Atomic already, holds no connection longer than one statement.</span></div>
  <div class="lz-layer"><span class="lz-lname">Array <code>$transaction</code></span><span class="lz-lnote">Several independent operations that must all succeed, or several reads that must see one snapshot. No logic between them. Cheap — use it freely.</span></div>
  <div class="lz-layer"><span class="lz-lname">Interactive <code>$transaction</code></span><span class="lz-lnote">A read, a decision in JavaScript, then writes that depend on it. Genuinely necessary for transfers, inventory checks, anything with a guard. Holds a connection — keep the callback short.</span></div>
  <div class="lz-layer"><span class="lz-lname">Raw SQL in a transaction</span><span class="lz-lnote"><code>tx.$executeRaw</code> inside an interactive transaction, for <code>SELECT … FOR UPDATE</code> and advisory locks. Lesson 7.4.</span></div>
</div>

<h3>The three ways to exhaust the pool</h3>
<pre><code><span class="tok-comment">// 1 — an HTTP call inside the transaction</span>
await prisma.$transaction(async (tx) =&gt; {
  const don = await tx.donHang.create({ data: { … } });
  const kq  = await fetch('https://cong-thanh-toan/charge', { … });   <span class="tok-comment">// 2 seconds!</span>
  await tx.donHang.update({ where: { id: don.id }, data: { maGiaoDich: kq.id } });
});</code></pre>
<div class="out">-- 10 concurrent orders, pool of 10, payment gateway at 2s each
PrismaClientKnownRequestError: Timed out fetching a new connection from the connection pool.
(Current connection pool timeout: 10, connection limit: 10)
  code: 'P2024'</div>
<pre><code><span class="tok-comment">// The fix: the external call happens OUTSIDE, between two short transactions</span>
const don = await prisma.donHang.create({ data: { …, trangThai: 'CHO_THANH_TOAN' } });
const kq  = await fetch('https://cong-thanh-toan/charge', { … });     <span class="tok-comment">// no connection held</span>
await prisma.donHang.update({
  where: { id: don.id },
  data:  { maGiaoDich: kq.id, trangThai: 'DA_THANH_TOAN' },
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">2 — a loop inside the transaction</span><span class="v">A thousand <code>tx.post.update</code> calls is a thousand round trips holding one connection. Batch them: build the array and pass it to the array form, or use <code>updateMany</code>.</span></div>
  <div class="kv"><span class="k">3 — a transaction per item in a <code>Promise.all</code></span><span class="v">Fifty concurrent interactive transactions on a pool of ten means forty of them queue. Process in chunks sized to the pool, not all at once.</span></div>
  <div class="kv"><span class="k">The rule</span><span class="v">A transaction should contain database work and nothing else. No HTTP, no file I/O, no <code>await</code> on anything that is not a query. If the callback contains a call you cannot see the SQL for, it does not belong there.</span></div>
</div>
<div class="callout warn">
<p><strong>The order matters more than it looks.</strong> Creating the order first and charging second means a failed charge leaves an order in <code>CHO_THANH_TOAN</code> — recoverable, visible, and cleanable by a scheduled job. Charging first and recording second means a successful charge with no record of it if the process dies in between, which is money taken for nothing. Neither is atomic; the difference is which failure you can recover from. When a transaction is impossible, the design question becomes "which inconsistency can I clean up afterwards", and that is a question worth answering deliberately.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions" target="_blank" rel="noopener"><span class="lc-ico">🔁</span><span class="lc-body"><span class="lc-title">Transactions and batch queries</span><span class="lc-sub">prisma.io/docs · Both forms, nested writes, and the decision tree between them</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions" target="_blank" rel="noopener"><span class="lc-ico">🤝</span><span class="lc-body"><span class="lc-title">Interactive transactions</span><span class="lc-sub">prisma.io/docs · The <code>tx</code> client, the timeouts, and the connection it holds</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p2024" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P2024 — pool timeout</span><span class="lc-sub">prisma.io/docs · What it means, and why it is almost never a slow database</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, transactions chapter</span><span class="lc-sub">BEGIN, COMMIT, MVCC and what a connection actually holds while a transaction is open</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Exhaust a pool with a transaction holding an HTTP call, then restructure it so it cannot happen</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Hai dạng <code>$transaction</code></h2>
<p class="lead">Prisma có hai API giao dịch trông giống nhau và cư xử rất khác nhau. Một cái nhận một mảng và gần như miễn phí; cái kia nhận một callback, giữ một kết nối mở suốt thời gian mã của bạn chạy bên trong, và là cách nhanh nhất để vét cạn connection pool. Chọn giữa hai cái đó là toàn bộ bài này.</p>

<h3>Dạng mảng — các thao tác tuần tự</h3>
<pre><code>const [nguoiDung, baiViet, donHang] = await prisma.$transaction([
  prisma.user.count(),
  prisma.post.count({ where: { published: true } }),
  prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
]);</code></pre>
<div class="out">prisma:query BEGIN
prisma:query SELECT COUNT(*) FROM "users"
prisma:query SELECT COUNT(*) FROM "posts" WHERE "published" = $1
prisma:query SELECT "status", COUNT(*) FROM "orders" GROUP BY "status"
prisma:query COMMIT</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Được tất hoặc không gì cả</span><span class="v">Một <code>BEGIN</code>, một <code>COMMIT</code>. Bất kỳ lỗi nào cũng làm quay lui tất cả, và promise bị từ chối với đúng lỗi gốc.</span></div>
  <div class="kv"><span class="k">Một bản chụp nhất quán</span><span class="v">Mọi câu truy vấn nhìn cùng một góc nhìn của cơ sở dữ liệu, nên ba con số đếm không thể lệch nhau chỉ vì có hàng được chèn vào giữa câu thứ hai và thứ ba. Riêng điều đó đã đủ để dùng nó cho bảng điều khiển.</span></div>
  <div class="kv"><span class="k">Chỉ tốn độ trễ của một lượt đi về</span><span class="v">Các câu truy vấn được gửi cùng nhau chứ không await từng cái. Bài 5.4 đo được nhanh gần gấp năm lần cho sáu truy vấn bảng điều khiển.</span></div>
  <div class="kv"><span class="k">Không có logic giữa các bước</span><span class="v">Đây là hạn chế. Bạn không dùng kết quả của câu một để quyết câu hai được, vì tất cả đều đã được dựng xong trước khi bất cứ cái nào chạy. Cần điều đó thì bạn cần dạng còn lại.</span></div>
</div>

<h3>Dạng tương tác — một callback</h3>
<pre><code>const kq = await prisma.$transaction(async (tx) =&gt; {
  <span class="tok-comment">// 1 — đọc</span>
  const tk = await tx.taiKhoan.findUniqueOrThrow({ where: { id: tuId } });

  <span class="tok-comment">// 2 — quyết, bằng JavaScript, với giá trị vừa đọc được</span>
  if (tk.soDu.lessThan(soTien)) throw new Error('So du khong du');

  <span class="tok-comment">// 3 — ghi, hai lần</span>
  await tx.taiKhoan.update({ where: { id: tuId },  data: { soDu: { decrement: soTien } } });
  await tx.taiKhoan.update({ where: { id: denId }, data: { soDu: { increment: soTien } } });

  <span class="tok-comment">// 4 — và ghi nhận lại</span>
  return tx.giaoDich.create({ data: { tuId, denId, soTien } });
});</code></pre>
<div class="out">prisma:query BEGIN
prisma:query SELECT ... FROM "tai_khoan" WHERE "id" = $1 LIMIT $2
prisma:query UPDATE "tai_khoan" SET "so_du" = "tai_khoan"."so_du" - $1 WHERE "id" = $2
prisma:query UPDATE "tai_khoan" SET "so_du" = "tai_khoan"."so_du" + $1 WHERE "id" = $2
prisma:query INSERT INTO "giao_dich" ("tu_id","den_id","so_tien") VALUES ($1,$2,$3) RETURNING ...
prisma:query COMMIT</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Dùng <code>tx</code>, đừng bao giờ dùng <code>prisma</code></span><span class="lz-t">Bên trong callback</span><span class="lz-d">Một lời gọi trên <code>prisma</code> bên trong callback chạy trên <em>một kết nối khác, ngoài giao dịch</em>. Nó không nhìn thấy các lần ghi chưa commit, nó không bị quay lui, và không có gì cảnh báo bạn. Đây là con bọ phổ biến nhất của giao dịch tương tác.</span></div>
  <div class="lz-step"><span class="lz-k">Ném lỗi để quay lui</span><span class="lz-t">Bất kỳ lỗi nào được ném ra</span><span class="lz-d">Làm quay lui và từ chối promise bên ngoài. Trả về một giá trị thì commit. Không có <code>rollback()</code> tường minh; ngoại lệ chính là cơ chế.</span></div>
  <div class="lz-step"><span class="lz-k">Nó giữ một kết nối</span><span class="lz-t">Suốt cả callback</span><span class="lz-d">Một trong các kết nối của pool không dùng được cho ai khác từ <code>BEGIN</code> tới <code>COMMIT</code> — kể cả trong lúc JavaScript của bạn đang làm một việc không phải truy vấn.</span></div>
  <div class="lz-step"><span class="lz-k">Và nó có hạn chót</span><span class="lz-t">Mặc định 5 giây</span><span class="lz-d">Quá hạn thì Prisma quay lui với <code>P2028</code>. Bài 7.5 nói về hai cái timeout và khi nào nên nâng chúng.</span></div>
</div>

<h3>Cái lỗi <code>tx</code>, nhìn tận mắt</h3>
<pre><code>await prisma.$transaction(async (tx) =&gt; {
  await tx.user.update({ where: { id: 1 }, data: { email: 'moi@x.com' } });

  <span class="tok-comment">// SAI — một kết nối khác. Đọc ra giá trị CŨ.</span>
  const u1 = await prisma.user.findUniqueOrThrow({ where: { id: 1 } });

  <span class="tok-comment">// ĐÚNG — cùng kết nối, cùng giao dịch. Đọc ra giá trị mới.</span>
  const u2 = await tx.user.findUniqueOrThrow({ where: { id: 1 } });

  console.log('prisma:', u1.email, '| tx:', u2.email);
});</code></pre>
<div class="out">prisma: cu@x.com | tx: moi@x.com</div>
<div class="pitfall">
<p><strong>Bẫy — và nó còn tệ hơn một lần đọc dữ liệu cũ.</strong> Nếu pool của bạn còn đúng một kết nối rỗi và giao dịch đang giữ nó, thì lời gọi <code>prisma.user.findUnique</code> kia sẽ đợi một kết nối chỉ được nhả ra khi giao dịch kết thúc — mà giao dịch thì không kết thúc được cho tới khi câu truy vấn trả về. Đó là tự khoá chết: yêu cầu treo cho tới khi <code>pool_timeout</code> nổ với <code>P2024</code>. Nó xảy ra trên một máy chủ bận và không bao giờ xảy ra trên laptop của bạn, tức kiểu hỏng tệ nhất có thể. Đừng bao giờ nhắc tới client bên ngoài bên trong callback; hãy truyền <code>tx</code> vào mọi hàm phụ mà callback gọi.</p>
</div>
<pre><code><span class="tok-comment">// Gán kiểu cho hàm phụ để nó nhận được cả hai client và không thể gọi sai</span>
type TxClient = Omit&lt;PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'&gt;;

async function ghiNhatKy(db: TxClient, hanhDong: string, nguoiDungId: number) {
  return db.auditLog.create({ data: { hanhDong, nguoiDungId } });
}

await prisma.$transaction(async (tx) =&gt; {
  await tx.post.delete({ where: { id: 42 } });
  await ghiNhatKy(tx, 'XOA_BAI', currentUserId);    <span class="tok-comment">// cùng một giao dịch</span>
});</code></pre>

<h3>Ghi lồng nhau vốn đã là một giao dịch</h3>
<pre><code><span class="tok-comment">// Cái này không cần $transaction — bản thân nó đã là một giao dịch</span>
await prisma.user.create({
  data: {
    email: 'an@example.com',
    profile: { create: { bio: 'Xin chao' } },
    posts:   { create: [{ title: 'A' }, { title: 'B' }] },
  },
});</code></pre>
<div class="out">BEGIN
INSERT INTO "users" ... RETURNING "id"
INSERT INTO "profiles" ...
INSERT INTO "posts" ... VALUES ($1,$2),($3,$4)
COMMIT</div>
<div class="callout ok">
<p><strong>Chỉ với tay tới một giao dịch khi ghi lồng nhau diễn đạt không nổi thứ bạn cần.</strong> Mọi lần ghi lồng nhau, mọi <code>updateMany</code>, mọi <code>update</code> đơn lẻ có toán tử nguyên tử đều vốn đã nguyên tử. Ba trường hợp thật sự cần một giao dịch tường minh là: các thao tác trên những model không có quan hệ với nhau, một quyết định bằng JavaScript nằm giữa một lần đọc và một lần ghi, và một hàng rào trải qua nhiều hơn một bảng. Mọi thứ còn lại là một giao dịch mà bạn không phải giữ mở.</p>
</div>

<h3>Chọn thế nào, gói trong một bảng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Không dùng gì — một lời gọi đơn</span><span class="lz-lnote">Một <code>create</code> có ghi lồng nhau, một <code>update</code> có <code>increment</code>, một <code>updateMany</code> có tiền điều kiện đặt trong <code>where</code>. Vốn đã nguyên tử, và không giữ kết nối lâu hơn một câu lệnh.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dạng mảng <code>$transaction</code></span><span class="lz-lnote">Vài thao tác độc lập buộc phải cùng thành công, hoặc vài lần đọc buộc phải nhìn cùng một bản chụp. Không có logic ở giữa. Rẻ — cứ dùng thoải mái.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dạng tương tác <code>$transaction</code></span><span class="lz-lnote">Một lần đọc, một quyết định bằng JavaScript, rồi các lần ghi phụ thuộc vào nó. Thật sự cần thiết cho chuyển khoản, kiểm tồn kho, mọi thứ có hàng rào. Nó giữ một kết nối — hãy để callback ngắn.</span></div>
  <div class="lz-layer"><span class="lz-lname">SQL thô bên trong một giao dịch</span><span class="lz-lnote"><code>tx.$executeRaw</code> bên trong một giao dịch tương tác, cho <code>SELECT … FOR UPDATE</code> và advisory lock. Bài 7.4.</span></div>
</div>

<h3>Ba cách vét cạn pool</h3>
<pre><code><span class="tok-comment">// 1 — một lời gọi HTTP nằm bên trong giao dịch</span>
await prisma.$transaction(async (tx) =&gt; {
  const don = await tx.donHang.create({ data: { … } });
  const kq  = await fetch('https://cong-thanh-toan/charge', { … });   <span class="tok-comment">// 2 giây!</span>
  await tx.donHang.update({ where: { id: don.id }, data: { maGiaoDich: kq.id } });
});</code></pre>
<div class="out">-- 10 đơn hàng song song, pool 10 kết nối, cổng thanh toán 2 giây mỗi lượt
PrismaClientKnownRequestError: Timed out fetching a new connection from the connection pool.
(Current connection pool timeout: 10, connection limit: 10)
  code: 'P2024'</div>
<pre><code><span class="tok-comment">// Cách vá: lời gọi ra ngoài xảy ra BÊN NGOÀI, giữa hai giao dịch ngắn</span>
const don = await prisma.donHang.create({ data: { …, trangThai: 'CHO_THANH_TOAN' } });
const kq  = await fetch('https://cong-thanh-toan/charge', { … });     <span class="tok-comment">// không giữ kết nối nào</span>
await prisma.donHang.update({
  where: { id: don.id },
  data:  { maGiaoDich: kq.id, trangThai: 'DA_THANH_TOAN' },
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">2 — một vòng lặp nằm bên trong giao dịch</span><span class="v">Một nghìn lời gọi <code>tx.post.update</code> là một nghìn lượt đi về trong khi giữ một kết nối. Hãy gom lô: dựng cái mảng rồi truyền vào dạng mảng, hoặc dùng <code>updateMany</code>.</span></div>
  <div class="kv"><span class="k">3 — mỗi phần tử một giao dịch trong một <code>Promise.all</code></span><span class="v">Năm mươi giao dịch tương tác song song trên một pool mười kết nối nghĩa là bốn mươi cái phải xếp hàng. Hãy xử lý theo cụm cỡ bằng pool, đừng đổ hết một lúc.</span></div>
  <div class="kv"><span class="k">Luật</span><span class="v">Một giao dịch nên chứa công việc cơ sở dữ liệu và không chứa gì khác. Không HTTP, không đọc ghi tệp, không <code>await</code> lên thứ gì không phải một câu truy vấn. Nếu callback chứa một lời gọi mà bạn không nhìn thấy SQL của nó thì nó không thuộc về đó.</span></div>
</div>
<div class="callout warn">
<p><strong>Thứ tự quan trọng hơn vẻ ngoài của nó.</strong> Tạo đơn trước rồi thu tiền sau nghĩa là một lần thu tiền hỏng để lại một đơn ở trạng thái <code>CHO_THANH_TOAN</code> — cứu vãn được, nhìn thấy được, và dọn được bằng một tác vụ theo lịch. Thu tiền trước rồi ghi nhận sau nghĩa là một lần thu tiền thành công mà không có bản ghi nào nếu tiến trình chết ở giữa, tức là tiền lấy của người ta mà không đổi lại gì. Không cách nào nguyên tử; khác biệt nằm ở chỗ bạn cứu vãn được kiểu hỏng nào. Khi một giao dịch là bất khả thì câu hỏi thiết kế trở thành "tôi dọn được kiểu bất nhất nào sau đó", và đó là câu hỏi đáng trả lời một cách có chủ ý.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions" target="_blank" rel="noopener"><span class="lc-ico">🔁</span><span class="lc-body"><span class="lc-title">Transactions and batch queries</span><span class="lc-sub">prisma.io/docs · Cả hai dạng, ghi lồng nhau, và cây quyết định giữa chúng</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions" target="_blank" rel="noopener"><span class="lc-ico">🤝</span><span class="lc-body"><span class="lc-title">Interactive transactions</span><span class="lc-sub">prisma.io/docs · Client <code>tx</code>, các timeout, và cái kết nối nó giữ</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p2024" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P2024 — timeout của pool</span><span class="lc-sub">prisma.io/docs · Nó nghĩa là gì, và vì sao nó hầu như không bao giờ là chuyện cơ sở dữ liệu chậm</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương giao dịch</span><span class="lc-sub">BEGIN, COMMIT, MVCC và một kết nối thật sự giữ những gì trong lúc một giao dịch còn mở</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Vét cạn một pool bằng một giao dịch có lời gọi HTTP, rồi tái cấu trúc để chuyện đó không xảy ra được</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Isolation levels, demonstrated|||7.2 — Mức cô lập, dựng lại tận mắt',
      slug: 'pr-7-2-muc-co-lap',
      type: 'LESSON',
      description: 'Bốn mức cô lập và ba hiện tượng chúng chặn, dựng lại bằng hai phiên chạy song song thật, Read Committed mặc định để lọt cái gì, Serializable trả giá bằng lỗi 40001, và cách chọn theo bài toán chứ không theo cảm giác an toàn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Isolation levels, demonstrated</h2>
<p class="lead">An isolation level is a promise about what one transaction can see while another is running. PostgreSQL offers three usable ones, the default is weaker than most people assume, and the strongest one does not remove failures — it converts them into a specific error you must be prepared to retry. All of it is easier to believe when you watch it happen in two terminals.</p>

<h3>Setting it</h3>
<pre><code>await prisma.$transaction(
  async (tx) =&gt; { /* … */ },
  { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
);

<span class="tok-comment">// Also available on the array form</span>
await prisma.$transaction([ /* … */ ], {
  isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
});</code></pre>
<div class="out">prisma:query BEGIN ISOLATION LEVEL SERIALIZABLE
prisma:query SELECT ...
prisma:query COMMIT</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The default is the database's default</span><span class="v">Omit it and you get whatever the database is configured for — <code>READ COMMITTED</code> on PostgreSQL and MySQL's <code>REPEATABLE READ</code>. Prisma does not impose one of its own.</span></div>
  <div class="kv"><span class="k">PostgreSQL has three, not four</span><span class="v"><code>READ UNCOMMITTED</code> is accepted and silently behaves as <code>READ COMMITTED</code>. There are no dirty reads in PostgreSQL at any level.</span></div>
  <div class="kv"><span class="k">It applies to the whole transaction</span><span class="v">Set at <code>BEGIN</code> and unchangeable afterwards. A single query outside a transaction is its own implicit transaction at the default level.</span></div>
</div>

<h3>The three phenomena, in two terminals</h3>
<pre><code><span class="tok-comment">-- Terminal A                          -- Terminal B</span>
BEGIN;                                 <span class="tok-comment">-- (nothing yet)</span>
SELECT so_du FROM tai_khoan WHERE id=1;
<span class="tok-comment">--  so_du: 1000</span>
                                       UPDATE tai_khoan SET so_du=2000 WHERE id=1;
                                       <span class="tok-comment">-- committed</span>
SELECT so_du FROM tai_khoan WHERE id=1;
<span class="tok-comment">--  READ COMMITTED  → 2000  ← non-repeatable read</span>
<span class="tok-comment">--  REPEATABLE READ → 1000</span>
COMMIT;</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Dirty read — reading uncommitted data</span><span class="lz-lnote">Prevented at every level in PostgreSQL. You will never see a value another transaction has not committed. This one you can stop worrying about.</span></div>
  <div class="lz-layer"><span class="lz-lname">Non-repeatable read — the same row changes under you</span><span class="lz-lnote">Allowed by <code>READ COMMITTED</code>. Two <code>SELECT</code>s of the same row inside one transaction can return different values. Matters when you read a balance, compute with it, and read it again.</span></div>
  <div class="lz-layer"><span class="lz-lname">Phantom read — the same query returns different rows</span><span class="lz-lnote">Allowed by <code>READ COMMITTED</code>. <code>SELECT count(*) WHERE status='MOI'</code> twice can return 4 then 5. Matters for "no more than N of these may exist" rules.</span></div>
  <div class="lz-layer"><span class="lz-lname">Write skew — two transactions each valid, together invalid</span><span class="lz-lnote">Allowed even by <code>REPEATABLE READ</code>. Only <code>SERIALIZABLE</code> prevents it, and it is the one people do not know exists — see below.</span></div>
</div>

<h3><code>READ COMMITTED</code>: what the default lets through</h3>
<pre><code><span class="tok-comment">// Rule: at most 2 admins. Two requests promote two different users at once.</span>
async function thangCap(userId: number) {
  return prisma.$transaction(async (tx) =&gt; {
    const soAdmin = await tx.user.count({ where: { role: 'ADMIN' } });
    if (soAdmin &gt;= 2) throw new Error('Da du 2 admin');
    return tx.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
  });
}

await Promise.all([thangCap(10), thangCap(11)]);
console.log('admin:', await prisma.user.count({ where: { role: 'ADMIN' } }));</code></pre>
<div class="out">admin: 3</div>
<div class="pitfall">
<p><strong>Trap — both transactions counted 1, both decided "there is room", both wrote.</strong> Neither did anything wrong on its own; the rule was violated by the pair. <code>READ COMMITTED</code> permits this because the <code>count</code> in transaction A never saw transaction B's uncommitted insert, and nothing forced them to conflict. This is <em>write skew</em>, and it is the reason "I read it and checked" is not a guarantee. Two ways to fix it, in the next two sections.</p>
</div>

<h3><code>SERIALIZABLE</code>: the guarantee, and its price</h3>
<pre><code>async function thangCap(userId: number) {
  return prisma.$transaction(
    async (tx) =&gt; {
      const soAdmin = await tx.user.count({ where: { role: 'ADMIN' } });
      if (soAdmin &gt;= 2) throw new Error('Da du 2 admin');
      return tx.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}

const kq = await Promise.allSettled([thangCap(10), thangCap(11)]);
console.log(kq.map((r) =&gt; r.status));
console.log('admin:', await prisma.user.count({ where: { role: 'ADMIN' } }));</code></pre>
<div class="out">[ 'fulfilled', 'rejected' ]
admin: 2

-- and the rejection:
PrismaClientKnownRequestError:
Transaction failed due to a write conflict or a deadlock. Please retry your transaction
  code: 'P2034'
  meta: { code: '40001', message: 'could not serialize access due to read/write dependencies among transactions' }</div>
<div class="callout ok">
<p><strong>Serializable does not make both succeed — it makes one fail loudly.</strong> PostgreSQL tracks the read/write dependencies between concurrent transactions and aborts one when the pair could not have been produced by running them one after the other. The rule is preserved; the cost is a <code>40001</code> error, and the contract is that <strong>you must retry it</strong>. A serializable transaction without a retry wrapper is not safer than <code>READ COMMITTED</code> — it just fails differently.</p>
</div>
<pre><code><span class="tok-comment">// The retry wrapper that makes Serializable usable</span>
async function chayLai&lt;T&gt;(fn: () =&gt; Promise&lt;T&gt;, lanToiDa = 5): Promise&lt;T&gt; {
  for (let lan = 1; ; lan++) {
    try {
      return await fn();
    } catch (e) {
      const laXungDot =
        e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp;
        (e.code === 'P2034' || e.code === 'P2002');
      if (!laXungDot || lan &gt;= lanToiDa) throw e;

      <span class="tok-comment">// exponential backoff with jitter, so retries do not collide again</span>
      const cho = Math.min(50 * 2 ** lan, 1000) * (0.5 + Math.random());
      await new Promise((r) =&gt; setTimeout(r, cho));
    }
  }
}

await chayLai(() =&gt; thangCap(11));</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Jitter is not optional</span><span class="v">Without randomness, two transactions that conflicted will retry at the same instant and conflict again. The jitter is what breaks the cycle.</span></div>
  <div class="kv"><span class="k">Bound the attempts</span><span class="v">Five is plenty. If a transaction fails five times, the contention is structural — the design needs changing, not more retries.</span></div>
  <div class="kv"><span class="k">Only retry conflict errors</span><span class="v"><code>P2034</code> (serialization failure or deadlock) and sometimes <code>P2002</code> from a racing upsert. Retrying a constraint violation or a validation error just does the wrong thing five times.</span></div>
  <div class="kv"><span class="k">The transaction must be idempotent</span><span class="v">It will run more than once. Anything with a side effect outside the database — an email, a webhook, a charge — must not be inside it, which is Lesson 7.1's rule from a different angle.</span></div>
</div>

<h3>The cheaper fix: make the database check it</h3>
<pre><code><span class="tok-comment">// No isolation level, no retry — put the precondition in the WHERE</span>
const r = await prisma.user.updateMany({
  where: { id: userId, role: { not: 'ADMIN' } },
  data:  { role: 'ADMIN' },
});
if (r.count === 0) throw new Error('Nguoi dung nay da la admin');</code></pre>
<pre><code><span class="tok-comment">-- Or let a constraint enforce it, which nothing can bypass</span>
CREATE UNIQUE INDEX "chi_hai_admin" ON "users"("role", "admin_slot")
  WHERE "role" = 'ADMIN';</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · A constraint</span><span class="lz-t">Strongest, cheapest</span><span class="lz-d">The database enforces it against every writer, including psql and other services. No isolation level, no retry, no application code. Reach for this first whenever the rule can be expressed as one.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Precondition in the <code>where</code></span><span class="lz-t">Usually enough</span><span class="lz-d">One statement means check and write cannot be separated. Covers most guarded transitions — Lesson 4.4. Fails when the condition spans a different table.</span></div>
  <div class="lz-step"><span class="lz-k">3 · An explicit lock</span><span class="lz-t">Targeted</span><span class="lz-d"><code>SELECT … FOR UPDATE</code> on the rows in question. Serialises just the contended rows instead of the whole transaction. Lesson 7.4.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Serializable + retry</span><span class="lz-t">Last, not first</span><span class="lz-d">Correct for genuinely complex invariants across several tables. Costs throughput under contention and requires the retry wrapper. Use it when the first three cannot express the rule.</span></div>
</div>

<h3><code>REPEATABLE READ</code>: the middle option</h3>
<pre><code><span class="tok-comment">// A report that must be internally consistent: every query sees one snapshot</span>
const bc = await prisma.$transaction(
  async (tx) =&gt; ({
    tong:     await tx.donHang.aggregate({ _sum: { total: true } }),
    theoNgay: await tx.donHang.groupBy({ by: ['ngay'], _sum: { total: true } }),
    chiTiet:  await tx.donHang.findMany({ take: 1000, orderBy: { ngay: 'desc' } }),
  }),
  { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
);</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">One snapshot for the whole transaction</span><span class="v">Taken at the first query. Every later read sees that same moment, so the total and the per-day breakdown cannot disagree because an order arrived between them.</span></div>
  <div class="kv"><span class="k">Cheaper than Serializable for reads</span><span class="v">A read-only transaction at <code>REPEATABLE READ</code> never conflicts and never needs a retry — it just reads an older snapshot. This is the right level for reporting.</span></div>
  <div class="kv"><span class="k">Not enough for writes</span><span class="v">It still permits write skew, so it does not fix the two-admin problem. For a read-modify-write it buys you consistency of the reads and nothing about the write.</span></div>
  <div class="kv"><span class="k">MySQL's default</span><span class="v">Worth knowing if you move between databases: the same Prisma code has different guarantees on MySQL than on PostgreSQL, without any code change.</span></div>
</div>

<h3>Choosing, honestly</h3>
<div class="callout">
<p><strong>Almost all application code should stay at the default.</strong> <code>READ COMMITTED</code> plus atomic operators plus preconditions in the <code>where</code> plus real constraints covers the overwhelming majority of correctness requirements, at no cost. Move up when you have a specific invariant those cannot express — and when you do, move up for <em>that transaction only</em>, not globally. A serializable default across an entire application is a throughput problem you will spend a week diagnosing.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#transaction-isolation-level" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Transaction isolation level</span><span class="lc-sub">prisma.io/docs · Setting it per transaction, and what each provider supports</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — transaction isolation</span><span class="lc-sub">postgresql.org · The definitive account, including the write-skew example this lesson uses</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p2034" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P2034 — write conflict or deadlock</span><span class="lc-sub">prisma.io/docs · The error Serializable produces, and the retry contract it implies</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, transactions chapter</span><span class="lc-sub">MVCC and snapshots — why REPEATABLE READ costs nothing for a read-only transaction</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Reproduce write skew with two concurrent clients, then fix it four different ways and compare</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Mức cô lập, dựng lại tận mắt</h2>
<p class="lead">Một mức cô lập là một lời hứa về việc một giao dịch nhìn thấy gì trong lúc một giao dịch khác đang chạy. PostgreSQL cho ba mức dùng được, mức mặc định yếu hơn phần lớn người ta tưởng, và mức mạnh nhất không loại bỏ thất bại — nó chuyển thất bại thành một lỗi cụ thể mà bạn phải sẵn sàng thử lại. Tất cả những điều đó dễ tin hơn hẳn khi bạn nhìn nó xảy ra trên hai cửa sổ terminal.</p>

<h3>Đặt nó</h3>
<pre><code>await prisma.$transaction(
  async (tx) =&gt; { /* … */ },
  { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
);

<span class="tok-comment">// Dạng mảng cũng nhận</span>
await prisma.$transaction([ /* … */ ], {
  isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
});</code></pre>
<div class="out">prisma:query BEGIN ISOLATION LEVEL SERIALIZABLE
prisma:query SELECT ...
prisma:query COMMIT</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mặc định là mặc định của cơ sở dữ liệu</span><span class="v">Bỏ qua nó thì bạn nhận thứ cơ sở dữ liệu được cấu hình — <code>READ COMMITTED</code> ở PostgreSQL và <code>REPEATABLE READ</code> ở MySQL. Prisma không áp đặt mức riêng nào.</span></div>
  <div class="kv"><span class="k">PostgreSQL có ba mức, không phải bốn</span><span class="v"><code>READ UNCOMMITTED</code> được chấp nhận và âm thầm hành xử như <code>READ COMMITTED</code>. Không có đọc bẩn ở bất kỳ mức nào trong PostgreSQL.</span></div>
  <div class="kv"><span class="k">Nó áp cho cả giao dịch</span><span class="v">Đặt tại <code>BEGIN</code> và không đổi được sau đó. Một câu truy vấn đơn nằm ngoài giao dịch chính là một giao dịch ngầm của riêng nó, ở mức mặc định.</span></div>
</div>

<h3>Ba hiện tượng, trên hai terminal</h3>
<pre><code><span class="tok-comment">-- Terminal A                          -- Terminal B</span>
BEGIN;                                 <span class="tok-comment">-- (chưa gì cả)</span>
SELECT so_du FROM tai_khoan WHERE id=1;
<span class="tok-comment">--  so_du: 1000</span>
                                       UPDATE tai_khoan SET so_du=2000 WHERE id=1;
                                       <span class="tok-comment">-- đã commit</span>
SELECT so_du FROM tai_khoan WHERE id=1;
<span class="tok-comment">--  READ COMMITTED  → 2000  ← đọc không lặp lại được</span>
<span class="tok-comment">--  REPEATABLE READ → 1000</span>
COMMIT;</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đọc bẩn — đọc dữ liệu chưa commit</span><span class="lz-lnote">Bị chặn ở mọi mức trong PostgreSQL. Bạn sẽ không bao giờ nhìn thấy một giá trị mà giao dịch khác chưa commit. Cái này thì thôi lo.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đọc không lặp lại được — cùng một hàng đổi giá trị dưới chân bạn</span><span class="lz-lnote">Được <code>READ COMMITTED</code> cho phép. Hai câu <code>SELECT</code> lên cùng một hàng trong một giao dịch có thể trả về giá trị khác nhau. Quan trọng khi bạn đọc một số dư, tính toán với nó, rồi đọc lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đọc ma — cùng một câu truy vấn trả về các hàng khác nhau</span><span class="lz-lnote">Được <code>READ COMMITTED</code> cho phép. <code>SELECT count(*) WHERE status='MOI'</code> hai lần có thể trả 4 rồi 5. Quan trọng với các luật kiểu "không được có quá N cái như thế này".</span></div>
  <div class="lz-layer"><span class="lz-lname">Lệch ghi — hai giao dịch mỗi cái đều hợp lệ, gộp lại thì không</span><span class="lz-lnote">Ngay cả <code>REPEATABLE READ</code> cũng cho phép. Chỉ <code>SERIALIZABLE</code> chặn được, và đây là cái mà người ta không biết là nó tồn tại — xem bên dưới.</span></div>
</div>

<h3><code>READ COMMITTED</code>: mức mặc định để lọt cái gì</h3>
<pre><code><span class="tok-comment">// Luật: nhiều nhất 2 admin. Hai yêu cầu cùng lúc thăng cấp hai người khác nhau.</span>
async function thangCap(userId: number) {
  return prisma.$transaction(async (tx) =&gt; {
    const soAdmin = await tx.user.count({ where: { role: 'ADMIN' } });
    if (soAdmin &gt;= 2) throw new Error('Da du 2 admin');
    return tx.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
  });
}

await Promise.all([thangCap(10), thangCap(11)]);
console.log('admin:', await prisma.user.count({ where: { role: 'ADMIN' } }));</code></pre>
<div class="out">admin: 3</div>
<div class="pitfall">
<p><strong>Bẫy — cả hai giao dịch đều đếm ra 1, đều kết luận "còn chỗ", và đều ghi.</strong> Riêng lẻ thì không cái nào làm sai gì; cái luật bị vi phạm bởi cả cặp. <code>READ COMMITTED</code> cho phép chuyện này vì câu <code>count</code> trong giao dịch A không bao giờ nhìn thấy phần ghi chưa commit của giao dịch B, và không có gì buộc chúng phải xung đột. Đây là <em>lệch ghi</em>, và nó là lý do câu "tôi đọc rồi tôi kiểm rồi" không phải một bảo đảm. Hai cách vá, ở hai phần tiếp theo.</p>
</div>

<h3><code>SERIALIZABLE</code>: bảo đảm, và cái giá của nó</h3>
<pre><code>async function thangCap(userId: number) {
  return prisma.$transaction(
    async (tx) =&gt; {
      const soAdmin = await tx.user.count({ where: { role: 'ADMIN' } });
      if (soAdmin &gt;= 2) throw new Error('Da du 2 admin');
      return tx.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}

const kq = await Promise.allSettled([thangCap(10), thangCap(11)]);
console.log(kq.map((r) =&gt; r.status));
console.log('admin:', await prisma.user.count({ where: { role: 'ADMIN' } }));</code></pre>
<div class="out">[ 'fulfilled', 'rejected' ]
admin: 2

-- và lời từ chối:
PrismaClientKnownRequestError:
Transaction failed due to a write conflict or a deadlock. Please retry your transaction
  code: 'P2034'
  meta: { code: '40001', message: 'could not serialize access due to read/write dependencies among transactions' }</div>
<div class="callout ok">
<p><strong>Serializable không làm cả hai thành công — nó làm một cái hỏng một cách ồn ào.</strong> PostgreSQL theo dõi các phụ thuộc đọc/ghi giữa các giao dịch song song và huỷ một cái khi cặp đó không thể được tạo ra bởi việc chạy chúng lần lượt. Cái luật được giữ; cái giá là một lỗi <code>40001</code>, và giao kèo là <strong>bạn phải thử lại nó</strong>. Một giao dịch serializable không có lớp bọc thử lại thì không an toàn hơn <code>READ COMMITTED</code> — nó chỉ hỏng theo kiểu khác.</p>
</div>
<pre><code><span class="tok-comment">// Lớp bọc thử lại khiến Serializable dùng được</span>
async function chayLai&lt;T&gt;(fn: () =&gt; Promise&lt;T&gt;, lanToiDa = 5): Promise&lt;T&gt; {
  for (let lan = 1; ; lan++) {
    try {
      return await fn();
    } catch (e) {
      const laXungDot =
        e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp;
        (e.code === 'P2034' || e.code === 'P2002');
      if (!laXungDot || lan &gt;= lanToiDa) throw e;

      <span class="tok-comment">// lùi theo cấp số nhân kèm nhiễu, để các lần thử lại không lại đụng nhau</span>
      const cho = Math.min(50 * 2 ** lan, 1000) * (0.5 + Math.random());
      await new Promise((r) =&gt; setTimeout(r, cho));
    }
  }
}

await chayLai(() =&gt; thangCap(11));</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nhiễu không phải tuỳ chọn</span><span class="v">Không có yếu tố ngẫu nhiên thì hai giao dịch vừa xung đột sẽ thử lại đúng cùng một khoảnh khắc và lại xung đột. Chính cái nhiễu ấy phá vỡ vòng lặp.</span></div>
  <div class="kv"><span class="k">Chặn số lần thử</span><span class="v">Năm là quá đủ. Nếu một giao dịch hỏng năm lần thì tranh chấp là chuyện cấu trúc — thiết kế cần đổi, chứ không cần thêm lần thử.</span></div>
  <div class="kv"><span class="k">Chỉ thử lại các lỗi xung đột</span><span class="v"><code>P2034</code> (hỏng tuần tự hoá hoặc khoá chết) và đôi khi <code>P2002</code> từ một upsert đang đua. Thử lại một lỗi vi phạm ràng buộc hay một lỗi kiểm dữ liệu chỉ là làm sai năm lần.</span></div>
  <div class="kv"><span class="k">Giao dịch phải idempotent</span><span class="v">Nó sẽ chạy hơn một lần. Mọi thứ có tác dụng phụ ra ngoài cơ sở dữ liệu — một email, một webhook, một lần thu tiền — đều không được nằm bên trong nó, và đó là luật của Bài 7.1 nhìn từ góc khác.</span></div>
</div>

<h3>Cách vá rẻ hơn: để cơ sở dữ liệu tự kiểm</h3>
<pre><code><span class="tok-comment">// Không mức cô lập, không thử lại — đặt tiền điều kiện vào WHERE</span>
const r = await prisma.user.updateMany({
  where: { id: userId, role: { not: 'ADMIN' } },
  data:  { role: 'ADMIN' },
});
if (r.count === 0) throw new Error('Nguoi dung nay da la admin');</code></pre>
<pre><code><span class="tok-comment">-- Hoặc để một ràng buộc thi hành nó, thứ không gì đi vòng được</span>
CREATE UNIQUE INDEX "chi_hai_admin" ON "users"("role", "admin_slot")
  WHERE "role" = 'ADMIN';</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Một ràng buộc</span><span class="lz-t">Mạnh nhất, rẻ nhất</span><span class="lz-d">Cơ sở dữ liệu thi hành nó với mọi bên ghi, kể cả psql và các dịch vụ khác. Không mức cô lập, không thử lại, không mã ứng dụng. Hãy với tay tới đây trước mỗi khi cái luật diễn đạt được thành một ràng buộc.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Tiền điều kiện trong <code>where</code></span><span class="lz-t">Thường là đủ</span><span class="lz-d">Một câu lệnh nghĩa là kiểm và ghi không tách rời được. Bao gần hết các chuyển trạng thái có canh gác — Bài 4.4. Hỏng khi điều kiện nằm ở một bảng khác.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Một khoá tường minh</span><span class="lz-t">Đúng trọng tâm</span><span class="lz-d"><code>SELECT … FOR UPDATE</code> lên đúng những hàng đang bàn. Tuần tự hoá riêng những hàng bị tranh chấp thay vì cả giao dịch. Bài 7.4.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Serializable cộng thử lại</span><span class="lz-t">Cuối cùng, không phải đầu tiên</span><span class="lz-d">Đúng cho những bất biến thật sự phức tạp trải qua nhiều bảng. Tốn thông lượng khi có tranh chấp và cần lớp bọc thử lại. Dùng khi ba cách trên diễn đạt không nổi cái luật.</span></div>
</div>

<h3><code>REPEATABLE READ</code>: lựa chọn ở giữa</h3>
<pre><code><span class="tok-comment">// Một báo cáo buộc phải nhất quán bên trong: mọi truy vấn nhìn cùng một bản chụp</span>
const bc = await prisma.$transaction(
  async (tx) =&gt; ({
    tong:     await tx.donHang.aggregate({ _sum: { total: true } }),
    theoNgay: await tx.donHang.groupBy({ by: ['ngay'], _sum: { total: true } }),
    chiTiet:  await tx.donHang.findMany({ take: 1000, orderBy: { ngay: 'desc' } }),
  }),
  { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
);</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Một bản chụp cho cả giao dịch</span><span class="v">Chụp tại câu truy vấn đầu tiên. Mọi lần đọc sau đó đều thấy đúng khoảnh khắc ấy, nên tổng và bảng chia theo ngày không thể lệch nhau chỉ vì có một đơn tới ở giữa.</span></div>
  <div class="kv"><span class="k">Rẻ hơn Serializable với các lần đọc</span><span class="v">Một giao dịch chỉ đọc ở mức <code>REPEATABLE READ</code> không bao giờ xung đột và không bao giờ cần thử lại — nó chỉ đọc một bản chụp cũ hơn. Đây là mức đúng cho báo cáo.</span></div>
  <div class="kv"><span class="k">Không đủ cho các lần ghi</span><span class="v">Nó vẫn cho phép lệch ghi, nên nó không vá được bài toán hai admin. Với một chu trình đọc-sửa-ghi thì nó mua cho bạn tính nhất quán của các lần đọc và không mua gì cho lần ghi.</span></div>
  <div class="kv"><span class="k">Là mặc định của MySQL</span><span class="v">Đáng biết nếu bạn di chuyển giữa các cơ sở dữ liệu: cùng một đoạn mã Prisma có bảo đảm khác nhau trên MySQL so với trên PostgreSQL, mà không đổi một dòng mã nào.</span></div>
</div>

<h3>Chọn thế nào, nói thật</h3>
<div class="callout">
<p><strong>Gần như mọi mã ứng dụng nên ở nguyên mức mặc định.</strong> <code>READ COMMITTED</code> cộng toán tử nguyên tử cộng tiền điều kiện trong <code>where</code> cộng ràng buộc thật đã phủ phần áp đảo các yêu cầu về tính đúng, mà không tốn gì. Hãy nâng mức khi bạn có một bất biến cụ thể mà những thứ đó diễn đạt không nổi — và khi nâng thì hãy nâng cho <em>riêng giao dịch đó</em>, không phải cho toàn cục. Đặt Serializable làm mặc định cho cả một ứng dụng là một bài toán thông lượng mà bạn sẽ mất một tuần để chẩn đoán.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#transaction-isolation-level" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Transaction isolation level</span><span class="lc-sub">prisma.io/docs · Đặt nó cho từng giao dịch, và mỗi provider hỗ trợ những mức nào</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — cô lập giao dịch</span><span class="lc-sub">postgresql.org · Bản trình bày dứt khoát, kèm cả ví dụ lệch ghi mà bài này dùng</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p2034" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P2034 — xung đột ghi hoặc khoá chết</span><span class="lc-sub">prisma.io/docs · Lỗi mà Serializable sinh ra, và giao kèo thử lại nó hàm ý</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương giao dịch</span><span class="lc-sub">MVCC và bản chụp — vì sao REPEATABLE READ không tốn gì với một giao dịch chỉ đọc</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Dựng lại lệch ghi với hai client song song, rồi vá bằng bốn cách khác nhau và so sánh</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Locking: pessimistic, optimistic, advisory|||7.3 — Khoá: bi quan, lạc quan, advisory',
      slug: 'pr-7-3-khoa',
      type: 'LESSON',
      description: 'SELECT FOR UPDATE qua $queryRaw và bốn biến thể của nó, khoá lạc quan bằng cột version mà không cần khoá gì, advisory lock cho việc chỉ được chạy một bản, khoá chết dựng lại rồi vá bằng thứ tự khoá cố định.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Locking: pessimistic, optimistic, advisory</h2>
<p class="lead">When a precondition in a <code>where</code> is not enough and Serializable is too blunt, you lock. There are three kinds and they solve different problems: pessimistic locks make others wait, optimistic locks let others proceed and detect the collision afterwards, and advisory locks protect something that is not a row at all. Each has a shape worth memorising.</p>

<h3>Pessimistic: <code>SELECT … FOR UPDATE</code></h3>
<pre><code>await prisma.$transaction(async (tx) =&gt; {
  <span class="tok-comment">// Lock the row. Any other transaction reading it FOR UPDATE now waits.</span>
  const [sp] = await tx.$queryRaw&lt;{ id: number; stock: number }[]&gt;&#96;
    SELECT id, stock FROM products WHERE id = \${spId} FOR UPDATE&#96;;

  if (sp.stock &lt; soLuong) throw new Error('Khong du hang');

  await tx.product.update({
    where: { id: spId },
    data:  { stock: { decrement: soLuong } },
  });

  return tx.orderItem.create({ data: { orderId, productId: spId, soLuong } });
});</code></pre>
<div class="out">prisma:query BEGIN
prisma:query SELECT id, stock FROM products WHERE id = $1 FOR UPDATE
prisma:query UPDATE "products" SET "stock" = "products"."stock" - $1 WHERE "id" = $2
prisma:query INSERT INTO "order_items" ...
prisma:query COMMIT</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Why raw SQL</span><span class="v">Prisma Client has no <code>FOR UPDATE</code> option. Use <code>tx.$queryRaw</code> for the locking read and normal Prisma calls for everything else — they share the transaction and the connection.</span></div>
  <div class="kv"><span class="k">The lock is held to <code>COMMIT</code></span><span class="v">Not to the end of the statement. That is the point, and it is also why the callback must be short: every other buyer of that product is blocked for its duration.</span></div>
  <div class="kv"><span class="k">It only blocks writers</span><span class="v">Plain <code>SELECT</code> readers are unaffected — PostgreSQL's MVCC means readers never block. Only another <code>FOR UPDATE</code>, <code>UPDATE</code> or <code>DELETE</code> on that row waits.</span></div>
  <div class="kv"><span class="k">Order your locks</span><span class="v">Two transactions locking rows 1 and 2 in opposite orders deadlock. Always lock in a deterministic order — ascending id is the usual convention. See the deadlock section below.</span></div>
</div>
<pre><code><span class="tok-comment">-- The four variants, each solving a different problem</span>
SELECT … FOR UPDATE;              <span class="tok-comment">-- block others; wait for the lock</span>
SELECT … FOR UPDATE NOWAIT;       <span class="tok-comment">-- fail immediately if locked (error 55P03)</span>
SELECT … FOR UPDATE SKIP LOCKED;  <span class="tok-comment">-- skip locked rows — the job-queue pattern</span>
SELECT … FOR SHARE;               <span class="tok-comment">-- others may read-lock too, but not write</span></code></pre>
<pre><code><span class="tok-comment">// SKIP LOCKED: a work queue that N workers can drain safely</span>
const cong = await prisma.$transaction(async (tx) =&gt; {
  const [job] = await tx.$queryRaw&lt;{ id: number; payload: unknown }[]&gt;&#96;
    SELECT id, payload FROM jobs
    WHERE status = 'CHO'
    ORDER BY created_at
    FOR UPDATE SKIP LOCKED
    LIMIT 1&#96;;

  if (!job) return null;

  await tx.job.update({ where: { id: job.id }, data: { status: 'DANG_CHAY' } });
  return job;
});</code></pre>
<div class="callout ok">
<p><strong><code>SKIP LOCKED</code> is the single most useful line in this lesson.</strong> Ten workers polling the same queue each take a different job with no coordination, no Redis, no external queue — the database hands each of them the first row nobody else has locked. It is the standard PostgreSQL job-queue pattern, it scales to a surprising number of workers, and it is four words.</p>
</div>

<h3>Optimistic: a version column</h3>
<pre><code>model Document {
  id      Int    @id @default(autoincrement())
  noiDung String
  version Int    @default(0)
}</code></pre>
<pre><code>async function luu(id: number, noiDung: string, versionDaBiet: number) {
  const r = await prisma.document.updateMany({
    where: { id, version: versionDaBiet },              <span class="tok-comment">// only if nobody else wrote</span>
    data:  { noiDung, version: { increment: 1 } },
  });

  if (r.count === 0) {
    throw new Error('Tai lieu da bi nguoi khac sua. Tai lai va thu lai.');
  }
}</code></pre>
<div class="out">UPDATE "Document" SET "noiDung" = $1, "version" = "Document"."version" + $2
WHERE ("id" = $3 AND "version" = $4)

-- User A saved first:  { count: 1 }, version 3 → 4
-- User B, still on 3:  { count: 0 } → rejected, and told why</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">No lock at all</span><span class="lz-t">Nobody waits</span><span class="lz-d">Both users edit freely for as long as they like. The collision is detected at save time, not prevented at read time — which is the only workable model when "editing" lasts minutes.</span></div>
  <div class="lz-step"><span class="lz-k">One statement</span><span class="lz-t">No transaction needed</span><span class="lz-d">The check and the write are the same <code>UPDATE</code>, so nothing can slip between them. <code>count === 0</code> is the collision signal.</span></div>
  <div class="lz-step"><span class="lz-k">The loser is told</span><span class="lz-t">Rather than silently overwritten</span><span class="lz-d">This is the actual value. Without it, B's save destroys A's work and nobody finds out until someone notices a paragraph missing.</span></div>
  <div class="lz-step"><span class="lz-k">Right when contention is rare</span><span class="lz-t">Documents, profiles, settings</span><span class="lz-d">Wrong for a stock counter under heavy load, where every second writer would be rejected. There, use an atomic operator or a pessimistic lock.</span></div>
</div>
<pre><code><span class="tok-comment">// The same idea without an extra column, using updatedAt</span>
const r = await prisma.document.updateMany({
  where: { id, updatedAt: daBiet },      <span class="tok-comment">// the timestamp the client last saw</span>
  data:  { noiDung },                     <span class="tok-comment">// @updatedAt bumps it automatically</span>
});</code></pre>

<h3>Advisory locks: for things that are not rows</h3>
<pre><code><span class="tok-comment">// "Only one instance may run this import at a time" — across all servers</span>
const KHOA_NHAP = 918273n;

const ok = await prisma.$queryRaw&lt;{ pg_try_advisory_lock: boolean }[]&gt;&#96;
  SELECT pg_try_advisory_lock(\${KHOA_NHAP})&#96;;

if (!ok[0].pg_try_advisory_lock) {
  console.log('Mot ban khac dang chay. Bo qua.');
  return;
}

try {
  await chayNhapDuLieu();          <span class="tok-comment">// minutes of work, safely exclusive</span>
} finally {
  await prisma.$executeRaw&#96;SELECT pg_advisory_unlock(\${KHOA_NHAP})&#96;;
}</code></pre>
<div class="out">-- instance 1
Mot ban khac dang chay. Bo qua.     ← instance 2, immediately
… nhap 41,208 ban ghi …             ← instance 1, three minutes later</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The lock is a number you choose</span><span class="v">It protects nothing in particular — it is a name in a shared namespace. Two different features must use different numbers; keep them in one constants file.</span></div>
  <div class="kv"><span class="k">Session-scoped or transaction-scoped</span><span class="v"><code>pg_advisory_lock</code> is held until you unlock or the connection closes; <code>pg_advisory_xact_lock</code> releases automatically at <code>COMMIT</code>. Prefer the transaction form — it cannot leak.</span></div>
  <div class="kv"><span class="k"><code>try_</code> versus blocking</span><span class="v"><code>pg_try_advisory_lock</code> returns <code>false</code> immediately; <code>pg_advisory_lock</code> waits. For a scheduled job, "someone else has it, skip this run" is almost always right.</span></div>
  <div class="kv"><span class="k">Beware the connection pool</span><span class="v">The session form is tied to a <em>connection</em>, and Prisma may hand your next query a different one. Take and release it inside one <code>$transaction</code>, or use the <code>_xact_</code> variant.</span></div>
</div>
<div class="callout">
<p><strong>This is a distributed lock you already have.</strong> A cron job running on three servers, a leader election, a "rebuild the search index" task that must not overlap with itself — all of these are usually solved by adding Redis. If PostgreSQL is already in your stack, <code>pg_try_advisory_lock</code> is one line and one fewer system to operate. The CuongThai stack runs both, and the rule of thumb is: Redis when the lock is high-frequency, advisory when it is a background job.</p>
</div>

<h3>Deadlocks, and the fix</h3>
<pre><code><span class="tok-comment">// Two transfers in opposite directions, at the same moment</span>
async function chuyen(tu: number, den: number, tien: number) {
  return prisma.$transaction(async (tx) =&gt; {
    await tx.$queryRaw&#96;SELECT id FROM tai_khoan WHERE id = \${tu}  FOR UPDATE&#96;;
    await tx.$queryRaw&#96;SELECT id FROM tai_khoan WHERE id = \${den} FOR UPDATE&#96;;
    await tx.taiKhoan.update({ where: { id: tu },  data: { soDu: { decrement: tien } } });
    await tx.taiKhoan.update({ where: { id: den }, data: { soDu: { increment: tien } } });
  });
}

await Promise.all([chuyen(1, 2, 100), chuyen(2, 1, 50)]);</code></pre>
<div class="out">PrismaClientKnownRequestError:
Transaction failed due to a write conflict or a deadlock. Please retry your transaction
  code: 'P2034'
  meta: { code: '40P01', message: 'deadlock detected' }

-- PostgreSQL log:
DETAIL: Process 4182 waits for ShareLock on transaction 9014; blocked by process 4190.
        Process 4190 waits for ShareLock on transaction 9013; blocked by process 4182.</div>
<pre><code><span class="tok-comment">// The fix: always lock in the same order, regardless of direction</span>
async function chuyen(tu: number, den: number, tien: number) {
  const [dau, sau] = [tu, den].sort((a, b) =&gt; a - b);   <span class="tok-comment">// ascending id, always</span>

  return prisma.$transaction(async (tx) =&gt; {
    await tx.$queryRaw&#96;SELECT id FROM tai_khoan WHERE id IN (\${dau}, \${sau}) ORDER BY id FOR UPDATE&#96;;
    await tx.taiKhoan.update({ where: { id: tu },  data: { soDu: { decrement: tien } } });
    await tx.taiKhoan.update({ where: { id: den }, data: { soDu: { increment: tien } } });
  });
}</code></pre>
<div class="pitfall">
<p><strong>Trap — a deadlock is a design smell, not bad luck.</strong> PostgreSQL detects it in about a second and kills one transaction, so it is survivable — but it means two code paths acquire the same locks in different orders, and that will keep happening. The fix is a rule you apply everywhere: <strong>lock rows in ascending primary-key order</strong>, and lock tables in a fixed order too. Sorting the ids before locking, as above, costs nothing and removes the whole class of failure. Keep the retry wrapper as well: an unrelated deadlock can still arrive from a path you have not written yet.</p>
</div>

<h3>Choosing</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nothing — atomic operator or a <code>where</code> precondition</span><span class="lz-lnote">Covers counters, stock, guarded transitions. No lock, no transaction, no retry. Always try this first.</span></div>
  <div class="lz-layer"><span class="lz-lname">Optimistic — a version column</span><span class="lz-lnote">Long human edits where collisions are rare and the loser must be told rather than overwritten. Documents, profiles, settings.</span></div>
  <div class="lz-layer"><span class="lz-lname">Pessimistic — <code>FOR UPDATE</code></span><span class="lz-lnote">Short machine transactions where collisions are common and waiting is cheaper than retrying. Inventory, transfers, seat booking. <code>SKIP LOCKED</code> for queues.</span></div>
  <div class="lz-layer"><span class="lz-lname">Advisory — <code>pg_try_advisory_lock</code></span><span class="lz-lnote">Protecting a process rather than a row: a cron job, an import, an index rebuild. The one case where the thing being locked has no primary key.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">PostgreSQL — locking clauses</span><span class="lc-sub">postgresql.org · <code>FOR UPDATE</code>, <code>NOWAIT</code>, <code>SKIP LOCKED</code>, <code>FOR SHARE</code>, from the source</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS" target="_blank" rel="noopener"><span class="lc-ico">🎫</span><span class="lc-body"><span class="lc-title">PostgreSQL — advisory locks</span><span class="lc-sub">postgresql.org · Session versus transaction scope, and the full function list</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#optimistic-concurrency-control" target="_blank" rel="noopener"><span class="lc-ico">🎲</span><span class="lc-body"><span class="lc-title">Optimistic concurrency control</span><span class="lc-sub">prisma.io/docs · The version-column pattern in Prisma's own words</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis, atomicity chapter</span><span class="lc-sub">Distributed locks in Redis — the alternative to advisory locks, and when each one fits</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Build a SKIP LOCKED job queue with four workers, then deadlock two transfers and fix the ordering</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Khoá: bi quan, lạc quan, advisory</h2>
<p class="lead">Khi một tiền điều kiện trong <code>where</code> chưa đủ mà Serializable thì quá thô, bạn khoá. Có ba loại và chúng giải những bài toán khác nhau: khoá bi quan bắt người khác đợi, khoá lạc quan để người khác cứ chạy rồi phát hiện va chạm sau, còn advisory lock bảo vệ một thứ hoàn toàn không phải hàng dữ liệu. Mỗi loại có một hình mẫu đáng thuộc.</p>

<h3>Bi quan: <code>SELECT … FOR UPDATE</code></h3>
<pre><code>await prisma.$transaction(async (tx) =&gt; {
  <span class="tok-comment">// Khoá hàng đó. Mọi giao dịch khác đọc nó bằng FOR UPDATE sẽ phải đợi.</span>
  const [sp] = await tx.$queryRaw&lt;{ id: number; stock: number }[]&gt;&#96;
    SELECT id, stock FROM products WHERE id = \${spId} FOR UPDATE&#96;;

  if (sp.stock &lt; soLuong) throw new Error('Khong du hang');

  await tx.product.update({
    where: { id: spId },
    data:  { stock: { decrement: soLuong } },
  });

  return tx.orderItem.create({ data: { orderId, productId: spId, soLuong } });
});</code></pre>
<div class="out">prisma:query BEGIN
prisma:query SELECT id, stock FROM products WHERE id = $1 FOR UPDATE
prisma:query UPDATE "products" SET "stock" = "products"."stock" - $1 WHERE "id" = $2
prisma:query INSERT INTO "order_items" ...
prisma:query COMMIT</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao phải SQL thô</span><span class="v">Prisma Client không có tuỳ chọn <code>FOR UPDATE</code>. Hãy dùng <code>tx.$queryRaw</code> cho lần đọc có khoá và các lời gọi Prisma bình thường cho mọi thứ khác — chúng dùng chung giao dịch và chung kết nối.</span></div>
  <div class="kv"><span class="k">Khoá giữ tới tận <code>COMMIT</code></span><span class="v">Không phải tới cuối câu lệnh. Đó chính là điểm mấu chốt, và cũng là lý do callback phải ngắn: mọi người mua khác của sản phẩm đó đều bị chặn suốt thời gian ấy.</span></div>
  <div class="kv"><span class="k">Nó chỉ chặn bên ghi</span><span class="v">Người đọc bằng <code>SELECT</code> thường không bị ảnh hưởng — MVCC của PostgreSQL nghĩa là người đọc không bao giờ bị chặn. Chỉ một <code>FOR UPDATE</code>, <code>UPDATE</code> hay <code>DELETE</code> khác lên hàng đó mới phải đợi.</span></div>
  <div class="kv"><span class="k">Hãy sắp thứ tự khoá</span><span class="v">Hai giao dịch khoá hàng 1 và 2 theo thứ tự ngược nhau thì khoá chết. Luôn khoá theo một thứ tự tất định — id tăng dần là quy ước thông dụng. Xem phần khoá chết bên dưới.</span></div>
</div>
<pre><code><span class="tok-comment">-- Bốn biến thể, mỗi cái giải một bài toán khác</span>
SELECT … FOR UPDATE;              <span class="tok-comment">-- chặn người khác; đợi lấy khoá</span>
SELECT … FOR UPDATE NOWAIT;       <span class="tok-comment">-- hỏng ngay nếu đang bị khoá (lỗi 55P03)</span>
SELECT … FOR UPDATE SKIP LOCKED;  <span class="tok-comment">-- bỏ qua hàng đang bị khoá — mẫu hàng đợi việc</span>
SELECT … FOR SHARE;               <span class="tok-comment">-- người khác cũng khoá đọc được, nhưng không ghi được</span></code></pre>
<pre><code><span class="tok-comment">// SKIP LOCKED: một hàng đợi việc mà N thợ rút ra được an toàn</span>
const cong = await prisma.$transaction(async (tx) =&gt; {
  const [job] = await tx.$queryRaw&lt;{ id: number; payload: unknown }[]&gt;&#96;
    SELECT id, payload FROM jobs
    WHERE status = 'CHO'
    ORDER BY created_at
    FOR UPDATE SKIP LOCKED
    LIMIT 1&#96;;

  if (!job) return null;

  await tx.job.update({ where: { id: job.id }, data: { status: 'DANG_CHAY' } });
  return job;
});</code></pre>
<div class="callout ok">
<p><strong><code>SKIP LOCKED</code> là dòng hữu ích nhất trong cả bài này.</strong> Mười thợ cùng hỏi một hàng đợi, mỗi người nhận một việc khác nhau mà không cần phối hợp gì, không cần Redis, không cần hàng đợi ngoài — cơ sở dữ liệu đưa cho mỗi người hàng đầu tiên mà chưa ai khoá. Đó là mẫu hàng đợi việc chuẩn của PostgreSQL, nó mở rộng tới số thợ nhiều đến bất ngờ, và nó chỉ là ba chữ.</p>
</div>

<h3>Lạc quan: một cột phiên bản</h3>
<pre><code>model Document {
  id      Int    @id @default(autoincrement())
  noiDung String
  version Int    @default(0)
}</code></pre>
<pre><code>async function luu(id: number, noiDung: string, versionDaBiet: number) {
  const r = await prisma.document.updateMany({
    where: { id, version: versionDaBiet },              <span class="tok-comment">// chỉ khi chưa ai ghi</span>
    data:  { noiDung, version: { increment: 1 } },
  });

  if (r.count === 0) {
    throw new Error('Tai lieu da bi nguoi khac sua. Tai lai va thu lai.');
  }
}</code></pre>
<div class="out">UPDATE "Document" SET "noiDung" = $1, "version" = "Document"."version" + $2
WHERE ("id" = $3 AND "version" = $4)

-- Người dùng A lưu trước: { count: 1 }, version 3 → 4
-- Người dùng B, vẫn ở 3:  { count: 0 } → bị từ chối, và được nói rõ vì sao</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Không khoá gì cả</span><span class="lz-t">Không ai phải đợi</span><span class="lz-d">Cả hai người dùng cứ soạn thoải mái bao lâu tuỳ thích. Va chạm được phát hiện lúc lưu, không phải bị ngăn từ lúc đọc — và đó là mô hình duy nhất chạy được khi "đang soạn" kéo dài hàng phút.</span></div>
  <div class="lz-step"><span class="lz-k">Một câu lệnh</span><span class="lz-t">Không cần giao dịch</span><span class="lz-d">Phép kiểm và phép ghi là cùng một câu <code>UPDATE</code>, nên không gì lọt vào giữa được. <code>count === 0</code> chính là tín hiệu va chạm.</span></div>
  <div class="lz-step"><span class="lz-k">Người thua được báo</span><span class="lz-t">Thay vì bị đè trong im lặng</span><span class="lz-d">Đây mới là giá trị thật. Không có nó thì lần lưu của B phá công của A và không ai biết cho tới khi có người thấy thiếu mất một đoạn.</span></div>
  <div class="lz-step"><span class="lz-k">Đúng khi tranh chấp là hiếm</span><span class="lz-t">Tài liệu, hồ sơ, cài đặt</span><span class="lz-d">Sai với một bộ đếm tồn kho dưới tải nặng, nơi cứ hai người ghi thì một người bị từ chối. Ở đó, hãy dùng toán tử nguyên tử hoặc một khoá bi quan.</span></div>
</div>
<pre><code><span class="tok-comment">// Cùng ý tưởng mà không cần cột thêm, dùng luôn updatedAt</span>
const r = await prisma.document.updateMany({
  where: { id, updatedAt: daBiet },      <span class="tok-comment">// mốc thời gian client nhìn thấy lần cuối</span>
  data:  { noiDung },                     <span class="tok-comment">// @updatedAt tự nâng nó lên</span>
});</code></pre>

<h3>Advisory lock: cho những thứ không phải hàng dữ liệu</h3>
<pre><code><span class="tok-comment">// "Chỉ một bản chạy được phép chạy lần nhập này" — trên toàn bộ máy chủ</span>
const KHOA_NHAP = 918273n;

const ok = await prisma.$queryRaw&lt;{ pg_try_advisory_lock: boolean }[]&gt;&#96;
  SELECT pg_try_advisory_lock(\${KHOA_NHAP})&#96;;

if (!ok[0].pg_try_advisory_lock) {
  console.log('Mot ban khac dang chay. Bo qua.');
  return;
}

try {
  await chayNhapDuLieu();          <span class="tok-comment">// hàng phút công việc, độc quyền an toàn</span>
} finally {
  await prisma.$executeRaw&#96;SELECT pg_advisory_unlock(\${KHOA_NHAP})&#96;;
}</code></pre>
<div class="out">-- bản chạy 1
Mot ban khac dang chay. Bo qua.     ← bản chạy 2, ngay lập tức
… nhap 41,208 ban ghi …             ← bản chạy 1, ba phút sau</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái khoá là một con số bạn chọn</span><span class="v">Nó không bảo vệ thứ gì cụ thể — nó là một cái tên trong một không gian tên dùng chung. Hai tính năng khác nhau phải dùng hai con số khác nhau; hãy giữ chúng trong một tệp hằng số.</span></div>
  <div class="kv"><span class="k">Phạm vi phiên hay phạm vi giao dịch</span><span class="v"><code>pg_advisory_lock</code> giữ tới khi bạn mở khoá hoặc kết nối đóng; <code>pg_advisory_xact_lock</code> tự nhả lúc <code>COMMIT</code>. Hãy ưu tiên dạng giao dịch — nó không rò được.</span></div>
  <div class="kv"><span class="k"><code>try_</code> so với dạng chờ</span><span class="v"><code>pg_try_advisory_lock</code> trả <code>false</code> ngay lập tức; <code>pg_advisory_lock</code> thì đợi. Với một tác vụ theo lịch thì "người khác đang giữ, bỏ qua lượt này" hầu như luôn đúng.</span></div>
  <div class="kv"><span class="k">Coi chừng connection pool</span><span class="v">Dạng phiên gắn với một <em>kết nối</em>, và Prisma có thể đưa câu truy vấn kế tiếp của bạn sang một kết nối khác. Hãy lấy và nhả nó bên trong một <code>$transaction</code>, hoặc dùng biến thể <code>_xact_</code>.</span></div>
</div>
<div class="callout">
<p><strong>Đây là một khoá phân tán mà bạn vốn đã có.</strong> Một cron job chạy trên ba máy chủ, một cuộc bầu chọn nút dẫn đầu, một tác vụ "dựng lại chỉ mục tìm kiếm" không được chồng lên chính nó — tất cả thường được giải bằng cách thêm Redis. Nếu PostgreSQL vốn đã ở trong stack của bạn thì <code>pg_try_advisory_lock</code> là một dòng và bớt một hệ thống phải vận hành. Stack của CuongThai chạy cả hai, và quy tắc chung là: Redis khi khoá có tần suất cao, advisory khi đó là một tác vụ nền.</p>
</div>

<h3>Khoá chết, và cách vá</h3>
<pre><code><span class="tok-comment">// Hai lần chuyển khoản ngược chiều nhau, cùng một khoảnh khắc</span>
async function chuyen(tu: number, den: number, tien: number) {
  return prisma.$transaction(async (tx) =&gt; {
    await tx.$queryRaw&#96;SELECT id FROM tai_khoan WHERE id = \${tu}  FOR UPDATE&#96;;
    await tx.$queryRaw&#96;SELECT id FROM tai_khoan WHERE id = \${den} FOR UPDATE&#96;;
    await tx.taiKhoan.update({ where: { id: tu },  data: { soDu: { decrement: tien } } });
    await tx.taiKhoan.update({ where: { id: den }, data: { soDu: { increment: tien } } });
  });
}

await Promise.all([chuyen(1, 2, 100), chuyen(2, 1, 50)]);</code></pre>
<div class="out">PrismaClientKnownRequestError:
Transaction failed due to a write conflict or a deadlock. Please retry your transaction
  code: 'P2034'
  meta: { code: '40P01', message: 'deadlock detected' }

-- log của PostgreSQL:
DETAIL: Process 4182 waits for ShareLock on transaction 9014; blocked by process 4190.
        Process 4190 waits for ShareLock on transaction 9013; blocked by process 4182.</div>
<pre><code><span class="tok-comment">// Cách vá: luôn khoá theo cùng một thứ tự, bất kể chiều nào</span>
async function chuyen(tu: number, den: number, tien: number) {
  const [dau, sau] = [tu, den].sort((a, b) =&gt; a - b);   <span class="tok-comment">// id tăng dần, luôn luôn</span>

  return prisma.$transaction(async (tx) =&gt; {
    await tx.$queryRaw&#96;SELECT id FROM tai_khoan WHERE id IN (\${dau}, \${sau}) ORDER BY id FOR UPDATE&#96;;
    await tx.taiKhoan.update({ where: { id: tu },  data: { soDu: { decrement: tien } } });
    await tx.taiKhoan.update({ where: { id: den }, data: { soDu: { increment: tien } } });
  });
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — khoá chết là một mùi thiết kế, không phải chuyện xui.</strong> PostgreSQL phát hiện nó trong khoảng một giây rồi giết một giao dịch, nên nó sống sót được — nhưng nó có nghĩa là hai nhánh mã lấy cùng những cái khoá theo thứ tự khác nhau, và chuyện đó sẽ còn tiếp diễn. Cách vá là một luật bạn áp ở mọi nơi: <strong>khoá các hàng theo thứ tự khoá chính tăng dần</strong>, và khoá các bảng theo một thứ tự cố định luôn. Sắp các id trước khi khoá, như ở trên, không tốn gì và gỡ bỏ cả một lớp sự cố. Vẫn giữ lớp bọc thử lại: một khoá chết không liên quan vẫn có thể đến từ một nhánh bạn chưa viết.</p>
</div>

<h3>Chọn thế nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Không dùng gì — toán tử nguyên tử hoặc tiền điều kiện trong <code>where</code></span><span class="lz-lnote">Bao được bộ đếm, tồn kho, chuyển trạng thái có canh gác. Không khoá, không giao dịch, không thử lại. Luôn thử cách này trước.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lạc quan — một cột phiên bản</span><span class="lz-lnote">Những lần soạn thảo dài của con người, nơi va chạm hiếm và người thua cần được báo chứ không bị đè. Tài liệu, hồ sơ, cài đặt.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bi quan — <code>FOR UPDATE</code></span><span class="lz-lnote">Những giao dịch máy ngắn, nơi va chạm là thường xuyên và đợi rẻ hơn thử lại. Tồn kho, chuyển khoản, đặt chỗ. <code>SKIP LOCKED</code> cho hàng đợi.</span></div>
  <div class="lz-layer"><span class="lz-lname">Advisory — <code>pg_try_advisory_lock</code></span><span class="lz-lnote">Bảo vệ một tiến trình chứ không phải một hàng: một cron job, một lần nhập dữ liệu, một lần dựng lại chỉ mục. Trường hợp duy nhất mà thứ bị khoá không có khoá chính nào.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">PostgreSQL — mệnh đề khoá</span><span class="lc-sub">postgresql.org · <code>FOR UPDATE</code>, <code>NOWAIT</code>, <code>SKIP LOCKED</code>, <code>FOR SHARE</code>, lấy từ nguồn gốc</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS" target="_blank" rel="noopener"><span class="lc-ico">🎫</span><span class="lc-body"><span class="lc-title">PostgreSQL — advisory lock</span><span class="lc-sub">postgresql.org · Phạm vi phiên so với phạm vi giao dịch, và danh sách hàm đầy đủ</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#optimistic-concurrency-control" target="_blank" rel="noopener"><span class="lc-ico">🎲</span><span class="lc-body"><span class="lc-title">Optimistic concurrency control</span><span class="lc-sub">prisma.io/docs · Mẫu cột phiên bản bằng lời của chính Prisma</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis, chương tính nguyên tử</span><span class="lc-sub">Khoá phân tán trong Redis — lựa chọn thay cho advisory lock, và mỗi cái hợp lúc nào</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Dựng một hàng đợi việc bằng SKIP LOCKED với bốn thợ, rồi làm hai lần chuyển khoản khoá chết và vá thứ tự</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Timeouts, retries and idempotency|||7.4 — Timeout, thử lại và tính idempotent',
      slug: 'pr-7-4-timeout',
      type: 'LESSON',
      description: 'Ba cái timeout chồng lên nhau và mỗi cái nổ ra lỗi gì, vì sao mặc định 5 giây giết mọi lần nhập dữ liệu, cách chia lô để không cần nâng nó, khoá idempotent để một lần thử lại không tính tiền hai lần, và outbox cho những việc phải xảy ra sau khi commit.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Timeouts, retries and idempotency</h2>
<p class="lead">Three separate timeouts govern a Prisma transaction, they stack, and the first one people meet — five seconds — kills every data import ever written inside a transaction. Raising it is usually the wrong fix. This lesson covers all three, then the harder question a retry raises: how do you re-run an operation without doing it twice?</p>

<h3>The three timeouts</h3>
<pre><code>await prisma.$transaction(
  async (tx) =&gt; { /* … */ },
  {
    maxWait: 2000,     <span class="tok-comment">// ms to wait for a connection before BEGIN   (default 2s)</span>
    timeout: 5000,     <span class="tok-comment">// ms the callback may run after BEGIN         (default 5s)</span>
  },
);</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>pool_timeout</code> — a URL parameter, default 10s</span><span class="lz-lnote">How long any query waits for a free connection. Exceeded → <code>P2024</code>. This one fires when the pool is exhausted, which Lesson 7.1 showed is almost always a transaction holding a connection while doing something that is not a query.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>maxWait</code> — default 2s</span><span class="lz-lnote">How long <em>this transaction</em> waits to acquire its connection before it even starts. Exceeded → <code>P2028</code>, and the transaction never began, so nothing was rolled back.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>timeout</code> — default 5s</span><span class="lz-lnote">How long the callback may run once <code>BEGIN</code> has happened. Exceeded → <code>P2028</code> and a rollback. This is the one that surprises people, because five seconds is a long time interactively and no time at all for a bulk operation.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>statement_timeout</code> — PostgreSQL, default off</span><span class="lz-lnote">A server-side limit on a single statement. Not a Prisma setting, and worth setting on your database user anyway: it is the backstop that stops one runaway query from holding locks indefinitely.</span></div>
</div>
<pre><code><span class="tok-comment">// The classic: an import inside a transaction</span>
await prisma.$transaction(async (tx) =&gt; {
  for (const dong of tenNghinDong) {
    await tx.sanPham.create({ data: dong });
  }
});</code></pre>
<div class="out">PrismaClientKnownRequestError:
Transaction API error: Transaction already closed: A query cannot be executed on an
expired transaction. The timeout for this transaction was 5000 ms, however 5013 ms
passed since the start of the transaction.
  code: 'P2028'</div>
<div class="pitfall">
<p><strong>Trap — the obvious fix is the wrong one.</strong> Setting <code>timeout: 600000</code> makes it work and creates a ten-minute transaction: one connection held, locks accumulating, the write-ahead log growing, autovacuum blocked on those tables, and a rollback that discards ten minutes of work if anything fails at minute nine. Raise the timeout only when the operation is genuinely one indivisible unit. For an import it is not — a thousand products are a thousand independent facts.</p>
</div>
<pre><code><span class="tok-comment">// The right fix: batch, and use the default timeout</span>
const KICH_THUOC = 500;

for (let i = 0; i &lt; tenNghinDong.length; i += KICH_THUOC) {
  const lo = tenNghinDong.slice(i, i + KICH_THUOC);
  await prisma.sanPham.createMany({ data: lo, skipDuplicates: true });
  console.log('da nhap', Math.min(i + KICH_THUOC, tenNghinDong.length));
}</code></pre>
<div class="out">da nhap 500
da nhap 1000
… 18 lần …
da nhap 10000

real    0m2.184s</div>
<p>Two seconds instead of five minutes, no transaction held open, and the process is resumable — if it dies at batch fourteen, <code>skipDuplicates</code> makes re-running it safe. That is the general shape: <strong>if raising a timeout would fix it, batching would fix it better.</strong></p>

<h3>When raising it is right</h3>
<pre><code><span class="tok-comment">// A month-end close: genuinely all-or-nothing, and genuinely slow</span>
await prisma.$transaction(
  async (tx) =&gt; {
    await tx.$executeRaw&#96;SET LOCAL statement_timeout = '25s'&#96;;
    await tx.soKeToan.createMany({ data: butToan });
    await tx.taiKhoan.updateMany({ where: { … }, data: { … } });
    await tx.kyKeToan.update({ where: { id: kyId }, data: { daChot: true } });
  },
  { maxWait: 5000, timeout: 30000 },
);</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Raise it when partial completion is unacceptable</span><span class="v">An accounting close, a migration of related records, anything where half-done is worse than not-done. Then thirty seconds of held connection is the price of correctness.</span></div>
  <div class="kv"><span class="k">Set <code>statement_timeout</code> inside it too</span><span class="v"><code>SET LOCAL</code> applies for the transaction only. It bounds any single runaway statement below the transaction timeout, so you get a specific error rather than a generic one.</span></div>
  <div class="kv"><span class="k">Raise <code>maxWait</code> together with it</span><span class="v">A long transaction under load means others queue for a connection. Leaving <code>maxWait</code> at 2s means they fail while waiting for the long one — raise both or neither.</span></div>
  <div class="kv"><span class="k">Never raise it globally</span><span class="v">Pass the options on the one transaction that needs them. A thirty-second default across an application means every stuck transaction takes thirty seconds to reveal itself.</span></div>
</div>

<h3>The retry problem: doing it once, exactly</h3>
<pre><code><span class="tok-comment">// A retry wrapper is not safe on its own. Consider what this retries:</span>
await chayLai(async () =&gt; {
  await prisma.$transaction(async (tx) =&gt; {
    await tx.taiKhoan.update({ where: { id: 1 }, data: { soDu: { decrement: 100 } } });
    await tx.giaoDich.create({ data: { taiKhoanId: 1, soTien: 100 } });
  });
});</code></pre>
<div class="callout warn">
<p><strong>If the transaction commits and then the connection drops before the acknowledgement arrives, the client sees a failure and retries — and the balance is debited twice.</strong> This is not hypothetical; it is the ordinary behaviour of a network. A transaction guarantees atomicity <em>at the database</em>, and says nothing about whether the caller found out. Any operation that a retry might re-run needs a way to recognise that it already happened.</p>
</div>
<pre><code><span class="tok-comment">// An idempotency key: the caller names the operation, the database enforces once</span>
model GiaoDich {
  id       Int      @id @default(autoincrement())
  khoa     String   @unique @map("khoa_idempotent")
  soTien   Decimal  @db.Decimal(14, 2)
  taoLuc   DateTime @default(now())

  @@map("giao_dich")
}</code></pre>
<pre><code>async function rutTien(taiKhoanId: number, soTien: number, khoa: string) {
  try {
    return await prisma.$transaction(async (tx) =&gt; {
      <span class="tok-comment">// The unique constraint is the guard. A duplicate key throws P2002.</span>
      const gd = await tx.giaoDich.create({ data: { khoa, taiKhoanId, soTien } });
      await tx.taiKhoan.update({
        where: { id: taiKhoanId },
        data:  { soDu: { decrement: soTien } },
      });
      return gd;
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') {
      <span class="tok-comment">// Already done. Return the original result — do not repeat the work.</span>
      return prisma.giaoDich.findUniqueOrThrow({ where: { khoa } });
    }
    throw e;
  }
}

<span class="tok-comment">// The caller generates the key once and reuses it across every retry</span>
const khoa = crypto.randomUUID();
await chayLai(() =&gt; rutTien(1, 100, khoa));</code></pre>
<div class="out">-- first attempt:  INSERT … RETURNING  → { id: 41, khoa: 'a1b2…', soTien: 100 }
-- retried:        INSERT → P2002 → SELECT → { id: 41, khoa: 'a1b2…', soTien: 100 }
-- balance debited exactly once</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The key comes from the caller</span><span class="lz-t">Not from the server</span><span class="lz-d">Generated once, before the first attempt, and reused for every retry. A server-generated key would be different each time, which defeats the whole mechanism.</span></div>
  <div class="lz-step"><span class="lz-k">The constraint is the enforcement</span><span class="lz-t">Not an application check</span><span class="lz-d">A <code>findUnique</code> before the insert races. A <code>@unique</code> column cannot — the database rejects the second write no matter how simultaneous.</span></div>
  <div class="lz-step"><span class="lz-k">Return the original result</span><span class="lz-t">Not an error</span><span class="lz-d">The caller asked for the operation to happen; it happened. Returning the existing record is the correct answer, and it makes the endpoint safely retryable by anyone.</span></div>
  <div class="lz-step"><span class="lz-k">Expire old keys</span><span class="lz-t">A scheduled cleanup</span><span class="lz-d">Idempotency keys are only useful for the retry window — hours, not years. A job deleting keys older than a week keeps the table and its index small.</span></div>
</div>

<h3>The other half: things that must happen after the commit</h3>
<pre><code><span class="tok-comment">// The problem: this email is sent even if the transaction rolls back</span>
await prisma.$transaction(async (tx) =&gt; {
  const don = await tx.donHang.create({ data: { … } });
  await guiEmail(don);          <span class="tok-comment">// ← outside the database, cannot be rolled back</span>
  await tx.tonKho.update({ … }); <span class="tok-comment">// ← if THIS throws, the email was already sent</span>
});</code></pre>
<pre><code><span class="tok-comment">// The outbox pattern: record the intent inside the transaction,</span>
<span class="tok-comment">// act on it outside. Now the record and the intent commit together.</span>
model Outbox {
  id       Int       @id @default(autoincrement())
  loai     String
  duLieu   Json
  daXuLy   DateTime? @map("da_xu_ly")
  taoLuc   DateTime  @default(now())

  @@index([daXuLy, taoLuc])
  @@map("outbox")
}</code></pre>
<pre><code>await prisma.$transaction(async (tx) =&gt; {
  const don = await tx.donHang.create({ data: { … } });
  await tx.tonKho.update({ … });
  await tx.outbox.create({ data: { loai: 'DON_HANG_MOI', duLieu: { donId: don.id } } });
});

<span class="tok-comment">// A separate worker, using SKIP LOCKED from Lesson 7.3</span>
for (;;) {
  const viec = await prisma.$transaction(async (tx) =&gt; {
    const [v] = await tx.$queryRaw&lt;{ id: number; loai: string; duLieu: any }[]&gt;&#96;
      SELECT id, loai, "duLieu" FROM outbox
      WHERE "da_xu_ly" IS NULL ORDER BY "taoLuc"
      FOR UPDATE SKIP LOCKED LIMIT 1&#96;;
    if (!v) return null;
    await tx.outbox.update({ where: { id: v.id }, data: { daXuLy: new Date() } });
    return v;
  });

  if (!viec) { await nghi(1000); continue; }
  await xuLy(viec);      <span class="tok-comment">// send the email, call the webhook, publish the event</span>
}</code></pre>
<div class="callout ok">
<p><strong>The outbox trades "exactly once" for "at least once", and that is the honest trade.</strong> If the worker crashes after acting but before marking the row processed, the action repeats — so the action itself must be idempotent, which is the same discipline as the previous section. What you gain is that the intent can never be lost: if the order exists, the outbox row exists, because they committed together. No distributed transaction, no message broker, one table.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#transaction-timeouts" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">Transaction timeouts</span><span class="lc-sub">prisma.io/docs · <code>maxWait</code> and <code>timeout</code>, their defaults, and setting them per call</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p2028" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P2028 — transaction API error</span><span class="lc-sub">prisma.io/docs · Which timeout produced it, and what state the transaction is in</span></span></a>
<a class="link-card" href="https://microservices.io/patterns/data/transactional-outbox.html" target="_blank" rel="noopener"><span class="lc-ico">📤</span><span class="lc-body"><span class="lc-title">The transactional outbox pattern</span><span class="lc-sub">microservices.io · The canonical write-up, including the at-least-once consequence</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js, jobs chapter</span><span class="lc-sub">Background workers, retries and backoff — where an outbox consumer actually lives</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Make a payment endpoint idempotent, then prove a double-submit charges exactly once</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Timeout, thử lại và tính idempotent</h2>
<p class="lead">Có ba cái timeout riêng biệt chi phối một giao dịch Prisma, chúng chồng lên nhau, và cái đầu tiên người ta gặp — năm giây — giết mọi lần nhập dữ liệu từng được viết bên trong một giao dịch. Nâng nó lên thường là cách vá sai. Bài này nói cả ba, rồi tới câu hỏi khó hơn mà một lần thử lại đặt ra: làm sao chạy lại một thao tác mà không làm nó hai lần?</p>

<h3>Ba cái timeout</h3>
<pre><code>await prisma.$transaction(
  async (tx) =&gt; { /* … */ },
  {
    maxWait: 2000,     <span class="tok-comment">// mili giây chờ một kết nối trước BEGIN   (mặc định 2s)</span>
    timeout: 5000,     <span class="tok-comment">// mili giây callback được chạy sau BEGIN   (mặc định 5s)</span>
  },
);</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>pool_timeout</code> — một tham số URL, mặc định 10s</span><span class="lz-lnote">Mọi câu truy vấn đợi một kết nối rỗi trong bao lâu. Quá hạn → <code>P2024</code>. Cái này nổ khi pool cạn, mà Bài 7.1 đã chỉ ra rằng hầu như luôn là do một giao dịch giữ kết nối trong lúc làm một việc không phải truy vấn.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>maxWait</code> — mặc định 2s</span><span class="lz-lnote"><em>Giao dịch này</em> đợi bao lâu để lấy được kết nối của nó, trước cả khi nó bắt đầu. Quá hạn → <code>P2028</code>, và giao dịch chưa từng bắt đầu, nên không có gì bị quay lui.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>timeout</code> — mặc định 5s</span><span class="lz-lnote">Callback được chạy bao lâu sau khi <code>BEGIN</code> đã xảy ra. Quá hạn → <code>P2028</code> cộng một lần quay lui. Đây là cái làm người ta bất ngờ, vì năm giây là rất dài khi thao tác tương tác và chẳng là gì với một thao tác hàng loạt.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>statement_timeout</code> — của PostgreSQL, mặc định tắt</span><span class="lz-lnote">Giới hạn phía máy chủ cho một câu lệnh đơn. Không phải thiết lập của Prisma, và dù sao cũng đáng đặt cho tài khoản cơ sở dữ liệu của bạn: nó là hàng rào cuối chặn một câu truy vấn chạy loạn giữ khoá vô thời hạn.</span></div>
</div>
<pre><code><span class="tok-comment">// Kinh điển: một lần nhập dữ liệu nằm bên trong giao dịch</span>
await prisma.$transaction(async (tx) =&gt; {
  for (const dong of tenNghinDong) {
    await tx.sanPham.create({ data: dong });
  }
});</code></pre>
<div class="out">PrismaClientKnownRequestError:
Transaction API error: Transaction already closed: A query cannot be executed on an
expired transaction. The timeout for this transaction was 5000 ms, however 5013 ms
passed since the start of the transaction.
  code: 'P2028'</div>
<div class="pitfall">
<p><strong>Bẫy — cách vá hiển nhiên lại là cách sai.</strong> Đặt <code>timeout: 600000</code> thì nó chạy được và bạn có một giao dịch mười phút: một kết nối bị giữ, khoá chồng chất, nhật ký ghi-trước phình lên, autovacuum bị chặn trên những bảng đó, và một lần quay lui vứt đi mười phút công sức nếu có gì hỏng ở phút thứ chín. Chỉ nâng timeout khi thao tác thật sự là một đơn vị không chia được. Với một lần nhập dữ liệu thì nó không phải — một nghìn sản phẩm là một nghìn sự kiện độc lập.</p>
</div>
<pre><code><span class="tok-comment">// Cách vá đúng: chia lô, và giữ nguyên timeout mặc định</span>
const KICH_THUOC = 500;

for (let i = 0; i &lt; tenNghinDong.length; i += KICH_THUOC) {
  const lo = tenNghinDong.slice(i, i + KICH_THUOC);
  await prisma.sanPham.createMany({ data: lo, skipDuplicates: true });
  console.log('da nhap', Math.min(i + KICH_THUOC, tenNghinDong.length));
}</code></pre>
<div class="out">da nhap 500
da nhap 1000
… 18 lần …
da nhap 10000

real    0m2.184s</div>
<p>Hai giây thay vì năm phút, không giao dịch nào bị giữ mở, và tiến trình chạy tiếp được — nếu nó chết ở lô thứ mười bốn thì <code>skipDuplicates</code> khiến việc chạy lại là an toàn. Đó là hình dạng chung: <strong>nếu nâng timeout mà vá được thì chia lô vá còn tốt hơn.</strong></p>

<h3>Khi nâng nó là đúng</h3>
<pre><code><span class="tok-comment">// Một lần chốt sổ cuối tháng: thật sự được-tất-hoặc-không-gì, và thật sự chậm</span>
await prisma.$transaction(
  async (tx) =&gt; {
    await tx.$executeRaw&#96;SET LOCAL statement_timeout = '25s'&#96;;
    await tx.soKeToan.createMany({ data: butToan });
    await tx.taiKhoan.updateMany({ where: { … }, data: { … } });
    await tx.kyKeToan.update({ where: { id: kyId }, data: { daChot: true } });
  },
  { maxWait: 5000, timeout: 30000 },
);</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nâng nó khi hoàn thành một nửa là không chấp nhận được</span><span class="v">Một lần chốt sổ kế toán, một lần chuyển các bản ghi liên quan, bất cứ chỗ nào mà làm-dở tệ hơn không-làm. Khi ấy ba mươi giây giữ kết nối là cái giá của tính đúng.</span></div>
  <div class="kv"><span class="k">Đặt luôn <code>statement_timeout</code> bên trong</span><span class="v"><code>SET LOCAL</code> chỉ áp cho giao dịch đó. Nó chặn biên cho bất kỳ câu lệnh chạy loạn nào ở dưới mức timeout của giao dịch, nên bạn nhận được một lỗi cụ thể thay vì một lỗi chung chung.</span></div>
  <div class="kv"><span class="k">Nâng <code>maxWait</code> cùng với nó</span><span class="v">Một giao dịch dài dưới tải nghĩa là những cái khác phải xếp hàng chờ kết nối. Để <code>maxWait</code> ở 2s nghĩa là chúng hỏng trong lúc đợi cái dài kia — hãy nâng cả hai hoặc không nâng cái nào.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ nâng ở mức toàn cục</span><span class="v">Hãy truyền tuỳ chọn cho đúng cái giao dịch cần nó. Ba mươi giây làm mặc định cho cả ứng dụng nghĩa là mọi giao dịch bị kẹt đều mất ba mươi giây mới lộ ra.</span></div>
</div>

<h3>Bài toán thử lại: làm đúng một lần, chính xác một lần</h3>
<pre><code><span class="tok-comment">// Một lớp bọc thử lại tự nó chưa an toàn. Hãy nghĩ xem nó thử lại cái gì:</span>
await chayLai(async () =&gt; {
  await prisma.$transaction(async (tx) =&gt; {
    await tx.taiKhoan.update({ where: { id: 1 }, data: { soDu: { decrement: 100 } } });
    await tx.giaoDich.create({ data: { taiKhoanId: 1, soTien: 100 } });
  });
});</code></pre>
<div class="callout warn">
<p><strong>Nếu giao dịch commit xong rồi kết nối rớt trước khi lời xác nhận về tới nơi, client thấy một thất bại và thử lại — và số dư bị trừ hai lần.</strong> Đây không phải giả thuyết; đó là hành vi bình thường của một mạng máy tính. Một giao dịch bảo đảm tính nguyên tử <em>tại cơ sở dữ liệu</em>, và không nói gì về việc bên gọi có biết được hay không. Bất kỳ thao tác nào mà một lần thử lại có thể chạy lại đều cần một cách để nhận ra rằng nó đã xảy ra rồi.</p>
</div>
<pre><code><span class="tok-comment">// Khoá idempotent: bên gọi đặt tên cho thao tác, cơ sở dữ liệu thi hành "một lần"</span>
model GiaoDich {
  id       Int      @id @default(autoincrement())
  khoa     String   @unique @map("khoa_idempotent")
  soTien   Decimal  @db.Decimal(14, 2)
  taoLuc   DateTime @default(now())

  @@map("giao_dich")
}</code></pre>
<pre><code>async function rutTien(taiKhoanId: number, soTien: number, khoa: string) {
  try {
    return await prisma.$transaction(async (tx) =&gt; {
      <span class="tok-comment">// Ràng buộc unique chính là hàng rào. Khoá trùng thì ném P2002.</span>
      const gd = await tx.giaoDich.create({ data: { khoa, taiKhoanId, soTien } });
      await tx.taiKhoan.update({
        where: { id: taiKhoanId },
        data:  { soDu: { decrement: soTien } },
      });
      return gd;
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') {
      <span class="tok-comment">// Đã làm rồi. Trả về kết quả gốc — đừng lặp lại công việc.</span>
      return prisma.giaoDich.findUniqueOrThrow({ where: { khoa } });
    }
    throw e;
  }
}

<span class="tok-comment">// Bên gọi sinh khoá một lần và dùng lại nó qua mọi lần thử lại</span>
const khoa = crypto.randomUUID();
await chayLai(() =&gt; rutTien(1, 100, khoa));</code></pre>
<div class="out">-- lần đầu:     INSERT … RETURNING  → { id: 41, khoa: 'a1b2…', soTien: 100 }
-- thử lại:     INSERT → P2002 → SELECT → { id: 41, khoa: 'a1b2…', soTien: 100 }
-- số dư bị trừ đúng một lần</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Khoá đến từ bên gọi</span><span class="lz-t">Không phải từ máy chủ</span><span class="lz-d">Sinh một lần, trước lần thử đầu tiên, và dùng lại cho mọi lần thử lại. Một khoá do máy chủ sinh sẽ khác nhau mỗi lần, và như thế là vô hiệu hoá toàn bộ cơ chế.</span></div>
  <div class="lz-step"><span class="lz-k">Ràng buộc mới là thứ thi hành</span><span class="lz-t">Không phải một phép kiểm trong ứng dụng</span><span class="lz-d">Một <code>findUnique</code> trước lần chèn thì có tranh chấp. Một cột <code>@unique</code> thì không — cơ sở dữ liệu từ chối lần ghi thứ hai bất kể hai bên đồng thời tới đâu.</span></div>
  <div class="lz-step"><span class="lz-k">Trả về kết quả gốc</span><span class="lz-t">Không phải một lỗi</span><span class="lz-d">Bên gọi xin cho thao tác xảy ra; nó đã xảy ra. Trả về bản ghi đang có mới là câu trả lời đúng, và nó khiến endpoint an toàn để bất cứ ai thử lại.</span></div>
  <div class="lz-step"><span class="lz-k">Hết hạn các khoá cũ</span><span class="lz-t">Một tác vụ dọn theo lịch</span><span class="lz-d">Khoá idempotent chỉ hữu ích trong khoảng thời gian còn có thể thử lại — vài giờ, không phải vài năm. Một tác vụ xoá các khoá cũ hơn một tuần giữ cho bảng và chỉ mục của nó nhỏ gọn.</span></div>
</div>

<h3>Nửa còn lại: những việc phải xảy ra sau khi commit</h3>
<pre><code><span class="tok-comment">// Vấn đề: cái email này vẫn được gửi ngay cả khi giao dịch quay lui</span>
await prisma.$transaction(async (tx) =&gt; {
  const don = await tx.donHang.create({ data: { … } });
  await guiEmail(don);          <span class="tok-comment">// ← ngoài cơ sở dữ liệu, không quay lui được</span>
  await tx.tonKho.update({ … }); <span class="tok-comment">// ← nếu CÁI NÀY ném lỗi thì email đã gửi mất rồi</span>
});</code></pre>
<pre><code><span class="tok-comment">// Mẫu outbox: ghi lại ý định bên trong giao dịch,</span>
<span class="tok-comment">// rồi hành động bên ngoài. Giờ bản ghi và ý định commit cùng nhau.</span>
model Outbox {
  id       Int       @id @default(autoincrement())
  loai     String
  duLieu   Json
  daXuLy   DateTime? @map("da_xu_ly")
  taoLuc   DateTime  @default(now())

  @@index([daXuLy, taoLuc])
  @@map("outbox")
}</code></pre>
<pre><code>await prisma.$transaction(async (tx) =&gt; {
  const don = await tx.donHang.create({ data: { … } });
  await tx.tonKho.update({ … });
  await tx.outbox.create({ data: { loai: 'DON_HANG_MOI', duLieu: { donId: don.id } } });
});

<span class="tok-comment">// Một thợ chạy riêng, dùng SKIP LOCKED từ Bài 7.3</span>
for (;;) {
  const viec = await prisma.$transaction(async (tx) =&gt; {
    const [v] = await tx.$queryRaw&lt;{ id: number; loai: string; duLieu: any }[]&gt;&#96;
      SELECT id, loai, "duLieu" FROM outbox
      WHERE "da_xu_ly" IS NULL ORDER BY "taoLuc"
      FOR UPDATE SKIP LOCKED LIMIT 1&#96;;
    if (!v) return null;
    await tx.outbox.update({ where: { id: v.id }, data: { daXuLy: new Date() } });
    return v;
  });

  if (!viec) { await nghi(1000); continue; }
  await xuLy(viec);      <span class="tok-comment">// gửi email, gọi webhook, phát sự kiện</span>
}</code></pre>
<div class="callout ok">
<p><strong>Outbox đánh đổi "đúng một lần" lấy "ít nhất một lần", và đó là đánh đổi trung thực.</strong> Nếu thợ chết sau khi đã hành động nhưng trước khi đánh dấu hàng là đã xử lý thì hành động ấy lặp lại — nên bản thân hành động phải idempotent, tức đúng cái kỷ luật ở phần trước. Thứ bạn được là ý định không bao giờ mất được: nếu đơn hàng tồn tại thì hàng outbox tồn tại, vì chúng commit cùng nhau. Không giao dịch phân tán, không message broker, chỉ một cái bảng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#transaction-timeouts" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">Transaction timeouts</span><span class="lc-sub">prisma.io/docs · <code>maxWait</code> và <code>timeout</code>, giá trị mặc định, và cách đặt cho từng lời gọi</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p2028" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P2028 — lỗi API giao dịch</span><span class="lc-sub">prisma.io/docs · Cái timeout nào sinh ra nó, và giao dịch đang ở trạng thái nào</span></span></a>
<a class="link-card" href="https://microservices.io/patterns/data/transactional-outbox.html" target="_blank" rel="noopener"><span class="lc-ico">📤</span><span class="lc-body"><span class="lc-title">Mẫu transactional outbox</span><span class="lc-sub">microservices.io · Bài viết kinh điển, kèm cả hệ quả "ít nhất một lần"</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js, chương tác vụ nền</span><span class="lc-sub">Thợ chạy nền, thử lại và lùi dần — nơi một bên tiêu thụ outbox thật sự sinh sống</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Làm một endpoint thanh toán thành idempotent, rồi chứng minh gửi trùng hai lần chỉ tính tiền một lần</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — Six concurrency problems, six answers|||7.5 — Sáu bài toán tranh chấp, sáu lời giải',
      slug: 'pr-7-5-sach-cong-thuc',
      type: 'LESSON',
      description: 'Sách công thức: bộ đếm lượt xem, sinh slug duy nhất, đặt chỗ ngồi cuối cùng, giới hạn tần suất, chuyển số dư, và hàng đợi việc — mỗi bài kèm bản ngây thơ hỏng ở đâu, lời giải đúng, và lý do chọn đúng công cụ trong bốn công cụ của chương này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Six concurrency problems, six answers</h2>
<p class="lead">This chapter has given you four tools: atomic operators, preconditions in a <code>where</code>, locks, and isolation levels. Here are the six problems you will actually meet, each with the naive version, where it breaks, and which tool is right. The pattern to notice is that the heaviest tool is almost never the answer.</p>

<h3>1 · A view counter</h3>
<pre><code><span class="tok-comment">// Naive — loses writes under any concurrency (Lesson 4.4 measured 77 of 100)</span>
const p = await prisma.post.findUniqueOrThrow({ where: { id } });
await prisma.post.update({ where: { id }, data: { views: p.views + 1 } });

<span class="tok-comment">// Correct — one statement, computed by the database</span>
await prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Tool: atomic operator</span><span class="v">No transaction, no lock, no retry. The arithmetic happens under a row lock PostgreSQL takes for the duration of one statement.</span></div>
  <div class="kv"><span class="k">At very high volume</span><span class="v">Every increment on the same row serialises on that row's lock. A post going viral becomes a hot row. The answer then is to count in Redis and flush periodically, or to insert one row per view and aggregate — both trade accuracy-now for throughput.</span></div>
</div>

<h3>2 · A unique slug</h3>
<pre><code><span class="tok-comment">// Naive — two requests both find the slug free, both insert</span>
const daCo = await prisma.post.findUnique({ where: { slug } });
if (daCo) throw new Error('Trung slug');
await prisma.post.create({ data: { slug, title } });

<span class="tok-comment">// Correct — let the constraint decide, and handle the collision</span>
async function taoBai(title: string) {
  const goc = taoSlug(title);
  for (let i = 0; i &lt; 5; i++) {
    const slug = i === 0 ? goc : &#96;\${goc}-\${i}&#96;;
    try {
      return await prisma.post.create({ data: { slug, title } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') continue;
      throw e;
    }
  }
  return prisma.post.create({ data: { slug: &#96;\${goc}-\${crypto.randomUUID().slice(0, 8)}&#96;, title } });
}</code></pre>
<div class="callout ok">
<p><strong>Insert and catch beats check and insert, every time.</strong> The check-then-insert version is two round trips and still races; the insert-and-catch version is one round trip and is correct by construction, because the unique index is enforced atomically. The loop handles the ordinary case of a genuinely duplicate title, and the final fallback guarantees termination.</p>
</div>

<h3>3 · The last seat</h3>
<pre><code><span class="tok-comment">// Naive — both buyers read stock: 1, both decrement, stock: -1</span>
const g = await prisma.ghe.findUniqueOrThrow({ where: { id } });
if (g.conLai &lt; 1) throw new Error('Het ghe');
await prisma.ghe.update({ where: { id }, data: { conLai: { decrement: 1 } } });

<span class="tok-comment">// Correct — the precondition IS the where clause</span>
const r = await prisma.ghe.updateMany({
  where: { id, conLai: { gt: 0 } },
  data:  { conLai: { decrement: 1 } },
});
if (r.count === 0) throw new Error('Het ghe');</code></pre>
<pre><code><span class="tok-comment">-- And the constraint that makes the bug impossible even from psql</span>
ALTER TABLE "ghe" ADD CONSTRAINT "ghe_con_lai_khong_am" CHECK ("con_lai" &gt;= 0);</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Tool: precondition + constraint</span><span class="lz-t">No lock needed</span><span class="lz-d">The <code>where</code> makes check and write one statement. The <code>CHECK</code> is the second line of defence, and it protects against every writer including ones that are not your application.</span></div>
  <div class="lz-step"><span class="lz-k">When the booking spans two tables</span><span class="lz-t">Then you lock</span><span class="lz-d">"Decrement the seat count AND insert a ticket AND charge" is a transaction with a <code>FOR UPDATE</code> on the seat row. The precondition trick only covers a single-table guard.</span></div>
</div>

<h3>4 · A rate limit</h3>
<pre><code><span class="tok-comment">// Naive — count, then decide. Two requests both count 9 of 10.</span>
const n = await prisma.apiCall.count({
  where: { userId, taoLuc: { gte: motPhutTruoc } },
});
if (n &gt;= 10) throw new Error('Qua nhieu yeu cau');
await prisma.apiCall.create({ data: { userId } });

<span class="tok-comment">// Better in PostgreSQL — insert and count in ONE statement</span>
const [kq] = await prisma.$queryRaw&lt;{ dem: number }[]&gt;&#96;
  WITH them AS (
    INSERT INTO api_calls (user_id, tao_luc) VALUES (\${userId}, now()) RETURNING id
  )
  SELECT count(*)::int AS dem FROM api_calls
  WHERE user_id = \${userId} AND tao_luc &gt;= now() - interval '1 minute'&#96;;

if (kq.dem &gt; 10) throw new Error('Qua nhieu yeu cau');</code></pre>
<div class="callout warn">
<p><strong>Rate limiting in PostgreSQL is possible and usually the wrong place for it.</strong> Every request becomes a write, which means WAL, replication traffic, and a table that needs constant cleanup. Redis exists for exactly this: a sliding-window counter with an expiry is one command and no persistence cost, and the CuongThai Redis course covers the pattern. Use the database only when the limit must survive a Redis restart — a monthly quota, a billing cap.</p>
</div>

<h3>5 · A balance transfer</h3>
<pre><code><span class="tok-comment">// Naive — everything wrong at once: read-then-write, no ordering, no idempotency</span>
const tu = await prisma.taiKhoan.findUniqueOrThrow({ where: { id: tuId } });
if (tu.soDu &lt; tien) throw new Error('Khong du');
await prisma.taiKhoan.update({ where: { id: tuId },  data: { soDu: tu.soDu - tien } });
await prisma.taiKhoan.update({ where: { id: denId }, data: { soDu: { increment: tien } } });</code></pre>
<pre><code><span class="tok-comment">// Correct — ordered locks, atomic operators, an idempotency key, a retry</span>
async function chuyen(tuId: number, denId: number, tien: number, khoa: string) {
  const [a, b] = [tuId, denId].sort((x, y) =&gt; x - y);

  return chayLai(() =&gt;
    prisma.$transaction(async (tx) =&gt; {
      await tx.$queryRaw&#96;SELECT id FROM tai_khoan WHERE id IN (\${a}, \${b}) ORDER BY id FOR UPDATE&#96;;

      const r = await tx.taiKhoan.updateMany({
        where: { id: tuId, soDu: { gte: tien } },
        data:  { soDu: { decrement: tien } },
      });
      if (r.count === 0) throw new Error('So du khong du');

      await tx.taiKhoan.update({ where: { id: denId }, data: { soDu: { increment: tien } } });
      return tx.giaoDich.create({ data: { khoa, tuId, denId, tien } });
    }),
  );
}</code></pre>
<div class="out">-- 200 concurrent transfers between 20 accounts
sum(so_du) truoc: 2000000.00
sum(so_du) sau  : 2000000.00     ← conserved, which is the only test that matters
so giao dich    : 200
so lan thu lai  : 3</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Every tool from this chapter, and each earns its place</span><span class="v">Sorted locks prevent deadlock (7.3), the precondition prevents overdraft (4.4), the atomic operator prevents lost updates (4.4), the idempotency key prevents double-charging on retry (7.4), and the retry handles the deadlock that arrives from a path you have not written yet (7.2).</span></div>
  <div class="kv"><span class="k">The test is conservation</span><span class="v">Sum the balances before and after. Money moving between accounts must leave the total unchanged, and no unit test of a single transfer catches what two hundred concurrent ones do.</span></div>
  <div class="kv"><span class="k">Do not reach for Serializable here</span><span class="v">It would also be correct, and it would fail far more transfers under contention. Targeted locks on two rows serialise only the accounts involved.</span></div>
</div>

<h3>6 · A job queue</h3>
<pre><code><span class="tok-comment">// Naive — every worker picks the same job</span>
const job = await prisma.job.findFirst({ where: { status: 'CHO' }, orderBy: { taoLuc: 'asc' } });
await prisma.job.update({ where: { id: job.id }, data: { status: 'DANG_CHAY' } });

<span class="tok-comment">// Correct — SKIP LOCKED hands each worker a different row</span>
async function nhanViec() {
  return prisma.$transaction(async (tx) =&gt; {
    const [v] = await tx.$queryRaw&lt;{ id: number }[]&gt;&#96;
      SELECT id FROM jobs WHERE status = 'CHO'
      ORDER BY tao_luc FOR UPDATE SKIP LOCKED LIMIT 1&#96;;
    if (!v) return null;
    return tx.job.update({
      where: { id: v.id },
      data:  { status: 'DANG_CHAY', nhanLuc: new Date(), soLan: { increment: 1 } },
    });
  });
}</code></pre>
<pre><code><span class="tok-comment">// The part people forget: a job whose worker died</span>
await prisma.job.updateMany({
  where: {
    status:  'DANG_CHAY',
    nhanLuc: { lt: new Date(Date.now() - 5 * 60_000) },   <span class="tok-comment">// stuck for 5 minutes</span>
    soLan:   { lt: 3 },
  },
  data: { status: 'CHO' },
});</code></pre>
<div class="callout ok">
<p><strong>A queue is not finished until it recovers from a dead worker.</strong> <code>SKIP LOCKED</code> hands out jobs correctly; nothing hands them back when the process holding one is killed. The reclaim query above — run on a timer — is what turns a working queue into a reliable one, and the <code>soLan</code> bound is what stops a poisoned job from being retried forever.</p>
</div>

<h3>The pattern across all six</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Reach for first</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A constraint</span><span class="lz-nsub">Unique index, CHECK, foreign key. Enforced against every writer, costs nothing, cannot be bypassed. Problems 2 and 3.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">One statement</span><span class="lz-nsub">An atomic operator, or the precondition in the <code>where</code>. No transaction, no lock, no retry. Problems 1 and 3.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">When one statement cannot express it</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A targeted lock</span><span class="lz-nsub"><code>FOR UPDATE</code> in ascending key order, or <code>SKIP LOCKED</code> for queues. Serialises only the contended rows. Problems 5 and 6.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">An idempotency key</span><span class="lz-nsub">Whenever a retry could repeat a side effect. Not a concurrency tool exactly — a correctness tool that concurrency makes necessary. Problem 5.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Last</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Serializable + retry</span><span class="lz-nsub">For invariants across several tables that nothing above can express. Correct, costly under contention, and requires the retry wrapper to be safe at all.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A different system</span><span class="lz-nsub">Rate limits in Redis, high-volume counters in Redis, real queues in a broker. Recognising that the database is the wrong tool is a valid answer. Problem 4.</span></div></div>
  </div>
</div>
<div class="callout">
<p><strong>The habit worth building is the test, not the pattern.</strong> Every fix in this lesson looks obviously correct once written, and so did every naive version. The only thing that distinguishes them is running two hundred of them at once and checking an invariant afterwards — a conserved sum, a count that matches, a stock that never went negative. Write that test first; it is the only one that fails on the naive code.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#dependent-writes" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Dependent writes and transactions</span><span class="lc-sub">prisma.io/docs · Prisma's own decision guide for which mechanism a given write needs</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/mvcc.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — concurrency control</span><span class="lc-sub">postgresql.org · MVCC, row locks and the guarantees underneath every pattern here</span></span></a>
<a class="link-card" href="https://brandur.org/postgres-queues" target="_blank" rel="noopener"><span class="lc-ico">📬</span><span class="lc-body"><span class="lc-title">Postgres queues — Brandur Leach</span><span class="lc-sub">brandur.org · The SKIP LOCKED queue in production detail, including the reclaim problem</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">Rate limits and hot counters, where PostgreSQL is the wrong tool — problem 4 done properly</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Write the conservation test first, watch all six naive versions fail it, then fix them</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Sáu bài toán tranh chấp, sáu lời giải</h2>
<p class="lead">Chương này đã đưa cho bạn bốn công cụ: toán tử nguyên tử, tiền điều kiện trong <code>where</code>, khoá, và mức cô lập. Đây là sáu bài toán bạn sẽ thật sự gặp, mỗi bài kèm bản ngây thơ, chỗ nó vỡ, và công cụ nào là đúng. Điều đáng để ý là công cụ nặng nhất hầu như không bao giờ là câu trả lời.</p>

<h3>1 · Bộ đếm lượt xem</h3>
<pre><code><span class="tok-comment">// Ngây thơ — mất lần ghi khi có tranh chấp (Bài 4.4 đo được 77 trên 100)</span>
const p = await prisma.post.findUniqueOrThrow({ where: { id } });
await prisma.post.update({ where: { id }, data: { views: p.views + 1 } });

<span class="tok-comment">// Đúng — một câu lệnh, do cơ sở dữ liệu tính</span>
await prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Công cụ: toán tử nguyên tử</span><span class="v">Không giao dịch, không khoá, không thử lại. Phép tính xảy ra dưới một khoá hàng mà PostgreSQL giữ trong suốt một câu lệnh.</span></div>
  <div class="kv"><span class="k">Khi lưu lượng cực lớn</span><span class="v">Mọi lần tăng trên cùng một hàng đều tuần tự hoá trên khoá của hàng đó. Một bài viết viral thành một hàng nóng. Câu trả lời khi ấy là đếm trong Redis rồi định kỳ đổ xuống, hoặc chèn mỗi lượt xem một hàng rồi tổng hợp — cả hai đánh đổi độ chính xác tức thời lấy thông lượng.</span></div>
</div>

<h3>2 · Một slug duy nhất</h3>
<pre><code><span class="tok-comment">// Ngây thơ — hai yêu cầu đều thấy slug còn trống, đều chèn</span>
const daCo = await prisma.post.findUnique({ where: { slug } });
if (daCo) throw new Error('Trung slug');
await prisma.post.create({ data: { slug, title } });

<span class="tok-comment">// Đúng — để ràng buộc quyết, và xử lý va chạm</span>
async function taoBai(title: string) {
  const goc = taoSlug(title);
  for (let i = 0; i &lt; 5; i++) {
    const slug = i === 0 ? goc : &#96;\${goc}-\${i}&#96;;
    try {
      return await prisma.post.create({ data: { slug, title } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') continue;
      throw e;
    }
  }
  return prisma.post.create({ data: { slug: &#96;\${goc}-\${crypto.randomUUID().slice(0, 8)}&#96;, title } });
}</code></pre>
<div class="callout ok">
<p><strong>Chèn rồi bắt lỗi thắng kiểm rồi chèn, lần nào cũng vậy.</strong> Bản kiểm-rồi-chèn là hai lượt đi về mà vẫn có tranh chấp; bản chèn-rồi-bắt là một lượt đi về và đúng ngay từ cấu trúc, vì chỉ mục unique được thi hành một cách nguyên tử. Vòng lặp xử lý trường hợp bình thường là tiêu đề trùng thật, còn nhánh dự phòng cuối cùng bảo đảm nó luôn kết thúc.</p>
</div>

<h3>3 · Cái ghế cuối cùng</h3>
<pre><code><span class="tok-comment">// Ngây thơ — hai người mua đều đọc conLai: 1, đều trừ, thành conLai: -1</span>
const g = await prisma.ghe.findUniqueOrThrow({ where: { id } });
if (g.conLai &lt; 1) throw new Error('Het ghe');
await prisma.ghe.update({ where: { id }, data: { conLai: { decrement: 1 } } });

<span class="tok-comment">// Đúng — tiền điều kiện CHÍNH LÀ mệnh đề where</span>
const r = await prisma.ghe.updateMany({
  where: { id, conLai: { gt: 0 } },
  data:  { conLai: { decrement: 1 } },
});
if (r.count === 0) throw new Error('Het ghe');</code></pre>
<pre><code><span class="tok-comment">-- Và cái ràng buộc khiến con bọ thành bất khả ngay cả khi gõ từ psql</span>
ALTER TABLE "ghe" ADD CONSTRAINT "ghe_con_lai_khong_am" CHECK ("con_lai" &gt;= 0);</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Công cụ: tiền điều kiện cộng ràng buộc</span><span class="lz-t">Không cần khoá</span><span class="lz-d">Mệnh đề <code>where</code> làm phép kiểm và phép ghi thành một câu lệnh. Cái <code>CHECK</code> là tuyến phòng thủ thứ hai, và nó bảo vệ trước mọi bên ghi kể cả những bên không phải ứng dụng của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Khi việc đặt chỗ trải qua hai bảng</span><span class="lz-t">Thì bạn khoá</span><span class="lz-d">"Trừ số ghe VÀ chèn một vé VÀ thu tiền" là một giao dịch có <code>FOR UPDATE</code> lên hàng ghế. Mẹo tiền điều kiện chỉ bao được một hàng rào trong cùng một bảng.</span></div>
</div>

<h3>4 · Giới hạn tần suất</h3>
<pre><code><span class="tok-comment">// Ngây thơ — đếm, rồi quyết. Hai yêu cầu đều đếm ra 9 trên 10.</span>
const n = await prisma.apiCall.count({
  where: { userId, taoLuc: { gte: motPhutTruoc } },
});
if (n &gt;= 10) throw new Error('Qua nhieu yeu cau');
await prisma.apiCall.create({ data: { userId } });

<span class="tok-comment">// Tốt hơn trong PostgreSQL — chèn và đếm trong MỘT câu lệnh</span>
const [kq] = await prisma.$queryRaw&lt;{ dem: number }[]&gt;&#96;
  WITH them AS (
    INSERT INTO api_calls (user_id, tao_luc) VALUES (\${userId}, now()) RETURNING id
  )
  SELECT count(*)::int AS dem FROM api_calls
  WHERE user_id = \${userId} AND tao_luc &gt;= now() - interval '1 minute'&#96;;

if (kq.dem &gt; 10) throw new Error('Qua nhieu yeu cau');</code></pre>
<div class="callout warn">
<p><strong>Giới hạn tần suất trong PostgreSQL là khả thi và thường là chỗ sai để làm việc đó.</strong> Mọi yêu cầu đều thành một lần ghi, nghĩa là WAL, lưu lượng nhân bản, và một cái bảng cần dọn dẹp liên tục. Redis tồn tại đúng cho việc này: một bộ đếm cửa sổ trượt kèm hạn dùng chỉ là một câu lệnh và không tốn chi phí lưu lâu dài, và khoá Redis của CuongThai nói về mẫu đó. Chỉ dùng cơ sở dữ liệu khi cái giới hạn ấy buộc phải sống sót qua một lần Redis khởi động lại — một hạn mức theo tháng, một trần tính tiền.</p>
</div>

<h3>5 · Chuyển số dư</h3>
<pre><code><span class="tok-comment">// Ngây thơ — sai tất cả cùng lúc: đọc-rồi-ghi, không thứ tự khoá, không idempotent</span>
const tu = await prisma.taiKhoan.findUniqueOrThrow({ where: { id: tuId } });
if (tu.soDu &lt; tien) throw new Error('Khong du');
await prisma.taiKhoan.update({ where: { id: tuId },  data: { soDu: tu.soDu - tien } });
await prisma.taiKhoan.update({ where: { id: denId }, data: { soDu: { increment: tien } } });</code></pre>
<pre><code><span class="tok-comment">// Đúng — khoá theo thứ tự, toán tử nguyên tử, một khoá idempotent, một lớp thử lại</span>
async function chuyen(tuId: number, denId: number, tien: number, khoa: string) {
  const [a, b] = [tuId, denId].sort((x, y) =&gt; x - y);

  return chayLai(() =&gt;
    prisma.$transaction(async (tx) =&gt; {
      await tx.$queryRaw&#96;SELECT id FROM tai_khoan WHERE id IN (\${a}, \${b}) ORDER BY id FOR UPDATE&#96;;

      const r = await tx.taiKhoan.updateMany({
        where: { id: tuId, soDu: { gte: tien } },
        data:  { soDu: { decrement: tien } },
      });
      if (r.count === 0) throw new Error('So du khong du');

      await tx.taiKhoan.update({ where: { id: denId }, data: { soDu: { increment: tien } } });
      return tx.giaoDich.create({ data: { khoa, tuId, denId, tien } });
    }),
  );
}</code></pre>
<div class="out">-- 200 lần chuyển song song giữa 20 tài khoản
sum(so_du) truoc: 2000000.00
sum(so_du) sau  : 2000000.00     ← bảo toàn, và đó là phép kiểm duy nhất có ý nghĩa
so giao dich    : 200
so lan thu lai  : 3</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi công cụ của chương này, và cái nào cũng xứng chỗ của nó</span><span class="v">Khoá đã sắp thứ tự chặn khoá chết (7.3), tiền điều kiện chặn rút quá số dư (4.4), toán tử nguyên tử chặn mất cập nhật (4.4), khoá idempotent chặn tính tiền hai lần khi thử lại (7.4), và lớp thử lại xử lý cái khoá chết đến từ một nhánh bạn chưa viết (7.2).</span></div>
  <div class="kv"><span class="k">Phép kiểm là tính bảo toàn</span><span class="v">Cộng tổng số dư trước và sau. Tiền chuyển giữa các tài khoản phải để tổng không đổi, và không một bài kiểm đơn vị nào cho một lần chuyển bắt được thứ mà hai trăm lần chuyển song song làm.</span></div>
  <div class="kv"><span class="k">Đừng với tay tới Serializable ở đây</span><span class="v">Nó cũng đúng, và nó sẽ làm hỏng nhiều lần chuyển hơn hẳn khi có tranh chấp. Khoá đúng trọng tâm lên hai hàng chỉ tuần tự hoá đúng những tài khoản liên quan.</span></div>
</div>

<h3>6 · Hàng đợi việc</h3>
<pre><code><span class="tok-comment">// Ngây thơ — mọi thợ đều nhặt trúng cùng một việc</span>
const job = await prisma.job.findFirst({ where: { status: 'CHO' }, orderBy: { taoLuc: 'asc' } });
await prisma.job.update({ where: { id: job.id }, data: { status: 'DANG_CHAY' } });

<span class="tok-comment">// Đúng — SKIP LOCKED đưa cho mỗi thợ một hàng khác nhau</span>
async function nhanViec() {
  return prisma.$transaction(async (tx) =&gt; {
    const [v] = await tx.$queryRaw&lt;{ id: number }[]&gt;&#96;
      SELECT id FROM jobs WHERE status = 'CHO'
      ORDER BY tao_luc FOR UPDATE SKIP LOCKED LIMIT 1&#96;;
    if (!v) return null;
    return tx.job.update({
      where: { id: v.id },
      data:  { status: 'DANG_CHAY', nhanLuc: new Date(), soLan: { increment: 1 } },
    });
  });
}</code></pre>
<pre><code><span class="tok-comment">// Phần người ta hay quên: một việc mà thợ của nó đã chết</span>
await prisma.job.updateMany({
  where: {
    status:  'DANG_CHAY',
    nhanLuc: { lt: new Date(Date.now() - 5 * 60_000) },   <span class="tok-comment">// kẹt 5 phút</span>
    soLan:   { lt: 3 },
  },
  data: { status: 'CHO' },
});</code></pre>
<div class="callout ok">
<p><strong>Một hàng đợi chưa hoàn thành cho tới khi nó phục hồi được sau khi một thợ chết.</strong> <code>SKIP LOCKED</code> phát việc ra đúng cách; không có gì thu việc về khi tiến trình đang giữ nó bị giết. Câu truy vấn đòi lại ở trên — chạy theo một bộ định thời — là thứ biến một hàng đợi chạy được thành một hàng đợi đáng tin, và cái chặn <code>soLan</code> là thứ ngăn một việc độc bị thử lại vô tận.</p>
</div>

<h3>Cái mẫu chung của cả sáu</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Với tay tới trước tiên</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một ràng buộc</span><span class="lz-nsub">Chỉ mục unique, CHECK, khoá ngoại. Thi hành với mọi bên ghi, không tốn gì, không đi vòng được. Bài 2 và 3.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một câu lệnh</span><span class="lz-nsub">Một toán tử nguyên tử, hoặc tiền điều kiện trong <code>where</code>. Không giao dịch, không khoá, không thử lại. Bài 1 và 3.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Khi một câu lệnh không diễn đạt nổi</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một khoá đúng trọng tâm</span><span class="lz-nsub"><code>FOR UPDATE</code> theo thứ tự khoá tăng dần, hoặc <code>SKIP LOCKED</code> cho hàng đợi. Chỉ tuần tự hoá những hàng bị tranh chấp. Bài 5 và 6.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một khoá idempotent</span><span class="lz-nsub">Bất cứ khi nào một lần thử lại có thể lặp lại một tác dụng phụ. Không hẳn là công cụ tranh chấp — là công cụ về tính đúng mà tranh chấp khiến nó trở nên cần thiết. Bài 5.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cuối cùng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Serializable cộng thử lại</span><span class="lz-nsub">Cho những bất biến trải qua nhiều bảng mà không thứ gì ở trên diễn đạt nổi. Đúng, đắt khi có tranh chấp, và cần lớp bọc thử lại thì mới an toàn.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một hệ thống khác</span><span class="lz-nsub">Giới hạn tần suất trong Redis, bộ đếm lưu lượng lớn trong Redis, hàng đợi thật trong một broker. Nhận ra rằng cơ sở dữ liệu là công cụ sai cũng là một câu trả lời hợp lệ. Bài 4.</span></div></div>
  </div>
</div>
<div class="callout">
<p><strong>Thói quen đáng gây dựng là bài kiểm, không phải cái mẫu.</strong> Mọi cách vá trong bài này đều trông hiển nhiên đúng khi đã viết ra, và mọi bản ngây thơ cũng vậy. Thứ duy nhất phân biệt chúng là chạy hai trăm cái cùng lúc rồi kiểm một bất biến sau đó — một tổng được bảo toàn, một số đếm khớp, một mức tồn kho không bao giờ âm. Hãy viết bài kiểm đó trước; nó là bài kiểm duy nhất trượt trên mã ngây thơ.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/queries/transactions#dependent-writes" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Dependent writes and transactions</span><span class="lc-sub">prisma.io/docs · Hướng dẫn của chính Prisma về việc một lần ghi cho trước cần cơ chế nào</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/mvcc.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — điều khiển tranh chấp</span><span class="lc-sub">postgresql.org · MVCC, khoá hàng và những bảo đảm nằm dưới mọi mẫu ở đây</span></span></a>
<a class="link-card" href="https://brandur.org/postgres-queues" target="_blank" rel="noopener"><span class="lc-ico">📬</span><span class="lc-body"><span class="lc-title">Postgres queues — Brandur Leach</span><span class="lc-sub">brandur.org · Hàng đợi SKIP LOCKED ở mức chi tiết production, kể cả bài toán đòi lại việc</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">Giới hạn tần suất và bộ đếm nóng, nơi PostgreSQL là công cụ sai — bài 4 làm cho tử tế</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Viết bài kiểm bảo toàn trước, xem cả sáu bản ngây thơ trượt nó, rồi vá chúng</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 7.6 ─────────────────────────── */
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Trắc nghiệm Chương 7',
      slug: 'pr-7-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu: hai dạng $transaction, gọi prisma thay vì tx, mức cô lập nào chặn lệch ghi, giao kèo của Serializable, SKIP LOCKED, khoá chết và thứ tự, timeout 5 giây, và vì sao cần khoá idempotent.',
      content: `
<div class="ml-en">
<p>Eight questions on transactions and concurrency. Every one of them corresponds to a failure that only appears under real load — which is why they are worth knowing before the load arrives.</p>
</div>
<div class="ml-vi">
<p>Tám câu về giao dịch và tranh chấp. Câu nào cũng ứng với một kiểu hỏng chỉ lộ ra khi có tải thật — và vì thế chúng đáng biết trước khi tải kéo tới.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What can the interactive `$transaction` do that the array form cannot?|||`$transaction` dạng tương tác làm được gì mà dạng mảng không làm được?',
            options: [
              'Run JavaScript logic between a read and a write, using the value it just read to decide what to write|||Chạy logic JavaScript giữa một lần đọc và một lần ghi, dùng giá trị vừa đọc để quyết ghi gì',
              'Guarantee atomicity — the array form runs each query in its own transaction|||Bảo đảm tính nguyên tử — dạng mảng chạy mỗi câu truy vấn trong một giao dịch riêng',
              'Set an isolation level, which the array form does not support|||Đặt mức cô lập, thứ mà dạng mảng không hỗ trợ',
              'Run queries in parallel, which the array form serialises|||Chạy các truy vấn song song, trong khi dạng mảng thì tuần tự hoá chúng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You call `prisma.user.findUnique` instead of `tx.user.findUnique` inside a transaction. What happens?|||Bạn gọi `prisma.user.findUnique` thay vì `tx.user.findUnique` bên trong một giao dịch. Chuyện gì xảy ra?',
            options: [
              'It runs on a different connection outside the transaction — it cannot see the uncommitted writes, and on a busy pool it can self-deadlock into P2024|||Nó chạy trên một kết nối khác, bên ngoài giao dịch — nó không thấy các lần ghi chưa commit, và trên một pool bận nó có thể tự khoá chết thành P2024',
              'Nothing — Prisma detects the enclosing transaction and routes the query into it|||Không sao — Prisma phát hiện giao dịch bao ngoài và định tuyến câu truy vấn vào đó',
              'TypeScript refuses to compile it|||TypeScript từ chối biên dịch nó',
              'It throws P2028 immediately|||Nó ném P2028 ngay lập tức',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Two transactions each count 1 admin, each decide there is room for 2, and both write. Which level prevents this?|||Hai giao dịch mỗi cái đếm được 1 admin, mỗi cái kết luận còn chỗ cho 2, và cả hai đều ghi. Mức nào chặn được?',
            options: [
              'Serializable — this is write skew, which even Repeatable Read permits|||Serializable — đây là lệch ghi, thứ mà ngay cả Repeatable Read cũng cho phép',
              'Repeatable Read — it prevents both transactions seeing stale counts|||Repeatable Read — nó ngăn cả hai giao dịch nhìn thấy số đếm cũ',
              'Read Committed — it already prevents this by design|||Read Committed — nó vốn đã chặn chuyện này theo thiết kế',
              'None — no isolation level can prevent it; only a lock can|||Không mức nào — không mức cô lập nào chặn được; chỉ khoá mới chặn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the contract you accept when you use Serializable?|||Bạn chấp nhận giao kèo gì khi dùng Serializable?',
            options: [
              'One of the conflicting transactions is aborted with P2034 and you must retry it — otherwise it is not safer, just differently broken|||Một trong các giao dịch xung đột bị huỷ với P2034 và bạn phải thử lại nó — nếu không thì nó không an toàn hơn, chỉ là hỏng theo kiểu khác',
              'Both transactions succeed, but one waits for the other to finish|||Cả hai giao dịch đều thành công, chỉ là một cái đợi cái kia xong',
              'Writes are queued and applied in commit order with no failures|||Các lần ghi được xếp hàng và áp dụng theo thứ tự commit, không có thất bại nào',
              'Reads become slower but nothing else changes|||Đọc chậm đi nhưng không có gì khác thay đổi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does `FOR UPDATE SKIP LOCKED` give you that `FOR UPDATE` does not?|||`FOR UPDATE SKIP LOCKED` cho bạn thứ gì mà `FOR UPDATE` không cho?',
            options: [
              'Locked rows are skipped instead of waited on, so N workers each take a different job with no coordination|||Các hàng đang bị khoá bị bỏ qua thay vì phải đợi, nên N thợ mỗi người nhận một việc khác nhau mà không cần phối hợp',
              'A shared lock, so several transactions can hold it at once|||Một khoá chia sẻ, để nhiều giao dịch cùng giữ được một lúc',
              'Automatic retry when the lock is contended|||Tự động thử lại khi khoá bị tranh chấp',
              'Protection against deadlock in every case|||Bảo vệ khỏi khoá chết trong mọi trường hợp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Two transfers between accounts 1 and 2, in opposite directions, deadlock. What is the fix?|||Hai lần chuyển khoản giữa tài khoản 1 và 2, ngược chiều nhau, gây khoá chết. Cách vá là gì?',
            options: [
              'Lock the rows in a deterministic order — sort the ids ascending before acquiring any lock|||Khoá các hàng theo một thứ tự tất định — sắp các id tăng dần trước khi lấy bất kỳ khoá nào',
              'Raise the transaction timeout so both have time to finish|||Nâng timeout của giao dịch để cả hai có thời gian hoàn tất',
              'Use Serializable, which prevents deadlocks entirely|||Dùng Serializable, nó chặn hẳn khoá chết',
              'Remove the FOR UPDATE — deadlocks only happen with explicit locks|||Bỏ FOR UPDATE đi — khoá chết chỉ xảy ra với khoá tường minh',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'An import of 10,000 rows inside a transaction fails with P2028 after 5 seconds. What is the right fix?|||Một lần nhập 10.000 hàng bên trong một giao dịch hỏng với P2028 sau 5 giây. Cách vá đúng là gì?',
            options: [
              'Batch it outside a transaction with createMany and skipDuplicates — raising the timeout would create a multi-minute transaction holding locks|||Chia lô ra ngoài giao dịch bằng createMany và skipDuplicates — nâng timeout sẽ tạo ra một giao dịch nhiều phút giữ đầy khoá',
              'Set timeout: 600000 so it has ten minutes|||Đặt timeout: 600000 để nó có mười phút',
              'Raise maxWait instead, since the delay is in acquiring the connection|||Nâng maxWait thay vào đó, vì độ trễ nằm ở khâu lấy kết nối',
              'Split it into 10,000 separate transactions, one per row|||Chẻ nó thành 10.000 giao dịch riêng, mỗi hàng một cái',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does a retry wrapper alone not make a payment safe?|||Vì sao chỉ một lớp bọc thử lại thôi thì chưa làm cho một lần thanh toán an toàn?',
            options: [
              'A transaction can commit and the acknowledgement be lost, so the retry charges twice — you need a caller-supplied idempotency key on a unique column|||Một giao dịch có thể commit rồi lời xác nhận bị mất, nên lần thử lại tính tiền hai lần — bạn cần một khoá idempotent do bên gọi cấp, đặt trên một cột unique',
              'Retries always use a different connection, so they cannot see the first attempt|||Các lần thử lại luôn dùng kết nối khác, nên chúng không nhìn thấy lần thử đầu',
              'The retry wrapper cannot catch P2034, only P2002|||Lớp bọc thử lại không bắt được P2034, chỉ bắt được P2002',
              'It is safe — a committed transaction can never be repeated|||Nó an toàn — một giao dịch đã commit không bao giờ lặp lại được',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
