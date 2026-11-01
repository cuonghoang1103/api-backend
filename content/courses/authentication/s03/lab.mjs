/**
 * Authentication · Chương 3 · Lab 3 — Lớp phiên của LabFlow ID. BÀI MỚI 01/11/2026, slug auth-3-7-lab-phien-cookie (trước quiz).
 * Máy chấm = scripts/cham-lab-3.mjs (9 phép, 10 điểm, đạt 7): gắn sessionLayer của người học vào Express :4806, kho trong bộ nhớ, đồng hồ giả,
 * và một đòn CSRF thật từ 127.0.0.1:4807 trong Chromium 156. Output thật: khởi đầu 0/10, lần thử đầu "chạy được" 2/10, tham khảo src/sessions 10/10, npm test 15 pass.
 */
import G from '../giang/auth-lab-3.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader.split('\n');
const GR_T3 = GR.slice(GR.findIndex((l) => l.startsWith('// ── T3')), GR.findIndex((l) => l.startsWith('// ── T4'))).join('\n').trim();
const SETUP = `cp -r lab3/starter lab3/my
npx playwright install chromium        # once, if lesson 1.1 has not done it
node scripts/cham-lab-3.mjs lab3/my     # :4806 (your layer) and :4807 (the attacker page) must be free`;

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails, for a real user…</th></tr></thead>
<tbody>
<tr><td>T1 <code>__Host-lfid_ses</code>; HttpOnly; Secure; Path=/; SameSite Lax/Strict; no Domain</td><td>1.5</td><td>a script or a subdomain gets the token; Chromium drops a broken __Host- cookie silently (3.2)</td></tr>
<tr><td>T2 CSPRNG token ≥ 256 bits; the store holds a digest, never the token</td><td>1.5</td><td>a leaked session table is a list of live sessions (1.3)</td></tr>
<tr><td>T3 sign-in replaces any session the request carried</td><td>1.5</td><td>session fixation: a planted id becomes An's session (3.3)</td></tr>
<tr><td>T4 idle 30 min ⇒ 401, row deleted, cookie cleared</td><td>1</td><td>a forgotten lab PC stays signed in (3.1)</td></tr>
<tr><td>T5 absolute 12 h ⇒ 401 even when active</td><td>1</td><td>a stolen cookie in daily use never dies (3.1)</td></tr>
<tr><td>T6 ≤ 1 store update for 100 requests in 10 s</td><td>0.5</td><td>every read becomes a write (3.1)</td></tr>
<tr><td>T7 sign-out clears with the same attributes and kills the row; sign-out-everywhere</td><td>1</td><td>“sign out” leaves the cookie or the row alive (3.1, 3.2)</td></tr>
<tr><td>T8 CSRF: 403 for cross-site/foreign Origin; attacker page in Chromium cannot change the email; An's own form can</td><td>1.5</td><td>another site changes An's email, then the password reset goes to the attacker (3.4)</td></tr>
<tr><td>T9 source: no <code>Math.random</code>, no <code>SameSite=None</code>, no <code>Domain=</code></td><td>0.5</td><td>predictable tokens; a cookie sent everywhere</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt, với người dùng thật…</th></tr></thead>
<tbody>
<tr><td>T1 <code>__Host-lfid_ses</code>; HttpOnly; Secure; Path=/; SameSite Lax/Strict; không Domain</td><td>1,5</td><td>script hay subdomain lấy được token; Chromium âm thầm bỏ cookie __Host- sai (3.2)</td></tr>
<tr><td>T2 token CSPRNG ≥ 256 bit; kho giữ digest, không bao giờ giữ token</td><td>1,5</td><td>bảng phiên bị lộ là danh sách phiên còn sống (1.3)</td></tr>
<tr><td>T3 đăng nhập thay mọi phiên request đang mang</td><td>1,5</td><td>session fixation: id bị cài thành phiên của An (3.3)</td></tr>
<tr><td>T4 nhàn rỗi 30 phút ⇒ 401, xoá dòng, xoá cookie</td><td>1</td><td>máy phòng lab bị bỏ quên vẫn đăng nhập (3.1)</td></tr>
<tr><td>T5 tuyệt đối 12 giờ ⇒ 401 dù đang hoạt động</td><td>1</td><td>cookie bị trộm dùng hằng ngày không bao giờ chết (3.1)</td></tr>
<tr><td>T6 ≤ 1 lần cập nhật kho cho 100 request trong 10 s</td><td>0,5</td><td>mỗi lần đọc thành một lần ghi (3.1)</td></tr>
<tr><td>T7 đăng xuất xoá cookie bằng đúng thuộc tính và xoá dòng; đăng xuất mọi nơi</td><td>1</td><td>"đăng xuất" để lại cookie hay dòng còn sống (3.1, 3.2)</td></tr>
<tr><td>T8 CSRF: 403 cho cross-site/Origin lạ; trang kẻ tấn công trong Chromium không đổi được email; form của An thì được</td><td>1,5</td><td>site khác đổi email của An, rồi link đặt lại mật khẩu tới tay kẻ tấn công (3.4)</td></tr>
<tr><td>T9 mã nguồn: không <code>Math.random</code>, không <code>SameSite=None</code>, không <code>Domain=</code></td><td>0,5</td><td>token đoán được; cookie bị gửi đi khắp nơi</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 3 — LabFlow ID’s session layer|||Lab 3 — Lớp phiên của LabFlow ID',
  slug: 'auth-3-7-lab-phien-cookie',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 3, thang 10 điểm (đạt 7) chấm bằng máy: viết sessionLayer của LabFlow ID — start (cookie __Host-, token mới, huỷ phiên cũ), load (nhàn rỗi 30 phút, tuyệt đối 12 giờ, chạm mỗi phút), end/endAll, csrf (Sec-Fetch-Site + Origin). Máy chấm gọi qua HTTP với đồng hồ giả và tấn công CSRF thật từ site khác trong Chromium 156; output thật của bản khởi đầu (0/10), lần thử đầu "chạy được" (2/10) và lời giải tham khảo (10/10).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab 3</span>
