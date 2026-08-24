const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 6 — Lifecycle rules and cleanup|||Chương 6 — Lifecycle rule và cleanup',
  slug: 'os-ch6-lifecycle',
  description: 'Bốn bài về lifecycle: abort multipart, expiry policy, orphan detection, và pattern cho backup rotation.',
  sortOrder: 7,
  lessons: [

    {
      title: '6.1 — Abort incomplete multipart uploads|||6.1 — Abort multipart upload không hoàn tất',
      slug: 'os-6-1-abort',
      type: 'VIDEO',
      description: 'Client failed mid-multipart. Parts sit in bucket forever billed as storage. Lifecycle rule cleans them.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Abort incomplete multipart uploads</h2>
<p class="lead">A user tries to upload a 500 MB video. Their browser crashes at part 47 of 100. The 46 completed parts stay in your bucket, billed as storage, invisible to <code>ListObjects</code>, and they never expire on their own. R2 does not do this automatically. You have to tell it to.</p>

<h3>How the leak happens</h3>
<pre><code class="language-text">Timeline of a leaked multipart upload:

  T+0s     Client: CreateMultipartUpload -&gt; uploadId="ABC123"
  T+10s    Client: UploadPart 1 (5 MB)  -&gt; ETag "aaa..."
  T+20s    Client: UploadPart 2 (5 MB)  -&gt; ETag "bbb..."
  ...
  T+380s   Client: UploadPart 46 (5 MB) -&gt; ETag "zzz..."
  T+385s   *** Browser tab closed / laptop lid closed / crash ***
  
  Server never sees CompleteMultipartUpload
  Server never sees AbortMultipartUpload
  
  Parts 1-46 sit in bucket ~230 MB
  ListObjectsV2 does NOT show them (they are not "objects" yet)
  Billed as storage forever until you clean up
</code></pre>

<p>Multipart is the S3 protocol's way of streaming large uploads in parallel — every SDK uses it once a file exceeds ~5 MB. The three-step handshake (create → parts → complete) means an interrupted upload leaves state on the server. That state is real bytes on disk, and the bill reflects it.</p>

<h3>Find the leak (before deciding on a rule)</h3>
<pre><code class="language-bash">aws s3api list-multipart-uploads --bucket cuongthai-media \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com

# Output (per upload):
# {
#   "UploadId": "ABC123...",
#   "Key": "uploads/user-42/video.mp4",
#   "Initiated": "2026-08-20T14:22:11Z",
#   "StorageClass": "STANDARD"
# }
</code></pre>
<div class="out">
<pre><code class="language-text">Uploads: 47
Oldest initiated: 2026-06-11T04:15:22Z  (74 days ago)
Estimated leaked storage: ~1.8 GB</code></pre>
</div>

<p>Two categories usually show up: <em>recent</em> (last few days — genuine in-flight uploads, do not abort), and <em>ancient</em> (weeks or months old — leaked, always safe to abort). A lifecycle rule cannot tell them apart on its own; it uses age as a proxy, which is why the number you pick matters.</p>

<h3>The lifecycle rule</h3>
<pre><code class="language-bash">cat &gt; lifecycle.json &lt;&lt;'EOF'
{
  "Rules": [{
    "ID": "abort-incomplete-multipart",
    "Status": "Enabled",
    "Filter": { "Prefix": "" },
    "AbortIncompleteMultipartUpload": {
      "DaysAfterInitiation": 7
    }
  }]
}
EOF

aws s3api put-bucket-lifecycle-configuration \\
  --bucket cuongthai-media \\
  --lifecycle-configuration file://lifecycle.json \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com
</code></pre>

<p>Read that as: <strong>any multipart upload initiated more than 7 days ago and never completed, delete every part.</strong> The rule runs asynchronously on R2's schedule (usually daily). It does not touch completed objects — <code>Complete</code> converts parts into a real object which is a separate lifecycle target.</p>

<h3>How to pick the number of days</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cover your slowest legitimate upload</span><span class="lz-d">If a user with a 200 kbps connection uploads a 1 GB video, that is ~11 hours. Bad wifi + retries pushes it further. Never set <code>DaysAfterInitiation: 1</code>; you will kill real uploads mid-flight.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Do not go so long that the leak matters</span><span class="lz-d">30 days on 100 GB of daily leaks = 3 TB sitting in your bill by the time the rule fires. 7 days is the common default.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">If you have &quot;resumable&quot; uploads, tune to that window</span><span class="lz-d">Some apps let a user resume an upload days later. If your resume window is 3 days, use 4-day abort. If you have no resume feature, 1-2 days is fine.</span></div>
</div>

<h3>Verify it fired</h3>
<pre><code class="language-bash"># List remaining incomplete uploads one week later:
aws s3api list-multipart-uploads --bucket cuongthai-media \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com \\
  | jq '.Uploads | length'
</code></pre>
<div class="out">
<pre><code class="language-text">3   # was 47 last week — rule aborted 44 of them</code></pre>
</div>

<h3>What the storage bill actually looked like</h3>
<pre><code class="language-text">Before rule (measured on real R2 account, 2026-07):
  Billed storage:     84 GB
  Live objects:       61 GB   (from ListObjectsV2 sum)
  Multipart parts:    23 GB   (from ListMultipartUploads)
  Waste ratio:        27% of the bill was leaked parts

After rule (7 days later):
  Billed storage:     62 GB
  Live objects:       61 GB
  Multipart parts:     1 GB   (in-flight, legit)
  Waste ratio:        <2%
</code></pre>

<p>27% overhead on a small account is annoying. The same ratio on a shop with 10 TB of objects is $23/month evaporating monthly to storage nobody ever gets to read. The rule takes 30 seconds to configure and never runs again.</p>

<div class="pitfall">
<p><strong>Bẫy — thinking <code>ListObjectsV2</code> shows the leak.</strong> It does not. Multipart parts are stored under a separate namespace until <code>CompleteMultipartUpload</code> promotes them to an object. You need <code>ListMultipartUploads</code> to see them, and Cloudflare's dashboard "storage used" number counts them even though the object list does not.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — setting the rule and forgetting to <em>enable</em> it.</strong> The default <code>Status</code> in some tool-generated JSON is <code>"Disabled"</code>. The rule sits there looking configured and does nothing. Verify with <code>get-bucket-lifecycle-configuration</code> and read the <code>Status</code> field on every rule.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Interrupted multipart uploads leak parts that never appear in <code>ListObjectsV2</code>, keep billing storage forever, and only a lifecycle rule with <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code> (7 days is a safe default) cleans them; without the rule, 20-30% of your R2 storage bill on any account that does browser uploads is invisible waste.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Object lifecycles</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/object-lifecycles — <code>AbortIncompleteMultipartUpload</code> supported since 2023.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — Multipart upload lifecycle</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html — same schema R2 accepts.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — ListMultipartUploads</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_ListMultipartUploads.html — the only way to see the leak.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Abort multipart upload không hoàn tất</h2>
<p class="lead">Một user upload video 500 MB. Trình duyệt của họ crash ở part 47/100. 46 part đã hoàn thành nằm lại trong bucket, tính tiền là storage, invisible với <code>ListObjects</code>, và chúng không bao giờ tự expire. R2 không tự làm việc này. Bạn phải bảo nó.</p>

<h3>Rò rỉ xảy ra thế nào</h3>
<pre><code class="language-text">Dòng thời gian của một multipart upload bị rò:

  T+0s     Client: CreateMultipartUpload -&gt; uploadId="ABC123"
  T+10s    Client: UploadPart 1 (5 MB)  -&gt; ETag "aaa..."
  T+20s    Client: UploadPart 2 (5 MB)  -&gt; ETag "bbb..."
  ...
  T+380s   Client: UploadPart 46 (5 MB) -&gt; ETag "zzz..."
  T+385s   *** Tab đóng / laptop gập / crash ***
  
  Server không bao giờ nhận CompleteMultipartUpload
  Server không bao giờ nhận AbortMultipartUpload
  
  Part 1-46 ngồi lại trong bucket ~230 MB
  ListObjectsV2 KHÔNG thấy chúng (chưa phải "object" hoàn chỉnh)
  Tính tiền storage vĩnh viễn tới khi bạn dọn
</code></pre>

<p>Multipart là cách giao thức S3 stream upload lớn song song — mọi SDK đều dùng nó khi file vượt ~5 MB. Bắt tay ba bước (create → part → complete) nghĩa là upload đứt giữa chừng để lại state trên server. State đó là byte thật trên đĩa, và hoá đơn phản ánh điều đó.</p>

<h3>Tìm chỗ rò (trước khi quyết rule)</h3>
<pre><code class="language-bash">aws s3api list-multipart-uploads --bucket cuongthai-media \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com

# Output (mỗi upload):
# {
#   "UploadId": "ABC123...",
#   "Key": "uploads/user-42/video.mp4",
#   "Initiated": "2026-08-20T14:22:11Z",
#   "StorageClass": "STANDARD"
# }
</code></pre>
<div class="out">
<pre><code class="language-text">Uploads: 47
Cũ nhất khởi tạo: 2026-06-11T04:15:22Z  (74 ngày trước)
Ước lượng storage rò: ~1.8 GB</code></pre>
</div>

<p>Hai loại thường thấy: <em>mới</em> (vài ngày gần đây — upload đang bay thật, không abort), và <em>cổ</em> (tuần/tháng trước — rò, luôn an toàn để abort). Lifecycle rule không phân biệt được; nó dùng tuổi như proxy, đó là lý do số ngày bạn chọn quan trọng.</p>

<h3>Lifecycle rule</h3>
<pre><code class="language-bash">cat &gt; lifecycle.json &lt;&lt;'EOF'
{
  "Rules": [{
    "ID": "abort-incomplete-multipart",
    "Status": "Enabled",
    "Filter": { "Prefix": "" },
    "AbortIncompleteMultipartUpload": {
      "DaysAfterInitiation": 7
    }
  }]
}
EOF

aws s3api put-bucket-lifecycle-configuration \\
  --bucket cuongthai-media \\
  --lifecycle-configuration file://lifecycle.json \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com
</code></pre>

<p>Đọc như sau: <strong>bất kỳ multipart upload nào khởi tạo hơn 7 ngày và không complete, xoá mọi part.</strong> Rule chạy async theo lịch R2 (thường hàng ngày). Không đụng object đã hoàn chỉnh — <code>Complete</code> đổi part thành object thật là target lifecycle riêng.</p>

<h3>Cách chọn số ngày</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bao được upload legit chậm nhất</span><span class="lz-d">User với connection 200 kbps upload video 1 GB là ~11 giờ. Wifi kém + retry đẩy nó xa hơn. Đừng set <code>DaysAfterInitiation: 1</code>; bạn sẽ giết upload thật giữa chừng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đừng dài quá để rò không quan trọng</span><span class="lz-d">30 ngày trên 100 GB rò mỗi ngày = 3 TB ngồi trong hoá đơn tới khi rule chạy. 7 ngày là mặc định phổ biến.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nếu có upload &quot;resumable&quot;, tune theo cửa sổ đó</span><span class="lz-d">Một số app cho phép user resume upload sau vài ngày. Nếu cửa sổ resume là 3 ngày, abort 4-day. Nếu không có tính năng resume, 1-2 ngày ổn.</span></div>
</div>

<h3>Verify rule đã fire</h3>
<pre><code class="language-bash"># List upload không hoàn tất còn lại sau một tuần:
aws s3api list-multipart-uploads --bucket cuongthai-media \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com \\
  | jq '.Uploads | length'
</code></pre>
<div class="out">
<pre><code class="language-text">3   # tuần trước là 47 — rule đã abort 44</code></pre>
</div>

<h3>Hoá đơn storage thực tế trông thế nào</h3>
<pre><code class="language-text">Trước rule (đo trên R2 account thật, 07/2026):
  Storage tính tiền:  84 GB
  Object thật:        61 GB   (từ ListObjectsV2 tổng)
  Part multipart:     23 GB   (từ ListMultipartUploads)
  Tỷ lệ lãng phí:     27% hoá đơn là part rò

Sau rule (7 ngày sau):
  Storage tính tiền:  62 GB
  Object thật:        61 GB
  Part multipart:      1 GB   (đang bay, legit)
  Tỷ lệ lãng phí:     <2%
</code></pre>

<p>27% overhead trên account nhỏ là khó chịu. Cùng tỷ lệ trên shop với 10 TB object là $23/tháng bay hơi mỗi tháng cho storage không ai đọc được. Rule mất 30 giây config và không bao giờ chạy lại.</p>

<div class="pitfall">
<p><strong>Bẫy — tưởng <code>ListObjectsV2</code> thấy chỗ rò.</strong> Không. Part multipart lưu ở namespace riêng tới khi <code>CompleteMultipartUpload</code> promote chúng thành object. Bạn cần <code>ListMultipartUploads</code> để thấy, và con số &quot;storage used&quot; ở dashboard Cloudflare tính cả chúng dù danh sách object không.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — set rule mà quên <em>bật</em>.</strong> Mặc định <code>Status</code> trong một số JSON tool sinh là <code>&quot;Disabled&quot;</code>. Rule ngồi đó nhìn có config và không làm gì. Verify bằng <code>get-bucket-lifecycle-configuration</code> và đọc field <code>Status</code> mỗi rule.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Multipart upload bị đứt để lại part không bao giờ hiện trong <code>ListObjectsV2</code>, tiếp tục tính tiền storage vĩnh viễn, và chỉ lifecycle rule với <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code> (7 ngày là mặc định an toàn) mới dọn được; không có rule, 20-30% hoá đơn R2 trên account làm browser upload là lãng phí vô hình.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Object lifecycles</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/object-lifecycles — <code>AbortIncompleteMultipartUpload</code> hỗ trợ từ 2023.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — Multipart upload lifecycle</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html — cùng schema R2 nhận.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — ListMultipartUploads</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_ListMultipartUploads.html — cách duy nhất thấy chỗ rò.</span></span></div>
</div>
`,
    },


    {
      title: '6.2 — Object expiration by age|||6.2 — Hết hạn object theo tuổi',
      slug: 'os-6-2-expiration',
      type: 'VIDEO',
      description: 'Not all objects should live forever. Logs, temporary previews, one-time exports — auto-delete after N days with the same lifecycle mechanism.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Object expiration by age</h2>
<p class="lead">The abort rule handles interrupted uploads. This one handles objects that were never meant to stick around — CSV exports a user downloaded once, thumbnails for posts that got deleted three years ago, log archives from a system that has since been rewritten. Every one of them is billed indefinitely if nothing deletes them.</p>

<h3>The classes of "temporary" object</h3>
<pre><code class="language-text">Type                         Typical retention   Why it accumulates
──────────────────────────   ─────────────────   ────────────────────
Export/report downloads       7-30 days           User downloads once, never again
Video transcoding staging     1-7 days            Kept only until final output
Log/audit archives            90 days - 7 yr      Compliance says "at least N days"
Thumbnails for deleted posts  0 days (delete)     App forgot to clean; storage keeps
Password reset attachments    24 hours            Should never survive the request
Session recording exports     30 days             User can re-request
</code></pre>

<p>Every one of these is a candidate for a lifecycle rule keyed by prefix and age. The trick is that "temporary" only means anything if there is a rule enforcing it — a comment in your README saying "this folder is temporary" costs you money forever.</p>

<h3>The rule (multiple targets, prefix-scoped)</h3>
<pre><code class="language-bash">cat &gt; lifecycle-expiry.json &lt;&lt;'EOF'
{
  "Rules": [
    {
      "ID": "abort-mpu",
      "Status": "Enabled",
      "Filter": { "Prefix": "" },
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
    },
    {
      "ID": "expire-exports",
      "Status": "Enabled",
      "Filter": { "Prefix": "exports/" },
      "Expiration": { "Days": 30 }
    },
    {
      "ID": "expire-transcoding",
      "Status": "Enabled",
      "Filter": { "Prefix": "transcoding-tmp/" },
      "Expiration": { "Days": 3 }
    },
    {
      "ID": "expire-reset-tokens",
      "Status": "Enabled",
      "Filter": { "Prefix": "auth/reset/" },
      "Expiration": { "Days": 1 }
    }
  ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \\
  --bucket cuongthai-media \\
  --lifecycle-configuration file://lifecycle-expiry.json \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com
</code></pre>

<p>Read each rule: <strong>match objects whose key starts with the prefix; delete them once they are older than N days.</strong> Rules do not stack — an object matches every rule whose prefix matches it, and the earliest expiration wins. Design your prefixes so this is unambiguous.</p>

<h3>Prefix design matters more than the rule</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Keep temporary and permanent apart</span><span class="lz-d">If your CSV export lives at <code>reports/user-42/2026-08.csv</code> and the app's permanent report at <code>reports/user-42/annual-2026.csv</code>, a prefix rule on <code>reports/</code> deletes both. Move temporary to <code>reports/tmp/</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bake retention into the path</span><span class="lz-d">Prefixes like <code>tmp-24h/</code>, <code>keep-30d/</code>, <code>archive/</code> read what will happen without opening the lifecycle config. A new dev looking at the bucket knows what stays.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Do not run <code>Expiration.Days: 0</code></span><span class="lz-d">Zero means "delete immediately", useful only when the rule is a cleanup burst you plan to remove. Leaving it enabled kills every future upload matching the prefix at the next lifecycle pass.</span></div>
</div>

<h3>Verify the rule (measure, do not trust the config)</h3>
<pre><code class="language-bash"># Storage under exports/ before rule added:
aws s3 ls s3://cuongthai-media/exports/ --recursive --summarize \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com | tail -3
# Total Objects: 4,712
# Total Size: 68.3 GiB

# One week after rule (with Expiration.Days = 30):
aws s3 ls s3://cuongthai-media/exports/ --recursive --summarize \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com | tail -3
</code></pre>
<div class="out">
<pre><code class="language-text">Total Objects: 1,483        # dropped from 4,712
Total Size: 14.1 GiB        # freed 54 GB</code></pre>
</div>

<p>The rule runs asynchronously — do not expect the drop the instant you save the config. R2 sweeps once a day. If you added the rule Monday morning, the first delete pass usually completes by Tuesday. Measure a week later, not five minutes later.</p>

<h3>The audit trail problem</h3>
<pre><code class="language-text">Question the security team will ask three months later:
  "Why did exports/user-42/2026-05-18-tax.csv disappear on 2026-06-18?"

The answer needs to be:
  "Lifecycle rule &#96;expire-exports&#96; deleted every object under
   exports/ older than 30 days. This is documented in the bucket
   lifecycle policy set on 2026-05-01."

If you cannot answer that, you have a compliance problem, not a
storage problem. Store the lifecycle policy JSON in the repo,
under version control, alongside the migrations that created the
bucket. The bucket setting is the source of truth; the repo is
the paper trail.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — prefix matches more than you thought.</strong> A rule on prefix <code>report</code> (no slash) matches <code>report.pdf</code>, <code>reports/annual.csv</code>, and <code>reporting-config.json</code>. Always end filter prefixes with <code>/</code> unless you deliberately want a literal-prefix scan.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — the rule keeps the parent "folder" the app expected to be there.</strong> S3 has no folders; <code>exports/</code> only exists as long as at least one key starts with it. When the rule deletes the last one, some apps break because they call <code>HeadObject</code> on the folder itself. If your code depends on a folder existing, keep a <code>.keep</code> file with a very long retention or no rule.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Use lifecycle rules to expire objects that were never meant to be permanent (exports, temp files, reset tokens) with prefix-scoped <code>Expiration.Days</code>; the rule is worthless without matching prefix discipline in your app's paths, and R2's daily sweep means &quot;the day you set the rule&quot; and &quot;the day you see the drop&quot; are always at least 24 hours apart.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Object lifecycles</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/object-lifecycles — <code>Expiration</code> support and semantics.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — Lifecycle rules</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html — R2 accepts the same JSON schema.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS re:Post — Lifecycle timing</span><span class="lc-sub">repost.aws — the classic &quot;my rule didn't run yet&quot; question, answer is &quot;wait 24-48 hours&quot;.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Hết hạn object theo tuổi</h2>
<p class="lead">Rule abort xử lý upload đứt. Cái này xử lý object không bao giờ định ở lại — CSV export user tải một lần, thumbnail cho post đã xoá ba năm trước, log archive từ hệ thống đã viết lại. Mọi cái đều tính tiền vô thời hạn nếu không có gì xoá chúng.</p>

<h3>Các loại object &quot;tạm&quot;</h3>
<pre><code class="language-text">Loại                         Giữ điển hình     Vì sao tích tụ
──────────────────────────   ───────────────   ────────────────────
Tải export/report            7-30 ngày         User tải một lần, không bao giờ nữa
Staging transcode video      1-7 ngày          Chỉ giữ tới output cuối
Archive log/audit            90 ngày - 7 năm   Compliance nói "ít nhất N ngày"
Thumbnail của post đã xoá    0 ngày (xoá)      App quên dọn; storage vẫn giữ
Attachment reset password    24 giờ            Không nên sống qua request
Export session recording     30 ngày           User có thể yêu cầu lại
</code></pre>

<p>Mỗi loại trên là ứng viên cho lifecycle rule theo prefix và tuổi. Mẹo là &quot;tạm&quot; chỉ có nghĩa nếu có rule thi hành — comment trong README nói &quot;folder này là tạm&quot; tốn tiền của bạn vĩnh viễn.</p>

<h3>Rule (nhiều target, scope theo prefix)</h3>
<pre><code class="language-bash">cat &gt; lifecycle-expiry.json &lt;&lt;'EOF'
{
  "Rules": [
    {
      "ID": "abort-mpu",
      "Status": "Enabled",
      "Filter": { "Prefix": "" },
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
    },
    {
      "ID": "expire-exports",
      "Status": "Enabled",
      "Filter": { "Prefix": "exports/" },
      "Expiration": { "Days": 30 }
    },
    {
      "ID": "expire-transcoding",
      "Status": "Enabled",
      "Filter": { "Prefix": "transcoding-tmp/" },
      "Expiration": { "Days": 3 }
    },
    {
      "ID": "expire-reset-tokens",
      "Status": "Enabled",
      "Filter": { "Prefix": "auth/reset/" },
      "Expiration": { "Days": 1 }
    }
  ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \\
  --bucket cuongthai-media \\
  --lifecycle-configuration file://lifecycle-expiry.json \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com
</code></pre>

<p>Đọc mỗi rule: <strong>match object có key bắt đầu bằng prefix; xoá khi cũ hơn N ngày.</strong> Rule không cộng dồn — object match mọi rule có prefix khớp, và expiration sớm nhất thắng. Thiết kế prefix để không có mập mờ.</p>

<h3>Thiết kế prefix quan trọng hơn rule</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tách temporary và permanent</span><span class="lz-d">Nếu CSV export sống ở <code>reports/user-42/2026-08.csv</code> và report thường xuyên ở <code>reports/user-42/annual-2026.csv</code>, rule prefix <code>reports/</code> xoá cả hai. Chuyển temporary sang <code>reports/tmp/</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bake retention vào path</span><span class="lz-d">Prefix như <code>tmp-24h/</code>, <code>keep-30d/</code>, <code>archive/</code> nói điều sẽ xảy ra mà không cần mở config lifecycle. Dev mới nhìn bucket biết cái gì ở lại.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đừng chạy <code>Expiration.Days: 0</code></span><span class="lz-d">Zero nghĩa là &quot;xoá ngay&quot;, chỉ hữu ích khi rule là burst dọn dẹp bạn tính gỡ. Để enabled sẽ giết mọi upload tương lai match prefix ở lượt sweep tiếp.</span></div>
</div>

<h3>Verify rule (đo, đừng tin config)</h3>
<pre><code class="language-bash"># Storage dưới exports/ trước khi thêm rule:
aws s3 ls s3://cuongthai-media/exports/ --recursive --summarize \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com | tail -3
# Total Objects: 4,712
# Total Size: 68.3 GiB

# Một tuần sau rule (với Expiration.Days = 30):
aws s3 ls s3://cuongthai-media/exports/ --recursive --summarize \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com | tail -3
</code></pre>
<div class="out">
<pre><code class="language-text">Total Objects: 1,483        # tụt từ 4,712
Total Size: 14.1 GiB        # thoát 54 GB</code></pre>
</div>

<p>Rule chạy async — đừng mong tụt ngay khi save config. R2 sweep một ngày một lần. Nếu thêm rule sáng thứ Hai, lượt xoá đầu thường xong thứ Ba. Đo một tuần sau, không phải năm phút sau.</p>

<h3>Vấn đề audit trail</h3>
<pre><code class="language-text">Câu security team sẽ hỏi ba tháng sau:
  "Vì sao exports/user-42/2026-05-18-tax.csv biến mất ngày 2026-06-18?"

Câu trả lời phải là:
  "Lifecycle rule &#96;expire-exports&#96; xoá mọi object dưới
   exports/ cũ hơn 30 ngày. Document trong bucket lifecycle
   policy set ngày 2026-05-01."

Không trả lời được là vấn đề compliance, không phải vấn đề
storage. Lưu lifecycle policy JSON trong repo, version control,
cạnh migration tạo bucket. Setting bucket là nguồn sự thật;
repo là dấu vết giấy.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — prefix match nhiều hơn bạn tưởng.</strong> Rule prefix <code>report</code> (không slash) match <code>report.pdf</code>, <code>reports/annual.csv</code>, và <code>reporting-config.json</code>. Luôn kết thúc filter prefix bằng <code>/</code> trừ khi cố ý muốn quét literal-prefix.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — rule giữ &quot;folder&quot; cha mà app tưởng có.</strong> S3 không có folder; <code>exports/</code> chỉ tồn tại khi còn ít nhất một key bắt đầu bằng nó. Khi rule xoá cái cuối, một số app vỡ vì gọi <code>HeadObject</code> lên folder. Nếu code phụ thuộc folder tồn tại, giữ file <code>.keep</code> với retention rất dài hoặc không rule.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Dùng lifecycle rule để expire object không định permanent (export, temp, reset token) với <code>Expiration.Days</code> scope theo prefix; rule vô giá trị nếu không có kỷ luật prefix trong path của app, và sweep hàng ngày của R2 nghĩa là &quot;ngày set rule&quot; và &quot;ngày thấy tụt&quot; luôn cách nhau ít nhất 24 giờ.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Object lifecycles</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/object-lifecycles — hỗ trợ và ngữ nghĩa <code>Expiration</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — Lifecycle rules</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html — R2 nhận cùng schema JSON.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS re:Post — Lifecycle timing</span><span class="lc-sub">repost.aws — câu &quot;rule tôi chưa chạy&quot; kinh điển, đáp là &quot;chờ 24-48 giờ&quot;.</span></span></div>
</div>
`,
    },


    {
      title: '6.3 — Orphans: rows without objects, objects without rows|||6.3 — Object mồ côi: row không có object, object không có row',
      slug: 'os-6-3-orphans',
      type: 'VIDEO',
      description: 'Bucket and database drift apart. Lifecycle rules do not catch that. A reconciliation job does. Here is the pattern and its cost.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Orphans: rows without objects, objects without rows</h2>
<p class="lead">Lifecycle handles time-based cleanup. It cannot handle the mismatch between what your database says exists and what actually sits in the bucket. Users delete accounts, background jobs die halfway, migrations rename tables — every one creates a mismatch. You need a reconciliation job to find and fix them.</p>

<h3>The two directions of orphan</h3>
<pre><code class="language-text">Orphan A — object without row (bucket has it, DB does not):
  Cause: DB DELETE succeeded, bucket DELETE failed or was never called
  Cost:  Storage bill for something no code path can reach
  Detect: List bucket, ask DB "do you know this key?", DB says no
  Fix:   Delete the object (usually safe)

Orphan B — row without object (DB has it, bucket does not):
  Cause: Upload wrote DB row optimistically, bucket write failed
  Cost:  App shows a broken image / 404 icon to the user
  Detect: List DB, ask bucket "do you have this key?", bucket says no
  Fix:   Either re-upload or delete the row (usually delete)
</code></pre>

<p>Orphan A is silent — nobody notices until the storage bill grows. Orphan B is loud — every affected user sees a broken image and files a support ticket. Both come from the same root: the write to two systems (DB + bucket) is not atomic, and one side can fail while the other succeeded.</p>

<h3>Why lifecycle rules cannot fix this</h3>
<pre><code class="language-text">Lifecycle rules are per-object metadata:
  - age
  - prefix
  - size (in some clouds)
  - storage class

Lifecycle rules have NO ACCESS to your database:
  - cannot ask "is this key still referenced?"
  - cannot ask "was this user deleted?"
  - cannot ask "is this the current avatar?"

If a user deletes their account, the app must delete the objects.
No expiration rule can say "delete because the user is gone".
</code></pre>

<h3>The reconciliation query</h3>
<pre><code class="language-javascript">// Detect orphan A: objects with no matching DB row
// Runs weekly, in the background

import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { prisma } from '../db.js'

const s3 = new S3Client({ region: 'auto', endpoint: process.env.R2_ENDPOINT, credentials: {
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
} })

async function findOrphanObjects(prefix) {
  let continuationToken
  let orphans = []
  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: 'cuongthai-media',
      Prefix: prefix,
      ContinuationToken: continuationToken,
    }))
    const keys = (res.Contents ?? []).map(o =&gt; o.Key)
    if (keys.length === 0) break

    // One database query per batch of 1000, not per object
    const known = await prisma.attachment.findMany({
      where: { r2Key: { in: keys } },
      select: { r2Key: true },
    })
    const knownSet = new Set(known.map(k =&gt; k.r2Key))

    // Ignore anything created in the last 24h — it may be mid-upload
    const cutoff = Date.now() - 24 * 60 * 60 * 1000
    for (const o of res.Contents ?? []) {
      if (knownSet.has(o.Key)) continue
      if (o.LastModified.getTime() &gt; cutoff) continue
      orphans.push(o.Key)
    }
    continuationToken = res.NextContinuationToken
  } while (continuationToken)
  return orphans
}
</code></pre>

