/**
 * Authentication · Chương 10 · Lab 10 — Chống nhồi mật khẩu mà không khoá người thật. BÀI MỚI, slug auth-10-7-lab-chong-nhoi (sau quiz auth-10-6).
 * Máy chấm = scripts/cham-lab-10.mjs (6 phép, 10 điểm, đạt 7). Output: khởi đầu 1/10, yếu 3/10 (khoá tài khoản = DoS), tham khảo 10/10, npm test 49.
 */
import G from '../giang/auth-lab-10.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader10.split('\n');
const GR_T4 = GR.slice(GR.findIndex((l) => l.includes('T4 a real user who mistypes')), GR.findIndex((l) => l.includes('T5 a clean login'))).join('\n').trim();
const SETUP = `cp -r lab10/starter lab10/my
node scripts/cham-lab-10.mjs lab10/my      # pure — no database, no network`;

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails…</th></tr></thead>
<tbody>
<tr><td>T1 a flooding IP is blocked</td><td>2</td><td>a machine-gun of attempts runs unthrottled</td></tr>
<tr><td>T2 a spraying IP (many accounts) is blocked</td><td>2</td><td>the spray's signature goes unnoticed</td></tr>
<tr><td>T3 a breached password is challenged</td><td>1.5</td><td>the stuffing tell is ignored</td></tr>
<tr><td>T4 a mistyping real user is challenged, NEVER blocked</td><td>2</td><td>the attacker locks real users (a DoS)</td></tr>
<tr><td>T5 a clean login is allowed</td><td>1</td><td>normal users are needlessly challenged</td></tr>
<tr><td>T6 a solved challenge clears soft signals, not the flood</td><td>1.5</td><td>a solver farm passes the hard block</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt…</th></tr></thead>
<tbody>
<tr><td>T1 một IP đang dội bị block</td><td>2</td><td>một khẩu liên thanh các lượt thử chạy không bị kìm</td></tr>
<tr><td>T2 một IP đang phun (nhiều tài khoản) bị block</td><td>2</td><td>chữ ký của đợt phun bị bỏ sót</td></tr>
<tr><td>T3 một mật khẩu đã lộ bị challenge</td><td>1,5</td><td>dấu hiệu nhồi bị bỏ qua</td></tr>
<tr><td>T4 một người thật gõ sai bị challenge, KHÔNG BAO GIỜ block</td><td>2</td><td>kẻ tấn công khoá người dùng thật (một DoS)</td></tr>
<tr><td>T5 một đăng nhập sạch được allow</td><td>1</td><td>người dùng bình thường bị thách đố vô cớ</td></tr>
<tr><td>T6 một thách đố đã giải xoá tín hiệu mềm, không xoá đợt dội</td><td>1,5</td><td>một trại giải vượt qua khoá cứng</td></tr>
</tbody>
</table>`;

export default {
  title: "Lab 10 — Defend against credential stuffing without locking real users|||Lab 10 — Chống nhồi mật khẩu mà không khoá người thật",
  slug: 'auth-10-7-lab-chong-nhoi',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab Chương 10, thang 10 điểm (đạt 7) chấm bằng máy: viết decide(signal) — phòng thủ LabFlow ID trước một đợt nhồi mật khẩu mà KHÔNG khoá những người dùng thật mà kẻ tấn công đang dội qua. signal = { accountFails, ipFails, ipAccounts, breached, solvedChallenge } ⇒ allow/challenge/block. Luật: IP dội (ipFails ≥ 100) hay phun (ipAccounts ≥ 50) ⇒ block kể cả với solved challenge (trại giải vượt CAPTCHA); mật khẩu đã lộ không solved ⇒ challenge; IP đáng ngờ/tài khoản sai nhiều không solved ⇒ challenge (KHÔNG block — người thật gõ sai không bị khoá); còn lại allow. Output thật: khởi đầu 1/10; bản "yếu" khoá tài khoản sau 5 lần sai ⇒ 3/10 (chặn trường hợp hiển nhiên NHƯNG khoá chủ thật — đúng con lỗi lab bắt); tham khảo src/defense/stuffing.js 10/10, 49 test xanh.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lab 10</span>
<h2>Defend against credential stuffing without locking real users</h2>
<p class="lead">30–60 minutes. You write <code>decide(signal)</code> — the function that defends LabFlow ID against a credential-stuffing spray <em>without</em> locking out the real users the attacker is spraying through. The whole difficulty is the second half: an account lockout stops the attack and becomes the attacker's denial-of-service.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> turn mixed login traffic into an allow / challenge / block decision; defend the IP and the spread without ever locking a single account; and read a grader failure as the exact bypass or DoS it opens.</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v0.10. The grader is pure — no database, no network:
${ma('bash', SETUP)}</li>
<li>Grade the empty starter once:
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab10/my/index.js</code>. Export <code>decide</code>. <code>signal = { accountFails, ipFails, ipAccounts, breached, solvedChallenge }</code> ⇒ <code>'allow' | 'challenge' | 'block'</code>. Do NOT import <code>../../src/defense/stuffing.js</code> — that is the answer.</li>
</ol>

<h3>Your task — the rules, in order</h3>
<p>A flooding IP (<code>ipFails ≥ 100</code>) or a spraying IP (<code>ipAccounts ≥ 50</code>) ⇒ <code>block</code>, even with a solved challenge. A breached password with no solved challenge ⇒ <code>challenge</code>. A suspicious IP (<code>ipFails ≥ 20</code>) or many account fails (<code>≥ 10</code>) with no solved challenge ⇒ <code>challenge</code>. Otherwise ⇒ <code>allow</code>.</p>

<h3>The one rule that matters most</h3>
<p>Never <code>block</code> on <code>accountFails</code> alone. A single account that fails a lot is <em>challenged</em>, not blocked — because the "attacker" might be its real owner mistyping, and locking them is the DoS. The hard block is for the IP, never the account. The grader weights this at 2 points:</p>
${ma('javascript', GR_T4)}

<h3>How it is graded: 6 checks, 10 points, pass = 7</h3>
${CHECKS_EN}

<h3>A first attempt that "stops the attack"</h3>
<p>This version returns <code>block</code> after five account failures — the naive lockout — and has no spread signal and ignores a solved challenge. On a quick test it looks like it works:</p>
${ma('javascript', CODE.yeu10)}
${ra(OUT['lab-yeu'])}
<ul>
<li><strong>T4:</strong> it blocks on <code>accountFails ≥ 5</code> — so the attacker locks every real account on purpose. This is the DoS the whole lab exists to prevent.</li>
<li><strong>T2:</strong> no spread signal — an IP touching thousands of accounts is not blocked by it.</li>
<li><strong>T6:</strong> it ignores <code>solvedChallenge</code>, so a real user cannot clear a soft signal.</li>
<li>It passes T1 (flood block) and T5 (allow) — 3 out of 10.</li>
</ul>

<h3>The measured run behind the lab</h3>
<p>Why this matters: <code>demo10/stuffing-run.mjs</code> replays a 10k spray plus real users. Account lockout lets the attacker lock real users and one breached reuse still gets in; the reference <code>decide()</code> lets zero attacker logins through and locks zero real users.</p>

<h3>Hints (light → strong)</h3>
<ol>
<li>Check the two hard IP blocks (<code>ipFails</code>, <code>ipAccounts</code>) FIRST — they must survive a solved challenge.</li>
<li>Then the breached-password challenge, cleared by a solved challenge.</li>
<li>Then the soft signals (<code>ipFails ≥ 20</code> OR <code>accountFails ≥ 10</code>), also cleared by a solved challenge — and always <code>challenge</code>, never <code>block</code>.</li>
<li>Default to <code>allow</code> so a normal login reaches the password check.</li>
</ol>

<h3>Reference solution — <code>src/defense/stuffing.js</code></h3>
<p>The reference is the real defence, shown in lesson 10.1. Its grade, and the project's tests:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-10.mjs lab10/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), twice in a row.</li>
<li>A flooding and a spraying IP both block; a breached password is challenged; a mistyping real user is challenged, never blocked; a solved challenge clears soft signals but not the hard flood.</li>
<li>You can explain why a single account is never hard-blocked on its own fail count.</li>
</ul>
<p><strong>Done when:</strong> your defence scores ≥ 7/10 twice in a row, and you can say what each failed check would open — a bypass or a self-inflicted DoS.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Lab 10</span>
<h2>Chống nhồi mật khẩu mà không khoá người thật</h2>
<p class="lead">30–60 phút. Bạn viết <code>decide(signal)</code> — hàm phòng thủ LabFlow ID trước một đợt nhồi mật khẩu mà <em>không</em> khoá những người dùng thật mà kẻ tấn công đang dội qua. Cả cái khó nằm ở nửa sau: một khoá tài khoản chặn cú tấn công rồi trở thành cú từ chối dịch vụ của chính kẻ tấn công.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> biến lưu lượng đăng nhập trộn lẫn thành một quyết định allow / challenge / block; phòng thủ IP và độ lan mà không bao giờ khoá một tài khoản đơn lẻ; và đọc một dòng chấm trượt như đúng cú bypass hay DoS nó mở ra.</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v0.10. Máy chấm thuần — không cơ sở dữ liệu, không mạng:
${ma('bash', SETUP)}</li>
<li>Chấm bản khởi đầu rỗng một lần:
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab10/my/index.js</code>. Xuất <code>decide</code>. <code>signal = { accountFails, ipFails, ipAccounts, breached, solvedChallenge }</code> ⇒ <code>'allow' | 'challenge' | 'block'</code>. ĐỪNG import <code>../../src/defense/stuffing.js</code> — đó là đáp án.</li>
</ol>

<h3>Nhiệm vụ — các luật, theo thứ tự</h3>
<p>Một IP đang dội (<code>ipFails ≥ 100</code>) hay một IP đang phun (<code>ipAccounts ≥ 50</code>) ⇒ <code>block</code>, kể cả với một thách đố đã giải. Một mật khẩu đã lộ không kèm thách đố đã giải ⇒ <code>challenge</code>. Một IP đáng ngờ (<code>ipFails ≥ 20</code>) hay nhiều lần sai tài khoản (<code>≥ 10</code>) không kèm thách đố đã giải ⇒ <code>challenge</code>. Còn lại ⇒ <code>allow</code>.</p>

<h3>Luật quan trọng nhất</h3>
<p>Không bao giờ <code>block</code> chỉ theo <code>accountFails</code>. Một tài khoản đơn lẻ sai nhiều thì bị <em>challenge</em>, không block — vì "kẻ tấn công" có thể là chủ thật của nó đang gõ sai, và khoá họ chính là DoS. Khoá cứng dành cho IP, không bao giờ cho tài khoản. Máy chấm cho nó 2 điểm:</p>
${ma('javascript', GR_T4)}

<h3>Chấm thế nào: 6 phép, 10 điểm, đạt 7</h3>
${CHECKS_VI}

<h3>Một lần thử đầu "chặn được cú tấn công"</h3>
<p>Bản này trả <code>block</code> sau năm lần sai tài khoản — khoá ngây thơ — và không có tín hiệu lan và bỏ qua một thách đố đã giải. Trên một phép thử nhanh nó trông như chạy:</p>
${ma('javascript', CODE.yeu10)}
${ra(OUT['lab-yeu'])}
<ul>
<li><strong>T4:</strong> nó block khi <code>accountFails ≥ 5</code> — nên kẻ tấn công khoá mọi tài khoản thật một cách cố ý. Đây là cú DoS mà cả lab tồn tại để ngăn.</li>
<li><strong>T2:</strong> không có tín hiệu lan — một IP chạm hàng nghìn tài khoản không bị nó block.</li>
<li><strong>T6:</strong> nó bỏ qua <code>solvedChallenge</code>, nên một người dùng thật không xoá được một tín hiệu mềm.</li>
<li>Nó qua T1 (block đợt dội) và T5 (allow) — 3 trên 10.</li>
</ul>

<h3>Lượt chạy đo thật sau lab</h3>
<p>Vì sao điều này quan trọng: <code>demo10/stuffing-run.mjs</code> phát lại một đợt 10k cộng người dùng thật. Khoá tài khoản để kẻ tấn công khoá người dùng thật và một lần dùng lại mật khẩu đã lộ vẫn lọt; <code>decide()</code> tham khảo cho không lần đăng nhập nào của kẻ tấn công lọt và khoá không người dùng thật nào.</p>

<h3>Gợi ý (nhẹ → mạnh)</h3>
<ol>
<li>Kiểm hai khoá IP cứng (<code>ipFails</code>, <code>ipAccounts</code>) TRƯỚC — chúng phải sống sót qua một thách đố đã giải.</li>
<li>Rồi thách đố mật khẩu đã lộ, được xoá bởi một thách đố đã giải.</li>
<li>Rồi các tín hiệu mềm (<code>ipFails ≥ 20</code> HOẶC <code>accountFails ≥ 10</code>), cũng được xoá bởi một thách đố đã giải — và luôn <code>challenge</code>, không bao giờ <code>block</code>.</li>
<li>Mặc định <code>allow</code> để một đăng nhập bình thường tới được phép kiểm mật khẩu.</li>
</ol>

<h3>Lời giải tham khảo — <code>src/defense/stuffing.js</code></h3>
<p>Bản tham khảo là phòng thủ thật, hiện ở bài 10.1. Điểm của nó, và bộ test của dự án:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-10.mjs lab10/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần liên tiếp.</li>
<li>Một IP dội và một IP phun đều block; một mật khẩu đã lộ bị challenge; một người dùng thật gõ sai bị challenge, không bao giờ block; một thách đố đã giải xoá tín hiệu mềm nhưng không xoá đợt dội cứng.</li>
<li>Bạn giải thích được vì sao một tài khoản đơn lẻ không bao giờ bị khoá cứng theo số lần sai của chính nó.</li>
</ul>
<p><strong>Đạt khi:</strong> phòng thủ của bạn đạt ≥ 7/10 hai lần liên tiếp, và bạn nói được mỗi phép chấm trượt sẽ mở ra cái gì — một cú bypass hay một DoS tự gây.</p>
</div>
`,
};
