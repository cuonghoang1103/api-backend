/**
 * Authentication · Chương 5 · 5.3 — Năm sự kiện bắt buộc phải kết thúc một phiên. Slug giữ: auth-5-3-nam-su-kien.
 * Output thật (_ma.mjs): năm đường (đăng xuất · đăng xuất mọi nơi/đổi mật khẩu · phát hiện trộm · hết hạn 30 ngày · thu hồi
 * thiết bị) đều làm lần refresh kế trả REVOKED/EXPIRED. CODE: các tuyến /sign-out, /me/password, /sign-out-everywhere của v0.5.
 */
import G from '../giang/auth-05-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const SV = CODE.server05.split('\n');
const PW = SV.slice(SV.findIndex((l) => l.includes("lesson 3.3 + 5.3: change the password")), SV.findIndex((l) => l.includes("lesson 5.3: sign-out ends"))).join('\n').trim();
const OUT_ROUTES = SV.slice(SV.findIndex((l) => l.includes("lesson 5.3: sign-out ends")), SV.findIndex((l) => l.startsWith('app.use((err'))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — Session Management Cheat Sheet (session expiration, logout)', 'Invalidate the session server-side on logout; a password change should end existing sessions; use an absolute timeout (read 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('📜', 'RFC 9700 — OAuth 2.0 Security BCP, §4.14', 'Revoke refresh tokens on reuse and on credential change; the family is the revocation unit (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Session Management Cheat Sheet (hết hạn phiên, đăng xuất)', 'Vô hiệu phiên phía máy chủ khi đăng xuất; đổi mật khẩu nên kết thúc các phiên đang có; dùng hết hạn tuyệt đối (đọc 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('📜', 'RFC 9700 — BCP bảo mật OAuth 2.0, §4.14', 'Thu hồi refresh token khi tái dùng và khi đổi thông tin xác thực; họ là đơn vị thu hồi (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Event</th><th>Scope</th><th>What the server does</th><th>Next refresh</th></tr></thead>
<tbody>
<tr><td>Sign out (this device)</td><td>one family</td><td>revoke this family; clear the cookie</td><td><code>REVOKED</code></td></tr>
<tr><td>Sign out everywhere / password change</td><td>all families</td><td>revoke every family of the user; start one fresh</td><td><code>REVOKED</code></td></tr>
<tr><td>Theft detected (reuse)</td><td>one family</td><td>revoke the family automatically (lesson 5.2)</td><td><code>REVOKED</code></td></tr>
<tr><td>Expiry (30 days)</td><td>one family</td><td>nothing — the row's <code>expires_at</code> has passed</td><td><code>EXPIRED</code></td></tr>
<tr><td>Devices-page revoke</td><td>one family (by id)</td><td>revoke the chosen family</td><td><code>REVOKED</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Sự kiện</th><th>Phạm vi</th><th>Máy chủ làm gì</th><th>Refresh kế</th></tr></thead>
<tbody>
<tr><td>Đăng xuất (thiết bị này)</td><td>một họ</td><td>thu hồi họ này; xoá cookie</td><td><code>REVOKED</code></td></tr>
<tr><td>Đăng xuất mọi nơi / đổi mật khẩu</td><td>mọi họ</td><td>thu hồi mọi họ của người đó; mở một họ mới</td><td><code>REVOKED</code></td></tr>
<tr><td>Phát hiện trộm (tái dùng)</td><td>một họ</td><td>thu hồi họ tự động (bài 5.2)</td><td><code>REVOKED</code></td></tr>
<tr><td>Hết hạn (30 ngày)</td><td>một họ</td><td>không gì — <code>expires_at</code> của dòng đã qua</td><td><code>EXPIRED</code></td></tr>
<tr><td>Thu hồi từ trang thiết bị</td><td>một họ (theo id)</td><td>thu hồi họ được chọn</td><td><code>REVOKED</code></td></tr>
</tbody>
</table>`;

export default {
  title: '5.3 — Five events that must end a session|||5.3 — Năm sự kiện bắt buộc phải kết thúc một phiên',
  slug: 'auth-5-3-nam-su-kien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đăng nhập là một đường; kết thúc một phiên là năm: đăng xuất tường minh, đăng xuất mọi nơi/đổi mật khẩu, phát hiện trộm (tái dùng), hết hạn tuyệt đối 30 ngày, và thu hồi từ trang thiết bị — mỗi cái thu hồi họ refresh ở MÁY CHỦ, không chỉ xoá cookie. Chạy thật trên LabFlow ID v0.5: cả năm đường làm lần refresh kế trả REVOKED/EXPIRED. Và vì sao một access token đã phát vẫn chạy tới 15 phút — cửa sổ là cái giá của việc bỏ một lần tra (bài 4.3).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Five events that must end a session</h2>
<p class="lead">Logging in is one code path. Logging <em>out</em> — really out — is five, and they are easy to miss. A session must end when the user signs out, when they sign out everywhere or change their password, when a theft is detected (lesson 5.2), when the family simply expires, and when a device is revoked from the devices page. In every case “end” means <strong>revoke the refresh family on the server</strong>, not merely clear a cookie.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>list the five events that must end a session and the scope of each;</li>
<li>revoke one family, or all of a user's families, on the right event;</li>
<li>explain why ending a session is server-side revocation, not clearing a cookie;</li>
<li>say why an already-issued access token keeps working for up to 15 minutes.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> the “log out” button that does not really log out is the single most common auth bug (we met it in Chapter 3). After this lesson yours ends sessions on the server, on all five triggers.</p>
</div>

<h3>An everyday picture first</h3>
<p>Ending a session is not the same as <strong>clearing a cookie</strong>. Clearing the cookie is like tearing up your own copy of a key card — the lock still opens for any other copy. Ending a session is telling the <em>lock</em> to forget that card entirely. Only the second one stops a thief who copied the card. On the server, that means revoking the refresh family; the cookie is just the user's copy.</p>

<h3>The five events</h3>
${BANG_EN}
<p>Run all five on the real layer — each ends with a refresh that no longer works:</p>
${ra(OUT['53-five-events'])}
<p>Four return <code>REVOKED</code> (someone or something revoked the family) and one returns <code>EXPIRED</code> (the family's 30 days ran out, no action needed). The server routes for the first three:</p>
${ma('javascript', PW)}
${ma('javascript', OUT_ROUTES)}
<p>A password change revokes <em>every</em> family (<code>revokeAll</code>) and then starts a fresh one, so the user stays signed in on this device but every other device is cut off — a leaked password cannot leave a session alive. Sign-out revokes just this device's family and clears the cookie; sign-out-everywhere revokes all without starting a new one.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sign out</span><span class="lz-d">revoke <strong>this</strong> family</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Everywhere / password</span><span class="lz-d">revoke <strong>all</strong> the user's families</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Theft</span><span class="lz-d">reuse revokes the family on its own (5.2)</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Expiry</span><span class="lz-d">the 30 days pass — no action needed</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Device revoke</span><span class="lz-d">revoke one family by id (5.4)</span></div>
</div>

<h3>The access-token window</h3>
<p>Every event ends the <em>refresh</em> token, so no new access token can be minted. But the access token already in the client's memory is <strong>stateless</strong> (lesson 4.3): nothing is looked up when it is used, so it keeps working until it expires — up to 15 minutes. That lingering window is exactly the price you pay for skipping a per-request database lookup. Shorten the access-token lifetime to shrink it; if a product needs an instant kill switch, it must check a denylist on every request (which is the lookup JWTs avoid) or keep a server-side session (Chapter 3).</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — logging out the cookie, not the token.</strong> A “sign out” that only sends <code>Set-Cookie: …; Max-Age=0</code> tells this browser to forget, but leaves the refresh token valid on the server. A synced device, a browser extension, or a logged proxy that kept a copy can still refresh indefinitely. Always revoke the family server-side; clearing the cookie is a courtesy to the honest browser, not a security control.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“What ends a session?”</strong> — Sign-out, sign-out-everywhere, password change, detected theft, expiry, and a devices-page revoke — each revokes the refresh family server-side.</li>
<li><strong>“Does changing the password log out other devices?”</strong> — Yes: it must revoke every family, or a stolen password leaves old sessions alive.</li>
<li><strong>“After logout, why can the old token still call the API?”</strong> — The access token is stateless; it works until it expires (≤ 15 min). Only the refresh is revoked instantly.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo5/five-events.mjs</code>. Which event returns <code>EXPIRED</code> instead of <code>REVOKED</code>, and why is that not a bug?</li>
<li>With v0.5 running, sign in, change the password, then <code>POST /refresh</code> with the <em>old</em> cookie jar. What do you get, and why?</li>
<li>Why does <code>/me/password</code> call both <code>sessions.endAll</code> and <code>refresh.revokeAll</code>?</li>
</ol>
<p><strong>Solution:</strong> (1) expiry — no one revoked anything; the family's <code>expires_at</code> simply passed, so <code>EXPIRED</code> is correct. (2) <code>REVOKED</code> — the password change revoked all families including the one your old cookie points to. (3) a user has both sessions (Chapter 3, web) and refresh families (Chapter 5, API clients); a password change must end both.</p>
<p><strong>Done when:</strong> you can name the five events, revoke the right scope for each, and explain the ≤ 15-minute access window.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">server-side revocation</span><span class="v">Ending a session by revoking the refresh family on the server, not by clearing a cookie.</span></div>
  <div class="kv"><span class="k">sign out everywhere</span><span class="v">Revoking every family of a user; also what a password change does.</span></div>
  <div class="kv"><span class="k">absolute expiry</span><span class="v">The family's fixed 30-day end; the one event that needs no action.</span></div>
  <div class="kv"><span class="k">access-token window</span><span class="v">The ≤ 15 min an already-issued access token keeps working after a session ends.</span></div>
  <div class="kv"><span class="k">credential change</span><span class="v">A password (or passkey) change; must revoke all families.</span></div>
  <div class="kv"><span class="k">family scope</span><span class="v">One family = one device; revoke one for a lost phone, all for a leaked password.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Five events end a session: sign-out, sign-out-everywhere/password change, theft detected, expiry, devices-page revoke.</li>
<li>Each revokes the refresh family on the server; clearing the cookie alone does not end the session.</li>
<li>A password change revokes <em>all</em> families — a leaked password cannot leave a session alive.</li>
<li>Expiry is the one event that needs no action: the family's 30 days simply pass (<code>EXPIRED</code>).</li>
<li>The old access token lingers ≤ 15 minutes — the cost of a stateless token (lesson 4.3).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Applied in Node.js — lesson 8.4: cookies, CSRF, revocation', sub: 'Same question — how do you really end a session. That lesson revokes JWTs with a tokenVersion counter on the Notes API; this one revokes refresh families on five distinct events and measures the leftover access-token window. Each stands on its own.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Năm sự kiện bắt buộc phải kết thúc một phiên</h2>
<p class="lead">Đăng nhập là một đường mã. Đăng <em>xuất</em> — thật sự xuất — là năm, và dễ bỏ sót. Một phiên phải kết thúc khi người dùng đăng xuất, khi họ đăng xuất mọi nơi hoặc đổi mật khẩu, khi phát hiện trộm (bài 5.2), khi họ đơn giản hết hạn, và khi một thiết bị bị thu hồi từ trang thiết bị. Mọi trường hợp, "kết thúc" nghĩa là <strong>thu hồi họ refresh ở máy chủ</strong>, không chỉ xoá một cookie.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>liệt kê năm sự kiện bắt buộc kết thúc một phiên và phạm vi mỗi cái;</li>
<li>thu hồi một họ, hoặc mọi họ của một người, khi đúng sự kiện;</li>
<li>giải thích vì sao kết thúc một phiên là thu hồi phía máy chủ, không phải xoá cookie;</li>
<li>nói vì sao một access token đã phát vẫn chạy tới 15 phút.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> nút "đăng xuất" không thật sự đăng xuất là lỗi xác thực phổ biến nhất (ta đã gặp ở Chương 3). Học xong bài này, đồ án của bạn kết thúc phiên ở máy chủ, trên cả năm cò.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Kết thúc một phiên không giống <strong>xoá một cookie</strong>. Xoá cookie như xé bản sao thẻ từ của chính bạn — ổ khoá vẫn mở cho mọi bản sao khác. Kết thúc một phiên là bảo <em>ổ khoá</em> quên hẳn cái thẻ đó. Chỉ cái thứ hai chặn được một kẻ cắp đã chép thẻ. Ở máy chủ, nghĩa là thu hồi họ refresh; cookie chỉ là bản sao của người dùng.</p>

<h3>Năm sự kiện</h3>
${BANG_VI}
<p>Chạy cả năm trên lớp thật — mỗi cái kết thúc bằng một lần refresh không còn chạy:</p>
${ra(OUT['53-five-events'])}
<p>Bốn trả về <code>REVOKED</code> (ai đó hoặc cái gì đó đã thu hồi họ) và một trả về <code>EXPIRED</code> (30 ngày của họ hết, không cần hành động). Các tuyến máy chủ cho ba cái đầu:</p>
${ma('javascript', PW)}
${ma('javascript', OUT_ROUTES)}
<p>Đổi mật khẩu thu hồi <em>mọi</em> họ (<code>revokeAll</code>) rồi mở một họ mới, nên người dùng vẫn đăng nhập trên thiết bị này nhưng mọi thiết bị khác bị cắt — một mật khẩu bị lộ không thể để một phiên còn sống. Đăng xuất chỉ thu hồi họ của thiết bị này và xoá cookie; đăng xuất mọi nơi thu hồi tất cả mà không mở cái mới.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đăng xuất</span><span class="lz-d">thu hồi họ <strong>này</strong></span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mọi nơi / mật khẩu</span><span class="lz-d">thu hồi <strong>mọi</strong> họ của người đó</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Trộm</span><span class="lz-d">tái dùng tự thu hồi họ (5.2)</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hết hạn</span><span class="lz-d">30 ngày trôi qua — không cần hành động</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Thu hồi thiết bị</span><span class="lz-d">thu hồi một họ theo id (5.4)</span></div>
</div>

<h3>Cửa sổ access token</h3>
<p>Mọi sự kiện kết thúc token <em>refresh</em>, nên không access token mới nào được đúc. Nhưng access token đã nằm trong bộ nhớ client là <strong>không trạng thái</strong> (bài 4.3): không gì được tra khi nó được dùng, nên nó chạy tới khi hết hạn — tối đa 15 phút. Cái cửa sổ nán lại đó chính là cái giá bạn trả để bỏ một lần tra cơ sở dữ liệu mỗi request. Rút ngắn tuổi thọ access token để thu nó lại; nếu một sản phẩm cần công tắc giết tức thì, nó phải kiểm một denylist ở mọi request (chính là lần tra mà JWT né) hoặc giữ một phiên phía máy chủ (Chương 3).</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — đăng xuất cái cookie, không phải cái token.</strong> Một "đăng xuất" chỉ gửi <code>Set-Cookie: …; Max-Age=0</code> bảo trình duyệt này quên, nhưng để refresh token còn hợp lệ trên máy chủ. Một thiết bị đồng bộ, một tiện ích trình duyệt, hay một proxy đã ghi log giữ một bản vẫn refresh vô hạn được. Luôn thu hồi họ phía máy chủ; xoá cookie là phép lịch sự với trình duyệt ngay thẳng, không phải một chốt bảo mật.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Cái gì kết thúc một phiên?"</strong> — Đăng xuất, đăng xuất mọi nơi, đổi mật khẩu, phát hiện trộm, hết hạn, và thu hồi từ trang thiết bị — mỗi cái thu hồi họ refresh phía máy chủ.</li>
<li><strong>"Đổi mật khẩu có đăng xuất các thiết bị khác không?"</strong> — Có: nó phải thu hồi mọi họ, không thì một mật khẩu bị trộm để các phiên cũ còn sống.</li>
<li><strong>"Sau đăng xuất, vì sao token cũ vẫn gọi API được?"</strong> — Access token là không trạng thái; nó chạy tới khi hết hạn (≤ 15 phút). Chỉ refresh bị thu hồi tức thì.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo5/five-events.mjs</code>. Sự kiện nào trả <code>EXPIRED</code> thay vì <code>REVOKED</code>, và vì sao đó không phải lỗi?</li>
<li>Với v0.5 đang chạy, đăng nhập, đổi mật khẩu, rồi <code>POST /refresh</code> với cookie jar <em>cũ</em>. Bạn nhận gì, và vì sao?</li>
<li>Vì sao <code>/me/password</code> gọi cả <code>sessions.endAll</code> lẫn <code>refresh.revokeAll</code>?</li>
</ol>
<p><strong>Lời giải:</strong> (1) hết hạn — không ai thu hồi gì; <code>expires_at</code> của họ đơn giản đã qua, nên <code>EXPIRED</code> là đúng. (2) <code>REVOKED</code> — việc đổi mật khẩu đã thu hồi mọi họ kể cả cái mà cookie cũ của bạn trỏ tới. (3) một người dùng có cả phiên (Chương 3, web) lẫn họ refresh (Chương 5, client API); đổi mật khẩu phải kết thúc cả hai.</p>
<p><strong>Đạt khi:</strong> bạn gọi được tên năm sự kiện, thu hồi đúng phạm vi cho mỗi cái, và giải thích cửa sổ access ≤ 15 phút.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">server-side revocation (thu hồi phía máy chủ)</span><span class="v">Kết thúc một phiên bằng cách thu hồi họ refresh ở máy chủ, không phải xoá cookie.</span></div>
  <div class="kv"><span class="k">sign out everywhere (đăng xuất mọi nơi)</span><span class="v">Thu hồi mọi họ của một người; cũng là việc đổi mật khẩu làm.</span></div>
  <div class="kv"><span class="k">absolute expiry (hết hạn tuyệt đối)</span><span class="v">Điểm kết 30 ngày cố định của họ; sự kiện duy nhất không cần hành động.</span></div>
  <div class="kv"><span class="k">access-token window (cửa sổ access token)</span><span class="v">≤ 15 phút một access token đã phát vẫn chạy sau khi phiên kết thúc.</span></div>
  <div class="kv"><span class="k">credential change (đổi thông tin xác thực)</span><span class="v">Đổi mật khẩu (hoặc passkey); phải thu hồi mọi họ.</span></div>
  <div class="kv"><span class="k">family scope (phạm vi họ)</span><span class="v">Một họ = một thiết bị; thu hồi một cho điện thoại mất, tất cả cho mật khẩu lộ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Năm sự kiện kết thúc một phiên: đăng xuất, đăng xuất mọi nơi/đổi mật khẩu, phát hiện trộm, hết hạn, thu hồi từ trang thiết bị.</li>
<li>Mỗi cái thu hồi họ refresh ở máy chủ; chỉ xoá cookie không kết thúc phiên.</li>
<li>Đổi mật khẩu thu hồi <em>mọi</em> họ — một mật khẩu bị lộ không thể để một phiên còn sống.</li>
<li>Hết hạn là sự kiện duy nhất không cần hành động: 30 ngày của họ đơn giản trôi qua (<code>EXPIRED</code>).</li>
<li>Access token cũ nán lại ≤ 15 phút — cái giá của một token không trạng thái (bài 4.3).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Áp vào Node.js — bài 8.4: cookie, CSRF, thu hồi', sub: 'Cùng câu hỏi — làm sao thật sự kết thúc một phiên. Bài đó thu hồi JWT bằng bộ đếm tokenVersion trên Notes API; bài này thu hồi họ refresh trên năm sự kiện khác nhau và đo cửa sổ access token còn lại. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
