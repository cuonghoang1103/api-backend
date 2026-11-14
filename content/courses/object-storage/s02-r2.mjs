import G02_1 from './giang/obj-02-1.mjs';
import G02_2 from './giang/obj-02-2.mjs';
import G02_3 from './giang/obj-02-3.mjs';
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
${G02_1}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Zero egress: the R2 pricing pitch</h2>
<p class="lead">R2&#39;s single most important difference from S3 is pricing. Storage similar (R2 $0.015/GB/mo vs S3 $0.023/GB/mo — small delta). Egress is huge: R2 $0, S3 $0.09/GB. For media apps, that swings the total 10-100×.</p>

<h3>Cost comparison — 1 TB storage, 10 TB/month egress</h3>
<div class="out">S3 (standard):
  Storage:      1000 GB * $0.023 =  $23.00/mo
  Egress:      10000 GB * $0.09  = $900.00/mo
  Requests:    1M PUT * $0.005/1000 + 10M GET * $0.0004/1000 = $9.00/mo
  (egress: the first 100 GB/month are free => 9,900 GB * $0.09 = $891.00)
  TOTAL:                          $923.00/mo

R2:
  Storage:      (1000 - 10 free) GB * $0.015 = $14.85/mo
  Egress:      10000 GB * $0     =   $0.00/mo
  Class A ops:  1M PUT  - 1M free  = $0.00
  Class B ops: 10M GET - 10M free  = $0.00
  TOTAL:                           $14.85/mo

Difference: ~62x cheaper for R2 in this scenario
(prices fetched 14/11/2026 from the AWS Price List API and developers.cloudflare.com/r2/pricing;
 earlier versions of this lesson said $928 vs $20, 46x — they skipped both free tiers)
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
  (recomputed with the R2 free tier — 10 GB, 1M Class A, 10M Class B: ~$0.60/mo.
   These usage figures are GUESSES; check the real invoice after 30 days.)

Neu chuyen sang S3:
  Storage:  $1.15
  Egress:   $45
  TOTAL: ~$46/mo (30x)
</code></pre>

<h3>When R2 might not be right</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Ecosystem lock-in</span><span class="lz-lnote">You run AWS S3 + Lambda + CloudFront as a tightly integrated stack. Switching costs are high, and the monthly saving often does NOT repay the migration plus retraining the team</span></div>
<div class="lz-layer"><span class="lz-lname">Compliance (GDPR data residency)</span><span class="lz-lnote">R2 stores in Cloudflare's &quot;auto&quot; region. Need EU customer data to stay EU-only? R2 offers Jurisdictional Restrictions (e.g. EU) — check they meet your rules — or pick S3 eu-west-1</span></div>
<div class="lz-layer"><span class="lz-lname">Advanced S3 features</span><span class="lz-lnote">R2 covers ~90% of the S3 API. Missing pieces include S3 Batch Operations, S3 Select and Object Lambda. If you depend on those, you cannot migrate yet</span></div>
<div class="lz-layer"><span class="lz-lname">Multi-region auto-replication</span><span class="lz-lnote">S3 has Cross-Region Replication built in. R2 is single-global (data in one region, served from the edge). Strict DR requirements may need a layer on top</span></div>
</div>

<h3>Class A vs Class B operations</h3>
<div class="out">Class A (expensive): $4.50/million
  PutObject, PostObject, CopyObject, ListObjectsV2, UploadPart, CompleteMultipartUpload
Free:  DeleteObject, DeleteBucket, AbortMultipartUpload  (R2 pricing page)
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
<p><strong>One sentence.</strong> R2's zero egress + $0.015/GB storage against S3's $0.09/GB egress + $0.023/GB storage — for a media app doing 10 TB/month of egress that is $923 versus $14.85 at today's prices (~62× cheaper; with no egress only ~2×), and it is the main reason to choose R2; but ecosystem lock-in, compliance requirements, and S3's advanced features remain three valid reasons to stay.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Pick a realistic monthly profile for your app: storage GB held, and egress GB served. Write both numbers down.</li>
<li>Compute the S3 bill: storage &times; $0.023 + egress &times; $0.09. Compute the R2 bill: storage &times; $0.015 + egress &times; $0 (egress free).</li>
<li>Divide to get the ratio. Re-run it with egress at 1 TB and at 50 TB and watch the ratio move — egress is what drives it.</li>
<li>List, for your situation, which of the three stay-on-S3 reasons apply (ecosystem lock-in, compliance/region, an S3 feature R2 lacks).</li>
</ol>
<p><strong>Done when:</strong> you have an S3-vs-R2 ratio for your own numbers and can say at what egress level R2 stops being dramatically cheaper.</p></div>

<h3>🔬 Measured: today's prices, and the bills computed from them</h3>
<p>The script reads the public AWS Price List API (AmazonS3 + AWSDataTransfer, us-east-1) and Cloudflare's R2 pricing page — no account, no bucket is touched.</p>
<div class="out">$ node gia.mjs
AWS (công bố 2026-11-09): S3 Standard $0.023/GB-tháng · PUT/COPY/POST/LIST $5.00/triệu · GET $0.40/triệu · egress $0.09/GB (100 GB đầu miễn phí)
R2: | Storage | $0.015 / GB-month | $0.01 / GB-month
R2: | Class A Operations | $4.50 / million requests | $9.00 / million requests
R2: | Class B Operations | $0.36 / million requests | $0.90 / million requests
R2: | Storage | 10 GB-month / month
R2: | Class A Operations | 1 million requests / month
R2: | Class B Operations | 10 million requests / month
R2: Free operations include &#96;DeleteObject&#96;, &#96;DeleteBucket&#96; and &#96;AbortMultipartUpload&#96;.
— Kịch bản của bài: lưu 1.000 GB, egress 10.000 GB, 1 triệu PUT, 10 triệu GET / tháng
  1 TB lưu · 10 TB egress                S3 $  923.00   R2 $  14.85   ×62.2
— Đổi egress, giữ 1 TB lưu + 1 triệu PUT + 10 triệu GET:
  egress 0 TB                            S3 $   32.00   R2 $  14.85   ×2.2
  egress 1 TB                            S3 $  113.00   R2 $  14.85   ×7.6
  egress 5 TB                            S3 $  473.00   R2 $  14.85   ×31.9
  egress 10 TB                           S3 $  923.00   R2 $  14.85   ×62.2
  egress 50 TB                           S3 $ 4324.70   R2 $  14.85   ×291.2
