/**
 * Authentication · Chương 6 · Lab 6 — Lớp vòng đời tài khoản của LabFlow ID. BÀI MỚI, slug auth-6-7-lab-vong-doi (trước quiz auth-6-6).
 * Máy chấm = scripts/cham-lab-6.mjs (6 phép, 10 điểm, đạt 7): đưa lifecycle() của người học một kho trong bộ nhớ + đồng hồ giả,
 * rồi điều khiển token một lần (phát/tiêu/dùng-một-lần/mục đích/hết hạn) + yêu cầu reset chống dò tài khoản.
 * Output thật: khởi đầu 0/10, lần thử đầu 3/10, tham khảo src/lifecycle/layer.js 10/10, npm test 39 pass.
 */
import G from '../giang/auth-lab-6.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader.split('\n');
const GR_T5 = GR.slice(GR.findIndex((l) => l.includes('T5 enumeration-safe reset')), GR.findIndex((l) => l.includes('T6 deleted account'))).join('\n').trim();
const SETUP = `cp -r lab6/starter lab6/my
node scripts/cham-lab-6.mjs lab6/my      # in-memory store + fake clock; no database`;

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails, for a real user…</th></tr></thead>
<tbody>
<tr><td>T1 issue + consume: a token verifies the right user</td><td>1.5</td><td>no one can verify an email or reset a password</td></tr>
<tr><td>T2 single-use: the second consume returns USED</td><td>2</td><td>an intercepted reset link works again after it was used (6.3)</td></tr>
<tr><td>T3 purpose-bound: a reset token cannot verify an email</td><td>1.5</td><td>a verify link can be replayed to reset a password (6.2)</td></tr>
<tr><td>T4 expiry: reset dead after 15 min, verify after 30</td><td>1.5</td><td>a link in an archived mailbox still works months later</td></tr>
<tr><td>T5 reset mails a real account, NOTHING to a stranger</td><td>2</td><td>a "no account" email to a stranger enumerates your users (6.4)</td></tr>
<tr><td>T6 a deleted account is not mailed; a bad token never crashes</td><td>1.5</td><td>a deleted user gets reset mail; a junk token 500s</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt, với người dùng thật…</th></tr></thead>
<tbody>
<tr><td>T1 phát + tiêu: một token xác minh đúng người</td><td>1,5</td><td>chẳng ai xác minh được email hay reset được mật khẩu</td></tr>
<tr><td>T2 dùng một lần: lần tiêu thứ hai trả USED</td><td>2</td><td>một đường dẫn reset bị chặn bắt vẫn chạy lại sau khi đã dùng (6.3)</td></tr>
<tr><td>T3 ràng mục đích: một token reset không xác minh được email</td><td>1,5</td><td>một đường dẫn xác minh bị phát lại để reset mật khẩu (6.2)</td></tr>
<tr><td>T4 hết hạn: reset chết sau 15 phút, xác minh sau 30</td><td>1,5</td><td>một đường dẫn trong hộp thư lưu trữ vẫn chạy nhiều tháng sau</td></tr>
<tr><td>T5 reset gửi thư cho tài khoản thật, KHÔNG gì cho người lạ</td><td>2</td><td>một thư "không có tài khoản" cho người lạ làm lộ danh sách người dùng (6.4)</td></tr>
<tr><td>T6 một tài khoản đã xoá không bị gửi thư; một token hỏng không bao giờ sập</td><td>1,5</td><td>một người đã xoá nhận thư reset; một token rác làm 500</td></tr>
</tbody>
</table>`;

export default {
  title: "Lab 6 — LabFlow ID's account-lifecycle layer|||Lab 6 — Lớp vòng đời tài khoản của LabFlow ID",
  slug: 'auth-6-7-lab-vong-doi',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab Chương 6, thang 10 điểm (đạt 7) chấm bằng máy: viết lifecycle() của LabFlow ID — issueToken/consumeToken/requestPasswordReset. Máy chấm đưa một kho trong bộ nhớ và đồng hồ giả rồi điều khiển token một lần (phát/tiêu/dùng-một-lần/ràng-mục-đích/hết-hạn) và yêu cầu reset chống dò tài khoản (chỉ tài khoản thật được gửi thư, tài khoản đã xoá không, token hỏng không sập). Output thật của bản khởi đầu (0/10), lần thử đầu "chạy được" (3/10) và lời giải tham khảo src/lifecycle/layer.js (10/10, 39 test xanh).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab 6</span>
<h2>LabFlow ID's account-lifecycle layer</h2>
<p class="lead">60–90 minutes. You write the layer behind email verification (6.2) and password reset (6.3): how a one-time token is issued, consumed exactly once, bound to its purpose, and expired; and how a reset request is answered without revealing whether the email exists (6.4). A grader passes your layer an in-memory store and a fake clock, then drives every path.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> ship a lifecycle layer you can defend line by line; read a grader's failure and name the attack it allows; and reuse the layer for the rest of LabFlow ID, where every account action flows through it.</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v0.6 (lesson 6.1). The grader needs no database — it passes an in-memory store with the methods <code>pgStore</code> has:
${ma('bash', SETUP)}</li>
<li>Grade the empty starter once:
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab6/my/index.js</code>. Keep <code>export function lifecycle(config)</code> returning <code>{ issueToken, consumeToken, requestPasswordReset }</code>. Allowed: <code>../../src/crypto</code> (<code>newToken</code>, <code>tokenDigest</code>). Do NOT import <code>../../src/lifecycle/layer.js</code> — that is the answer.</li>
</ol>

<h3>Your task — one-time tokens and an enumeration-safe reset</h3>
<ul>
<li><strong><code>issueToken(userId, purpose)</code></strong> — make a token with <code>newToken</code>, store a row with its <code>tokenDigest</code>, purpose and expiry (30 min verify, 15 min reset), return <code>{ token, row }</code>. Why: 6.2.</li>
<li><strong><code>consumeToken(purpose, token, {at})</code></strong> — look up by digest; reject <code>INVALID</code> (wrong token or wrong purpose) / <code>USED</code> / <code>EXPIRED</code>; otherwise mark used and return <code>{ userId }</code>. Why: 6.2, 6.3.</li>
<li><strong><code>requestPasswordReset(users, email, { send, sync })</code></strong> — find the active account; if it exists, issue a reset token and email it; if not, do nothing and send no "no account" mail. Always return <code>{ ok: true }</code>. Why: 6.4.</li>
</ul>

<h3>How it is graded: 6 checks, 10 points, pass = 7</h3>
${CHECKS_EN}
<p>The heart of the chapter is T5 — a reset request must mail a real account and <em>nothing</em> to a stranger:</p>
${ma('javascript', GR_T5)}

<h3>A first attempt that "works"</h3>
<p>This attempt issues and consumes tokens and even emails a reset link. But it never marks a token used, ignores the purpose, and — trying to be helpful — emails "no account found" to a stranger, which is exactly how an attacker enumerates who is registered.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>3 out of 10, and each failure is an attack you ran:</p>
<ul>
<li><strong>T2:</strong> <code>consumeToken</code> never checks <code>usedAt</code>, so a used reset link works again — a replay (6.3).</li>
<li><strong>T3:</strong> no purpose check, so a verify token resets a password (6.2).</li>
<li><strong>T5 / T6:</strong> it emails a stranger "no account found" and emails a deleted account — both leak who exists (6.4).</li>
<li>It passes only the plumbing: <code>issueToken</code> + the round trip (T1) and expiry (T4).</li>
</ul>

<h3>Hints (light → strong)</h3>
<ol>
<li>Each check names its lesson; rerun that demo (<code>demo6/scanner.sh</code>, <code>demo6/reset.sh</code>, <code>demo6/enum-timing.mjs</code>).</li>
<li>In <code>consumeToken</code>: fetch by <code>tokenDigest(token)</code>; reject if missing or <code>rec.purpose !== purpose</code>; then check <code>usedAt</code>, then <code>expiresAt</code>; only then <code>markUsed</code>.</li>
<li>In <code>requestPasswordReset</code>: look the account up, and in the branch where it does NOT exist, do nothing at all — no email, no row. Silence is the defence.</li>
<li>Do the insert + send off the response path (don't await) unless the caller passes <code>sync</code> — so a real account is not measurably slower than a fake one (6.4).</li>
</ol>

<h3>Reference solution — LabFlow ID's <code>src/lifecycle/layer.js</code></h3>
<p>The reference is the real layer, shown line by line in lessons 6.2, 6.3 and 6.4. Its grade, and the project's tests:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-6.mjs lab6/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), twice in a row.</li>
<li>A token works exactly once, a verify token cannot reset, a stranger's reset request sends no mail, and <code>npm test</code> still passes.</li>
<li>You can explain T2 (single-use) and T5 (no "no account" email) in your own words.</li>
</ul>
<p><strong>Done when:</strong> your layer scores ≥ 7/10 twice in a row, and you can name the attack behind every failed check.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab 6</span>
<h2>Lớp vòng đời tài khoản của LabFlow ID</h2>
<p class="lead">60–90 phút. Bạn viết cái lớp đứng sau xác minh email (6.2) và đặt lại mật khẩu (6.3): một token một lần được phát, tiêu đúng một lần, ràng theo mục đích, và hết hạn thế nào; và một yêu cầu reset được trả lời thế nào mà không lộ email có tồn tại hay không (6.4). Một máy chấm đưa lớp của bạn một kho trong bộ nhớ và một đồng hồ giả, rồi điều khiển mọi đường.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> đưa lên một lớp vòng đời bạn bảo vệ được từng dòng; đọc một dòng trượt của máy chấm và gọi tên cú tấn công nó cho phép; và dùng lại lớp này cho phần còn lại của LabFlow ID, nơi mọi hành động tài khoản đi qua nó.</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v0.6 (bài 6.1). Máy chấm không cần cơ sở dữ liệu — nó đưa một kho trong bộ nhớ có các phương thức như <code>pgStore</code>:
${ma('bash', SETUP)}</li>
<li>Chấm bản khởi đầu rỗng một lần:
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab6/my/index.js</code>. Giữ <code>export function lifecycle(config)</code> trả về <code>{ issueToken, consumeToken, requestPasswordReset }</code>. Được dùng: <code>../../src/crypto</code> (<code>newToken</code>, <code>tokenDigest</code>). ĐỪNG import <code>../../src/lifecycle/layer.js</code> — đó là đáp án.</li>
</ol>

<h3>Nhiệm vụ — token một lần và một lệnh reset chống dò tài khoản</h3>
<ul>
<li><strong><code>issueToken(userId, purpose)</code></strong> — tạo một token bằng <code>newToken</code>, lưu một dòng với <code>tokenDigest</code> của nó, mục đích và hạn (30 phút xác minh, 15 phút reset), trả <code>{ token, row }</code>. Vì sao: 6.2.</li>
<li><strong><code>consumeToken(purpose, token, {at})</code></strong> — tra theo digest; từ chối <code>INVALID</code> (sai token hoặc sai mục đích) / <code>USED</code> / <code>EXPIRED</code>; còn lại đánh dấu đã dùng và trả <code>{ userId }</code>. Vì sao: 6.2, 6.3.</li>
<li><strong><code>requestPasswordReset(users, email, { send, sync })</code></strong> — tìm tài khoản đang hoạt động; nếu có, phát một token reset và gửi; nếu không, không làm gì và không gửi thư "không có tài khoản". Luôn trả <code>{ ok: true }</code>. Vì sao: 6.4.</li>
</ul>

<h3>Chấm thế nào: 6 phép, 10 điểm, đạt 7</h3>
${CHECKS_VI}
<p>Trái tim của chương là T5 — một yêu cầu reset phải gửi thư cho một tài khoản thật và <em>không gì</em> cho một người lạ:</p>
${ma('javascript', GR_T5)}

<h3>Một lần thử đầu "chạy được"</h3>
<p>Lần thử này phát và tiêu token và thậm chí gửi một link reset. Nhưng nó không bao giờ đánh dấu token đã dùng, lờ mục đích, và — cố tỏ ra hữu ích — gửi "không tìm thấy tài khoản" cho một người lạ, đúng là cách một kẻ tấn công dò ai đã đăng ký.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>3 trên 10, và mỗi lần trượt là một cú tấn công bạn đã chạy:</p>
<ul>
<li><strong>T2:</strong> <code>consumeToken</code> không bao giờ kiểm <code>usedAt</code>, nên một đường dẫn reset đã dùng vẫn chạy lại — một lần phát lại (6.3).</li>
<li><strong>T3:</strong> không kiểm mục đích, nên một token xác minh reset được mật khẩu (6.2).</li>
<li><strong>T5 / T6:</strong> nó gửi cho một người lạ "không tìm thấy tài khoản" và gửi cho một tài khoản đã xoá — cả hai làm lộ ai tồn tại (6.4).</li>
<li>Nó chỉ qua phần ống nước: <code>issueToken</code> + vòng khứ hồi (T1) và hết hạn (T4).</li>
</ul>

<h3>Gợi ý (nhẹ → mạnh)</h3>
<ol>
<li>Phép chấm nào cũng gọi tên bài của nó; chạy lại demo đó (<code>demo6/scanner.sh</code>, <code>demo6/reset.sh</code>, <code>demo6/enum-timing.mjs</code>).</li>
<li>Trong <code>consumeToken</code>: lấy theo <code>tokenDigest(token)</code>; từ chối nếu thiếu hoặc <code>rec.purpose !== purpose</code>; rồi kiểm <code>usedAt</code>, rồi <code>expiresAt</code>; chỉ khi đó mới <code>markUsed</code>.</li>
<li>Trong <code>requestPasswordReset</code>: tra tài khoản, và ở nhánh nó KHÔNG tồn tại, đừng làm gì cả — không email, không dòng. Im lặng là lớp phòng.</li>
<li>Làm phần chèn + gửi ngoài đường phản hồi (đừng await) trừ khi người gọi truyền <code>sync</code> — để một tài khoản thật không chậm hơn một cái giả một cách đo được (6.4).</li>
</ol>

<h3>Lời giải tham khảo — <code>src/lifecycle/layer.js</code> của LabFlow ID</h3>
<p>Bản tham khảo là lớp thật, hiện từng dòng ở bài 6.2, 6.3 và 6.4. Điểm của nó, và bộ test của dự án:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-6.mjs lab6/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần liên tiếp.</li>
<li>Một token chạy đúng một lần, một token xác minh không reset được, yêu cầu reset của người lạ không gửi thư, và <code>npm test</code> vẫn qua.</li>
<li>Bạn giải thích được T2 (dùng một lần) và T5 (không thư "không có tài khoản") bằng lời của mình.</li>
</ul>
<p><strong>Đạt khi:</strong> lớp của bạn đạt ≥ 7/10 hai lần liên tiếp, và bạn gọi được tên cú tấn công sau mỗi phép chấm trượt.</p>
</div>
`,
};
