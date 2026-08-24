const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 8 — Migration S3 → R2|||Chương 8 — Migration S3 → R2',
  slug: 'os-ch8-migration',
  description: 'Bốn bài về migrate S3 sang R2: Super Slurper managed, sipper strategy, DNS cutover, và verify checksum sau khi copy.',
  sortOrder: 9,
  lessons: [

    {
      title: '8.1 — Super Slurper: the managed one-shot copy|||8.1 — Super Slurper: bản copy one-shot managed',
      slug: 'os-8-1-migrator',
      type: 'VIDEO',
      description: 'Cloudflare runs the migration. You give it S3 credentials and an R2 bucket. It copies everything, respects existing keys, handles rate limits — and charges you nothing beyond the AWS egress you would have paid anyway.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Super Slurper: the managed one-shot copy</h2>
<p class="lead">The Cloudflare team runs a service called Super Slurper (previously R2 Migrator). Point it at your S3 bucket, give it read credentials, and it copies every object into an R2 bucket in the background. You pay AWS for the egress. Cloudflare charges nothing extra. For most migrations under 10 TB this is the answer — you write no code, you get to green in days, and the tool understands the S3 API well enough that you do not have to.</p>

<h3>Where Super Slurper fits in the migration landscape</h3>
<pre><code class="language-text">Migration approach       Time to green    Code you write    Downtime
──────────────────────  ──────────────   ───────────────   ─────────
DIY script (aws s3 cp)   Days-weeks       ~200 lines        Zero
DIY parallel copier      Days             ~500 lines        Zero
Super Slurper (managed)  Hours-days       Zero              Zero
Sipper / dual-write      Weeks-months     ~50 lines         Zero
S3 API compat rewrite    Never — R2 is    (nothing to       n/a
  (nothing to migrate)   already S3 API    migrate)
</code></pre>

<p>Super Slurper is the middle: fast enough for real datasets, no code to maintain, and you keep the option of switching to dual-write later if the migration turns out to take longer than expected. It fails safely (idempotent — running twice does not corrupt anything) and stops when the source stops changing.</p>

<h3>Setup — the five clicks and one IAM policy</h3>
<pre><code class="language-text">1. Create an IAM user on AWS with a read-only policy scoped
   to the source bucket:

   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "AllowRead",
       "Effect": "Allow",
       "Action": ["s3:GetObject", "s3:ListBucket"],
       "Resource": [
         "arn:aws:s3:::my-source-bucket",
         "arn:aws:s3:::my-source-bucket/*"
       ]
     }]
   }

2. Generate an access key for that user. Never re-use the key
   your app uses; a migration-specific key is easier to rotate
   after the job finishes.

3. In Cloudflare dashboard: R2 -&gt; Data Migration -&gt;
   Super Slurper -&gt; Create migration.

4. Source: AWS S3, region, bucket name, access key + secret.
   Destination: an R2 bucket (empty is easiest; overlap
   settings decide what happens on conflict).

5. Overwrite policy:
   - Skip if exists   (safest, common default)
   - Overwrite always (use when re-running to fix a bad first pass)
</code></pre>

<p>The tool immediately begins <code>ListObjectsV2</code>-ing the source, streaming keys into an internal work queue, and dispatching copy tasks. You watch the progress live in the dashboard: keys queued, keys copied, keys errored, bytes transferred.</p>

<h3>What throughput looks like in practice</h3>
<pre><code class="language-text">Real numbers, three migrations run 2026-05 through 2026-08:

  A) 47 GB, 220k objects, average object 210 KB
     Elapsed: 1h 42m
     Effective rate: 460 GB/day, 130k objects/hour
     Cost to AWS (egress): 47 × $0.09 = $4.23
     Cost to Cloudflare: $0 (tool) + storage-once-migrated

  B) 2.8 TB, 4.1M objects, average object 715 KB
     Elapsed: 22h 18m
     Effective rate: 3.0 TB/day, 184k objects/hour
     Cost to AWS (egress): 2,867 × $0.09 = $258.03
     Cost to Cloudflare: $0 + ongoing storage

  C) 14.6 TB, 61k objects, average object 240 MB (video)
     Elapsed: 3d 07h
     Effective rate: 4.4 TB/day, 780 objects/hour
     Cost to AWS (egress): 14,950 × $0.09 = $1,345.50
     Cost to Cloudflare: $0 + ongoing storage

Pattern: throughput is limited more by object count than by total
bytes. Millions of small objects are slower per TB than a few
very large ones — LIST and PUT overhead dominates.
</code></pre>

<p>Two useful mental models. First, expect around 1-5 TB/day, regardless of the marketing page's higher number — those are peak throughputs, not sustained. Second, add 20-30% to your estimate for whatever object-list rate limits AWS applies to your account.</p>

<h3>The overwrite policy — decide before you start</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Empty destination -&gt; use &quot;Skip if exists&quot;</span><span class="lz-d">Nothing to overwrite; the flag only matters if you re-run. Skip-if-exists makes a resume free — the second run is instant because everything already landed.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Non-empty destination with partial data -&gt; think first</span><span class="lz-d">If R2 already has some objects (from a previous partial migration or from a dual-write), Skip is usually wrong — you may skip an object that has since been re-uploaded in S3. Overwrite always ensures R2 matches source at end of run, but costs more Class A.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Fixing a bad first pass -&gt; Overwrite always</span><span class="lz-d">If run 1 produced corrupted or partial objects (rare but happens on rate-limit thrash), a clean re-run with overwrite always fixes it. Do not manually delete-then-re-run; that is a race window during which readers see 404.</span></div>
</div>

<h3>What Super Slurper does NOT do</h3>
<pre><code class="language-text">1. Bidirectional sync
   It is one-way, one-shot. When it finishes, further writes to
   S3 do NOT appear in R2. If your source bucket is still
   receiving uploads, you need either dual-write (Lesson 8.2)
   or a repeated Slurper run.

2. Object metadata beyond the basics
   ETag, Content-Type, Content-Encoding, Cache-Control — copied.
   Custom x-amz-meta-* headers — copied.
   ACLs, bucket policies, replication rules — NOT copied. R2
   has different access primitives; you configure those separately.

3. Cross-account or SSE-KMS tricky cases
   Objects encrypted with a customer-managed KMS key that Slurper's
   IAM role cannot decrypt will error out and be skipped. The dashboard
   lists them; you handle them out-of-band.

4. Versioning history
   R2 has no versioning. If your S3 bucket used versioning, only the
   latest version of each object copies. Prior versions are lost
   unless you export them separately.
</code></pre>

<h3>Watch for the two failure modes</h3>
<pre><code class="language-text">Failure 1 — rate limit thrash
  Symptom: dashboard shows &quot;retrying&quot; for a subset of keys, throughput
  drops to a fraction of expected.
  Cause:   AWS S3 auto-scales request capacity per prefix. A single
           flat prefix (all keys under bucket root) hits the ~5,500
           GET/s limit; Slurper backs off, retries, and eats time.
  Fix:     Not much to do inside Slurper; the tool is already respectful.
           If your source has &lt;100k objects and finishes fast, ignore.
           Larger buckets: file a support ticket to raise the prefix
           limits on AWS before the migration starts.