— App nặng request, không egress: 1 TB lưu, 100 triệu PUT, 1 tỉ GET:
  100 triệu PUT · 1 tỉ GET · 0 egress    S3 $  923.00   R2 $ 816.75   ×1.1</div>
<p>Egress decides the ratio: with 1 TB stored and no egress R2 is only ~2.2× cheaper; at 10 TB served ~62×; at 50 TB ~291×. A request-heavy app with no egress pays almost the same on both (~1.1×) — R2 removes the egress line, not the request lines.</p>
<h3>🔬 Measured: the requests behind one "change avatar"</h3>
<p>An SDK middleware counted every request really sent to a local MinIO, classified with R2's price list:</p>
<div class="out">$ node dem.mjs
PutObject        ×  1  ⇒ lớp A
HeadObject       ×  1  ⇒ lớp B
GetObject        × 20  ⇒ lớp B
DeleteObject     ×  1  ⇒ lớp miễn phí
ListObjectsV2    ×  1  ⇒ lớp A</div>
<p>The one LIST costs as much as the PUT; the DELETE is free on R2.</p>
<h3>🔁 Run it yourself</h3>
<p>Save the price script (Node 22, no dependency — it only uses <code>fetch</code>) and run it with your own month: GB stored, GB served, writes, reads. For the request count, add one middleware to your <code>S3Client</code>: <code>s3.middlewareStack.add((next, ctx) =&gt; async (args) =&gt; { count[ctx.commandName]++; return next(args); }, { step: 'build' })</code>.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-4-cdn-tep-tinh" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 12.4 — CDN and static files: cache headers, renaming on change, and object storage</span><span class="lc-sub">A CDN cache hit never reaches the bucket — no Class B, no egress</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-14-4-chi-phi-doi-nha-cung-cap" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 14.4 — Cost, and moving to a new server without losing data</span><span class="lc-sub">Computing what a provider switch really costs</span></span></a>

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
<ul><li>R2 charges $0 egress + $0.015/GB storage; S3 charges $0.09/GB egress + $0.023/GB storage.</li><li>For a 10 TB/month-egress media app that is $923 vs $14.85 — ~62× cheaper, driven by egress (with no egress: ~2×).</li><li>Three valid reasons stay on S3: ecosystem lock-in, compliance/region, and advanced S3 features R2 lacks.</li></ul>

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
  Requests:    1M PUT * $0.005/1000 + 10M GET * $0.0004/1000 = $9.00/mo
  (egress: the first 100 GB/month are free => 9,900 GB * $0.09 = $891.00)
  TOTAL:                          $923.00/mo

R2:
  Storage:      (1000 - 10 free) GB * $0.015 = $14.85/mo
  Egress:      10000 GB * $0     =   $0.00/mo
  Class A ops:  1M PUT  - 1M free  = $0.00
  Class B ops: 10M GET - 10M free  = $0.00
  TOTAL:                           $14.85/mo

Difference: ~62x cheaper for R2 in this scenario
(prices fetched 14/11/2026 from the AWS Price List API and developers.cloudflare.com/r2/pricing;
 earlier versions of this lesson said $928 vs $20, 46x — they skipped both free tiers)
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
  (recomputed with the R2 free tier — 10 GB, 1M Class A, 10M Class B: ~$0.60/mo.
   These usage figures are GUESSES; check the real invoice after 30 days.)

Neu chuyen sang S3:
  Storage:  $1.15
  Egress:   $45
  TOTAL: ~$46/mo (30x)
</code></pre>

<h3>Khi R2 có thể không phù hợp</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Ecosystem lock-in</span><span class="lz-lnote">Bạn dùng AWS S3 + Lambda + CloudFront tight integration. Switching cost cao. Đôi khi $/month tiết kiệm KHÔNG bù được migration cost + team retraining</span></div>
<div class="lz-layer"><span class="lz-lname">Compliance (GDPR data residency)</span><span class="lz-lnote">R2 lưu ở Cloudflare region &quot;auto&quot;. EU customer data cần EU-only? R2 có Jurisdictional Restrictions (vd EU) — kiểm xem có đáp ứng luật của bạn không — hoặc chọn S3 EU-West-1</span></div>
<div class="lz-layer"><span class="lz-lname">Advanced S3 features</span><span class="lz-lnote">R2 có ~90% S3 API. Vài thứ thiếu: S3 Batch Operations, S3 Select, Object Lambda. Nếu bạn dùng chúng, chưa migrate được</span></div>
<div class="lz-layer"><span class="lz-lname">Multi-region auto-replication</span><span class="lz-lnote">S3 có Cross-Region Replication built-in. R2 chỉ single global (data lưu 1 region, serve qua edge). Cho DR strict, có thể cần thêm layer</span></div>
</div>

<h3>Class A vs Class B operation</h3>
<div class="out">Class A (expensive): $4.50/million
  PutObject, PostObject, CopyObject, ListObjectsV2, UploadPart, CompleteMultipartUpload
Free:  DeleteObject, DeleteBucket, AbortMultipartUpload  (R2 pricing page)
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
<p><strong>Một câu.</strong> R2 free egress + $0.015/GB storage vs S3 $0.09/GB egress + $0.023/GB storage — cho media app 10 TB/mo egress khác biệt là $923 vs $14.85 theo giá hôm nay (~62× rẻ hơn; không egress thì chỉ ~2×), đây là lý do chính chọn R2; nhưng ecosystem lock-in, compliance, và advanced features S3 vẫn là ba lý do valid stick với S3.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một profile tháng thực tế cho app: storage GB giữ, và egress GB serve. Ghi cả hai số.</li>
<li>Tính bill S3: storage &times; $0.023 + egress &times; $0.09. Tính bill R2: storage &times; $0.015 + egress &times; $0 (egress miễn phí).</li>
<li>Chia để ra tỉ lệ. Chạy lại với egress 1 TB và 50 TB và xem tỉ lệ thay đổi — egress mới là thứ quyết định.</li>
<li>Liệt kê, cho tình huống của bạn, lý do nào trong ba lý do ở-lại-S3 áp dụng (ecosystem lock-in, compliance/region, một feature S3 mà R2 thiếu).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có tỉ lệ S3-vs-R2 cho số của chính mình và nói được ở mức egress nào thì R2 hết rẻ vượt trội.</p></div>

