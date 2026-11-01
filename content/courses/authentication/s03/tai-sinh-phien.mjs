/**
 * Authentication · Chương 3 · 3.3 — Phiên MỚI ở mỗi lần đổi mức đặc quyền. Slug giữ: auth-3-3-tai-sinh-phien.
 * Output thật (_ma.mjs, Chromium 156 + v0.3 + PostgreSQL 17.11): máy chủ ngây thơ :4802 nâng cấp sid ẩn danh tại chỗ ⇒ kẻ tấn công
 * GET /me = An (200); v0.3 :4800 start() xoá phiên cũ + token mới ⇒ id bị cài 401, tab của An = An (trước đó tab hiện tài khoản Bình —
 * login CSRF); đổi mật khẩu: sai mật khẩu hiện tại 403 REAUTH_FAILED, đúng ⇒ signedOutSessions 2, cookie mới.
 */
import G from '../giang/auth-03-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const FX = CODE.fixNaive.split('\n');
const NAIVE = FX.slice(FX.findIndex((l) => l.startsWith("app.post('/sign-in'")), FX.findIndex((l) => l.startsWith("app.get('/me'"))).join('\n').trim();
const L = CODE.layer.split('\n');
const START = L.slice(L.findIndex((l) => l.includes('/** After a successful sign-in')), L.findIndex((l) => l.includes('/** Middleware'))).join('\n').trim();
const SV = CODE.server03.split('\n');
const PW = SV.slice(SV.findIndex((l) => l.startsWith('// lesson 3.3')), SV.findIndex((l) => l.startsWith("app.post('/sign-out'"))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — Session Management Cheat Sheet: renew the session ID', '“The session ID must be renewed or regenerated … after any privilege level change” — login, password change, permission change; destroy the previous one (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('📘', 'MDN — Set-Cookie: cookie prefixes', '__Host- cookies cannot carry a Domain, so a subdomain cannot set one for the host — the usual planting route (read 01/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Session Management Cheat Sheet: làm mới session ID', '"Session ID phải được làm mới hoặc tái sinh … sau mọi lần đổi mức đặc quyền" — đăng nhập, đổi mật khẩu, đổi quyền; huỷ cái cũ (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('📘', 'MDN — Set-Cookie: tiền tố cookie', 'Cookie __Host- không được có Domain, nên subdomain không đặt được nó cho host — con đường cài phiên thường gặp (đọc 01/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Event</th><th>New session on this device</th><th>Other sessions of the user</th><th>Re-authenticate first?</th></tr></thead>
<tbody>
<tr><td>sign-in</td><td>yes — <code>start()</code></td><td>keep</td><td>it <em>is</em> the authentication</td></tr>
<tr><td>password change</td><td>yes</td><td><strong>end all</strong> (a thief's session too)</td><td>yes — current password</td></tr>
<tr><td>email change</td><td>optional</td><td>keep</td><td>yes — it controls password reset (Chapter 6)</td></tr>
<tr><td>role change (STUDENT → LAB_MANAGER)</td><td>yes</td><td>end all, or read the role from the database on every request</td><td>done by an admin</td></tr>
<tr><td>second factor added / removed</td><td>yes</td><td>end all</td><td>yes (Chapter 7)</td></tr>
<tr><td>sign-out</td><td>— (delete)</td><td>keep</td><td>no</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Sự kiện</th><th>Phiên mới trên thiết bị này</th><th>Các phiên khác của người đó</th><th>Xác thực lại trước?</th></tr></thead>
<tbody>
<tr><td>đăng nhập</td><td>có — <code>start()</code></td><td>giữ</td><td>chính nó <em>là</em> việc xác thực</td></tr>
<tr><td>đổi mật khẩu</td><td>có</td><td><strong>kết thúc hết</strong> (kể cả phiên của kẻ trộm)</td><td>có — mật khẩu hiện tại</td></tr>
<tr><td>đổi email</td><td>tuỳ</td><td>giữ</td><td>có — email điều khiển việc đặt lại mật khẩu (Chương 6)</td></tr>
<tr><td>đổi vai trò (STUDENT → LAB_MANAGER)</td><td>có</td><td>kết thúc hết, hoặc đọc vai trò từ CSDL ở mỗi request</td><td>do quản trị viên làm</td></tr>
<tr><td>thêm / bỏ yếu tố thứ hai</td><td>có</td><td>kết thúc hết</td><td>có (Chương 7)</td></tr>
<tr><td>đăng xuất</td><td>— (xoá)</td><td>giữ</td><td>không</td></tr>
</tbody>
</table>`;

export default {
  title: '3.3 — New session on every privilege change|||3.3 — Phiên MỚI ở mỗi lần đổi mức đặc quyền',
  slug: 'auth-3-3-tai-sinh-phien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Session fixation chạy thật trong Chromium 156: kẻ tấn công cài một mã phiên vào trình duyệt của An, chờ cô đăng nhập, và máy chủ ngây thơ nâng cấp đúng phiên đó ⇒ hắn thành An mà chẳng cần mật khẩu. Cách vá trong v0.3 là hai dòng — huỷ phiên cũ, cấp token mới — đo lại: id bị cài 401. Cùng luật cho đổi mật khẩu (xác thực lại, kết thúc 2 phiên khác), đổi vai trò, yếu tố thứ hai; login CSRF; những kiểu "xác thực lại" chẳng kiểm gì.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>New session on every privilege change</h2>
<p class="lead">Lessons 3.1–3.2 made the session token random, stored as a digest, and carried in a cookie scripts cannot read. One attack needs none of those to be broken: <strong>session fixation</strong>. The attacker does not steal your session — he <em>gives</em> you one he already knows, waits for you to sign in, and uses it. This lesson runs that attack for real, fixes it with two lines, and applies the same rule to every moment a session gains privileges.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>explain session fixation step by step and show it working against a naive server;</li>
<li>fix it by destroying the old session and issuing a new one at sign-in;</li>
<li>list the privilege changes that need a new session, and which also end the others;</li>
<li>require re-authentication on the server before risky actions such as changing the password.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> the bug is invisible in testing — sign-in “works” — and the most popular session middleware for Express leaves the fix to you (<code>req.session.regenerate()</code> must be called by hand). Knowing why is a strong answer in any security interview.</p>
</div>

<h3>An everyday picture first</h3>
<p>Someone hands you a hotel key card “that the front desk left for you”. If the desk, at check-in, simply activates whatever card you hold, the stranger's copy now opens your room. Real hotels program a <em>new</em> card at check-in, and every card that existed before stops working. A server must do the same at sign-in.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Get an id</span><span class="lz-d">The attacker visits the site and keeps the session id he receives (anonymous, or his own account).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Plant it</span><span class="lz-d">He gets that id into An's browser: a sibling subdomain, a URL that accepts <code>?sid=</code>, a shared lab PC.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">An signs in</span><span class="lz-d">If the server upgrades the existing session, the id he knows is now An's signed-in session.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">He uses it</span><span class="lz-d">No password, no cracking, no XSS on the target.</span></div>
</div>

<h3>The attack, run for real</h3>
<p><code>demo3/fixation-naive.js</code> (port 4802) gives every visitor an anonymous session (for the language setting) and, at sign-in, writes the user id into that same session:</p>
${ma('javascript', NAIVE)}
<p><code>demo3/fixation.mjs</code> plays both sides in real Chromium. Planting is done with <code>context.addCookies</code> — in real life one of the routes above:</p>
${ra(OUT['33-fixation'])}
<p>Part 1: the attacker's anonymous sid (<code>H9Dt073h…</code>) is still An's sid after she signs in, and his <code>GET /me</code> answers <strong>200 — An</strong>. Part 2, against LabFlow ID v0.3: the attacker (Bình) plants his own valid session; after An signs in her cookie is new, the planted id gets <strong>401</strong>, and her tab shows An.</p>
<p>Look at the second line of part 2: <em>before</em> signing in, An's tab was signed in <strong>as Bình</strong>. That is <strong>login CSRF</strong>: a victim, unaware, works inside the attacker's account — uploads a report, saves a card — and the attacker reads it later. Lesson 3.4's checks stop a forged sign-in request from another site.</p>

<h3>The fix: <code>start()</code> never upgrades</h3>
${ma('javascript', START)}
<p>Two lines do the work: delete whatever session the request carried, and mint a new 256-bit token. It does not matter how the old id got there; it is worthless the moment the user signs in. The <code>__Host-</code> prefix (lesson 3.2) additionally stops the commonest planting route, a subdomain setting the cookie — defence in depth: prevent planting where you can, and make it useless anyway.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — trusting the framework to do it.</strong> <code>express-session</code> does not regenerate on its own: you must call <code>req.session.regenerate()</code> in your sign-in route. Java servlets have <code>request.changeSessionId()</code> (PRJ301), Spring Security does it by default. Whatever the stack, test it: sign in with a session cookie you saved before, and check the old one is dead.</p>
</div>

<h3>Every privilege change, not only sign-in</h3>
${BANG_EN}
<p>OWASP's rule: “The session ID must be renewed or regenerated by the web application after any privilege level change”, and the previous one destroyed. LabFlow ID v0.3 implements the hardest row, the password change:</p>
${ma('javascript', PW)}
${ra(OUT['33-password'])}
<ul>
<li>A wrong current password ⇒ <code>403 REAUTH_FAILED</code>: someone holding only a stolen cookie cannot lock Cô Lan out.</li>
<li>Success ⇒ <code>signedOutSessions: 2</code> — the phone and the laptop's old cookie are dead (if a thief had one, it is dead too).</li>
<li>This device continues with a <em>new</em> cookie, issued by the same <code>start()</code>.</li>
</ul>
<div class="pitfall co-tieu-de">
<p><strong>Trap — re-authentication that checks nothing.</strong> A “confirm your password” box validated only in the browser; a “recently verified” flag stored in the session forever; or an email change with no check at all — then “forgot password” sends the reset link to the attacker's new address. Verify on the server and require the proof to be recent: the <code>auth_at</code> column from 3.1 lets an endpoint demand “password proven in the last 5 minutes”.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“What is session fixation and how do you prevent it?”</strong> — The attacker sets a session id the victim then authenticates; prevent it by issuing a new session id at sign-in (and every privilege change) and destroying the old one; plus <code>__Host-</code> cookies and never accepting ids from URLs.</li>
<li><strong>“What happens to other sessions when a user changes their password?”</strong> — End them all; keep only a new session on the current device.</li>
<li><strong>“Which actions need re-authentication?”</strong> — Password, email, second factor, account deletion: anything that could lock the real owner out.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo3/fixation-naive.js</code>, <code>node src/server.js</code> and <code>node demo3/fixation.mjs</code>. Then make the naive server regenerate (create a new sid at sign-in and delete the old one) and run part 1 again.</li>
<li>In <code>demo3/change-password.sh</code>, add a third device that signs in <em>after</em> the change with the new password. Does it work, and does the old laptop cookie still fail?</li>
<li>Write the rule “email change needs a password proven in the last 5 minutes” using <code>auth_at</code>. Where must <code>auth_at</code> be updated?</li>
</ol>
<p><strong>Solution</strong> (we ran both): with regeneration An's sid changed at sign-in (<code>4YofDzpR…</code>) and the attacker's <code>GET /me</code> returned 401 — the same as part 2. A third device signing in with the new password works; the old laptop cookie keeps failing because its row was deleted. For 3: <code>if (Date.now() - req.session.authAt &gt; 5 * 60e3) return res.status(403).json({ error: 'REAUTH_REQUIRED' })</code>, and <code>auth_at</code> is set at sign-in by <code>start()</code> and must be refreshed (<code>store.update(digest, { authAt })</code>) whenever the user proves the password again.</p>
<p><strong>Done when:</strong> a cookie saved before sign-in is dead after it, a password change ends every other session, and your risky endpoints check a recent proof on the server.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">session fixation</span><span class="v">Making a victim authenticate a session id the attacker already knows.</span></div>
  <div class="kv"><span class="k">session regeneration</span><span class="v">Destroying the current session and issuing a new id at a privilege change.</span></div>
  <div class="kv"><span class="k">privilege change</span><span class="v">Any moment a session gains or changes rights: sign-in, password, role, second factor.</span></div>
  <div class="kv"><span class="k">login CSRF</span><span class="v">Signing a victim into the attacker's account so that the victim's actions land there.</span></div>
  <div class="kv"><span class="k">re-authentication (step-up)</span><span class="v">Asking for the password again, checked on the server, before a risky action.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Fixation: a server that upgrades the existing session lets a planted id become the victim's session — measured: 200 as An.</li>
<li>Fix: <code>start()</code> deletes the old session and mints a new token — measured: 401 for the planted id.</li>
<li>New session at every privilege change; a password change also ends every other session (2 here).</li>
<li>Re-authenticate on the server, with a recent proof (<code>auth_at</code>), before password/email/MFA changes.</li>
<li><code>__Host-</code> stops subdomain planting; regeneration makes every planting route useless.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'java-web-application-development', bai: 'prj301-cookie-session', title: 'Also in PRJ301 — the session-fixation line in Java', sub: 'Same: issue a fresh session id at login, invalidate the old one — request.changeSessionId() in Servlet 3.1. That lesson states the rule; this one runs the attack in real Chromium against a naive server and against LabFlow ID.', cta: 'OPEN PRJ301 LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Phiên MỚI ở mỗi lần đổi mức đặc quyền</h2>
<p class="lead">Bài 3.1–3.2 đã làm token phiên ngẫu nhiên, lưu dạng digest, và đi trong một cookie script không đọc được. Có một đòn tấn công chẳng cần phá cái nào trong số đó: <strong>session fixation (cố định phiên)</strong>. Kẻ tấn công không trộm phiên của bạn — hắn <em>đưa</em> bạn một phiên hắn đã biết, chờ bạn đăng nhập, rồi dùng nó. Bài này chạy đòn đó thật, vá nó bằng hai dòng, và áp cùng một luật cho mọi lúc phiên được thêm đặc quyền.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>giải thích session fixation từng bước và cho thấy nó chạy được với một máy chủ ngây thơ;</li>
<li>vá nó bằng cách huỷ phiên cũ và cấp phiên mới khi đăng nhập;</li>
<li>liệt kê các lần đổi đặc quyền cần phiên mới, và lần nào còn phải kết thúc các phiên khác;</li>
<li>đòi xác thực lại ở máy chủ trước các thao tác rủi ro như đổi mật khẩu.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> con bug này vô hình khi test — đăng nhập vẫn "chạy" — và middleware phiên phổ biến nhất của Express để việc vá cho bạn (<code>req.session.regenerate()</code> phải tự gọi). Biết vì sao là một câu trả lời mạnh trong mọi buổi phỏng vấn bảo mật.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Ai đó đưa bạn một thẻ phòng khách sạn "lễ tân gửi lại cho anh". Nếu lúc nhận phòng, lễ tân chỉ kích hoạt tấm thẻ bạn đang cầm, bản sao của người lạ giờ mở được phòng bạn. Khách sạn thật lập trình một thẻ <em>mới</em> khi nhận phòng, và mọi thẻ có từ trước đều thôi hoạt động. Máy chủ phải làm y như vậy khi đăng nhập.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Lấy một id</span><span class="lz-d">Kẻ tấn công ghé trang và giữ session id nhận được (ẩn danh, hoặc của chính tài khoản hắn).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cài nó</span><span class="lz-d">Hắn đưa id đó vào trình duyệt của An: một subdomain anh em, một URL nhận <code>?sid=</code>, một máy phòng lab dùng chung.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">An đăng nhập</span><span class="lz-d">Nếu máy chủ nâng cấp phiên đang có, id hắn biết giờ là phiên đã đăng nhập của An.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hắn dùng nó</span><span class="lz-d">Không mật khẩu, không bẻ khoá, không XSS trên trang đích.</span></div>
</div>

<h3>Đòn tấn công, chạy thật</h3>
<p><code>demo3/fixation-naive.js</code> (cổng 4802) cấp cho mọi người ghé thăm một phiên ẩn danh (cho thiết lập ngôn ngữ) và, khi đăng nhập, ghi user id vào đúng phiên đó:</p>
${ma('javascript', NAIVE)}
<p><code>demo3/fixation.mjs</code> đóng cả hai vai trong Chromium thật. Việc cài được làm bằng <code>context.addCookies</code> — ngoài đời là một trong các đường ở trên:</p>
${ra(OUT['33-fixation'])}
<p>Phần 1: sid ẩn danh của kẻ tấn công (<code>H9Dt073h…</code>) vẫn là sid của An sau khi cô đăng nhập, và <code>GET /me</code> của hắn trả <strong>200 — An</strong>. Phần 2, với LabFlow ID v0.3: kẻ tấn công (Bình) cài phiên hợp lệ của chính hắn; sau khi An đăng nhập cookie của cô là cái mới, id bị cài nhận <strong>401</strong>, và tab của cô hiện An.</p>
<p>Nhìn dòng thứ hai của phần 2: <em>trước khi</em> đăng nhập, tab của An đang đăng nhập <strong>bằng tài khoản Bình</strong>. Đó là <strong>login CSRF</strong>: nạn nhân không hay biết, làm việc ngay trong tài khoản của kẻ tấn công — tải lên một báo cáo, lưu một thẻ — và kẻ tấn công đọc lại sau. Các phép kiểm ở bài 3.4 chặn một request đăng nhập giả mạo từ site khác.</p>

<h3>Cách vá: <code>start()</code> không bao giờ nâng cấp</h3>
${ma('javascript', START)}
<p>Hai dòng làm hết việc: xoá mọi phiên request mang theo, và tạo một token 256 bit mới. Id cũ vào bằng đường nào không quan trọng; nó vô giá trị ngay lúc người dùng đăng nhập. Tiền tố <code>__Host-</code> (bài 3.2) còn chặn thêm đường cài phổ biến nhất, một subdomain đặt cookie — phòng thủ nhiều lớp: chặn việc cài ở chỗ chặn được, và làm cho việc cài vô dụng ở mọi chỗ.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tin framework tự làm.</strong> <code>express-session</code> không tự tái sinh: bạn phải gọi <code>req.session.regenerate()</code> trong route đăng nhập. Java servlet có <code>request.changeSessionId()</code> (PRJ301), Spring Security làm sẵn theo mặc định. Stack nào cũng vậy, hãy test: đăng nhập kèm một cookie phiên đã lưu từ trước, rồi kiểm cái cũ đã chết.</p>
</div>

<h3>Mọi lần đổi đặc quyền, không chỉ đăng nhập</h3>
${BANG_VI}
<p>Luật của OWASP: "Session ID phải được ứng dụng web làm mới hoặc tái sinh sau mọi lần đổi mức đặc quyền", và cái cũ phải bị huỷ. LabFlow ID v0.3 cài hàng khó nhất, đổi mật khẩu:</p>
${ma('javascript', PW)}
${ra(OUT['33-password'])}
<ul>
<li>Sai mật khẩu hiện tại ⇒ <code>403 REAUTH_FAILED</code>: người chỉ cầm một cookie bị trộm không khoá được Cô Lan ra ngoài.</li>
<li>Thành công ⇒ <code>signedOutSessions: 2</code> — điện thoại và cookie cũ của laptop đã chết (nếu kẻ trộm có một cái, nó cũng chết).</li>
<li>Thiết bị này tiếp tục với một cookie <em>mới</em>, do cùng hàm <code>start()</code> cấp.</li>
</ul>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — xác thực lại mà chẳng kiểm gì.</strong> Một ô "xác nhận mật khẩu" chỉ kiểm ở trình duyệt; một cờ "vừa xác minh" lưu trong phiên mãi mãi; hay đổi email mà không kiểm gì — rồi "quên mật khẩu" gửi link đặt lại tới địa chỉ mới của kẻ tấn công. Hãy kiểm ở máy chủ và đòi bằng chứng còn mới: cột <code>auth_at</code> từ bài 3.1 cho phép một endpoint đòi "mật khẩu đã chứng minh trong 5 phút gần đây".</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Session fixation là gì và chống thế nào?"</strong> — Kẻ tấn công đặt sẵn một session id mà nạn nhân sau đó xác thực; chống bằng cách cấp session id mới khi đăng nhập (và mọi lần đổi đặc quyền) và huỷ cái cũ; cộng cookie <code>__Host-</code> và không bao giờ nhận id từ URL.</li>
<li><strong>"Người dùng đổi mật khẩu thì các phiên khác ra sao?"</strong> — Kết thúc hết; chỉ giữ một phiên mới trên thiết bị hiện tại.</li>
<li><strong>"Thao tác nào cần xác thực lại?"</strong> — Mật khẩu, email, yếu tố thứ hai, xoá tài khoản: mọi thứ có thể khoá chủ thật ra ngoài.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo3/fixation-naive.js</code>, <code>node src/server.js</code> và <code>node demo3/fixation.mjs</code>. Rồi sửa máy chủ ngây thơ để tái sinh (tạo sid mới khi đăng nhập và xoá cái cũ) và chạy lại phần 1.</li>
<li>Trong <code>demo3/change-password.sh</code>, thêm thiết bị thứ ba đăng nhập <em>sau</em> khi đổi, bằng mật khẩu mới. Nó có vào được không, và cookie cũ của laptop có còn trượt không?</li>
<li>Viết luật "đổi email cần mật khẩu đã chứng minh trong 5 phút gần đây" bằng <code>auth_at</code>. <code>auth_at</code> phải được cập nhật ở đâu?</li>
</ol>
<p><strong>Lời giải</strong> (mình đã chạy cả hai): có tái sinh thì sid của An đổi khi đăng nhập (<code>4YofDzpR…</code>) và <code>GET /me</code> của kẻ tấn công trả 401 — giống phần 2. Thiết bị thứ ba đăng nhập bằng mật khẩu mới vào được; cookie cũ của laptop vẫn trượt vì dòng của nó đã bị xoá. Câu 3: <code>if (Date.now() - req.session.authAt &gt; 5 * 60e3) return res.status(403).json({ error: 'REAUTH_REQUIRED' })</code>, và <code>auth_at</code> được <code>start()</code> đặt lúc đăng nhập, phải làm mới (<code>store.update(digest, { authAt })</code>) mỗi khi người dùng chứng minh lại mật khẩu.</p>
<p><strong>Đạt khi:</strong> cookie lưu từ trước khi đăng nhập đã chết sau khi đăng nhập, đổi mật khẩu kết thúc mọi phiên khác, và các endpoint rủi ro kiểm bằng chứng còn mới ở máy chủ.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">session fixation (cố định phiên)</span><span class="v">Khiến nạn nhân xác thực một session id mà kẻ tấn công đã biết sẵn.</span></div>
  <div class="kv"><span class="k">session regeneration (tái sinh phiên)</span><span class="v">Huỷ phiên hiện tại và cấp id mới ở một lần đổi đặc quyền.</span></div>
  <div class="kv"><span class="k">privilege change (đổi đặc quyền)</span><span class="v">Mọi lúc một phiên được thêm hoặc đổi quyền: đăng nhập, mật khẩu, vai trò, yếu tố thứ hai.</span></div>
  <div class="kv"><span class="k">login CSRF</span><span class="v">Đăng nhập nạn nhân vào tài khoản của kẻ tấn công để thao tác của nạn nhân rơi vào đó.</span></div>
  <div class="kv"><span class="k">re-authentication / step-up (xác thực lại)</span><span class="v">Hỏi lại mật khẩu, kiểm ở máy chủ, trước một thao tác rủi ro.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Fixation: máy chủ nâng cấp phiên đang có thì một id bị cài thành phiên của nạn nhân — đo được: 200 với tư cách An.</li>
<li>Cách vá: <code>start()</code> xoá phiên cũ và tạo token mới — đo được: id bị cài nhận 401.</li>
<li>Phiên mới ở mỗi lần đổi đặc quyền; đổi mật khẩu còn kết thúc mọi phiên khác (ở đây 2).</li>
<li>Xác thực lại ở máy chủ, với bằng chứng còn mới (<code>auth_at</code>), trước khi đổi mật khẩu/email/MFA.</li>
<li><code>__Host-</code> chặn việc cài qua subdomain; tái sinh làm mọi đường cài trở nên vô dụng.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'java-web-application-development', bai: 'prj301-cookie-session', title: 'Cũng có ở PRJ301 — dòng chống session fixation trong Java', sub: 'Giống: cấp session id mới khi đăng nhập, vô hiệu cái cũ — request.changeSessionId() trong Servlet 3.1. Bài đó nêu luật; bài này chạy đòn tấn công thật trong Chromium với một máy chủ ngây thơ và với LabFlow ID.', cta: 'MỞ BÀI PRJ301 →' })}
</div>
`,
};
