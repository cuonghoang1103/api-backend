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
  Status: (blocked:cors)
  Console error: "Access to fetch has been blocked by CORS policy..."
  
Preflight OPTIONS response:
  Access-Control-Allow-Origin: [expected origin? or *?]
  Access-Control-Allow-Methods: [PUT included?]
  Access-Control-Allow-Headers: [content-type included?]
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>AllowedOrigins: [&quot;*&quot;]</code> in production.</strong> Allows any site to upload to your bucket if they get a signed URL. In production restrict to your domain(s). Wildcard OK for dev.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Browser blocks cross-origin PUT to R2 unless bucket CORS policy allows the origin + method (PUT) + headers (content-type); config in Cloudflare dashboard with explicit AllowedOrigins for production; failed CORS shows in DevTools Network as &quot;blocked:cors&quot; before PUT even sent.</p>
</div>

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
  Status: (blocked:cors)
  Console error: "Access to fetch has been blocked by CORS policy..."
  
Preflight OPTIONS response:
  Access-Control-Allow-Origin: [expected origin? or *?]
  Access-Control-Allow-Methods: [PUT included?]
  Access-Control-Allow-Headers: [content-type included?]
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>AllowedOrigins: [&quot;*&quot;]</code> trong production.</strong> Cho phép bất kỳ site nào upload tới bucket nếu họ có signed URL. Trong production restrict tới domain của bạn. Wildcard OK cho dev.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Browser chặn cross-origin PUT tới R2 trừ khi bucket CORS policy cho phép origin + method (PUT) + header (content-type); config ở Cloudflare dashboard với AllowedOrigins explicit cho production; CORS fail hiện trong DevTools Network là &quot;blocked:cors&quot; trước PUT gửi.</p>
</div>

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
      description: 'Preflight is not free — every uncached OPTIONS is a Class A op and a round-trip. Learn what caches, what does not, and the three headers people always miss (credentials, expose, cache max-age).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Preflight caching, credentials, and expose-headers</h2>
<p class="lead">Lesson 5.1 covered the &quot;my upload fails with a CORS error&quot; case. Now the more interesting problem: your uploads work, but every single PUT triggers a preflight OPTIONS first, doubling the request count on every upload. Preflight can be cached — most people never configure it, so browsers ask over and over. Fixing that is one field in your CORS policy, and it halves your Class A cost from browser uploads.</p>

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

<p>You cannot avoid the preflight for a PUT to R2. What you can do is make sure the browser caches the preflight response so it does not do another one for the same origin+method combination for the next N seconds.</p>

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

<h3>MaxAgeSeconds — the cache TTL</h3>
<pre><code class="language-text">MaxAgeSeconds: 3600
  Browser caches the preflight response for 3600 seconds (1 hour).
  During that window, subsequent PUTs from the same origin skip
  the preflight OPTIONS entirely.

Without MaxAgeSeconds:
  Browser uses its default, which is usually 5 seconds (Chrome)
  or 0 (some Safari versions). Every PUT preflights.
  
Cost impact:
  App does 100k uploads/day, no MaxAgeSeconds.
  Preflights:  100k Class A ops/day
  Uploads:     100k Class A ops/day
  Total:       200k/day = 6M/month = $27/month
  
  With MaxAgeSeconds: 3600 and hot users:
  Preflights:  ~10k/day (once per user per hour)
  Uploads:     100k/day
  Total:       110k/day = $14.85/month
  Savings:     $12/month, half your CORS bill.
</code></pre>

<p>Browsers cap MaxAgeSeconds at their own maximum. Chrome caps at 7200 (2 hours), Firefox at 86400 (24 hours), Safari at 600 (10 minutes) as of 2026. Setting 604800 (7 days) does not make Chrome cache longer than 7200; it just gets clamped. Pick the highest you can tolerate; 3600 is a safe choice.</p>

<h3>AllowedHeaders — explicit list beats wildcard</h3>
<pre><code class="language-text">Wrong (works, but forces preflight to re-check every time):
  &quot;AllowedHeaders&quot;: [&quot;*&quot;]
  
  Browser preflight asks &quot;can I send Content-Type?&quot;
  Server says &quot;yes, any header allowed&quot;.
  Browser cannot cache because a * response does not commit to
  a specific set. Next request preflights again.