<h3>🔬 Đo thật: giá hôm nay, và hoá đơn tính từ đó</h3>
<p>Script đọc AWS Price List API công khai (AmazonS3 + AWSDataTransfer, us-east-1) và trang giá R2 của Cloudflare — không chạm tài khoản, không chạm bucket nào.</p>
<div class="out">$ node gia.mjs
AWS (công bố 2026-11-09): S3 Standard $0.023/GB-tháng · PUT/COPY/POST/LIST $5.00/triệu · GET $0.40/triệu · egress $0.09/GB (100 GB đầu miễn phí)
R2: | Storage | $0.015 / GB-month | $0.01 / GB-month
R2: | Class A Operations | $4.50 / million requests | $9.00 / million requests
R2: | Class B Operations | $0.36 / million requests | $0.90 / million requests
R2: | Storage | 10 GB-month / month
R2: | Class A Operations | 1 million requests / month
R2: | Class B Operations | 10 million requests / month
R2: Free operations include &#96;DeleteObject&#96;, &#96;DeleteBucket&#96; and &#96;AbortMultipartUpload&#96;.
— Kịch bản của bài: lưu 1.000 GB, egress 10.000 GB, 1 triệu PUT, 10 triệu GET / tháng
  1 TB lưu · 10 TB egress                S3 $  923.00   R2 $  14.85   ×62.2
— Đổi egress, giữ 1 TB lưu + 1 triệu PUT + 10 triệu GET:
  egress 0 TB                            S3 $   32.00   R2 $  14.85   ×2.2
  egress 1 TB                            S3 $  113.00   R2 $  14.85   ×7.6
  egress 5 TB                            S3 $  473.00   R2 $  14.85   ×31.9
  egress 10 TB                           S3 $  923.00   R2 $  14.85   ×62.2
  egress 50 TB                           S3 $ 4324.70   R2 $  14.85   ×291.2
— App nặng request, không egress: 1 TB lưu, 100 triệu PUT, 1 tỉ GET:
  100 triệu PUT · 1 tỉ GET · 0 egress    S3 $  923.00   R2 $ 816.75   ×1.1</div>
<p>Egress quyết định tỉ lệ: lưu 1 TB, không egress thì R2 chỉ rẻ hơn ~2,2×; phục vụ 10 TB ~62×; 50 TB ~291×. App nặng request, không egress trả gần như nhau ở hai bên (~1,1×) — R2 xoá dòng egress, không xoá dòng request.</p>
<h3>🔬 Đo thật: các request sau một lượt "đổi avatar"</h3>
<p>Một middleware của SDK đếm mọi request thật gửi tới MinIO cục bộ, xếp lớp theo bảng giá R2:</p>
<div class="out">$ node dem.mjs
PutObject        ×  1  ⇒ lớp A
HeadObject       ×  1  ⇒ lớp B
GetObject        × 20  ⇒ lớp B
DeleteObject     ×  1  ⇒ lớp miễn phí
ListObjectsV2    ×  1  ⇒ lớp A</div>
<p>Một lần LIST tốn ngang lần PUT; DELETE miễn phí trên R2.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Lưu script giá (Node 22, không cần thư viện — chỉ dùng <code>fetch</code>) và chạy với số tháng của bạn: GB lưu, GB phục vụ, số lần ghi, số lần đọc. Muốn đếm request, gắn một middleware vào <code>S3Client</code>: <code>s3.middlewareStack.add((next, ctx) =&gt; async (args) =&gt; { dem[ctx.commandName]++; return next(args); }, { step: 'build' })</code>.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-4-cdn-tep-tinh" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 12.4 — CDN và tệp tĩnh: header cache, đổi tên khi đổi nội dung, và kho object</span><span class="lc-sub">Lượt đọc trúng cache CDN không tới bucket — không Class B, không egress</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-14-4-chi-phi-doi-nha-cung-cap" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 14.4 — Chi phí, và chuyển sang máy chủ mới mà không mất dữ liệu</span><span class="lc-sub">Tính thật chi phí khi đổi nhà cung cấp</span></span></a>

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
<ul><li>R2 tính $0 egress + $0.015/GB storage; S3 tính $0.09/GB egress + $0.023/GB storage.</li><li>Cho media app 10 TB/tháng egress đó là $923 vs $14.85 — khoảng 62× rẻ hơn, do egress quyết định (không egress: ~2×).</li><li>Ba lý do valid ở lại S3: ecosystem lock-in, compliance/region, và feature S3 nâng cao mà R2 thiếu.</li></ul>

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
${G02_2}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>R2 quirks: region auto, path style, headers</h2>
<p class="lead">R2 is S3-compatible but not identical. Three quirks matter for anyone using AWS SDK with R2.</p>

<h3>Quirk 1: region &quot;auto&quot;</h3>
<pre><code class="language-ts">// WORKS, less explicit — R2 docs: '' and 'us-east-1' alias to 'auto'
new S3Client({ region: 'us-east-1' });

// CLEAREST — R2's own region name (the repo: R2_REGION, default 'auto')
new S3Client({ region: 'auto' });

// BROKEN — no region at all: "Region is missing" before any request (measured, 1.1)
new S3Client({});
</code></pre>

<p>R2 stores data globally from a single location. You do not choose a region. The SDK requires the field <code>region</code>, so the convention is <code>&#39;auto&#39;</code>.</p>

<h3>Quirk 2: virtual-hosted style preferred</h3>
<pre><code class="language-ts">// Path style (S3 legacy default cho custom endpoint):
//   https://endpoint.com/bucket-name/key
// Virtual-hosted (S3 new default):
//   https://bucket-name.endpoint.com/key

// R2 supports both. The custom domain (media.cuongthai.com) is a third, separate road:
//   https://media.cuongthai.com/key  — no bucket, no endpoint, no signature (it is not an SDK setting)
new S3Client({
  forcePathStyle: false,   // = virtual-hosted (R2 preferred)
});
</code></pre>

<div class="callout ok">
<p><strong>A custom domain is not an SDK URL style.</strong> The custom domain (media.cuongthai.com) is attached to the bucket in Cloudflare and serves public reads through the CDN: its URL is <code>https://media.cuongthai.com/&lt;key&gt;</code>, with neither bucket nor endpoint (the repo builds it as <code>\${R2_PUBLIC_URL}/\${key}</code>, r2.ts:399). <code>forcePathStyle</code> only shapes the <em>signed API</em> URLs. (Earlier versions of this lesson said the custom domain requires virtual-hosted style.)</p>
</div>

