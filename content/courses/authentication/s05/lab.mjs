/**
 * Authentication · Chương 5 · Lab 5 — Lớp refresh token của LabFlow ID. BÀI MỚI 03/11/2026, slug auth-5-7-lab-xoay-vong (trước quiz).
 * Máy chấm = scripts/cham-lab-5.mjs (8 phép, 10 điểm, đạt 7): đưa refreshLayer của người học một kho trong bộ nhớ + đồng hồ giả,
 * rồi điều khiển xoay vòng/tái dùng/cuộc đua/thiết bị. Output thật: khởi đầu 0/10, lần thử đầu 3,5/10, tham khảo src/refresh/layer.js 10/10, npm test 32 pass.
 */
import G from '../giang/auth-lab-5.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader.split('\n');
const GR_T3T4 = GR.slice(GR.findIndex((l) => l.includes('T3 reuse of a rotated token')), GR.findIndex((l) => l.includes('T5 outside grace'))).join('\n').trim();
const SETUP = `cp -r lab5/starter lab5/my
node scripts/cham-lab-5.mjs lab5/my      # in-memory store + fake clock; no database`;

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails, for a real user…</th></tr></thead>
<tbody>
<tr><td>T1 issue + rotate: a new token each time, same family</td><td>1.5</td><td>no one can refresh — they re-enter the password every 15 min</td></tr>
<tr><td>T2 the store keeps a SHA-256 digest, never the token</td><td>1</td><td>a leaked table is a list of working refresh tokens (lesson 1.3)</td></tr>
<tr><td>T3 reusing a rotated token revokes the whole family</td><td>2</td><td>a stolen refresh token works for 30 days undetected (5.2)</td></tr>
<tr><td>T4 the race: same token within grace returns the same child</td><td>1.5</td><td>two tabs log the real user out (5.5)</td></tr>
<tr><td>T5 outside the grace window, the same second use is theft</td><td>1</td><td>a replay is mistaken for a race and accepted</td></tr>
<tr><td>T6 invalid / expired / revoked, not flagged as theft</td><td>1</td><td>wrong error codes; a normal expiry looks like an attack</td></tr>
<tr><td>T7 listDevices: one row per live family, not per rotation</td><td>1</td><td>the devices page shows dozens of rows for one login (5.4)</td></tr>
<tr><td>T8 revokeDevice revokes one family; revokeAll revokes all</td><td>1</td><td>“sign out this device” kills all, or none (5.3)</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt, với người dùng thật…</th></tr></thead>
<tbody>
<tr><td>T1 issue + rotate: một token mới mỗi lần, cùng họ</td><td>1,5</td><td>chẳng ai refresh được — họ nhập lại mật khẩu mỗi 15 phút</td></tr>
<tr><td>T2 kho giữ digest SHA-256, không bao giờ giữ token</td><td>1</td><td>một bảng bị lộ là danh sách refresh token dùng được (bài 1.3)</td></tr>
<tr><td>T3 tái dùng một token đã xoay thu hồi cả họ</td><td>2</td><td>một refresh token bị trộm chạy 30 ngày không bị phát hiện (5.2)</td></tr>
<tr><td>T4 cuộc đua: cùng token trong ân hạn trả cùng cái con</td><td>1,5</td><td>hai tab đăng xuất người thật (5.5)</td></tr>
<tr><td>T5 ngoài cửa sổ ân hạn, cùng lần dùng thứ hai là trộm</td><td>1</td><td>một lần phát lại bị nhầm là cuộc đua và được chấp nhận</td></tr>
<tr><td>T6 invalid / expired / revoked, không báo là trộm</td><td>1</td><td>sai mã lỗi; một lần hết hạn thường trông như tấn công</td></tr>
<tr><td>T7 listDevices: một dòng cho mỗi họ sống, không theo lần xoay</td><td>1</td><td>trang thiết bị hiển thị hàng chục dòng cho một lần đăng nhập (5.4)</td></tr>
<tr><td>T8 revokeDevice thu hồi một họ; revokeAll thu hồi tất cả</td><td>1</td><td>"đăng xuất thiết bị này" giết tất cả, hoặc chẳng cái nào (5.3)</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 5 — LabFlow ID’s refresh-token layer|||Lab 5 — Lớp refresh token của LabFlow ID',
  slug: 'auth-5-7-lab-xoay-vong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 5, thang 10 điểm (đạt 7) chấm bằng máy: viết refreshLayer của LabFlow ID — issue/rotate/revokeFamily/revokeAll/revokeDevice/listDevices. Máy chấm đưa một kho trong bộ nhớ và đồng hồ giả rồi điều khiển xoay vòng, phát hiện tái dùng (thu hồi họ), cuộc đua trong/ngoài cửa sổ ân hạn, và trang thiết bị; output thật của bản khởi đầu (0/10), lần thử đầu "chạy được" (3,5/10) và lời giải tham khảo src/refresh/layer.js (10/10).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lab 5</span>
