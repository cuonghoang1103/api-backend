import G01_1 from './giang/obj-01-1.mjs';
import G01_2 from './giang/obj-01-2.mjs';
import G01_3 from './giang/obj-01-3.mjs';
const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 1 — The S3 API|||Chương 1 — S3 API',
  slug: 'os-ch1-s3-api',
  description: 'Bốn bài về AWS SDK v3, các operation cơ bản (PutObject, GetObject, HeadObject, DeleteObject), và cách khởi tạo client.',
  sortOrder: 2,
  lessons: [

    {
      title: '1.1 — Client initialization: SDK v3|||1.1 — Khởi tạo client: SDK v3',
      slug: 'os-1-1-client',
      type: 'VIDEO',
      description: 'AWS SDK v3 modular, tree-shakable. Khác v2 monolithic. Client tạo lazy để app boot được khi thiếu credentials.',
      content: `
${G01_1}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Client initialization: SDK v3</h2>
<p class="lead">AWS SDK v3 is modular — import only what you use. This repo shows a lazy-init pattern that lets the app boot even without R2 credentials (test environments, contributor local dev).</p>

<h3>Package installation</h3>
<pre><code class="language-bash">$ npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
</code></pre>

<p>Two packages: <code>client-s3</code> for operations, <code>s3-request-presigner</code> for signed URLs. Measured (14/11/2026, 3.1071.0): installing both adds <strong>37 packages, ~20 MB</strong> in <code>node_modules</code>; a bundle that imports only <code>S3Client</code> + <code>PutObjectCommand</code> is <strong>609,581 B (169,996 B gzipped)</strong>. The old v2 <code>aws-sdk</code> is 98 MB unpacked and has reached <strong>end-of-support</strong>. (Earlier versions of this lesson said "~450 KB together" — no measurement gives that.)</p>

<h3>This repo — the lazy-init pattern</h3>
<pre><code class="language-ts">// src/config/r2.ts
import { S3Client } from '@aws-sdk/client-s3';
import { config } from './env.js';

let cachedClient: S3Client | null = null;

export function getR2Client(): S3Client {
  if (cachedClient) return cachedClient;
  if (!config.r2.endpoint || !config.r2.accessKeyId) {
    throw new Error(
      'Cloudflare R2 is not configured. Set R2_BUCKET_NAME, R2_ENDPOINT_URL, ' +
      'R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in your environment.',
    );
  }
  cachedClient = new S3Client({
    region: 'auto',                          // R2 ignores; SDK requires
    endpoint: config.r2.endpoint,
    credentials: {
      accessKeyId: config.r2.accessKeyId,
      secretAccessKey: config.r2.secretAccessKey,
    },
    forcePathStyle: false,                   // R2 prefers virtual-hosted-style
  });
  return cachedClient;
}
</code></pre>

<div class="callout ok">
<p><strong>Lazy init lets test suite boot without R2 credentials.</strong> Contributor clones repo, npm test — no R2 setup needed until they touch upload code. Only <em>calling</em> getR2Client throws.</p>
</div>

<h3>Two R2-specific tweaks</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t"><code>region: &#39;auto&#39;</code></span><span class="lz-d">R2 doesn&#39;t use regions (single global bucket). But AWS SDK requires a region string. &quot;auto&quot; is the R2 convention.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t"><code>forcePathStyle: false</code></span><span class="lz-d">Virtual-hosted style: <code>bucket.endpoint/key</code>. Path style: <code>endpoint/bucket/key</code>. R2 prefers virtual-hosted (custom domain support).</span></div>
</div>

<h3>Config from env</h3>
<pre><code class="language-ts">// src/config/env.ts (simplified — the real file validates with zod; names are exact)
r2: {
  bucketName:      process.env.R2_BUCKET_NAME,
  endpoint:        process.env.R2_ENDPOINT_URL,      // https://xxx.r2.cloudflarestorage.com
  accessKeyId:     process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  publicUrl:       process.env.R2_PUBLIC_URL,        // https://media.cuongthai.com (trailing slash stripped)
  region:          process.env.R2_REGION,            // default 'auto'
},
</code></pre>

<p>Six env vars: bucket name (which bucket), endpoint (R2 API host), access key + secret (auth), public URL (CDN custom domain), region (default <code>auto</code>). The name is <code>R2_PUBLIC_URL</code> — earlier versions of this lesson wrote <code>R2_PUBLIC_URL_BASE</code>, which appears nowhere in the repo. If it is missing, <code>buildPublicUrl()</code> silently returns a relative path (<code>/images/…</code>), no error.</p>

<div class="pitfall">
<p><strong>Trap — using the <code>endpoint</code> as a public URL.</strong> <code>R2_ENDPOINT_URL</code> is the <em>API</em> endpoint (<code>xxx.r2.cloudflarestorage.com</code>) — it needs a signature (an unsigned GET returns 403 AccessDenied) and is not cached: every read is a billed operation that skips the CDN. The public URL must be a custom domain fronted by a CDN. These are two different things; store both separately.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> SDK v3 modular install (client-s3 + s3-request-presigner: 37 packages; ~610 KB bundled, ~170 KB gzipped); lazy init pattern lets app boot without R2 credentials; R2-specific config = <code>region: &#39;auto&#39;</code> + <code>forcePathStyle: false</code>; keep API endpoint (for upload) separate from public URL (for serving via CDN).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In a scratch project: <code>npm i @aws-sdk/client-s3 @aws-sdk/s3-request-presigner</code> and check the installed size with <code>du -sh node_modules/@aws-sdk</code>.</li>
<li>Write a <code>getR2Client()</code> that builds the <code>S3Client</code> lazily (first call only) with <code>region: &#39;auto&#39;</code>, <code>forcePathStyle: false</code>, the R2 endpoint, and credentials from env.</li>
<li>Prove the lazy init: import the module with NO R2 env vars set and confirm the process still boots (the client is only built when first called).</li>
<li>Store two separate values — the API endpoint (used by the client for upload) and the public base URL (<code>media.cuongthai.com</code>, used to build serving URLs) — and write one line explaining why they must not be the same string.</li>
</ol>
<p><strong>Done when:</strong> the module imports with no credentials, the client builds on first use, and you can state why endpoint ≠ public URL.</p></div>

<h3>🔬 Measured: install size and bundle size</h3>
<p>Local MinIO (RELEASE.2026-11-12), SDK v3 3.1071.0, Node 22.23.3, esbuild 0.25.10 — nothing here touches a real R2 bucket.</p>
<div class="out">$ npm i @aws-sdk/client-s3@3.1071.0 @aws-sdk/s3-request-presigner@3.1071.0 2&gt;&amp;1 | grep -E "added|packages"
added 37 packages, and audited 38 packages in 5s
$ du -sh node_modules | cut -f1; ls node_modules/@aws-sdk | wc -l | tr -d ' '; ls node_modules/@smithy | wc -l | tr -d ' '
 20M
20
9
$ npm view @aws-sdk/client-s3@3.1071.0 dist.unpackedSize; npm view aws-sdk dist.unpackedSize; npm view aws-sdk deprecated 2&gt;/dev/null | head -1
3427047
98180517
The AWS SDK for JavaScript (v2) has reached end-of-support, and no longer receives updates. Please migrate your code to use AWS SDK for JavaScript (v3). More info https://a.co/cUPnyil
$ npx -y esbuild@0.25.10 goi.mjs --bundle --minify --platform=node --format=esm --outfile=goi.min.mjs --log-level=warning &amp;&amp; wc -c &lt; goi.min.mjs | tr -d ' ' &amp;&amp; gzip -c goi.min.mjs | wc -c | tr -d ' '
609581
169996</div>
<h3>🔬 Measured: lazy init</h3>
<div class="out">$ env -u OBJ_ENDPOINT node thu-luoi.mjs
import xong sau 79 ms · đã dựng client: 0 lần
gọi getClient(): Object storage is not configured. Set OBJ_ENDPOINT …
$ node thu-luoi.mjs
import xong sau 70 ms · đã dựng client: 0 lần
gọi getClient(): OK · đã dựng 1 lần
gọi thêm 2 lần: vẫn 1 lần dựng</div>
<p>Importing builds nothing; a missing config fails clearly on the first call; three calls build one client.</p>
<h3>🔬 Measured: region, URL style, checksum</h3>
<div class="out">$ env -u AWS_DEFAULT_REGION -u AWS_REGION node vung.mjs
region (không đặt): Error · Region is missing
region auto: OK · 2 bucket
region us-east-1: OK · 2 bucket</div>
<div class="out">$ node kieu-url.mjs
forcePathStyle true:  http://localhost:20200/kieu-url/a.txt
  PUT thật: OK
forcePathStyle false:  http://kieu-url.localhost:20200/a.txt
  PUT thật: MalformedXML</div>
<div class="out">$ node tong.mjs
mặc định (WHEN_SUPPORTED): x-amz-checksum-crc32=AAAAAA== x-amz-sdk-checksum-algorithm=CRC32
WHEN_REQUIRED: (không có tham số checksum)</div>
<p>No region ⇒ the SDK refuses before sending. Local MinIO needs <code>forcePathStyle: true</code> (virtual-hosted puts the bucket in the host name ⇒ MalformedXML); real R2 uses <code>false</code>. With the SDK default, a presigned PUT URL carries the CRC32 of an <em>empty</em> body — the repo sets <code>requestChecksumCalculation: 'WHEN_REQUIRED'</code> (Chapter 4 measures why it matters).</p>
<h3>🔬 Measured: API endpoint vs public URL</h3>
<div class="out">$ curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:20200/cong-thu/a.txt
403
$ curl -s http://localhost:20200/cong-thu/a.txt | grep -oE "&lt;Code&gt;[^&lt;]+&lt;/Code&gt;"
&lt;Code&gt;AccessDenied&lt;/Code&gt;
$ curl -s "$(aws s3 presign s3://cong-thu/a.txt --expires-in 60)"; echo
xin chao
$ cd ~/Downloads/api-backend &amp;&amp; grep -nE "^export function buildPublicUrl" -A5 src/config/r2.ts | grep -E "base|return"
396-  const base = config.r2.publicUrl || '';
399-  return &#96;\${base}/\${key.replace(/^\\/+/, '')}&#96;;</div>
<h3>🔬 The repo's real client today</h3>
<p>The code block above is the idea, simplified. The real <code>src/config/r2.ts</code> is 433 lines and has three branches (memory/dir sandbox, MinIO, real R2); it checks <code>config.r2.enabled</code> <em>before</em> returning the cached client, and region comes from <code>R2_REGION</code>:</p>
<div class="out">$ cd ~/Downloads/api-backend &amp;&amp; wc -l src/config/r2.ts &amp;&amp; grep -nE "^\\s+(region|forcePathStyle|requestChecksumCalculation|responseChecksumValidation|requestHandler):" src/config/r2.ts
     433 src/config/r2.ts
50:      region: 'auto',
53:      forcePathStyle: true,
54:      requestChecksumCalculation: 'WHEN_REQUIRED',
55:      responseChecksumValidation: 'WHEN_REQUIRED',
56:      requestHandler: sandboxRequestHandler() as never,
62:      region: config.r2.region, endpoint: config.r2.endpoint, forcePathStyle: true,
71:    region: config.r2.region,
82:    forcePathStyle: false,
87:    requestChecksumCalculation: 'WHEN_REQUIRED',
88:    responseChecksumValidation: 'WHEN_REQUIRED',
$ cd ~/Downloads/api-backend &amp;&amp; grep -nE "^  R2_[A-Z_]+:" src/config/env.ts | sed -E 's/: z\\..*//' &amp;&amp; grep -c "R2_PUBLIC_URL_BASE" src/config/env.ts
148:  R2_BUCKET_NAME
149:  R2_PUBLIC_URL
150:  R2_ENDPOINT_URL
151:  R2_ACCESS_KEY_ID
152:  R2_SECRET_ACCESS_KEY
153:  R2_REGION
0</div>
<h3>🔁 Run it yourself</h3>
<p>With the local MinIO from Start here (1/2): <code>npm init -y && npm pkg set type=module && npm i @aws-sdk/client-s3@3.1071.0 @aws-sdk/s3-request-presigner@3.1071.0</code>, export <code>OBJ_ENDPOINT=http://localhost:&lt;port&gt;</code> plus <code>AWS_ACCESS_KEY_ID</code>/<code>AWS_SECRET_ACCESS_KEY</code> of your MinIO, then write the small scripts shown above (<code>thu-luoi.mjs</code>, <code>kieu-url.mjs</code>…). Signing a URL makes no network call, so the checksum test works even with MinIO stopped.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-1-5-module" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 1.5 — Modules: CommonJS and ES Modules</span><span class="lc-sub">Named imports — the reason a bundle can keep only the commands you use</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-4-1-cau-hinh-song-ngoai-tao-tac" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 4.1 — Configuration lives outside the artifact</span><span class="lc-sub">Why endpoint, keys and public URL come from the environment, not the code</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">AWS SDK v3</span><span class="v">Modular S3 client; you install only the commands you use (a bundle of S3Client + PutObject: ~610 KB, ~170 KB gzipped).</span></div>
  <div class="kv"><span class="k">S3Client</span><span class="v">The configured connection object that <code>.send()</code>s commands.</span></div>
  <div class="kv"><span class="k">Lazy init</span><span class="v">Build the client on first use so the app boots without credentials.</span></div>
  <div class="kv"><span class="k">region: 'auto'</span><span class="v">Required by the SDK, ignored by R2 (R2 has no regions).</span></div>
  <div class="kv"><span class="k">forcePathStyle</span><span class="v"><code>false</code> = virtual-hosted URLs, needed for custom domains.</span></div>
  <div class="kv"><span class="k">API endpoint vs public URL</span><span class="v">One for authenticated upload, one for CDN serving — never the same.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>SDK v3 is modular: install <code>client-s3</code> + <code>s3-request-presigner</code> (37 packages, ~610 KB when bundled), not a monolith.</li><li>Lazy init lets the app start without R2 credentials — the client is built on first call.</li><li>R2 config is <code>region: &#39;auto&#39;</code> + <code>forcePathStyle: false</code>; keep the API endpoint (upload) separate from the public CDN URL (serving).</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SDK v3 — S3</span><span class="lc-sub">docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3 — official docs.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare R2 — API compatibility</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/api — what R2 supports (~90% of S3 API).</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Khởi tạo client: SDK v3</h2>
<p class="lead">AWS SDK v3 modular — import chỉ cái bạn dùng. Kho này chỉ pattern lazy-init cho app boot được kể cả không có R2 credential (test env, contributor local dev).</p>

<h3>Cài package</h3>
<pre><code class="language-bash">$ npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
</code></pre>

<p>Hai package: <code>client-s3</code> cho operation, <code>s3-request-presigner</code> cho signed URL. Đo thật (14/11/2026, 3.1071.0): cài cả hai thêm <strong>37 gói, ~20 MB</strong> trong <code>node_modules</code>; gói chỉ import <code>S3Client</code> + <code>PutObjectCommand</code> nặng <strong>609.581 B (gzip 169.996 B)</strong>. Gói v2 <code>aws-sdk</code> cũ giải nén 98 MB và đã <strong>hết hỗ trợ</strong>. (Bản cũ của bài ghi "cả hai ~450 KB" — không phép đo nào ra số đó.)</p>

<h3>Kho này — pattern lazy init</h3>
<pre><code class="language-ts">// src/config/r2.ts
import { S3Client } from '@aws-sdk/client-s3';
import { config } from './env.js';

let cachedClient: S3Client | null = null;

export function getR2Client(): S3Client {
  if (cachedClient) return cachedClient;
  if (!config.r2.endpoint || !config.r2.accessKeyId) {
    throw new Error(
      'Cloudflare R2 is not configured. Set R2_BUCKET_NAME, R2_ENDPOINT_URL, ' +
      'R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in your environment.',
    );
  }
  cachedClient = new S3Client({
    region: 'auto',                          // R2 ignores; SDK requires
    endpoint: config.r2.endpoint,
    credentials: {
      accessKeyId: config.r2.accessKeyId,
      secretAccessKey: config.r2.secretAccessKey,
    },
    forcePathStyle: false,                   // R2 prefers virtual-hosted-style
  });
  return cachedClient;
}
</code></pre>

<div class="callout ok">
<p><strong>Lazy init cho test suite boot mà không cần R2 credential.</strong> Contributor clone repo, npm test — không cần setup R2 tới khi họ chạm upload code. Chỉ <em>call</em> getR2Client mới throw.</p>
</div>

<h3>Hai tweak R2-specific</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t"><code>region: &#39;auto&#39;</code></span><span class="lz-d">R2 không dùng region (single global bucket). Nhưng AWS SDK bắt buộc string region. &quot;auto&quot; là convention R2.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t"><code>forcePathStyle: false</code></span><span class="lz-d">Virtual-hosted style: <code>bucket.endpoint/key</code>. Path style: <code>endpoint/bucket/key</code>. R2 prefer virtual-hosted (custom domain support).</span></div>
</div>

<h3>Config từ env</h3>
<pre><code class="language-ts">// src/config/env.ts (simplified — the real file validates with zod; names are exact)
r2: {
  bucketName:      process.env.R2_BUCKET_NAME,
  endpoint:        process.env.R2_ENDPOINT_URL,      // https://xxx.r2.cloudflarestorage.com
  accessKeyId:     process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  publicUrl:       process.env.R2_PUBLIC_URL,        // https://media.cuongthai.com (trailing slash stripped)
  region:          process.env.R2_REGION,            // default 'auto'
},
</code></pre>

<p>Sáu env var: bucket name (bucket nào), endpoint (R2 API host), access key + secret (auth), public URL (CDN custom domain), region (mặc định <code>auto</code>). Tên đúng là <code>R2_PUBLIC_URL</code> — bản cũ của bài ghi <code>R2_PUBLIC_URL_BASE</code>, kho không có tên đó. Thiếu biến này thì <code>buildPublicUrl()</code> lặng lẽ trả về đường dẫn tương đối (<code>/images/…</code>), không báo lỗi.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>endpoint</code> làm public URL.</strong> <code>R2_ENDPOINT_URL</code> là <em>API</em> endpoint (<code>xxx.r2.cloudflarestorage.com</code>) — cần chữ ký (GET không ký ⇒ 403 AccessDenied) và không cache: mỗi lượt đọc là một operation tính tiền, không qua CDN. Public URL phải là custom domain qua CDN. Đây là 2 khác nhau. Lưu cả hai riêng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> SDK v3 modular install (client-s3 + s3-request-presigner: 37 packages; ~610 KB bundled, ~170 KB gzipped); pattern lazy init cho app boot mà không cần R2 credential; config R2-specific = <code>region: &#39;auto&#39;</code> + <code>forcePathStyle: false</code>; giữ API endpoint (cho upload) riêng public URL (cho serving qua CDN).</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong một project nháp: <code>npm i @aws-sdk/client-s3 @aws-sdk/s3-request-presigner</code> rồi xem size đã cài bằng <code>du -sh node_modules/@aws-sdk</code>.</li>
<li>Viết một <code>getR2Client()</code> dựng <code>S3Client</code> kiểu lazy (chỉ ở lần gọi đầu) với <code>region: &#39;auto&#39;</code>, <code>forcePathStyle: false</code>, endpoint R2, và credential từ env.</li>
<li>Chứng minh lazy init: import module KHÔNG set env R2 nào và xác nhận tiến trình vẫn boot (client chỉ dựng khi được gọi lần đầu).</li>
<li>Lưu hai giá trị riêng — API endpoint (client dùng để upload) và public base URL (<code>media.cuongthai.com</code>, dùng để dựng URL serving) — và viết một dòng giải thích vì sao chúng không được là cùng một chuỗi.</li>
</ol>
<p><strong>Đạt khi:</strong> module import được khi không có credential, client dựng ở lần dùng đầu, và bạn nói được vì sao endpoint ≠ public URL.</p></div>

<h3>🔬 Đo thật: dung lượng cài và dung lượng gói</h3>
<p>MinIO cục bộ (RELEASE.2026-11-12), SDK v3 3.1071.0, Node 22.23.3, esbuild 0.25.10 — không lệnh nào chạm bucket R2 thật.</p>
<div class="out">$ npm i @aws-sdk/client-s3@3.1071.0 @aws-sdk/s3-request-presigner@3.1071.0 2&gt;&amp;1 | grep -E "added|packages"
added 37 packages, and audited 38 packages in 5s
$ du -sh node_modules | cut -f1; ls node_modules/@aws-sdk | wc -l | tr -d ' '; ls node_modules/@smithy | wc -l | tr -d ' '
 20M
20
9
$ npm view @aws-sdk/client-s3@3.1071.0 dist.unpackedSize; npm view aws-sdk dist.unpackedSize; npm view aws-sdk deprecated 2&gt;/dev/null | head -1
3427047
98180517
The AWS SDK for JavaScript (v2) has reached end-of-support, and no longer receives updates. Please migrate your code to use AWS SDK for JavaScript (v3). More info https://a.co/cUPnyil
$ npx -y esbuild@0.25.10 goi.mjs --bundle --minify --platform=node --format=esm --outfile=goi.min.mjs --log-level=warning &amp;&amp; wc -c &lt; goi.min.mjs | tr -d ' ' &amp;&amp; gzip -c goi.min.mjs | wc -c | tr -d ' '
609581
169996</div>
<h3>🔬 Đo thật: lazy init</h3>
<div class="out">$ env -u OBJ_ENDPOINT node thu-luoi.mjs
import xong sau 79 ms · đã dựng client: 0 lần
gọi getClient(): Object storage is not configured. Set OBJ_ENDPOINT …
$ node thu-luoi.mjs
import xong sau 70 ms · đã dựng client: 0 lần
gọi getClient(): OK · đã dựng 1 lần
gọi thêm 2 lần: vẫn 1 lần dựng</div>
<p>Import không dựng gì; thiếu cấu hình thì báo lỗi rõ ở lần gọi đầu; ba lần gọi chỉ dựng một client.</p>
<h3>🔬 Đo thật: region, kiểu URL, checksum</h3>
<div class="out">$ env -u AWS_DEFAULT_REGION -u AWS_REGION node vung.mjs
region (không đặt): Error · Region is missing
region auto: OK · 2 bucket
region us-east-1: OK · 2 bucket</div>
<div class="out">$ node kieu-url.mjs
forcePathStyle true:  http://localhost:20200/kieu-url/a.txt
  PUT thật: OK
forcePathStyle false:  http://kieu-url.localhost:20200/a.txt
  PUT thật: MalformedXML</div>
<div class="out">$ node tong.mjs
mặc định (WHEN_SUPPORTED): x-amz-checksum-crc32=AAAAAA== x-amz-sdk-checksum-algorithm=CRC32
WHEN_REQUIRED: (không có tham số checksum)</div>
<p>Không có region ⇒ SDK từ chối trước khi gửi. MinIO cục bộ cần <code>forcePathStyle: true</code> (virtual-hosted đưa bucket lên tên máy ⇒ MalformedXML); R2 thật dùng <code>false</code>. Với mặc định của SDK, URL PUT ký sẵn mang CRC32 của thân <em>rỗng</em> — kho đặt <code>requestChecksumCalculation: 'WHEN_REQUIRED'</code> (Chương 4 đo vì sao điều này quan trọng).</p>
<h3>🔬 Đo thật: API endpoint và URL công khai</h3>
<div class="out">$ curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:20200/cong-thu/a.txt
403
$ curl -s http://localhost:20200/cong-thu/a.txt | grep -oE "&lt;Code&gt;[^&lt;]+&lt;/Code&gt;"
&lt;Code&gt;AccessDenied&lt;/Code&gt;
$ curl -s "$(aws s3 presign s3://cong-thu/a.txt --expires-in 60)"; echo
xin chao
$ cd ~/Downloads/api-backend &amp;&amp; grep -nE "^export function buildPublicUrl" -A5 src/config/r2.ts | grep -E "base|return"
396-  const base = config.r2.publicUrl || '';
399-  return &#96;\${base}/\${key.replace(/^\\/+/, '')}&#96;;</div>
<h3>🔬 Client thật của kho hôm nay</h3>
<p>Khối mã ở trên là ý tưởng, đã rút gọn. <code>src/config/r2.ts</code> thật dài 433 dòng, có ba nhánh (sandbox memory/dir, MinIO, R2 thật); nó kiểm <code>config.r2.enabled</code> <em>trước</em> khi trả client trong cache, và region lấy từ <code>R2_REGION</code>:</p>
<div class="out">$ cd ~/Downloads/api-backend &amp;&amp; wc -l src/config/r2.ts &amp;&amp; grep -nE "^\\s+(region|forcePathStyle|requestChecksumCalculation|responseChecksumValidation|requestHandler):" src/config/r2.ts
     433 src/config/r2.ts
50:      region: 'auto',
53:      forcePathStyle: true,
54:      requestChecksumCalculation: 'WHEN_REQUIRED',
55:      responseChecksumValidation: 'WHEN_REQUIRED',
56:      requestHandler: sandboxRequestHandler() as never,
62:      region: config.r2.region, endpoint: config.r2.endpoint, forcePathStyle: true,
71:    region: config.r2.region,
82:    forcePathStyle: false,
87:    requestChecksumCalculation: 'WHEN_REQUIRED',
88:    responseChecksumValidation: 'WHEN_REQUIRED',
$ cd ~/Downloads/api-backend &amp;&amp; grep -nE "^  R2_[A-Z_]+:" src/config/env.ts | sed -E 's/: z\\..*//' &amp;&amp; grep -c "R2_PUBLIC_URL_BASE" src/config/env.ts
148:  R2_BUCKET_NAME
149:  R2_PUBLIC_URL
150:  R2_ENDPOINT_URL
151:  R2_ACCESS_KEY_ID
152:  R2_SECRET_ACCESS_KEY
153:  R2_REGION
0</div>
<h3>🔁 Tự chạy lại</h3>
<p>Với MinIO cục bộ ở bài Bắt đầu tại đây (1/2): <code>npm init -y && npm pkg set type=module && npm i @aws-sdk/client-s3@3.1071.0 @aws-sdk/s3-request-presigner@3.1071.0</code>, đặt <code>OBJ_ENDPOINT=http://localhost:&lt;cổng&gt;</code> cùng <code>AWS_ACCESS_KEY_ID</code>/<code>AWS_SECRET_ACCESS_KEY</code> của MinIO, rồi viết các script nhỏ ở trên (<code>thu-luoi.mjs</code>, <code>kieu-url.mjs</code>…). Ký URL không gọi mạng, nên phép thử checksum chạy được cả khi MinIO đang tắt.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-1-5-module" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 1.5 — Module: CommonJS và ES Modules</span><span class="lc-sub">Import có tên — lý do bản gói chỉ giữ lệnh bạn dùng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-4-1-cau-hinh-song-ngoai-tao-tac" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 4.1 — Cấu hình sống ngoài tạo tác</span><span class="lc-sub">Vì sao endpoint, khoá và URL công khai đến từ môi trường, không nằm trong mã</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">AWS SDK v3</span><span class="v">S3 client modular; chỉ cài command bạn dùng (gói S3Client + PutObject: ~610 KB, gzip ~170 KB).</span></div>
  <div class="kv"><span class="k">S3Client</span><span class="v">Object kết nối đã cấu hình, <code>.send()</code> các command.</span></div>
  <div class="kv"><span class="k">Lazy init</span><span class="v">Dựng client ở lần dùng đầu để app boot không cần credential.</span></div>
  <div class="kv"><span class="k">region: 'auto'</span><span class="v">SDK yêu cầu, R2 bỏ qua (R2 không có region).</span></div>
  <div class="kv"><span class="k">forcePathStyle</span><span class="v"><code>false</code> = URL virtual-hosted, cần cho custom domain.</span></div>
  <div class="kv"><span class="k">API endpoint vs public URL</span><span class="v">Một để upload có auth, một để serving qua CDN — không bao giờ giống nhau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>SDK v3 modular: cài <code>client-s3</code> + <code>s3-request-presigner</code> (37 gói, gói lại ~610 KB), không phải một khối lớn.</li><li>Lazy init cho app khởi động không cần credential R2 — client dựng ở lần gọi đầu.</li><li>Config R2 là <code>region: &#39;auto&#39;</code> + <code>forcePathStyle: false</code>; giữ API endpoint (upload) riêng public CDN URL (serving).</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SDK v3 — S3</span><span class="lc-sub">docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3 — docs chính thức.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare R2 — API compatibility</span><span class="lc-sub">developers.cloudflare.com/r2/api/s3/api — R2 support cái gì (~90% S3 API).</span></span></div>
</div>
`,
    },

    {
      title: '1.2 — Four core operations: Put, Get, Head, Delete|||1.2 — Bốn operation cơ bản: Put, Get, Head, Delete',
      slug: 'os-1-2-ops',
      type: 'VIDEO',
      description: 'PutObject upload, GetObject download, HeadObject metadata only, DeleteObject remove. Kho này dùng cả bốn — code từ upload.service.ts.',
      content: `
${G01_2}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Four core operations: Put, Get, Head, Delete</h2>
<p class="lead">S3 has 60+ operations but 90% of code uses 4. This lesson covers them with real code from this repo.</p>

<h3>PutObject — upload</h3>
<pre><code class="language-ts">// r2.ts
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function putObject(
  key: string,
  body: Buffer,
  contentType: string,
  cacheControl: string = 'public, max-age=31536000, immutable',
) {
  const client = getR2Client();
  const cmd = new PutObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: cacheControl,
  });
  const res = await client.send(cmd);
  return { key, url: buildPublicUrl(key), etag: res.ETag };
}
</code></pre>

<div class="callout warn">
<p><strong><code>ContentType</code> is mandatory.</strong> Without it, S3 defaults to <code>application/octet-stream</code> → the browser downloads the file instead of displaying it. <code>&lt;audio&gt;</code>/<code>&lt;video&gt;</code> tags reject the wrong type. (Measured on MinIO: SDK v3 without <code>ContentType</code> ⇒ <code>application/octet-stream</code>; aws-cli ⇒ <code>binary/octet-stream</code>.) And a PUT replaces the <strong>whole</strong> object — data and metadata: PUT the same key again without <code>CacheControl</code> and the stored Cache-Control is gone.</p>
</div>

<h3>GetObject — download</h3>
<pre><code class="language-ts">import { GetObjectCommand } from '@aws-sdk/client-s3';

const res = await client.send(new GetObjectCommand({
  Bucket, Key: 'x.jpg',
}));

// res.Body is a stream (Readable)
// read the body ONCE — a second transform throws "The stream has already been transformed."
const bytes = await res.Body.transformToByteArray();   // Uint8Array
const buffer = Buffer.from(bytes);
// or, for text: const text = await res.Body.transformToString('utf-8');
// (earlier versions showed Buffer.concat(await …getReader().read()) — it throws TypeError: read() returns { value, done }, not an array)
</code></pre>

<p>Public files are served straight from the CDN, so the repo never streams avatars or post images through Node. But it <strong>does</strong> call GetObject server-side: <code>GetObjectCommand</code> appears in 11 non-test files (music, exports, AI reading uploaded files, previews), through <code>getObjectText(key, 512 KB)</code> and <code>getObjectBytes(key, 4 MB)</code>, which check <code>ContentLength</code> against a cap before reading and return <code>null</code> on any error. (Earlier versions of this lesson said the repo does not use getObject.)</p>

<h3>HeadObject — metadata only</h3>
<pre><code class="language-ts">import { HeadObjectCommand } from '@aws-sdk/client-s3';

try {
  const res = await client.send(new HeadObjectCommand({ Bucket, Key: 'x.jpg' }));
  // Object exists — check size, content-type, last modified
  console.log(res.ContentLength, res.ContentType, res.LastModified);
} catch (err) {
  if (err.name === 'NotFound') {
    // Object khong ton tai
  }
}
</code></pre>

<div class="callout ok">
<p><strong>HeadObject is cheaper than GetObject.</strong> Metadata only, no body transfer. Use it to check existence and read the size before deciding to download.</p>
</div>

<h3>DeleteObject and DeleteObjects (batch)</h3>
<pre><code class="language-ts">import { DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

// Xoa 1 object
await client.send(new DeleteObjectCommand({ Bucket, Key }));

// Xoa nhieu — 1 request cho toi 1000 object
await client.send(new DeleteObjectsCommand({
  Bucket,
  Delete: { Objects: [{ Key: 'a.jpg' }, { Key: 'b.jpg' }] },
}));

// Delete non-existent: KHONG error. Silent success (nhu rm -f)
</code></pre>

<div class="pitfall">
<p><strong>Trap — DeleteObjectsCommand does not error when the object does not exist.</strong> If you expect &quot;deleted 5 objects&quot; but only 2 existed, the response is still a success — and <code>response.Deleted</code> does <strong>not</strong> tell you what existed: measured on MinIO, a key that never existed is listed in <code>Deleted</code> too, with <code>Errors</code> empty (and with <code>Quiet: true</code>, as the repo uses, <code>Deleted</code> is empty). Need the real count? HEAD first, or trust the keys your database stored. Read <code>response.Errors</code> for per-key failures. Max 1,000 keys per call: 1,001 ⇒ <code>MalformedXML</code> (400).</p>
</div>

<h3>Error handling</h3>
<pre><code class="language-ts">try {
  await putObject(...);
} catch (err) {
  if (err.name === 'NoSuchBucket') { ... }
  if (err.name === 'AccessDenied') { ... }
  if (err.name === 'SignatureDoesNotMatch' || err.name === 'InvalidAccessKeyId') { ... fix credentials ... }
  if (err.code === 'ECONNREFUSED' || err.name === 'TimeoutError') { ... retry with backoff ... }
  // Log err.$metadata.httpStatusCode + err.name
}
</code></pre>

<div class="callout">
<p><strong>One sentence.</strong> Four core operations: PutObject (upload, with ContentType + CacheControl MANDATORY), GetObject (streams the body, read once; the CDN serves public reads, the server reads private/small files), HeadObject (metadata only, cheap), and DeleteObject/DeleteObjects (batches of up to 1000, silent on missing keys — and Deleted lists them anyway) — 90% of S3 code uses only these four.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li><code>PutObject</code> a small file WITH <code>ContentType</code> and <code>CacheControl</code> set; then PUT one WITHOUT them and compare how the browser treats each when you open the URL.</li>
<li><code>HeadObject</code> the key and read <code>ContentLength</code>, <code>ContentType</code>, <code>ETag</code>, <code>LastModified</code> — confirm it transfers metadata only (no body, Class B, near-free).</li>
<li><code>DeleteObject</code> a key that does NOT exist and observe it returns success (S3 delete is idempotent / silent on missing).</li>
<li><code>DeleteObjects</code> a batch of 3 keys in one call and note the per-key result array; batches go up to 1000.</li>
</ol>
<p><strong>Done when:</strong> you have run all four, seen the no-ContentType browser difference, and confirmed delete is silent on a missing key.</p></div>

<h3>🔬 Measured: PutObject, with and without headers, and a second PUT</h3>
<p>Local MinIO (RELEASE.2026-11-12), SDK v3 3.1071.0, Node 22.23.3 — nothing here touches a real R2 bucket.</p>
<div class="out">$ node put.mjs
PUT co-type.svg ⇒ HTTP 200 · ETag "b1a2b128b82fdd9dee8b3233b250721c"
  HEAD co-type.svg: image/svg+xml · public, max-age=31536000, immutable · 62 B · ETag "b1a2b128b82fdd9dee8b3233b250721c"
PUT khong-type.svg (không ContentType) ⇒ HTTP 200
  HEAD khong-type.svg: application/octet-stream · (không có Cache-Control) · 62 B · ETag "b1a2b128b82fdd9dee8b3233b250721c"
PUT đè co-type.svg (thân mới, quên CacheControl):
  HEAD co-type.svg: image/svg+xml · (không có Cache-Control) · 41 B · ETag "46661d6d65debc63884004fed6e37e5c"
$ curl -s -D - -o /dev/null "$(aws s3 presign s3://bon-lenh/khong-type.svg)" | grep -iE "^content-(type|disposition)"
Content-Type: application/octet-stream</div>
<h3>🔬 Measured: reading a GetObject body</h3>
<div class="out">$ node get.mjs
Body: ChecksumStream · ContentType image/svg+xml · ContentLength 41
transformToString(): &lt;svg xmlns="http://www.w3.org/2000/svg"/&gt;
đọc lần hai: Error: The stream has already been transformed.
transformToByteArray(): Uint8Array 41 byte ⇒ Buffer.from(...) dùng được
mã cũ của bài web: TypeError: The "list" argument must be an instance of Array. Received an instance of Object</div>
<h3>🔬 Measured: HeadObject vs GetObject, and missing keys</h3>
<div class="out">$ node head.mjs
HEAD to-5mb.bin: ContentLength 5242880 · byte thân đã nhận 0 · 6.8 ms
GET  to-5mb.bin: ContentLength 5242880 · byte thân đã nhận 5242880 · 90.5 ms
HeadObject key không có ⇒ err.name = NotFound · HTTP 404
GetObject key không có ⇒ err.name = NoSuchKey · HTTP 404</div>
<p>HEAD sent 0 body bytes for a 5 MB object. A missing key is <code>NotFound</code> for HEAD but <code>NoSuchKey</code> for GET — catch both names.</p>
<h3>🔬 Measured: deletes</h3>
<div class="out">$ node xoa.mjs
DeleteObject key KHÔNG tồn tại ⇒ HTTP 204 (không lỗi)
DeleteObjects [a.jpg, b.jpg, ma.jpg] ⇒ HTTP 200 · Deleted: a.jpg, b.jpg, ma.jpg · Errors: 0
Quiet: true ⇒ HTTP 200 · Deleted: 0 mục · Errors: 0
1.001 key một lượt ⇒ MalformedXML · HTTP 400
1.000 key một lượt ⇒ HTTP 200 · Deleted 1000</div>
<h3>🔬 Measured: the error names you will catch</h3>
<div class="out">$ node loi.mjs
bucket không tồn tại: err.name = NoSuchBucket · HTTP 404
sai secret key: err.name = SignatureDoesNotMatch · HTTP 403
sai access key: err.name = InvalidAccessKeyId · HTTP 403
máy chủ tắt (cổng 20299): err.name = AggregateError · HTTP — · code ECONNREFUSED</div>
<h3>🔬 The four operations in the repo</h3>
<div class="out">$ grep -nE "^export async function (putObject|headObject|getObjectText|getObjectBytes|deleteObject|deleteObjects|objectExists)\\(" src/config/r2.ts
110:export async function putObject(
180:export async function headObject(
201:export async function getObjectText(key: string, maxBytes = 512 * 1024): Promise&lt;string | null&gt; {
217:export async function getObjectBytes(key: string, maxBytes = 4 * 1024 * 1024): Promise&lt;Buffer | null&gt; {
237:export async function deleteObject(key: string): Promise&lt;void&gt; {
252:export async function deleteObjects(keys: string[]): Promise&lt;void&gt; {
280:export async function objectExists(key: string): Promise&lt;boolean&gt; {
$ grep -nE "Quiet: true|contentDisposition\\?: string|transformToByteArray|catch \\{" src/config/r2.ts | head -8
115:  contentDisposition?: string,
192:  } catch {
208:  } catch {
223:    const bytes = await res.Body?.transformToByteArray();
226:  } catch {
268:        Quiet: true,
291:  } catch {
430:  } catch {
$ grep -rln "GetObjectCommand" src | grep -v "\\.test\\." | wc -l | tr -d ' '
11</div>
<p>Note: <code>deleteObjects()</code> sends <code>Quiet: true</code>; until 14/11/2026 it did not read <code>res.Errors</code>, so a per-key failure (AccessDenied on one key — reproduced in 2.3) passed silently. Fixed the same day (commit 3974b33): it now logs the failed keys, and <code>objectExists()</code> logs errors other than 404.</p>
<h3>🔁 Run it yourself</h3>
<p>With the local MinIO from Start here (1/2) and the project from 1.1: create a bucket (<code>aws s3 mb s3://bon-lenh</code>), then write the scripts above (<code>put.mjs</code>, <code>get.mjs</code>, <code>head.mjs</code>, <code>xoa.mjs</code>, <code>loi.mjs</code>), each importing one shared <code>S3Client</code> with <code>forcePathStyle: true</code>.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-3-stream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.3 — Streams: an experiment with a 348 MB file</span><span class="lc-sub">Why a GetObject body is a stream you consume once</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-2-ma-trang-thai" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 6.2 — Status codes and response shapes</span><span class="lc-sub">What 204, 403 and 404 mean, and when a retry can help</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PutObject</span><span class="v">Upload (full replace); set <code>ContentType</code> + <code>CacheControl</code> or the CDN misbehaves.</span></div>
  <div class="kv"><span class="k">GetObject</span><span class="v">Streams the body; rare here because the CDN serves reads.</span></div>
  <div class="kv"><span class="k">HeadObject</span><span class="v">Metadata only, no body — cheap existence/size check.</span></div>
  <div class="kv"><span class="k">DeleteObject(s)</span><span class="v">Single or batch (≤1000) delete; silent on missing keys.</span></div>
  <div class="kv"><span class="k">ContentType</span><span class="v">The MIME type stored on the object; wrong value = wrong browser handling.</span></div>
  <div class="kv"><span class="k">Idempotent delete</span><span class="v">Deleting a non-existent key still returns success.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Four operations cover ~90% of S3 code: Put, Get, Head, Delete.</li><li><code>ContentType</code> + <code>CacheControl</code> on PutObject are mandatory for correct CDN/browser behaviour.</li><li>HeadObject is a cheap metadata-only read; DeleteObjects batches up to 1000 and is silent on missing keys.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — API operations</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API — full list, 60+ operations.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Bốn operation cơ bản: Put, Get, Head, Delete</h2>
<p class="lead">S3 có 60+ operation nhưng 90% code dùng 4. Bài này cover chúng với code thật từ kho này.</p>

<h3>PutObject — upload</h3>
<pre><code class="language-ts">// r2.ts
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function putObject(
  key: string,
  body: Buffer,
  contentType: string,
  cacheControl: string = 'public, max-age=31536000, immutable',
) {
  const client = getR2Client();
  const cmd = new PutObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: cacheControl,
  });
  const res = await client.send(cmd);
  return { key, url: buildPublicUrl(key), etag: res.ETag };
}
</code></pre>

<div class="callout warn">
<p><strong><code>ContentType</code> là bắt buộc.</strong> Không có → S3 default <code>application/octet-stream</code> → browser download thay vì display. Thẻ <code>&lt;audio&gt;</code>/<code>&lt;video&gt;</code> từ chối sai type. (Đo trên MinIO: SDK v3 không <code>ContentType</code> ⇒ <code>application/octet-stream</code>; aws-cli ⇒ <code>binary/octet-stream</code>.) Và PUT thay <strong>nguyên</strong> object — cả dữ liệu lẫn metadata: PUT lại cùng key mà không gửi <code>CacheControl</code> thì Cache-Control cũ mất.</p>
</div>

<h3>GetObject — download</h3>
<pre><code class="language-ts">import { GetObjectCommand } from '@aws-sdk/client-s3';

const res = await client.send(new GetObjectCommand({
  Bucket, Key: 'x.jpg',
}));

// res.Body la stream (Readable)
// read the body ONCE — a second transform throws "The stream has already been transformed."
const bytes = await res.Body.transformToByteArray();   // Uint8Array
const buffer = Buffer.from(bytes);
// or, for text: const text = await res.Body.transformToString('utf-8');
// (earlier versions showed Buffer.concat(await …getReader().read()) — it throws TypeError: read() returns { value, done }, not an array)
</code></pre>

<p>Tệp công khai phục vụ thẳng qua CDN, nên kho không bao giờ đẩy avatar hay ảnh bài viết qua Node. Nhưng kho <strong>có</strong> gọi GetObject ở máy chủ: <code>GetObjectCommand</code> có trong 11 tệp không phải test (nhạc, xuất dữ liệu, AI đọc tệp tải lên, ảnh xem trước), qua <code>getObjectText(key, 512 KB)</code> và <code>getObjectBytes(key, 4 MB)</code> — kiểm <code>ContentLength</code> với mức trần trước khi đọc, lỗi gì cũng trả <code>null</code>. (Bản cũ của bài ghi kho không dùng getObject.)</p>

<h3>HeadObject — chỉ metadata</h3>
<pre><code class="language-ts">import { HeadObjectCommand } from '@aws-sdk/client-s3';

try {
  const res = await client.send(new HeadObjectCommand({ Bucket, Key: 'x.jpg' }));
  // Object ton tai — check size, content-type, last modified
  console.log(res.ContentLength, res.ContentType, res.LastModified);
} catch (err) {
  if (err.name === 'NotFound') {
    // Object khong ton tai
  }
}
</code></pre>

<div class="callout ok">
<p><strong>HeadObject rẻ hơn GetObject.</strong> Chỉ metadata, không transfer body. Dùng để check exists, get size trước decide download.</p>
</div>

<h3>DeleteObject và DeleteObjects (batch)</h3>
<pre><code class="language-ts">import { DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

// Xoa 1 object
await client.send(new DeleteObjectCommand({ Bucket, Key }));

// Xoa nhieu — 1 request cho toi 1000 object
await client.send(new DeleteObjectsCommand({
  Bucket,
  Delete: { Objects: [{ Key: 'a.jpg' }, { Key: 'b.jpg' }] },
}));

// Delete non-existent: KHONG error. Silent success (nhu rm -f)
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — DeleteObjectsCommand không error khi object không tồn tại.</strong> Nếu bạn expect &quot;deleted 5 objects&quot; nhưng chỉ 2 tồn tại, response vẫn ok — và <code>response.Deleted</code> <strong>không</strong> cho biết cái gì đã tồn tại: đo trên MinIO, key chưa từng có vẫn nằm trong <code>Deleted</code>, <code>Errors</code> rỗng (bật <code>Quiet: true</code> như kho thì <code>Deleted</code> rỗng luôn). Cần con số thật? HEAD trước, hoặc tin các key database đã lưu. Đọc <code>response.Errors</code> để biết key nào lỗi. Tối đa 1.000 key một lượt: 1.001 ⇒ <code>MalformedXML</code> (400).</p>
</div>

<h3>Error handling</h3>
<pre><code class="language-ts">try {
  await putObject(...);
} catch (err) {
  if (err.name === 'NoSuchBucket') { ... }
  if (err.name === 'AccessDenied') { ... }
  if (err.name === 'SignatureDoesNotMatch' || err.name === 'InvalidAccessKeyId') { ... fix credentials ... }
  if (err.code === 'ECONNREFUSED' || err.name === 'TimeoutError') { ... retry with backoff ... }
  // Log err.$metadata.httpStatusCode + err.name
}
</code></pre>

<div class="callout">
<p><strong>Một câu.</strong> Bốn core operation: PutObject (upload với ContentType + CacheControl BẮT BUỘC), GetObject (stream body, đọc một lần; CDN phục vụ đọc công khai, máy chủ đọc tệp riêng/nhỏ), HeadObject (chỉ metadata, rẻ), DeleteObject/DeleteObjects (batch tới 1000, silent khi missing — và Deleted vẫn liệt kê chúng) — 90% code S3 chỉ dùng bốn cái này.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li><code>PutObject</code> một file nhỏ CÓ set <code>ContentType</code> và <code>CacheControl</code>; rồi PUT một file KHÔNG set, mở URL và so cách browser xử lý mỗi cái.</li>
<li><code>HeadObject</code> key đó và đọc <code>ContentLength</code>, <code>ContentType</code>, <code>ETag</code>, <code>LastModified</code> — xác nhận nó chỉ truyền metadata (không body, Class B, gần như miễn phí).</li>
<li><code>DeleteObject</code> một key KHÔNG tồn tại và quan sát nó trả success (delete S3 idempotent / silent khi missing).</li>
<li><code>DeleteObjects</code> một batch 3 key trong một lời gọi và xem mảng kết quả per-key; batch lên tới 1000.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã chạy đủ bốn, thấy khác biệt browser khi thiếu ContentType, và xác nhận delete silent với key missing.</p></div>

<h3>🔬 Đo thật: PutObject có và không có header, và PUT lần hai</h3>
<p>MinIO cục bộ (RELEASE.2026-11-12), SDK v3 3.1071.0, Node 22.23.3 — không lệnh nào chạm bucket R2 thật.</p>
<div class="out">$ node put.mjs
PUT co-type.svg ⇒ HTTP 200 · ETag "b1a2b128b82fdd9dee8b3233b250721c"
  HEAD co-type.svg: image/svg+xml · public, max-age=31536000, immutable · 62 B · ETag "b1a2b128b82fdd9dee8b3233b250721c"
PUT khong-type.svg (không ContentType) ⇒ HTTP 200
  HEAD khong-type.svg: application/octet-stream · (không có Cache-Control) · 62 B · ETag "b1a2b128b82fdd9dee8b3233b250721c"
PUT đè co-type.svg (thân mới, quên CacheControl):
  HEAD co-type.svg: image/svg+xml · (không có Cache-Control) · 41 B · ETag "46661d6d65debc63884004fed6e37e5c"
$ curl -s -D - -o /dev/null "$(aws s3 presign s3://bon-lenh/khong-type.svg)" | grep -iE "^content-(type|disposition)"
Content-Type: application/octet-stream</div>
<h3>🔬 Đo thật: đọc thân GetObject</h3>
<div class="out">$ node get.mjs
Body: ChecksumStream · ContentType image/svg+xml · ContentLength 41
transformToString(): &lt;svg xmlns="http://www.w3.org/2000/svg"/&gt;
đọc lần hai: Error: The stream has already been transformed.
transformToByteArray(): Uint8Array 41 byte ⇒ Buffer.from(...) dùng được
mã cũ của bài web: TypeError: The "list" argument must be an instance of Array. Received an instance of Object</div>
<h3>🔬 Đo thật: HeadObject so với GetObject, và key không tồn tại</h3>
<div class="out">$ node head.mjs
HEAD to-5mb.bin: ContentLength 5242880 · byte thân đã nhận 0 · 6.8 ms
GET  to-5mb.bin: ContentLength 5242880 · byte thân đã nhận 5242880 · 90.5 ms
HeadObject key không có ⇒ err.name = NotFound · HTTP 404
GetObject key không có ⇒ err.name = NoSuchKey · HTTP 404</div>
<p>HEAD gửi 0 byte thân cho object 5 MB. Key không có: HEAD báo <code>NotFound</code>, GET báo <code>NoSuchKey</code> — bắt cả hai tên.</p>
<h3>🔬 Đo thật: xoá</h3>
<div class="out">$ node xoa.mjs
DeleteObject key KHÔNG tồn tại ⇒ HTTP 204 (không lỗi)
DeleteObjects [a.jpg, b.jpg, ma.jpg] ⇒ HTTP 200 · Deleted: a.jpg, b.jpg, ma.jpg · Errors: 0
Quiet: true ⇒ HTTP 200 · Deleted: 0 mục · Errors: 0
1.001 key một lượt ⇒ MalformedXML · HTTP 400
1.000 key một lượt ⇒ HTTP 200 · Deleted 1000</div>
<h3>🔬 Đo thật: các tên lỗi bạn sẽ bắt</h3>
<div class="out">$ node loi.mjs
bucket không tồn tại: err.name = NoSuchBucket · HTTP 404
sai secret key: err.name = SignatureDoesNotMatch · HTTP 403
sai access key: err.name = InvalidAccessKeyId · HTTP 403
máy chủ tắt (cổng 20299): err.name = AggregateError · HTTP — · code ECONNREFUSED</div>
<h3>🔬 Bốn lệnh trong mã của kho</h3>
<div class="out">$ grep -nE "^export async function (putObject|headObject|getObjectText|getObjectBytes|deleteObject|deleteObjects|objectExists)\\(" src/config/r2.ts
110:export async function putObject(
180:export async function headObject(
201:export async function getObjectText(key: string, maxBytes = 512 * 1024): Promise&lt;string | null&gt; {
217:export async function getObjectBytes(key: string, maxBytes = 4 * 1024 * 1024): Promise&lt;Buffer | null&gt; {
237:export async function deleteObject(key: string): Promise&lt;void&gt; {
252:export async function deleteObjects(keys: string[]): Promise&lt;void&gt; {
280:export async function objectExists(key: string): Promise&lt;boolean&gt; {
$ grep -nE "Quiet: true|contentDisposition\\?: string|transformToByteArray|catch \\{" src/config/r2.ts | head -8
115:  contentDisposition?: string,
192:  } catch {
208:  } catch {
223:    const bytes = await res.Body?.transformToByteArray();
226:  } catch {
268:        Quiet: true,
291:  } catch {
430:  } catch {
$ grep -rln "GetObjectCommand" src | grep -v "\\.test\\." | wc -l | tr -d ' '
11</div>
<p>Lưu ý: <code>deleteObjects()</code> gửi <code>Quiet: true</code>; trước 14/11/2026 nó không đọc <code>res.Errors</code>, nên lỗi theo từng key (AccessDenied ở một key — tái hiện ở bài 2.3) trôi qua im lặng. Đã sửa cùng ngày (commit 3974b33): nay ghi lại các key xoá hỏng, và <code>objectExists()</code> ghi lỗi khác 404.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Với MinIO cục bộ ở bài Bắt đầu tại đây (1/2) và dự án ở bài 1.1: tạo bucket (<code>aws s3 mb s3://bon-lenh</code>), rồi viết các script ở trên (<code>put.mjs</code>, <code>get.mjs</code>, <code>head.mjs</code>, <code>xoa.mjs</code>, <code>loi.mjs</code>), mỗi cái import chung một <code>S3Client</code> với <code>forcePathStyle: true</code>.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-3-stream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.3 — Stream: thí nghiệm với file 348 MB</span><span class="lc-sub">Vì sao thân GetObject là stream chỉ đọc một lần</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-2-ma-trang-thai" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 6.2 — Mã trạng thái và hình dạng phản hồi</span><span class="lc-sub">204, 403, 404 nghĩa là gì, và khi nào thử lại có ích</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PutObject</span><span class="v">Upload (replace nguyên object); set <code>ContentType</code> + <code>CacheControl</code> kẻo CDN sai.</span></div>
  <div class="kv"><span class="k">GetObject</span><span class="v">Stream body; hiếm dùng ở đây vì CDN serve read.</span></div>
  <div class="kv"><span class="k">HeadObject</span><span class="v">Chỉ metadata, không body — kiểm tồn tại/size rẻ.</span></div>
  <div class="kv"><span class="k">DeleteObject(s)</span><span class="v">Xoá đơn hoặc batch (≤1000); silent với key missing.</span></div>
  <div class="kv"><span class="k">ContentType</span><span class="v">MIME type lưu trên object; sai giá trị = browser xử lý sai.</span></div>
  <div class="kv"><span class="k">Idempotent delete</span><span class="v">Xoá một key không tồn tại vẫn trả success.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bốn operation bao ~90% code S3: Put, Get, Head, Delete.</li><li><code>ContentType</code> + <code>CacheControl</code> trên PutObject là bắt buộc để CDN/browser đúng.</li><li>HeadObject là read chỉ-metadata rẻ; DeleteObjects batch tới 1000 và silent với key missing.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — API operations</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/API — full list, 60+ operations.</span></span></div>
</div>
`,
    },

    {
      title: '1.3 — Multipart upload for large files|||1.3 — Multipart upload cho file lớn',
      slug: 'os-1-3-multipart',
      type: 'VIDEO',
      description: 'File >100 MB nên upload part-by-part (5MB-5GB per part). Resumable, parallel upload, tránh timeout. Ba lệnh: CreateMultipartUpload, UploadPart, CompleteMultipartUpload.',
      content: `
${G01_3}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Multipart upload for large files</h2>
<p class="lead">Single PutObject caps around 5 GB. Even at 100 MB, network drops mid-upload = start over. Multipart splits into parts of 5 MB–5 GB (every part except the last must be ≥ 5 MB; at most 10,000 parts; the finished object can be up to 5 TB), uploads independently, and completes as one atomic object.</p>

<h3>Three-step flow</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">CreateMultipartUpload</span><span class="lz-d">Get an <code>UploadId</code> from S3. This declares intent to upload.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">UploadPart × N</span><span class="lz-d">Upload each part with a PartNumber (1-10000). Each returns ETag. Can upload in parallel.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">CompleteMultipartUpload</span><span class="lz-d">Send list of PartNumber+ETag. S3 stitches parts into one object. Atomic — either complete object or nothing.</span></div>
</div>

<h3>The code — basics</h3>
<pre><code class="language-ts">import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';

async function multipartUpload(key: string, filePath: string, partSize: number = 5 * 1024 * 1024) {
  // 1. Create
  const { UploadId } = await client.send(new CreateMultipartUploadCommand({
    Bucket, Key: key, ContentType: 'video/mp4',
  }));

  // 2. Upload parts — this loop awaits each part: SEQUENTIAL. For real parallelism use Promise.all (measured below) or the Upload class
  const parts = [];
  const fileSize = await getFileSize(filePath);
  const partCount = Math.ceil(fileSize / partSize);
  
  for (let i = 1; i &lt;= partCount; i++) {
    const start = (i - 1) * partSize;
    const end = Math.min(start + partSize, fileSize);
    const body = await readFilePart(filePath, start, end);
    const res = await client.send(new UploadPartCommand({
      Bucket, Key: key, PartNumber: i, UploadId, Body: body,
    }));
    parts.push({ PartNumber: i, ETag: res.ETag });
  }

  // 3. Complete
  await client.send(new CompleteMultipartUploadCommand({
    Bucket, Key: key, UploadId, MultipartUpload: { Parts: parts },
  }));
}
</code></pre>

<h3>Recommended part sizes</h3>
<div class="out">File size       Part size       Reasoning
100 MB - 1 GB   10 MB           100 parts max, quick retry
1 GB - 10 GB    50 MB           200 parts max, good parallelism
10 GB - 100 GB  100 MB          1000 parts, balanced
100 GB - 5 TB   500 MB - 5 GB   10000 parts limit
</div>

<h3>SDK helper — <code>Upload</code> class</h3>
<pre><code class="language-ts">import { Upload } from '@aws-sdk/lib-storage';

const upload = new Upload({
  client,
  params: { Bucket, Key: key, Body: fileStream, ContentType: 'video/mp4' },
  queueSize: 4,             // 4 parts parallel
  partSize: 10 * 1024 * 1024, // 10 MB per part
});

upload.on('httpUploadProgress', (progress) =&gt; {
  console.log(&#96;\${progress.loaded} / \${progress.total}&#96;);
});

await upload.done();
</code></pre>

<p>The <code>Upload</code> class handles CreateMultipartUpload + UploadPart + CompleteMultipartUpload for you, with retries and progress reporting. Prefer it over hand-rolling the sequence.</p>

<h3>Cleanup — Abort incomplete uploads</h3>
<pre><code class="language-ts">// Multipart upload chua complete van chiem cost trong bucket
// R2 va S3 KHONG tu xoa. Can lifecycle policy hoac manual cleanup

// List
const uploads = await client.send(new ListMultipartUploadsCommand({ Bucket }));
// Abort each
for (const u of uploads.Uploads ?? []) {
  await client.send(new AbortMultipartUploadCommand({
    Bucket, Key: u.Key, UploadId: u.UploadId,
  }));
}
</code></pre>

<div class="callout warn">
<p><strong>Abandoned multipart uploads = silent cost.</strong> User upload 500 MB, browser crash before complete → 500 MB sits in bucket, invisible via console listing, still billed. Add lifecycle rule to abort after 7 days.</p>
</div>

<div class="pitfall">
<p><strong>Trap — using multipart for files under 100 MB.</strong> Three API calls instead of one, so latency is worse for small files. Rule of thumb: a single PUT below 100 MB, multipart at 100 MB and above.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Multipart upload splits a file of 100 MB or more into parts of 5 MB–5 GB (10 MB+ in practice; max 10,000 parts), uploads them in parallel, and stitches them atomically with three commands; use the SDK <code>Upload</code> class rather than writing it yourself; abandoned uploads keep costing money — add a lifecycle rule that aborts them after 7 days.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Upload a 100+ MB file with the SDK <code>Upload</code> class (from <code>@aws-sdk/lib-storage</code>), setting <code>queueSize</code> and <code>partSize</code>, and log the progress events.</li>
<li>Inspect the finished object's <code>ETag</code> — note it ends in <code>-N</code> (part count), so it is NOT a plain MD5.</li>
<li>Start a multipart upload and kill the process before completing it; then run <code>ListMultipartUploads</code> and see the orphaned upload still holding (billable) storage.</li>
<li>Write the lifecycle rule that aborts incomplete multipart uploads after 7 days (you will apply it in Chapter 6).</li>
</ol>
<p><strong>Done when:</strong> a large file uploaded via <code>Upload</code>, you have seen the <code>-N</code> ETag, and you have found an orphaned upload with <code>ListMultipartUploads</code>.</p></div>

<h3>🔬 Measured: the three calls by hand (parts sent 3, 1, 2)</h3>
<p>Local MinIO (RELEASE.2026-11-12), SDK v3 + <code>@aws-sdk/lib-storage</code> 3.1071.0, Node 22.23.3 — nothing here touches a real R2 bucket.</p>
<div class="out">$ node ba-buoc.mjs
1) Create ⇒ UploadId ODQ1OTAzNzAtM2EyMS00…
2) UploadPart #3 (2 MB) ⇒ ETag "52b85f09b5f2d93f7ada64b0e9328258"
2) UploadPart #1 (5 MB) ⇒ ETag "08b46181d7094b5ece88bb389c7499af"
2) UploadPart #2 (5 MB) ⇒ ETag "d76f89e449720d99d4b92c79040f4882"
   trước Complete: HEAD ⇒ NotFound · LIST thấy 0 object
3) Complete ⇒ ETag "824b6959c5810442584b3a32d0cd0804-3" · 12582912 byte · video/mp4
   tự tính MD5(MD5 các phần) + "-3" = "824b6959c5810442584b3a32d0cd0804-3" · MD5 cả tệp = f22b41aa94c5e34abe4e38f64705c2ea</div>
<p>Before Complete the key does not exist (HEAD ⇒ NotFound, LIST ⇒ 0). The multipart ETag is the MD5 of the concatenated part MD5s plus <code>-3</code> — computed locally, it matches exactly; the MD5 of the whole file is different. Cut the same file into other part sizes and the ETag changes.</p>
<h3>🔬 Measured: really parallel</h3>
<div class="out">$ node song-song.mjs
Promise.all 3 phần ⇒ Complete ETag "824b6959c5810442584b3a32d0cd0804-3" · 148 ms</div>
<h3>🔬 Measured: the rules of a part, broken on purpose</h3>
<div class="out">$ node luat.mjs
Complete 2 phần 1 MB (phần đầu &lt; 5 MB): EntityTooSmall · HTTP 400
UploadPart PartNumber 0: InvalidPart · HTTP 400
UploadPart PartNumber 10000: OK
UploadPart PartNumber 10001: InvalidArgument · HTTP 400
Complete danh sách [2, 1] (sai thứ tự): InvalidPartOrder · HTTP 400
UploadPart sau khi Abort: NoSuchUpload · HTTP 404</div>
<p>Parts under 5 MB are accepted by UploadPart and rejected only at Complete (<code>EntityTooSmall</code>). Mind the ceiling: 10,000 parts × 5 MB ≈ 48.8 GB, so a 100 GB file needs parts of at least ~10.3 MB.</p>
<h3>🔬 Measured: the Upload helper on 100 MB</h3>
<div class="out">$ node lib.mjs
PutObject 100 MB một lượt: 1.52 s · ETag "8fc9eb42756746c05ec92a14bafb54a0"
  tiến độ: 10485760 / 104857600 · phần 1
  tiến độ: 20971520 / 104857600 · phần 2
Upload (10 MB × 4 song song): 1.82 s · 10 sự kiện tiến độ · cuối 104857600 byte · ETag "e03bbe14466924b9fcc07c754e04ff42-10"</div>
<p>On localhost multipart is not faster than one PUT (1.82 s vs 1.52 s). Its value is elsewhere: a failed part is retried alone, memory stays bounded, and you get progress events.</p>
<h3>🔬 Measured: an orphaned upload</h3>
<div class="out">$ node bo-do.mjs; echo "exit $?"
đã gửi 2 phần × 5 MB rồi process.exit(1) — không Complete, không Abort
exit 1
$ aws s3 ls s3://nhieu-phan/video/
2026-11-14 12:02:32   12582912 bai-1.mp4
$ aws s3api list-multipart-uploads --bucket nhieu-phan --query 'Uploads[].Key' --output text
nho.bin	so.bin	video/sap-giua-chung.mp4
$ aws s3api list-parts --bucket nhieu-phan --key video/sap-giua-chung.mp4 --upload-id "$(aws s3api list-multipart-uploads --bucket nhieu-phan --query 'Uploads[?Key==&#96;video/sap-giua-chung.mp4&#96;].UploadId' --output text)" --query 'Parts[].[PartNumber,Size]' --output text
1	5242880
2	5242880
$ node don.mjs
Abort nho.bin (bắt đầu 2026-11-14T05:02:33.198Z)
Abort so.bin (bắt đầu 2026-11-14T05:02:33.278Z)
Abort video/sap-giua-chung.mp4 (bắt đầu 2026-11-14T05:02:33.583Z)
còn lại: 0 upload dở</div>
<p>The normal listing shows only the finished file, yet three unfinished uploads hold parts — two of them left by Completes that <strong>failed</strong>: a failed Complete does not abort. On S3 and R2 those parts are billed until aborted.</p>
<h3>🔁 Run it yourself</h3>
<p>In the project from 1.1, <code>npm i @aws-sdk/lib-storage@3.1071.0</code>, create a bucket on your local MinIO, and write <code>ba-buoc.mjs</code>, <code>luat.mjs</code>, <code>bo-do.mjs</code> and <code>don.mjs</code> as above. Recompute the <code>-N</code> ETag with <code>node:crypto</code>: MD5 each part, concatenate the raw digests, MD5 again.</p>
<p><strong>In this repo:</strong> no multipart call exists in <code>src/</code> today (the largest uploads, chat attachments, are capped at 25 MB and go in one PUT).</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-1-4-bat-dong-bo" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 1.4 — Async: callbacks, Promises, async/await</span><span class="lc-sub">Promise.all — what makes parts really go in parallel</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-3-stream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.3 — Streams: an experiment with a 348 MB file</span><span class="lc-sub">Reading a big file chunk by chunk instead of loading it whole</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multipart upload</span><span class="v">Split a large file into parts, upload in parallel, stitch atomically.</span></div>
  <div class="kv"><span class="k">Part</span><span class="v">5 MB–5 GB chunk (all but the last ≥ 5 MB); up to 10,000 parts per object.</span></div>
  <div class="kv"><span class="k">Upload class</span><span class="v"><code>@aws-sdk/lib-storage</code> helper that manages parts and retries for you.</span></div>
  <div class="kv"><span class="k">CreateMultipartUpload / UploadPart / CompleteMultipartUpload</span><span class="v">The three commands the helper wraps.</span></div>
  <div class="kv"><span class="k">Orphaned upload</span><span class="v">An incomplete multipart upload still billed until aborted.</span></div>
  <div class="kv"><span class="k">AbortIncompleteMultipartUpload</span><span class="v">The lifecycle action that cleans orphans after N days.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Files ≥100 MB go up as multipart: parts of 5 MB–5 GB, 10 MB+ recommended (max 10,000), uploaded in parallel and stitched atomically.</li><li>Use the SDK <code>Upload</code> class instead of hand-rolling the three commands.</li><li>Abandoned multipart uploads keep costing money — a lifecycle rule must abort them (7 days here).</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SDK — @aws-sdk/lib-storage</span><span class="lc-sub">github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage — high-level Upload helper.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Multipart upload cho file lớn</h2>
<p class="lead">Single PutObject cap khoảng 5 GB. Kể cả ở 100 MB, network drop giữa chừng = start lại. Multipart chia thành part 5 MB–5 GB (mọi part trừ part cuối phải ≥ 5 MB; tối đa 10.000 part; object hoàn chỉnh tới 5 TB), upload độc lập, complete atomic thành one object.</p>

<h3>Flow ba bước</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">CreateMultipartUpload</span><span class="lz-d">Get <code>UploadId</code> từ S3. Khai báo intent upload.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">UploadPart × N</span><span class="lz-d">Upload mỗi part với PartNumber (1-10000). Mỗi cái return ETag. Có thể upload parallel.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">CompleteMultipartUpload</span><span class="lz-d">Send list PartNumber+ETag. S3 stitch parts thành one object. Atomic — hoặc complete object hoặc không.</span></div>
</div>

<h3>Code — cơ bản</h3>
<pre><code class="language-ts">import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';

async function multipartUpload(key: string, filePath: string, partSize: number = 5 * 1024 * 1024) {
  // 1. Create
  const { UploadId } = await client.send(new CreateMultipartUploadCommand({
    Bucket, Key: key, ContentType: 'video/mp4',
  }));

  // 2. Upload parts — this loop awaits each part: SEQUENTIAL. For real parallelism use Promise.all (measured below) or the Upload class
  const parts = [];
  const fileSize = await getFileSize(filePath);
  const partCount = Math.ceil(fileSize / partSize);
  
  for (let i = 1; i &lt;= partCount; i++) {
    const start = (i - 1) * partSize;
    const end = Math.min(start + partSize, fileSize);
    const body = await readFilePart(filePath, start, end);
    const res = await client.send(new UploadPartCommand({
      Bucket, Key: key, PartNumber: i, UploadId, Body: body,
    }));
    parts.push({ PartNumber: i, ETag: res.ETag });
  }

  // 3. Complete
  await client.send(new CompleteMultipartUploadCommand({
    Bucket, Key: key, UploadId, MultipartUpload: { Parts: parts },
  }));
}
</code></pre>

<h3>Kích thước part khuyến nghị</h3>
<div class="out">File size       Part size       Reasoning
100 MB - 1 GB   10 MB           100 parts max, quick retry
1 GB - 10 GB    50 MB           200 parts max, good parallelism
10 GB - 100 GB  100 MB          1000 parts, balanced
100 GB - 5 TB   500 MB - 5 GB   10000 parts limit
</div>

<h3>SDK helper — class <code>Upload</code></h3>
<pre><code class="language-ts">import { Upload } from '@aws-sdk/lib-storage';

const upload = new Upload({
  client,
  params: { Bucket, Key: key, Body: fileStream, ContentType: 'video/mp4' },
  queueSize: 4,             // 4 parts parallel
  partSize: 10 * 1024 * 1024, // 10 MB per part
});

upload.on('httpUploadProgress', (progress) =&gt; {
  console.log(&#96;${'${progress.loaded}'} / ${'${progress.total}'}&#96;);
});

await upload.done();
</code></pre>

<p>Class <code>Upload</code> xử lý CreateMultipartUpload + UploadPart + CompleteMultipartUpload tự động. Có retry, có progress. Recommend dùng thay tự viết.</p>

<h3>Cleanup — Abort incomplete uploads</h3>
<pre><code class="language-ts">// Multipart upload chua complete van chiem cost trong bucket
// R2 va S3 KHONG tu xoa. Can lifecycle policy hoac manual cleanup

// List
const uploads = await client.send(new ListMultipartUploadsCommand({ Bucket }));
// Abort each
for (const u of uploads.Uploads ?? []) {
  await client.send(new AbortMultipartUploadCommand({
    Bucket, Key: u.Key, UploadId: u.UploadId,
  }));
}
</code></pre>

<div class="callout warn">
<p><strong>Abandoned multipart upload = silent cost.</strong> User upload 500 MB, browser crash trước khi complete → 500 MB nằm trong bucket, invisible qua console listing, vẫn bill. Add lifecycle rule abort sau 7 ngày.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng multipart cho file &lt;100 MB.</strong> Overhead 3 API call vs 1. Latency cao hơn cho small files. Rule of thumb: single PUT cho &lt;100 MB, multipart cho &gt;=100 MB.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Multipart upload chia file &gt;=100 MB thành part 5 MB–5 GB (thực tế nên 10 MB trở lên; max 10.000 part), upload parallel, stitch atomic với 3 command; dùng SDK <code>Upload</code> class thay tự viết; abandoned upload chiếm cost — add lifecycle rule abort sau 7 ngày.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Upload một file 100+ MB bằng SDK <code>Upload</code> class (từ <code>@aws-sdk/lib-storage</code>), set <code>queueSize</code> và <code>partSize</code>, log các event tiến độ.</li>
<li>Xem <code>ETag</code> object đã xong — để ý nó kết thúc bằng <code>-N</code> (số part), nên KHÔNG phải MD5 trần.</li>
<li>Bắt đầu một multipart upload rồi kill tiến trình trước khi complete; chạy <code>ListMultipartUploads</code> và thấy upload mồ côi vẫn giữ storage (tính tiền).</li>
<li>Viết lifecycle rule abort multipart upload dở sau 7 ngày (bạn sẽ áp ở Chương 6).</li>
</ol>
<p><strong>Đạt khi:</strong> một file lớn upload qua <code>Upload</code>, bạn đã thấy ETag <code>-N</code>, và tìm được một upload mồ côi bằng <code>ListMultipartUploads</code>.</p></div>

<h3>🔬 Đo thật: ba lệnh làm bằng tay (part gửi theo thứ tự 3, 1, 2)</h3>
<p>MinIO cục bộ (RELEASE.2026-11-12), SDK v3 + <code>@aws-sdk/lib-storage</code> 3.1071.0, Node 22.23.3 — không lệnh nào chạm bucket R2 thật.</p>
<div class="out">$ node ba-buoc.mjs
1) Create ⇒ UploadId ODQ1OTAzNzAtM2EyMS00…
2) UploadPart #3 (2 MB) ⇒ ETag "52b85f09b5f2d93f7ada64b0e9328258"
2) UploadPart #1 (5 MB) ⇒ ETag "08b46181d7094b5ece88bb389c7499af"
2) UploadPart #2 (5 MB) ⇒ ETag "d76f89e449720d99d4b92c79040f4882"
   trước Complete: HEAD ⇒ NotFound · LIST thấy 0 object
3) Complete ⇒ ETag "824b6959c5810442584b3a32d0cd0804-3" · 12582912 byte · video/mp4
   tự tính MD5(MD5 các phần) + "-3" = "824b6959c5810442584b3a32d0cd0804-3" · MD5 cả tệp = f22b41aa94c5e34abe4e38f64705c2ea</div>
<p>Trước Complete key chưa tồn tại (HEAD ⇒ NotFound, LIST ⇒ 0). ETag multipart là MD5 của chuỗi nối các MD5 từng part, thêm <code>-3</code> — tự tính trên máy khớp từng ký tự; MD5 cả tệp thì khác. Cắt cùng tệp theo cỡ part khác thì ETag khác.</p>
<h3>🔬 Đo thật: song song thật</h3>
<div class="out">$ node song-song.mjs
Promise.all 3 phần ⇒ Complete ETag "824b6959c5810442584b3a32d0cd0804-3" · 148 ms</div>
<h3>🔬 Đo thật: phá từng luật của part</h3>
<div class="out">$ node luat.mjs
Complete 2 phần 1 MB (phần đầu &lt; 5 MB): EntityTooSmall · HTTP 400
UploadPart PartNumber 0: InvalidPart · HTTP 400
UploadPart PartNumber 10000: OK
UploadPart PartNumber 10001: InvalidArgument · HTTP 400
Complete danh sách [2, 1] (sai thứ tự): InvalidPartOrder · HTTP 400
UploadPart sau khi Abort: NoSuchUpload · HTTP 404</div>
<p>Part dưới 5 MB vẫn được UploadPart nhận, chỉ bị từ chối lúc Complete (<code>EntityTooSmall</code>). Nhớ trần: 10.000 part × 5 MB ≈ 48,8 GB, nên tệp 100 GB cần part ít nhất ~10,3 MB.</p>
<h3>🔬 Đo thật: bộ trợ giúp Upload với 100 MB</h3>
<div class="out">$ node lib.mjs
PutObject 100 MB một lượt: 1.52 s · ETag "8fc9eb42756746c05ec92a14bafb54a0"
  tiến độ: 10485760 / 104857600 · phần 1
  tiến độ: 20971520 / 104857600 · phần 2
Upload (10 MB × 4 song song): 1.82 s · 10 sự kiện tiến độ · cuối 104857600 byte · ETag "e03bbe14466924b9fcc07c754e04ff42-10"</div>
<p>Trên máy cục bộ multipart không nhanh hơn một PUT (1,82 s so với 1,52 s). Giá trị của nó ở chỗ khác: part lỗi thì thử lại riêng part đó, bộ nhớ không phình, và có sự kiện tiến độ.</p>
<h3>🔬 Đo thật: một upload mồ côi</h3>
<div class="out">$ node bo-do.mjs; echo "exit $?"
đã gửi 2 phần × 5 MB rồi process.exit(1) — không Complete, không Abort
exit 1
$ aws s3 ls s3://nhieu-phan/video/
2026-11-14 12:02:32   12582912 bai-1.mp4
$ aws s3api list-multipart-uploads --bucket nhieu-phan --query 'Uploads[].Key' --output text
nho.bin	so.bin	video/sap-giua-chung.mp4
$ aws s3api list-parts --bucket nhieu-phan --key video/sap-giua-chung.mp4 --upload-id "$(aws s3api list-multipart-uploads --bucket nhieu-phan --query 'Uploads[?Key==&#96;video/sap-giua-chung.mp4&#96;].UploadId' --output text)" --query 'Parts[].[PartNumber,Size]' --output text
1	5242880
2	5242880
$ node don.mjs
Abort nho.bin (bắt đầu 2026-11-14T05:02:33.198Z)
Abort so.bin (bắt đầu 2026-11-14T05:02:33.278Z)
Abort video/sap-giua-chung.mp4 (bắt đầu 2026-11-14T05:02:33.583Z)
còn lại: 0 upload dở</div>
<p>Lệnh liệt kê thường chỉ thấy tệp đã xong, nhưng ba upload dở vẫn giữ part — hai cái do những lần Complete <strong>bị lỗi</strong> để lại: Complete lỗi không tự huỷ. Trên S3 và R2 các part đó bị tính tiền tới khi bị huỷ.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Trong dự án ở bài 1.1, <code>npm i @aws-sdk/lib-storage@3.1071.0</code>, tạo bucket trên MinIO cục bộ, rồi viết <code>ba-buoc.mjs</code>, <code>luat.mjs</code>, <code>bo-do.mjs</code>, <code>don.mjs</code> như trên. Tự tính lại ETag <code>-N</code> bằng <code>node:crypto</code>: MD5 từng part, nối các digest thô, MD5 lần nữa.</p>
<p><strong>Trong kho này:</strong> hôm nay <code>src/</code> chưa có lời gọi multipart nào (tệp lớn nhất là đính kèm chat, trần 25 MB, đi một PUT).</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-1-4-bat-dong-bo" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 1.4 — Bất đồng bộ: callback, Promise, async/await</span><span class="lc-sub">Promise.all — thứ làm các part thật sự đi song song</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-3-stream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.3 — Stream: thí nghiệm với file 348 MB</span><span class="lc-sub">Đọc tệp lớn từng khúc thay vì nạp cả vào bộ nhớ</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multipart upload</span><span class="v">Chia file lớn thành part, upload parallel, stitch atomic.</span></div>
  <div class="kv"><span class="k">Part</span><span class="v">Chunk 5 MB–5 GB (trừ part cuối, mọi part ≥ 5 MB); tối đa 10.000 part mỗi object.</span></div>
  <div class="kv"><span class="k">Upload class</span><span class="v">Helper <code>@aws-sdk/lib-storage</code> tự quản part và retry.</span></div>
  <div class="kv"><span class="k">CreateMultipartUpload / UploadPart / CompleteMultipartUpload</span><span class="v">Ba command mà helper bọc lại.</span></div>
  <div class="kv"><span class="k">Orphaned upload</span><span class="v">Multipart upload dở vẫn bị tính tiền tới khi abort.</span></div>
  <div class="kv"><span class="k">AbortIncompleteMultipartUpload</span><span class="v">Action lifecycle dọn mồ côi sau N ngày.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>File ≥100 MB đi multipart: part 5 MB–5 GB, nên từ 10 MB (max 10.000), upload parallel và stitch atomic.</li><li>Dùng SDK <code>Upload</code> class thay vì tự viết ba command.</li><li>Multipart upload bỏ dở vẫn tốn tiền — một lifecycle rule phải abort chúng (7 ngày ở đây).</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SDK — @aws-sdk/lib-storage</span><span class="lc-sub">github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage — high-level Upload helper.</span></span></div>
</div>
`,
    },

    {
      title: '1.4 — Chapter 1 quiz|||1.4 — Kiểm tra Chương 1',
      slug: 'os-1-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu, sáu phút. Về SDK v3, R2 client init, core operations, multipart.',
      content: `
<div class="ml-en"><span class="eyebrow">Chapter 1 · Quiz</span><h2>What Chapter 1 established</h2><p class="lead">Four questions on the S3 API essentials.</p></div>
<div class="ml-vi"><span class="eyebrow">Chương 1 · Kiểm tra</span><h2>Chương 1 đã dựng được gì</h2><p class="lead">Bốn câu về S3 API essentials.</p></div>
`,
      quiz: {
        timeLimitSeconds: 360,
        questions: [
          {
            question: 'Why does this repo use lazy initialization for R2 client?|||Vì sao kho này dùng lazy initialization cho R2 client?',
            options: [
              'So the app boots without R2 credentials (test suite, contributor local dev). Only calling getR2Client() throws when credentials missing|||Để app boot mà không cần R2 credential (test suite, contributor local dev). Chỉ khi call getR2Client() mới throw khi thiếu credential',
              'Performance — first call is faster|||Performance — call đầu nhanh hơn',
              'Required by AWS SDK|||AWS SDK bắt buộc',
              'To reduce memory|||Giảm memory',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'PutObject without ContentType. What happens when browser fetches the file?|||PutObject không có ContentType. Chuyện gì khi browser fetch file?',
            options: [
              'Content-Type defaults to application/octet-stream — browser downloads instead of displaying. Audio/video tags reject. Always set ContentType|||Content-Type default là application/octet-stream — browser download thay vì hiển thị. Audio/video tags reject. Luôn set ContentType',
              'Nothing — browser auto-detects|||Không gì — browser tự detect',
              'Object rejected|||Object bị reject',
              'Defaults to text/html|||Default là text/html',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'DeleteObjectsCommand for 5 keys, only 2 exist. Response?|||DeleteObjectsCommand cho 5 key, chỉ 2 tồn tại. Response?',
            options: [
              'Success — missing keys are ignored like rm -f, and they are still listed in response.Deleted (Errors empty), so Deleted does not count what existed|||Success — key thiếu bị bỏ qua như rm -f, và vẫn được liệt kê trong response.Deleted (Errors rỗng), nên Deleted không đếm được cái đã tồn tại',
              'Error 404|||Error 404',
              'Partial error|||Partial error',
              'All 5 marked as errored|||Cả 5 marked errored',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'When to use multipart upload vs single PutObject?|||Khi nào dùng multipart vs single PutObject?',
            options: [
              'Files >=100 MB use multipart (resumable, parallel, up to 5 TB). Files <100 MB use single PutObject (less overhead). Use SDK Upload class instead of hand-writing the 3-step flow|||File >=100 MB dùng multipart (resumable, parallel, tới 5 TB). File <100 MB dùng single PutObject (ít overhead). Dùng SDK Upload class thay tự viết flow 3-step',
              'Always multipart|||Luôn multipart',
              'Only for videos|||Chỉ cho video',
              'Never — S3 handles automatically|||Không bao giờ — S3 tự lo',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
