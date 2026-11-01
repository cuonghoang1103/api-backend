/**
 * Authentication · Chương 1 · 1.1 — Ai cầm nó, người đó LÀ bạn (tín vật kiểu bearer). Slug giữ: auth-1-1-tin-vat-mang-theo.
 * Bài đầu chương: mở bằng khối "Học xong Chương 1". Mọi code/output lấy từ ./_ma.mjs (LabFlow ID chạy thật trong env -i,
 * Node 22.23.3, Chromium 156.0.8078.4 của Playwright 1.64.1). Đính chính bản cũ: output giả (api.vidu.com) ⇒ output thật;
 * "Referer gửi URL đầy đủ cho mọi bên thứ ba" ⇒ SAI với mặc định hiện nay (strict-origin-when-cross-origin từ Chrome 85).
 */
import G from '../giang/auth-01-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const BR = CODE.bearer.split('\n');
const BR_TOKEN = BR.slice(14, 25).join('\n');
const BR_RESET = BR.slice(26, 39).join('\n');
const LOG = OUT['11-log-labflow'].split('\n');
const LOG_COPY = LOG.slice(0, 6).join('\n');
const LOG_RESET = [LOG[0], LOG[6], ...LOG.slice(6).filter((l) => /↳/.test(l))].join('\n'); // the first visit + every same-origin Referer

const NGUON_EN = [
  nguon('📄', 'RFC 6750 — Bearer Token Usage (October 2012)', '§1.2: “any party in possession of the token (a ‘bearer’) can use the token in any way…” (read 01/11/2026).', 'https://www.rfc-editor.org/rfc/rfc6750'),
  nguon('🔗', 'MDN — Referrer-Policy', 'strict-origin-when-cross-origin is the default; unsafe-url “will leak potentially-private information” (read 01/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy'),
  nguon('🌐', 'Chrome for Developers — a new default Referrer-Policy', 'Chrome 85 (stable August 2020) switched the default from no-referrer-when-downgrade (read 01/11/2026).', 'https://developer.chrome.com/blog/referrer-policy-new-chrome-default'),
  nguon('🔑', 'RFC 9449 — OAuth 2.0 Demonstrating Proof of Possession (DPoP)', 'A signed proof per request, bound to a key the client holds: a stolen token alone is not enough (read 01/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9449'),
].join('\n');
const NGUON_VI = [
  nguon('📄', 'RFC 6750 — Bearer Token Usage (10/2012)', '§1.2: “any party in possession of the token (a ‘bearer’) can use the token in any way…” — ai cầm token thì dùng được như mọi người cầm khác (đọc 01/11/2026).', 'https://www.rfc-editor.org/rfc/rfc6750'),
  nguon('🔗', 'MDN — Referrer-Policy', 'Mặc định là strict-origin-when-cross-origin; unsafe-url “có thể làm lộ thông tin riêng tư” (đọc 01/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy'),
  nguon('🌐', 'Chrome for Developers — Referrer-Policy mặc định mới', 'Chrome 85 (bản ổn định tháng 8/2020) đổi mặc định khỏi no-referrer-when-downgrade (đọc 01/11/2026).', 'https://developer.chrome.com/blog/referrer-policy-new-chrome-default'),
  nguon('🔑', 'RFC 9449 — OAuth 2.0 Demonstrating Proof of Possession (DPoP)', 'Mỗi request kèm một bằng chứng có ký, gắn với khoá client giữ: trộm token thôi là chưa đủ (đọc 01/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9449'),
].join('\n');

const POL_EN = `<table>
<thead><tr><th>Referrer-Policy on the reset page</th><th>Same-origin script got</th><th>Third-party pixel got</th></tr></thead>
<tbody>
<tr><td>(none — browser default = <code>strict-origin-when-cross-origin</code>)</td><td>full URL <strong>with the token</strong></td><td><code>http://localhost:4800/</code> — origin only</td></tr>
<tr><td><code>no-referrer-when-downgrade</code> (the default before Chrome 85)</td><td>full URL with the token</td><td><strong>full URL with the token</strong></td></tr>
<tr><td><code>unsafe-url</code></td><td>full URL with the token</td><td><strong>full URL with the token</strong></td></tr>
<tr><td><code>no-referrer</code></td><td>(none)</td><td>(none)</td></tr>
</tbody>
</table>`;
const POL_VI = `<table>
<thead><tr><th>Referrer-Policy của trang đặt lại mật khẩu</th><th>Script cùng origin nhận</th><th>Pixel bên thứ ba nhận</th></tr></thead>
<tbody>
<tr><td>(không đặt — mặc định của trình duyệt = <code>strict-origin-when-cross-origin</code>)</td><td>URL đầy đủ <strong>kèm token</strong></td><td><code>http://localhost:4800/</code> — chỉ origin</td></tr>
<tr><td><code>no-referrer-when-downgrade</code> (mặc định trước Chrome 85)</td><td>URL đầy đủ kèm token</td><td><strong>URL đầy đủ kèm token</strong></td></tr>
<tr><td><code>unsafe-url</code></td><td>URL đầy đủ kèm token</td><td><strong>URL đầy đủ kèm token</strong></td></tr>
<tr><td><code>no-referrer</code></td><td>(không có)</td><td>(không có)</td></tr>
</tbody>
</table>`;

