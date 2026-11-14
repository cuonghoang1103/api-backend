import G03_1 from './giang/obj-03-1.mjs';
import G03_2 from './giang/obj-03-2.mjs';
import G03_3 from './giang/obj-03-3.mjs';
const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 3 — URLs and access|||Chương 3 — URL và access',
  slug: 'os-ch3-urls',
  description: 'Bốn bài về ba loại URL (endpoint API, custom domain CDN, signed URL), Cache-Control per content type, và khi nào private vs public.',
  sortOrder: 4,
  lessons: [

    {
      title: '3.1 — Three URL types: API, CDN, signed|||3.1 — Ba loại URL: API, CDN, signed',
      slug: 'os-3-1-three-urls',
      type: 'VIDEO',
      description: 'API endpoint (auth required, expensive egress), custom domain qua CDN (free egress, cached), signed URL (short-lived, cho private objects). Kho này dùng cả ba.',
      content: `
${G03_1}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Three URL types: API, CDN, signed</h2>
<p class="lead">Same object, three different URLs. Each serves a different purpose. Confusing them costs money or leaks data.</p>

<h3>Three URLs for the same object</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">1. R2 API endpoint</span><span class="lz-nsub">xxx.r2.cloudflarestorage.com</span></span>
<span class="lz-nbody">For code (the SDK). Requires auth (access key + signature). NOT cached. Egress is expensive (though zero on R2). Use it for upload, list and delete from the backend.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">2. Custom domain</span><span class="lz-nsub">media.cuongthai.com/key</span></span>
<span class="lz-nbody">For the browser. Public. Cached globally by the Cloudflare CDN. Zero egress. Use it to serve avatars, images and video.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">3. Signed URL</span><span class="lz-nsub">endpoint/key?X-Amz-Signature=...</span></span>
<span class="lz-nbody">For private objects. Short-lived (5-10 minutes). Signature-verified. NOT cached. Use it for paid-course PDFs and expiring downloads.</span>
</div>
</div>

<h3>This repo's config, from src/config/r2.ts</h3>
<pre><code class="language-ts">export function buildPublicUrl(key: string): string {
  // Serve qua CDN, khong qua R2 endpoint
  // config.r2.publicUrl = env R2_PUBLIC_URL (src/config/r2.ts:412)
  const base = config.r2.publicUrl || '';
  return &#96;\${base}/\${key.replace(/^\\/+/, '')}&#96;;
  // e.g. https://media.cuongthai.com/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg
}

// upload -&gt; API endpoint
await putObject(key, buffer, contentType);
// -&gt; https://xxx.r2.cloudflarestorage.com/... (auth required)

// return URL for FE
return buildPublicUrl(key);
// -&gt; https://media.cuongthai.com/... (public, cached)
</code></pre>

<h3>Use-case table</h3>
<div class="out">Use case                 URL type              Cache?  Auth?  Cost
Upload from backend      API endpoint          NO      YES    ~0 (R2)
Download to server       API endpoint          NO      YES    ~0 (R2)
Serve avatar to browser  Custom domain (CDN)   YES     NO     $0
Serve public video       Custom domain (CDN)   YES     NO     $0
Paid course PDF          Signed URL            NO      SIG    ~0
Temporary share link     Signed URL            NO      SIG    ~0
</div>

<div class="callout warn">
<p><strong>Do NOT serve public files through the API endpoint.</strong> Bug number one: a developer forgets the custom domain and the code returns <code>xxx.r2.cloudflarestorage.com/...</code>. The client fetches it and gets <strong>403 AccessDenied</strong> (measured below on MinIO — S3-style APIs answer 403, not 401). The fix: <em>always</em> <code>buildPublicUrl(key)</code>, never expose the endpoint.</p>
</div>

<h3>URL structure detail</h3>
<pre><code class="language-text">API endpoint (upload):
  https://51f0a8f1.r2.cloudflarestorage.com/bucket-name/users/42/x.jpg?X-Amz-...
  ^^^^ auth headers/query required

Custom domain (public):
  https://media.cuongthai.com/users/42/x.jpg
  ^^^^ no auth, cached by CDN, egress zero

Signed URL:
  https://51f0a8f1.r2.cloudflarestorage.com/bucket-name/paid/lesson-5.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Date=...&X-Amz-Expires=600&X-Amz-Signature=xxx
  ^^^^ signed with SigV4, expires in 600s
</code></pre>

<h3>Cache implications</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">CDN</span><span class="lz-t">Cache-Control determines TTL</span><span class="lz-d">Cache header set at upload time. Browser + CDN cache accordingly. Invalidate via Cloudflare purge API.</span></div>
<div class="lz-step"><span class="lz-k">API</span><span class="lz-t">No cache by design</span><span class="lz-d">The R2 endpoint has no edge cache — every GET reaches the bucket (and needs a signature). On S3 every byte served this way is also billed egress. (This course does not time the real R2 endpoint.)</span></div>
<div class="lz-step"><span class="lz-k">Signed</span><span class="lz-t">Explicit no-cache</span><span class="lz-d">A signed URL is the API endpoint plus a signature — it never goes through the CDN. Signing again one second later gives a different URL (measured), so even the browser cache misses — unless you sign with a fixed window like <code>getSignedReadUrl()</code> (3.3).</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — hardcode API endpoint URL trong DB.</strong> You store <code>https://xxx.r2.cloudflarestorage.com/...</code> in a URL column (illustrative — this repo has no <code>MediaFile</code> model; see "Measured" below for what it really stores). Later you change the custom domain or the R2 endpoint, and every stored URL breaks. The fix: store <em>key</em> only, build URL runtime.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Three URL types for the same object: the API endpoint (backend SDK, authenticated, uncached, for upload and delete), a custom domain through the CDN (browser, public, cached, for serving), and a signed URL (short-lived, signature-authenticated, uncached, for private access) — store the key in your database rather than a URL, and build the URL at runtime.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Take ONE key and build all three URLs for it: the API endpoint URL, the custom-domain CDN URL (<code>https://media.cuongthai.com/&lt;key&gt;</code>), and a signed URL.</li>
<li><code>curl -I</code> each and compare: which returns a CDN cache header, which needs auth, which carries a signature query string.</li>
<li>In your schema, confirm you store the KEY (not a full URL); write the one helper that turns a key into the public CDN URL at runtime.</li>
<li>Explain in one line why storing the full URL in the DB breaks the day you change the custom domain.</li>
</ol>
<p><strong>Done when:</strong> you built all three URLs for one key, saw the header differences with <code>curl -I</code>, and your DB stores keys not URLs.</p></div>

<h3>🔬 Measured: one object, three URLs</h3>
<p>On a local MinIO, with nginx 1.27 playing Cloudflare in front of it (MinIO has no "custom domain" feature: here only nginx may read the bucket without a signature, its URLs carry no bucket name, and <code>X-Cache-Status</code> stands in for <code>cf-cache-status</code>). Nothing here touches the real bucket.</p>
<div class="out">$ node ba.mjs
① API    http://localhost:20200/media-ch3/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg
② CDN    http://localhost:20202/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg
③ signed http://localhost:20200/media-ch3/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg?…
     X-Amz-Algorithm        AWS4-HMAC-SHA256
     X-Amz-Content-Sha256   UNSIGNED-PAYLOAD
     X-Amz-Credential       &lt;access-key&gt;/20261114/us-east-1/s3/aws4_request
     X-Amz-Date             20261114T062416Z
     X-Amz-Expires          600
     X-Amz-Signature        680c0b2ba7719bc7…
     X-Amz-SignedHeaders    host
     x-id                   GetObject
$ bash goi.sh
① API    HTTP/1.1 403 Forbidden  405 B  cache-control:   x-cache: 
&lt;Code&gt;AccessDenied&lt;/Code&gt;
② CDN    HTTP/1.1 200 OK  49152 B  cache-control: public, max-age=31536000, immutable  x-cache: MISS
③ signed HTTP/1.1 200 OK  49152 B  cache-control: public, max-age=31536000, immutable  x-cache: 
$ bash goi.sh
① API    HTTP/1.1 403 Forbidden  405 B  cache-control:   x-cache: 
&lt;Code&gt;AccessDenied&lt;/Code&gt;
② CDN    HTTP/1.1 200 OK  49152 B  cache-control: public, max-age=31536000, immutable  x-cache: HIT
③ signed HTTP/1.1 200 OK  49152 B  cache-control: public, max-age=31536000, immutable  x-cache: </div>
<p>① a bare GET on the API endpoint: 403. ② the CDN: MISS, then HIT — the second view never reached the bucket. ③ the signed URL: 200 every time, always from the bucket. Sign the same key twice, one second apart:</p>
<div class="out">$ node ky2.mjs
X-Amz-Date       lần 1 20261114T062406Z  lần 2 20261114T062407Z
X-Amz-Signature  lần 1 67d556f2fb94a1d56bdc  lần 2 b6a2e83cdba6b89791d8
cùng URL? false</div>
<h3>🔬 Measured: production headers, from outside</h3>
<p>A plain public GET (as any visitor) on an old slide image, <code>U=https://media.cuongthai.com/images/academy/PG/v1/pg-00-1/001.webp</code>:</p>
<div class="out">$ for i in 1 2; do curl -s -o /dev/null -D - "$U" | grep -iE '^(server|cache-control|cf-cache-status|age):'; sleep 3; done
cache-control: public, max-age=31536000, immutable server: cloudflare age: 134 cf-cache-status: HIT
cache-control: public, max-age=31536000, immutable server: cloudflare age: 138 cf-cache-status: HIT
$ curl -sI "$U" | grep cf-cache-status ; curl -s -o /dev/null -D - "$U?v=$(date +%s)" | grep cf-cache-status
HEAD: cf-cache-status: DYNAMIC
GET ?v=…: cf-cache-status: MISS</div>
<p>Served by Cloudflare's edge (HIT, <code>age</code> growing). A HEAD is reported <code>DYNAMIC</code> — test caching with a real GET. A new query string is a new cache key, so it misses.</p>
<h3>🔬 Measured: key or URL in the database?</h3>
<p>The two pure functions of this repo (<code>src/config/r2.ts:412–431</code>), copied verbatim, with the base changed as if the CDN domain moved:</p>
<div class="out">$ node url.mjs
DB lưu       : https://media.cuongthai.com/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg
keyFromUrl   : images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg
— đổi base sang https://cdn.cuongthai.com
URL trong DB : https://media.cuongthai.com/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg  (vẫn trỏ tên miền cũ)
keyFromUrl   : null  ⇒ không xoá được object cũ khi người dùng đổi ảnh
nếu DB lưu KEY: https://cdn.cuongthai.com/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg  ⇒ đúng ngay, không cần migrate
$ grep -rln "keyFromUrl(" src | grep -v test | wc -l | sed 's/^ */tệp gọi keyFromUrl: /' &amp;&amp; grep -rhoE "\\b(r2Key|fileKey|thumbKey|ndaFileKey)\\b" src --include=*.ts | sort | uniq -c | sort -rn | head -4
tệp gọi keyFromUrl: 10
 164 r2Key
  21 thumbKey
  15 ndaFileKey
  13 fileKey</div>
<p>This repo stores a <strong>key</strong> for private files (<code>r2Key</code>, <code>fileKey</code>…) but the <strong>full URL</strong> for public media (avatars, covers), recovering the key with <code>keyFromUrl</code> in 10 files. A domain change would need a data migration; until then old images could not be deleted (orphans — Chapter 6). New columns: store the key.</p>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>You have met all three.</strong> Copy a photo link out of Facebook or Messenger and open it days later: <em>"URL signature expired"</em> — that was a signed URL with an expiry. A viral image that loads instantly for everyone is a CDN HIT at the edge. The API endpoint you never see: only servers holding a key talk to it.</li>
<li><strong>What if</strong> someone puts private invoices on the public domain as <code>hoa-don/1001.pdf</code>, <code>1002.pdf</code>…? Or a signed URL is forwarded into a group chat? Everyone with the URL can download — until it expires (3.3).</li>
<li><strong>The attacker's view</strong> — measured on the lab (MinIO + nginx), playing the attacker: counting keys, and hotlinking from another site.</li>
</ul>
<div class="out">$ bash doan.sh
đoán 31 số liên tiếp qua CDN ⇒ tải được 5 hoá đơn của người khác
key kiểu buildKey của kho: &lt;ms&gt;-&lt;12 hex ngẫu nhiên&gt; ⇒ phần ngẫu nhiên có 281,474,976,710,656 khả năng
$ bash hotlink.sh
Referer https://cuongthai.com/     ⇒ 200 49152 B
Referer https://trang-la.example/  ⇒ 200 49152 B</div>
<p>Defend: unguessable keys (this repo's <code>buildKey()</code> adds 12 random hex characters from <code>crypto.randomBytes</code> — 2<sup>48</sup> possibilities), private data never on the public domain (signed URLs instead), short expiries, and a hotlink / Referer rule at the CDN if other sites start embedding your files.</p>

<h3>🔁 Run it yourself</h3>
<p>Start MinIO (image <code>cgr.dev/chainguard/minio</code>) and an <code>nginx:1.27-alpine</code> container whose <code>location /</code> does <code>proxy_pass http://host.docker.internal:&lt;minio-port&gt;/&lt;bucket&gt;/;</code> with <code>proxy_cache</code> and <code>add_header X-Cache-Status $upstream_cache_status</code>. Give the bucket a policy allowing anonymous <code>s3:GetObject</code> only when <code>aws:UserAgent</code> equals the value nginx sends — then the API port still demands a signature, like R2. GET each URL twice with <code>curl -s -D - -o /dev/null</code>.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-8-1-cdn" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 8.1 — How a CDN works: edge, origin and PoP</span><span class="lc-sub">What the "edge" in a HIT really is</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-1-bat-bo-dem" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 5.1 — Turning caching on, and what the key is made of</span><span class="lc-sub">Why a new query string is a new cache entry</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">API endpoint URL</span><span class="v">The S3 API host; authenticated, uncached — for upload/delete from the backend.</span></div>
  <div class="kv"><span class="k">CDN / custom domain URL</span><span class="v">Public, cached at the edge — for serving to browsers.</span></div>
  <div class="kv"><span class="k">Signed URL</span><span class="v">Short-lived, signature-authenticated, uncached — for private access.</span></div>
  <div class="kv"><span class="k">Key</span><span class="v">The object's identifier stored in the DB; URLs are derived from it.</span></div>
  <div class="kv"><span class="k">Build URL at runtime</span><span class="v">Compose the URL from key + base, so a domain change needs no data migration.</span></div>
  <div class="kv"><span class="k">Cache header</span><span class="v">What tells the CDN URL apart from the uncached API/signed URLs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>One object has three URL shapes: API endpoint (upload/delete), CDN custom domain (serving), signed URL (private access).</li><li>Store the key in the DB, never a full URL — build URLs at runtime.</li><li>Only the CDN URL is cached; the API and signed URLs are not.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Public buckets and custom domains</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/public-buckets — setup guide.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Ba loại URL: API, CDN, signed</h2>
<p class="lead">Cùng object, ba URL khác nhau. Mỗi cái phục vụ mục đích khác. Nhầm chúng tốn tiền hoặc leak data.</p>

<h3>Ba URL cho cùng object</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">1. R2 API endpoint</span><span class="lz-nsub">xxx.r2.cloudflarestorage.com</span></span>
<span class="lz-nbody">Cho code (SDK). Cần auth (access key + signature). KHÔNG cache. Cost egress cao (nhưng R2 zero). Dùng cho upload, list, delete từ backend.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">2. Custom domain</span><span class="lz-nsub">media.cuongthai.com/key</span></span>
<span class="lz-nbody">Cho browser. Public. Cached qua Cloudflare CDN globally. Egress zero. Dùng cho serving avatar, image, video.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">3. Signed URL</span><span class="lz-nsub">endpoint/key?X-Amz-Signature=...</span></span>
<span class="lz-nbody">Cho private object. Short-lived (5-10 phút). Verified signature. KHÔNG cache. Dùng cho paid course PDF, expiring download.</span>
</div>
</div>

<h3>Kho này config từ src/config/r2.ts</h3>
<pre><code class="language-ts">export function buildPublicUrl(key: string): string {
  // Serve qua CDN, khong qua R2 endpoint
  // config.r2.publicUrl = env R2_PUBLIC_URL (src/config/r2.ts:412)
  const base = config.r2.publicUrl || '';
  return &#96;\${base}/\${key.replace(/^\\/+/, '')}&#96;;
  // e.g. https://media.cuongthai.com/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg
}

// upload -&gt; API endpoint
await putObject(key, buffer, contentType);
// -&gt; https://xxx.r2.cloudflarestorage.com/... (auth required)

// return URL for FE
return buildPublicUrl(key);
// -&gt; https://media.cuongthai.com/... (public, cached)
</code></pre>

<h3>Bảng use case</h3>
<div class="out">Use case                 URL type              Cache?  Auth?  Cost
Upload from backend      API endpoint          NO      YES    ~0 (R2)
Download to server       API endpoint          NO      YES    ~0 (R2)
Serve avatar to browser  Custom domain (CDN)   YES     NO     $0
Serve public video       Custom domain (CDN)   YES     NO     $0
Paid course PDF          Signed URL            NO      SIG    ~0
Temporary share link     Signed URL            NO      SIG    ~0
</div>

<div class="callout warn">
<p><strong>ĐỪNG serve public file qua API endpoint.</strong> Bug số 1: dev quên custom domain, code trả về <code>xxx.r2.cloudflarestorage.com/...</code>. Client fetch → <strong>403 AccessDenied</strong> (đo bên dưới trên MinIO — API kiểu S3 trả 403, không phải 401). Fix: <em>luôn</em> <code>buildPublicUrl(key)</code>, không expose endpoint.</p>
</div>

<h3>URL structure chi tiết</h3>
<pre><code class="language-text">API endpoint (upload):
  https://51f0a8f1.r2.cloudflarestorage.com/bucket-name/users/42/x.jpg?X-Amz-...
  ^^^^ auth headers/query required

Custom domain (public):
  https://media.cuongthai.com/users/42/x.jpg
  ^^^^ no auth, cached by CDN, egress zero

Signed URL:
  https://51f0a8f1.r2.cloudflarestorage.com/bucket-name/paid/lesson-5.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Date=...&X-Amz-Expires=600&X-Amz-Signature=xxx
  ^^^^ signed with SigV4, expires in 600s
</code></pre>

<h3>Cache implications</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">CDN</span><span class="lz-t">Cache-Control quyết định TTL</span><span class="lz-d">Cache header set lúc upload. Browser + CDN cache accordingly. Invalidate qua Cloudflare purge API.</span></div>
<div class="lz-step"><span class="lz-k">API</span><span class="lz-t">Không cache by design</span><span class="lz-d">R2 endpoint không có cache ở edge — mọi GET chạy tới bucket (và cần chữ ký). Trên S3 mỗi byte phục vụ kiểu này còn tính tiền egress. (Khoá học không đo độ trễ của endpoint R2 thật.)</span></div>
<div class="lz-step"><span class="lz-k">Signed</span><span class="lz-t">Explicit no-cache</span><span class="lz-d">Signed URL là API endpoint cộng chữ ký — nó không bao giờ đi qua CDN. Ký lại một giây sau ra URL khác (đo bên dưới), nên cả cache trình duyệt cũng trượt — trừ khi ký theo khung cố định như <code>getSignedReadUrl()</code> (3.3).</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — hardcode API endpoint URL trong DB.</strong> Bạn lưu <code>https://xxx.r2.cloudflarestorage.com/...</code> vào một cột URL (minh hoạ — kho này không có model <code>MediaFile</code>; xem "Đo thật" bên dưới để biết kho thật sự lưu gì). Sau đó đổi custom domain hoặc R2 endpoint, mọi URL cũ vỡ. Fix: lưu <em>key</em> thôi, build URL runtime.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba URL type cho cùng object: API endpoint (backend SDK, auth, không cache, upload/delete), custom domain qua CDN (browser, public, cached, serving), signed URL (short-lived, sig auth, không cache, private access) — lưu key trong DB không URL, build URL runtime.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy MỘT key và dựng cả ba URL cho nó: URL API endpoint, URL CDN custom-domain (<code>https://media.cuongthai.com/&lt;key&gt;</code>), và một signed URL.</li>
<li><code>curl -I</code> từng cái và so: cái nào trả header cache CDN, cái nào cần auth, cái nào mang query string chữ ký.</li>
<li>Trong schema, xác nhận bạn lưu KEY (không phải URL đầy đủ); viết một helper biến key thành public CDN URL lúc runtime.</li>
<li>Giải thích một dòng vì sao lưu URL đầy đủ trong DB sẽ hỏng vào ngày bạn đổi custom domain.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dựng được cả ba URL cho một key, thấy khác biệt header qua <code>curl -I</code>, và DB lưu key chứ không URL.</p></div>

<h3>🔬 Đo thật: một object, ba URL</h3>
<p>Trên MinIO cục bộ, với nginx 1.27 đóng vai Cloudflare đứng trước (MinIO không có tính năng "tên miền riêng": ở đây chỉ nginx được đọc bucket mà không cần chữ ký, URL của nó không chứa tên bucket, và <code>X-Cache-Status</code> thay cho <code>cf-cache-status</code>). Không lệnh nào chạm bucket thật.</p>
<div class="out">$ node ba.mjs
① API    http://localhost:20200/media-ch3/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg
② CDN    http://localhost:20202/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg
③ signed http://localhost:20200/media-ch3/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg?…
     X-Amz-Algorithm        AWS4-HMAC-SHA256
     X-Amz-Content-Sha256   UNSIGNED-PAYLOAD
     X-Amz-Credential       &lt;access-key&gt;/20261114/us-east-1/s3/aws4_request
     X-Amz-Date             20261114T062416Z
     X-Amz-Expires          600
     X-Amz-Signature        680c0b2ba7719bc7…
     X-Amz-SignedHeaders    host
     x-id                   GetObject
$ bash goi.sh
① API    HTTP/1.1 403 Forbidden  405 B  cache-control:   x-cache: 
&lt;Code&gt;AccessDenied&lt;/Code&gt;
② CDN    HTTP/1.1 200 OK  49152 B  cache-control: public, max-age=31536000, immutable  x-cache: MISS
③ signed HTTP/1.1 200 OK  49152 B  cache-control: public, max-age=31536000, immutable  x-cache: 
$ bash goi.sh
① API    HTTP/1.1 403 Forbidden  405 B  cache-control:   x-cache: 
&lt;Code&gt;AccessDenied&lt;/Code&gt;
② CDN    HTTP/1.1 200 OK  49152 B  cache-control: public, max-age=31536000, immutable  x-cache: HIT
③ signed HTTP/1.1 200 OK  49152 B  cache-control: public, max-age=31536000, immutable  x-cache: </div>
<p>① GET trần vào API endpoint: 403. ② CDN: MISS rồi HIT — lượt xem thứ hai không chạm tới bucket. ③ signed URL: 200 mọi lần, lần nào cũng tới bucket. Ký cùng một key hai lần, cách nhau một giây:</p>
<div class="out">$ node ky2.mjs
X-Amz-Date       lần 1 20261114T062406Z  lần 2 20261114T062407Z
X-Amz-Signature  lần 1 67d556f2fb94a1d56bdc  lần 2 b6a2e83cdba6b89791d8
cùng URL? false</div>
<h3>🔬 Đo thật: header production, nhìn từ bên ngoài</h3>
<p>Một GET công khai bình thường (như mọi khách) vào một ảnh slide cũ, <code>U=https://media.cuongthai.com/images/academy/PG/v1/pg-00-1/001.webp</code>:</p>
<div class="out">$ for i in 1 2; do curl -s -o /dev/null -D - "$U" | grep -iE '^(server|cache-control|cf-cache-status|age):'; sleep 3; done
cache-control: public, max-age=31536000, immutable server: cloudflare age: 134 cf-cache-status: HIT
cache-control: public, max-age=31536000, immutable server: cloudflare age: 138 cf-cache-status: HIT
$ curl -sI "$U" | grep cf-cache-status ; curl -s -o /dev/null -D - "$U?v=$(date +%s)" | grep cf-cache-status
HEAD: cf-cache-status: DYNAMIC
GET ?v=…: cf-cache-status: MISS</div>
<p>Edge của Cloudflare trả lời (HIT, <code>age</code> tăng dần). HEAD bị báo <code>DYNAMIC</code> — kiểm cache bằng GET thật. Query string mới là khoá cache mới, nên trượt.</p>
<h3>🔬 Đo thật: database lưu key hay URL?</h3>
<p>Hai hàm thuần của kho (<code>src/config/r2.ts:412–431</code>), chép nguyên văn, đổi base như thể tên miền CDN đổi:</p>
<div class="out">$ node url.mjs
DB lưu       : https://media.cuongthai.com/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg
keyFromUrl   : images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg
— đổi base sang https://cdn.cuongthai.com
URL trong DB : https://media.cuongthai.com/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg  (vẫn trỏ tên miền cũ)
keyFromUrl   : null  ⇒ không xoá được object cũ khi người dùng đổi ảnh
nếu DB lưu KEY: https://cdn.cuongthai.com/images/avatar/u42/1794700000000-9f2c1a7b3e4d.jpg  ⇒ đúng ngay, không cần migrate
$ grep -rln "keyFromUrl(" src | grep -v test | wc -l | sed 's/^ */tệp gọi keyFromUrl: /' &amp;&amp; grep -rhoE "\\b(r2Key|fileKey|thumbKey|ndaFileKey)\\b" src --include=*.ts | sort | uniq -c | sort -rn | head -4
tệp gọi keyFromUrl: 10
 164 r2Key
  21 thumbKey
  15 ndaFileKey
  13 fileKey</div>
<p>Kho này lưu <strong>key</strong> cho tệp riêng tư (<code>r2Key</code>, <code>fileKey</code>…) nhưng lưu <strong>URL đầy đủ</strong> cho ảnh công khai (avatar, ảnh bìa), lấy lại key bằng <code>keyFromUrl</code> ở 10 tệp. Đổi tên miền sẽ cần migrate dữ liệu; trước đó ảnh cũ không xoá được (mồ côi — Chương 6). Cột mới: lưu key.</p>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Bạn đã gặp cả ba.</strong> Chép link ảnh từ Facebook hay Messenger ra ngoài, vài hôm sau mở lại: <em>"URL signature expired"</em> — đó là một signed URL có hạn. Một ảnh lan truyền mà ai mở cũng hiện ngay là CDN trả HIT ở edge. Còn API endpoint thì bạn không bao giờ thấy: chỉ máy chủ có khoá mới nói chuyện với nó.</li>
<li><strong>Nếu</strong> ai đó để hoá đơn riêng tư trên tên miền công khai dạng <code>hoa-don/1001.pdf</code>, <code>1002.pdf</code>…? Hoặc một signed URL bị chuyển vào nhóm chat? Ai có URL cũng tải được — tới khi hết hạn (3.3).</li>
<li><strong>Góc kẻ xấu</strong> — đo trên lab (MinIO + nginx), đóng vai kẻ xấu: đếm key, và hotlink từ trang khác.</li>
</ul>
<div class="out">$ bash doan.sh
đoán 31 số liên tiếp qua CDN ⇒ tải được 5 hoá đơn của người khác
key kiểu buildKey của kho: &lt;ms&gt;-&lt;12 hex ngẫu nhiên&gt; ⇒ phần ngẫu nhiên có 281,474,976,710,656 khả năng
$ bash hotlink.sh
Referer https://cuongthai.com/     ⇒ 200 49152 B
Referer https://trang-la.example/  ⇒ 200 49152 B</div>
<p>Cách phòng: key không đoán được (<code>buildKey()</code> của kho thêm 12 ký tự hex ngẫu nhiên từ <code>crypto.randomBytes</code> — 2<sup>48</sup> khả năng), dữ liệu riêng tư không bao giờ nằm trên tên miền công khai (dùng signed URL), hạn ngắn, và luật chặn hotlink / Referer ở CDN nếu trang khác bắt đầu nhúng tệp của bạn.</p>

<h3>🔁 Tự chạy lại</h3>
<p>Chạy MinIO (ảnh <code>cgr.dev/chainguard/minio</code>) và một container <code>nginx:1.27-alpine</code> có <code>location /</code> làm <code>proxy_pass http://host.docker.internal:&lt;cổng-minio&gt;/&lt;bucket&gt;/;</code> kèm <code>proxy_cache</code> và <code>add_header X-Cache-Status $upstream_cache_status</code>. Cho bucket một policy cho phép <code>s3:GetObject</code> ẩn danh CHỈ khi <code>aws:UserAgent</code> đúng giá trị nginx gửi — khi đó cổng API vẫn đòi chữ ký, như R2. GET mỗi URL hai lần bằng <code>curl -s -D - -o /dev/null</code>.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-8-1-cdn" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking cho developer · 8.1 — CDN hoạt động thế nào: edge, origin và PoP</span><span class="lc-sub">"Edge" trong một lần HIT thật ra là gì</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-1-bat-bo-dem" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 5.1 — Bật bộ đệm lên, và cái khoá cache làm từ gì</span><span class="lc-sub">Vì sao query string mới là một mục cache mới</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">API endpoint URL</span><span class="v">Host API S3; có auth, không cache — để upload/delete từ backend.</span></div>
  <div class="kv"><span class="k">CDN / custom domain URL</span><span class="v">Public, cache ở edge — để serve cho browser.</span></div>
  <div class="kv"><span class="k">Signed URL</span><span class="v">Short-lived, auth bằng chữ ký, không cache — cho private access.</span></div>
  <div class="kv"><span class="k">Key</span><span class="v">Identifier của object lưu trong DB; URL dẫn xuất từ nó.</span></div>
  <div class="kv"><span class="k">Build URL runtime</span><span class="v">Ghép URL từ key + base, nên đổi domain không cần migrate dữ liệu.</span></div>
  <div class="kv"><span class="k">Cache header</span><span class="v">Thứ phân biệt URL CDN với URL API/signed không cache.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một object có ba dạng URL: API endpoint (upload/delete), CDN custom domain (serving), signed URL (private access).</li><li>Lưu key trong DB, không bao giờ URL đầy đủ — build URL lúc runtime.</li><li>Chỉ URL CDN được cache; URL API và signed thì không.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Public buckets and custom domains</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/public-buckets — setup guide.</span></span></div>
</div>
`,
    },

    {
      title: '3.2 — Cache-Control per content type|||3.2 — Cache-Control theo content type',
      slug: 'os-3-2-cache',
      type: 'VIDEO',
      description: 'Immutable images: 1 year cache. Audio streams: 1 hour. Never over-cache mutable content. Kho này set cache_control lúc upload.',
      content: `
${G03_2}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Cache-Control per content type</h2>
<p class="lead">Cache-Control header set on the object at upload time controls how long browsers and CDNs cache the response. Wrong TTL = either stale content or unnecessary hits.</p>

<h3>What this repo sets</h3>
<p><em>Correction (14/11/2026): an earlier version of this lesson quoted a <code>CACHE_POLICIES</code> table from <code>upload.service.ts</code>. It does not exist (grep finds 0). What the code really does:</em></p>
<pre><code class="language-ts">// src/config/r2.ts:110 — ONE default for every public upload
export async function putObject(key, body, contentType,
  cacheControl: string = 'public, max-age=31536000, immutable',   // 1 year, immutable
  contentDisposition?: string) { … }
// src/storage/StorageProvider.ts:263 — public uploads pass undefined ⇒ the default
await r2Put(key, body, contentType, undefined, opts?.contentDisposition);
// private files pass their own: 'private, max-age=0, no-store' (×6), 'private, max-age=0' (×4) …
// getSignedUploadUrl (presigned PUT, browser videos) signs only Content-Type ⇒ NO Cache-Control stored
</code></pre>
<p>One year for everything public is safe here only because every key is versioned (<code>buildKey()</code> adds <code>&lt;ms&gt;-&lt;12 hex&gt;</code>).</p>

<h3>Immutable vs mutable</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">immutable</span><span class="lz-nsub">1 year + immutable directive</span></span>
<span class="lz-nbody">The content at this URL never changes. A new version means a new URL (a versioned key or a hash). The browser caches aggressively and never asks the server. Images, video, minified JS bundles.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">short-cache</span><span class="lz-nsub">1 hour</span></span>
<span class="lz-nbody">Content can change. Client fetches fresh occasionally. E.g. profile avatar (URL stable), music streams. Balance freshness vs origin hits.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">no-cache</span><span class="lz-nsub">max-age=0</span></span>
<span class="lz-nbody">Never cache. Every fetch hits origin. Rare — only for content that MUST be fresh AND frequently changes. Wasteful; try versioned URLs instead.</span>
</div>
</div>

<h3>Versioned URLs trump cache tuning</h3>
<pre><code class="language-text">Cach kem:
  URL:  https://media/avatar-user-42.jpg
  Cache: 1 hour
  Update: replace object, wait 1 hour for cache expire
  Bad UX: stale avatar for 1 hour after change

Cach tot:
  URL:  https://media/avatar-user-42-v42.jpg  (or -&lt;hash&gt;.jpg)
  Cache: 1 year immutable
  Update: upload NEW key with new version, update DB URL
  Old key eventually cleanup via lifecycle (Chuong 6)
  Perfect UX: instant switch, no cache fight
</code></pre>

<div class="callout ok">
<p><strong>Versioned URL = cache aggressive + no invalidation needed.</strong> This repo uses that pattern for every upload — <code>buildKey()</code> produces <code>images/avatar/u42/1794700100000-5e6f7a8b9c0d.jpg</code> (timestamp + 12 random hex).</p>
</div>

<h3>CDN cache invalidation — when you actually need it</h3>
<pre><code class="language-bash"># Cloudflare purge URL
$ curl -X POST \\
    "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \\
    -H "Authorization: Bearer $TOKEN" \\
    -H "Content-Type: application/json" \\
    -d '{"files":["https://media.cuongthai.com/x.jpg"]}'
</code></pre>

<p>Purge limits (Cloudflare docs, checked 14/11/2026): purge by URL on the Free plan is 800 URLs per second, up to 100 URLs per request (an earlier version said "30 purges a day" — no source). Even so, purge is a repair, not a design: versioned URLs never need it.</p>

<h3>Cache-Control syntax</h3>
<pre><code class="language-text">public                — anyone (including CDN) can cache
private               — only browser can cache
max-age=N             — N seconds
s-maxage=N            — for CDN (overrides max-age for CDN)
immutable             — content never changes at this URL (skip revalidation)
no-cache              — must revalidate before use (still cache but check)
no-store              — never cache (rare)

Combo cho immutable static asset:
  public, max-age=31536000, immutable
Combo cho private user data:
  private, max-age=60
</code></pre>

<div class="pitfall">
<p><strong>Trap — set aggressive cache-control cho mutable content.</strong> An avatar cached for a year. The user changes it. A year later their friends still see the old one. The fix: either use a versioned URL, or cache briefly with a hash appended as a query string.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Cache-Control is set at upload time: immutable content (image, video, hashed asset) gets one year immutable, mutable content gets a one-hour max-age, a versioned URL beats a short cache plus invalidation, and the Cloudflare CDN tunes its own cache from that header — so set it correctly at upload.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Upload two objects: one with <code>CacheControl: &#39;public, max-age=31536000, immutable&#39;</code>, one with <code>&#39;public, max-age=3600&#39;</code>.</li>
<li><code>curl -I</code> each through the CDN twice and read <code>cache-control</code> plus <code>cf-cache-status</code> (MISS then HIT) to watch the edge cache the immutable one.</li>
<li>Rename an asset using a content hash in the key (<code>app.9f2c1.js</code>) and explain why a versioned URL lets you keep a one-year cache safely.</li>
<li>Change the file behind a NON-versioned key and observe the stale year-long cache — then state the fix (version the URL, don't lengthen invalidation).</li>
</ol>
<p><strong>Done when:</strong> you have seen a MISS→HIT on the immutable object and can explain why versioning beats cache invalidation.</p></div>

<h3>🔬 Measured: four policies through a cache</h3>
<p>Local MinIO + nginx 1.27 playing Cloudflare (it copies Cloudflare's documented defaults: a 200 without Cache-Control is kept 120 minutes, a 404 3 minutes; <code>X-Cache-Status</code> stands in for <code>cf-cache-status</code>). Nothing here touches the real bucket.</p>
<div class="out">$ node bon.mjs
PUT cc/anh-a1b2c3.webp   Cache-Control: public, max-age=31536000, immutable
PUT cc/nhac.mp3          Cache-Control: public, max-age=3600
PUT cc/hoa-don.pdf       Cache-Control: private, max-age=0, no-store
PUT cc/khong-dat.mp4     Cache-Control: (không có)
$ bash hai-lan.sh
cc/anh-a1b2c3.webp   lượt 1  public, max-age=31536000, immutable x-cache: MISS
cc/anh-a1b2c3.webp   lượt 2  public, max-age=31536000, immutable x-cache: HIT
cc/nhac.mp3          lượt 1  public, max-age=3600               x-cache: MISS
cc/nhac.mp3          lượt 2  public, max-age=3600               x-cache: HIT
cc/hoa-don.pdf       lượt 1  private, max-age=0, no-store       x-cache: MISS
cc/hoa-don.pdf       lượt 2  private, max-age=0, no-store       x-cache: MISS
cc/khong-dat.mp4     lượt 1                                     x-cache: MISS
cc/khong-dat.mp4     lượt 2                                     x-cache: HIT</div>
<p><code>private, no-store</code> is never stored. No header at all is still cached — by the cache's own default (Cloudflare: 120 min for 200 responses, only for its default file extensions such as jpg, webp, mp4, pdf; not html/json).</p>
<h3>🔬 Measured: overwriting a cached key vs a new key</h3>
<div class="out">$ bash doi.sh
1) tải avatar-u42.jpg (bản 1) và xem qua CDN:
ETag: "2fa874584e87f8e8b25847347806ab36" X-Cache-Status: MISS
ETag: "2fa874584e87f8e8b25847347806ab36" X-Cache-Status: HIT
2) ghi ĐÈ cùng key bằng bản 2:
   bucket: "9f8b26e59770287841634cdff2e817e0"
   CDN   : ETag: "2fa874584e87f8e8b25847347806ab36" X-Cache-Status: HIT   ⇐ vẫn bản 1, còn 1 năm
   nội dung CDN trả: avatar ban 1
3) cách đúng — key MỚI (buildKey của kho: &lt;ms&gt;-&lt;hex&gt;), cập nhật DB sang key mới:
ETag: "9f8b26e59770287841634cdff2e817e0" X-Cache-Status: MISS
   nội dung: avatar ban 2 da doi</div>
<h3>🔬 Measured: the cached 404</h3>
<div class="out">$ bash som.sh
GET trước khi đẩy : HTTP/1.1 404 Not Found X-Cache-Status: MISS
đã đẩy tệp lên bucket
GET ngay sau      : HTTP/1.1 404 Not Found X-Cache-Status: HIT
bucket trực tiếp  : 4 byte — tệp CÓ thật</div>
<p>Never GET the public URL of a file before it is uploaded — the CDN keeps the 404. This course's slide decks follow that rule, and a redrawn deck gets a new prefix (<code>v2</code>) instead of overwriting.</p>
<h3>🔬 Audited in this repo + a presigned upload</h3>
<div class="out">$ grep -n "cacheControl: string = " src/config/r2.ts &amp;&amp; grep -n "r2Put(key, body, contentType, undefined" src/storage/StorageProvider.ts
114:  cacheControl: string = 'public, max-age=31536000, immutable',
263:    const res = await r2Put(key, body, contentType, undefined, opts?.contentDisposition);
$ grep -rhoE "putObject\\([^)]*'(public|private)[^']*'" src --include='*.ts' | grep -oE "'(public|private)[^']*'" | sort | uniq -c | sort -rn
   6 'private, max-age=0, no-store'
   4 'private, max-age=0'
   1 'private, max-age=31536000, immutable'
$ grep -rn "CACHE_POLICIES" src | wc -l | sed 's/^ */CACHE_POLICIES (bài web cũ trích từ upload.service.ts): /'
CACHE_POLICIES (bài web cũ trích từ upload.service.ts): 0
$ sed -n '/export async function getSignedUploadUrl/,/^}/p' src/config/r2.ts | grep -nE "ContentType|CacheControl|signableHeaders" ; echo "⇒ PUT ký sẵn (video tải thẳng từ trình duyệt) KHÔNG mang Cache-Control"
10:    ContentType: contentType,
14:    signableHeaders: new Set(['content-type']),
⇒ PUT ký sẵn (video tải thẳng từ trình duyệt) KHÔNG mang Cache-Control</div>
<div class="out">$ node ps.mjs
PUT ký sẵn       : 200
HEAD trên bucket : ContentType=video/mp4 CacheControl=(không có)
$ for i in 1 2; do curl -s -o /dev/null -D - http://localhost:20202/video/u42/1794700200000-0a1b2c3d4e5f.mp4 | grep -iE '^(cache-control|x-cache-status)' | tr -d '\\r' | paste -sd' ' - | sed 's/^$/(không có cache-control)/' ; done
X-Cache-Status: MISS
X-Cache-Status: HIT</div>
<p>Browser uploads through <code>getSignedUploadUrl()</code> are stored with no Cache-Control, so the CDN falls back to its default (2 hours on Cloudflare), not one year. To change that, put <code>CacheControl</code> in the command <em>and</em> in <code>signableHeaders</code>, and have the browser send the identical header.</p>
<h3>🔬 Measured gently on production</h3>
<p>A public course video, <code>U=https://media.cuongthai.com/videos/bai-giang/linux-bash/…/00-01-bat-dau-tai-day-48d9d700.mp4</code> — a HEAD plus a 100-byte range, never the whole file:</p>
<div class="out">$ curl -sI "$U" | grep …; curl -s -r 0-99 -o /dev/null -D - "$U" | grep …
content-type: video/mp4
content-length: 127087927
cache-control: public, max-age=31536000, immutable
cf-cache-status: DYNAMIC
HTTP/2 206 
content-range: bytes 0-99/127087927
cf-cache-status: HIT</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>You meet caches daily:</strong> you change your profile picture and friends still see the old one for a while; you deploy a fix and the page looks old until Ctrl+F5.</li>
<li><strong>What if you delete a file that is already cached?</strong> And how does an attacker abuse a cache? Measured on the lab:</li>
</ul>
<div class="out">$ bash xoa.sh
xem 2 lượt       : 200 X-Cache-Status: HIT
đã XOÁ khỏi bucket
bucket trực tiếp : 404 — không còn
qua CDN          : HTTP/1.1 200 OK X-Cache-Status: HIT
$ bash xuyen.sh
20 GET cùng một ảnh, mỗi lượt một ?x= ngẫu nhiên ⇒ HIT 0 · MISS 20 (MISS = một request tới bucket)
20 GET đúng URL gốc ⇒ HIT 20</div>
<p>A cache is a copy you no longer control: private data never gets <code>public</code>. Random query strings bypass the cache and hit the bucket every time (each an R2 Class B operation) — at the CDN, ignore the query string for static media and rate-limit.</p>
<h3>🔁 Run it yourself</h3>
<p>Reuse the MinIO + nginx lab from 3.1 (<code>proxy_cache_valid 200 206 120m; proxy_cache_valid 404 3m;</code> copies Cloudflare's defaults). PUT with <code>--cache-control</code> (aws-cli) or <code>CacheControl</code> (SDK), GET twice with <code>curl -s -D - -o /dev/null</code>, overwrite, then upload under a new key.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-3-ai-quyet-dinh-thoi-han" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 5.3 — Who decides how long: the precedence chain, measured</span><span class="lc-sub">When the origin and the proxy disagree</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-8-2-cache-dung" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 8.2 — Cache keys, TTL and invalidation done right</span><span class="lc-sub">The CDN side of the same headers</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache-Control</span><span class="v">The header set at upload that tells the CDN/browser how long to cache.</span></div>
  <div class="kv"><span class="k">max-age</span><span class="v">Seconds a response may be reused — 31536000 is one year.</span></div>
  <div class="kv"><span class="k">immutable</span><span class="v">Promise the body will never change at this URL — no revalidation.</span></div>
  <div class="kv"><span class="k">Versioned URL</span><span class="v">A content hash in the key, so a new version is a new URL.</span></div>
  <div class="kv"><span class="k">Invalidation</span><span class="v">Forcing the CDN to drop a cached object — avoid by versioning.</span></div>
  <div class="kv"><span class="k">cf-cache-status</span><span class="v">Cloudflare header: MISS/HIT/EXPIRED — proof the cache took effect.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Set <code>Cache-Control</code> at upload: immutable assets get one year + <code>immutable</code>, mutable content gets a short max-age.</li><li>A versioned URL (content hash in the key) beats a short cache plus invalidation.</li><li>The Cloudflare CDN tunes its edge cache from that header — a wrong value is a stale or uncached object.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — HTTP caching</span><span class="lc-sub">web.dev/http-cache — Cache-Control guide.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-4-phuc-vu-media-cache" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 10.4: Serving media back</span><span class="lc-sub">The Node.js course checks these headers on production: curl -I reports cf-cache-status: DYNAMIC because it sends HEAD, while a real GET reports HIT with age 26 → 33 seven seconds later; If-None-Match returns 304 with 0 bytes and Range 0-99 returns exactly 100 bytes. It also measures what resizing and WebP/AVIF are worth and what proxying media through an API costs.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Cache-Control theo content type</h2>
<p class="lead">Cache-Control header set trên object lúc upload điều khiển bao lâu browser và CDN cache response. TTL sai = hoặc content stale, hoặc hit không cần.</p>

<h3>Kho này đặt gì</h3>
<p><em>Đính chính (14/11/2026): bản trước của bài trích một bảng <code>CACHE_POLICIES</code> từ <code>upload.service.ts</code>. Bảng đó không tồn tại (grep ra 0). Mã thật làm thế này:</em></p>
<pre><code class="language-ts">// src/config/r2.ts:110 — MỘT mặc định cho mọi tệp công khai
export async function putObject(key, body, contentType,
  cacheControl: string = 'public, max-age=31536000, immutable',   // 1 năm, immutable
  contentDisposition?: string) { … }
// src/storage/StorageProvider.ts:263 — tệp công khai truyền undefined ⇒ nhận mặc định
await r2Put(key, body, contentType, undefined, opts?.contentDisposition);
// tệp riêng tư tự truyền: 'private, max-age=0, no-store' (×6), 'private, max-age=0' (×4) …
// getSignedUploadUrl (PUT ký sẵn, video từ trình duyệt) chỉ ký Content-Type ⇒ KHÔNG lưu Cache-Control
</code></pre>
<p>Một năm cho mọi tệp công khai an toàn ở đây chỉ vì mọi key đều có phiên bản (<code>buildKey()</code> gắn <code>&lt;ms&gt;-&lt;12 hex&gt;</code>).</p>

<h3>Immutable vs mutable</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">immutable</span><span class="lz-nsub">1 year + immutable directive</span></span>
<span class="lz-nbody">Content không bao giờ đổi ở URL này. Version mới = URL mới (versioned key hoặc hash). Browser aggressive cache, không hỏi server. VD: image, video, minified JS bundle.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">short-cache</span><span class="lz-nsub">1 hour</span></span>
<span class="lz-nbody">Content có thể đổi. Client fetch fresh occasionally. VD: profile avatar (URL stable), music stream. Cân bằng freshness vs origin hit.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">no-cache</span><span class="lz-nsub">max-age=0</span></span>
<span class="lz-nbody">Không cache. Mỗi fetch hit origin. Hiếm — chỉ cho content BẮT BUỘC fresh VÀ đổi thường xuyên. Lãng phí; thử versioned URL trước.</span>
</div>
</div>

<h3>Versioned URL trump cache tuning</h3>
<pre><code class="language-text">Cach kem:
  URL:  https://media/avatar-user-42.jpg
  Cache: 1 hour
  Update: replace object, wait 1 hour for cache expire
  Bad UX: stale avatar for 1 hour after change

Cach tot:
  URL:  https://media/avatar-user-42-v42.jpg  (or -&lt;hash&gt;.jpg)
  Cache: 1 year immutable
  Update: upload NEW key with new version, update DB URL
  Old key eventually cleanup via lifecycle (Chuong 6)
  Perfect UX: instant switch, no cache fight
</code></pre>

<div class="callout ok">
<p><strong>Versioned URL = cache aggressive + không cần invalidation.</strong> Kho này dùng pattern này cho mọi upload — <code>buildKey()</code> sinh <code>images/avatar/u42/1794700100000-5e6f7a8b9c0d.jpg</code> (mốc thời gian + 12 hex ngẫu nhiên).</p>
</div>

<h3>CDN cache invalidation — khi cần</h3>
<pre><code class="language-bash"># Cloudflare purge URL
$ curl -X POST \\
    "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \\
    -H "Authorization: Bearer $TOKEN" \\
    -H "Content-Type: application/json" \\
    -d '{"files":["https://media.cuongthai.com/x.jpg"]}'
</code></pre>

<p>Giới hạn purge (tài liệu Cloudflare, kiểm 14/11/2026): purge theo URL ở gói Free là 800 URL mỗi giây, tối đa 100 URL mỗi lệnh (bản trước ghi "30 purge/ngày" — không có nguồn). Dù vậy purge là sửa chữa, không phải thiết kế: versioned URL không bao giờ cần nó.</p>

<h3>Cache-Control syntax</h3>
<pre><code class="language-text">public                — anyone (including CDN) can cache
private               — only browser can cache
max-age=N             — N seconds
s-maxage=N            — for CDN (overrides max-age for CDN)
immutable             — content never changes at this URL (skip revalidation)
no-cache              — must revalidate before use (still cache but check)
no-store              — never cache (rare)

Combo cho immutable static asset:
  public, max-age=31536000, immutable
Combo cho private user data:
  private, max-age=60
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — set aggressive cache-control cho mutable content.</strong> Avatar cache 1 year. User đổi avatar. 1 năm sau bạn bè họ vẫn thấy avatar cũ. Fix: hoặc dùng versioned URL, hoặc cache short với hash query string append.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Cache-Control set lúc upload: immutable content (image, video, hashed asset) = 1 year immutable, mutable content = 1 hour max-age, versioned URL tốt hơn short cache + invalidation, và Cloudflare CDN cache-tuning tự động dựa vào header — set đúng lúc upload.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Upload hai object: một với <code>CacheControl: &#39;public, max-age=31536000, immutable&#39;</code>, một với <code>&#39;public, max-age=3600&#39;</code>.</li>
<li><code>curl -I</code> từng cái qua CDN hai lần và đọc <code>cache-control</code> cùng <code>cf-cache-status</code> (MISS rồi HIT) để thấy edge cache cái immutable.</li>
<li>Đổi tên một asset dùng content hash trong key (<code>app.9f2c1.js</code>) và giải thích vì sao versioned URL cho phép giữ cache một năm an toàn.</li>
<li>Đổi file sau một key KHÔNG versioned và quan sát cache cũ kẹt cả năm — rồi nêu cách vá (version URL, đừng kéo dài invalidation).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã thấy MISS→HIT trên object immutable và giải thích được vì sao versioning tốt hơn invalidation.</p></div>

<h3>🔬 Đo thật: bốn chính sách qua một cache</h3>
<p>MinIO cục bộ + nginx 1.27 đóng vai Cloudflare (chép luật mặc định Cloudflare công bố: mã 200 không có Cache-Control giữ 120 phút, 404 giữ 3 phút; <code>X-Cache-Status</code> thay cho <code>cf-cache-status</code>). Không lệnh nào chạm bucket thật.</p>
<div class="out">$ node bon.mjs
PUT cc/anh-a1b2c3.webp   Cache-Control: public, max-age=31536000, immutable
PUT cc/nhac.mp3          Cache-Control: public, max-age=3600
PUT cc/hoa-don.pdf       Cache-Control: private, max-age=0, no-store
PUT cc/khong-dat.mp4     Cache-Control: (không có)
$ bash hai-lan.sh
cc/anh-a1b2c3.webp   lượt 1  public, max-age=31536000, immutable x-cache: MISS
cc/anh-a1b2c3.webp   lượt 2  public, max-age=31536000, immutable x-cache: HIT
cc/nhac.mp3          lượt 1  public, max-age=3600               x-cache: MISS
cc/nhac.mp3          lượt 2  public, max-age=3600               x-cache: HIT
cc/hoa-don.pdf       lượt 1  private, max-age=0, no-store       x-cache: MISS
cc/hoa-don.pdf       lượt 2  private, max-age=0, no-store       x-cache: MISS
cc/khong-dat.mp4     lượt 1                                     x-cache: MISS
cc/khong-dat.mp4     lượt 2                                     x-cache: HIT</div>
<p><code>private, no-store</code> không bao giờ được giữ. Không có header vẫn được cache — theo mặc định của cache (Cloudflare: 120 phút cho mã 200, chỉ với các đuôi tệp mặc định như jpg, webp, mp4, pdf; không có html/json).</p>
<h3>🔬 Đo thật: ghi đè key đang cache vs key mới</h3>
<div class="out">$ bash doi.sh
1) tải avatar-u42.jpg (bản 1) và xem qua CDN:
ETag: "2fa874584e87f8e8b25847347806ab36" X-Cache-Status: MISS
ETag: "2fa874584e87f8e8b25847347806ab36" X-Cache-Status: HIT
2) ghi ĐÈ cùng key bằng bản 2:
   bucket: "9f8b26e59770287841634cdff2e817e0"
   CDN   : ETag: "2fa874584e87f8e8b25847347806ab36" X-Cache-Status: HIT   ⇐ vẫn bản 1, còn 1 năm
   nội dung CDN trả: avatar ban 1
3) cách đúng — key MỚI (buildKey của kho: &lt;ms&gt;-&lt;hex&gt;), cập nhật DB sang key mới:
ETag: "9f8b26e59770287841634cdff2e817e0" X-Cache-Status: MISS
   nội dung: avatar ban 2 da doi</div>
<h3>🔬 Đo thật: lỗi 404 bị cache</h3>
<div class="out">$ bash som.sh
GET trước khi đẩy : HTTP/1.1 404 Not Found X-Cache-Status: MISS
đã đẩy tệp lên bucket
GET ngay sau      : HTTP/1.1 404 Not Found X-Cache-Status: HIT
bucket trực tiếp  : 4 byte — tệp CÓ thật</div>
<p>Không bao giờ GET URL công khai của một tệp trước khi tải nó lên — CDN giữ luôn lỗi 404. Slide của khoá này theo đúng luật đó, và deck vẽ lại thì sang prefix mới (<code>v2</code>) chứ không ghi đè.</p>
<h3>🔬 Kiểm trong kho + một PUT ký sẵn</h3>
<div class="out">$ grep -n "cacheControl: string = " src/config/r2.ts &amp;&amp; grep -n "r2Put(key, body, contentType, undefined" src/storage/StorageProvider.ts
114:  cacheControl: string = 'public, max-age=31536000, immutable',
263:    const res = await r2Put(key, body, contentType, undefined, opts?.contentDisposition);
$ grep -rhoE "putObject\\([^)]*'(public|private)[^']*'" src --include='*.ts' | grep -oE "'(public|private)[^']*'" | sort | uniq -c | sort -rn
   6 'private, max-age=0, no-store'
   4 'private, max-age=0'
   1 'private, max-age=31536000, immutable'
$ grep -rn "CACHE_POLICIES" src | wc -l | sed 's/^ */CACHE_POLICIES (bài web cũ trích từ upload.service.ts): /'
CACHE_POLICIES (bài web cũ trích từ upload.service.ts): 0
$ sed -n '/export async function getSignedUploadUrl/,/^}/p' src/config/r2.ts | grep -nE "ContentType|CacheControl|signableHeaders" ; echo "⇒ PUT ký sẵn (video tải thẳng từ trình duyệt) KHÔNG mang Cache-Control"
10:    ContentType: contentType,
14:    signableHeaders: new Set(['content-type']),
⇒ PUT ký sẵn (video tải thẳng từ trình duyệt) KHÔNG mang Cache-Control</div>
<div class="out">$ node ps.mjs
PUT ký sẵn       : 200
HEAD trên bucket : ContentType=video/mp4 CacheControl=(không có)
$ for i in 1 2; do curl -s -o /dev/null -D - http://localhost:20202/video/u42/1794700200000-0a1b2c3d4e5f.mp4 | grep -iE '^(cache-control|x-cache-status)' | tr -d '\\r' | paste -sd' ' - | sed 's/^$/(không có cache-control)/' ; done
X-Cache-Status: MISS
X-Cache-Status: HIT</div>
<p>Tệp tải từ trình duyệt qua <code>getSignedUploadUrl()</code> được lưu KHÔNG có Cache-Control, nên CDN dùng mặc định (Cloudflare: 2 giờ), không phải một năm. Muốn đổi: đặt <code>CacheControl</code> trong lệnh <em>và</em> trong <code>signableHeaders</code>, và trình duyệt gửi header y hệt.</p>
<h3>🔬 Đo nhẹ trên production</h3>
<p>Một video bài giảng công khai, <code>U=https://media.cuongthai.com/videos/bai-giang/linux-bash/…/00-01-bat-dau-tai-day-48d9d700.mp4</code> — một HEAD và một Range 100 byte, không kéo cả tệp:</p>
<div class="out">$ curl -sI "$U" | grep …; curl -s -r 0-99 -o /dev/null -D - "$U" | grep …
content-type: video/mp4
content-length: 127087927
cache-control: public, max-age=31536000, immutable
cf-cache-status: DYNAMIC
HTTP/2 206 
content-range: bytes 0-99/127087927
cf-cache-status: HIT</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Bạn gặp cache hằng ngày:</strong> đổi ảnh đại diện mà bạn bè vẫn thấy ảnh cũ một lúc; sửa web xong trang vẫn cũ tới khi bấm Ctrl+F5.</li>
<li><strong>Nếu xoá một tệp đã nằm trong cache thì sao?</strong> Và kẻ xấu lợi dụng cache thế nào? Đo trên lab:</li>
</ul>
<div class="out">$ bash xoa.sh
xem 2 lượt       : 200 X-Cache-Status: HIT
đã XOÁ khỏi bucket
bucket trực tiếp : 404 — không còn
qua CDN          : HTTP/1.1 200 OK X-Cache-Status: HIT
$ bash xuyen.sh
20 GET cùng một ảnh, mỗi lượt một ?x= ngẫu nhiên ⇒ HIT 0 · MISS 20 (MISS = một request tới bucket)
20 GET đúng URL gốc ⇒ HIT 20</div>
<p>Cache là bản sao bạn không còn kiểm soát: dữ liệu riêng tư không bao giờ được đặt <code>public</code>. Query string ngẫu nhiên xuyên qua cache và chạy tới bucket mọi lần (mỗi lần một thao tác Class B của R2) — ở CDN, bỏ qua query string với tệp tĩnh và giới hạn tần suất.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Dùng lại lab MinIO + nginx của bài 3.1 (<code>proxy_cache_valid 200 206 120m; proxy_cache_valid 404 3m;</code> chép mặc định của Cloudflare). PUT kèm <code>--cache-control</code> (aws-cli) hoặc <code>CacheControl</code> (SDK), GET hai lần bằng <code>curl -s -D - -o /dev/null</code>, ghi đè, rồi tải lên một key mới.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-3-ai-quyet-dinh-thoi-han" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 5.3 — Ai quyết định giữ bao lâu: chuỗi ưu tiên, đo thật</span><span class="lc-sub">Khi máy chủ gốc và proxy nói khác nhau</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-8-2-cache-dung" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking cho developer · 8.2 — Khoá cache, TTL và xoá cache cho đúng</span><span class="lc-sub">Phía CDN của cùng các header này</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache-Control</span><span class="v">Header set lúc upload, bảo CDN/browser cache bao lâu.</span></div>
  <div class="kv"><span class="k">max-age</span><span class="v">Số giây một response được tái dùng — 31536000 là một năm.</span></div>
  <div class="kv"><span class="k">immutable</span><span class="v">Cam kết body không bao giờ đổi ở URL này — không revalidate.</span></div>
  <div class="kv"><span class="k">Versioned URL</span><span class="v">Content hash trong key, nên version mới là URL mới.</span></div>
  <div class="kv"><span class="k">Invalidation</span><span class="v">Buộc CDN bỏ một object đã cache — tránh bằng versioning.</span></div>
  <div class="kv"><span class="k">cf-cache-status</span><span class="v">Header Cloudflare: MISS/HIT/EXPIRED — bằng chứng cache có hiệu lực.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Set <code>Cache-Control</code> lúc upload: asset immutable = một năm + <code>immutable</code>, content mutable = max-age ngắn.</li><li>Versioned URL (content hash trong key) tốt hơn short cache cộng invalidation.</li><li>Cloudflare CDN chỉnh edge cache theo header đó — giá trị sai là object cũ hoặc không cache.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — HTTP caching</span><span class="lc-sub">web.dev/http-cache — Cache-Control guide.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-4-phuc-vu-media-cache" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 10.4: Phục vụ media trở lại</span><span class="lc-sub">Khoá Node.js kiểm các header này trên production: curl -I báo cf-cache-status: DYNAMIC vì nó gửi HEAD, còn một GET thật báo HIT với age 26 → 33 sau bảy giây; If-None-Match trả 304 với 0 byte, Range 0-99 trả đúng 100 byte. Bài đó còn đo thu nhỏ và WebP/AVIF đáng giá bao nhiêu, và proxy media qua API tốn gì.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },

    {
      title: '3.3 — Signed URLs for private objects|||3.3 — Signed URL cho private object',
      slug: 'os-3-3-signed',
      type: 'VIDEO',
      description: '`getSignedUrl` từ SDK, TTL 5-10 phút, dùng cho paid course PDF hoặc expiring share link. Signature verify by R2.',
      content: `
${G03_3}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Signed URLs for private objects</h2>
<p class="lead">Most content is public — no auth, cached by CDN, served free. Sometimes you need private: paid course PDFs, temporary share links. Signed URLs give short-lived access without making objects public.</p>

<h3>Generate signed URL</h3>
<pre><code class="language-ts">import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function getSignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 300,   // 5 phut default (src/config/r2.ts:322)
  filename?: string,                 // co ten =&gt; Content-Disposition: attachment
): Promise&lt;string&gt; {
  const cmd = new GetObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    ...(filename ? { ResponseContentDisposition: 'attachment; filename=&quot;' + filename.replace(/[^\\w.-]/g, '_') + '&quot;' } : {}),
  });
  return getSignedUrl(getR2Client(), cmd, { expiresIn: expiresInSeconds });
}