<p>Three pieces of the pattern matter more than the code itself:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Batch the DB question</span><span class="lz-d">One <code>WHERE key IN (batch of 1000)</code> is one query. One query per object is a million queries per million objects — the reconciliation itself becomes the incident. The 1000-key limit matches <code>ListObjectsV2</code>'s page size for a reason.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Ignore anything younger than a safety window</span><span class="lz-d">A user uploading right now has the object in the bucket but the DB row is still being committed. Delete it and you break their upload. 24 hours is the common floor; 7 days is safer if uploads can be large or slow.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dry-run before delete</span><span class="lz-d">The first run should log candidates to a table, not delete. Compare against a second pass a day later. Only delete keys that appear in both passes; that filters out the &quot;still mid-upload&quot; race.</span></div>
</div>

<h3>Orphan B — the loud direction</h3>
<pre><code class="language-javascript">// Detect orphan B: DB rows whose object is gone
async function findMissingObjects() {
  const rows = await prisma.attachment.findMany({
    where: { verifiedAt: null },
    take: 500,
    orderBy: { createdAt: 'asc' },
  })
  const missing = []
  for (const row of rows) {
    try {
      await s3.send(new HeadObjectCommand({ Bucket: 'cuongthai-media', Key: row.r2Key }))
      await prisma.attachment.update({ where: { id: row.id }, data: { verifiedAt: new Date() } })
    } catch (err) {
      if (err.name === 'NotFound') missing.push(row.id)
      else throw err
    }
  }
  return missing
}
</code></pre>

