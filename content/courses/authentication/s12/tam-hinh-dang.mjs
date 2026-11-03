/**
 * Authentication · Chương 12 · 12.2 — Tám hình dạng hỏng, và ý nghĩa của từng cái. Slug giữ: auth-12-2-tam-hinh-dang.
 * Output THẬT từ _ma.mjs: demo12/shapes.mjs (tám dáng × nguyên nhân).
 */
import G from '../giang/auth-12-2.mjs';
import { ra, lienKet, nguon } from '../_slides.mjs';
import { OUT } from './_ma.mjs';

const BANG_EN = `<table>
<thead><tr><th>Shape (who + when)</th><th>Likely cause (chapter)</th></tr></thead>
<tbody>
<tr><td>Everyone logged out at once</td><td>a bad key/secret rotation with no overlap (11.2)</td></tr>
<tr><td>Only NEW logins fail, old sessions work</td><td>the active signing key is broken/missing</td></tr>
<tr><td>Works, then 401 after ~15 minutes</td><td>access token expired + broken refresh (5)</td></tr>
<tr><td>Works in Postman, fails in the browser</td><td>a cookie problem — SameSite, Secure, CORS (3)</td></tr>
<tr><td>One specific user cannot log in</td><td>that account — rehash, unverified, wrong password (2/6)</td></tr>
<tr><td>Intermittent 401 on the same token</td><td>instances disagree — unshared keys/store (11)</td></tr>
<tr><td>Login ok, every API call 401</td><td>token not forwarded or wrong audience (8)</td></tr>
<tr><td>5xx on login under load</td><td>a dependency down/saturated — DB, Redis, a secret (11)</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Dáng (ai + khi nào)</th><th>Nguyên nhân khả dĩ (chương)</th></tr></thead>
<tbody>
<tr><td>Tất cả đăng xuất cùng lúc</td><td>một lần xoay khoá/secret tồi không chồng lấn (11.2)</td></tr>
<tr><td>Chỉ đăng nhập MỚI hỏng, phiên cũ chạy</td><td>khoá ký đang hoạt động hỏng/thiếu</td></tr>
<tr><td>Chạy, rồi 401 sau ~15 phút</td><td>access token hết hạn + refresh hỏng (5)</td></tr>
<tr><td>Chạy trong Postman, hỏng ở trình duyệt</td><td>một vấn đề cookie — SameSite, Secure, CORS (3)</td></tr>
<tr><td>Một người dùng cụ thể không đăng nhập được</td><td>tài khoản đó — rehash, chưa xác minh, sai mật khẩu (2/6)</td></tr>
<tr><td>401 chập chờn trên cùng một token</td><td>các instance bất đồng — khoá/kho không chung (11)</td></tr>
<tr><td>Đăng nhập ok, mọi gọi API 401</td><td>token không được chuyển hay sai audience (8)</td></tr>
<tr><td>5xx trên đăng nhập dưới tải</td><td>một phụ thuộc sập/bão hoà — DB, Redis, một bí mật (11)</td></tr>
</tbody>
</table>`;