// Usage: paid course PDF
const url = await getSignedDownloadUrl('paid/course-5/lesson-3.pdf', 600);
// -&gt; return to client, valid 10 min
</code></pre>

<h3>Signature format (SigV4)</h3>
<pre><code class="language-text">https://xxx.r2.cloudflarestorage.com/bucket/paid/lesson.pdf
  ?X-Amz-Algorithm=AWS4-HMAC-SHA256
  &X-Amz-Credential=ACCESS_KEY_ID/20260824/auto/s3/aws4_request
  &X-Amz-Date=20260824T120000Z
  &X-Amz-Expires=600
  &X-Amz-Signature=abc123...

Signature = HMAC-SHA256 cua request + key + date + expires
R2 recalculate signature; match -&gt; serve; nomatch -&gt; 403
</code></pre>

<h3>The pattern — a paid course (illustrative: this repo has no such route; its real one is <code>getSignedFileUrl</code> in <code>src/services/hub.service.ts:623</code>, measured below)</h3>
<pre><code class="language-ts">// GET /api/v1/courses/:courseId/lessons/:lessonId/download
async function downloadLesson(req, res) {
  const { courseId, lessonId } = req.params;
  const userId = req.user.id;
  
  // 1. Verify user enrolled
  const enrolled = await isEnrolled(userId, courseId);
  if (!enrolled) return res.sendStatus(403);
  
  // 2. Get file key from DB
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  
  // 3. Return short-lived signed URL
  const url = await getSignedDownloadUrl(lesson.fileKey, 600);
  res.json({ url });   // FE fetch this URL within 10 min
}
</code></pre>

