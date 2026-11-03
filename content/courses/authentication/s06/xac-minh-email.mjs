/**
 * Authentication · Chương 6 · 6.2 — Xác minh email, và cái máy quét bấm hộ mọi đường dẫn của bạn. Slug giữ: auth-6-2-xac-minh-email.
 * Output thật (_ma.mjs): token một lần (digest SHA-256, 30 phút); GET /verify-email chỉ HIỆN trang xác nhận (máy quét bấm link ⇒
 * không đốt token), POST mới tiêu; bấm lần hai ⇒ USED. LabFlow ID v0.6, hộp thư giả (src/email).
 */
import G from '../giang/auth-06-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const LV = CODE.layer.split('\n');
const ISSUE_CONSUME = LV.slice(LV.findIndex((l) => l.includes('Make a one-time token')), LV.findIndex((l) => l.includes('Ask for a password reset'))).join('\n').trim();
const SV = CODE.server06.split('\n');
const VERIFY = SV.slice(SV.findIndex((l) => l.includes('lesson 6.2: email verification')), SV.findIndex((l) => l.includes('lesson 6.3, 6.4: ask'))).join('\n').trim();

const NGUON_EN = [
  nguon('🌐', 'MDN — HTTP GET is a safe method', 'GET must not change server state; mail scanners and prefetchers rely on it, so a GET that consumes a token will be consumed by a machine (read 04/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET'),
  nguon('🔗', 'Microsoft — Safe Links in Defender for Office 365', 'A security gateway rewrites and FETCHES every URL in an incoming mail to scan it — seconds after delivery, before the human opens it (read 04/11/2026).', 'https://learn.microsoft.com/en-us/defender-office-365/safe-links-about'),
  nguon('🦉', 'OWASP — Forgot Password Cheat Sheet (token rules)', 'A verification/reset token must be random, single-use, time-limited and stored hashed — the same rules this lesson applies (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🌐', 'MDN — GET là một phương thức an toàn', 'GET không được đổi trạng thái máy chủ; máy quét thư và prefetch dựa vào điều đó, nên một GET tiêu token sẽ bị một cái máy tiêu (đọc 04/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET'),
  nguon('🔗', 'Microsoft — Safe Links trong Defender for Office 365', 'Một cổng bảo mật viết lại và TẢI mọi URL trong thư đến để quét — vài giây sau khi thư tới, trước khi người đọc mở (đọc 04/11/2026).', 'https://learn.microsoft.com/en-us/defender-office-365/safe-links-about'),
  nguon('🦉', 'OWASP — Forgot Password Cheat Sheet (luật token)', 'Một token xác minh/đặt lại phải ngẫu nhiên, dùng một lần, có hạn và lưu dạng băm — đúng những luật bài này áp dụng (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Choice</th><th>Scanner prefetches the link</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>GET consumes the token</td><td>the machine verifies; the human's click says "link expired"</td><td>broken — never ship</td></tr>
<tr><td>GET shows a page, POST consumes</td><td>the GET shows a button and changes nothing; only the human's click verifies</td><td><strong>LabFlow ID</strong></td></tr>
<tr><td>GET consumes, but idempotent for its whole life</td><td>scanner and human both succeed (token not single-use)</td><td>acceptable for verify, not for reset</td></tr>
<tr><td>detect the bots by user-agent</td><td>the allowlist rots in a quarter; gateways imitate browsers</td><td>guessing — do not</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Lựa chọn</th><th>Máy quét prefetch đường dẫn</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td>GET tiêu token</td><td>cái máy xác minh; cú bấm của người nói "link hết hạn"</td><td>hỏng — đừng bao giờ dùng</td></tr>
<tr><td>GET hiện trang, POST tiêu</td><td>GET hiện một nút và không đổi gì; chỉ cú bấm của người mới xác minh</td><td><strong>LabFlow ID</strong></td></tr>
<tr><td>GET tiêu, nhưng idempotent suốt đời token</td><td>máy quét và người đều thành công (token không dùng-một-lần)</td><td>chấp nhận được cho xác minh, không cho reset</td></tr>
<tr><td>đoán bot theo user-agent</td><td>danh sách mục rữa trong một quý; cổng giả làm trình duyệt</td><td>đoán mò — đừng</td></tr>
</tbody>
</table>`;

export default {
  title: '6.2 — Email verification, and the scanner that clicks your links|||6.2 — Xác minh email, và cái máy quét bấm hộ mọi đường dẫn của bạn',
  slug: 'auth-6-2-xac-minh-email',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Xác minh trả lời đúng một câu: người vừa đăng ký có đọc được thư ở địa chỉ đó không? LabFlow ID v0.6 dùng một token NGẪU NHIÊN (lưu digest SHA-256 như Chương 1, dùng một lần, hết hạn 30 phút) gửi trong hộp thư giả. Cái bẫy thật: cổng bảo mật của công ty người dùng BẤM vào đường dẫn trước khi họ mở thư (Outlook Safe Links, Proofpoint, Slack unfurl). Nên GET /verify-email chỉ HIỆN một trang xác nhận và không tiêu gì; chỉ POST (cú bấm của người) mới tiêu token. Theo MDN (GET an toàn), Microsoft Safe Links, OWASP.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Email verification, and the scanner that clicks your links</h2>
<p class="lead">Verification answers exactly one question: can the person who registered read mail at that address? Everything downstream leans on the answer — the password reset in Lesson 6.3 is built entirely on it — so this is not a nicety, it is the foundation the rest of the chapter stands on. And it breaks in a way almost nobody predicts: a machine clicks the link before the human does.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> issue a verification token that is random, hashed, single-use and short-lived (Chapter 1's primitive, unchanged); explain why a <code>GET</code> link must not consume the token; and build the <code>GET</code>-shows / <code>POST</code>-consumes pair that survives a mail security gateway.</p>
</div>

<h3>The token is Chapter 1's primitive, unchanged</h3>
<p>A verification link carries a <strong>one-time token</strong>: random, emailed in plaintext, and stored only as a SHA-256 digest — exactly the credential handling from Lesson 1.3. LabFlow ID's lifecycle layer issues and consumes it. The purpose is baked in (<code>verify_email</code> vs <code>reset_password</code>), so a verify link can never be replayed as a reset, and vice versa.</p>
${ma('javascript', ISSUE_CONSUME)}
<div class="kv-grid">
  <div class="kv"><span class="k">Store the digest, not the token</span><span class="v">The row is a credential. A DB dump, a log line or a support tool that prints the column must not hand anybody a working link. SHA-256 is right: the input is already 256 bits of randomness, so there is nothing to brute-force — no Argon2 needed (contrast Lesson 2.3).</span></div>
  <div class="kv"><span class="k">Purpose-bound</span><span class="v"><code>consumeToken('verify_email', t)</code> rejects a <code>reset_password</code> token as <code>INVALID</code>. One table, two purposes, no cross-use.</span></div>
  <div class="kv"><span class="k">Single-use and time-limited</span><span class="v"><code>usedAt</code> makes it work exactly once; <code>expiresAt</code> (30 min for verify) kills a link left sitting in an archived mailbox.</span></div>
  <div class="kv"><span class="k">Not a JWT</span><span class="v">A signed token cannot be marked used, cannot be revoked when the user asks to resend, and cannot be expired early. Verification needs all three and gets them from one database row.</span></div>
</div>

<h3>The scanner that clicks your link before the user does</h3>
<p>Outlook Safe Links, Proofpoint, Mimecast, Slack unfurling and half a dozen antivirus suites fetch every URL in an incoming mail to check it. They arrive seconds after delivery, they follow redirects, and they do not run your JavaScript. Any side effect you attach to that <code>GET</code> has already happened by the time the human opens the message.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — a GET that consumes the token will be consumed by a machine.</strong> The log reads: <code>08:14 GET /verify?token=… UA: Microsoft Office Existence Discovery → 200</code>, then at <code>08:31</code> the human clicks and sees "link expired". They did nothing wrong; their company's security gateway burned the one-time token seventeen minutes earlier.</p>
</div>
<p>LabFlow ID fixes the <em>shape</em> of the request rather than guessing who sent it: <code>GET</code> only shows a confirm page; the verification sits behind a <code>POST</code> that the human triggers by clicking a button.</p>
${ma('javascript', VERIFY)}
${ra(OUT['62-scanner'])}
<p>The scanner's <code>GET</code> returns a form and changes nothing. The user's click <code>POST</code>s and consumes the token; a second <code>POST</code> returns <code>USED</code>. One extra click, and the link still works when the human finally arrives.</p>

<h3>When it goes wrong</h3>
${BANG_EN}
<div class="note-ct">
<p><strong>The cheaper alternative, and its one cost.</strong> Keep the plain <code>GET</code>, but let the same token succeed repeatedly for its whole 30-minute life instead of dying on first use. The scanner verifies, the user verifies again, both see success. It costs the single-use property — acceptable for <em>verification</em>, where re-confirming an address is harmless, but never for password <em>reset</em> (6.3), where a link that works twice is a link an attacker can replay.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Why did users report the verification link was already expired?"</strong> — A mail security gateway prefetched the <code>GET</code> and consumed the one-time token before the human clicked. Move the side effect behind a <code>POST</code>, or make verify idempotent.</li>
<li><strong>"Hash the verification token or not?"</strong> — Yes, store the SHA-256 digest; the row is a credential. SHA-256, not Argon2 — the input is already high-entropy random.</li>
<li><strong>"JWT for the verification link?"</strong> — No: you cannot mark a JWT used, revoke it on resend, or expire it early. A database row gives all three.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>bash demo6/scanner.sh</code>. The <code>GET</code> returns a form; confirm the token is still unused afterwards. Then <code>POST</code> it, and <code>POST</code> again — what is the second response?</li>
<li>Change <code>GET /verify-email</code> to call <code>consumeToken</code> itself. Re-run the scanner demo and explain why the human's later click now fails.</li>
<li>Issue a verify token, advance the clock past 30 minutes (the grader does this), and confirm <code>consumeToken</code> returns <code>EXPIRED</code>.</li>
</ol>
<p><strong>Solution:</strong> (1) the <code>GET</code> changes nothing; the first <code>POST</code> returns <code>{ verified: true }</code>, the second <code>{ error: 'USED' }</code>. (2) the prefetching scanner now consumes the token on the <code>GET</code>, so the human's <code>POST</code> finds it already <code>USED</code>. (3) past <code>expiresAt</code>, <code>consumeToken</code> returns <code>EXPIRED</code> before marking it used.</p>
<p><strong>Done when:</strong> a prefetch of the verify link leaves the token usable, and only the human's click consumes it.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">one-time token</span><span class="v">A random secret, stored as a digest, valid once and for a short time; the link in the email.</span></div>
  <div class="kv"><span class="k">purpose-bound token</span><span class="v">A token that only works for its stated purpose (<code>verify_email</code> ≠ <code>reset_password</code>).</span></div>
  <div class="kv"><span class="k">mail security gateway</span><span class="v">Safe Links / Proofpoint / Mimecast — fetches every URL in a mail to scan it, before the human reads it.</span></div>
  <div class="kv"><span class="k">link prefetch</span><span class="v">A client or scanner fetching a URL ahead of the user; a GET side effect fires here.</span></div>
  <div class="kv"><span class="k">safe method</span><span class="v">An HTTP method (GET, HEAD) that must not change state — the property scanners rely on.</span></div>
  <div class="kv"><span class="k">idempotent verify</span><span class="v">Letting the same token verify repeatedly for its whole life instead of dying on first use.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Verification proves one thing: this person can read mail at this address — at one moment in time.</li>
<li>The token is Chapter 1's primitive: random, stored as a digest, single-use, purpose-bound, short-lived.</li>
<li>A mail security gateway will <code>GET</code> your link before the user does — so a <code>GET</code> must not consume the token.</li>
<li><code>GET</code> shows a confirm page; <code>POST</code> consumes. Or make verify idempotent — never password reset.</li>
<li>Don't guess the bots by user-agent; fix the shape of the request instead.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-0-1-http', title: 'Compare in API Design — lesson 0.1: HTTP methods, and why GET must be safe', sub: 'There, the rule that GET and HEAD must not change state; here, the mail scanner that relies on it and burns a one-time token when a GET breaks it. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Xác minh email, và cái máy quét bấm hộ mọi đường dẫn của bạn</h2>
<p class="lead">Xác minh trả lời đúng một câu hỏi: người vừa đăng ký có đọc được thư ở địa chỉ đó không? Mọi thứ phía sau dựa vào câu trả lời ấy — đặt lại mật khẩu ở Bài 6.3 dựng HOÀN TOÀN trên nó — nên đây không phải thứ trang trí, mà là phần móng cho cả phần còn lại của chương đứng lên. Và nó hỏng theo một cách gần như không ai đoán ra: một cái máy bấm đường dẫn trước khi con người bấm.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> phát một token xác minh ngẫu nhiên, băm, dùng một lần, có hạn (đúng nguyên thuỷ của Chương 1, không đổi); giải thích vì sao một đường dẫn <code>GET</code> không được tiêu token; và dựng cặp <code>GET</code>-hiện / <code>POST</code>-tiêu chịu được một cổng bảo mật thư.</p>
</div>

<h3>Cái token chính là nguyên thuỷ của Chương 1, không đổi</h3>
<p>Một đường dẫn xác minh mang một <strong>token một lần</strong>: ngẫu nhiên, gửi trong thư ở dạng gốc, và chỉ lưu dạng digest SHA-256 — đúng cách xử lý tín vật ở Bài 1.3. Lớp vòng đời của LabFlow ID phát và tiêu nó. Mục đích được nướng vào trong (<code>verify_email</code> đối lại <code>reset_password</code>), nên một đường xác minh không bao giờ phát lại được thành một lệnh reset, và ngược lại.</p>
${ma('javascript', ISSUE_CONSUME)}
<div class="kv-grid">
  <div class="kv"><span class="k">Lưu digest, không lưu token</span><span class="v">Dòng này là một tín vật. Một bản dump DB, một dòng log hay một công cụ hỗ trợ in cột đó ra đều không được trao cho ai một đường dẫn chạy được. SHA-256 là đúng: đầu vào đã là 256 bit ngẫu nhiên, nên chẳng có gì để dò cạn — không cần Argon2 (khác Bài 2.3).</span></div>
  <div class="kv"><span class="k">Ràng theo mục đích</span><span class="v"><code>consumeToken('verify_email', t)</code> từ chối một token <code>reset_password</code> là <code>INVALID</code>. Một bảng, hai mục đích, không dùng chéo.</span></div>
  <div class="kv"><span class="k">Dùng một lần, có hạn</span><span class="v"><code>usedAt</code> khiến nó chạy đúng một lần; <code>expiresAt</code> (30 phút cho xác minh) giết một đường dẫn nằm lại trong một hộp thư lưu trữ.</span></div>
  <div class="kv"><span class="k">Không phải JWT</span><span class="v">Một token đã ký không đánh dấu được là đã dùng, không thu hồi được khi người dùng xin gửi lại, và không cho hết hạn sớm được. Xác minh cần cả ba và có cả ba từ một dòng cơ sở dữ liệu.</span></div>
</div>

<h3>Cái máy quét bấm đường dẫn của bạn trước khi người dùng bấm</h3>
<p>Outlook Safe Links, Proofpoint, Mimecast, Slack unfurl và cả tá bộ diệt virus tải mọi URL trong một thư đến để kiểm. Chúng tới vài giây sau khi thư được giao, chúng theo chuyển hướng, và chúng không chạy JavaScript của bạn. Bất kỳ tác dụng phụ nào bạn gắn vào cái <code>GET</code> đó đều đã xảy ra xong trước lúc con người mở thư.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một GET tiêu token sẽ bị một cái máy tiêu.</strong> Log ghi: <code>08:14 GET /verify?token=… UA: Microsoft Office Existence Discovery → 200</code>, rồi lúc <code>08:31</code> con người bấm và thấy "link hết hạn". Họ không làm gì sai cả; cổng bảo mật của công ty họ đã đốt cái token một lần mười bảy phút trước đó.</p>
</div>
<p>LabFlow ID sửa <em>hình dạng</em> của request thay vì đoán ai gửi nó: <code>GET</code> chỉ hiện một trang xác nhận; việc xác minh nằm sau một <code>POST</code> mà con người kích hoạt bằng cách bấm một cái nút.</p>
${ma('javascript', VERIFY)}
${ra(OUT['62-scanner'])}
<p>Cú <code>GET</code> của máy quét trả về một form và không đổi gì. Cú bấm của người dùng <code>POST</code> và tiêu token; một <code>POST</code> thứ hai trả về <code>USED</code>. Thêm một cú bấm, và đường dẫn vẫn chạy khi con người cuối cùng cũng tới.</p>

<h3>Khi nó hỏng</h3>
${BANG_VI}
<div class="note-ct">
<p><strong>Phương án rẻ hơn, và cái giá duy nhất của nó.</strong> Giữ cái <code>GET</code> thuần, nhưng để cùng một token thành công lặp lại suốt đời 30 phút của nó thay vì chết ở lần dùng đầu. Máy quét xác minh, người dùng xác minh lại, cả hai thấy thành công. Nó mất tính dùng-một-lần — chấp nhận được cho <em>xác minh</em>, nơi xác nhận lại một địa chỉ là vô hại, nhưng không bao giờ cho <em>đặt lại</em> mật khẩu (6.3), nơi một đường dẫn chạy được hai lần là một đường dẫn kẻ tấn công phát lại được.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Vì sao người dùng báo đường dẫn xác minh đã hết hạn sẵn?"</strong> — Một cổng bảo mật thư đã prefetch cái <code>GET</code> và tiêu token một lần trước khi con người bấm. Chuyển tác dụng phụ ra sau một <code>POST</code>, hoặc làm xác minh idempotent.</li>
<li><strong>"Băm token xác minh hay không?"</strong> — Có, lưu digest SHA-256; dòng này là một tín vật. SHA-256, không Argon2 — đầu vào đã là ngẫu nhiên entropy cao.</li>
<li><strong>"Dùng JWT cho đường dẫn xác minh?"</strong> — Không: bạn không đánh dấu dùng được, không thu hồi khi gửi lại, không cho hết hạn sớm. Một dòng cơ sở dữ liệu cho cả ba.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>bash demo6/scanner.sh</code>. Cái <code>GET</code> trả về một form; xác nhận token vẫn chưa dùng sau đó. Rồi <code>POST</code> nó, và <code>POST</code> lần nữa — phản hồi thứ hai là gì?</li>
<li>Đổi <code>GET /verify-email</code> để tự nó gọi <code>consumeToken</code>. Chạy lại demo máy quét và giải thích vì sao cú bấm muộn hơn của con người giờ hỏng.</li>
<li>Phát một token xác minh, đẩy đồng hồ qua 30 phút (máy chấm làm việc này), và xác nhận <code>consumeToken</code> trả về <code>EXPIRED</code>.</li>
</ol>
<p><strong>Lời giải:</strong> (1) cái <code>GET</code> không đổi gì; <code>POST</code> đầu trả <code>{ verified: true }</code>, cái thứ hai <code>{ error: 'USED' }</code>. (2) máy quét prefetch giờ tiêu token ở <code>GET</code>, nên <code>POST</code> của con người thấy nó đã <code>USED</code>. (3) qua <code>expiresAt</code>, <code>consumeToken</code> trả <code>EXPIRED</code> trước khi đánh dấu đã dùng.</p>
<p><strong>Đạt khi:</strong> một lần prefetch đường dẫn xác minh để token vẫn dùng được, và chỉ cú bấm của con người mới tiêu nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">one-time token (token một lần)</span><span class="v">Một bí mật ngẫu nhiên, lưu dạng digest, chỉ hợp lệ một lần và trong thời gian ngắn; đường dẫn trong thư.</span></div>
  <div class="kv"><span class="k">purpose-bound token (token ràng mục đích)</span><span class="v">Một token chỉ chạy cho đúng mục đích của nó (<code>verify_email</code> ≠ <code>reset_password</code>).</span></div>
  <div class="kv"><span class="k">mail security gateway (cổng bảo mật thư)</span><span class="v">Safe Links / Proofpoint / Mimecast — tải mọi URL trong một thư để quét, trước khi con người đọc.</span></div>
  <div class="kv"><span class="k">link prefetch (tải trước đường dẫn)</span><span class="v">Một client hay máy quét tải một URL trước người dùng; một tác dụng phụ của GET nổ ở đây.</span></div>
  <div class="kv"><span class="k">safe method (phương thức an toàn)</span><span class="v">Một phương thức HTTP (GET, HEAD) không được đổi trạng thái — tính chất máy quét dựa vào.</span></div>
  <div class="kv"><span class="k">idempotent verify (xác minh idempotent)</span><span class="v">Để cùng một token xác minh lặp lại suốt đời nó thay vì chết ở lần dùng đầu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xác minh chứng minh một điều: người này đọc được thư ở địa chỉ này — tại một thời điểm.</li>
<li>Token là nguyên thuỷ của Chương 1: ngẫu nhiên, lưu dạng digest, dùng một lần, ràng mục đích, có hạn ngắn.</li>
<li>Một cổng bảo mật thư sẽ <code>GET</code> đường dẫn của bạn trước người dùng — nên một <code>GET</code> không được tiêu token.</li>
<li><code>GET</code> hiện trang xác nhận; <code>POST</code> tiêu. Hoặc làm xác minh idempotent — không bao giờ cho reset mật khẩu.</li>
<li>Đừng đoán bot theo user-agent; sửa hình dạng của request thay vào đó.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-0-1-http', title: 'So với API Design — bài 0.1: phương thức HTTP, và vì sao GET phải an toàn', sub: 'Ở đó, luật GET và HEAD không được đổi trạng thái; ở đây, cái máy quét thư dựa vào luật đó và đốt một token một lần khi một GET phá nó. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
