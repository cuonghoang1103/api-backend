/**
 * Authentication · Chương 3 · 3.1 — Một cái bảng, và mỗi cột để làm gì. Slug giữ: auth-3-1-bang-phien. Bài đầu chương.
 * Output thật (_ma.mjs, LabFlow ID v0.3 + PostgreSQL 17.11, env -i): token chỉ trong Set-Cookie __Host-lfid_ses (Max-Age=43200);
 * dòng phiên (digest, created, expires +12 h, last_seen, ip ::1, ua curl); đồng hồ giả: Bình nhàn rỗi 31 phút ⇒ đăng xuất, An hoạt
 * động cả ngày ⇒ đăng xuất lúc 12 h; 1.000 GET /me: chạm mỗi request = 1.000 UPDATE (median 2,06 ms) vs mỗi phút = 0 (1,74 ms);
 * đăng xuất mọi nơi ended 3.
 */
import G from '../giang/auth-03-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const L = CODE.layer.split('\n');
const LOAD = L.slice(L.findIndex((l) => l.includes('/** Middleware: req.session')), L.findIndex((l) => l.includes('async function end'))).join('\n').trim();
const SV = CODE.server03.split('\n');
const SIGNIN = SV.slice(SV.findIndex((l) => l.startsWith("app.post('/sign-in'")), SV.findIndex((l) => l.startsWith("app.get('/me'"))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — Session Management Cheat Sheet', 'Idle timeouts 2–5 min (high value) to 15–30 min (low risk); absolute 4–8 h for an office day; ≥ 64 bits of entropy, 128+ recommended (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('🐘', 'PostgreSQL 17 docs — Routine Vacuuming', 'Every UPDATE leaves a dead row version that VACUUM must reclaim — why a write per request is not free (read 01/11/2026).', 'https://www.postgresql.org/docs/17/routine-vacuuming.html'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Session Management Cheat Sheet', 'Hết hạn nhàn rỗi 2–5 phút (giá trị cao) tới 15–30 phút (rủi ro thấp); tuyệt đối 4–8 giờ cho một ngày văn phòng; ≥ 64 bit entropy, khuyên 128+ (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('🐘', 'Tài liệu PostgreSQL 17 — Routine Vacuuming', 'Mỗi UPDATE để lại một phiên bản dòng chết mà VACUUM phải dọn — vì sao ghi ở mỗi request không miễn phí (đọc 01/11/2026).', 'https://www.postgresql.org/docs/17/routine-vacuuming.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>You need…</th><th>Column / setting</th><th>LabFlow ID v0.3</th></tr></thead>
<tbody>
<tr><td>to find the session from the cookie</td><td><code>digest</code> (primary key)</td><td>SHA-256 of the token — never the token (lesson 1.3)</td></tr>
<tr><td>a lost laptop to stop working on its own</td><td>idle timeout from <code>last_seen_at</code></td><td>30 min; touched at most once a minute</td></tr>
<tr><td>a stolen cookie to die even if it is used</td><td>absolute timeout <code>expires_at</code></td><td>12 h (LabFlow's day is 07:00–19:00; OWASP: 4–8 h for an office day)</td></tr>
<tr><td>to ask for the password again before risky actions</td><td><code>auth_at</code></td><td>lesson 3.3 (change password)</td></tr>
<tr><td>a “your devices” page and “was this you?”</td><td><code>ip</code>, <code>user_agent</code>, <code>created_at</code></td><td>stored now, shown in Chapter 5</td></tr>
<tr><td>to sign out everywhere</td><td>index on <code>user_id</code></td><td><code>DELETE … WHERE user_id = $1</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Bạn cần…</th><th>Cột / thiết lập</th><th>LabFlow ID v0.3</th></tr></thead>
<tbody>
<tr><td>tìm phiên từ cookie</td><td><code>digest</code> (khoá chính)</td><td>SHA-256 của token — không bao giờ là token (bài 1.3)</td></tr>
<tr><td>laptop bị bỏ quên tự thôi hoạt động</td><td>hết hạn nhàn rỗi từ <code>last_seen_at</code></td><td>30 phút; chạm tối đa mỗi phút một lần</td></tr>
<tr><td>cookie bị trộm vẫn chết dù đang được dùng</td><td>hết hạn tuyệt đối <code>expires_at</code></td><td>12 giờ (ngày của LabFlow là 07:00–19:00; OWASP: 4–8 giờ cho ngày văn phòng)</td></tr>
<tr><td>hỏi lại mật khẩu trước thao tác rủi ro</td><td><code>auth_at</code></td><td>bài 3.3 (đổi mật khẩu)</td></tr>
<tr><td>trang "thiết bị của bạn" và "có phải bạn không?"</td><td><code>ip</code>, <code>user_agent</code>, <code>created_at</code></td><td>lưu từ giờ, hiển thị ở Chương 5</td></tr>
<tr><td>đăng xuất khỏi mọi nơi</td><td>chỉ mục trên <code>user_id</code></td><td><code>DELETE … WHERE user_id = $1</code></td></tr>
</tbody>
</table>`;

export default {
  title: '3.1 — One table, and what every column is for|||3.1 — Một cái bảng, và mỗi cột để làm gì',
  slug: 'auth-3-1-bang-phien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'LabFlow ID v0.3 giữ phiên phía máy chủ: token chỉ đi trong Set-Cookie, bảng sessions (migration 002) có một cột cho mỗi câu hỏi vận hành; hai kiểu hết hạn (nhàn rỗi 30 phút, tuyệt đối 12 giờ) đo bằng đồng hồ giả trên lớp phiên thật; cập nhật last_seen ở mọi request = 1.000 UPDATE cho 1.000 lần đọc, giới hạn mỗi phút = 0; đăng xuất khỏi mọi nơi bằng một câu lệnh có chỉ mục.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>One table, and what every column is for</h2>
<p class="lead">LabFlow ID v0.2 still had two holes from lesson 0.3: a session never ended (hole 4), and the token came back in a JSON body for JavaScript to keep (hole 5). Chapter 3 closes both with the oldest answer to “HTTP forgets” — and still the right one for most products: <strong>a row on the server and a random token in a cookie</strong>. This lesson builds the row: what each column is for, the two timeouts every session needs, and the write you should not do on every request.</p>

<div class="callout ok">
<p><strong>After Chapter 3 you can:</strong> run server-side sessions with idle and absolute timeouts and “sign out everywhere”; set a session cookie whose every attribute you can justify with a measurement in real Chromium; stop session fixation by issuing a new session at every privilege change; rank and implement three CSRF defences; and choose between PostgreSQL, Redis and signed cookies with numbers. Lab 3 grades your session layer over HTTP and with an attack from another site in real Chromium.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>design a sessions table where every column answers an operational question;</li>
<li>explain the difference between idle and absolute timeouts and enforce both on the server;</li>
<li>avoid turning each authenticated read into a database write;</li>
<li>sign a user out of every device with one indexed statement.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> every SWP391/SEP490 project has a “log out” button that does not really log out. After this lesson yours ends sessions on purpose — and you can say how long a stolen cookie stays useful.</p>
</div>

<h3>An everyday picture first</h3>
<p>At a cloakroom your coat stays behind the counter and you get a numbered ticket. The ticket means nothing by itself; the counter looks it up. Lose it and the attendant voids that number. The cloakroom also closes at 19:00 whatever you do, and a coat left for hours without anyone asking may be handed to lost property. A <strong>server-side session</strong> is that counter: the <em>row</em> (who you are, since when) stays on the server, the browser carries only a random <em>token</em>, and ending a session is one <code>DELETE</code>. Keep that last property in mind — it is exactly what token designs give up in Chapter 4.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sign-in</span><span class="lz-d">Password verified (Chapter 2) ⇒ new random token; the row stores its SHA-256, times, IP and user agent.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cookie</span><span class="lz-d">The token goes back in <code>Set-Cookie</code> only — never in the JSON body (lesson 3.2 explains every attribute).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Every request</span><span class="lz-d">Hash the cookie, find the row, check both timeouts, touch <code>last_seen_at</code> at most once a minute.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The end</span><span class="lz-d">Timeout, sign-out or sign-out-everywhere ⇒ the row is deleted and the cookie cleared.</span></div>
</div>

<h3>v0.3 signs An in: the token arrives only in a cookie</h3>
${ma('javascript', SIGNIN)}
${ra(OUT['31-sign-in'])}
${ra(OUT['31-row'])}
<p>The JSON body says only <code>{"ok":true,…}</code> — nothing a script could steal (hole 5). The table holds the digest (12 characters shown), not the token; <code>expires</code> is 12 hours after <code>created</code>; <code>ip</code> and <code>ua</code> describe the device (<code>::1</code> is IPv6 localhost, and curl's user agent). The columns come from one migration:</p>
${ma('sql', CODE.sql002)}

<h3>Two timeouts, and why you need both</h3>
<p>An <strong>idle timeout</strong> ends a session nobody is using — the lab PC someone forgot to lock. An <strong>absolute timeout</strong> ends a session no matter how busy it is — so a stolen cookie that the thief keeps using still dies. A fake clock drives the real session layer to show both:</p>
${ra(OUT['31-timeouts'])}
<p>Bình stopped at 07:00 and was signed out at 07:31; An sent a request every 15 minutes all day and was still signed out at 19:00. OWASP suggests 15–30 minutes idle for low-risk applications (2–5 for high-value ones) and 4–8 hours absolute for an office day; LabFlow's labs run 07:00–19:00, so 12 hours. The check lives on the server, in the middleware:</p>
${ma('javascript', LOAD)}
<div class="pitfall co-tieu-de">
<p><strong>Trap — trusting the cookie's Max-Age.</strong> <code>Max-Age=43200</code> only tells the <em>browser</em> when to forget. A cookie copied into curl or another machine ignores it completely, so the server must compare <code>expires_at</code> and <code>last_seen_at</code> itself on every request. The opposite mistake: checking expiry but never deleting the row, so the table fills with dead sessions and “active sessions” dashboards lie. <code>load()</code> deletes on expiry and clears the cookie.</p>
</div>

<h3>Touching last_seen: one write per read?</h3>
<p>The idle check needs <code>last_seen_at</code> to move forward. The naive way updates it on every request. Measured on v0.3 — 1,000 <code>GET /me</code> with one session, then PostgreSQL's own counter of updated rows (port 4803 runs the same server with <code>TOUCH_EVERY_MS=0</code>):</p>
${ra(OUT['31-touch'])}
<p>Updating on every request turns 1,000 reads into <strong>1,000 UPDATEs</strong> (and a slower median, 2.06 vs 1.74 ms). Each UPDATE leaves a dead row version for VACUUM and WAL for replicas. Touching at most once a minute: <strong>0</strong> updates in this burst — the idle time is known to within 60 seconds, which nobody can notice on a 30-minute timeout.</p>

<h3>Sign out everywhere</h3>
${ra(OUT['31-devices'])}
<p>An signs in from three devices; one <code>POST /sign-out-everywhere</code> ends all three (<code>"ended":3</code>). It is a single <code>DELETE FROM sessions WHERE user_id = $1</code>, kept fast by the index from the migration. Lesson 3.3 reuses it when a password changes; Chapter 5 shows the devices to the user.</p>

<h3>When to use which</h3>
${BANG_EN}

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Session or JWT?”</strong> — A server-side session can be revoked instantly (one DELETE) and keeps the token meaningless; the cost is one lookup per request (lesson 3.5 measures it). Chapter 4 covers what JWTs trade for avoiding that lookup.</li>
<li><strong>“What timeouts do you use?”</strong> — Idle and absolute, both enforced on the server: 30 minutes idle, 12 hours absolute for our day-long lab app, shorter for anything high-value.</li>
<li><strong>“How do you implement ‘log out of all devices’?”</strong> — Sessions are rows keyed by digest with an index on user_id; one DELETE ends them all.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>With v0.3 running, run <code>bash demo3/sign-in.sh</code> and <code>node demo3/sessions-dump.mjs</code>. Find the digest of your session yourself: <code>node -e "console.log(require('crypto').createHash('sha256').update('&lt;token from the cookie jar&gt;').digest('hex'))"</code>.</li>
<li>Change <code>demo3/timeouts.mjs</code> so An sends a request every 31 minutes. Predict the output before running it.</li>
<li>Run <code>node demo3/touch-cost.mjs 4800</code> twice in a row. Why can the second run show updates?</li>
</ol>
<p><strong>Solution:</strong> the first 12 hex characters of your SHA-256 match the dump. With 31-minute gaps An is signed out at her first request (07:31) — every gap exceeds the idle timeout. The second touch-cost run may show 1 update: the session it signs in with is new, but if a run takes longer than a minute between two requests the throttle allows a touch; on our machine both runs took under 2 seconds and showed 0.</p>
<p><strong>Done when:</strong> you can map each column of your sessions table to a question, both timeouts are enforced by the server, and a burst of reads causes no burst of writes.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">server-side session</span><span class="v">The state lives in a row on the server; the browser carries only a random token pointing to it.</span></div>
  <div class="kv"><span class="k">idle timeout</span><span class="v">The session ends after a period with no requests (30 min here).</span></div>
  <div class="kv"><span class="k">absolute timeout</span><span class="v">The session ends a fixed time after sign-in, however active it is (12 h here).</span></div>
  <div class="kv"><span class="k">revocation</span><span class="v">Ending a session before it expires — one DELETE for a server-side session.</span></div>
  <div class="kv"><span class="k">write amplification</span><span class="v">A read path that causes writes (updating last_seen on every request).</span></div>
  <div class="kv"><span class="k">sign out everywhere</span><span class="v">Deleting every session of one user, e.g. after a password change.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A session = a row on the server + a random token in a cookie; ending it = one DELETE.</li>
<li>The row stores the digest and one column per operational question; the token never touches the JSON body.</li>
<li>Idle (30 min) and absolute (12 h) timeouts are both enforced by the server, not by Max-Age.</li>
<li>Touch last_seen at most once a minute: 1,000 reads ⇒ 0 writes instead of 1,000.</li>
<li>Sign out everywhere = <code>DELETE … WHERE user_id</code>, with an index.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Applied in Node.js — lesson 8.4: cookies, CSRF, revocation', sub: 'Same: a session cookie the browser sends by itself, and the need to revoke. That lesson revokes JWTs with a tokenVersion counter; this one keeps the session as a row, so revocation is a DELETE, and measures timeouts and last-seen writes. Each stands on its own.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Một cái bảng, và mỗi cột để làm gì</h2>
<p class="lead">LabFlow ID v0.2 vẫn còn hai lỗ từ bài 0.3: phiên không bao giờ kết thúc (lỗ 4), và token được trả trong thân JSON để JavaScript giữ (lỗ 5). Chương 3 bịt cả hai bằng câu trả lời lâu đời nhất cho "HTTP hay quên" — và vẫn đúng cho phần lớn sản phẩm: <strong>một dòng trên máy chủ và một token ngẫu nhiên trong cookie</strong>. Bài này dựng cái dòng đó: mỗi cột để làm gì, hai kiểu hết hạn phiên nào cũng cần, và việc ghi bạn không nên làm ở mỗi request.</p>

<div class="callout ok">
<p><strong>Học xong Chương 3 bạn làm được:</strong> chạy phiên phía máy chủ có hết hạn nhàn rỗi, hết hạn tuyệt đối và "đăng xuất khỏi mọi nơi"; đặt cookie phiên mà thuộc tính nào cũng bảo vệ được bằng một phép đo trong Chromium thật; chặn session fixation bằng cách cấp phiên mới ở mỗi lần đổi đặc quyền; xếp hạng và cài ba lớp phòng CSRF; và chọn giữa PostgreSQL, Redis và cookie có ký bằng con số. Lab 3 chấm lớp phiên của bạn qua HTTP và bằng một đòn tấn công từ site khác trong Chromium thật.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>thiết kế bảng phiên mà mỗi cột trả lời một câu hỏi vận hành;</li>
<li>giải thích khác biệt giữa hết hạn nhàn rỗi (idle) và tuyệt đối (absolute), và áp cả hai ở máy chủ;</li>
<li>tránh biến mỗi lần đọc có xác thực thành một lần ghi cơ sở dữ liệu;</li>
<li>đăng xuất một người khỏi mọi thiết bị bằng một câu lệnh có chỉ mục.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> đồ án SWP391/SEP490 nào cũng có nút "đăng xuất" mà không thật sự đăng xuất. Học xong bài này, đồ án của bạn kết thúc phiên có chủ đích — và bạn nói được một cookie bị trộm còn dùng được bao lâu.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Ở quầy gửi đồ, áo của bạn nằm sau quầy và bạn nhận một tấm vé có số. Tấm vé tự nó chẳng nghĩa lý gì; quầy tra số đó. Mất vé thì nhân viên huỷ số đó. Quầy cũng đóng cửa lúc 19:00 dù bạn làm gì, và chiếc áo để hàng giờ không ai hỏi có thể bị chuyển sang đồ thất lạc. <strong>Phiên phía máy chủ (server-side session)</strong> chính là cái quầy đó: <em>dòng</em> (bạn là ai, từ lúc nào) ở lại máy chủ, trình duyệt chỉ mang một <em>token</em> ngẫu nhiên, và kết thúc một phiên chỉ là một lệnh <code>DELETE</code>. Nhớ tính chất cuối cùng này — đó chính là thứ các thiết kế dùng token đánh đổi ở Chương 4.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đăng nhập</span><span class="lz-d">Mật khẩu khớp (Chương 2) ⇒ token ngẫu nhiên mới; dòng lưu SHA-256 của nó, các mốc thời gian, IP và user agent.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cookie</span><span class="lz-d">Token chỉ quay về trong <code>Set-Cookie</code> — không bao giờ trong thân JSON (bài 3.2 giải thích từng thuộc tính).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Mỗi request</span><span class="lz-d">Băm cookie, tìm dòng, kiểm cả hai mốc hết hạn, chạm <code>last_seen_at</code> tối đa mỗi phút một lần.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Kết thúc</span><span class="lz-d">Hết hạn, đăng xuất hay đăng xuất mọi nơi ⇒ xoá dòng và xoá cookie.</span></div>
</div>

<h3>v0.3 đăng nhập cho An: token chỉ đến trong cookie</h3>
${ma('javascript', SIGNIN)}
${ra(OUT['31-sign-in'])}
${ra(OUT['31-row'])}
<p>Thân JSON chỉ nói <code>{"ok":true,…}</code> — chẳng có gì để một đoạn script lấy trộm (lỗ 5). Bảng giữ digest (hiện 12 ký tự), không phải token; <code>expires</code> sau <code>created</code> 12 giờ; <code>ip</code> và <code>ua</code> mô tả thiết bị (<code>::1</code> là localhost IPv6, và user agent của curl). Các cột đến từ một migration:</p>
${ma('sql', CODE.sql002)}

<h3>Hai kiểu hết hạn, và vì sao cần cả hai</h3>
<p><strong>Hết hạn nhàn rỗi (idle timeout)</strong> kết thúc phiên không ai dùng — cái máy phòng lab ai đó quên khoá. <strong>Hết hạn tuyệt đối (absolute timeout)</strong> kết thúc phiên dù nó bận tới đâu — để một cookie bị trộm mà kẻ trộm vẫn dùng đều đều cũng phải chết. Một đồng hồ giả điều khiển lớp phiên thật để thấy cả hai:</p>
${ra(OUT['31-timeouts'])}
<p>Bình dừng lúc 07:00 và bị đăng xuất lúc 07:31; An gửi request mỗi 15 phút suốt ngày mà vẫn bị đăng xuất lúc 19:00. OWASP gợi ý 15–30 phút nhàn rỗi cho ứng dụng rủi ro thấp (2–5 phút cho ứng dụng giá trị cao) và 4–8 giờ tuyệt đối cho một ngày văn phòng; phòng lab của LabFlow chạy 07:00–19:00, nên 12 giờ. Phép kiểm nằm ở máy chủ, trong middleware:</p>
${ma('javascript', LOAD)}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tin Max-Age của cookie.</strong> <code>Max-Age=43200</code> chỉ báo cho <em>trình duyệt</em> khi nào nên quên. Cookie chép sang curl hay máy khác phớt lờ nó hoàn toàn, nên máy chủ phải tự so <code>expires_at</code> và <code>last_seen_at</code> ở mọi request. Lỗi ngược lại: kiểm hết hạn mà không bao giờ xoá dòng, để bảng đầy phiên chết và bảng điều khiển "phiên đang hoạt động" nói dối. <code>load()</code> xoá dòng khi hết hạn và xoá cookie.</p>
</div>

<h3>Chạm last_seen: mỗi lần đọc một lần ghi?</h3>
<p>Phép kiểm nhàn rỗi cần <code>last_seen_at</code> tiến lên. Cách ngây thơ cập nhật nó ở mọi request. Đo trên v0.3 — 1.000 <code>GET /me</code> với một phiên, rồi bộ đếm dòng bị cập nhật của chính PostgreSQL (cổng 4803 chạy cùng máy chủ với <code>TOUCH_EVERY_MS=0</code>):</p>
${ra(OUT['31-touch'])}
<p>Cập nhật ở mọi request biến 1.000 lần đọc thành <strong>1.000 UPDATE</strong> (và trung vị chậm hơn, 2,06 so với 1,74 ms). Mỗi UPDATE để lại một phiên bản dòng chết cho VACUUM và WAL cho bản sao. Chạm tối đa mỗi phút một lần: <strong>0</strong> lần cập nhật trong đợt này — thời gian nhàn rỗi chỉ lệch tối đa 60 giây, chẳng ai nhận ra với mốc 30 phút.</p>

<h3>Đăng xuất khỏi mọi nơi</h3>
${ra(OUT['31-devices'])}
<p>An đăng nhập từ ba thiết bị; một lần <code>POST /sign-out-everywhere</code> kết thúc cả ba (<code>"ended":3</code>). Đó là một câu <code>DELETE FROM sessions WHERE user_id = $1</code>, giữ nhanh nhờ chỉ mục trong migration. Bài 3.3 dùng lại nó khi đổi mật khẩu; Chương 5 hiển thị danh sách thiết bị cho người dùng.</p>

<h3>Khi nào dùng cái gì</h3>
${BANG_VI}

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Session hay JWT?"</strong> — Phiên phía máy chủ thu hồi được tức thì (một DELETE) và token không mang nghĩa gì; cái giá là một lần tra mỗi request (bài 3.5 đo nó). Chương 4 nói JWT đánh đổi gì để khỏi tra.</li>
<li><strong>"Dùng mốc hết hạn nào?"</strong> — Cả nhàn rỗi lẫn tuyệt đối, cùng kiểm ở máy chủ: 30 phút nhàn rỗi, 12 giờ tuyệt đối cho ứng dụng phòng lab dùng cả ngày, ngắn hơn cho thứ giá trị cao.</li>
<li><strong>"Làm 'đăng xuất khỏi mọi thiết bị' thế nào?"</strong> — Phiên là các dòng khoá theo digest có chỉ mục trên user_id; một lệnh DELETE kết thúc tất cả.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Khi v0.3 đang chạy, chạy <code>bash demo3/sign-in.sh</code> và <code>node demo3/sessions-dump.mjs</code>. Tự tính digest của phiên: <code>node -e "console.log(require('crypto').createHash('sha256').update('&lt;token trong cookie jar&gt;').digest('hex'))"</code>.</li>
<li>Sửa <code>demo3/timeouts.mjs</code> để An gửi request mỗi 31 phút. Đoán output trước khi chạy.</li>
<li>Chạy <code>node demo3/touch-cost.mjs 4800</code> hai lần liền. Vì sao lần hai có thể hiện vài lần cập nhật?</li>
</ol>
<p><strong>Lời giải:</strong> 12 ký tự hex đầu của SHA-256 bạn tính khớp với bản dump. Với khoảng cách 31 phút, An bị đăng xuất ngay ở request đầu (07:31) — khoảng nào cũng vượt mốc nhàn rỗi. Lần chạy touch-cost thứ hai có thể hiện 1 lần cập nhật: phiên nó dùng là phiên mới, nhưng nếu hai request cách nhau hơn một phút thì bộ giới hạn cho phép chạm; trên máy của mình cả hai lần đều dưới 2 giây và ra 0.</p>
<p><strong>Đạt khi:</strong> bạn gắn được mỗi cột trong bảng phiên của mình với một câu hỏi, cả hai mốc hết hạn do máy chủ kiểm, và một đợt đọc dồn dập không gây ra một đợt ghi dồn dập.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">server-side session (phiên phía máy chủ)</span><span class="v">Trạng thái nằm trong một dòng trên máy chủ; trình duyệt chỉ mang một token ngẫu nhiên trỏ tới nó.</span></div>
  <div class="kv"><span class="k">idle timeout (hết hạn nhàn rỗi)</span><span class="v">Phiên kết thúc sau một khoảng không có request nào (ở đây 30 phút).</span></div>
  <div class="kv"><span class="k">absolute timeout (hết hạn tuyệt đối)</span><span class="v">Phiên kết thúc sau một khoảng cố định kể từ lúc đăng nhập, dù hoạt động tới đâu (ở đây 12 giờ).</span></div>
  <div class="kv"><span class="k">revocation (thu hồi)</span><span class="v">Kết thúc phiên trước hạn — một DELETE với phiên phía máy chủ.</span></div>
  <div class="kv"><span class="k">write amplification (khuếch đại ghi)</span><span class="v">Đường đọc mà gây ra ghi (cập nhật last_seen ở mọi request).</span></div>
  <div class="kv"><span class="k">sign out everywhere (đăng xuất khỏi mọi nơi)</span><span class="v">Xoá mọi phiên của một người, ví dụ sau khi đổi mật khẩu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phiên = một dòng trên máy chủ + một token ngẫu nhiên trong cookie; kết thúc nó = một DELETE.</li>
<li>Dòng lưu digest và một cột cho mỗi câu hỏi vận hành; token không bao giờ chạm vào thân JSON.</li>
<li>Hết hạn nhàn rỗi (30 phút) và tuyệt đối (12 giờ) đều do máy chủ kiểm, không dựa vào Max-Age.</li>
<li>Chạm last_seen tối đa mỗi phút: 1.000 lần đọc ⇒ 0 lần ghi thay vì 1.000.</li>
<li>Đăng xuất mọi nơi = <code>DELETE … WHERE user_id</code>, có chỉ mục.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Áp vào Node.js — bài 8.4: cookie, CSRF, thu hồi phiên', sub: 'Giống: cookie phiên trình duyệt tự gửi, và nhu cầu thu hồi. Bài đó thu hồi JWT bằng bộ đếm tokenVersion; bài này giữ phiên thành một dòng, nên thu hồi là một DELETE, và đo hết hạn cùng số lần ghi last_seen. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