<div class="callout ok">
<p><strong>Two-step redirect protects private files.</strong> Client GET your API endpoint with auth cookie → server verify entitlement → server returns signed URL → client fetch signed URL directly from R2. R2 serves without your server bandwidth.</p>
</div>

<h3>TTL choice</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Short (5-10 min)</span><span class="lz-t">Client immediately downloads</span><span class="lz-d">Standard. Enough time for client to start download; not enough for URL sharing.</span></div>
<div class="lz-step"><span class="lz-k">Medium (1 hour)</span><span class="lz-t">Video streaming</span><span class="lz-d">Video player may pause + resume. Signed URL should survive one viewing session.</span></div>
<div class="lz-step"><span class="lz-k">Long (7 days)</span><span class="lz-t">Share link with expiry</span><span class="lz-d">The SigV4 ceiling is 7 days (604,800 s — the SDK refuses 604,801, measured below). For &quot;share this file until Friday&quot; UX.</span></div>
</div>

<h3>Signed URL cho UPLOAD (presigned PUT)</h3>
<pre><code class="language-ts">// Client can upload DIRECTLY to R2, bypassing your server
import { PutObjectCommand } from '@aws-sdk/client-s3';

const cmd = new PutObjectCommand({
  Bucket, Key: key,
  ContentType: 'video/mp4',
});
const url = await getSignedUrl(client, cmd, {
  expiresIn: 3600,
  signableHeaders: new Set(['content-type']),   // CRITICAL — see Chuong 4 (this repo, r2.ts:171; host is always signed anyway)
});
</code></pre>

