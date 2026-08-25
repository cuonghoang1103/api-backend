/**
 * Authentication — Chương 5: Refresh, xoay vòng và thu hồi.
 * Vì sao hai token · xoay vòng và phát hiện tái dùng · năm sự kiện phải kết thúc phiên ·
 * danh sách thiết bị · cuộc đua refresh · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 5 — Refresh, rotation and revocation|||Chương 5 — Refresh, xoay vòng và thu hồi',
  description: 'Chương 3 muốn thu hồi tức thì, Chương 4 muốn xác minh không cần tra cứu, và chương này là lời giải cho cả hai: một access token ngắn hạn đi cùng một refresh token CÓ trạng thái. Kèm phát hiện tái dùng theo HỌ token — thứ biến một refresh token bị cắp thành một cảnh báo thay vì một cú chiếm tài khoản — năm sự kiện bắt buộc phải kết thúc một phiên, và cuộc đua refresh làm hỏng nhiều bản cài đặt.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — Two tokens, because one cannot do both jobs|||5.1 — Hai token, vì một cái không làm nổi cả hai việc',
      slug: 'auth-5-1-hai-token',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Access token ngắn hạn và refresh token dài hạn không phải một mẫu thiết kế người ta thích, mà là lời giải cho một mâu thuẫn: xác minh nhanh đòi phi trạng thái, thu hồi tức thì đòi có trạng thái. Bài này chỉ ra con số bạn ĐANG chọn khi chọn tuổi thọ, và giới hạn chặt phạm vi refresh token xuống đúng một endpoint.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Two tokens, because one cannot do both jobs</h2>
<p class="lead">Chapter 3 wanted instant revocation and paid a database lookup per request. Chapter 4 wanted verification with no lookup and gave up revocation. Neither is wrong; they are answers to different halves of one requirement. Splitting the credential in two lets you have both, and the price is a number you choose deliberately.</p>

<h3>The contradiction, and the split that resolves it</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Access token</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Short: 5–15 minutes</span><span class="lz-nsub">Stateless JWT · verified with a signature · used on every request</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Refresh token</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Long: 30–90 days</span><span class="lz-nsub">A row in a table · revocable · used at ONE endpoint</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">What you bought</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Revocation within 15 minutes</span><span class="lz-nsub">And zero lookups on the request path</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Cùng một request, hai vai trò rất khác nhau</span>
GET /api/bai-viet          Authorization: Bearer &lt;access, 15 phút&gt;
POST /auth/refresh         Cookie: __Host-refresh=&lt;refresh, 30 ngày&gt;

<span class="tok-comment">// Access token: xác minh bằng chữ ký. KHÔNG chạm cơ sở dữ liệu.</span>
<span class="tok-comment">// Refresh token: tra một hàng, kiểm thu hồi, cấp access token mới.</span></code></pre>
<div class="callout ok">
<p><strong>The number you are choosing is the revocation window.</strong> Disable an account and the attacker's access token keeps working until it expires — fifteen minutes, or five, or an hour. That is not a flaw in the design; it is the design, stated honestly. Pick the number by asking what damage fifteen minutes of continued access does in <em>your</em> product, and shorten it until the answer is acceptable.</p>
</div>

<h3>Scoping the refresh token to one endpoint</h3>
<pre><code>res.cookie('__Host-refresh', token, {
  httpOnly: true,
  secure:   true,
  sameSite: 'strict',        <span class="tok-comment">// KHÔNG bao giờ gửi xuyên trang — Bài 3.2</span>
  path:     '/',             <span class="tok-comment">// __Host- bắt buộc Path=/</span>
  maxAge:   30 * 24 * 60 * 60 * 1000,
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">It is the higher-value credential</span><span class="v">An access token buys fifteen minutes; a refresh token buys thirty days and can mint access tokens continuously. Every protection you were willing to skip on the access token belongs on this one.</span></div>
  <div class="kv"><span class="k"><code>SameSite=Strict</code>, not <code>Lax</code></span><span class="v">The refresh endpoint is only ever called by your own front end via <code>fetch</code>, never by a user following a link. <code>Strict</code> costs nothing here and removes the cross-site case entirely.</span></div>
  <div class="kv"><span class="k">Server-side scope matters more than <code>Path</code></span><span class="v"><code>__Host-</code> forces <code>Path=/</code>, so the cookie reaches every route. That is fine — enforce the scope in code: <em>only</em> <code>/auth/refresh</code> reads that cookie, and no middleware treats it as an authentication credential.</span></div>
  <div class="kv"><span class="k">Never accept it as a bearer token</span><span class="v">If <code>Authorization: Bearer &lt;refresh&gt;</code> is accepted anywhere, the split has bought nothing: a stolen refresh token is now a thirty-day access token. One endpoint, one cookie, no exceptions.</span></div>
</div>

<h3>The schema, which is Chapter 3's table with one column added</h3>
<pre><code>model RefreshToken {
  id        String    @id @default(cuid())
  tokenHash String    @unique               <span class="tok-comment">// sha256 — Bài 1.3</span>
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  hoId      String    <span class="tok-comment">// ← HỌ token: Bài 5.2</span>
  createdAt DateTime  @default(now())
  expiresAt DateTime
  usedAt    DateTime? <span class="tok-comment">// ← đã đổi lấy access token chưa</span>
  revokedAt DateTime?

  browser   String?
  createdIp String?

  @@index([userId])
  @@index([hoId])
}</code></pre>
<pre><code><span class="tok-comment">// Đăng nhập: cấp CẢ HAI</span>
export async function signIn(u: User, req: Request, res: Response) {
  const access = await signAccessToken(u);                   <span class="tok-comment">// JWT, 15 phút</span>
  const refresh = await createRefreshToken(u.id, randomUUID(), req);  <span class="tok-comment">// họ mới</span>

  setRefreshCookie(res, refresh);
  return { accessToken: access, expiresIn: 900 };           <span class="tok-comment">// giây</span>
}</code></pre>
<div class="out">HTTP/1.1 200 OK
Set-Cookie: __Host-refresh=Kc9x2Lm…; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000
Content-Type: application/json

{"accessToken":"eyJhbGciOiJFZERTQSIsImtpZCI6IjIwMjYtMDgifQ…","expiresIn":900}

# Access token di vao BO NHO cua front end (Bai 4.5).
# Refresh token khong bao gio cham toi JavaScript.</div>

<h3>The exchange</h3>
<pre><code>app.post('/auth/refresh', async (req, res) =&gt; {
  const upload = req.cookies['__Host-refresh'];
  if (!upload) return res.status(401).json({ error: 'Chua dang nhap' });

  const hash = createHash('sha256').update(upload).digest('hex');
  const cu = await prisma.refreshToken.findUnique({ where: { tokenHash: bam } });

  if (!cu || cu.revokedAt || cu.expiresAt &lt; new Date()) {
    clearRefreshCookie(res);
    return res.status(401).json({ error: 'Session khong hop le' });
  }
  <span class="tok-comment">// Bài 5.2 chèn phần phát hiện TÁI DÙNG vào ngay đây.</span>

  const u = await prisma.user.findUniqueOrThrow({ where: { id: cu.userId } });
  const moi = await rotateRefreshToken(cu, req);              <span class="tok-comment">// dùng một lần</span>
  setRefreshCookie(res, moi);

  res.json({ accessToken: await signAccessToken(u), expiresIn: 900 });
});</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Re-read the user, every time</span><span class="lz-t">This is where freshness comes from</span><span class="lz-d">The new access token is built from the current row: current role, current disabled flag, current permissions. That is what makes a fifteen-minute window meaningful — a demotion takes effect at the next refresh, not at the next login.</span></div>
  <div class="lz-step"><span class="lz-k">One database read per fifteen minutes</span><span class="lz-t">The whole cost</span><span class="lz-d">Not one per request. On a client making two hundred requests an hour, that is one lookup instead of two hundred — the entire performance argument for JWTs, kept, while revocation comes back.</span></div>
  <div class="lz-step"><span class="lz-k">Clear the cookie on every failure</span><span class="lz-t">So the client stops retrying</span><span class="lz-d">A browser holding a dead refresh token will call this endpoint forever. Clearing it turns an infinite retry loop into one redirect to the login page.</span></div>
  <div class="lz-step"><span class="lz-k">Rate-limit it</span><span class="lz-t">It is unauthenticated by definition</span><span class="lz-d">Anyone can POST to <code>/auth/refresh</code> with a guessed cookie. The token is 256 bits so guessing is hopeless, but the endpoint still does a hash and a database read per call — cap it per IP, as Chapter 11 does for login.</span></div>
</div>

<h3>Choosing the two lifetimes</h3>
<pre><code><span class="tok-comment">#                         Access     Refresh    Cua so thu hoi</span>
Ngan hang, chung khoan     5 phut     8 gio       5 phut
SaaS noi bo               15 phut     7 ngay     15 phut
San pham tieu dung        15 phut    30 ngay     15 phut
App di dong               60 phut    90 ngay     60 phut
Dich vu noi bo, may-toi-may  1 gio    khong co    1 gio</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The access lifetime is a security number</span><span class="lz-lnote">It is exactly how long a disabled account keeps working, and exactly how long a stolen access token is useful. Shorter is strictly safer and costs one extra refresh call per period — which is cheap, because the refresh call is one indexed read.</span></div>
  <div class="lz-layer"><span class="lz-lname">The refresh lifetime is a product number</span><span class="lz-lnote">It is how often users log in again. Thirty days for a consumer app, seven for an internal tool, eight hours for banking. Nobody is harmed by a long refresh lifetime <em>if</em> rotation and reuse detection are in place — which is Lesson 5.2, and why that lesson is not optional.</span></div>
  <div class="lz-layer"><span class="lz-lname">Under five minutes is usually not worth it</span><span class="lz-lnote">The refresh traffic grows, the race conditions in Lesson 5.5 get sharper, and the difference between five minutes and one is rarely what decides an incident. If you need instant revocation, you need Chapter 3's session, not a shorter token.</span></div>
  <div class="lz-layer"><span class="lz-lname">Machine-to-machine needs no refresh token</span><span class="lz-lnote">A backend service holds a client credential and can request a new access token whenever it likes. Refresh tokens exist because a browser or phone cannot safely hold a long-term secret — that is the entire reason for the pattern.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a fifteen-minute access token with no rotation on refresh is a thirty-day credential with extra steps.</strong> If the same refresh token can be exchanged over and over, then stealing it once grants thirty days of access, and the short access lifetime protects nothing that matters. The short window is only real when the refresh token is single-use and reuse is detected — which is exactly Lesson 5.2. Implementing this half without that half is the most common way this pattern is got wrong.</p>
</div>
<div class="note-ct">
<p><strong>When you do <em>not</em> need this.</strong> One server, one database, a browser on the same site: Chapter 3's session cookie already gives you instant revocation and a 0.3 ms lookup, and adding two token types buys nothing but code. The split earns its complexity when verification happens somewhere the session table is not — another service, another datacentre, an edge function, a mobile app talking to several APIs. Ask where verification happens before adopting it.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6749#section-1.5" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6749 §1.5 — refresh tokens</span><span class="lc-sub">datatracker.ietf.org · Where the pattern comes from, and what it was designed for</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">RFC 9700 — OAuth security BCP</span><span class="lc-sub">datatracker.ietf.org · Current requirements for refresh tokens, including rotation</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">OWASP — token lifetimes</span><span class="lc-sub">cheatsheetseries.owasp.org · Guidance on how short is short enough</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Prisma ORM</span><span class="lc-sub">The indexes this table needs, and why the checks belong in the where clause</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Disable an account and measure exactly how long the old access token keeps working</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Hai token, vì một cái không làm nổi cả hai việc</h2>
<p class="lead">Chương 3 muốn THU HỒI TỨC THÌ và trả giá bằng một lần tra cơ sở dữ liệu cho mỗi request. Chương 4 muốn XÁC MINH KHÔNG TRA CỨU và đánh đổi mất khả năng thu hồi. Không cái nào SAI cả; chúng là câu trả lời cho hai NỬA khác nhau của cùng một yêu cầu. Tách tín vật làm hai cho phép bạn có cả hai, và cái giá là một CON SỐ bạn chọn một cách có chủ ý.</p>

<h3>Mâu thuẫn, và cách tách giải quyết nó</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Access token</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ngắn: 5–15 phút</span><span class="lz-nsub">JWT phi trạng thái · xác minh bằng chữ ký · dùng ở MỌI request</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Refresh token</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Dài: 30–90 ngày</span><span class="lz-nsub">Một hàng trong bảng · thu hồi được · dùng ở ĐÚNG MỘT endpoint</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Thứ bạn mua được</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thu hồi trong vòng 15 phút</span><span class="lz-nsub">Và KHÔNG lần tra cứu nào trên đường request</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Cùng một request, hai vai trò rất khác nhau</span>
GET /api/bai-viet          Authorization: Bearer &lt;access, 15 phút&gt;
POST /auth/refresh         Cookie: __Host-refresh=&lt;refresh, 30 ngày&gt;

<span class="tok-comment">// Access token: xác minh bằng chữ ký. KHÔNG chạm cơ sở dữ liệu.</span>
<span class="tok-comment">// Refresh token: tra một hàng, kiểm thu hồi, cấp access token mới.</span></code></pre>
<div class="callout ok">
<p><strong>Con số bạn đang chọn chính là CỬA SỔ THU HỒI.</strong> Vô hiệu hoá một tài khoản thì access token của kẻ tấn công VẪN chạy cho tới khi nó hết hạn — mười lăm phút, hay năm phút, hay một tiếng. Đó không phải một khiếm khuyết của thiết kế; nó CHÍNH LÀ thiết kế, nói ra một cách trung thực. Hãy chọn con số đó bằng cách hỏi: mười lăm phút truy cập tiếp tục gây thiệt hại gì trong <em>SẢN PHẨM CỦA BẠN</em>, rồi rút ngắn nó cho tới khi câu trả lời chấp nhận được.</p>
</div>

<h3>Giới hạn refresh token xuống ĐÚNG MỘT endpoint</h3>
<pre><code>res.cookie('__Host-refresh', token, {
  httpOnly: true,
  secure:   true,
  sameSite: 'strict',        <span class="tok-comment">// KHÔNG bao giờ gửi xuyên trang — Bài 3.2</span>
  path:     '/',             <span class="tok-comment">// __Host- bắt buộc Path=/</span>
  maxAge:   30 * 24 * 60 * 60 * 1000,
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó là tín vật GIÁ TRỊ CAO hơn</span><span class="v">Một access token mua được mười lăm phút; một refresh token mua được ba mươi ngày và đúc access token liên tục. Mọi lớp bảo vệ bạn sẵn sàng bỏ qua với access token đều THUỘC VỀ cái này.</span></div>
  <div class="kv"><span class="k"><code>SameSite=Strict</code>, không phải <code>Lax</code></span><span class="v">Endpoint refresh chỉ được gọi bởi chính front end của bạn qua <code>fetch</code>, không bao giờ bởi một người bấm liên kết. <code>Strict</code> chẳng tốn gì ở đây và xoá sạch trường hợp xuyên trang.</span></div>
  <div class="kv"><span class="k">Phạm vi phía MÁY CHỦ quan trọng hơn <code>Path</code></span><span class="v"><code>__Host-</code> bắt buộc <code>Path=/</code>, nên cookie tới được mọi route. Điều đó không sao — hãy cưỡng chế phạm vi TRONG MÃ: <em>CHỈ</em> <code>/auth/refresh</code> đọc cái cookie đó, và không middleware nào coi nó là một tín vật xác thực.</span></div>
  <div class="kv"><span class="k">ĐỪNG BAO GIỜ nhận nó như một bearer token</span><span class="v">Nếu <code>Authorization: Bearer &lt;refresh&gt;</code> được chấp nhận ở đâu đó thì việc tách làm hai chẳng mua được gì: một refresh token bị cắp giờ là một access token ba mươi ngày. Một endpoint, một cookie, không ngoại lệ.</span></div>
</div>

<h3>Lược đồ, chính là bảng của Chương 3 cộng một cột</h3>
<pre><code>model RefreshToken {
  id        String    @id @default(cuid())
  tokenHash String    @unique               <span class="tok-comment">// sha256 — Bài 1.3</span>
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  hoId      String    <span class="tok-comment">// ← HỌ token: Bài 5.2</span>
  createdAt DateTime  @default(now())
  expiresAt DateTime
  usedAt    DateTime? <span class="tok-comment">// ← đã đổi lấy access token chưa</span>
  revokedAt DateTime?

  browser   String?
  createdIp String?

  @@index([userId])
  @@index([hoId])
}</code></pre>
<pre><code><span class="tok-comment">// Đăng nhập: cấp CẢ HAI</span>
export async function signIn(u: User, req: Request, res: Response) {
  const access = await signAccessToken(u);                   <span class="tok-comment">// JWT, 15 phút</span>
  const refresh = await createRefreshToken(u.id, randomUUID(), req);  <span class="tok-comment">// họ mới</span>

  setRefreshCookie(res, refresh);
  return { accessToken: access, expiresIn: 900 };           <span class="tok-comment">// giây</span>
}</code></pre>
<div class="out">HTTP/1.1 200 OK
Set-Cookie: __Host-refresh=Kc9x2Lm…; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000
Content-Type: application/json

{"accessToken":"eyJhbGciOiJFZERTQSIsImtpZCI6IjIwMjYtMDgifQ…","expiresIn":900}

# Access token di vao BO NHO cua front end (Bai 4.5).
# Refresh token khong bao gio cham toi JavaScript.</div>

<h3>Cú đổi</h3>
<pre><code>app.post('/auth/refresh', async (req, res) =&gt; {
  const upload = req.cookies['__Host-refresh'];
  if (!upload) return res.status(401).json({ error: 'Chua dang nhap' });

  const hash = createHash('sha256').update(upload).digest('hex');
  const cu = await prisma.refreshToken.findUnique({ where: { tokenHash: bam } });

  if (!cu || cu.revokedAt || cu.expiresAt &lt; new Date()) {
    clearRefreshCookie(res);
    return res.status(401).json({ error: 'Session khong hop le' });
  }
  <span class="tok-comment">// Bài 5.2 chèn phần phát hiện TÁI DÙNG vào ngay đây.</span>

  const u = await prisma.user.findUniqueOrThrow({ where: { id: cu.userId } });
  const moi = await rotateRefreshToken(cu, req);              <span class="tok-comment">// dùng một lần</span>
  setRefreshCookie(res, moi);

  res.json({ accessToken: await signAccessToken(u), expiresIn: 900 });
});</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">ĐỌC LẠI người dùng, MỖI lần</span><span class="lz-t">Đây là chỗ sinh ra tính "mới"</span><span class="lz-d">Access token mới được dựng từ HÀNG HIỆN TẠI: vai trò hiện tại, cờ vô hiệu hoá hiện tại, quyền hạn hiện tại. Chính điều đó làm cho cửa sổ mười lăm phút CÓ NGHĨA — một cú hạ quyền có hiệu lực ở lần refresh kế tiếp, không phải ở lần đăng nhập kế tiếp.</span></div>
  <div class="lz-step"><span class="lz-k">Một lần đọc cơ sở dữ liệu mỗi mười lăm phút</span><span class="lz-t">Toàn bộ chi phí</span><span class="lz-d">Không phải một lần cho mỗi request. Với một client gửi hai trăm request mỗi giờ, đó là MỘT lần tra thay vì hai trăm — toàn bộ lập luận về hiệu năng của JWT được giữ nguyên, trong khi khả năng thu hồi quay lại.</span></div>
  <div class="lz-step"><span class="lz-k">XOÁ cookie ở MỌI lần trượt</span><span class="lz-t">Để client thôi thử lại</span><span class="lz-d">Một trình duyệt đang cầm một refresh token chết sẽ gọi cái endpoint này MÃI MÃI. Xoá nó đi là biến một vòng lặp thử lại vô tận thành một lần chuyển hướng tới trang đăng nhập.</span></div>
  <div class="lz-step"><span class="lz-k">Hãy GIỚI HẠN TỐC ĐỘ nó</span><span class="lz-t">Theo định nghĩa nó không cần xác thực</span><span class="lz-d">Ai cũng POST được tới <code>/auth/refresh</code> với một cookie đoán bừa. Token là 256 bit nên đoán là vô vọng, nhưng cái endpoint vẫn phải băm và đọc cơ sở dữ liệu ở MỖI lời gọi — hãy chặn trần theo IP, y như Chương 11 làm với đăng nhập.</span></div>
</div>

<h3>Chọn hai cái tuổi thọ</h3>
<pre><code><span class="tok-comment">#                         Access     Refresh    Cua so thu hoi</span>
Ngan hang, chung khoan     5 phut     8 gio       5 phut
SaaS noi bo               15 phut     7 ngay     15 phut
San pham tieu dung        15 phut    30 ngay     15 phut
App di dong               60 phut    90 ngay     60 phut
Dich vu noi bo, may-toi-may  1 gio    khong co    1 gio</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tuổi thọ ACCESS là một con số BẢO MẬT</span><span class="lz-lnote">Nó ĐÚNG BẰNG thời gian một tài khoản đã vô hiệu hoá còn chạy được, và đúng bằng thời gian một access token bị cắp còn hữu dụng. Ngắn hơn thì an toàn hơn HẲN, và tốn thêm một lời gọi refresh mỗi chu kỳ — rẻ, vì lời gọi refresh là một lần đọc theo chỉ mục.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tuổi thọ REFRESH là một con số SẢN PHẨM</span><span class="lz-lnote">Nó là bao lâu thì người dùng phải đăng nhập lại. Ba mươi ngày cho một app tiêu dùng, bảy ngày cho một công cụ nội bộ, tám tiếng cho ngân hàng. Không ai bị hại vì một tuổi thọ refresh dài <em>NẾU</em> đã có xoay vòng và phát hiện tái dùng — tức là Bài 5.2, và đó là lý do bài đó KHÔNG phải tuỳ chọn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dưới năm phút thường KHÔNG đáng</span><span class="lz-lnote">Lưu lượng refresh tăng lên, các cuộc đua ở Bài 5.5 gay gắt hơn, và khác biệt giữa năm phút với một phút hiếm khi là thứ quyết định một sự cố. Nếu bạn CẦN thu hồi tức thì thì bạn cần cái PHIÊN của Chương 3, không phải một token ngắn hơn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Máy-tới-máy thì KHÔNG cần refresh token</span><span class="lz-lnote">Một dịch vụ backend giữ một tín vật client và tự xin access token mới bất cứ lúc nào nó muốn. Refresh token tồn tại vì một trình duyệt hay một cái điện thoại KHÔNG giữ nổi một bí mật dài hạn một cách an toàn — đó là toàn bộ lý do của cái mẫu này.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một access token mười lăm phút mà KHÔNG xoay vòng lúc refresh thì là một tín vật ba mươi ngày với vài bước thừa.</strong> Nếu CÙNG một refresh token đổi đi đổi lại được mãi, thì cắp nó MỘT lần là có ba mươi ngày truy cập, và cái tuổi thọ access ngắn kia chẳng bảo vệ được gì đáng kể. Cửa sổ ngắn chỉ CÓ THẬT khi refresh token là DÙNG MỘT LẦN và việc tái dùng bị PHÁT HIỆN — tức là đúng Bài 5.2. Cài đặt nửa này mà bỏ nửa kia là cách phổ biến nhất khiến mẫu này bị làm sai.</p>
</div>
<div class="note-ct">
<p><strong>Khi nào bạn KHÔNG cần tới cái này.</strong> Một máy chủ, một cơ sở dữ liệu, một trình duyệt trên cùng site: cookie phiên của Chương 3 vốn đã cho bạn thu hồi tức thì và một lần tra 0,3 ms, còn thêm hai loại token thì chẳng mua được gì ngoài thêm mã. Việc tách làm hai chỉ xứng đáng với phần phức tạp của nó khi việc XÁC MINH diễn ra ở nơi KHÔNG có bảng phiên — một dịch vụ khác, một trung tâm dữ liệu khác, một hàm chạy ở biên, một app di động nói chuyện với vài API. Hãy hỏi "việc xác minh diễn ra ở đâu" trước khi áp dụng nó.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6749#section-1.5" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6749 §1.5 — refresh token</span><span class="lc-sub">datatracker.ietf.org · Cái mẫu này tới từ đâu, và nó được thiết kế cho việc gì</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">RFC 9700 — thực hành bảo mật OAuth</span><span class="lc-sub">datatracker.ietf.org · Yêu cầu hiện hành cho refresh token, kể cả việc xoay vòng</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">OWASP — tuổi thọ token</span><span class="lc-sub">cheatsheetseries.owasp.org · Hướng dẫn ngắn tới mức nào thì đủ ngắn</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Prisma ORM</span><span class="lc-sub">Những chỉ mục mà cái bảng này cần, và vì sao các phép kiểm thuộc về mệnh đề where</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Vô hiệu hoá một tài khoản rồi ĐO chính xác access token cũ còn chạy được bao lâu</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Rotation, and the reuse that gives the thief away|||5.2 — Xoay vòng, và cú tái dùng tố giác kẻ cắp',
      slug: 'auth-5-2-xoay-vong',
      type: 'LESSON',
      description: 'Mỗi lần refresh cấp một token MỚI và đánh dấu cái cũ đã dùng. Nếu một token đã dùng lại được trình ra lần nữa thì có kẻ đang giữ một bản sao — và vì bạn không biết bản sao đó thuộc về ai, bạn thu hồi cả HỌ. Bài này chạy cả hai kịch bản và cho thấy kẻ tấn công thua ở CẢ HAI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Rotation, and the reuse that gives the thief away</h2>
<p class="lead">Rotation on its own limits how long a stolen refresh token is useful. Reuse detection does something better: it turns the theft into an <em>observable event</em>. A token that has already been exchanged, presented a second time, means a copy exists — and since you cannot tell whether you are talking to the victim or the thief, you end the whole lineage and make both start again.</p>

<h3>Rotation: single use, always</h3>
<pre><code>export async function rotateRefreshToken(cu: RefreshToken, req: Request) {
  const newToken = randomBytes(32).toString('base64url');

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: cu.id },
      data:  { usedAt: new Date() },              <span class="tok-comment">// đánh dấu ĐÃ DÙNG</span>
    }),
    prisma.refreshToken.create({
      data: {
        tokenHash: createHash('sha256').update(newToken).digest('hex'),
        userId: cu.userId,
        hoId: cu.hoId,                             <span class="tok-comment">// ← CÙNG một họ</span>
        expiresAt: cu.expiresAt,                         <span class="tok-comment">// trần TUYỆT ĐỐI không dời</span>
        browser: req.get('user-agent')?.slice(0, 200),
        createdIp: req.ip,
      },
    }),
  ]);
  return newToken;
}</code></pre>
<div class="out">SELECT "hoId", left("tokenHash",8) AS bam, "createdAt"::time, "usedAt"::time
FROM "RefreshToken" WHERE "hoId" = 'f47ac10b…' ORDER BY "createdAt";

  hoId     |   bam    |  createdAt  |  usedAt
-----------+----------+----------+----------
 f47ac10b… | 8f2a91c4 | 09:14:02 | 09:29:11    ← RT1, da doi lay RT2
 f47ac10b… | d47b0e29 | 09:29:11 | 09:44:20    ← RT2, da doi lay RT3
 f47ac10b… | 1c9fa38b | 09:44:20 |             ← RT3, dang song

# Mot lan dang nhap = mot HO. Moi lan refresh them mot mat xich.
# Cai het han TUYET DOI thua ke tu mat xich dau — xoay vong khong keo dai session.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Do not extend the absolute expiry</span><span class="v">Each new token inherits <code>expiresAt</code> from the one it replaced. Otherwise rotation becomes sliding expiry, and Lesson 3.1's problem returns: a stolen family kept warm never ends.</span></div>
  <div class="kv"><span class="k">One transaction, or the race wins</span><span class="v">Marking used and creating the successor must be atomic. Split them and two concurrent refreshes can both see an unused token and both mint successors — two live branches of one family, which is the state reuse detection is supposed to make impossible.</span></div>
  <div class="kv"><span class="k">Mark used, do not delete</span><span class="v">The used row <em>is</em> the detector. Deleting it turns a reuse into "token not found", which is indistinguishable from an expired session and triggers no alarm.</span></div>
  <div class="kv"><span class="k">The family id is a plain UUID</span><span class="v">Generated once at login and copied to every descendant. It carries no meaning and needs none — its only job is to let one <code>updateMany</code> end the whole lineage.</span></div>
</div>

<h3>Detection: two scenarios, one outcome</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Scenario A — victim refreshes first</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Victim: RT1 → RT2</span><span class="lz-nsub">RT1 now marked used</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thief presents RT1</span><span class="lz-nsub">REUSE → whole family revoked → thief gets nothing</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Scenario B — thief refreshes first</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thief: RT1 → RT2'</span><span class="lz-nsub">Thief has access, victim does not know</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Victim presents RT1</span><span class="lz-nsub">REUSE → family revoked → RT2' dies too</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Chèn vào /auth/refresh, ngay sau khi tìm thấy hàng</span>
if (cu.usedAt) {
  <span class="tok-comment">// Token này ĐÃ được đổi rồi. Có một bản sao đang tồn tại.</span>
  await prisma.refreshToken.updateMany({
    where: { hoId: cu.hoId, revokedAt: null },
    data:  { revokedAt: new Date() },              <span class="tok-comment">// giết CẢ HỌ</span>
  });

  logger.warn({
    event: 'refresh_token_tai_dung',
    userId: cu.userId,
    hoId: cu.hoId,
    usedAt: cu.usedAt,
    ip: req.ip,
    browser: req.get('user-agent'),
  }, 'phat hien tai dung refresh token');

  clearRefreshCookie(res);
  return res.status(401).json({ error: 'Session khong hop le, vui long dang nhap lai' });
}</code></pre>
<div class="out">{"level":40,"event":"refresh_token_tai_dung","userId":"clx7a2b1c",
 "hoId":"f47ac10b…","usedAt":"2026-08-23T09:29:11.284Z",
 "ip":"203.0.113.47","browser":"Mozilla/5.0 (X11; Linux x86_64)…"}

# Duong nay chay = mot chuoi refresh token da bi nhan doi.
# Day la mot trong rat it tin hieu xac thuc gan nhu KHONG bao gio
# nhieu — Chuong 11 canh bao tren no.</div>
<div class="callout ok">
<p><strong>Notice what happens in scenario B: the thief is locked out by the <em>victim's</em> next refresh.</strong> They do not need to notice anything, report anything, or do anything at all — simply continuing to use the application ends the attack. That is what makes this pattern worth its complexity, and it is the only mechanism in this course where the ordinary behaviour of an unaware user actively defeats an attacker.</p>
</div>

<h3>The window, stated exactly</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Scenario A</span><span class="lz-t">Zero</span><span class="lz-d">The thief never gets a working access token. They present an already-used refresh token and are rejected on the first try.</span></div>
  <div class="lz-step"><span class="lz-k">Scenario B</span><span class="lz-t">Until the victim's next refresh</span><span class="lz-d">Usually the access-token lifetime — fifteen minutes for an active user. For a user who closed the tab, it lasts until they come back, which is the case worth thinking about.</span></div>
  <div class="lz-step"><span class="lz-k">The idle-user gap</span><span class="lz-t">The real limit</span><span class="lz-d">Someone who does not return for a week gives the thief a week. An idle timeout on the refresh token — revoke after seven days unused — closes it, and is one more column with the same semantics as Lesson 3.1's.</span></div>
  <div class="lz-step"><span class="lz-k">This does not detect an idle thief</span><span class="lz-t">Be honest about it</span><span class="lz-d">An attacker who steals the token and never uses it is invisible, and one who uses it exactly once between two of the victim's refreshes may go unnoticed until the next collision. The mechanism detects <em>concurrent</em> use, which is what theft normally looks like — not all of it.</span></div>
</div>

<h3>What the user sees, and what to tell them</h3>
<pre><code><span class="tok-comment">// ❌ Câu mặc định của phần lớn hệ thống</span>
{ "loi": "Session khong hop le" }

<span class="tok-comment">// ✅ Nói ra chuyện gì đã xảy ra và họ nên làm gì</span>
{
  "loi": "Session cua ban da ket thuc vi ly do bao mat",
  "detail": "Chung toi phat hien tai khoan nay duoc truy cap tu hai noi cung luc. "
           + "Vui long dang nhap lai. Neu khong phai ban, hay doi mat khau.",
  "ma": "REFRESH_TAI_DUNG"
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Being logged out is the correct outcome</span><span class="lz-lnote">It looks like a bug to the user and it is the system working. That is exactly why the message matters: an unexplained logout gets a support ticket, an explained one gets a password change.</span></div>
  <div class="lz-layer"><span class="lz-lname">Send an email as well</span><span class="lz-lnote">The reuse may have happened while the victim was not at the keyboard. An email — "your session was ended because we detected access from two places" with the time and approximate location — reaches them either way, and is the only channel the attacker does not control.</span></div>
  <div class="lz-layer"><span class="lz-lname">Do not auto-lock the account</span><span class="lz-lnote">Tempting, and it hands an attacker a denial-of-service: steal any refresh token, replay it, lock the owner out. Revoke the family, notify, and let the user log in again with their password.</span></div>
  <div class="lz-layer"><span class="lz-lname">A distinct error code helps everyone</span><span class="lz-lnote"><code>REFRESH_TAI_DUNG</code> lets the front end show the right screen, and lets you count it. A spike in that counter is a real security signal, and it is invisible if every failure is a generic 401.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a buggy client triggers this constantly, and then someone disables it.</strong> Two tabs refreshing at once, a mobile app retrying after a timeout, an interceptor that fires ten refreshes for ten simultaneous 401s — every one of those replays a used token and revokes the family. Users get logged out at random, the team concludes that reuse detection is too aggressive, and it gets turned off. The fix is not to weaken detection; it is to make the client refresh <em>once</em> and to add a short grace window for the genuine race. That is Lesson 5.5, and it is required, not optional.</p>
</div>
<div class="note-ct">
<p><strong>The order to build this in.</strong> Rotation first — it is a transaction and a family id, and it is safe on its own. Then the client fix from Lesson 5.5, so concurrent refreshes cannot produce false positives. <em>Then</em> turn on reuse detection, with the log line before the revocation so you can watch it for a week and see what it catches before it starts ending sessions. Deploying detection before the client is correct is how teams end up concluding that this pattern does not work.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700#name-refresh-token-protection" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">RFC 9700 — refresh token protection</span><span class="lc-sub">datatracker.ietf.org · Rotation and reuse detection as a normative requirement</span></span></a>
<a class="link-card" href="https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation" target="_blank" rel="noopener"><span class="lc-ico">👪</span><span class="lc-body"><span class="lc-title">Auth0 — rotation and reuse detection</span><span class="lc-sub">auth0.com · The family model, with both scenarios drawn out</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6819#section-4.6.3" target="_blank" rel="noopener"><span class="lc-ico">🧵</span><span class="lc-body"><span class="lc-title">RFC 6819 §4.6.3 — refresh token threats</span><span class="lc-sub">datatracker.ietf.org · The threat model this design answers</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Prisma ORM</span><span class="lc-sub">Interactive transactions, and why this one must be atomic</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Steal a refresh token, then play both scenarios and watch the family die each time</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Xoay vòng, và cú tái dùng tố giác kẻ cắp</h2>
<p class="lead">Riêng việc xoay vòng thì giới hạn được một refresh token bị cắp còn hữu dụng bao lâu. Phát hiện tái dùng làm một điều TỐT HƠN: nó biến cú trộm thành một <em>SỰ KIỆN QUAN SÁT ĐƯỢC</em>. Một token đã được đổi rồi mà bị trình ra lần thứ hai nghĩa là CÓ một bản sao đang tồn tại — và vì bạn không phân biệt nổi mình đang nói chuyện với nạn nhân hay với kẻ cắp, bạn kết thúc cả DÒNG HỌ và bắt cả hai bắt đầu lại.</p>

<h3>Xoay vòng: dùng MỘT lần, luôn luôn</h3>
<pre><code>export async function rotateRefreshToken(cu: RefreshToken, req: Request) {
  const newToken = randomBytes(32).toString('base64url');

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: cu.id },
      data:  { usedAt: new Date() },              <span class="tok-comment">// đánh dấu ĐÃ DÙNG</span>
    }),
    prisma.refreshToken.create({
      data: {
        tokenHash: createHash('sha256').update(newToken).digest('hex'),
        userId: cu.userId,
        hoId: cu.hoId,                             <span class="tok-comment">// ← CÙNG một họ</span>
        expiresAt: cu.expiresAt,                         <span class="tok-comment">// trần TUYỆT ĐỐI không dời</span>
        browser: req.get('user-agent')?.slice(0, 200),
        createdIp: req.ip,
      },
    }),
  ]);
  return newToken;
}</code></pre>
<div class="out">SELECT "hoId", left("tokenHash",8) AS bam, "createdAt"::time, "usedAt"::time
FROM "RefreshToken" WHERE "hoId" = 'f47ac10b…' ORDER BY "createdAt";

  hoId     |   bam    |  createdAt  |  usedAt
-----------+----------+----------+----------
 f47ac10b… | 8f2a91c4 | 09:14:02 | 09:29:11    ← RT1, da doi lay RT2
 f47ac10b… | d47b0e29 | 09:29:11 | 09:44:20    ← RT2, da doi lay RT3
 f47ac10b… | 1c9fa38b | 09:44:20 |             ← RT3, dang song

# Mot lan dang nhap = mot HO. Moi lan refresh them mot mat xich.
# Cai het han TUYET DOI thua ke tu mat xich dau — xoay vong khong keo dai session.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">ĐỪNG kéo dài hết hạn tuyệt đối</span><span class="v">Mỗi token mới THỪA KẾ <code>expiresAt</code> từ cái nó thay thế. Không thì việc xoay vòng biến thành hết-hạn-trượt, và vấn đề của Bài 3.1 quay lại: một dòng họ bị cắp mà giữ cho ấm thì không bao giờ kết thúc.</span></div>
  <div class="kv"><span class="k">MỘT giao dịch, không thì cuộc đua thắng</span><span class="v">Đánh dấu đã dùng và tạo cái kế nhiệm phải NGUYÊN TỬ. Tách chúng ra thì hai lần refresh song song đều thấy một token chưa dùng và đều đúc kế nhiệm — thành hai NHÁNH sống của một họ, đúng cái trạng thái mà phát hiện tái dùng lẽ ra phải làm cho bất khả.</span></div>
  <div class="kv"><span class="k">ĐÁNH DẤU đã dùng, đừng XOÁ</span><span class="v">Cái hàng đã dùng CHÍNH LÀ bộ phát hiện. Xoá nó đi là biến một cú tái dùng thành "không tìm thấy token", thứ không phân biệt nổi với một phiên hết hạn và không kích hoạt báo động nào.</span></div>
  <div class="kv"><span class="k">Mã họ chỉ là một UUID trần</span><span class="v">Sinh MỘT lần lúc đăng nhập rồi copy sang mọi hậu duệ. Nó không mang ý nghĩa nào và cũng không cần — việc duy nhất của nó là cho phép MỘT câu <code>updateMany</code> kết thúc cả dòng họ.</span></div>
</div>

<h3>Phát hiện: hai kịch bản, MỘT kết cục</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Kịch bản A — nạn nhân refresh trước</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nạn nhân: RT1 → RT2</span><span class="lz-nsub">RT1 giờ đã đánh dấu là ĐÃ DÙNG</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Kẻ cắp trình RT1</span><span class="lz-nsub">TÁI DÙNG → cả họ bị thu hồi → kẻ cắp không được gì</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Kịch bản B — kẻ cắp refresh trước</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Kẻ cắp: RT1 → RT2'</span><span class="lz-nsub">Kẻ cắp có quyền truy cập, nạn nhân không hay</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nạn nhân trình RT1</span><span class="lz-nsub">TÁI DÙNG → cả họ bị thu hồi → RT2' cũng chết theo</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Chèn vào /auth/refresh, ngay sau khi tìm thấy hàng</span>
if (cu.usedAt) {
  <span class="tok-comment">// Token này ĐÃ được đổi rồi. Có một bản sao đang tồn tại.</span>
  await prisma.refreshToken.updateMany({
    where: { hoId: cu.hoId, revokedAt: null },
    data:  { revokedAt: new Date() },              <span class="tok-comment">// giết CẢ HỌ</span>
  });

  logger.warn({
    event: 'refresh_token_tai_dung',
    userId: cu.userId,
    hoId: cu.hoId,
    usedAt: cu.usedAt,
    ip: req.ip,
    browser: req.get('user-agent'),
  }, 'phat hien tai dung refresh token');

  clearRefreshCookie(res);
  return res.status(401).json({ error: 'Session khong hop le, vui long dang nhap lai' });
}</code></pre>
<div class="out">{"level":40,"event":"refresh_token_tai_dung","userId":"clx7a2b1c",
 "hoId":"f47ac10b…","usedAt":"2026-08-23T09:29:11.284Z",
 "ip":"203.0.113.47","browser":"Mozilla/5.0 (X11; Linux x86_64)…"}

# Duong nay chay = mot chuoi refresh token da bi nhan doi.
# Day la mot trong rat it tin hieu xac thuc gan nhu KHONG bao gio
# nhieu — Chuong 11 canh bao tren no.</div>
<div class="callout ok">
<p><strong>Hãy để ý chuyện gì xảy ra ở kịch bản B: kẻ cắp bị khoá ngoài bởi lần refresh KẾ TIẾP CỦA NẠN NHÂN.</strong> Nạn nhân không cần nhận ra điều gì, không cần báo cáo điều gì, không cần làm gì cả — chỉ việc TIẾP TỤC DÙNG ứng dụng là cú tấn công kết thúc. Đó là thứ làm cho cái mẫu này xứng đáng với phần phức tạp của nó, và nó là cơ chế DUY NHẤT trong khoá này mà hành vi bình thường của một người dùng KHÔNG HAY BIẾT lại chủ động đánh bại một kẻ tấn công.</p>
</div>

<h3>Cửa sổ, nói cho chính xác</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Kịch bản A</span><span class="lz-t">BẰNG KHÔNG</span><span class="lz-d">Kẻ cắp KHÔNG BAO GIỜ có được một access token chạy được. Họ trình ra một refresh token đã dùng và bị từ chối ngay lần thử đầu tiên.</span></div>
  <div class="lz-step"><span class="lz-k">Kịch bản B</span><span class="lz-t">Tới lần refresh kế tiếp của nạn nhân</span><span class="lz-d">Thường là bằng tuổi thọ access token — mười lăm phút với một người đang hoạt động. Với một người vừa đóng tab, nó kéo dài tới khi họ quay lại, và đó mới là trường hợp đáng nghĩ tới.</span></div>
  <div class="lz-step"><span class="lz-k">Khoảng hở với người dùng NGỦ ĐÔNG</span><span class="lz-t">Giới hạn thật</span><span class="lz-d">Một người cả tuần không quay lại là tặng cho kẻ cắp cả tuần. Một hạn NHÀN RỖI trên refresh token — thu hồi sau bảy ngày không dùng — bịt được nó, và nó chỉ là thêm một cột với đúng ngữ nghĩa của Bài 3.1.</span></div>
  <div class="lz-step"><span class="lz-k">Nó KHÔNG phát hiện được một kẻ cắp NẰM IM</span><span class="lz-t">Hãy trung thực về điều đó</span><span class="lz-d">Một kẻ tấn công cắp token rồi không dùng thì VÔ HÌNH, và một kẻ dùng đúng một lần nằm giữa hai lần refresh của nạn nhân thì có thể lọt tới lần va chạm kế tiếp. Cơ chế này phát hiện việc dùng ĐỒNG THỜI, tức là hình dạng thông thường của một cú trộm — không phải tất cả.</span></div>
</div>

<h3>Người dùng nhìn thấy gì, và nên nói gì với họ</h3>
<pre><code><span class="tok-comment">// ❌ Câu mặc định của phần lớn hệ thống</span>
{ "loi": "Session khong hop le" }

<span class="tok-comment">// ✅ Nói ra chuyện gì đã xảy ra và họ nên làm gì</span>
{
  "loi": "Session cua ban da ket thuc vi ly do bao mat",
  "detail": "Chung toi phat hien tai khoan nay duoc truy cap tu hai noi cung luc. "
           + "Vui long dang nhap lai. Neu khong phai ban, hay doi mat khau.",
  "ma": "REFRESH_TAI_DUNG"
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bị đăng xuất là kết cục ĐÚNG</span><span class="lz-lnote">Với người dùng nó trông như một con bug, còn thực ra hệ thống đang làm đúng việc. Chính vì thế cái THÔNG ĐIỆP mới quan trọng: một lần đăng xuất không giải thích thì nhận về một phiếu hỗ trợ, một lần có giải thích thì nhận về một lần đổi mật khẩu.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy gửi kèm một EMAIL</span><span class="lz-lnote">Cú tái dùng có thể xảy ra lúc nạn nhân không ngồi trước bàn phím. Một email — "phiên của bạn đã bị kết thúc vì chúng tôi phát hiện truy cập từ hai nơi" kèm thời gian và vị trí gần đúng — tới được họ trong mọi trường hợp, và là kênh DUY NHẤT kẻ tấn công không kiểm soát.</span></div>
  <div class="lz-layer"><span class="lz-lname">ĐỪNG tự động khoá tài khoản</span><span class="lz-lnote">Nghe hấp dẫn, và nó trao cho kẻ tấn công một cú từ chối dịch vụ: cắp bất kỳ refresh token nào, phát lại, và khoá chủ nhân ra ngoài. Hãy thu hồi cả họ, thông báo, rồi để người dùng đăng nhập lại bằng mật khẩu của họ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một mã lỗi RIÊNG giúp cho tất cả</span><span class="lz-lnote"><code>REFRESH_TAI_DUNG</code> cho front end hiển thị đúng màn hình, và cho bạn ĐẾM được nó. Một cú vọt của bộ đếm đó là một tín hiệu bảo mật THẬT, và nó vô hình nếu mọi lần trượt đều là một cái 401 chung chung.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một client có bug sẽ kích hoạt cái này LIÊN TỤC, rồi sẽ có người TẮT nó đi.</strong> Hai tab cùng refresh một lúc, một app di động thử lại sau khi hết giờ, một interceptor bắn ra mười lần refresh cho mười cái 401 đồng thời — mỗi cái trong số đó đều phát lại một token đã dùng và thu hồi cả họ. Người dùng bị đăng xuất ngẫu nhiên, cả đội kết luận rằng phát hiện tái dùng quá gắt, và nó bị tắt. Cách vá KHÔNG phải làm yếu phần phát hiện; mà là làm cho client refresh ĐÚNG MỘT lần và thêm một cửa sổ ân hạn ngắn cho cuộc đua THẬT. Đó là Bài 5.5, và nó BẮT BUỘC chứ không tuỳ chọn.</p>
</div>
<div class="note-ct">
<p><strong>Thứ tự nên dựng.</strong> Xoay vòng trước — nó là một giao dịch và một mã họ, và tự nó đã an toàn. Rồi tới phần vá client của Bài 5.5, để những lần refresh song song không tạo ra cảnh báo giả. <em>RỒI MỚI</em> bật phát hiện tái dùng, với dòng log đặt TRƯỚC lệnh thu hồi để bạn theo dõi nó một tuần và thấy nó bắt được gì trước khi nó bắt đầu kết thúc phiên của người ta. Triển khai phần phát hiện TRƯỚC KHI client đúng chính là cách các đội đi tới kết luận rằng cái mẫu này không dùng được.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700#name-refresh-token-protection" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">RFC 9700 — bảo vệ refresh token</span><span class="lc-sub">datatracker.ietf.org · Xoay vòng và phát hiện tái dùng như một yêu cầu chuẩn</span></span></a>
<a class="link-card" href="https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation" target="_blank" rel="noopener"><span class="lc-ico">👪</span><span class="lc-body"><span class="lc-title">Auth0 — xoay vòng và phát hiện tái dùng</span><span class="lc-sub">auth0.com · Mô hình dòng họ, có vẽ ra cả hai kịch bản</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6819#section-4.6.3" target="_blank" rel="noopener"><span class="lc-ico">🧵</span><span class="lc-body"><span class="lc-title">RFC 6819 §4.6.3 — mối đe doạ với refresh token</span><span class="lc-sub">datatracker.ietf.org · Mô hình mối đe doạ mà thiết kế này trả lời</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Prisma ORM</span><span class="lc-sub">Giao dịch tương tác, và vì sao cái giao dịch này BẮT BUỘC phải nguyên tử</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Cắp một refresh token, rồi diễn cả hai kịch bản và xem dòng họ chết ở cả hai lần</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Five events that must end a session|||5.3 — Năm sự kiện bắt buộc phải kết thúc một phiên',
      slug: 'auth-5-3-nam-su-kien',
      type: 'LESSON',
      description: 'Đăng xuất, thoát mọi thiết bị, đổi mật khẩu, khoá tài khoản, hạ quyền — năm sự kiện, và mỗi cái có một câu hỏi riêng: có chờ được hết cửa sổ access token không? Bài này trả lời từng cái, và dựng một danh sách chặn NHỎ cho hai sự kiện không chờ được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Five events that must end a session</h2>
<p class="lead">Lesson 5.1 chose a revocation window. This lesson decides, event by event, whether that window is acceptable — because "logged out within fifteen minutes" is fine for a logout button and unacceptable for an admin banning someone who is actively causing harm. Two of the five need something faster, and it is smaller than you expect.</p>

<h3>The five, and what each requires</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Logout, this device</span><span class="v">Revoke this refresh token, clear the cookie, tell the client to drop the in-memory access token. The access token stays technically valid for its remaining minutes — and since it exists only in a page that just navigated away, that is acceptable.</span></div>
  <div class="kv"><span class="k">2 · Sign out everywhere</span><span class="v">Revoke every refresh token for the user. Same window, and the user asked for it explicitly, so tell them: "you will be signed out on other devices within fifteen minutes."</span></div>
  <div class="kv"><span class="k">3 · Password change or reset</span><span class="v">Revoke all refresh tokens except the current one, so the user stays logged in where they are. If they changed it because they believe someone else knows it, fifteen more minutes of attacker access is a real gap — see the fast path below.</span></div>
  <div class="kv"><span class="k">4 · Account disabled or deleted ⚡</span><span class="v">Cannot wait. An admin disabling an account is responding to something happening now — abuse, fraud, a compromised employee. Fifteen more minutes is fifteen more minutes of it.</span></div>
  <div class="kv"><span class="k">5 · Role or permission removed ⚡</span><span class="v">Downgrades cannot wait; upgrades can. Removing someone's admin rights and leaving them admin for fifteen minutes defeats the point of removing them.</span></div>
</div>

<h3>The three mechanisms</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Revoke refresh rows</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Immediate for the refresh path</span><span class="lz-nsub">No new access token is ever issued · costs nothing</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Wait out the window</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">≤ 15 minutes</span><span class="lz-nsub">Correct for events 1, 2 and most of 3</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">A small denylist</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Immediate, for events 4 and 5</span><span class="lz-nsub">One Redis key per affected user, TTL = access lifetime</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Sự kiện 1 và 2 — chỉ là những câu UPDATE</span>
export async function signOut(refreshToken: string, res: Response) {
  const hash = createHash('sha256').update(refreshToken).digest('hex');
  await prisma.refreshToken.updateMany({
    where: { tokenHash: bam, revokedAt: null },
    data:  { revokedAt: new Date() },
  });
  clearRefreshCookie(res);
}

export async function signOutEverywhere(userId: string, giuLaiHoId?: string) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null, ...(giuLaiHoId &amp;&amp; { hoId: { not: giuLaiHoId } }) },
    data:  { revokedAt: new Date() },
  });
}</code></pre>
<div class="out">$ curl -X POST localhost:3000/auth/dang-xuat -b "__Host-refresh=Kc9x2Lm…"
HTTP/1.1 204 No Content
Set-Cookie: __Host-refresh=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0

$ curl -X POST localhost:3000/auth/refresh -b "__Host-refresh=Kc9x2Lm…"
HTTP/1.1 401 {"loi":"Session khong hop le"}     ← ngay lap tuc

# Nhung access token cu VAN chay them toi 15 phut nua.
# Voi mot nut dang xuat, do la dieu chap nhan duoc.</div>
<div class="pitfall">
<p><strong>Trap — clearing the cookie is not logging out.</strong> <code>res.clearCookie()</code> removes the browser's copy and leaves the row alive, so anyone who captured that token — from a log, a shared machine, a proxy — can still use it for thirty days. Logout is an <code>UPDATE</code> in the database; the cookie is a convenience for the browser. A logout endpoint that only clears cookies is one of the most common findings in an authentication review.</p>
</div>

<h3>The fast path, for events 4 and 5</h3>
<pre><code><span class="tok-comment">// Khi khoá một tài khoản hoặc hạ quyền — có hiệu lực NGAY</span>
export async function lockAccount(userId: string) {
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { locked: true } }),
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null }, data: { revokedAt: new Date() },
    }),
  ]);

  <span class="tok-comment">// Chặn cả những access token ĐANG BAY, trong đúng tuổi thọ còn lại</span>
  await redis.set(&#96;chan-nguoi:\${userId}&#96;, '1', { EX: 900 });
}</code></pre>
<pre><code><span class="tok-comment">// Middleware: một lần EXISTS, chỉ cho những token đã qua chữ ký</span>
export async function requireAuth(req, res, next) {
  const claims = await checkToken(getToken(req));          <span class="tok-comment">// chữ ký + claim</span>

  if (await redis.exists(&#96;chan-nguoi:\${claims.sub}&#96;)) {   <span class="tok-comment">// ~0,05 ms</span>
    return res.status(401).json({ error: 'Tai khoan da bi khoa' });
  }
  req.user = claims;
  next();
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The list stays tiny</span><span class="lz-t">By construction</span><span class="lz-d">An entry lives for one access-token lifetime and then disappears. Even a service disabling a hundred accounts an hour holds about twenty-five keys at any moment. This is not a session store; it is a fifteen-minute buffer.</span></div>
  <div class="lz-step"><span class="lz-k">Keyed by user, not by token</span><span class="lz-t">One entry covers every device</span><span class="lz-d">A banned user may have five access tokens in flight across three devices. One key blocks all of them, and you do not need to know how many exist.</span></div>
  <div class="lz-step"><span class="lz-k">It can fail open</span><span class="lz-t">And that is a deliberate choice</span><span class="lz-d">If Redis is down, skip the check and log it: the account is still disabled at the refresh path, so the window degrades back to fifteen minutes rather than the API going down. Decide this explicitly — for a banking system the opposite choice may be right.</span></div>
  <div class="lz-step"><span class="lz-k">Only for events 4 and 5</span><span class="lz-t">Resist the urge to extend it</span><span class="lz-d">Adding an entry for every logout turns it into a per-request session lookup and gives back everything the split bought. Two events justify it. A third one usually means the access lifetime is too long.</span></div>
</div>

<h3>Password change: revoke, but keep this device</h3>
<pre><code>export async function changePassword(u: User, cu: string, moi: string, currentFamilyId: string) {
  if (!(await checkPassword(u.bam, cu))) throw new HttpError(400, 'Mat ksuffix hien tai khong dung');

  await prisma.$transaction([
    prisma.user.update({
      where: { id: u.id },
      data:  { bam: await hash(prepare(moi), PARAMS) },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: u.id, hoId: { not: currentFamilyId }, revokedAt: null },
      data:  { revokedAt: new Date() },
    }),
  ]);

  await sendEmail(u.email, 'mat-khau-da-doi', { luc: new Date(), ip: req.ip });
}</code></pre>
<div class="out">SELECT "hoId", "revokedAt" IS NOT NULL AS da_thu_hoi
FROM "RefreshToken" WHERE "userId" = 'clx7a2b1c' AND "revokedAt" IS NULL OR true;

  hoId     | da_thu_hoi
-----------+------------
 f47ac10b… | f            ← trinh duyet hien tai, VAN dang nhap
 a91c4e7b… | t            ← dien thoai, da thoat
 3d5b8f02… | t            ← mot session khong nhan ra, da thoat</div>
<div class="callout ok">
<p><strong>Always send the email, and always include the time and the approximate location.</strong> If the user did change their password, it is a harmless confirmation. If they did not, it is the only channel that reaches them — the attacker controls the session but not the mailbox. This one email is the highest-value notification in an authentication system, and it costs one function call.</p>
</div>

<h3>Deletion, and what the database does for you</h3>
<pre><code>model RefreshToken {
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cascade handles hard deletion</span><span class="lz-lnote">Deleting the user row removes every refresh token in the same statement, at the database level, with no application code involved. That is one fewer thing to forget in the delete-account flow.</span></div>
  <div class="lz-layer"><span class="lz-lname">Soft deletion does not cascade</span><span class="lz-lnote">Setting <code>xoaLuc</code> on a user changes nothing about their tokens — this is exactly Lesson 10.5 of the Prisma course. If you soft-delete, revoke explicitly in the same transaction; a foreign key will not do it for you.</span></div>
  <div class="lz-layer"><span class="lz-lname">Keep the audit trail for a while</span><span class="lz-lnote">Revoked rows are how you answer "was this session used after the user reported the problem?". Delete them a week later in the cleanup job, not at the moment of revocation.</span></div>
  <div class="lz-layer"><span class="lz-lname">Test the account-deletion path</span><span class="lz-lnote">It is rarely exercised and it touches everything. A test that deletes a user and then asserts that both an old access token and an old refresh token fail is fifteen lines, and it catches the case where a new table was added without a cascade.</span></div>
</div>
<div class="note-ct">
<p><strong>The one-page summary, for the code review.</strong> Logout revokes the row, not just the cookie · sign-out-everywhere is one <code>updateMany</code> · password change revokes all families except the current one and sends an email · disabling an account and removing a role also write a Redis key with a TTL equal to the access lifetime · and the middleware checks that key only after the signature has already verified. Five events, three mechanisms, and one deliberate decision about which events can wait fifteen minutes.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#session-expiration" target="_blank" rel="noopener"><span class="lc-ico">🚪</span><span class="lc-body"><span class="lc-title">OWASP — session termination</span><span class="lc-sub">cheatsheetseries.owasp.org · What logout must actually do, server-side</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7009" target="_blank" rel="noopener"><span class="lc-ico">🗑️</span><span class="lc-body"><span class="lc-title">RFC 7009 — token revocation</span><span class="lc-sub">datatracker.ietf.org · The standard revocation endpoint, for when you are an OAuth server</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-backchannel-1_0.html" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">OIDC back-channel logout</span><span class="lc-sub">openid.net · Propagating a logout to every relying party — Chapter 8's version of this problem</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">TTL semantics, and what happens to the denylist when Redis restarts</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Trigger all five events and measure how long each takes to take effect</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Năm sự kiện bắt buộc phải kết thúc một phiên</h2>
<p class="lead">Bài 5.1 đã chọn một cửa sổ thu hồi. Bài này quyết định, TỪNG SỰ KIỆN MỘT, xem cái cửa sổ đó có chấp nhận được không — vì "đăng xuất trong vòng mười lăm phút" là ổn với một cái nút đăng xuất và KHÔNG chấp nhận được với một quản trị viên đang khoá một kẻ đang gây hại. Hai trong năm cái cần thứ nhanh hơn, và nó nhỏ hơn bạn tưởng.</p>

<h3>Năm sự kiện, và mỗi cái đòi hỏi gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Đăng xuất, thiết bị này</span><span class="v">Thu hồi refresh token này, xoá cookie, bảo client bỏ access token trong bộ nhớ đi. Access token vẫn còn hiệu lực kỹ thuật trong mấy phút còn lại — và vì nó chỉ tồn tại trong một trang vừa điều hướng đi mất, điều đó chấp nhận được.</span></div>
  <div class="kv"><span class="k">2 · Thoát khỏi mọi thiết bị</span><span class="v">Thu hồi MỌI refresh token của người đó. Vẫn cùng cửa sổ đó, và người dùng đã YÊU CẦU tường minh, nên hãy nói cho họ biết: "bạn sẽ bị đăng xuất trên các thiết bị khác trong vòng mười lăm phút."</span></div>
  <div class="kv"><span class="k">3 · Đổi hoặc đặt lại mật khẩu</span><span class="v">Thu hồi mọi refresh token TRỪ cái hiện tại, để người dùng vẫn ở trạng thái đăng nhập tại chỗ họ đang ngồi. Nếu họ đổi vì TIN rằng có người khác biết mật khẩu, thì mười lăm phút truy cập nữa cho kẻ tấn công là một khoảng hở THẬT — xem đường nhanh bên dưới.</span></div>
  <div class="kv"><span class="k">4 · Tài khoản bị khoá hoặc bị xoá ⚡</span><span class="v">KHÔNG chờ được. Một quản trị viên khoá tài khoản là đang phản ứng với một chuyện ĐANG xảy ra — lạm dụng, gian lận, một nhân viên bị chiếm máy. Mười lăm phút nữa là mười lăm phút nữa của chuyện đó.</span></div>
  <div class="kv"><span class="k">5 · Vai trò hoặc quyền bị GỠ ⚡</span><span class="v">HẠ quyền thì không chờ được; NÂNG quyền thì chờ được. Gỡ quyền admin của ai đó rồi để họ làm admin thêm mười lăm phút là vô hiệu hoá chính mục đích của việc gỡ.</span></div>
</div>

<h3>Ba cơ chế</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Thu hồi hàng refresh</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tức thì với đường refresh</span><span class="lz-nsub">Không access token mới nào được cấp nữa · không tốn gì</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Chờ hết cửa sổ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">≤ 15 phút</span><span class="lz-nsub">Đúng cho sự kiện 1, 2 và phần lớn ca của 3</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Một danh sách chặn NHỎ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tức thì, cho sự kiện 4 và 5</span><span class="lz-nsub">Một khoá Redis cho mỗi người bị ảnh hưởng, TTL = tuổi thọ access</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Sự kiện 1 và 2 — chỉ là những câu UPDATE</span>
export async function signOut(refreshToken: string, res: Response) {
  const hash = createHash('sha256').update(refreshToken).digest('hex');
  await prisma.refreshToken.updateMany({
    where: { tokenHash: bam, revokedAt: null },
    data:  { revokedAt: new Date() },
  });
  clearRefreshCookie(res);
}

export async function signOutEverywhere(userId: string, giuLaiHoId?: string) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null, ...(giuLaiHoId &amp;&amp; { hoId: { not: giuLaiHoId } }) },
    data:  { revokedAt: new Date() },
  });
}</code></pre>
<div class="out">$ curl -X POST localhost:3000/auth/dang-xuat -b "__Host-refresh=Kc9x2Lm…"
HTTP/1.1 204 No Content
Set-Cookie: __Host-refresh=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0

$ curl -X POST localhost:3000/auth/refresh -b "__Host-refresh=Kc9x2Lm…"
HTTP/1.1 401 {"loi":"Session khong hop le"}     ← ngay lap tuc

# Nhung access token cu VAN chay them toi 15 phut nua.
# Voi mot nut dang xuat, do la dieu chap nhan duoc.</div>
<div class="pitfall">
<p><strong>Bẫy — XOÁ COOKIE KHÔNG PHẢI là đăng xuất.</strong> <code>res.clearCookie()</code> gỡ bản sao của trình duyệt và để nguyên cái HÀNG còn sống, nên bất kỳ ai đã bắt được cái token đó — từ một dòng log, một máy dùng chung, một proxy — vẫn dùng nó được trong ba mươi ngày. Đăng xuất là một câu <code>UPDATE</code> trong cơ sở dữ liệu; cookie chỉ là một tiện nghi cho trình duyệt. Một endpoint đăng xuất chỉ xoá cookie là một trong những phát hiện phổ biến nhất khi soát xét xác thực.</p>
</div>

<h3>Đường nhanh, cho sự kiện 4 và 5</h3>
<pre><code><span class="tok-comment">// Khi khoá một tài khoản hoặc hạ quyền — có hiệu lực NGAY</span>
export async function lockAccount(userId: string) {
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { locked: true } }),
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null }, data: { revokedAt: new Date() },
    }),
  ]);

  <span class="tok-comment">// Chặn cả những access token ĐANG BAY, trong đúng tuổi thọ còn lại</span>
  await redis.set(&#96;chan-nguoi:\${userId}&#96;, '1', { EX: 900 });
}</code></pre>
<pre><code><span class="tok-comment">// Middleware: một lần EXISTS, chỉ cho những token đã qua chữ ký</span>
export async function requireAuth(req, res, next) {
  const claims = await checkToken(getToken(req));          <span class="tok-comment">// chữ ký + claim</span>

  if (await redis.exists(&#96;chan-nguoi:\${claims.sub}&#96;)) {   <span class="tok-comment">// ~0,05 ms</span>
    return res.status(401).json({ error: 'Tai khoan da bi khoa' });
  }
  req.user = claims;
  next();
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Danh sách LUÔN bé xíu</span><span class="lz-t">Theo cấu tạo</span><span class="lz-d">Một mục sống đúng một tuổi thọ access token rồi biến mất. Ngay cả một dịch vụ khoá một trăm tài khoản mỗi giờ cũng chỉ giữ khoảng hai mươi lăm khoá ở mỗi thời điểm. Đây KHÔNG phải một kho phiên; nó là một bộ đệm mười lăm phút.</span></div>
  <div class="lz-step"><span class="lz-k">Khoá theo NGƯỜI DÙNG, không theo token</span><span class="lz-t">Một mục phủ mọi thiết bị</span><span class="lz-d">Một người bị cấm có thể có năm access token đang bay trên ba thiết bị. MỘT khoá chặn hết, và bạn không cần biết có bao nhiêu cái tồn tại.</span></div>
  <div class="lz-step"><span class="lz-k">Nó CHO QUA được khi hỏng</span><span class="lz-t">Và đó là một lựa chọn có chủ ý</span><span class="lz-d">Nếu Redis chết thì bỏ qua phép kiểm và ghi log lại: tài khoản VẪN bị khoá ở đường refresh, nên cửa sổ chỉ tụt về mười lăm phút chứ API không chết. Hãy quyết điều này TƯỜNG MINH — với một hệ thống ngân hàng thì lựa chọn ngược lại có thể mới đúng.</span></div>
  <div class="lz-step"><span class="lz-k">CHỈ cho sự kiện 4 và 5</span><span class="lz-t">Hãy cưỡng lại ý muốn mở rộng nó</span><span class="lz-d">Thêm một mục cho MỌI lần đăng xuất là biến nó thành một lần tra phiên ở mỗi request và trả lại hết những gì việc tách token vừa mua được. Hai sự kiện thì xứng đáng. Một sự kiện thứ ba thường có nghĩa là tuổi thọ access token của bạn đang quá dài.</span></div>
</div>

<h3>Đổi mật khẩu: thu hồi, nhưng GIỮ thiết bị này</h3>
<pre><code>export async function changePassword(u: User, cu: string, moi: string, currentFamilyId: string) {
  if (!(await checkPassword(u.bam, cu))) throw new HttpError(400, 'Mat ksuffix hien tai khong dung');

  await prisma.$transaction([
    prisma.user.update({
      where: { id: u.id },
      data:  { bam: await hash(prepare(moi), PARAMS) },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: u.id, hoId: { not: currentFamilyId }, revokedAt: null },
      data:  { revokedAt: new Date() },
    }),
  ]);

  await sendEmail(u.email, 'mat-khau-da-doi', { luc: new Date(), ip: req.ip });
}</code></pre>
<div class="out">SELECT "hoId", "revokedAt" IS NOT NULL AS da_thu_hoi
FROM "RefreshToken" WHERE "userId" = 'clx7a2b1c' AND "revokedAt" IS NULL OR true;

  hoId     | da_thu_hoi
-----------+------------
 f47ac10b… | f            ← trinh duyet hien tai, VAN dang nhap
 a91c4e7b… | t            ← dien thoai, da thoat
 3d5b8f02… | t            ← mot session khong nhan ra, da thoat</div>
<div class="callout ok">
<p><strong>LUÔN gửi email, và LUÔN kèm thời gian với vị trí gần đúng.</strong> Nếu người dùng ĐÚNG là đã đổi mật khẩu thì đó là một lời xác nhận vô hại. Nếu KHÔNG phải họ thì đó là kênh DUY NHẤT tới được họ — kẻ tấn công kiểm soát cái phiên chứ không kiểm soát hòm thư. Một cái email này là thông báo có GIÁ TRỊ CAO NHẤT trong một hệ xác thực, và nó tốn một lời gọi hàm.</p>
</div>

<h3>Xoá tài khoản, và cơ sở dữ liệu làm giùm bạn cái gì</h3>
<pre><code>model RefreshToken {
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cascade lo phần xoá CỨNG</span><span class="lz-lnote">Xoá hàng người dùng là gỡ MỌI refresh token trong CÙNG câu lệnh, ở mức cơ sở dữ liệu, không cần dòng mã ứng dụng nào. Đó là bớt được một thứ để quên trong luồng xoá tài khoản.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xoá MỀM thì KHÔNG cascade</span><span class="lz-lnote">Đặt <code>xoaLuc</code> trên một người dùng chẳng thay đổi gì với token của họ — đây đúng là Bài 10.5 của khoá Prisma. Nếu bạn xoá mềm thì hãy thu hồi TƯỜNG MINH trong cùng giao dịch; một khoá ngoại sẽ không làm giùm bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Giữ vết kiểm toán một thời gian</span><span class="lz-lnote">Những hàng đã thu hồi là cách bạn trả lời "cái phiên này có bị dùng SAU khi người dùng báo có vấn đề không?". Hãy xoá chúng một tuần sau trong job dọn dẹp, đừng xoá ngay lúc thu hồi.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy KIỂM THỬ đường xoá tài khoản</span><span class="lz-lnote">Nó hiếm khi được chạy tới và nó chạm vào mọi thứ. Một bài test xoá một người dùng rồi khẳng định rằng CẢ một access token cũ LẪN một refresh token cũ đều trượt thì dài mười lăm dòng, và nó bắt được trường hợp có bảng mới thêm vào mà quên cascade.</span></div>
</div>
<div class="note-ct">
<p><strong>Tóm tắt một trang, để dùng lúc review mã.</strong> Đăng xuất thu hồi cái HÀNG, không chỉ cookie · thoát-mọi-thiết-bị là MỘT câu <code>updateMany</code> · đổi mật khẩu thu hồi mọi dòng họ trừ cái hiện tại và gửi một email · khoá tài khoản và gỡ vai trò còn ghi thêm một khoá Redis với TTL bằng tuổi thọ access token · và middleware chỉ kiểm cái khoá đó SAU KHI chữ ký đã được xác minh. Năm sự kiện, ba cơ chế, và MỘT quyết định có chủ ý về việc sự kiện nào chờ được mười lăm phút.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#session-expiration" target="_blank" rel="noopener"><span class="lc-ico">🚪</span><span class="lc-body"><span class="lc-title">OWASP — kết thúc phiên</span><span class="lc-sub">cheatsheetseries.owasp.org · Đăng xuất THẬT SỰ phải làm gì ở phía máy chủ</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7009" target="_blank" rel="noopener"><span class="lc-ico">🗑️</span><span class="lc-body"><span class="lc-title">RFC 7009 — thu hồi token</span><span class="lc-sub">datatracker.ietf.org · Endpoint thu hồi chuẩn, cho lúc bạn là một máy chủ OAuth</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-backchannel-1_0.html" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">OIDC — đăng xuất qua kênh sau</span><span class="lc-sub">openid.net · Lan một lần đăng xuất tới mọi bên tin cậy — phiên bản của Chương 8 cho bài toán này</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">Ngữ nghĩa TTL, và chuyện gì xảy ra với danh sách chặn khi Redis khởi động lại</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Kích hoạt cả năm sự kiện rồi đo xem mỗi cái mất bao lâu để có hiệu lực</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — The device list: revocation the user can see|||5.4 — Danh sách thiết bị: thu hồi mà người dùng NHÌN THẤY',
      slug: 'auth-5-4-danh-sach-thiet-bi',
      type: 'LESSON',
      description: 'Cùng cái bảng ở Bài 5.1 đã chứa đủ mọi thứ để dựng một màn hình "phiên đang hoạt động". Bài này biến nó thành một tính năng: tên thiết bị đọc được, vị trí gần đúng, đánh dấu phiên hiện tại, và một email báo đăng nhập từ thiết bị mới — thứ tìm ra những cú chiếm tài khoản mà giám sát của bạn sẽ không bao giờ thấy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>The device list: revocation the user can see</h2>
<p class="lead">The refresh token table already stores a user agent, an IP and timestamps. Rendering that as a screen turns an internal mechanism into a security feature — and one with a property none of your monitoring has: the user knows which of those sessions is theirs, and you do not.</p>

<h3>The query, and the shape it returns</h3>
<pre><code>export async function sessionList(userId: string, currentFamilyId: string) {
  const rows = await prisma.refreshToken.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
      usedAt: null,                       <span class="tok-comment">// chỉ mắt xích ĐANG SỐNG của mỗi họ</span>
    },
    select: { hoId: true, createdAt: true, browser: true, createdIp: true },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map((r) =&gt; ({
    hoId: r.hoId,
    isCurrent: r.hoId === currentFamilyId,
    device: readDevice(r.browser),      <span class="tok-comment">// "Chrome trên Windows"</span>
    position:   approxLocation(r.createdIp),         <span class="tok-comment">// "Hà Nội, Việt Nam"</span>
    active: r.createdAt,                     <span class="tok-comment">// lần refresh gần nhất</span>
  }));
}</code></pre>
<div class="out">[
  { hoId:"f47ac10b…", isCurrent:true,  device:"Chrome tren Windows",
    position:"Ha Noi, Viet Nam",  active:"2026-08-23T09:44:20Z" },
  { hoId:"a91c4e7b…", isCurrent:false, device:"Safari tren iPhone",
    position:"Ha Noi, Viet Nam",  active:"2026-08-22T18:02:11Z" },
  { hoId:"3d5b8f02…", isCurrent:false, device:"Firefox tren Linux",
    position:"Frankfurt, Duc",    active:"2026-08-23T03:17:44Z" }
]

# Dong thu ba la thu ma nguoi dung nhan ra ngay va giam sat cua ban thi khong:
# ho chua bao gio dung Linux, va chua bao gio o Duc.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">One row per family</span><span class="lz-t">Not per token</span><span class="lz-d">Rotation creates a new row every fifteen minutes. Filtering on <code>usedAt: null</code> gives exactly the live link of each family — one row per logged-in device, which is what the user expects to see.</span></div>
  <div class="lz-step"><span class="lz-k">"Last active" is the newest link's creation time</span><span class="lz-t">Free from rotation</span><span class="lz-d">Because the live token was created at the last refresh, its <code>createdAt</code> <em>is</em> the last-seen time, accurate to the access-token lifetime. No extra column, no per-request write.</span></div>
  <div class="lz-step"><span class="lz-k">Mark the current one</span><span class="lz-t">And do not let them revoke it by accident</span><span class="lz-d">"This device" next to the current family, with revocation for it labelled as logging out rather than as terminating a suspicious session. Without the marker, users revoke the session they are sitting in and file a bug.</span></div>
  <div class="lz-step"><span class="lz-k">Show the family id, never the token</span><span class="lz-t">Obvious, and worth stating</span><span class="lz-d">The revoke button posts a <code>hoId</code>. The token hash never leaves the server and the token itself exists only in the browser that holds it.</span></div>
</div>

<h3>Turning a user agent into something readable</h3>
<pre><code>const PATTERNS: [RegExp, string][] = [
  [/Edg\\//,                     'Edge'],
  [/OPR\\//,                     'Opera'],
  [/Chrome\\//,                  'Chrome'],
  [/Firefox\\//,                 'Firefox'],
  [/Safari\\//,                  'Safari'],
];
const HE: [RegExp, string][] = [
  [/iPhone|iPad/,               'iPhone'],
  [/Android/,                   'Android'],
  [/Windows NT/,                'Windows'],
  [/Mac OS X/,                  'macOS'],
  [/Linux/,                     'Linux'],
];

export function readDevice(ua?: string | null) {
  if (!ua) return 'Thiet bi khong ro';
  const tr = PATTERNS.find(([r]) =&gt; r.test(ua))?.[1] ?? 'Trinh duyet khac';
  const os = OS.find(([r]) =&gt; r.test(ua))?.[1] ?? 'he dieu hanh khac';
  return &#96;\${tr} tren \${he}&#96;;
}</code></pre>
<div class="pitfall">
<p><strong>Trap — the user agent is unreliable, being deliberately reduced, and trivially forged.</strong> Chrome and others now freeze most of the string, privacy tools rewrite it, and an attacker simply copies the victim's. So it is fine for a <em>label</em> a human recognises — "that Firefox on Linux is not me" — and it must never be a security check. Never reject a request because the user agent changed; you would break legitimate browser updates and stop nobody.</p>
</div>

<h3>Location, with the caveats stated to the user</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">City-level, from an IP database</span><span class="v">MaxMind GeoLite2 or similar, looked up when the row is created, not on every render. Store the resulting string rather than re-deriving it — the IP-to-city mapping changes and a session's displayed location should not.</span></div>
  <div class="kv"><span class="k">It is often wrong, and say so</span><span class="v">Mobile carriers route traffic through a handful of cities, VPNs move people continents, and corporate networks exit somewhere else entirely. "Approximate location — this can be inaccurate on mobile networks" prevents a support ticket per week.</span></div>
  <div class="kv"><span class="k">Store the IP, show the city</span><span class="v">The full address is useful for your own investigation and is personal data. Show the city, keep the address in the row, and delete it with the row — Lesson 3.1's cleanup job already does that.</span></div>
  <div class="kv"><span class="k">Behind a proxy, read the right header</span><span class="v"><code>req.ip</code> is your load balancer unless <code>trust proxy</code> is configured, in which case it is the first entry of <code>X-Forwarded-For</code>. Get this wrong and every session shows the same location — which is a very visible bug on this exact screen.</span></div>
</div>

<h3>The revoke button</h3>
<pre><code>app.post('/tai-khoan/session/:hoId/thu-hoi', requireAuth, needsReauth(30), async (req, res) =&gt; {
  const { count } = await prisma.refreshToken.updateMany({
    where: {
      hoId: req.params.hoId,
      userId: req.user.sub,          <span class="tok-comment">// ← cổng 3, Bài 0.2</span>
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
  if (count === 0) return res.status(404).json({ error: 'Khong tim thay session' });

  await redis.set(&#96;chan-ho:\${req.params.hoId}&#96;, '1', { EX: 900 });   <span class="tok-comment">// Bài 5.3</span>
  res.status(204).end();
});</code></pre>
<div class="out">$ curl -X POST /tai-khoan/session/3d5b8f02…/thu-hoi -H "Authorization: Bearer …"
HTTP/1.1 204 No Content

# Session Frankfurt chet o duong refresh NGAY LAP TUC.
# Access token cua no chet trong &lt;= 15 phut, hoac ngay lap tuc neu
# ban them khoa chan-ho vao middleware.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The ownership check is in the <code>where</code></span><span class="lz-lnote">Lesson 0.2, again: <code>userId: req.user.sub</code> inside the filter means one user cannot revoke another's session by posting a guessed <code>hoId</code>. A count of zero becomes a 404, which does not confirm whether the id exists.</span></div>
  <div class="lz-layer"><span class="lz-lname">Require recent authentication</span><span class="lz-lnote">Revoking sessions is a security action, so Lesson 3.3's step-up applies. An attacker who has a session should not be able to lock the real user out of their other devices without proving the password.</span></div>
  <div class="lz-layer"><span class="lz-lname">Offer "revoke all others" prominently</span><span class="lz-lnote">A user who sees something wrong wants one button, not five. Combine it with a forced password change in the same flow — that is the response you actually want them to take.</span></div>
  <div class="lz-layer"><span class="lz-lname">Log every revocation</span><span class="lz-lnote">Who revoked what, when, from where. When a user later asks "why was I logged out on my phone", the answer is in the log rather than in a guess, and Chapter 11's audit trail wants this event anyway.</span></div>
</div>

<h3>The email that does the most work</h3>
<pre><code><span class="tok-comment">// Đăng nhập từ một thiết bị chưa từng thấy → gửi thư</span>
const seenBefore = await prisma.refreshToken.findFirst({
  where: { userId: u.id, browser: deviceFingerprint(req) },
});

if (!seenBefore) {
  await sendEmail(u.email, 'dang-nhap-thiet-bi-moi', {
    device: readDevice(req.get('user-agent')),
    position:   approxLocation(req.ip),
    luc:     new Date(),
    link: 'https://vidu.com/tai-khoan/session',
  });
}</code></pre>
<div class="callout ok">
<p><strong>This email finds compromises your monitoring cannot.</strong> A login from a new device in an unusual city with a correct password is, to your systems, a completely normal login — there is nothing to alert on. The account's owner reads the same facts and knows instantly. That asymmetry is the entire value of the feature, and it is why the notification matters more than the list: the list requires the user to go looking, and the email goes to them.</p>
</div>
<div class="note-ct">
<p><strong>What to build, in order of value per hour spent.</strong> First the new-device email — it reaches users who will never open a settings page, and it is one function call at login. Then "sign out of all other devices" as a single button, because that is what someone does after reading the email. Then the list itself, which is the most work and the least urgent. Building the list first and the email later is the common order, and it is backwards: the screen only helps people who already suspect something.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#logout" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — session termination and visibility</span><span class="lc-sub">cheatsheetseries.owasp.org · Why users need to see and end their own sessions</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/User-Agent" target="_blank" rel="noopener"><span class="lc-ico">🕵️</span><span class="lc-body"><span class="lc-title">MDN — User-Agent</span><span class="lc-sub">developer.mozilla.org · Why the string is being frozen, and what to use instead</span></span></a>
<a class="link-card" href="https://dev.maxmind.com/geoip/geolite2-free-geolocation-data" target="_blank" rel="noopener"><span class="lc-ico">🌍</span><span class="lc-body"><span class="lc-title">GeoLite2</span><span class="lc-sub">dev.maxmind.com · A free IP-to-city database, with its accuracy documented honestly</span></span></a>
<a class="link-card" href="https://expressjs.com/en/guide/behind-proxies.html" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">Express — behind proxies</span><span class="lc-sub">expressjs.com · Getting req.ip right, which this whole screen depends on</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Build the session list from the existing table, then revoke one device from another</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Danh sách thiết bị: thu hồi mà người dùng NHÌN THẤY</h2>
<p class="lead">Bảng refresh token vốn đã lưu user agent, một địa chỉ IP và các dấu thời gian. Vẽ chúng ra thành một màn hình là biến một cơ chế nội bộ thành một TÍNH NĂNG bảo mật — và là tính năng có một tính chất mà không hệ giám sát nào của bạn có: NGƯỜI DÙNG biết phiên nào là của họ, còn bạn thì không.</p>

<h3>Câu truy vấn, và hình dạng nó trả về</h3>
<pre><code>export async function sessionList(userId: string, currentFamilyId: string) {
  const rows = await prisma.refreshToken.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
      usedAt: null,                       <span class="tok-comment">// chỉ mắt xích ĐANG SỐNG của mỗi họ</span>
    },
    select: { hoId: true, createdAt: true, browser: true, createdIp: true },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map((r) =&gt; ({
    hoId: r.hoId,
    isCurrent: r.hoId === currentFamilyId,
    device: readDevice(r.browser),      <span class="tok-comment">// "Chrome trên Windows"</span>
    position:   approxLocation(r.createdIp),         <span class="tok-comment">// "Hà Nội, Việt Nam"</span>
    active: r.createdAt,                     <span class="tok-comment">// lần refresh gần nhất</span>
  }));
}</code></pre>
<div class="out">[
  { hoId:"f47ac10b…", isCurrent:true,  device:"Chrome tren Windows",
    position:"Ha Noi, Viet Nam",  active:"2026-08-23T09:44:20Z" },
  { hoId:"a91c4e7b…", isCurrent:false, device:"Safari tren iPhone",
    position:"Ha Noi, Viet Nam",  active:"2026-08-22T18:02:11Z" },
  { hoId:"3d5b8f02…", isCurrent:false, device:"Firefox tren Linux",
    position:"Frankfurt, Duc",    active:"2026-08-23T03:17:44Z" }
]

# Dong thu ba la thu ma nguoi dung nhan ra ngay va giam sat cua ban thi khong:
# ho chua bao gio dung Linux, va chua bao gio o Duc.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">MỘT hàng cho mỗi HỌ</span><span class="lz-t">Không phải cho mỗi token</span><span class="lz-d">Việc xoay vòng tạo ra một hàng mới mỗi mười lăm phút. Lọc theo <code>usedAt: null</code> cho ra đúng mắt xích ĐANG SỐNG của từng họ — một hàng cho mỗi thiết bị đang đăng nhập, đúng thứ người dùng mong nhìn thấy.</span></div>
  <div class="lz-step"><span class="lz-k">"Hoạt động lần cuối" là thời điểm TẠO của mắt xích mới nhất</span><span class="lz-t">Có sẵn nhờ xoay vòng</span><span class="lz-d">Vì token đang sống được tạo ra ở lần refresh gần nhất, nên <code>createdAt</code> của nó CHÍNH LÀ thời điểm nhìn thấy lần cuối, chính xác tới mức tuổi thọ access token. Không thêm cột, không ghi cho mỗi request.</span></div>
  <div class="lz-step"><span class="lz-k">Đánh dấu cái HIỆN TẠI</span><span class="lz-t">Và đừng để họ lỡ tay thu hồi nó</span><span class="lz-d">Ghi "Thiết bị này" cạnh dòng của họ hiện tại, và nút thu hồi cho nó thì gọi là ĐĂNG XUẤT chứ không phải kết thúc một phiên khả nghi. Không có cái dấu đó, người dùng sẽ thu hồi chính cái phiên họ đang ngồi rồi báo lỗi.</span></div>
  <div class="lz-step"><span class="lz-k">Hiện mã HỌ, ĐỪNG BAO GIỜ hiện token</span><span class="lz-t">Hiển nhiên, và vẫn đáng nói ra</span><span class="lz-d">Nút thu hồi gửi lên một <code>hoId</code>. Chuỗi băm của token không bao giờ rời khỏi máy chủ, còn chính cái token thì chỉ tồn tại trong cái trình duyệt đang giữ nó.</span></div>
</div>

<h3>Biến một user agent thành thứ đọc được</h3>
<pre><code>const PATTERNS: [RegExp, string][] = [
  [/Edg\\//,                     'Edge'],
  [/OPR\\//,                     'Opera'],
  [/Chrome\\//,                  'Chrome'],
  [/Firefox\\//,                 'Firefox'],
  [/Safari\\//,                  'Safari'],
];
const HE: [RegExp, string][] = [
  [/iPhone|iPad/,               'iPhone'],
  [/Android/,                   'Android'],
  [/Windows NT/,                'Windows'],
  [/Mac OS X/,                  'macOS'],
  [/Linux/,                     'Linux'],
];

export function readDevice(ua?: string | null) {
  if (!ua) return 'Thiet bi khong ro';
  const tr = PATTERNS.find(([r]) =&gt; r.test(ua))?.[1] ?? 'Trinh duyet khac';
  const os = OS.find(([r]) =&gt; r.test(ua))?.[1] ?? 'he dieu hanh khac';
  return &#96;\${tr} tren \${he}&#96;;
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — user agent thì KHÔNG đáng tin, đang bị CỐ Ý rút gọn, và giả mạo cực dễ.</strong> Chrome và các trình duyệt khác nay đã đóng băng phần lớn chuỗi đó, các công cụ riêng tư thì viết lại nó, và kẻ tấn công thì chỉ việc COPY của nạn nhân. Nên nó ổn cho một cái <em>NHÃN</em> mà con người nhận ra — "cái Firefox trên Linux kia không phải tôi" — và nó KHÔNG BAO GIỜ được là một phép kiểm bảo mật. Đừng bao giờ từ chối một request vì user agent đã đổi; bạn sẽ phá vỡ những lần cập nhật trình duyệt chính đáng và chẳng chặn được ai.</p>
</div>

<h3>Vị trí, kèm những lưu ý NÓI THẲNG với người dùng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ở mức thành phố, từ một cơ sở dữ liệu IP</span><span class="v">MaxMind GeoLite2 hoặc tương đương, tra lúc TẠO hàng chứ không phải lúc vẽ ra. Hãy LƯU cái chuỗi kết quả thay vì suy lại — ánh xạ IP-sang-thành-phố có thay đổi, còn vị trí hiển thị của một phiên thì không nên đổi.</span></div>
  <div class="kv"><span class="k">Nó SAI thường xuyên, và hãy nói ra</span><span class="v">Nhà mạng di động định tuyến qua một nhúm thành phố, VPN dời người ta sang lục địa khác, và mạng doanh nghiệp đi ra ở một nơi hoàn toàn khác. Một dòng "Vị trí gần đúng — có thể không chính xác trên mạng di động" ngăn được một phiếu hỗ trợ mỗi tuần.</span></div>
  <div class="kv"><span class="k">LƯU địa chỉ IP, HIỆN thành phố</span><span class="v">Địa chỉ đầy đủ hữu ích cho việc điều tra của chính bạn và nó là dữ liệu cá nhân. Hãy hiện thành phố, giữ địa chỉ trong hàng, và xoá nó cùng với hàng — job dọn dẹp của Bài 3.1 vốn đã làm điều đó.</span></div>
  <div class="kv"><span class="k">Sau một proxy thì phải đọc ĐÚNG header</span><span class="v"><code>req.ip</code> là bộ cân bằng tải của bạn trừ khi có <code>trust proxy</code>, khi đó nó mới là mục đầu tiên của <code>X-Forwarded-For</code>. Làm sai chỗ này thì MỌI phiên đều hiện cùng một vị trí — một con bug rất dễ thấy trên đúng cái màn hình này.</span></div>
</div>

<h3>Cái nút thu hồi</h3>
<pre><code>app.post('/tai-khoan/session/:hoId/thu-hoi', requireAuth, needsReauth(30), async (req, res) =&gt; {
  const { count } = await prisma.refreshToken.updateMany({
    where: {
      hoId: req.params.hoId,
      userId: req.user.sub,          <span class="tok-comment">// ← cổng 3, Bài 0.2</span>
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
  if (count === 0) return res.status(404).json({ error: 'Khong tim thay session' });

  await redis.set(&#96;chan-ho:\${req.params.hoId}&#96;, '1', { EX: 900 });   <span class="tok-comment">// Bài 5.3</span>
  res.status(204).end();
});</code></pre>
<div class="out">$ curl -X POST /tai-khoan/session/3d5b8f02…/thu-hoi -H "Authorization: Bearer …"
HTTP/1.1 204 No Content

# Session Frankfurt chet o duong refresh NGAY LAP TUC.
# Access token cua no chet trong &lt;= 15 phut, hoac ngay lap tuc neu
# ban them khoa chan-ho vao middleware.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Phép kiểm quyền sở hữu nằm TRONG <code>where</code></span><span class="lz-lnote">Lại là Bài 0.2: <code>userId: req.user.sub</code> nằm trong bộ lọc nghĩa là một người dùng KHÔNG thu hồi được phiên của người khác bằng cách gửi lên một <code>hoId</code> đoán bừa. Số đếm bằng không thành 404, thứ không xác nhận cái id đó có tồn tại hay không.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy ĐÒI xác thực gần đây</span><span class="lz-lnote">Thu hồi phiên là một hành động bảo mật, nên việc xác thực theo bậc của Bài 3.3 áp dụng. Một kẻ tấn công đang cầm một phiên KHÔNG được phép khoá người dùng thật ra khỏi các thiết bị khác mà không chứng minh mật khẩu.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy để "thu hồi mọi cái khác" thật NỔI BẬT</span><span class="lz-lnote">Một người dùng thấy có gì sai thì muốn MỘT cái nút, không phải năm cái. Hãy gộp nó với một lần bắt buộc đổi mật khẩu trong cùng luồng — đó mới là phản ứng bạn THẬT SỰ muốn họ thực hiện.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ghi log MỌI lần thu hồi</span><span class="lz-lnote">Ai thu hồi cái gì, lúc nào, từ đâu. Khi một người dùng sau này hỏi "vì sao điện thoại tôi bị đăng xuất", câu trả lời nằm trong nhật ký chứ không nằm trong phỏng đoán, và dù sao vết kiểm toán của Chương 11 cũng cần sự kiện này.</span></div>
</div>

<h3>Cái email làm được nhiều việc nhất</h3>
<pre><code><span class="tok-comment">// Đăng nhập từ một thiết bị chưa từng thấy → gửi thư</span>
const seenBefore = await prisma.refreshToken.findFirst({
  where: { userId: u.id, browser: deviceFingerprint(req) },
});

if (!seenBefore) {
  await sendEmail(u.email, 'dang-nhap-thiet-bi-moi', {
    device: readDevice(req.get('user-agent')),
    position:   approxLocation(req.ip),
    luc:     new Date(),
    link: 'https://vidu.com/tai-khoan/session',
  });
}</code></pre>
<div class="callout ok">
<p><strong>Cái email này tìm ra những cú chiếm tài khoản mà hệ giám sát của bạn KHÔNG thể.</strong> Một lần đăng nhập từ thiết bị mới, ở một thành phố lạ, với mật khẩu ĐÚNG thì — với hệ thống của bạn — là một lần đăng nhập hoàn toàn bình thường; chẳng có gì để cảnh báo. Chủ tài khoản đọc đúng những dữ kiện đó và biết NGAY LẬP TỨC. Sự bất đối xứng đó chính là toàn bộ giá trị của tính năng này, và đó là lý do cái THÔNG BÁO quan trọng hơn cái DANH SÁCH: danh sách đòi người dùng phải chủ động đi tìm, còn email thì tự tìm tới họ.</p>
</div>
<div class="note-ct">
<p><strong>Nên dựng gì trước, xếp theo giá trị trên mỗi giờ bỏ ra.</strong> Đầu tiên là email thiết-bị-mới — nó tới được cả những người sẽ không bao giờ mở trang cài đặt, và nó là một lời gọi hàm lúc đăng nhập. Rồi tới "thoát khỏi mọi thiết bị khác" dưới dạng MỘT cái nút, vì đó là việc người ta làm sau khi đọc email. Rồi mới tới cái danh sách, thứ tốn công nhất và ít cấp bách nhất. Dựng danh sách trước rồi mới tới email là thứ tự phổ biến, và nó NGƯỢC: cái màn hình chỉ giúp được những người vốn đã nghi ngờ điều gì đó.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#logout" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — kết thúc phiên và khả năng nhìn thấy</span><span class="lc-sub">cheatsheetseries.owasp.org · Vì sao người dùng cần THẤY và tự kết thúc phiên của họ</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/User-Agent" target="_blank" rel="noopener"><span class="lc-ico">🕵️</span><span class="lc-body"><span class="lc-title">MDN — User-Agent</span><span class="lc-sub">developer.mozilla.org · Vì sao chuỗi này đang bị đóng băng, và nên dùng gì thay thế</span></span></a>
<a class="link-card" href="https://dev.maxmind.com/geoip/geolite2-free-geolocation-data" target="_blank" rel="noopener"><span class="lc-ico">🌍</span><span class="lc-body"><span class="lc-title">GeoLite2</span><span class="lc-sub">dev.maxmind.com · Một cơ sở dữ liệu IP-sang-thành-phố miễn phí, kèm phần độ chính xác nói thẳng</span></span></a>
<a class="link-card" href="https://expressjs.com/en/guide/behind-proxies.html" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">Express — chạy sau proxy</span><span class="lc-sub">expressjs.com · Lấy req.ip cho đúng, thứ mà cả cái màn hình này phụ thuộc vào</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Dựng danh sách phiên từ cái bảng đã có, rồi thu hồi một thiết bị từ một thiết bị khác</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — The refresh race, and the false positive that kills the feature|||5.5 — Cuộc đua refresh, và cú cảnh báo giả giết chết cả tính năng',
      slug: 'auth-5-5-cuoc-dua-refresh',
      type: 'LESSON',
      description: 'Mười request cùng hết hạn một lúc là mười lời gọi refresh, chín trong số đó trông y hệt việc tái dùng token, và cả họ bị thu hồi. Bài này vá nó ở BỐN chỗ: một lời hứa dùng chung trong tab, khoá Web Locks giữa các tab, refresh chủ động trước khi hết hạn, và một cửa sổ ân hạn phía máy chủ cho cái mà client không sửa nổi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>The refresh race, and the false positive that kills the feature</h2>
<p class="lead">Reuse detection from Lesson 5.2 assumes that a used refresh token being presented again means theft. In practice it usually means the client sent two refreshes at once. Get this wrong and users are logged out at random, the team blames reuse detection, and the best security mechanism in the chapter gets turned off — so this lesson is not optional polish.</p>

<h3>The race</h3>
<pre><code><span class="tok-comment">// Một trang tải xong, gửi mười request. Access token vừa hết hạn.</span>
Promise.all([
  goi('/api/me'), goi('/api/thong-bao'), goi('/api/feed'),
  goi('/api/cart'), goi('/api/messages'), <span class="tok-comment">/* … */</span>
]);</code></pre>
<div class="out">09:44:20.104  GET /api/toi         → 401
09:44:20.106  GET /api/thong-bao   → 401
09:44:20.107  GET /api/feed        → 401          ← ca salt cai, cung mot luc
…
09:44:20.130  POST /auth/refresh   RT1 → RT2      ✅ cai dau tien thang
09:44:20.131  POST /auth/refresh   RT1 → TAI DUNG ❌
09:44:20.133  POST /auth/refresh   RT1 → TAI DUNG ❌
…
09:44:20.148  Ca HO bi thu hoi. Nguoi dung bi day ve trang dang nhap.