<p>Head is a cheap operation — a request cost, no bandwidth. Running it once per row is fine at a few thousand rows. Beyond that, batch it: R2 does not have a batch-HEAD operation, so parallelism is the trick — 20 concurrent HeadObject calls process 20k rows in a few minutes.</p>

<h3>Real numbers from a real cleanup</h3>
<pre><code class="language-text">Reconciliation run on cuongthai-media, 2026-08 (single tenant, ~2 yr old):

  Total objects in bucket:      1,247,884
  Total rows in Attachment:       892,113
  
  Orphan A (bucket, no DB):       142,551   (11%)
    - deleted user accounts:      ~89k
    - failed background jobs:     ~24k
    - old migration remnants:     ~30k
  
  Orphan B (DB, no bucket):           218   (0.02%)
    - failed uploads:             ~180
    - manual bucket cleanups:      ~30
    - dev/testing residue:          ~8
  
  Space freed after cleanup:      41.3 GiB
  Monthly savings on R2:          $0.62
  User-visible tickets closed:    3 (from orphan B)
</code></pre>

<p>The dollar savings are modest per month. The reason to run it is not the storage bill — it is that the mismatch keeps growing, the storage bill compounds, and you cannot answer &quot;what is in this bucket?&quot; without the reconciliation running. Every quarter or so is a reasonable cadence.</p>