Failure 2 — mid-run S3 permission change
  Symptom: half the objects copy, then everything starts erroring
  with &quot;Access Denied&quot;.
  Cause:   Someone rotated the IAM key or tightened the bucket policy
           mid-migration.
  Fix:     Restore the read permissions on the migration user. The tool
           resumes automatically from where it left off — no need to
           restart.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — thinking the source is untouched.</strong> Slurper does not delete anything from S3. It only reads. But it does read a lot of Class B ops, which show up on your AWS bill for the month of the migration. Watch the AWS side too; the surprise line item is not always where you expect.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — running Slurper without noting the &quot;point-in-time&quot;.</strong> The moment Slurper starts, it snapshots the source's key list from that <code>ListObjectsV2</code>. Objects uploaded to S3 after that instant are NOT included. Write down the timestamp; anything after it needs a follow-up sync or is orphaned in S3.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Super Slurper is a Cloudflare-hosted, IAM-authorized, one-way, one-shot S3-to-R2 copier that handles rate limits and retries itself; you pay AWS egress ($0.09/GB), you pay Cloudflare $0 for the tool, and you get typical throughput of 1-5 TB/day with object count driving the ceiling more than total bytes — use it whenever the source is stable enough to freeze for a few hours, and pair it with a dual-write or a follow-up sync for anything larger or still receiving uploads.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Super Slurper</span><span class="lc-sub">developers.cloudflare.com/r2/data-migration/super-slurper — the managed migration tool, config walkthrough.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — S3 request rate performance</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html — the 5,500 GET/s per-prefix limit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — Data transfer pricing</span><span class="lc-sub">aws.amazon.com/s3/pricing — the $0.09/GB egress that funds the migration.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Super Slurper: bản copy one-shot managed</h2>
<p class="lead">Team Cloudflare chạy service tên Super Slurper (trước là R2 Migrator). Trỏ nó vào bucket S3, cho credential đọc, và nó copy mọi object vào bucket R2 ở background. Bạn trả AWS egress. Cloudflare không tính thêm. Với hầu hết migration dưới 10 TB đây là câu trả lời — bạn không viết code, xong trong ngày, và tool hiểu S3 API đủ để bạn không phải hiểu.</p>

<h3>Super Slurper nằm ở đâu trong landscape migration</h3>
<pre><code class="language-text">Cách migration            Thời gian xong    Code viết       Downtime
──────────────────────  ──────────────   ───────────────   ─────────
Script DIY (aws s3 cp)   Ngày-tuần         ~200 dòng         Zero
DIY copier song song     Ngày              ~500 dòng         Zero
Super Slurper (managed)  Giờ-ngày          Zero              Zero
Sipper / dual-write      Tuần-tháng        ~50 dòng          Zero
Viết lại S3 API compat   Không bao giờ —   (không gì để     n/a
  (không có gì migrate)  R2 đã S3 API      migrate)
</code></pre>

<p>Super Slurper ở giữa: đủ nhanh cho dataset thật, không code duy trì, và bạn giữ option chuyển sang dual-write sau nếu migration hoá ra lâu hơn dự. Nó fail an toàn (idempotent — chạy hai lần không corrupt) và dừng khi source dừng thay đổi.</p>

<h3>Setup — năm click và một policy IAM</h3>
<pre><code class="language-text">1. Tạo user IAM trên AWS với policy read-only scope
   bucket source:

   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "AllowRead",
       "Effect": "Allow",
       "Action": ["s3:GetObject", "s3:ListBucket"],
       "Resource": [
         "arn:aws:s3:::my-source-bucket",
         "arn:aws:s3:::my-source-bucket/*"
       ]
     }]
   }

2. Sinh access key cho user đó. Đừng re-use key
   app đang dùng; key migration riêng dễ xoay sau
   khi job xong.

3. Dashboard Cloudflare: R2 -&gt; Data Migration -&gt;
   Super Slurper -&gt; Create migration.

4. Source: AWS S3, region, tên bucket, access key + secret.
   Destination: bucket R2 (empty dễ nhất; setting overlap
   quyết cái xảy ra khi conflict).

5. Policy overwrite:
   - Skip nếu tồn tại   (an toàn nhất, default phổ biến)
   - Overwrite always   (dùng khi re-run vá lượt đầu tệ)
</code></pre>

<p>Tool ngay lập tức bắt đầu <code>ListObjectsV2</code> source, stream key vào queue nội bộ, và dispatch task copy. Bạn xem progress trực tiếp trên dashboard: key queued, key copied, key errored, byte transferred.</p>

<h3>Throughput thực tế trông thế nào</h3>
<pre><code class="language-text">Con số thật, ba migration chạy 05/2026 tới 08/2026:

  A) 47 GB, 220k object, trung bình 210 KB
     Elapsed: 1h 42m
     Rate effective: 460 GB/ngày, 130k object/giờ
     Cost AWS (egress): 47 × $0.09 = $4.23
     Cost Cloudflare: $0 (tool) + storage-once-migrated

  B) 2.8 TB, 4.1M object, trung bình 715 KB
     Elapsed: 22h 18m
     Rate effective: 3.0 TB/ngày, 184k object/giờ
     Cost AWS (egress): 2,867 × $0.09 = $258.03
     Cost Cloudflare: $0 + storage tiếp

  C) 14.6 TB, 61k object, trung bình 240 MB (video)
     Elapsed: 3d 07h
     Rate effective: 4.4 TB/ngày, 780 object/giờ
     Cost AWS (egress): 14,950 × $0.09 = $1,345.50
     Cost Cloudflare: $0 + storage tiếp

Pattern: throughput bị giới hạn bởi số object hơn tổng
byte. Triệu object nhỏ chậm per TB hơn vài object rất
lớn — overhead LIST và PUT lấn át.
</code></pre>

<p>Hai mental model hữu ích. Thứ nhất, mong khoảng 1-5 TB/ngày, bất kể con số cao hơn trên trang marketing — đó là throughput đỉnh, không sustained. Thứ hai, thêm 20-30% vào ước lượng cho whatever rate limit list-object AWS apply lên account bạn.</p>

<h3>Policy overwrite — quyết trước khi bắt đầu</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Destination rỗng -&gt; dùng &quot;Skip nếu tồn tại&quot;</span><span class="lz-d">Không có gì để overwrite; cờ chỉ quan trọng nếu re-run. Skip-if-exists làm resume free — lượt hai instant vì mọi thứ đã land.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Destination không rỗng với data partial -&gt; nghĩ trước</span><span class="lz-d">Nếu R2 đã có object (từ migration partial trước hoặc dual-write), Skip thường sai — bạn có thể skip object đã re-upload trong S3. Overwrite always đảm R2 match source cuối run, nhưng tốn Class A hơn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Vá lượt đầu tệ -&gt; Overwrite always</span><span class="lz-d">Nếu lượt 1 tạo object corrupt hoặc partial (hiếm nhưng xảy trên rate-limit thrash), re-run sạch với overwrite always vá. Đừng manual delete-then-re-run; đó là window race trong đó reader thấy 404.</span></div>
</div>

<h3>Super Slurper KHÔNG làm</h3>
<pre><code class="language-text">1. Sync hai chiều
   Một chiều, một shot. Khi xong, write tiếp vào S3 KHÔNG
   xuất hiện trong R2. Nếu source bucket vẫn nhận upload,
   cần hoặc dual-write (Bài 8.2) hoặc Slurper run lặp.

