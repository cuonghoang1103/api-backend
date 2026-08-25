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
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Client initialization: SDK v3</h2>
<p class="lead">AWS SDK v3 is modular — import only what you use. This repo shows a lazy-init pattern that lets the app boot even without R2 credentials (test environments, contributor local dev).</p>

<h3>Package installation</h3>
<pre><code class="language-bash">$ npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
</code></pre>

<p>Two packages: <code>client-s3</code> for operations, <code>s3-request-presigner</code> for signed URLs. Together ~450 KB (v2 was ~40 MB monolithic).</p>

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
<pre><code class="language-ts">// src/config/env.ts
r2: {
  bucketName:      process.env.R2_BUCKET_NAME,
  endpoint:        process.env.R2_ENDPOINT_URL,      // https://xxx.r2.cloudflarestorage.com
  accessKeyId:     process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  publicUrlBase:   process.env.R2_PUBLIC_URL_BASE,   // https://media.cuongthai.com
},
</code></pre>

<p>Four env vars: bucket name (which bucket), endpoint (R2 API host), access key + secret (auth), public URL base (CDN custom domain).</p>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>endpoint</code> as a public URL.</strong> <code>R2_ENDPOINT_URL</code> là <em>API</em> endpoint (<code>xxx.r2.cloudflarestorage.com</code>) — it is uncached and egress is expensive. The public URL must be a custom domain fronted by a CDN. These are two different things; store both separately.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> SDK v3 modular install (client-s3 + s3-request-presigner, ~450 KB total); lazy init pattern lets app boot without R2 credentials; R2-specific config = <code>region: &#39;auto&#39;</code> + <code>forcePathStyle: false</code>; keep API endpoint (for upload) separate from public URL (for serving via CDN).</p>
</div>

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

<p>Hai package: <code>client-s3</code> cho operation, <code>s3-request-presigner</code> cho signed URL. Cả hai ~450 KB (v2 là ~40 MB monolithic).</p>

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
<pre><code class="language-ts">// src/config/env.ts
r2: {
  bucketName:      process.env.R2_BUCKET_NAME,
  endpoint:        process.env.R2_ENDPOINT_URL,      // https://xxx.r2.cloudflarestorage.com
  accessKeyId:     process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  publicUrlBase:   process.env.R2_PUBLIC_URL_BASE,   // https://media.cuongthai.com
},
</code></pre>

<p>Bốn env var: bucket name (bucket nào), endpoint (R2 API host), access key + secret (auth), public URL base (CDN custom domain).</p>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>endpoint</code> làm public URL.</strong> <code>R2_ENDPOINT_URL</code> là <em>API</em> endpoint (<code>xxx.r2.cloudflarestorage.com</code>) — không cache, egress cost cao. Public URL phải là custom domain qua CDN. Đây là 2 khác nhau. Lưu cả hai riêng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> SDK v3 modular install (client-s3 + s3-request-presigner, ~450 KB total); pattern lazy init cho app boot mà không cần R2 credential; config R2-specific = <code>region: &#39;auto&#39;</code> + <code>forcePathStyle: false</code>; giữ API endpoint (cho upload) riêng public URL (cho serving qua CDN).</p>
</div>

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
<p><strong><code>ContentType</code> is mandatory.</strong> Without it, S3 defaults to <code>application/octet-stream</code> → the browser downloads the file instead of displaying it. <code>&lt;audio&gt;</code>/<code>&lt;video&gt;</code> tag REJECT sai type.</p>
</div>

<h3>GetObject — download</h3>
<pre><code class="language-ts">import { GetObjectCommand } from '@aws-sdk/client-s3';

const res = await client.send(new GetObjectCommand({
  Bucket, Key: 'x.jpg',
}));

// res.Body is a stream (Readable)
const buffer = Buffer.concat(await res.Body.transformToWebStream().getReader().read());
// hoac helper:
const text = await res.Body.transformToString();
</code></pre>

<p>This repo does NOT use <code>getObject</code> server-side — public files are served straight from the CDN. GetObject is only used for private files and for thumbnail generation.</p>

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
<p><strong>Bẫy — DeleteObjectsCommand không error khi object không tồn tại.</strong> If you expect &quot;deleted 5 objects&quot; but only 2 existed, the response is still a success. Read the response.Deleted array to find out what actually happened.</p>
</div>

