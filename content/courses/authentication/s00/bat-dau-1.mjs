/**
 * Authentication · Mục 0 · Bắt đầu tại đây (1/2) — auth-0-8-bat-dau-tai-day (BÀI MỚI 01/11/2026, đợt mẫu).
 * Xác thực là gì (hình ảnh đời thường trước), những cặp từ hay nhầm, lịch sử có mốc KIỂM NGUỒN (WebFetch 01/11/2026),
 * vì sao nó ra đời, giúp gì cho bạn, bản đồ khoá + dự án LabFlow ID, và "chứng minh đầu tiên" chạy thật (demo0/first-proof.mjs).
 * Code/output từ ./_ma.mjs (sinh tự động, LabFlow ID chạy trong env -i, Node 22.23.3).
 */
import G from '../giang/auth-00-8.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('🖥️', 'Wikipedia — Password', 'CTSS at MIT “was the first computer system to implement password login” (1961); Robert Morris stored Unix passwords hashed, first in 6th Edition Unix (1974); cites Morris &amp; Thompson, “Password Security: A Case History”, CACM 22(11), 1979 (read 01/11/2026).', 'https://en.wikipedia.org/wiki/Password'),
  nguon('🐕', 'Wikipedia — Kerberos', 'Developed at MIT for Project Athena from 1986; version 4 released publicly on 24 January 1989; v5 = RFC 1510 (1993) (read 01/11/2026).', 'https://en.wikipedia.org/wiki/Kerberos_(protocol)'),
  nguon('🍪', 'Wikipedia — HTTP cookie', 'Invented by Lou Montulli at Netscape in June 1994 (read 01/11/2026).', 'https://en.wikipedia.org/wiki/HTTP_cookie'),
  nguon('🔑', 'RFC 6749 — The OAuth 2.0 Authorization Framework', 'Published October 2012 (read 01/11/2026).', 'https://datatracker.ietf.org/doc/html/rfc6749'),
  nguon('🪪', 'OpenID Connect Core 1.0', 'Final specification dated February 2014 (read 01/11/2026).', 'https://openid.net/specs/openid-connect-core-1_0.html'),
  nguon('🎫', 'RFC 7519 — JSON Web Token (JWT)', 'Published May 2015 (read 01/11/2026).', 'https://datatracker.ietf.org/doc/html/rfc7519'),
  nguon('👆', 'Wikipedia — WebAuthn', 'WebAuthn Level 1 became a W3C Recommendation on 4 March 2019 (read 01/11/2026).', 'https://en.wikipedia.org/wiki/WebAuthn'),
  nguon('🤝', 'FIDO Alliance — Apple, Google and Microsoft commit to passwordless sign-in (5 May 2022)', 'The joint announcement that made “passkeys” mainstream (read 01/11/2026).', 'https://fidoalliance.org/apple-google-and-microsoft-commit-to-expanded-support-for-fido-standard-to-accelerate-availability-of-passwordless-sign-ins/'),
].join('\n');
const NGUON_VI = [
  nguon('🖥️', 'Wikipedia — Password', 'CTSS ở MIT “was the first computer system to implement password login” (1961); Robert Morris lưu mật khẩu Unix dạng băm, lần đầu ở Unix bản 6 (1974); dẫn Morris &amp; Thompson, “Password Security: A Case History”, CACM 22(11), 1979 (đọc 01/11/2026).', 'https://en.wikipedia.org/wiki/Password'),
  nguon('🐕', 'Wikipedia — Kerberos', 'Phát triển ở MIT cho Project Athena từ 1986; bản 4 công bố ngày 24/01/1989; bản 5 = RFC 1510 (1993) (đọc 01/11/2026).', 'https://en.wikipedia.org/wiki/Kerberos_(protocol)'),
  nguon('🍪', 'Wikipedia — HTTP cookie', 'Do Lou Montulli ở Netscape phát minh tháng 6/1994 (đọc 01/11/2026).', 'https://en.wikipedia.org/wiki/HTTP_cookie'),
  nguon('🔑', 'RFC 6749 — The OAuth 2.0 Authorization Framework', 'Công bố tháng 10/2012 (đọc 01/11/2026).', 'https://datatracker.ietf.org/doc/html/rfc6749'),
  nguon('🪪', 'OpenID Connect Core 1.0', 'Bản đặc tả chính thức đề ngày tháng 2/2014 (đọc 01/11/2026).', 'https://openid.net/specs/openid-connect-core-1_0.html'),
  nguon('🎫', 'RFC 7519 — JSON Web Token (JWT)', 'Công bố tháng 5/2015 (đọc 01/11/2026).', 'https://datatracker.ietf.org/doc/html/rfc7519'),
  nguon('👆', 'Wikipedia — WebAuthn', 'WebAuthn Level 1 thành W3C Recommendation ngày 04/03/2019 (đọc 01/11/2026).', 'https://en.wikipedia.org/wiki/WebAuthn'),
  nguon('🤝', 'FIDO Alliance — Apple, Google và Microsoft cam kết đăng nhập không mật khẩu (05/05/2022)', 'Thông báo chung đưa "passkey" thành phổ biến (đọc 01/11/2026).', 'https://fidoalliance.org/apple-google-and-microsoft-commit-to-expanded-support-for-fido-standard-to-accelerate-availability-of-passwordless-sign-ins/'),
].join('\n');