<h3>Quirk 3: some S3 headers are not supported</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">x-amz-storage-class</span><span class="lz-lnote">S3 has STANDARD, STANDARD_IA, GLACIER and more. R2 supports STANDARD and STANDARD_IA (Infrequent Access) — other classes are unsupported (R2 compatibility table, 14/11/2026)</span></div>
<div class="lz-layer"><span class="lz-lname">Server-side encryption</span><span class="lz-lnote">R2 always encrypts at rest automatically (AES-256). SSE-KMS is not supported; <strong>SSE-C (your own key) is supported</strong> (x-amz-server-side-encryption-customer-*). Earlier versions of this lesson said neither was</span></div>
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
<li>Create an R2 client once with <code>region: &#39;auto&#39;</code>, then deliberately set <code>region: &#39;us-east-1&#39;</code> and confirm R2 behaves identically — the docs make us-east-1 an alias of auto. (Do this on a test bucket, never production.)</li>
<li>PutObject with <code>StorageClass: &#39;GLACIER&#39;</code> and a <code>requester-pays</code> flag, then HeadObject the result: the quirky headers were accepted and silently dropped.</li>
<li>Open the R2 compatibility page and list three S3 features R2 does not support (e.g. SSE-KMS, object lock, requester pays).</li>
<li>Grep your own upload code for any of those unsupported headers so you know what will silently no-op after a migration.</li>
</ol>
<p><strong>Done when:</strong> you have confirmed region is ignored, seen whether R2 rejects or ignores an unsupported header, and listed three unsupported S3 features from the compat page.</p></div>

<h3>🔬 Measured: two URL shapes for one R2 object (signed offline)</h3>
<p>No request is sent — <code>getSignedUrl</code> only builds and signs. The endpoint uses a made-up account id; nothing here touches a real R2 bucket.</p>
<div class="out">$ node url.mjs
pathStyle false region auto      ⇒ cuongthai-media-storage.0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com/images/avatar/u42/a.jpg
   chữ ký cho vùng: auto
pathStyle true  region auto      ⇒ 0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com/cuongthai-media-storage/images/avatar/u42/a.jpg
   chữ ký cho vùng: auto
pathStyle false region us-east-1 ⇒ cuongthai-media-storage.0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com/images/avatar/u42/a.jpg
   chữ ký cho vùng: us-east-1