<h2>LabFlow ID’s refresh-token layer</h2>
<p class="lead">60–90 minutes. You write the layer that decides how LabFlow ID keeps a login alive for days without the password: how a refresh token rotates, how a reused one reveals theft, how the two-tab race is tolerated, and how devices are listed and revoked. A grader passes your layer an in-memory store and a fake clock, then drives every path of lessons 5.1–5.5.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> ship a refresh layer you can defend line by line; read a grader's failure and name the attack it allows; and reuse the layer for Chapter 6 (an account lifecycle that must end sessions) and Chapter 11 (moving the grace cache to Redis).</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v0.5 (lesson 5.1). The grader needs no database — it passes an in-memory store with the methods <code>pgStore</code> has:
${ma('bash', SETUP)}</li>
<li>Grade the empty starter once:
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab5/my/index.js</code>. Keep <code>export function refreshLayer(config)</code> returning <code>{ issue, rotate, revokeFamily, revokeAll, revokeDevice, listDevices }</code>. Allowed: <code>node:crypto</code> and <code>../../src/crypto</code> (<code>newToken</code>, <code>tokenDigest</code>). Do NOT import <code>../../src/refresh/layer.js</code> — that is the answer.</li>
</ol>

<h3>Your task — rotation, reuse detection, the race</h3>
<ul>
<li><strong><code>issue(userId, opts)</code></strong> — make a token with <code>newToken('lfid_rt')</code>, store a row with its <code>tokenDigest</code> (new family unless <code>opts.familyId</code>), return <code>{ token, row }</code>. Why: 5.1.</li>
<li><strong><code>rotate(presented, opts)</code></strong> — look up by digest; reject <code>INVALID</code> / <code>REVOKED</code> / <code>EXPIRED</code>; if the token is already used, return the grace-window child (race) or revoke the family and return <code>REUSE_DETECTED</code>; otherwise mark used, record <code>replaced_by</code>, and issue the next token in the family. Why: 5.2, 5.5.</li>
<li><strong><code>revokeFamily</code> / <code>revokeAll</code> / <code>revokeDevice</code></strong> — revoke one family, all of a user's families, or one family scoped to its owner. Why: 5.3, 5.4.</li>
<li><strong><code>listDevices(userId)</code></strong> — one row per live family. Why: 5.4.</li>
</ul>

<h3>How it is graded: 8 checks, 10 points, pass = 7</h3>
${CHECKS_EN}
<p>Two checks are the heart of the chapter — reuse detection (5.2) and the race (5.5):</p>
${ma('javascript', GR_T3T4)}

<h3>A first attempt that “works”</h3>
<p>This attempt rotates and hands out fresh tokens, and even implements a devices page. But it never marks a token used, so it has no way to tell a rotated token from a stolen one.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>3.5 out of 10, and each failure is an attack you ran:</p>
<ul>
<li><strong>T3:</strong> no <code>used</code>/<code>revoked</code> tracking, so a replayed token just mints a new one — a 30-day stolen token goes undetected (5.2).</li>
<li><strong>T4:</strong> no grace window, so two tabs get two different tokens; with real reuse detection this is the false positive that logs users out (5.5).</li>
<li><strong>T5, T6, T8:</strong> no reuse, expiry or revoked checks in <code>rotate</code>, so a revoked or expired token still refreshes.</li>
<li>It passes only the plumbing: <code>issue</code> (T1), the digest (T2), and the family-grouped devices query (T7).</li>
</ul>

