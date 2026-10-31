/**
 * Testing · Chương 5 · 5.2 — Test xác thực và phân quyền. Slug giữ từ khung: tst-5-2-xac-thuc.
 * Chạy thật: jose 6.2.12 (HS256), token thật với khoá test, đồng hồ điều khiển; 401 / 403 / 404 (IDOR); role trong body ⇒ 400.
 */
import G from '../giang/tst-05-2.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|×|Tests /.test(l)).join('\n');

const BANG_EN = `<table>
<thead><tr><th>Status</th><th>The question</th><th>LabFlow Lite</th></tr></thead>
<tbody>
<tr><td><strong>401 Unauthorized</strong></td><td>Who are you? No valid identity.</td><td>missing, malformed, forged or expired token</td></tr>
<tr><td><strong>403 Forbidden</strong></td><td>I know you — you may not do this.</td><td>a student or lecturer on <code>/api/admin/bookings</code></td></tr>
<tr><td><strong>404 Not Found</strong></td><td>Nothing there — or nothing <em>for you</em>.</td><td>another student’s booking</td></tr>
</tbody></table>`;
const BANG_VI = `<table>
<thead><tr><th>Mã</th><th>Câu hỏi</th><th>LabFlow Lite</th></tr></thead>
<tbody>
<tr><td><strong>401 Unauthorized</strong></td><td>Bạn là ai? Không có danh tính hợp lệ.</td><td>token thiếu, sai dạng, giả mạo hoặc hết hạn</td></tr>
<tr><td><strong>403 Forbidden</strong></td><td>Tôi biết bạn — bạn không được làm việc này.</td><td>sinh viên hay giảng viên vào <code>/api/admin/bookings</code></td></tr>
<tr><td><strong>404 Not Found</strong></td><td>Không có gì — hoặc không có gì <em>cho bạn</em>.</td><td>lượt đặt của sinh viên khác</td></tr>
</tbody></table>`;

