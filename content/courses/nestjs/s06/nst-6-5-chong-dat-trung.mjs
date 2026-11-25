/**
 * 6.5 — Không đặt trùng: ràng buộc, exclusion constraint và optimistic locking (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Prisma 7.10.1, Nest 12.6.0, PostgreSQL 16.16, pool 10, 50 fetch đồng thời sau khi làm nóng pool + kết nối HTTP):
 * b65/race.ts — kiểm-rồi-ghi 49×201 (3/3 lần), trong $transaction Read Committed 10×201 (= cỡ pool, 3/3), Serializable 1×201 + 40×409 +
 * 9×500 (P2034 ×2, lỗi thô "TransactionWriteConflict" không có code ×7); migration --create-only + EXCLUDE USING gist (btree_gist,
 * tstzrange '[)') ⇒ 1×201 + 49×500 với P2039 originalCode 23P01 (3/3); kiểm-rồi-ghi + ràng buộc ⇒ 1×201, 1×409, 48×500.
 * b65/version.ts — không version: B ghi đè APPROVED; có version: B nhận 409, DB giữ APPROVED version 2.
 * Chú ý: lần đo đầu (chưa làm nóng) cả ba cách đều 1×201 — race chỉ lộ khi request thật sự đồng thời.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'api-design', bai: 'api-12-2-xay-dung', title: 'API Design 12.3 — Dựng trên PostgreSQL: luật do CSDL giữ', sub: 'Exclusion constraint cho LabFlow viết bằng SQL thuần — cùng ý tưởng, không qua ORM.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-7-3-khoa', title: 'Prisma ORM 7.3 — Khoá: bi quan, lạc quan, advisory', sub: 'SELECT … FOR UPDATE, advisory lock — các lời giải khác cho cùng bài toán.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-5-4-dong-thoi', title: 'API Design 5.4 — Khoá lạc quan bằng ETag, If-Match và 412', sub: 'Đưa version ra hợp đồng HTTP cho client.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-11-4-khoa-deadlock', title: 'PostgreSQL 11.4 — Khoá dòng, lost update và deadlock', sub: 'Lost update ở tầng SQL.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'PostgreSQL 16 — Range Types (exclusion constraints)', 'tstzrange, toán tử &&, EXCLUDE USING gist, btree_gist.', 'https://www.postgresql.org/docs/16/rangetypes.html'),
  nguon('🧯', 'Sakurity — Hacking Starbucks for unlimited coffee (2015)', 'Race condition khi chuyển tiền giữa thẻ quà tặng: hai request cùng lúc.', 'https://sakurity.com/blog/2015/05/21/starbucks.html'),
].join('\n');
const MA_RACE = "const trungVoi = (b: Don) => ({ roomId: b.roomId, status: { not: 'REJECTED' }, start: { lt: new Date(b.end) }, end: { gt: new Date(b.start) } });\n\n@Injectable()\nclass BookingsService {\n  constructor(private readonly db: PrismaService) {}\n  async kiemRoiGhi(b: Don, db: Prisma.TransactionClient = this.db) {\n    if (await db.booking.findFirst({ where: trungVoi(b) })) throw new ConflictException('trùng lịch');   // 1. kiểm\n    return db.booking.create({ data: { ...b, start: new Date(b.start), end: new Date(b.end) } });      // 2. ghi\n  }\n  create(b: Don) {\n    switch (process.env.CACH) {\n      case 'tx': return this.db.$transaction((tx) => this.kiemRoiGhi(b, tx));\n      case 'serializable': return this.db.$transaction((tx) => this.kiemRoiGhi(b, tx), { isolationLevel: 'Serializable', maxWait: 10000 })\n      case 'rang-buoc': return this.db.booking.create({ data: { ...b, start: new Date(b.start), end: new Date(b.end) } })  // DB tự chặn\n      default: return this.kiemRoiGhi(b);\n    }\n  }\n}";
const OUT_RACE = "CACH=kiem-roi-ghi · mã trả về: {\"201\":49,\"409\":1} · DB có 49 booking cho cùng khung giờ\nCACH=kiem-roi-ghi · mã trả về: {\"201\":49,\"409\":1} · DB có 49 booking cho cùng khung giờ\nCACH=kiem-roi-ghi · mã trả về: {\"201\":49,\"409\":1} · DB có 49 booking cho cùng khung giờ\nCACH=tx · mã trả về: {\"201\":10,\"409\":40} · DB có 10 booking cho cùng khung giờ\nCACH=tx · mã trả về: {\"201\":10,\"409\":40} · DB có 10 booking cho cùng khung giờ\nCACH=tx · mã trả về: {\"201\":10,\"409\":40} · DB có 10 booking cho cùng khung giờ\nCACH=serializable · mã trả về: {\"201\":1,\"409\":40,\"500\":9} · DB có 1 booking cho cùng khung giờ\nCACH=serializable · mã trả về: {\"201\":1,\"409\":40,\"500\":9} · DB có 1 booking cho cùng khung giờ\nCACH=serializable · mã trả về: {\"201\":1,\"409\":40,\"500\":9} · DB có 1 booking cho cùng khung giờ";
const OUT_P2034 = "      2 lỗi P2034 — Transaction failed due to a write conflict or a deadlock. Please retry your transaction\n      7 lỗi undefined — TransactionWriteConflict";
const OUT_MIG = "$ npx prisma migrate dev --create-only --name khong-dat-trung\n◇ injected env (1) from .env\nPrisma Migrate created the following migration without applying it 20261123234723_khong_dat_trung\nYou can now edit it and apply it by running prisma migrate dev.\n$ npx prisma migrate dev\nApplying migration `20261123234723_khong_dat_trung`\nThe following migration(s) have been applied:\nmigrations/\n  └─ 20261123234723_khong_dat_trung/\n    └─ migration.sql\nYour database is now in sync with your schema.";
const MA_MIG = "-- Viết tay: Prisma Schema không diễn tả được EXCLUDE ⇒ migration rỗng (--create-only) rồi tự điền.\n-- Hai booking cùng phòng, khoảng [start, end) giao nhau, cả hai chưa bị từ chối ⇒ PostgreSQL từ chối lệnh thứ hai.\nCREATE EXTENSION IF NOT EXISTS btree_gist;\n\nALTER TABLE \"Booking\" ADD CONSTRAINT \"Booking_khong_trung\"\n  EXCLUDE USING gist (\"roomId\" WITH =, tstzrange(\"start\", \"end\", '[)') WITH &&)\n  WHERE (status <> 'REJECTED');\n\nALTER TABLE \"Booking\" ADD CONSTRAINT \"Booking_start_truoc_end\" CHECK (\"start\" < \"end\");";
const OUT_RB = "     49 lỗi PrismaClientKnownRequestError P2039 — Database error. Code: `23P01`. Message: `conflicting key value violates exclusion constraint \"Booking_khong_trung\"` — gốc: 23P01\nCACH=rang-buoc · mã trả về: {\"201\":1,\"500\":49} · DB có 1 booking cho cùng khung giờ\nCACH=rang-buoc · mã trả về: {\"201\":1,\"500\":49} · DB có 1 booking cho cùng khung giờ\nCACH=rang-buoc · mã trả về: {\"201\":1,\"500\":49} · DB có 1 booking cho cùng khung giờ\nCACH=kiem-roi-ghi · mã trả về: {\"201\":1,\"409\":1,\"500\":48} · DB có 1 booking cho cùng khung giờ";
const MA_VER = "@Injectable()\nclass DuyetService {\n  constructor(private readonly db: PrismaService) {}\n  doc(id: number) { return this.db.booking.findUniqueOrThrow({ where: { id }, select: { id: true, status: true, version: true } }); }\n  async doiTrangThai(id: number, status: string, versionDaDoc: number) {\n    if (process.env.KICH === 'khong-version') return this.db.booking.update({ where: { id }, data: { status } });\n    const { count } = await this.db.booking.updateMany({                     // UPDATE … WHERE id = $1 AND version = $2\n      where: { id, version: versionDaDoc, status: 'PENDING' },\n      data: { status, version: { increment: 1 } },\n    });\n    if (count === 0) throw new ConflictException('booking đã bị người khác thay đổi — tải lại rồi thử lại');\n    return this.doc(id);\n  }\n}";
const OUT_VER = "$ KICH=khong-version node dist/b65/version.js\nA và B cùng thấy: {\"id\":1,\"status\":\"PENDING\",\"version\":1}\nA bấm APPROVED → {\"id\":1,\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T00:30:00.000Z\",\"end\":\"2027-01-05T02:30:00.000Z\",\"status\":\"APPROVED\",\"version\":1,\"createdAt\":\"2026-11-23T23:48:01.379Z\"}\nB bấm REJECTED → {\"id\":1,\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T00:30:00.000Z\",\"end\":\"2027-01-05T02:30:00.000Z\",\"status\":\"REJECTED\",\"version\":1,\"createdAt\":\"2026-11-23T23:48:01.379Z\"}\ncuối cùng trong DB: {\"id\":1,\"status\":\"REJECTED\",\"version\":1}\n$ KICH=version node dist/b65/version.js\nA và B cùng thấy: {\"id\":1,\"status\":\"PENDING\",\"version\":1}\nA bấm APPROVED → {\"id\":1,\"status\":\"APPROVED\",\"version\":2}\nB bấm REJECTED → 409 booking đã bị người khác thay đổi — tải lại rồi thử lại\ncuối cùng trong DB: {\"id\":1,\"status\":\"APPROVED\",\"version\":2}";
const OUT_BT = "$ LOC=1 CACH=serializable node dist/b65/race.js     # (tạm bỏ ràng buộc EXCLUDE để chỉ Serializable gác)\nCACH=serializable · mã trả về: {\"201\":1,\"409\":49} · DB có 1 booking cho cùng khung giờ\nCACH=serializable · mã trả về: {\"201\":1,\"409\":49} · DB có 1 booking cho cùng khung giờ\nCACH=serializable · mã trả về: {\"201\":1,\"409\":49} · DB có 1 booking cho cùng khung giờ";
const MA_LOC = "const goc = (e: any): string | undefined => e?.meta?.driverAdapterError?.cause?.originalCode ?? e?.cause?.originalCode;\nexport const laDungLich = (e: any) => goc(e) === '23P01';                                   // exclusion constraint\nexport const laXungDotGhi = (e: any) => e?.code === 'P2034' || e?.cause?.kind === 'TransactionWriteConflict' || e?.message === 'TransactionWriteConflict';";

export default {
  title: '6.5 — No double booking: constraints, exclusion constraints and optimistic locking|||6.5 — Không đặt trùng: ràng buộc, exclusion constraint và optimistic locking',
  slug: 'nst-6-5-chong-dat-trung',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài toán trung tâm của đề đặt phòng lab. 50 request đồng thời cùng đặt một khung giờ, đo thật bốn cách: kiểm-rồi-ghi cho 49 booking trùng, bọc trong transaction vẫn 10 (đúng bằng cỡ pool), Serializable còn 1 nhưng 9 request nhận 500 với lỗi không có mã, exclusion constraint của PostgreSQL (tstzrange + btree_gist, viết bằng migration tay của Prisma) còn đúng 1. Thêm optimistic locking bằng cột version để hai admin cùng duyệt không ghi đè nhau.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>6.5 — Fifty students, one slot</h2>
<p class="lead">Registration for lab slots opens at 7:00 and fifty students press "Book" for AL-301, 7:30–9:30, in the same second. Exactly one must get it. Lab-booking from milestone 5 checks for an overlapping booking and then inserts — the most natural code in the world, and the code behind countless double bookings. In this lesson we measure it, try the fixes people reach for, and end with the one that the database itself guarantees.</p>

<h3>Everyday analogy: two people, one last seat on the bus</h3>
<p>Two people look at the seating chart on their phones, both see seat 12A free, both tap "pay". If the system only <em>looked</em> before selling, both get a ticket for 12A. The fix is not "look more carefully" — it is a seat that physically cannot hold two people. A database constraint is that seat.</p>

<h3>The four ways under test</h3>
<pre><code class="language-ts">${esc(MA_RACE)}</code></pre>
<p>The client fires 50 <code>POST /bookings</code> at once for the same room and slot. One detail that matters: the first time I ran it, every way returned exactly one 201 — the requests were arriving a few milliseconds apart while the pool opened connections one by one, so they were effectively serial. A race only shows when requests are truly concurrent, so the script warms up first: it opens all pool connections and 50 HTTP keep-alive connections, then fires. That is also how production looks at 7:00. Three runs each:</p>
<div class="out">${esc(OUT_RACE)}</div>

<h3>Reading the numbers</h3>
<ul>
<li><strong>Check-then-write: 49 bookings for one slot.</strong> All 50 checks ran before the first insert committed, so all saw "free". (One got 409 because its check happened to run after a commit.) In-memory lab-booking had the same bug; it was just invisible with one user.</li>
<li><strong>Inside a transaction: 10 bookings</strong> — exactly the pool size. A transaction at the default level, <em>Read Committed</em>, does not make a check-then-write atomic: each transaction sees only data committed before its statement, and none of the ten concurrent ones had committed. It only limited how many ran at once.</li>
<li><strong>Serializable: 1 booking, but 9 × 500.</strong> PostgreSQL detected that the concurrent transactions could not be serialized and aborted some. Correct data — but the client got "server error" for an ordinary conflict, and the errors were not even consistent:</li>
</ul>
<div class="out">${esc(OUT_P2034)}</div>
<p>Two came as Prisma <code>P2034</code>, seven as a raw driver error with no <code>code</code> at all. A filter catching only <code>PrismaClientKnownRequestError</code> misses most of them. Serializable is a valid tool (with retries), but it is heavy machinery for a rule the database can state directly.</p>

<h3>The fix: an exclusion constraint</h3>
<p>A unique index can say "no two rows with the same value". Bookings need "no two rows for the same room whose time ranges overlap" — PostgreSQL expresses exactly that with an <strong>exclusion constraint</strong> over a range type. Prisma's schema language cannot describe it, so we create an empty migration and write the SQL by hand:</p>
<div class="out">${esc(OUT_MIG)}</div>
<pre><code class="language-sql">${esc(MA_MIG)}</code></pre>
<ul>
<li><code>tstzrange(start, "end", '[)')</code> — a half-open range: 7:30–9:30 and 9:30–11:00 touch but do not overlap, so back-to-back bookings are allowed.</li>
<li><code>&&</code> — "overlaps"; <code>roomId WITH =</code> — only within the same room (that equality on an integer inside a GiST index is what <code>btree_gist</code> provides).</li>
<li><code>WHERE (status &lt;&gt; 'REJECTED')</code> — a rejected booking frees the slot.</li>
<li>The <code>CHECK (start &lt; end)</code> rejects inverted ranges that would otherwise slip through.</li>
</ul>
<p>Now the same 50 requests, with the plain insert (no check at all) and with the old check-then-write kept in front:</p>
<div class="out">${esc(OUT_RB)}</div>
<p>One booking, every time — the database refuses the other 49 with SQLSTATE <code>23P01</code>, which Prisma 7 surfaces as <code>P2039</code> with <code>originalCode: '23P01'</code>. They are 500 because nothing maps them yet; Lab 6.6 turns them into 409 <code>BOOKING_CONFLICT</code>. Keeping the early check does not hurt (one friendlier 409), but it is no longer what protects you.</p>

<h3>Second problem: two admins, one booking — optimistic locking</h3>
<p>Admin A opens booking #1 to approve it; admin B opens it to reject it. Both read <code>PENDING, version 1</code>.</p>
<pre><code class="language-ts">${esc(MA_VER)}</code></pre>
<div class="out">${esc(OUT_VER)}</div>
<p>Without a version, B silently overwrote A: A's screen said "approved" (and maybe an email went out), the database says rejected — a <em>lost update</em>. With <code>updateMany({ where: { id, version } })</code>, B's update matched zero rows because the version had moved to 2, so B gets a 409 and reloads. No lock is held while the admins think; the check happens in the single <code>UPDATE … WHERE version = 1</code>. To put the version into the HTTP contract (ETag / If-Match / 412), see API Design 5.4.</p>

<h3>🛡 Real incident: Starbucks gift cards, 2015</h3>
<p>Security researcher Egor Homakov (Sakurity) found that transferring money between Starbucks gift cards was a two-step, check-then-act flow. By sending the confirmation step from two sessions at the same moment, a card holding $5 made <em>two</em> $5 transfers: the two cards together went from $10 to $20, and the money was spent in a real store to prove it. The issue was reported and the write-up published in May 2015 — it names "DB transactions used in a wrong way" among the fake protections, exactly what our 10-duplicate run shows. No hacking tools: just two simultaneous requests against code that "checked first". Any balance, voucher, seat or lab slot with check-then-write has the same hole; the fix is the same — make the database enforce the rule (constraint, atomic update with a condition, or a lock).</p>

<h3>🧪 Exercise</h3>
<p>Suppose your team cannot add the exclusion constraint this sprint and keeps the Serializable transaction. Make the API answer 409 instead of 500 for every lost race — both the <code>P2034</code> errors and the code-less raw ones — and prove it with 50 concurrent requests.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_LOC)}</code></pre>
<p>A catch-all filter (full code in Lab 6.6) uses these two predicates; with the exclusion constraint dropped, so that Serializable alone guards the slot:</p>
<div class="out">${esc(OUT_BT)}</div>
<p>1 × 201 and 49 × 409, three runs out of three. A production version would also <em>retry</em> a serialization failure once or twice before answering 409 — the losing transaction might have succeeded on a second try if the slot were different.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you prevent double booking?</strong> Let the database enforce it: in PostgreSQL an exclusion constraint over <code>tstzrange</code> with <code>&&</code>; elsewhere a unique slot table, a lock (<code>SELECT … FOR UPDATE</code> on the room) or Serializable with retries. Check-then-insert alone is a race.</li>
<li><strong>Doesn't a transaction fix the race?</strong> Not at Read Committed — measured: 10 duplicates, one per concurrent transaction.</li>
<li><strong>Optimistic vs pessimistic locking?</strong> Optimistic: version column, conditional update, 409 on conflict, no lock held during user think-time. Pessimistic: lock the row first, others wait; good for short, highly contended critical sections.</li>
<li><strong>Why do you need to warm up a race test?</strong> Otherwise connection setup serializes the requests and the test passes for the wrong reason.</li>
</ol>

<h3>💼 On the job</h3>
<p>Booking, inventory and payment systems in outsourcing projects almost always have a "check availability" query followed by an insert. In code review, ask one question: "what stops two requests from both passing the check?". If the answer is not a constraint, a lock or a conditional update, write the 50-request test before arguing — the numbers argue for you.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Check-then-act race</span><span class="v">Two requests pass the same check before either writes; both write.</span></div>
  <div class="kv"><span class="k">Read Committed</span><span class="v">PostgreSQL default: each statement sees data committed before it started; does not serialize check + insert.</span></div>
  <div class="kv"><span class="k">Serializable</span><span class="v">Aborts transactions that could not run in some serial order (P2034 / write conflict); needs retries.</span></div>
  <div class="kv"><span class="k">Exclusion constraint</span><span class="v">EXCLUDE USING gist (…): no two rows where all listed operators are true (= room, &amp;&amp; time range).</span></div>
  <div class="kv"><span class="k">tstzrange '[)'</span><span class="v">Time range including start, excluding end — adjacent bookings do not overlap.</span></div>
  <div class="kv"><span class="k">Optimistic locking</span><span class="v">Version column + UPDATE … WHERE version = n; zero rows updated ⇒ someone changed it ⇒ 409.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Under true concurrency, check-then-write gave 49 bookings for one slot; a Read Committed transaction gave 10.</li>
<li>Serializable kept the data right but surfaced as 500s with inconsistent error shapes.</li>
<li>An exclusion constraint (written as a hand-edited Prisma migration) gave exactly one booking every run.</li>
<li>For concurrent edits of one row, a version column and a conditional update prevent lost updates without holding locks.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>6.5 — Năm mươi sinh viên, một khung giờ</h2>
<p class="lead">Đăng ký phòng lab mở lúc 7:00 và năm mươi sinh viên cùng bấm "Đặt" phòng AL-301, 7:30–9:30, trong cùng một giây. Chỉ đúng một người được. Lab-booking ở mốc 5 kiểm xem có lịch chồng không rồi mới chèn — đoạn mã tự nhiên nhất trần đời, và cũng là đoạn mã đứng sau vô số lần đặt trùng. Bài này đo nó, thử các cách sửa mà người ta hay nghĩ tới, và kết thúc bằng cách mà chính cơ sở dữ liệu bảo đảm.</p>

<h3>Liên hệ đời thường: hai người, một ghế cuối trên xe</h3>
<p>Hai người cùng xem sơ đồ ghế trên điện thoại, cùng thấy ghế 12A trống, cùng bấm "thanh toán". Nếu hệ thống chỉ <em>nhìn</em> trước khi bán, cả hai đều có vé 12A. Cách sửa không phải "nhìn kỹ hơn" — mà là một cái ghế về mặt vật lý không thể chứa hai người. Ràng buộc trong DB chính là cái ghế đó.</p>

<h3>Bốn cách đem ra thử</h3>
<pre><code class="language-ts">${esc(MA_RACE)}</code></pre>
<p>Client bắn 50 <code>POST /bookings</code> cùng lúc cho cùng phòng, cùng khung giờ. Một chi tiết quan trọng: lần đầu tôi chạy, cách nào cũng ra đúng một 201 — các request tới cách nhau vài mili giây trong lúc pool mở từng kết nối, nên thực chất chúng chạy lần lượt. Race chỉ lộ khi request thật sự đồng thời, nên script làm nóng trước: mở sẵn mọi kết nối của pool và 50 kết nối HTTP keep-alive, rồi mới bắn. Production lúc 7:00 cũng trông như vậy. Mỗi cách ba lần:</p>
<div class="out">${esc(OUT_RACE)}</div>

<h3>Đọc các con số</h3>
<ul>
<li><strong>Kiểm-rồi-ghi: 49 booking cho một khung giờ.</strong> Cả 50 lần kiểm chạy xong trước khi lệnh chèn đầu tiên commit, nên cả 50 đều thấy "trống". (Một request nhận 409 vì lần kiểm của nó tình cờ chạy sau một lần commit.) Lab-booking trong bộ nhớ cũng mang đúng lỗi này; chỉ là với một người dùng thì không thấy.</li>
<li><strong>Trong transaction: 10 booking</strong> — đúng bằng cỡ pool. Transaction ở mức mặc định, <em>Read Committed</em>, không biến kiểm-rồi-ghi thành nguyên tử: mỗi transaction chỉ thấy dữ liệu đã commit trước câu lệnh của nó, và trong mười cái chạy song song chưa cái nào commit. Nó chỉ giới hạn bao nhiêu cái chạy cùng lúc.</li>
<li><strong>Serializable: 1 booking, nhưng 9 lần 500.</strong> PostgreSQL phát hiện các transaction đồng thời không thể xếp thành một thứ tự tuần tự và huỷ bớt. Dữ liệu đúng — nhưng client nhận "lỗi máy chủ" cho một xung đột bình thường, và các lỗi còn không cùng một hình dạng:</li>
</ul>
<div class="out">${esc(OUT_P2034)}</div>
<p>Hai cái tới dưới dạng <code>P2034</code> của Prisma, bảy cái là lỗi thô của driver không có <code>code</code> nào. Một filter chỉ bắt <code>PrismaClientKnownRequestError</code> sẽ sót phần lớn. Serializable là công cụ hợp lệ (kèm thử lại), nhưng là cỗ máy nặng cho một luật mà DB nói thẳng ra được.</p>

<h3>Cách sửa: exclusion constraint</h3>
<p>Chỉ mục unique nói được "không có hai dòng cùng giá trị". Booking cần "không có hai dòng cùng phòng mà khoảng thời gian giao nhau" — PostgreSQL diễn đạt đúng điều đó bằng <strong>exclusion constraint</strong> trên kiểu khoảng (range). Ngôn ngữ schema của Prisma không mô tả được, nên ta tạo một migration rỗng và tự viết SQL:</p>
<div class="out">${esc(OUT_MIG)}</div>
<pre><code class="language-sql">${esc(MA_MIG)}</code></pre>
<ul>
<li><code>tstzrange(start, "end", '[)')</code> — khoảng nửa mở: 7:30–9:30 và 9:30–11:00 chạm nhau nhưng không giao, nên đặt nối tiếp vẫn được.</li>
<li><code>&&</code> — "giao nhau"; <code>roomId WITH =</code> — chỉ xét trong cùng phòng (phép bằng trên số nguyên trong chỉ mục GiST là thứ <code>btree_gist</code> cung cấp).</li>
<li><code>WHERE (status &lt;&gt; 'REJECTED')</code> — booking bị từ chối thì nhả khung giờ.</li>
<li><code>CHECK (start &lt; end)</code> chặn các khoảng ngược lẽ ra sẽ lọt qua.</li>
</ul>
<p>Giờ cũng 50 request đó, với lệnh chèn trần (không kiểm gì) và với kiểm-rồi-ghi cũ vẫn giữ phía trước:</p>
<div class="out">${esc(OUT_RB)}</div>
<p>Một booking, lần nào cũng vậy — DB từ chối 49 lệnh còn lại với SQLSTATE <code>23P01</code>, mà Prisma 7 đưa lên thành <code>P2039</code> kèm <code>originalCode: '23P01'</code>. Chúng là 500 vì chưa có gì ánh xạ; Lab 6.6 biến chúng thành 409 <code>BOOKING_CONFLICT</code>. Giữ lần kiểm sớm cũng không sao (thêm một 409 thân thiện), nhưng nó không còn là thứ bảo vệ bạn.</p>

<h3>Vấn đề thứ hai: hai admin, một booking — optimistic locking</h3>
<p>Admin A mở booking #1 để duyệt; admin B mở nó để từ chối. Cả hai cùng đọc <code>PENDING, version 1</code>.</p>
<pre><code class="language-ts">${esc(MA_VER)}</code></pre>
<div class="out">${esc(OUT_VER)}</div>
<p>Không có version, B lặng lẽ ghi đè A: màn hình của A báo "đã duyệt" (có khi email đã gửi), còn DB nói đã từ chối — một <em>lost update</em>. Với <code>updateMany({ where: { id, version } })</code>, lệnh của B khớp 0 dòng vì version đã lên 2, nên B nhận 409 và tải lại. Không có khoá nào bị giữ trong lúc admin suy nghĩ; việc kiểm diễn ra trong đúng một câu <code>UPDATE … WHERE version = 1</code>. Đưa version vào hợp đồng HTTP (ETag / If-Match / 412) thì xem API Design 5.4.</p>

<h3>🛡 Sự cố thật: thẻ quà tặng Starbucks, 2015</h3>
<p>Nhà nghiên cứu bảo mật Egor Homakov (Sakurity) phát hiện việc chuyển tiền giữa các thẻ quà tặng Starbucks là luồng hai bước kiểu kiểm-rồi-làm. Gửi bước xác nhận từ hai phiên đăng nhập cùng một lúc, một thẻ chỉ có 5 đô đã chuyển đi <em>hai</em> lần 5 đô: tổng hai thẻ từ 10 đô thành 20 đô, và số tiền đó được tiêu thật ở cửa hàng để chứng minh. Lỗi được báo cho Starbucks và bài viết công bố tháng 5/2015 — trong đó kể "dùng transaction của DB sai cách" là một kiểu bảo vệ giả, đúng như lần đo ra 10 bản trùng ở trên. Không cần công cụ hack nào: chỉ hai request đồng thời nhắm vào đoạn mã "kiểm trước". Số dư, voucher, ghế ngồi hay khung giờ phòng lab nào dùng kiểm-rồi-ghi cũng thủng y như vậy; cách sửa cũng thế — để DB giữ luật (ràng buộc, lệnh cập nhật nguyên tử có điều kiện, hoặc khoá).</p>

<h3>🧪 Bài tập</h3>
<p>Giả sử sprint này nhóm bạn chưa được thêm exclusion constraint và giữ transaction Serializable. Hãy làm cho API trả 409 thay vì 500 cho mọi lần thua cuộc đua — cả lỗi <code>P2034</code> lẫn lỗi thô không có mã — và chứng minh bằng 50 request đồng thời.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_LOC)}</code></pre>
<p>Một filter bắt-tất-cả (mã đầy đủ ở Lab 6.6) dùng hai hàm kiểm này; tạm bỏ exclusion constraint để chỉ còn Serializable gác khung giờ:</p>
<div class="out">${esc(OUT_BT)}</div>
<p>1 × 201 và 49 × 409, ba lần như một. Bản production còn nên <em>thử lại</em> lỗi serialization một hai lần trước khi trả 409 — transaction thua có thể đã thành công ở lần thử hai nếu khung giờ khác.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Bạn chống đặt trùng thế nào?</strong> Để DB bảo đảm: ở PostgreSQL là exclusion constraint trên <code>tstzrange</code> với <code>&&</code>; nơi khác là bảng khe giờ có unique, khoá (<code>SELECT … FOR UPDATE</code> trên phòng) hoặc Serializable kèm thử lại. Chỉ kiểm-rồi-chèn là race.</li>
<li><strong>Transaction không sửa được race sao?</strong> Ở Read Committed thì không — đo được: 10 bản trùng, mỗi transaction đồng thời một bản.</li>
<li><strong>Khoá lạc quan khác khoá bi quan thế nào?</strong> Lạc quan: cột version, cập nhật có điều kiện, xung đột thì 409, không giữ khoá lúc người dùng suy nghĩ. Bi quan: khoá dòng trước, người khác chờ; hợp với đoạn găng ngắn và tranh chấp cao.</li>
<li><strong>Vì sao test race phải làm nóng trước?</strong> Không thì việc mở kết nối xếp hàng các request và test xanh vì lý do sai.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Hệ thống đặt chỗ, tồn kho, thanh toán ở dự án outsourcing gần như luôn có một truy vấn "kiểm còn chỗ" rồi một lệnh chèn. Khi review, hỏi đúng một câu: "cái gì ngăn hai request cùng qua được lần kiểm?". Nếu câu trả lời không phải ràng buộc, khoá hay cập nhật có điều kiện, hãy viết test 50 request trước khi tranh luận — con số sẽ nói thay bạn.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Race kiểm-rồi-làm</span><span class="v">Hai request cùng qua một lần kiểm trước khi bên nào ghi; cả hai cùng ghi.</span></div>
  <div class="kv"><span class="k">Read Committed</span><span class="v">Mặc định của PostgreSQL: mỗi câu lệnh thấy dữ liệu đã commit trước khi nó bắt đầu; không tuần tự hoá kiểm + chèn.</span></div>
  <div class="kv"><span class="k">Serializable</span><span class="v">Huỷ các transaction không xếp được theo thứ tự tuần tự (P2034 / xung đột ghi); cần thử lại.</span></div>
  <div class="kv"><span class="k">Exclusion constraint</span><span class="v">EXCLUDE USING gist (…): không có hai dòng mà mọi toán tử liệt kê đều đúng (= phòng, &amp;&amp; khoảng giờ).</span></div>
  <div class="kv"><span class="k">tstzrange '[)'</span><span class="v">Khoảng thời gian gồm điểm đầu, không gồm điểm cuối — booking nối tiếp không giao nhau.</span></div>
  <div class="kv"><span class="k">Optimistic locking</span><span class="v">Cột version + UPDATE … WHERE version = n; cập nhật 0 dòng ⇒ đã có người đổi ⇒ 409.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khi thật sự đồng thời, kiểm-rồi-ghi cho 49 booking một khung giờ; transaction Read Committed cho 10.</li>
<li>Serializable giữ dữ liệu đúng nhưng hiện ra thành các lỗi 500 với hình dạng lỗi không thống nhất.</li>
<li>Exclusion constraint (viết bằng migration Prisma sửa tay) cho đúng một booking ở mọi lần chạy.</li>
<li>Với sửa đồng thời một dòng, cột version và cập nhật có điều kiện chặn lost update mà không giữ khoá.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
