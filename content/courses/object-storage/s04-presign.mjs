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
<p><strong>Trap — never setting CORS on the bucket.</strong> A browser PUT to R2 is cross-origin, so the bucket must allow PUT from your site's origin. Chapter 5 covers the CORS setup.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Uploading directly from the browser to R2 with a presigned PUT URL sidesteps Cloudflare's 100 MB proxy limit, backend RAM exhaustion, and double-hop latency — the trade is more complex client code (presign → PUT → notify) and a security requirement to pin the content type via signableHeaders (Lesson 4.2).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build the three-step flow: a backend route returns a presigned PUT URL for a key; the browser PUTs the file straight to R2; a second route records the finished key in your DB.</li>
<li>Upload a file larger than 100 MB through the direct flow and confirm it succeeds — then recall that the same file proxied through Cloudflare would hit the 100 MB limit.</li>
<li>Watch your backend RAM during the direct upload: it stays flat, because the bytes never pass through the server.</li>
<li>Write down the two downsides this buys: more client code (presign→PUT→notify) and the signableHeaders security requirement you will fix in 4.2.</li>
</ol>
<p><strong>Done when:</strong> a &gt;100 MB file uploaded browser→R2 directly, backend RAM stayed flat, and the key was recorded by the notify step.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Presigned PUT URL</span><span class="v">A time-limited URL that lets the browser upload one object directly to R2.</span></div>
  <div class="kv"><span class="k">Direct upload</span><span class="v">Browser→R2 with no bytes through your server.</span></div>
  <div class="kv"><span class="k">100 MB proxy limit</span><span class="v">Cloudflare's request body cap that a proxied upload would hit.</span></div>
  <div class="kv"><span class="k">presign → PUT → notify</span><span class="v">The three-step flow: get URL, upload, tell the backend it's done.</span></div>
  <div class="kv"><span class="k">Double-hop latency</span><span class="v">The extra time of routing bytes client→server→R2 instead of client→R2.</span></div>
  <div class="kv"><span class="k">signableHeaders</span><span class="v">The signed-header set that pins content-type — the 4.2 security fix.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A presigned PUT lets the browser upload straight to R2, past Cloudflare's 100 MB limit, backend RAM, and double-hop latency.</li><li>The cost is a three-step client flow: presign → PUT → notify.</li><li>Direct upload needs a security requirement — pin the content type via signableHeaders (Lesson 4.2).</li></ul>

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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng flow ba bước: một route backend trả presigned PUT URL cho một key; browser PUT file thẳng lên R2; một route thứ hai ghi key đã xong vào DB.</li>
<li>Upload một file lớn hơn 100 MB qua flow trực tiếp và xác nhận thành công — rồi nhớ lại rằng cùng file đó proxy qua Cloudflare sẽ chạm giới hạn 100 MB.</li>
<li>Theo dõi RAM backend trong lúc upload trực tiếp: nó phẳng, vì byte không bao giờ qua server.</li>
<li>Ghi lại hai nhược điểm đổi lại: nhiều client code hơn (presign→PUT→notify) và yêu cầu security signableHeaders bạn sẽ vá ở 4.2.</li>
</ol>
<p><strong>Đạt khi:</strong> một file &gt;100 MB upload browser→R2 trực tiếp, RAM backend phẳng, và key được bước notify ghi lại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Presigned PUT URL</span><span class="v">URL có hạn cho browser upload một object thẳng lên R2.</span></div>
  <div class="kv"><span class="k">Direct upload</span><span class="v">Browser→R2 không byte nào qua server bạn.</span></div>
  <div class="kv"><span class="k">100 MB proxy limit</span><span class="v">Giới hạn body request của Cloudflare mà upload proxy sẽ chạm.</span></div>
  <div class="kv"><span class="k">presign → PUT → notify</span><span class="v">Flow ba bước: lấy URL, upload, báo backend đã xong.</span></div>
  <div class="kv"><span class="k">Double-hop latency</span><span class="v">Thời gian thừa khi định tuyến byte client→server→R2 thay vì client→R2.</span></div>
  <div class="kv"><span class="k">signableHeaders</span><span class="v">Tập header được ký, pin content-type — bản vá security ở 4.2.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Presigned PUT cho browser upload thẳng lên R2, vượt giới hạn 100 MB của Cloudflare, RAM backend, và double-hop latency.</li><li>Cái giá là flow client ba bước: presign → PUT → notify.</li><li>Direct upload cần một yêu cầu security — pin content type qua signableHeaders (Bài 4.2).</li></ul>

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
<p><strong>Trap — testing presigned upload only on the &quot;happy path&quot;.</strong> QA uploads a valid video, it works, you ship. Nobody notices the attack surface until a security audit. Test with the WRONG content-type explicitly in your suite.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A presigned PUT with only ContentType on PutObjectCommand is not secure — the SDK signs only &#39;host&#39; by default, so an attacker can override the content-type to text/html and create stored XSS on your media domain; the fix is <code>signableHeaders: new Set([&#39;host&#39;, &#39;content-type&#39;])</code> — this repo caught it, fixed it, and left a comment explaining it.</p>
</div>