export default {
  title: '5.2 — Testing authentication and authorisation: 401, 403, 404|||5.2 — Test xác thực và phân quyền: 401, 403, 404',
  slug: 'tst-5-2-xac-thuc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Token JWT thật (jose, HS256) ký bằng khoá test, đồng hồ là tham số; 401 cho token thiếu/sai/giả/hết hạn, 403 cho sinh viên ở route admin, 404 cho lượt đặt của người khác (IDOR, OWASP A01); vai trò nhét trong body bị từ chối; biên hết hạn token 09:59:59 / 10:00:00.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Testing authentication and authorisation</h2>
<p class="lead">Authentication answers “who are you?”, authorisation answers “what may you see?”. Bugs in either are the most expensive kind: they leak other people’s data. This lesson tests both with real tokens — no mocks — and a clock we control.</p>

<h3>Real tokens, a test secret, a clock parameter</h3>
${ma('javascript', CODE.auth)}
<p><code>createAuth</code> signs and verifies HS256 JSON Web Tokens with <a href="https://github.com/panva/jose" target="_blank" rel="noopener">jose</a>. The app reads <code>Authorization: Bearer &lt;token&gt;</code> in <code>requireUser</code> (shown in lesson 5.1) and sets <code>req.user</code>. Tests use exactly this code with a test secret (<code>makeApi().bearer(id, role)</code>), so a bug in token handling cannot hide behind an auth mock. The clock is a parameter — the habit from Chapter 2 — so expiry can be tested without waiting an hour.</p>

<h3>401, 403 or 404?</h3>
${BANG_EN}
<p>Returning 404 for someone else’s booking is deliberate. A 403 would confirm that booking 2 exists, and an attacker could count bookings by trying ids. Changing an id in the URL to read another person’s data is called <strong>IDOR</strong> (Insecure Direct Object Reference), part of “broken access control”, number one on the OWASP Top 10 (2021).</p>

<h3>The tests</h3>
${ma('javascript', CODE.authTest)}
${ra(gon(OUT['52-auth']))}
<ul>
<li><strong>Forged token</strong>: a token signed with another secret claims ADMIN — the signature check refuses it.</li>
<li><strong>Expiry</strong>: the same token is valid at 09:00 (404 — valid, but no booking 1) and refused at 10:01 (401). The clock is fixed in 2030, so no real clock could accidentally agree with the test.</li>
<li><strong>Access as a table</strong>: owner 200, another student 404, admin 200. Lab 5 extends it to lecturers.</li>
<li><strong>A role in the body</strong>: the schema is strict, so <code>role: 'ADMIN'</code> in the request is refused with 400 — the role comes from the token only.</li>
</ul>

<p><strong>Spring Boot</strong>: the same tests are written with MockMvc or <code>WebTestClient</code> and a real JWT, or Spring Security’s <code>jwt()</code> request post-processor — the table of who-may-see-what stays the same.</p>

${lienKet({ bai: 'swt301-test-types', title: 'Also in SWT301 — Test types: security tests', sub: 'Same: security testing covers authorisation and levels of access to information. Different: here each level of access becomes an automated, repeatable API test.', cta: 'OPEN SWT301 LESSON →' })}
${lienKet({ khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-5-2-jwt-cors', title: 'Also in SDN302 — 5.2: JWT, HTTPS, CORS', sub: 'Same: JWT bearer tokens protect Express routes. Different: here every rule of the protection is a test — forged, expired and missing tokens, roles, and other people’s data.', cta: 'OPEN SDN302 LESSON →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-3-requireauth-phan-quyen', title: 'Also in the Node.js course — 8.3: requireAuth and permissions', sub: 'How the middleware and role checks are built; this lesson is how to prove they work.', cta: 'OPEN LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>A lecturer on the admin list → 403.</li>
<li>A token issued at 09:00 for one hour: still valid at 09:59:59, refused at exactly 10:00:00 (a boundary, like lessons 1.4 and 2.2).</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th52)}
${ra(gon(OUT['52-th']))}
<p>At 10:00:00 exactly the token is refused: jose treats the expiry time itself as already expired.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">authentication / authorisation</span><span class="v">Proving who you are / deciding what you may do.</span></div>
  <div class="kv"><span class="k">JWT (JSON Web Token)</span><span class="v">A signed token carrying claims such as the user id (<code>sub</code>), role and expiry (<code>exp</code>).</span></div>
  <div class="kv"><span class="k">IDOR</span><span class="v">Reading or changing another user’s object by changing its id.</span></div>
  <div class="kv"><span class="k">privilege escalation</span><span class="v">Getting rights you should not have — e.g. a role accepted from the request body.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 Who may read booking 1?</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">No or bad token</div><div class="lz-d">401 — who are you?</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Valid token</div><div class="lz-d">identity and role from the token, never the body</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Admin route, wrong role</div><div class="lz-d">403 — not allowed</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Someone else’s booking</div><div class="lz-d">404 — looks missing (IDOR)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Owner or admin</div><div class="lz-d">200 with the booking</div></div>
</div>
<div class="pitfall"><strong>Testing auth only as the owner.</strong> If every test reads its own data, the IDOR bug — anyone can read anyone’s booking — stays green. Write access control as a table: every role against own and other people’s data.</div>
<h3>📌 Summary</h3>
<ul>
<li>Test with real tokens and a test secret; never mock authentication.</li>
<li>401 who are you · 403 not allowed · 404 not found, or not yours.</li>
<li>Control the clock to test expiry at its boundary.</li>
<li>Identity and role come from the token, never from the body.</li>
<li>Write access control as a table: every role × own and other people’s data.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Test xác thực và phân quyền</h2>
<p class="lead">Xác thực (authentication) trả lời “bạn là ai?”, phân quyền (authorisation) trả lời “bạn được xem gì?”. Bug ở chỗ nào trong hai chỗ này cũng thuộc loại đắt nhất: chúng làm lộ dữ liệu của người khác. Bài này test cả hai bằng token thật — không mock — và một đồng hồ do ta điều khiển.</p>

<h3>Token thật, khoá bí mật cho test, đồng hồ là tham số</h3>
${ma('javascript', CODE.auth)}
<p><code>createAuth</code> ký và kiểm JSON Web Token HS256 bằng <a href="https://github.com/panva/jose" target="_blank" rel="noopener">jose</a>. App đọc <code>Authorization: Bearer &lt;token&gt;</code> trong <code>requireUser</code> (ở bài 5.1) rồi gán <code>req.user</code>. Test dùng đúng code này với một khoá bí mật cho test (<code>makeApi().bearer(id, role)</code>), nên một bug trong xử lý token không thể nấp sau một mock xác thực. Đồng hồ là tham số — thói quen từ Chương 2 — để test hết hạn mà không phải chờ một tiếng.</p>

<h3>401, 403 hay 404?</h3>
${BANG_VI}
<p>Trả 404 cho lượt đặt của người khác là có chủ ý. Trả 403 sẽ xác nhận lượt đặt số 2 có tồn tại, và kẻ tấn công đếm được số lượt đặt bằng cách thử id. Đổi id trên URL để đọc dữ liệu người khác gọi là <strong>IDOR</strong> (Insecure Direct Object Reference), thuộc nhóm “broken access control” (phân quyền hỏng), đứng đầu OWASP Top 10 (2021).</p>

<h3>Các test</h3>
${ma('javascript', CODE.authTest)}
${ra(gon(OUT['52-auth']))}
<ul>
<li><strong>Token giả mạo</strong>: token ký bằng khoá khác, tự xưng ADMIN — bước kiểm chữ ký từ chối nó.</li>
<li><strong>Hết hạn</strong>: cùng một token hợp lệ lúc 09:00 (404 — hợp lệ, nhưng chưa có lượt đặt 1) và bị từ chối lúc 10:01 (401). Đồng hồ cố định ở năm 2030, nên không đồng hồ thật nào có thể vô tình khớp với test.</li>
<li><strong>Phân quyền dạng bảng</strong>: chủ sở hữu 200, sinh viên khác 404, admin 200. Lab 5 mở rộng thêm giảng viên.</li>
<li><strong>Vai trò trong body</strong>: schema nghiêm ngặt, nên <code>role: 'ADMIN'</code> trong request bị từ chối với 400 — vai trò chỉ lấy từ token.</li>
</ul>

<p><strong>Spring Boot</strong>: các test này viết bằng MockMvc hoặc <code>WebTestClient</code> với JWT thật, hoặc bộ hậu xử lý <code>jwt()</code> của Spring Security — bảng ai-được-xem-gì vẫn y nguyên.</p>

${lienKet({ bai: 'swt301-test-types', title: 'Đã gặp ở SWT301 — Test types: security tests', sub: 'Giống: security testing gồm phân quyền và mức truy cập thông tin. Khác: ở đây mỗi mức truy cập thành một test API tự động, chạy lại được.', cta: 'MỞ BÀI SWT301 →' })}
${lienKet({ khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-5-2-jwt-cors', title: 'Đã gặp ở SDN302 — 5.2: JWT, HTTPS, CORS', sub: 'Giống: token JWT dạng Bearer bảo vệ route Express. Khác: ở đây mọi luật của lớp bảo vệ đó là một test — token giả, hết hạn, thiếu, vai trò, và dữ liệu của người khác.', cta: 'MỞ BÀI SDN302 →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-3-requireauth-phan-quyen', title: 'Gặp lại ở khoá Node.js — 8.3: requireAuth và phân quyền', sub: 'Middleware và phần kiểm vai trò được dựng thế nào; bài này là cách chứng minh chúng chạy đúng.', cta: 'MỞ BÀI →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Giảng viên vào danh sách admin → 403.</li>
<li>Token phát lúc 09:00 có hạn một giờ: vẫn hợp lệ lúc 09:59:59, bị từ chối đúng lúc 10:00:00 (một biên, như bài 1.4 và 2.2).</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th52)}
${ra(gon(OUT['52-th']))}
<p>Đúng 10:00:00 token bị từ chối: jose coi chính thời điểm hết hạn là đã hết hạn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">authentication / authorisation (xác thực / phân quyền)</span><span class="v">Chứng minh bạn là ai / quyết định bạn được làm gì.</span></div>
  <div class="kv"><span class="k">JWT (JSON Web Token)</span><span class="v">Token có chữ ký mang các thông tin như id người dùng (<code>sub</code>), vai trò và hạn dùng (<code>exp</code>).</span></div>
  <div class="kv"><span class="k">IDOR</span><span class="v">Đọc hay sửa đối tượng của người khác bằng cách đổi id của nó.</span></div>
  <div class="kv"><span class="k">privilege escalation (leo thang quyền)</span><span class="v">Có được quyền không nên có — vd vai trò được nhận từ body của request.</span></div>
</div>

<h3>🗺 Ai được đọc lượt đặt 1?</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Không có hoặc sai token</div><div class="lz-d">401 — bạn là ai?</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Token hợp lệ</div><div class="lz-d">danh tính và vai trò lấy từ token, không bao giờ từ body</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Route admin, sai vai trò</div><div class="lz-d">403 — không được phép</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Lượt đặt của người khác</div><div class="lz-d">404 — trông như không tồn tại (IDOR)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Chủ sở hữu hoặc admin</div><div class="lz-d">200 kèm lượt đặt</div></div>
</div>
<div class="pitfall"><strong>Chỉ test xác thực với vai chủ sở hữu.</strong> Nếu mọi test chỉ đọc dữ liệu của chính mình, bug IDOR — ai cũng đọc được lượt đặt của ai — vẫn xanh. Hãy viết phân quyền thành bảng: mọi vai trò so với dữ liệu của mình và của người khác.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Test bằng token thật và khoá cho test; đừng bao giờ mock xác thực.</li>
<li>401 bạn là ai · 403 không được phép · 404 không có, hoặc không phải của bạn.</li>
<li>Điều khiển đồng hồ để test hết hạn ngay tại biên.</li>
<li>Danh tính và vai trò lấy từ token, không bao giờ từ body.</li>
<li>Viết phân quyền thành bảng: mọi vai trò × dữ liệu của mình và của người khác.</li>
</ul>
</div>
`,
};