# Khong co ke tan cong nao. Chi la mot cai interceptor viet ngay tho.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">In one tab</span><span class="lz-t">Concurrent fetches</span><span class="lz-d">Ten requests, ten 401s, ten interceptors each deciding independently to refresh. The most common cause, and the easiest to fix.</span></div>
  <div class="lz-step"><span class="lz-k">Across tabs</span><span class="lz-t">Shared cookie, separate JavaScript</span><span class="lz-d">Three tabs of your app each have their own module scope and their own in-flight promise. They share the refresh cookie and know nothing about each other.</span></div>
  <div class="lz-step"><span class="lz-k">On mobile</span><span class="lz-t">The response that never arrived</span><span class="lz-d">The app refreshes, the network drops before the response lands, the app retries with the token it still has. The server already rotated it. This one the client genuinely cannot fix — it does not know whether the first attempt succeeded.</span></div>
  <div class="lz-step"><span class="lz-k">On resume</span><span class="lz-t">Everything at once</span><span class="lz-d">A phone comes back from the background and every pending request, every websocket reconnect and every poll fires in the same tick, with an access token that expired an hour ago.</span></div>
</div>

<h3>Fix 1 — one in-flight refresh per tab</h3>
<pre><code>let refreshing: Promise&lt;string&gt; | null = null;