const TU_EN = `<table>
<thead><tr><th>Pair</th><th>The difference in one line</th></tr></thead>
<tbody>
<tr><td><strong>Identification · authentication · authorization</strong></td><td>“I am An” (a claim) · “prove it” (password, passkey) · “may An do <em>this</em>?” (per action, per resource). Lesson 0.2 runs all three.</td></tr>
<tr><td><strong>authn vs authz</strong></td><td>Short forms people write in code reviews: authn = authentication, authz = authorization.</td></tr>
<tr><td><strong>Encoding · encryption · hashing</strong></td><td>Encoding (base64) is reversible by anyone. Encryption is reversible with a key. Hashing is one-way. A JWT payload is <em>encoded</em>, not encrypted.</td></tr>
<tr><td><strong>Session vs token</strong></td><td>A session is a record on the server that a random id points to. A self-contained token (JWT) carries its own signed claims. Chapters 3 and 4.</td></tr>
<tr><td><strong>401 vs 403</strong></td><td>401: “I do not know who you are” — logging in may help. 403: “I know you, and no”.</td></tr>
<tr><td><strong>OAuth vs OpenID Connect</strong></td><td>OAuth 2.0 grants an app <em>access</em> to an API. OpenID Connect adds <em>login</em> on top: an ID token that says who the user is. Chapter 8.</td></tr>
<tr><td><strong>2FA · MFA · passkey</strong></td><td>2FA = two factors, MFA = two or more. A passkey is one credential (a key pair on your device) that already resists phishing. Chapter 7.</td></tr>
</tbody>
</table>`;
const TU_VI = `<table>
<thead><tr><th>Cặp từ</th><th>Khác nhau trong một dòng</th></tr></thead>
<tbody>
<tr><td><strong>Identification · authentication · authorization (nhận danh · xác thực · phân quyền)</strong></td><td>"Tôi là An" (một lời khai) · "chứng minh đi" (mật khẩu, passkey) · "An có được làm <em>việc này</em> không?" (theo từng hành động, từng tài nguyên). Bài 0.2 chạy cả ba.</td></tr>
<tr><td><strong>authn và authz</strong></td><td>Cách viết tắt hay gặp khi review code: authn = authentication, authz = authorization.</td></tr>
<tr><td><strong>Encoding · encryption · hashing (mã hoá ký tự · mã hoá có khoá · băm)</strong></td><td>Encoding (base64) ai cũng đảo ngược được. Encryption đảo ngược được nếu có khoá. Hashing thì một chiều. Phần payload của JWT là <em>encode</em>, không phải mã hoá.</td></tr>
<tr><td><strong>Session và token (phiên và token)</strong></td><td>Phiên là một bản ghi trên máy chủ mà một mã ngẫu nhiên trỏ tới. Token tự chứa (JWT) mang theo các claim đã ký của chính nó. Chương 3 và 4.</td></tr>
<tr><td><strong>401 và 403</strong></td><td>401: "tôi không biết bạn là ai" — đăng nhập có thể giúp. 403: "tôi biết bạn, và câu trả lời là không".</td></tr>
<tr><td><strong>OAuth và OpenID Connect</strong></td><td>OAuth 2.0 cấp cho một app <em>quyền truy cập</em> API. OpenID Connect thêm <em>đăng nhập</em> lên trên: một ID token nói người dùng là ai. Chương 8.</td></tr>
<tr><td><strong>2FA · MFA · passkey</strong></td><td>2FA = hai yếu tố, MFA = từ hai trở lên. Passkey là một tín vật (cặp khoá trên thiết bị của bạn) tự nó đã chống được lừa đảo. Chương 7.</td></tr>
</tbody>
</table>`;