Right (explicit list, browser caches the exact match):
  &quot;AllowedHeaders&quot;: [
    &quot;Content-Type&quot;,
    &quot;Content-MD5&quot;,
    &quot;x-amz-content-sha256&quot;,
    &quot;x-amz-date&quot;,
    &quot;Authorization&quot;
  ]
  
  Browser preflight asks &quot;can I send [these five]?&quot;
  Server says &quot;yes, exactly those five&quot;.
  Browser caches: next PUT with the same header set skips preflight.
</code></pre>

<h3>ExposeHeaders — what the client's JavaScript can see</h3>
<pre><code class="language-text">By default, cross-origin fetch()/XHR JS can read only 6 headers:
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

<h3>Credentials — the one setting Cloudflare and AWS both mishandle</h3>
<pre><code class="language-text">If your fetch uses credentials: 'include' (sends cookies), the
CORS response MUST include Access-Control-Allow-Credentials: true
AND MUST NOT use * for AllowedOrigins.

R2 CORS policy has no explicit &quot;Credentials&quot; field. R2 sends
Allow-Credentials: true whenever you list an explicit origin.

S3 CORS policy also has no explicit &quot;Credentials&quot; field. S3
handles it via AllowedOrigins being explicit.

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
<pre><code class="language-bash"># Do a preflight, then immediately a PUT, then again a PUT.
# In DevTools -&gt; Network:

# Request 1: (options) preflight -&gt; 200
# Request 2: (put)     upload    -&gt; 200
# Request 3: (put)     upload    -&gt; 200   ← no preflight before this one

# If Request 3 also shows an OPTIONS before it, caching failed.
# Check:
curl -X OPTIONS -H 'Origin: https://cuongthai.com' \\
                -H 'Access-Control-Request-Method: PUT' \\
                -H 'Access-Control-Request-Headers: content-type' \\
                -I 'https://xxx.r2.cloudflarestorage.com/my-bucket/some-key'
</code></pre>
<div class="out">
<pre><code class="language-text">HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://cuongthai.com
Access-Control-Allow-Methods: GET, HEAD, PUT, POST
Access-Control-Allow-Headers: content-type, content-md5, x-amz-content-sha256, x-amz-date, authorization
Access-Control-Max-Age: 3600     ← THIS is the caching directive
Access-Control-Expose-Headers: ETag
Access-Control-Allow-Credentials: true</code></pre>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>AllowedHeaders: [&quot;*&quot;]</code> as a debugging shortcut.</strong> It works but disables preflight caching. Everyone does it during dev, few people go back and tighten it before production. Half your R2 Class A cost can be preflights that never needed to happen. Explicit lists are the fix.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — expecting the browser to cache longer than its own maximum.</strong> Setting <code>MaxAgeSeconds: 86400</code> looks right in the CORS config but Chrome caps at 7200. Test in the browser you actually target; do not measure from a curl (curl has no preflight cache).</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A browser upload to R2/S3 always triggers a preflight OPTIONS, but the browser will cache the response for up to <code>MaxAgeSeconds</code> (capped by browser, typically ~2 hours) if you specify explicit <code>AllowedHeaders</code> (not <code>*</code>), an explicit <code>AllowedOrigins</code> (not <code>*</code>), and a value for <code>MaxAgeSeconds</code>; missing any of those turns every PUT into a preflight+PUT pair and doubles your Class A cost from browser upload traffic.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CORS preflight</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests — what triggers, what caches.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Access-Control-Max-Age</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age — per-browser caps.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — CORS reference</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/cors — the exact fields R2 accepts.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Cache preflight, credentials, và expose-headers</h2>
<p class="lead">Bài 5.1 bao case &quot;upload fail với CORS error&quot;. Giờ vấn đề thú vị hơn: upload work, nhưng mỗi PUT trigger preflight OPTIONS trước, gấp đôi count request mỗi upload. Preflight có thể cache — hầu hết mọi người không bao giờ config, nên browser hỏi đi hỏi lại. Vá là một field trong CORS policy, và nó chia đôi cost Class A từ browser upload.</p>

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

<p>Bạn không tránh được preflight cho PUT tới R2. Cái bạn làm được là đảm browser cache response preflight để nó không làm cái khác cho cùng origin+method combo trong N giây tới.</p>

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

<h3>MaxAgeSeconds — TTL cache</h3>
<pre><code class="language-text">MaxAgeSeconds: 3600
  Browser cache response preflight trong 3600 giây (1 giờ).
  Trong window đó, PUT sau từ cùng origin skip preflight
  OPTIONS hoàn toàn.

