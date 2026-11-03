/**
 * Authentication · Chương 6 · 6.3 — Đặt lại mật khẩu, luồng bị tấn công nhiều nhất bạn có. Slug giữ: auth-6-3-dat-lai-mat-khau.
 * Output thật (_ma.mjs, 63-reset): forgot-password luôn cùng phản hồi; reset-password tiêu token một lần (15 phút) + đổi hash +
 * KẾT THÚC mọi phiên và thu hồi mọi họ refresh (5.3); cookie refresh cũ ⇒ REVOKED; đường dẫn reset dùng lần hai ⇒ USED.
 */
import G from '../giang/auth-06-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const LV = CODE.layer.split('\n');
const REQ_RESET = LV.slice(LV.findIndex((l) => l.includes('Ask for a password reset')), LV.findIndex((l) => l.includes('return { issueToken'))).join('\n').trim();
const SV = CODE.server06.split('\n');
const FORGOT = SV.slice(SV.findIndex((l) => l.includes('lesson 6.3, 6.4: ask')), SV.findIndex((l) => l.includes('lesson 6.4 TEACHING FOIL'))).join('\n').trim();
const RESET = SV.slice(SV.findIndex((l) => l.includes('lesson 6.3: consume a reset token')), SV.findIndex((l) => l.includes("app.post('/sign-in'"))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — Forgot Password Cheat Sheet', 'The canonical rules: random single-use time-limited token stored hashed, identical response whether or not the account exists, and invalidate sessions after a reset (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html'),
  nguon('📜', 'RFC 9700 — Best Current Practice for OAuth 2.0 Security (BCP 240, Jan 2025)', 'Why a credential change must revoke outstanding tokens — the same reasoning a password reset applies to sessions and refresh families (read 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700.html'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Forgot Password Cheat Sheet', 'Bộ luật chuẩn: token ngẫu nhiên dùng một lần có hạn lưu dạng băm, phản hồi y hệt dù tài khoản tồn tại hay không, và vô hiệu các phiên sau một lần reset (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html'),
  nguon('📜', 'RFC 9700 — Thực hành bảo mật OAuth 2.0 (BCP 240, 01/2025)', 'Vì sao đổi thông tin xác thực phải thu hồi token đang lưu — đúng lý lẽ một lần reset mật khẩu áp cho phiên và họ refresh (đọc 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Step</th><th>The attack if you skip it</th></tr></thead>
<tbody>
<tr><td>token is random + stored hashed</td><td>a DB dump or a log line is a list of working reset links (1.3)</td></tr>
<tr><td>single-use</td><td>an intercepted link works again after the user used it</td></tr>
<tr><td>short expiry (15 min)</td><td>a link in an archived mailbox resets the password months later</td></tr>
<tr><td>same response whether or not the account exists</td><td>the form becomes an account-enumeration oracle (6.4)</td></tr>
<tr><td>reset ends every session + refresh family</td><td>the attacker who was already signed in stays signed in after the victim "recovers"</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Bước</th><th>Cú tấn công nếu bỏ qua</th></tr></thead>
<tbody>
<tr><td>token ngẫu nhiên + lưu dạng băm</td><td>một bản dump DB hay một dòng log là danh sách đường dẫn reset chạy được (1.3)</td></tr>
<tr><td>dùng một lần</td><td>một đường dẫn bị chặn bắt vẫn chạy lại sau khi người dùng đã dùng</td></tr>
<tr><td>hết hạn ngắn (15 phút)</td><td>một đường dẫn trong hộp thư lưu trữ reset mật khẩu nhiều tháng sau</td></tr>
<tr><td>cùng phản hồi dù tài khoản có tồn tại hay không</td><td>form thành một nhà tiên tri dò tài khoản (6.4)</td></tr>
<tr><td>reset kết thúc mọi phiên + họ refresh</td><td>kẻ tấn công vốn đã đăng nhập vẫn đăng nhập sau khi nạn nhân "khôi phục"</td></tr>
</tbody>
</table>`;

export default {
  title: '6.3 — Password reset, the most attacked flow you own|||6.3 — Đặt lại mật khẩu, luồng bị tấn công nhiều nhất bạn có',
  slug: 'auth-6-3-dat-lai-mat-khau',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Đặt lại mật khẩu là đường vòng quanh mật khẩu — nên nó bị tấn công nhiều hơn chính ô đăng nhập. LabFlow ID v0.6: /forgot-password LUÔN cùng một phản hồi (không rò tài khoản — 6.4); /reset-password tiêu một token một lần 15 phút (ràng mục đích reset_password, băm), đặt mật khẩu mới, rồi KẾT THÚC mọi phiên và thu hồi mọi họ refresh (5.3) — nếu không, kẻ tấn công đang đăng nhập vẫn ở lại sau khi nạn nhân "khôi phục". Output thật cho thấy cookie refresh cũ trả REVOKED và đường dẫn reset dùng lần hai trả USED. Theo OWASP Forgot Password + RFC 9700.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Password reset, the most attacked flow you own</h2>
<p class="lead">A password reset is a way around the password. That is its whole purpose, and its whole danger: it is a second front door, attacked more often than the login box itself, because a flaw here hands over the account without needing the password at all. Lesson 6.2 built the one-time token; this lesson spends it on the highest-stakes door in the product.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> build a <code>/forgot-password</code> that gives one fixed response; a <code>/reset-password</code> that consumes a single-use, short-lived, purpose-bound token; and — the step most people forget — end every session and revoke every refresh family on reset, so recovery actually locks the attacker out.</p>
</div>

<h3>Request: one response, whoever asks</h3>
<p><code>/forgot-password</code> must not reveal whether the address has an account — that is Lesson 6.4's enumeration rule at its most important door. LabFlow ID issues the reset token and sends the email only for a real, active account, but returns the same body every time.</p>
${ma('javascript', FORGOT)}
${ma('javascript', REQ_RESET)}
<p>A stranger's address gets the same "if an account exists, a link is on its way" and no email. The reset token is the Lesson 6.2 primitive again — random, stored as a digest, but with a <strong>15-minute</strong> life, shorter than verification, because this link is the one worth stealing.</p>

<h3>Reset: consume, re-hash, and end everything</h3>
${ma('javascript', RESET)}
${ra(OUT['63-reset'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Consume the token once</span><span class="v"><code>consumeToken('reset_password', token)</code> is single-use and purpose-bound: a verify link cannot reset a password, and the reset link dies on first use. The output shows the second attempt returning <code>USED</code>.</span></div>
  <div class="kv"><span class="k">Re-check the new password</span><span class="v">The same policy as Chapter 2 — length floor, breach list — enforced here too. A reset is not a loophole around the strength rule.</span></div>
  <div class="kv"><span class="k">End every session and refresh family</span><span class="v"><code>sessions.endAll</code> + <code>refresh.revokeAll</code>. This is the step people skip, and it is the whole point: see below.</span></div>
  <div class="kv"><span class="k">Do not log the user in from the link</span><span class="v">A reset proves mailbox access, not intent to sign in on this device. Land them on the login page to type the new password — one more step for a takeover to fail on.</span></div>
</div>

<h3>Why reset MUST end every session</h3>
<div class="pitfall co-tieu-de">
<p><strong>The attack reset is supposed to stop.</strong> An attacker phishes a password and signs in — they now hold a live session and a refresh family. The victim notices something is off and "recovers" by resetting their password. If reset only changes the hash, the attacker's existing session and refresh token keep working: the victim locked the front door while the burglar was already inside. That is why <code>/reset-password</code> calls <code>revokeAll</code> — the output shows the old refresh cookie returning <code>REVOKED</code> right after the reset. Recovery that does not revoke is not recovery.</p>
</div>

<h3>When it goes wrong</h3>
${BANG_EN}

<h3>In interviews / at work</h3>
<ul>
<li><strong>"A user reset their password but the attacker still had access — why?"</strong> — The reset changed the hash but did not revoke sessions/refresh families. Call <code>revokeAll</code> on reset (and on any credential change).</li>
<li><strong>"How long should a reset link live?"</strong> — Minutes, not days. 15 is typical; it is the most valuable link you send, so it should expire fastest.</li>
<li><strong>"Should the reset link log the user in?"</strong> — Prefer not: it turns the mailbox into a login credential. If you must, make the session low-trust and re-prompt for the new password before anything sensitive.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>bash demo6/reset.sh</code>. An is signed in; after the reset, what does her old refresh cookie return on <code>/refresh</code>?</li>
<li>Try the reset link a second time. What error, and which property of the token causes it?</li>
<li>Remove the <code>refresh.revokeAll</code> line from <code>/reset-password</code>. Re-run and show that the old refresh cookie still works — describe the attack you just re-enabled.</li>
</ol>
<p><strong>Solution:</strong> (1) <code>REVOKED</code> — the reset revoked every family. (2) <code>USED</code> — the token is single-use. (3) without <code>revokeAll</code>, the pre-reset refresh token still rotates, so an attacker who was signed in before the reset keeps their session — the exact failure this lesson's pitfall describes.</p>
<p><strong>Done when:</strong> a reset ends every session, the link works exactly once, and <code>/forgot-password</code> answers identically for a real and a fake address.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">password reset</span><span class="v">Recovering access without the old password, by proving mailbox ownership.</span></div>
  <div class="kv"><span class="k">reset token</span><span class="v">A one-time, short-lived (15 min), purpose-bound token sent in the reset email.</span></div>
  <div class="kv"><span class="k">session invalidation</span><span class="v">Ending every session and refresh family on a credential change (<code>revokeAll</code>).</span></div>
  <div class="kv"><span class="k">recovery takeover</span><span class="v">The attack where a reset changes the hash but leaves the attacker's session alive.</span></div>
  <div class="kv"><span class="k">fixed response</span><span class="v">One identical reply from <code>/forgot-password</code>, whoever the address belongs to.</span></div>
  <div class="kv"><span class="k">credential change</span><span class="v">A password reset or change; the trigger for revoking outstanding tokens.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Reset is a second front door; a flaw here gives the account away without the password.</li>
<li><code>/forgot-password</code> gives one fixed response — never reveal whether the account exists (6.4).</li>
<li>The reset token is single-use, purpose-bound, stored hashed, and short-lived (15 min).</li>
<li>On reset, end every session and revoke every refresh family — or recovery does not lock the attacker out.</li>
<li>Prefer not to log the user in from the link; the mailbox should not be a login credential.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-5-3-rate-limit', title: 'Compare in API Design — lesson 5.3: rate limiting', sub: 'The reset request endpoint is a classic target for abuse (mail bombing, enumeration by volume); rate limiting per account and per IP is the companion control. Each lesson stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Đặt lại mật khẩu, luồng bị tấn công nhiều nhất bạn có</h2>
<p class="lead">Đặt lại mật khẩu là một đường đi vòng quanh mật khẩu. Đó là toàn bộ mục đích của nó, và toàn bộ hiểm hoạ của nó: nó là một cửa trước thứ hai, bị tấn công thường xuyên hơn chính ô đăng nhập, vì một lỗ hổng ở đây trao cả tài khoản mà chẳng cần tới mật khẩu. Bài 6.2 dựng token một lần; bài này tiêu nó ở cánh cửa cao giá nhất trong sản phẩm.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> dựng một <code>/forgot-password</code> cho đúng một phản hồi cố định; một <code>/reset-password</code> tiêu một token dùng một lần, có hạn ngắn, ràng mục đích; và — bước hầu hết mọi người quên — kết thúc mọi phiên và thu hồi mọi họ refresh khi reset, để khôi phục thật sự khoá được kẻ tấn công ra ngoài.</p>
</div>

<h3>Yêu cầu: một phản hồi, bất kể ai hỏi</h3>
<p><code>/forgot-password</code> không được tiết lộ địa chỉ có tài khoản hay không — đó là luật dò tài khoản của Bài 6.4 ở cánh cửa quan trọng nhất của nó. LabFlow ID phát token reset và gửi thư CHỈ cho một tài khoản thật, đang hoạt động, nhưng trả về cùng một nội dung mọi lần.</p>
${ma('javascript', FORGOT)}
${ma('javascript', REQ_RESET)}
<p>Địa chỉ của một người lạ nhận đúng câu "nếu một tài khoản tồn tại, một đường dẫn đang trên đường tới" và không có thư. Token reset lại là nguyên thuỷ của Bài 6.2 — ngẫu nhiên, lưu dạng digest, nhưng với đời <strong>15 phút</strong>, ngắn hơn xác minh, vì đường dẫn này mới là cái đáng trộm.</p>

<h3>Đặt lại: tiêu token, băm lại, và kết thúc mọi thứ</h3>
${ma('javascript', RESET)}
${ra(OUT['63-reset'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Tiêu token một lần</span><span class="v"><code>consumeToken('reset_password', token)</code> dùng một lần và ràng mục đích: một đường dẫn xác minh không reset được mật khẩu, và đường dẫn reset chết ở lần dùng đầu. Output cho thấy lần thử thứ hai trả về <code>USED</code>.</span></div>
  <div class="kv"><span class="k">Kiểm lại mật khẩu mới</span><span class="v">Cùng chính sách Chương 2 — sàn độ dài, danh sách rò rỉ — thi hành cả ở đây. Một lần reset không phải một lỗ hổng lách luật độ mạnh.</span></div>
  <div class="kv"><span class="k">Kết thúc mọi phiên và họ refresh</span><span class="v"><code>sessions.endAll</code> + <code>refresh.revokeAll</code>. Đây là bước người ta bỏ qua, và nó chính là điểm mấu chốt: xem dưới.</span></div>
  <div class="kv"><span class="k">Đừng đăng nhập người dùng từ đường dẫn</span><span class="v">Một lần reset chứng minh quyền đọc hộp thư, không phải ý muốn đăng nhập trên thiết bị này. Đưa họ tới trang đăng nhập để gõ mật khẩu mới — thêm một bước nữa cho một cú chiếm tài khoản hỏng.</span></div>
</div>

<h3>Vì sao reset PHẢI kết thúc mọi phiên</h3>
<div class="pitfall co-tieu-de">
<p><strong>Cú tấn công mà reset lẽ ra phải chặn.</strong> Một kẻ tấn công lừa lấy một mật khẩu và đăng nhập — giờ hắn giữ một phiên sống và một họ refresh. Nạn nhân thấy có gì không ổn và "khôi phục" bằng cách đặt lại mật khẩu. Nếu reset chỉ đổi hash, phiên và refresh token sẵn có của kẻ tấn công vẫn chạy: nạn nhân khoá cửa trước trong khi tên trộm đã ở bên trong. Chính vì thế <code>/reset-password</code> gọi <code>revokeAll</code> — output cho thấy cookie refresh cũ trả về <code>REVOKED</code> ngay sau khi reset. Khôi phục mà không thu hồi thì không phải khôi phục.</p>
</div>

<h3>Khi nó hỏng</h3>
${BANG_VI}

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Một người dùng đặt lại mật khẩu mà kẻ tấn công vẫn còn truy cập — vì sao?"</strong> — Reset đổi hash nhưng không thu hồi phiên/họ refresh. Gọi <code>revokeAll</code> khi reset (và khi đổi bất kỳ thông tin xác thực nào).</li>
<li><strong>"Đường dẫn reset nên sống bao lâu?"</strong> — Phút, không phải ngày. 15 là điển hình; nó là đường dẫn giá trị nhất bạn gửi, nên nên hết hạn nhanh nhất.</li>
<li><strong>"Đường dẫn reset có nên đăng nhập người dùng?"</strong> — Nên không: nó biến hộp thư thành một tín vật đăng nhập. Nếu buộc phải, hãy để phiên đó ít tin cậy và hỏi lại mật khẩu mới trước khi làm gì nhạy cảm.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>bash demo6/reset.sh</code>. An đang đăng nhập; sau khi reset, cookie refresh cũ của cô trả gì ở <code>/refresh</code>?</li>
<li>Thử đường dẫn reset lần thứ hai. Lỗi gì, và tính chất nào của token gây ra nó?</li>
<li>Bỏ dòng <code>refresh.revokeAll</code> khỏi <code>/reset-password</code>. Chạy lại và cho thấy cookie refresh cũ vẫn chạy — mô tả cú tấn công bạn vừa bật lại.</li>
</ol>
<p><strong>Lời giải:</strong> (1) <code>REVOKED</code> — reset đã thu hồi mọi họ. (2) <code>USED</code> — token dùng một lần. (3) không có <code>revokeAll</code>, refresh token trước-reset vẫn xoay, nên một kẻ tấn công đã đăng nhập trước khi reset vẫn giữ phiên — đúng cái hỏng mà bẫy của bài này mô tả.</p>
<p><strong>Đạt khi:</strong> một lần reset kết thúc mọi phiên, đường dẫn chạy đúng một lần, và <code>/forgot-password</code> trả lời y hệt cho một địa chỉ thật và một địa chỉ giả.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">password reset (đặt lại mật khẩu)</span><span class="v">Khôi phục truy cập mà không cần mật khẩu cũ, bằng cách chứng minh quyền sở hữu hộp thư.</span></div>
  <div class="kv"><span class="k">reset token (token đặt lại)</span><span class="v">Một token dùng một lần, có hạn ngắn (15 phút), ràng mục đích, gửi trong thư reset.</span></div>
  <div class="kv"><span class="k">session invalidation (vô hiệu phiên)</span><span class="v">Kết thúc mọi phiên và họ refresh khi đổi thông tin xác thực (<code>revokeAll</code>).</span></div>
  <div class="kv"><span class="k">recovery takeover (chiếm qua khôi phục)</span><span class="v">Cú tấn công mà một lần reset đổi hash nhưng để phiên của kẻ tấn công còn sống.</span></div>
  <div class="kv"><span class="k">fixed response (phản hồi cố định)</span><span class="v">Một câu trả lời y hệt từ <code>/forgot-password</code>, bất kể địa chỉ thuộc về ai.</span></div>
  <div class="kv"><span class="k">credential change (đổi thông tin xác thực)</span><span class="v">Một lần reset hay đổi mật khẩu; cái cò kích hoạt thu hồi token đang lưu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Reset là một cửa trước thứ hai; một lỗ hổng ở đây trao cả tài khoản mà không cần mật khẩu.</li>
<li><code>/forgot-password</code> cho đúng một phản hồi cố định — không bao giờ tiết lộ tài khoản có tồn tại không (6.4).</li>
<li>Token reset dùng một lần, ràng mục đích, lưu dạng băm, và có hạn ngắn (15 phút).</li>
<li>Khi reset, kết thúc mọi phiên và thu hồi mọi họ refresh — không thì khôi phục không khoá được kẻ tấn công.</li>
<li>Nên không đăng nhập người dùng từ đường dẫn; hộp thư không nên là một tín vật đăng nhập.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-5-3-rate-limit', title: 'So với API Design — bài 5.3: giới hạn tần suất', sub: 'Tuyến yêu cầu reset là một mục tiêu kinh điển cho lạm dụng (dội thư, dò theo lượng); giới hạn tần suất theo tài khoản và theo IP là lớp đi kèm. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