<div class="pitfall">
<p><strong>Bẫy — reconciling under a growing prefix.</strong> If you list <code>uploads/</code> while new uploads land, your list is a moving target. Either freeze new uploads under a different prefix while the job runs, or split the reconciliation by month (<code>uploads/2026-01/</code>, <code>uploads/2026-02/</code>) so each range is stable at scan time.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — deleting on the first pass.</strong> A race between the reconciler and a legitimate upload will silently delete a user's file mid-upload. Always: log candidates on run 1, delete only keys that appear as candidates on run 2 the next day.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Bucket and database drift apart every time an atomic-looking write to both fails halfway; lifecycle rules cannot fix it because they cannot see the database; a reconciliation job that batches <code>ListObjectsV2</code> against <code>WHERE key IN (...)</code>, ignores anything younger than 24 hours, and requires two consecutive passes before deleting, catches both directions of orphan without breaking in-flight uploads.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — ListObjectsV2</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html — pagination and 1000-key limit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — HeadObject</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html — 404 vs 403 distinction matters.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — findMany with <code>in</code></span><span class="lc-sub">prisma.io/docs — batch lookup pattern.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Object mồ côi: row không có object, object không có row</h2>
<p class="lead">Lifecycle xử lý cleanup theo thời gian. Nó không xử lý được lệch giữa &quot;database nói có&quot; và &quot;thực tế trong bucket&quot;. User xoá account, background job chết giữa chừng, migration đổi tên bảng — mỗi cái tạo lệch. Bạn cần job reconciliation để tìm và vá.</p>