const SU_EN = `<table>
<thead><tr><th>When</th><th>What happened</th><th>Why it matters to you</th></tr></thead>
<tbody>
<tr><td>1961</td><td>CTSS at MIT — the first computer system with password login</td><td>Many people share one machine ⇒ each must prove who they are</td></tr>
<tr><td>1974 · 1979</td><td>Unix stores passwords hashed (6th Edition); Morris &amp; Thompson publish “Password Security: A Case History”</td><td>Never store the password itself; add salt; make guessing slow — Chapter 2</td></tr>
<tr><td>1986 · 1989</td><td>Kerberos at MIT (Project Athena); version 4 public in January 1989</td><td>Log in once, receive a ticket, show the ticket — the idea behind sessions and tokens</td></tr>
<tr><td>June 1994</td><td>Lou Montulli invents the HTTP cookie at Netscape</td><td>The web forgets every request; a cookie is how it remembers — Chapters 0.1 and 3</td></tr>
<tr><td>Oct 2012</td><td>RFC 6749 — OAuth 2.0</td><td>“Log in with Google” and API access for apps — Chapter 8</td></tr>
<tr><td>Feb 2014</td><td>OpenID Connect Core 1.0</td><td>A standard ID token on top of OAuth — Chapter 8</td></tr>
<tr><td>May 2015</td><td>RFC 7519 — JSON Web Token</td><td>The token format you will meet in almost every job — Chapter 4</td></tr>
<tr><td>4 Mar 2019</td><td>WebAuthn Level 1 becomes a W3C Recommendation</td><td>Browsers can sign in with a key that never leaves the device — Chapter 7</td></tr>
<tr><td>5 May 2022</td><td>Apple, Google and Microsoft commit to passwordless sign-in (passkeys)</td><td>The password is finally replaceable for ordinary users — Chapter 7</td></tr>
</tbody>
</table>`;
const SU_VI = `<table>
<thead><tr><th>Khi nào</th><th>Chuyện gì</th><th>Vì sao liên quan tới bạn</th></tr></thead>
<tbody>
<tr><td>1961</td><td>CTSS ở MIT — hệ máy tính đầu tiên có đăng nhập bằng mật khẩu</td><td>Nhiều người dùng chung một máy ⇒ ai cũng phải chứng minh mình là ai</td></tr>
<tr><td>1974 · 1979</td><td>Unix lưu mật khẩu dạng băm (bản 6); Morris &amp; Thompson công bố "Password Security: A Case History"</td><td>Không bao giờ lưu chính mật khẩu; thêm muối; làm việc đoán chậm lại — Chương 2</td></tr>
<tr><td>1986 · 1989</td><td>Kerberos ở MIT (Project Athena); bản 4 công bố tháng 1/1989</td><td>Đăng nhập một lần, nhận vé, đưa vé ra — ý tưởng đứng sau phiên và token</td></tr>
<tr><td>Tháng 6/1994</td><td>Lou Montulli phát minh cookie HTTP ở Netscape</td><td>Web quên mọi request; cookie là cách nó nhớ — bài 0.1 và Chương 3</td></tr>
<tr><td>10/2012</td><td>RFC 6749 — OAuth 2.0</td><td>"Đăng nhập bằng Google" và quyền truy cập API cho app — Chương 8</td></tr>
<tr><td>2/2014</td><td>OpenID Connect Core 1.0</td><td>ID token chuẩn đặt trên OAuth — Chương 8</td></tr>
<tr><td>5/2015</td><td>RFC 7519 — JSON Web Token</td><td>Định dạng token bạn sẽ gặp ở gần như mọi công ty — Chương 4</td></tr>
<tr><td>04/03/2019</td><td>WebAuthn Level 1 thành W3C Recommendation</td><td>Trình duyệt đăng nhập được bằng một khoá không bao giờ rời thiết bị — Chương 7</td></tr>
<tr><td>05/05/2022</td><td>Apple, Google và Microsoft cam kết đăng nhập không mật khẩu (passkey)</td><td>Mật khẩu cuối cùng cũng thay được với người dùng bình thường — Chương 7</td></tr>
</tbody>
</table>`;

