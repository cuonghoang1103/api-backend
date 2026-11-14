import G04_1 from './giang/obj-04-1.mjs';
import G04_2 from './giang/obj-04-2.mjs';
const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 4 — Presigned upload security|||Chương 4 — Bảo mật presigned upload',
  slug: 'os-ch4-presign',
  description: 'Ba bài về presigned PUT — kể cả bug SigV4 signableHeaders XSS thật mà kho này bắt được (comment ở r2.ts) và cách vá.',
  sortOrder: 5,
  lessons: [

    {
      title: '4.1 — Why direct upload from browser: bypass server limits|||4.1 — Vì sao upload trực tiếp từ browser: bypass giới hạn server',
      slug: 'os-4-1-vi-sao',
      type: 'VIDEO',
      description: 'Cloudflare proxy có limit 100 MB body. File lớn phải upload TRỰC TIẾP tới R2, bypass server. Backend chỉ cấp URL signed.',
      content: `
${G04_1}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Why direct upload from browser: bypass server limits</h2>
<p class="lead">User uploads a 500 MB video. Naive: POST to your API, backend forwards to R2. Result: Cloudflare proxy strips at 100 MB, or your Express server holds the whole file in RAM (measured below: one 150 MiB upload through multer memoryStorage added ~298 MB; three at once peaked at ~976 MB). Direct upload solves both.</p>

<h3>Three approaches compared</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Naive: POST to API</span><span class="lz-nsub">breaks at ~100 MB</span></span>
<span class="lz-nbody">Client POST file to /api/upload → backend receive in RAM → forward to R2. Fails on Cloudflare 100 MB limit; backend RAM exhaustion; slow (double-hop).</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Streaming via API</span><span class="lz-nsub">complex, still slow</span></span>
<span class="lz-nbody">Backend stream body → S3 multipart. Solves RAM issue but still Cloudflare limit + double network hop. Complex code.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Presigned PUT direct</span><span class="lz-nsub">the standard</span></span>
<span class="lz-nbody">Backend generate signed URL → client PUT DIRECTLY to R2. No 100 MB limit, no backend memory, single-hop upload. R2 verifies signature.</span>
</div>
</div>

<h3>This repo's flow — the real routes (src/routes/upload.routes.ts:355–407 + frontend/src/lib/api.ts:415, trimmed)</h3>
<pre><code class="language-ts">// 1. Client request signed URL from backend
POST /api/v1/files/upload/presign-r2
{ filename: 'video.mp4', contentType: 'video/mp4', size: 157286400 }

// 2. Backend generate signed URL
router.post('/upload/presign-r2', authenticate, async (req, res, next) =&gt; {
  const { filename, contentType, size } = req.body ?? {};
  if (!contentType?.startsWith('video/')) throw new AppError('Only video uploads may use the direct path', 400, 'INVALID_CONTENT_TYPE');
  if (!(Number(size) &gt; 0) || Number(size) &gt; config.maxFileSizeVideo) throw new AppError('Video exceeds the limit', 400, 'FILE_TOO_LARGE');
  const key = buildKey('video', filename, { userId: req.userId });   // video/u42/&lt;ms&gt;-&lt;12 hex&gt;.mp4
  const uploadUrl = await getSignedUploadUrl(key, contentType, 3600);
  res.json({ success: true, data: { uploadUrl, key, method: 'PUT', headers: { 'Content-Type': contentType }, expiresIn: 3600 } });
});

// 3. Client PUT file directly to R2
xhr.open('PUT', uploadUrl);
xhr.setRequestHeader('Content-Type', file.type);
xhr.send(file);   // 500 MB straight to R2, bypass server

// 4. Client tells the backend it is done — the server HEADs the object for the real size, it never trusts one from the client
POST /api/v1/files/upload/presign-r2/complete
{ key: 'video/u42/1794642946803-95273f952b8e.mp4', originalName: 'video.mp4' }
</code></pre>

<div class="callout ok">
<p><strong>Three calls, three parties.</strong> Client ↔ backend (auth + presign), client ↔ R2 (upload), client ↔ backend (register). The backend never touches the file bytes.</p>
</div>

<h3>Cloudflare 100 MB limit</h3>
<div class="out">Cloudflare proxy, max request body (developers.cloudflare.com/workers/platform/limits, read 14/11/2026):
  Free 100 MB · Pro 100 MB · Business 200 MB · Enterprise up to 5 GB (self-serve)
Over the limit -&gt; 413, and your server never sees the request.

$ curl -sI https://cuongthai.com          # 14/11/2026
server: nginx/1.27.5                      # no cf-ray -&gt; the API is NOT proxied by Cloudflare today
$ curl -sI https://media.cuongthai.com
server: cloudflare
cf-ray: …                                 # the media domain IS behind Cloudflare
</div>

<h3>Trade off: complexity</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">The client code gets more complex</span><span class="lz-d">The frontend has to request a presign, PUT to R2, and then notify completion. It is no longer one API call.</span></div>
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">The security gets more subtle</span><span class="lz-d">The SigV4 signature must pin the content type (Lesson 4.2). This repo had a bug exactly there.</span></div>
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">Retry harder</span><span class="lz-d">A network drop mid-PUT means the client has to retry itself (the SDK will not). Multipart makes resuming possible.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — never setting CORS on the bucket.</strong> A browser PUT to R2 is cross-origin, so the bucket must allow PUT from your site's origin. Chapter 5 covers the CORS setup.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Uploading directly from the browser to R2 with a presigned PUT URL sidesteps Cloudflare's 100 MB proxy limit, backend RAM exhaustion, and double-hop latency — the trade is more complex client code (presign → PUT → notify) and a security requirement to pin the content type via signableHeaders (Lesson 4.2).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build the three-step flow: a backend route returns a presigned PUT URL for a key; the browser PUTs the file straight to R2; a second route records the finished key in your DB.</li>
<li>Upload a file larger than 100 MB through the direct flow and confirm it succeeds — then check with <code>curl -sI</code> whether your API is behind the Cloudflare proxy at all (a <code>cf-ray</code> header): only then would the same file proxied hit the 100 MB limit.</li>
<li>Watch your backend RAM during the direct upload: it stays flat, because the bytes never pass through the server.</li>
<li>Write down the two downsides this buys: more client code (presign→PUT→notify) and the signableHeaders security requirement you will fix in 4.2.</li>
</ol>
<p><strong>Done when:</strong> a &gt;100 MB file uploaded browser→R2 directly, backend RAM stayed flat, and the key was recorded by the notify step.</p></div>

<h3>🔬 Measured: one 150 MiB video, two roads, same server</h3>
<p>Local MinIO, Express 4.22.2 + multer 1.4.5-lts.2 (this repo's versions) with this repo's <code>memoryStorage</code> setting, SDK v3 3.1071.0. Nothing here touches the real bucket. The presign/complete handlers are copies of the real ones.</p>
<div class="out">$ echo "v150.mp4: $(stat -f %z v150.mp4) byte (150 MiB, video giả)"
v150.mp4: 157286400 byte (150 MiB, video giả)
$ curl -X POST :20210/reset; bash tai-len.sh v150.mp4 video/mp4; curl :20210/do
1 presign  ⇒ key video/u42/1794642946803-95273f952b8e.mp4 · X-Amz-SignedHeaders=content-type%3Bhost · X-Amz-Expires=3600
2 PUT thẳng lên bucket ⇒ HTTP 200 · 157286400 byte · 1.388545 s
3 complete ⇒ {"key":"video/u42/1794642946803-95273f952b8e.mp4","size":157286400,"contentType":"video/mp4"}
{"ram_truoc_MB":85.3,"ram_dinh_MB":87.5,"tang_MB":2.3,"byte_qua_may_chu":0}
$ curl -X POST :20210/reset; curl -F file=@v150.mp4 :20210/upload; curl :20210/do
(A) POST /upload ⇒ HTTP 201 · 1.643900 s
{"ram_truoc_MB":87.8,"ram_dinh_MB":386.1,"tang_MB":298.3,"byte_qua_may_chu":157286597}
$ for i in 1 2 3; do bash tai-len.sh v150.mp4 video/mp4 &amp; done; wait; curl :20210/do
(B) ×3: {"ram_truoc_MB":386.2,"ram_dinh_MB":386.3,"tang_MB":0.1,"byte_qua_may_chu":0}
$ for i in 1 2 3; do curl -F file=@v150.mp4 :20210/upload &amp; done; wait; curl :20210/do
(A) ×3: {"ram_truoc_MB":375.5,"ram_dinh_MB":975.6,"tang_MB":600.1,"byte_qua_may_chu":471859791}</div>
<p>Through the server one upload added ~298 MB of RAM — about twice the file (the received chunks plus the concatenated buffer) — and three at once peaked at 975.6 MB. With the presigned PUT the server added 2.3 MB and received 0 bytes of the file. On one machine the timings are close; across the internet the server road sends every byte twice.</p>
<h3>🔬 Measured: a proxy with a 100 MB body limit</h3>
<p>nginx with <code>client_max_body_size 100m</code> plays the role of Cloudflare Free/Pro in front of the same server (a simulation — the real limits are in the table above):</p>
<div class="out">$ curl -F file=@v90.mp4 :20204/upload       # 90 MiB qua proxy trần 100 MB
90 MiB  qua proxy trần 100 MB ⇒ HTTP 201
$ curl -F file=@v150.mp4 :20204/upload      # 150 MiB qua proxy trần 100 MB
&lt;title&gt;413 Request Entity Too Large&lt;/title&gt;
150 MiB qua proxy trần 100 MB ⇒ HTTP 413
$ curl -T v150.mp4 -H 'Content-Type: video/mp4' "$(xin URL ở :20204/presign)"
150 MiB, URL ký sẵn, PUT thẳng bucket ⇒ HTTP 200</div>
<p>The presign request is a few hundred bytes, so it passes the proxy; the 150 MiB PUT goes to the bucket, which is not behind it.</p>
<h3>🔬 Measured: the guards of the real flow</h3>
<div class="out">$ curl -X POST :20210/presign -d '{"filename":"a.png","contentType":"image/png","size":1000}'
{"code":"INVALID_CONTENT_TYPE","message":"Only video uploads may use the direct path"}
$ curl -X POST :20210/presign -d '{"filename":"phim.mp4","contentType":"video/mp4","size":629145600}'
{"code":"FILE_TOO_LARGE","message":"Video exceeds the 500MB limit"}
$ curl -X POST :20210/complete -d '{"key":"video/u42/chua-tai-len.mp4"}'
{"code":"OBJECT_NOT_FOUND","message":"Uploaded object not found — did the PUT succeed?"}</div>
<p>Every limit on the road, in this repo: Cloudflare proxy (only if the record is proxied — not the API today), nginx <code>client_max_body_size 500m</code>, multer 160 MB held in RAM (<code>upload.routes.ts:46–51</code>), the direct path's declared size <code>MAX_FILE_SIZE_VIDEO</code> (default 524288000, <code>env.ts:80</code>), and R2's single PUT at 4.995 GiB. The smallest one on your road wins.</p>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>You have met this:</strong> sending a 1 GB video in a chat app (the bytes go to storage, the chat server gets a reference); a school portal answering <code>413 Request Entity Too Large</code> on a big assignment — a body limit, not a broken file.</li>
<li><strong>What if the user closes the tab after the PUT?</strong> The object exists, <code>complete</code> never runs, and no database row points to it — an orphan (Chapter 6).</li>
<li><strong>The attacker:</strong> declare 5 MB, PUT 150 MiB, and reuse the URL (lab server with a 100 MB test limit):</li>
</ul>
<div class="out">$ bash tai-len.sh v150.mp4 video/mp4 5242880
1 presign  ⇒ key video/u42/1794642968947-b5fd46cff483.mp4 · X-Amz-SignedHeaders=content-type%3Bhost · X-Amz-Expires=3600
2 PUT thẳng lên bucket ⇒ HTTP 200 · 157286400 byte · 1.079800 s
3 complete ⇒ {"code":"FILE_TOO_LARGE","message":"Uploaded object exceeds the video size limit"}
$ aws s3 ls s3://media-ch4/$(cat key-cuoi.txt)
2026-11-14 14:56:10  157286400 1794642968947-b5fd46cff483.mp4
$ curl -T khac.mp4 -H 'Content-Type: video/mp4' "$(cat url-cuoi.txt)"; aws s3 ls …   # 1000 byte, cùng URL
PUT lần 2 cùng URL ⇒ HTTP 200
2026-11-14 14:56:10       1000 1794642968947-b5fd46cff483.mp4</div>
<p>The signature pins the key, the method, the expiry and (here) the content type — not the size and not the number of uses. Defend: sign <code>content-length</code> (Lesson 4.2) or use a presigned POST with <code>content-length-range</code>; delete the object when <code>complete</code> refuses it; record a pending row when you sign, not when the client reports back; keep <code>expiresIn</code> in minutes.</p>
<h3>🔁 Run it yourself</h3>
<p>Start MinIO, write a small Express server with a multer <code>memoryStorage</code> route and a presign route, sample <code>process.memoryUsage().rss</code> every few milliseconds, and upload a 150 MiB file both ways. Put <code>nginx</code> with <code>client_max_body_size 100m</code> in front and find the 413. Then run <code>curl -sI</code> against your own domain and look for <code>cf-ray</code>.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-1-nhan-file-multipart" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 10.1 — Receiving files: multipart, base64, and the price paid in RAM</span><span class="lc-sub">Why buffering a whole upload is expensive, measured</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 10.2 — Object storage and presigned URLs</span><span class="lc-sub">Presigned POST with content-length-range: the size fix</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Presigned PUT URL</span><span class="v">A time-limited URL that lets the browser upload one object directly to R2.</span></div>
  <div class="kv"><span class="k">Direct upload</span><span class="v">Browser→R2 with no bytes through your server.</span></div>
  <div class="kv"><span class="k">100 MB proxy limit</span><span class="v">Cloudflare's request body cap that a proxied upload would hit.</span></div>
  <div class="kv"><span class="k">presign → PUT → notify</span><span class="v">The three-step flow: get URL, upload, tell the backend it's done.</span></div>
  <div class="kv"><span class="k">Double-hop latency</span><span class="v">The extra time of routing bytes client→server→R2 instead of client→R2.</span></div>
  <div class="kv"><span class="k">signableHeaders</span><span class="v">The signed-header set that pins content-type — the 4.2 security fix.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A presigned PUT lets the browser upload straight to R2, past Cloudflare's 100 MB limit, backend RAM, and double-hop latency.</li><li>The cost is a three-step client flow: presign → PUT → notify.</li><li>Direct upload needs a security requirement — pin the content type via signableHeaders (Lesson 4.2).</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Request body size limits</span><span class="lc-sub">developers.cloudflare.com/workers/platform/limits — request body: Free/Pro 100 MB, Business 200 MB, Enterprise up to 5 GB (read 14/11/2026).</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Vì sao upload trực tiếp từ browser: bypass giới hạn server</h2>
<p class="lead">User upload video 500 MB. Ngây thơ: POST tới API, backend forward tới R2. Kết quả: Cloudflare proxy strip ở 100 MB, hoặc Express server giữ cả tệp trong RAM (đo bên dưới: một lượt 150 MiB qua multer memoryStorage tăng ~298 MB; ba lượt cùng lúc chạm đỉnh ~976 MB). Direct upload giải quyết cả hai.</p>

<h3>Ba approach so sánh</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Ngây thơ: POST API</span><span class="lz-nsub">vỡ ở ~100 MB</span></span>
<span class="lz-nbody">Client POST file tới /api/upload → backend receive vào RAM → forward tới R2. Fail ở Cloudflare 100 MB limit; backend RAM exhaustion; chậm (double-hop).</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Streaming qua API</span><span class="lz-nsub">phức tạp, vẫn chậm</span></span>
<span class="lz-nbody">Backend stream body → S3 multipart. Giải quyết RAM nhưng vẫn Cloudflare limit + double network hop. Code phức tạp.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Presigned PUT direct</span><span class="lz-nsub">chuẩn</span></span>
<span class="lz-nbody">Backend generate signed URL → client PUT TRỰC TIẾP tới R2. Không 100 MB limit, không backend memory, single-hop upload. R2 verify signature.</span>
</div>
</div>

<h3>Luồng của kho — route thật (src/routes/upload.routes.ts:355–407 + frontend/src/lib/api.ts:415, rút gọn)</h3>
<pre><code class="language-ts">// 1. Client request signed URL từ backend
POST /api/v1/files/upload/presign-r2
{ filename: 'video.mp4', contentType: 'video/mp4', size: 157286400 }

// 2. Backend generate signed URL
router.post('/upload/presign-r2', authenticate, async (req, res, next) =&gt; {
  const { filename, contentType, size } = req.body ?? {};
  if (!contentType?.startsWith('video/')) throw new AppError('Only video uploads may use the direct path', 400, 'INVALID_CONTENT_TYPE');
  if (!(Number(size) &gt; 0) || Number(size) &gt; config.maxFileSizeVideo) throw new AppError('Video exceeds the limit', 400, 'FILE_TOO_LARGE');
  const key = buildKey('video', filename, { userId: req.userId });   // video/u42/&lt;ms&gt;-&lt;12 hex&gt;.mp4
  const uploadUrl = await getSignedUploadUrl(key, contentType, 3600);
  res.json({ success: true, data: { uploadUrl, key, method: 'PUT', headers: { 'Content-Type': contentType }, expiresIn: 3600 } });
});

// 3. Client PUT file trực tiếp tới R2
xhr.open('PUT', uploadUrl);
xhr.setRequestHeader('Content-Type', file.type);
xhr.send(file);   // 500 MB thẳng tới R2, bypass server

// 4. Client tells the backend it is done — the server HEADs the object for the real size, it never trusts one from the client
POST /api/v1/files/upload/presign-r2/complete
{ key: 'video/u42/1794642946803-95273f952b8e.mp4', originalName: 'video.mp4' }
</code></pre>

<div class="callout ok">
<p><strong>Ba lời gọi, ba bên.</strong> Client ↔ backend (auth + presign), client ↔ R2 (upload), client ↔ backend (register). Backend không bao giờ chạm file bytes.</p>
</div>

<h3>Cloudflare 100 MB limit</h3>
<div class="out">Cloudflare proxy, max request body (developers.cloudflare.com/workers/platform/limits, read 14/11/2026):
  Free 100 MB · Pro 100 MB · Business 200 MB · Enterprise up to 5 GB (self-serve)
Over the limit -&gt; 413, and your server never sees the request.

$ curl -sI https://cuongthai.com          # 14/11/2026
server: nginx/1.27.5                      # no cf-ray -&gt; the API is NOT proxied by Cloudflare today
$ curl -sI https://media.cuongthai.com
server: cloudflare
cf-ray: …                                 # the media domain IS behind Cloudflare
</div>

<h3>Trade off: complexity</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">Client code phức tạp hơn</span><span class="lz-d">FE phải handle presign request, PUT to R2, notify complete. Không chỉ 1 API call.</span></div>
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">Security phức tạp hơn</span><span class="lz-d">SigV4 signature phải pin content type (Bài 4.2). Kho này đã có bug ở đây.</span></div>
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">Retry harder</span><span class="lz-d">Network drop giữa PUT → client tự retry (SDK không có sẵn). Multipart giúp resume.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — không set CORS trên bucket.</strong> Browser PUT tới R2 = cross-origin. Bucket phải allow PUT từ site origin. Chương 5 dạy CORS setup.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Direct upload từ browser đến R2 với presigned PUT URL bypass Cloudflare 100 MB proxy limit + backend RAM exhaustion + double-hop latency — trade off là client code phức tạp hơn (presign → PUT → notify) và security cần pin content type qua signableHeaders (Bài 4.2).</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng flow ba bước: một route backend trả presigned PUT URL cho một key; browser PUT file thẳng lên R2; một route thứ hai ghi key đã xong vào DB.</li>
<li>Upload một file lớn hơn 100 MB qua flow trực tiếp và xác nhận thành công — rồi kiểm bằng <code>curl -sI</code> xem API của bạn có thật sự đứng sau proxy Cloudflare không (header <code>cf-ray</code>): chỉ khi đó cùng tệp đi qua proxy mới chạm trần 100 MB.</li>
<li>Theo dõi RAM backend trong lúc upload trực tiếp: nó phẳng, vì byte không bao giờ qua server.</li>
<li>Ghi lại hai nhược điểm đổi lại: nhiều client code hơn (presign→PUT→notify) và yêu cầu security signableHeaders bạn sẽ vá ở 4.2.</li>
</ol>
<p><strong>Đạt khi:</strong> một file &gt;100 MB upload browser→R2 trực tiếp, RAM backend phẳng, và key được bước notify ghi lại.</p></div>

<h3>🔬 Đo thật: một video 150 MiB, hai con đường, cùng một máy chủ</h3>
<p>MinIO cục bộ, Express 4.22.2 + multer 1.4.5-lts.2 (đúng bản của kho) với cấu hình <code>memoryStorage</code> của kho, SDK v3 3.1071.0. Không lệnh nào chạm bucket thật. Hai handler presign/complete chép từ route thật.</p>
<div class="out">$ echo "v150.mp4: $(stat -f %z v150.mp4) byte (150 MiB, video giả)"
v150.mp4: 157286400 byte (150 MiB, video giả)
$ curl -X POST :20210/reset; bash tai-len.sh v150.mp4 video/mp4; curl :20210/do
1 presign  ⇒ key video/u42/1794642946803-95273f952b8e.mp4 · X-Amz-SignedHeaders=content-type%3Bhost · X-Amz-Expires=3600
2 PUT thẳng lên bucket ⇒ HTTP 200 · 157286400 byte · 1.388545 s
3 complete ⇒ {"key":"video/u42/1794642946803-95273f952b8e.mp4","size":157286400,"contentType":"video/mp4"}
{"ram_truoc_MB":85.3,"ram_dinh_MB":87.5,"tang_MB":2.3,"byte_qua_may_chu":0}
$ curl -X POST :20210/reset; curl -F file=@v150.mp4 :20210/upload; curl :20210/do
(A) POST /upload ⇒ HTTP 201 · 1.643900 s
{"ram_truoc_MB":87.8,"ram_dinh_MB":386.1,"tang_MB":298.3,"byte_qua_may_chu":157286597}
$ for i in 1 2 3; do bash tai-len.sh v150.mp4 video/mp4 &amp; done; wait; curl :20210/do
(B) ×3: {"ram_truoc_MB":386.2,"ram_dinh_MB":386.3,"tang_MB":0.1,"byte_qua_may_chu":0}
$ for i in 1 2 3; do curl -F file=@v150.mp4 :20210/upload &amp; done; wait; curl :20210/do
(A) ×3: {"ram_truoc_MB":375.5,"ram_dinh_MB":975.6,"tang_MB":600.1,"byte_qua_may_chu":471859791}</div>
<p>Qua máy chủ, một lượt tải tăng ~298 MB RAM — khoảng gấp đôi tệp (các mảnh nhận về cộng bản ghép lại) — và ba lượt cùng lúc chạm đỉnh 975,6 MB. Với URL ký sẵn, máy chủ chỉ tăng 2,3 MB và nhận 0 byte của tệp. Trên một máy thì thời gian hai đường xấp xỉ nhau; qua internet, đường qua máy chủ phải gửi mỗi byte hai lần.</p>
<h3>🔬 Đo thật: proxy có trần thân request 100 MB</h3>
<p>nginx với <code>client_max_body_size 100m</code> đóng vai Cloudflare Free/Pro trước cùng máy chủ đó (mô phỏng — trần thật nằm trong bảng ở trên):</p>
<div class="out">$ curl -F file=@v90.mp4 :20204/upload       # 90 MiB qua proxy trần 100 MB
90 MiB  qua proxy trần 100 MB ⇒ HTTP 201
$ curl -F file=@v150.mp4 :20204/upload      # 150 MiB qua proxy trần 100 MB
&lt;title&gt;413 Request Entity Too Large&lt;/title&gt;
150 MiB qua proxy trần 100 MB ⇒ HTTP 413
$ curl -T v150.mp4 -H 'Content-Type: video/mp4' "$(xin URL ở :20204/presign)"
150 MiB, URL ký sẵn, PUT thẳng bucket ⇒ HTTP 200</div>
<p>Lời xin URL chỉ vài trăm byte nên lọt proxy; lượt PUT 150 MiB đi thẳng tới bucket, vốn không đứng sau proxy đó.</p>
<h3>🔬 Đo thật: các chốt của luồng thật</h3>
<div class="out">$ curl -X POST :20210/presign -d '{"filename":"a.png","contentType":"image/png","size":1000}'
{"code":"INVALID_CONTENT_TYPE","message":"Only video uploads may use the direct path"}
$ curl -X POST :20210/presign -d '{"filename":"phim.mp4","contentType":"video/mp4","size":629145600}'
{"code":"FILE_TOO_LARGE","message":"Video exceeds the 500MB limit"}
$ curl -X POST :20210/complete -d '{"key":"video/u42/chua-tai-len.mp4"}'
{"code":"OBJECT_NOT_FOUND","message":"Uploaded object not found — did the PUT succeed?"}</div>
<p>Mọi giới hạn trên đường đi, trong kho này: proxy Cloudflare (chỉ khi bản ghi DNS bật proxy — API hiện không bật), nginx <code>client_max_body_size 500m</code>, multer 160 MB giữ trong RAM (<code>upload.routes.ts:46–51</code>), kích thước khai của đường thẳng <code>MAX_FILE_SIZE_VIDEO</code> (mặc định 524288000, <code>env.ts:80</code>), và R2 nhận một lượt PUT tới 4,995 GiB. Giới hạn nhỏ nhất trên đường của bạn sẽ thắng.</p>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Bạn đã gặp:</strong> gửi video 1 GB trong ứng dụng chat (byte đi vào kho lưu trữ, máy chủ chat chỉ nhận một tham chiếu); cổng nộp bài của trường báo <code>413 Request Entity Too Large</code> khi tệp lớn — đó là trần thân request, không phải tệp hỏng.</li>
<li><strong>Nếu người dùng đóng tab ngay sau khi PUT thì sao?</strong> Object đã nằm đó, <code>complete</code> không bao giờ chạy, không hàng database nào trỏ tới nó — object mồ côi (Chương 6).</li>
<li><strong>Kẻ xấu:</strong> khai 5 MB, PUT 150 MiB, rồi dùng lại URL (máy chủ thử đặt trần 100 MB):</li>
</ul>
<div class="out">$ bash tai-len.sh v150.mp4 video/mp4 5242880
1 presign  ⇒ key video/u42/1794642968947-b5fd46cff483.mp4 · X-Amz-SignedHeaders=content-type%3Bhost · X-Amz-Expires=3600
2 PUT thẳng lên bucket ⇒ HTTP 200 · 157286400 byte · 1.079800 s
3 complete ⇒ {"code":"FILE_TOO_LARGE","message":"Uploaded object exceeds the video size limit"}
$ aws s3 ls s3://media-ch4/$(cat key-cuoi.txt)
2026-11-14 14:56:10  157286400 1794642968947-b5fd46cff483.mp4
$ curl -T khac.mp4 -H 'Content-Type: video/mp4' "$(cat url-cuoi.txt)"; aws s3 ls …   # 1000 byte, cùng URL
PUT lần 2 cùng URL ⇒ HTTP 200
2026-11-14 14:56:10       1000 1794642968947-b5fd46cff483.mp4</div>
<p>Chữ ký khoá key, phương thức, hạn và (ở đây) loại nội dung — không khoá kích thước, không khoá số lần dùng. Cách phòng: ký <code>content-length</code> (Bài 4.2) hoặc dùng presigned POST có <code>content-length-range</code>; xoá object khi <code>complete</code> từ chối; ghi hàng chờ ngay lúc ký chứ không đợi client báo; giữ <code>expiresIn</code> tính bằng phút.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Bật MinIO, viết một máy chủ Express nhỏ có route multer <code>memoryStorage</code> và route presign, lấy mẫu <code>process.memoryUsage().rss</code> vài mili giây một lần, rồi tải tệp 150 MiB theo cả hai đường. Đặt <code>nginx</code> với <code>client_max_body_size 100m</code> phía trước để thấy 413. Cuối cùng chạy <code>curl -sI</code> vào tên miền của chính bạn và tìm <code>cf-ray</code>.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-1-nhan-file-multipart" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 10.1 — Nhận file: multipart, base64, và cái giá phải trả bằng RAM</span><span class="lc-sub">Vì sao giữ cả tệp tải lên trong RAM lại đắt, đo thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 10.2 — Object storage và URL ký sẵn</span><span class="lc-sub">Presigned POST có content-length-range: cách khoá kích thước</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Presigned PUT URL</span><span class="v">URL có hạn cho browser upload một object thẳng lên R2.</span></div>
  <div class="kv"><span class="k">Direct upload</span><span class="v">Browser→R2 không byte nào qua server bạn.</span></div>
  <div class="kv"><span class="k">100 MB proxy limit</span><span class="v">Giới hạn body request của Cloudflare mà upload proxy sẽ chạm.</span></div>
  <div class="kv"><span class="k">presign → PUT → notify</span><span class="v">Flow ba bước: lấy URL, upload, báo backend đã xong.</span></div>
  <div class="kv"><span class="k">Double-hop latency</span><span class="v">Thời gian thừa khi định tuyến byte client→server→R2 thay vì client→R2.</span></div>
  <div class="kv"><span class="k">signableHeaders</span><span class="v">Tập header được ký, pin content-type — bản vá security ở 4.2.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Presigned PUT cho browser upload thẳng lên R2, vượt giới hạn 100 MB của Cloudflare, RAM backend, và double-hop latency.</li><li>Cái giá là flow client ba bước: presign → PUT → notify.</li><li>Direct upload cần một yêu cầu security — pin content type qua signableHeaders (Bài 4.2).</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Request body size limits</span><span class="lc-sub">developers.cloudflare.com/workers/platform/limits — request body: Free/Pro 100 MB, Business 200 MB, Enterprise up to 5 GB (read 14/11/2026).</span></span></div>
</div>
`,
    },

    {
      title: '4.2 — The SigV4 signableHeaders XSS bug|||4.2 — Bug SigV4 signableHeaders XSS',
      slug: 'os-4-2-sigv4-bug',
      type: 'VIDEO',
      description: 'Kho này bắt được: presigned PUT không pin ContentType → attacker upload text/html → stored XSS trên media domain. Bug thật, đã vá, có test đối chứng.',
      content: `
${G04_2}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>The SigV4 signableHeaders XSS bug</h2>
<p class="lead">This repo has a comment in r2.ts documenting a real security incident. Someone caught that presigned PUT URLs, without explicit signableHeaders, only sign the <code>host</code> header. That means a client can take a signed URL for &quot;upload video/mp4&quot; and instead PUT text/html — which R2 then serves as HTML from the media domain. Stored XSS.</p>

<h3>The vulnerable code</h3>
<pre><code class="language-ts">// VULNERABLE
const cmd = new PutObjectCommand({
  Bucket, Key, ContentType: 'video/mp4',
});
const url = await getSignedUrl(client, cmd, { expiresIn: 3600 });
// SDK default: signs only 'host' header
// -&gt; ContentType in cmd is now just a DEFAULT, not signed
// -&gt; client can PUT with any Content-Type
</code></pre>

<h3>The attack (illustrative — reproduced for real on MinIO further down)</h3>
<pre><code class="language-bash"># Attacker requests signed URL for a legit video upload
$ curl -X POST /api/v1/files/upload/presign-r2 -d '{"filename":"a.mp4","contentType":"video/mp4","size":1000}'
{ "uploadUrl": "https://xxx.r2.cloudflarestorage.com/bucket/key?X-Amz-...&X-Amz-SignedHeaders=host&X-Amz-Signature=..." }

# Attacker uploads HTML instead of video
$ curl -X PUT "$UPLOAD_URL" \\
    -H "Content-Type: text/html" \\
    -d "&lt;script&gt;alert('xss')&lt;/script&gt;"
# R2 responds 200 — signature only bound host, not content-type

# Now media.cuongthai.com/key serves HTML
$ curl https://media.cuongthai.com/key -I
HTTP/2 200
content-type: text/html    &lt;- stored XSS on media domain!
</code></pre>

<div class="callout warn">
<p><strong>Content-Type on PutObjectCommand is not enough.</strong> It only sets a DEFAULT ContentType. An attacker can override it on the PUT request if the signature does not bind the content-type header.</p>
</div>

<h3>The fix — this repo's current code</h3>
<pre><code class="language-ts">// FIXED — src/config/r2.ts:158 (real code; the SECURITY comment is lines 140–157)
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 3600,
): Promise&lt;string&gt; {
  const client = getR2Client();
  const cmd = new PutObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, cmd, {
    expiresIn: expiresInSeconds,
    signableHeaders: new Set(['content-type']),   // KEY FIX — host is always signed
  });
}
</code></pre>

<h3>This repo's comment tells the story</h3>
<pre><code class="language-text">// SECURITY: signableHeaders is what actually pins the content type.
// Without it SigV4 signs only host (X-Amz-SignedHeaders: host), and the
// ContentType passed to PutObjectCommand degrades to a mere DEFAULT — a
// client can take the signed URL and PUT Content-Type: text/html, which
// R2 stores and later serves as HTML from media.cuongthai.com (stored XSS
// on the media domain). Verified against a real S3 endpoint: with host
// only, a text/html PUT returns 200 and the object comes back
// content-type: text/html; with content-type signed it returns 403.
</code></pre>

<h3>Verify — real test</h3>
<pre><code class="language-bash"># Test with WRONG content type (FIXED)
$ curl -X PUT "$UPLOAD_URL" -H "Content-Type: text/html" -d "&lt;script&gt;"
&lt;Error&gt;
  &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
  &lt;Message&gt;The request signature we calculated does not match...&lt;/Message&gt;
&lt;/Error&gt;
403 Forbidden — signature pins content-type
</code></pre>

<div class="callout ok">
<p><strong>Client MUST send exact Content-Type used at signing.</strong> This repo's frontend code (frontend/src/lib/api.ts):
<code>xhr.setRequestHeader(&#39;Content-Type&#39;, file.type)</code> — same file.type passed to /presign-r2. Signature matches. Any deviation = 403.</p>
</div>

<h3>Other headers to pin</h3>
<pre><code class="language-ts">signableHeaders: new Set([
  'host',
  'content-type',        // Pin file type (from vulnerability above)
  'content-length',      // Pin file SIZE if you know it — prevent oversized upload
  // x-amz-meta-*: set Metadata on the command instead — the SDK hoists it into the SIGNED query (measured below)
]),
</code></pre>

<div class="pitfall">
<p><strong>Trap — testing presigned upload only on the &quot;happy path&quot;.</strong> QA uploads a valid video, it works, you ship. Nobody notices the attack surface until a security audit. Test with the WRONG content-type explicitly in your suite.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A presigned PUT with only ContentType on PutObjectCommand is not secure — the SDK signs only &#39;host&#39; by default, so an attacker can override the content-type to text/html and create stored XSS on your media domain; the fix is <code>signableHeaders: new Set([&#39;content-type&#39;])</code> — this repo caught it, fixed it, and left a comment explaining it.</p>
</div>

<h3>How an unsigned header becomes an XSS</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The client asks for a presigned URL</span><span class="lz-d">And supplies the content type it intends to upload with, because the server cannot know it in advance.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The server signs the request, but not that header</span><span class="lz-d"><code>signableHeaders</code> omits <code>content-type</code>, so the signature is valid for the URL regardless of what type is actually sent.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">So the uploader can change it after signing</span><span class="lz-d">The signature still verifies. The object lands with <code>text/html</code> instead of the image type the server approved.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">And the bucket serves it as a page</span><span class="lz-d">Any visitor opening that object URL executes the attacker's script, on the bucket's origin. The fix is one line: sign the header you care about.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In <code>src/config/r2.ts</code> read <code>getSignedUploadUrl</code> and its SECURITY comment; find the line <code>signableHeaders: new Set(['content-type'])</code>.</li>
<li>Generate a presigned PUT URL for <code>image/jpeg</code> (sandbox, or a local MinIO via <code>STORAGE_SANDBOX_ENDPOINT=http://localhost:9000</code>). In the URL query, confirm <code>X-Amz-SignedHeaders</code> lists <code>content-type</code>.</li>
<li>Upload with the RIGHT type: <code>curl -T ./a.jpg "$URL" -H "Content-Type: image/jpeg"</code> → expect <code>200</code>.</li>
<li>Attack it: <code>curl -X PUT "$URL" -H "Content-Type: text/html" --data "&lt;script&gt;alert(1)&lt;/script&gt;"</code> → expect <code>403 SignatureDoesNotMatch</code>.</li>
<li>Temporarily sign with host only (drop <code>content-type</code> from <code>signableHeaders</code>) and repeat step 4 — now the text/html PUT returns <code>200</code> and a later GET comes back <code>content-type: text/html</code>. Restore the fix.</li>
</ol>
<p><strong>Done when:</strong> you watched the SAME attack return 403 with the header signed and 200 without it, and can explain why <code>ContentType</code> on <code>PutObjectCommand</code> alone is only a default.</p></div>

<h3>🔬 Measured: the attack, end to end</h3>
<p>Local MinIO, SDK v3 3.1071.0, and nginx 1.27 playing the media CDN in front of the bucket. Nothing here touches the real bucket. The vulnerable URL signs only <code>host</code>:</p>
<div class="out">$ u=$(node ky-put.mjs video/u42/…-loi.mp4 video/mp4 host); echo $u | grep -o X-Amz-SignedHeaders=…
X-Amz-SignedHeaders=host
$ bash put.sh "$(cat u-loi.txt)" text/html mau.html
PUT Content-Type: text/html ⇒ HTTP 200 
$ curl -sD - -o /dev/null localhost:20202/video/u42/…-loi.mp4 | grep -iE '^HTTP|^content-type'
HTTP/1.1 200 OK
Content-Type: text/html</div>
<p>Opened in a real Chromium, the "video" is an HTML page and its script runs on the CDN's origin (it rewrote the page heading to say that a stranger's script is running on http://localhost:20202).</p>
<h3>🔬 Measured: the fix — one URL, four PUTs</h3>
<div class="out">$ u=$(node ky-put.mjs video/u42/…-va.mp4 video/mp4 ct); echo $u | grep -o X-Amz-SignedHeaders=…
X-Amz-SignedHeaders=content-type%3Bhost
$ bash put.sh "$(cat u-va.txt)" text/html mau.html
PUT Content-Type: text/html ⇒ HTTP 403 &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ bash put.sh "$(cat u-va.txt)" "" mau.html
PUT Content-Type: (không gửi) ⇒ HTTP 403 &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ bash put.sh "$(cat u-va.txt)" 'video/mp4; charset=utf-8' mau.html
PUT Content-Type: video/mp4; charset=utf-8 ⇒ HTTP 403 &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ head -c 2048 /dev/urandom &gt; that.mp4; bash put.sh "$(cat u-va.txt)" video/mp4 that.mp4
PUT Content-Type: video/mp4 ⇒ HTTP 200 
$ node -e "… cùng signingDate, signableHeaders ['content-type'] rồi ['host','content-type'] …"
["content-type"]           content-type;host 5e05c7b6e6f05f92…
["host","content-type"]    content-type;host 5e05c7b6e6f05f92…</div>
<p>The comparison is the exact string: no header, or <code>video/mp4; charset=utf-8</code>, is a different value and gets 403. And <code>['content-type']</code> vs <code>['host', 'content-type']</code> produce the same SignedHeaders and the same signature — host is always signed.</p>
<h3>🔬 Measured: the checksum the SDK signs for you</h3>
<div class="out">$ u=$(node ky-put.mjs video/u42/…-ck.mp4 video/mp4 goc); echo $u | grep -oE 'x-amz-(checksum|sdk)…'
x-amz-checksum-crc32=AAAAAA%3D%3D
x-amz-sdk-checksum-algorithm=CRC32
$ bash put.sh "$(cat u-ck.txt)" video/mp4 that.mp4; grep -o '&lt;Message&gt;[^&lt;]*&lt;/Message&gt;' body.bin
PUT Content-Type: video/mp4 ⇒ HTTP 200 
$ node -e "… zlib.crc32(thân rỗng) · zlib.crc32(that.mp4), in base64 …"
CRC32 thân RỖNG              = AAAAAA==
CRC32 that.mp4 (2048 byte)   = MaTh8g==
$ aws s3api head-object --bucket media-ch3 --key video/u42/…-ck.mp4 --checksum-mode ENABLED --query …
{"ContentLength":2048,"ChecksumCRC32":null}
$ u=$(node ky-put.mjs video/u42/…-ck2.mp4 video/mp4 ct); echo $u | grep -oE 'x-amz-(checksum|sdk)…'; bash put.sh "$u" video/mp4 that.mp4
(không có tham số checksum)
PUT Content-Type: video/mp4 ⇒ HTTP 200 </div>
<p>Since SDK 3.729 the default <code>WHEN_SUPPORTED</code> puts <code>x-amz-checksum-crc32=AAAAAA==</code> into a presigned PUT: the CRC32 of an <em>empty</em> body, computed at signing time. MinIO ignored it (200, no checksum stored); a provider that verifies it rejects every real file. This repo sets <code>requestChecksumCalculation: 'WHEN_REQUIRED'</code> (<code>src/config/r2.ts:83–88</code>).</p>
<h3>🔬 Measured: what else a signature can pin</h3>
<div class="out">$ u=$(node ky-them.mjs len video/u42/…-len.mp4); …; bash put.sh "$u" video/mp4 that.mp4; bash put.sh "$u" video/mp4 to.bin   # 2048 B rồi 150 MiB
X-Amz-SignedHeaders=content-length%3Bcontent-type%3Bhost
PUT Content-Type: video/mp4 ⇒ HTTP 200 
PUT Content-Type: video/mp4 ⇒ HTTP 403 &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ u=$(node ky-them.mjs meta video/u42/…-meta.mp4); …; bash put.sh "$u" video/mp4 that.mp4; aws s3api head-object … --query Metadata
x-amz-meta-user-id=42
PUT Content-Type: video/mp4 ⇒ HTTP 200 
{"user-id":"42"}
$ curl -X PUT --data-binary @that.mp4 -H 'x-amz-meta-user-id: 7' "\${u/user-id=42/user-id=7}"
sửa user-id=42 ⇒ 7 trong URL ⇒ HTTP 400 &lt;Code&gt;AccessDenied&lt;/Code&gt;</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>You have met the defence:</strong> GitHub serves raw user files from <code>raw.githubusercontent.com</code>, Google Drive previews come from <code>googleusercontent.com</code> — user bytes on a separate domain, so even HTML there cannot touch the main site.</li>
<li><strong>What if the route signs whatever type the client declares?</strong> Then pinning helps nothing — the attacker simply asks for <code>text/html</code>:</li>
</ul>
<div class="out">$ r=$(node xin-url.mjs text/html); bash put.sh "&lt;uploadUrl&gt;" text/html mau.html; curl -sD - -o /dev/null localhost:20202/&lt;key&gt; | grep …
PUT Content-Type: text/html ⇒ HTTP 200 
HTTP/1.1 200 OK
Content-Type: text/html
$ for t in text/html image/svg+xml 'TEXT/HTML; charset=utf-8' video/mp4; do node xin-url.mjs "$t" --loc; done
xin text/html ⇒ {"status":400,"code":"UNSAFE_FILE_TYPE","ct":"text/html"}
xin image/svg+xml ⇒ {"status":400,"code":"UNSAFE_FILE_TYPE","ct":"image/svg+xml"}
xin TEXT/HTML; charset=utf-8 ⇒ {"status":400,"code":"UNSAFE_FILE_TYPE","ct":"TEXT/HTML; charset=utf-8"}
xin video/mp4 ⇒ {"key":"user-files/u7/1794642976195-tep","uploadUrl":"http://localhost:20200/media-ch3/use…</div>
<p>Pinning is not validating. Allow-list the type <em>before</em> signing (lower-case it, strip <code>; parameters</code>, deny HTML/SVG/XML/JS — like <code>assertSafeUploadType</code> in <code>src/storage/uploadService.ts:337</code>), serve user files from a separate domain or with <code>Content-Disposition: attachment</code>, and put a wrong-type case in your test suite.</p>
<h3>🔁 Run it yourself</h3>
<p>On MinIO: sign a PUT without <code>signableHeaders</code>, PUT <code>text/html</code>, open the object in a browser. Add <code>signableHeaders: new Set(['content-type'])</code>, repeat (403), then try no header and <code>; charset=utf-8</code>. Print a URL from a client without <code>WHEN_REQUIRED</code> and find <code>x-amz-checksum-crc32</code>.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-2-xss-va-sanitize" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 9.2 — XSS: from a stranger's note to your login session</span><span class="lc-sub">What stored XSS does once it runs</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/media-processing/learn?lessonSlug=mp-2-1-svg" target="_blank" rel="noopener"><span class="lc-ico">🖼</span><span class="lc-body"><span class="lc-title">Media Processing · 2.1 — SVG: the image format that runs JavaScript</span><span class="lc-sub">Why image/svg+xml belongs on the deny list</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SigV4</span><span class="v">AWS Signature Version 4 — the signing protocol S3/R2 use to authenticate a request.</span></div>
  <div class="kv"><span class="k">signableHeaders</span><span class="v">The SDK option naming which headers the signature covers; default is <code>host</code> only.</span></div>
  <div class="kv"><span class="k">X-Amz-SignedHeaders</span><span class="v">Query param listing exactly which headers were signed — read it to audit a presigned URL.</span></div>
  <div class="kv"><span class="k">Stored XSS</span><span class="v">A script saved on the server and served back to visitors, running on the site's origin.</span></div>
  <div class="kv"><span class="k">SignatureDoesNotMatch</span><span class="v">The 403 R2/S3 returns when a signed header's value differs from what was signed.</span></div>
  <div class="kv"><span class="k">Default vs pinned</span><span class="v">ContentType on the command is a default the client may override; pinning it means the signature rejects any other value.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>By default the SDK signs only <code>host</code>, so <code>ContentType</code> on <code>PutObjectCommand</code> is just a default the client can override.</li><li>An attacker overrides it to <code>text/html</code> → R2 stores and serves HTML from the media domain → stored XSS on your origin.</li><li>The fix is one line: <code>signableHeaders: new Set(['content-type'])</code> — a mismatched PUT then returns 403.</li><li>The client must send the exact content type used at signing; add a wrong-type case to your test suite.</li><li>Signatures do not cover size by default — pin <code>content-length</code> too when you know it.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SigV4 signing process</span><span class="lc-sub">docs.aws.amazon.com/general/latest/gr/sigv4_signing.html — protocol spec, canonical request formatting.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">src/config/r2.ts:140–173 (this repo)</span><span class="lc-sub">Real comment documenting the vulnerability, fix, and verification against real S3.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 10.2: Object storage and presigned URLs</span><span class="lc-sub">The Node.js course measures this exact bug on a local MinIO: SignedHeaders = host → a text/html PUT returns 200 and is stored as text/html; with signableHeaders → 403. It also measures what the signature never covers: 120 MB into a URL declared for 5 MB (accepted), the presigned POST content-length-range fix (400 EntityTooLarge), key tampering (SignatureDoesNotMatch) and a 5-second expiry.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Bug SigV4 signableHeaders XSS</h2>
<p class="lead">Kho này có comment trong r2.ts tài liệu một sự cố bảo mật thật. Ai đó bắt được rằng presigned PUT URL, không có signableHeaders explicit, chỉ sign header <code>host</code>. Điều đó nghĩa là client có thể lấy signed URL cho &quot;upload video/mp4&quot; và thay bằng PUT text/html — R2 sau đó serve như HTML từ media domain. Stored XSS.</p>

<h3>Code có lỗ hổng</h3>
<pre><code class="language-ts">// VULNERABLE
const cmd = new PutObjectCommand({
  Bucket, Key, ContentType: 'video/mp4',
});
const url = await getSignedUrl(client, cmd, { expiresIn: 3600 });
// SDK default: sign chỉ 'host' header
// -&gt; ContentType trong cmd giờ chỉ là DEFAULT, không signed
// -&gt; client có thể PUT với bất kỳ Content-Type nào
</code></pre>

<h3>Cuộc tấn công (minh hoạ — tái hiện thật trên MinIO ở phần dưới)</h3>
<pre><code class="language-bash"># Attacker request signed URL cho upload video hợp lệ
$ curl -X POST /api/v1/files/upload/presign-r2 -d '{"filename":"a.mp4","contentType":"video/mp4","size":1000}'
{ "uploadUrl": "https://xxx.r2.cloudflarestorage.com/bucket/key?X-Amz-...&X-Amz-SignedHeaders=host&X-Amz-Signature=..." }

# Attacker upload HTML thay vì video
$ curl -X PUT "$UPLOAD_URL" \\
    -H "Content-Type: text/html" \\
    -d "&lt;script&gt;alert('xss')&lt;/script&gt;"
# R2 respond 200 — signature chỉ bind host, không content-type

# Giờ media.cuongthai.com/key serve HTML
$ curl https://media.cuongthai.com/key -I
HTTP/2 200
content-type: text/html    &lt;- stored XSS trên media domain!
</code></pre>

<div class="callout warn">
<p><strong>Content-Type ở PutObjectCommand không đủ.</strong> Nó chỉ là DEFAULT ContentType. Attacker override được ở PUT request nếu signature không bind content-type header.</p>
</div>

<h3>Vá — code hiện tại của kho này</h3>
<pre><code class="language-ts">// FIXED — src/config/r2.ts:158 (code thật; comment SECURITY ở dòng 140–157)
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 3600,
): Promise&lt;string&gt; {
  const client = getR2Client();
  const cmd = new PutObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, cmd, {
    expiresIn: expiresInSeconds,
    signableHeaders: new Set(['content-type']),   // KEY FIX — host is always signed
  });
}
</code></pre>

<h3>Comment của kho kể lại</h3>
<pre><code class="language-text">// SECURITY: signableHeaders is what actually pins the content type.
// Without it SigV4 signs only host (X-Amz-SignedHeaders: host), and the
// ContentType passed to PutObjectCommand degrades to a mere DEFAULT — a
// client can take the signed URL and PUT Content-Type: text/html, which
// R2 stores and later serves as HTML from media.cuongthai.com (stored XSS
// on the media domain). Verified against a real S3 endpoint: with host
// only, a text/html PUT returns 200 and the object comes back
// content-type: text/html; with content-type signed it returns 403.
</code></pre>

<h3>Verify — real test</h3>
<pre><code class="language-bash"># Test với WRONG content type (FIXED)
$ curl -X PUT "$UPLOAD_URL" -H "Content-Type: text/html" -d "&lt;script&gt;"
&lt;Error&gt;
  &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
  &lt;Message&gt;The request signature we calculated does not match...&lt;/Message&gt;
&lt;/Error&gt;
403 Forbidden — signature pin content-type
</code></pre>

<div class="callout ok">
<p><strong>Client PHẢI gửi Content-Type CHÍNH XÁC dùng lúc sign.</strong> FE code kho này (frontend/src/lib/api.ts):
<code>xhr.setRequestHeader(&#39;Content-Type&#39;, file.type)</code> — cùng file.type passed to /presign-r2. Signature match. Bất kỳ deviation nào = 403.</p>
</div>

<h3>Header khác nên pin</h3>
<pre><code class="language-ts">signableHeaders: new Set([
  'host',
  'content-type',        // Pin file type (từ vulnerability trên)
  'content-length',      // Pin file SIZE nếu bạn biết — chặn upload oversize
  // x-amz-meta-*: đặt Metadata trên command — SDK đưa nó vào query ĐÃ KÝ (đo bên dưới)
]),
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — chỉ test presigned upload với &quot;happy path&quot;.</strong> QA test upload valid video, works. Ship. Attack surface không notice cho tới security audit. Test với WRONG content-type trong test suite explicit.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Presigned PUT với chỉ ContentType trong PutObjectCommand không đủ security — SDK default sign chỉ &#39;host&#39;, attacker override content-type thành text/html tạo stored XSS trên media domain; fix là <code>signableHeaders: new Set([&#39;content-type&#39;])</code> — kho này bắt được, đã vá, có comment kể lại.</p>
</div>

<h3>Một header không được ký trở thành XSS như thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Client xin một URL đã ký sẵn</span><span class="lz-d">Và tự khai kiểu nội dung mà nó định tải lên, vì máy chủ không biết trước được.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Máy chủ ký cái request, nhưng KHÔNG ký cái header đó</span><span class="lz-d"><code>signableHeaders</code> bỏ sót <code>content-type</code>, nên chữ ký vẫn hợp lệ cho URL đó bất kể kiểu thật sự được gửi là gì.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nên bên tải lên đổi được nó SAU khi đã ký</span><span class="lz-d">Chữ ký vẫn xác minh được. Object rơi xuống với <code>text/html</code> thay vì kiểu ảnh mà máy chủ đã duyệt.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Và bucket phục vụ nó như một trang web</span><span class="lz-d">Mọi khách mở URL của object đó đều chạy script của kẻ tấn công, trên chính origin của bucket. Cách chữa là một dòng: hãy ký cái header mà bạn quan tâm.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>src/config/r2.ts</code> đọc <code>getSignedUploadUrl</code> và comment SECURITY của nó; tìm dòng <code>signableHeaders: new Set(['content-type'])</code>.</li>
<li>Sinh một presigned PUT URL cho <code>image/jpeg</code> (sandbox, hoặc MinIO cục bộ qua <code>STORAGE_SANDBOX_ENDPOINT=http://localhost:9000</code>). Trong query URL, xác nhận <code>X-Amz-SignedHeaders</code> có liệt kê <code>content-type</code>.</li>
<li>Upload đúng kiểu: <code>curl -T ./a.jpg "$URL" -H "Content-Type: image/jpeg"</code> → mong đợi <code>200</code>.</li>
<li>Tấn công: <code>curl -X PUT "$URL" -H "Content-Type: text/html" --data "&lt;script&gt;alert(1)&lt;/script&gt;"</code> → mong đợi <code>403 SignatureDoesNotMatch</code>.</li>
<li>Tạm ký với host thôi (bỏ <code>content-type</code> khỏi <code>signableHeaders</code>) rồi lặp lại bước 4 — giờ PUT text/html trả <code>200</code> và GET sau đó trả về <code>content-type: text/html</code>. Khôi phục bản vá.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tận mắt thấy CÙNG một tấn công trả 403 khi header được ký và 200 khi không, và giải thích được vì sao <code>ContentType</code> trên <code>PutObjectCommand</code> một mình chỉ là default.</p></div>

<h3>🔬 Đo thật: cuộc tấn công từ đầu tới cuối</h3>
<p>MinIO cục bộ, SDK v3 3.1071.0, và nginx 1.27 đóng vai CDN của tên miền media trước bucket. Không lệnh nào chạm bucket thật. URL có lỗi chỉ ký <code>host</code>:</p>
<div class="out">$ u=$(node ky-put.mjs video/u42/…-loi.mp4 video/mp4 host); echo $u | grep -o X-Amz-SignedHeaders=…
X-Amz-SignedHeaders=host
$ bash put.sh "$(cat u-loi.txt)" text/html mau.html
PUT Content-Type: text/html ⇒ HTTP 200 
$ curl -sD - -o /dev/null localhost:20202/video/u42/…-loi.mp4 | grep -iE '^HTTP|^content-type'
HTTP/1.1 200 OK
Content-Type: text/html</div>
<p>Mở bằng Chromium thật, cái gọi là "video" là một trang HTML và script của nó chạy trên origin của CDN (nó đổi tiêu đề thành "⚠️ Script của kẻ lạ đang chạy trên http://localhost:20202").</p>
<h3>🔬 Đo thật: bản vá — một URL, bốn lượt PUT</h3>
<div class="out">$ u=$(node ky-put.mjs video/u42/…-va.mp4 video/mp4 ct); echo $u | grep -o X-Amz-SignedHeaders=…
X-Amz-SignedHeaders=content-type%3Bhost
$ bash put.sh "$(cat u-va.txt)" text/html mau.html
PUT Content-Type: text/html ⇒ HTTP 403 &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ bash put.sh "$(cat u-va.txt)" "" mau.html
PUT Content-Type: (không gửi) ⇒ HTTP 403 &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ bash put.sh "$(cat u-va.txt)" 'video/mp4; charset=utf-8' mau.html
PUT Content-Type: video/mp4; charset=utf-8 ⇒ HTTP 403 &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ head -c 2048 /dev/urandom &gt; that.mp4; bash put.sh "$(cat u-va.txt)" video/mp4 that.mp4
PUT Content-Type: video/mp4 ⇒ HTTP 200 
$ node -e "… cùng signingDate, signableHeaders ['content-type'] rồi ['host','content-type'] …"
["content-type"]           content-type;host 5e05c7b6e6f05f92…
["host","content-type"]    content-type;host 5e05c7b6e6f05f92…</div>
<p>Phép so là so nguyên chuỗi: không gửi header, hay <code>video/mp4; charset=utf-8</code>, đều là giá trị khác và nhận 403. Còn <code>['content-type']</code> và <code>['host', 'content-type']</code> cho cùng SignedHeaders và cùng chữ ký — host luôn được ký.</p>
<h3>🔬 Đo thật: checksum SDK tự ký giùm bạn</h3>
<div class="out">$ u=$(node ky-put.mjs video/u42/…-ck.mp4 video/mp4 goc); echo $u | grep -oE 'x-amz-(checksum|sdk)…'
x-amz-checksum-crc32=AAAAAA%3D%3D
x-amz-sdk-checksum-algorithm=CRC32
$ bash put.sh "$(cat u-ck.txt)" video/mp4 that.mp4; grep -o '&lt;Message&gt;[^&lt;]*&lt;/Message&gt;' body.bin
PUT Content-Type: video/mp4 ⇒ HTTP 200 
$ node -e "… zlib.crc32(thân rỗng) · zlib.crc32(that.mp4), in base64 …"
CRC32 thân RỖNG              = AAAAAA==
CRC32 that.mp4 (2048 byte)   = MaTh8g==
$ aws s3api head-object --bucket media-ch3 --key video/u42/…-ck.mp4 --checksum-mode ENABLED --query …
{"ContentLength":2048,"ChecksumCRC32":null}
$ u=$(node ky-put.mjs video/u42/…-ck2.mp4 video/mp4 ct); echo $u | grep -oE 'x-amz-(checksum|sdk)…'; bash put.sh "$u" video/mp4 that.mp4
(không có tham số checksum)
PUT Content-Type: video/mp4 ⇒ HTTP 200 </div>
<p>Từ SDK 3.729, mặc định <code>WHEN_SUPPORTED</code> gắn <code>x-amz-checksum-crc32=AAAAAA==</code> vào URL PUT ký sẵn: CRC32 của một thân <em>rỗng</em>, tính lúc ký. MinIO bỏ qua (200, không lưu checksum); nhà cung cấp có kiểm sẽ từ chối mọi tệp thật. Kho đặt <code>requestChecksumCalculation: 'WHEN_REQUIRED'</code> (<code>src/config/r2.ts:83–88</code>).</p>
<h3>🔬 Đo thật: chữ ký còn khoá được gì</h3>
<div class="out">$ u=$(node ky-them.mjs len video/u42/…-len.mp4); …; bash put.sh "$u" video/mp4 that.mp4; bash put.sh "$u" video/mp4 to.bin   # 2048 B rồi 150 MiB
X-Amz-SignedHeaders=content-length%3Bcontent-type%3Bhost
PUT Content-Type: video/mp4 ⇒ HTTP 200 
PUT Content-Type: video/mp4 ⇒ HTTP 403 &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ u=$(node ky-them.mjs meta video/u42/…-meta.mp4); …; bash put.sh "$u" video/mp4 that.mp4; aws s3api head-object … --query Metadata
x-amz-meta-user-id=42
PUT Content-Type: video/mp4 ⇒ HTTP 200 
{"user-id":"42"}
$ curl -X PUT --data-binary @that.mp4 -H 'x-amz-meta-user-id: 7' "\${u/user-id=42/user-id=7}"
sửa user-id=42 ⇒ 7 trong URL ⇒ HTTP 400 &lt;Code&gt;AccessDenied&lt;/Code&gt;</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Bạn đã gặp cách phòng:</strong> GitHub phục vụ tệp thô của người dùng ở <code>raw.githubusercontent.com</code>, bản xem trước Google Drive đến từ <code>googleusercontent.com</code> — byte của người dùng nằm ở tên miền riêng, nên dù là HTML cũng không chạm được trang chính.</li>
<li><strong>Nếu route ký đúng loại mà client khai thì sao?</strong> Khi đó khoá loại chẳng giúp gì — kẻ xấu chỉ việc xin <code>text/html</code>:</li>
</ul>
<div class="out">$ r=$(node xin-url.mjs text/html); bash put.sh "&lt;uploadUrl&gt;" text/html mau.html; curl -sD - -o /dev/null localhost:20202/&lt;key&gt; | grep …
PUT Content-Type: text/html ⇒ HTTP 200 
HTTP/1.1 200 OK
Content-Type: text/html
$ for t in text/html image/svg+xml 'TEXT/HTML; charset=utf-8' video/mp4; do node xin-url.mjs "$t" --loc; done
xin text/html ⇒ {"status":400,"code":"UNSAFE_FILE_TYPE","ct":"text/html"}
xin image/svg+xml ⇒ {"status":400,"code":"UNSAFE_FILE_TYPE","ct":"image/svg+xml"}
xin TEXT/HTML; charset=utf-8 ⇒ {"status":400,"code":"UNSAFE_FILE_TYPE","ct":"TEXT/HTML; charset=utf-8"}
xin video/mp4 ⇒ {"key":"user-files/u7/1794642976195-tep","uploadUrl":"http://localhost:20200/media-ch3/use…</div>
<p>Khoá loại chưa phải là kiểm loại. Lọc loại theo danh sách <em>trước</em> khi ký (chuyển chữ thường, bỏ <code>; tham số</code>, chặn HTML/SVG/XML/JS — như <code>assertSafeUploadType</code> trong <code>src/storage/uploadService.ts:337</code>), phục vụ tệp người dùng ở tên miền riêng hoặc với <code>Content-Disposition: attachment</code>, và thêm một ca sai loại vào bộ test.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Trên MinIO: ký một PUT không có <code>signableHeaders</code>, PUT <code>text/html</code>, mở object trong trình duyệt. Thêm <code>signableHeaders: new Set(['content-type'])</code>, lặp lại (403), rồi thử không header và <code>; charset=utf-8</code>. In một URL từ client không có <code>WHEN_REQUIRED</code> và tìm <code>x-amz-checksum-crc32</code>.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-2-xss-va-sanitize" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 9.2 — XSS: từ ghi chú của người lạ tới phiên đăng nhập của bạn</span><span class="lc-sub">Stored XSS làm được gì khi đã chạy</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/media-processing/learn?lessonSlug=mp-2-1-svg" target="_blank" rel="noopener"><span class="lc-ico">🖼</span><span class="lc-body"><span class="lc-title">Media Processing · 2.1 — SVG: format ảnh chạy được JavaScript</span><span class="lc-sub">Vì sao image/svg+xml nằm trong danh sách chặn</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SigV4</span><span class="v">AWS Signature Version 4 — giao thức ký mà S3/R2 dùng để xác thực request.</span></div>
  <div class="kv"><span class="k">signableHeaders</span><span class="v">Tuỳ chọn SDK khai header nào được chữ ký phủ; mặc định chỉ <code>host</code>.</span></div>
  <div class="kv"><span class="k">X-Amz-SignedHeaders</span><span class="v">Tham số query liệt kê đúng những header đã ký — đọc nó để kiểm một presigned URL.</span></div>
  <div class="kv"><span class="k">Stored XSS</span><span class="v">Script lưu trên server rồi phục vụ lại cho khách, chạy trên origin của site.</span></div>
  <div class="kv"><span class="k">SignatureDoesNotMatch</span><span class="v">Lỗi 403 R2/S3 trả khi giá trị header đã ký khác với lúc ký.</span></div>
  <div class="kv"><span class="k">Default vs pinned</span><span class="v">ContentType trên command là default client đổi được; pin nghĩa là chữ ký từ chối mọi giá trị khác.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Mặc định SDK chỉ ký <code>host</code>, nên <code>ContentType</code> trên <code>PutObjectCommand</code> chỉ là default client đổi được.</li><li>Attacker đổi thành <code>text/html</code> → R2 lưu và phục vụ HTML từ media domain → stored XSS trên origin của bạn.</li><li>Bản vá một dòng: <code>signableHeaders: new Set(['content-type'])</code> — PUT sai kiểu sẽ trả 403.</li><li>Client phải gửi đúng content type dùng lúc ký; thêm ca sai-kiểu vào bộ test.</li><li>Chữ ký mặc định không phủ kích thước — pin thêm <code>content-length</code> khi bạn biết.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SigV4 signing process</span><span class="lc-sub">docs.aws.amazon.com/general/latest/gr/sigv4_signing.html — protocol spec, canonical request formatting.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">src/config/r2.ts:140–173 (kho này)</span><span class="lc-sub">Comment thật tài liệu vulnerability, fix, và verify với S3 thật.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 10.2: Object storage và URL ký sẵn</span><span class="lc-sub">Khoá Node.js đo đúng bug này trên MinIO cục bộ: SignedHeaders = host → PUT text/html trả 200 và lưu thành text/html; có signableHeaders → 403. Bài đó còn đo thứ chữ ký không bao giờ phủ: 120 MB vào URL khai 5 MB (vẫn nhận), cách sửa bằng presigned POST content-length-range (400 EntityTooLarge), sửa key (SignatureDoesNotMatch) và hạn 5 giây.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },

    {
      title: '4.3 — Chapter 4 quiz|||4.3 — Kiểm tra Chương 4',
      slug: 'os-4-3-quiz',
      type: 'QUIZ',
      description: 'Bốn câu, sáu phút.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 4 · Quiz</span><h2>What Chapter 4 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 4 · Kiểm tra</span><h2>Chương 4 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 360,
        questions: [
          {
            question: 'Why direct upload from browser to R2 for large files?|||Vì sao upload trực tiếp từ browser tới R2 cho file lớn?',
            options: [
              'Cloudflare proxy caps request body at 100 MB (free/pro). Backend forwarding fails; RAM exhaustion. Direct PUT bypasses both|||Cloudflare proxy cap request body ở 100 MB (free/pro). Backend forwarding fail; RAM exhaustion. Direct PUT bypass cả hai',
              'Faster only|||Chỉ nhanh hơn',
              'Cheaper|||Rẻ hơn',
              'Cloudflare policy|||Chính sách Cloudflare',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Presigned PUT signs only &#39;host&#39; header. What&#39;s the attack?|||Presigned PUT sign chỉ &#39;host&#39; header. Attack gì?',
            options: [
              'Attacker PUT with Content-Type: text/html instead of the signed content type. R2 stores as HTML; media domain serves it as HTML → stored XSS|||Attacker PUT với Content-Type: text/html thay vì content type signed. R2 lưu như HTML; media domain serve như HTML → stored XSS',
              'No attack — SDK handles it|||Không attack — SDK tự lo',
              'DDoS|||DDoS',
              'Overwrite existing objects|||Overwrite object có sẵn',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Fix for the SigV4 XSS vulnerability?|||Vá SigV4 XSS?',
            options: [
              '<code>signableHeaders: new Set([&#39;host&#39;, &#39;content-type&#39;])</code> passes to getSignedUrl. Now signature binds content-type; wrong PUT returns 403|||<code>signableHeaders: new Set([&#39;host&#39;, &#39;content-type&#39;])</code> passes to getSignedUrl. Signature bind content-type; PUT sai trả 403',
              'Increase URL expiry|||Tăng URL expiry',
              'Use HTTPS only|||Chỉ dùng HTTPS',
              'Disable presigned upload|||Tắt presigned upload',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'You fix the vulnerability. Client PUTs same content type used at signing. Result?|||Bạn vá vulnerability. Client PUT cùng content type dùng lúc sign. Result?',
            options: [
              '200 OK — signature matches. Client MUST send exact Content-Type. This repo&#39;s FE does <code>xhr.setRequestHeader(&#39;Content-Type&#39;, file.type)</code> matching what was sent to /presign-r2|||200 OK — signature match. Client PHẢI gửi Content-Type chính xác. FE kho này làm <code>xhr.setRequestHeader(&#39;Content-Type&#39;, file.type)</code> khớp cái gửi tới /presign-r2',
              '403 always|||403 luôn',
              'Depends on file size|||Phụ thuộc file size',
              '500 error|||500 error',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
