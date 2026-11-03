/**
 * Bài 7.3 — JWT (nâng cấp 02/11/2026). Output thật: _demo/_t7/jwt-tay.mjs (Node 22: tự ký HS256 bằng node:crypto, đọc payload không
 * cần khoá, sửa role ⇒ bad signature, alg none bị từ chối, hết hạn; jsonwebtoken ký ra đúng cùng chuỗi; API Bearer: token vẫn chạy
 * sau "đăng xuất"). Đồng hồ cố định ⇒ output lặp lại y hệt. Deck: scripts/slides-src/wf-7-3.mjs (9 slide, WF/v1/wf-7-3).
 * Code Lab: wf-7-3-jwt.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

/** Lấy các dòng [từ, tới] (1-based) của một output. */
const dong = (key, a, b) => OUT[key].split('\n').slice(a - 1, b).join('\n');

const G = walkWf('wf-7-3', 'JSON Web Tokens', 'JSON Web Token', [
  [1, 'JSON Web Tokens',
    '<p>A session keeps the truth on the server. A JSON Web Token turns that around: the server writes who you are into a small document, signs it, and gives it to you. Any server that knows the secret can check it without looking anything up. This lesson builds one by hand, attacks it, and shows its biggest weakness.</p>',
    '<p>Phiên giữ sự thật trên máy chủ. JSON Web Token làm ngược lại: máy chủ viết bạn là ai vào một văn bản nhỏ, ký lên nó, rồi đưa cho bạn. Máy chủ nào biết khoá bí mật đều kiểm được nó mà không cần tra cứu gì. Bài này tự dựng một token bằng tay, tấn công nó, và chỉ ra điểm yếu lớn nhất của nó.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to read the three parts of any JWT, explain exactly what the signature protects and what it does not hide, verify a token correctly, recognise the classic attacks — a changed payload and "alg none" — and decide between sessions and tokens for a project.</p>',
    '<p>Bạn sẽ đọc được ba phần của mọi JWT, giải thích chính xác chữ ký bảo vệ gì và không che giấu gì, kiểm một token cho đúng, nhận ra các đòn kinh điển — sửa payload và "alg none" — và chọn giữa phiên và token cho một dự án.</p>'],
  [3, 'Three parts, two dots',
    '<p>A JWT is three Base64URL strings joined by dots: a header naming the algorithm, a payload with the claims — who, which role, when it expires — and a signature. Our token is 176 characters; the session id in Lesson 7.2 was 43.</p>',
    '<p>JWT là ba chuỗi Base64URL nối bằng dấu chấm: header ghi thuật toán, payload chứa các claim — là ai, vai trò gì, khi nào hết hạn — và chữ ký. Token của ta dài 176 ký tự; id phiên ở Bài 7.2 là 43.</p>'],
  [4, 'Anyone can read it',
    '<p>Decoding the middle part needs no secret at all: one line printed the user\'s id, name, role and expiry. A JWT is signed, not encrypted. Never put a password, a card number or anything private in it.</p>',
    '<p>Giải mã phần giữa không cần khoá nào: một dòng in ra id, tên, vai trò và thời hạn của người dùng. JWT được ký, không được mã hoá. Đừng bao giờ đặt mật khẩu, số thẻ hay bất cứ gì riêng tư vào đó.</p>'],
  [5, 'The signature catches changes',
    '<p>The signature is an HMAC of header and payload computed with the server\'s secret. We changed the role to admin and kept the old signature: rejected. We switched the algorithm to none: rejected. Sixteen minutes later the token had expired: rejected.</p>',
    '<p>Chữ ký là một HMAC của header và payload tính bằng khoá bí mật của máy chủ. Ta đổi vai trò thành admin và giữ chữ ký cũ: bị từ chối. Ta đổi thuật toán thành none: bị từ chối. Mười sáu phút sau token đã hết hạn: bị từ chối.</p>'],
  [6, 'The library does the same',
    '<p>The jsonwebtoken package produced exactly the same string as our twenty lines, and raised "invalid signature" for the forged token. Using the library is right; knowing what it does lets you configure it safely — especially the list of allowed algorithms.</p>',
    '<p>Gói jsonwebtoken tạo ra đúng cùng chuỗi với hai mươi dòng của ta, và báo "invalid signature" cho token giả. Dùng thư viện là đúng; hiểu nó làm gì giúp bạn cấu hình an toàn — nhất là danh sách thuật toán được phép.</p>'],
  [7, 'Bearer, and the logout problem',
    '<p>The client sends the token in an Authorization Bearer header. No header: 401. Valid: 200. Forged: 401. But after the user clicked "Log out", a copied token still got 200: the server keeps no record it could delete. It stays valid until it expires.</p>',
    '<p>Client gửi token trong header Authorization Bearer. Không có header: 401. Hợp lệ: 200. Giả: 401. Nhưng sau khi người dùng bấm "Đăng xuất", một token đã bị chép vẫn nhận 200: máy chủ không giữ bản ghi nào để xoá. Nó còn hiệu lực tới khi hết hạn.</p>'],
  [8, 'Sessions or tokens?',
    '<p>Sessions are simple, revocable at once and pair well with HttpOnly cookies — the right default for a website. Tokens shine when many services or mobile apps must verify identity without a shared store. Real systems often combine short-lived access tokens with a revocable refresh token.</p>',
    '<p>Phiên đơn giản, thu hồi được ngay và đi tốt với cookie HttpOnly — mặc định đúng cho website. Token tỏa sáng khi nhiều dịch vụ hay app di động phải kiểm danh tính mà không có kho chung. Hệ thống thật thường kết hợp access token ngắn hạn với một refresh token thu hồi được.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to decode a token in the browser console, break its signature on purpose, and add an expiry check to a small API. "Done when" checks a 401 for every forged or expired token and a 200 for the real one.</p>',
    '<p>Bài luyện yêu cầu bạn giải mã một token trong console trình duyệt, cố ý làm hỏng chữ ký, và thêm phép kiểm hết hạn vào một API nhỏ. "Xong khi" kiểm 401 cho mọi token giả hoặc hết hạn và 200 cho token thật.</p>'],
]);