export default {
  title: '1.1 — Whoever holds it, is you|||1.1 — Ai cầm nó, người đó LÀ bạn',
  slug: 'auth-1-1-tin-vat-mang-theo',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tín vật kiểu bearer chạy thật trên LabFlow ID: token chép sang "máy khác" vẫn là An, thêm một ký tự là 401, nhật ký máy chủ không phân biệt được; token nằm trong URL đi vào access log và Referer — đo trong Chromium 156: mặc định chỉ gửi origin sang bên thứ ba, no-referrer-when-downgrade/unsafe-url làm lộ token; thiết kế cho ngày bị lộ (TLS, tuổi thọ, phạm vi, thu hồi), kẻ tấn công thật là ai, DPoP/mTLS/passkey.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Whoever holds it, is you</h2>
<p class="lead">Section 0 ended with a server that recognises you because you bring something on every request. This chapter is about that something — the <strong>credential</strong> — and the small set of primitives every safe credential is built from: randomness, constant-time comparison, hashes, MACs and signatures, and knowing where secrets leak. It starts with the one property that decides almost everything: for a session token, an API key or a reset link, <em>presenting the value is the proof</em>.</p>

<div class="callout ok">
<p><strong>After Chapter 1 you can:</strong> generate tokens that cannot be guessed (and predict ones that can), compare secrets without leaking them, pick hash vs MAC vs signature for a job, and find the places where secrets escape without any attacker. Lab 1 turns all of it into LabFlow ID's toolkit, <code>src/crypto/</code>, graded by a script. <strong>Why it is worth it:</strong> every later chapter — passwords, sessions, JWT, refresh tokens, MFA, OAuth — is built from exactly these pieces; get them right once and the rest is assembly.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>explain what “bearer” means, show it on LabFlow ID, and say why the server cannot tell a thief from the owner;</li>
<li>trace where a token placed in a URL ends up, with the browser's real Referer behaviour;</li>
<li>design for the copy that will exist: TLS, short lifetime, narrow scope, revocation;</li>
<li>name the attackers you will actually meet, and what sender-constrained credentials (DPoP, mTLS, passkeys) change.</li>
</ul>
</div>

<h3>An everyday picture first</h3>
<p>A cinema ticket is a bearer credential. The person at the door checks that the ticket is genuine and unused — never whose pocket it came from. If you drop it and someone picks it up, they watch the film and you do not. Hotel key cards, bus passes and dormitory cards work the same way.</p>
<p>Most web credentials are cinema tickets. RFC 6750, which defines bearer tokens for OAuth, says it in one sentence: “any party in possession of the token (a ‘bearer’) can use the token in any way that any other party in possession of it can”, and using it “does not require a bearer to prove possession of cryptographic key material”.</p>

<h3>See it: one token, two machines</h3>
<p><code>demo1/bearer.js</code> is a tiny LabFlow ID: sign in with a name, receive a random token (lesson 1.2 explains <code>newToken</code>), send it back as <code>Authorization: Bearer …</code>.</p>
${ma('javascript', BR_TOKEN)}
${ra(OUT['11-an'])}
<p>Now the token is copied to a second machine — different address, different browser. One extra character at the end shows the server really checks the value:</p>
${ra(OUT['11-ke-cap'])}
${ra(LOG_COPY)}
<p>Read the server's view. The two <code>GET /me</code> lines with 200 are equally valid; they differ only in IP and user agent, and lesson 0.1 showed both are useless as identity (one address hides a whole dormitory, a phone changes address on the bus). Nothing in the protocol says which request is An. Copying a token leaves no trace and changes nothing for the owner — which is why account takeover often goes unnoticed for weeks.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Bearer</span><span class="lz-d">Session ids and cookies · JWT access tokens · refresh tokens · API keys · password-reset and magic links · OAuth access tokens · webhook secrets · a <code>DATABASE_URL</code> with its password</span></div>
  <div class="lz-layer"><span class="lz-k">Sender-constrained</span><span class="lz-d">DPoP-bound tokens (RFC 9449) · mTLS-bound tokens (RFC 8705) — the token plus a key the thief does not have</span></div>
  <div class="lz-layer"><span class="lz-k">Not a copyable secret</span><span class="lz-d">Passkeys: the private key never leaves the authenticator; what reaches the server is a fresh signature (Chapter 7)</span></div>
</div>

<h3>Design for the copy that will exist</h3>
<p>You cannot make a bearer credential unstealable. You decide how much a copy can do, for how long, and how you would stop it. Four consequences follow, and the rest of the course implements them:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · TLS everywhere</span><span class="v">Over plain HTTP every hop can read the token — staging and “internal” traffic included. Not “less secure”: published.</span></div>
  <div class="kv"><span class="k">2 · Lifetime is your main lever</span><span class="v">A stolen 15-minute access token (the number LabFlow uses, as in API Design 6.1) is an incident; a 30-day one is a breach. Short-lived needs a renewal path first — Chapter 5.</span></div>
  <div class="kv"><span class="k">3 · Scope limits the blast radius</span><span class="v">A key that can only read one user's bookings is worth far less than one that can do anything. Least privilege survives after the token leaves your control.</span></div>
  <div class="kv"><span class="k">4 · Revocation before you need it</span><span class="v">The day you learn a token leaked is the wrong day to discover there is no off switch. Sessions (Ch3) make it easy; signed tokens (Ch4–5) make it work.</span></div>
</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Created</span><span class="lz-t">on the server</span><span class="lz-d">weak randomness ⇒ guessable (1.2)</span></div>
  <div class="lz-step"><span class="lz-k">In transit</span><span class="lz-t">server → client</span><span class="lz-d">no TLS ⇒ read; in a URL ⇒ logged (this lesson)</span></div>
  <div class="lz-step"><span class="lz-k">Held by the client</span><span class="lz-t">cookie or storage</span><span class="lz-d">readable by script ⇒ one XSS (0.3, Ch3–4)</span></div>
  <div class="lz-step"><span class="lz-k">Checked</span><span class="lz-t">on the server</span><span class="lz-d">naive comparison ⇒ timing leak (1.3)</span></div>
  <div class="lz-step"><span class="lz-k">At rest</span><span class="lz-t">DB, logs, backups</span><span class="lz-d">stored raw ⇒ one dump is every session (1.3, 1.5)</span></div>
</div>

<h3>A token in a URL travels further than you think</h3>
<p>Some tokens have to travel in a link: “reset your password”, “verify your email”, “magic sign-in”. The LabFlow ID demo page <code>/reset?token=…</code> does what most real pages do — it loads its own script and a third-party analytics pixel. Real Chromium opens it four times, with four <code>Referrer-Policy</code> values:</p>
${ma('javascript', BR_RESET)}
${ra(OUT['11-referer'])}
${ra(LOG_RESET)}
${ra(OUT['11-log-third'])}
${POL_EN}
<div class="pitfall co-tieu-de">
<p><strong>Correction — “the Referer sends your token to every third-party script” is no longer true by default.</strong> Since Chrome 85 (August 2020) the default policy is <code>strict-origin-when-cross-origin</code>: the third party received only <code>http://localhost:4800/</code>. But look at what still leaked with the default: the <strong>access log</strong> recorded the full URL on every visit, and the <strong>same-origin</strong> script request carried the token in its Referer (so does any same-origin logging, analytics or error reporting you add). One header — <code>no-referrer-when-downgrade</code>, still found in old nginx snippets and some CMS defaults, or <code>unsafe-url</code> — puts the token back in front of every third party. Browser history and chat-app link previews keep their own copy too.</p>
</div>
<p>So: avoid credentials in URLs; when an email link is unavoidable, make the token single-use and short-lived, serve that page with <code>Referrer-Policy: no-referrer</code>, and exchange the token for a cookie or a POST right away (Chapter 6 builds it). Never log <code>originalUrl</code> with its query string — LabFlow ID v0.1 logs <code>req.path</code> (lesson 1.5).</p>

<h3>Who the attacker really is</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Another user of your product</span><span class="v">The most common and least dramatic: changes an id in a URL and reads someone else's data (lesson 0.2). No tools needed.</span></div>
  <div class="kv"><span class="k">A script running on your page</span><span class="v">An XSS, a compromised npm package, an analytics tag, a browser extension — it runs with your origin's authority (lesson 0.3 measured one reading <code>localStorage</code>).</span></div>
  <div class="kv"><span class="k">Someone with another site's breach list</span><span class="v">Trying millions of email/password pairs everywhere — credential stuffing, the highest-volume attack (Ch2, Ch10).</span></div>
  <div class="kv"><span class="k">A phishing page that looks like yours</span><span class="v">Relays the password and the one-time code in real time; only passkeys stop it structurally (Ch7).</span></div>
  <div class="kv"><span class="k">Whoever gets a copy of your data</span><span class="v">A leaked backup, a log archive, a misconfigured bucket — reads at leisure; the reason tokens are stored as digests (1.3) and passwords with a slow hash (Ch2).</span></div>
  <div class="kv"><span class="k">Rarely: someone breaking cryptography</span><span class="v">Nobody factors your keys. They find a token in a log, a key in git, an endpoint that forgot gate 3. Spend attention accordingly.</span></div>
</div>

<h3>The alternative: tie the token to a key</h3>
<p>A <strong>sender-constrained</strong> credential is useless without a second thing the thief does not have. <strong>DPoP</strong> (RFC 9449): each request carries a fresh proof signed by a private key the client holds; the access token is bound to that key. <strong>mTLS</strong> (RFC 8705): bound to the client's TLS certificate — great between services, heavy for browsers. <strong>Passkeys</strong> (Chapter 7) go further: there is no copyable secret at all. Bearer still dominates because it works with one header, everywhere; so design the bearer path assuming it will leak.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“What is a bearer token?”</strong> — A credential where possession is the proof (RFC 6750). So the defences are TLS, short lifetime, narrow scope and revocation, not secrecy alone.</li>
<li><strong>“Can I put the token in the query string?”</strong> — It lands in access logs, history, same-origin Referers and, under a lax policy, third-party Referers. Use a header or cookie; for email links, single-use + short expiry + <code>no-referrer</code>.</li>
<li><strong>“How would you know a token was stolen?”</strong> — Usually you would not from one request; you need lifetimes, refresh-token reuse detection (Ch5) and audit signals (Ch11).</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo1/bearer.js</code>. Sign in as An, then use the token from a second terminal with another user agent and from <code>127.0.0.1</code>. Add one character and confirm 401.</li>
<li>Run <code>node demo1/third-party.js</code> and <code>node demo1/open-reset.mjs &lt;token&gt;</code>. Count the places where the full token appeared.</li>
<li>Decide which policy the reset page should send, and justify it from the table.</li>
</ol>
<p><strong>Solution and real output</strong> (outputs above): the copied token returned <code>{"you":"An"}</code> from <code>::ffff:127.0.0.1</code> with a Firefox user agent; the token plus one character returned <code>{"error":"UNAUTHENTICATED"}</code>. The full token appeared in the access log on all four visits, in the same-origin Referer three times (all but <code>no-referrer</code>), and at the third party twice (<code>no-referrer-when-downgrade</code>, <code>unsafe-url</code>). The reset page should send <code>no-referrer</code> — the only row with no Referer anywhere.</p>
<p><strong>Done when:</strong> you can show the two indistinguishable log lines, list the leak places with numbers from your run, and explain why the browser default protects the third party but not your own logs.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">credential</span><span class="v">What a client presents as proof: password, session token, API key, signature.</span></div>
  <div class="kv"><span class="k">bearer credential</span><span class="v">Possession alone grants access; no proof of a key is needed (RFC 6750).</span></div>
  <div class="kv"><span class="k">Referer / Referrer-Policy</span><span class="v">The header telling a server which page a request came from, and the policy deciding how much of that URL is sent.</span></div>
  <div class="kv"><span class="k">blast radius</span><span class="v">How much a stolen credential can do — limited by scope and lifetime.</span></div>
  <div class="kv"><span class="k">revocation</span><span class="v">Ending a credential before it expires on its own.</span></div>
  <div class="kv"><span class="k">sender-constrained token</span><span class="v">A token usable only together with a key the client proves it holds (DPoP, mTLS).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Almost every web credential is bearer: the server cannot tell the owner from whoever holds a copy (measured: same 200, logs differ only in IP and user agent).</li>
<li>Design for leakage: TLS, short lifetime, narrow scope, a working off switch.</li>
<li>Tokens in URLs reach logs and same-origin Referers even with the browser default; a lax policy sends them to third parties.</li>
<li>The usual attacker is another user, a script on your page, a breach list or a phishing kit — rarely broken crypto.</li>
<li>DPoP, mTLS and passkeys bind the credential to a key; bearer stays the default, so assume it leaks.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Also in API Design — lesson 6.1: authentication options', sub: 'Same: LabFlow’s demo token tok_an was a pure bearer value — anyone who knew the string was An — then replaced by a 15-minute JWT. Different: that lesson chooses between sessions, JWT, API keys and OAuth for an API; this one is about the bearer property itself and where a copy travels.', cta: 'OPEN API DESIGN LESSON →' })}
<a class="link-card lien-ket-cheo" href="/courses/web-security" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Next door: the Web Security course</span><span class="lc-sub">This lesson shows why a token readable by script is one XSS away from being stolen. How XSS, CSP and clickjacking work is the subject of the Web Security course (being written).</span></span>
  <span class="lc-cta">OPEN COURSE →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Ai cầm nó, người đó LÀ bạn</h2>
<p class="lead">Mục 0 kết thúc bằng một máy chủ nhận ra bạn vì bạn mang theo một thứ ở mọi request. Chương này nói về chính thứ đó — <strong>credential (tín vật)</strong> — và một nhúm nguyên hàm mà mọi tín vật an toàn đều dựng từ chúng: độ ngẫu nhiên, so sánh hằng thời gian, băm, MAC và chữ ký, cùng việc biết bí mật rò ra ở đâu. Chương mở đầu bằng tính chất quyết định gần như mọi thứ: với token phiên, API key hay link đặt lại mật khẩu, <em>trình ra giá trị chính là bằng chứng</em>.</p>

<div class="callout ok">
<p><strong>Học xong Chương 1 bạn làm được:</strong> sinh token không ai đoán nổi (và đoán được token kém), so bí mật mà không làm rò, chọn đúng băm/MAC/chữ ký cho từng việc, và tìm ra những chỗ bí mật thoát ra mà chẳng cần kẻ tấn công. Lab 1 gom tất cả thành bộ công cụ của LabFlow ID, <code>src/crypto/</code>, có máy chấm tự động. <strong>Vì sao đáng học:</strong> mọi chương sau — mật khẩu, phiên, JWT, refresh token, MFA, OAuth — đều lắp từ đúng những mảnh này; làm đúng một lần thì phần còn lại chỉ là lắp ráp.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>giải thích "bearer" nghĩa là gì, cho thấy nó trên LabFlow ID, và nói vì sao máy chủ không phân biệt được kẻ trộm với chủ;</li>
<li>lần theo một token đặt trong URL đi tới đâu, với hành vi Referer thật của trình duyệt;</li>
<li>thiết kế cho cái bản sao chắc chắn sẽ có: TLS, tuổi thọ ngắn, phạm vi hẹp, thu hồi được;</li>
<li>gọi tên những kẻ tấn công bạn sẽ gặp thật, và tín vật ràng buộc người gửi (DPoP, mTLS, passkey) thay đổi gì.</li>
</ul>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Vé xem phim là một tín vật kiểu bearer. Người soát vé kiểm vé thật và chưa dùng — chẳng bao giờ hỏi nó từ túi ai ra. Bạn đánh rơi, người khác nhặt được, họ vào xem còn bạn thì không. Thẻ phòng khách sạn, vé xe buýt tháng, thẻ ký túc xá đều như vậy.</p>
<p>Phần lớn tín vật trên web là vé xem phim. RFC 6750, tài liệu định nghĩa bearer token cho OAuth, nói gọn một câu: "any party in possession of the token (a ‘bearer’) can use the token in any way that any other party in possession of it can" — ai đang cầm token thì dùng được y như mọi người cầm khác — và việc dùng nó "không đòi người cầm chứng minh có khoá mật mã nào".</p>

<h3>Thấy tận mắt: một token, hai máy</h3>
<p><code>demo1/bearer.js</code> là một LabFlow ID tí hon: đăng nhập bằng tên, nhận một token ngẫu nhiên (bài 1.2 giải thích <code>newToken</code>), gửi lại dưới dạng <code>Authorization: Bearer …</code>.</p>
${ma('javascript', BR_TOKEN)}
${ra(OUT['11-an'])}
<p>Giờ token được chép sang máy thứ hai — địa chỉ khác, trình duyệt khác. Thêm một ký tự vào cuối để thấy máy chủ có kiểm giá trị thật:</p>
${ra(OUT['11-ke-cap'])}
${ra(LOG_COPY)}
<p>Đọc góc nhìn của máy chủ. Hai dòng <code>GET /me</code> trả 200 hợp lệ như nhau; chúng chỉ khác IP và user agent, mà bài 0.1 đã cho thấy cả hai vô dụng để định danh (một địa chỉ giấu cả ký túc xá, điện thoại đổi địa chỉ khi lên xe buýt). Không gì trong giao thức nói request nào là An. Chép token không để lại dấu vết và chẳng đổi gì với người chủ — vì thế chiếm tài khoản thường không ai hay suốt nhiều tuần.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Bearer</span><span class="lz-d">Mã phiên và cookie · JWT access token · refresh token · API key · link đặt lại mật khẩu và magic link · OAuth access token · bí mật webhook · một <code>DATABASE_URL</code> kèm mật khẩu</span></div>
  <div class="lz-layer"><span class="lz-k">Ràng buộc người gửi</span><span class="lz-d">Token gắn DPoP (RFC 9449) · token gắn mTLS (RFC 8705) — token cộng một khoá mà kẻ trộm không có</span></div>
  <div class="lz-layer"><span class="lz-k">Không có bí mật để chép</span><span class="lz-d">Passkey: khoá riêng không bao giờ rời thiết bị xác thực; thứ tới máy chủ là một chữ ký mới (Chương 7)</span></div>
</div>

<h3>Thiết kế cho cái bản sao chắc chắn sẽ có</h3>
<p>Bạn không làm cho tín vật bearer "không thể bị trộm" được. Bạn quyết định một bản sao làm được bao nhiêu, trong bao lâu, và bạn chặn nó bằng cách nào. Bốn hệ quả sau, và phần còn lại của khoá hiện thực chúng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · TLS ở mọi nơi</span><span class="v">Qua HTTP thường, mọi chặng đều đọc được token — kể cả staging và lưu lượng "nội bộ". Không phải "kém an toàn": là công bố.</span></div>
  <div class="kv"><span class="k">2 · Tuổi thọ là đòn bẩy chính</span><span class="v">Một access token 15 phút bị trộm (con số LabFlow dùng, như API Design 6.1) là một sự cố; một token 30 ngày là một vụ lộ dữ liệu. Muốn ngắn thì phải có đường gia hạn trước — Chương 5.</span></div>
  <div class="kv"><span class="k">3 · Phạm vi giới hạn sức phá (blast radius)</span><span class="v">Một key chỉ đọc được lượt đặt của một người đáng ít hơn hẳn key làm được mọi thứ. Quyền tối thiểu còn tác dụng cả khi token đã rời tay bạn.</span></div>
  <div class="kv"><span class="k">4 · Thu hồi được trước khi cần</span><span class="v">Ngày biết token bị lộ là ngày tệ nhất để phát hiện mình không có công tắc tắt. Phiên (Ch3) làm việc này dễ; token có ký (Ch4–5) thì phải dựng.</span></div>
</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Sinh ra</span><span class="lz-t">trên máy chủ</span><span class="lz-d">ngẫu nhiên yếu ⇒ đoán được (1.2)</span></div>
  <div class="lz-step"><span class="lz-k">Trên đường đi</span><span class="lz-t">máy chủ → client</span><span class="lz-d">không TLS ⇒ bị đọc; nằm trong URL ⇒ bị ghi log (bài này)</span></div>
  <div class="lz-step"><span class="lz-k">Client giữ</span><span class="lz-t">cookie hay storage</span><span class="lz-d">script đọc được ⇒ một XSS là xong (0.3, Ch3–4)</span></div>
  <div class="lz-step"><span class="lz-k">Được kiểm</span><span class="lz-t">trên máy chủ</span><span class="lz-d">so ngây thơ ⇒ rò thời gian (1.3)</span></div>
  <div class="lz-step"><span class="lz-k">Nằm yên</span><span class="lz-t">CSDL, log, bản sao lưu</span><span class="lz-d">lưu nguyên ⇒ một bản dump là mọi phiên (1.3, 1.5)</span></div>
</div>

<h3>Token nằm trong URL đi xa hơn bạn tưởng</h3>
<p>Có những token buộc phải đi trong link: "đặt lại mật khẩu", "xác minh email", "đăng nhập không mật khẩu". Trang demo <code>/reset?token=…</code> của LabFlow ID làm đúng như đa số trang thật — tải script của chính nó và một pixel thống kê của bên thứ ba. Chromium thật mở nó bốn lần, với bốn giá trị <code>Referrer-Policy</code>:</p>
${ma('javascript', BR_RESET)}
${ra(OUT['11-referer'])}
${ra(LOG_RESET)}
${ra(OUT['11-log-third'])}
${POL_VI}
<div class="pitfall co-tieu-de">
<p><strong>Đính chính — "Referer gửi token của bạn cho mọi script bên thứ ba" không còn đúng với mặc định.</strong> Từ Chrome 85 (8/2020) chính sách mặc định là <code>strict-origin-when-cross-origin</code>: bên thứ ba chỉ nhận <code>http://localhost:4800/</code>. Nhưng nhìn xem cái gì vẫn rò với mặc định: <strong>access log</strong> ghi URL đầy đủ ở cả bốn lượt, và request script <strong>cùng origin</strong> mang token trong Referer (mọi log, thống kê, báo lỗi cùng origin bạn thêm vào cũng vậy). Chỉ một header — <code>no-referrer-when-downgrade</code>, vẫn gặp trong các đoạn cấu hình nginx cũ và mặc định của vài CMS, hoặc <code>unsafe-url</code> — là token lại tới tay mọi bên thứ ba. Lịch sử trình duyệt và bản xem trước link của ứng dụng chat cũng giữ một bản riêng.</p>
</div>
<p>Vậy: tránh đặt tín vật trong URL; khi link email là bắt buộc, cho token dùng một lần và sống ngắn, trả trang đó kèm <code>Referrer-Policy: no-referrer</code>, rồi đổi token sang cookie hay một POST ngay (Chương 6 dựng việc này). Đừng bao giờ log <code>originalUrl</code> kèm query string — LabFlow ID v0.1 log <code>req.path</code> (bài 1.5).</p>

<h3>Kẻ tấn công thật sự là ai</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Một người dùng khác của sản phẩm</span><span class="v">Phổ biến nhất và ít kịch tính nhất: đổi id trên URL rồi đọc dữ liệu người khác (bài 0.2). Chẳng cần công cụ gì.</span></div>
  <div class="kv"><span class="k">Một script chạy trên trang của bạn</span><span class="v">Một lỗ XSS, một gói npm bị chiếm, một thẻ thống kê, một tiện ích trình duyệt — chạy với toàn quyền origin của bạn (bài 0.3 đã đo một script đọc <code>localStorage</code>).</span></div>
  <div class="kv"><span class="k">Người cầm danh sách lộ từ trang khác</span><span class="v">Thử hàng triệu cặp email/mật khẩu khắp nơi — credential stuffing (nhồi tín vật), đòn có số lượng lớn nhất (Ch2, Ch10).</span></div>
  <div class="kv"><span class="k">Một trang lừa đảo giống hệt trang bạn</span><span class="v">Chuyển tiếp mật khẩu và mã một lần theo thời gian thực; chỉ passkey chặn được về mặt cấu trúc (Ch7).</span></div>
  <div class="kv"><span class="k">Ai đó có bản sao dữ liệu</span><span class="v">Bản sao lưu lộ ra, kho log, bucket cấu hình sai — đọc thong thả; đó là lý do token lưu dạng digest (1.3) và mật khẩu dùng băm chậm (Ch2).</span></div>
  <div class="kv"><span class="k">Hiếm khi: kẻ phá mật mã</span><span class="v">Chẳng ai phân tích thừa số khoá của bạn. Họ tìm token trong log, khoá trong git, endpoint quên cổng 3. Dồn sự chú ý cho đúng chỗ.</span></div>
</div>

<h3>Cách khác: buộc token vào một khoá</h3>
<p>Tín vật <strong>sender-constrained (ràng buộc người gửi)</strong> vô dụng nếu thiếu thứ thứ hai mà kẻ trộm không có. <strong>DPoP</strong> (RFC 9449): mỗi request mang một bằng chứng mới ký bằng khoá riêng client giữ; access token được gắn với khoá đó. <strong>mTLS</strong> (RFC 8705): gắn với chứng chỉ TLS của client — tốt giữa các dịch vụ, nặng với trình duyệt. <strong>Passkey</strong> (Chương 7) đi xa hơn: không có bí mật nào để chép. Bearer vẫn thống trị vì chỉ cần một header là chạy ở mọi nơi; nên hãy thiết kế đường bearer với giả định nó sẽ bị lộ.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bearer token là gì?"</strong> — Tín vật mà sở hữu chính là bằng chứng (RFC 6750). Nên lớp phòng thủ là TLS, tuổi thọ ngắn, phạm vi hẹp và thu hồi được, chứ không chỉ giữ bí mật.</li>
<li><strong>"Đặt token trong query string được không?"</strong> — Nó vào access log, lịch sử, Referer cùng origin và, với chính sách lỏng, Referer gửi bên thứ ba. Dùng header hoặc cookie; với link email: một lần + hết hạn nhanh + <code>no-referrer</code>.</li>
<li><strong>"Làm sao biết token bị trộm?"</strong> — Thường không biết được từ một request; cần tuổi thọ, phát hiện tái dùng refresh token (Ch5) và tín hiệu kiểm toán (Ch11).</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo1/bearer.js</code>. Đăng nhập bằng An, rồi dùng token từ terminal thứ hai với user agent khác và từ <code>127.0.0.1</code>. Thêm một ký tự và xác nhận 401.</li>
<li>Chạy <code>node demo1/third-party.js</code> và <code>node demo1/open-reset.mjs &lt;token&gt;</code>. Đếm những chỗ token đầy đủ xuất hiện.</li>
<li>Quyết định trang đặt lại mật khẩu nên gửi chính sách nào, và giải thích bằng bảng.</li>
</ol>
<p><strong>Lời giải và output thật</strong> (output ở trên): token chép sang trả <code>{"you":"An"}</code> từ <code>::ffff:127.0.0.1</code> với user agent Firefox; token thêm một ký tự trả <code>{"error":"UNAUTHENTICATED"}</code>. Token đầy đủ nằm trong access log ở cả bốn lượt, trong Referer cùng origin ba lần (trừ <code>no-referrer</code>), và tới bên thứ ba hai lần (<code>no-referrer-when-downgrade</code>, <code>unsafe-url</code>). Trang nên gửi <code>no-referrer</code> — dòng duy nhất không có Referer ở đâu cả.</p>
<p><strong>Đạt khi:</strong> bạn chỉ ra được hai dòng log không phân biệt được, liệt kê các chỗ rò với số đếm từ lần chạy của mình, và giải thích vì sao mặc định của trình duyệt che cho bên thứ ba mà không che cho log của chính bạn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">credential (tín vật)</span><span class="v">Thứ client trình ra làm bằng chứng: mật khẩu, token phiên, API key, chữ ký.</span></div>
  <div class="kv"><span class="k">bearer credential (tín vật kiểu "ai cầm là người đó")</span><span class="v">Chỉ cần sở hữu là có quyền; không cần chứng minh có khoá (RFC 6750).</span></div>
  <div class="kv"><span class="k">Referer / Referrer-Policy</span><span class="v">Header cho máy chủ biết request đến từ trang nào, và chính sách quyết định gửi bao nhiêu phần URL đó.</span></div>
  <div class="kv"><span class="k">blast radius (sức phá)</span><span class="v">Tín vật bị trộm làm được bao nhiêu — giới hạn bằng phạm vi và tuổi thọ.</span></div>
  <div class="kv"><span class="k">revocation (thu hồi)</span><span class="v">Chấm dứt một tín vật trước khi nó tự hết hạn.</span></div>
  <div class="kv"><span class="k">sender-constrained token (token ràng buộc người gửi)</span><span class="v">Token chỉ dùng được kèm một khoá mà client chứng minh mình giữ (DPoP, mTLS).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gần như mọi tín vật web là bearer: máy chủ không phân biệt được chủ với người cầm bản sao (đo được: cùng 200, log chỉ khác IP và user agent).</li>
<li>Thiết kế cho ngày bị lộ: TLS, tuổi thọ ngắn, phạm vi hẹp, công tắc tắt hoạt động được.</li>
<li>Token trong URL vào log và Referer cùng origin kể cả với mặc định của trình duyệt; chính sách lỏng gửi nó cho bên thứ ba.</li>
<li>Kẻ tấn công thường là người dùng khác, script trên trang, danh sách lộ hoặc bộ kit lừa đảo — hiếm khi là mật mã bị phá.</li>
<li>DPoP, mTLS và passkey buộc tín vật vào một khoá; bearer vẫn là mặc định, nên hãy giả định nó sẽ lộ.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Cũng có ở API Design — bài 6.1: các cách xác thực', sub: 'Giống: token demo tok_an của LabFlow là giá trị bearer thuần — ai biết chuỗi đó là An — rồi được thay bằng JWT 15 phút. Khác: bài đó chọn giữa phiên, JWT, API key và OAuth cho một API; bài này nói về chính tính chất bearer và bản sao đi tới đâu.', cta: 'MỞ BÀI API DESIGN →' })}
<a class="link-card lien-ket-cheo" href="/courses/web-security" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Ngay bên cạnh: khoá Web Security</span><span class="lc-sub">Bài này cho thấy vì sao một token mà script đọc được chỉ cách việc bị cắp đúng một lỗ XSS. XSS, CSP và clickjacking hoạt động thế nào là chủ đề của khoá Web Security (đang soạn).</span></span>
  <span class="lc-cta">MỞ KHOÁ →</span>
</a>
</div>
`,
};