<h2>LabFlow ID’s session layer</h2>
<p class="lead">60–90 minutes. You write the function that decides how LabFlow ID keeps a user signed in: how a session starts, how it is checked on every request, how it ends, and how it refuses requests caused by other sites. A grader mounts your layer in a small Express server, drives it over HTTP with a fake clock, and runs one attack from another site in real Chromium — the attacks of lessons 3.1–3.4, automated.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> ship a session layer you can defend line by line; read a grader's failure and say what a user would suffer; and reuse the layer for Chapter 5 (devices, refresh) and Chapter 7 (a new session when a second factor is added).</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v0.3 (lesson 3.1). The grader needs no database — it passes an in-memory store with the same five methods as <code>pgStore</code>:
${ma('bash', SETUP)}</li>
<li>Grade the empty starter once:
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab3/my/index.js</code>. Keep <code>export function sessionLayer(options)</code> returning <code>{ start, load, end, endAll, csrf }</code>. Allowed: <code>node:crypto</code> and <code>../../src/crypto</code> (<code>newToken</code>, <code>tokenDigest</code>).</li>
</ol>

<h3>Your task — behaviour first</h3>
<ul>
<li><code>start(req, res, userId)</code> — delete any session the request's cookie points to; create a new one with <code>newToken('lfid_ses')</code>; store <code>{ digest, userId, createdAt, expiresAt, lastSeenAt, authAt, ip, userAgent }</code>; send <code>__Host-lfid_ses=…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=…</code>. Why: 3.2, 3.3.</li>
<li><code>load(req, res, next)</code> — <code>req.session</code> = the row or <code>null</code>; if <code>now ≥ expiresAt</code> or <code>now − lastSeenAt ≥ idleMs</code>: delete the row and clear the cookie; update <code>lastSeenAt</code> only when it is at least <code>touchEveryMs</code> old. Why: 3.1.</li>
<li><code>end(req, res)</code> — delete the row; clear the cookie with the <em>same</em> name and attributes and <code>Max-Age=0</code>. <code>endAll(userId)</code> — delete every session of the user, return how many. Why: 3.1, 3.2.</li>
<li><code>csrf(req, res, next)</code> — for POST/PUT/PATCH/DELETE: <code>Sec-Fetch-Site</code> other than <code>same-origin</code>/<code>none</code> ⇒ 403; no Fetch Metadata but an <code>Origin</code> not in <code>origins</code> ⇒ 403; otherwise <code>next()</code>. Why: 3.4.</li>
</ul>

<h3>How it is graded: 9 checks, 10 points, pass = 7</h3>
${CHECKS_EN}
<p>T3 is the fixation attack of lesson 3.3 in three lines — a valid session for Bình is planted, An signs in carrying it:</p>
${ma('javascript', GR_T3)}