$ # URL công khai của kho: KHÔNG có tên bucket, cũng không có endpoint — đó là tên miền riêng trỏ vào bucket
$ cd ~/Downloads/api-backend &amp;&amp; grep -n "return \\&#96;\\\${base}/" src/config/r2.ts
399:  return &#96;\${base}/\${key.replace(/^\\/+/, '')}&#96;;</div>
<h3>🔬 Measured: quirky headers on the wire — MinIO is not R2</h3>
<div class="out">$ node header.mjs
StorageClass 'STANDARD_IA' gửi [x-amz-storage-class] ⇒ MinIO: InvalidStorageClass 400
StorageClass 'GLACIER'     gửi [x-amz-storage-class] ⇒ MinIO: InvalidStorageClass 400
RequestPayer 'requester'   gửi [x-amz-request-payer] ⇒ MinIO: OK
Tagging 'nguon=app'        gửi [x-amz-tagging] ⇒ MinIO: OK
SSE 'aws:kms'              gửi [x-amz-server-side-encryption] ⇒ MinIO: NotImplemented 501
SSE-C (khoá của bạn)       gửi [x-amz-server-side-encryption-customer-algorithm, x-amz-server-side-encryption-customer-key, x-amz-server-side-encryption-customer-key-md5] ⇒ MinIO: InvalidRequest 400</div>
<p>MinIO rejected STANDARD_IA (which R2 supports) and accepted requester-pays and tagging (which R2's table lists as unsupported). Four of five lines disagree: a feature that depends on such a header must be tested on R2 itself, in a staging bucket.</p>
<h3>🔬 R2's own compatibility table (read 14/11/2026), and this repo</h3>
<div class="out">$ # Trang tương thích S3 của R2 (developers.cloudflare.com/r2/api/s3/api, đọc 14/11/2026) — trích đúng dòng:
$ curl -s https://developers.cloudflare.com/r2/api/s3/api/index.md | grep -E "^When using the S3 API, the region" | cut -c1-200
When using the S3 API, the region for an R2 bucket is &#96;auto&#96;. For compatibility with tools that do not allow you to specify a region, an empty value and &#96;us-east-1&#96; will alias to the &#96;auto&#96; region.
$ curl -s https://developers.cloudflare.com/r2/api/s3/api/index.md | grep -E "^\\| ✅ \\[PutObject " | grep -oE "(✅|❌) (Storage Class|SSE-C|SSE|Request Payer|Tagging|Object Locking|STANDARD\\\\\\\\_IA|STANDARD)" | tr '\\n' ' '; echo
✅ Storage Class ✅ STANDARD ✅ STANDARD\\_IA ❌ SSE ✅ SSE-C ❌ Request Payer ❌ Tagging ❌ Object Locking 
$ cd ~/Downloads/api-backend &amp;&amp; grep -rnE "(StorageClass|RequestPayer|Tagging|ServerSideEncryption|SSECustomer[A-Za-z]*)\\s*:" src/config src/storage src/services/upload.service.ts | grep -vc "\\.test\\."
0</div>
<p>The repo's storage code sends none of these headers — only Content-Type, Cache-Control and Content-Disposition, all supported.</p>
<h3>🔁 Run it yourself</h3>
<p>The URL script needs no server: any endpoint string and fake credentials work, because signing is local. For the header test, use the local MinIO and a middleware at step <code>finalizeRequest</code> that prints <code>Object.keys(args.request.headers)</code>.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-4-cdn-tep-tinh" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 12.4 — CDN and static files: cache headers, renaming on change, and object storage</span><span class="lc-sub">A custom domain and a CDN in front of a bucket</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Headers that change behaviour: cache, compression, CORS, security</span><span class="lc-sub">What a header really changes on the wire</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">region: 'auto'</span><span class="v">SDK-required string; R2 has no regions and ignores the value.</span></div>
  <div class="kv"><span class="k">forcePathStyle: false</span><span class="v">Virtual-hosted URLs (<code>bucket.host/key</code>) — needed for custom domains.</span></div>
  <div class="kv"><span class="k">Silently ignored header</span><span class="v">Listed as unsupported in R2's compatibility table (SSE-KMS, requester pays, tagging, object lock…) — test on R2 whether it errors or is ignored.</span></div>
  <div class="kv"><span class="k">Compatibility page</span><span class="v">Cloudflare's list of which S3 features R2 does and does not implement.</span></div>
  <div class="kv"><span class="k">SSE-KMS</span><span class="v">S3 key-managed encryption — not supported on R2.</span></div>
  <div class="kv"><span class="k">Requester pays</span><span class="v">S3 billing mode shifting egress to the caller — no-op on R2.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>R2 needs <code>region: &#39;auto&#39;</code> (ignored) and <code>forcePathStyle: false</code> (virtual-hosted API URLs; us-east-1 also aliases to auto).</li><li>Several S3 headers are unsupported on R2 (SSE-KMS, requester pays, tagging, object lock); STANDARD_IA and SSE-C are supported.</li><li>Check the R2 compatibility page before migrating S3-specific code — silent no-ops are the trap.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — S3 API compatibility</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/api — chi tiết cái R2 support, cái không.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>R2 quirks: region auto, path style, header</h2>
<p class="lead">R2 là S3-compatible nhưng không identical. Ba quirk quan trọng cho ai dùng AWS SDK với R2.</p>

<h3>Quirk 1: region &quot;auto&quot;</h3>
<pre><code class="language-ts">// WORKS, less explicit — R2 docs: '' and 'us-east-1' alias to 'auto'
new S3Client({ region: 'us-east-1' });

// CLEAREST — R2's own region name (the repo: R2_REGION, default 'auto')
new S3Client({ region: 'auto' });

// BROKEN — no region at all: "Region is missing" before any request (measured, 1.1)
new S3Client({});
</code></pre>

<p>R2 lưu data toàn cầu với single location. Bạn không chọn region. SDK bắt buộc field <code>region</code>, nên convention là <code>&#39;auto&#39;</code>.</p>

<h3>Quirk 2: virtual-hosted style preferred</h3>
<pre><code class="language-ts">// Path style (S3 legacy default cho custom endpoint):
//   https://endpoint.com/bucket-name/key
// Virtual-hosted (S3 new default):
//   https://bucket-name.endpoint.com/key

// R2 supports both. The custom domain (media.cuongthai.com) is a third, separate road:
//   https://media.cuongthai.com/key  — no bucket, no endpoint, no signature (it is not an SDK setting)
new S3Client({
  forcePathStyle: false,   // = virtual-hosted (R2 preferred)
});
</code></pre>

<div class="callout ok">
<p><strong>Tên miền riêng không phải một kiểu URL của SDK.</strong> Tên miền riêng (media.cuongthai.com) được gắn vào bucket trong Cloudflare và phục vụ lượt đọc công khai qua CDN: URL là <code>https://media.cuongthai.com/&lt;key&gt;</code>, không có bucket lẫn endpoint (kho dựng bằng <code>\${R2_PUBLIC_URL}/\${key}</code>, r2.ts:399). <code>forcePathStyle</code> chỉ đổi dạng URL <em>API có chữ ký</em>. (Bản cũ của bài ghi tên miền riêng bắt buộc virtual-hosted.)</p>
</div>

<h3>Quirk 3: một số S3 header không support</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">x-amz-storage-class</span><span class="lz-lnote">S3 có STANDARD, STANDARD_IA, GLACIER... R2 hỗ trợ STANDARD và STANDARD_IA (Infrequent Access) — lớp khác không hỗ trợ (bảng tương thích R2, 14/11/2026)</span></div>
<div class="lz-layer"><span class="lz-lname">Server-side encryption</span><span class="lz-lnote">R2 luôn encrypt at rest tự động (AES-256). Không có SSE-KMS; <strong>CÓ SSE-C (khoá của bạn)</strong> (x-amz-server-side-encryption-customer-*). Bản cũ của bài ghi không có cả hai</span></div>
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
<li>Tạo client R2 một lần với <code>region: &#39;auto&#39;</code>, rồi cố ý set <code>region: &#39;us-east-1&#39;</code> và xác nhận R2 hành xử y hệt — tài liệu ghi us-east-1 là bí danh của auto. (Làm trên bucket thử nghiệm, không bao giờ trên production.)</li>
<li>PutObject với <code>StorageClass: &#39;GLACIER&#39;</code> và cờ <code>requester-pays</code>, rồi HeadObject kết quả: các header quirky được nhận và âm thầm bỏ.</li>
<li>Mở trang R2 compatibility và liệt kê ba feature S3 mà R2 không hỗ trợ (vd: SSE-KMS, object lock, requester pays).</li>
<li>Grep code upload của bạn tìm bất kỳ header không hỗ trợ nào để biết cái gì sẽ no-op âm thầm sau migration.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã xác nhận region bị bỏ qua, thấy R2 từ chối hay bỏ qua một header không hỗ trợ, và liệt kê ba feature S3 không hỗ trợ từ trang compat.</p></div>

<h3>🔬 Đo thật: hai dạng URL của một object R2 (ký offline)</h3>
<p>Không gửi request nào — <code>getSignedUrl</code> chỉ dựng và ký. Endpoint dùng mã tài khoản bịa; không lệnh nào chạm bucket R2 thật.</p>
<div class="out">$ node url.mjs
pathStyle false region auto      ⇒ cuongthai-media-storage.0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com/images/avatar/u42/a.jpg
   chữ ký cho vùng: auto
pathStyle true  region auto      ⇒ 0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com/cuongthai-media-storage/images/avatar/u42/a.jpg
   chữ ký cho vùng: auto
pathStyle false region us-east-1 ⇒ cuongthai-media-storage.0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com/images/avatar/u42/a.jpg
   chữ ký cho vùng: us-east-1
$ # URL công khai của kho: KHÔNG có tên bucket, cũng không có endpoint — đó là tên miền riêng trỏ vào bucket
$ cd ~/Downloads/api-backend &amp;&amp; grep -n "return \\&#96;\\\${base}/" src/config/r2.ts
399:  return &#96;\${base}/\${key.replace(/^\\/+/, '')}&#96;;</div>
<h3>🔬 Đo thật: header lạ trên dây — MinIO không phải R2</h3>
<div class="out">$ node header.mjs
StorageClass 'STANDARD_IA' gửi [x-amz-storage-class] ⇒ MinIO: InvalidStorageClass 400
StorageClass 'GLACIER'     gửi [x-amz-storage-class] ⇒ MinIO: InvalidStorageClass 400
RequestPayer 'requester'   gửi [x-amz-request-payer] ⇒ MinIO: OK
Tagging 'nguon=app'        gửi [x-amz-tagging] ⇒ MinIO: OK
SSE 'aws:kms'              gửi [x-amz-server-side-encryption] ⇒ MinIO: NotImplemented 501
SSE-C (khoá của bạn)       gửi [x-amz-server-side-encryption-customer-algorithm, x-amz-server-side-encryption-customer-key, x-amz-server-side-encryption-customer-key-md5] ⇒ MinIO: InvalidRequest 400</div>
<p>MinIO từ chối STANDARD_IA (R2 hỗ trợ) và nhận requester-pays, tagging (bảng của R2 ghi không hỗ trợ). Năm dòng lệch bốn: tính năng dựa vào header kiểu này phải thử trên chính R2, ở bucket thử nghiệm.</p>
<h3>🔬 Bảng tương thích của R2 (đọc 14/11/2026), và kho này</h3>
<div class="out">$ # Trang tương thích S3 của R2 (developers.cloudflare.com/r2/api/s3/api, đọc 14/11/2026) — trích đúng dòng:
$ curl -s https://developers.cloudflare.com/r2/api/s3/api/index.md | grep -E "^When using the S3 API, the region" | cut -c1-200
When using the S3 API, the region for an R2 bucket is &#96;auto&#96;. For compatibility with tools that do not allow you to specify a region, an empty value and &#96;us-east-1&#96; will alias to the &#96;auto&#96; region.
$ curl -s https://developers.cloudflare.com/r2/api/s3/api/index.md | grep -E "^\\| ✅ \\[PutObject " | grep -oE "(✅|❌) (Storage Class|SSE-C|SSE|Request Payer|Tagging|Object Locking|STANDARD\\\\\\\\_IA|STANDARD)" | tr '\\n' ' '; echo
✅ Storage Class ✅ STANDARD ✅ STANDARD\\_IA ❌ SSE ✅ SSE-C ❌ Request Payer ❌ Tagging ❌ Object Locking 
$ cd ~/Downloads/api-backend &amp;&amp; grep -rnE "(StorageClass|RequestPayer|Tagging|ServerSideEncryption|SSECustomer[A-Za-z]*)\\s*:" src/config src/storage src/services/upload.service.ts | grep -vc "\\.test\\."
0</div>
<p>Mã lưu trữ của kho không gửi header nào trong số đó — chỉ Content-Type, Cache-Control và Content-Disposition, đều được hỗ trợ.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Script URL không cần máy chủ: chuỗi endpoint bất kỳ và khoá giả đều được, vì ký là việc cục bộ. Phép thử header dùng MinIO cục bộ và một middleware ở bước <code>finalizeRequest</code> in ra <code>Object.keys(args.request.headers)</code>.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-4-cdn-tep-tinh" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 12.4 — CDN và tệp tĩnh: header cache, đổi tên khi đổi nội dung, và kho object</span><span class="lc-sub">Tên miền riêng và CDN đứng trước bucket</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Các header đổi hành vi: cache, nén, CORS, bảo mật</span><span class="lc-sub">Một header thật sự đổi gì trên dây</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">region: 'auto'</span><span class="v">Chuỗi SDK yêu cầu; R2 không có region và bỏ qua giá trị.</span></div>
  <div class="kv"><span class="k">forcePathStyle: false</span><span class="v">URL virtual-hosted (<code>bucket.host/key</code>) — cần cho custom domain.</span></div>
  <div class="kv"><span class="k">Header bị bỏ âm thầm</span><span class="v">Bảng tương thích R2 ghi không hỗ trợ (SSE-KMS, requester pays, tagging, object lock…) — thử trên R2 xem lỗi hay bị bỏ qua.</span></div>
  <div class="kv"><span class="k">Compatibility page</span><span class="v">Danh sách Cloudflare về feature S3 nào R2 có và không có.</span></div>
  <div class="kv"><span class="k">SSE-KMS</span><span class="v">Mã hoá quản-khoá của S3 — R2 không hỗ trợ.</span></div>
  <div class="kv"><span class="k">Requester pays</span><span class="v">Chế độ billing S3 đẩy egress sang caller — no-op trên R2.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>R2 cần <code>region: &#39;auto&#39;</code> (bị bỏ qua) và <code>forcePathStyle: false</code> (URL API dạng virtual-hosted; us-east-1 cũng là bí danh của auto).</li><li>Một số header S3 không được R2 hỗ trợ (SSE-KMS, requester pays, tagging, object lock); STANDARD_IA và SSE-C thì có.</li><li>Check trang R2 compatibility trước khi migrate code S3-specific — no-op âm thầm là cái bẫy.</li></ul>

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
${G02_3}
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
<pre><code class="language-text">Vi du chia token (VI DU minh hoa — khoa hoc khong mo Dashboard that de kiem):
  1. backend-write     — Object Read+Write, chi bucket cuongthai-media-storage
  2. worker-analytics  — Object Read only, chi bucket log/analytics
  3. admin-migration   — Admin R+W, TTL 24h, chi dung khi migrate
(Ma kho doc DUNG MOT cap: R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY — xem src/config/env.ts)

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
2. Thay GIA TRI cua dung hai bien ma ma doc, trong /opt/cuonghoangdev/.env:
   R2_ACCESS_KEY_ID=&lt;khoa moi&gt;
   R2_SECRET_ACCESS_KEY=&lt;secret moi&gt;
   (env.ts KHONG doc R2_*_NEW — ban cu cua bai ghi nhu vay, backend se van dung khoa cu)
3. Dung lai container backend (env chi duoc doc luc khoi dong) — token cu VAN hop le
4. Verify: upload + download that
5. Doi het request dang chay (vd 1 gio)
6. Revoke token CU o Cloudflare Dashboard =&gt; token cu nhan 403 InvalidAccessKeyId
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

<h3>🔬 Measured: one token per workload</h3>
<p>On a local MinIO (users + policies model the same idea as R2 API tokens; nothing here touches the real account), two narrow tokens, four attempts each:</p>
<div class="out">$ bash tao.sh
backend-write ⇐ chính sách chi-media-ghi
worker-analytics ⇐ chính sách chi-analytics-doc
$ node thu.mjs
backend-write     PUT media ✅ · GET media ✅ · GET analytics ❌ AccessDenied · PUT analytics ❌ AccessDenied
worker-analytics  PUT media ❌ AccessDenied · GET media ❌ AccessDenied · GET analytics ✅ · PUT analytics ❌ AccessDenied</div>
<p>The worker's token can only read analytics. If it leaks, that is the whole blast radius — revoke it and the backend never notices.</p>
<h3>🔬 Measured: rotation with overlap</h3>
<div class="out">$ bash xoay.sh
khoá cũ: backend-write · khoá mới: backend-write-2 (cùng chính sách chi-media-ghi)
$ node dung.mjs
  khoá CŨ: PUT ✅
  khoá MỚI: PUT ✅
$ ./mc.sh admin user disable lab backend-write &gt;/dev/null &amp;&amp; echo "đã vô hiệu backend-write (khoá cũ)"
đã vô hiệu backend-write (khoá cũ)
$ node dung.mjs
  khoá CŨ: PUT ❌ InvalidAccessKeyId (403)
  khoá MỚI: PUT ✅</div>
<h3>🔬 Audited in this repo: where keys must never land</h3>
<div class="out">$ git check-ignore -q .env &amp;&amp; echo ".env: bị .gitignore chặn"; git ls-files | grep -cE '(^|/)\\.env$' | sed 's/^/tệp .env đang được git theo dõi: /'
.env: bị .gitignore chặn
tệp .env đang được git theo dõi: 0
$ grep -rlE "NEXT_PUBLIC_R2_(ACCESS|SECRET)|process\\.env\\.R2_(ACCESS|SECRET)" frontend/src | wc -l | tr -d ' ' | sed 's/^/frontend\\/src đọc khoá R2: /'
frontend/src đọc khoá R2: 0
$ grep -n "NEXT_PUBLIC_R2_PUBLIC_URL ||" frontend/src/lib/utils.ts | sed -E 's/[0-9a-f]{32}/&lt;account-id&gt;/'
205:    process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.cuongthai.com';
$ grep -nE "COPY .*\\.env|ENV R2_" Dockerfile.backend frontend/Dockerfile | wc -l | tr -d ' ' | sed 's/^/Dockerfile chép .env hoặc đặt ENV R2_: /'
Dockerfile chép .env hoặc đặt ENV R2_: 0
$ grep -nE "R2_ACCESS_KEY_ID_NEW|_NEW\\b" src/config/env.ts | wc -l | tr -d ' ' | sed 's/^/env.ts đọc biến *_NEW (quy trình xoay của bài cũ): /'
env.ts đọc biến *_NEW (quy trình xoay của bài cũ): 0
$ grep -n "REDACTED" src/index.ts
349:  return url.replace(/([?&amp;](?:token|code)=)[^&amp;]+/gi, '$1[REDACTED]');
$ node -e "const u='/api/v1/music/stream?token=eyJhbGciOi.vidu.ky&amp;q=1'; console.log(u.replace(/([?&amp;](?:token|code)=)[^&amp;]+/gi, '\\$1[REDACTED]'))"
/api/v1/music/stream?token=[REDACTED]&amp;q=1</div>
<p>The env file is ignored and untracked, the frontend reads no R2 key, the Dockerfiles do not copy it, and the access log redacts <code>?token=</code>. Two findings while auditing — both <strong>fixed the same day</strong> (commit 3974b33): <code>frontend/src/lib/utils.ts</code> used to fall back to the R2 <em>API endpoint</em> when <code>NEXT_PUBLIC_R2_PUBLIC_URL</code> was missing (the 1.1 trap; now <code>media.cuongthai.com</code>), and <code>deleteObjects()</code> ignored per-key errors — S3 answers 200 and reports them only in <code>Errors</code>; the repo now reads them and logs a warning:</p>
<div class="out">$ node xoa-loi.mjs
HTTP 200 · Errors: [["docs/b.pdf","AccessDenied"]]
$ aws s3 ls s3://media-thu/docs/
2026-11-14 12:42:07          3 b.pdf
$ grep -nE "const loi = res.Errors|deleteObjects: \\$\\{loi.length\\}" src/config/r2.ts
275:    const loi = res.Errors ?? [];</div>
<h3>🔁 Run it yourself</h3>
<p>Use the MinIO client in a container (<code>cgr.dev/chainguard/minio-client</code>, <code>MC_HOST_lab=http://&lt;access-key&gt;:&lt;secret&gt;@host.docker.internal:&lt;port&gt;</code>): <code>mc admin policy create</code>, <code>mc admin user add</code>, <code>mc admin policy attach</code>, then <code>mc admin user disable</code> for the revoke step. Keep generated secrets in files with <code>chmod 600</code>; never print them.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-4-5-xoay-bi-mat" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 4.5 — Rotating a secret without kicking every user out</span><span class="lc-sub">The overlap window, applied to any secret</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-4-4-bi-mat-trong-lich-su-git" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 4.4 — A secret in git history is a LEAKED secret</span><span class="lc-sub">What to do when a key was committed</span></span></a>

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
<pre><code class="language-text">Vi du chia token (VI DU minh hoa — khoa hoc khong mo Dashboard that de kiem):
  1. backend-write     — Object Read+Write, chi bucket cuongthai-media-storage
  2. worker-analytics  — Object Read only, chi bucket log/analytics
  3. admin-migration   — Admin R+W, TTL 24h, chi dung khi migrate
(Ma kho doc DUNG MOT cap: R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY — xem src/config/env.ts)

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
2. Thay GIA TRI cua dung hai bien ma ma doc, trong /opt/cuonghoangdev/.env:
   R2_ACCESS_KEY_ID=&lt;khoa moi&gt;
   R2_SECRET_ACCESS_KEY=&lt;secret moi&gt;
   (env.ts KHONG doc R2_*_NEW — ban cu cua bai ghi nhu vay, backend se van dung khoa cu)
3. Dung lai container backend (env chi duoc doc luc khoi dong) — token cu VAN hop le
4. Verify: upload + download that
5. Doi het request dang chay (vd 1 gio)
6. Revoke token CU o Cloudflare Dashboard =&gt; token cu nhan 403 InvalidAccessKeyId
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

<h3>🔬 Đo thật: mỗi việc một token</h3>
<p>Trên MinIO cục bộ (user + chính sách mô phỏng cùng ý tưởng với API token của R2; không lệnh nào chạm tài khoản thật), hai token hẹp, mỗi cái thử bốn việc:</p>
<div class="out">$ bash tao.sh
backend-write ⇐ chính sách chi-media-ghi
worker-analytics ⇐ chính sách chi-analytics-doc
$ node thu.mjs
backend-write     PUT media ✅ · GET media ✅ · GET analytics ❌ AccessDenied · PUT analytics ❌ AccessDenied
worker-analytics  PUT media ❌ AccessDenied · GET media ❌ AccessDenied · GET analytics ✅ · PUT analytics ❌ AccessDenied</div>
<p>Token của worker chỉ đọc được analytics. Nếu nó lộ, đó là toàn bộ blast radius — thu hồi nó, backend không hề hay biết.</p>
<h3>🔬 Đo thật: xoay khoá có chồng lấn</h3>
<div class="out">$ bash xoay.sh
khoá cũ: backend-write · khoá mới: backend-write-2 (cùng chính sách chi-media-ghi)
$ node dung.mjs
  khoá CŨ: PUT ✅
  khoá MỚI: PUT ✅
$ ./mc.sh admin user disable lab backend-write &gt;/dev/null &amp;&amp; echo "đã vô hiệu backend-write (khoá cũ)"
đã vô hiệu backend-write (khoá cũ)
$ node dung.mjs
  khoá CŨ: PUT ❌ InvalidAccessKeyId (403)
  khoá MỚI: PUT ✅</div>
<h3>🔬 Kiểm trong kho: những chỗ khoá không bao giờ được nằm</h3>
<div class="out">$ git check-ignore -q .env &amp;&amp; echo ".env: bị .gitignore chặn"; git ls-files | grep -cE '(^|/)\\.env$' | sed 's/^/tệp .env đang được git theo dõi: /'
.env: bị .gitignore chặn
tệp .env đang được git theo dõi: 0
$ grep -rlE "NEXT_PUBLIC_R2_(ACCESS|SECRET)|process\\.env\\.R2_(ACCESS|SECRET)" frontend/src | wc -l | tr -d ' ' | sed 's/^/frontend\\/src đọc khoá R2: /'
frontend/src đọc khoá R2: 0
$ grep -n "NEXT_PUBLIC_R2_PUBLIC_URL ||" frontend/src/lib/utils.ts | sed -E 's/[0-9a-f]{32}/&lt;account-id&gt;/'
205:    process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.cuongthai.com';
$ grep -nE "COPY .*\\.env|ENV R2_" Dockerfile.backend frontend/Dockerfile | wc -l | tr -d ' ' | sed 's/^/Dockerfile chép .env hoặc đặt ENV R2_: /'
Dockerfile chép .env hoặc đặt ENV R2_: 0
$ grep -nE "R2_ACCESS_KEY_ID_NEW|_NEW\\b" src/config/env.ts | wc -l | tr -d ' ' | sed 's/^/env.ts đọc biến *_NEW (quy trình xoay của bài cũ): /'
env.ts đọc biến *_NEW (quy trình xoay của bài cũ): 0
$ grep -n "REDACTED" src/index.ts
349:  return url.replace(/([?&amp;](?:token|code)=)[^&amp;]+/gi, '$1[REDACTED]');
$ node -e "const u='/api/v1/music/stream?token=eyJhbGciOi.vidu.ky&amp;q=1'; console.log(u.replace(/([?&amp;](?:token|code)=)[^&amp;]+/gi, '\\$1[REDACTED]'))"
/api/v1/music/stream?token=[REDACTED]&amp;q=1</div>
<p>Tệp môi trường bị ignore và không được theo dõi, frontend không đọc khoá R2, Dockerfile không chép nó, và log truy cập che <code>?token=</code>. Hai phát hiện khi kiểm — cả hai <strong>đã sửa ngay trong ngày</strong> (commit 3974b33): <code>frontend/src/lib/utils.ts</code> từng lùi về <em>API endpoint</em> của R2 khi thiếu <code>NEXT_PUBLIC_R2_PUBLIC_URL</code> (cái bẫy bài 1.1; nay là <code>media.cuongthai.com</code>), và <code>deleteObjects()</code> từng bỏ qua lỗi từng key — S3 trả 200, chỉ báo lỗi trong <code>Errors</code>; kho nay đọc và ghi cảnh báo:</p>
<div class="out">$ node xoa-loi.mjs
HTTP 200 · Errors: [["docs/b.pdf","AccessDenied"]]
$ aws s3 ls s3://media-thu/docs/
2026-11-14 12:42:07          3 b.pdf
$ grep -nE "const loi = res.Errors|deleteObjects: \\$\\{loi.length\\}" src/config/r2.ts
275:    const loi = res.Errors ?? [];</div>
<h3>🔁 Tự chạy lại</h3>
<p>Dùng MinIO client trong container (<code>cgr.dev/chainguard/minio-client</code>, <code>MC_HOST_lab=http://&lt;access-key&gt;:&lt;secret&gt;@host.docker.internal:&lt;cổng&gt;</code>): <code>mc admin policy create</code>, <code>mc admin user add</code>, <code>mc admin policy attach</code>, rồi <code>mc admin user disable</code> cho bước thu hồi. Giữ secret sinh ra trong tệp <code>chmod 600</code>; không bao giờ in ra.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-4-5-xoay-bi-mat" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 4.5 — Xoay một bí mật mà không đá văng toàn bộ người dùng</span><span class="lc-sub">Cửa sổ chồng lấn, áp cho mọi bí mật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-4-4-bi-mat-trong-lich-su-git" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 4.4 — Bí mật lỡ vào lịch sử git là bí mật ĐÃ LỘ</span><span class="lc-sub">Làm gì khi khoá đã bị commit</span></span></a>

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
              'S3 ~$923/mo (mostly egress at $0.09/GB), R2 ~$15/mo (zero egress, requests in the free tier). ~60x cheaper for R2|||S3 ~$923/mo (đa phần egress $0.09/GB), R2 ~$15/mo (zero egress, request nằm trong hạn mức miễn phí). ~60x rẻ hơn R2',
              'Similar cost|||Cost tương đương',
              'S3 cheaper|||S3 rẻ hơn',
              'Depends on region|||Phụ thuộc region',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Setting <code>region: &quot;us-east-1&quot;</code> when initializing R2 S3Client. Result?|||Set <code>region: &quot;us-east-1&quot;</code> khi init R2 S3Client. Kết quả?',
            options: [
              'Works — R2 docs make an empty region and us-east-1 aliases of <code>auto</code>. Convention is <code>region: &quot;auto&quot;</code>; only a MISSING region fails (SDK: Region is missing)|||Chạy được — tài liệu R2 coi region rỗng và us-east-1 là bí danh của <code>auto</code>. Quy ước là <code>region: &quot;auto&quot;</code>; chỉ THIẾU region mới lỗi (SDK: Region is missing)',
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
