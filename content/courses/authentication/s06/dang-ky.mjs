/**
 * Authentication · Chương 6 · 6.1 — Đăng ký, và cái định danh không rút lại được. Slug giữ: auth-6-1-dang-ky. Bài đầu chương.
 * Output thật (_ma.mjs, LabFlow ID v0.6 + PostgreSQL 17.11): tài khoản mới chưa xác minh; đăng ký băm mật khẩu ở CẢ HAI nhánh
 * (không rò email đã-dùng qua thời gian), gửi link xác minh (email mới) hay "bạn đã có tài khoản" (email trùng) — cùng một 202.
 */
import G from '../giang/auth-06-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const SV = CODE.server06.split('\n');
const SIGNUP = SV.slice(SV.findIndex((l) => l.includes('lesson 6.1, 6.4: register')), SV.findIndex((l) => l.includes('lesson 6.2: email verification'))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — Authentication Cheat Sheet (registration, account enumeration)', 'Registration and forgot-password responses must not reveal whether an account exists; return a consistent message (read 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('🦉', 'OWASP — WSTG, Testing for Account Enumeration', 'A sign-up or login that says "already registered" / "no such user" is an enumeration oracle; keep responses and timing uniform (read 03/11/2026).', 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Authentication Cheat Sheet (đăng ký, dò tài khoản)', 'Phản hồi đăng ký và quên mật khẩu không được lộ tài khoản có tồn tại không; trả một thông điệp nhất quán (đọc 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('🦉', 'OWASP — WSTG, Kiểm thử dò tài khoản', 'Một form đăng ký hay đăng nhập nói "đã đăng ký" / "không có người dùng" là một nhà tiên tri dò tài khoản; giữ phản hồi và thời gian đồng nhất (đọc 03/11/2026).', 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Naive sign-up</th><th>What it leaks</th><th>LabFlow ID</th></tr></thead>
<tbody>
<tr><td>409 "email already taken"</td><td>which emails have an account</td><td>same 202 either way; emails "you already have an account"</td></tr>
<tr><td>hash only when the email is new</td><td>timing: taken ≈ 1 ms, free ≈ 80 ms</td><td>hashes in <strong>both</strong> branches (argon2 dominates both)</td></tr>
<tr><td>account usable immediately</td><td>an unproven address is trusted</td><td>account starts <strong>unverified</strong> (lesson 6.2)</td></tr>
<tr><td>"check your email" only when new</td><td>the inbox presence leaks it too</td><td>always sends an email (verify link, or a notice)</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Đăng ký ngây thơ</th><th>Rò gì</th><th>LabFlow ID</th></tr></thead>
<tbody>
<tr><td>409 "email đã được dùng"</td><td>email nào có tài khoản</td><td>cùng một 202; gửi "bạn đã có tài khoản"</td></tr>
<tr><td>chỉ băm khi email mới</td><td>thời gian: đã-dùng ≈ 1 ms, trống ≈ 80 ms</td><td>băm ở <strong>cả hai</strong> nhánh (argon2 chi phối cả hai)</td></tr>
<tr><td>tài khoản dùng được ngay</td><td>một địa chỉ chưa chứng minh được tin</td><td>tài khoản bắt đầu <strong>chưa xác minh</strong> (bài 6.2)</td></tr>
<tr><td>"kiểm email" chỉ khi mới</td><td>sự có mặt trong hộp thư cũng rò</td><td>luôn gửi một email (link xác minh, hay một ghi chú)</td></tr>
</tbody>
</table>`;

export default {
  title: '6.1 — Registration, and the identifier you cannot take back|||6.1 — Đăng ký, và cái định danh không rút lại được',
  slug: 'auth-6-1-dang-ky',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đăng ký trao thứ người dùng không đổi rẻ được — danh tính — và cơ hội đầu tiên để rò ai đã đăng ký. LabFlow ID v0.6: một tài khoản mới bắt đầu CHƯA XÁC MINH (chưa biết email là của họ); và form đăng ký không nói "email đã được dùng" — nó băm mật khẩu ở CẢ HAI nhánh (nên thời gian như nhau, không rò qua đo thời gian), rồi hoặc tạo tài khoản + gửi link xác minh (email mới), hoặc gửi "bạn đã có tài khoản" (email trùng), và trả về cùng một 202. Theo OWASP Authentication Cheat Sheet + WSTG dò tài khoản.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Registration, and the identifier you cannot take back</h2>
<p class="lead">Chapters 1–5 kept a signed-in user safe. Chapter 6 is about the <strong>account itself</strong> — created, verified, recovered, changed and ended — the “lifecycle” where most real attacks happen. It starts at sign-up, which looks like the easy part but does two risky things at once: it hands a user the one thing they cannot change cheaply, their <em>identity</em>, and it offers an attacker the first chance to learn <em>who is registered</em>. This lesson closes both.</p>

<div class="callout ok">
<p><strong>After Chapter 6 you can:</strong> register an account that starts unverified and prove the email with a one-time link a scanner cannot burn; reset a password safely (one-time token, all sessions revoked); build sign-up and forgot-password flows that never reveal which emails exist — in wording <em>and</em> timing; and change an email or delete an account without leaving a session alive. Lab 6 grades a reset flow against enumeration and one-time-token attacks.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>explain why a new account starts unverified and why the email is hard to take back;</li>
<li>build a sign-up that does not say “email already taken”, in message or timing;</li>
<li>point to where LabFlow ID hashes in both branches and always sends an email;</li>
<li>say why an unverified address must be treated as a claim, not a fact.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> “email already registered” is on half the sign-up forms you have ever used, and it is a free account-list for an attacker. After this lesson yours does not give it away.</p>
</div>

<h3>An everyday picture first</h3>
<p>Registration is a <strong>library card</strong> tied to your name and address. Get the address wrong and your overdue notices go to a stranger; put down someone else's and, to the system, you <em>are</em> them. The email is that card: chosen once, and expensive to undo — every reset link, every notification, every “is this you?” goes there. So two things matter from the first second: the address must really be the user's (verification, 6.2), and the mere act of registering must not tell the world who already has a card.</p>

<h3>A new account starts unverified</h3>
<p>When a user types an email, you have a <em>claim</em>, not a proven address. LabFlow ID v0.6 adds an <code>email_verified_at</code> column, null until the user proves they can read mail there (lesson 6.2). Until then the account exists but is unverified — and the flows that depend on the inbox (password reset, security mail) know not to trust it yet.</p>
${ma('sql', CODE.sql004.split('\n').slice(1, 5).join('\n'))}

<h3>The sign-up that leaks who is registered</h3>
<p>The naive form answers a duplicate email with <code>409 "email already taken"</code>. That is an <strong>enumeration oracle</strong>: an attacker pastes a list of addresses and the form sorts them into “has an account” and “does not”. Worse, even if you fix the <em>wording</em>, a form that only hashes the password when the email is new answers a taken email in a millisecond and a free one in eighty — the <strong>timing</strong> leaks the same fact (lesson 6.4 measures it). LabFlow ID closes both: it does the same work and gives the same answer either way.</p>
${ma('javascript', SIGNUP)}
${ra(OUT['61-register'])}
<p>The response is always <code>202 "Check your email to finish signing up."</code>. Behind it: the password is hashed <strong>before</strong> the branch, so argon2 is the cost whether the email is taken or not; then either a new unverified account is created and a verify link emailed, or — for a duplicate — a “you already have an account” note is emailed instead. The honest owner of that inbox gets a useful message; a stranger probing the form learns nothing.</p>

<h3>When it goes wrong</h3>
${BANG_EN}

<div class="pitfall co-tieu-de">
<p><strong>Trap — trusting an unverified email.</strong> Before <code>email_verified_at</code> is set, the address is a claim. Do not send anything sensitive to it, do not let it receive a password reset, and do not let “you can sign in” imply the address is real — a typo'd or someone-else's address would then receive the victim's mail. Prove the address first (6.2), and gate the risky flows on verification.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“How do you stop account enumeration at sign-up?”</strong> — Same response for a taken and a free email, and the same work (hash in both branches) so the timing matches; send an email either way rather than saying “taken”.</li>
<li><strong>“Why start an account unverified?”</strong> — Because a typed email is a claim; until the user reads a link there, you cannot trust it for resets or notifications.</li>
<li><strong>“Is 409 on a duplicate email really a problem?”</strong> — Yes — it is a free list of your users. Return the same success and notify the real owner by email.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Start v0.6 and run <code>bash demo6/register.sh</code>. Confirm the account is created and a verify link is emailed. What is <code>email_verified_at</code> right after sign-up?</li>
<li>Sign up again with an email that already exists (e.g. <code>an@student.labflow.example</code>). What response do you get, and what lands in the mailbox?</li>
<li>Move the <code>hashPassword</code> call to inside the “new email” branch only. Explain the timing leak you just created (lesson 6.4 will measure it).</li>
</ol>
<p><strong>Solution:</strong> (1) the account exists with <code>email_verified_at = null</code> until the link is clicked. (2) the same <code>202</code>, and a “you already have an account” email — not a “taken” error. (3) a taken email now skips argon2 and returns in ~1 ms while a free one takes ~80 ms, so response time reveals which emails are registered.</p>
<p><strong>Done when:</strong> you can register an unverified account and show that a duplicate email leaks nothing in message or timing.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">account lifecycle</span><span class="v">The stages of an account: create, verify, recover, change, end — Chapter 6.</span></div>
  <div class="kv"><span class="k">unverified account</span><span class="v">An account whose email is a claim, not yet proven (<code>email_verified_at</code> null).</span></div>
  <div class="kv"><span class="k">account enumeration</span><span class="v">Learning which emails have an account, from a message or a timing difference.</span></div>
  <div class="kv"><span class="k">enumeration oracle</span><span class="v">Any response (“taken”, “no such user”, or a faster reply) that answers “does this account exist?”.</span></div>
  <div class="kv"><span class="k">constant work</span><span class="v">Doing the same expensive step (argon2) in every branch so timing does not leak.</span></div>
  <div class="kv"><span class="k">identifier</span><span class="v">The email that names the account; the handle for every recovery and notification.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Chapter 6 is the account lifecycle — where most real attacks live; it starts at sign-up.</li>
<li>A new account starts <strong>unverified</strong>: the email is a claim until proven (6.2).</li>
<li>Never answer a duplicate email with “taken” — return the same success and email the real owner.</li>
<li>Hash the password in <strong>both</strong> branches, so timing does not reveal which emails exist (6.4).</li>
<li>Treat an unverified address as a claim: no sensitive mail, no reset, until it is proven.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'Compare in API Design — lesson 6.2: authorization and the 404-vs-403 leak', sub: 'Same idea at a different layer: a response that distinguishes “exists but forbidden” from “does not exist” leaks which objects exist. There it is a resource id; here it is an email at sign-up. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Đăng ký, và cái định danh không rút lại được</h2>
<p class="lead">Chương 1–5 giữ an toàn cho một người đã đăng nhập. Chương 6 nói về <strong>bản thân tài khoản</strong> — tạo, xác minh, khôi phục, đổi và kết thúc — cái "vòng đời" nơi phần lớn tấn công thật xảy ra. Nó bắt đầu ở đăng ký, trông như phần dễ nhưng làm hai việc rủi ro cùng lúc: trao cho người dùng thứ họ không đổi rẻ được, <em>danh tính</em>, và cho kẻ tấn công cơ hội đầu tiên để biết <em>ai đã đăng ký</em>. Bài này đóng cả hai.</p>

<div class="callout ok">
<p><strong>Học xong Chương 6 bạn làm được:</strong> đăng ký một tài khoản bắt đầu chưa xác minh và chứng minh email bằng một link một lần mà máy quét không đốt được; đặt lại mật khẩu an toàn (token một lần, thu hồi mọi phiên); dựng đăng ký và quên-mật-khẩu không bao giờ lộ email nào tồn tại — về câu chữ <em>lẫn</em> thời gian; và đổi email hay xoá tài khoản mà không để một phiên còn sống. Lab 6 chấm một luồng reset trước các cú dò tài khoản và tấn công token một lần.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>giải thích vì sao một tài khoản mới bắt đầu chưa xác minh và vì sao email khó rút lại;</li>
<li>dựng một form đăng ký không nói "email đã được dùng", về thông điệp lẫn thời gian;</li>
<li>chỉ được chỗ LabFlow ID băm ở cả hai nhánh và luôn gửi một email;</li>
<li>nói vì sao một địa chỉ chưa xác minh phải được coi là một lời khai, không phải sự thật.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> "email đã đăng ký" nằm trên một nửa số form đăng ký bạn từng dùng, và nó là một danh-sách-tài-khoản miễn phí cho kẻ tấn công. Học xong bài này, của bạn không cho đi điều đó.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Đăng ký là một <strong>thẻ thư viện</strong> gắn với tên và địa chỉ của bạn. Ghi sai địa chỉ thì giấy báo quá hạn tới tay người lạ; điền của người khác thì, với hệ thống, bạn <em>chính là</em> họ. Email là cái thẻ đó: chọn một lần, và tốn kém để gỡ — mọi link đặt lại, mọi thông báo, mọi "có phải bạn không?" đều tới đó. Nên hai điều quan trọng từ giây đầu: địa chỉ phải thật sự của người dùng (xác minh, 6.2), và chính việc đăng ký không được nói cho cả thế giới biết ai đã có thẻ.</p>

<h3>Một tài khoản mới bắt đầu chưa xác minh</h3>
<p>Khi một người gõ một email, bạn có một <em>lời khai</em>, không phải một địa chỉ đã chứng minh. LabFlow ID v0.6 thêm một cột <code>email_verified_at</code>, null cho tới khi người dùng chứng minh họ đọc được thư ở đó (bài 6.2). Tới lúc đó tài khoản tồn tại nhưng chưa xác minh — và các luồng dựa vào hộp thư (đặt lại mật khẩu, thư bảo mật) biết chưa nên tin nó.</p>
${ma('sql', CODE.sql004.split('\n').slice(1, 5).join('\n'))}

<h3>Form đăng ký làm rò ai đã đăng ký</h3>
<p>Form ngây thơ trả lời một email trùng bằng <code>409 "email đã được dùng"</code>. Đó là một <strong>nhà tiên tri dò tài khoản</strong>: kẻ tấn công dán một danh sách địa chỉ và form phân loại chúng thành "có tài khoản" và "không". Tệ hơn, dù bạn sửa <em>câu chữ</em>, một form chỉ băm mật khẩu khi email mới trả lời một email đã-dùng trong một mili giây và một cái trống trong tám mươi — <strong>thời gian</strong> rò đúng sự thật đó (bài 6.4 đo). LabFlow ID đóng cả hai: nó làm cùng một việc và cho cùng một câu trả lời dù thế nào.</p>
${ma('javascript', SIGNUP)}
${ra(OUT['61-register'])}
<p>Phản hồi luôn là <code>202 "Check your email to finish signing up."</code>. Phía sau: mật khẩu được băm <strong>trước</strong> nhánh, nên argon2 là chi phí dù email đã-dùng hay chưa; rồi hoặc một tài khoản mới chưa xác minh được tạo và một link xác minh được gửi, hoặc — với một trùng lặp — một ghi chú "bạn đã có tài khoản" được gửi thay thế. Chủ thật của hộp thư đó nhận một thông điệp hữu ích; một người lạ dò form chẳng học được gì.</p>

<h3>Khi nó hỏng</h3>
${BANG_VI}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tin một email chưa xác minh.</strong> Trước khi <code>email_verified_at</code> được đặt, địa chỉ là một lời khai. Đừng gửi gì nhạy cảm tới nó, đừng cho nó nhận đặt lại mật khẩu, và đừng để "bạn có thể đăng nhập" ngụ ý địa chỉ là thật — một địa chỉ gõ nhầm hay của người khác khi đó sẽ nhận thư của nạn nhân. Chứng minh địa chỉ trước (6.2), và chặn các luồng rủi ro sau xác minh.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Chặn dò tài khoản ở đăng ký thế nào?"</strong> — Cùng phản hồi cho email đã-dùng và email trống, và cùng công việc (băm ở cả hai nhánh) để thời gian khớp; gửi một email dù thế nào thay vì nói "đã dùng".</li>
<li><strong>"Vì sao bắt đầu một tài khoản chưa xác minh?"</strong> — Vì một email gõ vào là một lời khai; cho tới khi người dùng đọc một link ở đó, bạn không tin nó được cho reset hay thông báo.</li>
<li><strong>"409 cho một email trùng có thật sự là vấn đề không?"</strong> — Có — đó là một danh sách người dùng miễn phí. Trả cùng một thành công và báo chủ thật qua email.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Khởi động v0.6 và chạy <code>bash demo6/register.sh</code>. Xác nhận tài khoản được tạo và một link xác minh được gửi. <code>email_verified_at</code> ngay sau đăng ký là gì?</li>
<li>Đăng ký lại với một email đã tồn tại (ví dụ <code>an@student.labflow.example</code>). Bạn nhận phản hồi gì, và cái gì rơi vào hộp thư?</li>
<li>Chuyển lời gọi <code>hashPassword</code> vào chỉ trong nhánh "email mới". Giải thích cú rò thời gian bạn vừa tạo ra (bài 6.4 sẽ đo).</li>
</ol>
<p><strong>Lời giải:</strong> (1) tài khoản tồn tại với <code>email_verified_at = null</code> cho tới khi link được bấm. (2) cùng một <code>202</code>, và một email "bạn đã có tài khoản" — không phải lỗi "đã dùng". (3) một email đã-dùng giờ bỏ qua argon2 và trả về trong ~1 ms còn một cái trống mất ~80 ms, nên thời gian phản hồi lộ email nào đã đăng ký.</p>
<p><strong>Đạt khi:</strong> bạn đăng ký được một tài khoản chưa xác minh và chỉ ra một email trùng không rò gì về thông điệp lẫn thời gian.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">account lifecycle (vòng đời tài khoản)</span><span class="v">Các giai đoạn của một tài khoản: tạo, xác minh, khôi phục, đổi, kết thúc — Chương 6.</span></div>
  <div class="kv"><span class="k">unverified account (tài khoản chưa xác minh)</span><span class="v">Tài khoản mà email là một lời khai, chưa chứng minh (<code>email_verified_at</code> null).</span></div>
  <div class="kv"><span class="k">account enumeration (dò tài khoản)</span><span class="v">Biết email nào có tài khoản, từ một thông điệp hay một chênh lệch thời gian.</span></div>
  <div class="kv"><span class="k">enumeration oracle (nhà tiên tri dò)</span><span class="v">Bất kỳ phản hồi nào ("đã dùng", "không có người dùng", hay một câu trả lời nhanh hơn) trả lời "tài khoản này có tồn tại không?".</span></div>
  <div class="kv"><span class="k">constant work (công việc hằng định)</span><span class="v">Làm cùng một bước tốn kém (argon2) ở mọi nhánh để thời gian không rò.</span></div>
  <div class="kv"><span class="k">identifier (định danh)</span><span class="v">Email đặt tên tài khoản; tay cầm cho mọi khôi phục và thông báo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chương 6 là vòng đời tài khoản — nơi phần lớn tấn công thật sống; nó bắt đầu ở đăng ký.</li>
<li>Một tài khoản mới bắt đầu <strong>chưa xác minh</strong>: email là một lời khai tới khi chứng minh (6.2).</li>
<li>Không bao giờ trả lời một email trùng bằng "đã dùng" — trả cùng một thành công và gửi email cho chủ thật.</li>
<li>Băm mật khẩu ở <strong>cả hai</strong> nhánh, để thời gian không lộ email nào tồn tại (6.4).</li>
<li>Coi một địa chỉ chưa xác minh là một lời khai: không thư nhạy cảm, không reset, tới khi nó được chứng minh.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'So với API Design — bài 6.2: phân quyền và rò 404-đối-403', sub: 'Cùng ý ở một tầng khác: một phản hồi phân biệt "tồn tại nhưng bị cấm" với "không tồn tại" làm rò object nào tồn tại. Ở đó là một id tài nguyên; ở đây là một email lúc đăng ký. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