const MAP_EN = `<table>
<thead><tr><th>Section</th><th>The question it answers</th><th>What changes in LabFlow ID</th></tr></thead>
<tbody>
<tr><td>0</td><td>Why does the web forget you, and what does a naive login get wrong?</td><td>v0: a login that runs — and six holes</td></tr>
<tr><td>1</td><td>Which primitives does everything stand on (random tokens, constant-time compare, hash/MAC/signature, secrets)?</td><td>v0.1: toolkit <code>src/crypto/</code>, sessions stored as digests</td></tr>
<tr><td>2 · 3 · 4 · 5</td><td>How to store passwords; sessions and cookies; JWT from the inside; refresh, rotation, revocation</td><td>argon2id + PostgreSQL, cookie sessions, tokens, refresh families</td></tr>
<tr><td>6 · 7 · 8</td><td>Account lifecycle; second factor and passkeys; OAuth 2.1 / OpenID Connect</td><td>reset flow, TOTP + passkeys, LabFlow ID becomes the login provider of LabFlow API</td></tr>
<tr><td>9 · 10 · 11 · 12</td><td>Authorization models; real attacks; running it; diagnosis and the final project</td><td>roles and rules, defences tested by real attacks, audit log, v1.0</td></tr>
</tbody>
</table>`;
const MAP_VI = `<table>
<thead><tr><th>Mục</th><th>Câu hỏi được trả lời</th><th>LabFlow ID thay đổi gì</th></tr></thead>
<tbody>
<tr><td>0</td><td>Vì sao web quên bạn, và một cái đăng nhập ngây thơ sai ở đâu?</td><td>v0: đăng nhập chạy được — và sáu lỗ hổng</td></tr>
<tr><td>1</td><td>Mọi thứ đứng trên những nguyên hàm nào (token ngẫu nhiên, so hằng thời gian, băm/MAC/chữ ký, bí mật)?</td><td>v0.1: bộ công cụ <code>src/crypto/</code>, phiên lưu dạng digest</td></tr>
<tr><td>2 · 3 · 4 · 5</td><td>Lưu mật khẩu; phiên và cookie; JWT từ bên trong; refresh, xoay vòng, thu hồi</td><td>argon2id + PostgreSQL, phiên cookie, token, họ refresh</td></tr>
<tr><td>6 · 7 · 8</td><td>Vòng đời tài khoản; yếu tố thứ hai và passkey; OAuth 2.1 / OpenID Connect</td><td>luồng đặt lại mật khẩu, TOTP + passkey, LabFlow ID thành nơi đăng nhập của LabFlow API</td></tr>
<tr><td>9 · 10 · 11 · 12</td><td>Mô hình phân quyền; tấn công thật; vận hành; chẩn đoán và dự án cuối khoá</td><td>vai trò và luật, phòng thủ được thử bằng tấn công thật, nhật ký kiểm toán, v1.0</td></tr>
</tbody>
</table>`;

