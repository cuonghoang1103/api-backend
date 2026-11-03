/**
 * Authentication · Chương 12 · 12.1 — Năm phút đầu tiên: "người dùng không đăng nhập được". Slug giữ: auth-12-1-nam-phut-dau. Bài đầu chương.
 * Code THẬT từ _ma.mjs (demo12/diagnose.mjs) + output (LabFlow ID v1.0).
 */
import G from '../giang/auth-12-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const CURL = `# The first thing to run — not the first file to open.
curl -s -o /dev/null -w "%{http_code}" https://id.labflow.example/api/v1/auth/login
# 404 = stale build · 500 = crashed dependency · 403 = authorization · 401 = pipe intact · 200 = look past login`;

const NGUON_EN = [
  nguon('📊', 'MDN — HTTP response status codes', 'What each status means — the foundation of status-first diagnosis (read 04/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status'),
  nguon('🔐', 'OWASP — Authentication Cheat Sheet', 'Correct auth behaviour to compare a broken system against (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('📊', 'MDN — Mã trạng thái phản hồi HTTP', 'Mỗi mã nghĩa là gì — nền của chẩn đoán mã-trạng-thái-trước (đọc 04/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status'),
  nguon('🔐', 'OWASP — Authentication Cheat Sheet', 'Hành vi xác thực đúng để so một hệ hỏng với nó (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
].join('\n');

export default {
  title: '12.1 — The first five minutes: "users cannot log in"|||12.1 — Năm phút đầu tiên: "người dùng không đăng nhập được"',
  slug: 'auth-12-1-nam-phut-dau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chương cuối là CHẨN ĐOÁN, không phải tính năng mới. Bắt đầu từ page phổ biến nhất ("người dùng không đăng nhập được") và một phương pháp năm phút: ĐO TRƯỚC KHI ĐOÁN. curl endpoint đăng nhập không xác thực và đọc mã HTTP — mã thu hẹp vấn đề về một TẦNG trong vài giây, trước khi đọc một dòng. 404 = build CŨ/một phần (tuyến có trong nguồn, không trong ảnh đang chạy; sửa = deploy sạch, không phải sửa mã); 500 = một phụ thuộc sập (bí mật thiếu Ch11, DB/Redis sập — đọc log + banner khởi động); 403 = PHÂN QUYỀN không xác thực (vai/tenant Ch9 — đừng debug mật khẩu); 401 = tuyến ĐƯỢC GẮN, ống nguyên vẹn (thử một đăng nhập thật); 200 = đăng nhập chạy, vấn đề ở SAU (cookie, redirect, client). Một request một lần; mã trạng thái gọi tên tầng. Hai nguồn rẻ: mã trạng thái + banner khởi động. Theo MDN HTTP status + OWASP Authentication.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>The first five minutes: "users cannot log in"</h2>
<p class="lead">The final chapter is not new features. It is finding the fault fast when the thing you built breaks, and reviewing a system you did not write. It opens with the most common page an on-call engineer gets — "users cannot log in" — and a five-minute method that beats opening the code and guessing.</p>

<div class="callout ok">
<p><strong>After Chapter 12 you can:</strong> diagnose a broken login from the outside in minutes, recognise eight recurring failure shapes, use a small toolbox to answer questions yourself, review an auth codebase you did not write, and ship LabFlow ID v1.0 — graded by a suite of real attacks. The final exam and the capstone project close the course.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>diagnose a login outage by its HTTP status before reading any code;</li>
<li>map 404 / 500 / 403 / 401 / 200 each to the layer that is broken;</li>
<li>change one thing at a time, and read the startup banner alongside the status.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> the difference between a ten-minute fix and a two-hour one is almost never knowledge of the code — it is method. Measuring first turns a vague "login is broken" into a named layer.</p>
</div>

<h3>Measure before you guess</h3>
<p>The temptation is to open the handler and start reading. The faster path is a single measurement: curl the login endpoint unauthenticated and read the HTTP status.</p>
${ma('bash', CURL)}
<p>The status narrows the problem to a layer in seconds, before you have read a line. Each value points somewhere different, and ruling out a layer is as valuable as finding the fault.</p>

<h3>The decision tree, measured</h3>
${ra(OUT['121-diagnose'])}
<p>Read the mapping: a <strong>404</strong> on a route that exists in the source is a stale or partial build — the fix is a clean redeploy, not a code change (the "is it even live?" check from the earliest chapters). A <strong>500</strong> is a crashed dependency — a missing secret, the database or Redis down — so read the server log and the startup banner (Chapter 11). A <strong>403</strong> is authorization, not authentication (Chapter 9) — do not debug the password. A <strong>401</strong> means the route is mounted and the pipe is intact, so try a real login. A <strong>200</strong> means login works and the problem is after it — the cookie, a redirect, the client.</p>

<h3>One request at a time</h3>
<p>Change one thing, measure, repeat. The failures that waste hours are the ones where you changed three things and cannot tell which fixed or broke it. The status-first method is disciplined: each check rules out a layer before you touch the next. And two cheap sources answer most questions — the request's status, and the startup banner showing which secrets loaded (Chapter 11). A 500 plus a banner reading <code>[MISSING] SESSION_SECRET</code> is the whole diagnosis in two lines.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — reading the code before measuring.</strong> Opening the login handler and tracing logic is the slow path when a 404 would have told you the route is not even mounted, or a 500 would have pointed at a dead database. The code is probably correct; the environment, the build, or a dependency is usually the fault. Measure the outside first; read the inside only once the status has named the layer.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Login is down — what is your first step?"</strong> — curl the endpoint and read the status. 404 = stale build, 500 = dependency, 403 = authz, 401 = pipe intact, 200 = after login.</li>
<li><strong>"You get a 403 on login. Where do you look?"</strong> — Authorization (role/tenant), not the password. 403 is "known but forbidden".</li>
<li><strong>"A route 404s but it is in the code."</strong> — Almost always a stale or partial build; redeploy a clean image. Diagnose route health with an unauth curl, not the browser.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo12/diagnose.mjs</code>. A login route returns 404 but the handler is clearly in the source. What is the most likely cause, and the fix?</li>
<li>You get a 403 on the login flow. What should you NOT waste time on?</li>
<li>Login returns 200 but users say they are "not logged in". Where is the problem?</li>
</ol>
<p><strong>Solution:</strong> (1) a stale or partial build — the running image lacks the route; redeploy a clean build, do not edit code. (2) the password and the hashing — a 403 is authorization (the user is known but forbidden), not authentication. (3) after login: the session cookie (flags, SameSite), a redirect, or the client not sending credentials — the login pipeline itself is fine.</p>
<p><strong>Done when:</strong> you can name the broken layer from the status before reading any code, and you change one thing at a time.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">status-first diagnosis</span><span class="v">Reading the HTTP status to narrow the fault to a layer before reading code.</span></div>
  <div class="kv"><span class="k">stale build (404)</span><span class="v">A running image missing a route that exists in source — redeploy, don't edit.</span></div>
  <div class="kv"><span class="k">403 vs 401</span><span class="v">403 is authorization (known but forbidden); 401 is the pipe intact, try a real login.</span></div>
  <div class="kv"><span class="k">startup banner</span><span class="v">The redacted config log (Chapter 11) showing which secrets loaded.</span></div>
  <div class="kv"><span class="k">one change at a time</span><span class="v">Change, measure, repeat — so you always know what did it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measure before you guess: curl the login route and read the status.</li>
<li>404 = stale build; 500 = crashed dependency; 403 = authorization; 401 = pipe intact; 200 = look past login.</li>
<li>The status names the broken layer in seconds, before you read any code.</li>
<li>Change one thing at a time; read the startup banner alongside the status.</li>
<li>The code is usually right — the environment, build or a dependency is the fault.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-0-2-ba-bai-toan', title: 'Back to 0.2 — the three gates and 401/403/404', sub: 'There, the very first framing of 401 (who are you), 403 (you may not), 404 (hiding existence). Here, those same three statuses are your fastest diagnostic. The idea that opened the course closes it.', cta: 'OPEN LESSON 0.2 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Năm phút đầu tiên: "người dùng không đăng nhập được"</h2>
<p class="lead">Chương cuối không phải tính năng mới. Nó là tìm lỗi nhanh khi thứ bạn dựng hỏng, và soát một hệ thống bạn không viết. Nó mở bằng cái page phổ biến nhất một kỹ sư trực nhận — "người dùng không đăng nhập được" — và một phương pháp năm phút thắng việc mở mã và đoán.</p>

<div class="callout ok">
<p><strong>Học xong Chương 12 bạn làm được:</strong> chẩn đoán một đăng nhập hỏng từ ngoài vào trong vài phút, nhận ra tám hình dạng hỏng lặp lại, dùng một hộp đồ nghề nhỏ để tự trả lời câu hỏi, soát một kho mã xác thực bạn không viết, và ship LabFlow ID v1.0 — chấm bởi một bộ tấn công thật. Thi cuối khoá và dự án cuối khoá đóng khoá học.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>chẩn đoán một sự cố đăng nhập theo mã HTTP của nó trước khi đọc mã;</li>
<li>ánh xạ 404 / 500 / 403 / 401 / 200 mỗi cái tới tầng đang hỏng;</li>
<li>đổi một thứ một lần, và đọc banner khởi động cạnh mã trạng thái.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> khác biệt giữa một bản sửa mười phút và một bản hai giờ gần như không bao giờ là kiến thức về mã — nó là phương pháp. Đo trước biến một "đăng nhập hỏng" mơ hồ thành một tầng có tên.</p>
</div>

<h3>Đo trước khi đoán</h3>
<p>Cám dỗ là mở handler và bắt đầu đọc. Đường nhanh hơn là một phép đo duy nhất: curl endpoint đăng nhập không xác thực và đọc mã trạng thái HTTP.</p>
${ma('bash', CURL)}
<p>Mã trạng thái thu hẹp vấn đề về một tầng trong vài giây, trước khi bạn đọc một dòng. Mỗi giá trị chỉ một nơi khác, và loại một tầng cũng giá trị như tìm ra lỗi.</p>

<h3>Cây quyết định, đo được</h3>
${ra(OUT['121-diagnose'])}
<p>Đọc ánh xạ: một <strong>404</strong> trên một tuyến có trong nguồn là một build cũ hay một phần — cách sửa là một lần deploy sạch, không phải một thay đổi mã (phép kiểm "nó có sống không?" từ các chương đầu). Một <strong>500</strong> là một phụ thuộc sập — một bí mật thiếu, cơ sở dữ liệu hay Redis sập — nên đọc log máy chủ và banner khởi động (Chương 11). Một <strong>403</strong> là phân quyền, không phải xác thực (Chương 9) — đừng debug mật khẩu. Một <strong>401</strong> nghĩa là tuyến được gắn và ống nguyên vẹn, nên thử một đăng nhập thật. Một <strong>200</strong> nghĩa là đăng nhập chạy và vấn đề ở sau nó — cookie, một redirect, client.</p>

<h3>Một request một lần</h3>
<p>Đổi một thứ, đo, lặp. Các kiểu hỏng tốn hàng giờ là những cái bạn đổi ba thứ và không biết cái nào sửa hay làm hỏng. Phương pháp mã-trạng-thái-trước có kỷ luật: mỗi phép kiểm loại một tầng trước khi bạn chạm cái tiếp theo. Và hai nguồn rẻ trả lời phần lớn câu hỏi — mã trạng thái của request, và banner khởi động hiện bí mật nào nạp (Chương 11). Một 500 cộng một banner đọc <code>[MISSING] SESSION_SECRET</code> là cả chẩn đoán trong hai dòng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — đọc mã trước khi đo.</strong> Mở handler đăng nhập và lần logic là đường chậm khi một 404 đã nói tuyến thậm chí không được gắn, hay một 500 đã chỉ vào một cơ sở dữ liệu chết. Mã có lẽ đúng; môi trường, build, hay một phụ thuộc thường là lỗi. Đo bên ngoài trước; đọc bên trong chỉ một khi mã trạng thái đã gọi tên tầng.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Đăng nhập chết — bước đầu của bạn là gì?"</strong> — curl endpoint và đọc mã. 404 = build cũ, 500 = phụ thuộc, 403 = authz, 401 = ống nguyên vẹn, 200 = sau đăng nhập.</li>
<li><strong>"Bạn nhận một 403 trên đăng nhập. Nhìn đâu?"</strong> — Phân quyền (vai/tenant), không phải mật khẩu. 403 là "được biết nhưng bị cấm".</li>
<li><strong>"Một tuyến 404 nhưng nó có trong mã."</strong> — Gần như luôn một build cũ hay một phần; deploy một ảnh sạch. Chẩn đoán sức khoẻ tuyến bằng một curl không xác thực, không phải trình duyệt.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo12/diagnose.mjs</code>. Một tuyến đăng nhập trả 404 nhưng handler rõ ràng có trong nguồn. Nguyên nhân khả dĩ nhất, và cách sửa?</li>
<li>Bạn nhận một 403 trên luồng đăng nhập. Bạn KHÔNG nên phí thời gian vào cái gì?</li>
<li>Đăng nhập trả 200 nhưng người dùng nói họ "không đăng nhập". Vấn đề ở đâu?</li>
</ol>
<p><strong>Lời giải:</strong> (1) một build cũ hay một phần — ảnh đang chạy thiếu tuyến; deploy một build sạch, đừng sửa mã. (2) mật khẩu và việc băm — một 403 là phân quyền (người dùng được biết nhưng bị cấm), không phải xác thực. (3) sau đăng nhập: cookie phiên (cờ, SameSite), một redirect, hay client không gửi tín vật — chính đường ống đăng nhập thì ổn.</p>
<p><strong>Đạt khi:</strong> bạn gọi được tên tầng hỏng từ mã trạng thái trước khi đọc mã, và bạn đổi một thứ một lần.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">chẩn đoán mã-trạng-thái-trước</span><span class="v">Đọc mã HTTP để thu hẹp lỗi về một tầng trước khi đọc mã.</span></div>
  <div class="kv"><span class="k">stale build (404)</span><span class="v">Một ảnh đang chạy thiếu một tuyến có trong nguồn — deploy lại, đừng sửa.</span></div>
  <div class="kv"><span class="k">403 vs 401</span><span class="v">403 là phân quyền (được biết nhưng bị cấm); 401 là ống nguyên vẹn, thử một đăng nhập thật.</span></div>
  <div class="kv"><span class="k">startup banner</span><span class="v">Log cấu hình đã che (Chương 11) hiện bí mật nào nạp.</span></div>
  <div class="kv"><span class="k">một thay đổi một lần</span><span class="v">Đổi, đo, lặp — để luôn biết cái gì làm nên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo trước khi đoán: curl tuyến đăng nhập và đọc mã.</li>
<li>404 = build cũ; 500 = phụ thuộc sập; 403 = phân quyền; 401 = ống nguyên vẹn; 200 = nhìn qua đăng nhập.</li>
<li>Mã trạng thái gọi tên tầng hỏng trong vài giây, trước khi bạn đọc mã.</li>
<li>Đổi một thứ một lần; đọc banner khởi động cạnh mã trạng thái.</li>
<li>Mã thường đúng — môi trường, build hay một phụ thuộc là lỗi.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-0-2-ba-bai-toan', title: 'Quay lại 0.2 — ba cổng và 401/403/404', sub: 'Ở đó, khung đầu tiên của 401 (bạn là ai), 403 (bạn không được), 404 (giấu sự tồn tại). Ở đây, đúng ba mã đó là công cụ chẩn đoán nhanh nhất của bạn. Ý tưởng mở khoá đóng nó.', cta: 'MỞ BÀI 0.2 →' })}
</div>
`,
};