<div class="callout warn">
<p><strong>Chapter 4 measures the real SigV4 bug this repo hit when signableHeaders was wrong.</strong> Presigned PUT security is subtle — Chapter 4 covers it in detail.</p>
</div>

<div class="pitfall">
<p><strong>Trap — cache signed URL trong DB.</strong> The signature expires. Cache it for 24 hours in the database and the URL is dead before the user clicks. Regenerate it per request.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A signed URL gives short-lived private access (5-10 minutes for a download, an hour for streaming) without making the object public — this repo's pattern is an API endpoint that verifies entitlement and returns a signed URL for the client to fetch straight from R2, saving server bandwidth; signed URLs for upload (presigned PUT) are a separate topic, covered in Chapter 4.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Generate a signed GET URL with <code>getSignedUrl</code> and <code>expiresIn: 300</code> (5 min) for a PRIVATE object, and open it in the browser — it works.</li>
<li>Wait past the expiry and reload — read the 403 and its <code>&lt;Code&gt;</code> (expired signature).</li>
<li>Build the repo's pattern: an authenticated route that checks the user is entitled, then returns a signed URL so the client fetches straight from R2 (not proxied through your server).</li>
<li>Explain the one bandwidth number this saves: bytes that would otherwise pass through your server on every download.</li>
</ol>
<p><strong>Done when:</strong> a short-lived signed URL worked then expired, and you have an entitlement-check route that returns a signed URL instead of streaming bytes.</p></div>

