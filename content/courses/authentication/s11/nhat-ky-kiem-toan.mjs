/**
 * Authentication · Chương 11 · 11.4 — Nhật ký kiểm toán: ghi gì, và tuyệt đối KHÔNG ghi gì. Slug giữ: auth-11-4-nhat-ky-kiem-toan.
 * Code THẬT từ _ma.mjs (src/ops/audit.js) + output demo11/audit.mjs (LabFlow ID v0.11).
 */
import G from '../giang/auth-11-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('📒', 'OWASP — Logging Cheat Sheet', 'What to log and what never to; allow-list, no secrets, tamper-evidence (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html'),
  nguon('🔑', 'OWASP — Secrets Management Cheat Sheet', 'Why a logged secret is a breach, and keeping secrets out of logs (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('📒', 'OWASP — Logging Cheat Sheet', 'Ghi gì và tuyệt đối không ghi gì; allow-list, không bí mật, chống-sửa (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html'),
  nguon('🔑', 'OWASP — Secrets Management Cheat Sheet', 'Vì sao một bí mật bị log là một vụ rò, và giữ bí mật khỏi log (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'),
].join('\n');

export default {
  title: '11.4 — The audit log: what to write, and what never to|||11.4 — Nhật ký kiểm toán: ghi gì, và tuyệt đối KHÔNG ghi gì',
  slug: 'auth-11-4-nhat-ky-kiem-toan',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Nhật ký kiểm toán là thứ bạn với tới sau một sự cố: ai làm gì, khi nào, từ đâu, kết quả gì. Hai luật kéo ngược: ghi ĐỦ để tái dựng sự kiện, ghi KHÔNG GÌ mà bản thân là một bí mật. GHI: ts, actor (id người dùng), action, outcome, ip, requestId, userAgent. KHÔNG BAO GIỜ: mật khẩu, token, cookie phiên, OTP, mã khôi phục, API key — không một lần, không cả lồng nhau (một bí mật bị log là một vụ rò thứ hai nằm trong kho log). safeAudit() giữ một ALLOW-LIST trường an toàn + strip mọi cái nhạy cảm theo TÊN (mọi chữ hoa/thường/gạch) + từ chối object lồng (bí mật nấp được trong). Allow-list không deny-list (deny-list bỏ sót trường mới). Mỗi mục mang một SEVERITY (refresh_reuse/mfa_disabled ⇒ alert; password_reset/admin_action ⇒ warn; thường ⇒ info) mà runbook (11.5) hành động theo. Nhật ký phải CHỐNG-SỬA (chuyển ra khỏi máy, append-only — kẻ tấn công vào được sẽ cố xoá dấu). Cũng là RIÊNG TƯ (IP + id là dữ liệu cá nhân — giữ có hạn). Theo OWASP Logging + Secrets Management.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>The audit log: what to write, and what never to</h2>
<p class="lead">An audit log is what you reach for after an incident — who did what, when, from where, with what outcome. Two rules pull against each other, and getting them both right is the whole lesson: write <em>enough</em> to reconstruct the event, and write <em>nothing</em> that is itself a secret, because a logged token is a second breach sitting in your log store.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> choose the safe fields to log and the ones to never log; strip secrets by name and by value with an allow-list; and tag a severity the runbook acts on.</p>
</div>

<h3>What to write, and what never to</h3>
<p><strong>Write:</strong> timestamp, actor (the user id), action, outcome, ip, request id, user agent — enough to reconstruct "usr_1 reset their password from this IP at this time, and it succeeded". <strong>Never write:</strong> a password, a token, a session cookie, an OTP, a recovery code, an API key — not even once, not even nested inside another field. Those are read by everyone who can read logs and retained for months; a secret among them is a standing breach.</p>

<h3>The naive "log everything"</h3>
<p>"Log the whole event object for completeness" is exactly how a reset token, a plaintext password and a session cookie end up in your logs forever. The demo shows that raw event, then the safe version produced by <code>safeAudit()</code>:</p>
${ma('javascript', CODE.audit)}
${ra(OUT['114-audit'])}
<p>The safe entry keeps the fields that reconstruct the incident and has zero secret substrings remaining — the token, the plaintext password and the cookie are all gone, including the one hidden in a nested object.</p>

<h3>Strip by name and by value, with an allow-list</h3>
<p><code>safeAudit()</code> keeps an <em>allow-list</em> of safe fields and drops every sensitive one by name (<code>password</code>, <code>token</code>, <code>cookie</code>…, any case or spelling), and it refuses nested objects entirely because a secret can hide inside one. This is the Chapter 1 rule again: log only what you decided is safe, never "everything minus a deny-list". A deny-list misses the new field a teammate added last week; an allow-list only ever lets through what you named — safe by construction.</p>

<h3>Severity drives the response</h3>
<p>Each entry carries a severity: <code>refresh_reuse_detected</code> and <code>mfa_disabled</code> are <code>alert</code> (a takeover signal — a second factor turned off is often the first step); <code>password_reset</code>, <code>email_changed</code> and <code>admin_action</code> are <code>warn</code>; a routine login is <code>info</code>. The severity is what the monitoring and the runbook (11.5) act on — the audit log is not just a record, it is a source of signals.</p>

<h3>Tamper-evident, and private</h3>
<p>An attacker who gets in will try to erase their tracks, so ship audit entries off the box to a store the app cannot edit (append-only, a separate account) — a log the attacker can delete is not an audit log. And mind the person, not just the secret: an IP and a user id are personal data in many jurisdictions. Keep them because you need them to investigate, but retain for a bounded time, restrict who reads them, and never log more about a person than the incident requires.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — redacting in place instead of dropping.</strong> Replacing a token value with <code>[redacted]</code> but keeping the field is better than nothing, yet it still reveals that a token was present and risks a partial leak if the redactor misses a format. For audit entries, <em>drop</em> the sensitive field entirely and refuse nested objects — do not try to carry a redacted secret along. The only safe secret in a log is an absent one.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What goes in an audit log, and what must never?"</strong> — Write actor, action, outcome, time, IP, request id. Never a password, token, cookie, OTP, recovery code or API key.</li>
<li><strong>"Allow-list or deny-list for redaction?"</strong> — Allow-list: log only the fields you named safe. A deny-list misses fields added later.</li>
<li><strong>"Why ship the audit log off the server?"</strong> — So an attacker who compromises the box cannot edit or delete the record of their own actions — it must be tamper-evident.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo11/audit.mjs</code>. Which three secrets are in the raw event, and how many secret substrings remain in the <code>safeAudit</code> output?</li>
<li>Why is an allow-list safer than a deny-list for redaction?</li>
<li>Why does <code>safeAudit</code> drop nested objects entirely instead of walking into them?</li>
</ol>
<p><strong>Solution:</strong> (1) a reset token, a plaintext password and a session cookie (plus a nested API key); zero secret substrings remain. (2) a deny-list only blocks the fields you listed, so a new sensitive field a teammate adds is logged by default; an allow-list only ever passes the fields you named safe. (3) a secret can hide inside a nested object under an innocent key, so the safe choice is to refuse nested objects rather than try to recurse and redact perfectly.</p>
<p><strong>Done when:</strong> your audit entries keep the investigative fields, carry a severity, and never contain a secret — not even nested.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">audit log</span><span class="v">The record of security-relevant actions, read after an incident.</span></div>
  <div class="kv"><span class="k">allow-list redaction</span><span class="v">Keep only named-safe fields; drop everything else.</span></div>
  <div class="kv"><span class="k">severity</span><span class="v">A tag (<code>alert</code>/<code>warn</code>/<code>info</code>) the runbook acts on.</span></div>
  <div class="kv"><span class="k">tamper-evident</span><span class="v">Stored where the app (and an attacker) cannot edit or delete it.</span></div>
  <div class="kv"><span class="k">PII</span><span class="v">Personal data (IP, user id) — kept bounded, access-restricted.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Write who/what/when/where/outcome and a severity; never a token, password, cookie, OTP or recovery code.</li>
<li>Strip by name and value with an allow-list, and refuse nested objects — a secret can hide in one.</li>
<li>Severity turns the audit log into a source of runbook signals (11.5).</li>
<li>Ship entries somewhere tamper-evident, so an attacker cannot erase their tracks.</li>
<li>Respect privacy: IP and user id are PII — retain bounded, restrict access.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-1-5-bi-mat-ro-o-dau', title: 'Back to 1.5 — the allow-list redactor', sub: 'There, building redact() as an allow-list and the five places a secret escapes. Here, that exact discipline applied to the audit log — keep what you named safe, drop the rest. One function, two chapters.', cta: 'OPEN LESSON 1.5 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Nhật ký kiểm toán: ghi gì, và tuyệt đối KHÔNG ghi gì</h2>
<p class="lead">Nhật ký kiểm toán là thứ bạn với tới sau một sự cố — ai làm gì, khi nào, từ đâu, kết quả gì. Hai luật kéo ngược nhau, và làm đúng cả hai là cả bài học: ghi <em>đủ</em> để tái dựng sự kiện, và ghi <em>không gì</em> mà bản thân là một bí mật, vì một token bị log là một vụ rò thứ hai nằm trong kho log.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> chọn các trường an toàn để log và những cái không bao giờ log; strip bí mật theo tên và theo giá trị với một allow-list; và gắn một severity mà runbook hành động theo.</p>
</div>

<h3>Ghi gì, và không bao giờ ghi gì</h3>
<p><strong>Ghi:</strong> dấu thời gian, actor (id người dùng), action, outcome, ip, request id, user agent — đủ để tái dựng "usr_1 đặt lại mật khẩu từ IP này lúc này, và thành công". <strong>Không bao giờ ghi:</strong> một mật khẩu, một token, một cookie phiên, một OTP, một mã khôi phục, một API key — không một lần, không cả lồng trong một trường khác. Những cái đó được đọc bởi mọi ai đọc được log và giữ hàng tháng; một bí mật trong số chúng là một vụ rò thường trực.</p>

<h3>Cái "log mọi thứ" ngây thơ</h3>
<p>"Log cả object sự kiện cho đầy đủ" đúng là cách một token đặt lại, một mật khẩu thô và một cookie phiên kết thúc trong log của bạn vĩnh viễn. Demo cho thấy cái sự kiện thô đó, rồi bản an toàn do <code>safeAudit()</code> tạo:</p>
${ma('javascript', CODE.audit)}
${ra(OUT['114-audit'])}
<p>Mục an toàn giữ các trường tái dựng sự cố và còn lại không chuỗi con bí mật nào — token, mật khẩu thô và cookie đều biến mất, kể cả cái nấp trong một object lồng.</p>

<h3>Strip theo tên và theo giá trị, với một allow-list</h3>
<p><code>safeAudit()</code> giữ một <em>allow-list</em> các trường an toàn và bỏ mọi cái nhạy cảm theo tên (<code>password</code>, <code>token</code>, <code>cookie</code>…, mọi chữ hoa thường hay cách viết), và nó từ chối object lồng nhau hoàn toàn vì một bí mật có thể nấp trong một cái. Đây lại là luật Chương 1: log chỉ cái bạn quyết định là an toàn, không bao giờ "mọi thứ trừ một deny-list". Một deny-list bỏ sót trường mới một đồng đội thêm tuần trước; một allow-list chỉ bao giờ cho qua cái bạn đặt tên — an toàn theo cấu trúc.</p>

<h3>Severity dẫn dắt phản ứng</h3>
<p>Mỗi mục mang một severity: <code>refresh_reuse_detected</code> và <code>mfa_disabled</code> là <code>alert</code> (một tín hiệu chiếm tài khoản — một yếu tố thứ hai bị tắt thường là bước đầu); <code>password_reset</code>, <code>email_changed</code> và <code>admin_action</code> là <code>warn</code>; một đăng nhập thường lệ là <code>info</code>. Severity là cái giám sát và runbook (11.5) hành động theo — nhật ký kiểm toán không chỉ là một bản ghi, nó là một nguồn tín hiệu.</p>

<h3>Chống-sửa, và riêng tư</h3>
<p>Một kẻ tấn công vào được sẽ cố xoá dấu vết, nên chuyển các mục audit ra khỏi máy tới một kho ứng dụng không sửa được (chỉ-thêm, một tài khoản riêng) — một log kẻ tấn công xoá được không phải một nhật ký kiểm toán. Và để ý con người, không chỉ bí mật: một IP và một id người dùng là dữ liệu cá nhân ở nhiều nơi. Giữ chúng vì bạn cần để điều tra, nhưng giữ trong một thời gian có hạn, hạn chế ai đọc chúng, và không bao giờ log về một người nhiều hơn mức sự cố đòi hỏi.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — che tại chỗ thay vì bỏ hẳn.</strong> Thay một giá trị token bằng <code>[redacted]</code> nhưng giữ trường thì hơn không gì, nhưng nó vẫn lộ rằng một token đã có mặt và liều một vụ rò một phần nếu bộ che bỏ sót một định dạng. Với mục audit, <em>bỏ</em> trường nhạy cảm hoàn toàn và từ chối object lồng — đừng cố mang một bí mật đã che đi theo. Bí mật an toàn duy nhất trong một log là một cái vắng mặt.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Cái gì vào một nhật ký kiểm toán, và cái gì tuyệt đối không?"</strong> — Ghi actor, action, outcome, thời gian, IP, request id. Không bao giờ một mật khẩu, token, cookie, OTP, mã khôi phục hay API key.</li>
<li><strong>"Allow-list hay deny-list cho việc che?"</strong> — Allow-list: log chỉ các trường bạn đặt tên là an toàn. Một deny-list bỏ sót trường thêm sau.</li>
<li><strong>"Vì sao chuyển nhật ký kiểm toán ra khỏi máy chủ?"</strong> — Để một kẻ tấn công xâm nhập máy không sửa hay xoá được bản ghi về hành động của chính họ — nó phải chống-sửa.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo11/audit.mjs</code>. Ba bí mật nào trong sự kiện thô, và bao nhiêu chuỗi con bí mật còn lại trong output <code>safeAudit</code>?</li>
<li>Vì sao một allow-list an toàn hơn một deny-list cho việc che?</li>
<li>Vì sao <code>safeAudit</code> bỏ object lồng hoàn toàn thay vì đi vào chúng?</li>
</ol>
<p><strong>Lời giải:</strong> (1) một token đặt lại, một mật khẩu thô và một cookie phiên (cộng một API key lồng); không chuỗi con bí mật nào còn lại. (2) một deny-list chỉ chặn các trường bạn liệt kê, nên một trường nhạy cảm mới một đồng đội thêm được log mặc định; một allow-list chỉ bao giờ cho qua các trường bạn đặt là an toàn. (3) một bí mật có thể nấp trong một object lồng dưới một khoá vô hại, nên lựa chọn an toàn là từ chối object lồng thay vì cố đệ quy và che hoàn hảo.</p>
<p><strong>Đạt khi:</strong> mục audit của bạn giữ các trường điều tra, mang một severity, và không bao giờ chứa một bí mật — không cả lồng nhau.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">audit log (nhật ký kiểm toán)</span><span class="v">Bản ghi các hành động liên quan bảo mật, đọc sau một sự cố.</span></div>
  <div class="kv"><span class="k">allow-list redaction</span><span class="v">Giữ chỉ các trường đặt-tên-an-toàn; bỏ mọi thứ khác.</span></div>
  <div class="kv"><span class="k">severity</span><span class="v">Một nhãn (<code>alert</code>/<code>warn</code>/<code>info</code>) runbook hành động theo.</span></div>
  <div class="kv"><span class="k">tamper-evident (chống-sửa)</span><span class="v">Lưu ở nơi ứng dụng (và một kẻ tấn công) không sửa hay xoá được.</span></div>
  <div class="kv"><span class="k">PII</span><span class="v">Dữ liệu cá nhân (IP, id người dùng) — giữ có hạn, hạn chế truy cập.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ghi ai/gì/khi nào/ở đâu/kết quả và một severity; không bao giờ một token, mật khẩu, cookie, OTP hay mã khôi phục.</li>
<li>Strip theo tên và giá trị với một allow-list, và từ chối object lồng — một bí mật nấp được trong một cái.</li>
<li>Severity biến nhật ký kiểm toán thành một nguồn tín hiệu runbook (11.5).</li>
<li>Chuyển các mục tới nơi chống-sửa, để một kẻ tấn công không xoá được dấu vết.</li>
<li>Tôn trọng riêng tư: IP và id người dùng là PII — giữ có hạn, hạn chế truy cập.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-1-5-bi-mat-ro-o-dau', title: 'Quay lại 1.5 — bộ che theo allow-list', sub: 'Ở đó, dựng redact() như một allow-list và năm chỗ một bí mật thoát ra. Ở đây, đúng kỷ luật đó áp cho nhật ký kiểm toán — giữ cái bạn đặt tên an toàn, bỏ phần còn lại. Một hàm, hai chương.', cta: 'MỞ BÀI 1.5 →' })}
</div>
`,
};
