/**
 * Authentication · Chương 8 · 8.3 — state, nonce và redirect_uri: ba tham số, ba cú tấn công. Slug giữ: auth-8-3-state-nonce-redirect.
 * Output thật (_ma.mjs, 81-oidc-flow): state echoed unchanged; bad_nonce; invalid_redirect_uri (HTTP 400, no redirect).
 */
import G from '../giang/auth-08-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const P = CODE.provider.split('\n');
const AUTHORIZE = P.slice(P.findIndex((l) => l.includes('authorize(client, p, userId)')), P.findIndex((l) => l.includes('async token('))).join('\n').replace(/^\s*\n/gm, '').trim();

const NGUON_EN = [
  nguon('📜', 'RFC 9700 §4 — CSRF, redirect-URI and mix-up defences', 'Why state, an exact redirect_uri and PKCE are the modern CSRF/injection defences (read 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700.html'),
  nguon('🆔', 'OpenID Connect Core §3.1.2.1 / §15.5.2 — nonce', 'The nonce binds the ID token to the client’s login request, defeating replay (read 04/11/2026).', 'https://openid.net/specs/openid-connect-core-1_0.html'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 9700 §4 — phòng CSRF, redirect-URI và mix-up', 'Vì sao state, một redirect_uri khớp chính xác và PKCE là các lớp phòng CSRF/injection hiện đại (đọc 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700.html'),
  nguon('🆔', 'OpenID Connect Core §3.1.2.1 / §15.5.2 — nonce', 'nonce gắn ID token với yêu cầu đăng nhập của client, đánh bại phát lại (đọc 04/11/2026).', 'https://openid.net/specs/openid-connect-core-1_0.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Parameter</th><th>Binds</th><th>Attack it stops</th><th>Checked by</th></tr></thead>
<tbody>
<tr><td><code>state</code></td><td>the callback to a login THIS browser started</td><td>CSRF — a login-CSRF into the attacker's account</td><td>the client</td></tr>
<tr><td><code>nonce</code></td><td>the ID token to THIS login request</td><td>ID-token replay from another session</td><td>the client (via the token)</td></tr>
<tr><td><code>redirect_uri</code></td><td>the code to a pre-registered address</td><td>code theft via open redirect</td><td>the provider (exact match)</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Tham số</th><th>Gắn</th><th>Cú tấn công nó chặn</th><th>Ai kiểm</th></tr></thead>
<tbody>
<tr><td><code>state</code></td><td>callback với một đăng nhập mà TRÌNH DUYỆT NÀY bắt đầu</td><td>CSRF — một login-CSRF vào tài khoản của kẻ tấn công</td><td>client</td></tr>
<tr><td><code>nonce</code></td><td>ID token với YÊU CẦU ĐĂNG NHẬP NÀY</td><td>phát lại ID token từ một phiên khác</td><td>client (qua token)</td></tr>
<tr><td><code>redirect_uri</code></td><td>code với một địa chỉ đã đăng ký trước</td><td>trộm code qua open redirect</td><td>provider (khớp chính xác)</td></tr>
</tbody>
</table>`;

export default {
  title: '8.3 — state, nonce and redirect_uri: three parameters, three attacks|||8.3 — state, nonce và redirect_uri: ba tham số, ba cú tấn công',
  slug: 'auth-8-3-state-nonce-redirect',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Ba tham số trông như giấy tờ sổ sách, mỗi cái là một lớp phòng. state: client tạo ngẫu nhiên, nhớ, và kiểm callback dội lại ĐÚNG cái đó — chặn CSRF đăng nhập (đăng nhập bạn vào tài khoản kẻ tấn công). nonce: client đặt trong yêu cầu authorize, provider chép vào ID token, client kiểm token mang đúng nonce nó gửi — chặn phát lại ID token. redirect_uri: provider chỉ gửi code tới một địa chỉ trong danh sách cho phép CHÍNH XÁC (không tiền tố/chuỗi con) — chặn trộm code qua open redirect, và một redirect sai KHÔNG BAO GIỜ được tự redirect tới. Đo thật trên LabFlow ID v0.8: state dội nguyên vẹn, nonce sai ⇒ bad_nonce, redirect ngoài danh sách ⇒ HTTP 400 invalid_redirect_uri (không redirect). Theo RFC 9700 §4 + OIDC Core nonce.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>state, nonce and redirect_uri: three parameters, three attacks</h2>
<p class="lead">In the authorize URL sit three parameters that look like bookkeeping and are nothing of the sort. Each one is a specific defence against a specific, named attack — and dropping any one of them opens exactly that attack. This lesson takes them one at a time, says what each binds, and shows where the check lives: two on the client, one on the provider.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> explain what <code>state</code>, <code>nonce</code> and <code>redirect_uri</code> each bind and the attack each stops; and say which side checks each — and why an invalid <code>redirect_uri</code> must never itself be redirected to.</p>
</div>

<h3>The three, at a glance</h3>
${BANG_EN}

<h3>state — CSRF on the callback</h3>
<p>The client generates a random <code>state</code>, remembers it, and when the callback arrives it checks the <code>state</code> echoed back is the <em>same</em> one. Without it, an attacker can start a login with <em>their</em> account, capture the resulting callback URL, and trick your browser into completing it — silently logging you into the attacker's account, where anything you then save is theirs to read. The demo's client rejects a callback whose <code>state</code> it never issued. Note the provider merely echoes <code>state</code> back unchanged; it is the client that stores and compares it.</p>

<h3>nonce — ID-token replay</h3>
<p>The client puts a random <code>nonce</code> in the authorize request; the provider copies it verbatim into the ID token (you saw this in the <code>authorize</code> code and the token's claims). The client then checks the token's <code>nonce</code> is the one it sent. So an ID token captured from one login cannot be replayed into another — it carries the wrong <code>nonce</code>.</p>
${ra(OUT['81-oidc-flow'])}
<p>The measured run shows all three at once: <code>state echoed unchanged ✓</code>; verifying the ID token with a different nonce returns <code>{ error: "bad_nonce" }</code>; and an off-list redirect returns <code>HTTP 400 invalid_redirect_uri</code>. (The same run also shows <code>bad_aud</code>, which belongs to lesson 8.4.)</p>

<h3>redirect_uri — code theft via open redirect</h3>
<p>The provider sends the code only to a <code>redirect_uri</code> on the client's <em>exact</em> allow-list. This is where the <code>authorize</code> code earns its keep:</p>
${ma('javascript', AUTHORIZE)}
<div class="pitfall co-tieu-de">
<p><strong>Trap — a prefix or substring match on <code>redirect_uri</code>, and redirecting an error.</strong> If you accept any URL that <em>starts with</em> your domain, <code>https://app.labflow.example.evil.com</code> passes and the code lands with the attacker. Match the full string against a registered list. And when the <code>redirect_uri</code> is invalid, respond with a <code>400</code> — do <strong>not</strong> redirect to it to report the error, or you have built the very open redirect you were trying to prevent. The demo returns <code>400 invalid_redirect_uri</code> and does not redirect.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What is <code>state</code> for?"</strong> — CSRF on the OAuth callback: the client checks the callback belongs to a login it started, so you cannot be tricked into completing the attacker's login.</li>
<li><strong>"What does <code>nonce</code> add over <code>state</code>?"</strong> — <code>nonce</code> lives <em>inside</em> the ID token, binding the token to this login so an old token cannot be replayed; <code>state</code> is only on the request/callback.</li>
<li><strong>"How should <code>redirect_uri</code> be validated?"</strong> — Exact match against a pre-registered list, and never redirect to an invalid one.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo8/oidc-flow.mjs</code>. Find the three results: <code>state</code> echoed, <code>bad_nonce</code>, <code>invalid_redirect_uri</code>. Which side produced each?</li>
<li>Change the provider to accept a <code>redirect_uri</code> that merely <em>starts with</em> the registered one. Describe the open-redirect takeover you just enabled.</li>
<li>Make the client skip the <code>state</code> check. Describe the login-CSRF that becomes possible.</li>
</ol>
<p><strong>Solution:</strong> (1) <code>state</code> and <code>bad_nonce</code> are the client's checks; <code>invalid_redirect_uri</code> is the provider's. (2) a prefix match lets <code>…evil.com</code> receive the code, handing the attacker the login. (3) without <code>state</code>, an attacker's pre-started callback can be completed by your browser, logging you into the attacker's account.</p>
<p><strong>Done when:</strong> you can name the attack each parameter stops and which side checks it.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">state</span><span class="v">A random the client ties to a login and re-checks on the callback — CSRF defence.</span></div>
  <div class="kv"><span class="k">nonce</span><span class="v">A random echoed into the ID token, binding it to this login — replay defence.</span></div>
  <div class="kv"><span class="k">redirect_uri</span><span class="v">Where the code is sent; matched exactly against a registered allow-list.</span></div>
  <div class="kv"><span class="k">login CSRF</span><span class="v">Tricking a victim's browser into completing the attacker's login.</span></div>
  <div class="kv"><span class="k">open redirect</span><span class="v">A loose redirect target that lets an attacker steer the code (or the user) elsewhere.</span></div>
  <div class="kv"><span class="k">mix-up attack</span><span class="v">Confusing which provider a response came from; exact endpoints + state defend it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>state</code> defends the callback against CSRF — the client issues and re-checks it.</li>
<li><code>nonce</code> lives in the ID token and defeats replay — the client checks it via the token.</li>
<li><code>redirect_uri</code> is matched exactly by the provider — never a prefix, never a substring.</li>
<li>An invalid <code>redirect_uri</code> returns <code>400</code> and is never redirected to.</li>
<li>Drop any one parameter and a specific, known attack opens.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-3-4-csrf', title: 'Revisit Chapter 3 — lesson 3.4: CSRF', sub: 'state is the OAuth callback’s version of the CSRF token you built for forms — same idea, a different endpoint. Each stands on its own.', cta: 'OPEN LESSON 3.4 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>state, nonce và redirect_uri: ba tham số, ba cú tấn công</h2>
<p class="lead">Trong URL authorize nằm ba tham số trông như giấy tờ sổ sách mà chẳng phải vậy chút nào. Mỗi cái là một lớp phòng cụ thể chống một cú tấn công cụ thể, có tên — và bỏ bất kỳ cái nào mở đúng cú đó. Bài này lấy từng cái một, nói mỗi cái gắn gì, và chỉ phép kiểm nằm đâu: hai ở client, một ở provider.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> giải thích <code>state</code>, <code>nonce</code> và <code>redirect_uri</code> mỗi cái gắn gì và cú tấn công mỗi cái chặn; và nói bên nào kiểm mỗi cái — và vì sao một <code>redirect_uri</code> không hợp lệ không bao giờ được tự redirect tới.</p>
</div>

<h3>Ba cái, nhìn một lượt</h3>
${BANG_VI}

<h3>state — CSRF ở callback</h3>
<p>Client tạo một <code>state</code> ngẫu nhiên, nhớ nó, và khi callback tới nó kiểm <code>state</code> dội lại là <em>cùng</em> cái đó. Không có nó, một kẻ tấn công có thể bắt đầu một đăng nhập với tài khoản của <em>hắn</em>, bắt URL callback kết quả, và lừa trình duyệt bạn hoàn tất nó — lặng lẽ đăng nhập bạn vào tài khoản kẻ tấn công, nơi bất cứ gì bạn lưu sau đó là của hắn để đọc. Client của demo từ chối một callback mà nó không hề phát <code>state</code>. Lưu ý provider chỉ dội <code>state</code> về nguyên vẹn; chính client lưu và so sánh.</p>

<h3>nonce — phát lại ID token</h3>
<p>Client đặt một <code>nonce</code> ngẫu nhiên trong yêu cầu authorize; provider chép nó nguyên văn vào ID token (bạn thấy điều này trong mã <code>authorize</code> và các claim của token). Client rồi kiểm <code>nonce</code> của token là cái nó đã gửi. Nên một ID token bắt từ một đăng nhập không phát lại được vào một đăng nhập khác — nó mang sai <code>nonce</code>.</p>
${ra(OUT['81-oidc-flow'])}
<p>Lượt chạy đo được cho thấy cả ba cùng lúc: <code>state echoed unchanged ✓</code>; xác minh ID token với một nonce khác trả về <code>{ error: "bad_nonce" }</code>; và một redirect ngoài danh sách trả về <code>HTTP 400 invalid_redirect_uri</code>. (Cùng lượt chạy cũng cho thấy <code>bad_aud</code>, thuộc về bài 8.4.)</p>

<h3>redirect_uri — trộm code qua open redirect</h3>
<p>Provider gửi code chỉ tới một <code>redirect_uri</code> trong danh sách cho phép <em>chính xác</em> của client. Đây là chỗ mã <code>authorize</code> làm tròn vai:</p>
${ma('javascript', AUTHORIZE)}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — khớp tiền tố hay chuỗi con trên <code>redirect_uri</code>, và redirect một lỗi.</strong> Nếu bạn nhận bất kỳ URL nào <em>bắt đầu bằng</em> tên miền của bạn, <code>https://app.labflow.example.evil.com</code> lọt và code rơi vào tay kẻ tấn công. Khớp cả chuỗi với một danh sách đã đăng ký. Và khi <code>redirect_uri</code> không hợp lệ, trả <code>400</code> — <strong>đừng</strong> redirect tới nó để báo lỗi, không thì bạn đã dựng đúng cái open redirect bạn định ngăn. Demo trả <code>400 invalid_redirect_uri</code> và không redirect.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"<code>state</code> để làm gì?"</strong> — CSRF ở callback OAuth: client kiểm callback thuộc về một đăng nhập nó bắt đầu, nên bạn không bị lừa hoàn tất đăng nhập của kẻ tấn công.</li>
<li><strong>"<code>nonce</code> thêm gì so với <code>state</code>?"</strong> — <code>nonce</code> sống <em>bên trong</em> ID token, gắn token với đăng nhập này nên một token cũ không phát lại được; <code>state</code> chỉ ở request/callback.</li>
<li><strong>"<code>redirect_uri</code> nên kiểm thế nào?"</strong> — Khớp chính xác với một danh sách đăng ký trước, và không bao giờ redirect tới một cái không hợp lệ.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo8/oidc-flow.mjs</code>. Tìm ba kết quả: <code>state</code> dội, <code>bad_nonce</code>, <code>invalid_redirect_uri</code>. Bên nào tạo ra mỗi cái?</li>
<li>Đổi provider để nhận một <code>redirect_uri</code> chỉ cần <em>bắt đầu bằng</em> cái đã đăng ký. Mô tả cú chiếm qua open-redirect bạn vừa bật.</li>
<li>Cho client bỏ phép kiểm <code>state</code>. Mô tả cú login-CSRF trở nên khả thi.</li>
</ol>
<p><strong>Lời giải:</strong> (1) <code>state</code> và <code>bad_nonce</code> là phép kiểm của client; <code>invalid_redirect_uri</code> là của provider. (2) một khớp tiền tố để <code>…evil.com</code> nhận code, trao kẻ tấn công cái đăng nhập. (3) không có <code>state</code>, một callback kẻ tấn công bắt đầu trước có thể bị trình duyệt bạn hoàn tất, đăng nhập bạn vào tài khoản kẻ tấn công.</p>
<p><strong>Đạt khi:</strong> bạn gọi được tên cú tấn công mỗi tham số chặn và bên nào kiểm nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">state</span><span class="v">Một ngẫu nhiên client gắn với một đăng nhập và kiểm lại ở callback — phòng CSRF.</span></div>
  <div class="kv"><span class="k">nonce</span><span class="v">Một ngẫu nhiên dội vào ID token, gắn nó với đăng nhập này — phòng phát lại.</span></div>
  <div class="kv"><span class="k">redirect_uri</span><span class="v">Nơi code được gửi; khớp chính xác với một danh sách cho phép đã đăng ký.</span></div>
  <div class="kv"><span class="k">login CSRF</span><span class="v">Lừa trình duyệt nạn nhân hoàn tất đăng nhập của kẻ tấn công.</span></div>
  <div class="kv"><span class="k">open redirect</span><span class="v">Một đích redirect lỏng để kẻ tấn công lái code (hay người dùng) đi chỗ khác.</span></div>
  <div class="kv"><span class="k">mix-up attack</span><span class="v">Lẫn phản hồi đến từ provider nào; endpoint chính xác + state phòng nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>state</code> phòng callback chống CSRF — client phát và kiểm lại.</li>
<li><code>nonce</code> sống trong ID token và đánh bại phát lại — client kiểm qua token.</li>
<li><code>redirect_uri</code> được provider khớp chính xác — không bao giờ tiền tố, không bao giờ chuỗi con.</li>
<li>Một <code>redirect_uri</code> không hợp lệ trả <code>400</code> và không bao giờ bị redirect tới.</li>
<li>Bỏ bất kỳ tham số nào và một cú tấn công cụ thể, đã biết mở ra.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-3-4-csrf', title: 'Xem lại Chương 3 — bài 3.4: CSRF', sub: 'state là phiên bản callback OAuth của token CSRF bạn dựng cho form — cùng ý, một endpoint khác. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI 3.4 →' })}
</div>
`,
};