<h3>A first attempt that “works”</h3>
<p>This attempt signs An in, recognises her on <code>/me</code>, and answers sign-out with <code>ok</code>. It even sets SameSite=Lax.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>2 out of 10, and each failure is a real hole:</p>
<ul>
<li><strong>T2:</strong> the token is the store key — a dump of the store is a list of working sessions.</li>
<li><strong>T3:</strong> <code>start</code> never deletes the session the browser carried, so the planted one still works after An signs in.</li>
<li><strong>T4:</strong> <code>now − lastSeenAt &lt;= idleMs</code> keeps a session that has been idle exactly 30 minutes — the boundary again (Lab 1 T7). <strong>T5:</strong> no absolute timeout at all. <strong>T6:</strong> 100 updates for 100 requests.</li>
<li><strong>T7:</strong> <code>__Host-lfid_ses=deleted</code> without <code>Path=/</code>, <code>Secure</code> and <code>Max-Age=0</code> is a different, invalid cookie: nothing is cleared.</li>
<li><strong>T8:</strong> <code>csrf</code> just calls <code>next()</code>. SameSite=Lax made Chromium's cross-site POST arrive without the cookie, but a POST with the cookie and <code>Sec-Fetch-Site: cross-site</code> — what a sibling subdomain or an older browser produces — got 200.</li>
</ul>

<h3>Hints (light → strong)</h3>
<ol>
<li>Each check names its lesson; rerun that lesson's demo (<code>demo3/timeouts.mjs</code>, <code>demo3/fixation.mjs</code>, <code>demo3/csrf-v03.sh</code>).</li>
<li>Read the cookie with a small parser (lesson 0.1); key the store by <code>tokenDigest(token)</code>.</li>
<li><code>load</code>: compare with <code>≥</code>; delete + clear before <code>next()</code>; only <code>update</code> when <code>now − lastSeenAt ≥ touchEveryMs</code>.</li>
<li><code>csrf</code>: check <code>req.headers['sec-fetch-site']</code> first; fall back to <code>req.headers.origin</code>; requests with neither come from non-browser clients.</li>
</ol>

<h3>Reference solution — LabFlow ID's <code>src/sessions/</code></h3>
<p><code>layer.js</code> is shown in lessons 3.1–3.4; <code>pg-store.js</code> and <code>memory-store.js</code> implement the store. The grade and the project's tests:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-3.mjs lab3/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), twice in a row.</li>
<li>No <code>Math.random</code>, <code>SameSite=None</code> or <code>Domain=</code> in your source; <code>npm test</code> still passes.</li>
<li>Optional: use your layer in <code>src/server.js</code> and rerun <code>demo3/fixation.mjs</code> and <code>demo3/csrf-v03.sh</code>.</li>
</ul>
<p><strong>Done when:</strong> your layer scores ≥ 7/10 twice in a row, and you can explain T3 and T8 in your own words.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab 3</span>
<h2>Lớp phiên của LabFlow ID</h2>
<p class="lead">60–90 phút. Bạn viết hàm quyết định LabFlow ID giữ người dùng đăng nhập ra sao: phiên bắt đầu thế nào, được kiểm thế nào ở mỗi request, kết thúc thế nào, và từ chối các request do site khác gây ra thế nào. Máy chấm gắn lớp của bạn vào một máy chủ Express nhỏ, điều khiển nó qua HTTP bằng đồng hồ giả, và chạy một đòn tấn công từ site khác trong Chromium thật — chính các đòn của bài 3.1–3.4, được tự động hoá.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> đưa lên một lớp phiên mà bạn bảo vệ được từng dòng; đọc một dòng trượt của máy chấm và nói người dùng phải chịu gì; và dùng lại lớp này cho Chương 5 (thiết bị, refresh) và Chương 7 (phiên mới khi thêm yếu tố thứ hai).</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v0.3 (bài 3.1). Máy chấm không cần cơ sở dữ liệu — nó đưa một kho trong bộ nhớ có cùng năm phương thức như <code>pgStore</code>:
${ma('bash', SETUP)}</li>
<li>Chấm bản khởi đầu rỗng một lần:
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab3/my/index.js</code>. Giữ <code>export function sessionLayer(options)</code> trả về <code>{ start, load, end, endAll, csrf }</code>. Được dùng: <code>node:crypto</code> và <code>../../src/crypto</code> (<code>newToken</code>, <code>tokenDigest</code>).</li>
</ol>