<h3>Hai hướng mồ côi</h3>
<pre><code class="language-text">Mồ côi A — object không row (bucket có, DB không):
  Nguyên nhân: DB DELETE thành, bucket DELETE fail hoặc không gọi
  Cost:  Bill storage cho thứ không code path nào đọc tới
  Detect: List bucket, hỏi DB "biết key này không?", DB nói không
  Fix:   Xoá object (thường an toàn)

Mồ côi B — row không object (DB có, bucket không):
  Nguyên nhân: Upload viết row optimistic, bucket write fail
  Cost:  App hiện ảnh vỡ / icon 404 cho user
  Detect: List DB, hỏi bucket "có key này không?", bucket nói không
  Fix:   Re-upload hoặc xoá row (thường xoá)
</code></pre>

<p>Mồ côi A câm — không ai để ý tới khi hoá đơn storage phình. Mồ côi B ồn — mỗi user ảnh hưởng thấy ảnh vỡ và mở ticket support. Cả hai từ cùng gốc: viết vào hai hệ thống (DB + bucket) không atomic, một bên fail khi bên kia thành.</p>

<h3>Vì sao lifecycle rule không vá được</h3>
<pre><code class="language-text">Lifecycle rule là metadata per-object:
  - tuổi
  - prefix
  - size (một số cloud)
  - storage class