const NGUON_EN = [
  nguon('🔐', 'OWASP — Authentication Cheat Sheet', 'Correct auth and session behaviour, to recognise the failure deviations (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('🍪', 'OWASP — Session Management Cheat Sheet', 'Cookie/session behaviour behind the "Postman works, browser fails" shape (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🔐', 'OWASP — Authentication Cheat Sheet', 'Hành vi xác thực và phiên đúng, để nhận ra các sai lệch hỏng (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('🍪', 'OWASP — Session Management Cheat Sheet', 'Hành vi cookie/phiên sau dáng "Postman chạy, trình duyệt hỏng" (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');

export default {
  title: '12.2 — Eight shapes of failure, and what each one means|||12.2 — Tám hình dạng hỏng, và ý nghĩa của từng cái',
  slug: 'auth-12-2-tam-hinh-dang',
  type: 'LESSON',
  isFreePreview: false,
  description: 'DÁNG của ai bị ảnh hưởng và KHI NÀO chỉ ra nguyên nhân nhanh hơn bất kỳ thông điệp lỗi nào. Tám dáng lặp lại, mỗi cái gọi tên chương để mở: (1) tất cả đăng xuất cùng lúc ⇒ xoay khoá/secret tồi không chồng lấn (11.2); (2) chỉ đăng nhập MỚI hỏng ⇒ khoá ký hoạt động hỏng/thiếu; (3) chạy rồi 401 sau 15 phút ⇒ access hết hạn + refresh hỏng (Ch5); (4) Postman chạy trình duyệt hỏng ⇒ cookie SameSite/Secure/CORS (Ch3); (5) một người cụ thể ⇒ tài khoản đó: rehash/chưa-xác-minh/sai-mật-khẩu (Ch2/6); (6) 401 chập chờn cùng token ⇒ instance bất đồng, khoá/kho không chung (Ch11); (7) đăng nhập ok mọi API 401 ⇒ token không chuyển/sai audience (Ch8); (8) 5xx dưới tải ⇒ phụ thuộc sập/bão hoà (Ch11). Đọc DÁNG trước: ai (tất cả/mới/một người) và khi nào (ngay/15 phút/chỉ trình duyệt/dưới tải). Dáng chính là chẩn đoán. Theo OWASP Authentication + Session Management.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Eight shapes of failure, and what each one means</h2>
<p class="lead">Once the status has named a layer (12.1), the next signal is the <em>shape</em> of the failure: the pattern of who is affected and when. That pattern points at the cause faster than any single error message, and eight shapes recur so often in auth systems that each one names the chapter to open before you read a stack trace.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> recognise eight recurring failure shapes; map each to its likely cause and chapter; and read "who and when" to pick the right place to look first.</p>
</div>

<h3>The eight shapes</h3>
<p>The demo prints them; here they are as a table you can keep:</p>
${BANG_EN}
${ra(OUT['122-shapes'])}

<h3>Read "who" and "when"</h3>
<p>Two questions pick the shape. <strong>Who:</strong> everyone (a system-wide change — a rotation, a config), only new logins (the signing path), or one user (that account). <strong>When:</strong> immediately, after exactly 15 minutes (the access-token clock — a refresh bug), only in the browser (a cookie rule), or only under load (a dependency). The intersection of who and when is almost always a single shape, and the shape is the diagnosis.</p>

<h3>The two that fool people</h3>
<p><strong>"Works, then 401 after 15 minutes"</strong> looks like a flaky login, but the exact 15-minute clock is the access-token lifetime (Chapter 5) — the refresh is broken, not the login. <strong>"Login ok but every API call 401"</strong> looks like a login bug, but the login succeeded — the token is not forwarded, or its audience is wrong for the API (Chapter 8). Both are solved by looking <em>past</em> the login, which the shape tells you to do.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — chasing the error message instead of the pattern.</strong> A single "401 Unauthorized" in a log is almost contentless — it is the same message whether the token expired, the key rotated, the audience is wrong, or the instances disagree. The <em>pattern</em> (who, when) disambiguates it. Collect a few data points to see the shape before you dive into one stack trace.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Everyone got logged out at once — cause?"</strong> — A key or session-secret rotation with no overlap (11.2). No token verifies any more.</li>
<li><strong>"It works in Postman but not the browser."</strong> — A cookie rule the browser enforces: SameSite, Secure on http, or CORS without credentials (Chapter 3).</li>
<li><strong>"Intermittent 401 on a token that should be valid."</strong> — The instances disagree: different signing keys per node, or an unshared store (Chapter 11).</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo12/shapes.mjs</code>. A user logs in fine, then every request 401s exactly a quarter-hour later. Which shape, and which chapter?</li>
<li>Only brand-new logins fail; existing sessions keep working. What does that asymmetry point at?</li>
<li>Logins 5xx only during peak traffic. Is this an auth bug?</li>
</ol>
<p><strong>Solution:</strong> (1) "works, then 401 after 15 minutes" — the access token expired and refresh is broken (Chapter 5); the 15-minute clock is the tell. (2) the active signing path, not verification — a misconfigured or missing active signing key breaks new tokens while old ones still verify. (3) no — a dependency (database, Redis, a saturated connection pool) is down or overloaded under load (Chapter 11), not the login code.</p>
<p><strong>Done when:</strong> you can name the shape from "who and when" and open the right chapter before reading a trace.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">failure shape</span><span class="v">The pattern of who is affected and when — the fastest pointer to a cause.</span></div>
  <div class="kv"><span class="k">the 15-minute shape</span><span class="v">Works then 401s — an expired access token plus broken refresh (5).</span></div>
  <div class="kv"><span class="k">the browser-only shape</span><span class="v">Postman works, the browser fails — a cookie/CORS rule (3).</span></div>
  <div class="kv"><span class="k">instance disagreement</span><span class="v">Intermittent 401 — nodes with different keys or an unshared store (11).</span></div>
  <div class="kv"><span class="k">the under-load shape</span><span class="v">5xx only at peak — a saturated or down dependency (11).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Read the shape first: who is affected (everyone / new logins / one user) and when.</li>
<li>Each shape names a chapter: rotation, signing key, refresh, cookies, the account, instances, audience, a dependency.</li>
<li>The exact-15-minute and "login ok, API 401" shapes both mean "look past the login".</li>
<li>A single "401" is contentless; the pattern disambiguates it.</li>
<li>The shape is the diagnosis — collect a few data points before diving in.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-5-1-hai-token', title: 'Back to 5.1 — the 15-minute access token', sub: 'There, why the access token is short and the refresh rotates. Here, that 15-minute lifetime is the signature of the most common diagnosis: works then 401. The design decision becomes the debugging clue.', cta: 'OPEN LESSON 5.1 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Tám hình dạng hỏng, và ý nghĩa của từng cái</h2>
<p class="lead">Một khi mã trạng thái đã gọi tên một tầng (12.1), tín hiệu tiếp theo là <em>dáng</em> của sự hỏng: dáng của ai bị ảnh hưởng và khi nào. Dáng đó chỉ ra nguyên nhân nhanh hơn bất kỳ thông điệp lỗi đơn lẻ nào, và tám dáng lặp lại thường tới mức mỗi cái gọi tên chương để mở trước khi bạn đọc một stack trace.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> nhận ra tám dáng hỏng lặp lại; ánh xạ mỗi cái tới nguyên nhân khả dĩ và chương của nó; và đọc "ai và khi nào" để chọn đúng chỗ nhìn trước.</p>
</div>

<h3>Tám dáng</h3>
<p>Demo in chúng ra; đây là chúng dạng một bảng bạn giữ được:</p>
${BANG_VI}
${ra(OUT['122-shapes'])}

<h3>Đọc "ai" và "khi nào"</h3>
<p>Hai câu hỏi chọn dáng. <strong>Ai:</strong> tất cả (một thay đổi toàn hệ — một lần xoay, một cấu hình), chỉ đăng nhập mới (đường ký), hay một người (tài khoản đó). <strong>Khi nào:</strong> ngay lập tức, sau đúng 15 phút (đồng hồ access token — một lỗi refresh), chỉ trong trình duyệt (một luật cookie), hay chỉ dưới tải (một phụ thuộc). Giao của ai và khi nào gần như luôn là một dáng duy nhất, và dáng chính là chẩn đoán.</p>

<h3>Hai cái đánh lừa người ta</h3>
<p><strong>"Chạy, rồi 401 sau 15 phút"</strong> trông như một đăng nhập chập chờn, nhưng cái đồng hồ 15 phút chính xác là vòng đời access token (Chương 5) — refresh hỏng, không phải đăng nhập. <strong>"Đăng nhập ok nhưng mọi gọi API 401"</strong> trông như một lỗi đăng nhập, nhưng đăng nhập đã thành công — token không được chuyển, hay audience của nó sai cho API (Chương 8). Cả hai được giải bằng cách nhìn <em>qua</em> đăng nhập, điều dáng bảo bạn làm.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — đuổi theo thông điệp lỗi thay vì dáng.</strong> Một "401 Unauthorized" đơn lẻ trong một log gần như vô nội dung — nó là cùng thông điệp dù token hết hạn, khoá xoay, audience sai, hay các instance bất đồng. <em>Dáng</em> (ai, khi nào) phân biệt nó. Thu vài điểm dữ liệu để thấy dáng trước khi lao vào một stack trace.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Tất cả bị đăng xuất cùng lúc — nguyên nhân?"</strong> — Một lần xoay khoá hay session-secret không chồng lấn (11.2). Không token nào xác minh được nữa.</li>
<li><strong>"Nó chạy trong Postman nhưng không trình duyệt."</strong> — Một luật cookie trình duyệt thực thi: SameSite, Secure trên http, hay CORS không tín vật (Chương 3).</li>
<li><strong>"401 chập chờn trên một token đáng ra hợp lệ."</strong> — Các instance bất đồng: khoá ký khác nhau mỗi node, hay một kho không chung (Chương 11).</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo12/shapes.mjs</code>. Một người dùng đăng nhập ổn, rồi mọi request 401 đúng mười lăm phút sau. Dáng nào, và chương nào?</li>
<li>Chỉ đăng nhập hoàn toàn mới hỏng; phiên sẵn có vẫn chạy. Sự bất đối xứng đó chỉ vào cái gì?</li>
<li>Đăng nhập 5xx chỉ trong lưu lượng đỉnh. Đây có phải một lỗi xác thực?</li>
</ol>
<p><strong>Lời giải:</strong> (1) "chạy, rồi 401 sau 15 phút" — access token hết hạn và refresh hỏng (Chương 5); cái đồng hồ 15 phút là dấu hiệu. (2) đường ký đang hoạt động, không phải xác minh — một khoá ký hoạt động cấu hình sai hoặc thiếu làm hỏng token mới trong khi cái cũ vẫn xác minh. (3) không — một phụ thuộc (cơ sở dữ liệu, Redis, một pool kết nối bão hoà) sập hay quá tải dưới tải (Chương 11), không phải mã đăng nhập.</p>
<p><strong>Đạt khi:</strong> bạn gọi được tên dáng từ "ai và khi nào" và mở đúng chương trước khi đọc một trace.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">failure shape (dáng hỏng)</span><span class="v">Dáng của ai bị ảnh hưởng và khi nào — con trỏ nhanh nhất tới một nguyên nhân.</span></div>
  <div class="kv"><span class="k">dáng 15 phút</span><span class="v">Chạy rồi 401 — một access token hết hạn cộng refresh hỏng (5).</span></div>
  <div class="kv"><span class="k">dáng chỉ-trình-duyệt</span><span class="v">Postman chạy, trình duyệt hỏng — một luật cookie/CORS (3).</span></div>
  <div class="kv"><span class="k">instance bất đồng</span><span class="v">401 chập chờn — node với khoá khác nhau hay một kho không chung (11).</span></div>
  <div class="kv"><span class="k">dáng dưới-tải</span><span class="v">5xx chỉ lúc đỉnh — một phụ thuộc bão hoà hay sập (11).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc dáng trước: ai bị ảnh hưởng (tất cả / đăng nhập mới / một người) và khi nào.</li>
<li>Mỗi dáng gọi tên một chương: xoay, khoá ký, refresh, cookie, tài khoản, instance, audience, một phụ thuộc.</li>
<li>Dáng đúng-15-phút và "đăng nhập ok, API 401" đều nghĩa là "nhìn qua đăng nhập".</li>
<li>Một "401" đơn lẻ vô nội dung; dáng phân biệt nó.</li>
<li>Dáng chính là chẩn đoán — thu vài điểm dữ liệu trước khi lao vào.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-5-1-hai-token', title: 'Quay lại 5.1 — access token 15 phút', sub: 'Ở đó, vì sao access token ngắn và refresh xoay. Ở đây, cái vòng đời 15 phút đó là chữ ký của chẩn đoán phổ biến nhất: chạy rồi 401. Quyết định thiết kế thành manh mối debug.', cta: 'MỞ BÀI 5.1 →' })}
</div>
`,
};
