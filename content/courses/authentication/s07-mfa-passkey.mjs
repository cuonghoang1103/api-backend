/**
 * Authentication — Chương 7: Yếu tố thứ hai và passkey.
 * Yếu tố thứ hai mua được gì · TOTP nhìn từ bên trong · đăng ký và mã khôi phục ·
 * WebAuthn và passkey · cài đặt passkey · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 7 — The second factor, and passkeys|||Chương 7 — Yếu tố thứ hai, và passkey',
  description: 'Mật khẩu vẫn hỏng dù bạn băm nó đúng cách nhất, vì người dùng dùng lại nó và vì họ bị lừa gõ nó vào chỗ khác. Chương này dựng yếu tố thứ hai từ số 0 — TOTP viết tay khớp đúng vector kiểm thử của RFC 6238 — rồi sang passkey, thứ duy nhất trong cả khoá thật sự CHẶN được lừa đảo thay vì chỉ làm nó khó hơn.',
  lessons: [

    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — What a second factor buys, and what it does not|||7.1 — Yếu tố thứ hai mua được gì, và KHÔNG mua được gì',
      slug: 'auth-7-1-yeu-to-thu-hai',
      type: 'LESSON',
      description: 'Không phải yếu tố thứ hai nào cũng chặn được cùng những cú tấn công như nhau, và cái khoảng chênh đó lớn hơn người ta tưởng nhiều. Bài này xếp sáu mối đe doạ cạnh bốn loại yếu tố, chỉ ra vì sao SMS vừa yếu vừa đáng giữ, vạch mặt cái "MFA" thực chất là một yếu tố đếm hai lần, và quyết định xem nên đòi yếu tố thứ hai LÚC NÀO.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>What a second factor buys, and what it does not</h2>
<p class="lead">Chapter 2 made passwords as safe as a password can be, and they still fail: users reuse them, and users get talked into typing them somewhere else. A second factor is the answer to both — but which second factor decides which of those two problems you actually solved, and the gap between the options is much wider than "some MFA is better than none" suggests.</p>

<h3>Three categories, and the one everybody misuses</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Something you know</span><span class="lz-t">Password, PIN, security question</span><span class="lz-d">Copyable, guessable, phishable, and reusable across sites. A second factor from this category is not a second factor — it is a second password with worse entropy.</span></div>
  <div class="lz-step"><span class="lz-k">Something you have</span><span class="lz-t">Phone, security key, an app on a device</span><span class="lz-d">The interesting category, and the one where implementations differ enormously. A TOTP secret is "something you have" only until it is copied; a hardware-bound key genuinely cannot be.</span></div>
  <div class="lz-step"><span class="lz-k">Something you are</span><span class="lz-t">Fingerprint, face</span><span class="lz-d">Almost never a factor your server sees. Face ID unlocks the key on the device; your server receives a signature and learns only that the device was unlocked. That indirection is a feature — you never store a biometric.</span></div>
  <div class="lz-step"><span class="lz-k">The failure everybody ships</span><span class="lz-t">Email OTP on an account whose reset channel is email</span><span class="lz-d">If the mailbox can already reset the password, a code sent to that mailbox adds nothing: one compromised mailbox still yields the account. It is one factor, counted twice, wearing the interface of two.</span></div>
</div>

<h3>Six threats against four factors</h3>
<div class="out"># Nghien cuu cua Google (2019), do tren tai khoan that:
#                              bot tu dong   lua dao dai tra   lua dao nham dich
#   chi mat khau                     ~0%            ~0%               ~0%
#   ma OTP qua SMS                   100%           96%               76%
#   nhac tren thiet bi               100%           99%               90%
#   khoa bao mat (WebAuthn)          100%           100%              100%

# Ba cot, ba muc do quyet tam. Khoang chenh 76% -> 100% o cot cuoi
# chinh la khac biet giua "lam kho" va "lam KHONG THE".</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Credential stuffing and password reuse</span><span class="v">Every second factor stops this completely. The attacker has a valid password from another breach and nothing else. This is the most common attack by volume, and it is why even SMS is worth turning on.</span></div>
  <div class="kv"><span class="k">Bulk phishing</span><span class="v">A fake login page that harvests password and code. TOTP and SMS both lose here if the attacker relays the code within thirty seconds — and modern phishing kits do exactly that, automatically. Passkeys do not lose, for a structural reason covered in Lesson 7.4.</span></div>
  <div class="kv"><span class="k">Device theft and malware</span><span class="v">A phone with an authenticator app on it, unlocked. No server-side factor helps; the defence is the device's own lock screen and the ability to revoke the enrolment remotely — the device list from Lesson 5.4, applied to factors.</span></div>
  <div class="kv"><span class="k">SIM swap</span><span class="v">The one that makes SMS special. An attacker persuades a carrier to move the number, and every SMS code follows. It is targeted, it is not rare, and no code you write prevents it — which is why SMS should never be the only factor on a high-value account.</span></div>
</div>

<h3>SMS: weak, and still worth offering</h3>
<div class="callout warn">
<p><strong>The absolutist position on SMS is wrong, and so is treating it as equivalent.</strong> NIST deprecated SMS as a factor years ago and the reasoning is sound: SIM swap, SS7 interception, unencrypted delivery, and codes that appear on a lock screen. But the alternative for most users is no second factor at all — and SMS still stops one hundred percent of automated credential stuffing, which is the attack that actually happens to them. Offer it, label it honestly as the weakest option, forbid it as the sole factor for administrators and for anything holding money, and never let it be the recovery path that bypasses a stronger factor. The right question is not "is SMS good" but "compared to what this user would otherwise have".</p>
</div>

<h3>When to ask, which is not "every login"</h3>
<pre><code><span class="tok-comment">// Yếu tố thứ hai ở BA thời điểm khác nhau, và chúng khác nhau thật.</span>

<span class="tok-comment">// 1. Lúc đăng nhập — nhưng nhớ thiết bị, không thì người dùng sẽ tắt MFA đi</span>
if (!rememberedDevice(req)) await changeSecondFactor(u);

<span class="tok-comment">// 2. Xác thực lại trước việc nhạy cảm — Bài 6.5, và đây là chỗ quan trọng NHẤT</span>
app.patch('/me/email', requireReauth({ within: 300 }), doiEmail);
app.post('/me/delete',     requireReauth({ within: 300 }), xoaTaiKhoan);
app.post('/thanh-toan',  requireReauth({ within: 300 }), chuyenTien);

<span class="tok-comment">// 3. Khi có gì đó BẤT THƯỜNG — quốc gia mới, thiết bị mới, sau một lần đặt lại</span>
if (riskScore(req, u) &gt; NGUONG) await changeSecondFactor(u);</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Remembering the device is not a weakness, it is what makes MFA survive</span><span class="lz-lnote">A factor demanded on every login gets switched off, or the user picks the weakest option available. Remember the browser for thirty days with a separate signed cookie, and re-ask when it expires, when the device is new, or when the risk score rises.</span></div>
  <div class="lz-layer"><span class="lz-lname">Step-up is where the value actually is</span><span class="lz-lnote">Login MFA protects against someone who has the password. Step-up protects against someone who already has a live session — a stolen cookie, an unlocked laptop, an XSS. Chapters 3 through 6 all end at the same place: the attacker is inside. Step-up is the only control that still bites there.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bound to the operation, not just to the clock</span><span class="lz-lnote">"Authenticated within five minutes" is the usual rule and it is enough for most products. For payments, bind the challenge to the specific action — the amount and the destination — so a re-auth the user performed for something else cannot be reused for a transfer they never saw.</span></div>
  <div class="lz-layer"><span class="lz-lname">Enrolling a factor is itself a sensitive operation</span><span class="lz-lnote">Adding, removing or changing a factor must require re-authentication, and must mail the account. Otherwise an attacker with a session simply enrols their own factor and locks the owner out — the same shape as the email change in Lesson 6.5.</span></div>
</div>

<h3>What to build, in order</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Passkeys first, if you can</span><span class="v">They are the only option that closes phishing, they are faster than typing a password, and every current platform supports them. For a new product, going straight to passkeys with a password fallback is a defensible choice today in a way it was not two years ago.</span></div>
  <div class="kv"><span class="k">TOTP second, because it works everywhere</span><span class="v">No SMS costs, no carrier, no push infrastructure, works offline, works for a user on a ten-year-old phone. It is thirty lines of code (Lesson 7.2) and it stops the attack that most of your users will actually face.</span></div>
  <div class="kv"><span class="k">Recovery codes always, from day one</span><span class="v">Every factor is a thing that can be lost, and the support cost of "I dropped my phone in the sea" is enormous. Recovery codes are covered in Lesson 7.3, and skipping them means building account recovery by hand during an incident.</span></div>
  <div class="kv"><span class="k">Never let recovery be weaker than the factor</span><span class="v">MFA plus a reset link that turns it off is a password-only account with extra steps. Whatever the recovery path is, it has to be at least as hard to abuse as the factor it replaces — otherwise the attacker simply uses the recovery path.</span></div>
</div>
<div class="note-ct">
<p><strong>The number that decides the design.</strong> Ask what fraction of your users would enable an optional factor: for a consumer product it is usually under ten percent, and for an internal tool you can require it and reach a hundred. That single figure decides everything else — an optional factor almost nobody turns on protects almost nobody, so if MFA matters for your product, the interesting work is not the cryptography in the next lesson but the enrolment prompt, the recovery story and the decision to make it mandatory for the accounts that matter.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://security.googleblog.com/2019/05/new-research-how-effective-is-basic.html" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">Google — how effective is basic account hygiene</span><span class="lc-sub">security.googleblog.com · The study behind the table above, with its methodology</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B — authenticators</span><span class="lc-sub">pages.nist.gov · Authenticator assurance levels, and the position on SMS</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — multifactor authentication</span><span class="lc-sub">cheatsheetseries.owasp.org · When to prompt, and the recovery trap</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">Origins, and why the browser knows which site you are really on</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Relay a TOTP code through a proxy login page and watch the second factor fail to help</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Yếu tố thứ hai mua được gì, và KHÔNG mua được gì</h2>
<p class="lead">Chương 2 đã làm cho mật khẩu an toàn tới mức một cái mật khẩu có thể an toàn, mà nó vẫn hỏng: người dùng dùng lại nó, và người dùng bị dụ gõ nó vào chỗ khác. Yếu tố thứ hai là lời giải cho cả hai — nhưng CHỌN yếu tố thứ hai nào sẽ quyết định bạn thật sự giải được cái nào trong hai vấn đề đó, và khoảng chênh giữa các lựa chọn rộng hơn nhiều so với câu "có MFA nào cũng hơn không có" ngụ ý.</p>

<h3>Ba nhóm, và cái nhóm ai cũng dùng sai</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Thứ bạn BIẾT</span><span class="lz-t">Mật khẩu, mã PIN, câu hỏi bảo mật</span><span class="lz-d">Chép được, đoán được, lừa được, và dùng lại được ở nhiều trang. Một "yếu tố thứ hai" lấy từ nhóm này KHÔNG phải yếu tố thứ hai — nó là một mật khẩu thứ hai với entropy còn tệ hơn.</span></div>
  <div class="lz-step"><span class="lz-k">Thứ bạn CÓ</span><span class="lz-t">Điện thoại, khoá bảo mật, một ứng dụng trên thiết bị</span><span class="lz-d">Nhóm thú vị, và cũng là nhóm mà các bản cài đặt khác nhau một trời một vực. Một bí mật TOTP chỉ là "thứ bạn có" cho tới lúc nó bị CHÉP; còn một khoá gắn cứng vào phần cứng thì thật sự không chép được.</span></div>
  <div class="lz-step"><span class="lz-k">Thứ bạn LÀ</span><span class="lz-t">Vân tay, khuôn mặt</span><span class="lz-d">Gần như không bao giờ là một yếu tố mà máy chủ của bạn NHÌN THẤY. Face ID mở khoá cái khoá nằm trên thiết bị; máy chủ của bạn nhận về một chữ ký và chỉ biết rằng thiết bị đã được mở khoá. Chính cái lớp gián tiếp đó là một ưu điểm — bạn không bao giờ lưu một mẫu sinh trắc nào cả.</span></div>
  <div class="lz-step"><span class="lz-k">Cái sai mà ai cũng đưa lên production</span><span class="lz-t">OTP qua email trên một tài khoản mà kênh đặt lại cũng là email</span><span class="lz-d">Nếu hộp thư ấy vốn đã đặt lại được mật khẩu thì một mã gửi tới chính hộp thư đó chẳng thêm gì: một hộp thư bị chiếm vẫn cho ra nguyên cái tài khoản. Đó là MỘT yếu tố, đếm hai lần, khoác giao diện của hai.</span></div>
</div>

<h3>Sáu mối đe doạ đấu với bốn yếu tố</h3>
<div class="out"># Nghien cuu cua Google (2019), do tren tai khoan that:
#                              bot tu dong   lua dao dai tra   lua dao nham dich
#   chi mat khau                     ~0%            ~0%               ~0%
#   ma OTP qua SMS                   100%           96%               76%
#   nhac tren thiet bi               100%           99%               90%
#   khoa bao mat (WebAuthn)          100%           100%              100%

# Ba cot, ba muc do quyet tam. Khoang chenh 76% -> 100% o cot cuoi
# chinh la khac biet giua "lam kho" va "lam KHONG THE".</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nhồi tín vật và dùng lại mật khẩu</span><span class="v">Mọi yếu tố thứ hai đều chặn đứng chuyện này. Kẻ tấn công có một mật khẩu hợp lệ lấy từ một vụ rò rỉ khác và không có gì thêm. Đây là cú tấn công phổ biến nhất tính theo số lượng, và đó là lý do bật cả SMS lên cũng đáng.</span></div>
  <div class="kv"><span class="k">Lừa đảo đại trà</span><span class="v">Một trang đăng nhập giả thu cả mật khẩu lẫn mã. TOTP và SMS đều THUA ở đây nếu kẻ tấn công chuyển tiếp cái mã trong vòng ba mươi giây — và các bộ công cụ lừa đảo hiện đại làm đúng như vậy, tự động. Passkey thì KHÔNG thua, vì một lý do thuộc về cấu trúc, bàn ở Bài 7.4.</span></div>
  <div class="kv"><span class="k">Mất thiết bị và mã độc</span><span class="v">Một cái điện thoại có ứng dụng sinh mã, đang mở khoá. Không yếu tố nào phía máy chủ giúp được; hàng phòng thủ là màn hình khoá của chính thiết bị và khả năng thu hồi đăng ký đó từ xa — chính là danh sách thiết bị ở Bài 5.4, áp cho các yếu tố.</span></div>
  <div class="kv"><span class="k">Tráo SIM</span><span class="v">Cái làm cho SMS thành trường hợp đặc biệt. Kẻ tấn công thuyết phục nhà mạng chuyển số, và mọi mã SMS đi theo. Nó nhắm đích, nó không hiếm, và không dòng mã nào bạn viết ngăn được — vì thế SMS không bao giờ được là yếu tố DUY NHẤT trên một tài khoản giá trị cao.</span></div>
</div>

<h3>SMS: yếu, mà vẫn đáng cung cấp</h3>
<div class="callout warn">
<p><strong>Lập trường tuyệt đối chống SMS là sai, mà coi nó ngang hàng với các yếu tố khác cũng sai.</strong> NIST đã loại SMS khỏi danh sách yếu tố khuyến nghị từ nhiều năm trước và lý lẽ của họ vững: tráo SIM, chặn qua SS7, truyền không mã hoá, và mã hiện ngay trên màn hình khoá. Nhưng với phần lớn người dùng, phương án thay thế là KHÔNG CÓ yếu tố thứ hai nào cả — mà SMS thì vẫn chặn được một trăm phần trăm số vụ nhồi tín vật tự động, tức là đúng cái cú tấn công thật sự xảy ra với họ. Hãy cung cấp nó, ghi nhãn trung thực là lựa chọn yếu nhất, cấm nó làm yếu tố duy nhất với quản trị viên và với bất cứ thứ gì giữ tiền, và đừng bao giờ để nó thành con đường khôi phục đi vòng qua một yếu tố mạnh hơn. Câu hỏi đúng không phải "SMS có tốt không" mà là "so với thứ mà người dùng này VỐN SẼ CÓ".</p>
</div>

<h3>Hỏi lúc nào, và câu trả lời không phải "mọi lần đăng nhập"</h3>
<pre><code><span class="tok-comment">// Yếu tố thứ hai ở BA thời điểm khác nhau, và chúng khác nhau thật.</span>

<span class="tok-comment">// 1. Lúc đăng nhập — nhưng nhớ thiết bị, không thì người dùng sẽ tắt MFA đi</span>
if (!rememberedDevice(req)) await changeSecondFactor(u);

<span class="tok-comment">// 2. Xác thực lại trước việc nhạy cảm — Bài 6.5, và đây là chỗ quan trọng NHẤT</span>
app.patch('/me/email', requireReauth({ within: 300 }), doiEmail);
app.post('/me/delete',     requireReauth({ within: 300 }), xoaTaiKhoan);
app.post('/thanh-toan',  requireReauth({ within: 300 }), chuyenTien);

<span class="tok-comment">// 3. Khi có gì đó BẤT THƯỜNG — quốc gia mới, thiết bị mới, sau một lần đặt lại</span>
if (riskScore(req, u) &gt; NGUONG) await changeSecondFactor(u);</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nhớ thiết bị không phải điểm yếu, đó là thứ giúp MFA sống sót</span><span class="lz-lnote">Một yếu tố bị đòi ở mọi lần đăng nhập sẽ bị TẮT đi, hoặc người dùng sẽ chọn phương án yếu nhất hiện có. Hãy nhớ trình duyệt trong ba mươi ngày bằng một cookie đã ký riêng, rồi hỏi lại khi nó hết hạn, khi thiết bị là mới, hoặc khi điểm rủi ro tăng lên.</span></div>
  <div class="lz-layer"><span class="lz-lname">Giá trị thật sự nằm ở chỗ nâng cấp xác thực</span><span class="lz-lnote">MFA lúc đăng nhập bảo vệ trước kẻ CÓ mật khẩu. Nâng cấp xác thực bảo vệ trước kẻ ĐÃ CÓ một phiên sống — một cookie bị cắp, một cái laptop chưa khoá, một lỗ XSS. Chương 3 tới Chương 6 đều kết thúc ở cùng một chỗ: kẻ tấn công đã ở BÊN TRONG. Nâng cấp xác thực là biện pháp duy nhất còn cắn được ở đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Buộc vào THAO TÁC, không chỉ vào đồng hồ</span><span class="lz-lnote">"Đã xác thực trong vòng năm phút" là luật thông thường và đủ cho phần lớn sản phẩm. Với thanh toán, hãy buộc thử thách vào đúng hành động cụ thể — số tiền và nơi nhận — để một lần xác thực lại người dùng làm cho việc KHÁC không thể bị tái dùng cho một lệnh chuyển tiền mà họ chưa từng nhìn thấy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đăng ký một yếu tố TỰ NÓ là một thao tác nhạy cảm</span><span class="lz-lnote">Thêm, gỡ hay đổi một yếu tố đều phải đòi xác thực lại, và đều phải gửi thư báo về tài khoản. Không thì kẻ tấn công có một phiên chỉ việc đăng ký yếu tố của CHÍNH HẮN rồi khoá chủ nhân ở ngoài — đúng cái hình dạng của việc đổi email ở Bài 6.5.</span></div>
</div>

<h3>Nên dựng cái gì, theo thứ tự nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Passkey trước, nếu bạn làm được</span><span class="v">Đó là lựa chọn DUY NHẤT bịt được lừa đảo, nó nhanh hơn cả gõ mật khẩu, và mọi nền tảng hiện hành đều hỗ trợ. Với một sản phẩm mới, đi thẳng tới passkey kèm mật khẩu làm đường lùi là một lựa chọn bảo vệ được ngày hôm nay, theo cách mà hai năm trước thì chưa.</span></div>
  <div class="kv"><span class="k">TOTP thứ hai, vì nó chạy ở mọi nơi</span><span class="v">Không tốn phí SMS, không phụ thuộc nhà mạng, không cần hạ tầng đẩy thông báo, chạy khi mất mạng, chạy cho cả người dùng cầm một cái điện thoại mười năm tuổi. Nó là ba mươi dòng mã (Bài 7.2) và nó chặn đúng cú tấn công mà phần lớn người dùng của bạn sẽ thật sự gặp.</span></div>
  <div class="kv"><span class="k">Mã khôi phục thì LUÔN có, ngay từ ngày đầu</span><span class="v">Mọi yếu tố đều là một thứ CÓ THỂ MẤT, và chi phí hỗ trợ cho câu "tôi làm rơi điện thoại xuống biển" thì khổng lồ. Mã khôi phục nằm ở Bài 7.3, và bỏ qua chúng nghĩa là bạn sẽ phải dựng đường khôi phục tài khoản BẰNG TAY ngay giữa lúc có sự cố.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ để đường khôi phục yếu hơn chính cái yếu tố</span><span class="v">MFA cộng với một đường dẫn đặt lại có thể TẮT nó đi thì chỉ là một tài khoản chỉ-có-mật-khẩu kèm thêm vài bước. Đường khôi phục là gì cũng được, miễn là nó phải khó lạm dụng ít nhất ngang cái yếu tố nó thay thế — không thì kẻ tấn công đơn giản là đi đường khôi phục.</span></div>
</div>
<div class="note-ct">
<p><strong>Con số quyết định cả thiết kế.</strong> Hãy hỏi xem bao nhiêu phần trăm người dùng của bạn sẽ bật một yếu tố TUỲ CHỌN: với sản phẩm cho người tiêu dùng, con số đó thường dưới mười phần trăm, còn với một công cụ nội bộ thì bạn BẮT BUỘC được và chạm tới một trăm. Riêng con số ấy quyết định mọi thứ còn lại — một yếu tố tuỳ chọn mà gần như không ai bật thì gần như chẳng bảo vệ được ai, nên nếu MFA thật sự quan trọng với sản phẩm của bạn thì phần việc thú vị không nằm ở phần mật mã của bài kế tiếp, mà nằm ở lời mời đăng ký, ở câu chuyện khôi phục, và ở quyết định BẮT BUỘC nó với những tài khoản đáng bắt buộc.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://security.googleblog.com/2019/05/new-research-how-effective-is-basic.html" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">Google — vệ sinh tài khoản cơ bản hiệu quả tới đâu</span><span class="lc-sub">security.googleblog.com · Nghiên cứu đứng sau cái bảng ở trên, kèm phương pháp đo</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B — các bộ xác thực</span><span class="lc-sub">pages.nist.gov · Các mức bảo đảm xác thực, và lập trường về SMS</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — xác thực đa yếu tố</span><span class="lc-sub">cheatsheetseries.owasp.org · Hỏi lúc nào, và cái bẫy nằm ở đường khôi phục</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Nền tảng Web</span><span class="lc-sub">Origin, và vì sao trình duyệt biết bạn ĐANG THẬT SỰ ở trang nào</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chuyển tiếp một mã TOTP qua một trang đăng nhập trung gian và nhìn yếu tố thứ hai không giúp được gì</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — TOTP from the inside, in thirty lines|||7.2 — TOTP nhìn từ bên trong, trong ba mươi dòng',
      slug: 'auth-7-2-totp',
      type: 'LESSON',
      description: 'Không có phép màu nào trong TOTP: một bí mật dùng chung, một cái đồng hồ, một lần HMAC và một phép chia lấy dư. Bài này viết nó bằng tay bằng module crypto có sẵn của Node, chạy đúng bộ vector kiểm thử chính thức của RFC 6238, rồi vá hai chỗ mà mọi bản cài đặt ngây thơ đều để hở: cửa sổ trôi và việc TÁI DÙNG một mã.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>TOTP from the inside, in thirty lines</h2>
<p class="lead">TOTP has a reputation for being fiddly, which comes entirely from base32 and time arithmetic rather than from cryptography. The algorithm itself is one HMAC and one modulo, it fits on a screen, and writing it once means you will never again be unsure what a library is doing on your behalf.</p>

<h3>The whole algorithm</h3>
<pre><code>import { createHmac } from 'node:crypto';

function hotp(khoa: Buffer, counter: number, soChuSo = 6): string {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));                    <span class="tok-comment">// 1. bộ đếm, 8 byte, big-endian</span>

  const h = createHmac('sha1', key).update(buf).digest(); <span class="tok-comment">// 2. HMAC-SHA1 → 20 byte</span>

  const off = h[h.length - 1] &amp; 0x0f;                      <span class="tok-comment">// 3. cắt động: 4 bit cuối = vị trí</span>
  const bin = ((h[off] &amp; 0x7f) &lt;&lt; 24) | (h[off + 1] &lt;&lt; 16)
            | (h[off + 2] &lt;&lt; 8)   |  h[off + 3];           <span class="tok-comment">//    lấy 31 bit từ vị trí đó</span>

  return String(bin % 10 ** soChuSo).padStart(soChuSo, '0'); <span class="tok-comment">// 4. lấy dư, đệm số 0</span>
}

<span class="tok-comment">// TOTP chỉ là HOTP với bộ đếm = thời gian chia cho 30.</span>
const totp = (khoa: Buffer, giay = Date.now() / 1000, buoc = 30) =&gt;
  hotp(key, Math.floor(giay / buoc));</code></pre>
<div class="out">RFC 6238 test vectors (SHA-1):
  T=         59  ->  94287082
  T= 1111111109  ->  07081804
  T= 1111111111  ->  14050471
  T= 1234567890  ->  89005924
  T= 2000000000  ->  69279037
  T=20000000000  ->  65353130

# Sau con so nay in NGUYEN VAN trong phu luc B cua RFC 6238, voi hat giong
# "12345678901234567890". Ba salt dong o tren khop ca sau. Do la toan bo
# thuat toan — khong con phan nao khac.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1</span><span class="lz-t">The counter is the clock</span><span class="lz-d">Unix seconds divided by thirty, floored. Both sides compute it independently from their own clock — nothing is transmitted, and that is why the code works on a phone in aeroplane mode.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2</span><span class="lz-t">HMAC-SHA1, and yes it is fine</span><span class="lz-d">SHA-1 is broken for collision resistance, which HMAC does not depend on. RFC 6238 permits SHA-256 and SHA-512, but almost no authenticator app implements them, so a "more secure" choice here just produces codes that never match.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3</span><span class="lz-t">Dynamic truncation</span><span class="lz-d">The last nibble picks a starting byte, and four bytes from there become a 31-bit number — the top bit is masked to avoid sign trouble in languages without unsigned integers. It is a 1990s design detail, preserved because interoperability requires it.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4</span><span class="lz-t">Modulo, which throws almost everything away</span><span class="lz-d">Thirty-one bits reduced to six digits: a million possibilities, per thirty-second window. That number is small, and it is why rate limiting in Lesson 7.3 is not optional — without it, brute force is an afternoon.</span></div>
</div>

<h3>Base32, the QR code, and the shape of an enrolment</h3>
<pre><code><span class="tok-comment">// Bí mật là 20 byte ngẫu nhiên. Ứng dụng sinh mã đọc base32, KHÔNG đọc hex.</span>
const secret = randomBytes(20);
const uri = 'otpauth://totp/CuongThai:' + encodeURIComponent(u.email)
          + '?secret=' + base32(secret)
          + '&amp;issuer=CuongThai&amp;algorithm=SHA1&amp;digits=6&amp;period=30';</code></pre>
<div class="out">bi mat moi   : IIO6GHS2LR6L2HAJ3BBEARUMFK3CX5LK
otpauth URI  : otpauth://totp/CuongThai:cuong%40cuongthai.com?secret=IIO6GHS2LR6L2HAJ3BBEARUMFK3CX5LK&amp;issuer=CuongThai&amp;algorithm=SHA1&amp;digits=6&amp;period=30</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Twenty bytes, not sixteen</span><span class="v">RFC 4226 requires at least 128 bits and recommends 160 — which is also the HMAC-SHA1 block size, so twenty bytes is the natural choice. Some libraries default to ten; that is below the recommendation for no benefit.</span></div>
  <div class="kv"><span class="k">The QR code is just that URI</span><span class="v">Nothing is fetched, nothing phones home. Render the string as a QR image on the server or in the browser, and always show the base32 secret as text next to it — users on desktop authenticators, or with a broken camera, need to type it.</span></div>
  <div class="kv"><span class="k">The label and issuer matter more than they look</span><span class="v">They are what the user sees in a list of thirty entries. Put the product name in <code>issuer</code> and the account identifier in the label; get it wrong and the user cannot tell which of four codes is yours.</span></div>
  <div class="kv"><span class="k">Encrypt the secret at rest, do not hash it</span><span class="v">Unlike a password, the server needs the original to compute the expected code, so hashing is impossible. Encrypt the column with a key from your secrets manager (Lesson 1.5), so a database dump alone does not hand over every second factor.</span></div>
</div>

<h3>Drift, and the window that fixes it</h3>
<div class="out">cua so troi (+/- 1 buoc), moc T=1756000000:
  buoc -2  (1755999940)  ->  563389   <- tu choi
  buoc -1  (1755999970)  ->  888738   <- CHAP NHAN
  buoc  0  (1756000000)  ->  255176   <- CHAP NHAN
  buoc  1  (1756000030)  ->  050308   <- CHAP NHAN
  buoc  2  (1756000060)  ->  923380   <- tu choi

# Ba ma cung hop le tai moi thoi diem. Do la CO Y: dong ho dien thoai lech,
# nguoi dung go cham, va mot ma sinh ra o giay thu 29 thi toi noi o buoc sau.</div>
<pre><code>function checkTotp(secret: Buffer, inputCode: string, cuaSo = 1): number | null {
  const currentStep = Math.floor(Date.now() / 1000 / 30);

  for (let d = -cuaSo; d &lt;= cuaSo; d++) {
    const expected = hotp(secret, currentStep + d);
    <span class="tok-comment">// So sánh hằng thời gian — Bài 1.3, và ở đây nó thật sự cần thiết.</span>
    if (timingSafeEqual(Buffer.from(expected), Buffer.from(inputCode.padEnd(6)))) {
      return currentStep + d;                <span class="tok-comment">// ← TRẢ VỀ BƯỚC, không trả về true</span>
    }
  }
  return null;
}</code></pre>
<div class="pitfall">
<p><strong>Trap — returning a boolean makes replay impossible to prevent, and replay is the attack that actually happens.</strong> A TOTP code stays valid for up to ninety seconds. Anyone who sees it once — over the shoulder, in a phishing proxy, in a screenshot pasted into a support chat — can use it again inside that window. The fix is to return the step number that matched and store it: <code>lastStep</code> on the factor row, with the rule that the new step must be strictly greater. A code that already succeeded can never succeed twice, and the change is two lines.</p>
</div>
<pre><code>const buoc = checkTotp(secret, code);
if (buoc === null || buoc &lt;= factor.lastStep) {         <span class="tok-comment">// ← chặn TÁI DÙNG</span>
  await recordFailure(u.id);
  return res.status(401).json({ error: 'Mã không đúng.' });
}
await prisma.factor.update({ where: { id: factor.id }, data: { lastStep: buoc } });</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One step either way, and no more</span><span class="lz-lnote">A window of ±1 accepts ninety seconds of skew, which covers every phone with automatic time and every user typing slowly. Widening it to ±5 to "help" users with wrong clocks accepts five and a half minutes and multiplies the guessing surface; fix their clock instead, or tell them to.</span></div>
  <div class="lz-layer"><span class="lz-lname">Record the drift, do not silently absorb it</span><span class="lz-lnote">If a user's codes consistently match at step −1, their phone clock is slow. Storing the observed offset lets you keep the window narrow and still accept them, and it turns a mysterious "sometimes it does not work" ticket into a one-line answer.</span></div>
  <div class="lz-layer"><span class="lz-lname">Compare in constant time, and pad first</span><span class="lz-lnote"><code>timingSafeEqual</code> throws on differing lengths, so normalise the input before comparing. Strip spaces too — authenticator apps display <code>255 176</code> and users copy the space with it.</span></div>
  <div class="lz-layer"><span class="lz-lname">A million codes is not many</span><span class="lz-lnote">With three valid steps at any moment, a blind guess succeeds about three times in a million. Ten attempts per account per hour makes that irrelevant; no limit at all makes it an afternoon of scripted requests. Lesson 7.3 wires the limiter in.</span></div>
</div>
<div class="note-ct">
<p><strong>Use a library in production, but write this once first.</strong> A maintained implementation handles base32 edge cases, input normalisation and the constant-time comparison without you re-deriving them, and that is the right choice for shipping code. What it does not do is tell you why the window exists, why <code>lastStep</code> matters, or why your "more secure" SHA-256 configuration produces codes no authenticator app can generate. Thirty lines and the RFC's own test vectors buy you all of that permanently — and they take about twenty minutes.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6238" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">RFC 6238 — TOTP</span><span class="lc-sub">datatracker.ietf.org · Short, readable, and Appendix B has the test vectors above</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc4226" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">RFC 4226 — HOTP</span><span class="lc-sub">datatracker.ietf.org · Dynamic truncation, and the secret-length requirement</span></span></a>
<a class="link-card" href="https://github.com/google/google-authenticator/wiki/Key-Uri-Format" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">otpauth:// key URI format</span><span class="lc-sub">github.com · The de facto standard every authenticator app follows</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Buffers, big-endian writes, and the crypto module used above</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Implement HOTP, match all six RFC vectors, then replay a code and add lastStep</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>TOTP nhìn từ bên trong, trong ba mươi dòng</h2>
<p class="lead">TOTP mang tiếng là rắc rối, mà cái tiếng đó hoàn toàn đến từ base32 và mấy phép tính thời gian chứ không phải từ mật mã học. Bản thân thuật toán là MỘT lần HMAC và MỘT phép lấy dư, nó nằm gọn trong một màn hình, và viết nó một lần nghĩa là từ nay bạn sẽ không bao giờ còn phải phân vân xem cái thư viện kia đang làm gì thay mình.</p>

<h3>Toàn bộ thuật toán</h3>
<pre><code>import { createHmac } from 'node:crypto';

function hotp(khoa: Buffer, counter: number, soChuSo = 6): string {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));                    <span class="tok-comment">// 1. bộ đếm, 8 byte, big-endian</span>

  const h = createHmac('sha1', key).update(buf).digest(); <span class="tok-comment">// 2. HMAC-SHA1 → 20 byte</span>

  const off = h[h.length - 1] &amp; 0x0f;                      <span class="tok-comment">// 3. cắt động: 4 bit cuối = vị trí</span>
  const bin = ((h[off] &amp; 0x7f) &lt;&lt; 24) | (h[off + 1] &lt;&lt; 16)
            | (h[off + 2] &lt;&lt; 8)   |  h[off + 3];           <span class="tok-comment">//    lấy 31 bit từ vị trí đó</span>

  return String(bin % 10 ** soChuSo).padStart(soChuSo, '0'); <span class="tok-comment">// 4. lấy dư, đệm số 0</span>
}

<span class="tok-comment">// TOTP chỉ là HOTP với bộ đếm = thời gian chia cho 30.</span>
const totp = (khoa: Buffer, giay = Date.now() / 1000, buoc = 30) =&gt;
  hotp(key, Math.floor(giay / buoc));</code></pre>
<div class="out">RFC 6238 test vectors (SHA-1):
  T=         59  ->  94287082
  T= 1111111109  ->  07081804
  T= 1111111111  ->  14050471
  T= 1234567890  ->  89005924
  T= 2000000000  ->  69279037
  T=20000000000  ->  65353130

# Sau con so nay in NGUYEN VAN trong phu luc B cua RFC 6238, voi hat giong
# "12345678901234567890". Ba salt dong o tren khop ca sau. Do la toan bo
# thuat toan — khong con phan nao khac.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1</span><span class="lz-t">Bộ đếm CHÍNH LÀ cái đồng hồ</span><span class="lz-d">Giây Unix chia cho ba mươi, lấy phần nguyên. Hai bên tự tính độc lập từ đồng hồ của riêng mình — chẳng có gì được truyền đi cả, và đó là lý do cái mã vẫn chạy trên một chiếc điện thoại đang ở chế độ máy bay.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2</span><span class="lz-t">HMAC-SHA1, và đúng, nó ổn</span><span class="lz-d">SHA-1 đã vỡ về khả năng chống va chạm, mà HMAC thì không dựa vào tính chất ấy. RFC 6238 cho phép SHA-256 và SHA-512, nhưng gần như không ứng dụng sinh mã nào cài chúng, nên một lựa chọn "an toàn hơn" ở đây chỉ sinh ra những cái mã không bao giờ khớp.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3</span><span class="lz-t">Cắt động</span><span class="lz-d">Bốn bit cuối chọn một byte bắt đầu, rồi bốn byte tính từ đó thành một số 31 bit — bit cao nhất bị che đi để tránh rắc rối về dấu ở những ngôn ngữ không có số nguyên không dấu. Đó là một chi tiết thiết kế của thập niên 1990, giữ nguyên vì tính tương thích đòi hỏi vậy.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4</span><span class="lz-t">Lấy dư, và vứt đi gần hết</span><span class="lz-d">Ba mươi mốt bit rút xuống còn sáu chữ số: một triệu khả năng, cho mỗi cửa sổ ba mươi giây. Con số đó NHỎ, và đó là lý do giới hạn tần suất ở Bài 7.3 không phải tuỳ chọn — thiếu nó thì dò cạn chỉ là chuyện của một buổi chiều.</span></div>
</div>

<h3>Base32, mã QR, và hình dạng của một lần đăng ký</h3>
<pre><code><span class="tok-comment">// Bí mật là 20 byte ngẫu nhiên. Ứng dụng sinh mã đọc base32, KHÔNG đọc hex.</span>
const secret = randomBytes(20);
const uri = 'otpauth://totp/CuongThai:' + encodeURIComponent(u.email)
          + '?secret=' + base32(secret)
          + '&amp;issuer=CuongThai&amp;algorithm=SHA1&amp;digits=6&amp;period=30';</code></pre>
<div class="out">bi mat moi   : IIO6GHS2LR6L2HAJ3BBEARUMFK3CX5LK
otpauth URI  : otpauth://totp/CuongThai:cuong%40cuongthai.com?secret=IIO6GHS2LR6L2HAJ3BBEARUMFK3CX5LK&amp;issuer=CuongThai&amp;algorithm=SHA1&amp;digits=6&amp;period=30</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai mươi byte, không phải mười sáu</span><span class="v">RFC 4226 đòi tối thiểu 128 bit và khuyến nghị 160 — cũng chính là kích thước khối của HMAC-SHA1, nên hai mươi byte là lựa chọn tự nhiên. Vài thư viện mặc định mười byte; đó là dưới mức khuyến nghị mà chẳng đổi lại được gì.</span></div>
  <div class="kv"><span class="k">Mã QR chỉ là ĐÚNG cái URI đó</span><span class="v">Không có gì được tải về, không có gì gọi về nhà cả. Hãy vẽ chuỗi ấy thành ảnh QR ở máy chủ hoặc ngay trong trình duyệt, và LUÔN hiển thị bí mật base32 dạng chữ ngay bên cạnh — người dùng ứng dụng sinh mã trên máy tính, hoặc có cái camera hỏng, cần gõ tay nó vào.</span></div>
  <div class="kv"><span class="k">Nhãn và issuer quan trọng hơn vẻ ngoài của chúng</span><span class="v">Đó là thứ người dùng nhìn thấy trong một danh sách ba mươi mục. Hãy đặt tên sản phẩm vào <code>issuer</code> và định danh tài khoản vào phần nhãn; làm sai thì người dùng không biết cái nào trong bốn mã là của bạn.</span></div>
  <div class="kv"><span class="k">MÃ HOÁ bí mật lúc lưu, đừng băm nó</span><span class="v">Khác với mật khẩu, máy chủ CẦN bản gốc để tính ra mã mong đợi, nên băm là chuyện bất khả. Hãy mã hoá cột đó bằng một khoá lấy từ trình quản lý bí mật (Bài 1.5), để một bản dump cơ sở dữ liệu đứng một mình không trao ra mọi yếu tố thứ hai.</span></div>
</div>

<h3>Trôi đồng hồ, và cái cửa sổ vá nó</h3>
<div class="out">cua so troi (+/- 1 buoc), moc T=1756000000:
  buoc -2  (1755999940)  ->  563389   <- tu choi
  buoc -1  (1755999970)  ->  888738   <- CHAP NHAN
  buoc  0  (1756000000)  ->  255176   <- CHAP NHAN
  buoc  1  (1756000030)  ->  050308   <- CHAP NHAN
  buoc  2  (1756000060)  ->  923380   <- tu choi

# Ba ma cung hop le tai moi thoi diem. Do la CO Y: dong ho dien thoai lech,
# nguoi dung go cham, va mot ma sinh ra o giay thu 29 thi toi noi o buoc sau.</div>
<pre><code>function checkTotp(secret: Buffer, inputCode: string, cuaSo = 1): number | null {
  const currentStep = Math.floor(Date.now() / 1000 / 30);

  for (let d = -cuaSo; d &lt;= cuaSo; d++) {
    const expected = hotp(secret, currentStep + d);
    <span class="tok-comment">// So sánh hằng thời gian — Bài 1.3, và ở đây nó thật sự cần thiết.</span>
    if (timingSafeEqual(Buffer.from(expected), Buffer.from(inputCode.padEnd(6)))) {
      return currentStep + d;                <span class="tok-comment">// ← TRẢ VỀ BƯỚC, không trả về true</span>
    }
  }
  return null;
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — trả về một giá trị đúng/sai khiến việc chặn TÁI DÙNG thành bất khả, mà tái dùng mới là cú tấn công thật sự xảy ra.</strong> Một mã TOTP còn hiệu lực tới chín mươi giây. Bất kỳ ai nhìn thấy nó MỘT lần — liếc qua vai, trong một trang lừa đảo trung gian, trong một ảnh chụp màn hình dán vào cuộc trò chuyện hỗ trợ — đều dùng lại được trong cửa sổ ấy. Cách vá là trả về SỐ BƯỚC đã khớp rồi lưu lại: một cột <code>lastStep</code> trên bản ghi yếu tố, kèm luật rằng bước mới phải LỚN HƠN HẲN. Một cái mã đã thành công thì không bao giờ thành công lần thứ hai, và thay đổi này chỉ tốn hai dòng.</p>
</div>
<pre><code>const buoc = checkTotp(secret, code);
if (buoc === null || buoc &lt;= factor.lastStep) {         <span class="tok-comment">// ← chặn TÁI DÙNG</span>
  await recordFailure(u.id);
  return res.status(401).json({ error: 'Mã không đúng.' });
}
await prisma.factor.update({ where: { id: factor.id }, data: { lastStep: buoc } });</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một bước mỗi bên, không hơn</span><span class="lz-lnote">Cửa sổ ±1 chấp nhận chín mươi giây lệch, đủ phủ mọi cái điện thoại đặt giờ tự động và mọi người dùng gõ chậm. Nới lên ±5 để "giúp" người có đồng hồ sai là chấp nhận năm phút rưỡi và nhân bề mặt đoán mò lên; hãy sửa đồng hồ của họ, hoặc bảo họ đi sửa.</span></div>
  <div class="lz-layer"><span class="lz-lname">GHI LẠI độ trôi, đừng lặng lẽ hấp thụ nó</span><span class="lz-lnote">Nếu mã của một người dùng cứ khớp đều ở bước −1 thì đồng hồ điện thoại của họ chạy chậm. Lưu lại độ lệch quan sát được cho phép bạn giữ cửa sổ hẹp mà vẫn chấp nhận họ, và nó biến một cái ticket bí ẩn kiểu "thỉnh thoảng nó không chạy" thành một câu trả lời một dòng.</span></div>
  <div class="lz-layer"><span class="lz-lname">So sánh hằng thời gian, và đệm TRƯỚC đã</span><span class="lz-lnote"><code>timingSafeEqual</code> ném lỗi khi độ dài khác nhau, nên hãy chuẩn hoá đầu vào trước khi so. Và cắt luôn khoảng trắng — ứng dụng sinh mã hiển thị <code>255 176</code> và người dùng chép cả cái dấu cách theo.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một triệu mã KHÔNG phải nhiều</span><span class="lz-lnote">Với ba bước hợp lệ ở mọi thời điểm, một cú đoán mù thành công khoảng ba lần trên một triệu. Mười lượt thử mỗi tài khoản mỗi giờ làm con số đó thành vô nghĩa; hoàn toàn không giới hạn thì nó thành một buổi chiều gửi request bằng script. Bài 7.3 đấu bộ giới hạn vào.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy dùng thư viện trên production, nhưng viết cái này MỘT lần trước đã.</strong> Một bản cài đặt có người bảo trì sẽ lo giùm bạn các ca biên của base32, việc chuẩn hoá đầu vào và phép so sánh hằng thời gian mà bạn không phải tự nghĩ lại, và đó là lựa chọn đúng cho mã chạy thật. Cái nó KHÔNG làm được là nói cho bạn biết vì sao cái cửa sổ tồn tại, vì sao <code>lastStep</code> lại quan trọng, hay vì sao cấu hình SHA-256 "an toàn hơn" của bạn lại sinh ra những mã mà không ứng dụng sinh mã nào tạo được. Ba mươi dòng cộng với chính bộ vector kiểm thử của RFC mua cho bạn tất cả những thứ đó VĨNH VIỄN — và chúng tốn khoảng hai mươi phút.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6238" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">RFC 6238 — TOTP</span><span class="lc-sub">datatracker.ietf.org · Ngắn, dễ đọc, và phụ lục B chứa đúng bộ vector kiểm thử ở trên</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc4226" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">RFC 4226 — HOTP</span><span class="lc-sub">datatracker.ietf.org · Phép cắt động, và yêu cầu về độ dài bí mật</span></span></a>
<a class="link-card" href="https://github.com/google/google-authenticator/wiki/Key-Uri-Format" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Định dạng URI khoá otpauth://</span><span class="lc-sub">github.com · Chuẩn thực tế mà mọi ứng dụng sinh mã đều theo</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Buffer, ghi big-endian, và module crypto dùng ở trên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Cài HOTP, khớp đủ sáu vector của RFC, rồi tái dùng một mã và thêm buocCuoi vào</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Enrolling a factor, and the recovery you will actually need|||7.3 — Đăng ký một yếu tố, và cái đường khôi phục bạn CHẮC CHẮN sẽ cần',
      slug: 'auth-7-3-dang-ky-va-khoi-phuc',
      type: 'LESSON',
      description: 'Bật MFA mà chưa bắt người dùng chứng minh họ đọc được mã là cách khoá họ ra ngoài chính tài khoản của họ. Bài này dựng luồng đăng ký theo đúng thứ tự an toàn, sinh mã khôi phục thật kèm phép tính entropy, đấu bộ giới hạn tần suất vào, và xếp cái thang khôi phục — kể cả nấc cuối cùng, nấc mà con người phải quyết định.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Enrolling a factor, and the recovery you will actually need</h2>
<p class="lead">The cryptography in Lesson 7.2 is the easy half. The hard half is that a second factor is a physical object which will be dropped, wiped, upgraded and lost — and every one of those events arrives as a support ticket from somebody who cannot get into their own account. Design the losing case first; the enrolment flow follows from it.</p>

<h3>Enrolment, in the only safe order</h3>
<pre><code><span class="tok-comment">// 1. Xác thực lại TRƯỚC (Bài 7.1) — kẻ có phiên không được tự cắm yếu tố của hắn.</span>
app.post('/me/totp/begin', requireReauth({ within: 300 }), async (req, res) =&gt; {
  const secret = randomBytes(20);

  <span class="tok-comment">// 2. Lưu ở trạng thái CHƯA BẬT, có hạn. Tài khoản chưa đổi gì cả.</span>
  await prisma.factor.upsert({
    where:  { userId_kiu: { userId: u.id, kiu: 'TOTP' } },
    create: { userId: u.id, kiu: 'TOTP', encryptedSecret: encrypt(secret),
              enabledAt: null, registrationExpiresAt: new Date(Date.now() + 10 * 60_000) },
    update: { encryptedSecret: encrypt(secret), enabledAt: null,
              registrationExpiresAt: new Date(Date.now() + 10 * 60_000) },
  });

  <span class="tok-comment">// 3. Trả về QR + bí mật dạng chữ. Vẫn CHƯA bật.</span>
  res.json({ uri: otpauthUri(u, secret), secret: base32(secret) });
});</code></pre>
<pre><code><span class="tok-comment">// 4. Chỉ BẬT sau khi người dùng chứng minh họ đọc được một mã.</span>
app.post('/me/totp/confirm', requireReauth({ within: 300 }), async (req, res) =&gt; {
  const factor = await getUnenabledFactors(u.id, 'TOTP');
  if (!yt || factor.registrationExpiresAt &lt; new Date()) return res.status(410).json({ error: 'Hết hạn.' });

  const buoc = checkTotp(decrypt(factor.encryptedSecret), String(req.body.ma ?? ''));
  if (buoc === null) return res.status(401).json({ error: 'Mã không đúng.' });

  const recoveryCode = generateRecoveryCodes(10);              <span class="tok-comment">// ← sinh CÙNG LÚC, không để sau</span>
  await prisma.$transaction([
    prisma.factor.update({ where: { id: factor.id },
      data: { enabledAt: new Date(), lastStep: buoc, registrationExpiresAt: null } }),
    prisma.recoveryCode.deleteMany({ where: { userId: u.id } }),
    prisma.recoveryCode.createMany({ data: recoveryCode.map((m) =&gt; ({
      userId: u.id, hashCode: sha256(m) })) }),
  ]);
  await sendMailMfaEnabled(u.email);                      <span class="tok-comment">// ← Bài 6.5, lá thư thứ tư</span>
  res.json({ recoveryCode });                            <span class="tok-comment">// ← lần DUY NHẤT chúng xuất hiện</span>
});</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Never enable on step 3</span><span class="lz-t">The classic lockout</span><span class="lz-d">If showing the QR code turns MFA on, a user whose camera failed, whose app crashed, or who simply closed the tab is now locked out of an account they were trying to protect. Proving one code works is the whole point of the confirm step.</span></div>
  <div class="lz-step"><span class="lz-k">Recovery codes at the same moment</span><span class="lz-t">Not on a later screen</span><span class="lz-d">Show them in the same response that says "MFA is on". Any flow where the codes live behind an extra click ends with most users never seeing them — and then losing the phone.</span></div>
  <div class="lz-step"><span class="lz-k">Make them acknowledge</span><span class="lz-t">A checkbox, a download, a copy button</span><span class="lz-d">"I have saved these codes" is not security theatre here: it is the last moment the plaintext exists. Offer a download and a copy button, and do not let the dialog close by accident.</span></div>
  <div class="lz-step"><span class="lz-k">Removing a factor is the same ceremony</span><span class="lz-t">Re-auth, and mail the account</span><span class="lz-d">Disabling MFA must cost exactly as much as enabling it. Otherwise the attacker with a session turns it off and the protection you built is a setting they can flip.</span></div>
</div>

<h3>Recovery codes, generated for real</h3>
<div class="out">Ma khoi phuc — hien MOT lan, luu dang bam:
  7FMAH-C3QD4   sha256: 46ff5e43f16f1d7ac72a933e9154af3e…
  W35BM-CLHDG   sha256: b7a6da01b4a6eb2eefc0c61e176bbb2b…
  652ZM-EN99M   sha256: 8275fbef1905cabeaa18cd3308e3e230…
  YA2FA-TZH3F   sha256: 1814d411e89e12ac3d09a34c7d635def…
  A7GS3-9VSER   sha256: 2b1d32c895383bd4597a59a93abbf85c…
  KFLS8-T6C2H   sha256: 96fdfbd29c7441cc61cd89268e2d9c42…
  5LXKJ-VUKRE   sha256: 832a4d3b18f8dca57008702fda6498d1…
  SS946-J5HAQ   sha256: a0d07ce3734318cf907a2663d162f1bb…
  R88R7-PN6GE   sha256: 304aa799aa324913a02b9a49bbb63014…
  C34VG-HKTSD   sha256: e8a34a6fb4d4470f51521e741d69ce57…

Do manh moi ma : 32^10 = 1.126e+15 kha nang = 50 bit
Doan mu 10 ma  : 10 / 1.126e+15 = 1 tren 1.126e+14</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Fifty bits, and the alphabet is deliberate</span><span class="v">Base32 without <code>I</code>, <code>O</code>, <code>0</code> and <code>1</code>, because these get read aloud, copied off paper and typed on a phone. Fifty bits per code is far beyond guessing, and the hyphen is there purely so a human can find their place.</span></div>
  <div class="kv"><span class="k">Hash them, and SHA-256 is correct here</span><span class="v">A recovery code is a password that bypasses MFA, so it never belongs in the database in plaintext. Because it is fifty bits of pure randomness rather than something a person chose, there is nothing to brute-force offline — a fast hash is right, and Argon2 would only slow your own verification down.</span></div>
  <div class="kv"><span class="k">Single use, and count what is left</span><span class="v">Delete the row on use — do not flag it. Show the remaining count in the security settings, and prompt to regenerate below three. A user with zero codes and a broken phone is the ticket you are trying to avoid.</span></div>
  <div class="kv"><span class="k">Regenerating invalidates every old code</span><span class="v">Delete then insert, in one transaction. Half-regenerating leaves old printouts working, which defeats the reason someone regenerates: they think the old list leaked.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a recovery code is a complete MFA bypass, so it needs the same limiter as the code it replaces.</strong> It is tempting to treat recovery as an exceptional path and skip the rate limiting, the notification and the audit entry. That inverts the security: the attacker simply attacks the unprotected path. Rate-limit recovery attempts exactly like TOTP attempts, mail the account every time one is used, and log it. A recovery code used from a country the account has never seen is one of the highest-signal events your system can produce.</p>
</div>

<h3>Rate limiting, which is what makes six digits enough</h3>
<pre><code><span class="tok-comment">// Trần theo TÀI KHOẢN, không theo IP — kẻ tấn công đổi IP dễ hơn đổi tài khoản.</span>
const KEY = &#96;mfa-that-bai:\${u.id}&#96;;
const attempts = await redis.incr(KEY);
if (attempts === 1) await redis.expire(KEY, 3600);

if (attempts &gt; 10) {                                  <span class="tok-comment">// 10 lần/giờ</span>
  await sendMailSuspicious(u.email);                    <span class="tok-comment">// ← ai đó đang đoán mã của bạn</span>
  return res.status(429).json({ error: 'Quá nhiều lần thử. Hãy đợi.' });
}

<span class="tok-comment">// Đúng mã → xoá bộ đếm. Sai → để nguyên, nó tự hết hạn sau một giờ.</span>
if (buoc !== null &amp;&amp; buoc &gt; factor.lastStep) await redis.del(KEY);</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Ten per hour turns a million into nothing</span><span class="lz-lnote">Three valid codes out of a million, ten guesses an hour: about one chance in thirty-eight thousand per hour of trying, and a very loud trail. Without the limiter, a script reaches even odds in under two days of quiet requests.</span></div>
  <div class="lz-layer"><span class="lz-lname">Count against the account, not the address</span><span class="lz-lnote">The attacker already has the password, so they know exactly which account they are attacking and they can rotate IP addresses for pennies. An IP-based limiter measures the wrong thing here.</span></div>
  <div class="lz-layer"><span class="lz-lname">Do not lock the account, throttle it</span><span class="lz-lnote">Permanent lockout on repeated MFA failure hands an attacker a denial-of-service: they lock out any account whose password they know. A rolling window that expires on its own recovers without a support ticket.</span></div>
  <div class="lz-layer"><span class="lz-lname">A burst of failures is a real alert</span><span class="lz-lnote">Somebody guessing codes already has the password. That is not a login problem, it is a "this account's password is compromised" event — mail the user, and consider forcing a reset. Chapter 11 wires this into monitoring.</span></div>
</div>

<h3>The recovery ladder, rung by rung</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rung 1 — a second factor of a different kind</span><span class="v">Two passkeys on two devices, or a passkey plus TOTP. Costs nothing, solves almost every real loss, and is the only rung that is both safe and instant. Prompt for it at enrolment: "add a second device now".</span></div>
  <div class="kv"><span class="k">Rung 2 — recovery codes</span><span class="v">The standard answer, and it works exactly as well as the user's filing habits. Assume roughly half of them will not find the codes when it matters.</span></div>
  <div class="kv"><span class="k">Rung 3 — a delayed email recovery</span><span class="v">Mail a link that disables MFA after a waiting period — three to seven days — with cancellation links sent daily. It is weaker than a factor, but the delay plus the notifications means a thief cannot use it quietly, and the real owner always can.</span></div>
  <div class="kv"><span class="k">Rung 4 — a human</span><span class="v">Identity documents, a verified payment method, a video call, a manager's approval. Slow and expensive on purpose. This is where accounts are actually stolen, so write the procedure down, require two people for high-value accounts, and never let an agent bypass MFA on their own judgement.</span></div>
</div>
<div class="note-ct">
<p><strong>Your recovery path is your real authentication strength, and attackers already know that.</strong> Whatever the ladder's weakest rung is, that is what your account security is worth — a fortress with passkeys and a support desk that turns MFA off after two security questions is a fortress with security questions. Write the ladder down explicitly, decide which rung each class of account may use, and re-read it whenever you add a factor. It is also the single most useful page to hand a new support hire.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — resetting MFA</span><span class="lc-sub">cheatsheetseries.owasp.org · The recovery paths, ranked by how badly they can go</span></span></a>
<a class="link-card" href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication-recovery-methods" target="_blank" rel="noopener"><span class="lc-ico">🐙</span><span class="lc-body"><span class="lc-title">GitHub — 2FA recovery methods</span><span class="lc-sub">docs.github.com · A production ladder, written out for users to read</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html#sec6" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B §6 — lifecycle management</span><span class="lc-sub">pages.nist.gov · Binding, loss, and re-establishing an authenticator</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">INCR with EXPIRE, and the rate-limiter shapes that actually hold up</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Build enrolment with the confirm step, then lock yourself out on purpose and climb back up the ladder</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Đăng ký một yếu tố, và cái đường khôi phục bạn CHẮC CHẮN sẽ cần</h2>
<p class="lead">Phần mật mã ở Bài 7.2 là nửa dễ. Nửa khó là chuyện yếu tố thứ hai là một VẬT THỂ, và nó sẽ bị rơi, bị xoá trắng, bị đổi máy và bị mất — mà mỗi sự kiện trong số đó đều đến dưới dạng một cái ticket hỗ trợ từ một người không vào được chính tài khoản của mình. Hãy thiết kế trường hợp MẤT trước; luồng đăng ký sẽ tự suy ra từ đó.</p>

<h3>Đăng ký, theo thứ tự an toàn DUY NHẤT</h3>
<pre><code><span class="tok-comment">// 1. Xác thực lại TRƯỚC (Bài 7.1) — kẻ có phiên không được tự cắm yếu tố của hắn.</span>
app.post('/me/totp/begin', requireReauth({ within: 300 }), async (req, res) =&gt; {
  const secret = randomBytes(20);

  <span class="tok-comment">// 2. Lưu ở trạng thái CHƯA BẬT, có hạn. Tài khoản chưa đổi gì cả.</span>
  await prisma.factor.upsert({
    where:  { userId_kiu: { userId: u.id, kiu: 'TOTP' } },
    create: { userId: u.id, kiu: 'TOTP', encryptedSecret: encrypt(secret),
              enabledAt: null, registrationExpiresAt: new Date(Date.now() + 10 * 60_000) },
    update: { encryptedSecret: encrypt(secret), enabledAt: null,
              registrationExpiresAt: new Date(Date.now() + 10 * 60_000) },
  });

  <span class="tok-comment">// 3. Trả về QR + bí mật dạng chữ. Vẫn CHƯA bật.</span>
  res.json({ uri: otpauthUri(u, secret), secret: base32(secret) });
});</code></pre>
<pre><code><span class="tok-comment">// 4. Chỉ BẬT sau khi người dùng chứng minh họ đọc được một mã.</span>
app.post('/me/totp/confirm', requireReauth({ within: 300 }), async (req, res) =&gt; {
  const factor = await getUnenabledFactors(u.id, 'TOTP');
  if (!yt || factor.registrationExpiresAt &lt; new Date()) return res.status(410).json({ error: 'Hết hạn.' });

  const buoc = checkTotp(decrypt(factor.encryptedSecret), String(req.body.ma ?? ''));
  if (buoc === null) return res.status(401).json({ error: 'Mã không đúng.' });

  const recoveryCode = generateRecoveryCodes(10);              <span class="tok-comment">// ← sinh CÙNG LÚC, không để sau</span>
  await prisma.$transaction([
    prisma.factor.update({ where: { id: factor.id },
      data: { enabledAt: new Date(), lastStep: buoc, registrationExpiresAt: null } }),
    prisma.recoveryCode.deleteMany({ where: { userId: u.id } }),
    prisma.recoveryCode.createMany({ data: recoveryCode.map((m) =&gt; ({
      userId: u.id, hashCode: sha256(m) })) }),
  ]);
  await sendMailMfaEnabled(u.email);                      <span class="tok-comment">// ← Bài 6.5, lá thư thứ tư</span>
  res.json({ recoveryCode });                            <span class="tok-comment">// ← lần DUY NHẤT chúng xuất hiện</span>
});</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đừng BAO GIỜ bật ở bước 3</span><span class="lz-t">Cú khoá cửa kinh điển</span><span class="lz-d">Nếu việc hiển thị mã QR đã bật MFA lên thì một người dùng có camera hỏng, có ứng dụng bị sập, hoặc đơn giản là lỡ đóng tab, giờ bị khoá ra ngoài chính cái tài khoản họ đang cố bảo vệ. Chứng minh được MỘT mã chạy được chính là toàn bộ ý nghĩa của bước xác nhận.</span></div>
  <div class="lz-step"><span class="lz-k">Mã khôi phục sinh CÙNG khoảnh khắc đó</span><span class="lz-t">Không phải ở một màn hình sau</span><span class="lz-d">Hãy hiển thị chúng ngay trong cái phản hồi nói "MFA đã bật". Bất kỳ luồng nào mà mã khôi phục nằm sau thêm một cú bấm đều kết thúc bằng cảnh phần lớn người dùng chẳng bao giờ nhìn thấy chúng — rồi mất điện thoại.</span></div>
  <div class="lz-step"><span class="lz-k">Bắt họ XÁC NHẬN</span><span class="lz-t">Một ô tích, một nút tải về, một nút sao chép</span><span class="lz-d">"Tôi đã lưu những mã này" ở đây không phải diễn kịch bảo mật: đó là khoảnh khắc CUỐI CÙNG mà bản chữ thật còn tồn tại. Hãy cho tải về và cho sao chép, và đừng để hộp thoại đóng lại vì một cú bấm nhầm.</span></div>
  <div class="lz-step"><span class="lz-k">Gỡ một yếu tố cũng là ĐÚNG cái nghi thức đó</span><span class="lz-t">Xác thực lại, và gửi thư báo</span><span class="lz-d">Tắt MFA phải tốn công ĐÚNG BẰNG bật nó. Không thì kẻ tấn công có phiên chỉ việc tắt nó đi, và lớp bảo vệ bạn dựng lên chỉ là một cái công tắc hắn gạt được.</span></div>
</div>

<h3>Mã khôi phục, sinh thật</h3>
<div class="out">Ma khoi phuc — hien MOT lan, luu dang bam:
  7FMAH-C3QD4   sha256: 46ff5e43f16f1d7ac72a933e9154af3e…
  W35BM-CLHDG   sha256: b7a6da01b4a6eb2eefc0c61e176bbb2b…
  652ZM-EN99M   sha256: 8275fbef1905cabeaa18cd3308e3e230…
  YA2FA-TZH3F   sha256: 1814d411e89e12ac3d09a34c7d635def…
  A7GS3-9VSER   sha256: 2b1d32c895383bd4597a59a93abbf85c…
  KFLS8-T6C2H   sha256: 96fdfbd29c7441cc61cd89268e2d9c42…
  5LXKJ-VUKRE   sha256: 832a4d3b18f8dca57008702fda6498d1…
  SS946-J5HAQ   sha256: a0d07ce3734318cf907a2663d162f1bb…
  R88R7-PN6GE   sha256: 304aa799aa324913a02b9a49bbb63014…
  C34VG-HKTSD   sha256: e8a34a6fb4d4470f51521e741d69ce57…

Do manh moi ma : 32^10 = 1.126e+15 kha nang = 50 bit
Doan mu 10 ma  : 10 / 1.126e+15 = 1 tren 1.126e+14</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Năm mươi bit, và bảng chữ cái là CÓ CHỦ Ý</span><span class="v">Base32 bỏ đi <code>I</code>, <code>O</code>, <code>0</code> và <code>1</code>, vì những mã này sẽ được đọc thành tiếng, chép từ giấy ra và gõ trên điện thoại. Năm mươi bit mỗi mã thì vượt xa tầm đoán mò, còn cái dấu gạch nối ở đó thuần tuý để một con người không lạc chỗ.</span></div>
  <div class="kv"><span class="k">Hãy BĂM chúng, và ở đây SHA-256 là đúng</span><span class="v">Một mã khôi phục là một mật khẩu ĐI VÒNG QUA MFA, nên nó không bao giờ được nằm trong cơ sở dữ liệu dạng chữ thật. Vì nó là năm mươi bit ngẫu nhiên thuần tuý chứ không phải thứ con người tự chọn, nên chẳng có gì để dò cạn ngoại tuyến cả — một hàm băm nhanh là đúng, còn Argon2 chỉ làm chậm chính phép xác minh của bạn.</span></div>
  <div class="kv"><span class="k">Dùng MỘT lần, và ĐẾM số còn lại</span><span class="v">Hãy XOÁ bản ghi khi dùng — đừng gắn cờ. Hiển thị số mã còn lại trong phần cài đặt bảo mật, và nhắc sinh lại khi còn dưới ba. Một người dùng không còn mã nào và một cái điện thoại hỏng chính là cái ticket bạn đang cố tránh.</span></div>
  <div class="kv"><span class="k">Sinh lại thì mọi mã cũ mất hiệu lực</span><span class="v">Xoá rồi chèn, trong MỘT giao dịch. Sinh lại nửa vời để tờ giấy in cũ vẫn chạy được, mà đó lại đúng là điều phá hỏng lý do người ta sinh lại: họ nghĩ danh sách cũ đã bị lộ.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một mã khôi phục là một cú VƯỢT MFA hoàn toàn, nên nó cần đúng bộ giới hạn như cái mã nó thay thế.</strong> Rất dễ coi khôi phục là con đường ngoại lệ rồi bỏ qua giới hạn tần suất, bỏ qua thư báo và bỏ qua bản ghi kiểm toán. Làm thế là lộn ngược cả cấu trúc bảo mật: kẻ tấn công đơn giản là đánh vào con đường KHÔNG được bảo vệ. Hãy giới hạn tần suất các lượt thử mã khôi phục đúng như với TOTP, gửi thư báo mỗi lần một mã được dùng, và ghi log lại. Một mã khôi phục dùng từ một quốc gia mà tài khoản chưa bao giờ xuất hiện là một trong những sự kiện có tín hiệu mạnh nhất mà hệ thống của bạn sinh ra được.</p>
</div>

<h3>Giới hạn tần suất, thứ làm cho sáu chữ số trở nên ĐỦ</h3>
<pre><code><span class="tok-comment">// Trần theo TÀI KHOẢN, không theo IP — kẻ tấn công đổi IP dễ hơn đổi tài khoản.</span>
const KEY = &#96;mfa-that-bai:\${u.id}&#96;;
const attempts = await redis.incr(KEY);
if (attempts === 1) await redis.expire(KEY, 3600);

if (attempts &gt; 10) {                                  <span class="tok-comment">// 10 lần/giờ</span>
  await sendMailSuspicious(u.email);                    <span class="tok-comment">// ← ai đó đang đoán mã của bạn</span>
  return res.status(429).json({ error: 'Quá nhiều lần thử. Hãy đợi.' });
}

<span class="tok-comment">// Đúng mã → xoá bộ đếm. Sai → để nguyên, nó tự hết hạn sau một giờ.</span>
if (buoc !== null &amp;&amp; buoc &gt; factor.lastStep) await redis.del(KEY);</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mười lần một giờ biến một triệu thành con số không</span><span class="lz-lnote">Ba mã hợp lệ trên một triệu, mười lượt đoán mỗi giờ: khoảng một phần ba mươi tám nghìn cơ hội cho mỗi giờ thử, kèm một vệt dấu vết rất ồn. Không có bộ giới hạn thì một cái script đạt tỉ lệ ăn thua ngang ngửa chỉ sau chưa tới hai ngày gửi request lặng lẽ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đếm theo TÀI KHOẢN, không theo địa chỉ mạng</span><span class="lz-lnote">Kẻ tấn công vốn đã có mật khẩu, nên hắn biết chính xác mình đang đánh tài khoản nào và hắn xoay IP với giá vài xu. Một bộ giới hạn theo IP đo nhầm thứ ở đây.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đừng KHOÁ tài khoản, hãy BÓP nó lại</span><span class="lz-lnote">Khoá vĩnh viễn khi MFA sai nhiều lần là trao cho kẻ tấn công một cú từ chối dịch vụ: hắn khoá được bất kỳ tài khoản nào mà hắn biết mật khẩu. Một cửa sổ trượt tự hết hạn thì tự hồi phục mà chẳng cần cái ticket hỗ trợ nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một tràng thất bại là một CẢNH BÁO THẬT</span><span class="lz-lnote">Kẻ đang đoán mã thì đã có mật khẩu rồi. Đó không phải một sự cố đăng nhập, đó là sự kiện "mật khẩu của tài khoản này đã bị lộ" — hãy gửi thư cho người dùng, và cân nhắc ép đặt lại mật khẩu. Chương 11 đấu chuyện này vào phần giám sát.</span></div>
</div>

<h3>Cái thang khôi phục, từng nấc một</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nấc 1 — một yếu tố thứ hai KHÁC LOẠI</span><span class="v">Hai passkey trên hai thiết bị, hoặc một passkey cộng một TOTP. Chẳng tốn gì, giải quyết gần như mọi trường hợp mất thật, và là nấc DUY NHẤT vừa an toàn vừa tức thì. Hãy nhắc ngay lúc đăng ký: "thêm một thiết bị thứ hai ngay bây giờ".</span></div>
  <div class="kv"><span class="k">Nấc 2 — mã khôi phục</span><span class="v">Câu trả lời tiêu chuẩn, và nó chạy tốt đúng bằng thói quen lưu trữ giấy tờ của người dùng. Hãy giả định rằng chừng một nửa trong số họ sẽ không tìm ra mã vào đúng lúc cần.</span></div>
  <div class="kv"><span class="k">Nấc 3 — khôi phục qua email có TRÌ HOÃN</span><span class="v">Gửi một đường dẫn tắt MFA sau một khoảng chờ — ba tới bảy ngày — kèm đường dẫn huỷ gửi mỗi ngày. Nó yếu hơn một yếu tố thật, nhưng khoảng trì hoãn cộng với các lá thư báo nghĩa là một kẻ trộm không thể dùng nó lặng lẽ, còn chủ nhân thật thì luôn dùng được.</span></div>
  <div class="kv"><span class="k">Nấc 4 — một CON NGƯỜI</span><span class="v">Giấy tờ tuỳ thân, một phương thức thanh toán đã xác minh, một cuộc gọi video, một cái duyệt của quản lý. Chậm và đắt MỘT CÁCH CÓ CHỦ Ý. Đây mới là nơi tài khoản thật sự bị đánh cắp, nên hãy viết quy trình ra giấy, đòi HAI người cho những tài khoản giá trị cao, và đừng bao giờ để một nhân viên tự mình quyết định bỏ qua MFA.</span></div>
</div>
<div class="note-ct">
<p><strong>Đường khôi phục CHÍNH LÀ độ mạnh xác thực thật của bạn, và kẻ tấn công thì đã biết điều đó rồi.</strong> Nấc yếu nhất của cái thang là bao nhiêu thì an ninh tài khoản của bạn đáng bấy nhiêu — một pháo đài có passkey đi kèm một bàn hỗ trợ tắt MFA sau hai câu hỏi bảo mật là một pháo đài bằng câu hỏi bảo mật. Hãy viết cái thang ấy ra một cách tường minh, quyết định mỗi hạng tài khoản được dùng tới nấc nào, và đọc lại nó mỗi lần bạn thêm một yếu tố mới. Đó cũng là trang tài liệu hữu ích nhất để đưa cho một người mới vào đội hỗ trợ.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — đặt lại MFA</span><span class="lc-sub">cheatsheetseries.owasp.org · Các đường khôi phục, xếp theo mức độ có thể hỏng tới đâu</span></span></a>
<a class="link-card" href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication-recovery-methods" target="_blank" rel="noopener"><span class="lc-ico">🐙</span><span class="lc-body"><span class="lc-title">GitHub — các cách khôi phục 2FA</span><span class="lc-sub">docs.github.com · Một cái thang chạy thật, viết ra cho người dùng đọc</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html#sec6" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B §6 — quản lý vòng đời</span><span class="lc-sub">pages.nist.gov · Gắn kết, mất mát, và dựng lại một bộ xác thực</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">INCR kèm EXPIRE, và những hình dạng bộ giới hạn thật sự trụ được</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Dựng luồng đăng ký có bước xác nhận, rồi cố tình tự khoá mình ra ngoài và leo ngược cái thang</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Passkeys, and the one line that kills phishing|||7.4 — Passkey, và một dòng duy nhất giết chết lừa đảo',
      slug: 'auth-7-4-passkey',
      type: 'LESSON',
      description: 'Mọi yếu tố trong Chương 7 tới giờ đều là thứ NGƯỜI DÙNG chép tay, nên người dùng chép được vào một trang giả. WebAuthn thì không: trình duyệt buộc chữ ký vào ORIGIN THẬT mà nó đang đứng. Bài này chạy đúng phép kiểm đó bằng mã thật — cùng một chữ ký, ba tình huống, và hai lần bị từ chối.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Passkeys, and the one line that kills phishing</h2>
<p class="lead">Every factor so far shares one weakness: the user reads a value and types it somewhere. A person cannot reliably tell <code>cuongthai.com</code> from <code>cu0ngthai.com</code>, so a person can always be persuaded to type the code into the wrong box. WebAuthn removes the person from that step entirely — and the whole difference comes down to a comparison the browser makes on your behalf.</p>

<h3>The shape: a key pair, scoped to your domain</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Registration</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The authenticator makes a key pair</span><span class="lz-nsub">Private key never leaves it · public key goes to your server · bound to your RP ID at creation</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Authentication</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Server sends a random challenge</span><span class="lz-nsub">The authenticator signs it together with the origin the browser is actually on</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Verification</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">You check three things</span><span class="lz-nsub">Signature valid · challenge is the one you issued · origin and RP ID hash are yours</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">What is stored</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A public key, and nothing secret</span><span class="lz-nsub">A database dump gives an attacker nothing to replay · there is no shared secret at all</span></div></div>
  </div>
</div>

<h3>The comparison, run for real</h3>
<div class="out">rpIdHash cua cuongthai.com : 2b84e1dbd01d9316e4fe76c096ddc495…
rpIdHash cua cu0ngthai.com : f6bde3cab3230ecce3669f5514a9e6d2…

1. Nguoi dung THAT tren trang that
    CHAP NHAN
2. Trang lua dao chuyen tiep NGUYEN VAN cai chu ky lay tu trang that
    TU CHOI: origin la https://cu0ngthai.com, mong doi https://cuongthai.com
3. Trang lua dao tu xin credential cua chinh no
    TU CHOI: origin la https://cu0ngthai.com, mong doi https://cuongthai.com</div>
<pre><code><span class="tok-comment">// Origin nằm TRONG phần dữ liệu được ký. Đó là toàn bộ câu chuyện.</span>
const cd = JSON.parse(clientDataJSON.toString());
<span class="tok-comment">// { type: 'webauthn.get', challenge: '…', origin: 'https://cuongthai.com', … }</span>

if (cd.origin !== ORIGIN_MONG_DOI) throw new Error('sai origin');
if (!authData.subarray(0, 32).equals(sha256(RP_ID))) throw new Error('sai rpIdHash');

<span class="tok-comment">// Chữ ký phủ lên: authenticatorData ‖ sha256(clientDataJSON)</span>
const ok = verify(publicKey, Buffer.concat([authData, sha256(clientDataJSON)]), signature);</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Case 1</span><span class="lz-t">The real user</span><span class="lz-d">Origin matches, RP ID hash matches, signature verifies. Nothing was typed and nothing was transcribed — the user tapped a fingerprint sensor.</span></div>
  <div class="lz-step"><span class="lz-k">Case 2</span><span class="lz-t">A relay attack, which defeats TOTP</span><span class="lz-d">The phishing site proxies your real login page and forwards the signature verbatim. It fails, because the browser wrote its own origin into the signed data and the attacker cannot alter it without breaking the signature.</span></div>
  <div class="lz-step"><span class="lz-k">Case 3</span><span class="lz-t">The phishing site asks for its own credential</span><span class="lz-d">The browser will not even offer your passkey: the RP ID does not match the page, so the credential is invisible to that site. The user is not asked to make a judgement, because there is no prompt to misjudge.</span></div>
  <div class="lz-step"><span class="lz-k">Why TOTP cannot do this</span><span class="lz-t">The user is the transport</span><span class="lz-d">Six digits carry no information about which site requested them. The code is valid everywhere for ninety seconds, and the only thing standing between it and a fake page is a human reading a URL.</span></div>
</div>

<h3>Synced or device-bound, and why the answer changed</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A security key is device-bound</span><span class="v">The private key lives in hardware and cannot be extracted. This is the strongest form, and it is also why lost keys used to mean lost accounts — the reason WebAuthn stayed a niche for administrators and journalists for years.</span></div>
  <div class="kv"><span class="k">A passkey is usually synced</span><span class="v">iCloud Keychain, Google Password Manager and every serious password manager sync passkeys across a user's devices, end-to-end encrypted. Lose the phone, sign in on the new one, the passkeys are there.</span></div>
  <div class="kv"><span class="k">That trade is what made passkeys replace passwords</span><span class="v">Syncing moves trust to the platform account, which is weaker in theory than a hardware key. In practice it removes the lockout that stopped ordinary users from ever enrolling, and phishing resistance survives the trade untouched.</span></div>
  <div class="kv"><span class="k">You can tell, and mostly should not care</span><span class="v">The backup-eligible and backup-state flags in <code>authenticatorData</code> say whether a credential is syncable. Read them for a bank or an admin console where hardware binding is a policy; ignore them elsewhere, because refusing synced passkeys means refusing almost every user who has one.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — the RP ID is not the origin, and getting it wrong is the mistake that costs a migration.</strong> The origin is <code>https://cuongthai.com</code>; the RP ID is the bare domain <code>cuongthai.com</code>. It may be the page's domain or a registrable parent of it — a page on <code>app.cuongthai.com</code> may use <code>cuongthai.com</code>, but never the reverse, and never a different site's domain. Credentials are permanently bound to the RP ID chosen at registration: pick <code>app.cuongthai.com</code> today and every passkey stops working the day you move to <code>cuongthai.com</code>. Choose the broadest domain you will ever legitimately serve from, and write down why.</p>
</div>

<h3>Discoverable credentials, and login with no username</h3>
<pre><code><span class="tok-comment">// Có thể khám phá được: chính cái passkey mang theo id người dùng.</span>
<span class="tok-comment">// Người dùng bấm "Đăng nhập", chạm vân tay, xong. Không gõ email.</span>
const cred = await navigator.credentials.get({
  publicKey: {
    challenge: thuThach,          <span class="tok-comment">// ngẫu nhiên, do máy chủ phát, dùng một lần</span>
    rpId: 'cuongthai.com',
    userVerification: 'required', <span class="tok-comment">// bắt buộc mở khoá: vân tay / mặt / PIN</span>
    <span class="tok-comment">// KHÔNG có allowCredentials → trình duyệt tự hỏi người dùng chọn passkey nào</span>
  },
});
<span class="tok-comment">// response.userHandle cho biết đây là ai. Máy chủ tra bằng id thông tin xác thực.</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">This is where the user experience wins outright</span><span class="lz-lnote">One tap, no email, no password, no code, no waiting for an SMS. It is faster than the password flow it replaces, which is the only reason a security feature ever gets adopted at scale.</span></div>
  <div class="lz-layer"><span class="lz-lname">Store the user handle as an opaque random id</span><span class="lz-lnote">The handle is written into the credential on the authenticator and shows up in account pickers. Never put the email or a database primary key there — use a random per-user identifier, so a device someone else picks up leaks nothing.</span></div>
  <div class="lz-layer"><span class="lz-lname">userVerification required means two factors in one gesture</span><span class="lz-lnote">The device is something you have; the fingerprint or PIN unlocking it is something you know or are. A passkey with user verification is genuinely multi-factor on its own — which is why "passkey plus a TOTP code" is usually a worse product, not a safer one.</span></div>
  <div class="lz-layer"><span class="lz-lname">Keep a non-discoverable path for the awkward cases</span><span class="lz-lnote">A shared kiosk, a device with no platform authenticator, a user who wants to type their address first. Ask for the identifier, look up their credential ids, and pass them in <code>allowCredentials</code>. Same cryptography, different starting point.</span></div>
</div>

<h3>Attestation, which you probably do not want</h3>
<div class="callout warn">
<p><strong>Attestation answers "what kind of device is this", and asking the question has a cost.</strong> During registration the authenticator can present a certificate proving its make and model, letting you enforce a policy like "only FIPS-certified keys from this list". That is a real requirement in some regulated environments, and it is the wrong default everywhere else: it identifies the user's hardware, some platforms return no attestation at all, and any allowlist you write starts rotting the day a new phone ships. Request <code>attestation: 'none'</code>, and revisit only if a written policy demands otherwise. The AAGUID in <code>authenticatorData</code> still tells you roughly which authenticator was used, which is enough to show "Passkey on iPhone" in the device list from Lesson 5.4.</p>
</div>
<div class="note-ct">
<p><strong>What passkeys do not solve, stated plainly.</strong> They stop phishing and credential stuffing completely, and they remove the shared secret from your database. They do not stop malware on an unlocked device, they do not stop a session token stolen after login (Chapters 3 to 5 still apply in full), and they do not stop an attacker who goes around the front door through your recovery ladder — which is exactly why Lesson 7.3 came first. A product with passkeys and an email-reset that disables them has phishing-resistant authentication and a phishable recovery path, which means it has a phishable account.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.w3.org/TR/webauthn-3/" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">W3C — Web Authentication Level 3</span><span class="lc-sub">w3.org · The specification; §7 is the verification procedure step by step</span></span></a>
<a class="link-card" href="https://webauthn.guide/" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">webauthn.guide</span><span class="lc-sub">webauthn.guide · The clearest short introduction to both ceremonies</span></span></a>
<a class="link-card" href="https://passkeys.dev/docs/reference/terms/" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">passkeys.dev — terminology</span><span class="lc-sub">passkeys.dev · RP ID, user handle, discoverable credentials, AAGUID, in plain words</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">What an origin is, and why the browser is the only party that knows it for certain</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Sign a challenge, then replay it with a different origin and watch the check reject it</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Passkey, và một dòng duy nhất giết chết lừa đảo</h2>
<p class="lead">Mọi yếu tố tới giờ đều chung một điểm yếu: người dùng ĐỌC một giá trị rồi GÕ nó vào đâu đó. Một con người không thể phân biệt đáng tin cậy <code>cuongthai.com</code> với <code>cu0ngthai.com</code>, nên một con người luôn có thể bị dụ gõ cái mã vào nhầm ô. WebAuthn gỡ hẳn con người ra khỏi bước đó — và toàn bộ khác biệt nằm gọn trong một phép so sánh mà trình duyệt thực hiện thay bạn.</p>

<h3>Hình dạng: một cặp khoá, giới hạn vào tên miền của bạn</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Đăng ký</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bộ xác thực sinh một cặp khoá</span><span class="lz-nsub">Khoá riêng không bao giờ rời khỏi nó · khoá công đi về máy chủ của bạn · buộc vào RP ID ngay lúc tạo</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Xác thực</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Máy chủ gửi một thử thách ngẫu nhiên</span><span class="lz-nsub">Bộ xác thực ký nó CÙNG VỚI cái origin mà trình duyệt đang thật sự đứng</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Kiểm chứng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn kiểm ba thứ</span><span class="lz-nsub">Chữ ký hợp lệ · thử thách đúng cái bạn phát · origin và rpIdHash là của bạn</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cái được lưu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một khoá CÔNG, và không có gì bí mật</span><span class="lz-nsub">Một bản dump cơ sở dữ liệu chẳng cho kẻ tấn công thứ gì để phát lại · hoàn toàn không có bí mật dùng chung</span></div></div>
  </div>
</div>

<h3>Phép so sánh đó, chạy thật</h3>
<div class="out">rpIdHash cua cuongthai.com : 2b84e1dbd01d9316e4fe76c096ddc495…
rpIdHash cua cu0ngthai.com : f6bde3cab3230ecce3669f5514a9e6d2…

1. Nguoi dung THAT tren trang that
    CHAP NHAN
2. Trang lua dao chuyen tiep NGUYEN VAN cai chu ky lay tu trang that
    TU CHOI: origin la https://cu0ngthai.com, mong doi https://cuongthai.com
3. Trang lua dao tu xin credential cua chinh no
    TU CHOI: origin la https://cu0ngthai.com, mong doi https://cuongthai.com</div>
<pre><code><span class="tok-comment">// Origin nằm TRONG phần dữ liệu được ký. Đó là toàn bộ câu chuyện.</span>
const cd = JSON.parse(clientDataJSON.toString());
<span class="tok-comment">// { type: 'webauthn.get', challenge: '…', origin: 'https://cuongthai.com', … }</span>

if (cd.origin !== ORIGIN_MONG_DOI) throw new Error('sai origin');
if (!authData.subarray(0, 32).equals(sha256(RP_ID))) throw new Error('sai rpIdHash');

<span class="tok-comment">// Chữ ký phủ lên: authenticatorData ‖ sha256(clientDataJSON)</span>
const ok = verify(publicKey, Buffer.concat([authData, sha256(clientDataJSON)]), signature);</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Trường hợp 1</span><span class="lz-t">Người dùng thật</span><span class="lz-d">Origin khớp, rpIdHash khớp, chữ ký hợp lệ. Không có gì được gõ và không có gì được chép tay — người dùng chỉ chạm một cái vào cảm biến vân tay.</span></div>
  <div class="lz-step"><span class="lz-k">Trường hợp 2</span><span class="lz-t">Tấn công chuyển tiếp, thứ hạ gục TOTP</span><span class="lz-d">Trang lừa đảo dựng proxy tới đúng trang đăng nhập thật của bạn rồi chuyển tiếp nguyên văn cái chữ ký. Nó THẤT BẠI, vì trình duyệt đã tự ghi origin của chính nó vào phần dữ liệu được ký, và kẻ tấn công không sửa được cái đó mà không làm hỏng chữ ký.</span></div>
  <div class="lz-step"><span class="lz-k">Trường hợp 3</span><span class="lz-t">Trang lừa đảo tự xin credential của nó</span><span class="lz-d">Trình duyệt thậm chí KHÔNG ĐƯA RA passkey của bạn: RP ID không khớp với trang đó, nên thông tin xác thực ấy vô hình với site đó. Người dùng không bị đặt vào thế phải phán đoán, vì chẳng có lời nhắc nào để mà phán đoán nhầm.</span></div>
  <div class="lz-step"><span class="lz-k">Vì sao TOTP không làm được điều này</span><span class="lz-t">Người dùng CHÍNH LÀ đường truyền</span><span class="lz-d">Sáu chữ số không mang theo thông tin nào về việc TRANG NÀO đã yêu cầu chúng. Cái mã hợp lệ ở khắp nơi trong chín mươi giây, và thứ duy nhất đứng giữa nó với một trang giả là một con người đang đọc một cái URL.</span></div>
</div>

<h3>Đồng bộ hay gắn cứng thiết bị, và vì sao câu trả lời đã đổi</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Một khoá bảo mật thì GẮN CỨNG vào thiết bị</span><span class="v">Khoá riêng nằm trong phần cứng và không rút ra được. Đây là dạng mạnh nhất, và cũng là lý do vì sao mất khoá từng đồng nghĩa với mất tài khoản — chính là lý do WebAuthn nhiều năm liền chỉ là món của quản trị viên và nhà báo.</span></div>
  <div class="kv"><span class="k">Một passkey thì thường được ĐỒNG BỘ</span><span class="v">iCloud Keychain, Google Password Manager và mọi trình quản lý mật khẩu nghiêm túc đều đồng bộ passkey qua các thiết bị của người dùng, mã hoá đầu-cuối. Mất điện thoại, đăng nhập trên máy mới, passkey đã nằm sẵn ở đó.</span></div>
  <div class="kv"><span class="k">Chính cái đánh đổi đó làm passkey thay được mật khẩu</span><span class="v">Đồng bộ chuyển niềm tin sang tài khoản nền tảng, về lý thuyết là yếu hơn một khoá phần cứng. Trên thực tế nó dẹp bỏ cú khoá-cửa vốn ngăn người dùng bình thường đăng ký, và khả năng chống lừa đảo thì sống sót qua cuộc đánh đổi ấy nguyên vẹn.</span></div>
  <div class="kv"><span class="k">Bạn BIẾT được, và phần lớn thì không nên bận tâm</span><span class="v">Các cờ backup-eligible và backup-state trong <code>authenticatorData</code> cho biết một credential có đồng bộ được hay không. Hãy đọc chúng với một ngân hàng hay một bảng quản trị nơi việc gắn cứng phần cứng là một chính sách; còn ở chỗ khác thì bỏ qua, vì từ chối passkey đồng bộ nghĩa là từ chối gần như mọi người dùng đang có một cái.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — RP ID KHÔNG PHẢI origin, và chọn sai nó là cái sai phải trả giá bằng một cuộc di trú.</strong> Origin là <code>https://cuongthai.com</code>; còn RP ID là tên miền trần <code>cuongthai.com</code>. Nó có thể là tên miền của trang, hoặc một tên miền cha đăng ký được của nó — một trang ở <code>app.cuongthai.com</code> được phép dùng <code>cuongthai.com</code>, nhưng KHÔNG BAO GIỜ ngược lại, và không bao giờ là tên miền của một site khác. Thông tin xác thực bị buộc VĨNH VIỄN vào cái RP ID chọn lúc đăng ký: hôm nay chọn <code>app.cuongthai.com</code> thì mọi passkey chết đúng vào ngày bạn dời sang <code>cuongthai.com</code>. Hãy chọn cái tên miền RỘNG NHẤT mà bạn sẽ còn phục vụ một cách chính đáng, và ghi lại lý do.</p>
</div>

<h3>Thông tin xác thực khám phá được, và đăng nhập không cần tên</h3>
<pre><code><span class="tok-comment">// Có thể khám phá được: chính cái passkey mang theo id người dùng.</span>
<span class="tok-comment">// Người dùng bấm "Đăng nhập", chạm vân tay, xong. Không gõ email.</span>
const cred = await navigator.credentials.get({
  publicKey: {
    challenge: thuThach,          <span class="tok-comment">// ngẫu nhiên, do máy chủ phát, dùng một lần</span>
    rpId: 'cuongthai.com',
    userVerification: 'required', <span class="tok-comment">// bắt buộc mở khoá: vân tay / mặt / PIN</span>
    <span class="tok-comment">// KHÔNG có allowCredentials → trình duyệt tự hỏi người dùng chọn passkey nào</span>
  },
});
<span class="tok-comment">// response.userHandle cho biết đây là ai. Máy chủ tra bằng id thông tin xác thực.</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đây là chỗ trải nghiệm thắng tuyệt đối</span><span class="lz-lnote">Một cú chạm, không email, không mật khẩu, không mã, không ngồi chờ SMS. Nó NHANH HƠN cái luồng mật khẩu mà nó thay thế, và đó là lý do duy nhất khiến một tính năng bảo mật được cả thị trường chấp nhận.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy lưu user handle dưới dạng một id ngẫu nhiên vô nghĩa</span><span class="lz-lnote">Cái handle được ghi vào trong thông tin xác thực nằm trên bộ xác thực và hiện ra trong bảng chọn tài khoản. Đừng bao giờ đặt email hay khoá chính của cơ sở dữ liệu vào đó — hãy dùng một định danh ngẫu nhiên riêng cho từng người, để một thiết bị người khác nhặt được không làm lộ gì cả.</span></div>
  <div class="lz-layer"><span class="lz-lname">userVerification bắt buộc nghĩa là HAI yếu tố trong MỘT cử chỉ</span><span class="lz-lnote">Thiết bị là thứ bạn CÓ; vân tay hoặc mã PIN mở khoá nó là thứ bạn BIẾT hoặc bạn LÀ. Một passkey có kiểm chứng người dùng thì tự nó đã thật sự là đa yếu tố — đó là lý do "passkey cộng thêm một mã TOTP" thường là một sản phẩm TỆ HƠN chứ không phải an toàn hơn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vẫn giữ một đường không-khám-phá-được cho các ca lắt léo</span><span class="lz-lnote">Một máy dùng chung ở quầy, một thiết bị không có bộ xác thực nền tảng, một người dùng muốn gõ địa chỉ trước đã. Hãy hỏi định danh, tra ra danh sách id thông tin xác thực của họ, rồi truyền vào <code>allowCredentials</code>. Cùng phần mật mã, chỉ khác điểm xuất phát.</span></div>
</div>

<h3>Attestation, thứ mà bạn nhiều khả năng KHÔNG muốn</h3>
<div class="callout warn">
<p><strong>Attestation trả lời câu "đây là loại thiết bị gì", và việc HỎI câu đó có cái giá của nó.</strong> Trong lúc đăng ký, bộ xác thực có thể trình ra một chứng thư chứng minh hãng và model của nó, cho phép bạn thi hành một chính sách kiểu "chỉ nhận khoá đạt chuẩn FIPS trong danh sách này". Đó là một yêu cầu THẬT ở vài môi trường bị quản lý chặt, và là mặc định SAI ở mọi nơi khác: nó nhận diện phần cứng của người dùng, vài nền tảng không trả về attestation nào cả, và mọi danh sách trắng bạn viết ra bắt đầu mục từ đúng cái ngày một mẫu điện thoại mới lên kệ. Hãy yêu cầu <code>attestation: 'none'</code>, và chỉ xem lại khi có một chính sách bằng văn bản đòi khác đi. AAGUID trong <code>authenticatorData</code> vẫn cho bạn biết đại khái bộ xác thực nào đã được dùng, đủ để hiện "Passkey trên iPhone" trong danh sách thiết bị ở Bài 5.4.</p>
</div>
<div class="note-ct">
<p><strong>Passkey KHÔNG giải quyết cái gì, nói thẳng.</strong> Nó chặn đứng hoàn toàn lừa đảo và nhồi tín vật, và nó gỡ bí mật dùng chung ra khỏi cơ sở dữ liệu của bạn. Nó KHÔNG chặn mã độc trên một thiết bị đang mở khoá, KHÔNG chặn một token phiên bị cắp SAU khi đăng nhập (Chương 3 tới 5 vẫn áp dụng đầy đủ), và KHÔNG chặn một kẻ tấn công đi vòng qua cửa trước bằng chính cái thang khôi phục của bạn — mà đó đúng là lý do Bài 7.3 phải đứng trước. Một sản phẩm có passkey đi kèm một đường đặt lại qua email có thể TẮT chúng đi thì đang có một cơ chế xác thực chống lừa đảo và một đường khôi phục lừa được, tức là đang có một tài khoản lừa được.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.w3.org/TR/webauthn-3/" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">W3C — Web Authentication Level 3</span><span class="lc-sub">w3.org · Bản đặc tả; §7 là quy trình kiểm chứng từng bước một</span></span></a>
<a class="link-card" href="https://webauthn.guide/" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">webauthn.guide</span><span class="lc-sub">webauthn.guide · Bài giới thiệu ngắn và sáng nhất về cả hai nghi thức</span></span></a>
<a class="link-card" href="https://passkeys.dev/docs/reference/terms/" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">passkeys.dev — thuật ngữ</span><span class="lc-sub">passkeys.dev · RP ID, user handle, credential khám phá được, AAGUID, nói bằng lời thường</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Nền tảng Web</span><span class="lc-sub">Origin là gì, và vì sao trình duyệt là bên DUY NHẤT biết chắc chắn nó</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Ký một thử thách, rồi phát lại nó với một origin khác và nhìn phép kiểm từ chối</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — Shipping passkeys: the tables, the two ceremonies, the migration|||7.5 — Đưa passkey lên production: các bảng, hai nghi thức, và cuộc di trú',
      slug: 'auth-7-5-trien-khai-passkey',
      type: 'LESSON',
      description: 'Từ lý thuyết ở Bài 7.4 sang thứ chạy được: lược đồ bảng, thử thách lưu ở PHÍA MÁY CHỦ, hai nghi thức viết đầy đủ, cái bộ đếm chữ ký mà kiểm ngây thơ sẽ giết sạch passkey đồng bộ, giao diện tự điền, và con đường ba chặng đưa một sản phẩm đang chạy bằng mật khẩu sang passkey mà không khoá ai ra ngoài.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Shipping passkeys: the tables, the two ceremonies, the migration</h2>
<p class="lead">Lesson 7.4 explained why passkeys work. This one is the part you actually write — and almost all of the difficulty is in three places that the specification mentions briefly and that break in production loudly: where the challenge lives, what the signature counter means today, and how you move an existing product across without stranding anybody.</p>

<h3>The schema</h3>
<pre><code>model Credential {
  id           String    @id @default(cuid())
  userId       String
  credentialId Bytes     @unique          <span class="tok-comment">// id do bộ xác thực cấp — DUY NHẤT toàn hệ thống</span>
  publicKey    Bytes     <span class="tok-comment">// khoá công dạng COSE, lưu nguyên xi</span>
  counter      Int       @default(0)      <span class="tok-comment">// bộ đếm chữ ký — đọc Bài này trước khi kiểm</span>
  aaguid       Bytes?    <span class="tok-comment">// loại bộ xác thực → "Passkey trên iPhone"</span>
  backedUp     Boolean   @default(false)  <span class="tok-comment">// cờ BS: nó có đồng bộ không</span>
  channel      String[]  <span class="tok-comment">// internal / hybrid / usb / nfc / ble</span>
  ten          String?   <span class="tok-comment">// người dùng đặt: "MacBook cơ quan"</span>
  lastUsedAt   DateTime?
  createdAt    DateTime  @default(now())

  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
  @@map("thong_tin_xac_thuc")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">The credential id is globally unique, and that is load-bearing</span><span class="v">Discoverable login has no username: the browser hands you a credential id and you must find the account from it alone. Put the unique index on that column and look up by it directly.</span></div>
  <div class="kv"><span class="k">Store the public key exactly as received</span><span class="v">It arrives as COSE-encoded bytes. Do not re-encode it into PEM "to be tidy" — every verification library expects the original form, and a lossy round-trip produces signature failures that look like an attack.</span></div>
  <div class="kv"><span class="k">One row per authenticator, not one per user</span><span class="v">A user will have a phone, a laptop and possibly a hardware key. This table is the passkey half of the device list from Lesson 5.4, and it needs its own name, last-used timestamp and delete button.</span></div>
  <div class="kv"><span class="k">Keep the transports</span><span class="v">Passing them back in <code>allowCredentials</code> lets the browser show the right prompt — "use your phone" versus "insert your key" — instead of offering every option and hoping.</span></div>
</div>

<h3>Registration: the challenge belongs on the server</h3>
<pre><code>app.post('/passkey/register/begin', requireReauth({ within: 300 }), async (req, res) =&gt; {
  const optional = await generateRegistrationOptions({
    rpName: 'CuongThai', rpID: RP_ID,
    userID: u.userHandle,               <span class="tok-comment">// ngẫu nhiên mỗi người, KHÔNG phải email</span>
    userName: u.email, userDisplayName: u.ten,
    attestationType: 'none',             <span class="tok-comment">// ← Bài 7.4</span>
    excludeCredentials: (await getCredentials(u.id)).map((c) =&gt; ({ id: c.credentialId })),
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
  });

  <span class="tok-comment">// Thử thách nằm ở MÁY CHỦ, gắn với phiên, có hạn. KHÔNG gửi kèm về rồi nhận lại.</span>
  await redis.set(&#96;thu-challenge:\${req.sessionId}&#96;, optional.challenge, { EX: 300 });
  res.json(optional);
});</code></pre>
<pre><code>app.post('/passkey/register/finish', requireReauth({ within: 300 }), async (req, res) =&gt; {
  const expected = await redis.getDel(&#96;thu-challenge:\${req.sessionId}&#96;);   <span class="tok-comment">// đọc và XOÁ: dùng một lần</span>
  if (!mong) return res.status(410).json({ error: 'Thử thách hết hạn.' });

  const result = await verifyRegistrationResponse({
    response: req.body, expectedChallenge: mong,
    expectedOrigin: ORIGIN, expectedRPID: RP_ID,
  });
  if (!result.verified) return res.status(400).json({ error: 'Không kiểm chứng được.' });

  const { credential, aaguid, credentialBackedUp } = result.registrationInfo!;
  await prisma.credential.create({ data: {
    userId: u.id, credentialId: credential.id, publicKey: credential.publicKey,
    counter: credential.counter, aaguid, backedUp: credentialBackedUp,
    channel: req.body.response.transports ?? [], ten: guessDeviceName(aaguid),
  }});
  await sendMailPasskeyAdded(u.email);         <span class="tok-comment">// ← lá thư thứ năm của Bài 6.5</span>
  res.status(201).end();
});</code></pre>
<div class="pitfall">
<p><strong>Trap — a challenge round-tripped through the client is not a challenge.</strong> It is tempting to put it in a hidden field or a cookie so the endpoint can stay stateless. That removes the only property the challenge has: an attacker who can choose it can replay an old signed response forever. Keep it server-side, keyed by session, with a short expiry, and delete it on use — <code>GETDEL</code> in one round trip. The same rule applies to the authentication ceremony, and it is the single most common WebAuthn implementation bug.</p>
</div>

<h3>Authentication, and the counter that will bite you</h3>
<div class="out">Khoa bao mat USB (YubiKey)  ->  0x05  (00000101)
    bit 0  UP  (co mat nguoi dung)
    bit 2  UV  (da kiem chung nguoi dung)

Passkey tren iPhone (da dong bo)  ->  0x1d  (00011101)
    bit 0  UP  (co mat nguoi dung)
    bit 2  UV  (da kiem chung nguoi dung)
    bit 3  BE  (du dieu kien sao luu)
    bit 4  BS  (dang duoc sao luu)

Passkey moi dang ky  ->  0x5d  (01011101)
    bit 0  UP · bit 2  UV · bit 3  BE · bit 4  BS
    bit 6  AT  (co du lieu chung thuc — chi co o le DANG KY)

# Mot byte co the duy nhat trong authenticatorData. BE=0 nghia la khoa
# gan cung thiet bi; BE=1 va BS=1 nghia la passkey dang duoc dong bo.
</div>
<pre><code>const result = await verifyAuthenticationResponse({
  response: req.body, expectedChallenge: mong,
  expectedOrigin: ORIGIN, expectedRPID: RP_ID,
  credential: { id: c.credentialId, publicKey: c.publicKey, counter: c.counter },
});

<span class="tok-comment">// SAI — dòng này giết sạch mọi passkey đồng bộ trên đời:</span>
if (result.authenticationInfo.newCounter &lt;= c.counter) throw new Error('nhan ban!');

<span class="tok-comment">// ĐÚNG — chỉ kiểm khi bộ xác thực THẬT SỰ có dùng bộ đếm:</span>
const bd = result.authenticationInfo.newCounter;
if (c.counter &gt; 0 &amp;&amp; bd &gt; 0 &amp;&amp; bd &lt;= c.counter) {
  await warnDuplicate(u, c);                <span class="tok-comment">// tín hiệu THẬT: có bản sao khoá</span>
  return res.status(401).json({ error: 'Không xác thực được.' });
}
await prisma.credential.update({ where: { id: c.id },
  data: { counter: bd, lastUsedAt: new Date() } });</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">What it was for</span><span class="lz-t">Clone detection</span><span class="lz-d">A hardware key increments a counter on every signature. If a value arrives that is not greater than the last one you saw, two copies of the key exist — which for a device whose private key cannot be extracted means something is very wrong.</span></div>
  <div class="lz-step"><span class="lz-k">Why it is mostly zero now</span><span class="lz-t">Synced passkeys cannot count</span><span class="lz-d">A credential living on four devices has no single counter to increment, so platform authenticators report <code>0</code> permanently. The specification allows this explicitly.</span></div>
  <div class="lz-step"><span class="lz-k">The naive check breaks everything</span><span class="lz-t">And looks like a security feature</span><span class="lz-d">"New counter must be greater" rejects every login from every Apple and Google passkey, forever, with an error message about cloning. It is a very confident-looking bug.</span></div>
  <div class="lz-step"><span class="lz-k">The rule that works</span><span class="lz-t">Only compare when both are non-zero</span><span class="lz-d">A stored counter above zero means this authenticator does count, so a non-increasing value is genuinely suspicious. Zero on either side means the feature is not in play. Keep the check — it still catches a cloned hardware key — just guard it.</span></div>
</div>

<h3>Conditional UI, which is where adoption comes from</h3>
<pre><code><span class="tok-comment">// Passkey hiện ra ngay trong gợi ý tự điền của ô email. Không cần bấm gì thêm.</span>
&lt;input name="email" autocomplete="username webauthn" /&gt;

if (await PublicKeyCredential.isConditionalMediationAvailable?.()) {
  navigator.credentials.get({
    publicKey: { challenge: await getChallenge(), rpId: RP_ID },
    mediation: 'conditional',            <span class="tok-comment">// ← không mở hộp thoại nếu không có passkey</span>
  }).then(dangNhapBangPasskey).catch(() =&gt; {});   <span class="tok-comment">// im lặng khi người dùng lờ đi</span>
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It fails silently, and that is the point</span><span class="lz-lnote">A user with no passkey sees an ordinary login form and never knows the call happened. A user with one sees their account offered in the autofill drop-down. There is no "do you have a passkey?" question to get wrong.</span></div>
  <div class="lz-layer"><span class="lz-lname">The autocomplete token is mandatory</span><span class="lz-lnote">Without <code>webauthn</code> in the <code>autocomplete</code> attribute, conditional mediation does nothing at all and gives no error. It is the most common reason a correct implementation appears to be ignored by the browser.</span></div>
  <div class="lz-layer"><span class="lz-lname">Offer enrolment right after a password login</span><span class="lz-lnote">The moment a user has just proven who they are is the moment they will agree to "make next time one tap". Enrolment prompts on a settings page nobody visits are why passkey adoption numbers disappoint.</span></div>
  <div class="lz-layer"><span class="lz-lname">Never let one passkey be the only way in</span><span class="lz-lnote">Prompt for a second credential on a different device immediately after the first, and keep the recovery ladder from Lesson 7.3 intact. One device, one credential, no recovery is how a passkey rollout produces its own support queue.</span></div>
</div>

<h3>The migration, in three stages</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stage 1 — passkey as a second factor</span><span class="v">Password first, passkey instead of a TOTP code. Nothing about login changes for anyone who does not opt in, you learn the ceremonies against real devices, and users who enrol are immediately phishing-resistant for the second step.</span></div>
  <div class="kv"><span class="k">Stage 2 — passkey as a primary factor</span><span class="v">Conditional UI on the login page: one tap replaces password plus code entirely, because user verification already makes it multi-factor. The password stays as a fallback. This is where the usability win shows up in your numbers.</span></div>
  <div class="kv"><span class="k">Stage 3 — password optional, then absent</span><span class="v">Offer to remove the password once an account has two passkeys and working recovery. Removing it removes credential stuffing, reuse and reset-flow abuse from that account permanently — the entire threat model of Chapters 2 and 6 for the accounts that get there.</span></div>
  <div class="kv"><span class="k">Never delete the fallback for people who cannot use passkeys</span><span class="v">Shared machines, managed devices with platform authenticators disabled, older hardware, users who simply refuse. Stage 3 is per-account and opt-in, and a product that forces it will lock out the tail of its user base with no way back.</span></div>
</div>
<div class="note-ct">
<p><strong>Use a library, and know what it is checking.</strong> <code>@simplewebauthn/server</code> and its equivalents handle CBOR decoding, COSE key parsing, the flag bits and the signature verification — none of which you want to write, and all of which have sharp edges. What no library decides for you is the RP ID, where the challenge lives, how to treat the counter, and how the migration runs. Those four are the whole of this lesson, and they are also the four that appear in every WebAuthn incident report.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://simplewebauthn.dev/docs/" target="_blank" rel="noopener"><span class="lc-ico">🧰</span><span class="lc-body"><span class="lc-title">SimpleWebAuthn — documentation</span><span class="lc-sub">simplewebauthn.dev · The server and browser halves used in the code above</span></span></a>
<a class="link-card" href="https://web.dev/articles/passkey-form-autofill" target="_blank" rel="noopener"><span class="lc-ico">✨</span><span class="lc-body"><span class="lc-title">web.dev — passkey form autofill</span><span class="lc-sub">web.dev · Conditional mediation end to end, including the autocomplete token</span></span></a>
<a class="link-card" href="https://www.w3.org/TR/webauthn-3/#sctn-sign-counter" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">W3C — the signature counter</span><span class="lc-sub">w3.org · What it guarantees, and where the specification permits zero</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Prisma ORM</span><span class="lc-sub">Bytes columns, unique indexes on binary data, and the queries above</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Register and authenticate a passkey end to end, then add the naive counter check and watch it lock you out</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Đưa passkey lên production: các bảng, hai nghi thức, và cuộc di trú</h2>
<p class="lead">Bài 7.4 giải thích vì sao passkey hoạt động. Bài này là phần bạn THẬT SỰ phải viết — và gần như toàn bộ chỗ khó nằm ở ba điểm mà đặc tả chỉ nhắc thoáng qua còn production thì hỏng rất to tiếng: thử thách nằm ở đâu, bộ đếm chữ ký ngày nay nghĩa là gì, và làm sao dời một sản phẩm đang chạy sang passkey mà không bỏ rơi ai.</p>

<h3>Lược đồ</h3>
<pre><code>model Credential {
  id           String    @id @default(cuid())
  userId       String
  credentialId Bytes     @unique          <span class="tok-comment">// id do bộ xác thực cấp — DUY NHẤT toàn hệ thống</span>
  publicKey    Bytes     <span class="tok-comment">// khoá công dạng COSE, lưu nguyên xi</span>
  counter      Int       @default(0)      <span class="tok-comment">// bộ đếm chữ ký — đọc Bài này trước khi kiểm</span>
  aaguid       Bytes?    <span class="tok-comment">// loại bộ xác thực → "Passkey trên iPhone"</span>
  backedUp     Boolean   @default(false)  <span class="tok-comment">// cờ BS: nó có đồng bộ không</span>
  channel      String[]  <span class="tok-comment">// internal / hybrid / usb / nfc / ble</span>
  ten          String?   <span class="tok-comment">// người dùng đặt: "MacBook cơ quan"</span>
  lastUsedAt   DateTime?
  createdAt    DateTime  @default(now())

  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
  @@map("thong_tin_xac_thuc")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Credential id là DUY NHẤT toàn cục, và điều đó chịu lực</span><span class="v">Đăng nhập khám phá được thì không có tên người dùng: trình duyệt trao cho bạn một credential id và bạn phải tìm ra tài khoản CHỈ từ nó. Hãy đặt chỉ mục duy nhất lên cột đó và tra thẳng bằng nó.</span></div>
  <div class="kv"><span class="k">Lưu khoá công ĐÚNG NHƯ nhận được</span><span class="v">Nó tới dưới dạng byte mã hoá COSE. Đừng mã hoá lại thành PEM cho "gọn gàng" — mọi thư viện kiểm chứng đều mong đợi dạng gốc, và một vòng chuyển đổi làm mất mát sẽ sinh ra những lỗi chữ ký trông y hệt một cú tấn công.</span></div>
  <div class="kv"><span class="k">Một bản ghi cho mỗi BỘ XÁC THỰC, không phải cho mỗi người dùng</span><span class="v">Một người sẽ có một cái điện thoại, một cái laptop và có thể một khoá phần cứng. Bảng này chính là nửa passkey của danh sách thiết bị ở Bài 5.4, và nó cần tên riêng, mốc dùng lần cuối và một cái nút xoá.</span></div>
  <div class="kv"><span class="k">Giữ lại phần đường truyền</span><span class="v">Truyền chúng ngược lại trong <code>allowCredentials</code> cho phép trình duyệt hiện đúng lời nhắc — "dùng điện thoại của bạn" hay "cắm khoá vào" — thay vì bày ra mọi lựa chọn rồi cầu may.</span></div>
</div>

<h3>Đăng ký: thử thách thuộc về MÁY CHỦ</h3>
<pre><code>app.post('/passkey/register/begin', requireReauth({ within: 300 }), async (req, res) =&gt; {
  const optional = await generateRegistrationOptions({
    rpName: 'CuongThai', rpID: RP_ID,
    userID: u.userHandle,               <span class="tok-comment">// ngẫu nhiên mỗi người, KHÔNG phải email</span>
    userName: u.email, userDisplayName: u.ten,
    attestationType: 'none',             <span class="tok-comment">// ← Bài 7.4</span>
    excludeCredentials: (await getCredentials(u.id)).map((c) =&gt; ({ id: c.credentialId })),
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
  });

  <span class="tok-comment">// Thử thách nằm ở MÁY CHỦ, gắn với phiên, có hạn. KHÔNG gửi kèm về rồi nhận lại.</span>
  await redis.set(&#96;thu-challenge:\${req.sessionId}&#96;, optional.challenge, { EX: 300 });
  res.json(optional);
});</code></pre>
<pre><code>app.post('/passkey/register/finish', requireReauth({ within: 300 }), async (req, res) =&gt; {
  const expected = await redis.getDel(&#96;thu-challenge:\${req.sessionId}&#96;);   <span class="tok-comment">// đọc và XOÁ: dùng một lần</span>
  if (!mong) return res.status(410).json({ error: 'Thử thách hết hạn.' });

  const result = await verifyRegistrationResponse({
    response: req.body, expectedChallenge: mong,
    expectedOrigin: ORIGIN, expectedRPID: RP_ID,
  });
  if (!result.verified) return res.status(400).json({ error: 'Không kiểm chứng được.' });

  const { credential, aaguid, credentialBackedUp } = result.registrationInfo!;
  await prisma.credential.create({ data: {
    userId: u.id, credentialId: credential.id, publicKey: credential.publicKey,
    counter: credential.counter, aaguid, backedUp: credentialBackedUp,
    channel: req.body.response.transports ?? [], ten: guessDeviceName(aaguid),
  }});
  await sendMailPasskeyAdded(u.email);         <span class="tok-comment">// ← lá thư thứ năm của Bài 6.5</span>
  res.status(201).end();
});</code></pre>
<div class="pitfall">
<p><strong>Bẫy — một thử thách đi vòng qua client thì KHÔNG còn là thử thách.</strong> Rất dễ bị cám dỗ nhét nó vào một trường ẩn hay một cookie để endpoint giữ được tính phi trạng thái. Làm thế là xoá đi tính chất DUY NHẤT mà thử thách có: một kẻ tấn công CHỌN được nó thì phát lại một phản hồi đã ký từ đời nào cũng được, mãi mãi. Hãy giữ nó ở phía máy chủ, lấy phiên làm khoá, đặt hạn ngắn, và XOÁ nó khi dùng — <code>GETDEL</code> trong một lượt đi về. Cùng luật đó áp cho nghi thức xác thực, và đây là con lỗi cài đặt WebAuthn phổ biến nhất.</p>
</div>

<h3>Xác thực, và cái bộ đếm sẽ cắn bạn</h3>
<div class="out">Khoa bao mat USB (YubiKey)  ->  0x05  (00000101)
    bit 0  UP  (co mat nguoi dung)
    bit 2  UV  (da kiem chung nguoi dung)

Passkey tren iPhone (da dong bo)  ->  0x1d  (00011101)
    bit 0  UP  (co mat nguoi dung)
    bit 2  UV  (da kiem chung nguoi dung)
    bit 3  BE  (du dieu kien sao luu)
    bit 4  BS  (dang duoc sao luu)

Passkey moi dang ky  ->  0x5d  (01011101)
    bit 0  UP · bit 2  UV · bit 3  BE · bit 4  BS
    bit 6  AT  (co du lieu chung thuc — chi co o le DANG KY)

# Mot byte co the duy nhat trong authenticatorData. BE=0 nghia la khoa
# gan cung thiet bi; BE=1 va BS=1 nghia la passkey dang duoc dong bo.
</div>
<pre><code>const result = await verifyAuthenticationResponse({
  response: req.body, expectedChallenge: mong,
  expectedOrigin: ORIGIN, expectedRPID: RP_ID,
  credential: { id: c.credentialId, publicKey: c.publicKey, counter: c.counter },
});

<span class="tok-comment">// SAI — dòng này giết sạch mọi passkey đồng bộ trên đời:</span>
if (result.authenticationInfo.newCounter &lt;= c.counter) throw new Error('nhan ban!');

<span class="tok-comment">// ĐÚNG — chỉ kiểm khi bộ xác thực THẬT SỰ có dùng bộ đếm:</span>
const bd = result.authenticationInfo.newCounter;
if (c.counter &gt; 0 &amp;&amp; bd &gt; 0 &amp;&amp; bd &lt;= c.counter) {
  await warnDuplicate(u, c);                <span class="tok-comment">// tín hiệu THẬT: có bản sao khoá</span>
  return res.status(401).json({ error: 'Không xác thực được.' });
}
await prisma.credential.update({ where: { id: c.id },
  data: { counter: bd, lastUsedAt: new Date() } });</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nó sinh ra để làm gì</span><span class="lz-t">Phát hiện nhân bản</span><span class="lz-d">Một khoá phần cứng tăng một bộ đếm ở mỗi lần ký. Nếu về tới một giá trị KHÔNG lớn hơn cái bạn thấy lần trước thì có hai bản sao của cái khoá đang tồn tại — mà với một thiết bị có khoá riêng không rút ra được thì điều đó nghĩa là có chuyện rất không ổn.</span></div>
  <div class="lz-step"><span class="lz-k">Vì sao ngày nay nó phần lớn bằng không</span><span class="lz-t">Passkey đồng bộ không đếm được</span><span class="lz-d">Một credential sống trên bốn thiết bị thì chẳng có một bộ đếm DUY NHẤT nào để tăng, nên bộ xác thực nền tảng báo <code>0</code> vĩnh viễn. Đặc tả cho phép điều này một cách tường minh.</span></div>
  <div class="lz-step"><span class="lz-k">Phép kiểm ngây thơ phá sạch mọi thứ</span><span class="lz-t">Và trông y hệt một tính năng bảo mật</span><span class="lz-d">"Bộ đếm mới phải lớn hơn" sẽ từ chối MỌI lần đăng nhập từ mọi passkey của Apple và Google, mãi mãi, kèm một thông báo lỗi về chuyện nhân bản. Đó là một con lỗi trông rất tự tin.</span></div>
  <div class="lz-step"><span class="lz-k">Luật chạy được</span><span class="lz-t">Chỉ so khi CẢ HAI đều khác không</span><span class="lz-d">Một bộ đếm đã lưu lớn hơn không nghĩa là bộ xác thực này CÓ đếm, nên một giá trị không tăng thì thật sự đáng ngờ. Bằng không ở bên nào cũng nghĩa là tính năng đó không tham gia. Hãy GIỮ phép kiểm — nó vẫn bắt được một khoá phần cứng bị nhân bản — chỉ cần rào nó lại.</span></div>
</div>

<h3>Giao diện có điều kiện, chỗ mà tỉ lệ dùng thật sự đến từ</h3>
<pre><code><span class="tok-comment">// Passkey hiện ra ngay trong gợi ý tự điền của ô email. Không cần bấm gì thêm.</span>
&lt;input name="email" autocomplete="username webauthn" /&gt;

if (await PublicKeyCredential.isConditionalMediationAvailable?.()) {
  navigator.credentials.get({
    publicKey: { challenge: await getChallenge(), rpId: RP_ID },
    mediation: 'conditional',            <span class="tok-comment">// ← không mở hộp thoại nếu không có passkey</span>
  }).then(dangNhapBangPasskey).catch(() =&gt; {});   <span class="tok-comment">// im lặng khi người dùng lờ đi</span>
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó thất bại trong IM LẶNG, và đó chính là điểm hay</span><span class="lz-lnote">Một người dùng không có passkey thì thấy một biểu mẫu đăng nhập bình thường và chẳng bao giờ biết lời gọi kia đã xảy ra. Một người có passkey thì thấy tài khoản của mình hiện ra trong danh sách tự điền. Không có câu hỏi "bạn có passkey không?" nào để mà trả lời sai.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái từ khoá trong autocomplete là BẮT BUỘC</span><span class="lz-lnote">Thiếu chữ <code>webauthn</code> trong thuộc tính <code>autocomplete</code> thì chế độ có điều kiện KHÔNG làm gì cả và cũng không báo lỗi gì. Đó là lý do phổ biến nhất khiến một bản cài đặt hoàn toàn đúng lại có vẻ như bị trình duyệt lờ đi.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mời đăng ký NGAY SAU một lần đăng nhập bằng mật khẩu</span><span class="lz-lnote">Khoảnh khắc người dùng vừa chứng minh mình là ai chính là khoảnh khắc họ sẽ đồng ý với câu "lần sau chỉ cần một cú chạm". Lời mời đăng ký nằm trong một trang cài đặt chẳng ai ghé chính là lý do những con số về tỉ lệ dùng passkey khiến người ta thất vọng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đừng bao giờ để MỘT passkey là lối vào duy nhất</span><span class="lz-lnote">Hãy mời thêm một credential thứ hai trên một thiết bị khác NGAY sau cái đầu tiên, và giữ nguyên cái thang khôi phục ở Bài 7.3. Một thiết bị, một credential, không đường khôi phục chính là cách một đợt triển khai passkey tự tạo ra hàng đợi hỗ trợ cho chính nó.</span></div>
</div>

<h3>Cuộc di trú, ba chặng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chặng 1 — passkey làm yếu tố THỨ HAI</span><span class="v">Mật khẩu trước, rồi passkey thay cho mã TOTP. Không có gì trong việc đăng nhập thay đổi với những ai không tự chọn tham gia, bạn học được hai nghi thức trên thiết bị thật, và những người đã đăng ký thì ngay lập tức chống lừa đảo được ở bước thứ hai.</span></div>
  <div class="kv"><span class="k">Chặng 2 — passkey làm yếu tố CHÍNH</span><span class="v">Giao diện có điều kiện trên trang đăng nhập: một cú chạm thay thế HOÀN TOÀN mật khẩu cộng mã, vì việc kiểm chứng người dùng vốn đã làm nó thành đa yếu tố. Mật khẩu vẫn ở đó làm đường lùi. Đây là chỗ phần thắng về trải nghiệm hiện ra trong các con số của bạn.</span></div>
  <div class="kv"><span class="k">Chặng 3 — mật khẩu thành tuỳ chọn, rồi biến mất</span><span class="v">Hãy mời gỡ bỏ mật khẩu khi một tài khoản đã có HAI passkey và một đường khôi phục chạy được. Gỡ nó đi là gỡ vĩnh viễn chuyện nhồi tín vật, chuyện dùng lại mật khẩu và chuyện lạm dụng luồng đặt lại ra khỏi tài khoản đó — tức là toàn bộ mô hình đe doạ của Chương 2 và Chương 6, với những tài khoản đi được tới đây.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ xoá đường lùi cho những người KHÔNG dùng được passkey</span><span class="v">Máy dùng chung, thiết bị do công ty quản lý đã tắt bộ xác thực nền tảng, phần cứng cũ, và cả những người đơn giản là từ chối. Chặng 3 là theo TỪNG TÀI KHOẢN và do người dùng tự chọn, còn một sản phẩm ép buộc nó sẽ khoá cái đuôi của tệp người dùng ra ngoài mà không có đường quay lại.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy dùng thư viện, và hãy BIẾT nó đang kiểm cái gì.</strong> <code>@simplewebauthn/server</code> và các thư viện tương đương lo phần giải mã CBOR, phân tích khoá COSE, các bit cờ và việc kiểm chữ ký — chẳng phần nào trong số đó bạn muốn tự viết, và phần nào cũng đầy góc sắc. Cái mà KHÔNG thư viện nào quyết thay bạn là: RP ID, thử thách nằm ở đâu, đối xử với bộ đếm thế nào, và cuộc di trú chạy ra sao. Bốn cái đó là toàn bộ bài này, và cũng chính là bốn cái xuất hiện trong mọi bản báo cáo sự cố về WebAuthn.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://simplewebauthn.dev/docs/" target="_blank" rel="noopener"><span class="lc-ico">🧰</span><span class="lc-body"><span class="lc-title">SimpleWebAuthn — tài liệu</span><span class="lc-sub">simplewebauthn.dev · Nửa máy chủ và nửa trình duyệt dùng trong đoạn mã ở trên</span></span></a>
<a class="link-card" href="https://web.dev/articles/passkey-form-autofill" target="_blank" rel="noopener"><span class="lc-ico">✨</span><span class="lc-body"><span class="lc-title">web.dev — passkey trong tự điền biểu mẫu</span><span class="lc-sub">web.dev · Chế độ có điều kiện từ đầu tới cuối, kể cả cái từ khoá autocomplete</span></span></a>
<a class="link-card" href="https://www.w3.org/TR/webauthn-3/#sctn-sign-counter" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">W3C — bộ đếm chữ ký</span><span class="lc-sub">w3.org · Nó bảo đảm được gì, và chỗ nào đặc tả cho phép bằng không</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Prisma ORM</span><span class="lc-sub">Cột Bytes, chỉ mục duy nhất trên dữ liệu nhị phân, và các câu truy vấn ở trên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Đăng ký rồi xác thực một passkey từ đầu tới cuối, sau đó thêm phép kiểm bộ đếm ngây thơ vào và nhìn nó khoá bạn ra ngoài</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 7.6 ─────────────────────────── */
    {
      title: 'Quiz: the second factor and passkeys|||Quiz: yếu tố thứ hai và passkey',
      slug: 'auth-7-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về các nhóm yếu tố, thuật toán TOTP, tái dùng mã, mã khôi phục, ràng buộc origin của WebAuthn, RP ID và bộ đếm chữ ký.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.6</span>
<h2>Quiz: the second factor and passkeys</h2>
<p class="lead">Eight questions. Two of them describe defences that are correct in isolation and useless in place — because in this chapter the strength of the system is the strength of its weakest path, and that path is almost never the cryptography.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Every second factor stops credential stuffing; only an origin-bound one stops phishing, and a code sent to the mailbox that can already reset the password is one factor counted twice (7.1). TOTP is one HMAC and one modulo — thirty lines that match the RFC's own vectors — and it needs a ±1 window plus a stored last step, or codes replay (7.2). Enrolment must confirm a working code before enabling, must issue hashed single-use recovery codes at the same moment, and must be rate-limited per account, because six digits is only a million (7.3). WebAuthn signs the origin the browser is actually on, which is why a relayed signature fails and a phishing page is never even offered the credential — and the RP ID is chosen once, forever (7.4). Shipping it means a server-side single-use challenge, a counter check guarded so synced passkeys are not rejected, conditional UI for adoption, and a three-stage migration that never removes the fallback (7.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.6</span>
<h2>Quiz: yếu tố thứ hai và passkey</h2>
<p class="lead">Tám câu. Hai câu mô tả những lớp phòng thủ ĐÚNG khi đứng riêng và VÔ DỤNG khi đặt vào chỗ — vì trong chương này, sức mạnh của cả hệ thống bằng sức mạnh của con đường yếu nhất, và con đường đó gần như không bao giờ là phần mật mã.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Mọi yếu tố thứ hai đều chặn được nhồi tín vật; chỉ yếu tố BUỘC VÀO ORIGIN mới chặn được lừa đảo, và một mã gửi tới đúng cái hộp thư vốn đã đặt lại được mật khẩu chỉ là MỘT yếu tố đếm hai lần (7.1). TOTP là một lần HMAC và một phép lấy dư — ba mươi dòng khớp đúng bộ vector của chính RFC — và nó cần cửa sổ ±1 cộng một cột lưu bước cuối, không thì mã bị phát lại (7.2). Đăng ký phải xác nhận một mã chạy được TRƯỚC khi bật, phải phát mã khôi phục dạng băm dùng một lần ngay tại khoảnh khắc đó, và phải giới hạn tần suất theo tài khoản, vì sáu chữ số chỉ là một triệu (7.3). WebAuthn ký chính cái origin mà trình duyệt đang thật sự đứng, nên một chữ ký chuyển tiếp sẽ hỏng và một trang lừa đảo thậm chí không được đưa credential ra — còn RP ID thì chọn một lần, vĩnh viễn (7.4). Đưa nó lên production nghĩa là một thử thách phía máy chủ dùng một lần, một phép kiểm bộ đếm có rào để không từ chối passkey đồng bộ, giao diện có điều kiện để có người dùng, và một cuộc di trú ba chặng không bao giờ xoá mất đường lùi (7.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Your app sends a one-time code by email as the second factor. Password reset also goes by email. What have you built?|||Ứng dụng của bạn gửi mã một lần qua email làm yếu tố thứ hai. Đặt lại mật khẩu cũng đi qua email. Bạn vừa dựng ra cái gì?',
            options: [
              'Proper two-factor authentication|||Một cơ chế xác thực hai yếu tố đúng nghĩa',
              'One factor counted twice: a single compromised mailbox still yields the whole account, so the second step adds no independent evidence|||MỘT yếu tố đếm hai lần: một hộp thư bị chiếm vẫn cho ra nguyên cái tài khoản, nên bước thứ hai không thêm được bằng chứng độc lập nào',
              'Two factors, because the code is time-limited|||Hai yếu tố, vì cái mã có giới hạn thời gian',
              'Two factors, as long as the code is six digits|||Hai yếu tố, miễn là mã có sáu chữ số',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which second factor stops a real-time phishing proxy that relays whatever the user enters?|||Yếu tố thứ hai nào chặn được một trang lừa đảo trung gian chuyển tiếp ngay lập tức mọi thứ người dùng nhập vào?',
            options: [
              'TOTP, because the code changes every thirty seconds|||TOTP, vì mã đổi mỗi ba mươi giây',
              'A WebAuthn credential, because the browser signs the origin it is actually on and a relayed signature therefore names the wrong site|||Một credential WebAuthn, vì trình duyệt KÝ CẢ cái origin nó đang thật sự đứng, nên một chữ ký chuyển tiếp sẽ khai ra sai trang',
              'SMS, because the carrier verifies the number|||SMS, vì nhà mạng có xác minh số điện thoại',
              'Any of them, provided the code expires quickly|||Cái nào cũng được, miễn là mã hết hạn nhanh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your TOTP verifier returns true or false. What attack stays open?|||Hàm kiểm TOTP của bạn trả về đúng hoặc sai. Cú tấn công nào vẫn còn mở?',
            options: [
              'Brute force, because six digits is too few|||Dò cạn, vì sáu chữ số là quá ít',
              'Replay: a code stays valid for up to ninety seconds, so anyone who sees it once can reuse it — return the matching step and require the next one to be strictly greater|||Phát lại: một mã còn hiệu lực tới chín mươi giây, nên ai nhìn thấy nó một lần là dùng lại được — hãy trả về SỐ BƯỚC đã khớp và bắt bước kế tiếp phải lớn hơn hẳn',
              'Clock drift on the client|||Đồng hồ client bị trôi',
              'Nothing, provided the comparison is constant-time|||Không còn gì, miễn là phép so sánh chạy hằng thời gian',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is a ±1 step window standard rather than ±5?|||Vì sao cửa sổ ±1 bước là chuẩn chứ không phải ±5?',
            options: [
              'Because RFC 6238 forbids anything wider|||Vì RFC 6238 cấm mọi cửa sổ rộng hơn',
              'Because ±1 covers ninety seconds, which absorbs normal skew and slow typing, while a wider window multiplies the number of simultaneously valid codes for no real benefit|||Vì ±1 phủ chín mươi giây, đủ hấp thụ độ lệch bình thường và việc gõ chậm, còn cửa sổ rộng hơn thì nhân số mã cùng lúc hợp lệ lên mà chẳng đổi lại lợi ích thật nào',
              'Because authenticator apps only generate one code|||Vì ứng dụng sinh mã chỉ tạo ra một mã duy nhất',
              'Because the counter is 8 bytes|||Vì bộ đếm dài 8 byte',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When should recovery codes be generated and shown?|||Mã khôi phục nên được sinh ra và hiển thị vào lúc nào?',
            options: [
              'On a separate settings page the user can visit later|||Ở một trang cài đặt riêng mà người dùng có thể ghé lại sau',
              'In the same response that confirms MFA is now on, hashed in the database, single use, with the count of remaining codes shown afterwards|||Ngay trong chính cái phản hồi xác nhận MFA vừa được bật, lưu dạng băm trong cơ sở dữ liệu, dùng một lần, và về sau hiển thị số mã còn lại',
              'Only when the user reports a lost device|||Chỉ khi người dùng báo mất thiết bị',
              'Never; recovery should always go through support|||Không bao giờ; khôi phục phải luôn đi qua bộ phận hỗ trợ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your login runs at cuongthai.com but the app is served from app.cuongthai.com. Which RP ID should passkeys use?|||Trang đăng nhập của bạn chạy ở cuongthai.com còn ứng dụng phục vụ từ app.cuongthai.com. Passkey nên dùng RP ID nào?',
            options: [
              'app.cuongthai.com, matching the app exactly|||app.cuongthai.com, khớp chính xác với ứng dụng',
              'cuongthai.com — the broadest registrable domain you will legitimately serve from, because credentials are bound to the RP ID forever and cannot be widened later|||cuongthai.com — cái tên miền đăng ký được RỘNG NHẤT mà bạn sẽ còn phục vụ một cách chính đáng, vì credential bị buộc vào RP ID VĨNH VIỄN và về sau không nới rộng ra được',
              'https://cuongthai.com, the full origin|||https://cuongthai.com, tức là origin đầy đủ',
              'Either one; they are interchangeable|||Cái nào cũng được; chúng thay thế được cho nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You reject any authentication whose signature counter is not greater than the stored one. What breaks?|||Bạn từ chối mọi lần xác thực có bộ đếm chữ ký không lớn hơn giá trị đã lưu. Cái gì hỏng?',
            options: [
              'Nothing; that is the specified clone check|||Không gì cả; đó là phép kiểm nhân bản theo đúng đặc tả',
              'Every synced passkey, which reports 0 permanently because a credential on four devices has no single counter — only compare when both the stored and new values are non-zero|||Mọi passkey ĐỒNG BỘ, vì chúng báo 0 vĩnh viễn — một credential nằm trên bốn thiết bị thì chẳng có bộ đếm duy nhất nào — nên chỉ so sánh khi CẢ giá trị đã lưu lẫn giá trị mới đều khác không',
              'Only hardware security keys|||Chỉ mỗi khoá bảo mật phần cứng',
              'Nothing until the counter overflows|||Không gì cả, cho tới khi bộ đếm tràn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Where should the WebAuthn challenge be stored between the two requests?|||Thử thách WebAuthn nên được lưu ở đâu giữa hai request?',
            options: [
              'In a hidden form field, so the endpoint stays stateless|||Trong một trường ẩn của biểu mẫu, để endpoint giữ được tính phi trạng thái',
              'Server-side, keyed by session, short-lived and deleted on use — a challenge the client can choose is no challenge at all|||Ở PHÍA MÁY CHỦ, lấy phiên làm khoá, hạn ngắn và XOÁ khi dùng — một thử thách mà client chọn được thì không còn là thử thách',
              'In a signed cookie, which cannot be tampered with|||Trong một cookie đã ký, thứ không thể bị sửa',
              'It does not need storing; the signature covers it|||Không cần lưu; chữ ký đã phủ lên nó rồi',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