Lifecycle rule KHÔNG TRUY CẬP database:
  - không hỏi được "key này còn được reference?"
  - không hỏi được "user đã xoá?"
  - không hỏi được "đây là avatar hiện tại?"

Nếu user xoá account, app phải xoá object.
Không rule expiration nào nói được "xoá vì user đi rồi".
</code></pre>

<h3>Query reconciliation</h3>
<pre><code class="language-javascript">// Detect mồ côi A: object không có row DB khớp
// Chạy hàng tuần, ở background

import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { prisma } from '../db.js'

const s3 = new S3Client({ region: 'auto', endpoint: process.env.R2_ENDPOINT, credentials: {
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
} })

async function findOrphanObjects(prefix) {
  let continuationToken
  let orphans = []
  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: 'cuongthai-media',
      Prefix: prefix,
      ContinuationToken: continuationToken,
    }))
    const keys = (res.Contents ?? []).map(o =&gt; o.Key)
    if (keys.length === 0) break

    // Một query DB cho batch 1000, không phải per object
    const known = await prisma.attachment.findMany({
      where: { r2Key: { in: keys } },
      select: { r2Key: true },
    })
    const knownSet = new Set(known.map(k =&gt; k.r2Key))

    // Bỏ qua bất kỳ cái nào tạo 24h qua — có thể đang upload
    const cutoff = Date.now() - 24 * 60 * 60 * 1000
    for (const o of res.Contents ?? []) {
      if (knownSet.has(o.Key)) continue
      if (o.LastModified.getTime() &gt; cutoff) continue
      orphans.push(o.Key)
    }
    continuationToken = res.NextContinuationToken
  } while (continuationToken)
  return orphans
}
</code></pre>