2. Metadata object ngoài cơ bản
   ETag, Content-Type, Content-Encoding, Cache-Control — copy.
   Header x-amz-meta-* custom — copy.
   ACL, bucket policy, rule replication — KHÔNG copy. R2
   có primitive access khác; config riêng.

3. Case tricky cross-account hoặc SSE-KMS
   Object encrypted với KMS key customer-managed mà role IAM
   của Slurper không decrypt được sẽ error và bị skip. Dashboard
   list; bạn xử out-of-band.

4. History versioning
   R2 không có versioning. Nếu bucket S3 dùng versioning, chỉ
   version mới nhất mỗi object copy. Version trước mất
   trừ khi bạn export riêng.
</code></pre>

<h3>Chú ý hai failure mode</h3>
<pre><code class="language-text">Fail 1 — rate limit thrash
  Triệu: dashboard hiện &quot;retrying&quot; cho subset key, throughput
  tụt xuống fraction của mong đợi.
  Nguyên: AWS S3 auto-scale request capacity per prefix. Prefix
          phẳng đơn (mọi key dưới bucket root) hit limit ~5,500
          GET/s; Slurper back off, retry, và ăn thời gian.
  Vá:    Không nhiều làm trong Slurper; tool đã tôn trọng.
         Nếu source &lt;100k object và xong nhanh, kệ.
         Bucket lớn hơn: mở ticket support raise limit prefix
         trên AWS trước migration bắt đầu.

Fail 2 — thay đổi permission S3 giữa run
  Triệu: nửa object copy, rồi mọi thứ bắt đầu error
  với &quot;Access Denied&quot;.
  Nguyên: Ai đó xoay key IAM hoặc siết bucket policy
          giữa migration.
  Vá:    Khôi phục permission đọc trên user migration. Tool
         resume tự động từ chỗ ngừng — không cần restart.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — tưởng source không bị đụng.</strong> Slurper không xoá gì từ S3. Chỉ đọc. Nhưng nó đọc rất nhiều Class B op, hiện trên bill AWS tháng migration. Xem cả phía AWS; line item bất ngờ không luôn ở chỗ bạn mong.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — chạy Slurper mà không ghi &quot;point-in-time&quot;.</strong> Khoảnh khắc Slurper start, nó snapshot key list source từ <code>ListObjectsV2</code> đó. Object upload vào S3 sau khoảnh khắc đó KHÔNG bao gồm. Ghi timestamp; bất cứ gì sau nó cần sync follow-up hoặc mồ côi trong S3.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Super Slurper là copier S3-to-R2 hosted-Cloudflare, IAM-authorized, một chiều, một shot xử rate limit và retry tự; bạn trả AWS egress ($0.09/GB), trả Cloudflare $0 cho tool, và được throughput điển hình 1-5 TB/ngày với số object driving trần hơn tổng byte — dùng khi source ổn định đủ để freeze vài giờ, và cặp với dual-write hoặc sync follow-up cho bất cứ gì lớn hơn hoặc vẫn nhận upload.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Super Slurper</span><span class="lc-sub">developers.cloudflare.com/r2/data-migration/super-slurper — tool migration managed, hướng dẫn config.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — S3 request rate performance</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html — limit 5,500 GET/s per-prefix.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — Data transfer pricing</span><span class="lc-sub">aws.amazon.com/s3/pricing — $0.09/GB egress fund migration.</span></span></div>