async function getNewAccessToken(): Promise&lt;string&gt; {
  if (refreshing) return refreshing;              <span class="tok-comment">// ← mọi người cùng chờ MỘT cái</span>

  refreshing = (async () =&gt; {
    const r = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' });
    if (!r.ok) { redirectToSignIn(); throw new Error('refresh that bai'); }
    return (await r.json()).accessToken;
  })().finally(() =&gt; { refreshing = null; });

  return refreshing;
}</code></pre>
<div class="out">09:44:20.130  POST /auth/refresh   RT1 → RT2      ✅  (mot lan duy nhat)
09:44:20.152  Ca salt request thu lai voi access token moi. Xong.</div>
<div class="pitfall">
<p><strong>Trap — never retry a failed refresh, and never refresh in response to a failed refresh.</strong> If <code>/auth/refresh</code> returns 401, the session is over: redirect to login. An interceptor that treats the refresh call like any other request will see its 401, try to refresh, get another 401, and loop until the browser tab freezes. Exclude the refresh endpoint from the interceptor explicitly.</p>
</div>

<h3>Fix 2 — coordinate across tabs</h3>
<pre><code><span class="tok-comment">// Web Locks: một cái khoá dùng chung cho mọi tab CÙNG origin</span>
async function getNewAccessToken(): Promise&lt;string&gt; {
  return navigator.locks.request('lam-moi-token', async () =&gt; {
    <span class="tok-comment">// Tab khác có thể vừa làm mới xong trong lúc ta đợi khoá.</span>
    if (stillValid(accessToken)) return accessToken!;

    const r = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' });
    if (!r.ok) { redirectToSignIn(); throw new Error('refresh that bai'); }

    accessToken = (await r.json()).accessToken;
    return accessToken;
  });
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">The re-check inside the lock is the point</span><span class="v">Whoever waited on the lock must ask again whether a refresh is still needed. Without that line, three tabs queue on the lock and then each performs its own refresh in turn — the same race, just serialised.</span></div>
  <div class="kv"><span class="k">Where the new token goes</span><span class="v">Each tab holds its own <code>accessToken</code> variable, so a tab that did not perform the refresh still has the old one. Either keep the token in the lock's return value as above, or broadcast it with <code>BroadcastChannel</code> — never <code>localStorage</code>, which is Lesson 4.5's problem.</span></div>
  <div class="kv"><span class="k">Support is good, and the fallback is easy</span><span class="v"><code>navigator.locks</code> is available in every current browser. Where it is missing, fall back to fix 1 and let the server's grace window absorb the cross-tab case.</span></div>
  <div class="kv"><span class="k">Native apps have the same problem</span><span class="v">A mutex around the refresh call, plus the same re-check inside it. The shape is identical; only the primitive changes.</span></div>
</div>

<h3>Fix 3 — refresh before the 401, not after</h3>
<pre><code><span class="tok-comment">// Access token 15 phút → làm mới ở phút thứ 12. Không bao giờ thấy 401.</span>
let expiresAt = 0;

function schedule(expiresIn: number) {
  expiresAt = Date.now() + expiresIn * 1000;
  setTimeout(() =&gt; { getNewAccessToken().catch(() =&gt; {}); }, expiresIn * 0.8 * 1000);
}

async function call(url: string, opt: RequestInit = {}) {
  if (Date.now() &gt; expiresAt - 30_000) await getNewAccessToken();   <span class="tok-comment">// hàng rào 30 giây</span>
  <span class="tok-comment">// …gửi request; 401 giờ là ngoại lệ, không phải chuyện thường ngày</span>
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The storm disappears</span><span class="lz-lnote">Ten simultaneous requests with a valid token are ten normal requests. The refresh happened three minutes ago, alone, with nothing racing it. This removes the cause rather than handling the symptom.</span></div>
  <div class="lz-layer"><span class="lz-lname">Timers do not fire in a backgrounded tab</span><span class="lz-lnote">Browsers throttle or suspend <code>setTimeout</code> in inactive tabs, and a sleeping phone runs nothing at all. That is why the pre-flight check on every call is still needed — the timer is the optimisation, the check is the guarantee.</span></div>
  <div class="lz-layer"><span class="lz-lname">Swallow the timer's errors</span><span class="lz-lnote">A background refresh that fails must not throw into nothing and must not redirect the user mid-task. Log it, let the next real request try again, and let <em>that</em> failure drive the redirect.</span></div>
  <div class="lz-layer"><span class="lz-lname">Keep the 401 path anyway</span><span class="lz-lnote">Clocks are wrong, laptops sleep, and the server may revoke the session between two requests. Proactive refresh reduces 401s to a rare event; it never removes them.</span></div>
</div>

<h3>Fix 4 — the server's grace window</h3>
<pre><code><span class="tok-comment">// Sau khi xoay vòng, nhớ lại "token này đã đổi ra cái gì" trong 30 giây</span>
export async function rotateRefreshToken(cu: RefreshToken, req: Request) {
  const newToken = randomBytes(32).toString('base64url');
  await prisma.$transaction([ <span class="tok-comment">/* …như Bài 5.2… */</span> ]);

  await redis.set(&#96;ke-nhiem:\${cu.tokenHash}&#96;, newToken, { EX: 30 });
  return newToken;
}</code></pre>
<pre><code><span class="tok-comment">// Trong /auth/refresh, TRƯỚC khi kết luận là tái dùng</span>
if (cu.usedAt) {
  const successor = await redis.get(&#96;ke-nhiem:\${bam}&#96;);

  if (successor) {
    <span class="tok-comment">// Đây là một cuộc ĐUA, không phải một cú trộm: trả về ĐÚNG cái đã cấp.</span>
    setRefreshCookie(res, successor);
    const u = await prisma.user.findUniqueOrThrow({ where: { id: cu.userId } });
    return res.json({ accessToken: await signAccessToken(u), expiresIn: 900 });
  }

  <span class="tok-comment">// Quá 30 giây → đây là tái dùng THẬT. Bài 5.2 xử lý tiếp.</span>
  await revokeFamily(cu.hoId);
  <span class="tok-comment">// …</span>
}</code></pre>
<div class="out">09:44:20.130  RT1 → RT2, nho lai ke-nhiem:RT1 = RT2 (TTL 30s)
09:44:20.131  RT1 lai toi   → co ke nhiem → tra lai RT2. Khong bao dong.
09:44:52.400  RT1 lai toi   → ke nhiem da het han → TAI DUNG THAT → thu hoi ho.

# Cua so an han bien mot cu do trong 30 giay thanh vo hai,
# va van bat duoc mot ban sao dung lai sau do.</div>
<div class="callout warn">
<p><strong>The grace window is a real weakening, and it is worth it — but keep it short.</strong> For those thirty seconds, an attacker who has the token can also exchange it and receive the same successor, giving both parties a working session with no alarm. Thirty seconds is enough for every legitimate race in this lesson and far too short for an attacker to rely on. Five minutes would be comfortable for clients and would hand a thief a five-minute window on every rotation; do not tune this for convenience.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Why Redis and not the database</span><span class="v">The successor is stored in plaintext, briefly, so the racing client can be handed the same value — the row only holds a hash and cannot give it back. A short TTL means it self-deletes, and losing it on a restart is harmless: the effect is one false positive, not a broken session.</span></div>
  <div class="kv"><span class="k">Fix the client anyway</span><span class="v">The grace window is for what the client cannot control — a dropped response, a backgrounded app. If it is absorbing ten races per page load, the client is broken and you have hidden the bug rather than fixed it. Count the grace hits; they should be rare.</span></div>
  <div class="kv"><span class="k">A family lock is the alternative</span><span class="v">Take a short lock on <code>hoId</code> for the duration of the exchange, so concurrent refreshes serialise on the server. It avoids storing a plaintext token, and it needs a distributed lock plus a timeout story — more machinery for the same outcome.</span></div>
  <div class="kv"><span class="k">Measure both counters</span><span class="v">Grace-window hits and genuine reuse detections, as separate metrics. The first should be low and flat; the second should be near zero, and every occurrence is worth reading. Chapter 11 alerts on the second.</span></div>
</div>
<div class="note-ct">
<p><strong>Build order, and the sanity check.</strong> Ship the single in-flight promise and the proactive refresh first — together they remove most races and neither can break anything. Add the grace window next, with a counter. Only then enable reuse detection, and watch the two counters for a week: if grace hits are common, the client still has a bug; if genuine detections are non-zero and you have no known incident, you have found something. That order is also the order in which each piece is safe to deploy on its own.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">MDN — Web Locks API</span><span class="lc-sub">developer.mozilla.org · Cross-tab mutual exclusion, and the modes it supports</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel" target="_blank" rel="noopener"><span class="lc-ico">📻</span><span class="lc-body"><span class="lc-title">MDN — BroadcastChannel</span><span class="lc-sub">developer.mozilla.org · Sharing the new token between tabs without touching storage</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700#name-refresh-token-protection" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">RFC 9700 — refresh token protection</span><span class="lc-sub">datatracker.ietf.org · What the specification does and does not say about races</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">TTL, and building a lock that behaves correctly under failure</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Fire ten simultaneous requests at an expired token, then apply each of the four fixes</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Cuộc đua refresh, và cú cảnh báo giả giết chết cả tính năng</h2>
<p class="lead">Phát hiện tái dùng ở Bài 5.2 mặc định rằng một refresh token đã dùng mà lại xuất hiện lần nữa nghĩa là bị trộm. Trên thực tế nó thường chỉ nghĩa là client gửi hai lời gọi refresh cùng lúc. Làm sai chỗ này thì người dùng bị đá ra ngẫu nhiên, cả đội đổ lỗi cho phát hiện tái dùng, và cơ chế bảo mật tốt nhất của cả chương bị tắt đi — nên bài này không phải phần trang trí thêm cho đẹp.</p>

<h3>Cuộc đua</h3>
<pre><code><span class="tok-comment">// Một trang tải xong, gửi mười request. Access token vừa hết hạn.</span>
Promise.all([
  goi('/api/me'), goi('/api/thong-bao'), goi('/api/feed'),
  goi('/api/cart'), goi('/api/messages'), <span class="tok-comment">/* … */</span>
]);</code></pre>
<div class="out">09:44:20.104  GET /api/toi         → 401
09:44:20.106  GET /api/thong-bao   → 401
09:44:20.107  GET /api/feed        → 401          ← ca salt cai, cung mot luc
…
09:44:20.130  POST /auth/refresh   RT1 → RT2      ✅ cai dau tien thang
09:44:20.131  POST /auth/refresh   RT1 → TAI DUNG ❌
09:44:20.133  POST /auth/refresh   RT1 → TAI DUNG ❌
…
09:44:20.148  Ca HO bi thu hoi. Nguoi dung bi day ve trang dang nhap.

# Khong co ke tan cong nao. Chi la mot cai interceptor viet ngay tho.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Trong một tab</span><span class="lz-t">Các fetch chạy song song</span><span class="lz-d">Mười request, mười cái 401, mười cái interceptor mỗi cái tự quyết định đi refresh. Đây là nguyên nhân hay gặp nhất, và cũng là cái dễ vá nhất.</span></div>
  <div class="lz-step"><span class="lz-k">Giữa các tab</span><span class="lz-t">Chung cookie, riêng JavaScript</span><span class="lz-d">Ba tab cùng mở web của bạn, mỗi tab có phạm vi module riêng và lời hứa đang bay riêng. Chúng dùng chung cookie refresh và hoàn toàn không biết gì về nhau.</span></div>
  <div class="lz-step"><span class="lz-k">Trên di động</span><span class="lz-t">Cái phản hồi không bao giờ về tới</span><span class="lz-d">App gọi refresh, mạng rớt trước khi phản hồi về, app thử lại bằng cái token nó vẫn đang giữ. Máy chủ thì đã xoay vòng rồi. Cái này client thật sự không tự vá nổi — nó không có cách nào biết lần gọi đầu đã thành công hay chưa.</span></div>
  <div class="lz-step"><span class="lz-k">Lúc mở lại máy</span><span class="lz-t">Tất cả cùng một nhịp</span><span class="lz-d">Điện thoại quay lại từ chế độ nền và mọi request đang treo, mọi lần nối lại websocket, mọi vòng hỏi định kỳ đều bắn trong cùng một tick, với một access token đã hết hạn từ một tiếng trước.</span></div>
</div>

<h3>Vá 1 — mỗi tab chỉ một lời gọi refresh đang bay</h3>
<pre><code>let refreshing: Promise&lt;string&gt; | null = null;

async function getNewAccessToken(): Promise&lt;string&gt; {
  if (refreshing) return refreshing;              <span class="tok-comment">// ← mọi người cùng chờ MỘT cái</span>

  refreshing = (async () =&gt; {
    const r = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' });
    if (!r.ok) { redirectToSignIn(); throw new Error('refresh that bai'); }
    return (await r.json()).accessToken;
  })().finally(() =&gt; { refreshing = null; });

  return refreshing;
}</code></pre>
<div class="out">09:44:20.130  POST /auth/refresh   RT1 → RT2      ✅  (mot lan duy nhat)
09:44:20.152  Ca salt request thu lai voi access token moi. Xong.</div>
<div class="pitfall">
<p><strong>Bẫy — đừng bao giờ thử lại một lời gọi refresh đã hỏng, và đừng bao giờ đi refresh vì một lời gọi refresh hỏng.</strong> Nếu <code>/auth/refresh</code> trả 401 thì phiên đã hết: chuyển thẳng tới trang đăng nhập. Một cái interceptor đối xử với lời gọi refresh y như mọi request khác sẽ thấy cái 401 đó, đi refresh, nhận thêm một cái 401 nữa, và lặp cho tới khi tab của trình duyệt đứng hình. Hãy loại trừ endpoint refresh khỏi interceptor một cách tường minh.</p>
</div>

<h3>Vá 2 — bắt các tab nói chuyện với nhau</h3>
<pre><code><span class="tok-comment">// Web Locks: một cái khoá dùng chung cho mọi tab CÙNG origin</span>
async function getNewAccessToken(): Promise&lt;string&gt; {
  return navigator.locks.request('lam-moi-token', async () =&gt; {
    <span class="tok-comment">// Tab khác có thể vừa làm mới xong trong lúc ta đợi khoá.</span>
    if (stillValid(accessToken)) return accessToken!;

    const r = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' });
    if (!r.ok) { redirectToSignIn(); throw new Error('refresh that bai'); }

    accessToken = (await r.json()).accessToken;
    return accessToken;
  });
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Dòng kiểm lại BÊN TRONG khoá mới là điểm mấu chốt</span><span class="v">Ai đã đứng đợi khoá thì khi vào được phải hỏi lại xem có còn cần refresh nữa không. Thiếu đúng cái dòng đó thì ba tab xếp hàng ở khoá rồi lần lượt mỗi tab tự đi refresh một lần — vẫn là cuộc đua cũ, chỉ khác là nó xếp thành hàng dọc.</span></div>
  <div class="kv"><span class="k">Token mới đi về đâu</span><span class="v">Mỗi tab giữ biến <code>accessToken</code> của riêng nó, nên tab nào không phải người đi refresh thì vẫn đang cầm cái cũ. Hoặc lấy token ra từ giá trị trả về của khoá như ở trên, hoặc phát đi bằng <code>BroadcastChannel</code> — tuyệt đối không dùng <code>localStorage</code>, đó chính là vấn đề của Bài 4.5.</span></div>
  <div class="kv"><span class="k">Hỗ trợ đã tốt, và đường lùi thì dễ</span><span class="v"><code>navigator.locks</code> có mặt trong mọi trình duyệt hiện hành. Chỗ nào thiếu thì lùi về vá 1 và để cửa sổ ân hạn phía máy chủ hứng phần giữa các tab.</span></div>
  <div class="kv"><span class="k">App gốc cũng dính y hệt</span><span class="v">Một mutex bọc quanh lời gọi refresh, cộng thêm đúng cái kiểm lại bên trong nó. Hình dạng giống hệt; chỉ đổi cái nguyên thuỷ dùng để khoá.</span></div>
</div>

<h3>Vá 3 — làm mới TRƯỚC cái 401, không phải sau</h3>
<pre><code><span class="tok-comment">// Access token 15 phút → làm mới ở phút thứ 12. Không bao giờ thấy 401.</span>
let expiresAt = 0;

function schedule(expiresIn: number) {
  expiresAt = Date.now() + expiresIn * 1000;
  setTimeout(() =&gt; { getNewAccessToken().catch(() =&gt; {}); }, expiresIn * 0.8 * 1000);
}

async function call(url: string, opt: RequestInit = {}) {
  if (Date.now() &gt; expiresAt - 30_000) await getNewAccessToken();   <span class="tok-comment">// hàng rào 30 giây</span>
  <span class="tok-comment">// …gửi request; 401 giờ là ngoại lệ, không phải chuyện thường ngày</span>
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cơn bão biến mất</span><span class="lz-lnote">Mười request đồng thời với một token còn hạn chỉ là mười request bình thường. Lần refresh đã xảy ra ba phút trước, một mình, không có ai đua với nó. Đây là dẹp nguyên nhân chứ không phải chữa triệu chứng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hẹn giờ KHÔNG chạy trong tab nền</span><span class="lz-lnote">Trình duyệt bóp hoặc treo hẳn <code>setTimeout</code> ở tab không hoạt động, còn điện thoại đang ngủ thì chẳng chạy gì cả. Vì thế cái kiểm trước mỗi lời gọi vẫn cần — hẹn giờ là phần tối ưu, cái kiểm mới là phần bảo đảm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nuốt lỗi của cái hẹn giờ</span><span class="lz-lnote">Một lần làm mới chạy nền mà hỏng thì không được ném lỗi vào hư không, và cũng không được đá người dùng ra giữa lúc họ đang làm dở. Ghi log lại, để request thật kế tiếp thử lại, và để <em>cái</em> thất bại đó quyết định việc chuyển trang.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vẫn phải giữ nhánh xử lý 401</span><span class="lz-lnote">Đồng hồ máy có thể sai, laptop có thể ngủ, và máy chủ có thể thu hồi phiên ngay giữa hai request. Làm mới chủ động kéo 401 xuống thành chuyện hiếm; nó không bao giờ xoá hẳn được.</span></div>
</div>

<h3>Vá 4 — cửa sổ ân hạn phía máy chủ</h3>
<pre><code><span class="tok-comment">// Sau khi xoay vòng, nhớ lại "token này đã đổi ra cái gì" trong 30 giây</span>
export async function rotateRefreshToken(cu: RefreshToken, req: Request) {
  const newToken = randomBytes(32).toString('base64url');
  await prisma.$transaction([ <span class="tok-comment">/* …như Bài 5.2… */</span> ]);

  await redis.set(&#96;ke-nhiem:\${cu.tokenHash}&#96;, newToken, { EX: 30 });
  return newToken;
}</code></pre>
<pre><code><span class="tok-comment">// Trong /auth/refresh, TRƯỚC khi kết luận là tái dùng</span>
if (cu.usedAt) {
  const successor = await redis.get(&#96;ke-nhiem:\${bam}&#96;);

  if (successor) {
    <span class="tok-comment">// Đây là một cuộc ĐUA, không phải một cú trộm: trả về ĐÚNG cái đã cấp.</span>
    setRefreshCookie(res, successor);
    const u = await prisma.user.findUniqueOrThrow({ where: { id: cu.userId } });
    return res.json({ accessToken: await signAccessToken(u), expiresIn: 900 });
  }

  <span class="tok-comment">// Quá 30 giây → đây là tái dùng THẬT. Bài 5.2 xử lý tiếp.</span>
  await revokeFamily(cu.hoId);
  <span class="tok-comment">// …</span>
}</code></pre>
<div class="out">09:44:20.130  RT1 → RT2, nho lai ke-nhiem:RT1 = RT2 (TTL 30s)
09:44:20.131  RT1 lai toi   → co ke nhiem → tra lai RT2. Khong bao dong.
09:44:52.400  RT1 lai toi   → ke nhiem da het han → TAI DUNG THAT → thu hoi ho.

# Cua so an han bien mot cu do trong 30 giay thanh vo hai,
# va van bat duoc mot ban sao dung lai sau do.</div>
<div class="callout warn">
<p><strong>Cửa sổ ân hạn là một sự nới lỏng thật, nó đáng giá — nhưng phải giữ cho ngắn.</strong> Trong ba mươi giây đó, một kẻ đang cầm token cũng có thể đem đi đổi và nhận về đúng cái kế nhiệm ấy, tức là cả hai bên cùng có phiên chạy được mà không có tiếng chuông nào kêu. Ba mươi giây là đủ cho mọi cuộc đua chính đáng trong bài này và quá ngắn để kẻ tấn công trông cậy vào. Năm phút thì client sẽ rất dễ thở và đồng thời tặng cho kẻ trộm một cửa sổ năm phút ở mỗi lần xoay vòng; đừng chỉnh con số này theo hướng cho tiện.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao là Redis chứ không phải cơ sở dữ liệu</span><span class="v">Cái kế nhiệm được lưu dạng chữ thật, trong thời gian rất ngắn, để có thể trao lại đúng giá trị đó cho client đang đua — bản ghi trong bảng chỉ giữ băm nên không trả lại được. TTL ngắn nghĩa là nó tự xoá, và mất nó khi khởi động lại cũng vô hại: hậu quả là một cú cảnh báo giả, không phải một phiên bị hỏng.</span></div>
  <div class="kv"><span class="k">Vẫn phải vá client</span><span class="v">Cửa sổ ân hạn dành cho những thứ client không nắm được — một phản hồi bị rớt, một app bị đẩy xuống nền. Nếu nó đang hứng mười cuộc đua cho mỗi lần tải trang thì client đang hỏng và bạn vừa giấu con lỗi đi chứ không phải sửa nó. Hãy đếm số lần rơi vào ân hạn; con số đó phải hiếm.</span></div>
  <div class="kv"><span class="k">Khoá theo họ là phương án thay thế</span><span class="v">Giữ một cái khoá ngắn trên <code>hoId</code> suốt lúc trao đổi, để các lời gọi refresh đồng thời xếp hàng ngay tại máy chủ. Cách này không phải lưu token dạng chữ thật, đổi lại nó cần một khoá phân tán cộng với câu chuyện hết giờ — nhiều máy móc hơn cho cùng một kết quả.</span></div>
  <div class="kv"><span class="k">Đo cả HAI bộ đếm</span><span class="v">Số lần rơi vào cửa sổ ân hạn và số lần phát hiện tái dùng thật, để riêng thành hai chỉ số. Cái đầu phải thấp và phẳng; cái sau phải gần bằng không, và mỗi lần nó nhích lên đều đáng đọc kỹ. Chương 11 dựng cảnh báo trên cái thứ hai.</span></div>
</div>
<div class="note-ct">
<p><strong>Thứ tự làm, và phép thử tỉnh táo.</strong> Đưa lên trước cái lời hứa dùng chung và cái làm mới chủ động — hai thứ đó dẹp phần lớn cuộc đua và không cái nào có thể làm hỏng gì. Kế đến thêm cửa sổ ân hạn, kèm một bộ đếm. Chỉ sau đó mới bật phát hiện tái dùng, rồi ngồi nhìn hai bộ đếm trong một tuần: nếu số lần rơi vào ân hạn nhiều thì client vẫn còn lỗi; nếu số phát hiện thật khác không mà bạn không biết sự cố nào cả thì bạn vừa tìm ra một chuyện. Thứ tự đó cũng chính là thứ tự mà từng mảnh một có thể đưa lên production riêng lẻ một cách an toàn.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">MDN — Web Locks API</span><span class="lc-sub">developer.mozilla.org · Loại trừ lẫn nhau giữa các tab, và các chế độ nó hỗ trợ</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel" target="_blank" rel="noopener"><span class="lc-ico">📻</span><span class="lc-body"><span class="lc-title">MDN — BroadcastChannel</span><span class="lc-sub">developer.mozilla.org · Chia token mới giữa các tab mà không đụng tới storage</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700#name-refresh-token-protection" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">RFC 9700 — bảo vệ refresh token</span><span class="lc-sub">datatracker.ietf.org · Đặc tả nói gì và KHÔNG nói gì về các cuộc đua</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">TTL, và dựng một cái khoá cư xử đúng khi có sự cố</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Bắn mười request đồng thời vào một token đã hết hạn, rồi áp lần lượt từng vá một trong bốn cái</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 5.6 ─────────────────────────── */
    {
      title: 'Quiz: refresh, rotation and revocation|||Quiz: refresh, xoay vòng và thu hồi',
      slug: 'auth-5-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về hai tuổi thọ, xoay vòng dùng một lần, phát hiện tái dùng và thu hồi cả họ, năm sự kiện kết thúc phiên, danh sách thiết bị, và cuộc đua refresh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.6</span>
<h2>Quiz: refresh, rotation and revocation</h2>
<p class="lead">Eight questions. Two of them describe systems that are secure on paper and log real users out at random — because in this chapter the correctness of a mechanism and the survival of the feature are two different tests.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Two tokens exist because fast verification wants statelessness and instant revocation wants state; the split gives you both, and the refresh token is scoped to exactly one endpoint (5.1). Every refresh issues a new token and marks the old one used, so a used token presented again means somebody holds a copy — and since you cannot tell which party is the thief, you revoke the whole family (5.2). Five events must end a session, and two of them cannot wait out the access-token window, so they need a small denylist (5.3). The same table already holds everything a device list needs, and the new-device email finds takeovers your monitoring never will (5.4). Ten simultaneous requests produce ten refreshes and nine false reuse alarms, so fix the client with one in-flight promise plus proactive refresh, and give the server a thirty-second grace window for what the client cannot control (5.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.6</span>
<h2>Quiz: refresh, xoay vòng và thu hồi</h2>
<p class="lead">Tám câu. Hai câu mô tả những hệ thống AN TOÀN TRÊN GIẤY và đá người dùng thật ra ngoài một cách ngẫu nhiên — vì trong chương này, một cơ chế ĐÚNG và một tính năng SỐNG SÓT là hai phép thử khác nhau.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Hai token tồn tại vì xác minh nhanh muốn phi trạng thái còn thu hồi tức thì lại muốn có trạng thái; cách tách cho bạn cả hai, và refresh token bị giới hạn xuống ĐÚNG MỘT endpoint (5.1). Mỗi lần refresh cấp một token mới và đánh dấu cái cũ đã dùng, nên một token đã dùng mà xuất hiện lần nữa nghĩa là có kẻ đang giữ bản sao — và vì bạn không biết bên nào là kẻ cắp, bạn thu hồi CẢ HỌ (5.2). Năm sự kiện bắt buộc phải kết thúc phiên, và hai trong số đó không chờ được hết cửa sổ access token nên cần một danh sách chặn NHỎ (5.3). Cùng cái bảng đó đã chứa đủ mọi thứ cho một danh sách thiết bị, và cái email báo thiết bị mới tìm ra những cú chiếm tài khoản mà giám sát của bạn sẽ không bao giờ thấy (5.4). Mười request đồng thời sinh ra mười lời gọi refresh và chín cú báo động giả, nên hãy vá client bằng một lời hứa dùng chung cộng làm mới chủ động, và cho máy chủ một cửa sổ ân hạn ba mươi giây để hứng thứ mà client không nắm được (5.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why does the two-token design exist at all?|||Vì sao thiết kế hai token lại tồn tại?',
            options: [
              'Because one token would be too long to fit in a cookie|||Vì một token thôi thì quá dài, không nhét vừa cookie',
              'Because fast verification wants no lookup while instant revocation requires one — a short access token verified statelessly plus a long refresh token checked against a row buys both, with the exposure bounded by the access-token lifetime|||Vì xác minh nhanh thì không muốn tra cứu còn thu hồi tức thì thì bắt buộc phải tra — một access token ngắn xác minh phi trạng thái cộng một refresh token dài đối chiếu với một bản ghi mua được cả hai, và phần phơi ra bị chặn bởi đúng tuổi thọ của access token',
              'Because the OAuth specification requires two tokens|||Vì đặc tả OAuth bắt buộc phải có hai token',
              'Because it lets you use two different signing algorithms|||Vì nó cho phép dùng hai thuật toán ký khác nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your refresh token is sent as a cookie with path=/ to every request. What did that cost you?|||Refresh token của bạn được gửi kèm dưới dạng cookie với path=/ trong mọi request. Điều đó khiến bạn mất gì?',
            options: [
              'Nothing; the cookie is HttpOnly so it is safe|||Không mất gì; cookie là HttpOnly nên vẫn an toàn',
              'The long-lived credential now travels on every endpoint, so any logging, proxy, crash reporter or path-traversal bug anywhere in the app can expose it — scope it to the refresh endpoint so it is sent on one route only|||Cái tín vật dài hạn giờ đi theo MỌI endpoint, nên bất kỳ chỗ ghi log, proxy, bộ báo cáo sự cố hay lỗi duyệt đường dẫn nào trong app cũng có thể làm lộ nó — hãy giới hạn nó xuống endpoint refresh để nó chỉ được gửi trên một tuyến duy nhất',
              'Only performance: the cookie adds bytes to every request|||Chỉ mất hiệu năng: cookie làm mỗi request nặng thêm vài byte',
              'The browser will refuse to store it|||Trình duyệt sẽ từ chối lưu nó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A used refresh token is presented a second time, thirty minutes after it was rotated. What is the correct response?|||Một refresh token đã dùng được trình ra lần thứ hai, ba mươi phút sau khi nó được xoay vòng. Phản ứng đúng là gì?',
            options: [
              'Return 401 and revoke only that one token|||Trả 401 và chỉ thu hồi đúng cái token đó',
              'Revoke the entire token family, because a used token reappearing means two parties hold it and you cannot tell which one is the thief — the legitimate user re-authenticates, the attacker is locked out|||Thu hồi CẢ HỌ token, vì một token đã dùng mà xuất hiện lại nghĩa là hai bên cùng đang giữ nó và bạn không phân biệt được bên nào là kẻ cắp — người dùng thật chỉ phải đăng nhập lại, kẻ tấn công thì bị chặn hẳn',
              'Issue a new token anyway; rotation already made the old one harmless|||Cứ cấp token mới; xoay vòng đã làm cái cũ vô hại rồi',
              'Log the event and let the token continue working|||Ghi log sự kiện rồi để cái token đó chạy tiếp',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You revoke a session in the database. When does the user actually lose access?|||Bạn thu hồi một phiên trong cơ sở dữ liệu. Người dùng thật sự mất quyền truy cập vào lúc nào?',
            options: [
              'Immediately, on the next request|||Ngay lập tức, ở request kế tiếp',
              'Not until the current access token expires, because nothing checks the database while it is still valid — that gap is the access-token lifetime, and it is the number you chose in 5.1|||Chưa mất cho tới khi access token hiện tại hết hạn, vì trong lúc nó còn hợp lệ thì không có gì tra cứu cơ sở dữ liệu cả — khoảng trống đó CHÍNH LÀ tuổi thọ access token, con số bạn đã chọn ở Bài 5.1',
              'After the refresh token expires|||Sau khi refresh token hết hạn',
              'Only after they close the browser|||Chỉ sau khi họ đóng trình duyệt',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which two events cannot wait out the access-token window, and what do they need?|||Hai sự kiện nào KHÔNG chờ được hết cửa sổ access token, và chúng cần gì?',
            options: [
              'Logout and password change; they need a longer refresh token|||Đăng xuất và đổi mật khẩu; chúng cần một refresh token dài hơn',
              'Account suspension and privilege downgrade; both mean the token in hand grants access it must no longer have, so they need a small denylist checked on every request|||Khoá tài khoản và hạ quyền; cả hai đều nghĩa là cái token đang cầm đang cấp quyền mà nó không được phép có nữa, nên chúng cần một danh sách chặn NHỎ, kiểm ở mọi request',
              'Logout and log out everywhere; they need an immediate database write|||Đăng xuất và thoát mọi thiết bị; chúng cần một lệnh ghi cơ sở dữ liệu tức thì',
              'Neither; a fifteen-minute window is always acceptable|||Không sự kiện nào cả; cửa sổ mười lăm phút lúc nào cũng chấp nhận được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A password change revokes every session. What must survive it, and why?|||Đổi mật khẩu thu hồi mọi phiên. Cái gì phải sống sót qua đó, và vì sao?',
            options: [
              'Nothing; logging the user out everywhere is the whole point|||Không cái gì cả; đá người dùng ra khỏi mọi nơi chính là mục đích',
              'The session that performed the change, because logging the user out of the device they are currently using turns a security action into an obstacle and trains them to avoid it|||Chính cái phiên vừa thực hiện việc đổi, vì đá người dùng ra khỏi đúng cái thiết bị họ đang dùng sẽ biến một hành động bảo mật thành chướng ngại và dạy họ né nó',
              'The oldest session, so history is preserved|||Cái phiên cũ nhất, để giữ lại lịch sử',
              'All mobile sessions, because retyping on a phone is hard|||Mọi phiên di động, vì gõ lại trên điện thoại thì khó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Ten requests hit an expired access token at the same moment and your client refreshes on each 401. What happens, and what is the first fix?|||Mười request cùng gặp một access token đã hết hạn trong một khoảnh khắc và client của bạn đi refresh ở mỗi cái 401. Chuyện gì xảy ra, và cách vá đầu tiên là gì?',
            options: [
              'Nothing; the server handles concurrent refreshes|||Không sao cả; máy chủ tự xử lý các lời gọi refresh đồng thời',
              'One refresh wins and nine look exactly like token reuse, so the family is revoked and the user is logged out — hold a single in-flight refresh promise per tab and let every caller await it|||Một lời gọi thắng và chín cái còn lại trông y hệt việc tái dùng token, nên cả họ bị thu hồi và người dùng bị đá ra — hãy giữ MỘT lời hứa refresh đang bay cho mỗi tab và để mọi người gọi cùng chờ nó',
              'The tenth request wins and the other nine retry silently|||Request thứ mười thắng và chín cái kia lặng lẽ thử lại',
              'Reuse detection should be disabled to avoid this|||Nên tắt phát hiện tái dùng để tránh chuyện này',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is the server-side grace window kept to about thirty seconds rather than five minutes?|||Vì sao cửa sổ ân hạn phía máy chủ được giữ ở khoảng ba mươi giây thay vì năm phút?',
            options: [
              'Because Redis cannot store keys for longer|||Vì Redis không lưu khoá lâu hơn được',
              'Because during the window an attacker holding the token also receives the same successor with no alarm — thirty seconds covers every legitimate race and is far too short to rely on|||Vì trong cửa sổ đó, một kẻ đang cầm token cũng nhận được đúng cái kế nhiệm ấy mà không có chuông nào kêu — ba mươi giây phủ được mọi cuộc đua chính đáng và quá ngắn để kẻ tấn công trông cậy vào',
              'Because longer windows slow down the refresh endpoint|||Vì cửa sổ dài hơn sẽ làm chậm endpoint refresh',
              'Because the specification mandates thirty seconds|||Vì đặc tả quy định phải là ba mươi giây',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