<h3>🔬 Measured: valid, unsigned, expired, tampered — and the 7-day ceiling</h3>
<p>Local MinIO (a private bucket on the S3 API port), SDK v3 3.1071.0. Nothing here touches the real bucket.</p>
<div class="out">$ u=$(node ky.mjs paid/course-5/lesson-3.pdf 5); echo "\${u%%\\?*}?…X-Amz-Expires=$(echo "$u" | grep -o 'X-Amz-Expires=[0-9]*' | cut -d= -f2)…"; bash goi.sh "$u"; echo "$u" &gt; ky5.txt
http://localhost:20200/media-ch3/paid/course-5/lesson-3.pdf?…X-Amz-Expires=5…
HTTP 200 · 6300 byte  
$ curl -s -o /dev/null -w 'không chữ ký: HTTP %{http_code}\\n' http://localhost:20200/media-ch3/paid/course-5/lesson-3.pdf
không chữ ký: HTTP 403
$ sleep 6; echo "… 6 giây sau:"; bash goi.sh "$(cat ky5.txt)"
… 6 giây sau:
HTTP 403 · 366 byte &lt;Code&gt;AccessDenied&lt;/Code&gt; &lt;Message&gt;Request has expired&lt;/Message&gt;
$ u=$(node ky.mjs paid/course-5/lesson-3.pdf 300); bash goi.sh "\${u/lesson-3/lesson-4}"
HTTP 403 · 469 byte &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt; &lt;Message&gt;The request signature we calculated does not match the signature you provided. Check your key and signing method.&lt;/Message&gt;
$ node -e "… getSignedUrl(…, { expiresIn: g }) với g = 604800 rồi 604801 …"
604800 giây: ký được
604801 giây: Signature version 4 presigned URLs must have an expiration date less than one week in the future</div>
<p>Read the <code>&lt;Message&gt;</code>: "Request has expired" means the deadline passed; <code>SignatureDoesNotMatch</code> means the URL was changed. In this repo: 300 s (Hub, class work), 600 s (chat files, NDA, issue files), 120 s for client-portal links, 600 s for ffmpeg reading a fresh upload.</p>
<h3>🔬 Measured: the entitlement route — check, sign, step aside</h3>
<div class="out">$ curl -s -o /dev/null -w 'chưa đăng nhập      ⇒ HTTP %{http_code}\\n' localhost:20203/link/course-5/lesson-9
chưa đăng nhập      ⇒ HTTP 401
$ curl -s -o /dev/null -w 'u7 chưa mua         ⇒ HTTP %{http_code}\\n' -b user=u7 localhost:20203/link/course-5/lesson-9
u7 chưa mua         ⇒ HTTP 403
$ u=$(curl -s -b user=u42 localhost:20203/link/course-5/lesson-9 | node -pe 'JSON.parse(require("fs").readFileSync(0)).url'); curl -s -o /dev/null -w 'u42 đã mua ⇒ tải từ bucket: HTTP %{http_code} · %{size_download} byte\\n' "$u"
u42 đã mua ⇒ tải từ bucket: HTTP 200 · 5242881 byte
$ echo "byte đi qua máy chủ (cách signed URL): $(curl -s localhost:20203/byte)"
byte đi qua máy chủ (cách signed URL): 438
$ curl -s -o /dev/null -w 'u42 cách PROXY ⇒ HTTP %{http_code} · %{size_download} byte\\n' -b user=u42 localhost:20203/proxy/course-5/lesson-9
u42 cách PROXY ⇒ HTTP 200 · 5242881 byte
$ echo "byte đi qua máy chủ (sau một lượt proxy): $(curl -s localhost:20203/byte)"
byte đi qua máy chủ (sau một lượt proxy): 5243319</div>
<p>438 bytes went through the server with a signed URL; with a proxy the server itself sent 5,243,319. The real version in this repo is <code>getSignedFileUrl()</code> (<code>src/services/hub.service.ts:623</code>): the permission check is the query itself (<code>where: { id, userId }</code>), and a file that is not yours is a 404, not a 403 — a 403 would confirm the ID exists.</p>
<h3>🔬 Measured: filename ⇒ download, and a finding</h3>
<div class="out">$ node tai.mjs
filename=không                           ⇒ 200 (không có Content-Disposition ⇒ trình duyệt MỞ luôn)
filename="lesson-3.pdf"                  ⇒ 200 attachment; filename="lesson-3.pdf"
filename="Đề thi cuối kỳ (bản 2).pdf"    ⇒ 200 attachment; filename="___thi_cu_i_k___b_n_2_.pdf"</div>
<p>Finding (not fixed in this lesson): <code>src/config/r2.ts:331</code> replaces every non-ASCII character, so Vietnamese filenames lose all accented letters. RFC 6266 allows <code>filename*=UTF-8''&lt;percent-encoded&gt;</code> plus an ASCII fallback.</p>
<h3>🔬 Measured: signed URLs a browser can cache</h3>
<p><code>getSignedReadUrl()</code> (<code>src/config/r2.ts:350</code>) copied verbatim: <code>signingDate</code> rounded down to 30 minutes, 90-minute life.</p>
<div class="out">$ node cuaso.mjs
gọi lúc 10:05 ⇒ ký lúc 10:00 · hết hạn 11:30 · chữ ký 47f1f5628983…
gọi lúc 10:20 ⇒ ký lúc 10:00 · hết hạn 11:30 · chữ ký 47f1f5628983…
gọi lúc 10:29 ⇒ ký lúc 10:00 · hết hạn 11:30 · chữ ký 47f1f5628983…
gọi lúc 10:31 ⇒ ký lúc 10:30 · hết hạn 12:00 · chữ ký 78bb92910b35…</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>You have met this:</strong> a Google Drive "anyone with the link" file; an e-invoice email whose download link "is valid for 7 days".</li>
<li><strong>What if a signed URL is forwarded into a group chat?</strong> Measured — a signed URL is a bearer link, not tied to any person:</li>
</ul>
<div class="out">$ bash lo.sh
người mua (cookie u42)        : 200
người lạ trong nhóm chat      : 200
URL lộ ra gì? X-Amz-Credential = &lt;access-key-id&gt;/20261114/us-east-1/s3/aws4_request
người lạ, 9 giây sau          : 403 &lt;Message&gt;Request has expired&lt;/Message&gt;
$ u=$(node ky.mjs paid/course-5/lesson-3.pdf 300); curl -s -r 0-99 -o /dev/null -w 'Range 0-99 trên signed URL ⇒ HTTP %{http_code} · %{size_download} byte (video tua được)\\n' "$u"
Range 0-99 trên signed URL ⇒ HTTP 206 · 100 byte (video tua được)</div>
<p>Defend: short lifetimes; sign per request (never store signed URLs in the database); never log full signed URLs; the URL reveals only the access key ID, never the secret.</p>
<h3>🔁 Run it yourself</h3>
<p>On MinIO: <code>getSignedUrl(s3, new GetObjectCommand(…), { expiresIn: 5 })</code>, fetch, wait 6 s, fetch again; change one character of a valid URL; write a tiny <code>node:http</code> server that answers 401 / 403 / <code>{ url }</code> and compare the bytes it sends with a proxy version.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-1-4-bam-mac-chu-ky" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 1.4 — Hash, MAC, signature: three tools, one confusion</span><span class="lc-sub">What X-Amz-Signature really is</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-9-1-phan-quyen-la-gi" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 9.1 — Where authentication ends and the expensive bugs begin</span><span class="lc-sub">The entitlement check, in depth</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Signed URL</span><span class="v">A URL carrying a time-limited signature that grants access without making the object public.</span></div>
  <div class="kv"><span class="k">getSignedUrl</span><span class="v">The <code>s3-request-presigner</code> call that produces one.</span></div>
  <div class="kv"><span class="k">expiresIn</span><span class="v">Lifetime in seconds — short for downloads, longer for streaming.</span></div>
  <div class="kv"><span class="k">Entitlement check</span><span class="v">The server verifying the user may access the object before signing.</span></div>
  <div class="kv"><span class="k">Direct fetch</span><span class="v">Client downloads straight from R2, so bytes never pass through your server.</span></div>
  <div class="kv"><span class="k">Presigned PUT</span><span class="v">The upload variant — a separate topic in Chapter 4.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A signed URL is short-lived private access (5–10 min download, ~1h streaming) without a public object.</li><li>The repo's pattern: an authed route checks entitlement, then returns a signed URL the client fetches directly from R2 — saving server bandwidth.</li><li>Signed URLs for upload (presigned PUT) are a separate topic, covered in Chapter 4.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@aws-sdk/s3-request-presigner</span><span class="lc-sub">github.com/aws/aws-sdk-js-v3/tree/main/packages/s3-request-presigner — API.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Signed URL cho private object</h2>
