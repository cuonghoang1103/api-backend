/**
 * Authentication · Chương 7 · 7.2 — TOTP nhìn từ bên trong, trong ba mươi dòng. Slug giữ: auth-7-2-totp.
 * Output thật (_ma.mjs, 71-totp-rfc): totp() tự viết tái tạo cả 6 vector RFC 6238 Appendix B + khớp otplib; cửa sổ lệch ±1.
 */
import G from '../giang/auth-07-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const T = CODE.totp.split('\n');
const HOTP = T.slice(T.findIndex((l) => l.includes('HOTP (RFC 4226)')), T.findIndex((l) => l.includes('TOTP (RFC 6238)'))).join('\n').trim();
const TOTP = T.slice(T.findIndex((l) => l.includes('export function totp')), T.findIndex((l) => l.includes('export function otpauthURI'))).join('\n').trim();

const NGUON_EN = [
  nguon('📜', 'RFC 6238 — TOTP: Time-Based One-Time Password Algorithm', 'The algorithm and the Appendix B test vectors this lesson reproduces (secret "12345678901234567890", t=59 → 94287082) (read 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc6238'),
  nguon('📜', 'RFC 4226 — HOTP: HMAC-Based One-Time Password Algorithm', 'The dynamic-truncation step TOTP is built on, with its own test vectors (counter 0–9) (read 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc4226'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 6238 — TOTP: thuật toán mật khẩu một lần theo thời gian', 'Thuật toán và các vector thử Appendix B bài này tái tạo (bí mật "12345678901234567890", t=59 → 94287082) (đọc 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc6238'),
  nguon('📜', 'RFC 4226 — HOTP: mật khẩu một lần dựa trên HMAC', 'Bước cắt động mà TOTP dựng trên, với vector thử riêng (counter 0–9) (đọc 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc4226'),
].join('\n');

export default {
  title: '7.2 — TOTP from the inside, in thirty lines|||7.2 — TOTP nhìn từ bên trong, trong ba mươi dòng',
  slug: 'auth-7-2-totp',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Sáu chữ số trong app xác thực không phải phép màu và không phải một lời gọi mạng: chúng là HMAC(bí mật, cửa sổ 30 giây hiện tại) cắt còn sáu chữ số — RFC 6238 trên RFC 4226, chừng ba mươi dòng. Bài này viết HOTP (HMAC + "cắt động": 4 bit thấp của byte cuối chọn offset, đọc 31 bit, modulo 10^digits) và TOTP (counter = floor(time/30)) TỪ GỐC, rồi CHỨNG MINH chúng tái tạo cả 6 vector RFC 6238 Appendix B và khớp otplib từng chữ số. verifyTotp nhận ±1 bước lệch (~±30s), so sánh hằng thời gian (bài 1.3). Một mã hợp lệ suốt cửa sổ 30s nên chuyển tiếp được — TOTP không sửa được, chỉ passkey (7.4). Theo RFC 6238 + RFC 4226.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>TOTP from the inside, in thirty lines</h2>
<p class="lead">The six digits your authenticator app shows change every thirty seconds and work with the phone in airplane mode. There is no server call and no magic: the app and the server share one secret, and both compute the same function of that secret and the current time. Write that function once and it stops being mysterious — and you can check it against the numbers the RFC itself publishes.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> implement HOTP (HMAC + dynamic truncation) and TOTP (the clock as the counter) from scratch; prove them against the RFC 6238 test vectors and otplib; and verify a code with a skew window, in constant time.</p>
</div>

<h3>Two clocks, one secret</h3>
<p>At enrollment (7.3) the server and the app agree on one random secret. After that they never talk: each computes <code>HMAC(secret, the current 30-second window)</code> and truncates it to six digits. If the two sides share the secret and roughly agree on the time, they produce the same code — and the code is therefore proof that the person holds the secret. No code is ever stored or transmitted except the one the user types to prove it.</p>

<h3>HOTP: HMAC, then dynamic truncation (RFC 4226)</h3>
<p>TOTP is built on HOTP. HMAC of the secret and an 8-byte counter gives 20 bytes; "dynamic truncation" turns those into a number: the low four bits of the last byte choose a 4-byte offset, you read 31 bits there, and take it modulo 10^digits. That offset-chosen-by-the-hash is the whole trick — it stops the output depending on any fixed slice of the HMAC.</p>
${ma('javascript', HOTP)}

<h3>TOTP: the counter is the clock (RFC 6238)</h3>
<p>TOTP is HOTP with exactly one substitution: the counter is <code>floor((time - t0) / step)</code> — the number of 30-second windows since the epoch. Every 30 seconds the counter ticks and the code changes. Nothing else differs.</p>
${ma('javascript', TOTP)}
${ra(OUT['71-totp-rfc'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Checked, not trusted</span><span class="v">RFC 6238 ships test vectors; our <code>totp()</code> reproduces all six (<code>t=59 → 94287082</code>, …) and matches <code>otplib</code> digit-for-digit at three fixed times. A crypto primitive you cannot test is one you do not understand.</span></div>
  <div class="kv"><span class="k">Why a base32 secret</span><span class="v">Authenticator apps and the <code>otpauth://</code> URI carry the secret as base32 — unambiguous to type and scan. The bytes are what HMAC uses; base32 is just the transport (7.3).</span></div>
  <div class="kv"><span class="k">SHA-1 is fine here</span><span class="v">The famous "SHA-1 is broken" is about collisions; HMAC-SHA1 does not rely on collision resistance, and RFC 6238 and every authenticator app default to it. Interoperability wins.</span></div>
  <div class="kv"><span class="k">Six digits, not more</span><span class="v">Six balances typing effort against guessing; the 30-second window and rate limiting (not more digits) are what stop brute force.</span></div>
</div>

<h3>The skew window, and comparing in constant time</h3>
<p>Phone clocks drift and typing takes a few seconds, so <code>verifyTotp</code> accepts the current step and ±1 — about ±30 seconds. One step each way is the usual choice: enough for real drift, small enough that the code is still effectively one-time. The output shows a code from the previous step accepted (offset −1) and one three steps away rejected. And the comparison is constant-time (lesson 1.3): a six-digit code is small, so the time taken must not leak how many leading digits were right.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — TOTP is phishable, and widening the window makes it worse.</strong> A code is valid for its whole 30-second window, so a fake site that relays it within those seconds authenticates as the user. Widening the skew window to "be forgiving" only lengthens the replay window an attacker enjoys. Keep it at ±1, rate-limit the verify endpoint, never log the code — and understand that none of this closes phishing. Only an origin-bound factor does (7.4).</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"How does an authenticator app work offline?"</strong> — It shares a secret at enrollment and computes HMAC(secret, time ÷ 30); the server computes the same. No network after setup.</li>
<li><strong>"What is dynamic truncation?"</strong> — The HOTP step that turns the 20-byte HMAC into digits: the last byte's low bits pick an offset, read 31 bits there, modulo 10^digits.</li>
<li><strong>"Why accept more than the current code?"</strong> — Clock skew and typing delay; a ±1 window (~±30s) covers it without making the code meaningfully reusable.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo7/totp-rfc.mjs</code>. Confirm all six RFC vectors match and the 6-digit codes equal otplib's at the three fixed times.</li>
<li>Change the dynamic-truncation offset to a fixed <code>0</code> instead of the hash-chosen one. Re-run — which RFC vectors break, and why is "pick the offset from the hash" load-bearing?</li>
<li>Widen the verify window to ±10 and describe, in attack terms, exactly what you just made easier.</li>
</ol>
<p><strong>Solution:</strong> (1) six ✓ and three ✓ against otplib. (2) a fixed offset changes the output for most counters, so the vectors fail; the hash-chosen offset is what RFC 4226 specifies and what every app computes. (3) a ±10 window means a relayed code is valid for ~5 minutes of replay instead of ~90 seconds — a bigger gift to a real-time phisher.</p>
<p><strong>Done when:</strong> your <code>totp()</code> reproduces all six RFC vectors and you can explain dynamic truncation in a sentence.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HOTP (RFC 4226)</span><span class="v">HMAC-based one-time password: HMAC(secret, counter) → dynamic truncation → digits.</span></div>
  <div class="kv"><span class="k">TOTP (RFC 6238)</span><span class="v">HOTP where the counter is the current time ÷ a 30-second step.</span></div>
  <div class="kv"><span class="k">dynamic truncation</span><span class="v">The last HMAC byte's low bits pick a 4-byte offset; read 31 bits; modulo 10^digits.</span></div>
  <div class="kv"><span class="k">skew window</span><span class="v">Accepting ±N steps so a drifting clock or slow typing still verifies.</span></div>
  <div class="kv"><span class="k">base32 secret</span><span class="v">The shared secret, encoded for the <code>otpauth://</code> URI / QR an app scans.</span></div>
  <div class="kv"><span class="k">test vector</span><span class="v">A published input→output pair that proves an implementation matches the standard.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>TOTP = HOTP with the clock as the counter: HMAC, dynamic truncation, modulo 10^digits.</li>
<li>The app and server share one secret and never talk again; the code proves the secret is held.</li>
<li>Prove your implementation against the RFC 6238 vectors — do not trust it for "looking right".</li>
<li>Verify with a ±1 skew window, in constant time; do not widen it to "be forgiving".</li>
<li>A TOTP code is relayable within its window — phishable; only a passkey fixes that (7.4).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-1-4-bam-mac-chu-ky', title: 'Revisit Chapter 1 — lesson 1.4: building HMAC-SHA256 from SHA-256', sub: 'TOTP is HMAC plus truncation; lesson 1.4 built HMAC itself from a hash. Same primitive, a new use. Each stands on its own.', cta: 'OPEN LESSON 1.4 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>TOTP nhìn từ bên trong, trong ba mươi dòng</h2>
<p class="lead">Sáu chữ số app xác thực hiển thị đổi mỗi ba mươi giây và chạy khi điện thoại ở chế độ máy bay. Không có lời gọi máy chủ và không phép màu: app và máy chủ chia nhau một bí mật, và cả hai tính cùng một hàm của bí mật đó và thời gian hiện tại. Viết hàm ấy một lần là nó hết bí ẩn — và bạn kiểm được nó với những con số mà chính RFC công bố.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> cài HOTP (HMAC + cắt động) và TOTP (đồng hồ làm counter) từ gốc; chứng minh chúng với vector thử RFC 6238 và otplib; và xác minh một mã với cửa sổ lệch, hằng thời gian.</p>
</div>

<h3>Hai đồng hồ, một bí mật</h3>
<p>Lúc đăng ký (7.3) máy chủ và app thống nhất một bí mật ngẫu nhiên. Sau đó chúng không bao giờ nói chuyện: mỗi bên tính <code>HMAC(bí mật, cửa sổ 30 giây hiện tại)</code> và cắt còn sáu chữ số. Nếu hai bên chung bí mật và đồng ý xấp xỉ về thời gian, chúng cho cùng một mã — và mã đó vì thế là bằng chứng người kia giữ bí mật. Không mã nào được lưu hay truyền trừ cái người dùng gõ để chứng minh.</p>

<h3>HOTP: HMAC, rồi cắt động (RFC 4226)</h3>
<p>TOTP dựng trên HOTP. HMAC của bí mật và một counter 8 byte cho 20 byte; "cắt động" biến chúng thành một con số: 4 bit thấp của byte cuối chọn một offset 4 byte, bạn đọc 31 bit ở đó, và lấy modulo 10^digits. Cái offset-do-hash-chọn đó là toàn bộ mẹo — nó khiến đầu ra không phụ thuộc bất kỳ lát cố định nào của HMAC.</p>
${ma('javascript', HOTP)}

<h3>TOTP: counter là đồng hồ (RFC 6238)</h3>
<p>TOTP là HOTP với đúng một phép thế: counter là <code>floor((time - t0) / step)</code> — số cửa sổ 30 giây kể từ mốc. Mỗi 30 giây counter nhích và mã đổi. Không gì khác.</p>
${ma('javascript', TOTP)}
${ra(OUT['71-totp-rfc'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểm, không tin suông</span><span class="v">RFC 6238 kèm vector thử; <code>totp()</code> của ta tái tạo cả sáu (<code>t=59 → 94287082</code>, …) và khớp <code>otplib</code> từng chữ số ở ba thời điểm cố định. Một nguyên thuỷ mã bạn không kiểm được là cái bạn chưa hiểu.</span></div>
  <div class="kv"><span class="k">Vì sao bí mật base32</span><span class="v">App xác thực và URI <code>otpauth://</code> mang bí mật dạng base32 — không nhập nhằng để gõ và quét. Các byte là cái HMAC dùng; base32 chỉ là phương tiện (7.3).</span></div>
  <div class="kv"><span class="k">SHA-1 ở đây là ổn</span><span class="v">Câu "SHA-1 vỡ rồi" nổi tiếng là về va chạm; HMAC-SHA1 không dựa vào chống va chạm, và RFC 6238 cùng mọi app xác thực mặc định nó. Khả năng liên thông thắng.</span></div>
  <div class="kv"><span class="k">Sáu chữ số, không hơn</span><span class="v">Sáu cân bằng công gõ với đoán; cửa sổ 30 giây và giới hạn tần suất (không phải thêm chữ số) mới chặn dò cạn.</span></div>
</div>

<h3>Cửa sổ lệch, và so sánh hằng thời gian</h3>
<p>Đồng hồ điện thoại trôi và gõ mất vài giây, nên <code>verifyTotp</code> nhận bước hiện tại và ±1 — chừng ±30 giây. Một bước mỗi phía là lựa chọn thường: đủ cho trôi thật, nhỏ đủ để mã vẫn gần như dùng-một-lần. Output cho thấy một mã từ bước trước được nhận (offset −1) và một cái cách ba bước bị từ chối. Và so sánh là hằng thời gian (bài 1.3): một mã sáu chữ số là nhỏ, nên thời gian không được rò có bao nhiêu chữ số đầu đúng.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — TOTP lừa được, và nới cửa sổ làm nó tệ hơn.</strong> Một mã hợp lệ suốt cửa sổ 30 giây, nên một site giả chuyển tiếp nó trong những giây đó xác thực như người dùng. Nới cửa sổ lệch cho "rộng lượng" chỉ kéo dài cửa sổ phát lại mà kẻ tấn công hưởng. Giữ ±1, giới hạn tần suất tuyến xác minh, không bao giờ log mã — và hiểu rằng không cái nào trong số này đóng được lừa đảo. Chỉ một yếu tố gắn origin mới đóng (7.4).</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"App xác thực chạy ngoại tuyến thế nào?"</strong> — Nó chia một bí mật lúc đăng ký và tính HMAC(bí mật, time ÷ 30); máy chủ tính cùng. Không mạng sau khi cài.</li>
<li><strong>"Cắt động là gì?"</strong> — Bước HOTP biến HMAC 20 byte thành chữ số: bit thấp của byte cuối chọn một offset, đọc 31 bit ở đó, modulo 10^digits.</li>
<li><strong>"Vì sao nhận hơn mã hiện tại?"</strong> — Lệch đồng hồ và trễ gõ; một cửa sổ ±1 (~±30s) phủ nó mà không khiến mã dùng lại được đáng kể.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo7/totp-rfc.mjs</code>. Xác nhận cả sáu vector RFC khớp và mã 6 chữ số bằng otplib ở ba thời điểm cố định.</li>
<li>Đổi offset cắt động thành cố định <code>0</code> thay vì cái do-hash-chọn. Chạy lại — vector RFC nào vỡ, và vì sao "chọn offset từ hash" là then chốt?</li>
<li>Nới cửa sổ xác minh lên ±10 và mô tả, bằng ngôn ngữ tấn công, chính xác cái bạn vừa làm dễ hơn.</li>
</ol>
<p><strong>Lời giải:</strong> (1) sáu ✓ và ba ✓ với otplib. (2) một offset cố định đổi đầu ra với phần lớn counter, nên vector trượt; offset do-hash-chọn là cái RFC 4226 quy định và mọi app tính. (3) một cửa sổ ±10 nghĩa là một mã chuyển tiếp hợp lệ ~5 phút phát lại thay vì ~90 giây — một món quà lớn hơn cho kẻ lừa đảo thời gian thực.</p>
<p><strong>Đạt khi:</strong> <code>totp()</code> của bạn tái tạo cả sáu vector RFC và bạn giải thích được cắt động trong một câu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HOTP (RFC 4226)</span><span class="v">Mật khẩu một lần dựa HMAC: HMAC(bí mật, counter) → cắt động → chữ số.</span></div>
  <div class="kv"><span class="k">TOTP (RFC 6238)</span><span class="v">HOTP với counter là thời gian hiện tại ÷ một bước 30 giây.</span></div>
  <div class="kv"><span class="k">dynamic truncation (cắt động)</span><span class="v">Bit thấp của byte HMAC cuối chọn offset 4 byte; đọc 31 bit; modulo 10^digits.</span></div>
  <div class="kv"><span class="k">skew window (cửa sổ lệch)</span><span class="v">Nhận ±N bước để một đồng hồ trôi hay gõ chậm vẫn xác minh được.</span></div>
  <div class="kv"><span class="k">base32 secret (bí mật base32)</span><span class="v">Bí mật chung, mã hoá cho URI <code>otpauth://</code> / QR mà app quét.</span></div>
  <div class="kv"><span class="k">test vector (vector thử)</span><span class="v">Một cặp vào→ra công bố chứng minh một cài đặt khớp chuẩn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>TOTP = HOTP với đồng hồ làm counter: HMAC, cắt động, modulo 10^digits.</li>
<li>App và máy chủ chia một bí mật rồi không bao giờ nói lại; mã chứng minh bí mật được giữ.</li>
<li>Chứng minh cài đặt của bạn với vector RFC 6238 — đừng tin nó vì "trông đúng".</li>
<li>Xác minh với cửa sổ lệch ±1, hằng thời gian; đừng nới nó cho "rộng lượng".</li>
<li>Một mã TOTP chuyển tiếp được trong cửa sổ của nó — lừa được; chỉ một passkey sửa (7.4).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-1-4-bam-mac-chu-ky', title: 'Xem lại Chương 1 — bài 1.4: dựng HMAC-SHA256 từ SHA-256', sub: 'TOTP là HMAC cộng cắt; bài 1.4 đã dựng chính HMAC từ một hàm băm. Cùng nguyên thuỷ, một công dụng mới. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI 1.4 →' })}
</div>
`,
};
