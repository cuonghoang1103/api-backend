/**
 * Bài 7.1 — Xác thực và phân quyền (nâng cấp 02/11/2026). Output thật: _demo/_t7/chay.sh (app Node không thư viện _t7/app.mjs,
 * curl 8.7: HTTP quên bạn, Basic chỉ là base64, cùng một câu cho sai email/sai mật khẩu, 401 vs 403).
 * Deck: scripts/slides-src/wf-7-1.mjs (9 slide, WF/v1/wf-7-1). Code Lab: wf-7-1-auth-basics.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=\$ )/); return n.map((i) => p[i].trim()).join('\n\n'); };

const G = walkWf('wf-7-1', 'Authentication and authorization', 'Xác thực và phân quyền', [
  [1, 'Authentication and authorization',
    '<p>Almost every real app has accounts. Before writing any login code, you need two words straight. Authentication answers "who are you?". Authorization answers "what are you allowed to do?". Mixing them up is behind many real security bugs, and this chapter is built on keeping them apart.</p>',
    '<p>Gần như mọi ứng dụng thật đều có tài khoản. Trước khi viết dòng đăng nhập nào, bạn cần phân biệt rõ hai từ. Xác thực trả lời "bạn là ai?". Phân quyền trả lời "bạn được làm gì?". Lẫn hai thứ này là gốc của rất nhiều lỗi bảo mật thật, và cả chương này dựa trên việc giữ chúng tách biệt.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to tell authentication and authorization apart, explain why identity has to travel with every request, recognise the four common ways it travels, choose between 401 and 403, and avoid two classic mistakes: trusting a role sent by the client, and thinking a hidden button protects anything.</p>',
    '<p>Bạn sẽ phân biệt được xác thực và phân quyền, giải thích vì sao danh tính phải đi kèm mọi request, nhận ra bốn cách nó thường đi, chọn giữa 401 và 403, và tránh hai lỗi kinh điển: tin vai trò do client gửi lên, và nghĩ rằng giấu một nút là đã bảo vệ được gì đó.</p>'],
  [3, 'HTTP forgets you',
    '<p>We logged in with curl and got 200 plus a Set-Cookie header. The very next request asked for our profile and got 401. Nothing was broken: curl did not keep the cookie, and HTTP itself has no memory. Whatever proves who you are must be sent again with every request.</p>',
    '<p>Ta đăng nhập bằng curl và nhận 200 kèm header Set-Cookie. Request ngay sau xin hồ sơ của ta và nhận 401. Không có gì hỏng: curl không giữ cookie, và bản thân HTTP không có trí nhớ. Thứ chứng minh bạn là ai phải được gửi lại cùng mọi request.</p>'],
  [4, 'How identity travels',
    '<p>There are four common carriers: a session cookie that the browser attaches by itself, a bearer token in the Authorization header, HTTP Basic with the username and password in every request, and an API key for programs. All of them are only safe over HTTPS.</p>',
    '<p>Có bốn cách mang thường gặp: cookie phiên mà trình duyệt tự đính kèm, bearer token trong header Authorization, HTTP Basic với tên và mật khẩu trong mọi request, và API key cho chương trình. Tất cả chỉ an toàn khi đi qua HTTPS.</p>'],
  [5, 'Base64 is not encryption',
    '<p>curl turned our username and password into a Basic header. One command turned it straight back. Base64 only changes the alphabet; anyone who sees the request can read the password. That is why Basic, cookies and tokens all need HTTPS, the topic of Lesson 7.5.</p>',
    '<p>curl biến tên và mật khẩu thành một header Basic. Một lệnh biến nó ngược lại ngay. Base64 chỉ đổi bảng chữ; ai nhìn thấy request đều đọc được mật khẩu. Vì vậy Basic, cookie và token đều cần HTTPS, chủ đề của Bài 7.5.</p>'],
  [6, '401 then 403',
    '<p>The server asks two questions in order. First, who is this? No valid session means 401. Then, may this person do this? An is a normal user, so the admin list answers 403. Lan is an admin and gets the list. Same address, same code, different people.</p>',
    '<p>Máy chủ hỏi hai câu theo thứ tự. Trước: đây là ai? Không có phiên hợp lệ là 401. Sau: người này có được làm việc này không? An là người dùng thường, nên danh sách quản trị trả 403. Lan là admin và nhận danh sách. Cùng địa chỉ, cùng mã, khác người.</p>'],
  [7, 'Never trust the client',
    '<p>The role comes from the server\'s own records, looked up through the session, never from the request body, a hidden field or local storage. And hiding the admin button changes nothing: curl does not see buttons. Every rule must be checked on the server.</p>',
    '<p>Vai trò lấy từ hồ sơ của chính máy chủ, tra qua phiên, không bao giờ từ phần thân request, ô ẩn hay local storage. Và giấu nút admin chẳng thay đổi gì: curl không nhìn thấy nút. Mọi luật đều phải được kiểm ở máy chủ.</p>'],
  [8, 'One message for both failures',
    '<p>A wrong password and an unknown email return exactly the same 401 and the same sentence. If they differed, anyone could test which emails have accounts. The rest of the chapter builds on this app: sessions, tokens, password storage and HTTPS.</p>',
    '<p>Sai mật khẩu và email không tồn tại trả về đúng cùng một 401 và cùng một câu. Nếu khác nhau, ai cũng dò được email nào có tài khoản. Phần còn lại của chương dựng tiếp trên app này: phiên, token, lưu mật khẩu và HTTPS.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to log in as two different users with curl, compare what each may see, and try to become an admin by sending a role yourself. "Done when" checks 401, 403 and 200 in the right places and a role that the server ignores.</p>',
    '<p>Bài luyện yêu cầu bạn đăng nhập bằng hai người dùng khác nhau với curl, so thứ mỗi người được xem, và thử tự gửi vai trò để thành admin. "Xong khi" kiểm 401, 403 và 200 đúng chỗ và một vai trò bị máy chủ bỏ qua.</p>'],
]);

export default {
  title: '7.1 — Authentication vs authorization|||7.1 — Xác thực và phân quyền',
  slug: 'wf-7-1-auth-basics',
  type: 'VIDEO',
  isFreePreview: true,
  video: { url: 'https://youtu.be/2PPSXonhIck', durationSeconds: 0 },
  description: 'Xác thực (bạn là ai) và phân quyền (được làm gì) trên một app Node thật: HTTP quên bạn (đăng nhập 200 rồi /api/me 401), bốn cách danh tính đi kèm request, Basic chỉ là base64 (giải ngược một lệnh), 401 rồi 403 rồi 200 theo người, cùng một câu cho sai email/sai mật khẩu, không tin vai trò client gửi, giấu nút không phải phân quyền.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Two questions: who are you, and what may you do?</h2>
<p class="lead">After this lesson you can explain the difference between authentication and authorization, show with real requests why a server forgets you between requests, name the four common ways identity travels with a request, pick 401 or 403 correctly, and spot two mistakes that appear in real projects every year: trusting a role the client sends, and believing that hiding a button protects an action. Everything in Chapter 7 — sessions, tokens, password storage, HTTPS, CORS — is an answer to one of these two questions.</p>

<h3>Step 1 — two different questions</h3>
<table>
<thead><tr><th></th><th>Authentication (authn)</th><th>Authorization (authz)</th></tr></thead>
<tbody>
<tr><td>Question</td><td>Who are you?</td><td>What are you allowed to do?</td></tr>
<tr><td>Proved by</td><td>Something you know (password), have (phone, key), are (fingerprint)</td><td>Rules: roles, ownership, plan, time…</td></tr>
<tr><td>Happens</td><td>Once at login, then a session or token stands in for it</td><td>On <em>every</em> request, for <em>every</em> resource</td></tr>
<tr><td>Fails with</td><td><strong>401</strong> Unauthorized — "log in"</td><td><strong>403</strong> Forbidden — "not you"</td></tr>
<tr><td>Real-life</td><td>Showing your ID card at the building's entrance</td><td>Which floors your card opens</td></tr>
</tbody>
</table>
<p>Yes, the status code is named "Unauthorized" although it means "unauthenticated" — a historical naming accident. Programs only look at the number.</p>

<h3>Step 2 — HTTP forgets you</h3>
<p>This chapter uses a small app (about 80 lines, no libraries) running on the test machine at <code>http://localhost:3457</code>. Two users exist: An (a normal user) and Lan (an admin). We log in with curl, then ask for our profile:</p>
${ra(OUT['_t7/out/forgets'])}
<p>The login worked: <strong>200</strong> and a <code>Set-Cookie</code> header. The next request still got <strong>401</strong>, because curl did not store that cookie and did not send it back. As Lesson 6.1 showed, HTTP is stateless: the server answers each request on its own. Whatever proves who you are must ride along with <em>every</em> request.</p>

<h3>Step 3 — how identity travels with a request</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Session cookie</span><span class="lz-t">Cookie: sid=…</span><span class="lz-d">The server remembers the login and gives the browser a random id; the browser attaches it to every request automatically (Lesson 7.2). Typical for websites.</span></div>
<div class="lz-layer"><span class="lz-k">Bearer token</span><span class="lz-t">Authorization: Bearer eyJ…</span><span class="lz-d">A signed token the client stores and sends itself (Lesson 7.3). Typical for mobile apps and APIs.</span></div>
<div class="lz-layer"><span class="lz-k">HTTP Basic</span><span class="lz-t">Authorization: Basic …</span><span class="lz-d">Username and password in every request. Fine for quick internal tools behind HTTPS; never for user logins.</span></div>
<div class="lz-layer"><span class="lz-k">API key</span><span class="lz-t">X-API-Key: … or Bearer</span><span class="lz-d">A long secret for a <em>program</em>, not a person (GIPHY, payment APIs). Stays on the server, never in browser code.</span></div>
</div>
<p>Here is HTTP Basic, the simplest of the four:</p>
${ra(OUT['_t7/out/basic'])}
<div class="pitfall co-tieu-de"><p><strong>Trap — thinking Base64 hides anything.</strong> <code>YW5AZXhh…</code> looks scrambled, and one command turns it back into <code>an@example.com:secret123</code>. Base64 only changes the alphabet so that any bytes fit into a header; it has no key. The same goes for the payload of a JWT (Lesson 7.3). Over plain <code>http://</code>, anyone on the same Wi-Fi, the café router or a proxy can read these headers. Every credential needs HTTPS (Lesson 7.5).</p></div>

<h3>Step 4 — authentication first, then authorization</h3>
${ma('javascript', CODE['_t7/app.mjs'], [66, 75])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Find the user</span><span class="lz-d"><code>currentUser(req)</code> reads the session cookie and looks it up on the server.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nobody? → 401</span><span class="lz-d">Missing, unknown, logged-out or expired session. Logging in will help.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Not allowed? → 403</span><span class="lz-d">We know who it is; the rule says no. Logging in again will not help.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Do the work</span><span class="lz-d">Only now touch the data — and still filter by owner (Lesson 6.5, IDOR).</span></div>
</div>
<p>The same address with three different callers:</p>
${ra(doan('_t7/out/session', 3, 4))}
${ra(OUT['_t7/out/admin'])}
<p><code>cookies.txt</code> holds An's session; <code>admin-cookies.txt</code> holds Lan's, created by logging in as Lan. An is authenticated (200 on <code>/api/me</code>) but not authorized for the admin list (403). Lan gets the list.</p>

<h3>Step 5 — never trust what the client says about itself</h3>
<div class="pitfall co-tieu-de"><p><strong>Trap — reading the role from the request.</strong> Code like <code>if (req.body.role === 'admin')</code>, a hidden form field <code>&lt;input type="hidden" name="role" value="user"&gt;</code>, or a role kept in <code>localStorage</code> and sent with each call — all of these are typed by the user, and anyone can change them with DevTools or curl. Our app never reads a role from the request: it finds the user through the session (line 66) and reads <code>user.role</code> from its own records.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "the button is hidden, so users cannot do it".</strong> Hiding the "Admin" menu for normal users is good design, but it is not security: the request above was sent by curl, which has no buttons at all. Every rule the UI enforces must be checked again on the server for every request. A useful mental test: "if someone sends this request by hand, what happens?"</p></div>

<h3>Step 6 — one message for both failures</h3>
${ra(doan('_t7/out/session', 0, 1))}
<p>A wrong password for a real account and an email that does not exist get the same status and the same sentence (line 52 of the app). If the messages differed ("no such user" vs "wrong password"), anyone could check which emails are registered — useful for phishing and for guessing passwords. The same thinking applies to "forgot password" forms: always answer "if this email exists, we sent a link".</p>

<h3>Step 7 — what a real login adds on top</h3>
<table>
<thead><tr><th>Concern</th><th>What it prevents</th><th>Typical rule</th></tr></thead>
<tbody>
<tr><td>Rate limiting</td><td>Guessing passwords at machine speed</td><td>e.g. 5 failed logins per account per 15 minutes, then 429 (Lesson 6.3)</td></tr>
<tr><td>Session expiry</td><td>A stolen cookie working forever</td><td>Our app: <code>Max-Age=3600</code> and an <code>expires</code> check on the server (Lesson 7.2)</td></tr>
<tr><td>Multi-factor (MFA / 2FA)</td><td>A leaked password being enough</td><td>Password + a code from an app or a passkey: two different <em>kinds</em> of proof</td></tr>
<tr><td>Logging</td><td>Attacks going unnoticed</td><td>Record failed logins with time and IP — never the password typed</td></tr>
</tbody>
</table>
<p>You will build these in the Node.js and Authentication courses. For now, remember the order every protected request follows: <em>identify</em>, then <em>authorize</em>, then <em>act</em>.</p>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — two users, one app</strong></p>
<ol>
<li>Copy the app from Lesson 7.2 (its full listing is there) or run the version in the course folder: <code>node app.mjs</code>.</li>
<li>Log in as An with <code>curl -c an.txt -X POST localhost:3457/login -H 'Content-Type: application/json' -d '{"email":"an@example.com","password":"correct horse battery"}'</code>, and as Lan into <code>lan.txt</code> (password <code>staple 42 river</code>).</li>
<li>Call <code>/api/me</code> and <code>/api/admin/users</code> three ways: with <code>-b an.txt</code>, with <code>-b lan.txt</code>, and with no cookie. Write the 6 status codes in a table.</li>
<li>Try to become admin: log in as An sending <code>"role":"admin"</code> in the JSON body, then call the admin list.</li>
<li>Decode a Basic header of your own with <code>echo '…' | base64 --decode</code>.</li>
</ol>
<p>Hint: <code>-c file</code> saves cookies, <code>-b file</code> sends them.</p>
<p><strong>Done when:</strong> your table reads 200/403 for An, 200/200 for Lan and 401/401 without a cookie; the extra <code>role</code> in step 4 changes nothing (still 403); and you can say in one sentence why the role comes from the server's records. Then Code Lab module 7.1.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">authentication (authn)</span><span class="v">xác thực — bạn là ai.</span></div>
  <div class="kv"><span class="k">authorization (authz)</span><span class="v">phân quyền — bạn được làm gì.</span></div>
  <div class="kv"><span class="k">credential</span><span class="v">thông tin xác thực — mật khẩu, token, khoá.</span></div>
  <div class="kv"><span class="k">session</span><span class="v">phiên — máy chủ nhớ ai đã đăng nhập.</span></div>
  <div class="kv"><span class="k">bearer token</span><span class="v">token mang theo — ai cầm là người đó.</span></div>
  <div class="kv"><span class="k">HTTP Basic</span><span class="v">gửi tên:mật khẩu dạng base64 mỗi request.</span></div>
  <div class="kv"><span class="k">API key</span><span class="v">khoá API — bí mật cho chương trình.</span></div>
  <div class="kv"><span class="k">role</span><span class="v">vai trò — user, admin…</span></div>
  <div class="kv"><span class="k">user enumeration</span><span class="v">dò tài khoản — đoán email nào đã đăng ký.</span></div>
  <div class="kv"><span class="k">server-side check</span><span class="v">kiểm ở máy chủ — nơi duy nhất đáng tin.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Authentication = who you are (fails with 401); authorization = what you may do (fails with 403).</li>
  <li>HTTP forgets you: proof of identity must travel with every request.</li>
  <li>Four carriers: session cookie, bearer token, HTTP Basic, API key — all need HTTPS.</li>
  <li>Base64 is not encryption; anyone can decode a Basic header or a JWT payload.</li>
  <li>Check in order: find the user (401) → check the rule (403) → do the work.</li>
  <li>Never read roles or user ids from the request; hidden buttons are not security.</li>
  <li>Use the same message for "unknown email" and "wrong password".</li>
</ul>
${nguon('📗', 'MDN — HTTP authentication', 'The Authorization header, Basic and Bearer schemes', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication')}
${nguon('📘', 'OWASP — Authentication Cheat Sheet', 'Error messages, login flows and common mistakes', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html')}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'API Design 6.1 — Authentication for APIs', sub: 'Choosing between sessions, tokens and API keys when you design an API', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Hai câu hỏi: bạn là ai, và bạn được làm gì?</h2>
<p class="lead">Học xong bài này bạn giải thích được khác biệt giữa xác thực và phân quyền, cho thấy bằng request thật vì sao máy chủ quên bạn giữa các request, kể tên bốn cách danh tính thường đi kèm request, chọn đúng 401 hay 403, và nhận ra hai lỗi năm nào cũng xuất hiện trong dự án thật: tin vai trò do client gửi, và tin rằng giấu một nút là bảo vệ được hành động. Mọi thứ ở Chương 7 — phiên, token, lưu mật khẩu, HTTPS, CORS — đều là câu trả lời cho một trong hai câu hỏi này.</p>

<h3>Bước 1 — hai câu hỏi khác nhau</h3>
<table>
<thead><tr><th></th><th>Xác thực (authn)</th><th>Phân quyền (authz)</th></tr></thead>
<tbody>
<tr><td>Câu hỏi</td><td>Bạn là ai?</td><td>Bạn được làm gì?</td></tr>
<tr><td>Chứng minh bằng</td><td>Thứ bạn biết (mật khẩu), có (điện thoại, khoá), là (vân tay)</td><td>Luật: vai trò, quyền sở hữu, gói dịch vụ, thời gian…</td></tr>
<tr><td>Xảy ra</td><td>Một lần khi đăng nhập, rồi phiên hoặc token thay thế</td><td>Ở <em>mọi</em> request, với <em>mọi</em> tài nguyên</td></tr>
<tr><td>Hỏng thì</td><td><strong>401</strong> Unauthorized — "hãy đăng nhập"</td><td><strong>403</strong> Forbidden — "không phải bạn"</td></tr>
<tr><td>Đời thường</td><td>Trình thẻ ở cửa toà nhà</td><td>Thẻ mở được những tầng nào</td></tr>
</tbody>
</table>
<p>Đúng vậy, mã trạng thái tên "Unauthorized" nhưng nghĩa là "chưa xác thực" — một tai nạn đặt tên từ xưa. Chương trình chỉ nhìn con số.</p>

<h3>Bước 2 — HTTP quên bạn</h3>
<p>Chương này dùng một app nhỏ (khoảng 80 dòng, không thư viện) chạy trên máy thử tại <code>http://localhost:3457</code>. Có hai người dùng: An (người dùng thường) và Lan (admin). Ta đăng nhập bằng curl, rồi xin hồ sơ của mình:</p>
${ra(OUT['_t7/out/forgets'])}
<p>Đăng nhập thành công: <strong>200</strong> và một header <code>Set-Cookie</code>. Request kế tiếp vẫn nhận <strong>401</strong>, vì curl không lưu cookie đó và không gửi lại. Như Bài 6.1 đã cho thấy, HTTP phi trạng thái: máy chủ trả lời từng request riêng rẽ. Thứ chứng minh bạn là ai phải đi kèm <em>mọi</em> request.</p>

<h3>Bước 3 — danh tính đi kèm request thế nào</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Cookie phiên</span><span class="lz-t">Cookie: sid=…</span><span class="lz-d">Máy chủ nhớ lượt đăng nhập và đưa trình duyệt một id ngẫu nhiên; trình duyệt tự đính nó vào mọi request (Bài 7.2). Thường dùng cho website.</span></div>
<div class="lz-layer"><span class="lz-k">Bearer token</span><span class="lz-t">Authorization: Bearer eyJ…</span><span class="lz-d">Một token có chữ ký mà client tự lưu và tự gửi (Bài 7.3). Thường dùng cho app di động và API.</span></div>
<div class="lz-layer"><span class="lz-k">HTTP Basic</span><span class="lz-t">Authorization: Basic …</span><span class="lz-d">Tên và mật khẩu trong mọi request. Tạm được cho công cụ nội bộ sau HTTPS; không bao giờ cho đăng nhập người dùng.</span></div>
<div class="lz-layer"><span class="lz-k">API key</span><span class="lz-t">X-API-Key: … hoặc Bearer</span><span class="lz-d">Một bí mật dài cho <em>chương trình</em>, không cho người (GIPHY, API thanh toán). Ở lại máy chủ, không bao giờ nằm trong mã trình duyệt.</span></div>
</div>
<p>Đây là HTTP Basic, cách đơn giản nhất trong bốn:</p>
${ra(OUT['_t7/out/basic'])}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — nghĩ Base64 che giấu được gì.</strong> <code>YW5AZXhh…</code> trông như bị xáo trộn, và một lệnh biến nó lại thành <code>an@example.com:secret123</code>. Base64 chỉ đổi bảng chữ để byte nào cũng nhét vừa header; nó không có khoá. Phần payload của JWT cũng vậy (Bài 7.3). Qua <code>http://</code> trần, bất kỳ ai cùng Wi-Fi, router quán cà phê hay một proxy đều đọc được các header này. Mọi thông tin xác thực đều cần HTTPS (Bài 7.5).</p></div>

<h3>Bước 4 — xác thực trước, phân quyền sau</h3>
${ma('javascript', CODE['_t7/app.mjs'], [66, 75])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tìm người dùng</span><span class="lz-d"><code>currentUser(req)</code> đọc cookie phiên và tra nó trên máy chủ.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Không ai? → 401</span><span class="lz-d">Phiên vắng, lạ, đã đăng xuất hay hết hạn. Đăng nhập sẽ giúp.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Không được phép? → 403</span><span class="lz-d">Ta biết là ai; luật nói không. Đăng nhập lại cũng vô ích.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Làm việc</span><span class="lz-d">Chỉ lúc này mới đụng tới dữ liệu — và vẫn lọc theo chủ sở hữu (Bài 6.5, IDOR).</span></div>
</div>
<p>Cùng địa chỉ với ba người gọi khác nhau:</p>
${ra(doan('_t7/out/session', 3, 4))}
${ra(OUT['_t7/out/admin'])}
<p><code>cookies.txt</code> giữ phiên của An; <code>admin-cookies.txt</code> giữ phiên của Lan, tạo ra bằng cách đăng nhập là Lan. An đã xác thực (200 ở <code>/api/me</code>) nhưng không được phép xem danh sách quản trị (403). Lan nhận được danh sách.</p>

<h3>Bước 5 — đừng bao giờ tin điều client tự nói về mình</h3>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đọc vai trò từ request.</strong> Mã kiểu <code>if (req.body.role === 'admin')</code>, một ô ẩn <code>&lt;input type="hidden" name="role" value="user"&gt;</code>, hay vai trò giữ trong <code>localStorage</code> rồi gửi kèm mỗi lời gọi — tất cả đều do người dùng gõ, và ai cũng sửa được bằng DevTools hay curl. App của ta không bao giờ đọc vai trò từ request: nó tìm người dùng qua phiên (dòng 66) và đọc <code>user.role</code> từ hồ sơ của chính nó.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "nút đã ẩn, nên người dùng không làm được".</strong> Giấu menu "Admin" khỏi người dùng thường là thiết kế tốt, nhưng không phải bảo mật: request ở trên do curl gửi, mà curl chẳng có nút nào. Mọi luật mà giao diện áp dụng đều phải được máy chủ kiểm lại ở mọi request. Một phép thử hữu ích: "nếu ai đó gửi request này bằng tay, chuyện gì xảy ra?"</p></div>

<h3>Bước 6 — một câu cho cả hai kiểu thất bại</h3>
${ra(doan('_t7/out/session', 0, 1))}
<p>Sai mật khẩu của một tài khoản có thật và một email không tồn tại nhận cùng mã và cùng câu (dòng 52 của app). Nếu thông báo khác nhau ("không có người dùng này" và "sai mật khẩu"), ai cũng kiểm được email nào đã đăng ký — có ích cho lừa đảo và đoán mật khẩu. Cùng tư duy đó áp cho form "quên mật khẩu": luôn trả lời "nếu email này tồn tại, chúng tôi đã gửi một liên kết".</p>

<h3>Bước 7 — đăng nhập thật còn thêm gì</h3>
<table>
<thead><tr><th>Mối lo</th><th>Ngăn được gì</th><th>Luật thường gặp</th></tr></thead>
<tbody>
<tr><td>Giới hạn tần suất</td><td>Đoán mật khẩu với tốc độ máy</td><td>vd 5 lần đăng nhập sai mỗi tài khoản mỗi 15 phút, sau đó 429 (Bài 6.3)</td></tr>
<tr><td>Phiên hết hạn</td><td>Cookie bị trộm dùng được mãi</td><td>App của ta: <code>Max-Age=3600</code> và kiểm <code>expires</code> trên máy chủ (Bài 7.2)</td></tr>
<tr><td>Đa yếu tố (MFA / 2FA)</td><td>Lộ mật khẩu là đủ để vào</td><td>Mật khẩu + mã từ ứng dụng hoặc passkey: hai <em>loại</em> bằng chứng khác nhau</td></tr>
<tr><td>Ghi log</td><td>Bị tấn công mà không ai biết</td><td>Ghi các lần đăng nhập sai kèm thời gian và IP — không bao giờ ghi mật khẩu đã gõ</td></tr>
</tbody>
</table>
<p>Bạn sẽ dựng những thứ này ở khoá Node.js và khoá Authentication. Giờ hãy nhớ thứ tự mà mọi request được bảo vệ đi qua: <em>nhận diện</em>, rồi <em>phân quyền</em>, rồi mới <em>hành động</em>.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — hai người dùng, một app</strong></p>
<ol>
<li>Chép app ở Bài 7.2 (bài đó có toàn bộ mã) hoặc chạy bản trong thư mục khoá: <code>node app.mjs</code>.</li>
<li>Đăng nhập là An bằng <code>curl -c an.txt -X POST localhost:3457/login -H 'Content-Type: application/json' -d '{"email":"an@example.com","password":"correct horse battery"}'</code>, và là Lan vào <code>lan.txt</code> (mật khẩu <code>staple 42 river</code>).</li>
<li>Gọi <code>/api/me</code> và <code>/api/admin/users</code> theo ba cách: với <code>-b an.txt</code>, với <code>-b lan.txt</code>, và không có cookie. Ghi 6 mã trạng thái vào một bảng.</li>
<li>Thử thành admin: đăng nhập là An, gửi thêm <code>"role":"admin"</code> trong phần thân JSON, rồi gọi danh sách quản trị.</li>
<li>Tự giải mã một header Basic của bạn bằng <code>echo '…' | base64 --decode</code>.</li>
</ol>
<p>Gợi ý: <code>-c tệp</code> lưu cookie, <code>-b tệp</code> gửi chúng.</p>
<p><strong>Xong khi:</strong> bảng của bạn ghi 200/403 cho An, 200/200 cho Lan và 401/401 khi không có cookie; <code>role</code> gửi thêm ở bước 4 không đổi gì (vẫn 403); và bạn nói được trong một câu vì sao vai trò lấy từ hồ sơ của máy chủ. Sau đó làm module Code Lab 7.1.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">authentication (authn)</span><span class="v">xác thực — bạn là ai.</span></div>
  <div class="kv"><span class="k">authorization (authz)</span><span class="v">phân quyền — bạn được làm gì.</span></div>
  <div class="kv"><span class="k">credential</span><span class="v">thông tin xác thực — mật khẩu, token, khoá.</span></div>
  <div class="kv"><span class="k">session</span><span class="v">phiên — máy chủ nhớ ai đã đăng nhập.</span></div>
  <div class="kv"><span class="k">bearer token</span><span class="v">token mang theo — ai cầm là người đó.</span></div>
  <div class="kv"><span class="k">HTTP Basic</span><span class="v">gửi tên:mật khẩu dạng base64 mỗi request.</span></div>
  <div class="kv"><span class="k">API key</span><span class="v">khoá API — bí mật cho chương trình.</span></div>
  <div class="kv"><span class="k">role</span><span class="v">vai trò — user, admin…</span></div>
  <div class="kv"><span class="k">user enumeration</span><span class="v">dò tài khoản — đoán email nào đã đăng ký.</span></div>
  <div class="kv"><span class="k">server-side check</span><span class="v">kiểm ở máy chủ — nơi duy nhất đáng tin.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Xác thực = bạn là ai (hỏng thì 401); phân quyền = bạn được làm gì (hỏng thì 403).</li>
  <li>HTTP quên bạn: bằng chứng danh tính phải đi kèm mọi request.</li>
  <li>Bốn cách mang: cookie phiên, bearer token, HTTP Basic, API key — đều cần HTTPS.</li>
  <li>Base64 không phải mã hoá; ai cũng giải được header Basic hay payload JWT.</li>
  <li>Kiểm theo thứ tự: tìm người dùng (401) → kiểm luật (403) → làm việc.</li>
  <li>Đừng bao giờ đọc vai trò hay user id từ request; nút ẩn không phải bảo mật.</li>
  <li>Dùng cùng một câu cho "email không tồn tại" và "sai mật khẩu".</li>
</ul>
${nguon('📗', 'MDN — HTTP authentication', 'Header Authorization, cơ chế Basic và Bearer', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication')}
${nguon('📘', 'OWASP — Authentication Cheat Sheet', 'Thông báo lỗi, luồng đăng nhập và các lỗi hay gặp', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html')}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Thiết kế API 6.1 — Xác thực cho API', sub: 'Chọn giữa phiên, token và API key khi thiết kế một API', cta: 'Mở bài' })}
</div>
`,
};