<p>Ba mảnh của pattern quan trọng hơn code:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Batch câu hỏi DB</span><span class="lz-d">Một <code>WHERE key IN (batch 1000)</code> là một query. Một query per object là triệu query per triệu object — reconciliation trở thành incident. Giới hạn 1000-key khớp page size của <code>ListObjectsV2</code> có lý do.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bỏ qua bất kỳ cái nào trẻ hơn cửa sổ an toàn</span><span class="lz-d">User upload ngay giờ có object trong bucket nhưng row DB đang commit. Xoá là bạn phá upload. 24 giờ là sàn phổ biến; 7 ngày an toàn hơn nếu upload có thể lớn hoặc chậm.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dry-run trước khi xoá</span><span class="lz-d">Lần chạy đầu log candidate vào bảng, không xoá. So với lượt hai một ngày sau. Chỉ xoá key xuất hiện cả hai lượt; filter được race &quot;còn đang upload&quot;.</span></div>
</div>

<h3>Mồ côi B — hướng ồn</h3>
<pre><code class="language-javascript">// Detect mồ côi B: row DB có object đã mất
async function findMissingObjects() {
  const rows = await prisma.attachment.findMany({
    where: { verifiedAt: null },
    take: 500,
    orderBy: { createdAt: 'asc' },
  })
  const missing = []
  for (const row of rows) {
    try {
      await s3.send(new HeadObjectCommand({ Bucket: 'cuongthai-media', Key: row.r2Key }))
      await prisma.attachment.update({ where: { id: row.id }, data: { verifiedAt: new Date() } })
    } catch (err) {
      if (err.name === 'NotFound') missing.push(row.id)
      else throw err
    }
  }
  return missing
}
</code></pre>

<p>Head là op rẻ — cost request, không bandwidth. Chạy per row ổn ở vài nghìn row. Xa hơn thì batch: R2 không có op batch-HEAD, nên parallelism là mẹo — 20 HeadObject concurrent xử lý 20k row trong vài phút.</p>

<h3>Con số thật từ một lần cleanup thật</h3>
<pre><code class="language-text">Reconciliation trên cuongthai-media, 08/2026 (single tenant, ~2 năm):

  Object trong bucket:            1,247,884
  Row trong Attachment:             892,113
  
  Mồ côi A (bucket, không DB):      142,551   (11%)
    - account user đã xoá:          ~89k
    - background job fail:          ~24k
    - tàn dư migration cũ:          ~30k
  
  Mồ côi B (DB, không bucket):          218   (0.02%)
    - upload fail:                  ~180
    - cleanup bucket thủ công:       ~30
    - tàn dư dev/test:                ~8
  
  Space free sau cleanup:           41.3 GiB
  Tiết kiệm hàng tháng R2:          $0.62
  Ticket user-visible đóng:         3 (từ mồ côi B)
</code></pre>

