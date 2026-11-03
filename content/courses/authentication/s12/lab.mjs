/**
 * Authentication · Chương 12 · Lab 12 = DỰ ÁN CUỐI KHOÁ — LabFlow ID v1.0 dưới tấn công. BÀI MỚI, slug auth-12-7-lab-du-an-cuoi-khoa.
 * Máy chấm = scripts/cham-cuoi-khoa.mjs (12 kịch bản, 100 điểm, đạt 70). Output: tham khảo 100/100, yếu 25/100, khởi đầu 0/100.
 */
import G from '../giang/auth-lab-12.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const SETUP = `cp -r sub-cuoi/starter sub-cuoi/my
node scripts/cham-cuoi-khoa.mjs sub-cuoi/my      # 12 attack scenarios, 100 points, pass 70`;

const SCEN_EN = `<table>
<thead><tr><th>Attack scenario</th><th>Chapter · points</th></tr></thead>
<tbody>
<tr><td>Database dump: a weak stored hash is flagged, argon2id in use</td><td>Ch2 · 8</td></tr>
<tr><td>Email enumeration: identical sign-up message either way</td><td>Ch6 · 8</td></tr>
<tr><td>Homograph email: a full-width look-alike folds together</td><td>Ch6 · 8</td></tr>
<tr><td>Session guessing: a high-entropy session id</td><td>Ch1/3 · 8</td></tr>
<tr><td>alg:none rejected; only the expected algorithm accepted</td><td>Ch4 · 9</td></tr>
<tr><td>Refresh reuse: a replay revokes the token family</td><td>Ch5 · 8</td></tr>
<tr><td>Cookie posture: HttpOnly, Secure, __Host-, SameSite≠None</td><td>Ch3 · 9</td></tr>
<tr><td>Forged ID token: a bad signature is rejected</td><td>Ch8 · 9</td></tr>
<tr><td>Phishing: a passkey resists a relay, TOTP does not</td><td>Ch7/10 · 8</td></tr>
<tr><td>IDOR / cross-tenant: an other-tenant admin is denied</td><td>Ch9 · 9</td></tr>
<tr><td>10k credential stuffing: a flood is blocked, a real user is not</td><td>Ch10 · 8</td></tr>
<tr><td>Audit log: a logged event leaks no token or password</td><td>Ch11 · 8</td></tr>
</tbody>
</table>`;
const SCEN_VI = `<table>
<thead><tr><th>Kịch bản tấn công</th><th>Chương · điểm</th></tr></thead>
<tbody>
<tr><td>Dump cơ sở dữ liệu: một hash cũ bị gắn cờ, dùng argon2id</td><td>Ch2 · 8</td></tr>
<tr><td>Dò email: cùng một thông điệp đăng ký hai chiều</td><td>Ch6 · 8</td></tr>
<tr><td>Email homograph: một bản nhái full-width gộp lại</td><td>Ch6 · 8</td></tr>
<tr><td>Đoán phiên: một session id entropy cao</td><td>Ch1/3 · 8</td></tr>
<tr><td>alg:none bị từ chối; chỉ thuật toán mong đợi được nhận</td><td>Ch4 · 9</td></tr>
<tr><td>Tái dùng refresh: một lần phát lại thu hồi họ token</td><td>Ch5 · 8</td></tr>
<tr><td>Cookie: HttpOnly, Secure, __Host-, SameSite≠None</td><td>Ch3 · 9</td></tr>
<tr><td>Giả ID token: một chữ ký sai bị từ chối</td><td>Ch8 · 9</td></tr>
<tr><td>Lừa đảo: một passkey kháng relay, TOTP không</td><td>Ch7/10 · 8</td></tr>
<tr><td>IDOR / khác tenant: một admin khác tenant bị từ chối</td><td>Ch9 · 9</td></tr>
<tr><td>Nhồi 10k mật khẩu: một đợt dội bị chặn, một người thật không</td><td>Ch10 · 8</td></tr>
<tr><td>Nhật ký: một sự kiện bị log không rò token hay mật khẩu</td><td>Ch11 · 8</td></tr>
</tbody>
</table>`;