Không MaxAgeSeconds:
  Browser dùng mặc định của nó, thường 5 giây (Chrome)
  hoặc 0 (một số phiên bản Safari). Mọi PUT preflight.
  
Impact cost:
  App làm 100k upload/ngày, không MaxAgeSeconds.
  Preflight:   100k Class A op/ngày
  Upload:      100k Class A op/ngày
  Tổng:        200k/ngày = 6M/tháng = $27/tháng
  
  Với MaxAgeSeconds: 3600 và user hot:
  Preflight:   ~10k/ngày (một lần per user per giờ)
  Upload:      100k/ngày
  Tổng:        110k/ngày = $14.85/tháng
  Tiết kiệm:   $12/tháng, nửa bill CORS của bạn.
</code></pre>

<p>Browser cap MaxAgeSeconds ở max của chính nó. Chrome cap ở 7200 (2 giờ), Firefox ở 86400 (24 giờ), Safari ở 600 (10 phút) tính đến 2026. Set 604800 (7 ngày) không làm Chrome cache lâu hơn 7200; nó chỉ bị clamp. Chọn cao nhất bạn chịu được; 3600 an toàn.</p>

<h3>AllowedHeaders — list explicit thắng wildcard</h3>
<pre><code class="language-text">Sai (work, nhưng ép preflight re-check mỗi lần):
  &quot;AllowedHeaders&quot;: [&quot;*&quot;]
  
  Preflight browser hỏi &quot;tôi có gửi Content-Type được không?&quot;
  Server nói &quot;có, mọi header allowed&quot;.
  Browser không cache được vì response * không commit vào
  set cụ thể. Request kế preflight lần nữa.

Đúng (list explicit, browser cache match chính xác):
  &quot;AllowedHeaders&quot;: [
    &quot;Content-Type&quot;,
    &quot;Content-MD5&quot;,
    &quot;x-amz-content-sha256&quot;,
    &quot;x-amz-date&quot;,
    &quot;Authorization&quot;
  ]
  
  Preflight browser hỏi &quot;tôi có gửi [năm cái này] được không?&quot;
  Server nói &quot;có, đúng năm cái đó&quot;.
  Browser cache: PUT kế với cùng set header skip preflight.
</code></pre>

<h3>ExposeHeaders — cái JS client thấy được</h3>
<pre><code class="language-text">Mặc định, fetch()/XHR cross-origin JS đọc được chỉ 6 header:
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

<h3>Credentials — setting một mà Cloudflare và AWS đều xử tệ</h3>
<pre><code class="language-text">Nếu fetch dùng credentials: 'include' (gửi cookie), response
CORS PHẢI include Access-Control-Allow-Credentials: true
VÀ KHÔNG được dùng * cho AllowedOrigins.

CORS policy R2 không có field &quot;Credentials&quot; explicit. R2 gửi
Allow-Credentials: true bất cứ khi nào bạn list explicit origin.

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

<h3>Verify cache preflight work</h3>
<pre><code class="language-bash"># Làm preflight, rồi ngay PUT, rồi lại PUT.
# Trong DevTools -&gt; Network:

# Request 1: (options) preflight -&gt; 200
# Request 2: (put)     upload    -&gt; 200
# Request 3: (put)     upload    -&gt; 200   ← không preflight trước cái này

# Nếu Request 3 cũng hiện OPTIONS trước, cache fail.
# Check:
curl -X OPTIONS -H 'Origin: https://cuongthai.com' \\
                -H 'Access-Control-Request-Method: PUT' \\
                -H 'Access-Control-Request-Headers: content-type' \\
                -I 'https://xxx.r2.cloudflarestorage.com/my-bucket/some-key'