export default {
  title: 'Start here (1/2) — What authentication is, where it came from, and why it matters to you|||Bắt đầu tại đây (1/2) — Xác thực là gì, ra đời thế nào, và vì sao nó quan trọng với bạn',
  slug: 'auth-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài mở cửa cho người chưa từng làm đăng nhập: xác thực là gì qua hình ảnh đời thường (thẻ ký túc xá, thẻ có đóng dấu, quầy giao dịch ngân hàng), bảy cặp từ hay nhầm, lịch sử có mốc kiểm nguồn từ CTSS 1961 tới passkey 2022, vì sao nó ra đời, nó giúp gì cho đồ án/phỏng vấn/đi làm, bản đồ 13 mục + dự án LabFlow ID — và "chứng minh đầu tiên" chạy thật: thẻ đóng dấu HMAC, sửa một chữ là bị bắt.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>Before you build a login, know what you are really building</h2>
<p class="lead">Welcome. If you have only ever written a login form that compares a password with a database row, this lesson is for you. Nothing to memorise: in about thirty minutes you will know what authentication actually is, the words that trip people up, how it was invented, why every company asks about it — and you will run your first “proof” on your own machine.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>explain authentication with an everyday picture, then with the precise definition;</li>
<li>tell apart seven pairs of words that are mixed up in code reviews and interviews;</li>
<li>place passwords, cookies, Kerberos, OAuth, JWT and passkeys on a timeline — and say which problem each one solved;</li>
<li>describe the course map and the project you will build, LabFlow ID;</li>
<li>run a 12-line program that issues a stamped card and catches a forged one.</li>
</ul>
<p><strong>Why it is worth your time:</strong> every project you will build at FPT (SWP391, SEP490) and every product at work starts with “sign in”. It is also the part where a small mistake becomes a headline — the next lesson tells those stories.</p>
</div>

<h3>Everyday pictures first</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 The dorm key card</span><span class="v">The guard checked your student card <strong>once</strong>, at check-in. After that, the door opens for whoever holds the key card. That is a session: prove once, then carry something.</span></div>
  <div class="kv"><span class="k">📮 The stamped card</span><span class="v">The office writes “An — room 204” on a card and stamps it. Anyone can read the card; nobody can change it without the stamp no longer matching. That is a signed token.</span></div>
  <div class="kv"><span class="k">🏦 The bank teller</span><span class="v">The teller asks for your ID card <em>and</em> sends a code to your phone before a big transfer. Something you have plus something you know: two factors.</span></div>
</div>
<p>Now the definition, which will feel obvious: <strong>authentication is the process of proving that a claimed identity is genuine.</strong> The claim (“I am An”) is cheap — anyone can type it. The <em>proof</em> is the hard part: a secret only An knows (password), a thing only An has (phone, security key), or a key pair that lives on An's device (passkey). Once proved, the server hands back a <strong>credential</strong> — a session id or a token — that the client shows on every later request.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Identify</span><span class="lz-d">“I am an@student.labflow.example” — a claim, not proof.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Authenticate</span><span class="lz-d">Prove it: password, one-time code, passkey signature.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Carry a credential</span><span class="lz-d">A session id or a signed token, shown on every request.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Authorize</span><span class="lz-d">On each request: may An do <em>this</em>, to <em>this</em>?</span></div>
</div>

<h3>The words people mix up</h3>
${TU_EN}

<h3>A short history — with sources</h3>
<p>Every date below was checked against a primary source or an encyclopedia entry on 01/11/2026 (cards at the end). Read the right-hand column: each step was invented because the previous one failed somewhere.</p>
${SU_EN}

<h3>Why it was born, in one paragraph</h3>
<p>Authentication exists because resources are <strong>shared</strong>. One CTSS machine served many users, so each had to prove who they were. The web made it harder: HTTP was designed to forget every request (lesson 0.1), so sites had to invent a way to remember — cookies. Then apps wanted to act on your behalf without your password (OAuth), and phishing pages learned to steal passwords faster than people could learn not to type them (passkeys). The whole course follows that chain.</p>

<h3>What it does for you</h3>
<ul>
<li><strong>Your FPT projects.</strong> SWP391 and SEP490 teams build sign-in in the first sprint and copy it from a tutorial. After this course you will know what that tutorial got wrong — and the lecturer will notice.</li>
<li><strong>Interviews.</strong> “Sessions or JWT?”, “how do you store passwords?”, “how does OAuth work?”, “why not compare tokens with ==?” are standard backend questions. Each has a lesson with real measurements you can quote.</li>
<li><strong>Work.</strong> You will rarely write a crypto algorithm, but you will configure Passport, NextAuth, Spring Security or an identity provider, and debug them when users cannot log in. Knowing the mechanism is what makes that fast.</li>
</ul>

<h3>Your first proof in 10 minutes</h3>
<p>Before any theory, run the idea that half of this course stands on: the server <strong>stamps</strong> a value with a key only it knows, so the client can carry the value and the server can trust it when it comes back. Save this as <code>demo0/first-proof.mjs</code> (Node 22, no packages):</p>
${ma('javascript', CODE.firstProof)}
${ra(OUT['08-chung-minh-dau-tien'])}
<p>Read the four lines as a story. The server issues a card to An: readable text plus a 43-character stamp (an HMAC — lesson 1.4 explains it fully). An shows it back: accepted. An changes STUDENT to MANAGER: the stamp no longer fits, <code>null</code>. Bình invents a card from nothing: <code>null</code>. Nobody needed a database to decide — the stamp itself is the proof. Session cookies, signed links, webhooks and JWTs are all variations of these twelve lines.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — the stamp is not encryption.</strong> Look at the issued card: <code>user=An;role=STUDENT</code> is in plain sight. A stamp proves the value was not changed; it hides nothing. Never put a secret (a password, a phone number you must protect) inside a signed card or a JWT. Chapter 4 shows a real JWT decoded by hand in one line.</p>
</div>

<h3>The course map, and the project you will build</h3>
${MAP_EN}
<p>The project is <strong>LabFlow ID</strong>: the identity service of LabFlow, the lab-booking platform you may know from the API Design and Testing courses. Same three users — An (student), Bình (student, whose password is <code>123456</code> on purpose) and Cô Lan (lab manager). Lesson 0.3 starts it as thirty lines of Express that work and are wrong in six ways; every chapter closes one hole with code you run and attacks you run against it; Chapter 8 turns it into the login provider of LabFlow API; Chapter 12 ships version 1.0 as the final project.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“What is the difference between authentication and authorization?”</strong> — Authentication proves who you are; authorization decides what you may do. A 401 is the first failing, a 403 the second.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo0/first-proof.mjs</code> and get the same four verdicts. The key and the text are the same as ours, so even the stamp must match ours character for character — check it.</li>
<li>Write <code>demo0/th08.mjs</code>: issue a card for <code>user=Binh;role=STUDENT</code>, check it, try renaming Bình to An, then “restart the server” with a different key and check the old card.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th08)}
${ra(OUT['08-thuc-hanh'])}
<p>Renaming fails for the same reason as editing the role. The interesting line is the last one: a new key invalidates <em>every</em> old card at once. That is both a weapon (log everyone out after a leak) and a danger (a deploy that changes the key logs everyone out by accident). Chapter 11 rotates keys without that outage.</p>
<p><strong>Done when:</strong> your <code>first-proof</code> prints the same stamp as ours (same key, same text ⇒ same HMAC — determinism is the point), and you can say in one sentence why the last line of <code>th08</code> is <code>null</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">authentication (authn)</span><span class="v">Proving that a claimed identity is genuine.</span></div>
  <div class="kv"><span class="k">authorization (authz)</span><span class="v">Deciding whether an authenticated user may perform an action on a resource.</span></div>
  <div class="kv"><span class="k">credential</span><span class="v">What the client presents as proof: a password once, then a session id or a token on every request.</span></div>
  <div class="kv"><span class="k">factor</span><span class="v">A kind of proof: something you know, have, or are.</span></div>
  <div class="kv"><span class="k">HMAC stamp</span><span class="v">A tag computed from a value and a server key; changing the value breaks it. Lesson 1.4.</span></div>
  <div class="kv"><span class="k">passkey</span><span class="v">A key pair stored on your device; the server keeps only the public key. Chapter 7.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Authentication = proving a claim; the claim is cheap, the proof is the work.</li>