<h3>Hints (light → strong)</h3>
<ol>
<li>Each check names its lesson; rerun that demo (<code>demo5/rotate-reuse.mjs</code>, <code>demo5/race.mjs</code>, <code>demo5/devices.sh</code>).</li>
<li>On a successful rotation: <code>store.markUsed(rec.id, { usedAt, replacedBy })</code>, then remember the new child for the grace window.</li>
<li>On a token with <code>usedAt</code> set: within <code>graceMs</code> return the cached child; otherwise <code>store.revokeFamily(rec.familyId)</code> and return <code>{ error: 'REUSE_DETECTED' }</code>.</li>
<li>Check <code>revokedAt</code> and <code>expiresAt</code> <em>before</em> the used-token branch, so a revoked/expired token is not mistaken for theft.</li>
</ol>

<h3>Reference solution — LabFlow ID's <code>src/refresh/layer.js</code></h3>
<p>The reference is the real layer, shown line by line in lessons 5.1, 5.2 and 5.5. Its grade, and the project's tests:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-5.mjs lab5/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), twice in a row.</li>
<li>A reused token revokes the family; the race within grace returns one shared token; tokens are stored as digests; <code>npm test</code> still passes.</li>
<li>You can explain T3 (reuse ⇒ revoke the family) and T4 (the grace window) in your own words.</li>
</ul>
<p><strong>Done when:</strong> your layer scores ≥ 7/10 twice in a row, and you can name the attack behind every failed check.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lab 5</span>
<h2>Lớp refresh token của LabFlow ID</h2>
<p class="lead">60–90 phút. Bạn viết cái lớp quyết định LabFlow ID giữ một lần đăng nhập sống nhiều ngày mà không cần mật khẩu: một refresh token xoay thế nào, một cái tái dùng để lộ trộm ra sao, cuộc đua hai tab được chịu thế nào, và thiết bị được liệt kê rồi thu hồi ra sao. Một máy chấm đưa lớp của bạn một kho trong bộ nhớ và một đồng hồ giả, rồi điều khiển mọi đường của bài 5.1–5.5.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> đưa lên một lớp refresh bạn bảo vệ được từng dòng; đọc một dòng trượt của máy chấm và gọi tên cú tấn công nó cho phép; và dùng lại lớp này cho Chương 6 (vòng đời tài khoản phải kết thúc phiên) và Chương 11 (chuyển cache ân hạn sang Redis).</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v0.5 (bài 5.1). Máy chấm không cần cơ sở dữ liệu — nó đưa một kho trong bộ nhớ có các phương thức như <code>pgStore</code>:
${ma('bash', SETUP)}</li>
<li>Chấm bản khởi đầu rỗng một lần:
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab5/my/index.js</code>. Giữ <code>export function refreshLayer(config)</code> trả về <code>{ issue, rotate, revokeFamily, revokeAll, revokeDevice, listDevices }</code>. Được dùng: <code>node:crypto</code> và <code>../../src/crypto</code> (<code>newToken</code>, <code>tokenDigest</code>). ĐỪNG import <code>../../src/refresh/layer.js</code> — đó là đáp án.</li>
</ol>

