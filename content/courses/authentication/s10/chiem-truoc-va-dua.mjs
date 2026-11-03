/**
 * Authentication · Chương 10 · 10.5 — Chiếm tài khoản TRƯỚC, và những cuộc đua chẳng ai kiểm thử. Slug giữ: auth-10-5-chiem-truoc-va-dua.
 * Output THẬT từ _ma.mjs: demo10/pre-hijack-race.mjs (gắn-theo-email giữ kẻ tấn công; check-then-act dùng token 2 lần).
 */
import G from '../giang/auth-10-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { OUT } from './_ma.mjs';

const ATOMIC_SQL = `-- The one-line fix: the check and the write are ONE atomic statement, serialised by the database.
UPDATE one_time_tokens
   SET used_at = now()
 WHERE id = $1 AND used_at IS NULL     -- only an UNUSED token flips
RETURNING id;                          -- a row ⇒ you won; no row ⇒ someone else already did`;

const NGUON_EN = [
  nguon('📄', 'USENIX Security 2022 — Pre-hijacking Attacks on Web User Accounts (Sudhodanan & Paverd)', 'The paper that catalogued account pre-hijacking across major sites; the attack this lesson models (read 04/11/2026).', 'https://www.usenix.org/conference/usenixsecurity22/presentation/sudhodanan'),
  nguon('🍪', 'OWASP — Session Management Cheat Sheet', 'One-time token handling and atomic state transitions (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('📄', 'USENIX Security 2022 — Pre-hijacking Attacks on Web User Accounts (Sudhodanan & Paverd)', 'Bài báo phân loại chiếm-trước tài khoản qua các site lớn; cú tấn công bài này mô hình (đọc 04/11/2026).', 'https://www.usenix.org/conference/usenixsecurity22/presentation/sudhodanan'),
  nguon('🍪', 'OWASP — Session Management Cheat Sheet', 'Xử lý token một-lần và chuyển trạng thái nguyên tử (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');

export default {
  title: '10.5 — Pre-hijacking, and the races nobody tests for|||10.5 — Chiếm tài khoản TRƯỚC, và những cuộc đua chẳng ai kiểm thử',
  slug: 'auth-10-5-chiem-truoc-va-dua',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Hai cú tấn công nấp trong vòng đời tài khoản, không hiện ra trong kiểm thử bình thường. (1) CHIẾM TRƯỚC: kẻ tấn công đăng ký bằng email NẠN NHÂN trước khi nạn nhân tới (chưa xác minh), rồi ngồi lên. Nạn nhân sau "Đăng nhập bằng Google"; máy chủ ngây thơ tìm tài khoản sẵn có theo email và GẮN danh tính liên kết vào nó ⇒ kẻ tấn công (mật khẩu/phiên cũ) giữ quyền. Sửa: KHÔNG gộp vào tài khoản chưa xác minh — bỏ bản ghi cũ, tạo tài khoản IdP đã xác minh, hoặc buộc xác minh trước (Ch6); nối theo SUB không email (Ch8). (2) ĐUA (TOCTOU): một thao tác một-lần đọc "chưa dùng?" rồi hành động; giữa kiểm và làm, yêu cầu thứ hai chen vào ⇒ cả hai thành công (token dùng 2 lần). Sửa: consume NGUYÊN TỬ ở DB — UPDATE ... WHERE used_at IS NULL RETURNING ⇒ đúng một thắng. Đo thật: gắn-theo-email giữ kẻ tấn công; check-then-act = 2 thành công, atomic = 1. Đua nấp ở: token một-lần, thưởng "N đầu", tên-duy-nhất, rút số dư. Theo USENIX 2022 pre-hijacking + OWASP.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>Pre-hijacking, and the races nobody tests for</h2>
<p class="lead">The last two attacks of the chapter hide in the account lifecycle, where normal tests never look. In <em>pre-hijacking</em>, the attacker is already inside the account before the victim ever arrives. In a <em>race condition</em>, two requests at the same instant break a "once only" action. Both are invisible to a functional test, and both have a one-idea fix.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> explain account pre-hijacking and why unverified accounts must never be merged into; spot a time-of-check-to-time-of-use race on a one-time action; and fix it with an atomic database transition.</p>
</div>

<h3>Pre-hijacking</h3>
<p>The attacker signs up with the <em>victim's</em> email before the victim does, and sits on the account — unverified. Months later the victim arrives and clicks "Sign in with Google" (OIDC, Chapter 8). A naive server finds a local account already holding that email and <em>attaches</em> the federated identity to it. Now the account the victim thinks is theirs is one the attacker set up — with a password they know or a session they kept. The victim logs in happily; the attacker still holds a key. The merge handed the attacker a verified account.</p>

<h3>The fix: never merge into unverified</h3>
<p>An unverified pre-existing account has proven nothing — anyone can type any email. On a federated first-login, do not attach to it: discard the stale unverified record and create a fresh account the identity provider has verified, or require the victim to verify ownership first (Chapter 6). And link on the provider's stable <code>sub</code>, never a mutable, claimable email (Chapter 8). The measured demo:</p>
${ra(OUT['105-prehijack-race'])}
<p>The naive "attach by email" keeps the attacker in; discarding the stale unverified record locks them out. The whole attack rests on treating an unverified email as proof of ownership — which it never is.</p>

<h3>Race conditions (TOCTOU)</h3>
<p>A one-time action — redeem a reset token, claim a signup bonus, use an invite — usually reads "is it unused?" and then acts. Between the <em>check</em> and the <em>act</em>, a second concurrent request slips in. Both read "unused", both act. This is Time-Of-Check to Time-Of-Use, and in the demo two concurrent redemptions of a one-time reset token <em>both</em> succeed — the token was used twice.</p>

<h3>The fix: atomic at the database</h3>
<p>The fix is not a lock in your code; it is making the check and the write a single statement the database serialises:</p>
${ma('sql', ATOMIC_SQL)}
<p>The row either flips and returns its id (you won) or returns nothing (someone else already consumed it). The database, not your application, decides the race — exactly one caller wins. In the demo, the atomic consume yields one success where check-then-act yielded two.</p>

<h3>Where races hide</h3>
<p>Anywhere a limited thing is checked and then granted: one-time tokens, "first N users" bonuses, unique-username sign-up, balance withdrawals, seat reservations. If correctness depends on "only once" or "only while available", the check and the write must be one atomic step — or enforced by a database constraint (a <code>UNIQUE</code> index, a <code>CHECK</code>). A functional test with one request at a time will never show the bug; it needs two at the same instant.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "check then act" that looks correct.</strong> <code>if (token.used) return error; token.used = true; doIt();</code> reads perfectly and passes every single-threaded test. Under real concurrency it lets two requests both pass the check before either writes. The only reliable fix is to make the transition atomic (<code>UPDATE ... WHERE used_at IS NULL RETURNING</code>) or back it with a unique constraint — never a check followed by a separate write.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What is account pre-hijacking?"</strong> — The attacker creates an account with the victim's email first; a naive federated login later merges into it, leaving the attacker with access. Fix: never merge into an unverified account; link on the sub; verify first.</li>
<li><strong>"What is a TOCTOU race?"</strong> — Time-of-check to time-of-use: two requests both pass a "is it unused?" check before either marks it used. Fix with an atomic DB transition or a unique constraint.</li>
<li><strong>"Why won't your tests catch it?"</strong> — Functional tests run one request at a time; the race needs two concurrent ones. You need a concurrency test, or a constraint that makes the race impossible.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo10/pre-hijack-race.mjs</code>. In the race, how many redemptions succeed with check-then-act versus the atomic consume?</li>
<li>Why does linking a federated login on the email, rather than the provider's <code>sub</code>, enable pre-hijacking?</li>
<li>Write the one-line SQL that makes a one-time token redemption safe under concurrency.</li>
</ol>
<p><strong>Solution:</strong> (1) check-then-act: two succeed (the token is used twice); atomic consume: exactly one. (2) an email is mutable and claimable — the attacker can pre-register it unverified — so matching on email attaches the victim's real login to the attacker's account; the <code>sub</code> is the provider's stable, non-claimable identifier. (3) <code>UPDATE one_time_tokens SET used_at = now() WHERE id = $1 AND used_at IS NULL RETURNING id;</code> — a returned row means you won, no row means someone else did.</p>
<p><strong>Done when:</strong> you never merge a federated login into an unverified account, and every one-time action is an atomic DB transition or a unique constraint.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pre-hijacking</span><span class="v">Creating an account with the victim's email first, so a later login merges into the attacker's account.</span></div>
  <div class="kv"><span class="k">link on the sub</span><span class="v">Attaching a federated identity by the provider's stable <code>sub</code>, never a claimable email (Chapter 8).</span></div>
  <div class="kv"><span class="k">TOCTOU</span><span class="v">Time-Of-Check to Time-Of-Use: a gap between checking state and acting on it.</span></div>
  <div class="kv"><span class="k">atomic transition</span><span class="v">A single DB statement that checks and writes together (<code>UPDATE ... WHERE ... RETURNING</code>).</span></div>
  <div class="kv"><span class="k">unique constraint</span><span class="v">A DB index that makes a duplicate impossible, enforcing "only once" without application logic.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Pre-hijacking: never merge a federated login into an unverified pre-existing account; link on the sub, verify first.</li>
<li>Races (TOCTOU): a check-then-act on a one-time action lets two concurrent requests both succeed.</li>
<li>Fix with an atomic DB transition (<code>UPDATE ... WHERE used_at IS NULL RETURNING</code>) or a unique constraint.</li>
<li>Races hide in one-time tokens, bonuses, unique sign-up, withdrawals — anywhere "only once" matters.</li>
<li>Functional tests miss the race; you need concurrency or a constraint. That closes Chapter 10's attacks.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-6-3-dat-lai-mat-khau', title: 'Back to 6.3 — one-time reset tokens', sub: 'There, building a single-use password-reset token (issue, hash, consume). Here, the race that redeems it twice if the consume is not atomic. One token, two lessons — build it, then break it.', cta: 'OPEN LESSON 6.3 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Chiếm tài khoản TRƯỚC, và những cuộc đua chẳng ai kiểm thử</h2>
<p class="lead">Hai cú tấn công cuối của chương nấp trong vòng đời tài khoản, nơi kiểm thử bình thường không bao giờ nhìn tới. Trong <em>chiếm trước</em>, kẻ tấn công đã ở trong tài khoản trước khi nạn nhân từng tới. Trong một <em>điều kiện đua</em>, hai yêu cầu cùng một khoảnh khắc phá một thao tác "chỉ một lần". Cả hai vô hình với một kiểm thử chức năng, và cả hai có một cách sửa một-ý-tưởng.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> giải thích chiếm-trước tài khoản và vì sao không bao giờ được gộp vào tài khoản chưa xác minh; phát hiện một cuộc đua thời-điểm-kiểm-tới-thời-điểm-dùng trên một thao tác một-lần; và sửa nó bằng một chuyển trạng thái nguyên tử ở cơ sở dữ liệu.</p>
</div>

<h3>Chiếm trước</h3>
<p>Kẻ tấn công đăng ký bằng email của <em>nạn nhân</em> trước khi nạn nhân làm, và ngồi lên tài khoản — chưa xác minh. Nhiều tháng sau nạn nhân tới và bấm "Đăng nhập bằng Google" (OIDC, Chương 8). Một máy chủ ngây thơ tìm thấy một tài khoản sẵn có đang giữ email đó và <em>gắn</em> danh tính liên kết vào nó. Giờ tài khoản nạn nhân tưởng là của mình lại là một cái kẻ tấn công lập ra — với một mật khẩu họ biết hay một phiên họ giữ. Nạn nhân đăng nhập vui vẻ; kẻ tấn công vẫn giữ một chìa. Việc gộp đã trao cho kẻ tấn công một tài khoản đã xác minh.</p>

<h3>Cách sửa: không bao giờ gộp vào cái chưa xác minh</h3>
<p>Một tài khoản sẵn có chưa xác minh chưa chứng minh gì — ai cũng gõ được bất kỳ email nào. Khi đăng nhập liên kết lần đầu, đừng gắn vào nó: bỏ bản ghi chưa xác minh cũ và tạo một tài khoản mới mà nhà cung cấp danh tính đã xác minh, hoặc buộc nạn nhân xác minh quyền sở hữu trước (Chương 6). Và nối theo <code>sub</code> ổn định của provider, không bao giờ một email đổi được, giành được (Chương 8). Demo đo thật:</p>
${ra(OUT['105-prehijack-race'])}
<p>"Gắn theo email" ngây thơ giữ kẻ tấn công ở lại; bỏ bản ghi chưa xác minh cũ khoá họ ra ngoài. Cả cú tấn công dựa vào việc coi một email chưa xác minh là bằng chứng sở hữu — thứ nó không bao giờ là.</p>

<h3>Điều kiện đua (TOCTOU)</h3>
<p>Một thao tác một-lần — đổi một token đặt lại, nhận một thưởng đăng ký, dùng một lời mời — thường đọc "nó chưa dùng chứ?" rồi hành động. Giữa phép <em>kiểm</em> và <em>hành động</em>, một yêu cầu đồng thời thứ hai chen vào. Cả hai đọc "chưa dùng", cả hai hành động. Đây là Thời-điểm-Kiểm tới Thời-điểm-Dùng, và trong demo hai lần đổi đồng thời một token đặt lại một-lần <em>đều</em> thành công — token bị dùng hai lần.</p>

<h3>Cách sửa: nguyên tử ở cơ sở dữ liệu</h3>
<p>Cách sửa không phải một khoá trong mã của bạn; nó là làm phép kiểm và lần ghi thành một câu lệnh duy nhất mà cơ sở dữ liệu tuần tự hoá:</p>
${ma('sql', ATOMIC_SQL)}
<p>Dòng hoặc lật và trả về id của nó (bạn thắng) hoặc trả về không gì (người khác đã tiêu nó). Cơ sở dữ liệu, không phải ứng dụng của bạn, quyết định cuộc đua — đúng một người gọi thắng. Trong demo, consume nguyên tử cho một thành công nơi kiểm-rồi-làm cho hai.</p>

<h3>Đua nấp ở đâu</h3>
<p>Bất cứ đâu một thứ có hạn được kiểm rồi cấp: token một-lần, thưởng "N người đầu", đăng ký tên-duy-nhất, rút số dư, đặt chỗ ngồi. Nếu tính đúng đắn phụ thuộc "chỉ một lần" hay "chỉ khi còn", phép kiểm và lần ghi phải là một bước nguyên tử — hoặc được một ràng buộc cơ sở dữ liệu thực thi (một index <code>UNIQUE</code>, một <code>CHECK</code>). Một kiểm thử chức năng với một yêu cầu một lúc sẽ không bao giờ hiện ra con lỗi; nó cần hai cái cùng một khoảnh khắc.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "kiểm rồi làm" trông đúng.</strong> <code>if (token.used) return error; token.used = true; doIt();</code> đọc hoàn hảo và qua mọi kiểm thử đơn luồng. Dưới đồng thời thật nó để hai yêu cầu đều qua phép kiểm trước khi một trong hai ghi. Cách sửa đáng tin duy nhất là làm chuyển trạng thái nguyên tử (<code>UPDATE ... WHERE used_at IS NULL RETURNING</code>) hoặc đỡ nó bằng một ràng buộc duy nhất — không bao giờ một phép kiểm theo sau bởi một lần ghi riêng.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Chiếm-trước tài khoản là gì?"</strong> — Kẻ tấn công tạo một tài khoản bằng email nạn nhân trước; một đăng nhập liên kết sau gộp vào nó, để kẻ tấn công còn quyền. Sửa: không bao giờ gộp vào tài khoản chưa xác minh; nối theo sub; xác minh trước.</li>
<li><strong>"Một cuộc đua TOCTOU là gì?"</strong> — Thời-điểm-kiểm tới thời-điểm-dùng: hai yêu cầu đều qua một phép kiểm "chưa dùng?" trước khi một trong hai đánh dấu đã dùng. Sửa bằng một chuyển trạng thái DB nguyên tử hoặc một ràng buộc duy nhất.</li>
<li><strong>"Vì sao test của bạn không bắt được?"</strong> — Kiểm thử chức năng chạy một yêu cầu một lúc; cuộc đua cần hai cái đồng thời. Bạn cần một kiểm thử đồng thời, hoặc một ràng buộc làm cuộc đua không thể xảy ra.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo10/pre-hijack-race.mjs</code>. Trong cuộc đua, bao nhiêu lần đổi thành công với kiểm-rồi-làm so với consume nguyên tử?</li>
<li>Vì sao nối một đăng nhập liên kết theo email, thay vì theo <code>sub</code> của provider, mở đường cho chiếm-trước?</li>
<li>Viết câu SQL một dòng làm một lần đổi token một-lần an toàn dưới đồng thời.</li>
</ol>
<p><strong>Lời giải:</strong> (1) kiểm-rồi-làm: hai thành công (token dùng hai lần); consume nguyên tử: đúng một. (2) một email đổi được và giành được — kẻ tấn công đăng ký trước nó chưa xác minh — nên khớp theo email gắn đăng nhập thật của nạn nhân vào tài khoản của kẻ tấn công; <code>sub</code> là định danh ổn định, không giành được của provider. (3) <code>UPDATE one_time_tokens SET used_at = now() WHERE id = $1 AND used_at IS NULL RETURNING id;</code> — một dòng trả về nghĩa là bạn thắng, không dòng nghĩa là người khác thắng.</p>
<p><strong>Đạt khi:</strong> bạn không bao giờ gộp một đăng nhập liên kết vào một tài khoản chưa xác minh, và mọi thao tác một-lần là một chuyển trạng thái DB nguyên tử hoặc một ràng buộc duy nhất.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pre-hijacking (chiếm trước)</span><span class="v">Tạo một tài khoản bằng email nạn nhân trước, để một đăng nhập sau gộp vào tài khoản của kẻ tấn công.</span></div>
  <div class="kv"><span class="k">link on the sub (nối theo sub)</span><span class="v">Gắn một danh tính liên kết theo <code>sub</code> ổn định của provider, không bao giờ một email giành được (Chương 8).</span></div>
  <div class="kv"><span class="k">TOCTOU</span><span class="v">Thời-điểm-Kiểm tới Thời-điểm-Dùng: một khoảng trống giữa kiểm trạng thái và hành động trên nó.</span></div>
  <div class="kv"><span class="k">atomic transition (chuyển nguyên tử)</span><span class="v">Một câu lệnh DB duy nhất kiểm và ghi cùng nhau (<code>UPDATE ... WHERE ... RETURNING</code>).</span></div>
  <div class="kv"><span class="k">unique constraint (ràng buộc duy nhất)</span><span class="v">Một index DB làm một bản sao không thể xảy ra, thực thi "chỉ một lần" không cần logic ứng dụng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chiếm trước: không bao giờ gộp một đăng nhập liên kết vào một tài khoản sẵn có chưa xác minh; nối theo sub, xác minh trước.</li>
<li>Đua (TOCTOU): một kiểm-rồi-làm trên một thao tác một-lần để hai yêu cầu đồng thời đều thành công.</li>
<li>Sửa bằng một chuyển trạng thái DB nguyên tử (<code>UPDATE ... WHERE used_at IS NULL RETURNING</code>) hoặc một ràng buộc duy nhất.</li>
<li>Đua nấp ở token một-lần, thưởng, đăng ký duy nhất, rút tiền — bất cứ đâu "chỉ một lần" quan trọng.</li>
<li>Kiểm thử chức năng bỏ sót cuộc đua; bạn cần đồng thời hoặc một ràng buộc. Thế là hết các cú tấn công Chương 10.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-6-3-dat-lai-mat-khau', title: 'Quay lại 6.3 — token đặt lại một-lần', sub: 'Ở đó, dựng một token đặt lại mật khẩu dùng-một-lần (phát, băm, tiêu). Ở đây, cuộc đua đổi nó hai lần nếu consume không nguyên tử. Một token, hai bài — dựng nó, rồi phá nó.', cta: 'MỞ BÀI 6.3 →' })}
</div>
`,
};