<li>Identify → authenticate → carry a credential → authorize on every request.</li>
<li>Seven word pairs to keep apart, starting with authn vs authz and encoding vs encryption vs hashing.</li>
<li>History is a chain of fixes: passwords (1961), hashing (1974–79), tickets (1989), cookies (1994), OAuth (2012), OIDC (2014), JWT (2015), WebAuthn (2019), passkeys (2022).</li>
<li>A server-stamped value can be carried by the client and still trusted — readable, but not changeable.</li>
</ul>
${NGUON_EN}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Trước khi làm chức năng đăng nhập, hãy biết thật ra mình đang làm gì</h2>
<p class="lead">Chào bạn. Nếu bạn mới chỉ từng viết một form đăng nhập so mật khẩu với một dòng trong cơ sở dữ liệu, bài này dành cho bạn. Không cần học thuộc: trong khoảng ba mươi phút bạn sẽ biết xác thực (authentication) thật ra là gì, những từ hay làm người ta vấp, nó được phát minh ra sao, vì sao công ty nào cũng hỏi về nó — và bạn sẽ chạy "phép chứng minh" đầu tiên trên chính máy mình.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>giải thích xác thực bằng một hình ảnh đời thường, rồi bằng định nghĩa chính xác;</li>
<li>phân biệt bảy cặp từ hay bị nhầm khi review code và khi phỏng vấn;</li>
<li>đặt mật khẩu, cookie, Kerberos, OAuth, JWT và passkey lên một trục thời gian — và nói mỗi cái giải bài toán gì;</li>
<li>mô tả bản đồ khoá học và dự án bạn sẽ xây, LabFlow ID;</li>
<li>chạy một chương trình 12 dòng phát một tấm thẻ có đóng dấu và bắt được thẻ giả.</li>
</ul>
<p><strong>Vì sao đáng thời gian của bạn:</strong> mọi đồ án bạn làm ở FPT (SWP391, SEP490) và mọi sản phẩm khi đi làm đều bắt đầu bằng "đăng nhập". Đó cũng là chỗ một lỗi nhỏ thành tin tức nóng — bài sau kể những câu chuyện đó.</p>
</div>

<h3>Hình ảnh đời thường trước đã</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Thẻ từ ký túc xá</span><span class="v">Bác bảo vệ kiểm thẻ sinh viên của bạn <strong>một lần</strong>, lúc nhận phòng. Sau đó cửa mở cho bất kỳ ai cầm thẻ từ. Đó là phiên (session): chứng minh một lần, rồi mang theo một thứ.</span></div>
  <div class="kv"><span class="k">📮 Tấm thẻ có đóng dấu</span><span class="v">Văn phòng viết "An — phòng 204" lên một tấm thẻ rồi đóng dấu. Ai cũng đọc được thẻ; không ai sửa được mà dấu vẫn khớp. Đó là token có chữ ký.</span></div>
  <div class="kv"><span class="k">🏦 Quầy giao dịch ngân hàng</span><span class="v">Giao dịch viên xin căn cước <em>và</em> gửi mã về điện thoại trước khi chuyển khoản lớn. Thứ bạn có cộng thứ bạn biết: hai yếu tố.</span></div>
