const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 7 — Cost management|||Chương 7 — Quản lý cost',
  slug: 'os-ch7-cost',
  description: 'Bốn bài về cost: nguồn thật của bill, R2 vs S3 với con số thật, thumbnail traps và optimization patterns.',
  sortOrder: 8,
  lessons: [

    {
      title: '7.1 — What actually shows up on the bill|||7.1 — Cái gì thực sự lên hoá đơn',
      slug: 'os-7-1-drivers',
      type: 'VIDEO',
      description: 'Storage size is only one of five things that costs money in object storage. Requests, egress, data transfer, and infrastructure fees are the others — some are bigger than storage.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>What actually shows up on the bill</h2>
<p class="lead">Most people think &quot;object storage cost&quot; means &quot;how many GB I store&quot;. That is roughly a fifth of the story on S3, and roughly the entire story on R2 — and understanding the split is the difference between a $12 bill and a $1,200 bill for the same amount of data.</p>

<h3>The five things clouds bill you for</h3>
<pre><code class="language-text">1. Storage per GB per month
   How many bytes sit in the bucket, prorated by time.

2. Class A operations (writes)
   PUT, POST, COPY, LIST, CreateMultipartUpload, UploadPart,
   CompleteMultipartUpload — anything that mutates state.

3. Class B operations (reads)
   GET, HEAD — anything that reads state.

4. Egress (data leaving the cloud)
   Bytes flowing OUT to the internet or to another cloud region.
   The biggest surprise on almost every S3 bill.

5. Infrastructure fees
   Cross-region replication, KMS-encrypted operations, VPC endpoint
   hourly, request-log delivery — often invisible until enabled.
</code></pre>

<p>Every line item you see on an invoice maps to one of the five. If you cannot label which of the five drove a $200 unexpected charge, you cannot fix it — you can only stare at it.</p>

<h3>Prices side-by-side (measured 2026-08, publicly listed)</h3>
<pre><code class="language-text">Line item                    R2 (Cloudflare)   S3 (AWS us-east-1)
──────────────────────────   ───────────────   ────────────────────
Storage (per GB-month)        $0.015            $0.023
Class A (per 1M ops)          $4.50             $5.00
Class B (per 1M ops)          $0.36             $0.40
Egress to internet            $0.00             $0.09/GB
Egress to other AWS region    $0.00             $0.02/GB
Egress to CloudFront          n/a               $0.00
Free monthly tier             10 GB storage,    5 GB storage,
                              1M Class A,       2k Class A,
                              10M Class B,      20k Class B
                              zero egress       first 100 GB egress
</code></pre>

<p>Two things jump out. First, R2 is 35% cheaper on storage. Second, R2 has zero egress, and S3 charges $0.09/GB. That second number is almost always what makes the R2 vs S3 comparison lopsided — because for most real workloads (websites, apps, video, CDN backing), egress dwarfs everything else.</p>

<h3>Where the money actually goes — worked example</h3>
<pre><code class="language-text">A small SaaS, one month of real numbers:

  Storage:           250 GB
  Uploads:           45,000 PUTs  (0.045 M Class A)
  Downloads:         6,200,000 GETs  (6.2 M Class B)
  Egress:            820 GB  (thumbnails + downloads to browsers)

On S3 us-east-1:
  Storage         250 × $0.023   =   $5.75
  Class A         0.045 × $5.00  =   $0.23
  Class B         6.2 × $0.40    =   $2.48
  Egress          820 × $0.09    =  $73.80
  TOTAL                            $82.26  ← 90% of it is egress

On R2:
  Storage         250 × $0.015   =   $3.75
  Class A         0.045 × $4.50  =   $0.20
  Class B         6.2 × $0.36    =   $2.23
  Egress          820 × $0.00    =   $0.00
  TOTAL                            $6.18  ← 13× cheaper

Same workload. The gap is entirely egress.
</code></pre>

<p>The example above is boring — a small app. Scale it to a startup serving 20 TB/month of video (moderate app), and the S3 bill grows to about $1,842 while R2 stays around $306. At 200 TB/month (a serious video app) S3 is $18,400 and R2 is $3,006. The absolute dollar gap gets bigger; the ratio stays around 6-13×.</p>

<h3>Where R2 is NOT cheaper</h3>
<pre><code class="language-text">Workload profile                Better cost on
──────────────────────────────  ─────────────
Cold archival, rare read         S3 Glacier Instant ($0.004/GB storage)
Zero egress (all internal only)  Tied — but S3 IntelligentTiering wins over months
Massive Class A rate             Tied — same $/M
Heavy CloudFront-fronted CDN     Tied (CF egress to CloudFront is free)
Small size, one-region app       S3 free tier > R2 free tier
</code></pre>

<p>R2's win comes from egress. Take egress away — either because you never egress (internal analytics pipeline) or because you already egress through CloudFront (which is free from S3) — and the two are within 30% of each other, sometimes with S3 slightly ahead depending on operation mix.</p>

<h3>The Class A trap almost everyone falls into</h3>
<pre><code class="language-text">A background job lists every object under a large prefix daily:

  ListObjectsV2 pages 1000 keys at a time.
  10M objects = 10,000 pages = 10,000 Class A ops per run.
  Daily = 300,000/month = 0.3 M Class A ops just for listing.
  
  Cost:  0.3 × $4.50 = $1.35/month on R2 (fine)
         0.3 × $5.00 = $1.50/month on S3 (fine)
  
But scale the job hourly:
  0.3 × 24 = 7.2 M Class A/month
  Cost:  7.2 × $4.50 = $32.40/month on R2
         7.2 × $5.00 = $36.00/month on S3
         
And scale the objects to 100M:
  72 M Class A/month = $324/month on R2 to LIST the bucket.
  No bytes moved. No data touched. Just listing.
</code></pre>

<p>The line item people notice is storage. The line item that actually causes bill spikes is Class A from over-eager listing or lifecycle scans. If a cost report jumps 3× overnight, look at Class A before you look at anything else.</p>

<div class="pitfall">
<p><strong>Trap — assuming &quot;R2 is free&quot; because egress is free.</strong> R2 still bills for storage, Class A, and Class B. A million reads of the same 1KB avatar is fine on either service; a million writes is $5. Free egress is a huge win, but it is one of five line items, not all of them.</p>
</div>

<div class="pitfall">
<p><strong>Trap — reading only the storage figure on the dashboard.</strong> Cloudflare's R2 dashboard shows storage prominently and Class A/B in a smaller section. AWS billing hides both under &quot;Requests&quot;. Every month, check both. A Class A spike from a runaway migration script has ended more free tiers than storage ever did.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Object-storage bills are five line items (storage, Class A writes, Class B reads, egress, infra fees) not one; R2's headline win is zero-egress which typically makes it 6-13× cheaper than S3 for browser- and CDN-facing apps, but on internal-only or CloudFront-fronted workloads the two are within 30%, and the sneakiest cost driver on either service is Class A from over-frequent LIST operations.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 pricing</span><span class="lc-sub">developers.cloudflare.com/r2/pricing — the five line items, in order.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 pricing</span><span class="lc-sub">aws.amazon.com/s3/pricing — request classes, egress tiers, storage classes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — R2 vs S3 comparison</span><span class="lc-sub">blog.cloudflare.com/announcing-r2-object-storage — the egress argument in detail.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Cái gì thực sự lên hoá đơn</h2>
<p class="lead">Hầu hết mọi người nghĩ &quot;cost object storage&quot; là &quot;bao nhiêu GB tôi lưu&quot;. Đó là khoảng một phần năm câu chuyện trên S3, và khoảng toàn bộ câu chuyện trên R2 — và hiểu sự chia đó là khác biệt giữa hoá đơn $12 và hoá đơn $1,200 cho cùng lượng data.</p>

<h3>Năm thứ cloud tính tiền bạn</h3>
<pre><code class="language-text">1. Storage per GB per tháng
   Bao nhiêu byte ngồi trong bucket, prorate theo thời gian.

2. Class A operation (ghi)
   PUT, POST, COPY, LIST, CreateMultipartUpload, UploadPart,
   CompleteMultipartUpload — bất cứ gì mutate state.

3. Class B operation (đọc)
   GET, HEAD — bất cứ gì đọc state.

4. Egress (data rời cloud)
   Byte chảy RA internet hoặc sang region cloud khác.
   Bất ngờ lớn nhất trên gần như mọi hoá đơn S3.

5. Phí infrastructure
   Cross-region replication, thao tác encrypted KMS, VPC endpoint
   theo giờ, giao request log — thường vô hình tới khi enabled.
</code></pre>

<p>Mỗi line item bạn thấy trên invoice map với một trong năm. Không label được cái nào trong năm đẩy $200 unexpected, thì không vá được — chỉ nhìn được.</p>

<h3>Giá cạnh nhau (đo 08/2026, list công khai)</h3>
<pre><code class="language-text">Line item                    R2 (Cloudflare)   S3 (AWS us-east-1)
──────────────────────────   ───────────────   ────────────────────
Storage (per GB-tháng)        $0.015            $0.023
Class A (per 1M op)           $4.50             $5.00
Class B (per 1M op)           $0.36             $0.40
Egress internet               $0.00             $0.09/GB
Egress region AWS khác        $0.00             $0.02/GB
Egress sang CloudFront        n/a               $0.00
Tier free hàng tháng          10 GB storage,    5 GB storage,
                              1M Class A,       2k Class A,
                              10M Class B,      20k Class B
                              zero egress       100 GB egress đầu
</code></pre>

<p>Hai điều bật lên. Thứ nhất, R2 rẻ hơn 35% storage. Thứ hai, R2 zero egress, và S3 tính $0.09/GB. Con số thứ hai gần như luôn là cái làm so R2 vs S3 lệch — vì với hầu hết workload thật (website, app, video, backing CDN), egress lấn át mọi thứ.</p>

<h3>Tiền thực sự đi đâu — ví dụ thật</h3>
<pre><code class="language-text">Một SaaS nhỏ, một tháng con số thật:

  Storage:           250 GB
  Upload:            45,000 PUT  (0.045 M Class A)
  Download:          6,200,000 GET  (6.2 M Class B)
  Egress:            820 GB  (thumbnail + download sang browser)

Trên S3 us-east-1:
  Storage         250 × $0.023   =   $5.75
  Class A         0.045 × $5.00  =   $0.23
  Class B         6.2 × $0.40    =   $2.48
  Egress          820 × $0.09    =  $73.80
  TỔNG                             $82.26  ← 90% là egress

Trên R2:
  Storage         250 × $0.015   =   $3.75
  Class A         0.045 × $4.50  =   $0.20
  Class B         6.2 × $0.36    =   $2.23
  Egress          820 × $0.00    =   $0.00
  TỔNG                             $6.18  ← rẻ 13×

Cùng workload. Khoảng cách hoàn toàn là egress.
</code></pre>

<p>Ví dụ trên buồn tẻ — app nhỏ. Scale lên startup phục vụ 20 TB/tháng video (app trung bình), bill S3 lên khoảng $1,842 khi R2 giữ khoảng $306. Ở 200 TB/tháng (app video nghiêm túc) S3 là $18,400 và R2 là $3,006. Khoảng cách dollar tuyệt đối lớn hơn; tỷ lệ giữ 6-13×.</p>

<h3>Khi R2 KHÔNG rẻ hơn</h3>
<pre><code class="language-text">Profile workload                Cost tốt hơn ở
──────────────────────────────  ─────────────
Cold archival, đọc hiếm          S3 Glacier Instant ($0.004/GB storage)
Zero egress (chỉ internal)       Hoà — nhưng S3 IntelligentTiering thắng qua tháng
Rate Class A rất lớn             Hoà — cùng $/M
CDN nặng qua CloudFront          Hoà (egress CF sang CloudFront free)
Kích thước nhỏ, app một region   Free tier S3 &gt; free tier R2
</code></pre>

<p>Chiến thắng R2 đến từ egress. Bỏ egress đi — hoặc vì không bao giờ egress (pipeline analytics internal) hoặc vì đã egress qua CloudFront (free từ S3) — và hai cái trong khoảng 30% nhau, đôi khi S3 dẫn nhẹ tuỳ mix operation.</p>

<h3>Bẫy Class A gần như mọi người rơi vào</h3>
<pre><code class="language-text">Job background list mọi object dưới prefix lớn hàng ngày:

  ListObjectsV2 page 1000 key mỗi lần.
  10M object = 10,000 page = 10,000 Class A op mỗi lượt.
  Hàng ngày = 300,000/tháng = 0.3 M Class A op chỉ để list.
  
  Cost:  0.3 × $4.50 = $1.35/tháng trên R2 (ổn)
         0.3 × $5.00 = $1.50/tháng trên S3 (ổn)
  
Nhưng scale job lên mỗi giờ:
  0.3 × 24 = 7.2 M Class A/tháng
  Cost:  7.2 × $4.50 = $32.40/tháng trên R2
         7.2 × $5.00 = $36.00/tháng trên S3
         
Và scale object lên 100M:
  72 M Class A/tháng = $324/tháng trên R2 để LIST bucket.
  Không byte nào di chuyển. Không data nào đụng. Chỉ list.
</code></pre>

<p>Line item mọi người để ý là storage. Line item thực sự gây spike bill là Class A từ list quá hăng hoặc scan lifecycle. Nếu report cost nhảy 3× qua đêm, nhìn Class A trước mọi thứ khác.</p>

<div class="pitfall">
<p><strong>Bẫy — giả định &quot;R2 free&quot; vì egress free.</strong> R2 vẫn bill storage, Class A, và Class B. Triệu lần đọc cùng avatar 1KB ổn trên cả hai service; triệu lần ghi là $5. Egress free là win lớn, nhưng là một trong năm line item, không phải tất cả.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — chỉ đọc figure storage trên dashboard.</strong> Dashboard R2 của Cloudflare hiện storage nổi bật và Class A/B ở section nhỏ hơn. AWS billing giấu cả hai dưới &quot;Requests&quot;. Mỗi tháng, check cả hai. Spike Class A từ script migration chạy trốn đã kết thúc nhiều free tier hơn storage từng làm.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bill object-storage là năm line item (storage, Class A ghi, Class B đọc, egress, phí infra) không phải một; win headline của R2 là zero-egress thường làm nó rẻ 6-13× so S3 cho app browser- và CDN-facing, nhưng trên workload chỉ-internal hoặc CloudFront-fronted hai cái trong 30% nhau, và cost driver nham hiểm nhất trên cả hai service là Class A từ LIST operation quá thường xuyên.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 pricing</span><span class="lc-sub">developers.cloudflare.com/r2/pricing — năm line item, theo thứ tự.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 pricing</span><span class="lc-sub">aws.amazon.com/s3/pricing — class request, tier egress, class storage.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — R2 vs S3 comparison</span><span class="lc-sub">blog.cloudflare.com/announcing-r2-object-storage — lập luận egress chi tiết.</span></span></div>
</div>
`,
    },


    {
      title: '7.2 — The thumbnail explosion|||7.2 — Vụ nổ thumbnail',
      slug: 'os-7-2-thumbnail-explosion',
      type: 'VIDEO',
      description: 'One user photo becomes 5-15 objects (variants, formats, sizes). What sounds like 10 GB of uploads becomes 100 GB of storage plus Class A on every generation.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>The thumbnail explosion</h2>
<p class="lead">A user uploads one 5 MB JPEG. Your app now has that JPEG, a WebP version, an AVIF version, three sizes of each (mobile/tablet/desktop), and maybe a blur placeholder. One upload turned into <em>ten</em> objects, each written with a Class A operation, and every future page load reads at least one of them. This ratio is a cost story disguised as a feature.</p>

<h3>Where the explosion comes from</h3>
<pre><code class="language-text">User uploads:  photo.jpg           5,240,000 bytes

Your image pipeline produces:
  photo-original.jpg                5,240,000    (kept for source)
  photo-320w.jpg                       31,000
  photo-640w.jpg                       94,000
  photo-1280w.jpg                     280,000
  photo-1920w.jpg                     580,000
  photo-320w.webp                      22,000
  photo-640w.webp                      68,000
  photo-1280w.webp                    198,000
  photo-1920w.webp                    412,000
  photo-320w.avif                      15,000
  photo-640w.avif                      44,000
  photo-1280w.avif                    128,000
  photo-1920w.avif                    268,000
  photo-blur-placeholder.jpg            2,000

TOTAL: 14 objects, 7,382,000 bytes  (41% overhead vs original)

Class A operations to create: 14 PUTs
Class A operations if you re-run pipeline: another 14
Class B operations per page view: 1-3 (depending on responsive picture)
</code></pre>

<p>The overhead in <em>bytes</em> is manageable — 41% is not shocking. The overhead in <em>operations</em> is the real story. Every re-upload, every pipeline change, every &quot;let's regenerate all thumbnails&quot; button adds another 14 PUTs per image. A photo album with 10,000 photos regenerated once is 140,000 Class A ops = $0.63 on R2. Regenerated weekly is $30/month. Regenerated daily is $210/month.</p>

<h3>The math on a real photo app</h3>
<pre><code class="language-text">Instagram-shape workload, monthly:

  New photo uploads:          200,000
  Variants per upload:            14
  Class A ops (uploads):    2,800,000  = 2.8 M
  Storage added:                 1.5 TB

  Regenerations (added a size): 200,000 × 14 = 2.8 M
  Class A ops (regen):        5,600,000  = 5.6 M total this month

  Total Class A cost R2:    8.4 × $4.50 = $37.80
  Total Class A cost S3:    8.4 × $5.00 = $42.00

  Storage after 1 year:  ~18 TB
  Storage cost R2:      $270/month
  Storage cost S3:      $414/month
</code></pre>

<p>The regeneration Class A is easy to miss. It shows up when a designer says &quot;we should add a 2560w variant&quot; and someone runs a script over the whole library. That single script run is a full Class A charge equivalent to a month of new uploads.</p>

<h3>Three ways to keep the explosion in check</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Generate on-demand, not on-upload</span><span class="lz-d">A Worker or edge function reads the original and produces the requested variant on first request, caches the result. Photos users never open never generate variants. Cloudflare Images and Vercel Image Optimization work this way. Trade: first request is slow (~200-500ms), subsequent requests are cached-fast.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Keep the variant count small</span><span class="lz-d">Three sizes covering most viewports (400w, 800w, 1600w) usually renders indistinguishably from five for the user, halves the storage, and saves 40% of Class A on every upload. Fewer AVIFs — the format is small enough that one AVIF often replaces two JPEGs.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Do not store the original if you don't need it</span><span class="lz-d">Kept-forever originals double storage. If your recovery story is &quot;the biggest variant is the source of truth&quot;, delete the original at ingest. Some apps keep it; many discover they never opened it in three years.</span></div>
</div>

<h3>On-demand vs pre-generated: the tradeoff table</h3>
<pre><code class="language-text">                          Pre-generate on upload   Generate on-demand
────────────────────────  ──────────────────────   ──────────────────
Storage                    1× × (variants + 1)      1× (only what read)
Class A on upload          14 per photo              1 per photo
Class A on read            0                         0 (Worker not S3 op)
Class B on read            1 (of 14 variants)        1 (of cached blob)
First-view latency         ~50ms (CDN)               ~200-500ms (compute)
Cache-warmed latency       ~50ms                     ~50ms
Cost when 90% of photos
are never viewed           14× waste                 ~0 waste
Cost when 100% of variants
are used every day         Cheaper (no compute)      Compute per generation
</code></pre>

<p>Almost every consumer app is closer to the &quot;90% of photos never viewed&quot; end of the spectrum, which is why on-demand generation is the modern default. Almost every batch pipeline (video encoding, print production) is on the &quot;100% used&quot; end, which is why pre-generation still wins for those.</p>

<h3>The other invisible multiplier: your app's read pattern</h3>
<pre><code class="language-text">Same 200,000 photos, one month, three read patterns:

  Read once per photo per month:
    200,000 GETs = 0.2M Class B = $0.07 (basically free)

  Feed reads: each photo appears in 40 feeds per day:
    200,000 × 40 × 30 = 240M GETs = $86.40/month

  Feed reads with 3-variant srcset:
    240M × 3 = 720M GETs = $259.20/month
</code></pre>

<p>The gap between &quot;photo library used lightly&quot; and &quot;photo library that hits a feed&quot; is three orders of magnitude in Class B. This is where a CDN in front of the bucket usually pays for itself — a Cloudflare cache hit is $0 in Class B, and R2 through the Cloudflare edge automatically caches, so most reads never touch the origin at all. On S3 the equivalent is CloudFront in front of the bucket.</p>

<div class="pitfall">
<p><strong>Trap — regenerating variants in a migration.</strong> A one-line pipeline change (&quot;now output AVIF too&quot;) plus a &quot;regenerate all&quot; script triggers 200,000 × N-new-variants PUTs. On R2 that is dollars, on S3 that is dollars, on either service that Class A charge shows up on next month's bill as a mystery. Roll variant additions out only for new uploads; regenerate lazily as photos are viewed.</p>
</div>

<div class="pitfall">
<p><strong>Trap — <code>Cache-Control</code> not set on variant PUTs.</strong> Without it, R2/S3 responses have short cache lifetimes and every viewer's browser refetches. On a hot feed that turns a $1/month asset into a $20/month asset in Class B. Always set <code>Cache-Control: public, max-age=31536000, immutable</code> on variants (they are content-addressed, so immutable is safe).</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Every user upload multiplies into 10-15 variant objects, and every regeneration multiplies Class A cost by the same factor; on-demand generation with a CDN cache in front (Cloudflare Images, Vercel, or a custom Worker) trades small first-view latency for near-zero storage-of-never-viewed-variants and near-zero Class B on subsequent reads, which for a typical consumer app is a 10-100× cost reduction over pre-generating everything on upload.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare Images — pricing</span><span class="lc-sub">developers.cloudflare.com/images/pricing — on-demand variants at $5/100k images stored.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vercel — Image Optimization</span><span class="lc-sub">vercel.com/docs/image-optimization — on-demand pattern.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — srcset and responsive images</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset — why apps generate many sizes.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Vụ nổ thumbnail</h2>
<p class="lead">Một user upload một JPEG 5 MB. App của bạn giờ có JPEG đó, một bản WebP, một bản AVIF, ba size mỗi cái (mobile/tablet/desktop), và có thể một blur placeholder. Một upload biến thành <em>mười</em> object, mỗi cái viết bằng một Class A operation, và mỗi page load tương lai đọc ít nhất một trong số đó. Tỷ lệ này là câu chuyện cost trá hình thành feature.</p>

<h3>Vụ nổ đến từ đâu</h3>
<pre><code class="language-text">User upload:  photo.jpg           5,240,000 byte

Pipeline ảnh của bạn tạo:
  photo-original.jpg                5,240,000    (giữ source)
  photo-320w.jpg                       31,000
  photo-640w.jpg                       94,000
  photo-1280w.jpg                     280,000
  photo-1920w.jpg                     580,000
  photo-320w.webp                      22,000
  photo-640w.webp                      68,000
  photo-1280w.webp                    198,000
  photo-1920w.webp                    412,000
  photo-320w.avif                      15,000
  photo-640w.avif                      44,000
  photo-1280w.avif                    128,000
  photo-1920w.avif                    268,000
  photo-blur-placeholder.jpg            2,000

TỔNG: 14 object, 7,382,000 byte  (overhead 41% vs gốc)

Class A op để tạo: 14 PUT
Class A op nếu re-run pipeline: thêm 14
Class B op mỗi page view: 1-3 (tuỳ responsive picture)
</code></pre>

<p>Overhead theo <em>byte</em> quản được — 41% không sốc. Overhead theo <em>op</em> mới là câu chuyện thật. Mỗi re-upload, mỗi pipeline thay đổi, mỗi nút &quot;regenerate all thumbnail&quot; thêm 14 PUT nữa per ảnh. Album 10,000 ảnh regenerate một lần là 140,000 Class A op = $0.63 trên R2. Regenerate hàng tuần là $30/tháng. Regenerate hàng ngày là $210/tháng.</p>

<h3>Toán trên app ảnh thật</h3>
<pre><code class="language-text">Workload hình Instagram, hàng tháng:

  Upload ảnh mới:            200,000
  Variant per upload:             14
  Class A op (upload):     2,800,000  = 2.8 M
  Storage thêm:                  1.5 TB

  Regeneration (thêm size): 200,000 × 14 = 2.8 M
  Class A op (regen):       5,600,000  = 5.6 M tổng tháng này

  Tổng Class A cost R2:    8.4 × $4.50 = $37.80
  Tổng Class A cost S3:    8.4 × $5.00 = $42.00

  Storage sau 1 năm:  ~18 TB
  Storage cost R2:    $270/tháng
  Storage cost S3:    $414/tháng
</code></pre>

<p>Regeneration Class A dễ bỏ sót. Nó hiện khi designer nói &quot;nên thêm variant 2560w&quot; và ai đó chạy script trên toàn library. Một script run đó là charge Class A đầy đủ tương đương một tháng upload mới.</p>

<h3>Ba cách kiểm vụ nổ</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sinh on-demand, không on-upload</span><span class="lz-d">Worker hoặc edge function đọc gốc và tạo variant yêu cầu ở request đầu, cache kết quả. Ảnh user không bao giờ mở không bao giờ sinh variant. Cloudflare Images và Vercel Image Optimization làm cách này. Đánh đổi: request đầu chậm (~200-500ms), subsequent request cached-fast.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Giữ số variant nhỏ</span><span class="lz-d">Ba size bao hầu hết viewport (400w, 800w, 1600w) thường render không phân biệt được so năm với user, chia đôi storage, và tiết kiệm 40% Class A trên mỗi upload. Ít AVIF hơn — format nhỏ đủ nên một AVIF thường thay hai JPEG.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đừng lưu gốc nếu không cần</span><span class="lz-d">Gốc giữ mãi mãi gấp đôi storage. Nếu recovery story là &quot;variant lớn nhất là nguồn sự thật&quot;, xoá gốc ở ingest. Một số app giữ; nhiều app phát hiện chưa mở nó ba năm.</span></div>
</div>

<h3>On-demand vs pre-generate: bảng đánh đổi</h3>
<pre><code class="language-text">                          Pre-generate on upload   Generate on-demand
────────────────────────  ──────────────────────   ──────────────────
Storage                    1× × (variant + 1)       1× (chỉ cái đọc)
Class A on upload          14 per ảnh                1 per ảnh
Class A on read            0                         0 (Worker không S3 op)
Class B on read            1 (của 14 variant)        1 (của cached blob)
Latency first-view         ~50ms (CDN)               ~200-500ms (compute)
Latency cache-warmed       ~50ms                     ~50ms
Cost khi 90% ảnh không
được view                  Lãng phí 14×              Lãng phí ~0
Cost khi 100% variant
dùng mỗi ngày              Rẻ hơn (không compute)   Compute per generation
</code></pre>

<p>Gần như mọi app consumer gần đầu &quot;90% ảnh không view&quot; của spectrum, đó là lý do sinh on-demand là default hiện đại. Gần như mọi batch pipeline (encoding video, print production) gần đầu &quot;100% dùng&quot;, đó là lý do pre-generation vẫn thắng cho những cái đó.</p>

<h3>Multiplier vô hình khác: pattern đọc của app</h3>
<pre><code class="language-text">Cùng 200,000 ảnh, một tháng, ba pattern đọc:

  Đọc một lần per ảnh per tháng:
    200,000 GET = 0.2M Class B = $0.07 (cơ bản free)

  Đọc feed: mỗi ảnh xuất hiện trong 40 feed một ngày:
    200,000 × 40 × 30 = 240M GET = $86.40/tháng

  Đọc feed với srcset 3-variant:
    240M × 3 = 720M GET = $259.20/tháng
</code></pre>

<p>Khoảng cách giữa &quot;library ảnh dùng nhẹ&quot; và &quot;library ảnh hit feed&quot; là ba bậc order Class B. Đây là chỗ CDN trước bucket thường tự trả tiền — cache hit Cloudflare là $0 Class B, và R2 qua edge Cloudflare tự động cache, nên hầu hết read không đụng origin nào. Trên S3 tương đương là CloudFront trước bucket.</p>

<div class="pitfall">
<p><strong>Bẫy — regenerate variant trong migration.</strong> Pipeline thay đổi một dòng (&quot;giờ output AVIF nữa&quot;) cộng script &quot;regenerate all&quot; trigger 200,000 × N-variant-mới PUT. Trên R2 là dollar, trên S3 là dollar, trên cả hai service charge Class A đó hiện trên bill tháng tới như bí ẩn. Roll out thêm variant chỉ cho upload mới; regenerate lười khi ảnh được view.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>Cache-Control</code> không set trên PUT variant.</strong> Không có, R2/S3 response có cache lifetime ngắn và browser mỗi viewer refetch. Trên feed hot điều đó biến asset $1/tháng thành asset $20/tháng Class B. Luôn set <code>Cache-Control: public, max-age=31536000, immutable</code> trên variant (chúng content-addressed, nên immutable an toàn).</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Mỗi upload user nhân thành 10-15 object variant, và mỗi regeneration nhân cost Class A với cùng hệ số; sinh on-demand với CDN cache trước (Cloudflare Images, Vercel, hoặc Worker tự) đánh đổi latency first-view nhỏ lấy near-zero storage-của-variant-không-view và near-zero Class B trên subsequent read, mà với app consumer điển hình là giảm cost 10-100× so pre-generate mọi thứ on-upload.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare Images — pricing</span><span class="lc-sub">developers.cloudflare.com/images/pricing — variant on-demand $5/100k ảnh lưu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vercel — Image Optimization</span><span class="lc-sub">vercel.com/docs/image-optimization — pattern on-demand.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — srcset và responsive image</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset — vì sao app sinh nhiều size.</span></span></div>
</div>
`,
    },


    {
      title: '7.3 — Budgets, alerts, and post-incident forensics|||7.3 — Budget, alert, và forensic sau incident',
      slug: 'os-7-3-budgets',
      type: 'VIDEO',
      description: 'You never see the runaway migration script until the bill lands. Set a $ ceiling that pages you, add a Class A alarm, and store one month of request logs so post-mortems are possible.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Budgets, alerts, and post-incident forensics</h2>
<p class="lead">A junior dev writes a script that lists a 100M-object bucket in a loop while debugging. It sits running over a weekend. Monday's Slack has a $340 Class A charge and no explanation. If you have not set a spend alert, this is your Monday. The tools to prevent it are small, obvious, and every account should turn them on the day the bucket is created.</p>

<h3>The three layers of defense</h3>
<pre><code class="language-text">Layer                Where                What it catches
──────────────────  ───────────────────  ────────────────────────
Budget alert         Cloud billing panel   Total $ over N per period
Metric alarm         Metrics/CloudWatch    Class A rate over threshold
Request logging      Bucket audit setting  &quot;WHO called this many times&quot;
</code></pre>

<p>Budget alert catches the outcome (you spent too much). Metric alarm catches the cause in progress (someone is calling too often). Request logging catches the culprit after the fact (which token, which IP, which prefix). Skip any one of them and you lose one of the three answers you need in an incident.</p>

<h3>Layer 1 — the budget alert (5 minutes)</h3>
<pre><code class="language-text">On Cloudflare:
  Dashboard -&gt; Account Home -&gt; Billing -&gt; Notifications
  Add: "email me when R2 usage exceeds $50/month projected"
  Add: "email me when R2 usage exceeds $150/month projected"
  Add: "email me when R2 usage exceeds $300/month actual"
  
  Three thresholds intentionally — early warning, mid warning,
  and a &quot;something is very wrong&quot; alarm.

On AWS:
  Billing -&gt; Budgets -&gt; Create budget -&gt; Cost budget
  Amount: $200, monthly
  Alert: 80% actual  -&gt; SNS topic  -&gt; ops-pager email
  Alert: 100% actual -&gt; SNS topic  -&gt; ops-pager phone
  Alert: 100% forecast -&gt; SNS topic -&gt; ops-slack channel
</code></pre>

<p>The trick is picking the number. Take last month's steady-state, multiply by 1.5, and use that as the first alarm. Then multiply again by 1.5 for the pager alarm. The goal is not to be right; it is to hear about a doubling within days, not weeks.</p>

<h3>Layer 2 — the rate alarm (catches it while it's happening)</h3>
<pre><code class="language-text">Cloudflare Analytics for R2:
  Metric: &quot;Class A ops per minute&quot;
  Baseline: your app steady-state (e.g. 400 ops/min)
  Alarm threshold: 5× baseline (2,000 ops/min) for 15 minutes
  
  A migration script easily hits 20,000 ops/min. The alarm fires
  in the first 15 minutes, not on next month's bill.

AWS CloudWatch on S3:
  Metric: AllRequests, or PutRequests / GetRequests separately
  Statistic: Sum, period 1 minute
  Threshold: static, based on your baseline × 5-10
  Action: SNS -&gt; PagerDuty or Slack
</code></pre>

<p>The rate alarm is the only defense that catches a runaway script <em>while</em> it is running. Budget alerts are trailing — they page you after the money is spent. The alarm gives you a chance to kill the script before it finishes.</p>

<h3>Layer 3 — request logging (the forensic tool)</h3>
<pre><code class="language-text">R2 request logging (as of 2026): pipe events to
  Logpush -&gt; Cloudflare R2 (yes, another bucket) or S3-compatible sink
  
Each event carries:
  - timestamp
  - method (GET/PUT/HEAD/LIST/DELETE)
  - key
  - source IP
  - user-agent
  - HTTP status
  - bytes transferred
  - token used (which R2 API token authenticated)

S3 has this in two flavors:
  - S3 Server Access Logs (older, delayed, less structured)
  - S3 Object-Level API Logging via CloudTrail (real-time, structured, expensive)
</code></pre>

<p>Store logs for at least 30 days. When the mystery Class A charge happens, you grep the logs by hour, count operations per token, and within 5 minutes you know: <em>token</em> <code>ci-migration-2026-08</code> <em>made 4.2 million LIST calls between Friday 18:00 and Sunday 22:00</em>. Now you know who to talk to. Without logs, you never find out.</p>

<h3>What the query looks like after an incident</h3>
<pre><code class="language-bash"># Assume logs are landed as JSON in another R2 bucket at logs/r2/YYYY/MM/DD/HH.json.gz
# One month of logs for a small app is ~800 MB compressed.

zcat logs/r2/2026/08/*.json.gz \\
  | jq -r 'select(.method=="LIST") | .token + "\\t" + .prefix + "\\t" + (.responseBytes|tostring)' \\
  | awk -F'\\t' '{count[$1]++} END {for (t in count) print count[t], t}' \\
  | sort -rn | head -10
</code></pre>
<div class="out">
<pre><code class="language-text">4,217,880   ci-migration-2026-08
   84,213   app-primary
   12,401   backup-worker
    3,102   admin-dashboard
      412   dev-cuong</code></pre>
</div>

<p>Four million LIST operations from one token, an order of magnitude above the next-biggest caller. That is the incident. Rotate the token, kill the script, add the alarm you wish you had had.</p>

<h3>The one-page runbook</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">When budget alert fires: check Analytics</span><span class="lz-d">Open the R2/S3 metrics page. Look at Class A ops/min over the past week. A visible cliff or step function is the signal — a smooth-growth ramp is genuine traffic growth, and you want to raise the budget rather than react.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">When rate alarm fires: check logs immediately</span><span class="lz-d">Run the token-by-count query on the last hour of logs. The top token is almost always the culprit. Confirm with the person or system that owns the token, then rotate or revoke.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">After incident: raise a rate alarm one baseline below what fired</span><span class="lz-d">If the alarm fired at 20,000 ops/min but the runaway was actually visible at 8,000, lower the threshold. You want to catch the next one at the earlier warning, not the emergency.</span></div>
</div>

<h3>Real numbers on log storage cost</h3>
<pre><code class="language-text">Logging a busy R2 bucket for 30 days:
  200 M operations/month
  ~250 bytes per event (compressed JSON)
  ~50 GB log data
  Storage cost:  50 × $0.015 = $0.75/month
  Class A on log writes: 200M events / ~1000 events per batch object
    = 200k Class A ops = 0.2 × $4.50 = $0.90/month
  
  Total logging cost:  $1.65/month
  Value on the one incident it catches:  $300+
</code></pre>

<p>Logging pays for itself the first time it prevents or explains an incident. On accounts with a real workload, that is once a quarter minimum — usually more often.</p>

<div class="pitfall">
<p><strong>Trap — budget alert set on &quot;forecast&quot; only.</strong> Forecast is a moving guess; a sudden spike may not be extrapolated fast enough to trip. Always pair a forecast alarm with an <em>actual</em> alarm at 100% of your ceiling — that fires the moment you cross, not when the math says you might.</p>
</div>

<div class="pitfall">
<p><strong>Trap — logging into the same bucket you're logging.</strong> The log writes are themselves Class A ops, and their events would be logged, which produce more writes… a small self-amplification loop. Log into a separate bucket, and exclude that bucket from its own logging config if the tool asks.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Set three defenses on every bucket the day it is created: a budget alert (page you when spend exceeds your steady state × 1.5), a rate alarm (page you when Class A ops/min exceeds baseline × 5 for 15+ minutes), and request logging piped to a separate bucket for 30 days (so you can query &quot;which token did this&quot; after an incident); combined they cost under $2/month and prevent the four-digit charges that any of the three alone might miss.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Billing notifications</span><span class="lc-sub">developers.cloudflare.com/billing/notifications — email + webhook thresholds.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — Cost budgets</span><span class="lc-sub">docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html — SNS action targets.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — R2 Logpush</span><span class="lc-sub">developers.cloudflare.com/logs/logpush/logpush-job/datasets/r2 — event schema.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — S3 Server Access Logging</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/ServerLogs.html — delayed logs, cheap.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Budget, alert, và forensic sau incident</h2>
<p class="lead">Một dev junior viết script list bucket 100M object trong loop khi debug. Nó chạy suốt cuối tuần. Slack sáng thứ Hai có charge Class A $340 và không lời giải thích. Không set alert chi tiêu, đây là thứ Hai của bạn. Tool ngăn nó nhỏ, hiển nhiên, và mọi account nên bật ngày bucket được tạo.</p>

<h3>Ba lớp phòng thủ</h3>
<pre><code class="language-text">Lớp                  Nơi                  Bắt gì
──────────────────  ───────────────────  ────────────────────────
Alert budget         Panel billing cloud   Tổng $ vượt N theo kỳ
Alarm metric         Metrics/CloudWatch    Rate Class A vượt threshold
Log request          Setting audit bucket  &quot;AI gọi nhiều thế này&quot;
</code></pre>

<p>Alert budget bắt kết quả (bạn tiêu quá). Alarm metric bắt nguyên nhân đang diễn (ai đó gọi quá thường). Log request bắt thủ phạm sau khi việc xảy (token nào, IP nào, prefix nào). Bỏ bất kỳ cái nào là mất một trong ba câu trả lời bạn cần trong incident.</p>

<h3>Lớp 1 — alert budget (5 phút)</h3>
<pre><code class="language-text">Trên Cloudflare:
  Dashboard -&gt; Account Home -&gt; Billing -&gt; Notifications
  Add: "email tôi khi usage R2 vượt $50/tháng projected"
  Add: "email tôi khi usage R2 vượt $150/tháng projected"
  Add: "email tôi khi usage R2 vượt $300/tháng actual"
  
  Ba threshold cố ý — cảnh báo sớm, cảnh báo giữa,
  và alarm &quot;có gì đó sai lắm&quot;.

Trên AWS:
  Billing -&gt; Budgets -&gt; Create budget -&gt; Cost budget
  Amount: $200, hàng tháng
  Alert: 80% actual  -&gt; SNS topic  -&gt; ops-pager email
  Alert: 100% actual -&gt; SNS topic  -&gt; ops-pager phone
  Alert: 100% forecast -&gt; SNS topic -&gt; ops-slack channel
</code></pre>

<p>Mẹo là chọn số. Lấy steady-state tháng trước, nhân 1.5, và dùng làm alarm đầu. Rồi nhân 1.5 tiếp cho alarm pager. Mục đích không phải đúng; mà là nghe về nhân đôi trong ngày, không phải tuần.</p>

<h3>Lớp 2 — alarm rate (bắt khi đang xảy)</h3>
<pre><code class="language-text">Cloudflare Analytics cho R2:
  Metric: &quot;Class A op mỗi phút&quot;
  Baseline: steady-state app (vd 400 op/phút)
  Threshold alarm: 5× baseline (2,000 op/phút) trong 15 phút
  
  Script migration dễ hit 20,000 op/phút. Alarm fire
  trong 15 phút đầu, không phải trên bill tháng tới.

AWS CloudWatch trên S3:
  Metric: AllRequests, hoặc PutRequests / GetRequests riêng
  Statistic: Sum, period 1 phút
  Threshold: static, dựa baseline × 5-10
  Action: SNS -&gt; PagerDuty hoặc Slack
</code></pre>

<p>Alarm rate là phòng thủ duy nhất bắt script chạy trốn <em>khi</em> đang chạy. Alert budget là trailing — page bạn sau khi tiền tiêu. Alarm cho cơ hội giết script trước khi xong.</p>

<h3>Lớp 3 — log request (tool forensic)</h3>
<pre><code class="language-text">Log request R2 (tính đến 2026): pipe event tới
  Logpush -&gt; R2 Cloudflare (đúng, bucket khác) hoặc sink S3-compat
  
Mỗi event mang:
  - timestamp
  - method (GET/PUT/HEAD/LIST/DELETE)
  - key
  - IP source
  - user-agent
  - HTTP status
  - byte transfer
  - token dùng (token API R2 nào authenticate)

S3 có ở hai dạng:
  - S3 Server Access Log (cũ hơn, trễ, ít structured)
  - Log API Object-Level S3 qua CloudTrail (real-time, structured, đắt)
</code></pre>

<p>Lưu log ít nhất 30 ngày. Khi charge Class A bí ẩn xảy, bạn grep log theo giờ, đếm op per token, và trong 5 phút bạn biết: <em>token</em> <code>ci-migration-2026-08</code> <em>gọi 4.2 triệu LIST giữa thứ Sáu 18:00 và Chủ nhật 22:00</em>. Giờ biết nói chuyện với ai. Không log, không bao giờ tìm ra.</p>

<h3>Query trông thế nào sau incident</h3>
<pre><code class="language-bash"># Giả sử log land dạng JSON ở bucket R2 khác tại logs/r2/YYYY/MM/DD/HH.json.gz
# Một tháng log cho app nhỏ ~800 MB nén.

zcat logs/r2/2026/08/*.json.gz \\
  | jq -r 'select(.method=="LIST") | .token + "\\t" + .prefix + "\\t" + (.responseBytes|tostring)' \\
  | awk -F'\\t' '{count[$1]++} END {for (t in count) print count[t], t}' \\
  | sort -rn | head -10
</code></pre>
<div class="out">
<pre><code class="language-text">4,217,880   ci-migration-2026-08
   84,213   app-primary
   12,401   backup-worker
    3,102   admin-dashboard
      412   dev-cuong</code></pre>
</div>

<p>Bốn triệu LIST op từ một token, một order độ lớn trên caller lớn thứ nhì. Đó là incident. Xoay token, giết script, thêm alarm bạn ước đã có.</p>

<h3>Runbook một trang</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Khi alert budget fire: check Analytics</span><span class="lz-d">Mở page metric R2/S3. Nhìn Class A op/phút tuần qua. Cliff hoặc step function nhìn thấy là tín hiệu — smooth-growth ramp là traffic thật tăng, và bạn muốn tăng budget hơn phản ứng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Khi alarm rate fire: check log ngay</span><span class="lz-d">Chạy query token-by-count trên giờ log gần nhất. Token top gần như luôn là thủ phạm. Xác nhận với người hoặc hệ sở hữu token, rồi xoay hoặc revoke.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Sau incident: dựng alarm rate thấp một baseline dưới cái fire</span><span class="lz-d">Nếu alarm fire ở 20,000 op/phút nhưng runaway thực sự nhìn thấy ở 8,000, hạ threshold. Muốn bắt cái sau ở cảnh báo sớm hơn, không phải emergency.</span></div>
</div>

<h3>Con số thật về cost lưu log</h3>
<pre><code class="language-text">Log bucket R2 bận trong 30 ngày:
  200 M op/tháng
  ~250 byte per event (JSON nén)
  ~50 GB data log
  Cost storage:  50 × $0.015 = $0.75/tháng
  Class A trên log write: 200M event / ~1000 event per batch object
    = 200k Class A op = 0.2 × $4.50 = $0.90/tháng
  
  Tổng cost log:  $1.65/tháng
  Giá trị trên incident nó bắt được:  $300+
</code></pre>

<p>Log tự trả tiền lần đầu ngăn hoặc giải thích incident. Trên account có workload thật, đó là một lần mỗi quý tối thiểu — thường thường xuyên hơn.</p>

<div class="pitfall">
<p><strong>Bẫy — alert budget set chỉ trên &quot;forecast&quot;.</strong> Forecast là guess di động; spike đột ngột có thể không extrapolate đủ nhanh để trip. Luôn cặp alarm forecast với alarm <em>actual</em> ở 100% trần — nó fire khoảnh khắc bạn vượt, không phải khi toán nói bạn có thể.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — log vào cùng bucket đang log.</strong> Write log là Class A op, và event của chúng sẽ được log, tạo thêm write… vòng lặp self-amplification nhỏ. Log vào bucket riêng, và loại bucket đó khỏi config log của chính nó nếu tool hỏi.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Set ba phòng thủ trên mọi bucket ngày tạo: alert budget (page bạn khi tiêu vượt steady state × 1.5), alarm rate (page bạn khi Class A op/phút vượt baseline × 5 trong 15+ phút), và log request pipe tới bucket riêng 30 ngày (để query &quot;token nào làm cái này&quot; sau incident); kết hợp tốn dưới $2/tháng và ngăn charge bốn chữ số mà bất kỳ một trong ba có thể miss.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Billing notifications</span><span class="lc-sub">developers.cloudflare.com/billing/notifications — threshold email + webhook.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — Cost budgets</span><span class="lc-sub">docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html — target action SNS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — R2 Logpush</span><span class="lc-sub">developers.cloudflare.com/logs/logpush/logpush-job/datasets/r2 — schema event.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — S3 Server Access Logging</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/ServerLogs.html — log trễ, rẻ.</span></span></div>
</div>
`,
    },

    {
      title: '7.4 — Chapter 7 quiz|||7.4 — Kiểm tra Chương 7',
      slug: 'os-7-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu về cost model, thumbnail, và alarm.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 7 · Quiz</span><h2>What Chapter 7 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 7 · Kiểm tra</span><h2>Chương 7 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 400,
        questions: [
          {
            question: 'App on S3 shows 250 GB storage, 820 GB monthly egress, bill $82. R2 estimate for same workload?|||App trên S3 hiện 250 GB storage, 820 GB egress/tháng, bill $82. Ước R2 cho cùng workload?',
            options: [
              '~$6/month. R2 storage is $0.015/GB (35% less) but the entire gap is the $73.80 of S3 egress ($0.09 × 820 GB) — R2 charges $0 for egress, so the same reads produce no egress line item. Gap grows in absolute dollars with scale but stays 6-13× ratio.|||~$6/tháng. Storage R2 là $0.015/GB (kém 35%) nhưng toàn khoảng cách là $73.80 egress S3 ($0.09 × 820 GB) — R2 charge $0 egress, nên cùng read không sinh line item egress. Khoảng cách lớn hơn theo dollar tuyệt đối khi scale nhưng giữ tỷ lệ 6-13×.',
              '~$80/month (similar)|||~$80/tháng (tương tự)',
              '~$0 (R2 is free)|||~$0 (R2 free)',
              '~$150/month (R2 is more expensive)|||~$150/tháng (R2 đắt hơn)',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Photo app suddenly ran a script that regenerated all 200,000 photo variants (14 per photo). Class A cost?|||App ảnh đột nhiên chạy script regenerate mọi variant của 200,000 ảnh (14 per ảnh). Cost Class A?',
            options: [
              '2.8M Class A ops × $4.50/M on R2 = $12.60 one-time; same script rerun weekly is $50.40/month. On S3 slightly more ($5.00/M). Regeneration ops hide in Class A and only surface on next month\'s bill — visible in per-token log query, not in storage dashboard.|||2.8M Class A op × $4.50/M trên R2 = $12.60 một lần; cùng script rerun hàng tuần là $50.40/tháng. Trên S3 hơn nhẹ ($5.00/M). Regeneration op giấu trong Class A và chỉ hiện trên bill tháng tới — thấy được trong query log per-token, không phải dashboard storage.',
              'Free — read operations only|||Free — chỉ read op',
              'Depends on storage size only|||Chỉ phụ thuộc size storage',
              'Nothing — R2 has no Class A|||Không gì — R2 không Class A',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Cost dashboard shows mystery $300 Class A spike over the weekend. First diagnostic step?|||Dashboard cost hiện spike Class A bí ẩn $300 cuối tuần. Bước chẩn đoán đầu?',
            options: [
              'Query request logs (Logpush on Cloudflare / CloudTrail on AWS) grouped by token, sorted by count. The runaway is almost always one token an order of magnitude above the next-biggest. That names the caller — rotate the token or kill the script. Without logs, you never find out.|||Query log request (Logpush trên Cloudflare / CloudTrail trên AWS) group theo token, sort theo count. Runaway gần như luôn là một token một order độ lớn trên caller lớn thứ nhì. Đó tên caller — xoay token hoặc giết script. Không log, không bao giờ tìm ra.',
              'Delete the bucket|||Xoá bucket',
              'Contact support|||Liên hệ support',
              'Wait until next month|||Chờ tháng sau',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'You have variant generation on-upload, all photos regenerated on every pipeline change. Best switch to reduce cost?|||Có sinh variant on-upload, mọi ảnh regenerate mỗi pipeline thay đổi. Chuyển tốt nhất để giảm cost?',
            options: [
              'Switch to on-demand generation (Worker / Cloudflare Images / Vercel Image Optimization): each variant created only when first requested, cached at edge. Photos that are never viewed produce zero variants, so storage drops proportionally and Class A on pipeline changes drops to zero. Trade: ~200-500ms latency on first view per variant.|||Chuyển sang sinh on-demand (Worker / Cloudflare Images / Vercel Image Optimization): mỗi variant tạo chỉ khi request đầu, cache ở edge. Ảnh không bao giờ view sinh zero variant, nên storage tụt tỷ lệ và Class A trên pipeline thay đổi tụt về zero. Đánh đổi: ~200-500ms latency ở view đầu per variant.',
              'Add more variants|||Thêm variant',
              'Store two copies for redundancy|||Lưu hai bản redundancy',
              'Move to S3|||Chuyển sang S3',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
