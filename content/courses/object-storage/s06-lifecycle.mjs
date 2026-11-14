import G06_1 from './giang/obj-06-1.mjs';
import G06_2 from './giang/obj-06-2.mjs';
import G06_3 from './giang/obj-06-3.mjs';
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
${G06_1}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Abort incomplete multipart uploads</h2>
<p class="lead">A user tries to upload a 500 MB video. Their browser crashes at part 47 of 100. The 46 completed parts stay in your bucket, billed as storage, invisible to <code>ListObjects</code>, and they do not disappear until someone aborts the upload. R2 has a safety net — its docs (updated 26/10/2026): &quot;Buckets have a default lifecycle rule to expire multipart uploads seven days after initiation&quot; — but other providers differ, the default can be changed, and you may want a shorter window.</p>

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
<pre><code class="language-bash">aws s3api list-multipart-uploads --bucket cuongthai-media-storage \\
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
<pre><code class="language-text">(illustrative output removed — see the measured run below: 1 upload, 10 parts, 83,886,080 bytes)</code></pre>
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
  --bucket cuongthai-media-storage \\
  --lifecycle-configuration file://lifecycle.json \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com
</code></pre>

<p>Read that as: <strong>any multipart upload initiated more than 7 days ago and never completed, delete every part.</strong> The rule runs asynchronously: R2's docs say expired items are &quot;typically removed within 24 hours&quot;. It does not touch completed objects — <code>Complete</code> converts parts into a real object which is a separate lifecycle target.</p>

<h3>How to pick the number of days</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cover your slowest legitimate upload</span><span class="lz-d">If a user with a 200 kbps connection uploads a 1 GB video, that is ~11 hours. Bad wifi + retries pushes it further. Never set <code>DaysAfterInitiation: 1</code>; you will kill real uploads mid-flight.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Do not go so long that the leak matters</span><span class="lz-d">30 days on 100 GB of daily leaks = 3 TB sitting in your bill by the time the rule fires. 7 days is the common default.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">If you have &quot;resumable&quot; uploads, tune to that window</span><span class="lz-d">Some apps let a user resume an upload days later. If your resume window is 3 days, use 4-day abort. If you have no resume feature, 1-2 days is fine.</span></div>
</div>

<h3>Verify it fired</h3>
<pre><code class="language-bash"># List remaining incomplete uploads one week later:
aws s3api list-multipart-uploads --bucket cuongthai-media-storage \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com \\
  | jq '.Uploads | length'
</code></pre>
<div class="out">
<pre><code class="language-text">(count before and after the window — your own number, not a copied one)</code></pre>
</div>

<h3>What it costs — measured, not quoted</h3>
<p>The old text showed a table &quot;measured on a real R2 account, 2026-07: 84 GB billed, 23 GB parts, 27% waste&quot;. There is no source for it and this course never touches the real bucket, so it is removed. What you can measure yourself: the parts of one killed copy, and the bytes they hold on the server's disk.</p>
<div class="out">$ aws s3 cp sao-luu.bin s3://kho-mpu/backup/2026-11-14.bin &amp; sleep 1.5; kill -9 $!
đã giết aws-cli giữa chừng
$ aws s3api list-objects-v2 --bucket kho-mpu --query 'length(Contents || &#96;[]&#96;)'   # object hoàn chỉnh
0
$ aws s3api list-multipart-uploads --bucket kho-mpu --query 'Uploads[].{Key:Key,Initiated:Initiated}'
[{"Key":"backup/2026-11-14.bin","Initiated":"2026-11-14T09:42:28.934000+00:00"}]
$ u=…; aws s3api list-parts --bucket kho-mpu --key backup/2026-11-14.bin --upload-id $u --query '[length(Parts), sum(Parts[].Size)]'
[10,83886080]
$ docker exec obj-minio du -sh /data/kho-mpu /data/.minio.sys/multipart
4.0K	/data/kho-mpu
81M	/data/.minio.sys/multipart</div>

<div class="pitfall">
<p><strong>Trap — thinking <code>ListObjectsV2</code> shows the leak.</strong> It does not. Multipart parts are stored under a separate namespace until <code>CompleteMultipartUpload</code> promotes them to an object. You need <code>ListMultipartUploads</code> to see them, — and the bytes are real (measured above: 81M in the multipart area while the bucket folder holds 4.0K). Sum them yourself with <code>ListParts</code>.</p>
</div>

<div class="pitfall">
<p><strong>Trap — setting the rule and forgetting to <em>enable</em> it.</strong> The default <code>Status</code> in some tool-generated JSON is <code>"Disabled"</code>. The rule sits there looking configured and does nothing. Verify with <code>get-bucket-lifecycle-configuration</code> and read the <code>Status</code> field on every rule.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Interrupted multipart uploads leave parts that never appear in <code>ListObjectsV2</code> but hold real bytes until aborted; R2 aborts them after 7 days by default, a lifecycle rule with <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code> lets you choose the window, and where a server refuses the rule (MinIO) a small script with an age threshold does the job.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Create an incomplete upload: <code>CreateMultipartUpload</code>, upload ONE part, and STOP (never call complete). Then run <code>ListMultipartUploads</code> — it is there, billing storage, yet invisible to <code>ListObjectsV2</code>.</li>
<li>Write a lifecycle config JSON with an abort rule: <code>AbortIncompleteMultipartUpload: { DaysAfterInitiation: 7 }</code>.</li>
<li>Apply it: <code>aws s3api put-bucket-lifecycle-configuration --bucket my-bucket --lifecycle-configuration file://lc.json --endpoint-url $R2</code> (or the SDK <code>PutBucketLifecycleConfiguration</code>).</li>
<li>Read it back with <code>GetBucketLifecycleConfiguration</code> and confirm the rule and its 7-day window.</li>
<li>Write one sentence explaining why the leaked parts never show in <code>ListObjectsV2</code> and which command does reveal them.</li>
</ol>
<p><strong>Done when:</strong> you created an incomplete upload, saw it in <code>ListMultipartUploads</code> but not <code>ListObjectsV2</code>, and installed and verified a 7-day abort rule on the bucket.</p></div>