</div>
<p>Giờ tới định nghĩa, và nó sẽ thấy hiển nhiên: <strong>xác thực là quá trình chứng minh một danh tính được khai ra là thật.</strong> Lời khai ("tôi là An") thì rẻ — ai cũng gõ được. Phần <em>chứng minh</em> mới khó: một bí mật chỉ An biết (mật khẩu), một thứ chỉ An có (điện thoại, khoá bảo mật), hoặc một cặp khoá nằm trên thiết bị của An (passkey). Chứng minh xong, máy chủ trả về một <strong>credential (tín vật)</strong> — mã phiên hoặc token — để client trình ra ở mọi request sau.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nhận danh</span><span class="lz-d">"Tôi là an@student.labflow.example" — một lời khai, chưa phải bằng chứng.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Xác thực</span><span class="lz-d">Chứng minh đi: mật khẩu, mã một lần, chữ ký passkey.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Mang tín vật</span><span class="lz-d">Mã phiên hoặc token có ký, trình ra ở mọi request.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Phân quyền</span><span class="lz-d">Ở từng request: An có được làm <em>việc này</em>, với <em>cái này</em>?</span></div>
</div>

<h3>Những từ hay bị nhầm</h3>
${TU_VI}

<h3>Lịch sử ngắn — có nguồn</h3>
<p>Mọi mốc dưới đây đã được đối chiếu với nguồn gốc hoặc bài bách khoa ngày 01/11/2026 (thẻ nguồn ở cuối bài). Hãy đọc cột bên phải: mỗi bước được phát minh vì bước trước hỏng ở đâu đó.</p>
${SU_VI}

<h3>Vì sao nó ra đời, trong một đoạn</h3>
<p>Xác thực tồn tại vì tài nguyên được <strong>dùng chung</strong>. Một máy CTSS phục vụ nhiều người, nên ai cũng phải chứng minh mình là ai. Web còn khó hơn: HTTP được thiết kế để quên mọi request (bài 0.1), nên các trang phải tự nghĩ cách nhớ — cookie. Rồi các app muốn thay bạn làm việc mà không cần mật khẩu của bạn (OAuth), và trang lừa đảo học cách lấy mật khẩu nhanh hơn người ta học cách đừng gõ nó (passkey). Cả khoá học đi theo đúng chuỗi đó.</p>

<h3>Nó giúp gì cho bạn</h3>
<ul>
<li><strong>Đồ án ở FPT.</strong> Nhóm SWP391 và SEP490 làm đăng nhập ngay sprint đầu và chép từ một bài hướng dẫn. Học xong khoá này bạn sẽ biết bài hướng dẫn đó sai chỗ nào — và giảng viên sẽ nhận ra.</li>
<li><strong>Phỏng vấn.</strong> "Phiên hay JWT?", "lưu mật khẩu thế nào?", "OAuth hoạt động ra sao?", "sao không so token bằng ==?" là câu hỏi backend quen thuộc. Mỗi câu có một bài với số đo thật để bạn dẫn ra.</li>
<li><strong>Đi làm.</strong> Bạn hiếm khi tự viết thuật toán mật mã, nhưng sẽ cấu hình Passport, NextAuth, Spring Security hay một nhà cung cấp danh tính, và gỡ lỗi khi người dùng không đăng nhập được. Hiểu cơ chế là thứ giúp việc đó nhanh.</li>
</ul>

<h3>Phép chứng minh đầu tiên trong 10 phút</h3>
<p>Trước mọi lý thuyết, hãy chạy cái ý tưởng mà nửa khoá học đứng trên nó: máy chủ <strong>đóng dấu</strong> một giá trị bằng một khoá chỉ mình nó biết, để client mang giá trị đi và máy chủ tin được khi nó quay về. Lưu đoạn này thành <code>demo0/first-proof.mjs</code> (Node 22, không cần gói nào):</p>
${ma('javascript', CODE.firstProof)}
${ra(OUT['08-chung-minh-dau-tien'])}
<p>Đọc bốn dòng như một câu chuyện. Máy chủ phát thẻ cho An: chữ đọc được cộng một con dấu 43 ký tự (một HMAC — bài 1.4 giải thích trọn vẹn). An trình lại: được nhận. An sửa STUDENT thành MANAGER: dấu không còn khớp, <code>null</code>. Bình tự bịa một tấm thẻ: <code>null</code>. Chẳng cần cơ sở dữ liệu để quyết định — chính con dấu là bằng chứng. Cookie phiên, đường link có ký, webhook và JWT đều là biến thể của mười hai dòng này.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — con dấu không phải là mã hoá.</strong> Nhìn tấm thẻ được phát: <code>user=An;role=STUDENT</code> nằm trơ ra đó. Con dấu chứng minh giá trị không bị sửa; nó không giấu gì cả. Đừng bao giờ đặt bí mật (mật khẩu, số điện thoại cần bảo vệ) vào một tấm thẻ có ký hay một JWT. Chương 4 giải mã một JWT thật bằng tay chỉ với một dòng.</p>
</div>

