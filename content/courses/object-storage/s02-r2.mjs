const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 2 — Cloudflare R2 specifics|||Chương 2 — R2 specifics',
  slug: 'os-ch2-r2',
  description: 'Bốn bài về R2 khác S3 chỗ nào — zero egress, ~90% S3 API compat, single global bucket, custom domain qua CDN.',
  sortOrder: 3,
  lessons: [

    {
      title: '2.1 — Zero egress: the R2 pricing pitch|||2.1 — Zero egress: giá của R2',
      slug: 'os-2-1-egress',
      type: 'VIDEO',
      description: 'S3 charge $0.09/GB egress. R2 charge $0 egress. Cho media-heavy app (video, images), khác biệt = 10-100× cheaper. Đây là lý do chính chọn R2.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Zero egress: the R2 pricing pitch</h2>
<p class="lead">R2&#39;s single most important difference from S3 is pricing. Storage similar (R2 $0.015/GB/mo vs S3 $0.023/GB/mo — small delta). Egress is huge: R2 $0, S3 $0.09/GB. For media apps, that swings the total 10-100×.</p>

<h3>Cost comparison — 1 TB storage, 10 TB/month egress</h3>
<div class="out">S3 (standard):
  Storage:      1000 GB * $0.023 =  $23.00/mo
  Egress:      10000 GB * $0.09  = $900.00/mo
  Requests:    ~$5 (negligible)
  TOTAL:                          $928.00/mo

R2:
  Storage:      1000 GB * $0.015 =  $15.00/mo
  Egress:      10000 GB * $0     =   $0.00/mo
  Class A ops (PUT): ~$5 (negligible)
  TOTAL:                           $20.00/mo

Difference: 46x cheaper for R2 in this scenario
</div>

<h3>Why zero egress</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cloudflare owns edge network</span><span class="lz-d">Egress bandwidth from Cloudflare-to-user is free (Cloudflare peers with ISPs directly). Passing that through to R2 users.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Competing with S3</span><span class="lz-d">R2 released 2021 as direct S3 alternative. Zero egress is the marketing hook.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Charge cho request instead</span><span class="lz-d">Class A operations (PUT, POST, LIST): $4.50/million. Class B (GET, HEAD): $0.36/million. So a busy app pays through requests, not egress.</span></div>
</div>

<h3>This repo — estimating the cost</h3>
<pre><code class="language-text">Uoc luong hom nay (~1000 users, moderate media):
  Storage:  ~50 GB = $0.75/mo
  Egress:  ~500 GB/mo = $0 (R2)
  Requests: PUT ~1000/day = 30k/mo = $0.14
           GET ~50k/day serving via CDN = 1.5M/mo = $0.54
  TOTAL: ~$1.50/mo

Neu chuyen sang S3:
  Storage:  $1.15
  Egress:   $45
  TOTAL: ~$46/mo (30x)
</code></pre>

<h3>When R2 might not be right</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Ecosystem lock-in</span><span class="lz-lnote">You run AWS S3 + Lambda + CloudFront as a tightly integrated stack. Switching costs are high, and the monthly saving often does NOT repay the migration plus retraining the team</span></div>
<div class="lz-layer"><span class="lz-lname">Compliance (GDPR data residency)</span><span class="lz-lnote">R2 stores in Cloudflare's &quot;auto&quot; region. Need EU customer data to stay EU-only? R2 has a paid Jurisdictional Restrictions option — or pick S3 eu-west-1</span></div>
<div class="lz-layer"><span class="lz-lname">Advanced S3 features</span><span class="lz-lnote">R2 covers ~90% of the S3 API. Missing pieces include S3 Batch Operations, S3 Select and Object Lambda. If you depend on those, you cannot migrate yet</span></div>
<div class="lz-layer"><span class="lz-lname">Multi-region auto-replication</span><span class="lz-lnote">S3 has Cross-Region Replication built in. R2 is single-global (data in one region, served from the edge). Strict DR requirements may need a layer on top</span></div>
</div>

<h3>Class A vs Class B operations</h3>
<div class="out">Class A (expensive): $4.50/million
  PutObject, PostObject, CopyObject, ListObjectsV2, DeleteObjectS
  = MUTATIONS + LIST

Class B (cheap): $0.36/million  
  GetObject, HeadObject
  = READS

For media serving app: 90% Class B via CDN cache HIT anyway = $0
</div>

<div class="pitfall">
<p><strong>Trap — assessing cost by assuming &quot;storage is cheap enough&quot;.</strong> The real cost is usually egress (on S3) or requests (on R2, if you are request-heavy). Read an actual invoice after 30 days before concluding anything. Online cost calculators are estimates, not measurements.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> R2's zero egress + $0.015/GB storage against S3's $0.09/GB egress + $0.023/GB storage — for a media app doing 10 TB/month of egress that is roughly $900 versus $20 (46× cheaper), and it is the main reason to choose R2; but ecosystem lock-in, compliance requirements, and S3's advanced features remain three valid reasons to stay.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Pick a realistic monthly profile for your app: storage GB held, and egress GB served. Write both numbers down.</li>
<li>Compute the S3 bill: storage &times; $0.023 + egress &times; $0.09. Compute the R2 bill: storage &times; $0.015 + egress &times; $0 (egress free).</li>
<li>Divide to get the ratio. Re-run it with egress at 1 TB and at 50 TB and watch the ratio move — egress is what drives it.</li>
<li>List, for your situation, which of the three stay-on-S3 reasons apply (ecosystem lock-in, compliance/region, an S3 feature R2 lacks).</li>
</ol>
<p><strong>Done when:</strong> you have an S3-vs-R2 ratio for your own numbers and can say at what egress level R2 stops being dramatically cheaper.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Egress</span><span class="v">Bytes served out of the bucket — $0 on R2, $0.09/GB on S3.</span></div>
  <div class="kv"><span class="k">Zero egress</span><span class="v">R2's model: you pay storage + operations, never for serving.</span></div>
  <div class="kv"><span class="k">Storage rate</span><span class="v">R2 $0.015/GB-month vs S3 $0.023/GB-month.</span></div>
  <div class="kv"><span class="k">Ecosystem lock-in</span><span class="v">Tooling/services that assume S3 — a reason to stay despite cost.</span></div>
  <div class="kv"><span class="k">Compliance / region</span><span class="v">Data-residency rules R2's region model may not satisfy.</span></div>
  <div class="kv"><span class="k">Break-even</span><span class="v">The egress level where R2's advantage stops being dramatic.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>R2 charges $0 egress + $0.015/GB storage; S3 charges $0.09/GB egress + $0.023/GB storage.</li><li>For a 10 TB/month-egress media app that is ~$900 vs ~$20 — roughly 46× cheaper, driven by egress.</li><li>Three valid reasons stay on S3: ecosystem lock-in, compliance/region, and advanced S3 features R2 lacks.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare R2 pricing</span><span class="lc-sub">developers.cloudflare.com/r2/pricing — chính thức, cập nhật.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 pricing</span><span class="lc-sub">aws.amazon.com/s3/pricing — so sánh trực tiếp.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Zero egress: giá của R2</h2>
<p class="lead">Khác biệt quan trọng nhất giữa R2 và S3 là giá. Storage tương đương (R2 $0.015/GB/mo vs S3 $0.023/GB/mo — delta nhỏ). Egress mới lớn: R2 $0, S3 $0.09/GB. Với media app, thay đổi tổng 10-100×.</p>

<h3>So sánh cost — 1 TB storage, 10 TB/month egress</h3>
<div class="out">S3 (standard):
  Storage:      1000 GB * $0.023 =  $23.00/mo
  Egress:      10000 GB * $0.09  = $900.00/mo
  Requests:    ~$5 (negligible)
  TOTAL:                          $928.00/mo

R2:
  Storage:      1000 GB * $0.015 =  $15.00/mo
  Egress:      10000 GB * $0     =   $0.00/mo
  Class A ops (PUT): ~$5 (negligible)
  TOTAL:                           $20.00/mo

Difference: 46x cheaper for R2 in this scenario
</div>

<h3>Vì sao zero egress</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cloudflare own edge network</span><span class="lz-d">Egress bandwidth từ Cloudflare tới user là free (Cloudflare peer trực tiếp với ISP). Pass through cho R2 user.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Compete với S3</span><span class="lz-d">R2 release 2021 như direct S3 alternative. Zero egress là marketing hook.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Charge cho request thay</span><span class="lz-d">Class A operation (PUT, POST, LIST): $4.50/million. Class B (GET, HEAD): $0.36/million. App busy pay qua request, không egress.</span></div>
</div>

<h3>Kho này — ước lượng cost</h3>
<pre><code class="language-text">Uoc luong hom nay (~1000 users, moderate media):
  Storage:  ~50 GB = $0.75/mo
  Egress:  ~500 GB/mo = $0 (R2)
  Requests: PUT ~1000/day = 30k/mo = $0.14
           GET ~50k/day serving via CDN = 1.5M/mo = $0.54
  TOTAL: ~$1.50/mo

Neu chuyen sang S3:
  Storage:  $1.15
  Egress:   $45
  TOTAL: ~$46/mo (30x)
</code></pre>

<h3>Khi R2 có thể không phù hợp</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Ecosystem lock-in</span><span class="lz-lnote">Bạn dùng AWS S3 + Lambda + CloudFront tight integration. Switching cost cao. Đôi khi $/month tiết kiệm KHÔNG bù được migration cost + team retraining</span></div>
<div class="lz-layer"><span class="lz-lname">Compliance (GDPR data residency)</span><span class="lz-lnote">R2 lưu ở Cloudflare region &quot;auto&quot;. EU customer data cần EU-only? R2 có Jurisdictional Restrictions option (paid) — hoặc chọn S3 EU-West-1</span></div>
<div class="lz-layer"><span class="lz-lname">Advanced S3 features</span><span class="lz-lnote">R2 có ~90% S3 API. Vài thứ thiếu: S3 Batch Operations, S3 Select, Object Lambda. Nếu bạn dùng chúng, chưa migrate được</span></div>
<div class="lz-layer"><span class="lz-lname">Multi-region auto-replication</span><span class="lz-lnote">S3 có Cross-Region Replication built-in. R2 chỉ single global (data lưu 1 region, serve qua edge). Cho DR strict, có thể cần thêm layer</span></div>
</div>

<h3>Class A vs Class B operation</h3>
<div class="out">Class A (expensive): $4.50/million
  PutObject, PostObject, CopyObject, ListObjectsV2, DeleteObjectS
  = MUTATIONS + LIST

Class B (cheap): $0.36/million  
  GetObject, HeadObject
  = READS

For media serving app: 90% Class B via CDN cache HIT anyway = $0
</div>

<div class="pitfall">
<p><strong>Bẫy — kiểm cost bằng cách nghĩ &quot;storage cheap enough&quot;.</strong> Cost thật thường là egress (S3) hoặc request (R2 nếu request-heavy). Kiểm hoá đơn thật sau 30 ngày trước khi conclude. Cost calculator online là ước lượng, KHÔNG chính xác.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> R2 free egress + $0.015/GB storage vs S3 $0.09/GB egress + $0.023/GB storage — cho media app 10 TB/mo egress khác biệt là ~$900 vs ~$20 (46× cheaper), đây là lý do chính chọn R2; nhưng ecosystem lock-in, compliance, và advanced features S3 vẫn là ba lý do valid stick với S3.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một profile tháng thực tế cho app: storage GB giữ, và egress GB serve. Ghi cả hai số.</li>
<li>Tính bill S3: storage &times; $0.023 + egress &times; $0.09. Tính bill R2: storage &times; $0.015 + egress &times; $0 (egress miễn phí).</li>
<li>Chia để ra tỉ lệ. Chạy lại với egress 1 TB và 50 TB và xem tỉ lệ thay đổi — egress mới là thứ quyết định.</li>
<li>Liệt kê, cho tình huống của bạn, lý do nào trong ba lý do ở-lại-S3 áp dụng (ecosystem lock-in, compliance/region, một feature S3 mà R2 thiếu).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có tỉ lệ S3-vs-R2 cho số của chính mình và nói được ở mức egress nào thì R2 hết rẻ vượt trội.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Egress</span><span class="v">Byte serve ra khỏi bucket — $0 trên R2, $0.09/GB trên S3.</span></div>
  <div class="kv"><span class="k">Zero egress</span><span class="v">Mô hình R2: trả storage + operation, không bao giờ trả cho serving.</span></div>
  <div class="kv"><span class="k">Storage rate</span><span class="v">R2 $0.015/GB-tháng vs S3 $0.023/GB-tháng.</span></div>
  <div class="kv"><span class="k">Ecosystem lock-in</span><span class="v">Tooling/service giả định S3 — lý do ở lại dù tốn hơn.</span></div>
  <div class="kv"><span class="k">Compliance / region</span><span class="v">Luật data-residency mà mô hình region của R2 có thể không thoả.</span></div>
  <div class="kv"><span class="k">Break-even</span><span class="v">Mức egress nơi lợi thế R2 hết còn vượt trội.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>R2 tính $0 egress + $0.015/GB storage; S3 tính $0.09/GB egress + $0.023/GB storage.</li><li>Cho media app 10 TB/tháng egress đó là ~$900 vs ~$20 — khoảng 46× rẻ hơn, do egress quyết định.</li><li>Ba lý do valid ở lại S3: ecosystem lock-in, compliance/region, và feature S3 nâng cao mà R2 thiếu.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare R2 pricing</span><span class="lc-sub">developers.cloudflare.com/r2/pricing — chính thức, cập nhật.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 pricing</span><span class="lc-sub">aws.amazon.com/s3/pricing — so sánh trực tiếp.</span></span></div>
</div>
`,
    },

    {
      title: '2.2 — R2 quirks: region auto, path style, headers|||2.2 — R2 quirks: region auto, path style, header',
      slug: 'os-2-2-quirks',
      type: 'VIDEO',
      description: 'R2 ignore region (single global), preferred virtual-hosted style, missing một số S3 headers. Kho này handle trong r2.ts.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>R2 quirks: region auto, path style, headers</h2>
<p class="lead">R2 is S3-compatible but not identical. Three quirks matter for anyone using AWS SDK with R2.</p>

<h3>Quirk 1: region &quot;auto&quot;</h3>
<pre><code class="language-ts">// SAI — R2 khong care region
new S3Client({ region: 'us-east-1' });

// DUNG — R2 ignore, SDK require string
new S3Client({ region: 'auto' });
</code></pre>

<p>R2 stores data globally from a single location. You do not choose a region. The SDK requires the field <code>region</code>, so the convention is <code>&#39;auto&#39;</code>.</p>

<h3>Quirk 2: virtual-hosted style preferred</h3>
<pre><code class="language-ts">// Path style (S3 legacy default cho custom endpoint):
//   https://endpoint.com/bucket-name/key
// Virtual-hosted (S3 new default):
//   https://bucket-name.endpoint.com/key

// R2 support both, but virtual-hosted needed for custom domains
new S3Client({
  forcePathStyle: false,   // = virtual-hosted (R2 preferred)
});
</code></pre>

<div class="callout ok">
<p><strong>A custom domain (media.cuongthai.com) requires virtual-hosted style.</strong> DNS points the custom domain at the R2 bucket. Path style cannot map to a custom domain.</p>
</div>

<h3>Quirk 3: some S3 headers are not supported</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">x-amz-storage-class</span><span class="lz-lnote">S3 has STANDARD, STANDARD_IA, GLACIER and more. R2 has only STANDARD. Setting anything else does not error — it is ignored</span></div>
<div class="lz-layer"><span class="lz-lname">Server-side encryption</span><span class="lz-lnote">R2 always encrypts at rest automatically (AES-256). There is no SSE-KMS or SSE-C. Setting SSECustomer* does not error — it is ignored</span></div>
<div class="lz-layer"><span class="lz-lname">Request payer</span><span class="lz-lnote">S3 offers &quot;requester pays&quot; billing. On R2 the owner always pays</span></div>
<div class="lz-layer"><span class="lz-lname">Object lock</span><span class="lz-lnote">S3 has compliance-mode retention. R2 does not support object lock yet (beta)</span></div>
</div>

<h3>Custom domain setup</h3>
<pre><code class="language-text">1. R2 bucket -&gt; Settings -&gt; Custom Domains -&gt; Connect Domain
2. Nhap media.cuongthai.com
3. Cloudflare tu tao CNAME
4. Verify sau vai phut

Result: 
  https://media.cuongthai.com/x.jpg 
  -&gt; served qua Cloudflare CDN
  -&gt; egress zero (R2 pricing)
  -&gt; global cache (auto)
</code></pre>

<div class="callout ok">
<p><strong>Cloudflare custom domain = built-in CDN.</strong> No CloudFront or extra CDN service needed. Cache invalidation goes through the Cloudflare purge API. Egress stays at zero.</p>
</div>

<h3>ETag differences</h3>
<pre><code class="language-text">S3 single upload:   ETag = MD5 of content (hex, no quotes needed)
R2 single upload:   ETag = MD5 of content (SAME)
S3 multipart:       ETag = "&lt;hash&gt;-N" where N = part count
R2 multipart:       ETag = "&lt;hash&gt;-N" (SAME format)

But: for large single upload with checksums:
  S3: may return SHA256 checksum in metadata
  R2: doesn't return SHA256 metadata (yet)
</code></pre>

<div class="pitfall">
<p><strong>Trap — assuming every S3 SDK operation works identically on R2.</strong> ~90% match. Advanced features (Object Lambda, S3 Select, Batch Operations, Object Lock) are not supported yet. Check the R2 API compatibility page before relying on one.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> R2 quirks: region <code>&#39;auto&#39;</code> (required by the SDK but ignored by R2), <code>forcePathStyle: false</code> (virtual-hosted, for custom domains), and several S3 headers are silently ignored (storage class, SSE-KMS, requester pays, object lock) — check the R2 compatibility page before migrating S3-specific code.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Create an R2 client once with <code>region: &#39;auto&#39;</code>, then deliberately set <code>region: &#39;us-east-1&#39;</code> and confirm R2 behaves identically — the region is ignored.</li>
<li>PutObject with <code>StorageClass: &#39;GLACIER&#39;</code> and a <code>requester-pays</code> flag, then HeadObject the result: the quirky headers were accepted and silently dropped.</li>
<li>Open the R2 compatibility page and list three S3 features R2 does not support (e.g. SSE-KMS, object lock, requester pays).</li>
<li>Grep your own upload code for any of those unsupported headers so you know what will silently no-op after a migration.</li>
</ol>
<p><strong>Done when:</strong> you have confirmed region is ignored, seen a header silently dropped, and listed three unsupported S3 features from the compat page.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">region: 'auto'</span><span class="v">SDK-required string; R2 has no regions and ignores the value.</span></div>
  <div class="kv"><span class="k">forcePathStyle: false</span><span class="v">Virtual-hosted URLs (<code>bucket.host/key</code>) — needed for custom domains.</span></div>
  <div class="kv"><span class="k">Silently ignored header</span><span class="v">Accepted by R2's API but with no effect (storage class, SSE-KMS…).</span></div>
  <div class="kv"><span class="k">Compatibility page</span><span class="v">Cloudflare's list of which S3 features R2 does and does not implement.</span></div>
  <div class="kv"><span class="k">SSE-KMS</span><span class="v">S3 key-managed encryption — not supported on R2.</span></div>
  <div class="kv"><span class="k">Requester pays</span><span class="v">S3 billing mode shifting egress to the caller — no-op on R2.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>R2 needs <code>region: &#39;auto&#39;</code> (ignored) and <code>forcePathStyle: false</code> (virtual-hosted for custom domains).</li><li>Several S3 headers are accepted but silently ignored: storage class, SSE-KMS, requester pays, object lock.</li><li>Check the R2 compatibility page before migrating S3-specific code — silent no-ops are the trap.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — S3 API compatibility</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/api — chi tiết cái R2 support, cái không.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>R2 quirks: region auto, path style, header</h2>
<p class="lead">R2 là S3-compatible nhưng không identical. Ba quirk quan trọng cho ai dùng AWS SDK với R2.</p>

<h3>Quirk 1: region &quot;auto&quot;</h3>
<pre><code class="language-ts">// SAI — R2 khong care region
new S3Client({ region: 'us-east-1' });

// DUNG — R2 ignore, SDK require string
new S3Client({ region: 'auto' });
</code></pre>

<p>R2 lưu data toàn cầu với single location. Bạn không chọn region. SDK bắt buộc field <code>region</code>, nên convention là <code>&#39;auto&#39;</code>.</p>

<h3>Quirk 2: virtual-hosted style preferred</h3>
<pre><code class="language-ts">// Path style (S3 legacy default cho custom endpoint):
//   https://endpoint.com/bucket-name/key
// Virtual-hosted (S3 new default):
//   https://bucket-name.endpoint.com/key

// R2 support both, but virtual-hosted needed for custom domains
new S3Client({
  forcePathStyle: false,   // = virtual-hosted (R2 preferred)
});
</code></pre>

<div class="callout ok">
<p><strong>Custom domain (media.cuongthai.com) yêu cầu virtual-hosted style.</strong> DNS point custom domain → R2 bucket. Path style không map được custom domain.</p>
</div>

<h3>Quirk 3: một số S3 header không support</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">x-amz-storage-class</span><span class="lz-lnote">S3 có STANDARD, STANDARD_IA, GLACIER... R2 chỉ có STANDARD. Set khác không error nhưng ignore</span></div>
<div class="lz-layer"><span class="lz-lname">Server-side encryption</span><span class="lz-lnote">R2 luôn encrypt at rest tự động (AES-256). Không có SSE-KMS, SSE-C. Set SSECustomer* không error nhưng ignore</span></div>
<div class="lz-layer"><span class="lz-lname">Request payer</span><span class="lz-lnote">S3 có &quot;requester pays&quot; billing. R2 luôn owner pays</span></div>
<div class="lz-layer"><span class="lz-lname">Object lock</span><span class="lz-lnote">S3 có compliance mode retention. R2 chưa support object lock (beta)</span></div>
</div>

<h3>Setup custom domain</h3>
<pre><code class="language-text">1. R2 bucket -&gt; Settings -&gt; Custom Domains -&gt; Connect Domain
2. Nhap media.cuongthai.com
3. Cloudflare tu tao CNAME
4. Verify sau vai phut

Result: 
  https://media.cuongthai.com/x.jpg 
  -&gt; served qua Cloudflare CDN
  -&gt; egress zero (R2 pricing)
  -&gt; global cache (auto)
</code></pre>

<div class="callout ok">
<p><strong>Cloudflare custom domain = built-in CDN.</strong> Không cần Cloudfront hoặc thêm CDN service. Cache invalidation qua Cloudflare purge API. Cost egress vẫn zero.</p>
</div>

<h3>Khác biệt ETag</h3>
<pre><code class="language-text">S3 single upload:   ETag = MD5 of content (hex, no quotes needed)
R2 single upload:   ETag = MD5 of content (SAME)
S3 multipart:       ETag = "&lt;hash&gt;-N" where N = part count
R2 multipart:       ETag = "&lt;hash&gt;-N" (SAME format)

But: for large single upload with checksums:
  S3: may return SHA256 checksum in metadata
  R2: doesn't return SHA256 metadata (yet)
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — assume mọi S3 SDK operation work identically on R2.</strong> ~90% match. Advanced feature (Object Lambda, S3 Select, Batch Operations, Object Lock) chưa support. Check R2 API compatibility page trước dùng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> R2 quirks: region <code>&#39;auto&#39;</code> (SDK required nhưng R2 ignore), <code>forcePathStyle: false</code> (virtual-hosted cho custom domain), một số S3 headers ignore silent (storage class, SSE-KMS, requester pays, object lock) — check R2 compat page trước migrate S3-specific code.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo client R2 một lần với <code>region: &#39;auto&#39;</code>, rồi cố ý set <code>region: &#39;us-east-1&#39;</code> và xác nhận R2 hành xử y hệt — region bị bỏ qua.</li>
<li>PutObject với <code>StorageClass: &#39;GLACIER&#39;</code> và cờ <code>requester-pays</code>, rồi HeadObject kết quả: các header quirky được nhận và âm thầm bỏ.</li>
<li>Mở trang R2 compatibility và liệt kê ba feature S3 mà R2 không hỗ trợ (vd: SSE-KMS, object lock, requester pays).</li>
<li>Grep code upload của bạn tìm bất kỳ header không hỗ trợ nào để biết cái gì sẽ no-op âm thầm sau migration.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã xác nhận region bị bỏ qua, thấy một header bị bỏ âm thầm, và liệt kê ba feature S3 không hỗ trợ từ trang compat.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">region: 'auto'</span><span class="v">Chuỗi SDK yêu cầu; R2 không có region và bỏ qua giá trị.</span></div>
  <div class="kv"><span class="k">forcePathStyle: false</span><span class="v">URL virtual-hosted (<code>bucket.host/key</code>) — cần cho custom domain.</span></div>
  <div class="kv"><span class="k">Header bị bỏ âm thầm</span><span class="v">R2 nhận nhưng không có tác dụng (storage class, SSE-KMS…).</span></div>
  <div class="kv"><span class="k">Compatibility page</span><span class="v">Danh sách Cloudflare về feature S3 nào R2 có và không có.</span></div>
  <div class="kv"><span class="k">SSE-KMS</span><span class="v">Mã hoá quản-khoá của S3 — R2 không hỗ trợ.</span></div>
  <div class="kv"><span class="k">Requester pays</span><span class="v">Chế độ billing S3 đẩy egress sang caller — no-op trên R2.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>R2 cần <code>region: &#39;auto&#39;</code> (bị bỏ qua) và <code>forcePathStyle: false</code> (virtual-hosted cho custom domain).</li><li>Một số header S3 được nhận nhưng âm thầm bỏ: storage class, SSE-KMS, requester pays, object lock.</li><li>Check trang R2 compatibility trước khi migrate code S3-specific — no-op âm thầm là cái bẫy.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — S3 API compatibility</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/api — chi tiết cái R2 support, cái không.</span></span></div>
</div>
`,
    },

    {
      title: '2.3 — Access keys and rotation|||2.3 — Access key và rotation',
      slug: 'os-2-3-keys',
      type: 'VIDEO',
      description: 'R2 access keys long-lived (không rotate tự động như IAM temporary credentials). Tạo per-workload, rotate manual định kỳ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Access keys and rotation</h2>
<p class="lead">R2 authenticates with API tokens (access key + secret). Long-lived by design — not rotating STS credentials like AWS IAM Role. Rotation is manual and important.</p>

<h3>Creating a token</h3>
<pre><code class="language-text">Cloudflare Dashboard -&gt; R2 -&gt; Manage R2 API Tokens -&gt; Create Token

Options:
  - Permissions: Object Read, Object Read + Write, Admin Read + Write
  - Buckets: Apply to all, hoac chi 1 bucket cu the
  - TTL: never (default) hoac timestamp
  - Client IP filters: allow list IPs (opt)
</code></pre>

<h3>Per-workload token separation</h3>
<pre><code class="language-text">Kho nay 3 tokens:
  1. backend-write     — dung Read+Write, chi cuonghoangdev-media bucket
  2. worker-analytics  — dung Read-only, chi analytics-logs bucket  
  3. admin-migration   — Admin R+W, TTL 24h, dung khi migrate

MOI workload -&gt; MOT token. Neu 1 leak, xoa MOT token, khong break het.
</code></pre>

<div class="callout ok">
<p><strong>One token per workload keeps the blast radius small.</strong> A backend leak means: revoke the backend token, issue a new one, deploy. The worker and admin tokens are untouched.</p>
</div>

<h3>Rotation schedule</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Quarterly (recommended)</span><span class="lz-d">Rotate every token every three months. Overlap them by 24 hours so the old token still works while the new one is deploying.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Post-incident</span><span class="lz-d">Any time you suspect a leak (a Git commit, an exposed log, someone leaving). Do not wait for the quarterly cycle.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Automated</span><span class="lz-d">Ideally a rotation script plus a secret manager (Vault, AWS Secrets Manager). This repo does not have one yet — rotation is manual and quarterly.</span></div>
</div>

<h3>Rotation procedure</h3>
<pre><code class="language-text">1. Cloudflare Dashboard -&gt; Create NEW token (same permissions)
2. Copy vao /opt/cuonghoangdev/.env moi (khong overwrite cu):
   R2_ACCESS_KEY_ID_NEW=xxx
   R2_SECRET_ACCESS_KEY_NEW=yyy
3. Deploy backend switching to NEW keys
4. Verify: kiem upload/download hoat dong
5. Wait 1 hour (in-flight requests complete)
6. Revoke OLD token o Cloudflare Dashboard
7. Update env: rename NEW -&gt; primary, remove OLD entries
</code></pre>

<h3>Storing credentials — DON'T</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Git commit</span><span class="lz-lnote">Even in a private repo, a credential in Git history cannot really be removed (rewriting history is painful). Always .gitignore your .env</span></div>
<div class="lz-layer"><span class="lz-lname">Frontend bundle</span><span class="lz-lnote"><code>NEXT_PUBLIC_R2_KEY</code> ships the key inside the browser bundle. Anyone who views source can read it. NEVER do this</span></div>
<div class="lz-layer"><span class="lz-lname">Docker image (COPY .env)</span><span class="lz-lnote">The image layer then contains .env, and layers can be inspected. Pass environment variables at runtime instead</span></div>
<div class="lz-layer"><span class="lz-lname">Log output</span><span class="lz-lnote">Sanitize your logs so they never print process.env. Sentry, Datadog and every log aggregator retain what you send them</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — committing a .env full of placeholders and swapping in the real secrets afterwards.</strong> Git history still shows a placeholder, so reviewers assume it is fine. Tomorrow someone <code>git log -p</code> the real secret. The fix: never commit .env at all, only .env.example with dummy values.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> R2 API tokens are long-lived and do not auto-rotate the way IAM STS credentials do — issue one per workload (backend, worker, admin) to limit the blast radius, rotate them quarterly and after any incident with a 24-hour overlap, and NEVER commit them to Git, ship them in a frontend bundle, bake them into a Docker image, or log them.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Issue TWO R2 API tokens with distinct names (e.g. <code>backend-prod</code>, <code>worker-thumbs</code>) so a leak of one does not expose the other.</li>
<li>Put the keys in environment only; grep the repo for the key prefix and confirm zero hits in Git, the frontend bundle, and any <code>Dockerfile</code> <code>ENV</code>.</li>
<li>Do one rotation: create the new token, deploy it, keep the old one live for a 24-hour overlap, then revoke the old one — write the four steps down as a runbook.</li>
<li>Confirm your logger redacts secrets: log a request that carries the key and check the key does not appear in the output.</li>
</ol>
<p><strong>Done when:</strong> you have two per-workload tokens, zero keys in Git/bundle/image, and a written 4-step rotation runbook.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">R2 API token</span><span class="v">Long-lived access key; does not auto-expire like IAM STS.</span></div>
  <div class="kv"><span class="k">Per-workload token</span><span class="v">One token per app/worker/admin, so a leak has a small blast radius.</span></div>
  <div class="kv"><span class="k">Rotation</span><span class="v">Replacing a key on a schedule and after incidents.</span></div>
  <div class="kv"><span class="k">Overlap window</span><span class="v">Old and new key both valid for ~24h so no request fails mid-rotation.</span></div>
  <div class="kv"><span class="k">Blast radius</span><span class="v">How much one leaked token can reach — minimised by scoping.</span></div>
  <div class="kv"><span class="k">Secret redaction</span><span class="v">Logger masking so keys never reach log storage.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>R2 tokens are long-lived — no auto-rotation, so you own the rotation schedule.</li><li>One token per workload limits blast radius; rotate quarterly and after any incident with a 24h overlap.</li><li>Never commit a token to Git, ship it in a frontend bundle, bake it into an image, or log it.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — API tokens</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/tokens — tạo, permission, TTL.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Access key và rotation</h2>
<p class="lead">R2 auth với API token (access key + secret). Long-lived by design — không auto-rotate credential như AWS IAM Role. Rotation manual và quan trọng.</p>

<h3>Tạo token</h3>
<pre><code class="language-text">Cloudflare Dashboard -&gt; R2 -&gt; Manage R2 API Tokens -&gt; Create Token

Options:
  - Permissions: Object Read, Object Read + Write, Admin Read + Write
  - Buckets: Apply to all, hoac chi 1 bucket cu the
  - TTL: never (default) hoac timestamp
  - Client IP filters: allow list IPs (opt)
</code></pre>

<h3>Per-workload token tách biệt</h3>
<pre><code class="language-text">Kho nay 3 tokens:
  1. backend-write     — dung Read+Write, chi cuonghoangdev-media bucket
  2. worker-analytics  — dung Read-only, chi analytics-logs bucket  
  3. admin-migration   — Admin R+W, TTL 24h, dung khi migrate

MOI workload -&gt; MOT token. Neu 1 leak, xoa MOT token, khong break het.
</code></pre>

<div class="callout ok">
<p><strong>Per-workload = blast radius nhỏ.</strong> Backend leak = revoke backend token, cấp mới, deploy. Worker/admin không bị ảnh hưởng.</p>
</div>

<h3>Rotation schedule</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Quarterly (khuyến nghị)</span><span class="lz-d">Cứ 3 tháng rotate mọi token. Overlap 24h — old token vẫn hoạt động trong khi deploy new token.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Post-incident</span><span class="lz-d">Bất cứ khi nào suspect leak (Git commit, log expose, employee leave). Không đợi quarterly.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Automated</span><span class="lz-d">Ideal: rotation script + secret manager (Vault, AWS Secrets Manager). Kho này chưa có — manual quarterly.</span></div>
</div>

<h3>Rotation procedure</h3>
<pre><code class="language-text">1. Cloudflare Dashboard -&gt; Create NEW token (same permissions)
2. Copy vao /opt/cuonghoangdev/.env moi (khong overwrite cu):
   R2_ACCESS_KEY_ID_NEW=xxx
   R2_SECRET_ACCESS_KEY_NEW=yyy
3. Deploy backend switching to NEW keys
4. Verify: kiem upload/download hoat dong
5. Wait 1 hour (in-flight requests complete)
6. Revoke OLD token o Cloudflare Dashboard
7. Update env: rename NEW -&gt; primary, remove OLD entries
</code></pre>

<h3>Lưu credential — ĐỪNG</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Git commit</span><span class="lz-lnote">Ngay cả private repo, credential vào Git history không remove được (rewrite history khó). .gitignore .env luôn</span></div>
<div class="lz-layer"><span class="lz-lname">Frontend bundle</span><span class="lz-lnote"><code>NEXT_PUBLIC_R2_KEY</code> = ship key qua browser bundle. Ai view page source cũng thấy. NEVER</span></div>
<div class="lz-layer"><span class="lz-lname">Docker image (COPY .env)</span><span class="lz-lnote">Image layer chứa .env. Layer inspect được. Dùng env vars ở runtime</span></div>
<div class="lz-layer"><span class="lz-lname">Log output</span><span class="lz-lnote">Sanitize log để không print process.env. Sentry, Datadog, log aggregators đều retain</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — commit .env chứa placeholder rồi thay bằng real secret post-commit.</strong> Git history vẫn có placeholder — reviewer assume ok. Ngày mai bạn <code>git log -p</code> real secret. Fix: never commit .env, chỉ commit .env.example với dummy values.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> R2 API token là long-lived, không auto-rotate như IAM STS — tạo per-workload (backend, worker, admin) để limit blast radius, rotate quarterly + post-incident với overlap 24h, và KHÔNG BAO GIỜ commit vào Git, ship qua frontend bundle, bake vào Docker image, hay log output.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo HAI R2 API token với tên riêng (vd <code>backend-prod</code>, <code>worker-thumbs</code>) để lộ một cái không phơi cái kia.</li>
<li>Đặt key chỉ trong environment; grep repo tìm prefix key và xác nhận không có hit nào trong Git, frontend bundle, và <code>ENV</code> của <code>Dockerfile</code>.</li>
<li>Làm một lần rotate: tạo token mới, deploy, giữ token cũ sống thêm 24h overlap, rồi revoke cái cũ — ghi bốn bước đó thành runbook.</li>
<li>Xác nhận logger che secret: log một request mang key và kiểm key không xuất hiện trong output.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có hai token per-workload, không key nào trong Git/bundle/image, và một runbook rotate 4 bước đã ghi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">R2 API token</span><span class="v">Access key long-lived; không tự hết hạn như IAM STS.</span></div>
  <div class="kv"><span class="k">Per-workload token</span><span class="v">Mỗi app/worker/admin một token, để lộ có blast radius nhỏ.</span></div>
  <div class="kv"><span class="k">Rotation</span><span class="v">Thay key theo lịch và sau sự cố.</span></div>
  <div class="kv"><span class="k">Overlap window</span><span class="v">Key cũ và mới cùng hợp lệ ~24h để không request nào fail giữa chừng.</span></div>
  <div class="kv"><span class="k">Blast radius</span><span class="v">Phạm vi một token lộ với tới — giảm bằng cách scope hẹp.</span></div>
  <div class="kv"><span class="k">Secret redaction</span><span class="v">Logger che key để chúng không bao giờ vào log storage.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>R2 token là long-lived — không auto-rotate, nên bạn tự giữ lịch rotate.</li><li>Mỗi workload một token giới hạn blast radius; rotate hàng quý và sau mọi sự cố với overlap 24h.</li><li>Không bao giờ commit token vào Git, ship trong frontend bundle, bake vào image, hay log nó.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — API tokens</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/tokens — tạo, permission, TTL.</span></span></div>
</div>
`,
    },

    {
      title: '2.4 — Chapter 2 quiz|||2.4 — Kiểm tra Chương 2',
      slug: 'os-2-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu, sáu phút. Về pricing, quirks, tokens.',
      content: `
<div class="ml-en"><span class="eyebrow">Chapter 2 · Quiz</span><h2>What Chapter 2 established</h2><p class="lead">Four questions on R2 specifics.</p></div>
<div class="ml-vi"><span class="eyebrow">Chương 2 · Kiểm tra</span><h2>Chương 2 đã dựng được gì</h2><p class="lead">Bốn câu về R2 specifics.</p></div>
`,
      quiz: {
        timeLimitSeconds: 360,
        questions: [
          {
            question: 'Media app serving 10 TB/month egress. S3 vs R2 cost difference?|||Media app serve 10 TB/month egress. Chênh cost S3 vs R2?',
            options: [
              'S3 ~$928/mo (mostly egress at $0.09/GB), R2 ~$20/mo (zero egress). ~46x cheaper for R2|||S3 ~$928/mo (đa phần egress $0.09/GB), R2 ~$20/mo (zero egress). ~46x rẻ hơn R2',
              'Similar cost|||Cost tương đương',
              'S3 cheaper|||S3 rẻ hơn',
              'Depends on region|||Phụ thuộc region',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Setting <code>region: &quot;us-east-1&quot;</code> when initializing R2 S3Client. Result?|||Set <code>region: &quot;us-east-1&quot;</code> khi init R2 S3Client. Kết quả?',
            options: [
              'R2 ignores region entirely (single global bucket). Convention is <code>region: &quot;auto&quot;</code> — SDK requires a string but R2 doesn&#39;t use it|||R2 ignore region hoàn toàn (single global bucket). Convention là <code>region: &quot;auto&quot;</code> — SDK cần string nhưng R2 không dùng',
              'Error — invalid R2 region|||Error — invalid R2 region',
              'Bucket created in us-east-1|||Bucket tạo ở us-east-1',
              'Extra latency|||Latency thêm',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'You have backend + worker + admin scripts all using R2. Token strategy?|||Bạn có backend + worker + admin script đều dùng R2. Strategy token?',
            options: [
              'Create separate token per workload — if one leaks, revoke that one; others unaffected. Blast radius small|||Tạo token riêng per workload — nếu 1 leak, revoke cái đó; cái khác không ảnh hưởng. Blast radius nhỏ',
              'One admin token for all|||Một admin token cho tất',
              'Rotate weekly regardless|||Rotate weekly bất kể',
              'Use frontend NEXT_PUBLIC_ vars|||Dùng frontend NEXT_PUBLIC_ vars',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'R2 doesn\'t support S3 Object Lambda. Impact on migration?|||R2 không support S3 Object Lambda. Ảnh hưởng migrate?',
            options: [
              'Only affects apps that use Object Lambda for on-the-fly transformations. If yours doesn\'t (this repo doesn\'t), migration is straightforward. Check R2 compat page for other features|||Chỉ ảnh hưởng app dùng Object Lambda cho on-the-fly transformation. Nếu bạn không dùng (kho này không), migration straightforward. Check R2 compat page cho feature khác',
              'Blocks all migration|||Chặn mọi migration',
              'Requires paid Cloudflare plan|||Cần Cloudflare paid plan',
              'Nothing — R2 fully compatible|||Không gì — R2 fully compatible',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
