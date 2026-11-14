import G07_1 from './giang/obj-07-1.mjs';
import G07_2 from './giang/obj-07-2.mjs';
import G07_3 from './giang/obj-07-3.mjs';
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
${G07_1}
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

<h3>Prices side-by-side (re-read 15/11/2026: AWS Price List published 2026-11-09, R2 pricing page — unchanged since 08/2026)</h3>
<pre><code class="language-text">Line item                    R2 (Cloudflare)   S3 (AWS us-east-1)
──────────────────────────   ───────────────   ────────────────────
Storage (per GB-month)        $0.015            $0.023
Class A (per 1M ops)          $4.50             $5.00
Class B (per 1M ops)          $0.36             $0.40
Egress to internet            $0.00             $0.09/GB
Egress to other AWS region    $0.00             $0.02/GB
Egress to CloudFront          n/a               $0.00
Free monthly allowance        10 GB storage,    first 100 GB egress/month;
                              1M Class A,       new accounts get a credit
                              10M Class B,      plan instead of fixed S3
                              zero egress       quotas (aws.amazon.com/free)
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

<p>The example above is the bill <em>without</em> free allowances (re-computed today: $82.25 vs $6.18). With them — S3's 100 GB of free egress, R2's 10 GB / 1 M Class A / 10 M Class B — it is <strong>$73.25 vs $3.60, about 20×</strong>, and egress is 88% of the S3 bill. Scaled to a video app that stores and serves 20 TB a month, today's prices give <strong>$2,224 vs $312 (×7.1)</strong>. (An earlier version quoted &quot;$1,842 vs $306&quot; and a 200 TB line without stating how much was stored; both are replaced by the measured run below.)</p>

<h3>Where R2 is NOT cheaper</h3>
<pre><code class="language-text">Workload profile                Better cost on
──────────────────────────────  ─────────────
Cold archival, rare read         S3 Glacier Instant ($0.004/GB storage)
Zero egress (all internal only)  R2 still ahead, by less: ×2.2 measured in 2.1
Massive Class A rate             About tied: ×1.1 measured in 2.1
Heavy CloudFront-fronted CDN     Tied (CF egress to CloudFront is free)
Small size, one-region app       R2 (its free allowance is the larger one)
</code></pre>

<p>R2's win comes from egress. Take egress away — either because you never egress (internal analytics pipeline) or because you already egress through CloudFront (which is free from S3) — and the gap shrinks to between ×1.1 and ×2.2 depending on the operation mix (measured in lesson 2.1) — R2 stays ahead on storage price, but no longer by an order of magnitude.</p>

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
<p><strong>Trap — reading only the storage figure on the dashboard.</strong> R2's per-bucket <em>Metrics</em> tab breaks operations down by type (the <code>r2OperationsAdaptiveGroups</code> dataset); AWS billing groups both classes under &quot;Requests&quot;. Every month, check both. A Class A spike from a runaway migration script has ended more free tiers than storage ever did.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Object-storage bills are five line items (storage, Class A writes, Class B reads, egress, infra fees) not one; R2's headline win is zero-egress which made it 7–20× cheaper than S3 in this lesson's measured examples for browser- and CDN-facing apps, but without egress the gap shrinks to ×1.1–×2.2, and the sneakiest cost driver on either service is Class A from over-frequent LIST operations.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Pull one month of real usage from the R2 dashboard (Metrics) or your billing API: storage GB-month, Class A count, Class B count, egress GB.</li>
<li>Compute the R2 bill by hand: storage GB &times; $0.015 + Class A (per million &times; $4.50) + Class B (per million &times; $0.36); egress is $0.</li>
<li>Compute the SAME traffic on S3: storage &times; $0.023 + egress GB &times; $0.09 + Class A/B at S3 rates. Write down the ratio R2 : S3.</li>
<li>Find your single biggest line item. If it is Class A, grep the code for <code>ListObjectsV2</code> / LIST calls on a hot path and move that tracking into the database.</li>
</ol>
<p><strong>Done when:</strong> you have two monthly totals (R2 vs S3) and can name the one line item that dominates each.</p></div>

<h3>🔬 Measured: today's prices, and the LIST trap on MinIO</h3>
<p>Prices read on 15/11/2026 from the AWS Price List API and the R2 pricing page (nothing touches a real account), then the lesson's bills recomputed with and without free allowances:</p>
<div class="out">$ node hoa-don.mjs
AWS công bố 2026-11-09: lưu $0.023/GB · Class A $5.00/triệu · Class B $0.40/triệu · ra internet $0.09 → $0.085 → $0.07/GB (bậc 0–10 TB, tới 50 TB …; 100 GB/tháng đầu miễn phí) · sang vùng khác $0.02/GB · sang CloudFront $0/GB
S3 Glacier Instant Retrieval: lưu $0.004/GB-tháng (lưu trữ lạnh, đọc hiếm)
R2 (làm tròn): If you have performed one million and one operations, you will be billed for two million operations.
SaaS nhỏ (250 GB, 45k PUT, 6,2 tr GET, 820 GB ra) KHÔNG miễn phí  S3 $   82.25 (lưu 5.75 · A 0.22 · B 2.48 · egress 73.80)  ⇒  R2 $   6.18  ×13.3
SaaS nhỏ (250 GB, 45k PUT, 6,2 tr GET, 820 GB ra) CÓ miễn phí   S3 $   73.25 (lưu 5.75 · A 0.22 · B 2.48 · egress 64.80)  ⇒  R2 $   3.60  ×20.3
   phần egress trong hoá đơn S3: 88%
Video 20 TB lưu + 20 TB ra/tháng (giả định lưu = ra) KHÔNG miễn phí  S3 $ 2224.20 (lưu 460.00 · A 5.00 · B 8.00 · egress 1751.20)  ⇒  R2 $ 311.70  ×7.1
Video 20 TB lưu + 20 TB ra/tháng (giả định lưu = ra) CÓ miễn phí   S3 $ 2215.70 (lưu 460.00 · A 5.00 · B 8.00 · egress 1742.70)  ⇒  R2 $ 303.45  ×7.3
   phần egress trong hoá đơn S3: 79%</div>