<h3>Error handling</h3>
<pre><code class="language-ts">try {
  await putObject(...);
} catch (err) {
  if (err.name === 'NoSuchBucket') { ... }
  if (err.name === 'AccessDenied') { ... }
  if (err.name === 'RequestTimeoutException') { ... retry ... }
  // Log err.$metadata.httpStatusCode + err.name
}
</code></pre>

<div class="callout">
<p><strong>One sentence.</strong> Four core operations: PutObject (upload, with ContentType + CacheControl MANDATORY), GetObject (streams the body; this repo rarely uses it because of the CDN), HeadObject (metadata only, cheap), and DeleteObject/DeleteObjects (batches of up to 1000, silent on missing keys) — 90% of S3 code uses only these four.</p>
</div>

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
<p><strong><code>ContentType</code> là bắt buộc.</strong> Không có → S3 default <code>application/octet-stream</code> → browser download thay vì display. <code>&lt;audio&gt;</code>/<code>&lt;video&gt;</code> tag REJECT sai type.</p>
</div>

<h3>GetObject — download</h3>
<pre><code class="language-ts">import { GetObjectCommand } from '@aws-sdk/client-s3';

const res = await client.send(new GetObjectCommand({
  Bucket, Key: 'x.jpg',
}));

// res.Body la stream (Readable)
const buffer = Buffer.concat(await res.Body.transformToWebStream().getReader().read());
// hoac helper:
const text = await res.Body.transformToString();
</code></pre>

<p>Kho này KHÔNG dùng <code>getObject</code> server-side — public files serve trực tiếp qua CDN. GetObject chỉ dùng cho private files hoặc thumbnail generation.</p>

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
<p><strong>Bẫy — DeleteObjectsCommand không error khi object không tồn tại.</strong> Nếu bạn expect &quot;deleted 5 objects&quot; nhưng chỉ 2 tồn tại, response vẫn ok. Check response.Deleted array để biết chính xác.</p>
</div>

<h3>Error handling</h3>
<pre><code class="language-ts">try {
  await putObject(...);
} catch (err) {
  if (err.name === 'NoSuchBucket') { ... }
  if (err.name === 'AccessDenied') { ... }
  if (err.name === 'RequestTimeoutException') { ... retry ... }
  // Log err.$metadata.httpStatusCode + err.name
}
</code></pre>

<div class="callout">
<p><strong>Một câu.</strong> Bốn core operation: PutObject (upload với ContentType + CacheControl BẮT BUỘC), GetObject (stream body, kho này ít dùng vì CDN), HeadObject (chỉ metadata, rẻ), DeleteObject/DeleteObjects (batch tới 1000, silent khi missing) — 90% code S3 chỉ dùng bốn cái này.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Multipart upload for large files</h2>
<p class="lead">Single PutObject caps around 5 GB. Even at 100 MB, network drops mid-upload = start over. Multipart splits into 5MB-5GB parts, uploads independently, and completes as one atomic object.</p>

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

  // 2. Upload parts (parallel)
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
<p><strong>Bẫy — dùng multipart cho file &lt;100 MB.</strong> Three API calls instead of one, so latency is worse for small files. Rule of thumb: a single PUT below 100 MB, multipart at 100 MB and above.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Multipart upload splits a file of 100 MB or more into parts of 10 MB-5 GB (max 10,000 parts), uploads them in parallel, and stitches them atomically with three commands; use the SDK <code>Upload</code> class rather than writing it yourself; abandoned uploads keep costing money — add a lifecycle rule that aborts them after 7 days.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS SDK — @aws-sdk/lib-storage</span><span class="lc-sub">github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage — high-level Upload helper.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Multipart upload cho file lớn</h2>
<p class="lead">Single PutObject cap khoảng 5 GB. Kể cả ở 100 MB, network drop giữa chừng = start lại. Multipart chia thành 5MB-5GB part, upload độc lập, complete atomic thành one object.</p>

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

  // 2. Upload parts (parallel)
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
<p><strong>Một câu.</strong> Multipart upload chia file &gt;=100 MB thành part 10 MB-5 GB (max 10.000 part), upload parallel, stitch atomic với 3 command; dùng SDK <code>Upload</code> class thay tự viết; abandoned upload chiếm cost — add lifecycle rule abort sau 7 ngày.</p>
</div>

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
              'Success — S3 silently ignores missing objects (like rm -f). Check response.Deleted array for actual count|||Success — S3 silently ignore object missing (như rm -f). Check response.Deleted array cho count chính xác',
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