</code></pre>
<div class="out">
<pre><code class="language-text">HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://cuongthai.com
Access-Control-Allow-Methods: GET, HEAD, PUT, POST
Access-Control-Allow-Headers: content-type, content-md5, x-amz-content-sha256, x-amz-date, authorization
Access-Control-Max-Age: 3600     ← CÁI này là directive cache
Access-Control-Expose-Headers: ETag
Access-Control-Allow-Credentials: true</code></pre>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>AllowedHeaders: [&quot;*&quot;]</code> làm shortcut debug.</strong> Nó work nhưng disable cache preflight. Mọi người làm nó trong dev, ít người quay lại siết trước production. Nửa Class A cost R2 có thể là preflight không bao giờ cần xảy. List explicit là vá.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — mong browser cache lâu hơn max của chính nó.</strong> Set <code>MaxAgeSeconds: 86400</code> trông đúng trong config CORS nhưng Chrome cap ở 7200. Test trong browser bạn thực sự target; đừng đo từ curl (curl không có cache preflight).</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Browser upload tới R2/S3 luôn trigger preflight OPTIONS, nhưng browser sẽ cache response tới <code>MaxAgeSeconds</code> (cap bởi browser, thường ~2 giờ) nếu bạn chỉ định <code>AllowedHeaders</code> explicit (không <code>*</code>), <code>AllowedOrigins</code> explicit (không <code>*</code>), và giá trị cho <code>MaxAgeSeconds</code>; bỏ bất kỳ cái nào biến mọi PUT thành cặp preflight+PUT và gấp đôi cost Class A từ traffic browser upload.</p>
</div>

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
    
  Console error:
    &quot;Method PUT is not allowed by Access-Control-Allow-Methods.&quot;
    
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
          header. JS can read only 6 headers by default. Everything
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
itself is malformed. CORS errors show up as (blocked:cors)
in the status column; net::ERR_FAILED is something else.

Debug:
  curl -v &lt;the exact URL your fetch used&gt;
  If curl fails too, the URL is wrong or the endpoint is down.
  If curl succeeds, look for a browser extension or corp
  proxy interfering.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — capitalizing header names as if they mattered.</strong> HTTP headers are case-insensitive. R2 and S3 lowercase them internally. Writing <code>&quot;X-Amz-Content-Sha256&quot;</code> in your CORS policy works, but so does <code>&quot;x-amz-content-sha256&quot;</code>. Do not spend time debating capitalization; nothing depends on it.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — CORS policy edit did not take effect immediately.</strong> Some clouds propagate CORS changes with 30-second to 5-minute lag. Change the policy, wait a full minute, then hard-refresh the browser (Ctrl+Shift+R to bust the preflight cache) before deciding the change did not work.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Almost every CORS bug maps to one of four archetypes — origin mismatch, method not allowed, header not allowed, or response header not exposed — and the fix is always the same shape (add the missing item to the corresponding <code>Allowed*</code> / <code>ExposeHeaders</code> list); the debugging is a five-second three-way compare between the browser's Request headers, the CORS Response headers, and your policy config in Cloudflare or AWS.</p>
</div>

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
    
  Console error:
    &quot;Method PUT is not allowed by Access-Control-Allow-Methods.&quot;
    
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
          JS đọc chỉ 6 header mặc định. Mọi cái khác cần
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
malformed. Error CORS hiện là (blocked:cors) trong cột
status; net::ERR_FAILED là gì khác.

Debug:
  curl -v &lt;URL chính xác fetch dùng&gt;
  Nếu curl fail nữa, URL sai hoặc endpoint down.
  Nếu curl thành, tìm extension browser hoặc corp
  proxy can thiệp.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — viết hoa tên header như thể có ý nghĩa.</strong> HTTP header case-insensitive. R2 và S3 lower nội bộ. Viết <code>&quot;X-Amz-Content-Sha256&quot;</code> trong CORS policy work, cả <code>&quot;x-amz-content-sha256&quot;</code>. Đừng mất thời gian tranh cãi viết hoa; không gì phụ thuộc vào nó.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — chỉnh CORS policy không có tác dụng ngay.</strong> Một số cloud propagate CORS thay đổi với lag 30-giây tới 5-phút. Đổi policy, chờ đủ một phút, rồi hard-refresh browser (Ctrl+Shift+R để phá cache preflight) trước khi quyết thay đổi không work.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Gần như mọi bug CORS map tới một trong bốn archetype — origin lệch, method không allowed, header không allowed, hoặc response header không expose — và vá luôn cùng hình dạng (thêm item thiếu vào list <code>Allowed*</code> / <code>ExposeHeaders</code> tương ứng); debug là so ba-chiều năm giây giữa header Request của browser, header Response CORS, và config policy trong Cloudflare hoặc AWS.</p>
</div>

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
              'Any website can upload to your bucket if they somehow get a signed URL (leaked, phishing). Restrict to your explicit domain(s) in production|||Bất kỳ website nào cũng upload được nếu họ lấy được signed URL (leak, phishing). Restrict tới domain explicit trong production',
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
