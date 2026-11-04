const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';

export default {
  title: 'Section 0 — What object storage actually is|||Mục 0 — Object storage THẬT SỰ LÀ gì',
  slug: 'os-s0-intro',
  description: 'Ba bài về concept cơ bản: object storage ≠ file system, bucket/key/object model, S3 API là chuẩn de facto, R2 vs S3 vs GCS vs Azure Blob.',
  sortOrder: 1,
  lessons: [

    {
      title: '0.1 — Object storage vs file system: three differences|||0.1 — Object storage vs file system: ba khác biệt',
      slug: 'os-0-1-vs-fs',
      type: 'VIDEO',
      description: 'Không có directory tree. Không có partial updates. Không có POSIX permissions. Ba khác biệt này giải thích 90% quyết định thiết kế của S3/R2.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Object storage vs file system: three differences</h2>
<p class="lead">You know files. Object storage looks similar (URLs like paths, uploads that feel like writes) but the three deepest differences flip 90% of your intuitions about how to use it.</p>

<h3>Difference 1: no directory tree, only flat keys</h3>
<pre><code class="language-text">Filesystem: /home/user/photos/2026/vacation/beach.jpg
  - directory /photos exists as an entity
  - can list /photos to see all children
  - can rename /photos/2026 -&gt; /photos/2025

Object storage: photos/2026/vacation/beach.jpg
  - "photos/", "photos/2026/" DO NOT exist as entities
  - the "/" in the key is just a character
  - listing "photos/" is a PREFIX SCAN of all keys — expensive at scale
  - renaming a "directory" = copy + delete every object under it
</code></pre>

<div class="callout warn">
<p><strong>Prefix listing is O(N) in the number of matching keys.</strong> Fine for hundreds. Awful for millions. Design keys so you never need to list — track them in your DB.</p>
</div>

<h3>Difference 2: no partial updates</h3>
<pre><code class="language-text">Filesystem: fs.writeSync(fd, buf, offset)  — write to middle of file
Object storage: NO. Must upload the WHOLE new version.

Exception: multipart upload for LARGE files (5MB-5TB parts)
  - Upload part 1, part 2, ..., then complete
  - S3 stitches them into ONE final object atomically
  - Still an atomic replace at the end; can't edit an existing object
</code></pre>

<h3>Difference 3: no POSIX permissions, only bucket policy</h3>
<pre><code class="language-text">Filesystem: chmod, chown, ACL per file/directory
Object storage: 
  - Bucket-level: public/private, IAM policy
  - Object-level: ACL (deprecated in modern S3), signed URLs
  - Auth is via API keys or IAM roles, not user IDs
</code></pre>

<div class="callout ok">
<p><strong>Three differences =&gt; three design patterns.</strong> (1) Store keys in DB, don&#39;t list. (2) Version by uploading new keys, don&#39;t edit. (3) Auth via signed URLs, not per-user ACL.</p>
</div>

<h3>What object storage IS good for</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Immutable blobs</span><span class="lz-lnote">Images, videos, audio, PDFs. Upload once, serve many times. Never edit</span></div>
<div class="lz-layer"><span class="lz-lname">Large files</span><span class="lz-lnote">Multipart upload handles 5 TB per object. No RAM limit on server</span></div>
<div class="lz-layer"><span class="lz-lname">Global CDN delivery</span><span class="lz-lnote">Bucket + custom domain = geographically distributed serving via edge</span></div>
<div class="lz-layer"><span class="lz-lname">Backup</span><span class="lz-lnote">Cheap ($0.015/GB/month R2), durable (11 9s), versioned</span></div>
</div>

<h3>What it is NOT good for</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Mutable state</span><span class="lz-lnote">Don&#39;t use as a database. Every write is a full-object replace</span></div>
<div class="lz-layer"><span class="lz-lname">Low-latency reads</span><span class="lz-lnote">First-byte latency 50-200ms typical. CDN edge caches help but origin is slow</span></div>
<div class="lz-layer"><span class="lz-lname">Complex queries</span><span class="lz-lnote">No SQL, no full-text search. Some services offer S3 Select but limited</span></div>
</div>

<div class="pitfall">
<p><strong>Pitfall — treating S3 like a filesystem via mounts.</strong> s3fs-fuse, s3ql — they mount an S3 bucket as a filesystem. Every read = HTTP GET. Every write = full-object PUT. Latency 50-200ms per op instead of &lt;1ms. Use for archival mount ONLY, not application workload.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Object storage is a distributed, immutable, flat key-value blob store — three properties (no directories, no partial writes, no POSIX perms) that flip most filesystem intuitions and shape every S3 API decision.</p>
</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>On a bucket (or local MinIO) PUT three objects with slash-containing keys: <code>photos/2026/a.jpg</code>, <code>photos/2026/b.jpg</code>, <code>docs/readme.txt</code>.</li>
<li>Run <code>ListObjectsV2</code> with <code>Prefix: "photos/"</code>. It returns two keys as a PREFIX SCAN — confirm there is no <code>photos/</code> entity, only keys that happen to share a string.</li>
<li>&quot;Rename&quot; <code>photos/2026/</code> to <code>photos/2025/</code>: find that there is no rename API — you must <code>CopyObject</code> each key to the new key, then <code>DeleteObject</code> the old.</li>
<li>Try to change bytes 100–200 of an existing object: confirm there is no partial write — you must <code>PutObject</code> the whole new version.</li>
</ol>
<p><strong>Done when:</strong> you saw that &quot;/&quot; is just a character (prefix scan, not a directory), and that rename = copy + delete while an edit = full-object replace.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Flat key namespace</span><span class="v">Keys are strings; the &quot;/&quot; is a character, not a folder.</span></div>
  <div class="kv"><span class="k">Prefix scan</span><span class="v">Listing by prefix is O(N) over matching keys — expensive at scale.</span></div>
  <div class="kv"><span class="k">Immutable object</span><span class="v">You replace a whole object; you never edit it in place.</span></div>
  <div class="kv"><span class="k">Multipart upload</span><span class="v">Splits a large file into parts, stitched into one final atomic object.</span></div>
  <div class="kv"><span class="k">Bucket policy</span><span class="v">Access is policy + API keys + signed URLs, not POSIX chmod/chown.</span></div>
  <div class="kv"><span class="k">ETag</span><span class="v">An object's content fingerprint (MD5 for simple uploads only).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>No directory tree — &quot;/&quot; in a key is just a character; listing a prefix is an O(N) scan.</li><li>No partial updates — every write replaces the whole object (multipart only stitches parts, still atomic).</li><li>No POSIX permissions — access is bucket policy + API keys + signed URLs, not per-user chmod.</li><li>Track keys in your database so you never have to list the bucket.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — What is object storage?</span><span class="lc-sub">aws.amazon.com/what-is/object-storage — introduction from Amazon, matches this lesson.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 2 — R2 specifics</span><span class="lc-sub">/courses/object-storage/learn${REF} — how Cloudflare R2 differs from S3 despite compatibility.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Object storage vs file system: ba khác biệt</h2>
<p class="lead">Bạn biết file. Object storage nhìn giống (URL như path, upload như write) nhưng ba khác biệt sâu nhất lật 90% trực giác của bạn về cách dùng.</p>

<h3>Khác biệt 1: không directory tree, chỉ flat key</h3>
<pre><code class="language-text">Filesystem: /home/user/photos/2026/vacation/beach.jpg
  - directory /photos ton tai la mot entity
  - list /photos thay het con
  - rename /photos/2026 -&gt; /photos/2025

Object storage: photos/2026/vacation/beach.jpg
  - "photos/", "photos/2026/" KHONG ton tai la entity
  - dau "/" trong key chi la ky tu
  - list "photos/" la PREFIX SCAN moi key — dat o scale
  - rename mot "directory" = copy + delete moi object ben duoi
</code></pre>

<div class="callout warn">
<p><strong>Prefix listing là O(N) theo số key match.</strong> OK cho hàng trăm. Kinh khủng cho triệu. Design key sao bạn không bao giờ cần list — track chúng trong DB.</p>
</div>

<h3>Khác biệt 2: không partial update</h3>
<pre><code class="language-text">Filesystem: fs.writeSync(fd, buf, offset)  — write vao giua file
Object storage: KHONG. Phai upload TOAN BO version moi.

Ngoai le: multipart upload cho file LON (5MB-5TB part)
  - Upload part 1, part 2, ..., roi complete
  - S3 gheo lai thanh MOT final object atomically
  - Van la atomic replace cuoi cung; khong edit object hien tai
</code></pre>

<h3>Khác biệt 3: không POSIX permission, chỉ bucket policy</h3>
<pre><code class="language-text">Filesystem: chmod, chown, ACL per file/directory
Object storage: 
  - Bucket-level: public/private, IAM policy
  - Object-level: ACL (deprecated in modern S3), signed URLs
  - Auth via API key hoac IAM role, khong per-user ID
</code></pre>

<div class="callout ok">
<p><strong>Ba khác biệt =&gt; ba design pattern.</strong> (1) Lưu key trong DB, đừng list. (2) Version bằng cách upload key mới, đừng edit. (3) Auth qua signed URL, không per-user ACL.</p>
</div>

<h3>Object storage TỐT cho</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Immutable blob</span><span class="lz-lnote">Ảnh, video, audio, PDF. Upload một lần, serve nhiều lần. Không edit</span></div>
<div class="lz-layer"><span class="lz-lname">File lớn</span><span class="lz-lnote">Multipart upload handle 5 TB per object. Không limit RAM server</span></div>
<div class="lz-layer"><span class="lz-lname">CDN delivery toàn cầu</span><span class="lz-lnote">Bucket + custom domain = phân phối địa lý qua edge</span></div>
<div class="lz-layer"><span class="lz-lname">Backup</span><span class="lz-lnote">Rẻ ($0.015/GB/month R2), durable (11 9s), versioned</span></div>
</div>

<h3>KHÔNG tốt cho</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Mutable state</span><span class="lz-lnote">Đừng dùng làm database. Mỗi write là full-object replace</span></div>
<div class="lz-layer"><span class="lz-lname">Low-latency read</span><span class="lz-lnote">First-byte latency 50-200ms tuỳ nơi. CDN edge cache giúp nhưng origin chậm</span></div>
<div class="lz-layer"><span class="lz-lname">Query phức tạp</span><span class="lz-lnote">Không SQL, không full-text search. Vài service có S3 Select nhưng giới hạn</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — treat S3 như filesystem qua mount.</strong> s3fs-fuse, s3ql — mount bucket S3 như filesystem. Mỗi read = HTTP GET. Mỗi write = full-object PUT. Latency 50-200ms per op thay vì &lt;1ms. Dùng cho archival mount THÔI, không application workload.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Object storage là distributed, immutable, flat key-value blob store — ba property (không directory, không partial write, không POSIX perms) lật hầu hết trực giác filesystem và định hình mọi quyết định S3 API.</p>
</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trên một bucket (hoặc MinIO cục bộ) PUT ba object với key có dấu gạch chéo: <code>photos/2026/a.jpg</code>, <code>photos/2026/b.jpg</code>, <code>docs/readme.txt</code>.</li>
<li>Chạy <code>ListObjectsV2</code> với <code>Prefix: "photos/"</code>. Nó trả hai key dưới dạng PREFIX SCAN — xác nhận không có entity <code>photos/</code> nào, chỉ là các key tình cờ chung một chuỗi.</li>
<li>&quot;Rename&quot; <code>photos/2026/</code> thành <code>photos/2025/</code>: thấy không có API rename — bạn phải <code>CopyObject</code> từng key sang key mới rồi <code>DeleteObject</code> key cũ.</li>
<li>Thử đổi byte 100–200 của một object có sẵn: xác nhận không có partial write — bạn phải <code>PutObject</code> toàn bộ version mới.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn thấy &quot;/&quot; chỉ là một ký tự (prefix scan, không phải thư mục), và rename = copy + delete còn sửa = thay toàn bộ object.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Flat key namespace</span><span class="v">Key là chuỗi; dấu &quot;/&quot; là ký tự, không phải thư mục.</span></div>
  <div class="kv"><span class="k">Prefix scan</span><span class="v">List theo prefix là O(N) trên các key khớp — đắt ở scale.</span></div>
  <div class="kv"><span class="k">Immutable object</span><span class="v">Bạn thay cả object; không bao giờ sửa tại chỗ.</span></div>
  <div class="kv"><span class="k">Multipart upload</span><span class="v">Chia file lớn thành part, ghép thành một object cuối nguyên tử.</span></div>
  <div class="kv"><span class="k">Bucket policy</span><span class="v">Quyền là policy + API key + signed URL, không phải chmod/chown POSIX.</span></div>
  <div class="kv"><span class="k">ETag</span><span class="v">Vân tay nội dung của object (MD5 chỉ với upload đơn giản).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Không có cây thư mục — &quot;/&quot; trong key chỉ là ký tự; list một prefix là quét O(N).</li><li>Không partial update — mỗi write thay cả object (multipart chỉ ghép part, vẫn nguyên tử).</li><li>Không quyền POSIX — truy cập là bucket policy + API key + signed URL, không phải chmod theo user.</li><li>Track key trong database để không bao giờ phải list bucket.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — What is object storage?</span><span class="lc-sub">aws.amazon.com/what-is/object-storage — introduction từ Amazon, khớp bài này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 2 — R2 specifics</span><span class="lc-sub">/courses/object-storage/learn${REF} — cách Cloudflare R2 khác S3 dù compatible.</span></span></div>
</div>
`,
    },

    {
      title: '0.2 — Bucket, key, object: the three-level model|||0.2 — Bucket, key, object: mô hình ba tầng',
      slug: 'os-0-2-model',
      type: 'VIDEO',
      description: 'Bucket là container. Key là identifier UNIQUE trong bucket. Object là data + metadata. Chỉ ba concept — đơn giản mà mạnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Bucket, key, object: the three-level model</h2>
<p class="lead">Every S3-compatible service uses the same three concepts. Learning them well makes every API call obvious.</p>

<h3>The three</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Bucket</span><span class="lz-nsub">container, global unique name</span></span>
<span class="lz-nbody">Top-level container. In AWS S3, bucket name is GLOBALLY unique across all accounts. In R2, unique per Cloudflare account. Named at creation, never renamed.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Key</span><span class="lz-nsub">identifier within bucket</span></span>
<span class="lz-nbody">String, up to 1024 UTF-8 bytes. Any characters (including &quot;/&quot;). The primary key of the object.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Object</span><span class="lz-nsub">data + metadata + ETag</span></span>
<span class="lz-nbody">The actual blob. Size 0 to 5 TB. Content-Type, Cache-Control, x-amz-meta-* custom metadata. ETag = MD5 of content (mostly).</span>
</div>
</div>

<h3>This repo — key naming</h3>
<pre><code class="language-ts">// upload.service.ts
&#96;users/\${userId}/avatars/\${filename}&#96;
&#96;posts/\${postId}/media/\${filename}&#96;
&#96;lessons/\${courseId}/attachments/\${filename}&#96;
&#96;music/\${trackId}.mp3&#96;
</code></pre>

<div class="callout ok">
<p><strong>Convention: <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code>.</strong> Grep-friendly. When you want to delete a user&#39;s files, list prefix <code>users/42/</code>. Naturally namespaced.</p>
</div>

<h3>Bucket configuration</h3>
<pre><code class="language-text">Kho nay 1 bucket:
  cuonghoangdev-media
  
Cai gi trong bucket:
  - Public bucket (custom domain: media.cuongthai.com)
  - Cloudflare CDN caching
  - Versioning: OFF (dua vao DB tracking)
  - Lifecycle: none (files song mai)
</code></pre>

<h3>Object metadata — two kinds</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">system</span><span class="lz-t">Content-Type, Content-Length, ETag, Last-Modified</span><span class="lz-d">Standard HTTP metadata + S3 internals. Cache-Control is here — critical for CDN behavior.</span></div>
<div class="lz-step"><span class="lz-k">user</span><span class="lz-t">x-amz-meta-anything</span><span class="lz-d">Custom key-value pairs. Total size &lt;2 KB. Uses: tags, source URLs, upload timestamps. This repo does not use them — it tracks that in the database instead.</span></div>
</div>

<h3>ETag — hash of content</h3>
<pre><code class="language-ts">// PUT object -&gt; response includes ETag
const res = await client.send(new PutObjectCommand({ ... }));
console.log(res.ETag);   // "d41d8cd98f00b204e9800998ecf8427e"

// Simple upload: ETag = MD5 hash (mostly)
// Multipart upload: ETag = HASH-N where N = part count (not simple MD5)
// Server-side encryption: ETag = opaque, NOT MD5
</code></pre>

<div class="callout warn">
<p><strong>Do not rely on the ETag being an MD5.</strong> For a multipart upload, or with server-side encryption, the ETag is NOT an MD5. If you need a content hash for deduplication, compute MD5/SHA256 client-side and store it in the metadata or in your database.</p>
</div>

<h3>This repo tracks objects in Postgres</h3>
<pre><code class="language-prisma">// prisma/schema.prisma
model MediaFile {
  id         Int      @id @default(autoincrement())
  key        String   @unique       // "users/42/avatars/x.jpg"
  bucket     String                 // "cuonghoangdev-media"
  url        String                 // "https://media.cuongthai.com/users/42/avatars/x.jpg"
  size       Int                    // bytes
  mimeType   String
  uploadedBy Int
  createdAt  DateTime @default(now())
}
</code></pre>

<p>When you need to &quot;delete a user&#39;s files&quot;, query the database by <code>uploadedBy</code> then DELETE the objects by key. Do NOT list the bucket.</p>

<div class="pitfall">
<p><strong>Trap — using a key containing whitespace or emoji.</strong> S3 accepts it, but the URL encoding gets complicated. <code>https://media/logo tết.png</code> → the browser encodes, the server decodes. If the key contains &quot;+&quot; or &quot;#&quot;, the two encodings disagree. Stick to ASCII alphanumerics plus <code>-</code>, <code>_</code>, <code>/</code>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Bucket (a globally unique container) + key (up to 1024 UTF-8 bytes, unique within the bucket) + object (data + system metadata + user metadata + ETag) — three simple concepts that every S3 API operation rests on; this repo tracks them in a Postgres MediaFile table so it never has to list the bucket.</p>
</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>PUT an object with an explicit <code>ContentType</code> and <code>CacheControl</code>, then <code>HeadObject</code> it and read back the system metadata (Content-Type, Content-Length, ETag, Last-Modified).</li>
<li>PUT an object carrying a custom user-metadata header <code>x-amz-meta-source</code>; <code>HeadObject</code> again and confirm it round-trips under <code>Metadata</code>.</li>
<li>Compare ETags: a small single-part PUT (ETag = MD5) vs a multipart upload (ETag = <code>hash-N</code>) — note they differ in form.</li>
<li>Open <code>prisma/schema.prisma</code> in this repo and map each <code>MediaFile</code> column (key, bucket, size, mimeType) to what you just read off the object.</li>
</ol>
<p><strong>Done when:</strong> you read both system and user metadata off a real object, and can explain why the ETag is not always an MD5.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bucket</span><span class="v">The top-level container; globally unique name, set at creation, never renamed.</span></div>
  <div class="kv"><span class="k">Key</span><span class="v">The object's identifier within a bucket, up to 1024 UTF-8 bytes.</span></div>
  <div class="kv"><span class="k">Object</span><span class="v">The blob plus its metadata and ETag; 0 to 5 TB.</span></div>
  <div class="kv"><span class="k">System metadata</span><span class="v">Content-Type, Content-Length, Cache-Control, ETag, Last-Modified.</span></div>
  <div class="kv"><span class="k">User metadata</span><span class="v">Custom <code>x-amz-meta-*</code> pairs (&lt;2 KB total).</span></div>
  <div class="kv"><span class="k">MediaFile table</span><span class="v">This repo's Postgres row per object, so it never lists the bucket.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Bucket (globally unique container) + key (&le;1024 UTF-8 bytes) + object (data + metadata + ETag) is the whole model.</li><li>A key convention like <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code> keeps objects namespaced and grep-friendly.</li><li>System metadata (Content-Type, Cache-Control, ETag...) differs from user metadata (<code>x-amz-meta-*</code>).</li><li>ETag is an MD5 only for simple uploads — not for multipart or SSE; track objects in Postgres instead of listing.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — Buckets and objects</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html — official terminology.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Bucket, key, object: mô hình ba tầng</h2>
<p class="lead">Mọi service S3-compatible dùng cùng ba concept. Học chúng thật kỹ làm mọi API call trở nên hiển nhiên.</p>

<h3>Ba concept</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Bucket</span><span class="lz-nsub">container, tên unique toàn cục</span></span>
<span class="lz-nbody">Container tầng đỉnh. AWS S3: tên bucket unique TOÀN CỤC qua mọi account. R2: unique per Cloudflare account. Đặt lúc tạo, không rename.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Key</span><span class="lz-nsub">identifier trong bucket</span></span>
<span class="lz-nbody">String, tối đa 1024 UTF-8 byte. Ký tự bất kỳ (kể cả &quot;/&quot;). Primary key của object.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Object</span><span class="lz-nsub">data + metadata + ETag</span></span>
<span class="lz-nbody">Blob thật. Size 0 đến 5 TB. Content-Type, Cache-Control, x-amz-meta-* custom metadata. ETag = MD5 của content (đa phần).</span>
</div>
</div>

<h3>Kho này — đặt tên key</h3>
<pre><code class="language-ts">// upload.service.ts
&#96;users/\${userId}/avatars/\${filename}&#96;
&#96;posts/\${postId}/media/\${filename}&#96;
&#96;lessons/\${courseId}/attachments/\${filename}&#96;
&#96;music/\${trackId}.mp3&#96;
</code></pre>

<div class="callout ok">
<p><strong>Convention: <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code>.</strong> Grep-friendly. Khi muốn delete file của user, list prefix <code>users/42/</code>. Tự nhiên namespace.</p>
</div>

<h3>Bucket configuration</h3>
<pre><code class="language-text">Kho nay 1 bucket:
  cuonghoangdev-media
  
Cai gi trong bucket:
  - Public bucket (custom domain: media.cuongthai.com)
  - Cloudflare CDN caching
  - Versioning: OFF (dua vao DB tracking)
  - Lifecycle: none (files song mai)
</code></pre>

<h3>Object metadata — hai loại</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">system</span><span class="lz-t">Content-Type, Content-Length, ETag, Last-Modified</span><span class="lz-d">Standard HTTP metadata + S3 internals. Cache-Control ở đây — critical cho CDN behavior.</span></div>
<div class="lz-step"><span class="lz-k">user</span><span class="lz-t">x-amz-meta-anything</span><span class="lz-d">Custom key-value pair. Tổng size &lt;2 KB. Uses: tags, source URLs, upload timestamps. Kho này không dùng — track trong DB.</span></div>
</div>

<h3>ETag — hash của content</h3>
<pre><code class="language-ts">// PUT object -&gt; response includes ETag
const res = await client.send(new PutObjectCommand({ ... }));
console.log(res.ETag);   // "d41d8cd98f00b204e9800998ecf8427e"

// Simple upload: ETag = MD5 hash (da phan)
// Multipart upload: ETag = HASH-N voi N = so part (khong simple MD5)
// Server-side encryption: ETag = opaque, KHONG MD5
</code></pre>

<div class="callout warn">
<p><strong>Đừng rely vào ETag = MD5.</strong> Với multipart upload hoặc server-side encryption, ETag KHÔNG phải MD5. Nếu cần content hash để dedup, tính MD5/SHA256 CLIENT-side và lưu metadata hoặc DB.</p>
</div>

<h3>Kho này track object trong Postgres</h3>
<pre><code class="language-prisma">// prisma/schema.prisma
model MediaFile {
  id         Int      @id @default(autoincrement())
  key        String   @unique       // "users/42/avatars/x.jpg"
  bucket     String                 // "cuonghoangdev-media"
  url        String                 // "https://media.cuongthai.com/users/42/avatars/x.jpg"
  size       Int                    // bytes
  mimeType   String
  uploadedBy Int
  createdAt  DateTime @default(now())
}
</code></pre>

<p>Khi cần &quot;delete user&#39;s files&quot;, query DB theo <code>uploadedBy</code> rồi DELETE objects theo key. KHÔNG list bucket.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng key có whitespace hoặc emoji.</strong> S3 accept nhưng URL encoding phức tạp. <code>https://media/logo tết.png</code> → browser encode → server decode. Nếu key có &quot;+&quot; hoặc &quot;#&quot;, encoding lệch. Dùng ASCII alphanumeric + <code>-</code>, <code>_</code>, <code>/</code>.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bucket (container, unique toàn cục) + key (đến 1024 UTF-8 byte, unique trong bucket) + object (data + system metadata + user metadata + ETag) — 3 concept đơn giản mà mọi S3 API operation dựa trên; kho này track trong Postgres MediaFile table để không phải list bucket.</p>
</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>PUT một object với <code>ContentType</code> và <code>CacheControl</code> rõ ràng, rồi <code>HeadObject</code> và đọc lại system metadata (Content-Type, Content-Length, ETag, Last-Modified).</li>
<li>PUT một object mang header user-metadata <code>x-amz-meta-source</code>; <code>HeadObject</code> lại và xác nhận nó quay về dưới <code>Metadata</code>.</li>
<li>So ETag: một PUT đơn part nhỏ (ETag = MD5) vs một multipart upload (ETag = <code>hash-N</code>) — để ý khác form.</li>
<li>Mở <code>prisma/schema.prisma</code> trong kho và ánh xạ từng cột <code>MediaFile</code> (key, bucket, size, mimeType) với cái bạn vừa đọc được từ object.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đọc được cả system lẫn user metadata của một object thật, và giải thích được vì sao ETag không phải lúc nào cũng là MD5.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bucket</span><span class="v">Container tầng đỉnh; tên unique toàn cục, đặt lúc tạo, không rename.</span></div>
  <div class="kv"><span class="k">Key</span><span class="v">Định danh của object trong bucket, tối đa 1024 UTF-8 byte.</span></div>
  <div class="kv"><span class="k">Object</span><span class="v">Blob cộng metadata và ETag; từ 0 đến 5 TB.</span></div>
  <div class="kv"><span class="k">System metadata</span><span class="v">Content-Type, Content-Length, Cache-Control, ETag, Last-Modified.</span></div>
  <div class="kv"><span class="k">User metadata</span><span class="v">Cặp <code>x-amz-meta-*</code> tự đặt (&lt;2 KB tổng).</span></div>
  <div class="kv"><span class="k">MediaFile table</span><span class="v">Row Postgres mỗi object của kho này, để không phải list bucket.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bucket (container unique toàn cục) + key (&le;1024 UTF-8 byte) + object (data + metadata + ETag) là toàn bộ mô hình.</li><li>Quy ước key kiểu <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code> giữ object có namespace và dễ grep.</li><li>System metadata (Content-Type, Cache-Control, ETag...) khác user metadata (<code>x-amz-meta-*</code>).</li><li>ETag là MD5 chỉ với upload đơn giản — không với multipart hay SSE; track object trong Postgres thay vì list.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — Buckets and objects</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html — terminology chính thức.</span></span></div>
</div>
`,
    },

    {
      title: '0.3 — Section 0 quiz|||0.3 — Kiểm tra Mục 0',
      slug: 'os-0-3-quiz',
      type: 'QUIZ',
      description: 'Bốn câu, sáu phút. Về ba khác biệt object storage vs filesystem và bucket/key/object model.',
      content: `
<div class="ml-en"><span class="eyebrow">Section 0 · Quiz</span><h2>What Section 0 established</h2><p class="lead">Four questions on the core concepts — the fundamental difference between object storage and a filesystem.</p></div>
<div class="ml-vi"><span class="eyebrow">Mục 0 · Kiểm tra</span><h2>Mục 0 đã dựng được gì</h2><p class="lead">Bốn câu về concept cơ bản — sự khác biệt fundamental giữa object storage và filesystem.</p></div>
`,
      quiz: {
        timeLimitSeconds: 360,
        questions: [
          {
            question: 'You want to rename &quot;photos/2026/&quot; to &quot;photos/2025/&quot; in S3. What&#39;s the operation?|||Bạn muốn rename &quot;photos/2026/&quot; thành &quot;photos/2025/&quot; trong S3. Operation gì?',
            options: [
              'COPY each object then DELETE original — S3 has no directories, only flat keys. &quot;/&quot; is just a character. Renaming = full copy + delete of every matching object|||COPY từng object rồi DELETE gốc — S3 không có directory, chỉ flat key. &quot;/&quot; chỉ là ký tự. Rename = full copy + delete của mọi object khớp',
              'S3 has a mv command|||S3 có lệnh mv',
              'Rename the parent folder|||Rename parent folder',
              'Set an alias|||Đặt alias',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Best practice for tracking objects at scale?|||Best practice để track object ở scale?',
            options: [
              'Store keys in your DB (Postgres MediaFile table). Do NOT list buckets — prefix scan is O(N) and expensive|||Lưu key trong DB (Postgres MediaFile table). KHÔNG list bucket — prefix scan là O(N) và đắt',
              'Rely on S3 listing|||Dựa vào listing S3',
              'Use S3 tags exclusively|||Chỉ dùng tags S3',
              'Cache in Redis|||Cache trong Redis',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You want to write byte 100-200 of an existing object. What do you do in S3?|||Bạn muốn write byte 100-200 của một object có sẵn trong S3. Làm gì?',
            options: [
              'Upload the ENTIRE new version — S3 has no partial updates. Every write replaces the whole object atomically|||Upload TOÀN BỘ version mới — S3 không partial update. Mỗi write replace nguyên object atomically',
              'Use S3 Range PUT|||Dùng S3 Range PUT',
              'Modify in place with fs.write|||Modify tại chỗ với fs.write',
              'Impossible|||Không thể',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'ETag = MD5 always?|||ETag luôn = MD5?',
            options: [
              'No — only for simple single-part uploads without server-side encryption. Multipart uploads and SSE give a different opaque ETag format. Never rely on ETag = MD5|||Không — chỉ với single-part upload không server-side encryption. Multipart upload và SSE cho ETag format opaque khác. Không rely vào ETag = MD5',
              'Yes always|||Luôn luôn',
              'Only for images|||Chỉ với ảnh',
              'Only in R2|||Chỉ ở R2',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
