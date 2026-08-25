const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 4 — Presigned upload security|||Chương 4 — Bảo mật presigned upload',
  slug: 'os-ch4-presign',
  description: 'Ba bài về presigned PUT — kể cả bug SigV4 signableHeaders XSS thật mà kho này bắt được (comment ở r2.ts) và cách vá.',
  sortOrder: 5,
  lessons: [

    {
      title: '4.1 — Why direct upload from browser: bypass server limits|||4.1 — Vì sao upload trực tiếp từ browser: bypass giới hạn server',
      slug: 'os-4-1-vi-sao',
      type: 'VIDEO',
      description: 'Cloudflare proxy có limit 100 MB body. File lớn phải upload TRỰC TIẾP tới R2, bypass server. Backend chỉ cấp URL signed.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Why direct upload from browser: bypass server limits</h2>
<p class="lead">User uploads a 500 MB video. Naive: POST to your API, backend forwards to R2. Result: Cloudflare proxy strips at 100 MB, or your Express server crashes on 500 MB in RAM. Direct upload solves both.</p>

<h3>Three approaches compared</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Naive: POST to API</span><span class="lz-nsub">breaks at ~100 MB</span></span>
<span class="lz-nbody">Client POST file to /api/upload → backend receive in RAM → forward to R2. Fails on Cloudflare 100 MB limit; backend RAM exhaustion; slow (double-hop).</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Streaming via API</span><span class="lz-nsub">complex, still slow</span></span>
<span class="lz-nbody">Backend stream body → S3 multipart. Solves RAM issue but still Cloudflare limit + double network hop. Complex code.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Presigned PUT direct</span><span class="lz-nsub">the standard</span></span>
<span class="lz-nbody">Backend generate signed URL → client PUT DIRECTLY to R2. No 100 MB limit, no backend memory, single-hop upload. R2 verifies signature.</span>
</div>
</div>

<h3>This repo's flow — from r2.ts + api.ts</h3>
<pre><code class="language-ts">// 1. Client request signed URL from backend
POST /api/v1/files/presign-r2
{ filename: 'video.mp4', contentType: 'video/mp4' }

// 2. Backend generate signed URL
async function presign(req, res) {
  const { contentType } = req.body;
  const key = &#96;users/\${req.user.id}/videos/\${uuid()}.mp4&#96;;
  const url = await getSignedUploadUrl(key, contentType, 3600);
  res.json({ key, uploadUrl: url });
}

// 3. Client PUT file directly to R2
xhr.open('PUT', uploadUrl);
xhr.setRequestHeader('Content-Type', file.type);
xhr.send(file);   // 500 MB straight to R2, bypass server

// 4. Client notify backend on success
POST /api/v1/files/complete
{ key: 'users/42/videos/xxx.mp4', size: 500000000 }
</code></pre>

<div class="callout ok">
<p><strong>Four steps, three parties.</strong> Client ↔ backend (auth + presign), client ↔ R2 (upload), client ↔ backend (register). The backend never touches the file bytes.</p>
</div>

<h3>Cloudflare 100 MB limit</h3>
<div class="out">Cloudflare proxy (free + pro plan): 100 MB request body max
Business plan: 200 MB
Enterprise: 500 MB

Kho nay dung Cloudflare free -&gt; 100 MB hard limit
Voi videos 500 MB, direct upload la BAT BUOC (khong workaround)
</div>

<h3>Trade off: complexity</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">The client code gets more complex</span><span class="lz-d">The frontend has to request a presign, PUT to R2, and then notify completion. It is no longer one API call.</span></div>
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">The security gets more subtle</span><span class="lz-d">The SigV4 signature must pin the content type (Lesson 4.2). This repo had a bug exactly there.</span></div>
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">Retry harder</span><span class="lz-d">A network drop mid-PUT means the client has to retry itself (the SDK will not). Multipart makes resuming possible.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — không set CORS trên bucket.</strong> A browser PUT to R2 is cross-origin, so the bucket must allow PUT from your site's origin. Chapter 5 covers the CORS setup.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Uploading directly from the browser to R2 with a presigned PUT URL sidesteps Cloudflare's 100 MB proxy limit, backend RAM exhaustion, and double-hop latency — the trade is more complex client code (presign → PUT → notify) and a security requirement to pin the content type via signableHeaders (Lesson 4.2).</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Request body size limits</span><span class="lc-sub">developers.cloudflare.com/rules/reference/edge-response-headers — 100 MB free/pro.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Vì sao upload trực tiếp từ browser: bypass giới hạn server</h2>
<p class="lead">User upload video 500 MB. Ngây thơ: POST tới API, backend forward tới R2. Kết quả: Cloudflare proxy strip ở 100 MB, hoặc Express server crash với 500 MB trong RAM. Direct upload giải quyết cả hai.</p>

<h3>Ba approach so sánh</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Ngây thơ: POST API</span><span class="lz-nsub">vỡ ở ~100 MB</span></span>
<span class="lz-nbody">Client POST file tới /api/upload → backend receive vào RAM → forward tới R2. Fail ở Cloudflare 100 MB limit; backend RAM exhaustion; chậm (double-hop).</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Streaming qua API</span><span class="lz-nsub">phức tạp, vẫn chậm</span></span>
<span class="lz-nbody">Backend stream body → S3 multipart. Giải quyết RAM nhưng vẫn Cloudflare limit + double network hop. Code phức tạp.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Presigned PUT direct</span><span class="lz-nsub">chuẩn</span></span>
<span class="lz-nbody">Backend generate signed URL → client PUT TRỰC TIẾP tới R2. Không 100 MB limit, không backend memory, single-hop upload. R2 verify signature.</span>
</div>
</div>

<h3>Kho này flow — từ r2.ts + api.ts</h3>
<pre><code class="language-ts">// 1. Client request signed URL từ backend
POST /api/v1/files/presign-r2
{ filename: 'video.mp4', contentType: 'video/mp4' }

// 2. Backend generate signed URL
async function presign(req, res) {
  const { contentType } = req.body;
  const key = &#96;users/\${req.user.id}/videos/\${uuid()}.mp4&#96;;
  const url = await getSignedUploadUrl(key, contentType, 3600);
  res.json({ key, uploadUrl: url });
}

// 3. Client PUT file trực tiếp tới R2
xhr.open('PUT', uploadUrl);
xhr.setRequestHeader('Content-Type', file.type);
xhr.send(file);   // 500 MB thẳng tới R2, bypass server

// 4. Client notify backend on success
POST /api/v1/files/complete
{ key: 'users/42/videos/xxx.mp4', size: 500000000 }
</code></pre>

<div class="callout ok">
<p><strong>Bốn bước, ba party.</strong> Client ↔ backend (auth + presign), client ↔ R2 (upload), client ↔ backend (register). Backend không bao giờ chạm file bytes.</p>
</div>

<h3>Cloudflare 100 MB limit</h3>
<div class="out">Cloudflare proxy (free + pro plan): 100 MB request body max
Business plan: 200 MB
Enterprise: 500 MB

Kho nay dung Cloudflare free -&gt; 100 MB hard limit
Voi videos 500 MB, direct upload la BAT BUOC (khong workaround)
</div>

<h3>Trade off: complexity</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">Client code phức tạp hơn</span><span class="lz-d">FE phải handle presign request, PUT to R2, notify complete. Không chỉ 1 API call.</span></div>
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">Security phức tạp hơn</span><span class="lz-d">SigV4 signature phải pin content type (Bài 4.2). Kho này đã có bug ở đây.</span></div>
<div class="lz-step"><span class="lz-k">-</span><span class="lz-t">Retry harder</span><span class="lz-d">Network drop giữa PUT → client tự retry (SDK không có sẵn). Multipart giúp resume.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — không set CORS trên bucket.</strong> Browser PUT tới R2 = cross-origin. Bucket phải allow PUT từ site origin. Chương 5 dạy CORS setup.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Direct upload từ browser đến R2 với presigned PUT URL bypass Cloudflare 100 MB proxy limit + backend RAM exhaustion + double-hop latency — trade off là client code phức tạp hơn (presign → PUT → notify) và security cần pin content type qua signableHeaders (Bài 4.2).</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Request body size limits</span><span class="lc-sub">developers.cloudflare.com/rules/reference/edge-response-headers — 100 MB free/pro.</span></span></div>
</div>
`,
    },

    {
      title: '4.2 — The SigV4 signableHeaders XSS bug|||4.2 — Bug SigV4 signableHeaders XSS',
      slug: 'os-4-2-sigv4-bug',
      type: 'VIDEO',
      description: 'Kho này bắt được: presigned PUT không pin ContentType → attacker upload text/html → stored XSS trên media domain. Bug thật, đã vá, có test đối chứng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>The SigV4 signableHeaders XSS bug</h2>
<p class="lead">This repo has a comment in r2.ts documenting a real security incident. Someone caught that presigned PUT URLs, without explicit signableHeaders, only sign the <code>host</code> header. That means a client can take a signed URL for &quot;upload video/mp4&quot; and instead PUT text/html — which R2 then serves as HTML from the media domain. Stored XSS.</p>

<h3>The vulnerable code</h3>
<pre><code class="language-ts">// VULNERABLE
const cmd = new PutObjectCommand({
  Bucket, Key, ContentType: 'video/mp4',
});
const url = await getSignedUrl(client, cmd, { expiresIn: 3600 });
// SDK default: signs only 'host' header
// -&gt; ContentType in cmd is now just a DEFAULT, not signed
// -&gt; client can PUT with any Content-Type
</code></pre>

<h3>The attack</h3>
<pre><code class="language-bash"># Attacker requests signed URL for a legit video upload
$ curl -X POST /api/v1/files/presign-r2 -d '{"contentType":"video/mp4"}' 
{ "uploadUrl": "https://xxx.r2.cloudflarestorage.com/bucket/key?X-Amz-...&X-Amz-SignedHeaders=host&X-Amz-Signature=..." }

# Attacker uploads HTML instead of video
$ curl -X PUT "$UPLOAD_URL" \\
    -H "Content-Type: text/html" \\
    -d "&lt;script&gt;alert('xss')&lt;/script&gt;"
# R2 responds 200 — signature only bound host, not content-type

# Now media.cuongthai.com/key serves HTML
$ curl https://media.cuongthai.com/key -I
HTTP/2 200
content-type: text/html    &lt;- stored XSS on media domain!
</code></pre>

<div class="callout warn">
<p><strong>Content-Type on PutObjectCommand is not enough.</strong> It only sets a DEFAULT ContentType. An attacker can override it on the PUT request if the signature does not bind the content-type header.</p>
</div>

<h3>The fix — this repo's current code</h3>
<pre><code class="language-ts">// FIXED — from r2.ts:117
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 3600,
): Promise&lt;string&gt; {
  const client = getR2Client();
  const cmd = new PutObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, cmd, {
    expiresIn: expiresInSeconds,
    signableHeaders: new Set(['host', 'content-type']),   // KEY FIX
  });
}
</code></pre>

<h3>This repo's comment tells the story</h3>
<pre><code class="language-text">// SECURITY: signableHeaders is what actually pins the content type.
// Without it SigV4 signs only host (X-Amz-SignedHeaders: host), and the
// ContentType passed to PutObjectCommand degrades to a mere DEFAULT — a
// client can take the signed URL and PUT Content-Type: text/html, which
// R2 stores and later serves as HTML from media.cuongthai.com (stored XSS
// on the media domain). Verified against a real S3 endpoint: with host
// only, a text/html PUT returns 200 and the object comes back
// content-type: text/html; with content-type signed it returns 403.
</code></pre>

<h3>Verify — real test</h3>
<pre><code class="language-bash"># Test with WRONG content type (FIXED)
$ curl -X PUT "$UPLOAD_URL" -H "Content-Type: text/html" -d "&lt;script&gt;"
&lt;Error&gt;
  &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
  &lt;Message&gt;The request signature we calculated does not match...&lt;/Message&gt;
&lt;/Error&gt;
403 Forbidden — signature pins content-type
</code></pre>

<div class="callout ok">
<p><strong>Client MUST send exact Content-Type used at signing.</strong> This repo's frontend code (frontend/src/lib/api.ts):
<code>xhr.setRequestHeader(&#39;Content-Type&#39;, file.type)</code> — same file.type passed to /presign-r2. Signature matches. Any deviation = 403.</p>
</div>

<h3>Other headers to pin</h3>
<pre><code class="language-ts">signableHeaders: new Set([
  'host',
  'content-type',        // Pin file type (from vulnerability above)
  'content-length',      // Pin file SIZE if you know it — prevent oversized upload
  'x-amz-meta-user-id',  // Pin custom metadata if using
]),
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — chỉ test presigned upload với &quot;happy path&quot;.</strong> QA uploads a valid video, it works, you ship. Nobody notices the attack surface until a security audit. Test with the WRONG content-type explicitly in your suite.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A presigned PUT with only ContentType on PutObjectCommand is not secure — the SDK signs only &#39;host&#39; by default, so an attacker can override the content-type to text/html and create stored XSS on your media domain; the fix is <code>signableHeaders: new Set([&#39;host&#39;, &#39;content-type&#39;])</code> — this repo caught it, fixed it, and left a comment explaining it.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SigV4 signing process</span><span class="lc-sub">docs.aws.amazon.com/general/latest/gr/sigv4_signing.html — protocol spec, canonical request formatting.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">src/config/r2.ts:117 (this repo)</span><span class="lc-sub">Real comment documenting the vulnerability, fix, and verification against real S3.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Bug SigV4 signableHeaders XSS</h2>
<p class="lead">Kho này có comment trong r2.ts tài liệu một sự cố bảo mật thật. Ai đó bắt được rằng presigned PUT URL, không có signableHeaders explicit, chỉ sign header <code>host</code>. Điều đó nghĩa là client có thể lấy signed URL cho &quot;upload video/mp4&quot; và thay bằng PUT text/html — R2 sau đó serve như HTML từ media domain. Stored XSS.</p>

<h3>Code có lỗ hổng</h3>
<pre><code class="language-ts">// VULNERABLE
const cmd = new PutObjectCommand({
  Bucket, Key, ContentType: 'video/mp4',
});
const url = await getSignedUrl(client, cmd, { expiresIn: 3600 });
// SDK default: sign chỉ 'host' header
// -&gt; ContentType trong cmd giờ chỉ là DEFAULT, không signed
// -&gt; client có thể PUT với bất kỳ Content-Type nào
</code></pre>

<h3>Attack</h3>
<pre><code class="language-bash"># Attacker request signed URL cho upload video hợp lệ
$ curl -X POST /api/v1/files/presign-r2 -d '{"contentType":"video/mp4"}' 
{ "uploadUrl": "https://xxx.r2.cloudflarestorage.com/bucket/key?X-Amz-...&X-Amz-SignedHeaders=host&X-Amz-Signature=..." }

# Attacker upload HTML thay vì video
$ curl -X PUT "$UPLOAD_URL" \\
    -H "Content-Type: text/html" \\
    -d "&lt;script&gt;alert('xss')&lt;/script&gt;"
# R2 respond 200 — signature chỉ bind host, không content-type

# Giờ media.cuongthai.com/key serve HTML
$ curl https://media.cuongthai.com/key -I
HTTP/2 200
content-type: text/html    &lt;- stored XSS trên media domain!
</code></pre>

<div class="callout warn">
<p><strong>Content-Type ở PutObjectCommand không đủ.</strong> Nó chỉ là DEFAULT ContentType. Attacker override được ở PUT request nếu signature không bind content-type header.</p>
</div>

<h3>Vá — code hiện tại của kho này</h3>
<pre><code class="language-ts">// FIXED — từ r2.ts:117
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 3600,
): Promise&lt;string&gt; {
  const client = getR2Client();
  const cmd = new PutObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, cmd, {
    expiresIn: expiresInSeconds,
    signableHeaders: new Set(['host', 'content-type']),   // KEY FIX
  });
}
</code></pre>

<h3>Comment của kho kể lại</h3>
<pre><code class="language-text">// SECURITY: signableHeaders is what actually pins the content type.
// Without it SigV4 signs only host (X-Amz-SignedHeaders: host), and the
// ContentType passed to PutObjectCommand degrades to a mere DEFAULT — a
// client can take the signed URL and PUT Content-Type: text/html, which
// R2 stores and later serves as HTML from media.cuongthai.com (stored XSS
// on the media domain). Verified against a real S3 endpoint: with host
// only, a text/html PUT returns 200 and the object comes back
// content-type: text/html; with content-type signed it returns 403.
</code></pre>

<h3>Verify — real test</h3>
<pre><code class="language-bash"># Test với WRONG content type (FIXED)
$ curl -X PUT "$UPLOAD_URL" -H "Content-Type: text/html" -d "&lt;script&gt;"
&lt;Error&gt;
  &lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
  &lt;Message&gt;The request signature we calculated does not match...&lt;/Message&gt;
&lt;/Error&gt;
403 Forbidden — signature pin content-type
</code></pre>

<div class="callout ok">
<p><strong>Client PHẢI gửi Content-Type CHÍNH XÁC dùng lúc sign.</strong> FE code kho này (frontend/src/lib/api.ts):
<code>xhr.setRequestHeader(&#39;Content-Type&#39;, file.type)</code> — cùng file.type passed to /presign-r2. Signature match. Bất kỳ deviation nào = 403.</p>
</div>

<h3>Header khác nên pin</h3>
<pre><code class="language-ts">signableHeaders: new Set([
  'host',
  'content-type',        // Pin file type (từ vulnerability trên)
  'content-length',      // Pin file SIZE nếu bạn biết — chặn upload oversize
  'x-amz-meta-user-id',  // Pin custom metadata nếu dùng
]),
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — chỉ test presigned upload với &quot;happy path&quot;.</strong> QA test upload valid video, works. Ship. Attack surface không notice cho tới security audit. Test với WRONG content-type trong test suite explicit.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Presigned PUT với chỉ ContentType trong PutObjectCommand không đủ security — SDK default sign chỉ &#39;host&#39;, attacker override content-type thành text/html tạo stored XSS trên media domain; fix là <code>signableHeaders: new Set([&#39;host&#39;, &#39;content-type&#39;])</code> — kho này bắt được, đã vá, có comment kể lại.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SigV4 signing process</span><span class="lc-sub">docs.aws.amazon.com/general/latest/gr/sigv4_signing.html — protocol spec, canonical request formatting.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">src/config/r2.ts:117 (kho này)</span><span class="lc-sub">Comment thật tài liệu vulnerability, fix, và verify với S3 thật.</span></span></div>
</div>
`,
    },

    {
      title: '4.3 — Chapter 4 quiz|||4.3 — Kiểm tra Chương 4',
      slug: 'os-4-3-quiz',
      type: 'QUIZ',
      description: 'Bốn câu, sáu phút.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 4 · Quiz</span><h2>What Chapter 4 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 4 · Kiểm tra</span><h2>Chương 4 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 360,
        questions: [
          {
            question: 'Why direct upload from browser to R2 for large files?|||Vì sao upload trực tiếp từ browser tới R2 cho file lớn?',
            options: [
              'Cloudflare proxy caps request body at 100 MB (free/pro). Backend forwarding fails; RAM exhaustion. Direct PUT bypasses both|||Cloudflare proxy cap request body ở 100 MB (free/pro). Backend forwarding fail; RAM exhaustion. Direct PUT bypass cả hai',
              'Faster only|||Chỉ nhanh hơn',
              'Cheaper|||Rẻ hơn',
              'Cloudflare policy|||Chính sách Cloudflare',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Presigned PUT signs only &#39;host&#39; header. What&#39;s the attack?|||Presigned PUT sign chỉ &#39;host&#39; header. Attack gì?',
            options: [
              'Attacker PUT with Content-Type: text/html instead of the signed content type. R2 stores as HTML; media domain serves it as HTML → stored XSS|||Attacker PUT với Content-Type: text/html thay vì content type signed. R2 lưu như HTML; media domain serve như HTML → stored XSS',
              'No attack — SDK handles it|||Không attack — SDK tự lo',
              'DDoS|||DDoS',
              'Overwrite existing objects|||Overwrite object có sẵn',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Fix for the SigV4 XSS vulnerability?|||Vá SigV4 XSS?',
            options: [
              '<code>signableHeaders: new Set([&#39;host&#39;, &#39;content-type&#39;])</code> passes to getSignedUrl. Now signature binds content-type; wrong PUT returns 403|||<code>signableHeaders: new Set([&#39;host&#39;, &#39;content-type&#39;])</code> passes to getSignedUrl. Signature bind content-type; PUT sai trả 403',
              'Increase URL expiry|||Tăng URL expiry',
              'Use HTTPS only|||Chỉ dùng HTTPS',
              'Disable presigned upload|||Tắt presigned upload',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'You fix the vulnerability. Client PUTs same content type used at signing. Result?|||Bạn vá vulnerability. Client PUT cùng content type dùng lúc sign. Result?',
            options: [
              '200 OK — signature matches. Client MUST send exact Content-Type. This repo&#39;s FE does <code>xhr.setRequestHeader(&#39;Content-Type&#39;, file.type)</code> matching what was sent to /presign-r2|||200 OK — signature match. Client PHẢI gửi Content-Type chính xác. FE kho này làm <code>xhr.setRequestHeader(&#39;Content-Type&#39;, file.type)</code> khớp cái gửi tới /presign-r2',
              '403 always|||403 luôn',
              'Depends on file size|||Phụ thuộc file size',
              '500 error|||500 error',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