<p class="lead">Đa phần content là public — không auth, cached bởi CDN, serve free. Đôi khi bạn cần private: paid course PDF, temporary share link. Signed URL cho short-lived access mà không public hoá object.</p>

<h3>Sinh signed URL</h3>
<pre><code class="language-ts">import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function getSignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 300,   // 5 phut default (src/config/r2.ts:322)
  filename?: string,                 // co ten =&gt; Content-Disposition: attachment
): Promise&lt;string&gt; {
  const cmd = new GetObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    ...(filename ? { ResponseContentDisposition: 'attachment; filename=&quot;' + filename.replace(/[^\\w.-]/g, '_') + '&quot;' } : {}),
  });
  return getSignedUrl(getR2Client(), cmd, { expiresIn: expiresInSeconds });
}

// Usage: paid course PDF
const url = await getSignedDownloadUrl('paid/course-5/lesson-3.pdf', 600);
// -&gt; return to client, valid 10 min
</code></pre>

<h3>Signature format (SigV4)</h3>
<pre><code class="language-text">https://xxx.r2.cloudflarestorage.com/bucket/paid/lesson.pdf
  ?X-Amz-Algorithm=AWS4-HMAC-SHA256
  &X-Amz-Credential=ACCESS_KEY_ID/20260824/auto/s3/aws4_request
  &X-Amz-Date=20260824T120000Z
  &X-Amz-Expires=600
  &X-Amz-Signature=abc123...