<h3>How an unsigned header becomes an XSS</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The client asks for a presigned URL</span><span class="lz-d">And supplies the content type it intends to upload with, because the server cannot know it in advance.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The server signs the request, but not that header</span><span class="lz-d"><code>signableHeaders</code> omits <code>content-type</code>, so the signature is valid for the URL regardless of what type is actually sent.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">So the uploader can change it after signing</span><span class="lz-d">The signature still verifies. The object lands with <code>text/html</code> instead of the image type the server approved.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">And the bucket serves it as a page</span><span class="lz-d">Any visitor opening that object URL executes the attacker's script, on the bucket's origin. The fix is one line: sign the header you care about.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In <code>src/config/r2.ts</code> read <code>getSignedUploadUrl</code> and its SECURITY comment; find the line <code>signableHeaders: new Set(['host', 'content-type'])</code>.</li>
<li>Generate a presigned PUT URL for <code>image/jpeg</code> (sandbox, or a local MinIO via <code>STORAGE_SANDBOX_ENDPOINT=http://localhost:9000</code>). In the URL query, confirm <code>X-Amz-SignedHeaders</code> lists <code>content-type</code>.</li>
<li>Upload with the RIGHT type: <code>curl -T ./a.jpg "$URL" -H "Content-Type: image/jpeg"</code> → expect <code>200</code>.</li>
<li>Attack it: <code>curl -X PUT "$URL" -H "Content-Type: text/html" --data "&lt;script&gt;alert(1)&lt;/script&gt;"</code> → expect <code>403 SignatureDoesNotMatch</code>.</li>
<li>Temporarily sign with host only (drop <code>content-type</code> from <code>signableHeaders</code>) and repeat step 4 — now the text/html PUT returns <code>200</code> and a later GET comes back <code>content-type: text/html</code>. Restore the fix.</li>
</ol>
<p><strong>Done when:</strong> you watched the SAME attack return 403 with the header signed and 200 without it, and can explain why <code>ContentType</code> on <code>PutObjectCommand</code> alone is only a default.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SigV4</span><span class="v">AWS Signature Version 4 — the signing protocol S3/R2 use to authenticate a request.</span></div>
  <div class="kv"><span class="k">signableHeaders</span><span class="v">The SDK option naming which headers the signature covers; default is <code>host</code> only.</span></div>
  <div class="kv"><span class="k">X-Amz-SignedHeaders</span><span class="v">Query param listing exactly which headers were signed — read it to audit a presigned URL.</span></div>
  <div class="kv"><span class="k">Stored XSS</span><span class="v">A script saved on the server and served back to visitors, running on the site's origin.</span></div>
  <div class="kv"><span class="k">SignatureDoesNotMatch</span><span class="v">The 403 R2/S3 returns when a signed header's value differs from what was signed.</span></div>
  <div class="kv"><span class="k">Default vs pinned</span><span class="v">ContentType on the command is a default the client may override; pinning it means the signature rejects any other value.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>By default the SDK signs only <code>host</code>, so <code>ContentType</code> on <code>PutObjectCommand</code> is just a default the client can override.</li><li>An attacker overrides it to <code>text/html</code> → R2 stores and serves HTML from the media domain → stored XSS on your origin.</li><li>The fix is one line: <code>signableHeaders: new Set(['host', 'content-type'])</code> — a mismatched PUT then returns 403.</li><li>The client must send the exact content type used at signing; add a wrong-type case to your test suite.</li><li>Signatures do not cover size by default — pin <code>content-length</code> too when you know it.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SigV4 signing process</span><span class="lc-sub">docs.aws.amazon.com/general/latest/gr/sigv4_signing.html — protocol spec, canonical request formatting.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">src/config/r2.ts:117 (this repo)</span><span class="lc-sub">Real comment documenting the vulnerability, fix, and verification against real S3.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 10.2: Object storage and presigned URLs</span><span class="lc-sub">The Node.js course measures this exact bug on a local MinIO: SignedHeaders = host → a text/html PUT returns 200 and is stored as text/html; with signableHeaders → 403. It also measures what the signature never covers: 120 MB into a URL declared for 5 MB (accepted), the presigned POST content-length-range fix (400 EntityTooLarge), key tampering (SignatureDoesNotMatch) and a 5-second expiry.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
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

<h3>Một header không được ký trở thành XSS như thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Client xin một URL đã ký sẵn</span><span class="lz-d">Và tự khai kiểu nội dung mà nó định tải lên, vì máy chủ không biết trước được.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Máy chủ ký cái request, nhưng KHÔNG ký cái header đó</span><span class="lz-d"><code>signableHeaders</code> bỏ sót <code>content-type</code>, nên chữ ký vẫn hợp lệ cho URL đó bất kể kiểu thật sự được gửi là gì.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nên bên tải lên đổi được nó SAU khi đã ký</span><span class="lz-d">Chữ ký vẫn xác minh được. Object rơi xuống với <code>text/html</code> thay vì kiểu ảnh mà máy chủ đã duyệt.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Và bucket phục vụ nó như một trang web</span><span class="lz-d">Mọi khách mở URL của object đó đều chạy script của kẻ tấn công, trên chính origin của bucket. Cách chữa là một dòng: hãy ký cái header mà bạn quan tâm.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>src/config/r2.ts</code> đọc <code>getSignedUploadUrl</code> và comment SECURITY của nó; tìm dòng <code>signableHeaders: new Set(['host', 'content-type'])</code>.</li>
<li>Sinh một presigned PUT URL cho <code>image/jpeg</code> (sandbox, hoặc MinIO cục bộ qua <code>STORAGE_SANDBOX_ENDPOINT=http://localhost:9000</code>). Trong query URL, xác nhận <code>X-Amz-SignedHeaders</code> có liệt kê <code>content-type</code>.</li>
<li>Upload đúng kiểu: <code>curl -T ./a.jpg "$URL" -H "Content-Type: image/jpeg"</code> → mong đợi <code>200</code>.</li>
<li>Tấn công: <code>curl -X PUT "$URL" -H "Content-Type: text/html" --data "&lt;script&gt;alert(1)&lt;/script&gt;"</code> → mong đợi <code>403 SignatureDoesNotMatch</code>.</li>
<li>Tạm ký với host thôi (bỏ <code>content-type</code> khỏi <code>signableHeaders</code>) rồi lặp lại bước 4 — giờ PUT text/html trả <code>200</code> và GET sau đó trả về <code>content-type: text/html</code>. Khôi phục bản vá.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tận mắt thấy CÙNG một tấn công trả 403 khi header được ký và 200 khi không, và giải thích được vì sao <code>ContentType</code> trên <code>PutObjectCommand</code> một mình chỉ là default.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SigV4</span><span class="v">AWS Signature Version 4 — giao thức ký mà S3/R2 dùng để xác thực request.</span></div>
  <div class="kv"><span class="k">signableHeaders</span><span class="v">Tuỳ chọn SDK khai header nào được chữ ký phủ; mặc định chỉ <code>host</code>.</span></div>
  <div class="kv"><span class="k">X-Amz-SignedHeaders</span><span class="v">Tham số query liệt kê đúng những header đã ký — đọc nó để kiểm một presigned URL.</span></div>
  <div class="kv"><span class="k">Stored XSS</span><span class="v">Script lưu trên server rồi phục vụ lại cho khách, chạy trên origin của site.</span></div>
  <div class="kv"><span class="k">SignatureDoesNotMatch</span><span class="v">Lỗi 403 R2/S3 trả khi giá trị header đã ký khác với lúc ký.</span></div>
  <div class="kv"><span class="k">Default vs pinned</span><span class="v">ContentType trên command là default client đổi được; pin nghĩa là chữ ký từ chối mọi giá trị khác.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Mặc định SDK chỉ ký <code>host</code>, nên <code>ContentType</code> trên <code>PutObjectCommand</code> chỉ là default client đổi được.</li><li>Attacker đổi thành <code>text/html</code> → R2 lưu và phục vụ HTML từ media domain → stored XSS trên origin của bạn.</li><li>Bản vá một dòng: <code>signableHeaders: new Set(['host', 'content-type'])</code> — PUT sai kiểu sẽ trả 403.</li><li>Client phải gửi đúng content type dùng lúc ký; thêm ca sai-kiểu vào bộ test.</li><li>Chữ ký mặc định không phủ kích thước — pin thêm <code>content-length</code> khi bạn biết.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SigV4 signing process</span><span class="lc-sub">docs.aws.amazon.com/general/latest/gr/sigv4_signing.html — protocol spec, canonical request formatting.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">src/config/r2.ts:117 (kho này)</span><span class="lc-sub">Comment thật tài liệu vulnerability, fix, và verify với S3 thật.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 10.2: Object storage và URL ký sẵn</span><span class="lc-sub">Khoá Node.js đo đúng bug này trên MinIO cục bộ: SignedHeaders = host → PUT text/html trả 200 và lưu thành text/html; có signableHeaders → 403. Bài đó còn đo thứ chữ ký không bao giờ phủ: 120 MB vào URL khai 5 MB (vẫn nhận), cách sửa bằng presigned POST content-length-range (400 EntityTooLarge), sửa key (SignatureDoesNotMatch) và hạn 5 giây.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
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