<p>Tiết kiệm dollar mỗi tháng khiêm tốn. Lý do chạy không phải hoá đơn storage — mà lệch cứ tăng, hoá đơn compound, và bạn không trả lời được &quot;có gì trong bucket này?&quot; nếu không có reconciliation chạy. Mỗi quý một lần là nhịp hợp lý.</p>

<div class="pitfall">
<p><strong>Bẫy — reconcile dưới prefix đang tăng.</strong> Nếu list <code>uploads/</code> khi upload mới đổ vào, list là mục tiêu di động. Hoặc đóng băng upload mới dưới prefix khác khi job chạy, hoặc chia reconciliation theo tháng (<code>uploads/2026-01/</code>, <code>uploads/2026-02/</code>) để mỗi range ổn định tại scan time.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — xoá ngay lượt đầu.</strong> Race giữa reconciler và upload legit sẽ âm thầm xoá file user đang upload. Luôn: log candidate lượt 1, chỉ xoá key xuất hiện là candidate cả lượt 2 ngày sau.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bucket và database lệch nhau mỗi lần một &quot;atomic&quot; write vào cả hai fail giữa chừng; lifecycle rule không vá được vì không thấy database; job reconciliation batch <code>ListObjectsV2</code> với <code>WHERE key IN (...)</code>, bỏ qua bất kỳ cái nào trẻ hơn 24 giờ, và yêu cầu hai lượt liên tiếp trước khi xoá, bắt được cả hai hướng mồ côi mà không phá upload đang bay.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — ListObjectsV2</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html — pagination và giới hạn 1000-key.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — HeadObject</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html — 404 vs 403 quan trọng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — findMany với <code>in</code></span><span class="lc-sub">prisma.io/docs — pattern batch lookup.</span></span></div>
</div>
`,
    },

    {
      title: '6.4 — Chapter 6 quiz|||6.4 — Kiểm tra Chương 6',
      slug: 'os-6-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu về lifecycle rule và reconciliation.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 6 · Quiz</span><h2>What Chapter 6 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 6 · Kiểm tra</span><h2>Chương 6 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 400,
        questions: [
          {
            question: 'Storage bill on R2 shows 84 GB. <code>ListObjectsV2</code> sums to 61 GB. Where is the missing 23 GB?|||Hoá đơn storage R2 là 84 GB. <code>ListObjectsV2</code> tổng 61 GB. 23 GB thiếu ở đâu?',
            options: [
              'Incomplete multipart uploads — parts stored in a separate namespace, not returned by <code>ListObjectsV2</code>. Use <code>ListMultipartUploads</code> to see them, and a lifecycle rule with <code>AbortIncompleteMultipartUpload.DaysAfterInitiation: 7</code> to clean them.|||Multipart upload không hoàn tất — part lưu ở namespace riêng, <code>ListObjectsV2</code> không trả về. Dùng <code>ListMultipartUploads</code> để thấy, và lifecycle rule với <code>AbortIncompleteMultipartUpload.DaysAfterInitiation: 7</code> để dọn.',
              'R2 always overcharges by 30%|||R2 luôn tính dư 30%',
              'Deleted objects still count for 30 days|||Object đã xoá vẫn tính 30 ngày',
              'The dashboard is a bug|||Dashboard bị bug',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Lifecycle rule with <code>Filter.Prefix: "reports"</code> (no trailing slash). What does it match?|||Lifecycle rule với <code>Filter.Prefix: "reports"</code> (không slash cuối). Match gì?',
            options: [
              '<code>report.pdf</code>, <code>reports/annual.csv</code>, and <code>reporting-config.json</code>. Always end prefixes with <code>/</code> unless you deliberately want literal-prefix scan.|||<code>report.pdf</code>, <code>reports/annual.csv</code>, và <code>reporting-config.json</code>. Luôn kết thúc prefix bằng <code>/</code> trừ khi cố ý muốn quét literal-prefix.',
              'Only <code>reports/*</code>|||Chỉ <code>reports/*</code>',
              'Only files named exactly <code>reports</code>|||Chỉ file tên đúng <code>reports</code>',
              'Nothing — prefix requires wildcard|||Không gì — prefix cần wildcard',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Reconciliation finds 142k objects in R2 with no matching row in <code>Attachment</code>. Delete all immediately?|||Reconciliation tìm 142k object trong R2 không có row <code>Attachment</code> khớp. Xoá hết ngay?',
            options: [
              'No — log candidates on run 1, compare against a second run the next day, delete only keys present in both runs. Also ignore anything younger than 24-48h (may be mid-upload). First-pass delete races with in-flight uploads.|||Không — log candidate lượt 1, so với lượt hai ngày sau, chỉ xoá key có ở cả hai lượt. Cũng bỏ qua bất kỳ cái nào trẻ hơn 24-48h (có thể đang upload). Xoá lượt đầu race với upload đang bay.',
              'Yes, delete immediately|||Có, xoá ngay',
              'Move to a &quot;deleted&quot; prefix instead|||Chuyển sang prefix &quot;deleted&quot;',
              'Only if the count is under 100|||Chỉ nếu dưới 100',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: '<code>Expiration.Days: 30</code> set on Monday. When does the first delete happen?|||<code>Expiration.Days: 30</code> set thứ Hai. Xoá đầu tiên khi nào?',
            options: [
              'R2 sweeps lifecycle asynchronously (usually daily). The first pass covering the new rule typically completes within 24-48 hours; deletions of 30-day-old matching objects appear then, not the moment the config saved. Measure a week later, not five minutes later.|||R2 sweep lifecycle async (thường hàng ngày). Lượt đầu bao rule mới thường xong 24-48 giờ; xoá object 30 ngày tuổi khớp hiện lúc đó, không phải khoảnh khắc save config. Đo một tuần sau, không phải năm phút sau.',
              'Immediately|||Ngay',
              'Never — rules apply only to new uploads|||Không bao giờ — rule chỉ áp dụng upload mới',
              'When you next call ListObjects|||Khi bạn gọi ListObjects lần tới',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