<p>Then the LIST trap, measured: a bucket of 2,000 objects on MinIO, 400 files to sync, three ways to ask &quot;is it already there?&quot;. A middleware counts every request the SDK actually sends (SDK v3 3.1071.0, Node 22.23.3):</p>
<div class="out">$ node ton-tai.mjs dung
đã dựng 2.000 object
$ node ton-tai.mjs
① LIST Prefix=key mỗi tệp          đã có 200 · ListObjectsV2×400 ⇒ A 400 · B 0 · 990 ms
② HEAD mỗi tệp                     đã có 200 · HeadObject×400 ⇒ A 0 · B 400 · 743 ms
③ LIST một lần (cả prefix) + Set   đã có 200 · ListObjectsV2×2 ⇒ A 2 · B 0 · 79 ms
xin MaxKeys 5000 ⇒ nhận 1000 khoá/trang (trần 1.000) · IsTruncated true
$ node nhan.mjs
① LIST mỗi tệp (50.000 tệp)    mỗi lượt A  50000 B      0 · mỗi tháng (720 lượt) A 36.00 tr · B 0.00 tr ⇒ $162.00
② HEAD mỗi tệp (50.000 tệp)    mỗi lượt A      0 B  50000 · mỗi tháng (720 lượt) A 0.00 tr · B 36.00 tr ⇒ $12.96
③ LIST một lần (50 trang)      mỗi lượt A     50 B      0 · mỗi tháng (720 lượt) A 0.04 tr · B 0.00 tr ⇒ $0.16</div>
<pre><code class="language-javascript"><span class="tok-comment">// ton-tai.mjs — "đồng bộ 400 tệp vào bucket đã có 2.000 object": ba cách kiểm tệp đã có chưa. Đếm request THẬT SDK gửi tới MinIO (middleware) rồi xếp lớp theo bảng giá R2.</span>
import { S3Client, PutObjectCommand, ListObjectsV2Command, HeadObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });
const LOP = { ListObjectsV2: 'A', PutObject: 'A', HeadObject: 'B' };
let dem = {};
s3.middlewareStack.add((next, ctx) =&gt; async (a) =&gt; { const n = ctx.commandName.replace('Command', ''); dem[n] = (dem[n] ?? 0) + 1; return next(a); }, { step: 'build' });
const Bucket = 'kho-dong-bo';
await s3.send(new CreateBucketCommand({ Bucket })).catch(() =&gt; {});
const ten = (i) =&gt; &#96;sync/u42/\${String(i).padStart(5, '0')}.pdf&#96;;
if (process.argv[2] === 'dung') { for (let i = 0; i &lt; 2000; i += 50) await Promise.all(Array.from({ length: 50 }, (_, j) =&gt; s3.send(new PutObjectCommand({ Bucket, Key: ten(i + j), Body: 'x' })))); console.log('đã dựng 2.000 object'); process.exit(0); }
const can = Array.from({ length: 400 }, (_, i) =&gt; ten(1800 + i)); <span class="tok-comment">  // 400 tệp cần đồng bộ: 200 đã có (1800–1999), 200 chưa (2000–2199)</span>
const do1 = async (ten_, f) =&gt; { dem = {}; const t = Date.now(); const co = await f(); const ms = Date.now() - t;
  const a = Object.entries(dem).filter(([k]) =&gt; LOP[k] === 'A').reduce((s, [, v]) =&gt; s + v, 0), b = Object.entries(dem).filter(([k]) =&gt; LOP[k] === 'B').reduce((s, [, v]) =&gt; s + v, 0);
  console.log(&#96;\${ten_.padEnd(34)} đã có \${co} · \${Object.entries(dem).map(([k, v]) =&gt; &#96;\${k}×\${v}&#96;).join(' ')} ⇒ A \${a} · B \${b} · \${ms} ms&#96;); };
await do1('① LIST Prefix=key mỗi tệp', async () =&gt; { let co = 0; for (const k of can) { const r = await s3.send(new ListObjectsV2Command({ Bucket, Prefix: k, MaxKeys: 1 })); if (r.KeyCount) co++; } return co; });
await do1('② HEAD mỗi tệp', async () =&gt; { let co = 0; for (const k of can) { try { await s3.send(new HeadObjectCommand({ Bucket, Key: k })); co++; } catch {} } return co; });
await do1('③ LIST một lần (cả prefix) + Set', async () =&gt; { const biet = new Set(); let ContinuationToken; do { const r = await s3.send(new ListObjectsV2Command({ Bucket, Prefix: 'sync/u42/', ContinuationToken })); for (const o of r.Contents ?? []) biet.add(o.Key); ContinuationToken = r.NextContinuationToken; } while (ContinuationToken); return can.filter((k) =&gt; biet.has(k)).length; });
const r = await s3.send(new ListObjectsV2Command({ Bucket, Prefix: 'sync/u42/', MaxKeys: 5000 }));
console.log(&#96;xin MaxKeys 5000 ⇒ nhận \${r.KeyCount} khoá/trang (trần 1.000) · IsTruncated \${r.IsTruncated}&#96;);</code></pre>
<p>And this repo, read (not run against R2): the admin stats lists the whole bucket and caches it for 10 minutes; the ink-notes cleanup lists per page folder, five at a time.</p>
<div class="out">$ grep -n "R2_TTL_MS =\\|R2_MAX_PAGES =\\|MaxKeys: 1000" src/services/systemStats.service.ts
42:const R2_TTL_MS = 10 * 60 * 1000;
43:const R2_MAX_PAGES = 200; // ~200k objects cap so a huge bucket can't stall the request
57:      const out = await client.send(new ListObjectsV2Command({ Bucket: config.r2.bucketName, ContinuationToken: token, MaxKeys: 1000 }));
$ grep -n "i += 5\\|listObjects(thuMucNet" src/services/voInk.service.ts
655:  const ds = await listObjects(thuMucNet(userId, noteId));
705:  for (let i = 0; i &lt; trangs.length; i += 5) {
707:    const ds = await Promise.all(lo.map((t) =&gt; listObjects(thuMucNet(t.userId, t.id)).catch(() =&gt; [])));
948:  const ds = await listObjects(thuMucNet(t.userId, t.id));
$ node -e '…'   # trang thống kê admin mở liên tục: 1 lượt LIST cả bucket mỗi 10 phút, bucket 200.000 object
4320 lượt/tháng × 200 trang = 864.000 Class A ⇒ 86.4% hạn mức miễn phí 1 triệu; vượt thì $3.89</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>Real life:</strong> a phone bill — the subscription is small, international calls are what hurt. R2 is the plan with free international calls; the subscription (storage) and every message sent (Class A) are still billed. The usual first surprise is a sync script that &quot;checks before uploading&quot; with a LIST per file.</li>
<li><strong>What if</strong> the stats page refreshed every 10 seconds with no cache? One open tab: 259,200 refreshes × 200 pages = 51.8 M Class A a month. The 10-minute cache is what keeps it at 864,000. And R2 rounds up: 1,000,001 operations bill as 2 million.</li>
<li><strong>The attacker's view:</strong> a leaked key that may LIST can loop listings for days — no data stolen, only Class A billed. One token per workload with only the operations it needs (lesson 2.3), plus a budget alert and a rate alarm (lesson 7.3), turn that into a page within minutes instead of a surprise at month end.</li>
</ul>
<h3>🔁 Run it yourself</h3>
<p>Run a MinIO container, put 2,000 small objects under one prefix, then check 400 keys three ways with a counting middleware on the client. Then read today's prices from the providers and price your own month — with and without free allowances.</p>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-2-cache-aside" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 12.2 — Cache-aside: the pattern and its four betrayals</span><span class="lc-sub">Keep a listing instead of asking again</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-2-1-egress" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 2.1 — Zero egress: what R2 costs</span><span class="lc-sub">The full egress comparison</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Storage (GB-month)</span><span class="v">Bytes held &times; time; R2 $0.015/GB, S3 $0.023/GB.</span></div>
  <div class="kv"><span class="k">Class A operation</span><span class="v">Writes and LIST (PUT, POST, COPY, LIST) — the expensive class.</span></div>
  <div class="kv"><span class="k">Class B operation</span><span class="v">Reads (GET, HEAD) — roughly 10&times; cheaper than Class A.</span></div>
  <div class="kv"><span class="k">Egress</span><span class="v">Bytes served out; $0 on R2, $0.09/GB on S3 — the headline difference.</span></div>
  <div class="kv"><span class="k">Line item</span><span class="v">One billed dimension; a storage bill has five, not one.</span></div>
  <div class="kv"><span class="k">Steady state</span><span class="v">Your normal monthly spend — the baseline an alert multiplies.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A storage bill is five line items (storage, Class A, Class B, egress, infra fees), not a single number.</li><li>R2's zero egress made it 7–20&times; cheaper than S3 in the measured browser/CDN examples; without egress the gap shrinks to ×1.1–×2.2.</li><li>The sneakiest driver on either service is Class A from over-frequent LIST — track keys in your DB so you never list a hot path.</li></ul>

<h3>Reading an object-storage bill</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Storage — per GB-month</span><span class="lz-d">The number everyone compares, and usually the smallest line on a bill with real traffic.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Egress — per GB out</span><span class="lz-d">Zero on R2, and on S3 this is typically where most of the money is. It is the single biggest difference between providers.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Class A — writes and lists</span><span class="lz-d"><code>PUT</code>, <code>POST</code>, <code>LIST</code>. Priced roughly ten times a read, which is why a listing in a loop is the trap in this lesson.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Class B — reads, and free operations</span><span class="lz-d"><code>GET</code>, <code>HEAD</code>. Cheap per request and enormous in volume, so it still adds up on a busy bucket.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a <code>LIST</code> inside a loop, billed as a Class A request every iteration.</strong> Listing a prefix to check whether one key exists reads as harmless and costs about ten times what the equivalent <code>HeadObject</code> would. Do it once per item in a sync over fifty thousand objects and the request line on the bill exceeds the storage line — for a job whose actual work was reading four hundred files. Nothing in the code looks expensive, and the SDK gives no signal. Use <code>HeadObject</code> for existence, list once and keep the result, and check the request counts in the provider&#39;s metrics after any batch job.</p>
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

<h3>Giá cạnh nhau (đọc lại 15/11/2026: bảng giá AWS công bố 09/11/2026 + trang giá R2 — không đổi từ 08/2026)</h3>
<pre><code class="language-text">Line item                    R2 (Cloudflare)   S3 (AWS us-east-1)
──────────────────────────   ───────────────   ────────────────────
Storage (per GB-tháng)        $0.015            $0.023
Class A (per 1M op)           $4.50             $5.00
Class B (per 1M op)           $0.36             $0.40
Egress internet               $0.00             $0.09/GB
Egress region AWS khác        $0.00             $0.02/GB
Egress sang CloudFront        n/a               $0.00
Miễn phí hàng tháng           10 GB storage,    100 GB egress đầu mỗi tháng;
                              1M Class A,       tài khoản mới nhận gói
                              10M Class B,      credit, không còn hạn mức
                              zero egress       S3 cố định (aws.amazon.com/free)
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

<p>Ví dụ trên là hoá đơn <em>chưa</em> trừ phần miễn phí (tính lại hôm nay: $82,25 so với $6,18). Trừ phần miễn phí — 100 GB egress của S3, 10 GB / 1 triệu Class A / 10 triệu Class B của R2 — còn <strong>$73,25 so với $3,60, khoảng 20 lần</strong>, và egress chiếm 88% hoá đơn S3. Phóng lên một ứng dụng video lưu và phục vụ 20 TB mỗi tháng, giá hôm nay cho <strong>$2.224 so với $312 (×7,1)</strong>. (Bản cũ ghi &quot;$1,842 vs $306&quot; và một dòng 200 TB mà không nói lưu bao nhiêu; cả hai được thay bằng lượt đo bên dưới.)</p>

<h3>Khi R2 KHÔNG rẻ hơn</h3>
<pre><code class="language-text">Profile workload                Cost tốt hơn ở
──────────────────────────────  ─────────────
Cold archival, đọc hiếm          S3 Glacier Instant ($0.004/GB storage)
Zero egress (chỉ internal)       R2 vẫn rẻ hơn, ít hơn: ×2,2 (đo ở bài 2.1)
Rate Class A rất lớn             Gần hoà: ×1,1 (đo ở bài 2.1)
CDN nặng qua CloudFront          Hoà (egress CF sang CloudFront free)
Kích thước nhỏ, app một region   R2 (phần miễn phí của R2 lớn hơn)
</code></pre>

<p>Chiến thắng R2 đến từ egress. Bỏ egress đi — hoặc vì không bao giờ egress (pipeline analytics internal) hoặc vì đã egress qua CloudFront (free từ S3) — và khoảng cách co lại còn ×1,1 tới ×2,2 tuỳ tỉ lệ operation (đo ở bài 2.1) — R2 vẫn rẻ hơn về giá lưu trữ, nhưng không còn gấp hàng chục lần.</p>

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
<p><strong>Bẫy — chỉ đọc figure storage trên dashboard.</strong> Tab <em>Metrics</em> của từng bucket R2 tách operation theo loại (tập dữ liệu <code>r2OperationsAdaptiveGroups</code>); AWS billing gom cả hai lớp dưới &quot;Requests&quot;. Mỗi tháng, check cả hai. Spike Class A từ script migration chạy trốn đã kết thúc nhiều free tier hơn storage từng làm.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bill object-storage là năm line item (storage, Class A ghi, Class B đọc, egress, phí infra) không phải một; win headline của R2 là zero-egress làm nó rẻ hơn S3 từ 7 tới 20 lần trong các ví dụ đo ở bài này cho ứng dụng phục vụ trình duyệt/CDN, nhưng không có egress thì khoảng cách chỉ còn ×1,1–×2,2, và cost driver nham hiểm nhất trên cả hai service là Class A từ LIST operation quá thường xuyên.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy một tháng usage thật từ dashboard R2 (Metrics) hoặc billing API: storage GB-tháng, số Class A, số Class B, egress GB.</li>
<li>Tính bill R2 bằng tay: storage GB &times; $0.015 + Class A (mỗi triệu &times; $4.50) + Class B (mỗi triệu &times; $0.36); egress là $0.</li>
<li>Tính CÙNG traffic đó trên S3: storage &times; $0.023 + egress GB &times; $0.09 + Class A/B theo giá S3. Ghi lại tỉ lệ R2 : S3.</li>
<li>Tìm line item lớn nhất. Nếu là Class A, grep code tìm <code>ListObjectsV2</code> / LIST trên hot path và chuyển việc tracking đó vào database.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có hai tổng chi phí tháng (R2 vs S3) và gọi được tên line item chiếm chủ đạo của mỗi bên.</p></div>

<h3>🔬 Đo thật: giá hôm nay, và bẫy LIST trên MinIO</h3>
<p>Giá đọc ngày 15/11/2026 từ AWS Price List API và trang giá R2 (không chạm tài khoản nào), rồi tính lại các hoá đơn của bài, có và không có phần miễn phí:</p>
<div class="out">$ node hoa-don.mjs
AWS công bố 2026-11-09: lưu $0.023/GB · Class A $5.00/triệu · Class B $0.40/triệu · ra internet $0.09 → $0.085 → $0.07/GB (bậc 0–10 TB, tới 50 TB …; 100 GB/tháng đầu miễn phí) · sang vùng khác $0.02/GB · sang CloudFront $0/GB
S3 Glacier Instant Retrieval: lưu $0.004/GB-tháng (lưu trữ lạnh, đọc hiếm)
R2 (làm tròn): If you have performed one million and one operations, you will be billed for two million operations.
SaaS nhỏ (250 GB, 45k PUT, 6,2 tr GET, 820 GB ra) KHÔNG miễn phí  S3 $   82.25 (lưu 5.75 · A 0.22 · B 2.48 · egress 73.80)  ⇒  R2 $   6.18  ×13.3
SaaS nhỏ (250 GB, 45k PUT, 6,2 tr GET, 820 GB ra) CÓ miễn phí   S3 $   73.25 (lưu 5.75 · A 0.22 · B 2.48 · egress 64.80)  ⇒  R2 $   3.60  ×20.3
   phần egress trong hoá đơn S3: 88%
Video 20 TB lưu + 20 TB ra/tháng (giả định lưu = ra) KHÔNG miễn phí  S3 $ 2224.20 (lưu 460.00 · A 5.00 · B 8.00 · egress 1751.20)  ⇒  R2 $ 311.70  ×7.1
Video 20 TB lưu + 20 TB ra/tháng (giả định lưu = ra) CÓ miễn phí   S3 $ 2215.70 (lưu 460.00 · A 5.00 · B 8.00 · egress 1742.70)  ⇒  R2 $ 303.45  ×7.3
   phần egress trong hoá đơn S3: 79%</div>
<p>Rồi đo bẫy LIST: bucket 2.000 object trên MinIO, 400 tệp cần đồng bộ, ba cách hỏi &quot;đã có chưa&quot;. Một middleware đếm từng request SDK thật sự gửi đi (SDK v3 3.1071.0, Node 22.23.3):</p>
<div class="out">$ node ton-tai.mjs dung
đã dựng 2.000 object
$ node ton-tai.mjs
① LIST Prefix=key mỗi tệp          đã có 200 · ListObjectsV2×400 ⇒ A 400 · B 0 · 990 ms
② HEAD mỗi tệp                     đã có 200 · HeadObject×400 ⇒ A 0 · B 400 · 743 ms
③ LIST một lần (cả prefix) + Set   đã có 200 · ListObjectsV2×2 ⇒ A 2 · B 0 · 79 ms
xin MaxKeys 5000 ⇒ nhận 1000 khoá/trang (trần 1.000) · IsTruncated true
$ node nhan.mjs
① LIST mỗi tệp (50.000 tệp)    mỗi lượt A  50000 B      0 · mỗi tháng (720 lượt) A 36.00 tr · B 0.00 tr ⇒ $162.00
② HEAD mỗi tệp (50.000 tệp)    mỗi lượt A      0 B  50000 · mỗi tháng (720 lượt) A 0.00 tr · B 36.00 tr ⇒ $12.96
③ LIST một lần (50 trang)      mỗi lượt A     50 B      0 · mỗi tháng (720 lượt) A 0.04 tr · B 0.00 tr ⇒ $0.16</div>
<pre><code class="language-javascript"><span class="tok-comment">// ton-tai.mjs — "đồng bộ 400 tệp vào bucket đã có 2.000 object": ba cách kiểm tệp đã có chưa. Đếm request THẬT SDK gửi tới MinIO (middleware) rồi xếp lớp theo bảng giá R2.</span>
import { S3Client, PutObjectCommand, ListObjectsV2Command, HeadObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });
const LOP = { ListObjectsV2: 'A', PutObject: 'A', HeadObject: 'B' };
let dem = {};
s3.middlewareStack.add((next, ctx) =&gt; async (a) =&gt; { const n = ctx.commandName.replace('Command', ''); dem[n] = (dem[n] ?? 0) + 1; return next(a); }, { step: 'build' });
const Bucket = 'kho-dong-bo';
await s3.send(new CreateBucketCommand({ Bucket })).catch(() =&gt; {});
const ten = (i) =&gt; &#96;sync/u42/\${String(i).padStart(5, '0')}.pdf&#96;;
if (process.argv[2] === 'dung') { for (let i = 0; i &lt; 2000; i += 50) await Promise.all(Array.from({ length: 50 }, (_, j) =&gt; s3.send(new PutObjectCommand({ Bucket, Key: ten(i + j), Body: 'x' })))); console.log('đã dựng 2.000 object'); process.exit(0); }
const can = Array.from({ length: 400 }, (_, i) =&gt; ten(1800 + i)); <span class="tok-comment">  // 400 tệp cần đồng bộ: 200 đã có (1800–1999), 200 chưa (2000–2199)</span>
const do1 = async (ten_, f) =&gt; { dem = {}; const t = Date.now(); const co = await f(); const ms = Date.now() - t;
  const a = Object.entries(dem).filter(([k]) =&gt; LOP[k] === 'A').reduce((s, [, v]) =&gt; s + v, 0), b = Object.entries(dem).filter(([k]) =&gt; LOP[k] === 'B').reduce((s, [, v]) =&gt; s + v, 0);
  console.log(&#96;\${ten_.padEnd(34)} đã có \${co} · \${Object.entries(dem).map(([k, v]) =&gt; &#96;\${k}×\${v}&#96;).join(' ')} ⇒ A \${a} · B \${b} · \${ms} ms&#96;); };
await do1('① LIST Prefix=key mỗi tệp', async () =&gt; { let co = 0; for (const k of can) { const r = await s3.send(new ListObjectsV2Command({ Bucket, Prefix: k, MaxKeys: 1 })); if (r.KeyCount) co++; } return co; });
await do1('② HEAD mỗi tệp', async () =&gt; { let co = 0; for (const k of can) { try { await s3.send(new HeadObjectCommand({ Bucket, Key: k })); co++; } catch {} } return co; });
await do1('③ LIST một lần (cả prefix) + Set', async () =&gt; { const biet = new Set(); let ContinuationToken; do { const r = await s3.send(new ListObjectsV2Command({ Bucket, Prefix: 'sync/u42/', ContinuationToken })); for (const o of r.Contents ?? []) biet.add(o.Key); ContinuationToken = r.NextContinuationToken; } while (ContinuationToken); return can.filter((k) =&gt; biet.has(k)).length; });
const r = await s3.send(new ListObjectsV2Command({ Bucket, Prefix: 'sync/u42/', MaxKeys: 5000 }));
console.log(&#96;xin MaxKeys 5000 ⇒ nhận \${r.KeyCount} khoá/trang (trần 1.000) · IsTruncated \${r.IsTruncated}&#96;);</code></pre>
<p>Và kho của mình, đọc mã (không gọi R2): trang thống kê admin liệt kê cả bucket và giữ kết quả 10 phút; phần dọn ghi chú vẽ tay liệt kê theo thư mục từng trang, năm trang một lượt.</p>
<div class="out">$ grep -n "R2_TTL_MS =\\|R2_MAX_PAGES =\\|MaxKeys: 1000" src/services/systemStats.service.ts
42:const R2_TTL_MS = 10 * 60 * 1000;
43:const R2_MAX_PAGES = 200; // ~200k objects cap so a huge bucket can't stall the request
57:      const out = await client.send(new ListObjectsV2Command({ Bucket: config.r2.bucketName, ContinuationToken: token, MaxKeys: 1000 }));
$ grep -n "i += 5\\|listObjects(thuMucNet" src/services/voInk.service.ts
655:  const ds = await listObjects(thuMucNet(userId, noteId));
705:  for (let i = 0; i &lt; trangs.length; i += 5) {
707:    const ds = await Promise.all(lo.map((t) =&gt; listObjects(thuMucNet(t.userId, t.id)).catch(() =&gt; [])));
948:  const ds = await listObjects(thuMucNet(t.userId, t.id));
$ node -e '…'   # trang thống kê admin mở liên tục: 1 lượt LIST cả bucket mỗi 10 phút, bucket 200.000 object
4320 lượt/tháng × 200 trang = 864.000 Class A ⇒ 86.4% hạn mức miễn phí 1 triệu; vượt thì $3.89</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Đời thật:</strong> hoá đơn điện thoại — thuê bao thì nhỏ, gọi quốc tế mới đau. R2 là gói gọi quốc tế miễn phí; thuê bao (lưu trữ) và mỗi tin gửi đi (Class A) vẫn tính tiền. Bất ngờ đầu tiên thường là script đồng bộ &quot;kiểm trước khi tải lên&quot; bằng một lệnh LIST cho mỗi tệp.</li>
<li><strong>Nếu</strong> trang thống kê tự tải lại mỗi 10 giây và không có bộ nhớ đệm? Một tab mở: 259.200 lượt × 200 trang = 51,8 triệu Class A mỗi tháng. Bộ nhớ đệm 10 phút giữ nó ở 864.000. Và R2 làm tròn lên: 1.000.001 lệnh tính thành 2 triệu.</li>
<li><strong>Góc kẻ xấu:</strong> một khoá bị lộ có quyền LIST có thể liệt kê liên tục nhiều ngày — không mất dữ liệu, chỉ mất tiền Class A. Mỗi việc một khoá chỉ đủ quyền cần dùng (bài 2.3), cộng cảnh báo ngân sách và cảnh báo tốc độ (bài 7.3), biến nó thành một cảnh báo trong vài phút thay vì bất ngờ cuối tháng.</li>
</ul>
<h3>🔁 Tự chạy lại</h3>
<p>Chạy một container MinIO, đặt 2.000 object nhỏ dưới một prefix, rồi kiểm 400 key theo ba cách với middleware đếm request trên client. Sau đó đọc giá hôm nay từ trang của nhà cung cấp và tính tháng của chính bạn — có và không có phần miễn phí.</p>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-2-cache-aside" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 12.2 — Cache-aside: khuôn mẫu và bốn lần nó phản chủ</span><span class="lc-sub">Giữ kết quả liệt kê thay vì hỏi lại</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-2-1-egress" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 2.1 — Zero egress: giá của R2</span><span class="lc-sub">Phép so egress đầy đủ</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Storage (GB-tháng)</span><span class="v">Byte lưu &times; thời gian; R2 $0.015/GB, S3 $0.023/GB.</span></div>
  <div class="kv"><span class="k">Class A operation</span><span class="v">Ghi và LIST (PUT, POST, COPY, LIST) — lớp đắt.</span></div>
  <div class="kv"><span class="k">Class B operation</span><span class="v">Đọc (GET, HEAD) — rẻ hơn Class A khoảng 10&times;.</span></div>
  <div class="kv"><span class="k">Egress</span><span class="v">Byte truyền ra; $0 trên R2, $0.09/GB trên S3 — khác biệt headline.</span></div>
  <div class="kv"><span class="k">Line item</span><span class="v">Một chiều tính tiền; bill storage có năm, không phải một.</span></div>
  <div class="kv"><span class="k">Steady state</span><span class="v">Mức tiêu bình thường mỗi tháng — baseline mà alert nhân lên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bill storage là năm line item (storage, Class A, Class B, egress, phí infra), không phải một con số.</li><li>Zero egress của R2 làm nó rẻ 7–20&times; so S3 trong các ví dụ đo cho ứng dụng trình duyệt/CDN; không có egress thì khoảng cách chỉ còn ×1,1–×2,2.</li><li>Driver nham hiểm nhất của cả hai là Class A từ LIST quá thường xuyên — track key trong DB để không bao giờ list trên hot path.</li></ul>

<h3>Đọc một hoá đơn lưu trữ đối tượng</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dung lượng — theo GB-tháng</span><span class="lz-d">Con số ai cũng đem ra so, và thường là dòng nhỏ nhất trên một hoá đơn có lưu lượng thật.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Truyền ra — theo GB đi ra</span><span class="lz-d">Bằng không trên R2, còn trên S3 thì đây thường là chỗ phần lớn tiền nằm ở đó. Đây là khác biệt lớn nhất giữa các nhà cung cấp.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Class A — ghi và liệt kê</span><span class="lz-d"><code>PUT</code>, <code>POST</code>, <code>LIST</code>. Giá cỡ mười lần một phép đọc, và đó là lý do một phép liệt kê trong vòng lặp là cái bẫy của bài này.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Class B — đọc, và các thao tác miễn phí</span><span class="lz-d"><code>GET</code>, <code>HEAD</code>. Rẻ trên mỗi request và khổng lồ về số lượng, nên nó vẫn cộng dồn lên đáng kể trên một bucket bận rộn.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một phép <code>LIST</code> nằm trong vòng lặp, bị tính là một request Class A ở mỗi vòng.</strong> Liệt kê một tiền tố để kiểm xem một khoá có tồn tại hay không thì đọc lên rất vô hại mà tốn khoảng mười lần cái <code>HeadObject</code> tương đương. Làm thế cho mỗi phần tử trong một lần đồng bộ năm mươi nghìn object là dòng phí request trên hoá đơn vượt cả dòng phí lưu trữ — cho một công việc mà phần việc thật chỉ là đọc bốn trăm file. Chẳng có gì trong mã trông đắt đỏ, và SDK cũng không phát tín hiệu nào. Hãy dùng <code>HeadObject</code> để kiểm tồn tại, liệt kê một lần rồi giữ lại kết quả, và kiểm số lượng request trong phần chỉ số của nhà cung cấp sau mỗi công việc chạy theo lô.</p>
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
${G07_2}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>The thumbnail explosion</h2>
<p class="lead">A user uploads one 5 MB JPEG. Your app now has that JPEG, a WebP version, an AVIF version, three sizes of each (mobile/tablet/desktop), and maybe a blur placeholder. One upload turned into <em>ten</em> objects, each written with a Class A operation, and every future page load reads at least one of them. This ratio is a cost story disguised as a feature.</p>

<h3>Where the explosion comes from</h3>
<p><em>Illustrative sizes — a measured run on a real phone photo is in the measured section below (14 objects, +69% bytes).</em></p>
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
Class B operations per page view: 1 per image (srcset fetches ONE candidate — measured below)
</code></pre>

<p>The overhead in <em>bytes</em> is manageable — 41% is not shocking. The overhead in <em>operations</em> is the real story. Every re-upload, every pipeline change, every &quot;let's regenerate all thumbnails&quot; button adds another 14 PUTs per image. A photo album with 10,000 photos regenerated once is 140,000 Class A ops = $0.63 on R2. Regenerated weekly is about $2.73/month; daily, $18.90/month (an earlier version said $30 and $210 — recomputed below).</p>

<h3>The math on a real photo app</h3>
<pre><code class="language-text">Instagram-shape workload, monthly:

  New photo uploads:          200,000
  Variants per upload:            14
  Class A ops (uploads):    2,800,000  = 2.8 M
  Storage added:                 1.5 TB

  Regenerations (added a size): 200,000 × 14 = 2.8 M
  Class A ops this month:  2.8 M + 2.8 M = 5.6 M total

  Total Class A cost R2:    5.6 × $4.50 = $25.20
  Total Class A cost S3:    5.6 × $5.00 = $28.00
  (an earlier version added the regeneration twice: 8.4 M, $37.80)

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

  Feed reads with a 3-variant srcset:
    still 240M GETs — the browser fetches ONE candidate
    (measured in Chromium; an earlier version multiplied by 3)
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Count the variants your pipeline writes per upload (thumb, medium, large, webp, avif…) — call that multiplier N.</li>
<li>Estimate storage two ways for 100,000 uploads: pre-generate all N on upload, versus on-demand behind a CDN cache where only viewed variants ever get written.</li>
<li>Compute the Class A cost of ONE regeneration pass (you change the resize rules): N &times; 100,000 writes &times; $4.50/million.</li>
<li>Sketch an on-demand route (<code>GET /img/:key?w=400</code>) behind a CDN cache, and name the one cost it adds: first-view latency.</li>
</ol>
<p><strong>Done when:</strong> you have the N multiplier, a pre-generate vs on-demand storage comparison, and the cost of one regeneration pass.</p></div>

<h3>🔬 Measured: one phone photo, the repo's pipeline, srcset, and on-demand</h3>
<p>A real 12-megapixel phone photo through a 14-variant pipeline (sharp 0.35.3 — the repo's version — into MinIO, a middleware counting PUTs), then this repo's own <code>optimizeImage()</code> on the same file:</p>
<div class="out">$ node no.mjs
ảnh gốc 3024×4032, 2.313.191 B
  photo-320w.jpg          14.968 B
  photo-320w.webp         13.886 B
  photo-320w.avif          8.564 B
  photo-640w.jpg          61.978 B
  photo-640w.webp         54.032 B
  photo-640w.avif         33.832 B
  photo-1280w.jpg        214.435 B
  photo-1280w.webp       175.444 B
  photo-1280w.avif       105.845 B
  photo-1920w.jpg        417.999 B
  photo-1920w.webp       315.126 B
  photo-1920w.avif       188.218 B
  photo-blur.jpg             338 B
TỔNG 14 object · 3.917.856 B (biến thể thêm 69% so với gốc) · 14 lệnh PUT = 14 Class A
$ npx tsx kho.mts
optimizeImage: 2.313.191 B ⇒ 156.658 B · image/webp · 1200×1600 · 1 object, gốc KHÔNG giữ
$ grep -n "MAX_WIDTH =\\|WEBP_QUALITY =\\|const key = buildKey" src/storage/imageOptimizer.ts src/storage/uploadService.ts
src/storage/imageOptimizer.ts:43:const MAX_WIDTH = 1200;
src/storage/imageOptimizer.ts:44:const WEBP_QUALITY = 80;
src/storage/uploadService.ts:109:  const key = buildKey(category, originalNameForKey, options);</div>
<p>The lesson's arithmetic, recomputed (R2 $4.50 per million Class A, $0.36 per million Class B, before free allowances):</p>
<div class="out">$ node toan.mjs
album 10.000 ảnh × 14 biến thể, dựng lại 1 lần: 140.000 PUT ⇒ $0.63
  dựng lại mỗi tuần (4,33 lần/tháng): $2.73/tháng   (bài cũ ghi $30)
  dựng lại mỗi ngày (30 lần/tháng):   $18.90/tháng   (bài cũ ghi $210)
app kiểu Instagram: tải mới 2.800.000 + dựng lại 2.800.000 = 5.600.000 PUT ⇒ R2 $25.20 · S3 $28.00   (bài cũ cộng hai lần: 8,4 triệu ⇒ $37,80)
feed: 200.000 ảnh × 40 lượt/ngày × 30 ngày = 240 triệu GET ⇒ $86.40/tháng nếu MỌI lượt chạm bucket (không CDN)</div>
<p>Does a 3-variant <code>srcset</code> download three images? A tiny server counts image requests while real Chromium (Playwright) opens the page at three screen types:</p>
<div class="out">$ node srcset.mjs
điện thoại 390px, DPR 3  ⇒ 1 request ảnh: 1600w
laptop 1440px, DPR 1     ⇒ 1 request ảnh: 800w
laptop 1440px, DPR 2     ⇒ 1 request ảnh: 1600w</div>
<p>On-demand generation: <code>GET /img/&lt;key&gt;?w=…</code> fetches the original on a miss, resizes, caches. First view vs cached — and the 1200 px variant is byte-identical to <code>optimizeImage()</code>'s output (same sharp settings):</p>
<div class="out">$ for i in 1 2 3; do curl -s -o /dev/null -D - -w 'thời gian %{time_total}s · %{size_download} B\\n' 'http://127.0.0.1:20251/img/u42/1794700000000/photo-original.jpg?w=400' | grep -iE '^x-|thời gian' | tr -d '\\r' | paste -sd' ' -; done
x-cache: MISS x-s3-get: 1 thời gian 0.142124s · 21648 B
x-cache: HIT x-s3-get: 1 thời gian 0.000984s · 21648 B
x-cache: HIT x-s3-get: 1 thời gian 0.000846s · 21648 B
$ curl -s -o /dev/null -D - -w 'thời gian %{time_total}s · %{size_download} B\\n' 'http://127.0.0.1:20251/img/u42/1794700000000/photo-original.jpg?w=1200' | grep -iE '^x-|thời gian' | tr -d '\\r' | paste -sd' ' -
x-cache: MISS x-s3-get: 2 thời gian 0.204931s · 156658 B</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>Real life:</strong> a print shop that prints every photo in 14 sizes &quot;just in case&quot; — then changes paper and reprints the whole archive. The smart shop keeps the original and prints the size a customer asks for, keeping it at the counter (the CDN) for next time.</li>
<li><strong>What if</strong> a designer asks for a 2560 px size? Add it for new uploads and generate old ones lazily when viewed. In this repo it is impossible — originals are not kept — which is a deliberate trade-off.</li>
<li><strong>The attacker's view (measured):</strong> an on-demand route that accepts any width lets anyone force a fresh resize per request:</li>
</ul>
<div class="out">$ for w in $(seq 401 420); do curl -s -o /dev/null -D - "http://127.0.0.1:20251/img/u42/…/photo-original.jpg?w=$w" | grep -i x-cache; done | sort | uniq -c
  20 x-cache: MISS
$ time (for w in $(seq 421 440); do curl -s -o /dev/null "…?w=$w"; done)   # 20 lần resize tuần tự
20 độ rộng mới: 1536 ms CPU resize · x-s3-get: 41</div>
<p>Twenty new widths, twenty misses; forty-one downloads of a 2.3 MB original. On Cloudflare Images every unique transformation beyond 5,000 a month is billed. Accept only a fixed list of widths (or signed URLs).</p>
<h3>🔁 Run it yourself</h3>
<p>Put one real photo through a pipeline that writes several widths and formats into MinIO and count the PUTs; open a page with a 3-candidate <code>srcset</code> in DevTools at two screen sizes and count image requests; then write a small on-demand route with a width allow-list and time a miss against a hit.</p>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/media-processing/learn?lessonSlug=mp-1-3-resize" target="_blank" rel="noopener"><span class="lc-ico">🎞</span><span class="lc-body"><span class="lc-title">Media Processing · 1.3 — resize(): fit modes, and the flag that stops upscaling</span><span class="lc-sub">Resizing with sharp, correctly</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-2-next-image" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.2 — The Image component: fast pictures for free</span><span class="lc-sub">Let the framework pick the size</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variant</span><span class="v">A derived object (resized/re-encoded) of one original upload.</span></div>
  <div class="kv"><span class="k">Pre-generation</span><span class="v">Writing every variant at upload time, viewed or not.</span></div>
  <div class="kv"><span class="k">On-demand generation</span><span class="v">Creating a variant on first request, then caching it.</span></div>
  <div class="kv"><span class="k">CDN cache</span><span class="v">Edge layer that serves a variant after the first miss, cutting Class B.</span></div>
  <div class="kv"><span class="k">Regeneration pass</span><span class="v">Re-writing all variants after a rule change — N&times; Class A.</span></div>
  <div class="kv"><span class="k">First-view latency</span><span class="v">The one-time delay to build a variant on its first request.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>One upload becomes 10–15 variant objects, so storage and Class A scale by the multiplier N.</li><li>Every regeneration pass re-writes N&times; objects — a silent four-digit Class A bill.</li><li>On-demand generation behind a CDN cache trades small first-view latency for a 10–100&times; saving over pre-generating everything.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare Images — pricing</span><span class="lc-sub">developers.cloudflare.com/images/pricing — transforming images stored elsewhere (e.g. R2): 5,000 unique transformations/month free, then $0.50 per 1,000; $5/100k applies only to images stored in Images.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vercel — Image Optimization</span><span class="lc-sub">vercel.com/docs/image-optimization — on-demand pattern.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — srcset and responsive images</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset — why apps generate many sizes.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Vụ nổ thumbnail</h2>
<p class="lead">Một user upload một JPEG 5 MB. App của bạn giờ có JPEG đó, một bản WebP, một bản AVIF, ba size mỗi cái (mobile/tablet/desktop), và có thể một blur placeholder. Một upload biến thành <em>mười</em> object, mỗi cái viết bằng một Class A operation, và mỗi page load tương lai đọc ít nhất một trong số đó. Tỷ lệ này là câu chuyện cost trá hình thành feature.</p>

<h3>Vụ nổ đến từ đâu</h3>
<p><em>Kích thước minh hoạ — lượt đo trên ảnh điện thoại thật nằm ở phần Đo thật bên dưới (14 object, thêm 69% byte).</em></p>
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
Class B op mỗi page view: 1 mỗi ảnh (srcset chỉ tải MỘT ứng viên — đo bên dưới)
</code></pre>

<p>Overhead theo <em>byte</em> quản được — 41% không sốc. Overhead theo <em>op</em> mới là câu chuyện thật. Mỗi re-upload, mỗi pipeline thay đổi, mỗi nút &quot;regenerate all thumbnail&quot; thêm 14 PUT nữa per ảnh. Album 10,000 ảnh regenerate một lần là 140,000 Class A op = $0.63 trên R2. Regenerate hàng tuần khoảng $2,73/tháng; hàng ngày $18,90/tháng (bản cũ ghi $30 và $210 — tính lại bên dưới).</p>

<h3>Toán trên app ảnh thật</h3>
<pre><code class="language-text">Workload hình Instagram, hàng tháng:

  Upload ảnh mới:            200,000
  Variant per upload:             14
  Class A op (upload):     2,800,000  = 2.8 M
  Storage thêm:                  1.5 TB

  Regeneration (thêm size): 200,000 × 14 = 2.8 M
  Class A op tháng này:    2.8 M + 2.8 M = 5.6 M tổng

  Tổng Class A cost R2:    5.6 × $4.50 = $25.20
  Tổng Class A cost S3:    5.6 × $5.00 = $28.00
  (bản cũ cộng lần regenerate hai lần: 8.4 M, $37.80)

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
    vẫn 240M GET — trình duyệt chỉ tải MỘT ứng viên
    (đo bằng Chromium; bản cũ nhân 3)
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Đếm số variant pipeline của bạn ghi mỗi upload (thumb, medium, large, webp, avif…) — gọi hệ số đó là N.</li>
<li>Ước lượng storage hai cách cho 100.000 upload: pre-generate đủ N lúc upload, so với on-demand sau CDN cache (chỉ variant được xem mới ghi).</li>
<li>Tính cost Class A của MỘT regeneration pass (bạn đổi luật resize): N &times; 100.000 lượt ghi &times; $4.50/triệu.</li>
<li>Phác một route on-demand (<code>GET /img/:key?w=400</code>) sau CDN cache, và gọi tên cost duy nhất nó thêm: latency first-view.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có hệ số N, một so sánh storage pre-generate vs on-demand, và cost của một regeneration pass.</p></div>

<h3>🔬 Đo thật: một ảnh điện thoại, pipeline của kho, srcset, và sinh khi cần</h3>
<p>Một ảnh điện thoại thật 12 triệu điểm ảnh qua pipeline 14 biến thể (sharp 0.35.3 — bản kho đang dùng — vào MinIO, middleware đếm PUT), rồi chính hàm <code>optimizeImage()</code> của kho trên cùng tệp:</p>
<div class="out">$ node no.mjs
ảnh gốc 3024×4032, 2.313.191 B
  photo-320w.jpg          14.968 B
  photo-320w.webp         13.886 B
  photo-320w.avif          8.564 B
  photo-640w.jpg          61.978 B
  photo-640w.webp         54.032 B
  photo-640w.avif         33.832 B
  photo-1280w.jpg        214.435 B
  photo-1280w.webp       175.444 B
  photo-1280w.avif       105.845 B
  photo-1920w.jpg        417.999 B
  photo-1920w.webp       315.126 B
  photo-1920w.avif       188.218 B
  photo-blur.jpg             338 B
TỔNG 14 object · 3.917.856 B (biến thể thêm 69% so với gốc) · 14 lệnh PUT = 14 Class A
$ npx tsx kho.mts
optimizeImage: 2.313.191 B ⇒ 156.658 B · image/webp · 1200×1600 · 1 object, gốc KHÔNG giữ
$ grep -n "MAX_WIDTH =\\|WEBP_QUALITY =\\|const key = buildKey" src/storage/imageOptimizer.ts src/storage/uploadService.ts
src/storage/imageOptimizer.ts:43:const MAX_WIDTH = 1200;
src/storage/imageOptimizer.ts:44:const WEBP_QUALITY = 80;
src/storage/uploadService.ts:109:  const key = buildKey(category, originalNameForKey, options);</div>
<p>Tính lại các phép nhân của bài (R2 $4,50 mỗi triệu Class A, $0,36 mỗi triệu Class B, chưa trừ miễn phí):</p>
<div class="out">$ node toan.mjs
album 10.000 ảnh × 14 biến thể, dựng lại 1 lần: 140.000 PUT ⇒ $0.63
  dựng lại mỗi tuần (4,33 lần/tháng): $2.73/tháng   (bài cũ ghi $30)
  dựng lại mỗi ngày (30 lần/tháng):   $18.90/tháng   (bài cũ ghi $210)
app kiểu Instagram: tải mới 2.800.000 + dựng lại 2.800.000 = 5.600.000 PUT ⇒ R2 $25.20 · S3 $28.00   (bài cũ cộng hai lần: 8,4 triệu ⇒ $37,80)
feed: 200.000 ảnh × 40 lượt/ngày × 30 ngày = 240 triệu GET ⇒ $86.40/tháng nếu MỌI lượt chạm bucket (không CDN)</div>
<p><code>srcset</code> ba biến thể có tải ba ảnh không? Một máy chủ nhỏ đếm request ảnh trong lúc Chromium thật (Playwright) mở trang ở ba kiểu màn hình:</p>
<div class="out">$ node srcset.mjs
điện thoại 390px, DPR 3  ⇒ 1 request ảnh: 1600w
laptop 1440px, DPR 1     ⇒ 1 request ảnh: 800w
laptop 1440px, DPR 2     ⇒ 1 request ảnh: 1600w</div>
<p>Sinh khi cần: <code>GET /img/&lt;key&gt;?w=…</code> tải ảnh gốc khi MISS, thu nhỏ, giữ lại. Lần xem đầu so với lần đã có — và bản 1200 px giống từng byte với kết quả của <code>optimizeImage()</code> (cùng thiết lập sharp):</p>
<div class="out">$ for i in 1 2 3; do curl -s -o /dev/null -D - -w 'thời gian %{time_total}s · %{size_download} B\\n' 'http://127.0.0.1:20251/img/u42/1794700000000/photo-original.jpg?w=400' | grep -iE '^x-|thời gian' | tr -d '\\r' | paste -sd' ' -; done
x-cache: MISS x-s3-get: 1 thời gian 0.142124s · 21648 B
x-cache: HIT x-s3-get: 1 thời gian 0.000984s · 21648 B
x-cache: HIT x-s3-get: 1 thời gian 0.000846s · 21648 B
$ curl -s -o /dev/null -D - -w 'thời gian %{time_total}s · %{size_download} B\\n' 'http://127.0.0.1:20251/img/u42/1794700000000/photo-original.jpg?w=1200' | grep -iE '^x-|thời gian' | tr -d '\\r' | paste -sd' ' -
x-cache: MISS x-s3-get: 2 thời gian 0.204931s · 156658 B</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Đời thật:</strong> tiệm in ảnh in sẵn mỗi ảnh 14 cỡ &quot;cho chắc&quot; — rồi đổi loại giấy và in lại cả kho. Tiệm thông minh giữ ảnh gốc, khách hỏi cỡ nào in cỡ đó, để sẵn ở quầy (CDN) cho lần sau.</li>
<li><strong>Nếu</strong> nhà thiết kế xin thêm cỡ 2560 px? Thêm cho ảnh mới, ảnh cũ sinh dần khi có người xem. Ở kho này thì không làm được — ảnh gốc không giữ — đó là đánh đổi có chủ đích.</li>
<li><strong>Góc kẻ xấu (đo thật):</strong> đường dẫn sinh khi cần mà nhận mọi độ rộng thì ai cũng ép máy chủ thu nhỏ lại mỗi request:</li>
</ul>
<div class="out">$ for w in $(seq 401 420); do curl -s -o /dev/null -D - "http://127.0.0.1:20251/img/u42/…/photo-original.jpg?w=$w" | grep -i x-cache; done | sort | uniq -c
  20 x-cache: MISS
$ time (for w in $(seq 421 440); do curl -s -o /dev/null "…?w=$w"; done)   # 20 lần resize tuần tự
20 độ rộng mới: 1536 ms CPU resize · x-s3-get: 41</div>
<p>Hai mươi độ rộng mới, hai mươi lần MISS; ảnh gốc 2,3 MB bị tải bốn mươi mốt lần. Trên Cloudflare Images, mỗi phép biến đổi duy nhất vượt 5.000 mỗi tháng đều tính tiền. Chỉ nhận một danh sách độ rộng cố định (hoặc ký đường dẫn).</p>
<h3>🔁 Tự chạy lại</h3>
<p>Cho một ảnh thật qua pipeline ghi nhiều cỡ và định dạng vào MinIO, đếm PUT; mở một trang có <code>srcset</code> ba ứng viên trong DevTools ở hai cỡ màn hình, đếm request ảnh; rồi viết một đường dẫn sinh khi cần có danh sách độ rộng cho phép, đo MISS so với HIT.</p>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/media-processing/learn?lessonSlug=mp-1-3-resize" target="_blank" rel="noopener"><span class="lc-ico">🎞</span><span class="lc-body"><span class="lc-title">Media Processing · 1.3 — resize(): fit mode, và cờ chặn phóng to</span><span class="lc-sub">Thu nhỏ ảnh bằng sharp cho đúng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-2-next-image" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.2 — Component Image: ảnh nhanh, miễn phí</span><span class="lc-sub">Để framework chọn cỡ ảnh</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variant</span><span class="v">Object dẫn xuất (resize/re-encode) từ một bản upload gốc.</span></div>
  <div class="kv"><span class="k">Pre-generation</span><span class="v">Ghi mọi variant ngay lúc upload, dù có được xem hay không.</span></div>
  <div class="kv"><span class="k">On-demand generation</span><span class="v">Tạo variant ở request đầu tiên, rồi cache lại.</span></div>
  <div class="kv"><span class="k">CDN cache</span><span class="v">Lớp edge serve variant sau lần miss đầu, cắt Class B.</span></div>
  <div class="kv"><span class="k">Regeneration pass</span><span class="v">Ghi lại toàn bộ variant sau khi đổi luật — N&times; Class A.</span></div>
  <div class="kv"><span class="k">First-view latency</span><span class="v">Độ trễ một lần để dựng variant ở request đầu tiên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một upload thành 10–15 object variant, nên storage và Class A nhân theo hệ số N.</li><li>Mỗi regeneration pass ghi lại N&times; object — một bill Class A bốn chữ số âm thầm.</li><li>Sinh on-demand sau CDN cache đánh đổi latency first-view nhỏ lấy mức tiết kiệm 10–100&times; so pre-generate mọi thứ.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare Images — pricing</span><span class="lc-sub">developers.cloudflare.com/images/pricing — biến đổi ảnh lưu ở nơi khác (vd R2): 5.000 phép biến đổi duy nhất/tháng miễn phí, sau đó $0,50 mỗi 1.000; $5/100k chỉ áp cho ảnh lưu trong Images.</span></span></div>
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
${G07_3}
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
<pre><code class="language-text">On Cloudflare (docs updated 13/11/2026):
  Manage Account -&gt; Billing -&gt; Billable Usage -&gt; Create budget alert
  Budget threshold (USD) + email recipients, e.g. $60 then $90
  - account-wide usage-based spend (all products), not per bucket
  - ONE email when the cumulative spend crosses the threshold
  - informational only: it does NOT stop usage; Pay-as-you-go accounts
  (per-product usage notifications, Pro plan and up, live under Notifications)

On AWS:
  Billing -&gt; Budgets -&gt; Create budget -&gt; Cost budget
  Amount: $200, monthly
  Alert: 80% actual  -&gt; SNS topic  -&gt; ops-pager email
  Alert: 100% actual -&gt; SNS topic  -&gt; ops-pager phone
  Alert: 100% forecast -&gt; SNS topic -&gt; ops-slack channel
</code></pre>

<p>The trick is picking the number. Take last month's steady-state, multiply by 1.5, and use that as the first alarm. Then multiply again by 1.5 for the pager alarm. The goal is not to be right; it is to hear about a doubling within days, not weeks.</p>

<h3>Layer 2 — the rate alarm (catches it while it's happening)</h3>
<pre><code class="language-text">R2 (no built-in rate alarm — build one):
  Source: GraphQL Analytics API, dataset r2OperationsAdaptiveGroups
          (actionType, bucketName, responseStatusCode, datetime; ≤ 31 days)
  Poll every minute, baseline = your steady state (e.g. 400 ops/min)
  Alarm: 5× baseline for 15 consecutive minutes -&gt; chat / pager
  A migration script easily hits 20,000 ops/min — measured lab run below.

AWS CloudWatch on S3:
  Metric: AllRequests, or PutRequests / GetRequests separately
  Statistic: Sum, period 1 minute
  Threshold: static, based on your baseline × 5-10
  Action: SNS -&gt; PagerDuty or Slack
</code></pre>

<p>The rate alarm is the only defense that catches a runaway script <em>while</em> it is running. Budget alerts are trailing — they page you after the money is spent. The alarm gives you a chance to kill the script before it finishes.</p>

<h3>Layer 3 — request logging (the forensic tool)</h3>
<pre><code class="language-text">R2 Data Access Logs (docs 02/10/2026) — per bucket:
  Bucket settings -&gt; Data Access Logs -&gt; Enabled; view in Workers Observability

Each event carries:
  - $metadata.timestamp, action (GetObject, PutObject, ListObjectsV2, …)
  - actor.accessKeyId  (which SigV4 key signed it), actor.type, interface
  - request.method, request.uri, response.status, request/response bytes
  - requestMetadata.ip, requestMetadata.userAgent
  Kept 7 days. ONLY status &lt; 400 — failed requests are not logged.
  Best effort: events may be delayed or omitted. (No R2 dataset in Logpush.)

S3 has this in two flavors:
  - S3 Server Access Logs (older, delayed, less structured)
  - S3 Object-Level API Logging via CloudTrail (real-time, structured, expensive)
</code></pre>

<p>R2 keeps Data Access Logs for 7 days — export them if you want 30. When the mystery Class A charge happens, you grep the logs by hour, count operations per token, and within 5 minutes you know: <em>token</em> <code>ci-migration-2026-08</code> <em>made 4.2 million LIST calls between Friday 18:00 and Sunday 22:00</em>. Now you know who to talk to. Without logs, you never find out.</p>

<h3>What the query looks like after an incident (illustrative — a measured run is further down)</h3>
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

<h3>Estimated log storage cost (assumptions, not a measurement)</h3>
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Create a budget alert on one bucket at steady state &times; 1.5 (Cloudflare billing notification, or an AWS Budgets alert on the S3 side).</li>
<li>Define a rate alarm in words: page me when Class A ops/min &gt; baseline &times; 5 sustained 15+ minutes — then write the metric query that would fire it.</li>
<li>Turn on request logging to a SEPARATE bucket with a 30-day lifecycle so a runaway job cannot also bloat the log.</li>
<li>Write the single forensic query you would run after a spike: group logged requests by access-key/token to answer &quot;which token did this&quot;.</li>
</ol>
<p><strong>Done when:</strong> all three defenses exist on the bucket and you have the post-incident query written down.</p></div>

<h3>🔬 Measured: a rate alarm, a forensic query, and the log loop</h3>
<p>Lab (MinIO RELEASE.2026-11-12 with its audit webhook writing one JSON line per request, SDK v3 3.1071.0, jq 1.7.1): three keys for three jobs. <code>app-primary</code> calls at a normal pace; at ~10 s <code>ci-migration-2026-11</code> starts listing in a loop. The alarm below counts LIST requests every 2 s, learns a baseline from the first 3 windows, and fires after 3 consecutive windows above max(baseline × 5, 5/s):</p>
<pre><code class="language-javascript"><span class="tok-comment">// canh.mjs — "cảnh báo tốc độ" tự viết: mỗi 2 giây đếm số LIST trong dòng nhật ký mới (đời thật: hỏi R2 GraphQL r2OperationsAdaptiveGroups / CloudWatch mỗi phút),</span>
<span class="tok-comment">// mốc nền = trung bình 3 cửa sổ đầu; báo động khi &gt; max(mốc nền × 5, 5/giây) ba cửa sổ LIÊN TIẾP (lab: 3 × 2 s; thật: 15 × 1 phút).</span>
import { openSync, readSync, fstatSync } from 'node:fs';
const fd = openSync('audit.jsonl', 'r'), t0 = Date.now();
let doc = fstatSync(fd).size, nen = [], vuot = 0, bao = false;
const dem = () =&gt; { const het = fstatSync(fd).size, b = Buffer.alloc(het - doc); readSync(fd, b, 0, b.length, doc); doc = het;
  return b.toString().split('\\n').filter((l) =&gt; l.includes('"name":"ListObjectsV2"')).length; };
for (let i = 0; i &lt; 16; i++) {
  await new Promise((r) =&gt; setTimeout(r, 2000));
  const toc = dem() / 2;
  const muc = nen.length &lt; 3 ? null : Math.max(5 * nen.reduce((a, b) =&gt; a + b, 0) / nen.length, 5);
  if (muc === null) nen.push(toc); else vuot = toc &gt; muc ? vuot + 1 : 0;
  const tt = muc === null ? 'đo mốc nền' : vuot &gt;= 3 ? '🚨 BÁO ĐỘNG' : vuot ? &#96;vượt \${vuot}/3&#96; : 'bình thường';
  console.log(&#96;t=+\${String(Math.round((Date.now() - t0) / 1000)).padStart(2)}s  LIST/giây \${toc.toFixed(1).padStart(6)}  ngưỡng \${muc === null ? '     —' : muc.toFixed(1).padStart(6)}  \${tt}&#96;);
  if (vuot &gt;= 3 &amp;&amp; !bao) { bao = true; console.log(&#96;   ⇒ gửi cảnh báo lúc t=+\${Math.round((Date.now() - t0) / 1000)}s — script vẫn đang chạy, còn kịp chặn&#96;); }
}</code></pre>
<div class="out">$ node canh.mjs        # chạy song song: lưu lượng app-primary từ giây 0, script ci-migration-2026-11 chạy loạn từ giây ~10
t=+ 2s  LIST/giây    1.0  ngưỡng      —  đo mốc nền
t=+ 4s  LIST/giây    1.0  ngưỡng      —  đo mốc nền
t=+ 6s  LIST/giây    0.5  ngưỡng      —  đo mốc nền
t=+ 8s  LIST/giây    1.0  ngưỡng    5.0  bình thường
t=+10s  LIST/giây    0.5  ngưỡng    5.0  bình thường
t=+12s  LIST/giây  216.5  ngưỡng    5.0  vượt 1/3
t=+14s  LIST/giây  261.5  ngưỡng    5.0  vượt 2/3
t=+16s  LIST/giây  286.5  ngưỡng    5.0  🚨 BÁO ĐỘNG
   ⇒ gửi cảnh báo lúc t=+16s — script vẫn đang chạy, còn kịp chặn
t=+18s  LIST/giây  287.0  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+20s  LIST/giây  297.5  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+22s  LIST/giây  281.5  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+24s  LIST/giây  275.5  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+26s  LIST/giây  294.5  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+28s  LIST/giây  273.0  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+30s  LIST/giây  249.0  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+32s  LIST/giây    2.5  ngưỡng    5.0  bình thường</div>
<p>Then the question after the incident — which key did this? 40 extra requests were sent with a wrong secret:</p>
<div class="out">$ wc -l audit.jsonl     # mỗi request S3 = một dòng JSON
5999
$ jq -r 'select(.api.name=="ListObjectsV2") | .accessKey' audit.jsonl | sort | uniq -c | sort -rn
5432 ci-migration-2026-11
  40 (sai chữ ký — không gắn được khoá)
  29 app-primary
   1 backup-worker
$ jq -r 'select(.accessKey=="ci-migration-2026-11") | [.api.name, .remotehost, .userAgent[0:40]] | @tsv' audit.jsonl | sort | uniq -c
5432 ListObjectsV2	172.17.0.1	aws-sdk-js/3.1071.0 ua/2.1 os/darwin#27.
$ jq -r 'select(.api.statusCode&gt;=400) | [.api.name, .api.statusCode, .accessKey // "(sai chữ ký)"] | @tsv' audit.jsonl | sort | uniq -c
  40 ListObjectsV2	403	(sai chữ ký)
   1 ListObjectsV2	403	backup-worker</div>
<p>Failed signatures carry no key (the signature never verified); and R2's Data Access Logs would not show any of the 4xx lines at all. Last, the trap of logging into the bucket being logged — one upload, the log writer PUTs every event back into the same bucket:</p>
<div class="out">$ printf x | aws s3 cp - s3://kho-73/media/mot-request.jpg &amp;&amp; echo "1 request ban đầu"
1 request ban đầu
8 giây sau MỘT request ban đầu: 2090 lệnh PUT nhật ký (Class A) — và vẫn đang tăng</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>Real life:</strong> a house has an electricity bill (budget alert — tells you after the money is gone), a smoke detector (rate alarm — while the fire is small) and a security camera (request log — who came in, when, through which door). A teammate's debug loop left running over a weekend is the classic Monday surprise.</li>
<li><strong>What if</strong> the whole team shares one key? The per-key query returns one line: you learn that it happened, never who. And if you look on day 9, R2's 7-day logs are gone.</li>
<li><strong>The attacker's view:</strong> with a leaked key, staying unseen means staying <em>under</em> the threshold — 4 LIST/s never trips a 5/s alarm yet is 10,368,000 Class A (~$46.66) a month — or sending requests that fail, which R2's logs never record. Defences: thresholds from a real baseline, one key per workload so a stranger key stands out, a budget alert for what slips under, rotation on any doubt, edge logs for the failures.</li>
</ul>
<h3>🔁 Run it yourself</h3>
<p>Enable MinIO's audit webhook to a tiny HTTP collector that appends JSON lines, create two or three users, generate normal traffic with one and a listing loop with another, run the alarm next to them, then answer &quot;which key did this?&quot; with one jq query.</p>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-10-2-log-json-escape" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">Nginx · 10.2 — JSON logs, and the escape that decides if a machine can read them</span><span class="lc-sub">Logs a query can read</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-9-3-log" target="_blank" rel="noopener"><span class="lc-ico">🖥</span><span class="lc-body"><span class="lc-title">Deploy VPS · 9.3 — Logs that answer questions</span><span class="lc-sub">Logging for the incident you have not had yet</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Budget alert</span><span class="v">Pages you when monthly spend crosses steady state &times; 1.5.</span></div>
  <div class="kv"><span class="k">Rate alarm</span><span class="v">Pages you when ops/min exceeds a baseline multiple for N minutes.</span></div>
  <div class="kv"><span class="k">Baseline</span><span class="v">The normal rate an alarm multiplies to find anomalies.</span></div>
  <div class="kv"><span class="k">Request logging</span><span class="v">Per-request audit lines written to a separate bucket.</span></div>
  <div class="kv"><span class="k">Blast radius</span><span class="v">How much damage one leaked/looping token can do before you notice.</span></div>
  <div class="kv"><span class="k">Forensics</span><span class="v">Querying the logs after an incident to name the cause.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Three defenses on day one: budget alert (spend &times; 1.5), rate alarm (Class A ops/min &times; 5), and request logging to a separate bucket for 30 days.</li><li>Together they cost under $2/month and catch what any one alone would miss.</li><li>Logging is what lets you answer &quot;which token did this&quot; — without it, a spike is a mystery.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Budget alerts</span><span class="lc-sub">developers.cloudflare.com/billing/manage/budget-alerts — account-wide USD threshold, one email, does not stop usage.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — Cost budgets</span><span class="lc-sub">docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html — SNS action targets.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — R2 Data Access Logs</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/data-access-logs — fields, 7-day retention, status &lt; 400 only.</span></span></div>
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
<pre><code class="language-text">Trên Cloudflare (tài liệu cập nhật 13/11/2026):
  Manage Account -&gt; Billing -&gt; Billable Usage -&gt; Create budget alert
  Ngưỡng (USD) + email nhận, vd $60 rồi $90
  - tính chi tiêu theo mức dùng của CẢ tài khoản, không theo bucket
  - MỘT email khi tổng chi tiêu vượt ngưỡng
  - chỉ để báo: KHÔNG chặn việc dùng; tài khoản Pay-as-you-go
  (thông báo theo từng sản phẩm, gói Pro trở lên, nằm ở Notifications)

Trên AWS:
  Billing -&gt; Budgets -&gt; Create budget -&gt; Cost budget
  Amount: $200, hàng tháng
  Alert: 80% actual  -&gt; SNS topic  -&gt; ops-pager email
  Alert: 100% actual -&gt; SNS topic  -&gt; ops-pager phone
  Alert: 100% forecast -&gt; SNS topic -&gt; ops-slack channel
</code></pre>

<p>Mẹo là chọn số. Lấy steady-state tháng trước, nhân 1.5, và dùng làm alarm đầu. Rồi nhân 1.5 tiếp cho alarm pager. Mục đích không phải đúng; mà là nghe về nhân đôi trong ngày, không phải tuần.</p>

<h3>Lớp 2 — alarm rate (bắt khi đang xảy)</h3>
<pre><code class="language-text">R2 (không có báo động tốc độ sẵn — tự dựng):
  Nguồn: GraphQL Analytics API, tập dữ liệu r2OperationsAdaptiveGroups
         (actionType, bucketName, responseStatusCode, datetime; ≤ 31 ngày)
  Hỏi mỗi phút, mốc nền = mức bình thường (vd 400 op/phút)
  Báo động: gấp 5 mốc nền 15 phút liền -&gt; chat / pager
  Script migration dễ chạm 20.000 op/phút — lượt đo trong lab ở dưới.

AWS CloudWatch trên S3:
  Metric: AllRequests, hoặc PutRequests / GetRequests riêng
  Statistic: Sum, period 1 phút
  Threshold: static, dựa baseline × 5-10
  Action: SNS -&gt; PagerDuty hoặc Slack
</code></pre>

<p>Alarm rate là phòng thủ duy nhất bắt script chạy trốn <em>khi</em> đang chạy. Alert budget là trailing — page bạn sau khi tiền tiêu. Alarm cho cơ hội giết script trước khi xong.</p>

<h3>Lớp 3 — log request (tool forensic)</h3>
<pre><code class="language-text">R2 Data Access Logs (tài liệu 02/10/2026) — theo từng bucket:
  Bucket settings -&gt; Data Access Logs -&gt; Enabled; xem trong Workers Observability

Mỗi event mang:
  - $metadata.timestamp, action (GetObject, PutObject, ListObjectsV2, …)
  - actor.accessKeyId  (khoá SigV4 nào ký), actor.type, interface
  - request.method, request.uri, response.status, byte vào/ra
  - requestMetadata.ip, requestMetadata.userAgent
  Giữ 7 ngày. CHỈ mã &lt; 400 — request thất bại không được ghi.
  Best effort: event có thể trễ hoặc thiếu. (Logpush không có dataset R2.)

S3 có ở hai dạng:
  - S3 Server Access Log (cũ hơn, trễ, ít structured)
  - Log API Object-Level S3 qua CloudTrail (real-time, structured, đắt)
</code></pre>

<p>R2 giữ Data Access Logs 7 ngày — muốn 30 ngày thì tự xuất ra. Khi charge Class A bí ẩn xảy, bạn grep log theo giờ, đếm op per token, và trong 5 phút bạn biết: <em>token</em> <code>ci-migration-2026-08</code> <em>gọi 4.2 triệu LIST giữa thứ Sáu 18:00 và Chủ nhật 22:00</em>. Giờ biết nói chuyện với ai. Không log, không bao giờ tìm ra.</p>

<h3>Query trông thế nào sau incident (minh hoạ — lượt đo thật ở bên dưới)</h3>
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

<h3>Ước tính chi phí lưu log (giả định, không phải số đo)</h3>
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo budget alert trên một bucket ở mức steady state &times; 1.5 (notification billing Cloudflare, hoặc AWS Budgets bên S3).</li>
<li>Định nghĩa rate alarm bằng lời: page tôi khi Class A op/phút &gt; baseline &times; 5 kéo dài 15+ phút — rồi viết câu query metric sẽ kích hoạt nó.</li>
<li>Bật request logging ra một bucket RIÊNG với lifecycle 30 ngày để một job chạy loạn không phình luôn cả log.</li>
<li>Viết câu query forensic duy nhất bạn sẽ chạy sau spike: gom request đã log theo access-key/token để trả lời &quot;token nào làm cái này&quot;.</li>
</ol>
<p><strong>Đạt khi:</strong> cả ba phòng thủ có trên bucket và bạn đã ghi sẵn câu query sau sự cố.</p></div>

<h3>🔬 Đo thật: cảnh báo tốc độ, truy vấn điều tra, và vòng lặp nhật ký</h3>
<p>Lab (MinIO RELEASE.2026-11-12 bật audit webhook, mỗi request một dòng JSON; SDK v3 3.1071.0; jq 1.7.1): ba khoá cho ba việc. <code>app-primary</code> gọi nhịp bình thường; tới giây ~10 <code>ci-migration-2026-11</code> bắt đầu liệt kê lặp liên tục. Bộ cảnh báo dưới đây đếm LIST mỗi 2 giây, học mốc nền từ 3 cửa sổ đầu, và báo động sau 3 cửa sổ liền vượt max(mốc nền × 5, 5/giây):</p>
<pre><code class="language-javascript"><span class="tok-comment">// canh.mjs — "cảnh báo tốc độ" tự viết: mỗi 2 giây đếm số LIST trong dòng nhật ký mới (đời thật: hỏi R2 GraphQL r2OperationsAdaptiveGroups / CloudWatch mỗi phút),</span>
<span class="tok-comment">// mốc nền = trung bình 3 cửa sổ đầu; báo động khi &gt; max(mốc nền × 5, 5/giây) ba cửa sổ LIÊN TIẾP (lab: 3 × 2 s; thật: 15 × 1 phút).</span>
import { openSync, readSync, fstatSync } from 'node:fs';
const fd = openSync('audit.jsonl', 'r'), t0 = Date.now();
let doc = fstatSync(fd).size, nen = [], vuot = 0, bao = false;
const dem = () =&gt; { const het = fstatSync(fd).size, b = Buffer.alloc(het - doc); readSync(fd, b, 0, b.length, doc); doc = het;
  return b.toString().split('\\n').filter((l) =&gt; l.includes('"name":"ListObjectsV2"')).length; };
for (let i = 0; i &lt; 16; i++) {
  await new Promise((r) =&gt; setTimeout(r, 2000));
  const toc = dem() / 2;
  const muc = nen.length &lt; 3 ? null : Math.max(5 * nen.reduce((a, b) =&gt; a + b, 0) / nen.length, 5);
  if (muc === null) nen.push(toc); else vuot = toc &gt; muc ? vuot + 1 : 0;
  const tt = muc === null ? 'đo mốc nền' : vuot &gt;= 3 ? '🚨 BÁO ĐỘNG' : vuot ? &#96;vượt \${vuot}/3&#96; : 'bình thường';
  console.log(&#96;t=+\${String(Math.round((Date.now() - t0) / 1000)).padStart(2)}s  LIST/giây \${toc.toFixed(1).padStart(6)}  ngưỡng \${muc === null ? '     —' : muc.toFixed(1).padStart(6)}  \${tt}&#96;);
  if (vuot &gt;= 3 &amp;&amp; !bao) { bao = true; console.log(&#96;   ⇒ gửi cảnh báo lúc t=+\${Math.round((Date.now() - t0) / 1000)}s — script vẫn đang chạy, còn kịp chặn&#96;); }
}</code></pre>
<div class="out">$ node canh.mjs        # chạy song song: lưu lượng app-primary từ giây 0, script ci-migration-2026-11 chạy loạn từ giây ~10
t=+ 2s  LIST/giây    1.0  ngưỡng      —  đo mốc nền
t=+ 4s  LIST/giây    1.0  ngưỡng      —  đo mốc nền
t=+ 6s  LIST/giây    0.5  ngưỡng      —  đo mốc nền
t=+ 8s  LIST/giây    1.0  ngưỡng    5.0  bình thường
t=+10s  LIST/giây    0.5  ngưỡng    5.0  bình thường
t=+12s  LIST/giây  216.5  ngưỡng    5.0  vượt 1/3
t=+14s  LIST/giây  261.5  ngưỡng    5.0  vượt 2/3
t=+16s  LIST/giây  286.5  ngưỡng    5.0  🚨 BÁO ĐỘNG
   ⇒ gửi cảnh báo lúc t=+16s — script vẫn đang chạy, còn kịp chặn
t=+18s  LIST/giây  287.0  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+20s  LIST/giây  297.5  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+22s  LIST/giây  281.5  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+24s  LIST/giây  275.5  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+26s  LIST/giây  294.5  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+28s  LIST/giây  273.0  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+30s  LIST/giây  249.0  ngưỡng    5.0  🚨 BÁO ĐỘNG
t=+32s  LIST/giây    2.5  ngưỡng    5.0  bình thường</div>
<p>Rồi câu hỏi sau sự cố — khoá nào làm việc này? Có thêm 40 request gửi bằng secret sai:</p>
<div class="out">$ wc -l audit.jsonl     # mỗi request S3 = một dòng JSON
5999
$ jq -r 'select(.api.name=="ListObjectsV2") | .accessKey' audit.jsonl | sort | uniq -c | sort -rn
5432 ci-migration-2026-11
  40 (sai chữ ký — không gắn được khoá)
  29 app-primary
   1 backup-worker
$ jq -r 'select(.accessKey=="ci-migration-2026-11") | [.api.name, .remotehost, .userAgent[0:40]] | @tsv' audit.jsonl | sort | uniq -c
5432 ListObjectsV2	172.17.0.1	aws-sdk-js/3.1071.0 ua/2.1 os/darwin#27.
$ jq -r 'select(.api.statusCode&gt;=400) | [.api.name, .api.statusCode, .accessKey // "(sai chữ ký)"] | @tsv' audit.jsonl | sort | uniq -c
  40 ListObjectsV2	403	(sai chữ ký)
   1 ListObjectsV2	403	backup-worker</div>
<p>Request sai chữ ký không mang khoá nào (chữ ký chưa từng hợp lệ); còn Data Access Logs của R2 thì không có dòng 4xx nào cả. Cuối cùng là bẫy ghi nhật ký vào chính bucket đang được ghi — một lần tải lên, bộ ghi nhật ký PUT mọi event ngược vào cùng bucket:</p>
<div class="out">$ printf x | aws s3 cp - s3://kho-73/media/mot-request.jpg &amp;&amp; echo "1 request ban đầu"
1 request ban đầu
8 giây sau MỘT request ban đầu: 2090 lệnh PUT nhật ký (Class A) — và vẫn đang tăng</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Đời thật:</strong> ngôi nhà có hoá đơn tiền điện (cảnh báo ngân sách — báo khi tiền đã mất), máy báo khói (cảnh báo tốc độ — lúc lửa còn nhỏ) và camera an ninh (nhật ký — ai vào, lúc nào, cửa nào). Vòng lặp debug của bạn cùng nhóm để chạy cả cuối tuần là bất ngờ kinh điển sáng thứ Hai.</li>
<li><strong>Nếu</strong> cả nhóm dùng chung một khoá? Câu truy vấn theo khoá chỉ trả một dòng: biết có chuyện, không bao giờ biết ai. Và nếu ngày thứ 9 mới xem, nhật ký 7 ngày của R2 đã mất.</li>
<li><strong>Góc kẻ xấu:</strong> có khoá lộ mà muốn ẩn thì đi <em>dưới</em> ngưỡng — 4 LIST/giây không bao giờ chạm báo động 5/giây nhưng vẫn là 10.368.000 Class A (~$46,66) mỗi tháng — hoặc gửi request thất bại mà nhật ký R2 không ghi. Cách phòng: ngưỡng từ mốc nền thật, mỗi việc một khoá để khoá lạ lộ ra ngay, cảnh báo ngân sách bắt phần lọt dưới ngưỡng, xoay khoá khi nghi ngờ, xem nhật ký lớp biên cho request thất bại.</li>
</ul>
<h3>🔁 Tự chạy lại</h3>
<p>Bật audit webhook của MinIO tới một máy thu HTTP nhỏ ghi từng dòng JSON, tạo hai ba user, cho một user gọi bình thường và một user liệt kê lặp, chạy bộ cảnh báo bên cạnh, rồi trả lời &quot;khoá nào làm việc này?&quot; bằng một câu jq.</p>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-10-2-log-json-escape" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">Nginx · 10.2 — Log JSON, và cái escape quyết định máy có đọc nổi không</span><span class="lc-sub">Nhật ký mà câu truy vấn đọc được</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-9-3-log" target="_blank" rel="noopener"><span class="lc-ico">🖥</span><span class="lc-body"><span class="lc-title">Deploy VPS · 9.3 — Log TRẢ LỜI ĐƯỢC câu hỏi</span><span class="lc-sub">Ghi log cho sự cố chưa xảy ra</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Budget alert</span><span class="v">Page bạn khi tiêu tháng vượt steady state &times; 1.5.</span></div>
  <div class="kv"><span class="k">Rate alarm</span><span class="v">Page bạn khi op/phút vượt một bội số baseline trong N phút.</span></div>
  <div class="kv"><span class="k">Baseline</span><span class="v">Mức bình thường mà alarm nhân lên để tìm bất thường.</span></div>
  <div class="kv"><span class="k">Request logging</span><span class="v">Dòng audit mỗi request ghi ra một bucket riêng.</span></div>
  <div class="kv"><span class="k">Blast radius</span><span class="v">Thiệt hại một token lộ/chạy loạn gây ra trước khi bạn phát hiện.</span></div>
  <div class="kv"><span class="k">Forensics</span><span class="v">Query log sau sự cố để gọi tên nguyên nhân.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ba phòng thủ ngay ngày đầu: budget alert (tiêu &times; 1.5), rate alarm (Class A op/phút &times; 5), và request logging ra bucket riêng 30 ngày.</li><li>Cùng nhau chúng tốn dưới $2/tháng và bắt được điều mà từng cái riêng lẻ sẽ bỏ sót.</li><li>Logging là thứ cho bạn trả lời &quot;token nào làm cái này&quot; — thiếu nó, một spike là một ẩn số.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Budget alerts</span><span class="lc-sub">developers.cloudflare.com/billing/manage/budget-alerts — ngưỡng USD cả tài khoản, một email, không chặn việc dùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — Cost budgets</span><span class="lc-sub">docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html — target action SNS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — R2 Data Access Logs</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/data-access-logs — các trường, giữ 7 ngày, chỉ mã &lt; 400.</span></span></div>
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
              'Query request logs (R2 Data Access Logs, field actor.accessKeyId — kept 7 days / CloudTrail data events on AWS) grouped by key, sorted by count. The runaway is almost always one token an order of magnitude above the next-biggest. That names the caller — rotate the token or kill the script. Without logs, you never find out.|||Query log request (Data Access Logs của R2, trường actor.accessKeyId — giữ 7 ngày / CloudTrail data event trên AWS) group theo khoá, sort theo count. Runaway gần như luôn là một token một order độ lớn trên caller lớn thứ nhì. Đó tên caller — xoay token hoặc giết script. Không log, không bao giờ tìm ra.',
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