export default {
  title: '7.3 — JWT: tokens that prove themselves|||7.3 — JWT: token tự chứng minh',
  slug: 'wf-7-3-jwt',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/7Q17ubqLfaM', durationSeconds: 0 },
  description: 'Tự dựng JWT HS256 bằng node:crypto (output thật, đồng hồ cố định): ba phần, payload ai cũng đọc được, sửa role ⇒ bad signature, alg none bị từ chối, hết hạn; jsonwebtoken ký ra đúng cùng chuỗi; Authorization: Bearer với API thật (401/200/401) và token vẫn chạy sau "đăng xuất"; phiên hay token, access + refresh, lưu token ở đâu.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>A token that carries its own proof</h2>
<p class="lead">After this lesson you can take any JSON Web Token apart and read it, explain what its signature guarantees (it was not changed) and what it does not (secrecy), verify one correctly — fixed algorithm, signature, expiry — recognise the classic forgeries, and choose between sessions and tokens with your eyes open, including the one thing tokens cannot do: log someone out immediately. You will meet JWTs in almost every API tutorial, in Next.js auth libraries and in mobile apps; after this lesson they are no longer magic strings.</p>

<h3>Step 1 — three parts, two dots</h3>
<p>We built a token by hand in Node with nothing but <code>node:crypto</code> (the clock is fixed so the output is identical on every run):</p>
${ra(dong('_t7/out/jwt-tay', 1, 5))}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Header</span><span class="lz-t">{"alg":"HS256","typ":"JWT"}</span><span class="lz-d">Which algorithm signed it. HS256 = HMAC with SHA-256 and one shared secret.</span></div>
<div class="lz-layer"><span class="lz-k">Payload</span><span class="lz-t">the claims</span><span class="lz-d"><code>sub</code> (subject: the user id), your own fields (<code>name</code>, <code>role</code>), <code>iat</code> (issued at) and <code>exp</code> (expires) in seconds since 1970.</span></div>
<div class="lz-layer"><span class="lz-k">Signature</span><span class="lz-t">HMAC(header.payload, secret)</span><span class="lz-d">Only someone with the secret can produce it; any change to the first two parts makes it wrong.</span></div>
</div>
<p>Each part is <strong>Base64URL</strong>: Base64 with <code>-</code> and <code>_</code> instead of <code>+</code> and <code>/</code>, and no <code>=</code> padding, so the token is safe in URLs and headers.</p>

<h3>Step 2 — anyone can read it</h3>
${ra(dong('_t7/out/jwt-tay', 7, 7))}
<p>No secret was needed. Paste any JWT into the browser console as <code>JSON.parse(atob(token.split('.')[1]))</code> and you will read it too. The signature protects the token from being <em>changed</em>, not from being <em>read</em>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — putting secrets in the payload.</strong> Email addresses, phone numbers, internal ids, "isPremium", even password hashes have all been found in production JWTs, readable by anyone who sees the token: the user, a browser extension, a log file, a proxy. Keep the payload to what the API needs to identify and authorize the caller — usually an id, a role and the expiry.</p></div>

<h3>Step 3 — how the token is made and checked</h3>
${ma('javascript', CODE['_t7/jwt-tay.mjs'], [13, 32])}
${ra(dong('_t7/out/jwt-tay', 9, 12))}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Fix the algorithm</span><span class="lz-d">Accept only the one you issue (<code>HS256</code>). Never let the token choose — that is the <code>alg: none</code> forgery above.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Recompute the signature</span><span class="lz-d">From header + payload + your secret, compare with <code>timingSafeEqual</code>. Mismatch ⇒ 401. Changing <code>role</code> to <code>admin</code> failed here.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Check exp</span><span class="lz-d">After the expiry ⇒ 401, even with a perfect signature.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Then authorize</span><span class="lz-d">Only now trust <code>sub</code> and <code>role</code> — and still check ownership per resource.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — a weak or committed secret.</strong> With HS256, whoever knows the secret can mint a token for any user with any role. A short secret like <code>secret123</code> can be brute-forced offline from one captured token; a secret committed to GitHub is public. Generate at least 32 random bytes (<code>node -e "console.log(crypto.randomBytes(32).toString('base64url'))"</code>), keep it in an environment variable (Lesson 14.2), and rotate it if it leaks — which logs everyone out.</p></div>

<h3>Step 4 — the library does exactly this</h3>
${ra(dong('_t7/out/jwt-tay', 14, 16))}
<p>The popular <code>jsonwebtoken</code> package produced the <em>same string</em> as our twenty lines and rejected the forged token with <code>invalid signature</code>. In a real project you use the library; knowing what it does tells you which options matter: always pass <code>algorithms: ['HS256']</code> to <code>verify</code>, and always set <code>expiresIn</code> when you sign.</p>

<h3>Step 5 — sending it: <code>Authorization: Bearer</code></h3>
${ra(dong('_t7/out/jwt-tay', 18, 21))}
<p>"Bearer" means "whoever bears (carries) this token is the user" — so a stolen token is as good as a password until it expires. The first three lines are the expected 401/200/401. The last line is the important one: the user clicked "Log out", the app deleted its copy, but a token copied earlier still worked. The server keeps no record, so it has nothing to delete.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Short expiry</span><span class="v">Access tokens of 5–15 minutes limit the damage window.</span></div>
  <div class="kv"><span class="k">Refresh token</span><span class="v">A long-lived token kept in an HttpOnly cookie and stored server-side, used only to get new access tokens — revoking it ends the login.</span></div>
  <div class="kv"><span class="k">Deny list</span><span class="v">Store revoked token ids (<code>jti</code>) until they expire — which brings back a server lookup.</span></div>
  <div class="kv"><span class="k">Or use sessions</span><span class="v">If you need instant logout everywhere, a session is the simpler answer.</span></div>
</div>

<h3>Step 6 — sessions or tokens?</h3>
<table>
<thead><tr><th></th><th>Session (7.2)</th><th>JWT (7.3)</th></tr></thead>
<tbody>
<tr><td>Where the truth lives</td><td>Server (memory, Redis, database)</td><td>Inside the token</td></tr>
<tr><td>Each request</td><td>One lookup</td><td>Verify a signature, no lookup</td></tr>
<tr><td>Log out now / ban a user</td><td>Delete the record — instant</td><td>Wait for expiry, or add a deny list</td></tr>
<tr><td>Size on every request</td><td>~43 characters</td><td>~150–1000 characters</td></tr>
<tr><td>Several services / mobile apps</td><td>Need a shared session store</td><td>Any service with the key can verify</td></tr>
<tr><td>Good default for</td><td>Websites, admin panels</td><td>APIs used by many clients, service-to-service</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — choosing JWT "because it is modern" and storing it in <code>localStorage</code>.</strong> This combines two weaknesses: the token can be read by any script on the page (Lesson 7.2's XSS demo) and cannot be revoked until it expires. If a browser is your only client, an HttpOnly session cookie is simpler and safer. If you do use JWTs in a browser, keep the access token in memory and the refresh token in an HttpOnly cookie.</p></div>

<h3>Step 7 — where each kind of client keeps its token</h3>
<table>
<thead><tr><th>Client</th><th>Access token</th><th>Refresh token / long-lived secret</th></tr></thead>
<tbody>
<tr><td>Website (browser)</td><td>A JavaScript variable (memory), lost on reload</td><td>HttpOnly, Secure, SameSite cookie — or skip tokens and use a session</td></tr>
<tr><td>Mobile app</td><td>Memory</td><td>The phone's secure store (Keychain on iOS, Keystore on Android)</td></tr>
<tr><td>Server calling an API</td><td>Memory, requested at start-up</td><td>An environment variable on the server (Lesson 14.2), never in Git</td></tr>
<tr><td>Command-line tool</td><td>A config file readable only by the user</td><td>The OS credential store when available</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — decode, forge, verify</strong></p>
<ol>
<li>In the browser console, paste the token from Step 1 into <code>const t = '…'</code> and run <code>JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))</code>.</li>
<li>Copy <code>jwt-tay.mjs</code> (Step 3 shows its core) and run it from a folder where you ran <code>npm i jsonwebtoken</code>.</li>
<li>Change one character of the signature and verify: what is the reason? Change <code>exp</code> to <code>NOW - 1</code> and verify again.</li>
<li>Add a <code>requireRole(token, role)</code> function returning 401, 403 or 200, using <code>verifyToken</code>.</li>
<li>Replace the secret with <code>'secret'</code> and think: how long would a laptop doing millions of HMACs per second need to guess it?</li>
</ol>
<p>Hint: <code>atob</code> needs standard Base64, hence the two <code>replace</code> calls; Node's <code>Buffer.from(x, 'base64url')</code> does it for you.</p>
<p><strong>Done when:</strong> the console prints <code>{ sub: '1', name: 'An', role: 'user', … }</code>; a changed signature gives <code>bad signature</code> and an old <code>exp</code> gives <code>expired</code>; <code>requireRole(token, 'admin')</code> returns 403 for An's token and 401 for a forged one. Then Code Lab module 7.3.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JWT</span><span class="v">JSON Web Token — token tự mang thông tin và chữ ký.</span></div>
  <div class="kv"><span class="k">claim</span><span class="v">khẳng định trong payload — sub, role, exp…</span></div>
  <div class="kv"><span class="k">Base64URL</span><span class="v">Base64 an toàn cho URL — không phải mã hoá.</span></div>
  <div class="kv"><span class="k">HMAC / HS256</span><span class="v">chữ ký bằng khoá bí mật chung.</span></div>
  <div class="kv"><span class="k">signed vs encrypted</span><span class="v">đã ký (không sửa được) và đã mã hoá (không đọc được).</span></div>
  <div class="kv"><span class="k">exp / iat</span><span class="v">thời điểm hết hạn / thời điểm cấp.</span></div>
  <div class="kv"><span class="k">bearer</span><span class="v">người mang — ai cầm token là người đó.</span></div>
  <div class="kv"><span class="k">access / refresh token</span><span class="v">token truy cập ngắn hạn / token làm mới dài hạn.</span></div>
  <div class="kv"><span class="k">revocation</span><span class="v">thu hồi — làm token mất hiệu lực sớm.</span></div>
  <div class="kv"><span class="k">alg none attack</span><span class="v">đòn bỏ chữ ký bằng cách khai thuật toán none.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A JWT = header.payload.signature, each Base64URL; anyone can read the payload.</li>
  <li>The signature (HMAC with the server's secret) proves the token was not changed.</li>
  <li>Verify in order: fixed algorithm → signature → expiry → then authorize.</li>
  <li>Changed payloads, <code>alg: none</code> and expired tokens must all give 401.</li>
  <li>Bearer tokens cannot be logged out instantly: keep them short and pair them with a revocable refresh token.</li>
  <li>For a browser-only website, an HttpOnly session cookie is usually the simpler, safer choice.</li>
</ul>
${nguon('📗', 'RFC 7519 — JSON Web Token', 'The standard: structure and registered claims', 'https://www.rfc-editor.org/rfc/rfc7519')}
${nguon('📘', 'OWASP — JSON Web Token Cheat Sheet', 'alg none, weak secrets, revocation and storage', 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html')}
${lienKet({ khoa: 'authentication', bai: 'auth-4-1-giai-ma-bang-tay', title: 'Authentication 4.1 — Decoding a JWT by hand', sub: 'Deeper: claims, keys, JWKS and where to store tokens', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Một token tự mang bằng chứng của nó</h2>
<p class="lead">Học xong bài này bạn tháo rời và đọc được mọi JSON Web Token, giải thích chữ ký của nó bảo đảm điều gì (không bị sửa) và không bảo đảm điều gì (bí mật), kiểm một token cho đúng — cố định thuật toán, chữ ký, thời hạn — nhận ra các đòn giả mạo kinh điển, và chọn giữa phiên và token một cách tỉnh táo, kể cả điều duy nhất token không làm được: đăng xuất ai đó ngay lập tức. Bạn sẽ gặp JWT ở gần như mọi hướng dẫn API, trong thư viện xác thực của Next.js và trong app di động; học xong bài này chúng không còn là chuỗi ma thuật nữa.</p>

<h3>Bước 1 — ba phần, hai dấu chấm</h3>
<p>Ta tự dựng một token bằng tay trong Node chỉ với <code>node:crypto</code> (đồng hồ được cố định nên output y hệt mỗi lần chạy):</p>
${ra(dong('_t7/out/jwt-tay', 1, 5))}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Header</span><span class="lz-t">{"alg":"HS256","typ":"JWT"}</span><span class="lz-d">Thuật toán nào đã ký. HS256 = HMAC với SHA-256 và một khoá bí mật dùng chung.</span></div>
<div class="lz-layer"><span class="lz-k">Payload</span><span class="lz-t">các claim</span><span class="lz-d"><code>sub</code> (chủ thể: id người dùng), trường của bạn (<code>name</code>, <code>role</code>), <code>iat</code> (lúc cấp) và <code>exp</code> (lúc hết hạn) tính bằng giây từ 1970.</span></div>
<div class="lz-layer"><span class="lz-k">Chữ ký</span><span class="lz-t">HMAC(header.payload, khoá)</span><span class="lz-d">Chỉ người có khoá mới tạo được; mọi thay đổi ở hai phần đầu đều làm nó sai.</span></div>
</div>
<p>Mỗi phần là <strong>Base64URL</strong>: Base64 dùng <code>-</code> và <code>_</code> thay cho <code>+</code> và <code>/</code>, không có dấu <code>=</code> đệm, để token an toàn trong URL và header.</p>

<h3>Bước 2 — ai cũng đọc được</h3>
${ra(dong('_t7/out/jwt-tay', 7, 7))}
<p>Không cần khoá nào. Dán bất kỳ JWT nào vào console trình duyệt dưới dạng <code>JSON.parse(atob(token.split('.')[1]))</code> là bạn cũng đọc được. Chữ ký bảo vệ token khỏi bị <em>sửa</em>, không khỏi bị <em>đọc</em>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đặt bí mật vào payload.</strong> Email, số điện thoại, id nội bộ, "isPremium", thậm chí hash mật khẩu đều từng bị tìm thấy trong JWT ở production, đọc được bởi bất kỳ ai thấy token: chính người dùng, một tiện ích trình duyệt, một tệp log, một proxy. Chỉ giữ trong payload thứ API cần để nhận diện và phân quyền người gọi — thường là id, vai trò và thời hạn.</p></div>

<h3>Bước 3 — token được tạo và kiểm thế nào</h3>
${ma('javascript', CODE['_t7/jwt-tay.mjs'], [13, 32])}
${ra(dong('_t7/out/jwt-tay', 9, 12))}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cố định thuật toán</span><span class="lz-d">Chỉ nhận đúng thuật toán bạn dùng để cấp (<code>HS256</code>). Đừng để token tự chọn — đó là đòn <code>alg: none</code> ở trên.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tính lại chữ ký</span><span class="lz-d">Từ header + payload + khoá của bạn, so bằng <code>timingSafeEqual</code>. Không khớp ⇒ 401. Đổi <code>role</code> thành <code>admin</code> hỏng ở đây.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểm exp</span><span class="lz-d">Quá hạn ⇒ 401, dù chữ ký hoàn hảo.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Rồi mới phân quyền</span><span class="lz-d">Chỉ lúc này mới tin <code>sub</code> và <code>role</code> — và vẫn kiểm quyền sở hữu từng tài nguyên.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — khoá yếu hoặc bị commit.</strong> Với HS256, ai biết khoá là đúc được token cho bất kỳ người dùng nào với bất kỳ vai trò nào. Một khoá ngắn như <code>secret123</code> có thể bị dò ngoại tuyến từ một token bắt được; một khoá commit lên GitHub là công khai. Hãy sinh ít nhất 32 byte ngẫu nhiên (<code>node -e "console.log(crypto.randomBytes(32).toString('base64url'))"</code>), giữ trong biến môi trường (Bài 14.2), và thay nếu bị lộ — việc đó đăng xuất tất cả mọi người.</p></div>

<h3>Bước 4 — thư viện làm đúng việc này</h3>
${ra(dong('_t7/out/jwt-tay', 14, 16))}
<p>Gói phổ biến <code>jsonwebtoken</code> tạo ra <em>đúng cùng chuỗi</em> với hai mươi dòng của ta và từ chối token giả với <code>invalid signature</code>. Trong dự án thật bạn dùng thư viện; hiểu nó làm gì cho biết tuỳ chọn nào quan trọng: luôn truyền <code>algorithms: ['HS256']</code> cho <code>verify</code>, và luôn đặt <code>expiresIn</code> khi ký.</p>

<h3>Bước 5 — gửi nó đi: <code>Authorization: Bearer</code></h3>
${ra(dong('_t7/out/jwt-tay', 18, 21))}
<p>"Bearer" nghĩa là "ai mang (cầm) token này thì là người dùng" — nên token bị trộm có giá trị như mật khẩu cho tới khi hết hạn. Ba dòng đầu là 401/200/401 như mong đợi. Dòng cuối mới quan trọng: người dùng đã bấm "Đăng xuất", app đã xoá bản của nó, nhưng một token đã bị chép từ trước vẫn chạy. Máy chủ không giữ bản ghi nào, nên chẳng có gì để xoá.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Hạn ngắn</span><span class="v">Access token 5–15 phút thu hẹp khoảng thời gian bị hại.</span></div>
  <div class="kv"><span class="k">Refresh token</span><span class="v">Một token sống lâu giữ trong cookie HttpOnly và lưu ở máy chủ, chỉ dùng để lấy access token mới — thu hồi nó là kết thúc đăng nhập.</span></div>
  <div class="kv"><span class="k">Danh sách chặn</span><span class="v">Lưu id các token bị thu hồi (<code>jti</code>) tới khi chúng hết hạn — tức là quay lại tra cứu trên máy chủ.</span></div>
  <div class="kv"><span class="k">Hoặc dùng phiên</span><span class="v">Nếu cần đăng xuất ngay ở mọi nơi, phiên là câu trả lời đơn giản hơn.</span></div>
</div>

<h3>Bước 6 — phiên hay token?</h3>
<table>
<thead><tr><th></th><th>Phiên (7.2)</th><th>JWT (7.3)</th></tr></thead>
<tbody>
<tr><td>Sự thật nằm ở</td><td>Máy chủ (bộ nhớ, Redis, cơ sở dữ liệu)</td><td>Bên trong token</td></tr>
<tr><td>Mỗi request</td><td>Một lần tra cứu</td><td>Kiểm chữ ký, không tra cứu</td></tr>
<tr><td>Đăng xuất ngay / khoá người dùng</td><td>Xoá bản ghi — tức thì</td><td>Chờ hết hạn, hoặc thêm danh sách chặn</td></tr>
<tr><td>Kích thước ở mọi request</td><td>~43 ký tự</td><td>~150–1000 ký tự</td></tr>
<tr><td>Nhiều dịch vụ / app di động</td><td>Cần kho phiên dùng chung</td><td>Dịch vụ nào có khoá cũng kiểm được</td></tr>
<tr><td>Mặc định tốt cho</td><td>Website, trang quản trị</td><td>API dùng bởi nhiều client, dịch vụ gọi dịch vụ</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chọn JWT "vì nó hiện đại" rồi cất trong <code>localStorage</code>.</strong> Cách này gộp hai điểm yếu: script nào trên trang cũng đọc được token (bản demo XSS ở Bài 7.2) và không thu hồi được nó trước khi hết hạn. Nếu trình duyệt là client duy nhất, cookie phiên HttpOnly đơn giản và an toàn hơn. Nếu vẫn dùng JWT trong trình duyệt, giữ access token trong bộ nhớ và refresh token trong cookie HttpOnly.</p></div>

<h3>Bước 7 — mỗi loại client giữ token ở đâu</h3>
<table>
<thead><tr><th>Client</th><th>Access token</th><th>Refresh token / bí mật sống lâu</th></tr></thead>
<tbody>
<tr><td>Website (trình duyệt)</td><td>Một biến JavaScript (bộ nhớ), mất khi tải lại</td><td>Cookie HttpOnly, Secure, SameSite — hoặc bỏ token và dùng phiên</td></tr>
<tr><td>App di động</td><td>Bộ nhớ</td><td>Kho bảo mật của điện thoại (Keychain trên iOS, Keystore trên Android)</td></tr>
<tr><td>Máy chủ gọi API</td><td>Bộ nhớ, xin lúc khởi động</td><td>Biến môi trường trên máy chủ (Bài 14.2), không bao giờ trong Git</td></tr>
<tr><td>Công cụ dòng lệnh</td><td>Tệp cấu hình chỉ người dùng đó đọc được</td><td>Kho thông tin xác thực của hệ điều hành nếu có</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — giải mã, giả mạo, kiểm</strong></p>
<ol>
<li>Trong console trình duyệt, dán token ở Bước 1 vào <code>const t = '…'</code> và chạy <code>JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))</code>.</li>
<li>Chép <code>jwt-tay.mjs</code> (Bước 3 có phần lõi) và chạy nó trong một thư mục đã <code>npm i jsonwebtoken</code>.</li>
<li>Đổi một ký tự của chữ ký rồi kiểm: lý do là gì? Đổi <code>exp</code> thành <code>NOW - 1</code> rồi kiểm lại.</li>
<li>Thêm hàm <code>requireRole(token, role)</code> trả 401, 403 hoặc 200, dùng <code>verifyToken</code>.</li>
<li>Thay khoá bằng <code>'secret'</code> rồi nghĩ: một laptop làm hàng triệu HMAC mỗi giây cần bao lâu để đoán ra?</li>
</ol>
<p>Gợi ý: <code>atob</code> cần Base64 chuẩn, vì vậy có hai lần <code>replace</code>; <code>Buffer.from(x, 'base64url')</code> của Node tự làm giúp bạn.</p>
<p><strong>Xong khi:</strong> console in ra <code>{ sub: '1', name: 'An', role: 'user', … }</code>; chữ ký bị đổi cho <code>bad signature</code> và <code>exp</code> cũ cho <code>expired</code>; <code>requireRole(token, 'admin')</code> trả 403 với token của An và 401 với token giả. Sau đó làm module Code Lab 7.3.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JWT</span><span class="v">JSON Web Token — token tự mang thông tin và chữ ký.</span></div>
  <div class="kv"><span class="k">claim</span><span class="v">khẳng định trong payload — sub, role, exp…</span></div>
  <div class="kv"><span class="k">Base64URL</span><span class="v">Base64 an toàn cho URL — không phải mã hoá.</span></div>
  <div class="kv"><span class="k">HMAC / HS256</span><span class="v">chữ ký bằng khoá bí mật chung.</span></div>
  <div class="kv"><span class="k">signed vs encrypted</span><span class="v">đã ký (không sửa được) và đã mã hoá (không đọc được).</span></div>
  <div class="kv"><span class="k">exp / iat</span><span class="v">thời điểm hết hạn / thời điểm cấp.</span></div>
  <div class="kv"><span class="k">bearer</span><span class="v">người mang — ai cầm token là người đó.</span></div>
  <div class="kv"><span class="k">access / refresh token</span><span class="v">token truy cập ngắn hạn / token làm mới dài hạn.</span></div>
  <div class="kv"><span class="k">revocation</span><span class="v">thu hồi — làm token mất hiệu lực sớm.</span></div>
  <div class="kv"><span class="k">alg none attack</span><span class="v">đòn bỏ chữ ký bằng cách khai thuật toán none.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>JWT = header.payload.signature, mỗi phần Base64URL; ai cũng đọc được payload.</li>
  <li>Chữ ký (HMAC với khoá của máy chủ) chứng minh token không bị sửa.</li>
  <li>Kiểm theo thứ tự: cố định thuật toán → chữ ký → thời hạn → rồi mới phân quyền.</li>
  <li>Payload bị sửa, <code>alg: none</code> và token hết hạn đều phải nhận 401.</li>
  <li>Bearer token không đăng xuất ngay được: để hạn ngắn và đi kèm một refresh token thu hồi được.</li>
  <li>Với website chỉ có trình duyệt, cookie phiên HttpOnly thường đơn giản và an toàn hơn.</li>
</ul>
${nguon('📗', 'RFC 7519 — JSON Web Token', 'Chuẩn gốc: cấu trúc và các claim đăng ký sẵn', 'https://www.rfc-editor.org/rfc/rfc7519')}
${nguon('📘', 'OWASP — JSON Web Token Cheat Sheet', 'alg none, khoá yếu, thu hồi và nơi lưu token', 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html')}
${lienKet({ khoa: 'authentication', bai: 'auth-4-1-giai-ma-bang-tay', title: 'Authentication 4.1 — Giải mã JWT bằng tay', sub: 'Sâu hơn: các claim, khoá, JWKS và nơi lưu token', cta: 'Mở bài' })}
</div>
`,
};
