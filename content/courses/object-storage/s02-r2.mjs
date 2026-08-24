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
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Compete với S3</span><span class="lz-d">R2 released 2021 as direct S3 alternative. Zero egress is the marketing hook.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Charge cho request instead</span><span class="lz-d">Class A operations (PUT, POST, LIST): $4.50/million. Class B (GET, HEAD): $0.36/million. So a busy app pays through requests, not egress.</span></div>
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

<h3>When R2 might not be right</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Ecosystem lock-in</span><span class="lz-lnote">Bạn dùng AWS S3 + Lambda + CloudFront tight integration. Switching cost cao. Đôi khi $/month tiết kiệm KHÔNG bù được migration cost + team retraining</span></div>
<div class="lz-layer"><span class="lz-lname">Compliance (GDPR data residency)</span><span class="lz-lnote">R2 stores in Cloudflare region &quot;auto&quot;. EU customer data cần EU-only? R2 có Jurisdictional Restrictions option (paid) — hoặc chọn S3 EU-West-1</span></div>
<div class="lz-layer"><span class="lz-lname">Advanced S3 features</span><span class="lz-lnote">R2 has ~90% of S3 API. Some things missing: S3 Batch Operations, S3 Select, Object Lambda. Nếu bạn dùng chúng, chưa migrate được</span></div>
<div class="lz-layer"><span class="lz-lname">Multi-region auto-replication</span><span class="lz-lnote">S3 có Cross-Region Replication built-in. R2 chỉ single global (data lưu 1 region, phục vụ qua edge). Cho DR strict, có thể cần thêm layer</span></div>
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
<p><strong>Bẫy — kiểm cost bằng cách nghĩ &quot;storage cheap enough&quot;.</strong> Cost thật thường là egress (S3) hoặc requests (R2 nếu request-heavy). Kiểm hoá đơn thật sau 30 ngày trước khi conclude. Cost calculator online là ước lượng, KHÔNG chính xác.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> R2 free egress + $0.015/GB storage vs S3 $0.09/GB egress + $0.023/GB storage — cho media app 10 TB/mo egress khác biệt là ~$900 vs ~$20 (46× cheaper), đây là lý do chính chọn R2; nhưng ecosystem lock-in, compliance, và advanced features S3 vẫn là ba lý do valid stick với S3.</p>
</div>

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

<p>R2 stores data globally with single location. Bạn không chọn region. SDK bắt buộc field <code>region</code>, nên convention là <code>&#39;auto&#39;</code>.</p>

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
<p><strong>Cloudflare custom domain = built-in CDN.</strong> Không cần Cloudfront hoặc thêm CDN service. Cache invalidation qua Cloudflare purge API. Cost egress vẫn zero.</p>
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
<p><strong>Bẫy — assume mọi S3 SDK operation work identically on R2.</strong> ~90% match. Advanced features (Object Lambda, S3 Select, Batch Operations, Object Lock) chưa support. Check R2 API compatibility page trước dùng.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> R2 quirks: region <code>&#39;auto&#39;</code> (SDK required nhưng R2 ignore), <code>forcePathStyle: false</code> (virtual-hosted cho custom domain), một số S3 headers ignore silent (storage class, SSE-KMS, requester pays, object lock) — check R2 compat page trước migrate S3-specific code.</p>
</div>

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

<h3>Storing credentials — DON'T</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Git commit</span><span class="lz-lnote">Ngay cả private repo, credential vào Git history không remove được (rewrite history khó). .gitignore .env luôn</span></div>
<div class="lz-layer"><span class="lz-lname">Frontend bundle</span><span class="lz-lnote"><code>NEXT_PUBLIC_R2_KEY</code> = ship key qua browser bundle. Ai view page source cũng thấy. NEVER</span></div>
<div class="lz-layer"><span class="lz-lname">Docker image (COPY .env)</span><span class="lz-lnote">Image layer chứa .env. Layer inspect được. Dùng env vars ở runtime</span></div>
<div class="lz-layer"><span class="lz-lname">Log output</span><span class="lz-lnote">Sanitize log để không print process.env. Sentry, Datadog, log aggregators đều retain</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — commit .env chứa placeholder rồi thay bằng real secret post-commit.</strong> Git history vẫn có placeholder — reviewers assume ok. Ngày mai bạn <code>git log -p</code> real secret. Fix: never commit .env, chỉ commit .env.example với dummy values.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> R2 API tokens là long-lived, không auto-rotate như IAM STS — tạo per-workload (backend, worker, admin) để limit blast radius, rotate quarterly + post-incident với overlap 24h, và NEVER commit vào Git, ship qua frontend bundle, bake vào Docker image, hay log output.</p>
</div>

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
<div class="ml-en"><span class="eyebrow">Chapter 2 · Quiz</span><h2>What Chapter 2 established</h2><p class="lead">Bốn câu về R2 specifics.</p></div>
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
