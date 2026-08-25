/**
 * Authentication — Chương 10: Các cú tấn công, xếp theo tần suất thật.
 * Nhồi tín vật · lừa đảo · chiếm phiên · tấn công vào con người · những cú còn lại · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 10 — The attacks, in order of how often they happen|||Chương 10 — Các cú tấn công, xếp theo TẦN SUẤT THẬT',
  description: 'Chín chương vừa rồi dựng hàng phòng thủ. Chương này xếp các cú tấn công theo thứ tự chúng THẬT SỰ xảy ra — chứ không phải thứ tự chúng thú vị — rồi với mỗi cú thì chỉ rõ chương nào đã chặn nó, chỗ nào vẫn hở, và cái tín hiệu nào cho bạn biết nó đang diễn ra ngay lúc này.',
  lessons: [

    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — Credential stuffing, the attack that is happening right now|||10.1 — Nhồi tín vật, cú tấn công đang diễn ra NGAY LÚC NÀY',
      slug: 'auth-10-1-nhoi-tin-vat',
      type: 'LESSON',
      description: 'Không có lỗ hổng nào cả: kẻ tấn công có mật khẩu ĐÚNG, lấy từ một trang khác. Bài này tính ra kinh tế học của một đợt nhồi bằng số thật, chỉ ra vì sao giới hạn theo IP không đổi được con số nào, và xếp các biện pháp theo thứ tự tác dụng đo được — trong đó có một cái cắt 80% đầu vào TRƯỚC khi nó chạm tới trang đăng nhập.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Credential stuffing, the attack that is happening right now</h2>
<p class="lead">This is the most common attack against authentication by a very large margin, and it exploits nothing. The attacker has a valid email and a valid password, taken from a breach at a company that is not you, and they are simply asking whether the same pair works here. For fifteen percent of your users it does.</p>

<h3>The economics, computed</h3>
<div class="out">Kinh te hoc cua mot dot nhoi tin vat — danh sach 1.000.000 cap email/mat khau

bien phap                      co tai khoan   bi chiem
Khong co gi chan                     150000       3000
Chi gioi han theo IP                 150000       3000
Doi chieu danh sach ro ri             30000        600
Yeu to thu hai bat buoc              150000          0

thoi gian de thu het 1 trieu cap:
  1 IP, 10 req/s                      27.8 gio
  1.000 IP proxy, 10 req/s moi IP     1.7 phut
  botnet 50.000 IP, 10 req/s          0.0 phut

=&gt; Gioi han theo IP KHONG doi duoc con so nao trong bang tren.
=&gt; Doi chieu danh sach ro ri cat 80% dau vao TRUOC khi no cham toi trang dang nhap.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The success rate is small and the volume is enormous</span><span class="v">One to three percent of attempted pairs work — which sounds like failure until you notice the list has a million rows and costs almost nothing. Three thousand accounts from one run is a good week for whoever is doing it.</span></div>
  <div class="kv"><span class="k">Residential proxies make per-IP limits decorative</span><span class="v">A thousand addresses rented by the hour turns twenty-eight hours into under two minutes, and each individual address makes ten requests — which looks exactly like ten people logging in. Rate limiting by IP measures the wrong thing here.</span></div>
  <div class="kv"><span class="k">There is no vulnerability to fix</span><span class="v">Every request is a well-formed login with correct credentials. Nothing in Chapters 1 to 4 is broken, no patch applies, and the only reason your users are exposed is that they reused a password somewhere else.</span></div>
  <div class="kv"><span class="k">The second factor ends it outright</span><span class="v">Every second factor blocks one hundred percent of automated stuffing (Lesson 7.1), because the attacker has one of two things. This is why the adoption problem in Lesson 7.1 is a security problem and not a product one.</span></div>
</div>

<h3>Defences, ranked by measured effect</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Breach-list checking</span><span class="lz-t">At registration and at reset</span><span class="lz-d">Refuse passwords that already appear in a public breach corpus, using the k-anonymity range API from Lesson 2.2. It removes most of the reusable pairs before the attack exists — the single highest-leverage line in this lesson.</span></div>
  <div class="lz-step"><span class="lz-k">2 · A second factor</span><span class="lz-t">Especially passkeys</span><span class="lz-d">Complete protection for accounts that have one. The work is not the cryptography, it is getting people to enrol — prompt after a successful login, make it one tap, and require it for anything that holds money.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Per-account attempt limits</span><span class="lz-t">Not per-IP</span><span class="lz-d">The attacker rotates addresses freely and cannot rotate the target account. Count failures against the identifier, with an exponential backoff that resets on success — and never a permanent lock, which hands them a denial of service.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Risk signals</span><span class="lz-t">Cheap, and surprisingly effective</span><span class="lz-d">A first-ever login from a new country, a datacentre ASN, a missing or absurd user agent, a session with no prior device cookie. None is proof; together they justify demanding a second factor for that attempt.</span></div>
</div>
<pre><code><span class="tok-comment">// Trần theo TÀI KHOẢN, lùi theo cấp số nhân, tự hồi phục.</span>
const KEY = &#96;dn-hong:\${normalizedEmail}&#96;;
const n = await redis.incr(KEY);
if (n === 1) await redis.expire(KEY, 900);

if (n &gt; 5) {
  const cho = Math.min(2 ** (n - 5), 300);          <span class="tok-comment">// 2, 4, 8 … tối đa 300 giây</span>
  return res.status(429).set('Retry-After', String(cho)).end();
}

<span class="tok-comment">// Đăng nhập ĐÚNG → xoá bộ đếm. Người dùng thật không bao giờ chạm tới trần.</span>
if (match) await redis.del(KEY);</code></pre>
<div class="pitfall">
<p><strong>Trap — a permanent lockout after N failures is a denial-of-service tool handed to the attacker.</strong> If five wrong passwords lock an account until support unlocks it, anybody who knows an email address can lock that account, and a stuffing run locks out fifteen percent of your users in an afternoon. That is a worse outcome than the attack it prevents. Use a rolling window that expires on its own, back off exponentially rather than blocking outright, and reserve a real lock for accounts where you have positive evidence of compromise — where the correct response is a forced reset, not a wall.</p>
</div>

<h3>Detecting it, which is easier than stopping it</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The failure ratio is the signal</span><span class="lz-lnote">Normal traffic runs somewhere near five to fifteen percent failed logins. A stuffing run pushes it past ninety, because almost every pair is wrong. Alert on the ratio rather than the count — the count moves with traffic and the ratio does not.</span></div>
  <div class="lz-layer"><span class="lz-lname">Distinct accounts per IP, and IPs per account</span><span class="lz-lnote">One address attempting two hundred different accounts is an attack. Two hundred addresses attempting one account is a different attack. Both are trivially detectable and neither shows up in a per-IP rate limiter's counters.</span></div>
  <div class="lz-layer"><span class="lz-lname">Watch the successes, not only the failures</span><span class="lz-lnote">The damage happens on the one percent that work. A successful login from an ASN that has only ever produced failures, or a burst of successes across unrelated accounts in one minute, is the alert that actually matters.</span></div>
  <div class="lz-layer"><span class="lz-lname">Log the attempt, never the password</span><span class="lz-lnote">Identifier, IP, ASN, user agent, outcome, timestamp. Never the submitted password — not even hashed, not even on failure. A log of attempted passwords is a credential file with extra steps, and it will be the first thing an incident finds.</span></div>
</div>
<div class="callout warn">
<p><strong>CAPTCHA buys less than the friction it costs, and it is worth being precise about why.</strong> Solving services charge fractions of a cent per challenge with human operators behind them, so a determined stuffing run pays a rounding error and continues. What a CAPTCHA does reliably is stop the cheapest, most naive scripts — which is real value — while taxing every legitimate user, disproportionately those on assistive technology or a slow connection. If you use one, trigger it on risk signals rather than on every login, prefer a modern invisible challenge, and never let it be the only thing between a stuffing list and your accounts.</p>
</div>
<div class="note-ct">
<p><strong>The three lines that matter, in order.</strong> Check new passwords against a breach corpus, offer and push a second factor, and count failures per account rather than per address. Those three cost a day of work between them and remove most of this lesson's risk; everything else — device fingerprints, behavioural scoring, bot-management vendors — is refinement on top of them. Teams routinely buy the refinement first because it comes with a dashboard, and then discover their signup form still accepts <code>Password123!</code>.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://owasp.org/www-community/attacks/Credential_stuffing" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">OWASP — credential stuffing</span><span class="lc-sub">owasp.org · The attack, and the defence list ranked by effect</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — credential stuffing prevention</span><span class="lc-sub">cheatsheetseries.owasp.org · Including why lockout is the wrong control</span></span></a>
<a class="link-card" href="https://haveibeenpwned.com/API/v3#PwnedPasswords" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">Pwned Passwords range API</span><span class="lc-sub">haveibeenpwned.com · The k-anonymity lookup from Lesson 2.2</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">Counters with TTL, and rate-limiter shapes that survive real traffic</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Run a stuffing list against a per-IP limiter, then move the counter to the account</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Nhồi tín vật, cú tấn công đang diễn ra NGAY LÚC NÀY</h2>
<p class="lead">Đây là cú tấn công phổ biến nhất nhắm vào xác thực, bỏ xa các loại khác, và nó KHÔNG khai thác gì cả. Kẻ tấn công có một email hợp lệ và một mật khẩu hợp lệ, lấy từ một vụ rò rỉ ở một công ty KHÔNG PHẢI bạn, và họ chỉ đơn giản là đi hỏi xem cặp đó có chạy được ở đây không. Với mười lăm phần trăm người dùng của bạn thì CÓ.</p>

<h3>Kinh tế học của nó, tính ra bằng số</h3>
<div class="out">Kinh te hoc cua mot dot nhoi tin vat — danh sach 1.000.000 cap email/mat khau

bien phap                      co tai khoan   bi chiem
Khong co gi chan                     150000       3000
Chi gioi han theo IP                 150000       3000
Doi chieu danh sach ro ri             30000        600
Yeu to thu hai bat buoc              150000          0

thoi gian de thu het 1 trieu cap:
  1 IP, 10 req/s                      27.8 gio
  1.000 IP proxy, 10 req/s moi IP     1.7 phut
  botnet 50.000 IP, 10 req/s          0.0 phut

=&gt; Gioi han theo IP KHONG doi duoc con so nao trong bang tren.
=&gt; Doi chieu danh sach ro ri cat 80% dau vao TRUOC khi no cham toi trang dang nhap.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tỉ lệ thành công thì NHỎ còn khối lượng thì KHỔNG LỒ</span><span class="v">Một tới ba phần trăm số cặp thử là chạy — nghe như thất bại, cho tới khi bạn để ý rằng danh sách có một triệu dòng và gần như không tốn gì. Ba nghìn tài khoản từ một đợt chạy là một tuần bội thu với người đang làm việc đó.</span></div>
  <div class="kv"><span class="k">Proxy dân cư làm cho trần theo IP thành đồ trang trí</span><span class="v">Một nghìn địa chỉ thuê theo giờ biến hai mươi tám tiếng thành chưa tới hai phút, và mỗi địa chỉ riêng lẻ chỉ gửi mười request — trông y hệt mười người đang đăng nhập. Giới hạn tần suất theo IP ở đây đang ĐO NHẦM thứ.</span></div>
  <div class="kv"><span class="k">Chẳng có lỗ hổng nào để mà vá</span><span class="v">Mọi request đều là một lần đăng nhập đúng định dạng với tín vật ĐÚNG. Không thứ gì trong Chương 1 tới 4 bị vỡ, không bản vá nào áp được, và lý do duy nhất khiến người dùng của bạn bị phơi ra là họ đã dùng lại mật khẩu ở một chỗ khác.</span></div>
  <div class="kv"><span class="k">Yếu tố thứ hai KẾT THÚC nó dứt điểm</span><span class="v">Mọi yếu tố thứ hai đều chặn một trăm phần trăm số vụ nhồi tự động (Bài 7.1), vì kẻ tấn công chỉ có MỘT trong hai thứ. Đó là lý do bài toán tỉ lệ người dùng bật MFA ở Bài 7.1 là một bài toán BẢO MẬT chứ không phải bài toán sản phẩm.</span></div>
</div>

<h3>Các biện pháp, xếp theo tác dụng đo được</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Đối chiếu danh sách rò rỉ</span><span class="lz-t">Lúc đăng ký và lúc đặt lại</span><span class="lz-d">Từ chối những mật khẩu đã xuất hiện trong một kho rò rỉ công khai, dùng API dải theo k-ẩn danh ở Bài 2.2. Nó gỡ phần lớn các cặp dùng-lại-được TRƯỚC khi cú tấn công tồn tại — dòng có đòn bẩy cao nhất trong cả bài này.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Một yếu tố thứ hai</span><span class="lz-t">Nhất là passkey</span><span class="lz-d">Bảo vệ hoàn toàn cho những tài khoản CÓ nó. Phần việc không nằm ở mật mã, mà ở chỗ khiến người ta chịu đăng ký — hãy mời ngay sau một lần đăng nhập thành công, làm cho nó chỉ một cú chạm, và BẮT BUỘC với mọi thứ giữ tiền.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Trần số lần thử theo TÀI KHOẢN</span><span class="lz-t">Không phải theo IP</span><span class="lz-d">Kẻ tấn công xoay địa chỉ thoải mái và KHÔNG xoay được cái tài khoản đích. Hãy đếm số lần hỏng theo định danh, lùi theo cấp số nhân và đặt lại khi đăng nhập đúng — và đừng bao giờ khoá vĩnh viễn, vì đó là trao cho họ một cú từ chối dịch vụ.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Các tín hiệu rủi ro</span><span class="lz-t">Rẻ, và hiệu quả đến bất ngờ</span><span class="lz-d">Lần đầu tiên đăng nhập từ một quốc gia mới, một ASN của trung tâm dữ liệu, một user agent thiếu hoặc vô lý, một phiên không có cookie thiết bị nào từ trước. Không cái nào là bằng chứng; nhưng gộp lại thì đủ để đòi một yếu tố thứ hai cho riêng lần thử đó.</span></div>
</div>
<pre><code><span class="tok-comment">// Trần theo TÀI KHOẢN, lùi theo cấp số nhân, tự hồi phục.</span>
const KEY = &#96;dn-hong:\${normalizedEmail}&#96;;
const n = await redis.incr(KEY);
if (n === 1) await redis.expire(KEY, 900);

if (n &gt; 5) {
  const cho = Math.min(2 ** (n - 5), 300);          <span class="tok-comment">// 2, 4, 8 … tối đa 300 giây</span>
  return res.status(429).set('Retry-After', String(cho)).end();
}

<span class="tok-comment">// Đăng nhập ĐÚNG → xoá bộ đếm. Người dùng thật không bao giờ chạm tới trần.</span>
if (match) await redis.del(KEY);</code></pre>
<div class="pitfall">
<p><strong>Bẫy — khoá vĩnh viễn sau N lần hỏng là một công cụ TỪ CHỐI DỊCH VỤ trao tận tay kẻ tấn công.</strong> Nếu năm lần sai mật khẩu khoá một tài khoản cho tới khi bộ phận hỗ trợ mở, thì bất kỳ ai biết một địa chỉ email đều khoá được tài khoản đó, và một đợt nhồi sẽ khoá mất mười lăm phần trăm người dùng của bạn trong một buổi chiều. Đó là kết cục TỆ HƠN chính cú tấn công mà nó ngăn. Hãy dùng một cửa sổ trượt tự hết hạn, lùi theo cấp số nhân thay vì chặn thẳng, và chỉ dành một cú khoá thật cho những tài khoản mà bạn CÓ bằng chứng dương tính rằng đã bị xâm nhập — mà ở đó phản ứng đúng là ÉP ĐẶT LẠI MẬT KHẨU, không phải dựng một bức tường.</p>
</div>

<h3>Phát hiện nó, việc dễ hơn là chặn nó</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">TỈ LỆ hỏng mới là tín hiệu</span><span class="lz-lnote">Lưu lượng bình thường chạy quanh mức năm tới mười lăm phần trăm số lần đăng nhập hỏng. Một đợt nhồi đẩy nó vượt chín mươi, vì gần như mọi cặp đều sai. Hãy báo động theo TỈ LỆ chứ đừng theo số đếm — số đếm nhúc nhích theo lưu lượng còn tỉ lệ thì không.</span></div>
  <div class="lz-layer"><span class="lz-lname">Số tài khoản khác nhau trên mỗi IP, và số IP trên mỗi tài khoản</span><span class="lz-lnote">Một địa chỉ thử hai trăm tài khoản khác nhau là một cú tấn công. Hai trăm địa chỉ thử MỘT tài khoản là một cú tấn công KHÁC. Cả hai đều dễ phát hiện, và chẳng cái nào hiện ra trong bộ đếm của một bộ giới hạn theo IP.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy nhìn cả những lần THÀNH CÔNG, đừng chỉ nhìn lần hỏng</span><span class="lz-lnote">Thiệt hại xảy ra ở đúng cái một phần trăm chạy được. Một lần đăng nhập thành công từ một ASN mà từ trước tới nay chỉ sinh ra thất bại, hoặc một tràng thành công trên các tài khoản chẳng liên quan gì nhau trong cùng một phút — đó mới là cảnh báo thật sự đáng giá.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ghi log LẦN THỬ, đừng bao giờ ghi mật khẩu</span><span class="lz-lnote">Định danh, IP, ASN, user agent, kết quả, mốc thời gian. Đừng bao giờ ghi cái mật khẩu vừa gửi lên — kể cả dạng băm, kể cả khi nó sai. Một nhật ký các mật khẩu đã thử là một tệp tín vật kèm thêm vài bước, và nó sẽ là thứ đầu tiên mà một cuộc điều tra sự cố tìm thấy.</span></div>
</div>
<div class="callout warn">
<p><strong>CAPTCHA mua được ít hơn cái giá ma sát mà nó bắt trả, và đáng nói cho chính xác vì sao.</strong> Các dịch vụ giải CAPTCHA tính vài phần trăm xu cho mỗi thử thách, với người thật ngồi phía sau, nên một đợt nhồi quyết tâm trả một khoản làm tròn rồi đi tiếp. Thứ mà CAPTCHA làm được đáng tin cậy là chặn những cái script rẻ nhất và ngây thơ nhất — đó là giá trị THẬT — trong khi đánh thuế lên MỌI người dùng chính đáng, mà nặng nhất là những người dùng công nghệ hỗ trợ hoặc mạng chậm. Nếu vẫn dùng thì hãy kích hoạt nó theo TÍN HIỆU RỦI RO chứ đừng ở mọi lần đăng nhập, hãy ưu tiên loại thử thách vô hình hiện đại, và đừng bao giờ để nó là thứ DUY NHẤT đứng giữa một danh sách nhồi với các tài khoản của bạn.</p>
</div>
<div class="note-ct">
<p><strong>Ba dòng quan trọng, theo thứ tự.</strong> Đối chiếu mật khẩu mới với một kho rò rỉ, cung cấp và THÚC ĐẨY một yếu tố thứ hai, và đếm số lần hỏng theo TÀI KHOẢN chứ không theo địa chỉ. Ba thứ đó cộng lại tốn một ngày công và gỡ đi phần lớn rủi ro của bài này; mọi thứ khác — dấu vân tay thiết bị, chấm điểm hành vi, dịch vụ quản lý bot — đều là phần tinh chỉnh đặt lên trên chúng. Các đội thường mua phần tinh chỉnh TRƯỚC vì nó có kèm một cái bảng điều khiển đẹp, rồi mới phát hiện ra biểu mẫu đăng ký của mình vẫn đang nhận <code>Password123!</code>.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://owasp.org/www-community/attacks/Credential_stuffing" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">OWASP — nhồi tín vật</span><span class="lc-sub">owasp.org · Cú tấn công, và danh sách biện pháp xếp theo tác dụng</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — phòng chống nhồi tín vật</span><span class="lc-sub">cheatsheetseries.owasp.org · Kể cả phần vì sao KHOÁ TÀI KHOẢN là biện pháp sai</span></span></a>
<a class="link-card" href="https://haveibeenpwned.com/API/v3#PwnedPasswords" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">API dải của Pwned Passwords</span><span class="lc-sub">haveibeenpwned.com · Phép tra theo k-ẩn danh ở Bài 2.2</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">Bộ đếm có TTL, và những hình dạng bộ giới hạn sống nổi với lưu lượng thật</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chạy một danh sách nhồi vào một bộ giới hạn theo IP, rồi dời bộ đếm sang tài khoản</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — Phishing, and the kit that relays your real login page|||10.2 — Lừa đảo, và bộ công cụ chuyển tiếp NGUYÊN trang đăng nhập thật của bạn',
      slug: 'auth-10-2-lua-dao',
      type: 'LESSON',
      description: 'Lừa đảo hiện đại không dựng một trang giả nữa: nó dựng một PROXY tới trang thật của bạn, nên nạn nhân nhìn thấy đúng giao diện của bạn, gõ mã TOTP thật, và kẻ tấn công cắp luôn cái cookie phiên đã qua MFA. Bài này chỉ ra vì sao gần như mọi hàng phòng thủ đều thua nó, và cái duy nhất KHÔNG thua.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Phishing, and the kit that relays your real login page</h2>
<p class="lead">The mental model most teams carry — a crude fake page with a wrong logo — has been obsolete for years. A modern kit is a reverse proxy sitting in front of your genuine login page: the victim sees your real HTML because it <em>is</em> your real HTML, every field they type is forwarded to you, and what the attacker keeps is the authenticated session cookie you issued.</p>

<h3>What actually happens</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · The lure</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A link that looks right</span><span class="lz-nsub">A lookalike domain, a compromised colleague's account, a search advert above your own result</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · The proxy</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Your real page, relayed</span><span class="lz-nsub">Genuine HTML, genuine TLS on their domain, genuine error messages · nothing looks fake because nothing is</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · The second factor</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Forwarded within seconds</span><span class="lz-nsub">TOTP, SMS, push approval · the victim supplies a valid code and you accept it, correctly</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">4 · The prize</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The session cookie</span><span class="lz-nsub">Post-MFA, fully valid · the attacker never needs the password again, and MFA never triggers</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Every code-based factor is defeated</span><span class="v">TOTP, SMS and push all work by the human transcribing or approving something. A relay forwards it in under a second, and from your server's perspective the login is completely legitimate — because it is, structurally, a real user authenticating through an extra hop.</span></div>
  <div class="kv"><span class="k">The stolen artefact is a session, not a credential</span><span class="v">This is why changing the password afterwards does not evict them: the cookie from Chapter 3 or the refresh token from Chapter 5 is already issued. Only revocation ends it, which is exactly what Lesson 5.3 built.</span></div>
  <div class="kv"><span class="k">User training helps and does not solve it</span><span class="v">"Check the URL" asks a person to notice one wrong character in a string they read for a tenth of a second, on a phone, while busy. It measurably reduces click-through and it will never reach zero, so it cannot be the control you rely on.</span></div>
  <div class="kv"><span class="k">This is also how OAuth consent gets abused</span><span class="v">The same lure can point at a genuine provider consent screen for an attacker-owned application asking for wide scopes. Nothing is spoofed at all — the user really does grant a real app real access, which is Lesson 8.5's reason to care which providers and scopes you accept.</span></div>
</div>

<h3>The domain, measured</h3>
<div class="out">chuoi nguoi dung NHIN THAY        hostname trinh duyet DUNG     = cuongthai.com?
cuongthai.com                     cuongthai.com                 CO
cuongthái.com                     xn--cuongthi-fza.com          KHONG
cuongthai.com.dang-nhap.co        cuongthai.com.dang-nhap.co    KHONG
cuongthai-com.co                  cuongthai-com.co              KHONG
cu0ngthai.com                     cu0ngthai.com                 KHONG
cuοngthai.com                     xn--cungthai-0dg.com          KHONG

ma diem cua "cuongthái.com": cuongthU+E1i.com
ma diem cua "cuοngthai.com": cuU+3BFngthai.com

# Dong thu ba doc tu trai sang phai bat dau bang ten mien cua ban va thuoc
# ve dang-nhap.co. Dong cuoi chua mot chu omicron Hy Lap. Ca sau dong deu
# xin duoc chung chi TLS hop le trong vai giay va deu hien o khoa xanh.</div>
<div class="pitfall">
<p><strong>Trap — the padlock means the connection is encrypted, and nothing more.</strong> Free certificates are issued in seconds to anyone who controls a domain, so every phishing site has valid TLS and a padlock. A generation of security advice taught users to look for it, which now actively helps the attacker: the one visual cue people were trained to trust is present on both sides. The only reliable signal is the registrable domain itself, read right to left — and Lesson 7.4's whole point is that WebAuthn reads it for the user, mechanically, every time.</p>
</div>

<h3>What actually stops it</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Passkeys</span><span class="lz-t">Structurally, not statistically</span><span class="lz-d">The browser signs the origin it is really on (Lesson 7.4), so a relayed signature names the proxy's domain and fails your check — and the credential is never offered to that domain in the first place. This is the only defence in the lesson that is not a probability.</span></div>
  <div class="lz-step"><span class="lz-k">Bind the session to something the proxy lacks</span><span class="lz-t">Partial, and worth having</span><span class="lz-d">A cookie tied to a client-held key, or at minimum an alert when a session's IP and user agent change abruptly. It does not stop the theft; it shortens how long the stolen cookie stays useful.</span></div>
  <div class="lz-step"><span class="lz-k">Step-up on the actions that matter</span><span class="lz-t">Lesson 7.1, again</span><span class="lz-d">A stolen session is inside the product. Re-authentication before changing the email, adding a factor or moving money means the attacker has to phish a second time, at the exact moment the user is not expecting a prompt.</span></div>
  <div class="lz-step"><span class="lz-k">Watch for the lookalike domains</span><span class="lz-t">Detection, not prevention</span><span class="lz-d">Certificate transparency logs publish every certificate issued, so a feed filtered for names resembling yours finds the phishing site the day it is set up — often before the campaign starts.</span></div>
</div>
<pre><code><span class="tok-comment">// Cảnh báo khi một PHIÊN đột ngột đổi chỗ — không chặn, nhưng phát hiện.</span>
if (session.lastIp &amp;&amp; asn(req.ip) !== asn(session.lastIp)) {
  await recordEvent('session.network_change', { sessionId: session.id, cu: session.lastIp, moi: req.ip });
  if (isSensitiveAction(req)) return requireReauth(req, res);   <span class="tok-comment">// ← Bài 7.1</span>
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Do not fight it with fingerprinting alone</span><span class="lz-lnote">A proxy forwards the victim's own user agent and can forward much of the rest. Fingerprint mismatches catch the lazy kits and miss the current ones, so treat a match as no evidence and a mismatch as a signal worth an alert.</span></div>
  <div class="lz-layer"><span class="lz-lname">Number matching beats plain push approval</span><span class="lz-lnote">If you use push notifications as a factor, show a two-digit number on the login screen that the user must type into the app. A relay cannot supply a number it never saw, and it also removes the fatigue attack in Lesson 10.4.</span></div>
  <div class="lz-layer"><span class="lz-lname">Short sessions cost the attacker time</span><span class="lz-lnote">A stolen cookie valid for thirty days is a month of access; one valid for a day, with a refresh token bound to a device, is a much smaller window. It is not a fix, and it is a meaningful reduction in blast radius.</span></div>
  <div class="lz-layer"><span class="lz-lname">Give people somewhere to report it</span><span class="lz-lnote">A visible "I think I was phished" path that revokes every session immediately, without a support queue in between. The users who realise ten minutes later are your best detector, and most products give them nowhere to go.</span></div>
</div>
<div class="callout warn">
<p><strong>If you take one operational decision from this chapter, make it enrolling administrators on passkeys.</strong> Everything else here reduces probability; passkeys remove the attack for the accounts that have them. The accounts worth starting with are the ones whose compromise is unrecoverable — administrators, finance, anyone who can change permissions or move money — and for that population you can require it rather than offer it, because it is a small group you can support individually. That single change closes the number-one path to account takeover for the accounts where takeover matters most.</p>
</div>
<div class="note-ct">
<p><strong>Assume it will succeed anyway, and design for the aftermath.</strong> Some fraction of your users will be phished no matter what you build, so the useful question stops being "how do we prevent this" and becomes "how quickly do we notice, and what can one stolen session actually do?". Lesson 5.4's device list, 5.3's revocation, 7.1's step-up and Chapter 11's alerting are the answer — and they are the parts that keep working on the day prevention does not.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.cisa.gov/sites/default/files/publications/phishing-infographic-508c.pdf" target="_blank" rel="noopener"><span class="lc-ico">🎣</span><span class="lc-body"><span class="lc-title">CISA — phishing infographic</span><span class="lc-sub">cisa.gov · How campaigns are actually structured, with the numbers</span></span></a>
<a class="link-card" href="https://certificate.transparency.dev/" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">Certificate Transparency</span><span class="lc-sub">certificate.transparency.dev · Every certificate is public — monitor for names like yours</span></span></a>
<a class="link-card" href="https://fidoalliance.org/passkeys/" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">FIDO Alliance — passkeys</span><span class="lc-sub">fidoalliance.org · The phishing-resistance claim, and what it rests on</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">Registrable domains, punycode, and reading a hostname right to left</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Relay a login through a proxy, capture the session, then repeat it against a passkey</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Lừa đảo, và bộ công cụ chuyển tiếp NGUYÊN trang đăng nhập thật của bạn</h2>
<p class="lead">Cái hình dung mà phần lớn các đội còn mang theo — một trang giả thô kệch với cái logo sai — đã lỗi thời từ nhiều năm trước. Một bộ công cụ hiện đại là một PROXY NGƯỢC đứng trước trang đăng nhập thật của bạn: nạn nhân nhìn thấy đúng HTML thật của bạn vì đó <em>ĐÚNG LÀ</em> HTML thật của bạn, mọi ô họ gõ đều được chuyển tiếp tới bạn, và thứ kẻ tấn công GIỮ LẠI là cái cookie phiên đã xác thực mà chính bạn vừa phát.</p>

<h3>Chuyện thật sự diễn ra thế nào</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · Cái mồi</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một đường dẫn trông ĐÚNG</span><span class="lz-nsub">Một tên miền nhìn giống, một tài khoản đồng nghiệp bị chiếm, một mẩu quảng cáo tìm kiếm nằm TRÊN kết quả thật của bạn</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · Cái proxy</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Trang THẬT của bạn, chuyển tiếp qua</span><span class="lz-nsub">HTML thật, TLS thật trên tên miền của họ, thông báo lỗi thật · chẳng có gì trông giả vì chẳng có gì là giả</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · Yếu tố thứ hai</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chuyển tiếp trong vài giây</span><span class="lz-nsub">TOTP, SMS, phê duyệt qua thông báo đẩy · nạn nhân đưa ra một mã HỢP LỆ và bạn chấp nhận nó, một cách ĐÚNG ĐẮN</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">4 · Phần thưởng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cái cookie phiên</span><span class="lz-nsub">Đã qua MFA, hoàn toàn hợp lệ · kẻ tấn công không cần tới mật khẩu nữa, và MFA không bao giờ nổ ra lần nào</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi yếu tố dựa trên MÃ đều bị hạ</span><span class="v">TOTP, SMS và thông báo đẩy đều hoạt động bằng cách để CON NGƯỜI chép lại hoặc phê duyệt một thứ gì đó. Một cái proxy chuyển tiếp nó trong chưa tới một giây, và dưới góc nhìn của máy chủ bạn thì lần đăng nhập ấy hoàn toàn chính đáng — vì về mặt cấu trúc, nó ĐÚNG LÀ một người dùng thật đang xác thực qua thêm một chặng.</span></div>
  <div class="kv"><span class="k">Thứ bị cắp là một PHIÊN, không phải một tín vật</span><span class="v">Đó là lý do đổi mật khẩu sau đó KHÔNG đá được họ ra: cái cookie ở Chương 3 hay refresh token ở Chương 5 đã được phát rồi. Chỉ có THU HỒI mới kết thúc được nó, và đó đúng là thứ Bài 5.3 đã dựng.</span></div>
  <div class="kv"><span class="k">Đào tạo người dùng có ích và KHÔNG giải quyết được</span><span class="v">"Hãy kiểm tra URL" là yêu cầu một con người nhận ra MỘT ký tự sai trong một chuỗi mà họ đọc trong một phần mười giây, trên điện thoại, giữa lúc đang bận. Nó giảm được tỉ lệ bấm nhầm một cách đo được và sẽ không bao giờ về không, nên nó không thể là biện pháp bạn TRÔNG CẬY.</span></div>
  <div class="kv"><span class="k">Đây cũng là cách màn hình đồng ý của OAuth bị lạm dụng</span><span class="v">Cùng cái mồi đó có thể trỏ tới một màn hình đồng ý THẬT của nhà cung cấp, cho một ứng dụng của kẻ tấn công đang xin những phạm vi rộng. Chẳng có gì bị giả mạo cả — người dùng thật sự cấp cho một ứng dụng thật một quyền thật, và đó là lý do Bài 8.5 bảo bạn phải quan tâm mình chấp nhận nhà cung cấp nào với phạm vi nào.</span></div>
</div>

<h3>Cái tên miền, đo thật</h3>
<div class="out">chuoi nguoi dung NHIN THAY        hostname trinh duyet DUNG     = cuongthai.com?
cuongthai.com                     cuongthai.com                 CO
cuongthái.com                     xn--cuongthi-fza.com          KHONG
cuongthai.com.dang-nhap.co        cuongthai.com.dang-nhap.co    KHONG
cuongthai-com.co                  cuongthai-com.co              KHONG
cu0ngthai.com                     cu0ngthai.com                 KHONG
cuοngthai.com                     xn--cungthai-0dg.com          KHONG

ma diem cua "cuongthái.com": cuongthU+E1i.com
ma diem cua "cuοngthai.com": cuU+3BFngthai.com

# Dong thu ba doc tu trai sang phai bat dau bang ten mien cua ban va thuoc
# ve dang-nhap.co. Dong cuoi chua mot chu omicron Hy Lap. Ca sau dong deu
# xin duoc chung chi TLS hop le trong vai giay va deu hien o khoa xanh.</div>
<div class="pitfall">
<p><strong>Bẫy — cái ổ khoá chỉ có nghĩa là kết nối được MÃ HOÁ, không hơn.</strong> Chứng chỉ miễn phí được cấp trong vài giây cho bất kỳ ai kiểm soát một tên miền, nên MỌI trang lừa đảo đều có TLS hợp lệ và có ổ khoá. Cả một thế hệ lời khuyên bảo mật đã dạy người dùng đi tìm cái ổ khoá ấy, và điều đó bây giờ GIÚP kẻ tấn công: cái dấu hiệu thị giác duy nhất mà người ta được dạy phải tin thì hiện diện ở CẢ HAI phía. Tín hiệu đáng tin duy nhất là chính cái tên miền đăng ký được, đọc từ PHẢI sang TRÁI — và toàn bộ ý của Bài 7.4 là WebAuthn đọc nó GIÙM người dùng, một cách máy móc, ở mọi lần.</p>
</div>

<h3>Cái gì THẬT SỰ chặn được nó</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Passkey</span><span class="lz-t">Theo CẤU TRÚC, không phải theo xác suất</span><span class="lz-d">Trình duyệt ký cái origin nó đang thật sự đứng (Bài 7.4), nên một chữ ký chuyển tiếp sẽ khai ra tên miền của cái proxy và trượt phép kiểm của bạn — mà ngay từ đầu credential ấy còn chẳng được đưa ra cho tên miền đó. Đây là hàng phòng thủ DUY NHẤT trong bài này không phải là một con số xác suất.</span></div>
  <div class="lz-step"><span class="lz-k">Buộc phiên vào thứ mà proxy KHÔNG có</span><span class="lz-t">Một phần, và đáng làm</span><span class="lz-d">Một cookie gắn với một khoá do client giữ, hoặc tối thiểu là một cảnh báo khi IP và user agent của một phiên đổi đột ngột. Nó không chặn được vụ cắp; nó rút ngắn khoảng thời gian mà cái cookie bị cắp còn dùng được.</span></div>
  <div class="lz-step"><span class="lz-k">Nâng cấp xác thực ở những hành động quan trọng</span><span class="lz-t">Lại là Bài 7.1</span><span class="lz-d">Một phiên bị cắp thì đã ở BÊN TRONG sản phẩm. Đòi xác thực lại trước khi đổi email, thêm một yếu tố hay chuyển tiền nghĩa là kẻ tấn công phải lừa đảo lần THỨ HAI, đúng vào lúc người dùng chẳng hề chờ đợi một lời nhắc nào.</span></div>
  <div class="lz-step"><span class="lz-k">Canh chừng những tên miền nhìn giống</span><span class="lz-t">Phát hiện, không phải phòng ngừa</span><span class="lz-d">Nhật ký minh bạch chứng chỉ công bố MỌI chứng chỉ được cấp, nên một luồng dữ liệu lọc theo những cái tên na ná tên bạn sẽ tìm ra trang lừa đảo ngay trong ngày nó được dựng — thường là trước khi chiến dịch bắt đầu.</span></div>
</div>
<pre><code><span class="tok-comment">// Cảnh báo khi một PHIÊN đột ngột đổi chỗ — không chặn, nhưng phát hiện.</span>
if (session.lastIp &amp;&amp; asn(req.ip) !== asn(session.lastIp)) {
  await recordEvent('session.network_change', { sessionId: session.id, cu: session.lastIp, moi: req.ip });
  if (isSensitiveAction(req)) return requireReauth(req, res);   <span class="tok-comment">// ← Bài 7.1</span>
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đừng chống nó bằng mỗi dấu vân tay thiết bị</span><span class="lz-lnote">Một cái proxy chuyển tiếp chính user agent của nạn nhân và chuyển tiếp được phần lớn những thứ còn lại. Lệch dấu vân tay bắt được những bộ công cụ lười và bỏ sót những bộ hiện hành, nên hãy coi việc KHỚP là không có bằng chứng gì, còn việc LỆCH là một tín hiệu đáng báo động.</span></div>
  <div class="lz-layer"><span class="lz-lname">Khớp số hơn hẳn phê duyệt đẩy trơn</span><span class="lz-lnote">Nếu bạn dùng thông báo đẩy làm một yếu tố thì hãy hiện một con số hai chữ số trên màn hình đăng nhập mà người dùng phải gõ vào ứng dụng. Một cái proxy không cung cấp nổi con số mà nó chưa từng nhìn thấy, và nó cũng dẹp luôn cú tấn công gây mệt mỏi ở Bài 10.4.</span></div>
  <div class="lz-layer"><span class="lz-lname">Phiên ngắn thì bắt kẻ tấn công trả bằng THỜI GIAN</span><span class="lz-lnote">Một cookie bị cắp còn hiệu lực ba mươi ngày là một tháng truy cập; một cái còn hiệu lực một ngày, với refresh token buộc vào thiết bị, là một cửa sổ nhỏ hơn nhiều. Đó không phải cách vá, và nó là một mức giảm bán kính thiệt hại có ý nghĩa.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy cho người ta MỘT CHỖ để báo</span><span class="lz-lnote">Một đường "tôi nghĩ tôi vừa bị lừa đảo" nhìn thấy được, thu hồi mọi phiên NGAY LẬP TỨC, không có hàng đợi hỗ trợ chen giữa. Những người dùng nhận ra sau mười phút chính là bộ cảm biến tốt nhất của bạn, mà phần lớn sản phẩm chẳng cho họ chỗ nào để đi cả.</span></div>
</div>
<div class="callout warn">
<p><strong>Nếu chỉ lấy được MỘT quyết định vận hành từ chương này, hãy lấy cái này: cho QUẢN TRỊ VIÊN đăng ký passkey.</strong> Mọi thứ khác ở đây chỉ giảm xác suất; passkey GỠ BỎ cú tấn công với những tài khoản có nó. Nhóm tài khoản đáng bắt đầu là nhóm mà việc bị chiếm là không cứu vãn được — quản trị viên, tài chính, bất cứ ai đổi được quyền hoặc chuyển được tiền — và với nhóm đó thì bạn BẮT BUỘC được chứ không phải chỉ mời, vì đó là một nhóm nhỏ mà bạn hỗ trợ được từng người. Riêng thay đổi đó bịt con đường chiếm tài khoản số một, ở đúng những tài khoản mà việc bị chiếm gây hại nhất.</p>
</div>
<div class="note-ct">
<p><strong>Hãy cứ giả định rằng nó VẪN sẽ thành công, và thiết kế cho phần sau đó.</strong> Một tỉ lệ nào đó trong số người dùng của bạn sẽ bị lừa đảo dù bạn xây gì đi nữa, nên câu hỏi có ích thôi là "làm sao ngăn chuyện này" và trở thành "chúng ta nhận ra NHANH tới mức nào, và một cái phiên bị cắp THẬT SỰ làm được gì?". Danh sách thiết bị ở Bài 5.4, việc thu hồi ở 5.3, việc nâng cấp xác thực ở 7.1 và phần cảnh báo ở Chương 11 chính là câu trả lời — và chúng là những phần vẫn chạy vào đúng cái ngày mà việc phòng ngừa thì không.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.cisa.gov/sites/default/files/publications/phishing-infographic-508c.pdf" target="_blank" rel="noopener"><span class="lc-ico">🎣</span><span class="lc-body"><span class="lc-title">CISA — bản đồ hoạ về lừa đảo</span><span class="lc-sub">cisa.gov · Các chiến dịch thật sự được dựng thế nào, kèm số liệu</span></span></a>
<a class="link-card" href="https://certificate.transparency.dev/" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">Certificate Transparency</span><span class="lc-sub">certificate.transparency.dev · Mọi chứng chỉ đều công khai — hãy theo dõi những cái tên na ná tên bạn</span></span></a>
<a class="link-card" href="https://fidoalliance.org/passkeys/" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">FIDO Alliance — passkey</span><span class="lc-sub">fidoalliance.org · Lời khẳng định về chống lừa đảo, và nó dựa trên cái gì</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Nền tảng Web</span><span class="lc-sub">Tên miền đăng ký được, punycode, và cách đọc một hostname từ phải sang trái</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chuyển tiếp một lần đăng nhập qua proxy, cắp cái phiên, rồi lặp lại với một passkey</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Session theft: four channels, and what each one can reach|||10.3 — Cắp phiên: bốn kênh, và mỗi kênh với tới được cái gì',
      slug: 'auth-10-3-cap-phien',
      type: 'LESSON',
      description: 'Sau khi đăng nhập xong, thứ đáng cắp là cái PHIÊN. Bài này xếp bốn kênh cắp nó — XSS, một gói phụ thuộc bị nhiễm, mã độc trên máy, và tên miền con bị chiếm — rồi đo THẬT cây phụ thuộc của kho mã này để cho thấy bề mặt tấn công thứ hai lớn tới đâu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Session theft: four channels, and what each one can reach</h2>
<p class="lead">Chapters 3 to 5 issued a session; this lesson is about somebody else obtaining it. It is worth separating from phishing because the countermeasures are entirely different: phishing tricks the user, session theft never involves them at all, and passkeys do nothing to stop it.</p>

<h3>The four channels</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · XSS</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Script running on your origin</span><span class="lz-nsub">Reaches anything JavaScript can read · blocked from an HttpOnly cookie · can still act as the user</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · A dependency</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Code you did not write, shipped by you</span><span class="lz-nsub">Same power as XSS in the browser · in the backend, it can read the signing key itself</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · The device</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Malware, an extension, a shared machine</span><span class="lz-nsub">Reads the cookie jar directly · nothing you build server-side prevents it</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">4 · A subdomain</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Anything under your domain</span><span class="lz-nsub">A cookie scoped to the parent domain is sent to every subdomain, including the abandoned one</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpOnly stops reading, not acting</span><span class="v">A script that cannot read the cookie can still send authenticated requests from the page, because the browser attaches the cookie automatically. It cannot exfiltrate the session for later use, which limits the damage to the time the page is open — a real difference, and not immunity.</span></div>
  <div class="kv"><span class="k">In-memory tokens are better against exfiltration, worse against everything else</span><span class="v">Lesson 4.5's table applies unchanged: nothing readable by JavaScript survives XSS, and a token in memory is readable by JavaScript. The cookie remains the default for the same-origin case.</span></div>
  <div class="kv"><span class="k">Device compromise is out of scope, and worth saying</span><span class="v">If malware runs as the user, it reads the cookie jar and there is no server-side control that prevents it. What you can do is detect the resulting session anomaly and give the user a way to revoke — Lesson 5.4's device list, doing its job.</span></div>
  <div class="kv"><span class="k">Passkeys do not help here at all</span><span class="v">They protect the moment of authentication, which has already happened. This is why Chapter 5's revocation is not made redundant by Chapter 7: one prevents a fake login, the other ends a real session that fell into the wrong hands.</span></div>
</div>

<h3>The dependency channel, measured</h3>
<div class="out"># Cay phu thuoc THAT cua kho ma nay, dem tu package-lock.json:

  backend   package.json    73 dependencies + 21 dev
  backend   package-lock    897 goi trong ca cay
  frontend  package.json    85 dependencies + 11 dev
  frontend  package-lock   1159 goi trong ca cay

# 2.056 goi. Ban da doc mao dich vu cua bao nhieu cai trong so do?
# Moi goi CHAY TRONG TRINH DUYET deu co quyen y het mot cu XSS.
# Moi goi chay o BACKEND deu doc duoc process.env — tuc la khoa ky.</div>
<div class="pitfall">
<p><strong>Trap — a compromised frontend package has exactly the power of a stored XSS, on every page, forever.</strong> It does not need a vulnerability in your code; you installed it and shipped it yourself. A backend package is worse: it runs with your process's privileges and can read <code>process.env</code>, which holds the JWT signing key from Lesson 4.4 and the database URL. The practical defences are unglamorous — pin exact versions with a lockfile, enable a scanner in CI, avoid packages with one maintainer and no releases for two years, and be suspicious of a new transitive dependency appearing in a routine update. And treat <code>postinstall</code> scripts as code you are choosing to run, because they are.</p>
</div>

<h3>Subdomains, and the cookie scope that invites them</h3>
<pre><code><span class="tok-comment">// Cookie này đi tới MỌI tên miền con, kể cả cái bạn đã quên:</span>
Set-Cookie: session=…; Domain=.cuongthai.com; Secure; HttpOnly

<span class="tok-comment">// Cookie này KHÔNG:</span>
Set-Cookie: session=…; Secure; HttpOnly            <span class="tok-comment">// ← không có Domain = chỉ host này</span>

<span class="tok-comment">// blog cu.cuongthai.com tro CNAME toi mot bucket da xoa ⇒ ai dang ky lai</span>
<span class="tok-comment">// cai bucket do se nhan duoc cookie phien cua moi nguoi dung ghe qua.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Omit Domain unless you need it</span><span class="lz-t">A one-word change</span><span class="lz-d">Without <code>Domain</code>, the cookie is scoped to the exact host that set it. With it, every current and future subdomain receives it — including one somebody sets up next year on a platform you do not control.</span></div>
  <div class="lz-step"><span class="lz-k">Subdomain takeover is common and cheap</span><span class="lz-t">A dangling DNS record</span><span class="lz-d">A CNAME pointing at a cloud resource that was deleted can be claimed by whoever registers that resource name next. Audit your DNS for records pointing at services you no longer use — it is a one-off script and it finds things.</span></div>
  <div class="lz-step"><span class="lz-k">__Host- makes the rule enforceable</span><span class="lz-t">The browser checks it</span><span class="lz-d">A cookie named <code>__Host-session</code> is rejected by the browser unless it is <code>Secure</code>, has <code>Path=/</code> and has <em>no</em> <code>Domain</code> attribute. It turns your intention into something a misconfiguration cannot quietly undo.</span></div>
  <div class="lz-step"><span class="lz-k">User content belongs on another registrable domain</span><span class="lz-t">Not a subdomain</span><span class="lz-d">If you host uploads, previews or customer pages, serve them from a separate domain entirely. On a subdomain they share your cookie scope and much of your origin's trust; on another domain they share nothing.</span></div>
</div>

<h3>Detecting a stolen session, and ending it</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Two places at once is the clearest signal</span><span class="lz-lnote">One session making requests from two networks minutes apart is either a stolen cookie or a user on a train. Log it, show it in the device list, and require re-authentication before anything sensitive rather than blocking outright — false positives here are constant.</span></div>
  <div class="lz-layer"><span class="lz-lname">Refresh-token reuse is the highest-quality alert you have</span><span class="lz-lnote">Lesson 5.2's detection fires when a used token is presented again, which is exactly what happens when a stolen token is used alongside the real one. Unlike every heuristic in this lesson, it is close to a proof — and Lesson 5.5's grace window is what keeps it from crying wolf.</span></div>
  <div class="lz-layer"><span class="lz-lname">Revoke everything, then let them back in</span><span class="lz-lnote">On credible evidence, end every session (Lesson 5.3), force a password reset, and mail the account. Half measures leave the attacker holding one of the sessions you did not think to kill.</span></div>
  <div class="lz-layer"><span class="lz-lname">Short access tokens are what make revocation fast</span><span class="lz-lnote">The gap between "revoked" and "actually locked out" is the access-token lifetime you chose in Lesson 5.1. This is the incident where that number stops being theoretical, and where fifteen minutes reads very differently from twenty-four hours.</span></div>
</div>
<div class="note-ct">
<p><strong>The defence in depth here is mostly Chapter 3 and Chapter 5, already built.</strong> <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code> and a <code>__Host-</code> prefix cost nothing and remove the easy versions of channels one and four. A strict Content-Security-Policy limits where a successful XSS can send what it steals. Short access tokens plus rotation plus reuse detection turn a stolen session from permanent access into a window with an alarm on it. None of that prevents theft on a compromised device — nothing does — so the last line is the one users can pull themselves: a device list they can read and a revoke button that works immediately.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — session management</span><span class="lc-sub">cheatsheetseries.owasp.org · Cookie attributes and session-binding options</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#cookie_prefixes" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — cookie prefixes</span><span class="lc-sub">developer.mozilla.org · What __Host- and __Secure- make the browser enforce</span></span></a>
<a class="link-card" href="https://owasp.org/www-project-top-ten/2021/A06_2021-Vulnerable_and_Outdated_Components" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">OWASP A06 — vulnerable and outdated components</span><span class="lc-sub">owasp.org · The dependency channel, ranked</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Lockfiles, npm audit, and what postinstall scripts are allowed to do</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Steal a session four ways, then add HttpOnly, __Host- and a CSP and see which ones still work</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Cắp phiên: bốn kênh, và mỗi kênh với tới được cái gì</h2>
<p class="lead">Chương 3 tới 5 đã phát ra một cái phiên; bài này nói về việc NGƯỜI KHÁC có được nó. Đáng tách riêng khỏi lừa đảo vì các biện pháp đối phó hoàn toàn khác nhau: lừa đảo thì lừa NGƯỜI DÙNG, còn cắp phiên thì chẳng dính tới họ chút nào, và passkey chẳng làm được gì để chặn nó.</p>

<h3>Bốn cái kênh</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · XSS</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Script chạy trên chính origin của bạn</span><span class="lz-nsub">Với tới mọi thứ JavaScript đọc được · bị chặn khỏi cookie HttpOnly · nhưng vẫn HÀNH ĐỘNG được với tư cách người dùng</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · Một gói phụ thuộc</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mã bạn không viết, mà chính bạn đưa lên</span><span class="lz-nsub">Cùng sức mạnh với XSS ở trình duyệt · còn ở backend, nó đọc được cả khoá ký</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · Thiết bị</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mã độc, một tiện ích mở rộng, một máy dùng chung</span><span class="lz-nsub">Đọc thẳng kho cookie · không thứ gì bạn dựng ở phía máy chủ ngăn được</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">4 · Một tên miền con</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bất cứ thứ gì nằm dưới tên miền của bạn</span><span class="lz-nsub">Cookie đặt phạm vi ở tên miền cha thì được gửi tới MỌI tên miền con, kể cả cái đã bỏ hoang</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpOnly chặn việc ĐỌC, không chặn việc HÀNH ĐỘNG</span><span class="v">Một script không đọc được cookie thì vẫn gửi được các request đã xác thực từ chính trang đó, vì trình duyệt tự đính kèm cookie. Nó không mang được cái phiên ra ngoài để dùng về sau, tức là giới hạn thiệt hại trong khoảng thời gian trang còn mở — một khác biệt THẬT, và không phải sự miễn nhiễm.</span></div>
  <div class="kv"><span class="k">Token trong bộ nhớ thì chống mang-ra-ngoài tốt hơn, và tệ hơn ở mọi mặt khác</span><span class="v">Bảng ở Bài 4.5 áp nguyên: không thứ gì JavaScript đọc được sống sót qua XSS, mà một token trong bộ nhớ thì JavaScript đọc được. Cookie vẫn là mặc định cho trường hợp cùng origin.</span></div>
  <div class="kv"><span class="k">Thiết bị bị xâm nhập nằm NGOÀI phạm vi, và đáng nói thẳng</span><span class="v">Nếu mã độc chạy với quyền của người dùng thì nó đọc kho cookie và không có biện pháp phía máy chủ nào ngăn được. Cái bạn LÀM ĐƯỢC là phát hiện sự bất thường của phiên sau đó và cho người dùng một đường thu hồi — chính là danh sách thiết bị ở Bài 5.4, đang làm đúng việc của nó.</span></div>
  <div class="kv"><span class="k">Passkey ở đây KHÔNG giúp được gì cả</span><span class="v">Chúng bảo vệ KHOẢNH KHẮC xác thực, mà khoảnh khắc đó đã trôi qua rồi. Đó là lý do việc thu hồi ở Chương 5 KHÔNG bị Chương 7 làm cho thừa: một cái chặn một lần đăng nhập giả, cái kia kết thúc một phiên THẬT vừa rơi vào tay sai.</span></div>
</div>

<h3>Kênh phụ thuộc, đo thật</h3>
<div class="out"># Cay phu thuoc THAT cua kho ma nay, dem tu package-lock.json:

  backend   package.json    73 dependencies + 21 dev
  backend   package-lock    897 goi trong ca cay
  frontend  package.json    85 dependencies + 11 dev
  frontend  package-lock   1159 goi trong ca cay

# 2.056 goi. Ban da doc mao dich vu cua bao nhieu cai trong so do?
# Moi goi CHAY TRONG TRINH DUYET deu co quyen y het mot cu XSS.
# Moi goi chay o BACKEND deu doc duoc process.env — tuc la khoa ky.</div>
<div class="pitfall">
<p><strong>Bẫy — một gói frontend bị nhiễm có ĐÚNG sức mạnh của một cú XSS lưu trữ, trên MỌI trang, MÃI MÃI.</strong> Nó chẳng cần một lỗ hổng nào trong mã của bạn; chính bạn đã cài nó và chính bạn đưa nó lên. Một gói backend còn tệ hơn: nó chạy với đặc quyền của tiến trình của bạn và đọc được <code>process.env</code>, nơi đang giữ khoá ký JWT ở Bài 4.4 và cả chuỗi kết nối cơ sở dữ liệu. Các biện pháp thực tế thì chẳng hào nhoáng gì — ghim phiên bản chính xác bằng lockfile, bật một bộ quét trong CI, tránh những gói chỉ có một người bảo trì và hai năm không ra bản mới, và hãy nghi ngờ một gói phụ thuộc gián tiếp MỚI bỗng xuất hiện trong một lần cập nhật thường lệ. Và hãy coi các script <code>postinstall</code> là MÃ MÀ BẠN ĐANG CHỌN CHẠY, vì chúng đúng là như vậy.</p>
</div>

<h3>Tên miền con, và cái phạm vi cookie mời gọi chúng</h3>
<pre><code><span class="tok-comment">// Cookie này đi tới MỌI tên miền con, kể cả cái bạn đã quên:</span>
Set-Cookie: session=…; Domain=.cuongthai.com; Secure; HttpOnly

<span class="tok-comment">// Cookie này KHÔNG:</span>
Set-Cookie: session=…; Secure; HttpOnly            <span class="tok-comment">// ← không có Domain = chỉ host này</span>

<span class="tok-comment">// blog cu.cuongthai.com tro CNAME toi mot bucket da xoa ⇒ ai dang ky lai</span>
<span class="tok-comment">// cai bucket do se nhan duoc cookie phien cua moi nguoi dung ghe qua.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bỏ Domain đi trừ khi bạn CẦN nó</span><span class="lz-t">Một thay đổi đúng một từ</span><span class="lz-d">Không có <code>Domain</code> thì cookie chỉ thuộc phạm vi đúng cái host đã đặt nó. Có nó thì MỌI tên miền con hiện tại và TƯƠNG LAI đều nhận được — kể cả cái mà sang năm ai đó dựng lên trên một nền tảng bạn không kiểm soát.</span></div>
  <div class="lz-step"><span class="lz-k">Chiếm tên miền con là chuyện phổ biến và rẻ</span><span class="lz-t">Một bản ghi DNS bỏ lửng</span><span class="lz-d">Một bản ghi CNAME trỏ tới một tài nguyên đám mây đã bị xoá thì ai đăng ký lại đúng cái tên tài nguyên ấy sẽ nhận được nó. Hãy soát DNS tìm những bản ghi trỏ tới các dịch vụ bạn không còn dùng — đó là một cái script chạy một lần, và nó thường tìm ra thứ gì đó.</span></div>
  <div class="lz-step"><span class="lz-k">__Host- biến cái luật đó thành thứ THI HÀNH được</span><span class="lz-t">Trình duyệt tự kiểm</span><span class="lz-d">Một cookie tên <code>__Host-session</code> sẽ bị trình duyệt TỪ CHỐI trừ khi nó có <code>Secure</code>, có <code>Path=/</code> và KHÔNG có thuộc tính <code>Domain</code>. Nó biến ý định của bạn thành thứ mà một lần cấu hình sai không lặng lẽ tháo bỏ được.</span></div>
  <div class="lz-step"><span class="lz-k">Nội dung người dùng thuộc về một TÊN MIỀN KHÁC</span><span class="lz-t">Không phải một tên miền con</span><span class="lz-d">Nếu bạn phục vụ tệp tải lên, bản xem trước hay trang của khách hàng thì hãy đưa chúng sang một tên miền hoàn toàn riêng. Nằm trên tên miền con thì chúng dùng chung phạm vi cookie của bạn và phần lớn sự tin cậy của origin; nằm trên tên miền khác thì chúng chẳng chung gì cả.</span></div>
</div>

<h3>Phát hiện một phiên bị cắp, và kết thúc nó</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Xuất hiện ở HAI nơi cùng lúc là tín hiệu rõ nhất</span><span class="lz-lnote">Một phiên gửi request từ hai mạng cách nhau vài phút thì hoặc là một cookie bị cắp, hoặc là một người dùng đang ngồi trên tàu. Hãy ghi log lại, hiện nó trong danh sách thiết bị, và ĐÒI XÁC THỰC LẠI trước bất cứ việc gì nhạy cảm thay vì chặn thẳng — cảnh báo giả ở đây là chuyện thường xuyên.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tái dùng refresh token là cảnh báo CHẤT LƯỢNG NHẤT bạn có</span><span class="lz-lnote">Phép phát hiện ở Bài 5.2 nổ ra khi một token đã dùng lại được trình ra, và đó CHÍNH LÀ chuyện xảy ra khi một token bị cắp được dùng song song với cái thật. Khác với mọi phép suy đoán trong bài này, nó gần như là một BẰNG CHỨNG — và cửa sổ ân hạn ở Bài 5.5 là thứ giữ cho nó không kêu oan.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thu hồi TẤT CẢ, rồi mới cho họ vào lại</span><span class="lz-lnote">Khi có bằng chứng đáng tin, hãy kết thúc MỌI phiên (Bài 5.3), ép đặt lại mật khẩu, và gửi thư báo về tài khoản. Nửa vời thì để lại cho kẻ tấn công đúng một cái phiên mà bạn quên mất chưa giết.</span></div>
  <div class="lz-layer"><span class="lz-lname">Access token NGẮN là thứ làm cho việc thu hồi trở nên NHANH</span><span class="lz-lnote">Khoảng cách giữa "đã thu hồi" và "thật sự bị khoá ra ngoài" chính là cái tuổi thọ access token bạn đã chọn ở Bài 5.1. Đây là sự cố mà con số ấy thôi còn là lý thuyết, và là chỗ mà mười lăm phút đọc lên nghe rất khác hai mươi bốn giờ.</span></div>
</div>
<div class="note-ct">
<p><strong>Phòng thủ theo lớp ở đây phần lớn là Chương 3 và Chương 5, vốn đã dựng xong.</strong> <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code> và tiền tố <code>__Host-</code> chẳng tốn gì và gỡ bỏ những phiên bản DỄ của kênh một và kênh bốn. Một Content-Security-Policy chặt giới hạn nơi mà một cú XSS thành công gửi được thứ nó vừa cắp. Access token ngắn cộng xoay vòng cộng phát hiện tái dùng biến một phiên bị cắp từ quyền truy cập vĩnh viễn thành một cửa sổ có gắn chuông báo. Chẳng thứ nào trong đó ngăn được vụ cắp trên một thiết bị đã bị xâm nhập — không thứ gì ngăn được — nên tuyến cuối là tuyến mà chính người dùng tự kéo được: một danh sách thiết bị họ đọc được và một cái nút thu hồi có tác dụng ngay lập tức.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — quản lý phiên</span><span class="lc-sub">cheatsheetseries.owasp.org · Các thuộc tính cookie và các cách buộc phiên</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#cookie_prefixes" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — tiền tố cookie</span><span class="lc-sub">developer.mozilla.org · __Host- và __Secure- bắt trình duyệt thi hành điều gì</span></span></a>
<a class="link-card" href="https://owasp.org/www-project-top-ten/2021/A06_2021-Vulnerable_and_Outdated_Components" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">OWASP A06 — thành phần lỗi thời và có lỗ hổng</span><span class="lc-sub">owasp.org · Kênh phụ thuộc, được xếp hạng</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Lockfile, npm audit, và script postinstall được phép làm những gì</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Cắp một cái phiên bằng bốn cách, rồi thêm HttpOnly, __Host- và CSP vào xem cách nào còn chạy</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — Attacking the human layer: fatigue, the help desk, and the carrier|||10.4 — Đánh vào tầng CON NGƯỜI: mệt mỏi, bàn hỗ trợ, và nhà mạng',
      slug: 'auth-10-4-tang-con-nguoi',
      type: 'LESSON',
      description: 'Ba cú tấn công không hề chạm vào mã của bạn: ném thông báo đẩy tới khi có người bấm nhầm, gọi cho bàn hỗ trợ và xin thu hồi MFA, và thuyết phục nhà mạng chuyển số điện thoại. Bài này tính ra xác suất của cú thứ nhất bằng số thật, rồi vá cả ba bằng những thứ đều là QUY TRÌNH chứ không phải mã.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Attacking the human layer: fatigue, the help desk, and the carrier</h2>
<p class="lead">Every previous lesson attacked a system. These three attack a person — a tired user at eleven at night, a support agent under a queue-length target, a call-centre operator at a phone company you have no relationship with. None of them can be fixed by writing better code, and all three are among the most successful account-takeover techniques currently in use.</p>

<h3>Push fatigue, in numbers</h3>
<div class="out">Nem thong bao day (push bombing): xac suat co IT NHAT MOT lan chap nhan nham

 so lan nem   p=0,5%     p=2%     p=5%   + khop so 2 chu so
          1     0.5%     2.0%     5.0%           1.00%
          5     2.5%     9.6%    22.6%           2.97%
         10     4.9%    18.3%    40.1%           2.97%
         25    11.8%    39.7%    72.3%           2.97%
         50    22.2%    63.6%    92.3%           2.97%
        100    39.4%    86.7%    99.4%           2.97%

p = xac suat mot nguoi dung MET MOI bam "Chap nhan" cho MOT loi nhac khong ro rang.
Cot cuoi: co khop so, nguoi dung KHONG NHIN THAY con so cua ke tan cong nen chi
doan duoc 1/100 — va ban trien khai that khoa lai sau 3 lan go sai, nen ca mot dot
nem 100 lan cung chi con toi da 3 lan doan.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The attacker already has the password</span><span class="v">Push bombing only starts once the first factor is solved, so it is the second half of a credential-stuffing or phishing success. The prompts are free to send, and they can send them at three in the morning.</span></div>
  <div class="kv"><span class="k">A one-in-fifty slip becomes near-certain at scale</span><span class="v">Even a very disciplined user with a half-percent slip rate is at forty percent after a hundred prompts — and a hundred prompts costs the attacker nothing. Any defence framed as "users should not approve unexpected prompts" is arguing with that table.</span></div>
  <div class="kv"><span class="k">Number matching closes it structurally</span><span class="v">The user must type a two-digit number displayed on the sign-in screen — which they are not looking at, because they are not signing in. There is no button to press by mistake, and the residual is a one-in-a-hundred guess capped by a wrong-entry limit.</span></div>
  <div class="kv"><span class="k">Also cap the prompts and alert on the burst</span><span class="v">Three pending approvals per account per hour, and a denied prompt should count as a security event. A burst of push requests is one of the clearest "this password is compromised" signals you will ever get — treat it like Lesson 7.3's failure burst.</span></div>
</div>
<pre><code><span class="tok-comment">// Khớp số: con số hiện trên MÀN HÌNH ĐĂNG NHẬP, người dùng GÕ nó vào app.</span>
const so = String(randomInt(10, 100));                <span class="tok-comment">// hai chữ số</span>
await redis.set(&#96;push:\${sessionId}&#96;, JSON.stringify({ count, wrong: 0 }), { EX: 120 });
showOnSignInScreen(count);                          <span class="tok-comment">// ← kẻ tấn công thấy cái này</span>
sendPush(u, 'Nhập số hiện trên màn hình đăng nhập');  <span class="tok-comment">// ← nạn nhân KHÔNG thấy</span>

<span class="tok-comment">// Sai 3 lần là huỷ, và đó là một sự kiện bảo mật.</span>
if (++state.sai &gt;= 3) { await revoke(sessionId); await warn(u, 'push.error_margin'); }</code></pre>

<h3>The help desk, which is the real back door</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The script</span><span class="lz-t">Urgency plus plausibility</span><span class="lz-d">"I'm travelling, my phone was stolen, I have a board meeting in ten minutes." The details are researched from a public profile, the tone is apologetic, and the agent is measured on resolution time. This is not a hard performance to give.</span></div>
  <div class="lz-step"><span class="lz-k">The ask</span><span class="lz-t">Never "reset my password"</span><span class="lz-d">It is "remove my MFA device" or "change the email on the account" — the steps that turn a locked-out stranger into a normal password reset five minutes later, through your own front door.</span></div>
  <div class="lz-step"><span class="lz-k">Why knowledge questions fail</span><span class="lz-t">The answers are public</span><span class="lz-d">Date of birth, address, last four digits, mother's maiden name, recent order — all of it is in a breach corpus or a social media profile. A question whose answer can be looked up is not authentication, it is a quiz.</span></div>
  <div class="lz-step"><span class="lz-k">What actually works</span><span class="lz-t">Out-of-band, and slow on purpose</span><span class="lz-d">A code sent to the address on file, a callback to the number on file, approval from a manager in the customer's own organisation, or a verified payment method. Each proves control of something the caller must already have.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — every control in Chapter 7 is worth exactly as much as the help desk's ability to bypass it.</strong> Passkeys, TOTP, recovery codes, a four-rung ladder — all of it is undone by one agent who can disable MFA after two questions, because that path is faster and it is documented in an internal tool. Write the procedure down, require a second person for high-value accounts, make every bypass produce an audit entry and a mail to the account owner, and give agents an explicit, blameless right to refuse and escalate. And then test it: have somebody outside the team call in and try. Most organisations discover their real authentication strength in that phone call.</p>
</div>

<h3>SIM swap, and why it is not your bug to fix</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The attack is at the carrier, not at you</span><span class="lz-lnote">Somebody persuades a phone company to move a number to a new SIM — through social engineering, a bribed employee, or a stolen port-out PIN. Every SMS code then arrives at the attacker's phone, and nothing in your codebase participated.</span></div>
  <div class="lz-layer"><span class="lz-lname">It is targeted, which changes the risk profile</span><span class="lz-lnote">Unlike stuffing, this costs effort per victim, so it is aimed at accounts worth the trouble: cryptocurrency, high-value commerce, administrators, public figures. For those accounts SMS is not an acceptable sole factor at any threshold.</span></div>
  <div class="lz-layer"><span class="lz-lname">Never let SMS be the recovery for a stronger factor</span><span class="lz-lnote">A passkey account with "lost your key? we'll text you" has the security of SMS. This is Lesson 7.3's ladder rule stated for the specific case that catches people out most often.</span></div>
  <div class="lz-layer"><span class="lz-lname">A recently changed number is a real signal</span><span class="lz-lnote">Some carriers expose a SIM-swap or number-porting date through an API. Where it is available, refusing SMS delivery to a number that changed SIMs in the last seventy-two hours removes most of this attack for a small amount of integration work.</span></div>
</div>

<h3>The pattern under all three</h3>
<div class="callout warn">
<p><strong>Each of these attacks converts a human decision into an authentication decision, and humans are not built to make that decision under pressure.</strong> The user approving a prompt has no context about who requested it. The support agent has no way to verify a claim and a metric that rewards resolving it. The carrier employee has no relationship with your product at all. So the defence is never "train them harder" — it is removing the decision: number matching gives the user something to <em>do</em> rather than something to judge, a written procedure gives the agent a rule instead of a judgement call, and not using SMS as a factor removes the carrier from your threat model entirely. Where a human decision remains, make it slow, make it require two people, and make it leave a trail.</p>
</div>
<div class="note-ct">
<p><strong>Write the account-recovery procedure as a document with a version number.</strong> Who may approve what, which evidence counts, which accounts require two approvers, and what gets logged and mailed. Then review it after every incident. It is the least technical artefact in this entire course and it is the one most likely to be the reason an attacker succeeds or fails — because unlike your code, it is the part that a stranger can talk to.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-mfa-number-match" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">Microsoft — MFA number matching</span><span class="lc-sub">learn.microsoft.com · Why it was made mandatory, and what it replaced</span></span></a>
<a class="link-card" href="https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">CISA — implementing phishing-resistant MFA</span><span class="lc-sub">cisa.gov · Push fatigue and SIM swap, with the recommended responses</span></span></a>
<a class="link-card" href="https://www.fcc.gov/consumers/guides/protect-yourself-sim-swap-scams" target="_blank" rel="noopener"><span class="lc-ico">📱</span><span class="lc-body"><span class="lc-title">FCC — SIM swap</span><span class="lc-sub">fcc.gov · How the port-out actually happens at the carrier</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">Writing a runbook people actually follow, and keeping it in version control</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Send a hundred approval prompts, then add number matching and try again</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Đánh vào tầng CON NGƯỜI: mệt mỏi, bàn hỗ trợ, và nhà mạng</h2>
<p class="lead">Mọi bài trước đều tấn công một HỆ THỐNG. Ba cú này tấn công một CON NGƯỜI — một người dùng mệt mỏi lúc mười một giờ đêm, một bạn hỗ trợ đang chịu chỉ tiêu về độ dài hàng đợi, một nhân viên tổng đài ở một công ty viễn thông mà bạn chẳng có quan hệ gì. Không cú nào vá được bằng cách viết mã tốt hơn, và cả ba đều nằm trong nhóm kỹ thuật chiếm tài khoản THÀNH CÔNG nhất hiện nay.</p>

<h3>Mệt mỏi vì thông báo đẩy, tính bằng số</h3>
<div class="out">Nem thong bao day (push bombing): xac suat co IT NHAT MOT lan chap nhan nham

 so lan nem   p=0,5%     p=2%     p=5%   + khop so 2 chu so
          1     0.5%     2.0%     5.0%           1.00%
          5     2.5%     9.6%    22.6%           2.97%
         10     4.9%    18.3%    40.1%           2.97%
         25    11.8%    39.7%    72.3%           2.97%
         50    22.2%    63.6%    92.3%           2.97%
        100    39.4%    86.7%    99.4%           2.97%

p = xac suat mot nguoi dung MET MOI bam "Chap nhan" cho MOT loi nhac khong ro rang.
Cot cuoi: co khop so, nguoi dung KHONG NHIN THAY con so cua ke tan cong nen chi
doan duoc 1/100 — va ban trien khai that khoa lai sau 3 lan go sai, nen ca mot dot
nem 100 lan cung chi con toi da 3 lan doan.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Kẻ tấn công ĐÃ CÓ mật khẩu rồi</span><span class="v">Ném thông báo đẩy chỉ bắt đầu SAU khi yếu tố thứ nhất đã bị hạ, nên nó là nửa sau của một cú nhồi tín vật hoặc một cú lừa đảo thành công. Gửi các lời nhắc thì miễn phí, và họ gửi được vào lúc ba giờ sáng.</span></div>
  <div class="kv"><span class="k">Một cú trượt tay một-phần-năm-mươi trở thành gần như chắc chắn ở quy mô lớn</span><span class="v">Ngay cả một người dùng rất kỷ luật với tỉ lệ trượt tay nửa phần trăm cũng ở mức bốn mươi phần trăm sau một trăm lời nhắc — mà một trăm lời nhắc chẳng tốn của kẻ tấn công đồng nào. Mọi hàng phòng thủ diễn đạt thành "người dùng không nên phê duyệt những lời nhắc bất ngờ" đều đang cãi nhau với cái bảng kia.</span></div>
  <div class="kv"><span class="k">Khớp số bịt nó theo CẤU TRÚC</span><span class="v">Người dùng phải GÕ một con số hai chữ số hiện trên MÀN HÌNH ĐĂNG NHẬP — thứ mà họ không hề nhìn vào, vì họ có đăng nhập đâu. Chẳng có cái nút nào để bấm nhầm cả, và phần dư lại là một cú đoán một-phần-trăm bị chặn bởi trần số lần gõ sai.</span></div>
  <div class="kv"><span class="k">Và hãy đặt trần số lời nhắc, kèm cảnh báo khi có tràng</span><span class="v">Ba lời nhắc đang chờ cho mỗi tài khoản mỗi giờ, và một lời nhắc bị TỪ CHỐI phải được tính là một sự kiện bảo mật. Một tràng yêu cầu đẩy là một trong những tín hiệu "mật khẩu này đã bị lộ" rõ nhất mà bạn từng có — hãy đối xử với nó như tràng thất bại ở Bài 7.3.</span></div>
</div>
<pre><code><span class="tok-comment">// Khớp số: con số hiện trên MÀN HÌNH ĐĂNG NHẬP, người dùng GÕ nó vào app.</span>
const so = String(randomInt(10, 100));                <span class="tok-comment">// hai chữ số</span>
await redis.set(&#96;push:\${sessionId}&#96;, JSON.stringify({ count, wrong: 0 }), { EX: 120 });
showOnSignInScreen(count);                          <span class="tok-comment">// ← kẻ tấn công thấy cái này</span>
sendPush(u, 'Nhập số hiện trên màn hình đăng nhập');  <span class="tok-comment">// ← nạn nhân KHÔNG thấy</span>

<span class="tok-comment">// Sai 3 lần là huỷ, và đó là một sự kiện bảo mật.</span>
if (++state.sai &gt;= 3) { await revoke(sessionId); await warn(u, 'push.error_margin'); }</code></pre>

<h3>Bàn hỗ trợ, cánh cửa sau THẬT SỰ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Kịch bản</span><span class="lz-t">Gấp gáp cộng với hợp lý</span><span class="lz-d">"Tôi đang đi công tác, điện thoại vừa bị trộm, mười phút nữa tôi có họp hội đồng quản trị." Các chi tiết được tra ra từ một hồ sơ công khai, giọng điệu thì áy náy, còn bạn hỗ trợ thì bị đo bằng thời gian xử lý. Đây không phải một vai diễn khó.</span></div>
  <div class="lz-step"><span class="lz-k">Lời đề nghị</span><span class="lz-t">Không bao giờ là "đặt lại mật khẩu giúp tôi"</span><span class="lz-d">Mà là "gỡ thiết bị MFA giúp tôi" hoặc "đổi email của tài khoản giúp tôi" — những bước biến một người lạ đang bị khoá ngoài thành một cú đặt lại mật khẩu BÌNH THƯỜNG năm phút sau, qua chính cửa trước của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Vì sao câu hỏi kiến thức thất bại</span><span class="lz-t">Câu trả lời là thứ CÔNG KHAI</span><span class="lz-d">Ngày sinh, địa chỉ, bốn số cuối, tên thời con gái của mẹ, đơn hàng gần nhất — tất cả đều nằm trong một kho rò rỉ hoặc một hồ sơ mạng xã hội. Một câu hỏi mà câu trả lời TRA RA ĐƯỢC thì không phải xác thực, đó là một câu đố vui.</span></div>
  <div class="lz-step"><span class="lz-k">Cái THẬT SỰ có tác dụng</span><span class="lz-t">Ngoài băng, và chậm một cách có chủ ý</span><span class="lz-d">Một mã gửi tới địa chỉ đang lưu, một cú gọi lại vào số đang lưu, một phê duyệt từ quản lý trong chính tổ chức của khách hàng, hoặc một phương thức thanh toán đã xác minh. Mỗi cái đều chứng minh quyền kiểm soát một thứ mà người gọi BUỘC PHẢI có sẵn.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — mọi biện pháp ở Chương 7 đáng giá ĐÚNG BẰNG khả năng bàn hỗ trợ đi vòng qua chúng.</strong> Passkey, TOTP, mã khôi phục, một cái thang bốn nấc — tất cả bị tháo bỏ bởi MỘT bạn nhân viên có thể tắt MFA sau hai câu hỏi, vì con đường đó nhanh hơn và nó được ghi trong một công cụ nội bộ hẳn hoi. Hãy viết quy trình ra giấy, đòi NGƯỜI THỨ HAI cho những tài khoản giá trị cao, bắt mọi lần đi vòng phải sinh ra một bản ghi kiểm toán và một lá thư gửi chủ tài khoản, và trao cho nhân viên quyền TỪ CHỐI và chuyển cấp một cách tường minh, không bị trách. Rồi hãy ĐI KIỂM THỬ nó: nhờ một người ngoài đội gọi vào và thử xem. Phần lớn tổ chức phát hiện ra độ mạnh xác thực THẬT của mình chính trong cuộc gọi ấy.</p>
</div>

<h3>Tráo SIM, và vì sao đó không phải con lỗi của bạn để mà vá</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cú tấn công nằm ở NHÀ MẠNG, không nằm ở bạn</span><span class="lz-lnote">Ai đó thuyết phục một công ty viễn thông chuyển một số điện thoại sang SIM mới — bằng thao túng tâm lý, bằng một nhân viên bị mua chuộc, hoặc bằng một mã PIN chuyển mạng bị cắp. Từ đó mọi mã SMS đều tới điện thoại của kẻ tấn công, và chẳng dòng mã nào của bạn tham gia vào việc đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó NHẮM ĐÍCH, và điều đó đổi hẳn hồ sơ rủi ro</span><span class="lz-lnote">Khác với nhồi tín vật, cú này tốn công cho TỪNG nạn nhân, nên nó nhắm vào những tài khoản đáng bỏ công: tiền mã hoá, thương mại giá trị cao, quản trị viên, người nổi tiếng. Với những tài khoản đó, SMS không phải yếu tố duy nhất chấp nhận được ở BẤT KỲ ngưỡng nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đừng bao giờ để SMS làm đường KHÔI PHỤC cho một yếu tố mạnh hơn</span><span class="lz-lnote">Một tài khoản dùng passkey đi kèm câu "mất khoá à? chúng tôi nhắn tin cho bạn" thì có độ an toàn của SMS. Đây là luật cái thang ở Bài 7.3, phát biểu cho đúng cái trường hợp cụ thể hay hạ người ta nhất.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một số điện thoại VỪA ĐỔI là một tín hiệu THẬT</span><span class="lz-lnote">Vài nhà mạng công bố ngày tráo SIM hoặc ngày chuyển mạng qua một API. Ở đâu có nó, việc từ chối gửi SMS tới một số vừa đổi SIM trong bảy mươi hai giờ qua sẽ gỡ được phần lớn cú tấn công này với một lượng công tích hợp nhỏ.</span></div>
</div>

<h3>Cái quy luật nằm dưới cả ba</h3>
<div class="callout warn">
<p><strong>Mỗi cú tấn công trong số này đều biến một QUYẾT ĐỊNH CỦA CON NGƯỜI thành một quyết định XÁC THỰC, mà con người thì không được cấu tạo để ra quyết định ấy dưới áp lực.</strong> Người dùng bấm phê duyệt chẳng có bối cảnh nào về việc AI đã yêu cầu nó. Bạn hỗ trợ chẳng có cách nào kiểm chứng một lời khai và lại có một chỉ số thưởng cho việc giải quyết nhanh. Nhân viên nhà mạng thì chẳng có quan hệ gì với sản phẩm của bạn cả. Nên hàng phòng thủ không bao giờ là "đào tạo họ kỹ hơn" — mà là GỠ BỎ cái quyết định ấy: khớp số cho người dùng một việc để <em>LÀM</em> thay vì một điều để phán xét, một quy trình bằng văn bản cho nhân viên một cái LUẬT thay vì một lần cân nhắc, và việc không dùng SMS làm yếu tố thì gỡ hẳn nhà mạng ra khỏi mô hình đe doạ của bạn. Chỗ nào còn lại một quyết định của con người thì hãy làm cho nó CHẬM, đòi HAI người, và để lại DẤU VẾT.</p>
</div>
<div class="note-ct">
<p><strong>Hãy viết quy trình khôi phục tài khoản thành một tài liệu CÓ SỐ PHIÊN BẢN.</strong> Ai được duyệt cái gì, bằng chứng nào được tính, tài khoản nào cần hai người duyệt, và cái gì được ghi log và gửi thư. Rồi hãy xem lại nó sau MỌI sự cố. Đó là hiện vật ít tính kỹ thuật nhất trong cả khoá học này và cũng là thứ có khả năng cao nhất trở thành lý do một kẻ tấn công thành công hay thất bại — vì khác với mã của bạn, đó là phần mà một người lạ có thể NÓI CHUYỆN được.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-mfa-number-match" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">Microsoft — khớp số cho MFA</span><span class="lc-sub">learn.microsoft.com · Vì sao nó bị bắt buộc, và nó thay thế cái gì</span></span></a>
<a class="link-card" href="https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">CISA — triển khai MFA chống lừa đảo</span><span class="lc-sub">cisa.gov · Mệt mỏi vì thông báo đẩy và tráo SIM, kèm phản ứng khuyến nghị</span></span></a>
<a class="link-card" href="https://www.fcc.gov/consumers/guides/protect-yourself-sim-swap-scams" target="_blank" rel="noopener"><span class="lc-ico">📱</span><span class="lc-body"><span class="lc-title">FCC — tráo SIM</span><span class="lc-sub">fcc.gov · Cú chuyển mạng thật sự diễn ra thế nào ở phía nhà mạng</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">Viết một cuốn runbook mà người ta thật sự làm theo, và giữ nó trong hệ quản lý phiên bản</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Gửi một trăm lời nhắc phê duyệt, rồi thêm khớp số vào và thử lại</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — Pre-hijacking, and the races nobody tests for|||10.5 — Chiếm tài khoản TRƯỚC, và những cuộc đua chẳng ai kiểm thử',
      slug: 'auth-10-5-chiem-truoc-va-dua',
      type: 'LESSON',
      description: 'Kẻ tấn công tạo tài khoản bằng email của bạn TRƯỚC KHI bạn đăng ký, rồi giành lại quyền sau khi bạn đã "nhận" nó. Bài này đi qua năm biến thể và chỉ ra bài nào trong khoá đã vá từng cái, rồi chạy thật một cuộc đua TOCTOU đổi được MỘT mã khôi phục tới NĂM lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>Pre-hijacking, and the races nobody tests for</h2>
<p class="lead">The attacks in this lesson are unusual because the attacker acts <em>before</em> the victim exists as a user. They were catalogued systematically only in 2022, they affected a large fraction of the popular sites tested, and every one of them is invisible to a test suite that starts from an empty database and one well-behaved user.</p>

<h3>The shape: act first, wait, come back</h3>
<pre><code><span class="tok-comment">// Bước 1 — kẻ tấn công đăng ký bằng email của NẠN NHÂN, hôm nay.</span>
POST /sign-up { email: 'nan-nhan@congty.com', password: '<span class="tok-comment">…của hắn…</span>' }

<span class="tok-comment">// Bước 2 — chờ. Vài tuần, vài tháng. Không làm gì cả.</span>

<span class="tok-comment">// Bước 3 — nạn nhân thật tới, thấy "email đã tồn tại", bấm quên mật khẩu,</span>
<span class="tok-comment">//          đặt lại thành công, và tin rằng tài khoản này là của họ.</span>

<span class="tok-comment">// Bước 4 — kẻ tấn công vẫn còn quyền vào. Đó là toàn bộ cú tấn công.</span></code></pre>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Variant 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Federated merge</span><span class="lz-nsub">Attacker makes a password account; victim later signs in with Google and the app merges by email · both now have a way in</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Variant 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Unexpired session</span><span class="lz-nsub">Attacker keeps a session alive; the victim's password reset does not revoke it, so it simply continues</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Variant 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Trojan identifier</span><span class="lz-nsub">Attacker attaches their own phone or provider link before leaving · recovers through it after the victim resets</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Variants 4 and 5</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Pending change · non-verifying provider</span><span class="lz-nsub">An email change started and never confirmed, or an identity provider that never verified the address at all</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Each variant is already fixed, by a different lesson</span><span class="v">Variant 1 by Lesson 8.5 — never link automatically to an account that has another way in. Variant 2 by Lesson 6.3 — a reset revokes every session, with no exception. Variant 3 by the credential version in 6.3, which invalidates identifiers attached before the reset. Variant 4 by expiring the pending change and binding it to the credential version. Variant 5 by Lesson 8.4's <code>email_verified</code> check.</span></div>
  <div class="kv"><span class="k">The one rule that covers all five</span><span class="v">A password reset must invalidate everything that existed before it — sessions, pending email changes, attached factors, provider links and outstanding tokens. Treat the reset as a boundary the previous account state does not cross.</span></div>
  <div class="kv"><span class="k">Verification at registration removes the setup step</span><span class="v">If an unverified account can do nothing and is deleted after thirty days (Lesson 6.2), the attacker's account never becomes a foothold. That is the cheapest single fix, and it is a policy decision rather than code.</span></div>
  <div class="kv"><span class="k">Tell the user what they just claimed</span><span class="v">When a reset succeeds on an account with existing sessions or linked providers, say so: "we signed out 1 other session and removed 1 linked account". A user who never linked Google will read that sentence and contact you.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a test suite that starts from an empty database cannot find any of this.</strong> Every variant needs a prior state: an account that already exists, a session already open, a change already pending, a link already attached. Standard tests create a user, act, assert — so the attacker's setup step is a state the tests never construct. Write them explicitly: create an account as the attacker, run the victim's full claim flow, and then assert that <em>every</em> attacker artefact is gone — their session rejected, their provider link absent, their pending email change dead, their recovery codes invalid. That single test, written once, covers all five variants.</p>
</div>

<h3>Races: the same token, redeemed five times</h3>
<div class="out">Nam request cung doi MOT ma khoi phuc, cung mot luc:
  doc -&gt; await -&gt; ghi (khong giao dich) : 5 lan THANH CONG   &lt;- phai la 1
  co khoa nguyen tu                     : 1 lan thanh cong

Ma dung MOT lan ma doi duoc nam lan. Cung hinh dang nay ap cho:
  token dat lai mat khau · loi moi · phieu giam gia · lenh rut tien.</div>
<pre><code><span class="tok-comment">// SAI — có một cái await giữa lúc ĐỌC trạng thái và lúc HÀNH ĐỘNG theo nó.</span>
const code = await prisma.recoveryCode.findFirst({ where: { hashCode, used: false } });
if (!code) throw new Error('khong hop le');
await argon2.hash(newPassword);                 <span class="tok-comment">// ← 100ms. Năm request cùng qua được đây.</span>
await prisma.recoveryCode.update({ where: { id: ma.id }, data: { used: true } });</code></pre>
<pre><code><span class="tok-comment">// ĐÚNG — để CƠ SỞ DỮ LIỆU quyết định ai thắng, bằng một lệnh ghi có điều kiện.</span>
const result = await prisma.recoveryCode.updateMany({
  where: { hashCode, used: false },             <span class="tok-comment">// điều kiện nằm TRONG lệnh ghi</span>
  data:  { used: true, usedAt: new Date() },
});
if (result.count === 0) throw new Error('khong hop le');   <span class="tok-comment">// đúng MỘT request nhận count=1</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The pattern to look for</span><span class="lz-t">Read, await, decide</span><span class="lz-d">Any handler that loads a row, awaits something slow, and then acts on what it read has this bug. Hashing a password, sending a mail and calling an API are all slow enough to lose the race — and authentication flows do all three.</span></div>
  <div class="lz-step"><span class="lz-k">The fix is a conditional write</span><span class="lz-t">Not a lock</span><span class="lz-d">Put the condition in the <code>WHERE</code> of the update and check the affected-row count. The database serialises it for you, it works across processes, and it needs no coordination service.</span></div>
  <div class="lz-step"><span class="lz-k">Where else it appears</span><span class="lz-t">All of Chapters 5 to 7</span><span class="lz-d">Refresh-token rotation (5.2), reset-token redemption (6.3), TOTP step advance (7.2), recovery codes (7.3), invitation acceptance, and the registration insert in 6.1. Every one of them is single-use state under concurrency.</span></div>
  <div class="lz-step"><span class="lz-k">Testing it needs concurrency, not repetition</span><span class="lz-t">Promise.all, not a loop</span><span class="lz-d">Calling the endpoint five times in sequence passes. Firing five at once fails. Write the concurrent version for every single-use flow — it is four lines and it finds this class every time.</span></div>
</div>
<div class="callout warn">
<p><strong>Two more that belong on the same checklist, because they are found the same way.</strong> First, an <em>open redirect</em> anywhere in your product turns into a token leak in Lessons 6.3 and 8.3 — audit every <code>next</code>, <code>return_to</code> and <code>continue</code> parameter for a path allow-list, not just the ones near the login code. Second, <em>identifier confusion</em>: if two different inputs can normalise to the same account, an attacker registers the form your check misses. Lesson 6.1 covers the email case; the same applies to usernames, phone numbers in different formats, and any identifier compared after a transformation. In both cases the bug is not in the authentication code — it is in ordinary code that authentication happens to depend on.</p>
</div>
<div class="note-ct">
<p><strong>The checklist for a flow you did not write.</strong> Six questions, in order. Can a stranger set this state up before the real user arrives? Does a password reset invalidate everything that existed before it? Is every single-use token consumed by a conditional write rather than read-then-write? Does any redirect target come from user input? Can two different inputs reach the same account? And does a test exist that builds the attacker's prior state rather than starting from empty? Anything you inherited will fail at least one of these, and finding out which takes about an hour.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://arxiv.org/abs/2205.10174" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Pre-hijacking attacks on web user accounts</span><span class="lc-sub">arxiv.org · The paper that catalogued the five variants, with the sites tested</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/race-conditions" target="_blank" rel="noopener"><span class="lc-ico">🏁</span><span class="lc-body"><span class="lc-title">PortSwigger — race conditions</span><span class="lc-sub">portswigger.net · Single-packet attacks, and labs for the limit-overrun pattern</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">↪️</span><span class="lc-body"><span class="lc-title">OWASP — unvalidated redirects</span><span class="lc-sub">cheatsheetseries.owasp.org · The allow-list pattern, applied everywhere</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">Conditional updates, affected-row counts and isolation levels</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Pre-hijack an account five ways, then write the one test that catches all of them</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Chiếm tài khoản TRƯỚC, và những cuộc đua chẳng ai kiểm thử</h2>
<p class="lead">Các cú tấn công trong bài này khác thường ở chỗ kẻ tấn công hành động <em>TRƯỚC KHI</em> nạn nhân tồn tại với tư cách người dùng. Chúng chỉ mới được lập danh mục một cách có hệ thống vào năm 2022, chúng dính vào một tỉ lệ lớn các trang phổ biến được đem ra thử, và mỗi cú đều VÔ HÌNH với một bộ kiểm thử khởi đi từ một cơ sở dữ liệu trống và một người dùng ngoan ngoãn.</p>

<h3>Hình dạng chung: ra tay trước, chờ, rồi quay lại</h3>
<pre><code><span class="tok-comment">// Bước 1 — kẻ tấn công đăng ký bằng email của NẠN NHÂN, hôm nay.</span>
POST /sign-up { email: 'nan-nhan@congty.com', password: '<span class="tok-comment">…của hắn…</span>' }

<span class="tok-comment">// Bước 2 — chờ. Vài tuần, vài tháng. Không làm gì cả.</span>

<span class="tok-comment">// Bước 3 — nạn nhân thật tới, thấy "email đã tồn tại", bấm quên mật khẩu,</span>
<span class="tok-comment">//          đặt lại thành công, và tin rằng tài khoản này là của họ.</span>

<span class="tok-comment">// Bước 4 — kẻ tấn công VẪN CÒN quyền vào. Đó là toàn bộ cú tấn công.</span></code></pre>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Biến thể 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Gộp qua nhà cung cấp</span><span class="lz-nsub">Kẻ tấn công tạo tài khoản mật khẩu; về sau nạn nhân đăng nhập bằng Google và ứng dụng GỘP theo email · giờ cả hai đều có lối vào</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Biến thể 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Phiên chưa hết hạn</span><span class="lz-nsub">Kẻ tấn công giữ một phiên sống; cú đặt lại mật khẩu của nạn nhân KHÔNG thu hồi nó, nên nó cứ thế chạy tiếp</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Biến thể 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Định danh Trojan</span><span class="lz-nsub">Kẻ tấn công gắn số điện thoại hoặc liên kết nhà cung cấp CỦA HẮN trước khi rời đi · rồi khôi phục qua nó sau khi nạn nhân đặt lại</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Biến thể 4 và 5</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Yêu cầu đổi đang chờ · nhà cung cấp không xác minh</span><span class="lz-nsub">Một yêu cầu đổi email khởi động rồi không bao giờ xác nhận, hoặc một nhà cung cấp danh tính chẳng bao giờ xác minh địa chỉ cả</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mỗi biến thể ĐÃ được vá rồi, bởi một bài KHÁC nhau</span><span class="v">Biến thể 1 bởi Bài 8.5 — đừng bao giờ tự động nối vào một tài khoản còn lối vào khác. Biến thể 2 bởi Bài 6.3 — một lần đặt lại thu hồi MỌI phiên, không ngoại lệ. Biến thể 3 bởi phiên bản tín vật ở 6.3, thứ vô hiệu hoá các định danh gắn vào TRƯỚC lần đặt lại. Biến thể 4 bởi việc cho yêu cầu đổi đang chờ hết hạn và buộc nó vào phiên bản tín vật. Biến thể 5 bởi phép kiểm <code>email_verified</code> ở Bài 8.4.</span></div>
  <div class="kv"><span class="k">MỘT luật phủ được cả năm</span><span class="v">Một lần đặt lại mật khẩu phải VÔ HIỆU HOÁ mọi thứ tồn tại trước nó — phiên, yêu cầu đổi email đang chờ, các yếu tố đã gắn, các liên kết nhà cung cấp và mọi token còn treo. Hãy coi lần đặt lại đó là một RANH GIỚI mà trạng thái cũ của tài khoản không được phép bước qua.</span></div>
  <div class="kv"><span class="k">Xác minh ngay lúc đăng ký gỡ bỏ chính bước chuẩn bị của kẻ tấn công</span><span class="v">Nếu một tài khoản chưa xác minh thì không làm được gì và bị xoá sau ba mươi ngày (Bài 6.2) thì tài khoản của kẻ tấn công chẳng bao giờ trở thành một chỗ đứng chân. Đó là cách vá đơn lẻ RẺ nhất, và nó là một quyết định chính sách chứ không phải mã.</span></div>
  <div class="kv"><span class="k">Hãy NÓI cho người dùng biết họ vừa nhận về cái gì</span><span class="v">Khi một lần đặt lại thành công trên một tài khoản đang có phiên hoặc có liên kết nhà cung cấp, hãy nói ra: "chúng tôi đã đăng xuất 1 phiên khác và gỡ 1 tài khoản liên kết". Một người dùng chưa bao giờ nối Google sẽ đọc câu đó và liên hệ với bạn.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một bộ kiểm thử khởi đi từ cơ sở dữ liệu TRỐNG thì không tìm ra được cái nào trong số này.</strong> Mọi biến thể đều cần một TRẠNG THÁI CÓ TRƯỚC: một tài khoản đã tồn tại, một phiên đã mở, một yêu cầu đổi đang chờ, một liên kết đã gắn. Các bài kiểm thử tiêu chuẩn thì tạo một người dùng, hành động, rồi khẳng định — nên bước chuẩn bị của kẻ tấn công là một trạng thái mà chúng chẳng bao giờ dựng lên. Hãy viết ra một cách tường minh: tạo một tài khoản với tư cách KẺ TẤN CÔNG, chạy trọn luồng "nhận lại tài khoản" của nạn nhân, rồi khẳng định rằng MỌI hiện vật của kẻ tấn công đã biến mất — phiên bị từ chối, liên kết nhà cung cấp không còn, yêu cầu đổi email đang chờ đã chết, mã khôi phục hết hiệu lực. Riêng bài kiểm thử đó, viết một lần, phủ cả năm biến thể.</p>
</div>

<h3>Cuộc đua: cùng một token, đổi được NĂM lần</h3>
<div class="out">Nam request cung doi MOT ma khoi phuc, cung mot luc:
  doc -&gt; await -&gt; ghi (khong giao dich) : 5 lan THANH CONG   &lt;- phai la 1
  co khoa nguyen tu                     : 1 lan thanh cong

Ma dung MOT lan ma doi duoc nam lan. Cung hinh dang nay ap cho:
  token dat lai mat khau · loi moi · phieu giam gia · lenh rut tien.</div>
<pre><code><span class="tok-comment">// SAI — có một cái await giữa lúc ĐỌC trạng thái và lúc HÀNH ĐỘNG theo nó.</span>
const code = await prisma.recoveryCode.findFirst({ where: { hashCode, used: false } });
if (!code) throw new Error('khong hop le');
await argon2.hash(newPassword);                 <span class="tok-comment">// ← 100ms. Năm request cùng qua được đây.</span>
await prisma.recoveryCode.update({ where: { id: ma.id }, data: { used: true } });</code></pre>
<pre><code><span class="tok-comment">// ĐÚNG — để CƠ SỞ DỮ LIỆU quyết định ai thắng, bằng một lệnh ghi có điều kiện.</span>
const result = await prisma.recoveryCode.updateMany({
  where: { hashCode, used: false },             <span class="tok-comment">// điều kiện nằm TRONG lệnh ghi</span>
  data:  { used: true, usedAt: new Date() },
});
if (result.count === 0) throw new Error('khong hop le');   <span class="tok-comment">// đúng MỘT request nhận count=1</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cái hình mẫu cần đi tìm</span><span class="lz-t">Đọc, await, rồi quyết định</span><span class="lz-d">Bất kỳ bộ xử lý nào nạp một bản ghi lên, chờ một việc chậm, rồi hành động theo thứ nó vừa đọc đều mang con lỗi này. Băm một mật khẩu, gửi một lá thư và gọi một API đều đủ chậm để THUA cuộc đua — mà các luồng xác thực thì làm cả ba.</span></div>
  <div class="lz-step"><span class="lz-k">Cách vá là một lệnh GHI CÓ ĐIỀU KIỆN</span><span class="lz-t">Không phải một cái khoá</span><span class="lz-d">Hãy đặt điều kiện vào mệnh đề <code>WHERE</code> của lệnh cập nhật rồi kiểm số dòng bị ảnh hưởng. Cơ sở dữ liệu tuần tự hoá giùm bạn, nó chạy xuyên qua nhiều tiến trình, và nó chẳng cần một dịch vụ điều phối nào.</span></div>
  <div class="lz-step"><span class="lz-k">Nó còn xuất hiện ở đâu nữa</span><span class="lz-t">Khắp Chương 5 tới 7</span><span class="lz-d">Xoay vòng refresh token (5.2), đổi token đặt lại (6.3), nhích bước TOTP (7.2), mã khôi phục (7.3), nhận lời mời, và lệnh chèn lúc đăng ký ở 6.1. Mỗi cái đều là trạng thái DÙNG MỘT LẦN dưới điều kiện song song.</span></div>
  <div class="lz-step"><span class="lz-k">Kiểm thử nó cần SONG SONG, không phải lặp lại</span><span class="lz-t">Promise.all, không phải một vòng lặp</span><span class="lz-d">Gọi endpoint năm lần TUẦN TỰ thì qua. Bắn năm cái CÙNG LÚC thì hỏng. Hãy viết phiên bản song song cho mọi luồng dùng-một-lần — nó tốn bốn dòng và nó tìm ra cả họ lỗi này, mọi lần.</span></div>
</div>
<div class="callout warn">
<p><strong>Hai thứ nữa thuộc về cùng cái danh sách kiểm, vì chúng được tìm ra theo cùng một cách.</strong> Thứ nhất, một <em>chuyển hướng mở</em> ở BẤT KỲ đâu trong sản phẩm của bạn đều biến thành một cú rò token ở Bài 6.3 và 8.3 — hãy soát MỌI tham số <code>next</code>, <code>return_to</code> và <code>continue</code> xem có danh sách trắng đường dẫn không, chứ đừng chỉ soát những cái nằm gần đoạn mã đăng nhập. Thứ hai, <em>nhầm lẫn định danh</em>: nếu hai đầu vào KHÁC nhau chuẩn hoá ra cùng một tài khoản thì kẻ tấn công sẽ đăng ký đúng cái dạng mà phép kiểm của bạn bỏ sót. Bài 6.1 phủ trường hợp email; điều tương tự áp cho tên đăng nhập, số điện thoại ở các định dạng khác nhau, và mọi định danh được so sánh SAU một phép biến đổi. Trong cả hai trường hợp, con lỗi KHÔNG nằm trong mã xác thực — nó nằm trong đoạn mã bình thường mà xác thực tình cờ phụ thuộc vào.</p>
</div>
<div class="note-ct">
<p><strong>Danh sách kiểm cho một luồng mà bạn KHÔNG viết ra.</strong> Sáu câu hỏi, theo thứ tự. Một người lạ có dựng sẵn được trạng thái này TRƯỚC khi người dùng thật tới không? Một lần đặt lại mật khẩu có vô hiệu hoá MỌI thứ tồn tại trước nó không? Mọi token dùng-một-lần có được tiêu bằng một lệnh ghi CÓ ĐIỀU KIỆN thay vì đọc-rồi-ghi không? Có đích chuyển hướng nào tới từ đầu vào của người dùng không? Có hai đầu vào khác nhau nào chạm tới được cùng một tài khoản không? Và có tồn tại một bài kiểm thử DỰNG SẴN trạng thái của kẻ tấn công thay vì bắt đầu từ trống không? Bất cứ thứ gì bạn kế thừa lại cũng sẽ trượt ít nhất một câu, và tìm ra là câu nào thì mất chừng một tiếng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://arxiv.org/abs/2205.10174" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tấn công chiếm-trước tài khoản người dùng web</span><span class="lc-sub">arxiv.org · Bài báo lập danh mục năm biến thể, kèm danh sách trang đã thử</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/race-conditions" target="_blank" rel="noopener"><span class="lc-ico">🏁</span><span class="lc-body"><span class="lc-title">PortSwigger — điều kiện tranh chấp</span><span class="lc-sub">portswigger.net · Tấn công gói-đơn, và phòng lab cho kiểu vượt hạn mức</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">↪️</span><span class="lc-body"><span class="lc-title">OWASP — chuyển hướng không kiểm chứng</span><span class="lc-sub">cheatsheetseries.owasp.org · Mẫu danh sách trắng, áp cho mọi nơi</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Cập nhật có điều kiện, số dòng bị ảnh hưởng và các mức cô lập</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chiếm trước một tài khoản bằng năm cách, rồi viết đúng MỘT bài kiểm thử bắt được cả năm</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: 'Quiz: the attacks|||Quiz: các cú tấn công',
      slug: 'auth-10-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về nhồi tín vật, lừa đảo qua proxy, cắp phiên, mệt mỏi vì thông báo đẩy, bàn hỗ trợ, chiếm tài khoản trước, và điều kiện tranh chấp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.6</span>
<h2>Quiz: the attacks</h2>
<p class="lead">Eight questions. Several describe systems where nothing is broken and the accounts are taken anyway — because this chapter is about the attacks that succeed against correct code.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Credential stuffing exploits nothing and is stopped by breach-list checks, a second factor and per-account limits — never by per-IP limits, which residential proxies make decorative (10.1). Modern phishing relays your real login page, so every code-based factor is forwarded and the prize is the post-MFA session cookie; only origin binding survives it (10.2). Session theft has four channels, and 2,056 packages in this repository's dependency tree each have XSS-equivalent power in the browser or read <code>process.env</code> on the server (10.3). Push fatigue reaches ninety-nine percent at a hundred prompts, the help desk is worth exactly what your procedure says, and SIM swap happens at a company you have no relationship with (10.4). Pre-hijacking sets up the account before the victim exists, and a password reset must invalidate everything older than it — while every single-use token needs a conditional write, because read-then-write loses five out of five (10.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.6</span>
<h2>Quiz: các cú tấn công</h2>
<p class="lead">Tám câu. Nhiều câu mô tả những hệ thống chẳng có gì hỏng cả mà tài khoản vẫn bị chiếm — vì chương này nói về những cú tấn công THÀNH CÔNG trước mã ĐÚNG.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Nhồi tín vật không khai thác gì cả và bị chặn bởi việc đối chiếu danh sách rò rỉ, một yếu tố thứ hai và trần theo TÀI KHOẢN — chứ không bao giờ bởi trần theo IP, thứ mà proxy dân cư biến thành đồ trang trí (10.1). Lừa đảo hiện đại CHUYỂN TIẾP trang đăng nhập thật của bạn, nên mọi yếu tố dựa trên mã đều bị chuyển tiếp và phần thưởng là cái cookie phiên đã qua MFA; chỉ ràng buộc origin mới sống sót (10.2). Cắp phiên có bốn kênh, và 2.056 gói trong cây phụ thuộc của kho mã này, mỗi gói đều có sức mạnh ngang một cú XSS ở trình duyệt hoặc đọc được <code>process.env</code> ở máy chủ (10.3). Mệt mỏi vì thông báo đẩy chạm chín mươi chín phần trăm ở một trăm lời nhắc, bàn hỗ trợ đáng giá đúng bằng cái quy trình của bạn, còn tráo SIM thì xảy ra ở một công ty bạn chẳng có quan hệ gì (10.4). Chiếm-trước dựng sẵn tài khoản từ khi nạn nhân còn chưa tồn tại, và một lần đặt lại mật khẩu phải vô hiệu hoá MỌI thứ cũ hơn nó — trong khi mọi token dùng-một-lần đều cần một lệnh ghi CÓ ĐIỀU KIỆN, vì đọc-rồi-ghi thua năm trên năm (10.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why does per-IP rate limiting barely affect a credential-stuffing run?|||Vì sao giới hạn tần suất theo IP gần như không ảnh hưởng gì tới một đợt nhồi tín vật?',
            options: [
              'Because the limit is usually set too high|||Vì trần thường được đặt quá cao',
              'Because residential proxies give the attacker thousands of addresses, each making a handful of requests that look like ordinary users — count failures against the account instead|||Vì proxy dân cư cho kẻ tấn công hàng nghìn địa chỉ, mỗi cái chỉ gửi vài request trông y hệt người dùng bình thường — hãy đếm số lần hỏng theo TÀI KHOẢN',
              'Because stuffing uses IPv6|||Vì nhồi tín vật dùng IPv6',
              'Because the requests come from a single datacentre|||Vì các request tới từ cùng một trung tâm dữ liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is a permanent lockout after N failed logins the wrong control?|||Vì sao khoá vĩnh viễn sau N lần đăng nhập hỏng là một biện pháp SAI?',
            options: [
              'Because it annoys users|||Vì nó làm người dùng khó chịu',
              'Because anyone who knows an email address can lock that account, so a stuffing run denies service to a large share of your users — use an expiring window with exponential backoff|||Vì bất kỳ ai biết một địa chỉ email đều khoá được tài khoản đó, nên một đợt nhồi sẽ từ chối dịch vụ với một phần lớn người dùng của bạn — hãy dùng một cửa sổ tự hết hạn kèm lùi theo cấp số nhân',
              'Because it requires storing state|||Vì nó bắt phải lưu trạng thái',
              'Because attackers can bypass it with a different browser|||Vì kẻ tấn công đi vòng qua được bằng một trình duyệt khác',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A phishing kit proxies your real login page. Which defence still works?|||Một bộ công cụ lừa đảo dựng proxy tới trang đăng nhập thật của bạn. Hàng phòng thủ nào VẪN chạy?',
            options: [
              'TOTP, because the code expires in thirty seconds|||TOTP, vì mã hết hạn sau ba mươi giây',
              'A passkey, because the browser signs the origin it is really on, so the relayed signature names the proxy and the credential is never offered to that domain|||Một passkey, vì trình duyệt ký chính cái origin nó đang thật sự đứng, nên chữ ký chuyển tiếp khai ra cái proxy và credential ngay từ đầu đã không được đưa ra cho tên miền đó',
              'A CAPTCHA on the login form|||Một CAPTCHA trên biểu mẫu đăng nhập',
              'HTTPS with a valid certificate|||HTTPS với một chứng chỉ hợp lệ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After a phishing proxy steals a session cookie, what ends the attacker access?|||Sau khi một proxy lừa đảo cắp được cookie phiên, cái gì kết thúc quyền truy cập của kẻ tấn công?',
            options: [
              'The user changing their password|||Người dùng đổi mật khẩu',
              'Revoking the session — the cookie was already issued, so only revocation reaches it, and the delay is the access-token lifetime you chose|||THU HỒI cái phiên — cookie đã được phát ra rồi, nên chỉ việc thu hồi mới với tới nó, và độ trễ chính là cái tuổi thọ access token mà bạn đã chọn',
              'Rotating the JWT signing key|||Xoay khoá ký JWT',
              'Enabling MFA on the account|||Bật MFA cho tài khoản',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does Domain=.example.com on a session cookie cost you?|||Đặt Domain=.example.com trên một cookie phiên khiến bạn mất gì?',
            options: [
              'Nothing; it is required for the cookie to work|||Không mất gì; phải có nó thì cookie mới chạy',
              'The cookie is sent to every current and future subdomain, so one taken-over or abandoned subdomain receives every visitor session — omit Domain, or use a __Host- prefix|||Cookie được gửi tới MỌI tên miền con hiện tại và tương lai, nên chỉ cần MỘT tên miền con bị chiếm hoặc bỏ hoang là nó nhận được phiên của mọi khách ghé qua — hãy bỏ Domain đi, hoặc dùng tiền tố __Host-',
              'Only extra bytes on each request|||Chỉ tốn thêm vài byte ở mỗi request',
              'It disables SameSite|||Nó vô hiệu hoá SameSite',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does number matching defeat push fatigue while "do not approve unexpected prompts" does not?|||Vì sao khớp số hạ được cú tấn công gây mệt mỏi còn câu "đừng phê duyệt lời nhắc bất ngờ" thì không?',
            options: [
              'Because it makes the prompt appear less often|||Vì nó làm lời nhắc xuất hiện thưa hơn',
              'Because the user must type a number shown on a sign-in screen they are not looking at — there is no button to press by mistake, whereas even a 0.5% slip rate reaches 40% over a hundred prompts|||Vì người dùng phải GÕ một con số hiện trên màn hình đăng nhập mà họ không hề nhìn vào — chẳng có cái nút nào để bấm nhầm, trong khi ngay cả tỉ lệ trượt tay 0,5% cũng chạm 40% sau một trăm lời nhắc',
              'Because it adds a second factor|||Vì nó thêm một yếu tố thứ hai',
              'Because the prompts expire faster|||Vì các lời nhắc hết hạn nhanh hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An attacker registers with a victim’s email months before the victim signs up. What single rule breaks all five pre-hijacking variants?|||Một kẻ tấn công đăng ký bằng email của nạn nhân từ nhiều tháng trước khi nạn nhân đăng ký. MỘT luật nào bẻ gãy cả năm biến thể chiếm-trước?',
            options: [
              'Requiring a strong password at registration|||Đòi mật khẩu mạnh lúc đăng ký',
              'A password reset must invalidate everything that existed before it: sessions, pending email changes, attached factors, provider links and outstanding tokens|||Một lần đặt lại mật khẩu phải VÔ HIỆU HOÁ mọi thứ tồn tại trước nó: phiên, yêu cầu đổi email đang chờ, các yếu tố đã gắn, liên kết nhà cung cấp và mọi token còn treo',
              'Blocking registration from datacentre IPs|||Chặn đăng ký từ IP của trung tâm dữ liệu',
              'Sending a welcome email on every signup|||Gửi thư chào mừng ở mọi lần đăng ký',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Five concurrent requests redeem the same single-use recovery code and all five succeed. What is the fix?|||Năm request song song cùng đổi MỘT mã khôi phục dùng-một-lần và cả năm đều thành công. Cách vá là gì?',
            options: [
              'Add a unique index on the code|||Thêm một chỉ mục duy nhất trên cái mã',
              'Put the condition inside the write — updateMany with where daDung:false — and check the affected-row count, so the database decides who wins|||Đặt điều kiện vào TRONG lệnh ghi — updateMany với where daDung:false — rồi kiểm số dòng bị ảnh hưởng, để cơ sở dữ liệu quyết định ai thắng',
              'Rate-limit the endpoint to one request per second|||Giới hạn endpoint xuống một request mỗi giây',
              'Retry the read until it returns the used state|||Đọc lại nhiều lần cho tới khi nó trả về trạng thái đã dùng',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
