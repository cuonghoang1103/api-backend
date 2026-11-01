/**
 * Authentication · Chương 3 · 3.4 — CSRF, và ba lớp phòng xếp theo thứ tự. Slug giữ: auth-3-4-csrf.
 * Đo trong Chromium 156 (Playwright 1.64.1): trang 127.0.0.1:4801 tấn công localhost:4802 với 5 cấu hình — None/không phòng ⇒ form + fetch
 * CHANGED; không khai SameSite ⇒ form CHANGED, fetch 401; Lax ⇒ 401/401; None + Fetch Metadata ⇒ 403/403; None + token ⇒ 403/403; form
 * của An 200 ở mọi hàng. v0.3: cross-site/same-site/Origin lạ ⇒ 403, same-origin và không header ⇒ 200. Sự cố: ING Direct (Zeller & Felten 2008).
 */
import G from '../giang/auth-03-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const L = CODE.layer.split('\n');
const CSRF = L.slice(L.findIndex((l) => l.includes('/** CSRF layer 2')), L.findIndex((l) => l.includes('return { start'))).join('\n').trim();
const T = CODE.csrfTarget.split('\n');
const TOKEN = [T.find((l) => l.includes('const KEY')), T.find((l) => l.includes('const csrfToken')), '  …',
  T.find((l) => l.includes("defence === 'fetch-metadata'")), T.find((l) => l.includes("defence === 'token'"))].join('\n');