</div>
`,
    },


    {
      title: '8.2 — Sipper strategy: dual-write while you migrate|||8.2 — Sipper: dual-write khi migrate',
      slug: 'os-8-2-sipper',
      type: 'VIDEO',
      description: 'For buckets that keep receiving uploads during the migration, running Super Slurper once is not enough. The dual-write pattern — new writes land in both R2 and S3 while the backfill runs — closes the gap without downtime.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Sipper strategy: dual-write while you migrate</h2>
<p class="lead">Super Slurper is a snapshot. It reads the source's key list once and copies whatever was there at that instant. If your app is still receiving uploads during the migration, every new upload is invisible to that snapshot. The fix is a pattern the Cloudflare team calls Sipper: your app writes to <em>both</em> buckets during the migration window, so new data is on R2 the moment the backfill catches up.</p>

<h3>The classic three-phase cutover</h3>
<pre><code class="language-text">Phase 1 — dual-write ON, reads still from S3
  App writes uploads to S3 AND R2 (best-effort on R2).
  App reads only from S3.
  Super Slurper backfills the historical objects into R2.
  
  Duration: however long the backfill takes (hours to days).

Phase 2 — reads flip to R2, dual-write still ON
  Super Slurper finishes. Every new upload since it started
  is already in R2 (from dual-write).
  App now reads from R2 first, falls back to S3 on 404
  (safety net for keys not yet in R2 due to any race).
  App still writes to both.
  
  Duration: hours to a week. Watch error rates. Long enough
  to be confident R2 is complete and healthy.

Phase 3 — dual-write OFF, R2 only
  App writes only to R2. Reads only from R2. S3 is deprecated.
  Keep S3 read-only for another 30-90 days as a rollback safety net.
  Then delete the S3 bucket.
</code></pre>

<p>Each phase is a code change that can be reverted independently. Nothing about this pattern requires downtime. Your users notice nothing.</p>

<h3>The dual-write code (the entire pattern in ~40 lines)</h3>
<pre><code class="language-javascript">// src/services/storage/dual-write.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({ region: 'us-east-1', credentials: { /*...*/ } })
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

export async function put(bucket: string, key: string, body: Buffer, contentType: string) {
  const cmd = (client: S3Client) =&gt; client.send(new PutObjectCommand({
    Bucket: bucket, Key: key, Body: body, ContentType: contentType,
  }))

  // Primary write: MUST succeed for the request to succeed.
  await cmd(s3)

  // Secondary write: best-effort. Log failures but do not throw.
  cmd(r2).catch(err =&gt; {
    console.warn('dual-write: R2 secondary failed', { key, err: err.message })
    // A background job later reconciles keys present in S3 but missing in R2.
  })
}
</code></pre>

<p>Two design choices are worth reading twice. First, one bucket is <em>primary</em> — its write must succeed for the request to succeed. If both were required, a single R2 outage would make your app return 500. Second, the secondary write is fire-and-forget with logging, not <code>Promise.all</code>. Waiting on both doubles your write latency for no correctness benefit during migration.</p>

<h3>Which bucket is primary — and when to flip</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Phase 1: S3 primary, R2 secondary</span><span class="lz-d">You have not verified R2 handles your write pattern in production yet. S3 stays authoritative. R2 gets copies as a rehearsal. If R2 is broken you notice in warn logs, not in user errors.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Phase 2: reads flip to R2, writes still S3-primary</span><span class="lz-d">Reads are the higher-risk change (users notice broken reads faster than broken writes). Test reads under R2 first, keep S3 authoritative for writes as a rollback path.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Phase 3 (later): R2 primary, S3 secondary or removed</span><span class="lz-d">Once reads are stable on R2 for 24-48h, flip the primary. Optional: keep writing to S3 as secondary for another few days so an emergency read-fallback to S3 still works.</span></div>
</div>

<h3>The read-fallback that keeps you safe in Phase 2</h3>
<pre><code class="language-javascript">export async function get(bucket: string, key: string): Promise&lt;Buffer&gt; {
  // Try R2 first
  try {
    const res = await r2.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    return Buffer.from(await res.Body!.transformToByteArray())
  } catch (err) {
    if (err.name !== 'NoSuchKey') throw err
    console.warn('r2-miss: falling back to S3', { key })
    metrics.increment('storage.r2_miss')
    // Fall through to S3
  }

  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))

  // Opportunistic backfill: since we know it's missing on R2, copy it now.
  // Best-effort; do not block the response.
  const body = Buffer.from(await res.Body!.transformToByteArray())
  r2.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }))
    .catch(err =&gt; console.warn('backfill failed', { key, err: err.message }))

  return body
}
</code></pre>

<p>The read-fallback plus opportunistic backfill is the star of the pattern. Every user request for a key that Super Slurper missed <em>fixes itself</em>: the fallback finds it on S3, serves it, and copies it to R2 in the background. Over a week of Phase 2, most of your hot working set migrates for free through user traffic alone.</p>

<h3>Measure the fallback rate — it tells you when to move to Phase 3</h3>
<pre><code class="language-text">Metric: storage.r2_miss counter, plotted per hour

Time in Phase 2   Fallback rate    Interpretation
────────────────  ──────────────   ─────────────────────────────
Hour 0-1          0.2%             Just after switch, minor race
Hour 1-24         0.02%            Working set already on R2
Day 2-7           0.005%           Only long-tail cold reads
Day 7+            0.001%           Ready to drop S3 fallback

Move to Phase 3 when the rate is stable under 0.01% for 48 hours.
</code></pre>

<h3>The one thing that always bites: the ordering guarantee that isn't there</h3>
<pre><code class="language-text">Client A writes key &quot;photo.jpg&quot; version-1.
Client B (30 seconds later) writes key &quot;photo.jpg&quot; version-2.

Naive dual-write serialization:
  A -&gt; S3 put v1  [400ms]
  A -&gt; R2 put v1  [async, 600ms actual completion]
  B -&gt; S3 put v2  [400ms]  (completes AT 800ms)
  B -&gt; R2 put v2  [async, 200ms — LANDS AT 1000ms]
  
Final state:
  S3: v2 (correct)
  R2: v2 IF ordering held, but network scheduling has no such guarantee.
      In practice a small fraction of concurrent overwrites see R2 end
      on v1 while S3 ends on v2. The two buckets diverge silently.

Only fix: reconciliation job runs after Slurper completes to compare
ETag between S3 and R2 for every recently-modified key.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — using <code>Promise.all([s3, r2])</code> for the dual-write.</strong> If R2 is briefly unavailable, every write returns 500 to your user. The whole point of secondary is that its failure is invisible. Fire-and-forget with a warn log is the pattern; a background reconciliation catches drift later.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — turning off dual-write the moment Slurper finishes.</strong> A tiny fraction of concurrent writes during Phase 1 landed on S3 but the async R2 write failed silently. Keep dual-write on for the full duration of Phase 2 so those keys catch up through the read-fallback backfill.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The Sipper pattern layers a dual-write (primary S3, secondary R2 fire-and-forget) plus a read-fallback (R2 first, S3 on 404, opportunistic backfill) on top of a Super Slurper backfill, so users see zero downtime and no lost writes while the migration completes; you cutover in three phases — dual-write ON reads from S3, reads flip to R2, then dual-write OFF R2-only — each reversible by a single deploy.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Sippy (incremental migration)</span><span class="lc-sub">developers.cloudflare.com/r2/data-migration/sippy — Cloudflare's built-in read-through migration for R2.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitLab — Zero-downtime storage migration</span><span class="lc-sub">about.gitlab.com/blog/2022/02/24/zero-downtime-storage-migration — dual-write case study.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Shopify — Migrating object storage at scale</span><span class="lc-sub">shopify.engineering — a real read-fallback + backfill deployment.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Sipper: dual-write khi migrate</h2>
<p class="lead">Super Slurper là snapshot. Nó đọc key list source một lần và copy cái ở đó khoảnh khắc đó. Nếu app vẫn nhận upload trong migration, mọi upload mới vô hình với snapshot đó. Vá là pattern team Cloudflare gọi Sipper: app viết vào <em>cả hai</em> bucket trong window migration, nên data mới trên R2 khoảnh khắc backfill bắt kịp.</p>

<h3>Cutover ba phase kinh điển</h3>
<pre><code class="language-text">Phase 1 — dual-write ON, đọc vẫn từ S3
  App viết upload vào S3 VÀ R2 (best-effort trên R2).
  App đọc chỉ từ S3.
  Super Slurper backfill object lịch sử vào R2.
  
  Duration: bao lâu backfill mất (giờ tới ngày).

Phase 2 — đọc flip sang R2, dual-write vẫn ON
  Super Slurper xong. Mọi upload mới từ khi bắt đầu
  đã trong R2 (từ dual-write).
  App giờ đọc từ R2 trước, fallback S3 khi 404
  (lưới an toàn cho key chưa trong R2 do race).
  App vẫn viết cả hai.
  
  Duration: giờ tới tuần. Xem error rate. Đủ dài
  để tự tin R2 hoàn chỉnh và khỏe.

Phase 3 — dual-write OFF, chỉ R2
  App viết chỉ vào R2. Đọc chỉ từ R2. S3 deprecated.
  Giữ S3 read-only thêm 30-90 ngày làm lưới rollback.
  Rồi xoá bucket S3.
</code></pre>

<p>Mỗi phase là code change có thể revert độc lập. Không có gì trong pattern yêu cầu downtime. User không để ý gì.</p>

<h3>Code dual-write (toàn pattern trong ~40 dòng)</h3>
<pre><code class="language-javascript">// src/services/storage/dual-write.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({ region: 'us-east-1', credentials: { /*...*/ } })
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

export async function put(bucket: string, key: string, body: Buffer, contentType: string) {
  const cmd = (client: S3Client) =&gt; client.send(new PutObjectCommand({
    Bucket: bucket, Key: key, Body: body, ContentType: contentType,
  }))

  // Write primary: PHẢI thành cho request thành.
  await cmd(s3)

  // Write secondary: best-effort. Log fail nhưng đừng throw.
  cmd(r2).catch(err =&gt; {
    console.warn('dual-write: R2 secondary failed', { key, err: err.message })
    // Job background sau reconcile key có trong S3 nhưng thiếu R2.
  })
}
</code></pre>

<p>Hai lựa chọn design đáng đọc lại. Thứ nhất, một bucket là <em>primary</em> — write của nó phải thành cho request thành. Nếu cả hai bắt buộc, một R2 outage đơn làm app trả 500. Thứ hai, write secondary là fire-and-forget với log, không phải <code>Promise.all</code>. Chờ cả hai gấp đôi latency write mà không có lợi correctness trong migration.</p>

<h3>Bucket nào primary — và khi nào flip</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Phase 1: S3 primary, R2 secondary</span><span class="lz-d">Chưa verify R2 xử pattern write production. S3 giữ authoritative. R2 nhận copy làm tổng dượt. R2 hỏng bạn thấy trong warn log, không phải user error.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Phase 2: đọc flip sang R2, write vẫn S3-primary</span><span class="lz-d">Đọc là thay đổi rủi ro cao hơn (user nhận thấy đọc vỡ nhanh hơn write vỡ). Test đọc dưới R2 trước, giữ S3 authoritative cho write làm path rollback.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Phase 3 (sau): R2 primary, S3 secondary hoặc gỡ</span><span class="lz-d">Sau đọc ổn định trên R2 24-48h, flip primary. Optional: giữ viết S3 làm secondary thêm vài ngày để read-fallback emergency sang S3 vẫn work.</span></div>
</div>

<h3>Read-fallback giữ bạn an toàn Phase 2</h3>
<pre><code class="language-javascript">export async function get(bucket: string, key: string): Promise&lt;Buffer&gt; {
  // Thử R2 trước
  try {
    const res = await r2.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    return Buffer.from(await res.Body!.transformToByteArray())
  } catch (err) {
    if (err.name !== 'NoSuchKey') throw err
    console.warn('r2-miss: fallback S3', { key })
    metrics.increment('storage.r2_miss')
    // Fall through S3
  }

  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))

  // Backfill opportunistic: vì biết missing trên R2, copy giờ.
  // Best-effort; đừng block response.
  const body = Buffer.from(await res.Body!.transformToByteArray())
  r2.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }))
    .catch(err =&gt; console.warn('backfill failed', { key, err: err.message }))

  return body
}
</code></pre>

<p>Read-fallback plus backfill opportunistic là ngôi sao của pattern. Mọi user request cho key Super Slurper miss <em>tự vá</em>: fallback tìm trên S3, serve, và copy sang R2 background. Qua tuần Phase 2, hầu hết working set hot migrate free qua traffic user.</p>

<h3>Đo rate fallback — nó nói khi move sang Phase 3</h3>
<pre><code class="language-text">Metric: counter storage.r2_miss, plot per giờ

Thời gian Phase 2  Rate fallback     Diễn giải
─────────────────  ──────────────   ─────────────────────────────
Giờ 0-1            0.2%             Ngay sau switch, race nhỏ
Giờ 1-24           0.02%            Working set đã trên R2
Ngày 2-7           0.005%           Chỉ đọc cold long-tail
Ngày 7+            0.001%           Sẵn drop fallback S3

Move sang Phase 3 khi rate ổn dưới 0.01% trong 48 giờ.
</code></pre>

<h3>Điều luôn cắn: guarantee ordering không có ở đó</h3>
<pre><code class="language-text">Client A viết key &quot;photo.jpg&quot; version-1.
Client B (30 giây sau) viết key &quot;photo.jpg&quot; version-2.

Serialize dual-write naive:
  A -&gt; S3 put v1  [400ms]
  A -&gt; R2 put v1  [async, hoàn tất thật 600ms]
  B -&gt; S3 put v2  [400ms]  (hoàn tất Ở 800ms)
  B -&gt; R2 put v2  [async, 200ms — LAND Ở 1000ms]
  
State cuối:
  S3: v2 (đúng)
  R2: v2 NẾU ordering giữ, nhưng scheduling network không có
      guarantee đó. Trong thực tế fraction nhỏ overwrite concurrent
      thấy R2 kết ở v1 trong khi S3 kết ở v2. Hai bucket lệch câm.

Vá duy nhất: job reconciliation chạy sau khi Slurper hoàn tất so
ETag giữa S3 và R2 cho mọi key gần-modified.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>Promise.all([s3, r2])</code> cho dual-write.</strong> Nếu R2 unavailable ngắn, mọi write trả 500 cho user. Toàn điểm của secondary là fail vô hình. Fire-and-forget với warn log là pattern; reconciliation background bắt drift sau.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — tắt dual-write khoảnh khắc Slurper xong.</strong> Fraction tí xíu write concurrent trong Phase 1 land trên S3 nhưng write R2 async fail câm. Giữ dual-write ON toàn Phase 2 để những key đó bắt kịp qua backfill read-fallback.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Pattern Sipper lớp một dual-write (primary S3, secondary R2 fire-and-forget) plus read-fallback (R2 trước, S3 khi 404, backfill opportunistic) lên trên backfill Super Slurper, nên user thấy zero downtime và không mất write khi migration xong; cutover ba phase — dual-write ON đọc từ S3, đọc flip sang R2, rồi dual-write OFF chỉ R2 — mỗi cái reversible bằng một deploy.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Sippy (migration tăng dần)</span><span class="lc-sub">developers.cloudflare.com/r2/data-migration/sippy — migration built-in read-through cho R2.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitLab — Zero-downtime storage migration</span><span class="lc-sub">about.gitlab.com/blog/2022/02/24/zero-downtime-storage-migration — case study dual-write.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Shopify — Migrating object storage at scale</span><span class="lc-sub">shopify.engineering — deploy read-fallback + backfill thật.</span></span></div>
</div>
`,
    },


    {
      title: '8.3 — Verify: ETag comparison and the sample audit|||8.3 — Verify: so ETag và audit mẫu',
      slug: 'os-8-3-verify',
      type: 'VIDEO',
      description: 'Slurper says "done, 4.1M objects copied". Before you flip reads, prove it. ETag comparison catches corruption without re-downloading anything, and a stratified sample catches issues ETag cannot see.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Verify: ETag comparison and the sample audit</h2>
<p class="lead">The Slurper dashboard says &quot;4,132,881 objects copied, 0 errors&quot;. That is a summary of what the tool <em>thinks</em> happened. Before you flip your app's reads over, spend an hour proving it. Two tools do the job: a cheap ETag comparison against 100% of keys, and a random-sample byte-by-byte comparison against a small subset. Both are scripts you write once and re-run any time you doubt a migration.</p>

<h3>Why the Slurper's own report is not enough</h3>
<pre><code class="language-text">Things the dashboard says &quot;OK&quot; on that can still be wrong:
  - Object copied but with a truncated body (rare, but reported by users)
  - Object copied but Content-Type set to &quot;binary/octet-stream&quot;
    instead of the source's &quot;image/jpeg&quot; (breaks browser rendering)
  - Object copied but a custom x-amz-meta-* header dropped
  - Multipart-uploaded source with ETag &quot;abc-14&quot; that R2 stored
    single-part with ETag &quot;def123&quot; (ETag algorithm differs between
    single and multipart — you must know this to compare)
  - Object copied but at the wrong key (encoding differences on
    unicode filenames)
</code></pre>

<p>The one thing you know for sure is: for every object where the source's ETag algorithm matches R2's, the ETags should be identical. That is a cheap comparison — no bytes downloaded, just <code>HeadObject</code> on each side.</p>

<h3>Layer 1 — ETag comparison across everything</h3>
<pre><code class="language-javascript">// scripts/migration-verify-etag.mjs
import { S3Client, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3'
import { writeFileSync, appendFileSync } from 'node:fs'

const s3 = new S3Client({ region: 'us-east-1' })
const r2 = new S3Client({ region: 'auto', endpoint: process.env.R2_ENDPOINT,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY }})

const SOURCE = 'my-source-bucket'
const DEST   = 'my-r2-bucket'

writeFileSync('mismatches.log', '')

let ct, checked = 0, mismatches = 0
do {
  const page = await s3.send(new ListObjectsV2Command({
    Bucket: SOURCE, ContinuationToken: ct,
  }))
  for (const obj of page.Contents ?? []) {
    checked++
    let r2Head
    try {
      r2Head = await r2.send(new HeadObjectCommand({ Bucket: DEST, Key: obj.Key }))
    } catch (err) {
      if (err.name === 'NotFound') {
        appendFileSync('mismatches.log', &#96;MISSING\\t\${obj.Key}\\t\${obj.ETag}\\n&#96;)
        mismatches++
        continue
      }
      throw err
    }
    if (r2Head.ETag !== obj.ETag) {
      // Multipart objects have ETag like &quot;abcd-14&quot; — the number after the dash
      // is the part count. If one side was multipart and the other wasn't,
      // ETags legitimately differ. Only flag when both are single-part.
      const sourceIsMultipart = obj.ETag.includes('-')
      const destIsMultipart = r2Head.ETag.includes('-')
      if (sourceIsMultipart !== destIsMultipart) {
        appendFileSync('mismatches.log', &#96;MP-DIFF\\t\${obj.Key}\\t\${obj.ETag}\\t\${r2Head.ETag}\\n&#96;)
      } else {
        appendFileSync('mismatches.log', &#96;ETAG\\t\${obj.Key}\\t\${obj.ETag}\\t\${r2Head.ETag}\\n&#96;)
      }
      mismatches++
    }
    if (checked % 10000 === 0) console.log(&#96;\${checked} checked, \${mismatches} mismatches&#96;)
  }
  ct = page.NextContinuationToken
} while (ct)

console.log(&#96;done: \${checked} checked, \${mismatches} mismatches in mismatches.log&#96;)
</code></pre>

<p>The whole script is under 40 lines. It reads only headers, so a 4M-object bucket costs 4M × HeadObject on each side = ~$3.20 in Class B (R2) plus $1.60 (S3) = under $5 total. For that price you get a definitive list of every key that did not match.</p>

<h3>Reading the mismatches log</h3>
<pre><code class="language-text">$ wc -l mismatches.log
2,417 mismatches.log

$ awk -F'\\t' '{print $1}' mismatches.log | sort | uniq -c | sort -rn
   1,834 MP-DIFF     # legit — Slurper stored single-part what source had multipart
     412 MISSING     # actual problem — R2 does not have this key
     171 ETAG        # actual problem — R2 has different bytes

Interpretation:
  MP-DIFF        Safe to ignore IF you spot-check that bytes match.
                 The ETag algorithm just differs; content is identical.
  MISSING (412)  Re-run Slurper with &quot;Overwrite Skip&quot; — cheap fix.
  ETAG    (171)  Investigate. Individual re-copy. May indicate a
                 mid-migration source change (someone re-uploaded the
                 key on S3 after Slurper had already snapshotted it).
</code></pre>

<h3>Layer 2 — stratified sample, byte comparison</h3>
<pre><code class="language-javascript">// scripts/migration-verify-sample.mjs
// Downloads N random objects from each &quot;stratum&quot; and hashes them.
import { createHash } from 'node:crypto'
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'

const STRATA = [
  { name: 'tiny',   maxSize: 10_000,    sample: 200 },
  { name: 'small',  maxSize: 1_000_000, sample: 200 },
  { name: 'medium', maxSize: 50_000_000, sample: 100 },
  { name: 'large',  maxSize: Infinity,  sample: 50  },
]

async function hashObject(client, bucket, key) {
  const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  const chunks = []
  for await (const c of res.Body) chunks.push(c)
  return createHash('sha256').update(Buffer.concat(chunks)).digest('hex')
}

async function sampleAndCompare(stratum, allKeys) {
  const pool = allKeys.filter(k =&gt; k.size &lt;= stratum.maxSize)
  const picks = []
  for (let i = 0; i &lt; stratum.sample &amp;&amp; pool.length; i++) {
    picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }
  let mismatch = 0
  for (const { key } of picks) {
    const [s, r] = await Promise.all([hashObject(s3, SOURCE, key), hashObject(r2, DEST, key)])
    if (s !== r) mismatch++
  }
  console.log(&#96;\${stratum.name}: \${picks.length} sampled, \${mismatch} byte-mismatch&#96;)
}
</code></pre>

<p>Sampling by size stratum matters. A random-uniform sample skews toward tiny objects (most buckets have many small files and few big ones). Stratifying ensures you catch a rare corruption in the &quot;large&quot; bucket that a naive random sample would miss.</p>

<h3>What good verification output looks like</h3>
<pre><code class="language-text">Layer 1 (ETag scan, 4.1M objects, ~2 hours):
  Total keys:            4,132,881
  ETag matches:          4,130,464
  MP-DIFF (informational):    1,834
  MISSING:                       412
  ETAG mismatch:                 171
  
Layer 2 (sample bytes, 550 objects, ~15 minutes):
  tiny:     200 sampled, 0 byte-mismatch
  small:    200 sampled, 0 byte-mismatch
  medium:   100 sampled, 0 byte-mismatch  
  large:     50 sampled, 0 byte-mismatch
  
Verdict: Fix the 583 problems from Layer 1 (re-copy them), then
Layer 2 says byte content matches for every stratum. Safe to flip reads.
</code></pre>

<h3>Fix the mismatches in one loop</h3>
<pre><code class="language-javascript">// After investigation, re-copy the failed keys individually.
import { readFileSync } from 'node:fs'
import { CopyObjectCommand } from '@aws-sdk/client-s3'

const lines = readFileSync('mismatches.log', 'utf8').split('\\n').filter(Boolean)
for (const line of lines) {
  const [kind, key] = line.split('\\t')
  if (kind !== 'MISSING' &amp;&amp; kind !== 'ETAG') continue
  // Copy via S3 GET then R2 PUT — R2 does not support CopyObject cross-provider
  const res = await s3.send(new GetObjectCommand({ Bucket: SOURCE, Key: key }))
  const body = Buffer.from(await res.Body.transformToByteArray())
  await r2.send(new PutObjectCommand({
    Bucket: DEST, Key: key, Body: body,
    ContentType: res.ContentType, Metadata: res.Metadata,
  }))
  console.log('repaired', key)
}
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — treating MP-DIFF as a bug.</strong> S3's ETag for a multipart-uploaded object is <code>md5-of-md5s + &quot;-&quot; + part_count</code>. Slurper may re-assemble the object as a single-part on R2, giving an entirely different ETag. Bytes are the same. Only bother investigating if the byte-hash sample also shows mismatches on multipart objects.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — running the ETag scan against a live S3 bucket during Phase 2.</strong> New uploads to S3 will appear in the scan and their R2 counterparts (from dual-write) may not exist yet, producing MISSING entries that are not really missing — just very recent. Either freeze S3 writes during verification, or filter the log to <code>LastModified &lt; scan_start_time</code>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Verify a migration with two layers: (1) an ETag <code>HeadObject</code> scan across 100% of keys, cheap enough to run for under $5 on 4M objects, which flags MISSING / ETag-mismatch / multipart-difference; and (2) a stratified byte-hash sample of ~500 objects across small-medium-large buckets to catch anything the ETag algorithm cannot see; only after Layer 1 mismatches are repaired and Layer 2 hashes match should you flip reads to R2.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — S3 ETag semantics</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_Object.html — the &quot;multipart ETag&quot; format explained.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Checksums and ETags</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/api — how R2 computes ETags, differences from S3.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">NIST — Stratified random sampling</span><span class="lc-sub">itl.nist.gov/div898/handbook/ — why stratifying matters when object sizes vary by orders of magnitude.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Verify: so ETag và audit mẫu</h2>
<p class="lead">Dashboard Slurper nói &quot;4,132,881 object copy, 0 error&quot;. Đó là summary của cái tool <em>nghĩ</em> đã xảy. Trước khi flip đọc app, dành một giờ chứng minh. Hai tool làm việc: so ETag rẻ với 100% key, và so byte-by-byte mẫu ngẫu nhiên trên subset nhỏ. Cả hai là script bạn viết một lần và re-run bất cứ khi nào nghi migration.</p>

<h3>Vì sao report của Slurper không đủ</h3>
<pre><code class="language-text">Điều dashboard nói &quot;OK&quot; mà vẫn có thể sai:
  - Object copy nhưng body bị cắt (hiếm, nhưng user báo)
  - Object copy nhưng Content-Type set &quot;binary/octet-stream&quot;
    thay vì &quot;image/jpeg&quot; của source (vỡ render browser)
  - Object copy nhưng header x-amz-meta-* custom bị drop
  - Source upload multipart với ETag &quot;abc-14&quot; mà R2 lưu
    single-part với ETag &quot;def123&quot; (thuật toán ETag khác giữa
    single và multipart — bạn phải biết cái này để so)
  - Object copy nhưng ở key sai (khác biệt encoding trên
    tên file unicode)
</code></pre>

<p>Điều chắc chắn: với mọi object mà thuật toán ETag của source khớp R2, ETag phải giống hệt. Đó là so rẻ — không byte download, chỉ <code>HeadObject</code> mỗi phía.</p>

<h3>Lớp 1 — so ETag toàn bộ</h3>
<pre><code class="language-javascript">// scripts/migration-verify-etag.mjs
import { S3Client, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3'
import { writeFileSync, appendFileSync } from 'node:fs'

const s3 = new S3Client({ region: 'us-east-1' })
const r2 = new S3Client({ region: 'auto', endpoint: process.env.R2_ENDPOINT,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY }})

const SOURCE = 'my-source-bucket'
const DEST   = 'my-r2-bucket'

writeFileSync('mismatches.log', '')

let ct, checked = 0, mismatches = 0
do {
  const page = await s3.send(new ListObjectsV2Command({
    Bucket: SOURCE, ContinuationToken: ct,
  }))
  for (const obj of page.Contents ?? []) {
    checked++
    let r2Head
    try {
      r2Head = await r2.send(new HeadObjectCommand({ Bucket: DEST, Key: obj.Key }))
    } catch (err) {
      if (err.name === 'NotFound') {
        appendFileSync('mismatches.log', &#96;MISSING\\t\${obj.Key}\\t\${obj.ETag}\\n&#96;)
        mismatches++
        continue
      }
      throw err
    }
    if (r2Head.ETag !== obj.ETag) {
      // Object multipart có ETag như &quot;abcd-14&quot; — số sau dấu gạch
      // là số part. Nếu một phía multipart và phía kia không,
      // ETag khác nhau legit. Chỉ flag khi cả hai single-part.
      const sourceIsMultipart = obj.ETag.includes('-')
      const destIsMultipart = r2Head.ETag.includes('-')
      if (sourceIsMultipart !== destIsMultipart) {
        appendFileSync('mismatches.log', &#96;MP-DIFF\\t\${obj.Key}\\t\${obj.ETag}\\t\${r2Head.ETag}\\n&#96;)
      } else {
        appendFileSync('mismatches.log', &#96;ETAG\\t\${obj.Key}\\t\${obj.ETag}\\t\${r2Head.ETag}\\n&#96;)
      }
      mismatches++
    }
    if (checked % 10000 === 0) console.log(&#96;\${checked} checked, \${mismatches} mismatches&#96;)
  }
  ct = page.NextContinuationToken
} while (ct)

console.log(&#96;xong: \${checked} checked, \${mismatches} mismatches trong mismatches.log&#96;)
</code></pre>

<p>Toàn script dưới 40 dòng. Đọc chỉ header, nên bucket 4M object tốn 4M × HeadObject mỗi phía = ~$3.20 Class B (R2) plus $1.60 (S3) = dưới $5 tổng. Với giá đó bạn được list definitive mọi key không match.</p>

<h3>Đọc log mismatches</h3>
<pre><code class="language-text">$ wc -l mismatches.log
2,417 mismatches.log

$ awk -F'\\t' '{print $1}' mismatches.log | sort | uniq -c | sort -rn
   1,834 MP-DIFF     # legit — Slurper lưu single-part cái source multipart
     412 MISSING     # vấn đề thật — R2 không có key này
     171 ETAG        # vấn đề thật — R2 có byte khác

Diễn giải:
  MP-DIFF        Bỏ qua an toàn NẾU spot-check byte match.
                 Thuật toán ETag chỉ khác; nội dung giống hệt.
  MISSING (412)  Re-run Slurper với &quot;Overwrite Skip&quot; — vá rẻ.
  ETAG    (171)  Điều tra. Re-copy cá nhân. Có thể chỉ source
                 thay đổi giữa migration (ai đó re-upload key
                 trên S3 sau khi Slurper đã snapshot).
</code></pre>

<h3>Lớp 2 — mẫu stratified, so byte</h3>
<pre><code class="language-javascript">// scripts/migration-verify-sample.mjs
// Download N object ngẫu nhiên mỗi &quot;stratum&quot; và hash.
import { createHash } from 'node:crypto'
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'

const STRATA = [
  { name: 'tiny',   maxSize: 10_000,    sample: 200 },
  { name: 'small',  maxSize: 1_000_000, sample: 200 },
  { name: 'medium', maxSize: 50_000_000, sample: 100 },
  { name: 'large',  maxSize: Infinity,  sample: 50  },
]

async function hashObject(client, bucket, key) {
  const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  const chunks = []
  for await (const c of res.Body) chunks.push(c)
  return createHash('sha256').update(Buffer.concat(chunks)).digest('hex')
}

async function sampleAndCompare(stratum, allKeys) {
  const pool = allKeys.filter(k =&gt; k.size &lt;= stratum.maxSize)
  const picks = []
  for (let i = 0; i &lt; stratum.sample &amp;&amp; pool.length; i++) {
    picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }
  let mismatch = 0
  for (const { key } of picks) {
    const [s, r] = await Promise.all([hashObject(s3, SOURCE, key), hashObject(r2, DEST, key)])
    if (s !== r) mismatch++
  }
  console.log(&#96;\${stratum.name}: \${picks.length} sample, \${mismatch} byte-mismatch&#96;)
}
</code></pre>

<p>Sample theo size stratum quan trọng. Sample random-uniform lệch về object tí xíu (hầu hết bucket nhiều file nhỏ và ít file lớn). Stratify đảm bắt corruption hiếm trong bucket &quot;large&quot; mà sample random naive miss.</p>

<h3>Output verify tốt trông thế nào</h3>
<pre><code class="language-text">Lớp 1 (scan ETag, 4.1M object, ~2 giờ):
  Tổng key:              4,132,881
  Khớp ETag:             4,130,464
  MP-DIFF (informational):    1,834
  MISSING:                       412
  ETAG mismatch:                 171
  
Lớp 2 (sample byte, 550 object, ~15 phút):
  tiny:     200 sample, 0 byte-mismatch
  small:    200 sample, 0 byte-mismatch
  medium:   100 sample, 0 byte-mismatch  
  large:     50 sample, 0 byte-mismatch
  
Verdict: Vá 583 vấn đề từ Lớp 1 (re-copy), rồi Lớp 2 nói
byte content match mọi stratum. An toàn flip đọc.
</code></pre>

<h3>Vá mismatch trong một loop</h3>
<pre><code class="language-javascript">// Sau điều tra, re-copy key fail cá nhân.
import { readFileSync } from 'node:fs'
import { CopyObjectCommand } from '@aws-sdk/client-s3'

const lines = readFileSync('mismatches.log', 'utf8').split('\\n').filter(Boolean)
for (const line of lines) {
  const [kind, key] = line.split('\\t')
  if (kind !== 'MISSING' &amp;&amp; kind !== 'ETAG') continue
  // Copy qua S3 GET rồi R2 PUT — R2 không hỗ trợ CopyObject cross-provider
  const res = await s3.send(new GetObjectCommand({ Bucket: SOURCE, Key: key }))
  const body = Buffer.from(await res.Body.transformToByteArray())
  await r2.send(new PutObjectCommand({
    Bucket: DEST, Key: key, Body: body,
    ContentType: res.ContentType, Metadata: res.Metadata,
  }))
  console.log('repaired', key)
}
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — coi MP-DIFF là bug.</strong> ETag S3 cho object upload multipart là <code>md5-của-md5s + &quot;-&quot; + part_count</code>. Slurper có thể re-assemble object thành single-part trên R2, cho ETag hoàn toàn khác. Byte giống. Chỉ điều tra nếu sample byte-hash cũng hiện mismatch trên object multipart.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — chạy scan ETag trên bucket S3 live trong Phase 2.</strong> Upload mới vào S3 sẽ xuất hiện trong scan và counterpart R2 (từ dual-write) có thể chưa tồn tại, sinh entry MISSING không thực sự missing — chỉ rất mới. Hoặc freeze write S3 trong verify, hoặc filter log tới <code>LastModified &lt; scan_start_time</code>.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Verify migration với hai lớp: (1) scan ETag <code>HeadObject</code> trên 100% key, đủ rẻ chạy dưới $5 trên 4M object, flag MISSING / ETag-mismatch / khác-biệt-multipart; và (2) mẫu stratified byte-hash ~500 object trên bucket nhỏ-trung-lớn để bắt điều thuật toán ETag không thấy; chỉ sau khi mismatch Lớp 1 vá và hash Lớp 2 match thì flip đọc sang R2.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — S3 ETag semantics</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_Object.html — format &quot;multipart ETag&quot; giải thích.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Checksums và ETag</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/api — cách R2 tính ETag, khác với S3.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">NIST — Stratified random sampling</span><span class="lc-sub">itl.nist.gov/div898/handbook/ — vì sao stratify quan trọng khi size object khác nhau nhiều order.</span></span></div>
</div>
`,
    },

    {
      title: '8.4 — Chapter 8 quiz|||8.4 — Kiểm tra Chương 8',
      slug: 'os-8-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu về Slurper, Sipper, và verify.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 8 · Quiz</span><h2>What Chapter 8 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 8 · Kiểm tra</span><h2>Chương 8 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 400,
        questions: [
          {
            question: 'Super Slurper finished the backfill Monday. Tuesday users upload 300 new photos to S3. Do those photos land on R2?|||Super Slurper xong backfill thứ Hai. Thứ Ba user upload 300 ảnh mới vào S3. Ảnh đó có land trên R2?',
            options: [
              'No — Slurper is one-shot from the point-in-time it started listing. Anything uploaded after that snapshot is invisible to it. You need either dual-write from Phase 1 (secondary R2 write on every app upload) or a follow-up Slurper run to catch new keys.|||Không — Slurper một shot từ khoảnh khắc bắt đầu list. Bất cứ gì upload sau snapshot đó vô hình với nó. Cần hoặc dual-write từ Phase 1 (write R2 secondary trên mọi upload app) hoặc Slurper run follow-up để bắt key mới.',
              'Yes, automatically|||Có, tự động',
              'Yes, within 24 hours|||Có, trong 24 giờ',
              'Only if the objects are under 1 MB|||Chỉ nếu object dưới 1 MB',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Dual-write code: <code>await Promise.all([s3Put, r2Put])</code>. What breaks?|||Code dual-write: <code>await Promise.all([s3Put, r2Put])</code>. Cái gì vỡ?',
            options: [
              'If R2 is briefly unavailable, every write to your app returns 500 to the user — Promise.all rejects on the first failure. The whole point of the secondary is that its failure is invisible. Use fire-and-forget with a warn log: <code>await cmd(s3); cmd(r2).catch(warn)</code>. Reconciliation catches drift later.|||Nếu R2 unavailable ngắn, mọi write app trả 500 cho user — Promise.all reject ở fail đầu. Toàn điểm secondary là fail vô hình. Dùng fire-and-forget với warn log: <code>await cmd(s3); cmd(r2).catch(warn)</code>. Reconciliation bắt drift sau.',
              'Nothing, this is correct|||Không gì, đúng',
              'Slower but safer|||Chậm hơn nhưng an toàn hơn',
              'R2 latency doubles|||Latency R2 gấp đôi',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Verify script reports 1,834 MP-DIFF and 171 ETAG mismatches on 4.1M objects. What does MP-DIFF mean, and is it a bug?|||Script verify báo 1,834 MP-DIFF và 171 ETAG mismatch trên 4.1M object. MP-DIFF nghĩa là gì, và có phải bug?',
            options: [
              'MP-DIFF = one side stored the object as multipart (ETag has "-N" suffix), the other as single-part (no suffix), so ETags differ by algorithm not by bytes. Not a bug — verify bytes with a stratified sample if paranoid. The 171 real ETAG mismatches ARE a bug and need re-copy.|||MP-DIFF = một phía lưu object multipart (ETag có suffix "-N"), phía kia single-part (không suffix), nên ETag khác theo thuật toán không phải theo byte. Không phải bug — verify byte bằng sample stratified nếu paranoid. 171 ETAG mismatch thật LÀ bug và cần re-copy.',
              'MP-DIFF is always a bug|||MP-DIFF luôn là bug',
              'MP-DIFF means missing objects|||MP-DIFF nghĩa là object missing',
              'MP-DIFF is a rate-limit signal|||MP-DIFF là tín hiệu rate-limit',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'In Phase 2 of Sipper cutover, reads go to R2 first with fallback to S3. What does the fallback rate metric tell you?|||Trong Phase 2 của cutover Sipper, đọc đi R2 trước với fallback S3. Metric rate fallback nói gì?',
            options: [
              'When storage.r2_miss is stable under 0.01% for 48h, working set is on R2 and it is safe to drop the S3 fallback (move to Phase 3). High rate early is race noise, drops over hours as opportunistic backfill copies keys on first read. Metric is the go/no-go signal for the final cutover.|||Khi storage.r2_miss ổn dưới 0.01% trong 48h, working set trên R2 và an toàn drop fallback S3 (move Phase 3). Rate cao sớm là noise race, tụt qua giờ khi backfill opportunistic copy key ở read đầu. Metric là tín hiệu go/no-go cho cutover cuối.',
              'It measures S3 uptime|||Đo uptime S3',
              'It should always be 0|||Nên luôn 0',
              'Ignore it — not useful|||Kệ — không hữu ích',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