export default {
  title: 'Final project — LabFlow ID v1.0 under attack|||Dự án cuối khoá — LabFlow ID v1.0 dưới tấn công',
  slug: 'auth-12-7-lab-du-an-cuoi-khoa',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Dự án cuối khoá, thang 100 điểm (đạt 70) chấm bằng máy: LabFlow ID v1.0 — mọi quyết định của cả khoá nối lại — chạy qua ~12 KỊCH BẢN TẤN CÔNG THẬT, mỗi cái một chương: dump CSDL (Ch2), dò email + homograph (Ch6), đoán phiên (Ch1/3), alg:none (Ch4), tái dùng refresh (Ch5), CSRF/cookie (Ch3), giả ID token (Ch8), relay TOTP (Ch7/10), IDOR khác tenant (Ch9), nhồi 10k (Ch10), rò nhật ký (Ch11). Bạn điền mỗi export với lựa chọn đã cứng (nối với module bạn dựng, hoặc viết lại). Output thật: khởi đầu 0/100; bản "yếu" làm đúng CƠ BẢN (argon2id, cờ cookie, tái dùng refresh = 25/100) nhưng bỏ hardening (cho mọi phân quyền, không chặn phun, log bí mật, dò email, nhận alg:none); tham khảo (nối mọi quyết định tới module đã cứng) 100/100, 54 test xanh. Mỗi ✗ là một chương bỏ sót. Kể theo STAR cho CV.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Final project</span>
<h2>Final project — LabFlow ID v1.0 under attack</h2>
<p class="lead">This is the capstone: everything you built across twelve chapters, wired together into LabFlow ID v1.0 and graded by roughly twelve real attack scenarios — one per chapter — for 100 points, pass 70. A weak build scores low on the attacks it misses; the reference scores 100. Passing it means you can build it, break it, and fix it.</p>

<div class="callout ok">
<p><strong>After this project you can:</strong> assemble a production-posture identity service that resists a dozen real attacks; read a scorecard as a map of which chapter each defence comes from; and tell the whole thing as a STAR story for a CV or interview.</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v1.0. The grader is pure — no database, no network:
${ma('bash', SETUP)}</li>
<li>Grade the empty starter once:
${ra(OUT['cuoi-starter'])}</li>
<li>Work in <code>sub-cuoi/my/index.js</code>. Fill each export with the hardened choice — wire it to the module you built across the course (<code>needsRehash</code>, <code>normalizeEmail</code>, <code>verifyIdToken</code>, <code>can</code>, <code>decide</code>, <code>safeAudit</code>), or re-implement it — plus the posture declarations (<code>passwordScheme</code>, <code>cookieAttrs</code>, …).</li>
</ol>

<h3>The twelve attack scenarios</h3>
<p>Each scenario is a lesson of the course, run as an attack. Resisting it is worth its points:</p>
${SCEN_EN}

<h3>A weak build: runs, but insecure</h3>
<p>The "yeu" submission got the <em>basics</em> right — argon2id hashing (Ch2), the cookie flags (Ch3), refresh reuse (Ch5) — but missed the hardening the later chapters spent their time on. It runs a happy-path demo and scores 25/100:</p>
${ma('javascript', CODE.yeu_cuoi)}
${ra(OUT['cuoi-yeu'])}
<p>Read the scorecard: a ✓ for each basic it got right and a ✗ for each hardening it skipped — it allows any authorization (Ch9), never blocks a spray (Ch10), logs secrets (Ch11), enumerates emails (Ch6) and accepts <code>alg:none</code> (Ch4). "Runs" is not "secure", and the scorecard names every gap by its chapter.</p>

<h3>The reference: 100/100</h3>
<p>The reference wires every decision to the hardened module and declares a safe posture. Every attack is resisted:</p>
${ma('javascript', CODE.thamkhao_cuoi)}
${ra(OUT['cuoi-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Tell it as a STAR story</h3>
<p>The capstone hands you a CV story: <em>Situation</em> — an identity service exposed to real attacks; <em>Task</em> — defend database dumps, credential stuffing, phishing relays, token forgery and IDOR; <em>Action</em> — argon2id, origin-bound passkeys, a tenant-first authorization gate, a stuffing defence, an allow-list audit log; <em>Result</em> — 100/100 against an automated attack suite, and the ability to explain each defence by the attack it stops.</p>

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-cuoi-khoa.mjs sub-cuoi/my</code> prints <code>TOTAL</code> ≥ 70 (target 100).</li>
<li>For every scenario you pass, you can explain it by the attack it defends against.</li>
<li>For every ✗ in a weaker build, you can name the chapter it skipped.</li>
</ul>
<p><strong>Done when:</strong> your LabFlow ID v1.0 scores ≥ 70/100 (aim for 100), and you can present it as the end-to-end story of building, breaking and fixing an identity service.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Dự án cuối khoá</span>
<h2>Dự án cuối khoá — LabFlow ID v1.0 dưới tấn công</h2>
<p class="lead">Đây là dự án cuối: mọi thứ bạn dựng suốt mười hai chương, nối lại thành LabFlow ID v1.0 và chấm bởi khoảng mười hai kịch bản tấn công thật — mỗi cái một chương — cho 100 điểm, đạt 70. Một build yếu đạt thấp ở các cú tấn công nó bỏ sót; bản tham khảo đạt 100. Qua nó nghĩa là bạn dựng được, phá được, và sửa được.</p>

<div class="callout ok">
<p><strong>Học xong dự án này bạn làm được:</strong> lắp một dịch vụ danh tính posture-production kháng cả tá cú tấn công thật; đọc một bảng điểm như một bản đồ chương nào mỗi phòng thủ đến từ; và kể cả thứ như một câu chuyện STAR cho CV hay phỏng vấn.</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v1.0. Máy chấm thuần — không cơ sở dữ liệu, không mạng:
${ma('bash', SETUP)}</li>
<li>Chấm bản khởi đầu rỗng một lần:
${ra(OUT['cuoi-starter'])}</li>
<li>Làm trong <code>sub-cuoi/my/index.js</code>. Điền mỗi export với lựa chọn đã cứng — nối nó với module bạn dựng suốt khoá (<code>needsRehash</code>, <code>normalizeEmail</code>, <code>verifyIdToken</code>, <code>can</code>, <code>decide</code>, <code>safeAudit</code>), hoặc viết lại — cộng các khai báo posture (<code>passwordScheme</code>, <code>cookieAttrs</code>, …).</li>
</ol>

<h3>Mười hai kịch bản tấn công</h3>
<p>Mỗi kịch bản là một bài của khoá, chạy như một cú tấn công. Kháng nó được điểm của nó:</p>
${SCEN_VI}

<h3>Một build yếu: chạy, nhưng không an toàn</h3>
<p>Bản "yếu" làm đúng <em>cơ bản</em> — băm argon2id (Ch2), các cờ cookie (Ch3), tái dùng refresh (Ch5) — nhưng bỏ hardening mà các chương sau dành thời gian. Nó chạy một demo đường-đẹp và đạt 25/100:</p>
${ma('javascript', CODE.yeu_cuoi)}
${ra(OUT['cuoi-yeu'])}
<p>Đọc bảng điểm: một ✓ cho mỗi cơ bản nó làm đúng và một ✗ cho mỗi hardening nó bỏ qua — nó cho mọi phân quyền (Ch9), không bao giờ chặn một đợt phun (Ch10), log bí mật (Ch11), dò email (Ch6) và nhận <code>alg:none</code> (Ch4). "Chạy" không phải "an toàn", và bảng điểm gọi tên mọi khoảng trống bằng chương của nó.</p>

<h3>Bản tham khảo: 100/100</h3>
<p>Bản tham khảo nối mọi quyết định tới module đã cứng và khai một posture an toàn. Mọi cú tấn công bị kháng:</p>
${ma('javascript', CODE.thamkhao_cuoi)}
${ra(OUT['cuoi-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Kể theo câu chuyện STAR</h3>
<p>Dự án cuối trao cho bạn một câu chuyện CV: <em>Tình huống</em> — một dịch vụ danh tính phơi ra trước các cú tấn công thật; <em>Nhiệm vụ</em> — phòng dump cơ sở dữ liệu, nhồi tín vật, relay lừa đảo, giả token và IDOR; <em>Hành động</em> — argon2id, passkey gắn-origin, một cổng phân quyền tenant-trước, một phòng thủ nhồi, một nhật ký kiểm toán allow-list; <em>Kết quả</em> — 100/100 trước một bộ tấn công tự động, và khả năng giải thích mỗi phòng thủ bằng cú tấn công nó chặn.</p>

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-cuoi-khoa.mjs sub-cuoi/my</code> in <code>TOTAL</code> ≥ 70 (mục tiêu 100).</li>
<li>Với mỗi kịch bản bạn qua, bạn giải thích được nó bằng cú tấn công nó phòng.</li>
<li>Với mỗi ✗ trong một build yếu hơn, bạn gọi được tên chương nó bỏ qua.</li>
</ul>
<p><strong>Đạt khi:</strong> LabFlow ID v1.0 của bạn đạt ≥ 70/100 (nhắm 100), và bạn trình bày được nó như câu chuyện từ-đầu-tới-cuối của việc dựng, phá và sửa một dịch vụ danh tính.</p>
</div>
`,
};
