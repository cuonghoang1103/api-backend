import G05_1 from './giang/obj-05-1.mjs';
import G05_2 from './giang/obj-05-2.mjs';
import G05_3 from './giang/obj-05-3.mjs';
const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 5 — CORS for browser uploads|||Chương 5 — CORS cho browser upload',
  slug: 'os-ch5-cors',
  description: 'Ba bài về CORS bucket config, preflight, và bug thường gặp khi browser upload không qua được.',
  sortOrder: 6,
  lessons: [

    {
      title: '5.1 — Why CORS: browser blocks cross-origin PUT|||5.1 — Vì sao CORS: browser chặn cross-origin PUT',
      slug: 'os-5-1-vi-sao-cors',
      type: 'VIDEO',
      description: 'Browser same-origin policy chặn PUT tới domain khác nếu không có CORS header. Preflight OPTIONS phải return đúng.',
      content: `
${G05_1}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Why CORS: browser blocks cross-origin PUT</h2>
<p class="lead">Your site at cuongthai.com. R2 bucket at xxx.r2.cloudflarestorage.com. Different origin. Browser blocks PUT unless R2 returns CORS headers allowing it.</p>

<h3>Same-origin policy — why it exists</h3>
<pre><code class="language-text">Without SOP:
  bad-site.com could JavaScript-fetch bank.com with user's cookies
  Get user data, transfer money
  
With SOP:
  Browsers restrict cross-origin XHR/fetch by default
  Server must OPT IN via Access-Control-Allow-* headers
  
S3 bucket at xxx.r2.cloudflarestorage.com is different origin from cuongthai.com
So R2 must configure CORS to allow uploads
</code></pre>

<h3>R2 CORS config</h3>
<pre><code class="language-text">Cloudflare Dashboard -&gt; R2 -&gt; bucket -&gt; Settings -&gt; CORS Policy

[{
  "AllowedOrigins": ["https://cuongthai.com", "https://www.cuongthai.com"],
  "AllowedMethods": ["PUT", "POST", "GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}]
</code></pre>

<h3>Preflight OPTIONS request</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Browser sends OPTIONS</span><span class="lz-d">Before PUT with non-simple headers, browser sends OPTIONS to check server permission. Includes <code>Access-Control-Request-Method: PUT</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">R2 responds with allowed methods/origins</span><span class="lz-d">If Origin + Method allowed, R2 returns 200 with Access-Control-Allow-*. Browser proceeds with actual PUT.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">If disallowed, browser blocks</span><span class="lz-d">No PUT even sent. DevTools shows CORS error. Server sees no PUT request at all.</span></div>
</div>

<h3>Debugging from DevTools</h3>
<pre><code class="language-text">Network tab -&gt; failing request:
  Status: flagged as a CORS failure (the label differs between DevTools versions)
  Console error: "Access to fetch at '…' from origin '…' has been blocked by CORS policy: …"   ← the exact reason, measured below
  
Preflight OPTIONS response:
  Access-Control-Allow-Origin: [expected origin? or *?]
  Access-Control-Allow-Methods: [PUT included?]
  Access-Control-Allow-Headers: [content-type included?]
</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>AllowedOrigins: [&quot;*&quot;]</code> in production.</strong> It does <em>not</em> let strangers upload: anyone holding a signed URL can already PUT with curl, CORS or not (measured below). What <code>*</code> changes is which web pages may use such a URL — and read the reply — from inside a user's browser. Keep explicit origins in production as one more layer, and never treat CORS as access control; the signature is the lock (Chapter 4).</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Browser blocks cross-origin PUT to R2 unless bucket CORS policy allows the origin + method (PUT) + headers (content-type); config in Cloudflare dashboard with explicit AllowedOrigins for production; a blocked preflight means the PUT is never sent — your code sees only &quot;Failed to fetch&quot;, the reason is in the Console.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>On the bucket (Cloudflare dashboard, or a local Garage server — MinIO answers <code>PutBucketCors</code> with <code>NotImplemented</code>), set a CORS policy that allows ONLY <code>https://cuongthai.com</code> for <code>PUT, GET, HEAD</code> with <code>AllowedHeaders: ["*"]</code>.</li>
<li>From a page served at a DIFFERENT origin (e.g. <code>http://localhost:3000</code>), in the console run <code>fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'image/jpeg' }, body: file })</code>.</li>
<li>Open DevTools → Network: find the OPTIONS preflight before the PUT, read its <code>Access-Control-Allow-Origin</code> / <code>-Methods</code> response headers. The PUT is blocked because your origin is not listed.</li>
<li>Add <code>http://localhost:3000</code> to <code>AllowedOrigins</code>, wait a minute, hard-refresh, retry — the PUT now succeeds.</li>
<li>Reproduce the preflight from the shell: <code>curl -X OPTIONS -H 'Origin: http://localhost:3000' -H 'Access-Control-Request-Method: PUT' -I "$BUCKET_URL/some-key"</code>.</li>
</ol>
<p><strong>Done when:</strong> you saw the SAME PUT blocked and then allowed purely by editing <code>AllowedOrigins</code>, and can read the three <code>Access-Control-Allow-*</code> headers in the OPTIONS response.</p></div>

<h3>🔬 Measured: the server's view and the browser's view</h3>
<p>Lab: Garage v2.1.0 (an open-source S3 server that implements <code>PutBucketCors</code>) behind a small counting proxy that logs every request the server really receives; a page served from <code>http://cuongthai.localhost:20230</code> and <code>http://www.cuongthai.localhost:20230</code> (same server, two origins); a real Chromium through Playwright. Nothing touches the real bucket. First, why not MinIO:</p>
<div class="out">$ aws s3api put-bucket-cors --bucket thu-cors --cors-configuration file://p1.json      # MinIO :20200
An error occurred (NotImplemented) when calling the PutBucketCors operation: A header you provided implies functionality that is not implemented
$ curl -si -X OPTIONS -H 'Origin: http://evil.example' -H 'Access-Control-Request-Method: PUT' localhost:20200/thu-cors/a.jpg
HTTP/1.1 204 No Content
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: PUT
Access-Control-Allow-Origin: http://evil.example
$ docker run -d --name obj-garage -p 127.0.0.1:20220:3900 … dxflrs/garage:v2.1.0
Garage v2.1.0 · 1 nút</div>
<p>The policy (only the origin without <code>www</code>), a preflight by hand for both origins, and curl with a forged <code>Origin</code>:</p>
<div class="out">$ aws s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p1.json   # Garage
đã đặt
$ aws s3api get-bucket-cors --bucket media-ch5
{"CORSRules":[{"AllowedHeaders":["content-type"],"AllowedMethods":["PUT","GET","HEAD"],"AllowedOrigins":["http://cuongthai.localhost:20230"],"ExposeHeaders":["ETag"],"MaxAgeSeconds":3600}]}
$ curl -si -X OPTIONS -H 'Origin: http://cuongthai.localhost:20230' -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type' localhost:20221/media-ch5/anh/u42/a.jpg
HTTP/1.1 200 OK
access-control-allow-origin: http://cuongthai.localhost:20230
access-control-allow-methods: PUT, GET, HEAD
access-control-allow-headers: content-type
access-control-expose-headers: ETag
$ curl -si -X OPTIONS -H 'Origin: http://www.cuongthai.localhost:20230' -H 'Access-Control-Request-Method: PUT' … | grep …
HTTP/1.1 403 Forbidden
access-control-allow-origin: *
&lt;Message&gt;Forbidden: This CORS request is not allowed.&lt;/Message&gt;
$ u=$(curl -s 'localhost:20230/presign?key=anh/u42/curl.jpg' | jq -r .url); curl -X PUT -H 'Origin: http://www.cuongthai.localhost:20230' -H 'Content-Type: image/jpeg' --data 'anh' "$u"
PUT bằng curl ⇒ HTTP 200</div>
<p>The page on the <code>www</code> origin presses "upload":</p>
<div class="out">$ chromium "http://www.cuongthai.localhost:20230/?thu=put"     # trang ở origin www bấm tải ảnh lên (Chromium thật, Playwright)
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://www.cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
trang: — xong —
$ cat dem.log      # máy chủ THẬT SỰ nhận được gì
OPTIONS /media-ch5/anh/u42/1794646407042-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 403</div>
<p>One OPTIONS answered 403 and <strong>no PUT</strong> — the browser never sent it. Same page from the allowed origin:</p>
<div class="out">$ chromium "http://cuongthai.localhost:20230/?thu=put"         # cùng trang, origin KHÔNG có www (có trong AllowedOrigins)
trang: #1 PUT ⇒ HTTP 200 (9 ms)
trang:    JS đọc headers.get('etag') = "\\"72a3c202147228463777208e7f224823\\""
trang: — xong —
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p>The repo's own way, <code>XMLHttpRequest</code> (frontend/src/lib/api.ts:415): <code>onerror</code> with <code>status = 0</code>, which is why its message says "check bucket CORS":</p>
<div class="out">$ chromium "http://www.cuongthai.localhost:20230/?thu=xhr"     # PUT bằng XMLHttpRequest — đúng cách frontend/src/lib/api.ts:415 của kho
Chromium error: Access to XMLHttpRequest at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://www.cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
trang: #1 XHR PUT ⇒ xhr.onerror · xhr.status = 0 ⇒ "R2 PUT network error (check bucket CORS)"
trang: — xong —
Chromium error: Failed to load resource: net::ERR_FAILED
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794646412266-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 403</div>
<p>A <em>simple</em> GET (no extra headers ⇒ no preflight) from the wrong origin: the server <strong>received and answered 200</strong>; only reading the reply was blocked. CORS blocks reading, not always sending.</p>
<div class="out">$ chromium "http://www.cuongthai.localhost:20230/?thu=get"     # GET "đơn giản" (không header thêm) bằng URL ký sẵn, từ origin KHÔNG được phép
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://www.cuongthai.localhost:20230' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 GET ⇒ TypeError: Failed to fetch
trang: — xong —
$ cat dem.log
GET     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://www.cuongthai.localhost:20230 ⇒ 200</div>
<p>Add the <code>www</code> origin (as its own rule — lesson 5.3 shows why) and the identical page works:</p>
<div class="out">$ aws s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p2.json   # thêm origin www (một rule riêng)
đã đặt
$ chromium "http://www.cuongthai.localhost:20230/?thu=put"     # y hệt lần bị chặn
trang: #1 PUT ⇒ HTTP 200 (8 ms)
trang:    JS đọc headers.get('etag') = "\\"72a3c202147228463777208e7f224823\\""
trang: — xong —
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794646439376-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794646439376-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 200</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>cuongthai.com, measured on 14/11/2026 (read-only preflight to the public media domain):</strong> <code>cuongthai.com</code> and <code>www.cuongthai.com</code> get the CORS headers, <code>localhost:3000</code> gets 403 — so local development uses the storage sandbox, never the real bucket.</li>
</ul>
<div class="out">$ for o in https://cuongthai.com https://www.cuongthai.com http://localhost:3000; do curl -si -X OPTIONS -H "Origin: $o" -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type' https://media.cuongthai.com/&lt;một slide công khai&gt;; done
Origin: https://cuongthai.com
   HTTP/2 204 
   access-control-allow-methods: GET, PUT, POST, DELETE, HEAD
   access-control-max-age: 3600
   access-control-allow-origin: https://cuongthai.com
   access-control-allow-headers: content-type
Origin: https://www.cuongthai.com
   HTTP/2 204 
   access-control-allow-methods: GET, PUT, POST, DELETE, HEAD
   access-control-max-age: 3600
   access-control-allow-origin: https://www.cuongthai.com
   access-control-allow-headers: content-type
Origin: http://localhost:3000
   HTTP/2 403 </div>
<ul>
<li><strong>A real incident (09/10/2026):</strong> changing a CT Work project image failed with "Failed to fetch" because the browser PUT straight to the R2 endpoint — the desktop app's CSP blocked it, and on the web it hung on a bucket CORS rule the backend key could not even read. The fix routed the bytes through the backend (<code>src/services/work/projectCover.service.ts</code>). Some older frontend comments still claim "the bucket has no CORS policy"; today's measurement says it has one. Measure, don't trust comments.</li>
<li><strong>What if you open the site as <code>www.</code> and the policy lists only the bare domain?</strong> Exactly the blocked run above: every upload fails with a generic network error. The backend's own Express CORS list (<code>src/index.ts:295</code>) includes the <code>www</code> variant for this reason.</li>
<li><strong>The attacker's view:</strong> CORS is the receptionist's rule, not the warehouse lock. With a leaked presigned URL an attacker uses curl, forges any <code>Origin</code>, and gets 200. MinIO even reflects <em>any</em> origin with <code>Allow-Credentials: true</code>. Defend with the signature: short expiry, pinned content type, allow-list before signing, URLs kept out of logs.</li>
</ul>
<h3>🔁 Run it yourself</h3>
<p>Start Garage in Docker, create a key and a bucket, <code>aws s3api put-bucket-cors</code> with one origin. Serve one HTML page on <code>name.localhost</code> and <code>www.name.localhost</code> (Chromium resolves every <code>*.localhost</code> to your machine), PUT from both, and compare the Console with the server log. Then curl the same URL with a fake <code>Origin</code>.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-7-5-https-cors" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 7.5 — HTTPS and CORS</span><span class="lc-sub">Origins and CORS from zero</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-6-4-cors" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">API Design · 6.4 — CORS, CSRF and browsers: measured in a real Chromium</span><span class="lc-sub">CORS with cookies, and why it is not CSRF protection</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Same-origin policy</span><span class="v">Browser rule that blocks cross-origin JS requests unless the server opts in.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">Cross-Origin Resource Sharing — the headers a server uses to opt in.</span></div>
  <div class="kv"><span class="k">Origin</span><span class="v">scheme + host + port; <code>https://cuongthai.com</code> differs from <code>https://www.cuongthai.com</code>.</span></div>
  <div class="kv"><span class="k">Preflight (OPTIONS)</span><span class="v">The probe a browser sends before a non-simple request to check permission.</span></div>
  <div class="kv"><span class="k">AllowedOrigins</span><span class="v">Bucket CORS field listing which origins may call it.</span></div>
  <div class="kv"><span class="k">Failed to fetch</span><span class="v">All JavaScript learns when CORS blocks a request (XHR: status 0) — the reason is only in the Console.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A browser blocks a cross-origin PUT to R2 unless the bucket opts in with CORS headers.</li><li>Non-simple requests (PUT, or <code>Content-Type: image/jpeg</code>) send a preflight OPTIONS first; the real PUT runs only if the origin + method + headers are allowed.</li><li>Configure <code>AllowedOrigins</code> (explicit in production), <code>AllowedMethods</code> (include PUT), and <code>AllowedHeaders</code> on the bucket.</li><li>A blocked preflight means the PUT never reaches your server and your code sees only <code>Failed to fetch</code>; a <em>simple</em> request (plain GET) does reach the server — only reading the reply is blocked.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — CORS</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/cors — config guide.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CORS</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/CORS — protocol details.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Vì sao CORS: browser chặn cross-origin PUT</h2>
<p class="lead">Site của bạn ở cuongthai.com. R2 bucket ở xxx.r2.cloudflarestorage.com. Origin khác nhau. Browser chặn PUT trừ khi R2 return CORS header cho phép.</p>

<h3>Same-origin policy — vì sao tồn tại</h3>
<pre><code class="language-text">Without SOP:
  bad-site.com could JavaScript-fetch bank.com với user's cookies
  Get user data, transfer money
  
With SOP:
  Browser restrict cross-origin XHR/fetch by default
  Server phải OPT IN qua Access-Control-Allow-* header
  
S3 bucket ở xxx.r2.cloudflarestorage.com là origin khác từ cuongthai.com
Nên R2 phải config CORS để cho phép upload
</code></pre>

<h3>R2 CORS config</h3>
<pre><code class="language-text">Cloudflare Dashboard -&gt; R2 -&gt; bucket -&gt; Settings -&gt; CORS Policy

[{
  "AllowedOrigins": ["https://cuongthai.com", "https://www.cuongthai.com"],
  "AllowedMethods": ["PUT", "POST", "GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}]
</code></pre>

<h3>Preflight OPTIONS request</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Browser gửi OPTIONS</span><span class="lz-d">Trước PUT với non-simple header, browser gửi OPTIONS để check server permission. Include <code>Access-Control-Request-Method: PUT</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">R2 respond với allowed methods/origins</span><span class="lz-d">Nếu Origin + Method allowed, R2 return 200 với Access-Control-Allow-*. Browser proceed với actual PUT.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nếu disallowed, browser block</span><span class="lz-d">Không PUT nào gửi. DevTools hiện CORS error. Server không thấy PUT request nào.</span></div>
</div>

<h3>Debug từ DevTools</h3>
<pre><code class="language-text">Network tab -&gt; failing request:
  Status: bị đánh dấu lỗi CORS (nhãn khác nhau tuỳ bản DevTools)
  Console error: "Access to fetch at '…' from origin '…' has been blocked by CORS policy: …"   ← lý do chính xác, đo bên dưới
  
Preflight OPTIONS response:
  Access-Control-Allow-Origin: [expected origin? or *?]
  Access-Control-Allow-Methods: [PUT included?]
  Access-Control-Allow-Headers: [content-type included?]
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>AllowedOrigins: [&quot;*&quot;]</code> trong production.</strong> Nó <em>không</em> cho người lạ tải lên: ai cầm URL ký sẵn đã PUT được bằng curl, có CORS hay không (đo bên dưới). Cái <code>*</code> đổi là trang web nào được dùng URL đó — và đọc câu trả lời — từ bên trong trình duyệt của người dùng. Ở production vẫn ghi rõ origin như một lớp phòng thêm, và đừng bao giờ coi CORS là kiểm soát truy cập; ổ khoá là chữ ký (Chương 4).</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Browser chặn cross-origin PUT tới R2 trừ khi bucket CORS policy cho phép origin + method (PUT) + header (content-type); config ở Cloudflare dashboard với AllowedOrigins explicit cho production; preflight bị từ chối thì PUT không bao giờ gửi — mã chỉ thấy &quot;Failed to fetch&quot;, lý do nằm ở Console.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trên bucket (Cloudflare dashboard, hoặc Garage cục bộ — MinIO trả <code>NotImplemented</code> cho <code>PutBucketCors</code>), đặt CORS policy CHỈ cho phép <code>https://cuongthai.com</code> với <code>PUT, GET, HEAD</code> và <code>AllowedHeaders: ["*"]</code>.</li>
<li>Từ một trang chạy ở origin KHÁC (vd <code>http://localhost:3000</code>), ở console chạy <code>fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'image/jpeg' }, body: file })</code>.</li>
<li>Mở DevTools → Network: tìm preflight OPTIONS trước PUT, đọc header response <code>Access-Control-Allow-Origin</code> / <code>-Methods</code>. PUT bị chặn vì origin của bạn không có trong danh sách.</li>
<li>Thêm <code>http://localhost:3000</code> vào <code>AllowedOrigins</code>, chờ tới 30 giây (tài liệu R2, 23/09/2026), tải lại trang, thử lại — PUT giờ thành công.</li>
<li>Tái hiện preflight bằng shell: <code>curl -X OPTIONS -H 'Origin: http://localhost:3000' -H 'Access-Control-Request-Method: PUT' -I "$BUCKET_URL/some-key"</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn thấy CÙNG một PUT bị chặn rồi được cho phép chỉ bằng cách sửa <code>AllowedOrigins</code>, và đọc được ba header <code>Access-Control-Allow-*</code> trong response OPTIONS.</p></div>

<h3>🔬 Đo thật: máy chủ thấy gì, trình duyệt thấy gì</h3>
<p>Lab: Garage v2.1.0 (máy chủ S3 mã nguồn mở có <code>PutBucketCors</code>) đứng sau một "máy đếm" nhỏ ghi lại mọi request máy chủ thật sự nhận; một trang phục vụ ở <code>http://cuongthai.localhost:20230</code> và <code>http://www.cuongthai.localhost:20230</code> (cùng máy chủ, hai origin); Chromium thật qua Playwright. Không lệnh nào chạm bucket thật. Trước hết, vì sao không dùng MinIO:</p>
<div class="out">$ aws s3api put-bucket-cors --bucket thu-cors --cors-configuration file://p1.json      # MinIO :20200
An error occurred (NotImplemented) when calling the PutBucketCors operation: A header you provided implies functionality that is not implemented
$ curl -si -X OPTIONS -H 'Origin: http://evil.example' -H 'Access-Control-Request-Method: PUT' localhost:20200/thu-cors/a.jpg
HTTP/1.1 204 No Content
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: PUT
Access-Control-Allow-Origin: http://evil.example
$ docker run -d --name obj-garage -p 127.0.0.1:20220:3900 … dxflrs/garage:v2.1.0
Garage v2.1.0 · 1 nút</div>
<p>Chính sách (chỉ origin không có <code>www</code>), preflight bằng tay cho cả hai origin, và curl với <code>Origin</code> giả:</p>
<div class="out">$ aws s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p1.json   # Garage
đã đặt
$ aws s3api get-bucket-cors --bucket media-ch5
{"CORSRules":[{"AllowedHeaders":["content-type"],"AllowedMethods":["PUT","GET","HEAD"],"AllowedOrigins":["http://cuongthai.localhost:20230"],"ExposeHeaders":["ETag"],"MaxAgeSeconds":3600}]}
$ curl -si -X OPTIONS -H 'Origin: http://cuongthai.localhost:20230' -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type' localhost:20221/media-ch5/anh/u42/a.jpg
HTTP/1.1 200 OK
access-control-allow-origin: http://cuongthai.localhost:20230
access-control-allow-methods: PUT, GET, HEAD
access-control-allow-headers: content-type
access-control-expose-headers: ETag
$ curl -si -X OPTIONS -H 'Origin: http://www.cuongthai.localhost:20230' -H 'Access-Control-Request-Method: PUT' … | grep …
HTTP/1.1 403 Forbidden
access-control-allow-origin: *
&lt;Message&gt;Forbidden: This CORS request is not allowed.&lt;/Message&gt;
$ u=$(curl -s 'localhost:20230/presign?key=anh/u42/curl.jpg' | jq -r .url); curl -X PUT -H 'Origin: http://www.cuongthai.localhost:20230' -H 'Content-Type: image/jpeg' --data 'anh' "$u"
PUT bằng curl ⇒ HTTP 200</div>
<p>Trang ở origin <code>www</code> bấm "tải lên":</p>
<div class="out">$ chromium "http://www.cuongthai.localhost:20230/?thu=put"     # trang ở origin www bấm tải ảnh lên (Chromium thật, Playwright)
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://www.cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
trang: — xong —
$ cat dem.log      # máy chủ THẬT SỰ nhận được gì
OPTIONS /media-ch5/anh/u42/1794646407042-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 403</div>
<p>Một OPTIONS nhận 403 và <strong>không có PUT nào</strong> — trình duyệt không hề gửi. Cùng trang từ origin được phép:</p>
<div class="out">$ chromium "http://cuongthai.localhost:20230/?thu=put"         # cùng trang, origin KHÔNG có www (có trong AllowedOrigins)
trang: #1 PUT ⇒ HTTP 200 (9 ms)
trang:    JS đọc headers.get('etag') = "\\"72a3c202147228463777208e7f224823\\""
trang: — xong —
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p>Cách của chính kho, <code>XMLHttpRequest</code> (frontend/src/lib/api.ts:415): <code>onerror</code> với <code>status = 0</code>, nên thông báo lỗi của kho ghi "check bucket CORS":</p>
<div class="out">$ chromium "http://www.cuongthai.localhost:20230/?thu=xhr"     # PUT bằng XMLHttpRequest — đúng cách frontend/src/lib/api.ts:415 của kho
Chromium error: Access to XMLHttpRequest at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://www.cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
trang: #1 XHR PUT ⇒ xhr.onerror · xhr.status = 0 ⇒ "R2 PUT network error (check bucket CORS)"
trang: — xong —
Chromium error: Failed to load resource: net::ERR_FAILED
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794646412266-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 403</div>
<p>Một GET <em>đơn giản</em> (không header thêm ⇒ không preflight) từ origin sai: máy chủ <strong>đã nhận và trả 200</strong>; chỉ việc đọc câu trả lời bị chặn. CORS chặn đọc, không phải lúc nào cũng chặn gửi.</p>
<div class="out">$ chromium "http://www.cuongthai.localhost:20230/?thu=get"     # GET "đơn giản" (không header thêm) bằng URL ký sẵn, từ origin KHÔNG được phép
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://www.cuongthai.localhost:20230' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 GET ⇒ TypeError: Failed to fetch
trang: — xong —
$ cat dem.log
GET     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://www.cuongthai.localhost:20230 ⇒ 200</div>
<p>Thêm origin <code>www</code> (thành một rule riêng — bài 5.3 chỉ vì sao) và đúng trang đó chạy được:</p>
<div class="out">$ aws s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p2.json   # thêm origin www (một rule riêng)
đã đặt
$ chromium "http://www.cuongthai.localhost:20230/?thu=put"     # y hệt lần bị chặn
trang: #1 PUT ⇒ HTTP 200 (8 ms)
trang:    JS đọc headers.get('etag') = "\\"72a3c202147228463777208e7f224823\\""
trang: — xong —
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794646439376-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794646439376-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 200</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>cuongthai.com, đo ngày 14/11/2026 (preflight chỉ đọc lên tên miền media công khai):</strong> <code>cuongthai.com</code> và <code>www.cuongthai.com</code> nhận header CORS, <code>localhost:3000</code> nhận 403 — vì vậy chạy ở máy thì dùng kho giả (storage sandbox), không bao giờ dùng bucket thật.</li>
</ul>
<div class="out">$ for o in https://cuongthai.com https://www.cuongthai.com http://localhost:3000; do curl -si -X OPTIONS -H "Origin: $o" -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type' https://media.cuongthai.com/&lt;một slide công khai&gt;; done
Origin: https://cuongthai.com
   HTTP/2 204 
   access-control-allow-methods: GET, PUT, POST, DELETE, HEAD
   access-control-max-age: 3600
   access-control-allow-origin: https://cuongthai.com
   access-control-allow-headers: content-type
Origin: https://www.cuongthai.com
   HTTP/2 204 
   access-control-allow-methods: GET, PUT, POST, DELETE, HEAD
   access-control-max-age: 3600
   access-control-allow-origin: https://www.cuongthai.com
   access-control-allow-headers: content-type
Origin: http://localhost:3000
   HTTP/2 403 </div>
<ul>
<li><strong>Sự cố thật (09/10/2026):</strong> đổi ảnh dự án CT Work báo "Failed to fetch" vì trình duyệt PUT thẳng lên endpoint R2 — app desktop chặn bằng CSP, còn trên web thì phụ thuộc một rule CORS mà khoá của backend không có quyền đọc để kiểm. Cách sửa: gửi byte qua backend (<code>src/services/work/projectCover.service.ts</code>). Vài chú thích cũ ở frontend vẫn ghi "bucket không có CORS policy"; đo hôm nay thì có. Đo, đừng tin chú thích.</li>
<li><strong>Nếu mở trang bằng <code>www.</code> mà chính sách chỉ ghi tên miền trần thì sao?</strong> Đúng như lượt bị chặn ở trên: mọi lần tải lên hỏng với một lỗi mạng chung chung. Danh sách CORS Express của backend (<code>src/index.ts:295</code>) có sẵn biến thể <code>www</code> vì lý do này.</li>
<li><strong>Góc kẻ xấu:</strong> CORS là luật của lễ tân, không phải ổ khoá của kho. Có URL ký sẵn bị lộ, kẻ xấu dùng curl, giả mọi <code>Origin</code>, và nhận 200. MinIO còn phản chiếu <em>mọi</em> origin kèm <code>Allow-Credentials: true</code>. Phòng bằng chữ ký: hạn ngắn, khoá loại nội dung, lọc loại trước khi ký, không để URL lọt vào log.</li>
</ul>
<h3>🔁 Tự chạy lại</h3>
<p>Chạy Garage trong Docker, tạo khoá và bucket, <code>aws s3api put-bucket-cors</code> với một origin. Phục vụ một trang HTML ở <code>ten.localhost</code> và <code>www.ten.localhost</code> (Chromium trỏ mọi <code>*.localhost</code> về máy bạn), PUT từ cả hai, so Console với nhật ký máy chủ. Rồi curl cùng URL với <code>Origin</code> giả.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-7-5-https-cors" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 7.5 — HTTPS và CORS</span><span class="lc-sub">Origin và CORS từ con số không</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-6-4-cors" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">API Design · 6.4 — CORS, CSRF và trình duyệt: đo trong Chromium thật</span><span class="lc-sub">CORS đi cùng cookie, và vì sao nó không chống CSRF</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Same-origin policy</span><span class="v">Luật browser chặn request JS khác origin trừ khi server đồng ý.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">Cross-Origin Resource Sharing — bộ header server dùng để đồng ý.</span></div>
  <div class="kv"><span class="k">Origin</span><span class="v">scheme + host + port; <code>https://cuongthai.com</code> khác <code>https://www.cuongthai.com</code>.</span></div>
  <div class="kv"><span class="k">Preflight (OPTIONS)</span><span class="v">Mũi dò browser gửi trước request non-simple để hỏi quyền.</span></div>
  <div class="kv"><span class="k">AllowedOrigins</span><span class="v">Field CORS của bucket liệt kê origin nào được gọi.</span></div>
  <div class="kv"><span class="k">Failed to fetch</span><span class="v">Tất cả những gì JavaScript biết khi CORS chặn (XHR: status 0) — lý do chỉ có ở Console.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Browser chặn PUT khác origin tới R2 trừ khi bucket đồng ý bằng header CORS.</li><li>Request non-simple (PUT, hoặc <code>Content-Type: image/jpeg</code>) gửi preflight OPTIONS trước; PUT thật chỉ chạy nếu origin + method + header được cho phép.</li><li>Cấu hình <code>AllowedOrigins</code> (explicit ở production), <code>AllowedMethods</code> (có PUT), và <code>AllowedHeaders</code> trên bucket.</li><li>Preflight bị chặn thì PUT không bao giờ tới server và mã chỉ thấy <code>Failed to fetch</code>; request <em>đơn giản</em> (GET trơn) thì vẫn tới server — chỉ việc đọc câu trả lời bị chặn.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — CORS</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/cors — config guide.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CORS</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/CORS — protocol details.</span></span></div>
</div>
`,
    },


    {
      title: '5.2 — Preflight caching, credentials, and expose-headers|||5.2 — Cache preflight, credentials, và expose-headers',
      slug: 'os-5-2-preflight',
      type: 'VIDEO',
      description: 'Every browser upload preflights. Measured in a real Chromium: what the browser caches (keyed by origin AND URL), for how long, and the fields people miss — ExposeHeaders, credentials, Max-Age.',
      content: `
${G05_2}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Preflight caching, credentials, and expose-headers</h2>
<p class="lead">Lesson 5.1 covered the &quot;my upload fails with a CORS error&quot; case. Now: uploads work, and every PUT is preceded by a preflight OPTIONS. Can the browser remember the answer? Yes — for a while, and keyed by origin <em>and URL</em>. That last detail decides what <code>MaxAgeSeconds</code> can and cannot save, measured below in a real Chromium with a proxy that counts every request the server receives.</p>

<h3>What triggers a preflight in the first place</h3>
<pre><code class="language-text">A request is &quot;simple&quot; (no preflight) if ALL of these hold:
  Method:  GET, HEAD, or POST
  Content-Type: text/plain, application/x-www-form-urlencoded, or multipart/form-data
  No custom headers other than a small allowed list
  
Anything outside that list forces a preflight OPTIONS.

For S3-style uploads, a PUT with Content-Type: image/jpeg is NOT
simple. Neither is any request carrying x-amz-content-sha256 or
similar. So browser uploads to R2/S3 ALWAYS preflight.
</code></pre>

<p>You cannot avoid the preflight for a PUT to R2. The browser can cache the preflight answer — but the cache key is the origin <strong>plus the full request URL</strong> (and the method and headers asked for). Every presigned URL is a new URL, so a new upload means a new preflight (measured below).</p>

<h3>The three fields that most people leave off</h3>
<pre><code class="language-json">[
  {
    "AllowedOrigins": ["https://cuongthai.com"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
    "AllowedHeaders": [
      "Content-Type",
      "Content-MD5",
      "x-amz-content-sha256",
      "x-amz-date",
      "Authorization"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
</code></pre>

<p>Three fields are worth going through one at a time, because leaving each off breaks a specific thing that is not obvious from the error message.</p>

<h3>MaxAgeSeconds — how long, and for which URL</h3>
<pre><code class="language-text">MaxAgeSeconds: 3600  ⇒  the preflight response carries Access-Control-Max-Age: 3600
  The browser may reuse that answer for the SAME origin + URL (+ method/headers)
  until it expires or until the browser's own cap.

No Access-Control-Max-Age header:
  The Fetch standard's default is 5 seconds (measured below: same URL 0.3 s apart ⇒ 1 OPTIONS,
  6 s apart ⇒ 2 OPTIONS).

What it does NOT do:
  Three uploads = three presigned URLs = three preflights, Max-Age or not (measured below).
  A multipart upload from the browser presigns every part separately ⇒ expect one preflight per part.

Cost:
  R2's pricing page (updated 30/10/2026) lists the Class A and Class B operations;
  OPTIONS / preflight is not among them. The old claim "MaxAgeSeconds halves your Class A
  bill" has no source — and the per-URL cache key means it could not halve uploads anyway.
</code></pre>

<p>Browsers cap the value: Chromium at 7,200 s (2 hours), Firefox at 86,400 s (24 hours) (MDN); Cloudflare's R2 docs: &quot;Browsers may limit this to 2 hours or less, even if the maximum value (86400) is specified.&quot; Where Max-Age really helps: retries of the same URL, and repeated calls to fixed API routes — this repo's Express API sets <code>maxAge: 86400</code> (<code>src/index.ts:337</code>), which Chromium honours as 2 hours.</p>

<h3>AllowedHeaders — wildcard or explicit list?</h3>
<pre><code class="language-text">&quot;AllowedHeaders&quot;: [&quot;*&quot;]
  Measured (Garage): the preflight answers Access-Control-Allow-Headers: *
  and the second PUT to the same URL still skips the preflight — the wildcard
  does NOT disable caching (the old text said it did).
  Caveat: a literal * is not honoured when the request carries credentials.

&quot;AllowedHeaders&quot;: [&quot;content-type&quot;]
  Also cached. Prefer it anyway: it documents what your client really sends,
  and a new header (x-request-id from an interceptor) fails loudly in review
  instead of silently widening the policy (lesson 5.3).
</code></pre>

<h3>ExposeHeaders — what the client's JavaScript can see</h3>
<pre><code class="language-text">By default, cross-origin fetch()/XHR JS can read only 7 headers (CORS-safelisted):
  Cache-Control, Content-Language, Content-Length, Content-Type,
  Expires, Last-Modified, Pragma

Everything else — including the ETag S3/R2 returns on PUT — is
INVISIBLE to your JS unless you add it to ExposeHeaders.

Symptom of forgotten ExposeHeaders:
  Client PUT succeeds (200 OK).
  Client tries to record the returned ETag in your DB.
  fetch response.headers.get('etag') returns null.
  Client thinks the upload failed, retries. Duplicate uploads.

Fix:
  &quot;ExposeHeaders&quot;: [&quot;ETag&quot;]
  
  ETag is now readable to your JS after PUT. Also include
  &quot;x-amz-version-id&quot; if you use versioning.
</code></pre>

<h3>Credentials — test it, do not assume it</h3>
<pre><code class="language-text">If your fetch uses credentials: 'include' (sends cookies), the
CORS response MUST include Access-Control-Allow-Credentials: true
AND MUST NOT use * for AllowedOrigins.

R2 CORS policy has no &quot;Credentials&quot; field, and R2's CORS page
(23/09/2026) does not mention it. Measured on media.cuongthai.com (explicit
origins): the preflight carries NO Access-Control-Allow-Credentials.
Garage: none either. MinIO: always true, for any origin (lesson 5.1).

S3 CORS policy also has no &quot;Credentials&quot; field; per AWS docs it
sends Allow-Credentials when the matching origin is explicit (not measured here).

Symptom:
  fetch({credentials: 'include'}) fails with:
  &quot;The value of the 'Access-Control-Allow-Credentials' header in
   the response is '' which must be 'true' when the request's
   credentials mode is 'include'&quot;
   
Fix:
  1. Make AllowedOrigins explicit (not *), and
  2. Remove credentials: 'include' if you do not need it. Most
     R2/S3 PUTs authenticate via presigned URL, not cookies.
     credentials: 'include' is almost always a bug on browser
     upload code paths.
</code></pre>

<h3>Verify preflight caching worked</h3>
<p>Count on the server, not in your head: put a logging proxy in front of the bucket and look for OPTIONS lines. Then read the real preflight response — the config screen is not proof. Garage stores <code>MaxAgeSeconds</code> and does not send the header (measured below); the real media domain does:</p>
<div class="out">$ for o in https://cuongthai.com https://www.cuongthai.com http://localhost:3000; do curl -si -X OPTIONS -H "Origin: $o" -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type' https://media.cuongthai.com/&lt;một slide công khai&gt;; done
Origin: https://cuongthai.com
   HTTP/2 204 
   access-control-allow-methods: GET, PUT, POST, DELETE, HEAD
   access-control-max-age: 3600
   access-control-allow-origin: https://cuongthai.com
   access-control-allow-headers: content-type
Origin: https://www.cuongthai.com
   HTTP/2 204 
   access-control-allow-methods: GET, PUT, POST, DELETE, HEAD
   access-control-max-age: 3600
   access-control-allow-origin: https://www.cuongthai.com
   access-control-allow-headers: content-type
Origin: http://localhost:3000
   HTTP/2 403 </div>

<div class="pitfall">
<p><strong>Trap — trusting the config instead of the response.</strong> A policy can say <code>MaxAgeSeconds: 3600</code> while the server sends no <code>Access-Control-Max-Age</code> (Garage v2.1.0, measured). And <code>AllowedHeaders: [&quot;*&quot;]</code> did not stop caching in the measurement — keep an explicit list for clarity, not for caching.</p>
</div>

<div class="pitfall">
<p><strong>Trap — expecting the browser to cache longer than its own maximum.</strong> Setting <code>MaxAgeSeconds: 86400</code> looks right in the CORS config but Chrome caps at 7200. Test in the browser you actually target; do not measure from a curl (curl has no preflight cache).</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A browser upload to R2/S3 always preflights; the browser caches the answer per origin <em>and URL</em> for <code>Access-Control-Max-Age</code> seconds (5 s without it, capped at 2 h in Chromium), so fresh presigned URLs always pay their own preflight — list <code>ETag</code> in <code>ExposeHeaders</code>, never send cookies with a presigned PUT, and remember that revoking an origin is not instant.</p>
</div>

<h3>What decides whether a preflight happens at all</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A simple request skips it</span><span class="lz-d"><code>GET</code> or <code>POST</code> with only safelisted headers and a form-ish content type. The browser sends it straight out.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Anything else triggers an OPTIONS first</span><span class="lz-d">A <code>PUT</code>, a custom header, or <code>Content-Type: application/json</code> — which is why an upload always preflights and a plain image fetch never does.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">MaxAgeSeconds caches the answer</span><span class="lz-d">Without it the answer lives 5 seconds. With it, retries of the <em>same URL</em> skip the OPTIONS — but every new presigned URL still preflights.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">ExposeHeaders decides what JavaScript can read</span><span class="lz-d">The response arrives with <code>ETag</code> either way; without listing it, the browser hides it from your code and the verification step reads <code>undefined</code>.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Set the bucket CORS policy with explicit <code>AllowedHeaders</code> (Content-Type, x-amz-content-sha256, x-amz-date, Authorization), <code>ExposeHeaders: ["ETag"]</code> and <code>MaxAgeSeconds: 3600</code>.</li>
<li>In the browser, do two PUTs in a row from the same origin. Do it twice: to the <em>same</em> presigned URL (one OPTIONS) and to two <em>different</em> presigned URLs (two OPTIONS) — count on the server.</li>
<li>After a PUT, read <code>res.headers.get('etag')</code>. With ExposeHeaders set it returns the value; remove ExposeHeaders, hard-refresh, and it returns <code>null</code>.</li>
<li>Change <code>AllowedHeaders</code> to <code>["*"]</code> and repeat the same-URL test: the second PUT still skips its preflight (measured) — the wildcard does not defeat caching.</li>
<li>Inspect the OPTIONS response from the shell and find the cache directive: <code>curl -X OPTIONS -H 'Origin: https://cuongthai.com' -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type' -I "$BUCKET_URL/some-key"</code> → look for <code>Access-Control-Max-Age: 3600</code>.</li>
</ol>
<p><strong>Done when:</strong> you watched the second PUT skip its preflight with <code>MaxAgeSeconds</code> set, and saw <code>ETag</code> flip between a value and <code>null</code> as you toggle <code>ExposeHeaders</code>.</p></div>

<h3>🔬 Measured: what the server receives</h3>
<p>Lab: Garage v2.1.0 behind a proxy that logs every request the server really receives, a page on <code>http://cuongthai.localhost:20230</code> (allowed origin), a real Chromium through Playwright. Nothing touches the real bucket. Which requests preflight:</p>
<div class="out">$ chromium "…/?thu=get"         # GET bằng URL ký sẵn, không header thêm
trang: #1 GET ⇒ HTTP 200 (10 ms)
$ chromium "…/?thu=post-text"   # POST, Content-Type: text/plain
trang: #1 POST-TEXT ⇒ HTTP 400 (13 ms)
$ chromium "…/?thu=post-json"   # POST, Content-Type: application/json
trang: #1 POST-JSON ⇒ TypeError: Failed to fetch
$ chromium "…/?thu=put"         # PUT, Content-Type: image/jpeg (tải ảnh lên)
trang: #1 PUT ⇒ HTTP 200 (9 ms)
$ cat dem.log
GET     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
──
POST    /media-ch5/                                  Origin: http://cuongthai.localhost:20230 ⇒ 400
──
OPTIONS /media-ch5/                                  Origin: http://cuongthai.localhost:20230 ⇒ 403
──
OPTIONS /media-ch5/anh/u42/1794647420865-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794647420865-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p>No <code>Access-Control-Max-Age</code>: same URL 0.3 s apart, then 6 s apart.</p>
<div class="out">$ chromium "…/?thu=put&amp;cung=1&amp;n=2&amp;cach=300"     # cùng MỘT URL, hai PUT cách nhau 0,3 giây
trang: #1 PUT ⇒ HTTP 200 (8 ms)
trang: #2 PUT ⇒ HTTP 200 (6 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
$ chromium "…/?thu=put&amp;cung=1&amp;n=2&amp;cach=6000"    # cùng MỘT URL, hai PUT cách nhau 6 giây
trang: #1 PUT ⇒ HTTP 200 (8 ms)
trang: #2 PUT ⇒ HTTP 200 (9 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p>Garage stores <code>MaxAgeSeconds</code> but sends no header:</p>
<div class="out">$ aws s3api get-bucket-cors --bucket media-ch5 --query 'CORSRules[0].MaxAgeSeconds'
3600
$ curl -si -X OPTIONS -H 'Origin: http://cuongthai.localhost:20230' -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type' localhost:20220/media-ch5/a.jpg | grep -i '^access-control'
access-control-allow-origin: http://cuongthai.localhost:20230
access-control-allow-methods: PUT, GET, HEAD
access-control-allow-headers: content-type
access-control-expose-headers: ETag
(dòng max-age: 0)</div>
<p>So the proxy adds <code>Access-Control-Max-Age: 600</code>, as S3/R2 do. Same URL 6 s apart, then three uploads with three presigned URLs:</p>
<div class="out">$ curl -si -X OPTIONS … localhost:20221/media-ch5/a.jpg | grep -i max-age
access-control-max-age: 600
$ chromium "…/?thu=put&amp;cung=1&amp;n=2&amp;cach=6000"    # cùng MỘT URL, cách 6 giây
trang: #1 PUT ⇒ HTTP 200 (10 ms)
trang: #2 PUT ⇒ HTTP 200 (7 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
$ chromium "…/?thu=put&amp;n=3&amp;cach=6000"           # BA ảnh = BA URL ký sẵn khác nhau (đúng cách ứng dụng thật tải lên)
trang: #1 PUT ⇒ HTTP 200 (9 ms)
trang: #2 PUT ⇒ HTTP 200 (9 ms)
trang: #3 PUT ⇒ HTTP 200 (9 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794647450694-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794647450694-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
OPTIONS /media-ch5/anh/u42/1794647456714-2.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794647456714-2.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
OPTIONS /media-ch5/anh/u42/1794647462727-3.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794647462727-3.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p><code>AllowedHeaders: ["*"]</code> — still cached:</p>
<div class="out">$ aws s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p3.json   # AllowedHeaders: ["*"]
đã đặt
$ curl -si -X OPTIONS … -H 'Access-Control-Request-Headers: content-type,x-request-id' … | grep -i allow-headers
access-control-allow-headers: *
access-control-max-age: 600
$ chromium "…/?thu=put&amp;cung=1&amp;n=2&amp;cach=6000"    # cùng MỘT URL, cách 6 giây, AllowedHeaders "*"
trang: #1 PUT ⇒ HTTP 200 (8 ms)
trang: #2 PUT ⇒ HTTP 200 (7 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p><code>ExposeHeaders</code> off, then on — the server sends the ETag either way (curl sees it); only JavaScript is blocked from reading it:</p>
<div class="out">$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p4.json &amp;&amp; echo "đã đặt (KHÔNG có ExposeHeaders)"
đã đặt (KHÔNG có ExposeHeaders)
$ chromium "…/?thu=put&amp;doc=all"
trang: #1 PUT ⇒ HTTP 200 (9 ms)
trang:    JS đọc headers.get('etag') = null
trang:    JS đọc headers.get('content-length') = "0"
trang:    JS đọc headers.get('content-type') = null
trang:    JS đọc headers.get('last-modified') = null
trang:    JS đọc headers.get('x-amz-request-id') = null
trang:    JS đọc headers.get('date') = null
$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p1.json &amp;&amp; echo "đã đặt (ExposeHeaders: ETag)"
đã đặt (ExposeHeaders: ETag)
$ chromium "…/?thu=put&amp;doc=all"
trang: #1 PUT ⇒ HTTP 200 (6 ms)
trang:    JS đọc headers.get('etag') = "\\"72a3c202147228463777208e7f224823\\""
trang:    JS đọc headers.get('content-length') = "0"
trang:    JS đọc headers.get('content-type') = null
trang:    JS đọc headers.get('last-modified') = null
trang:    JS đọc headers.get('x-amz-request-id') = null
trang:    JS đọc headers.get('date') = null
$ curl -s -D - -o /dev/null -X PUT -H 'Content-Type: image/jpeg' --data anh "$(presign)" | grep -iE '^etag|^x-amz-request-id|^date'
etag: "5febda3d0ef90737a60de2fd7c6d7728"
date: Sat, 14 Nov 2026 09:11:23 GMT</div>
<p><code>credentials: 'include'</code> on a presigned PUT — the exact error:</p>
<div class="out">$ chromium "…/?thu=put&amp;cred=1"
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ curl -si -X OPTIONS … | grep -ci allow-credentials      # Garage có gửi Allow-Credentials không?
0</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>Real life:</strong> the duplicate-upload bug in the old text is real-world common — a client that treats <code>etag === null</code> as failure retries and stores the file twice. Read the ETag only after adding it to <code>ExposeHeaders</code>, or verify on the server (this repo's <code>/files/upload/presign-r2/complete</code> does a HEAD on the server).</li>
<li><strong>What if you revoke an origin while browsers still remember the preflight?</strong> Measured: the policy drops the origin at second 3; the second PUT still goes out and the server stores it (200); only reading the reply fails.</li>
</ul>
<div class="out">$ (sleep 3; aws s3api put-bucket-cors … file://p5.json; echo "── giây 3: GỠ origin cuongthai khỏi chính sách") &amp; chromium "…/?thu=put&amp;cung=1&amp;n=2&amp;cach=6000"
trang: #1 PUT ⇒ HTTP 200 (28 ms)
trang:    JS đọc headers.get('etag') = "\\"72a3c202147228463777208e7f224823\\""
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #2 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
── giây 3: GỠ origin cuongthai khỏi chính sách
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<ul>
<li><strong>The attacker's view:</strong> a page you stop trusting keeps uploading until its cached preflight expires — and with curl it never needed CORS anyway. CORS is not a kill switch: stop signing URLs for that user on the server, keep expiries short, and keep Max-Age modest on upload buckets.</li>
</ul>
<h3>🔁 Run it yourself</h3>
<p>Put a 20-line Node proxy in front of your bucket that appends <code>method · path · Origin ⇒ status</code> to a file. From a page, PUT twice to one presigned URL and once each to two new URLs, with and without <code>Access-Control-Max-Age</code>; count OPTIONS lines. Remove <code>ExposeHeaders</code> and print <code>res.headers.get('etag')</code>.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🛰</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Headers that change behaviour: caching, compression, CORS, security</span><span class="lc-sub">Where Access-Control-* sits among the other behaviour headers</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-6-4-cors" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">API Design · 6.4 — CORS, CSRF and browsers: measured in a real Chromium</span><span class="lc-sub">Credentials, cookies, and why CORS is not CSRF protection</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Simple request</span><span class="v">GET/HEAD/POST with only safelisted headers and a form content type — no preflight.</span></div>
  <div class="kv"><span class="k">MaxAgeSeconds</span><span class="v">CORS field = <code>Access-Control-Max-Age</code>; how long the browser caches the preflight (browser-capped).</span></div>
  <div class="kv"><span class="k">ExposeHeaders</span><span class="v">Lists response headers (e.g. ETag) that cross-origin JS is allowed to read.</span></div>
  <div class="kv"><span class="k">Preflight cache key</span><span class="v">Origin + full URL (+ method/headers): a new presigned URL is a new preflight.</span></div>
  <div class="kv"><span class="k">AllowedHeaders wildcard</span><span class="v"><code>["*"]</code> works and is still cached (measured); not honoured with credentials. An explicit list documents your client.</span></div>
  <div class="kv"><span class="k">Allow-Credentials</span><span class="v">Must be true (and origin explicit, not <code>*</code>) for <code>credentials: 'include'</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Every browser PUT to R2/S3 preflights; the browser can only remember the answer.</li><li>The memory is keyed by origin <em>and URL</em>: Max-Age helps retries of the same URL, not new presigned URLs (3 uploads = 3 OPTIONS, measured).</li><li>No <code>Access-Control-Max-Age</code> ⇒ 5 s; Chromium caps at 2 h. Check the real response — a stored <code>MaxAgeSeconds</code> may not be sent.</li><li><code>ExposeHeaders</code> decides what JS can read — forget <code>ETag</code> and your code reads <code>null</code>.</li><li><code>credentials: 'include'</code> is almost always a bug on a presigned upload; revoking an origin is not instant.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CORS preflight</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests — what triggers, what caches.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Access-Control-Max-Age</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age — per-browser caps.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — CORS reference</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/cors — the exact fields R2 accepts.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Cache preflight, credentials, và expose-headers</h2>
<p class="lead">Bài 5.1 bao trường hợp &quot;tải lên hỏng vì lỗi CORS&quot;. Giờ: tải lên chạy được, và mỗi PUT có một preflight OPTIONS đi trước. Trình duyệt có nhớ câu trả lời không? Có — trong một lúc, và nhớ theo origin <em>và URL</em>. Chi tiết cuối đó quyết định <code>MaxAgeSeconds</code> tiết kiệm được gì, đo bên dưới trong Chromium thật với một máy đếm ghi mọi request máy chủ nhận.</p>

<h3>Cái gì trigger preflight ngay từ đầu</h3>
<pre><code class="language-text">Request là &quot;simple&quot; (không preflight) nếu TẤT các cái sau đúng:
  Method:  GET, HEAD, hoặc POST
  Content-Type: text/plain, application/x-www-form-urlencoded, hoặc multipart/form-data
  Không header custom ngoài list nhỏ được phép
  
Bất cứ gì ngoài list đó ép preflight OPTIONS.

Cho upload style S3, PUT với Content-Type: image/jpeg KHÔNG
simple. Cũng vậy với bất kỳ request mang x-amz-content-sha256 hoặc
tương tự. Nên browser upload tới R2/S3 LUÔN preflight.
</code></pre>

<p>Bạn không tránh được preflight cho PUT tới R2. Trình duyệt có thể nhớ câu trả lời preflight — nhưng khoá của bộ nhớ là origin <strong>cộng nguyên URL</strong> (và phương thức, header đã hỏi). Mỗi URL ký sẵn là một URL mới, nên mỗi lần tải mới là một preflight mới (đo bên dưới).</p>

<h3>Ba field mà hầu hết mọi người bỏ</h3>
<pre><code class="language-json">[
  {
    "AllowedOrigins": ["https://cuongthai.com"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
    "AllowedHeaders": [
      "Content-Type",
      "Content-MD5",
      "x-amz-content-sha256",
      "x-amz-date",
      "Authorization"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
</code></pre>

<p>Ba field đáng đi qua từng cái một, vì bỏ mỗi cái vỡ một thứ cụ thể mà không hiển nhiên từ error message.</p>

<h3>MaxAgeSeconds — nhớ bao lâu, và nhớ cho URL nào</h3>
<pre><code class="language-text">MaxAgeSeconds: 3600  ⇒  câu trả lời preflight mang Access-Control-Max-Age: 3600
  Trình duyệt được dùng lại câu trả lời đó cho CÙNG origin + URL (+ phương thức/header)
  tới khi hết hạn hoặc chạm trần của trình duyệt.

Không có header Access-Control-Max-Age:
  Mặc định của chuẩn Fetch là 5 giây (đo bên dưới: cùng URL cách 0,3 giây ⇒ 1 OPTIONS,
  cách 6 giây ⇒ 2 OPTIONS).

Điều nó KHÔNG làm được:
  Ba lần tải = ba URL ký sẵn = ba preflight, có Max-Age hay không (đo bên dưới).
  Multipart từ trình duyệt ký riêng từng phần ⇒ tính ra mỗi phần một preflight.

Chi phí:
  Bảng giá R2 (cập nhật 30/10/2026) liệt kê thao tác Class A và Class B;
  OPTIONS / preflight không có trong đó. Câu cũ "MaxAgeSeconds chia đôi bill Class A"
  không có nguồn — và khoá theo URL nghĩa là nó cũng không thể chia đôi số lần tải lên.
</code></pre>

<p>Trình duyệt đặt trần: Chromium 7.200 giây (2 giờ), Firefox 86.400 giây (24 giờ) (MDN); tài liệu R2: &quot;Browsers may limit this to 2 hours or less, even if the maximum value (86400) is specified.&quot; Max-Age thật sự có ích khi: thử lại cùng URL, và gọi lặp các route cố định của API — API Express của kho đặt <code>maxAge: 86400</code> (<code>src/index.ts:337</code>), Chromium chỉ dùng 2 giờ.</p>

<h3>AllowedHeaders — dấu sao hay danh sách rõ ràng?</h3>
<pre><code class="language-text">&quot;AllowedHeaders&quot;: [&quot;*&quot;]
  Đo (Garage): preflight trả Access-Control-Allow-Headers: *
  và PUT thứ hai cùng URL vẫn KHÔNG preflight — dấu sao KHÔNG phá cache
  (bài cũ nói có).
  Lưu ý: dấu sao không được tính khi request mang credentials.

&quot;AllowedHeaders&quot;: [&quot;content-type&quot;]
  Cũng được nhớ. Vẫn nên dùng: nó ghi rõ client thật sự gửi gì, và một header
  mới (x-request-id từ interceptor) hỏng ngay để người review thấy, thay vì
  âm thầm nới chính sách (bài 5.3).
</code></pre>

<h3>ExposeHeaders — cái JS client thấy được</h3>
<pre><code class="language-text">Mặc định, fetch()/XHR cross-origin JS đọc được chỉ 7 header (CORS-safelisted):
  Cache-Control, Content-Language, Content-Length, Content-Type,
  Expires, Last-Modified, Pragma

Mọi cái khác — bao gồm ETag S3/R2 trả trên PUT — là
VÔ HÌNH với JS của bạn trừ khi bạn thêm vào ExposeHeaders.

Triệu của ExposeHeaders bị quên:
  Client PUT thành (200 OK).
  Client thử ghi ETag trả về vào DB.
  fetch response.headers.get('etag') trả null.
  Client nghĩ upload fail, retry. Upload trùng.

Vá:
  &quot;ExposeHeaders&quot;: [&quot;ETag&quot;]
  
  ETag giờ đọc được cho JS sau PUT. Cũng include
  &quot;x-amz-version-id&quot; nếu bạn dùng versioning.
</code></pre>

<h3>Credentials — kiểm thật, đừng đoán</h3>
<pre><code class="language-text">Nếu fetch dùng credentials: 'include' (gửi cookie), response
CORS PHẢI include Access-Control-Allow-Credentials: true
VÀ KHÔNG được dùng * cho AllowedOrigins.

CORS policy R2 không có field &quot;Credentials&quot;, và trang CORS của R2
(23/09/2026) không nhắc tới. Đo trên media.cuongthai.com (origin ghi rõ):
preflight KHÔNG có Access-Control-Allow-Credentials.
Garage: cũng không. MinIO: luôn true, với mọi origin (bài 5.1).

CORS policy S3 cũng không có field &quot;Credentials&quot; explicit. S3
xử qua AllowedOrigins là explicit.

Triệu:
  fetch({credentials: 'include'}) fail với:
  &quot;The value of the 'Access-Control-Allow-Credentials' header in
   the response is '' which must be 'true' when the request's
   credentials mode is 'include'&quot;
   
Vá:
  1. Làm AllowedOrigins explicit (không *), và
  2. Gỡ credentials: 'include' nếu không cần. Hầu hết
     PUT R2/S3 auth qua presigned URL, không cookie.
     credentials: 'include' gần như luôn là bug trên code
     path browser upload.
</code></pre>

<h3>Kiểm cache preflight có chạy không</h3>
<p>Đếm trên máy chủ, đừng đếm trong đầu: đặt một proxy ghi log trước bucket và tìm dòng OPTIONS. Rồi đọc câu trả lời preflight thật — màn hình cấu hình không phải bằng chứng. Garage lưu <code>MaxAgeSeconds</code> mà không gửi header (đo bên dưới); tên miền media thật thì có:</p>
<div class="out">$ for o in https://cuongthai.com https://www.cuongthai.com http://localhost:3000; do curl -si -X OPTIONS -H "Origin: $o" -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type' https://media.cuongthai.com/&lt;một slide công khai&gt;; done
Origin: https://cuongthai.com
   HTTP/2 204 
   access-control-allow-methods: GET, PUT, POST, DELETE, HEAD
   access-control-max-age: 3600
   access-control-allow-origin: https://cuongthai.com
   access-control-allow-headers: content-type
Origin: https://www.cuongthai.com
   HTTP/2 204 
   access-control-allow-methods: GET, PUT, POST, DELETE, HEAD
   access-control-max-age: 3600
   access-control-allow-origin: https://www.cuongthai.com
   access-control-allow-headers: content-type
Origin: http://localhost:3000
   HTTP/2 403 </div>

<div class="pitfall">
<p><strong>Bẫy — tin cấu hình thay vì câu trả lời.</strong> Chính sách có thể ghi <code>MaxAgeSeconds: 3600</code> mà máy chủ không gửi <code>Access-Control-Max-Age</code> (Garage v2.1.0, đo). Còn <code>AllowedHeaders: [&quot;*&quot;]</code> không làm mất cache trong phép đo — giữ danh sách rõ ràng vì dễ đọc, không phải vì cache.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — mong browser cache lâu hơn max của chính nó.</strong> Set <code>MaxAgeSeconds: 86400</code> trông đúng trong config CORS nhưng Chrome cap ở 7200. Test trong browser bạn thực sự target; đừng đo từ curl (curl không có cache preflight).</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Tải lên từ trình duyệt tới R2/S3 luôn có preflight; trình duyệt nhớ câu trả lời theo origin <em>và URL</em> trong <code>Access-Control-Max-Age</code> giây (không có thì 5 giây, Chromium trần 2 giờ), nên URL ký sẵn mới luôn trả preflight riêng — ghi <code>ETag</code> vào <code>ExposeHeaders</code>, không gửi cookie với PUT ký sẵn, và nhớ rằng gỡ một origin không có hiệu lực ngay.</p>
</div>

<h3>Cái gì quyết định có xảy ra preflight hay không</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một request đơn giản thì bỏ qua nó</span><span class="lz-d"><code>GET</code> hoặc <code>POST</code> chỉ với các header trong danh sách an toàn và một content type kiểu form. Trình duyệt gửi thẳng đi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Còn lại đều kích hoạt một OPTIONS trước</span><span class="lz-d">Một <code>PUT</code>, một header tự đặt, hay <code>Content-Type: application/json</code> — đó là lý do một lần tải lên luôn có preflight còn một lần lấy ảnh thường thì không bao giờ.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">MaxAgeSeconds nhớ đệm câu trả lời</span><span class="lz-d">Không có nó, câu trả lời sống 5 giây. Có nó, thử lại <em>cùng URL</em> thì bỏ qua OPTIONS — nhưng mỗi URL ký sẵn mới vẫn preflight.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">ExposeHeaders quyết định JavaScript đọc được gì</span><span class="lz-d">Phản hồi kiểu gì cũng mang theo <code>ETag</code>; nhưng không liệt kê nó ra thì trình duyệt giấu nó khỏi mã của bạn và bước xác minh đọc ra <code>undefined</code>.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Đặt CORS policy của bucket với <code>AllowedHeaders</code> explicit (Content-Type, x-amz-content-sha256, x-amz-date, Authorization), <code>ExposeHeaders: ["ETag"]</code> và <code>MaxAgeSeconds: 3600</code>.</li>
<li>Trong browser, làm hai PUT liên tiếp từ cùng origin. Làm hai lần: vào <em>cùng</em> một URL ký sẵn (một OPTIONS) và vào hai URL ký sẵn <em>khác nhau</em> (hai OPTIONS) — đếm trên máy chủ.</li>
<li>Sau một PUT, đọc <code>res.headers.get('etag')</code>. Có ExposeHeaders thì trả giá trị; bỏ ExposeHeaders, hard-refresh, nó trả <code>null</code>.</li>
<li>Đổi <code>AllowedHeaders</code> thành <code>["*"]</code> và lặp lại phép thử cùng URL: PUT thứ hai vẫn không preflight (đo) — dấu sao không phá cache.</li>
<li>Soi response OPTIONS bằng shell và tìm directive cache: <code>curl -X OPTIONS -H 'Origin: https://cuongthai.com' -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type' -I "$BUCKET_URL/some-key"</code> → tìm <code>Access-Control-Max-Age: 3600</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn thấy PUT thứ hai bỏ qua preflight khi có <code>MaxAgeSeconds</code>, và thấy <code>ETag</code> lật giữa một giá trị và <code>null</code> khi bật/tắt <code>ExposeHeaders</code>.</p></div>

<h3>🔬 Đo thật: máy chủ nhận được gì</h3>
<p>Lab: Garage v2.1.0 sau một proxy ghi lại mọi request máy chủ thật sự nhận, một trang ở <code>http://cuongthai.localhost:20230</code> (origin được phép), Chromium thật qua Playwright. Không lệnh nào chạm bucket thật. Request nào có preflight:</p>
<div class="out">$ chromium "…/?thu=get"         # GET bằng URL ký sẵn, không header thêm
trang: #1 GET ⇒ HTTP 200 (10 ms)
$ chromium "…/?thu=post-text"   # POST, Content-Type: text/plain
trang: #1 POST-TEXT ⇒ HTTP 400 (13 ms)
$ chromium "…/?thu=post-json"   # POST, Content-Type: application/json
trang: #1 POST-JSON ⇒ TypeError: Failed to fetch
$ chromium "…/?thu=put"         # PUT, Content-Type: image/jpeg (tải ảnh lên)
trang: #1 PUT ⇒ HTTP 200 (9 ms)
$ cat dem.log
GET     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
──
POST    /media-ch5/                                  Origin: http://cuongthai.localhost:20230 ⇒ 400
──
OPTIONS /media-ch5/                                  Origin: http://cuongthai.localhost:20230 ⇒ 403
──
OPTIONS /media-ch5/anh/u42/1794647420865-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794647420865-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p>Không có <code>Access-Control-Max-Age</code>: cùng URL cách 0,3 giây, rồi cách 6 giây.</p>
<div class="out">$ chromium "…/?thu=put&amp;cung=1&amp;n=2&amp;cach=300"     # cùng MỘT URL, hai PUT cách nhau 0,3 giây
trang: #1 PUT ⇒ HTTP 200 (8 ms)
trang: #2 PUT ⇒ HTTP 200 (6 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
$ chromium "…/?thu=put&amp;cung=1&amp;n=2&amp;cach=6000"    # cùng MỘT URL, hai PUT cách nhau 6 giây
trang: #1 PUT ⇒ HTTP 200 (8 ms)
trang: #2 PUT ⇒ HTTP 200 (9 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p>Garage lưu <code>MaxAgeSeconds</code> nhưng không gửi header:</p>
<div class="out">$ aws s3api get-bucket-cors --bucket media-ch5 --query 'CORSRules[0].MaxAgeSeconds'
3600
$ curl -si -X OPTIONS -H 'Origin: http://cuongthai.localhost:20230' -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type' localhost:20220/media-ch5/a.jpg | grep -i '^access-control'
access-control-allow-origin: http://cuongthai.localhost:20230
access-control-allow-methods: PUT, GET, HEAD
access-control-allow-headers: content-type
access-control-expose-headers: ETag
(dòng max-age: 0)</div>
<p>Nên máy đếm tự thêm <code>Access-Control-Max-Age: 600</code>, như S3/R2 gửi. Cùng URL cách 6 giây, rồi ba lần tải với ba URL ký sẵn:</p>
<div class="out">$ curl -si -X OPTIONS … localhost:20221/media-ch5/a.jpg | grep -i max-age
access-control-max-age: 600
$ chromium "…/?thu=put&amp;cung=1&amp;n=2&amp;cach=6000"    # cùng MỘT URL, cách 6 giây
trang: #1 PUT ⇒ HTTP 200 (10 ms)
trang: #2 PUT ⇒ HTTP 200 (7 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
$ chromium "…/?thu=put&amp;n=3&amp;cach=6000"           # BA ảnh = BA URL ký sẵn khác nhau (đúng cách ứng dụng thật tải lên)
trang: #1 PUT ⇒ HTTP 200 (9 ms)
trang: #2 PUT ⇒ HTTP 200 (9 ms)
trang: #3 PUT ⇒ HTTP 200 (9 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794647450694-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794647450694-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
OPTIONS /media-ch5/anh/u42/1794647456714-2.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794647456714-2.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
OPTIONS /media-ch5/anh/u42/1794647462727-3.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794647462727-3.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p><code>AllowedHeaders: ["*"]</code> — vẫn được nhớ:</p>
<div class="out">$ aws s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p3.json   # AllowedHeaders: ["*"]
đã đặt
$ curl -si -X OPTIONS … -H 'Access-Control-Request-Headers: content-type,x-request-id' … | grep -i allow-headers
access-control-allow-headers: *
access-control-max-age: 600
$ chromium "…/?thu=put&amp;cung=1&amp;n=2&amp;cach=6000"    # cùng MỘT URL, cách 6 giây, AllowedHeaders "*"
trang: #1 PUT ⇒ HTTP 200 (8 ms)
trang: #2 PUT ⇒ HTTP 200 (7 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p>Tắt rồi bật <code>ExposeHeaders</code> — máy chủ gửi ETag cả hai lần (curl thấy); chỉ JavaScript bị chặn đọc:</p>
<div class="out">$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p4.json &amp;&amp; echo "đã đặt (KHÔNG có ExposeHeaders)"
đã đặt (KHÔNG có ExposeHeaders)
$ chromium "…/?thu=put&amp;doc=all"
trang: #1 PUT ⇒ HTTP 200 (9 ms)
trang:    JS đọc headers.get('etag') = null
trang:    JS đọc headers.get('content-length') = "0"
trang:    JS đọc headers.get('content-type') = null
trang:    JS đọc headers.get('last-modified') = null
trang:    JS đọc headers.get('x-amz-request-id') = null
trang:    JS đọc headers.get('date') = null
$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p1.json &amp;&amp; echo "đã đặt (ExposeHeaders: ETag)"
đã đặt (ExposeHeaders: ETag)
$ chromium "…/?thu=put&amp;doc=all"
trang: #1 PUT ⇒ HTTP 200 (6 ms)
trang:    JS đọc headers.get('etag') = "\\"72a3c202147228463777208e7f224823\\""
trang:    JS đọc headers.get('content-length') = "0"
trang:    JS đọc headers.get('content-type') = null
trang:    JS đọc headers.get('last-modified') = null
trang:    JS đọc headers.get('x-amz-request-id') = null
trang:    JS đọc headers.get('date') = null
$ curl -s -D - -o /dev/null -X PUT -H 'Content-Type: image/jpeg' --data anh "$(presign)" | grep -iE '^etag|^x-amz-request-id|^date'
etag: "5febda3d0ef90737a60de2fd7c6d7728"
date: Sat, 14 Nov 2026 09:11:23 GMT</div>
<p><code>credentials: 'include'</code> trên PUT ký sẵn — thông báo lỗi nguyên văn:</p>
<div class="out">$ chromium "…/?thu=put&amp;cred=1"
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ curl -si -X OPTIONS … | grep -ci allow-credentials      # Garage có gửi Allow-Credentials không?
0</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Đời thật:</strong> lỗi tải trùng mà bài cũ kể là chuyện hay gặp — client coi <code>etag === null</code> là hỏng, thử lại, và lưu tệp hai lần. Chỉ đọc ETag sau khi thêm vào <code>ExposeHeaders</code>, hoặc kiểm ở máy chủ (route <code>/files/upload/presign-r2/complete</code> của kho tự HEAD ở máy chủ).</li>
<li><strong>Nếu gỡ một origin trong lúc trình duyệt còn nhớ preflight thì sao?</strong> Đo: chính sách gỡ origin ở giây thứ 3; PUT thứ hai vẫn đi và máy chủ lưu (200); chỉ việc đọc câu trả lời hỏng.</li>
</ul>
<div class="out">$ (sleep 3; aws s3api put-bucket-cors … file://p5.json; echo "── giây 3: GỠ origin cuongthai khỏi chính sách") &amp; chromium "…/?thu=put&amp;cung=1&amp;n=2&amp;cach=6000"
trang: #1 PUT ⇒ HTTP 200 (28 ms)
trang:    JS đọc headers.get('etag') = "\\"72a3c202147228463777208e7f224823\\""
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #2 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200
── giây 3: GỠ origin cuongthai khỏi chính sách
PUT     /media-ch5/anh/u42/mot.jpg?…(đã ký)          Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<ul>
<li><strong>Góc kẻ xấu:</strong> một trang bạn thôi tin vẫn tải lên được tới khi preflight nhớ trong trình duyệt hết hạn — mà dùng curl thì chưa bao giờ cần CORS. CORS không phải công tắc khẩn cấp: ngừng ký URL cho người đó ở máy chủ, giữ hạn ngắn, và đặt Max-Age vừa phải cho bucket nhận tải lên.</li>
</ul>
<h3>🔁 Tự chạy lại</h3>
<p>Đặt một proxy Node 20 dòng trước bucket, ghi <code>phương thức · đường dẫn · Origin ⇒ mã</code> vào tệp. Từ một trang, PUT hai lần vào một URL ký sẵn và mỗi URL mới một lần, có và không có <code>Access-Control-Max-Age</code>; đếm dòng OPTIONS. Bỏ <code>ExposeHeaders</code> rồi in <code>res.headers.get('etag')</code>.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🛰</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Các header đổi hành vi: cache, nén, CORS, bảo mật</span><span class="lc-sub">Access-Control-* đứng ở đâu giữa các header đổi hành vi</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-6-4-cors" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">API Design · 6.4 — CORS, CSRF và trình duyệt: đo trong Chromium thật</span><span class="lc-sub">Credentials, cookie, và vì sao CORS không chống CSRF</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Simple request</span><span class="v">GET/HEAD/POST chỉ với header an toàn và content type kiểu form — không preflight.</span></div>
  <div class="kv"><span class="k">MaxAgeSeconds</span><span class="v">Field CORS = <code>Access-Control-Max-Age</code>; browser cache preflight bao lâu (bị cap theo browser).</span></div>
  <div class="kv"><span class="k">ExposeHeaders</span><span class="v">Liệt kê header response (vd ETag) mà JS khác origin được phép đọc.</span></div>
  <div class="kv"><span class="k">Khoá bộ nhớ preflight</span><span class="v">Origin + nguyên URL (+ phương thức/header): URL ký sẵn mới là preflight mới.</span></div>
  <div class="kv"><span class="k">AllowedHeaders wildcard</span><span class="v"><code>["*"]</code> chạy được và vẫn được nhớ (đo); không áp khi có credentials. Danh sách rõ ràng ghi lại client gửi gì.</span></div>
  <div class="kv"><span class="k">Allow-Credentials</span><span class="v">Phải true (và origin explicit, không <code>*</code>) cho <code>credentials: 'include'</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Mọi PUT từ trình duyệt tới R2/S3 đều preflight; trình duyệt chỉ có thể nhớ câu trả lời.</li><li>Bộ nhớ theo origin <em>và URL</em>: Max-Age giúp thử lại cùng URL, không giúp URL ký sẵn mới (3 lần tải = 3 OPTIONS, đo).</li><li>Không có <code>Access-Control-Max-Age</code> ⇒ 5 giây; Chromium trần 2 giờ. Kiểm câu trả lời thật — <code>MaxAgeSeconds</code> đã lưu chưa chắc được gửi.</li><li><code>ExposeHeaders</code> quyết định JS đọc được gì — quên <code>ETag</code> thì mã đọc ra <code>null</code>.</li><li><code>credentials: 'include'</code> gần như luôn là bug trên đường tải lên ký sẵn; gỡ origin không có hiệu lực ngay.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CORS preflight</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests — cái gì trigger, cái gì cache.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Access-Control-Max-Age</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age — cap per-browser.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — CORS reference</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/cors — field chính xác R2 nhận.</span></span></div>
</div>
`,
    },


    {
      title: '5.3 — Common CORS bugs: the four patterns that keep repeating|||5.3 — Bug CORS phổ biến: bốn pattern lặp mãi',
      slug: 'os-5-3-common-bugs',
      type: 'VIDEO',
      description: 'Every CORS incident is one of four archetypes. Pattern-match the symptom, name the archetype, apply the fix — no more staring at the console error.',
      content: `
${G05_3}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Common CORS bugs: the four patterns that keep repeating</h2>
<p class="lead">Every CORS bug people file feels new. It rarely is. Across dozens of R2 and S3 deployments, four patterns explain almost every incident. Learning to match a symptom to its pattern turns a mystery into a fix in under 60 seconds.</p>

<h3>The four archetypes at a glance</h3>
<pre><code class="language-text">Archetype                    Symptom                         Fix
──────────────────────────  ──────────────────────────────  ──────────────────
1. Origin mismatch           Works on cuongthai.com,          Add www variant (or
                             fails on www.cuongthai.com       vice versa) to
                             — or vice versa.                  AllowedOrigins.

2. Method not allowed        GET works, PUT fails             Add PUT to
                             immediately with CORS error.     AllowedMethods.

3. Header not allowed        Custom header added in code      Add the exact header
                             (e.g. x-app-version) triggers    name to AllowedHeaders
                             CORS block on preflight.         (case-insensitive).

4. Response header invisible ETag / Location returned but     Add the header name
                             fetch response.headers.get(...)  to ExposeHeaders.
                             returns null in JS.
</code></pre>

<h3>Archetype 1 — origin mismatch (the &quot;works on my URL&quot; class)</h3>
<pre><code class="language-text">Symptom:  users on cuongthai.com upload fine, users on
          www.cuongthai.com get CORS blocked.
          
Cause:    AllowedOrigins listed the bare domain but not the
          www variant. Or vice versa.
          
The check:
  1. Open DevTools -&gt; Network -&gt; failing OPTIONS
  2. Look at Request Headers: &quot;Origin: https://www.cuongthai.com&quot;
  3. Look at Response Headers: no Access-Control-Allow-Origin,
     or it says &quot;https://cuongthai.com&quot; (bare)
  4. The mismatch is the bug.
  
Fix:
  &quot;AllowedOrigins&quot;: [
    &quot;https://cuongthai.com&quot;,
    &quot;https://www.cuongthai.com&quot;,
    &quot;https://staging.cuongthai.com&quot;
  ]
  
  List every scheme+host+port combination your app runs at.
  Missing one is a whole class of user 100% blocked.

  Measured trap: on Garage v2.1.0 ONE rule with TWO origins came back as ONE header
  "Access-Control-Allow-Origin: https://a, https://b" ⇒ Chromium: "contains multiple values".
  Safest form: one origin per rule (or test that your provider echoes only the matching one).
</code></pre>

<p>Other flavors of the same archetype: HTTP vs HTTPS, dev on localhost:3000 vs staging on staging.example.com, a mobile web-view with a weird custom origin. The check is always the same: compare the browser's actual Origin header to what your CORS policy lists.</p>

<h3>Archetype 2 — method not allowed</h3>
<pre><code class="language-text">Symptom:  GET https://xxx.r2.../thumb.jpg  works
          PUT https://xxx.r2.../new-upload   CORS error
          
Cause:    AllowedMethods lists GET, HEAD but not PUT (or POST,
          if using multipart form uploads).
          
The check:
  Preflight response header:
    Access-Control-Allow-Methods: GET, HEAD
    
  Console error — depends on the SERVER (measured below):
    API answering 204 with a list (Express cors): &quot;Method PUT is not allowed by
      Access-Control-Allow-Methods in preflight response.&quot;
    Bucket refusing with 403 (Garage; R2 answers a disallowed preflight with 403 too):
      &quot;Response to preflight request doesn't pass access control check:
       It does not have HTTP ok status.&quot;  ← no hint which field is wrong
    
  The error is unambiguous — the response literally names what
  methods it allows, and PUT is not on the list.

Fix:
  &quot;AllowedMethods&quot;: [&quot;GET&quot;, &quot;HEAD&quot;, &quot;PUT&quot;, &quot;POST&quot;, &quot;DELETE&quot;]
  
  For most apps GET/HEAD/PUT is enough. Add POST if you use
  multipart form uploads (rare with modern SDKs), DELETE if
  your client removes objects directly (usually a bad idea —
  do it via your backend).
</code></pre>

<h3>Archetype 3 — header not allowed (the sneakiest one)</h3>
<pre><code class="language-text">Symptom:  everything worked yesterday. Today someone added a
          new axios interceptor that sets x-request-id on every
          request. All uploads now CORS-block.
          
Cause:    Adding ANY custom header changes the preflight. The
          preflight asks &quot;can I send x-request-id?&quot;. The server
          says &quot;my AllowedHeaders list does not include that&quot;.
          Browser aborts.
          
The check:
  Preflight OPTIONS response:
    Access-Control-Allow-Headers: content-type, x-amz-content-sha256, ...
    
  Preflight OPTIONS request:
    Access-Control-Request-Headers: content-type, x-amz-content-sha256, x-request-id
    
  x-request-id is in the request but not in the allowed response.
  
Fix option A (recommended):
  Add the specific header to AllowedHeaders:
  &quot;AllowedHeaders&quot;: [
    &quot;Content-Type&quot;, &quot;Content-MD5&quot;, &quot;x-amz-content-sha256&quot;,
    &quot;x-amz-date&quot;, &quot;Authorization&quot;, &quot;x-request-id&quot;
  ]

Fix option B (last resort):
  Stop sending the custom header for R2 requests specifically.
  In axios, use a scoped instance without the interceptor for
  R2 calls.
</code></pre>

<p>This archetype is why a code change three modules away breaks uploads. Someone adds request tracing globally, and R2's CORS policy silently rejects. The fix is trivial once you know to look; the debugging takes an hour if you don't.</p>

<h3>Archetype 4 — response header invisible</h3>
<pre><code class="language-text">Symptom:  Upload PUT succeeds — HTTP 200 in Network tab, object
          appears in bucket. But JS thinks it failed:
          
  const res = await fetch(putUrl, { method: 'PUT', body })
  console.log(res.status)                     // 200
  console.log(res.headers.get('etag'))        // null    ← BUG
  
  Client sees null, thinks upload failed, retries. Duplicate
  objects. Log spam. Increased Class A cost.
  
Cause:    CORS does NOT hide the response body or status from
          cross-origin JS, but it DOES hide almost every response
          header. JS can read only 7 headers by default. Everything
          else requires explicit ExposeHeaders.
          
The check:
  In DevTools -&gt; Network -&gt; the successful PUT:
    Response Headers panel shows: ETag: &quot;abc123...&quot;    ← server sent it
  In your JS code:
    res.headers.get('etag') returns null                ← browser hid it

Fix:
  &quot;ExposeHeaders&quot;: [&quot;ETag&quot;, &quot;x-amz-version-id&quot;, &quot;x-amz-request-id&quot;]
  
  Whatever headers your JS needs to read after the response,
  list them explicitly.
</code></pre>

<h3>The five-second diagnostic checklist for any CORS bug</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Open DevTools -&gt; Network -&gt; find the failing request</span><span class="lz-d">Is there an OPTIONS before it (preflight failed) or is the actual PUT failing? Different diagnoses.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Compare Origin header (request) to Access-Control-Allow-Origin (response)</span><span class="lz-d">If they differ, Archetype 1. Add the origin.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Compare Access-Control-Request-Method to Access-Control-Allow-Methods</span><span class="lz-d">If the method is missing from the response's allow list, Archetype 2. Add the method.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Compare Access-Control-Request-Headers to Access-Control-Allow-Headers</span><span class="lz-d">If any header in the request list is not in the response allow list, Archetype 3. Add the header.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">If the request 200s but JS cannot read a header, Archetype 4</span><span class="lz-d">Add that header to ExposeHeaders.</span></div>
</div>

<h3>The one CORS bug your CORS policy cannot fix</h3>
<pre><code class="language-text">Console: &quot;fetch failed: net::ERR_FAILED&quot;
Preflight: never appears in Network tab
Actual PUT: never appears in Network tab

This is not CORS. This is a network error — DNS resolution
failed, TCP refused, firewall dropped, or the endpoint URL
itself is malformed. Correction (measured below): a CORS failure ALSO logs
&quot;net::ERR_FAILED&quot;. The tell is the line &quot;…blocked by CORS policy: …&quot;;
a dead server logs net::ERR_CONNECTION_REFUSED (or a DNS error) and no CORS line.

Debug:
  curl -v &lt;the exact URL your fetch used&gt;
  If curl fails too, the URL is wrong or the endpoint is down.
  If curl succeeds, look for a browser extension or corp
  proxy interfering.
</code></pre>

<div class="pitfall">
<p><strong>Trap — capitalizing header names.</strong> HTTP header names are case-insensitive by the spec, and browsers send them lower-case in <code>Access-Control-Request-Headers</code>. But a server may still compare them as written: on Garage v2.1.0 the policy <code>&quot;X-Request-Id&quot;</code> refused the preflight (403) and <code>&quot;x-request-id&quot;</code> passed (measured below). Write <code>AllowedHeaders</code> in lower case and nothing can bite you.</p>
</div>

<div class="pitfall">
<p><strong>Trap — a policy edit that seems to do nothing.</strong> Cloudflare's R2 docs (23/09/2026): &quot;CORS rule propagation can, in rare cases, take up to 30 seconds.&quot; Garage applied changes instantly in this lab. A browser may also still hold a cached preflight for that URL (lesson 5.2) — retest in a fresh tab or a new browser profile before deciding the change did not work.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Almost every CORS bug maps to one of four archetypes — origin mismatch, method not allowed, header not allowed, or response header not exposed — and the fix is always the same shape (add the missing item to the corresponding <code>Allowed*</code> / <code>ExposeHeaders</code> list); the debugging is a five-second three-way compare between the browser's Request headers, the CORS Response headers, and your policy config in Cloudflare or AWS.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Start from a working CORS policy and a working browser upload. Reproduce Archetype 1: load the page from the <code>www</code> variant that is NOT in <code>AllowedOrigins</code>, watch the PUT block, then add the origin to fix it.</li>
<li>Archetype 2: remove <code>PUT</code> from <code>AllowedMethods</code> and read the console: from a bucket expect &quot;does not have HTTP ok status&quot;; from an API using the <code>cors</code> package, &quot;Method PUT is not allowed...&quot;. Restore PUT.</li>
<li>Archetype 3: add a custom header to the fetch (e.g. <code>x-request-id</code>), watch the preflight block, then add the exact header name to <code>AllowedHeaders</code>.</li>
<li>Archetype 4: remove <code>ETag</code> from <code>ExposeHeaders</code> — the PUT still returns 200 but <code>res.headers.get('etag')</code> is <code>null</code>; add it back and the value appears.</li>
<li>For each, run the three-way compare: the browser Request's Origin/Method/Headers vs the <code>Access-Control-Allow-*</code> response vs your policy.</li>
</ol>
<p><strong>Done when:</strong> you reproduced and fixed all four archetypes, and can read a console CORS error and name its archetype in under a minute.</p></div>

<h3>🔬 Measured: each pattern in a real Chromium</h3>
<p>Lab: Garage v2.1.0 (S3 server with per-bucket CORS) behind a proxy that logs what the server receives, an Express 4 API with the <code>cors</code> 2.8 package (the same pair this repo's backend uses) for comparison, a real Chromium through Playwright. Nothing touches the real bucket.</p>
<p><strong>① Origin mismatch</strong> — the bucket refuses with 403, so Chromium cannot say why:</p>
<div class="out">$ chromium "http://www.cuongthai.localhost:20230/?thu=put"
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://www.cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648221527-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 403</div>
<p><strong>② Method missing</strong> — same vague message from the bucket; the Express API names the method:</p>
<div class="out">$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p6.json &amp;&amp; echo "đã đặt (GET, HEAD)"
đã đặt (GET, HEAD)
$ chromium "http://cuongthai.localhost:20230/?thu=put"          # bucket Garage
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648282551-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 403
$ chromium "…/?thu=put&amp;dich=http://api.localhost:20240/m/tep/a.jpg"   # API Express + cors (methods GET, HEAD)
Chromium error: Access to fetch at 'http://api.localhost:20240/m/tep/a.jpg' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Method PUT is not allowed by Access-Control-Allow-Methods in preflight response.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch</div>
<p><strong>③ Header missing</strong> — an interceptor adds <code>x-request-id</code>:</p>
<div class="out">$ chromium "http://cuongthai.localhost:20230/?thu=put&amp;hdr=x-request-id"     # bucket Garage (AllowedHeaders: content-type)
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648288261-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 403
$ curl -si -X OPTIONS … -H 'Access-Control-Request-Headers: content-type,x-request-id' localhost:20221/media-ch5/a.jpg | head -1
HTTP/1.1 403 Forbidden
$ chromium "…/?thu=put&amp;hdr=x-request-id&amp;dich=http://api.localhost:20240/h/tep/a.jpg"   # API Express + cors (PUT được, header chỉ content-type)
Chromium error: Access to fetch at 'http://api.localhost:20240/h/tep/a.jpg' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Request header field x-request-id is not allowed by Access-Control-Allow-Headers in preflight response.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch</div>
<p><strong>Header case</strong> — upper-case in the policy fails on Garage, lower-case passes:</p>
<div class="out">$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p7.json &amp;&amp; echo 'đã đặt (AllowedHeaders: "Content-Type", "X-Request-Id")'
đã đặt (AllowedHeaders: "Content-Type", "X-Request-Id")
$ chromium "http://cuongthai.localhost:20230/?thu=put&amp;hdr=x-request-id"
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648294135-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 403
$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p7b.json &amp;&amp; echo 'đã đặt (AllowedHeaders: "content-type", "x-request-id")'
đã đặt (AllowedHeaders: "content-type", "x-request-id")
$ chromium "http://cuongthai.localhost:20230/?thu=put&amp;hdr=x-request-id"
trang: #1 PUT ⇒ HTTP 200 (14 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648297272-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794648297272-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p><strong>Two origins in one rule</strong> — the server joins them into one header and the browser refuses it:</p>
<div class="out">$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p8.json &amp;&amp; echo "đã đặt (1 rule, 2 origin)"
đã đặt (1 rule, 2 origin)
$ curl -si -X OPTIONS -H 'Origin: http://www.cuongthai.localhost:20230' … | grep -i allow-origin
access-control-allow-origin: http://cuongthai.localhost:20230, http://www.cuongthai.localhost:20230
$ chromium "http://www.cuongthai.localhost:20230/?thu=put"
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://www.cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header contains multiple values 'http://cuongthai.localhost:20230, http://www.cuongthai.localhost:20230', but only one is allowed. Have the server send the header with a valid value.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648239767-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 200</div>
<p><strong>Not CORS</strong> — nothing listening on the port; compare with a real CORS failure:</p>
<div class="out">$ chromium "…/?thu=put&amp;dich=http://kho.localhost:20299/media-ch5/a.jpg"
Chromium error: Failed to load resource: net::ERR_CONNECTION_REFUSED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ node doc-anh.mjs obj-5-3 a1 | grep -c 'blocked by CORS policy'; node doc-anh.mjs obj-5-3 mang | grep -c 'blocked by CORS policy'
1
0</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>Real life — pattern ③ in this repo's own design:</strong> the frontend uploads with a bare <code>XMLHttpRequest</code> (<code>frontend/src/lib/api.ts:415</code>), not the axios instance, so app-wide headers never reach the bucket. And the backend's own CORS list (<code>src/index.ts</code>) names every custom header the frontend sends (<code>cf-turnstile-response</code>, <code>X-Client-Platform</code>…) — add one in the frontend without adding it there and you have pattern ③ against your own API.</li>
<li><strong>What if you "fix" CORS by reflecting the Origin?</strong> The <code>cors</code> package with <code>origin: true, credentials: true</code> echoes any origin with credentials allowed:</li>
</ul>
<div class="out">$ curl -si -X OPTIONS -H 'Origin: http://evil.example' -H 'Access-Control-Request-Method: PUT' localhost:20241/tep/a.jpg | grep -i '^access-control'
Access-Control-Allow-Origin: http://evil.example
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
$ grep -n "defaultCorsOrigins = \\[" -A4 src/index.ts; grep -n "credentials: true" src/index.ts
295:const defaultCorsOrigins = [
296-  'https://cuongthai.com',
297-  'https://www.cuongthai.com',
298-  'http://localhost:3000',
299-];
321:  credentials: true,</div>
<ul>
<li><strong>The attacker's view:</strong> on an API that authenticates with cookies, a reflected origin plus <code>Allow-Credentials: true</code> lets any page your user visits call the API with their cookies and <em>read the reply</em> — exactly what the same-origin policy exists to stop. How to spot it in review: <code>origin: true</code>, <code>origin: '*'</code> with credentials, or a callback that returns the incoming origin unchecked. This repo keeps a fixed list and logs rejected origins.</li>
</ul>
<h3>🔁 Run it yourself</h3>
<p>Start from a working upload. Break it four ways — <code>www</code> origin, drop <code>PUT</code>, add <code>x-request-id</code>, drop <code>ExposeHeaders</code> — and write down the console line and the server log for each. Repeat ② and ③ against a tiny Express app with the <code>cors</code> package and compare the messages. Finally stop the server and compare its console with a CORS failure.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-1-header-csp-cors" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 9.1 — The perimeter: security headers, CSP and CORS</span><span class="lc-sub">Configuring CORS in Express without reflecting origins</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-6-4-cors" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">API Design · 6.4 — CORS, CSRF and browsers: measured in a real Chromium</span><span class="lc-sub">Why reflect-origin plus cookies is a data leak</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Origin mismatch</span><span class="v">The browser's Origin is not in AllowedOrigins (e.g. www vs bare, http vs https).</span></div>
  <div class="kv"><span class="k">Method not allowed</span><span class="v">The request method is absent from AllowedMethods; the response names what it allows.</span></div>
  <div class="kv"><span class="k">Header not allowed</span><span class="v">A header in Access-Control-Request-Headers is missing from AllowedHeaders.</span></div>
  <div class="kv"><span class="k">Invisible response header</span><span class="v">A header the server sent but JS cannot read because it is not in ExposeHeaders.</span></div>
  <div class="kv"><span class="k">Three-way compare</span><span class="v">Request headers vs CORS response headers vs policy — the fast diagnosis.</span></div>
  <div class="kv"><span class="k">net::ERR_FAILED</span><span class="v">Logged for CORS failures too (measured) — look for the &quot;blocked by CORS policy&quot; line; a dead server gives ERR_CONNECTION_REFUSED instead.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Four archetypes cover almost every CORS incident: origin mismatch, method not allowed, header not allowed, response header not exposed.</li><li>The fix is always adding the missing item to the matching <code>Allowed*</code> / <code>ExposeHeaders</code> list.</li><li>Diagnose with a three-way compare: browser Request headers vs CORS Response headers vs your policy.</li><li>No &quot;blocked by CORS policy&quot; line in the console ⇒ not CORS (dead server, DNS, wrong URL); <code>net::ERR_FAILED</code> alone proves nothing — CORS failures log it too.</li><li>CORS edits can lag; wait a minute and hard-refresh before concluding a change failed.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CORS errors reference</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors — every browser CORS error and its fix.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Fetch spec — CORS-safelisted response headers</span><span class="lc-sub">fetch.spec.whatwg.org — the six headers that are always visible.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — CORS troubleshooting</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/cors — R2-specific gotchas.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Bug CORS phổ biến: bốn pattern lặp mãi</h2>
<p class="lead">Mọi bug CORS người ta báo cảm thấy mới. Hiếm khi thật. Qua hàng chục deployment R2 và S3, bốn pattern giải thích gần như mọi incident. Học match triệu chứng với pattern biến bí ẩn thành vá dưới 60 giây.</p>

<h3>Bốn archetype nhìn qua</h3>
<pre><code class="language-text">Archetype                    Triệu chứng                     Vá
──────────────────────────  ──────────────────────────────  ──────────────────
1. Origin lệch               Work trên cuongthai.com,         Thêm variant www
                             fail trên www.cuongthai.com      (hoặc ngược lại)
                             — hoặc ngược lại.                vào AllowedOrigins.

2. Method không allowed      GET work, PUT fail               Thêm PUT vào
                             ngay với CORS error.             AllowedMethods.

3. Header không allowed      Header custom thêm trong code    Thêm tên header
                             (vd x-app-version) trigger       chính xác vào AllowedHeaders
                             CORS block trên preflight.       (case-insensitive).

4. Response header vô hình   ETag / Location trả nhưng        Thêm tên header
                             fetch response.headers.get(...)  vào ExposeHeaders.
                             trả null trong JS.
</code></pre>

<h3>Archetype 1 — origin lệch (class &quot;work trên URL của tôi&quot;)</h3>
<pre><code class="language-text">Triệu:    user trên cuongthai.com upload ổn, user trên
          www.cuongthai.com bị CORS block.
          
Nguyên:   AllowedOrigins list bare domain nhưng không variant
          www. Hoặc ngược lại.
          
Check:
  1. Mở DevTools -&gt; Network -&gt; OPTIONS fail
  2. Nhìn Request Headers: &quot;Origin: https://www.cuongthai.com&quot;
  3. Nhìn Response Headers: không Access-Control-Allow-Origin,
     hoặc nói &quot;https://cuongthai.com&quot; (bare)
  4. Lệch là bug.
  
Vá:
  &quot;AllowedOrigins&quot;: [
    &quot;https://cuongthai.com&quot;,
    &quot;https://www.cuongthai.com&quot;,
    &quot;https://staging.cuongthai.com&quot;
  ]
  
  List mọi combo scheme+host+port app chạy.
  Thiếu một là toàn class user 100% block.

  Bẫy đo được: trên Garage v2.1.0, MỘT rule có HAI origin trả về MỘT header
  "Access-Control-Allow-Origin: https://a, https://b" ⇒ Chromium: "contains multiple values".
  An toàn nhất: mỗi origin một rule (hoặc kiểm nhà cung cấp chỉ trả đúng origin khớp).
</code></pre>

<p>Vị khác của cùng archetype: HTTP vs HTTPS, dev trên localhost:3000 vs staging trên staging.example.com, web-view mobile với origin custom lạ. Check luôn như nhau: so header Origin thật của browser với cái CORS policy list.</p>

<h3>Archetype 2 — method không allowed</h3>
<pre><code class="language-text">Triệu:    GET https://xxx.r2.../thumb.jpg  work
          PUT https://xxx.r2.../new-upload   CORS error
          
Nguyên:   AllowedMethods list GET, HEAD nhưng không PUT (hoặc POST,
          nếu dùng upload form multipart).
          
Check:
  Preflight response header:
    Access-Control-Allow-Methods: GET, HEAD
    
  Console error — tuỳ MÁY CHỦ (đo bên dưới):
    API trả 204 kèm danh sách (Express cors): &quot;Method PUT is not allowed by
      Access-Control-Allow-Methods in preflight response.&quot;
    Bucket từ chối bằng 403 (Garage; R2 cũng trả 403 cho preflight không khớp):
      &quot;Response to preflight request doesn't pass access control check:
       It does not have HTTP ok status.&quot;  ← không gợi ý trường nào sai
    
  Error không mập mờ — response literally nêu method nào nó
  allow, và PUT không trong list.

Vá:
  &quot;AllowedMethods&quot;: [&quot;GET&quot;, &quot;HEAD&quot;, &quot;PUT&quot;, &quot;POST&quot;, &quot;DELETE&quot;]
  
  Cho hầu hết app GET/HEAD/PUT đủ. Thêm POST nếu dùng
  upload form multipart (hiếm với SDK hiện đại), DELETE nếu
  client remove object trực tiếp (thường ý tưởng tệ —
  làm qua backend).
</code></pre>

<h3>Archetype 3 — header không allowed (cái nham hiểm nhất)</h3>
<pre><code class="language-text">Triệu:    mọi thứ work hôm qua. Hôm nay ai đó thêm axios
          interceptor mới set x-request-id trên mọi request.
          Mọi upload giờ CORS-block.
          
Nguyên:   Thêm BẤT KỲ header custom nào đổi preflight. Preflight
          hỏi &quot;tôi có gửi x-request-id được không?&quot;. Server
          nói &quot;list AllowedHeaders của tôi không include cái đó&quot;.
          Browser abort.
          
Check:
  Preflight OPTIONS response:
    Access-Control-Allow-Headers: content-type, x-amz-content-sha256, ...
    
  Preflight OPTIONS request:
    Access-Control-Request-Headers: content-type, x-amz-content-sha256, x-request-id
    
  x-request-id trong request nhưng không trong response allowed.
  
Vá option A (khuyến nghị):
  Thêm header cụ thể vào AllowedHeaders:
  &quot;AllowedHeaders&quot;: [
    &quot;Content-Type&quot;, &quot;Content-MD5&quot;, &quot;x-amz-content-sha256&quot;,
    &quot;x-amz-date&quot;, &quot;Authorization&quot;, &quot;x-request-id&quot;
  ]

Vá option B (last resort):
  Dừng gửi header custom cho request R2 cụ thể.
  Trong axios, dùng instance scope không interceptor cho
  call R2.
</code></pre>

<p>Archetype này là vì sao code change ba module xa vỡ upload. Ai đó thêm request tracing global, và CORS policy R2 câm reject. Vá trivial một khi biết nhìn; debug mất một giờ nếu không.</p>

<h3>Archetype 4 — response header vô hình</h3>
<pre><code class="language-text">Triệu:    Upload PUT thành — HTTP 200 trong tab Network, object
          xuất hiện trong bucket. Nhưng JS nghĩ fail:
          
  const res = await fetch(putUrl, { method: 'PUT', body })
  console.log(res.status)                     // 200
  console.log(res.headers.get('etag'))        // null    ← BUG
  
  Client thấy null, nghĩ upload fail, retry. Object trùng.
  Spam log. Cost Class A tăng.
  
Nguyên:   CORS KHÔNG giấu body hoặc status response khỏi JS
          cross-origin, nhưng CÓ giấu gần như mọi header response.
          JS đọc chỉ 7 header mặc định. Mọi cái khác cần
          ExposeHeaders explicit.
          
Check:
  Trong DevTools -&gt; Network -&gt; PUT thành:
    Panel Response Headers hiện: ETag: &quot;abc123...&quot;    ← server gửi
  Trong code JS:
    res.headers.get('etag') trả null                    ← browser giấu

Vá:
  &quot;ExposeHeaders&quot;: [&quot;ETag&quot;, &quot;x-amz-version-id&quot;, &quot;x-amz-request-id&quot;]
  
  Bất kỳ header nào JS cần đọc sau response,
  list explicit.
</code></pre>

<h3>Checklist chẩn đoán năm giây cho bất kỳ bug CORS</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mở DevTools -&gt; Network -&gt; tìm request fail</span><span class="lz-d">Có OPTIONS trước nó (preflight fail) hay PUT thật fail? Chẩn đoán khác.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">So header Origin (request) với Access-Control-Allow-Origin (response)</span><span class="lz-d">Nếu khác, Archetype 1. Thêm origin.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">So Access-Control-Request-Method với Access-Control-Allow-Methods</span><span class="lz-d">Nếu method thiếu từ list allow response, Archetype 2. Thêm method.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">So Access-Control-Request-Headers với Access-Control-Allow-Headers</span><span class="lz-d">Nếu bất kỳ header trong list request không trong list allow response, Archetype 3. Thêm header.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Nếu request 200 nhưng JS đọc header không được, Archetype 4</span><span class="lz-d">Thêm header đó vào ExposeHeaders.</span></div>
</div>

<h3>Một bug CORS mà CORS policy không vá được</h3>
<pre><code class="language-text">Console: &quot;fetch failed: net::ERR_FAILED&quot;
Preflight: không bao giờ xuất hiện trong tab Network
PUT thật: không bao giờ xuất hiện trong tab Network

Đây không phải CORS. Đây là error network — resolve DNS
fail, TCP refuse, firewall drop, hoặc URL endpoint tự
malformed. Đính chính (đo bên dưới): lỗi CORS CŨNG in
&quot;net::ERR_FAILED&quot;. Dấu hiệu là dòng &quot;…blocked by CORS policy: …&quot;;
máy chủ chết in net::ERR_CONNECTION_REFUSED (hoặc lỗi DNS) và không có dòng CORS nào.

Debug:
  curl -v &lt;URL chính xác fetch dùng&gt;
  Nếu curl fail nữa, URL sai hoặc endpoint down.
  Nếu curl thành, tìm extension browser hoặc corp
  proxy can thiệp.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — viết hoa tên header.</strong> Theo chuẩn, tên header HTTP không phân biệt hoa thường, và trình duyệt gửi chữ thường trong <code>Access-Control-Request-Headers</code>. Nhưng máy chủ vẫn có thể so nguyên văn: trên Garage v2.1.0 chính sách <code>&quot;X-Request-Id&quot;</code> từ chối preflight (403), còn <code>&quot;x-request-id&quot;</code> thì qua (đo bên dưới). Viết <code>AllowedHeaders</code> bằng chữ thường là không bao giờ dính.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — sửa chính sách mà như không có gì xảy ra.</strong> Tài liệu R2 (23/09/2026): &quot;CORS rule propagation can, in rare cases, take up to 30 seconds.&quot; Garage áp dụng ngay trong lab này. Trình duyệt cũng có thể còn nhớ preflight cũ của URL đó (bài 5.2) — thử lại ở tab mới hoặc hồ sơ trình duyệt mới trước khi kết luận sửa không ăn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Gần như mọi bug CORS map tới một trong bốn archetype — origin lệch, method không allowed, header không allowed, hoặc response header không expose — và vá luôn cùng hình dạng (thêm item thiếu vào list <code>Allowed*</code> / <code>ExposeHeaders</code> tương ứng); debug là so ba-chiều năm giây giữa header Request của browser, header Response CORS, và config policy trong Cloudflare hoặc AWS.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Bắt đầu từ CORS policy đang chạy và một upload browser đang work. Tái hiện Archetype 1: tải trang từ biến thể <code>www</code> KHÔNG có trong <code>AllowedOrigins</code>, xem PUT bị chặn, rồi thêm origin đó để vá.</li>
<li>Archetype 2: bỏ <code>PUT</code> khỏi <code>AllowedMethods</code> và đọc console: từ bucket sẽ là &quot;does not have HTTP ok status&quot;; từ API dùng gói <code>cors</code> là &quot;Method PUT is not allowed...&quot;. Khôi phục PUT.</li>
<li>Archetype 3: thêm một header custom vào fetch (vd <code>x-request-id</code>), xem preflight bị chặn, rồi thêm đúng tên header vào <code>AllowedHeaders</code>.</li>
<li>Archetype 4: bỏ <code>ETag</code> khỏi <code>ExposeHeaders</code> — PUT vẫn trả 200 nhưng <code>res.headers.get('etag')</code> là <code>null</code>; thêm lại thì giá trị hiện ra.</li>
<li>Với mỗi cái, chạy so ba chiều: Origin/Method/Headers của Request browser vs response <code>Access-Control-Allow-*</code> vs policy của bạn.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tái hiện và vá được cả bốn archetype, và đọc một error CORS trong console là gọi tên được archetype dưới một phút.</p></div>

<h3>🔬 Đo thật: từng kiểu trong Chromium thật</h3>
<p>Lab: Garage v2.1.0 (máy chủ S3 có CORS theo bucket) sau một proxy ghi lại thứ máy chủ nhận, một API Express 4 với gói <code>cors</code> 2.8 (đúng bộ đôi backend của kho dùng) để so, Chromium thật qua Playwright. Không lệnh nào chạm bucket thật.</p>
<p><strong>① Origin lệch</strong> — bucket từ chối bằng 403 nên Chromium không nói được vì sao:</p>
<div class="out">$ chromium "http://www.cuongthai.localhost:20230/?thu=put"
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://www.cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648221527-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 403</div>
<p><strong>② Thiếu phương thức</strong> — bucket vẫn thông báo mơ hồ; API Express nói rõ phương thức:</p>
<div class="out">$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p6.json &amp;&amp; echo "đã đặt (GET, HEAD)"
đã đặt (GET, HEAD)
$ chromium "http://cuongthai.localhost:20230/?thu=put"          # bucket Garage
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648282551-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 403
$ chromium "…/?thu=put&amp;dich=http://api.localhost:20240/m/tep/a.jpg"   # API Express + cors (methods GET, HEAD)
Chromium error: Access to fetch at 'http://api.localhost:20240/m/tep/a.jpg' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Method PUT is not allowed by Access-Control-Allow-Methods in preflight response.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch</div>
<p><strong>③ Thiếu header</strong> — một interceptor thêm <code>x-request-id</code>:</p>
<div class="out">$ chromium "http://cuongthai.localhost:20230/?thu=put&amp;hdr=x-request-id"     # bucket Garage (AllowedHeaders: content-type)
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648288261-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 403
$ curl -si -X OPTIONS … -H 'Access-Control-Request-Headers: content-type,x-request-id' localhost:20221/media-ch5/a.jpg | head -1
HTTP/1.1 403 Forbidden
$ chromium "…/?thu=put&amp;hdr=x-request-id&amp;dich=http://api.localhost:20240/h/tep/a.jpg"   # API Express + cors (PUT được, header chỉ content-type)
Chromium error: Access to fetch at 'http://api.localhost:20240/h/tep/a.jpg' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Request header field x-request-id is not allowed by Access-Control-Allow-Headers in preflight response.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch</div>
<p><strong>Hoa thường của tên header</strong> — chính sách viết hoa thì hỏng trên Garage, viết thường thì qua:</p>
<div class="out">$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p7.json &amp;&amp; echo 'đã đặt (AllowedHeaders: "Content-Type", "X-Request-Id")'
đã đặt (AllowedHeaders: "Content-Type", "X-Request-Id")
$ chromium "http://cuongthai.localhost:20230/?thu=put&amp;hdr=x-request-id"
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648294135-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 403
$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p7b.json &amp;&amp; echo 'đã đặt (AllowedHeaders: "content-type", "x-request-id")'
đã đặt (AllowedHeaders: "content-type", "x-request-id")
$ chromium "http://cuongthai.localhost:20230/?thu=put&amp;hdr=x-request-id"
trang: #1 PUT ⇒ HTTP 200 (14 ms)
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648297272-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200
PUT     /media-ch5/anh/u42/1794648297272-1.jpg?…(đã ký) Origin: http://cuongthai.localhost:20230 ⇒ 200</div>
<p><strong>Hai origin trong một rule</strong> — máy chủ nối thành một header và trình duyệt từ chối:</p>
<div class="out">$ bash g.sh s3api put-bucket-cors --bucket media-ch5 --cors-configuration file://p8.json &amp;&amp; echo "đã đặt (1 rule, 2 origin)"
đã đặt (1 rule, 2 origin)
$ curl -si -X OPTIONS -H 'Origin: http://www.cuongthai.localhost:20230' … | grep -i allow-origin
access-control-allow-origin: http://cuongthai.localhost:20230, http://www.cuongthai.localhost:20230
$ chromium "http://www.cuongthai.localhost:20230/?thu=put"
Chromium error: Access to fetch at 'http://kho.localhost:20221/media-ch5/anh/u42/….jpg?…' from origin 'http://www.cuongthai.localhost:20230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header contains multiple values 'http://cuongthai.localhost:20230, http://www.cuongthai.localhost:20230', but only one is allowed. Have the server send the header with a valid value.
Chromium error: Failed to load resource: net::ERR_FAILED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ cat dem.log
OPTIONS /media-ch5/anh/u42/1794648239767-1.jpg?…(đã ký) Origin: http://www.cuongthai.localhost:20230 ⇒ 200</div>
<p><strong>Không phải CORS</strong> — cổng không có máy chủ nào chạy; so với một lỗi CORS thật:</p>
<div class="out">$ chromium "…/?thu=put&amp;dich=http://kho.localhost:20299/media-ch5/a.jpg"
Chromium error: Failed to load resource: net::ERR_CONNECTION_REFUSED
trang: #1 PUT ⇒ TypeError: Failed to fetch
$ node doc-anh.mjs obj-5-3 a1 | grep -c 'blocked by CORS policy'; node doc-anh.mjs obj-5-3 mang | grep -c 'blocked by CORS policy'
1
0</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Đời thật — kiểu ③ ngay trong thiết kế của kho:</strong> frontend tải lên bằng <code>XMLHttpRequest</code> trần (<code>frontend/src/lib/api.ts:415</code>), không qua instance axios, nên header chung của ứng dụng không bao giờ tới bucket. Còn danh sách CORS của backend (<code>src/index.ts</code>) ghi đủ mọi header riêng frontend gửi (<code>cf-turnstile-response</code>, <code>X-Client-Platform</code>…) — thêm một header ở frontend mà quên thêm ở đó là bạn tự tạo kiểu ③ với chính API của mình.</li>
<li><strong>Nếu "sửa" CORS bằng cách phản chiếu Origin thì sao?</strong> Gói <code>cors</code> với <code>origin: true, credentials: true</code> trả lại mọi origin kèm cho phép credentials:</li>
</ul>
<div class="out">$ curl -si -X OPTIONS -H 'Origin: http://evil.example' -H 'Access-Control-Request-Method: PUT' localhost:20241/tep/a.jpg | grep -i '^access-control'
Access-Control-Allow-Origin: http://evil.example
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
$ grep -n "defaultCorsOrigins = \\[" -A4 src/index.ts; grep -n "credentials: true" src/index.ts
295:const defaultCorsOrigins = [
296-  'https://cuongthai.com',
297-  'https://www.cuongthai.com',
298-  'http://localhost:3000',
299-];
321:  credentials: true,</div>
<ul>
<li><strong>Góc kẻ xấu:</strong> trên API xác thực bằng cookie, origin phản chiếu cộng <code>Allow-Credentials: true</code> cho phép mọi trang người dùng ghé qua gọi API bằng cookie của họ và <em>đọc câu trả lời</em> — đúng thứ chính sách cùng origin sinh ra để chặn. Cách nhận ra khi review: <code>origin: true</code>, <code>origin: '*'</code> đi cùng credentials, hoặc một callback trả lại origin nhận vào mà không kiểm. Kho giữ danh sách cố định và ghi log origin bị từ chối.</li>
</ul>
<h3>🔁 Tự chạy lại</h3>
<p>Bắt đầu từ một lần tải lên đang chạy. Làm hỏng bốn cách — origin <code>www</code>, bỏ <code>PUT</code>, thêm <code>x-request-id</code>, bỏ <code>ExposeHeaders</code> — và ghi lại dòng console cùng nhật ký máy chủ của từng cách. Lặp ② và ③ với một ứng dụng Express nhỏ dùng gói <code>cors</code> rồi so thông báo. Cuối cùng tắt máy chủ và so console với một lỗi CORS.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-1-header-csp-cors" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 9.1 — Đường biên: header bảo mật, CSP và CORS</span><span class="lc-sub">Cấu hình CORS trong Express mà không phản chiếu origin</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-6-4-cors" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">API Design · 6.4 — CORS, CSRF và trình duyệt: đo trong Chromium thật</span><span class="lc-sub">Vì sao phản chiếu origin cùng cookie là lộ dữ liệu</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Origin lệch</span><span class="v">Origin của browser không có trong AllowedOrigins (vd www vs bare, http vs https).</span></div>
  <div class="kv"><span class="k">Method không allowed</span><span class="v">Method của request vắng trong AllowedMethods; response nêu rõ method nào nó cho.</span></div>
  <div class="kv"><span class="k">Header không allowed</span><span class="v">Một header trong Access-Control-Request-Headers thiếu khỏi AllowedHeaders.</span></div>
  <div class="kv"><span class="k">Header response vô hình</span><span class="v">Header server đã gửi nhưng JS không đọc được vì không có trong ExposeHeaders.</span></div>
  <div class="kv"><span class="k">So ba chiều</span><span class="v">Request headers vs CORS response headers vs policy — cách chẩn đoán nhanh.</span></div>
  <div class="kv"><span class="k">net::ERR_FAILED</span><span class="v">Lỗi CORS cũng in dòng này (đo) — tìm dòng &quot;blocked by CORS policy&quot;; máy chủ chết thì là ERR_CONNECTION_REFUSED.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bốn archetype phủ gần như mọi incident CORS: origin lệch, method không allowed, header không allowed, response header không expose.</li><li>Vá luôn là thêm item thiếu vào list <code>Allowed*</code> / <code>ExposeHeaders</code> tương ứng.</li><li>Chẩn đoán bằng so ba chiều: header Request browser vs header Response CORS vs policy.</li><li>Console không có dòng &quot;blocked by CORS policy&quot; ⇒ không phải CORS (máy chủ chết, DNS, sai URL); riêng <code>net::ERR_FAILED</code> không chứng minh gì — lỗi CORS cũng in nó.</li><li>Sửa CORS có thể trễ; chờ một phút và hard-refresh trước khi kết luận thay đổi không work.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CORS errors reference</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors — mọi error CORS browser và vá.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Fetch spec — CORS-safelisted response headers</span><span class="lc-sub">fetch.spec.whatwg.org — sáu header luôn thấy được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — CORS troubleshooting</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/cors — gotcha riêng R2.</span></span></div>
</div>
`,
    },

    {
      title: '5.4 — Chapter 5 quiz|||5.4 — Kiểm tra Chương 5',
      slug: 'os-5-4-quiz',
      type: 'QUIZ',
      description: 'Ba câu về CORS.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 5 · Quiz</span><h2>What Chapter 5 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 5 · Kiểm tra</span><h2>Chương 5 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 300,
        questions: [
          {
            question: 'Browser upload to R2 fails with CORS error. Where fix?|||Browser upload tới R2 fail với CORS error. Vá ở đâu?',
            options: [
              'R2 bucket CORS policy — add AllowedOrigins for your site domain, AllowedMethods PUT/GET/HEAD, AllowedHeaders content-type|||R2 bucket CORS policy — add AllowedOrigins cho site domain, AllowedMethods PUT/GET/HEAD, AllowedHeaders content-type',
              'Browser settings|||Setting browser',
              'Backend nginx|||Nginx backend',
              'React config|||React config',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Production CORS: <code>AllowedOrigins: [&quot;*&quot;]</code>. Risk?|||CORS production: <code>AllowedOrigins: [&quot;*&quot;]</code>. Nguy cơ?',
            options: [
              'Any website\'s JavaScript may then use a signed URL it obtains and read the reply — but a leaked signed URL works from curl anyway (CORS is not access control). Keep explicit origins as one more layer; the signature is the real lock|||JavaScript của bất kỳ website nào cũng dùng được signed URL nó lấy được và đọc câu trả lời — nhưng signed URL bị lộ thì curl vẫn dùng được (CORS không phải kiểm soát truy cập). Giữ origin ghi rõ như một lớp phòng thêm; ổ khoá thật là chữ ký',
              'No risk|||Không nguy cơ',
              'Slower|||Chậm hơn',
              'More expensive|||Đắt hơn',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Preflight OPTIONS blocked. Actual PUT?|||Preflight OPTIONS bị block. PUT thật sự?',
            options: [
              'Never sent. DevTools shows CORS error before PUT. Server sees no PUT request. Fix CORS first, then PUT will run|||Không gửi. DevTools hiện CORS error trước PUT. Server không thấy PUT nào. Vá CORS trước, sau PUT sẽ chạy',
              'Sent anyway|||Vẫn gửi',
              'Sent as GET|||Gửi như GET',
              'Sent through iframe|||Gửi qua iframe',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