<h3>🔬 Measured: two servers, one rule, and a cleanup script</h3>
<p>Local MinIO (RELEASE.2026-11-12) and Garage v2.1.0, aws-cli 2.31.22, SDK v3 3.1071.0. Nothing touches the real bucket. The same abort rule on both servers — MinIO refuses it and cleans stale uploads with a server-wide setting instead; Garage accepts it:</p>
<div class="out">$ aws s3api put-bucket-lifecycle-configuration --bucket kho-mpu --lifecycle-configuration file://abort-7.json    # MinIO :20200
An error occurred (InvalidArgument) when calling the PutBucketLifecycleConfiguration operation: The XML you provided was not well-formed or did not validate against our published schema
$ mc admin config get lab api | tr ' ' '\\n' | grep stale_uploads
stale_uploads_cleanup_interval=6h
stale_uploads_expiry=24h
$ aws s3api put-bucket-lifecycle-configuration --bucket media-ch5 --lifecycle-configuration file://abort-7.json   # Garage
đã đặt
$ aws s3api get-bucket-lifecycle-configuration --bucket media-ch5   # Garage
{"Rules":[{"ID":"abort-incomplete-7d","Filter":{"Prefix":""},"Status":"Enabled","AbortIncompleteMultipartUpload":{"DaysAfterInitiation":7}}]}</div>
<p>No rule available? The cleanup script (dry run unless <code>--that</code>; skips uploads younger than N hours):</p>
<pre><code class="language-javascript"><span class="tok-comment">// don-mpu.mjs &lt;bucket&gt; &lt;số giờ&gt; [--that] — liệt kê multipart upload DỞ cũ hơn N giờ; có --that mới Abort. Dùng khi máy chủ không nhận luật</span>
<span class="tok-comment">// AbortIncompleteMultipartUpload (MinIO) hoặc muốn dọn NGAY thay vì chờ luật chạy (R2: tới 24 giờ). Không đụng object đã hoàn chỉnh.</span>
import { S3Client, ListMultipartUploadsCommand, ListPartsCommand, AbortMultipartUploadCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });
const [Bucket, gio, that] = process.argv.slice(2);
const moc = Date.now() - Number(gio) * 3600_000;
let KeyMarker, UploadIdMarker, n = 0, byte = 0;
do {
  const r = await s3.send(new ListMultipartUploadsCommand({ Bucket, KeyMarker, UploadIdMarker }));
  for (const u of r.Uploads ?? []) {
    if (u.Initiated.getTime() &gt; moc) continue;                     <span class="tok-comment">  // còn mới ⇒ có thể đang tải thật, để yên</span>
    const p = await s3.send(new ListPartsCommand({ Bucket, Key: u.Key, UploadId: u.UploadId }));
    const sz = (p.Parts ?? []).reduce((a, x) =&gt; a + x.Size, 0); n++; byte += sz;
    console.log(&#96;\${that ? 'ABORT' : 'thấy '} \${u.Key} · khởi tạo \${u.Initiated.toISOString()} · \${(p.Parts ?? []).length} part · \${(sz / 1048576).toFixed(1)} MiB&#96;);
    if (that) await s3.send(new AbortMultipartUploadCommand({ Bucket, Key: u.Key, UploadId: u.UploadId }));
  }
  ({ NextKeyMarker: KeyMarker, NextUploadIdMarker: UploadIdMarker } = r);
  if (!r.IsTruncated) break;
} while (true);
console.log(&#96;\${n} upload dở · \${(byte / 1048576).toFixed(1)} MiB \${that ? 'đã giải phóng' : 'đang nằm chờ'}&#96;);</code></pre>
<div class="out">$ node don-mpu.mjs kho-mpu 24          # cũ hơn 24 giờ: chưa có (vừa mới tạo)
0 upload dở · 0.0 MiB đang nằm chờ
$ node don-mpu.mjs kho-mpu 0 --that    # lab: ngưỡng 0 giờ để thấy Abort thật
ABORT backup/2026-11-14.bin · khởi tạo 2026-11-14T09:42:28.934Z · 10 part · 80.0 MiB
1 upload dở · 80.0 MiB đã giải phóng
$ aws s3api list-multipart-uploads --bucket kho-mpu --query 'length(Uploads || &#96;[]&#96;)'
0
$ docker exec obj-minio du -sh /data/.minio.sys/multipart
4.0K	/data/.minio.sys/multipart</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>Real life:</strong> this repo's app never uses multipart (no <code>CreateMultipartUpload</code> in <code>src/</code>) — browser uploads are single presigned PUTs. Leftover parts come from tools: <code>aws s3 cp</code> switches to multipart above 8 MiB (the parts above are 8 MiB each), so a backup or video-upload script killed by a dropped Wi-Fi or a reboot leaves them behind.</li>
<li><strong>What if the window is 1 day?</strong> 1 GiB at 200 kbit/s takes about 12 hours; with retries a slow phone upload can outlive the window and its Complete fails with <code>NoSuchUpload</code>. Measure your slowest real upload first.</li>
<li><strong>The attacker's view:</strong> anyone allowed to call <code>CreateMultipartUpload</code> + <code>UploadPart</code> (a leaked key, a careless &quot;multipart from the browser&quot; endpoint) can park gigabytes that no object listing shows. Keep multipart server-side or tracked in your DB, keep the abort window short, and alert on the count from <code>ListMultipartUploads</code>.</li>
</ul>
<h3>🔁 Run it yourself</h3>
<p>Copy a 200 MiB file with <code>aws s3 cp</code> to a local MinIO and kill it after a second. Compare <code>list-objects-v2</code> with <code>list-multipart-uploads</code>, sum <code>list-parts</code>, try the abort rule on MinIO and on Garage, then run the cleanup script with a 24-hour and a 0-hour threshold.</p>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-1-3-multipart" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">Object Storage · 1.3 — Multipart upload for large files</span><span class="lc-sub">Create, parts, complete — and the first look at orphaned uploads</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multipart upload</span><span class="v">Uploading a large object as parts stitched into one final object.</span></div>
  <div class="kv"><span class="k">Incomplete upload</span><span class="v">Parts uploaded but never completed/aborted — they persist and bill.</span></div>
  <div class="kv"><span class="k">AbortIncompleteMultipartUpload</span><span class="v">Lifecycle action that deletes parts of uploads never completed.</span></div>
  <div class="kv"><span class="k">DaysAfterInitiation</span><span class="v">How long after an upload starts before its orphaned parts are aborted (7 is safe).</span></div>
  <div class="kv"><span class="k">ListMultipartUploads</span><span class="v">The API that reveals in-progress/abandoned uploads (ListObjectsV2 does not).</span></div>
  <div class="kv"><span class="k">PutBucketLifecycleConfiguration</span><span class="v">The call that installs the lifecycle rules on a bucket.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Interrupted multipart uploads leave parts that keep billing and never appear in <code>ListObjectsV2</code>.</li><li>A lifecycle rule with <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code> cleans them (7 days is R2's default), or <code>AbortMultipartUpload</code> by hand.</li><li>See the leaked parts with <code>ListMultipartUploads</code>; install the rule once per bucket.</li><li>R2 has a default 7-day rule; MinIO refuses the rule and cleans stale uploads server-wide (24 h); no rule ⇒ script it with an age threshold and a dry run.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Object lifecycles</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/object-lifecycles — <code>AbortIncompleteMultipartUpload</code> supported since 2023.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — Multipart upload lifecycle</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html — same schema R2 accepts.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — ListMultipartUploads</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_ListMultipartUploads.html — the only way to see the leak.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Abort multipart upload không hoàn tất</h2>
<p class="lead">Một user upload video 500 MB. Trình duyệt của họ crash ở part 47/100. 46 part đã hoàn thành nằm lại trong bucket, tính tiền là storage, invisible với <code>ListObjects</code>, và chúng không biến mất tới khi có ai huỷ lần tải. R2 có lưới an toàn — tài liệu (cập nhật 26/10/2026): &quot;Buckets have a default lifecycle rule to expire multipart uploads seven days after initiation&quot; — nhưng nhà cung cấp khác làm khác, mặc định có thể bị đổi, và bạn có thể muốn cửa sổ ngắn hơn.</p>

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
<pre><code class="language-bash">aws s3api list-multipart-uploads --bucket cuongthai-media-storage \\
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
<pre><code class="language-text">(output minh hoạ đã bỏ — xem lượt đo thật bên dưới: 1 lần tải dở, 10 phần, 83.886.080 byte)</code></pre>
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
  --bucket cuongthai-media-storage \\
  --lifecycle-configuration file://lifecycle.json \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com
</code></pre>

<p>Đọc như sau: <strong>bất kỳ multipart upload nào khởi tạo hơn 7 ngày và không complete, xoá mọi part.</strong> Rule chạy bất đồng bộ: tài liệu R2 ghi object hết hạn &quot;typically removed within 24 hours&quot;. Không đụng object đã hoàn chỉnh — <code>Complete</code> đổi part thành object thật là target lifecycle riêng.</p>

<h3>Cách chọn số ngày</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bao được upload legit chậm nhất</span><span class="lz-d">User với connection 200 kbps upload video 1 GB là ~11 giờ. Wifi kém + retry đẩy nó xa hơn. Đừng set <code>DaysAfterInitiation: 1</code>; bạn sẽ giết upload thật giữa chừng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đừng dài quá để rò không quan trọng</span><span class="lz-d">30 ngày trên 100 GB rò mỗi ngày = 3 TB ngồi trong hoá đơn tới khi rule chạy. 7 ngày là mặc định phổ biến.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nếu có upload &quot;resumable&quot;, tune theo cửa sổ đó</span><span class="lz-d">Một số app cho phép user resume upload sau vài ngày. Nếu cửa sổ resume là 3 ngày, abort 4-day. Nếu không có tính năng resume, 1-2 ngày ổn.</span></div>
</div>

<h3>Verify rule đã fire</h3>
<pre><code class="language-bash"># List upload không hoàn tất còn lại sau một tuần:
aws s3api list-multipart-uploads --bucket cuongthai-media-storage \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com \\
  | jq '.Uploads | length'
</code></pre>
<div class="out">
<pre><code class="language-text">(đếm trước và sau cửa sổ — số của chính bạn, không chép số người khác)</code></pre>
</div>

<h3>Tốn bao nhiêu — đo, không trích</h3>
<p>Bài cũ có bảng &quot;đo trên R2 account thật, 07/2026: 84 GB tính tiền, 23 GB part, lãng phí 27%&quot;. Bảng đó không có nguồn và khoá này không chạm bucket thật, nên đã bỏ. Thứ bạn tự đo được: các phần của một lệnh sao chép bị giết, và số byte chúng giữ trên đĩa máy chủ.</p>
<div class="out">$ aws s3 cp sao-luu.bin s3://kho-mpu/backup/2026-11-14.bin &amp; sleep 1.5; kill -9 $!
đã giết aws-cli giữa chừng
$ aws s3api list-objects-v2 --bucket kho-mpu --query 'length(Contents || &#96;[]&#96;)'   # object hoàn chỉnh
0
$ aws s3api list-multipart-uploads --bucket kho-mpu --query 'Uploads[].{Key:Key,Initiated:Initiated}'
[{"Key":"backup/2026-11-14.bin","Initiated":"2026-11-14T09:42:28.934000+00:00"}]
$ u=…; aws s3api list-parts --bucket kho-mpu --key backup/2026-11-14.bin --upload-id $u --query '[length(Parts), sum(Parts[].Size)]'
[10,83886080]
$ docker exec obj-minio du -sh /data/kho-mpu /data/.minio.sys/multipart
4.0K	/data/kho-mpu
81M	/data/.minio.sys/multipart</div>

<div class="pitfall">
<p><strong>Bẫy — tưởng <code>ListObjectsV2</code> thấy chỗ rò.</strong> Không. Part multipart lưu ở namespace riêng tới khi <code>CompleteMultipartUpload</code> promote chúng thành object. Bạn cần <code>ListMultipartUploads</code> để thấy, — và số byte là thật (đo ở trên: khu multipart 81M trong khi thư mục bucket 4.0K). Tự cộng bằng <code>ListParts</code>.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — set rule mà quên <em>bật</em>.</strong> Mặc định <code>Status</code> trong một số JSON tool sinh là <code>&quot;Disabled&quot;</code>. Rule ngồi đó nhìn có config và không làm gì. Verify bằng <code>get-bucket-lifecycle-configuration</code> và đọc field <code>Status</code> mỗi rule.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Multipart upload bị đứt để lại part không hiện trong <code>ListObjectsV2</code> nhưng giữ byte thật tới khi bị huỷ; R2 mặc định huỷ sau 7 ngày, lifecycle rule <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code> cho bạn chọn cửa sổ, còn máy chủ không nhận luật (MinIO) thì một script có ngưỡng tuổi làm thay.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo một upload dở: <code>CreateMultipartUpload</code>, upload MỘT part, rồi DỪNG (không gọi complete). Chạy <code>ListMultipartUploads</code> — nó ở đó, đang tính tiền storage, mà <code>ListObjectsV2</code> không thấy.</li>
<li>Viết JSON lifecycle config với rule abort: <code>AbortIncompleteMultipartUpload: { DaysAfterInitiation: 7 }</code>.</li>
<li>Áp dụng: <code>aws s3api put-bucket-lifecycle-configuration --bucket my-bucket --lifecycle-configuration file://lc.json --endpoint-url $R2</code> (hoặc SDK <code>PutBucketLifecycleConfiguration</code>).</li>
<li>Đọc lại bằng <code>GetBucketLifecycleConfiguration</code> và xác nhận rule cùng cửa sổ 7 ngày.</li>
<li>Viết một câu giải thích vì sao các part rò rỉ không bao giờ hiện trong <code>ListObjectsV2</code> và lệnh nào mới lộ chúng ra.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã tạo một upload dở, thấy nó trong <code>ListMultipartUploads</code> mà không trong <code>ListObjectsV2</code>, và cài + xác nhận rule abort 7 ngày trên bucket.</p></div>

<h3>🔬 Đo thật: hai máy chủ, một luật, và một script dọn</h3>
<p>MinIO cục bộ (RELEASE.2026-11-12) và Garage v2.1.0, aws-cli 2.31.22, SDK v3 3.1071.0. Không lệnh nào chạm bucket thật. Cùng một luật huỷ trên hai máy chủ — MinIO từ chối và tự dọn bằng cấu hình toàn máy chủ; Garage nhận:</p>
<div class="out">$ aws s3api put-bucket-lifecycle-configuration --bucket kho-mpu --lifecycle-configuration file://abort-7.json    # MinIO :20200
An error occurred (InvalidArgument) when calling the PutBucketLifecycleConfiguration operation: The XML you provided was not well-formed or did not validate against our published schema
$ mc admin config get lab api | tr ' ' '\\n' | grep stale_uploads
stale_uploads_cleanup_interval=6h
stale_uploads_expiry=24h
$ aws s3api put-bucket-lifecycle-configuration --bucket media-ch5 --lifecycle-configuration file://abort-7.json   # Garage
đã đặt
$ aws s3api get-bucket-lifecycle-configuration --bucket media-ch5   # Garage
{"Rules":[{"ID":"abort-incomplete-7d","Filter":{"Prefix":""},"Status":"Enabled","AbortIncompleteMultipartUpload":{"DaysAfterInitiation":7}}]}</div>
<p>Không có luật? Script dọn (chỉ in ra trừ khi có <code>--that</code>; bỏ qua lần tải trẻ hơn N giờ):</p>
<pre><code class="language-javascript"><span class="tok-comment">// don-mpu.mjs &lt;bucket&gt; &lt;số giờ&gt; [--that] — liệt kê multipart upload DỞ cũ hơn N giờ; có --that mới Abort. Dùng khi máy chủ không nhận luật</span>
<span class="tok-comment">// AbortIncompleteMultipartUpload (MinIO) hoặc muốn dọn NGAY thay vì chờ luật chạy (R2: tới 24 giờ). Không đụng object đã hoàn chỉnh.</span>
import { S3Client, ListMultipartUploadsCommand, ListPartsCommand, AbortMultipartUploadCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });
const [Bucket, gio, that] = process.argv.slice(2);
const moc = Date.now() - Number(gio) * 3600_000;
let KeyMarker, UploadIdMarker, n = 0, byte = 0;
do {
  const r = await s3.send(new ListMultipartUploadsCommand({ Bucket, KeyMarker, UploadIdMarker }));
  for (const u of r.Uploads ?? []) {
    if (u.Initiated.getTime() &gt; moc) continue;                     <span class="tok-comment">  // còn mới ⇒ có thể đang tải thật, để yên</span>
    const p = await s3.send(new ListPartsCommand({ Bucket, Key: u.Key, UploadId: u.UploadId }));
    const sz = (p.Parts ?? []).reduce((a, x) =&gt; a + x.Size, 0); n++; byte += sz;
    console.log(&#96;\${that ? 'ABORT' : 'thấy '} \${u.Key} · khởi tạo \${u.Initiated.toISOString()} · \${(p.Parts ?? []).length} part · \${(sz / 1048576).toFixed(1)} MiB&#96;);
    if (that) await s3.send(new AbortMultipartUploadCommand({ Bucket, Key: u.Key, UploadId: u.UploadId }));
  }
  ({ NextKeyMarker: KeyMarker, NextUploadIdMarker: UploadIdMarker } = r);
  if (!r.IsTruncated) break;
} while (true);
console.log(&#96;\${n} upload dở · \${(byte / 1048576).toFixed(1)} MiB \${that ? 'đã giải phóng' : 'đang nằm chờ'}&#96;);</code></pre>
<div class="out">$ node don-mpu.mjs kho-mpu 24          # cũ hơn 24 giờ: chưa có (vừa mới tạo)
0 upload dở · 0.0 MiB đang nằm chờ
$ node don-mpu.mjs kho-mpu 0 --that    # lab: ngưỡng 0 giờ để thấy Abort thật
ABORT backup/2026-11-14.bin · khởi tạo 2026-11-14T09:42:28.934Z · 10 part · 80.0 MiB
1 upload dở · 80.0 MiB đã giải phóng
$ aws s3api list-multipart-uploads --bucket kho-mpu --query 'length(Uploads || &#96;[]&#96;)'
0
$ docker exec obj-minio du -sh /data/.minio.sys/multipart
4.0K	/data/.minio.sys/multipart</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Đời thật:</strong> ứng dụng của kho không dùng multipart (không có <code>CreateMultipartUpload</code> trong <code>src/</code>) — tải từ trình duyệt là một PUT ký sẵn. Phần dở đến từ công cụ: <code>aws s3 cp</code> chuyển sang multipart khi tệp lớn hơn 8 MiB (các phần ở trên đúng 8 MiB), nên script sao lưu hay đẩy video bị rớt Wi-Fi hoặc khởi động lại máy sẽ để chúng lại.</li>
<li><strong>Nếu cửa sổ là 1 ngày?</strong> 1 GiB qua 200 kbit/s mất khoảng 12 giờ; cộng thử lại, một lần tải chậm từ điện thoại có thể sống lâu hơn cửa sổ và lệnh Complete hỏng với <code>NoSuchUpload</code>. Đo lần tải chậm nhất của bạn trước.</li>
<li><strong>Góc kẻ xấu:</strong> ai được gọi <code>CreateMultipartUpload</code> + <code>UploadPart</code> (khoá lộ, một endpoint &quot;multipart từ trình duyệt&quot; làm ẩu) có thể cất hàng gigabyte mà không danh sách object nào thấy. Giữ multipart ở máy chủ hoặc ghi vào DB, cửa sổ huỷ ngắn, và cảnh báo theo số đếm từ <code>ListMultipartUploads</code>.</li>
</ul>
<h3>🔁 Tự chạy lại</h3>
<p>Sao chép tệp 200 MiB bằng <code>aws s3 cp</code> lên MinIO cục bộ rồi giết sau một giây. So <code>list-objects-v2</code> với <code>list-multipart-uploads</code>, cộng <code>list-parts</code>, thử luật huỷ trên MinIO và Garage, rồi chạy script dọn với ngưỡng 24 giờ và 0 giờ.</p>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-1-3-multipart" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">Object Storage · 1.3 — Multipart upload cho file lớn</span><span class="lc-sub">Create, part, complete — và lần đầu thấy upload mồ côi</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multipart upload</span><span class="v">Upload object lớn thành nhiều part rồi ghép thành một object cuối.</span></div>
  <div class="kv"><span class="k">Incomplete upload</span><span class="v">Part đã upload nhưng chưa complete/abort — tồn tại và tính tiền.</span></div>
  <div class="kv"><span class="k">AbortIncompleteMultipartUpload</span><span class="v">Hành động lifecycle xoá part của upload không bao giờ hoàn tất.</span></div>
  <div class="kv"><span class="k">DaysAfterInitiation</span><span class="v">Bao lâu sau khi upload khởi tạo thì part mồ côi bị abort (7 là an toàn).</span></div>
  <div class="kv"><span class="k">ListMultipartUploads</span><span class="v">API lộ ra upload đang dở/bỏ dở (ListObjectsV2 không thấy).</span></div>
  <div class="kv"><span class="k">PutBucketLifecycleConfiguration</span><span class="v">Lời gọi cài các rule lifecycle lên bucket.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Multipart upload bị đứt để lại part vẫn tính tiền và không hiện trong <code>ListObjectsV2</code>.</li><li>Lifecycle rule <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code> dọn được (R2 mặc định 7 ngày), hoặc <code>AbortMultipartUpload</code> bằng tay.</li><li>Thấy part rò rỉ bằng <code>ListMultipartUploads</code>; cài rule một lần cho mỗi bucket.</li><li>R2 có luật mặc định 7 ngày; MinIO từ chối luật và tự dọn toàn máy chủ (24 giờ); không có luật ⇒ viết script có ngưỡng tuổi và chế độ chạy thử.</li></ul>

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
${G06_2}
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
  --bucket cuongthai-media-storage \\
  --lifecycle-configuration file://lifecycle-expiry.json \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com
</code></pre>

<p>Read each rule: <strong>match objects whose key starts with the prefix; delete them once they are older than N days.</strong> Rules do not stack — an object matches every rule whose prefix matches it, and the earliest expiration wins. Design your prefixes so this is unambiguous.</p>

<h3>Prefix design matters more than the rule</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Keep temporary and permanent apart</span><span class="lz-d">If your CSV export lives at <code>reports/user-42/2026-08.csv</code> and the app's permanent report at <code>reports/user-42/annual-2026.csv</code>, a prefix rule on <code>reports/</code> deletes both. Move temporary to <code>reports/tmp/</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bake retention into the path</span><span class="lz-d">Prefixes like <code>tmp-24h/</code>, <code>keep-30d/</code>, <code>archive/</code> read what will happen without opening the lifecycle config. A new dev looking at the bucket knows what stays.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Never leave a past <code>Expiration.Date</code> rule on</span><span class="lz-d"><code>Days: 0</code> is simply refused (&quot;Days must be positive integer&quot; — measured). The real foot-gun is a one-off cleanup written as a <code>Date</code> that has already passed: measured on MinIO, the prefix empties at once and every later upload to it is gone immediately. Remove such rules the same day.</span></div>
</div>

<h3>Verify the rule (measure, do not trust the config)</h3>
<pre><code class="language-bash"># Storage under exports/ before rule added:
aws s3 ls s3://cuongthai-media-storage/exports/ --recursive --summarize \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com | tail -3
# Total Objects: 4,712
# Total Size: 68.3 GiB

# One week after rule (with Expiration.Days = 30):
aws s3 ls s3://cuongthai-media-storage/exports/ --recursive --summarize \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com | tail -3
</code></pre>
<div class="out">
<pre><code class="language-text">(illustrative numbers removed — measure your own: the --summarize totals before, and again a day or two after the expiry dates)</code></pre>
</div>

<p>The rule runs asynchronously — do not expect the drop the instant you save the config. R2's docs (updated 26/10/2026): objects are &quot;typically removed from a bucket within 24 hours of the x-amz-expiration value&quot;, and existing objects may take longer after a new rule. What you can check <em>today</em> is the <code>x-amz-expiration</code> header on each object (measured below).</p>

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
<p><strong>Trap — prefix matches more than you thought.</strong> A rule on prefix <code>report</code> (no slash) matches <code>report.pdf</code>, <code>reports/annual.csv</code>, and <code>reporting-config.json</code>. Always end filter prefixes with <code>/</code> unless you deliberately want a literal-prefix scan.</p>
</div>

<div class="pitfall">
<p><strong>Trap — the rule keeps the parent "folder" the app expected to be there.</strong> S3 has no folders; <code>exports/</code> only exists as long as at least one key starts with it. When the rule deletes the last one, some apps break because they call <code>HeadObject</code> on the folder itself. If your code depends on a folder existing, keep a <code>.keep</code> file with a very long retention or no rule.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Use lifecycle rules to expire objects that were never meant to be permanent (exports, temp files, reset tokens) with prefix-scoped <code>Expiration.Days</code>; the rule is worthless without matching prefix discipline in your app's paths, and R2's daily sweep means &quot;the day you set the rule&quot; and &quot;the day you see the drop&quot; are always at least 24 hours apart.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Pick a disposable prefix, e.g. <code>exports/</code>, and upload two objects under it. Upload one object under a permanent prefix like <code>users/</code> too.</li>
<li>Write a lifecycle rule scoped to the disposable prefix: <code>Filter: { Prefix: "exports/" }</code> and <code>Expiration: { Days: 30 }</code>.</li>
<li>Apply with <code>PutBucketLifecycleConfiguration</code>, then read back with <code>GetBucketLifecycleConfiguration</code> and confirm the prefix and the 30-day window.</li>
<li>Verify the rule does NOT match <code>users/</code> — check the <code>Filter.Prefix</code>; prefix discipline is the whole safety net.</li>
<li>Write down why the real deletion day lags the rule (R2 sweeps once a day, so expect deletion within ~24h after Days elapses, not to the second).</li>
</ol>
<p><strong>Done when:</strong> a prefix-scoped expiration rule is applied and verified, it clearly excludes your permanent prefixes, and you can explain the ~24h lag.</p></div>

<h3>🔬 Measured: the date every object carries</h3>
<p>Local MinIO RELEASE.2026-11-12, aws-cli 2.31.22. Nothing touches the real bucket. Two prefix rules, then HEAD on three objects:</p>
<div class="out">$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://han.json
đã đặt 2 luật
bây giờ (UTC): 2026-11-14 09:43
$ for k in exports/u42/2026-11.csv tmp-24h/reset-7f3a.json users/u42/avatar.jpg; do aws s3api head-object --bucket kho-han --key $k --query Expiration; done
exports/u42/2026-11.csv      expiry-date="Tue, 15 Dec 2026 00:00:00 GMT", rule-id="het-han-exports-30d"
tmp-24h/reset-7f3a.json      expiry-date="Mon, 16 Nov 2026 00:00:00 GMT", rule-id="het-han-tmp-1d"
users/u42/avatar.jpg         None</div>
<p>Uploaded 14/11 at 09:43 UTC: 1 day becomes 16/11 00:00 and 30 days becomes 15/12 00:00 — days count from creation, rounded up to the next midnight UTC. <code>users/</code> carries nothing.</p>
<p>The prefix without a slash:</p>
<div class="out">$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://tien.json &amp;&amp; echo 'đã đặt Prefix: "report"'
đã đặt Prefix: "report"
$ for k in report.pdf reports/annual-2026.csv reporting-config.json users/report.pdf; do aws s3api head-object … --query Expiration; done
report.pdf                 expiry-date="Tue, 15 Dec 2026 00:00:00 GMT", rule-id="thieu-gach-cheo"
reports/annual-2026.csv    expiry-date="Tue, 15 Dec 2026 00:00:00 GMT", rule-id="thieu-gach-cheo"
reporting-config.json      expiry-date="Tue, 15 Dec 2026 00:00:00 GMT", rule-id="thieu-gach-cheo"
users/report.pdf           None</div>
<p>Two overlapping rules — the earlier date wins:</p>
<div class="out">$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://chong.json &amp;&amp; echo "đã đặt 2 luật chồng"
đã đặt 2 luật chồng
$ for k in exports/u42/2026-11.csv exports/u7/2026-11.csv; do printf '%-24s ' $k; aws s3api head-object --bucket kho-han --key $k --query Expiration --output text; done
exports/u42/2026-11.csv  expiry-date="Mon, 16 Nov 2026 00:00:00 GMT", rule-id="exports-u42-1d"
exports/u7/2026-11.csv   expiry-date="Tue, 15 Dec 2026 00:00:00 GMT", rule-id="exports-30d"</div>
<p>A one-off cleanup rule with a date that has passed, and the refused <code>Days: 0</code>:</p>
<div class="out">$ aws s3 ls s3://kho-han/tmp-24h/
2026-11-14 16:43:19          2 reset-7f3a.json
$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://nham.json &amp;&amp; echo 'đã đặt Date: 2026-11-14 (đã qua)'
đã đặt Date: 2026-11-14 (đã qua)
$ aws s3 ls s3://kho-han/tmp-24h/ || echo "(trống)"
(trống)
$ aws s3 cp x.txt s3://kho-han/tmp-24h/moi-tai.json &gt;/dev/null &amp;&amp; aws s3api head-object --bucket kho-han --key tmp-24h/moi-tai.json 2&gt;&amp;1 | tail -1
An error occurred (404) when calling the HeadObject operation: Not Found
$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://k0.json   # Expiration.Days: 0
An error occurred (InvalidArgument) when calling the PutBucketLifecycleConfiguration operation: Days must be positive integer when used with Expiration</div>
<p>The running rules compared with the file kept in the repo:</p>
<div class="out">$ diff &lt;(aws s3api get-bucket-lifecycle-configuration --bucket kho-han | jq -S .) &lt;(jq -S . han.json) &amp;&amp; echo "khớp repo"
khớp tệp trong repo (2 luật)</div>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>Real life:</strong> a &quot;download my data&quot; export — the emailed link lives 7 days, the file 30, then the rule removes it; a video pipeline writes temporary renders to <code>tmp-24h/</code> and only finals to <code>video/</code>.</li>
<li><strong>What if code depends on a &quot;folder&quot;?</strong> There are none: <code>exports/</code> exists only while a key starts with it. When the rule deletes the last key, a HEAD on the folder fails.</li>
<li><strong>The attacker's view:</strong> whoever can write lifecycle rules can empty a bucket with one rule — an empty prefix and a past <code>Date</code> — and the logs show one <code>PutBucketLifecycleConfiguration</code>, not a single <code>DeleteObject</code>. Keep that permission out of application tokens, enable versioning where you must keep history, and alert when the bucket's rules differ from the repo file.</li>
</ul>
<h3>🔁 Run it yourself</h3>
<p>On MinIO: put a 30-day rule on <code>exports/</code> and a 1-day rule on <code>tmp-24h/</code>, upload under both and under <code>users/</code>, and read <code>--query Expiration</code> from <code>head-object</code>. Repeat with the prefix <code>report</code> (no slash) on four keys, overlap two rules, and try a past <code>Date</code> on a throw-away bucket only.</p>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-2-3-keys" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Object Storage · 2.3 — Access keys and rotation</span><span class="lc-sub">Keep PutBucketLifecycleConfiguration out of app tokens</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Expiration.Days</span><span class="v">Lifecycle action: delete an object this many days after creation.</span></div>
  <div class="kv"><span class="k">Filter.Prefix</span><span class="v">Scopes a rule to keys starting with a string, e.g. <code>exports/</code>.</span></div>
  <div class="kv"><span class="k">Prefix discipline</span><span class="v">Putting disposable objects under a dedicated prefix so a rule can target them safely.</span></div>
  <div class="kv"><span class="k">Daily sweep</span><span class="v">R2 evaluates lifecycle once a day, so expiry is approximate, not instant.</span></div>
  <div class="kv"><span class="k">Disposable object</span><span class="v">Exports, temp files, reset tokens — never meant to be permanent.</span></div>
  <div class="kv"><span class="k">Lifecycle vs manual delete</span><span class="v">The rule deletes by age automatically; a manual delete is one-off and immediate.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Lifecycle expiration deletes objects by age, scoped by prefix.</li><li>Use <code>Expiration.Days</code> + <code>Filter.Prefix</code>; your app must place disposable objects under a dedicated prefix.</li><li>R2 sweeps daily, so the deletion day lags the rule by up to ~24 hours.</li><li>Never point an expiration rule at a prefix your app treats as permanent.</li></ul>

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
  --bucket cuongthai-media-storage \\
  --lifecycle-configuration file://lifecycle-expiry.json \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com
</code></pre>

<p>Đọc mỗi rule: <strong>match object có key bắt đầu bằng prefix; xoá khi cũ hơn N ngày.</strong> Rule không cộng dồn — object match mọi rule có prefix khớp, và expiration sớm nhất thắng. Thiết kế prefix để không có mập mờ.</p>

<h3>Thiết kế prefix quan trọng hơn rule</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tách temporary và permanent</span><span class="lz-d">Nếu CSV export sống ở <code>reports/user-42/2026-08.csv</code> và report thường xuyên ở <code>reports/user-42/annual-2026.csv</code>, rule prefix <code>reports/</code> xoá cả hai. Chuyển temporary sang <code>reports/tmp/</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bake retention vào path</span><span class="lz-d">Prefix như <code>tmp-24h/</code>, <code>keep-30d/</code>, <code>archive/</code> nói điều sẽ xảy ra mà không cần mở config lifecycle. Dev mới nhìn bucket biết cái gì ở lại.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đừng bao giờ để luật <code>Expiration.Date</code> đã qua</span><span class="lz-d"><code>Days: 0</code> bị từ chối thẳng (&quot;Days must be positive integer&quot; — đo). Cái bẫy thật là một lần dọn viết bằng <code>Date</code> đã qua: đo trên MinIO, prefix trống ngay và mọi tệp tải vào sau cũng mất luôn. Gỡ luật kiểu này trong ngày.</span></div>
</div>

<h3>Verify rule (đo, đừng tin config)</h3>
<pre><code class="language-bash"># Storage dưới exports/ trước khi thêm rule:
aws s3 ls s3://cuongthai-media-storage/exports/ --recursive --summarize \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com | tail -3
# Total Objects: 4,712
# Total Size: 68.3 GiB

# Một tuần sau rule (với Expiration.Days = 30):
aws s3 ls s3://cuongthai-media-storage/exports/ --recursive --summarize \\
  --endpoint-url https://xxx.r2.cloudflarestorage.com | tail -3
</code></pre>
<div class="out">
<pre><code class="language-text">(số minh hoạ đã bỏ — tự đo: tổng --summarize trước, và lại sau ngày hết hạn một hai ngày)</code></pre>
</div>

<p>Rule chạy async — đừng mong tụt ngay khi save config. Tài liệu R2 (cập nhật 26/10/2026): object &quot;typically removed from a bucket within 24 hours of the x-amz-expiration value&quot;, và object có sẵn có thể chậm hơn khi luật mới thêm. Thứ kiểm được <em>ngay hôm nay</em> là header <code>x-amz-expiration</code> trên từng object (đo bên dưới).</p>

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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một prefix dùng-rồi-bỏ, vd <code>exports/</code>, upload hai object dưới nó. Upload thêm một object dưới prefix vĩnh viễn như <code>users/</code>.</li>
<li>Viết lifecycle rule scope theo prefix dùng-rồi-bỏ: <code>Filter: { Prefix: "exports/" }</code> và <code>Expiration: { Days: 30 }</code>.</li>
<li>Áp dụng bằng <code>PutBucketLifecycleConfiguration</code>, rồi đọc lại bằng <code>GetBucketLifecycleConfiguration</code> và xác nhận prefix cùng cửa sổ 30 ngày.</li>
<li>Kiểm rule KHÔNG khớp <code>users/</code> — soi <code>Filter.Prefix</code>; kỷ luật prefix chính là toàn bộ lưới an toàn.</li>
<li>Ghi lại vì sao ngày xoá thật trễ hơn rule (R2 sweep mỗi ngày một lần, nên xoá trong vòng ~24h sau khi đủ Days, không chính xác tới giây).</li>
</ol>
<p><strong>Đạt khi:</strong> một rule expire theo prefix đã áp và xác nhận, nó loại rõ các prefix vĩnh viễn, và bạn giải thích được độ trễ ~24h.</p></div>

<h3>🔬 Đo thật: ngày hết hạn mỗi object mang theo</h3>
<p>MinIO cục bộ RELEASE.2026-11-12, aws-cli 2.31.22. Không lệnh nào chạm bucket thật. Hai luật theo prefix, rồi HEAD ba object:</p>
<div class="out">$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://han.json
đã đặt 2 luật
bây giờ (UTC): 2026-11-14 09:43
$ for k in exports/u42/2026-11.csv tmp-24h/reset-7f3a.json users/u42/avatar.jpg; do aws s3api head-object --bucket kho-han --key $k --query Expiration; done
exports/u42/2026-11.csv      expiry-date="Tue, 15 Dec 2026 00:00:00 GMT", rule-id="het-han-exports-30d"
tmp-24h/reset-7f3a.json      expiry-date="Mon, 16 Nov 2026 00:00:00 GMT", rule-id="het-han-tmp-1d"
users/u42/avatar.jpg         None</div>
<p>Tải lúc 09:43 UTC ngày 14/11: 1 ngày thành 16/11 00:00, 30 ngày thành 15/12 00:00 — đếm từ lúc tạo rồi làm tròn lên nửa đêm UTC. <code>users/</code> không mang gì.</p>
<p>Prefix thiếu dấu gạch chéo:</p>
<div class="out">$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://tien.json &amp;&amp; echo 'đã đặt Prefix: "report"'
đã đặt Prefix: "report"
$ for k in report.pdf reports/annual-2026.csv reporting-config.json users/report.pdf; do aws s3api head-object … --query Expiration; done
report.pdf                 expiry-date="Tue, 15 Dec 2026 00:00:00 GMT", rule-id="thieu-gach-cheo"
reports/annual-2026.csv    expiry-date="Tue, 15 Dec 2026 00:00:00 GMT", rule-id="thieu-gach-cheo"
reporting-config.json      expiry-date="Tue, 15 Dec 2026 00:00:00 GMT", rule-id="thieu-gach-cheo"
users/report.pdf           None</div>
<p>Hai luật chồng nhau — hạn sớm hơn thắng:</p>
<div class="out">$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://chong.json &amp;&amp; echo "đã đặt 2 luật chồng"
đã đặt 2 luật chồng
$ for k in exports/u42/2026-11.csv exports/u7/2026-11.csv; do printf '%-24s ' $k; aws s3api head-object --bucket kho-han --key $k --query Expiration --output text; done
exports/u42/2026-11.csv  expiry-date="Mon, 16 Nov 2026 00:00:00 GMT", rule-id="exports-u42-1d"
exports/u7/2026-11.csv   expiry-date="Tue, 15 Dec 2026 00:00:00 GMT", rule-id="exports-30d"</div>
<p>Luật dọn một lần với ngày đã qua, và <code>Days: 0</code> bị từ chối:</p>
<div class="out">$ aws s3 ls s3://kho-han/tmp-24h/
2026-11-14 16:43:19          2 reset-7f3a.json
$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://nham.json &amp;&amp; echo 'đã đặt Date: 2026-11-14 (đã qua)'
đã đặt Date: 2026-11-14 (đã qua)
$ aws s3 ls s3://kho-han/tmp-24h/ || echo "(trống)"
(trống)
$ aws s3 cp x.txt s3://kho-han/tmp-24h/moi-tai.json &gt;/dev/null &amp;&amp; aws s3api head-object --bucket kho-han --key tmp-24h/moi-tai.json 2&gt;&amp;1 | tail -1
An error occurred (404) when calling the HeadObject operation: Not Found
$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://k0.json   # Expiration.Days: 0
An error occurred (InvalidArgument) when calling the PutBucketLifecycleConfiguration operation: Days must be positive integer when used with Expiration</div>
<p>Luật đang chạy so với tệp giữ trong repo:</p>
<div class="out">$ diff &lt;(aws s3api get-bucket-lifecycle-configuration --bucket kho-han | jq -S .) &lt;(jq -S . han.json) &amp;&amp; echo "khớp repo"
khớp tệp trong repo (2 luật)</div>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Đời thật:</strong> tệp &quot;tải dữ liệu của tôi&quot; — đường dẫn trong email sống 7 ngày, tệp sống 30 ngày rồi luật dọn; quy trình dựng video ghi bản tạm vào <code>tmp-24h/</code>, chỉ bản cuối vào <code>video/</code>.</li>
<li><strong>Nếu mã phụ thuộc vào &quot;thư mục&quot;?</strong> Không có thư mục: <code>exports/</code> chỉ tồn tại khi còn key bắt đầu bằng nó. Luật xoá key cuối là lệnh HEAD lên thư mục hỏng.</li>
<li><strong>Góc kẻ xấu:</strong> ai ghi được luật lifecycle có thể làm trống bucket bằng một luật — prefix rỗng và <code>Date</code> đã qua — mà nhật ký chỉ có một <code>PutBucketLifecycleConfiguration</code>, không một <code>DeleteObject</code> nào. Không cấp quyền đó cho token của ứng dụng, bật versioning khi cần giữ lịch sử, và cảnh báo khi luật của bucket khác tệp trong repo.</li>
</ul>
<h3>🔁 Tự chạy lại</h3>
<p>Trên MinIO: đặt luật 30 ngày cho <code>exports/</code> và 1 ngày cho <code>tmp-24h/</code>, tải tệp vào cả hai và vào <code>users/</code>, đọc <code>--query Expiration</code> từ <code>head-object</code>. Lặp lại với prefix <code>report</code> (không gạch chéo) trên bốn key, cho hai luật chồng nhau, và chỉ thử <code>Date</code> đã qua trên một bucket bỏ đi được.</p>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-2-3-keys" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Object Storage · 2.3 — Access key và rotation</span><span class="lc-sub">Đừng để quyền PutBucketLifecycleConfiguration trong token của ứng dụng</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Expiration.Days</span><span class="v">Hành động lifecycle: xoá object sau bấy nhiêu ngày kể từ lúc tạo.</span></div>
  <div class="kv"><span class="k">Filter.Prefix</span><span class="v">Giới hạn rule vào các key bắt đầu bằng một chuỗi, vd <code>exports/</code>.</span></div>
  <div class="kv"><span class="k">Kỷ luật prefix</span><span class="v">Đặt object dùng-rồi-bỏ dưới một prefix riêng để rule nhắm tới an toàn.</span></div>
  <div class="kv"><span class="k">Daily sweep</span><span class="v">R2 xét lifecycle mỗi ngày một lần, nên hết hạn là xấp xỉ, không tức thì.</span></div>
  <div class="kv"><span class="k">Disposable object</span><span class="v">Export, temp, reset token — không định tồn tại vĩnh viễn.</span></div>
  <div class="kv"><span class="k">Lifecycle vs xoá tay</span><span class="v">Rule xoá theo tuổi tự động; xoá tay là một lần và tức thì.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Lifecycle expiration xoá object theo tuổi, giới hạn theo prefix.</li><li>Dùng <code>Expiration.Days</code> + <code>Filter.Prefix</code>; app phải đặt object dùng-rồi-bỏ dưới prefix riêng.</li><li>R2 sweep hàng ngày, nên ngày xoá trễ hơn rule tới ~24 giờ.</li><li>Đừng nhắm rule expire vào prefix mà app coi là vĩnh viễn.</li></ul>

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
${G06_3}
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

<h3>The reconciliation query (illustrative)</h3>
<p>The code below uses an illustrative <code>attachment</code> table — this repo has no model by that name (its tables are <code>FileAttachment</code>, <code>WorkAttachment</code>…, and the <code>PendingUpload</code> ledger shown further down). A runnable version against SQLite + MinIO is in the measured section.</p>
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
      Bucket: 'cuongthai-media-storage',
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
      await s3.send(new HeadObjectCommand({ Bucket: 'cuongthai-media-storage', Key: row.r2Key }))
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

<h3>Numbers you can trust: a measured run</h3>
<p>The old text showed a &quot;reconciliation run on cuongthai-media, 2026-08&quot; with 1,247,884 objects and 142,551 orphans. There is no source for it, and this course never touches the real bucket, so it is removed. Below is a run you can reproduce: SQLite as the database, MinIO as the bucket, drift seeded on purpose (4 rows deleted with their objects left behind, 3 rows whose PUT failed, 1 upload still in flight).</p>
<div class="out">$ node --no-warnings seed.mjs
DB: 19 row · bucket: 20 object (chưa kể tệp đang tải)
$ aws s3 cp - s3://kho-mc/attach/u42/…-dang-tai.pdf      # một người dùng đang tải lên, row chưa ghi
đang tải: attach/u42/…-dang-tai.pdf
$ GRACE=5 node reconcile.mjs attach/        # lab: ân hạn 5 giây (thật: 24 giờ)
3 trang LIST · 3 câu SQL · bỏ qua 1 tệp mới hơn 5 s
mồ côi A (object, không row): 4
  A attach/u40/1794600000003-a3.pdf
  A attach/u40/1794600000015-a15.pdf
  A attach/u41/1794600000007-a7.pdf
  A attach/u42/1794600000011-a11.pdf
mồ côi B (row, không object): 3
  B attach/u42/179460000021-loi21.pdf
  B attach/u42/179460000022-loi22.pdf
  B attach/u42/179460000023-loi23.pdf
$ GRACE=5 node reconcile.mjs attach/ --that
đã xoá 4 object · lỗi 0
đã xoá 3 row hỏng
$ GRACE=5 node --no-warnings reconcile.mjs attach/ | tail -2
mồ côi A (object, không row): 0
mồ côi B (row, không object): 0</div>
<p>Three pages, three queries (one per page), the one-second-old file skipped by the grace period, 4 + 3 orphans fixed, then zero and zero.</p>

<div class="pitfall">
<p><strong>Trap — reconciling under a growing prefix.</strong> If you list <code>uploads/</code> while new uploads land, your list is a moving target. Either freeze new uploads under a different prefix while the job runs, or split the reconciliation by month (<code>uploads/2026-01/</code>, <code>uploads/2026-02/</code>) so each range is stable at scan time.</p>
</div>

<div class="pitfall">
<p><strong>Trap — deleting on the first pass.</strong> A race between the reconciler and a legitimate upload will silently delete a user's file mid-upload. Always: log candidates on run 1, delete only keys that appear as candidates on run 2 the next day.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Bucket and database drift apart every time an atomic-looking write to both fails halfway; lifecycle rules cannot fix it because they cannot see the database; a reconciliation job that batches <code>ListObjectsV2</code> against <code>WHERE key IN (...)</code>, ignores anything younger than 24 hours, and requires two consecutive passes before deleting, catches both directions of orphan without breaking in-flight uploads.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Make one orphan each way: an object with no row (PUT a key, insert nothing) and a row with no object (insert a <code>MediaFile</code> row, then delete its object).</li>
<li>Write a dry-run reconciliation script: page <code>ListObjectsV2</code>, compare keys against <code>SELECT key FROM media_files WHERE key IN (...)</code>, and classify each key into the two orphan buckets.</li>
<li>Add the two safety rules: ignore any object or row younger than 24 hours (in-flight uploads), and require a key to look orphaned on TWO consecutive passes before acting.</li>
<li>Run it report-only and read both lists: object-without-row and row-without-object.</li>
<li>Write one sentence on why a lifecycle rule cannot do this job.</li>
</ol>
<p><strong>Done when:</strong> your script lists both orphan directions, skips anything younger than 24h, and deletes nothing until a second pass confirms the orphan.</p></div>

<h3>🔬 Measured: why lifecycle cannot help, and the ledger this repo uses</h3>
<p>What an object exposes to any rule — no hint of who references it — and the real prevention pattern in this repo:</p>
<div class="out">$ aws s3api head-object --bucket kho-mc --key attach/u41/…-a1.pdf --query '{LM:LastModified,Size:ContentLength,Meta:Metadata}'
{"LastModified":"2026-11-14T09:44:49+00:00","Size":1024,"Metadata":{}}
$ grep -n "model PendingUpload" -A12 prisma/schema.prisma | grep -E "status|expiresAt|PENDING|CONFIRMED|EXPIRED"
2193-  status    String   @default("PENDING") @map("status") @db.VarChar(20)
2194-  // PENDING = uploaded to R2, waiting to be linked to a post
2195-  // CONFIRMED = successfully linked to a SocialMedia row
2196-  // EXPIRED = cron job marked as orphaned, R2 object deleted
2197-  expiresAt DateTime @updatedAt @map("expires_at")
$ grep -n "cron.schedule('0 \\*/4" -A0 src/services/cron.service.ts; grep -n "take: 50\\|keyBelongsToUser(upload" src/services/cron.service.ts
411:  cron.schedule('0 */4 * * *', async () =&gt; {
426:        take: 50, // Process in batches to avoid overwhelming R2
440:          if (!keyBelongsToUser(upload.r2Key, upload.userId)) {</div>
<p>The runnable reconcile (SQLite + MinIO, SDK v3 3.1071.0, <code>node:sqlite</code>; set <code>GRACE</code> in seconds, deletes only with <code>--that</code>):</p>
<pre><code class="language-javascript"><span class="tok-comment">// reconcile.mjs &lt;prefix&gt; [--that] — đối soát DB ↔ bucket theo LÔ: mỗi trang ListObjectsV2 (ở đây MaxKeys 8 để thấy phân trang) ⇒ MỘT câu SQL IN (…).</span>
<span class="tok-comment">// Mồ côi A (object không row) chỉ tính khi object CŨ hơn GRACE giây — tệp vừa tải lên có thể chưa kịp ghi row. Có --that mới xoá.</span>
import { DatabaseSync } from 'node:sqlite';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });
const db = new DatabaseSync('app.db');
const [Prefix, that] = process.argv.slice(2), GRACE = Number(process.env.GRACE ?? 86400);
const thay = new Set(), A = [];
let ContinuationToken, trang = 0, moi = 0;
do {
  const r = await s3.send(new ListObjectsV2Command({ Bucket: 'kho-mc', Prefix, MaxKeys: 8, ContinuationToken }));
  const keys = (r.Contents ?? []).map((o) =&gt; o.Key); trang++;
  const biet = new Set(db.prepare(&#96;SELECT r2_key FROM attachment WHERE r2_key IN (\${keys.map(() =&gt; '?').join(',') || "''"})&#96;).all(...keys).map((x) =&gt; x.r2_key));
  for (const o of r.Contents ?? []) {
    thay.add(o.Key);
    if (biet.has(o.Key)) continue;
    if ((Date.now() - o.LastModified.getTime()) / 1000 &lt; GRACE) { moi++; continue; }
    A.push(o.Key);
  }
  ContinuationToken = r.NextContinuationToken;
} while (ContinuationToken);
const B = db.prepare('SELECT r2_key FROM attachment WHERE r2_key LIKE ?').all(Prefix + '%').map((x) =&gt; x.r2_key).filter((k) =&gt; !thay.has(k));
console.log(&#96;\${trang} trang LIST · \${trang} câu SQL · bỏ qua \${moi} tệp mới hơn \${GRACE} s&#96;);
console.log(&#96;mồ côi A (object, không row): \${A.length}&#96;); for (const k of A) console.log('  A', k);
console.log(&#96;mồ côi B (row, không object): \${B.length}&#96;); for (const k of B) console.log('  B', k);
if (that &amp;&amp; A.length) { const r = await s3.send(new DeleteObjectsCommand({ Bucket: 'kho-mc', Delete: { Objects: A.map((Key) =&gt; ({ Key })) } }));
  console.log(&#96;đã xoá \${r.Deleted?.length ?? 0} object · lỗi \${r.Errors?.length ?? 0}&#96;); }
if (that &amp;&amp; B.length) { db.prepare(&#96;DELETE FROM attachment WHERE r2_key IN (\${B.map(() =&gt; '?').join(',')})&#96;).run(...B); console.log(&#96;đã xoá \${B.length} row hỏng&#96;); }</code></pre>
<h3>🌍 Real life, what-if, and the attacker's view</h3>
<ul>
<li><strong>Real life:</strong> a user deletes their account — rows go, avatars and attachments stay unless code deletes them; someone uploads a video in the post editor and closes the tab — this repo's <code>PendingUpload</code> row expires and the cron (every 4 hours, 50 at a time) deletes the object.</li>
<li><strong>What if the database query silently returns nothing</strong> (wrong environment, renamed table)? Every object looks orphaned. Cap deletions per run and abort when the count is absurd.</li>
<li><strong>The attacker's view:</strong> a cleanup job that deletes whatever key a row names will delete someone else's file if a user can get that key into their own row. Keys that carry their owner (<code>&lt;kind&gt;/u&lt;id&gt;/…</code>, as <code>buildKey</code> makes them) let the job check &quot;owner in key = owner in row&quot; before deleting — this repo added that check to its cleanup cron on 14/11/2026.</li>
</ul>
<h3>🔁 Run it yourself</h3>
<p>Create a SQLite table and a MinIO bucket, write 20 rows and 20 objects, then break them both ways on purpose. Run the reconcile with a small <code>MaxKeys</code> to see the paging, upload a file during the run to see the grace period work, and only then add <code>--that</code>.</p>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-7-3-crud-transaction" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 7.3 — CRUD, transactions, and the Notes API on PostgreSQL</span><span class="lc-sub">What a transaction can and cannot cover</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-0-2-model" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 0.2 — Bucket, key, object</span><span class="lc-sub">Keys that carry their owner: buildKey</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Orphan object</span><span class="v">A key in the bucket with no matching database row.</span></div>
  <div class="kv"><span class="k">Orphan row</span><span class="v">A database row whose object no longer exists in the bucket.</span></div>
  <div class="kv"><span class="k">Reconciliation job</span><span class="v">A scheduled task that compares bucket keys to DB keys and fixes drift.</span></div>
  <div class="kv"><span class="k">Dry-run / report-only</span><span class="v">A mode that lists what would be deleted without deleting anything.</span></div>
  <div class="kv"><span class="k">Two-pass confirmation</span><span class="v">Acting only after a key looks orphaned on two separate runs.</span></div>
  <div class="kv"><span class="k">24h grace window</span><span class="v">Skipping anything created in the last day so in-flight uploads are safe.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Bucket and DB drift whenever a write meant to hit both fails halfway.</li><li>Lifecycle rules cannot fix orphans — they cannot see the database.</li><li>A reconciliation job compares <code>ListObjectsV2</code> to the DB in batches, catching both directions.</li><li>Guard it: ignore anything younger than 24h and require two consecutive passes before deleting.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — ListObjectsV2</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html — pagination and 1000-key limit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — HeadObject</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html — 404 vs 403 distinction matters.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — findMany with <code>in</code></span><span class="lc-sub">prisma.io/docs — batch lookup pattern.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-4-phuc-vu-media-cache" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 10.4: Serving media back</span><span class="lc-sub">The Node.js course reproduces the three everyday leaks in a local MinIO — a deleted post, an abandoned upload, a replaced avatar — finds them with "everything in the bucket minus everything a row points at" (5 objects, 2 referenced, 3 orphans, 2.21 MB) and sweeps them, then shows why the object must be deleted before the row.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
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

<h3>Query reconciliation (minh hoạ)</h3>
<p>Mã dưới đây dùng bảng <code>attachment</code> minh hoạ — kho không có model tên này (bảng thật là <code>FileAttachment</code>, <code>WorkAttachment</code>…, và bảng sổ chờ <code>PendingUpload</code> ở phần dưới). Bản chạy được với SQLite + MinIO nằm ở phần Đo thật.</p>
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
      Bucket: 'cuongthai-media-storage',
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
      await s3.send(new HeadObjectCommand({ Bucket: 'cuongthai-media-storage', Key: row.r2Key }))
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

<h3>Con số tin được: một lượt đo</h3>
<p>Bài cũ có &quot;reconciliation run on cuongthai-media, 2026-08&quot; với 1.247.884 object và 142.551 mồ côi. Không có nguồn, và khoá này không chạm bucket thật, nên đã bỏ. Dưới đây là lượt chạy bạn tự lặp lại được: SQLite làm database, MinIO làm bucket, cố ý tạo lệch (xoá 4 row mà object còn, 3 row PUT hỏng, 1 lần tải đang chạy).</p>
<div class="out">$ node --no-warnings seed.mjs
DB: 19 row · bucket: 20 object (chưa kể tệp đang tải)
$ aws s3 cp - s3://kho-mc/attach/u42/…-dang-tai.pdf      # một người dùng đang tải lên, row chưa ghi
đang tải: attach/u42/…-dang-tai.pdf
$ GRACE=5 node reconcile.mjs attach/        # lab: ân hạn 5 giây (thật: 24 giờ)
3 trang LIST · 3 câu SQL · bỏ qua 1 tệp mới hơn 5 s
mồ côi A (object, không row): 4
  A attach/u40/1794600000003-a3.pdf
  A attach/u40/1794600000015-a15.pdf
  A attach/u41/1794600000007-a7.pdf
  A attach/u42/1794600000011-a11.pdf
mồ côi B (row, không object): 3
  B attach/u42/179460000021-loi21.pdf
  B attach/u42/179460000022-loi22.pdf
  B attach/u42/179460000023-loi23.pdf
$ GRACE=5 node reconcile.mjs attach/ --that
đã xoá 4 object · lỗi 0
đã xoá 3 row hỏng
$ GRACE=5 node --no-warnings reconcile.mjs attach/ | tail -2
mồ côi A (object, không row): 0
mồ côi B (row, không object): 0</div>
<p>Ba trang, ba câu truy vấn (mỗi trang một câu), tệp mới một giây tuổi được ân hạn bỏ qua, sửa 4 + 3 mồ côi, rồi về không và không.</p>

<div class="pitfall">
<p><strong>Bẫy — reconcile dưới prefix đang tăng.</strong> Nếu list <code>uploads/</code> khi upload mới đổ vào, list là mục tiêu di động. Hoặc đóng băng upload mới dưới prefix khác khi job chạy, hoặc chia reconciliation theo tháng (<code>uploads/2026-01/</code>, <code>uploads/2026-02/</code>) để mỗi range ổn định tại scan time.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — xoá ngay lượt đầu.</strong> Race giữa reconciler và upload legit sẽ âm thầm xoá file user đang upload. Luôn: log candidate lượt 1, chỉ xoá key xuất hiện là candidate cả lượt 2 ngày sau.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bucket và database lệch nhau mỗi lần một &quot;atomic&quot; write vào cả hai fail giữa chừng; lifecycle rule không vá được vì không thấy database; job reconciliation batch <code>ListObjectsV2</code> với <code>WHERE key IN (...)</code>, bỏ qua bất kỳ cái nào trẻ hơn 24 giờ, và yêu cầu hai lượt liên tiếp trước khi xoá, bắt được cả hai hướng mồ côi mà không phá upload đang bay.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo mỗi hướng một mồ côi: một object không có row (PUT một key, không insert) và một row không có object (insert một row <code>MediaFile</code>, rồi xoá object của nó).</li>
<li>Viết script reconciliation chạy thử (dry-run): phân trang <code>ListObjectsV2</code>, so key với <code>SELECT key FROM media_files WHERE key IN (...)</code>, và phân mỗi key vào hai nhóm mồ côi.</li>
<li>Thêm hai luật an toàn: bỏ qua object hoặc row trẻ hơn 24 giờ (upload đang bay), và yêu cầu một key trông mồ côi ở HAI lượt liên tiếp mới xử lý.</li>
<li>Chạy ở chế độ chỉ-báo-cáo và đọc hai danh sách: object-không-row và row-không-object.</li>
<li>Viết một câu vì sao lifecycle rule không làm được việc này.</li>
</ol>
<p><strong>Đạt khi:</strong> script liệt kê cả hai hướng mồ côi, bỏ qua bất kỳ cái nào trẻ hơn 24h, và không xoá gì cho tới khi lượt thứ hai xác nhận.</p></div>

<h3>🔬 Đo thật: vì sao lifecycle không giúp được, và bảng sổ chờ của kho</h3>
<p>Thứ một object cho luật thấy — không có gì về ai đang dùng nó — và mẫu phòng ngừa thật của kho:</p>
<div class="out">$ aws s3api head-object --bucket kho-mc --key attach/u41/…-a1.pdf --query '{LM:LastModified,Size:ContentLength,Meta:Metadata}'
{"LastModified":"2026-11-14T09:44:49+00:00","Size":1024,"Metadata":{}}
$ grep -n "model PendingUpload" -A12 prisma/schema.prisma | grep -E "status|expiresAt|PENDING|CONFIRMED|EXPIRED"
2193-  status    String   @default("PENDING") @map("status") @db.VarChar(20)
2194-  // PENDING = uploaded to R2, waiting to be linked to a post
2195-  // CONFIRMED = successfully linked to a SocialMedia row
2196-  // EXPIRED = cron job marked as orphaned, R2 object deleted
2197-  expiresAt DateTime @updatedAt @map("expires_at")
$ grep -n "cron.schedule('0 \\*/4" -A0 src/services/cron.service.ts; grep -n "take: 50\\|keyBelongsToUser(upload" src/services/cron.service.ts
411:  cron.schedule('0 */4 * * *', async () =&gt; {
426:        take: 50, // Process in batches to avoid overwhelming R2
440:          if (!keyBelongsToUser(upload.r2Key, upload.userId)) {</div>
<p>Bản đối soát chạy được (SQLite + MinIO, SDK v3 3.1071.0, <code>node:sqlite</code>; đặt <code>GRACE</code> bằng giây, chỉ xoá khi có <code>--that</code>):</p>
<pre><code class="language-javascript"><span class="tok-comment">// reconcile.mjs &lt;prefix&gt; [--that] — đối soát DB ↔ bucket theo LÔ: mỗi trang ListObjectsV2 (ở đây MaxKeys 8 để thấy phân trang) ⇒ MỘT câu SQL IN (…).</span>
<span class="tok-comment">// Mồ côi A (object không row) chỉ tính khi object CŨ hơn GRACE giây — tệp vừa tải lên có thể chưa kịp ghi row. Có --that mới xoá.</span>
import { DatabaseSync } from 'node:sqlite';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });
const db = new DatabaseSync('app.db');
const [Prefix, that] = process.argv.slice(2), GRACE = Number(process.env.GRACE ?? 86400);
const thay = new Set(), A = [];
let ContinuationToken, trang = 0, moi = 0;
do {
  const r = await s3.send(new ListObjectsV2Command({ Bucket: 'kho-mc', Prefix, MaxKeys: 8, ContinuationToken }));
  const keys = (r.Contents ?? []).map((o) =&gt; o.Key); trang++;
  const biet = new Set(db.prepare(&#96;SELECT r2_key FROM attachment WHERE r2_key IN (\${keys.map(() =&gt; '?').join(',') || "''"})&#96;).all(...keys).map((x) =&gt; x.r2_key));
  for (const o of r.Contents ?? []) {
    thay.add(o.Key);
    if (biet.has(o.Key)) continue;
    if ((Date.now() - o.LastModified.getTime()) / 1000 &lt; GRACE) { moi++; continue; }
    A.push(o.Key);
  }
  ContinuationToken = r.NextContinuationToken;
} while (ContinuationToken);
const B = db.prepare('SELECT r2_key FROM attachment WHERE r2_key LIKE ?').all(Prefix + '%').map((x) =&gt; x.r2_key).filter((k) =&gt; !thay.has(k));
console.log(&#96;\${trang} trang LIST · \${trang} câu SQL · bỏ qua \${moi} tệp mới hơn \${GRACE} s&#96;);
console.log(&#96;mồ côi A (object, không row): \${A.length}&#96;); for (const k of A) console.log('  A', k);
console.log(&#96;mồ côi B (row, không object): \${B.length}&#96;); for (const k of B) console.log('  B', k);
if (that &amp;&amp; A.length) { const r = await s3.send(new DeleteObjectsCommand({ Bucket: 'kho-mc', Delete: { Objects: A.map((Key) =&gt; ({ Key })) } }));
  console.log(&#96;đã xoá \${r.Deleted?.length ?? 0} object · lỗi \${r.Errors?.length ?? 0}&#96;); }
if (that &amp;&amp; B.length) { db.prepare(&#96;DELETE FROM attachment WHERE r2_key IN (\${B.map(() =&gt; '?').join(',')})&#96;).run(...B); console.log(&#96;đã xoá \${B.length} row hỏng&#96;); }</code></pre>
<h3>🌍 Đời thật, nếu… thì sao, và góc kẻ xấu</h3>
<ul>
<li><strong>Đời thật:</strong> người dùng xoá tài khoản — row mất, ảnh đại diện và tệp đính kèm còn nếu mã không xoá; ai đó tải video trong trình soạn bài rồi đóng tab — row <code>PendingUpload</code> của kho hết hạn và cron (4 giờ một lần, mỗi lần 50) xoá object.</li>
<li><strong>Nếu câu truy vấn database âm thầm trả về rỗng</strong> (nhầm môi trường, bảng đổi tên)? Mọi object đều trông như mồ côi. Đặt trần số xoá mỗi lần và dừng khi con số vô lý.</li>
<li><strong>Góc kẻ xấu:</strong> job dọn xoá bất kỳ key nào row ghi sẽ xoá tệp của người khác nếu ai đó đưa được key đó vào row của mình. Key mang chủ trong đường dẫn (<code>&lt;loại&gt;/u&lt;id&gt;/…</code>, như <code>buildKey</code> tạo) cho phép job kiểm &quot;chủ trong key = chủ trong row&quot; trước khi xoá — kho đã thêm bước kiểm này vào cron dọn ngày 14/11/2026.</li>
</ul>
<h3>🔁 Tự chạy lại</h3>
<p>Tạo một bảng SQLite và một bucket MinIO, ghi 20 row và 20 object, rồi cố ý làm lệch hai chiều. Chạy đối soát với <code>MaxKeys</code> nhỏ để thấy phân trang, tải một tệp trong lúc chạy để thấy ân hạn hoạt động, rồi mới thêm <code>--that</code>.</p>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-7-3-crud-transaction" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 7.3 — CRUD, transaction, và đổi Notes API sang PostgreSQL</span><span class="lc-sub">Transaction bao được gì và không bao được gì</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-0-2-model" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 0.2 — Bucket, key, object</span><span class="lc-sub">Key mang chủ trong đường dẫn: buildKey</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Orphan object</span><span class="v">Một key trong bucket không có row DB tương ứng.</span></div>
  <div class="kv"><span class="k">Orphan row</span><span class="v">Một row DB mà object của nó không còn trong bucket.</span></div>
  <div class="kv"><span class="k">Reconciliation job</span><span class="v">Tác vụ định kỳ so key bucket với key DB và sửa lệch.</span></div>
  <div class="kv"><span class="k">Dry-run / chỉ-báo-cáo</span><span class="v">Chế độ liệt kê cái sẽ xoá mà không xoá gì.</span></div>
  <div class="kv"><span class="k">Xác nhận hai lượt</span><span class="v">Chỉ xử lý sau khi key trông mồ côi ở hai lần chạy riêng.</span></div>
  <div class="kv"><span class="k">Cửa sổ ân hạn 24h</span><span class="v">Bỏ qua cái tạo trong ngày qua để upload đang bay được an toàn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bucket và DB lệch mỗi khi một write định vào cả hai fail giữa chừng.</li><li>Lifecycle rule không vá mồ côi được — nó không thấy database.</li><li>Job reconciliation so <code>ListObjectsV2</code> với DB theo batch, bắt cả hai hướng.</li><li>Phòng thủ: bỏ qua cái trẻ hơn 24h và yêu cầu hai lượt liên tiếp trước khi xoá.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — ListObjectsV2</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html — pagination và giới hạn 1000-key.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">S3 API — HeadObject</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html — 404 vs 403 quan trọng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — findMany với <code>in</code></span><span class="lc-sub">prisma.io/docs — pattern batch lookup.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-4-phuc-vu-media-cache" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 10.4: Phục vụ media trở lại</span><span class="lc-sub">Khoá Node.js dựng lại ba chỗ rò thường gặp trong MinIO cục bộ — bài bị xoá, upload bỏ dở, avatar bị thay — tìm chúng bằng "mọi thứ trong bucket trừ mọi thứ có dòng trỏ tới" (5 object, 2 được tham chiếu, 3 mồ côi, 2,21 MB) rồi quét sạch, và chỉ ra vì sao phải xoá object trước khi xoá dòng.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
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
            question: 'Lifecycle rule with <code>Filter.Prefix: "report"</code> (no trailing slash). What does it match?|||Lifecycle rule với <code>Filter.Prefix: "report"</code> (không slash cuối). Match gì?',
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