Signature = HMAC-SHA256 cua request + key + date + expires
R2 recalculate signature; match -&gt; serve; nomatch -&gt; 403
</code></pre>

<h3>Mẫu — paid course (minh hoạ: kho này không có route đó; route thật là <code>getSignedFileUrl</code> trong <code>src/services/hub.service.ts:623</code>, đo bên dưới)</h3>
<pre><code class="language-ts">// GET /api/v1/courses/:courseId/lessons/:lessonId/download
async function downloadLesson(req, res) {
  const { courseId, lessonId } = req.params;
  const userId = req.user.id;
  
  // 1. Verify user enrolled
  const enrolled = await isEnrolled(userId, courseId);
  if (!enrolled) return res.sendStatus(403);
  
  // 2. Get file key from DB
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  
  // 3. Return short-lived signed URL
  const url = await getSignedDownloadUrl(lesson.fileKey, 600);
  res.json({ url });   // FE fetch this URL within 10 min
}
</code></pre>

<div class="callout ok">
<p><strong>Two-step redirect bảo vệ private file.</strong> Client GET API endpoint của bạn với auth cookie → server verify entitlement → server trả signed URL → client fetch signed URL trực tiếp từ R2. R2 serve mà không tốn server bandwidth.</p>
</div>

<h3>Chọn TTL</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Ngắn (5-10 phút)</span><span class="lz-t">Client immediately download</span><span class="lz-d">Chuẩn. Đủ thời gian cho client start download; không đủ để share URL.</span></div>
<div class="lz-step"><span class="lz-k">Trung bình (1 giờ)</span><span class="lz-t">Video streaming</span><span class="lz-d">Video player có thể pause + resume. Signed URL nên sống qua 1 viewing session.</span></div>
<div class="lz-step"><span class="lz-k">Dài (7 ngày)</span><span class="lz-t">Share link có expiry</span><span class="lz-d">Trần của SigV4 là 7 ngày (604.800 s — SDK từ chối 604.801, đo bên dưới). Cho &quot;share file này đến thứ Sáu&quot; UX.</span></div>
</div>

<h3>Signed URL cho UPLOAD (presigned PUT)</h3>
<pre><code class="language-ts">// Client co the upload TRUC TIEP toi R2, bypass server cua ban
import { PutObjectCommand } from '@aws-sdk/client-s3';

const cmd = new PutObjectCommand({
  Bucket, Key: key,
  ContentType: 'video/mp4',
});
const url = await getSignedUrl(client, cmd, {
  expiresIn: 3600,
  signableHeaders: new Set(['content-type']),   // CRITICAL — xem Chuong 4 (kho, r2.ts:171; host luon duoc ky)
});
</code></pre>

<div class="callout warn">
<p><strong>Chương 4 đo bug SigV4 thật của kho này khi signableHeaders sai.</strong> Presigned PUT security phức tạp — Chương 4 dạy chi tiết.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — cache signed URL trong DB.</strong> Signature có expiry. Cache 24h in DB → URL expired trước khi user click. Regenerate mỗi request.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Signed URL = short-lived (5-10 phút cho download, 1 giờ cho streaming) private access mà không public hoá object — kho này pattern: API endpoint verify entitlement + return signed URL cho client fetch trực tiếp từ R2, tiết kiệm server bandwidth; signed URL cho upload (presigned PUT) là topic riêng cover trong Chương 4.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Sinh một signed GET URL với <code>getSignedUrl</code> và <code>expiresIn: 300</code> (5 phút) cho một object PRIVATE, mở trong browser — chạy được.</li>
<li>Chờ qua hạn và tải lại — đọc 403 và <code>&lt;Code&gt;</code> của nó (chữ ký hết hạn).</li>
<li>Dựng pattern của kho: một route có auth kiểm user được phép, rồi trả signed URL để client fetch thẳng từ R2 (không proxy qua server).</li>
<li>Giải thích con số bandwidth duy nhất việc này tiết kiệm: byte lẽ ra đi qua server bạn ở mỗi lượt download.</li>
</ol>
<p><strong>Đạt khi:</strong> một signed URL short-lived chạy rồi hết hạn, và bạn có một route kiểm entitlement trả signed URL thay vì stream byte.</p></div>

