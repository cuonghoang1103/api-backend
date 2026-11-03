/**
 * Authentication · Chương 6 · 6.4 — Dò tài khoản, và cái rò không câu chữ nào đóng được. Slug giữ: auth-6-4-do-tai-khoan.
 * Output thật (_ma.mjs, 64-enum): /forgot-password-naive (AWAIT insert+gửi) rò ~0,9 ms giữa tài khoản thật và giả; bản
 * đúng (không await) chênh ~trong nhiễu; /sign-up băm ở cả hai nhánh ⇒ tỉ lệ ~1x. "Lỗ 2" của khoá: đo được, rồi vá.
 */
import G from '../giang/auth-06-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const LV = CODE.layer.split('\n');
const REQ_RESET = LV.slice(LV.findIndex((l) => l.includes('Ask for a password reset')), LV.findIndex((l) => l.includes('return { issueToken'))).join('\n').trim();
const SV = CODE.server06.split('\n');
const NAIVE = SV.slice(SV.findIndex((l) => l.includes('lesson 6.4 TEACHING FOIL')), SV.findIndex((l) => l.includes('lesson 6.3: consume a reset token'))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — WSTG, Testing for Account Enumeration', 'Enumeration leaks through differing responses AND differing response times; the fix is a uniform response and uniform work (read 04/11/2026).', 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account'),
  nguon('🦉', 'OWASP — Authentication Cheat Sheet (generic responses)', 'Login, registration and forgot-password must return generic messages so none of them confirms whether an account exists (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — WSTG, Kiểm thử dò tài khoản', 'Dò rò qua phản hồi khác nhau VÀ thời gian phản hồi khác nhau; cách vá là một phản hồi đồng nhất và một lượng công việc đồng nhất (đọc 04/11/2026).', 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account'),
  nguon('🦉', 'OWASP — Authentication Cheat Sheet (phản hồi chung chung)', 'Đăng nhập, đăng ký và quên-mật-khẩu phải trả thông điệp chung chung để không cái nào xác nhận một tài khoản có tồn tại không (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Channel that leaks</th><th>Example</th><th>Close it by</th></tr></thead>
<tbody>
<tr><td>the message</td><td>"no such user" vs "wrong password"; "email taken"</td><td>one generic response for both branches</td></tr>
<tr><td>the status code</td><td>404 for a missing account, 401 for a wrong password</td><td>same status for both</td></tr>
<tr><td>the <strong>time</strong></td><td>a real account triggers a DB insert / email / argon2 the fake one skips</td><td>do the same work either way — or do it off the response path</td></tr>
<tr><td>side effects</td><td>a real account gets an email; a fake one does not</td><td>send nothing a non-account could observe</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Kênh làm rò</th><th>Ví dụ</th><th>Đóng bằng</th></tr></thead>
<tbody>
<tr><td>thông điệp</td><td>"không có người dùng" đối lại "sai mật khẩu"; "email đã dùng"</td><td>một phản hồi chung cho cả hai nhánh</td></tr>
<tr><td>mã trạng thái</td><td>404 cho tài khoản thiếu, 401 cho sai mật khẩu</td><td>cùng mã cho cả hai</td></tr>
<tr><td><strong>thời gian</strong></td><td>một tài khoản thật kích một INSERT / email / argon2 mà cái giả bỏ qua</td><td>làm cùng công việc dù thế nào — hoặc làm nó ngoài đường phản hồi</td></tr>
<tr><td>tác dụng phụ</td><td>một tài khoản thật nhận một email; một cái giả thì không</td><td>đừng gửi gì mà một người-không-tài-khoản quan sát được</td></tr>
</tbody>
</table>`;

export default {
  title: '6.4 — Account enumeration, and the leak no wording change can close|||6.4 — Dò tài khoản, và cái rò không câu chữ nào đóng được',
  slug: 'auth-6-4-do-tai-khoan',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Dò tài khoản là biết email nào đã đăng ký. Ai cũng biết sửa câu chữ ("nếu tài khoản tồn tại…"), nhưng THỜI GIAN vẫn tố cáo: một tài khoản thật kích một INSERT token + gửi thư + argon2 mà một địa chỉ giả bỏ qua. Đây là "lỗ 2" cố ý của khoá — đo thật trên LabFlow ID v0.6: /forgot-password-naive (AWAIT phần chậm) để một tài khoản thật chậm hơn ~0,9 ms (đo được, nhất quán); bản đúng làm phần chậm NGOÀI đường phản hồi (không await) ⇒ chênh lệch chìm trong nhiễu; và /sign-up băm ở cả hai nhánh ⇒ tỉ lệ thời gian ~1x. Theo OWASP WSTG + Authentication Cheat Sheet.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Account enumeration, and the leak no wording change can close</h2>
<p class="lead">Account enumeration is learning which email addresses have an account on your service — a list most teams never meant to publish, and the raw material for targeted phishing and credential stuffing. Everyone knows the wording fix. Almost nobody measures the one that wording cannot touch: the clock. This is the course's deliberate "hole #2" — we build the leak, measure it, and close it.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> name the four channels enumeration leaks through (message, status, time, side effect); measure a timing leak over HTTP with a median; and close it two ways — doing the same work in both branches, or moving the account-specific work off the response path.</p>
</div>

<h3>The wording leak, and why it is the easy half</h3>
<p>The obvious oracle is the message: "no account for that email" versus "check your inbox", or "email already taken" at sign-up. Fix it with one generic response — which LabFlow ID already does: <code>/forgot-password</code> always answers "if an account exists, a link is on its way", and sign-up always answers <code>202</code> (Lesson 6.1). Same for the status code: never <code>404</code> for a missing account and <code>200</code> for a found one.</p>
${BANG_EN}

<h3>The timing leak, measured</h3>
<p>Here is the part the wording fix leaves wide open. A <em>real</em> account triggers work a <em>fake</em> one does not: a token row is inserted and an email is sent. If the endpoint <strong>awaits</strong> that work before replying, the real account is measurably slower — the identical message now sits on top of a stopwatch that tells the attacker everything. LabFlow ID ships a teaching foil, <code>/forgot-password-naive</code>, that does exactly this:</p>
${ma('javascript', NAIVE)}
<p>And the real handler, which does the same account lookup but pushes the insert and the email <strong>off the response path</strong> — fire-and-forget, so the reply time no longer depends on whether the account exists:</p>
${ma('javascript', REQ_RESET)}
${ra(OUT['64-enum'])}
<div class="kv-grid">
  <div class="kv"><span class="k">The naive endpoint leaks ~0.9 ms, consistently</span><span class="v">The median for a real account is roughly double the fake one — small, but stable across 200 requests, so an attacker who averages can read it straight off. The body is identical; the clock is not.</span></div>
  <div class="kv"><span class="k">The fix brings it into the noise</span><span class="v">Moving the insert + send off the response path (not awaiting them) leaves both branches doing only the lookup, so the difference collapses to hundredths of a millisecond — indistinguishable from jitter.</span></div>
  <div class="kv"><span class="k">Sign-up is the other door</span><span class="v">The second block measures <code>/sign-up</code> for a taken vs a free email: because the password is hashed in BOTH branches (Lesson 6.1), argon2 dominates both and the ratio sits at ~1x. Same work, no leak.</span></div>
  <div class="kv"><span class="k">Why "do the same work" OR "off the path"</span><span class="v">Two valid fixes. For sign-up the expensive step (argon2) is unavoidable in both branches, so you make it symmetric. For forgot-password the expensive step only makes sense for a real account, so you move it where the response does not wait on it.</span></div>
</div>

<h3>When it goes wrong</h3>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "we fixed the message, so enumeration is closed."</strong> It is not. The naive numbers above come from an endpoint whose message is already perfectly uniform; the leak is entirely in the timing. Any branch that does account-specific work before replying — an email send, a token insert, an argon2 hash on the real path only — is a timing oracle wearing a generic message. Measure it; do not assume it.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"How do you prevent account enumeration?"</strong> — Uniform message and status, AND uniform timing: do the same work in both branches, or move account-specific work off the response path. Side effects (an email only a real account gets) must also be invisible to a non-account.</li>
<li><strong>"The messages are identical — are we safe?"</strong> — Not until you have measured the timing. A DB insert, an email, or an argon2 hash on the real path only is a stopwatch oracle.</li>
<li><strong>"Is a 1 ms difference really exploitable?"</strong> — Over many requests an attacker averages out the noise and reads a stable median. Consistency, not magnitude, is what makes it work.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo6/enum-timing.mjs</code>. Compare the naive and the fixed <code>/forgot-password</code> medians for a real vs a fake address. Which one leaks, and by how much?</li>
<li>Look at the sign-up measurement. Why is the taken-vs-free ratio ~1x even though only one branch creates a user?</li>
<li>Move the <code>hashPassword</code> call in <code>/sign-up</code> into the "new email" branch only, re-run, and describe the leak you created.</li>
</ol>
<p><strong>Solution:</strong> (1) the naive endpoint leaks ~0.9 ms (real ≈ 2× fake); the fixed one sits within noise because the insert + email are not awaited. (2) both branches run argon2, which dominates the ~190 ms either way, so creating a row adds a rounding error. (3) hashing only on the new-email branch makes a taken email return in ~1 ms and a free one in ~80+ ms — a textbook timing oracle.</p>
<p><strong>Done when:</strong> you can measure a timing leak and show it disappear after moving the work off the response path.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">account enumeration</span><span class="v">Determining which emails have an account, from any observable difference.</span></div>
  <div class="kv"><span class="k">timing oracle</span><span class="v">A response whose <em>time</em> answers a secret question, even when the body is uniform.</span></div>
  <div class="kv"><span class="k">median over N requests</span><span class="v">The robust way to read a small, noisy timing difference; an attacker averages the jitter out.</span></div>
  <div class="kv"><span class="k">constant work</span><span class="v">Doing the same expensive step (argon2) in both branches so the time matches.</span></div>
  <div class="kv"><span class="k">off the response path</span><span class="v">Running account-specific work (insert, email) fire-and-forget, after the reply.</span></div>
  <div class="kv"><span class="k">side-channel</span><span class="v">A leak through something other than the response body — time, size, an email.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Enumeration leaks through four channels: message, status, time, side effect — a uniform message closes only one.</li>
<li>A real account that triggers an insert / email / argon2 the fake one skips is a timing oracle.</li>
<li>Measured on LabFlow ID: the naive endpoint leaks ~0.9 ms consistently; the fix brings it into the noise.</li>
<li>Close it by doing the same work in both branches (sign-up / argon2) or moving it off the response path (forgot-password).</li>
<li>"We fixed the message" is not "enumeration is closed" — measure the clock.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'Compare in API Design — lesson 6.2: the 404-vs-403 leak', sub: 'The same enumeration idea on resource ids: a response that distinguishes "forbidden" from "not found" leaks which objects exist. Here it is emails and the clock. Each lesson stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Dò tài khoản, và cái rò không câu chữ nào đóng được</h2>
<p class="lead">Dò tài khoản là biết địa chỉ email nào có tài khoản trên dịch vụ của bạn — một danh sách phần lớn các đội chưa bao giờ định công bố, và là nguyên liệu thô cho phishing nhắm đích và nhồi thông tin đăng nhập. Ai cũng biết cách vá câu chữ. Gần như không ai đo cái mà câu chữ không chạm tới được: cái đồng hồ. Đây là "lỗ 2" cố ý của khoá — ta dựng cái rò, đo nó, rồi đóng nó.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> gọi tên bốn kênh mà dò tài khoản rò qua (thông điệp, mã trạng thái, thời gian, tác dụng phụ); đo một cú rò thời gian qua HTTP bằng trung vị; và đóng nó theo hai cách — làm cùng công việc ở cả hai nhánh, hoặc chuyển phần việc riêng-tài-khoản ra ngoài đường phản hồi.</p>
</div>

<h3>Cú rò câu chữ, và vì sao nó là nửa dễ</h3>
<p>Nhà tiên tri hiển nhiên là thông điệp: "không có tài khoản cho email đó" đối lại "kiểm hộp thư", hay "email đã được dùng" lúc đăng ký. Vá bằng một phản hồi chung — mà LabFlow ID đã làm: <code>/forgot-password</code> luôn trả "nếu một tài khoản tồn tại, một đường dẫn đang trên đường tới", và đăng ký luôn trả <code>202</code> (Bài 6.1). Tương tự cho mã trạng thái: không bao giờ <code>404</code> cho một tài khoản thiếu và <code>200</code> cho một cái tìm thấy.</p>
${BANG_VI}

<h3>Cú rò thời gian, đo được</h3>
<p>Đây là phần mà cách vá câu chữ để toang. Một tài khoản <em>thật</em> kích phần việc một cái <em>giả</em> không kích: một dòng token được chèn và một email được gửi. Nếu tuyến <strong>await</strong> phần việc đó trước khi trả lời, tài khoản thật chậm hơn một cách đo được — thông điệp y hệt giờ nằm trên một cái đồng hồ bấm giây kể cho kẻ tấn công mọi thứ. LabFlow ID kèm một bản mồi dạy học, <code>/forgot-password-naive</code>, làm đúng điều này:</p>
${ma('javascript', NAIVE)}
<p>Và handler thật, làm cùng một phép tra tài khoản nhưng đẩy phần chèn và email <strong>ra ngoài đường phản hồi</strong> — bắn-rồi-quên, nên thời gian trả lời không còn phụ thuộc tài khoản có tồn tại hay không:</p>
${ma('javascript', REQ_RESET)}
${ra(OUT['64-enum'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Tuyến mồi rò ~0,9 ms, nhất quán</span><span class="v">Trung vị của một tài khoản thật xấp xỉ gấp đôi cái giả — nhỏ, nhưng ổn định qua 200 request, nên một kẻ tấn công lấy trung bình đọc thẳng ra được. Nội dung y hệt; cái đồng hồ thì không.</span></div>
  <div class="kv"><span class="k">Cách vá đưa nó chìm vào nhiễu</span><span class="v">Chuyển chèn + gửi ra ngoài đường phản hồi (không await) để cả hai nhánh chỉ còn làm phép tra, nên chênh lệch rụng xuống phần trăm mili giây — không phân biệt được với nhiễu.</span></div>
  <div class="kv"><span class="k">Đăng ký là cánh cửa kia</span><span class="v">Khối thứ hai đo <code>/sign-up</code> cho một email đã-dùng đối lại một cái trống: vì mật khẩu được băm ở CẢ HAI nhánh (Bài 6.1), argon2 chi phối cả hai và tỉ lệ nằm ở ~1x. Cùng công việc, không rò.</span></div>
  <div class="kv"><span class="k">Vì sao "làm cùng công việc" HOẶC "ngoài đường"</span><span class="v">Hai cách vá hợp lệ. Với đăng ký bước tốn kém (argon2) không tránh được ở cả hai nhánh, nên bạn làm nó đối xứng. Với quên-mật-khẩu bước tốn kém chỉ có nghĩa cho một tài khoản thật, nên bạn chuyển nó tới chỗ mà phản hồi không chờ nó.</span></div>
</div>

<h3>Khi nó hỏng</h3>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "ta vá thông điệp rồi, nên dò tài khoản đã đóng."</strong> Chưa đóng. Những con số mồi ở trên đến từ một tuyến mà thông điệp đã hoàn toàn đồng nhất; cú rò nằm trọn trong thời gian. Bất kỳ nhánh nào làm việc riêng-tài-khoản trước khi trả lời — một lần gửi thư, một lần chèn token, một lần băm argon2 chỉ trên đường thật — là một nhà tiên tri thời gian khoác một thông điệp chung chung. Hãy đo nó; đừng giả định.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Chặn dò tài khoản thế nào?"</strong> — Thông điệp và mã trạng thái đồng nhất, VÀ thời gian đồng nhất: làm cùng công việc ở cả hai nhánh, hoặc chuyển việc riêng-tài-khoản ra ngoài đường phản hồi. Tác dụng phụ (một email chỉ tài khoản thật nhận) cũng phải vô hình với một người-không-tài-khoản.</li>
<li><strong>"Thông điệp y hệt rồi — ta an toàn chưa?"</strong> — Chưa, cho tới khi bạn đã đo thời gian. Một lần chèn DB, một email, hay một lần băm argon2 chỉ trên đường thật là một nhà tiên tri đồng hồ.</li>
<li><strong>"Chênh 1 ms có thật sự khai thác được?"</strong> — Qua nhiều request kẻ tấn công lấy trung bình bỏ nhiễu và đọc một trung vị ổn định. Tính nhất quán, không phải độ lớn, mới là thứ khiến nó chạy.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo6/enum-timing.mjs</code>. So trung vị của bản mồi và bản đã vá <code>/forgot-password</code> cho một địa chỉ thật đối lại giả. Cái nào rò, và rò bao nhiêu?</li>
<li>Nhìn phép đo đăng ký. Vì sao tỉ lệ đã-dùng-đối-trống ~1x dù chỉ một nhánh tạo người dùng?</li>
<li>Chuyển lời gọi <code>hashPassword</code> trong <code>/sign-up</code> vào chỉ nhánh "email mới", chạy lại, và mô tả cú rò bạn tạo ra.</li>
</ol>
<p><strong>Lời giải:</strong> (1) tuyến mồi rò ~0,9 ms (thật ≈ 2× giả); bản đã vá nằm trong nhiễu vì chèn + email không được await. (2) cả hai nhánh chạy argon2, chi phối ~190 ms dù thế nào, nên tạo một dòng chỉ thêm một sai số làm tròn. (3) băm chỉ ở nhánh email-mới khiến một email đã-dùng trả về trong ~1 ms còn một cái trống trong ~80+ ms — một nhà tiên tri thời gian sách giáo khoa.</p>
<p><strong>Đạt khi:</strong> bạn đo được một cú rò thời gian và cho thấy nó biến mất sau khi chuyển phần việc ra ngoài đường phản hồi.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">account enumeration (dò tài khoản)</span><span class="v">Xác định email nào có tài khoản, từ bất kỳ khác biệt quan sát được nào.</span></div>
  <div class="kv"><span class="k">timing oracle (nhà tiên tri thời gian)</span><span class="v">Một phản hồi mà <em>thời gian</em> của nó trả lời một câu hỏi bí mật, kể cả khi nội dung đồng nhất.</span></div>
  <div class="kv"><span class="k">median over N requests (trung vị qua N request)</span><span class="v">Cách bền để đọc một chênh lệch thời gian nhỏ, nhiễu; kẻ tấn công lấy trung bình bỏ nhiễu.</span></div>
  <div class="kv"><span class="k">constant work (công việc hằng định)</span><span class="v">Làm cùng bước tốn kém (argon2) ở cả hai nhánh để thời gian khớp.</span></div>
  <div class="kv"><span class="k">off the response path (ngoài đường phản hồi)</span><span class="v">Chạy việc riêng-tài-khoản (chèn, email) bắn-rồi-quên, sau khi trả lời.</span></div>
  <div class="kv"><span class="k">side-channel (kênh bên)</span><span class="v">Một cú rò qua thứ khác ngoài nội dung phản hồi — thời gian, kích thước, một email.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dò tài khoản rò qua bốn kênh: thông điệp, mã trạng thái, thời gian, tác dụng phụ — một thông điệp đồng nhất chỉ đóng một.</li>
<li>Một tài khoản thật kích một chèn / email / argon2 mà cái giả bỏ qua là một nhà tiên tri thời gian.</li>
<li>Đo trên LabFlow ID: tuyến mồi rò ~0,9 ms nhất quán; cách vá đưa nó chìm vào nhiễu.</li>
<li>Đóng bằng làm cùng công việc ở cả hai nhánh (đăng ký / argon2) hoặc chuyển nó ra ngoài đường phản hồi (quên-mật-khẩu).</li>
<li>"Ta vá thông điệp rồi" không phải "dò tài khoản đã đóng" — hãy đo cái đồng hồ.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'So với API Design — bài 6.2: rò 404-đối-403', sub: 'Cùng ý dò tài khoản trên id tài nguyên: một phản hồi phân biệt "bị cấm" với "không tìm thấy" làm rò object nào tồn tại. Ở đây là email và cái đồng hồ. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