<h3>Nhiệm vụ — bắt đầu từ hành vi</h3>
<ul>
<li><code>start(req, res, userId)</code> — xoá mọi phiên mà cookie của request trỏ tới; tạo phiên mới bằng <code>newToken('lfid_ses')</code>; lưu <code>{ digest, userId, createdAt, expiresAt, lastSeenAt, authAt, ip, userAgent }</code>; gửi <code>__Host-lfid_ses=…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=…</code>. Vì sao: 3.2, 3.3.</li>
<li><code>load(req, res, next)</code> — <code>req.session</code> = dòng hoặc <code>null</code>; nếu <code>now ≥ expiresAt</code> hoặc <code>now − lastSeenAt ≥ idleMs</code>: xoá dòng và xoá cookie; chỉ cập nhật <code>lastSeenAt</code> khi nó cũ ít nhất <code>touchEveryMs</code>. Vì sao: 3.1.</li>
<li><code>end(req, res)</code> — xoá dòng; xoá cookie với <em>đúng</em> tên và thuộc tính kèm <code>Max-Age=0</code>. <code>endAll(userId)</code> — xoá mọi phiên của người đó, trả về số lượng. Vì sao: 3.1, 3.2.</li>
<li><code>csrf(req, res, next)</code> — với POST/PUT/PATCH/DELETE: <code>Sec-Fetch-Site</code> khác <code>same-origin</code>/<code>none</code> ⇒ 403; không có Fetch Metadata mà <code>Origin</code> không nằm trong <code>origins</code> ⇒ 403; còn lại <code>next()</code>. Vì sao: 3.4.</li>
</ul>

<h3>Chấm thế nào: 9 phép, 10 điểm, đạt 7</h3>
${CHECKS_VI}
<p>T3 là đòn fixation của bài 3.3 trong ba dòng — cài một phiên hợp lệ của Bình, An đăng nhập trong khi mang nó:</p>
${ma('javascript', GR_T3)}

<h3>Một lần thử đầu "chạy được"</h3>
<p>Lần thử này đăng nhập được An, nhận ra cô ở <code>/me</code>, và trả lời đăng xuất bằng <code>ok</code>. Nó thậm chí đặt SameSite=Lax.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>2 trên 10, và mỗi lần trượt là một lỗ thật:</p>
<ul>
<li><strong>T2:</strong> token là khoá của kho — bản dump của kho là danh sách phiên dùng được.</li>
<li><strong>T3:</strong> <code>start</code> không bao giờ xoá phiên trình duyệt đang mang, nên phiên bị cài vẫn chạy sau khi An đăng nhập.</li>
<li><strong>T4:</strong> <code>now − lastSeenAt &lt;= idleMs</code> giữ một phiên đã nhàn rỗi đúng 30 phút — lại là chuyện biên (T7 của Lab 1). <strong>T5:</strong> không có hết hạn tuyệt đối. <strong>T6:</strong> 100 lần cập nhật cho 100 request.</li>
<li><strong>T7:</strong> <code>__Host-lfid_ses=deleted</code> thiếu <code>Path=/</code>, <code>Secure</code> và <code>Max-Age=0</code> là một cookie khác, không hợp lệ: chẳng xoá được gì.</li>
<li><strong>T8:</strong> <code>csrf</code> chỉ gọi <code>next()</code>. SameSite=Lax khiến POST chéo site của Chromium đến nơi không kèm cookie, nhưng một POST có cookie và <code>Sec-Fetch-Site: cross-site</code> — thứ một subdomain anh em hay một trình duyệt cũ tạo ra — nhận 200.</li>
</ul>

<h3>Gợi ý (nhẹ → mạnh)</h3>
<ol>
<li>Phép chấm nào cũng gọi tên bài của nó; chạy lại demo của bài đó (<code>demo3/timeouts.mjs</code>, <code>demo3/fixation.mjs</code>, <code>demo3/csrf-v03.sh</code>).</li>
<li>Đọc cookie bằng một bộ tách nhỏ (bài 0.1); khoá của kho là <code>tokenDigest(token)</code>.</li>
<li><code>load</code>: so bằng <code>≥</code>; xoá + xoá cookie trước <code>next()</code>; chỉ <code>update</code> khi <code>now − lastSeenAt ≥ touchEveryMs</code>.</li>
<li><code>csrf</code>: kiểm <code>req.headers['sec-fetch-site']</code> trước; lùi về <code>req.headers.origin</code>; request không có cả hai đến từ client không phải trình duyệt.</li>
</ol>

<h3>Lời giải tham khảo — <code>src/sessions/</code> của LabFlow ID</h3>
<p><code>layer.js</code> đã có trong bài 3.1–3.4; <code>pg-store.js</code> và <code>memory-store.js</code> cài kho. Điểm chấm và bộ test của dự án:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-3.mjs lab3/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần liên tiếp.</li>
<li>Mã nguồn không có <code>Math.random</code>, <code>SameSite=None</code> hay <code>Domain=</code>; <code>npm test</code> vẫn qua.</li>
<li>Tuỳ chọn: dùng lớp của bạn trong <code>src/server.js</code> rồi chạy lại <code>demo3/fixation.mjs</code> và <code>demo3/csrf-v03.sh</code>.</li>
</ul>
<p><strong>Đạt khi:</strong> lớp của bạn đạt ≥ 7/10 hai lần liên tiếp, và bạn giải thích được T3 và T8 bằng lời của mình.</p>
</div>
`,
};