const NGUON_EN = [
  nguon('🦉', 'OWASP — Cross-Site Request Forgery Prevention Cheat Sheet', 'Fetch Metadata “a lightweight and reliable method”, with a mandatory Origin fallback; synchronizer tokens; SameSite is defence in depth; “XSS can defeat all CSRF mitigation techniques” (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html'),
  nguon('📄', 'Zeller &amp; Felten — Cross-Site Request Forgeries: Exploitation and Prevention (Princeton, rev. 15/10/2008)', 'CSRF in ING Direct (open an account, transfer funds), YouTube, MetaFilter and the New York Times (read 01/11/2026).', 'https://www.cs.virginia.edu/~cr4bd/4630/S2017/csrf.pdf'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Cross-Site Request Forgery Prevention Cheat Sheet', 'Fetch Metadata là "cách nhẹ và đáng tin", bắt buộc có Origin dự phòng; token đồng bộ; SameSite là lớp phòng thêm; "XSS đánh bại mọi kỹ thuật chống CSRF" (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html'),
  nguon('📄', 'Zeller &amp; Felten — Cross-Site Request Forgeries: Exploitation and Prevention (Princeton, bản 15/10/2008)', 'CSRF ở ING Direct (mở tài khoản, chuyển tiền), YouTube, MetaFilter và New York Times (đọc 01/11/2026).', 'https://www.cs.virginia.edu/~cr4bd/4630/S2017/csrf.pdf'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Defence</th><th>What it costs</th><th>Gaps (measured or documented)</th><th>LabFlow ID v0.3</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>SameSite=Lax</code> (or Strict) on the session cookie</td><td>one attribute</td><td>same-site subdomains; old browsers; a cookie <em>without</em> the attribute rides on POSTs for 2 minutes</td><td>yes</td></tr>
<tr><td>2</td><td>Fetch Metadata (<code>Sec-Fetch-Site</code>) + Origin fallback</td><td>~10 lines, no state</td><td>none in current browsers; keep the Origin fallback for the rest</td><td>yes, on every unsafe method</td></tr>
<tr><td>3</td><td>Synchronizer token (HMAC of the session id) in each form</td><td>render it in every form, check it on every POST</td><td>forgotten forms; read by any XSS</td><td>when a form must also work without Fetch Metadata</td></tr>
<tr><td>—</td><td>CORS</td><td>—</td><td>controls <em>reading</em> responses; the write still happens (measured)</td><td>not a CSRF defence</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Lớp phòng</th><th>Cái giá</th><th>Chỗ hở (đã đo hoặc có tài liệu)</th><th>LabFlow ID v0.3</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>SameSite=Lax</code> (hoặc Strict) trên cookie phiên</td><td>một thuộc tính</td><td>subdomain cùng site; trình duyệt cũ; cookie <em>không</em> khai thuộc tính vẫn theo POST trong 2 phút</td><td>có</td></tr>
<tr><td>2</td><td>Fetch Metadata (<code>Sec-Fetch-Site</code>) + dự phòng Origin</td><td>~10 dòng, không trạng thái</td><td>không có với trình duyệt hiện hành; giữ Origin cho phần còn lại</td><td>có, ở mọi method không an toàn</td></tr>
<tr><td>3</td><td>Token đồng bộ (HMAC của session id) trong mỗi form</td><td>render vào mọi form, kiểm ở mọi POST</td><td>form bị quên; XSS nào cũng đọc được</td><td>khi một form phải chạy cả ở nơi không có Fetch Metadata</td></tr>
<tr><td>—</td><td>CORS</td><td>—</td><td>kiểm soát việc <em>đọc</em> phản hồi; việc ghi vẫn xảy ra (đã đo)</td><td>không phải lớp phòng CSRF</td></tr>
</tbody>
</table>`;

export default {
  title: '3.4 — CSRF, and the three defences ranked|||3.4 — CSRF, và ba lớp phòng xếp theo thứ tự',
  slug: 'auth-3-4-csrf',
  type: 'LESSON',
  isFreePreview: true,
  description: 'CSRF tồn tại vì trình duyệt TỰ ĐỘNG đính cookie, và kẻ tấn công không cần ĐỌC phản hồi — chỉ cần GÂY RA request. Chạy thật trong Chromium 156: trang ở site khác đổi email của An với 5 cấu hình (None ⇒ đổi được bằng cả form lẫn fetch; không khai SameSite ⇒ form đổi được; Lax ⇒ 401; Fetch Metadata ⇒ 403; token ⇒ 403), form của An luôn 200. CORS không phải lớp phòng CSRF (fetch no-cors vẫn ghi). Ba lớp xếp hạng, v0.3 chạy lớp 1 + 2; sự cố ING Direct 2008.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>CSRF, and the three defences ranked</h2>
<p class="lead">The session cookie of lesson 3.2 is sent by the browser <em>by itself</em> — that is what makes it convenient. It is also what makes <strong>cross-site request forgery</strong> (CSRF) possible: a page on another site causes a request to LabFlow ID, and the browser attaches An's cookie. The attacker never reads the answer; he only needs the request to happen. This lesson attacks five configurations from another site in real Chromium, shows why CORS does not help, and ranks the three defences that do.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>explain CSRF in terms of what the browser sends automatically, and what the attacker can and cannot see;</li>
<li>predict which SameSite setting stops which forged request — with measurements;</li>
<li>explain why CORS is not a CSRF defence;</li>
<li>implement Fetch Metadata + Origin checks and a synchronizer token, and choose between them;</li>
<li>say why an XSS beats every CSRF defence.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> CSRF is on every web security checklist and in every backend interview, and most answers stop at “add a CSRF token”. You will be able to say which defence, why, and what each one misses — with numbers from a real browser.</p>
</div>

<h3>An everyday picture first</h3>
<p>Imagine your signature stamp travelled automatically with every letter that left your house. Then anyone could mail your bank a transfer form “signed” by you: the bank checks the stamp, not who wrote the letter. The browser does exactly this with cookies — it attaches LabFlow ID's session cookie to any request to LabFlow ID, whoever caused it: a link, a form, an image, a script on a page you happened to open.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">An is signed in</span><span class="lz-d">Her browser holds <code>__Host-lfid_ses</code> for LabFlow ID.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">She opens another page</span><span class="lz-d">A forum post, an ad, a link in a chat — on another site the attacker controls.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">That page sends a request</span><span class="lz-d">An auto-submitting form, or a background <code>fetch</code>, to <code>POST /me/email</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cookie or no cookie?</span><span class="lz-d">If the browser attaches it and the server does not check where the request came from, the email changes — then “forgot password” hands over the account.</span></div>
</div>

<h3>Five configurations, one attacker page — measured</h3>
<p><code>demo3/csrf-target.mjs</code> is a tiny “change my email” service on <code>localhost:4802</code> whose cookie SameSite value and defence can be switched. <code>demo3/csrf-matrix.mjs</code> signs An in, then opens two attacker pages on <code>127.0.0.1:4801</code> (another site): an auto-submitting form and a <code>fetch(…, { mode: 'no-cors', credentials: 'include' })</code>. After each attempt it checks whether the email changed, and finally submits An's own settings form:</p>
${ra(OUT['34-csrf'])}
<ul>
<li><strong>SameSite=None, no defence:</strong> both attacks <strong>CHANGED</strong> the email. This is the classic CSRF hole.</li>
<li><strong>SameSite not set:</strong> the form attack still <strong>CHANGED</strong> it (a top-level POST within the 2-minute window of lesson 3.2); the fetch did not carry the cookie (401).</li>
<li><strong>SameSite=Lax:</strong> no cookie on either cross-site POST ⇒ 401. Layer 1 works — in this browser, for this cross-site case.</li>
<li><strong>Fetch Metadata</strong> and <strong>token</strong>, even with SameSite=None: 403 for both attacks.</li>
<li>An's own form: <strong>200 in every row</strong>. A defence that blocks the real user is an outage, not a defence.</li>
</ul>

<h3>CORS is not a CSRF defence</h3>
<p>Row 1's fetch shows it: the attacker's page got an <em>opaque</em> response — CORS (cross-origin resource sharing) prevented it from <em>reading</em> anything — but the request was sent, with the cookie, and the server changed the email. CORS controls who may read responses. Form-encoded, multipart and text/plain POSTs are “simple requests” and are sent without a preflight; only non-simple requests (a JSON content type, custom headers) ask the server first. A JSON-only endpoint therefore resists the form trick by accident, not by design — do not rely on it.</p>

<h3>Layer 2: Fetch Metadata, with an Origin fallback</h3>
<p>Modern browsers add <code>Sec-Fetch-Site</code> to every request: <code>same-origin</code>, <code>same-site</code>, <code>cross-site</code> or <code>none</code> (typed in the address bar). The server simply refuses unsafe methods that did not come from its own origin. LabFlow ID v0.3:</p>
${ma('javascript', CSRF)}
${ra(OUT['34-v03'])}
<p>Same cookie, same body — only the browser metadata changes. <code>same-site</code> is refused too: <code>blog.labflow.example</code> is the same <em>site</em> as LabFlow ID, so SameSite cookies do not separate them, but this check does. Old browsers without Fetch Metadata still send <code>Origin</code> on a cross-site POST, so it is checked when present (OWASP calls this fallback mandatory). A request with neither header comes from curl or a mobile app, which cannot ride on a victim's browser cookie — it is allowed.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — checking only the Referer, or trusting <code>Origin: null</code>.</strong> Referer is often stripped (lesson 1.1 measured <code>strict-origin-when-cross-origin</code>), and sandboxed iframes send <code>Origin: null</code>. Missing or <code>null</code> is not evidence of a same-origin request. Use <code>Sec-Fetch-Site</code> first, Origin as the fallback, and never “allow if the header is missing” for browser traffic you know sends it.</p>
</div>

<h3>Layer 3: a synchronizer token</h3>
<p>When a form must also work in browsers without Fetch Metadata, add a token the attacker cannot know: an HMAC of the session id with a server key, rendered as a hidden field in your own page and compared in constant time (lesson 1.3). The attacker's page cannot read your page (same-origin policy), so it cannot copy the token:</p>
${ma('javascript', TOKEN)}
<p>Row 5 of the matrix: SameSite=None, yet both attacks got 403 and An's own form — which carries the token — got 200.</p>

<h3>Ranked: which defence, when</h3>
${BANG_EN}
<p>XSS defeats all three: a script running inside LabFlow ID's own page is same-origin, can read the token, and its requests carry the cookie (lesson 3.2 measured it). CSRF defences assume your pages are not compromised.</p>

<h3>It happened: ING Direct, 2008</h3>
<p>William Zeller and Edward Felten (Princeton) showed in 2008 that a web page visited by a signed-in ING Direct customer could make the bank open a new account in the customer's name and <strong>transfer funds</strong> into an account the attacker controlled — no password, no malware, just requests the browser sent with the customer's cookies. YouTube, MetaFilter and the New York Times had CSRF holes too; all were fixed after disclosure.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“What is CSRF?”</strong> — Another site makes the victim's browser send a state-changing request; the browser attaches the session cookie; the server cannot tell the user did not intend it.</li>
<li><strong>“How do you prevent it?”</strong> — SameSite=Lax on the session cookie, a server check of <code>Sec-Fetch-Site</code> with an Origin fallback on every unsafe method, and a synchronizer token where those are not enough. Never rely on CORS.</li>
<li><strong>“Do APIs with bearer tokens need CSRF protection?”</strong> — Not for the token itself: the browser does not attach an <code>Authorization</code> header by itself. They need it as soon as they use cookies.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo3/csrf-matrix.mjs</code>. Add a sixth configuration <code>['Strict', 'none']</code> and predict its row first.</li>
<li>With v0.3 running, send <code>curl -b &lt;jar&gt; -H 'Origin: null' …/me/email</code>. What does v0.3 answer, and is that the right answer?</li>
<li>Change <code>demo3/csrf-target.mjs</code> so the token is a constant string instead of an HMAC of the session id. Which attack could now succeed?</li>
</ol>
<p><strong>Solution</strong> (we ran 1 and 2): Strict behaves like Lax for these two POSTs (no cookie ⇒ 401/401) and also signs An out of links from other sites. <code>Origin: null</code> is not in the allowed list ⇒ 403 — right, because a sandboxed frame is not our page. A constant token is the same for every user: an attacker who signs up and reads <em>his</em> settings page learns everyone's token, so the form attack works again — the token must be bound to the session.</p>
<p><strong>Done when:</strong> your own app rejects a cross-site POST that carries the session cookie (test with a page on another port or host), and your own forms still work.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CSRF</span><span class="v">Cross-site request forgery: another site causes a request that the browser sends with the victim's cookies.</span></div>
  <div class="kv"><span class="k">Fetch Metadata (Sec-Fetch-Site)</span><span class="v">A request header the browser sets: same-origin, same-site, cross-site or none.</span></div>
  <div class="kv"><span class="k">Origin header</span><span class="v">The scheme + host + port of the page that sent a request; sent on cross-origin POSTs.</span></div>
  <div class="kv"><span class="k">synchronizer token</span><span class="v">A per-session secret in each form, checked on submission; another site cannot read it.</span></div>
  <div class="kv"><span class="k">simple request</span><span class="v">A request the browser sends without a CORS preflight (form-encoded/multipart/text/plain POST, GET).</span></div>
  <div class="kv"><span class="k">opaque response</span><span class="v">What a no-cors fetch receives: nothing readable — but the request already happened.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>CSRF works because the browser adds the cookie; the attacker never needs to read the response.</li>
<li>Measured in Chromium 156: None ⇒ form and fetch change the email; unset ⇒ the form does (2-minute window); Lax ⇒ 401; Fetch Metadata or token ⇒ 403.</li>
<li>CORS controls reading, not writing.</li>
<li>v0.3: SameSite=Lax + <code>Sec-Fetch-Site</code>/Origin on every unsafe method; a token where needed.</li>
<li>XSS defeats all CSRF defences.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Applied in Node.js — lesson 8.4: cookies, CSRF, revocation', sub: 'Same: CSRF, and SameSite measured in Chromium (149 there, 156 here — identical for POST). That lesson attacks four bank endpoints and uses double-submit; this one ranks three layers on five configurations and adds Fetch Metadata.', cta: 'OPEN NODE.JS LESSON →' })}
${lienKet({ khoa: 'api-design', bai: 'api-6-4-cors', title: 'Also in API Design — lesson 6.4: CORS, CSRF and browsers', sub: 'Same: what a browser sends by itself and what it lets a page read; Bearer tokens are not attached automatically. That lesson is about configuring CORS for an API; this one shows, with a no-cors fetch that still changed the email, why CORS is not a CSRF defence.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>CSRF, và ba lớp phòng xếp theo thứ tự</h2>
<p class="lead">Cookie phiên ở bài 3.2 được trình duyệt gửi <em>tự động</em> — đó là điều làm nó tiện. Cũng chính điều đó làm <strong>cross-site request forgery</strong> (CSRF — giả mạo request liên site) khả thi: một trang ở site khác gây ra một request tới LabFlow ID, và trình duyệt đính cookie của An vào. Kẻ tấn công không bao giờ đọc câu trả lời; hắn chỉ cần request xảy ra. Bài này tấn công năm cấu hình từ site khác trong Chromium thật, cho thấy vì sao CORS không giúp được, và xếp hạng ba lớp phòng thật sự có tác dụng.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>giải thích CSRF theo những gì trình duyệt tự gửi, và kẻ tấn công thấy được gì, không thấy được gì;</li>
<li>đoán thiết lập SameSite nào chặn request giả mạo nào — có số đo;</li>
<li>giải thích vì sao CORS không phải lớp phòng CSRF;</li>
<li>cài phép kiểm Fetch Metadata + Origin và token đồng bộ, và chọn giữa chúng;</li>
<li>nói được vì sao một lỗ XSS đánh bại mọi lớp phòng CSRF.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> CSRF có trong mọi bảng kiểm bảo mật web và mọi buổi phỏng vấn backend, và phần lớn câu trả lời dừng ở "thêm CSRF token". Bạn sẽ nói được lớp phòng nào, vì sao, và mỗi lớp hở chỗ nào — kèm số từ trình duyệt thật.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Hãy tưởng tượng con dấu chữ ký của bạn tự đi theo mọi lá thư rời khỏi nhà bạn. Khi đó ai cũng gửi được cho ngân hàng một tờ lệnh chuyển tiền "có chữ ký" của bạn: ngân hàng kiểm con dấu, không kiểm ai viết thư. Trình duyệt làm đúng như vậy với cookie — nó đính cookie phiên của LabFlow ID vào mọi request tới LabFlow ID, dù ai gây ra: một link, một form, một ảnh, một đoạn script trên trang bạn tình cờ mở.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">An đang đăng nhập</span><span class="lz-d">Trình duyệt của cô giữ <code>__Host-lfid_ses</code> của LabFlow ID.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cô mở một trang khác</span><span class="lz-d">Một bài trên diễn đàn, một quảng cáo, một link trong chat — ở site khác do kẻ tấn công điều khiển.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Trang đó gửi một request</span><span class="lz-d">Một form tự submit, hoặc một <code>fetch</code> chạy nền, tới <code>POST /me/email</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Có cookie hay không?</span><span class="lz-d">Nếu trình duyệt đính nó và máy chủ không kiểm request đến từ đâu, email bị đổi — rồi "quên mật khẩu" trao luôn tài khoản.</span></div>
</div>

<h3>Năm cấu hình, một trang kẻ tấn công — đo thật</h3>
<p><code>demo3/csrf-target.mjs</code> là một dịch vụ "đổi email" nhỏ trên <code>localhost:4802</code> có thể chuyển giá trị SameSite của cookie và lớp phòng. <code>demo3/csrf-matrix.mjs</code> đăng nhập cho An, rồi mở hai trang của kẻ tấn công trên <code>127.0.0.1:4801</code> (một site khác): một form tự submit và một <code>fetch(…, { mode: 'no-cors', credentials: 'include' })</code>. Sau mỗi lần thử nó kiểm email có đổi không, và cuối cùng gửi form cài đặt của chính An:</p>
${ra(OUT['34-csrf'])}
<ul>
<li><strong>SameSite=None, không phòng:</strong> cả hai đòn đều <strong>CHANGED</strong> email. Đây là lỗ CSRF kinh điển.</li>
<li><strong>Không khai SameSite:</strong> đòn form vẫn <strong>CHANGED</strong> (POST cấp cao nhất trong cửa sổ 2 phút của bài 3.2); fetch không mang cookie (401).</li>
<li><strong>SameSite=Lax:</strong> không cookie nào theo hai POST chéo site ⇒ 401. Lớp 1 có tác dụng — trong trình duyệt này, với trường hợp chéo site này.</li>
<li><strong>Fetch Metadata</strong> và <strong>token</strong>, kể cả với SameSite=None: 403 cho cả hai đòn.</li>
<li>Form của chính An: <strong>200 ở mọi hàng</strong>. Lớp phòng chặn cả người dùng thật là một sự cố, không phải lớp phòng.</li>
</ul>

<h3>CORS không phải lớp phòng CSRF</h3>
<p>Fetch ở hàng 1 cho thấy điều đó: trang kẻ tấn công nhận phản hồi <em>mờ đục (opaque)</em> — CORS (chia sẻ tài nguyên khác origin) chặn nó <em>đọc</em> bất cứ thứ gì — nhưng request đã được gửi, kèm cookie, và máy chủ đã đổi email. CORS kiểm soát ai được đọc phản hồi. POST dạng form-encoded, multipart và text/plain là "request đơn giản (simple request)" và được gửi không qua preflight; chỉ request không đơn giản (content type JSON, header tự đặt) mới hỏi máy chủ trước. Một endpoint chỉ nhận JSON vì vậy chống được mẹo dùng form một cách tình cờ, không phải do thiết kế — đừng dựa vào nó.</p>

<h3>Lớp 2: Fetch Metadata, kèm Origin dự phòng</h3>
<p>Trình duyệt hiện đại thêm <code>Sec-Fetch-Site</code> vào mọi request: <code>same-origin</code>, <code>same-site</code>, <code>cross-site</code> hoặc <code>none</code> (gõ trên thanh địa chỉ). Máy chủ chỉ việc từ chối các method không an toàn không đến từ origin của chính nó. LabFlow ID v0.3:</p>
${ma('javascript', CSRF)}
${ra(OUT['34-v03'])}
<p>Cùng cookie, cùng thân — chỉ thông tin của trình duyệt thay đổi. <code>same-site</code> cũng bị từ chối: <code>blog.labflow.example</code> là cùng <em>site</em> với LabFlow ID, nên cookie SameSite không tách chúng ra, còn phép kiểm này thì có. Trình duyệt cũ không có Fetch Metadata vẫn gửi <code>Origin</code> với POST chéo site, nên nó được kiểm khi có mặt (OWASP gọi dự phòng này là bắt buộc). Request không có cả hai header đến từ curl hay ứng dụng di động, thứ không thể cưỡi lên cookie trong trình duyệt của nạn nhân — được cho qua.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — chỉ kiểm Referer, hoặc tin <code>Origin: null</code>.</strong> Referer thường bị cắt (bài 1.1 đo được <code>strict-origin-when-cross-origin</code>), và iframe sandbox gửi <code>Origin: null</code>. Thiếu header hay <code>null</code> không phải bằng chứng của request cùng origin. Dùng <code>Sec-Fetch-Site</code> trước, Origin làm dự phòng, và đừng bao giờ "thiếu header thì cho qua" với lưu lượng trình duyệt mà bạn biết là có gửi nó.</p>
</div>

<h3>Lớp 3: token đồng bộ</h3>
<p>Khi một form còn phải chạy ở trình duyệt không có Fetch Metadata, thêm một token kẻ tấn công không thể biết: HMAC của session id với khoá của máy chủ, render thành trường ẩn trong chính trang của bạn và so trong thời gian không đổi (bài 1.3). Trang của kẻ tấn công không đọc được trang của bạn (chính sách cùng origin), nên không chép được token:</p>
${ma('javascript', TOKEN)}
<p>Hàng 5 của ma trận: SameSite=None, vậy mà cả hai đòn đều nhận 403 và form của chính An — có mang token — nhận 200.</p>

<h3>Xếp hạng: lớp nào, khi nào</h3>
${BANG_VI}
<p>XSS đánh bại cả ba: script chạy bên trong chính trang của LabFlow ID là cùng origin, đọc được token, và request của nó mang cookie (bài 3.2 đã đo). Các lớp phòng CSRF giả định trang của bạn không bị chiếm.</p>

<h3>Đã xảy ra: ING Direct, 2008</h3>
<p>William Zeller và Edward Felten (Princeton) chỉ ra năm 2008 rằng một trang web mà khách hàng ING Direct đang đăng nhập ghé vào có thể khiến ngân hàng mở một tài khoản mới đứng tên khách hàng và <strong>chuyển tiền</strong> sang một tài khoản do kẻ tấn công kiểm soát — không mật khẩu, không mã độc, chỉ là các request trình duyệt gửi kèm cookie của khách hàng. YouTube, MetaFilter và New York Times cũng có lỗ CSRF; tất cả đã được sửa sau khi được báo.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"CSRF là gì?"</strong> — Một site khác khiến trình duyệt nạn nhân gửi một request thay đổi trạng thái; trình duyệt đính cookie phiên; máy chủ không phân biệt được người dùng không hề muốn request đó.</li>
<li><strong>"Chống thế nào?"</strong> — SameSite=Lax cho cookie phiên, máy chủ kiểm <code>Sec-Fetch-Site</code> kèm Origin dự phòng ở mọi method không an toàn, và token đồng bộ ở chỗ chừng đó chưa đủ. Không bao giờ dựa vào CORS.</li>
<li><strong>"API dùng bearer token có cần chống CSRF không?"</strong> — Với chính token thì không: trình duyệt không tự đính header <code>Authorization</code>. Cần ngay khi chúng dùng cookie.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo3/csrf-matrix.mjs</code>. Thêm cấu hình thứ sáu <code>['Strict', 'none']</code> và đoán hàng của nó trước.</li>
<li>Khi v0.3 đang chạy, gửi <code>curl -b &lt;jar&gt; -H 'Origin: null' …/me/email</code>. v0.3 trả lời gì, và đó có phải câu trả lời đúng?</li>
<li>Sửa <code>demo3/csrf-target.mjs</code> để token là một chuỗi cố định thay vì HMAC của session id. Đòn nào giờ có thể thành công?</li>
</ol>
<p><strong>Lời giải</strong> (mình đã chạy câu 1 và 2): Strict cư xử như Lax với hai POST này (không cookie ⇒ 401/401) và còn làm An "chưa đăng nhập" khi bấm link từ site khác. <code>Origin: null</code> không nằm trong danh sách cho phép ⇒ 403 — đúng, vì một frame sandbox không phải trang của ta. Token cố định giống nhau cho mọi người dùng: kẻ tấn công đăng ký rồi đọc trang cài đặt của <em>chính hắn</em> là biết token của mọi người, nên đòn form lại chạy được — token phải gắn với phiên.</p>
<p><strong>Đạt khi:</strong> ứng dụng của bạn từ chối một POST chéo site có mang cookie phiên (thử bằng một trang ở cổng hay host khác), và form của chính bạn vẫn chạy.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CSRF (giả mạo request liên site)</span><span class="v">Một site khác gây ra một request mà trình duyệt gửi kèm cookie của nạn nhân.</span></div>
  <div class="kv"><span class="k">Fetch Metadata (Sec-Fetch-Site)</span><span class="v">Header trình duyệt tự đặt: same-origin, same-site, cross-site hoặc none.</span></div>
  <div class="kv"><span class="k">Origin header</span><span class="v">Scheme + host + cổng của trang gửi request; được gửi với POST khác origin.</span></div>
  <div class="kv"><span class="k">synchronizer token (token đồng bộ)</span><span class="v">Bí mật theo phiên đặt trong mỗi form, kiểm khi submit; site khác không đọc được.</span></div>
  <div class="kv"><span class="k">simple request (request đơn giản)</span><span class="v">Request trình duyệt gửi không qua preflight CORS (POST form-encoded/multipart/text/plain, GET).</span></div>
  <div class="kv"><span class="k">opaque response (phản hồi mờ đục)</span><span class="v">Thứ một fetch no-cors nhận được: chẳng đọc được gì — nhưng request đã xảy ra rồi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>CSRF chạy được vì trình duyệt tự đính cookie; kẻ tấn công không cần đọc phản hồi.</li>
<li>Đo trong Chromium 156: None ⇒ form và fetch đều đổi được email; không khai ⇒ form đổi được (cửa sổ 2 phút); Lax ⇒ 401; Fetch Metadata hay token ⇒ 403.</li>
<li>CORS kiểm soát việc đọc, không kiểm soát việc ghi.</li>
<li>v0.3: SameSite=Lax + <code>Sec-Fetch-Site</code>/Origin ở mọi method không an toàn; token khi cần.</li>
<li>XSS đánh bại mọi lớp phòng CSRF.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Áp vào Node.js — bài 8.4: cookie, CSRF, thu hồi phiên', sub: 'Giống: CSRF, và SameSite đo trong Chromium (bên đó 149, ở đây 156 — giống hệt với POST). Bài đó tấn công bốn endpoint ngân hàng và dùng double-submit; bài này xếp hạng ba lớp trên năm cấu hình và thêm Fetch Metadata.', cta: 'MỞ BÀI NODE.JS →' })}
${lienKet({ khoa: 'api-design', bai: 'api-6-4-cors', title: 'Cũng có ở API Design — bài 6.4: CORS, CSRF và trình duyệt', sub: 'Giống: trình duyệt tự gửi gì và cho trang đọc gì; Bearer token không được tự đính. Bài đó nói về cấu hình CORS cho một API; bài này cho thấy, bằng một fetch no-cors vẫn đổi được email, vì sao CORS không phải lớp phòng CSRF.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
