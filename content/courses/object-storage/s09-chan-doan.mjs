const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 9 — Diagnosis cookbook|||Chương 9 — Sách công thức chẩn đoán',
  slug: 'os-ch9-chan-doan',
  description: 'Bốn bài chẩn đoán: 403 flowchart, checksum mismatch, latency spike, và signature debug.',
  sortOrder: 10,
  lessons: [

    {
      title: '9.1 — The 403 flowchart|||9.1 — Cây chẩn đoán 403',
      slug: 'os-9-1-common',
      type: 'VIDEO',
      description: 'S3-compatible services return 403 for at least six different reasons that look identical from the client. This flowchart names each one and how to distinguish.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>The 403 flowchart</h2>
<p class="lead">A 403 from an S3-compatible service is the most misleading response in cloud storage. The status code says &quot;forbidden&quot;. The XML body sometimes names the exact reason. Six distinct problems produce the same 403; treating them as one problem sends you down the wrong path. This lesson maps each and gives you the two-second question to distinguish them.</p>

<h3>The six kinds of 403 you will actually see</h3>
<pre><code class="language-text">Code path                  What the body says               First check
─────────────────────────  ──────────────────────────────  ─────────────────
1. Wrong signature         &quot;SignatureDoesNotMatch&quot;          Clock skew, region
2. Access key inactive     &quot;InvalidAccessKeyId&quot;             Token rotated / revoked
3. IAM policy denies       &quot;AccessDenied&quot;                    Bucket policy / IAM
4. Bucket policy blocks    &quot;AccessDenied&quot; + Deny statement  Bucket policy explicit deny
5. Presigned URL expired   &quot;Request has expired&quot;             URL age &gt; expiresIn
6. Presigned URL tampered  &quot;SignatureDoesNotMatch&quot;          Wrong bucket/key/method
</code></pre>

<p>The trick is that the XML body — buried inside a response the browser DevTools hides by default — carries the answer for four of the six. Read the body before doing anything else. If your fetch or SDK swallows it, add logging before you continue.</p>

<h3>The two-question triage</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Is the code &quot;SignatureDoesNotMatch&quot; or &quot;InvalidAccessKeyId&quot;?</span><span class="lz-d">If yes, this is credentials/signature. Skip to Layer A below. Do not touch bucket policies. Do not restart anything. The client and the server disagree about who you are.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Is the code &quot;AccessDenied&quot; with no additional context?</span><span class="lz-d">If yes, the credentials are valid — the server knows who you are, and it is choosing to say no. This is Layer B: bucket policy, IAM, or presigned URL scope. Different rooms entirely.</span></div>
</div>

<h3>Layer A — signature/credentials debugging</h3>
<pre><code class="language-bash"># Response body contains &quot;SignatureDoesNotMatch&quot; or &quot;InvalidAccessKeyId&quot;.
# The three top causes, in order of frequency:

# CAUSE 1: Clock skew &gt; 15 min
#   The client's local time and the server's disagree. AWS/R2 sign
#   requests with a timestamp and reject anything more than 15 min
#   off. Common on Docker containers with wrong /etc/localtime,
#   or CI runners with clock drift.
#
# CHECK:
date -u
curl -sI https://xxx.r2.cloudflarestorage.com | grep -i date

# If the two are &gt; 15 minutes apart, that is the entire problem.
# Fix: sync NTP inside the container/host.
sudo systemctl restart systemd-timesyncd  # or ntpd

# CAUSE 2: Region mismatch (S3 only)
#   SigV4 signs including the region name. If your endpoint is
#   us-east-1 but your client says us-west-2, signature invalid.
#   R2 uses region &quot;auto&quot;, so this is S3-only.
#
# CHECK: in code, what region did you pass to S3Client({region})?
#        Confirm it matches the bucket's actual region:
aws s3api get-bucket-location --bucket my-bucket

# CAUSE 3: Wrong or partial secret key
#   Sometimes the .env file has a truncated key (copy-paste ended
#   before the last char). Sometimes there's a stray space at the end.
#   Sometimes the key was rotated and the new one is not deployed yet.
#
# CHECK: print exactly what your app sees (not the whole key — first 4 chars).
node -e 'console.log(process.env.R2_SECRET_ACCESS_KEY?.slice(0,4), process.env.R2_SECRET_ACCESS_KEY?.length)'

# Real secret access keys are 40 chars for AWS, 64 chars for R2.
# Not 39. Not 41. Anything off-length is the whole story.
</code></pre>

<h3>Layer B — policy/authorization debugging</h3>
<pre><code class="language-bash"># Body says &quot;AccessDenied&quot; but the request signature was valid.
# The service accepted who you are and then refused what you asked to do.

# STEP 1: Confirm identity — who does the server think you are?
aws sts get-caller-identity   # AWS
# For R2 there's no equivalent, but the token has a name in
# Cloudflare dashboard -&gt; R2 -&gt; Manage R2 API Tokens.

# STEP 2: Simulate the exact action against the exact resource.
aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::123456789:user/my-app \\
  --action-names s3:PutObject \\
  --resource-arns arn:aws:s3:::my-bucket/uploads/photo.jpg

# The output says EXACTLY which policy allowed or denied.
# On R2 you inspect the token's permission scope in the dashboard:
#   read, write, or admin, and which buckets it applies to.

# STEP 3: Check for explicit Deny in the bucket policy.
#   An IAM Allow does NOT override a bucket-policy explicit Deny.
aws s3api get-bucket-policy --bucket my-bucket \\
  | jq -r .Policy | jq .
</code></pre>

<h3>Layer C — presigned URL specific</h3>
<pre><code class="language-text">Body says &quot;Request has expired&quot;:
  The URL's X-Amz-Expires + X-Amz-Date is now in the past.
  Client fetched the URL long after your server generated it.
  Fix: increase expiresIn (up to 7 days), or refresh URL client-side.

Body says &quot;SignatureDoesNotMatch&quot; but this is a presigned URL:
  Something changed between generation and use.
  Most common: the client added a header that was not in the
  original signing call (Content-Type, x-amz-meta-*, or the
  browser adding Origin). SigV4 signs specific headers; changing
  any signed header invalidates the signature.
  Fix: pass exactly the same headers on client fetch as you
  passed to getSignedUrl() on the server. See presign lesson.
</code></pre>

<h3>The one line of curl that answers 80% of 403s</h3>
<pre><code class="language-bash"># Take the exact request your app made and re-issue it with -v.
# The response body carries the answer for four of the six cases.

curl -v -X PUT \\
  -H 'Content-Type: image/jpeg' \\
  --data-binary @photo.jpg \\
  'https://xxx.r2.cloudflarestorage.com/my-bucket/uploads/photo.jpg?X-Amz-...'

# Read the body of the response, not just the status code.
# The XML looks like:
# &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
# &lt;Error&gt;
#   &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
#   &lt;Message&gt;The request signature we calculated does not match...&lt;/Message&gt;
#   &lt;StringToSign&gt;AWS4-HMAC-SHA256\\n2026-08-24T...&lt;/StringToSign&gt;
#   &lt;CanonicalRequest&gt;PUT\\n/my-bucket/uploads/photo.jpg\\n...&lt;/CanonicalRequest&gt;
# &lt;/Error&gt;

# The StringToSign and CanonicalRequest are the server's view of
# what it signed. Compare byte-for-byte to what your SDK signed.
# The FIRST character that differs is the bug.
</code></pre>

<h3>The three &quot;not really 403&quot; near-misses</h3>
<pre><code class="language-text">1. 400 SignatureDoesNotMatch — same problem, different code
   Some SDK versions surface signature failures as 400 not 403.
   Same debugging applies. Read the body.

2. 200 with body claiming success but the object is not there
   This is not 403 but often mistaken for one. Only S3-compatible
   services with eventual consistency show this. R2 is strongly
   consistent; if S3, wait 100ms and retry.

3. 404 NoSuchBucket masquerading as &quot;forbidden&quot;
   Some browsers show this in the console as &quot;access denied&quot;
   even though the response is 404. Read the body, not the
   browser UI.
</code></pre>

<div class="pitfall">
<p><strong>Trap — restarting the app when the fix is clock sync.</strong> Clock skew is the single most common cause of intermittent SigV4 signature failures, and no amount of restarting fixes it. Every container on the host has the same wrong time; every deploy from CI has the same wrong time. Check <code>date -u</code> against <code>curl -sI &lt;endpoint&gt; | grep -i date</code> before anything else on intermittent signature errors.</p>
</div>

<div class="pitfall">
<p><strong>Trap — treating the browser's console error as the response.</strong> Chrome's console often shows &quot;GET https://xxx failed with status 403&quot; while the actual XML body has &quot;Request has expired&quot;. The XML tells you the whole story; the console line is a summary. Always dig into the Network tab, click the failing request, view the Response body.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A 403 from an S3-compatible service is six different problems wearing the same status code, so the first move is to read the XML body (Code and Message fields); a &quot;SignatureDoesNotMatch&quot; or &quot;InvalidAccessKeyId&quot; is Layer A (clock, region, secret), a plain &quot;AccessDenied&quot; is Layer B (IAM/policy), and a presigned-URL context is Layer C (expiry or header tampering) — three totally separate paths that look identical if you only read the status code.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — Signature Version 4 errors</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html — every error code and its meaning.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Common errors</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/api — R2 error mapping vs AWS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — IAM simulate-principal-policy</span><span class="lc-sub">docs.aws.amazon.com/cli/latest/reference/iam/simulate-principal-policy.html — the &quot;why did this deny&quot; tool.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Cây chẩn đoán 403</h2>
<p class="lead">403 từ service S3-compatible là response gây nhầm lẫn nhất trong cloud storage. Status code nói &quot;forbidden&quot;. Body XML đôi khi nêu lý do chính xác. Sáu vấn đề riêng biệt sinh cùng 403; xử chúng như một vấn đề đưa bạn xuống path sai. Bài này map mỗi cái và cho câu hỏi hai giây để phân biệt.</p>

<h3>Sáu loại 403 bạn sẽ thấy thật</h3>
<pre><code class="language-text">Path code                  Body nói gì                     Check đầu
─────────────────────────  ──────────────────────────────  ─────────────────
1. Signature sai           &quot;SignatureDoesNotMatch&quot;          Clock skew, region
2. Access key inactive     &quot;InvalidAccessKeyId&quot;             Token xoay / revoke
3. IAM policy deny         &quot;AccessDenied&quot;                    Bucket policy / IAM
4. Bucket policy block     &quot;AccessDenied&quot; + Deny statement  Deny explicit bucket policy
5. Presigned URL hết hạn   &quot;Request has expired&quot;             Tuổi URL &gt; expiresIn
6. Presigned URL bị đổi    &quot;SignatureDoesNotMatch&quot;          Bucket/key/method sai
</code></pre>

<p>Mẹo là body XML — chôn trong response mà DevTools browser giấu mặc định — mang câu trả lời cho bốn trong sáu. Đọc body trước khi làm gì khác. Nếu fetch hoặc SDK nuốt nó, thêm log trước khi tiếp.</p>

<h3>Triage hai câu hỏi</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Code là &quot;SignatureDoesNotMatch&quot; hay &quot;InvalidAccessKeyId&quot;?</span><span class="lz-d">Nếu có, đây là credentials/signature. Nhảy tới Lớp A dưới. Đừng đụng bucket policy. Đừng restart gì. Client và server bất đồng về bạn là ai.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Code là &quot;AccessDenied&quot; không có context thêm?</span><span class="lz-d">Nếu có, credentials hợp lệ — server biết bạn là ai, và đang chọn nói không. Đây là Lớp B: bucket policy, IAM, hoặc scope presigned URL. Phòng hoàn toàn khác.</span></div>
</div>

<h3>Lớp A — debug signature/credentials</h3>
<pre><code class="language-bash"># Body response chứa &quot;SignatureDoesNotMatch&quot; hoặc &quot;InvalidAccessKeyId&quot;.
# Ba nguyên nhân top, theo tần suất:

# NGUYÊN 1: Clock skew &gt; 15 phút
#   Local time client và server bất đồng. AWS/R2 sign
#   request với timestamp và reject bất cứ gì hơn 15 phút
#   lệch. Phổ biến trên Docker container với /etc/localtime sai,
#   hoặc CI runner với clock drift.
#
# CHECK:
date -u
curl -sI https://xxx.r2.cloudflarestorage.com | grep -i date

# Nếu hai cách &gt; 15 phút, đó là toàn vấn đề.
# Vá: sync NTP trong container/host.
sudo systemctl restart systemd-timesyncd  # hoặc ntpd

# NGUYÊN 2: Region mismatch (S3 only)
#   SigV4 sign include tên region. Nếu endpoint là
#   us-east-1 nhưng client nói us-west-2, signature invalid.
#   R2 dùng region &quot;auto&quot;, nên đây là S3-only.
#
# CHECK: trong code, region nào bạn pass vào S3Client({region})?
#        Xác nhận match region thật của bucket:
aws s3api get-bucket-location --bucket my-bucket

# NGUYÊN 3: Secret key sai hoặc partial
#   Đôi khi file .env có key bị cắt (copy-paste kết thúc
#   trước ký tự cuối). Đôi khi có space rơi ở cuối.
#   Đôi khi key được xoay và cái mới chưa deploy.
#
# CHECK: in chính xác cái app thấy (không phải toàn key — 4 ký tự đầu).
node -e 'console.log(process.env.R2_SECRET_ACCESS_KEY?.slice(0,4), process.env.R2_SECRET_ACCESS_KEY?.length)'

# Secret access key thật là 40 ký tự cho AWS, 64 ký tự cho R2.
# Không phải 39. Không phải 41. Bất kỳ off-length nào là toàn câu chuyện.
</code></pre>

<h3>Lớp B — debug policy/authorization</h3>
<pre><code class="language-bash"># Body nói &quot;AccessDenied&quot; nhưng signature request hợp lệ.
# Service accept bạn là ai và rồi từ chối cái bạn xin làm.

# BƯỚC 1: Xác nhận identity — server nghĩ bạn là ai?
aws sts get-caller-identity   # AWS
# Cho R2 không có tương đương, nhưng token có tên trong
# dashboard Cloudflare -&gt; R2 -&gt; Manage R2 API Tokens.

# BƯỚC 2: Simulate action chính xác lên resource chính xác.
aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::123456789:user/my-app \\
  --action-names s3:PutObject \\
  --resource-arns arn:aws:s3:::my-bucket/uploads/photo.jpg

# Output nói CHÍNH XÁC policy nào allow hoặc deny.
# Trên R2 bạn inspect scope permission của token trong dashboard:
#   read, write, hoặc admin, và bucket nào áp dụng.

# BƯỚC 3: Check Deny explicit trong bucket policy.
#   IAM Allow KHÔNG override bucket-policy Deny explicit.
aws s3api get-bucket-policy --bucket my-bucket \\
  | jq -r .Policy | jq .
</code></pre>

<h3>Lớp C — riêng presigned URL</h3>
<pre><code class="language-text">Body nói &quot;Request has expired&quot;:
  X-Amz-Expires + X-Amz-Date của URL giờ ở quá khứ.
  Client fetch URL lâu sau khi server sinh.
  Vá: tăng expiresIn (tới 7 ngày), hoặc refresh URL client-side.

Body nói &quot;SignatureDoesNotMatch&quot; nhưng đây là presigned URL:
  Có gì đó thay đổi giữa sinh và dùng.
  Phổ biến nhất: client thêm header không có trong lời gọi
  sign gốc (Content-Type, x-amz-meta-*, hoặc browser thêm
  Origin). SigV4 sign header cụ thể; đổi bất kỳ header signed
  invalidate signature.
  Vá: pass đúng cùng header ở fetch client như bạn pass vào
  getSignedUrl() trên server. Xem bài presign.
</code></pre>

<h3>Một dòng curl trả lời 80% 403</h3>
<pre><code class="language-bash"># Lấy request chính xác app đã làm và re-issue với -v.
# Body response mang câu trả lời cho bốn trong sáu case.

curl -v -X PUT \\
  -H 'Content-Type: image/jpeg' \\
  --data-binary @photo.jpg \\
  'https://xxx.r2.cloudflarestorage.com/my-bucket/uploads/photo.jpg?X-Amz-...'

# Đọc body response, không chỉ status code.
# XML trông như:
# &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
# &lt;Error&gt;
#   &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
#   &lt;Message&gt;The request signature we calculated does not match...&lt;/Message&gt;
#   &lt;StringToSign&gt;AWS4-HMAC-SHA256\\n2026-08-24T...&lt;/StringToSign&gt;
#   &lt;CanonicalRequest&gt;PUT\\n/my-bucket/uploads/photo.jpg\\n...&lt;/CanonicalRequest&gt;
# &lt;/Error&gt;

# StringToSign và CanonicalRequest là view của server về
# cái nó đã sign. So byte-for-byte với cái SDK bạn sign.
# Ký tự ĐẦU tiên khác là bug.
</code></pre>

<h3>Ba &quot;không thực sự 403&quot; suýt trúng</h3>
<pre><code class="language-text">1. 400 SignatureDoesNotMatch — cùng vấn đề, code khác
   Một số phiên bản SDK surface fail signature là 400 không 403.
   Cùng debug áp dụng. Đọc body.

2. 200 với body claim success nhưng object không có
   Đây không phải 403 nhưng thường nhầm là. Chỉ service
   S3-compatible với eventual consistency hiện cái này. R2
   strongly consistent; nếu S3, chờ 100ms và retry.

3. 404 NoSuchBucket giả trang &quot;forbidden&quot;
   Một số browser hiện cái này trong console là &quot;access denied&quot;
   dù response là 404. Đọc body, không phải UI browser.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — restart app khi vá là sync clock.</strong> Clock skew là nguyên nhân phổ biến nhất của fail signature SigV4 intermittent, và không lượng restart nào vá được. Mọi container trên host có cùng time sai; mọi deploy từ CI có cùng time sai. Check <code>date -u</code> so với <code>curl -sI &lt;endpoint&gt; | grep -i date</code> trước bất cứ gì khác trên error signature intermittent.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi error console browser như response.</strong> Console Chrome thường hiện &quot;GET https://xxx failed with status 403&quot; trong khi body XML thật có &quot;Request has expired&quot;. XML nói toàn câu chuyện; dòng console là summary. Luôn đào vào tab Network, click request fail, xem Response body.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> 403 từ service S3-compatible là sáu vấn đề khác nhau mặc cùng status code, nên move đầu là đọc body XML (field Code và Message); &quot;SignatureDoesNotMatch&quot; hoặc &quot;InvalidAccessKeyId&quot; là Lớp A (clock, region, secret), &quot;AccessDenied&quot; trần là Lớp B (IAM/policy), và context presigned-URL là Lớp C (hết hạn hoặc header bị đổi) — ba path hoàn toàn riêng biệt trông giống hệt nếu chỉ đọc status code.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — Signature Version 4 errors</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html — mọi error code và ý nghĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Common errors</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/api — map error R2 vs AWS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — IAM simulate-principal-policy</span><span class="lc-sub">docs.aws.amazon.com/cli/latest/reference/iam/simulate-principal-policy.html — tool &quot;vì sao deny&quot;.</span></span></div>
</div>
`,
    },


    {
      title: '9.2 — Latency spikes and where they come from|||9.2 — Spike latency và chúng đến từ đâu',
      slug: 'os-9-2-latency',
      type: 'VIDEO',
      description: 'A GET that used to take 40ms now takes 4 seconds intermittently. The five actual causes of storage latency spikes and how to distinguish them without a full APM.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Latency spikes and where they come from</h2>
<p class="lead">Storage latency is bimodal — 99% of GETs come back in tens of milliseconds and a small tail takes seconds. When the tail grows, the cause is almost never &quot;the bucket is slow&quot;; it is one of five specific things happening between your process and the object. Naming which one is what separates a five-minute fix from a three-hour investigation.</p>

<h3>Where the milliseconds actually go</h3>
<pre><code class="language-text">A healthy R2 GET from a VPS in the same region:

  DNS resolve             1-5 ms   (cached after first request)
  TCP handshake           5-15 ms
  TLS handshake          20-40 ms
  Signature calc          1-3 ms   (in client SDK, CPU-bound)
  HTTP request send       1-5 ms
  Server processing      10-40 ms  (R2 finds the object)
  Bytes downloaded       depends   (1 MB @ 100 Mbps = 80 ms)
  ─────────────────────  ─────────
  TOTAL small object     40-100 ms

Reuse the same TCP+TLS connection (SDK keep-alive):
  All of the above except server processing + bytes = 0 ms
  A hot connection GET is ~20-50 ms end-to-end.
</code></pre>

<p>Anything not in that envelope is a diagnosis problem. A 4-second GET is not &quot;40 ms × 100&quot;, it is one specific step ballooning by 100×. Find which step.</p>

<h3>The five real causes</h3>
<pre><code class="language-text">Cause                      Symptom                       Distinguishing test
────────────────────────  ────────────────────────────  ─────────────────────
1. Cold connection reuse    Every new instance slow       Warm one connection,
                            for first 3-5 requests,       measure 2nd request
                            then fast.                    latency.
                            
2. TLS handshake burden     First request per host slow,  Compare curl -w with
                            all subsequent fast.          --resolve to reuse
                                                          same session.
                                                          
3. Overloaded local net     Latency correlates with       Ping the endpoint
                            local CPU / network usage.    while the app is
                                                          slow. Local RTT
                                                          would spike too.
                                                          
4. Bucket prefix hot        Small subset of keys slow,    Try a totally
                            others fine. Grows with load. different prefix; if
                                                          fast, prefix is the
                                                          bottleneck.
                                                          
5. Genuine service issue    All keys, all clients, all    Check status page.
                            regions slow simultaneously.  Very rare on R2/S3.
</code></pre>

<p>Cause 1 is by far the most common one people miss. A serverless function or short-lived worker creates a fresh S3 client, does one GET, exits — every invocation pays the full connection setup cost. Reuse the client, and 40 ms becomes 5 ms.</p>

<h3>The one-line SDK fix for cause 1</h3>
<pre><code class="language-javascript">// BAD — new client per request
export async function handler(event) {
  const s3 = new S3Client({ region: 'auto', endpoint: process.env.R2_ENDPOINT })
  const res = await s3.send(new GetObjectCommand({ Bucket: 'x', Key: 'y' }))
  return res
}

// GOOD — module-scope client, reused across all invocations of a warm instance
const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: { /*...*/ },
  // Node.js 18+ default HTTP handler already reuses connections.
  // If you customized the handler, ensure keepAlive: true.
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 3_000,
    socketTimeout: 30_000,
    httpAgent: new http.Agent({ keepAlive: true, maxSockets: 50 }),
    httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 50 }),
  }),
})

export async function handler(event) {
  const res = await s3.send(new GetObjectCommand({ Bucket: 'x', Key: 'y' }))
  return res
}
</code></pre>

<h3>The measurement that isolates the step</h3>
<pre><code class="language-bash"># curl -w prints per-step timing. Run 10 times, watch for outliers.
for i in {1..10}; do
  curl -s -o /dev/null -w \\
    'connect=%{time_connect}s tls=%{time_appconnect}s ttfb=%{time_starttransfer}s total=%{time_total}s\\n' \\
    'https://xxx.r2.cloudflarestorage.com/my-bucket/photo.jpg?X-Amz-...'
done
</code></pre>
<div class="out">
<pre><code class="language-text">connect=0.030s tls=0.087s ttfb=0.121s total=0.135s
connect=0.028s tls=0.083s ttfb=0.118s total=0.132s
connect=0.031s tls=0.089s ttfb=3.847s total=3.892s   ← THIS one
connect=0.029s tls=0.084s ttfb=0.119s total=0.133s
connect=0.029s tls=0.085s ttfb=0.120s total=0.134s
connect=0.030s tls=0.086s ttfb=0.117s total=0.132s

Reading:
  connect stayed at ~30ms — not a network issue
  tls stayed at ~85ms — not a TLS issue
  ttfb ballooned on request 3 — the SERVER took 3.7s on that
    particular object, i.e. the storage layer, not the client
    and not the network.
    
That is Cause 4 or 5 — a hot key, or a genuine transient service
blip. If it happens on the same key repeatedly, prefix. If it
scatters across keys, service — check the status page.
</code></pre>
</div>

<h3>Cause 4 — hot prefix (S3-specific, mostly)</h3>
<pre><code class="language-text">S3 auto-scales request capacity per prefix. When traffic to a
single prefix (say /uploads/) suddenly ramps 10×, S3 briefly
throttles until it finishes splitting. During that window
requests to that prefix take 500ms-5s each.

R2 is architected differently — no per-prefix scaling, so this
cause is much less common on R2. But if your R2 latency is
bad on a specific key range and fine elsewhere, the same fix
applies: SPREAD YOUR PREFIXES.

Before:  uploads/user-42/photo-001.jpg  ← all writes share &quot;uploads/&quot;
After:   YYYY-MM-DD/user-42/photo-001.jpg  ← writes spread by date

The classical trick on S3 was to hash-prefix keys:
  &#96;\${sha256(key).slice(0,4)}/\${key}&#96;
  4 hex chars = 65,536 buckets of parallelism
  
S3 has since added auto-scaling that makes this less necessary.
R2 does not need it at all.
</code></pre>

<h3>The trickiest one — variable-sized latency because of range reads</h3>
<pre><code class="language-text">If your app reads with the Range header (playing a video, streaming
a file), each range is its own GET. Latency scales with number of
ranges, not total bytes. Some players make hundreds of tiny range
requests for a single video.

DevTools -&gt; Network -&gt; filter to media -&gt; look for the video URL
appearing 100+ times. If it is, either:
  (a) increase the player's chunk size (default is often 32 KB), or
  (b) put a CDN in front so range reads are served from cache
      instead of round-tripping to R2.
</code></pre>

<div class="pitfall">
<p><strong>Trap — blaming the storage service for lambda cold-start latency.</strong> A lambda that has been idle 5 minutes takes 200-800 ms to start, plus ~40 ms to reach R2 for its first GET. The user sees &quot;1 second before the response&quot; and files a bug against your storage. The fix is provisioned concurrency on the function, not anything about the bucket.</p>
</div>

<div class="pitfall">
<p><strong>Trap — assuming the SDK reuses connections by default.</strong> The AWS JS SDK v3 does, but the v2 SDK did NOT unless you configured <code>httpOptions.agent</code> with <code>keepAlive: true</code>. Many legacy codebases still run v2. If you see &quot;first request slow, second fast&quot; and you're on v2, that is the fix.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Storage latency spikes are almost always one of five specific causes (cold connection, first-TLS-handshake, local network, hot prefix, genuine service blip), each with a distinguishing measurement — run <code>curl -w</code> ten times to see whether TCP/TLS/TTFB is the ballooning number, then match to cause: if <code>connect</code>+<code>tls</code> spike it is connection setup (fix: keep-alive), if <code>ttfb</code> spikes intermittently on the same key it is prefix (fix: spread keys), and if it spikes across every request from every client it is the service (fix: wait, or file support).</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — S3 request rate performance</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html — prefix scaling behavior.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SDK v3 — reusing connections</span><span class="lc-sub">docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-reusing-connections.html — the keep-alive story on JS SDK.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 status page</span><span class="lc-sub">cloudflarestatus.com — filter by R2 for the &quot;is it just me&quot; check.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Range requests</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests — why players fire many small GETs.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Spike latency và chúng đến từ đâu</h2>
<p class="lead">Latency storage bimodal — 99% GET về trong chục mili giây và tail nhỏ mất giây. Khi tail phình, nguyên nhân gần như không bao giờ &quot;bucket chậm&quot;; đó là một trong năm thứ cụ thể xảy ra giữa process và object. Đặt tên cái nào là khác biệt giữa vá năm phút và điều tra ba giờ.</p>

<h3>Mili giây thực sự đi đâu</h3>
<pre><code class="language-text">GET R2 khỏe từ VPS cùng region:

  DNS resolve             1-5 ms   (cache sau request đầu)
  TCP handshake           5-15 ms
  TLS handshake          20-40 ms
  Tính signature          1-3 ms   (trong client SDK, CPU-bound)
  Gửi HTTP request        1-5 ms
  Server xử              10-40 ms  (R2 tìm object)
  Byte download          tuỳ       (1 MB @ 100 Mbps = 80 ms)
  ─────────────────────  ─────────
  TỔNG object nhỏ        40-100 ms

Reuse cùng TCP+TLS connection (SDK keep-alive):
  Tất trên trừ server xử + byte = 0 ms
  GET connection nóng ~20-50 ms end-to-end.
</code></pre>

<p>Bất cứ gì không trong bao đó là vấn đề chẩn đoán. GET 4-giây không phải &quot;40 ms × 100&quot;, mà một bước cụ thể phình 100×. Tìm bước nào.</p>

<h3>Năm nguyên nhân thật</h3>
<pre><code class="language-text">Nguyên nhân                Triệu chứng                   Test phân biệt
────────────────────────  ────────────────────────────  ─────────────────────
1. Reuse connection cold    Mọi instance mới chậm         Nóng một connection,
                            3-5 request đầu, rồi nhanh.   đo latency request 2.
                            
2. Gánh handshake TLS       Request đầu per host chậm,    So curl -w với
                            mọi subsequent nhanh.         --resolve reuse
                                                          cùng session.
                                                          
3. Mạng local quá tải       Latency correlate CPU/network Ping endpoint khi
                            local.                        app chậm. RTT local
                                                          spike nữa.
                                                          
4. Prefix bucket hot        Subset key nhỏ chậm, khác     Thử prefix hoàn toàn
                            ổn. Tăng với load.            khác; nếu nhanh, prefix
                                                          là bottleneck.
                                                          
5. Service issue thật       Mọi key, mọi client, mọi      Check status page.
                            region chậm cùng lúc.         Rất hiếm trên R2/S3.
</code></pre>

<p>Nguyên nhân 1 là phổ biến nhất mọi người bỏ. Function serverless hoặc worker ngắn-đời tạo S3 client fresh, làm một GET, exit — mỗi invocation trả full cost setup connection. Reuse client, và 40 ms thành 5 ms.</p>

<h3>Vá SDK một dòng cho nguyên nhân 1</h3>
<pre><code class="language-javascript">// TỆ — client mới per request
export async function handler(event) {
  const s3 = new S3Client({ region: 'auto', endpoint: process.env.R2_ENDPOINT })
  const res = await s3.send(new GetObjectCommand({ Bucket: 'x', Key: 'y' }))
  return res
}

// TỐT — client scope module, reuse qua mọi invocation instance warm
const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: { /*...*/ },
  // Node.js 18+ HTTP handler mặc định đã reuse connection.
  // Nếu customize handler, đảm keepAlive: true.
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 3_000,
    socketTimeout: 30_000,
    httpAgent: new http.Agent({ keepAlive: true, maxSockets: 50 }),
    httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 50 }),
  }),
})

export async function handler(event) {
  const res = await s3.send(new GetObjectCommand({ Bucket: 'x', Key: 'y' }))
  return res
}
</code></pre>

<h3>Đo isolate bước</h3>
<pre><code class="language-bash"># curl -w in timing per-step. Chạy 10 lần, xem outlier.
for i in {1..10}; do
  curl -s -o /dev/null -w \\
    'connect=%{time_connect}s tls=%{time_appconnect}s ttfb=%{time_starttransfer}s total=%{time_total}s\\n' \\
    'https://xxx.r2.cloudflarestorage.com/my-bucket/photo.jpg?X-Amz-...'
done
</code></pre>
<div class="out">
<pre><code class="language-text">connect=0.030s tls=0.087s ttfb=0.121s total=0.135s
connect=0.028s tls=0.083s ttfb=0.118s total=0.132s
connect=0.031s tls=0.089s ttfb=3.847s total=3.892s   ← CÁI này
connect=0.029s tls=0.084s ttfb=0.119s total=0.133s
connect=0.029s tls=0.085s ttfb=0.120s total=0.134s
connect=0.030s tls=0.086s ttfb=0.117s total=0.132s

Đọc:
  connect giữ ~30ms — không vấn đề network
  tls giữ ~85ms — không vấn đề TLS
  ttfb phình ở request 3 — SERVER mất 3.7s trên object
    cụ thể đó, tức là lớp storage, không phải client
    và không phải network.
    
Đó là Nguyên nhân 4 hoặc 5 — key hot, hoặc blip service
transient thật. Nếu xảy trên cùng key lặp, prefix. Nếu
scatter qua key, service — check status page.
</code></pre>
</div>

<h3>Nguyên nhân 4 — prefix hot (chủ yếu S3)</h3>
<pre><code class="language-text">S3 auto-scale capacity request per prefix. Khi traffic tới
một prefix (vd /uploads/) đột ngột ramp 10×, S3 tạm throttle
tới khi xong split. Trong window đó request tới prefix đó
mất 500ms-5s mỗi cái.

R2 architect khác — không scaling per-prefix, nên nguyên nhân
này ít phổ biến hơn nhiều trên R2. Nhưng nếu latency R2 tệ
trên một range key cụ thể và ổn khác, cùng vá áp dụng:
TRẢI PREFIX.

Trước:   uploads/user-42/photo-001.jpg  ← mọi write share &quot;uploads/&quot;
Sau:     YYYY-MM-DD/user-42/photo-001.jpg  ← write trải theo ngày

Trick kinh điển trên S3 là hash-prefix key:
  &#96;\${sha256(key).slice(0,4)}/\${key}&#96;
  4 hex char = 65,536 bucket parallelism
  
S3 từ đó đã thêm auto-scaling làm cái này ít cần thiết hơn.
R2 không cần gì cả.
</code></pre>

<h3>Cái tricky nhất — latency size biến vì range read</h3>
<pre><code class="language-text">Nếu app đọc với header Range (play video, stream file), mỗi
range là GET riêng. Latency scale với số range, không phải
tổng byte. Một số player làm hàng trăm request range tí xíu
cho một video.

DevTools -&gt; Network -&gt; filter media -&gt; xem URL video
xuất hiện 100+ lần. Nếu có, hoặc:
  (a) tăng chunk size player (mặc định thường 32 KB), hoặc
  (b) đặt CDN trước để range read phục vụ từ cache
      thay round-trip R2.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — đổ lỗi service storage cho latency lambda cold-start.</strong> Lambda idle 5 phút mất 200-800 ms start, plus ~40 ms đến R2 cho GET đầu. User thấy &quot;1 giây trước response&quot; và mở bug lên storage. Vá là provisioned concurrency trên function, không phải gì về bucket.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — giả định SDK reuse connection mặc định.</strong> AWS JS SDK v3 có, nhưng SDK v2 KHÔNG trừ khi bạn config <code>httpOptions.agent</code> với <code>keepAlive: true</code>. Nhiều codebase legacy vẫn chạy v2. Nếu thấy &quot;request đầu chậm, thứ hai nhanh&quot; và ở v2, đó là vá.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Spike latency storage gần như luôn là một trong năm nguyên nhân cụ thể (connection cold, handshake TLS đầu, mạng local, prefix hot, blip service thật), mỗi cái với đo phân biệt — chạy <code>curl -w</code> mười lần để xem TCP/TLS/TTFB là số phình, rồi match nguyên nhân: nếu <code>connect</code>+<code>tls</code> spike là setup connection (vá: keep-alive), nếu <code>ttfb</code> spike intermittent trên cùng key là prefix (vá: trải key), và nếu spike qua mọi request từ mọi client là service (vá: chờ, hoặc mở support).</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — S3 request rate performance</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html — hành vi scaling prefix.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SDK v3 — reusing connections</span><span class="lc-sub">docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-reusing-connections.html — câu chuyện keep-alive trên JS SDK.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 status page</span><span class="lc-sub">cloudflarestatus.com — filter theo R2 cho check &quot;chỉ mình tôi?&quot;.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Range requests</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests — vì sao player bắn nhiều GET nhỏ.</span></span></div>
</div>
`,
    },

    {
      title: '9.3 — Chapter 9 quiz|||9.3 — Kiểm tra Chương 9',
      slug: 'os-9-3-quiz',
      type: 'QUIZ',
      description: 'Bốn câu về 403 và latency.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 9 · Quiz</span><h2>What Chapter 9 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 9 · Kiểm tra</span><h2>Chương 9 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 400,
        questions: [
          {
            question: 'R2 returns 403 with body <code>&lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;</code>. First diagnostic step?|||R2 trả 403 với body <code>&lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;</code>. Bước chẩn đoán đầu?',
            options: [
              'Check clock skew — run <code>date -u</code> and compare to <code>curl -sI &lt;endpoint&gt; | grep -i date</code>. SigV4 rejects timestamps &gt; 15 min off. Container / CI clocks drifting is the single most common cause of intermittent signature failures, and no bucket-policy or IAM change fixes it.|||Check clock skew — chạy <code>date -u</code> và so <code>curl -sI &lt;endpoint&gt; | grep -i date</code>. SigV4 reject timestamp &gt; 15 phút lệch. Clock container / CI drift là nguyên nhân phổ biến nhất của fail signature intermittent, và không thay đổi bucket-policy hay IAM nào vá được.',
              'Restart the app|||Restart app',
              'Change bucket policy|||Đổi bucket policy',
              'Delete the bucket|||Xoá bucket',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A GET latency histogram shows p50=40ms, p99=4s. curl -w over 10 requests shows connect+tls stable, but ttfb spikes on one request only. Cause?|||Histogram latency GET hiện p50=40ms, p99=4s. curl -w 10 request hiện connect+tls ổn, nhưng ttfb spike chỉ một request. Nguyên nhân?',
            options: [
              'Server-side spike on that specific object (Cause 4 hot prefix on S3, or genuine transient service blip). Client + network are healthy; the storage layer took long on that request. If it recurs on the same key/prefix, spread the prefix; if scattered, check the status page.|||Spike server-side trên object cụ thể đó (Nguyên nhân 4 prefix hot trên S3, hoặc blip service transient thật). Client + network khoẻ; lớp storage mất lâu trên request đó. Nếu tái diễn trên cùng key/prefix, trải prefix; nếu scatter, check status page.',
              'Bad WiFi|||WiFi tệ',
              'SDK bug|||Bug SDK',
              'Cold start|||Cold start',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A serverless function has &quot;first request 200ms, subsequent 30ms&quot; latency. Best fix?|||Function serverless có latency &quot;request đầu 200ms, sau 30ms&quot;. Vá tốt nhất?',
            options: [
              'Move the S3Client construction to module scope so it survives across warm invocations, and ensure the underlying HTTP agent has keepAlive: true. Cold-start cost is paid only when the runtime is cold; warm invocations reuse the TCP+TLS connection. AWS SDK v3 defaults to keep-alive; v2 requires explicit config.|||Chuyển construct S3Client sang module scope để nó sống qua invocation warm, và đảm HTTP agent nền có keepAlive: true. Cost cold-start trả chỉ khi runtime cold; invocation warm reuse connection TCP+TLS. AWS SDK v3 mặc định keep-alive; v2 cần config explicit.',
              'Set higher timeout|||Set timeout cao hơn',
              'Add retries|||Thêm retry',
              'Switch region|||Đổi region',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: '403 body says <code>&lt;Code&gt;AccessDenied&lt;/Code&gt;</code>. Signature is valid. Where do you look?|||Body 403 nói <code>&lt;Code&gt;AccessDenied&lt;/Code&gt;</code>. Signature hợp lệ. Nhìn đâu?',
            options: [
              'IAM policy on the token/role (S3: <code>aws iam simulate-principal-policy</code>; R2: token permission scope in dashboard). If those allow the action, next check bucket policy for an explicit Deny — bucket-policy Deny overrides IAM Allow. Signature-level fixes (clock, region, key) are irrelevant since the signature verified.|||IAM policy trên token/role (S3: <code>aws iam simulate-principal-policy</code>; R2: scope permission token trong dashboard). Nếu chúng allow action, kế check bucket policy Deny explicit — Deny bucket-policy override IAM Allow. Vá signature-level (clock, region, key) không liên quan vì signature đã verify.',
              'Clock sync|||Sync clock',
              'Rotate the key|||Xoay key',
              'Change endpoint|||Đổi endpoint',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
