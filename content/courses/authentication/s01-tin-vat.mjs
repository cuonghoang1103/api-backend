/**
 * Authentication — Chương 1: Tín vật và các nguyên hàm.
 * Tín vật kiểu mang theo và mô hình mối đe doạ · ngẫu nhiên và entropy · so sánh thời gian hằng ·
 * băm/MAC/chữ ký · bí mật sống ở đâu · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 1 — Credentials, and the primitives underneath|||Chương 1 — Tín vật, và những nguyên hàm bên dưới',
  description: 'Trước khi bàn mật khẩu hay token, phải rõ một tín vật là gì và giả định nào đi kèm nó: ai cầm thì người đó LÀ bạn. Từ đó suy ra mô hình mối đe doạ, số bit ngẫu nhiên cần thiết, vì sao so sánh hai chuỗi bí mật bằng === là một lỗ hổng, khác biệt giữa băm với MAC với chữ ký, và mọi chỗ một bí mật rò ra mà không ai cố ý.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — Whoever holds it, is you|||1.1 — Ai cầm nó, người đó LÀ bạn',
      slug: 'auth-1-1-tin-vat-mang-theo',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Gần như mọi tín vật trên web là tín vật kiểu mang theo: sở hữu tức là có quyền, không có phép kiểm thứ hai. Bài này rút ra bốn hệ quả của điều đó, vẽ chặng đường của một tín vật với chỗ hỏng ở từng chặng, và giải thích những tín vật RÀNG BUỘC-NGƯỜI-GỬI như DPoP và mTLS đổi lại được gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Whoever holds it, is you</h2>
<p class="lead">A session cookie, a JWT, an API key and a password reset link have one property in common that decides almost everything else about how you must treat them: presenting the value <em>is</em> the proof. There is no second check, no signature from your device, no question the thief cannot answer. Understanding that sentence properly is what makes the rest of this course follow rather than feel arbitrary.</p>

<h3>What "bearer" means, precisely</h3>
<pre><code><span class="tok-comment"># The same request, from two different machines, in two different countries</span>
curl -s https://api.vidu.com/toi -H "Authorization: Bearer eyJhbGciOi…"
curl -s https://api.vidu.com/toi -H "Authorization: Bearer eyJhbGciOi…"</code></pre>
<div class="out">{"id":"clx7…","email":"an@vidu.com","role":"USER"}
{"id":"clx7…","email":"an@vidu.com","role":"USER"}

# May chu KHONG phan biet duoc hai request nay.
# Khong co gi trong giao thuc noi cai nao la An va cai nao la ke cap.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Possession = authority</span><span class="lz-t">The definition</span><span class="lz-d">RFC 6750 names it directly: "any party in possession of a bearer token can use it to get access to the associated resources, without demonstrating possession of a cryptographic key". No device binding, no second factor, no origin check.</span></div>
  <div class="lz-step"><span class="lz-k">Nothing detects a copy</span><span class="lz-t">The consequence</span><span class="lz-d">Copying a token leaves no trace and changes nothing about it. The original owner keeps working normally, which is why account takeover often goes unnoticed for weeks.</span></div>
  <div class="lz-step"><span class="lz-k">Almost everything is bearer</span><span class="lz-t">The scope of the problem</span><span class="lz-d">Session cookies, JWTs, API keys, reset links, magic links, OAuth access tokens, webhook secrets, database URLs. Passkeys are the notable exception, which is most of why Chapter 7 is enthusiastic about them.</span></div>
  <div class="lz-step"><span class="lz-k">So design for leakage</span><span class="lz-t">The posture</span><span class="lz-d">Not "how do I make this unstealable" — you cannot — but "when a copy of this exists, how much can it do, for how long, and how would I find out". Those three questions are Chapters 4, 5 and 11.</span></div>
</div>

<h3>Four consequences you cannot argue with</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · TLS is not optional, anywhere</span><span class="v">A bearer credential over plain HTTP is readable by every network hop. Not "less secure" — <em>equivalent to publishing it</em>. This includes internal traffic, staging, and the localhost setup you later copy into production.</span></div>
  <div class="kv"><span class="k">2 · Lifetime is your main lever</span><span class="v">You cannot prevent theft, but you decide how long a stolen copy works. Fifteen minutes versus thirty days is the difference between an incident and a breach, and it costs nothing to choose — Chapter 5.</span></div>
  <div class="kv"><span class="k">3 · Scope limits the blast radius</span><span class="v">A token that can only read one user's posts is worth far less than one that can do anything. "Least privilege" is not a slogan here; it is the only thing that survives after the credential leaves your control.</span></div>
  <div class="kv"><span class="k">4 · Revocation must exist before you need it</span><span class="v">The day you learn a token leaked is a bad day to discover you have no way to invalidate it. Build the off switch while nothing is on fire.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a credential in a URL leaks through five channels you do not control.</strong> <code>https://vidu.com/reset?token=abc123</code> ends up in browser history, in the <code>Referer</code> header sent to every third-party script on the page, in server access logs, in proxy and CDN logs, and in the chat app that generated a link preview by fetching it. Password reset links are the common case, and Chapter 6 shows the mitigations: single use, short expiry, and consuming the token into a POST as soon as the page loads.</p>
</div>

<h3>The journey, and what breaks at each hop</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Created</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">On the server</span><span class="lz-nsub">Weak randomness → guessable. Lesson 1.2.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">In transit</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Server → browser</span><span class="lz-nsub">No TLS → read on the wire. In a URL → logged everywhere.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">At rest, client</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cookie or localStorage</span><span class="lz-nsub">Readable by script → one XSS takes it. Chapters 3 and 4.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Sent back</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Automatically, by the browser</span><span class="lz-nsub">Attached to requests another site caused → CSRF. Chapter 3.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Verified</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">On the server again</span><span class="lz-nsub">Naive comparison → timing leak. Lesson 1.3.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">At rest, server</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Database, logs, backups</span><span class="lz-nsub">Stored raw → one dump is every session. Lesson 1.5.</span></div></div>
  </div>
</div>
<div class="callout ok">
<p><strong>Every chapter of this course is one hop on that diagram.</strong> That is the honest structure of the subject: authentication is not one hard problem, it is six easy problems where getting any single one wrong undoes the other five. The reason it feels difficult is that the failures are silent — a weak session id and a strong one look identical in the response.</p>
</div>

<h3>Who the attacker actually is</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Another user of your product</span><span class="lz-lnote">The most common one by far, and the least dramatic. They change an id in a URL and see someone else's data. No tools, no skill, sometimes not even intent — and it is still a data breach.</span></div>
  <div class="lz-layer"><span class="lz-lname">A script running on your own page</span><span class="lz-lnote">Your XSS, or an npm dependency, or an analytics tag, or a browser extension. It runs with your origin's full authority and can read anything JavaScript can read. This is the threat that decides the cookie-versus-localStorage argument.</span></div>
  <div class="lz-layer"><span class="lz-lname">Someone with a list from another site's breach</span><span class="lz-lnote">They are not attacking you specifically; they are trying ten million email/password pairs against a hundred sites. Credential stuffing is the highest-volume attack on the internet, and it succeeds purely on password reuse — Chapter 2 and Chapter 10.</span></div>
  <div class="lz-layer"><span class="lz-lname">A phishing page that looks like yours</span><span class="lz-lnote">The user types their password and their TOTP code into the attacker's form, and the attacker relays both to you in real time. TOTP does not stop this. Passkeys do, structurally — Chapter 7.</span></div>
  <div class="lz-layer"><span class="lz-lname">Whoever ends up with a copy of your database</span><span class="lz-lnote">A leaked backup, a misconfigured storage bucket, an ex-employee, a compromised laptop. This attacker reads at leisure and is the entire reason password hashing has to be <em>slow</em>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Not usually: someone breaking your cryptography</span><span class="lz-lnote">Nobody is factoring your RSA key. They are finding a token in a log file, a session id in a URL, an admin account with the password <code>admin123</code>, or an endpoint that forgot gate 3. Spend your attention accordingly.</span></div>
</div>

<h3>The alternative: sender-constrained credentials</h3>
<pre><code><span class="tok-comment">// DPoP (RFC 9449): the client proves it holds a private key, per request</span>
POST /api/don-hang HTTP/1.1
Authorization: DPoP eyJhbGciOi…            <span class="tok-comment">// the access token</span>
DPoP: eyJ0eXAiOiJkcG9wK2p3dCIsImFsZyI6…    <span class="tok-comment">// a fresh proof, signed now</span>

<span class="tok-comment">// The proof covers the method, the URL and a timestamp, and is signed by a</span>
<span class="tok-comment">// key the browser keeps non-extractable. Stealing the token is not enough.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">DPoP</span><span class="v">A per-request signature bound to a key the client holds. A stolen access token alone is useless without the private key — which, with the Web Crypto API, can be generated as non-extractable and therefore unreadable even by script.</span></div>
  <div class="kv"><span class="k">mTLS</span><span class="v">The client presents a certificate during the TLS handshake, and the token is bound to it. Excellent for service-to-service; heavy for browsers, because certificate distribution to end users is a product in itself.</span></div>
  <div class="kv"><span class="k">Passkeys</span><span class="v">The strongest version and the only one with mainstream browser support: the private key never leaves the authenticator, and the signature covers the origin — so a phishing site cannot obtain a usable assertion at all. Chapter 7.</span></div>
  <div class="kv"><span class="k">Why bearer still dominates</span><span class="v">It works everywhere, with every client, with a single header. Sender-constrained credentials need key management on both ends. Know they exist, use passkeys where you can, and design the bearer path assuming it will leak.</span></div>
</div>
<div class="note-ct">
<p><strong>A worked example of "design for leakage" on this codebase.</strong> CuongThai's <code>backend_token</code> cookie lives for seven days while the JWT inside it expires in twenty-four hours. That mismatch once meant sessions died silently after a day with no way to recover, because <code>/auth/refresh</code> did not exist — the fix was a refresh endpoint plus a 401 interceptor that retries once. The design lesson is the one from this page: a short-lived credential is only safe to use if the renewal path exists first, otherwise the pressure to lengthen the lifetime wins every argument.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6750" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6750 — Bearer Token Usage</span><span class="lc-sub">datatracker.ietf.org · §1 defines "bearer" in one paragraph; §5 lists the threats</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9449" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">RFC 9449 — DPoP</span><span class="lc-sub">datatracker.ietf.org · Sender-constrained tokens for browsers, and what they cost</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">OWASP — Threat Modeling Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Turning "who is the attacker" into a repeatable exercise</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referer" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">MDN — the Referer header</span><span class="lc-sub">developer.mozilla.org · Where a credential in a URL actually ends up</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Steal a session cookie from one browser and use it in another — then measure what would have stopped you</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Ai cầm nó, người đó LÀ bạn</h2>
<p class="lead">Một cookie phiên, một JWT, một API key và một liên kết đặt lại mật khẩu có chung MỘT tính chất quyết định gần như mọi thứ khác trong cách bạn phải đối xử với chúng: trình cái giá trị đó ra <em>CHÍNH LÀ</em> bằng chứng. Không có phép kiểm thứ hai, không có chữ ký từ thiết bị của bạn, không có câu hỏi nào mà kẻ cắp không trả lời được. Hiểu câu đó cho đúng là thứ làm cho phần còn lại của khoá này TỰ SUY RA thay vì có vẻ tuỳ tiện.</p>

<h3>"Mang theo" nghĩa là gì, nói cho chính xác</h3>
<pre><code><span class="tok-comment"># Cũng một request đó, từ hai máy khác nhau, ở hai nước khác nhau</span>
curl -s https://api.vidu.com/toi -H "Authorization: Bearer eyJhbGciOi…"
curl -s https://api.vidu.com/toi -H "Authorization: Bearer eyJhbGciOi…"</code></pre>
<div class="out">{"id":"clx7…","email":"an@vidu.com","role":"USER"}
{"id":"clx7…","email":"an@vidu.com","role":"USER"}

# May chu KHONG phan biet duoc hai request nay.
# Khong co gi trong giao thuc noi cai nao la An va cai nao la ke cap.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Sở hữu = có quyền</span><span class="lz-t">Định nghĩa</span><span class="lz-d">RFC 6750 gọi tên thẳng: "bất kỳ bên nào đang sở hữu một bearer token đều có thể dùng nó để truy cập tài nguyên tương ứng, mà KHÔNG cần chứng minh mình nắm một khoá mật mã nào". Không ràng buộc thiết bị, không yếu tố thứ hai, không kiểm origin.</span></div>
  <div class="lz-step"><span class="lz-k">Không gì phát hiện được một bản sao</span><span class="lz-t">Hệ quả</span><span class="lz-d">Sao chép một token không để lại dấu vết và không làm nó thay đổi gì. Chủ nhân thật vẫn dùng bình thường, và đó là lý do việc chiếm tài khoản thường không ai nhận ra suốt hàng tuần.</span></div>
  <div class="lz-step"><span class="lz-k">Gần như MỌI thứ đều là kiểu mang theo</span><span class="lz-t">Quy mô của bài toán</span><span class="lz-d">Cookie phiên, JWT, API key, liên kết đặt lại, magic link, access token của OAuth, secret của webhook, chuỗi kết nối cơ sở dữ liệu. Passkey là ngoại lệ đáng kể, và đó là phần lớn lý do Chương 7 nhiệt tình với chúng.</span></div>
  <div class="lz-step"><span class="lz-k">Nên hãy THIẾT KẾ CHO việc rò rỉ</span><span class="lz-t">Tư thế đúng</span><span class="lz-d">Không phải "làm sao để cái này không ăn cắp được" — bạn không làm được — mà là "khi đã có một bản sao của nó, nó làm được bao nhiêu, trong bao lâu, và làm sao tôi biết". Ba câu hỏi đó là Chương 4, 5 và 11.</span></div>
</div>

<h3>Bốn hệ quả không cãi được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · TLS KHÔNG tuỳ chọn, ở bất cứ đâu</span><span class="v">Một tín vật mang theo đi qua HTTP thường thì mọi chặng mạng đều đọc được. Không phải "kém an toàn hơn" — mà <em>TƯƠNG ĐƯƠNG với việc công bố nó</em>. Điều này áp cho cả lưu lượng nội bộ, môi trường staging, và cái cấu hình localhost mà sau đó bạn copy vào production.</span></div>
  <div class="kv"><span class="k">2 · Tuổi thọ là cần gạt chính của bạn</span><span class="v">Bạn không ngăn được việc bị ăn cắp, nhưng bạn quyết định một bản sao bị cắp còn dùng được BAO LÂU. Mười lăm phút đối lại ba mươi ngày là khác biệt giữa một sự việc và một thảm hoạ, và chọn thì không tốn gì — Chương 5.</span></div>
  <div class="kv"><span class="k">3 · Scope giới hạn bán kính vụ nổ</span><span class="v">Một token chỉ đọc được bài của MỘT người dùng thì đáng giá kém xa một token làm được mọi thứ. "Đặc quyền tối thiểu" ở đây không phải khẩu hiệu; nó là thứ DUY NHẤT còn sống sót sau khi tín vật rời khỏi tầm kiểm soát của bạn.</span></div>
  <div class="kv"><span class="k">4 · Thu hồi phải TỒN TẠI trước khi bạn cần tới</span><span class="v">Cái ngày bạn biết một token đã rò ra là một ngày rất tệ để phát hiện mình không có cách nào vô hiệu hoá nó. Hãy dựng cái công tắc tắt trong lúc chưa có gì cháy.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một tín vật nằm trong URL rò ra qua NĂM kênh bạn không kiểm soát nổi.</strong> <code>https://vidu.com/reset?token=abc123</code> chui vào lịch sử trình duyệt, vào header <code>Referer</code> gửi cho MỌI script bên thứ ba trên trang, vào nhật ký truy cập của máy chủ, vào log của proxy và CDN, và vào cái app chat vừa sinh ra bản xem trước bằng cách TỰ TẢI nó về. Liên kết đặt lại mật khẩu là ca phổ biến, và Chương 6 chỉ cách giảm thiểu: dùng một lần, hết hạn nhanh, và nuốt cái token vào một request POST ngay khi trang vừa tải xong.</p>
</div>

<h3>Chặng đường, và chỗ nào hỏng ở từng chặng</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Sinh ra</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ở máy chủ</span><span class="lz-nsub">Ngẫu nhiên yếu → đoán được. Bài 1.2.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Trên đường</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Máy chủ → trình duyệt</span><span class="lz-nsub">Không TLS → đọc được trên dây. Nằm trong URL → bị ghi log khắp nơi.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nằm ở client</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cookie hay localStorage</span><span class="lz-nsub">Script đọc được → một lỗ XSS là lấy mất. Chương 3 và 4.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Gửi trả lại</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Trình duyệt TỰ ĐỘNG gửi</span><span class="lz-nsub">Gắn vào cả request do trang khác gây ra → CSRF. Chương 3.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Xác minh</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Lại ở máy chủ</span><span class="lz-nsub">So sánh ngây thơ → rò qua thời gian. Bài 1.3.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nằm ở máy chủ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cơ sở dữ liệu, nhật ký, sao lưu</span><span class="lz-nsub">Cất thô → một bản dump là mọi phiên. Bài 1.5.</span></div></div>
  </div>
</div>
<div class="callout ok">
<p><strong>MỖI chương của khoá này là MỘT chặng trên cái sơ đồ đó.</strong> Đó là cấu trúc thật thà của chủ đề này: xác thực không phải một bài toán khó, nó là sáu bài toán dễ mà làm sai bất kỳ cái nào cũng vô hiệu hoá năm cái còn lại. Lý do nó có cảm giác khó là vì những cú hỏng đều LẶNG LẼ — một mã phiên yếu và một mã phiên mạnh trông y hệt nhau trong phản hồi.</p>
</div>

<h3>Kẻ tấn công THẬT SỰ là ai</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một người dùng khác của chính sản phẩm bạn</span><span class="lz-lnote">Phổ biến nhất, cách biệt rất xa, và ít kịch tính nhất. Họ đổi một cái id trong URL rồi nhìn thấy dữ liệu của người khác. Không công cụ, không kỹ năng, đôi khi chẳng có cả ý đồ — và nó vẫn là một vụ lộ dữ liệu.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một script đang chạy trên chính trang của bạn</span><span class="lz-lnote">Lỗ XSS của bạn, hoặc một gói npm, hoặc một thẻ analytics, hoặc một tiện ích trình duyệt. Nó chạy với TOÀN BỘ quyền của origin bạn và đọc được mọi thứ JavaScript đọc được. Đây là mối đe doạ quyết định cuộc tranh luận cookie-đối-lại-localStorage.</span></div>
  <div class="lz-layer"><span class="lz-lname">Người cầm một danh sách từ cú rò của trang khác</span><span class="lz-lnote">Họ không nhắm vào riêng bạn; họ thử mười triệu cặp email/mật khẩu lên một trăm trang web. Nhồi tín vật là cú tấn công có KHỐI LƯỢNG lớn nhất trên internet, và nó thành công thuần tuý nhờ việc người ta dùng lại mật khẩu — Chương 2 và Chương 10.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một trang lừa đảo trông giống hệt trang bạn</span><span class="lz-lnote">Người dùng gõ mật khẩu và mã TOTP vào form của kẻ tấn công, và kẻ tấn công chuyển tiếp cả hai tới bạn theo thời gian thực. TOTP KHÔNG chặn được chuyện này. Passkey thì chặn được, về mặt CẤU TRÚC — Chương 7.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bất kỳ ai rốt cuộc có được một bản sao cơ sở dữ liệu của bạn</span><span class="lz-lnote">Một bản sao lưu rò ra, một bucket lưu trữ cấu hình sai, một cựu nhân viên, một cái laptop bị chiếm. Kẻ tấn công này đọc thong thả, và đó là TOÀN BỘ lý do việc băm mật khẩu buộc phải <em>CHẬM</em>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thường KHÔNG phải: ai đó bẻ mật mã của bạn</span><span class="lz-lnote">Không ai đi phân tích thừa số khoá RSA của bạn cả. Họ đang tìm một token trong file log, một mã phiên trong URL, một tài khoản admin có mật khẩu <code>admin123</code>, hoặc một endpoint đã quên mất cổng 3. Hãy phân bổ sự chú ý của bạn cho tương xứng.</span></div>
</div>

<h3>Cách khác: tín vật RÀNG BUỘC-NGƯỜI-GỬI</h3>
<pre><code><span class="tok-comment">// DPoP (RFC 9449): client chứng minh mình nắm một khoá riêng, ở MỖI request</span>
POST /api/don-hang HTTP/1.1
Authorization: DPoP eyJhbGciOi…            <span class="tok-comment">// access token</span>
DPoP: eyJ0eXAiOiJkcG9wK2p3dCIsImFsZyI6…    <span class="tok-comment">// một bằng chứng MỚI, ký ngay lúc này</span>

<span class="tok-comment">// Bằng chứng phủ lên method, URL và một dấu thời gian, ký bằng một khoá mà</span>
<span class="tok-comment">// trình duyệt giữ ở dạng KHÔNG trích xuất được. Cắp mỗi token là chưa đủ.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">DPoP</span><span class="v">Một chữ ký cho từng request, ràng vào một khoá mà client nắm giữ. Một access token bị cắp mà không có khoá riêng thì vô dụng — và với Web Crypto API, khoá đó sinh ra được ở dạng không-trích-xuất-được, nên ngay cả script cũng không đọc nổi.</span></div>
  <div class="kv"><span class="k">mTLS</span><span class="v">Client trình một chứng chỉ ngay trong bắt tay TLS, và token được ràng vào đó. Tuyệt vời cho giao tiếp dịch vụ-tới-dịch vụ; nặng nề với trình duyệt, vì phân phối chứng chỉ tới người dùng cuối tự nó đã là một sản phẩm.</span></div>
  <div class="kv"><span class="k">Passkey</span><span class="v">Phiên bản mạnh nhất, và là cái DUY NHẤT được trình duyệt phổ thông hỗ trợ: khoá riêng không bao giờ rời khỏi bộ xác thực, và chữ ký PHỦ LÊN origin — nên một trang lừa đảo hoàn toàn không lấy nổi một assertion dùng được. Chương 7.</span></div>
  <div class="kv"><span class="k">Vì sao kiểu mang theo vẫn thống trị</span><span class="v">Nó chạy ở mọi nơi, với mọi client, chỉ bằng một cái header. Tín vật ràng buộc-người-gửi cần quản lý khoá ở CẢ HAI đầu. Hãy biết là chúng tồn tại, dùng passkey ở chỗ dùng được, và thiết kế đường bearer với giả định rằng nó SẼ rò.</span></div>
</div>
<div class="note-ct">
<p><strong>Một ví dụ làm sẵn về "thiết kế cho việc rò rỉ" trên chính kho mã này.</strong> Cookie <code>backend_token</code> của CuongThai sống bảy ngày trong khi cái JWT bên trong nó hết hạn sau hai mươi bốn tiếng. Chỗ lệch đó từng khiến các phiên chết LẶNG LẼ sau một ngày mà không có đường hồi phục, vì <code>/auth/refresh</code> chưa tồn tại — cách vá là một endpoint refresh cộng một interceptor 401 thử lại đúng một lần. Bài học thiết kế chính là bài của trang này: một tín vật ngắn hạn chỉ AN TOÀN để dùng nếu đường gia hạn đã có TRƯỚC, không thì áp lực kéo dài tuổi thọ nó sẽ thắng trong mọi cuộc tranh luận.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6750" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6750 — Bearer Token Usage</span><span class="lc-sub">datatracker.ietf.org · §1 định nghĩa "bearer" gọn trong một đoạn; §5 liệt kê các mối đe doạ</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9449" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">RFC 9449 — DPoP</span><span class="lc-sub">datatracker.ietf.org · Token ràng buộc-người-gửi cho trình duyệt, và cái giá của nó</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">OWASP — Threat Modeling Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Biến câu "kẻ tấn công là ai" thành một bài tập lặp lại được</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referer" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">MDN — header Referer</span><span class="lc-sub">developer.mozilla.org · Một tín vật nằm trong URL rốt cuộc đi tới những đâu</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Cắp một cookie phiên từ trình duyệt này rồi dùng ở trình duyệt kia — rồi đo xem cái gì lẽ ra đã chặn bạn</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — Randomness, and how many bits is enough|||1.2 — Ngẫu nhiên, và bao nhiêu bit là đủ',
      slug: 'auth-1-2-ngau-nhien',
      type: 'LESSON',
      description: 'Math.random() đoán được sau vài lần xuất, và bài này chỉ ra con số thật. Rồi tới phép tính entropy trả lời "bao nhiêu bit là đủ", khác biệt giữa ĐỘ DÀI CHUỖI và SỐ BIT, và một bảng tra: mã phiên, token CSRF, liên kết đặt lại, khoá TOTP, API key cần bao nhiêu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Randomness, and how many bits is enough</h2>
<p class="lead">Half of the credentials in a typical application are "a random string" — session ids, reset tokens, CSRF tokens, API keys. Two questions decide whether they are secure, and both have exact answers: is the source cryptographic, and how many bits does it produce? Almost every mistake in this area is confusing the <em>length of the string</em> with the <em>number of bits</em>.</p>

<h3><code>Math.random()</code> is not a coin flip</h3>
<pre><code><span class="tok-comment">// Looks random. Is not.</span>
const code = Math.random().toString(36).slice(2);
console.log(code);</code></pre>
<div class="out">k3f9a1x7bqz2

# Trong nhu ngau nhien. Van de: no la mot day SO GIA-NGAU-NHIEN
# tat dinh. V8 dung xorshift128+, va toan bo trang thai noi tai
# khoi phuc duoc tu mot so it gia tri xuat lien tiep.</div>
<pre><code><span class="tok-comment">// Two properties Math.random() explicitly does NOT have</span>
<span class="tok-comment">// 1. Unpredictability: given enough outputs, the next one is computable.</span>
<span class="tok-comment">// 2. Backtracking resistance: given the state, ALL past outputs follow.</span>

<span class="tok-comment">// The spec itself says so — ECMA-262 §21.4.2.29:</span>
<span class="tok-comment">// "This specification does not define an algorithm … it must not be used</span>
<span class="tok-comment">//  for cryptographic purposes."</span></code></pre>
<div class="callout warn">
<p><strong>This is not a theoretical concern with a theoretical fix.</strong> Session ids built from <code>Math.random()</code> have been broken in real applications: an attacker registers an account, collects a handful of ids issued to themselves, recovers the generator state, and then computes the ids issued to everyone else in the same window. No cryptography is broken, because none was used. The fix is one import and costs nothing.</p>
</div>
<pre><code><span class="tok-comment">// The correct source, in Node</span>
import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';

randomBytes(32).toString('base64url');   <span class="tok-comment">// 256 bits, 43 characters</span>
randomBytes(16).toString('hex');         <span class="tok-comment">// 128 bits, 32 characters</span>
randomUUID();                            <span class="tok-comment">// 122 random bits (UUIDv4)</span>

<span class="tok-comment">// In the browser</span>
const b = new Uint8Array(32);
crypto.getRandomValues(b);</code></pre>
<div class="out">$ node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
5tHnQ5kR2wYbF0vJ8xLmA3pZcNdEuGsT9iOaXrWvB1k

$ node -e "console.log(require('crypto').randomUUID())"
9f2c4e18-7b3a-4d61-9e0f-a52c8d17b4e6
                   ^ version 4      ^ variant</div>

<h3>How many bits, computed rather than guessed</h3>
<pre><code><span class="tok-comment"># The only question that matters: how long to guess one?</span>
<span class="tok-comment"># Assume an absurdly generous attacker: 10^12 guesses per second,</span>
<span class="tok-comment"># which is far beyond any online attack and beyond most offline ones.</span>

64 bit   → 1,8 × 10^19  kha nang → ~ 213 ngay
80 bit   → 1,2 × 10^24  kha nang → ~ 38.000 nam
128 bit  → 3,4 × 10^38  kha nang → ~ 10^19 nam (vu tru moi 1,4 × 10^10 nam)
256 bit  → 1,2 × 10^77  kha nang → khong con y nghia de viet ra</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">64 bits</span><span class="lz-t">The floor, not the target</span><span class="lz-d">OWASP's minimum for a session id. It is enough against an online attacker limited by your rate limits, and not enough against anything else. Use it as the number below which you have definitely made a mistake.</span></div>
  <div class="lz-step"><span class="lz-k">128 bits</span><span class="lz-t">The default answer</span><span class="lz-d">Sixteen random bytes. Beyond any brute force that will ever exist, cheap to generate, and short enough to fit anywhere. When unsure, this is the number.</span></div>
  <div class="lz-step"><span class="lz-k">256 bits</span><span class="lz-t">For long-lived secrets</span><span class="lz-d">API keys, signing keys, webhook secrets — things that live for years and may be attacked offline. The extra bytes cost nothing and remove the question permanently.</span></div>
  <div class="lz-step"><span class="lz-k">Above 256</span><span class="lz-t">Not a security decision</span><span class="lz-d">There is no attacker for whom 256 bits is feasible and 512 is not. Longer tokens past this point buy nothing and make logs and URLs worse.</span></div>
</div>

<h3>String length is not entropy</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Math.random().toString(36).slice(2)</code></span><span class="v">Eleven characters, so it <em>looks</em> like about 56 bits. It is not: the underlying value is a double with 52 bits of mantissa, from a non-cryptographic generator whose state is recoverable. Effective security: zero.</span></div>
  <div class="kv"><span class="k"><code>randomBytes(16).toString('hex')</code></span><span class="v">Thirty-two characters, 128 bits. Hex is four bits per character, so the string is always twice the byte count. Longer to read, safe to put in a URL or a log without escaping.</span></div>
  <div class="kv"><span class="k"><code>randomBytes(16).toString('base64url')</code></span><span class="v">Twenty-two characters, the same 128 bits. Six bits per character, and <code>base64url</code> rather than <code>base64</code> so there is no <code>+</code>, <code>/</code> or <code>=</code> to break a URL or a cookie value.</span></div>
  <div class="kv"><span class="k"><code>randomUUID()</code></span><span class="v">Thirty-six characters but only 122 bits — six of the 128 are fixed version and variant markers. Perfectly fine for a session id; just do not count it as 128, and never use UUIDv1, which embeds a timestamp and a MAC address.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a random-looking id is not a secret if it is also a database key you display.</strong> A <code>cuid</code> or a UUID in a URL is an identifier, not a credential: it appears in logs, in referrers, in shared links, and in the page source. Authorization must still check ownership (Lesson 0.2). "Unguessable URL" is a valid design for an unlisted document, but it is a <em>bearer credential</em> the moment you rely on it — with all four consequences from Lesson 1.1.</p>
</div>

<h3>The lookup table</h3>
<pre><code><span class="tok-comment">// src/lib/ngau-nhien.ts — one file, used everywhere</span>
import { randomBytes } from 'node:crypto';

export const sessionCode   = () =&gt; randomBytes(32).toString('base64url'); <span class="tok-comment">// 256 bit</span>
export const csrfToken    = () =&gt; randomBytes(16).toString('base64url'); <span class="tok-comment">// 128 bit</span>
export const resetCode  = () =&gt; randomBytes(32).toString('base64url'); <span class="tok-comment">// 256 bit</span>
export const apiKey   = () =&gt; 'ct_' + randomBytes(32).toString('base64url');
export const recoveryCode = () =&gt;                                        <span class="tok-comment">// 10 codes, 40 bits each</span>
  Array.from({ length: 10 }, () =&gt; randomBytes(5).toString('hex'));</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Session id — 128 bits minimum, 256 is free</span><span class="lz-lnote">Lives as long as the session, and guessing one is instant account access. There is no reason to economise here.</span></div>
  <div class="lz-layer"><span class="lz-lname">CSRF token — 128 bits</span><span class="lz-lnote">Short-lived and checked per request. It defends against a blind attacker who must guess without seeing the value, so 128 is comfortably beyond enough.</span></div>
  <div class="lz-layer"><span class="lz-lname">Password reset / email verification — 256 bits, short expiry, single use</span><span class="lz-lnote">This one travels through email, which is a channel you do not control. The bits are the easy part; Chapter 6 is about the expiry, the single-use guarantee, and hashing it at rest.</span></div>
  <div class="lz-layer"><span class="lz-lname">TOTP shared secret — 160 bits</span><span class="lz-lnote">RFC 4226 recommends 160 bits, which is 20 bytes, which is 32 characters in base32 — the format authenticator apps expect. Chapter 7.</span></div>
  <div class="lz-layer"><span class="lz-lname">Recovery codes — 40 bits each, ten of them</span><span class="lz-lnote">Deliberately short so a human can type them, which is safe only because they are rate-limited, single-use, and there are only ten. This is the one place a small number is a considered choice rather than a mistake.</span></div>
  <div class="lz-layer"><span class="lz-lname">A prefix is worth the four characters</span><span class="lz-lnote"><code>ct_live_</code> or <code>ct_test_</code> in front of an API key lets secret scanners recognise it in a public repository and lets you tell at a glance which environment a leaked key belongs to. GitHub's secret scanning works on exactly this pattern.</span></div>
</div>
<div class="callout ok">
<p><strong>Generate secrets in one module, never inline.</strong> A single <code>ngau-nhien.ts</code> means there is exactly one place where the source and the bit count are decided, one place to audit, and one place to change if a review says a token is too short. Inline <code>randomBytes</code> calls scattered across twenty route files are how one of them ends up as <code>randomBytes(8)</code> and nobody notices for a year.</p>
</div>
<div class="note-ct">
<p><strong>The birthday bound, so you can stop worrying about collisions.</strong> With 128 bits, you would need to generate about 2^64 — eighteen quintillion — tokens before a collision becomes likely. At a thousand sessions per second that is nearly six hundred million years. Uniqueness is not a reason to add a database check on insert; if you have a unique constraint it is for correctness under bugs, not because a collision is expected.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nodejs.org/api/crypto.html#cryptorandombytessize-callback" target="_blank" rel="noopener"><span class="lc-ico">🎲</span><span class="lc-body"><span class="lc-title">Node.js — crypto.randomBytes</span><span class="lc-sub">nodejs.org · The CSPRNG, plus randomUUID and randomInt</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">MDN — crypto.getRandomValues</span><span class="lc-sub">developer.mozilla.org · The browser equivalent, and why Math.random is not it</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#session-id-entropy" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">OWASP — session id entropy</span><span class="lc-sub">cheatsheetseries.owasp.org · The 64-bit floor and where it comes from</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9562" target="_blank" rel="noopener"><span class="lc-ico">🆔</span><span class="lc-body"><span class="lc-title">RFC 9562 — UUID versions</span><span class="lc-sub">datatracker.ietf.org · What v4 actually guarantees, and why v1 leaks</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Predict the next Math.random() from previous outputs, then repeat it against randomBytes</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Ngẫu nhiên, và bao nhiêu bit là đủ</h2>
<p class="lead">Một nửa số tín vật trong một ứng dụng điển hình là "một chuỗi ngẫu nhiên" — mã phiên, token đặt lại, token CSRF, API key. Hai câu hỏi quyết định chúng có an toàn hay không, và cả hai đều có câu trả lời CHÍNH XÁC: nguồn có phải nguồn mật mã không, và nó sinh ra bao nhiêu BIT? Gần như mọi sai lầm ở mảng này đều là lẫn lộn giữa <em>ĐỘ DÀI CHUỖI</em> với <em>SỐ BIT</em>.</p>

<h3><code>Math.random()</code> không phải một cú tung đồng xu</h3>
<pre><code><span class="tok-comment">// Trông ngẫu nhiên. Không phải.</span>
const code = Math.random().toString(36).slice(2);
console.log(code);</code></pre>
<div class="out">k3f9a1x7bqz2

# Trong nhu ngau nhien. Van de: no la mot day SO GIA-NGAU-NHIEN
# tat dinh. V8 dung xorshift128+, va toan bo trang thai noi tai
# khoi phuc duoc tu mot so it gia tri xuat lien tiep.</div>
<pre><code><span class="tok-comment">// Hai tính chất mà Math.random() KHÔNG có, một cách tường minh</span>
<span class="tok-comment">// 1. Không đoán trước được: có đủ giá trị xuất là tính ra được cái kế tiếp.</span>
<span class="tok-comment">// 2. Không lần ngược được: có trạng thái là suy ra MỌI giá trị đã xuất.</span>

<span class="tok-comment">// Chính đặc tả nói thế — ECMA-262 §21.4.2.29:</span>
<span class="tok-comment">// "Đặc tả này không định nghĩa một thuật toán … nó KHÔNG ĐƯỢC dùng</span>
<span class="tok-comment">//  cho các mục đích mật mã."</span></code></pre>
<div class="callout warn">
<p><strong>Đây không phải một mối lo lý thuyết với một cách vá lý thuyết.</strong> Mã phiên dựng từ <code>Math.random()</code> đã bị phá trong những ứng dụng THẬT: kẻ tấn công đăng ký một tài khoản, thu thập một nhúm mã được cấp cho chính họ, khôi phục trạng thái bộ sinh, rồi TÍNH RA những mã đã cấp cho mọi người khác trong cùng khoảng thời gian. Chẳng có mật mã nào bị phá cả, vì có dùng đâu. Cách vá là một dòng import và không tốn gì.</p>
</div>
<pre><code><span class="tok-comment">// Nguồn đúng, trong Node</span>
import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';

randomBytes(32).toString('base64url');   <span class="tok-comment">// 256 bit, 43 ký tự</span>
randomBytes(16).toString('hex');         <span class="tok-comment">// 128 bit, 32 ký tự</span>
randomUUID();                            <span class="tok-comment">// 122 bit ngẫu nhiên (UUIDv4)</span>

<span class="tok-comment">// Trong trình duyệt</span>
const b = new Uint8Array(32);
crypto.getRandomValues(b);</code></pre>
<div class="out">$ node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
5tHnQ5kR2wYbF0vJ8xLmA3pZcNdEuGsT9iOaXrWvB1k

$ node -e "console.log(require('crypto').randomUUID())"
9f2c4e18-7b3a-4d61-9e0f-a52c8d17b4e6
                   ^ session ban 4   ^ variant</div>

<h3>Bao nhiêu bit — TÍNH ra, đừng đoán</h3>
<pre><code><span class="tok-comment"># Câu hỏi duy nhất có ý nghĩa: đoán ra một cái mất bao lâu?</span>
<span class="tok-comment"># Giả sử một kẻ tấn công hào phóng đến mức vô lý: 10^12 lần đoán mỗi giây,</span>
<span class="tok-comment"># vượt xa mọi tấn công trực tuyến và vượt cả phần lớn tấn công ngoại tuyến.</span>

64 bit   → 1,8 × 10^19  kha nang → ~ 213 ngay
80 bit   → 1,2 × 10^24  kha nang → ~ 38.000 nam
128 bit  → 3,4 × 10^38  kha nang → ~ 10^19 nam (vu tru moi 1,4 × 10^10 nam)
256 bit  → 1,2 × 10^77  kha nang → khong con y nghia de viet ra</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">64 bit</span><span class="lz-t">Sàn, không phải đích</span><span class="lz-d">Mức tối thiểu của OWASP cho một mã phiên. Nó đủ để chống một kẻ tấn công trực tuyến bị giới hạn tốc độ của bạn kìm lại, và KHÔNG đủ để chống bất cứ thứ gì khác. Hãy coi nó là con số mà thấp hơn nó thì chắc chắn bạn đã làm sai.</span></div>
  <div class="lz-step"><span class="lz-k">128 bit</span><span class="lz-t">Câu trả lời mặc định</span><span class="lz-d">Mười sáu byte ngẫu nhiên. Vượt ngoài mọi cú dò vét cạn từng có và sẽ có, sinh ra thì rẻ, và đủ ngắn để nhét vừa mọi chỗ. Không chắc thì lấy con số này.</span></div>
  <div class="lz-step"><span class="lz-k">256 bit</span><span class="lz-t">Cho bí mật sống lâu</span><span class="lz-d">API key, khoá ký, secret của webhook — những thứ sống nhiều năm và có thể bị tấn công ngoại tuyến. Mấy byte thêm không tốn gì và xoá vĩnh viễn câu hỏi này.</span></div>
  <div class="lz-step"><span class="lz-k">Trên 256</span><span class="lz-t">Không phải quyết định bảo mật</span><span class="lz-d">Không tồn tại kẻ tấn công nào mà với họ 256 bit là khả thi còn 512 thì không. Token dài hơn mức này chẳng mua thêm gì và chỉ làm log với URL tệ đi.</span></div>
</div>

<h3>Độ dài chuỗi KHÔNG phải entropy</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Math.random().toString(36).slice(2)</code></span><span class="v">Mười một ký tự, nên nó <em>TRÔNG như</em> khoảng 56 bit. Không phải: giá trị nền là một số double với 52 bit phần định trị, tới từ một bộ sinh không phải mật mã mà trạng thái khôi phục được. Mức an toàn thực tế: BẰNG KHÔNG.</span></div>
  <div class="kv"><span class="k"><code>randomBytes(16).toString('hex')</code></span><span class="v">Ba mươi hai ký tự, 128 bit. Hex là bốn bit mỗi ký tự, nên chuỗi luôn dài gấp đôi số byte. Đọc thì dài, nhưng an toàn để nhét vào URL hay nhật ký mà không phải thoát ký tự.</span></div>
  <div class="kv"><span class="k"><code>randomBytes(16).toString('base64url')</code></span><span class="v">Hai mươi hai ký tự, vẫn 128 bit đó. Sáu bit mỗi ký tự, và dùng <code>base64url</code> chứ không phải <code>base64</code> nên không có <code>+</code>, <code>/</code> hay <code>=</code> để làm hỏng một URL hay một giá trị cookie.</span></div>
  <div class="kv"><span class="k"><code>randomUUID()</code></span><span class="v">Ba mươi sáu ký tự nhưng chỉ 122 bit — sáu trong số 128 bit là dấu hiệu phiên bản và variant CỐ ĐỊNH. Hoàn toàn ổn cho một mã phiên; chỉ là đừng tính nó thành 128, và ĐỪNG BAO GIỜ dùng UUIDv1, thứ nhúng cả dấu thời gian lẫn địa chỉ MAC.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một cái id trông ngẫu nhiên KHÔNG phải bí mật nếu nó đồng thời là khoá cơ sở dữ liệu mà bạn hiển thị ra.</strong> Một <code>cuid</code> hay một UUID trong URL là ĐỊNH DANH, không phải tín vật: nó xuất hiện trong nhật ký, trong referrer, trong những liên kết được chia sẻ, và trong mã nguồn trang. Phân quyền VẪN phải kiểm quyền sở hữu (Bài 0.2). "URL không đoán được" là một thiết kế hợp lệ cho một tài liệu không công khai, nhưng nó trở thành <em>tín vật kiểu mang theo</em> ngay khoảnh khắc bạn DỰA VÀO nó — kèm đủ bốn hệ quả của Bài 1.1.</p>
</div>

<h3>Bảng tra</h3>
<pre><code><span class="tok-comment">// src/lib/ngau-nhien.ts — một file, dùng ở mọi nơi</span>
import { randomBytes } from 'node:crypto';

export const sessionCode   = () =&gt; randomBytes(32).toString('base64url'); <span class="tok-comment">// 256 bit</span>
export const csrfToken    = () =&gt; randomBytes(16).toString('base64url'); <span class="tok-comment">// 128 bit</span>
export const resetCode  = () =&gt; randomBytes(32).toString('base64url'); <span class="tok-comment">// 256 bit</span>
export const apiKey   = () =&gt; 'ct_' + randomBytes(32).toString('base64url');
export const recoveryCode = () =&gt;                                        <span class="tok-comment">// 10 mã, mỗi mã 40 bit</span>
  Array.from({ length: 10 }, () =&gt; randomBytes(5).toString('hex'));</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mã phiên — tối thiểu 128 bit, mà 256 thì miễn phí</span><span class="lz-lnote">Nó sống đúng bằng tuổi cái phiên, và đoán trúng một cái là vào thẳng tài khoản. Không có lý do gì để tiết kiệm ở đây.</span></div>
  <div class="lz-layer"><span class="lz-lname">Token CSRF — 128 bit</span><span class="lz-lnote">Ngắn hạn và được kiểm ở mỗi request. Nó chống một kẻ tấn công MÙ, phải đoán mà không nhìn thấy giá trị, nên 128 là thừa thãi một cách thoải mái.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đặt lại mật khẩu / xác minh email — 256 bit, hết hạn nhanh, dùng một lần</span><span class="lz-lnote">Cái này đi qua email, một kênh bạn KHÔNG kiểm soát. Số bit là phần dễ; Chương 6 nói về thời hạn, bảo đảm dùng-một-lần, và việc BĂM nó khi cất.</span></div>
  <div class="lz-layer"><span class="lz-lname">Khoá chung của TOTP — 160 bit</span><span class="lz-lnote">RFC 4226 khuyến nghị 160 bit, tức 20 byte, tức 32 ký tự ở dạng base32 — đúng định dạng mà các app xác thực chờ đợi. Chương 7.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mã khôi phục — mỗi mã 40 bit, mười mã</span><span class="lz-lnote">CỐ Ý ngắn để con người gõ được, và điều đó chỉ an toàn vì chúng bị giới hạn tốc độ, dùng một lần, và chỉ có mười cái. Đây là chỗ DUY NHẤT mà một con số nhỏ là một lựa chọn có cân nhắc chứ không phải một sai lầm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một tiền tố đáng giá bốn ký tự</span><span class="lz-lnote"><code>ct_live_</code> hay <code>ct_test_</code> đặt trước một API key giúp các bộ quét bí mật nhận ra nó trong một kho mã công khai, và giúp bạn nhìn phát biết ngay một khoá rò ra thuộc môi trường nào. Bộ quét secret của GitHub chạy đúng theo mẫu này.</span></div>
</div>
<div class="callout ok">
<p><strong>Hãy sinh bí mật trong MỘT module, đừng bao giờ viết chèn tại chỗ.</strong> Một file <code>ngau-nhien.ts</code> duy nhất nghĩa là có ĐÚNG MỘT chỗ quyết định nguồn và số bit, một chỗ để soát, và một chỗ để sửa nếu có ai review bảo rằng một token đang quá ngắn. Những lời gọi <code>randomBytes</code> rải rác trong hai mươi file route chính là cách mà một trong số chúng thành <code>randomBytes(8)</code> và không ai nhận ra suốt một năm.</p>
</div>
<div class="note-ct">
<p><strong>Cận sinh nhật, để bạn thôi lo chuyện trùng mã.</strong> Với 128 bit, bạn phải sinh khoảng 2^64 — mười tám tỉ tỉ — token thì mới bắt đầu KHẢ NĂNG có một cú trùng. Ở tốc độ một nghìn phiên mỗi giây, đó là gần sáu trăm triệu năm. Tính duy nhất KHÔNG phải lý do để thêm một phép kiểm cơ sở dữ liệu lúc chèn; nếu bạn có một ràng buộc duy nhất thì đó là để đúng đắn khi có bug, không phải vì trùng mã là chuyện được chờ đợi.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nodejs.org/api/crypto.html#cryptorandombytessize-callback" target="_blank" rel="noopener"><span class="lc-ico">🎲</span><span class="lc-body"><span class="lc-title">Node.js — crypto.randomBytes</span><span class="lc-sub">nodejs.org · Bộ sinh ngẫu nhiên mật mã, cộng randomUUID và randomInt</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">MDN — crypto.getRandomValues</span><span class="lc-sub">developer.mozilla.org · Bản tương đương ở trình duyệt, và vì sao Math.random không phải nó</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#session-id-entropy" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">OWASP — entropy của mã phiên</span><span class="lc-sub">cheatsheetseries.owasp.org · Cái sàn 64 bit và nó tới từ đâu</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9562" target="_blank" rel="noopener"><span class="lc-ico">🆔</span><span class="lc-body"><span class="lc-title">RFC 9562 — các phiên bản UUID</span><span class="lc-sub">datatracker.ietf.org · v4 THẬT SỰ bảo đảm gì, và vì sao v1 rò rỉ thông tin</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Đoán giá trị Math.random() kế tiếp từ những giá trị trước, rồi thử lại điều đó với randomBytes</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — Comparing two secrets with === is a bug|||1.3 — So sánh hai bí mật bằng === là một con bug',
      slug: 'auth-1-3-so-sanh-hang-thoi-gian',
      type: 'LESSON',
      description: 'Toán tử === dừng ngay ký tự khác nhau đầu tiên, nên thời gian nó chạy tiết lộ bạn đoán trúng bao nhiêu ký tự đầu. Bài này đo cái rò rỉ đó, nói thẳng nó khai thác được tới đâu qua mạng, chỉ cách dùng timingSafeEqual cho đúng, và giới thiệu mẫu TỐT HƠN: đừng so sánh bí mật, hãy TRA CỨU chúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Comparing two secrets with <code>===</code> is a bug</h2>
<p class="lead">String equality in every language stops at the first byte that differs. That is the correct behaviour for ordinary data and a side channel for secrets: the time the comparison takes is a function of how many leading bytes the attacker guessed right, which turns an impossible search over the whole value into a feasible one, byte by byte.</p>

<h3>See the leak</h3>
<pre><code><span class="tok-comment">// The comparison everyone writes first</span>
if (tokenGuiLen === tokenThat) { … }

<span class="tok-comment">// What the CPU does: compare byte 0. Differ? Return false, now.</span>
<span class="tok-comment">//                    Same? Compare byte 1. And so on.</span></code></pre>
<pre><code><span class="tok-comment">// Measure it: 2 million comparisons per bucket, 64-char token</span>
const real = 'a'.repeat(64);
for (const trung of [0, 1, 8, 32, 63, 64]) {
  const segment = 'a'.repeat(trung) + 'b'.repeat(64 - trung);
  const t = process.hrtime.bigint();
  for (let i = 0; i &lt; 2_000_000; i++) { real === segment; }
  const ns = Number(process.hrtime.bigint() - t) / 2_000_000;
  console.log(&#96;trung \${String(trung).padStart(2)} ky tu → \${ns.toFixed(2)} ns&#96;);
}</code></pre>
<div class="out">trung  0 ky tu →  4.11 ns
trung  1 ky tu →  4.982 ns
trung  8 ky tu →  7.13 ns
trung 32 ky tu → 15.44 ns
trung 63 ky tu → 25.90 ns
trung 64 ky tu → 26.31 ns      ← trung het

# Chenh lech 6 lan giua "sai ngay ky tu dau" va "dung het".
# Cai duong tang deu do CHINH LA kenh ro ri.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Guess byte 0</span><span class="lz-d">Send 256 requests, one per possible first byte. One of them is measurably slower than the other 255, because the comparison got past the first byte before failing.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Keep it, guess byte 1</span><span class="lz-d">Another 256 requests with the known first byte and every possible second byte. The search is now linear in length rather than exponential.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Total cost</span><span class="lz-d">A 32-byte token needs about 32 × 256 = 8,192 measurements instead of 2^256 guesses. That is the difference between "never" and "an afternoon".</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The catch</span><span class="lz-d">Each "measurement" is really thousands of requests averaged, because network jitter dwarfs a nanosecond. That is what makes remote exploitation hard — but it is a matter of sample size, not of impossibility.</span></div>
</div>
<div class="callout warn">
<p><strong>How worried should you actually be?</strong> Honestly: a remote timing attack across the public internet against a nanosecond-scale difference is difficult, and there are usually easier ways in. But the difference grows with token length and with anything that amplifies it (a database lookup, a slow hash, a debug log), the attacker controls how many samples to take, and — the decisive point — <strong>the fix is one function call with identical performance</strong>. There is no trade-off to weigh here, which is why "probably not exploitable" is not a reason to leave it.</p>
</div>

<h3>The fix, and the trap inside it</h3>
<pre><code>import { timingSafeEqual } from 'node:crypto';

<span class="tok-comment">// Constant time: always compares every byte, never returns early.</span>
const a = Buffer.from(tokenGuiLen);
const b = Buffer.from(tokenThat);
if (a.length === b.length &amp;&amp; timingSafeEqual(a, b)) { … }</code></pre>
<div class="out">$ node -e "require('crypto').timingSafeEqual(Buffer.from('abc'), Buffer.from('abcd'))"
RangeError [ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH]:
  Input buffers must have the same byte length</div>
<div class="pitfall">
<p><strong>Trap — <code>timingSafeEqual</code> throws on a length mismatch, so a naive wrapper leaks the length instead.</strong> If your code returns a different error, or returns much faster, when the lengths differ, you have replaced a byte-level leak with a length-level one. Length is usually not secret — every session id you issue is the same length — so an explicit length check first is fine. When length <em>is</em> secret, hash both sides to a fixed size first and compare the hashes, which is the pattern below.</p>
</div>
<pre><code><span class="tok-comment">// The double-HMAC pattern: safe for any lengths, no branch on length</span>
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

const sessionKey = randomBytes(32);        <span class="tok-comment">// per-process, not persisted</span>

export function equalsCT(a: string, b: string) {
  const hmacA = createHmac('sha256', sessionKey).update(a).digest();
  const hmacB = createHmac('sha256', sessionKey).update(b).digest();
  return timingSafeEqual(hmacA, hmacB);          <span class="tok-comment">// always 32 bytes</span>
}</code></pre>
<div class="callout ok">
<p><strong>Why an HMAC and not a plain hash.</strong> With a plain <code>sha256</code>, an attacker who knows the algorithm can compute the digest of any candidate offline and mount the same attack against the digest. Keying it with a random per-process value they do not know removes that: they cannot predict what either side hashes to, so the comparison reveals nothing about the input beyond equality.</p>
</div>

<h3>The better answer: do not compare, look up</h3>
<pre><code><span class="tok-comment">// ❌ Fetch every session, compare in application code</span>
const session = await prisma.session.findFirst({ where: { id: submittedCode } });

<span class="tok-comment">// ✅ Store a hash of the token; look up BY the hash.</span>
<span class="tok-comment">//    The database index does the matching, and the row does not</span>
<span class="tok-comment">//    contain the token at all.</span>
const hash = createHash('sha256').update(submittedCode).digest('hex');
const session = await prisma.session.findUnique({ where: { tokenHash: bam } });</code></pre>
<pre><code><span class="tok-comment">// prisma/schema.prisma</span>
model Session {
  id        String   @id @default(cuid())
  tokenHash String   @unique          <span class="tok-comment">// sha256 OF the token, NOT the token</span>
  expiresAt DateTime
  userId    String
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The database dump stops being a session list</span><span class="lz-lnote">A leaked backup contains hashes, and a hash cannot be presented as a credential. This alone is worth the two lines: it converts "every active session is compromised" into "no session is compromised".</span></div>
  <div class="lz-layer"><span class="lz-lname">There is no comparison to get wrong</span><span class="lz-lnote">An index lookup either finds a row or does not. No branch on secret bytes exists in your code, so no timing leak can be introduced by a later refactor.</span></div>
  <div class="lz-layer"><span class="lz-lname">A fast hash is correct here, unlike for passwords</span><span class="lz-lnote"><code>sha256</code> is right for a 256-bit random token: there is nothing to brute-force, because the input space is the full 2^256. Passwords are the opposite case — low entropy, human-chosen — which is why Chapter 2 insists on a <em>slow</em> hash. The same choice is correct in one case and catastrophic in the other.</span></div>
  <div class="lz-layer"><span class="lz-lname">It works for every long-lived secret</span><span class="lz-lnote">API keys, webhook secrets, password reset tokens, email verification tokens, invitation codes. Show the value once at creation, store only the hash, and accept that "lost it" means "issue a new one" — which is the right behaviour anyway.</span></div>
</div>

<h3>The place this bug actually appears: webhook signatures</h3>
<pre><code><span class="tok-comment">// ❌ Real code, from more than one production codebase</span>
const signature = createHmac('sha256', SECRET).update(req.rawBody).digest('hex');
if (signature !== req.headers['x-signature']) return res.status(401).end();

<span class="tok-comment">// ✅ The same thing, without the side channel</span>
const signature = createHmac('sha256', SECRET).update(req.rawBody).digest();
const upload = Buffer.from(String(req.headers['x-signature']), 'hex');
if (upload.length !== signature.length || !timingSafeEqual(signature, upload)) {
  return res.status(401).end();
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Why webhooks are the worst case</span><span class="v">The attacker controls the body, can send unlimited requests, gets a clean pass/fail signal, and the endpoint usually has no rate limit because it is "internal". Every condition a timing attack needs, in one route.</span></div>
  <div class="kv"><span class="k">Use the raw body, not the parsed one</span><span class="v">The signature covers the exact bytes sent. <code>JSON.parse</code> then <code>JSON.stringify</code> reorders keys and changes whitespace, so the recomputed HMAC will not match. Capture <code>req.rawBody</code> before the JSON middleware.</span></div>
  <div class="kv"><span class="k">Include a timestamp, and check it</span><span class="v">A signature with no time bound is replayable forever. Sign <code>timestamp + '.' + body</code> and reject anything older than five minutes — this is what Stripe and GitHub both do.</span></div>
  <div class="kv"><span class="k">Node has <code>crypto.timingSafeEqual</code>; other runtimes differ</span><span class="v">Go has <code>hmac.Equal</code>, Python has <code>hmac.compare_digest</code>, PHP has <code>hash_equals</code>. Every mature standard library ships one, which tells you how common the mistake is.</span></div>
</div>
<div class="note-ct">
<p><strong>Where to spend your attention.</strong> Timing is the smallest of the leaks in this chapter, and the cheapest to close — a single helper used everywhere a secret is compared, plus the hash-and-look-up pattern so most comparisons disappear entirely. Do both once, early, and then spend the attention you saved on Lesson 1.5, where secrets leak in ways that need no measurement at all: a token printed in a log line, a key committed to git, a password in an error message.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">Node.js — crypto.timingSafeEqual</span><span class="lc-sub">nodejs.org · The signature, and the length-mismatch behaviour that surprises people</span></span></a>
<a class="link-card" href="https://codahale.com/a-lesson-in-timing-attacks/" target="_blank" rel="noopener"><span class="lc-ico">📉</span><span class="lc-body"><span class="lc-title">A lesson in timing attacks</span><span class="lc-sub">codahale.com · The classic write-up, with the measurement methodology</span></span></a>
<a class="link-card" href="https://docs.stripe.com/webhooks#verify-manually" target="_blank" rel="noopener"><span class="lc-ico">🪝</span><span class="lc-body"><span class="lc-title">Stripe — verifying webhook signatures</span><span class="lc-sub">docs.stripe.com · Timestamp, raw body and constant-time compare, done correctly</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🗄️</span><span class="lc-body"><span class="lc-title">OWASP — Cryptographic Storage</span><span class="lc-sub">cheatsheetseries.owasp.org · Which hash for which purpose, including tokens versus passwords</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Recover a token one byte at a time from timing, then close the channel two different ways</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>So sánh hai bí mật bằng <code>===</code> là một con bug</h2>
<p class="lead">Phép so sánh chuỗi trong MỌI ngôn ngữ đều dừng ở byte đầu tiên khác nhau. Đó là hành vi ĐÚNG với dữ liệu thường và là một KÊNH PHỤ với bí mật: thời gian phép so sánh chạy là một hàm của việc kẻ tấn công đoán trúng bao nhiêu byte đầu, thứ biến một cuộc tìm kiếm bất khả thi trên toàn bộ giá trị thành một cuộc tìm kiếm khả thi, từng byte một.</p>

<h3>Nhìn thấy chỗ rò</h3>
<pre><code><span class="tok-comment">// Phép so sánh ai cũng viết đầu tiên</span>
if (tokenGuiLen === tokenThat) { … }

<span class="tok-comment">// Cái CPU làm: so byte 0. Khác? Trả về false, NGAY.</span>
<span class="tok-comment">//              Giống? So byte 1. Và cứ thế.</span></code></pre>
<pre><code><span class="tok-comment">// Đo nó: 2 triệu phép so mỗi ô, token 64 ký tự</span>
const real = 'a'.repeat(64);
for (const trung of [0, 1, 8, 32, 63, 64]) {
  const segment = 'a'.repeat(trung) + 'b'.repeat(64 - trung);
  const t = process.hrtime.bigint();
  for (let i = 0; i &lt; 2_000_000; i++) { real === segment; }
  const ns = Number(process.hrtime.bigint() - t) / 2_000_000;
  console.log(&#96;trung \${String(trung).padStart(2)} ky tu → \${ns.toFixed(2)} ns&#96;);
}</code></pre>
<div class="out">trung  0 ky tu →  4.11 ns
trung  1 ky tu →  4.982 ns
trung  8 ky tu →  7.13 ns
trung 32 ky tu → 15.44 ns
trung 63 ky tu → 25.90 ns
trung 64 ky tu → 26.31 ns      ← trung het

# Chenh lech 6 lan giua "sai ngay ky tu dau" va "dung het".
# Cai duong tang deu do CHINH LA kenh ro ri.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đoán byte 0</span><span class="lz-d">Gửi 256 request, mỗi request một giá trị byte đầu. Một trong số đó CHẬM hơn 255 cái kia một cách đo được, vì phép so sánh đã đi qua khỏi byte đầu rồi mới trượt.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Giữ lại, đoán byte 1</span><span class="lz-d">Thêm 256 request nữa với byte đầu đã biết và mọi giá trị có thể của byte thứ hai. Cuộc tìm kiếm giờ TUYẾN TÍNH theo độ dài chứ không còn hàm mũ.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tổng chi phí</span><span class="lz-d">Một token 32 byte cần khoảng 32 × 256 = 8.192 phép đo, thay vì 2^256 lần đoán. Đó là khác biệt giữa "không bao giờ" với "một buổi chiều".</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chỗ vướng</span><span class="lz-d">Mỗi "phép đo" thật ra là hàng nghìn request lấy trung bình, vì nhiễu mạng át hẳn một nano giây. Đó là thứ làm cho việc khai thác từ xa trở nên KHÓ — nhưng đó là chuyện cỡ mẫu, không phải chuyện bất khả thi.</span></div>
</div>
<div class="callout warn">
<p><strong>Thật ra nên lo tới mức nào?</strong> Nói thẳng: một cú tấn công thời gian từ xa qua internet công cộng nhắm vào chênh lệch cỡ nano giây là KHÓ, và thường có những đường vào dễ hơn nhiều. Nhưng chênh lệch đó LỚN LÊN theo độ dài token và theo bất cứ thứ gì khuếch đại nó (một lần tra cơ sở dữ liệu, một hàm băm chậm, một dòng log gỡ rối), kẻ tấn công tự quyết định lấy bao nhiêu mẫu, và — điểm quyết định — <strong>cách vá là MỘT lời gọi hàm với hiệu năng y hệt</strong>. Ở đây không có đánh đổi nào để cân nhắc, và đó là lý do "chắc là không khai thác được đâu" không phải một lý do để bỏ qua.</p>
</div>

<h3>Cách vá, và cái bẫy nằm bên trong nó</h3>
<pre><code>import { timingSafeEqual } from 'node:crypto';

<span class="tok-comment">// Thời gian hằng: LUÔN so hết mọi byte, không bao giờ trả về sớm.</span>
const a = Buffer.from(tokenGuiLen);
const b = Buffer.from(tokenThat);
if (a.length === b.length &amp;&amp; timingSafeEqual(a, b)) { … }</code></pre>
<div class="out">$ node -e "require('crypto').timingSafeEqual(Buffer.from('abc'), Buffer.from('abcd'))"
RangeError [ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH]:
  Input buffers must have the same byte length</div>
<div class="pitfall">
<p><strong>Bẫy — <code>timingSafeEqual</code> NÉM LỖI khi độ dài lệch, nên một hàm bọc ngây thơ sẽ rò rỉ ĐỘ DÀI thay vì rò byte.</strong> Nếu mã của bạn trả về một lỗi khác, hoặc trả về nhanh hơn hẳn, khi độ dài lệch, thì bạn vừa thay một chỗ rò mức byte bằng một chỗ rò mức độ dài. Độ dài thường KHÔNG phải bí mật — mọi mã phiên bạn cấp ra đều dài như nhau — nên kiểm độ dài tường minh trước là ổn. Khi độ dài <em>THỰC SỰ</em> là bí mật thì hãy băm cả hai vế xuống một kích thước cố định rồi so các chuỗi băm, tức là mẫu ngay bên dưới.</p>
</div>
<pre><code><span class="tok-comment">// Mẫu HMAC kép: an toàn với mọi độ dài, không rẽ nhánh theo độ dài</span>
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

const sessionKey = randomBytes(32);        <span class="tok-comment">// theo tiến trình, không lưu lại</span>

export function equalsCT(a: string, b: string) {
  const hmacA = createHmac('sha256', sessionKey).update(a).digest();
  const hmacB = createHmac('sha256', sessionKey).update(b).digest();
  return timingSafeEqual(hmacA, hmacB);          <span class="tok-comment">// luôn 32 byte</span>
}</code></pre>
<div class="callout ok">
<p><strong>Vì sao dùng HMAC chứ không phải một hàm băm trần.</strong> Với <code>sha256</code> trần, một kẻ tấn công biết thuật toán có thể TỰ TÍNH chuỗi băm của mọi ứng viên ở ngoại tuyến rồi mở đúng cuộc tấn công đó lên chuỗi băm. Gắn khoá bằng một giá trị ngẫu nhiên theo tiến trình mà họ không biết sẽ xoá bỏ điều đó: họ không đoán nổi mỗi vế băm ra cái gì, nên phép so sánh không tiết lộ gì về đầu vào ngoài chuyện chúng có bằng nhau hay không.</p>
</div>

<h3>Câu trả lời TỐT HƠN: đừng so sánh, hãy TRA CỨU</h3>
<pre><code><span class="tok-comment">// ❌ Lấy phiên về rồi so sánh trong mã ứng dụng</span>
const session = await prisma.session.findFirst({ where: { id: submittedCode } });

<span class="tok-comment">// ✅ Cất một chuỗi BĂM của token; tra cứu THEO chuỗi băm đó.</span>
<span class="tok-comment">//    Chỉ mục cơ sở dữ liệu lo việc khớp, và cái hàng đó KHÔNG</span>
<span class="tok-comment">//    chứa token chút nào.</span>
const hash = createHash('sha256').update(submittedCode).digest('hex');
const session = await prisma.session.findUnique({ where: { tokenHash: bam } });</code></pre>
<pre><code><span class="tok-comment">// prisma/schema.prisma</span>
model Session {
  id        String   @id @default(cuid())
  tokenHash String   @unique          <span class="tok-comment">// sha256 của token, KHÔNG phải token</span>
  expiresAt DateTime
  userId    String
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bản dump cơ sở dữ liệu thôi là một danh sách phiên</span><span class="lz-lnote">Một bản sao lưu rò ra chỉ chứa chuỗi băm, và một chuỗi băm thì không TRÌNH RA làm tín vật được. Chỉ riêng điều này đã đáng hai dòng mã: nó biến "mọi phiên đang hoạt động đều bị chiếm" thành "không phiên nào bị chiếm".</span></div>
  <div class="lz-layer"><span class="lz-lname">Không còn phép so sánh nào để làm sai</span><span class="lz-lnote">Một lần tra chỉ mục thì hoặc tìm thấy một hàng hoặc không. Trong mã của bạn KHÔNG tồn tại nhánh nào rẽ theo byte bí mật, nên không một lần refactor sau này nào tạo ra được chỗ rò thời gian.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một hàm băm NHANH là ĐÚNG ở đây, khác hẳn với mật khẩu</span><span class="lz-lnote"><code>sha256</code> là đúng cho một token ngẫu nhiên 256 bit: chẳng có gì để dò vét cạn cả, vì không gian đầu vào là trọn vẹn 2^256. Mật khẩu thì NGƯỢC LẠI — entropy thấp, do con người chọn — và đó là lý do Chương 2 khăng khăng đòi một hàm băm <em>CHẬM</em>. Cùng một lựa chọn: đúng ở ca này và thảm hoạ ở ca kia.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó dùng được cho MỌI bí mật sống lâu</span><span class="lz-lnote">API key, secret của webhook, token đặt lại mật khẩu, token xác minh email, mã mời. Hiện giá trị ra ĐÚNG MỘT LẦN lúc tạo, chỉ cất chuỗi băm, và chấp nhận rằng "mất rồi" nghĩa là "cấp cái mới" — vốn dĩ cũng là hành vi đúng.</span></div>
</div>

<h3>Chỗ con bug này THẬT SỰ xuất hiện: chữ ký webhook</h3>
<pre><code><span class="tok-comment">// ❌ Mã thật, lấy từ hơn một kho mã production</span>
const signature = createHmac('sha256', SECRET).update(req.rawBody).digest('hex');
if (signature !== req.headers['x-signature']) return res.status(401).end();

<span class="tok-comment">// ✅ Cũng chuyện đó, không kèm kênh phụ</span>
const signature = createHmac('sha256', SECRET).update(req.rawBody).digest();
const upload = Buffer.from(String(req.headers['x-signature']), 'hex');
if (upload.length !== signature.length || !timingSafeEqual(signature, upload)) {
  return res.status(401).end();
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao webhook là ca TỆ NHẤT</span><span class="v">Kẻ tấn công kiểm soát phần thân, gửi được vô hạn request, nhận một tín hiệu đạt/trượt sạch sẽ, và cái endpoint thường KHÔNG có giới hạn tốc độ vì nó "nội bộ". Đủ mọi điều kiện mà một cú tấn công thời gian cần, gói trong một route.</span></div>
  <div class="kv"><span class="k">Dùng thân THÔ, không dùng thân đã phân tích</span><span class="v">Chữ ký phủ lên ĐÚNG những byte đã gửi. <code>JSON.parse</code> rồi <code>JSON.stringify</code> sẽ đảo thứ tự khoá và đổi khoảng trắng, nên HMAC tính lại sẽ không khớp. Hãy giữ <code>req.rawBody</code> TRƯỚC middleware JSON.</span></div>
  <div class="kv"><span class="k">Kèm một dấu thời gian, và KIỂM nó</span><span class="v">Một chữ ký không có ràng buộc thời gian thì phát lại được mãi mãi. Hãy ký <code>timestamp + '.' + body</code> rồi từ chối mọi thứ cũ hơn năm phút — Stripe và GitHub đều làm đúng vậy.</span></div>
  <div class="kv"><span class="k">Node có <code>crypto.timingSafeEqual</code>; runtime khác cũng có bản riêng</span><span class="v">Go có <code>hmac.Equal</code>, Python có <code>hmac.compare_digest</code>, PHP có <code>hash_equals</code>. Mọi thư viện chuẩn trưởng thành đều đóng gói sẵn một cái, và điều đó nói lên sai lầm này phổ biến tới đâu.</span></div>
</div>
<div class="note-ct">
<p><strong>Nên dồn sự chú ý vào đâu.</strong> Thời gian là chỗ rò NHỎ NHẤT trong chương này, và là chỗ rẻ nhất để bịt — một hàm phụ dùng ở mọi nơi có so sánh bí mật, cộng mẫu băm-rồi-tra-cứu để phần lớn phép so sánh biến mất hẳn. Hãy làm cả hai một lần, sớm, rồi dồn phần chú ý tiết kiệm được sang Bài 1.5, nơi bí mật rò ra theo những cách chẳng cần đo đạc gì cả: một token in trong dòng log, một khoá commit vào git, một mật khẩu nằm trong thông báo lỗi.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">Node.js — crypto.timingSafeEqual</span><span class="lc-sub">nodejs.org · Chữ ký hàm, và hành vi lệch-độ-dài làm người ta bất ngờ</span></span></a>
<a class="link-card" href="https://codahale.com/a-lesson-in-timing-attacks/" target="_blank" rel="noopener"><span class="lc-ico">📉</span><span class="lc-body"><span class="lc-title">A lesson in timing attacks</span><span class="lc-sub">codahale.com · Bài viết kinh điển, kèm phương pháp đo</span></span></a>
<a class="link-card" href="https://docs.stripe.com/webhooks#verify-manually" target="_blank" rel="noopener"><span class="lc-ico">🪝</span><span class="lc-body"><span class="lc-title">Stripe — xác minh chữ ký webhook</span><span class="lc-sub">docs.stripe.com · Dấu thời gian, thân thô và so sánh thời gian hằng, làm đúng</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🗄️</span><span class="lc-body"><span class="lc-title">OWASP — Cryptographic Storage</span><span class="lc-sub">cheatsheetseries.owasp.org · Hàm băm nào cho mục đích nào, kể cả token đối lại mật khẩu</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Khôi phục một token từng byte một bằng thời gian, rồi bịt cái kênh đó theo hai cách khác nhau</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Hash, MAC, signature: three tools, one confusion|||1.4 — Băm, MAC, chữ ký: ba công cụ, một sự nhầm lẫn',
      slug: 'auth-1-4-bam-mac-chu-ky',
      type: 'LESSON',
      description: 'Một hàm băm chứng minh TOÀN VẸN, một MAC chứng minh toàn vẹn CỘNG nguồn gốc với người cùng biết khoá, một chữ ký chứng minh nguồn gốc với BẤT KỲ AI. Bài này tách bạch ba thứ, chỉ ra vì sao sha256(bimat + tin) là một lỗ hổng có tên, và vì sao HS256 dùng chung cho năm dịch vụ nghĩa là cả năm đều giả mạo được token của nhau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Hash, MAC, signature: three tools, one confusion</h2>
<p class="lead">These three appear everywhere in authentication and answer three different questions. Choosing the wrong one rarely produces an error — it produces a system that looks secure and is not. This lesson separates them by the question each answers, then shows the two mistakes that come from conflating them.</p>

<h3>The three questions</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Hash</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Is this the same data?"</span><span class="lz-nsub">No key. Anyone can compute it — including the attacker.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">MAC</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Did someone with the shared key send this?"</span><span class="lz-nsub">One secret key, used to both make and check.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Signature</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Did the holder of THIS private key send this?"</span><span class="lz-nsub">Private key makes, public key checks. Anyone can verify.</span></div></div>
  </div>
</div>
<pre><code>import { createHash, createHmac, generateKeyPairSync, sign, verify } from 'node:crypto';

<span class="tok-comment">// 1. Hash — no key, deterministic, anyone can reproduce it</span>
createHash('sha256').update('xin chao').digest('hex');

<span class="tok-comment">// 2. MAC — a shared secret; you cannot compute it without the key</span>
createHmac('sha256', KHOA_CHUNG).update('xin chao').digest('hex');

<span class="tok-comment">// 3. Signature — private key signs, public key verifies</span>
const { privateKey, publicKey } = generateKeyPairSync('ed25519');
const signature = sign(null, Buffer.from('xin chao'), privateKey);
verify(null, Buffer.from('xin chao'), publicKey, signature);</code></pre>
<div class="out">1. 1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567014
2. 8f1a2c05e9c7b3d4a6e8f0219d3b5c7e4a1f8d2b6c9e0a3f5d7b1c4e6a8f0d29
3. &lt;Buffer 3d 9c 41 f7 … 64 byte&gt;   → verify: true</div>

<h3>What each one does and does not prove</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hash proves integrity, never origin</span><span class="v">If an attacker can change the message they can recompute the hash, because there is no secret involved. A hash next to the data it hashes proves nothing at all — it only helps when the hash arrives through a channel the attacker cannot touch.</span></div>
  <div class="kv"><span class="k">MAC proves integrity and origin — to key holders</span><span class="v">Anyone with the key can both produce and verify a tag. That is fine between your own services and useless as evidence: you cannot prove <em>which</em> key holder produced it, because you could have produced it yourself.</span></div>
  <div class="kv"><span class="k">Signature proves origin to everybody</span><span class="v">Only the private key can produce it; the public key can be handed to anyone. This is what makes a JWT verifiable by a service that must not be able to <em>issue</em> tokens — the property that Chapter 4 builds on.</span></div>
  <div class="kv"><span class="k">None of the three provides confidentiality</span><span class="v">A signed JWT is readable by anyone holding it — <code>base64url</code> is encoding, not encryption. If a value must be secret <em>and</em> unforgeable, you need encryption with authentication (AEAD), not a signature over plaintext.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — <code>sha256(bimat + tinNhan)</code> is a broken MAC with a name: length extension.</strong> SHA-256's internal construction lets an attacker who knows the digest and the length of the secret — without knowing the secret itself — compute a valid digest for <code>tinNhan + padding + themVao</code>. Their forged message keeps your original payload and appends their own, and the tag verifies. This has broken real APIs. HMAC's nested construction exists precisely to prevent it, and it is one function call away.</p>
</div>
<pre><code><span class="tok-comment">// ❌ Homemade MAC — vulnerable to length extension</span>
const tag = createHash('sha256').update(BIMAT + duLieu).digest('hex');

<span class="tok-comment">// ✅ HMAC — the construction that fixes it, same cost</span>
const tag = createHmac('sha256', BIMAT).update(duLieu).digest('hex');

<span class="tok-comment">// (SHA-3 and BLAKE2/BLAKE3 are not length-extendable, so keyed BLAKE2</span>
<span class="tok-comment">//  is also fine. HMAC-SHA256 is the choice with the widest support.)</span></code></pre>

<h3>The mistake that matters most: HS256 shared across services</h3>
<pre><code><span class="tok-comment">// A common architecture, and a common mistake</span>
<span class="tok-comment">// auth-service   signs   JWT with HS256 and secret S</span>
<span class="tok-comment">// api-service    verifies JWT with HS256 and secret S</span>
<span class="tok-comment">// worker-service verifies JWT with HS256 and secret S</span>
<span class="tok-comment">// billing        verifies JWT with HS256 and secret S</span></code></pre>
<div class="out">Voi HMAC, KIEM va TAO dung CHUNG mot khoa.

⇒ api-service co the DUC ra mot token noi "role: ADMIN".
⇒ worker-service co the duc token cho bat ky nguoi dung nao.
⇒ Mot lo hong o BAT KY dich vu nao trong bon = gia mao duoc token toan he thong.
⇒ Nha thau ben ngoai lam billing gio co the tu cap permission admin.</div>
<pre><code><span class="tok-comment">// The fix: asymmetric. Only the issuer holds the private key.</span>
<span class="tok-comment">// auth-service   signs   with the ED25519 / RS256 PRIVATE key</span>
<span class="tok-comment">// everyone else  verifies with the PUBLIC key, published at</span>
<span class="tok-comment">//                https://auth.vidu.com/.well-known/jwks.json</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">One service issues</span><span class="lz-t">HS256 is fine</span><span class="lz-d">A monolith that both signs and verifies has one key holder, so a symmetric MAC is correct and simpler. This is most applications, and there is no need to complicate it.</span></div>
  <div class="lz-step"><span class="lz-k">Several services verify</span><span class="lz-t">Use asymmetric</span><span class="lz-d">The moment a second service needs to check tokens, symmetric means giving it the power to mint them. Publish a public key instead; verification needs nothing secret.</span></div>
  <div class="lz-step"><span class="lz-k">A third party verifies</span><span class="lz-t">Asymmetric, no question</span><span class="lz-d">JWKS is exactly this: a URL serving your public keys so anyone can verify and nobody can issue. Every OIDC provider works this way — Chapter 8.</span></div>
  <div class="lz-step"><span class="lz-k">Which algorithm</span><span class="lz-t">EdDSA, then ES256, then RS256</span><span class="lz-d">Ed25519 has small keys, fast verification and no parameter choices to get wrong. RS256 is the most widely supported and the reason most people still use it. Avoid RSA with PKCS#1 v1.5 padding for new systems.</span></div>
</div>

<h3>Encryption is a fourth thing, and not a substitute</h3>
<pre><code><span class="tok-comment">// ❌ Encrypting without authenticating: the ciphertext can be tampered with</span>
const cipher = createCipheriv('aes-256-ctr', key, iv);   <span class="tok-comment">// no tag</span>

<span class="tok-comment">// ✅ AEAD: encrypt AND authenticate in one construction</span>
const cipher = createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([cipher.update(duLieu), cipher.final()]);
const tag = cipher.getAuthTag();       <span class="tok-comment">// ← decryption FAILS without this</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Encryption hides, it does not protect</span><span class="lz-lnote">A stream cipher without a tag lets an attacker flip specific bits in the plaintext without knowing the key. If the plaintext is <code>{"role":"user"}</code>, flipping bits is a targeted edit, not noise. Always use an AEAD mode.</span></div>
  <div class="lz-layer"><span class="lz-lname">Do you need encryption at all?</span><span class="lz-lnote">Usually not. If the value is only meaningful to your server — a session id, an opaque token — a random value carries no information to hide. Encryption is for when the client must hold data you cannot let them read, which is rarer than it sounds.</span></div>
  <div class="lz-layer"><span class="lz-lname">Never write your own construction</span><span class="lz-lnote">IV reuse, padding oracles and nonce collisions have broken far more systems than weak algorithms. Use <code>aes-256-gcm</code> with a fresh random IV per message, or a library that manages this for you.</span></div>
  <div class="lz-layer"><span class="lz-lname">Encrypted JWTs exist and are rarely the answer</span><span class="lz-lnote">JWE encrypts the payload, which sounds like it fixes "anyone can read a JWT". It does — and the usual right answer is simpler: do not put anything private in a token at all. Chapter 4.</span></div>
</div>
<div class="callout ok">
<p><strong>The decision, in one paragraph.</strong> Verifying an opaque random token against a stored copy? <strong>Hash</strong> it and look it up (Lesson 1.3). Proving to your own code that a value you issued has not been altered — a webhook, a signed cookie, a JWT within one service? <strong>HMAC</strong>. Letting a service that must not issue tokens verify them, or letting a third party verify anything? <strong>Signature</strong>, with the public key published. Needing the client to hold data they must not read? <strong>AEAD encryption</strong> — and first check whether you can avoid needing it.</p>
</div>
<div class="note-ct">
<p><strong>Where CuongThai uses each of these.</strong> The <code>backend_token</code> JWT is HS256, which is correct: one Node process both issues and verifies it, so there is no second key holder to worry about. Webhook payloads from payment providers are verified with HMAC and a timestamp. R2 media URLs are signed by the storage provider's own scheme. And nothing is encrypted at the application layer, because nothing needs to be — the session cookie carries a claim about identity, not a secret about content. Choosing the simplest primitive that answers the actual question is most of getting this right.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc2104" target="_blank" rel="noopener"><span class="lc-ico">🔏</span><span class="lc-body"><span class="lc-title">RFC 2104 — HMAC</span><span class="lc-sub">datatracker.ietf.org · The nested construction, and the attack it was designed against</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Length_extension_attack" target="_blank" rel="noopener"><span class="lc-ico">➕</span><span class="lc-body"><span class="lc-title">Length extension attack</span><span class="lc-sub">wikipedia.org · Why hash(secret + message) is not a MAC, with the affected algorithms</span></span></a>
<a class="link-card" href="https://nodejs.org/api/crypto.html#class-sign" target="_blank" rel="noopener"><span class="lc-ico">✍️</span><span class="lc-body"><span class="lc-title">Node.js — sign and verify</span><span class="lc-sub">nodejs.org · Ed25519, ECDSA and RSA, with the one-shot API used above</span></span></a>
<a class="link-card" href="https://soatok.blog/2020/05/27/soatoks-guide-to-side-channel-attacks/" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">Choosing cryptographic primitives</span><span class="lc-sub">soatok.blog · Practical guidance on which tool for which job, aimed at engineers</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Forge a message against a homemade sha256 MAC, then watch the same attack fail on HMAC</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Băm, MAC, chữ ký: ba công cụ, một sự nhầm lẫn</h2>
<p class="lead">Ba thứ này xuất hiện khắp nơi trong xác thực và trả lời BA câu hỏi khác nhau. Chọn nhầm cái hiếm khi sinh ra một lỗi — nó sinh ra một hệ thống TRÔNG có vẻ an toàn mà không an toàn. Bài này tách bạch chúng theo câu hỏi mà mỗi cái trả lời, rồi chỉ ra hai sai lầm sinh ra từ việc gộp chúng lại.</p>

<h3>Ba câu hỏi</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Băm</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Có phải cùng một dữ liệu không?"</span><span class="lz-nsub">Không khoá. AI CŨNG tính được — kể cả kẻ tấn công.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">MAC</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Có phải người nắm khoá chung gửi cái này không?"</span><span class="lz-nsub">Một khoá bí mật, dùng để vừa TẠO vừa KIỂM.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Chữ ký</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Có phải người nắm CÁI khoá riêng NÀY gửi không?"</span><span class="lz-nsub">Khoá riêng TẠO, khoá công KIỂM. Ai cũng xác minh được.</span></div></div>
  </div>
</div>
<pre><code>import { createHash, createHmac, generateKeyPairSync, sign, verify } from 'node:crypto';

<span class="tok-comment">// 1. Băm — không khoá, tất định, ai cũng tái tạo lại được</span>
createHash('sha256').update('xin chao').digest('hex');

<span class="tok-comment">// 2. MAC — một bí mật dùng chung; không có khoá thì không tính nổi</span>
createHmac('sha256', KHOA_CHUNG).update('xin chao').digest('hex');

<span class="tok-comment">// 3. Chữ ký — khoá riêng ký, khoá công xác minh</span>
const { privateKey, publicKey } = generateKeyPairSync('ed25519');
const signature = sign(null, Buffer.from('xin chao'), privateKey);
verify(null, Buffer.from('xin chao'), publicKey, signature);</code></pre>
<div class="out">1. 1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567014
2. 8f1a2c05e9c7b3d4a6e8f0219d3b5c7e4a1f8d2b6c9e0a3f5d7b1c4e6a8f0d29
3. &lt;Buffer 3d 9c 41 f7 … 64 byte&gt;   → verify: true</div>

<h3>Mỗi cái CHỨNG MINH gì và KHÔNG chứng minh gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Băm chứng minh TOÀN VẸN, không bao giờ chứng minh NGUỒN GỐC</span><span class="v">Nếu kẻ tấn công đổi được thông điệp thì họ cũng tính lại được chuỗi băm, vì chẳng có bí mật nào tham gia. Một chuỗi băm nằm CẠNH dữ liệu mà nó băm thì chứng minh được... không gì cả — nó chỉ có ích khi chuỗi băm tới qua một kênh mà kẻ tấn công không chạm được.</span></div>
  <div class="kv"><span class="k">MAC chứng minh toàn vẹn và nguồn gốc — với NGƯỜI GIỮ KHOÁ</span><span class="v">Ai có khoá cũng vừa TẠO vừa KIỂM được một cái tag. Điều đó ổn giữa các dịch vụ của chính bạn và vô dụng khi cần làm BẰNG CHỨNG: bạn không chứng minh được người giữ khoá NÀO đã tạo ra nó, bởi chính bạn cũng tạo ra được.</span></div>
  <div class="kv"><span class="k">Chữ ký chứng minh nguồn gốc với MỌI NGƯỜI</span><span class="v">Chỉ khoá riêng mới tạo ra được nó; khoá công thì đưa cho ai cũng được. Đó là thứ làm cho một JWT có thể được xác minh bởi một dịch vụ mà lẽ ra KHÔNG được phép <em>PHÁT</em> token — chính tính chất mà Chương 4 dựng lên trên đó.</span></div>
  <div class="kv"><span class="k">KHÔNG cái nào trong ba cái cho tính BÍ MẬT</span><span class="v">Một JWT đã ký thì ai cầm cũng ĐỌC được — <code>base64url</code> là MÃ HOÁ KÝ TỰ, không phải mật mã hoá. Nếu một giá trị vừa phải bí mật <em>vừa</em> không giả mạo được, bạn cần mã hoá có xác thực (AEAD), không phải một chữ ký đặt lên bản rõ.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>sha256(bimat + tinNhan)</code> là một MAC HỎNG có tên hẳn hoi: tấn công nối dài.</strong> Cấu trúc bên trong của SHA-256 cho phép một kẻ tấn công BIẾT chuỗi băm và biết ĐỘ DÀI của bí mật — mà không cần biết bí mật — tính ra một chuỗi băm HỢP LỆ cho <code>tinNhan + phần đệm + themVao</code>. Thông điệp giả mạo của họ GIỮ NGUYÊN phần payload gốc của bạn và nối thêm phần của họ, mà cái tag vẫn xác minh trót lọt. Chuyện này đã phá những API có thật. Cấu trúc lồng nhau của HMAC tồn tại CHÍNH XÁC để ngăn điều đó, và nó chỉ cách bạn một lời gọi hàm.</p>
</div>
<pre><code><span class="tok-comment">// ❌ MAC tự chế — dính tấn công nối dài</span>
const tag = createHash('sha256').update(BIMAT + duLieu).digest('hex');

<span class="tok-comment">// ✅ HMAC — cấu trúc vá được điều đó, cùng một chi phí</span>
const tag = createHmac('sha256', BIMAT).update(duLieu).digest('hex');

<span class="tok-comment">// (SHA-3 và BLAKE2/BLAKE3 không nối dài được, nên BLAKE2 có khoá cũng ổn.</span>
<span class="tok-comment">//  HMAC-SHA256 là lựa chọn được hỗ trợ rộng nhất.)</span></code></pre>

<h3>Sai lầm quan trọng nhất: dùng chung HS256 cho nhiều dịch vụ</h3>
<pre><code><span class="tok-comment">// Một kiến trúc phổ biến, và một sai lầm phổ biến</span>
<span class="tok-comment">// auth-service   KÝ      JWT bằng HS256 với bí mật S</span>
<span class="tok-comment">// api-service    xác minh JWT bằng HS256 với bí mật S</span>
<span class="tok-comment">// worker-service xác minh JWT bằng HS256 với bí mật S</span>
<span class="tok-comment">// billing        xác minh JWT bằng HS256 với bí mật S</span></code></pre>
<div class="out">Voi HMAC, KIEM va TAO dung CHUNG mot khoa.

⇒ api-service co the DUC ra mot token noi "role: ADMIN".
⇒ worker-service co the duc token cho bat ky nguoi dung nao.
⇒ Mot lo hong o BAT KY dich vu nao trong bon = gia mao duoc token toan he thong.
⇒ Nha thau ben ngoai lam billing gio co the tu cap permission admin.</div>
<pre><code><span class="tok-comment">// Cách vá: bất đối xứng. CHỈ bên phát hành nắm khoá riêng.</span>
<span class="tok-comment">// auth-service  KÝ       bằng khoá RIÊNG ED25519 / RS256</span>
<span class="tok-comment">// mọi bên khác  xác minh bằng khoá CÔNG, công bố tại</span>
<span class="tok-comment">//               https://auth.vidu.com/.well-known/jwks.json</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Một dịch vụ phát hành</span><span class="lz-t">HS256 là ổn</span><span class="lz-d">Một khối nguyên vừa ký vừa xác minh thì chỉ có MỘT người giữ khoá, nên một MAC đối xứng là đúng và đơn giản hơn. Phần lớn ứng dụng là như vậy, và không cần làm phức tạp lên.</span></div>
  <div class="lz-step"><span class="lz-k">Nhiều dịch vụ xác minh</span><span class="lz-t">Dùng bất đối xứng</span><span class="lz-d">Ngay khoảnh khắc có một dịch vụ thứ hai cần kiểm token, đối xứng nghĩa là trao cho nó luôn quyền ĐÚC token. Hãy công bố một khoá công thay vào đó; việc xác minh không cần bí mật nào cả.</span></div>
  <div class="lz-step"><span class="lz-k">Bên thứ ba xác minh</span><span class="lz-t">Bất đối xứng, khỏi bàn</span><span class="lz-d">JWKS chính là chuyện này: một URL phục vụ những khoá công của bạn để ai cũng xác minh được và không ai phát hành được. Mọi nhà cung cấp OIDC đều làm theo cách này — Chương 8.</span></div>
  <div class="lz-step"><span class="lz-k">Chọn thuật toán nào</span><span class="lz-t">EdDSA, rồi ES256, rồi RS256</span><span class="lz-d">Ed25519 có khoá nhỏ, xác minh nhanh và không có tham số nào để chọn sai. RS256 được hỗ trợ rộng nhất và là lý do phần lớn người ta vẫn dùng nó. Với hệ thống mới, hãy tránh RSA kèm đệm PKCS#1 v1.5.</span></div>
</div>

<h3>Mã hoá là thứ THỨ TƯ, và không thay thế được ba cái kia</h3>
<pre><code><span class="tok-comment">// ❌ Mã hoá mà không xác thực: bản mã bị can thiệp được</span>
const cipher = createCipheriv('aes-256-ctr', key, iv);   <span class="tok-comment">// không có tag</span>

<span class="tok-comment">// ✅ AEAD: mã hoá VÀ xác thực trong cùng một cấu trúc</span>
const cipher = createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([cipher.update(duLieu), cipher.final()]);
const tag = cipher.getAuthTag();       <span class="tok-comment">// ← thiếu cái này là giải mã THẤT BẠI</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mã hoá GIẤU đi, nó không BẢO VỆ</span><span class="lz-lnote">Một mã dòng không kèm tag cho phép kẻ tấn công LẬT những bit cụ thể trong bản rõ mà không cần biết khoá. Nếu bản rõ là <code>{"role":"user"}</code> thì lật bit là một phép sửa CÓ CHỦ ĐÍCH, không phải nhiễu. Hãy LUÔN dùng một chế độ AEAD.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bạn có THẬT SỰ cần mã hoá không?</span><span class="lz-lnote">Thường là không. Nếu giá trị chỉ có ý nghĩa với máy chủ của bạn — một mã phiên, một token mờ đục — thì một giá trị ngẫu nhiên chẳng mang thông tin nào để mà giấu. Mã hoá dành cho lúc client BUỘC PHẢI giữ dữ liệu mà bạn không cho họ đọc, và trường hợp đó hiếm hơn nghe tưởng.</span></div>
  <div class="lz-layer"><span class="lz-lname">ĐỪNG BAO GIỜ tự viết cấu trúc riêng</span><span class="lz-lnote">Dùng lại IV, padding oracle và trùng nonce đã phá nhiều hệ thống hơn hẳn so với thuật toán yếu. Hãy dùng <code>aes-256-gcm</code> với một IV ngẫu nhiên MỚI cho mỗi thông điệp, hoặc một thư viện lo giùm bạn phần đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">JWT mã hoá có tồn tại và hiếm khi là câu trả lời</span><span class="lz-lnote">JWE mã hoá phần payload, nghe như vá được chuyện "ai cũng đọc được JWT". Nó vá được thật — và câu trả lời đúng thông thường thì đơn giản hơn: ĐỪNG đặt bất cứ thứ gì riêng tư vào một token. Chương 4.</span></div>
</div>
<div class="callout ok">
<p><strong>Quyết định, gói trong một đoạn.</strong> Xác minh một token ngẫu nhiên mờ đục với một bản đã lưu? <strong>BĂM</strong> nó rồi tra cứu (Bài 1.3). Chứng minh với chính mã của bạn rằng một giá trị bạn phát ra chưa bị đổi — một webhook, một cookie có ký, một JWT trong PHẠM VI một dịch vụ? <strong>HMAC</strong>. Để một dịch vụ KHÔNG được phép phát hành token vẫn xác minh được chúng, hoặc để một bên thứ ba xác minh bất cứ thứ gì? <strong>CHỮ KÝ</strong>, kèm khoá công được công bố. Cần client giữ dữ liệu mà họ không được đọc? <strong>Mã hoá AEAD</strong> — và trước hết hãy xem có tránh được nhu cầu đó không.</p>
</div>
<div class="note-ct">
<p><strong>CuongThai dùng từng cái ở đâu.</strong> JWT <code>backend_token</code> dùng HS256, và đó là ĐÚNG: một tiến trình Node vừa phát vừa xác minh nó, nên không có người giữ khoá thứ hai nào để lo. Payload webhook từ các nhà cung cấp thanh toán được xác minh bằng HMAC kèm dấu thời gian. URL media trên R2 được ký bằng sơ đồ của chính nhà cung cấp lưu trữ. Và KHÔNG có gì được mã hoá ở tầng ứng dụng cả, vì chẳng có gì cần: cookie phiên mang một lời khẳng định về DANH TÍNH, không phải một bí mật về NỘI DUNG. Chọn nguyên hàm ĐƠN GIẢN NHẤT trả lời được đúng câu hỏi đang có chính là phần lớn của việc làm đúng chuyện này.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc2104" target="_blank" rel="noopener"><span class="lc-ico">🔏</span><span class="lc-body"><span class="lc-title">RFC 2104 — HMAC</span><span class="lc-sub">datatracker.ietf.org · Cấu trúc lồng nhau, và cú tấn công mà nó sinh ra để chống</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Length_extension_attack" target="_blank" rel="noopener"><span class="lc-ico">➕</span><span class="lc-body"><span class="lc-title">Tấn công nối dài (length extension)</span><span class="lc-sub">wikipedia.org · Vì sao hash(bí mật + thông điệp) không phải MAC, kèm các thuật toán bị ảnh hưởng</span></span></a>
<a class="link-card" href="https://nodejs.org/api/crypto.html#class-sign" target="_blank" rel="noopener"><span class="lc-ico">✍️</span><span class="lc-body"><span class="lc-title">Node.js — sign và verify</span><span class="lc-sub">nodejs.org · Ed25519, ECDSA và RSA, kèm API một-phát dùng ở trên</span></span></a>
<a class="link-card" href="https://soatok.blog/2020/05/27/soatoks-guide-to-side-channel-attacks/" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">Chọn nguyên hàm mật mã</span><span class="lc-sub">soatok.blog · Hướng dẫn thực dụng về việc dùng công cụ nào cho việc nào, viết cho kỹ sư</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Giả mạo một thông điệp trên một MAC sha256 tự chế, rồi xem cùng cú đó trượt trên HMAC</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Where secrets leak without anyone attacking|||1.5 — Chỗ bí mật rò ra mà không ai tấn công cả',
      slug: 'auth-1-5-bi-mat-ro-o-dau',
      type: 'LESSON',
      description: 'Bốn trạng thái của một bí mật — trên đường, nằm ở máy chủ, nằm trong bộ nhớ, nằm trong nhật ký — và chỗ nào rò ở từng trạng thái. Kèm lý do một khoá đã commit thì XOAY VÒNG là cách chữa duy nhất, và một cú rò khoá có thật vì nó được nướng vào gói JavaScript của trình duyệt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Where secrets leak without anyone attacking</h2>
<p class="lead">The previous lessons dealt with attackers. This one deals with the more common case: nobody attacked anything, and the secret ended up somewhere it should not be — a log line, a git history, a JavaScript bundle, a screenshot in a support ticket. These leaks need no skill to exploit, and they are the ones that actually happen.</p>

<h3>Four states, four different problems</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">In transit</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">TLS, or it is public</span><span class="lz-nsub">Plus: never in a URL — Lesson 1.1</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">At rest, server</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Env, secret manager, never git</span><span class="lz-nsub">And backups count as "at rest"</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">In memory</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Readable by anything on the box</span><span class="lz-nsub">Core dumps, heap snapshots, /proc</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">In logs</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The one that actually leaks</span><span class="lz-nsub">And it is replicated to five systems</span></div></div>
  </div>
</div>

<h3>Logs: the leak that needs no attacker</h3>
<pre><code><span class="tok-comment">// Four lines that each print a credential, from real codebases</span>
console.log('req headers:', req.headers);          <span class="tok-comment">// → cookie, authorization</span>
console.log('login body:', req.body);              <span class="tok-comment">// → the password, in the clear</span>
logger.error({ err }, 'that bai');                 <span class="tok-comment">// → err.config.headers in axios</span>
logger.info({ req }, 'request');                   <span class="tok-comment">// → the whole object, with everything in it</span></code></pre>
<div class="out">{"level":30,"msg":"request","req":{"headers":{
  "cookie":"backend_token=eyJhbGciOiJIUzI1NiIs…",
  "authorization":"Bearer eyJhbGciOiJIUzI1NiIs…"},
  "body":{"email":"an@vidu.com","password":"MatKhauThat@2026"}}}

# Dong nay gio nam trong: file log tren dia, cong cu gom log,
# he thong luu tru dai han, ban sao luu cua no, va man hinh
# cua bat ky ai co permission doc dashboard.</div>
<pre><code><span class="tok-comment">// The fix: redact at the logger, not at each call site</span>
import pino from 'pino';

export const logger = pino({
  redact: {
    paths: [
      'req.headers.cookie',
      'req.headers.authorization',
      'req.body.password',
      'req.body.newPassword',
      'res.headers["set-cookie"]',
      '*.token', '*.accessToken', '*.refreshToken', '*.apiKey',
    ],
    censor: '[DA_CHE]',
  },
});</code></pre>
<div class="out">{"level":30,"msg":"request","req":{"headers":{
  "cookie":"[DA_CHE]","authorization":"[DA_CHE]"},
  "body":{"email":"an@vidu.com","password":"[DA_CHE]"}}}</div>
<div class="pitfall">
<p><strong>Trap — a deny-list of field names will miss one, and you will not know which.</strong> <code>password</code> is redacted; <code>mat_khau</code>, <code>password</code>, <code>pwd</code> and <code>newPassword</code> are not. The robust version is the other direction: log an explicit allow-list of fields you have decided are safe, and never pass whole request, response or error objects to the logger. It is more typing and it fails closed instead of open.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Error objects are the sneakiest</span><span class="v">An axios error carries <code>err.config.headers</code> — including the <code>Authorization</code> header of the failed request. A Prisma error carries the query parameters (Lesson 11.5 of the Prisma course). Serialising an error is serialising everything it captured.</span></div>
  <div class="kv"><span class="k">APM and error trackers replicate it</span><span class="v">Sentry, Datadog and friends capture request context and local variables by design. Configure their scrubbing lists on day one, not after a report — the data is already sent by the time you think about it.</span></div>
  <div class="kv"><span class="k">Access logs capture query strings</span><span class="v">Nginx logs the full URL by default. A token in a query parameter is therefore in the access log of every proxy between the client and your app, retained for whatever the retention policy says.</span></div>
  <div class="kv"><span class="k">Retention is the multiplier</span><span class="v">A secret in a log written today is in tomorrow's backup, next month's cold storage, and the compliance archive nobody can delete from. "We removed the log line" does not remove the copies.</span></div>
</div>

<h3>Git: a committed secret is committed forever</h3>
<pre><code><span class="tok-comment"># The instinct, and why it does not work</span>
git rm --cached .env
git commit -m "xoa .env"</code></pre>
<div class="out">$ git log --all --oneline -S"sk_live_" -- .env
a3f9e21 them cau hinh thanh toan     ← van con day, trong lich su

$ git show a3f9e21:.env
STRIPE_SECRET_KEY=sk_live_51Nx8…    ← van doc duoc, mai mai</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Rotation is the only fix</span><span class="lz-lnote">Revoke the key at the provider and issue a new one. Rewriting history with <code>filter-repo</code> does not help: every clone, every fork, every CI cache and GitHub's own dangling-commit view may still have it. Treat the secret as public from the moment of the push.</span></div>
  <div class="lz-layer"><span class="lz-lname">Scan before the commit, not after</span><span class="lz-lnote"><code>gitleaks protect --staged</code> in a pre-commit hook, and <code>gitleaks detect</code> in CI as the backstop. The hook is what actually prevents leaks; the CI job is what catches the developer who skipped the hook.</span></div>
  <div class="lz-layer"><span class="lz-lname">Give your own secrets a recognisable prefix</span><span class="lz-lnote">Lesson 1.2's <code>ct_live_</code> is what makes automatic detection possible at all. GitHub's secret scanning works from provider-registered patterns; a random 32-byte string with no prefix is indistinguishable from any other base64 in your repository.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>.gitignore</code> is necessary and not sufficient</span><span class="lz-lnote">It stops <code>.env</code>, and it does not stop <code>.env.backup</code>, <code>config.local.json</code>, a <code>docker-compose.override.yml</code> with an inline password, or a test fixture with a real key in it. Ignore the pattern, and scan anyway.</span></div>
</div>

<h3>The client bundle: a secret that ships to every visitor</h3>
<pre><code><span class="tok-comment">// Next.js — the variable name decides everything</span>
process.env.GIPHY_API_KEY              <span class="tok-comment">// server only, safe</span>
process.env.NEXT_PUBLIC_GIPHY_API_KEY  <span class="tok-comment">// ← baked into the JS bundle</span></code></pre>
<div class="out">$ curl -s https://vidu.com/_next/static/chunks/main-a3f9e21.js | grep -o 'sk_[A-Za-z0-9]*'
sk_live_51Nx8QpRt4mZvL0…

# "NEXT_PUBLIC_" nghia la: thay the luc BUILD, gui toi MOI khach truy cap.
# Khong phai lo hong — day la hanh vi da duoc ghi ro trong tai lieu.</div>
<div class="note-ct">
<p><strong>CuongThai, 02/07/2026 — the GIF picker that died twice.</strong> The client called GIPHY directly with <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, which is baked in at build time. When the variable was missing at build, the code fell back to GIPHY's long-revoked public beta key and every request returned 403 — a feature that had been "flaky" for weeks and then simply stopped. The fix was structural, and it is the general rule: <strong>a third-party key must never be <code>NEXT_PUBLIC_*</code></strong>. Add a small authenticated backend proxy (<code>src/routes/gifs.routes.ts</code> is the pattern), read the key from runtime env, and rotating it becomes a container restart rather than a rebuild and redeploy.</p>
</div>

<h3>Memory, and where env vars are visible</h3>
<pre><code><span class="tok-comment"># Anything running as the same user can read the process environment</span>
cat /proc/$(pgrep -f "node dist/index.js")/environ | tr '\\0' '\\n' | grep -i secret</code></pre>
<div class="out">JWT_SECRET=8f2a91c4e7b3d05a6f8e1029d4b7c3e5
LLM_GATEWAY_API_KEY=sk-…
DATABASE_URL=postgresql://postgres:…@postgres:5432/cuongthai</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Env vars are fine, with limits</span><span class="lz-t">The pragmatic position</span><span class="lz-d">They are readable by any process of the same user, they appear in <code>docker inspect</code>, and they get inherited by child processes. For a single-tenant container that is an acceptable boundary — the attacker who can read <code>/proc</code> already has your code.</span></div>
  <div class="lz-step"><span class="lz-k">Heap snapshots and core dumps</span><span class="lz-t">The forgotten copy</span><span class="lz-d">A crash dump or a <code>--heapsnapshot-signal</code> file contains every string in memory, including every token that passed through. If you enable them, treat the output directory as containing secrets.</span></div>
  <div class="lz-step"><span class="lz-k">A secret manager helps with rotation</span><span class="lz-t">Not with reading</span><span class="lz-d">Vault or AWS Secrets Manager mainly buys you audited access, short-lived credentials and rotation without a redeploy. The value still ends up in memory; the win is operational, not a magic barrier.</span></div>
  <div class="lz-step"><span class="lz-k">Where production env lives here</span><span class="lz-t">One file, deliberately</span><span class="lz-d">On CuongThai it is <code>/opt/cuonghoangdev/.env</code> on the VPS, loaded by the deploy script, and rsync <em>excludes</em> <code>.env*</code> so a deploy can never overwrite it. One place to look, one place to rotate, and no path by which a local file reaches production.</span></div>
</div>
<div class="callout ok">
<p><strong>The rotation drill is the real test.</strong> Pick your JWT signing key and ask: how long from "we believe this leaked" to "the old value is worthless"? If the answer involves editing a file on a server by hand and hoping nothing else uses it, you do not have rotation — you have a plan to write one during an incident. Chapter 11 builds the version with two keys live at once, so the switch is a config change and not an outage.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🗝️</span><span class="lc-body"><span class="lc-title">OWASP — Secrets Management</span><span class="lc-sub">cheatsheetseries.owasp.org · Storage, rotation, and what to do after a leak</span></span></a>
<a class="link-card" href="https://github.com/gitleaks/gitleaks" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">gitleaks</span><span class="lc-sub">github.com · Pre-commit hook and CI scanner, with custom rules for your own prefixes</span></span></a>
<a class="link-card" href="https://getpino.io/#/docs/redaction" target="_blank" rel="noopener"><span class="lc-ico">🖊️</span><span class="lc-body"><span class="lc-title">pino — redaction</span><span class="lc-sub">getpino.io · Path syntax, wildcards, and the performance note</span></span></a>
<a class="link-card" href="https://nextjs.org/docs/app/guides/environment-variables" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js — environment variables</span><span class="lc-sub">nextjs.org · What NEXT_PUBLIC_ actually does, in the project's own words</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">/proc, process environments and file permissions on the server</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Find four leaked secrets in a running app — one in a log, one in git, one in a bundle, one in a URL</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Chỗ bí mật rò ra mà không ai tấn công cả</h2>
<p class="lead">Những bài trước bàn về kẻ tấn công. Bài này bàn về trường hợp PHỔ BIẾN hơn: chẳng ai tấn công gì cả, và cái bí mật rốt cuộc nằm ở chỗ nó không nên nằm — một dòng log, một lịch sử git, một gói JavaScript, một ảnh chụp màn hình trong phiếu hỗ trợ. Những cú rò này không cần kỹ năng gì để khai thác, và chúng mới là những cú THẬT SỰ xảy ra.</p>

<h3>Bốn trạng thái, bốn bài toán khác nhau</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Trên đường</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Có TLS, không thì nó công khai</span><span class="lz-nsub">Cộng thêm: đừng bao giờ nhét vào URL — Bài 1.1</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nằm ở máy chủ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Env, trình quản bí mật, KHÔNG BAO GIỜ git</span><span class="lz-nsub">Và sao lưu cũng tính là "nằm yên"</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Trong bộ nhớ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mọi thứ trên cùng máy đều đọc được</span><span class="lz-nsub">Core dump, ảnh chụp heap, /proc</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Trong nhật ký</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cái THẬT SỰ rò ra</span><span class="lz-nsub">Và nó được nhân bản sang năm hệ thống</span></div></div>
  </div>
</div>

<h3>Nhật ký: cú rò không cần kẻ tấn công nào</h3>
<pre><code><span class="tok-comment">// Bốn dòng, mỗi dòng in ra một tín vật, lấy từ kho mã thật</span>
console.log('req headers:', req.headers);          <span class="tok-comment">// → cookie, authorization</span>
console.log('login body:', req.body);              <span class="tok-comment">// → mật khẩu, dạng thô</span>
logger.error({ err }, 'that bai');                 <span class="tok-comment">// → err.config.headers ở axios</span>
logger.info({ req }, 'request');                   <span class="tok-comment">// → toàn bộ đối tượng, kèm mọi thứ</span></code></pre>
<div class="out">{"level":30,"msg":"request","req":{"headers":{
  "cookie":"backend_token=eyJhbGciOiJIUzI1NiIs…",
  "authorization":"Bearer eyJhbGciOiJIUzI1NiIs…"},
  "body":{"email":"an@vidu.com","password":"MatKhauThat@2026"}}}

# Dong nay gio nam trong: file log tren dia, cong cu gom log,
# he thong luu tru dai han, ban sao luu cua no, va man hinh
# cua bat ky ai co permission doc dashboard.</div>
<pre><code><span class="tok-comment">// Cách vá: che ngay tại LOGGER, đừng che ở từng chỗ gọi</span>
import pino from 'pino';

export const logger = pino({
  redact: {
    paths: [
      'req.headers.cookie',
      'req.headers.authorization',
      'req.body.password',
      'req.body.newPassword',
      'res.headers["set-cookie"]',
      '*.token', '*.accessToken', '*.refreshToken', '*.apiKey',
    ],
    censor: '[DA_CHE]',
  },
});</code></pre>
<div class="out">{"level":30,"msg":"request","req":{"headers":{
  "cookie":"[DA_CHE]","authorization":"[DA_CHE]"},
  "body":{"email":"an@vidu.com","password":"[DA_CHE]"}}}</div>
<div class="pitfall">
<p><strong>Bẫy — một danh sách CẤM theo tên trường sẽ sót một cái, và bạn sẽ không biết là cái nào.</strong> <code>password</code> thì bị che; <code>mat_khau</code>, <code>password</code>, <code>pwd</code> và <code>newPassword</code> thì không. Bản vững chắc đi theo chiều NGƯỢC LẠI: ghi ra một danh sách CHO PHÉP tường minh gồm những trường bạn đã QUYẾT ĐỊNH là an toàn, và đừng bao giờ ném cả đối tượng request, response hay error vào logger. Gõ nhiều hơn thật, nhưng nó hỏng theo hướng ĐÓNG chứ không phải hướng MỞ.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đối tượng lỗi là thứ ranh ma nhất</span><span class="v">Một lỗi của axios cõng theo <code>err.config.headers</code> — kèm cả header <code>Authorization</code> của request vừa trượt. Một lỗi của Prisma cõng theo tham số truy vấn (Bài 11.5 của khoá Prisma). Tuần tự hoá một lỗi là tuần tự hoá MỌI thứ nó đã bắt được.</span></div>
  <div class="kv"><span class="k">APM và trình theo dõi lỗi NHÂN BẢN nó</span><span class="v">Sentry, Datadog và đồng bọn bắt ngữ cảnh request và biến cục bộ, đó là THIẾT KẾ của chúng. Hãy cấu hình danh sách làm sạch của chúng ngay ngày đầu, đừng đợi tới lúc có báo cáo — tới lúc bạn nghĩ tới thì dữ liệu đã gửi đi rồi.</span></div>
  <div class="kv"><span class="k">Nhật ký truy cập ghi lại query string</span><span class="v">Nginx mặc định ghi TOÀN BỘ URL. Một token nằm trong tham số truy vấn do đó nằm trong access log của MỌI proxy giữa client và ứng dụng của bạn, lưu đúng bằng thời hạn mà chính sách lưu trữ quy định.</span></div>
  <div class="kv"><span class="k">Thời hạn lưu trữ là HỆ SỐ NHÂN</span><span class="v">Một bí mật nằm trong log ghi hôm nay thì nằm trong bản sao lưu ngày mai, trong kho lạnh tháng sau, và trong kho lưu tuân thủ mà không ai xoá được. "Bọn tôi đã bỏ dòng log đó rồi" KHÔNG xoá được các bản sao.</span></div>
</div>

<h3>Git: một bí mật đã commit là đã commit VĨNH VIỄN</h3>
<pre><code><span class="tok-comment"># Phản xạ đầu tiên, và vì sao nó không ăn thua</span>
git rm --cached .env
git commit -m "xoa .env"</code></pre>
<div class="out">$ git log --all --oneline -S"sk_live_" -- .env
a3f9e21 them cau hinh thanh toan     ← van con day, trong lich su

$ git show a3f9e21:.env
STRIPE_SECRET_KEY=sk_live_51Nx8…    ← van doc duoc, mai mai</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">XOAY VÒNG là cách chữa DUY NHẤT</span><span class="lz-lnote">Thu hồi khoá ở phía nhà cung cấp rồi cấp một cái mới. Viết lại lịch sử bằng <code>filter-repo</code> không cứu được: mọi bản clone, mọi bản fork, mọi cache CI và cả khung nhìn commit mồ côi của chính GitHub đều có thể vẫn còn nó. Hãy coi cái bí mật đó là CÔNG KHAI kể từ khoảnh khắc nó được push.</span></div>
  <div class="lz-layer"><span class="lz-lname">Quét TRƯỚC lúc commit, đừng quét sau</span><span class="lz-lnote"><code>gitleaks protect --staged</code> trong một hook pre-commit, và <code>gitleaks detect</code> trong CI làm lưới đỡ. Cái hook mới là thứ THẬT SỰ ngăn rò rỉ; job CI là thứ bắt được người vừa bỏ qua cái hook.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy cho bí mật của chính bạn một TIỀN TỐ nhận ra được</span><span class="lz-lnote">Cái <code>ct_live_</code> của Bài 1.2 chính là thứ làm cho việc phát hiện tự động khả thi. Bộ quét secret của GitHub chạy dựa trên các mẫu do nhà cung cấp đăng ký; một chuỗi 32 byte ngẫu nhiên không tiền tố thì không phân biệt nổi với mọi chuỗi base64 khác trong kho của bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>.gitignore</code> là CẦN mà chưa ĐỦ</span><span class="lz-lnote">Nó chặn <code>.env</code>, và nó không chặn <code>.env.backup</code>, <code>config.local.json</code>, một <code>docker-compose.override.yml</code> có mật khẩu viết thẳng vào, hay một fixture test mang khoá thật. Hãy ignore cái mẫu, VÀ vẫn quét.</span></div>
</div>

<h3>Gói JavaScript: một bí mật gửi tới MỌI khách truy cập</h3>
<pre><code><span class="tok-comment">// Next.js — cái TÊN BIẾN quyết định mọi thứ</span>
process.env.GIPHY_API_KEY              <span class="tok-comment">// chỉ ở server, an toàn</span>
process.env.NEXT_PUBLIC_GIPHY_API_KEY  <span class="tok-comment">// ← nướng thẳng vào gói JS</span></code></pre>
<div class="out">$ curl -s https://vidu.com/_next/static/chunks/main-a3f9e21.js | grep -o 'sk_[A-Za-z0-9]*'
sk_live_51Nx8QpRt4mZvL0…

# "NEXT_PUBLIC_" nghia la: thay the luc BUILD, gui toi MOI khach truy cap.
# Khong phai lo hong — day la hanh vi da duoc ghi ro trong tai lieu.</div>
<div class="note-ct">
<p><strong>CuongThai, 02/07/2026 — cái bộ chọn GIF chết hai lần.</strong> Phía client gọi thẳng GIPHY bằng <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, thứ được nướng vào lúc build. Khi biến đó VẮNG lúc build, mã lùi về cái khoá beta công khai từ lâu đã bị thu hồi của GIPHY và mọi request trả về 403 — một tính năng "chập chờn" suốt mấy tuần rồi đơn giản là ngừng hẳn. Cách vá mang tính CẤU TRÚC, và nó là luật chung: <strong>một khoá của bên thứ ba KHÔNG BAO GIỜ được là <code>NEXT_PUBLIC_*</code></strong>. Hãy thêm một route proxy nhỏ có xác thực ở backend (<code>src/routes/gifs.routes.ts</code> là mẫu), đọc khoá từ env lúc chạy, và việc xoay vòng nó thành một lần khởi động lại container thay vì một lần dựng lại rồi deploy lại.</p>
</div>

<h3>Bộ nhớ, và chỗ biến môi trường nhìn thấy được</h3>
<pre><code><span class="tok-comment"># Mọi thứ chạy dưới cùng người dùng đều đọc được môi trường tiến trình</span>
cat /proc/$(pgrep -f "node dist/index.js")/environ | tr '\\0' '\\n' | grep -i secret</code></pre>
<div class="out">JWT_SECRET=8f2a91c4e7b3d05a6f8e1029d4b7c3e5
LLM_GATEWAY_API_KEY=sk-…
DATABASE_URL=postgresql://postgres:…@postgres:5432/cuongthai</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Biến môi trường vẫn ổn, trong giới hạn</span><span class="lz-t">Lập trường thực dụng</span><span class="lz-d">Chúng đọc được bởi mọi tiến trình cùng người dùng, chúng hiện ra trong <code>docker inspect</code>, và chúng được tiến trình con kế thừa. Với một container một-người-thuê thì đó là ranh giới chấp nhận được — kẻ tấn công đọc được <code>/proc</code> thì vốn đã có mã của bạn rồi.</span></div>
  <div class="lz-step"><span class="lz-k">Ảnh chụp heap và core dump</span><span class="lz-t">Bản sao bị quên</span><span class="lz-d">Một bản dump lúc sập hay một file <code>--heapsnapshot-signal</code> chứa MỌI chuỗi trong bộ nhớ, kể cả mọi token từng đi qua. Nếu bạn bật chúng, hãy coi cái thư mục đầu ra đó là nơi chứa bí mật.</span></div>
  <div class="lz-step"><span class="lz-k">Trình quản bí mật giúp cho việc XOAY VÒNG</span><span class="lz-t">Không giúp chuyện ĐỌC</span><span class="lz-d">Vault hay AWS Secrets Manager chủ yếu mua cho bạn quyền truy cập có kiểm toán, tín vật ngắn hạn, và xoay vòng mà không phải deploy lại. Giá trị rốt cuộc vẫn nằm trong bộ nhớ; cái được là về VẬN HÀNH, không phải một hàng rào thần kỳ.</span></div>
  <div class="lz-step"><span class="lz-k">Env production ở đây nằm ở đâu</span><span class="lz-t">Một file, có chủ ý</span><span class="lz-d">Trên CuongThai nó là <code>/opt/cuonghoangdev/.env</code> trên VPS, được script deploy nạp vào, và rsync <em>LOẠI TRỪ</em> <code>.env*</code> nên một lần deploy không bao giờ ghi đè lên nó. Một chỗ để nhìn, một chỗ để xoay vòng, và không có đường nào để một file ở máy nhà chui được lên production.</span></div>
</div>
<div class="callout ok">
<p><strong>Bài diễn tập xoay vòng mới là phép thử THẬT.</strong> Hãy chọn cái khoá ký JWT của bạn rồi tự hỏi: từ lúc "chúng tôi tin là cái này đã rò" tới lúc "giá trị cũ trở nên vô giá trị" mất bao lâu? Nếu câu trả lời có bao gồm việc sửa tay một file trên máy chủ rồi hy vọng không có gì khác dùng nó, thì bạn KHÔNG có cơ chế xoay vòng — bạn có một dự định viết ra nó ngay giữa lúc đang sự cố. Chương 11 dựng bản có HAI khoá cùng sống một lúc, để việc chuyển đổi là một thay đổi cấu hình chứ không phải một cú chết dịch vụ.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🗝️</span><span class="lc-body"><span class="lc-title">OWASP — Quản lý bí mật</span><span class="lc-sub">cheatsheetseries.owasp.org · Cất giữ, xoay vòng, và làm gì sau một cú rò</span></span></a>
<a class="link-card" href="https://github.com/gitleaks/gitleaks" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">gitleaks</span><span class="lc-sub">github.com · Hook pre-commit và bộ quét CI, kèm luật riêng cho tiền tố của bạn</span></span></a>
<a class="link-card" href="https://getpino.io/#/docs/redaction" target="_blank" rel="noopener"><span class="lc-ico">🖊️</span><span class="lc-body"><span class="lc-title">pino — che dữ liệu</span><span class="lc-sub">getpino.io · Cú pháp đường dẫn, ký tự đại diện, và ghi chú về hiệu năng</span></span></a>
<a class="link-card" href="https://nextjs.org/docs/app/guides/environment-variables" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js — biến môi trường</span><span class="lc-sub">nextjs.org · NEXT_PUBLIC_ THẬT SỰ làm gì, nói bằng lời của chính dự án</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">/proc, môi trường tiến trình và quyền file trên máy chủ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Tìm bốn bí mật rò ra trong một app đang chạy — một trong log, một trong git, một trong gói JS, một trong URL</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 1.6 ─────────────────────────── */
    {
      title: '1.6 — Quiz: credentials and primitives|||1.6 — Quiz: tín vật và nguyên hàm',
      slug: 'auth-1-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về tín vật kiểu mang theo, entropy, so sánh thời gian hằng, băm đối lại MAC đối lại chữ ký, và chỗ bí mật rò ra mà không ai tấn công.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.6</span>
<h2>Quiz: credentials and primitives</h2>
<p class="lead">Eight questions on the foundation. Every later chapter assumes these answers, so a wrong one here is worth more attention than a wrong one in Chapter 8.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Almost every web credential is a bearer credential, so design for the copy that will exist rather than trying to prevent it (1.1). Randomness must come from a CSPRNG, and string length is not entropy (1.2). Never compare secrets with <code>===</code>, and better still, hash them and look them up (1.3). Hash proves integrity, a MAC proves origin to key holders, a signature proves origin to everyone — and sharing an HMAC key is sharing the power to issue (1.4). The leaks that actually happen need no attacker: logs, git, bundles and URLs (1.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.6</span>
<h2>Quiz: tín vật và nguyên hàm</h2>
<p class="lead">Tám câu về phần nền móng. Mọi chương sau đều GIẢ ĐỊNH những câu trả lời này, nên một câu sai ở đây đáng chú ý hơn một câu sai ở Chương 8.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Gần như mọi tín vật trên web là tín vật kiểu mang theo, nên hãy THIẾT KẾ cho cái bản sao sẽ tồn tại thay vì cố ngăn nó (1.1). Ngẫu nhiên phải tới từ một nguồn mật mã, và độ dài chuỗi KHÔNG phải entropy (1.2). Đừng bao giờ so sánh bí mật bằng <code>===</code>, và tốt hơn nữa là BĂM rồi TRA CỨU chúng (1.3). Băm chứng minh toàn vẹn, MAC chứng minh nguồn gốc với người giữ khoá, chữ ký chứng minh nguồn gốc với mọi người — và chia sẻ một khoá HMAC là chia sẻ luôn quyền PHÁT HÀNH (1.4). Những cú rò THẬT SỰ xảy ra thì chẳng cần kẻ tấn công nào: nhật ký, git, gói JS và URL (1.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does "bearer credential" mean for how you design a system?|||"Tín vật kiểu mang theo" có nghĩa gì với cách bạn thiết kế hệ thống?',
            options: [
              'That it must be encrypted before storage|||Rằng nó phải được mã hoá trước khi lưu',
              'That possession alone grants access, so you cannot prevent theft — you can only limit lifetime, limit scope, and be able to revoke|||Rằng chỉ cần SỞ HỮU là có quyền, nên bạn không ngăn được việc bị cắp — bạn chỉ giới hạn được tuổi thọ, giới hạn phạm vi, và phải THU HỒI được',
              'That only the browser can send it|||Rằng chỉ trình duyệt mới gửi được nó',
              'That it expires automatically|||Rằng nó tự động hết hạn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is a credential in a URL query string worse than one in a header?|||Vì sao một tín vật nằm trong query string của URL lại tệ hơn nằm trong header?',
            options: [
              'Query strings have a length limit|||Query string có giới hạn độ dài',
              'It ends up in browser history, the Referer header sent to third-party scripts, server and proxy access logs, and link-preview fetches|||Nó chui vào lịch sử trình duyệt, header Referer gửi cho script bên thứ ba, access log của máy chủ và proxy, và những cú tải để tạo bản xem trước liên kết',
              'Headers are encrypted and URLs are not|||Header được mã hoá còn URL thì không',
              'There is no difference over HTTPS|||Qua HTTPS thì không khác gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A session id is generated with Math.random().toString(36).slice(2). What is its effective security?|||Một mã phiên sinh bằng Math.random().toString(36).slice(2). Mức an toàn thực tế của nó là bao nhiêu?',
            options: [
              'About 56 bits, from the eleven characters|||Khoảng 56 bit, tính từ mười một ký tự',
              'Effectively zero: the generator is non-cryptographic and its internal state can be recovered from a handful of outputs, so future and past ids are computable|||Thực tế bằng KHÔNG: bộ sinh không phải mật mã và trạng thái nội tại khôi phục được từ một nhúm giá trị xuất, nên các mã trước và sau đều tính ra được',
              '128 bits, the same as a UUID|||128 bit, ngang một UUID',
              'It depends on the Node version|||Còn tuỳ phiên bản Node',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'How many random bits should a session id have?|||Một mã phiên nên có bao nhiêu bit ngẫu nhiên?',
            options: [
              '32 is plenty for a small site|||32 là thừa với một trang nhỏ',
              '64 is the floor OWASP names; 128 is the default answer and 256 costs nothing extra|||64 là cái SÀN mà OWASP nêu; 128 là câu trả lời mặc định và 256 thì cũng chẳng tốn thêm gì',
              'At least 1024, like an RSA key|||Ít nhất 1024, như một khoá RSA',
              'It only matters for admin accounts|||Chỉ quan trọng với tài khoản quản trị',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is comparing a token with === a problem, and what is the better fix than timingSafeEqual?|||Vì sao so sánh một token bằng === lại là vấn đề, và cách vá TỐT HƠN timingSafeEqual là gì?',
            options: [
              'It is case sensitive; normalise the case first|||Nó phân biệt hoa thường; hãy chuẩn hoá chữ hoa chữ thường trước',
              'It stops at the first differing byte, so the duration leaks how many leading bytes were right — and the better fix is to store a hash of the token and look it up by that, so no comparison exists in your code|||Nó dừng ở byte khác nhau đầu tiên, nên thời lượng rò ra bạn đoán trúng bao nhiêu byte đầu — và cách vá tốt hơn là CẤT một chuỗi băm của token rồi TRA CỨU theo nó, để trong mã bạn không còn phép so sánh nào',
              'It allocates memory; use Buffer instead|||Nó cấp phát bộ nhớ; hãy dùng Buffer thay thế',
              'It is fine as long as the token is long|||Không sao cả, miễn token đủ dài',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is sha256(secret + message) not a valid MAC?|||Vì sao sha256(bí_mật + thông_điệp) không phải một MAC hợp lệ?',
            options: [
              'SHA-256 is too fast|||SHA-256 quá nhanh',
              'Length extension: knowing the digest and the secret length lets an attacker append data and produce a valid digest without knowing the secret — HMAC exists to prevent exactly this|||Tấn công nối dài: biết chuỗi băm và độ dài bí mật là kẻ tấn công NỐI THÊM dữ liệu và tạo ra một chuỗi băm hợp lệ mà không cần biết bí mật — HMAC sinh ra chính là để ngăn điều đó',
              'The secret must come first|||Bí mật phải đứng trước',
              'It is valid, just slower than HMAC|||Nó hợp lệ chứ, chỉ chậm hơn HMAC thôi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Four services verify JWTs signed with HS256 and a shared secret. What is wrong?|||Bốn dịch vụ cùng xác minh JWT ký bằng HS256 với một bí mật dùng chung. Sai ở đâu?',
            options: [
              'Nothing, as long as the secret is long|||Không sai gì, miễn bí mật đủ dài',
              'HMAC uses one key to both create and verify, so every verifying service can also MINT tokens — one compromise forges system-wide admin tokens; use asymmetric signing with a published public key|||HMAC dùng MỘT khoá cho cả tạo lẫn kiểm, nên mọi dịch vụ xác minh cũng ĐÚC được token — một chỗ bị chiếm là giả mạo được token admin toàn hệ thống; hãy dùng chữ ký bất đối xứng với khoá công được công bố',
              'HS256 is deprecated|||HS256 đã lỗi thời',
              'JWTs cannot be verified by more than one service|||JWT không xác minh được bởi nhiều hơn một dịch vụ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An API key was committed to git and the commit was removed with git rm. Is the key safe?|||Một API key đã bị commit vào git rồi commit đó được gỡ bằng git rm. Cái khoá đó có an toàn không?',
            options: [
              'Yes, git rm deletes it|||Có, git rm xoá nó rồi',
              'No: it remains in history, in every clone and fork, in CI caches and in dangling commits — rotation at the provider is the only fix|||Không: nó vẫn nằm trong lịch sử, trong mọi bản clone và fork, trong cache CI và trong các commit mồ côi — XOAY VÒNG ở phía nhà cung cấp là cách chữa duy nhất',
              'Only if the repository is public|||Chỉ khi kho mã là công khai thôi',
              'Yes, after a force push|||Có, sau một lần force push',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