<h3>🔬 Đo thật: hợp lệ, không ký, hết hạn, bị sửa — và trần 7 ngày</h3>
<p>MinIO cục bộ (bucket riêng tư trên cổng S3 API), SDK v3 3.1071.0. Không lệnh nào chạm bucket thật.</p>
<div class="out">$ u=$(node ky.mjs paid/course-5/lesson-3.pdf 5); echo "\${u%%\\?*}?…X-Amz-Expires=$(echo "$u" | grep -o 'X-Amz-Expires=[0-9]*' | cut -d= -f2)…"; bash goi.sh "$u"; echo "$u" &gt; ky5.txt
http://localhost:20200/media-ch3/paid/course-5/lesson-3.pdf?…X-Amz-Expires=5…
HTTP 200 · 6300 byte  
$ curl -s -o /dev/null -w 'không chữ ký: HTTP %{http_code}\\n' http://localhost:20200/media-ch3/paid/course-5/lesson-3.pdf
không chữ ký: HTTP 403
$ sleep 6; echo "… 6 giây sau:"; bash goi.sh "$(cat ky5.txt)"
… 6 giây sau:
HTTP 403 · 366 byte &lt;Code&gt;AccessDenied&lt;/Code&gt; &lt;Message&gt;Request has expired&lt;/Message&gt;
$ u=$(node ky.mjs paid/course-5/lesson-3.pdf 300); bash goi.sh "\${u/lesson-3/lesson-4}"
HTTP 403 · 469 byte &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt; &lt;Message&gt;The request signature we calculated does not match the signature you provided. Check your key and signing method.&lt;/Message&gt;
$ node -e "… getSignedUrl(…, { expiresIn: g }) với g = 604800 rồi 604801 …"
604800 giây: ký được
604801 giây: Signature version 4 presigned URLs must have an expiration date less than one week in the future</div>
<p>Đọc <code>&lt;Message&gt;</code>: "Request has expired" là quá hạn; <code>SignatureDoesNotMatch</code> là URL bị sửa. Trong kho: 300 s (Hub, bài nộp lớp), 600 s (tệp chat, NDA, tệp issue), 120 s cho đường dẫn cổng khách hàng, 600 s cho ffmpeg đọc video vừa tải lên.</p>
<h3>🔬 Đo thật: route kiểm quyền — kiểm, ký, đứng sang bên</h3>
<div class="out">$ curl -s -o /dev/null -w 'chưa đăng nhập      ⇒ HTTP %{http_code}\\n' localhost:20203/link/course-5/lesson-9
chưa đăng nhập      ⇒ HTTP 401
$ curl -s -o /dev/null -w 'u7 chưa mua         ⇒ HTTP %{http_code}\\n' -b user=u7 localhost:20203/link/course-5/lesson-9
u7 chưa mua         ⇒ HTTP 403
$ u=$(curl -s -b user=u42 localhost:20203/link/course-5/lesson-9 | node -pe 'JSON.parse(require("fs").readFileSync(0)).url'); curl -s -o /dev/null -w 'u42 đã mua ⇒ tải từ bucket: HTTP %{http_code} · %{size_download} byte\\n' "$u"
u42 đã mua ⇒ tải từ bucket: HTTP 200 · 5242881 byte
$ echo "byte đi qua máy chủ (cách signed URL): $(curl -s localhost:20203/byte)"
byte đi qua máy chủ (cách signed URL): 438
$ curl -s -o /dev/null -w 'u42 cách PROXY ⇒ HTTP %{http_code} · %{size_download} byte\\n' -b user=u42 localhost:20203/proxy/course-5/lesson-9
u42 cách PROXY ⇒ HTTP 200 · 5242881 byte
$ echo "byte đi qua máy chủ (sau một lượt proxy): $(curl -s localhost:20203/byte)"
byte đi qua máy chủ (sau một lượt proxy): 5243319</div>
<p>438 byte đi qua máy chủ khi dùng signed URL; khi proxy, máy chủ tự gửi 5.243.319 byte. Bản thật trong kho là <code>getSignedFileUrl()</code> (<code>src/services/hub.service.ts:623</code>): phép kiểm quyền chính là câu truy vấn (<code>where: { id, userId }</code>), và tệp không phải của bạn trả 404 chứ không 403 — trả 403 là xác nhận mã tệp có thật.</p>
<h3>🔬 Đo thật: filename ⇒ tải về, và một phát hiện</h3>
<div class="out">$ node tai.mjs
filename=không                           ⇒ 200 (không có Content-Disposition ⇒ trình duyệt MỞ luôn)
filename="lesson-3.pdf"                  ⇒ 200 attachment; filename="lesson-3.pdf"
filename="Đề thi cuối kỳ (bản 2).pdf"    ⇒ 200 attachment; filename="___thi_cu_i_k___b_n_2_.pdf"</div>
<p>Phát hiện (bài này không sửa): <code>src/config/r2.ts:331</code> thay mọi ký tự ngoài ASCII, nên tên tệp tiếng Việt mất hết chữ có dấu. RFC 6266 cho phép <code>filename*=UTF-8''&lt;mã-hoá-phần-trăm&gt;</code> kèm một tên ASCII dự phòng.</p>
<h3>🔬 Đo thật: URL ký mà trình duyệt cache được</h3>
<p><code>getSignedReadUrl()</code> (<code>src/config/r2.ts:350</code>) chép nguyên văn: <code>signingDate</code> làm tròn xuống mốc 30 phút, sống 90 phút.</p>
<div class="out">$ node cuaso.mjs
gọi lúc 10:05 ⇒ ký lúc 10:00 · hết hạn 11:30 · chữ ký 47f1f5628983…
gọi lúc 10:20 ⇒ ký lúc 10:00 · hết hạn 11:30 · chữ ký 47f1f5628983…
gọi lúc 10:29 ⇒ ký lúc 10:00 · hết hạn 11:30 · chữ ký 47f1f5628983…
gọi lúc 10:31 ⇒ ký lúc 10:30 · hết hạn 12:00 · chữ ký 78bb92910b35…</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Bạn đã gặp:</strong> tệp Google Drive "ai có đường dẫn cũng xem được"; email hoá đơn điện tử ghi đường dẫn tải "có hiệu lực 7 ngày".</li>
<li><strong>Nếu signed URL bị chuyển vào một nhóm chat thì sao?</strong> Đo thật — signed URL là đường dẫn "ai cầm cũng dùng được", không gắn với người nào:</li>
</ul>
<div class="out">$ bash lo.sh
người mua (cookie u42)        : 200
người lạ trong nhóm chat      : 200
URL lộ ra gì? X-Amz-Credential = &lt;access-key-id&gt;/20261114/us-east-1/s3/aws4_request
người lạ, 9 giây sau          : 403 &lt;Message&gt;Request has expired&lt;/Message&gt;
$ u=$(node ky.mjs paid/course-5/lesson-3.pdf 300); curl -s -r 0-99 -o /dev/null -w 'Range 0-99 trên signed URL ⇒ HTTP %{http_code} · %{size_download} byte (video tua được)\\n' "$u"
Range 0-99 trên signed URL ⇒ HTTP 206 · 100 byte (video tua được)</div>
<p>Cách phòng: hạn ngắn; ký mỗi lần cần (không lưu URL đã ký vào database); không ghi nguyên signed URL vào log; URL chỉ lộ access key ID, không bao giờ lộ secret.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Trên MinIO: <code>getSignedUrl(s3, new GetObjectCommand(…), { expiresIn: 5 })</code>, gọi, chờ 6 s, gọi lại; sửa một ký tự của URL còn hạn; viết một máy chủ <code>node:http</code> nhỏ trả 401 / 403 / <code>{ url }</code> rồi so số byte nó gửi với bản proxy.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-1-4-bam-mac-chu-ky" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 1.4 — Băm, MAC, chữ ký: ba công cụ, một sự nhầm lẫn</span><span class="lc-sub">X-Amz-Signature thật ra là gì</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-9-1-phan-quyen-la-gi" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 9.1 — Chỗ xác thực dừng lại và những con lỗi đắt tiền bắt đầu</span><span class="lc-sub">Phép kiểm quyền, đi sâu</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Signed URL</span><span class="v">URL mang chữ ký có hạn, cấp quyền mà không public hoá object.</span></div>
  <div class="kv"><span class="k">getSignedUrl</span><span class="v">Lời gọi <code>s3-request-presigner</code> sinh ra nó.</span></div>
  <div class="kv"><span class="k">expiresIn</span><span class="v">Tuổi thọ theo giây — ngắn cho download, dài hơn cho streaming.</span></div>
  <div class="kv"><span class="k">Entitlement check</span><span class="v">Server xác minh user được phép truy cập object trước khi ký.</span></div>
  <div class="kv"><span class="k">Direct fetch</span><span class="v">Client tải thẳng từ R2, nên byte không đi qua server bạn.</span></div>
  <div class="kv"><span class="k">Presigned PUT</span><span class="v">Biến thể upload — topic riêng ở Chương 4.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Signed URL là private access short-lived (download 5–10 phút, streaming ~1h) mà không cần object public.</li><li>Pattern của kho: route có auth kiểm entitlement, rồi trả signed URL client fetch thẳng từ R2 — tiết kiệm server bandwidth.</li><li>Signed URL cho upload (presigned PUT) là topic riêng, cover ở Chương 4.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@aws-sdk/s3-request-presigner</span><span class="lc-sub">github.com/aws/aws-sdk-js-v3/tree/main/packages/s3-request-presigner — API.</span></span></div>
</div>
`,
    },

    {
      title: '3.4 — Chapter 3 quiz|||3.4 — Kiểm tra Chương 3',
      slug: 'os-3-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu, sáu phút. Về URL types, Cache-Control, signed URLs.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 3 · Quiz</span><h2>What Chapter 3 established</h2><p class="lead">Four questions on URL patterns.</p></div><div class="ml-vi"><span class="eyebrow">Chương 3 · Kiểm tra</span><h2>Chương 3 đã dựng được gì</h2><p class="lead">Bốn câu về URL patterns.</p></div>`,
      quiz: {
        timeLimitSeconds: 360,
        questions: [
          {
            question: 'Serving avatar to browser via <code>https://xxx.r2.cloudflarestorage.com/...</code>. What happens?|||Serve avatar cho browser qua <code>https://xxx.r2.cloudflarestorage.com/...</code>. Chuyện gì?',
            options: [
              'Requires a signature — the browser gets 403 AccessDenied (no SigV4 signature). Use the custom-domain URL that goes through the CDN (public, cached)|||Cần chữ ký — trình duyệt nhận 403 AccessDenied (không có chữ ký SigV4). Dùng URL tên miền riêng qua CDN (public, cached)',
              'Works fine|||Chạy ok',
              'Faster than CDN|||Nhanh hơn CDN',
              'Free egress|||Free egress',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Avatar cache 1 year immutable but user changes avatar. Problem?|||Avatar cache 1 year immutable nhưng user đổi avatar. Vấn đề?',
            options: [
              'Old cached avatar shown for up to 1 year. Fix: use versioned URL (avatar-v42.jpg) — cache aggressive + change URL when content changes|||Avatar cũ cached tới 1 năm. Fix: dùng versioned URL (avatar-v42.jpg) — cache aggressive + đổi URL khi content đổi',
              'Nothing — cache invalidates on new upload|||Không gì — cache invalidate khi upload mới',
              'Cloudflare auto-purges|||Cloudflare tự purge',
              'Browser detects change|||Browser detect change',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Standard TTL for signed URL for immediate download?|||TTL chuẩn cho signed URL cho immediate download?',
            options: [
              '5-10 minutes — enough for client to start download, not enough to share URL. For video streaming use 1 hour, share link max 7 days (R2 limit)|||5-10 phút — đủ cho client start download, không đủ để share URL. Cho video streaming dùng 1 giờ, share link max 7 ngày (R2 limit)',
              '24 hours default|||24 giờ default',
              '1 second|||1 giây',
              'No expiry|||Không expiry',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Storing the R2 endpoint URL in a DB column. Risk?|||Lưu URL endpoint R2 trong một cột DB. Nguy cơ?',
            options: [
              'When you change custom domain or R2 endpoint, all existing URLs break. Fix: store only the KEY in DB, build URL at runtime|||Khi bạn đổi custom domain hoặc R2 endpoint, mọi URL cũ vỡ. Fix: chỉ lưu KEY trong DB, build URL runtime',
              'No risk|||Không nguy cơ',
              'DB size grows|||DB size grow',
              'Slow queries|||Query chậm',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
