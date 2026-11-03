/**
 * Authentication · Chương 6 · 6.5 — Đổi địa chỉ, và kết thúc tài khoản. Slug giữ: auth-6-5-doi-email-va-xoa.
 * Output thật (_ma.mjs, 65-change-delete): đổi email ⇒ địa chỉ mới CHƯA xác minh + thư xác minh riêng; xoá ⇒ xác thực lại
 * mật khẩu, status='deleted', thu hồi mọi phiên + họ refresh, rồi đăng nhập hỏng như email lạ. LabFlow ID v0.6.
 */
import G from '../giang/auth-06-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const SV = CODE.server06.split('\n');
const CHANGE = SV.slice(SV.findIndex((l) => l.includes('lesson 6.5: change the email')), SV.findIndex((l) => l.includes('lesson 6.5: end the account'))).join('\n').trim();
const DELETE = SV.slice(SV.findIndex((l) => l.includes('lesson 6.5: end the account')), SV.findIndex((l) => l.includes('lesson 3.3 + 5.3'))).join('\n').trim();
const UV = CODE.users.split('\n');
const USERS_LC = UV.slice(UV.findIndex((l) => l.includes('updateEmail')), UV.findIndex((l) => l.includes('setStatus')) + 3).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — Authentication Cheat Sheet (re-authentication)', 'A sensitive action — changing an email, deleting an account — should re-verify the password even inside a live session (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('⚖️', 'GDPR Art. 17 — Right to erasure ("right to be forgotten")', 'A user may request deletion of their personal data; soft-delete then a retention window, with legal/audit exceptions, is the common engineering shape (read 04/11/2026).', 'https://gdpr-info.eu/art-17-gdpr/'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Authentication Cheat Sheet (xác thực lại)', 'Một hành động nhạy cảm — đổi email, xoá tài khoản — nên kiểm lại mật khẩu kể cả trong một phiên đang sống (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('⚖️', 'GDPR Điều 17 — Quyền được xoá ("quyền được lãng quên")', 'Một người dùng có thể yêu cầu xoá dữ liệu cá nhân; xoá-mềm rồi một cửa sổ lưu giữ, có ngoại lệ pháp lý/kiểm toán, là hình kỹ thuật phổ biến (đọc 04/11/2026).', 'https://gdpr-info.eu/art-17-gdpr/'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Action</th><th>Must also…</th><th>Why</th></tr></thead>
<tbody>
<tr><td>change email</td><td>mark the new address unverified + send a verify link to it</td><td>a typed address is a claim again (6.1); until proven, reset must not reach it (6.2)</td></tr>
<tr><td>change email</td><td>notify the OLD address too (in production)</td><td>if an attacker in a live session changes it, the real owner finds out</td></tr>
<tr><td>delete account</td><td>re-authenticate with the password</td><td>a borrowed, unlocked laptop should not be able to erase an account</td></tr>
<tr><td>delete account</td><td>revoke every session + refresh family</td><td>a deleted account with live tokens is a ghost that still acts</td></tr>
<tr><td>delete account</td><td>soft-delete (status), then purge on a retention window</td><td>recovery from mistakes, legal/audit holds, and referential integrity</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Hành động</th><th>Phải còn…</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>đổi email</td><td>đánh dấu địa chỉ mới chưa xác minh + gửi link xác minh tới nó</td><td>một địa chỉ gõ vào lại là một lời khai (6.1); tới khi chứng minh, reset không được tới nó (6.2)</td></tr>
<tr><td>đổi email</td><td>báo cả địa chỉ CŨ (ở production)</td><td>nếu một kẻ tấn công trong một phiên sống đổi nó, chủ thật biết được</td></tr>
<tr><td>xoá tài khoản</td><td>xác thực lại bằng mật khẩu</td><td>một laptop mượn, chưa khoá không được phép xoá một tài khoản</td></tr>
<tr><td>xoá tài khoản</td><td>thu hồi mọi phiên + họ refresh</td><td>một tài khoản đã xoá còn token sống là một bóng ma vẫn hành động</td></tr>
<tr><td>xoá tài khoản</td><td>xoá-mềm (status), rồi dọn theo một cửa sổ lưu giữ</td><td>khôi phục khỏi nhầm lẫn, giữ pháp lý/kiểm toán, và toàn vẹn tham chiếu</td></tr>
</tbody>
</table>`;

export default {
  title: '6.5 — Changing the address, and ending the account|||6.5 — Đổi địa chỉ, và kết thúc tài khoản',
  slug: 'auth-6-5-doi-email-va-xoa',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Hai hành động cuối của vòng đời, cả hai NHẠY CẢM. Đổi email (LabFlow ID v0.6): địa chỉ mới quay về trạng thái CHƯA xác minh (users.updateEmail xoá email_verified_at) và phải chứng minh lại bằng một thư xác minh riêng — một email chưa chứng minh không được nhận reset (6.2). Xoá tài khoản: xác thực lại bằng mật khẩu (một laptop mượn không được xoá), đặt status=deleted (xoá-mềm — khôi phục/kiểm toán/toàn vẹn tham chiếu, so GDPR Điều 17), rồi thu hồi MỌI phiên và họ refresh để không còn một bóng ma token sống. Output thật cho thấy đăng nhập sau đó hỏng như một email lạ.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Changing the address, and ending the account</h2>
<p class="lead">The lifecycle ends with the two actions people treat as routine and attackers treat as a gift: changing the email, and deleting the account. Both are sensitive — one quietly moves where every future reset link goes, the other erases the row that every other table points at. This lesson gives each the care it needs, and closes the chapter where it began: a credential change must leave no session alive.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> change an email so the new address starts unverified and must be re-proven; delete an account with re-authentication, soft-delete and full session revocation; and explain why both actions are credential changes that end every session.</p>
</div>

<h3>Changing the email returns the address to a claim</h3>
<p>A new email is a new claim (Lesson 6.1), so changing it must drop the account back to unverified and send a fresh verify link — otherwise a user could change to an address they do not own and start receiving reset links there. LabFlow ID's <code>users.updateEmail</code> clears <code>email_verified_at</code> in the same statement that writes the new address:</p>
${ma('javascript', USERS_LC)}
${ma('javascript', CHANGE)}
<div class="kv-grid">
  <div class="kv"><span class="k">The new address is unverified until proven</span><span class="v">Exactly the 6.1 rule: a typed address is a claim. Until the user clicks the verify link, reset and security mail must not treat the new address as real.</span></div>
  <div class="kv"><span class="k">Notify the old address (in production)</span><span class="v">If an attacker in a live session changes the email, a notice to the previous address is how the real owner finds out in time to react. The sandbox demo omits the second mail for brevity; a real build sends it.</span></div>
  <div class="kv"><span class="k">Re-authenticate for truly sensitive changes</span><span class="v">A live session is not proof the human is still at the keyboard. For high-value changes, re-prompt for the password (as <code>/me/delete</code> does below).</span></div>
</div>

<h3>Ending the account: re-auth, soft-delete, revoke everything</h3>
${ma('javascript', DELETE)}
${ra(OUT['65-change-delete'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Re-authenticate first</span><span class="v">Deletion verifies the password even inside a live session — a borrowed, unlocked laptop must not be able to erase an account. A failed re-auth returns <code>REAUTH_FAILED</code>.</span></div>
  <div class="kv"><span class="k">Soft-delete, not a hard DELETE</span><span class="v"><code>setStatus(id, 'deleted')</code> flips a flag; <code>findByEmail</code> already filters <code>status = 'active'</code>, so the account vanishes from every flow. A background job purges after a retention window. This buys mistake-recovery, legal/audit holds, and referential integrity for the rows that point at this user.</span></div>
  <div class="kv"><span class="k">Revoke every session and refresh family</span><span class="v"><code>sessions.endAll</code> + <code>refresh.revokeAll</code> + clearing this session's cookies. A deleted account whose tokens still verify is a ghost that keeps acting — the same reasoning as reset (6.3).</span></div>
  <div class="kv"><span class="k">The address frees up correctly</span><span class="v">Because the row is soft-deleted and <code>findByEmail</code> ignores non-active rows, a later sign-in with that email fails like any unknown address — the output's last line.</span></div>
</div>

<h3>When it goes wrong</h3>
${BANG_EN}
<div class="pitfall co-tieu-de">
<p><strong>Trap — hard-deleting the user row.</strong> A <code>DELETE FROM users</code> looks clean until a foreign key from audit logs, orders or messages either blocks it or cascades and erases history you are legally required to keep. Soft-delete (a status flag) plus a retention job is the shape that survives contact with a real schema — and it lets a user who deleted by mistake, or a support ticket, undo it within the window.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"User changed their email and then couldn't reset — why?"</strong> — The new address is unverified by design; reset is gated on verification (6.2). They must click the new verify link first.</li>
<li><strong>"Why re-authenticate to delete inside a logged-in session?"</strong> — A live session is not proof the human is present. Re-auth stops a borrowed, unlocked device from erasing the account.</li>
<li><strong>"Hard delete or soft delete?"</strong> — Soft-delete (status) plus a retention purge: recovery from mistakes, legal/audit holds, and referential integrity with every table that references the user.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>bash demo6/change-delete.sh</code>. After the email change, is the new address verified? What mail is sent?</li>
<li>After the delete, try to sign in with the deleted account's email. What happens, and which filter in <code>findByEmail</code> causes it?</li>
<li>Call <code>/me/delete</code> with the wrong password. What status code, and why does deletion require it even in a live session?</li>
</ol>
<p><strong>Solution:</strong> (1) the new address is unverified and receives its own "verify your new email" link. (2) sign-in fails like an unknown email, because <code>findByEmail</code> filters <code>status = 'active'</code> and the row is now <code>deleted</code>. (3) <code>403 REAUTH_FAILED</code> — a live session is not proof the human is present, so a destructive action re-verifies the password.</p>
<p><strong>Done when:</strong> a changed email starts unverified, and a deleted account cannot sign in and holds no live session.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">re-authentication</span><span class="v">Re-verifying the password for a sensitive action inside an already-authenticated session.</span></div>
  <div class="kv"><span class="k">soft delete</span><span class="v">Marking a row deleted (a status) instead of removing it, then purging later.</span></div>
  <div class="kv"><span class="k">retention window</span><span class="v">The time a soft-deleted account is kept before a background job purges it.</span></div>
  <div class="kv"><span class="k">right to erasure</span><span class="v">The user's right (GDPR Art. 17) to have personal data deleted, with legal exceptions.</span></div>
  <div class="kv"><span class="k">re-verification</span><span class="v">Returning a changed email to unverified and proving the new address again.</span></div>
  <div class="kv"><span class="k">referential integrity</span><span class="v">Other tables point at the user row; a hard delete breaks or cascades those links.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Changing the email returns the address to an unverified claim and sends a fresh verify link (6.1, 6.2).</li>
<li>Notify the old address too, so a hijacked session cannot silently move the account.</li>
<li>Deleting an account re-authenticates with the password — a live session is not proof the human is present.</li>
<li>Soft-delete (a status) plus a retention purge beats a hard <code>DELETE</code>: recovery, legal holds, referential integrity.</li>
<li>Both actions are credential changes: revoke every session and refresh family, closing the chapter where it began.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-5-1-idempotency', title: 'Compare in API Design — lesson 5.1: idempotency and DELETE', sub: 'There, what DELETE means over HTTP and why repeating it must be safe; here, what deleting an account means to every table that points at it. Each lesson stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Đổi địa chỉ, và kết thúc tài khoản</h2>
<p class="lead">Vòng đời kết thúc bằng hai hành động mà người ta coi là thường nhật còn kẻ tấn công coi là một món quà: đổi email, và xoá tài khoản. Cả hai đều nhạy cảm — một cái lặng lẽ dời chỗ mà mọi đường dẫn reset tương lai sẽ tới, cái kia xoá đi cái dòng mà mọi bảng khác trỏ vào. Bài này cho mỗi cái sự cẩn thận nó cần, và đóng chương ở đúng chỗ nó bắt đầu: một lần đổi thông tin xác thực không được để một phiên nào còn sống.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> đổi một email sao cho địa chỉ mới bắt đầu chưa xác minh và phải chứng minh lại; xoá một tài khoản có xác thực lại, xoá-mềm và thu hồi phiên đầy đủ; và giải thích vì sao cả hai hành động là đổi thông tin xác thực phải kết thúc mọi phiên.</p>
</div>

<h3>Đổi email đưa địa chỉ trở về một lời khai</h3>
<p>Một email mới là một lời khai mới (Bài 6.1), nên đổi nó phải đưa tài khoản trở về chưa xác minh và gửi một link xác minh mới — nếu không một người dùng có thể đổi sang một địa chỉ họ không sở hữu và bắt đầu nhận đường dẫn reset ở đó. <code>users.updateEmail</code> của LabFlow ID xoá <code>email_verified_at</code> trong chính câu lệnh ghi địa chỉ mới:</p>
${ma('javascript', USERS_LC)}
${ma('javascript', CHANGE)}
<div class="kv-grid">
  <div class="kv"><span class="k">Địa chỉ mới chưa xác minh tới khi chứng minh</span><span class="v">Đúng luật 6.1: một địa chỉ gõ vào là một lời khai. Tới khi người dùng bấm link xác minh, thư reset và bảo mật không được coi địa chỉ mới là thật.</span></div>
  <div class="kv"><span class="k">Báo địa chỉ cũ (ở production)</span><span class="v">Nếu một kẻ tấn công trong một phiên sống đổi email, một ghi chú tới địa chỉ trước là cách chủ thật biết được kịp để phản ứng. Demo sandbox bỏ thư thứ hai cho gọn; một bản thật sẽ gửi nó.</span></div>
  <div class="kv"><span class="k">Xác thực lại cho những thay đổi thật sự nhạy cảm</span><span class="v">Một phiên sống không phải bằng chứng con người còn ở bàn phím. Với thay đổi giá trị cao, hỏi lại mật khẩu (như <code>/me/delete</code> dưới đây).</span></div>
</div>

<h3>Kết thúc tài khoản: xác thực lại, xoá-mềm, thu hồi mọi thứ</h3>
${ma('javascript', DELETE)}
${ra(OUT['65-change-delete'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Xác thực lại trước</span><span class="v">Xoá kiểm mật khẩu kể cả trong một phiên sống — một laptop mượn, chưa khoá không được phép xoá một tài khoản. Một lần xác thực lại hỏng trả về <code>REAUTH_FAILED</code>.</span></div>
  <div class="kv"><span class="k">Xoá-mềm, không DELETE cứng</span><span class="v"><code>setStatus(id, 'deleted')</code> lật một cờ; <code>findByEmail</code> đã lọc <code>status = 'active'</code>, nên tài khoản biến khỏi mọi luồng. Một job nền dọn sau một cửa sổ lưu giữ. Cái này mua khôi phục khỏi nhầm lẫn, giữ pháp lý/kiểm toán, và toàn vẹn tham chiếu cho các dòng trỏ vào người này.</span></div>
  <div class="kv"><span class="k">Thu hồi mọi phiên và họ refresh</span><span class="v"><code>sessions.endAll</code> + <code>refresh.revokeAll</code> + xoá cookie của chính phiên này. Một tài khoản đã xoá mà token vẫn kiểm được là một bóng ma vẫn hành động — đúng lý lẽ của reset (6.3).</span></div>
  <div class="kv"><span class="k">Địa chỉ được giải phóng cho đúng</span><span class="v">Vì dòng bị xoá-mềm và <code>findByEmail</code> bỏ qua các dòng không-active, một lần đăng nhập sau với email đó hỏng như bất kỳ địa chỉ lạ nào — dòng cuối của output.</span></div>
</div>

<h3>Khi nó hỏng</h3>
${BANG_VI}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — xoá cứng cái dòng người dùng.</strong> Một <code>DELETE FROM users</code> trông sạch sẽ tới khi một khoá ngoại từ nhật ký kiểm toán, đơn hàng hay tin nhắn hoặc chặn nó lại hoặc cascade và xoá đi lịch sử mà luật buộc bạn phải giữ. Xoá-mềm (một cờ status) cộng một job lưu giữ là cái hình sống sót khi chạm vào một lược đồ thật — và nó cho một người dùng xoá nhầm, hoặc một ticket hỗ trợ, gỡ lại trong cửa sổ đó.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Người dùng đổi email rồi không reset được — vì sao?"</strong> — Địa chỉ mới chưa xác minh theo thiết kế; reset bị chặn sau xác minh (6.2). Họ phải bấm link xác minh mới trước.</li>
<li><strong>"Vì sao xác thực lại để xoá trong một phiên đã đăng nhập?"</strong> — Một phiên sống không phải bằng chứng con người có mặt. Xác thực lại chặn một thiết bị mượn, chưa khoá xoá tài khoản.</li>
<li><strong>"Xoá cứng hay xoá mềm?"</strong> — Xoá-mềm (status) cộng một job dọn lưu giữ: khôi phục khỏi nhầm lẫn, giữ pháp lý/kiểm toán, và toàn vẹn tham chiếu với mọi bảng trỏ vào người dùng.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>bash demo6/change-delete.sh</code>. Sau khi đổi email, địa chỉ mới đã xác minh chưa? Thư nào được gửi?</li>
<li>Sau khi xoá, thử đăng nhập bằng email của tài khoản đã xoá. Chuyện gì xảy ra, và bộ lọc nào trong <code>findByEmail</code> gây ra nó?</li>
<li>Gọi <code>/me/delete</code> với mật khẩu sai. Mã trạng thái gì, và vì sao xoá đòi nó kể cả trong một phiên sống?</li>
</ol>
<p><strong>Lời giải:</strong> (1) địa chỉ mới chưa xác minh và nhận link "xác minh email mới" riêng của nó. (2) đăng nhập hỏng như một email lạ, vì <code>findByEmail</code> lọc <code>status = 'active'</code> và dòng giờ là <code>deleted</code>. (3) <code>403 REAUTH_FAILED</code> — một phiên sống không phải bằng chứng con người có mặt, nên một hành động phá huỷ kiểm lại mật khẩu.</p>
<p><strong>Đạt khi:</strong> một email đã đổi bắt đầu chưa xác minh, và một tài khoản đã xoá không đăng nhập được và không giữ phiên sống nào.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">re-authentication (xác thực lại)</span><span class="v">Kiểm lại mật khẩu cho một hành động nhạy cảm bên trong một phiên đã xác thực.</span></div>
  <div class="kv"><span class="k">soft delete (xoá mềm)</span><span class="v">Đánh dấu một dòng là đã xoá (một status) thay vì bỏ nó, rồi dọn sau.</span></div>
  <div class="kv"><span class="k">retention window (cửa sổ lưu giữ)</span><span class="v">Thời gian một tài khoản xoá-mềm được giữ trước khi một job nền dọn nó.</span></div>
  <div class="kv"><span class="k">right to erasure (quyền được xoá)</span><span class="v">Quyền của người dùng (GDPR Điều 17) được xoá dữ liệu cá nhân, có ngoại lệ pháp lý.</span></div>
  <div class="kv"><span class="k">re-verification (xác minh lại)</span><span class="v">Đưa một email đã đổi về chưa xác minh và chứng minh lại địa chỉ mới.</span></div>
  <div class="kv"><span class="k">referential integrity (toàn vẹn tham chiếu)</span><span class="v">Các bảng khác trỏ vào dòng người dùng; một lần xoá cứng phá hoặc cascade các liên kết đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đổi email đưa địa chỉ về một lời khai chưa xác minh và gửi một link xác minh mới (6.1, 6.2).</li>
<li>Báo cả địa chỉ cũ, để một phiên bị chiếm không lặng lẽ dời được tài khoản.</li>
<li>Xoá tài khoản xác thực lại bằng mật khẩu — một phiên sống không phải bằng chứng con người có mặt.</li>
<li>Xoá-mềm (một status) cộng một job dọn lưu giữ thắng một <code>DELETE</code> cứng: khôi phục, giữ pháp lý, toàn vẹn tham chiếu.</li>
<li>Cả hai hành động là đổi thông tin xác thực: thu hồi mọi phiên và họ refresh, đóng chương ở chỗ nó bắt đầu.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-5-1-idempotency', title: 'So với API Design — bài 5.1: idempotency và DELETE', sub: 'Ở đó, DELETE nghĩa là gì qua HTTP và vì sao lặp lại nó phải an toàn; ở đây, xoá một tài khoản nghĩa là gì với mọi bảng trỏ vào nó. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
