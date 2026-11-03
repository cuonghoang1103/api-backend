/**
 * Authentication · Chương 10 · 10.3 — Cắp phiên: bốn kênh, và mỗi kênh với tới được cái gì. Slug giữ: auth-10-3-cap-phien.
 * Output THẬT từ _ma.mjs: demo10/session-channels.mjs (ma trận nơi-giữ-token × kênh-trộm).
 */
import G from '../giang/auth-10-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('🍪', 'OWASP — Session Management Cheat Sheet', 'Cookie flags (HttpOnly, Secure, __Host-), token storage, and detecting stolen sessions (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('🛡️', 'OWASP — Credential Stuffing Prevention Cheat Sheet', 'Session protection in context of account-takeover defences (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🍪', 'OWASP — Session Management Cheat Sheet', 'Cờ cookie (HttpOnly, Secure, __Host-), nơi giữ token, và phát hiện phiên bị trộm (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('🛡️', 'OWASP — Credential Stuffing Prevention Cheat Sheet', 'Bảo vệ phiên trong bối cảnh phòng thủ chiếm tài khoản (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html'),
].join('\n');

export default {
  title: '10.3 — Session theft: four channels, and what each one can reach|||10.3 — Cắp phiên: bốn kênh, và mỗi kênh với tới được cái gì',
  slug: 'auth-10-3-cap-phien',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Sau một relay hay một XSS, kẻ tấn công không cần mật khẩu — họ cần PHIÊN. Một cookie phiên bị trộm CHÍNH LÀ bạn (Chương 3): không mật khẩu, không yếu tố thứ hai. Bốn kênh trộm token: (1) XSS — JavaScript đọc token trong localStorage hay cookie không-HttpOnly (HttpOnly đóng với cookie); (2) mạng — token qua HTTP trần bị đọc trên dây (Secure + HTTPS đóng); (3) thiết bị — mã độc/máy dùng chung đọc token trên đĩa (TTL ngắn + gắn thiết bị thu nhỏ thiệt hại); (4) log/URL — token trong URL rò vào log, lịch sử, Referer (Chương 1: cookie không URL, che log). Ma trận đo thật: cookie __Host- HttpOnly Secure gục trước KHÔNG kênh nào; localStorage là chỗ TỆ NHẤT (XSS + trên đĩa). Không kênh nào cần mật khẩu — phát hiện việc dùng phiên bị trộm (gắn thiết bị/IP, cảnh báo nước mới, danh sách phiên Ch5). Theo OWASP Session Management.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Session theft: four channels, and what each one can reach</h2>
<p class="lead">After a relay or a cross-site script, the attacker does not want your password — they want your session. A stolen session cookie <em>is</em> you (Chapter 3): no password, no second factor needed, full access. So the practical question is: through which channels does a session token leak, and where can you keep it so none of them reach it?</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> name the four channels a session token is stolen through; say which cookie flag or storage choice closes each; and explain why none of them needed the login at all.</p>
</div>

<h3>The four channels</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · XSS</span><span class="lz-lnote">Injected JavaScript reads whatever JS can reach — <code>localStorage</code> or a non-HttpOnly cookie. The most common channel; <strong>HttpOnly</strong> closes it for cookies.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · The network</span><span class="lz-lnote">A token over plain HTTP is read on the wire. <strong>Secure</strong> + HTTPS everywhere means it is never sent in clear.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · The device</span><span class="lz-lnote">Malware or a shared machine reads tokens on disk. Short TTL, re-auth and device binding shrink the blast radius.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Logs &amp; URLs</span><span class="lz-lnote">A token in a URL leaks to logs, history and the <code>Referer</code> (Chapter 1). Keep tokens in cookies, never URLs; redact logs.</span></div>
</div>

<h3>The matrix: where you keep it × what can steal it</h3>
<p>The demo tabulates each storage choice against each channel:</p>
${ra(OUT['103-channels'])}
<p>Read the rows. A JS-readable cookie and <code>localStorage</code> both fall to XSS; <code>localStorage</code> also sits on disk. A token in a URL leaks to logs. The <code>__Host-</code>, HttpOnly, Secure cookie (Chapter 3) falls to <em>none</em> of the four — it is the one safe place to keep a session.</p>

<h3>Why not localStorage</h3>
<p><code>localStorage</code> is the worst home for a session token, and "store the JWT in localStorage" is common, dangerous advice. It is JavaScript-readable by design, so a <em>single</em> XSS anywhere on your origin exfiltrates it, and it persists on disk. The HttpOnly cookie is unreadable by JavaScript precisely so an XSS cannot hand it over — the whole point of the flag.</p>

<h3>Detect what you cannot prevent</h3>
<p>You cannot block every theft — a compromised device will leak a token. So detect the <em>use</em> of a stolen session: bind the session to a device or IP range, alert when a session suddenly appears from a new country, and let users see and revoke their active sessions (the device list from Chapter 5). A token that only works on the device it was issued to is far less useful to a thief.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — thinking strong login makes the session safe.</strong> Every one of these four channels bypasses the login entirely. The password hashing, MFA and OIDC all guard the front door; the session cookie is a window. A stolen cookie needs none of them — which is why where you store it, and detecting its misuse, matter as much as how you authenticate.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Where should a session token live — cookie or localStorage?"</strong> — A <code>__Host-</code> HttpOnly Secure cookie. localStorage is JS-readable, so any XSS steals it.</li>
<li><strong>"What does HttpOnly actually protect against?"</strong> — XSS reading the cookie: JavaScript cannot see an HttpOnly cookie, so injected script cannot exfiltrate it.</li>
<li><strong>"If a session is stolen, how do you limit the damage?"</strong> — Short TTLs, re-auth for sensitive actions, device/IP binding, new-device alerts, and a user-visible revoke list.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo10/session-channels.mjs</code>. Which single storage choice is stolen by no channel, and which is stolen by the most?</li>
<li>Explain why HttpOnly does nothing for a token kept in <code>localStorage</code>.</li>
<li>Name one thing none of the four channels needed — and what that implies for your defences.</li>
</ol>
<p><strong>Solution:</strong> (1) the <code>__Host-</code> HttpOnly Secure cookie is stolen by none; <code>localStorage</code> is stolen by XSS and the device channel. (2) HttpOnly is a cookie flag — it has no effect on <code>localStorage</code>, which is always JavaScript-readable, so an XSS reads it regardless. (3) none needed the password or the second factor — so a strong login is not enough; token storage and stolen-session detection matter independently.</p>
<p><strong>Done when:</strong> you keep the session in a <code>__Host-</code> HttpOnly Secure cookie, never localStorage, and you can name a detection for a stolen session.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">session theft</span><span class="v">Stealing the session token to become the user with no login.</span></div>
  <div class="kv"><span class="k">HttpOnly</span><span class="v">A cookie flag that hides the cookie from JavaScript — closes the XSS channel.</span></div>
  <div class="kv"><span class="k">Secure / <code>__Host-</code></span><span class="v">Flags that keep a cookie HTTPS-only and host-scoped — closes the network channel.</span></div>
  <div class="kv"><span class="k">device binding</span><span class="v">Tying a session to a device so a stolen token is useless elsewhere.</span></div>
  <div class="kv"><span class="k">session revocation</span><span class="v">A user-visible list to end active sessions (Chapter 5) — stops a stolen one.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A stolen session is full access with no login — none of these channels need the password.</li>
<li>Four channels: XSS (HttpOnly), the network (Secure+TLS), the device (short TTL, binding), logs/URLs (cookies not URLs, redact).</li>
<li>Keep the token in a <code>__Host-</code> HttpOnly Secure cookie — never localStorage.</li>
<li>You cannot prevent every theft, so detect stolen-session <em>use</em>: binding, new-device alerts, a revoke list.</li>
<li>Strong authentication guards the door; the session cookie is the window.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-3-2-thuoc-tinh-cookie', title: 'Back to 3.2 — the __Host- HttpOnly Secure cookie', sub: 'There, setting the session cookie flags that make it host-scoped, HTTPS-only and invisible to JavaScript. Here, those exact flags are what close three of the four theft channels. One cookie, two lessons.', cta: 'OPEN LESSON 3.2 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Cắp phiên: bốn kênh, và mỗi kênh với tới được cái gì</h2>
<p class="lead">Sau một relay hay một cross-site script, kẻ tấn công không muốn mật khẩu của bạn — họ muốn phiên của bạn. Một cookie phiên bị trộm <em>chính là</em> bạn (Chương 3): không cần mật khẩu, không cần yếu tố thứ hai, toàn quyền truy cập. Nên câu hỏi thực tế là: qua những kênh nào một token phiên rò ra, và bạn giữ nó ở đâu để không kênh nào với tới?</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> gọi tên bốn kênh một token phiên bị trộm qua; nói cờ cookie hay lựa chọn lưu trữ nào đóng mỗi kênh; và giải thích vì sao không kênh nào cần lần đăng nhập cả.</p>
</div>

<h3>Bốn kênh</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · XSS</span><span class="lz-lnote">JavaScript tiêm vào đọc bất cứ gì JS với tới — <code>localStorage</code> hay một cookie không-HttpOnly. Kênh phổ biến nhất; <strong>HttpOnly</strong> đóng nó với cookie.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Mạng</span><span class="lz-lnote">Một token qua HTTP trần bị đọc trên dây. <strong>Secure</strong> + HTTPS khắp nơi nghĩa là nó không bao giờ gửi dạng trần.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Thiết bị</span><span class="lz-lnote">Mã độc hay máy dùng chung đọc token trên đĩa. TTL ngắn, xác thực lại và gắn thiết bị thu nhỏ bán kính thiệt hại.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Log &amp; URL</span><span class="lz-lnote">Một token trong URL rò vào log, lịch sử và <code>Referer</code> (Chương 1). Giữ token trong cookie, không bao giờ URL; che log.</span></div>
</div>

<h3>Ma trận: nơi bạn giữ nó × cái gì trộm được</h3>
<p>Demo lập bảng mỗi lựa chọn lưu trữ với mỗi kênh:</p>
${ra(OUT['103-channels'])}
<p>Đọc các hàng. Một cookie đọc-được-bằng-JS và <code>localStorage</code> đều gục trước XSS; <code>localStorage</code> còn nằm trên đĩa. Một token trong URL rò vào log. Cookie <code>__Host-</code>, HttpOnly, Secure (Chương 3) gục trước <em>không</em> kênh nào trong bốn — nó là chỗ an toàn duy nhất để giữ một phiên.</p>

<h3>Vì sao không dùng localStorage</h3>
<p><code>localStorage</code> là chỗ ở tệ nhất cho một token phiên, và "lưu JWT trong localStorage" là lời khuyên phổ biến, nguy hiểm. Nó đọc-được-bằng-JavaScript theo thiết kế, nên một XSS <em>duy nhất</em> ở bất kỳ đâu trên origin của bạn rút nó ra, và nó nằm lại trên đĩa. Cookie HttpOnly không đọc được bằng JavaScript chính là để một XSS không trao nó đi được — toàn bộ mục đích của cờ.</p>

<h3>Phát hiện cái bạn không ngăn được</h3>
<p>Bạn không chặn được mọi vụ trộm — một thiết bị bị xâm nhập sẽ rò một token. Nên hãy phát hiện việc <em>dùng</em> một phiên bị trộm: gắn phiên với một thiết bị hay dải IP, cảnh báo khi một phiên đột nhiên xuất hiện từ một nước mới, và cho người dùng thấy và thu hồi các phiên đang hoạt động (danh sách thiết bị Chương 5). Một token chỉ chạy trên thiết bị nó được phát ra thì ít hữu ích hơn nhiều cho một kẻ trộm.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tưởng đăng nhập mạnh làm phiên an toàn.</strong> Mỗi kênh trong bốn kênh này vượt qua lần đăng nhập hoàn toàn. Băm mật khẩu, MFA và OIDC đều canh cửa trước; cookie phiên là một cửa sổ. Một cookie bị trộm không cần cái nào trong số đó — vì thế bạn lưu nó ở đâu, và phát hiện việc lạm dụng nó, quan trọng ngang cách bạn xác thực.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Một token phiên nên sống ở đâu — cookie hay localStorage?"</strong> — Một cookie <code>__Host-</code> HttpOnly Secure. localStorage đọc-được-bằng-JS, nên bất kỳ XSS nào trộm nó.</li>
<li><strong>"HttpOnly thực sự bảo vệ trước cái gì?"</strong> — XSS đọc cookie: JavaScript không thấy một cookie HttpOnly, nên script tiêm vào không rút nó ra được.</li>
<li><strong>"Nếu một phiên bị trộm, làm sao giới hạn thiệt hại?"</strong> — TTL ngắn, xác thực lại cho thao tác nhạy cảm, gắn thiết bị/IP, cảnh báo thiết bị mới, và một danh sách thu hồi người dùng thấy được.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo10/session-channels.mjs</code>. Lựa chọn lưu trữ nào bị không kênh nào trộm, và cái nào bị nhiều kênh nhất trộm?</li>
<li>Giải thích vì sao HttpOnly không làm gì cho một token giữ trong <code>localStorage</code>.</li>
<li>Gọi tên một thứ không kênh nào trong bốn kênh cần — và điều đó hàm ý gì cho phòng thủ của bạn.</li>
</ol>
<p><strong>Lời giải:</strong> (1) cookie <code>__Host-</code> HttpOnly Secure bị không kênh nào trộm; <code>localStorage</code> bị XSS và kênh thiết bị trộm. (2) HttpOnly là một cờ cookie — nó không có tác dụng gì với <code>localStorage</code>, thứ luôn đọc-được-bằng-JavaScript, nên một XSS đọc nó bất kể. (3) không cái nào cần mật khẩu hay yếu tố thứ hai — nên một đăng nhập mạnh là chưa đủ; nơi lưu token và phát hiện phiên bị trộm quan trọng một cách độc lập.</p>
<p><strong>Đạt khi:</strong> bạn giữ phiên trong một cookie <code>__Host-</code> HttpOnly Secure, không bao giờ localStorage, và bạn gọi được tên một cách phát hiện một phiên bị trộm.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">session theft (cắp phiên)</span><span class="v">Trộm token phiên để trở thành người dùng mà không cần đăng nhập.</span></div>
  <div class="kv"><span class="k">HttpOnly</span><span class="v">Một cờ cookie giấu cookie khỏi JavaScript — đóng kênh XSS.</span></div>
  <div class="kv"><span class="k">Secure / <code>__Host-</code></span><span class="v">Các cờ giữ một cookie chỉ-HTTPS và gắn-host — đóng kênh mạng.</span></div>
  <div class="kv"><span class="k">device binding (gắn thiết bị)</span><span class="v">Buộc một phiên với một thiết bị để một token bị trộm vô dụng ở nơi khác.</span></div>
  <div class="kv"><span class="k">session revocation (thu hồi phiên)</span><span class="v">Một danh sách người dùng thấy được để kết thúc các phiên đang hoạt động (Chương 5) — chặn một cái bị trộm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một phiên bị trộm là toàn quyền truy cập không cần đăng nhập — không kênh nào cần mật khẩu.</li>
<li>Bốn kênh: XSS (HttpOnly), mạng (Secure+TLS), thiết bị (TTL ngắn, gắn), log/URL (cookie không URL, che).</li>
<li>Giữ token trong một cookie <code>__Host-</code> HttpOnly Secure — không bao giờ localStorage.</li>
<li>Bạn không ngăn được mọi vụ trộm, nên phát hiện việc <em>dùng</em> phiên bị trộm: gắn, cảnh báo thiết bị mới, một danh sách thu hồi.</li>
<li>Xác thực mạnh canh cửa; cookie phiên là cửa sổ.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-3-2-thuoc-tinh-cookie', title: 'Quay lại 3.2 — cookie __Host- HttpOnly Secure', sub: 'Ở đó, đặt các cờ cookie phiên làm nó gắn-host, chỉ-HTTPS và vô hình với JavaScript. Ở đây, đúng các cờ đó là thứ đóng ba trong bốn kênh trộm. Một cookie, hai bài.', cta: 'MỞ BÀI 3.2 →' })}
</div>
`,
};
