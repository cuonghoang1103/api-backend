/**
 * Authentication · Chương 11 · Lab 11 — Nhật ký kiểm toán và runbook. BÀI MỚI, slug auth-11-7-lab-audit-runbook (sau quiz auth-11-6).
 * Máy chấm = scripts/cham-lab-11.mjs (6 phép, 10 điểm, đạt 7). Output: khởi đầu 2/10, yếu 2/10 (log mọi thứ + page mọi thứ), tham khảo 10/10, npm test 54.
 */
import G from '../giang/auth-lab-11.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader11.split('\n');
const GR_T2 = GR.slice(GR.findIndex((l) => l.includes('T2 safeAudit never writes a token')), GR.findIndex((l) => l.includes('T3 safeAudit'))).join('\n').trim();
const GR_T6 = GR.slice(GR.findIndex((l) => l.includes('T6 triage routes')), GR.findIndex((l) => l.includes('const total'))).join('\n').trim();

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails…</th></tr></thead>
<tbody>
<tr><td>T1 safeAudit keeps the safe, necessary fields</td><td>2</td><td>you cannot reconstruct the incident</td></tr>
<tr><td>T2 safeAudit never writes a token value</td><td>2</td><td>a token sits in your log store forever</td></tr>
<tr><td>T3 safeAudit never writes a password (any spelling)</td><td>1.5</td><td>plaintext passwords land in logs</td></tr>
<tr><td>T4 safeAudit drops nested objects</td><td>1</td><td>a secret hides inside and leaks</td></tr>
<tr><td>T5 safeAudit tags severity by event type</td><td>1.5</td><td>monitoring cannot prioritise</td></tr>
<tr><td>T6 triage routes each signal, incl. the unknown</td><td>2</td><td>the on-call pages on noise or ignores the attack</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt…</th></tr></thead>
<tbody>
<tr><td>T1 safeAudit giữ các trường an toàn, cần thiết</td><td>2</td><td>bạn không tái dựng được sự cố</td></tr>
<tr><td>T2 safeAudit không bao giờ ghi một token</td><td>2</td><td>một token nằm trong kho log vĩnh viễn</td></tr>
<tr><td>T3 safeAudit không bao giờ ghi một mật khẩu (mọi cách viết)</td><td>1,5</td><td>mật khẩu thô rơi vào log</td></tr>
<tr><td>T4 safeAudit bỏ object lồng nhau</td><td>1</td><td>một bí mật nấp trong và rò</td></tr>
<tr><td>T5 safeAudit gắn severity theo loại sự kiện</td><td>1,5</td><td>giám sát không ưu tiên được</td></tr>
<tr><td>T6 triage định tuyến mỗi tín hiệu, kể cả cái lạ</td><td>2</td><td>người trực page vì ồn hoặc bỏ qua cú tấn công</td></tr>
</tbody>
</table>`;

export default {
  title: "Lab 11 — The audit log and the runbook|||Lab 11 — Nhật ký kiểm toán và runbook",
  slug: 'auth-11-7-lab-audit-runbook',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab Chương 11, thang 10 điểm (đạt 7) chấm bằng máy: viết HAI hàm thuần chạy dịch vụ. safeAudit(event) ⇒ một mục log GIỮ đủ (ts, actor, action, outcome, ip, requestId, userAgent) + một severity (refresh_reuse/mfa_disabled ⇒ alert; password_reset/email_changed/admin_action ⇒ warn; còn lại info) và BỎ mọi trường nhạy cảm (password, token, cookie, authorization, secret, otp, recoveryCode, sessionId, apiKey — mọi chữ hoa/thường/gạch) + bỏ object lồng (bí mật nấp được trong). triage(signal) ⇒ page/investigate/auto/ignore: refresh_reuse_spike/error_5xx_spike ⇒ page; failed_login_burst/admin_action ⇒ auto; new_country_logins/breached_pw_rate ⇒ investigate; không tên ⇒ ignore; LẠ ⇒ investigate (không bao giờ im lặng bỏ qua). Output thật: khởi đầu 2/10; bản "yếu" log cả sự kiện + page mọi thứ ⇒ 2/10 (token+mật khẩu vào log vĩnh viễn, người trực tắt chuông — cú 10.4 trong đội); tham khảo src/ops/audit.js + triage.js 10/10, 54 test xanh.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lab 11</span>
<h2>The audit log and the runbook</h2>
<p class="lead">30–60 minutes. You write the two pure functions that run the service after it is attacked: <code>safeAudit(event)</code> — the log entry that keeps enough to investigate and leaks nothing — and <code>triage(signal)</code> — the runbook that routes each monitoring signal to page, investigate, auto or ignore. The grader checks both.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> produce an audit entry that survives a security review; strip secrets by name, value and nesting; and encode an on-call policy that pages rarely and never ignores the unknown.</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v0.11. The grader is pure — no database, no network:
${ma('bash', 'cp -r lab11/starter lab11/my\nnode scripts/cham-lab-11.mjs lab11/my')}</li>
<li>Grade the empty starter once:
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab11/my/index.js</code>. Export <code>safeAudit</code> and <code>triage</code>. Do NOT import <code>../../src/ops/audit.js</code> or <code>triage.js</code> — those are the answers.</li>
</ol>

<h3>safeAudit — keep enough, leak nothing</h3>
<p>Keep <code>ts, actor, action, outcome, ip, requestId, userAgent</code>. Drop every sensitive field entirely — <code>password, token, cookie, authorization, secret, otp, recoveryCode, sessionId, apiKey</code>, any case, underscores or dashes — and drop nested objects (a secret can hide inside one). Add a severity: <code>refresh_reuse_detected</code> / <code>mfa_disabled</code> ⇒ <code>alert</code>; <code>password_reset</code> / <code>email_changed</code> / <code>admin_action</code> ⇒ <code>warn</code>; everything else ⇒ <code>info</code>. The highest-value check is that a token value never survives:</p>
${ma('javascript', GR_T2)}

<h3>triage — the runbook as a function</h3>
<p><code>refresh_reuse_spike</code> / <code>error_5xx_spike</code> ⇒ <code>page</code>; <code>failed_login_burst</code> / <code>admin_action</code> ⇒ <code>auto</code>; <code>new_country_logins</code> / <code>breached_pw_rate</code> ⇒ <code>investigate</code>; a nameless signal ⇒ <code>ignore</code>; an <em>unknown</em> name ⇒ <code>investigate</code> — never silently ignore a signal nobody classified:</p>
${ma('javascript', GR_T6)}

<h3>How it is graded: 6 checks, 10 points, pass = 7</h3>
${CHECKS_EN}

<h3>A first attempt that "logs everything for completeness"</h3>
<p>This version logs the whole event and pages on every signal. It looks thorough and is the exact double failure the lab exists to catch:</p>
${ma('javascript', CODE.yeu11)}
${ra(OUT['lab-yeu'])}
<ul>
<li><strong>T2/T3/T4:</strong> it copies the token, the password and the nested secret straight into the entry — now sitting in your log store forever.</li>
<li><strong>T5:</strong> severity is always <code>info</code>, so monitoring cannot prioritise.</li>
<li><strong>T6:</strong> it pages on every signal — within a week the on-call silences the pager, and the one real alert is lost (the Chapter 10 fatigue attack, inside the team).</li>
<li>It passes only T1 (it keeps the safe fields too). 2 out of 10.</li>
</ul>

<h3>Reference solution — <code>src/ops/audit.js</code> + <code>triage.js</code></h3>
<p>The reference is the real thing, shown in 11.4 and 11.5. Its grade, and the project's tests:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-11.mjs lab11/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), twice in a row.</li>
<li>No token, password or nested secret survives <code>safeAudit</code>; severity is right per event; <code>triage</code> pages only for page-worthy signals and sends the unknown to investigate.</li>
<li>You can explain why "log everything" and "page on everything" are both failures.</li>
</ul>
<p><strong>Done when:</strong> your two functions score ≥ 7/10 twice in a row, and you can name what each failed check would open — a logged secret or a deaf on-call.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Lab 11</span>
<h2>Nhật ký kiểm toán và runbook</h2>
<p class="lead">30–60 phút. Bạn viết hai hàm thuần chạy dịch vụ sau khi nó bị tấn công: <code>safeAudit(event)</code> — mục log giữ đủ để điều tra và không rò gì — và <code>triage(signal)</code> — runbook định tuyến mỗi tín hiệu giám sát tới page, investigate, auto hay ignore. Máy chấm kiểm cả hai.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> tạo một mục audit sống sót qua một lần soát bảo mật; strip bí mật theo tên, giá trị và lồng nhau; và mã hoá một chính sách trực page hiếm và không bao giờ bỏ qua cái lạ.</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v0.11. Máy chấm thuần — không cơ sở dữ liệu, không mạng:
${ma('bash', 'cp -r lab11/starter lab11/my\nnode scripts/cham-lab-11.mjs lab11/my')}</li>
<li>Chấm bản khởi đầu rỗng một lần:
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab11/my/index.js</code>. Xuất <code>safeAudit</code> và <code>triage</code>. ĐỪNG import <code>../../src/ops/audit.js</code> hay <code>triage.js</code> — đó là các đáp án.</li>
</ol>

<h3>safeAudit — giữ đủ, không rò gì</h3>
<p>Giữ <code>ts, actor, action, outcome, ip, requestId, userAgent</code>. Bỏ mọi trường nhạy cảm hoàn toàn — <code>password, token, cookie, authorization, secret, otp, recoveryCode, sessionId, apiKey</code>, mọi chữ hoa thường, gạch dưới hay gạch ngang — và bỏ object lồng nhau (một bí mật nấp được trong một cái). Thêm một severity: <code>refresh_reuse_detected</code> / <code>mfa_disabled</code> ⇒ <code>alert</code>; <code>password_reset</code> / <code>email_changed</code> / <code>admin_action</code> ⇒ <code>warn</code>; còn lại ⇒ <code>info</code>. Phép giá trị nhất là một giá trị token không bao giờ sống sót:</p>
${ma('javascript', GR_T2)}

<h3>triage — runbook như một hàm</h3>
<p><code>refresh_reuse_spike</code> / <code>error_5xx_spike</code> ⇒ <code>page</code>; <code>failed_login_burst</code> / <code>admin_action</code> ⇒ <code>auto</code>; <code>new_country_logins</code> / <code>breached_pw_rate</code> ⇒ <code>investigate</code>; một tín hiệu không tên ⇒ <code>ignore</code>; một tên <em>lạ</em> ⇒ <code>investigate</code> — không bao giờ im lặng bỏ qua một tín hiệu chưa ai phân loại:</p>
${ma('javascript', GR_T6)}

<h3>Chấm thế nào: 6 phép, 10 điểm, đạt 7</h3>
${CHECKS_VI}

<h3>Một lần thử đầu "log mọi thứ cho đầy đủ"</h3>
<p>Bản này log cả sự kiện và page mọi tín hiệu. Nó trông kỹ lưỡng và là đúng cú thất bại kép mà lab tồn tại để bắt:</p>
${ma('javascript', CODE.yeu11)}
${ra(OUT['lab-yeu'])}
<ul>
<li><strong>T2/T3/T4:</strong> nó chép token, mật khẩu và bí mật lồng thẳng vào mục — giờ nằm trong kho log của bạn vĩnh viễn.</li>
<li><strong>T5:</strong> severity luôn là <code>info</code>, nên giám sát không ưu tiên được.</li>
<li><strong>T6:</strong> nó page mọi tín hiệu — trong một tuần người trực tắt chuông, và cái cảnh báo thật duy nhất lạc (cú tấn công mệt mỏi Chương 10, trong đội).</li>
<li>Nó chỉ qua T1 (nó giữ cả các trường an toàn). 2 trên 10.</li>
</ul>

<h3>Lời giải tham khảo — <code>src/ops/audit.js</code> + <code>triage.js</code></h3>
<p>Bản tham khảo là bản thật, hiện ở 11.4 và 11.5. Điểm của nó, và bộ test của dự án:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-11.mjs lab11/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần liên tiếp.</li>
<li>Không token, mật khẩu hay bí mật lồng nào sống qua <code>safeAudit</code>; severity đúng mỗi sự kiện; <code>triage</code> chỉ page cho tín hiệu đáng-page và đưa cái lạ tới investigate.</li>
<li>Bạn giải thích được vì sao "log mọi thứ" và "page mọi thứ" đều là thất bại.</li>
</ul>
<p><strong>Đạt khi:</strong> hai hàm của bạn đạt ≥ 7/10 hai lần liên tiếp, và bạn gọi được tên mỗi phép chấm trượt sẽ mở ra cái gì — một bí mật bị log hay một người trực điếc.</p>
</div>
`,
};