<h3>Nhiệm vụ — xoay vòng, phát hiện tái dùng, cuộc đua</h3>
<ul>
<li><strong><code>issue(userId, opts)</code></strong> — tạo một token bằng <code>newToken('lfid_rt')</code>, lưu một dòng với <code>tokenDigest</code> của nó (họ mới trừ khi có <code>opts.familyId</code>), trả về <code>{ token, row }</code>. Vì sao: 5.1.</li>
<li><strong><code>rotate(presented, opts)</code></strong> — tra theo digest; từ chối <code>INVALID</code> / <code>REVOKED</code> / <code>EXPIRED</code>; nếu token đã dùng, trả cái con trong cửa sổ ân hạn (cuộc đua) hoặc thu hồi họ và trả <code>REUSE_DETECTED</code>; còn lại đánh dấu đã dùng, ghi <code>replaced_by</code>, và phát token kế trong họ. Vì sao: 5.2, 5.5.</li>
<li><strong><code>revokeFamily</code> / <code>revokeAll</code> / <code>revokeDevice</code></strong> — thu hồi một họ, mọi họ của một người, hoặc một họ giới hạn theo chủ. Vì sao: 5.3, 5.4.</li>
<li><strong><code>listDevices(userId)</code></strong> — một dòng cho mỗi họ sống. Vì sao: 5.4.</li>
</ul>

<h3>Chấm thế nào: 8 phép, 10 điểm, đạt 7</h3>
${CHECKS_VI}
<p>Hai phép là trái tim của chương — phát hiện tái dùng (5.2) và cuộc đua (5.5):</p>
${ma('javascript', GR_T3T4)}

<h3>Một lần thử đầu "chạy được"</h3>
<p>Lần thử này xoay và phát token mới, và thậm chí cài một trang thiết bị. Nhưng nó không bao giờ đánh dấu token đã dùng, nên không có cách nào phân biệt một token đã xoay với một cái bị trộm.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>3,5 trên 10, và mỗi lần trượt là một cú tấn công bạn đã chạy:</p>
<ul>
<li><strong>T3:</strong> không theo dõi <code>used</code>/<code>revoked</code>, nên một token phát lại chỉ đúc một cái mới — một token bị trộm 30 ngày không bị phát hiện (5.2).</li>
<li><strong>T4:</strong> không cửa sổ ân hạn, nên hai tab nhận hai token khác nhau; với phát hiện tái dùng thật đây là cảnh báo giả đăng xuất người dùng (5.5).</li>
<li><strong>T5, T6, T8:</strong> không kiểm tái dùng, hết hạn hay thu hồi trong <code>rotate</code>, nên một token đã thu hồi hay hết hạn vẫn refresh.</li>
<li>Nó chỉ qua phần ống nước: <code>issue</code> (T1), digest (T2), và query thiết bị gộp theo họ (T7).</li>
</ul>

<h3>Gợi ý (nhẹ → mạnh)</h3>
<ol>
<li>Phép chấm nào cũng gọi tên bài của nó; chạy lại demo đó (<code>demo5/rotate-reuse.mjs</code>, <code>demo5/race.mjs</code>, <code>demo5/devices.sh</code>).</li>
<li>Khi xoay thành công: <code>store.markUsed(rec.id, { usedAt, replacedBy })</code>, rồi nhớ cái con mới cho cửa sổ ân hạn.</li>
<li>Trên một token có <code>usedAt</code>: trong <code>graceMs</code> trả cái con đã nhớ; còn lại <code>store.revokeFamily(rec.familyId)</code> và trả <code>{ error: 'REUSE_DETECTED' }</code>.</li>
<li>Kiểm <code>revokedAt</code> và <code>expiresAt</code> <em>trước</em> nhánh token-đã-dùng, để một token đã thu hồi/hết hạn không bị nhầm là trộm.</li>
</ol>

<h3>Lời giải tham khảo — <code>src/refresh/layer.js</code> của LabFlow ID</h3>
<p>Bản tham khảo là lớp thật, hiện từng dòng ở bài 5.1, 5.2 và 5.5. Điểm của nó, và bộ test của dự án:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-5.mjs lab5/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần liên tiếp.</li>
<li>Một token tái dùng thu hồi họ; cuộc đua trong ân hạn trả một token chung; token lưu dạng digest; <code>npm test</code> vẫn qua.</li>
<li>Bạn giải thích được T3 (tái dùng ⇒ thu hồi họ) và T4 (cửa sổ ân hạn) bằng lời của mình.</li>
</ul>
<p><strong>Đạt khi:</strong> lớp của bạn đạt ≥ 7/10 hai lần liên tiếp, và bạn gọi được tên cú tấn công sau mỗi phép chấm trượt.</p>
</div>
`,
};