<h3>Bản đồ khoá học, và dự án bạn sẽ xây</h3>
${MAP_VI}
<p>Dự án là <strong>LabFlow ID</strong>: dịch vụ danh tính của LabFlow, nền tảng đặt phòng lab mà bạn có thể đã gặp ở khoá API Design và Testing. Vẫn ba người dùng — An (sinh viên), Bình (sinh viên, mật khẩu cố ý là <code>123456</code>) và Cô Lan (quản lý phòng lab). Bài 0.3 khởi đầu nó bằng ba mươi dòng Express chạy được mà sai sáu chỗ; mỗi chương bịt một lỗ bằng mã bạn chạy và những đòn tấn công bạn tự chạy vào nó; Chương 8 biến nó thành nơi đăng nhập của LabFlow API; Chương 12 phát hành bản 1.0 làm dự án cuối khoá.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Authentication và authorization khác nhau thế nào?"</strong> — Xác thực chứng minh bạn là ai; phân quyền quyết định bạn được làm gì. 401 là cái đầu trượt, 403 là cái sau trượt.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo0/first-proof.mjs</code> và nhận đúng bốn phán quyết như trên (khoá giống nhau nên con dấu của bạn phải khớp đúng từng ký tự với của mình — hãy kiểm).</li>
<li>Viết <code>demo0/th08.mjs</code>: phát thẻ cho <code>user=Binh;role=STUDENT</code>, kiểm nó, thử đổi tên Bình thành An, rồi "khởi động lại máy chủ" với một khoá khác và kiểm lại thẻ cũ.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th08)}
${ra(OUT['08-thuc-hanh'])}
<p>Đổi tên thất bại vì cùng lý do với sửa vai trò. Dòng đáng chú ý là dòng cuối: một khoá mới làm vô hiệu <em>mọi</em> thẻ cũ cùng lúc. Đó vừa là vũ khí (đăng xuất tất cả mọi người sau khi khoá bị lộ) vừa là mối nguy (một lần deploy đổi khoá vô tình đăng xuất cả hệ thống). Chương 11 xoay khoá mà không gây sự cố đó.</p>
<p><strong>Đạt khi:</strong> <code>first-proof</code> của bạn in đúng con dấu như của mình (cùng khoá, cùng chữ ⇒ cùng HMAC — tính tất định chính là điểm mấu chốt), và bạn nói được trong một câu vì sao dòng cuối của <code>th08</code> là <code>null</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">authentication — authn (xác thực)</span><span class="v">Chứng minh một danh tính được khai ra là thật.</span></div>
  <div class="kv"><span class="k">authorization — authz (phân quyền)</span><span class="v">Quyết định một người đã xác thực có được làm một hành động trên một tài nguyên không.</span></div>
  <div class="kv"><span class="k">credential (tín vật)</span><span class="v">Thứ client trình ra làm bằng chứng: mật khẩu một lần, rồi mã phiên hoặc token ở mọi request.</span></div>
  <div class="kv"><span class="k">factor (yếu tố)</span><span class="v">Một loại bằng chứng: thứ bạn biết, thứ bạn có, hoặc thứ bạn là.</span></div>
  <div class="kv"><span class="k">HMAC stamp (con dấu HMAC)</span><span class="v">Một thẻ tính từ giá trị và khoá của máy chủ; sửa giá trị là thẻ hỏng. Bài 1.4.</span></div>
  <div class="kv"><span class="k">passkey</span><span class="v">Một cặp khoá lưu trên thiết bị của bạn; máy chủ chỉ giữ khoá công khai. Chương 7.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xác thực = chứng minh một lời khai; lời khai thì rẻ, bằng chứng mới là việc.</li>
<li>Nhận danh → xác thực → mang tín vật → phân quyền ở mọi request.</li>
<li>Bảy cặp từ cần tách bạch, bắt đầu từ authn và authz, encoding, encryption và hashing.</li>
<li>Lịch sử là một chuỗi bản vá: mật khẩu (1961), băm (1974–79), vé (1989), cookie (1994), OAuth (2012), OIDC (2014), JWT (2015), WebAuthn (2019), passkey (2022).</li>
<li>Một giá trị do máy chủ đóng dấu có thể để client mang đi mà vẫn tin được — đọc được, nhưng không sửa được.</li>
</ul>
${NGUON_VI}
</div>
`,
};
